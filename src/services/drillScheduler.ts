/**
 * Drill Scheduler — pure FSRS-backed scheduling with latency grading and mastery tiers.
 * All functions accept injectable `now` param (number, ms epoch) for deterministic testing.
 * Zero React imports.
 */
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type Grade as FsrsGrade } from 'ts-fsrs';
import type { AnswerRecord, ItemSrsState, MasteryTier, SerializedCard } from '../core/types/drill';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Number of history entries retained per item (ring buffer). */
const HISTORY_CAP = 10;

/** Answer latency threshold above which a correct answer grades as 'hard'. */
export const SLOW_MS = 6000;

/** Latency threshold below which a session's answer counts toward byHeart median. */
export const BY_HEART_MS = 3000;

// ─── FSRS Instance ───────────────────────────────────────────────────────────

/** Module-level FSRS instance at 90% target retention. */
const F = fsrs(generatorParameters({ request_retention: 0.9 }));

// ─── Grade Types ─────────────────────────────────────────────────────────────

/** Possible grades derived from correctness and response latency. */
export type Grade = 'again' | 'hard' | 'good';

/** Map from Grade string to ts-fsrs Grade (non-Manual Rating). */
const RATING: Record<Grade, FsrsGrade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
};

// ─── Grade Calculation ───────────────────────────────────────────────────────

/**
 * Derive a Grade from correctness and response latency.
 * Wrong → 'again'. Correct + slow (> SLOW_MS) → 'hard'. Correct + fast → 'good'.
 */
export function gradeFor(correct: boolean, ms: number): Grade {
  if (!correct) return 'again';
  return ms > SLOW_MS ? 'hard' : 'good';
}

// ─── Serialization ───────────────────────────────────────────────────────────

/**
 * Deserialize a stored SerializedCard back into a ts-fsrs Card (numbers → Dates).
 * Preserves all fields including the deprecated elapsed_days for round-trip fidelity.
 */
export function toCard(s: SerializedCard): Card {
  return {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state,
    learning_steps: s.learning_steps,
    ...(s.last_review !== undefined ? { last_review: new Date(s.last_review) } : {}),
  };
}

/**
 * Serialize a ts-fsrs Card to StorableCard format (Dates → numbers).
 * last_review is omitted when undefined so round-trip fidelity is preserved.
 */
export function fromCard(c: Card): SerializedCard {
  return {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    learning_steps: c.learning_steps,
    ...(c.last_review !== undefined ? { last_review: c.last_review.getTime() } : {}),
  };
}

// ─── Tier Computation ────────────────────────────────────────────────────────

/**
 * Compute the new MasteryTier from the full answer history and previous tier state.
 *
 * Rules (in order):
 * 1. Empty history → 'new'.
 * 2. prev.tier 'new' | 'learning': promote to 'review' if introCorrectCount >= 2 OR
 *    (latest answer correct AND latest.sessionId !== prev.introSessionId); else 'learning'.
 * 3. review | byHeart: take the last answer per distinct session (chronological, last-write-wins),
 *    considering up to the 3 most recent distinct sessions.
 *    - Exactly 3 sessions, all correct, and median ms < BY_HEART_MS → 'byHeart'.
 *    - Latest answer wrong → 'review'.
 *    - Otherwise: preserve 'byHeart' if prev was byHeart and 3-session rule still holds; else 'review'.
 */
export function computeTier(
  history: AnswerRecord[],
  prev: { tier: MasteryTier; introSessionId?: string; introCorrectCount: number },
): MasteryTier {
  // Rule 1: no history → new
  if (history.length === 0) return 'new';

  const latest = history[history.length - 1];

  // Rule 2: item is new or still in learning
  if (prev.tier === 'new' || prev.tier === 'learning') {
    const promotedViaIntro = prev.introCorrectCount >= 2;
    const promotedViaCrossSession =
      latest.correct && latest.sessionId !== prev.introSessionId;

    if (promotedViaIntro || promotedViaCrossSession) return 'review';
    return 'learning';
  }

  // Rule 3: review or byHeart — evaluate last 3 distinct sessions
  // Build a map of sessionId → last answer (chronological, last-write-wins)
  const sessionMap = new Map<string, AnswerRecord>();
  for (const record of history) {
    sessionMap.set(record.sessionId, record);
  }

  // Collect distinct sessions in chronological order of their last answer
  // (Map insertion order + last-write-wins gives the right order)
  const sessionList = Array.from(sessionMap.values());

  // Latest answer is wrong → demote
  if (!latest.correct) return 'review';

  // Take the 3 most recent distinct sessions
  const last3 = sessionList.slice(-3);

  if (last3.length === 3) {
    const allCorrect = last3.every((r) => r.correct);
    if (allCorrect) {
      const msSorted = [...last3.map((r) => r.ms)].sort((a, b) => a - b);
      const median = msSorted[1]; // middle value of 3
      if (median < BY_HEART_MS) return 'byHeart';
    }
  }

  // If prev was byHeart and we didn't re-qualify, drop to review
  // (latest is correct here — wrong case handled above)
  if (prev.tier === 'byHeart') return 'review';

  return 'review';
}

// ─── Apply Answer ─────────────────────────────────────────────────────────────

/**
 * Apply a single drill answer and return the new ItemSrsState.
 * Mutates nothing — returns a new state object.
 *
 * @param state - Previous SRS state (undefined for a brand-new item).
 * @param correct - Whether the learner answered correctly.
 * @param ms - Response latency in milliseconds.
 * @param now - Current timestamp (ms epoch) — injectable for tests.
 * @param sessionId - Opaque session identifier for the current drill session.
 */
export function applyAnswer(
  state: ItemSrsState | undefined,
  correct: boolean,
  ms: number,
  now: number,
  sessionId: string,
): ItemSrsState {
  // Restore or create the FSRS card
  const card: Card = state ? toCard(state.card) : createEmptyCard(new Date(now));

  // Schedule via FSRS
  const grade = gradeFor(correct, ms);
  const { card: nextCard } = F.next(card, new Date(now), RATING[grade]);

  // Build the new answer record
  const record: AnswerRecord = { ts: now, correct, ms, sessionId };

  // Append and cap history
  const rawHistory: AnswerRecord[] = [...(state?.history ?? []), record];
  const newHistory = rawHistory.length > HISTORY_CAP
    ? rawHistory.slice(rawHistory.length - HISTORY_CAP)
    : rawHistory;

  // Track intro session and correct count within it
  const introSessionId = state?.introSessionId ?? sessionId;
  const introCorrectCount =
    (state?.introCorrectCount ?? 0) + (correct && sessionId === introSessionId ? 1 : 0);

  // Compute new tier
  const tier = computeTier(newHistory, {
    tier: state?.tier ?? 'new',
    introSessionId,
    introCorrectCount,
  });

  return {
    card: fromCard(nextCard),
    history: newHistory,
    tier,
    introSessionId,
    introCorrectCount,
  };
}

// ─── Due Check ───────────────────────────────────────────────────────────────

/**
 * Returns true if the item should appear in the drill queue right now.
 * 'new' items are never due (they must be introduced, not scheduled).
 * undefined state (unseen item) is never due.
 */
export function isDue(state: ItemSrsState | undefined, now: number): boolean {
  if (!state) return false;
  return state.tier !== 'new' && now >= state.card.due;
}
