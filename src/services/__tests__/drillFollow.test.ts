/**
 * services/drillFollow.ts (wave 2): the tolerant reader of Learn's saved
 * progress (never writes, never throws), the switch in force, and the pool.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  PROGRESS_STORAGE_KEY,
  readCompletedLessons,
  followInForce,
  followPool,
  followHasNothing,
  followFamilies,
} from '../drillFollow';
import { unlockedFor } from '../../data/drillUnlocks';
import { generateDrillBank } from '../../core/utils/drillBank';
import type { ItemSrsState } from '../../core/types/drill';

const BANK = generateDrillBank({ includeRead: true });
const save = (value: unknown) => localStorage.setItem(PROGRESS_STORAGE_KEY, typeof value === 'string' ? value : JSON.stringify(value));
const current = (completedModules: unknown, version = 4) => ({
  state: { progress: { completedModules, moduleProgress: {}, exerciseResults: {} } },
  version,
});

beforeEach(() => localStorage.clear());

describe('readCompletedLessons', () => {
  it('the progress store key is the one progressStore persists under', async () => {
    const { useProgressStore } = await import('../../state/progressStore');
    expect(useProgressStore.persist.getOptions().name).toBe(PROGRESS_STORAGE_KEY);
  });

  it('reads the current save, of any version', () => {
    save(current(['l1u34m5', 'l2u7m3']));
    expect(readCompletedLessons()).toEqual(['l1u34m5', 'l2u7m3']);
    save(current(['l1u1m1'], 1));
    expect(readCompletedLessons()).toEqual(['l1u1m1']);
  });

  it('reads the oldest shape (the progress itself at the top level)', () => {
    save({ completedModules: ['l1u3m3'], moduleProgress: {} });
    expect(readCompletedLessons()).toEqual(['l1u3m3']);
  });

  it('nothing saved, broken JSON, other shapes, a non-array: []', () => {
    expect(readCompletedLessons()).toEqual([]);
    for (const bad of ['{', 'null', '42', '"text"', '[]', JSON.stringify({ state: 7 }), JSON.stringify(current('l1u1m1')), JSON.stringify(current(null))]) {
      save(bad);
      expect(readCompletedLessons(), bad).toEqual([]);
    }
  });

  it('skips entries that are not strings, and duplicates', () => {
    save(current(['l1u1m1', 3, null, { id: 'x' }, 'l1u1m1', 'l1u3m3']));
    expect(readCompletedLessons()).toEqual(['l1u1m1', 'l1u3m3']);
  });

  it('a storage that throws (blocked): [] — and null storage too', () => {
    const throwing = { getItem: () => { throw new Error('blocked'); } };
    expect(readCompletedLessons(throwing)).toEqual([]);
    expect(readCompletedLessons(null)).toEqual([]);
  });

  it('never writes', () => {
    save(current(['l1u34m5']));
    const before = JSON.stringify({ ...localStorage });
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem');
    readCompletedLessons();
    expect(setItem).not.toHaveBeenCalled();
    expect(removeItem).not.toHaveBeenCalled();
    expect(JSON.stringify({ ...localStorage })).toBe(before);
    setItem.mockRestore();
    removeItem.mockRestore();
  });

  it('never writes, whatever the shape it reads (the oldest shape, an old version, broken) — final review of wave 2', () => {
    const shapes = [
      JSON.stringify({ completedModules: ['l1u3m3'], moduleProgress: {} }),
      JSON.stringify(current(['l1u1m1'], 1)),
      JSON.stringify(current(['l1u1m1', 3, 'l1u1m1'])),
      '{',
      JSON.stringify({ state: 7 }),
    ];
    for (const raw of shapes) {
      localStorage.clear();
      save(raw);
      const setItem = vi.spyOn(Storage.prototype, 'setItem');
      const removeItem = vi.spyOn(Storage.prototype, 'removeItem');
      readCompletedLessons();
      expect(setItem, raw).not.toHaveBeenCalled();
      expect(removeItem, raw).not.toHaveBeenCalled();
      expect(localStorage.getItem(PROGRESS_STORAGE_KEY), raw).toBe(raw);
      setItem.mockRestore();
      removeItem.mockRestore();
    }
  });
});

describe('followInForce', () => {
  it('a saved value wins, either way', () => {
    expect(followInForce(true, null, true)).toBe(true);
    expect(followInForce(false, 'new', false)).toBe(false);
  });

  it('never set: on for new / player with no Drill history; off for everyone else', () => {
    expect(followInForce(undefined, 'new', false)).toBe(true);
    expect(followInForce(undefined, 'player', false)).toBe(true);
    expect(followInForce(undefined, 'new', true)).toBe(false);
    expect(followInForce(undefined, 'theory', false)).toBe(false);
    expect(followInForce(undefined, null, false)).toBe(false);
    expect(followInForce(undefined, null, true)).toBe(false); // the owner
  });
});

describe('the pool while following', () => {
  const learning: ItemSrsState = {
    card: { due: 0, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 0, reps: 1, lapses: 0, state: 1, learning_steps: 0 },
    history: [],
    tier: 'learning',
    introCorrectCount: 0,
  };

  it('nothing completed, nothing met: nothing to ask', () => {
    expect(followHasNothing(BANK, unlockedFor([]), {})).toBe(true);
  });

  it('one fact already met is enough to ask, even with nothing unlocked', () => {
    const met = BANK.find((i) => i.family === 'seventh')!;
    expect(followHasNothing(BANK, unlockedFor([]), { [met.id]: learning })).toBe(false);
    expect(followPool(unlockedFor([]), { [met.id]: learning })(met)).toBe(true);
  });

  it('it replaces the topic chips: an unlocked family\'s new facts come even with its chip off (final review of wave 2)', async () => {
    const { composeSession } = await import('../drillSession');
    const { DEFAULT_SETTINGS } = await import('../../state/drillStore');
    const unlock = unlockedFor(['l1u34m5']);
    const config = { ...DEFAULT_SETTINGS, families: { ...DEFAULT_SETTINGS.families, triad: false } };
    const queue = composeSession(BANK, {}, config, Date.now(), 7, undefined, followPool(unlock, {}));
    const byId = new Map(BANK.map((i) => [i.id, i]));
    expect(queue.length).toBeGreaterThan(0);
    expect(queue.every((id) => byId.get(id)!.family === 'triad')).toBe(true);
  });

  it('Sprint\'s topic set is every family the pool reaches', () => {
    const met = BANK.find((i) => i.family === 'keysig')!;
    const families = followFamilies(BANK, unlockedFor(['l1u34m5']), { [met.id]: learning });
    expect(Object.entries(families).filter(([, on]) => on).map(([f]) => f).sort()).toEqual(['keysig', 'triad']);
  });
});

describe('a session while following a narrow unlock (final review of wave 2)', () => {
  it('after "A Scale Is a Ladder" (scales in C and G only) a session brings in its new facts, not one question', async () => {
    const { composeSession } = await import('../drillSession');
    const { DEFAULT_SETTINGS } = await import('../../state/drillStore');
    const { drillSiblingGroup } = await import('../../core/utils/drillBank/siblings');
    const pool = followPool(unlockedFor(['l1u34m4']), {});
    for (const seed of [1, 7, 42, 99]) {
      const queue = composeSession(BANK, {}, DEFAULT_SETTINGS, Date.now(), seed, undefined, pool);
      expect(queue.length, `seed ${seed}`).toBe(DEFAULT_SETTINGS.newPerSession);
      // Still never two of one sibling group in a row.
      for (let i = 1; i < queue.length; i++) expect(drillSiblingGroup(queue[i])).not.toBe(drillSiblingGroup(queue[i - 1]));
    }
  });
});
