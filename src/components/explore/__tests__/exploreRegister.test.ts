import { describe, expect, it } from 'vitest';
import { exploreRegister } from '../exploreRegister';
import { buildScale, SCALE_FORMULAS } from '../../../core/constants/scales';
import { buildChord } from '../../../core/constants/chords';
import { getMidiNumber, getScaleNotesWithOctaves, chordVoicingPitches } from '../../../core/utils/pianoLayout';
import { staffPlan } from '../../../utils/notationHelpers';
import type { Note, PitchedNote, ScaleType } from '../../../core/types/music';
import { SELECTABLE_ROOTS } from '../../../core/utils/__tests__/theoryOracle';

const note = (name: string): Note => ({ natural: name[0], accidental: name.slice(1) }) as Note;
const midi = (notes: PitchedNote[]) => notes.map((n) => getMidiNumber(n, n.octave));

describe('Explore register', () => {
  it('fixes guitar at 3, retaining the default and every supplied piano preference', () => {
    expect(exploreRegister('piano').octave).toBe(4);
    expect(exploreRegister('guitar').octave).toBe(3);
    for (const octave of [1, 2, 3, 4, 5, 6]) {
      expect(exploreRegister('piano', octave).octave).toBe(octave);
      expect(exploreRegister('guitar', octave).octave).toBe(3);
    }
  });

  it('lowers the reference voicing intact, including inversions and slash bass; never revoices at 3', () => {
    const c = buildChord(note('C'), 'major').notes;
    expect(midi(exploreRegister('guitar').chordPitches(c))).toEqual([48, 52, 55]);
    expect(midi(exploreRegister('guitar').chordPitches([c[1], c[2], c[0]]))).toEqual([52, 55, 60]);
    expect(midi(exploreRegister('guitar').chordPitches(c, note('G')))).toEqual([43, 48, 52, 55]);
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
        const piano = getScaleNotesWithOctaves(scale.notes, exploreRegister('piano').octave);
        const guitar = getScaleNotesWithOctaves(scale.notes, exploreRegister('guitar').octave);
        const label = `${root} ${type}`;
        expect(staffPlan(guitar, undefined, 'guitar', true).keys, label)
          .toEqual(staffPlan(piano, undefined, 'piano', true).keys);
        expect(midi(guitar), label).toEqual(midi(piano).map((m) => m - 12));
        expect(staffPlan(guitar, undefined, 'guitar', true).annotation, label).toBe('8vb');
      }
    }
  });
});
