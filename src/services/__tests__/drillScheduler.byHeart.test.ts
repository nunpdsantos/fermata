/**
 * "By heart" rule (audit W7-01 / W7-05, decision D-15).
 *
 * An item is by heart when it was answered correctly on the FIRST try in each
 * of at least 3 sessions in a row (since its last lapse), those sessions span
 * at least 2 calendar days, and the median time of the last 3 first answers is
 * under 3 s. One lapse — a wrong FIRST answer in a session — demotes it, and a
 * right answer on the in-session retry does not undo that.
 *
 * Ported from the auditors' probe `sched-probe.mts` (Scenarios A and B) and
 * verify-D's `d5b.mts` (lapse undone by the retry). Timestamps are built with
 * the LOCAL Date constructor so "calendar day" means the same thing here as on
 * the learner's phone, whatever time zone the suite runs in.
 */
import { describe, expect, it } from 'vitest';
import {
  applyAnswer,
  BY_HEART_DAYS,
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
  it('needs 3 sessions over 2 calendar days', () => {
    expect(BY_HEART_SESSIONS).toBe(3);
    expect(BY_HEART_DAYS).toBe(2);
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

  it('calendar days, not 24-hour gaps: late evening then early next morning counts as 2 days', () => {
    const s = run([
      ['s1', at(1, 22, 0), true, 2000],
      ['s1', at(1, 22, 5), true, 2000],
      ['s2', at(1, 23, 30), true, 2000],
      ['s3', at(2, 0, 30), true, 2000],
    ]);
    expect(s.tier).toBe('byHeart');
  });
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
