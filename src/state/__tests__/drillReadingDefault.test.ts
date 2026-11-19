/**
 * Who gets "Reading (guitar)" (audit 2, P4, 19 November 2026), row by row,
 * against the real store and its save (fermata-drill-v1, persist v3 — no
 * version change):
 *
 * | learner                                   | in force                 | saved               |
 * |-------------------------------------------|--------------------------|---------------------|
 * | new, piano (profile or none)              | off                      | nothing until Start |
 * | new, guitar                               | on                       | nothing until Start |
 * | first session                             | the value in force       | `read` written      |
 * | Drill history, no recorded choice (a save | on, as before            | as before (filled   |
 * |   from before reading; the owner's)       |                          |   on, byte for byte)|
 * | any learner with a reading answer         | what the save says       | unchanged           |
 * | set on or off                             | that, on any instrument  | unchanged           |
 * | a backup imported                         | by the same rules        | as imported         |
 * | a second tab                              | the save's recorded value| never written over  |
 *
 * Cards, histories, tiers and queues are never touched.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useDrillStore, DEFAULT_SETTINGS, DRILL_STORE_KEY, validatePersistedShape } from '../drillStore';
import { readingInForce } from '../../services/drillFollow';
import { composeSession } from '../../services/drillSession';
import { generateDrillBank, genRead } from '../../core/utils/drillBank';
import { applyBackup, buildBackup, validateBackup } from '../../utils/backupHelpers';

const BANK = generateDrillBank({ includeRead: true });
const READ = genRead();
const NOW = Date.UTC(2026, 10, 19, 9);
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the saved JSON is read freely in assertions
type Json = any;
const saved = (): Json => JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!);
const fixture = (name: string) => readFileSync(join(__dirname, 'fixtures', name), 'utf8');
const families = () => new Set(useDrillStore.getState().activeSession!.queue.map((id) => BANK.find((i) => i.id === id)!.family));

beforeEach(() => {
  localStorage.clear();
  useDrillStore.getState().resetDrillData();
  localStorage.removeItem(DRILL_STORE_KEY);
});
afterEach(() => {
  useDrillStore.getState().resetDrillData();
  localStorage.clear();
  localStorage.setItem('music-theory-app', JSON.stringify({ state: {}, version: 6 }));
});

describe('the rule (services/drillFollow.ts readingInForce)', () => {
  it('a recorded choice wins on any instrument; none: history keeps it on, else the guitar alone', () => {
    for (const instrument of ['piano', 'guitar']) {
      for (const history of [false, true]) {
        expect(readingInForce(true, instrument, history)).toBe(true);
        expect(readingInForce(false, instrument, history)).toBe(false);
      }
    }
    expect(readingInForce(undefined, 'piano', false)).toBe(false);
    expect(readingInForce(undefined, 'guitar', false)).toBe(true);
    expect(readingInForce(undefined, 'piano', true)).toBe(true);
    expect(readingInForce(undefined, 'guitar', true)).toBe(true);
    // Something that is not a choice is no choice.
    expect(readingInForce('yes' as unknown as boolean, 'piano', false)).toBe(false);
  });

  it('the defaults carry no reading choice; a reset of all Drill data goes back to none', () => {
    expect(DEFAULT_SETTINGS.families).not.toHaveProperty('read');
    expect(useDrillStore.getState().settings.families).not.toHaveProperty('read');
    useDrillStore.getState().updateSettings({ families: { ...useDrillStore.getState().settings.families, read: true } });
    useDrillStore.getState().resetDrillData();
    expect(useDrillStore.getState().settings.families).not.toHaveProperty('read');
    expect(saved().state.settings.families).not.toHaveProperty('read');
  });
});

describe('new learners', () => {
  it('piano: the first session leaves reading out and saves it off; nothing before it', () => {
    useDrillStore.getState().updateSettings({ length: 40, newPerSession: 8 });
    expect(saved().state.settings.families).not.toHaveProperty('read');
    useDrillStore.getState().startSession(BANK, NOW, { reading: false });
    expect(saved().state.settings.families.read).toBe(false);
    // Same queue as composing with reading off (nothing else differs).
    expect(useDrillStore.getState().activeSession!.queue).toEqual(
      composeSession(BANK, {}, { ...DEFAULT_SETTINGS, length: 40, newPerSession: 8, families: { ...DEFAULT_SETTINGS.families, read: false } }, NOW, NOW % 0x80000000),
    );
    // Later sessions write nothing new about it.
    const before = saved().state.settings;
    useDrillStore.getState().startSession(BANK, NOW + 1000, { reading: true });
    expect(saved().state.settings).toEqual(before);
  });

  it('guitar: the first session saves it on; reading-only topics give a reading session', () => {
    useDrillStore.getState().updateSettings({
      families: Object.fromEntries(Object.keys(DEFAULT_SETTINGS.families).map((f) => [f, false])) as typeof DEFAULT_SETTINGS.families,
    });
    useDrillStore.getState().startSession(BANK, NOW, { reading: true });
    expect(saved().state.settings.families.read).toBe(true);
    expect([...families()]).toEqual(['read']);
  });

  it('a session that cannot start (nothing to ask) records nothing', () => {
    useDrillStore.getState().updateSettings({
      families: Object.fromEntries(Object.keys(DEFAULT_SETTINGS.families).map((f) => [f, false])) as typeof DEFAULT_SETTINGS.families,
    });
    useDrillStore.getState().startSession(BANK, NOW, { reading: false });
    expect(useDrillStore.getState().activeSession).toBeNull();
    expect(useDrillStore.getState().introDone).toBe(false);
    expect(saved().state.settings.families).not.toHaveProperty('read');
  });

  it('a save without a reading choice and without history loads without one (and is written back without one)', async () => {
    const blob = JSON.stringify({ state: { items: {}, settings: { ...DEFAULT_SETTINGS, length: 12 }, sprintBests: {}, lifetime: { answered: 0, correct: 0 }, activeSession: null, sprint: null, introDone: false }, version: 3 });
    localStorage.setItem(DRILL_STORE_KEY, blob);
    await useDrillStore.persist.rehydrate();
    expect(useDrillStore.getState().settings.families).not.toHaveProperty('read');
    useDrillStore.getState().updateSettings({ sound: useDrillStore.getState().settings.sound });
    expect(localStorage.getItem(DRILL_STORE_KEY)).toBe(blob);
  });
});

describe('saves with history: exactly as before (the owner)', () => {
  for (const name of ['drill-v1-store.json', 'drill-v2-store.json', 'drill-v2-by-heart.json', 'drill-v3-before-reading.json']) {
    for (const reading of [false, true]) {
      it(`${name}, a session on the ${reading ? 'guitar' : 'piano'}: reading on (filled as before), the queue and the save as at 153caab`, async () => {
        const blob = fixture(name);
        const before = JSON.parse(blob) as Json;
        localStorage.setItem(DRILL_STORE_KEY, blob);
        await useDrillStore.persist.rehydrate();
        const s = useDrillStore.getState();
        expect(s.settings.families.read).toBe(true);
        // Items exactly as migrated before this change (cards, histories, tiers).
        const items = s.items;
        useDrillStore.getState().startSession(BANK, NOW, { reading, followLessons: false, unlocked: null });
        const after = saved();
        expect(after.version).toBe(3);
        // 153caab: the saved settings plus `read: true` in its place (last), byte for byte.
        const settings = before.state.settings;
        expect(JSON.stringify(after.state.settings)).toBe(JSON.stringify({ ...settings, families: { ...settings.families, read: settings.families.read ?? true } }));
        expect(after.state.items).toEqual(items);
        expect(useDrillStore.getState().activeSession!.queue).toEqual(
          composeSession(BANK, items, { ...s.settings, families: { ...s.settings.families, read: true } }, NOW, NOW % 0x80000000),
        );
      });
    }
  }

  it('the wave-1 owner journey\'s save (empty topic record, 12 answers, the intro passed): every topic on, reading in force', () => {
    const shape = validatePersistedShape({
      items: {}, settings: { length: 24, newPerSession: 4, families: {}, sound: true, showTimer: false },
      sprintBests: {}, lifetime: { answered: 12, correct: 10 }, activeSession: null, sprint: null, introDone: true,
    })!;
    expect(Object.values(shape.settings.families).every(Boolean)).toBe(true);
    // A save the app writes now (it has the intro's field): no choice is
    // made up for it; its history keeps reading on in force.
    expect(shape.settings.families).not.toHaveProperty('read');
    for (const instrument of ['piano', 'guitar']) expect(readingInForce(shape.settings.families.read, instrument, shape.introDone)).toBe(true);
  });
});

describe('a recorded choice, a reading answer', () => {
  it('a learner who answered a reading card keeps exactly what the save says (on or off), on the piano too', async () => {
    for (const read of [true, false]) {
      useDrillStore.getState().resetDrillData();
      useDrillStore.getState().updateSettings({ families: { ...DEFAULT_SETTINGS.families, read: true } });
      useDrillStore.getState().startSession(READ, NOW, { reading: false });
      const q = READ.find((i) => i.id === useDrillStore.getState().activeSession!.queue[0])!;
      useDrillStore.getState().recordAnswer(q, true, 1500, NOW + 2000);
      // (Closed: the guard rebuilds a session's tally in its own key order, as before.)
      useDrillStore.getState().endSession();
      useDrillStore.getState().updateSettings({ families: { ...useDrillStore.getState().settings.families, read } });
      const blob = localStorage.getItem(DRILL_STORE_KEY)!;
      useDrillStore.getState().resetDrillData();
      localStorage.setItem(DRILL_STORE_KEY, blob);
      await useDrillStore.persist.rehydrate();
      expect(useDrillStore.getState().settings.families.read).toBe(read);
      expect(readingInForce(useDrillStore.getState().settings.families.read, 'piano', true)).toBe(read);
      useDrillStore.getState().updateSettings({ sound: useDrillStore.getState().settings.sound });
      expect(localStorage.getItem(DRILL_STORE_KEY)).toBe(blob);
    }
  });

  it('a reading answer in a save without the field (hand-made): history, so on', () => {
    const shape = validatePersistedShape({
      items: { [READ[0].id]: { card: { due: NOW, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 0, reps: 1, lapses: 0, state: 1, learning_steps: 0 }, history: [{ ts: NOW, correct: true, ms: 1000, sessionId: 's1' }], tier: 'learning', introCorrectCount: 1 } },
      settings: { length: 24, newPerSession: 4, families: { keysig: true }, sound: true, showTimer: false },
      sprintBests: {}, lifetime: { answered: 1, correct: 1 }, activeSession: null,
    })!;
    expect(shape.settings.families.read).toBe(true);
  });

  it('set on or off before any session: saved at once, and the first session keeps it whatever the instrument', () => {
    for (const read of [true, false]) {
      useDrillStore.getState().resetDrillData();
      useDrillStore.getState().updateSettings({ families: { ...useDrillStore.getState().settings.families, read } });
      expect(saved().state.settings.families.read).toBe(read);
      useDrillStore.getState().startSession(BANK, NOW, { reading: !read });
      expect(saved().state.settings.families.read).toBe(read);
    }
  });
});

describe('a backup imported', () => {
  const backupOf = (state: Json) => {
    localStorage.clear();
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify({ state, version: 3 }));
    return buildBackup(localStorage);
  };
  const base = { items: {}, sprintBests: {}, lifetime: { answered: 0, correct: 0 }, activeSession: null, sprint: null };

  for (const [label, state, expected] of [
    ['from before reading (no choice, no intro field) with history: on, filled as before', { ...base, settings: { ...DEFAULT_SETTINGS }, lifetime: { answered: 3, correct: 2 } }, true],
    ['with history and no choice, written now (the intro passed): none saved, on in force', { ...base, settings: { ...DEFAULT_SETTINGS }, lifetime: { answered: 3, correct: 2 }, introDone: true }, undefined],
    ['without history and no choice: none, so the instrument decides', { ...base, settings: { ...DEFAULT_SETTINGS }, introDone: false }, undefined],
    ['with the choice off: off', { ...base, settings: { ...DEFAULT_SETTINGS, families: { ...DEFAULT_SETTINGS.families, read: false } }, introDone: true }, false],
    ['with the choice on: on', { ...base, settings: { ...DEFAULT_SETTINGS, families: { ...DEFAULT_SETTINGS.families, read: true } }, introDone: false }, true],
  ] as const) {
    it(label, async () => {
      const backup = backupOf(state);
      expect((await validateBackup(JSON.parse(JSON.stringify(backup)))).ok).toBe(true);
      localStorage.clear();
      useDrillStore.getState().resetDrillData();
      const written = JSON.stringify(backup.data[DRILL_STORE_KEY]);
      expect(applyBackup(backup, localStorage).ok).toBe(true);
      expect(localStorage.getItem(DRILL_STORE_KEY)).toBe(written);
      await useDrillStore.persist.rehydrate();
      const { settings, introDone } = useDrillStore.getState();
      expect(settings.families.read).toBe(expected);
      // In force: the recorded value, else on with history, else the instrument's.
      expect(readingInForce(settings.families.read, 'piano', introDone)).toBe(expected ?? introDone);
      expect(readingInForce(settings.families.read, 'guitar', introDone)).toBe(expected ?? true);
    });
  }
});

describe('a second tab', () => {
  type Store = typeof import('../drillStore');
  async function openTab(): Promise<Store> {
    vi.resetModules();
    const mod = await import('../drillStore');
    await import('../tabSync');
    await new Promise((resolve) => setTimeout(resolve, 0));
    return mod;
  }
  const deliver = () => window.dispatchEvent(new StorageEvent('storage', { key: DRILL_STORE_KEY }));

  it('a piano tab\'s first session records off; a stale tab with no choice in memory writes another setting: off stays', async () => {
    const a = await openTab();
    const b = await openTab();
    a.useDrillStore.getState().startSession(BANK, NOW, { reading: false });
    expect(saved().state.settings.families.read).toBe(false);
    // B never heard of it (a frozen tab) and changes the session length.
    b.useDrillStore.getState().updateSettings({ length: 12 });
    expect(saved().state.settings.families.read).toBe(false);
    expect(saved().state.settings.length).toBe(12);
    // Told, B shows the recorded choice.
    deliver();
    expect(b.useDrillStore.getState().settings.families.read).toBe(false);
  });

  it('the learner\'s own tap on the chip in a stale tab is their latest choice: it wins over what another tab recorded', async () => {
    const a = await openTab();
    const b = await openTab();
    a.useDrillStore.getState().startSession(BANK, NOW, { reading: false });
    expect(saved().state.settings.families.read).toBe(false);
    // B, never told (no choice in its memory), and the learner turns the chip on there.
    b.useDrillStore.getState().updateSettings({ families: { ...b.useDrillStore.getState().settings.families, read: true } });
    expect(saved().state.settings.families.read).toBe(true);
  });

  it('a choice made in one tab is never undone by the other tab\'s first session (its derived value differs)', async () => {
    const a = await openTab();
    const b = await openTab();
    a.useDrillStore.getState().updateSettings({ families: { ...a.useDrillStore.getState().settings.families, read: true } });
    // B, on the piano and never told, starts its first session: it would record off.
    b.useDrillStore.getState().startSession(BANK, NOW, { reading: false });
    expect(saved().state.settings.families.read).toBe(true);
  });
});
