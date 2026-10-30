/**
 * "By heart" rule (audit W7-01 / W7-05, decision D-15).
 *
 * An item is by heart when it was answered correctly on the FIRST try in each
 * of at least 3 sessions in a row (since its last lapse), those sessions span
 * at least 2 calendar days AND at least 18 hours from first to last, and the
 * median time of the last 3 first answers is under 3 s. One lapse — a wrong FIRST answer in a session — demotes it, and a
 * right answer on the in-session retry does not undo that.
 *
 * Ported from the auditors' probe `sched-probe.mts` (Scenarios A and B) and
 * verify-D's `d5b.mts` (lapse undone by the retry). Timestamps are built with
 * the LOCAL Date constructor so "calendar day" means the same thing here as on
 * the learner's phone, whatever time zone the suite runs in.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyAnswer,
  BY_HEART_DAYS,
  BY_HEART_MIN_SPAN_MS,
  BY_HEART_SESSIONS,
  HISTORY_CAP,
  sessionFirstAnswers,
} from '../drillScheduler';
import type { ItemSrsState } from '../../core/types/drill';

const MIN = 60_000;
/** Local wall-clock time on day `d` of October 2026 (d = 1 → 1 Oct). */
const at = (d: number, h = 12, m = 0) => new Date(2026, 9, d, h, m).getTime();

type Step = [session: string, ts: number, correct: boolean, ms: number];

function run(steps: Step[], start?: ItemSrsState): ItemSrsState {
  let s = start;
  for (const [session, ts, correct, ms] of steps) s = applyAnswer(s, correct, ms, ts, session);
  return s!;
}

describe('by heart — constants match decision D-15', () => {
  it('needs 3 sessions over 2 calendar days, at least 18 h apart end to end', () => {
    expect(BY_HEART_SESSIONS).toBe(3);
    expect(BY_HEART_DAYS).toBe(2);
    expect(BY_HEART_MIN_SPAN_MS).toBe(18 * 60 * 60 * 1000);
  });
});

describe('by heart — first answer of each session counts (W7-01)', () => {
  it('audit Scenario A: wrong first in every session, right on the retry → never by heart', () => {
    const s = run([
      ['sA', at(1), false, 4000],
      ['sA', at(1) + 3 * MIN, true, 1200],
      ['sB', at(3), false, 4000],
      ['sB', at(3) + 3 * MIN, true, 1200],
      ['sC', at(6), false, 4000],
      ['sC', at(6) + 3 * MIN, true, 1200],
    ]);
    expect(s.tier).not.toBe('byHeart');
    expect(s.tier).toBe('review');
  });

  it('a lapse is not undone by the in-session retry (verify-D extra 2)', () => {
    const heart = run([
      ['s1', at(1), true, 2000],
      ['s1', at(1) + 2 * MIN, true, 2000],
      ['s2', at(2), true, 2000],
      ['s3', at(4), true, 2000],
    ]);
    expect(heart.tier).toBe('byHeart');

    const lapsed = applyAnswer(heart, false, 4000, at(8), 's4');
    expect(lapsed.tier).toBe('review');
    // The retry in the SAME session is fast and right — still a lapse.
    const retried = applyAnswer(lapsed, true, 900, at(8) + 4 * MIN, 's4');
    expect(retried.tier).toBe('review');
  });

  it('after a lapse, 3 fresh first-try sessions over 2 days are needed again', () => {
    let s = run([
      ['s1', at(1), true, 2000],
      ['s1', at(1) + 2 * MIN, true, 2000],
      ['s2', at(2), true, 2000],
      ['s3', at(4), true, 2000],
      ['s4', at(8), false, 4000],
      ['s4', at(8) + 4 * MIN, true, 1000],
    ]);
    expect(s.tier).toBe('review');
    s = applyAnswer(s, true, 1500, at(10), 's5');
    expect(s.tier).toBe('review');
    s = applyAnswer(s, true, 1500, at(12), 's6');
    expect(s.tier).toBe('review'); // only 2 sessions since the lapse
    s = applyAnswer(s, true, 1500, at(15), 's7');
    expect(s.tier).toBe('byHeart');
  });

  it('speed is read from the first answers, not the last', () => {
    // Old rule (last answer per session): 1000 / 5000 / 1000 → median 1000 → by heart.
    // First answers: 5000 / 5000 / 1000 → median 5000 → not fast enough.
    const s = run([
      ['s1', at(1), true, 5000],
      ['s1', at(1) + 3 * MIN, true, 1000], // second exposure of a new item
      ['s2', at(2), true, 5000],
      ['s3', at(4), true, 1000],
    ]);
    expect(s.tier).toBe('review');
  });
});

describe('by heart — spacing over calendar days (W7-05)', () => {
  it('audit Scenario B: three sessions inside ten minutes → not by heart', () => {
    const s = run([
      ['s1', at(1, 10, 0), true, 2000],
      ['s1', at(1, 10, 2), true, 1500],
      ['s2', at(1, 10, 6), true, 1400],
      ['s3', at(1, 10, 10), true, 1300],
    ]);
    expect(s.tier).toBe('review');
  });

  it('the same item reaches by heart once a later session falls on another day', () => {
    const s = run([
      ['s1', at(1, 10, 0), true, 2000],
      ['s1', at(1, 10, 2), true, 1500],
      ['s2', at(1, 10, 6), true, 1400],
      ['s3', at(1, 10, 10), true, 1300],
      ['s4', at(2, 9, 0), true, 1300],
    ]);
    expect(s.tier).toBe('byHeart');
  });

  // Review finding: 2 calendar days alone let a run straddling midnight
  // (23:30, 23:50, 23:59, 00:08) reach by heart in under 40 minutes. The run
  // must ALSO span ≥ 18 h between its first and last first-answers.
  it('midnight loophole: 23:30 / 23:50 / 23:59 / 00:08 is two dates but not by heart', () => {
    const s = run([
      ['s1', at(1, 23, 30), true, 2000],
      ['s1', at(1, 23, 32), true, 2000],
      ['s2', at(1, 23, 50), true, 2000],
      ['s3', at(1, 23, 59), true, 2000],
      ['s4', at(2, 0, 8), true, 2000],
    ]);
    expect(s.tier).toBe('review');
  });

  it('late evening, then the next evening: two dates and ≥ 18 h → by heart', () => {
    const s = run([
      ['s1', at(1, 22, 0), true, 2000],
      ['s1', at(1, 22, 5), true, 2000],
      ['s2', at(1, 23, 30), true, 2000],
      ['s3', at(2, 18, 0), true, 2000], // 20 h after the first
    ]);
    expect(s.tier).toBe('byHeart');
  });

  it('just under 18 h is not enough; just over is', () => {
    const base: Step[] = [
      ['s1', at(1, 6, 0), true, 2000],
      ['s1', at(1, 6, 3), true, 2000],
      ['s2', at(1, 12, 0), true, 2000],
    ];
    expect(run([...base, ['s3', at(1, 23, 59) + 0, true, 2000]]).tier).toBe('review'); // same date
    expect(run([...base, ['s3', at(1, 6, 0) + BY_HEART_MIN_SPAN_MS - MIN, true, 2000]]).tier).toBe('review');
    expect(run([...base, ['s3', at(1, 6, 0) + BY_HEART_MIN_SPAN_MS, true, 2000]]).tier).toBe('byHeart');
  });

  it('18 h within ONE calendar day is still not enough (both rules apply)', () => {
    const s = run([
      ['s1', at(1, 0, 30), true, 2000],
      ['s1', at(1, 0, 33), true, 2000],
      ['s2', at(1, 12, 0), true, 2000],
      ['s3', at(1, 23, 30), true, 2000], // 23 h later, same date
    ]);
    expect(s.tier).toBe('review');
  });
});

describe('by heart — the same rules in every time zone', () => {
  const ZONES = [
    'UTC',
    'Europe/London',
    'Atlantic/Madeira',
    'Europe/Lisbon',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Pacific/Kiritimati', // UTC+14
    'Pacific/Pago_Pago', // UTC−11
  ];
  // vi.stubEnv writes process.env.TZ, which Node's Date honours immediately.
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  for (const zone of ZONES) {
    it(`${zone}: the midnight run is never by heart; an 18 h+ two-day run is`, () => {
      vi.stubEnv('TZ', zone);
      // Proof the zone took effect: Date's local hour matches Intl's for `zone`.
      const probe = Date.UTC(2026, 9, 1, 12, 0);
      const zoneHour = Number(
        new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: 'numeric', hourCycle: 'h23' }).format(probe),
      );
      expect(new Date(probe).getHours()).toBe(zoneHour);
      // Local wall-clock times in `zone` (Date reads TZ on every call in Node).
      const midnight = run([
        ['m1', at(1, 23, 30), true, 2000],
        ['m1', at(1, 23, 32), true, 2000],
        ['m2', at(1, 23, 50), true, 2000],
        ['m3', at(1, 23, 59), true, 2000],
        ['m4', at(2, 0, 8), true, 2000],
      ]);
      expect(new Date(at(2, 0, 8)).getDate()).toBe(2); // really the next local date
      expect(midnight.tier).toBe('review');

      const spaced = run([
        ['p1', at(1, 21, 0), true, 2000],
        ['p1', at(1, 21, 3), true, 2000],
        ['p2', at(1, 22, 0), true, 2000],
        ['p3', at(2, 19, 0), true, 2000], // 22 h later, next local date
      ]);
      expect(spaced.tier).toBe('byHeart');
    });
  }
});

describe('history cap keeps every session\'s first answer', () => {
  it('cap stays at 10 records', () => {
    let s: ItemSrsState | undefined;
    for (let i = 0; i < 15; i++) s = applyAnswer(s, true, 2000, at(1 + i), `S${i}`);
    expect(HISTORY_CAP).toBe(10);
    expect(s!.history).toHaveLength(10);
  });

  it('drops in-session retries before any session\'s first answer', () => {
    // S1 (day 1): wrong, wrong, right. S2..S10 (day 2): one right answer each.
    // 12 records. Trimming the OLDEST records would erase S1's wrong first
    // answer and make S1 look like a first-try success on another day (and the
    // 2-day rule would then pass). Trimming retries first keeps S1 = wrong.
    const steps: Step[] = [
      ['S01', at(1, 12, 0), false, 5000],
      ['S01', at(1, 12, 2), false, 4000],
      ['S01', at(1, 12, 4), true, 2000],
    ];
    for (let k = 2; k <= 10; k++) steps.push([`S${String(k).padStart(2, '0')}`, at(2, 12, k), true, 1500]);
    const s = run(steps);

    expect(s.history).toHaveLength(10);
    const firsts = sessionFirstAnswers(s.history);
    expect(firsts[0]).toMatchObject({ sessionId: 'S01', correct: false });
    // Every session is still represented by its true first answer.
    expect(firsts.map((r) => r.sessionId)).toEqual(
      ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10'],
    );
    // All nine first-try successes are on ONE day → not by heart yet.
    expect(s.tier).toBe('review');
  });

  it('never drops the newest answer', () => {
    // Ten single-answer sessions, then a retry in the 10th session: the
    // retry is the newest record and must survive the trim.
    const steps: Step[] = [];
    for (let k = 1; k <= 10; k++) steps.push([`S${k}`, at(k), true, 2000]);
    let s = run(steps);
    s = applyAnswer(s, false, 3000, at(11), 'S11');
    s = applyAnswer(s, true, 1000, at(11) + MIN, 'S11');
    expect(s.history).toHaveLength(10);
    expect(s.history[s.history.length - 1]).toMatchObject({ sessionId: 'S11', correct: true, ms: 1000 });
  });
});

describe('sessionFirstAnswers', () => {
  it('returns the first record of each session in order', () => {
    const h = [
      { ts: 1, correct: false, ms: 1, sessionId: 'a' },
      { ts: 2, correct: true, ms: 2, sessionId: 'a' },
      { ts: 3, correct: true, ms: 3, sessionId: 'b' },
    ];
    expect(sessionFirstAnswers(h)).toEqual([h[0], h[2]]);
  });
});

// ─── Clock moved backwards (review of W7) ───────────────────────────────────
// A phone clock set earlier than an item's last review made ts-fsrs throw
// "Invalid delta_t" inside recordAnswer, so the Drill crashed on that answer.

describe('applyAnswer — device clock earlier than the last review', () => {
  it('does not throw, records the answer, and keeps the schedule moving forward', () => {
    const reviewed = run([
      ['s1', at(10), true, 2000],
      ['s1', at(10) + 2 * MIN, true, 2000],
      ['s2', at(12), true, 2000],
    ]);
    const lastReview = reviewed.card.last_review!;
    expect(lastReview).toBe(at(12));
    const back = at(5); // a week earlier than the last review
    let after: ItemSrsState | undefined;
    expect(() => {
      after = applyAnswer(reviewed, true, 1500, back, 's3');
    }).not.toThrow();
    expect(after!.history).toHaveLength(reviewed.history.length + 1);
    expect(after!.card.last_review!).toBeGreaterThanOrEqual(lastReview);
    expect(after!.card.due).toBeGreaterThanOrEqual(lastReview);
    expect(Number.isFinite(after!.card.stability)).toBe(true);
  });

  it('a wrong answer with a backwards clock also does not throw', () => {
    const reviewed = run([
      ['s1', at(10), true, 2000],
      ['s1', at(10) + 2 * MIN, true, 2000],
    ]);
    expect(() => applyAnswer(reviewed, false, 4000, at(1), 's2')).not.toThrow();
  });
});
