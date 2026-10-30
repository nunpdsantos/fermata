/**
 * Regression gate for the L3 seventh-chord construction hint (review of W5-37):
 * a diminished 7th chord's seventh is a single diminished 7th (9 semitones),
 * never a doubly diminished 7th ("dd7", 8 semitones). Checked in EN, PT and ES.
 */
import { describe, expect, it } from 'vitest';
import { CHORD_FORMULAS } from '../../../core/constants/chords';
import templatesL3 from '../templatesL3';
import ptTemplatesL3 from '../../../i18n/content/pt/templatesL3';
import esTemplatesL3 from '../../../i18n/content/es/templatesL3';

describe('L3 seventh-chord hint names the diminished 7th correctly', () => {
  it('the engine builds the diminished 7th chord with a 9-semitone seventh', () => {
    expect(CHORD_FORMULAS.diminished7[3]).toBe(9);
  });

  it.each([
    ['en', templatesL3],
    ['pt', ptTemplatesL3],
    ['es', esTemplatesL3],
  ])('%s templates never write a doubly diminished 7th', (_lang, source) => {
    const text = JSON.stringify(source);
    expect(text).not.toMatch(/\bdd7\b|ddim/);
  });
});
