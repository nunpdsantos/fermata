/**
 * The result screen says how scoring works (W4b review): right first time 1,
 * on the second try ½ — and, when the set had one, that a question with only
 * two options has one try.
 */
import i18n from '../../../../i18n';
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

for (const [lang, expected] of [['en', '7.5 of 9'], ['pt', '7,5 em 9'], ['es', '7,5 de 9']]) {
  it(`${lang}: reachable half-point mark names the total and explains scoring`, async () => {
    await i18n.changeLanguage(lang);
    render(<ResultScreen title="T" kind="check" passed actions={[]} outcomes={Array.from({ length: 9 }, (_, i) => outcome(mc(String(i), ['A', 'B', 'C']), 1))} />);
    expect(screen.getByTestId('check-result').textContent).toContain(expected);
    expect(screen.getByTestId('result-scoring').textContent).toContain('½');
    await i18n.changeLanguage('en');
  });
}

it('distinguishes a second-try half point from a miss', () => {
  render(<ResultScreen title="T" kind="check" passed={false} actions={[]} outcomes={[
    outcome(mc('half', ['A', 'B', 'C']), 0.5), outcome(mc('miss', ['A', 'B', 'C']), 0),
  ]} />);
  expect(screen.getAllByTestId('half-credit')).toHaveLength(1);
  expect(screen.getByTestId('half-credit').textContent).toBe('½ · Right on the second try');
});
