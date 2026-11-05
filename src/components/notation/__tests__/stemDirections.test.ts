import { describe, expect, it } from 'vitest';
import { staffStemDirections, staffInkBounds } from '../../../utils/notationHelpers';
import type { PitchedNote } from '../../../core/types/music';
const n = (natural: PitchedNote['natural'], octave = 4): PitchedNote => ({ natural, accidental: '', octave });
describe('standard stem directions', () => {
  it('uses middle B in treble and middle D in bass', () => {
    expect(staffStemDirections([n('A'), n('B'), n('C', 5)], 'treble')).toEqual([1, -1, -1]);
    expect(staffStemDirections([n('C', 3), n('D', 3), n('E', 3)], 'bass')).toEqual([1, -1, -1]);
  });
  it('middle-line notes follow nearest non-middle neighbours, alone down', () => {
    expect(staffStemDirections([n('A'), n('B'), n('B')], 'treble')).toEqual([1, 1, 1]);
    expect(staffStemDirections([n('B'), n('B'), n('C', 5)], 'treble')).toEqual([-1, -1, -1]);
    expect(staffStemDirections([n('B')], 'treble')).toEqual([-1]);
  });
  it('a chord follows its furthest extreme, ties down, independent of order', () => {
    expect(staffStemDirections([n('C'), n('C', 5)], 'treble', true)).toEqual([1, 1]);
    expect(staffStemDirections([n('G', 5), n('E')], 'treble', true)).toEqual([-1, -1]);
    expect(staffStemDirections([n('C', 5), n('A')], 'treble', true)).toEqual([-1, -1]);
  });
  it('includes ink below a solitary middle-line note', () => {
    expect(staffInkBounds([n('D', 3)], 'bass', { duration: 'q' }).bottom).toBeGreaterThanOrEqual(96);
  });
});
