/**
 * Audit W3-11: the fretboard ignored chord inversions and slash-chord bass
 * notes. arrangeShapesForBass() puts a shape whose LOWEST sounding note is the
 * requested bass first — an existing shape when one has it, otherwise a shape
 * extended with the bass on a free lower string — and says honestly when
 * neither is possible. Checked against independent pitch arithmetic.
 */
import { describe, it, expect } from 'vitest';
import { buildChord } from '../chords';
import { getChordShapesWithFallback, arrangeShapesForBass } from '../guitarChordShapes';
import type { ChordShape } from '../guitarChordShapes';
import type { ChordQuality, Note } from '../../types/music';

const OPEN = [4, 9, 2, 7, 11, 4];
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const mod12 = (n: number) => ((n % 12) + 12) % 12;
const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2 };
const pcOfNote = (n: Note) => mod12(LETTER[n.natural] + ACC[n.accidental]);
const toNote = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });

function lowestPc(shape: ChordShape, baseFret: number): number | null {
  for (let i = 0; i < 6; i++) {
    const p = shape.strings[i];
    if (p.fret !== null) return mod12(OPEN[i] + baseFret + p.fret);
  }
  return null;
}
function soundingPcs(shape: ChordShape, baseFret: number): number[] {
  return shape.strings.flatMap((p, i) => (p.fret === null ? [] : [mod12(OPEN[i] + baseFret + p.fret)]));
}
function fingersOk(shape: ChordShape, baseFret: number): boolean {
  const at = new Map<number, number>();
  for (const p of shape.strings) {
    if (p.fret === null || baseFret + p.fret === 0) continue;
    const abs = baseFret + p.fret;
    if (abs > 15 || !p.finger) return false;
    const f = p.finger === 'bar' ? 1 : p.finger;
    if (at.has(f) && at.get(f) !== abs) return false;
    at.set(f, abs);
  }
  return true;
}

describe('inversions: the requested bass is the lowest note of the default shape', () => {
  const COMMON: ChordQuality[] = ['major', 'minor', 'dominant7', 'minor7', 'major7', 'diminished', 'augmented', 'half_diminished7', 'diminished7'];
  it('every inversion of the common triads and sevenths, in all 12 keys', () => {
    const misses: string[] = [];
    let cases = 0;
    for (const q of COMMON) {
      for (const r of ROOTS) {
        const chord = buildChord(toNote(r), q);
        const chordPcs = new Set(chord.notes.map(pcOfNote));
        for (let inv = 1; inv < chord.notes.length; inv++) {
          cases++;
          const bassPc = pcOfNote(chord.notes[inv]);
          const base = getChordShapesWithFallback(chord);
          const { shapes, bassMatched } = arrangeShapesForBass(base, chord, bassPc, 'X');
          if (!bassMatched) {
            // Not respected → the caller is told (and shows a notice); the
            // shapes come back untouched.
            expect(shapes).toEqual(base);
            misses.push(`${q} inv ${inv}`);
            continue;
          }
          const first = shapes[0];
          expect(lowestPc(first.shape, first.baseFret)).toBe(bassPc);
          const sounding = soundingPcs(first.shape, first.baseFret);
          expect(sounding.every((pc) => chordPcs.has(pc))).toBe(true);
          // Still the chord: root and third (or every tone of a triad) present.
          expect(sounding).toContain(pcOfNote(chord.notes[0]));
          expect(sounding).toContain(pcOfNote(chord.notes[1]));
          expect(fingersOk(first.shape, first.baseFret)).toBe(true);
        }
      }
    }
    // 4 triads x 12 keys x 2 inversions + 5 sevenths x 12 keys x 3 inversions.
    expect(cases).toBe(4 * 12 * 2 + 5 * 12 * 3);
    // Every inversion of major, minor, dominant-7 and augmented chords is
    // respected in all 12 keys.
    expect(misses.filter((m) => /^(major|minor|dominant7|augmented) /.test(m))).toEqual([]);
    // Documented limitation (measured 2026-10-30): the shape library has no
    // grip with the third in the bass for most m7, maj7, dim and m7b5 first
    // inversions (and dim7 / m7b5 second inversions) that keeps root, third
    // and seventh. 61 of 276 cases; the fretboard says so with a notice.
    const tally = misses.reduce<Record<string, number>>((acc, m) => ({ ...acc, [m]: (acc[m] ?? 0) + 1 }), {});
    expect(tally).toEqual({
      'minor7 inv 1': 10,
      'major7 inv 1': 8,
      'diminished inv 1': 11,
      'half_diminished7 inv 1': 11,
      'half_diminished7 inv 2': 11,
      'diminished7 inv 2': 10,
    });
  });
});

describe('slash chords: a bass outside the chord', () => {
  it('Dm7/G puts G in the bass with only Dm7 tones above it', () => {
    const chord = { ...buildChord(toNote('D'), 'minor7'), bassNote: toNote('G') };
    const { shapes, bassMatched } = arrangeShapesForBass(getChordShapesWithFallback(chord), chord, 7, 'G');
    expect(bassMatched).toBe(true);
    const first = shapes[0];
    expect(lowestPc(first.shape, first.baseFret)).toBe(7);
    const allowed = new Set([2, 5, 9, 0, 7]);
    expect(soundingPcs(first.shape, first.baseFret).every((pc) => allowed.has(pc))).toBe(true);
    expect(fingersOk(first.shape, first.baseFret)).toBe(true);
  });

  it('C/G (second inversion written as a slash) reads G in the bass', () => {
    const chord = buildChord(toNote('C'), 'major');
    const { shapes, bassMatched } = arrangeShapesForBass(getChordShapesWithFallback(chord), chord, 7, 'G');
    expect(bassMatched).toBe(true);
    expect(lowestPc(shapes[0].shape, shapes[0].baseFret)).toBe(7);
  });

  it('says so when no shape can carry the bass, and leaves the shapes as they were', () => {
    // A shape that already uses the 6th string cannot take a lower bass.
    const full: ChordShape = {
      name: 'full', shortName: 'full', type: 'barre', cagedShape: 'E', rootString: 6, rootFretOffset: 0,
      strings: [{ fret: 0, finger: 'bar' }, { fret: 2, finger: 3 }, { fret: 2, finger: 4 }, { fret: 1, finger: 2 }, { fret: 0, finger: 'bar' }, { fret: 0, finger: 'bar' }],
      barreInfo: { fret: 0, fromString: 6, toString: 1 },
    };
    const input = [{ shape: full, baseFret: 5 }];
    const out = arrangeShapesForBass(input, buildChord(toNote('E'), 'major'), 1, 'C#');
    expect(out.bassMatched).toBe(false);
    expect(out.shapes).toEqual(input);
  });

  it('no requested bass: shapes untouched', () => {
    const am = buildChord(toNote('A'), 'minor');
    const base = getChordShapesWithFallback(am);
    expect(arrangeShapesForBass(base, am, null, '').shapes).toEqual(base);
  });
});
