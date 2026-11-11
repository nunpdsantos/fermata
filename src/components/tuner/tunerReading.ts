/**
 * What the tuner says about a note heard (wave 3, brief T) — pure, so the
 * thresholds, the string it picks and the smoothing are tested without a
 * microphone.
 */
import type { PitchedNote } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { centsFrom, nearestNote } from '../../services/microphone/pitch.ts';

/** Within this many cents of the target the note is in tune. */
export const IN_TUNE_CENTS = 5;
/** Beyond this many cents the needle stops at the end of the scale and the words say "much". */
export const FAR_CENTS = 50;
/** A string chosen by itself stays chosen until another is nearer by this many cents. */
const STRING_HYSTERESIS = 30;

export type TuneState = 'inTune' | 'flat' | 'sharp' | 'farFlat' | 'farSharp';

export function tuneState(cents: number): TuneState {
  if (Math.abs(cents) <= IN_TUNE_CENTS) return 'inTune';
  if (cents < -FAR_CENTS) return 'farFlat';
  if (cents > FAR_CENTS) return 'farSharp';
  return cents < 0 ? 'flat' : 'sharp';
}

/** The MIDI number of an open string ({ natural, accidental, octave }). */
export function stringMidi(note: PitchedNote): number {
  return 12 * (note.octave + 1) + getPitchClass(note);
}

/**
 * The string a note belongs to: the nearest in pitch; the one already
 * picked keeps it unless another is clearly nearer (no flicker at a midpoint).
 */
export function pickString(frequency: number, strings: readonly number[], previous: number | null): number {
  let best = 0;
  let bestDistance = Infinity;
  strings.forEach((midi, i) => {
    const d = Math.abs(centsFrom(frequency, midi));
    if (d < bestDistance) {
      best = i;
      bestDistance = d;
    }
  });
  if (previous !== null && previous !== best && previous < strings.length) {
    const kept = Math.abs(centsFrom(frequency, strings[previous]));
    if (kept - bestDistance < STRING_HYSTERESIS) return previous;
  }
  return best;
}

/** The target a reading is measured against: a string, or (no strings) the nearest note. */
export function targetFor(frequency: number, strings: readonly number[] | null, chosen: number | null, previous: number | null): { midi: number; string: number | null } {
  if (!strings) return { midi: nearestNote(frequency).midi, string: null };
  const index = chosen ?? pickString(frequency, strings, previous);
  return { midi: strings[index], string: index };
}

/**
 * A steady reading: the median of the last few frames (a stray frame is
 * dropped), then an exponential average. A new target starts it afresh.
 */
export function createSmoother(window = 5, weight = 0.25) {
  let recent: number[] = [];
  let value: number | null = null;
  return {
    push(cents: number): number {
      recent.push(cents);
      if (recent.length > window) recent.shift();
      const sorted = [...recent].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      value = value === null ? median : value + weight * (median - value);
      return value;
    },
    reset() {
      recent = [];
      value = null;
    },
    get value() {
      return value;
    },
  };
}

const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

/** A heard note's name: sharps, unless it is the target string, spelled as the tuning spells it. */
export function heardName(midi: number, targetMidi: number | null, targetName: string | null): string {
  if (targetName && targetMidi === midi) return targetName;
  return SHARP_NAMES[((midi % 12) + 12) % 12];
}
