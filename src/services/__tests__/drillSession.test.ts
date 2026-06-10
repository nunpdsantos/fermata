/**
 * drillSession tests — session composer and in-session queue helpers.
 * Fixture banks are hand-crafted stubs (only the fields used by the service).
 * ONE integration test uses generateDrillBank() with a synthetic states map.
 */
import { describe, expect, it } from 'vitest';
import {
  composeSession,
  dedupeAdjacent,
  requeueAfterMiss,
  requeueSecondExposure,
  type SessionConfig,
} from '../drillSession';
import type { DrillItem, DrillFamily, ItemSrsState } from '../../core/types/drill';
import { DRILL_FAMILIES } from '../../core/types/drill';
import { mulberry32 } from '../../core/utils/prng';
import { generateDrillBank } from '../../core/utils/drillBank';

// ─── Constants & helpers ─────────────────────────────────────────────────────

const DAY = 86_400_000;
const NOW = 1_750_000_000_000;

/** Bare minimum DrillItem stub. */
function item(id: string, family: DrillFamily = 'keysig', rank = 0): DrillItem {
  return {
    id,
    family,
    rank,
    promptKey: 'k',
    promptParams: {},
    input: { format: 'choice', choices: [] },
    answer: { kind: 'choice', correct: '' },
    whyKey: 'w',
    whyParams: {},
  };
}

/** All families enabled. */
function allFamilies(): Record<DrillFamily, boolean> {
  return Object.fromEntries(DRILL_FAMILIES.map((f) => [f, true])) as Record<DrillFamily, boolean>;
}

/** All families disabled. */
function noFamilies(): Record<DrillFamily, boolean> {
  return Object.fromEntries(DRILL_FAMILIES.map((f) => [f, false])) as Record<DrillFamily, boolean>;
}

/** Default config: length 12, 4 new, all families. */
function defaultConfig(overrides?: Partial<SessionConfig>): SessionConfig {
  return { length: 12, newPerSession: 4, families: allFamilies(), ...overrides };
}

/**
 * Build a minimal ItemSrsState at the given tier.
 * due defaults to NOW - 1 (overdue by 1ms, so isDue returns true for review/byHeart/learning).
 */
function makeState(
  tier: ItemSrsState['tier'],
  due: number = NOW - 1,
): ItemSrsState {
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
    introCorrectCount: 0,
  };
}

/**
 * Build a learning state that is NOT due (card.due is in the future).
 * These are carry-over incomplete intros.
 */
function learningState(due: number = NOW + DAY): ItemSrsState {
  return makeState('learning', due);
}

// ─── composeSession: due before fresh ────────────────────────────────────────

describe('composeSession: due items precede fresh items', () => {
  it('due items appear before fresh (stateless) items', () => {
    // r0 is due (review tier, overdue), f0 is fresh (no state)
    const bank = [item('r0', 'keysig', 0), item('f0', 'keysig', 1)];
    const states: Record<string, ItemSrsState> = {
      r0: makeState('review', NOW - 100),
    };
    const config = defaultConfig({ newPerSession: 1, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);

    const idxDue = queue.indexOf('r0');
    const idxFresh = queue.indexOf('f0');
    expect(idxDue).toBeLessThan(idxFresh);
  });
});

// ─── composeSession: newPerSession = 0 (review-only) ─────────────────────────

describe('composeSession: newPerSession = 0 (review-only)', () => {
  it('no stateless ids appear when newPerSession = 0', () => {
    const bank = [
      item('r1', 'keysig', 0),
      item('r2', 'keysig', 1),
      item('f1', 'keysig', 2), // fresh
      item('f2', 'keysig', 3), // fresh
    ];
    const states: Record<string, ItemSrsState> = {
      r1: makeState('review', NOW - 1000),
      r2: makeState('review', NOW - 500),
    };
    const config = defaultConfig({ newPerSession: 0, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);

    expect(queue).not.toContain('f1');
    expect(queue).not.toContain('f2');
  });

  it('newPerSession cap is respected exactly', () => {
    const bank = [
      item('r1', 'keysig', 0),
      item('f1', 'keysig', 1), // fresh
      item('f2', 'keysig', 2), // fresh
      item('f3', 'keysig', 3), // fresh
    ];
    const states: Record<string, ItemSrsState> = {
      r1: makeState('review', NOW - 1),
    };
    const config = defaultConfig({ newPerSession: 2, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);
    const freshInQueue = queue.filter((id) => ['f1', 'f2', 'f3'].includes(id));
    expect(freshInQueue.length).toBeLessThanOrEqual(2);
  });
});

// ─── composeSession: family filtering ────────────────────────────────────────

describe('composeSession: family filtering', () => {
  it('disabled family never appears in output', () => {
    const bank = [
      item('c1', 'circle', 0),
      item('k1', 'keysig', 1),
    ];
    const states: Record<string, ItemSrsState> = {
      c1: makeState('review', NOW - 1),
      k1: makeState('review', NOW - 1),
    };
    const families = allFamilies();
    families.circle = false;
    const config = defaultConfig({ families, newPerSession: 0 });

    const queue = composeSession(bank, states, config, NOW, 42);

    expect(queue).not.toContain('c1');
    expect(queue).toContain('k1');
  });

  it('fresh items from disabled family are excluded', () => {
    const bank = [
      item('c1', 'circle', 0), // fresh
      item('k1', 'keysig', 1), // fresh
    ];
    const states: Record<string, ItemSrsState> = {};
    const families = allFamilies();
    families.circle = false;
    const config = defaultConfig({ families, newPerSession: 4 });

    const queue = composeSession(bank, states, config, NOW, 42);

    expect(queue).not.toContain('c1');
  });
});

// ─── composeSession: no adjacent duplicates ───────────────────────────────────

describe('composeSession: dedupeAdjacent', () => {
  it('output contains no adjacent duplicates across 200 seeds with a 2-item review pool', () => {
    // Restricts the pool to 2 review items so the assembled queue is short and
    // the seeded shuffle has limited room to vary — verifies the no-adjacent-dup
    // contract holds across many shuffle outcomes without relying on a specific
    // collision happening. Direct collision coverage lives in dedupeAdjacent unit tests.
    const bank = [
      item('a', 'keysig', 0),
      item('b', 'keysig', 1),
    ];
    const states: Record<string, ItemSrsState> = {
      a: makeState('review', NOW - 100),
      b: makeState('review', NOW - 50),
    };
    // Short queue: length 12, newPerSession 0 (only 2 items in pool — dedupe tested via ranged seeds)
    const config = defaultConfig({ newPerSession: 0, length: 12 });

    for (let seed = 0; seed < 200; seed++) {
      const queue = composeSession(bank, states, config, NOW, seed);
      for (let i = 0; i < queue.length - 1; i++) {
        expect(queue[i]).not.toBe(queue[i + 1]);
      }
    }
  });

  it('dedupe drops duplicate when no non-colliding forward slot exists', () => {
    // A pool of 1 item: only one id can ever be in the queue.
    const bank = [item('solo', 'keysig', 0)];
    const states: Record<string, ItemSrsState> = {
      solo: makeState('review', NOW - 1),
    };
    const config = defaultConfig({ newPerSession: 0, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);
    // At most 1 entry; no adjacent duplicates
    for (let i = 0; i < queue.length - 1; i++) {
      expect(queue[i]).not.toBe(queue[i + 1]);
    }
    expect(queue.length).toBeLessThanOrEqual(1);
  });
});

// ─── dedupeAdjacent: unit tests ──────────────────────────────────────────────

describe('dedupeAdjacent', () => {
  it('leaves a non-colliding sequence unchanged: [a,b,a]', () => {
    expect(dedupeAdjacent(['a', 'b', 'a'])).toEqual(['a', 'b', 'a']);
  });

  it('empty array returns empty', () => {
    expect(dedupeAdjacent([])).toEqual([]);
  });

  it('single element returns unchanged: [a]', () => {
    expect(dedupeAdjacent(['a'])).toEqual(['a']);
  });

  it('[a,a,b] — swap relocates the duplicate so result has no adjacent dups and same multiset', () => {
    const input = ['a', 'a', 'b'];
    const result = dedupeAdjacent(input);

    // No adjacent duplicates
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i]).not.toBe(result[i + 1]);
    }

    // Same multiset (both 'a' and 'b' present)
    const sorted = result.slice().sort();
    expect(sorted).toEqual(['a', 'b', 'a'].slice().sort());

    // Swap actually relocated: result is one of the valid permutations
    expect(result).toEqual(['a', 'b', 'a']);
  });

  it('[a,a,a] — drops duplicates until no adjacent dups remain; output is ["a"] (pinned)', () => {
    // Trace: i=0, out[0]===out[1]; scan j from 2: out[2]==='a'===out[0], j=3 (past end).
    // No forward slot → splice out[1]; out=['a','a'].
    // i still 0; out[0]===out[1]; scan j from 2: past end. Splice out[1]; out=['a'].
    // i still 0; i < out.length-1 is 0 < 0 → false → exit.
    const result = dedupeAdjacent(['a', 'a', 'a']);
    // No adjacent duplicates
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i]).not.toBe(result[i + 1]);
    }
    // Pinned exact output
    expect(result).toEqual(['a']);
  });
});

// ─── composeSession: determinism ─────────────────────────────────────────────

describe('composeSession: determinism', () => {
  const bank = [
    item('a', 'keysig', 0),
    item('b', 'keysig', 1),
    item('c', 'keysig', 2),
    item('d', 'keysig', 3),
    item('e', 'scale', 4),
    item('f', 'scale', 5),
  ];
  const states: Record<string, ItemSrsState> = {
    a: makeState('review', NOW - 1000),
    b: makeState('review', NOW - 800),
    c: makeState('byHeart', NOW - 600),
    d: makeState('byHeart', NOW - 400),
  };
  const config = defaultConfig({ newPerSession: 2, length: 12 });

  it('same args + same seed produce identical output', () => {
    const q1 = composeSession(bank, states, config, NOW, 99);
    const q2 = composeSession(bank, states, config, NOW, 99);
    expect(q1).toEqual(q2);
  });

  it('different seed produces different order (verified on a pair of seeds)', () => {
    // Seeds 1 and 2 have different mulberry32 sequences; with ≥3 shuffleable items
    // the resulting orders must differ. We try a few seed pairs.
    let found = false;
    for (let s = 0; s < 100; s++) {
      const q1 = composeSession(bank, states, config, NOW, s);
      const q2 = composeSession(bank, states, config, NOW, s + 1);
      if (q1.join(',') !== q2.join(',')) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});

// ─── composeSession: all-caught-up ───────────────────────────────────────────

describe('composeSession: all-caught-up', () => {
  it('no due, no learning, newPerSession=0 → only review/byHeart items, fills to length or max available', () => {
    const bank = [
      item('r1', 'keysig', 0),
      item('r2', 'keysig', 1),
      item('b1', 'keysig', 2),
    ];
    // All in the future (not due)
    const states: Record<string, ItemSrsState> = {
      r1: makeState('review', NOW + DAY),
      r2: makeState('review', NOW + 2 * DAY),
      b1: makeState('byHeart', NOW + 3 * DAY),
    };
    const config = defaultConfig({ newPerSession: 0, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);

    // All output ids must be review or byHeart
    queue.forEach((id) => {
      const s = states[id];
      expect(s).toBeDefined();
      expect(['review', 'byHeart']).toContain(s.tier);
    });
    // At most min(3, 12) items
    expect(queue.length).toBeLessThanOrEqual(3);
    expect(queue.length).toBeGreaterThan(0);
  });
});

// ─── composeSession: length cap ──────────────────────────────────────────────

describe('composeSession: length cap', () => {
  it('output never exceeds config.length', () => {
    const bank = Array.from({ length: 30 }, (_, i) => item(`x${i}`, 'keysig', i));
    const states: Record<string, ItemSrsState> = {};
    // All fresh
    const config: SessionConfig = { length: 12, newPerSession: 30, families: allFamilies() };

    const queue = composeSession(bank, states, config, NOW, 42);
    expect(queue.length).toBeLessThanOrEqual(12);
  });

  it('short pool returns fewer items than length without error', () => {
    const bank = [item('a', 'keysig', 0), item('b', 'keysig', 1)];
    const states: Record<string, ItemSrsState> = {};
    const config = defaultConfig({ newPerSession: 4, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);
    expect(queue.length).toBeLessThanOrEqual(2);
    expect(() => composeSession(bank, states, config, NOW, 42)).not.toThrow();
  });
});

// ─── composeSession: fresh items are lowest-rank unseen ──────────────────────

describe('composeSession: fresh items are lowest-rank unseen', () => {
  it('always picks the lowest-rank stateless items first', () => {
    // items with higher ranks should not be introduced before lower ones
    const bank = [
      item('hi1', 'keysig', 100), // fresh
      item('lo1', 'keysig', 1),   // fresh (lowest rank)
      item('lo2', 'keysig', 2),   // fresh (second lowest)
      item('lo3', 'keysig', 3),   // fresh
    ];
    const states: Record<string, ItemSrsState> = {};
    const config = defaultConfig({ newPerSession: 2, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);
    const freshInQueue = queue.filter((id) => ['lo1', 'lo2', 'lo3', 'hi1'].includes(id));

    // lo1 and lo2 must be selected over hi1
    expect(freshInQueue).toContain('lo1');
    expect(freshInQueue).toContain('lo2');
    expect(freshInQueue).not.toContain('hi1');
    expect(freshInQueue).not.toContain('lo3');
  });
});

// ─── composeSession: learning carry-over ─────────────────────────────────────

describe('composeSession: learning carry-over', () => {
  it('learning items not in due are included (carry-over)', () => {
    const bank = [
      item('l1', 'keysig', 0),
      item('l2', 'keysig', 1),
    ];
    // learning but card.due is in the future → not due, but carry-over
    const states: Record<string, ItemSrsState> = {
      l1: learningState(NOW + DAY),
      l2: learningState(NOW + 2 * DAY),
    };
    const config = defaultConfig({ newPerSession: 0, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);
    expect(queue).toContain('l1');
    expect(queue).toContain('l2');
  });

  it('learning item that IS due appears in due block, not duplicated', () => {
    const bank = [item('l1', 'keysig', 0)];
    const states: Record<string, ItemSrsState> = {
      l1: makeState('learning', NOW - 1), // due AND learning
    };
    const config = defaultConfig({ newPerSession: 0, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);
    // l1 should appear exactly once
    const count = queue.filter((id) => id === 'l1').length;
    expect(count).toBe(1);
  });
});

// ─── composeSession: head/tail warmup ────────────────────────────────────────

describe('composeSession: head/tail warmup placement', () => {
  it('fresh items sit after 2 review warmups when ≥2 review items exist', () => {
    const bank = [
      item('r1', 'keysig', 10),
      item('r2', 'keysig', 11),
      item('f1', 'keysig', 0), // fresh — rank 0 so it's definitely chosen
    ];
    const states: Record<string, ItemSrsState> = {
      r1: makeState('review', NOW - 200),
      r2: makeState('review', NOW - 100),
    };
    const config = defaultConfig({ newPerSession: 1, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);
    const freshIdx = queue.indexOf('f1');
    // Both r1 and r2 should precede f1
    const r1Idx = queue.indexOf('r1');
    const r2Idx = queue.indexOf('r2');
    expect(freshIdx).toBeGreaterThan(r1Idx);
    expect(freshIdx).toBeGreaterThan(r2Idx);
  });

  it('fresh items appear at the front when fewer than 2 review items exist', () => {
    const bank = [
      item('r1', 'keysig', 10), // 1 due
      item('f1', 'keysig', 0),  // fresh
    ];
    const states: Record<string, ItemSrsState> = {
      r1: makeState('review', NOW - 100),
    };
    const config = defaultConfig({ newPerSession: 1, length: 12 });

    const queue = composeSession(bank, states, config, NOW, 42);
    // head = [r1], fresh sits right after head at index 1
    const r1Idx = queue.indexOf('r1');
    const f1Idx = queue.indexOf('f1');
    // fresh should come at position 1 (after the single warmup)
    expect(r1Idx).toBe(0);
    expect(f1Idx).toBe(1);
  });
});

// ─── composeSession: purity (no mutation) ────────────────────────────────────

describe('composeSession: purity', () => {
  it('does not mutate bank, states, or config inputs', () => {
    const bank: DrillItem[] = [
      item('r1', 'keysig', 0),
      item('f1', 'keysig', 1),
    ];
    const states: Record<string, ItemSrsState> = {
      r1: makeState('review', NOW - 1),
    };
    const config: SessionConfig = { length: 12, newPerSession: 1, families: allFamilies() };

    // Deep-freeze
    const frozenBank = Object.freeze(bank.map((i) => Object.freeze({ ...i })));
    const frozenStates = Object.freeze(
      Object.fromEntries(
        Object.entries(states).map(([k, v]) => [k, Object.freeze({ ...v, card: Object.freeze({ ...v.card }), history: Object.freeze([...v.history]) })]),
      ),
    );
    const frozenConfig = Object.freeze({ ...config, families: Object.freeze({ ...config.families }) });

    expect(() =>
      composeSession(
        frozenBank as unknown as DrillItem[],
        frozenStates as unknown as Record<string, ItemSrsState>,
        frozenConfig as unknown as SessionConfig,
        NOW,
        42,
      ),
    ).not.toThrow();
  });
});

// ─── requeueAfterMiss ─────────────────────────────────────────────────────────

describe('requeueAfterMiss', () => {
  const baseQueue = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  it('inserts at index + 4 when rand returns 0', () => {
    const rand = () => 0; // floor(0 * 3) = 0 → offset = 4
    const result = requeueAfterMiss(baseQueue, 0, 'miss', rand);
    expect(result[4]).toBe('miss');
  });

  it('inserts at index + 6 when rand returns 0.999', () => {
    const rand = () => 0.999; // floor(0.999 * 3) = 2 → offset = 6
    const result = requeueAfterMiss(baseQueue, 0, 'miss', rand);
    expect(result[6]).toBe('miss');
  });

  it('offset stays within +4..+6', () => {
    const queue = Array.from({ length: 20 }, (_, i) => `q${i}`);
    for (let seed = 0; seed < 50; seed++) {
      const rand = mulberry32(seed);
      const result = requeueAfterMiss(queue, 3, 'miss', rand);
      const idx = result.indexOf('miss');
      expect(idx).toBeGreaterThanOrEqual(3 + 4);
      expect(idx).toBeLessThanOrEqual(3 + 6);
    }
  });

  it('clamps to queue.length when index + offset exceeds queue', () => {
    const rand = () => 0.999; // max offset = 6
    const shortQueue = ['a', 'b', 'c'];
    const result = requeueAfterMiss(shortQueue, 2, 'miss', rand);
    // 2 + 6 = 8 > 3 → clamp to length 3
    expect(result[result.length - 1]).toBe('miss');
  });

  it('does not mutate the input queue', () => {
    const rand = () => 0;
    const original = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const copy = original.slice();
    requeueAfterMiss(original, 0, 'x', rand);
    expect(original).toEqual(copy);
  });
});

// ─── requeueSecondExposure ────────────────────────────────────────────────────

describe('requeueSecondExposure', () => {
  const baseQueue = Array.from({ length: 20 }, (_, i) => `q${i}`);

  it('inserts at index + 6 when rand returns 0', () => {
    const rand = () => 0; // floor(0 * 5) = 0 → offset = 6
    const result = requeueSecondExposure(baseQueue, 0, 'new', rand);
    expect(result[6]).toBe('new');
  });

  it('inserts at index + 10 when rand returns 0.999', () => {
    const rand = () => 0.999; // floor(0.999 * 5) = 4 → offset = 10
    const result = requeueSecondExposure(baseQueue, 0, 'new', rand);
    expect(result[10]).toBe('new');
  });

  it('offset stays within +6..+10', () => {
    const queue = Array.from({ length: 30 }, (_, i) => `q${i}`);
    for (let seed = 0; seed < 50; seed++) {
      const rand = mulberry32(seed);
      const result = requeueSecondExposure(queue, 2, 'new', rand);
      const idx = result.indexOf('new');
      expect(idx).toBeGreaterThanOrEqual(2 + 6);
      expect(idx).toBeLessThanOrEqual(2 + 10);
    }
  });

  it('clamps to queue.length when index + offset exceeds queue', () => {
    const rand = () => 0.999; // max offset = 10
    const shortQueue = ['a', 'b'];
    const result = requeueSecondExposure(shortQueue, 1, 'new', rand);
    // 1 + 10 = 11 > 2 → clamp to 2
    expect(result[result.length - 1]).toBe('new');
  });

  it('does not mutate the input queue', () => {
    const rand = () => 0;
    const original = Array.from({ length: 15 }, (_, i) => `x${i}`);
    const copy = original.slice();
    requeueSecondExposure(original, 0, 'new', rand);
    expect(original).toEqual(copy);
  });
});

// ─── Integration: real bank ───────────────────────────────────────────────────

describe('composeSession: integration with real bank', () => {
  it('composes a 24-item session from real bank with synthetic states', () => {
    const bank = generateDrillBank();
    expect(bank.length).toBeGreaterThan(1000);

    // Give every other item in the first 80 a review state
    const states: Record<string, ItemSrsState> = {};
    bank.slice(0, 80).forEach((item, i) => {
      if (i % 2 === 0) {
        states[item.id] = makeState('review', NOW - (i + 1) * 1000);
      }
    });

    const config: SessionConfig = {
      length: 24,
      newPerSession: 4,
      families: allFamilies(),
    };

    const queue = composeSession(bank, states, config, NOW, 12345);

    expect(queue.length).toBeLessThanOrEqual(24);
    expect(queue.length).toBeGreaterThan(0);

    // All ids exist in the bank
    const bankIds = new Set(bank.map((i) => i.id));
    queue.forEach((id) => expect(bankIds.has(id)).toBe(true));

    // No adjacent duplicates
    for (let i = 0; i < queue.length - 1; i++) {
      expect(queue[i]).not.toBe(queue[i + 1]);
    }

    // No more than 4 fresh items
    const freshCount = queue.filter((id) => !states[id]).length;
    expect(freshCount).toBeLessThanOrEqual(4);

    // Deterministic
    const q2 = composeSession(bank, states, config, NOW, 12345);
    expect(queue).toEqual(q2);
  });
});

// ─── All-disabled families ────────────────────────────────────────────────────

describe('composeSession: all families disabled', () => {
  it('returns empty array when all families are disabled', () => {
    const bank = [item('a', 'keysig', 0), item('b', 'circle', 1)];
    const states: Record<string, ItemSrsState> = {
      a: makeState('review', NOW - 1),
      b: makeState('review', NOW - 1),
    };
    const config = defaultConfig({ families: noFamilies() });

    const queue = composeSession(bank, states, config, NOW, 42);
    expect(queue).toHaveLength(0);
  });
});
