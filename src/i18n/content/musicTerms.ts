/**
 * Music term dictionary — translates domain-specific strings used in exercise
 * templates (scaleType, chord quality, direction) to target languages.
 *
 * English falls through to the raw key with underscores replaced by spaces.
 * PT/ES provide proper musical terminology.
 */
import type { ContentLanguage, MusicTermDictionary } from './types';

const pt: MusicTermDictionary = {
  scaleTypes: {
    major: 'maior',
    natural_minor: 'menor natural',
    harmonic_minor: 'menor harmónica',
    melodic_minor: 'menor melódica',
    dorian: 'dórico',
    phrygian: 'frígio',
    lydian: 'lídio',
    mixolydian: 'mixolídio',
    locrian: 'lócrio',
    pentatonic_major: 'pentatónica maior',
    pentatonic_minor: 'pentatónica menor',
    blues: 'blues',
    whole_tone: 'tons inteiros',
    chromatic: 'cromática',
    altered: 'alterada',
    diminished_half_whole: 'diminuta (meio-tom/tom)',
  },
  chordQualities: {
    major: 'maior',
    minor: 'menor',
    diminished: 'diminuto',
    augmented: 'aumentado',
    major7: 'maior com 7.ª M',
    minor7: 'menor com 7.ª',
    // Interpolated after the root ('um acorde de Dó {quality}'), so these read
    // 'um acorde de Dó de sétima da dominante' — standard PT terminology.
    dominant7: 'de sétima da dominante',
    half_diminished7: 'meio-diminuto',
    diminished7: 'de sétima diminuta',
    major9: 'maior com 9.ª',
    minor9: 'menor com 9.ª',
  },
  directions: {
    ascending: 'ascendente',
    descending: 'descendente',
  },
};

const es: MusicTermDictionary = {
  scaleTypes: {
    major: 'mayor',
    natural_minor: 'menor natural',
    harmonic_minor: 'menor armónica',
    melodic_minor: 'menor melódica',
    dorian: 'dórico',
    phrygian: 'frigio',
    lydian: 'lidio',
    mixolydian: 'mixolidio',
    locrian: 'locrio',
    pentatonic_major: 'pentatónica mayor',
    pentatonic_minor: 'pentatónica menor',
    blues: 'blues',
    whole_tone: 'tonos enteros',
    chromatic: 'cromática',
    altered: 'alterada',
    diminished_half_whole: 'disminuida (semitono/tono)',
  },
  chordQualities: {
    major: 'mayor',
    minor: 'menor',
    diminished: 'disminuido',
    augmented: 'aumentado',
    major7: 'mayor con 7.ª M',
    minor7: 'menor con 7.ª',
    // Interpolado tras la fundamental ('un acorde de Do {quality}'), así que se
    // lee 'un acorde de Do de séptima de dominante' — terminología estándar.
    dominant7: 'de séptima de dominante',
    half_diminished7: 'semidisminuido',
    diminished7: 'de séptima disminuida',
    major9: 'mayor con 9.ª',
    minor9: 'menor con 9.ª',
  },
  directions: {
    ascending: 'ascendente',
    descending: 'descendente',
  },
};

const DICTIONARIES: Record<string, MusicTermDictionary> = { pt, es };

/** Translate a scale type key to the target language. EN falls through. */
export function translateScaleType(key: string, lang: ContentLanguage): string {
  if (lang === 'en') return key.replace(/_/g, ' ');
  return DICTIONARIES[lang]?.scaleTypes[key] ?? key.replace(/_/g, ' ');
}

/** Translate a chord quality key to the target language. EN falls through. */
export function translateChordQuality(key: string, lang: ContentLanguage): string {
  if (lang === 'en') return key.replace(/_/g, ' ');
  return DICTIONARIES[lang]?.chordQualities[key] ?? key.replace(/_/g, ' ');
}

/** Translate a direction key to the target language. EN falls through. */
export function translateDirection(key: string, lang: ContentLanguage): string {
  if (lang === 'en') return key.replace(/_/g, ' ');
  return DICTIONARIES[lang]?.directions[key] ?? key.replace(/_/g, ' ');
}
