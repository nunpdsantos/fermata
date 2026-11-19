/**
 * After a reload that replaces or resets the save, where the app comes back
 * (state/savedPlace.ts): an import opens the imported save's view at the same
 * position; a reset names no place; both forget this tab's record of entries.
 * A plain reload (and an update's) touches neither: nothing here runs then.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { forgetPlace, placeFromSave, HISTORY_RECORD_KEY } from '../savedPlace';
import { pickBootView } from '../bootView';

const save = (lastView: unknown) => ({ getItem: (k: string) => (k === 'music-theory-app' ? JSON.stringify({ state: { lastView }, version: 6 }) : null) });

afterEach(() => {
  window.history.replaceState(null, '');
  sessionStorage.clear();
});

describe('placeFromSave (an import)', () => {
  it('the entry keeps its position and names the imported view, no screen, no layer; the boot view is then that view', () => {
    window.history.replaceState({ fm: 1, i: 4, v: 'explore', s: '', l: 1 }, '');
    sessionStorage.setItem(HISTORY_RECORD_KEY, '[[4,"explore",""]]');
    placeFromSave(save('learn'));
    expect(window.history.state).toEqual({ fm: 1, i: 4, v: 'learn', l: 0 });
    expect(sessionStorage.getItem(HISTORY_RECORD_KEY)).toBeNull();
    expect(pickBootView('', 'learn', window.history.state)).toBe('learn');
  });

  it('a save naming no view (or a bad one) opens Explore; an entry not ours is emptied', () => {
    window.history.replaceState({ fm: 1, i: 2, v: 'drill', s: 'mastery', l: 0 }, '');
    placeFromSave(save('home'));
    expect(window.history.state).toEqual({ fm: 1, i: 2, v: 'explore', l: 0 });
    placeFromSave({ getItem: () => 'not json' });
    expect(window.history.state).toEqual({ fm: 1, i: 2, v: 'explore', l: 0 });
    window.history.replaceState({ other: true }, '');
    placeFromSave(save('drill'));
    expect(window.history.state).toBeNull();
    expect(pickBootView('', 'drill', window.history.state)).toBe('drill');
  });
});

describe('forgetPlace (a reset)', () => {
  it('the entry names no place and the record goes', () => {
    window.history.replaceState({ fm: 1, i: 2, v: 'learn', s: 'level/l1', l: 0 }, '');
    sessionStorage.setItem(HISTORY_RECORD_KEY, '[[2,"learn","level/l1"]]');
    forgetPlace();
    expect(window.history.state).toBeNull();
    expect(sessionStorage.getItem(HISTORY_RECORD_KEY)).toBeNull();
  });
});
