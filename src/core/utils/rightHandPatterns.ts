// Right-hand arpeggio patterns for the classical guitar (audit W10-06; data
// only — the trainer UI comes later).
//
// Notation (audit Track G R20): p = thumb, i = index, m = middle, a = ring.
// A pattern is a list of strokes; a stroke is the fingers that pluck together
// (p+a is a pinch, p+i+m+a a block chord). The names are the letters
// themselves plus a plain description of the shape — never a study or method
// number: the research could not confirm which pattern belongs to which
// collection (Giuliani Op. 1, R23, is marked [verify]). (Trinity's ppppima and
// ppimim… are not accompaniment patterns: its Grade-5 syllabus gives them as
// the right-hand fingering of the arpeggios, so they live with the technical
// set in guitarTechnique.ts.)
//
// A pattern is expanded over a chord progression (default I–V7–I) on the
// chord shapes the fretboard already shows (guitarChordShapes.ts, the
// nut-closest default grip). Classical string assignment: the thumb plays the
// bass — the lowest string the grip sounds, the chord's root in every default
// grip — and, on a second thumb stroke in the bar, the alternate bass: the
// chord's FIFTH on another bass string of the grip, never the third (when the
// grip has no fifth below the treble strings, the thumb repeats the root); i
// the 3rd string, m the 2nd, a the 1st. When a grip leaves one of those
// strings silent, i/m/a take the three highest sounding strings above the bass
// instead.
//
// Standard tuning only (the chord-shape library is standard-tuning only).
// Pure and framework-agnostic.

import type { ChordQuality, Note, PitchedNote } from '../types/music';
import { buildChord } from '../constants/chords';
import { getPitchClass } from '../constants/notes';
import { getChordShapesWithFallback, sortShapesForDefault } from '../constants/guitarChordShapes';
import type { ChordShape } from '../constants/guitarChordShapes';
import { TUNING_STANDARD } from '../constants/guitarTunings';
import { spellDegree, parseDegree } from './degreeSpelling';
import { tuningOpenMidi } from './guitarPositions';
import type { LeftHandFinger } from './guitarPositions';

export type RightHandFinger = 'p' | 'i' | 'm' | 'a';

/** The fingers that pluck at once, thumb first. */
export type Stroke = readonly RightHandFinger[];

export interface RightHandPattern {
  /** Stable id: the strokes, '-' between strokes, '+' inside one ('p+a-i-m-i'). */
  id: string;
  /** The pattern in classical notation ('p i m a', '(p+a) i m i'). */
  name: string;
  /** Plain shape of the pattern, for the UI to word. */
  contour: 'rising' | 'falling' | 'rising-falling' | 'alternating' | 'block' | 'pinch';
  /** Natural grouping: binary (2/4 or 4/4 eighths) or ternary (triplets, 3/8, 6/8). */
  subdivision: 'binary' | 'ternary';
  strokes: readonly Stroke[];
}

const P = (id: string, contour: RightHandPattern['contour'], subdivision: RightHandPattern['subdivision']): RightHandPattern => {
  const strokes = id.split('-').map((s) => s.split('+') as RightHandFinger[]);
  const name = strokes.map((s) => (s.length > 1 ? `(${s.join('+')})` : s[0])).join(' ');
  return { id, name, contour, subdivision, strokes };
};

/** The pattern library, simplest first. */
export const RIGHT_HAND_PATTERNS: readonly RightHandPattern[] = [
  P('p-i-m-a', 'rising', 'binary'),
  P('p-a-m-i', 'falling', 'binary'),
  P('p-i-m', 'rising', 'ternary'),
  P('p-i-m-i', 'alternating', 'binary'),
  P('p-m-i-m', 'alternating', 'binary'),
  P('p-i-m-a-m-i', 'rising-falling', 'ternary'),
  P('p-i-m-i-p-i-m-i', 'alternating', 'binary'),
  P('p+a-i-m-i', 'pinch', 'binary'),
  P('p-i+m+a', 'block', 'binary'),
  P('p+i+m+a', 'block', 'binary'),
];

export function getRightHandPattern(id: string): RightHandPattern | undefined {
  return RIGHT_HAND_PATTERNS.find((p) => p.id === id);
}

// ─── Progressions ───────────────────────────────────────────────────────────

/** Roman numerals the study accepts: degree (spelled against the key) and chord quality. */
const NUMERALS: Record<'major' | 'minor', Record<string, { degree: string; quality: ChordQuality }>> = {
  major: {
    I: { degree: '1', quality: 'major' },
    ii: { degree: '2', quality: 'minor' },
    iii: { degree: '3', quality: 'minor' },
    IV: { degree: '4', quality: 'major' },
    V: { degree: '5', quality: 'major' },
    V7: { degree: '5', quality: 'dominant7' },
    vi: { degree: '6', quality: 'minor' },
  },
  minor: {
    i: { degree: '1', quality: 'minor' },
    III: { degree: 'b3', quality: 'major' },
    iv: { degree: '4', quality: 'minor' },
    V: { degree: '5', quality: 'major' },
    V7: { degree: '5', quality: 'dominant7' },
    VI: { degree: 'b6', quality: 'major' },
  },
};

export const DEFAULT_PROGRESSION: Record<'major' | 'minor', readonly string[]> = {
  major: ['I', 'V7', 'I'],
  minor: ['i', 'V7', 'i'],
};

/** The numerals a key's study accepts. */
export function progressionNumerals(mode: 'major' | 'minor'): string[] {
  return Object.keys(NUMERALS[mode]);
}

// ─── Expansion ──────────────────────────────────────────────────────────────

export interface RightHandNote {
  /** Index of the stroke within the bar (notes of one stroke sound together). */
  stroke: number;
  rh: RightHandFinger;
  /** 0 = 6th string … 5 = 1st string. */
  stringIndex: number;
  /** Absolute fret (0 = open). */
  fret: number;
  /** Left-hand finger from the grip (a barre is the index, 1). */
  lh: LeftHandFinger;
  midi: number;
  /** Spelled chord tone. */
  note: Note;
  pitched: PitchedNote;
}

export interface RightHandBar {
  numeral: string;
  chord: { root: Note; quality: ChordQuality };
  shape: { name: string; baseFret: number };
  /** What a second thumb stroke plays: the chord's fifth, or the root again when the grip has no fifth in the bass. */
  alternateBass: 'fifth' | 'root';
  /** In playing order. */
  notes: RightHandNote[];
}

export interface RightHandStudy {
  key: Note;
  mode: 'major' | 'minor';
  pattern: RightHandPattern;
  bars: RightHandBar[];
}

interface StringAssignment {
  /** Thumb strings in turn: the bass, then the alternate bass (the same string when there is none). */
  bass: [number, number];
  alternateBass: 'fifth' | 'root';
  i: number;
  m: number;
  a: number;
}

/**
 * Which string each finger plays on a placed grip, or null when the grip has
 * too few strings. `isFifth(s)` says whether string s sounds the chord's 5th:
 * the alternate bass is the fifth on another string below the treble ones
 * (the nearest to the bass), else the root again.
 */
export function assignStrings(sounding: readonly number[], isFifth: (s: number) => boolean = () => false): StringAssignment | null {
  if (sounding.length < 4) return null;
  const bass = sounding[0];
  const classical = [3, 4, 5];
  const treble = classical.every((s) => sounding.includes(s) && s > bass) ? classical : sounding.slice(-3);
  if (treble.length < 3 || treble[0] <= bass) return null;
  const fifth = sounding.find((s) => s !== bass && s < treble[0] && isFifth(s));
  return {
    bass: [bass, fifth ?? bass],
    alternateBass: fifth === undefined ? 'root' : 'fifth',
    i: treble[0],
    m: treble[1],
    a: treble[2],
  };
}

function placeChord(root: Note, quality: ChordQuality): { shape: ChordShape; baseFret: number } | null {
  const chord = buildChord(root, quality);
  const shapes = sortShapesForDefault(getChordShapesWithFallback(chord));
  return shapes[0] ?? null;
}

/** One bar of `pattern` on a chord, or null when no grip can carry it. */
export function expandPattern(pattern: RightHandPattern, root: Note, quality: ChordQuality, numeral = ''): RightHandBar | null {
  const placed = placeChord(root, quality);
  if (placed === null) return null;
  const open = tuningOpenMidi(TUNING_STANDARD);
  const chordNotes = buildChord(root, quality).notes;
  const fretOf = (s: number) => {
    const p = placed.shape.strings[s];
    return p.fret === null ? null : placed.baseFret + p.fret;
  };
  const sounding = [0, 1, 2, 3, 4, 5].filter((s) => fretOf(s) !== null);
  const fifthPc = getPitchClass(chordNotes[2]);
  const strings = assignStrings(sounding, (s) => (open[s] + fretOf(s)!) % 12 === fifthPc);
  if (strings === null) return null;

  const notes: RightHandNote[] = [];
  let thumb = 0;
  for (let k = 0; k < pattern.strokes.length; k++) {
    for (const rh of pattern.strokes[k]) {
      const s = rh === 'p' ? strings.bass[thumb++ % 2] : strings[rh];
      const fret = fretOf(s)!;
      const midi = open[s] + fret;
      // Grips never sound a non-chord tone (guitarChordShapes guards it); if
      // one ever did, refuse the bar rather than drop or misname a note.
      const note = chordNotes.find((n) => getPitchClass(n) === midi % 12);
      if (!note) return null;
      const f = placed.shape.strings[s].finger;
      const lh = (fret === 0 ? 0 : f === 'bar' ? 1 : (f ?? 0)) as LeftHandFinger;
      notes.push({ stroke: k, rh, stringIndex: s, fret, lh, midi, note, pitched: { ...note, octave: Math.floor((midi - 12) / 12) } });
    }
  }
  return {
    numeral,
    chord: { root, quality },
    shape: { name: placed.shape.name, baseFret: placed.baseFret },
    alternateBass: strings.alternateBass,
    notes,
  };
}

/**
 * A right-hand study: `pattern` once per chord of `progression` (numerals of
 * the key; default I–V7–I, or i–V7–i in minor). Null for an unknown pattern or
 * numeral, or when a chord has no grip that carries the pattern.
 */
export function rightHandStudy(
  key: Note,
  mode: 'major' | 'minor',
  patternId: string,
  progression: readonly string[] = DEFAULT_PROGRESSION[mode],
): RightHandStudy | null {
  const pattern = getRightHandPattern(patternId);
  if (!pattern) return null;
  const bars: RightHandBar[] = [];
  for (const numeral of progression) {
    const spec = NUMERALS[mode][numeral];
    if (!spec) return null;
    const bar = expandPattern(pattern, spellDegree(key, parseDegree(spec.degree)), spec.quality, numeral);
    if (bar === null) return null;
    bars.push(bar);
  }
  return { key, mode, pattern, bars };
}
