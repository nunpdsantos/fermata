/**
 * The result screen says how scoring works (W4b review): right first time 1,
 * on the second try ½ — and, when the set had one, that a question with only
 * two options has one try.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ResultScreen } from '../ResultScreen';
import type { ItemOutcome } from '../../exercises/ExerciseRunner';
import type { ExerciseDefinition } from '../../../../core/types/exercise';

afterEach(cleanup);

const mc = (id: string, labels: string[]): ExerciseDefinition => ({
  id, type: 'multiple_choice', prompt: `${id}?`,
  config: { type: 'multiple_choice', choices: labels.map((label, i) => ({ label, correct: i === 0 })) },
});
const outcome = (exercise: ExerciseDefinition, score: 0 | 0.5 | 1): ItemOutcome => ({ exercise, answers: [], score, answer: 'x' });

describe('ResultScreen: how scoring works', () => {
  it('a set with a two-option question says it had one try', () => {
    render(<ResultScreen title="T" kind="check" passed={false} actions={[]} outcomes={[outcome(mc('a', ['Half step', 'Whole step']), 0), outcome(mc('b', ['A', 'B', 'C']), 1)]} />);
    expect(screen.getByTestId('result-scoring').textContent).toBe('Right first time scores 1, right on the second try ½. A question with only two options has one try.');
  });
  it('a set without one does not', () => {
    render(<ResultScreen title="T" kind="check" passed={false} actions={[]} outcomes={[outcome(mc('b', ['A', 'B', 'C']), 0.5)]} />);
    expect(screen.getByTestId('result-scoring').textContent).toBe('Right first time scores 1, right on the second try ½.');
  });
});
