import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { registerSW } from 'virtual:pwa-register';
import { reloadPage } from '../utils/pageReload';
import { APP_RELEASE } from '../buildInfo';
import type { ReleaseNoteText } from '../release/releaseNotes';
import { hasWorkInProgress } from '../services/workInProgress';
import { getInteractionCount, isFreshStart, startFreshStartTracking } from '../services/freshStart';
import { countAppWindows, listenForBusyQuestions, otherTabsBusy } from '../services/otherTabs';
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
 * in the background and WAITS. `needRefresh` raises the "new version —
 * reload" toast; the learner's tap (or "Try again" on a view whose files are
 * gone, see ViewSlot) activates it. W9b also allows the safe moments below;
 * any activity after a silent request blocks the reload at takeover. Before
 * this, `autoUpdate` reloaded a few seconds after launch without asking and
 * the toast could never appear.
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
  /**
   * A new version took control of this page without this page asking (a
   * takeover after the silent apply gave up or was interrupted, or another tab's
   * Reload): the page is NOT reloaded under the learner — "Reload to finish
   * updating" asks instead (review W9b-g).
   */
  finishUpdate: boolean;
}

export const usePwaUpdateStore = create<PwaUpdateState>(() => ({
  needRefresh: false,
  offlineReady: false,
  updateDeferred: false,
  incoming: null,
  updated: null,
  finishUpdate: false,
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

/** "Updated to the latest version" leaves by itself after this long — counted while the page is visible. */
export const UPDATED_NOTICE_MS = 10_000;
let updatedTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * The plugin reports one waiting version twice ("installed", then "waiting"
 * 200 ms later): /version.json is fetched once per this span (review W9b-c).
 */
export const INCOMING_REFETCH_MS = 60_000;
let incomingFetchedAt = Number.NEGATIVE_INFINITY;

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
let silentInteractionCount = 0;
let silentTakeoverTimer: ReturnType<typeof setTimeout> | undefined;
let deciding: Promise<boolean> | null = null;
/** This page asked a waiting worker to take over (Reload, Try again, a silent apply) and awaits it. */
let expectingTakeover = false;
/** A worker already controls this page: the next controllerchange is an update taking over (not the first install). */
let pageControlled = false;

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
  expectingTakeover = true;
  navigator.serviceWorker.addEventListener('controllerchange', reloadOnce, { once: true });
}

/**
 * Registered BEFORE the plugin's own listeners (startPwaRegistration). A new
 * worker that takes control of a page that was already controlled, when this
 * page did not ask for it, must not reload it under the learner — the
 * plugin's listener would (it reloads on every update takeover, for good).
 * Stop it there and ask: "Reload to finish updating". The first install's
 * takeover (an uncontrolled page — this one counts as controlled from then
 * on) and an explicit Reload pass through. A silent request passes only if
 * no interaction occurred since it was sent and no work is now in progress.
 */
function guardUnaskedTakeover(event: Event): void {
  const wasControlled = pageControlled;
  pageControlled = true;
  if (reloading) return;
  const interrupted = applyingSilently &&
    (getInteractionCount() !== silentInteractionCount || hasWorkInProgress());
  if (!interrupted && (!wasControlled || expectingTakeover)) return;
  event.stopImmediatePropagation();
  stopSilentApply();
  updateWaiting = false; // this worker is active now, not waiting
  usePwaUpdateStore.setState({ needRefresh: false, updateDeferred: false, finishUpdate: true });
}

/** "Reload to finish updating": the new worker already controls the page; a plain reload loads the new version. */
export function finishUpdateReload(): void {
  reloadOnce();
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

/** This page's registration — the plugin may report a waiting worker before it hands the registration over. */
async function currentRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  if (registration) return registration;
  try {
    return await navigator.serviceWorker?.getRegistration?.();
  } catch {
    return undefined;
  }
}

async function decide(): Promise<boolean> {
  if (!safeMomentHere()) return false;
  // Every other open window must answer "idle"; one that cannot (an older
  // version) or does not counts as busy (services/otherTabs.ts).
  if (await otherTabsBusy(await countAppWindows(await currentRegistration()))) return false;
  // Asking the other tabs took a moment: the learner may have started since.
  if (!safeMomentHere()) return false;
  applySilently();
  return true;
}

/**
 * Apply the waiting update now if this is a safe moment (see the model
 * above). Resolves true when it started applying. One decision at a time —
 * a cue that arrives while one is under way (the page hidden, then shown
 * again moments later) is decided right after it, never dropped.
 */
export function applyAtSafeMoment(): Promise<boolean> {
  const next: Promise<boolean> = (deciding ?? Promise.resolve(false))
    .then((applied) => applied || decide())
    .finally(() => {
      if (deciding === next) deciding = null;
    });
  deciding = next;
  return next;
}

function applySilently(): void {
  applyingSilently = true;
  silentInteractionCount = getInteractionCount();
  markAutoUpdate(usePwaUpdateStore.getState().incoming?.critical ? 'critical' : 'fresh-start');
  reloadWhenControllerChanges();
  void updateServiceWorker?.(true);
  // The new worker never took over: never reload into the same old version
  // behind the learner's back — ask instead. A takeover that still comes
  // later is no longer expected: it asks too ("Reload to finish updating").
  silentTakeoverTimer = setTimeout(() => {
    if (reloading) return;
    stopSilentApply();
    raiseUpdatePrompt();
  }, TAKEOVER_FALLBACK_MS);
}

/** Stop expecting a silent takeover; SKIP_WAITING itself cannot be cancelled. */
function stopSilentApply(): void {
  clearTimeout(silentTakeoverTimer);
  applyingSilently = false;
  expectingTakeover = false;
  navigator.serviceWorker?.removeEventListener('controllerchange', reloadOnce);
  clearAutoUpdateMark();
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
  // Once per waiting version (the plugin reports it twice, 200 ms apart).
  const now = Date.now();
  if (now - incomingFetchedAt < INCOMING_REFETCH_MS) return;
  incomingFetchedAt = now;
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
  startUpdatedNoticeClock();
}

/**
 * The notice's UPDATED_NOTICE_MS count only while the page is visible: a
 * critical update applied while the learner was away must still greet them
 * when they come back (review W9b-d).
 */
function startUpdatedNoticeClock(): void {
  clearTimeout(updatedTimer);
  let remaining = UPDATED_NOTICE_MS;
  let visibleSince: number | null = null;
  const onVisibility = () => {
    clearTimeout(updatedTimer);
    if (visibleSince !== null) remaining -= performance.now() - visibleSince;
    visibleSince = null;
    if (document.visibilityState === 'hidden') return;
    visibleSince = performance.now();
    updatedTimer = setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibility);
      usePwaUpdateStore.setState({ updated: null });
    }, Math.max(0, remaining));
  };
  document.addEventListener('visibilitychange', onVisibility);
  onVisibility();
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

  // Before every other controllerchange listener (the plugin's included):
  // an update nobody here asked for never reloads the page (review W9b-g).
  if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
    pageControlled = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', guardUnaskedTakeover);
  }

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
 * Other tabs stop their unasked takeover before the plugin can reload them
 * (guardUnaskedTakeover) and offer "Reload to finish updating" instead.
 */
export async function applyUpdateOrReload(): Promise<void> {
  stopSilentApply(); // the learner's request supersedes any pending silent one
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

/**
 * The browser's install offer, kept from the first moment the app's code
 * runs (wave 1). On a first visit the start screen stands in place of the
 * shell, so PWAPrompts (the one user of this hook) is not mounted yet: a
 * listener inside the hook missed an offer made while the start screen was
 * up, for the whole visit. This module is in the entry chunk (AppShell →
 * PWAPrompts), so it listens before the start screen paints.
 */
const useInstallOfferStore = create<{ offer: BeforeInstallPromptEvent | null }>(() => ({ offer: null }));
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    useInstallOfferStore.setState({ offer: e as BeforeInstallPromptEvent });
  });
}
const setInstallPrompt = (offer: BeforeInstallPromptEvent | null) => useInstallOfferStore.setState({ offer });

export function usePWA() {
  const needRefresh = usePwaUpdateStore((s) => s.needRefresh);
  const offlineReady = usePwaUpdateStore((s) => s.offlineReady);
  const updateDeferred = usePwaUpdateStore((s) => s.updateDeferred);
  const incoming = usePwaUpdateStore((s) => s.incoming);
  const updated = usePwaUpdateStore((s) => s.updated);
  // The install offer, captured at module load (above), whenever it came.
  const installPrompt = useInstallOfferStore((s) => s.offer);

  useEffect(() => {
    startPwaRegistration();
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
  const finishUpdate = usePwaUpdateStore((s) => s.finishUpdate);

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
    /** A new version took over without this page asking: "Reload to finish updating". */
    finishUpdate,
    finishUpdateReload,
    canInstall: installPrompt !== null,
    install,
    dismissInstall,
    reload,
    dismissOffline,
  };
}
