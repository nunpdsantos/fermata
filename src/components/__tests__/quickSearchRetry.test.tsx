/**
 * Review item 4 (W9): after a failed Quick Search download, opening search
 * again must try the download again — no page reload needed. React caches a
 * rejected lazy() forever, so the host builds a fresh one after a failure.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import { useAppStore } from '../../state/store';
import { QuickSearchHost } from '../navigation/QuickSearchHost';

function SearchUI() {
  const open = useAppStore((s) => s.quickSearchOpen);
  return open ? <div role="dialog">SEARCH UI</div> : null;
}

const settle = () => act(async () => { await new Promise((r) => setTimeout(r, 20)); });

beforeEach(() => {
  useAppStore.setState({ quickSearchOpen: false });
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Quick Search retries a failed download on the next open (review item 4)', () => {
  it('fails once (search closes, app stays) → next open downloads again and shows search', async () => {
    let calls = 0;
    const load = vi.fn(() => {
      calls++;
      return calls === 1
        ? Promise.reject(new TypeError('Failed to fetch dynamically imported module'))
        : Promise.resolve({ default: SearchUI });
    });
    render(<QuickSearchHost load={load} />);

    act(() => useAppStore.getState().setQuickSearchOpen(true));
    await settle();
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
    expect(screen.queryByRole('dialog')).toBeNull();

    // The shortcut works again (the host owns it while search is not loaded).
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    await settle();
    expect(load).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('keeps retrying while offline without ever crashing, then recovers', async () => {
    let online = false;
    const load = vi.fn(() => (online
      ? Promise.resolve({ default: SearchUI })
      : Promise.reject(new TypeError('Failed to fetch dynamically imported module'))));
    render(<QuickSearchHost load={load} />);
    for (let i = 0; i < 3; i++) {
      act(() => useAppStore.getState().setQuickSearchOpen(true));
      await settle();
      expect(useAppStore.getState().quickSearchOpen).toBe(false);
    }
    online = true;
    act(() => useAppStore.getState().setQuickSearchOpen(true));
    await settle();
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(load).toHaveBeenCalledTimes(4);
  });
});

describe('the search shortcut ignores letter case (review: uppercase "K")', () => {
  it.each([
    ['Ctrl+Shift+K', { key: 'K', ctrlKey: true, shiftKey: true }],
    ['Cmd+K with Caps Lock', { key: 'K', metaKey: true }],
    ['Ctrl+K', { key: 'k', ctrlKey: true }],
  ])('%s opens search', async (_label, init) => {
    const load = vi.fn(() => Promise.resolve({ default: SearchUI }));
    render(<QuickSearchHost load={load} />);
    fireEvent.keyDown(window, init);
    expect(useAppStore.getState().quickSearchOpen).toBe(true);
    await settle();
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('a plain "K" without Ctrl/Cmd does nothing', () => {
    render(<QuickSearchHost load={() => Promise.resolve({ default: SearchUI })} />);
    fireEvent.keyDown(window, { key: 'K', shiftKey: true });
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
  });
});
