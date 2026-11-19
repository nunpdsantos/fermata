/**
 * The browser's Back and Forward inside Fermatina (second audit round, QA
 * report 2 points 3 and 10; the owner's ruling of 18 November 2026: "Back
 * steps back one screen, and never loses a check or a drill in progress").
 *
 * Until now nothing pushed a history entry, so Back (the button, a phone's
 * edge swipe, Android's back gesture in the installed app) left the app.
 * Now every SCREEN is an entry of the session history, and the entry carries
 * where it is in `history.state`. The address stays `/`: a path would leave
 * the service worker's allowlist (it answers only `/` and `/index.html`) and
 * a reload there would get the site's not-found page.
 *
 * An entry is `{ fm: 1, i, v, s, l }`: `i` counts entries in this document
 * (so a popstate knows its direction), `v` the view, `s` the screen inside
 * it (Learn: `''` the overview, `level/l2`, `unit/l2/u5`, `module/l1/u3/l1u3m1`
 * with `/run` while its check or result is open, `review/…`; Drill: `''`,
 * `settings`, `mastery`, `sprint`; Explore: `''`; undefined = the view
 * decides, as on a tab tap), `l` how many sheets / dialogs it covers.
 *
 * The rules (the table of screens is in the stream's report):
 *  - A screen the LEARNER opens pushes an entry: a tab, a lesson, a level, a
 *    check, Drill's settings / mastery map / Sprint, a deep link (Quick
 *    Search, "Learn about this", Drill's family link, a share link's "Open").
 *    Nothing else does: a chord picked, a key changed, a question answered,
 *    the check's result (it replaces the check), the app's own way back
 *    (← arrows, breadcrumbs, ✕ Exit: they replace the entry, so the next Back
 *    goes where the screen came from).
 *  - Only after a user activation since the last Back / Forward
 *    (`armed`): Chromium marks EVERY entry of a document that adds one without
 *    a user activation as skippable, and its Back button then leaves the app
 *    (chromium.googlesource.com/chromium/src/+/127.0.6533.99/docs/history_manipulation_intervention.md:
 *    "After a same-document back/forward, the intervention stops honoring
 *    earlier activations for creating new entries until a new activation
 *    arrives"). So the boot, a share link opening at boot, a popstate's own
 *    reaction and the tour never push: they replace.
 *  - The start screen is not a place to come back to (once a door is
 *    chosen it never shows again): a door replaces its entry.
 *  - The tour drives the screen itself and leaves no history behind it: while
 *    it plays, nothing is written; it is one layer of its own (Back ends it,
 *    as ✕ and Escape do).
 *  - Sheets and dialogs are LAYERS (`useBackLayer`): opening one pushes an
 *    entry covering it; Back closes the top one, as Escape does, and moves
 *    nowhere else. One closed by itself (✕, Escape, the scrim) leaves its
 *    entry behind, which then shows nothing new — so:
 *  - an entry that shows nothing new (the same screen, nothing to close) is
 *    passed over in the direction of travel: every press changes something,
 *    and at the first screen of the visit Back leaves, as on any site.
 *  - Leaving a screen that holds work in progress by Back or Forward never
 *    drops it (the Learn session store and the Drill store keep it, as they
 *    do across a reload); the view that holds it says so (`useWorkKeeper`):
 *    a toast with "Continue", which returns — and a lesson's check card
 *    offers its kept check.
 *  - A reload keeps the entries and their states (MDN, History.pushState():
 *    "it may attempt to load the URL later, for instance, after the user
 *    restarts the browser"; `History.state`): the boot view comes from the
 *    entry (`pickBootView`), and the view opens the screen it names
 *    (`placeToOpen`).
 * The tour, Quick Search, the sheets and the views talk to this module; the
 * entry bundle only imports it lazily (App.tsx, after the boot view is set)
 * and reads the entry's view (bootView.ts).
 */
import { useEffect, useRef } from 'react';
import { useAppStore } from './store';
import type { ViewMode } from './storeTypes';
import { useWelcomeStore } from './welcomeGate';
import { getDemoRequest } from './demoRequest';
import { useToastStore } from './toastStore';
import i18n from '../i18n/index';
import '../i18n/backNav';

export interface HistoryEntry {
  fm: 1;
  /** Position among this document's entries. */
  i: number;
  v: ViewMode;
  /** The screen inside the view; undefined = the view decides. */
  s?: string;
  /** Sheets, dialogs and menus this entry covers. */
  l: number;
}

type Dir = 1 | -1;
interface Layer {
  close: () => void;
  tour: boolean;
  /** A layer that can go without telling (a menu): open while this holds. */
  live?: () => boolean;
}

/** Drop the layers that went without telling. */
function prune(): void {
  for (let k = layers.length - 1; k >= 0; k--) if (layers[k].live && !layers[k].live!()) layers.splice(k, 1);
}

function openLayer(layer: Layer): void {
  prune();
  layers.push(layer);
  // One entry per layer above what the entry on screen covers; a layer
  // that closed by itself left its entry, which the next one reuses (and
  // StrictMode's second mount pushes nothing).
  if (layers.length > cur.l && armed && !restoring && (layer.tour || !tourPlaying())) {
    write({ ...cur, i: cur.i + 1, l: layers.length }, true);
  }
}

const VIEWS: readonly string[] = ['explore', 'learn', 'drill'];

/** One of ours (any other state, or none: not a Fermatina entry). */
export function isHistoryEntry(v: unknown): v is HistoryEntry {
  if (typeof v !== 'object' || v === null) return false;
  const e = v as Record<string, unknown>;
  return e.fm === 1 && Number.isInteger(e.i) && VIEWS.includes(e.v as string)
    && (e.s === undefined || typeof e.s === 'string') && Number.isInteger(e.l);
}

let cur: HistoryEntry = { fm: 1, i: 0, v: 'explore', l: 0 };
let armed = false;
let restoring = false;
/** The index a traversal of our own is going back to (a layer closed with no entry of its own). */
let expecting: number | null = null;
const layers: Layer[] = [];
const shows = new Map<ViewMode, (s: string, dir: Dir) => void>();
const keepers = new Map<ViewMode, (to: HistoryEntry) => string | null>();
/**
 * The entry (by `i`) whose screen a view opens at when it mounts: set by a
 * reload and by Back / Forward, cleared by any other navigation — so a tab
 * tap, a deep link or a link at boot leave the view its own choice, as before.
 */
let opensAt: number | null = null;
let keptToast: string | null = null;

const tourPlaying = () => getDemoRequest() !== null;

/** The "kept" toast offers a way back only while that way is the entry next door. */
function dropKeptToast(): void {
  if (keptToast !== null) useToastStore.getState().removeToast(keptToast);
  keptToast = null;
}

function write(next: HistoryEntry, push: boolean): void {
  cur = next;
  if (push) dropKeptToast();
  try {
    if (push) window.history.pushState(next, '');
    else window.history.replaceState(next, '');
  } catch {
    // A browser that refuses (too many calls, a document not fully active): the screen still changed.
  }
}

/** The entry on screen (tests, and the views' decisions). */
export function currentEntry(): HistoryEntry {
  return cur;
}

/**
 * The learner opens a screen: a new entry when that is allowed (see the
 * header), else the current one is rewritten. The same screen writes nothing.
 */
export function goTo(v: ViewMode, s: string | undefined): void {
  if (tourPlaying() || restoring || (cur.v === v && cur.s === s)) return;
  const push = armed && !useWelcomeStore.getState().open;
  opensAt = null;
  write({ fm: 1, i: push ? cur.i + 1 : cur.i, v, s, l: push ? 0 : cur.l }, push);
}

/** A view says which screen it shows (on mount, the app's own ways back, a result): the entry is rewritten. */
export function notePlace(v: ViewMode, s: string): void {
  if (tourPlaying() || cur.v !== v || cur.s === s) return;
  write({ ...cur, s }, false);
}

/** The screen a view opens at as it mounts (a reload, Back / Forward into it); undefined = its own choice. Pure: an initializer may call it. */
export function placeToOpen(v: ViewMode): string | undefined {
  return opensAt === cur.i && cur.v === v ? cur.s : undefined;
}

/** A view shows the screens Back / Forward (and its active tab) ask for while it is mounted. */
export function useShowPlace(v: ViewMode, show: (s: string, dir: Dir) => void): void {
  const ref = useRef(show);
  useEffect(() => {
    ref.current = show;
  });
  useEffect(() => {
    const fn = (s: string, dir: Dir) => ref.current(s, dir);
    shows.set(v, fn);
    return () => {
      if (shows.get(v) === fn) shows.delete(v);
    };
  }, [v]);
}

/**
 * A view holding work in progress (a check under way, a Drill session with
 * answers, a Sprint with time left) says, when Back or Forward leaves it for
 * `to`, what is kept — or null when `to` shows the work itself.
 */
export function useWorkKeeper(v: ViewMode, keep: ((to: HistoryEntry) => string | null) | null): void {
  const ref = useRef(keep);
  useEffect(() => {
    ref.current = keep;
  });
  const on = keep !== null;
  useEffect(() => {
    if (!on) return;
    const fn = (to: HistoryEntry) => ref.current?.(to) ?? null;
    keepers.set(v, fn);
    return () => {
      if (keepers.get(v) === fn) keepers.delete(v);
    };
  }, [v, on]);
}

/**
 * A sheet or dialog: while `open`, Back closes it (calling `close`, what
 * Escape does) and moves nowhere else. `tour`: the tour's own layer, which
 * is written while everything else the tour does is not.
 */
export function useBackLayer(open: boolean, close: () => void, tour = false): void {
  const ref = useRef(close);
  useEffect(() => {
    ref.current = close;
  });
  useEffect(() => {
    if (!open) return;
    const layer: Layer = { close: () => ref.current(), tour };
    openLayer(layer);
    return () => {
      const k = layers.indexOf(layer);
      if (k >= 0) layers.splice(k, 1);
      // The tour may end elsewhere than it began ("Stay here"): the entry follows the view shown.
      const view = useAppStore.getState().view;
      if (cur.v !== view && !tourPlaying()) write({ ...cur, v: view, s: undefined }, false);
    };
  }, [open, tour]);
}

function same(to: HistoryEntry, from: HistoryEntry): boolean {
  return to.v === from.v && (to.s === undefined || to.s === from.s);
}

function show(to: HistoryEntry, dir: Dir): void {
  restoring = true;
  try {
    const app = useAppStore.getState();
    opensAt = to.i;
    if (app.view !== to.v) {
      app.setView(to.v);
    } else if (to.s !== undefined) {
      shows.get(to.v)?.(to.s, dir);
    }
  } finally {
    restoring = false;
  }
}

function onPopState(e: PopStateEvent): void {
  armed = false;
  if (!isHistoryEntry(e.state)) return;
  const to = e.state;
  const from = cur;
  if (expecting !== null && to.i === expecting) {
    expecting = null;
    cur = to;
    return;
  }
  const dir: Dir = to.i < from.i ? -1 : 1;
  // Sheets, dialogs and menus first, the top one first, as Escape does.
  prune();
  const extra = layers.length - to.l;
  if (dir < 0 && extra > 0) {
    for (const layer of layers.slice(-extra).reverse()) layer.close();
    if (same(to, from)) {
      cur = { ...to, s: to.s ?? from.s };
    } else {
      // The layer had no entry of its own: stay where it was.
      expecting = from.i;
      window.history.go(from.i - to.i);
    }
    return;
  }
  // Nothing new to show: on, in the same direction (at the first entry Back leaves the app).
  if (same(to, from)) {
    cur = { ...to, s: to.s ?? from.s };
    window.history.go(dir);
    return;
  }
  const kept = keepers.get(from.v)?.(to) ?? null;
  cur = to;
  dropKeptToast();
  show(to, dir);
  if (kept) {
    const back = -dir;
    keptToast = useToastStore.getState().addToast({
      type: 'info',
      message: kept,
      duration: 8000,
      action: { label: i18n.t('backNav.continue'), onSelect: () => window.history.go(back) },
    });
  }
}

/**
 * Tapping the tab of the view already shown (P10): its first screen — Drill's
 * question, intro or summary; Learn's overview — as a screen of its own (Back
 * returns). Read in the capture phase, before the tab's own handler: it is
 * the tab that WAS selected.
 */
function onTabClick(e: MouseEvent): void {
  const tab = e.target instanceof Element ? e.target.closest('[role="tab"][data-tab]') : null;
  if (!tab || tab.getAttribute('aria-selected') !== 'true' || tourPlaying()) return;
  const v = tab.getAttribute('data-tab') as ViewMode;
  if (v === 'explore' || cur.v !== v || cur.s === '' || !shows.has(v)) return;
  goTo(v, '');
  shows.get(v)?.('', -1);
}

/**
 * A "⋯" menu (ui/Menu.tsx, in the entry bundle, which cannot import this
 * module) is a layer too: its button opening it is seen here, in the capture
 * phase, and the layer lives while a menu is in the page. Back closes it as
 * its Escape does (a keydown on the menu).
 */
const openMenu = () => document.querySelector<HTMLElement>('[role="menu"]');
function onMenuButton(e: Event): void {
  const button = e.target instanceof Element ? e.target.closest('[aria-haspopup="menu"]') : null;
  if (!button || button.getAttribute('aria-expanded') === 'true') return;
  if (e instanceof KeyboardEvent && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  openLayer({
    tour: false,
    live: () => openMenu() !== null,
    close: () => openMenu()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
  });
}

/** Chromium's user activations (MDN, "User activation"): keydown (not Escape), mousedown, a touch's or pen's pointerup, touchend. */
function arm(e: Event): void {
  if (!e.isTrusted) return;
  if (e instanceof KeyboardEvent && e.key === 'Escape') return;
  if (e.type === 'pointerup' && (e as PointerEvent).pointerType === 'mouse') return;
  armed = true;
}

let installed = false;

/** Take the tab's history over (once; the module does it when it loads in a browser). */
export function installAppHistory(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  const view = useAppStore.getState().view;
  const kept = isHistoryEntry(window.history.state) ? window.history.state : null;
  // A reload (or a return to an entry of this tab): the boot view came from
  // it (pickBootView); the view opens the screen it names as it mounts.
  const s = kept && kept.v === view ? kept.s : undefined;
  write({ fm: 1, i: kept?.i ?? 0, v: view, s, l: 0 }, false);
  if (s !== undefined) opensAt = cur.i;
  window.addEventListener('popstate', onPopState);
  // Back from another site into a page the browser kept whole (the
  // back/forward cache: MDN, Window: pageshow event): a traversal, as above.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) armed = false;
  });
  for (const type of ['keydown', 'mousedown', 'pointerup', 'touchend']) window.addEventListener(type, arm, true);
  document.addEventListener('click', onTabClick, true);
  document.addEventListener('click', onMenuButton, true);
  document.addEventListener('keydown', onMenuButton, true);
  useAppStore.subscribe((state, prev) => {
    const target = state.pendingLearnTarget;
    const deep = target !== null && target !== prev.pendingLearnTarget;
    if (state.view === prev.view && !deep) return;
    goTo(state.view, state.view === 'learn' && deep ? `module/${target.levelId}/${target.unitId}/${target.moduleId}` : undefined);
  });
}

/** Test seam: forget everything (jsdom keeps one history for a whole file). */
export function resetAppHistoryForTests(): void {
  cur = { fm: 1, i: 0, v: useAppStore.getState().view, l: 0 };
  armed = false;
  restoring = false;
  expecting = null;
  layers.length = 0;
  opensAt = null;
  keptToast = null;
}

/** Test seam: a user activation (jsdom's events are never trusted). */
export function armForTests(on = true): void {
  armed = on;
}

installAppHistory();
