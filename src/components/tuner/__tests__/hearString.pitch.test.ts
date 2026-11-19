/**
 * "Hear" is in tune (audit M60, 19 November 2026) — the half of it a unit
 * test can reach: while the guitar's samples are not decoded yet (the first
 * moments, or offline before they were ever fetched) "Hear" plays the
 * Karplus-Strong pluck. Here every reference string of every tuning is
 * played through `playGuitarString`, exactly as the tuner's button plays it,
 * at every rate a device may run its audio at; the buffer it builds is
 * measured by an estimate that shares no code with the app's detector
 * (`src/test/independentPitch.ts`: a long-window autocorrelation) and must be
 * within ±0.2 cent of equal temperament at A4 = 440 Hz, and the app's own
 * detector, framed and smoothed as the tuner frames and smooths, must read it
 * within ±0.2 and in tune. The claim is ±2 cents; the bound is what is true
 * with room to spare (fix pass after the review: the worst measured over the
 * 16 strings at the five rates is 0.022 cent by the estimate and 0.029 by the
 * detector, a synthetic, harmonic tone; a loop delay off by a tenth of a
 * sample is 1.2 cents at E4 and must fail here, which ±2 let through). The sampled guitar is measured in the browser, where its files can
 * be decoded: `e2e/tuner-reference.spec.ts`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { playGuitarString, REFERENCE_SECONDS } from '../hearString';
import * as ks from '../../../services/karplusStrong';
import * as guitarSampler from '../../../services/guitarSampler';
import { GUITAR_TUNINGS } from '../../../core/constants/guitarTunings';
import { stringMidi, createSmoother, tuneState } from '../tunerReading';
import { analysisFrameSize, centsFrom, detectPitch, SURE_CLARITY } from '../../../services/microphone/pitch';
import { independentPitch } from '../../../test/independentPitch';

const RATES = [44100, 48000, 88200, 96000, 192000];
const OPEN_STRINGS = [...new Set(GUITAR_TUNINGS.flatMap((t) => t.strings.map(stringMidi)))].sort((a, b) => a - b);
const et = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
/** Cents: see the header (the worst measured is 0.029). */
const BOUND = 0.2;

interface Played {
  buffer: { data: Float32Array; sampleRate: number } | null;
  playbackRate: { value: number };
}
let played: Played[];

function stubAudio(rate: number) {
  const param = () => ({ value: 1, setValueAtTime: vi.fn(), setTargetAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() });
  class Ctx {
    state = 'running';
    currentTime = 0;
    sampleRate = rate;
    destination = {};
    resume = vi.fn(async () => undefined);
    createGain() { return { gain: param(), connect: vi.fn() }; }
    createDynamicsCompressor() { return { threshold: param(), knee: param(), ratio: param(), attack: param(), release: param(), connect: vi.fn() }; }
    createConvolver() { return { buffer: null, connect: vi.fn() }; }
    createBuffer(channels: number, length: number, sampleRate: number) {
      const data = Array.from({ length: channels }, () => new Float32Array(length));
      return { length, sampleRate, data: data[0], getChannelData: (c: number) => data[c] };
    }
    createBufferSource() {
      const s: Played & Record<string, unknown> = { buffer: null, playbackRate: param(), connect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null };
      played.push(s);
      return s;
    }
  }
  vi.stubGlobal('AudioContext', Ctx as unknown as typeof AudioContext);
}

/** Math.random seeded (mulberry32), so a pluck can be played again. */
function seedRandom(seed: number) {
  let a = seed >>> 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  });
}

/** The app's detector over the reference, as the microphone frames it (every 30 ms) and the tuner smooths it. */
function appReading(x: Float32Array, rate: number, midi: number) {
  const size = analysisFrameSize(rate);
  const hop = Math.round(0.03 * rate);
  const smoother = createSmoother();
  const raw: number[] = [];
  for (let end = Math.round(0.1 * rate) + size; end <= Math.min(x.length, Math.round(1.2 * rate)); end += hop) {
    const e = detectPitch(x.subarray(end - size, end), rate);
    if (!e || e.clarity < SURE_CLARITY) continue;
    const c = centsFrom(e.frequency, midi);
    raw.push(c);
    smoother.push(c);
  }
  raw.sort((a, b) => a - b);
  return { frames: raw.length, median: raw[raw.length >> 1], shown: smoother.value };
}

beforeEach(() => {
  played = [];
  ks._resetForTesting();
  guitarSampler._resetForTesting();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  ks._resetForTesting();
  guitarSampler._resetForTesting();
});

describe('"Hear" with the samples not yet decoded (the Karplus-Strong pluck)', () => {
  it('the open strings are the 16 pitches of the seven tunings', () => {
    expect(OPEN_STRINGS).toEqual([38, 39, 40, 43, 44, 45, 49, 50, 54, 55, 57, 58, 59, 62, 63, 64]);
  });

  for (const rate of RATES) {
    it(`at ${rate / 1000} kHz every reference string of every tuning is within ±0.2 cent (independent estimate) and the tuner reads it within ±0.2, in tune`, () => {
      stubAudio(rate);
      const misses: string[] = [];
      for (const midi of OPEN_STRINGS) {
        seedRandom(midi);
        played = [];
        playGuitarString(midi);
        const source = played.at(-1)!;
        expect(source.buffer, `${midi}: the pluck's buffer`).not.toBeNull();
        expect(source.buffer!.sampleRate).toBe(rate);
        expect(source.buffer!.data.length).toBeGreaterThanOrEqual(Math.round(REFERENCE_SECONDS * rate));
        expect(source.playbackRate.value).toBe(1);
        const x = source.buffer!.data;
        const independent = independentPitch(x, rate, et(midi), 0.1, 1.35);
        const app = appReading(x, rate, midi);
        if (!(Math.abs(independent.cents) <= BOUND)) misses.push(`${midi}: ${independent.cents.toFixed(3)} cents (independent)`);
        if (app.frames < 10 || !(Math.abs(app.median) <= BOUND) || tuneState(app.shown ?? NaN) !== 'inTune') {
          misses.push(`${midi}: the tuner reads ${app.median?.toFixed(2)} (shown ${app.shown?.toFixed(2)}, ${app.frames} frames)`);
        }
      }
      expect(misses).toEqual([]);
      // 16 plucks of 3 s, each measured twice: 1–8 s alone, up to 17 s under the full suite with coverage.
    }, 60_000);
  }
});
