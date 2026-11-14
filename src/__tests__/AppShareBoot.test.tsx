import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';

// ── Mocks: keep the heavy App subtree out of the boot test. ───────────────────
// The three views become trivial markers so we can assert which one mounts.
vi.mock('../views/ExploreView.tsx', () => ({ ExploreView: () => <div>EXPLORE_VIEW</div> }));
vi.mock('../views/LearnView.tsx', () => ({ LearnView: () => <div>LEARN_VIEW</div> }));
vi.mock('../views/DrillView.tsx', () => ({ DrillView: () => <div>DRILL_VIEW</div> }));

// Theme/language side-effect hooks are irrelevant here.
vi.mock('../hooks/useTheme.ts', () => ({ useTheme: () => {} }));
vi.mock('../hooks/useLanguage.ts', () => ({ useLanguage: () => {} }));

// Chrome that isn't under test.
vi.mock('../components/navigation/QuickSearch.tsx', () => ({ QuickSearch: () => null }));
vi.mock('../components/layout/PWAPrompts.tsx', () => ({ PWAPrompts: () => null }));
vi.mock('../components/layout/Toast.tsx', () => ({ ToastContainer: () => null }));
vi.mock('../components/share/ShareLinkHost.tsx', () => ({ ShareLinkHost: () => null }));
vi.mock('../components/layout/AppShell.tsx', () => ({
  AppShell: (p: { children: React.ReactNode }) => <div>{p.children}</div>,
}));

// framer-motion → plain passthrough elements.
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const proxy = new Proxy(
    {},
    {
      get:
        (_t: unknown, tag: string) =>
        (props: Record<string, unknown>) => {
          const clean: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(props)) {
            if (k === 'children' || !/^(while|initial|animate|exit|transition|layout|variants|drag)/.test(k)) {
              clean[k] = v;
            }
          }
          return React.createElement(tag === 'div' ? 'div' : tag, clean);
        },
    },
  );
  return {
    motion: proxy,
    m: proxy,
    useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    MotionConfig: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

import App from '../App';
import { useAppStore } from '../state/store';
import { openedFromShareLink } from '../state/shareParams';
import { useToastStore } from '../state/toastStore';
import { registerWorkInProgress } from '../services/workInProgress';
import { resetShareLinkOpen } from '../services/shareLinkOpen';

/**
 * Opening a shared link at boot (wave 1, stream E): the link's chunk loads,
 * applies what is valid, and the address bar is cleaned like ?view=. The
 * installed app's "Start Drill" shortcut (?view=drill) is not a link and
 * behaves exactly as before (AppBoot.test.tsx).
 */
function setUrl(search: string) {
  window.history.replaceState(null, '', `/${search}`);
}

beforeEach(() => {
  useAppStore.setState({
    view: 'explore', lastView: 'explore', instrument: 'piano', selectedChord: null,
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', pendingLearnTarget: null,
  });
  useToastStore.setState({ toasts: [] });
  setUrl('');
});

afterEach(() => {
  cleanup();
  resetShareLinkOpen();
});

async function boot(search: string) {
  setUrl(search);
  await act(async () => {
    render(<App />);
  });
  // The link's own chunk (dynamic import) resolves after the first render.
  await waitFor(() => expect(document.body.textContent).toMatch(/_VIEW/));
}

describe('App — opening a shared link', () => {
  it('a key + chord + guitar link opens Explore on exactly that, and the address bar is clean', async () => {
    useAppStore.setState({ lastView: 'drill' });
    await boot('?key=D&scale=major&chord=A&inst=guitar');
    expect(screen.getByText('EXPLORE_VIEW')).toBeDefined();
    const s = useAppStore.getState();
    expect(s.view).toBe('explore');
    expect(s.selectedKey).toEqual({ natural: 'D', accidental: '' });
    expect(s.selectedChord?.root).toEqual({ natural: 'A', accidental: '' });
    expect(s.instrument).toBe('guitar');
    expect(window.location.search).toBe('');
    expect(openedFromShareLink()).toBe(true);
  });

  it('a lesson link opens that lesson', async () => {
    await boot('?lesson=l2u5m3');
    expect(screen.getByText('LEARN_VIEW')).toBeDefined();
    expect(useAppStore.getState().pendingLearnTarget).toEqual({ levelId: 'l2', unitId: 'u5', moduleId: 'l2u5m3' });
    expect(window.location.search).toBe('');
  });

  it('keeps other parameters, drops a fragment that held part of the link', async () => {
    await boot('?debug=1&key=F#&inst=guitar');
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'F', accidental: '#' });
    expect(useAppStore.getState().instrument).toBe('guitar');
    expect(window.location.search).toBe('?debug=1');
    expect(window.location.hash).toBe('');
  });

  it('a broken or hostile link opens the app as usual, with one line saying so', async () => {
    useAppStore.setState({ lastView: 'learn' });
    await boot(`?key=%3Cscript%3E&chord=${'x'.repeat(500)}&lesson=nope&view=learn`);
    expect(screen.getByText('LEARN_VIEW')).toBeDefined();
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'C', accidental: '' });
    expect(window.location.search).toBe('');
    expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(['This link could not be read, so Fermatina opened as usual.']);
  });

  it('content wins over view: ?view=drill&key=D opens Explore on D', async () => {
    await boot('?view=drill&key=D');
    expect(screen.getByText('EXPLORE_VIEW')).toBeDefined();
    expect(useAppStore.getState().selectedKey.natural).toBe('D');
  });

  // After review (2026-11-10).
  it('a real fragment after a valid chord does not wipe the chord out', async () => {
    await boot('?key=D&chord=A#intro');
    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual({ natural: 'D', accidental: '' });
    expect(s.selectedChord?.root).toEqual({ natural: 'A', accidental: '' });
    expect(window.location.search).toBe('');
  });

  it('a link opened while work is in progress at boot is held: nothing applied, the address clean, then offered', async () => {
    let busy = true;
    const unregister = registerWorkInProgress('boot-test-check', () => busy);
    try {
      await boot('?key=D&chord=A&inst=guitar');
      await waitFor(() => expect(useToastStore.getState().toasts.length).toBe(1));
      const s = useAppStore.getState();
      expect(s.selectedKey).toEqual({ natural: 'C', accidental: '' });
      expect(s.selectedChord).toBeNull();
      expect(s.instrument).toBe('piano');
      expect(window.location.search).toBe('');
      expect(useToastStore.getState().toasts[0].message).toMatch(/^This link opens D Major, the A chord, on the guitar\./);
      busy = false;
      await waitFor(() => expect(useToastStore.getState().toasts.some((t) => t.action?.label === 'Open')).toBe(true), { timeout: 4000 });
      expect(useAppStore.getState().selectedKey).toEqual({ natural: 'C', accidental: '' });
    } finally {
      unregister();
    }
  });
});
