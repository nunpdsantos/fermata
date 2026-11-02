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
  const v = s.choices.map((c) => feature(c.label));
  const n = v.length;
  if (new Set(v).size === 1) return new Array<number>(n).fill(1 / n);
  const mine = v[ci(s)];
  const higher = v.filter((x) => x > mine).length;
  const ties = v.filter((x) => x === mine).length;
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
export function rankCells(sets: ServedSet[]): { ranks: RankCell[]; topTwo: RankCell[] } {
  const bySize = new Map<number, ServedSet[]>();
  for (const s of sets) bySize.set(s.choices.length, [...(bySize.get(s.choices.length) ?? []), s]);
  const ranks: RankCell[] = [];
  const topTwo: RankCell[] = [];
  for (const [size, group] of bySize) {
    for (const [feature, f] of Object.entries(RANK_FEATURES)) {
      const acc = new Array<number>(size).fill(0);
      for (const s of group) rankProbs(s, f).forEach((p, i) => (acc[i] += p));
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
