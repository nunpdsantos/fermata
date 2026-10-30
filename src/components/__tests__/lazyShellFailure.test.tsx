/**
 * Audit W9-11: Quick Search is a separate chunk now. If its download fails
 * (offline before it was cached), opening search must not crash the app —
 * search just closes and everything else keeps working.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { useAppStore } from '../../state/store';

vi.mock('../navigation/QuickSearch.tsx', () => {
  throw new TypeError('Failed to fetch dynamically imported module: /assets/QuickSearch-x.js');
});

import { QuickSearchHost } from '../navigation/QuickSearchHost';

afterEach(cleanup);

describe('Quick Search download fails (W9-11)', () => {
  it('search closes; the rest of the app stays up', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <div>
        <p>APP STILL HERE</p>
        <QuickSearchHost />
      </div>,
    );
    act(() => useAppStore.getState().setQuickSearchOpen(true));
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(screen.getByText('APP STILL HERE')).toBeTruthy();
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
  });
});
