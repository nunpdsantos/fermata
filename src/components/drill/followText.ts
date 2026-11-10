/**
 * Text helpers for "Follow my lessons" (wave 2): the part of a family the
 * track lessons opened, and lesson titles in the learner's language.
 */
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { stringToNote } from '../../core/types/music';
import { withGlyphs } from '../../core/utils/drillBank/shared';
import type { DrillUnlockRow } from '../../data/drillUnlocks';
import { getModuleTitle } from '../../data/moduleIndexI18n';
import { useLocalizedModuleIndex } from '../../hooks/useLocalizedModuleIndex';

const NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const CHORD_SUFFIX: Partial<Record<string, string>> = {
  major: '',
  minor: 'm',
  dominant7: '7',
  minor7: 'm7',
  major7: 'maj7',
};

/** 'C' → "C" (C major), 'a' → "Am" (A minor), 'Bb' → "B♭", 'f#' → "F♯m". */
const keyLabel = (key: string) => {
  const minor = /^[a-g]/.test(key);
  const tonic = key.charAt(0).toUpperCase() + key.slice(1);
  return `${withGlyphs(stringToNote(tonic))}${minor ? 'm' : ''}`;
};

const union = (lists: (readonly string[])[]) => [...new Set(lists.flat())];

/**
 * The part of a family the track lessons opened, in letters and symbols the
 * lessons use: "C, G, F, Am, Em, Dm" (chords or keys), "I, IV, V in G, C, D,
 * A, E" (degrees in keys). Language-neutral but for "in".
 */
export function partLabel(rows: readonly DrillUnlockRow[], t: TFunction): string {
  const chordLabels = union(rows.map((r) =>
    (r.chords ?? []).map((c) => `${withGlyphs(stringToNote(c.root))}${CHORD_SUFFIX[c.quality] ?? ` ${c.quality}`}`),
  ));
  const keys = union(rows.map((r) => (r.keys ?? []).map(keyLabel))).join(', ');
  const degrees = [...new Set(rows.flatMap((r) => r.degrees ?? []))].sort((a, b) => a - b);
  if (chordLabels.length > 0) return chordLabels.join(', ');
  if (degrees.length > 0) return t('drillFollow.degreesIn', { degrees: degrees.map((d) => NUMERALS[d - 1]).join(', '), keys });
  return keys;
}

/** A lesson's title in the learner's language, or null when the index does not know it. */
export function useLessonTitle(): (moduleId: string) => string | null {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const localized = useLocalizedModuleIndex(lang);
  return (moduleId) => getModuleTitle(moduleId, localized ? lang : 'en');
}
