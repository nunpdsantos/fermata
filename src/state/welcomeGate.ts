import { create } from 'zustand';

/**
 * The first-visit welcome (2026-11-09): a short sheet that says what Explore,
 * Learn and Drill are. Shown to someone with NO saved state only, until they
 * close it or pick one of its actions; then never again.
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
 *               settings)
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

/** Should the welcome show, judged from storage as it is at boot? */
export function shouldShowWelcome(storage: ReadableStorage): boolean {
  const flag = storage.getItem(WELCOME_KEY);
  if (flag === 'seen') return false;
  if (flag === 'pending') return true;
  return !hasSavedAppData(storage);
}

interface WelcomeState {
  /** The sheet is up. */
  open: boolean;
  /** The welcome was shown in this page (the offline-ready notice is skipped — PWAPrompts). */
  shownThisPage: boolean;
}

export const useWelcomeStore = create<WelcomeState>(() => ({ open: false, shownThisPage: false }));

/** Decide once, at boot (state/welcomeBoot.ts). Storage errors: no welcome. */
export function bootWelcome(storage: Storage | undefined = globalThis.localStorage): boolean {
  let show = false;
  try {
    show = !!storage && shouldShowWelcome(storage);
    if (show) storage!.setItem(WELCOME_KEY, 'pending');
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
