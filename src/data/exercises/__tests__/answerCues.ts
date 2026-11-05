/**
 * Test-wiseness heuristics: ways to guess a multiple-choice answer without
 * knowing the material, measured on the items the app actually serves.
 *
 * Ported from the independent W4a review (lengthcues.py, heur2.py). Each
 * heuristic picks an option; ties share the credit (a 2-way tie on the right
 * answer scores 0.5). A heuristic's score for a level is its expected hit
 * rate there. With four options, chance is 25%.
 */
import type { ContentLanguage } from '../../../i18n/content/types';
import { levelCorpus } from './learnCorpus';
import { EN_UNITS, curriculumOverlay } from '../../../i18n/content/__tests__/overlayEntries';

export type Choice = { label: string; correct: boolean };
export interface ServedSet { id: string; prompt: string; choices: Choice[]; moduleId?: string }

/** Served multiple-choice items of a level in one language (authored + generated). */
export function servedSets(level: number, lang: ContentLanguage): ServedSet[] {
  return levelCorpus(level, lang)
    .filter((i) => i.exercise.config.type === 'multiple_choice')
    .map((i) => ({ id: i.exercise.id, prompt: i.exercise.prompt, choices: (i.exercise.config as { choices: Choice[] }).choices, moduleId: i.moduleId }));
}

/** Python's [\w'’]+ on lower-cased text (Unicode letters, digits, underscore, apostrophes). */
export const toks = (s: string): string[] => s.toLowerCase().match(/[\p{L}\p{N}_'’]+/gu) ?? [];
const len = (s: string) => [...s].length;

/** Words that make an option sound absolute — the "avoid always/never" trick. */
export const ABSOLUTE_WORDS: Record<ContentLanguage, ReadonlySet<string>> = {
  en: new Set(['always', 'never', 'only', 'all', 'none', 'every', 'no', 'must', 'cannot', 'impossible', 'any']),
  pt: new Set(['sempre', 'nunca', 'só', 'apenas', 'todos', 'todas', 'todo', 'toda', 'nenhum', 'nenhuma', 'cada', 'não', 'deve', 'devem', 'impossível', 'qualquer']),
  es: new Set(['siempre', 'nunca', 'solo', 'sólo', 'únicamente', 'todos', 'todas', 'todo', 'toda', 'ninguno', 'ninguna', 'ningún', 'cada', 'no', 'debe', 'deben', 'imposible', 'cualquier']),
};

/**
 * Fractional credit: the share of the picked (best-scoring) options that is
 * the right one. Scores that are sums of fractions tie up to rounding (three
 * options with the same similarity sum can differ in the last bit), so a tie
 * is anything within 1e-9 of the best.
 */
function pick(values: number[], correct: number, max = true): number {
  const best = max ? Math.max(...values) : Math.min(...values);
  const winners = values.flatMap((v, i) => (Math.abs(v - best) < 1e-9 ? [i] : []));
  return winners.includes(correct) ? 1 / winners.length : 0;
}

function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  const union = new Set([...A, ...B]);
  return union.size ? [...A].filter((x) => B.has(x)).length / union.size : 0;
}

export const HEURISTICS: Record<string, (s: ServedSet, lang: ContentLanguage) => number> = {
  'longest (chars)': (s) => pick(s.choices.map((c) => len(c.label)), ci(s)),
  'shortest (chars)': (s) => pick(s.choices.map((c) => len(c.label)), ci(s), false),
  'longest (words)': (s) => pick(s.choices.map((c) => toks(c.label).length), ci(s)),
  'shortest (words)': (s) => pick(s.choices.map((c) => toks(c.label).length), ci(s), false),
  'most like the others': (s) => pick(similarity(s), ci(s)),
  'least like the others': (s) => pick(similarity(s), ci(s), false),
  'most words from the prompt': (s) => {
    const p = new Set(toks(s.prompt));
    return pick(s.choices.map((c) => new Set(toks(c.label)).size && [...new Set(toks(c.label))].filter((t) => p.has(t)).length), ci(s));
  },
  'largest share of prompt words': (s) => {
    const p = new Set(toks(s.prompt));
    return pick(s.choices.map((c) => { const t = new Set(toks(c.label)); return [...t].filter((x) => p.has(x)).length / Math.max(1, t.size); }), ci(s));
  },
  'most shared vocabulary': (s) => {
    const T = s.choices.map((c) => new Set(toks(c.label)));
    const count = new Map<string, number>();
    for (const t of T) for (const w of t) count.set(w, (count.get(w) ?? 0) + 1);
    return pick(T.map((t) => [...t].reduce((n, w) => n + (count.get(w)! - 1), 0) / Math.max(1, t.size)), ci(s));
  },
  'no absolute words': (s, lang) => {
    const keep = noAbsolute(s, lang);
    return keep.includes(ci(s)) ? 1 / keep.length : 0;
  },
  'longest without absolute words': (s, lang) => {
    const keep = noAbsolute(s, lang);
    const L = s.choices.map((c) => len(c.label));
    const best = Math.max(...keep.map((j) => L[j]));
    const winners = keep.filter((j) => L[j] === best);
    return winners.includes(ci(s)) ? 1 / winners.length : 0;
  },
  'most punctuation': (s) => pick(s.choices.map((c) => (c.label.match(/[,;:()]/g) ?? []).length), ci(s)),
  'most digits': (s) => pick(s.choices.map((c) => (c.label.match(/\d/g) ?? []).length), ci(s)),
};

function ci(s: ServedSet): number {
  return s.choices.findIndex((c) => c.correct);
}
function similarity(s: ServedSet): number[] {
  const T = s.choices.map((c) => toks(c.label));
  return T.map((a, i) => T.reduce((n, b, j) => (j === i ? n : n + jaccard(a, b)), 0));
}
function noAbsolute(s: ServedSet, lang: ContentLanguage): number[] {
  const abs = ABSOLUTE_WORDS[lang];
  const keep = s.choices.flatMap((c, j) => (toks(c.label).some((t) => abs.has(t)) ? [] : [j]));
  return keep.length ? keep : s.choices.map((_, j) => j);
}

/** Each heuristic's expected hit rate on a level's served sets. */
export function heuristicRates(level: number, lang: ContentLanguage): Record<string, number> {
  const sets = servedSets(level, lang);
  return Object.fromEntries(Object.entries(HEURISTICS).map(([name, h]) => [name, sets.reduce((n, s) => n + h(s, lang), 0) / sets.length]));
}

/** Uniqueness guards on served sets: where one option is uniquely longest/shortest, how often it is right. */
export function uniqueExtremes(level: number, lang: ContentLanguage) {
  const sets = servedSets(level, lang);
  const ext = (max: boolean) => {
    const pool = sets.filter((s) => { const L = s.choices.map((c) => len(c.label)); const e = max ? Math.max(...L) : Math.min(...L); return L.filter((x) => x === e).length === 1; });
    const right = pool.filter((s) => { const L = s.choices.map((c) => len(c.label)); const e = max ? Math.max(...L) : Math.min(...L); return L[ci(s)] === e; });
    return { right: right.length, of: pool.length, ids: right.map((s) => s.id) };
  };
  return { n: sets.length, longest: ext(true), shortest: ext(false) };
}

/*
 * Rank family (review round 4). Moving the right answer off "longest" onto
 * "second-longest" is the same cue one place down, so every rank is checked:
 * for each feature and each rank r, the expected hit rate of "pick the r-th
 * largest option" — a tie block shares its ranks evenly, as in the review's
 * rankfam.py (round 4b; the first version counted unique ranks only, which
 * hid tie-heavy features such as punctuation marks). Bound: chance + 15
 * points (4 options: 40%; 3 options: 50% by decision), and "among the two
 * largest" (4 options, chance 50%) at most 65%, for every feature.
 */
export const RANK_FEATURES: Record<string, (label: string) => number> = {
  characters: (s) => len(s),
  words: (s) => toks(s).length,
  punctuation: (s) => (s.match(/[,;:()]/g) ?? []).length,
  digits: (s) => (s.match(/\d/g) ?? []).length,
  parentheses: (s) => (s.match(/[()]/g) ?? []).length,
  /** Every mark (review round 4b, rankfam.py): commas, semicolons, colons, parentheses, dashes, quotes, slashes. */
  'all punctuation': (s) => (s.match(/[,;:()—–\-"“”«»'/]/g) ?? []).length,
};

/** 1-based rank (largest first) of the right answer by a feature, or 0 when another option has the same value. */
export function uniqueRank(s: ServedSet, feature: (label: string) => number): number {
  const v = s.choices.map((c) => feature(c.label));
  const mine = v[ci(s)];
  if (v.filter((x) => x === mine).length > 1) return 0;
  return 1 + v.filter((x) => x > mine).length;
}

/**
 * Probability that "pick the r-th largest" hits the right answer, per rank r
 * (index 0 = largest): the right answer's tie block shares its ranks evenly;
 * when every option ties, the feature carries no information (1/n each).
 */
export function rankProbs(s: ServedSet, feature: (label: string) => number): number[] {
  return valueRankProbs(s.choices.map((c) => feature(c.label)), ci(s));
}

/** Floating-point sums that differ only by rounding share their rank block. */
export function valueRankProbs(v: number[], correct: number): number[] {
  const n = v.length;
  if (new Set(v).size === 1) return new Array<number>(n).fill(1 / n);
  const mine = v[correct];
  const higher = v.filter((x) => x - mine >= 1e-9).length;
  const ties = v.filter((x) => Math.abs(x - mine) < 1e-9).length;
  return v.map((_, r) => (r >= higher && r < higher + ties ? 1 / ties : 0));
}

/** Credit for "the right answer is among the two largest" (fractional when a tie straddles the cut). */
export function amongTopTwo(s: ServedSet, feature: (label: string) => number): number {
  const v = s.choices.map((c) => feature(c.label));
  const mine = v[ci(s)];
  const above = v.filter((x) => x > mine).length;
  if (above >= 2) return 0;
  const level = v.filter((x) => x === mine).length;
  return Math.min(1, (2 - above) / level);
}

/** Bound for a rank cell with n options: chance + 15 points; 3 options 50% (decision). */
export const rankBound = (n: number): number => (n === 3 ? 0.5 : 1 / n + 0.15);
export const TOP_TWO_BOUND = 0.65;

export interface RankCell { feature: string; size: number; rank: number; rate: number; bound: number; sets: number }

/** Every rank cell (feature × option count × rank) and the top-two cells, for one group of sets. */
export function rankCells(sets: ServedSet[], lang: ContentLanguage = 'en'): { ranks: RankCell[]; topTwo: RankCell[] } {
  const bySize = new Map<number, ServedSet[]>();
  for (const s of sets) bySize.set(s.choices.length, [...(bySize.get(s.choices.length) ?? []), s]);
  const ranks: RankCell[] = [];
  const topTwo: RankCell[] = [];
  for (const [size, group] of bySize) {
    const features: Record<string, (s: ServedSet) => number[]> = {
      ...Object.fromEntries(Object.entries(RANK_FEATURES).map(([name, f]) => [name, (s: ServedSet) => s.choices.map((c) => f(c.label))])),
      ...Object.fromEntries(Object.entries(CONTEXT_RANK_FEATURES).map(([name, f]) => [name, (s: ServedSet) => f(s, lang)])),
    };
    for (const [feature, f] of Object.entries(features)) {
      const acc = new Array<number>(size).fill(0);
      for (const s of group) valueRankProbs(f(s), ci(s)).forEach((p, i) => (acc[i] += p));
      for (let rank = 1; rank <= size; rank++) {
        ranks.push({ feature, size, rank, rate: acc[rank - 1] / group.length, bound: rankBound(size), sets: group.length });
      }
      if (size === 4) topTwo.push({ feature, size, rank: 2, rate: (acc[0] + acc[1]) / group.length, bound: TOP_TWO_BOUND, sets: group.length });
    }
  }
  return { ranks, topTwo };
}

/*
 * Outlier cue (review round 4): "the one conspicuously longer option is the
 * answer". Among sets whose longest option is at least OUTLIER_RATIO times the
 * next longest (characters), the outlier may be the right answer at most
 * chance + 15 points of the time. Judged only where a level has at least
 * OUTLIER_MIN_SETS such sets (fewer is noise).
 */
export const OUTLIER_RATIO = 1.25;
export const OUTLIER_MIN_SETS = 10;

export function longOutliers(sets: ServedSet[]): { sets: number; right: number; ids: string[] } {
  let n = 0;
  const ids: string[] = [];
  for (const s of sets) {
    const L = s.choices.map((c) => len(c.label));
    const sorted = [...L].sort((a, b) => b - a);
    if (sorted[0] < OUTLIER_RATIO * sorted[1]) continue;
    n++;
    if (L[ci(s)] === sorted[0]) ids.push(s.id);
  }
  return { sets: n, right: ids.length, ids };
}

/*
 * Lesson-vocabulary cue (review round 4b): "pick the option that shares the
 * most content words with the module's own lesson text". Padded distractors
 * written in generic words ("exactly", "never", "so … never read a staff
 * again") lose to the answer, which is phrased in the lesson's terms. Content
 * words = tokens minus the stop words below; the lesson text is the module's
 * concept explanations in that language (as in the review's rankfam.py).
 * Bound: ≤ 45% per level per language (chance 25%).
 */
export const LESSON_VOCAB_BOUND = 0.45;

export const STOP_WORDS: Record<ContentLanguage, ReadonlySet<string>> = {
  en: new Set(('a an the and or but nor so yet of to in on at by for with from into onto over under about as than then that this these those it its it\'s is are was were be been being has have had do does did not no can could may might must will would shall should which who whom whose what when where why how there here their they them he she his her we our you your i me my one ones also just only very more most less much many each every all any some such other another same own both either neither too up down out off again once while if because until after before between through during without within upon whether always never still often usually also etc').split(' ')),
  pt: new Set(('a o as os um uma uns umas e ou mas nem de do da dos das em no na nos nas num numa por pelo pela pelos pelas para com sem sob sobre entre até ao aos à às que se não é são foi ser está estão tem têm há como mais menos muito muitos muita muitas seu sua seus suas este esta estes estas esse essa esses essas isto isso aquele aquela lhe lhes eles elas ele ela também já só cada outro outra outros outras mesmo mesma qual quais quando onde porque pois então depois antes durante tal tão enquanto ainda assim bem sempre nunca vezes geralmente normalmente frequentemente').split(' ')),
  es: new Set(('a al el la los las un una unos unas y o u pero ni de del en por para con sin sobre entre hasta desde que se no es son fue ser está están tiene tienen hay como más menos muy mucho muchos mucha muchas su sus este esta estos estas ese esa esos esas esto eso aquel aquella le les ellos ellas él ella también ya solo sólo cada otro otra otros otras mismo misma cual cuales cuando donde porque pues entonces después antes durante tal tan lo mientras aún todavía así bien siempre nunca menudo veces generalmente normalmente').split(' ')),
};

export const contentToks = (s: string, lang: ContentLanguage): string[] => toks(s).filter((w) => !STOP_WORDS[lang].has(w));

const lessonCache = new Map<string, ReadonlySet<string>>();
/** Content words of a module's concept explanations, in one language. */
export function lessonVocabulary(moduleId: string, lang: ContentLanguage): ReadonlySet<string> {
  const key = `${lang}:${moduleId}`;
  const hit = lessonCache.get(key);
  if (hit) return hit;
  const level = Number(moduleId.slice(1, moduleId.indexOf('u')));
  const mod = EN_UNITS[level].flatMap((u) => u.modules).find((m) => m.id === moduleId);
  const ov = lang === 'en' ? undefined : curriculumOverlay(lang, level).modules[moduleId];
  const text = (mod?.concepts ?? []).map((c, i) => ov?.concepts[i]?.explanation ?? c.explanation).join(' ');
  const set = new Set(contentToks(text, lang));
  lessonCache.set(key, set);
  return set;
}

/** Credit for "the option sharing the most lesson content words is right" (ties share the credit). */
export function lessonVocabPick(s: ServedSet, lang: ContentLanguage): number {
  if (!s.moduleId) return 0;
  const lex = lessonVocabulary(s.moduleId, lang);
  return pick(s.choices.map((c) => new Set(contentToks(c.label, lang).filter((w) => lex.has(w))).size), ci(s));
}

export function lessonVocabRate(sets: ServedSet[], lang: ContentLanguage): number {
  return sets.reduce((n, s) => n + lessonVocabPick(s, lang), 0) / sets.length;
}

/**
 * A human-applicable composite shortcut, fixed before the round-2 rewrite:
 * count distinct lesson content words, subtract two for each absolute word,
 * add one for each hedge, and add one if there is an example OR quotation.
 * Pick the highest score, sharing credit uniformly between tied options.
 * This catches the familiar "qualified, illustrated, lesson-worded answer"
 * even when none of its individual clues exceeds its own bound. These are
 * fixed language lexicons and weights, never fitted to the answer key.
 */
export const COMPOSITE_BOUND = 0.4;
export const HEDGE_WORDS: Record<ContentLanguage, ReadonlySet<string>> = {
  en: new Set(['usually', 'often', 'typically', 'generally', 'may', 'can', 'tends', 'mostly', 'commonly', 'most', 'sometimes', 'frequently', 'usual', 'typical', 'normally', 'tend', 'could', 'might', 'roughly', 'about', 'approximately']),
  pt: new Set(['geralmente', 'normalmente', 'frequentemente', 'costuma', 'costumam', 'pode', 'podem', 'habitualmente', 'tipicamente', 'maioria', 'comummente']),
  es: new Set(['generalmente', 'normalmente', 'suele', 'suelen', 'puede', 'pueden', 'habitualmente', 'típicamente', 'mayoría', 'comúnmente']),
};
const HEDGE_PHRASES: Record<ContentLanguage, readonly string[]> = {
  en: [], pt: ['muitas vezes', 'por vezes', 'em geral'], es: ['muchas veces', 'a menudo', 'en general'],
};
const COMPOSITE_ABSOLUTES: Record<ContentLanguage, ReadonlySet<string>> = {
  en: new Set([...ABSOLUTE_WORDS.en, 'exactly', 'entirely', 'completely', 'solely', 'exclusively', 'purely', 'simply', 'just', 'nothing', 'everything', 'whatever']),
  pt: new Set([...ABSOLUTE_WORDS.pt, 'somente', 'exatamente', 'obrigatoriamente', 'exclusivamente', 'completamente', 'totalmente', 'nada', 'tudo', 'puramente', 'simplesmente']),
  es: new Set([...ABSOLUTE_WORDS.es, 'exactamente', 'necesariamente', 'exclusivamente', 'completamente', 'totalmente', 'nada', 'puramente', 'simplemente']),
};

export function compositeScore(label: string, lessonWords: ReadonlySet<string>, lang: ContentLanguage): number {
  const words = toks(label);
  const content = new Set(contentToks(label, lang).filter((w) => lessonWords.has(w)));
  const absolutes = words.filter((w) => COMPOSITE_ABSOLUTES[lang].has(w)).length;
  const text = ` ${words.join(' ')} `;
  const hedges = words.filter((w) => HEDGE_WORDS[lang].has(w)).length
    + HEDGE_PHRASES[lang].reduce((sum, phrase) => sum + text.split(` ${phrase} `).length - 1, 0);
  const illustrated = /e\.g\.|ex\.|p\. ex|por ejemplo|por exemplo|for example|["“”«»]/i.test(label) ? 1 : 0;
  return content.size - 2 * absolutes + hedges + illustrated;
}

export function compositePick(s: ServedSet, lang: ContentLanguage): number {
  const lex = s.moduleId ? lessonVocabulary(s.moduleId, lang) : new Set<string>();
  return pick(s.choices.map((c) => compositeScore(c.label, lex, lang)), ci(s));
}

export function compositeRate(sets: ServedSet[], lang: ContentLanguage): number {
  return sets.reduce((sum, s) => sum + compositePick(s, lang), 0) / sets.length;
}

/** Reference rankfam.py tokens include accidentals and chord-quality signs.
 * Keep the original toks/heuristics unchanged so the existing gates retain
 * their definitions; use this tokenizer for the additional rank family.
 */
export const rankToks = (s: string): string[] => s.toLowerCase().match(/[\p{L}\p{N}_'’♭♯#°ø]+/gu) ?? [];

const allLessonCache = new Map<string, ReadonlySet<string>>();
export function allLessonVocabulary(moduleId: string, lang: ContentLanguage): ReadonlySet<string> {
  const key = `${lang}:${moduleId}`;
  const hit = allLessonCache.get(key);
  if (hit) return hit;
  const level = Number(moduleId.slice(1, moduleId.indexOf('u')));
  const mod = EN_UNITS[level]?.flatMap((u) => u.modules).find((m) => m.id === moduleId);
  const ov = lang === 'en' ? undefined : curriculumOverlay(lang, level).modules[moduleId];
  const text = (mod?.concepts ?? []).map((c, i) => ov?.concepts[i]?.explanation ?? c.explanation).join(' ');
  const words = new Set(rankToks(text));
  allLessonCache.set(key, words);
  return words;
}

/** Curriculum-derived technical vocabulary: a token of at least five
 * characters occurring in the module/concept titles of 1–6 modules across
 * the entire curriculum, counted once per module, in the item's language.
 * This is rankfam.py's implemented rule (its comment saying 12 is stale).
 * No answer labels or answer keys take part in constructing the lexicon.
 */
const technicalCache = new Map<ContentLanguage, ReadonlySet<string>>();
export function technicalVocabulary(lang: ContentLanguage): ReadonlySet<string> {
  const hit = technicalCache.get(lang);
  if (hit) return hit;
  const counts = new Map<string, number>();
  for (const [level, units] of Object.entries(EN_UNITS)) {
    const overlay = lang === 'en' ? undefined : curriculumOverlay(lang, Number(level));
    for (const mod of units.flatMap((u) => u.modules)) {
      const ov = overlay?.modules[mod.id];
      const titles = [ov?.title ?? mod.title, ...mod.concepts.map((c, i) => ov?.concepts[i]?.title ?? c.title)];
      for (const w of new Set(rankToks(titles.join(' ')))) {
        if (len(w) >= 5) counts.set(w, (counts.get(w) ?? 0) + 1);
      }
    }
  }
  const words = new Set([...counts].filter(([, count]) => count <= 6).map(([w]) => w));
  technicalCache.set(lang, words);
  return words;
}

/** Fraction of distinct option words found in the concept explanations.
 * Content mode removes this language's STOP_WORDS, with no word-length cut.
 * rank3.py instead uses English stop words and a five-character cut in ALL
 * languages; that reference variant is cross-checked separately in review.
 */
export function lessonFractions(s: ServedSet, lang: ContentLanguage, content = false): number[] {
  const lex = s.moduleId ? allLessonVocabulary(s.moduleId, lang) : new Set<string>();
  return s.choices.map((c) => {
    const words = new Set(rankToks(c.label).filter((w) => !content || !STOP_WORDS[lang].has(w)));
    return [...words].filter((w) => lex.has(w)).length / Math.max(1, words.size);
  });
}

export const CONTEXT_RANK_FEATURES: Record<string, (s: ServedSet, lang: ContentLanguage) => number[]> = {
  similar_to_others: (s) => {
    const words = s.choices.map((c) => rankToks(c.label));
    return words.map((a, i) => words.reduce((sum, b, j) => sum + (i === j ? 0 : jaccard(a, b)), 0));
  },
  shared_tokens: (s) => {
    const words = s.choices.map((c) => new Set(rankToks(c.label)));
    const counts = new Map<string, number>();
    for (const set of words) for (const w of set) counts.set(w, (counts.get(w) ?? 0) + 1);
    return words.map((set) => [...set].reduce((sum, w) => sum + counts.get(w)! - 1, 0) / Math.max(1, set.size));
  },
  prefix_shared: (s) => {
    const labels = s.choices.map((c) => [...c.label]);
    return labels.map((a, i) => Math.max(0, ...labels.map((b, j) => {
      if (i === j) return 0;
      let n = 0;
      while (n < a.length && n < b.length && a[n] === b[n]) n++;
      return n;
    })));
  },
  // rank3.py exposed this related cue after the first content pass: counting
  // long words alone does not bound the average length of all option words.
  avgwordlen: (s) => s.choices.map((c) => {
    const words = rankToks(c.label);
    return words.reduce((sum, w) => sum + len(w), 0) / Math.max(1, words.length);
  }),
  long_words: (s) => s.choices.map((c) => rankToks(c.label).filter((w) => len(w) >= 9).length),
  tech_vocab: (s, lang) => s.choices.map((c) => rankToks(c.label).filter((w) => technicalVocabulary(lang).has(w)).length),
  lesson_text_overlap: (s, lang) => lessonFractions(s, lang),
  lesson_content_frac: (s, lang) => lessonFractions(s, lang, true),
};

export function lessonFractionRate(sets: ServedSet[], lang: ContentLanguage, content = false): number {
  return sets.reduce((sum, s) => sum + pick(lessonFractions(s, lang, content), ci(s)), 0) / sets.length;
}


/** Round 3: mirror oddone.py's mean Jaccard and strict gap, using rankfam tokens. */
export interface CueCount { right: number; sets: number; ids: string[] }
export function oddOneOut(sets: ServedSet[], gap: number): CueCount {
  const result: CueCount = { right: 0, sets: 0, ids: [] };
  for (const s of sets.filter(s => s.choices.length === 4)) {
    const tokens = s.choices.map(c => rankToks(c.label));
    const means = tokens.map((a, i) => tokens.reduce((sum, b, j) => sum + (i === j ? 0 : jaccard(a, b)), 0) / 3);
    const order = [0, 1, 2, 3].sort((a, b) => means[a] - means[b]);
    if (means[order[1]] - means[order[0]] <= gap) continue;
    result.sets++;
    if (order[0] === ci(s)) { result.right++; result.ids.push(s.id); }
  }
  return result;
}

export function parallelWrongOptions(sets: ServedSet[]): string[] {
  return sets.filter(s => {
    if (s.choices.length !== 4) return false;
    const tokens = s.choices.map(c => rankToks(c.label));
    const wrong = tokens.filter((_, i) => i !== ci(s));
    return wrong.every((a, i) => wrong.every((b, j) => i === j || jaccard(a, b) >= 0.6))
      && wrong.every(a => jaccard(tokens[ci(s)], a) < 0.4);
  }).map(s => s.id);
}

export function oddOpening(sets: ServedSet[], k: number): CueCount {
  const result: CueCount = { right: 0, sets: 0, ids: [] };
  for (const s of sets.filter(s => s.choices.length === 4)) {
    const prefixes = s.choices.map(c => JSON.stringify(rankToks(c.label).slice(0, k)));
    const counts = prefixes.map(p => prefixes.filter(x => x === p).length);
    if (!counts.includes(3) || !counts.includes(1)) continue;
    result.sets++;
    if (counts[ci(s)] === 1) { result.right++; result.ids.push(s.id); }
  }
  return result;
}

export const EXPLANATION_WORDS: Record<ContentLanguage, ReadonlySet<string>> = {
  en: new Set(['because']), pt: new Set(['porque']), es: new Set(['porque']),
};
/** Test-wise rule: never pick an option with X (or preferentially pick it).
 * Count options containing a word, once per option, not token occurrences.
 * Include every existing absolute/hedge list and the explanation words.
 */
export function wordAnswerShares(sets: ServedSet[], lang: ContentLanguage) {
  const words = new Set([...HEDGE_WORDS[lang], ...COMPOSITE_ABSOLUTES[lang], ...EXPLANATION_WORDS[lang]]);
  return [...words].map(word => {
    const options = sets.flatMap(s => s.choices).filter(c => toks(c.label).includes(word));
    return { word, right: options.filter(c => c.correct).length, options: options.length };
  });
}
export const cueShareWithinBounds = (c: CueCount, lower = 0, min = 10) =>
  c.sets < min || (c.right / c.sets >= lower && c.right / c.sets <= 0.4);
export const wordShareWithinBounds = (c: { right: number; options: number }) =>
  c.options < 10 || (c.right / c.options >= 0.08 && c.right / c.options <= 0.45);

export interface MelodyOption { notes: string[]; correct: boolean }
export type MelodyFeature = 'pitch' | 'pitchClass' | 'contour' | 'contourBag' | 'positional' | 'positionalPC';

/** Scientific pitches, including octave: C4 = 60. Reject malformed test data. */
export function melodyPitch(note: string): number {
  const match = /^([A-G])([#b]?)(\d)$/.exec(note);
  if (!match) throw new Error(`Invalid melody pitch: ${note}`);
  return 12 * (Number(match[3]) + 1)
    + ({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[match[1]] ?? 0)
    + (match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0);
}
export const melodyContour = (pitches: readonly number[]) => pitches.slice(1).map((p, i) => Math.sign(p - pitches[i]));

/** Sum min(countA(p), countB(p)), preserving repeated pitches/directions. */
export function multisetOverlap<T>(a: readonly T[], b: readonly T[]): number {
  const remaining = new Map<T, number>();
  for (const p of b) remaining.set(p, (remaining.get(p) ?? 0) + 1);
  let count = 0;
  for (const p of a) {
    const n = remaining.get(p) ?? 0;
    if (n > 0) { count++; remaining.set(p, n - 1); }
  }
  return count;
}

/** Total overlap with BOTH other options. A tie, on either side, makes no pick.
 * Contour compares corresponding directions in the ordered sequence; contourBag
 * additionally guards the simpler shortcut of counting ups/downs/repetitions. */
export function melodyCuePick(choices: readonly MelodyOption[], feature: MelodyFeature, most: boolean): number | null {
  const sequences = choices.map(c => {
    if (feature === 'positional') return c.notes;
    if (feature === 'positionalPC') return c.notes.map(n => n.replace(/\d/, ''));
    const pitches = c.notes.map(melodyPitch);
    return feature.startsWith('contour') ? melodyContour(pitches)
      : feature === 'pitchClass' ? pitches.map(p => p % 12) : pitches;
  });
  const scores = sequences.map((a, i) => sequences.reduce((sum, b, j) => sum + (i === j ? 0 : feature === 'contour' || feature.startsWith('positional') ? a.filter((value, k) => value === b[k]).length : multisetOverlap<number | string>(a, b)), 0));
  const best = most ? Math.max(...scores) : Math.min(...scores);
  const winners = scores.flatMap((score, i) => score === best ? [i] : []);
  return winners.length === 1 ? winners[0] : null;
}

export function melodyCueHits(items: readonly { melodyChoices: MelodyOption[] }[], feature: MelodyFeature, most: boolean): number {
  return items.filter(item => {
    const picked = melodyCuePick(item.melodyChoices, feature, most);
    return picked !== null && item.melodyChoices[picked].correct;
  }).length;
}
