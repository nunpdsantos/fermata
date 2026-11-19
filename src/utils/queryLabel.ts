/**
 * A lesson task's quoted phrase, as the learner reads it (the owner, 19
 * November 2026: "the labels should be in the learner language as well").
 *
 * The task's TOKEN stays the English query the overlays keep and
 * `findQuotedQueries` (utils/theoryQuery.ts) resolves and runs — nothing
 * here changes what a tap does. Only the words inside the quotes change: in
 * Portuguese and Spanish they are the NAME of what the token resolves to,
 * written as Explore writes it and as Quick Search names its results
 * (navigation/quickSearchResults.ts `scaleResultName`, `chordResultName`,
 * pinned equal in queryLabel.corpus.test.ts): a scale or key as the key
 * summary ("G maior", «D dórico», «G (Sol) maior» with Dó-Ré-Mi on — letters
 * first, the syllable only where the app already shows one), a chord named
 * in words as the chord detail's heading («C Maior»), a scale with no root
 * ("chromatic scale", which keeps Explore's key) by the scale's own name
 * («cromática»). So the words in the quotes are the words the learner then
 * sees on the instrument's panel and in Explore.
 *
 * Kept as written: English (byte for byte); a chord SYMBOL ("C7", "Am",
 * "Cmaj7/G" — the same in every language); a token that does not resolve,
 * or only through the solfège reading; anything with no name here.
 *
 * Pure: the words come in `names` (the app's i18n, or the public pages'
 * `appText`), so the lesson pages (src/site/html.ts `instructionHtml`) print
 * what the app prints.
 */
import { findQuotedQueries, resolveTheoryReadings } from './theoryQuery';
import { chordFromParsed, parseChordSymbol } from '../core/utils/chordParser';
import { withGlyphs } from '../core/utils/accidentalGlyphs';
import { qualityName } from './qualityName';
import type { Note } from '../core/types/music';
import type { ContentLanguage } from '../i18n/content/types';

export interface QueryLabelNames {
  lang: ContentLanguage;
  /** A string of the app's locale, by key ("scaleName.dorian"), in `lang`. */
  t: (key: string) => string;
  /** A root as Explore's key summary names it: "D", or "D (Ré)" with Dó-Ré-Mi on. Default: the letter. */
  note?: (n: Note) => string;
}

/**
 * A chord SYMBOL ("C7", "Am", "Cmaj7/G"): what the chord parser reads, written
 * without a space. The parser also reads some phrases in words ("C major/E",
 * "C minor add9"): those are words, and are named (review of bd14071).
 */
export function isChordSymbol(query: string): boolean {
  return !/\s/.test(query.trim()) && parseChordSymbol(query) !== null;
}

/** The words inside a task phrase's quotes, for `query` (its token) in `names.lang`. */
export function queryLabel(query: string, names: QueryLabelNames): string {
  if (names.lang === 'en' || isChordSymbol(query)) return query;
  const reading = resolveTheoryReadings(query)[0];
  if (!reading || reading.via === 'solfege') return query;
  // A name the locale lacks (the key itself, or nothing) is no name: the token stays.
  const named = (key: string): string | null => {
    try {
      const text = names.t(key);
      return text && text !== key ? text : null;
    } catch {
      return null;
    }
  };
  const note = names.note ?? withGlyphs;
  const r = reading.resolved;
  let scale: string | null;
  switch (r.kind) {
    case 'scale':
      scale = named(`scaleName.${r.scaleType}`);
      return scale ? `${note(r.root)} ${scale}` : query;
    case 'key':
      scale = named(`scaleName.${r.minor ? 'natural_minor' : 'major'}`);
      return scale ? `${note(r.root)} ${scale}` : query;
    case 'rootlessScale':
      return named(`scaleName.${r.scaleType}`) ?? query;
    case 'chord': {
      const chord = chordFromParsed(r.parsed);
      // A chord the parser built carries its whole name, as the chord heading writes it.
      if (chord.algorithmicDisplayName) return withGlyphs(chord.algorithmicDisplayName);
      const name = `${withGlyphs(chord.root)} ${qualityName(chord.quality, names.lang)}`;
      return chord.bassNote ? `${name}/${withGlyphs(chord.bassNote)}` : name;
    }
    default:
      return query;
  }
}

/**
 * A task's instruction as the learner reads it: each quoted token as
 * ‘its words’ (`label`, usually `queryLabel`), the rest as written — what the
 * lesson draws, and so what names its tick box for a screen reader (review of
 * bd14071: the box still spoke the English token beside ‘C maior’).
 */
export function taskText(instruction: string, label: (query: string) => string): string {
  let out = '';
  let last = 0;
  for (const { index, length, query } of findQuotedQueries(instruction)) {
    out += `${instruction.slice(last, index)}‘${label(query)}’`;
    last = index + length;
  }
  return out + instruction.slice(last);
}
