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
 * decides, as on a tab tap), `l` how many sheets, dialogs or menus it covers.
 *
 * The rules (the table of screens is in the stream's report):
 *  - A screen the LEARNER opens pushes an entry: a tab, a lesson, a level, a
 *    check, Drill's settings / mastery map / Sprint, a deep link (Quick
 *    Search, "Learn about this", Drill's family link, a share link's "Open").
 *    Nothing else does: a chord picked, a key changed, a question answered,
 *    the check's result (it replaces the check).
 *  - The app's own ways back (← arrows, breadcrumbs, ✕ Exit, Drill's Back and
 *    "← Mastery") are Back: to the nearest earlier entry of the same view that
 *    names the screen they open, when this tab's history has one (`backTo`),
 *    else they rewrite the entry. So the next Back never shows the screen they
 *    left, nor one they went back past.
 *  - Only after a user activation since the last Back / Forward (`armed`):
 *    Chromium marks EVERY entry of a document that adds one without a user
 *    activation as skippable, and its Back button then leaves the app
 *    (chromium.googlesource.com/chromium/src/+/127.0.6533.99/docs/history_manipulation_intervention.md:
 *    "After a same-document back/forward, the intervention stops honoring
 *    earlier activations for creating new entries until a new activation
 *    arrives"). So the boot, a share link opening at boot, a popstate's own
 *    reaction and the tour never push: they replace.
 *  - The start screen is not a place to come back to (once a door is chosen
 *    it never shows again): a door replaces its entry.
 *  - The tour drives the screen itself and leaves no history behind it: while
 *    it plays, nothing is written; it is one layer of its own (Back ends it,
 *    as ✕ and Escape do).
 *  - Sheets, dialogs and menus are LAYERS (`useBackLayer`): opening one pushes
 *    an entry covering it; Back closes the top one, as Escape does, and moves
 *    nowhere else. One closed by its own control (✕, Escape, the scrim, a menu
 *    item) leaves its entry, which shows nothing new and which the next layer
 *    reuses — so:
 *  - an entry that shows nothing new (the same screen, nothing to close) is
 *    passed over in the direction of travel: every press changes something,
 *    and at the first screen of the visit Back leaves, as on any site.
 *  - An entry the app did not write (a fragment link, anything else: state
 *    null or foreign) is never bounced onto: met (Chromium fires popstate,
 *    then hashchange, for a fragment link), it is rewritten as ours — a copy
 *    of the screen shown, under the next index, the address kept at `/` — so
 *    Back from it passes over it; and landing on ours at an equal index is
 *    neither Back nor Forward. Only ours have meaning.
 *  - While a traversal of the app's own is under way (closing a layer that
 *    had no entry, passing over an entry, the app's own way back), nothing is
 *    written: it would land on the wrong entry. Writes wait for the landing.
 *  - Leaving a screen that holds work in progress by Back or Forward (or by
 *    tapping its view's active tab) never drops it (the Learn session store
 *    and the Drill store keep it, as they do across a reload); the view that
 *    holds it says so (`useWorkKeeper`): a toast with "Continue", which
 *    returns — and a lesson's check card offers its kept check.
 *  - Back into Explore brings back the chord as it was left (its detail, its
 *    inversion, the chords card's tab): `setView` clears them, as a tab does.
 *  - After Back or Forward changes the screen, focus goes to its heading in
 *    the main region (a screen reader reads its name), as a fresh screen
 *    would be met; a layer closed gives focus back as Escape does.
 *  - A reload keeps the entries and their states (MDN, History.pushState():
 *    "it may attempt to load the URL later, for instance, after the user
 *    restarts the browser"; `History.state`): the boot view comes from the
 *    entry (`pickBootView`), and the view opens the screen it names
 *    (`placeToOpen`). "Reset app data" forgets the entry's place.
 * The tour, Quick Search, the sheets and the views talk to this module; the
 * entry bundle only imports it lazily (App.tsx, after the boot view is set)
 * and reads the entry's view (bootView.ts).
 */
import { useEffect, useRef } from 'react';
import { useAppStore } from './store';
import type { AppState, ViewMode } from './storeTypes';
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
/** What Explore's chord was when an Explore entry was left: `setView` clears it, Back brings it back. */
type ExploreLeft = Pick<AppState, 'selectedChord' | 'chordInversion' | 'selectedDegree' | 'detailPanelOpen'> & { tab: string | null };

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
/** The index a traversal of our own is going to (a layer closed with no entry of its own, the app's own way back). */
let expecting: number | null = null;
const layers: Layer[] = [];
const shows = new Map<ViewMode, (s: string | undefined, dir: Dir) => void>();
const keepers = new Map<ViewMode, (to: HistoryEntry) => string | null>();
/** This tab's entries as the app wrote or met them (index → place): where the app's own way back can go. */
const known = new Map<number, { v: ViewMode; s?: string }>();
/** Explore's chord as each Explore entry was left (in memory: a reload starts without a chord anyway). */
const exploreLeft = new Map<number, ExploreLeft>();
/**
 * The entry (by `i`) whose screen a view opens at when it mounts: set by a
 * reload and by Back / Forward, cleared by any other navigation — so a tab
 * tap, a deep link or a link at boot leave the view its own choice, as before.
 */
let opensAt: number | null = null;
let keptToast: string | null = null;

/** Writes held while a traversal of our own is under way (replayed, in order, once it lands). */
let holding = false;
let holdTimer: ReturnType<typeof setTimeout> | undefined;
const held: (() => void)[] = [];
function hold(): void {
  holding = true;
  clearTimeout(holdTimer);
  // A traversal that goes nowhere (nothing that way) never lands: let go after a second.
  holdTimer = setTimeout(release, 1000);
}
function release(): void {
  holding = false;
  clearTimeout(holdTimer);
  for (const call of held.splice(0)) call();
}

const tourPlaying = () => getDemoRequest() !== null;

/** The "kept" toast offers a way back only while that way is the entry next door. */
function dropKeptToast(): void {
  if (keptToast !== null) useToastStore.getState().removeToast(keptToast);
  keptToast = null;
}

function write(next: HistoryEntry, push: boolean): void {
  if (push) {
    dropKeptToast();
    // A push cuts the entries after it.
    for (const k of [...known.keys()]) if (k > cur.i) known.delete(k);
    for (const k of [...exploreLeft.keys()]) if (k > cur.i) exploreLeft.delete(k);
  }
  cur = next;
  known.set(next.i, { v: next.v, s: next.s });
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

/** Explore's chord, as the Explore entry being left had it. */
function noteExploreLeft(i: number, s: Pick<AppState, 'selectedChord' | 'chordInversion' | 'selectedDegree' | 'detailPanelOpen'>): void {
  let tab: string | null = null;
  for (const id of ['diatonic', 'all', 'build']) if (document.getElementById(`chords-tab-${id}`)?.getAttribute('aria-selected') === 'true') tab = id;
  exploreLeft.set(i, { selectedChord: s.selectedChord, chordInversion: s.chordInversion, selectedDegree: s.selectedDegree, detailPanelOpen: s.detailPanelOpen, tab });
}

/** Back (or Forward) into an Explore entry: its chord again, on the tab it was on (the tab's own handler clears the chord, so the chord goes after it). */
function bringExploreBack(i: number): void {
  const left = exploreLeft.get(i);
  if (!left || left.selectedChord === null) return;
  const { tab, ...chord } = left;
  useAppStore.setState(chord);
  if (!tab || tab === 'diatonic') return;
  let tries = 0;
  const press = () => {
    const button = document.getElementById(`chords-tab-${tab}`);
    if (!button) {
      if (++tries < 120) requestAnimationFrame(press);
      return;
    }
    if (button.getAttribute('aria-selected') !== 'true') button.click();
    useAppStore.setState(chord);
  };
  requestAnimationFrame(press);
}

/**
 * The learner opens a screen: a new entry when that is allowed (see the
 * header), else the current one is rewritten. The same screen writes nothing.
 */
export function goTo(v: ViewMode, s: string | undefined): void {
  if (tourPlaying() || restoring || (cur.v === v && cur.s === s)) return;
  if (holding) {
    held.push(() => goTo(v, s));
    return;
  }
  const push = armed && !useWelcomeStore.getState().open;
  opensAt = null;
  write({ fm: 1, i: push ? cur.i + 1 : cur.i, v, s, l: push ? 0 : cur.l }, push);
}

/** A view says which screen it shows (on mount, a result, a correction): the entry is rewritten. */
export function notePlace(v: ViewMode, s: string): void {
  if (tourPlaying()) return;
  if (holding) {
    held.push(() => notePlace(v, s));
    return;
  }
  if (cur.v !== v || cur.s === s) return;
  write({ ...cur, s }, false);
}

/**
 * The app's own way back to screen `s` of view `v` (← arrows, breadcrumbs,
 * ✕ Exit, Drill's Back): Back to the nearest earlier entry of this view, in
 * an unbroken run of entries this tab knows, that names that screen; else the
 * entry is rewritten. The view shows the screen itself; the traversal only
 * moves the history under it.
 */
export function backTo(v: ViewMode, s: string): void {
  if (tourPlaying() || restoring) return;
  if (holding) {
    held.push(() => backTo(v, s));
    return;
  }
  for (let j = cur.i - 1; j >= 0; j--) {
    const k = known.get(j);
    if (!k || k.v !== v) break;
    if (k.s === s) {
      opensAt = null;
      dropKeptToast();
      expecting = j;
      hold();
      window.history.go(j - cur.i);
      return;
    }
  }
  notePlace(v, s);
}

/** The screen a view opens at as it mounts (a reload, Back / Forward into it); undefined = its own choice. Pure: an initializer may call it. */
export function placeToOpen(v: ViewMode): string | undefined {
  return opensAt === cur.i && cur.v === v ? cur.s : undefined;
}

/**
 * A view shows the screens Back / Forward (and its active tab) ask for while
 * it is mounted; `undefined` = as its tab would show it.
 */
export function useShowPlace(v: ViewMode, show: (s: string | undefined, dir: Dir) => void): void {
  const ref = useRef(show);
  useEffect(() => {
    ref.current = show;
  });
  useEffect(() => {
    const fn = (s: string | undefined, dir: Dir) => ref.current(s, dir);
    shows.set(v, fn);
    return () => {
      if (shows.get(v) === fn) shows.delete(v);
    };
  }, [v]);
}

/**
 * A view holding work in progress (a check under way, a Drill session with
 * answers, a Sprint with time left) says, when Back or Forward (or its active
 * tab) leaves it for `to`, what is kept — or null when there is nothing to
 * say (`to` shows the work itself, or nothing was answered). It may put the
 * work away there.
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

/** The work left says it is kept: a toast whose Continue goes back the way the learner came (`back` entries). */
function offerReturn(message: string, back: number): void {
  keptToast = useToastStore.getState().addToast({
    type: 'info',
    message,
    duration: 8000,
    action: { label: i18n.t('backNav.continue'), onSelect: () => window.history.go(back) },
  });
}

/** Drop the layers that went without telling. */
function prune(): void {
  for (let k = layers.length - 1; k >= 0; k--) if (layers[k].live && !layers[k].live!()) layers.splice(k, 1);
}

/** One entry per layer above what the entry on screen covers; one closed by its own control left its entry, which this reuses. */
function pushForLayers(tour: boolean): void {
  if (layers.length > cur.l && armed && !restoring && (tour || !tourPlaying())) {
    write({ ...cur, i: cur.i + 1, l: layers.length }, true);
  }
}

function openLayer(layer: Layer): void {
  prune();
  layers.push(layer);
  if (holding) held.push(() => pushForLayers(layer.tour));
  else pushForLayers(layer.tour);
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
      const follow = () => {
        const view = useAppStore.getState().view;
        if (cur.v !== view && !tourPlaying()) write({ ...cur, v: view, s: undefined }, false);
      };
      if (holding) held.push(follow);
      else follow();
    };
  }, [open, tour]);
}

/** The same screen: the view and the screen inside it, exactly (an entry with no screen named is no screen of the view shown). */
function same(to: HistoryEntry, from: HistoryEntry): boolean {
  return to.v === from.v && to.s === from.s;
}

/** After Back / Forward changed the screen: focus to its heading in the main region, as a screen is met fresh (a screen reader reads its name). */
function focusScreen(view: ViewMode): void {
  let tries = 0;
  // Focus still where it was (the old screen, fading out) or on the page body is lost focus; anywhere new, the learner (or a sheet giving focus back) put it.
  const before = document.activeElement;
  const look = () => {
    const active = document.activeElement;
    if (active && active !== before && active !== document.body && active.isConnected) return;
    const panel = document.getElementById(`${view}-panel`);
    const heading = panel && [...panel.querySelectorAll<HTMLElement>('h1, h2')].find((h) => !h.closest('[inert]'));
    if (!heading) {
      if (++tries < 120) requestAnimationFrame(look);
      else document.getElementById('main-content')?.focus({ preventScroll: true });
      return;
    }
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  };
  requestAnimationFrame(look);
}

function show(to: HistoryEntry, dir: Dir): void {
  restoring = true;
  try {
    const app = useAppStore.getState();
    opensAt = to.i;
    if (app.view !== to.v) {
      app.setView(to.v);
      if (to.v === 'explore') bringExploreBack(to.i);
    } else {
      shows.get(to.v)?.(to.s, dir);
    }
  } finally {
    restoring = false;
  }
}

/**
 * An entry the app did not write, met (a fragment link pushed it; a library;
 * one written before this module loaded): rewritten as ours, a copy of the
 * screen shown under the next index, with the address kept at `/`. Whatever
 * the app writes next lands on it as its own (before, a view's report wrote
 * our state, with a duplicate index, onto it: review A1).
 */
function adoptForeign(): void {
  if (isHistoryEntry(window.history.state)) return;
  for (const k of [...known.keys()]) if (k > cur.i) known.delete(k);
  cur = { ...cur, i: cur.i + 1 };
  known.set(cur.i, { v: cur.v, s: cur.s });
  try {
    window.history.replaceState(cur, '', window.location.pathname + window.location.search);
  } catch {
    // A browser that refuses: the entry stays foreign, which the equal-index rule makes safe.
  }
}

function onPopState(e: PopStateEvent): void {
  armed = false;
  if (!isHistoryEntry(e.state)) {
    adoptForeign();
    return;
  }
  const to = e.state;
  const from = cur;
  known.set(to.i, { v: to.v, s: to.s });
  if (expecting !== null && to.i === expecting) {
    // Our own traversal landed.
    expecting = null;
    cur = to;
    release();
    return;
  }
  expecting = null;
  if (to.i === from.i) {
    // Back onto ours from an entry the app did not write: where the app already is.
    cur = to;
    release();
    if (!same(to, from)) show(to, -1);
    return;
  }
  const dir: Dir = to.i < from.i ? -1 : 1;
  // Sheets, dialogs and menus first, the top one first, as Escape does.
  prune();
  const extra = layers.length - to.l;
  if (dir < 0 && extra > 0) {
    for (const layer of layers.slice(-extra).reverse()) layer.close();
    if (same(to, from)) {
      cur = to;
      release();
    } else {
      // The layer had no entry of its own: stay where it was.
      expecting = from.i;
      hold();
      window.history.go(from.i - to.i);
    }
    return;
  }
  // Nothing new to show: on, in the same direction (at the first entry Back
  // leaves the app). Forward only onto an entry this tab knows is there: one
  // that goes nowhere would hold every write until a timeout (a sheet opened
  // meanwhile got no entry, and the next Back closed two).
  if (same(to, from)) {
    cur = to;
    if (dir > 0 && !known.has(to.i + 1)) {
      release();
      return;
    }
    hold();
    window.history.go(dir);
    return;
  }
  const kept = keepers.get(from.v)?.(to) ?? null;
  if (from.v === 'explore' && to.v !== 'explore') noteExploreLeft(from.i, useAppStore.getState());
  cur = to;
  dropKeptToast();
  show(to, dir);
  release();
  if (kept) offerReturn(kept, -dir);
  focusScreen(to.v);
}

/**
 * Tapping the tab of the view already shown (P10): its first screen — Drill's
 * question, intro or summary; Learn's overview — as a screen of its own (Back
 * returns), through the same keepers as Back out of work under way. Read in
 * the capture phase, before the tab's own handler: it is the tab that WAS
 * selected.
 */
function onTabClick(e: MouseEvent): void {
  const tab = e.target instanceof Element ? e.target.closest('[role="tab"][data-tab]') : null;
  if (!tab || tab.getAttribute('aria-selected') !== 'true' || tourPlaying()) return;
  const v = tab.getAttribute('data-tab') as ViewMode;
  if (v === 'explore' || cur.v !== v || cur.s === '' || !shows.has(v)) return;
  const to: HistoryEntry = { ...cur, i: cur.i + 1, s: '', l: 0 };
  const kept = keepers.get(v)?.(to) ?? null;
  goTo(v, '');
  shows.get(v)?.('', -1);
  if (kept) offerReturn(kept, -1);
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

/**
 * A fragment link (the skip link's old form, or any other `href="#…"`) adds
 * an entry with no state of ours: it is rewritten as a copy of the screen it
 * shows, under the next index, and the address keeps no fragment (`/`). A
 * fragment met by Back / Forward (one written before this module loaded) is
 * left alone.
 */
function onHashChange(): void {
  adoptForeign();
}

/** Keys that are never an activation of their own, or are the browser's (Escape; with Ctrl, Alt or Meta, a shortcut). */
const NOT_ACTIVATING = new Set(['Escape', 'Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'OS', 'CapsLock', 'NumLock', 'ScrollLock', 'Fn', 'FnLock', 'Hyper', 'Super', 'Symbol', 'SymbolLock', 'Dead', 'Unidentified', 'Process']);

/**
 * What arms a push: the HTML Standard's "activation triggering input event"
 * (html.spec.whatwg.org/multipage/interaction.html#user-activation-processing-model:
 * trusted keydown "provided the key is neither the Esc key nor a shortcut key
 * reserved by the user agent", mousedown, pointerdown for a mouse, pointerup
 * for anything else, touchend) — and of those, less (if in doubt, arm on
 * less: an entry pushed without an activation makes Chromium skip the whole
 * document, per the note cited above): no modifier key alone, no key with
 * Ctrl / Alt / Meta (the browser's shortcuts, Back among them), and no
 * touchend (it also ends a scroll; a tap's pointerup is enough).
 */
export function activates(e: { isTrusted: boolean; type: string; key?: string; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean; pointerType?: string }): boolean {
  if (!e.isTrusted) return false;
  if (e.type === 'keydown') return !(NOT_ACTIVATING.has(e.key ?? '') || e.ctrlKey || e.altKey || e.metaKey);
  if (e.type === 'mousedown') return true;
  return e.type === 'pointerup' && e.pointerType !== 'mouse';
}

function arm(e: Event): void {
  if (activates(e as Event & { key?: string; pointerType?: string })) armed = true;
}

/** Back from another site into a page the browser kept whole (the back/forward cache: MDN, Window: pageshow event, `persisted`): a traversal, as above. A normal load arms nothing. */
export function onPageShow(e: PageTransitionEvent): void {
  if (e.persisted) armed = false;
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
  window.addEventListener('hashchange', onHashChange);
  window.addEventListener('pageshow', onPageShow);
  for (const type of ['keydown', 'mousedown', 'pointerup']) window.addEventListener(type, arm, true);
  document.addEventListener('click', onTabClick, true);
  document.addEventListener('click', onMenuButton, true);
  document.addEventListener('keydown', onMenuButton, true);
  useAppStore.subscribe((state, prev) => {
    const target = state.pendingLearnTarget;
    const deep = target !== null && target !== prev.pendingLearnTarget;
    if (state.view === prev.view && !deep) return;
    if (prev.view === 'explore' && state.view !== 'explore' && !restoring) noteExploreLeft(cur.i, prev);
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
  known.clear();
  exploreLeft.clear();
  opensAt = null;
  keptToast = null;
  holding = false;
  clearTimeout(holdTimer);
  held.length = 0;
}

/** Test seam: a user activation (jsdom's events are never trusted). */
export function armForTests(on = true): void {
  armed = on;
}

/** Test seam: armed now? */
export function isArmedForTests(): boolean {
  return armed;
}

installAppHistory();
