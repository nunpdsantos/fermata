/**
 * Every chord fingering the guitar shows can be played by a hand (QA audit
 * 2026-11-18, Q1). The audit found grips where ONE finger presses two strings
 * that are not next to each other while a string between them sounds at a
 * LOWER fret (the D-shape C7: finger 3 on G12 and e12 across B11). A finger
 * lying flat across strings is a barre, and a barre presses every string under
 * it at its own fret, so those grips cannot sound as drawn.
 *
 * The rules, written here independently of the app's own check
 * (`isPlayableChordShape`), for a placed shape (absolute frets; the capo, when
 * there is one, is the nut):
 *  1. every fretted string has a finger 1-4 ('bar' is the index);
 *  2. a finger presses one fret;
 *  3. a finger on several strings is a barre: every string between its outer
 *     two SOUNDS, at the barre fret under that same finger or higher under
 *     another finger; never open, muted, lower, or under another finger at the
 *     barre fret; a drawn barre (barreInfo) has both ends on its fret;
 *  4. at most four fingers;
 *  5. a reach a hand can make: fingers lie in order along the neck (a lower-
 *     numbered finger never on a higher fret than a higher-numbered one), and
 *     fingers a < b are at most (b - a) + 1 frets apart: one finger per fret
 *     plus one fret of stretch, so index to little finger spans at most five
 *     frets (f to f + 4);
 *  6. nothing lies past the 15 frets the board draws.
 *
 * Checked over (a) every shape of the hand-made library on all twelve roots
 * and (b) every grip the board can offer: every chord quality on twelve roots
 * in every inversion (the generated voicings and the inversions' added or
 * muted basses included), and the 24 major / minor triads and the dominant
 * sevenths with a capo on frets 1-9.
 */
import { describe, expect, it } from 'vitest';
import { buildChord, CHORD_FORMULAS } from '../chords';
import { CHORD_SHAPE_LIBRARY, chordShapesForCapo, getChordShapes, isPlayableChordShape, type ChordShape } from '../guitarChordShapes';
import type { ChordQuality, Note } from '../../types/music';

const MAX_FRET = 15;
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const STRING = ['E', 'A', 'D', 'G', 'B', 'e'];
const toNote = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
/** Library keys that differ from the ChordQuality name. */
const LIBRARY_QUALITY: Record<string, string> = { halfDiminished: 'half_diminished7', sixth: 'major6' };

type Placed = { shape: ChordShape; baseFret: number };

/** Every rule a placed grip breaks (empty = a hand can play it). */
export function fingeringFaults({ shape, baseFret }: Placed, capo = 0): string[] {
  const out: string[] = [];
  type S = { kind: 'muted' } | { kind: 'open' } | { kind: 'fretted'; fret: number; finger: number };
  const strings: S[] = shape.strings.map((p, i) => {
    if (p.fret === null) return { kind: 'muted' };
    const fret = baseFret + p.fret;
    if (fret < capo || fret > MAX_FRET) out.push(`${STRING[i]} at fret ${fret} is off the board`);
    if (fret === capo) return { kind: 'open' };
    const finger = p.finger === 'bar' ? 1 : Number(p.finger ?? 0);
    if (!(finger >= 1 && finger <= 4)) out.push(`${STRING[i]}${fret} has no finger`);
    return { kind: 'fretted', fret, finger };
  });
  const byFinger = new Map<number, number[]>();
  strings.forEach((s, i) => {
    if (s.kind !== 'fretted' || s.finger < 1) return;
    byFinger.set(s.finger, [...(byFinger.get(s.finger) ?? []), i]);
  });
  if (byFinger.size > 4) out.push('more than four fingers');
  const fretOf = new Map<number, number>();
  for (const [finger, on] of byFinger) {
    const frets = [...new Set(on.map((i) => (strings[i] as { fret: number }).fret))];
    if (frets.length > 1) {
      out.push(`finger ${finger} on frets ${frets.join(' and ')}`);
      continue;
    }
    const fret = frets[0];
    fretOf.set(finger, fret);
    const lo = Math.min(...on);
    const hi = Math.max(...on);
    for (let i = lo + 1; i < hi; i++) {
      const s = strings[i];
      const what = `finger ${finger} on ${STRING[lo]}${fret} and ${STRING[hi]}${fret}`;
      if (s.kind === 'muted') out.push(`${what} lies across the muted ${STRING[i]} string`);
      else if (s.kind === 'open') out.push(`${what} lies across the open ${STRING[i]} string`);
      else if (s.fret < fret) out.push(`${what} lies across ${STRING[i]}${s.fret}, a lower fret`);
      else if (s.fret === fret && s.finger !== finger) out.push(`${what} lies over finger ${s.finger} on ${STRING[i]}${fret}`);
    }
  }
  if (shape.barreInfo) {
    const bf = baseFret + shape.barreInfo.fret;
    for (const end of [6 - shape.barreInfo.fromString, 6 - shape.barreInfo.toString]) {
      const s = strings[end];
      if (s.kind !== 'fretted' || s.fret !== bf || s.finger !== 1) out.push(`the drawn barre's end on ${STRING[end]} is not the index on fret ${bf}`);
    }
    const a = Math.min(6 - shape.barreInfo.fromString, 6 - shape.barreInfo.toString);
    const b = Math.max(6 - shape.barreInfo.fromString, 6 - shape.barreInfo.toString);
    for (let i = a + 1; i < b; i++) {
      const s = strings[i];
      if (s.kind !== 'fretted' || s.fret < bf) out.push(`the drawn barre on fret ${bf} lies across ${STRING[i]} ${s.kind === 'fretted' ? `at fret ${s.fret}` : s.kind}`);
    }
  }
  for (const [a, fa] of fretOf) {
    for (const [b, fb] of fretOf) {
      if (a >= b) continue;
      if (fa > fb) out.push(`finger ${a} on fret ${fa} is beyond finger ${b} on fret ${fb}`);
      else if (fb - fa > b - a + 1) out.push(`finger ${a} on fret ${fa} to finger ${b} on fret ${fb} is out of reach`);
    }
  }
  return out;
}

const grip = ({ shape, baseFret }: Placed) =>
  `${shape.strings.map((p) => (p.fret === null ? 'x' : baseFret + p.fret)).join(' ')} fingers ${shape.strings.map((p) => (p.fret === null ? 'x' : p.finger === 'bar' ? 1 : p.finger ?? '-')).join(' ')}`;

describe('the validator itself', () => {
  const placed = (strings: ChordShape['strings'], baseFret: number, barreInfo?: ChordShape['barreInfo']): Placed => ({
    shape: { name: 'planted', shortName: 'planted', type: 'barre', cagedShape: 'D', rootString: 4, rootFretOffset: 0, strings, ...(barreInfo ? { barreInfo } : {}) },
    baseFret,
  });
  it('flags the audit\'s own example, the D-shape C7 (finger 3 on G12 and e12 across B11)', () => {
    const c7 = placed([{ fret: null }, { fret: null }, { fret: 0, finger: 1 }, { fret: 2, finger: 3 }, { fret: 1, finger: 2 }, { fret: 2, finger: 3 }], 10);
    expect(fingeringFaults(c7)).toEqual(['finger 3 on G12 and e12 lies across B11, a lower fret']);
  });
  it('flags a barre over an open or muted string, crossed fingers and an impossible stretch', () => {
    expect(fingeringFaults(placed([{ fret: 0, finger: 1 }, { fret: -1, finger: 0 }, { fret: 0, finger: 1 }, { fret: null }, { fret: null }, { fret: null }], 1)))
      .toEqual(['finger 1 on E1 and D1 lies across the open A string']);
    expect(fingeringFaults(placed([{ fret: null }, { fret: 0, finger: 1 }, { fret: null }, { fret: 0, finger: 1 }, { fret: null }, { fret: null }], 3)))
      .toEqual(['finger 1 on A3 and G3 lies across the muted D string']);
    expect(fingeringFaults(placed([{ fret: null }, { fret: 3, finger: 1 }, { fret: 2, finger: 2 }, { fret: null }, { fret: null }, { fret: null }], 0)))
      .toEqual(['finger 1 on fret 3 is beyond finger 2 on fret 2']);
    expect(fingeringFaults(placed([{ fret: 0, finger: 1 }, { fret: 0, finger: 2 }, { fret: 0, finger: 3 }, { fret: 0, finger: 4 }, { fret: 1, finger: 2 }, { fret: null }], 3)))
      .toEqual(['finger 2 on frets 3 and 4']);
    // Gmaj7 open as the library had it: finger 2 on fret 3, finger 3 on fret 2.
    expect(fingeringFaults(placed([{ fret: 3, finger: 2 }, { fret: 2, finger: 1 }, { fret: 0, finger: 0 }, { fret: 0, finger: 0 }, { fret: 0, finger: 0 }, { fret: 2, finger: 3 }], 0)))
      .toEqual(['finger 2 on fret 3 is beyond finger 3 on fret 2']);
    expect(fingeringFaults(placed([{ fret: null }, { fret: -1, finger: 0 }, { fret: -1, finger: 0 }, { fret: 3, finger: 2 }, { fret: 3, finger: 2 }, { fret: 0, finger: 1 }], 1)))
      .toEqual(['finger 1 on fret 1 to finger 2 on fret 4 is out of reach']);
  });
  it('passes the standard grips: the F barre, the A-shape barre with a ring-finger barre, the open C', () => {
    expect(fingeringFaults(placed([{ fret: 0, finger: 'bar' }, { fret: 2, finger: 3 }, { fret: 2, finger: 4 }, { fret: 1, finger: 2 }, { fret: 0, finger: 'bar' }, { fret: 0, finger: 'bar' }], 1, { fret: 0, fromString: 6, toString: 1 }))).toEqual([]);
    expect(fingeringFaults(placed([{ fret: null }, { fret: 0, finger: 'bar' }, { fret: 2, finger: 3 }, { fret: 2, finger: 3 }, { fret: 2, finger: 3 }, { fret: 0, finger: 'bar' }], 1, { fret: 0, fromString: 5, toString: 1 }))).toEqual([]);
    expect(fingeringFaults(placed([{ fret: null }, { fret: 3, finger: 3 }, { fret: 2, finger: 2 }, { fret: 0, finger: 0 }, { fret: 1, finger: 1 }, { fret: 0, finger: 0 }], 0))).toEqual([]);
  });
});

describe('the app\'s own check (isPlayableChordShape) refuses what a hand cannot play', () => {
  const placed = (strings: ChordShape['strings'], baseFret: number, barreInfo?: ChordShape['barreInfo']): Placed => ({
    shape: { name: 'planted', shortName: 'D shape', type: 'barre', cagedShape: 'D', rootString: 4, rootFretOffset: 0, strings, ...(barreInfo ? { barreInfo } : {}) },
    baseFret,
  });
  const muted = { fret: null } as const;
  it('the six grips of the audit as the library had them, the old Gmaj7 and an out-of-reach bass', () => {
    const old: [string, Placed][] = [
      ['C7, D shape', placed([muted, muted, { fret: 0, finger: 1 }, { fret: 2, finger: 3 }, { fret: 1, finger: 2 }, { fret: 2, finger: 3 }], 10)],
      ['Cdim7, D shape', placed([muted, muted, { fret: 0, finger: 1 }, { fret: 1, finger: 2 }, { fret: 0, finger: 1 }, { fret: 1, finger: 2 }], 10)],
      ['Cm6, E shape', placed([{ fret: 0, finger: 'bar' }, { fret: 2, finger: 3 }, { fret: 2, finger: 4 }, { fret: 0, finger: 'bar' }, { fret: 2, finger: 4 }, { fret: 0, finger: 'bar' }], 8, { fret: 0, fromString: 6, toString: 1 })],
      ['Csus2sus4, E shape', placed([{ fret: 0, finger: 'bar' }, { fret: 2, finger: 2 }, { fret: 2, finger: 3 }, { fret: 2, finger: 4 }, { fret: 0, finger: 'bar' }, { fret: 2, finger: 4 }], 8, { fret: 0, fromString: 6, toString: 2 })],
      ['C13, A shape', placed([muted, { fret: 0, finger: 'bar' }, { fret: 2, finger: 3 }, { fret: 0, finger: 'bar' }, { fret: 2, finger: 3 }, { fret: 2, finger: 4 }], 3)],
      ['Cmaj13, A shape', placed([muted, { fret: 0, finger: 1 }, { fret: 2, finger: 3 }, { fret: 1, finger: 2 }, { fret: 2, finger: 3 }, { fret: 2, finger: 4 }], 3)],
      ['Gmaj7 open', placed([{ fret: 3, finger: 2 }, { fret: 2, finger: 1 }, { fret: 0, finger: 0 }, { fret: 0, finger: 0 }, { fret: 0, finger: 0 }, { fret: 2, finger: 3 }], 0)],
      ['D♭m11 / C♭: middle finger three frets past the index barre', placed([{ fret: 3, finger: 2 }, { fret: 0, finger: 'bar' }, { fret: 0, finger: 'bar' }, { fret: 0, finger: 'bar' }, { fret: 0, finger: 'bar' }, { fret: -4, finger: 0 }], 4)],
      ['a drawn barre held by the middle finger', placed([{ fret: -2, finger: 1 }, { fret: 0, finger: 2 }, { fret: 0, finger: 2 }, { fret: 0, finger: 2 }, { fret: 0, finger: 2 }, { fret: 0, finger: 2 }], 3, { fret: 0, fromString: 5, toString: 1 })],
    ];
    for (const [name, entry] of old) {
      expect(fingeringFaults(entry), `${name}: the independent rules flag it`).not.toEqual([]);
      expect(isPlayableChordShape(entry), name).toBe(false);
    }
    // ... and the same grips as fingered now pass both.
    const now: [string, Placed][] = [
      ['C7, D shape', placed([muted, muted, { fret: 0, finger: 1 }, { fret: 2, finger: 3 }, { fret: 1, finger: 2 }, { fret: 2, finger: 4 }], 10)],
      ['Cmaj13, A shape', placed([muted, { fret: 0, finger: 1 }, { fret: 2, finger: 3 }, { fret: 1, finger: 2 }, { fret: 2, finger: 4 }, { fret: 2, finger: 4 }], 3)],
      ['Gmaj7 open', placed([{ fret: 3, finger: 3 }, { fret: 2, finger: 2 }, { fret: 0, finger: 0 }, { fret: 0, finger: 0 }, { fret: 0, finger: 0 }, { fret: 2, finger: 1 }], 0)],
    ];
    for (const [name, entry] of now) {
      expect(fingeringFaults(entry), name).toEqual([]);
      expect(isPlayableChordShape(entry), name).toBe(true);
    }
  });
});

describe('grips that used to overreach are still offered, fingered within reach (Q1)', () => {
  const frets = (e: Placed) => e.shape.strings.map((p) => (p.fret === null ? null : e.baseFret + p.fret));
  const fingers = (e: Placed) => e.shape.strings.map((p) => (p.fret === null ? null : p.finger === 'bar' ? 1 : p.finger));
  const offered = (root: string, quality: ChordQuality, inversion: number) =>
    chordShapesForCapo(buildChord(toNote(root), quality), inversion, 0).shapes.map((e) => ({ frets: frets(e), fingers: fingers(e) }));
  it('a generated voicing: B7♭5♯9 x 0 0 4 4 1, the ring finger on G and B (the middle finger cannot reach three frets)', () => {
    expect(offered('B', 'dominant7flat5sharp9', 0)).toContainEqual({ frets: [null, 0, 0, 4, 4, 1], fingers: [null, 0, 0, 3, 3, 1] });
  });
  it('a bass added below a barre: D♭m11 / C♭ 7 4 4 4 4 0 and F7♯9 / G♯ 4 0 1 1 1 1, the ring finger on the bass', () => {
    expect(offered('Db', 'minor11', 3)[0]).toEqual({ frets: [7, 4, 4, 4, 4, 0], fingers: [3, 1, 1, 1, 1, 0] });
    expect(offered('F', 'dominant7sharp9', 4)[0]).toEqual({ frets: [4, 0, 1, 1, 1, 1], fingers: [3, 0, 1, 1, 1, 1] });
  });
});

describe('every hand-made shape, on all twelve roots, can be played (Q1)', () => {
  it('no shape of the library breaks a rule at any root it is placed on', () => {
    const faults: string[] = [];
    let placed = 0;
    for (const [key, shapes] of Object.entries(CHORD_SHAPE_LIBRARY)) {
      expect(shapes.length, key).toBeGreaterThan(0);
      for (const root of ROOTS) {
        for (const entry of getChordShapes(toNote(root), LIBRARY_QUALITY[key] ?? key)) {
          placed++;
          const f = fingeringFaults(entry);
          if (f.length) faults.push(`${root} ${key} "${entry.shape.name}": ${grip(entry)}: ${f.join('; ')}`);
        }
      }
    }
    expect(faults).toEqual([]);
    expect(placed).toBeGreaterThan(900);
  }, 60_000);
});

describe('every grip the board can offer can be played (Q1, the whole class)', () => {
  it('every quality x 12 roots x every inversion, no capo; triads and dominant sevenths with a capo on 1-9', () => {
    const faults: string[] = [];
    let shown = 0;
    const check = (root: string, quality: string, inversion: number, capo: number) => {
      const chord = buildChord(toNote(root), quality as ChordQuality);
      for (const entry of chordShapesForCapo(chord, inversion, capo).shapes) {
        shown++;
        const f = fingeringFaults(entry, capo);
        if (f.length) faults.push(`${root} ${quality} inversion ${inversion} capo ${capo} "${entry.shape.name}": ${grip(entry)}: ${f.join('; ')}`);
      }
    };
    for (const quality of Object.keys(CHORD_FORMULAS)) {
      for (const root of ROOTS) {
        const notes = buildChord(toNote(root), quality as ChordQuality).notes.length;
        for (let inversion = 0; inversion < notes; inversion++) check(root, quality, inversion, 0);
      }
    }
    for (const quality of ['major', 'minor', 'dominant7']) {
      for (const root of ROOTS) for (let capo = 1; capo <= 9; capo++) check(root, quality, 0, capo);
    }
    expect([...new Set(faults)]).toEqual([]);
    expect(shown).toBeGreaterThan(11000);
  }, 120_000);
});
