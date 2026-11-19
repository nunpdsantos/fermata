/**
 * Music audit 2 (18 November 2026, release 15), the Explore guitar's grips:
 * findings M36, M42, M43, M44, M45, reproduced from the audit's own evidence
 * (fixtures/audit2-explore-guitar.json: rows copied from
 * fermata-programme/notes/2026-11-18-audit/evidence/explore-guitar/*.csv).
 *
 * Pitches are worked out here, independently of the app: the open strings'
 * MIDI numbers in standard tuning plus the fret (a capo is already in the
 * frets), the bass being the LOWEST PITCH, never the lowest string.
 *
 * M36 and M42 were cured by release 16 (the hand rules in
 * `isPlayableChordShape`; the bass as the lowest pitch): their evidence is
 * kept here as a regression test. M43, M44 and M45 failed at 153caab.
 */
import { describe, expect, it } from 'vitest';
import { buildChord } from '../chords';
import { arrangeShapesForBass, chordShapesForCapo, gripLeavesOut } from '../guitarChordShapes';
import type { ChordShape } from '../guitarChordShapes';
import type { Chord, ChordQuality, Note } from '../../types/music';
import evidence from './fixtures/audit2-explore-guitar.json';

type Placed = { shape: ChordShape; baseFret: number };
const OPEN = [40, 45, 50, 55, 59, 64];
const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (s: string) => (LETTER[s[0]] + [...s.slice(1)].reduce((a, c) => a + (c === '#' ? 1 : -1), 0) + 24) % 12;
const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
const frets = (e: Placed) => e.shape.strings.map((p) => (p.fret === null ? null : e.baseFret + p.fret));
const fretText = (e: Placed) => frets(e).map((f) => f ?? 'x').join('-');
const midis = (e: Placed) => frets(e).flatMap((f, s) => (f === null ? [] : [OPEN[s] + f]));
const lowestPc = (e: Placed) => Math.min(...midis(e)) % 12;
const sounds = (e: Placed) => new Set(midis(e).map((m) => m % 12));
const fingers = (e: Placed, capo: number) =>
  e.shape.strings.map((p, s) => {
    const f = frets(e)[s];
    if (f === null) return null;
    if (f === capo) return 0;
    return p.finger === 'bar' ? 1 : (p.finger ?? -1);
  });

/** The audit's check: one finger on two strings at one fret with a lower-fretted string sounding between them. */
function straightBarreAcrossLower(e: Placed, capo: number): string | null {
  const f = frets(e);
  const fi = fingers(e, capo);
  for (let lo = 0; lo < 6; lo++) {
    for (let hi = lo + 1; hi < 6; hi++) {
      if (f[lo] === null || f[hi] === null || !fi[lo] || fi[hi] !== fi[lo] || f[lo] !== f[hi]) continue;
      for (let j = lo + 1; j < hi; j++) {
        if (f[j] !== null && f[j]! < f[lo]!) return `finger ${fi[lo]} at fret ${f[lo]} on strings ${6 - lo} and ${6 - hi} crosses string ${6 - j} at fret ${f[j]}`;
      }
    }
  }
  return null;
}

const request = (root: string, quality: string, bass: string | null): Chord => {
  const chord = buildChord(N(root), quality as ChordQuality);
  return bass ? { ...chord, bassNote: N(bass) } : chord;
};

describe('M36: no printed fingering lies one finger across a lower-fretted string (cured in release 16)', () => {
  it('the 72 no-capo root-position grips of the audit (42 first choices): none is offered with that fingering', () => {
    expect(evidence.rootFingerConflicts).toHaveLength(72);
    expect(evidence.rootFingerConflicts.filter((r) => r.shape === 1)).toHaveLength(42);
    const still: string[] = [];
    for (const row of evidence.rootFingerConflicts) {
      const { shapes } = chordShapesForCapo(request(row.root, row.quality, null), 0, 0);
      for (const e of shapes) {
        const why = straightBarreAcrossLower(e, 0);
        if (why) still.push(`${row.root} ${row.quality} ${fretText(e)}: ${why}`);
      }
    }
    expect(still).toEqual([]);
  });

  it('C minor 6, E shape 8-10-10-8-10-8: still offered, fingered so the little finger never lies across string 3', () => {
    const { shapes } = chordShapesForCapo(request('C', 'minor6', null), 0, 0);
    const e = shapes.find((x) => fretText(x) === '8-10-10-8-10-8');
    expect(e).toBeDefined();
    expect(fingers(e!, 0)).toEqual([1, 2, 3, 1, 4, 1]);
  });
});

describe('M42: a request called matched has the asked bass as its lowest PITCH (cured in release 16)', () => {
  it('the audit\'s 141 first grips (37 inversion and 104 slash requests): each now has that bass lowest, or the notice', () => {
    expect(evidence.firstGripMissesBass).toHaveLength(141);
    expect(evidence.firstGripMissesBass.filter((r) => r.mode === 'inversion')).toHaveLength(37);
    const wrong: string[] = [];
    for (const row of evidence.firstGripMissesBass) {
      const chord = request(row.root, row.quality, row.bass || null);
      const { shapes, bassMatched } = chordShapesForCapo(chord, row.inversion, row.capo);
      if (bassMatched && shapes.length && lowestPc(shapes[0]) !== pcOf(row.expectedBass)) {
        wrong.push(`${row.root} ${row.quality} capo ${row.capo} inv ${row.inversion} /${row.bass}: ${fretText(shapes[0])}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('Am11 first inversion: 8-0-5-5-0-0 (open A2 under C3) is never offered as a C-bass grip', () => {
    // At 153caab no grip has C lowest, and the board says so (bassMatched
    // false: "No shape here has C in the bass"); a grip offered as matching
    // must have C lowest.
    const { shapes, bassMatched } = chordShapesForCapo(request('A', 'minor11', null), 1, 0);
    if (bassMatched) {
      expect(lowestPc(shapes[0])).toBe(0);
      expect(shapes.map(fretText)).not.toContain('8-0-5-5-0-0');
    } else {
      expect(shapes.length).toBeGreaterThan(0);
    }
  });
});

describe('M43: a grip offered for an asked bass has that bass lowest', () => {
  it('C major, first inversion: every grip has E lowest; the C shape x-3-2-0-1-0 is not among them', () => {
    const { shapes, bassMatched } = chordShapesForCapo(request('C', 'major', null), 1, 0);
    expect(bassMatched).toBe(true);
    expect(fretText(shapes[0])).toBe('x-x-2-0-1-0');
    expect(shapes.map(lowestPc)).toEqual(shapes.map(() => 4));
    expect(shapes.map(fretText)).not.toContain('x-3-2-0-1-0');
  });

  it('C/E written as a slash chord: the same', () => {
    const { shapes, bassMatched } = chordShapesForCapo(request('C', 'major', 'E'), 0, 0);
    expect(bassMatched).toBe(true);
    expect(shapes.map(lowestPc)).toEqual(shapes.map(() => 4));
  });

  it('root position asks for the root: C augmented seventh no longer defaults to 0-1-x-1-1-0 (E lowest)', () => {
    const { shapes, bassMatched } = chordShapesForCapo(request('C', 'augmented7', null), 0, 0);
    expect(bassMatched).toBe(true);
    expect(fretText(shapes[0])).not.toBe('0-1-x-1-1-0');
    expect(shapes.map(lowestPc)).toEqual(shapes.map(() => 0));
  });

  it('with a capo the same holds (C/E, capo 3: every grip has E lowest)', () => {
    const { shapes, bassMatched } = chordShapesForCapo(request('C', 'major', null), 1, 3);
    expect(bassMatched).toBe(true);
    expect(shapes.length).toBeGreaterThan(0);
    expect(shapes.map(lowestPc)).toEqual(shapes.map(() => 4));
  });
});

describe('M44: a grip sounds the tone that names the chord', () => {
  it('Cmaj11: every grip sounds F (the 11th); x-3-5-4-3-3 (C G B D G) is not offered', () => {
    const { shapes } = chordShapesForCapo(request('C', 'major11', null), 0, 0);
    expect(shapes.length).toBeGreaterThan(0);
    expect(shapes.filter((e) => !sounds(e).has(5)).map(fretText)).toEqual([]);
    expect(shapes.map(fretText)).not.toContain('x-3-5-4-3-3');
  });

  it('C9: every grip sounds D (the 9th); the D shape x-x-10-12-11-12 (C7\'s four tones) is not offered', () => {
    const { shapes } = chordShapesForCapo(request('C', 'dominant9', null), 0, 0);
    expect(shapes.length).toBeGreaterThan(0);
    expect(shapes.filter((e) => !sounds(e).has(2)).map(fretText)).toEqual([]);
    expect(shapes.map(fretText)).not.toContain('x-x-10-12-11-12');
  });

  it('the audit\'s 194 first suggestions: each sounds its named tones, or says which tone it leaves out', () => {
    expect(evidence.firstGripOmitsNamedTone).toHaveLength(194);
    const silent: string[] = [];
    for (const row of evidence.firstGripOmitsNamedTone) {
      const chord = request(row.root, row.quality, null);
      const { shapes } = chordShapesForCapo(chord, 0, row.capo);
      if (!shapes.length) continue;
      const missing = /absent offsets above root (.+)$/.exec(row.evidence)![1].split('/').map((d) => (pcOf(row.root) + Number(d)) % 12);
      const left = missing.filter((pc) => !sounds(shapes[0]).has(pc));
      // A grip that still leaves a named tone out must say so: gripLeavesOut
      // names it (the grip's frets are real, so the chord as it sounds).
      const said = gripLeavesOut(shapes[0], chord).map((n) => pcOf(`${n.natural}${n.accidental}`));
      if (left.some((pc) => !said.includes(pc))) silent.push(`${row.root} ${row.quality} capo ${row.capo}: ${fretText(shapes[0])}`);
    }
    expect(silent).toEqual([]);
  });

  it('a grip that sounds every named tone says nothing is left out', () => {
    const chord = request('C', 'major', null);
    const { shapes } = chordShapesForCapo(chord, 0, 3);
    expect(gripLeavesOut(shapes[0], chord)).toEqual([]);
  });
});

describe('M44: each name carries its tone (one row at a time; the review of builder K)', () => {
  // The offsets above the root each name spells out (written here, not read
  // from the app): a grip on the root alone must be said to leave each out.
  const NAMED: [string, number[]][] = [
    ['power', [7]], ['sus2sus4', [2]], ['dominant9', [2]], ['major9', [2]], ['minor9', [2]], ['dominant9sus4', [2]],
    ['dominant11', [5]], ['major11', [5]], ['minor11', [5]], ['dominant13', [9]], ['major13', [9]], ['minor13', [9]],
    ['dominant13flat9', [9]], ['dominant9sharp11', [2]], ['major9sharp11', [2]],
  ];
  const rootAlone: Placed = {
    shape: { name: 'root', shortName: 'root', type: 'open', cagedShape: 'C', rootString: 5, rootFretOffset: 0, strings: [{ fret: null }, { fret: 3, finger: 3 }, { fret: null }, { fret: null }, { fret: null }, { fret: null }] },
    baseFret: 0,
  };
  it.each(NAMED)('%s: a grip without it is said to leave it out', (quality, offsets) => {
    const chord = request('C', quality, null);
    const said = gripLeavesOut(rootAlone, chord).map((n) => pcOf(`${n.natural}${n.accidental}`));
    for (const o of offsets) expect(said, `${quality} names ${o} semitones above C`).toContain(o % 12);
  });
});

describe('the re-fretted bass (review of builder K, item 4)', () => {
  it('never takes the lowest string from under the index barre: C major\'s A shape written with its index on string 5, asked for D', () => {
    // x 3 5 5 5 3, the index ('bar') on strings 5 and 1 at fret 3, the ring over 4–2 at fret 5, no drawn barre.
    const built: Placed = {
      shape: { name: 'built', shortName: 'built', type: 'barre', cagedShape: 'A', rootString: 5, rootFretOffset: 0,
        strings: [{ fret: null, finger: 0 }, { fret: 0, finger: 'bar' }, { fret: 2, finger: 3 }, { fret: 2, finger: 3 }, { fret: 2, finger: 3 }, { fret: 0, finger: 'bar' }] },
      baseFret: 3,
    };
    const out = arrangeShapesForBass([built], request('C', 'major', null), 2, 'D');
    // Without the rule the re-fret gives x 5 5 5 5 3 ("built/D"), the string pulled from under the index.
    expect(out.shapes.filter((e) => e.shape.shortName === 'built/D').map(fretText)).toEqual([]);
  });

  it('may lay the index across the lowest string where the index is already down at that fret: G/F♯ 2 2 0 0 0 3', () => {
    const { shapes, bassMatched } = chordShapesForCapo(request('G', 'major', 'F#'), 0, 0);
    expect(bassMatched).toBe(true);
    expect(fretText(shapes[0])).toBe('2-2-0-0-0-3');
    expect(fingers(shapes[0], 0)).toEqual([1, 1, 0, 0, 0, 3]);
  });
});

describe('M45: reachable grips the library missed', () => {
  const em7G = (e: Placed) => {
    expect(fretText(e)).toBe('3-2-0-0-0-0');
    expect(Math.min(...midis(e))).toBe(43); // G2
    expect([...sounds(e)].sort((a, b) => a - b)).toEqual([2, 4, 7, 11]); // D E G B
    expect(fingers(e, 0)).toEqual([3, 2, 0, 0, 0, 0]);
  };

  it('Em7/G: 3-2-0-0-0-0 (G2 B2 D3 G3 B3 E4), fingered 3 2 0 0 0 0, with G lowest', () => {
    const { shapes, bassMatched } = chordShapesForCapo(request('E', 'minor7', 'G'), 0, 0);
    expect(bassMatched).toBe(true);
    const e = shapes.find((x) => fretText(x) === '3-2-0-0-0-0');
    expect(e).toBeDefined();
    em7G(e!);
  });

  it('E minor seventh, first inversion (G bass): the same grip', () => {
    const { shapes, bassMatched } = chordShapesForCapo(request('E', 'minor7', null), 1, 0);
    expect(bassMatched).toBe(true);
    const e = shapes.find((x) => fretText(x) === '3-2-0-0-0-0');
    expect(e).toBeDefined();
    em7G(e!);
  });

  it('a re-fretted bass never puts a finger behind fingers it cannot pass: A/C x 3 2 2 2 0 is fingered with the index across fret 2, never the little finger on string 5 behind three fingers on fret 2', () => {
    const { shapes, bassMatched } = chordShapesForCapo(request('A', 'major', 'C'), 0, 0);
    expect(bassMatched).toBe(true);
    const e = shapes.find((x) => fretText(x) === 'x-3-2-2-2-0');
    expect(e).toBeDefined();
    expect(fingers(e!, 0)).toEqual([null, 2, 1, 1, 1, 0]);
    // The open A shape re-fretted (its own fingers 1 2 3 on fret 2) would need the little finger there.
    expect(shapes.filter((x) => x.shape.shortName.startsWith('A shape')).map((x) => `${fretText(x)} ${fingers(x, 0).join('')}`)).toEqual([]);
  });

  it('C5 with capo 9: a grip above the capo, strings 4 and 3 at frets 10 and 12 (C4 and G4)', () => {
    const { shapes } = chordShapesForCapo(request('C', 'power', null), 0, 9);
    expect(shapes.length).toBeGreaterThan(0);
    for (const e of shapes) {
      expect(frets(e).every((f) => f === null || (f >= 9 && f <= 15))).toBe(true);
      expect([...sounds(e)].sort((a, b) => a - b)).toEqual([0, 7]);
    }
    expect(shapes.some((e) => frets(e)[2] === 10 && frets(e)[3] === 12)).toBe(true);
  });
});
