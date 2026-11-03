import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { ChoiceInput } from '../inputs/ChoiceInput';

vi.mock('../../../notation/StaffNotation', () => ({ StaffNotation: () => null }));
afterEach(cleanup);

const options = [
  { value: 'wrong', label: 'H-W-W-H-W-W-W', correct: false },
  { value: 'right', label: 'W-W-H-W-W-W-H', correct: true },
];

type State = Pick<ComponentProps<typeof ChoiceInput>, 'selected' | 'tried' | 'final'>;
const states: { name: string; props: State; expected: string[] }[] = [
  { name: 'open/reset', props: { selected: null, tried: [], final: false }, expected: ['open', 'open'] },
  { name: 'selected wrong', props: { selected: 'wrong', tried: [], final: false }, expected: ['selected', 'open'] },
  { name: 'selected right', props: { selected: 'right', tried: [], final: false }, expected: ['open', 'selected'] },
  { name: 'tried, selection cleared', props: { selected: null, tried: ['wrong'], final: false }, expected: ['tried', 'open'] },
  { name: 'tried, selection retained', props: { selected: 'wrong', tried: ['wrong'], final: false }, expected: ['tried', 'open'] },
  { name: 'retry selected', props: { selected: 'right', tried: ['wrong'], final: false }, expected: ['tried', 'selected'] },
  { name: 'final wrong', props: { selected: 'wrong', tried: [], final: true }, expected: ['wrong', 'answer'] },
  { name: 'final right', props: { selected: 'right', tried: [], final: true }, expected: ['open', 'answer'] },
  { name: 'final after retry', props: { selected: 'right', tried: ['wrong'], final: true }, expected: ['wrong', 'answer'] },
];

// JSDOM cannot sample animation frames or emulate the CSS hover/active cascade.
// Guard the rendered contract in EVERY state, not just the tried destination.
// The browser sweep covers real pointer/touch frames; themeContrast.test.ts
// checks these theme tokens and feedback tints against the day/night surfaces.
function expectInstantColours(button: HTMLButtonElement) {
  expect(button.style.transition).toBe('none');
  for (const element of [button, ...button.querySelectorAll<HTMLElement>('*')]) {
    expect([...element.classList].filter((cls) => /(?:^|:)transition(?:-|$)/.test(cls))).toEqual([]);
    // No interaction utility may replace just one half of the colour pair.
    expect([...element.classList].filter((cls) => /(?:hover|active|focus(?:-visible|-within)?):/.test(cls))).toEqual([]);
  }
}

function expectColourPair(button: HTMLButtonElement, state: string, melody: boolean) {
  expect(button.dataset.state).toBe(state);
  expect(button.disabled).toBe(['tried', 'wrong', 'answer'].includes(state) || button.getAttribute('aria-pressed') === null);
  if (state === 'answer' || state === 'wrong') {
    expect(button.style.backgroundColor).toBe('');
    expect(button.style.color).toBe('');
    expect(button.classList.contains(state === 'answer' ? 'bg-emerald-500/15' : 'bg-red-500/15')).toBe(true);
    expect(button.classList.contains(state === 'answer' ? 'text-success' : 'text-danger')).toBe(true);
  } else {
    const accentFill = state === 'selected' && !melody;
    expect(button.style.backgroundColor).toBe(state === 'tried' ? 'transparent' : accentFill ? 'var(--accent)' : 'var(--bg-raised)');
    expect(button.style.color).toBe(state === 'tried' ? 'var(--text-muted)' : accentFill ? 'var(--on-accent)' : 'var(--text)');
  }
  expect(button.querySelector('.line-through') !== null).toBe(state === 'tried' || state === 'wrong');
}

describe.each([false, true])('ChoiceInput instant colour pairs (W4b), melody=%s', (melody) => {
  const choices = melody
    ? options.map((option) => ({ ...option, melody: [{ natural: 'C' as const, accidental: '' as const, octave: 4 }] }))
    : options;

  it.each(states)('keeps colours paired from $name into every destination state', (source) => {
    const props = { options: choices, onSelect: () => {} };
    const { rerender } = render(<ChoiceInput {...props} {...source.props} />);
    const buttons = screen.getAllByRole<HTMLButtonElement>('button');
    for (const destination of states) {
      // Reuse the same DOM nodes, as selection/retry/reset do in the check.
      for (const state of [source, destination]) {
        rerender(<ChoiceInput {...props} {...state.props} />);
        screen.getAllByRole<HTMLButtonElement>('button').forEach((button, i) => {
          expect(button).toBe(buttons[i]);
          expectInstantColours(button);
          expectColourPair(button, state.expected[i], melody);
        });
      }
    }
  });
});

describe('ChoiceInput transition guard controls', () => {
  it.each(['selected', 'tried'])('rejects the previous %s implementation', (state) => {
    render(<ChoiceInput options={options} selected="wrong" tried={state === 'tried' ? ['wrong'] : []} final={false} onSelect={() => {}} />);
    const button = screen.getAllByRole<HTMLButtonElement>('button')[0];
    expectInstantColours(button);
    const control = button.cloneNode(true) as HTMLButtonElement;
    control.classList.add('transition-colors');
    // The earlier patch only disabled transitions for tried. Both the
    // unguarded selected state and the tried-only workaround must fail.
    if (state === 'selected') control.style.removeProperty('transition');
    expect(() => expectInstantColours(control)).toThrow();
  });
});
