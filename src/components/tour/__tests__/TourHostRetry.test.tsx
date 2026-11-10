/**
 * Final review (2026-11-10): React keeps a rejected lazy() for good, so a
 * tour chunk that failed once (offline) would fail on every later tap in
 * that page. The host builds a fresh lazy() after a failure: the next
 * request really downloads again, and plays once the chunk arrives. The
 * failure is also noted for the start screen (it has no toast region).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';

const chunk = vi.hoisted(() => ({ loads: 0 }));
vi.mock('../TourPlayer.tsx', () => {
  chunk.loads += 1;
  if (chunk.loads === 1) throw new Error('Failed to fetch dynamically imported module');
  return { default: () => <div data-testid="tour-player-stub">PLAYER</div> };
});

import i18n from 'i18next';
import { TourHost } from '../TourHost';
import { clearDemoRequest, getDemoRequest, requestDemo, useDemoFailed } from '../../../state/demoRequest';
import { useToastStore } from '../../../state/toastStore';

function Failed() {
  return <span data-testid="failed">{String(useDemoFailed())}</span>;
}

afterEach(() => {
  act(() => clearDemoRequest());
  cleanup();
});

describe('the tour host after a failed download', () => {
  it('notes the failure, then tries the download again on the next request (and plays)', async () => {
    await act(async () => { await i18n.changeLanguage('en'); });
    useToastStore.setState({ toasts: [] });
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(<><TourHost /><Failed /></>);
      act(() => requestDemo('intro'));
      await waitFor(() => expect(getDemoRequest()).toBeNull());
      expect(screen.getByTestId('failed').textContent).toBe('true');
      expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(['The tour could not open.']);

      act(() => requestDemo('intro'));
      expect(screen.getByTestId('failed').textContent).toBe('false');
      expect(await screen.findByTestId('tour-player-stub')).toBeDefined();
      expect(getDemoRequest()).toBe('intro');
      expect(chunk.loads).toBe(2);
    } finally {
      quiet.mockRestore();
    }
  });
});
