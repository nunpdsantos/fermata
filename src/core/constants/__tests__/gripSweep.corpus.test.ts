/**
 * Music audit 2 (18 November 2026), the Explore guitar's grips, swept over
 * the audit's own space (evidence/explore-guitar/audit-grips.mjs): 12 roots ×
 * every chord quality × every inversion and every one of the 12 slash basses
 * × capo 0–9, as `chordShapesForCapo` hands them to the board. Its flags are
 * re-derived here, independently of the app: pitches from standard tuning,
 * the bass the lowest PITCH, the tones a chord is named for from the audit's
 * own table.
 *
 *   measured by this file at 153caab (GRIP_SWEEP_REPORT=1)        → now
 *   M36 a finger straight across a lower-fretted string:  0 grips   → 0
 *       (cured in release 16)
 *   M42 a first grip called matched without the asked bass, in
 *       inversion and slash requests: 0                             → 0
 *       (cured in release 16)
 *   M43 a grip offered for an asked bass with another note lowest,
 *       in inversion and slash requests: 154,682 grips (the audit's
 *       script: 33,267 requests with mixed lists)                  → 0
 *   M43 root position, a grip with another note lowest: 780 first
 *       grips and 6,170 others                                     → 0;
 *       where no grip has the root lowest the board says so (the
 *       remainder, listed one by one in the fixture)
 *   M44 a grip that leaves out a tone its name carries and says
 *       nothing: 35,474 grips over every request (the audit, root
 *       position only: 194 first grips, 1,648 others)               → 0;
 *       those that still leave one out say which (`gripLeavesOut`);
 *       the first grips among them, at root position, are listed
 *   M45 a request with no grip at all: 9,122                        → 0
 *   (382,235 grips offered at 153caab; fewer now, since M43 offers only
 *   grips with the asked bass when one has it)
 *
 * The fixture (fixtures/grip-sweep-remainder.json) lists what is left one by
 * one, or by class where it is a notice the audit counts as no fault
 * ("a disclaimer alone is not evidence of a wrong note"): re-record it with
 * RECORD_GRIP_SWEEP=1 after a deliberate change, and say why in the commit.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildChord, CHORD_FORMULAS } from '../chords';
import { chordShapesForCapo, gripLeavesOut } from '../guitarChordShapes';
import type { ChordShape } from '../guitarChordShapes';
import type { ChordQuality, Note } from '../../types/music';

type Placed = { shape: ChordShape; baseFret: number };
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const OPEN = [40, 45, 50, 55, 59, 64];
const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (n: Note) => (LETTER[n.natural] + [...n.accidental].reduce((a, c) => a + (c === '#' ? 1 : -1), 0) + 24) % 12;
const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
/** The audit's table: the offsets above the root a chord is named for. */
const NAMED: Record<string, number[]> = {
  power: [7], sus2sus4: [2, 5], dominant9: [2], major9: [2], minor9: [2],
  dominant11: [5], major11: [5], minor11: [5], dominant13: [9], major13: [9], minor13: [9],
  dominant13flat9: [9, 1], dominant9sharp11: [2, 6], major9sharp11: [2, 6], dominant9sus4: [2, 5],
};
const FIXTURE = resolve(process.cwd(), 'src/core/constants/__tests__/fixtures/grip-sweep-remainder.json');
const RECORD = process.env.RECORD_GRIP_SWEEP === '1';

const frets = (e: Placed) => e.shape.strings.map((p) => (p.fret === null ? null : e.baseFret + p.fret));
const text = (e: Placed) => frets(e).map((f) => f ?? 'x').join('-');

interface Sweep {
  requests: number;
  grips: number;
  straightBarre: string[];
  firstMissesBass: string[];
  otherBass: string[];
  noGrip: string[];
  rootNoRootBass: string[];
  namedSilent: string[];
  namedSaid: string[];
  wholeAfterLeft: string[];
  altWithout: string[];
  twice: string[];
  bassNoticeByClass: Record<string, number>;
}
const sweep: Sweep = { requests: 0, grips: 0, straightBarre: [], firstMissesBass: [], otherBass: [], noGrip: [], rootNoRootBass: [], namedSilent: [], namedSaid: [], wholeAfterLeft: [], altWithout: [], twice: [], bassNoticeByClass: {} };

beforeAll(() => {
  for (const [rootPc, root] of ROOTS.entries()) {
    for (const quality of Object.keys(CHORD_FORMULAS)) {
      const chord = buildChord(N(root), quality as ChordQuality);
      const asks = [
        ...chord.notes.map((n, i) => ({ inversion: i, bass: null as string | null, bassPc: pcOf(n), cls: `${quality}|inv${i}` })),
        ...ROOTS.map((b, bassPc) => ({ inversion: 0, bass: b, bassPc, cls: `${quality}|/${(bassPc - rootPc + 12) % 12}` })),
      ];
      for (let capo = 0; capo <= 9; capo++) {
        for (const ask of asks) {
          sweep.requests++;
          const request = ask.bass ? { ...chord, bassNote: N(ask.bass) } : chord;
          const key = `${root} ${quality} capo ${capo} ${ask.bass ? `/${ask.bass}` : `inversion ${ask.inversion}`}`;
          const { shapes, bassMatched } = chordShapesForCapo(request, ask.inversion, capo);
          if (shapes.length === 0) { sweep.noGrip.push(key); continue; }
          if (!bassMatched) {
            sweep.bassNoticeByClass[ask.cls] = (sweep.bassNoticeByClass[ask.cls] ?? 0) + 1;
            if (!ask.bass && ask.inversion === 0) sweep.rootNoRootBass.push(key);
          }
          let leftSeen = false;
          const seen = new Set<string>();
          for (const [index, e] of shapes.entries()) {
            sweep.grips++;
            if (seen.has(text(e))) sweep.twice.push(`${key}: ${text(e)}`);
            seen.add(text(e));
            const f = frets(e);
            const fingers = e.shape.strings.map((p, s) => (f[s] === null ? null : f[s] === capo ? 0 : p.finger === 'bar' ? 1 : p.finger));
            const midis = f.flatMap((x, s) => (x === null ? [] : [OPEN[s] + x]));
            const pcs = new Set(midis.map((m) => m % 12));
            const lowest = Math.min(...midis) % 12;
            for (let lo = 0; lo < 6; lo++) {
              for (let hi = lo + 1; hi < 6; hi++) {
                if (f[lo] === null || f[hi] === null || !fingers[lo] || fingers[hi] !== fingers[lo] || f[lo] !== f[hi]) continue;
                for (let j = lo + 1; j < hi; j++) if (f[j] !== null && f[j]! < f[lo]!) sweep.straightBarre.push(`${key}: ${text(e)}`);
              }
            }
            if (bassMatched && lowest !== ask.bassPc) (index === 0 ? sweep.firstMissesBass : sweep.otherBass).push(`${key}: ${text(e)}`);
            // Root position only, as the audit counts it (an inversion or a
            // slash bass may take the place of a named tone's string: then it
            // too must say so, checked here for every request).
            if (quality === 'dominant7alt' && ![1, 3, 6, 8].some((d) => pcs.has((rootPc + d) % 12))) sweep.altWithout.push(`${key}: ${text(e)}`);
            const missing = (NAMED[quality] ?? []).filter((d) => !pcs.has((rootPc + d) % 12));
            if (missing.length) leftSeen = true;
            else if (leftSeen) sweep.wholeAfterLeft.push(`${key}: ${text(e)}`);
            if (missing.length) {
              const said = gripLeavesOut(e, request).map(pcOf);
              if (missing.some((d) => !said.includes((rootPc + d) % 12))) sweep.namedSilent.push(`${key}: ${text(e)}`);
              else if (index === 0 && !ask.bass && ask.inversion === 0) sweep.namedSaid.push(`${key}: ${text(e)}`);
            }
          }
        }
      }
    }
  }
  if (process.env.GRIP_SWEEP_REPORT === '1') {
    const rootOther = sweep.otherBass.filter((k) => / inversion 0: /.test(k)).length;
    const rootFirst = sweep.firstMissesBass.filter((k) => / inversion 0: /.test(k)).length;
    const requestsOther = new Set(sweep.otherBass.map((k) => k.split(':')[0])).size;
    console.log('GRIP SWEEP', JSON.stringify({
      requests: sweep.requests, grips: sweep.grips, straightBarre: sweep.straightBarre.length,
      firstMissesBass: sweep.firstMissesBass.length - rootFirst, rootFirstNotRoot: rootFirst,
      otherBass: sweep.otherBass.length - rootOther, otherBassRequests: requestsOther, rootOtherNotRoot: rootOther,
      noGrip: sweep.noGrip.length, rootNoRootBass: sweep.rootNoRootBass.length,
      namedSilent: sweep.namedSilent.length, namedSaid: sweep.namedSaid.length,
      bassNotices: Object.values(sweep.bassNoticeByClass).reduce((a, n) => a + n, 0),
    }));
  }
  if (RECORD) {
    writeFileSync(FIXTURE, JSON.stringify({ rootNoRootBass: sweep.rootNoRootBass, namedSaid: sweep.namedSaid, bassNoticeByClass: sweep.bassNoticeByClass }, null, 1) + '\n');
  }
}, 900_000);

describe('the audit\'s space, swept (music audit 2, M36 M42 M43 M44 M45)', () => {
  const remainder = RECORD ? null : JSON.parse(readFileSync(FIXTURE, 'utf8'));

  it('walks the audit\'s 101,040 requests', () => {
    expect(sweep.requests).toBe(12 * Object.keys(CHORD_FORMULAS).length * 10 * 12 + 12 * 10 * Object.values(CHORD_FORMULAS).reduce((a, f) => a + f.length, 0));
    expect(sweep.requests).toBe(101_040);
    expect(sweep.grips).toBeGreaterThan(200_000);
  });
  it('M36: no finger lies straight across a lower-fretted sounding string', () => {
    expect(sweep.straightBarre).toEqual([]);
  });
  it('M42: a first grip called matched has the asked bass lowest', () => {
    expect(sweep.firstMissesBass).toEqual([]);
  });
  it('M43: no grip offered for an asked bass has another note lowest — root position included', () => {
    expect(sweep.otherBass).toEqual([]);
  });
  it('M43: where no grip has the root lowest in root position, the board says so: these, one by one', () => {
    if (RECORD) return;
    expect(sweep.rootNoRootBass).toEqual(remainder.rootNoRootBass);
  });
  it('M44: a grip that leaves out a tone its name carries always says which', () => {
    expect(sweep.namedSilent).toEqual([]);
  });
  it('M44: the first grips (root position) that still leave one out, and say so: these, one by one', () => {
    if (RECORD) return;
    expect(sweep.namedSaid).toEqual(remainder.namedSaid);
  });
  it('M45: every request has a grip', () => {
    expect(sweep.noGrip).toEqual([]);
  });
  it('review item 3: no list holds one grip twice', () => {
    expect(sweep.twice).toEqual([]);
  });
  it('review item 4: a grip that leaves a named tone out never comes before one that sounds them all', () => {
    expect(sweep.wholeAfterLeft).toEqual([]);
  });
  it('a 7alt grip sounds at least one of its alterations (♭9 ♯9 ♯11 ♭13)', () => {
    expect(sweep.altWithout).toEqual([]);
  });
  it('the bass notice ("No shape here has X in the bass"), by chord quality and asked bass', () => {
    if (RECORD) return;
    expect(sweep.bassNoticeByClass).toEqual(remainder.bassNoticeByClass);
  });
});
