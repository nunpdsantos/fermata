/**
 * The Progression panel's sentences (wave 2, stream S). "Fit", never "is":
 * a list of chords can fit two keys.
 */
import type { Chord } from '../../../core/types/music';
import { withGlyphs } from '../../../core/utils/accidentalGlyphs';
import type { MusicKey } from '../../../core/utils/progression';
import { chordSymbol } from '../focusReadout';
import type { FitStatement, KeyLine } from './progressionModel';

export type T = (key: string, opts?: Record<string, unknown>) => string;

/** "G major", "E minor" (the circle's key names). */
export function keyLabel(key: MusicKey, t: T): string {
  return t(key.mode === 'major' ? 'circle.keyMajor' : 'circle.keyMinor', { note: withGlyphs(key.root) });
}

/** "G", "F♯m7", "D/F♯". */
export const chordName = (c: Chord): string => chordSymbol(c);

/** "G, D, Em, C". */
export const chordList = (cs: readonly Chord[]): string => cs.map(chordName).join(', ');

/** "F", "F and B♭", "F, B♭ and E♭" in the language's own way. */
export function listOf(items: readonly string[], lang: string): string {
  try {
    return new Intl.ListFormat(lang, { style: 'long', type: 'conjunction' }).format(items);
  } catch {
    return items.join(', ');
  }
}

export function numberWord(n: number, t: T): string {
  return t('progression.numbers').split(',')[n] ?? String(n);
}

const capitalise = (s: string, lang: string) => (s ? s.charAt(0).toLocaleUpperCase(lang) + s.slice(1) : s);

/**
 * One fit statement as a sentence: "All four chords fit G major." /
 * "Three of four fit G major; F does not." / "G fits C major." The numbers
 * count the chips (a repeated chord counts each time).
 */
export function fitSentence(st: FitStatement, chords: readonly Chord[], t: T, lang: string): string {
  const key = listOf(st.keys.map((k) => keyLabel(k, t)), lang);
  if (st.total === 1) {
    const chord = chordName(chords[0]);
    return t(st.fit === 1 ? 'progression.fitSingle' : 'progression.fitSingleNot', { chord, key });
  }
  if (st.fit === st.total) {
    return st.total === 2 ? t('progression.fitBoth', { key }) : t('progression.fitAll', { number: numberWord(st.total, t), key });
  }
  if (st.fit === 0) return t('progression.fitNone', { key });
  const head = st.fit === 1
    ? t('progression.fitSomeOne', { total: numberWord(st.total, t), key })
    : capitalise(t('progression.fitSome', { fit: numberWord(st.fit, t), total: numberWord(st.total, t), key }), lang);
  const names = st.outside.map(chordName);
  const tail = t(names.length === 1 ? 'progression.notOne' : 'progression.notMany', { chords: listOf(names, lang) });
  return `${head}; ${tail}`;
}

/** The key line's sentences: about Explore's key, then (when one fits more) the better key. */
export function keyLineSentences(line: KeyLine, chords: readonly Chord[], t: T, lang: string): { current: string; better: string | null } {
  return {
    current: fitSentence(line.current, chords, t, lang),
    better: line.better ? fitSentence(line.better, chords, t, lang) : null,
  };
}
