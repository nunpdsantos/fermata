/**
 * Fingered scale routes (audit W10-03, W10-09).
 *
 * Every assertion is checked against an INDEPENDENT oracle: string pitches are
 * hard-coded MIDI numbers, notes are spelled one letter per degree by
 * theoryOracle.ts (no engine imports), the lowest tonic and the octave span
 * are computed here, and the playability rules (one finger per fret while the
 * hand stays put, five-fret span, guided shifts) are re-derived from the note
 * list itself — never read back from the engine's own segment bookkeeping.
 *
 * Scope: 12 roots × every heptatonic scale × 2 octaves × both open-string
 * styles; 3 octaves wherever the neck allows; standard tuning.
 */
import { describe, it, expect } from 'vitest';
import {
  getScaleRoute,
  fullRoute,
  maxScaleOctaves,
  lowestTonicMidi,
  ROUTE_SCALE_TYPES,
  EXAM_SCALE_TYPES,
} from '../scaleRoutes';
import type { ScaleRoute, ScaleRouteNote } from '../scaleRoutes';
import { preferredRootSpelling } from '../degreeSpelling';
import type { Note, ScaleType } from '../../types/music';
import { ORACLE_SCALES, spellDegree, pcOf, LETTER_PC, ACC_OFFSET } from './theoryOracle';
import { checkPlayableLine, OPEN, MAX_FRET, nameOf } from './fingeringOracle';

// ─── Oracle ─────────────────────────────────────────────────────────────────

const mod12 = (n: number) => ((n % 12) + 12) % 12;
const MAJOR = [0, 2, 4, 5, 7, 9, 11];

function degreeSemis(d: string): number {
  const m = /^(bb|b|##|#)?(\d)$/.exec(d)!;
  return MAJOR[Number(m[2]) - 1] + ACC_OFFSET[m[1] ?? ''];
}

function oracleLowestTonic(root: string): number {
  for (let m = 40; m < 52; m++) if (mod12(m) === pcOf(root)) return m;
  throw new Error('unreachable');
}

/** Expected ascending line: [name or null (beyond 𝄪/𝄫), midi]. */
function oracleLine(root: string, type: ScaleType, octaves: number): { name: string | null; midi: number; pc: number }[] {
  const degrees = ORACLE_SCALES[type].degrees;
  const start = oracleLowestTonic(root);
  const out: { name: string | null; midi: number; pc: number }[] = [];
  for (let o = 0; o < octaves; o++) {
    for (const d of degrees) {
      const midi = start + 12 * o + degreeSemis(d);
      out.push({ name: spellDegree(root, d), midi, pc: mod12(midi) });
    }
  }
  out.push({ name: root, midi: start + 12 * octaves, pc: pcOf(root) });
  return out;
}

const ROOTS = (type: ScaleType) => Array.from({ length: 12 }, (_, pc) => preferredRootSpelling(pc, type));

function checkSpelling(notes: readonly ScaleRouteNote[], expected: ReturnType<typeof oracleLine>, label: string): void {
  expect(notes.map((n) => n.midi), label).toEqual(expected.map((e) => e.midi));
  notes.forEach((n, i) => {
    const e = expected[i];
    if (e.name !== null) expect(nameOf(n.note), `${label} #${i}`).toBe(e.name);
    // The spelled note always sounds the right pitch class.
    expect(mod12(LETTER_PC[n.note.natural] + ACC_OFFSET[n.note.accidental]), `${label} #${i}`).toBe(e.pc);
    // App PitchedNote octave convention: MIDI = 12 + 12·octave + pc.
    expect(12 + 12 * n.pitched.octave + e.pc, `${label} #${i} octave`).toBe(n.midi);
  });
}

function checkRoute(route: ScaleRoute, root: Note, type: ScaleType, octaves: number, label: string): void {
  const r = nameOf(root);
  const up = oracleLine(r, type, octaves);
  checkSpelling(route.ascending, up, `${label} up`);
  // Reaches the stated octaves, from the lowest tonic on the guitar.
  expect(route.ascending.length).toBe(7 * octaves + 1);
  expect(route.ascending[0].midi).toBe(oracleLowestTonic(r));
  expect(route.ascending[route.ascending.length - 1].midi - route.ascending[0].midi).toBe(12 * octaves);
  expect(route.ascending[0].isTonic && route.ascending[route.ascending.length - 1].isTonic).toBe(true);
  checkPlayableLine(route.ascending, `${label} up`);
  checkPlayableLine(route.descending, `${label} down`);
  checkPlayableLine(fullRoute(route), `${label} up+down`);

  const top = route.ascending[route.ascending.length - 1];
  const place = (n: ScaleRouteNote) => [n.stringIndex, n.fret, n.finger];
  expect(place(route.descending[0]), `${label}: descent starts on the top note, same finger`).toEqual(place(top));
  if (type === 'melodic_minor') {
    // Raised 6th and 7th going up, natural minor coming down (W10-09).
    expect(route.descendingScaleType).toBe('natural_minor');
    const down = [...oracleLine(r, 'natural_minor', octaves)].reverse();
    checkSpelling(route.descending, down, `${label} down`);
    const bottom = route.descending[route.descending.length - 1];
    expect([bottom.stringIndex, bottom.fret]).toEqual([route.ascending[0].stringIndex, route.ascending[0].fret]);
  } else {
    // Everything else comes down the way it went up.
    expect(route.descendingScaleType).toBe(type);
    expect(route.descending.map(place)).toEqual([...route.ascending].reverse().map(place));
  }
}

// ─── Exhaustive suites ──────────────────────────────────────────────────────

describe('scale routes — exam scales, 12 roots, 2 octaves (oracle)', () => {
  for (const type of EXAM_SCALE_TYPES) {
    for (const style of ['low-positions', 'avoid'] as const) {
      it(`${type} (${style})`, () => {
        for (const root of ROOTS(type)) {
          const route = getScaleRoute(root, type, { octaves: 2, openStrings: style });
          expect(route, `${nameOf(root)} ${type}`).not.toBeNull();
          checkRoute(route!, root, type, 2, `${nameOf(root)} ${type} ${style}`);
          // Spelling never needs to fall back for these keys.
          expect(oracleLine(nameOf(root), type, 2).every((e) => e.name !== null)).toBe(true);
        }
      });
    }
  }
});

describe('scale routes — every heptatonic scale, 12 roots, 2 octaves', () => {
  it('lists the heptatonic scales (one letter per degree) and nothing else', () => {
    expect(ROUTE_SCALE_TYPES).toContain('major');
    expect(ROUTE_SCALE_TYPES).toContain('melodic_minor');
    expect(ROUTE_SCALE_TYPES).toContain('dorian');
    for (const t of ['pentatonic_major', 'blues', 'whole_tone', 'chromatic', 'bebop_major', 'diminished_half_whole'] as ScaleType[]) {
      expect(ROUTE_SCALE_TYPES).not.toContain(t);
      expect(getScaleRoute({ natural: 'C', accidental: '' }, t)).toBeNull();
    }
    for (const t of ROUTE_SCALE_TYPES) expect(ORACLE_SCALES[t].degrees.length).toBe(7);
  });
  for (const type of ROUTE_SCALE_TYPES.filter((t) => !EXAM_SCALE_TYPES.includes(t))) {
    it(type, () => {
      for (const root of ROOTS(type)) {
        const route = getScaleRoute(root, type, { octaves: 2 });
        expect(route, `${nameOf(root)} ${type}`).not.toBeNull();
        checkRoute(route!, root, type, 2, `${nameOf(root)} ${type}`);
      }
    });
  }
});

describe('scale routes — three octaves where the neck allows', () => {
  it('the 15-fret neck holds three octaves from E, F, F♯ and G only', () => {
    const three = Array.from({ length: 12 }, (_, pc) => pc).filter(
      (pc) => maxScaleOctaves(preferredRootSpelling(pc, 'major')) >= 3,
    );
    // Oracle: lowest tonic + 36 must not pass the 1st string's 15th fret (G5 = 79).
    const expected = Array.from({ length: 12 }, (_, pc) => pc).filter((pc) => {
      const low = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51].find((m) => mod12(m) === pc)!;
      return low + 36 <= 64 + MAX_FRET;
    });
    expect(three).toEqual(expected);
    expect(three).toEqual([4, 5, 6, 7]);
  });
  for (const type of EXAM_SCALE_TYPES) {
    it(`${type}: 3 octaves where possible, null elsewhere`, () => {
      for (const root of ROOTS(type)) {
        const route = getScaleRoute(root, type, { octaves: 3 });
        if (oracleLowestTonic(nameOf(root)) + 36 > 64 + MAX_FRET) {
          expect(route, `${nameOf(root)} ${type}`).toBeNull();
          continue;
        }
        expect(route, `${nameOf(root)} ${type}`).not.toBeNull();
        checkRoute(route!, root, type, 3, `${nameOf(root)} ${type} 3oct`);
      }
    });
  }
  it('a 19-fret neck allows three octaves from A (A2–A5)', () => {
    const A = { natural: 'A' as const, accidental: '' as const };
    expect(getScaleRoute(A, 'major', { octaves: 3 })).toBeNull();
    const wide = getScaleRoute(A, 'major', { octaves: 3, maxFret: 19 });
    expect(wide).not.toBeNull();
    expect(wide!.ascending[wide!.ascending.length - 1].midi).toBe(45 + 36);
  });
});

describe('scale routes — open strings and determinism', () => {
  it('default style: an open string off the tonic only in position I (or before the hand is placed)', () => {
    for (const type of EXAM_SCALE_TYPES) {
      for (const root of ROOTS(type)) {
        const route = getScaleRoute(root, type)!;
        for (const n of fullRoute(route)) {
          if (n.fret !== 0 || n.isTonic) continue;
          expect(n.position === null || n.position <= 1, `${nameOf(root)} ${type} open ${nameOf(n.note)} in ${n.position}`).toBe(true);
        }
      }
    }
  });
  it("'avoid' style: open strings only where no fretted place reaches the pitch", () => {
    for (const type of EXAM_SCALE_TYPES) {
      for (const root of ROOTS(type)) {
        const route = getScaleRoute(root, type, { openStrings: 'avoid' })!;
        for (const n of fullRoute(route)) {
          if (n.fret !== 0) continue;
          const fretted = OPEN.some((o) => n.midi - o >= 1 && n.midi - o <= MAX_FRET);
          expect(fretted, `${nameOf(root)} ${type}: open ${nameOf(n.note)} although it can be fretted`).toBe(false);
        }
      }
    }
  });
  it('is deterministic', () => {
    for (const type of EXAM_SCALE_TYPES) {
      for (const root of ROOTS(type)) {
        expect(getScaleRoute(root, type)).toEqual(getScaleRoute(root, type));
      }
    }
  });
  it('lowest tonic: E2…D♯3 in standard tuning', () => {
    for (const pc of Array.from({ length: 12 }, (_, i) => i)) {
      const root = preferredRootSpelling(pc, 'major');
      expect(lowestTonicMidi(root)).toBe(oracleLowestTonic(nameOf(root)));
    }
  });
});

// ─── Golden routes (hand-checked; see the W10 report) ───────────────────────

const golden = (route: ScaleRoute | null) =>
  route!.ascending.map((n) => `${6 - n.stringIndex}-${n.fret}/${n.finger}`).join(' ');

describe('scale routes — hand-checked references (suggested fingerings)', () => {
  const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({ natural, accidental });
  it('C major, 2 octaves', () => {
    expect(golden(getScaleRoute(N('C'), 'major'))).toBe(
      '5-3/3 4-0/0 4-2/2 4-3/3 3-0/0 3-2/2 2-0/0 2-1/1 2-3/3 1-0/0 1-1/1 1-3/3 1-5/1 1-7/3 1-8/4',
    );
    expect(golden(getScaleRoute(N('C'), 'major', { openStrings: 'avoid' }))).toBe(
      '5-3/2 5-5/4 4-2/1 4-3/2 4-5/4 3-2/1 3-4/3 3-5/1 3-7/3 2-5/1 2-6/2 2-8/4 1-5/1 1-7/3 1-8/4',
    );
  });
  it('G major, 2 octaves from the 6th string', () => {
    const route = getScaleRoute(N('G'), 'major')!;
    expect(route.ascending[0].stringIndex).toBe(0);
    expect(golden(route)).toBe('6-3/3 5-0/0 5-2/2 5-3/3 4-0/0 4-2/2 4-4/4 3-0/0 3-2/2 2-0/0 2-1/1 2-3/3 1-0/0 1-2/2 1-3/3');
    expect(golden(getScaleRoute(N('G'), 'major', { openStrings: 'avoid' }))).toBe(
      '6-3/2 6-5/4 5-2/1 5-3/2 5-5/4 4-2/1 4-4/3 4-5/4 3-2/1 3-4/3 3-5/4 2-3/2 2-5/4 1-2/1 1-3/2',
    );
  });
  it('A melodic minor, 2 octaves', () => {
    const route = getScaleRoute(N('A'), 'melodic_minor')!;
    expect(golden(route)).toBe('5-0/0 5-2/2 5-3/3 4-0/0 4-2/2 4-4/4 3-1/1 3-2/2 2-0/0 2-1/1 2-3/3 1-0/0 1-2/1 1-4/3 1-5/4');
    expect(route.descending.map((n) => `${6 - n.stringIndex}-${n.fret}/${n.finger}`).join(' ')).toBe(
      '1-5/4 1-3/2 1-1/1 1-0/0 2-3/3 2-1/1 2-0/0 3-2/2 3-0/0 4-3/3 4-2/2 4-0/0 5-3/3 5-2/2 5-0/0',
    );
  });
  it('E major, 3 octaves', () => {
    expect(golden(getScaleRoute(N('E'), 'major', { octaves: 3 }))).toBe(
      '6-0/0 6-2/2 6-4/4 5-0/0 5-2/2 5-4/4 4-1/1 4-2/2 4-4/4 3-1/1 3-2/2 2-0/0 2-2/2 2-4/4 1-0/0 1-2/2 1-4/4 1-5/1 1-7/3 1-9/1 1-11/3 1-12/4',
    );
    expect(golden(getScaleRoute(N('E'), 'major', { octaves: 3, openStrings: 'avoid' }))).toBe(
      '6-0/0 6-2/1 6-4/3 6-5/4 5-2/1 5-4/3 5-6/3 5-7/4 4-4/1 4-6/3 4-7/4 3-4/1 3-6/3 2-4/1 2-5/2 2-7/4 1-4/1 1-5/2 1-7/4 1-9/1 1-11/3 1-12/4',
    );
  });
});
