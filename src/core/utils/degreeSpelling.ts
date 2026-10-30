/**
 * degreeSpelling — the ONE letter-based spelling engine (audit W1/W2, 2026-10-30).
 *
 * Every display that names a note, labels a degree or an interval, colours a
 * degree, writes a note on the staff or names a key signature routes through
 * here, so the name, the label, the colour and the staff position can never
 * disagree again. The rules:
 *
 *   - A scale is a list of SPELLED DEGREES (`1 2 b3 4 5 b6 b7`), not semitones.
 *     The note for degree n sits on the letter n-1 steps above the root's
 *     letter; its accidental is whatever makes the pitch right.
 *   - A degree is read back from a spelled note by LETTER DISTANCE (the number)
 *     and SEMITONE DIFFERENCE against the major scale (the alteration). Labels
 *     and colours come from that reading, never from a note's position in a
 *     list or from a semitone count alone.
 *   - Double accidentals appear only when the root's own spelling forces them
 *     (G♯ major has F𝄪). Symmetric scales, whose spelling is a convention, pick
 *     the conventional formula with the fewest double accidentals and then the
 *     fewest accidentals for the given root.
 *   - Beyond a double accidental the letter rule yields and the pitch is
 *     respelled (a right-sounding note beats a pure letter name); the label is
 *     then read from the respelled note, so it still agrees with what is shown.
 *
 * Conventions (decision D-13): blues blue note = ♭5; scale-degree and
 * chord-formula labels in ♭3 style with the tonic/root shown as "R"; interval
 * NAMES in m3 style (a different concept: the size between two notes).
 *
 * Framework-agnostic: no React, no DOM, no VexFlow.
 */

import type {
  Note,
  NaturalNote,
  Accidental,
  ScaleType,
  PitchedNote,
} from '../types/music';
import {
  NATURAL_NOTE_ORDER,
  NATURAL_TO_PITCH_CLASS,
  getPitchClass,
  getSimplestSpelling,
} from '../constants/notes';

// ─── Degrees ────────────────────────────────────────────────────────────────

/** A spelled degree relative to a root: `{ number: 3, alteration: -1 }` = ♭3. */
export interface Degree {
  /** 1–7 within the octave; 8+ for compound chord tones (9, 11, 13). */
  readonly number: number;
  /** Semitones against the major-scale degree: −2 (𝄫) … +2 (𝄪). */
  readonly alteration: number;
}

/** Semitones above the root for degrees 1–7 of the major scale. */
export const MAJOR_DEGREE_SEMITONES: readonly number[] = [0, 2, 4, 5, 7, 9, 11];

const mod12 = (n: number): number => ((n % 12) + 12) % 12;

const ACCIDENTAL_BY_OFFSET: Record<number, Accidental> = {
  [-2]: 'bb',
  [-1]: 'b',
  0: '',
  1: '#',
  2: '##',
};

const OFFSET_BY_ACCIDENTAL: Record<Accidental, number> = {
  bb: -2,
  b: -1,
  '': 0,
  '#': 1,
  '##': 2,
};

/** Semitone offset of an accidental (♭ = −1, 𝄪 = +2, …). */
export function accidentalOffset(accidental: Accidental): number {
  return OFFSET_BY_ACCIDENTAL[accidental] ?? 0;
}

/** Parse "b3", "#4", "bb7", "1", "9", "#11" into a Degree. */
export function parseDegree(label: string): Degree {
  const m = /^(bb|b|##|#)?(\d+)$/.exec(label.trim());
  if (!m) throw new Error(`Not a degree label: "${label}"`);
  const acc = (m[1] ?? '') as Accidental;
  return { number: Number(m[2]), alteration: OFFSET_BY_ACCIDENTAL[acc] };
}

/**
 * Format a degree in ♭3 style. The unaltered tonic/root prints as `tonic`
 * ("R" by default — one notation for the scale-degree bar, Scale Comparison and
 * chord formulas).
 */
export function formatDegree(d: Degree, tonic: string = 'R'): string {
  if (d.number === 1 && d.alteration === 0) return tonic;
  const acc = d.alteration < 0 ? 'b'.repeat(-d.alteration) : '#'.repeat(d.alteration);
  return `${acc}${d.number}`;
}

/** Semitones above the root for a degree (compound degrees add octaves). */
export function degreeSemitones(d: Degree): number {
  const n = d.number - 1;
  return MAJOR_DEGREE_SEMITONES[n % 7] + 12 * Math.floor(n / 7) + d.alteration;
}

/** Function colour slot 1–7 for a degree (9 → 2, 11 → 4, 13 → 6). */
export function degreeColorSlot(d: Degree): 1 | 2 | 3 | 4 | 5 | 6 | 7 {
  return ((((d.number - 1) % 7) + 7) % 7 + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

// ─── Letters and single notes ───────────────────────────────────────────────

/** The natural letter `steps` letters above `letter` (negative = below). */
export function letterAbove(letter: NaturalNote, steps: number): NaturalNote {
  const i = NATURAL_NOTE_ORDER.indexOf(letter);
  return NATURAL_NOTE_ORDER[(((i + steps) % 7) + 7) % 7];
}

/** Letter distance from `from` up to `to`, 0–6. */
export function letterDistance(from: NaturalNote, to: NaturalNote): number {
  return (NATURAL_NOTE_ORDER.indexOf(to) - NATURAL_NOTE_ORDER.indexOf(from) + 7) % 7;
}

/** Spell a pitch class on a given letter, or null if that needs more than a double accidental. */
export function spellOnLetter(pitchClass: number, letter: NaturalNote): Note | null {
  let offset = mod12(pitchClass - NATURAL_TO_PITCH_CLASS[letter]);
  if (offset > 6) offset -= 12;
  const accidental = ACCIDENTAL_BY_OFFSET[offset];
  return accidental === undefined ? null : { natural: letter, accidental };
}

/**
 * The note `semitones` above `root` on the letter `number − 1` steps up, or
 * null when that needs a triple accidental.
 */
export function spellIntervalAboveStrict(root: Note, number: number, semitones: number): Note | null {
  return spellOnLetter(mod12(getPitchClass(root) + semitones), letterAbove(root.natural, number - 1));
}

/** As {@link spellIntervalAboveStrict}, respelling (simplest name) instead of failing. */
export function spellIntervalAbove(root: Note, number: number, semitones: number): Note {
  return (
    spellIntervalAboveStrict(root, number, semitones) ??
    getSimplestSpelling(mod12(getPitchClass(root) + semitones) as Parameters<typeof getSimplestSpelling>[0])
  );
}

/** The note `semitones` BELOW `root` on the letter `number − 1` steps down (respelled past 𝄫/𝄪). */
export function spellIntervalBelow(root: Note, number: number, semitones: number): Note {
  const pc = mod12(getPitchClass(root) - semitones);
  return (
    spellOnLetter(pc, letterAbove(root.natural, -(number - 1))) ??
    getSimplestSpelling(pc as Parameters<typeof getSimplestSpelling>[0])
  );
}

/** Spell a degree above a root (e.g. ♭3 of A = C). */
export function spellDegree(root: Note, degree: Degree): Note {
  return spellIntervalAbove(root, degree.number, degreeSemitones(degree));
}

/**
 * Read the degree of a spelled note above a root: the number from the letter
 * distance, the alteration from the semitone difference. B♯ over C reads #7,
 * D♭ over C reads ♭2, C♯ over C reads #1.
 */
export function degreeOf(root: Note, note: Note): Degree {
  const steps = letterDistance(root.natural, note.natural);
  let alteration = mod12(getPitchClass(note) - getPitchClass(root)) - MAJOR_DEGREE_SEMITONES[steps];
  if (alteration > 6) alteration -= 12;
  if (alteration < -6) alteration += 12;
  return { number: steps + 1, alteration };
}

/** Number of accidental marks a note carries (𝄪/𝄫 count 2). */
export function accidentalMarks(note: Note): number {
  return Math.abs(accidentalOffset(note.accidental));
}

// ─── Interval names (m3 style) ──────────────────────────────────────────────

export type IntervalQualityCode = 'P' | 'M' | 'm' | 'A' | 'd' | 'AA' | 'dd';

export interface IntervalName {
  /** 1–7 (simple) or the compound number passed in. */
  number: number;
  quality: IntervalQualityCode;
  /** "m3", "P5", "A4", "d7". */
  short: string;
  /** "Minor 3rd", "Perfect 5th", "Augmented 4th", "Diminished 7th". */
  long: string;
}

const PERFECT_CLASS = new Set([1, 4, 5]);
const QUALITY_WORD: Record<IntervalQualityCode, string> = {
  P: 'Perfect',
  M: 'Major',
  m: 'Minor',
  A: 'Augmented',
  d: 'Diminished',
  AA: 'Doubly augmented',
  dd: 'Doubly diminished',
};

function ordinal(n: number): string {
  if (n === 1) return 'Unison';
  if (n === 8) return 'Octave';
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const suffix = n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th';
  return `${n}${suffix}`;
}

/** Name a degree as an interval above the root ("♭3" → Minor 3rd, "#11" → Augmented 11th). */
export function intervalNameOfDegree(d: Degree): IntervalName {
  const simple = ((d.number - 1) % 7) + 1;
  const a = d.alteration;
  let quality: IntervalQualityCode;
  if (PERFECT_CLASS.has(simple)) {
    quality = a === 0 ? 'P' : a === 1 ? 'A' : a === -1 ? 'd' : a >= 2 ? 'AA' : 'dd';
  } else {
    quality = a === 0 ? 'M' : a === -1 ? 'm' : a === 1 ? 'A' : a === -2 ? 'd' : a >= 2 ? 'AA' : 'dd';
  }
  const word = QUALITY_WORD[quality];
  return {
    number: d.number,
    quality,
    short: `${quality}${d.number}`,
    long: `${word} ${ordinal(d.number)}`,
  };
}

/** Name the ascending simple interval from `lower` up to `upper` by their spelling. */
export function intervalBetween(lower: Note, upper: Note): IntervalName {
  return intervalNameOfDegree(degreeOf(lower, upper));
}

/**
 * The interval number the app's interval answer key names for a semitone count
 * (INTERVAL_LABELS: 1 = Minor 2nd, 3 = Minor 3rd, 6 = Tritone = augmented 4th,
 * 8 = Minor 6th, 12 = Octave). Used to spell the upper note of an interval so
 * the staff draws the interval the answer key asks about.
 */
export function canonicalIntervalNumber(semitones: number): number {
  const s = ((semitones % 12) + 12) % 12;
  const octaves = Math.floor(semitones / 12);
  if (semitones > 0 && s === 0) return 8 + 7 * (octaves - 1);
  const BY_SEMITONES = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7];
  return BY_SEMITONES[s] + 7 * octaves;
}

/**
 * The second note of an interval exercise, spelled as the interval the answer
 * key names (audit W1-01): 3 semitones is graded "Minor 3rd", so C up 3 is
 * E♭ (a 3rd), never D♯ (an augmented 2nd). The interval number picks the
 * letter, the semitones the accidental; the octave (app convention: octave of
 * the sounding pitch class) follows the pitch.
 */
export function intervalTargetNote(
  root: PitchedNote,
  semitones: number,
  direction: 'ascending' | 'descending',
): PitchedNote {
  const number = canonicalIntervalNumber(semitones);
  const note = direction === 'descending'
    ? spellIntervalBelow(root, number, semitones)
    : spellIntervalAbove(root, number, semitones);
  const midi = 12 + 12 * root.octave + getPitchClass(root) + (direction === 'descending' ? -semitones : semitones);
  return { ...note, octave: Math.floor((midi - 12) / 12) };
}

// ─── Scale formulas ─────────────────────────────────────────────────────────

const F = (s: string): readonly string[] => s.split(' ');

/**
 * The conventional spelled-degree formula of every scale type. Heptatonic
 * scales use one letter per degree; the others name each note by its degree
 * (pentatonic ♭3, blues ♭5, bebop major's ♭6 passing tone).
 *
 * Sources for the non-obvious conventions: blues ♭5 (decision D-13); bebop
 * major's passing tone between the 5th and 6th is written ♭6 (A♭ in C), as
 * the app's own formula comment has it ("Major with added b6") — both ♭6 and
 * ♯5 are in use (Wikipedia "Bebop scale", accessed 2026-10-30, writes ♯5);
 * ♭6 avoids F𝄪 in B bebop major (review decision, 2026-10-30); diminished
 * half-whole 1 ♭2 ♯2 3 ♯4 5 6 ♭7 and whole-half 1 2 ♭3 4 ♭5 ♭6 6 7 (the
 * dominant / diminished-chord readings).
 */
export const SCALE_DEGREE_FORMULAS: Readonly<Record<ScaleType, readonly string[]>> = {
  major: F('1 2 3 4 5 6 7'),
  natural_minor: F('1 2 b3 4 5 b6 b7'),
  harmonic_minor: F('1 2 b3 4 5 b6 7'),
  melodic_minor: F('1 2 b3 4 5 6 7'),
  dorian: F('1 2 b3 4 5 6 b7'),
  phrygian: F('1 b2 b3 4 5 b6 b7'),
  lydian: F('1 2 3 #4 5 6 7'),
  mixolydian: F('1 2 3 4 5 6 b7'),
  locrian: F('1 b2 b3 4 b5 b6 b7'),
  pentatonic_major: F('1 2 3 5 6'),
  pentatonic_minor: F('1 b3 4 5 b7'),
  blues: F('1 b3 4 b5 5 b7'),
  whole_tone: F('1 2 3 #4 #5 b7'),
  diminished_whole_half: F('1 2 b3 4 b5 b6 6 7'),
  diminished_half_whole: F('1 b2 #2 3 #4 5 6 b7'),
  chromatic: F('1 #1 2 #2 3 4 #4 5 #5 6 #6 7'),
  altered: F('1 b2 b3 b4 b5 b6 b7'),
  lydian_dominant: F('1 2 3 #4 5 6 b7'),
  phrygian_dominant: F('1 b2 3 4 5 b6 b7'),
  major_blues: F('1 2 b3 3 5 6'),
  locrian_natural2: F('1 2 b3 4 b5 b6 b7'),
  bebop_dominant: F('1 2 3 4 5 6 b7 7'),
  bebop_major: F('1 2 3 4 5 b6 6 7'),
  bebop_dorian: F('1 2 b3 3 4 5 6 b7'),
  dorian_b2: F('1 b2 b3 4 5 6 b7'),
  lydian_augmented: F('1 2 3 #4 #5 6 7'),
  mixolydian_b6: F('1 2 3 4 5 b6 b7'),
  hungarian_minor: F('1 2 b3 #4 5 b6 7'),
  hungarian_major: F('1 #2 3 #4 5 6 b7'),
  double_harmonic: F('1 b2 3 4 5 b6 7'),
  persian: F('1 b2 3 4 b5 b6 7'),
  neapolitan_minor: F('1 b2 b3 4 5 b6 7'),
  neapolitan_major: F('1 b2 b3 4 5 6 7'),
  hirajoshi: F('1 2 b3 5 b6'),
  in_sen: F('1 b2 4 5 b7'),
  iwato: F('1 b2 4 b5 b7'),
  egyptian: F('1 2 4 5 b7'),
};

/**
 * The symmetric scales' spelling is a convention, so each position lists every
 * conventional degree name (the first is the primary convention). For a given
 * root the app takes the combination with the fewest double accidentals, then
 * the fewest accidentals; ties keep the primary names, or the flat names when
 * the root itself is a flat. So C♯ whole tone is C♯ D♯ E♯ G A B (not
 * C♯ D♯ E♯ F𝄪 G𝄪 B), C half-whole is C D♭ D♯ E F♯ G A B♭, and F♯ chromatic
 * is F♯ G G♯ A A♯ B C C♯ D D♯ E E♯ ("naturals preferred, sharps ascending").
 */
const SYMMETRIC_OPTIONS: Partial<Record<ScaleType, readonly (readonly string[])[]>> = {
  whole_tone: [['1'], ['2'], ['3'], ['#4', 'b5'], ['#5', 'b6'], ['b7', '#6']],
  diminished_whole_half: [['1'], ['2'], ['b3'], ['4'], ['b5', '#4'], ['b6', '#5'], ['6'], ['7']],
  diminished_half_whole: [['1'], ['b2'], ['#2', 'b3'], ['3'], ['#4', 'b5'], ['5'], ['6'], ['b7']],
  chromatic: [
    ['1'], ['#1', 'b2'], ['2'], ['#2', 'b3'], ['3'], ['4'],
    ['#4', 'b5'], ['5'], ['#5', 'b6'], ['6'], ['#6', 'b7'], ['7'],
  ],
};

function spellingCost(notes: readonly Note[]): [number, number] {
  let doubles = 0;
  let marks = 0;
  for (const n of notes) {
    const m = accidentalMarks(n);
    if (m >= 2) doubles++;
    marks += m;
  }
  return [doubles, marks];
}

function spellSymmetric(root: Note, options: readonly (readonly string[])[]): Note[] {
  const preferFlat = root.accidental === 'b' || root.accidental === 'bb';
  // Per position: candidate notes, primary first (flat names first for a flat root).
  const candidates: Note[][] = options.map((names) => {
    const ordered = preferFlat
      ? [...names].sort((a, b) => Number(b.startsWith('b')) - Number(a.startsWith('b')))
      : names;
    return ordered.map((label) => spellDegree(root, parseDegree(label)));
  });
  let best: Note[] = candidates.map((c) => c[0]);
  let bestCost = spellingCost(best);
  const pick: Note[] = [];
  const walk = (i: number): void => {
    if (i === candidates.length) {
      const cost = spellingCost(pick);
      if (cost[0] < bestCost[0] || (cost[0] === bestCost[0] && cost[1] < bestCost[1])) {
        best = [...pick];
        bestCost = cost;
      }
      return;
    }
    for (const note of candidates[i]) {
      pick.push(note);
      walk(i + 1);
      pick.pop();
    }
  };
  walk(0);
  return best;
}

/** The engine-spelled notes of a scale (one entry per scale degree, no octave repeat). */
export function spellScale(root: Note, type: ScaleType): Note[] {
  const options = SYMMETRIC_OPTIONS[type];
  if (options) return spellSymmetric(root, options);
  return SCALE_DEGREE_FORMULAS[type].map((label) => spellDegree(root, parseDegree(label)));
}

/** The degree each note of a spelled scale stands for, read back from its spelling. */
export function scaleDegrees(root: Note, notes: readonly Note[]): Degree[] {
  return notes.map((n) => degreeOf(root, n));
}

/** "R 2 b3 4 5 b6 b7"-style labels for a spelled scale. */
export function scaleDegreeLabels(root: Note, notes: readonly Note[]): string[] {
  return scaleDegrees(root, notes).map((d) => formatDegree(d));
}

// ─── Root spelling (key picker) ─────────────────────────────────────────────

/** The two everyday names of each black key, in the app's historical order. */
const BLACK_KEY_NAMES: Record<number, readonly [Note, Note]> = {
  1: [{ natural: 'C', accidental: '#' }, { natural: 'D', accidental: 'b' }],
  3: [{ natural: 'E', accidental: 'b' }, { natural: 'D', accidental: '#' }],
  6: [{ natural: 'F', accidental: '#' }, { natural: 'G', accidental: 'b' }],
  8: [{ natural: 'A', accidental: 'b' }, { natural: 'G', accidental: '#' }],
  10: [{ natural: 'B', accidental: 'b' }, { natural: 'A', accidental: '#' }],
};

const NATURAL_BY_PC: Record<number, NaturalNote> = {
  0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B',
};

/**
 * How "big" a root spelling is for a scale, the way musicians choose a key's
 * name: the size of the scale's own key signature (A♭ minor 7♭ vs G♯ minor
 * 5♯), or — for scales without a standard signature (blues aside: bebop,
 * symmetric, world scales) — the size of the root's MAJOR key signature
 * (E♭ 3♭ over D♯ 9♯). Double flats/sharps count twice.
 */
export function rootSpellingSize(root: Note, type: ScaleType): number {
  return (keySignatureForScale(root, type) ?? majorKeySignature(root)).count;
}

/**
 * The root spelling the key picker offers for a pitch class and scale type:
 * white keys keep their natural name; a black key takes whichever of its two
 * names has the smaller key signature for that scale (D♭ major, C♯ minor,
 * G♯ minor and melodic minor, E♭ blues), ties keeping the historical label
 * (C♯, E♭, F♯, A♭, B♭).
 */
export function preferredRootSpelling(pitchClass: number, type: ScaleType): Note {
  const pc = mod12(pitchClass);
  const natural = NATURAL_BY_PC[pc];
  if (natural) return { natural, accidental: '' };
  const [first, second] = BLACK_KEY_NAMES[pc];
  return rootSpellingSize(second, type) < rootSpellingSize(first, type) ? second : first;
}

/** The other everyday name of a black-key root (C♯ ↔ D♭), or null for white keys and other spellings. */
export function enharmonicRootAlternative(root: Note): Note | null {
  const names = BLACK_KEY_NAMES[getPitchClass(root)];
  if (!names) return null;
  const same = (a: Note, b: Note) => a.natural === b.natural && a.accidental === b.accidental;
  if (same(root, names[0])) return names[1];
  if (same(root, names[1])) return names[0];
  return null;
}

// ─── Key signatures ─────────────────────────────────────────────────────────

/**
 * Which major key's signature a scale is conventionally written with, as a
 * degree of the scale's root. Scales absent here have no standard signature
 * (symmetric, bebop, melodic-minor modes, world scales): the circle hides it.
 */
const PARENT_MAJOR_DEGREE: Partial<Record<ScaleType, string>> = {
  major: '1',
  pentatonic_major: '1',
  major_blues: '1',
  natural_minor: 'b3',
  harmonic_minor: 'b3',
  melodic_minor: 'b3',
  pentatonic_minor: 'b3',
  blues: 'b3',
  dorian: 'b7',
  phrygian: 'b6',
  lydian: '5',
  mixolydian: '4',
  locrian: 'b2',
};

/** The church modes, whose Roman numerals are written against the parallel major (♭VII). */
export const CHURCH_MODES: ReadonlySet<ScaleType> = new Set<ScaleType>([
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'locrian',
]);

/** The major key whose signature a scale uses (A dorian → G), or null if none applies. */
export function parentMajorKey(root: Note, type: ScaleType): Note | null {
  const rule = PARENT_MAJOR_DEGREE[type];
  return rule ? spellDegree(root, parseDegree(rule)) : null;
}

export interface SignatureInfo {
  /** The major key the signature belongs to. */
  parent: Note;
  /** Number of accidental marks (a 𝄫 counts 2 — theoretical keys exceed 7). */
  count: number;
  /** '#', 'b', or '' for no accidentals. */
  type: '#' | 'b' | '';
  /** The altered letters, in the order the major scale meets them. */
  alterations: Partial<Record<NaturalNote, Accidental>>;
}

/** The key signature of a major key, counted from its spelled scale. */
export function majorKeySignature(tonic: Note): SignatureInfo {
  const notes = spellScale(tonic, 'major');
  const alterations: Partial<Record<NaturalNote, Accidental>> = {};
  let count = 0;
  let sharps = 0;
  let flats = 0;
  for (const n of notes) {
    if (n.accidental === '') continue;
    alterations[n.natural] = n.accidental;
    const off = accidentalOffset(n.accidental);
    count += Math.abs(off);
    if (off > 0) sharps++;
    else flats++;
  }
  return { parent: tonic, count, type: sharps > 0 ? '#' : flats > 0 ? 'b' : '', alterations };
}

/** The conventional key signature of a scale (its parent major's), or null when none applies. */
export function keySignatureForScale(root: Note, type: ScaleType): SignatureInfo | null {
  const parent = parentMajorKey(root, type);
  return parent ? majorKeySignature(parent) : null;
}

/** "no ♯/♭", "3♯", "6♭", "8♭" — the circle's signature text. */
export function formatKeySignature(sig: SignatureInfo, none: string = 'no ♯/♭'): string {
  if (sig.count === 0) return none;
  return `${sig.count}${sig.type === '#' ? '♯' : '♭'}`;
}

// ─── Staff writing ──────────────────────────────────────────────────────────

/**
 * The scientific (letter) octave of a note. The app's PitchedNote octave is the
 * octave of the SOUNDING pitch class (MIDI = 12 + 12·octave + pc), so B♯ that
 * sounds as C5 carries octave 5; on the staff and in names it is B♯4. C♭ that
 * sounds as B3 is C♭4.
 */
export function writtenOctave(note: Note, pitchOctave: number): number {
  const raw = NATURAL_TO_PITCH_CLASS[note.natural] + accidentalOffset(note.accidental);
  return pitchOctave + (getPitchClass(note) - raw) / 12;
}

/** What the staff must print in front of a note: an accidental, a natural ('n'), or nothing. */
export type StaffAccidental = '#' | 'b' | '##' | 'bb' | 'n' | null;

/**
 * The accidentals a correctly written single measure needs, given a key
 * signature: a note whose accidental the signature (or an earlier accidental on
 * the same line in the measure) already supplies prints nothing; a natural the
 * signature alters prints ♮; anything else prints its accidental, which then
 * holds for that line until the barline.
 */
export function staffAccidentals(
  notes: readonly PitchedNote[],
  signature: Partial<Record<NaturalNote, Accidental>> = {},
): StaffAccidental[] {
  const inForce = new Map<string, Accidental>();
  return notes.map((n) => {
    const line = `${n.natural}${writtenOctave(n, n.octave)}`;
    const current = inForce.get(line) ?? signature[n.natural] ?? '';
    if (current === n.accidental) return null;
    inForce.set(line, n.accidental);
    return n.accidental === '' ? 'n' : n.accidental;
  });
}
