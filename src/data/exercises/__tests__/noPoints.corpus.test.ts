/**
 * Audit W4-20 / decision D-16 — the `points` weighting is deleted.
 *
 * Authors had marked ~99 harder items "points: 2", but scoring always counted
 * every exercise as 1 (first try) / 0.5 (second) / 0, so the field promised a
 * weighting that never happened. Weighting would change every pass mark, so
 * the field goes: no authored or generated exercise, and no template, carries
 * it (EN, PT and ES — the overlays share the configs).
 */
import { describe, it, expect } from 'vitest';
import { fullCorpus, LEVELS, templatesFor } from './learnCorpus';

describe('no points weighting anywhere (W4-20, D-16)', () => {
  it('no served exercise has a points field', () => {
    const carrying = fullCorpus().filter((i) => 'points' in i.exercise).map((i) => `${i.lang}:${i.exercise.id}`);
    expect(carrying).toEqual([]);
  });

  it('no generation template has a points field', () => {
    const carrying = LEVELS.flatMap((n) =>
      templatesFor(n, 'en').flatMap((c) => c.templates.filter((t) => 'points' in t).map(() => c.moduleId)),
    );
    expect(carrying).toEqual([]);
  });

  it('the corpus is the whole Learn bank in three languages', () => {
    const corpus = fullCorpus();
    expect(new Set(corpus.map((i) => i.lang))).toEqual(new Set(['en', 'pt', 'es']));
    expect(corpus.filter((i) => i.lang === 'en').length).toBeGreaterThan(800);
  });
});
