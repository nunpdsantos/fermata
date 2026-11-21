/**
 * While a shared link's own code is on its way (App.tsx, services/shareLinkBoot.ts):
 * the work area shows a view's loading sign and no view mounts (no old key,
 * no view writing its state or history) until the link applies; going to
 * another view meanwhile ends the wait, that view draws and the link is
 * offered, never applied over it; a code that cannot be fetched leaves the
 * app on its view as usual, with one toast. The real openLinkCode runs; only
 * its loader is held back or made to fail.
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

const gate = vi.hoisted(() => ({ wait: null as Promise<void> | null, fail: false }));
vi.mock('../services/shareLinkBoot.ts', async (importOriginal) => {
  const real = await importOriginal<typeof import('../services/shareLinkBoot.ts')>();
  return {
    ...real,
    openLinkCode: (...[link, asTyped, offer, address]: Parameters<typeof real.openLinkCode>) =>
      real.openLinkCode(link, asTyped, offer, address, async () => {
        if (gate.wait) await gate.wait;
        if (gate.fail) throw new TypeError('Failed to fetch dynamically imported module: /assets/shareLinkOpen-x.js');
        return import('../services/shareLinkOpen.ts');
      }),
  };
});

import App from '../App';
import type { Note } from '../core/types/music';
import { useAppStore } from '../state/store';
import { useToastStore } from '../state/toastStore';
import { resetShareLinkOpen } from '../services/shareLinkOpen';

const C: Note = { natural: 'C', accidental: '' };
const G: Note = { natural: 'G', accidental: '' };
const panels = () => Array.from(document.querySelectorAll('[role="tabpanel"]'), (p) => p.id);
const views = () => document.body.textContent?.match(/[A-Z]+_VIEW/g) ?? [];

function hold(): () => Promise<void> {
  let release!: () => void;
  const wait = new Promise<void>((r) => {
    release = r;
  });
  gate.wait = wait;
  return async () => {
    release();
    await wait;
  };
}

async function boot(search: string) {
  window.history.replaceState(null, '', `/${search}`);
  await act(async () => {
    render(<App />);
  });
}

beforeEach(() => {
  useAppStore.setState({
    view: 'explore', lastView: 'explore', instrument: 'piano', selectedChord: null,
    selectedKey: C, selectedScale: 'major', pendingLearnTarget: null,
  });
  useToastStore.setState({ toasts: [] });
  gate.wait = null;
  gate.fail = false;
});

afterEach(() => {
  cleanup();
  resetShareLinkOpen();
});

describe('App — a shared link whose own code is on its way', () => {
  it('the work area shows the loading sign and no view (the boot view, Learn, never mounts); then the link’s view', async () => {
    useAppStore.setState({ lastView: 'learn' });
    const release = hold();
    await boot('?key=G&scale=major');
    expect(panels()).toEqual(['learn-panel']);
    expect(screen.getByTestId('view-loading')).toBeTruthy();
    expect(views()).toEqual([]);
    expect(useAppStore.getState().selectedKey).toEqual(C);
    expect(window.location.search).toBe('');

    await act(release);
    expect(await screen.findByText('EXPLORE_VIEW')).toBeTruthy();
    expect(views()).toEqual(['EXPLORE_VIEW']);
    expect(panels()).toEqual(['explore-panel']);
    expect(screen.queryByTestId('view-loading')).toBeNull();
    expect(useAppStore.getState().selectedKey).toEqual(G);
  });

  it('going to another view meanwhile ends the wait: that view draws, and the link is offered with “Open”, never applied over it', async () => {
    const release = hold();
    await boot('?key=G&scale=major');
    expect(screen.getByTestId('view-loading')).toBeTruthy();

    act(() => useAppStore.getState().setView('learn'));
    expect(await screen.findByText('LEARN_VIEW')).toBeTruthy();
    expect(screen.queryByTestId('view-loading')).toBeNull();

    await act(release);
    await waitFor(() => expect(useToastStore.getState().toasts.map((t) => [t.message, t.action?.label])).toEqual([['Ready to open the link: G Major', 'Open']]));
    expect(useAppStore.getState().view).toBe('learn');
    expect(useAppStore.getState().selectedKey).toEqual(C);
    expect(views()).toEqual(['LEARN_VIEW']);

    act(() => useToastStore.getState().toasts[0].action!.onSelect());
    expect(useAppStore.getState().view).toBe('explore');
    expect(useAppStore.getState().selectedKey).toEqual(G);
    expect(await screen.findByText('EXPLORE_VIEW')).toBeTruthy();
  });

  it('a code that cannot be fetched: the app opens its view as usual (never left on the loading sign), one toast says so', async () => {
    gate.fail = true;
    await boot('?key=G&scale=major');
    expect(await screen.findByText('EXPLORE_VIEW')).toBeTruthy();
    expect(screen.queryByTestId('view-loading')).toBeNull();
    expect(useAppStore.getState().selectedKey).toEqual(C);
    expect(useToastStore.getState().toasts.map((t) => [t.type, t.message, t.action?.label])).toEqual([['error', 'The link could not open.', 'Try Again']]);
    expect(window.location.search).toBe('');
  });
});
