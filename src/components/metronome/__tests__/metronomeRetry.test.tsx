/**
 * The metronome is a lazy chunk (brief M): a failed download says so once and
 * puts the bar away; a language change afterwards says nothing more (wave 3
 * final review: the failure's effect ran again with each new `t`); the next
 * choice of "Metronome" tries again and, still failing, says so once more.
 * The download fails because the mocked module throws while it loads (vitest
 * then keeps that failure, so every attempt here fails: the successful retry
 * after a failure is the Settings pattern, proved in settingsRetry.test.tsx).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useToastStore } from '../../../state/toastStore';
import i18n from '../../../i18n';

vi.mock('../MetronomeHost.tsx', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

import { TopBar } from '../../layout/TopBar';

const ERROR = 'The metronome did not load. Check the connection and try again.';
const errors = () => useToastStore.getState().toasts.filter((t) => t.type === 'error').length;
const flush = () => act(() => new Promise((r) => setTimeout(r, 0)));

async function choose() {
  fireEvent.click(screen.getByRole('button', { name: 'More' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Metronome' }));
  await flush();
  await flush();
}

beforeEach(() => {
  useAppStore.setState({ view: 'explore', language: 'en' });
  useToastStore.setState({ toasts: [] });
});
afterEach(async () => {
  cleanup();
  await act(() => i18n.changeLanguage('en'));
});

describe('the metronome after a failed download', () => {
  it('says so once, also through a language change; the next choice tries again and says so once more', async () => {
    render(<TopBar />);
    await choose();
    await waitFor(() => expect(errors()).toBe(1));
    expect(useToastStore.getState().toasts[0].message).toBe(ERROR);
    expect(screen.queryByRole('region', { name: 'Metronome' })).toBeNull();
    await act(() => i18n.changeLanguage('pt'));
    await flush();
    await act(() => i18n.changeLanguage('en'));
    await flush();
    expect(errors()).toBe(1);

    await choose();
    await waitFor(() => expect(errors()).toBe(2));
    await flush();
    expect(errors()).toBe(2);
    expect(screen.queryByRole('region', { name: 'Metronome' })).toBeNull();
  });
});
