import { describe, it, expect } from 'vitest';
import {
  computeMasteryByFamily,
  dueTodayCount,
  totalByHeart,
} from '../masterySelectors';
import { DRILL_FAMILIES } from '../../../core/types/drill';
import type { DrillFamily, DrillItem, ItemSrsState, MasteryTier } from '../../../core/types/drill';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const NOW = 1_000_000;

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

/** Seeded SRS state with an explicit tier and a card due at `due`. */
function makeState(tier: MasteryTier, due: number): ItemSrsState {
  return {
    card: {
      due,
      stability: 1,
      difficulty: 5,
      elapsed_days: 0,
      scheduled_days: 1,
      reps: 1,
      lapses: 0,
      state: 2,
      learning_steps: 0,
    },
    history: [],
    tier,
    introCorrectCount: 1,
  };
}

describe('computeMasteryByFamily', () => {
  it('returns every family even when the bank is empty (all zeros)', () => {
    const result = computeMasteryByFamily([], {});
    for (const f of DRILL_FAMILIES) {
      expect(result[f]).toEqual({ newCount: 0, learning: 0, review: 0, byHeart: 0, total: 0 });
    }
  });

  it('counts an item with no state as new, and partitions tiers per family', () => {
    const bank = [
      makeItem('t1', 'triad'), // no state → new
      makeItem('t2', 'triad'), // learning
      makeItem('t3', 'triad'), // review
      makeItem('t4', 'triad'), // byHeart
      makeItem('i1', 'interval'), // review
    ];
    const items: Record<string, ItemSrsState> = {
      t2: makeState('learning', NOW),
      t3: makeState('review', NOW),
      t4: makeState('byHeart', NOW),
      i1: makeState('review', NOW),
    };

    const result = computeMasteryByFamily(bank, items);

    expect(result.triad).toEqual({ newCount: 1, learning: 1, review: 1, byHeart: 1, total: 4 });
    expect(result.interval).toEqual({ newCount: 0, learning: 0, review: 1, byHeart: 0, total: 1 });
    // The four tier counts always sum to total.
    expect(
      result.triad.newCount + result.triad.learning + result.triad.review + result.triad.byHeart,
    ).toBe(result.triad.total);
  });

  it("treats a stored 'new' tier the same as an unseen item", () => {
    const bank = [makeItem('s1', 'scale'), makeItem('s2', 'scale')];
    const items = { s1: makeState('new', NOW) }; // explicit 'new' state
    const result = computeMasteryByFamily(bank, items);
    expect(result.scale.newCount).toBe(2); // s1 (explicit new) + s2 (no state)
    expect(result.scale.total).toBe(2);
  });
});

describe('dueTodayCount', () => {
  it('counts items whose card.due <= now and tier is not new', () => {
    const bank = [
      makeItem('a', 'triad'), // review, due in past → due
      makeItem('b', 'triad'), // review, due in future → not due
      makeItem('c', 'triad'), // byHeart, due now → due
      makeItem('d', 'triad'), // new → never due
      makeItem('e', 'triad'), // no state → never due
    ];
    const items: Record<string, ItemSrsState> = {
      a: makeState('review', NOW - 1000),
      b: makeState('review', NOW + 10_000),
      c: makeState('byHeart', NOW),
      d: makeState('new', NOW - 1000),
    };
    expect(dueTodayCount(bank, items, NOW)).toBe(2);
  });

  it('is zero on a fresh (stateless) bank', () => {
    const bank = [makeItem('a', 'triad'), makeItem('b', 'interval')];
    expect(dueTodayCount(bank, {}, NOW)).toBe(0);
  });
});

describe('totalByHeart', () => {
  it('sums byHeart across all families', () => {
    const bank = [
      makeItem('t1', 'triad'),
      makeItem('i1', 'interval'),
      makeItem('i2', 'interval'),
    ];
    const items: Record<string, ItemSrsState> = {
      t1: makeState('byHeart', NOW),
      i1: makeState('byHeart', NOW),
      i2: makeState('review', NOW),
    };
    const mastery = computeMasteryByFamily(bank, items);
    expect(totalByHeart(mastery)).toBe(2);
  });
});
