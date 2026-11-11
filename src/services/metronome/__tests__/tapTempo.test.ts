/**
 * "Tap" over tap sequences (wave 3, stream M, brief "Truth and tests"):
 * steady, slowing, one stray tap, a long pause that starts a new count.
 * The expected tempi are worked out by hand in each case (written next to
 * it), not with the module's own arithmetic.
 */
import { describe, it, expect } from 'vitest';
import { TapTempo, tempoFromTaps } from '../tapTempo';

/** Feed taps; the tempo reading after each one. */
function readings(times: number[]): (number | null)[] {
  const t = new TapTempo();
  return times.map((ms) => t.tap(ms));
}

/** Taps every `gap` ms from `from`. */
const steady = (n: number, gap: number, from = 1000) => Array.from({ length: n }, (_, i) => from + i * gap);

describe('steady taps', () => {
  it('72 a minute: every reading from the second tap is 72', () => {
    // 60000 / 72 = 833.33… ms; taps rounded to whole ms as a browser gives them.
    const taps = steady(10, 60000 / 72).map(Math.round);
    const r = readings(taps);
    expect(r[0]).toBeNull();
    expect(r.slice(1)).toEqual(Array(9).fill(72));
  });
  it('120 and 240 and 30 a minute', () => {
    expect(readings(steady(6, 500)).at(-1)).toBe(120);
    expect(readings(steady(6, 250)).at(-1)).toBe(240);
    // 30 a minute is a 2 s gap — under the pause that starts a new count.
    expect(readings(steady(6, 2000)).at(-1)).toBe(30);
  });
  it('faster than 240 or slower than 30 is held at the ends', () => {
    expect(readings(steady(4, 100)).at(-1)).toBe(240);
    expect(readings([0, 2400]).at(-1)).toBe(30); // 25 a minute
  });
});

describe('slowing down', () => {
  it('the reading follows the last taps', () => {
    // Gaps 600, 650, 700, 750, 800, 850 ms.
    const taps = [0, 600, 1250, 1950, 2700, 3500, 4350];
    const r = readings(taps);
    // After tap 2: one gap, 600 → 100. After tap 3: 600, 650 → mean 625 → 96.
    expect(r[1]).toBe(100);
    expect(r[2]).toBe(96);
    // After the last tap the window is the last four gaps: 700, 750, 800, 850
    // (each within 15 % of the window's median, 775 or 800) → mean 775 → 77.4 → 77.
    expect(r[6]).toBe(77);
    // Falling all the way.
    for (let i = 2; i < r.length; i++) expect(r[i]!).toBeLessThan(r[i - 1]!);
  });
});

describe('one stray tap', () => {
  // 72 a minute (833 ms), one tap 150 ms early: 0, 833, 1667, 2350 (should be 2500), 3333, …
  const taps = [0, 833, 1667, 2350, 3333, 4167, 5000, 5833, 6667];
  it('an early tap: every reading stays 72', () => {
    // At 2350: gaps 833, 834, 683 — 683 is 18 % off the median 833 → left out → (833 + 834) / 2 → 72.
    // At 3333: 833, 834, 683, 983 — both stray gaps out → 72. At 5833 the window is 983, 834, 833, 833 → 72.
    expect(readings(taps).slice(1)).toEqual(Array(taps.length - 1).fill(72));
  });
  it('a late tap the same', () => {
    const late = [0, 833, 1667, 2650, 3333, 4167, 5000, 5833];
    expect(readings(late).slice(1)).toEqual(Array(late.length - 1).fill(72));
  });
  it('an extra tap (a double tap) between two beats', () => {
    // 0, 833, 1667, 2100 (extra), 2500, 3333 …: gaps 833, 834, 433, 400, 833 …
    const extra = [0, 833, 1667, 2100, 2500, 3333, 4167, 5000, 5833];
    expect(readings(extra).slice(1)).toEqual(Array(extra.length - 1).fill(72));
  });
});

describe('a long pause', () => {
  it('starts a new count: the old taps no longer count', () => {
    const t = new TapTempo();
    for (const ms of steady(5, 500, 0)) t.tap(ms); // 120
    // 3 s later the learner taps again: a new count, no reading yet.
    expect(t.tap(2000 + 3000)).toBeNull();
    expect(t.count).toBe(1);
    // Then at 75 a minute (800 ms): 75 at once, not a mix with the old 120.
    expect(t.tap(5800)).toBe(75);
    expect(t.tap(6600)).toBe(75);
  });
  it('a pause of 2.4 s is still a gap (25 a minute, held at 30); 2.6 s starts again', () => {
    expect(readings([0, 2400])[1]).toBe(30);
    expect(readings([0, 2600])[1]).toBeNull();
  });
  it('a clock that went backwards starts a new count', () => {
    expect(readings([1000, 500, 1000])).toEqual([null, null, 120]);
  });
  it('a tap at the same moment as the last (a doubled event) starts a new count, never a 0 ms gap', () => {
    // A 0 ms gap would read 60000 / 0 = Infinity, held at 240.
    expect(readings([1000, 1000])).toEqual([null, null]);
    expect(readings([0, 500, 1000, 1000, 1500])).toEqual([null, 120, 120, null, 120]);
  });
  it('reset forgets the taps', () => {
    const t = new TapTempo();
    t.tap(0);
    t.reset();
    expect(t.tap(500)).toBeNull();
  });
});

describe('tempoFromTaps', () => {
  it('needs two taps', () => {
    expect(tempoFromTaps([])).toBeNull();
    expect(tempoFromTaps([5])).toBeNull();
    expect(tempoFromTaps([0, 1000])).toBe(60);
  });
});
