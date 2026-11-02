/**
 * Drill's side of "work in progress" (W9b, src/state/drillWork.ts): what a
 * silent app update must never cut off. Read from the persisted drill state,
 * which the drill store writes synchronously on every change.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { drillStateHasWork, registerDrillWorkInProgress, DRILL_STORE_KEY_LITERAL } from '../drillWork';
import { useDrillStore, DRILL_STORE_KEY, DEFAULT_SETTINGS } from '../drillStore';
import { useAppStore } from '../store';
import { hasWorkInProgress } from '../../services/workInProgress';
import { generateDrillBank } from '../../core/utils/drillBank';

const session = (over: Record<string, unknown> = {}) => ({
  id: 's1', queue: ['a', 'b', 'c', 'd'], index: 1, asked: 1, correct: 1, startedAt: 1, seed: 1, missRequeues: {}, ...over,
});
const sprint = (secondsLeft: number) => ({
  seed: 1, pool: ['a', 'b', 'c', 'd', 'e'], step: 2, correct: 2, secondsLeft, familiesKey: 'triad', priorBest: 0, recorded: secondsLeft === 0,
});

describe('drillStateHasWork', () => {
  it.each([
    ['nothing saved', null, false],
    ['garbage', 'x', false],
    ['no session, no sprint', { activeSession: null, sprint: null }, false],
    ['a session nobody has answered in yet (resumes as it was)', { activeSession: session({ index: 0, asked: 0, correct: 0 }) }, false],
    ['a session with answers, not complete', { activeSession: session(), settings: { length: 12 } }, true],
    ['a complete session (the summary)', { activeSession: session({ asked: 12, index: 4 }), settings: { length: 12 } }, false],
    ['an exhausted queue (the summary)', { activeSession: session({ asked: 4, index: 4 }), settings: { length: 12 } }, false],
    ['the verdict of an answered question on screen — even the last one', { activeSession: session({ asked: 12, index: 4, feedback: { itemId: 'd', correct: false, nearMiss: false } }), settings: { length: 12 } }, true],
    ['a Sprint with time left', { activeSession: null, sprint: sprint(37) }, true],
    ['a finished Sprint (the score screen)', { activeSession: null, sprint: sprint(0) }, false],
    ['a session with answers and no settings saved (default length 24)', { activeSession: session({ asked: 13, index: 2 }) }, true],
  ])('%s → %s', (_label, state, expected) => {
    expect(drillStateHasWork(state)).toBe(expected);
  });
});

describe('the registered Drill source', () => {
  let unregister: () => void = () => {};
  beforeEach(() => {
    localStorage.clear();
    useDrillStore.getState().resetDrillData();
    useAppStore.setState({ view: 'drill' });
    unregister = registerDrillWorkInProgress();
  });
  afterEach(() => {
    unregister();
    useAppStore.setState({ view: 'explore' });
    localStorage.clear();
  });

  it('its key literal is the drill store\'s key (it must not import the store: ts-fsrs)', () => {
    expect(DRILL_STORE_KEY_LITERAL).toBe(DRILL_STORE_KEY);
  });

  it('follows the REAL store through a session: busy after the first answer, free once it is over', () => {
    const bank = generateDrillBank();
    const byId = new Map(bank.map((i) => [i.id, i]));
    useDrillStore.getState().updateSettings({ ...DEFAULT_SETTINGS, length: 12, newPerSession: 12 });
    useDrillStore.getState().startSession(bank, Date.UTC(2026, 10, 2, 9));
    expect(hasWorkInProgress()).toBe(false); // nothing answered yet

    const s = useDrillStore.getState().activeSession!;
    useDrillStore.getState().recordAnswer(byId.get(s.queue[s.index])!, true, 1500, Date.UTC(2026, 10, 2, 9, 1));
    expect(hasWorkInProgress()).toBe(true); // the verdict is on screen
    useDrillStore.getState().clearFeedback();
    expect(hasWorkInProgress()).toBe(true); // one answer in, not complete

    useDrillStore.getState().endSession();
    expect(hasWorkInProgress()).toBe(false);
  });

  it('only while the learner is in the Drill view (an abandoned session elsewhere resumes exactly)', () => {
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify({ state: { activeSession: session(), settings: { length: 12 } }, version: 3 }));
    expect(hasWorkInProgress()).toBe(true);
    useAppStore.setState({ view: 'explore' });
    expect(hasWorkInProgress()).toBe(false);
    useAppStore.setState({ view: 'learn' });
    expect(hasWorkInProgress()).toBe(false);
  });

  it('a Sprint under way counts', () => {
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify({ state: { activeSession: null, sprint: sprint(12) }, version: 3 }));
    expect(hasWorkInProgress()).toBe(true);
  });

  it('a corrupt saved blob counts as busy (the safe side)', () => {
    localStorage.setItem(DRILL_STORE_KEY, '{not json');
    expect(hasWorkInProgress()).toBe(true);
  });

  it('unregistering removes the source', () => {
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify({ state: { activeSession: session(), settings: { length: 12 } }, version: 3 }));
    unregister();
    expect(hasWorkInProgress()).toBe(false);
  });
});
