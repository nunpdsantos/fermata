/**
 * WS14 Part A — the three closed engine taxonomy gaps.
 *
 * Before WS14 these notations parsed to the right NOTES but an approximate
 * QUALITY label (or fell to the algorithmic builder):
 *   - Cmaj9#11 → major11  (wrong: natural 11, no required #11, 3rd omitted)
 *   - C7#11    → dominant9sharp11 (wrong: that quality carries a 9th)
 *   - C7b13    → algorithmic (no named quality at all)
 *
 * They now route to dedicated qualities with first-principles interval sets:
 *   major9sharp11    = R M3 P5 M7 M9 #11  = [0,4,7,11,14,18]
 *   dominant7sharp11 = R M3 P5 m7 #11      = [0,4,7,10,18]      (NO 9th)
 *   dominant7flat13  = R M3 P5 m7 b13      = [0,4,7,10,20]      (NO 9th)
 *
 * Every interval below is verified against INTERVAL_LABELS (octave-extended
 * convention: 9=14, #11=18, b13=20) — the same convention the rest of the
 * engine's 13th-chord formulas use.
 */
import { describe, it, expect } from 'vitest';
import { parseChordSymbol, chordFromParsed, isAlgorithmicChord } from '../chordParser';
import {
  buildChord,
  CHORD_FORMULAS,
  CHORD_LETTER_DISTANCES,
  CHORD_SYMBOLS,
  CHORD_QUALITY_NAMES,
  getChordShortIntervalLabels,
} from '../../constants/chords';
import { getPitchClass } from '../../constants/notes';
import { noteToString, type ChordQuality, type Note } from '../../types/music';

const NEW_QUALITIES = ['major9sharp11', 'dominant7sharp11', 'dominant7flat13'] as const;

// Verified-from-first-principles interval sets (octave-extended semitones).
const EXPECTED_FORMULA: Record<(typeof NEW_QUALITIES)[number], number[]> = {
  major9sharp11: [0, 4, 7, 11, 14, 18],
  dominant7sharp11: [0, 4, 7, 10, 18],
  dominant7flat13: [0, 4, 7, 10, 20],
};

// Canonical C-root spellings (letter rule → correct accidentals).
const EXPECTED_NOTES_ON_C: Record<(typeof NEW_QUALITIES)[number], string[]> = {
  major9sharp11: ['C', 'E', 'G', 'B', 'D', 'F#'],
  dominant7sharp11: ['C', 'E', 'G', 'Bb', 'F#'],
  dominant7flat13: ['C', 'E', 'G', 'Bb', 'Ab'],
};

describe('WS14 Part A — formula correctness', () => {
  it.each(NEW_QUALITIES)('%s formula matches the verified interval set', (q) => {
    expect(CHORD_FORMULAS[q]).toEqual(EXPECTED_FORMULA[q]);
  });

  it.each(NEW_QUALITIES)('%s has letter distances parallel to its formula length', (q) => {
    expect(CHORD_LETTER_DISTANCES[q]).toBeDefined();
    expect(CHORD_LETTER_DISTANCES[q].length).toBe(CHORD_FORMULAS[q].length);
  });

  it('dominant7sharp11 carries NO 9th (distinct from dominant9sharp11)', () => {
    // 9th = 14 st; #11 = 18 st. The no-9 sibling must omit 14.
    expect(CHORD_FORMULAS.dominant7sharp11).not.toContain(14);
    expect(CHORD_FORMULAS.dominant7sharp11).toContain(18);
    expect(CHORD_FORMULAS.dominant9sharp11).toContain(14);
  });

  it('dominant7flat13 carries NO 9th and KEEPS the natural 5th', () => {
    expect(CHORD_FORMULAS.dominant7flat13).not.toContain(14); // no 9
    expect(CHORD_FORMULAS.dominant7flat13).not.toContain(13); // no b9 implied
    expect(CHORD_FORMULAS.dominant7flat13).toContain(7); // natural 5 retained (unlike alt)
    expect(CHORD_FORMULAS.dominant7flat13).toContain(20); // b13
  });

  it('major9sharp11 carries BOTH the major 7th and the 9th plus the #11', () => {
    expect(CHORD_FORMULAS.major9sharp11).toEqual(expect.arrayContaining([11, 14, 18]));
    // distinct from major7sharp11 (no 9) and major11 (3rd omitted, natural 11)
    expect(CHORD_FORMULAS.major7sharp11).not.toContain(14);
    expect(CHORD_FORMULAS.major11).not.toContain(4); // major11 omits the 3rd
  });
});

describe('WS14 Part A — buildChord produces the verified notes', () => {
  it.each(NEW_QUALITIES)('C%s spells correctly', (q) => {
    const chord = buildChord({ natural: 'C', accidental: '' }, q);
    expect(chord.notes.map(noteToString)).toEqual(EXPECTED_NOTES_ON_C[q]);
  });

  // Build on several roots (incl. sharp & flat spellings) and assert the pitch
  // classes equal root + formula. This proves the formula is correct on any root,
  // not just the convenient C spelling.
  const ROOTS: Note[] = [
    { natural: 'C', accidental: '' },
    { natural: 'F', accidental: '#' },
    { natural: 'B', accidental: 'b' },
    { natural: 'E', accidental: 'b' },
    { natural: 'A', accidental: '' },
    { natural: 'G', accidental: '#' },
  ];

  for (const q of NEW_QUALITIES) {
    it.each(ROOTS)(`${q} on $natural$accidental has the right pitch classes`, (root) => {
      const chord = buildChord(root, q);
      const rootPc = getPitchClass(root);
      const gotPcs = chord.notes.map(getPitchClass);
      const wantPcs = EXPECTED_FORMULA[q].map((st) => (rootPc + st) % 12);
      expect(gotPcs).toEqual(wantPcs);
      // Letter names must be unique per chord-tone where the structure is a clean
      // stack (no doubled letters) — guards enharmonic-spelling regressions.
      const letters = chord.notes.map((n) => n.natural);
      expect(new Set(letters).size).toBe(letters.length);
    });
  }

  it.each(NEW_QUALITIES)('%s short interval labels read correctly', (q) => {
    const labels = getChordShortIntervalLabels(q);
    const EXPECTED: Record<string, string[]> = {
      major9sharp11: ['R', '3', '5', '7', '9', '#11'],
      dominant7sharp11: ['R', '3', '5', 'b7', '#11'],
      dominant7flat13: ['R', '3', '5', 'b7', 'b13'],
    };
    expect(labels).toEqual(EXPECTED[q]);
  });
});

describe('WS14 Part A — parser routes notations to the new qualities (no algorithmic fallback)', () => {
  const CASES: Array<[string, (typeof NEW_QUALITIES)[number]]> = [
    ['Cmaj9#11', 'major9sharp11'],
    ['Cmaj9(#11)', 'major9sharp11'],
    ['CM9#11', 'major9sharp11'],
    ['Cmajor9#11', 'major9sharp11'],
    ['Cmaj9♯11', 'major9sharp11'],
    ['C7#11', 'dominant7sharp11'],
    ['C7(#11)', 'dominant7sharp11'],
    ['C7♯11', 'dominant7sharp11'],
    ['Cdom7#11', 'dominant7sharp11'],
    ['Cdominant7#11', 'dominant7sharp11'],
    ['C7b13', 'dominant7flat13'],
    ['C7(b13)', 'dominant7flat13'],
    ['C7♭13', 'dominant7flat13'],
    ['Cdom7b13', 'dominant7flat13'],
    ['Cdominant7b13', 'dominant7flat13'],
  ];

  it.each(CASES)('%s → %s', (input, quality) => {
    const parsed = parseChordSymbol(input);
    expect(parsed, `"${input}" should parse`).not.toBeNull();
    expect(parsed!.quality, `"${input}" quality`).toBe(quality);
    // The whole point: it must NOT route to the algorithmic builder anymore.
    expect(isAlgorithmicChord(parsed!), `"${input}" must use the named quality`).toBe(false);
  });

  it('accidented roots route correctly (F#maj9#11, Bb7#11, Eb7b13)', () => {
    expect(parseChordSymbol('F#maj9#11')!.quality).toBe('major9sharp11');
    expect(parseChordSymbol('Bb7#11')!.quality).toBe('dominant7sharp11');
    expect(parseChordSymbol('Eb7b13')!.quality).toBe('dominant7flat13');
  });
});

describe('WS14 Part A — CHORD_SYMBOLS / CHORD_QUALITY_NAMES round-trip', () => {
  it('canonical symbols are the documented short forms', () => {
    expect(CHORD_SYMBOLS.major9sharp11).toBe('maj9#11');
    expect(CHORD_SYMBOLS.dominant7sharp11).toBe('7#11');
    expect(CHORD_SYMBOLS.dominant7flat13).toBe('7b13');
  });

  it('human names are the documented forms', () => {
    expect(CHORD_QUALITY_NAMES.major9sharp11).toBe('Major 9th Sharp 11');
    expect(CHORD_QUALITY_NAMES.dominant7sharp11).toBe('Dominant 7th Sharp 11');
    expect(CHORD_QUALITY_NAMES.dominant7flat13).toBe('Dominant 7th Flat 13');
  });

  it.each(NEW_QUALITIES)('C + CHORD_SYMBOLS[%s] re-parses to that same quality', (q) => {
    const symbol = CHORD_SYMBOLS[q as ChordQuality];
    const parsed = parseChordSymbol('C' + symbol);
    expect(parsed, `C${symbol} should parse`).not.toBeNull();
    expect(parsed!.quality).toBe(q);
    expect(isAlgorithmicChord(parsed!)).toBe(false);
  });
});

describe('WS14 Part A — siblings are unchanged (regression wall)', () => {
  it('C9#11 still → dominant9sharp11 (with the 9th)', () => {
    const c = chordFromParsed(parseChordSymbol('C9#11')!);
    expect(parseChordSymbol('C9#11')!.quality).toBe('dominant9sharp11');
    expect(c.notes.map(noteToString)).toEqual(['C', 'E', 'G', 'Bb', 'D', 'F#']);
  });

  it('Cmaj7#11 still → major7sharp11 (no 9th)', () => {
    expect(parseChordSymbol('Cmaj7#11')!.quality).toBe('major7sharp11');
  });

  it('Cmaj11 still → major11 (3rd omitted, natural 11)', () => {
    const c = chordFromParsed(parseChordSymbol('Cmaj11')!);
    expect(parseChordSymbol('Cmaj11')!.quality).toBe('major11');
    expect(c.notes.map(noteToString)).toEqual(['C', 'G', 'B', 'D', 'F']);
  });

  it('C7#5 still → augmented7 (labeling choice, identical notes)', () => {
    expect(parseChordSymbol('C7#5')!.quality).toBe('augmented7');
  });
});
