import { describe, it, expect } from 'vitest';
import { getScaleDegreeFunctionKey, buildScale } from '../scales';
import type { ScaleType } from '../../types/music';
import { scaleDegreeLabels } from '../../utils/degreeSpelling';

// Degree labels now come from the one spelling engine (read from each spelled
// note); these expectations are unchanged from the old semitone table.
const labelsOf = (type: ScaleType) => {
  const scale = buildScale({ natural: 'C', accidental: '' }, type);
  return scaleDegreeLabels(scale.root, scale.notes);
};

describe('scale degree labels (scaleDegreeLabels)', () => {
  it('major scale labels every degree with natural interval names', () => {
    const labels = labelsOf('major');
    expect(labels).toEqual(['R', '2', '3', '4', '5', '6', '7']);
  });

  it('natural minor labels the 6th as b6 and the 7th as b7 (not #5, not m7)', () => {
    const labels = labelsOf('natural_minor');
    expect(labels).toEqual(['R', '2', 'b3', '4', '5', 'b6', 'b7']);
  });

  it('harmonic minor labels the 6th as b6 and keeps the 7 as 7', () => {
    const labels = labelsOf('harmonic_minor');
    expect(labels).toEqual(['R', '2', 'b3', '4', '5', 'b6', '7']);
  });

  it('phrygian correctly labels degree 2 as b2 and degree 6 as b6', () => {
    const labels = labelsOf('phrygian');
    expect(labels).toEqual(['R', 'b2', 'b3', '4', '5', 'b6', 'b7']);
  });

  it('locrian labels degree 5 as b5 (not dim5)', () => {
    const labels = labelsOf('locrian');
    expect(labels).toEqual(['R', 'b2', 'b3', '4', 'b5', 'b6', 'b7']);
  });

  it('lydian labels the 4th as #4 (tritone at degree 4)', () => {
    const labels = labelsOf('lydian');
    expect(labels).toEqual(['R', '2', '3', '#4', '5', '6', '7']);
  });

  it('labels non-7-note scales by their spelled degrees', () => {
    // pentatonic major = [0, 2, 4, 7, 9] (5 notes)
    const labels = labelsOf('pentatonic_major');
    expect(labels).toEqual(['R', '2', '3', '5', '6']);
  });
});

describe('getScaleDegreeFunctionKey', () => {
  it('returns canonical function names for the 7 degrees', () => {
    expect(getScaleDegreeFunctionKey(0, 0)).toBe('degreeShort.tonic');
    expect(getScaleDegreeFunctionKey(1, 2)).toBe('degreeShort.supertonic');
    expect(getScaleDegreeFunctionKey(2, 4)).toBe('degreeShort.mediant');
    expect(getScaleDegreeFunctionKey(3, 5)).toBe('degreeShort.subdominant');
    expect(getScaleDegreeFunctionKey(4, 7)).toBe('degreeShort.dominant');
    expect(getScaleDegreeFunctionKey(5, 9)).toBe('degreeShort.submediant');
  });

  it('mediant is returned regardless of major (3) or minor (b3) third', () => {
    expect(getScaleDegreeFunctionKey(2, 3)).toBe('degreeShort.mediant');
    expect(getScaleDegreeFunctionKey(2, 4)).toBe('degreeShort.mediant');
  });

  it('submediant is returned regardless of major (6) or minor (b6) sixth', () => {
    // The bug: previously #5 at degree 6 was labeled "Aug 5th" instead of Submediant.
    expect(getScaleDegreeFunctionKey(5, 8)).toBe('degreeShort.submediant');
    expect(getScaleDegreeFunctionKey(5, 9)).toBe('degreeShort.submediant');
  });

  it('degree 7 is leading tone at 11 semitones, subtonic at 10', () => {
    expect(getScaleDegreeFunctionKey(6, 11)).toBe('degreeShort.leading');
    expect(getScaleDegreeFunctionKey(6, 10)).toBe('degreeShort.subtonic');
  });

  it('degree 5 at 6 semitones (Locrian) is tritone, not dominant', () => {
    expect(getScaleDegreeFunctionKey(4, 6)).toBe('degreeShort.tritone');
    expect(getScaleDegreeFunctionKey(4, 7)).toBe('degreeShort.dominant');
  });
});
