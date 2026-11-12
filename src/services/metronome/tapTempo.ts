/**
 * "Tap": the tempo from the learner's taps (wave 3, stream M) — pure.
 *
 * The tempo is the average of the last few gaps between taps (up to
 * `WINDOW` gaps, i.e. the last five taps), so a learner who slows down is
 * followed within a few taps. A stray tap — one that came early or late, or
 * an extra one — is left out of the average: gaps more than `STRAY` (15 %)
 * away from the median of the window do not count.
 * A pause longer than `RESET_MS` starts a new count (that tap is the first
 * of it). One tap alone gives no tempo; the second gives one.
 */
import { clampTempo } from './clock';

/** Gaps averaged (the last five taps). */
export const WINDOW = 4;
/** A gap this far (as a share) from the window's median is a stray tap. */
export const STRAY = 0.15;
/** A pause longer than this starts a new count (30 beats a minute is a 2 s gap). */
export const RESET_MS = 2500;

export class TapTempo {
  private taps: number[] = [];

  /** Record a tap at `ms` (any monotonic clock); returns the tempo it gives, or null. */
  tap(ms: number): number | null {
    const prev = this.taps[this.taps.length - 1];
    if (prev !== undefined && (ms - prev > RESET_MS || ms <= prev)) this.taps = [];
    this.taps.push(ms);
    if (this.taps.length > WINDOW + 1) this.taps.splice(0, this.taps.length - (WINDOW + 1));
    return tempoFromTaps(this.taps);
  }

  reset(): void {
    this.taps = [];
  }

  /** Taps in the current count. */
  get count(): number {
    return this.taps.length;
  }
}

/** The tempo the taps give (see the header), or null with fewer than two. */
export function tempoFromTaps(taps: readonly number[]): number | null {
  if (taps.length < 2) return null;
  const gaps: number[] = [];
  for (let i = Math.max(1, taps.length - WINDOW); i < taps.length; i++) gaps.push(taps[i] - taps[i - 1]);
  // The median; with an even number of gaps, whichever middle gap more of
  // the others agree with (on a tie the longer: a stray extra tap makes two short gaps).
  const sorted = [...gaps].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  const candidates = sorted.length % 2 ? [sorted[half]] : [sorted[half], sorted[half - 1]];
  let kept: number[] = [];
  for (const ref of candidates) {
    const agree = gaps.filter((g) => Math.abs(g - ref) <= STRAY * ref);
    if (agree.length > kept.length) kept = agree;
  }
  const mean = kept.reduce((a, b) => a + b, 0) / kept.length;
  return clampTempo(60000 / mean);
}
