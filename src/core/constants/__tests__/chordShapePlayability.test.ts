/**
 * Chord diagrams must be playable and correct (audit W3-09, W3-10).
 *
 * Every shape the fretboard can show — getChordShapesWithFallback() for every
 * chord quality x 12 roots — is checked against an INDEPENDENT chord-tone
 * oracle (semitone sets written out here, ported from the audit's
 * chord_shapes_audit.ts) and independent physical rules:
 *   - one finger presses one fret (several strings at that fret is fine; a
 *     barre counts as the index finger),
 *   - a barre never lies across a string that rings open, nor across a string
 *     fretted below it, and both of its ends sit on the barre fret,
 *   - nothing is beyond the 15 frets the board draws.
 * The hand-made library is held to the same standard at every root it is
 * placed on, so no hand shape is silently filtered at runtime any more.
 */
import { describe, it, expect } from 'vitest';
import { buildChord, CHORD_FORMULAS } from '../chords';
import { getChordShapesWithFallback, getChordShapes, CHORD_SHAPE_LIBRARY } from '../guitarChordShapes';
import type { ChordShape } from '../guitarChordShapes';
import type { ChordQuality, Note } from '../../types/music';

const OPEN = [4, 9, 2, 7, 11, 4]; // E A D G B E, 6th → 1st
const MAX_FRET = 15;
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const mod12 = (n: number) => ((n % 12) + 12) % 12;
const pcOf = (s: string) => mod12(LETTER[s[0]] + (s.slice(1) === '#' ? 1 : s.slice(1) === 'b' ? -1 : 0));
const toNote = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });

/** Chord-symbol definitions (semitones), independent of the engine. */
const ORACLE_CHORD: Record<string, number[]> = {
  major: [0, 4, 7], minor: [0, 3, 7], diminished: [0, 3, 6], augmented: [0, 4, 8],
  major6: [0, 4, 7, 9], minor6: [0, 3, 7, 9], major7: [0, 4, 7, 11], minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10], diminished7: [0, 3, 6, 9], half_diminished7: [0, 3, 6, 10],
  augmented7: [0, 4, 8, 10], sus2: [0, 2, 7], sus4: [0, 5, 7], add9: [0, 2, 4, 7],
  minor_major7: [0, 3, 7, 11], power: [0, 7], dominant7sus4: [0, 5, 7, 10],
  major9: [0, 2, 4, 7, 11], minor9: [0, 2, 3, 7, 10], dominant9: [0, 2, 4, 7, 10],
  dominant7flat9: [0, 1, 4, 7, 10], dominant7sharp9: [0, 3, 4, 7, 10], dominant7flat5: [0, 4, 6, 10],
  dominant7sharp5: [0, 4, 8, 10], dominant7alt: [0, 1, 3, 4, 6, 8, 10],
  dominant11: [0, 2, 4, 5, 7, 10], major11: [0, 2, 4, 5, 7, 11], minor11: [0, 2, 3, 5, 7, 10],
  dominant9sharp11: [0, 2, 4, 6, 7, 10], dominant7sharp11: [0, 4, 6, 7, 10], major9sharp11: [0, 2, 4, 6, 7, 11],
  dominant13: [0, 2, 4, 5, 7, 9, 10], major13: [0, 2, 4, 5, 7, 9, 11], minor13: [0, 2, 3, 5, 7, 9, 10],
  dominant13flat9: [0, 1, 4, 7, 9, 10], dominant7flat13: [0, 4, 7, 8, 10], add11: [0, 4, 5, 7],
  six_nine: [0, 2, 4, 7, 9], minor_six_nine: [0, 2, 3, 7, 9], dominant9sus4: [0, 2, 5, 7, 10],
  sus2sus4: [0, 2, 5, 7], augmented_major7: [0, 4, 8, 11], major7flat5: [0, 4, 6, 11],
  major7sharp11: [0, 4, 6, 7, 11], diminished_major7: [0, 3, 6, 11],
  dominant7sharp5flat9: [0, 1, 4, 8, 10], dominant7flat5flat9: [0, 1, 4, 6, 10],
  dominant7sharp5sharp9: [0, 3, 4, 8, 10], dominant7flat5sharp9: [0, 3, 4, 6, 10],
};
/** Library keys that differ from the ChordQuality name. */
const LIBRARY_QUALITY: Record<string, string> = { halfDiminished: 'half_diminished7', sixth: 'major6' };

/** Physical problems of a placed shape (empty = playable). */
function physicalProblems(shape: ChordShape, baseFret: number): string[] {
  const out: string[] = [];
  const fingerFret = new Map<number, number>();
  shape.strings.forEach((p, i) => {
    if (p.fret === null) return;
    const abs = baseFret + p.fret;
    if (abs < 0 || abs > MAX_FRET) out.push(`s${6 - i} at fret ${abs} is off the board`);
    if (abs === 0) return;
    if (p.finger === undefined || p.finger === 0) { out.push(`s${6 - i} fret ${abs} has no finger`); return; }
    const f = p.finger === 'bar' ? 1 : p.finger;
    const prev = fingerFret.get(f);
    if (prev !== undefined && prev !== abs) out.push(`finger ${f} on frets ${prev} and ${abs}`);
    fingerFret.set(f, abs);
  });
  if (shape.barreInfo) {
    const bf = baseFret + shape.barreInfo.fret;
    const a = 6 - shape.barreInfo.fromString;
    const b = 6 - shape.barreInfo.toString;
    if (bf < 1) out.push(`barre at fret ${bf}`);
    for (let s = Math.min(a, b); s <= Math.max(a, b); s++) {
      const p = shape.strings[s];
      if (p.fret === null) continue;
      const abs = baseFret + p.fret;
      if (abs === 0) out.push(`barre across open s${6 - s}`);
      else if (abs < bf) out.push(`s${6 - s} fretted below the barre`);
    }
    for (const end of [a, b]) {
      const p = shape.strings[end];
      if (p.fret === null || baseFret + p.fret !== bf) out.push(`barre end s${6 - end} not on the barre fret`);
    }
  }
  return out;
}

function wrongNotes(shape: ChordShape, baseFret: number, allowed: Set<number>): number[] {
  const out: number[] = [];
  shape.strings.forEach((p, i) => {
    if (p.fret === null) return;
    const pc = mod12(OPEN[i] + baseFret + p.fret);
    if (!allowed.has(pc)) out.push(pc);
  });
  return out;
}

const describeShape = (r: string, q: string, shape: ChordShape, baseFret: number) =>
  `${r} ${q} "${shape.name}" @${baseFret} frets=${shape.strings.map((p) => (p.fret === null ? 'x' : baseFret + p.fret)).join(',')} fingers=${shape.strings.map((p) => p.finger ?? '-').join(',')}`;

describe('oracle self-check', () => {
  it('covers every chord quality and catches a planted bad shape', () => {
    expect(Object.keys(ORACLE_CHORD).sort()).toEqual(Object.keys(CHORD_FORMULAS).sort());
    // Known positive: the old A6 fingering (finger 1 on two frets) is flagged.
    const bad: ChordShape = {
      name: 'planted', shortName: 'p', type: 'barre', cagedShape: 'A', rootString: 5, rootFretOffset: 0,
      strings: [{ fret: null }, { fret: 0, finger: 'bar' }, { fret: 2, finger: 1 }, { fret: 2, finger: 1 }, { fret: 2, finger: 1 }, { fret: 2, finger: 2 }],
      barreInfo: { fret: 0, fromString: 5, toString: 1 },
    };
    expect(physicalProblems(bad, 5).length).toBeGreaterThan(0);
    // ... and a barre over open strings (the old default G aug7).
    const overOpen: ChordShape = {
      name: 'planted2', shortName: 'p', type: 'barre', cagedShape: 'E', rootString: 6, rootFretOffset: 0,
      strings: [{ fret: 2, finger: 3 }, { fret: 1, finger: 2 }, { fret: 0, finger: 'bar' }, { fret: -1, finger: 0 }, { fret: -1, finger: 0 }, { fret: 0, finger: 'bar' }],
      barreInfo: { fret: 0, fromString: 4, toString: 1 },
    };
    expect(physicalProblems(overOpen, 1)).toContain('barre across open s3');
  });
});

describe('every displayed chord shape is playable and correct (W3-09)', () => {
  it('all qualities x 12 roots: chord tones only, one finger per fret, honest barres, on the board, never blank', () => {
    const problems: string[] = [];
    let shapes = 0;
    for (const q of Object.keys(CHORD_FORMULAS)) {
      for (const r of ROOTS) {
        const chord = buildChord(toNote(r), q as ChordQuality);
        const allowed = new Set(ORACLE_CHORD[q].map((s) => mod12(pcOf(r) + s)));
        const list = getChordShapesWithFallback(chord);
        if (list.length === 0) problems.push(`${r} ${q}: no shape at all`);
        for (const { shape, baseFret } of list) {
          shapes++;
          const wrong = wrongNotes(shape, baseFret, allowed);
          const phys = physicalProblems(shape, baseFret);
          if (wrong.length || phys.length) {
            problems.push(`${describeShape(r, q, shape, baseFret)} -> ${[...wrong.map((pc) => `wrong pc ${pc}`), ...phys].join('; ')}`);
          }
        }
      }
    }
    expect(problems.slice(0, 15)).toEqual([]);
    expect(shapes).toBeGreaterThan(1500);
  });

  it('the D6 family default (A6 barre) uses distinct fingers per fret', () => {
    for (const r of ['Db', 'D', 'Eb', 'E', 'Bb', 'B']) {
      const list = getChordShapesWithFallback(buildChord(toNote(r), 'major6'));
      const a6 = list.find((e) => e.shape.name.startsWith('A6'));
      expect(a6, r).toBeDefined();
      expect(physicalProblems(a6!.shape, a6!.baseFret)).toEqual([]);
    }
  });
});

describe('the hand-made library holds no silently-hidden shapes (W3-10)', () => {
  it('every hand shape, at every root it is placed on, sounds only chord tones and is playable', () => {
    const problems: string[] = [];
    let placed = 0;
    for (const [lib, list] of Object.entries(CHORD_SHAPE_LIBRARY)) {
      const q = LIBRARY_QUALITY[lib] ?? lib;
      const formula = ORACLE_CHORD[q];
      expect(formula, `oracle for ${lib}`).toBeDefined();
      expect(list.length, `${lib} has shapes`).toBeGreaterThan(0);
      for (const r of ROOTS) {
        const allowed = new Set(formula.map((s) => mod12(pcOf(r) + s)));
        for (const { shape, baseFret } of getChordShapes(toNote(r), q)) {
          placed++;
          const wrong = wrongNotes(shape, baseFret, allowed);
          const phys = physicalProblems(shape, baseFret);
          if (wrong.length || phys.length) problems.push(`${describeShape(r, q, shape, baseFret)} -> ${[...wrong.map((pc) => `wrong pc ${pc}`), ...phys].join('; ')}`);
        }
      }
    }
    expect(problems.slice(0, 15)).toEqual([]);
    expect(placed).toBeGreaterThan(800);
  });

  it('the C-shape and G-shape major barres a learner expects are available in every key', () => {
    for (const r of ROOTS) {
      const names = getChordShapesWithFallback(buildChord(toNote(r), 'major')).map((e) => e.shape.name);
      expect(names, r).toContain('C-shape Barre');
      expect(names, r).toContain('G-shape Barre');
    }
  });
});
