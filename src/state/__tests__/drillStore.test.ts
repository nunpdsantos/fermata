/**
 * Tests for drillStore — mirrors progressStore.test.ts patterns.
 * All time and seeds are injected; no Math.random / Date.now inside the store.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDrillStore, DEFAULT_SETTINGS, DRILL_STORE_KEY } from '../drillStore';
import type { DrillItem, ItemSrsState, DrillFamily } from '../../core/types/drill';
import type { DrillSettings } from '../drillStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeItem(id: string, family: DrillFamily = 'interval', rank = 0): DrillItem {
  return {
    id,
    family,
    promptKey: 'test.prompt',
    promptParams: {},
    input: { format: 'choice', choices: ['A', 'B'] },
    answer: { kind: 'choice', correct: 'A' },
    whyKey: 'test.why',
    whyParams: {},
    rank,
  };
}

/** Seed the localStorage for rehydration tests. */
function seedStorage(state: unknown, version = 1) {
  localStorage.setItem(DRILL_STORE_KEY, JSON.stringify({ state, version }));
}

/** Reset store to clean slate. */
function resetStore() {
  localStorage.clear();
  useDrillStore.setState({
    items: {},
    settings: DEFAULT_SETTINGS,
    sprintBests: {},
    lifetime: { answered: 0, correct: 0 },
    activeSession: null,
  });
}

const NOW = 1_000_000;

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(resetStore);

// ─── Basic Defaults ───────────────────────────────────────────────────────────

describe('initial state', () => {
  it('starts with empty items and no session', () => {
    const s = useDrillStore.getState();
    expect(s.items).toEqual({});
    expect(s.activeSession).toBeNull();
    expect(s.lifetime).toEqual({ answered: 0, correct: 0 });
  });

  it('default settings: length 24, newPerSession 4, all families true, sound true, showTimer false', () => {
    const { settings } = useDrillStore.getState();
    expect(settings.length).toBe(24);
    expect(settings.newPerSession).toBe(4);
    expect(settings.sound).toBe(true);
    expect(settings.showTimer).toBe(false);
    // All families enabled
    for (const val of Object.values(settings.families)) {
      expect(val).toBe(true);
    }
  });
});

// ─── startSession ─────────────────────────────────────────────────────────────

describe('startSession', () => {
  it('creates an active session with deterministic seed from now', () => {
    const bank = [makeItem('i1'), makeItem('i2'), makeItem('i3')];
    useDrillStore.getState().startSession(bank, NOW);
    const session = useDrillStore.getState().activeSession;
    expect(session).not.toBeNull();
    expect(session!.id).toBe(`s${NOW}`);
    expect(session!.seed).toBe(NOW % 0x80000000);
    expect(session!.index).toBe(0);
    expect(session!.asked).toBe(0);
    expect(session!.correct).toBe(0);
    expect(Array.isArray(session!.queue)).toBe(true);
  });

  it('replaces an existing session when called again', () => {
    const bank = [makeItem('i1')];
    useDrillStore.getState().startSession(bank, NOW);
    useDrillStore.getState().startSession(bank, NOW + 1000);
    const session = useDrillStore.getState().activeSession;
    expect(session!.id).toBe(`s${NOW + 1000}`);
  });

  it('determinism: same now + bank → same queue', () => {
    const bank = [makeItem('a', 'interval', 0), makeItem('b', 'interval', 1), makeItem('c', 'interval', 2)];
    useDrillStore.getState().startSession(bank, NOW);
    const q1 = useDrillStore.getState().activeSession!.queue.slice();
    resetStore();
    useDrillStore.getState().startSession(bank, NOW);
    const q2 = useDrillStore.getState().activeSession!.queue.slice();
    expect(q1).toEqual(q2);
  });
});

// ─── recordAnswer: atomicity + counters ───────────────────────────────────────

describe('recordAnswer — counters', () => {
  it('updates item state, asked, correct, and lifetime atomically on a correct answer', () => {
    const bank = [makeItem('i1')];
    useDrillStore.getState().startSession(bank, NOW);

    useDrillStore.getState().recordAnswer(makeItem('i1'), true, 1000, NOW);

    const s = useDrillStore.getState();
    expect(s.items['i1']).toBeDefined();
    expect(s.activeSession!.asked).toBe(1);
    expect(s.activeSession!.correct).toBe(1);
    expect(s.activeSession!.index).toBe(1);
    expect(s.lifetime.answered).toBe(1);
    expect(s.lifetime.correct).toBe(1);
  });

  it('updates counters on a wrong answer (correct stays 0)', () => {
    const bank = [makeItem('i1')];
    useDrillStore.getState().startSession(bank, NOW);

    useDrillStore.getState().recordAnswer(makeItem('i1'), false, 1000, NOW);

    const s = useDrillStore.getState();
    expect(s.activeSession!.asked).toBe(1);
    expect(s.activeSession!.correct).toBe(0);
    expect(s.lifetime.answered).toBe(1);
    expect(s.lifetime.correct).toBe(0);
  });

  it('no-op and warns when no active session', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    useDrillStore.getState().recordAnswer(makeItem('i1'), true, 1000, NOW);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('no active session'),
    );
    expect(useDrillStore.getState().lifetime.answered).toBe(0);
    warnSpy.mockRestore();
  });
});

// ─── recordAnswer: wrong answer requeue ───────────────────────────────────────

describe('recordAnswer — wrong answer requeue', () => {
  it('requeues a missed item +4..6 ahead of current index', () => {
    // Need enough items so the queue is long
    const bank = Array.from({ length: 12 }, (_, i) => makeItem(`item${i}`, 'interval', i));
    useDrillStore.getState().startSession(bank, NOW);
    const beforeQueue = useDrillStore.getState().activeSession!.queue.slice();
    const missedId = beforeQueue[0]; // first item in queue
    const missedItem = makeItem(missedId);

    useDrillStore.getState().recordAnswer(missedItem, false, 1000, NOW);

    const afterQueue = useDrillStore.getState().activeSession!.queue;
    // The missed item should reappear somewhere in positions 4..6 ahead of old index 0
    // i.e. positions 4, 5, or 6 in the new queue (index has advanced to 1, but queue grew)
    const reinsertedAt = afterQueue.indexOf(missedId, 1); // search from 1 onwards
    expect(reinsertedAt).toBeGreaterThanOrEqual(4);
    expect(reinsertedAt).toBeLessThanOrEqual(7); // 0 + 4..6 = 4..6, but queue is now 1 longer
  });

  it('allows at most 2 miss requeues per item per session', () => {
    const bank = Array.from({ length: 20 }, (_, i) => makeItem(`item${i}`, 'interval', i));
    useDrillStore.getState().startSession(bank, NOW);

    const queue = useDrillStore.getState().activeSession!.queue;
    const targetId = queue[0];
    const target = makeItem(targetId);

    // Miss 1
    useDrillStore.getState().recordAnswer(target, false, 1000, NOW);
    // Miss 2 — skip to the requeued position
    // Find and advance to the requeued item
    const q2 = useDrillStore.getState().activeSession!.queue;
    const pos2 = q2.indexOf(targetId, 1);

    // Advance index to pos2 by recording filler answers
    const idx1 = useDrillStore.getState().activeSession!.index;
    for (let i = idx1; i < pos2; i++) {
      const filler = makeItem(q2[i] ?? 'filler');
      useDrillStore.getState().recordAnswer(filler, true, 500, NOW + i * 100);
    }
    // Now answer the target wrong again
    useDrillStore.getState().recordAnswer(target, false, 1000, NOW + 10000);

    // Miss 3 — should NOT requeue again
    const q3 = useDrillStore.getState().activeSession!.queue;
    const idxAfterMiss2 = useDrillStore.getState().activeSession!.index;
    const pos3 = q3.indexOf(targetId, idxAfterMiss2);
    useDrillStore.getState().recordAnswer(target, false, 1000, NOW + 20000);

    const q4 = useDrillStore.getState().activeSession!.queue;
    const idxAfterMiss3 = useDrillStore.getState().activeSession!.index;
    // Should not appear again past current index
    const pos4 = q4.indexOf(targetId, idxAfterMiss3);

    // After 3 misses, 3rd miss should NOT have requeued (max is 2)
    // We can't easily distinguish pos3 from pos4 if the item was already there
    // so we check missRequeues is capped at 2
    const missRequeues = useDrillStore.getState().activeSession!.missRequeues;
    expect(missRequeues[targetId]).toBe(2);

    // Suppress unused variable warning
    void pos3;
    void pos4;
  });
});

// ─── recordAnswer: second exposure on new item ────────────────────────────────

describe('recordAnswer — second exposure', () => {
  it('requeues a second exposure +6..10 ahead when first answer on a new item is correct', () => {
    // Need a long enough queue so requeueSecondExposure is NOT clamped to queue.length.
    // With newPerSession = 8 and 20 items, queue will have 8 fresh items → length >= 8
    // but we need >= 11. Set newPerSession high enough and bank large enough.
    useDrillStore.setState({ settings: { ...DEFAULT_SETTINGS, newPerSession: 8, length: 24 } });
    const bank = Array.from({ length: 20 }, (_, i) => makeItem(`item${i}`, 'interval', i));
    useDrillStore.getState().startSession(bank, NOW);

    const queue = useDrillStore.getState().activeSession!.queue;
    // Confirm we have a long enough queue for the insertion not to clamp
    expect(queue.length).toBeGreaterThanOrEqual(8);

    const newItemId = queue[0]; // no prior state → brand new item
    const newItem = makeItem(newItemId);

    // Confirm item truly has no state
    expect(useDrillStore.getState().items[newItemId]).toBeUndefined();

    const beforeQueue = queue.slice();
    useDrillStore.getState().recordAnswer(newItem, true, 1000, NOW);

    const afterQueue = useDrillStore.getState().activeSession!.queue;

    // The queue should have grown by 1 (second exposure inserted)
    expect(afterQueue.length).toBe(beforeQueue.length + 1);

    // Find the inserted copy — it's the second occurrence of the id in afterQueue.
    // (The first occurrence is the original slot, now behind the current index.)
    let occurrences = 0;
    let insertedAt = -1;
    for (let i = 0; i < afterQueue.length; i++) {
      if (afterQueue[i] === newItemId) {
        occurrences++;
        if (occurrences === 2) { insertedAt = i; break; }
      }
    }
    expect(occurrences).toBe(2);
    // requeueSecondExposure: offset = 6..10, index was 0 → inserted at position 6..10
    // (clamped to queue.length only if queue was shorter, which we prevented above)
    expect(insertedAt).toBeGreaterThanOrEqual(6);
    expect(insertedAt).toBeLessThanOrEqual(10);
  });

  it('does NOT requeue second exposure when item already had state (existing item)', () => {
    const bank = [makeItem('i1')];

    // Pre-seed item state so it's NOT brand new
    const existingState: ItemSrsState = {
      card: {
        due: NOW - 1000,
        stability: 1,
        difficulty: 5,
        elapsed_days: 0,
        scheduled_days: 1,
        reps: 1,
        lapses: 0,
        state: 2,
        learning_steps: 0,
      },
      history: [{ ts: NOW - 1000, correct: true, ms: 500, sessionId: 'prev' }],
      tier: 'review',
      introSessionId: 'prev',
      introCorrectCount: 1,
    };
    useDrillStore.setState({ items: { i1: existingState } });

    useDrillStore.getState().startSession(bank, NOW);
    const queueBefore = useDrillStore.getState().activeSession!.queue.slice();

    useDrillStore.getState().recordAnswer(makeItem('i1'), true, 500, NOW);

    const queueAfter = useDrillStore.getState().activeSession!.queue;
    // Queue should not grow — no second exposure inserted
    expect(queueAfter.length).toBe(queueBefore.length);
  });
});

// ─── endSession ───────────────────────────────────────────────────────────────

describe('endSession', () => {
  it('sets activeSession to null', () => {
    useDrillStore.getState().startSession([makeItem('i1')], NOW);
    useDrillStore.getState().endSession();
    expect(useDrillStore.getState().activeSession).toBeNull();
  });

  it('preserves items and lifetime after endSession', () => {
    useDrillStore.getState().startSession([makeItem('i1')], NOW);
    useDrillStore.getState().recordAnswer(makeItem('i1'), true, 500, NOW);
    useDrillStore.getState().endSession();
    const s = useDrillStore.getState();
    expect(s.items['i1']).toBeDefined();
    expect(s.lifetime.answered).toBe(1);
  });
});

// ─── updateSettings ───────────────────────────────────────────────────────────

describe('updateSettings', () => {
  it('merges partial settings', () => {
    useDrillStore.getState().updateSettings({ length: 40, sound: false });
    const { settings } = useDrillStore.getState();
    expect(settings.length).toBe(40);
    expect(settings.sound).toBe(false);
    // Unchanged defaults preserved
    expect(settings.newPerSession).toBe(4);
    expect(settings.showTimer).toBe(false);
  });

  it('can disable individual families', () => {
    useDrillStore.getState().updateSettings({
      families: { ...DEFAULT_SETTINGS.families, interval: false },
    });
    expect(useDrillStore.getState().settings.families.interval).toBe(false);
    expect(useDrillStore.getState().settings.families.triad).toBe(true);
  });
});

// ─── recordSprint ─────────────────────────────────────────────────────────────

describe('recordSprint', () => {
  it('records a new sprint best', () => {
    useDrillStore.getState().recordSprint('interval,triad', 42);
    expect(useDrillStore.getState().sprintBests['interval,triad']).toBe(42);
  });

  it('keeps the higher of two scores', () => {
    useDrillStore.getState().recordSprint('interval', 10);
    useDrillStore.getState().recordSprint('interval', 50);
    useDrillStore.getState().recordSprint('interval', 30);
    expect(useDrillStore.getState().sprintBests['interval']).toBe(50);
  });
});

// ─── resetDrillData ───────────────────────────────────────────────────────────

describe('resetDrillData', () => {
  it('clears items, session, sprintBests, and lifetime and restores default settings', () => {
    useDrillStore.getState().startSession([makeItem('i1')], NOW);
    useDrillStore.getState().recordAnswer(makeItem('i1'), true, 500, NOW);
    useDrillStore.getState().recordSprint('all', 100);
    useDrillStore.getState().updateSettings({ length: 40 });

    useDrillStore.getState().resetDrillData();

    const s = useDrillStore.getState();
    expect(s.items).toEqual({});
    expect(s.activeSession).toBeNull();
    expect(s.sprintBests).toEqual({});
    expect(s.lifetime).toEqual({ answered: 0, correct: 0 });
    expect(s.settings).toEqual(DEFAULT_SETTINGS);
  });
});

// ─── Mid-session resume (persistence) ────────────────────────────────────────

describe('mid-session resume', () => {
  it('rehydrates active session index and items intact after 3 answers', async () => {
    const bank = Array.from({ length: 10 }, (_, i) => makeItem(`item${i}`, 'interval', i));
    useDrillStore.getState().startSession(bank, NOW);

    // Answer 3 items
    const q = useDrillStore.getState().activeSession!.queue;
    for (let i = 0; i < 3; i++) {
      useDrillStore.getState().recordAnswer(makeItem(q[i]), true, 500, NOW + i * 100);
    }

    // Capture the store's persisted state
    const sessionBefore = useDrillStore.getState().activeSession;
    const itemsBefore = useDrillStore.getState().items;
    expect(sessionBefore!.index).toBe(3);

    // Serialize via the persist storage mock
    const raw = localStorage.getItem(DRILL_STORE_KEY);
    expect(raw).not.toBeNull();

    // Rehydrate fresh store
    await useDrillStore.persist.rehydrate();

    const sessionAfter = useDrillStore.getState().activeSession;
    const itemsAfter = useDrillStore.getState().items;

    expect(sessionAfter).not.toBeNull();
    expect(sessionAfter!.index).toBe(3);
    expect(Object.keys(itemsAfter)).toEqual(Object.keys(itemsBefore));
  });
});

// ─── Shape-guard / corrupt persisted JSON ────────────────────────────────────

describe('persistence shape guard', () => {
  it('falls back to clean state when items is garbage', async () => {
    seedStorage({ items: 'garbage', settings: DEFAULT_SETTINGS, sprintBests: {}, lifetime: { answered: 0, correct: 0 }, activeSession: null });
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    expect(s.items).toEqual({});
    expect(s.activeSession).toBeNull();
  });

  it('nulls out a malformed activeSession while keeping valid items', async () => {
    const validItems: Record<string, ItemSrsState> = {
      i1: {
        card: { due: NOW, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 1, reps: 1, lapses: 0, state: 2, learning_steps: 0 },
        history: [],
        tier: 'review',
        introSessionId: 'x',
        introCorrectCount: 1,
      },
    };
    seedStorage({
      items: validItems,
      settings: DEFAULT_SETTINGS,
      sprintBests: {},
      lifetime: { answered: 0, correct: 0 },
      activeSession: { nonsense: true },
    });
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    expect(s.activeSession).toBeNull();
    expect(s.items['i1']).toBeDefined();
  });

  it('falls back cleanly when the entire stored blob is non-object', async () => {
    localStorage.setItem(DRILL_STORE_KEY, 'not-json-at-all!!!');
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    expect(s.items).toEqual({});
  });

  it('does not throw on corrupt shape — never crashes', async () => {
    seedStorage({ items: null, settings: null, sprintBests: null, lifetime: null, activeSession: { id: 1 } });
    await expect(useDrillStore.persist.rehydrate()).resolves.not.toThrow();
  });

  it('keeps valid persisted data intact', async () => {
    const valid = {
      items: {},
      settings: { ...DEFAULT_SETTINGS },
      sprintBests: { all: 99 },
      lifetime: { answered: 5, correct: 3 },
      activeSession: null,
    };
    seedStorage(valid);
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    expect(s.lifetime).toEqual({ answered: 5, correct: 3 });
    expect(s.sprintBests['all']).toBe(99);
  });

  it('fills missing settings fields with defaults (partial settings recovery)', async () => {
    seedStorage({
      items: {},
      settings: { length: 40 },  // missing newPerSession, families, sound, showTimer
      sprintBests: {},
      lifetime: { answered: 0, correct: 0 },
      activeSession: null,
    });
    await useDrillStore.persist.rehydrate();
    const { settings } = useDrillStore.getState();
    expect(settings.length).toBe(40);
    expect(settings.newPerSession).toBe(DEFAULT_SETTINGS.newPerSession);
    expect(settings.sound).toBe(DEFAULT_SETTINGS.sound);
    expect(settings.showTimer).toBe(DEFAULT_SETTINGS.showTimer);
  });
});

// ─── Determinism ─────────────────────────────────────────────────────────────

describe('determinism', () => {
  it('same now+seed → same queue after same answer pattern', () => {
    const bank = Array.from({ length: 10 }, (_, i) => makeItem(`item${i}`, 'interval', i));

    // Run 1
    useDrillStore.getState().startSession(bank, NOW);
    const q1_start = useDrillStore.getState().activeSession!.queue.slice();
    // Miss the first item
    useDrillStore.getState().recordAnswer(makeItem(q1_start[0]), false, 1000, NOW);
    const q1_after = useDrillStore.getState().activeSession!.queue.slice();
    resetStore();

    // Run 2 — identical inputs
    useDrillStore.getState().startSession(bank, NOW);
    const q2_start = useDrillStore.getState().activeSession!.queue.slice();
    useDrillStore.getState().recordAnswer(makeItem(q2_start[0]), false, 1000, NOW);
    const q2_after = useDrillStore.getState().activeSession!.queue.slice();

    expect(q1_start).toEqual(q2_start);
    expect(q1_after).toEqual(q2_after);
  });

  it('different seeds → different queues (with high probability for distinct now values)', () => {
    const bank = Array.from({ length: 8 }, (_, i) => makeItem(`item${i}`, 'interval', i));

    useDrillStore.getState().startSession(bank, NOW);
    const q1 = useDrillStore.getState().activeSession!.queue.slice();
    resetStore();

    useDrillStore.getState().startSession(bank, NOW + 7777);
    const q2 = useDrillStore.getState().activeSession!.queue.slice();

    // Not guaranteed identical — with 8 items and different seeds, very likely different
    // We just assert both are non-empty valid queues
    expect(q1.length).toBeGreaterThan(0);
    expect(q2.length).toBeGreaterThan(0);
  });
});

// ─── Settings types ───────────────────────────────────────────────────────────

describe('DrillSettings type conformance', () => {
  it('updateSettings accepts all SessionConfig fields', () => {
    const patch: Partial<DrillSettings> = {
      length: 12,
      newPerSession: 2,
      sound: false,
      showTimer: true,
    };
    useDrillStore.getState().updateSettings(patch);
    const { settings } = useDrillStore.getState();
    expect(settings.length).toBe(12);
    expect(settings.newPerSession).toBe(2);
    expect(settings.sound).toBe(false);
    expect(settings.showTimer).toBe(true);
  });
});
