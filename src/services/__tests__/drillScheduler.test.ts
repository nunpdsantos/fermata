/**
 * drillScheduler tests — FSRS-backed scheduler with latency grading and by-heart tiers.
 * All timestamps are fixed; no Date.now() usage.
 */
import { describe, expect, it } from 'vitest';
import {
  applyAnswer,
  gradeFor,
  isDue,
  computeTier,
  toCard,
  fromCard,
  SLOW_MS,
} from '../drillScheduler';
import type { ItemSrsState } from '../../core/types/drill';

const DAY = 86_400_000;
const t0 = 1_750_000_000_000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function answerSeq(
  specs: Array<{ correct: boolean; ms: number; session: string; at: number }>,
): ItemSrsState {
  let state: ItemSrsState | undefined;
  for (const s of specs) state = applyAnswer(state, s.correct, s.ms, s.at, s.session);
  return state!;
}

// ─── gradeFor ────────────────────────────────────────────────────────────────

describe('gradeFor', () => {
  it('grades by correctness then latency', () => {
    expect(gradeFor(false, 1000)).toBe('again');
    expect(gradeFor(true, SLOW_MS + 1)).toBe('hard');
    expect(gradeFor(true, SLOW_MS - 1)).toBe('good');
    // boundary: exactly SLOW_MS
    expect(gradeFor(true, SLOW_MS)).toBe('good');
  });
});

// ─── Tier Promotion ──────────────────────────────────────────────────────────

describe('tier promotion', () => {
  it('promotes new → learning → review within the intro session', () => {
    const s1 = applyAnswer(undefined, true, 2000, t0, 'S1');
    expect(s1.tier).toBe('learning');
    const s2 = applyAnswer(s1, true, 2500, t0 + 60_000, 'S1');
    expect(s2.tier).toBe('review');
  });

  it('new item on wrong answer stays learning', () => {
    const s1 = applyAnswer(undefined, false, 4000, t0, 'S1');
    expect(s1.tier).toBe('learning');
  });

  it('reaches byHeart after 3 fast correct answers in distinct sessions, demotes on lapse', () => {
    const s = answerSeq([
      { correct: true, ms: 2000, session: 'S1', at: t0 },
      { correct: true, ms: 2400, session: 'S1', at: t0 + 60_000 },
      { correct: true, ms: 2100, session: 'S2', at: t0 + 1 * DAY },
      { correct: true, ms: 1900, session: 'S3', at: t0 + 3 * DAY },
    ]);
    expect(s.tier).toBe('byHeart');
    const lapsed = applyAnswer(s, false, 4000, t0 + 5 * DAY, 'S4');
    expect(lapsed.tier).toBe('review');
  });

  it('slow session does not block byHeart when the 3-session median still qualifies', () => {
    // Arrive at review via intro session
    const base = answerSeq([
      { correct: true, ms: 2000, session: 'S1', at: t0 },
      { correct: true, ms: 2500, session: 'S1', at: t0 + 60_000 },
    ]);
    expect(base.tier).toBe('review');

    // S2: slow correct (ms > BY_HEART_MS)
    const s2 = applyAnswer(base, true, 5000, t0 + 1 * DAY, 'S2');
    expect(s2.tier).toBe('review');

    // S3: fast correct
    const s3 = applyAnswer(s2, true, 2100, t0 + 3 * DAY, 'S3');
    // last 3 sessions: S1 (2000 or 2500 — last answer 2500), S2 (5000), S3 (2100)
    // median of [2500, 5000, 2100] sorted = [2100, 2500, 5000] → median 2500 < BY_HEART_MS=3000 → byHeart
    // BUT wait: sessions are S1, S2, S3. Last answer per session: S1→2500ms, S2→5000ms, S3→2100ms
    // sorted ms: 2100, 2500, 5000 → median 2500 < 3000 → byHeart IS reached
    expect(s3.tier).toBe('byHeart');
  });

  it('median math: sessions with ms 2000/5000/5500 → median 5000 → NOT byHeart', () => {
    const base = answerSeq([
      { correct: true, ms: 2000, session: 'S1', at: t0 },
      { correct: true, ms: 2500, session: 'S1', at: t0 + 60_000 },
    ]);
    // S2: fast correct to move to byHeart candidate territory
    const s2 = applyAnswer(base, true, 5000, t0 + 1 * DAY, 'S2');
    const s3 = applyAnswer(s2, true, 5500, t0 + 3 * DAY, 'S3');
    // last answer per session: S1→2500ms, S2→5000ms, S3→5500ms
    // sorted: [2500, 5000, 5500] → median 5000 ≥ BY_HEART_MS=3000 → NOT byHeart
    expect(s3.tier).toBe('review');
  });

  it('median math: sessions with ms 2000/5000/2100 → median 2100 → byHeart IS reached', () => {
    const base = answerSeq([
      { correct: true, ms: 2000, session: 'S1', at: t0 },
      { correct: true, ms: 2500, session: 'S1', at: t0 + 60_000 },
    ]);
    // S2: slow but still correct
    const s2 = applyAnswer(base, true, 5000, t0 + 1 * DAY, 'S2');
    const s3 = applyAnswer(s2, true, 2100, t0 + 3 * DAY, 'S3');
    // last answer per session: S1→2500ms, S2→5000ms, S3→2100ms
    // sorted: [2100, 2500, 5000] → median 2500 < 3000 → byHeart
    expect(s3.tier).toBe('byHeart');
  });
});

// ─── Promote via different session while still learning ──────────────────────

describe('learning → review cross-session promotion', () => {
  it('correct in new session while still learning promotes to review', () => {
    // One correct in intro session → learning (introCorrectCount=1, needs 2 for intro path)
    const s1 = applyAnswer(undefined, true, 2000, t0, 'S1');
    expect(s1.tier).toBe('learning');
    expect(s1.introCorrectCount).toBe(1);

    // Different session correct → promotes to review via cross-session path
    const s2 = applyAnswer(s1, true, 2000, t0 + 1 * DAY, 'S2');
    expect(s2.tier).toBe('review');
  });

  it('wrong in different session while still learning stays learning', () => {
    const s1 = applyAnswer(undefined, true, 2000, t0, 'S1');
    expect(s1.tier).toBe('learning');

    // Different session WRONG → stays learning
    const s2 = applyAnswer(s1, false, 4000, t0 + 1 * DAY, 'S2');
    expect(s2.tier).toBe('learning');
  });
});

// ─── FSRS due dates ──────────────────────────────────────────────────────────

describe('FSRS due dates', () => {
  it('due dates grow on good, reset shorter on again', () => {
    const a = applyAnswer(undefined, true, 2000, t0, 'S1');
    const b = applyAnswer(a, true, 2000, t0 + 1 * DAY, 'S2');
    const c = applyAnswer(b, true, 2000, t0 + 4 * DAY, 'S3');
    expect(c.card.due).toBeGreaterThan(b.card.due);
    const lapsed = applyAnswer(c, false, 2000, t0 + 10 * DAY, 'S4');
    expect(lapsed.card.due - (t0 + 10 * DAY)).toBeLessThan(c.card.due - (t0 + 4 * DAY));
    expect(isDue(lapsed, lapsed.card.due + 1)).toBe(true);
  });
});

// ─── isDue ───────────────────────────────────────────────────────────────────

describe('isDue', () => {
  it('isDue(undefined) is false', () => {
    expect(isDue(undefined, t0)).toBe(false);
  });

  it('tier new items are never due even past their due date', () => {
    // Directly test via computeTier with empty history — confirms 'new' tier is initial state
    const tierResult = computeTier([], { tier: 'new', introSessionId: undefined, introCorrectCount: 0 });
    expect(tierResult).toBe('new');
    // Build a fresh state manually and test isDue guard
    // The state after applyAnswer has tier=learning; we need to confirm that a
    // raw 'new' state returned by the no-history path would not be due.
    // isDue checks tier !== 'new', so a state with tier:'new' is never due.
    const newState: ItemSrsState = {
      card: { due: t0 - DAY, stability: 0, difficulty: 0, elapsed_days: 0, scheduled_days: 0, reps: 0, lapses: 0, state: 0, learning_steps: 0 },
      history: [],
      tier: 'new',
      introCorrectCount: 0,
    };
    expect(isDue(newState, t0 + 100 * DAY)).toBe(false);
  });

  it('isDue returns true at exactly due time', () => {
    const s = applyAnswer(undefined, true, 2000, t0, 'S1');
    const s2 = applyAnswer(s, true, 2000, t0 + 60_000, 'S1');
    expect(s2.tier).toBe('review');
    expect(isDue(s2, s2.card.due)).toBe(true);
  });

  it('isDue returns false before due time', () => {
    const s = applyAnswer(undefined, true, 2000, t0, 'S1');
    const s2 = applyAnswer(s, true, 2000, t0 + 60_000, 'S1');
    expect(isDue(s2, s2.card.due - 1)).toBe(false);
  });
});

// ─── Serialization Round-Trip ─────────────────────────────────────────────────

describe('serialization round-trip', () => {
  it('toCard(fromCard(c)) preserves every field including state enum', () => {
    const s = answerSeq([
      { correct: true, ms: 2000, session: 'S1', at: t0 },
      { correct: true, ms: 2400, session: 'S1', at: t0 + 60_000 },
      { correct: true, ms: 2100, session: 'S2', at: t0 + 1 * DAY },
    ]);
    const card = toCard(s.card);
    const serialized = fromCard(card);
    const roundTripped = toCard(serialized);

    expect(roundTripped.due.getTime()).toBe(card.due.getTime());
    expect(roundTripped.stability).toBe(card.stability);
    expect(roundTripped.difficulty).toBe(card.difficulty);
    expect(roundTripped.elapsed_days).toBe(card.elapsed_days);
    expect(roundTripped.scheduled_days).toBe(card.scheduled_days);
    expect(roundTripped.reps).toBe(card.reps);
    expect(roundTripped.lapses).toBe(card.lapses);
    expect(roundTripped.state).toBe(card.state);
    expect(roundTripped.learning_steps).toBe(card.learning_steps);
    if (card.last_review !== undefined) {
      expect(roundTripped.last_review?.getTime()).toBe(card.last_review.getTime());
    } else {
      expect(roundTripped.last_review).toBeUndefined();
    }
  });

  it('preserves undefined last_review on a fresh card', () => {
    const freshCard = toCard({
      due: t0,
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 0,
      learning_steps: 0,
      // last_review intentionally absent
    });
    expect(freshCard.last_review).toBeUndefined();
    const serialized = fromCard(freshCard);
    expect(serialized.last_review).toBeUndefined();
    const roundTripped = toCard(serialized);
    expect(roundTripped.last_review).toBeUndefined();
  });
});

// ─── History Cap ─────────────────────────────────────────────────────────────

describe('history cap', () => {
  it('history is capped at 10 entries', () => {
    let state: ItemSrsState | undefined;
    for (let i = 0; i < 15; i++) {
      state = applyAnswer(state, true, 2000, t0 + i * DAY, `S${i}`);
    }
    expect(state!.history).toHaveLength(10);
  });
});

// ─── introCorrectCount ────────────────────────────────────────────────────────

describe('introCorrectCount', () => {
  it('counts only intro-session corrects', () => {
    const s1 = applyAnswer(undefined, true, 2000, t0, 'S1');
    expect(s1.introCorrectCount).toBe(1);
    // Later session correct does NOT increment introCorrectCount
    const s2 = applyAnswer(s1, true, 2000, t0 + 1 * DAY, 'S2');
    expect(s2.introCorrectCount).toBe(1);
  });

  it('wrong answer in intro session does not increment introCorrectCount', () => {
    const s1 = applyAnswer(undefined, false, 4000, t0, 'S1');
    expect(s1.introCorrectCount).toBe(0);
  });

  it('byHeart preserved when 3-session rule still holds after correct answer', () => {
    const s = answerSeq([
      { correct: true, ms: 2000, session: 'S1', at: t0 },
      { correct: true, ms: 2400, session: 'S1', at: t0 + 60_000 },
      { correct: true, ms: 2100, session: 'S2', at: t0 + 1 * DAY },
      { correct: true, ms: 1900, session: 'S3', at: t0 + 3 * DAY },
    ]);
    expect(s.tier).toBe('byHeart');

    // Another fast correct in a new session; last 3 sessions = S2, S3, S4 all fast
    const s4 = applyAnswer(s, true, 2000, t0 + 7 * DAY, 'S4');
    expect(s4.tier).toBe('byHeart');
  });
});
