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

/** Standard engraving, shared by drawing and ink bounds. Matches VexFlow's
 * autoStem for isolated notes/chords, adding middle-line melodic neighbours.
 * Equidistant chord extremes and conflicting equally-near neighbours take down.
 */
export function staffStemDirections(notes: readonly PitchedNote[], clef: 'treble' | 'bass', chord = false): (1 | -1)[] {
  const distances = notes.map((note) => staffLine(note, clef) - 3);
  const direction = (d: number): 1 | -1 => d < 0 ? 1 : -1;
  if (chord) {
    const extreme = distances.reduce((a, b) => Math.abs(b) > Math.abs(a) || (Math.abs(b) === Math.abs(a) && b > a) ? b : a, 0);
    return notes.map(() => direction(extreme));
  }
  return distances.map((d, i) => {
    if (d !== 0) return direction(d);
    for (let gap = 1; gap < distances.length; gap++) {
      const neighbours = [distances[i - gap], distances[i + gap]].filter((n) => n !== undefined && n !== 0);
      if (neighbours.length) return neighbours.every((n) => n < 0) ? 1 : -1;
    }
    return -1;
  });
}

export interface StaffInkOptions {
  annotation?: '8vb';
  /** Matches StaffNotation's default. Explore and Drill use stemless wholes. */
  duration?: string;
  keySignature?: string;
  chord?: boolean;
}

/** Bravura accidental outlines rounded outward at the same 40px size. */
function accidentalInk(accidental: StaffAccidental): { top: number; bottom: number } {
  if (accidental === 'b' || accidental === 'bb') return { top: 18, bottom: 8 };
  if (accidental === '#' || accidental === 'n') return { top: 14, bottom: 14 };
  return { top: 8, bottom: 8 };
}

/**
 * Ink bounds relative to VexFlow's staveY, shared by fitting and trimming.
 * Default Bravura clefs are 30pt (40px), anchored at y=70 (treble) / 50
 * (bass). Bounds rounded OUT from the bundled font's 1000 units/em outlines:
 * gClef y=[-658.215,1098], gClef8vb=[-878,1098];
 * fClef y=[-635,262], fClef8vb=[-744,262]. The 8 is part of the glyph.
 * Staff lines run from 40.5 to 80.5, including a 1px stroke: [40,81].
 */
export function staffInkBounds(
  notes: readonly PitchedNote[],
  clef: 'treble' | 'bass',
  options: StaffInkOptions = {},
): { top: number; bottom: number } {
  const clefBounds = clef === 'treble'
    ? { top: 26, bottom: options.annotation ? 106 : 97 }
    : { top: 39, bottom: options.annotation ? 80 : 76 };
  let top = Math.min(40, clefBounds.top);
  let bottom = Math.max(81, clefBounds.bottom);
  // VexFlow's signature order, measured down from the top staff line.
  // In a signature with 3+ sharps, G# reaches ABOVE the treble clef curl.
  const signature = Object.values(keySignatureAlterations(options.keySignature));
  const signatureType = signature[0];
  if (signatureType === '#' || signatureType === 'b') {
    const positions = signatureType === '#' ? [0, 1.5, -0.5, 1, 2.5, 0.5, 2] : [2, 0.5, 2.5, 1, 3, 1.5, 3.5];
    const accidental = accidentalInk(signatureType);
    positions.slice(0, signature.length).forEach((line) => {
      const y = 40 + 10 * (line + (clef === 'bass' ? 1 : 0));
      top = Math.min(top, y - accidental.top);
      bottom = Math.max(bottom, y + accidental.bottom);
    });
  }
  const accidentals = vexAccidentals(notes, options.keySignature);
  const stems = staffStemDirections(notes, clef, options.chord);
  notes.forEach((note, i) => {
    const y = 90 - 10 * staffLine(note, clef);
    // At least 8px for the notehead and ledger stroke, more for accidentals.
    const accidental = accidentalInk(accidentals[i]);
    const stem = (options.duration ?? 'q') === 'w' ? 8 : 36;
    top = Math.min(top, y - Math.max(stems[i] === 1 ? stem : 8, accidental.top));
    bottom = Math.max(bottom, y + Math.max(stems[i] === -1 ? stem : 8, accidental.bottom));
  });
  return { top, bottom };
}

/** Fit ALL ink, including an empty staff's lines and annotated clef. */
export function staffLayout(
  notes: readonly PitchedNote[],
  clef: 'treble' | 'bass',
  requestedHeight: number,
  options: StaffInkOptions = {},
): { height: number; staveY: number } {
  const ink = staffInkBounds(notes, clef, options);
  const initialY = Math.max(0, (requestedHeight - 80) / 2);
  const staveY = Math.max(initialY, 4 - ink.top);
  return {
    height: Math.ceil(Math.max(requestedHeight, staveY + ink.bottom + 2)),
    staveY,
  };
}

/**
 * The notes as WRITTEN on a staff: under a treble-8vb clef (the guitar) every
 * note is written an octave above where it sounds; otherwise unchanged.
 */
export function writtenStaffNotes(notes: readonly PitchedNote[], annotation?: '8vb'): PitchedNote[] {
  return annotation === '8vb' ? notes.map((n) => ({ ...n, octave: n.octave + 1 })) : [...notes];
}

/**
 * The clef a staff is drawn in. A staff that shows what the INSTRUMENT PLAYS
 * (Explore's scale and chord staves) follows the instrument: with the guitar
 * it is treble with the small 8 below (decision D-05 / audit W3-12) and its
 * notes are written an octave above where they sound. AUTHORED notation (Learn
 * exercises: "the note on the first line", "two ledger lines below") is never
 * transposed for the instrument — it keeps its own notes and clef, so the
 * picture always matches the prompt. Off unless asked for.
 */
export function resolveStaffClef(
  instrument: string,
  requested: 'treble' | 'bass' | undefined,
  followInstrument: boolean = false,
): { clef: 'treble' | 'bass'; annotation?: '8vb' } {
  if (followInstrument && instrument === 'guitar') return { clef: 'treble', annotation: '8vb' };
  return { clef: requested ?? 'treble' };
}

/** Everything the staff draws: clef, clef annotation, written notes and VexFlow keys. */
export function staffPlan(
  notes: readonly PitchedNote[],
  requested: 'treble' | 'bass' | undefined,
  instrument: string,
  followInstrument: boolean = false,
): { clef: 'treble' | 'bass'; annotation?: '8vb'; written: PitchedNote[]; keys: string[] } {
  const { clef, annotation } = resolveStaffClef(instrument, requested, followInstrument);
  const written = writtenStaffNotes(notes, annotation);
  return { clef, annotation, written, keys: written.map(pitchedNoteToVexKey) };
}
