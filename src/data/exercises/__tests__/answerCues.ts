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

export type Choice = { label: string; correct: boolean };
export interface ServedSet { id: string; prompt: string; choices: Choice[] }

/** Served multiple-choice items of a level in one language (authored + generated). */
export function servedSets(level: number, lang: ContentLanguage): ServedSet[] {
  return levelCorpus(level, lang)
    .filter((i) => i.exercise.config.type === 'multiple_choice')
    .map((i) => ({ id: i.exercise.id, prompt: i.exercise.prompt, choices: (i.exercise.config as { choices: Choice[] }).choices }));
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
