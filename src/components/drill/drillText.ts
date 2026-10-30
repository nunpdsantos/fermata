/**
 * Render-time translation of Drill item text (audit W6-07, decisions D-17,
 * D-18, D-19).
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
 *
 * Everything else passes through untouched: notes, numerals, interval labels
 * and seventh-chord quality names (nomenclature convention; D-17 keeps
 * chord-quality symbols as symbols). English output is identical to the raw
 * bank strings (pinned by tests). The UK cadence gloss is English-only.
 */
import type { DrillFamily, DrillItem } from '../../core/types/drill';
import { SCALE_DEGREE_NAMES } from '../../core/constants/scales';
import { translateChordQuality, translateScaleType } from '../../i18n/content/musicTerms';
import type { ContentLanguage } from '../../i18n/content/types';

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

// ─── Public API ──────────────────────────────────────────────────────────────

/** Translate one English display string from the bank (or return it as is). */
export function localizeTerm(value: string, ctx: DrillTextContext): string {
  const { t, lang, family } = ctx;
  const key =
    (family === 'function' ? FUNCTION_KEYS[value] ?? CADENCE_KEYS[value] : undefined) ??
    (family === 'degree' ? DEGREE_KEYS[value] : undefined) ??
    ANSWER_KEYS[value];
  if (key) return t(key);

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

/** The item's one-line explanation, in the learner's language. */
export function itemWhy(item: DrillItem, t: Translate, lang: ContentLanguage): string {
  return t(item.whyKey, localizeParams(item.whyParams, contextFor(item, t, lang)));
}

/** How a choice chip (or a choice item's answer) reads in the learner's language. */
export function choiceLabel(item: DrillItem, choice: string, t: Translate, lang: ContentLanguage): string {
  return localizeTerm(choice, contextFor(item, t, lang));
}
