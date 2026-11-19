/**
 * Taking the tab's history over as the module loads (state/appHistory.ts): a
 * reload keeps this tab's entry; its screen is the view's to open only when
 * the entry is of the view the app booted in (a ?view= or a reset can boot
 * elsewhere). Its own file: each case imports a fresh module.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
  sessionStorage.clear();
});

describe('installAppHistory', () => {
  it('a reload in the entry\'s view: its index and screen are kept, and the view opens that screen', async () => {
    window.history.replaceState({ fm: 1, i: 4, v: 'drill', s: 'mastery', l: 1 }, '');
    const { useAppStore } = await import('../store');
    useAppStore.setState({ view: 'drill' });
    const h = await import('../appHistory');
    expect(h.currentEntry()).toEqual({ fm: 1, i: 4, v: 'drill', s: 'mastery', l: 0 });
    expect(window.history.state).toEqual({ fm: 1, i: 4, v: 'drill', s: 'mastery', l: 0 });
    expect(h.placeToOpen('drill')).toBe('mastery');
  });

  it('booted in another view than the entry\'s: the screen is dropped (the view decides), the index kept', async () => {
    window.history.replaceState({ fm: 1, i: 4, v: 'drill', s: 'mastery', l: 0 }, '');
    const { useAppStore } = await import('../store');
    useAppStore.setState({ view: 'learn' });
    const h = await import('../appHistory');
    expect(h.currentEntry()).toEqual({ fm: 1, i: 4, v: 'learn', s: undefined, l: 0 });
    expect(h.placeToOpen('learn')).toBeUndefined();
  });

  it('no entry of ours (a first load, a reset): index 0, nothing to open', async () => {
    window.history.replaceState(null, '');
    const { useAppStore } = await import('../store');
    useAppStore.setState({ view: 'explore' });
    const h = await import('../appHistory');
    expect(h.currentEntry()).toEqual({ fm: 1, i: 0, v: 'explore', s: undefined, l: 0 });
    expect(h.placeToOpen('explore')).toBeUndefined();
  });

  it('review 2, item 5: the entries this tab knew come back after a reload, so the app\'s own ← still goes Back to them; written only as the page is hidden, never while it is used', async () => {
    window.history.replaceState({ fm: 1, i: 3, v: 'learn', s: 'module/l1/u34/l1u34m4', l: 0 }, '');
    // What the page left as it was hidden: the track page, lessons 2, 3 and 4 by "Next lesson".
    sessionStorage.setItem('fermatina-history-v1', JSON.stringify([[0, 'learn', 'unit/l1/u34'], [1, 'learn', 'module/l1/u34/l1u34m2'], [2, 'learn', 'module/l1/u34/l1u34m3'], [3, 'learn', 'module/l1/u34/l1u34m4']]));
    const { useAppStore } = await import('../store');
    useAppStore.setState({ view: 'learn' });
    const h = await import('../appHistory');
    const go = vi.spyOn(window.history, 'go').mockImplementation(() => undefined);
    const set = vi.spyOn(Storage.prototype, 'setItem');
    h.backTo('learn', 'unit/l1/u34'); // the lesson's ←
    expect(go).toHaveBeenCalledWith(-3);
    expect(set).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('pagehide'));
    expect(set).toHaveBeenCalled(); // the spy sees a write (known positive; every module this file imported listens)
    expect(JSON.parse(sessionStorage.getItem('fermatina-history-v1')!)).toEqual([[0, 'learn', 'unit/l1/u34'], [1, 'learn', 'module/l1/u34/l1u34m2'], [2, 'learn', 'module/l1/u34/l1u34m3'], [3, 'learn', 'module/l1/u34/l1u34m4']]);
  });

  it('review 2, item 5: a record that is not ours in shape, or that disagrees with the entry on screen (another document of this tab), is not read', async () => {
    for (const stored of [
      '[[0,"learn","unit/l1/u34"],[3,"learn","module/l1/u34/l1u34m3"]]', // another screen at this index
      '[[0,"learn","unit/l1/u34"],[3,"home","x"]]',
      '[[0,"learn",5],[3,"learn","module/l1/u34/l1u34m4"]]',
      '{"0":"learn"}',
      'not json',
    ]) {
      vi.resetModules();
      window.history.replaceState({ fm: 1, i: 3, v: 'learn', s: 'module/l1/u34/l1u34m4', l: 0 }, '');
      sessionStorage.setItem('fermatina-history-v1', stored);
      const { useAppStore } = await import('../store');
      useAppStore.setState({ view: 'learn' });
      const h = await import('../appHistory');
      const go = vi.spyOn(window.history, 'go').mockImplementation(() => undefined);
      h.backTo('learn', 'unit/l1/u34');
      expect(go, stored).not.toHaveBeenCalled();
      expect(h.currentEntry(), stored).toMatchObject({ i: 3, s: 'unit/l1/u34' }); // rewritten, as with nothing known
      go.mockRestore();
    }
  });

  it('review 2, item 5: a reset (no entry of ours) starts with nothing known', async () => {
    window.history.replaceState(null, '');
    sessionStorage.setItem('fermatina-history-v1', JSON.stringify([[0, 'learn', 'unit/l1/u34']]));
    const { useAppStore } = await import('../store');
    useAppStore.setState({ view: 'learn' });
    const h = await import('../appHistory');
    const go = vi.spyOn(window.history, 'go').mockImplementation(() => undefined);
    h.notePlace('learn', 'module/l1/u34/l1u34m2');
    h.backTo('learn', 'unit/l1/u34');
    expect(go).not.toHaveBeenCalled();
  });
});
