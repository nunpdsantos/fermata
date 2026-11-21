/**
 * A shared link at boot, from the address it was opened with to the moment it
 * is applied, offered, held or has failed (App.tsx, services/shareLinkBoot.ts,
 * services/shareLinkOpen.ts; leftovers round, review S-1). The real App and
 * the real link code run; only the link code's download and the lesson-title
 * downloads are held back or made to fail, and the reload is a spy.
 *
 *  - "Try Again" restores EXACTLY the address the page was opened with, in
 *    every form a link takes (a fragment the link's own `#` made included).
 *  - A lesson offered names its title in the learner's language, also when
 *    that language's titles arrive after the code.
 *  - The learner is free until the link is APPLIED: going elsewhere, or
 *    choosing anything the link would set, at any moment before (the code
 *    on its way, or the titles), draws that and the link is offered.
 *  - Writes that are not the learner's (another tab's save, the app's own
 *    settings) do not turn an ordinary open into an offer.
 *  - Offline with nothing to serve a reload, "Try Again" leaves the page and
 *    the link as they are; with a service worker in control it reloads.
 *  - A rejection inside the link's code ends the wait and is handled; the
 *    watch on the store is stopped once the link has settled, every outcome.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';

vi.mock('../views/ExploreView.tsx', () => ({ ExploreView: () => <div>EXPLORE_VIEW</div> }));
vi.mock('../views/LearnView.tsx', () => ({ LearnView: () => <div>LEARN_VIEW</div> }));
vi.mock('../views/DrillView.tsx', () => ({ DrillView: () => <div>DRILL_VIEW</div> }));
vi.mock('../hooks/useTheme.ts', () => ({ useTheme: () => {} }));
vi.mock('../hooks/useLanguage.ts', () => ({ useLanguage: () => {} }));
vi.mock('../components/navigation/QuickSearch.tsx', () => ({ QuickSearch: () => null }));
vi.mock('../components/layout/PWAPrompts.tsx', () => ({ PWAPrompts: () => null }));
vi.mock('../components/layout/Toast.tsx', () => ({ ToastContainer: () => null }));
vi.mock('../components/share/ShareLinkHost.tsx', () => ({ ShareLinkHost: () => null }));
vi.mock('../components/layout/AppShell.tsx', () => ({
  AppShell: (p: { children: React.ReactNode }) => <div>{p.children}</div>,
}));

const gate = vi.hoisted(() => ({
  wait: null as Promise<void> | null,
  fail: false,
  reject: false,
  reloads: 0,
  arrived: false,
  release: null as (() => void) | null,
}));
/** The PT / ES lesson titles, each held until the test lets it go (each loads once per file). */
const titles = vi.hoisted(() => {
  const held: Record<'pt' | 'es', { wait: Promise<void>; release: () => void }> = {} as never;
  for (const lang of ['pt', 'es'] as const) {
    let release!: () => void;
    const wait = new Promise<void>((r) => {
      release = r;
    });
    held[lang] = { wait, release };
  }
  return held;
});
vi.mock('../data/moduleTitles.pt', async (importOriginal) => {
  await titles.pt.wait;
  return importOriginal();
});
vi.mock('../data/moduleTitles.es', async (importOriginal) => {
  await titles.es.wait;
  return importOriginal();
});
vi.mock('../hooks/usePWA.ts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../hooks/usePWA.ts')>()),
  applyUpdateOrReload: async () => {
    gate.reloads++;
  },
}));
vi.mock('../services/shareLinkBoot.ts', async (importOriginal) => {
  const real = await importOriginal<typeof import('../services/shareLinkBoot.ts')>();
  return {
    ...real,
    openLinkCode: (...[link, asTyped, moved, address]: Parameters<typeof real.openLinkCode>) =>
      real.openLinkCode(link, asTyped, moved, address, async () => {
        if (gate.wait) await gate.wait;
        if (gate.fail) throw new TypeError('Failed to fetch dynamically imported module: /assets/shareLinkOpen-x.js');
        const code = await import('../services/shareLinkOpen.ts');
        gate.arrived = true;
        return gate.reject ? { ...code, openShareLink: () => Promise.reject(new Error('inside the link code')) } : code;
      }),
  };
});

import App from '../App';
import i18n from '../i18n/index.ts';
import { useAppStore } from '../state/store';
import { useToastStore } from '../state/toastStore';
import { resetShareLinkOpen } from '../services/shareLinkOpen';
import { registerWorkInProgress } from '../services/workInProgress';
import { setCapoFret } from '../state/capo';
import { requestDemo, clearDemoRequest, getDemoRequest } from '../state/demoRequest';
import { parseChordSymbol, chordFromParsed } from '../core/utils/chordParser';
import type { Note } from '../core/types/music';

const C: Note = { natural: 'C', accidental: '' };
const G: Note = { natural: 'G', accidental: '' };
const EFLAT: Note = { natural: 'E', accidental: 'b' };
const toasts = () => useToastStore.getState().toasts.map((t) => [t.message, t.action?.label ?? null]);
const where = () => window.location.pathname + window.location.search + window.location.hash;
/** A toast's action as the learner taps it (layout/Toast.tsx: the toast closes, then the action runs). */
function tapAction() {
  const [t] = useToastStore.getState().toasts;
  act(() => {
    useToastStore.getState().removeToast(t.id);
    t.action!.onSelect();
  });
}

function hold(): () => Promise<void> {
  let release!: () => void;
  const wait = new Promise<void>((r) => {
    release = r;
  });
  gate.wait = wait;
  gate.release = release;
  return async () => {
    release();
    await wait;
  };
}

async function boot(address: string) {
  window.history.replaceState({ fm: 1, i: 4, v: 'explore', l: 0 }, '', address);
  await act(async () => {
    render(<App />);
  });
}

/** App's store watch (its listener reads LINK_SETS), while subscribed. */
const watches = new Set<() => void>();
const subscribe = useAppStore.subscribe;
vi.spyOn(useAppStore, 'subscribe').mockImplementation((listener) => {
  const off = subscribe(listener);
  if (!String(listener).includes('LINK_SETS')) return off;
  const stop = () => {
    watches.delete(stop);
    off();
  };
  watches.add(stop);
  return stop;
});

beforeEach(() => {
  useAppStore.setState({
    view: 'explore', lastView: 'explore', instrument: 'piano', selectedChord: null, chordInversion: 0,
    selectedKey: C, selectedScale: 'major', pendingLearnTarget: null, capoFret: 0, language: 'en',
  });
  useToastStore.setState({ toasts: [] });
  Object.assign(gate, { wait: null, fail: false, reject: false, reloads: 0, arrived: false, release: null });
});

afterEach(async () => {
  gate.release?.(); // a test that failed while holding the code leaves no link waiting
  clearDemoRequest();
  cleanup();
  resetShareLinkOpen();
  await i18n.changeLanguage('en');
  Reflect.deleteProperty(navigator, 'onLine');
  Reflect.deleteProperty(navigator, 'serviceWorker');
});

describe('“Try Again” reloads exactly the address the page was opened with', () => {
  const FORMS = [
    '/?key=G&scale=major',
    '/?key=F#&inst=guitar', // the link's own # made a fragment: search ?key=F, fragment #&inst=guitar
    '/?chord=F#m7',
    '/?prog=F#m7,B7',
    '/?lang=pt&key=D&scale=major',
    '/?view=drill&key=D',
    '/?utm_source=chat&key=D&chord=A',
    '/?lang=pt&view=drill&utm_source=chat&key=D#intro',
  ];
  for (const form of FORMS) {
    it(form, async () => {
      gate.fail = true;
      await boot(form);
      expect(await screen.findByText(/_VIEW/)).toBeTruthy();
      await waitFor(() => expect(useToastStore.getState().toasts.length).toBe(1));
      expect(where()).not.toBe(form); // the address bar was cleaned at boot
      const state = window.history.state;
      tapAction();
      expect(where()).toBe(form);
      expect(window.history.state, 'this entry’s state kept').toEqual(state);
      expect(gate.reloads).toBe(1);
    });
  }
});

describe('a lesson offered names its title in the learner’s language, also when the titles arrive late', () => {
  it('Portuguese: moved while the code was on its way; the offer waits for the titles', async () => {
    useAppStore.setState({ language: 'pt' });
    await i18n.changeLanguage('pt');
    const release = hold();
    await boot('/?lesson=l2u5m3');
    act(() => useAppStore.getState().setView('drill'));
    expect(await screen.findByText('DRILL_VIEW')).toBeTruthy();
    await act(release);
    await waitFor(() => expect(gate.arrived).toBe(true));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(toasts(), 'no offer before the titles: it would name the lesson in English').toEqual([]);
    await act(async () => {
      titles.pt.release();
      await titles.pt.wait;
    });
    await waitFor(() => expect(toasts()).toEqual([['Já podes abrir a ligação: a lição «Tonalidades relativas e homónimas»', 'Abrir']]));
    expect(useAppStore.getState().view).toBe('drill');
    expect(useAppStore.getState().pendingLearnTarget).toBeNull();
  });

  it('Spanish: the code has arrived, the titles have not; leaving now still draws the place at once and offers the link', async () => {
    useAppStore.setState({ language: 'es' });
    await i18n.changeLanguage('es');
    await boot('/?lesson=l2u5m3');
    await waitFor(() => expect(gate.arrived).toBe(true));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(screen.getByTestId('view-loading')).toBeTruthy(); // the code is here; waiting for the titles
    act(() => useAppStore.getState().setView('drill'));
    expect(await screen.findByText('DRILL_VIEW')).toBeTruthy();
    expect(screen.queryByTestId('view-loading')).toBeNull();
    await act(async () => {
      titles.es.release();
      await titles.es.wait;
    });
    await waitFor(() => expect(toasts()).toEqual([['Ya puedes abrir el enlace: la lección «Tonalidades relativas y homónimas»', 'Abrir']]));
    expect(useAppStore.getState().view).toBe('drill');
    expect(useAppStore.getState().pendingLearnTarget).toBeNull();
  });
});

describe('anything the learner chooses while the link waits is drawn at once and never overwritten', () => {
  const CHOICES: [string, () => void, () => void][] = [
    ['another view (a tab, Back)', () => useAppStore.getState().setView('learn'), () => expect(useAppStore.getState().view).toBe('learn')],
    ['a key (Quick Search)', () => useAppStore.getState().setKey(EFLAT), () => expect(useAppStore.getState().selectedKey).toEqual(EFLAT)],
    ['a scale (Quick Search)', () => useAppStore.getState().setScale('dorian'), () => expect(useAppStore.getState().selectedScale).toBe('dorian')],
    ['a chord (Quick Search)', () => useAppStore.getState().setSelectedChord(chordFromParsed(parseChordSymbol('Dm7')!)), () => expect(useAppStore.getState().selectedChord?.root).toEqual({ natural: 'D', accidental: '' })],
    ['the instrument (the dock’s switch)', () => useAppStore.getState().setInstrument('guitar'), () => expect(useAppStore.getState().instrument).toBe('guitar')],
    ['a lesson (Quick Search)', () => useAppStore.getState().openLearnTarget({ levelId: 'l1', unitId: 'u2', moduleId: 'l1u2m1' }), () => expect(useAppStore.getState().pendingLearnTarget?.moduleId).toBe('l1u2m1')],
    ['the capo (Settings)', () => setCapoFret(3), () => expect(useAppStore.getState().capoFret).toBe(3)],
    ['an inversion', () => useAppStore.getState().setChordInversion(1), () => expect(useAppStore.getState().chordInversion).toBe(1)],
    ['the tour (“⋯” → Show me around): its end puts back what it found', () => requestDemo('intro', 'menu'), () => expect(getDemoRequest()).toBe('intro')],
  ];
  for (const [what, choose, kept] of CHOICES) {
    it(what, async () => {
      const release = hold();
      await boot('/?key=G&scale=major&chord=C&inst=piano');
      expect(screen.getByTestId('view-loading')).toBeTruthy();
      act(choose);
      expect(await screen.findByText(/_VIEW/), 'the wait ends: what was chosen is drawn').toBeTruthy();
      expect(screen.queryByTestId('view-loading')).toBeNull();
      await act(release);
      await waitFor(() => expect(toasts()).toEqual([['Ready to open the link: G Major, the C chord, on the piano', 'Open']]));
      kept();
      expect(useAppStore.getState().selectedKey).not.toEqual(G);
    });
  }

  it('writes that are not the learner’s choice of what the link sets do not make it an offer: another tab’s save, the app’s own settings', async () => {
    const release = hold();
    await boot('/?key=G&scale=major');
    // Another tab saves a different key, view and instrument (the settings store does not follow other tabs).
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'music-theory-app',
        newValue: JSON.stringify({ state: { selectedKey: EFLAT, lastView: 'drill', instrument: 'guitar' }, version: 6 }),
      }));
    });
    // The app's own writes of things the link does not set.
    act(() => useAppStore.setState({ lastView: 'learn', themeMode: 'fermata-night', dockChosen: { ...useAppStore.getState().dockChosen, explore: true }, quickSearchOpen: true }));
    expect(screen.getByTestId('view-loading')).toBeTruthy();
    await act(release);
    await waitFor(() => expect(useAppStore.getState().selectedKey).toEqual(G));
    expect(toasts()).toEqual([]);
    expect(await screen.findByText('EXPLORE_VIEW')).toBeTruthy();
  });
});

describe('offline, “Try Again” never leaves the page for the browser’s error page', () => {
  it('no service worker in control: the page stays, the toast comes back, the link is kept; online again, Try Again opens it', async () => {
    gate.fail = true;
    await boot('/?key=F#&inst=guitar');
    await waitFor(() => expect(useToastStore.getState().toasts.length).toBe(1));
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false });
    tapAction();
    expect(gate.reloads).toBe(0);
    expect(where()).toBe('/');
    expect(toasts()).toEqual([['The link could not open.', 'Try Again']]);
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => true });
    tapAction();
    expect(where()).toBe('/?key=F#&inst=guitar');
    expect(gate.reloads).toBe(1);
  });

  it('a service worker in control serves the reload from its cache: offline, Try Again reloads', async () => {
    gate.fail = true;
    await boot('/?key=G&scale=major');
    await waitFor(() => expect(useToastStore.getState().toasts.length).toBe(1));
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false });
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { controller: {} } });
    tapAction();
    expect(where()).toBe('/?key=G&scale=major');
    expect(gate.reloads).toBe(1);
  });
});

describe('the wait always ends, and the watch on the store with it', () => {
  it('a rejection inside the link’s code ends the wait and is handled (no unhandled rejection)', async () => {
    gate.reject = true;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      await boot('/?key=G&scale=major');
      expect(await screen.findByText('EXPLORE_VIEW')).toBeTruthy();
      expect(screen.queryByTestId('view-loading')).toBeNull();
      await waitFor(() => expect(warn).toHaveBeenCalled());
    } finally {
      warn.mockRestore();
    }
  });

  const OUTCOMES: [string, string, () => (() => void) | void][] = [
    ['applied', '/?key=G&scale=major', () => {}],
    ['offered', '/?key=G&scale=major', () => {}],
    ['held (work in progress)', '/?key=G&scale=major', () => registerWorkInProgress('life-test', () => true)],
    ['failed (download)', '/?key=G&scale=major', () => {
      gate.fail = true;
    }],
    ['unreadable', '/?key=nonsense', () => {}],
    ['rejected inside', '/?key=G&scale=major', () => {
      gate.reject = true;
    }],
  ];
  for (const [outcome, address, arrange] of OUTCOMES) {
    it(`stopped once the link is ${outcome}`, async () => {
      const undo = arrange();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const release = hold();
      const before = watches.size;
      try {
        await boot(address);
        expect(watches.size, 'watching while the link waits').toBe(before + 1);
        if (outcome === 'offered') act(() => useAppStore.getState().setView('learn'));
        await act(release);
        await waitFor(() => expect(screen.queryByTestId('view-loading')).toBeNull());
        await waitFor(() => expect(watches.size).toBe(before));
      } finally {
        warn.mockRestore();
        if (undo) undo();
      }
    });
  }
});
