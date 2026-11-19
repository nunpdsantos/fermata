/**
 * The saved stores whose memory follows the other tabs (audit A1,
 * 2026-11-18): Learn progress, Drill, guitar fingerings — each loads this
 * with itself, never with the entry. (state/tabSafe.ts is the storage every
 * store writes through; state/tabMerge.ts the write after another tab
 * changed a save. The settings and Learn's open lesson do not follow: a tab
 * keeps what it shows and only writes what it changed.)
 *
 * When another tab writes the key (a `storage` event), or this tab comes
 * back to the screen or out of the back/forward cache (an event missed while
 * frozen), or once when this module arrives (an event missed while it
 * downloaded), the store reads the save again through its OWN migration and
 * guard, without writing, so what the learner sees here is what is saved. A
 * save the store cannot read as real data (`valid`) is never read.
 * Fields named `keep` stay this tab's (Drill's session and Sprint under way:
 * another tab's never replace the one on screen here, as drillWork
 * promises). A save in a newer version than this code knows is not read.
 */
import type { StoreApi } from 'zustand';
import type { PersistOptions } from 'zustand/middleware';
import { tabLine } from './tabSafe';
import { savedNow } from './tabMerge';

const isObj = (v: unknown) => typeof v === 'object' && v !== null && !Array.isArray(v);

/** A persisted zustand store, as `persist` makes it. */
export type Followed<S> = StoreApi<S> & {
  getInitialState: () => S;
  persist: {
    getOptions: () => Partial<PersistOptions<S, unknown>>;
    setOptions: (options: Partial<PersistOptions<S, unknown>>) => void;
    rehydrate: () => Promise<void> | void;
  };
};

/** Follow other tabs' writes of `name` in this store's memory (see above). Returns a stop function. */
export function followOtherTabs<S extends object>(name: string, store: Followed<S>, keep: readonly (keyof S)[] = []): () => void {
  const line = tabLine(name);
  if (!line || typeof window === 'undefined') return () => {};
  line.stop?.(); // once per store: a retried download never follows twice
  const adopt = () => {
    const current = localStorage.getItem(name);
    if (current === line.seen && !line.behind) return;
    const opts = store.persist.getOptions();
    let saved: { state?: unknown; version?: unknown } | undefined;
    try {
      saved = current === null ? undefined : JSON.parse(current);
    } catch {
      saved = undefined;
    }
    if (current !== null) {
      const version = saved?.version;
      if (typeof version === 'number' && version > (opts.version ?? 0)) return; // a newer Fermatina's save
      // Only a save the store can read as real data replaces this tab's memory — asked of the
      // save as it is, in its own version, BEFORE any migration (second fix pass, 2026-11-19:
      // a migration answers garbage with the defaults, which every guard accepts, and an older
      // broken save emptied memory). Otherwise memory stays, and this tab's next write heals it.
      if (typeof version !== 'number' || !(line.valid ?? isObj)(saved?.state, version)) {
        line.behind = true;
        return;
      }
    }
    const merge = opts.merge ?? ((p: unknown, c: S) => ({ ...c, ...(p as object) }));
    const mem = store.getState();
    store.persist.setOptions({
      merge: (p, c) => {
        const next = merge(p, c);
        // A removed save (Reset app data) resets everything, this tab's session too.
        if (current !== null) for (const k of keep) next[k] = mem[k];
        return next;
      },
    });
    try {
      store.persist.rehydrate();
    } finally {
      store.persist.setOptions({ merge });
    }
    line.base = savedNow(store);
    line.behind = JSON.stringify({ state: line.base, version: opts.version }) !== localStorage.getItem(name);
  };
  line.adopt = adopt;
  const onStorage = (e: StorageEvent) => {
    if (e.key === name || e.key === null) adopt();
  };
  const onShown = () => {
    if (document.visibilityState === 'visible') adopt();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener('pageshow', adopt);
  document.addEventListener('visibilitychange', onShown);
  const stop = () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('pageshow', adopt);
    document.removeEventListener('visibilitychange', onShown);
    if (line.adopt === adopt) line.adopt = undefined;
  };
  line.stop = stop;
  // What another tab saved while this module was downloading (its event came before
  // anyone listened): read it now. Nothing to do when the save is what this tab saw.
  adopt();
  return stop;
}
