/**
 * Saving with more than one tab open (audit A1, 2026-11-18; fix pass
 * 2026-11-19).
 *
 * Every saved store lives in localStorage, which all the app's tabs in a
 * browser share, and zustand's persist writes a tab's WHOLE saved state on
 * every change. Until this fix a tab holding older memory erased what another
 * tab had saved since (a task ticked in one tab, another task in a second:
 * the first tick gone). This is the storage every persisted store writes
 * through (`createJSONStorage(() => tabSafeStorage(name, () => store, rule?, valid?))`):
 *
 *  - It remembers the text it last read or wrote for its key (`seen`) and the
 *    saved state that stood for in this tab (`base`).
 *  - When nobody else has written since, a write is exactly today's write,
 *    byte for byte (the frozen-save tests prove it).
 *  - When the save changed underneath (another tab, or a direct write in
 *    this one: an import, a reset), the write goes to `state/tabMerge.ts`,
 *    which writes only THIS tab's changes on top of what is saved now, by
 *    the one rule stated there (both ways: nothing removed comes back,
 *    nothing this tab removes survives). Both modules are in the entry
 *    bundle: writing never waits for, or depends on, a second download.
 *  - A store says what it can read (`valid`, asked of a save as saved, in
 *    its version), and an action marks what its write does on purpose,
 *    whatever the save holds (`markNext`: Drill's resets, "Reset to
 *    suggested", the score just recorded, a Sprint just finished).
 *  - Following other tabs in memory (Learn progress, Drill, fingerings) is
 *    `state/tabSync.ts`, lazy, which each of those stores loads itself
 *    (`followSoon` in state/tabFollow.ts): a nicety, not needed to save. A failed
 *    download of it costs nothing and is tried again when the page is shown
 *    again or comes back online.
 */
import type { StateStorage } from 'zustand/middleware';
import { mergeWrite, type Rule } from './tabMerge';

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
  /** The store's own merge rules (absent: every record field by field). */
  merge?: Rule;
  /** The store can read this save, as saved in `version` (before any migration), as real data (absent: any object). */
  valid?: (state: unknown, version: number) => boolean;
  /** What this tab's next write does on purpose, whatever the save holds (tabMerge): set by the action, cleared by any write. */
  marks?: Mark[];
  /** The store (a getter: the storage exists before the store does). */
  store?: () => TabStore;
  /** Set by state/tabSync.ts for stores whose memory follows the save. */
  adopt?: () => void;
  /** Stops following (tests). */
  stop?: () => void;
}

/** A leaf this action sets or removes on purpose (a reset, "Reset to suggested", the score just recorded): its path, and what the merged value there becomes (undefined: removed). */
export type Mark = [path: string[], to: (merged: unknown) => unknown];

const lines = new Map<string, TabLine>();
export const tabLine = (name: string) => lines.get(name);
/** Marks for the write the action about to run makes. */
export const markNext = (name: string, ...marks: Mark[]) => {
  const line = lines.get(name);
  if (line) line.marks = marks;
};

/** The storage a persisted store writes through (see above). One per key. */
export function tabSafeStorage(name: string, store: () => TabStore, merge?: Rule, valid?: TabLine['valid']): StateStorage {
  const line: TabLine = { store, merge, valid };
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
        line.marks = undefined; // before writing: a refused write never leaves them to the next one
        localStorage.setItem(key, raw);
        line.seen = raw;
        line.base = undefined;
        line.fresh = false;
      } else mergeWrite(key, line, raw);
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
      line.seen = null;
    },
  };
}
