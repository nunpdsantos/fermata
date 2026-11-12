/**
 * The tuner is a lazy chunk (brief T): a failed download says so once and
 * closes; the next open downloads again and opens the tuner (the Settings
 * pattern, settingsRetry.test.tsx: the mocked module's export throws while
 * `ctl.fail` is set, as a failed download rejects).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { useToastStore } from '../../../state/toastStore';
import i18n from '../../../i18n';
import { useAppStore } from '../../../state/store';
import { openTuner, closeTuner, useTunerRequest } from '../tunerRequest';

const ctl = vi.hoisted(() => ({ fail: true }));
vi.mock('../TunerSheet.tsx', async () => {
  const React = await import('react');
  const Fake = ({ open }: { open: boolean }) => (open ? React.createElement('div', { role: 'dialog', 'aria-label': 'Tuner' }, 'tuner') : null);
  return {
    get TunerSheet() {
      if (ctl.fail) throw new Error('Failed to fetch dynamically imported module');
      return Fake;
    },
  };
});

import { TunerHost } from '../TunerHost';

const ERROR = 'The tuner did not load. Try again.';
const errors = () => useToastStore.getState().toasts.filter((t) => t.message === ERROR).length;
const flush = () => act(() => new Promise((r) => setTimeout(r, 0)));

beforeEach(() => {
  useTunerRequest.setState({ open: false, attempt: -1, failed: false });
  useAppStore.setState({ language: 'en' });
  useToastStore.setState({ toasts: [] });
});
afterEach(async () => {
  cleanup();
  act(() => closeTuner());
  await act(() => i18n.changeLanguage('en'));
});

describe('the tuner after a failed download', () => {
  it('a language change after a failed open says nothing more (the failure is said once)', async () => {
    ctl.fail = true;
    render(<TunerHost />);
    act(() => openTuner());
    await flush();
    await waitFor(() => expect(errors()).toBe(1));
    await act(() => i18n.changeLanguage('pt'));
    await flush();
    await act(() => i18n.changeLanguage('en'));
    await flush();
    expect(useToastStore.getState().toasts.filter((t) => t.type === 'error')).toHaveLength(1);
  });

  it('nothing is fetched before it is asked for; a failure says so once and closes; the next open opens it', async () => {
    render(<TunerHost />);
    expect(useTunerRequest.getState().attempt).toBe(-1);
    act(() => openTuner());
    await flush();
    await waitFor(() => expect(errors()).toBe(1));
    expect(useTunerRequest.getState().open).toBe(false);
    expect(screen.queryByRole('dialog', { name: 'Tuner' })).toBeNull();

    ctl.fail = false;
    act(() => openTuner());
    expect(await screen.findByRole('dialog', { name: 'Tuner' })).toBeTruthy();
    expect(errors()).toBe(1);
    act(() => closeTuner());
    expect(screen.queryByRole('dialog', { name: 'Tuner' })).toBeNull();
    // Opened again: the same download, kept (no new attempt).
    const attempt = useTunerRequest.getState().attempt;
    act(() => openTuner());
    expect(useTunerRequest.getState().attempt).toBe(attempt);
    expect(await screen.findByRole('dialog', { name: 'Tuner' })).toBeTruthy();
  });

});
