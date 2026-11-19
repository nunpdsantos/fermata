/**
 * "Follow my lessons" with two tabs open (review of bd14071, item 5): the
 * value a first session records (`startSession`, the switch's value in
 * force) is not a choice, so it never writes over the switch another tab's
 * learner set meanwhile; the learner's own tap on the switch, in any tab, is
 * their latest choice and is written whatever the save holds — the same cure
 * as guitar reading's (drillStore.ts `keepRecorded`, the mark in
 * `updateSettings`).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DRILL_STORE_KEY } from '../drillStore';
import { generateDrillBank } from '../../core/utils/drillBank';

const BANK = generateDrillBank({ includeRead: true });
const NOW = Date.UTC(2026, 10, 19, 9);
type Store = typeof import('../drillStore');
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the saved JSON is read freely in assertions
const saved = (): any => JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!);
async function openTab(): Promise<Store> {
  vi.resetModules();
  const mod = await import('../drillStore');
  await import('../tabSync');
  await new Promise((resolve) => setTimeout(resolve, 0));
  return mod;
}
const deliver = () => window.dispatchEvent(new StorageEvent('storage', { key: DRILL_STORE_KEY }));

beforeEach(() => localStorage.clear());

describe('Follow my lessons, two tabs', () => {
  it('the switch turned on in one tab is not undone by a stale tab\'s first session (whose value in force is off)', async () => {
    const a = await openTab();
    const b = await openTab();
    a.useDrillStore.getState().updateSettings({ followLessons: true });
    expect(saved().state.settings.followLessons).toBe(true);
    // B never heard of it; its learner starts a first session there (B derives "off").
    b.useDrillStore.getState().startSession(BANK, NOW, { followLessons: false, unlocked: null, reading: false });
    expect(saved().state.settings.followLessons).toBe(true);
  });

  it('…and the other way: turned off in one tab, a stale tab\'s first session (in force: on) leaves it off', async () => {
    const a = await openTab();
    const b = await openTab();
    a.useDrillStore.getState().updateSettings({ followLessons: false });
    b.useDrillStore.getState().startSession(BANK, NOW, { followLessons: true, unlocked: () => true, reading: false });
    expect(saved().state.settings.followLessons).toBe(false);
  });

  it('the learner\'s own tap in a stale tab is their latest choice: it wins over what another tab recorded', async () => {
    const a = await openTab();
    const b = await openTab();
    a.useDrillStore.getState().startSession(BANK, NOW, { followLessons: true, unlocked: () => true, reading: false });
    expect(saved().state.settings.followLessons).toBe(true);
    b.useDrillStore.getState().updateSettings({ followLessons: false });
    expect(saved().state.settings.followLessons).toBe(false);
  });

  it('a stale tab touching ANOTHER setting never writes its old switch over a newer one', async () => {
    const a = await openTab();
    const b = await openTab();
    a.useDrillStore.getState().updateSettings({ followLessons: true });
    deliver();
    expect(b.useDrillStore.getState().settings.followLessons).toBe(true);
    b.useDrillStore.getState().updateSettings({ followLessons: false });
    // A (never told) changes the session length.
    a.useDrillStore.getState().updateSettings({ length: 12 });
    expect(saved().state.settings.followLessons).toBe(false);
    expect(saved().state.settings.length).toBe(12);
  });
});
