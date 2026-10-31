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
 */
import { describe, it, expect } from 'vitest';
import { CONTENT_LANGS, LEVELS } from './learnCorpus';
import { HEURISTICS, heuristicRates, uniqueExtremes, type ServedSet } from './answerCues';

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
    }
  });
}
