/**
 * The detector's parts that follow the sample rate (audit M61, and the
 * review's fix pass, 19 November 2026):
 *  - the NSDF window and the frame at every rate a device may give, at each
 *    boundary where the window doubles and at the analyser's largest frame;
 *  - the one-note check's transform (a rotating phasor) against the direct
 *    windowed sum with a cosine and a sine a sample;
 *  - the NSDF's autocorrelation is the FFT one (autocorrelation.ts), called once
 *    a frame on the window the rate asks for.
 * The expected sizes are worked out here from the rule, not read from pitch.ts.
 */
import { describe, expect, it, vi } from 'vitest';

const calls: { length: number; count: number }[] = [];
vi.mock('../autocorrelation', async (importOriginal) => {
  const real = await importOriginal<typeof import('../autocorrelation')>();
  return {
    autocorrelate: (x: Float64Array, count: number) => {
      calls.push({ length: x.length, count });
      return real.autocorrelate(x, count);
    },
  };
});

const { amplitudeAt, analysisFrameSize, detectPitch, MIN_FREQUENCY, nsdfWindow } = await import('../pitch');

/** The rule: the smallest power of two from 2,048 holding 2.5 periods of 60 Hz, no larger than half of 32,768. */
function expectedWindow(rate: number): number {
  let n = 2048;
  while (n < (2.5 * rate) / 60 && n < 16384) n *= 2;
  return n;
}

describe('the window and the frame at every rate', () => {
  // Where the window doubles: 2.5 periods of 60 Hz = 2,048 / 4,096 / 8,192 / 16,384 samples exactly.
  const RATES = [8000, 22050, 44100, 48000, 49152, 49153, 88200, 96000, 98304, 98305, 176400, 192000, 196608, 196609, 384000, 393216, 393217, 768000];
  it('lowest frequency looked for is 60 Hz (the rule below assumes it)', () => {
    expect(MIN_FREQUENCY).toBe(60);
  });
  for (const rate of RATES) {
    it(`${rate} Hz: window ${expectedWindow(rate)}, frame ${2 * expectedWindow(rate)}`, () => {
      expect(nsdfWindow(rate)).toBe(expectedWindow(rate));
      expect(analysisFrameSize(rate)).toBe(2 * expectedWindow(rate));
    });
  }
  it('the boundaries fall where 2.5 periods of 60 Hz fill the window exactly, and the frame never passes an AnalyserNode\'s 32,768', () => {
    expect([nsdfWindow(49152), nsdfWindow(49153)]).toEqual([2048, 4096]);
    expect([nsdfWindow(98304), nsdfWindow(98305)]).toEqual([4096, 8192]);
    expect([nsdfWindow(196608), nsdfWindow(196609)]).toEqual([8192, 16384]);
    expect([nsdfWindow(393216), nsdfWindow(393217)]).toEqual([16384, 16384]);
    for (const rate of [384000, 768000, 1_000_000]) expect(analysisFrameSize(rate)).toBe(32768);
    for (const rate of RATES) expect(analysisFrameSize(rate)).toBeLessThanOrEqual(32768);
    // 2.5 periods of 60 Hz held wherever the cap allows it.
    for (const rate of RATES.filter((r) => r <= 393216)) expect(nsdfWindow(rate)).toBeGreaterThanOrEqual((2.5 * rate) / 60);
  });
});

describe('the one-note check\'s transform', () => {
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
  function direct(v: Float64Array, rate: number, f: number): number {
    const w = (2 * Math.PI * f) / rate;
    let re = 0;
    let im = 0;
    for (let i = 0; i < v.length; i++) {
      re += v[i] * Math.cos(w * i);
      im -= v[i] * Math.sin(w * i);
    }
    return Math.hypot(re, im);
  }
  for (const [n, rate] of [[4096, 48000], [8192, 96000], [16384, 192000], [32768, 384000]] as const) {
    it(`equals the direct sum (a cosine and a sine a sample): ${n} samples at ${rate} Hz, from 60 Hz to near Nyquist`, () => {
      const random = rng(n);
      const v = new Float64Array(n).map((_, i) => 0.3 * Math.sin(i * 0.013) + 0.2 * (random() * 2 - 1));
      let scale = 0;
      for (const x of v) scale += Math.abs(x);
      for (const f of [60, 82.4, 246.9, 1046.5, 2093, 9000, 0.45 * rate]) {
        expect(Math.abs(amplitudeAt(v, rate, f) - direct(v, rate, f)), `${f} Hz`).toBeLessThanOrEqual(1e-9 * scale);
      }
    });
  }
});

describe('the NSDF\'s autocorrelation is the FFT one', () => {
  for (const rate of [44100, 48000, 96000, 192000]) {
    it(`at ${rate / 1000} kHz: once a frame, on the ${expectedWindow(rate)}-sample window`, () => {
      const size = analysisFrameSize(rate);
      const frame = new Float32Array(size).map((_, i) => 0.3 * Math.sin((2 * Math.PI * 110 * i) / rate) + 0.2 * Math.sin((4 * Math.PI * 110 * i) / rate));
      calls.length = 0;
      const got = detectPitch(frame, rate);
      expect(got).not.toBeNull();
      expect(Math.abs(1200 * Math.log2(got!.frequency / 110))).toBeLessThan(1);
      const n = expectedWindow(rate);
      expect(calls).toEqual([{ length: n, count: Math.min(Math.floor(rate / 60), n - 2) + 2 }]);
    });
  }
});
