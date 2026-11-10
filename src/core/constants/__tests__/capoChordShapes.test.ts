/**
 * Chord grips with a capo (wave 2, stream C). The central promise, proved for
 * every capo fret 1–9 and all 24 major and minor triads, from first
 * principles (standard tuning's open strings and the frets drawn), not from
 * the capo code:
 *  - every dot of the default grip is at or above the capo;
 *  - the grip sounds exactly the chord's pitch classes;
 *  - it is the nut-closest shape of the chord moved DOWN by the capo, drawn
 *    up by it (the shapes the board has always offered, in its own order).
 */
import { describe, expect, it } from 'vitest';
import { buildChord, getDiatonicTriads, getDiatonicSeventhChords } from '../chords';
import {
  arrangeShapesForBass,
  chordBelowCapo,
  chordShapesForCapo,
  getChordShapes,
  getChordShapesWithFallback,
  isPlayableChordShape,
  sortShapesForDefault,
  type ChordShape,
} from '../guitarChordShapes';
import type { Chord, Note } from '../../types/music';

const OPEN_PCS = [4, 9, 2, 7, 11, 4]; // E A D G B E, 6th → 1st
const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (n: Note) => (PC[n.natural] + (n.accidental === '#' ? 1 : n.accidental === 'b' ? -1 : n.accidental === '##' ? 2 : n.accidental === 'bb' ? -2 : 0) + 12) % 12;
// Plain sharp names: any spelling will do for the oracle, only the pitch matters.
const SHARP: Note[] = (['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const).map((s) => ({ natural: s[0] as Note['natural'], accidental: (s[1] ?? '') as Note['accidental'] }));
const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({ natural, accidental });

type Placed = { shape: ChordShape; baseFret: number };
const absFrets = (e: Placed) => e.shape.strings.map((p) => (p.fret === null ? null : e.baseFret + p.fret));
const sounding = (e: Placed) => new Set(absFrets(e).flatMap((f, s) => (f === null ? [] : [(OPEN_PCS[s] + f) % 12])));
const CAPOS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const TRIADS: Chord[] = SHARP.flatMap((root) => [buildChord(root, 'major'), buildChord(root, 'minor')]);

describe('the central promise: capo 1–9 × the 24 major and minor triads', () => {
  it('the default grip is at or above the capo, sounds exactly the chord, and is the lower chord\'s nut-closest shape drawn up', () => {
    let checked = 0;
    for (const capo of CAPOS) {
      for (const chord of TRIADS) {
        const name = `${chord.root.natural}${chord.root.accidental} ${chord.quality}, capo ${capo}`;
        const got = chordShapesForCapo(chord, 0, capo).shapes[0];
        expect(got, name).toBeDefined();
        // 1. Nothing behind the capo.
        for (const f of absFrets(got)) if (f !== null) expect(f, name).toBeGreaterThanOrEqual(capo);
        // 2. Exactly the chord's pitch classes.
        expect([...sounding(got)].sort(), name).toEqual([...new Set(chord.notes.map(pcOf))].sort());
        // 3. The chord `capo` half steps lower (named here by plain sharps),
        //    its shapes in the board's own order, the first whose top fret
        //    still fits on the 15-fret board once moved up.
        const lower = buildChord(SHARP[(pcOf(chord.root) - capo + 12) % 12], chord.quality);
        const fits = sortShapesForDefault(getChordShapesWithFallback(lower))
          .filter((e) => Math.max(...absFrets(e).map((f) => f ?? 0)) + capo <= 15);
        expect(got.baseFret, name).toBe(fits[0].baseFret + capo);
        expect(got.shape.strings, name).toEqual(fits[0].shape.strings);
        checked++;
      }
    }
    expect(checked).toBe(9 * 24);
  });

  it('B♭ with a capo on 3 offers the open G shape at the capo first', () => {
    const { shapes, shapeChord } = chordShapesForCapo(buildChord(N('B', 'b'), 'major'), 0, 3);
    expect(shapes[0].shape.name).toBe('G Major Open');
    expect(shapes[0].baseFret).toBe(3);
    expect(absFrets(shapes[0])).toEqual([6, 5, 3, 3, 3, 6]);
    expect(shapeChord.root).toEqual(N('G'));
    expect(shapeChord.notes).toEqual([N('G'), N('B'), N('D')]);
  });

  it('every grip offered, for every chord in B♭ major (triads and sevenths), is playable with the capo as the nut', () => {
    for (const { chord } of [...getDiatonicTriads(N('B', 'b')), ...getDiatonicSeventhChords(N('B', 'b'))]) {
      const { shapes } = chordShapesForCapo(chord, 0, 3);
      expect(shapes.length, `${chord.root.natural}${chord.root.accidental} ${chord.quality}`).toBeGreaterThan(0);
      for (const e of shapes) {
        for (const f of absFrets(e)) if (f !== null) expect(f).toBeGreaterThanOrEqual(3);
        expect(isPlayableChordShape(e, 15, 3)).toBe(true);
        for (const pc of sounding(e)) expect(chord.notes.map(pcOf)).toContain(pc);
      }
    }
  });
});

describe('the chord the hand makes (chordBelowCapo): the engine\'s names', () => {
  const name = (c: Chord) => c.notes.map((n) => n.natural + n.accidental).join(' ');
  it.each([
    ['B', 'b', 'major', 3, 'G B D'],
    ['C', '', 'minor', 3, 'A C E'],
    ['F', '#', 'major', 2, 'E G# B'],
    ['B', 'b', 'major', 1, 'A C# E'],
    ['E', 'b', 'major', 1, 'D F# A'],
    ['A', 'b', 'major', 4, 'E G# B'],
    ['C', '#', 'minor', 4, 'A C E'],
    ['F', '', 'major', 1, 'E G# B'],
    ['G', '', 'major', 6, 'Db F Ab'],
  ] as const)('%s%s %s, capo %i → %s', (letter, acc, quality, capo, expected) => {
    const shape = chordBelowCapo(buildChord(N(letter, acc), quality), capo);
    expect(name(shape)).toBe(expected);
  });

  it('keeps the chord\'s spelling pattern and its bass', () => {
    const slash = { ...buildChord(N('B', 'b'), 'major'), bassNote: N('D') };
    expect(chordBelowCapo(slash, 3).bassNote).toEqual(N('B'));
    expect(chordBelowCapo(buildChord(N('D'), 'dominant7'), 2).notes).toEqual([N('C'), N('E'), N('G'), N('B', 'b')]);
    const c = buildChord(N('E'), 'minor');
    expect(chordBelowCapo(c, 0)).toBe(c);
  });
});

describe('the capo is the nut (isPlayableChordShape)', () => {
  const gOpen = getChordShapes(N('G'), 'major').find((e) => e.shape.name === 'G Major Open')!;
  it('the open G shape drawn at fret 3 is playable with a capo on 3, not without one', () => {
    expect(isPlayableChordShape({ shape: gOpen.shape, baseFret: 3 }, 15, 3)).toBe(true);
    expect(isPlayableChordShape({ shape: gOpen.shape, baseFret: 3 })).toBe(false);
  });
  it('nothing behind the capo; a barre lies above it', () => {
    expect(isPlayableChordShape({ shape: gOpen.shape, baseFret: 3 }, 15, 4)).toBe(false);
    const eBarre = getChordShapes(N('G'), 'major').find((e) => e.shape.name === 'E-shape Barre')!;
    expect(isPlayableChordShape({ shape: eBarre.shape, baseFret: 3 }, 15, 3)).toBe(false);
    expect(isPlayableChordShape({ shape: eBarre.shape, baseFret: 6 }, 15, 3)).toBe(true);
  });
});

describe('inversions and the bass with a capo', () => {
  it('B♭/D (first inversion), capo 3: D is the lowest note of the first grip', () => {
    const bb = buildChord(N('B', 'b'), 'major');
    const { shapes, bassMatched } = chordShapesForCapo(bb, 1, 3);
    expect(bassMatched).toBe(true);
    const frets = absFrets(shapes[0]);
    const lowest = frets.findIndex((f) => f !== null);
    expect((OPEN_PCS[lowest] + frets[lowest]!) % 12).toBe(2);
    for (const f of frets) if (f !== null) expect(f).toBeGreaterThanOrEqual(3);
  });
});

describe('no capo: exactly the pipeline the board always used', () => {
  it('all 24 triads, root position and both inversions', () => {
    for (const chord of TRIADS) {
      for (const inversion of [0, 1, 2]) {
        const bass = inversion > 0 ? chord.notes[inversion % chord.notes.length] : null;
        const expected = arrangeShapesForBass(
          sortShapesForDefault(getChordShapesWithFallback(chord)),
          chord,
          bass ? pcOf(bass) : null,
          bass ? `${bass.natural}${bass.accidental}` : '',
        );
        const got = chordShapesForCapo(chord, inversion, 0);
        expect(got.shapes).toEqual(expected.shapes);
        expect(got.bassMatched).toBe(expected.bassMatched);
        expect(got.shapeChord).toBe(chord);
      }
    }
  });
});
