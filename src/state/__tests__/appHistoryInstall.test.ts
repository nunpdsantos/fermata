/**
 * Taking the tab's history over as the module loads (state/appHistory.ts): a
 * reload keeps this tab's entry; its screen is the view's to open only when
 * the entry is of the view the app booted in (a ?view= or a reset can boot
 * elsewhere). Its own file: each case imports a fresh module.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  window.history.replaceState(null, '', '/');
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
});
