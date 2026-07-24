import { useState, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { m, AnimatePresence } from 'framer-motion';
import type { CurriculumModule, CurriculumUnit, CurriculumLevel } from '../../core/types/curriculum';
import type { ExerciseDefinition } from '../../core/types/exercise';
import { getNextModuleInLevel, getPreviousModuleInLevel, getLevelModuleCount } from '../../data/curriculumLoader';
import { executeTheoryQuery } from '../../utils/queryExecutor';
import { LearnBreadcrumb } from './LearnBreadcrumb';
import { ExerciseRunner } from './exercises/ExerciseRunner';
import { ReportMistakeLink } from './ReportMistakeLink';
import { Confetti } from './Confetti';
import { toast } from '../../state/toastStore';
import { getSongReferences } from '../../data/songReferences';
import { SPRING_BOUNCY } from '../../design/tokens/motion';
import { palette } from '../../design/tokens/palette';

// Matches a quoted token that follows a "Type "/"Open "/"Search for " verb,
// e.g. "Type 'C major scale'". Quotes can be straight or curly.
const QUERY_VERB_PATTERN = /(Type|Open|Search for)\s+['"\u2018\u201C]([^'"\u2019\u201D]+)['"\u2019\u201D]/gi;

function renderTaskInstruction(
  instruction: string,
  onTryQuery: (query: string) => void,
  accent: string,
): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  // Reset lastIndex — the regex is a stateful /g object defined at module scope.
  QUERY_VERB_PATTERN.lastIndex = 0;
  while ((match = QUERY_VERB_PATTERN.exec(instruction)) !== null) {
    if (match.index > lastIndex) {
      parts.push(instruction.slice(lastIndex, match.index));
    }
    const verb = match[1];
    const query = match[2];
    parts.push(
      <button
        key={`${match.index}-${query}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTryQuery(query);
        }}
        className="inline-flex items-baseline font-medium rounded px-1 py-0.5 -my-0.5 transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
        style={{ color: accent, backgroundColor: `${accent}0d` }}
      >
        {verb} &lsquo;{query}&rsquo;
      </button>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < instruction.length) {
    parts.push(instruction.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [instruction];
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
  /** When true, shows only exercises in review mode (hides concepts/tasks) */
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
  levelCompletedModuleCount,
  onToggleTask,
  onCompleteModule,
  onRecordExerciseResult,
  onExercisesComplete,
  onBack,
  onBackToLevels,
  onNavigateModule,
  onLevelComplete,
}: ModuleViewProps) {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(false);
  const accent = level.accentColor;
  const prevModule = getPreviousModuleInLevel(module.id, level);
  const nextModule = getNextModuleInLevel(module.id, level);
  const allTasksDone = completedTaskCount >= module.tasks.length;
  const hasExercises = exercises.length > 0;
  const canComplete =
    allTasksDone && exercisesState === 'ready' && (!hasExercises || exercisesPassed);

  const songRefs = getSongReferences(module.id);

  const handleTryThis = useCallback((query: string) => {
    executeTheoryQuery(query);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 max-sm:px-3 py-6 max-sm:py-4 pb-32">
        {/* ─── Breadcrumb + Back ──────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs transition-colors group"
            style={{ color: 'var(--text-dim)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="group-hover:-translate-x-0.5 transition-transform"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
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

        {/* ─── Module Header ─────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{
                color: accent,
                backgroundColor: `${accent}18`,
              }}
            >
              {unit.title}
            </span>
            {isReviewMode && (
              <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                {t('review.badge')}
              </span>
            )}
            {!isReviewMode && isModuleCompleted && (
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                {t('status.completed')}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1.5 learn-serif" style={{ color: 'var(--text)' }}>
            {module.title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            {module.subtitle}
          </p>
        </m.div>

        {/* ─── Objectives ────────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 rounded-xl p-4"
          style={{
            backgroundColor: `${accent}08`,
            border: `1px solid ${accent}15`,
          }}
        >
          <h2
            className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: accent }}
          >
            {t('learn.learningObjectives')}
          </h2>
          <ul className="space-y-2">
            {module.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accent }}
                />
                {obj}
              </li>
            ))}
          </ul>
        </m.div>

        {/* ─── Concepts (hidden in review mode) ─────────────────── */}
        {!isReviewMode && <div className="space-y-8 mb-12">
          {module.concepts.map((concept, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              {/* Concept number + title */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    color: accent,
                    backgroundColor: `${accent}15`,
                  }}
                >
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
                  {concept.title}
                </h3>
              </div>

              {/* Explanation */}
              <div className="ml-10 space-y-4">
                <p className="learn-concept-text" style={{ color: 'var(--text-muted)' }}>
                  {concept.explanation}
                </p>

                {/* Try This callout */}
                <button
                  onClick={() => handleTryThis(concept.tryThisQuery)}
                  className="group w-full text-left rounded-xl px-4 py-3.5 transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    backgroundColor: `${accent}0a`,
                    border: `1px solid ${accent}20`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${accent}15`;
                    e.currentTarget.style.borderColor = `${accent}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${accent}0a`;
                    e.currentTarget.style.borderColor = `${accent}20`;
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                        style={{
                          backgroundColor: `${accent}20`,
                          color: accent,
                        }}
                      >
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: accent }}>
                          {t('learn.tryThis')}
                        </span>
                        <span className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
                          {concept.tryThisLabel}
                        </span>
                      </div>
                    </div>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="group-hover:translate-x-0.5 transition-all"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Divider between concepts (not after last) */}
              {i < module.concepts.length - 1 && (
                <div className="ml-10 mt-8 h-px" style={{ backgroundColor: 'color-mix(in srgb, var(--border) 60%, transparent)' }} />
              )}
            </m.div>
          ))}
        </div>}

        {/* ─── Song References (hidden in review mode) ────────────── */}
        {!isReviewMode && songRefs.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 rounded-xl p-4"
            style={{
              backgroundColor: `${accent}08`,
              border: `1px solid ${accent}15`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <h2
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: accent }}
              >
                {t('songRef.title')}
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: `${accent}15` }}>
              {songRefs.map((ref, i) => (
                <div key={i} className={`py-2.5 ${i === 0 ? 'pt-0' : ''}`}>
                  <div className="text-sm">
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{ref.song}</span>
                    <span className="ml-1.5" style={{ color: 'var(--text-dim)' }}>{ref.artist}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {ref.context}
                  </p>
                </div>
              ))}
            </div>
          </m.div>
        )}

        {/* ─── Exercises ───────────────────────────────────────────── */}
        {exercisesState === 'loading' && (
          <div className="flex items-center justify-center py-10 mb-10">
            <div
              className="w-5 h-5 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text-muted)' }}
            />
          </div>
        )}
        {exercisesState === 'error' && (
          <div
            className="mb-10 p-4 rounded-xl border text-center"
            style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)' }}
          >
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              {t('learn.exercisesLoadError')}
            </p>
            <button
              onClick={onRetryExercises}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={{ backgroundColor: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
            >
              {t('common.tryAgain')}
            </button>
          </div>
        )}
        {hasExercises && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-10"
          >
            <ExerciseRunner
              exercises={exercises}
              accentColor={accent}
              reviewMode={isReviewMode}
              onRecordResult={(exerciseId, score) => onRecordExerciseResult(exerciseId, score)}
              onComplete={onExercisesComplete}
            />
          </m.div>
        )}

        {/* ─── Practice Tasks (hidden in review mode) ─────────── */}
        {!isReviewMode && module.tasks.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10 rounded-xl border overflow-hidden"
            style={{ borderColor: 'var(--card-hover)' }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-hover)', backgroundColor: 'color-mix(in srgb, var(--bg-raised) 50%, transparent)' }}>
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('learn.practiceTasks')}
              </h2>
              <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                {completedTaskCount}/{module.tasks.length}
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--border) 50%, transparent)' }}>
              {module.tasks.map((task) => {
                const done = isTaskCompleted(module.id, task.id);
                // Row is a div, not a button: the instruction text embeds
                // query-link buttons and nesting button-in-button is invalid
                // HTML (React 19 errors on it). The checkbox button carries
                // focus and keyboard toggling; row clicks still toggle.
                return (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(module.id, task.id)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors group cursor-pointer"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card-hover) 30%, transparent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <button
                      type="button"
                      aria-pressed={done}
                      aria-label={task.instruction}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(module.id, task.id);
                      }}
                      className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        done
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : ''
                      }`}
                      style={!done ? { borderColor: 'var(--border)' } : undefined}
                    >
                      <AnimatePresence>
                        {done && (
                          <m.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={SPRING_BOUNCY}
                            width="10" height="10" viewBox="0 0 24 24" fill="none"
                            stroke={palette.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </m.svg>
                        )}
                      </AnimatePresence>
                    </button>
                    <span
                      className={`text-sm transition-colors ${done ? 'line-through' : ''}`}
                      style={{ color: done ? 'var(--text-dim)' : 'var(--text-muted)' }}
                    >
                      {renderTaskInstruction(task.instruction, handleTryThis, accent)}
                    </span>
                  </div>
                );
              })}
            </div>
          </m.div>
        )}

        {/* ─── Complete Module Button (hidden in review mode) ─── */}
        {!isReviewMode && !isModuleCompleted && canComplete && (
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <button
              onClick={() => {
                onCompleteModule(module.id);
                import('../../utils/celebrationSound')
                  .then(({ playCelebrationSound }) => playCelebrationSound())
                  .catch(() => {}); // offline without the chunk cached — celebration is optional
                setShowConfetti(true);

                // Check if this was the last module in the level
                const totalModules = getLevelModuleCount(level);
                if (levelCompletedModuleCount + 1 >= totalModules && onLevelComplete) {
                  onLevelComplete();
                } else {
                  toast(t('toast.moduleCompleted', { title: module.title }), 'success');
                }
              }}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01]"
              style={{
                backgroundColor: `${accent}20`,
                color: accent,
                border: `1px solid ${accent}30`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${accent}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${accent}20`;
              }}
            >
              {t('learn.markModuleComplete')}
            </button>
          </m.div>
        )}

        {/* ─── Navigation Footer ─────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex items-center justify-between pt-6 border-t"
          style={{ borderColor: 'var(--card-hover)' }}
        >
          {prevModule ? (
            <button
              onClick={() => onNavigateModule(prevModule.id)}
              className="flex items-center gap-2 text-xs transition-colors group"
              style={{ color: 'var(--text-dim)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="group-hover:-translate-x-0.5 transition-transform"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <span className="block text-[10px]" style={{ color: 'var(--text-dim)' }}>{t('common.previous')}</span>
                <span>{prevModule.title}</span>
              </div>
            </button>
          ) : (
            <div />
          )}
          {nextModule ? (
            <button
              onClick={() => onNavigateModule(nextModule.id)}
              className="flex items-center gap-2 text-xs transition-colors group text-right"
              style={{ color: 'var(--text-dim)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              <div>
                <span className="block text-[10px]" style={{ color: 'var(--text-dim)' }}>{t('common.next')}</span>
                <span>{nextModule.title}</span>
              </div>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="group-hover:translate-x-0.5 transition-transform"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div />
          )}
        </m.div>

        <ReportMistakeLink moduleId={module.id} moduleTitle={module.title} />
      </div>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
    </div>
  );
}
