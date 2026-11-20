/**
 * After a reload that replaces the save, where the app comes back
 * (state/savedPlace.ts): an import opens the imported save's view at the same
 * position and forgets this tab's record of entries. A plain reload (and an
 * update's) touches neither: nothing here runs then. (A reset: the error
 * screen's tests and appHistoryInstall.test.ts.)
 */
import { afterEach, describe, expect, it } from 'vitest';
import { placeFromSave, HISTORY_RECORD_KEY } from '../savedPlace';
import { pickBootView } from '../bootView';

const save = (lastView: unknown) => ({ getItem: (k: string) => (k === 'music-theory-app' ? JSON.stringify({ state: { lastView }, version: 6 }) : null) });

afterEach(() => {
  window.history.replaceState(null, '');
  sessionStorage.clear();
});

describe('placeFromSave (an import)', () => {
  // Each of the app's three views, from an entry of ours on another view with a screen and a layer
  // (review 3, F2: a list of two views turned a Drill save into Explore, and no test read a Drill save).
  for (const [from, to] of [['drill', 'explore'], ['explore', 'learn'], ['learn', 'drill']] as const) {
    it(`a save last on ${to}, imported on ${from}: the entry keeps its position and names ${to}, no screen, no layer; the boot view is then ${to}`, () => {
      window.history.replaceState({ fm: 1, i: 4, v: from, s: 'mastery', l: 1 }, '');
      sessionStorage.setItem(HISTORY_RECORD_KEY, `[[4,"${from}","mastery"]]`);
      placeFromSave(save(to));
      expect(window.history.state).toEqual({ fm: 1, i: 4, v: to, l: 0 });
      expect(sessionStorage.getItem(HISTORY_RECORD_KEY)).toBeNull();
      expect(pickBootView('', from, window.history.state)).toBe(to);
    });
  }

  it('a save naming no view (or a bad one) opens Explore; an entry not ours is emptied', () => {
    window.history.replaceState({ fm: 1, i: 2, v: 'drill', s: 'mastery', l: 0 }, '');
    placeFromSave(save('home'));
    expect(window.history.state).toEqual({ fm: 1, i: 2, v: 'explore', l: 0 });
    placeFromSave({ getItem: () => 'not json' });
    expect(window.history.state).toEqual({ fm: 1, i: 2, v: 'explore', l: 0 });
    // Not ours: emptied, so the boot view is the saved one (pickBootView's own rule).
    window.history.replaceState({ other: true }, '');
    placeFromSave(save('drill'));
    expect(window.history.state).toBeNull();
  });
});
