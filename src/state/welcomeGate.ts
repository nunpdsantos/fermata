import { create } from 'zustand';

/**
 * The first-visit gate. Since wave 1 (2026-11-10) it opens the START SCREEN
 * (components/start/), a page of its own in place of the app, with three
 * doors (state/startDoors.ts) as the only ways out; before that (2026-11-09)
 * it opened a welcome sheet over Explore. Same flag, same rule: shown to
 * someone with NO saved state only, until they act on it; then never again.
 *
 * Why a boot snapshot: every persisted store writes on its first `set`, and
 * App's boot `setView` writes `music-theory-app` on the very first load. So
 * "has this browser saved anything?" is answered once, by `bootWelcome()`,
 * from `state/welcomeBoot.ts` — the FIRST import of main.tsx, before any store
 * module is evaluated. Nothing else calls it (unit tests that render the shell
 * never see the welcome unless they ask for it).
 *
 * The flag (`fermata-welcome-v1`):
 *   absent    → shown only if no app data exists; then set to 'pending'
 *   'pending' → shown (it was shown and nobody acted on it yet — a reload or a
 *               closed tab must not lose it, although boot has since saved
 *               settings) — unless learning data was saved since
 *               (`hasLearningData`: the app was used without a door, e.g.
 *               after a shared-link visit); then it is settled 'seen'
 *   'seen'    → never shown
 * Not in backups and not cleared by "Reset app data" (neither lists it).
 */
export const WELCOME_KEY = 'fermata-welcome-v1';

/**
 * Every app key starts with one of these: the persisted stores
 * `music-theory-app` (settings), `music-theory-progress` (Learn progress),
 * `fermata-drill-v1` (Drill), `fermata-fingering-v1` (guitar fingerings),
 * `fermata-learn-session-v1` (an open lesson / check), and the evicted legacy
 * `music-theory-gamification` / `music-theory-concept-tracking`. A future
 * store named the same way counts too (welcomeGate.test.ts scans the persist
 * names in src/).
 */
export const APP_KEY_PREFIXES = ['music-theory', 'fermata-'] as const;

type ReadableStorage = Pick<Storage, 'getItem' | 'length' | 'key'>;

/** Does this storage hold anything the app saved (other than the welcome flag)? */
export function hasSavedAppData(storage: ReadableStorage): boolean {
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key || key === WELCOME_KEY) continue;
    if (APP_KEY_PREFIXES.some((p) => key.startsWith(p))) return true;
  }
  return false;
}

/**
 * The settings store: boot writes it on every first load (App's `setView`),
 * so on its own it says nothing about whether the visitor has used the app.
 */
const SETTINGS_KEY = 'music-theory-app';

/** Learn's session store (state/learnSessionPersistence.ts; a literal: this module imports nothing). */
export const LEARN_SESSION_STORE_KEY = 'fermata-learn-session-v1';

/**
 * Learn saves `{ screen: null, check: null }` in its session store the first
 * time the tab is opened ("no lesson open", views/LearnView.tsx): opening a
 * tab is not using the app. Anything else under that key (a lesson, a check,
 * or a record that cannot be read) counts.
 */
function isEmptyLearnRecord(raw: string | null): boolean {
  if (raw === null) return false;
  try {
    const saved = JSON.parse(raw) as { state?: { screen?: unknown; check?: unknown } } | null;
    return !!saved?.state && saved.state.screen == null && saved.state.check == null;
  } catch {
    return false;
  }
}

/**
 * Has the visitor really used the app — anything saved beyond the settings
 * boot writes (Learn progress, Drill, fingerings, an open lesson, legacy
 * stores)? Those stores write only on the learner's own work, except Learn's
 * empty "no lesson open" record, which opening the tab writes and which does
 * not count (`isEmptyLearnRecord`).
 */
export function hasLearningData(storage: ReadableStorage): boolean {
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key || key === WELCOME_KEY || key === SETTINGS_KEY) continue;
    if (key === LEARN_SESSION_STORE_KEY && isEmptyLearnRecord(storage.getItem(key))) continue;
    if (APP_KEY_PREFIXES.some((p) => key.startsWith(p))) return true;
  }
  return false;
}

/** Should the welcome show, judged from storage as it is at boot? */
export function shouldShowWelcome(storage: ReadableStorage): boolean {
  const flag = storage.getItem(WELCOME_KEY);
  if (flag === 'seen') return false;
  // 'pending' survives a reload or a closed tab — but not real use since
  // (after a shared-link visit, the app was used without a door): that
  // visitor is a returning learner now and never gets the start screen.
  if (flag === 'pending') return !hasLearningData(storage);
  return !hasSavedAppData(storage);
}

interface WelcomeState {
  /** The sheet is up. */
  open: boolean;
  /** The welcome was shown in this page (the offline-ready notice is skipped — PWAPrompts). */
  shownThisPage: boolean;
}

export const useWelcomeStore = create<WelcomeState>(() => ({ open: false, shownThisPage: false }));

/**
 * Decide once, at boot (state/welcomeBoot.ts). Storage errors: no welcome.
 * This module imports nothing, so no store can load before the check. A
 * shared link in the address is not judged here: state/startGate.ts reads
 * the one answer (`openedFromShareLink()`, state/shareParams.ts).
 */
export function bootWelcome(storage: Storage | undefined = globalThis.localStorage): boolean {
  let show = false;
  try {
    show = !!storage && shouldShowWelcome(storage);
    if (show) storage!.setItem(WELCOME_KEY, 'pending');
    // Owed, but the visitor has been using the app since: settled for good
    // (also after "Reset app data", which does not clear this flag).
    else if (storage && storage.getItem(WELCOME_KEY) === 'pending') storage.setItem(WELCOME_KEY, 'seen');
  } catch {
    // Storage unavailable: a welcome that cannot remember being closed would
    // come back on every load — better none.
    show = false;
  }
  useWelcomeStore.setState({ open: show, shownThisPage: show });
  return show;
}

/** Closed or acted on: remember it, so it never returns. */
export function closeWelcome(storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(WELCOME_KEY, 'seen');
  } catch {
    // ignore — it still closes for this page
  }
  useWelcomeStore.setState({ open: false });
}
