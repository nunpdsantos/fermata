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
 */

/** Lowest and highest frequencies looked for (with room for a string tuned far off). */
export const MIN_FREQUENCY = 60;
export const MAX_FREQUENCY = 2200;
/** A clarity at or above this is a note the app is sure of. */
export const SURE_CLARITY = 0.9;
/** Below this RMS (about −48 dBFS) the room is quiet: nothing is reported. */
export const QUIET_RMS = 0.004;

/** The key-maximum threshold of the McLeod method (k in the paper). */
const KEY_MAX_SHARE = 0.93;
/** The NSDF is computed on at most this many samples (the most recent). */
const NSDF_WINDOW = 2048;
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

  // The NSDF on the most recent samples (cost grows with window × lag).
  const n = Math.min(total, NSDF_WINDOW);
  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) x[i] = frame[total - n + i] - mean;
  const maxLag = Math.min(Math.floor(sampleRate / MIN_FREQUENCY), n - 2);
  const minLag = Math.max(2, Math.floor(sampleRate / MAX_FREQUENCY));
  const nsdf = new Float64Array(maxLag + 2);
  let m = 0;
  for (let i = 0; i < n; i++) m += 2 * x[i] * x[i];
  for (let tau = 0; tau <= maxLag + 1; tau++) {
    if (tau > 0) m -= x[n - tau] * x[n - tau] + x[tau - 1] * x[tau - 1];
    let r = 0;
    for (let j = 0; j < n - tau; j++) r += x[j] * x[j + tau];
    nsdf[tau] = m > 0 ? (2 * r) / m : 0;
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

/** The amplitude of the frame at exactly `frequency` (Blackman window). */
function amplitudeAt(frame: Float32Array, mean: number, sampleRate: number, frequency: number): number {
  const n = frame.length;
  const w = (2 * Math.PI * frequency) / sampleRate;
  let re = 0;
  let im = 0;
  for (let i = 0; i < n; i++) {
    const phase = (2 * Math.PI * i) / (n - 1);
    const win = 0.42 - 0.5 * Math.cos(phase) + 0.08 * Math.cos(2 * phase);
    const v = (frame[i] - mean) * win;
    re += v * Math.cos(w * i);
    im -= v * Math.sin(w * i);
  }
  return Math.hypot(re, im);
}

/** The fundamental is there, or harmonics 2–5 all are (a string, a voice — not two notes sharing a period). */
function soundsAsOneNote(frame: Float32Array, mean: number, sampleRate: number, f0: number): boolean {
  const nyquist = sampleRate / 2;
  const amps: number[] = [];
  for (let k = 1; k <= 8 && k * f0 < 0.9 * nyquist; k++) amps.push(amplitudeAt(frame, mean, sampleRate, k * f0));
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
