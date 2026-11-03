import { beforeEach, describe, expect, it } from 'vitest';
import { useDrillStore, DRILL_STORE_KEY, DEFAULT_SETTINGS } from '../drillStore';
import { generateDrillBank, genRead } from '../../core/utils/drillBank';
import { registerDrillWorkInProgress } from '../drillWork';
import { hasWorkInProgress } from '../../services/workInProgress';
import { useAppStore } from '../store';
import fixture from './fixtures/drill-v3-before-reading.json';

// Production-shaped v3: the real v2 by-heart fixture with W9b's verdict/log
// for its one answered question added. No reading fields; no fabricated cards.
const bank = generateDrillBank({ includeRead: true });
const read = genRead();
beforeEach(() => { localStorage.clear(); useDrillStore.getState().resetDrillData(); });

describe('reading preserves Drill v3 data', () => {
  it('loads every old card, capped history, tier, tally, queue and setting unchanged; only defaults the new toggle', async () => {
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(fixture));
    await useDrillStore.persist.rehydrate();
    const state = useDrillStore.getState();
    expect(state.items).toEqual(fixture.state.items);
    expect(state.items['degree:num-to-name:1'].tier).toBe('byHeart');
    expect(state.activeSession).toEqual(fixture.state.activeSession);
    expect(state.sprintBests).toEqual(fixture.state.sprintBests);
    expect(state.lifetime).toEqual(fixture.state.lifetime);
    expect(state.settings).toEqual({ ...fixture.state.settings, families: { ...fixture.state.settings.families, read: true } });
    expect(read.every((item) => state.items[item.id] === undefined)).toBe(true);
    state.updateSettings({ sound: state.settings.sound });
    expect(JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!).version).toBe(3);
  });

  it('reading cards, verdict and family log round-trip through the actual persist API', async () => {
    useDrillStore.getState().updateSettings({ ...DEFAULT_SETTINGS, families: Object.fromEntries(Object.keys(DEFAULT_SETTINGS.families).map((f) => [f, f === 'read'])) as typeof DEFAULT_SETTINGS.families });
    useDrillStore.getState().startSession(bank, 1793613600000);
    const session = useDrillStore.getState().activeSession!;
    const question = bank.find((i) => i.id === session.queue[0])!;
    expect(question.family).toBe('read');
    useDrillStore.getState().recordAnswer(question, false, 2100, 1793613602100, true);
    const saved = localStorage.getItem(DRILL_STORE_KEY)!;
    expect(JSON.parse(saved).state.activeSession.log.byFamily.read).toEqual({ asked: 1, correct: 0 });
    useDrillStore.getState().resetDrillData();
    localStorage.setItem(DRILL_STORE_KEY, saved);
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    const { items, settings, sprintBests, lifetime, activeSession, sprint } = s;
    expect({ items, settings, sprintBests, lifetime, activeSession, sprint }).toEqual(JSON.parse(saved).state);
    expect(activeSession?.feedback).toEqual({ itemId: question.id, correct: false, nearMiss: true });
  });

  it('a reading answer is work in progress on the verdict and after Continue, until the session ends', () => {
    useAppStore.setState({ view: 'drill' });
    const unregister = registerDrillWorkInProgress();
    try {
      useDrillStore.getState().startSession(read, 1793613600000);
      expect(hasWorkInProgress()).toBe(false);
      const session = useDrillStore.getState().activeSession!;
      const question = read.find((i) => i.id === session.queue[0])!;
      useDrillStore.getState().recordAnswer(question, true, 1800, 1793613601800);
      expect(hasWorkInProgress()).toBe(true);
      useDrillStore.getState().clearFeedback();
      expect(hasWorkInProgress()).toBe(true);
      useDrillStore.getState().endSession();
      expect(hasWorkInProgress()).toBe(false);
    } finally {
      unregister();
      useAppStore.setState({ view: 'explore' });
    }
  });
});
