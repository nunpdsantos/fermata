/**
 * Corpus-level invariant: multiple-choice answer positions must be
 * distributed, stable per exercise, and never predictable from position.
 * Guards against the F-01 audit finding (521/522 correct answers at index 0).
 */
import { describe, it, expect } from 'vitest';
import { generateAllForLevel, mergeExerciseMaps } from '../../../../data/exercises/exerciseGenerator';
import { generateMultipleChoiceOptions } from '../exerciseHelpers';
import type { ExerciseDefinition } from '../../../../core/types/exercise';

import exercisesL1 from '../../../../data/exercises/exercisesL1';
import exercisesL2 from '../../../../data/exercises/exercisesL2';
import exercisesL3 from '../../../../data/exercises/exercisesL3';
import exercisesL4 from '../../../../data/exercises/exercisesL4';
import exercisesL5 from '../../../../data/exercises/exercisesL5';
import exercisesL6 from '../../../../data/exercises/exercisesL6';
import exercisesL7 from '../../../../data/exercises/exercisesL7';
import exercisesL8 from '../../../../data/exercises/exercisesL8';
import exercisesL9 from '../../../../data/exercises/exercisesL9';
import templatesL1 from '../../../../data/exercises/templatesL1';
import templatesL2 from '../../../../data/exercises/templatesL2';
import templatesL3 from '../../../../data/exercises/templatesL3';
import templatesL4 from '../../../../data/exercises/templatesL4';
import templatesL5 from '../../../../data/exercises/templatesL5';
import templatesL6 from '../../../../data/exercises/templatesL6';
import templatesL7 from '../../../../data/exercises/templatesL7';
import templatesL8 from '../../../../data/exercises/templatesL8';
import templatesL9 from '../../../../data/exercises/templatesL9';

const AUTHORED = [exercisesL1, exercisesL2, exercisesL3, exercisesL4, exercisesL5, exercisesL6, exercisesL7, exercisesL8, exercisesL9];
const TEMPLATES = [templatesL1, templatesL2, templatesL3, templatesL4, templatesL5, templatesL6, templatesL7, templatesL8, templatesL9];

function resolvedMultipleChoice(): ExerciseDefinition[] {
  const all: ExerciseDefinition[] = [];
  for (let i = 0; i < 9; i++) {
    const merged = mergeExerciseMaps(AUTHORED[i], generateAllForLevel(TEMPLATES[i], 'en'));
    for (const list of Object.values(merged)) {
      for (const ex of list) {
        if (ex.config.type === 'multiple_choice') all.push(ex);
      }
    }
  }
  return all;
}

describe('multiple-choice answer order (corpus)', () => {
  const corpus = resolvedMultipleChoice();

  it('covers the full resolved multiple-choice corpus', () => {
    expect(corpus.length).toBeGreaterThan(500);
  });

  it('renders the same option order for the same exercise every time', () => {
    for (const ex of corpus) {
      if (ex.config.type !== 'multiple_choice') continue;
      const a = generateMultipleChoiceOptions(ex.config.choices, ex.id);
      const b = generateMultipleChoiceOptions(ex.config.choices, ex.id);
      expect(a.map((o) => o.label)).toEqual(b.map((o) => o.label));
    }
  });

  it('preserves the choice set and exactly one correct option', () => {
    for (const ex of corpus) {
      if (ex.config.type !== 'multiple_choice') continue;
      const options = generateMultipleChoiceOptions(ex.config.choices, ex.id);
      expect(options).toHaveLength(ex.config.choices.length);
      expect(options.filter((o) => o.correct)).toHaveLength(1);
      expect(new Set(options.map((o) => o.label))).toEqual(
        new Set(ex.config.choices.map((c) => c.label)),
      );
    }
  });

  it('distributes correct-answer positions so position never predicts the answer', () => {
    const positionCounts = new Map<number, number>();
    for (const ex of corpus) {
      if (ex.config.type !== 'multiple_choice') continue;
      const options = generateMultipleChoiceOptions(ex.config.choices, ex.id);
      const idx = options.findIndex((o) => o.correct);
      positionCounts.set(idx, (positionCounts.get(idx) ?? 0) + 1);
    }
    const total = corpus.length;
    // With 4 options a fair spread is ~25% each; no position may dominate.
    for (const [, count] of positionCounts) {
      expect(count / total).toBeLessThan(0.45);
    }
    // At least three distinct positions must occur across the corpus.
    expect(positionCounts.size).toBeGreaterThanOrEqual(3);
  });
});
