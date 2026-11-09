/**
 * Learn answers that are note / chord names are SHOWN with real ♭ / ♯
 * (brief C, 9 Nov 2026); the option's value, its accessible name and the
 * grading keep the authored ASCII. Prose options stay exactly as written.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { ChoiceInput } from '../inputs/ChoiceInput';
import { validateAnswer } from '../validateExercise';
import type { ChoiceOption } from '../exerciseHelpers';
import type { MultipleChoiceConfig } from '../../../../core/types/exercise';

afterEach(cleanup);

const OPTIONS: ChoiceOption[] = [
  { label: 'F', value: 'F', correct: false },
  { label: 'D#', value: 'D#', correct: true },
  { label: 'F–Ab–C–Eb', value: 'F–Ab–C–Eb', correct: false },
  { label: 'Key signature: F#', value: 'Key signature: F#', correct: false },
];

describe('Learn choices: glyphs on display only', () => {
  it('names show ♭ / ♯; prose stays as written; the accessible name and value stay ASCII', () => {
    const onSelect = vi.fn();
    render(<ChoiceInput options={OPTIONS} selected={null} tried={[]} final={false} onSelect={onSelect} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual(['F', 'D♯', 'F–A♭–C–E♭', 'Key signature: F#']);
    // Accessible names and e2e hooks are unchanged.
    expect(buttons.map((b) => b.getAttribute('aria-label'))).toEqual(['F', 'D#', 'F–Ab–C–Eb', 'Key signature: F#']);
    expect(buttons.map((b) => b.getAttribute('data-answer'))).toEqual(['F', 'D#', 'F–Ab–C–Eb', 'Key signature: F#']);
    fireEvent.click(screen.getByRole('button', { name: 'D#' }));
    expect(onSelect).toHaveBeenCalledWith('D#');
  });

  it('answer checking still compares the underlying values, never the glyph text', () => {
    const config: MultipleChoiceConfig = {
      type: 'multiple_choice',
      choices: [{ label: 'F', correct: false }, { label: 'D#', correct: true }, { label: 'F#', correct: false }, { label: 'E', correct: false }],
    } as MultipleChoiceConfig;
    expect(validateAnswer(config, 'D#').correct).toBe(true);
    expect(validateAnswer(config, 'D♯').correct).toBe(false);
    expect(validateAnswer(config, 'F#').correct).toBe(false);
  });

  it('the final answer is marked on the glyph text too', () => {
    render(<ChoiceInput options={OPTIONS} selected="D#" tried={[]} final onSelect={() => {}} />);
    const answer = screen.getAllByRole('button').find((b) => b.dataset.state === 'answer')!;
    expect(answer.textContent).toBe('D♯');
    expect(answer.getAttribute('aria-label')).toContain('D#');
  });
});
