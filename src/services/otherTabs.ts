/**
 * Work in progress in the app's OTHER open tabs (W9b).
 *
 * Activating a waiting service worker reloads every open tab of the app
 * (vite-plugin-pwa reloads each tab it controls when the new worker takes
 * over). So before an update applies itself silently, this tab
 *  1. asks a service worker how many app windows are open
 *     (`clients.matchAll({ type: 'window', includeUncontrolled: true })`,
 *     public/sw-window-count.js — the waiting worker first, then the active
 *     one), and
 *  2. asks the others over a BroadcastChannel whether any of them holds work
 *     in progress (hasWorkInProgress() there).
 * Only when EVERY other window answers "idle" within OTHER_TABS_REPLY_MS does
 * the update go in. Silence counts as busy: a tab still on a version older
 * than W9b cannot answer, nor can a frozen one — the learner is asked
 * instead. If no worker can count the windows, nothing is applied silently.
 */
import { hasWorkInProgress } from './workInProgress';

const CHANNEL_NAME = 'fermata-work-in-progress';
export const OTHER_TABS_REPLY_MS = 300;
export const WINDOW_COUNT_TIMEOUT_MS = 500;

/** This tab, for "idle" answers to be counted once each. */
const TAB_ID = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

type Message = { type: 'busy?'; id: string } | { type: 'busy'; id: string; tab: string; busy: boolean };

let channel: BroadcastChannel | null = null;

/** Answer other tabs' "busy?" (once per page; no-op without BroadcastChannel). */
export function listenForBusyQuestions(): void {
  if (channel || typeof BroadcastChannel === 'undefined') return;
  const ch = new BroadcastChannel(CHANNEL_NAME);
  // Node's BroadcastChannel (tests) would otherwise keep the process alive.
  (ch as unknown as { unref?: () => void }).unref?.();
  ch.addEventListener('message', (event: MessageEvent<Message>) => {
    const msg = event.data;
    if (msg?.type === 'busy?' && typeof msg.id === 'string') {
      ch.postMessage({ type: 'busy', id: msg.id, tab: TAB_ID, busy: hasWorkInProgress() } satisfies Message);
    }
  });
  channel = ch;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function askWorkerForWindows(container: ServiceWorkerContainer, worker: ServiceWorker): Promise<number | null> {
  const id = newId();
  return new Promise((resolve) => {
    const finish = (windows: number | null) => {
      clearTimeout(timer);
      container.removeEventListener('message', onMessage);
      resolve(windows);
    };
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: unknown; id?: unknown; windows?: unknown } | null;
      if (data?.type !== 'FERMATA_WINDOW_COUNT' || data.id !== id) return;
      finish(typeof data.windows === 'number' && Number.isInteger(data.windows) && data.windows >= 1 ? data.windows : null);
    };
    const timer = setTimeout(() => finish(null), WINDOW_COUNT_TIMEOUT_MS);
    container.addEventListener('message', onMessage);
    try {
      worker.postMessage({ type: 'FERMATA_COUNT_WINDOWS', id });
    } catch {
      finish(null);
    }
  });
}

/**
 * How many app windows are open, this one included, as a service worker of
 * `registration` counts them (the waiting worker first — it is the newest
 * code — then the active one). null when none answers in time.
 */
export async function countAppWindows(registration: ServiceWorkerRegistration | undefined): Promise<number | null> {
  const container = typeof navigator !== 'undefined' ? navigator.serviceWorker : undefined;
  if (!registration || !container) return null;
  for (const worker of [registration.waiting, registration.active]) {
    if (!worker) continue;
    const windows = await askWorkerForWindows(container, worker);
    if (windows !== null) return windows;
  }
  return null;
}

/**
 * Must a silent update wait for another tab? `windows` is the number of app
 * windows open (this one included; null = unknown). True when a tab reports
 * work in progress, when fewer tabs answer "idle" than there are other
 * windows (silence counts as busy), or when the windows cannot be counted or
 * asked. A tab on its own answers at once.
 */
export function otherTabsBusy(windows: number | null): Promise<boolean> {
  if (windows === null) return Promise.resolve(true);
  const others = windows - 1;
  if (others <= 0) return Promise.resolve(false);
  listenForBusyQuestions();
  const ch = channel;
  if (!ch) return Promise.resolve(true); // other windows, and no way to ask them
  const id = newId();
  return new Promise((resolve) => {
    const idle = new Set<string>();
    const finish = (busy: boolean) => {
      clearTimeout(timer);
      ch.removeEventListener('message', onMessage);
      resolve(busy);
    };
    const onMessage = (event: MessageEvent<Message>) => {
      const msg = event.data;
      if (msg?.type !== 'busy' || msg.id !== id) return;
      if (msg.busy) return finish(true);
      if (typeof msg.tab === 'string') idle.add(msg.tab);
      if (idle.size >= others) finish(false);
    };
    // Whoever has not answered by now is counted as busy.
    const timer = setTimeout(() => finish(idle.size < others), OTHER_TABS_REPLY_MS);
    ch.addEventListener('message', onMessage);
    ch.postMessage({ type: 'busy?', id } satisfies Message);
  });
}
