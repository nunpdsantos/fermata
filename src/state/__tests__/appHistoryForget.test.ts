/**
 * A reset or an import forgets this tab's record of its entries
 * (state/savedPlace.ts), and the reload's own pagehide — which writes the
 * record (state/appHistory.ts `saveKnown`) — does not bring it back. Its own
 * file: one module instance listening, as in a page.
 */
import { afterEach, expect, it } from 'vitest';

afterEach(() => {
  window.history.replaceState(null, '', '/');
  sessionStorage.clear();
});

it('forgotten, the record stays gone through the reload\'s pagehide; before that, a pagehide writes it', async () => {
  window.history.replaceState({ fm: 1, i: 2, v: 'learn', s: 'level/l1', l: 0 }, '');
  const { useAppStore } = await import('../store');
  useAppStore.setState({ view: 'learn' });
  await import('../appHistory');
  const saved = await import('../savedPlace');
  window.dispatchEvent(new Event('pagehide'));
  expect(JSON.parse(sessionStorage.getItem('fermatina-history-v1')!)).toEqual([[2, 'learn', 'level/l1']]); // known positive
  saved.forgetPlace();
  expect(sessionStorage.getItem('fermatina-history-v1')).toBeNull();
  window.dispatchEvent(new Event('pagehide'));
  document.dispatchEvent(new Event('visibilitychange'));
  expect(sessionStorage.getItem('fermatina-history-v1')).toBeNull();
});
