/**
 * Audit W4-09 and its independent review — no shortcut beats knowing the
 * answer, on the multiple-choice items the app actually SERVES (authored +
 * generated), per level and language.
 *
 * - Length: the correct option is the strictly longest in ≤ 35% of items;
 *   where one option is uniquely longest — or uniquely shortest — it is the
 *   correct one ≥ 10% of the time (0% would be a trick the other way).
 * - Every test-wiseness heuristic of the review (answerCues.ts: longest /
 *   shortest by characters and words, most / least like the others, prompt-
 *   word overlap, shared vocabulary, "no absolute words", longest without
 *   absolute words, most punctuation, most digits) hits ≤ 40% (chance 25%).
 * - Rank family (round 4): for characters, words, punctuation, numerals,
 *   parentheses and all punctuation marks, "pick the r-th largest option"
 *   (ties share their ranks) hits the answer in at most chance + 15 points of
 *   the sets for every r (4 options: 40%; 3 options: 50%), and "pick one of
 *   the two largest" in ≤ 65% (chance 50%). Moving the answer from "longest"
 *   to "second-longest" is the same cue, so every rank is bounded.
 * - Lesson vocabulary (round 4b): the option sharing the most content words
 *   with the module's own lesson text is the answer in ≤ 45% of sets.
 * - Outlier: where one option is at least 1.25× longer than every other, it
 *   is the answer at most chance + 15 points of the time (levels with ≥ 10
 *   such sets).
 */
import { describe, it, expect } from 'vitest';
import { CONTENT_LANGS, LEVELS, levelCorpus } from './learnCorpus';
import { HEURISTICS, heuristicRates, uniqueExtremes, rankCells, uniqueRank, amongTopTwo, rankProbs, RANK_FEATURES, servedSets, longOutliers, rankBound, OUTLIER_MIN_SETS, lessonVocabRate, LESSON_VOCAB_BOUND, type ServedSet } from './answerCues';

describe('answer-cue heuristics', () => {
  it('each heuristic finds a planted cue and credits ties fairly', () => {
    const planted: ServedSet = { id: 'p', prompt: 'Which is right?', choices: [
      { label: 'The right answer, explained at length (with detail: 1, 2, 3)', correct: true },
      { label: 'It is always wrong', correct: false },
      { label: 'It is never right', correct: false },
      { label: 'Only sometimes', correct: false },
    ] };
    for (const name of ['longest (chars)', 'longest (words)', 'no absolute words', 'longest without absolute words', 'most punctuation', 'most digits']) {
      expect(HEURISTICS[name](planted, 'en'), name).toBe(1);
    }
    const tie: ServedSet = { id: 't', prompt: '', choices: [{ label: 'aa', correct: true }, { label: 'bb', correct: false }, { label: 'c', correct: false }] };
    expect(HEURISTICS['longest (chars)'](tie, 'en')).toBe(0.5);
  });

  it('the rank family reads unique ranks, makes no pick on a tie, and splits a tie at the top-two cut', () => {
    const second: ServedSet = { id: 's', prompt: '', choices: [
      { label: 'a much longer wrong option', correct: false },
      { label: 'the right one', correct: true },
      { label: 'short', correct: false },
      { label: 'tiny', correct: false },
    ] };
    expect(uniqueRank(second, RANK_FEATURES.characters)).toBe(2);
    expect(amongTopTwo(second, RANK_FEATURES.characters)).toBe(1);
    const cells = rankCells([second]).ranks.filter((c) => c.feature === 'characters');
    expect(cells.find((c) => c.rank === 2)!.rate).toBe(1);
    expect(cells.find((c) => c.rank === 1)!.rate).toBe(0);
    expect(rankProbs(second, RANK_FEATURES['all punctuation'])).toEqual([0.25, 0.25, 0.25, 0.25]);
    const tied: ServedSet = { id: 'x', prompt: '', choices: [
      { label: 'abcdefghij', correct: false }, { label: 'abcde', correct: true }, { label: 'vwxyz', correct: false }, { label: 'a', correct: false },
    ] };
    expect(uniqueRank(tied, RANK_FEATURES.characters)).toBe(0);
    expect(amongTopTwo(tied, RANK_FEATURES.characters)).toBe(0.5);
    expect(rankProbs(tied, RANK_FEATURES.characters)).toEqual([0, 0.5, 0.5, 0]);
    expect(uniqueRank({ ...tied, choices: tied.choices.map((c, i) => ({ ...c, label: ['(a)', 'b', '(c)', 'd'][i] })) }, RANK_FEATURES.parentheses)).toBe(0);
  });
});

for (const lang of CONTENT_LANGS) {
  describe(`${lang}: served multiple-choice items carry no answer cue`, () => {
    for (const n of LEVELS) {
      it(`L${n}: length guards`, () => {
        const u = uniqueExtremes(n, lang);
        expect(u.longest.right / u.n, `strictly longest ${u.longest.right}/${u.n}`).toBeLessThanOrEqual(0.35);
        expect(u.longest.right / u.longest.of, `uniquely longest is right ${u.longest.right}/${u.longest.of}`).toBeGreaterThanOrEqual(0.1);
        expect(u.shortest.right / u.shortest.of, `uniquely shortest is right ${u.shortest.right}/${u.shortest.of}`).toBeGreaterThanOrEqual(0.1);
      });

      it(`L${n}: every heuristic ≤ 40%`, () => {
        const over = Object.entries(heuristicRates(n, lang)).filter(([, r]) => r > 0.4).map(([k, r]) => `${k} ${(100 * r).toFixed(1)}%`);
        expect(over).toEqual([]);
      });

      it(`L${n}: no length / punctuation / digit rank gives the answer away`, () => {
        const { ranks, topTwo } = rankCells(servedSets(n, lang));
        const over = [...ranks, ...topTwo]
          .filter((c) => c.rate > c.bound + 1e-12)
          .map((c) => `${topTwo.includes(c) ? `among the two largest by ${c.feature}` : `${c.feature} rank ${c.rank}`} (${c.size} options) ${(100 * c.rate).toFixed(1)}% > ${(100 * c.bound).toFixed(0)}%`);
        expect(over).toEqual([]);
      });

      it(`L${n}: the option in the lesson's own words is not usually the answer`, () => {
        const r = lessonVocabRate(servedSets(n, lang), lang);
        expect(r, `lesson-vocabulary pick ${(100 * r).toFixed(1)}%`).toBeLessThanOrEqual(LESSON_VOCAB_BOUND);
      });

      it(`L${n}: a conspicuously longer option is not usually the answer`, () => {
        const o = longOutliers(servedSets(n, lang));
        if (o.sets < OUTLIER_MIN_SETS) return;
        expect(o.right / o.sets, `outlier is the answer in ${o.right}/${o.sets}: ${o.ids.join(' ')}`).toBeLessThanOrEqual(rankBound(4));
      });
    }
  });
}

// Three options: chance is 1/3. Allow at most one extra expected hit across
// nine items (4/9), below the existing chance + 15 percentage point bound.
const melodyCueProbability = (notes: string[][], correct: number, positions: number[]) => {
  const scores = notes.map((a, i) => notes.reduce((sum, b, j) =>
    sum + (i === j ? 0 : positions.filter((k) => a[k] === b[k]).length), 0));
  const leaders = scores.flatMap((s, i) => s === Math.max(...scores) ? [i] : []);
  return leaders.includes(correct) ? 1 / leaders.length : 0;
};

describe('melody notation offers no shortcut around listening', () => {
  it('finds a planted central option and credits ties fairly', () => {
    expect(melodyCueProbability([['C', 'D', 'E'], ['C', 'D', 'F'], ['C', 'G', 'E']], 0, [0, 1, 2])).toBe(1);
    expect(melodyCueProbability([['C'], ['C'], ['C']], 0, [0])).toBeCloseTo(1 / 3);
  });
  for (const lang of CONTENT_LANGS) {
    for (const cue of ['central', 'first', 'last', 'endpoints'] as const) {
      it(`${lang}: ${cue} ≤ 4/9 expected accuracy`, () => {
        const hits: number[] = [];
        for (const { exercise } of levelCorpus(9, lang)) {
          const cfg = exercise.config;
          if (cfg.type !== 'ear_training' || cfg.mode !== 'melody') continue;
          const opts = cfg.melodyChoices!;
          const notes = opts.map((o) => o.notes);
          const last = notes[0].length - 1;
          const positions = cue === 'first' ? [0] : cue === 'last' ? [last] : cue === 'endpoints' ? [0, last] : notes[0].map((_, i) => i);
          hits.push(melodyCueProbability(notes, opts.findIndex((o) => o.correct), positions));
        }
        expect(hits).toHaveLength(9);
        expect(hits.reduce((a, b) => a + b, 0) / hits.length).toBeLessThanOrEqual(4 / 9 + 1e-12);
      });
    }
  }
});
