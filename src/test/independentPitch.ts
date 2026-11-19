/**
 * An INDEPENDENT pitch estimate, for the tests of the app's own sounds (audit
 * M60, 19 November 2026). It shares no code and no method with the app's
 * detector (`services/microphone/pitch.ts`, the McLeod method on a 46 ms
 * window): it is the plain autocorrelation of a LONG window (0.5 s), searched
 * only near the period the note should have (so it can never jump an
 * octave), refined over many periods, and read through the sustained part of
 * the sound as the median of its windows.
 *
 *   for each 0.5 s window, every 0.25 s, from `from` to `to` seconds:
 *     r(τ) = Σ x[i]·x[i+τ] / (n − τ)                  (by FFT, mean removed)
 *     p   = the highest r within ±0.7 semitone of the expected period,
 *           refined by a parabola through it and its two neighbours;
 *     then for k = 2, 4, 8 … while k·p ≤ n / 4: the highest r within
 *           ±p/4 of k·p, refined the same way, and p = that lag / k;
 *     the window's pitch = rate / p.
 *   the sound's pitch = the median of its windows (min and max are given too:
 *   a plucked string glides, sharper while it is loud).
 *
 * SELF-CONTAINED on purpose — no import, no module-level helper — so a
 * browser test can hand this very function to `page.evaluate` and run it on
 * what Chromium rendered.
 */
export interface IndependentPitch {
  /** Cents from `expectedHz`, the median of the windows. */
  cents: number;
  min: number;
  max: number;
  windows: number[];
}

export function independentPitch(
  samples: ArrayLike<number>,
  rate: number,
  expectedHz: number,
  from = 0.1,
  to = 2.5,
): IndependentPitch {
  const WINDOW_S = 0.5;
  const HOP_S = 0.25;

  const fft = (re: Float64Array, im: Float64Array, inverse: boolean) => {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        let t = re[i]; re[i] = re[j]; re[j] = t;
        t = im[i]; im[i] = im[j]; im[j] = t;
      }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const angle = ((inverse ? 2 : -2) * Math.PI) / len;
      const wr = Math.cos(angle);
      const wi = Math.sin(angle);
      for (let i = 0; i < n; i += len) {
        let cr = 1;
        let ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const ar = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
          const ai = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
          re[i + k + len / 2] = re[i + k] - ar;
          im[i + k + len / 2] = im[i + k] - ai;
          re[i + k] += ar;
          im[i + k] += ai;
          const nr = cr * wr - ci * wi;
          ci = cr * wi + ci * wr;
          cr = nr;
        }
      }
    }
  };

  const autocorrelation = (x: Float64Array): Float64Array => {
    const n = x.length;
    let size = 1;
    while (size < 2 * n) size <<= 1;
    const re = new Float64Array(size);
    const im = new Float64Array(size);
    re.set(x);
    fft(re, im, false);
    for (let i = 0; i < size; i++) {
      re[i] = re[i] * re[i] + im[i] * im[i];
      im[i] = 0;
    }
    fft(re, im, true);
    const r = new Float64Array(n);
    for (let t = 0; t < n; t++) r[t] = re[t] / size / (n - t);
    return r;
  };

  const peak = (r: Float64Array, lo: number, hi: number): number => {
    const a = Math.max(1, Math.floor(lo));
    const b = Math.min(r.length - 2, Math.ceil(hi));
    let best = a;
    for (let i = a; i <= b; i++) if (r[i] > r[best]) best = i;
    const y0 = r[best - 1];
    const y1 = r[best];
    const y2 = r[best + 1];
    const d = y0 - 2 * y1 + y2;
    return best + (d === 0 ? 0 : (0.5 * (y0 - y2)) / d);
  };

  const windowPitch = (start: number, n: number): number => {
    const x = new Float64Array(n);
    let mean = 0;
    for (let i = 0; i < n; i++) mean += samples[start + i];
    mean /= n;
    for (let i = 0; i < n; i++) x[i] = samples[start + i] - mean;
    const r = autocorrelation(x);
    const period = rate / expectedHz;
    const spread = 2 ** (0.7 / 12);
    let p = peak(r, period / spread, period * spread);
    for (let k = 2; k * p <= n / 4; k *= 2) p = peak(r, k * p - p / 4, k * p + p / 4) / k;
    return 1200 * Math.log2(rate / p / expectedHz);
  };

  const n = Math.round(WINDOW_S * rate);
  const last = Math.min(samples.length, Math.round(to * rate)) - n;
  const windows: number[] = [];
  for (let start = Math.round(from * rate); start <= last; start += Math.round(HOP_S * rate)) windows.push(windowPitch(start, n));
  if (windows.length === 0) return { cents: NaN, min: NaN, max: NaN, windows };
  const sorted = [...windows].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  const cents = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return { cents, min: sorted[0], max: sorted[sorted.length - 1], windows };
}
