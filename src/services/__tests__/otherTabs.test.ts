/**
 * Other open tabs before a silent update (W9b, services/otherTabs.ts):
 * count the app's windows through a service worker, then require an "idle"
 * answer from every other one — silence counts as busy. Plus the worker side
 * (public/sw-window-count.js), run against a fake worker global.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import swWindowCountSource from '../../../public/sw-window-count.js?raw';
import { FakeBroadcastChannel, resetFakeBroadcastChannels } from '../../test/fakeBroadcastChannel';

type OtherTabs = typeof import('../otherTabs');
let tabs: OtherTabs;
let container: EventTarget;

/** A worker that answers the window count with `windows` (null = never answers). */
function worker(windows: number | null | 'garbage') {
  return {
    postMessage: vi.fn((msg: { type: string; id: string }) => {
      if (windows === null) return;
      const data = windows === 'garbage'
        ? { type: 'FERMATA_WINDOW_COUNT', id: msg.id, windows: 'many' }
        : { type: 'FERMATA_WINDOW_COUNT', id: msg.id, windows };
      setTimeout(() => container.dispatchEvent(new MessageEvent('message', { data })), 0);
    }),
  };
}
const reg = (waiting: unknown, active: unknown = null) => ({ waiting, active }) as unknown as ServiceWorkerRegistration;

function tab(busy: boolean | null, id: string) {
  const ch = new FakeBroadcastChannel('fermata-work-in-progress');
  ch.addEventListener('message', (e) => {
    const msg = e.data as { type: string; id: string };
    if (msg.type === 'busy?' && busy !== null) ch.postMessage({ type: 'busy', id: msg.id, tab: id, busy });
  });
  return ch;
}

beforeEach(async () => {
  vi.useFakeTimers();
  resetFakeBroadcastChannels();
  container = new EventTarget();
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: container });
  (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = FakeBroadcastChannel;
  vi.resetModules();
  tabs = await import('../otherTabs');
});
afterEach(() => {
  vi.useRealTimers();
  (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = undefined;
});

async function settled<T>(promise: Promise<T>, ms = 0): Promise<T> {
  await vi.advanceTimersByTimeAsync(ms);
  return promise;
}

describe('countAppWindows: asks the waiting worker, then the active one', () => {
  it('the waiting worker answers', async () => {
    const waiting = worker(3);
    expect(await settled(tabs.countAppWindows(reg(waiting)))).toBe(3);
    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'FERMATA_COUNT_WINDOWS', id: expect.any(String) });
  });

  it('a waiting worker that never answers → the active one is asked', async () => {
    const active = worker(2);
    const pending = tabs.countAppWindows(reg(worker(null), active));
    expect(await settled(pending, tabs.WINDOW_COUNT_TIMEOUT_MS + 1)).toBe(2);
  });

  it('null when no worker answers, the answer is not a count, or there is no registration', async () => {
    const none = tabs.countAppWindows(reg(worker(null), worker(null)));
    expect(await settled(none, 2 * tabs.WINDOW_COUNT_TIMEOUT_MS + 2)).toBeNull();
    const garbage = tabs.countAppWindows(reg(worker('garbage')));
    expect(await settled(garbage, tabs.WINDOW_COUNT_TIMEOUT_MS + 1)).toBeNull();
    expect(await tabs.countAppWindows(undefined)).toBeNull();
  });
});

describe('otherTabsBusy(windows): every other window must answer "idle"', () => {
  it('this tab alone: not busy, at once', async () => {
    expect(await tabs.otherTabsBusy(1)).toBe(false);
  });

  it('windows unknown: busy (never silent)', async () => {
    expect(await tabs.otherTabsBusy(null)).toBe(true);
  });

  it('all others idle: not busy, as soon as the last one answers', async () => {
    tab(false, 'a');
    tab(false, 'b');
    expect(await settled(tabs.otherTabsBusy(3), 5)).toBe(false);
  });

  it('ONE SILENT TAB (an older version that cannot answer): busy', async () => {
    tab(false, 'a');
    tab(null, 'old'); // listening, never answering
    expect(await settled(tabs.otherTabsBusy(3), tabs.OTHER_TABS_REPLY_MS + 1)).toBe(true);
  });

  it('a busy answer: busy', async () => {
    tab(true, 'a');
    expect(await settled(tabs.otherTabsBusy(2), 5)).toBe(true);
  });

  it('other windows but no BroadcastChannel to ask them: busy', async () => {
    (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = undefined;
    vi.resetModules();
    const fresh = await import('../otherTabs');
    expect(await fresh.otherTabsBusy(2)).toBe(true);
  });
});

describe('the worker side (public/sw-window-count.js)', () => {
  function loadWorkerScript(windowCount: number) {
    const listeners: Array<(event: unknown) => void> = [];
    const matchAll = vi.fn(async () => Array.from({ length: windowCount }, () => ({})));
    const fakeSelf = { addEventListener: (_type: string, l: (event: unknown) => void) => listeners.push(l), clients: { matchAll } };
    new Function('self', swWindowCountSource)(fakeSelf);
    return { listeners, matchAll };
  }

  it('answers FERMATA_COUNT_WINDOWS with every window client, uncontrolled ones included', async () => {
    const { listeners, matchAll } = loadWorkerScript(3);
    expect(listeners).toHaveLength(1);
    const posted: unknown[] = [];
    const waits: Promise<unknown>[] = [];
    listeners[0]({ data: { type: 'FERMATA_COUNT_WINDOWS', id: 'q1' }, source: { postMessage: (m: unknown) => posted.push(m) }, waitUntil: (p: Promise<unknown>) => waits.push(p) });
    await Promise.all(waits);
    expect(matchAll).toHaveBeenCalledWith({ type: 'window', includeUncontrolled: true });
    expect(posted).toEqual([{ type: 'FERMATA_WINDOW_COUNT', id: 'q1', windows: 3 }]);
  });

  it('ignores every other message (SKIP_WAITING is the plugin\'s)', () => {
    const { listeners, matchAll } = loadWorkerScript(1);
    const waitUntil = vi.fn();
    listeners[0]({ data: { type: 'SKIP_WAITING' }, source: { postMessage: vi.fn() }, waitUntil });
    listeners[0]({ data: null, source: null, waitUntil });
    expect(matchAll).not.toHaveBeenCalled();
    expect(waitUntil).not.toHaveBeenCalled();
  });
});
