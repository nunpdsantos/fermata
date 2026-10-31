/**
 * Audit W9-06 + D-21 ("ask first"): an app update must never reload the page
 * by itself — the "new version — reload" toast asks, and only the learner's
 * tap activates the waiting service worker. The app also re-checks for an
 * update when it returns to the foreground.
 *
 * The PWA stub (src/test/stubs/pwa-register.ts, aliased to
 * virtual:pwa-register) plays the plugin's part.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import viteConfigSource from '../../../vite.config.ts?raw';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';

const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../../utils/pageReload', () => ({ reloadPage }));

type Stub = typeof import('../../test/stubs/pwa-register');

async function freshApp() {
  // usePWA registers once per page (module state) — fresh modules per test.
  vi.resetModules();
  const stub: Stub = await import('../../test/stubs/pwa-register');
  stub.pwaRegisterStub.reset();
  const { PWAPrompts } = await import('../../components/layout/PWAPrompts');
  const pwa = await import('../usePWA');
  return { stub: stub.pwaRegisterStub, PWAPrompts, pwa };
}

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
  document.dispatchEvent(new Event('visibilitychange'));
}

beforeEach(() => {
  reloadPage.mockClear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('app update flow (W9-06)', () => {
  it('builds in prompt mode (the plugin never reloads on its own)', () => {
    const config = viteConfigSource;
    expect(config).toMatch(/registerType:\s*'prompt'/);
    expect(config).not.toMatch(/registerType:\s*'autoUpdate'/);
  });

  it('shows the "new version" toast when an update is waiting — and does not reload', async () => {
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    expect(stub.registerCalls).toBe(1);
    expect(screen.queryByText(/new version/i)).toBeNull();

    act(() => stub.lastOptions!.onNeedRefresh!());

    expect(screen.getByText(/new version/i)).toBeTruthy();
    expect(stub.updateCalls).toEqual([]);
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it('tapping Reload activates the waiting worker (not a plain reload of the old version)', async () => {
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reload/i }));
    });

    expect(stub.updateCalls).toEqual([true]);
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it('unmounting never applies an update behind the learner\'s back', async () => {
    const { stub, PWAPrompts } = await freshApp();
    const { unmount } = render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    unmount();
    expect(stub.updateCalls).toEqual([]);
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it('checks for an update when the app returns to the foreground (throttled, online only)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-30T12:00:00Z'));
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    const update = vi.fn(() => Promise.resolve());
    act(() => stub.lastOptions!.onRegisteredSW!('/sw.js', { update } as unknown as ServiceWorkerRegistration));

    setVisibility('hidden');
    expect(update).not.toHaveBeenCalled();

    setVisibility('visible');
    expect(update).toHaveBeenCalledTimes(1);

    setVisibility('hidden');
    setVisibility('visible'); // within a minute: throttled
    expect(update).toHaveBeenCalledTimes(1);

    vi.setSystemTime(Date.now() + pwa.FOREGROUND_CHECK_MIN_GAP_MS + 1);
    setVisibility('visible');
    expect(update).toHaveBeenCalledTimes(2);

    // No update traffic while offline.
    Object.defineProperty(window.navigator, 'onLine', { configurable: true, get: () => false });
    vi.setSystemTime(Date.now() + pwa.FOREGROUND_CHECK_MIN_GAP_MS + 1);
    setVisibility('visible');
    expect(update).toHaveBeenCalledTimes(2);
    Object.defineProperty(window.navigator, 'onLine', { configurable: true, get: () => true });

    // A found update never reloads — it only raises the toast.
    expect(reloadPage).not.toHaveBeenCalled();
    expect(stub.updateCalls).toEqual([]);
  });

  it('applyUpdateOrReload: with no update waiting it is a plain reload', async () => {
    const { pwa, PWAPrompts, stub } = await freshApp();
    render(<PWAPrompts />);
    await pwa.applyUpdateOrReload();
    expect(reloadPage).toHaveBeenCalledTimes(1);
    expect(stub.updateCalls).toEqual([]);
  });
});

describe('toasts that do not linger (W11-A review round 4)', () => {
  it('"ready to work offline" dismisses itself after OFFLINE_READY_MS', async () => {
    vi.useFakeTimers();
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onOfflineReady!());
    expect(screen.getByText(/offline/i)).toBeTruthy();
    act(() => vi.advanceTimersByTime(pwa.OFFLINE_READY_MS - 100));
    expect(screen.getByText(/offline/i)).toBeTruthy();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText(/offline/i)).toBeNull();
    expect(pwa.usePwaUpdateStore.getState().offlineReady).toBe(false);
  });

  it('"Later" puts the update off: the toast goes, the "⋯" menu keeps it until the reload', async () => {
    const { stub, PWAPrompts } = await freshApp();
    const { TopBar } = await import('../../components/layout/TopBar');
    render(<><TopBar /><PWAPrompts /></>);
    // No update yet: no menu item.
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.queryByRole('menuitem', { name: /update ready/i })).toBeNull();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

    act(() => stub.lastOptions!.onNeedRefresh!());
    fireEvent.click(screen.getByRole('button', { name: 'Later' }));
    expect(screen.queryByText(/new version/i)).toBeNull();
    expect(stub.updateCalls).toEqual([]);
    expect(reloadPage).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    await act(async () => {
      fireEvent.click(screen.getByRole('menuitem', { name: /update ready/i }));
    });
    expect(stub.updateCalls).toEqual([true]); // the same one-tap update as the toast's Reload
  });

  it('a newer waiting version asks again after "Later"', async () => {
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    fireEvent.click(screen.getByRole('button', { name: 'Later' }));
    expect(screen.queryByText(/new version/i)).toBeNull();
    act(() => stub.lastOptions!.onNeedRefresh!());
    expect(screen.getByText(/new version/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /reload/i })).toBeTruthy();
  });
});
