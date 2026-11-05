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
 *   parentheses, punctuation marks, similarity, shared tokens/openings, long
 *   words, average word length, curriculum technical terms and both lesson-overlap fractions,
 *   "pick the r-th largest option"
 *   (ties share their ranks) hits the answer in at most chance + 15 points of
 *   the sets for every r (4 options: 40%; 3 options: 50%), and "pick one of
 *   the two largest" in ≤ 65% (chance 50%). Moving the answer from "longest"
 *   to "second-longest" is the same cue, so every rank is bounded.
 * - Lesson vocabulary (round 4b): the option sharing the most content words
 *   with the module's own lesson text is the answer in ≤ 45% of sets.
 * - Outlier: where one option is at least 1.25× longer than every other, it
 *   is the answer at most chance + 15 points of the time (levels with ≥ 10
 *   such sets).
 * - Composite (round 2): pick the largest score = distinct lesson content
 *   words − 2×absolute words + hedges + an example/quotation indicator.
 *   This fixed, human-applicable shortcut hits ≤ 40% per level/language.
 */
import { oddOneOut, oddOpening, parallelWrongOptions, wordAnswerShares, cueShareWithinBounds, wordShareWithinBounds } from './answerCues';
import { describe, it, expect } from 'vitest';
import { CONTENT_LANGS, LEVELS, levelCorpus } from './learnCorpus';
import { compositeScore, compositePick, compositeRate, COMPOSITE_BOUND } from './answerCues';
import { HEURISTICS, heuristicRates, uniqueExtremes, rankCells, uniqueRank, amongTopTwo, rankProbs, RANK_FEATURES, servedSets, longOutliers, rankBound, OUTLIER_MIN_SETS, lessonVocabRate, LESSON_VOCAB_BOUND, CONTEXT_RANK_FEATURES, valueRankProbs, lessonFractionRate, technicalVocabulary, allLessonVocabulary, STOP_WORDS, type ServedSet } from './answerCues';

describe('answer-cue heuristics', () => {
  it('the fixed composite rule detects planted combined cues in every language and shares ties', () => {
    const labels = {
      en: ['A chord can resolve, for example “tonic”', 'A chord always resolves', 'A chord never resolves', 'Only a chord'],
      pt: ['Um acorde pode resolver, por exemplo «tónica»', 'Um acorde resolve sempre', 'Um acorde nunca resolve', 'Apenas um acorde'],
      es: ['Un acorde puede resolver, por ejemplo «tónica»', 'Un acorde resuelve siempre', 'Un acorde nunca resuelve', 'Solo un acorde'],
    };
    for (const lang of CONTENT_LANGS) {
      const lex = new Set(lang === 'en' ? ['chord', 'resolve', 'tonic'] : ['acorde', 'resolver', 'tónica']);
      // Three lesson words + one hedge + one illustration (example and quote
      // together still count once); one lesson word minus two for "always".
      expect(compositeScore(labels[lang][0], lex, lang)).toBe(5);
      expect(compositeScore(labels[lang][1], lex, lang)).toBe(-1);
      // No single positive feature uniquely favors the answer here: the
      // second option has more lesson words, the third shares its hedge,
      // and the fourth shares its quotation. Their combination still wins.
      const chord = lang === 'en' ? 'chord' : 'acorde';
      const resolve = lang === 'en' ? 'resolve' : 'resolver';
      const tonic = lang === 'en' ? 'tonic' : 'tónica';
      const hedge = lang === 'en' ? 'can' : lang === 'pt' ? 'pode' : 'puede';
      const absolute = lang === 'en' ? 'always' : lang === 'pt' ? 'sempre' : 'siempre';
      const combinedLex = new Set([...lex, 'dominant']);
      const combinedLabels = [labels[lang][0], `${chord} ${resolve} ${tonic} dominant`, `${chord} ${hedge} ${absolute} ${resolve} ${tonic}`, `${chord} “${tonic}”`];
      const values = combinedLabels.map(label => compositeScore(label, combinedLex, lang));
      expect(values).toEqual([5, 4, 2, 3]);
      expect(valueRankProbs(values, 0)[0]).toBe(1);
      const planted: ServedSet = { id: 'composite', prompt: '', choices: labels[lang].map((label, i) => ({ label, correct: i === 0 })) };
      expect(compositePick(planted, lang)).toBe(1);
      const reversed = { ...planted, choices: [...planted.choices].reverse() };
      expect(compositePick(reversed, lang)).toBe(1);
      const tied = { ...planted, choices: planted.choices.map((c) => ({ ...c, label: labels[lang][0] })) };
      expect(compositePick(tied, lang)).toBe(0.25);
      expect(compositePick({ ...planted, choices: planted.choices.map((c, i) => ({ ...c, correct: i === 1 })) }, lang)).toBe(0);
    }
  });
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

  it('each new feature detects a planted cue and divides tied ranks fairly', () => {
    const fixture = (labels: string[], correct = 0): ServedSet => ({
      id: 'planted', moduleId: 'l1u1m1', prompt: '',
      choices: labels.map((label, i) => ({ label, correct: i === correct })),
    });
    const check = (name: string, labels: string[], values: number[], ranks: number[]) => {
      const f = CONTEXT_RANK_FEATURES[name];
      const set = fixture(labels);
      f(set, 'en').forEach((value, i) => expect(value, `${name} option ${i}`).toBeCloseTo(values[i], 12));
      expect(valueRankProbs(f(set, 'en'), 0), name).toEqual(ranks);
      // Every feature must yield chance when all four labels are identical.
      expect(valueRankProbs(f(fixture(Array(4).fill(labels[0])), 'en'), 0), name).toEqual([0.25, 0.25, 0.25, 0.25]);
      // The tied options share credit even when one is the answer at index 1.
      const tied = fixture([labels[0], labels[0], 'zzqx', 'vvqx'], 1);
      const probs = valueRankProbs(f(tied, 'en'), 1);
      expect(probs.reduce((a, b) => a + b, 0), name).toBeCloseTo(1);
      expect(probs[0], name).toBe(0.5);
    };
    check('similar_to_others', ['a b', 'a c', 'b d', 'z'], [2 / 3, 1 / 3, 1 / 3, 0], [1, 0, 0, 0]);
    check('shared_tokens', ['a b', 'a c', 'b d', 'z'], [1, 0.5, 0.5, 0], [1, 0, 0, 0]);
    // A common opening is necessarily shared by at least two options.
    check('prefix_shared', ['shared a', 'shared b', 's', 'z'], [7, 7, 1, 0], [0.5, 0.5, 0, 0]);
    check('avgwordlen', ['abcdef abcdefgh', 'abcd', 'ab', 'a'], [7, 4, 2, 1], [1, 0, 0, 0]);
    check('long_words', ['counterpoint modulation', 'modulation', 'note', 'rest'], [2, 1, 0, 0], [1, 0, 0, 0]);
    const term = [...technicalVocabulary('en')][0];
    expect(term).toBeDefined();
    check('tech_vocab', [`${term} ${term}`, term, 'zzqx', 'vvqx'], [2, 1, 0, 0], [1, 0, 0, 0]);
    const word = [...allLessonVocabulary('l1u1m1', 'en')].find((w) => !STOP_WORDS.en.has(w))!;
    expect(word).toBeDefined();
    for (const feature of ['lesson_text_overlap', 'lesson_content_frac']) {
      check(feature, [`${word} ${word}`, `${word} zzqx`, 'zzqx', 'vvqx'], [1, 0.5, 0, 0], [1, 0, 0, 0]);
    }
  });

  it('splits a fractional-score tie crossing the top-two boundary, including rounding noise', () => {
    expect(valueRankProbs([1, 0.1 + 0.2, 0.3, 0], 1)).toEqual([0, 0.5, 0.5, 0]);
    expect(valueRankProbs([1, 0.1 + 0.2, 0.3, 0], 2)).toEqual([0, 0.5, 0.5, 0]);
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
      it(`L${n}: the qualified, illustrated, lesson-worded composite pick ≤ 40%`, () => {
        const rate = compositeRate(servedSets(n, lang), lang);
        expect(rate, `composite pick ${(100 * rate).toFixed(1)}%`).toBeLessThanOrEqual(COMPOSITE_BOUND);
      });
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

      it(`L${n}: no wording-feature rank gives the answer away`, () => {
        const { ranks, topTwo } = rankCells(servedSets(n, lang), lang);
        const over = [...ranks, ...topTwo]
          .filter((c) => c.rate > c.bound + 1e-12)
          .map((c) => `${topTwo.includes(c) ? `among the two largest by ${c.feature}` : `${c.feature} rank ${c.rank}`} (${c.size} options) ${(100 * c.rate).toFixed(1)}% > ${(100 * c.bound).toFixed(0)}%`);
        expect(over).toEqual([]);
      });

      it(`L${n}: the option in the lesson's own words is not usually the answer`, () => {
        const r = lessonVocabRate(servedSets(n, lang), lang);
        expect(r, `lesson-vocabulary pick ${(100 * r).toFixed(1)}%`).toBeLessThanOrEqual(LESSON_VOCAB_BOUND);
      });

      for (const content of [false, true]) {
        it(`L${n}: lesson ${content ? 'content' : 'all'}-word fraction ≤ 45%`, () => {
          const r = lessonFractionRate(servedSets(n, lang), lang, content);
          expect(r, `lesson fraction pick ${(100 * r).toFixed(1)}%`).toBeLessThanOrEqual(LESSON_VOCAB_BOUND);
        });
      }

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


// Two-sided bounds prevent both "pick the odd one" and "never pick it".
describe('odd-option and one-sided-word regression fixtures', () => {
  const fixture = (correct: number): ServedSet => ({ id: 'planted', prompt: '', choices:
    ['isolated melody', 'shared chord phrase a', 'shared chord phrase b', 'shared chord phrase c'].map((label, i) => ({ label, correct: i === correct })) });
  for (const correct of [0, 1]) {
    it(`rejects the ${correct === 0 ? 'always' : 'never'} pick odd-option direction`, () => {
      const sets = Array.from({ length: 10 }, () => fixture(correct));
      for (const gap of [0.1, 0.2]) {
        const count = oddOneOut(sets, gap);
        expect(count).toMatchObject({ sets: 10, right: correct === 0 ? 10 : 0 });
        expect(cueShareWithinBounds(count, 0.1)).toBe(false);
      }
      for (const k of [1, 2]) {
        expect(oddOpening(sets, k)).toMatchObject({ sets: 10, right: correct === 0 ? 10 : 0 });
        expect(cueShareWithinBounds(oddOpening(sets, k), 0.1)).toBe(false);
      }
      expect(parallelWrongOptions([fixture(correct)])).toEqual(correct === 0 ? ['planted'] : []);
    });
  }
  it('shares neutral words across answers and rejects both word-cue directions in each language', () => {
    for (const lang of CONTENT_LANGS) {
      const word = lang === 'en' ? 'because' : 'porque';
      for (const correct of [0, 1]) {
        const sets = Array.from({ length: 10 }, () => ({ ...fixture(correct), choices:
          fixture(correct).choices.map((c, i) => ({ ...c, label: i === 0 ? `${word} ${word}` : c.label })) }));
        const cell = wordAnswerShares(sets, lang).find(c => c.word === word)!;
        expect(cell).toEqual({ word, options: 10, right: correct === 0 ? 10 : 0 });
        expect(wordShareWithinBounds(cell)).toBe(false);
      }
    }
    expect(wordShareWithinBounds({ options: 100, right: 8 })).toBe(true);
    expect(wordShareWithinBounds({ options: 100, right: 45 })).toBe(true);
    expect(cueShareWithinBounds({ sets: 10, right: 1, ids: [] }, 0.1)).toBe(true);
    expect(cueShareWithinBounds({ sets: 10, right: 4, ids: [] }, 0.1)).toBe(true);
    expect(oddOneOut(Array(10).fill({ ...fixture(0), choices: fixture(0).choices.map(c => ({ ...c, label: 'same' })) }), 0.1).sets).toBe(0);
  });
});
for (const lang of CONTENT_LANGS) {
  describe(`${lang}: odd options and one-sided words`, () => {
    const all = LEVELS.flatMap(n => servedSets(n, lang));
    it('pooled odd-one-out stays two-sided at gap > .1, and ≤40% at gap > .2', () => {
      // The .1 pooled bound is unconditional; .2 needs ten qualifying items.
      expect(cueShareWithinBounds(oddOneOut(all, 0.1), 0.1, 0)).toBe(true);
      expect(cueShareWithinBounds(oddOneOut(all, 0.2))).toBe(true);
      expect(parallelWrongOptions(all)).toEqual([]);
    });
    it('no hedge, absolute or explanation word supports never-pick-X or pick-X', () => {
      expect(wordAnswerShares(all, lang).filter(c => !wordShareWithinBounds(c))).toEqual([]);
    });
    for (const k of [1, 2]) it(`pooled odd opening k=${k} stays two-sided`, () => {
      expect(cueShareWithinBounds(oddOpening(all, k), 0.1)).toBe(true);
    });
    for (const level of LEVELS) it(`L${level}: odd option and odd openings ≤40% when n≥10`, () => {
      const sets = servedSets(level, lang);
      const cells = [oddOneOut(sets, 0.1), oddOpening(sets, 1), oddOpening(sets, 2)];
      expect(cells.filter(c => !cueShareWithinBounds(c))).toEqual([]);
    });
  });
}

// Frozen 03fc07d melodies: the accepted baseline, including every wrong option.
import previousMelodies from './melodies-v3.json';
import exercisesL9 from '../exercisesL9';
import { melodyCueHits, melodyCuePick, multisetOverlap, type MelodyFeature } from './answerCues';

const melodies = Object.values(exercisesL9).flat().filter(e => e.config.type === 'ear_training' && e.config.mode === 'melody');
const melodyConfigs = melodies.map(e => {
  if (e.config.type !== 'ear_training' || !e.config.melodyChoices || !e.config.root) throw new Error(e.id);
  return { ...e.config, root: e.config.root, melodyChoices: e.config.melodyChoices };
});
const melodyFeatures: MelodyFeature[] = ['pitch', 'pitchClass', 'contour', 'contourBag', 'positional', 'positionalPC'];

describe('melody dictation: two-sided overlap cues on the accepted main baseline', () => {
  it('preserves all nine complete melody items exactly as on 03fc07d', () => {
    expect(melodies).toEqual(previousMelodies);
    expect(melodyConfigs.every(c => c.melodyChoices.length === 3 && c.melodyChoices.filter(o => o.correct).length === 1)).toBe(true);
  });

  it('counts repeated pitches as a multiset and abstains on all ties', () => {
    expect(multisetOverlap([60, 60, 62], [60, 62, 62])).toBe(2);
    for (const most of [true, false]) {
      expect(melodyCuePick(Array.from({ length: 3 }, (_, i) => ({ notes: ['C4', 'D4'], correct: i === 0 })), 'pitch', most)).toBeNull();
    }
  });

  for (const feature of melodyFeatures) for (const most of [true, false]) {
    it(`${feature}: ${most ? 'centroid' : 'anti-centroid'} hits at most 4 of 9`, () => {
      expect(melodyConfigs).toHaveLength(9);
      expect(melodyCueHits(melodyConfigs, feature, most)).toBeLessThanOrEqual(4);
    });
    it(`${feature}: a planted ${most ? 'centroid' : 'anti-centroid'} bias fails that same limit`, () => {
      const seed = previousMelodies.find(e => melodyCuePick(e.config.melodyChoices, feature, most) !== null)?.config.melodyChoices
        ?? [
          { notes: ['C4', 'D4', 'E4'], correct: false },
          { notes: ['C4', 'D4', 'F4'], correct: false },
          { notes: ['G4', 'G4', 'E4'], correct: false },
        ];
      const picked = melodyCuePick(seed, feature, most);
      expect(picked).not.toBeNull();
      const planted = Array.from({ length: 9 }, () => ({ melodyChoices: seed.map((c, i) => ({ ...c, correct: i === picked })) }));
      expect(melodyCueHits(planted, feature, most)).toBe(9);
      expect(melodyCueHits(planted, feature, most) <= 4).toBe(false);
    });
  }

  it('main passes every overlap gate with ties making no pick', () => {
    const before = previousMelodies.map(e => e.config);
    expect(melodyFeatures.map(f => [melodyCueHits(before, f, true), melodyCueHits(before, f, false)]))
      .toEqual([[1, 1], [2, 1], [2, 2], [1, 4], [0, 0], [0, 0]]);
  });
});
