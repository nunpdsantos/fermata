/**
 * Review items 1 and 5 (W9 update flow).
 *  1. Reload (toast) activates the waiting worker; the page must reload when
 *     that worker takes control — also on a first-install / uncontrolled page,
 *     where the plugin itself never listens for it (Reload was dead there).
 *  5. "Try again" on a view whose file 404s after a deploy: with no update
 *     known yet, ask the server first (registration.update()), so ONE tap
 *     activates the new version instead of reloading into the old one.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';

const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../../utils/pageReload', () => ({ reloadPage }));

type Stub = typeof import('../../test/stubs/pwa-register');

class FakeWorker extends EventTarget {
  state: ServiceWorkerState = 'installing';
  to(state: ServiceWorkerState) {
    this.state = state;
    this.dispatchEvent(new Event('statechange'));
  }
}

function fakeRegistration() {
  const reg = {
    installing: null as FakeWorker | null,
    waiting: null as FakeWorker | null,
    update: vi.fn(async () => reg),
  };
  return reg;
}

let container: EventTarget;
async function freshApp() {
  vi.resetModules();
  const stub: Stub = await import('../../test/stubs/pwa-register');
  stub.pwaRegisterStub.reset();
  const { PWAPrompts } = await import('../../components/layout/PWAPrompts');
  const pwa = await import('../usePWA');
  render(<PWAPrompts />);
  return { stub: stub.pwaRegisterStub, pwa };
}

beforeEach(() => {
  reloadPage.mockClear();
  container = new EventTarget();
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: container });
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => true });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Reload reloads once the new worker takes control (review item 1)', () => {
  it('waiting update → activate it → reload on controllerchange, exactly once', async () => {
    const { stub, pwa } = await freshApp();
    act(() => stub.lastOptions!.onNeedRefresh!());
    await pwa.applyUpdateOrReload();
    expect(stub.updateCalls).toEqual([true]);
    expect(reloadPage).not.toHaveBeenCalled(); // not before the takeover

    container.dispatchEvent(new Event('controllerchange'));
    container.dispatchEvent(new Event('controllerchange'));
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('if the takeover never arrives, it still reloads after a bounded wait', async () => {
    vi.useFakeTimers();
    const { stub, pwa } = await freshApp();
    act(() => stub.lastOptions!.onNeedRefresh!());
    await pwa.applyUpdateOrReload();
    expect(reloadPage).not.toHaveBeenCalled();
    vi.advanceTimersByTime(pwa.TAKEOVER_FALLBACK_MS + 1);
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });
});

describe('"Try again" after a deploy finds the new version first (review item 5)', () => {
  it('online, nothing waiting: update() finds a worker → it installs → activated, no plain reload', async () => {
    const { stub, pwa } = await freshApp();
    const reg = fakeRegistration();
    const incoming = new FakeWorker();
    reg.update.mockImplementation(async () => {
      reg.installing = incoming;
      setTimeout(() => {
        reg.installing = null;
        reg.waiting = incoming;
        incoming.to('installed');
      }, 10);
      return reg;
    });
    act(() => stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration));

    await pwa.applyUpdateOrReload();
    expect(reg.update).toHaveBeenCalledTimes(1);
    expect(stub.updateCalls).toEqual([true]); // activated the new version
    expect(reloadPage).not.toHaveBeenCalled();
    container.dispatchEvent(new Event('controllerchange'));
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('online, no new version on the server: one plain reload', async () => {
    const { stub, pwa } = await freshApp();
    const reg = fakeRegistration();
    act(() => stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration));
    await pwa.applyUpdateOrReload();
    expect(reg.update).toHaveBeenCalledTimes(1);
    expect(stub.updateCalls).toEqual([]);
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('a hanging update check is bounded', async () => {
    vi.useFakeTimers();
    const { stub, pwa } = await freshApp();
    const reg = fakeRegistration();
    reg.update.mockImplementation(() => new Promise(() => {}));
    act(() => stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration));
    const done = pwa.applyUpdateOrReload();
    await vi.advanceTimersByTimeAsync(pwa.UPDATE_CHECK_TIMEOUT_MS + 1);
    await done;
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('offline: no update traffic, plain reload', async () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false });
    const { stub, pwa } = await freshApp();
    const reg = fakeRegistration();
    act(() => stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration));
    await pwa.applyUpdateOrReload();
    expect(reg.update).not.toHaveBeenCalled();
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });
});
