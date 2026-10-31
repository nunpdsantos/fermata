/**
 * The Grade-5 technical set (audit W10-03): scales in 3rds / 6ths / octaves,
 * tonic arpeggios, the dominant 7th resolving to the tonic, the diminished 7th.
 *
 * Independent oracle: interval sizes and letter names come from
 * theoryOracle.ts (step patterns, one letter per degree), chord tones from
 * textbook degree formulas written here, playability from fingeringOracle.ts.
 * Exhaustive over 12 roots.
 */
import { describe, it, expect } from 'vitest';
import {
  intervalScale,
  tonicArpeggio,
  dominantSeventhArpeggio,
  diminishedSeventhArpeggio,
  techniqueNotes,
} from '../guitarTechnique';
import type { TechniqueExercise } from '../guitarTechnique';
import { preferredRootSpelling } from '../degreeSpelling';
import type { Note, ScaleType } from '../../types/music';
import { ORACLE_SCALES, spellDegree, pcOf, letterDegree } from './theoryOracle';
import { checkPlayableLine, checkDoubleStops, nameOf, OPEN } from './fingeringOracle';


const mod12 = (n: number) => ((n % 12) + 12) % 12;
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const semisOf = (d: string) => {
  const m = /^(bb|b|##|#)?(\d+)$/.exec(d)!;
  const acc = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 }[m[1] ?? ''] as number;
  return MAJOR[(Number(m[2]) - 1) % 7] + acc;
};
const lowest = (root: string) => {
  for (let m = 40; m < 52; m++) if (mod12(m) === pcOf(root)) return m;
  throw new Error('unreachable');
};
const ROOTS = (type: ScaleType) => Array.from({ length: 12 }, (_, pc) => preferredRootSpelling(pc, type));
const SCALES: ScaleType[] = ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor'];

/** Oracle scale tone i (0-based, any octave) of `type` on `root`, from the lowest tonic. */
function tone(root: string, type: ScaleType, i: number) {
  const ds = ORACLE_SCALES[type].degrees;
  const d = ds[i % 7];
  return { name: spellDegree(root, d), midi: lowest(root) + 12 * Math.floor(i / 7) + semisOf(d) };
}

/** Oracle scale tone i (0-based) from a given starting octave shift. */
function toneFrom(root: string, type: ScaleType, i: number, raise: number) {
  const t = tone(root, type, i);
  return { ...t, midi: t.midi + raise };
}

/**
 * Can a pair be stopped at all? Two strings `gap` apart whose open pitches are
 * at or below the two notes (independent of the engine).
 */
function pairPlayable(lo: number, hi: number, gaps: readonly number[]): boolean {
  return gaps.some((g) => OPEN.some((o, s) => s + g < OPEN.length && o <= lo && OPEN[s + g] <= hi));
}

/** Expected (lower, upper) pairs of an interval scale, up then down. */
function oraclePairs(root: string, type: ScaleType, steps: number, octaves: number, gaps: readonly number[]) {
  const n = 7 * octaves + 1;
  const downType = type === 'melodic_minor' ? 'natural_minor' : type;
  const build = (raise: number) => {
    const up = Array.from({ length: n }, (_, i) => [toneFrom(root, type, i, raise), toneFrom(root, type, i + steps, raise)]);
    const down = Array.from({ length: n - 1 }, (_, k) => {
      const i = n - 2 - k;
      return [toneFrom(root, downType, i, raise), toneFrom(root, downType, i + steps, raise)];
    });
    return [...up, ...down];
  };
  // From the lowest tonic unless some pair cannot be stopped there.
  const raise = build(0).every(([lo, hi]) => pairPlayable(lo.midi, hi.midi, gaps)) ? 0 : 12;
  return { pairs: build(raise), raise };
}

const KINDS = [
  { kind: 'thirds', steps: 2, gaps: [1], letters: 3, sizes: [3, 4] },
  { kind: 'sixths', steps: 5, gaps: [2], letters: 6, sizes: [8, 9] },
  { kind: 'octaves', steps: 7, gaps: [2], letters: 1, sizes: [12] },
] as const;

function checkPairs(ex: TechniqueExercise, root: Note, type: ScaleType, k: (typeof KINDS)[number], label: string) {
  const { pairs: expected, raise } = oraclePairs(nameOf(root), type, k.steps, ex.octaves, k.gaps);
  expect(ex.startMidi, `${label}: lowest playable tonic`).toBe(lowest(nameOf(root)) + raise);
  const pairs =
    ex.style === 'together'
      ? ex.events.map((e) => e.notes)
      : expected.map((_, i) => {
          const a = ex.events[2 * i].notes[0];
          const b = ex.events[2 * i + 1].notes[0];
          return a.midi < b.midi ? [a, b] : [b, a];
        });
  // Broken or together, the hand plays the same double-stop shapes.
  checkDoubleStops(pairs, label, k.gaps);
  expect(pairs.length, label).toBe(expected.length);
  pairs.forEach(([lo, hi], i) => {
    const [eLo, eHi] = expected[i];
    const where = `${label} pair #${i}`;
    expect([lo.midi, hi.midi], where).toEqual([eLo.midi, eHi.midi]);
    if (eLo.name) expect(nameOf(lo.note), where).toBe(eLo.name);
    if (eHi.name) expect(nameOf(hi.note), where).toBe(eHi.name);
    // The interval really is a 3rd / 6th / octave: by letters and by size.
    expect(letterDegree(nameOf(lo.note), nameOf(hi.note)), where).toBe(k.letters);
    expect(k.sizes as readonly number[], where).toContain(hi.midi - lo.midi);
  });
  if (ex.style === 'broken') {
    // Low note first going up, high note first coming down.
    const n = 7 * ex.octaves + 1;
    ex.events.forEach((e, j) => {
      const pair = Math.floor(j / 2);
      const first = j % 2 === 0;
      const next = ex.events[j + (first ? 1 : -1)].notes[0];
      const isLow = e.notes[0].midi < next.midi;
      expect(isLow, `${label} event #${j}`).toBe(pair < n ? first : !first);
    });
  }
}

describe('interval scales — 12 roots × 4 scale forms × 3rds/6ths/octaves × broken/together', () => {
  for (const k of KINDS) {
    for (const style of ['broken', 'together'] as const) {
      it(`${k.kind} ${style}`, () => {
        for (const type of SCALES) {
          for (const root of ROOTS(type)) {
            const label = `${nameOf(root)} ${type} ${k.kind} ${style}`;
            const ex = intervalScale(root, type, k.kind, style);
            expect(ex, label).not.toBeNull();
            checkPairs(ex!, root, type, k, label);
          }
        }
      });
    }
  }
  it('starts an octave up only where the bottom pair cannot be stopped (E, F minor 3rds/6ths)', () => {
    const raised: string[] = [];
    for (const k of KINDS) {
      for (const type of SCALES) {
        for (const root of ROOTS(type)) {
          const ex = intervalScale(root, type, k.kind, 'together')!;
          if (ex.startMidi !== lowest(nameOf(root))) raised.push(`${nameOf(root)} ${type} ${k.kind}`);
        }
      }
    }
    // E: G♯2/G2 sit below the open A; F minor: A♭2 likewise, and F melodic
    // minor's natural-minor descent ends on F2 + D♭3, below the open D.
    expect(raised.sort()).toEqual(
      ['E major', 'E natural_minor', 'E harmonic_minor', 'E melodic_minor', 'F natural_minor', 'F harmonic_minor', 'F melodic_minor']
        .flatMap((s) => [`${s} thirds`, `${s} sixths`])
        .sort(),
    );
  });
  it('broken and together play the same notes with the same fingers', () => {
    for (const k of KINDS) {
      for (const root of ROOTS('major')) {
        const t = intervalScale(root, 'major', k.kind, 'together')!;
        const b = intervalScale(root, 'major', k.kind, 'broken')!;
        const key = (n: { stringIndex: number; fret: number; finger: number }) => `${n.stringIndex}/${n.fret}/${n.finger}`;
        expect(b.events.map((e) => key(e.notes[0])).sort()).toEqual(techniqueNotes(t).map(key).sort());
      }
    }
  });
  it('is deterministic and rejects non-heptatonic scales', () => {
    const C: Note = { natural: 'C', accidental: '' };
    expect(intervalScale(C, 'major', 'sixths', 'together')).toEqual(intervalScale(C, 'major', 'sixths', 'together'));
    expect(intervalScale(C, 'pentatonic_major', 'thirds', 'broken')).toBeNull();
  });
});

// ─── Arpeggios ──────────────────────────────────────────────────────────────

const CHORD_DEGREES: Record<string, string[]> = {
  major: ['1', '3', '5'],
  minor: ['1', 'b3', '5'],
  dominant7: ['1', '3', '5', 'b7'],
  diminished7: ['1', 'b3', 'b5', 'bb7'],
};

/** Expected arpeggio line: up `octaves` from the lowest root, then the same notes down. */
function oracleArpeggio(root: string, quality: string, octaves: number) {
  const ds = CHORD_DEGREES[quality];
  const start = lowest(root);
  const up: { name: string | null; midi: number }[] = [];
  for (let o = 0; o < octaves; o++) for (const d of ds) up.push({ name: spellDegree(root, d), midi: start + 12 * o + semisOf(d) });
  up.push({ name: root, midi: start + 12 * octaves });
  return { up, all: [...up, ...[...up].reverse().slice(1)] };
}

function checkArpeggio(ex: TechniqueExercise, chordRoot: string, quality: string, label: string, extra = 0) {
  const { up, all } = oracleArpeggio(chordRoot, quality, ex.octaves);
  const notes = techniqueNotes(ex);
  expect(notes.length, label).toBe(all.length + extra);
  expect(ex.ascendingCount, label).toBe(up.length);
  all.forEach((e, i) => {
    expect(notes[i].midi, `${label} #${i}`).toBe(e.midi);
    if (e.name) expect(nameOf(notes[i].note), `${label} #${i}`).toBe(e.name);
  });
  // Chord tones are stacked thirds by letter (a 7th chord's 7th is 7 letters from the root).
  const letters = CHORD_DEGREES[quality].map((d) => Number(d.replace(/\D/g, '')));
  notes.slice(0, up.length - 1).forEach((n, i) => {
    expect(letterDegree(chordRoot, nameOf(n.note)), `${label} #${i}`).toBe(letters[i % letters.length]);
  });
  checkPlayableLine(notes, label, { maxStringStep: 1 });
  // Down the same way it went up.
  const place = (n: (typeof notes)[number]) => [n.stringIndex, n.fret, n.finger];
  const upNotes = notes.slice(0, up.length);
  const downNotes = notes.slice(up.length - 1, all.length);
  expect(downNotes.map(place), `${label}: descent reverses the ascent`).toEqual([...upNotes].reverse().map(place));
}

describe('arpeggios — 12 roots (oracle)', () => {
  it('tonic arpeggios, major and minor, 2 octaves', () => {
    for (const mode of ['major', 'minor'] as const) {
      for (const root of ROOTS(mode === 'major' ? 'major' : 'natural_minor')) {
        const ex = tonicArpeggio(root, mode);
        expect(ex, `${nameOf(root)} ${mode}`).not.toBeNull();
        expect(ex!.octaves).toBe(2);
        checkArpeggio(ex!, nameOf(root), mode, `${nameOf(root)} ${mode} arpeggio`);
      }
    }
  });

  it('dominant 7th of every key, resolving to the tonic a 4th above', () => {
    for (const mode of ['major', 'minor'] as const) {
      for (const key of ROOTS(mode === 'major' ? 'major' : 'harmonic_minor')) {
        const k = nameOf(key);
        const dominant = spellDegree(k, '5')!;
        const ex = dominantSeventhArpeggio(key, mode);
        expect(ex, `V7 in ${k} ${mode}`).not.toBeNull();
        expect(ex!.chord).toEqual({ root: { natural: dominant[0], accidental: dominant.slice(1) }, quality: 'dominant7' });
        checkArpeggio(ex!, dominant, 'dominant7', `V7 in ${k} ${mode}`, 1);
        const notes = techniqueNotes(ex!);
        const last = notes[notes.length - 1];
        // Resolution: the tonic, a perfect fourth above the lowest dominant (V → I).
        expect(nameOf(last.note)).toBe(k);
        expect(last.midi).toBe(lowest(dominant) + 5);
        expect(ex!.events[ex!.events.length - 1].degrees).toEqual([0]);
        // The leading note in the arpeggio is the raised 7th of the key (minor too).
        expect(mod12(pcOf(k) - pcOf(spellDegree(dominant, '3')!))).toBe(1);
      }
    }
  });

  it('diminished 7th on every note, spelled 1 ♭3 ♭5 𝄫7', () => {
    for (let pc = 0; pc < 12; pc++) {
      const root = preferredRootSpelling(pc, 'harmonic_minor');
      const ex = diminishedSeventhArpeggio(root);
      expect(ex, nameOf(root)).not.toBeNull();
      checkArpeggio(ex!, nameOf(root), 'diminished7', `dim7 on ${nameOf(root)}`);
      // Symmetric: every step a minor 3rd (3 semitones).
      const up = techniqueNotes(ex!).slice(0, ex!.ascendingCount);
      for (let i = 1; i < up.length; i++) expect(up[i].midi - up[i - 1].midi).toBe(3);
    }
  });

  it('every note sits on the standard-tuning neck', () => {
    const ex = tonicArpeggio({ natural: 'E', accidental: '' }, 'major')!;
    for (const n of techniqueNotes(ex)) expect(OPEN[n.stringIndex] + n.fret).toBe(n.midi);
  });
});
