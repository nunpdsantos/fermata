import type { Scale, Chord } from '../core/types/music.ts';
import { noteToString } from '../core/types/music.ts';
import { SCALE_TYPE_NAMES } from '../core/constants/scales.ts';
import { CHORD_QUALITY_NAMES } from '../core/constants/chords.ts';
import type { DiatonicChord } from '../hooks/useKeyContext.ts';
import { qualityName } from './qualityName.ts';
import type { ContentLanguage } from '../i18n/content/types.ts';

/** The learner's language for the summary: `t` + the content language. */
export interface SummaryLocale {
  t: (key: string, opts?: Record<string, unknown>) => string;
  lang: ContentLanguage;
}

/**
 * Generate a plain-text summary of the current scale context. With a
 * `locale` it is written in the learner's language (Explore's "⋯" → Copy,
 * W11-B review: it was English in PT/ES); without one, in English.
 */
export function generateScaleSummary(
  scale: Scale,
  diatonicChords: DiatonicChord[],
  selectedChord: Chord | null,
  locale?: SummaryLocale,
): string {
  const lines: string[] = [];
  const L = locale
    ? {
        scale: locale.t(`scaleName.${scale.type}`),
        notes: locale.t('explore.summary.notes'),
        count: locale.t('explore.summary.count'),
        countValue: locale.t('explore.notes', { count: scale.notes.length }),
        diatonic: locale.t('explore.diatonicChordsGroup'),
        selected: locale.t('explore.summary.selectedChord'),
        quality: (c: Chord) => qualityName(c.quality, locale.lang),
      }
    : {
        scale: SCALE_TYPE_NAMES[scale.type] ?? scale.type,
        notes: 'Notes',
        count: 'Count',
        countValue: `${scale.notes.length} notes`,
        diatonic: 'Diatonic Chords',
        selected: 'Selected Chord',
        quality: (c: Chord) => CHORD_QUALITY_NAMES[c.quality] ?? c.quality,
      };

  // Scale header
  lines.push(`${noteToString(scale.root)} ${L.scale}`);
  lines.push('─'.repeat(40));

  // Notes
  lines.push(`${L.notes}: ${scale.notes.map((n) => noteToString(n)).join('  ')}`);
  lines.push(`${L.count}: ${L.countValue}`);
  lines.push('');

  // Diatonic chords
  if (diatonicChords.length > 0) {
    lines.push(`${L.diatonic}:`);
    for (const dc of diatonicChords) {
      // Display names, never internal ids (audit W1-10: was "B half_diminished7").
      const name = `${noteToString(dc.chord.root)} ${L.quality(dc.chord)}`;
      // Defensive: a missing numeral must never break Copy (audit W0-01).
      lines.push(`  ${(dc.numeral ?? '').padEnd(6)} ${name}`);
    }
    lines.push('');
  }

  // Selected chord detail
  if (selectedChord) {
    lines.push(`${L.selected}: ${noteToString(selectedChord.root)} ${L.quality(selectedChord)}`);
    lines.push(`  ${L.notes}: ${selectedChord.notes.map((n) => noteToString(n)).join('  ')}`);
  }

  return lines.join('\n');
}

/**
 * Copy text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
