/**
 * Settings is a lazy chunk: after a failed download the toast says "try
 * again", so the NEXT open must really download again and open Settings, and
 * a failure must say so once per open (final review of wave 2: after one
 * failure Settings never opened again until a reload, silently).
 *
 * The failure is controlled through the mocked module's export: reading it
 * throws while `ctl.fail` is set, which rejects the chunk's promise exactly as
 * a failed download does (vitest caches a module that throws while loading,
 * so the module itself must load).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useToastStore } from '../../../state/toastStore';
import i18n from '../../../i18n';

const ctl = vi.hoisted(() => ({ fail: true }));
vi.mock('../SettingsSheet.tsx', async () => {
  const React = await import('react');
  const FakeSettings = ({ open }: { open: boolean }) =>
    open ? React.createElement('div', { role: 'dialog', 'aria-label': 'Settings' }, 'settings') : null;
  return {
    get SettingsSheet() {
      if (ctl.fail) throw new Error('Failed to fetch dynamically imported module');
      return FakeSettings;
    },
  };
});

import { TopBar } from '../TopBar';

const ERROR = 'Settings did not load. Check the connection and try again.';
const errors = () => useToastStore.getState().toasts.filter((t) => t.message === ERROR).length;
const flush = () => act(() => new Promise((r) => setTimeout(r, 0)));

async function openSettings() {
  fireEvent.click(screen.getByRole('button', { name: 'More' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
  await flush();
  await flush();
}

beforeEach(() => {
  ctl.fail = true;
  useAppStore.setState({ view: 'explore', language: 'en' });
  useToastStore.setState({ toasts: [] });
});
afterEach(async () => {
  cleanup();
  await act(() => i18n.changeLanguage('en'));
});

describe('Settings after a failed download', () => {
  it('a language change after a failed open says nothing more (the failure is said once)', async () => {
    render(<TopBar />);
    await openSettings();
    await waitFor(() => expect(errors()).toBe(1));
    await act(() => i18n.changeLanguage('pt'));
    await flush();
    await act(() => i18n.changeLanguage('en'));
    await flush();
    expect(useToastStore.getState().toasts.filter((t) => t.type === 'error')).toHaveLength(1);
  });

  it('each failed open says so once; the next open downloads again and opens Settings', async () => {
    render(<TopBar />);
    await openSettings();
    await waitFor(() => expect(errors()).toBe(1));
    await flush();
    expect(errors()).toBe(1);
    expect(screen.queryByRole('dialog', { name: 'Settings' })).toBeNull();

    // Still offline: the second open fails again, and says so again.
    await openSettings();
    await waitFor(() => expect(errors()).toBe(2));
    await flush();
    expect(errors()).toBe(2);
    expect(screen.queryByRole('dialog', { name: 'Settings' })).toBeNull();

    // Back online: the next open opens it.
    ctl.fail = false;
    await openSettings();
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeTruthy();
    expect(errors()).toBe(2);
  });

});
