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
import { buildChord, CHORD_FORMULAS, CHORD_SYMBOLS } from '../chords';
import { chordBelowCapo, chordShapesForCapo, getChordShapesWithFallback, gripLeavesOut, isPlayableChordShape } from '../guitarChordShapes';
import { chordFromParsed, parseChordSymbol } from '../../utils/chordParser';
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
/** Counts of this code, measured (a recording, not a truth): see the report line with GRIP_SWEEP_REPORT=1. */
const GRIPS_AT_LEAST = 479_000; // 479,724 at the second review's fix
const UNMUTABLE_LEFT = 40; // grips with a muted string no finger reaches, all in lists with no other kind
const THIN_FIRST = 116; // power chords whose every fuller grip sounds the outside bass twice
const RECORD = process.env.RECORD_GRIP_SWEEP === '1';
const REMAINDER_ABOUT = 'A RECORDING of this code (RECORD_GRIP_SWEEP=1), not a proof the grips are right: what is left after music audit 2 — root-position requests with no grip that has the root lowest, first grips that still leave a named tone out (and say so), and the bass notices by quality and asked bass. Every one is unavoidable within a hand\'s four frets (the search\'s window); a five-fret stretch finds some, on purpose not offered (second review of builder K). Outside basses as Quick Search builds them (the parser puts the bass among the notes).';

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
  capoMoved: string[];
  capoKept: number;
  capoNothingFits: number;
  typed: number;
  typedFallback: string[];
  barreAhead: string[];
  unmutable: number;
  unmutableWithKeeper: string[];
  thinFirst: string[];
  bassNoticeByClass: Record<string, number>;
}
const sweep: Sweep = { requests: 0, grips: 0, straightBarre: [], firstMissesBass: [], otherBass: [], noGrip: [], rootNoRootBass: [], namedSilent: [], namedSaid: [], wholeAfterLeft: [], altWithout: [], twice: [], capoMoved: [], capoKept: 0, capoNothingFits: 0, typed: 0, typedFallback: [], barreAhead: [], unmutable: 0, unmutableWithKeeper: [], thinFirst: [], bassNoticeByClass: {} };

/**
 * A slash chord with a bass outside the chord, as a learner gets it: typed in
 * Quick Search or opened from a link, the parser puts that bass among the
 * notes (`chordFromParsed`); the second review found the two requests differ
 * in 1,879 first grips. The symbol is the app's own suffix (`CHORD_SYMBOLS`),
 * kept only where it reads back as the same chord.
 */
function typedRequest(root: string, quality: string, bass: string) {
  const parsed = parseChordSymbol(`${root}${CHORD_SYMBOLS[quality as ChordQuality] ?? ''}/${bass}`);
  if (!parsed) return null;
  const chord = chordFromParsed(parsed);
  // Read back as the same notes: "C7#5" is the parser's augmented 7th, the
  // same four tones as dominant7sharp5, and that is what the learner gets.
  const want = new Set(buildChord(N(root), quality as ChordQuality).notes.map(pcOf));
  const got = new Set(chord.notes.map(pcOf));
  got.delete(pcOf(N(bass)));
  want.delete(pcOf(N(bass)));
  return pcOf(chord.root) === pcOf(N(root)) && got.size === want.size && [...want].every((pc) => got.has(pc)) ? chord : null;
}

/** An inner muted string with no stopped string beside it (stopped: above the capo). */
const unmutableAt = (f: (number | null)[], capo: number) => {
  const on = f.flatMap((x, i) => (x === null ? [] : [i]));
  const stopped = (i: number) => i >= 0 && i < 6 && f[i] !== null && f[i]! > capo;
  for (let s = on[0] + 1; s < on[on.length - 1]; s++) if (f[s] === null && !stopped(s - 1) && !stopped(s + 1)) return true;
  return false;
};

beforeAll(() => {
  for (const [rootPc, root] of ROOTS.entries()) {
    for (const quality of Object.keys(CHORD_FORMULAS)) {
      const chord = buildChord(N(root), quality as ChordQuality);
      const asks = [
        ...chord.notes.map((n, i) => ({ inversion: i, bass: null as string | null, bassPc: pcOf(n), cls: `${quality}|inv${i}` })),
        ...ROOTS.map((b, bassPc) => ({ inversion: 0, bass: b, bassPc, cls: `${quality}|/${(bassPc - rootPc + 12) % 12}` })),
      ];
      const tones = new Set(chord.notes.map(pcOf));
      for (let capo = 0; capo <= 9; capo++) {
        // The library's C- and G-shape barres of the shape chord, moved up to
        // the capo: rule 1 read from the frets, not from any name.
        const library = getChordShapesWithFallback(chordBelowCapo(chord, capo)).map((e) => ({
          barre: /^(C|G)-shape Barre$/.test(e.shape.name),
          frets: e.shape.strings.map((p) => (p.fret === null ? null : e.baseFret + p.fret + capo)),
        }));
        for (const ask of asks) {
          sweep.requests++;
          let request: typeof chord = ask.bass ? { ...chord, bassNote: N(ask.bass) } : chord;
          if (ask.bass && !tones.has(ask.bassPc)) {
            const typed = typedRequest(root, quality, ask.bass);
            if (typed) { request = typed; sweep.typed++; } else sweep.typedFallback.push(`${root}${quality}/${ask.bass}`);
          }
          const key = `${root} ${quality} capo ${capo} ${ask.bass ? `/${ask.bass}` : `inversion ${ask.inversion}`}`;
          const { shapes, bassMatched } = chordShapesForCapo(request, ask.inversion, capo);
          if (shapes.length === 0) { sweep.noGrip.push(key); continue; }
          // Review item 2: a capo changes where the first grip sits, never
          // which it is — the first of the shape chord's own list at the nut
          // that fits above the capo, moved up; only where none fits (or none
          // there has the bass) is the neck above the capo asked again.
          if (capo > 0) {
            const nut = chordShapesForCapo(chordBelowCapo(request, capo), ask.inversion, 0);
            const fits = nut.shapes.map((e) => ({ shape: e.shape, baseFret: e.baseFret + capo })).filter((e) => isPlayableChordShape(e, 15, capo));
            if (nut.bassMatched && fits.length > 0) {
              sweep.capoKept++;
              if (text(fits[0]) !== text(shapes[0])) sweep.capoMoved.push(`${key}: ${text(shapes[0])}, at the nut ${text(fits[0])}`);
            } else sweep.capoNothingFits++;
          }
          if (!bassMatched) {
            sweep.bassNoticeByClass[ask.cls] = (sweep.bassNoticeByClass[ask.cls] ?? 0) + 1;
            if (!ask.bass && ask.inversion === 0) sweep.rootNoRootBass.push(key);
          }
          // Rule 1 as the second review counted it: by the PRINTED name, which a
          // grip given a bass keeps as its start ("G-shape Barre / A") — a check
          // on the code's `madeFrom` from a second source; and, for a grip that
          // is the library barre itself, by its frets alone. Leaving aside a grip
          // that is an earlier one with strings muted, which rule 8 puts after
          // every other grip, barres included.
          const mutedFrom = (b: (number | null)[], a: (number | null)[]) => b.some((x, i) => x === null && a[i] !== null) && b.every((x, i) => x === null || x === a[i]);
          const kind = shapes.map((e, i) => {
            const f = frets(e);
            if (shapes.slice(0, i).some((a) => mutedFrom(f, frets(a)))) return 'reduced';
            const named = /^(C|G)-shape Barre( \/ |$)/.test(e.shape.name);
            const itself = library.some((l) => l.barre && l.frets.join() === f.join());
            return named || itself ? 'barre' : 'other';
          });
          const firstBarre = kind.indexOf('barre');
          if (firstBarre >= 0 && kind.slice(firstBarre + 1).includes('other')) sweep.barreAhead.push(`${key}: ${shapes.map(text).join(' ')}`);
          // The hand rule for muted strings (second review, item 3).
          const unm = shapes.map((e) => unmutableAt(frets(e), capo));
          sweep.unmutable += unm.filter(Boolean).length;
          if (unm.some(Boolean) && unm.some((u) => !u)) sweep.unmutableWithKeeper.push(`${key}: ${shapes.filter((_, i) => unm[i]).map(text).join(' ')}`);
          const sounding = (e: Placed) => e.shape.strings.filter((p) => p.fret !== null).length;
          if (sounding(shapes[0]) <= 3 && shapes.some((e) => sounding(e) >= 4)) sweep.thinFirst.push(`${key}: ${text(shapes[0])}`);
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
      typed: sweep.typed, typedFallback: sweep.typedFallback.length, barreAhead: sweep.barreAhead.length,
      unmutable: sweep.unmutable, unmutableWithKeeper: sweep.unmutableWithKeeper.length, thinFirst: sweep.thinFirst.length,
      capoKept: sweep.capoKept, capoNothingFits: sweep.capoNothingFits, capoMoved: sweep.capoMoved.length,
    }));
    if (process.env.GRIP_SWEEP_EXAMPLES === '1') console.log('GRIP EXAMPLES', JSON.stringify({ fallback: [...new Set(sweep.typedFallback.map((k) => k.replace(/^[A-G][#b]?/, '').replace(/\/.*$/, '')))], barreAhead: sweep.barreAhead.slice(0, 6), thinFirst: sweep.thinFirst.filter((k) => !/ power capo /.test(k)).slice(0, 10), thinNotPower: sweep.thinFirst.filter((k) => !/ power capo /.test(k)).length }, null, 1));
  }
  if (RECORD) {
    writeFileSync(FIXTURE, JSON.stringify({ about: REMAINDER_ABOUT, rootNoRootBass: sweep.rootNoRootBass, namedSaid: sweep.namedSaid, bassNoticeByClass: sweep.bassNoticeByClass }, null, 1) + '\n');
  }
}, 900_000);

describe('the audit\'s space, swept (music audit 2, M36 M42 M43 M44 M45)', () => {
  const remainder = RECORD ? null : JSON.parse(readFileSync(FIXTURE, 'utf8'));

  it('walks the audit\'s 101,040 requests', () => {
    expect(sweep.requests).toBe(12 * Object.keys(CHORD_FORMULAS).length * 10 * 12 + 12 * 10 * Object.values(CHORD_FORMULAS).reduce((a, f) => a + f.length, 0));
    expect(sweep.requests).toBe(101_040);
    // Since the second review: just under the actual.
    expect(sweep.grips).toBeGreaterThan(GRIPS_AT_LEAST);
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
  it('M43: where no grip within a hand\'s four frets has the root lowest in root position, these, one by one (the board says nothing of a bass there: item 6)', () => {
    if (RECORD) return;
    expect(sweep.rootNoRootBass).toEqual(remainder.rootNoRootBass);
  });
  it('M44: a grip that leaves out a tone its name carries always says which', () => {
    expect(sweep.namedSilent).toEqual([]);
  });
  it('M44: the first grips (root position) that still leave one out within a hand\'s four frets, and say so: these, one by one', () => {
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
  it('the outside-bass slash half as Quick Search builds it: the parser puts the bass among the notes (45,840 requests)', () => {
    expect(sweep.typedFallback).toEqual([]);
    expect(sweep.typed).toBe(45_840);
  });
  it('order rule 1 from the frets alone: no grip plainly made from a C- or G-shape barre comes before one plainly not', () => {
    expect(sweep.barreAhead).toEqual([]);
  });
  it('no grip with a muted string no finger can reach is offered beside one a hand can strum', () => {
    expect(sweep.unmutableWithKeeper).toEqual([]);
    expect(sweep.unmutable).toBe(UNMUTABLE_LEFT);
  });
  it('three strings first while a fuller grip is offered: only where every fuller grip doubles an outside bass', () => {
    expect(sweep.thinFirst.every((k) => / power capo /.test(k))).toBe(true);
    expect(sweep.thinFirst).toHaveLength(THIN_FIRST);
  });
  it('review item 2: a capo never changes which grip comes first, only where it sits', () => {
    expect(sweep.capoMoved).toEqual([]);
    // 90,936 requests with a capo: in 86,681 the shape chord's first grip at
    // the nut that fits above the capo is the first; in the rest none fits
    // (or none at the nut has the bass) and the neck above the capo is asked.
    expect(sweep.capoKept + sweep.capoNothingFits).toBe(90_936);
    expect(sweep.capoKept).toBe(86_681);
  });
  it('a 7alt grip sounds at least one of its alterations (♭9 ♯9 ♯11 ♭13)', () => {
    expect(sweep.altWithout).toEqual([]);
  });
  it('the bass notice ("No shape here has X in the bass"), by chord quality and asked bass: none avoidable within a hand\'s four frets', () => {
    if (RECORD) return;
    expect(sweep.bassNoticeByClass).toEqual(remainder.bassNoticeByClass);
  });
});
