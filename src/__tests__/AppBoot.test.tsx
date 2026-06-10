import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';

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
import { pickBootView } from '../state/bootView';
import { useAppStore } from '../state/store';

/** Point jsdom at a URL with the given query string. */
function setUrl(search: string) {
  window.history.replaceState(null, '', `/${search}`);
}

beforeEach(() => {
  useAppStore.setState({ view: 'explore', lastView: 'explore' });
  setUrl('');
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('pickBootView (pure)', () => {
  it('returns a valid ?view= param', () => {
    expect(pickBootView('?view=drill', 'explore')).toBe('drill');
    expect(pickBootView('?view=learn', 'explore')).toBe('learn');
  });

  it('falls back to lastView for a missing or invalid param', () => {
    expect(pickBootView('', 'learn')).toBe('learn');
    expect(pickBootView('?view=bogus', 'drill')).toBe('drill');
    expect(pickBootView('?foo=bar', 'explore')).toBe('explore');
  });
});

describe('App — boot view resolution', () => {
  it('?view=drill mounts the drill view and strips the param from the URL', async () => {
    setUrl('?view=drill');
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('DRILL_VIEW')).toBeDefined();
    expect(useAppStore.getState().view).toBe('drill');
    // Param stripped — a refresh won't re-force it.
    expect(window.location.search).toBe('');
  });

  it('restores the persisted lastView when there is no ?view= param', async () => {
    useAppStore.setState({ view: 'explore', lastView: 'learn' });
    setUrl('');
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('LEARN_VIEW')).toBeDefined();
    expect(useAppStore.getState().view).toBe('learn');
  });

  it('falls back to lastView for an invalid ?view= param (and still strips it)', async () => {
    useAppStore.setState({ view: 'explore', lastView: 'drill' });
    setUrl('?view=bogus');
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('DRILL_VIEW')).toBeDefined();
    expect(useAppStore.getState().view).toBe('drill');
    expect(window.location.search).toBe('');
  });

  it('preserves other query params while stripping only view', async () => {
    setUrl('?view=drill&debug=1');
    await act(async () => {
      render(<App />);
    });
    expect(useAppStore.getState().view).toBe('drill');
    expect(window.location.search).toBe('?debug=1');
  });
});
