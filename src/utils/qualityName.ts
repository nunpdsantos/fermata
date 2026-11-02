import { CHORD_QUALITY_NAMES } from '../core/constants/chords';
import { CHORD_QUALITY_NAMES_ES, CHORD_QUALITY_NAMES_PT } from '../i18n/chordQualityNames';
import type { ContentLanguage } from '../i18n/content/types';

/**
 * A chord quality's display name in the learner's language (W6-05, D-17):
 * every quality has a PT and an ES name (i18n/chordQualityNames.ts, kept in
 * step with the exercise dictionary's standalone labels). An unknown id falls
 * back to the English name, then to the id with spaces — never a bare
 * internal id with underscores.
 */
export function qualityName(quality: string, lang: ContentLanguage): string {
  const english = CHORD_QUALITY_NAMES[quality as keyof typeof CHORD_QUALITY_NAMES] ?? quality.replace(/_/g, ' ');
  if (lang === 'pt') return CHORD_QUALITY_NAMES_PT[quality as keyof typeof CHORD_QUALITY_NAMES_PT] ?? english;
  if (lang === 'es') return CHORD_QUALITY_NAMES_ES[quality as keyof typeof CHORD_QUALITY_NAMES_ES] ?? english;
  return english;
}
