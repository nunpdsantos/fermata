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

let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null = null;
let started = false;

/**
 * Register the service worker once per page. Also re-checks for a new version
 * whenever the app returns to the foreground — an installed app left open for
 * days otherwise only looked for updates on a cold launch.
 */
export function startPwaRegistration(): void {
  if (started) return;
  started = true;

  let registration: ServiceWorkerRegistration | undefined;
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
 * Activate a waiting update (the plugin reloads when the new worker takes
 * control), or — with none waiting — do a plain reload.
 */
export async function applyUpdateOrReload(): Promise<void> {
  if (usePwaUpdateStore.getState().needRefresh && updateServiceWorker) {
    await updateServiceWorker(true);
    return;
  }
  reloadPage();
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
