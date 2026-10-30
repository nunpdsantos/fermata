/**
 * Drill Scheduler — pure FSRS-backed scheduling with latency grading and mastery tiers.
 * All functions accept injectable `now` param (number, ms epoch) for deterministic testing.
 * Zero React imports.
 */
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type Grade as FsrsGrade } from 'ts-fsrs';
import type { AnswerRecord, ItemSrsState, MasteryTier, SerializedCard } from '../core/types/drill';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Number of history entries retained per item (see capHistory for what is dropped first). */
export const HISTORY_CAP = 10;

/** Answer latency threshold above which a correct answer grades as 'hard'. */
export const SLOW_MS = 6000;

/** Median first-answer latency must be below this for 'byHeart'. */
export const BY_HEART_MS = 3000;

/** 'byHeart' needs this many sessions in a row answered right on the first try… */
export const BY_HEART_SESSIONS = 3;

/** …spread over at least this many calendar days (decision D-15, audit W7-05)… */
export const BY_HEART_DAYS = 2;

/**
 * …and at least this long from the run's first to its last first-answer.
 * Calendar days alone let a run straddling midnight (23:30, 23:50, 23:59,
 * 00:08) count as "two days" inside 40 minutes (review of W7).
 */
export const BY_HEART_MIN_SPAN_MS = 18 * 60 * 60 * 1000;

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
    elapsed_days: s.elapsed_days, // @deprecated in ts-fsrs 5.x; keep for round-trip fidelity
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
    elapsed_days: c.elapsed_days, // @deprecated in ts-fsrs 5.x; keep for round-trip fidelity
    scheduled_days: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    learning_steps: c.learning_steps,
    ...(c.last_review !== undefined ? { last_review: c.last_review.getTime() } : {}),
  };
}

// ─── History helpers ─────────────────────────────────────────────────────────

/**
 * The first answer of each distinct session, in chronological order.
 * "By heart" is judged on these alone: a right answer on the in-session retry
 * after a miss proves nothing about recall (audit W7-01).
 */
export function sessionFirstAnswers(history: AnswerRecord[]): AnswerRecord[] {
  const seen = new Set<string>();
  const firsts: AnswerRecord[] = [];
  for (const record of history) {
    if (seen.has(record.sessionId)) continue;
    seen.add(record.sessionId);
    firsts.push(record);
  }
  return firsts;
}

/**
 * Trim a history to HISTORY_CAP records. In-session repeats (any answer that is
 * not the first of its session) go first, oldest first, and the newest record
 * is always kept; only when every remaining record is its session's first
 * answer are whole old sessions dropped. A naive "drop the oldest" trim could
 * erase a session's wrong first answer and leave its right retry looking like
 * a first-try success.
 */
export function capHistory(history: AnswerRecord[]): AnswerRecord[] {
  if (history.length <= HISTORY_CAP) return history;
  const out = history.slice();
  while (out.length > HISTORY_CAP) {
    const seen = new Set<string>();
    let repeatAt = -1;
    for (let i = 0; i < out.length - 1; i++) {
      if (seen.has(out[i].sessionId)) {
        repeatAt = i;
        break;
      }
      seen.add(out[i].sessionId);
    }
    if (repeatAt === -1) break;
    out.splice(repeatAt, 1);
  }
  return out.length > HISTORY_CAP ? out.slice(out.length - HISTORY_CAP) : out;
}

/** Local calendar day of a timestamp ("Tuesday on the learner's phone"). */
function calendarDay(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Decision D-15 / audit W7-01, W7-05. True when the item's most recent
 * sessions show automatic recall:
 *  - the first answer was right in each of at least BY_HEART_SESSIONS sessions
 *    in a row, counting back from the latest session (a wrong first answer —
 *    a lapse — ends the run);
 *  - those sessions fall on at least BY_HEART_DAYS different calendar days
 *    AND the run's first and last first-answers are at least
 *    BY_HEART_MIN_SPAN_MS apart (no "two days" across one midnight);
 *  - the median time of the last BY_HEART_SESSIONS first answers is under
 *    BY_HEART_MS.
 */
export function meetsByHeart(history: AnswerRecord[]): boolean {
  const firsts = sessionFirstAnswers(history);
  const run: AnswerRecord[] = [];
  for (let i = firsts.length - 1; i >= 0 && firsts[i].correct; i--) run.unshift(firsts[i]);
  if (run.length < BY_HEART_SESSIONS) return false;

  const days = new Set(run.map((r) => calendarDay(r.ts)));
  if (days.size < BY_HEART_DAYS) return false;
  if (run[run.length - 1].ts - run[0].ts < BY_HEART_MIN_SPAN_MS) return false;

  const recentMs = run
    .slice(-BY_HEART_SESSIONS)
    .map((r) => r.ms)
    .sort((a, b) => a - b);
  const median = recentMs[Math.floor(recentMs.length / 2)];
  return median < BY_HEART_MS;
}

// ─── Tier Computation ────────────────────────────────────────────────────────

/**
 * Compute the new MasteryTier from the full answer history and previous tier state.
 *
 * Rules (in order):
 * 1. Empty history → 'new'.
 * 2. prev.tier 'new' | 'learning': promote to 'review' if introCorrectCount >= 2 OR
 *    (latest answer correct AND latest.sessionId !== prev.introSessionId); else 'learning'.
 * 3. review | byHeart: 'byHeart' when meetsByHeart(history) (first answer per
 *    session, ≥ 3 sessions in a row over ≥ 2 calendar days and ≥ 18 h,
 *    median < 3 s);
 *    otherwise 'review'. A wrong first answer in the latest session therefore
 *    demotes, and the in-session retry cannot undo it.
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

  // Rule 3: review or byHeart
  return meetsByHeart(history) ? 'byHeart' : 'review';
}

/**
 * Persist v1 → v2 (decision D-15): re-judge a stored tier under the
 * first-answer rule without ever promoting. 'new' / 'learning' are untouched;
 * 'review' stays 'review'; 'byHeart' survives only if its history still meets
 * the new rule. A v1 history at the cap may have lost the oldest session's
 * first answer to the old oldest-first trim, so that session is left out of
 * the judgement (conservative: it can only shorten the run).
 */
export function migrateTierV1(state: ItemSrsState): MasteryTier {
  if (state.tier !== 'byHeart') return state.tier;
  let history = state.history;
  if (history.length >= HISTORY_CAP && history.length > 0) {
    const oldest = history[0].sessionId;
    history = history.filter((r) => r.sessionId !== oldest);
  }
  return meetsByHeart(history) ? 'byHeart' : 'review';
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
  // A device clock set earlier than this item's last review would make
  // ts-fsrs throw ("Invalid delta_t") and crash the answer. Time never runs
  // backwards for an item: clamp to its last review / last recorded answer.
  const at = Math.max(
    now,
    state?.card.last_review ?? -Infinity,
    state?.history.length ? state.history[state.history.length - 1].ts : -Infinity,
  );

  // Restore or create the FSRS card
  const card: Card = state ? toCard(state.card) : createEmptyCard(new Date(at));

  // Schedule via FSRS. Belt and braces: should ts-fsrs still reject the card,
  // keep the old schedule rather than lose the answer or crash the Drill.
  const grade = gradeFor(correct, ms);
  let nextCard: Card = card;
  try {
    nextCard = F.next(card, new Date(at), RATING[grade]).card;
  } catch (err) {
    console.warn('[drillScheduler] FSRS update skipped:', err);
  }

  // Build the new answer record
  const record: AnswerRecord = { ts: at, correct, ms, sessionId };

  // Append and cap history (session first answers outlive in-session retries)
  const newHistory = capHistory([...(state?.history ?? []), record]);

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
