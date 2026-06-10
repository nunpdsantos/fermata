/**
 * intervalEngine — reusable music theory primitives for interval computation.
 *
 * NOT item generation — pure theory functions only.
 * No Math.random, no Date.now, no side effects.
 */

import type { Note } from '../../types/music';
import { getNaturalAtInterval, getPitchClass, NATURAL_NOTE_ORDER } from '../../constants/notes';

const BASE_SEMITONES: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12 };
const PERFECT_CLASS = new Set([1, 4, 5, 8]);

export interface NamedInterval {
  number: number;
  quality: 'perfect' | 'major' | 'minor' | 'augmented' | 'diminished';
  label: string; // e.g. 'Major 3rd', 'Augmented 4th', 'Perfect 5th'
}

/** Name the ascending interval lower→upper. Letter distance decides the number; semitone delta decides quality. Returns null outside the drillable v1 set. */
export function nameIntervalBetween(lower: Note, upper: Note): NamedInterval | null {
  const li = NATURAL_NOTE_ORDER.indexOf(lower.natural);
  const ui = NATURAL_NOTE_ORDER.indexOf(upper.natural);
  let number = ((ui - li + 7) % 7) + 1;
  let semis = (getPitchClass(upper) - getPitchClass(lower) + 12) % 12;
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
  const ORDINAL = ['Unison', '2nd', '3rd', '4th', '5th', '6th', '7th'];
  const label = `${quality[0].toUpperCase()}${quality.slice(1)} ${ORDINAL[number - 1]}`;
  return { number, quality, label };
}

const ACC_FROM_DELTA: Record<number, Note['accidental']> = { [-2]: 'bb', [-1]: 'b', [0]: '', [1]: '#', [2]: '##' };

/** Spell the note `semitones` above root with the letter `number-1` letters up. Null if it needs a triple accidental. */
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
