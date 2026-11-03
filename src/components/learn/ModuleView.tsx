import { useState, useCallback, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { m, AnimatePresence } from 'framer-motion';
import type { CurriculumModule, CurriculumUnit, CurriculumLevel } from '../../core/types/curriculum';
import type { ExerciseDefinition } from '../../core/types/exercise';
import { getNextModuleInLevel, getPreviousModuleInLevel } from '../../data/curriculumLoader';
import { findQuotedQueries } from '../../utils/theoryQuery';
import { LearnBreadcrumb } from './LearnBreadcrumb';
import { Button, IconButton } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ExerciseRunner, type ItemOutcome } from './exercises/ExerciseRunner';
import { passMark } from './exercises/scoring';
import { ReportMistakeLink } from './ReportMistakeLink';
import { Confetti } from './Confetti';
import { useSongReferences } from '../../hooks/useSongReferences';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useAppStore } from '../../state/store';
import { SPRING_BOUNCY } from '../../design/tokens/motion';
import { accentText } from '../../design/tokens/learnColors';
import { InlineTryThis } from './lesson/InlineTryThis';
import { SectionRail, SectionPicker, type LessonSection } from './lesson/SectionNav';
import { ResultScreen, type ResultAction } from './lesson/ResultScreen';
import { conceptForQuestion } from './lesson/rereadSection';
import { pairsWithLevel } from './lesson/levelPairs';
import type { ContentLanguage } from '../../i18n/content/types';
import { showLessonQuery } from '../../services/lessonInstrument';
import { foldDockForLesson, foldDockAfterLesson } from '../../services/lessonDock';
import {
  useLearnSessionStore,
  fingerprintsOf,
  restorableCheck,
  type RunSnapshot,
} from '../../state/learnSessionStore';

/** Wide enough for the rail beside the text (below it, the phone picker). */
const RAIL_QUERY = '(min-width: 1024px)';

function renderTaskInstruction(instruction: string, onTryQuery: (query: string) => void, accent: string, openQuery: string | null): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  // Every quoted token that names something the app can show becomes a
  // button, in any language and anywhere in the sentence (W9-01). It now
  // opens the Try-This IN PLACE, under the task (W4b).
  for (const { index, length, query } of findQuotedQueries(instruction)) {
    if (index > lastIndex) parts.push(instruction.slice(lastIndex, index));
    parts.push(
      <button
        key={`${index}-${query}`}
        type="button"
        aria-expanded={openQuery === query}
        onClick={(e) => {
          e.stopPropagation();
          onTryQuery(query);
        }}
        className="inline-flex items-baseline font-medium rounded px-1 py-0.5 -my-0.5 transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
        style={{ color: accentText(accent), backgroundColor: `${accent}0d` }}
      >
        &lsquo;{query}&rsquo;
      </button>,
    );
    lastIndex = index + length;
  }
  if (lastIndex < instruction.length) parts.push(instruction.slice(lastIndex));
  return parts.length > 0 ? parts : [instruction];
}

/** The scrolling Learn region this screen lives in (LearnView's). */
function scrollerOf(el: HTMLElement | null): HTMLElement | null {
  return el?.closest<HTMLElement>('[data-learn-scroll]') ?? null;
}

type Mode = 'lesson' | 'check' | 'result';
type RunKind = 'check' | 'review' | 'practice';

interface Run {
  key: number;
  kind: RunKind;
  exercises: ExerciseDefinition[];
  resume?: RunSnapshot;
}

interface ModuleViewProps {
  module: CurriculumModule;
  unit: CurriculumUnit;
  level: CurriculumLevel;
  unitIndex: number;
  moduleIndex: number;
  isModuleCompleted: boolean;
  isTaskCompleted: (moduleId: string, taskId: string) => boolean;
  completedTaskCount: number;
  exercises: ExerciseDefinition[];
  /** Delivery state of the exercise payload — completion stays blocked until 'ready' */
  exercisesState: 'loading' | 'ready' | 'error';
  onRetryExercises?: () => void;
  exercisesPassed: boolean;
  /** A spaced-repetition review: straight into the check, no lesson. */
  isReviewMode?: boolean;
  /** Number of modules already completed in this level (before this action) */
  levelCompletedModuleCount: number;
  onToggleTask: (moduleId: string, taskId: string) => void;
  onCompleteModule: (moduleId: string) => void;
  onRecordExerciseResult: (exerciseId: string, score: 0 | 0.5 | 1) => void;
  onExercisesComplete: (passed: boolean) => void;
  onBack: () => void;
  onBackToLevels: () => void;
  onNavigateModule: (moduleId: string) => void;
  /** Open the lesson (from a review) at a section. */
  onOpenLesson?: (section: string) => void;
  /** The section to open at (a restored position, or "Re-read ›" from a review). */
  initialSection?: string | null;
  /** Legacy hook kept for callers that still pass it; level celebrations now run in LearnView. */
  onLevelComplete?: () => void;
}

export function ModuleView({
  module,
  unit,
  level,
  unitIndex: _unitIndex,
  moduleIndex,
  isModuleCompleted,
  isTaskCompleted,
  completedTaskCount,
  exercises,
  exercisesState,
  onRetryExercises,
  exercisesPassed,
  isReviewMode = false,
  levelCompletedModuleCount: _levelCompletedModuleCount,
  onToggleTask,
  onCompleteModule,
  onRecordExerciseResult,
  onExercisesComplete,
  onBack,
  onBackToLevels,
  onNavigateModule,
  onOpenLesson,
  initialSection = null,
}: ModuleViewProps) {
  const { t, i18n } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(false);
  const accent = level.accentColor;
  const prevModule = getPreviousModuleInLevel(module.id, level);
  const nextModule = getNextModuleInLevel(module.id, level);
  const allTasksDone = completedTaskCount >= module.tasks.length;
  const hasExercises = exercises.length > 0;
  const canComplete = allTasksDone && exercisesState === 'ready' && (!hasExercises || exercisesPassed);
  const tasksLeft = Math.max(0, module.tasks.length - completedTaskCount);
  const songRefs = useSongReferences(module.id);
  const instrument = useAppStore((s) => s.instrument);
  const wide = useMediaQuery(RAIL_QUERY);
  const lang = (i18n.language || 'en').slice(0, 2);
  const rootRef = useRef<HTMLDivElement>(null);
  const saveCheck = useLearnSessionStore((s) => s.setCheck);
  const saveSection = useLearnSessionStore((s) => s.setSection);

  // ── Sections (the rail) ───────────────────────────────────────────────────
  const sections = useMemo((): Omit<LessonSection, 'done'>[] => {
    const out: Omit<LessonSection, 'done'>[] = [{ id: 'intro', label: t('lesson.intro'), marker: '·' }];
    module.concepts.forEach((c, i) => out.push({ id: `c${i}`, label: t('lesson.conceptItem', { n: i + 1, title: c.title }), marker: String(i + 1) }));
    if (songRefs.length > 0) out.push({ id: 'songs', label: t('songRef.title'), marker: '♫' });
    if (module.tasks.length > 0) {
      out.push({
        id: 'tasks',
        label: `${t(instrument === 'guitar' ? 'lesson.tasksGuitar' : 'lesson.tasksPiano')} · ${t('lesson.taskCount', { count: module.tasks.length })}`,
        marker: '♪',
      });
    }
    out.push({
      id: 'check',
      label: hasExercises ? `${t('lesson.check')} · ${t('lesson.questionCount', { count: exercises.length })}` : t('lesson.check'),
      marker: '?',
    });
    return out;
  }, [module, songRefs.length, instrument, hasExercises, exercises.length, t]);

  const [currentSection, setCurrentSection] = useState<string>(initialSection ?? 'intro');
  const [reached, setReached] = useState(0);
  const currentIndex = Math.max(0, sections.findIndex((s) => s.id === currentSection));
  const railSections: LessonSection[] = sections.map((s, i) => ({
    ...s,
    done: s.id === 'tasks' ? allTasksDone : s.id === 'check' ? exercisesPassed || (!hasExercises && exercisesState === 'ready') : i < reached && i !== currentIndex,
  }));

  // ── Mode: lesson / focused check / result ─────────────────────────────────
  const [mode, setMode] = useState<Mode>('lesson');
  const [run, setRun] = useState<Run | null>(null);
  const [result, setResult] = useState<{ kind: RunKind; outcomes: ItemOutcome[]; passed: boolean } | null>(null);
  const runKey = useRef(0);

  const scrollTo = useCallback((id: string, smooth = true) => {
    const scroller = scrollerOf(rootRef.current);
    if (!scroller) return;
    if (id === 'top') {
      scroller.scrollTo({ top: 0 });
      return;
    }
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-section="${id}"]`);
    if (!el) return;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'start', behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }, []);

  const startRun = useCallback((kind: RunKind, list: ExerciseDefinition[], resume?: RunSnapshot) => {
    runKey.current += 1;
    setRun({ key: runKey.current, kind, exercises: list, resume });
    setResult(null);
    setMode('check');
    foldDockForLesson();
    if (!resume) {
      saveCheck({
        moduleId: module.id,
        kind,
        lang,
        fingerprints: fingerprintsOf(list),
        run: { order: [], index: 0, scores: [], items: [], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null },
        finished: false,
        at: Date.now(),
      });
    }
    requestAnimationFrame(() => scrollTo('top'));
  }, [module.id, lang, saveCheck, scrollTo]);

  // Restore a check that was under way (after a reload) — or start a review.
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current || exercisesState !== 'ready') return;
    restoredRef.current = true;
    const saved = restorableCheck(module.id, exercises, lang);
    if (saved && (saved.check.kind === 'review') === isReviewMode) {
      const kind = saved.check.kind;
      if (saved.check.finished) {
        const byId = new Map(exercises.map((ex) => [ex.id, ex]));
        const outcomes = saved.check.run.items.flatMap((i) => {
          const ex = byId.get(i.id);
          return ex ? [{ exercise: ex, answers: i.answers, score: i.score, answer: i.answer }] : [];
        });
        const earned = outcomes.reduce((n, o) => n + o.score, 0);
        runKey.current += 1;
        setRun({ key: runKey.current, kind, exercises: saved.ordered });
        setResult({ kind, outcomes, passed: earned >= outcomes.length * 0.8 });
        setMode('result');
      } else {
        startRun(kind, saved.ordered, saved.check.run);
      }
      return;
    }
    if (isReviewMode && hasExercises) startRun('review', exercises);
  }, [exercisesState, exercises, module.id, lang, isReviewMode, hasExercises, startRun]);

  // The lesson drives the instrument (D-20): folded away on opening, showing
  // the section being read (the first concept to begin with). Leaving the
  // lesson folds back whatever the lesson opened.
  useEffect(() => {
    foldDockForLesson();
    if (!isReviewMode) {
      const first = module.concepts.find((c) => !c.rhythm);
      if (first) showLessonQuery(first.tryThisQuery);
    }
    return () => foldDockAfterLesson();
  }, [module, isReviewMode]);

  useEffect(() => {
    if (mode !== 'lesson' || isReviewMode) return;
    const m = /^c(\d+)$/.exec(currentSection);
    const concept = m ? module.concepts[Number(m[1])] : null;
    if (concept && !concept.rhythm) showLessonQuery(concept.tryThisQuery);
  }, [currentSection, mode, module, isReviewMode]);

  // ── Scroll-spy: the section being read ────────────────────────────────────
  useEffect(() => {
    if (mode !== 'lesson') return;
    const scroller = scrollerOf(rootRef.current);
    if (!scroller) return;
    const ids = sections.map((s) => s.id);
    const onScroll = () => {
      const top = scroller.getBoundingClientRect().top;
      const h = scroller.clientHeight;
      let cur = ids[0];
      for (const id of ids) {
        const el = rootRef.current?.querySelector<HTMLElement>(`[data-section="${id}"]`);
        if (el && el.getBoundingClientRect().top - top <= h * 0.3) cur = id;
      }
      if (scroller.scrollHeight > h && scroller.scrollTop + h >= scroller.scrollHeight - 4) cur = ids[ids.length - 1];
      setCurrentSection(cur);
      setReached((r) => Math.max(r, ids.indexOf(cur)));
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [mode, sections]);

  // Under the sticky phone picker, keyboard focus scrolling must stop below it
  // (WCAG 2.4.11: a focused control is never hidden under it).
  useEffect(() => {
    const scroller = scrollerOf(rootRef.current);
    if (!scroller || mode !== 'lesson' || wide) return;
    scroller.style.scrollPaddingTop = '72px';
    return () => { scroller.style.scrollPaddingTop = ''; };
  }, [mode, wide]);

  // Save the section being read, so a reload comes back to it.
  useEffect(() => {
    if (mode === 'lesson') saveSection(currentSection);
  }, [currentSection, mode, saveSection]);

  // Open at a section (restored position, or "Re-read ›" from a review).
  const pendingScroll = useRef<string | null>(initialSection);
  useLayoutEffect(() => {
    if (mode !== 'lesson' || !pendingScroll.current) return;
    const id = pendingScroll.current;
    pendingScroll.current = null;
    requestAnimationFrame(() => scrollTo(id, false));
  }, [mode, scrollTo]);

  const jump = useCallback((id: string) => {
    setCurrentSection(id);
    setReached((r) => Math.max(r, sections.findIndex((s) => s.id === id)));
    scrollTo(id);
  }, [scrollTo, sections]);

  const backToLesson = useCallback((section = 'check') => {
    saveCheck(null);
    setMode('lesson');
    setRun(null);
    setResult(null);
    if (isReviewMode) {
      onOpenLesson?.(section);
      return;
    }
    pendingScroll.current = section;
    setCurrentSection(section);
  }, [saveCheck, isReviewMode, onOpenLesson]);

  // ── Tasks with an inline Try This ─────────────────────────────────────────
  const [taskTry, setTaskTry] = useState<{ taskId: string; query: string } | null>(null);

  // ── Completing the lesson ─────────────────────────────────────────────────
  const complete = useCallback(() => {
    onCompleteModule(module.id);
    import('../../utils/celebrationSound')
      .then(({ playCelebrationSound }) => playCelebrationSound())
      .catch(() => {}); // offline without the chunk cached — celebration is optional
    setShowConfetti(true);
  }, [onCompleteModule, module.id]);

  // ── The check / result screens ────────────────────────────────────────────
  const title = module.title;
  const onRunComplete = useCallback((passed: boolean, outcomes: ItemOutcome[]) => {
    if (!run) return;
    if (run.kind !== 'practice') onExercisesComplete(passed);
    setResult({ kind: run.kind, outcomes, passed });
    setMode('result');
    const saved = useLearnSessionStore.getState().check;
    if (saved && saved.moduleId === module.id) saveCheck({ ...saved, finished: true, at: Date.now() });
    requestAnimationFrame(() => scrollTo('top'));
  }, [run, onExercisesComplete, module.id, saveCheck, scrollTo]);

  const onSnapshot = useCallback((snapshot: RunSnapshot) => {
    const saved = useLearnSessionStore.getState().check;
    if (saved && saved.moduleId === module.id) saveCheck({ ...saved, run: snapshot, at: Date.now() });
  }, [module.id, saveCheck]);

  const rereadFor = useCallback((o: ItemOutcome) => {
    const i = conceptForQuestion(`${o.exercise.prompt} ${o.exercise.hint ?? ''}`, module, o.answer);
    const c = module.concepts[i];
    if (!c) return null;
    return { label: t('lesson.conceptItem', { n: i + 1, title: c.title }), onClick: () => backToLesson(`c${i}`) };
  }, [module, t, backToLesson]);

  if (mode === 'check' && run) {
    return (
      <div ref={rootRef} className="flex-1 flex flex-col">
        <ExerciseRunner
          key={run.key}
          exercises={run.exercises}
          accentColor={accent}
          title={title}
          reviewMode={run.kind === 'review'}
          practice={run.kind === 'practice'}
          resume={run.resume}
          onSnapshot={onSnapshot}
          concepts={module.concepts}
          onRecordResult={onRecordExerciseResult}
          onComplete={onRunComplete}
          onExit={() => (isReviewMode ? (saveCheck(null), onBack()) : backToLesson('check'))}
        />
      </div>
    );
  }

  if (mode === 'result' && result && run) {
    const missedList = result.outcomes.filter((o) => o.score < 1).map((o) => o.exercise);
    const actions: ResultAction[] = [];
    const practise = missedList.length > 0
      ? { label: t('lesson.practiseMissed', { count: missedList.length }), onClick: () => startRun('practice', missedList) }
      : null;
    const kindPassed = result.kind !== 'practice' && result.passed;
    if (result.kind === 'practice') {
      actions.push({ label: t('lesson.startCheck'), onClick: () => startRun(isReviewMode ? 'review' : 'check', exercises), variant: 'primary' });
      if (practise) actions.push({ ...practise, variant: 'secondary' });
    } else if (!kindPassed) {
      if (practise) actions.push({ ...practise, variant: 'primary' });
      actions.push({ label: t('lesson.startOver'), onClick: () => startRun(result.kind, exercises), variant: practise ? 'secondary' : 'primary' });
    } else {
      if (!isReviewMode && canComplete && !isModuleCompleted) actions.push({ label: t('lesson.completeLesson'), onClick: () => { complete(); backToLesson('check'); }, variant: 'primary' });
      else if (!isReviewMode && !allTasksDone) actions.push({ label: t('lesson.goToTasks'), onClick: () => backToLesson('tasks'), variant: 'primary' });
      else if (!isReviewMode && nextModule) actions.push({ label: t('lesson.nextLesson'), onClick: () => { saveCheck(null); onNavigateModule(nextModule.id); }, variant: 'primary' });
      if (practise) actions.push({ ...practise, variant: 'secondary' });
    }
    actions.push(isReviewMode
      ? { label: t('lesson.backToLearn'), onClick: () => { saveCheck(null); onBack(); }, variant: 'quiet' }
      : { label: t('lesson.backToLesson'), onClick: () => backToLesson('check'), variant: 'quiet' });
    const note = kindPassed && !isReviewMode && !allTasksDone
      ? <p className="text-ui" style={{ color: 'var(--text-muted)' }}>{t('lesson.tasksLeft', { count: tasksLeft })}</p>
      : null;
    return (
      <div ref={rootRef} className="flex-1 flex flex-col">
        <ResultScreen
          title={title}
          outcomes={result.outcomes}
          kind={result.kind}
          passed={result.passed}
          rereadFor={rereadFor}
          note={note}
          actions={actions}
        />
        {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      </div>
    );
  }

  // ── The lesson ─────────────────────────────────────────────────────────────
  if (isReviewMode) {
    // A review goes straight to its check (above); while its exercises load:
    return (
      <div ref={rootRef} className="flex-1 flex flex-col items-center justify-center py-16 gap-3">
        <ExercisesState state={exercisesState} accent={accent} onRetry={onRetryExercises} t={t} />
        {exercisesState === 'ready' && !hasExercises && (
          <>
            <p className="text-body" style={{ color: 'var(--text-muted)' }}>{t('lesson.noCheck')}</p>
            <Button variant="secondary" onClick={onBack}>{t('lesson.backToLearn')}</Button>
          </>
        )}
      </div>
    );
  }

  const pairs = pairsWithLevel(module.id, lang as ContentLanguage);
  const crumb = `${t('learn.level', { n: level.number })} › ${unit.title}`;
  const sectionClass = 'scroll-mt-16 lg:scroll-mt-4';

  return (
    <div ref={rootRef} className="flex-1">
      <div className="max-w-[1080px] mx-auto px-5 max-sm:px-3 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-7">
        {wide && (
          <aside>
            <SectionRail
              sections={railSections}
              currentId={sections[currentIndex].id}
              onJump={jump}
              crumb={crumb}
              next={nextModule ? { title: nextModule.title, onOpen: () => onNavigateModule(nextModule.id) } : undefined}
            />
          </aside>
        )}
        <div className="min-w-0 max-w-[680px] pb-32">
          {!wide && <SectionPicker sections={railSections} currentId={sections[currentIndex].id} onJump={jump} crumb={crumb} checkId="check" />}

          {/* ─── What you'll learn ─────────────────────────────────── */}
          <section data-section="intro" className={`pt-6 max-sm:pt-4 ${sectionClass}`}>
            <div className="flex items-center gap-2 mb-6">
              <IconButton
                onClick={onBack}
                aria-label={t('common.back')}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                }
              />
              <LearnBreadcrumb
                accentColor={accent}
                segments={[
                  { label: t('nav.learn'), onClick: onBackToLevels },
                  { label: t('learn.level', { n: level.number }), onClick: onBack },
                  { label: unit.title, onClick: onBack },
                  { label: t('learn.module', { n: moduleIndex + 1 }) },
                ]}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-caption font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: accentText(accent), backgroundColor: `${accent}18` }}>
                {unit.title}
              </span>
              {pairs && (
                <Badge title={pairs.title ? t('lesson.pairsWithTitle', { n: pairs.level, title: pairs.title }) : undefined}>
                  {t('lesson.pairsWith', { n: pairs.level })}
                </Badge>
              )}
              {isModuleCompleted && (
                <span className="text-caption font-medium text-success bg-emerald-400/10 px-2 py-0.5 rounded-full">{t('status.completed')}</span>
              )}
            </div>
            <h1 className="mb-1.5 learn-serif" style={{ color: 'var(--text)' }}>{module.title}</h1>
            <p className="text-ui mb-6" style={{ color: 'var(--text-muted)' }}>{module.subtitle}</p>
            <div className="mb-10 rounded-xl p-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border-subtle)' }}>
              <h2 className="type-label mb-3" style={{ color: accentText(accent) }}>{t('lesson.intro')}</h2>
              <ul className="space-y-2">
                {module.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-ui" style={{ color: 'var(--text-muted)' }}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ─── Concepts, each with its Try This in place ─────────────── */}
          {module.concepts.map((concept, i) => (
            <section key={i} data-section={`c${i}`} className={`mb-12 ${sectionClass}`}>
              <h2 className="text-title font-semibold mb-3" style={{ color: 'var(--text)' }}>{concept.title}</h2>
              <p className="learn-concept-text mb-4" style={{ color: 'var(--text-muted)' }}>{concept.explanation}</p>
              <InlineTryThis query={concept.tryThisQuery} label={concept.tryThisLabel} rhythm={concept.rhythm} accent={accent} />
            </section>
          ))}

          {/* ─── Songs ─────────────────────────────────────────────────── */}
          {songRefs.length > 0 && (
            <section data-section="songs" className={`mb-12 rounded-xl p-4 ${sectionClass}`} style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border-subtle)' }}>
              <h2 className="type-label mb-3" style={{ color: accentText(accent) }}>{t('songRef.title')}</h2>
              <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {songRefs.map((ref, i) => (
                  <div key={i} className={`py-2.5 ${i === 0 ? 'pt-0' : ''}`}>
                    <div className="text-ui">
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>{ref.song}</span>
                      <span className="ml-1.5" style={{ color: 'var(--text-muted)' }}>{ref.artist}</span>
                    </div>
                    <p className="text-ui mt-0.5" style={{ color: 'var(--text-muted)' }}>{ref.context}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── On your piano / guitar: the practice tasks ─────────────── */}
          {module.tasks.length > 0 && (
            <section data-section="tasks" className={`mb-12 rounded-xl border overflow-hidden ${sectionClass}`} style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between gap-2" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--card)' }}>
                <h2 className="type-label">{t(instrument === 'guitar' ? 'lesson.tasksGuitar' : 'lesson.tasksPiano')}</h2>
                <span className="text-ui tabular-nums" style={{ color: 'var(--text-muted)' }}>{completedTaskCount}/{module.tasks.length}</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {module.tasks.map((task) => {
                  const done = isTaskCompleted(module.id, task.id);
                  const openQuery = taskTry?.taskId === task.id ? taskTry.query : null;
                  return (
                    <div key={task.id}>
                      <div
                        onClick={() => onToggleTask(module.id, task.id)}
                        className="w-full text-left px-4 py-3 flex items-start gap-3 cursor-pointer"
                      >
                        <button
                          type="button"
                          aria-pressed={done}
                          aria-label={task.instruction}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(module.id, task.id);
                          }}
                          className="-ml-3 -my-2.5 w-(--tap) h-(--tap) flex items-center justify-center shrink-0"
                        >
                          <span
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${done ? 'bg-emerald-500/20' : ''}`}
                            style={{ borderColor: done ? 'var(--success-text)' : 'var(--text-muted)' }}
                          >
                            <AnimatePresence>
                              {done && (
                                <m.svg initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={SPRING_BOUNCY} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--success-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </m.svg>
                              )}
                            </AnimatePresence>
                          </span>
                        </button>
                        <span className={`text-ui ${done ? 'line-through' : ''}`} style={{ color: 'var(--text-muted)' }}>
                          {renderTaskInstruction(task.instruction, (query) => setTaskTry((cur) => (cur?.taskId === task.id && cur.query === query ? null : { taskId: task.id, query })), accent, openQuery)}
                        </span>
                      </div>
                      {openQuery && (
                        <div className="px-4 pb-3">
                          <InlineTryThis compact query={openQuery} label={`‘${openQuery}’`} accent={accent} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Check ─────────────────────────────────────────────────── */}
          <section data-section="check" className={`mb-10 ${sectionClass}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-4 rounded-2xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border-subtle)' }} data-testid="check-card">
              <ExercisesState state={exercisesState} accent={accent} onRetry={onRetryExercises} t={t} />
              {exercisesState === 'ready' && (hasExercises ? (
                <>
                  <div className="min-w-0">
                    <h2 className="text-body font-semibold" style={{ color: 'var(--text)' }}>
                      {exercisesPassed ? t('lesson.checkPassed') : t('lesson.ready')}
                    </h2>
                    <p className="text-ui" style={{ color: 'var(--text-muted)' }}>
                      {t('lesson.readyMeta', { count: exercises.length, minutes: Math.max(1, Math.ceil((exercises.length * 20) / 60)) })}
                    </p>
                    {!isModuleCompleted && exercisesPassed && !allTasksDone && (
                      <p className="text-ui mt-1" style={{ color: 'var(--text-muted)' }}>{t('lesson.tasksLeft', { count: tasksLeft })}</p>
                    )}
                    {exercisesPassed && <p className="text-ui mt-1" style={{ color: 'var(--text-muted)' }}>{t('lesson.passedMark', { score: passMark(exercises.length).toLocaleString(i18n.language || 'en') })}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 max-sm:flex-col">
                    {!isModuleCompleted && canComplete && (
                      <Button variant="primary" onClick={complete} className="max-sm:w-full">{t('lesson.completeLesson')}</Button>
                    )}
                    <Button variant={exercisesPassed ? 'secondary' : 'primary'} onClick={() => startRun('check', exercises)} className="max-sm:w-full">
                      {exercisesPassed ? t('lesson.checkAgain') : t('lesson.startCheck')}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-ui" style={{ color: 'var(--text-muted)' }}>{t('lesson.noCheck')}</p>
                  {!isModuleCompleted && canComplete && <Button variant="primary" onClick={complete}>{t('lesson.completeLesson')}</Button>}
                </>
              ))}
              {isModuleCompleted && <span className="text-ui text-success">{t('lesson.lessonComplete')}</span>}
            </div>
          </section>

          {/* ─── Previous / next lesson ─────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            {prevModule ? (
              <button onClick={() => onNavigateModule(prevModule.id)} className="flex items-center gap-2 min-h-(--tap) py-1 text-ui text-left" style={{ color: 'var(--text-muted)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                <span>
                  <span className="block">{t('common.previous')}</span>
                  <span style={{ color: 'var(--text)' }}>{prevModule.title}</span>
                </span>
              </button>
            ) : <div />}
            {nextModule ? (
              <button onClick={() => onNavigateModule(nextModule.id)} className="flex items-center gap-2 min-h-(--tap) py-1 text-ui text-right" style={{ color: 'var(--text-muted)' }}>
                <span>
                  <span className="block">{t('lesson.nextLesson')}</span>
                  <span style={{ color: 'var(--text)' }}>{nextModule.title}</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            ) : <div />}
          </div>

          <ReportMistakeLink moduleId={module.id} moduleTitle={module.title} />
        </div>
      </div>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
    </div>
  );
}

function ExercisesState({ state, accent, onRetry, t }: { state: 'loading' | 'ready' | 'error'; accent: string; onRetry?: () => void; t: (k: string) => string }) {
  if (state === 'loading') {
    return <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text-muted)' }} />;
  }
  if (state === 'error') {
    return (
      <div className="flex flex-col gap-2 items-start">
        <p className="text-ui" style={{ color: 'var(--text-muted)' }}>{t('learn.exercisesLoadError')}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center min-h-(--tap) px-4 py-2 rounded-lg text-ui font-medium"
          style={{ backgroundColor: `${accent}20`, color: accentText(accent), border: `1px solid ${accent}30` }}
        >
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }
  return null;
}
