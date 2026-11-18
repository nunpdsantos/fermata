/**
 * Saving with more than one tab open (audit A1, 2026-11-18).
 *
 * Every saved store lives in localStorage, which all the app's tabs in a
 * browser share, and zustand's persist writes a tab's WHOLE saved state on
 * every change. Until this fix a tab holding older memory erased what another
 * tab had saved since (a task ticked in one tab, another task in a second:
 * the first tick gone). This is the storage every persisted store writes
 * through (`createJSONStorage(() => tabSafeStorage(name, merge))`):
 *
 *  - It remembers the text it last read or wrote for its key (`seen`) and the
 *    saved state that text stood for in this tab (`base`).
 *  - When nobody else has written since, a write is exactly today's write,
 *    byte for byte (the frozen-save tests prove it).
 *  - When the save changed underneath (another tab, or a direct write in
 *    this one: an import, a reset), only THIS tab's changes since `base` are
 *    written on top of what is there now (`merge(base, mine, theirs)`; a store
 *    passes its own rules, the default being "each top-level field this tab
 *    changed wins, the others are kept"). A tab that changed nothing writes
 *    nothing.
 *  - Nothing comes back from the dead: a save that was removed (Reset app
 *    data) counts as the store's defaults, so only this tab's new change is
 *    written on them; an imported one is merged into the same way; a save
 *    in an OLDER version (an older tab wrote it) is first migrated with the
 *    store's own migration; and a save in a NEWER version (another tab runs
 *    a newer Fermatina, which already migrated it) is never written over:
 *    this tab's change is dropped instead (that tab also shows "Reload to
 *    finish updating" once the new version took over).
 *  - A tab woken from the background with old memory is covered by the same
 *    rule: its first write sees that the save changed.
 *
 * Stores whose memory should follow the other tabs (Learn progress, Drill,
 * fingerings) also follow storage events (`state/tabSync.ts`, lazy). The
 * settings and Learn's open lesson do not: a tab keeps what it shows, and
 * only writes what it changed.
 */
import type { StateStorage } from 'zustand/middleware';

export type TabMerge = (base: unknown, mine: unknown, theirs: unknown) => unknown;

/** Equal as saved (both sides come from the same code, so key order matches). */
export const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const parse = (raw: string | null): unknown => {
  try {
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
};

/** Each top-level field this tab changed (or removed) wins; every other field is kept as saved. */
export const fieldMerge: TabMerge = (base, mine, theirs) => {
  const b = isObj(base) ? base : {};
  const m = isObj(mine) ? mine : {};
  const out: Record<string, unknown> = { ...(isObj(theirs) ? theirs : {}) };
  for (const k of new Set([...Object.keys(b), ...Object.keys(m)])) {
    if (same(b[k], m[k])) continue;
    if (k in m) out[k] = m[k];
    else delete out[k];
  }
  return out;
};

interface PersistApi {
  getState: () => object;
  getInitialState: () => object;
  persist: { getOptions: () => { partialize?: (s: never) => unknown; migrate?: (s: unknown, v: number) => unknown; version?: number } };
}

export interface TabLine {
  /** The text this tab last read or wrote for the key; undefined = never read. */
  seen?: string | null;
  /** This tab's saved state at that moment, or (undefined) the state `seen` holds, read when needed. */
  base?: unknown;
  /** Memory lacks something the save holds: every write merges. */
  behind?: boolean;
  merge: TabMerge;
  store?: PersistApi;
  /** Set by state/tabSync.ts for stores whose memory follows the save. */
  adopt?: () => void;
  /** Stops following (tests). */
  stop?: () => void;
}

const lines = new Map<string, TabLine>();
export const tabLine = (name: string) => lines.get(name);

/** What this tab's memory saves now (the store's partialize), as plain JSON. */
export const savedNow = (store: PersistApi): unknown =>
  JSON.parse(JSON.stringify((store.persist.getOptions().partialize ?? ((s: unknown) => s))(store.getState() as never)) ?? 'null');

const stateOf = (raw: string | null | undefined): unknown => (parse(raw ?? null) as { state?: unknown } | undefined)?.state;

function write(name: string, line: TabLine, raw: string): void {
  const current = localStorage.getItem(name);
  if (line.seen === undefined || (current === line.seen && !line.behind)) {
    localStorage.setItem(name, raw);
    line.seen = raw;
    line.base = undefined;
    return;
  }
  const mine = JSON.parse(raw) as { state: unknown; version: number };
  const base = line.base === undefined ? stateOf(line.seen) : line.base;
  if (same(mine.state, base)) return; // nothing of this tab's to save
  const env = parse(current) as { state?: unknown; version?: unknown } | undefined;
  const opts = line.store?.persist.getOptions();
  let theirs: unknown;
  if (current === null) {
    // Removed since (Reset app data): this tab's change goes on the defaults, never its old data.
    theirs = line.store ? JSON.parse(JSON.stringify((opts!.partialize ?? ((s: unknown) => s))(line.store.getInitialState() as never))) : {};
  } else if (!isObj(env) || typeof env.version !== 'number') {
    theirs = undefined; // not a save at all: written over, as before
  } else if (env.version > mine.version) {
    return; // a newer Fermatina migrated this save: never write older data over it
  } else {
    theirs = env.version < mine.version && opts?.migrate ? opts.migrate(env.state, env.version) : env.state;
  }
  const out = theirs === undefined ? raw : JSON.stringify({ state: line.merge(base, mine.state, theirs), version: mine.version });
  localStorage.setItem(name, out);
  line.seen = out;
  line.base = mine.state;
  line.behind = out !== raw;
  if (line.behind) line.adopt?.();
}

/** The storage a persisted store writes through (see above). One per key. */
export function tabSafeStorage(name: string, merge: TabMerge = fieldMerge): StateStorage {
  const line: TabLine = lines.get(name) ?? { merge };
  line.merge = merge;
  lines.set(name, line);
  return {
    getItem: (key) => {
      const raw = localStorage.getItem(key);
      line.seen = raw;
      line.base = undefined;
      line.behind = false;
      return raw;
    },
    setItem: (key, value) => write(key, line, value),
    removeItem: (key) => {
      localStorage.removeItem(key);
      line.seen = null;
      line.base = undefined;
      line.behind = false;
    },
  };
}

/**
 * Once the store exists: its defaults and migration are known, and `base`
 * becomes what its memory saves (its own guard may have cleaned the save it read).
 */
export function bindTabSafe(name: string, store: PersistApi): void {
  const line = lines.get(name);
  if (!line) return;
  line.store = store;
  line.base = savedNow(store);
}
