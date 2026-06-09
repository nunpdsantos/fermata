import { describe, it, expect } from 'vitest';
import {
  translateScaleType,
  translateChordQuality,
  translateDirection,
} from '../musicTerms';

describe('translateScaleType', () => {
  it('returns space-separated English for en', () => {
    expect(translateScaleType('natural_minor', 'en')).toBe('natural minor');
    expect(translateScaleType('major', 'en')).toBe('major');
    expect(translateScaleType('diminished_half_whole', 'en')).toBe('diminished half whole');
  });

  it('returns Portuguese for pt', () => {
    expect(translateScaleType('major', 'pt')).toBe('maior');
    expect(translateScaleType('natural_minor', 'pt')).toBe('menor natural');
    expect(translateScaleType('harmonic_minor', 'pt')).toBe('menor harmónica');
    expect(translateScaleType('dorian', 'pt')).toBe('dórico');
    expect(translateScaleType('pentatonic_major', 'pt')).toBe('pentatónica maior');
    expect(translateScaleType('blues', 'pt')).toBe('blues');
  });

  it('returns Spanish for es', () => {
    expect(translateScaleType('major', 'es')).toBe('mayor');
    expect(translateScaleType('natural_minor', 'es')).toBe('menor natural');
    expect(translateScaleType('harmonic_minor', 'es')).toBe('menor armónica');
    expect(translateScaleType('phrygian', 'es')).toBe('frigio');
    expect(translateScaleType('whole_tone', 'es')).toBe('tonos enteros');
  });

  it('falls back to space-separated key for unknown terms', () => {
    expect(translateScaleType('unknown_scale', 'pt')).toBe('unknown scale');
    expect(translateScaleType('unknown_scale', 'es')).toBe('unknown scale');
  });
});

describe('translateChordQuality', () => {
  it('returns space-separated English for en', () => {
    expect(translateChordQuality('half_diminished7', 'en')).toBe('half diminished7');
    expect(translateChordQuality('major', 'en')).toBe('major');
  });

  it('returns Portuguese for pt', () => {
    expect(translateChordQuality('major', 'pt')).toBe('maior');
    expect(translateChordQuality('minor', 'pt')).toBe('menor');
    // dominant7/diminished7 follow the root in templates ('um acorde de Dó
    // {quality}'), so they must read 'de sétima ...' to stay grammatical.
    expect(translateChordQuality('dominant7', 'pt')).toBe('de sétima da dominante');
    expect(translateChordQuality('diminished7', 'pt')).toBe('de sétima diminuta');
    expect(translateChordQuality('half_diminished7', 'pt')).toBe('meio-diminuto');
    expect(translateChordQuality('augmented', 'pt')).toBe('aumentado');
  });

  it('returns Spanish for es', () => {
    expect(translateChordQuality('major', 'es')).toBe('mayor');
    expect(translateChordQuality('diminished', 'es')).toBe('disminuido');
    expect(translateChordQuality('dominant7', 'es')).toBe('de séptima de dominante');
    expect(translateChordQuality('diminished7', 'es')).toBe('de séptima disminuida');
    expect(translateChordQuality('half_diminished7', 'es')).toBe('semidisminuido');
  });

  it('falls back for unknown qualities', () => {
    expect(translateChordQuality('mystery_chord', 'pt')).toBe('mystery chord');
  });
});

describe('translateDirection', () => {
  it('returns English for en', () => {
    expect(translateDirection('ascending', 'en')).toBe('ascending');
    expect(translateDirection('descending', 'en')).toBe('descending');
  });

  it('returns Portuguese for pt', () => {
    expect(translateDirection('ascending', 'pt')).toBe('ascendente');
    expect(translateDirection('descending', 'pt')).toBe('descendente');
  });

  it('returns Spanish for es', () => {
    expect(translateDirection('ascending', 'es')).toBe('ascendente');
    expect(translateDirection('descending', 'es')).toBe('descendente');
  });
});
