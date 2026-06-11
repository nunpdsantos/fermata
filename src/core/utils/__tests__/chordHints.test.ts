import { describe, it, expect } from 'vitest';
import { getChordCompletions, parseVerbalChord } from '../chordHints';
import { formatParsedChordName } from '../chordParser';

describe('getChordCompletions — partial symbol → common chords', () => {
  const symbols = (q: string) => getChordCompletions(q).map((c) => c.symbol);

  it('"Cmaj" surfaces the maj-7 family led by Cmaj7', () => {
    const s = symbols('Cmaj');
    expect(s[0]).toBe('Cmaj7');
    expect(s).toContain('Cmaj9');
    expect(s).toContain('Cmaj13');
    // must NOT leak minor or dominant triads into a maj stem
    expect(s).not.toContain('Cm');
    expect(s).not.toContain('Cm7');
  });

  it('"Cma" (Real Book ma) also completes to the maj family', () => {
    expect(symbols('Cma')[0]).toBe('Cmaj7');
  });

  it('"C7#" surfaces the sharp-alteration dominants', () => {
    const s = symbols('C7#');
    expect(s).toEqual(expect.arrayContaining(['C7#9', 'C7#11', 'C7#5']));
    // a dangling "#" must not produce nonsense like "C7#7"
    expect(s.every((x) => /^C7#(9|11|5)$/.test(x))).toBe(true);
  });

  it('"Cm" completes to the minor family incl. mMaj7, never to "maj" majors', () => {
    const s = symbols('Cm');
    expect(s).toContain('Cm'); // the plain minor triad first-class
    expect(s).toEqual(expect.arrayContaining(['Cm7', 'Cm9', 'Cm6']));
    expect(s).toContain('CmMaj7'); // minor-major IS minor-family
    expect(s).not.toContain('Cmaj7'); // major must not leak into an "m" stem
    expect(s).not.toContain('Cmaj9');
  });

  it('capital "CM" stays in the major family (not minor)', () => {
    const s = symbols('CM');
    expect(s).toContain('Cmaj7');
    expect(s).not.toContain('Cm7');
  });

  it('bare root "F#" offers triad first, then sevenths', () => {
    const s = symbols('F#');
    expect(s[0]).toBe('F#'); // major triad
    expect(s).toEqual(expect.arrayContaining(['F#m', 'F#dim', 'F#maj7']));
  });

  it('respects the cap (default 8)', () => {
    expect(getChordCompletions('C').length).toBeLessThanOrEqual(8);
    expect(getChordCompletions('G7').length).toBeLessThanOrEqual(8);
  });

  it('is deterministic (same input → same order)', () => {
    expect(symbols('Cmaj')).toEqual(symbols('Cmaj'));
  });

  it('returns nothing for non-chord input', () => {
    expect(getChordCompletions('hello')).toEqual([]);
    expect(getChordCompletions('')).toEqual([]);
  });
});

describe('parseVerbalChord — free text → chord', () => {
  const verbal = (q: string) => {
    const r = parseVerbalChord(q);
    return r ? formatParsedChordName(r) : null;
  };

  it('"c sharp minor" → C# Minor', () => {
    expect(verbal('c sharp minor')).toBe('C# Minor');
  });

  it('"c sharp minor seven" → C# Minor 7', () => {
    expect(verbal('c sharp minor seven')).toBe('C# Minor 7');
  });

  it('"d flat major seven" → Db Major 7', () => {
    expect(verbal('d flat major seven')).toBe('Db Major 7');
  });

  it('"g dominant" → G Dominant 7 (jazz convention)', () => {
    expect(verbal('g dominant')).toBe('G Dominant 7');
  });

  it('"b half diminished" → B Half-Diminished 7', () => {
    expect(verbal('b half diminished')).toBe('B Half-Diminished 7');
  });

  it('"f sharp diminished seventh" → F# Diminished 7', () => {
    expect(verbal('f sharp diminished seventh')).toBe('F# Diminished 7');
  });

  it('"c major seven" → C Major 7', () => {
    expect(verbal('c major seven')).toBe('C Major 7');
  });

  it('"e flat minor nine" → Eb Minor 9', () => {
    expect(verbal('e flat minor nine')).toBe('Eb Minor 9');
  });

  it('"c minor major seven" → C Minor-Major 7', () => {
    expect(verbal('c minor major seven')).toBe('C Minor-Major 7');
  });

  it('"bb dominant thirteen" → Bb 13', () => {
    expect(verbal('bb dominant thirteen')).toBe('Bb 13');
  });

  it('bare note word "g" → G Major', () => {
    expect(verbal('g')).toBe('G Major');
  });

  it('rejects prose and unknown quality words', () => {
    expect(parseVerbalChord('hello world')).toBeNull();
    expect(parseVerbalChord('c blah')).toBeNull();
    expect(parseVerbalChord('the quick brown')).toBeNull();
    expect(parseVerbalChord('c sharp wibble')).toBeNull();
    expect(parseVerbalChord('dorian')).toBeNull();
  });
});
