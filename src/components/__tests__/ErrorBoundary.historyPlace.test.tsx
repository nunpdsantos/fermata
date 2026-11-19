/**
 * Second audit round, review A7: Back and Forward keep this tab's place in
 * its history entry, across a reload. The error screen's two resets reload to
 * get away from a screen that crashed, so they forget that place first: the
 * app comes back where a fresh start puts it.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../utils/pageReload', () => ({ reloadPage: vi.fn() }));
import { reloadPage } from '../../utils/pageReload';
import { ErrorBoundary } from '../ErrorBoundary';

function Bomb(): never {
  throw new Error('boom');
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  window.history.replaceState({ fm: 1, i: 2, v: 'learn', s: 'level/l1', l: 0 }, '');
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.mocked(reloadPage).mockClear();
  window.history.replaceState(null, '');
});

describe('the error screen\'s resets forget the place', () => {
  it('"Reset view settings": the entry is emptied before the reload', () => {
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: 'Reset view settings (keeps your progress)' }));
    expect(reloadPage).toHaveBeenCalledTimes(1);
    expect(window.history.state).toBeNull();
  });

  it('"Reset app data": the same, and this tab\'s record of its entries goes too', async () => {
    sessionStorage.setItem('fermatina-history-v1', '[[2,"learn","level/l1"]]');
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: 'Reset app data — clears saved progress' }));
    await vi.waitFor(() => expect(reloadPage).toHaveBeenCalledTimes(1));
    expect(window.history.state).toBeNull();
    expect(sessionStorage.getItem('fermatina-history-v1')).toBeNull();
  });

  it('"Reload" alone keeps it (a reload lands where the learner was)', () => {
    sessionStorage.setItem('fermatina-history-v1', '[[2,"learn","level/l1"]]');
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: /^Reload/ }));
    expect(reloadPage).toHaveBeenCalledTimes(1);
    expect(window.history.state).toEqual({ fm: 1, i: 2, v: 'learn', s: 'level/l1', l: 0 });
    expect(sessionStorage.getItem('fermatina-history-v1')).toBe('[[2,"learn","level/l1"]]');
    sessionStorage.clear();
  });
});
