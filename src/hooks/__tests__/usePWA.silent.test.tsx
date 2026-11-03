/**
 * W9b — a waiting update applies itself only at a SAFE MOMENT, never while
 * work is in progress; otherwise it asks (the W9-06 prompt, usePWA.test.tsx).
 *
 *  Fresh start (services/freshStart.ts) = just launched, or back after
 *  ≥ 30 min away; untouched; within 15 s.
 *  Safe moment = a fresh start (not after "Later", unless critical), or the
 *  page hidden while a CRITICAL update waits — and no work in progress here
 *  (services/workInProgress.ts) nor in another open tab (services/otherTabs.ts).
 *
 * The PWA stub (src/test/stubs/pwa-register.ts) plays the plugin: `updateCalls`
 * records each activation of the waiting worker.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import i18n from '../../i18n';
import { FakeBroadcastChannel, resetFakeBroadcastChannels } from '../../test/fakeBroadcastChannel';

const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../../utils/pageReload', () => ({ reloadPage }));

type Stub = typeof import('../../test/stubs/pwa-register');

const NOTES = {
  en: 'Faster scales in Explore.',
  pt: 'Escalas mais rápidas no Explorar.',
  es: 'Escalas más rápidas en Explorar.',
};
function versionJson(over: Partial<{ release: number; criticalSince: number; critical: boolean }> = {}) {
  return { build: 'abc1234def56', date: '2026-11-02', release: 1, critical: false, criticalSince: 0, notes: NOTES, ...over };
}

let swContainer: EventTarget & { controller: unknown; getRegistration: () => Promise<unknown> };
let versionResponse: unknown = null;
/**
 * How many app windows the waiting worker reports (public/sw-window-count.js);
 * null = the worker never answers.
 */
let openWindows: number | null = 1;
const waitingWorker = {
  postMessage(msg: { type: string; id: string }) {
    if (msg.type !== 'FERMATA_COUNT_WINDOWS' || openWindows === null) return;
    const windows = openWindows;
    setTimeout(() => swContainer.dispatchEvent(new MessageEvent('message', { data: { type: 'FERMATA_WINDOW_COUNT', id: msg.id, windows } })), 0);
  },
};

/** Another open tab of the app, on this version: answers "busy?" over the channel. */
function otherTab(busy: boolean, tab = 'tab-2') {
  (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = FakeBroadcastChannel;
  const ch = new FakeBroadcastChannel('fermata-work-in-progress');
  ch.addEventListener('message', (e) => {
    const msg = e.data as { type: string; id: string };
    if (msg.type === 'busy?') ch.postMessage({ type: 'busy', id: msg.id, tab, busy });
  });
  return ch;
}

async function freshApp() {
  vi.resetModules();
  const stub: Stub = await import('../../test/stubs/pwa-register');
  stub.pwaRegisterStub.reset();
  const { PWAPrompts } = await import('../../components/layout/PWAPrompts');
  const pwa = await import('../usePWA');
  const wip = await import('../../services/workInProgress');
  const fresh = await import('../../services/freshStart');
  return { stub: stub.pwaRegisterStub, PWAPrompts, pwa, wip, fresh };
}

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
  document.dispatchEvent(new Event('visibilitychange'));
}

/** Let promises (and the 0 ms channel deliveries) settle. */
async function settle(ms = 0) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-02T09:00:00Z'));
  reloadPage.mockClear();
  sessionStorage.clear();
  resetFakeBroadcastChannels();
  setVisibility('visible');
  openWindows = 1;
  swContainer = Object.assign(new EventTarget(), {
    controller: {},
    getRegistration: async () => ({ waiting: waitingWorker, active: null }),
  });
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: swContainer });
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => true });
  versionResponse = null;
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (url === '/version.json' && versionResponse) return { ok: true, status: 200, json: async () => versionResponse } as Response;
    if (url === '/version.json') return { ok: false, status: 404, json: async () => ({}) } as Response;
    return { ok: true, status: 200 } as Response;
  }));
});

afterEach(async () => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = undefined;
  await i18n.changeLanguage('en');
});

describe('fresh start, nothing in progress: the waiting update applies silently', () => {
  it('cold launch: an update already waiting goes in without a prompt, and the page reloads when it takes over', async () => {
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();

    expect(stub.updateCalls).toEqual([true]); // the waiting worker was activated
    expect(screen.queryByText(/new version/i)).toBeNull(); // never asked
    expect(sessionStorage.getItem('fermata-pwa-auto-updated')).toMatch(/"reason":"fresh-start"/);
    expect(reloadPage).not.toHaveBeenCalled();
    swContainer.dispatchEvent(new Event('controllerchange'));
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('a duplicate "waiting" signal for the same update never raises the prompt behind a silent apply', async () => {
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => {
      stub.lastOptions!.onNeedRefresh!();
      stub.lastOptions!.onNeedRefresh!(); // workbox-window: "installed", then "waiting"
    });
    await settle();
    expect(stub.updateCalls).toEqual([true]);
    expect(screen.queryByText(/new version/i)).toBeNull();
  });

  it('if the new worker never takes over, it does NOT reload into the old version — it asks', async () => {
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(stub.updateCalls).toEqual([true]);
    await settle(pwa.TAKEOVER_FALLBACK_MS + 1);
    expect(reloadPage).not.toHaveBeenCalled();
    expect(screen.getByText(/new version/i)).toBeTruthy();
    expect(sessionStorage.getItem('fermata-pwa-auto-updated')).toBeNull(); // no false "Updated" notice
  });
});

describe('work in progress: NEVER silently — it asks', () => {
  it('a Drill session / Sprint under way (a registered source reports active) → the prompt, no activation', async () => {
    const { stub, PWAPrompts, wip } = await freshApp();
    wip.registerWorkInProgress('drill', () => true);
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it('a check that throws counts as busy (the safe side)', async () => {
    const { stub, PWAPrompts, wip } = await freshApp();
    wip.registerWorkInProgress('learn', () => {
      throw new Error('corrupt');
    });
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
  });

  it('another open tab with work in progress blocks it (activating reloads every tab)', async () => {
    openWindows = 2;
    otherTab(true);
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(10);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
  });

  it('every other tab answers "idle" → it applies at once (no need to wait out the 300 ms)', async () => {
    openWindows = 3;
    const tab2 = otherTab(false, 'tab-2');
    otherTab(false, 'tab-3');
    const { stub, PWAPrompts, wip } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(10);
    expect(stub.updateCalls).toEqual([true]);
    // …and this tab answers others with its own state.
    let answer: unknown = null;
    tab2.addEventListener('message', (e) => {
      if ((e.data as { type: string }).type === 'busy') answer = e.data;
    });
    wip.registerWorkInProgress('drill', () => true);
    tab2.postMessage({ type: 'busy?', id: 'q1' });
    await settle(10);
    expect(answer).toEqual({ type: 'busy', id: 'q1', tab: expect.any(String), busy: true });
  });

  it('SILENCE COUNTS AS BUSY: one other window that never answers (an older version) → the prompt', async () => {
    openWindows = 2; // the worker sees two windows…
    (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = FakeBroadcastChannel; // …but nobody answers
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
    expect(pwa.usePwaUpdateStore.getState().needRefresh).toBe(true);
  });

  it('two other windows, only one answers "idle" → the prompt', async () => {
    openWindows = 3;
    otherTab(false, 'tab-2');
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
  });

  it('the same tab answering twice still counts once', async () => {
    openWindows = 3;
    const twice = otherTab(false, 'tab-2');
    twice.addEventListener('message', (e) => {
      const msg = e.data as { type: string; id: string };
      if (msg.type === 'busy?') twice.postMessage({ type: 'busy', id: msg.id, tab: 'tab-2', busy: false });
    });
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
  });

  it('other windows but no way to ask them (no BroadcastChannel) → the prompt', async () => {
    openWindows = 2;
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
  });

  it('no worker can count the windows → never silently: the prompt', async () => {
    openWindows = null;
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(2000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
  });
});

describe('not a fresh start: it asks', () => {
  it('the learner has touched the app (any pointer / key / wheel / touch)', async () => {
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.keyDown(window, { key: 'a' });
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
  });

  it('more than 15 s after launch, even untouched', async () => {
    const { stub, PWAPrompts, fresh } = await freshApp();
    render(<PWAPrompts />);
    await settle(fresh.FRESH_START_WINDOW_MS + 1);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
  });
});

describe('back after a long absence = a fresh start again', () => {
  it('an update asked about earlier goes in when the learner comes back after ≥ 30 min', async () => {
    const { stub, PWAPrompts, fresh } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window); // in use
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(screen.getByText(/new version/i)).toBeTruthy();

    setVisibility('hidden');
    await settle(fresh.LONG_ABSENCE_MS);
    expect(stub.updateCalls).toEqual([]); // not critical: hiding is not enough
    setVisibility('visible');
    await settle();
    expect(stub.updateCalls).toEqual([true]);
  });

  it('a return that comes while the hide\'s decision is still in flight is decided too, not dropped', async () => {
    const { stub, PWAPrompts, fresh } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    // Hidden and shown again in one go: the hide's decision has not settled yet.
    setVisibility('hidden');
    vi.setSystemTime(Date.now() + fresh.LONG_ABSENCE_MS + 1000);
    setVisibility('visible');
    await settle();
    expect(stub.updateCalls).toEqual([true]);
  });

  it('a short absence (< 30 min) is not a fresh start', async () => {
    const { stub, PWAPrompts, fresh } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    setVisibility('hidden');
    await settle(fresh.LONG_ABSENCE_MS - 60_000);
    setVisibility('visible');
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
  });

  it('"Later" in this page is respected at the return (a non-critical update keeps asking)', async () => {
    const { stub, PWAPrompts, fresh } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    fireEvent.click(screen.getByRole('button', { name: 'Later' }));
    setVisibility('hidden');
    await settle(fresh.LONG_ABSENCE_MS);
    setVisibility('visible');
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
  });

  it('…but never during work in progress', async () => {
    const { stub, PWAPrompts, fresh, wip } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    wip.registerWorkInProgress('drill', () => true);
    setVisibility('hidden');
    await settle(fresh.LONG_ABSENCE_MS);
    setVisibility('visible');
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
  });
});

describe('critical updates (version.json): applied at the next safe moment even after "Later"', () => {
  async function criticalWaitingAfterLater() {
    versionResponse = versionJson({ release: 1, critical: true, criticalSince: 1 });
    const app = await freshApp();
    render(<app.PWAPrompts />);
    fireEvent.pointerDown(window); // mid-use: it asks first
    act(() => app.stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(screen.getByText(/new version/i)).toBeTruthy();
    expect(app.pwa.usePwaUpdateStore.getState().incoming).toEqual({ notes: NOTES, critical: true });
    fireEvent.click(screen.getByRole('button', { name: 'Later' }));
    await settle(1000);
    expect(app.stub.updateCalls).toEqual([]); // "Later" holds while the learner is here
    return app;
  }

  it('critical + Later → the learner switches away → it applies (with the notice marked for the next page)', async () => {
    const { stub } = await criticalWaitingAfterLater();
    setVisibility('hidden');
    await settle();
    expect(stub.updateCalls).toEqual([true]);
    expect(sessionStorage.getItem('fermata-pwa-auto-updated')).toMatch(/"reason":"critical"/);
  });

  it('critical + Later → back after a long absence → it applies', async () => {
    const { stub, fresh, wip } = await criticalWaitingAfterLater();
    wip.registerWorkInProgress('drill', () => true); // busy when it leaves…
    setVisibility('hidden');
    await settle(fresh.LONG_ABSENCE_MS);
    expect(stub.updateCalls).toEqual([]);
    wip.registerWorkInProgress('drill', () => false); // …the session is over when it returns
    setVisibility('visible');
    await settle();
    expect(stub.updateCalls).toEqual([true]);
  });

  it('critical, but a Drill session is under way: never — not even hidden', async () => {
    const { stub, wip } = await criticalWaitingAfterLater();
    wip.registerWorkInProgress('drill', () => true);
    setVisibility('hidden');
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
  });

  it('NOT critical: hiding the page applies nothing', async () => {
    versionResponse = versionJson({ release: 1 });
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    setVisibility('hidden');
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
  });

  it('a critical release SKIPPED by a later normal one still counts (criticalSince > running release)', async () => {
    versionResponse = versionJson({ release: 3, critical: false, criticalSince: 2 });
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(pwa.usePwaUpdateStore.getState().incoming?.critical).toBe(true);
    setVisibility('hidden');
    await settle();
    expect(stub.updateCalls).toEqual([true]);
  });
});

describe('What\'s new: the waiting version\'s note on the prompt, in the learner\'s language', () => {
  async function promptWithNote() {
    versionResponse = versionJson({ release: 1 });
    const app = await freshApp();
    render(<app.PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => app.stub.lastOptions!.onNeedRefresh!());
    await settle();
    return app;
  }

  it('EN', async () => {
    await promptWithNote();
    expect(screen.getByRole('alert').textContent).toContain('What’s new: Faster scales in Explore.');
  });

  it('PT', async () => {
    await promptWithNote();
    await act(async () => {
      await i18n.changeLanguage('pt');
    });
    expect(screen.getByRole('alert').textContent).toContain('Nova versão disponível');
    expect(screen.getByRole('alert').textContent).toContain('Novidades: Escalas mais rápidas no Explorar.');
  });

  it('ES', async () => {
    await promptWithNote();
    await act(async () => {
      await i18n.changeLanguage('es');
    });
    expect(screen.getByRole('alert').textContent).toContain('Nueva versión disponible');
    expect(screen.getByRole('alert').textContent).toContain('Novedades: Escalas más rápidas en Explorar.');
  });

  it('no room for it (a phone\'s instrument at Full): the prompt stays one line; the note comes back with the room', async () => {
    await promptWithNote();
    const layout = await import('../../components/layout/toastLayout');
    const tall = window.innerHeight;
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 120 }); // room = 120 - 16 px
    act(() => layout.measureToastRoom());
    expect(screen.getByRole('alert').textContent).toMatch(/new version/i);
    expect(screen.getByRole('alert').textContent).not.toMatch(/what.s new/i);
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: tall });
    act(() => layout.measureToastRoom());
    expect(screen.getByRole('alert').textContent).toContain('What’s new: Faster scales in Explore.');
  });

  it('no newer release on the server (same release as this build) → no note; offline → no note', async () => {
    versionResponse = versionJson({ release: 0 }); // tests run as release 0 (no build define)
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(screen.getByRole('alert').textContent).not.toMatch(/what.s new/i);

    versionResponse = null; // 404 / offline
    cleanup();
    const second = await freshApp();
    render(<second.PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => second.stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(screen.getByRole('alert').textContent).toMatch(/new version/i);
    expect(screen.getByRole('alert').textContent).not.toMatch(/what.s new/i);
  });
});

describe('"Updated to the latest version" — the page after an automatic update', () => {
  it('shows the notice once, with this version\'s note when it is newer, and lets it go after UPDATED_NOTICE_MS', async () => {
    vi.doMock('../../buildInfo', () => ({ BUILD_DATE: null, APP_RELEASE: { release: 2, notes: NOTES } }));
    sessionStorage.setItem('fermata-pwa-auto-updated', JSON.stringify({ fromRelease: 1, reason: 'fresh-start', at: Date.now() }));
    const { PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    const notice = screen.getByRole('alert');
    expect(notice.textContent).toContain('Updated to the latest version');
    expect(notice.textContent).toContain('What’s new: Faster scales in Explore.');
    expect(sessionStorage.getItem('fermata-pwa-auto-updated')).toBeNull(); // read once
    await settle(pwa.UPDATED_NOTICE_MS + 1);
    expect(screen.queryByText(/updated to the latest version/i)).toBeNull();
    vi.doUnmock('../../buildInfo');
  });

  it('same release (a code-only update): the notice without a note; Dismiss closes it', async () => {
    sessionStorage.setItem('fermata-pwa-auto-updated', JSON.stringify({ fromRelease: 0, reason: 'critical', at: Date.now() }));
    const { PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    expect(screen.getByRole('alert').textContent).toBe('Updated to the latest version');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('a stale marker (the announced reload never came) shows nothing', async () => {
    sessionStorage.setItem('fermata-pwa-auto-updated', JSON.stringify({ fromRelease: 0, reason: 'fresh-start', at: Date.now() - 10 * 60_000 }));
    const { PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('hourly update check (vite-plugin-pwa periodic updates, edge-case guards)', () => {
  function registration(over: Partial<{ installing: unknown }> = {}) {
    return { update: vi.fn(() => Promise.resolve()), installing: null, ...over };
  }

  it('fires every hour while the app is open: a no-store probe of the worker, then update()', async () => {
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    const reg = registration();
    act(() => stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration));
    await settle(pwa.PERIODIC_CHECK_MS - 1);
    expect(reg.update).not.toHaveBeenCalled();
    await settle(1);
    expect(reg.update).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/sw.js', expect.objectContaining({ cache: 'no-store' }));
    await settle(pwa.PERIODIC_CHECK_MS);
    expect(reg.update).toHaveBeenCalledTimes(2);
    expect(stub.updateCalls).toEqual([]); // a check never applies anything
  });

  it('not offline (no traffic at all), not while a worker installs, not when the probe fails', async () => {
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    const reg = registration();
    act(() => stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration));

    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false });
    await settle(pwa.PERIODIC_CHECK_MS);
    expect(fetch).not.toHaveBeenCalled();
    expect(reg.update).not.toHaveBeenCalled();
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => true });

    reg.installing = {};
    await settle(pwa.PERIODIC_CHECK_MS);
    expect(reg.update).not.toHaveBeenCalled();
    reg.installing = null;

    // Server down: the probe answers 503 → update() is not called.
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 503 } as Response);
    await settle(pwa.PERIODIC_CHECK_MS);
    expect(reg.update).not.toHaveBeenCalled();
    // Network error: the probe throws → swallowed, nothing called.
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await settle(pwa.PERIODIC_CHECK_MS);
    expect(reg.update).not.toHaveBeenCalled();
    // Back to normal.
    await settle(pwa.PERIODIC_CHECK_MS);
    expect(reg.update).toHaveBeenCalledTimes(1);
  });

  it('a repeated registration never stacks a second interval', async () => {
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    const reg = registration();
    act(() => {
      stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration);
      stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration);
      stub.lastOptions!.onRegisteredSW!('/sw.js', reg as unknown as ServiceWorkerRegistration);
    });
    await settle(pwa.PERIODIC_CHECK_MS);
    expect(reg.update).toHaveBeenCalledTimes(1);
  });
});

describe('old code caches', () => {
  it('the pre-W9b runtime caches of code chunks are deleted once a worker controls the page', async () => {
    const del = vi.fn(async () => true);
    vi.stubGlobal('caches', { delete: del });
    const { PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    expect(del.mock.calls.map((c) => (c as unknown[])[0]).sort()).toEqual([...pwa.LEGACY_CODE_CACHES].sort());
  });

  it('…and left alone on an uncontrolled page (first visit)', async () => {
    const del = vi.fn(async () => true);
    vi.stubGlobal('caches', { delete: del });
    swContainer.controller = null;
    const { PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    expect(del).not.toHaveBeenCalled();
  });
});

describe('Learn checks protect updates; overview and lesson reading are idle', () => {
  async function learnState() {
    const { useLearnSessionStore } = await import('../../state/learnSessionStore');
    const { useAppStore } = await import('../../state/store');
    act(() => {
      useAppStore.setState({ view: 'learn' });
      useLearnSessionStore.setState({ screen: null, check: null });
    });
    return useLearnSessionStore;
  }

  function startCheck(store: Awaited<ReturnType<typeof learnState>>) {
    act(() => store.getState().setCheck({
      moduleId: 'l1u1m1', kind: 'check', lang: 'en', fingerprints: { l1u1m1e1: 'test-identity' },
      run: { order: ['l1u1m1e1'], index: 0, scores: [], items: [], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null },
      finished: false, at: Date.now(),
    }));
  }

  it.each(['overview', 'lesson'] as const)('%s: a fresh start can apply silently', async (place) => {
    const app = await freshApp();
    const store = await learnState();
    if (place === 'lesson') act(() => store.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'c1', at: Date.now() }));
    render(<app.PWAPrompts />);
    act(() => app.stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(app.stub.updateCalls).toEqual([true]);
  });

  it('an unfinished check blocks a return after 31 min; leaving the check allows the next return', async () => {
    const { stub, fresh, PWAPrompts } = await freshApp();
    const store = await learnState();
    startCheck(store);
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    setVisibility('hidden');
    await settle(fresh.LONG_ABSENCE_MS + 60_000);
    setVisibility('visible');
    await settle(1000);
    expect(stub.updateCalls).toEqual([]);
    expect(screen.getByText(/new version/i)).toBeTruthy();
    fireEvent.pointerDown(window);
    act(() => store.getState().setCheck(null));
    setVisibility('hidden');
    await settle(fresh.LONG_ABSENCE_MS + 60_000);
    setVisibility('visible');
    await settle(1000);
    expect(stub.updateCalls).toEqual([true]);
  });

  it('another tab sees an unfinished check as busy, then lesson reading as idle', async () => {
    (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = FakeBroadcastChannel;
    const app = await freshApp();
    const store = await learnState();
    startCheck(store);
    render(<app.PWAPrompts />);
    const tab2 = new FakeBroadcastChannel('fermata-work-in-progress');
    const answers: unknown[] = [];
    tab2.addEventListener('message', (e) => answers.push(e.data));
    tab2.postMessage({ type: 'busy?', id: 'cold-launch' });
    await settle(10);
    expect(answers).toEqual([{ type: 'busy', id: 'cold-launch', tab: expect.any(String), busy: true }]);
    act(() => {
      store.getState().setCheck(null);
      store.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'c1', at: Date.now() });
    });
    tab2.postMessage({ type: 'busy?', id: 'again' });
    await settle(10);
    expect(answers[1]).toEqual({ type: 'busy', id: 'again', tab: expect.any(String), busy: false });
    tab2.close();
  });
});

describe('activity after a silent request', () => {
  it.each(['pointerdown', 'keydown', 'work'])('%s before takeover blocks both reload listeners and offers one-click Reload', async (activity) => {
    const { stub, PWAPrompts, pwa, wip } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(stub.updateCalls).toEqual([true]);
    if (activity === 'work') wip.registerWorkInProgress('learn', () => true);
    else fireEvent(window, new Event(activity));

    const pluginReload = vi.fn();
    swContainer.addEventListener('controllerchange', pluginReload);
    act(() => swContainer.dispatchEvent(new Event('controllerchange')));
    expect(reloadPage).not.toHaveBeenCalled();
    expect(pluginReload).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('Reload to finish updating');
    expect(sessionStorage.getItem('fermata-pwa-auto-updated')).toBeNull();
    await settle(pwa.TAKEOVER_FALLBACK_MS + 1);
    expect(screen.queryByText(/new version/i)).toBeNull();
    expect(screen.getByRole('alert').textContent).toContain('Reload to finish updating');
    fireEvent.click(screen.getByRole('button', { name: /^reload$/i }));
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('an explicit Reload supersedes a pending silent request, even after its timeout', async () => {
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    await settle(3000);
    act(() => pwa.usePwaUpdateStore.setState({ needRefresh: true }));
    fireEvent.pointerDown(window);
    await act(async () => pwa.applyUpdateOrReload());
    await settle(1001); // the silent request's deadline, before the explicit one's
    const pluginReload = vi.fn();
    swContainer.addEventListener('controllerchange', pluginReload);
    act(() => swContainer.dispatchEvent(new Event('controllerchange')));
    expect(reloadPage).toHaveBeenCalledTimes(1);
    expect(pluginReload).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/finish updating/i)).toBeNull();
    expect(sessionStorage.getItem('fermata-pwa-auto-updated')).toBeNull();
  });
});

describe('review W9b-g: a takeover nobody here asked for never reloads the page', () => {
  it('silent apply gives up after 4 s → the prompt; the takeover that comes later asks "Reload to finish updating" instead of reloading', async () => {
    const { stub, PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    expect(stub.updateCalls).toEqual([true]); // asked to take over…
    await settle(pwa.TAKEOVER_FALLBACK_MS + 1); // …it did not, in time
    expect(screen.getByText(/new version/i)).toBeTruthy();
    fireEvent.pointerDown(window); // the learner is busy now

    // The late takeover. A plugin-style listener registered after ours (the
    // vite-plugin-pwa one reloads on every update takeover) must not run.
    const pluginReload = vi.fn();
    swContainer.addEventListener('controllerchange', pluginReload);
    act(() => {
      swContainer.dispatchEvent(new Event('controllerchange'));
    });
    expect(pluginReload).not.toHaveBeenCalled();
    expect(reloadPage).not.toHaveBeenCalled();
    expect(screen.queryByText(/new version/i)).toBeNull();
    const finish = screen.getByRole('alert');
    expect(finish.textContent).toContain('Reload to finish updating');

    fireEvent.click(screen.getByRole('button', { name: /^reload$/i }));
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('another tab\'s Reload activated the update: this controlled page is not reloaded, it asks', async () => {
    const { PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => {
      swContainer.dispatchEvent(new Event('controllerchange'));
    });
    expect(reloadPage).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('Reload to finish updating');
  });

  it('a takeover this page asked for (the learner\'s Reload) still reloads, once', async () => {
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^reload$/i }));
    });
    expect(stub.updateCalls).toEqual([true]);
    swContainer.dispatchEvent(new Event('controllerchange'));
    expect(reloadPage).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/finish updating/i)).toBeNull();
  });

  it('the first install (an uncontrolled page) passes through untouched', async () => {
    swContainer.controller = null;
    const { PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    const later = vi.fn();
    swContainer.addEventListener('controllerchange', later);
    swContainer.dispatchEvent(new Event('controllerchange'));
    expect(later).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/finish updating/i)).toBeNull();
    // From then on the page is controlled: the next, unasked, takeover asks.
    act(() => {
      swContainer.dispatchEvent(new Event('controllerchange'));
    });
    expect(later).toHaveBeenCalledTimes(1);
    expect(reloadPage).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('Reload to finish updating');
  });
});

describe('review W9b-c / d', () => {
  it('c: one waiting version reported twice (installed + waiting) fetches /version.json once', async () => {
    versionResponse = versionJson({ release: 1 });
    const { stub, PWAPrompts } = await freshApp();
    render(<PWAPrompts />);
    fireEvent.pointerDown(window);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle(200);
    act(() => stub.lastOptions!.onNeedRefresh!());
    await settle();
    const versionFetches = vi.mocked(fetch).mock.calls.filter(([url]) => url === '/version.json');
    expect(versionFetches).toHaveLength(1);
    expect(screen.getByRole('alert').textContent).toContain('What’s new: Faster scales in Explore.');
  });

  it('d: the "Updated" notice counts its 10 s only while the page is visible', async () => {
    sessionStorage.setItem('fermata-pwa-auto-updated', JSON.stringify({ fromRelease: 0, reason: 'critical', at: Date.now() }));
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); // applied while away
    const { PWAPrompts, pwa } = await freshApp();
    render(<PWAPrompts />);
    await settle(pwa.UPDATED_NOTICE_MS * 3); // still away
    expect(screen.getByText('Updated to the latest version')).toBeTruthy();
    setVisibility('visible'); // back
    await settle(pwa.UPDATED_NOTICE_MS - 100);
    expect(screen.getByText('Updated to the latest version')).toBeTruthy();
    await settle(200);
    expect(screen.queryByText('Updated to the latest version')).toBeNull();
  });
});

it('the Updated countdown pauses and resumes across several hidden intervals', async () => {
  sessionStorage.setItem('fermata-pwa-auto-updated', JSON.stringify({ fromRelease: 0, reason: 'fresh-start', at: Date.now() }));
  const { PWAPrompts } = await freshApp();
  render(<PWAPrompts />);
  for (const visibleMs of [2000, 3000, 1000]) {
    await settle(visibleMs);
    setVisibility('hidden');
    await settle(8001);
    expect(screen.getByText('Updated to the latest version')).toBeTruthy();
    setVisibility('visible');
  }
  await settle(3999);
  expect(screen.getByText('Updated to the latest version')).toBeTruthy();
  await settle(1);
  expect(screen.queryByText('Updated to the latest version')).toBeNull();
});
