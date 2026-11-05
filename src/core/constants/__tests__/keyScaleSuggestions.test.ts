import { expect, it } from 'vitest';
import { buildScale } from '../scales';
import { buildChord, CHORD_FORMULAS } from '../chords';
import { getPitchClass } from '../notes';
import { getKeyScaleSuggestions, getScaleSuggestions } from '../chordScaleRelationships';
import { stringToNote, type ScaleType, type ChordQuality } from '../../types/music';
const cases: [string, ScaleType, (ScaleType | null)[]][] = [
  ['C', 'major', ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'natural_minor', 'locrian']],
  ['A', 'natural_minor', ['natural_minor', 'locrian', 'major', 'dorian', 'phrygian', 'lydian', 'mixolydian']],
  ['A', 'harmonic_minor', ['harmonic_minor', null, null, null, 'phrygian_dominant', null, null]],
  ['D', 'dorian', ['dorian', 'phrygian', 'lydian', 'mixolydian', 'natural_minor', 'locrian', 'major']],
];
for (const [root, type, modes] of cases) {
  for (const size of [3, 4]) {
    it(`${root} ${type}: all seven ${size === 3 ? 'triads' : 'sevenths'} put the named key mode first, once`, () => {
      const key = buildScale(stringToNote(root), type);
      key.notes.forEach((note, degree) => {
        const pcs = Array.from({ length: size }, (_, j) => (getPitchClass(key.notes[(degree + 2 * j) % 7]) - getPitchClass(note) + 12) % 12);
        const quality = (Object.keys(CHORD_FORMULAS) as ChordQuality[]).find((q) => JSON.stringify(CHORD_FORMULAS[q]) === JSON.stringify(pcs));
        expect(quality).toBeDefined();
        const chord = buildChord(note, quality!);
        const list = getKeyScaleSuggestions(chord, key);
        const mode = modes[degree];
        if (mode) {
          expect(list[0]).toMatchObject({ scale: mode, fit: 'primary', keyNotes: true });
          expect(list.filter((s) => s.scale === mode)).toHaveLength(1);
          expect(new Set(buildScale(note, mode).notes.map(getPitchClass))).toEqual(new Set(key.notes.map(getPitchClass)));
        } else expect(list).toEqual(getScaleSuggestions(quality!));
      });
    });
  }
}
it('E major in C major keeps exactly the existing quality list', () => {
  expect(getKeyScaleSuggestions(buildChord(stringToNote('E'), 'major'), buildScale(stringToNote('C'), 'major'))).toEqual(getScaleSuggestions('major'));
});
