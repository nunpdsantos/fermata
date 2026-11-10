import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrillRunner } from '../components/drill/useDrillRunner';
import { ReadingStaff } from '../components/drill/ReadingStaff';
import { formatPlaces } from '../core/utils/drillBank/genRead';
import { QuestionCard } from '../components/drill/QuestionCard';
import { DrillInput } from '../components/drill/DrillInput';
import { FeedbackStrip } from '../components/drill/FeedbackStrip';
import { Button } from '../components/ui/Button';
import { SessionSummary } from '../components/drill/SessionSummary';
import { MasteryMap } from '../components/drill/MasteryMap';
import { DrillSettings } from '../components/drill/DrillSettings';
import { SprintRunner } from '../components/drill/SprintRunner';
import { DrillIntro } from '../components/drill/DrillIntro';
import { sprintFamiliesKey } from '../components/drill/sprintSelectors';
import { generateDrillBank } from '../core/utils/drillBank';
import { choiceLabel, itemPrompt, itemWhy, toContentLanguage } from '../components/drill/drillText';
import { useDrillStore } from '../state/drillStore';
import { useAppStore } from '../state/store';
import { MODULE_INDEX } from '../data/moduleIndex';
import { DRILL_FAMILY_TO_MODULE } from '../data/drillFamilyToModule';
import type { DrillItem } from '../core/types/drill';
import { stringToNote } from '../core/types/music';
import { CHORD_QUALITY_NAMES } from '../core/constants/chords';
import { withGlyphs } from '../core/utils/drillBank/shared';
import { useLearnerProfile } from '../state/learnerProfile';
import { trackForProfile } from '../data/tracks';
import {
  isItemUnlocked,
  learnTargetOf,
  lessonOpening,
  nextUnlock,
  openFamilies,
  unlockedFor,
} from '../data/drillUnlocks';
import { followFamilies, followHasNothing, followInForce, readCompletedLessons } from '../services/drillFollow';
import type { FollowInfo } from '../components/drill/FollowLessons';

// Memoize the bank once for the view (the runner memoizes its own; this is the
// copy fed to the Mastery map + Sprint, which read tier counts off it).
let VIEW_BANK: DrillItem[] | null = null;
function viewBank(): DrillItem[] {
  if (VIEW_BANK === null) VIEW_BANK = generateDrillBank({ includeRead: true });
  return VIEW_BANK;
}

/** Navigable sub-screens layered over the base (running question / summary). */
type SubScreen = null | 'settings' | 'mastery' | 'sprint';

/**
 * The completed lessons, read from Learn's save (never the progress store):
 * at mount — each time the Drill view is shown — and when the page is shown
 * again (a lesson finished in another tab).
 */
function useCompletedLessons(): string[] {
  const [completed, setCompleted] = useState<string[]>(() => readCompletedLessons());
  useEffect(() => {
    const onShow = () => {
      if (document.visibilityState !== 'visible') return;
      const next = readCompletedLessons();
      setCompleted((prev) => (prev.length === next.length && prev.every((id, i) => id === next[i]) ? prev : next));
    };
    document.addEventListener('visibilitychange', onShow);
    return () => document.removeEventListener('visibilitychange', onShow);
  }, []);
  return completed;
}

export function DrillView() {
  // A first visit (no drill history) opens on the intro, not a question; any
  // session starting sets introDone, so it never shows again.
  const introDone = useDrillStore((s) => s.introDone);

  // ── "Follow my lessons" (wave 2) ──────────────────────────────────────────
  const savedFollow = useDrillStore((s) => s.settings.followLessons);
  const stateItems = useDrillStore((s) => s.items);
  const profile = useLearnerProfile();
  const completed = useCompletedLessons();
  const follow = followInForce(savedFollow, profile, introDone);
  const unlock = useMemo(() => unlockedFor(completed), [completed]);
  const unlocked = useMemo(
    () => (follow ? (item: DrillItem) => isItemUnlocked(unlock, item) : null),
    [follow, unlock],
  );
  // Following, with nothing the lessons open and no fact already met: no
  // session may start (the intro says which lesson opens the first questions).
  const nothingToAsk = useMemo(
    () => follow && followHasNothing(viewBank(), unlock, stateItems),
    [follow, unlock, stateItems],
  );
  const followInfo = useMemo<FollowInfo | null>(() => {
    if (!follow) return null;
    const track = trackForProfile(profile);
    return {
      unlock,
      open: openFamilies(unlock),
      next: nextUnlock(completed, track),
      lessonOpening: (family) => lessonOpening(family, track),
      onOpenLesson: (moduleId) => {
        const target = learnTargetOf(moduleId);
        if (target) useAppStore.getState().openLearnTarget(target);
      },
    };
  }, [follow, unlock, completed, profile]);
  // A learner with Drill history whose pool was empty when the view opened:
  // the runner did not start a session, so the intro (follow form) stands in.
  const [openedWithNothing] = useState(() => introDone && nothingToAsk);

  const runner = useDrillRunner({
    autoStart: introDone && !nothingToAsk,
    sessionOptions: { followLessons: follow, unlocked },
  });
  // A Sprint left open (a reload, or back from another view) comes back on
  // screen where it was (W9b).
  const [subScreen, setSubScreen] = useState<SubScreen>(() => (useDrillStore.getState().sprint ? 'sprint' : null));
  // Wall-clock snapshot taken when the mastery screen opens (due-today is a
  // point-in-time count). Captured in the handler — never read in render.
  const [masteryNow, setMasteryNow] = useState(0);

  const settings = useDrillStore((s) => s.settings);
  const items = useDrillStore((s) => s.items);
  const sprintBests = useDrillStore((s) => s.sprintBests);
  const updateSettings = useDrillStore((s) => s.updateSettings);
  const recordSprint = useDrillStore((s) => s.recordSprint);
  const resetDrillProgress = useDrillStore((s) => s.resetDrillProgress);
  const activeSession = useDrillStore((s) => s.activeSession);

  const { item, presentationKey, phase, result, position, total, again, extra, sessionComplete } = runner;

  const bank = viewBank();
  // While following, Sprint's topic set is what the session pool reaches.
  const sprintFamilies = useMemo(
    () => (follow ? followFamilies(bank, unlock, items) : settings.families),
    [follow, bank, unlock, items, settings.families],
  );

  // Open mastery + freeze "now" for its due-today count in one event-time step.
  const goToMastery = () => {
    setMasteryNow(Date.now());
    setSubScreen('mastery');
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
      {/* min-h-full + flex: on a phone the running question fills the screen so
          its answers can sit in the thumb zone (D-26). */}
      <div className={`drill-content ${!subScreen && item?.family === 'read' ? 'drill-content--read' : 'max-w-xl py-6 max-sm:py-4'} mx-auto w-full px-4 min-h-full flex flex-col`} style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {subScreen === 'settings' ? (
          <DrillSettings
            settings={settings}
            follow={follow}
            followInfo={followInfo}
            onUpdate={updateSettings}
            onBack={() => setSubScreen(null)}
            onMasteryMap={goToMastery}
            onResetProgress={() => {
              resetDrillProgress();
              setSubScreen(null);
              // activeSession is now null after reset; kick a fresh session
              // explicitly so the runner doesn't sit on a stale frozen displayId.
              // (From the intro, back to the intro: no session yet.)
              if (introDone) runner.startNewSession();
            }}
          />
        ) : subScreen === 'mastery' ? (
          <MasteryMap
            bank={bank}
            items={items}
            families={settings.families}
            follow={followInfo}
            now={masteryNow}
            onToggleFamily={(family, enabled) =>
              updateSettings({ families: { ...settings.families, [family]: enabled } })
            }
            onBack={() => setSubScreen(null)}
          />
        ) : subScreen === 'sprint' ? (
          <SprintRunner
            bank={bank}
            items={items}
            families={sprintFamilies}
            priorBest={sprintBests[sprintFamiliesKey(sprintFamilies)] ?? 0}
            onRecord={recordSprint}
            onExit={() => setSubScreen(null)}
          />
        ) : !activeSession && !sessionComplete && (!introDone || openedWithNothing || nothingToAsk) ? (
          <DrillIntro
            settings={settings}
            onStart={runner.startNewSession}
            onOpenSettings={() => setSubScreen('settings')}
            follow={follow}
            followInfo={followInfo}
            nothingToAsk={nothingToAsk}
            onSetFollow={(on) => updateSettings({ followLessons: on })}
          />
        ) : sessionComplete ? (
          <SessionSummary
            summary={runner.summary}
            onNewSession={() => {
              runner.startNewSession();
              setSubScreen(null);
            }}
            onMasteryMap={goToMastery}
            onSprint={() => setSubScreen('sprint')}
          />
        ) : item ? (
          <RunningQuestion
            item={item}
            presentationKey={presentationKey}
            phase={phase}
            result={result}
            position={position}
            total={total}
            again={again}
            extra={extra}
            startedAt={activeSession?.startedAt ?? null}
            showTimer={settings.showTimer}
            onAnswer={runner.answer}
            onAdvance={runner.advance}
            onEndSession={runner.endSession}
            onOpenSettings={() => setSubScreen('settings')}
          />
        ) : (
          // Pre-auto-start tick: session not yet created. Brief, no flash of summary.
          <div className="h-24" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

// ─── Running question (base screen) ───────────────────────────────────────────

interface RunningQuestionProps {
  item: DrillItem;
  presentationKey: string;
  phase: 'answering' | 'feedback';
  result: ReturnType<typeof useDrillRunner>['result'];
  /** Zero-based number of the question on screen. */
  position: number;
  total: number;
  again: boolean;
  extra: number;
  startedAt: number | null;
  showTimer: boolean;
  onAnswer: ReturnType<typeof useDrillRunner>['answer'];
  onAdvance: () => void;
  onEndSession: () => void;
  onOpenSettings: () => void;
}

function RunningQuestion({
  item,
  presentationKey,
  phase,
  result,
  position,
  total,
  again,
  extra,
  startedAt,
  showTimer,
  onAnswer,
  onAdvance,
  onEndSession,
  onOpenSettings,
}: RunningQuestionProps) {
  const { t, i18n } = useTranslation();
  // Degree/function/cadence names, Yes/No and key names render in the
  // learner's language; the bank's English strings stay the grading values
  // (audit W6-07, D-17).
  const lang = toContentLanguage(i18n.language);
  const elapsed = useElapsedSeconds(showTimer ? startedAt : null);

  return (
    <>
      <QuestionCard
        stimulus={item.family === 'read' ? <ReadingStaff staff={item.staff} /> : undefined}
        asked={position}
        total={total}
        again={again}
        extra={extra}
        prompt={itemPrompt(item, t, lang)}
        onEndSession={onEndSession}
        onOpenSettings={onOpenSettings}
        elapsedSeconds={showTimer && startedAt !== null ? elapsed : undefined}
      >
        {/* Key per PRESENTATION (not just item id) so each question — even the
            same item shown again right away — gets a fresh input instance:
            resets selection/commit-guard state without a transition effect
            (audit W0-02 / D-4: an id-only key left the spelling inputs locked). */}
        <DrillInput key={presentationKey} item={item} phase={phase} onAnswer={onAnswer} />

        {phase === 'feedback' && result && (
          <FeedbackStrip
            reading={item.family === 'read'}
            result={result}
            answerText={
              item.answer.kind === 'choice'
                ? choiceLabel(item, item.answer.correct, t, lang)
                : canonicalAnswer(item)
            }
            whyText={item.family === 'read' ? t('drill.reading.explanation', item.whyParams) : itemWhy(item, t, lang)}
            // Deep link on wrong / near-miss only (correct answers
            // auto-advance and need no remediation prompt).
            learnMoreLabel={!result.correct && item.family !== 'read' ? t('drill.feedback.learnMore') : undefined}
            onLearnMore={!result.correct ? () => openLearnModule(item) : undefined}
          />
        )}

        {/* Continue: anything that isn't an auto-advancing correct answer
            holds here. Under the answers, in the thumb zone on a phone. */}
        {phase === 'feedback' && result && !result.correct && (
          <Button variant="primary" size="lg" block onClick={onAdvance}>
            {t('drill.feedback.continue')}
          </Button>
        )}
      </QuestionCard>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Tick once a second and derive elapsed whole-seconds from a session start time.
 *
 * Only a ticking `now` lives in state (updated inside the interval — never
 * synchronously in the effect body, per React 19 purity rules); elapsed is a
 * pure derivation. Returns 0 and starts no interval when startedAt is null, so
 * the counter costs nothing while showTimer is off.
 */
function useElapsedSeconds(startedAt: number | null): number {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (startedAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  if (startedAt === null) return 0;
  // First paint (now still null) shows 0:00 until the first tick lands.
  const reference = now ?? startedAt;
  return Math.max(0, Math.floor((reference - startedAt) / 1000));
}

/**
 * The answer as the chips show it (audit W1-10): note names with ♯/♭/𝄪 and
 * chord-quality names — never ASCII spellings or the internal quality id
 * ("C# half_diminished7" now reads "C♯ Half-Diminished 7th").
 */
function canonicalAnswer(item: DrillItem): string {
  const note = (ascii: string) => withGlyphs(stringToNote(ascii));
  switch (item.answer.kind) {
    case 'choice':
      return item.answer.correct;
    case 'notes':
      return item.answer.notes.map(note).join(' ');
    case 'accidentals':
      return item.answer.spelled.map(note).join(' ');
    case 'fretPitch':
      return formatPlaces(item.answer.accepted);
    case 'rootQuality':
      return `${note(item.answer.root)} ${CHORD_QUALITY_NAMES[item.answer.quality] ?? item.answer.quality}`;
  }
}

/**
 * Navigate to the Learn module most relevant to this item's family — the same
 * openLearnTarget action the Explore "Learn about this" buttons use.
 * Read-only: never touches module progress.
 */
function openLearnModule(item: DrillItem): void {
  const moduleId = DRILL_FAMILY_TO_MODULE[item.family];
  const match = MODULE_INDEX.find((m) => m.id === moduleId);
  if (!match) return;
  useAppStore.getState().openLearnTarget({
    levelId: match.level,
    unitId: match.unitId,
    moduleId: match.id,
  });
}
