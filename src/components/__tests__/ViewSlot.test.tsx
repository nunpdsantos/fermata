/**
 * Audit W9-03 (F-07): a view whose code-split chunk failed to download must
 * be recoverable from its "Try again" button. React caches a rejected lazy()
 * import for good, so re-rendering the same lazy component re-throws the old
 * error; the slot has to build a fresh lazy() — or, when a download failed
 * while the device is online (typically a new deploy: old file names 404),
 * reload so the browser fetches the current files.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';

const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../../utils/pageReload', () => ({ reloadPage }));

import { ViewSlot, type ViewLoader } from '../ViewSlot';

const CHUNK_ERROR = () => new TypeError('Failed to fetch dynamically imported module: https://x/assets/LearnView-abc123.js');

function flaky(firstError: () => Error): { loader: ViewLoader; calls: () => number } {
  let calls = 0;
  return {
    loader: () => {
      calls++;
      return calls === 1
        ? Promise.reject(firstError())
        : Promise.resolve({ default: () => <p>VIEW OK</p> });
    },
    calls: () => calls,
  };
}

async function settle() {
  await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
}

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { configurable: true, get: () => value });
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  reloadPage.mockClear();
  setOnline(true);
});

describe('ViewSlot — retry after a failed view download (W9-03)', () => {
  it('offline: "Try again" downloads the view again and shows it once that succeeds', async () => {
    setOnline(false);
    const { loader, calls } = flaky(CHUNK_ERROR);
    render(<ViewSlot viewKey="learn" loaders={{ learn: loader }} />);
    await settle();
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    await settle();

    expect(calls()).toBe(2);
    expect(screen.getByText('VIEW OK')).toBeTruthy();
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it('a non-download error (render crash) also re-imports instead of re-throwing the cached failure', async () => {
    const { loader, calls } = flaky(() => new Error('boom'));
    render(<ViewSlot viewKey="explore" loaders={{ explore: loader }} />);
    await settle();
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    await settle();
    expect(calls()).toBe(2);
    expect(screen.getByText('VIEW OK')).toBeTruthy();
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it('online + failed download: "Try again" reloads the page to fetch the current files', async () => {
    setOnline(true);
    const { loader } = flaky(CHUNK_ERROR);
    render(<ViewSlot viewKey="learn" loaders={{ learn: loader }} />);
    await settle();
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('only the failed view is rebuilt; the slot never reloads on its own', async () => {
    setOnline(true);
    const explore = vi.fn<ViewLoader>(() => Promise.resolve({ default: () => <p>EXPLORE</p> }));
    const learn = flaky(CHUNK_ERROR);
    const loaders = { explore, learn: learn.loader };
    // App remounts the slot on every view switch (keyed wrapper) — mirror that.
    const { rerender } = render(<ViewSlot key="explore" viewKey="explore" loaders={loaders} />);
    await settle();
    expect(screen.getByText('EXPLORE')).toBeTruthy();

    rerender(<ViewSlot key="learn" viewKey="learn" loaders={loaders} />);
    await settle();
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
    expect(reloadPage).not.toHaveBeenCalled(); // no automatic reload — the learner decides

    rerender(<ViewSlot key="explore" viewKey="explore" loaders={loaders} />);
    expect(screen.getByText('EXPLORE')).toBeTruthy(); // no spinner: the loaded view is reused
    expect(explore).toHaveBeenCalledTimes(1);
  });
});
