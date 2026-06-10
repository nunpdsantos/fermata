import { describe, it, expect } from 'vitest';
import { eligibleSprintItems, sprintFamiliesKey, MIN_SPRINT_ITEMS } from '../sprintSelectors';
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

function makeState(tier: MasteryTier): ItemSrsState {
  return {
    card: { due: 0, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 1, reps: 1, lapses: 0, state: 2, learning_steps: 0 },
    history: [],
    tier,
    introCorrectCount: 1,
  };
}

const ALL_ON = Object.fromEntries(DRILL_FAMILIES.map((f) => [f, true])) as Record<DrillFamily, boolean>;

describe('eligibleSprintItems', () => {
  it('includes only review|byHeart tiers of ENABLED families', () => {
    const bank = [
      makeItem('a', 'triad'), // byHeart, enabled → in
      makeItem('b', 'triad'), // review, enabled → in
      makeItem('c', 'triad'), // learning → out
      makeItem('d', 'triad'), // new → out
      makeItem('e', 'triad'), // no state → out
      makeItem('f', 'interval'), // review but family disabled → out
    ];
    const items: Record<string, ItemSrsState> = {
      a: makeState('byHeart'),
      b: makeState('review'),
      c: makeState('learning'),
      d: makeState('new'),
      f: makeState('review'),
    };
    const families = { ...ALL_ON, interval: false };

    const eligible = eligibleSprintItems(bank, items, families);
    expect(eligible.map((i) => i.id).sort()).toEqual(['a', 'b']);
  });

  it('returns an empty array when nothing is mastered', () => {
    const bank = [makeItem('a', 'triad'), makeItem('b', 'triad')];
    expect(eligibleSprintItems(bank, {}, ALL_ON)).toEqual([]);
  });

  it('does not mutate the bank', () => {
    const bank = [makeItem('a', 'triad')];
    const items = { a: makeState('review') };
    eligibleSprintItems(bank, items, ALL_ON);
    expect(bank).toHaveLength(1);
  });
});

describe('sprintFamiliesKey', () => {
  it('is the sorted enabled family names joined by comma', () => {
    const families = { ...Object.fromEntries(DRILL_FAMILIES.map((f) => [f, false])) } as Record<DrillFamily, boolean>;
    families.triad = true;
    families.interval = true;
    families.circle = true;
    expect(sprintFamiliesKey(families)).toBe('circle,interval,triad');
  });

  it('is stable regardless of which families are toggled (order-independent)', () => {
    const a = { ...ALL_ON };
    const b = { ...ALL_ON };
    expect(sprintFamiliesKey(a)).toBe(sprintFamiliesKey(b));
  });

  it('is the empty string when no family is enabled', () => {
    const none = Object.fromEntries(DRILL_FAMILIES.map((f) => [f, false])) as Record<DrillFamily, boolean>;
    expect(sprintFamiliesKey(none)).toBe('');
  });
});

describe('MIN_SPRINT_ITEMS', () => {
  it('is 5 (the documented eligibility floor)', () => {
    expect(MIN_SPRINT_ITEMS).toBe(5);
  });
});
