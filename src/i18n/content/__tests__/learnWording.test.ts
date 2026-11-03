import { it, expect } from 'vitest';
import { overlayStrings } from './overlayStrings';
import { L3_UNITS } from '../../../core/constants/curriculumL3';
import { L4_UNITS } from '../../../core/constants/curriculumL4';

it('seventh chords have root position and three inversions, in all languages', () => {
  expect(JSON.stringify([L3_UNITS, L4_UNITS])).not.toMatch(/four inversions/i);
  const wrong = overlayStrings().filter((s) => /quatro inversões|cuatro inversiones/.test(s.text));
  expect(wrong).toEqual([]);
});
it('listening instructions avoid literal emotional translations', () => {
  const wrong = overlayStrings().filter((s) => /agridoce e anelante|tensas y reptantes/.test(s.text));
  expect(wrong).toEqual([]);
});
