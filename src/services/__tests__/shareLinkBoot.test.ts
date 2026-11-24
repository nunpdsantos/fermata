/**
 * A shared link's own code at boot (services/shareLinkBoot.ts): it arrives
 * (applied, or offered when the learner went elsewhere meanwhile), it cannot
 * be fetched (one lasting toast, "Try Again"), and Try Again (the link put
 * back in the address, the page reloaded) then a second boot that fails
 * again or succeeds as a first one does, the work-in-progress rule included.
 * The loader is injected: a failed import() is what the browser gives when
 * the chunk's request fails.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const reload = vi.hoisted(() => ({ calls: 0 }));
vi.mock('../../hooks/usePWA.ts', () => ({
  applyUpdateOrReload: async () => {
    reload.calls++;
  },
}));

import i18n from '../../i18n/index.ts';
import type { Note } from '../../core/types/music';
import { openLinkCode } from '../shareLinkBoot.ts';
import { resetShareLinkOpen } from '../shareLinkOpen.ts';
import { registerWorkInProgress } from '../workInProgress.ts';
import { useAppStore } from '../../state/store.ts';
import { useToastStore } from '../../state/toastStore.ts';
import { readShareParams } from '../../state/shareParams.ts';

const ADDRESS = '/?key=G&scale=major';
const LINK = readShareParams('?key=G&scale=major')!;
const fetched = () => import('../shareLinkOpen.ts');
const failed = () => Promise.reject(new TypeError('Failed to fetch dynamically imported module: /assets/shareLinkOpen-x.js'));
const C: Note = { natural: 'C', accidental: '' };
const G: Note = { natural: 'G', accidental: '' };
const toasts = () => useToastStore.getState().toasts;

beforeEach(() => {
  useAppStore.setState({ view: 'explore', lastView: 'explore', selectedKey: C, selectedScale: 'major', selectedChord: null, pendingLearnTarget: null });
  useToastStore.setState({ toasts: [] });
  window.history.replaceState({ fm: 1, i: 3, v: 'explore', l: 0 }, '', '/');
  reload.calls = 0;
});

afterEach(async () => {
  resetShareLinkOpen();
  await i18n.changeLanguage('en');
});

describe('a shared link’s own code at boot', () => {
  it('arrives: the link is applied and nothing is said', async () => {
    await openLinkCode(LINK, LINK, () => false, ADDRESS, fetched);
    expect(useAppStore.getState().selectedKey).toEqual(G);
    expect(toasts()).toEqual([]);
    expect(reload.calls).toBe(0);
  });

  it('arrives after the learner went to another view: offered with “Open”, never applied over it', async () => {
    useAppStore.setState({ view: 'learn' });
    await openLinkCode(LINK, LINK, () => true, ADDRESS, fetched);
    expect(useAppStore.getState().view).toBe('learn');
    expect(useAppStore.getState().selectedKey).toEqual(C);
    expect(toasts().map((t) => [t.message, t.action?.label, t.duration])).toEqual([['Ready to open the link: G Major', 'Open', 0]]);
    toasts()[0].action!.onSelect();
    expect(useAppStore.getState().view).toBe('explore');
    expect(useAppStore.getState().selectedKey).toEqual(G);
  });

  it('cannot be fetched: nothing applied, never throws, one lasting toast says so with “Try Again”, in the learner’s language', async () => {
    const words = {
      en: ['The link could not open.', 'Try Again'],
      pt: ['Não foi possível abrir a ligação.', 'Tentar novamente'],
      es: ['No se ha podido abrir el enlace.', 'Intentar de nuevo'],
    } as const;
    for (const lang of ['en', 'pt', 'es'] as const) {
      await i18n.changeLanguage(lang);
      useToastStore.setState({ toasts: [] });
      await expect(openLinkCode(LINK, LINK, () => false, ADDRESS, failed)).resolves.toBeUndefined();
      expect(toasts().map((t) => [t.type, t.message, t.action?.label, t.duration]), lang).toEqual([['error', ...words[lang], 0]]);
      expect(useAppStore.getState().selectedKey).toEqual(C);
      expect(window.location.search).toBe('');
    }
    expect(reload.calls).toBe(0);
  });

  it('Try Again puts the link back in the address (this entry’s state kept) and reloads; the reloaded page that fails again says so again, and one that succeeds applies it as a first visit does', async () => {
    await openLinkCode(LINK, LINK, () => false, ADDRESS, failed);
    toasts()[0].action!.onSelect();
    expect(window.location.pathname + window.location.search).toBe(ADDRESS);
    expect(window.history.state).toEqual({ fm: 1, i: 3, v: 'explore', l: 0 });
    expect(reload.calls).toBe(1);

    // The reloaded page (App reads the address again and cleans it) fails again: the same toast.
    window.history.replaceState(window.history.state, '', '/');
    useToastStore.setState({ toasts: [] });
    await openLinkCode(LINK, LINK, () => false, ADDRESS, failed);
    expect(toasts().map((t) => [t.message, t.action?.label])).toEqual([['The link could not open.', 'Try Again']]);
    toasts()[0].action!.onSelect();
    expect(reload.calls).toBe(2);

    // The next reload gets the code: applied, as a first success.
    useToastStore.setState({ toasts: [] });
    await openLinkCode(LINK, LINK, () => false, ADDRESS, fetched);
    expect(useAppStore.getState().selectedKey).toEqual(G);
    expect(toasts()).toEqual([]);
  });

  it('a success after Try Again keeps the work-in-progress rule: held, with the waiting toast, nothing applied', async () => {
    const unregister = registerWorkInProgress('boot-test-busy', () => true);
    try {
      await openLinkCode(LINK, LINK, () => false, ADDRESS, failed);
      toasts()[0].action!.onSelect();
      useToastStore.setState({ toasts: [] });
      await openLinkCode(LINK, LINK, () => false, ADDRESS, fetched);
      expect(useAppStore.getState().selectedKey).toEqual(C);
      expect(toasts().map((t) => t.message)).toEqual(['This link opens G Major. Fermatina will offer to open it when you have finished what you are doing.']);
    } finally {
      unregister();
    }
  });
});
