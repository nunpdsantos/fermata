/**
 * W4b (owner's update-robustness decision): a reload loses nothing in Learn.
 * The session store keeps the open lesson / section and an in-progress check
 * in its OWN persisted key, versioned and shape-guarded; it expires after
 * 24 h, when the content under the saved ids changed (W4a identity) or in
 * another language; and it never touches saved progress.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  useLearnSessionStore,
  LEARN_SESSION_KEY,
  LEARN_SESSION_VERSION,
  LEARN_SESSION_TTL_MS,
  restorableScreen,
  restorableCheck,
  learnCheckInProgress,
  learnInProgress,
  fingerprintsOf,
  isValidLearnSession,
  type SavedCheck,
} from '../learnSessionStore';
import { hasWorkInProgress } from '../../services/workInProgress';
import { useProgressStore } from '../progressStore';
import { useAppStore } from '../store';
import type { ExerciseDefinition } from '../../core/types/exercise';
import errorBoundarySource from '../../components/ErrorBoundary.tsx?raw';

const ex = (id: string, prompt = `Q ${id}?`): ExerciseDefinition => ({
  id, type: 'multiple_choice', prompt,
  config: { type: 'multiple_choice', choices: [{ label: 'yes', correct: true }, { label: 'no', correct: false }, { label: 'maybe', correct: false }] },
});
const LIST = [ex('l1u1m1e1'), ex('l1u1m1e2'), ex('l1u1m1e3')];

function savedCheck(over: Partial<SavedCheck> = {}): SavedCheck {
  return {
    moduleId: 'l1u1m1', kind: 'check', lang: 'en', fingerprints: fingerprintsOf(LIST),
    run: { order: ['l1u1m1e2', 'l1u1m1e1', 'l1u1m1e3'], index: 1, scores: [1], items: [{ id: 'l1u1m1e2', answers: ['yes'], score: 1, answer: 'yes' }], attempt: 2, selectedNotes: [], tried: [{ value: 'no', words: 'no' }], missed: 'no', final: null },
    finished: false, at: Date.now(), ...over,
  };
}

beforeEach(() => {
  localStorage.clear();
  useLearnSessionStore.setState({ screen: null, check: null });
});

describe('Learn session store', () => {
  it('persists under its own key and version — never inside the progress save', () => {
    useProgressStore.getState().replaceProgress({ completedModules: ['l1u1m1'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} });
    const progressBefore = localStorage.getItem('music-theory-progress');
    useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'c1', at: Date.now() });
    useLearnSessionStore.getState().setCheck(savedCheck());
    const raw = JSON.parse(localStorage.getItem(LEARN_SESSION_KEY)!);
    expect(raw.version).toBe(LEARN_SESSION_VERSION);
    expect(raw.state.screen.section).toBe('c1');
    expect(raw.state.check.run.index).toBe(1);
    expect(localStorage.getItem('music-theory-progress')).toBe(progressBefore);
  });

  it('a reload restores the same screen and the same check', async () => {
    useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'tasks', at: Date.now() });
    useLearnSessionStore.getState().setCheck(savedCheck());
    const raw = localStorage.getItem(LEARN_SESSION_KEY)!;
    useLearnSessionStore.setState({ screen: null, check: null });
    localStorage.setItem(LEARN_SESSION_KEY, raw);
    await useLearnSessionStore.persist.rehydrate();
    expect(restorableScreen()).toMatchObject({ moduleId: 'l1u1m1', section: 'tasks' });
    const r = restorableCheck('l1u1m1', LIST, 'en');
    expect(r?.ordered.map((e) => e.id)).toEqual(['l1u1m1e2', 'l1u1m1e1', 'l1u1m1e3']);
    expect(r?.check.run).toMatchObject({ index: 1, scores: [1], attempt: 2, missed: 'no' });
  });

  it('expires: after 24 h, in another language, or when a saved id now names another exercise', () => {
    const old = Date.now() - LEARN_SESSION_TTL_MS - 1;
    useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: null, at: old });
    expect(restorableScreen()).toBeNull();

    useLearnSessionStore.getState().setCheck(savedCheck({ at: old }));
    expect(restorableCheck('l1u1m1', LIST, 'en')).toBeNull();
    expect(useLearnSessionStore.getState().check).toBeNull(); // dropped

    useLearnSessionStore.getState().setCheck(savedCheck());
    expect(restorableCheck('l1u1m1', LIST, 'pt')).toBeNull();

    useLearnSessionStore.getState().setCheck(savedCheck());
    const changed = [ex('l1u1m1e1'), ex('l1u1m1e2', 'A different question?'), ex('l1u1m1e3')];
    expect(restorableCheck('l1u1m1', changed, 'en')).toBeNull();

    useLearnSessionStore.getState().setCheck(savedCheck());
    expect(restorableCheck('l1u1m1', LIST.slice(1), 'en')).toBeNull(); // an id is gone
  });

  it('malformed or other-version saves are dropped, without touching progress', async () => {
    useProgressStore.getState().replaceProgress({ completedModules: ['l1u1m1'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} });
    for (const bad of [
      { state: { screen: { type: 'module' }, check: null }, version: 1 },
      { state: { screen: null, check: { ...savedCheck(), run: { order: 'x' } } }, version: 1 },
      { state: { screen: null, check: savedCheck() }, version: 99 },
      'not json',
    ]) {
      localStorage.setItem(LEARN_SESSION_KEY, typeof bad === 'string' ? bad : JSON.stringify(bad));
      await useLearnSessionStore.persist.rehydrate();
      const s = useLearnSessionStore.getState();
      expect([s.screen, s.check]).toEqual([null, null]);
    }
    expect(useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1']);
    expect(isValidLearnSession({ screen: null, check: savedCheck() })).toBe(true);
  });

  it("'learn' work in progress: a lesson open in Learn (reading counts), not the overview, not another view", () => {
    useAppStore.setState({ view: 'learn' });
    expect(learnInProgress()).toBe(false); // the overview / level list: no lesson screen saved
    useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'c1', at: Date.now() });
    expect(learnInProgress()).toBe(true);
    expect(hasWorkInProgress()).toBe(true);
    useAppStore.setState({ view: 'explore' });
    expect(learnInProgress()).toBe(false); // the lesson is behind another view: a reload moves nobody
    useAppStore.setState({ view: 'learn' });
    useLearnSessionStore.getState().setScreen({ type: 'review', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: null, at: Date.now() - LEARN_SESSION_TTL_MS - 1 });
    expect(learnInProgress()).toBe(false); // stale
    useLearnSessionStore.getState().setScreen(null);
    expect(hasWorkInProgress()).toBe(false);
  });

  it('hasWorkInProgress(): true while a check is under way, false when finished, gone or stale', () => {
    expect(hasWorkInProgress()).toBe(false);
    useLearnSessionStore.getState().setCheck(savedCheck());
    expect(learnCheckInProgress()).toBe(true);
    expect(hasWorkInProgress()).toBe(true);
    useLearnSessionStore.getState().setCheck(savedCheck({ finished: true }));
    expect(hasWorkInProgress()).toBe(false);
    useLearnSessionStore.getState().setCheck(savedCheck({ at: Date.now() - LEARN_SESSION_TTL_MS - 1 }));
    expect(hasWorkInProgress()).toBe(false);
    useLearnSessionStore.getState().setCheck(null);
    expect(hasWorkInProgress()).toBe(false);
  });
});

describe('recovery clears the Learn session', () => {
  it('ErrorBoundary carries the key verbatim and removes it in both resets', () => {
    expect(errorBoundarySource).toContain(`'${LEARN_SESSION_KEY}'`);
    const removals = errorBoundarySource.match(/localStorage\.removeItem\(LEARN_SESSION_KEY_LITERAL\)/g) ?? [];
    expect(removals.length).toBe(2);
  });
});


describe('inconsistent saves are rejected before mounting', () => {
  const corruptions = [
    ['index at end', { index: 3 }], ['fractional index', { index: 0.5 }],
    ['duplicate order', { order: ['l1u1m1e2', 'l1u1m1e2', 'l1u1m1e3'] }],
    ['missing scores', { scores: [] }], ['missing items', { items: [] }],
    ['wrong item order', { items: [{ id: 'l1u1m1e3', answers: ['yes'], score: 1, answer: 'yes' }] }],
    ['mismatched score', { scores: [0] }], ['retry without miss', { missed: null }],
    ['fractional pitch class', { selectedNotes: [0.5] }], ['out of range pitch class', { selectedNotes: [12] }],
    ['duplicate pitch classes', { selectedNotes: [0, 0] }],
  ] as const;
  it.each(corruptions)('%s', async (_, patch) => {
    const check = savedCheck();
    const data = { screen: null, check: { ...check, run: { ...check.run, selectedNotes: [], ...patch } } };
    expect(isValidLearnSession(data)).toBe(false);
    localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify({ state: data, version: 1 }));
    await useLearnSessionStore.persist.rehydrate();
    expect(useLearnSessionStore.getState().check).toBeNull();
  });
  it('unfinished result and unknown or mismatched screen ids', () => {
    expect(isValidLearnSession({ screen: null, check: savedCheck({ finished: true }) })).toBe(false);
    for (const patch of [{ levelId: 'l99' }, { unitId: 'u99' }, { moduleId: 'gone' }, { levelId: 'l2' }]) {
      expect(isValidLearnSession({ screen: { type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: null, at: Date.now(), ...patch }, check: null })).toBe(false);
    }
  });
});
