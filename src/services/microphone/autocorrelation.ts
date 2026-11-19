/**
 * The autocorrelation of a frame by FFT (audit M61, 19 November 2026): the
 * same numbers as the direct sum, r[τ] = Σ_{j=0}^{n−1−τ} x[j]·x[j+τ], up to
 * rounding (pinned against it in `autocorrelation.test.ts`), in O(n log n)
 * instead of O(n × lags). The detector's window grows with the sample rate,
 * so the direct sum's cost grew with its square: 1.0 ms a frame at 48 kHz,
 * 17.4 ms at 192 kHz on the builder's Mac, for a frame every 30 ms.
 *
 * Method: x zero-padded to a power of two N ≥ 2n (so the circular
 * correlation has no wrap-around), X = FFT(x), r = IFFT(|X|²) / N.
 */

interface Tables {
  cos: Float64Array;
  sin: Float64Array;
  reverse: Uint32Array;
}

const tablesBySize = new Map<number, Tables>();

function tablesFor(size: number): Tables {
  let t = tablesBySize.get(size);
  if (t) return t;
  const half = size >> 1;
  const cos = new Float64Array(half);
  const sin = new Float64Array(half);
  for (let i = 0; i < half; i++) {
    cos[i] = Math.cos((2 * Math.PI * i) / size);
    sin[i] = Math.sin((2 * Math.PI * i) / size);
  }
  const reverse = new Uint32Array(size);
  const bits = Math.log2(size);
  for (let i = 0; i < size; i++) {
    let r = 0;
    for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
    reverse[i] = r;
  }
  t = { cos, sin, reverse };
  tablesBySize.set(size, t);
  return t;
}

/** In-place radix-2 FFT; `sign` −1 forward, +1 inverse (unscaled). */
function fft(re: Float64Array, im: Float64Array, sign: 1 | -1): void {
  const size = re.length;
  const { cos, sin, reverse } = tablesFor(size);
  for (let i = 0; i < size; i++) {
    const j = reverse[i];
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }
  for (let len = 2; len <= size; len <<= 1) {
    const half = len >> 1;
    const step = size / len;
    for (let start = 0; start < size; start += len) {
      for (let k = 0; k < half; k++) {
        const wr = cos[k * step];
        const wi = sign * sin[k * step];
        const a = start + k;
        const b = a + half;
        const xr = re[b] * wr - im[b] * wi;
        const xi = re[b] * wi + im[b] * wr;
        re[b] = re[a] - xr;
        im[b] = im[a] - xi;
        re[a] += xr;
        im[a] += xi;
      }
    }
  }
}

/** r[0 … count − 1] of `x` (count ≤ x.length). */
export function autocorrelate(x: Float64Array, count: number): Float64Array {
  const n = x.length;
  let size = 1;
  while (size < 2 * n) size <<= 1;
  const re = new Float64Array(size);
  const im = new Float64Array(size);
  re.set(x);
  fft(re, im, -1);
  for (let i = 0; i < size; i++) {
    re[i] = re[i] * re[i] + im[i] * im[i];
    im[i] = 0;
  }
  fft(re, im, 1);
  const out = new Float64Array(Math.min(count, n));
  for (let t = 0; t < out.length; t++) out[t] = re[t] / size;
  return out;
}
