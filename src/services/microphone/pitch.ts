/**
 * The pitch of ONE note heard by the microphone (wave 3, brief T).
 *
 * Method: the McLeod Pitch Method (P. McLeod and G. Wyvill, "A smarter way
 * to find pitch", ICMC 2005): the normalised square difference function
 * (NSDF) of the frame, its "key maxima" (the highest point of each positive
 * stretch after the first zero crossing), and the FIRST key maximum that
 * reaches 0.93 of the highest one — which is what keeps it off the octave
 * below (the period doubled is as periodic as the period) and, with the
 * normalisation, off the octave above when the fundamental is weak — then a
 * parabola through the peak for a period finer than a sample. The peak's
 * height is the clarity: near 1 for one steady note, low for noise.
 *
 * One more test, because a chord can be as periodic as a note (C4 + G4
 * repeats every C3 period): the note found must be heard as a note. Its
 * fundamental is measured directly (a Blackman-windowed projection on the
 * exact frequency, over the whole frame); if it is too weak, its 2nd to 5th
 * harmonics must all be there, as they are on a string or a voice, and are
 * not when two notes merely share a period (C4 + G4 heard "as C3" has no C3,
 * no E4 = its 5th harmonic). A frame that fails is no note: null.
 *
 * Range C2 (65 Hz, below the low D of Drop D) to C7 (2,093 Hz). A4 = 440 Hz.
 * Pure: no Web Audio, no DOM — the tests feed it synthesised tones.
 *
 * The window follows the sample rate (audit M61, 19 November 2026): the NSDF
 * holds at least 2.5 periods of the lowest frequency looked for at ANY rate
 * (`nsdfWindow`), and the microphone hands over a frame twice that long
 * (`analysisFrameSize`), so every rate sees the same stretch of time — 46 ms
 * and 93 ms at 44.1 / 88.2 kHz, 43 ms and 85 ms at 48 / 96 / 192 kHz. Until
 * then both were fixed in samples (2,048 and 4,096), which at 192 kHz is 11
 * and 21 ms: too short for a period of D2, E♭2 or E2, which gave no reading.
 * The NSDF's autocorrelation is taken by FFT (`autocorrelation.ts`): the same
 * numbers, at a cost that no longer grows with the square of the rate.
 *
 * Cost of a whole detectPitch call (a frame every 30 ms), on the builder's
 * Mac (an M4, Node, with nine other builds running): 0.2 ms at 44.1 / 48 kHz,
 * 0.4 ms at 88.2 / 96 kHz, 1.0 ms at 192 kHz (p95 2.1 ms). Before the review's
 * fix pass it was 1.0–1.15 / 2.1–2.2 / 4.4 ms (p95 7.4 ms) — mostly the
 * one-note check's cosine and sine a sample (the reviewer measured 82–87 %) —
 * and every frame allocated 92 / 184 / 370 KB of arrays; now the window is
 * computed once per frame length, the transform rotates a phasor, and the
 * arrays are reused (`scratch`), with every output of the detector
 * bit-identical to before on 9,822 frames (the unit tests' corpus at five
 * rates, the reviewer's 1,022, a sweep from 8 to 384 kHz, the 39 guitar
 * samples). A phone is slower (not measured).
 */
import { autocorrelate } from './autocorrelation.ts';

/** Lowest and highest frequencies looked for (with room for a string tuned far off). */
export const MIN_FREQUENCY = 60;
export const MAX_FREQUENCY = 2200;
/** A clarity at or above this is a note the app is sure of. */
export const SURE_CLARITY = 0.9;
/** Below this RMS (about −48 dBFS) the room is quiet: nothing is reported. */
export const QUIET_RMS = 0.004;

/** The key-maximum threshold of the McLeod method (k in the paper). */
const KEY_MAX_SHARE = 0.93;
/** The NSDF window holds at least this many periods of MIN_FREQUENCY. */
const WINDOW_PERIODS = 2.5;
/** The smallest NSDF window (the one 44.1 and 48 kHz have always had). */
const MIN_NSDF_WINDOW = 2048;
/** An AnalyserNode's largest fftSize (Web Audio API). */
const MAX_FRAME = 32768;

/**
 * The NSDF is computed on the most recent this-many samples: the smallest
 * power of two from 2,048 up holding WINDOW_PERIODS periods of MIN_FREQUENCY
 * (2,048 at 44.1 / 48 kHz, 4,096 at 88.2 / 96 kHz, 8,192 at 176.4 / 192 kHz,
 * 16,384 at 384 kHz), and never more than half of MAX_FRAME, so the frame can
 * always be twice the window (above 393,216 Hz the cap holds it at 16,384).
 */
export function nsdfWindow(sampleRate: number): number {
  let n = MIN_NSDF_WINDOW;
  while (n < (WINDOW_PERIODS * sampleRate) / MIN_FREQUENCY && 4 * n <= MAX_FRAME) n *= 2;
  return n;
}

/** The frame the microphone hands the detector (the analyser's fftSize): twice the NSDF window. */
export function analysisFrameSize(sampleRate: number): number {
  return Math.min(MAX_FRAME, 2 * nsdfWindow(sampleRate));
}
/** Fundamental at least this far below the strongest harmonic (−30 dB) counts as present. */
const FUNDAMENTAL_FLOOR = 10 ** (-30 / 20);
/** Each of harmonics 2–5 at least this far below the strongest (−40 dB) when the fundamental is weak. */
const HARMONIC_FLOOR = 10 ** (-40 / 20);

export interface PitchEstimate {
  /** Hz. */
  frequency: number;
  /** 0–1: how periodic the frame is at that frequency (the NSDF peak). */
  clarity: number;
}

/** A frame's pitch, or null when the room is quiet or nothing in it is one note. */
export function detectPitch(frame: Float32Array, sampleRate: number): PitchEstimate | null {
  const total = frame.length;
  if (total < 256) return null;
  let sum = 0;
  for (let i = 0; i < total; i++) sum += frame[i];
  const mean = sum / total;
  let energy = 0;
  for (let i = 0; i < total; i++) {
    const v = frame[i] - mean;
    energy += v * v;
  }
  if (Math.sqrt(energy / total) < QUIET_RMS) return null;

  // The NSDF on the most recent samples: n_τ = 2·r(τ) / m(τ), r by FFT.
  const n = Math.min(total, nsdfWindow(sampleRate));
  const x = scratch('x', n);
  for (let i = 0; i < n; i++) x[i] = frame[total - n + i] - mean;
  const maxLag = Math.min(Math.floor(sampleRate / MIN_FREQUENCY), n - 2);
  const minLag = Math.max(2, Math.floor(sampleRate / MAX_FREQUENCY));
  const nsdf = scratch('nsdf', maxLag + 2);
  const r = autocorrelate(x, maxLag + 2);
  let m = 0;
  for (let i = 0; i < n; i++) m += 2 * x[i] * x[i];
  for (let tau = 0; tau <= maxLag + 1; tau++) {
    if (tau > 0) m -= x[n - tau] * x[n - tau] + x[tau - 1] * x[tau - 1];
    nsdf[tau] = m > 0 ? (2 * r[tau]) / m : 0;
  }

  // Key maxima: one per positive stretch, after the first negative crossing.
  const peaks: number[] = [];
  let tau = 1;
  while (tau <= maxLag && nsdf[tau] > 0) tau++;
  let best = -1;
  for (; tau <= maxLag; tau++) {
    if (nsdf[tau] > 0) {
      if (best < 0 || nsdf[tau] > nsdf[best]) best = tau;
    } else if (best >= 0) {
      peaks.push(best);
      best = -1;
    }
  }
  if (best >= 0 && best < maxLag) peaks.push(best);
  const usable = peaks.filter((p) => p >= minLag);
  if (usable.length === 0) return null;
  let highest = 0;
  for (const p of usable) highest = Math.max(highest, nsdf[p]);
  const chosen = usable.find((p) => nsdf[p] >= KEY_MAX_SHARE * highest)!;

  const a = nsdf[chosen - 1];
  const b = nsdf[chosen];
  const c = nsdf[chosen + 1];
  const denom = a - 2 * b + c;
  const shift = denom === 0 ? 0 : (0.5 * (a - c)) / denom;
  const period = chosen + shift;
  const clarity = Math.min(1, b - 0.25 * (a - c) * shift);
  const frequency = sampleRate / period;
  if (frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) return null;
  if (!soundsAsOneNote(frame, mean, sampleRate, frequency)) return null;
  return { frequency, clarity };
}

/**
 * Arrays reused from frame to frame (the frame's length is fixed for a
 * session: it follows the device's rate), so a frame allocates nothing large.
 * Each is fully rewritten before it is read.
 */
const scratches = new Map<string, Float64Array>();
function scratch(name: string, length: number): Float64Array {
  let a = scratches.get(name);
  if (!a || a.length !== length) {
    a = new Float64Array(length);
    scratches.set(name, a);
  }
  return a;
}

/** The Blackman window of a frame's length, computed once per length. */
let blackman: Float64Array | null = null;
function blackmanFor(n: number): Float64Array {
  if (!blackman || blackman.length !== n) {
    blackman = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const phase = (2 * Math.PI * i) / (n - 1);
      blackman[i] = 0.42 - 0.5 * Math.cos(phase) + 0.08 * Math.cos(2 * phase);
    }
  }
  return blackman;
}

/** The phasor is set exactly again this often (samples), so its rounding never builds up. */
const PHASOR_RESET = 4096;

/**
 * The amplitude of the windowed frame `v` at exactly `frequency`: |Σ v[i]·e^(−jωi)|.
 * e^(−jωi) by a rotating phasor (one complex multiply a sample) instead of a
 * cosine and a sine a sample: the same sum up to rounding, set exactly every
 * PHASOR_RESET samples (`pitch.test.ts` pins it to the direct sum, and every
 * decision of the detector to the direct version on its corpora).
 */
export function amplitudeAt(v: Float64Array, sampleRate: number, frequency: number): number {
  const n = v.length;
  const w = (2 * Math.PI * frequency) / sampleRate;
  const cw = Math.cos(w);
  const sw = Math.sin(w);
  let re = 0;
  let im = 0;
  let c = 1;
  let s = 0;
  for (let i = 0; i < n; i++) {
    if (i % PHASOR_RESET === 0) {
      c = Math.cos(w * i);
      s = Math.sin(w * i);
    }
    re += v[i] * c;
    im -= v[i] * s;
    const next = c * cw - s * sw;
    s = s * cw + c * sw;
    c = next;
  }
  return Math.hypot(re, im);
}

/** The fundamental is there, or harmonics 2–5 all are (a string, a voice — not two notes sharing a period). */
function soundsAsOneNote(frame: Float32Array, mean: number, sampleRate: number, f0: number): boolean {
  const nyquist = sampleRate / 2;
  const n = frame.length;
  const win = blackmanFor(n);
  const v = scratch('windowed', n);
  for (let i = 0; i < n; i++) v[i] = (frame[i] - mean) * win[i];
  const amps: number[] = [];
  for (let k = 1; k <= 8 && k * f0 < 0.9 * nyquist; k++) amps.push(amplitudeAt(v, sampleRate, k * f0));
  const strongest = Math.max(...amps);
  if (strongest <= 0) return false;
  if (amps[0] >= FUNDAMENTAL_FLOOR * strongest) return true;
  if (amps.length < 5) return false;
  return amps.slice(1, 5).every((a) => a >= HARMONIC_FLOOR * strongest);
}

/** A4 = 440 Hz. The note nearest a frequency and how far from it, in cents (−50…+50). */
export function nearestNote(frequency: number): { midi: number; cents: number } {
  const exact = 69 + 12 * Math.log2(frequency / 440);
  const midi = Math.round(exact);
  return { midi, cents: (exact - midi) * 100 };
}

/** Cents from a target pitch (MIDI number) to a frequency; negative = flat. */
export function centsFrom(frequency: number, targetMidi: number): number {
  return 1200 * Math.log2(frequency / midiToFrequency(targetMidi));
}

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}
