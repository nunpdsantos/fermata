import { CHORD_QUALITY_NAMES } from '../core/constants/chords';
import { chordQualityLabel, translateChordQuality } from '../i18n/content/musicTerms';
import type { ContentLanguage } from '../i18n/content/types';

/**
 * A chord quality's display name in the learner's language (W6-05): the
 * PT/ES dictionary name where one exists ("Maior", "De sétima da
 * dominante" → "Sétima da dominante"), else the English name — the
 * nomenclature convention for the qualities the dictionaries do not cover
 * (CLAUDE.md open items). Never the raw internal id.
 */
export function qualityName(quality: string, lang: ContentLanguage): string {
  const english = CHORD_QUALITY_NAMES[quality as keyof typeof CHORD_QUALITY_NAMES] ?? quality;
  if (lang === 'en') return english;
  const known = translateChordQuality(quality, lang) !== quality.replace(/_/g, ' ');
  return known ? chordQualityLabel(quality, lang) : english;
}
