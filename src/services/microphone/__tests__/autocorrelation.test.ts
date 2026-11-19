/**
 * The FFT autocorrelation (audit M61) gives the direct sum's numbers:
 * r[τ] = Σ_{j=0}^{n−1−τ} x[j]·x[j+τ], computed here the slow way, for the
 * window sizes the detector uses at 44.1 / 48, 88.2 / 96, 192 and 384 kHz, the
 * largest frame, and lengths that are not a power of two; and its working
 * memory reused from one size to another gives the same numbers.
 */
import { describe, expect, it } from 'vitest';
import { autocorrelate } from '../autocorrelation';

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function direct(x: Float64Array, count: number): Float64Array {
  const out = new Float64Array(count);
  for (let t = 0; t < count; t++) {
    let r = 0;
    for (let j = 0; j < x.length - t; j++) r += x[j] * x[j + t];
    out[t] = r;
  }
  return out;
}

describe('autocorrelate', () => {
  // The windows at 44.1 / 48, 88.2 / 96, 192 and 384 kHz (2,048 to 16,384), and 32,768 (an AnalyserNode's largest frame).
  for (const [n, count] of [[1, 1], [3, 3], [100, 60], [1000, 999], [2048, 802], [4096, 1602], [8192, 3202], [16384, 6402], [32768, 3202]] as const) {
    it(`equals the direct sum: n = ${n}, ${count} lags`, () => {
      const random = rng(n);
      // A tone with noise, as a frame is.
      const x = new Float64Array(n).map((_, i) => 0.3 * Math.sin(i * 0.071) + 0.2 * (random() * 2 - 1));
      const fast = autocorrelate(x, count);
      const slow = direct(x, count);
      expect(fast.length).toBe(count);
      const scale = slow[0];
      let worst = 0;
      for (let t = 0; t < count; t++) worst = Math.max(worst, Math.abs(fast[t] - slow[t]));
      expect(worst).toBeLessThanOrEqual(1e-9 * scale);
    });
  }

  it('reused working memory: a size after a larger one, and the same size twice, give the direct sum', () => {
    const random = rng(7);
    for (const n of [8192, 2048, 2048, 4096]) {
      const x = new Float64Array(n).map(() => random() * 2 - 1);
      const fast = Array.from(autocorrelate(x, 100));
      const slow = Array.from(direct(x, 100));
      for (let t = 0; t < 100; t++) expect(Math.abs(fast[t] - slow[t])).toBeLessThanOrEqual(1e-9 * slow[0]);
    }
  });

  it('asks for no more lags than the frame has', () => {
    expect(autocorrelate(new Float64Array([1, 2, 3]), 10)).toHaveLength(3);
  });
});
