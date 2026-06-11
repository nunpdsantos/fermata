/**
 * Phase 1 engine verification — runs independent checks across the music-theory
 * engine and reports anything that does not match canonical theory.
 *
 * Run with: npx tsx scripts/audit/verify-engine.ts
 *
 * This is an audit tool. It is intentionally NOT wired into the test suite so
 * it can produce human-readable output and flag "soft" issues (warnings in the
 * console, theoretical edge cases, etc.) rather than binary pass/fail.
 */

import {
  SCALE_FORMULAS,
  buildScale,
  getScaleDegreeIntervalLabel,
  getSeventhDegreeName,
} from '../../src/core/constants/scales';
import {
  CHORD_FORMULAS,
  CHORD_LETTER_DISTANCES,
  buildChord,
  getDiatonicTriads,
  getDiatonicSeventhChords,
  getDiatonicTriadsMinor,
  getDiatonicSeventhChordsMinor,
  getDiatonicSeventhChordsHarmonicMinor,
  getDiatonicChordsForScale,
  CHORD_SYMBOLS,
  INTERVAL_LABELS,
  INTERVAL_SHORT_LABELS,
} from '../../src/core/constants/chords';
import {
  getPitchClass,
  NATURAL_TO_PITCH_CLASS,
  PITCH_CLASS_SPELLINGS,
} from '../../src/core/constants/notes';
import { noteToString } from '../../src/core/types/music';
import type { Note, NaturalNote, ScaleType, ChordQuality } from '../../src/core/types/music';
import { parseChordSymbol, formatParsedChordName } from '../../src/core/utils/chordParser';
import { parseScaleSymbol } from '../../src/core/utils/scaleParser';
import { validateAnswer } from '../../src/components/learn/exercises/validateExercise';
import {
  CIRCLE_MAJOR,
  CIRCLE_MINOR,
  KEY_SIGNATURES,
} from '../../src/components/theory/circleOfFifthsConstants';

type Finding = { severity: 'critical' | 'serious' | 'minor' | 'info'; tag: string; detail: string };
const findings: Finding[] = [];
let totalChecks = 0;
let failedChecks = 0;

function record(finding: Finding) {
  findings.push(finding);
  if (finding.severity !== 'info') failedChecks++;
}

function section(title: string) {
  console.log(`\n=== ${title} ===`);
}

// ─── 1. SCALE SPELLINGS ─────────────────────────────────────────────────────
section('1. Scale spellings');

const ALL_ROOTS: Note[] = [
  { natural: 'C', accidental: '' },
  { natural: 'C', accidental: '#' }, { natural: 'D', accidental: 'b' },
  { natural: 'D', accidental: '' },
  { natural: 'D', accidental: '#' }, { natural: 'E', accidental: 'b' },
  { natural: 'E', accidental: '' },
  { natural: 'F', accidental: '' },
  { natural: 'F', accidental: '#' }, { natural: 'G', accidental: 'b' },
  { natural: 'G', accidental: '' },
  { natural: 'G', accidental: '#' }, { natural: 'A', accidental: 'b' },
  { natural: 'A', accidental: '' },
  { natural: 'A', accidental: '#' }, { natural: 'B', accidental: 'b' },
  { natural: 'B', accidental: '' },
  // Theoretical
  { natural: 'C', accidental: 'b' },
  { natural: 'F', accidental: 'b' },
  { natural: 'E', accidental: '#' },
  { natural: 'B', accidental: '#' },
];

const SEVEN_NOTE_SCALES: ScaleType[] = [
  'major', 'natural_minor', 'harmonic_minor', 'melodic_minor',
  'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian',
  'altered', 'lydian_dominant', 'phrygian_dominant', 'locrian_natural2',
  'dorian_b2', 'lydian_augmented', 'mixolydian_b6',
  'hungarian_minor', 'hungarian_major', 'double_harmonic', 'persian',
  'neapolitan_minor', 'neapolitan_major',
];

// Every letter used exactly once for 7-note scales.
// Exception (WS6): root/scale combos whose pure spelling would need a TRIPLE
// accidental (e.g. F### in B# lydian augmented) are respelled enharmonically
// by the engine — pitch correctness beats letter purity there. Detect those
// combos from the formula and accept the letter duplicate.
function needsTripleAccidental(root: Note, type: ScaleType): boolean {
  const formula = SCALE_FORMULAS[type];
  const rootPc = getPitchClass(root);
  const naturalPc: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const rootIdx = letters.indexOf(root.natural);
  return formula.some((semitones, i) => {
    const letter = letters[(rootIdx + i) % 7];
    const diff = ((rootPc + semitones) % 12 - naturalPc[letter] + 12) % 12;
    return ![0, 1, 2, 10, 11].includes(diff);
  });
}

for (const root of ALL_ROOTS) {
  for (const type of SEVEN_NOTE_SCALES) {
    totalChecks++;
    const scale = buildScale(root, type);
    const letters = scale.notes.map(n => n.natural);
    const letterSet = new Set(letters);
    if (letters.length !== 7 || letterSet.size !== 7) {
      if (needsTripleAccidental(root, type)) {
        record({
          severity: 'info',
          tag: 'scale-spelling',
          detail: `${noteToString(root)} ${type}: enharmonic respell accepted (pure spelling would need a triple accidental)`,
        });
      } else {
        record({
          severity: 'serious',
          tag: 'scale-spelling',
          detail: `${noteToString(root)} ${type}: letters ${letters.join(',')} (duplicates/missing)`,
        });
      }
    }
  }
}

// Pitch-class correctness: the semitone formula from buildScale must match SCALE_FORMULAS
for (const root of ALL_ROOTS) {
  for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
    totalChecks++;
    const scale = buildScale(root, type);
    const rootPC = getPitchClass(root);
    const formula = SCALE_FORMULAS[type];
    const actual = scale.notes.map(n => getPitchClass(n));
    const expected = formula.map(st => ((rootPC + st) % 12));
    for (let i = 0; i < expected.length; i++) {
      if (actual[i] !== expected[i]) {
        record({
          severity: 'critical',
          tag: 'scale-pitch',
          detail: `${noteToString(root)} ${type}[${i}]: got pc=${actual[i]}, want pc=${expected[i]}`,
        });
      }
    }
  }
}

// Known spot-checks of major key spellings (Wikipedia key signature references)
const MAJOR_SCALE_ANSWERS: Record<string, string[]> = {
  'C':  ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'G':  ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'D':  ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'A':  ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'E':  ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'B':  ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
  'C#': ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
  'F':  ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
  'Cb': ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'],
};
for (const [k, expected] of Object.entries(MAJOR_SCALE_ANSWERS)) {
  totalChecks++;
  const root = parseNote(k);
  const scale = buildScale(root, 'major');
  const got = scale.notes.map(noteToString);
  if (JSON.stringify(got) !== JSON.stringify(expected)) {
    record({
      severity: 'critical',
      tag: 'scale-letters',
      detail: `${k} major: got [${got.join(',')}] want [${expected.join(',')}]`,
    });
  }
}

// Natural minor spot checks
const MINOR_SCALE_ANSWERS: Record<string, string[]> = {
  'A':  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  'E':  ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
  'D':  ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
  'F#': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
  'Bb': ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
  'G#': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'],
  'D#': ['D#', 'E#', 'F#', 'G#', 'A#', 'B', 'C#'],
  'Eb': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'],
};
for (const [k, expected] of Object.entries(MINOR_SCALE_ANSWERS)) {
  totalChecks++;
  const root = parseNote(k);
  const scale = buildScale(root, 'natural_minor');
  const got = scale.notes.map(noteToString);
  if (JSON.stringify(got) !== JSON.stringify(expected)) {
    record({
      severity: 'critical',
      tag: 'minor-scale-letters',
      detail: `${k} natural_minor: got [${got.join(',')}] want [${expected.join(',')}]`,
    });
  }
}

function parseNote(s: string): Note {
  return {
    natural: s[0] as NaturalNote,
    accidental: (s.slice(1) as Note['accidental']) ?? '',
  };
}

// ─── 2. DIATONIC CHORD QUALITIES (standard scales only) ─────────────────────
section('2. Diatonic triad qualities (standard scales)');

const DIATONIC_TRUTH_TRIADS: Record<string, string[]> = {
  major:         ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  natural_minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
  harmonic_minor:['minor', 'diminished', 'augmented', 'minor', 'major', 'major', 'diminished'],
  melodic_minor: ['minor', 'minor', 'augmented', 'major', 'major', 'diminished', 'diminished'],
  dorian:        ['minor', 'minor', 'major', 'major', 'minor', 'diminished', 'major'],
  phrygian:      ['minor', 'major', 'major', 'minor', 'diminished', 'major', 'minor'],
  lydian:        ['major', 'major', 'minor', 'diminished', 'major', 'minor', 'minor'],
  mixolydian:    ['major', 'minor', 'diminished', 'major', 'minor', 'minor', 'major'],
  locrian:       ['diminished', 'major', 'minor', 'minor', 'major', 'major', 'minor'],
};

for (const [scaleType, expected] of Object.entries(DIATONIC_TRUTH_TRIADS)) {
  const root: Note = { natural: 'C', accidental: '' };
  const scale = buildScale(root, scaleType as ScaleType);
  const chords = getDiatonicChordsForScale(scale);
  for (let i = 0; i < expected.length; i++) {
    totalChecks++;
    const got = chords[i]?.chord.quality;
    if (got !== expected[i]) {
      record({
        severity: 'critical',
        tag: 'diatonic-triad',
        detail: `${scaleType} degree ${i + 1}: got ${got}, want ${expected[i]}`,
      });
    }
  }
}

// 7th-chord qualities
const DIATONIC_TRUTH_7TH: Record<string, string[]> = {
  major:         ['major7', 'minor7', 'minor7', 'major7', 'dominant7', 'minor7', 'half_diminished7'],
  natural_minor: ['minor7', 'half_diminished7', 'major7', 'minor7', 'minor7', 'major7', 'dominant7'],
  harmonic_minor:['minor_major7', 'half_diminished7', 'augmented_major7', 'minor7', 'dominant7', 'major7', 'diminished7'],
  melodic_minor: ['minor_major7', 'minor7', 'augmented_major7', 'dominant7', 'dominant7', 'half_diminished7', 'half_diminished7'],
};
// verify through getDiatonicSeventhChords / ...Minor / ...HarmonicMinor explicit functions
const rootC: Note = { natural: 'C', accidental: '' };
const majorSevenths = getDiatonicSeventhChords(rootC);
for (let i = 0; i < 7; i++) {
  totalChecks++;
  if (majorSevenths[i].chord.quality !== DIATONIC_TRUTH_7TH.major[i]) {
    record({ severity: 'critical', tag: 'diatonic-7th', detail: `major 7th degree ${i+1}: got ${majorSevenths[i].chord.quality}` });
  }
}
const minorSevenths = getDiatonicSeventhChordsMinor(rootC);
for (let i = 0; i < 7; i++) {
  totalChecks++;
  if (minorSevenths[i].chord.quality !== DIATONIC_TRUTH_7TH.natural_minor[i]) {
    record({ severity: 'critical', tag: 'diatonic-7th-minor', detail: `natural_minor 7th degree ${i+1}: got ${minorSevenths[i].chord.quality}` });
  }
}
const harmSevenths = getDiatonicSeventhChordsHarmonicMinor(rootC);
for (let i = 0; i < 7; i++) {
  totalChecks++;
  if (harmSevenths[i].chord.quality !== DIATONIC_TRUTH_7TH.harmonic_minor[i]) {
    record({ severity: 'critical', tag: 'diatonic-7th-harmonic', detail: `harmonic_minor 7th degree ${i+1}: got ${harmSevenths[i].chord.quality}` });
  }
}

// ─── 3. INTERVAL LABELS ─────────────────────────────────────────────────────
section('3. Scale-degree interval labels');

// Spot-check the degree-aware table against canonical theory
const LABEL_EXPECTATIONS: Array<[number, number, string, string]> = [
  [0, 0, 'R', 'root'],
  [1, 1, 'b2', 'minor 2nd'],
  [1, 2, '2', 'major 2nd'],
  [1, 3, '#2', 'augmented 2nd'],
  [2, 2, 'bb3', 'doubly-diminished 3rd (rare)'],
  [2, 3, 'b3', 'minor 3rd'],
  [2, 4, '3', 'major 3rd'],
  [3, 4, 'b4', 'diminished 4th'],
  [3, 5, '4', 'perfect 4th'],
  [3, 6, '#4', 'augmented 4th (tritone)'],
  [4, 6, 'b5', 'diminished 5th (tritone)'],
  [4, 7, '5', 'perfect 5th'],
  [4, 8, '#5', 'augmented 5th'],
  [5, 7, 'bb6', 'doubly-diminished 6th (rare)'],
  [5, 8, 'b6', 'minor 6th'],
  [5, 9, '6', 'major 6th'],
  [5, 10, '#6', 'augmented 6th'],
  [6, 9, 'bb7', 'doubly-diminished 7th'],
  [6, 10, 'b7', 'minor 7th'],
  [6, 11, '7', 'major 7th'],
];
for (const [deg, st, expected, label] of LABEL_EXPECTATIONS) {
  totalChecks++;
  const got = getScaleDegreeIntervalLabel(deg, st, 7);
  if (got !== expected) {
    record({
      severity: 'serious',
      tag: 'interval-label',
      detail: `degree ${deg} / ${st} st = ${label}: got '${got}', want '${expected}'`,
    });
  }
}

// Specifically verify the fix note: degree 6 at 8 semitones should be b6, not #5
{
  totalChecks++;
  const got = getScaleDegreeIntervalLabel(5, 8, 7); // 5 is index for submediant
  if (got !== 'b6') {
    record({ severity: 'critical', tag: 'interval-label-submediant', detail: `degree 6 @ 8st: got '${got}', want 'b6'` });
  }
}

// ─── 4. ENHARMONIC EDGE CASES ───────────────────────────────────────────────
section('4. Enharmonic edge cases (G# major, D# major, Cb major, Fb major)');

const EDGE_CASES: Array<{ k: string; scale: ScaleType; expected: string[] | null; note: string }> = [
  { k: 'G#', scale: 'major', expected: ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F##'], note: '8 sharps (theoretical, prefer Ab major)' },
  { k: 'D#', scale: 'major', expected: ['D#', 'E#', 'F##', 'G#', 'A#', 'B#', 'C##'], note: '9 sharps (theoretical, prefer Eb major)' },
  { k: 'A#', scale: 'major', expected: ['A#', 'B#', 'C##', 'D#', 'E#', 'F##', 'G##'], note: '10 sharps (theoretical)' },
  { k: 'Cb', scale: 'major', expected: ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'], note: '7 flats (real key)' },
  { k: 'Fb', scale: 'major', expected: ['Fb', 'Gb', 'Ab', 'Bbb', 'Cb', 'Db', 'Eb'], note: '8 flats (theoretical)' },
  { k: 'E#', scale: 'major', expected: null, note: 'would need triple-sharp (C###) — check how app handles' },
];

for (const ec of EDGE_CASES) {
  totalChecks++;
  const root = parseNote(ec.k);
  const scale = buildScale(root, ec.scale);
  const got = scale.notes.map(noteToString);
  console.log(`  ${ec.k} ${ec.scale}: ${got.join(' ')}  [${ec.note}]`);
  if (ec.expected && JSON.stringify(got) !== JSON.stringify(ec.expected)) {
    record({
      severity: 'serious',
      tag: 'enharmonic-edge',
      detail: `${ec.k} major: got [${got.join(',')}], want [${ec.expected.join(',')}]`,
    });
  }
}

// ─── 5. CHORD PARSER ────────────────────────────────────────────────────────
section('5. Chord parser — tricky inputs');

const CHORD_PARSE_CASES: Array<{ input: string; expectQuality?: ChordQuality; expectNoteCount?: number; expectNull?: boolean; note?: string }> = [
  { input: 'Cmaj7#11', expectQuality: 'major7sharp11', expectNoteCount: 5 },
  // WS14 — three closed taxonomy gaps (were algorithmic / approximate labels):
  { input: 'Cmaj9#11', expectQuality: 'major9sharp11', expectNoteCount: 6, note: 'C E G B D F#' },
  { input: 'C7#11', expectQuality: 'dominant7sharp11', expectNoteCount: 5, note: 'C E G Bb F# (no 9)' },
  { input: 'C7b13', expectQuality: 'dominant7flat13', expectNoteCount: 5, note: 'C E G Bb Ab (no 9)' },
  { input: 'C7alt', expectQuality: 'dominant7alt' },
  { input: 'C7b9#11', expectNoteCount: 6, note: '7b9#11 → algorithmic' },
  { input: 'Cm(maj7)', expectQuality: 'minor_major7' },
  { input: 'G13b9', expectQuality: 'dominant13flat9' },
  { input: 'F#º7', expectQuality: 'diminished7' },
  { input: 'Bbmø7', expectQuality: 'half_diminished7', note: 'Bb half-dim — "Bbm" prefix ambiguous' },
  { input: 'Csus2/E', expectQuality: 'sus2' },
  { input: 'D/F#', expectQuality: 'major', note: 'slash chord' },
  { input: 'Cadd9', expectQuality: 'add9' },
  { input: 'C6/9', expectQuality: 'six_nine' },
  { input: 'Cmaj9', expectQuality: 'major9' },
  { input: 'Δ7', expectNull: true, note: 'no root' },
  { input: 'CΔ7', expectQuality: 'major7' },
  { input: 'CM7', expectQuality: 'major7' },
  { input: 'C-7', expectQuality: 'minor7' },
  { input: 'Cø', expectQuality: 'half_diminished7' },
  { input: 'C+', expectQuality: 'augmented' },
  { input: 'Cmadd9', expectNoteCount: 4, note: 'minor add 9 — via algorithmic' },
  { input: 'Cm11', expectQuality: 'minor11' },
  { input: 'Am7/G', expectQuality: 'minor7', note: 'slash' },
];

for (const tc of CHORD_PARSE_CASES) {
  totalChecks++;
  const parsed = parseChordSymbol(tc.input);
  if (tc.expectNull) {
    if (parsed !== null) {
      record({
        severity: 'minor',
        tag: 'chord-parse',
        detail: `${tc.input}: expected null, got ${parsed?.quality}`,
      });
    }
    continue;
  }
  if (!parsed) {
    record({
      severity: 'serious',
      tag: 'chord-parse',
      detail: `${tc.input}: FAILED to parse (expected quality=${tc.expectQuality ?? '(any)'})`,
    });
    continue;
  }
  if (tc.expectQuality && parsed.quality !== tc.expectQuality && !parsed.algorithmicNotes) {
    record({
      severity: 'serious',
      tag: 'chord-parse-quality',
      detail: `${tc.input}: got quality='${parsed.quality}', want '${tc.expectQuality}'`,
    });
  }
  if (tc.expectNoteCount) {
    const notes = parsed.algorithmicNotes ?? buildChord(parsed.root, parsed.quality).notes;
    if (notes.length !== tc.expectNoteCount) {
      record({
        severity: 'minor',
        tag: 'chord-parse-notes',
        detail: `${tc.input}: got ${notes.length} notes, want ${tc.expectNoteCount} — ${formatParsedChordName(parsed)}`,
      });
    }
  }
}

// ─── 6. SCALE PARSER ────────────────────────────────────────────────────────
section('6. Scale parser — tricky inputs');

const SCALE_PARSE_CASES: Array<{ input: string; expectType: string; expectMode?: boolean; expectNull?: boolean }> = [
  // NOTE: ionian/aeolian resolve to mode-names (MODE_NAMES table takes
  // priority over SCALE_TYPES), so the parser returns 'ionian'/'aeolian'
  // instead of 'major'/'natural_minor'. This is by design — these drive
  // ModeCard vs ScaleBlock display components downstream.
  { input: 'C ionian', expectType: 'ionian', expectMode: true },
  { input: 'D dorian', expectType: 'dorian', expectMode: true },
  { input: 'E aeolian', expectType: 'aeolian', expectMode: true },
  { input: 'C melodic minor', expectType: 'melodic_minor' },
  { input: 'C bebop dominant', expectType: 'bebop_dominant' },
  { input: 'A harmonic major', expectType: '', expectNull: true },  // not in table
  { input: 'C whole tone', expectType: 'whole_tone' },
  { input: 'F# locrian', expectType: 'locrian', expectMode: true },
  { input: 'Bb half diminished', expectType: 'locrian_natural2' },
  { input: 'C altered', expectType: 'altered' },
  { input: 'C diminished', expectType: 'diminished_whole_half' },
  { input: 'C super locrian', expectType: 'altered' },
  { input: 'D spanish', expectType: 'phrygian_dominant' },
  { input: 'Gb major', expectType: 'major' },
];

for (const tc of SCALE_PARSE_CASES) {
  totalChecks++;
  const parsed = parseScaleSymbol(tc.input);
  if (tc.expectNull) {
    if (parsed) {
      record({ severity: 'info', tag: 'scale-parse', detail: `${tc.input}: expected null, got ${parsed.scaleType}` });
    }
    continue;
  }
  if (!parsed) {
    record({ severity: 'serious', tag: 'scale-parse', detail: `${tc.input}: FAILED to parse` });
    continue;
  }
  if (parsed.scaleType !== tc.expectType) {
    record({
      severity: 'serious',
      tag: 'scale-parse-type',
      detail: `${tc.input}: got type='${parsed.scaleType}', want '${tc.expectType}'`,
    });
  }
}

// ─── 7. KEY SIGNATURES ──────────────────────────────────────────────────────
section('7. Key signatures');

// CIRCLE_MAJOR order — clockwise from C: C G D A E B, F# Db Ab Eb Bb F
const EXPECTED_CIRCLE_MAJOR = ['C','G','D','A','E','B','Gb','Db','Ab','Eb','Bb','F'];
// Note: position 6 is the tritone (F#/Gb enharmonic). App chose Gb (flats).
const gotCircleMajor = CIRCLE_MAJOR.map(noteToString);
totalChecks++;
if (JSON.stringify(gotCircleMajor) !== JSON.stringify(EXPECTED_CIRCLE_MAJOR)) {
  record({
    severity: 'serious',
    tag: 'circle-major',
    detail: `CIRCLE_MAJOR: got [${gotCircleMajor.join(',')}], want [${EXPECTED_CIRCLE_MAJOR.join(',')}]`,
  });
}

// Expected CIRCLE_MINOR (parallel to major): A E B F# C# G# Eb Bb F C G D
const EXPECTED_CIRCLE_MINOR = ['A','E','B','F#','C#','G#','Eb','Bb','F','C','G','D'];
const gotCircleMinor = CIRCLE_MINOR.map(noteToString);
totalChecks++;
if (JSON.stringify(gotCircleMinor) !== JSON.stringify(EXPECTED_CIRCLE_MINOR)) {
  record({
    severity: 'serious',
    tag: 'circle-minor',
    detail: `CIRCLE_MINOR: got [${gotCircleMinor.join(',')}], want [${EXPECTED_CIRCLE_MINOR.join(',')}]`,
  });
}

// Check relative-minor relationships: minor[i] should be the relative minor of major[i]
// Relative minor = major root minus m3 (i.e., at major scale degree 6)
for (let i = 0; i < 12; i++) {
  totalChecks++;
  const majorRoot = CIRCLE_MAJOR[i];
  const minorRoot = CIRCLE_MINOR[i];
  const majorScale = buildScale(majorRoot, 'major');
  const expectedMinorPC = getPitchClass(majorScale.notes[5]); // 6th degree
  const gotMinorPC = getPitchClass(minorRoot);
  if (expectedMinorPC !== gotMinorPC) {
    record({
      severity: 'critical',
      tag: 'circle-relative',
      detail: `CIRCLE[${i}]: ${noteToString(majorRoot)} major → relative minor should have pc=${expectedMinorPC} (${noteToString(majorScale.notes[5])}), got ${noteToString(minorRoot)} (pc=${gotMinorPC})`,
    });
  }
}

// Verify KEY_SIGNATURES array lines up with CIRCLE_MAJOR positions
// Position 0 (C) = 0#, 1 (G) = 1#, …, 6 (Gb/F#) = 6♯/6♭, 7 (Db) = 5♭, …, 11 (F) = 1♭
const EXPECTED_KS = ['', '1\u266F', '2\u266F', '3\u266F', '4\u266F', '5\u266F', '6\u266F/6\u266D', '5\u266D', '4\u266D', '3\u266D', '2\u266D', '1\u266D'];
totalChecks++;
if (JSON.stringify(KEY_SIGNATURES) !== JSON.stringify(EXPECTED_KS)) {
  record({
    severity: 'serious',
    tag: 'key-sig-array',
    detail: `KEY_SIGNATURES mismatch`,
  });
}

// ─── 8. EXERCISE VALIDATOR — self-round-trip ────────────────────────────────
section('8. Exercise validator round-trip');

// For each type, construct a config with a known correct answer, and verify validator returns correct=true.
// Also a wrong answer should return correct=false.

// note_id — correct
{
  const cfg = { type: 'note_id' as const, note: 'C', accidental: '#', octave: 4 };
  totalChecks++;
  if (!validateAnswer(cfg, 'C#').correct) {
    record({ severity: 'critical', tag: 'validator-note', detail: 'C# should match C#' });
  }
  totalChecks++;
  if (!validateAnswer(cfg, 'Db').correct) {
    record({ severity: 'minor', tag: 'validator-note-enharmonic', detail: 'Db should match C# (acceptEnharmonic default true) — if intentional strict mode, ignore' });
  }
  totalChecks++;
  if (validateAnswer({ ...cfg, acceptEnharmonic: false }, 'Db').correct) {
    record({ severity: 'serious', tag: 'validator-note-strict', detail: 'Db should not match C# when acceptEnharmonic=false' });
  }
  totalChecks++;
  if (validateAnswer(cfg, 'D').correct) {
    record({ severity: 'critical', tag: 'validator-note-wrong', detail: 'D should not match C#' });
  }
}

// interval_id — correct
{
  const cfg = { type: 'interval_id' as const, root: 'C', rootAccidental: '', rootOctave: 4, targetSemitones: 7, direction: 'ascending' as const };
  totalChecks++;
  if (!validateAnswer(cfg, '7').correct) {
    record({ severity: 'critical', tag: 'validator-interval', detail: 'P5 = 7 should match 7' });
  }
  totalChecks++;
  if (validateAnswer(cfg, '5').correct) {
    record({ severity: 'critical', tag: 'validator-interval-wrong', detail: '5 should not match 7' });
  }
}

// scale_build — correct
{
  const cfg = { type: 'scale_build' as const, root: 'C', rootAccidental: '', scaleType: 'major', noteCount: 7 };
  const correctPCs = new Set([0, 2, 4, 5, 7, 9, 11]);
  totalChecks++;
  if (!validateAnswer(cfg, correctPCs).correct) {
    record({ severity: 'critical', tag: 'validator-scale', detail: 'C major PCs should match' });
  }
  totalChecks++;
  if (validateAnswer(cfg, new Set([0, 2, 3, 5, 7, 8, 10])).correct) {
    record({ severity: 'critical', tag: 'validator-scale-wrong', detail: 'C natural_minor PCs should not match C major config' });
  }
}

// chord_build — correct
{
  const cfg = { type: 'chord_build' as const, root: 'C', rootAccidental: '', quality: 'major7', noteCount: 4 };
  const correctPCs = new Set([0, 4, 7, 11]);
  totalChecks++;
  if (!validateAnswer(cfg, correctPCs).correct) {
    record({ severity: 'critical', tag: 'validator-chord', detail: 'Cmaj7 PCs should match' });
  }
  totalChecks++;
  if (validateAnswer(cfg, new Set([0, 4, 7, 10])).correct) {
    record({ severity: 'critical', tag: 'validator-chord-wrong', detail: 'C7 PCs should not match Cmaj7 config' });
  }
}

// multiple_choice
{
  const cfg = { type: 'multiple_choice' as const, choices: [{ label: 'Right', correct: true }, { label: 'Wrong', correct: false }] };
  totalChecks++;
  if (!validateAnswer(cfg, 'Right').correct) {
    record({ severity: 'critical', tag: 'validator-mc', detail: '"Right" should match' });
  }
  totalChecks++;
  if (validateAnswer(cfg, 'Wrong').correct) {
    record({ severity: 'critical', tag: 'validator-mc-wrong', detail: '"Wrong" should not match' });
  }
}

// scale_degree_id
{
  const cfg = { type: 'scale_degree_id' as const, root: 'C', rootAccidental: '', scaleType: 'major', note: 'G', noteAccidental: '', correctDegree: 5 };
  totalChecks++;
  if (!validateAnswer(cfg, '5').correct) {
    record({ severity: 'critical', tag: 'validator-degree', detail: 'Degree 5 should match' });
  }
}

// ─── 9. CHORD_SYMBOLS / CHORD_FORMULAS consistency ──────────────────────────
section('9. Chord formulas vs letter distances parity');

for (const quality of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
  totalChecks++;
  const formula = CHORD_FORMULAS[quality];
  const distances = CHORD_LETTER_DISTANCES[quality];
  if (!distances) {
    record({ severity: 'critical', tag: 'letter-distances-missing', detail: `${quality}: no CHORD_LETTER_DISTANCES entry` });
    continue;
  }
  if (distances.length !== formula.length) {
    record({
      severity: 'critical',
      tag: 'letter-distances-count',
      detail: `${quality}: formula has ${formula.length} notes but CHORD_LETTER_DISTANCES has ${distances.length}`,
    });
  }
}

// CHORD_SYMBOLS vs CHORD_FORMULAS parity
for (const quality of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
  totalChecks++;
  if (!(quality in CHORD_SYMBOLS)) {
    record({ severity: 'minor', tag: 'chord-symbols-missing', detail: `${quality}: missing CHORD_SYMBOLS entry` });
  }
}

// ─── 10. INTERVAL_LABELS consistency (compound intervals labelled as "Augmented" vs degree-aware) ────
section('10. INTERVAL_LABELS sanity');

// WS6 (CORE-ESCALATION B1): INTERVAL_LABELS[8] is now 'Minor 6th' — the generic
// interval name, matching SEMITONES_TO_INTERVAL[8]. Chord displays preserve the
// augmented-family '#5' spelling via CHORD_CONTEXT_LABELS in chords.ts.
// INTERVAL_LABELS[6]='Tritone' stays by design (quality-neutral name; the
// validator works from semitone counts and cannot distinguish aug4 vs dim5).
console.log(`  INTERVAL_LABELS[8] = '${INTERVAL_LABELS[8]}' (B1 fixed: generic m6; chord context handles #5)`);
console.log(`  INTERVAL_LABELS[6] = '${INTERVAL_LABELS[6]}' (tritone; app can't distinguish aug4 vs dim5)`);
console.log(`  INTERVAL_SHORT_LABELS[8] = '${INTERVAL_SHORT_LABELS[8]}'`);
if (INTERVAL_LABELS[8] !== 'Minor 6th' || INTERVAL_SHORT_LABELS[8] !== 'b6') {
  record({
    severity: 'serious',
    tag: 'interval-label-choice',
    detail: `INTERVAL_LABELS[8]='${INTERVAL_LABELS[8]}'/SHORT='${INTERVAL_SHORT_LABELS[8]}' — B1 regression: expected 'Minor 6th'/'b6'.`,
  });
}

// ─── 11. getSeventhDegreeName sanity ────────────────────────────────────────
section('11. Seventh-degree name (leading vs subtonic)');

const SEVENTH_EXPECTED: Array<[string, string]> = [
  ['major', 'Leading Tone'],
  ['natural_minor', 'Subtonic'],
  ['harmonic_minor', 'Leading Tone'],
  ['melodic_minor', 'Leading Tone'],
  ['dorian', 'Subtonic'],
  ['phrygian', 'Subtonic'],
  ['lydian', 'Leading Tone'],
  ['mixolydian', 'Subtonic'],
  ['locrian', 'Subtonic'],
  ['blues', 'Subtonic'],
  ['altered', 'Subtonic'],
];
for (const [type, expected] of SEVENTH_EXPECTED) {
  totalChecks++;
  const got = getSeventhDegreeName(type);
  if (got !== expected) {
    record({ severity: 'serious', tag: 'seventh-name', detail: `${type}: got '${got}', want '${expected}'` });
  }
}

// ─── REPORT ────────────────────────────────────────────────────────────────
console.log('\n\n============================================================');
console.log(`ENGINE VERIFICATION REPORT`);
console.log(`Total checks:     ${totalChecks}`);
console.log(`Failed checks:    ${failedChecks}`);
console.log(`Findings:         ${findings.length}`);
console.log(`  critical: ${findings.filter(f => f.severity === 'critical').length}`);
console.log(`  serious:  ${findings.filter(f => f.severity === 'serious').length}`);
console.log(`  minor:    ${findings.filter(f => f.severity === 'minor').length}`);
console.log(`  info:     ${findings.filter(f => f.severity === 'info').length}`);
console.log('============================================================\n');

const grouped = findings.reduce<Record<string, Finding[]>>((acc, f) => {
  acc[f.severity] = acc[f.severity] ?? [];
  acc[f.severity].push(f);
  return acc;
}, {});
for (const sev of ['critical', 'serious', 'minor', 'info'] as const) {
  if (!grouped[sev]?.length) continue;
  console.log(`--- ${sev.toUpperCase()} (${grouped[sev].length}) ---`);
  for (const f of grouped[sev]) {
    console.log(`  [${f.tag}] ${f.detail}`);
  }
  console.log();
}

// Silence unused imports
void NATURAL_TO_PITCH_CLASS; void PITCH_CLASS_SPELLINGS;
void getDiatonicTriads; void getDiatonicTriadsMinor;

process.exit(0);
