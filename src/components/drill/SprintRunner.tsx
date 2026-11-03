/**
 * SprintRunner — the opt-in 60-second timed mode.
 *
 * Rules (spec, hard):
 *   - Pool = eligible items (review|byHeart tiers, enabled families), shuffled
 *     once via mulberry32(Date.now()) — the UI layer may use Date.now.
 *   - Reuses the four input components + grading. Answers DO NOT call
 *     recordAnswer: no scheduler writes, no RT-log, the SRS store is untouched.
 *   - A visible 60s countdown (independent of the showTimer setting, which
 *     governs the normal session). When it hits 0, input stops and the score +
 *     personal best are recorded via recordSprint(sortedFamiliesKey, score).
 *   - Esc or ✕ exits early WITHOUT recording.
 *   - Fewer than MIN_SPRINT_ITEMS eligible → an empty-state, never a started run.
 *   - Pool recycles (re-shuffled) when exhausted within the 60s.
 *   - A reload resumes the run exactly (W9b): seed, pool order, score, step and
 *     time left are saved in the drill store (`sprint`) on every answer, every
 *     5 s of the clock, at the finish, and when the page is hidden or goes
 *     away. A crash while visible resumes from the last save, up to 5 s
 *     earlier. Leaving the Drill view pauses it; ✕ / Esc / Done close it.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DrillFamily, DrillItem, ItemSrsState } from '../../core/types/drill';
import { mulberry32, seededShuffle } from '../../core/utils/prng';
import { useDrillStore, SPRINT_SECONDS, type SprintRun } from '../../state/drillStore';
import { gradeAnswer, type AnswerPayload } from './grading';
import { DrillInput } from './DrillInput';
import { useToastAvoid } from '../layout/toastLayout';
import { itemPrompt, toContentLanguage } from './drillText';
import {
  eligibleSprintItems,
  sprintFamiliesKey,
  MIN_SPRINT_ITEMS,
} from './sprintSelectors';

/** The clock is saved every this many seconds while it runs (plus on every answer). */
const SAVE_EVERY_SECONDS = 5;

interface RunSetup {
  seed: number;
  pool: DrillItem[];
  /** The best for this topic mix before the run — for "New best!". */
  priorBest: number;
  /** A saved run being resumed (null = a new run). */
  resumed: SprintRun | null;
}

/**
 * The run to show: the saved one when it belongs to this topic mix (a
 * reload, or back from another view), else a new one — one wall-clock seed
 * and the pool shuffled by it. Ids the bank no longer has are left out.
 */
function setUpRun(
  bank: DrillItem[],
  items: Record<string, ItemSrsState>,
  families: Record<DrillFamily, boolean>,
  familiesKey: string,
  priorBest: number,
): RunSetup {
  const saved = useDrillStore.getState().sprint;
  if (saved && saved.familiesKey === familiesKey) {
    const byId = new Map(bank.map((item) => [item.id, item]));
    const pool = saved.pool.flatMap((id) => byId.get(id) ?? []);
    if (pool.length >= MIN_SPRINT_ITEMS) return { seed: saved.seed, pool, priorBest: saved.priorBest, resumed: saved };
  }
  const seed = Date.now();
  return {
    seed,
    pool: seededShuffle(eligibleSprintItems(bank, items, families), mulberry32(seed)),
    priorBest,
    resumed: null,
  };
}

interface SprintRunnerProps {
  bank: DrillItem[];
  items: Record<string, ItemSrsState>;
  families: Record<DrillFamily, boolean>;
  /** Existing best for this family-set (read before the run, for "new best"). */
  priorBest: number;
  /** Persist the final score (store keeps the max). */
  onRecord: (familiesKey: string, score: number) => void;
  /** Exit the sprint screen (early ✕/Esc, or "Done" after finishing). */
  onExit: () => void;
}

export function SprintRunner({
  bank,
  items,
  families,
  priorBest,
  onRecord,
  onExit,
}: SprintRunnerProps) {
  const { t } = useTranslation();

  const familiesKey = useMemo(() => sprintFamiliesKey(families), [families]);
  // The seed + the shuffled pool (or the saved run), captured ONCE per mount
  // via a lazy initializer (allowed to be impure — it runs a single time, not
  // on every render). Every later shuffle (recycled laps) derives from the
  // seed, so render stays pure and the run order is stable across re-renders.
  const [run] = useState<RunSetup>(() => setUpRun(bank, items, families, familiesKey, priorBest));
  const enoughItems = run.pool.length >= MIN_SPRINT_ITEMS;

  // ── Empty-state: never start a run with too few eligible items. ─────────────
  if (!enoughItems) {
    return (
      <SprintEmptyState
        onExit={() => {
          useDrillStore.getState().saveSprint(null); // nothing to resume
          onExit();
        }}
      />
    );
  }

  return (
    <SprintActive
      pool={run.pool}
      seed={run.seed}
      familiesKey={familiesKey}
      priorBest={run.priorBest}
      resumed={run.resumed}
      onRecord={onRecord}
      onExit={onExit}
      t={t}
    />
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function SprintEmptyState({ onExit }: { onExit: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center gap-4 py-12">
      <p className="text-base font-medium" style={{ color: 'var(--text)' }}>
        {t('drill.sprint.empty')}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {t('drill.sprint.emptyHint')}
      </p>
      <button
        type="button"
        onClick={onExit}
        className="min-h-[44px] px-6 rounded-lg text-sm font-medium transition-colors"
        style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
      >
        {t('drill.sprint.exit')}
      </button>
    </div>
  );
}

// ─── Active run ────────────────────────────────────────────────────────────────

interface SprintActiveProps {
  pool: DrillItem[];
  /** Mount seed — lap re-shuffles derive from it, so render stays pure. */
  seed: number;
  familiesKey: string;
  priorBest: number;
  /** A saved run to continue (W9b); null = start at 60s, 0 correct. */
  resumed: SprintRun | null;
  onRecord: (familiesKey: string, score: number) => void;
  onExit: () => void;
  t: ReturnType<typeof useTranslation>['t'];
}

function SprintActive({ pool, seed, familiesKey, priorBest, resumed, onRecord, onExit, t }: SprintActiveProps) {
  const { i18n } = useTranslation();
  const lang = toContentLanguage(i18n.language);
  const [secondsLeft, setSecondsLeft] = useState(resumed?.secondsLeft ?? SPRINT_SECONDS);
  // 'finished' is DERIVED from the clock, never stored — so the finish effect
  // below performs side effects only (no setState-in-effect cascade).
  const finished = secondsLeft <= 0;
  const [correct, setCorrect] = useState(resumed?.correct ?? 0);
  // Monotonic question counter — drives both the pool index (modulo recycle)
  // and the input `key` so each question remounts a fresh input instance.
  const [step, setStep] = useState(resumed?.step ?? 0);
  const answersRef = useRef<HTMLDivElement>(null);
  useToastAvoid(answersRef);

  // ── Saving the run (W9b) ────────────────────────────────────────────────────
  // The latest numbers, mirrored into a ref (in an effect, never during
  // render) so the savers below always write the current run. Declared FIRST:
  // effects run in order, so the savers in the same commit see fresh values.
  const latest = useRef({ step, correct, secondsLeft });
  useEffect(() => {
    latest.current = { step, correct, secondsLeft };
  }, [step, correct, secondsLeft]);
  const recordedRef = useRef(resumed?.recorded ?? false);
  const exitedRef = useRef(false);
  const poolIds = useMemo(() => pool.map((item) => item.id), [pool]);
  const save = useCallback(() => {
    if (exitedRef.current) return; // closed: nothing to resume
    useDrillStore.getState().saveSprint({
      seed,
      pool: poolIds,
      ...latest.current,
      familiesKey,
      priorBest,
      recorded: recordedRef.current,
    });
  }, [seed, poolIds, familiesKey, priorBest]);
  // On mount (the run is now resumable) and after every answer…
  useEffect(() => save(), [step, correct, save]);
  // …every few seconds of the clock…
  useEffect(() => {
    if (secondsLeft % SAVE_EVERY_SECONDS === 0) save();
  }, [secondsLeft, save]);
  // …and whenever the page is hidden or goes away (a reload, an app switch),
  // or the learner leaves the Drill view (the run pauses there).
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === 'hidden') save();
    };
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      window.removeEventListener('pagehide', save);
      document.removeEventListener('visibilitychange', onHidden);
      save();
    };
  }, [save]);

  // ✕, Esc and Done close the run: it is no longer resumable.
  const exit = useCallback(() => {
    exitedRef.current = true;
    useDrillStore.getState().saveSprint(null);
    onExit();
  }, [onExit]);

  // Latest correct count, mirrored into a ref so the finish effect can read the
  // final score without re-subscribing the recorder each answer. Written in an
  // effect (never during render) per React 19 purity rules.
  const correctRef = useRef(correct);
  useEffect(() => {
    correctRef.current = correct;
  }, [correct]);

  // One persistent 1 Hz countdown, mounted once. The functional updater is
  // PURE — it only computes the next value (clamped at 0) with no side effects.
  // This matters under React 19, where a Strict-Mode dev double-invoke of the
  // updater would otherwise record twice. Stopping the timer and the one-shot
  // recording live in the effect below, keyed off the derived `finished`.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    intervalRef.current = id;
    return () => clearInterval(id);
  }, []);

  // Finish exactly once when the clock reaches 0: stop the interval and record
  // the final score. The ref guard makes the recording one-shot even if the
  // effect re-runs — or the page reloads on the score screen (the saved run
  // remembers it was recorded); the finished SCREEN is pure render off
  // `finished`.
  useEffect(() => {
    if (!finished) return;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;
    onRecord(familiesKey, correctRef.current);
    save();
  }, [finished, familiesKey, onRecord, save]);

  // Esc exits early WITHOUT recording.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exit]);

  // Resolve the current item purely: lap = floor(step / pool.length). Lap 0 is
  // the base pool; each later lap is a fresh re-shuffle seeded by (seed + lap),
  // so a recycled pool isn't an identical repeat — and it's a pure function of
  // step/pool/seed (no Date.now in render).
  const currentItem = useMemo(() => {
    const lap = Math.floor(step / pool.length);
    const idx = step % pool.length;
    if (lap === 0) return pool[idx];
    return seededShuffle(pool, mulberry32(seed + lap))[idx];
  }, [step, pool, seed]);

  const handleAnswer = useCallback(
    (payload: AnswerPayload) => {
      if (finished) return;
      const graded = gradeAnswer(currentItem, payload);
      if (graded.correct) setCorrect((c) => c + 1);
      // No feedback phase — advance immediately to keep the sprint fast.
      setStep((s) => s + 1);
    },
    [finished, currentItem],
  );

  if (finished) {
    const isNewBest = correct > priorBest;
    const best = Math.max(priorBest, correct);
    return (
      <div className="flex flex-col items-center text-center gap-5 py-12">
        <p className="text-3xl font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
          {t('drill.sprint.score', { count: correct })}
        </p>
        {isNewBest ? (
          <span
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent) 14%, transparent)',
              color: 'var(--accent)',
            }}
          >
            <span aria-hidden="true">★</span>
            {t('drill.sprint.newBest')}
          </span>
        ) : (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('drill.sprint.best', { count: best })}
          </span>
        )}
        <button
          type="button"
          onClick={exit}
          className="min-h-[44px] px-6 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          {t('drill.sprint.exit')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header: visible countdown · live score · ✕ exit */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-sm font-semibold tabular-nums px-2 py-0.5 rounded-md"
          style={{
            color: secondsLeft <= 10 ? 'var(--accent)' : 'var(--text)',
            backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
          }}
          aria-live="off"
        >
          {t('drill.sprint.timeLeft', { seconds: secondsLeft })}
        </span>
        <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {t('drill.sprint.score', { count: correct })}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={exit}
          className="flex items-center justify-center w-(--tap) h-(--tap) rounded-lg transition-colors"
          style={{ color: 'var(--text-dim)' }}
          aria-label={t('drill.endSession')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Prompt */}
      <p className="text-xl max-sm:text-lg font-medium leading-snug mb-6" style={{ color: 'var(--text)' }}>
        {itemPrompt(currentItem, t, lang)}
      </p>

      {/* Fresh input per question (key by step). Always 'answering' phase.
          Toasts never cover it (useToastAvoid). */}
      <div ref={answersRef}>
        <DrillInput key={step} item={currentItem} phase="answering" onAnswer={handleAnswer} />
      </div>
    </div>
  );
}
