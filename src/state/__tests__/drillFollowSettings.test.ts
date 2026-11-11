/**
 * "Follow my lessons" in the drill store (wave 2): an OPTIONAL settings field,
 * persist stays v3 (as `introDone`, no version bump).
 *
 *  - Frozen production-shaped saves without the field rehydrate unchanged and
 *    are written back WITHOUT it (v2 → v3 fixture, the v3 save from before
 *    reading); the owner's derived "off" is never written.
 *  - The guard keeps a boolean on both the valid and the partial-settings path
 *    (the partial path used to drop unknown fields) and drops a malformed one.
 *  - The first session saves the value in force; later sessions do not.
 *  - composeSession with the unlock filter.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  useDrillStore,
  DEFAULT_SETTINGS,
  DRILL_STORE_KEY,
  validatePersistedShape,
} from '../drillStore';
import { generateDrillBank } from '../../core/utils/drillBank';
import { composeSession } from '../../services/drillSession';
import { isItemUnlocked, unlockedFor } from '../../data/drillUnlocks';
import type { DrillItem, ItemSrsState } from '../../core/types/drill';
import v2Fixture from './fixtures/drill-v2-store.json';
import v3BeforeReading from './fixtures/drill-v3-before-reading.json';

type Blob = { state: Record<string, unknown>; version: number };
const BANK = generateDrillBank({ includeRead: true });
const BY_ID = new Map(BANK.map((i) => [i.id, i]));
const stored = () => JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!) as Blob;

function resetStore() {
  localStorage.clear();
  useDrillStore.setState({
    items: {},
    settings: DEFAULT_SETTINGS,
    sprintBests: {},
    lifetime: { answered: 0, correct: 0 },
    activeSession: null,
    sprint: null,
    introDone: false,
  });
  localStorage.clear();
}
beforeEach(resetStore);

describe('frozen saves without the field', () => {
  it('the v2 production save: rehydrates, and a written-back save has no followLessons', async () => {
    const f = structuredClone(v2Fixture) as unknown as Blob;
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(f));
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    expect('followLessons' in s.settings).toBe(false);
    // An answer writes the save back: the settings are the fixture's (+ the
    // reading toggle, as before this change), nothing else.
    const item = BY_ID.get(s.activeSession!.queue[s.activeSession!.index])!;
    useDrillStore.getState().recordAnswer(item, true, 1500, Date.UTC(2026, 9, 29, 12, 2));
    const savedSettings = stored().state.settings as Record<string, unknown>;
    expect(savedSettings).toEqual({ ...(f.state.settings as object), families: { ...(f.state.settings as { families: object }).families, read: true } });
    expect(Object.keys(savedSettings).sort()).toEqual(['families', 'length', 'newPerSession', 'showTimer', 'sound']);
  });

  it('the v3 save from before reading: every field unchanged, the settings written back byte for byte', async () => {
    const f = structuredClone(v3BeforeReading) as unknown as Blob;
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(f));
    await useDrillStore.persist.rehydrate();
    // The owner starts a session (his derived value is off): nothing new is written into his settings.
    useDrillStore.getState().startSession(BANK, Date.UTC(2026, 10, 10, 9), { followLessons: false, unlocked: null });
    const after = stored();
    expect(after.version).toBe(3);
    const before = f.state.settings as { families: Record<string, boolean> };
    expect(JSON.stringify(after.state.settings)).toBe(JSON.stringify({ ...before, families: { ...before.families, read: before.families.read ?? true } }));
    expect(after.state.items).toEqual(f.state.items);
  });
});

describe('the guard', () => {
  const base = () => ({ length: 24, newPerSession: 4, families: { ...DEFAULT_SETTINGS.families }, sound: true, showTimer: false });

  it('keeps a boolean on the valid path', () => {
    expect(validatePersistedShape({ settings: { ...base(), followLessons: true } })!.settings.followLessons).toBe(true);
    expect(validatePersistedShape({ settings: { ...base(), followLessons: false } })!.settings.followLessons).toBe(false);
  });

  it('keeps a boolean on the partial-settings path (a field missing elsewhere)', () => {
    const { sound: _s, ...partial } = base();
    void _s;
    const v = validatePersistedShape({ settings: { ...partial, followLessons: true } })!;
    expect(v.settings.followLessons).toBe(true);
    expect(v.settings.sound).toBe(true); // the default filled in
    // "Choose topics myself" survives an older or imported backup too (final review of wave 2).
    expect(validatePersistedShape({ settings: { ...partial, followLessons: false } })!.settings.followLessons).toBe(false);
  });

  it('drops a malformed value and keeps every other setting', () => {
    const v = validatePersistedShape({ settings: { ...base(), length: 12, followLessons: 'yes' } })!;
    expect('followLessons' in v.settings).toBe(false);
    expect(v.settings.length).toBe(12);
  });

  it('absent stays absent on both paths (never written as undefined)', () => {
    expect('followLessons' in validatePersistedShape({ settings: base() })!.settings).toBe(false);
    const { showTimer: _t, ...partial } = base();
    void _t;
    expect('followLessons' in validatePersistedShape({ settings: partial })!.settings).toBe(false);
  });
});

describe('startSession saves the value in force once', () => {
  it('the first session of a learner who never set it saves it', () => {
    useDrillStore.getState().startSession(BANK, 1_000, { followLessons: true, unlocked: () => true });
    expect(useDrillStore.getState().settings.followLessons).toBe(true);
    expect((stored().state.settings as Record<string, unknown>).followLessons).toBe(true);
  });

  it('a later session saves nothing; a learner who set it keeps their value', () => {
    useDrillStore.setState({ introDone: true });
    useDrillStore.getState().startSession(BANK, 1_000, { followLessons: true, unlocked: () => true });
    expect('followLessons' in useDrillStore.getState().settings).toBe(false);

    resetStore();
    useDrillStore.getState().updateSettings({ followLessons: false });
    useDrillStore.getState().startSession(BANK, 2_000, { followLessons: true, unlocked: () => true });
    expect(useDrillStore.getState().settings.followLessons).toBe(false);
  });

  it('without options (every existing caller) nothing is saved', () => {
    useDrillStore.getState().startSession(BANK, 1_000);
    expect('followLessons' in useDrillStore.getState().settings).toBe(false);
  });

  it('the unlock filter reaches the composed queue', () => {
    const unlock = unlockedFor(['l1u34m5']);
    useDrillStore.getState().updateSettings({ newPerSession: 8, length: 12 });
    useDrillStore.getState().startSession(BANK, 5_000, { followLessons: true, unlocked: (i) => isItemUnlocked(unlock, i) });
    const queue = useDrillStore.getState().activeSession!.queue;
    expect(queue.length).toBeGreaterThan(0);
    expect(queue.every((id) => BY_ID.get(id)!.family === 'triad')).toBe(true);
  });
});

describe('composeSession with the unlock filter', () => {
  const config = { length: 24 as const, newPerSession: 8, families: { ...DEFAULT_SETTINGS.families } };
  const state = (due: number, tier: ItemSrsState['tier'] = 'learning'): ItemSrsState => ({
    card: { due, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 0, reps: 1, lapses: 0, state: 1, learning_steps: 0 },
    history: [{ ts: 0, correct: true, ms: 1000, sessionId: 's0' }],
    tier,
    introCorrectCount: 1,
  });
  const unlockedTriads = (i: DrillItem) => isItemUnlocked(unlockedFor(['l1u34m5']), i);

  it('null = the family filter, exactly as before', () => {
    const states = { [BANK[0].id]: state(0) };
    expect(composeSession(BANK, states, config, 10_000, 7, undefined, null)).toEqual(composeSession(BANK, states, config, 10_000, 7));
  });

  it('new facts come only from what is unlocked', () => {
    const queue = composeSession(BANK, {}, config, 10_000, 7, undefined, unlockedTriads);
    expect(queue.length).toBe(8);
    for (const id of queue) {
      const item = BY_ID.get(id)!;
      expect(item.family).toBe('triad');
      expect(['C:major', 'G:major', 'F:major', 'A:minor', 'E:minor', 'D:minor']).toContain(`${item.chord!.root}:${item.chord!.quality}`);
    }
  });

  it('a fact already being learned stays in, locked or not; a disabled topic does not hide it', () => {
    const scheduled = BANK.find((i) => i.family === 'keysig')!;
    const families = { ...config.families, keysig: false };
    const queue = composeSession(BANK, { [scheduled.id]: state(0) }, { ...config, families }, 10_000, 7, undefined, unlockedTriads);
    expect(queue).toContain(scheduled.id);
  });

  it('nothing unlocked and nothing scheduled: an empty queue', () => {
    expect(composeSession(BANK, {}, config, 10_000, 7, undefined, () => false)).toEqual([]);
  });
});
