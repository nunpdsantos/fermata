/**
 * Settings is a lazy chunk (wave 2 integration, the entry file's budget).
 * A download that fails says so in a toast and leaves no half-open dialog,
 * and the app (the top bar and its menu) stays usable. (The retry on the
 * next open builds a fresh lazy(); vitest caches a failed module, so that
 * part is read in TopBar.tsx, not tested here.)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useToastStore } from '../../../state/toastStore';

vi.mock('../SettingsSheet.tsx', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

import { TopBar } from '../TopBar';

beforeEach(() => {
  useAppStore.setState({ view: 'explore', language: 'en' });
  useToastStore.setState({ toasts: [] });
});
afterEach(() => cleanup());

describe('Settings, a lazy chunk', () => {
  it('a failed download: a toast says so, no dialog, the menu still works', async () => {
    render(<TopBar />);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
    await waitFor(() => expect(useToastStore.getState().toasts.map((t) => t.message)).toContain('Settings did not load. Check the connection and try again.'));
    expect(screen.queryByRole('dialog', { name: 'Settings' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toBeTruthy();
  });
});
