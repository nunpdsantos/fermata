/**
 * An import forgets this tab's record of its entries (state/savedPlace.ts),
 * and the reload's own pagehide — which writes the record (state/appHistory.ts
 * `saveKnown`), as does the page being hidden — does not bring it back. Its
 * own file: one module instance listening, as in a page.
 */
import { afterEach, expect, it } from 'vitest';

/** The page hidden (jsdom's is always 'visible', so a visibilitychange alone writes nothing: review 3, F4). */
function hide(hidden: boolean) {
  if (hidden) Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
  else delete (document as unknown as { visibilityState?: unknown }).visibilityState;
}

afterEach(() => {
  hide(false);
  window.history.replaceState(null, '', '/');
  sessionStorage.clear();
});

it('forgotten, the record stays gone through the reload\'s pagehide and the page being hidden; before that, both write it', async () => {
  window.history.replaceState({ fm: 1, i: 2, v: 'learn', s: 'level/l1', l: 0 }, '');
  const { useAppStore } = await import('../store');
  useAppStore.setState({ view: 'learn' });
  await import('../appHistory');
  const saved = await import('../savedPlace');
  const RECORD = JSON.stringify([[2, 'learn', 'level/l1']]);
  // Known positives: not forgotten, a pagehide writes the record, and so does the page being hidden.
  window.dispatchEvent(new Event('pagehide'));
  expect(sessionStorage.getItem('fermatina-history-v1')).toBe(RECORD);
  sessionStorage.clear();
  hide(true);
  expect(document.visibilityState).toBe('hidden');
  document.dispatchEvent(new Event('visibilitychange'));
  expect(sessionStorage.getItem('fermatina-history-v1')).toBe(RECORD);
  hide(false);
  // An import forgets it: neither writes it again.
  saved.placeFromSave({ getItem: () => JSON.stringify({ state: { lastView: 'drill' }, version: 6 }) });
  expect(sessionStorage.getItem('fermatina-history-v1')).toBeNull();
  window.dispatchEvent(new Event('pagehide'));
  expect(sessionStorage.getItem('fermatina-history-v1')).toBeNull();
  hide(true);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(sessionStorage.getItem('fermatina-history-v1')).toBeNull();
});
