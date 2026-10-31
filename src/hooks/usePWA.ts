import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { registerSW } from 'virtual:pwa-register';
import { reloadPage } from '../utils/pageReload';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * App-update model (audit W9-06 / D-21: "ask first").
 *
 * vite.config.ts uses `registerType: 'prompt'`: a new service worker installs
 * in the background and WAITS. Nothing reloads by itself — not mid-exercise,
 * not ever. `needRefresh` raises the "new version — reload" toast; only the
 * learner's tap (or a "Try again" on a view whose files are gone, see
 * ViewSlot) activates the waiting worker, and the plugin reloads once it
 * takes control. Before this, `autoUpdate` reloaded a few seconds after launch
 * without asking and the toast could never appear.
 *
 * Shared state lives in a tiny store so the view error screen can apply a
 * waiting update too: with an update waiting, a plain reload would be served
 * the OLD precached index.html (and its old file names) again.
 */
interface PwaUpdateState {
  needRefresh: boolean;
  offlineReady: boolean;
}

export const usePwaUpdateStore = create<PwaUpdateState>(() => ({
  needRefresh: false,
  offlineReady: false,
}));

/** Foreground update checks are throttled to one per minute. */
export const FOREGROUND_CHECK_MIN_GAP_MS = 60_000;

/** Bounds for the "Try again" / Reload path (review items 1 and 5). */
export const UPDATE_CHECK_TIMEOUT_MS = 5_000;
export const INSTALL_WAIT_MS = 8_000;
export const TAKEOVER_FALLBACK_MS = 4_000;

let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null = null;
let registration: ServiceWorkerRegistration | undefined;
let started = false;
let reloading = false;

function reloadOnce(): void {
  if (reloading) return;
  reloading = true;
  reloadPage();
}

/**
 * Reload as soon as a new worker takes control of this page. The plugin only
 * listens for that in a tab that itself saw the update waiting, so on a
 * first-install / uncontrolled page Reload did nothing (review item 1).
 */
function reloadWhenControllerChanges(): void {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;
  navigator.serviceWorker.addEventListener('controllerchange', reloadOnce, { once: true });
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([promise, new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), ms))]);
}

/** Wait (bounded) until a worker that is still installing has finished. */
function settleInstalling(reg: ServiceWorkerRegistration, ms: number): Promise<void> {
  const worker = reg.installing;
  if (!worker) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      worker.removeEventListener('statechange', onChange);
      resolve();
    };
    const onChange = () => {
      if (worker.state !== 'installing') done();
    };
    const timer = setTimeout(done, ms);
    worker.addEventListener('statechange', onChange);
  });
}

/**
 * Files this page fetched BEFORE a service worker controlled it (the first
 * visit: the worker installs after the page loaded) never went through the
 * worker's runtime caching — VexFlow, a lesson level opened early, samples —
 * so offline they were missing even after an online visit (review item 6).
 * Once the worker takes control, fetch them again through it; precached ones
 * are answered from the precache, the rest land in their runtime caches.
 * Same-origin /assets/ and /samples/ only; each URL once.
 */
export function warmRuntimeCaches(): void {
  if (typeof performance === 'undefined' || typeof fetch === 'undefined') return;
  const urls = new Set<string>();
  for (const entry of performance.getEntriesByType('resource')) {
    let url: URL;
    try {
      url = new URL(entry.name, location.href);
    } catch {
      continue;
    }
    if (url.origin !== location.origin) continue;
    if (!/^\/(assets|samples)\//.test(url.pathname)) continue;
    urls.add(url.href);
  }
  for (const href of urls) fetch(href).catch(() => {});
}

/**
 * Register the service worker once per page. Also re-checks for a new version
 * whenever the app returns to the foreground — an installed app left open for
 * days otherwise only looked for updates on a cold launch.
 */
export function startPwaRegistration(): void {
  if (started) return;
  started = true;

  // First visit: the page loads before any worker controls it. When the
  // newly installed worker takes control, push what was already loaded
  // through it so it is cached for offline use (review item 6).
  if (typeof navigator !== 'undefined' && navigator.serviceWorker && !navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('controllerchange', warmRuntimeCaches, { once: true });
  }

  let lastCheck = 0;

  updateServiceWorker = registerSW({
    onNeedRefresh() {
      usePwaUpdateStore.setState({ needRefresh: true });
    },
    onOfflineReady() {
      usePwaUpdateStore.setState({ offlineReady: true });
    },
    onRegisteredSW(_swUrl, r) {
      registration = r;
    },
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !registration) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    const now = Date.now();
    if (now - lastCheck < FOREGROUND_CHECK_MIN_GAP_MS) return;
    lastCheck = now;
    // Only downloads/installs; a found update surfaces as needRefresh.
    registration.update().catch(() => {});
  });
}

/**
 * The toast's Reload, and "Try again" on a view whose files are gone.
 *  1. Reload once a new worker takes control of THIS page (works on a
 *     first-install / uncontrolled page too).
 *  2. With no update known yet but online, ask the server first
 *     (registration.update(), bounded) — after a deploy the missing file means
 *     a new version exists, and finding it now makes ONE tap enough (review
 *     item 5); wait for it to finish installing.
 *  3. If a new worker is waiting, activate it (the reload follows from 1);
 *     otherwise — or if it never takes over — a plain reload.
 * Note: activating the waiting worker also reloads the app's OTHER open tabs
 * (the plugin reloads every tab it controls when the worker changes).
 */
export async function applyUpdateOrReload(): Promise<void> {
  reloadWhenControllerChanges();

  if (!usePwaUpdateStore.getState().needRefresh && registration && navigator.onLine !== false) {
    try {
      await withTimeout(registration.update(), UPDATE_CHECK_TIMEOUT_MS);
    } catch {
      // Offline / server down — fall through to a plain reload.
    }
    await settleInstalling(registration, INSTALL_WAIT_MS);
  }

  const waiting = usePwaUpdateStore.getState().needRefresh || !!registration?.waiting;
  if (waiting && updateServiceWorker) {
    await updateServiceWorker(true);
    setTimeout(reloadOnce, TAKEOVER_FALLBACK_MS); // never stuck if the takeover is lost
    return;
  }
  reloadOnce();
}

export function usePWA() {
  const needRefresh = usePwaUpdateStore((s) => s.needRefresh);
  const offlineReady = usePwaUpdateStore((s) => s.offlineReady);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    startPwaRegistration();

    // Capture install prompt
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const install = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  }, [installPrompt]);

  const dismissInstall = useCallback(() => setInstallPrompt(null), []);
  const reload = useCallback(() => {
    void applyUpdateOrReload();
  }, []);
  const dismissOffline = useCallback(() => usePwaUpdateStore.setState({ offlineReady: false }), []);

  return {
    needRefresh,
    offlineReady,
    canInstall: installPrompt !== null,
    install,
    dismissInstall,
    reload,
    dismissOffline,
  };
}
