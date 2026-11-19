/**
 * The words a screen reader hears for a question's staff (audit 2026-11-18,
 * A9): what is DRAWN, never what it means. A graded question that points at
 * notation (a note to name, two notes to measure, a key signature to read)
 * gave a screen reader nothing — the staff is a picture. This describes the
 * visual evidence in the learner's language, generated at render time from
 * the staff the question draws (`exerciseStaff` → `staffPlan`), so no
 * authored content changes:
 *
 *  - the clef, by the name the lessons use (`lesson.trebleClef` / `bassClef`);
 *  - a key signature: its sharps or flats and where each stands, by the line
 *    or space it sits on, named by letter ("two sharps in the key signature:
 *    on the F line and in the C space") — never the key;
 *  - each note: its line or space, NUMBERED — the staff's from the bottom
 *    ("on line 2", "in space 3"), ledger lines outward from the staff ("on
 *    ledger line 1 below the staff"), and one sentence says how whichever of
 *    the two it uses is counted — and the accidental PRINTED before it (what
 *    the drawing prints, `vexAccidentals`: under a key signature, or after an
 *    earlier note on the same line, maybe nothing or a natural) — never its
 *    letter. Numbers, not ordinals: "the third line" would hold the word of an
 *    interval answer ("3rd", "third").
 *
 * Every served question with a staff is checked by
 * `src/data/exercises/__tests__/staffDescriptions.corpus.test.ts`: it has a
 * description, the description matches what VexFlow places, and it never
 * holds its own answer in any of the three languages (letters or Dó-Ré-Mi).
 *
 * Pure: no React, no VexFlow (the description is ready before the drawing).
 */
import type { TFunction } from 'i18next';
import type { NaturalNote, PitchedNote } from '../../core/types/music';
import { writtenOctave, type StaffAccidental } from '../../core/utils/degreeSpelling';
import { keySignatureAlterations, vexAccidentals } from '../../utils/notationHelpers';
import '../../i18n/learnWords/index.ts';

export type Clef = 'treble' | 'bass';
type Lang = 'en' | 'pt' | 'es';

const LETTERS: readonly NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
/** The bottom line of each staff as a diatonic step (letter index + 7 × octave): E4 and G2. */
const BOTTOM_LINE: Record<Clef, number> = { treble: 2 + 7 * 4, bass: 4 + 7 * 2 };

/** A written note's diatonic step: its letter and its WRITTEN (letter) octave — C♭4 is written in octave 4. */
export function staffStep(note: PitchedNote): number {
  return LETTERS.indexOf(note.natural) + 7 * writtenOctave(note, note.octave);
}

/** Steps above the staff's bottom line: 0 = the bottom line, 1 = the first space, 8 = the top line. */
export function staffPosition(note: PitchedNote, clef: Clef): number {
  return staffStep(note) - BOTTOM_LINE[clef];
}

export type StaffPlace =
  | { kind: 'line' | 'space' | 'ledgerBelow' | 'ledgerAbove' | 'spaceUnderLedger' | 'spaceOverLedger'; n: number }
  | { kind: 'spaceBelowStaff' | 'spaceAboveStaff' };

/** Where a staff position is: a numbered line or space, the space just outside the staff, a ledger line or the space beside one. */
export function staffPlace(pos: number): StaffPlace {
  if (pos >= 0 && pos <= 8) return pos % 2 === 0 ? { kind: 'line', n: pos / 2 + 1 } : { kind: 'space', n: (pos + 1) / 2 };
  if (pos === -1) return { kind: 'spaceBelowStaff' };
  if (pos === 9) return { kind: 'spaceAboveStaff' };
  if (pos < 0) return pos % 2 === 0 ? { kind: 'ledgerBelow', n: -pos / 2 } : { kind: 'spaceUnderLedger', n: (-pos - 1) / 2 };
  return pos % 2 === 0 ? { kind: 'ledgerAbove', n: (pos - 8) / 2 } : { kind: 'spaceOverLedger', n: (pos - 9) / 2 };
}

/**
 * Key signatures as VexFlow draws them (vexflow `Tables.keySignature` and
 * `KeySignature.convertAccLines`): each accidental's staff line in the treble
 * clef — 0 = the top line, 4 = the bottom one, halves = spaces — in the order
 * they are written; the bass clef draws each one line lower.
 * `staffDescription.test.ts` compares this table with VexFlow's own.
 */
export const KEY_SIGNATURE_LINES = {
  '#': { letters: ['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const, lines: [0, 1.5, -0.5, 1, 2.5, 0.5, 2] },
  b: { letters: ['B', 'E', 'A', 'D', 'G', 'C', 'F'] as const, lines: [2, 0.5, 2.5, 1, 3, 1.5, 3.5] },
} as const;

/**
 * The sharps or flats a key signature draws, read as the drawing reads its
 * name (`keySignatureAlterations` of utils/notationHelpers.ts — the letters
 * it alters, major and minor names alike: "Eb" and "Cm" both B♭ E♭ A♭), in
 * the order they are written. Null for a name it cannot read.
 */
function signatureSpec(keySignature: string): { type: '#' | 'b'; count: number } | null {
  let alterations;
  try {
    alterations = keySignatureAlterations(keySignature);
  } catch {
    return null;
  }
  const kinds = Object.values(alterations);
  if (kinds.some((a) => a !== '#' && a !== 'b') || new Set(kinds).size > 1) return null;
  const type = (kinds[0] ?? '#') as '#' | 'b';
  const letters = KEY_SIGNATURE_LINES[type].letters.slice(0, kinds.length);
  // Exactly the first n of the written order, or it is no key signature the table draws.
  if (!letters.every((l) => alterations[l] === type)) return null;
  return { type, count: kinds.length };
}

export interface KeySignatureMark {
  type: '#' | 'b';
  letter: NaturalNote;
  /** Steps above the bottom line, as for a note. */
  pos: number;
}

/** The sharps or flats a key signature draws, in order, each with its place; null for an unknown key. */
export function keySignatureMarks(keySignature: string, clef: Clef): KeySignatureMark[] | null {
  const spec = signatureSpec(keySignature);
  if (!spec) return null;
  const table = KEY_SIGNATURE_LINES[spec.type];
  return table.lines.slice(0, spec.count).map((line, i) => ({
    type: spec.type,
    letter: table.letters[i],
    pos: Math.round((4 - (line + (clef === 'bass' ? 1 : 0))) * 2),
  }));
}

/** The letter on a staff position of a clef (the key signature's places are named by it). */
function letterAt(pos: number, clef: Clef): NaturalNote {
  return LETTERS[(((BOTTOM_LINE[clef] + pos) % 7) + 7) % 7];
}

export interface DescribedStaff {
  /** The notes as drawn (`staffPlan(...).written`). */
  notes: readonly PitchedNote[];
  clef: Clef;
  keySignature?: string;
  chord?: boolean;
}

const ACCIDENTAL_WORD: Record<Exclude<StaffAccidental, null>, string> = {
  '#': 'sharp', b: 'flat', '##': 'doubleSharp', bb: 'doubleFlat', n: 'natural',
};
const LIST_LOCALE: Record<Lang, string> = { en: 'en-GB', pt: 'pt-PT', es: 'es-ES' };

/**
 * What each note prints before it — exactly what the drawing prints
 * (`vexAccidentals`, useStaffNotation's own call): nothing where the key
 * signature, or an earlier note on the same line, already supplies it; a
 * natural where one of them would otherwise alter it.
 */
function printedAccidentals(staff: DescribedStaff): StaffAccidental[] {
  const sig = staff.keySignature && keySignatureMarks(staff.keySignature, staff.clef) ? staff.keySignature : null;
  return vexAccidentals(staff.notes, sig);
}

/**
 * The description, in the language of `t` (`lang` for its lists). Each part
 * is a sentence: the clef (and the key signature), the notes, and — when a
 * line or space is numbered — how those numbers are counted.
 */
export function describeStaff(staff: DescribedStaff, t: TFunction, lang: Lang): string {
  const k = (key: string, values?: Record<string, unknown>) => t(`learnWords.staff.${key}`, values ?? {}) as string;
  const list = (items: string[]) => new Intl.ListFormat(LIST_LOCALE[lang], { type: 'conjunction' }).format(items);
  const clef = t(staff.clef === 'treble' ? 'lesson.trebleClef' : 'lesson.bassClef') as string;
  const sentences: string[] = [];

  const marks = staff.keySignature !== undefined ? keySignatureMarks(staff.keySignature, staff.clef) : null;
  if (marks) {
    const signature = marks.length === 0
      ? k('noSignature')
      : k(marks[0].type === '#' ? 'sharps' : 'flats', {
        count: marks.length,
        places: list(marks.map((m) => k(m.pos === 9 ? 'sigSpaceAbove' : m.pos === -1 ? 'sigSpaceBelow' : m.pos % 2 === 0 ? 'sigLine' : 'sigSpace', { letter: letterAt(m.pos, staff.clef) }))),
      });
    sentences.push(k('clefSignature', { clef, signature }));
  } else {
    sentences.push(k('clef', { clef }));
  }

  let numberedStaff = false;
  let numberedLedger = false;
  const printed = printedAccidentals(staff);
  const order = staff.notes.map((n, i) => ({ n, i }));
  // A chord is read from its lowest note up; a melody in the order it is written.
  if (staff.chord) order.sort((a, b) => staffStep(a.n) - staffStep(b.n));
  const places = order.map(({ n, i }) => {
    const place = staffPlace(staffPosition(n, staff.clef));
    if (place.kind === 'line' || place.kind === 'space') numberedStaff = true;
    if ('n' in place && place.kind !== 'line' && place.kind !== 'space') numberedLedger = true;
    const where = k(`place.${place.kind}`, 'n' in place ? { n: place.n } : {});
    const acc = printed[i];
    return acc ? `${where}, ${k(`acc.${ACCIDENTAL_WORD[acc]}`)}` : where;
  });
  if (places.length === 1) sentences.push(k('oneNote', { place: places[0] }));
  else if (places.length > 1 && staff.chord) sentences.push(k('chord', { count: places.length, places: list(places) }));
  else if (places.length > 1) sentences.push(k('notesInOrder', { count: places.length, places: places.join(k('then')) }));
  // How the numbers are counted, for exactly the kinds the description numbers.
  if (numberedStaff) sentences.push(k('counted'));
  if (numberedLedger) sentences.push(k('countedLedger'));
  return sentences.join(' ');
}
