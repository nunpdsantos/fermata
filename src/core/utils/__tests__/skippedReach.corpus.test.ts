/**
 * Music audit 2 (18 November 2026), M46: the scale-position notice
 * undercounted the pitches a position cannot reach ("one note" where D major,
 * Drop D, position XII skips F♯3 and G3; 16,375 such diagrams over five
 * tunings). The notice is now built from `skippedReach`, which names every
 * skipped pitch with its octave and the nearest position that plays them.
 *
 * Swept over the audit's own space (evidence/explore-guitar/
 * audit-scale-positions.mjs): 12 roots × every scale × the seven tunings ×
 * capo 0–9 × every position offered. The missing pitches are worked out here
 * as the audit's script does, from the open strings' MIDI numbers, never from
 * the app: every scale pitch between the window's lowest and highest note
 * that no dot plays.
 */
import { describe, expect, it } from 'vitest';
import { SCALE_FORMULAS } from '../../constants/scales';
import { GUITAR_TUNINGS } from '../../constants/guitarTunings';
import type { Note, ScaleType } from '../../types/music';
import { capoPositions, getGuitarPosition, GUITAR_MAX_FRET } from '../guitarPositions';
import { skippedReach } from '../guitarPositionReach';

const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const TUNING_MIDI: Record<string, number[]> = {
  standard: [40, 45, 50, 55, 59, 64], 'drop-d': [38, 45, 50, 55, 59, 64], 'd-g': [38, 43, 50, 55, 59, 64],
  'half-step-down': [39, 44, 49, 54, 58, 63], 'open-g': [38, 43, 50, 55, 59, 62], 'open-d': [38, 45, 50, 54, 57, 62], dadgad: [38, 45, 50, 55, 57, 62],
};
const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
/** MIDI of a spelled note in an octave, read from its letter: B♯3 = 60, C♭4 = 59. */
const midiOf = (n: Note, octave: number) => 12 * (octave + 1) + LETTER[n.natural] + [...n.accidental].reduce((a, c) => a + (c === '#' ? 1 : -1), 0);

describe('M46: the notice names every pitch a position skips, and a position that plays them', () => {
  it('the audit\'s 264,180 positions', () => {
    const tally: Record<number, number> = {};
    const wrong: string[] = [];
    const nowhere: string[] = [];
    const allApart: string[] = [];
    let positions = 0;
    for (const [r, root] of ROOTS.entries()) {
      for (const [scale, formula] of Object.entries(SCALE_FORMULAS)) {
        const included = new Set(formula.map((i) => (r + i) % 12));
        for (const tuning of GUITAR_TUNINGS) {
          const open = TUNING_MIDI[tuning.id];
          for (let capo = 0; capo <= 9; capo++) {
            for (const position of capoPositions(capo)) {
              positions++;
              const frame = getGuitarPosition(N(root), scale as ScaleType, position, tuning, GUITAR_MAX_FRET, capo);
              const played = new Set(frame.notes.map((n) => n.midi));
              const lo = Math.min(...open) + (position === 0 ? capo : position);
              const hi = Math.max(...open) + Math.min(15, position === 0 ? capo + 4 : position + 3);
              const actual: number[] = [];
              for (let m = lo; m <= hi; m++) if (included.has(m % 12) && !played.has(m)) actual.push(m);
              tally[actual.length] = (tally[actual.length] ?? 0) + 1;
              const where = `${root} ${scale} ${tuning.id} capo ${capo} position ${position}`;
              const reach = skippedReach(N(root), scale as ScaleType, position, tuning, capo);
              const named = reach.notes.map((x) => midiOf(x.note, x.octave));
              if (String(named) !== String(actual) || reach.notes.some((x) => x.midi !== midiOf(x.note, x.octave))) {
                wrong.push(`${where}: missing ${actual}, named ${named}`);
              }
              if (actual.length === 0) {
                if (reach.playedIn !== null) wrong.push(`${where}: nothing missing, yet a position is named`);
                continue;
              }
              const plays = (p: number, midis: number[]) => {
                const there = new Set(getGuitarPosition(N(root), scale as ScaleType, p, tuning, GUITAR_MAX_FRET, capo).notes.map((n) => n.midi));
                return capoPositions(capo).includes(p) && p !== frame.position && midis.every((m) => there.has(m));
              };
              if (reach.playedIn !== null) {
                if (!plays(reach.playedIn, actual)) wrong.push(`${where}: position ${reach.playedIn} does not play ${actual}`);
                continue;
              }
              // No one position has them all: each pitch says where it is.
              allApart.push(where);
              for (const x of reach.notes) {
                if (x.playedIn === null) nowhere.push(`${where}: ${x.midi}`);
                else if (!plays(x.playedIn, [x.midi])) wrong.push(`${where}: position ${x.playedIn} does not play ${x.midi}`);
              }
            }
          }
        }
      }
    }
    expect(positions).toBe(264_180);
    // The audit's counts, unchanged (the positions are the same): the notice is what changed.
    expect(tally).toEqual({ 0: 103_755, 1: 144_050, 2: 16_375 });
    expect(wrong).toEqual([]);
    // Every skipped pitch is played by some other position the capo leaves.
    expect(nowhere).toEqual([]);
    // 485 positions (all with a capo on 7, 8 or 9) have no one position for
    // both pitches: their notice names a position per pitch.
    expect(allApart).toHaveLength(485);
    expect(allApart.every((w) => / capo [789] /.test(w))).toBe(true);
  }, 300_000);

  it('D major, Drop D, position XII: F♯3 and G3', () => {
    const dropD = GUITAR_TUNINGS.find((t) => t.id === 'drop-d')!;
    const reach = skippedReach(N('D'), 'major', 12, dropD, 0);
    expect(reach.notes.map((x) => `${x.note.natural}${x.note.accidental}${x.octave}`)).toEqual(['F#3', 'G3']);
    expect(reach.playedIn).not.toBeNull();
  });
});
