/**
 * capoOptions — shape + capo fret = the chord that sounds, fret 0 always
 * there, the ranking rule, and open grips read from the shape library.
 */
import { describe, it, expect } from 'vitest';
import { chordFromParsed as fromParsed, type ParsedChord } from '../../chordParser';
import { capoOptions, hasOpenGrip } from '../capo';
import { chordSymbol } from '../symbol';
import type { CapoOption } from '../types';
import { MAJOR_KEYS, chord, chords, key, oracleScaleNote, pcOf, text } from './fixtures';

const pcsOf = (notes: { natural: string; accidental: string }[]) => notes.map((n) => pcOf(`${n.natural}${n.accidental}`));

function orderedByRule(options: readonly CapoOption[]): boolean {
  for (let i = 0; i + 1 < options.length; i++) {
    const a = options[i];
    const b = options[i + 1];
    const key = (o: CapoOption) => [o.allOpen ? 0 : 1, -o.openCount, o.fret];
    const [x, y] = [key(a), key(b)];
    const cmp = x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
    if (cmp > 0) return false;
  }
  return true;
}

describe('capoOptions', () => {
  // I–IV–V and I–V–vi–IV, typed from the oracle's spelling, in every major key.
  const cases = MAJOR_KEYS.flatMap((r) => [
    [r, [1, 4, 5].map((n) => oracleScaleNote(r, 'major', n)).join(' ')],
    [r, [[1, ''], [5, ''], [6, 'm'], [4, '']].map(([n, s]) => oracleScaleNote(r, 'major', n as number) + s).join(' ')],
  ]);
  it.each(cases)('%s: %s', (root, input) => {
    const typed = chords(input);
    const options = capoOptions(typed, key(root, 'major'));
    expect(options.map((o) => o.fret).sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(orderedByRule(options)).toBe(true);
    for (const o of options) {
      expect(o.shapes).toHaveLength(typed.length);
      o.shapes.forEach((s, i) => {
        // The shape, raised by the capo, sounds the chord as typed.
        const sounding = typed[i];
        const expected = pcsOf(chordFromParsedNotes(sounding));
        expect([o.fret, i, pcsOf(s.shape.notes).map((p) => (p + o.fret) % 12)]).toEqual([o.fret, i, expected]);
        expect(s.shape.quality).toBe(sounding.quality);
        expect(s.open).toBe(hasOpenGrip(s.shape));
      });
      expect(o.allOpen).toBe(o.openCount === o.distinctCount);
    }
    const none = options.find((o) => o.fret === 0)!;
    expect(none.shapes.map((s) => chordSymbol(s.shape))).toEqual(input.split(' '));
  });

  it('E♭ and B♭ major I–IV–V get a capo option of open shapes only', () => {
    const eb = capoOptions(chords('Eb Ab Bb'), key('Eb', 'major'));
    expect(eb[0]).toMatchObject({ fret: 1, allOpen: true });
    expect(eb[0].shapes.map((s) => chordSymbol(s.shape))).toEqual(['D', 'G', 'A']);
    expect(text(eb[0].shapeKey.root)).toBe('D');
    expect(eb.find((o) => o.fret === 0)).toMatchObject({ allOpen: false, openCount: 0 });

    const bb = capoOptions(chords('Bb Eb F'), key('Bb', 'major'));
    expect(bb[0]).toMatchObject({ fret: 1, allOpen: true });
    expect(bb[0].shapes.map((s) => chordSymbol(s.shape))).toEqual(['A', 'D', 'E']);
    expect(bb[1]).toMatchObject({ fret: 3, allOpen: true });
    expect(bb[1].shapes.map((s) => chordSymbol(s.shape))).toEqual(['G', 'C', 'D']);
  });

  it('an all-open progression without a capo ranks fret 0 first', () => {
    const g = capoOptions(chords('G D Em C'), key('G', 'major'));
    expect(g[0]).toMatchObject({ fret: 0, allOpen: true, openCount: 4, distinctCount: 4 });
  });

  it('maxFret limits the list; fret 0 stays', () => {
    const o = capoOptions(chords('Eb Ab Bb'), key('Eb', 'major'), { maxFret: 3 });
    expect(o.map((x) => x.fret).sort()).toEqual([0, 1, 2, 3]);
    expect(capoOptions(chords('C'), key('C', 'major'), { maxFret: 0 }).map((x) => x.fret)).toEqual([0]);
  });

  it('shapes come in the key moved DOWN the capo fret', () => {
    const o = capoOptions(chords('A'), key('A', 'major'));
    const two = o.find((x) => x.fret === 2)!;
    expect(chordSymbol(two.shapes[0].shape)).toBe('G');
    expect(text(two.shapeKey.root)).toBe('G');
  });
});

describe('hasOpenGrip (from the shape library)', () => {
  it.each([
    ['C', true], ['G', true], ['D', true], ['A', true], ['E', true], ['Am', true], ['Em', true], ['Dm', true],
    ['G7', true], ['E7', true], ['Cmaj7', true], ['Dsus4', true],
    ['F', false], ['Bb', false], ['Bm', false], ['F#m', false], ['Eb', false], ['Cm', false],
    ['G/B', true],
  ])('%s → %s', (symbol, open) => {
    expect(hasOpenGrip(chordFromParsed(symbol))).toBe(open);
  });
});

function chordFromParsed(symbol: string) {
  return fromParsed(chord(symbol));
}
function chordFromParsedNotes(p: ParsedChord) {
  return fromParsed(p).notes;
}
