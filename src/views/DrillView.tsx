import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrillRunner } from '../components/drill/useDrillRunner';
import { QuestionCard } from '../components/drill/QuestionCard';
import { DrillInput } from '../components/drill/DrillInput';
import { FeedbackStrip } from '../components/drill/FeedbackStrip';
import { SessionSummary } from '../components/drill/SessionSummary';
import { MasteryMap } from '../components/drill/MasteryMap';
import { DrillSettings } from '../components/drill/DrillSettings';
import { SprintRunner } from '../components/drill/SprintRunner';
import { sprintFamiliesKey } from '../components/drill/sprintSelectors';
import { generateDrillBank } from '../core/utils/drillBank';
import { useDrillStore } from '../state/drillStore';
import { useAppStore } from '../state/store';
import { MODULE_INDEX } from '../data/moduleIndex';
import { DRILL_FAMILY_TO_MODULE } from '../data/drillFamilyToModule';
import type { DrillItem } from '../core/types/drill';

// Memoize the bank once for the view (the runner memoizes its own; this is the
// copy fed to the Mastery map + Sprint, which read tier counts off it).
let VIEW_BANK: DrillItem[] | null = null;
function viewBank(): DrillItem[] {
  if (VIEW_BANK === null) VIEW_BANK = generateDrillBank();
  return VIEW_BANK;
}

/** Navigable sub-screens layered over the base (running question / summary). */
type SubScreen = null | 'settings' | 'mastery' | 'sprint';

export function DrillView() {
  const runner = useDrillRunner();
  const [subScreen, setSubScreen] = useState<SubScreen>(null);
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

  const { item, phase, result, asked, total, sessionComplete } = runner;

  const bank = viewBank();

  // Open mastery + freeze "now" for its due-today count in one event-time step.
  const goToMastery = () => {
    setMasteryNow(Date.now());
    setSubScreen('mastery');
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
      <div className="mx-auto w-full max-w-xl px-4 py-6 max-sm:py-5">
        {subScreen === 'settings' ? (
          <DrillSettings
            settings={settings}
            onUpdate={updateSettings}
            onBack={() => setSubScreen(null)}
            onMasteryMap={goToMastery}
            onResetProgress={() => {
              resetDrillProgress();
              setSubScreen(null);
              // activeSession is now null after reset; kick a fresh session
              // explicitly so the runner doesn't sit on a stale frozen displayId.
              runner.startNewSession();
            }}
          />
        ) : subScreen === 'mastery' ? (
          <MasteryMap
            bank={bank}
            items={items}
            families={settings.families}
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
            families={settings.families}
            priorBest={sprintBests[sprintFamiliesKey(settings.families)] ?? 0}
            onRecord={recordSprint}
            onExit={() => setSubScreen(null)}
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
            phase={phase}
            result={result}
            asked={asked}
            total={total}
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
  phase: 'answering' | 'feedback';
  result: ReturnType<typeof useDrillRunner>['result'];
  asked: number;
  total: number;
  startedAt: number | null;
  showTimer: boolean;
  onAnswer: ReturnType<typeof useDrillRunner>['answer'];
  onAdvance: () => void;
  onEndSession: () => void;
  onOpenSettings: () => void;
}

function RunningQuestion({
  item,
  phase,
  result,
  asked,
  total,
  startedAt,
  showTimer,
  onAnswer,
  onAdvance,
  onEndSession,
  onOpenSettings,
}: RunningQuestionProps) {
  const { t } = useTranslation();
  const elapsed = useElapsedSeconds(showTimer ? startedAt : null);

  return (
    <>
      <QuestionCard
        asked={asked}
        total={total}
        prompt={t(item.promptKey, item.promptParams)}
        onEndSession={onEndSession}
        onOpenSettings={onOpenSettings}
        elapsedSeconds={showTimer && startedAt !== null ? elapsed : undefined}
      >
        {/* Key by item id so each question gets a fresh input instance —
            resets selection/commit-guard state without a transition effect. */}
        <DrillInput key={item.id} item={item} phase={phase} onAnswer={onAnswer} />
      </QuestionCard>

      {phase === 'feedback' && result && (
        <FeedbackStrip
          result={result}
          answerText={canonicalAnswer(item)}
          whyText={t(item.whyKey, item.whyParams)}
          onContinue={onAdvance}
          showContinue={!result.correct}
          // Deep link on wrong / near-miss only (correct answers
          // auto-advance and need no remediation prompt).
          learnMoreLabel={!result.correct ? t('drill.feedback.learnMore') : undefined}
          onLearnMore={!result.correct ? () => openLearnModule(item) : undefined}
        />
      )}
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

function canonicalAnswer(item: DrillItem): string {
  switch (item.answer.kind) {
    case 'choice':
      return item.answer.correct;
    case 'notes':
      return item.answer.notes.join(' ');
    case 'accidentals':
      return item.answer.spelled.join(' ');
    case 'rootQuality':
      return `${item.answer.root} ${item.answer.quality}`;
  }
}

/**
 * Navigate to the Learn module most relevant to this item's family — the same
 * store handoff the Explore "Learn about this" buttons use (setView('learn') +
 * pendingLearnTarget). Read-only: never touches module progress.
 */
function openLearnModule(item: DrillItem): void {
  const moduleId = DRILL_FAMILY_TO_MODULE[item.family];
  const match = MODULE_INDEX.find((m) => m.id === moduleId);
  if (!match) return;
  useAppStore.setState({
    view: 'learn',
    pendingLearnTarget: {
      levelId: match.level,
      unitId: match.unitId,
      moduleId: match.id,
    },
  });
}
