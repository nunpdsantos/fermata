/**
 * Keys for the progression engine: their spelled scales, the key picker's
 * root spelling, and moving a key by half steps. All spelling goes through
 * `degreeSpelling` (CLAUDE.md, "Spelling is one engine").
 */

import type { Note, ScaleType } from '../../types/music';
import { getPitchClass } from '../../constants/notes';
import { preferredRootSpelling, spellScale } from '../degreeSpelling';
import type { KeyMode, MusicKey } from './types';

/** The scale type a key mode stands for (minor = natural minor). */
export function scaleTypeOf(mode: KeyMode): ScaleType {
  return mode === 'major' ? 'major' : 'natural_minor';
}

/** The key's seven spelled notes, tonic first (G major: G A B C D E F♯). */
export function keyScale(key: MusicKey): Note[] {
  return spellScale(key.root, scaleTypeOf(key.mode));
}

/** The root the key picker offers for a pitch class in this mode (D♭ major, C♯ minor, G♯ minor). */
export function pickerRoot(pitchClass: number, mode: KeyMode): Note {
  return preferredRootSpelling(pitchClass, scaleTypeOf(mode));
}

/**
 * The key `semitones` half steps up (negative = down), same mode, its root
 * spelled as the key picker spells roots for that mode: B major up one is
 * C major (never B♯), F major up one is F♯ major, A minor up one is B♭ minor.
 * A whole number of octaves (0, ±12 …) returns the key unchanged.
 */
export function shiftKey(key: MusicKey, semitones: number): MusicKey {
  const s = ((Math.trunc(semitones) % 12) + 12) % 12;
  if (s === 0) return { root: key.root, mode: key.mode };
  return { root: pickerRoot(getPitchClass(key.root) + s, key.mode), mode: key.mode };
}

/** Same note, same spelling. */
export function sameNote(a: Note, b: Note): boolean {
  return a.natural === b.natural && a.accidental === b.accidental;
}

/** Same key, same spelling. */
export function sameKey(a: MusicKey, b: MusicKey): boolean {
  return a.mode === b.mode && sameNote(a.root, b.root);
}
