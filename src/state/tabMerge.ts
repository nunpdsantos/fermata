/**
 * Saving with more than one tab open: the merging write (audit A1,
 * 2026-11-18; fix passes 2026-11-19). It runs when another tab (or a direct
 * write: an import, a reset) has changed a save since this tab last read or
 * wrote it. It is in the entry bundle with state/tabSafe.ts: a learner's
 * saved work never depends on a second download.
 *
 * THE RULE, both ways: after any write, the save holds exactly what one
 * learner's actions, in time order across all tabs, would have produced.
 * Every action writes at once, so what is saved now came BEFORE this tab's
 * change. A record one tab removed (a reset, a clear, an import that lacks
 * it) is gone, with whatever any tab did to it before; only changes made
 * after the removal, in any tab, are in the save — never a tab's older
 * memory of it. And a merged save is always one the store's own guard reads
 * back unchanged: never a shape the store could not have written itself.
 *
 * 1. The write (`mergeWrite`): only THIS tab's changes since `base` (its last
 *    read or write) are written on top of what is saved now, by the store's
 *    rules (2). A tab that changed nothing writes nothing. A save that was
 *    removed (Reset app data) counts as the store's defaults; an imported one
 *    is what is saved; a save in an OLDER version (an older tab wrote it) is
 *    first migrated with the store's own migration; a save in a NEWER version
 *    (another tab runs a newer Fermatina, which already migrated it) is never
 *    written over — this tab's change is dropped instead (that tab shows
 *    "Reload to finish updating" once the new version took over). A save the
 *    store cannot read as real data, in any version (`valid`, asked of the
 *    save as it is, before any migration: a migration answers garbage with
 *    the defaults), is broken and no one's work: this tab's memory is written
 *    whole over it. What an action does on purpose (`marks`: a reset, the
 *    keys "Reset to suggested" clears, the score an answer just recorded, a
 *    Sprint's best) is written so whatever the save holds; the marks belong
 *    to one write, saved or refused, and are written into that write's own
 *    copy of the merged state, never into an object it shares.
 *
 * 2. The rules (`mergeBy`, a store's `Rule`): a node this tab did not change
 *    keeps the saved value; a node only this tab changed takes this tab's;
 *    where both changed it, its rule decides — lists of ids are sets (both
 *    tabs' additions and removals apply), counters add this tab's increment,
 *    "passed" stays passed, a best stays the best, a record merges field by
 *    field, anything else takes this tab's value (its latest action); a node
 *    this tab removed is removed. A record the save no longer has gets ONLY
 *    this tab's changes since its base, on the record's empty form
 *    (`onEmpty`), and a record this tab did not have counts from that same
 *    empty form: a field still at the default it started from is no change.
 *    Without a rule (the settings' default, 'fields'), every record merges
 *    field by field.
 */
import type { TabLine } from './tabSafe';

/** How a node merges (2 above). */
export type Rule = 'set' | 'sum' | 'max' | 'or' | 'atomic' | 'fields' | { [key: string]: Rule } | ((b: unknown, m: unknown, t: unknown) => unknown);
type Store = ReturnType<NonNullable<TabLine['store']>>;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const strings = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const parse = (raw: string | null | undefined): { state?: unknown; version?: unknown } | undefined => {
  try {
    return raw == null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
};

/** Equal as saved (both sides come from the same code, so key order matches). */
export const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const asSaved = (store: Store, state: unknown): unknown =>
  JSON.parse(JSON.stringify((store.persist.getOptions().partialize ?? ((s: unknown) => s))(state as never)) ?? 'null');

/** What a store's memory (or, with `initial`, its defaults) saves, as plain JSON. */
export const savedNow = (store: Store, initial?: boolean): unknown => asSaved(store, initial ? store.getInitialState() : store.getState());

/** A saved state as the store reads it: through its own guard (`merge`) from its defaults, then saved again. */
export function readThrough(store: Store, state: unknown): unknown {
  const merge = store.persist.getOptions().merge;
  return asSaved(store, merge ? merge(state, store.getInitialState() as never) : { ...store.getInitialState(), ...(state as object) });
}

/** A record merges from its empty form where a side lacks it: the save (removed there) or this tab's base (new here). */
export const onEmpty = (empty: Record<string, unknown>, rule: Rule) => (b: unknown, m: unknown, t: unknown): unknown => mergeBy(rule, isObj(b) ? b : empty, m, isObj(t) ? t : empty);

/** Three-way merge of one node: base (this tab's last saved), mine (now), theirs (saved now). */
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
  // A counter adds this tab's increment; one that went down here was reset here, and the reset wins.
  if (rule === 'sum') return num(m) < num(b) ? m : num(t) + num(m) - num(b);
  if (rule === 'max') return Math.max(num(t), num(m));
  if (rule === 'or') return t === true || m === true;
  if (!isObj(m)) return m;
  // A record: field by field, on what is saved — an empty record when the save no longer has it.
  const r: Record<string, Rule> = rule === 'fields' ? { '*': 'fields' } : rule;
  const to = isObj(t) ? t : {};
  const bo = isObj(b) ? b : {};
  const out: Record<string, unknown> = {};
  for (const k of new Set([...Object.keys(to), ...Object.keys(m), ...Object.keys(bo)])) {
    // Own keys only: a saved id such as "constructor" must never pick up an inherited member as its rule.
    const v = mergeBy((Object.hasOwn(r, k) ? r[k] : r['*']) ?? 'atomic', bo[k], m[k], to[k]);
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** A save in an older version, as this version's store reads it (its own migration). */
const migrated = (store: Store, env: { state?: unknown; version?: unknown } | undefined): unknown => {
  const { version = 0, migrate } = store.persist.getOptions();
  return typeof env?.version === 'number' && env.version < version && migrate ? migrate(env.state, env.version) : env?.state;
};

/**
 * This tab's saved state at its last read or write. After a write it is what
 * was written. After a read with no write since, it is what the store's
 * memory saved then: the read through the store's own migration and guard,
 * as hydration did — so what the migration or the guard changed never counts
 * as this tab's change (a read of an older version whose migrated write met
 * a newer save is still such a read).
 */
export function baseOf(line: TabLine): unknown {
  if (line.base !== undefined) return line.base;
  const env = parse(line.seen);
  const store = line.store?.();
  return line.fresh && store ? readThrough(store, migrated(store, env)) : env?.state;
}

/** A write after the save changed underneath (1 above). */
export function mergeWrite(name: string, line: TabLine, raw: string): void {
  const marks = line.marks?.length ? line.marks : undefined; // an empty list (`markNext(key)`) is no marks
  line.marks = undefined; // this write's, whether or not it is saved
  const current = localStorage.getItem(name);
  const mine = JSON.parse(raw) as { state: Record<string, unknown>; version: number };
  const base = baseOf(line);
  if (same(mine.state, base) && !marks) {
    // Nothing of this tab's to save; its memory is behind what is saved now (following catches up).
    line.behind = true;
    return;
  }
  const env = parse(current);
  const store = line.store?.();
  let theirs: unknown;
  if (current === null) {
    // Removed since (Reset app data): this tab's changes go on the defaults, never its old data.
    theirs = store ? savedNow(store, true) : {};
  } else if (!isObj(env) || typeof env.version !== 'number') {
    theirs = undefined; // not a save at all: written over, as before
  } else if (env.version > mine.version) {
    return; // a newer Fermatina migrated this save: never write older data over it
  } else if ((line.valid ?? isObj)(env.state, env.version)) {
    theirs = store ? migrated(store, env) : env.state;
  } // else: a save the store cannot read is no one's work — this tab's memory heals it
  let out = raw;
  if (isObj(theirs)) {
    const merged = mergeBy(line.merge ?? 'fields', base, mine.state, theirs);
    // What this action does on purpose, whatever the save held (a record the merge left out stays out) —
    // written into a copy: the merge returns objects of the save it read, of this tab's memory (its base after
    // this write) and of a rule's empty form (`onEmpty`, one object for the tab's life), and a mark written into
    // one stayed there (second audit round: a score marked into progress's empty result came back, moved, erased).
    // (`merged` is an object: theirs, mine — what partialize made — or a store rule's record of them.)
    const state = marks ? JSON.parse(JSON.stringify(merged)) : merged;
    for (const [path, to] of marks ?? []) {
      let o = state;
      for (const k of path.slice(0, -1)) o = isObj(o) ? o[k] : undefined;
      const k = path[path.length - 1];
      if (isObj(o)) {
        const v = to(o[k]);
        if (v === undefined) delete o[k];
        else o[k] = v;
      }
    }
    out = JSON.stringify({ state, version: mine.version });
  }
  localStorage.setItem(name, out);
  line.seen = out;
  line.base = mine.state;
  line.fresh = false;
  line.behind = out !== raw;
  if (line.behind) line.adopt?.();
}
