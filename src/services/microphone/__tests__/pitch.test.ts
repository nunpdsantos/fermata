/**
 * The detector against synthesised tones (brief T, "Truth and tests").
 * Independent of the code under test: the tones, the note numbers and the
 * cents are computed here from A4 = 440 Hz, never with pitch.ts's helpers.
 *
 * Every note from E2 to C6, at 44.1 and 48 kHz, in tune and ±20 cents, as a
 * sine and as a plucked-string-like tone (strong overtones, a fundamental
 * 16 dB under its 2nd harmonic, decaying): the note is right every time —
 * an octave error fails it — and the cents are within ±5. Silence, noise and
 * two notes at once give nothing or a clarity under "sure", never a sure note.
 */
import { describe, expect, it } from 'vitest';
import { detectPitch, SURE_CLARITY } from '../pitch';

const FRAME = 4096;
const RATES = [44100, 48000];
const DETUNE = [-20, 0, 20];

/** Seeded noise (mulberry32), so a failure can be reproduced. */
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

const hz = (midi: number, cents = 0) => 440 * Math.pow(2, (midi - 69 + cents / 100) / 12);

/** A frame taken `start` seconds into the tone. */
function sine(f: number, rate: number, amp = 0.3, start = 0.1): Float32Array {
  const out = new Float32Array(FRAME);
  for (let i = 0; i < FRAME; i++) out[i] = amp * Math.sin(2 * Math.PI * f * (start + i / rate));
  return out;
}

/**
 * A plucked string: harmonics 1–12 with a weak fundamental (0.15 against a
 * 2nd harmonic of 1), each decaying faster the higher it is, random phases,
 * and a little noise.
 */
const PLUCK = [0.15, 1, 0.8, 0.5, 0.45, 0.3, 0.25, 0.2, 0.15, 0.12, 0.1, 0.08];
function plucked(f: number, rate: number, seed: number, start = 0.12): Float32Array {
  const random = rng(seed);
  const phases = PLUCK.map(() => random() * 2 * Math.PI);
  const out = new Float32Array(FRAME);
  for (let i = 0; i < FRAME; i++) {
    const t = start + i / rate;
    let v = 0;
    PLUCK.forEach((a, k) => {
      const fk = f * (k + 1);
      if (fk >= rate / 2) return;
      v += a * Math.exp(-t * (1.5 + k * 0.6)) * Math.sin(2 * Math.PI * fk * t + phases[k]);
    });
    out[i] = 0.12 * v + 0.0005 * (random() * 2 - 1);
  }
  return out;
}

function mix(...frames: Float32Array[]): Float32Array {
  const out = new Float32Array(FRAME);
  for (const f of frames) for (let i = 0; i < FRAME; i++) out[i] += f[i];
  return out;
}

/** What the detector says, as a note number and cents from that note. */
function heard(frame: Float32Array, rate: number) {
  const e = detectPitch(frame, rate);
  if (!e) return null;
  const exact = 69 + 12 * Math.log2(e.frequency / 440);
  return { midi: Math.round(exact), cents: (exact - Math.round(exact)) * 100, clarity: e.clarity, frequency: e.frequency };
}

const E2 = 40;
const C6 = 84;
const NOTES = Array.from({ length: C6 - E2 + 1 }, (_, i) => E2 + i);

describe('detectPitch: one note, E2 to C6', () => {
  for (const rate of RATES) {
    for (const [kind, make] of [
      ['sine', (f: number) => sine(f, rate)],
      ['plucked string', (f: number, seed: number) => plucked(f, rate, seed)],
    ] as const) {
      it(`${kind} at ${rate} Hz: every note right, cents within ±5, sure`, () => {
        const misses: string[] = [];
        for (const midi of NOTES) {
          for (const cents of DETUNE) {
            const got = heard(make(hz(midi, cents), midi * 7 + cents), rate);
            const expectedCents = cents;
            if (!got) {
              misses.push(`${midi}${cents >= 0 ? '+' : ''}${cents}: nothing`);
              continue;
            }
            if (got.midi !== midi) misses.push(`${midi}${cents >= 0 ? '+' : ''}${cents}: heard ${got.midi} (${got.frequency.toFixed(2)} Hz)`);
            else if (Math.abs(got.cents - expectedCents) > 5) misses.push(`${midi}${cents >= 0 ? '+' : ''}${cents}: ${got.cents.toFixed(1)} cents`);
            else if (got.clarity < SURE_CLARITY) misses.push(`${midi}${cents >= 0 ? '+' : ''}${cents}: clarity ${got.clarity.toFixed(2)}`);
          }
        }
        expect(misses).toEqual([]);
      });
    }
  }

  it('the open strings of the other tunings, down to D2 (Drop D, Open G, DADGAD)', () => {
    for (const midi of [38, 39, 43, 45]) {
      for (const rate of RATES) {
        const got = heard(plucked(hz(midi, -15), rate, midi), rate);
        expect(got?.midi, `midi ${midi} at ${rate}`).toBe(midi);
        expect(Math.abs(got!.cents + 15)).toBeLessThanOrEqual(5);
      }
    }
  });

  it('a strong 2nd harmonic (2.5× the fundamental) is not taken for the octave above', () => {
    // At half the period the 2nd harmonic lines up and the fundamental cancels:
    // the NSDF there is about (2.5² − 1) / (2.5² + 1) ≈ 0.72 — a peak a looser
    // key-maximum rule would pick, one octave too high.
    const misses: string[] = [];
    for (const rate of RATES) {
      for (const midi of NOTES) {
        const f = hz(midi);
        const out = new Float32Array(FRAME);
        for (let i = 0; i < FRAME; i++) {
          const t = 0.1 + i / rate;
          out[i] = 0.08 * Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(2 * Math.PI * 2 * f * t + 0.7);
        }
        const got = heard(out, rate);
        if (got?.midi !== midi) misses.push(`${midi} at ${rate}: heard ${got?.midi ?? 'nothing'}`);
      }
    }
    expect(misses).toEqual([]);
  });

  it('up to C7 the note is still right (sine)', () => {
    for (let midi = C6; midi <= 96; midi++) {
      for (const rate of RATES) {
        const got = heard(sine(hz(midi), rate), rate);
        expect(got?.midi, `midi ${midi} at ${rate}`).toBe(midi);
      }
    }
  });
});

describe('detectPitch: nothing that is not one note', () => {
  it('silence and a very quiet room: nothing', () => {
    for (const rate of RATES) {
      expect(detectPitch(new Float32Array(FRAME), rate)).toBeNull();
      const random = rng(3);
      const hiss = new Float32Array(FRAME).map(() => 0.003 * (random() * 2 - 1));
      expect(detectPitch(hiss, rate)).toBeNull();
      // A quiet note under the floor (−55 dBFS) is the quiet room too.
      expect(detectPitch(sine(hz(57), rate, 0.0025), rate)).toBeNull();
    }
  });

  it('white and rumbling noise: nothing sure', () => {
    for (const rate of RATES) {
      for (let seed = 1; seed <= 20; seed++) {
        const random = rng(seed);
        const white = new Float32Array(FRAME).map(() => 0.3 * (random() * 2 - 1));
        const w = detectPitch(white, rate);
        expect(w === null || w.clarity < SURE_CLARITY, `white ${seed}: ${JSON.stringify(w)}`).toBe(true);
        // Brown noise (integrated white): strong low rumble, no pitch.
        let acc = 0;
        const brown = new Float32Array(FRAME).map(() => {
          acc = 0.995 * acc + 0.05 * (random() * 2 - 1);
          return acc;
        });
        const b = detectPitch(brown, rate);
        expect(b === null || b.clarity < SURE_CLARITY, `brown ${seed}: ${JSON.stringify(b)}`).toBe(true);
      }
    }
  });

  // Two notes at once (not an octave, which is heard as its lower note):
  // nothing, or a clarity under "sure" — never a sure note.
  const DYADS: [string, number, number][] = [
    ['C4 + E4 (a third)', 60, 64],
    ['C4 + F4 (a fourth)', 60, 65],
    ['C4 + G4 (a fifth)', 60, 67],
    ['C4 + A4 (a sixth)', 60, 69],
    ['C3 + G3 (a fifth, low)', 48, 55],
    ['A2 + E3 (a power chord)', 45, 52],
    ['E3 + G#3', 52, 56],
    ['D4 + F4', 62, 65],
  ];
  for (const rate of RATES) {
    for (const [name, lo, hi] of DYADS) {
      for (const kind of ['sine', 'plucked'] as const) {
        it(`${name}, ${kind}, ${rate} Hz: nothing sure`, () => {
          const frame = kind === 'sine'
            ? mix(sine(hz(lo), rate, 0.2), sine(hz(hi), rate, 0.2))
            : mix(plucked(hz(lo), rate, lo), plucked(hz(hi), rate, hi + 1));
          const got = heard(frame, rate);
          expect(got === null || got.clarity < SURE_CLARITY, `${name}: heard ${JSON.stringify(got)}`).toBe(true);
        });
      }
    }
    it(`a C major triad (C4 E4 G4), ${rate} Hz: nothing sure`, () => {
      for (const kind of ['sine', 'plucked'] as const) {
        const parts = [60, 64, 67].map((m) => (kind === 'sine' ? sine(hz(m), rate, 0.15) : plucked(hz(m), rate, m)));
        const got = heard(mix(...parts), rate);
        expect(got === null || got.clarity < SURE_CLARITY, `${kind}: heard ${JSON.stringify(got)}`).toBe(true);
      }
    });
  }
});
