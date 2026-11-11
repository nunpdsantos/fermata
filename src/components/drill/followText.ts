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
 * lessons use: "C, G, F, Am, Em, Dm" (chords or keys), "chords I, IV, V in
 * the keys G, C, D, A, E" (degrees in keys). Language-neutral but for the
 * words around the degrees and keys.
 */
export function partLabel(rows: readonly DrillUnlockRow[], t: TFunction): string {
  const chordLabels = union(rows.map((r) =>
    (r.chords ?? []).map((c) => `${withGlyphs(stringToNote(c.root))}${CHORD_SUFFIX[c.quality] ?? ` ${c.quality}`}`),
  ));
  const keys = union(rows.map((r) => (r.keys ?? []).map(keyLabel))).join(', ');
  if (chordLabels.length > 0) return chordLabels.join(', ');
  if (rows.some((r) => (r.degrees ?? []).length > 0)) return degreesInKeys(rows, t);
  return keys;
}

/**
 * The degrees each key opened, keys with the same degrees named together:
 * l1u35m2 + m3 give "chords I, ii, iii, IV, V, vi in the keys G, C, D; chords
 * I, IV, V in the keys A, E" — never ii, iii and vi in A and E, which no
 * lesson opened (final review of wave 2).
 */
function degreesInKeys(rows: readonly DrillUnlockRow[], t: TFunction): string {
  const byKey = new Map<string, Set<number>>();
  for (const r of rows) {
    for (const k of r.keys ?? []) {
      const set = byKey.get(k) ?? new Set<number>();
      for (const d of r.degrees ?? []) set.add(d);
      byKey.set(k, set);
    }
  }
  const groups = new Map<string, { degrees: number[]; keys: string[] }>();
  for (const [k, set] of byKey) {
    const degrees = [...set].sort((a, b) => a - b);
    const id = degrees.join(',');
    const group = groups.get(id) ?? { degrees, keys: [] };
    group.keys.push(keyLabel(k));
    groups.set(id, group);
  }
  return [...groups.values()]
    .map((g) => t('drillFollow.degreesIn', { degrees: g.degrees.map((d) => NUMERALS[d - 1]).join(', '), keys: g.keys.join(', ') }))
    .join('; ');
}

/** A lesson's title in the learner's language, or null when the index does not know it. */
export function useLessonTitle(): (moduleId: string) => string | null {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const localized = useLocalizedModuleIndex(lang);
  return (moduleId) => getModuleTitle(moduleId, localized ? lang : 'en');
}
