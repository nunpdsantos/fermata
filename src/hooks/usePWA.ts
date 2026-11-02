import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { registerSW } from 'virtual:pwa-register';
import { reloadPage } from '../utils/pageReload';
import { APP_RELEASE } from '../buildInfo';
import type { ReleaseNoteText } from '../release/releaseNotes';
import { hasWorkInProgress } from '../services/workInProgress';
import { isFreshStart, startFreshStartTracking } from '../services/freshStart';
import { listenForBusyQuestions, otherTabsBusy } from '../services/otherTabs';
import {
  clearAutoUpdateMark,
  fetchIncomingVersion,
  markAutoUpdate,
  takeAutoUpdateMark,
  type IncomingVersion,
} from '../services/appVersion';

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
 *
 * W9b adds, around that prompt:
 *  - Regular checks: hourly while the app is open, plus on returning to the
 *    foreground — each guarded by a `no-store` probe of the worker script
 *    (vite-plugin-pwa "Periodic Service Worker Updates", edge cases), never
 *    offline, one interval per page.
 *  - A safe moment: a waiting update applies WITHOUT asking only when
 *      (a) it is a fresh start (services/freshStart.ts: just launched, or back
 *          after ≥ 30 min away; untouched; within 15 s) — unless the learner
 *          put it off with "Later" in this page, or
 *      (b) the waiting version is CRITICAL (version.json) and the page is
 *          hidden (the learner has switched away) or at a fresh start — even
 *          after "Later";
 *    and only when no work is in progress — here (services/workInProgress.ts:
 *    a Drill session or Sprint under way, a Learn check…) nor in another open
 *    tab (services/otherTabs.ts). Otherwise it asks, as before. After such an
 *    update the next page says "Updated to the latest version" (+ what's new).
 *  - What's new: the prompt shows the waiting version's one-line note.
 */
interface PwaUpdateState {
  needRefresh: boolean;
  offlineReady: boolean;
  /** The learner chose "Later" on the update toast: it hides, and the update
   *  stays one tap away in the "⋯" menu until the page reloads. */
  updateDeferred: boolean;
  /** What the waiting version says about itself (/version.json); null until known. */
  incoming: IncomingVersion | null;
  /** The first page after an automatic update: the "Updated" notice and this version's note (if newer). */
  updated: { notes: ReleaseNoteText | null } | null;
}

export const usePwaUpdateStore = create<PwaUpdateState>(() => ({
  needRefresh: false,
  offlineReady: false,
  updateDeferred: false,
  incoming: null,
  updated: null,
}));

/** "Ready to work offline" is news, not a task: it leaves by itself. */
export const OFFLINE_READY_MS = 6_000;
let offlineReadyTimer: ReturnType<typeof setTimeout> | undefined;

/** Show the offline-ready toast; it dismisses itself after OFFLINE_READY_MS. */
export function showOfflineReady(): void {
  usePwaUpdateStore.setState({ offlineReady: true });
  clearTimeout(offlineReadyTimer);
  offlineReadyTimer = setTimeout(() => usePwaUpdateStore.setState({ offlineReady: false }), OFFLINE_READY_MS);
}

/** Foreground update checks are throttled to one per minute. */
export const FOREGROUND_CHECK_MIN_GAP_MS = 60_000;

/** While the app is open, look for a new version once an hour (W9b). */
export const PERIODIC_CHECK_MS = 60 * 60 * 1000;

/** "Updated to the latest version" leaves by itself after this long. */
export const UPDATED_NOTICE_MS = 10_000;
let updatedTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Runtime caches of code chunks from before W9b. Every JS/CSS file is
 * precached now, so these only take space; deleted once this version's
 * worker controls the page.
 */
export const LEGACY_CODE_CACHES = ['content-cache', 'app-chunks', 'vexflow-cache'] as const;

/** Bounds for the "Try again" / Reload path (review items 1 and 5). */
export const UPDATE_CHECK_TIMEOUT_MS = 5_000;
export const INSTALL_WAIT_MS = 8_000;
export const TAKEOVER_FALLBACK_MS = 4_000;

let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null = null;
let registration: ServiceWorkerRegistration | undefined;
let swUrl = '/sw.js';
let periodicTimer: ReturnType<typeof setInterval> | undefined;
let started = false;
let reloading = false;
/** A new version is waiting (the plugin said so). */
let updateWaiting = false;
/** A silent update is under way (the new worker was asked to take over). */
let applyingSilently = false;
let deciding: Promise<boolean> | null = null;

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
 * Ask the server whether a new version exists (W9b: the hourly check and the
 * foreground check). Guarded as in vite-plugin-pwa's "Periodic Service Worker
 * Updates" edge-case snippet: not while a worker is installing, not offline,
 * and only after a `no-store` probe of the worker script answered 200 — so a
 * server that is down, or a connection that just dropped, never reaches
 * registration.update(). (The guide also sends a `cache: no-store` request
 * header; that is not an HTTP header — the fetch option does the job.)
 * Only downloads/installs; a found update surfaces as onNeedRefresh.
 */
export async function checkForUpdate(): Promise<void> {
  const reg = registration;
  if (!reg || reg.installing) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  try {
    const probe = await withTimeout(
      fetch(swUrl, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } }),
      UPDATE_CHECK_TIMEOUT_MS,
    );
    if (probe?.status === 200) await reg.update();
  } catch {
    // Offline / server down: try again at the next check.
  }
}

function raiseUpdatePrompt(): void {
  // A (newer) waiting version: ask again even if an earlier one was put off.
  usePwaUpdateStore.setState({ needRefresh: true, updateDeferred: false });
}

/** Is now a safe moment to apply the waiting update without asking (this tab)? */
function safeMomentHere(): boolean {
  if (!updateWaiting || applyingSilently || reloading || !updateServiceWorker) return false;
  const { updateDeferred, incoming } = usePwaUpdateStore.getState();
  const critical = incoming?.critical === true;
  const fresh = isFreshStart() && (critical || !updateDeferred);
  const away = critical && typeof document !== 'undefined' && document.visibilityState === 'hidden';
  return (fresh || away) && !hasWorkInProgress();
}

async function decide(): Promise<boolean> {
  if (!safeMomentHere()) return false;
  if (await otherTabsBusy()) return false;
  // Asking the other tabs took a moment: the learner may have started since.
  if (!safeMomentHere()) return false;
  applySilently();
  return true;
}

/**
 * Apply the waiting update now if this is a safe moment (see the model
 * above). Resolves true when it started applying. One decision at a time.
 */
export function applyAtSafeMoment(): Promise<boolean> {
  if (!deciding) deciding = decide().finally(() => (deciding = null));
  return deciding;
}

function applySilently(): void {
  applyingSilently = true;
  markAutoUpdate(usePwaUpdateStore.getState().incoming?.critical ? 'critical' : 'fresh-start');
  reloadWhenControllerChanges();
  void updateServiceWorker?.(true);
  // The new worker never took over: never reload into the same old version
  // behind the learner's back — ask instead.
  setTimeout(() => {
    if (reloading) return;
    applyingSilently = false;
    clearAutoUpdateMark();
    raiseUpdatePrompt();
  }, TAKEOVER_FALLBACK_MS);
}

/** The plugin found a waiting version: apply it now if it is a safe moment, else ask. */
function onUpdateWaiting(): void {
  updateWaiting = true;
  if (applyingSilently) return;
  if (isFreshStart() && !hasWorkInProgress()) {
    // Possibly silent: hold the prompt until the other tabs have answered.
    void applyAtSafeMoment().then((applied) => {
      if (!applied && !applyingSilently) raiseUpdatePrompt();
    });
  } else {
    raiseUpdatePrompt();
  }
  void fetchIncomingVersion().then((incoming) => {
    if (!incoming || applyingSilently) return;
    usePwaUpdateStore.setState({ incoming });
    // Critical: the page may already be at a safe moment (e.g. hidden).
    if (incoming.critical) void applyAtSafeMoment();
  });
}

/** The first page after an automatic update: say so (and what is new). */
function showUpdatedNotice(): void {
  const mark = takeAutoUpdateMark();
  if (!mark) return;
  const notes = APP_RELEASE.release > mark.fromRelease ? APP_RELEASE.notes : null;
  usePwaUpdateStore.setState({ updated: { notes } });
  clearTimeout(updatedTimer);
  updatedTimer = setTimeout(() => usePwaUpdateStore.setState({ updated: null }), UPDATED_NOTICE_MS);
}

function deleteLegacyCodeCaches(): void {
  if (typeof caches === 'undefined' || typeof navigator === 'undefined' || !navigator.serviceWorker?.controller) return;
  for (const name of LEGACY_CODE_CACHES) caches.delete(name).catch(() => {});
}

/**
 * Register the service worker once per page. Also re-checks for a new version
 * whenever the app returns to the foreground — an installed app left open for
 * days otherwise only looked for updates on a cold launch — and hourly while
 * it stays open (W9b).
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

  showUpdatedNotice();
  deleteLegacyCodeCaches();
  listenForBusyQuestions();
  // Shown for the first time / back after a long absence: a waiting update
  // may go in now (the foreground check below may also find a new one).
  startFreshStartTracking(() => void applyAtSafeMoment());

  let lastCheck = 0;

  updateServiceWorker = registerSW({
    onNeedRefresh() {
      onUpdateWaiting();
    },
    onOfflineReady() {
      showOfflineReady();
    },
    onRegisteredSW(url, r) {
      registration = r;
      swUrl = url;
      // One hourly check per page, never stacked if registration repeats.
      clearInterval(periodicTimer);
      periodicTimer = r ? setInterval(() => void checkForUpdate(), PERIODIC_CHECK_MS) : undefined;
    },
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // The learner switched away: a waiting CRITICAL update may go in now.
      void applyAtSafeMoment();
      return;
    }
    if (document.visibilityState !== 'visible' || !registration) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    const now = Date.now();
    if (now - lastCheck < FOREGROUND_CHECK_MIN_GAP_MS) return;
    lastCheck = now;
    void checkForUpdate();
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
  const updateDeferred = usePwaUpdateStore((s) => s.updateDeferred);
  const incoming = usePwaUpdateStore((s) => s.incoming);
  const updated = usePwaUpdateStore((s) => s.updated);
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
  const deferUpdate = useCallback(() => usePwaUpdateStore.setState({ updateDeferred: true }), []);
  const dismissUpdated = useCallback(() => usePwaUpdateStore.setState({ updated: null }), []);

  return {
    needRefresh,
    offlineReady,
    updateDeferred,
    deferUpdate,
    /** The waiting version's note and critical flag (null until known). */
    incoming,
    /** "Updated to the latest version" after an automatic update. */
    updated,
    dismissUpdated,
    canInstall: installPrompt !== null,
    install,
    dismissInstall,
    reload,
    dismissOffline,
  };
}
