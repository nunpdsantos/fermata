import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, waitFor } from '@testing-library/react';

// The tour's chunk cannot be fetched (offline before the service worker cached it).
vi.mock('../TourPlayer.tsx', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

import i18n from 'i18next';
import { TourHost } from '../TourHost';
import { clearDemoRequest, getDemoRequest, requestDemo } from '../../../state/demoRequest';
import { useToastStore } from '../../../state/toastStore';

afterEach(() => {
  act(() => clearDemoRequest());
  cleanup();
});

describe('the tour host, when the tour cannot load', () => {
  it('says so and clears the request (the app carries on)', async () => {
    await act(async () => { await i18n.changeLanguage('en'); });
    useToastStore.setState({ toasts: [] });
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(<TourHost />);
      act(() => requestDemo('intro', 'menu'));
      await waitFor(() => expect(getDemoRequest()).toBeNull());
      expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(['The tour could not open.']);
    } finally {
      quiet.mockRestore();
    }
  });
});
