/**
 * Music term dictionary — translates domain-specific strings used in exercise
 * templates (scaleType, chord quality, direction) to target languages.
 *
 * English scale types and directions fall through to the raw key with
 * underscores replaced by spaces; English chord qualities with digits in
 * their keys ('dominant7') get a readable name ('dominant 7th') so generated
 * prompts never show program identifiers (audit W5-37).
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
    major9: 'maior com 7.ª M e 9.ª',
    minor9: 'menor com 7.ª e 9.ª',
    dominant9: 'de nona da dominante',
    // Harmonic-minor sevenths (l3u9m4 chord_build templates, W6-13)
    minor_major7: 'menor com 7.ª M',
    augmented_major7: 'aumentado com 7.ª M',
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
    major9: 'mayor con 7.ª M y 9.ª',
    minor9: 'menor con 7.ª y 9.ª',
    dominant9: 'de novena de dominante',
    // Séptimas de la menor armónica (plantillas chord_build de l3u9m4, W6-13)
    minor_major7: 'menor con 7.ª M',
    augmented_major7: 'aumentado con 7.ª M',
  },
  directions: {
    ascending: 'ascendente',
    descending: 'descendente',
  },
};

const DICTIONARIES: Record<string, MusicTermDictionary> = { pt, es };

/** Readable English names for chord-quality keys that contain digits. */
const EN_CHORD_QUALITIES: Record<string, string> = {
  major7: 'major 7th',
  minor7: 'minor 7th',
  dominant7: 'dominant 7th',
  half_diminished7: 'half-diminished 7th',
  diminished7: 'diminished 7th',
  major9: 'major 9th',
  minor9: 'minor 9th',
  dominant9: 'dominant 9th',
  minor_major7: 'minor-major 7th',
  augmented_major7: 'augmented major 7th',
};

/** Translate a scale type key to the target language. EN falls through. */
export function translateScaleType(key: string, lang: ContentLanguage): string {
  if (lang === 'en') return key.replace(/_/g, ' ');
  return DICTIONARIES[lang]?.scaleTypes[key] ?? key.replace(/_/g, ' ');
}

/** Translate a chord quality key to the target language (EN: readable name or raw key). */
export function translateChordQuality(key: string, lang: ContentLanguage): string {
  if (lang === 'en') return EN_CHORD_QUALITIES[key] ?? key.replace(/_/g, ' ');
  return DICTIONARIES[lang]?.chordQualities[key] ?? key.replace(/_/g, ' ');
}

/**
 * A chord quality as a standalone answer label (ear-training buttons):
 * capitalised, and without the leading preposition the PT/ES names carry for
 * use after a root ('um acorde de C de sétima da dominante' → button
 * 'Sétima da dominante', not 'De sétima da dominante'). W6-13.
 */
export function chordQualityLabel(key: string, lang: ContentLanguage): string {
  const name = translateChordQuality(key, lang).replace(/^de\s+/i, '');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Translate a direction key to the target language. EN falls through. */
export function translateDirection(key: string, lang: ContentLanguage): string {
  if (lang === 'en') return key.replace(/_/g, ' ');
  return DICTIONARIES[lang]?.directions[key] ?? key.replace(/_/g, ' ');
}
