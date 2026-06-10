/**
 * intervalEngine — reusable music theory primitives for interval computation.
 *
 * NOT item generation — pure theory functions only.
 * No Math.random, no Date.now, no side effects.
 */

import type { Note } from '../../types/music';
import { getNaturalAtInterval, getPitchClass, NATURAL_NOTE_ORDER } from '../../constants/notes';

/** Semitones above unison for each diatonic interval number (1–8). */
const BASE_SEMITONES: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12 };

/** Interval numbers whose quality class is perfect (rather than major/minor). */
const PERFECT_CLASS = new Set([1, 4, 5, 8]);

export interface NamedInterval {
  number: number;
  quality: 'perfect' | 'major' | 'minor' | 'augmented' | 'diminished';
  label: string; // e.g. 'Major 3rd', 'Augmented 4th', 'Perfect 5th'
}

/**
 * Name the ascending interval lower→upper.
 *
 * Letter distance from lower to upper determines the interval number (1–8).
 * The semitone delta relative to the diatonic baseline determines quality.
 * Returns null for any interval outside the drillable v1 set (e.g. descending
 * unisons, double-augmented/diminished, or intervals beyond a 7th).
 *
 * @param lower - The lower note of the interval (must be diatonic or singly-altered).
 * @param upper - The upper note of the interval (must be diatonic or singly-altered).
 * @returns A NamedInterval descriptor, or null if the interval is out of scope.
 */
export function nameIntervalBetween(lower: Note, upper: Note): NamedInterval | null {
  const li = NATURAL_NOTE_ORDER.indexOf(lower.natural);
  const ui = NATURAL_NOTE_ORDER.indexOf(upper.natural);
  const number = ((ui - li + 7) % 7) + 1;
  const semis = (getPitchClass(upper) - getPitchClass(lower) + 12) % 12;
  if (number === 1 && semis >= 11) return null; // descending-ish unison spellings: out of scope
  if (number === 1 && semis === 0) {
    return { number: 1, quality: 'perfect', label: 'Perfect Unison' };
  }
  const delta = semis - BASE_SEMITONES[number];
  let quality: NamedInterval['quality'] | null = null;
  if (PERFECT_CLASS.has(number)) {
    quality = delta === 0 ? 'perfect' : delta === 1 ? 'augmented' : delta === -1 ? 'diminished' : null;
  } else {
    quality = delta === 0 ? 'major' : delta === -1 ? 'minor' : delta === 1 ? 'augmented' : delta === -2 ? 'diminished' : null;
  }
  if (!quality) return null;
  // ORDINAL stops at 7 — nameIntervalBetween never produces number > 7 for the
  // drillable set (the letter-distance arithmetic is mod 7, yielding 1–7 only).
  const ORDINAL = ['Unison', '2nd', '3rd', '4th', '5th', '6th', '7th'];
  const label = `${quality[0].toUpperCase()}${quality.slice(1)} ${ORDINAL[number - 1]}`;
  return { number, quality, label };
}

const ACC_FROM_DELTA: Record<number, Note['accidental']> = { [-2]: 'bb', [-1]: 'b', [0]: '', [1]: '#', [2]: '##' };

/**
 * Spell the note `semitones` above `root` landing on the letter `number-1`
 * diatonic steps above root's natural.
 *
 * **Precondition:** `number` and `semitones` must describe the same named
 * interval (e.g. number=3, semitones=4 for a Major 3rd). Passing an
 * inconsistent pair silently produces a misspelled note — there is no
 * runtime check.
 *
 * @param root - The starting note.
 * @param number - Interval number (1–8); determines the target letter.
 * @param semitones - Interval size in semitones; determines the accidental.
 * @returns The spelled note above root, or null if a triple accidental would be needed.
 */
export function noteAtIntervalAbove(root: Note, number: number, semitones: number): Note | null {
  const natural = getNaturalAtInterval(root.natural, number - 1);
  const naturalPc = getPitchClass({ natural, accidental: '' });
  const targetPc = (getPitchClass(root) + semitones) % 12;
  let delta = targetPc - naturalPc;
  if (delta > 6) delta -= 12;
  if (delta < -6) delta += 12;
  const accidental = ACC_FROM_DELTA[delta];
  return accidental === undefined ? null : { natural, accidental };
}
