/**
 * The saved stores whose memory follows the other tabs (audit A1,
 * 2026-11-18): Learn progress, Drill, guitar fingerings — loaded with them,
 * never with the entry (state/tabSafe.ts is the part every store shares).
 *
 * 1. Rules for writing this tab's changes on top of another tab's
 *    (`ruleMerge`): a node this tab did not change keeps the other tab's
 *    value; a node only this tab changed takes this tab's; where both changed
 *    the same node, its rule decides — lists of ids are sets (both tabs'
 *    additions and removals apply: a task ticked in each tab stays ticked),
 *    counters add both tabs' increments, "passed" stays passed, a best stays
 *    the best, and anything else takes this tab's (its latest action).
 *
 * 2. Following (`followOtherTabs`): when another tab writes the key (a
 *    `storage` event), or this tab comes back to the screen or out of the
 *    back/forward cache (an event missed while frozen), the store reads the
 *    save again through its OWN migration and guard, without writing, so what
 *    the learner sees here is what is saved. Fields named `keep` stay this
 *    tab's (Drill's session and Sprint under way: another tab's never replace
 *    the one on screen here, as drillWork promises). A save in a newer
 *    version than this code knows is not read (and, by tabSafe, not written).
 */
import type { StoreApi } from 'zustand';
import type { PersistOptions } from 'zustand/middleware';
import { same, savedNow, tabLine, type TabMerge } from './tabSafe';

export type Rule = 'set' | 'sum' | 'max' | 'or' | 'atomic' | { [key: string]: Rule } | ((b: unknown, m: unknown, t: unknown) => unknown);

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const strings = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Three-way merge of one node: base (this tab's last saved), mine (now), theirs (in storage now). */
export function mergeBy(rule: Rule, b: unknown, m: unknown, t: unknown): unknown {
  if (same(b, m)) return t;
  if (same(b, t)) return m;
  if (typeof rule === 'function') return rule(b, m, t);
  if (rule === 'atomic') return m;
  if (m === undefined) return undefined; // this tab removed the node
  if (rule === 'set') {
    const was = strings(b);
    const now = strings(m);
    const out = strings(t).filter((x) => !(was.includes(x) && !now.includes(x)));
    for (const x of now) if (!was.includes(x) && !out.includes(x)) out.push(x);
    return out;
  }
  // Counters only grow, except by a reset here, which wins (never below what this tab now says).
  if (rule === 'sum') return num(m) < num(b) ? m : num(t) + num(m) - num(b);
  if (rule === 'max') return Math.max(num(t), num(m));
  if (rule === 'or') return t === true || m === true;
  if (!isObj(m) || !isObj(t)) return m;
  const bo = isObj(b) ? b : {};
  const out: Record<string, unknown> = {};
  for (const k of new Set([...Object.keys(t), ...Object.keys(m), ...Object.keys(bo)])) {
    // Own keys only: a saved id such as "constructor" must never pick up an inherited member as its rule.
    const v = mergeBy((Object.hasOwn(rule, k) ? rule[k] : rule['*']) ?? 'atomic', bo[k], m[k], t[k]);
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export const ruleMerge = (rule: Rule): TabMerge => (b, m, t) => mergeBy(rule, b, m, t);

/** A persisted zustand store, as `persist` makes it. */
type Followed<S> = StoreApi<S> & {
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
  const adopt = () => {
    const current = localStorage.getItem(name);
    if (current === line.seen && !line.behind) return;
    const opts = store.persist.getOptions();
    let version: unknown;
    try {
      version = current === null ? undefined : (JSON.parse(current) as { version?: unknown }).version;
    } catch {
      return; // not a save: this tab's next write replaces it, as before
    }
    if (typeof version === 'number' && version > (opts.version ?? 0)) return; // a newer Fermatina's save
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
  return stop;
}
