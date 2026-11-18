/**
 * Saving with more than one tab open (audit A1, 2026-11-18).
 *
 * Every saved store lives in localStorage, which all the app's tabs in a
 * browser share, and zustand's persist writes a tab's WHOLE saved state on
 * every change. Until this fix a tab holding older memory erased what another
 * tab had saved since (a task ticked in one tab, another task in a second:
 * the first tick gone). This is the storage every persisted store writes
 * through (`createJSONStorage(() => tabSafeStorage(name, () => store, rule?))`):
 *
 *  - It remembers the text it last read or wrote for its key (`seen`) and the
 *    saved state that stood for in this tab (`base`).
 *  - When nobody else has written since, a write is exactly today's write,
 *    byte for byte (the frozen-save tests prove it). That is all this module
 *    does, so it stays small: it is in the entry bundle, with the settings.
 *  - When the save changed underneath (another tab, or a direct write in
 *    this one: an import, a reset), the write goes to `state/tabMerge.ts`
 *    (lazy; loading starts with this module), which writes only THIS tab's
 *    changes on top of what is there now — nothing back from the dead, never
 *    over a newer version (see there). In the first moments of a page,
 *    before that chunk has arrived, such a write waits in memory and is made
 *    as soon as it has: never dropped, never written whole over the other.
 */
import type { StateStorage } from 'zustand/middleware';
import type { Rule } from './tabMerge';

/** What the tab-safe storage needs of a persisted store. */
export interface TabStore {
  getState: () => object;
  setState: (s: object) => void;
  getInitialState: () => object;
  persist: {
    getOptions: () => {
      partialize?: (s: never) => unknown;
      migrate?: (s: unknown, v: number) => unknown;
      merge?: (persisted: unknown, current: never) => unknown;
      version?: number;
    };
  };
}

export interface TabLine {
  /** The text this tab last read or wrote for the key (every store reads at creation). */
  seen?: string | null;
  /** This tab's saved state at that moment; undefined = the state `seen` holds. */
  base?: unknown;
  /** Read and not written since: memory saved what the read gave, through the store's own guard (tabMerge's `baseOf`). */
  fresh?: boolean;
  /** Memory lacks something the save holds: every write merges. */
  behind?: boolean;
  /** A write is waiting for state/tabMerge.ts. */
  waits?: boolean;
  /** The store's own merge rules (absent: each top-level field this tab changed wins). */
  merge?: Rule;
  /** The store (a getter: the storage exists before the store does). */
  store?: () => TabStore;
  /** Set by state/tabSync.ts for stores whose memory follows the save. */
  adopt?: () => void;
  /** Stops following (tests). */
  stop?: () => void;
}

const lines = new Map<string, TabLine>();
export const tabLine = (name: string) => lines.get(name);

let merging: typeof import('./tabMerge') | undefined;

/** The storage a persisted store writes through (see above). One per key. */
export function tabSafeStorage(name: string, store: () => TabStore, merge?: Rule): StateStorage {
  const line: TabLine = { store, merge };
  lines.set(name, line);
  return {
    // A read (hydration, or following another tab) puts memory and the save in step again.
    getItem: (key) => {
      line.base = undefined;
      line.behind = false;
      line.fresh = true;
      return (line.seen = localStorage.getItem(key));
    },
    setItem: (key, raw) => {
      if (localStorage.getItem(key) === line.seen && !line.behind) {
        localStorage.setItem(key, raw);
        line.seen = raw;
        line.base = undefined;
        line.fresh = false;
      } else if (merging) merging.mergeWrite(key, line, raw);
      else line.waits = true;
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
      line.seen = null;
    },
  };
}

// The merging write (state/tabMerge.ts) arrives; a write that waited for it is made now.
void import('./tabMerge').then((m) => {
  merging = m;
  for (const line of lines.values()) {
    if (line.waits) {
      line.waits = false;
      line.store?.().setState({});
    }
  }
});
