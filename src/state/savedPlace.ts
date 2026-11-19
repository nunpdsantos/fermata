/**
 * Where the app comes back after a reload that REPLACES or RESETS the
 * learner's save. Back and Forward keep this tab's place in its history
 * entry, across a reload (state/appHistory.ts), and the boot view prefers that
 * entry to the saved last view (state/bootView.ts) — right for a plain reload
 * or an update's, which must land where the learner was; wrong when the save
 * itself has just been replaced: an import must open where the IMPORTED save
 * was (review of the merged branch, 19 November 2026: a file brought in from
 * the start screen opened Explore, the start screen's entry, not the
 * learner's Learn), and a reset where a fresh start puts it.
 *
 * Both also forget this tab's record of its entries (sessionStorage
 * `fermatina-history-v1`), so no entry written before can come back through
 * it as a place the app's own ← goes Back to.
 *
 * Imports nothing: the error screen is in the entry bundle.
 */

/** This tab's record of its entries (written and read by state/appHistory.ts). */
export const HISTORY_RECORD_KEY = 'fermatina-history-v1';

function forgetRecord(): void {
  try {
    sessionStorage.removeItem(HISTORY_RECORD_KEY);
  } catch {
    // Storage refused: the record is checked against the entry before it is used.
  }
}

/** A reset: the entry names no place at all, so the app opens where a fresh start does. */
export function forgetPlace(): void {
  try {
    window.history.replaceState(null, '');
  } catch {
    // Nothing to forget.
  }
  forgetRecord();
}

const VIEWS = ['explore', 'learn', 'drill'];

/**
 * An import: the entry keeps its position (Back still steps back from it) but
 * names the imported save's view and no screen in it — the view then opens as
 * its tab would, from that save (Learn its open lesson, Drill its Sprint).
 */
export function placeFromSave(storage: Pick<Storage, 'getItem'>): void {
  let view = 'explore';
  try {
    const saved = JSON.parse(storage.getItem('music-theory-app') ?? 'null') as { state?: { lastView?: unknown } } | null;
    if (VIEWS.includes(saved?.state?.lastView as string)) view = saved!.state!.lastView as string;
  } catch {
    // An unreadable save: the default view.
  }
  try {
    const entry = window.history.state as { fm?: unknown; i?: unknown } | null;
    if (entry && entry.fm === 1 && Number.isInteger(entry.i)) window.history.replaceState({ fm: 1, i: entry.i, v: view, l: 0 }, '');
    else window.history.replaceState(null, '');
  } catch {
    // A browser that refuses: the entry's view wins after the reload, as before.
  }
  forgetRecord();
}
