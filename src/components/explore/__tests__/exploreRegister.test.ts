import { describe, expect, it } from 'vitest';
import { exploreRegister } from '../exploreRegister';
import { buildScale, SCALE_FORMULAS } from '../../../core/constants/scales';
import { buildChord } from '../../../core/constants/chords';
import { getMidiNumber, getScaleNotesWithOctaves, chordVoicingPitches, octaveFitsKeyboard } from '../../../core/utils/pianoLayout';
import { registerClef, staffPlan } from '../../../utils/notationHelpers';
import type { Note, PitchedNote, ScaleType } from '../../../core/types/music';
import { SELECTABLE_ROOTS } from '../../../core/utils/__tests__/theoryOracle';

const note = (name: string): Note => ({ natural: name[0], accidental: name.slice(1) }) as Note;
const midi = (notes: PitchedNote[]) => notes.map((n) => getMidiNumber(n, n.octave));

describe('Explore register', () => {
  it('fixes guitar at 3, retaining the default and every supplied piano preference', () => {
    expect(exploreRegister('piano', 4).octave).toBe(4);
    expect(exploreRegister('guitar', 4).octave).toBe(3);
    for (const octave of [1, 2, 3, 4, 5, 6]) {
      expect(exploreRegister('piano', octave).octave).toBe(octave);
      expect(exploreRegister('guitar', octave).octave).toBe(3);
    }
  });

  it('lowers the reference voicing intact, including inversions and slash bass; never revoices at 3', () => {
    const c = buildChord(note('C'), 'major').notes;
    expect(midi(exploreRegister('guitar', 4).chordPitches(c))).toEqual([48, 52, 55]);
    expect(midi(exploreRegister('guitar', 4).chordPitches([c[1], c[2], c[0]]))).toEqual([52, 55, 60]);
    expect(midi(exploreRegister('guitar', 4).chordPitches(c, note('G')))).toEqual([43, 48, 52, 55]);
    for (const octave of [1, 3, 4, 5]) {
      expect(exploreRegister('piano', octave).chordPitches(c, note('G')))
        .toEqual(chordVoicingPitches(c, octave, note('G')));
    }
    expect(c.every((n) => !('octave' in n))).toBe(true);
  });

  it('every selectable root × all scales: identical written keys, sounding exactly 12 semitones lower', () => {
    for (const root of [...SELECTABLE_ROOTS, 'Cb', 'B#']) {
      for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
        const scale = buildScale(note(root), type);
        const piano = getScaleNotesWithOctaves(scale.notes, exploreRegister('piano', 4).octave);
        const guitar = getScaleNotesWithOctaves(scale.notes, exploreRegister('guitar', 4).octave);
        const label = `${root} ${type}`;
        expect(staffPlan(guitar, undefined, 'guitar', true).keys, label)
          .toEqual(staffPlan(piano, undefined, 'piano', true).keys);
        expect(midi(guitar), label).toEqual(midi(piano).map((m) => m - 12));
        expect(staffPlan(guitar, undefined, 'guitar', true).annotation, label).toBe('8vb');
      }
    }
  });

  // Audit M59 (19 November 2026): the piano's staves follow its octave, in
  // the clef that register needs (`registerClef`).
  it('every selectable root × all scales at octave 4 (the default; the only register drawn before): plain treble, as before', () => {
    for (const root of [...SELECTABLE_ROOTS, 'Cb', 'B#']) {
      for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
        const plan = staffPlan(getScaleNotesWithOctaves(buildScale(note(root), type).notes, exploreRegister('piano', 4).octave), undefined, 'piano', true);
        expect([plan.clef, plan.annotation], `${root} ${type}`).toEqual(['treble', undefined]);
      }
    }
  });

  it('C major from C1 to C7: the clef and the written notes', () => {
    const c = buildScale(note('C'), 'major').notes;
    const plans = [1, 2, 3, 4, 5, 6, 7].map((o) => staffPlan(getScaleNotesWithOctaves(c, exploreRegister('piano', o).octave), undefined, 'piano', true));
    expect(plans.map((p) => `${p.clef}${p.annotation ? ` ${p.annotation}` : ''}: ${p.keys[0]}–${p.keys[7]}`)).toEqual([
      'bass 8vb: c/2–c/3', // sounds C1–C2, written an octave up
      'bass: c/2–c/3',
      'bass: c/3–c/4',
      'treble: c/4–c/5',
      'treble: c/5–c/6',
      'treble 8va: c/5–c/6', // sounds C6–C7, written an octave down
      'treble 8va: c/6–c/7',
    ]);
  });

  it('every root × all scales × every octave the piano offers: the most ledger lines, octave by octave, are exactly 3 at C0, 2 from C1 to C5, 5 at C6 and C7 (VexFlow has no 15ma clef)', () => {
    const most: Record<number, number> = {};
    for (const root of [...SELECTABLE_ROOTS, 'Cb', 'B#']) {
      for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
        const scale = buildScale(note(root), type).notes;
        for (let octave = 0; octave <= 7; octave++) {
          if (!octaveFitsKeyboard(scale, octave)) continue;
          const plan = staffPlan(getScaleNotesWithOctaves(scale, exploreRegister('piano', octave).octave), undefined, 'piano', true);
          // From VexFlow's keys ('b#/3'): the letter and the octave it is written in.
          const steps = plan.keys.map((k) => Number(k.split('/')[1]) * 7 + 'cdefgab'.indexOf(k[0]));
          // Staff lines as diatonic steps: treble E4 … F5, bass G2 … A3.
          const [bottom, top] = plan.clef === 'treble' ? [4 * 7 + 2, 5 * 7 + 3] : [2 * 7 + 4, 3 * 7 + 5];
          const ledgers = Math.max(Math.floor((bottom - Math.min(...steps)) / 2), Math.floor((Math.max(...steps) - top) / 2), 0);
          most[octave] = Math.max(most[octave] ?? 0, ledgers);
        }
      }
    }
    expect(most).toEqual({ 0: 3, 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 5, 7: 5 });
  });

  it('a tie between the clefs takes the treble; fewer ledger lines take the bass', () => {
    const pitch = (name: string, octave: number) => ({ ...note(name), octave });
    // C/E as written at C4: E3 C4 E4 G4 — three ledger lines either way.
    expect(registerClef([pitch('E', 3), pitch('C', 4), pitch('E', 4), pitch('G', 4)])).toEqual({ clef: 'treble' });
    // C3 G3 E4 (C major at C3): four below the treble, two above the bass.
    expect(registerClef([pitch('C', 3), pitch('G', 3), pitch('E', 4)])).toEqual({ clef: 'bass' });
    expect(registerClef([])).toEqual({ clef: 'treble' });
  });
});
