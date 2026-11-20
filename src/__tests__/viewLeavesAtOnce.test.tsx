/**
 * A view is unmounted the moment it is left (20 November 2026).
 *
 * Until then the view on its way out stayed mounted for a 150 ms exit and the
 * next view waited for it (framer-motion's AnimatePresence, mode "wait").
 * With Back pressed just as a lesson was arriving, the lesson mounted inside
 * the Learn view that was already leaving, that view's exit never ended, and
 * Explore never mounted: the tab said Explore and the screen stayed the
 * lesson (GitHub's back-button A6, twice on a first attempt; reproduced on
 * the build with the CPU slowed, with and without reduced motion).
 *
 * framer-motion is NOT mocked here, on purpose: with the exit animation back,
 * the view that was left is still in the document in the same step and these
 * tests fail.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';

vi.mock('../views/ExploreView.tsx', () => ({ ExploreView: () => <div>EXPLORE_VIEW</div> }));
vi.mock('../views/LearnView.tsx', () => ({ LearnView: () => <div>LEARN_VIEW</div> }));
vi.mock('../views/DrillView.tsx', () => ({ DrillView: () => <div>DRILL_VIEW</div> }));
vi.mock('../hooks/useTheme.ts', () => ({ useTheme: () => {} }));
vi.mock('../hooks/useLanguage.ts', () => ({ useLanguage: () => {} }));
vi.mock('../components/navigation/QuickSearch.tsx', () => ({ QuickSearch: () => null }));
vi.mock('../components/layout/PWAPrompts.tsx', () => ({ PWAPrompts: () => null }));
vi.mock('../components/layout/Toast.tsx', () => ({ ToastContainer: () => null }));
vi.mock('../components/layout/AppShell.tsx', () => ({
  AppShell: (p: { children: React.ReactNode }) => <div>{p.children}</div>,
}));

import App from '../App';
import { useAppStore } from '../state/store';

const panels = () => Array.from(document.querySelectorAll('[role="tabpanel"]'), (p) => p.id);

beforeEach(() => {
  useAppStore.setState({ view: 'explore', lastView: 'explore' });
  window.history.replaceState(null, '', '/');
});
afterEach(cleanup);

describe('a view is unmounted the moment it is left', () => {
  it('in the same step as the view changes there is one panel, the new view\'s, and nothing of the view that was left', async () => {
    render(<App />);
    expect(await screen.findByText('EXPLORE_VIEW')).toBeTruthy();
    expect(panels()).toEqual(['explore-panel']);

    act(() => useAppStore.getState().setView('learn'));
    expect(screen.queryByText('EXPLORE_VIEW'), 'Explore, just left, is gone').toBeNull();
    expect(panels()).toEqual(['learn-panel']);
    expect(await screen.findByText('LEARN_VIEW')).toBeTruthy();
  });

  it('a view left as it arrives (Back pressed at once) is gone too, and the view come back to mounts', async () => {
    render(<App />);
    expect(await screen.findByText('EXPLORE_VIEW')).toBeTruthy();
    // Into Learn and back out before anything of it has been awaited.
    act(() => useAppStore.getState().setView('learn'));
    act(() => useAppStore.getState().setView('explore'));
    expect(panels()).toEqual(['explore-panel']);
    expect(await screen.findByText('EXPLORE_VIEW')).toBeTruthy();
    expect(screen.queryByText('LEARN_VIEW')).toBeNull();
    // And once more with Learn fully arrived first, then Drill straight after.
    act(() => useAppStore.getState().setView('learn'));
    expect(await screen.findByText('LEARN_VIEW')).toBeTruthy();
    act(() => useAppStore.getState().setView('drill'));
    expect(screen.queryByText('LEARN_VIEW'), 'Learn, just left, is gone').toBeNull();
    expect(panels()).toEqual(['drill-panel']);
    expect(await screen.findByText('DRILL_VIEW')).toBeTruthy();
  });
});
