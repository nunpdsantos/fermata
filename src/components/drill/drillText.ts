/**
 * Render-time translation of Drill item text (audit W6-07, decisions D-17,
 * D-18, D-19; audit A12, 2026-11-18).
 *
 * The bank keeps English display strings: they are what the chips show in
 * English AND the values grading compares, so they never change. At render
 * time this module maps the translatable ones to the learner's language:
 *
 *  - scale-degree names, function names, cadence names, Yes/No → `drill.terms.*`
 *  - key, scale and triad names ("C major", "A harmonic minor", "B diminished")
 *    → letter + the music-term dictionary ("C maior", "A menor harmónica",
 *    "B disminuido"), letters kept per D-18
 *  - quality-with-numeral labels ("minor (ii)", "D minor (ii)")
 *  - a bare mode word used as a parameter ("major" in "any major key")
 *  - interval names ("Major 3rd", "major 3rd", "Tritone", "Octave") →
 *    `drillTerms.interval.*` ("3.ª maior", "Trítono"; ES "5.ª justa"), and,
 *    where a sentence needs an article, `drillTerms.intervalWithArticle.*`
 *    (A12: the owner reversed D-17 for interval names, 18 November 2026)
 *  - seventh-chord names ("C♯ Half-Diminished 7th") → the letter + the
 *    quality name the Drill's quality chips show (chordQualityNames.ts:
 *    "C♯ meio-diminuto", "C séptima de dominante"); the same for the answer
 *    a chord-naming item's feedback gives (answerText.ts)
 *  - explanation clauses the bank names by key (core/utils/drillBank/
 *    clauses.ts) → `drillTerms.clauses.*`, in English too.
 *
 * Notes, Roman numerals and chord symbols (G7, maj7, ø7) pass through
 * untouched. English output is identical to 6de6c0e's (pinned by
 * drillEnglishSnapshot.test.ts). The UK cadence gloss is English-only. The
 * `drillTerms` strings load with the Drill view (i18n/drillTerms), never
 * from here: other views import this module for toContentLanguage.
 */
import type { DrillFamily, DrillItem } from '../../core/types/drill';
import type { ChordQuality } from '../../core/types/music';
import { SCALE_DEGREE_NAMES } from '../../core/constants/scales';
import { CHORD_QUALITY_NAMES } from '../../core/constants/chords';
import { clauseKey, clauseTokens } from '../../core/utils/drillBank/clauses';
import { translateChordQuality, translateScaleType } from '../../i18n/content/musicTerms';
import type { ContentLanguage } from '../../i18n/content/types';
import { qualityName } from '../../utils/qualityName';

/** The subset of i18next's TFunction this module needs. */
export type Translate = (key: string, options?: Record<string, unknown>) => string;

export interface DrillTextContext {
  t: Translate;
  lang: ContentLanguage;
  family: DrillFamily;
}

/** i18next language code → content language ('pt-PT' → 'pt'; unknown → 'en'). */
export function toContentLanguage(code: string | undefined): ContentLanguage {
  const base = (code ?? 'en').slice(0, 2);
  return base === 'pt' || base === 'es' ? base : 'en';
}

// ─── Term tables (English display string → i18n key) ────────────────────────

const DEGREE_KEYS: Record<string, string> = Object.fromEntries(
  SCALE_DEGREE_NAMES.map((name, i) => [name, `drill.terms.degree.${i + 1}`]),
);

/** Harmonic-function labels as genFunction emits them. */
const FUNCTION_KEYS: Record<string, string> = {
  Tonic: 'drill.terms.function.tonic',
  'Subdominant (pre-dominant)': 'drill.terms.function.subdominant',
  Dominant: 'drill.terms.function.dominant',
};

/** Cadence names as genFunction emits them. */
const CADENCE_KEYS: Record<string, string> = {
  'Perfect authentic cadence': 'drill.terms.cadence.perfectAuthentic',
  'Plagal cadence': 'drill.terms.cadence.plagal',
  'Half cadence': 'drill.terms.cadence.half',
  'Deceptive cadence': 'drill.terms.cadence.deceptive',
};

const ANSWER_KEYS: Record<string, string> = {
  Yes: 'drill.terms.yes',
  No: 'drill.terms.no',
};

// ─── Key / scale / triad names ───────────────────────────────────────────────

const NOTE = '[A-G](?:𝄪|𝄫|♯|♭)?';
const QUALITY = 'major|minor|natural minor|harmonic minor|melodic minor|diminished|augmented';
const NAMED_RE = new RegExp(`^(${NOTE}) (${QUALITY})$`, 'u');
const NAMED_WITH_NUMERAL_RE = new RegExp(`^(${NOTE}) (${QUALITY}) \\(([^)]+)\\)$`, 'u');
const QUALITY_WITH_NUMERAL_RE = new RegExp(`^(${QUALITY}) \\(([^)]+)\\)$`, 'u');
const BARE_QUALITY_RE = new RegExp(`^(${QUALITY})$`, 'u');
const SEVENTH_NAME_RE = new RegExp(`^(${NOTE}) (.+)$`, 'u');

/**
 * A quality or scale word in the target language. Scale forms come from the
 * scale-type dictionary, triad qualities (and the bare key word "minor") from
 * the chord-quality dictionary — the same helpers Learn's generator uses.
 */
function qualityWord(word: string, lang: ContentLanguage): string {
  switch (word) {
    case 'major':
      return translateScaleType('major', lang);
    case 'natural minor':
      return translateScaleType('natural_minor', lang);
    case 'harmonic minor':
      return translateScaleType('harmonic_minor', lang);
    case 'melodic minor':
      return translateScaleType('melodic_minor', lang);
    default: // minor, diminished, augmented
      return translateChordQuality(word, lang);
  }
}

// ─── Interval names (A12) ─────────────────────────────────────────────────────

const INTERVAL_QUALITY: Record<string, string> = { perfect: 'P', major: 'M', minor: 'm', augmented: 'A', diminished: 'd' };
const INTERVAL_NUMBER: Record<string, number> = { unison: 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '6th': 6, '7th': 7 };
const INTERVAL_RE = /^(perfect|major|minor|augmented|diminished) (unison|2nd|3rd|4th|5th|6th|7th)$/i;

/**
 * The key of an interval name as the bank writes it ("Major 3rd" and the
 * note-above prompts' "major 3rd" → 'M3', "Perfect Unison" → 'P1',
 * "Tritone" → 'TT', "Octave" → 'P8'), or null.
 */
export function intervalCode(value: string): string | null {
  if (value === 'Tritone') return 'TT';
  if (value === 'Octave') return 'P8';
  const m = INTERVAL_RE.exec(value);
  if (!m) return null;
  return `${INTERVAL_QUALITY[m[1].toLowerCase()]}${INTERVAL_NUMBER[m[2].toLowerCase()]}`;
}

/**
 * Parameters that sit in a sentence needing an article in PT / ES: "{{n}}
 * meios-tons formam {{answer}}" reads "7 meios-tons formam uma 5.ª perfeita",
 * "6 semitonos forman un tritono".
 */
const WITH_ARTICLE: Readonly<Record<string, readonly string[]>> = {
  'drill.why.semitoneFact': ['answer'],
};

// ─── Seventh-chord names (A12) ────────────────────────────────────────────────

const SEVENTH_QUALITIES: readonly ChordQuality[] = ['major7', 'dominant7', 'minor7', 'half_diminished7', 'diminished7'];
const SEVENTH_BY_NAME: Record<string, ChordQuality> = Object.fromEntries(
  SEVENTH_QUALITIES.map((q) => [CHORD_QUALITY_NAMES[q], q]),
);

/**
 * A chord named by its root and quality, as the Drill writes it: English
 * "C♯ Half-Diminished 7th" (the bank's own form, CHORD_QUALITY_NAMES); PT /
 * ES the root and the quality name the quality chips show, in lower case
 * ("C♯ meio-diminuto", "C maior com 7.ª M", "B diminuto", "C séptima de
 * dominante") — the same names Explore uses (chordQualityNames.ts).
 */
export function chordName(rootDisplay: string, quality: ChordQuality, lang: ContentLanguage): string {
  if (lang === 'en') return `${rootDisplay} ${CHORD_QUALITY_NAMES[quality] ?? quality}`;
  const name = qualityName(quality, lang);
  return `${rootDisplay} ${name.charAt(0).toLowerCase()}${name.slice(1)}`;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Translate one English display string from the bank (or return it as is). */
export function localizeTerm(value: string, ctx: DrillTextContext): string {
  const { t, lang, family } = ctx;
  const key =
    (family === 'function' ? FUNCTION_KEYS[value] ?? CADENCE_KEYS[value] : undefined) ??
    (family === 'degree' ? DEGREE_KEYS[value] : undefined) ??
    ANSWER_KEYS[value];
  if (key) return t(key);

  if (family === 'interval' && lang !== 'en') {
    const code = intervalCode(value);
    if (code) return t(`drillTerms.interval.${code}`);
  }
  if (family === 'seventh' && lang !== 'en') {
    const seventh = SEVENTH_NAME_RE.exec(value);
    const quality = seventh ? SEVENTH_BY_NAME[seventh[2]] : undefined;
    if (seventh && quality) return chordName(seventh[1], quality, lang);
  }

  let m = NAMED_RE.exec(value);
  if (m) return `${m[1]} ${qualityWord(m[2], lang)}`;
  m = NAMED_WITH_NUMERAL_RE.exec(value);
  if (m) return `${m[1]} ${qualityWord(m[2], lang)} (${m[3]})`;
  m = QUALITY_WITH_NUMERAL_RE.exec(value);
  if (m) return `${qualityWord(m[1], lang)} (${m[2]})`;
  m = BARE_QUALITY_RE.exec(value);
  if (m) return qualityWord(m[1], lang);
  return value;
}

/** Translate every string value of a prompt/why params object. */
export function localizeParams(
  params: Record<string, string | number>,
  ctx: DrillTextContext,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    out[k] = typeof v === 'string' ? localizeTerm(v, ctx) : v;
  }
  return out;
}

function contextFor(item: DrillItem, t: Translate, lang: ContentLanguage): DrillTextContext {
  return { t, lang, family: item.family };
}

/** The item's question, in the learner's language. */
export function itemPrompt(item: DrillItem, t: Translate, lang: ContentLanguage): string {
  return t(item.promptKey, localizeParams(item.promptParams, contextFor(item, t, lang)));
}

/**
 * The item's one-line explanation, in the learner's language. A clause
 * parameter (clauses.ts) is a key: its text comes from `drillTerms.clauses`
 * in every language. An interval name that needs an article in PT / ES
 * (WITH_ARTICLE) takes its article form.
 */
export function itemWhy(item: DrillItem, t: Translate, lang: ContentLanguage): string {
  const ctx = contextFor(item, t, lang);
  const params = localizeParams(item.whyParams, ctx);
  for (const [param, value] of Object.entries(item.whyParams)) {
    if (typeof value !== 'string') continue;
    if (clauseTokens(item.whyKey, param)) {
      params[param] = t(clauseKey(item.whyKey, param, value));
    } else if (lang !== 'en' && item.family === 'interval' && WITH_ARTICLE[item.whyKey]?.includes(param)) {
      const code = intervalCode(value);
      if (code) params[param] = t(`drillTerms.intervalWithArticle.${code}`);
    }
  }
  return t(item.whyKey, params);
}

/** How a choice chip (or a choice item's answer) reads in the learner's language. */
export function choiceLabel(item: DrillItem, choice: string, t: Translate, lang: ContentLanguage): string {
  return localizeTerm(choice, contextFor(item, t, lang));
}
