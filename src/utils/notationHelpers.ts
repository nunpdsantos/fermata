/**
 * Notation helpers — bridge between app Note types and VexFlow key strings.
 *
 * Spelling, octaves and accidentals come from the one spelling engine
 * (core/utils/degreeSpelling); this file only translates to VexFlow strings.
 */
import type { Note, NaturalNote, Accidental, PitchedNote } from '../core/types/music';
import { noteToString, stringToNote } from '../core/types/music';
import {
  writtenOctave,
  staffAccidentals,
  majorKeySignature,
  spellIntervalAbove,
  type StaffAccidental,
} from '../core/utils/degreeSpelling';

// ─── Note → VexFlow Conversion ─────────────────────────────────────────────

const ACCIDENTAL_MAP: Record<string, string> = {
  '': '',
  '#': '#',
  'b': 'b',
  '##': '##',
  'bb': 'bb',
};

/**
 * Convert a PitchedNote to VexFlow key string: "c#/4".
 *
 * VexFlow places a note by LETTER + octave (scientific pitch), while the app's
 * PitchedNote octave is the octave of the sounding pitch class. The two differ
 * only for B♯/B𝄪 and C♭/C𝄫, which used to land an octave off (audit W1-02):
 * B♯ sounding as C5 is written b#/4.
 */
export function pitchedNoteToVexKey(note: PitchedNote): string {
  const letter = note.natural.toLowerCase();
  const acc = ACCIDENTAL_MAP[note.accidental] ?? '';
  return `${letter}${acc}/${writtenOctave(note, note.octave)}`;
}

/**
 * Get the VexFlow accidental string for a note, or null if natural.
 * (Ignores the key signature — use {@link vexAccidentals} for a staff.)
 */
export function getVexAccidental(note: Note): string | null {
  if (note.accidental === '') return null;
  return ACCIDENTAL_MAP[note.accidental] ?? null;
}

/**
 * Convert the app's root Note + mode to a VexFlow key signature string.
 * VexFlow accepts: C, G, D, A, E, B, F#, C#, F, Bb, Eb, Ab, Db, Gb, Cb
 * For minor: append 'm' (e.g., "Am", "Dm", "F#m")
 */
export function noteToVexKeySignature(root: Note, mode: 'major' | 'minor' = 'major'): string {
  const str = noteToString(root);
  return mode === 'minor' ? `${str}m` : str;
}

// ─── Valid VexFlow Key Signatures ───────────────────────────────────────────

const VALID_MAJOR_KEY_SIGS = new Set([
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
  'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb',
]);

const VALID_MINOR_KEY_SIGS = new Set([
  'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m',
  'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm',
]);

/**
 * Determine the VexFlow key signature string for a given root + scale type.
 * Returns null for non-diatonic scales where a key signature is misleading.
 */
export function getKeySignatureForScale(
  root: Note,
  scaleType: string,
): string | null {
  if (scaleType === 'major') {
    const sig = noteToVexKeySignature(root, 'major');
    return VALID_MAJOR_KEY_SIGS.has(sig) ? sig : null;
  }

  if (scaleType === 'natural_minor' || scaleType === 'harmonic_minor' || scaleType === 'melodic_minor') {
    const sig = noteToVexKeySignature(root, 'minor');
    return VALID_MINOR_KEY_SIGS.has(sig) ? sig : null;
  }

  // Non-diatonic scales: no key signature (would be misleading)
  return null;
}

/**
 * The letters a VexFlow key-signature string alters ("Cm" → B♭ E♭ A♭),
 * counted from the spelled major scale of its parent key.
 */
export function keySignatureAlterations(sig: string | undefined | null): Partial<Record<NaturalNote, Accidental>> {
  if (!sig) return {};
  const minor = sig.endsWith('m');
  const tonic = stringToNote(minor ? sig.slice(0, -1) : sig);
  const parent = minor ? spellIntervalAbove(tonic, 3, 3) : tonic;
  return majorKeySignature(parent).alterations;
}

/**
 * The VexFlow accidental each note needs on a one-measure staff under `sig`:
 * nothing where the signature (or an earlier note on the same line) already
 * supplies it, 'n' for a natural the signature alters (audit W1-03).
 */
export function vexAccidentals(notes: readonly PitchedNote[], sig?: string | null): StaffAccidental[] {
  return staffAccidentals(notes, keySignatureAlterations(sig));
}

// ─── Staff layout ───────────────────────────────────────────────────────────

const LETTER_INDEX: Record<NaturalNote, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const CLEF_LINE_SHIFT: Record<'treble' | 'bass', number> = { treble: 0, bass: 6 };

/**
 * The VexFlow staff line of a note (keyProperties): 1 = bottom staff line,
 * 5 = top line, 0 = middle C in treble, half-lines for spaces.
 */
export function staffLine(note: PitchedNote, clef: 'treble' | 'bass'): number {
  const octave = writtenOctave(note, note.octave);
  return (octave * 7 - 28 + LETTER_INDEX[note.natural]) / 2 + CLEF_LINE_SHIFT[clef];
}

/**
 * Where to put the stave and how tall to draw it so every note fits: the
 * requested height for notes on the staff, grown (and the stave moved down)
 * for ledger-line notes above or below it. VexFlow places a note's centre at
 * staveY + 90 − 10·line (10 px per line, 4 lines of headroom); a notehead and
 * its ledger line need about 8 px either side of that centre.
 */
export function staffLayout(
  notes: readonly PitchedNote[],
  clef: 'treble' | 'bass',
  requestedHeight: number,
): { height: number; staveY: number } {
  let staveY = Math.max(0, (requestedHeight - 80) / 2);
  let height = requestedHeight;
  if (notes.length === 0) return { height, staveY };
  const lines = notes.map((n) => staffLine(n, clef));
  const MARGIN = 8;
  const top = staveY + 90 - 10 * Math.max(...lines) - MARGIN;
  if (top < 0) {
    staveY -= top;
    height -= top;
  }
  const bottom = staveY + 90 - 10 * Math.min(...lines) + MARGIN;
  if (bottom > height) height = bottom;
  return { height: Math.ceil(height), staveY };
}
