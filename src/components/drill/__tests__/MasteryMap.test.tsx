import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MasteryMap } from '../MasteryMap';
import { DRILL_FAMILIES } from '../../../core/types/drill';
import type { DrillFamily, DrillItem, ItemSrsState, MasteryTier } from '../../../core/types/drill';

function makeItem(id: string, family: DrillFamily): DrillItem {
  return {
    id,
    family,
    promptKey: 'x',
    promptParams: {},
    input: { format: 'choice', choices: ['A', 'B'] },
    answer: { kind: 'choice', correct: 'A' },
    whyKey: 'y',
    whyParams: {},
    rank: 0,
  };
}

function makeState(tier: MasteryTier, due = 0): ItemSrsState {
  return {
    card: { due, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 1, reps: 1, lapses: 0, state: 2, learning_steps: 0 },
    history: [],
    tier,
    introCorrectCount: 1,
  };
}

const ALL_ON = Object.fromEntries(DRILL_FAMILIES.map((f) => [f, true])) as Record<DrillFamily, boolean>;
const NOW = 1_000_000;

afterEach(cleanup);

describe('MasteryMap', () => {
  it('renders a switch per family with the correct on/off state', () => {
    const families = { ...ALL_ON, interval: false };
    render(
      <MasteryMap
        bank={[makeItem('a', 'triad'), makeItem('b', 'interval')]}
        items={{}}
        families={families}
        now={NOW}
        onToggleFamily={() => {}}
        onBack={() => {}}
      />,
    );
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(DRILL_FAMILIES.length);
    // Triads enabled, Intervals disabled.
    expect(screen.getByRole('switch', { name: 'Triads' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('switch', { name: 'Intervals' }).getAttribute('aria-checked')).toBe('false');
  });

  it('writes the flipped value for the tapped family', () => {
    const onToggle = vi.fn();
    render(
      <MasteryMap
        bank={[makeItem('a', 'triad')]}
        items={{}}
        families={ALL_ON}
        now={NOW}
        onToggleFamily={onToggle}
        onBack={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('switch', { name: 'Triads' }));
    expect(onToggle).toHaveBeenCalledWith('triad', false); // was on → off
  });

  it('shows the by-heart total and due-today count in the header', () => {
    const items: Record<string, ItemSrsState> = {
      a: makeState('byHeart', NOW + 10_000), // not due yet
      b: makeState('review', NOW - 1000), // due in the past → due today
    };
    render(
      <MasteryMap
        bank={[makeItem('a', 'triad'), makeItem('b', 'triad')]}
        items={items}
        families={ALL_ON}
        now={NOW}
        onToggleFamily={() => {}}
        onBack={() => {}}
      />,
    );
    expect(screen.getByText('1 fact by heart')).toBeDefined();
    expect(screen.getByText('1 due today')).toBeDefined();
  });

  it('Back fires onBack', () => {
    const onBack = vi.fn();
    render(
      <MasteryMap
        bank={[]}
        items={{}}
        families={ALL_ON}
        now={NOW}
        onToggleFamily={() => {}}
        onBack={onBack}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
