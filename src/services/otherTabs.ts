/**
 * Work in progress in the app's OTHER open tabs (W9b).
 *
 * Activating a waiting service worker reloads every open tab of the app
 * (vite-plugin-pwa reloads each tab it controls when the new worker takes
 * over). So before an update applies itself silently, this tab asks the
 * others over a BroadcastChannel whether any of them holds work in progress
 * (hasWorkInProgress() there). A tab that says "busy" blocks the silent
 * update; silence for OTHER_TABS_REPLY_MS means nobody is busy. A tab still
 * on a version older than W9b cannot answer — that is its limit.
 */
import { hasWorkInProgress } from './workInProgress';

const CHANNEL_NAME = 'fermata-work-in-progress';
export const OTHER_TABS_REPLY_MS = 300;

type Message = { type: 'busy?'; id: string } | { type: 'busy'; id: string; busy: boolean };

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
      ch.postMessage({ type: 'busy', id: msg.id, busy: hasWorkInProgress() } satisfies Message);
    }
  });
  channel = ch;
}

/** Does any other open tab of the app hold work in progress? */
export function otherTabsBusy(): Promise<boolean> {
  listenForBusyQuestions();
  const ch = channel;
  if (!ch) return Promise.resolve(false);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return new Promise((resolve) => {
    const finish = (busy: boolean) => {
      clearTimeout(timer);
      ch.removeEventListener('message', onMessage);
      resolve(busy);
    };
    const onMessage = (event: MessageEvent<Message>) => {
      const msg = event.data;
      if (msg?.type === 'busy' && msg.id === id && msg.busy) finish(true);
    };
    const timer = setTimeout(() => finish(false), OTHER_TABS_REPLY_MS);
    ch.addEventListener('message', onMessage);
    ch.postMessage({ type: 'busy?', id } satisfies Message);
  });
}
