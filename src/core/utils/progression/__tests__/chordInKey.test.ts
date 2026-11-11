/**
 * chordInKey — the number of a chord in a key and how it fits.
 * Expected numerals are textbook tables written out by hand; chord roots are
 * spelled by the independent oracle and typed through the parser.
 */
import { describe, it, expect } from 'vitest';
import type { ScaleType } from '../../../types/music';
import { buildScale } from '../../../constants/scales';
import { getDiatonicChordsForScale } from '../../../constants/chords';
import { chordInKey } from '../chordInKey';
import { ALL_21, MAJOR_KEYS, MINOR_KEYS, chord, key, note, oracleScaleNote, pcOf, text } from './fixtures';

// Textbook tables: [numeral, symbol suffix] per degree 1–7.
const MAJOR_TRIADS = [['I', ''], ['ii', 'm'], ['iii', 'm'], ['IV', ''], ['V', ''], ['vi', 'm'], ['vii°', 'dim']];
const MAJOR_SEVENTHS = [['Imaj7', 'maj7'], ['ii7', 'm7'], ['iii7', 'm7'], ['IVmaj7', 'maj7'], ['V7', '7'], ['vi7', 'm7'], ['viiø7', 'm7b5']];
const MINOR_TRIADS = [['i', 'm'], ['ii°', 'dim'], ['III', ''], ['iv', 'm'], ['v', 'm'], ['VI', ''], ['VII', '']];
const MINOR_SEVENTHS = [['i7', 'm7'], ['iiø7', 'm7b5'], ['IIImaj7', 'maj7'], ['iv7', 'm7'], ['v7', 'm7'], ['VImaj7', 'maj7'], ['VII7', '7']];

describe('chordInKey: diatonic chords get the textbook numeral and fit the key', () => {
  const cases: [string, 'major' | 'minor', string[][], string][] = [
    ...MAJOR_KEYS.flatMap((r) => [[r, 'major', MAJOR_TRIADS, 'triads'], [r, 'major', MAJOR_SEVENTHS, 'sevenths']] as [string, 'major', string[][], string][]),
    ...MINOR_KEYS.flatMap((r) => [[r, 'minor', MINOR_TRIADS, 'triads'], [r, 'minor', MINOR_SEVENTHS, 'sevenths']] as [string, 'minor', string[][], string][]),
  ];
  it.each(cases)('%s %s %s', (root, mode, table) => {
    const k = key(root, mode);
    table.forEach(([numeral, suffix], i) => {
      const symbol = oracleScaleNote(root, mode, i + 1) + suffix;
      const r = chordInKey(chord(symbol), k);
      expect({ symbol, numeral: r.numeral, fits: r.fits, outside: r.outsideNotes.length, respelled: r.respelled })
        .toEqual({ symbol, numeral, fits: 'key', outside: 0, respelled: false });
      expect(r.degree).toEqual({ number: i + 1, alteration: 0 });
    });
  });
});

describe('chordInKey: plain triads agree with getDiatonicChordsForScale in every key', () => {
  const roots = ALL_21;
  it.each(roots.flatMap((r) => [[r, 'major'], [r, 'minor']] as [string, 'major' | 'minor'][]))('%s %s', (root, mode) => {
    const type: ScaleType = mode === 'major' ? 'major' : 'natural_minor';
    const diatonic = getDiatonicChordsForScale(buildScale(note(root), type));
    expect(diatonic).toHaveLength(7);
    for (const d of diatonic) {
      expect(chordInKey(d.chord, key(root, mode)).numeral).toBe(d.numeral);
    }
  });
});

describe('chordInKey: the major V and V7 of a minor key fit harmonic minor', () => {
  it.each(MINOR_KEYS)('%s minor', (root) => {
    const five = oracleScaleNote(root, 'minor', 5);
    const raised7 = oracleScaleNote(root, 'minor', 7, 1);
    for (const [suffix, numeral] of [['', 'V'], ['7', 'V7']]) {
      const r = chordInKey(chord(five + suffix), key(root, 'minor'));
      expect(r.numeral).toBe(numeral);
      expect(r.fits).toBe('harmonicMinor');
      expect(r.outsideNotes.map(text)).toEqual([raised7]);
    }
    // The minor v is the key's own; other chords with the raised 7th are outside.
    expect(chordInKey(chord(`${five}m`), key(root, 'minor')).fits).toBe('key');
    expect(chordInKey(chord(`${five}maj7`), key(root, 'minor')).fits).toBe('outside');
    expect(chordInKey(chord(`${raised7}dim`), key(root, 'minor')).fits).toBe('outside');
  });

  it('only in a minor key: E7 in A major is V7 and fits the key; in C major it is outside', () => {
    expect(chordInKey(chord('E7'), key('A', 'major')).fits).toBe('key');
    expect(chordInKey(chord('E7'), key('C', 'major'))).toMatchObject({ numeral: 'III7', fits: 'outside' });
  });
});

describe('chordInKey: chords from outside the key', () => {
  // C major, written out: [symbol, numeral, outside notes as spelled].
  const C_MAJOR: [string, string, string[]][] = [
    ['Bb', '♭VII', ['Bb']],
    ['Eb', '♭III', ['Eb', 'Bb']],
    ['Ab', '♭VI', ['Ab', 'Eb']],
    ['D', 'II', ['F#']],
    ['E', 'III', ['G#']],
    ['Fm', 'iv', ['Ab']],
    ['D7', 'II7', ['F#']],
    ['Bbmaj7', '♭VIImaj7', ['Bb']],
    ['F#dim', '♯iv°', ['F#']],
    ['C7', 'I7', ['Bb']],
  ];
  it.each(C_MAJOR)('C major: %s = %s', (symbol, numeral, outside) => {
    const r = chordInKey(chord(symbol), key('C', 'major'));
    expect(r.numeral).toBe(numeral);
    expect(r.fits).toBe('outside');
    expect(r.outsideNotes.map(text)).toEqual(outside);
  });

  // The same six borrowings in every major key: degree, alteration, quality.
  const BORROWED: [number, number, string, string][] = [
    [7, -1, '', '♭VII'],
    [3, -1, '', '♭III'],
    [6, -1, '', '♭VI'],
    [2, 0, '', 'II'],
    [3, 0, '', 'III'],
    [4, 0, 'm', 'iv'],
  ];
  it.each(MAJOR_KEYS)('every major key: ♭VII ♭III ♭VI II III iv are outside (%s)', (root) => {
    for (const [n, alt, suffix, numeral] of BORROWED) {
      const r = chordInKey(chord(oracleScaleNote(root, 'major', n, alt) + suffix), key(root, 'major'));
      expect([numeral, r.numeral, r.fits]).toEqual([numeral, numeral, 'outside']);
    }
  });

  const A_MINOR: [string, string, string, string[]][] = [
    ['D', 'IV', 'outside', ['F#']],
    ['Bb', '♭II', 'outside', ['Bb']],
    ['A', 'I', 'outside', ['C#']],
    ['G#dim', '♯vii°', 'outside', ['G#']],
    ['C', 'III', 'key', []],
    ['F', 'VI', 'key', []],
    ['G', 'VII', 'key', []],
    ['Bdim', 'ii°', 'key', []],
  ];
  it.each(A_MINOR)('A minor: %s = %s (%s)', (symbol, numeral, fits, outside) => {
    const r = chordInKey(chord(symbol), key('A', 'minor'));
    expect([r.numeral, r.fits, r.outsideNotes.map(text)]).toEqual([numeral, fits, outside]);
  });

  it('G7 in G major is outside (F); G7 in C major fits', () => {
    const inG = chordInKey(chord('G7'), key('G', 'major'));
    expect([inG.numeral, inG.fits, inG.outsideNotes.map(text)]).toEqual(['I7', 'outside', ['F']]);
    const inC = chordInKey(chord('G7'), key('C', 'major'));
    expect([inC.numeral, inC.fits]).toEqual(['V7', 'key']);
  });

  it('the root spelling decides the prefix: in G major F is ♭VII, C♯ is ♯IV, D♭ is ♭V', () => {
    const g = key('G', 'major');
    expect(chordInKey(chord('F'), g).numeral).toBe('♭VII');
    expect(chordInKey(chord('C#'), g).numeral).toBe('♯IV');
    expect(chordInKey(chord('Db'), g).numeral).toBe('♭V');
    expect(chordInKey(chord('C#m7b5'), g).numeral).toBe('♯ivø7');
  });
});

describe('chordInKey: suffixes, slash chords, every root spelling', () => {
  it.each([
    ['D7', 'V7'], ['Am7', 'ii7'], ['Gmaj7', 'Imaj7'], ['Dsus4', 'Vsus4'], ['F#dim', 'vii°'], ['F#m7b5', 'viiø7'],
    ['F#dim7', 'vii°7'], ['Daug', 'V+'], ['G6', 'I6'], ['Em9', 'vi9'], ['D9', 'V9'], ['Gadd9', 'Iadd9'],
    ['D7sus4', 'V7sus4'], ['G5', 'I5'], ['Am(maj7)', 'iimaj7'], ['D7b9', 'V7♭9'], ['D13', 'V13'], ['C6/9', 'IV6/9'],
  ])('G major: %s = %s', (symbol, numeral) => {
    expect(chordInKey(chord(symbol), key('G', 'major')).numeral).toBe(numeral);
  });

  it('algorithmic chords keep their own suffix and the case of their third', () => {
    const r = chordInKey(chord('Am(add9)'), key('G', 'major'));
    expect(r.chord.algorithmicDisplayName).toBeTruthy();
    expect(r.numeral).toBe('ii(add9)');
    expect(r.family).toBe('minor');
  });

  it('a slash bass does not change the numeral; the result says what it is', () => {
    const g = key('G', 'major');
    const inversion = chordInKey(chord('D/F#'), g);
    expect(inversion.numeral).toBe('V');
    expect(inversion.fits).toBe('key');
    expect(inversion.bass).toEqual({ note: note('F#'), degreeInKey: { number: 7, alteration: 0 }, chordTone: true });

    const other = chordInKey(chord('C/D'), g);
    expect(other.numeral).toBe('IV');
    expect(other.bass).toEqual({ note: note('D'), degreeInKey: { number: 5, alteration: 0 }, chordTone: false });

    // A bass from outside the key makes the chord outside, numeral unchanged.
    const outside = chordInKey(chord('C/Bb'), g);
    expect([outside.numeral, outside.fits, outside.outsideNotes.map(text)]).toEqual(['IV', 'outside', ['Bb']]);
    expect(chordInKey(chord('G'), g).bass).toBeNull();
  });

  // Every one of the 21 root spellings, in C major: numeral, fit, respelled.
  const C_TABLE: Record<string, [string, 'key' | 'outside', boolean]> = {
    C: ['I', 'key', false], 'C#': ['♯I', 'outside', false], Cb: ['VII', 'outside', true],
    D: ['II', 'outside', false], 'D#': ['♯II', 'outside', false], Db: ['♭II', 'outside', false],
    E: ['III', 'outside', false], 'E#': ['IV', 'key', true], Eb: ['♭III', 'outside', false],
    F: ['IV', 'key', false], 'F#': ['♯IV', 'outside', false], Fb: ['III', 'outside', true],
    G: ['V', 'key', false], 'G#': ['♯V', 'outside', false], Gb: ['♭V', 'outside', false],
    A: ['VI', 'outside', false], 'A#': ['♯VI', 'outside', false], Ab: ['♭VI', 'outside', false],
    B: ['VII', 'outside', false], 'B#': ['I', 'key', true], Bb: ['♭VII', 'outside', false],
  };
  it.each(ALL_21)('C major: the root %s is accepted and read', (root) => {
    const r = chordInKey(chord(root), key('C', 'major'));
    expect([r.numeral, r.fits, r.respelled]).toEqual(C_TABLE[root]);
    // A respelled chord sounds the same notes.
    const typed = chordInKey(chord(root), key('F#', 'major')).chord;
    expect(r.chord.notes.map((n) => pcOf(text(n)))).toEqual(typed.notes.map((n) => pcOf(text(n))));
  });

  it('a root typed as an enharmonic of a key note is read as that note (C♯ in D♭ major = I)', () => {
    const r = chordInKey(chord('C#7'), key('Db', 'major'));
    expect(r.respelled).toBe(true);
    expect(r.numeral).toBe('I7');
    expect(r.chord.notes.map(text)).toEqual(['Db', 'F', 'Ab', 'Cb']);
    expect(r.fits).toBe('outside');
    expect(r.outsideNotes.map(text)).toEqual(['Cb']);
  });
});
