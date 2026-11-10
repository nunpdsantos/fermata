/**
 * Scale positions with a capo (wave 2, stream C). The promise: a capo on fret
 * c is a new nut, so the positions with it EQUAL the positions of the same
 * scale on a neck tuned c half steps higher, drawn c frets up — the Open
 * position starts at the capo, nothing is ever behind it, and a position
 * keeps the numeral of the real fret under the index finger.
 *
 * The raised neck is built here independently (each open string's MIDI + c,
 * named by the piano's own midiToNote), never from the capo code.
 */
import { describe, expect, it } from 'vitest';
import {
  capoPositions,
  getGuitarPosition,
  positionForCapo,
  suggestGuitarPosition,
  tuningOpenMidi,
  GUITAR_MAX_FRET,
  OPEN_POSITION,
  POSITION_NUMBERS,
  type GuitarPosition,
} from '../guitarPositions';
import { GUITAR_TUNINGS, type GuitarTuning } from '../../constants/guitarTunings';
import { SCALE_FORMULAS } from '../../constants/scales';
import { midiToNote } from '../pianoLayout';
import type { Note, ScaleType } from '../../types/music';

const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({ natural, accidental });
const ROOTS: Note[] = [N('C'), N('C', '#'), N('D'), N('E', 'b'), N('E'), N('F'), N('F', '#'), N('G'), N('A', 'b'), N('A'), N('B', 'b'), N('B')];
const CAPOS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** The same strings, each tuned `c` half steps higher (an independent build). */
function raisedTuning(tuning: GuitarTuning, c: number): GuitarTuning {
  return {
    id: `${tuning.id}+${c}`,
    name: `${tuning.name} +${c}`,
    shortName: tuning.shortName,
    strings: tuning.strings.map((s) => midiToNote(12 * (s.octave + 1) + ({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[s.natural]) + (s.accidental === '#' ? 1 : s.accidental === 'b' ? -1 : 0) + c)),
  };
}

/** A raised-neck position drawn `c` frets up, named by its real fret. */
function drawnUp(p: GuitarPosition, c: number, n: number): GuitarPosition {
  return {
    ...p,
    position: n,
    windowStart: p.windowStart + c,
    windowEnd: p.windowEnd + c,
    notes: p.notes.map((x) => ({ ...x, fret: x.fret + c })),
  };
}

describe('the raised-neck oracle is built right', () => {
  it('each string of the raised neck sounds c half steps higher', () => {
    for (const tuning of GUITAR_TUNINGS) {
      for (const c of CAPOS) {
        expect(tuningOpenMidi(raisedTuning(tuning, c))).toEqual(tuningOpenMidi(tuning).map((m) => m + c));
      }
    }
  });
});

describe('positions with a capo = the positions of a neck tuned that many half steps higher', () => {
  it('every tuning, every capo 1–9, every root, major / natural minor / pentatonics / blues, every position offered', () => {
    const types: ScaleType[] = ['major', 'natural_minor', 'harmonic_minor', 'pentatonic_major', 'pentatonic_minor', 'blues'];
    let compared = 0;
    for (const tuning of GUITAR_TUNINGS) {
      for (const c of CAPOS) {
        const raised = raisedTuning(tuning, c);
        for (const root of ROOTS) {
          for (const type of types) {
            for (const n of capoPositions(c)) {
              const expected = drawnUp(getGuitarPosition(root, type, n === OPEN_POSITION ? 0 : n - c, raised, GUITAR_MAX_FRET - c), c, n);
              expect(getGuitarPosition(root, type, n, tuning, GUITAR_MAX_FRET, c), `${tuning.id} capo ${c} ${root.natural}${root.accidental} ${type} pos ${n}`).toEqual(expected);
              compared++;
            }
          }
        }
      }
    }
    expect(compared).toBeGreaterThan(20_000);
  });

  it('every one of the 37 scales on C, standard tuning, every capo', () => {
    const standard = GUITAR_TUNINGS[0];
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      for (const c of CAPOS) {
        const raised = raisedTuning(standard, c);
        for (const n of capoPositions(c)) {
          const expected = drawnUp(getGuitarPosition(N('C'), type, n === OPEN_POSITION ? 0 : n - c, raised, GUITAR_MAX_FRET - c), c, n);
          expect(getGuitarPosition(N('C'), type, n, standard, GUITAR_MAX_FRET, c), `${type} capo ${c} pos ${n}`).toEqual(expected);
        }
      }
    }
  });
});

describe('what the capo changes about the offered positions', () => {
  it('Open (at the capo) and every position above the capo; nothing that needs a fret behind it', () => {
    expect(capoPositions(0)).toEqual([...POSITION_NUMBERS]);
    expect(capoPositions(3)).toEqual([0, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(capoPositions(9)).toEqual([0, 10, 11, 12]);
    for (const c of CAPOS) {
      for (const n of capoPositions(c)) {
        const pos = getGuitarPosition(N('G'), 'major', n, GUITAR_TUNINGS[0], GUITAR_MAX_FRET, c);
        for (const note of pos.notes) expect(note.fret, `capo ${c} pos ${n}`).toBeGreaterThanOrEqual(c);
        for (const note of pos.notes) expect(note.fret).toBeLessThanOrEqual(GUITAR_MAX_FRET);
        // The numeral stays the real fret under the index finger.
        if (n !== OPEN_POSITION) expect(pos.windowStart).toBe(n);
      }
    }
  });

  it('the Open position starts at the capo: its strings at fret c, its frets above', () => {
    const pos = getGuitarPosition(N('B', 'b'), 'major', OPEN_POSITION, GUITAR_TUNINGS[0], GUITAR_MAX_FRET, 3);
    expect(pos.position).toBe(OPEN_POSITION);
    expect(pos.windowStart).toBe(4);
    expect(pos.windowEnd).toBe(7);
    const atCapo = pos.notes.filter((x) => x.fret === 3);
    expect(atCapo.length).toBe(6);
    expect(atCapo.every((x) => x.finger === 0)).toBe(true);
    // The same hand as the open position of G major.
    const g = getGuitarPosition(N('G'), 'major', OPEN_POSITION);
    expect(pos.notes.map((x) => [x.stringIndex, x.fret - 3, x.finger, x.degreeLabel])).toEqual(g.notes.map((x) => [x.stringIndex, x.fret, x.finger, x.degreeLabel]));
  });

  it('a position behind the capo shows the Open position (at the capo)', () => {
    expect(positionForCapo(2, 3)).toBe(OPEN_POSITION);
    expect(positionForCapo(3, 3)).toBe(OPEN_POSITION);
    expect(positionForCapo(4, 3)).toBe(4);
    expect(positionForCapo(2, 0)).toBe(2);
    expect(getGuitarPosition(N('C'), 'major', 2, GUITAR_TUNINGS[0], GUITAR_MAX_FRET, 3)).toEqual(getGuitarPosition(N('C'), 'major', OPEN_POSITION, GUITAR_TUNINGS[0], GUITAR_MAX_FRET, 3));
  });

  it('the suggested position is one offered above the capo', () => {
    for (const c of CAPOS) for (const root of ROOTS) {
      expect(capoPositions(c)).toContain(suggestGuitarPosition(root, 'major', GUITAR_TUNINGS[0], c));
    }
    // B♭ major with a capo on 3 starts in the Open position, at the capo.
    expect(suggestGuitarPosition(N('B', 'b'), 'major', GUITAR_TUNINGS[0], 3)).toBe(OPEN_POSITION);
  });

  it('no capo: exactly the positions as before', () => {
    for (const root of ROOTS) for (const n of POSITION_NUMBERS) {
      expect(getGuitarPosition(root, 'major', n, GUITAR_TUNINGS[0], GUITAR_MAX_FRET, 0)).toEqual(getGuitarPosition(root, 'major', n));
    }
    for (const root of ROOTS) expect(suggestGuitarPosition(root, 'dorian', GUITAR_TUNINGS[0], 0)).toBe(suggestGuitarPosition(root, 'dorian'));
  });
});
