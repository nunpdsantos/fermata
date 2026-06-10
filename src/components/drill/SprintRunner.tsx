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
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DrillFamily, DrillItem, ItemSrsState } from '../../core/types/drill';
import { mulberry32, seededShuffle } from '../../core/utils/prng';
import { gradeAnswer, type AnswerPayload } from './grading';
import { DrillInput } from './DrillInput';
import {
  eligibleSprintItems,
  sprintFamiliesKey,
  MIN_SPRINT_ITEMS,
} from './sprintSelectors';

/** Sprint duration in seconds. */
const SPRINT_SECONDS = 60;

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

  // One wall-clock seed + the shuffled pool, both captured ONCE per mount via
  // lazy initializers (allowed to be impure — they run a single time, not on
  // every render). Every later shuffle (recycled laps) derives from the seed,
  // so render stays pure and the run order is stable across re-renders.
  const [seed] = useState(() => Date.now());
  const [pool] = useState<DrillItem[]>(() =>
    seededShuffle(eligibleSprintItems(bank, items, families), mulberry32(seed)),
  );

  const familiesKey = useMemo(() => sprintFamiliesKey(families), [families]);
  const enoughItems = pool.length >= MIN_SPRINT_ITEMS;

  // ── Empty-state: never start a run with too few eligible items. ─────────────
  if (!enoughItems) {
    return <SprintEmptyState onExit={onExit} />;
  }

  return (
    <SprintActive
      pool={pool}
      seed={seed}
      familiesKey={familiesKey}
      priorBest={priorBest}
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
  onRecord: (familiesKey: string, score: number) => void;
  onExit: () => void;
  t: ReturnType<typeof useTranslation>['t'];
}

function SprintActive({ pool, seed, familiesKey, priorBest, onRecord, onExit, t }: SprintActiveProps) {
  const [secondsLeft, setSecondsLeft] = useState(SPRINT_SECONDS);
  // 'finished' is DERIVED from the clock, never stored — so the finish effect
  // below performs side effects only (no setState-in-effect cascade).
  const finished = secondsLeft <= 0;
  const [correct, setCorrect] = useState(0);
  // Monotonic question counter — drives both the pool index (modulo recycle)
  // and the input `key` so each question remounts a fresh input instance.
  const [step, setStep] = useState(0);

  // Latest correct count, mirrored into a ref so the finish effect can read the
  // final score without re-subscribing the recorder each answer. Written in an
  // effect (never during render) per React 19 purity rules.
  const correctRef = useRef(0);
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
  // effect re-runs; the finished SCREEN is pure render off `finished`.
  const recordedRef = useRef(false);
  useEffect(() => {
    if (!finished || recordedRef.current) return;
    recordedRef.current = true;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onRecord(familiesKey, correctRef.current);
  }, [finished, familiesKey, onRecord]);

  // Esc exits early WITHOUT recording.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

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
          onClick={onExit}
          className="min-h-[44px] px-6 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
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
          onClick={onExit}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
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
        {t(currentItem.promptKey, currentItem.promptParams)}
      </p>

      {/* Fresh input per question (key by step). Always 'answering' phase. */}
      <DrillInput key={step} item={currentItem} phase="answering" onAnswer={handleAnswer} />
    </div>
  );
}
