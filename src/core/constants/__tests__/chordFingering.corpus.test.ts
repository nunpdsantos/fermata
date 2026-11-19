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
import { beforeAll, describe, expect, it } from 'vitest';
import { buildChord, CHORD_FORMULAS } from '../chords';
import { rightHandStudy, RIGHT_HAND_PATTERNS } from '../../utils/rightHandPatterns';
import { arrangeShapesForBass, CHORD_SHAPE_LIBRARY, chordShapesForCapo, getChordShapes, isPlayableChordShape, type ChordShape } from '../guitarChordShapes';
import type { Chord, ChordQuality, Note } from '../../types/music';

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
  // Since music audit 2 (M43) a grip is offered under the inversion whose bass
  // it has: x 0 0 4 4 1 has the open A, B7♭5♯9's seventh, lowest — the third
  // inversion.
  it('a generated voicing: B7♭5♯9 x 0 0 4 4 1, the ring finger on G and B (the middle finger cannot reach three frets)', () => {
    expect(offered('B', 'dominant7flat5sharp9', 3)).toContainEqual({ frets: [null, 0, 0, 4, 4, 1], fingers: [null, 0, 0, 3, 3, 1] });
  });
  // D♭m11 / C♭ is now offered x 2 2 x 2 2, a generated grip that already has
  // C♭ lowest (the generator searches with the 11th required since M44), so the
  // board no longer builds 7 4 4 4 4 0; the bass-adder's choice of finger is
  // pinned on the same root-position grip, x 4 4 4 4 0, directly.
  it('a bass added below a barre: D♭m11 / C♭ 7 4 4 4 4 0 and F7♯9 / G♯ 4 0 1 1 1 1, the ring finger on the bass', () => {
    const dbm11 = buildChord(toNote('Db'), 'minor11');
    const barre = chordShapesForCapo(dbm11, 0, 0).shapes.filter((e) => frets(e).join() === [null, 4, 4, 4, 4, 0].join());
    expect(barre).toHaveLength(1);
    const added = arrangeShapesForBass(barre, dbm11, 11, 'Cb');
    expect(added.bassMatched).toBe(true);
    expect({ frets: frets(added.shapes[0]), fingers: fingers(added.shapes[0]) }).toEqual({ frets: [7, 4, 4, 4, 4, 0], fingers: [3, 1, 1, 1, 1, 0] });
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

// ── Every grip the board can offer: one walk, four checks ───────────────────
//
// The requests: every quality on the 21 root spellings in every inversion, and
// the common qualities over every other bass (slash chords: C/E, C/B♭, …), each
// with a capo on frets 0-9 — what chordShapesForCapo hands the fretboard.
// Checked on every grip (independent review of a611beb, 2026-11-19):
//  - the fingering rules above;
//  - the bass: a request called matched has the requested bass as the LOWEST
//    PITCH of its first grip (tuning + capo + fret, never the lowest string),
//    and so has every grip labelled with it ("/C♯");
//  - only the chord's tones sound (and the slash bass);
//  - the tones the chord is named for sound: root, the third (or the
//    suspension), the seventh where there is one and the defining alterations
//    (written here from the chord formulas, independent of the app's own list).
const SPELLINGS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'E#', 'Fb', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'B#', 'Cb'];
const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SLASH_QUALITIES = ['major', 'minor', 'dominant7', 'minor7', 'major7', 'sus4', 'sus2', 'add9', 'major6', 'minor6', 'power'];
const OPEN_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4
const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACCIDENTAL: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2 };
const pcOfNote = (n: Note) => (LETTER[n.natural] + ACCIDENTAL[n.accidental] + 24) % 12;
const lowestPitch = ({ shape, baseFret }: Placed) =>
  Math.min(...shape.strings.flatMap((p, i) => (p.fret === null ? [] : [OPEN_MIDI[i] + baseFret + p.fret])));
const soundingPcs = ({ shape, baseFret }: Placed) =>
  new Set(shape.strings.flatMap((p, i) => (p.fret === null ? [] : [(OPEN_MIDI[i] + baseFret + p.fret) % 12])));

/** The offsets above the root a grip must sound, from the chord's formula; `oneOf` = at least one of them. */
function namedTones(quality: string): { all: number[]; oneOf?: number[] } {
  const offsets = new Set(CHORD_FORMULAS[quality as ChordQuality].map((x) => ((x % 12) + 12) % 12));
  const all = [0];
  if (offsets.has(4)) all.push(4);
  else if (offsets.has(3)) all.push(3);
  else if (quality.includes('sus')) all.push(offsets.has(5) ? 5 : 2);
  if (offsets.has(11)) all.push(11);
  else if (offsets.has(10)) all.push(10);
  const DEFINING: Record<string, number[]> = {
    diminished: [6], diminished7: [6, 9], half_diminished7: [6], major7flat5: [6], diminished_major7: [6],
    dominant7flat5: [6], dominant7flat5flat9: [6, 1], dominant7flat5sharp9: [6, 3],
    augmented: [8], augmented7: [8], augmented_major7: [8], dominant7sharp5: [8], dominant7sharp5flat9: [8, 1], dominant7sharp5sharp9: [8, 3],
    major6: [9], minor6: [9], six_nine: [9, 2], minor_six_nine: [9, 2], add9: [2], add11: [5],
    dominant7flat9: [1], dominant7sharp9: [3], dominant13flat9: [1], dominant7sharp11: [6], major7sharp11: [6],
    dominant9sharp11: [6], major9sharp11: [6], dominant7flat13: [8],
  };
  all.push(...(DEFINING[quality] ?? []));
  return quality === 'dominant7alt' ? { all, oneOf: [1, 3, 6, 8] } : { all };
}

interface Walk { requests: number; grips: number; fingering: string[]; bass: string[]; wrongNotes: string[]; missing: string[] }
const walk: Walk = { requests: 0, grips: 0, fingering: [], bass: [], wrongNotes: [], missing: [] };

beforeAll(() => {
  const request = (name: string, chord: Chord, inversion: number, capo: number, bassPc: number | null) => {
    walk.requests++;
    const got = chordShapesForCapo(chord, inversion, capo);
    const rootPc = pcOfNote(chord.root);
    const allowed = new Set(chord.notes.map(pcOfNote));
    if (chord.bassNote) allowed.add(pcOfNote(chord.bassNote));
    const tones = namedTones(chord.quality);
    if (bassPc !== null && got.bassMatched && got.shapes.length > 0 && lowestPitch(got.shapes[0]) % 12 !== bassPc) {
      walk.bass.push(`${name}: called matched, first grip ${grip(got.shapes[0])} sounds ${lowestPitch(got.shapes[0]) % 12} lowest, not ${bassPc}`);
    }
    for (const entry of got.shapes) {
      walk.grips++;
      const where = `${name} "${entry.shape.name}": ${grip(entry)}`;
      const f = fingeringFaults(entry, capo);
      if (f.length) walk.fingering.push(`${where}: ${f.join('; ')}`);
      if (bassPc !== null && entry.shape.shortName.includes('/') && lowestPitch(entry) % 12 !== bassPc) {
        walk.bass.push(`${where}: labelled with the bass, sounds ${lowestPitch(entry) % 12} lowest, not ${bassPc}`);
      }
      const pcs = soundingPcs(entry);
      const wrong = [...pcs].filter((x) => !allowed.has(x));
      if (wrong.length) walk.wrongNotes.push(`${where}: sounds ${wrong.join(', ')}`);
      const missing = tones.all.filter((o) => !pcs.has((rootPc + o) % 12));
      if (tones.oneOf && !tones.oneOf.some((o) => pcs.has((rootPc + o) % 12))) missing.push(-1);
      if (missing.length) walk.missing.push(`${chord.quality}: ${where}: lacks ${missing.join(', ')}`);
    }
  };
  for (const quality of Object.keys(CHORD_FORMULAS)) {
    for (const root of SPELLINGS) {
      const chord = buildChord(toNote(root), quality as ChordQuality);
      for (let inversion = 0; inversion < chord.notes.length; inversion++) {
        const bassPc = inversion === 0 ? null : pcOfNote(chord.notes[inversion]);
        for (let capo = 0; capo <= 9; capo++) request(`${root} ${quality} inversion ${inversion} capo ${capo}`, chord, inversion, capo, bassPc);
      }
    }
  }
  for (const quality of SLASH_QUALITIES) {
    for (const root of SHARPS) {
      for (const bass of SHARPS) {
        if (bass === root) continue;
        const chord = { ...buildChord(toNote(root), quality as ChordQuality), bassNote: toNote(bass) };
        for (let capo = 0; capo <= 9; capo++) request(`${root} ${quality}/${bass} capo ${capo}`, chord, 0, capo, pcOfNote(chord.bassNote));
      }
    }
  }
}, 900_000);

describe('muting strings below the bass checks the PITCH left lowest (review of a611beb)', () => {
  it('D major 5 9 0 7 7 x asked for F♯: the first F♯ string is A9, but the open D (D3) sounds lower, so no "/F♯" grip and the notice', () => {
    const strings = [{ fret: 5, finger: 1 }, { fret: 9, finger: 4 }, { fret: 0, finger: 0 }, { fret: 7, finger: 2 }, { fret: 7, finger: 3 }, { fret: null, finger: 0 }] as ChordShape['strings'];
    const entry: Placed = { shape: { name: 'planted', shortName: 'E shape', type: 'barre', cagedShape: 'E', rootString: 6, rootFretOffset: 0, strings }, baseFret: 0 };
    expect(fingeringFaults(entry), 'a hand can play it').toEqual([]);
    const got = arrangeShapesForBass([entry], buildChord(toNote('D'), 'major'), 6, 'F#');
    for (const e of got.shapes) if (e.shape.shortName.includes('/')) expect(lowestPitch(e) % 12, grip(e)).toBe(6);
    expect(got.bassMatched).toBe(false);
  });
});

describe('every grip the board can offer (Q1, the whole class; the review of a611beb)', () => {
  it('walks every request: 21 spellings x every quality x every inversion, slash chords, capo 0-9', () => {
    expect(walk.requests).toBeGreaterThan(50_000);
    // 120,866 since music audit 2 (M43: only grips with the asked bass are
    // offered when one has it); 217,659 before, with the bound at 200,000.
    expect(walk.grips).toBeGreaterThan(110_000);
  });
  it('can be played', () => {
    expect([...new Set(walk.fingering)]).toEqual([]);
  });
  it('a grip called a match, or labelled with a bass, has that bass as its LOWEST PITCH', () => {
    expect(walk.bass).toEqual([]);
  });
  it('sounds only the chord\'s tones (and a slash chord\'s bass)', () => {
    expect(walk.wrongNotes).toEqual([]);
  });
  it('sounds the tones the chord is named for: root, third or suspension, seventh, its alterations', () => {
    expect(walk.missing).toEqual([]);
  });
});

// ── The right-hand studies of the practice sheet ─────────────────────────────
// A bar plucks some strings of ONE grip, which the left hand holds whole (a
// barre still presses the strings it does not pluck). So the grip is checked
// whole, and every plucked note must be a string and fret of that grip, under
// the finger the grip gives it.
describe('every grip of every right-hand study can be played (the practice sheet)', () => {
  it('every key x major / minor x pattern: the grip each bar holds breaks no rule, and its notes are that grip\'s', () => {
    const faults: string[] = [];
    let bars = 0;
    for (const key of SPELLINGS) {
      for (const mode of ['major', 'minor'] as const) {
        for (const pattern of RIGHT_HAND_PATTERNS) {
          const study = rightHandStudy(toNote(key), mode, pattern.id);
          if (!study) continue;
          for (const bar of study.bars) {
            bars++;
            const held = chordShapesForCapo(buildChord(bar.chord.root, bar.chord.quality), 0, 0).shapes[0];
            const where = `${key} ${mode} ${pattern.id} ${bar.numeral} (${bar.shape.name})`;
            if (held.shape.name !== bar.shape.name || held.baseFret !== bar.shape.baseFret) { faults.push(`${where}: not the chord's default grip`); continue; }
            const f = fingeringFaults(held);
            if (f.length) faults.push(`${where}: ${grip(held)}: ${f.join('; ')}`);
            for (const n of bar.notes) {
              const p = held.shape.strings[n.stringIndex];
              const fret = p.fret === null ? null : held.baseFret + p.fret;
              const finger = fret === 0 ? 0 : p.finger === 'bar' ? 1 : p.finger;
              if (fret !== n.fret || finger !== n.lh) faults.push(`${where}: plucks ${STRING[n.stringIndex]}${n.fret} with finger ${n.lh}; the grip has ${fret === null ? 'it muted' : `fret ${fret}, finger ${finger}`}`);
            }
          }
        }
      }
    }
    expect(faults).toEqual([]);
    expect(bars).toBeGreaterThan(200);
  });
});
