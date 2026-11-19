/**
 * Music audit 2, second review of builder K, item 1: a chord typed in Quick
 * Search (or arriving by a link) never silently loses a tone its name
 * carries. "C9♭13/F" offered one grip, 1 1 0 0 1 0, with no A♭ and no word.
 *
 * The tones each symbol names are written here BY HAND from the symbol's
 * text (alterations, additions, the spelled 9 / 11 / 13, the 6, the sus
 * tones), as semitones above the root — independent of the parser's labels
 * and of the app's own required set. Every suffix the parser reads, on 12
 * roots, with no slash and over two basses outside the chord, at no capo and
 * capo 3: every grip offered sounds each named tone or the board names it
 * ("leaves out …"), and where any grip sounds them all, the first one does.
 */
import { describe, expect, it } from 'vitest';
import { chordShapesForCapo, gripLeavesOut } from '../../../core/constants/guitarChordShapes';
import { chordFromParsed, parseChordSymbol } from '../../../core/utils/chordParser';
import type { Note } from '../../../core/types/music';

const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (n: Note) => (LETTER[n.natural] + [...n.accidental].reduce((a, c) => a + (c === '#' ? 1 : -1), 0) + 24) % 12;
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const OPEN = [40, 45, 50, 55, 59, 64];
/** Suffix → the semitones above the root its name spells out (not the 3rd, 5th or 7th of the base chord). */
const NAMES: Record<string, number[]> = {
  '7b5': [6], '7#5': [8], '7b9': [1], '7#9': [3], '7#11': [6], '7b13': [8], '9b13': [2, 8], '9#11': [2, 6], '13b9': [9, 1],
  '13#11': [9, 6], 'maj7#11': [6], 'maj9#11': [2, 6], 'm7b5': [6], 'm7b9': [1], 'm9b5': [2, 6], '7b9b13': [1, 8], '7#9#11': [3, 6],
  '7#5#9': [8, 3], '7b5b9': [6, 1], '7b9#11': [1, 6], 'add9': [2], 'add11': [5], 'add13': [9], 'madd9': [2], 'm(add11)': [5],
  '6add9': [9, 2], 'm6add9': [9, 2], '7add11': [5], 'add2': [2], 'add4': [5], '+5': [8], '-5': [6], '7+9': [3], '7-9': [1],
  'maj7b5': [6], 'm11b5': [6, 5], '13sus4': [9, 5], '7#9b13': [3, 8], 'maj13#11': [9, 6], 'm13': [9], '9': [2], 'm9': [2],
  'maj9': [2], '11': [5], 'm11': [5], '13': [9], 'maj13': [9], '6': [9], 'm6': [9], 'sus2': [2], 'sus4': [5], '9sus4': [2, 5],
  '7sus4': [5],
};

describe('a typed chord never silently loses a tone its name carries', () => {
  it('every suffix the parser reads × 12 roots × (no slash, two outside basses) × capo 0 and 3', () => {
    const silent: string[] = [];
    const notFirst: string[] = [];
    let requests = 0;
    let grips = 0;
    for (const [suffix, named] of Object.entries(NAMES)) {
      for (const root of ROOTS) {
        const plain = parseChordSymbol(`${root}${suffix}`);
        expect(plain, `${root}${suffix}`).toBeTruthy();
        const tones = new Set(chordFromParsed(plain!).notes.map(pcOf));
        const rootPc = pcOf(chordFromParsed(plain!).root);
        const outside = ROOTS.filter((b) => !tones.has(pcOf({ natural: b[0], accidental: b.slice(1) } as Note))).slice(0, 2);
        for (const bass of ['', ...outside]) {
          const symbol = bass ? `${root}${suffix}/${bass}` : `${root}${suffix}`;
          const chord = chordFromParsed(parseChordSymbol(symbol)!);
          const want = named.map((d) => (rootPc + d) % 12);
          for (const capo of [0, 3]) {
            requests++;
            const { shapes } = chordShapesForCapo(chord, 0, capo);
            let anyWhole = false;
            const whole = shapes.map((e) => {
              grips++;
              const sounding = new Set(e.shape.strings.flatMap((p, s) => (p.fret === null ? [] : [(OPEN[s] + e.baseFret + p.fret) % 12])));
              const missing = want.filter((pc) => !sounding.has(pc));
              const said = new Set(gripLeavesOut(e, chord).map(pcOf));
              if (missing.some((pc) => !said.has(pc))) silent.push(`${symbol} capo ${capo}: ${e.shape.strings.map((p) => (p.fret === null ? 'x' : e.baseFret + p.fret)).join('-')} misses ${missing}`);
              if (missing.length === 0) anyWhole = true;
              return missing.length === 0;
            });
            if (anyWhole && !whole[0]) notFirst.push(`${symbol} capo ${capo}`);
          }
        }
      }
    }
    expect(silent).toEqual([]);
    expect(notFirst).toEqual([]);
    expect(requests).toBe(Object.keys(NAMES).length * 12 * 3 * 2);
    expect(grips).toBeGreaterThan(requests);
  }, 600_000);

  it('C9♭13/F: no grip without its A♭ (the ♭13) goes unsaid; 1 1 0 0 1 0 is not offered', () => {
    const chord = chordFromParsed(parseChordSymbol('C9b13/F')!);
    const list = chordShapesForCapo(chord, 0, 0).shapes.map((e) => e.shape.strings.map((p) => (p.fret === null ? 'x' : e.baseFret + p.fret)).join('-'));
    expect(list).not.toContain('1-1-0-0-1-0');
    expect(list[0]).toBe('1-1-0-1-1-0');
  });
});
