/**
 * A mark never writes into anything the merge shares (second audit round,
 * 2026-11-19).
 *
 * The model (tabsModel.test.ts) failed beyond the seeds release 16 was proven
 * on: seeds 2213 and 2215 at release 16, 2205 with this round's Drill actions
 * (200 steps, 4 tabs), each saving a Learn score the reference said was gone.
 * The cause was in the app. A module's result the save no longer has (another
 * tab's "Reset app data" or import, not yet heard here) merges from the
 * result's empty form, and progressStore.ts holds ONE such form for every
 * module (`onEmpty({ scores: {}, … })`). Where this tab had not changed the
 * result's scores (the same question answered again with the same score), the
 * merge returned the empty form's own `scores` object, and the mark of the
 * answer just recorded (`markNext`, applied in place by tabMerge.ts
 * `mergeWrite`) wrote the score INTO it. From then on, for that tab's life,
 * the empty result "had" that score: a later answer in any lesson whose result
 * the save lacked wrote it there (the score came back after a second reset, or
 * appeared in another lesson's result), and where this tab's base lacked the
 * result, another tab's saved score for that question (whatever its value)
 * read as one this tab had removed and was erased. The fix: the marks are
 * applied to a copy of the merged state.
 *
 * "Reset app data" in another tab is modelled as the model does it: the key
 * removed, this tab told nothing (no storage event), unless the case says so.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const PROGRESS = 'music-theory-progress';
const SETTINGS = 'music-theory-app';
const NOW = 1_800_000_000_000;
const at = (n: number) => NOW + n * 60_000;

type Safe = typeof import('../tabSafe');
type Progress = typeof import('../progressStore');
const opened: Safe[] = [];
async function progressTab(following = true): Promise<Progress> {
  vi.resetModules();
  if (!following) {
    // The lazy follow module never arrived (a failed download): this tab writes, it does not follow.
    vi.doMock('../tabSync', async () => {
      throw new Error('offline');
    });
  }
  const mod = await import('../progressStore');
  const safe = await import('../tabSafe');
  if (following) await import('../tabSync');
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(typeof safe.tabLine(PROGRESS)?.adopt).toBe(following ? 'function' : 'undefined');
  opened.push(safe);
  return mod;
}
const answer = (tab: Progress, n: number, moduleId: string, exerciseId: string, score: 0 | 0.5 | 1) => {
  vi.setSystemTime(at(n));
  tab.useProgressStore.getState().recordExerciseResult(moduleId, exerciseId, score);
};
const resetElsewhere = () => localStorage.removeItem(PROGRESS);
const tell = () => window.dispatchEvent(new StorageEvent('storage', { key: PROGRESS }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- saved JSON, read freely in assertions
const results = (): Record<string, any> => JSON.parse(localStorage.getItem(PROGRESS)!).state.progress.exerciseResults;

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});
afterEach(() => {
  for (const safe of opened.splice(0)) safe.tabLine(PROGRESS)?.stop?.();
  vi.doUnmock('../tabSync');
  vi.useRealTimers();
  localStorage.clear();
  localStorage.setItem(SETTINGS, JSON.stringify({ state: {}, version: 6 }));
});

describe('a score this tab answered again after a reset elsewhere never comes back, moves or erases one', () => {
  it('seed 2205: after a second reset this tab missed too, the next answer saves that answer alone', async () => {
    const a = await progressTab();
    answer(a, 1, 'l1u1m1', 'l1u1m1e1', 1);
    resetElsewhere();
    answer(a, 2, 'l1u1m1', 'l1u1m1e1', 1); // the same question, the same score, after the reset: a new answer
    expect(results()).toEqual({ l1u1m1: { scores: { l1u1m1e1: 1 }, totalAttempts: 1, lastAttemptAt: at(2), passed: false } });
    resetElsewhere(); // removes that answer too
    answer(a, 3, 'l1u1m1', 'l1u1m1e2', 0);
    expect(results()).toEqual({ l1u1m1: { scores: { l1u1m1e2: 0 }, totalAttempts: 1, lastAttemptAt: at(3), passed: false } });
  });

  it('seed 2213: in a tab that does not follow, one reset is enough for a score of one lesson to appear in another', async () => {
    const a = await progressTab(false);
    answer(a, 1, 'l1u1m1', 'l1u1m1e1', 1);
    answer(a, 2, 'l1u1m2', 'l1u1m2e5', 0.5);
    resetElsewhere();
    answer(a, 3, 'l1u1m1', 'l1u1m1e1', 1);
    answer(a, 4, 'l1u1m2', 'l1u1m2e6', 1);
    expect(results()).toEqual({
      l1u1m1: { scores: { l1u1m1e1: 1 }, totalAttempts: 1, lastAttemptAt: at(3), passed: false },
      l1u1m2: { scores: { l1u1m2e6: 1 }, totalAttempts: 1, lastAttemptAt: at(4), passed: false },
    });
  });

  it('a score another tab saved after a reset this tab heard is not erased by this tab\'s next answer', async () => {
    const a = await progressTab();
    answer(a, 1, 'l1u1m1', 'l1u1m1e1', 1);
    resetElsewhere();
    answer(a, 2, 'l1u1m1', 'l1u1m1e1', 1);
    resetElsewhere();
    tell(); // this tab follows the second reset: nothing in memory
    expect(a.useProgressStore.getState().progress.exerciseResults ?? {}).toEqual({});
    const b = await progressTab();
    answer(b, 3, 'l1u1m1', 'l1u1m1e1', 1); // the learner answers it in the other tab; this one has not heard yet
    answer(a, 4, 'l1u1m1', 'l1u1m1e2', 0);
    expect(results()).toEqual({ l1u1m1: { scores: { l1u1m1e1: 1, l1u1m1e2: 0 }, totalAttempts: 2, lastAttemptAt: at(4), passed: false } });
  });
});

describe('mergeWrite applies the marks to its own copy (every store, and every mark to come)', () => {
  const store = { getState: () => ({}), setState: () => {}, getInitialState: () => ({}), persist: { getOptions: () => ({ version: 1 }) } };
  const env = (state: object) => JSON.stringify({ state, version: 1 });

  it('a rule\'s empty form is never written into by a mark', async () => {
    vi.resetModules();
    const { tabSafeStorage, markNext } = await import('../tabSafe');
    const { onEmpty } = await import('../tabMerge');
    const empty = { scores: {} as Record<string, number>, n: 0 };
    const storage = tabSafeStorage('k', () => store, { rec: { '*': onEmpty(empty, { scores: { '*': 'atomic' }, n: 'sum' }) } });
    localStorage.setItem('k', env({ rec: { r1: { scores: { x: 1 }, n: 1 } } }));
    storage.getItem('k'); // this tab read it
    localStorage.setItem('k', env({ rec: {} })); // another tab removed r1
    // This tab: the same score again (its scores unchanged), its attempt counted, the score marked.
    markNext('k', [['rec', 'r1', 'scores', 'x'], () => 1]);
    storage.setItem('k', env({ rec: { r1: { scores: { x: 1 }, n: 2 } } }));
    expect(JSON.parse(localStorage.getItem('k')!)).toEqual({ state: { rec: { r1: { scores: { x: 1 }, n: 1 } } }, version: 1 });
    expect(empty).toEqual({ scores: {}, n: 0 });
  });

  it('this tab\'s base stays the memory it wrote when the merge returns that memory and a mark sets another value', async () => {
    vi.resetModules();
    const { tabSafeStorage, markNext, tabLine } = await import('../tabSafe');
    const storage = tabSafeStorage('k', () => store, 'fields');
    storage.getItem('k');
    storage.setItem('k', env({ a: 1, b: 1 })); // written alone
    tabLine('k')!.behind = true; // memory lacks something (a merged write it could not follow): every write merges
    markNext('k', [['a'], () => 2]); // what the action sets on purpose, whatever memory holds
    const raw = env({ a: 1, b: 3 });
    storage.setItem('k', raw); // the save did not change since: the merge is this tab's memory itself
    expect(JSON.parse(localStorage.getItem('k')!).state).toEqual({ a: 2, b: 3 });
    expect(tabLine('k')?.base).toEqual(JSON.parse(raw).state);
  });

  // An empty list of marks — `markNext(key)` with none, as `clearOverrides([])` makes (the app's two
  // "Reset to suggested" buttons are disabled with no override to clear, so only code calls it so) — is no marks.
  async function wroteAlone() {
    vi.resetModules();
    const safe = await import('../tabSafe');
    const storage = safe.tabSafeStorage('k', () => store, 'fields');
    storage.getItem('k');
    storage.setItem('k', env({ a: 1 })); // this tab wrote {a: 1}
    localStorage.setItem('k', env({ a: 1, b: 2 })); // another tab wrote since
    return { ...safe, storage };
  }

  it('with nothing of this tab\'s to save, an empty list of marks writes nothing (the "nothing to save" shortcut)', async () => {
    const { storage, markNext, tabLine } = await wroteAlone();
    const before = localStorage.getItem('k');
    const set = vi.spyOn(Storage.prototype, 'setItem');
    markNext('k');
    storage.setItem('k', env({ a: 1 })); // this tab's memory as it was
    expect(set).not.toHaveBeenCalled();
    set.mockRestore();
    expect(localStorage.getItem('k')).toBe(before);
    expect(tabLine('k')?.behind).toBe(true);
  });

  it('a merging write with an empty list of marks does what one with none does: the same text, no copy made', async () => {
    const runs: { text: string | null; parses: number }[] = [];
    for (const empty of [false, true]) {
      localStorage.clear();
      const { storage, markNext } = await wroteAlone();
      const parse = vi.spyOn(JSON, 'parse');
      if (empty) markNext('k');
      storage.setItem('k', env({ a: 3 })); // this tab changed a
      runs.push({ text: localStorage.getItem('k'), parses: parse.mock.calls.length });
      parse.mockRestore();
    }
    expect(runs[0].text).toBe(env({ a: 3, b: 2 }));
    expect(runs[1]).toEqual(runs[0]);
  });
});
