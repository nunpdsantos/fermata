/**
 * The coordinator's refinement of the board's order (19 November 2026, after
 * the review fix pass at aef144d): for a request with an asked bass, a bass
 * outside the chord sounds once (D/C x 3 0 2 3 2, not x 3 0 2 1 2, D7/C to
 * the ear), and — after the string count — a first-position grip comes first
 * (an open string, every stopped fret at 4 or below: G/D x x 0 0 0 3, not
 * x 5 5 4 3 3; A/C♯ x 4 2 2 2 0, not x 4 2 2 2 5; A7/C♯ x 4 2 2 2 3, not
 * x 4 5 0 5 5). Root position is exactly
 * as it was at aef144d (fixtures/grip-root-aef144d.json, recorded from that
 * commit's own code by _review/scripts/rootfix.mjs).
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildChord, CHORD_FORMULAS } from '../chords';
import { chordShapesForCapo } from '../guitarChordShapes';
import type { ChordQuality, Note } from '../../types/music';
import recorded from './fixtures/grip-root-aef144d.json';

const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
const R12 = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
type Placed = { shape: { strings: { fret: number | null; finger?: unknown }[] }; baseFret: number };
const frets = (e: Placed) => e.shape.strings.map((p) => (p.fret === null ? 'x' : e.baseFret + p.fret)).join('-');
const grip = (e: Placed | undefined) => (e ? `${frets(e)}|${e.shape.strings.map((p) => (p.fret === null ? 'x' : String(p.finger))).join(' ')}` : '(none)');

describe('the first grip of 24 common slash chords', () => {
  // 21 the coordinator counts right at aef144d, unmoved; and the three the
  // two rules move: G/D, A/C♯, D/C.
  const FIRST: [string, ChordQuality, string, string][] = [
    ['D', 'major', 'F#', '2-0-0-2-3-2'], ['G', 'major', 'B', 'x-2-0-0-0-3'], ['C', 'major', 'E', '0-3-2-0-1-0'],
    ['C', 'major', 'G', '3-3-2-0-1-0'], ['G', 'major', 'F#', '2-2-0-0-0-3'], ['A', 'major', 'E', '0-0-2-2-2-0'],
    ['A', 'minor', 'C', 'x-3-2-2-1-0'], ['A', 'minor', 'E', '0-0-2-2-1-0'], ['A', 'minor', 'G', '3-0-2-2-1-0'],
    ['E', 'minor', 'G', '3-2-2-0-0-0'], ['E', 'minor', 'B', 'x-2-2-0-0-0'], ['D', 'minor', 'F', '1-0-0-2-3-1'],
    ['D', 'minor', 'A', 'x-0-0-2-3-1'], ['F', 'major', 'A', 'x-0-3-2-1-1'], ['F', 'major', 'C', 'x-3-3-2-1-1'],
    ['E', 'major', 'G#', '4-2-2-1-0-0'], ['D', 'major', 'A', 'x-0-0-2-3-2'], ['C', 'major', 'Bb', 'x-1-2-0-1-0'],
    ['G', 'dominant7', 'B', 'x-2-0-0-0-1'], ['C', 'dominant7', 'E', '0-3-2-3-1-0'], ['F', 'major7', 'A', 'x-0-3-2-1-0'],
    ['G', 'major', 'D', 'x-x-0-0-0-3'], ['A', 'major', 'C#', 'x-4-2-2-2-0'], ['D', 'major', 'C', 'x-3-0-2-3-2'],
  ];
  it.each(FIRST)('%s %s over %s: %s', (root, quality, bass, want) => {
    const { shapes, bassMatched } = chordShapesForCapo({ ...buildChord(N(root), quality), bassNote: N(bass) }, 0, 0);
    expect(bassMatched).toBe(true);
    expect(frets(shapes[0])).toBe(want);
  });

  it('D/C: the grip that sounds C again (x 3 0 2 1 2) is still offered, after every grip that sounds it once', () => {
    const list = chordShapesForCapo({ ...buildChord(N('D'), 'major'), bassNote: N('C') }, 0, 0).shapes.map(frets);
    const at = list.indexOf('x-3-0-2-1-2');
    expect(at).toBeGreaterThan(0);
    expect(list.slice(at)).toEqual(['x-3-0-2-1-2']);
  });

  it('through the parser too (Quick Search, a share link): D/C, whose C the parser puts among its notes, still opens on x 3 0 2 3 2', async () => {
    const { chordFromParsed, parseChordSymbol } = await import('../../utils/chordParser');
    for (const [symbol, want] of [['D/C', 'x-3-0-2-3-2'], ['G/D', 'x-x-0-0-0-3'], ['A/C#', 'x-4-2-2-2-0'], ['C/Bb', 'x-1-2-0-1-0'], ['G/F#', '2-2-0-0-0-3']] as const) {
      const chord = chordFromParsed(parseChordSymbol(symbol)!);
      expect(frets(chordShapesForCapo(chord, 0, 0).shapes[0]), symbol).toBe(want);
    }
  });

  it('A7/C♯: x 4 2 2 2 3, not x 4 5 0 5 5 (one open string up the neck is not first position)', () => {
    const list = chordShapesForCapo({ ...buildChord(N('A'), 'dominant7'), bassNote: N('C#') }, 0, 0).shapes.map(frets);
    expect(list[0]).toBe('x-4-2-2-2-3');
    expect(list).toContain('x-4-5-0-5-5');
  });

  it('a bass that IS a chord tone may be doubled: Dm/F 1 0 0 2 3 1 sounds F twice and stays first', () => {
    const e = chordShapesForCapo({ ...buildChord(N('D'), 'minor'), bassNote: N('F') }, 0, 0).shapes[0];
    expect(frets(e)).toBe('1-0-0-2-3-1');
  });
});

describe('three strings first while a fuller grip is offered: only where every fuller grip doubles an outside bass', () => {
  it('every request with an asked bass, no capo (12 roots × every quality × each inversion and 12 slash basses): 0', () => {
    const thin: string[] = [];
    let requests = 0;
    const sounding = (e: Placed) => e.shape.strings.filter((p) => p.fret !== null).length;
    for (const r of R12) for (const q of Object.keys(CHORD_FORMULAS)) {
      const chord = buildChord(N(r), q as ChordQuality);
      const asks = [...chord.notes.slice(1).map((_, i) => ({ inv: i + 1, bass: null as string | null })), ...R12.map((b) => ({ inv: 0, bass: b }))];
      for (const a of asks) {
        requests++;
        const { shapes } = chordShapesForCapo(a.bass ? { ...chord, bassNote: N(a.bass) } : chord, a.inv, 0);
        if (shapes.length && sounding(shapes[0]) <= 3 && shapes.some((e) => sounding(e) >= 4)) thin.push(`${r} ${q} ${a.bass ? `/${a.bass}` : `inv ${a.inv}`}: ${frets(shapes[0])}`);
      }
    }
    // 39 with first position before the string count (5acd91c), E♭/B♭ x 1 1 0 x x
    // among them; these four remain, and not by the first-position rule: every
    // fuller grip of theirs sounds the outside bass twice (D♭5/F 1 x x 1 2 1,
    // F2 and F4), and "an outside bass sounds once" comes before the string
    // count in the coordinator's order. With it after the string count they
    // would open on those doubled grips instead (measured, not kept).
    expect(thin).toEqual(['Db power /F: 1-x-x-1-2-x', 'Db power /F#: 2-x-x-1-2-x', 'D power /G: 3-x-x-2-3-x', 'Bb power /Db: x-4-3-3-x-x']);
    expect(requests).toBe(12 * Object.keys(CHORD_FORMULAS).length * 12 + 12 * Object.values(CHORD_FORMULAS).reduce((n, f) => n + f.length - 1, 0));
  }, 300_000);
});

describe('root position is exactly as at aef144d', () => {
  it('every root-position first grip, 12 roots × every quality, no capo: frets and fingers', () => {
    const got: Record<string, string> = {};
    for (const r of R12) for (const q of Object.keys(CHORD_FORMULAS)) got[`${r}|${q}`] = grip(chordShapesForCapo(buildChord(N(r), q as ChordQuality), 0, 0).shapes[0]);
    expect(got).toEqual(recorded.capo0);
    expect(Object.keys(got)).toHaveLength(12 * Object.keys(CHORD_FORMULAS).length);
  });

  it('with a capo on 1 to 9 too (the recording holds a hash per capo)', () => {
    for (let capo = 1; capo <= 9; capo++) {
      const lines: string[] = [];
      for (const r of R12) for (const q of Object.keys(CHORD_FORMULAS)) lines.push(`${r}|${q}|${grip(chordShapesForCapo(buildChord(N(r), q as ChordQuality), 0, capo).shapes[0])}`);
      expect(createHash('sha256').update(lines.join('\n')).digest('hex'), `capo ${capo}`).toBe((recorded.hashes as Record<string, string>)[capo]);
    }
  });
});
