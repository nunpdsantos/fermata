/**
 * Saving with more than one tab open: the merging write (audit A1,
 * 2026-11-18; fix pass 2026-11-19). It runs when another tab (or a direct
 * write: an import, a reset) has changed a save since this tab last read or
 * wrote it. It is in the entry bundle with state/tabSafe.ts: a learner's
 * saved work never depends on a second download.
 *
 * 1. The write (`mergeWrite`): only THIS tab's changes since `base` (its last
 *    read or write) are written on top of what is saved now, by the store's
 *    rules (2). A tab that changed nothing writes nothing. A save that was
 *    removed (Reset app data) counts as the store's defaults; an imported one
 *    is what is saved; a save in an OLDER version (an older tab wrote it) is
 *    first migrated with the store's own migration; a save in a NEWER version
 *    (another tab runs a newer Fermatina, which already migrated it) is never
 *    written over — this tab's change is dropped instead (that tab shows
 *    "Reload to finish updating" once the new version took over); a save the
 *    store's own guard throws away whole (broken, hand-edited) is replaced by
 *    this tab's memory, as before the fix. A tab woken from the background
 *    with old memory is covered by the same rule.
 *
 * 2. The rules (`mergeBy`, a store's `Rule`): a node this tab did not change
 *    keeps the saved value; a node only this tab changed takes this tab's;
 *    where both changed it, its rule decides — lists of ids are sets (both
 *    tabs' additions and removals apply), counters add this tab's increment,
 *    "passed" stays passed, a best stays the best, a record merges field by
 *    field, anything else takes this tab's value (its latest action). A
 *    record the save no longer has (a reset, an import without it) gets ONLY
 *    this tab's changes since its base — new leaves, counters by their
 *    increment, "passed" only if passed since — on the record's empty form
 *    (`onEmpty`) where the store needs one, never this tab's older values:
 *    nothing comes back from the dead in a record this tab touches either.
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
const parse = (raw: string | null | undefined): unknown => {
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

/** A record the save no longer has merges this tab's changes into `empty` (its form when new), never into nothing. */
export const onEmpty = (empty: Record<string, unknown>, rule: Rule): Rule => (b, m, t) => mergeBy(rule, b, m, isObj(t) ? t : empty);

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

/**
 * This tab's saved state at its last read or write. After a write it is what
 * was written. After a read with no write since, it is what the store's
 * memory saved then: the read through the store's own guard, as hydration
 * did — so what that guard cleaned or added never counts as this tab's
 * change. (A save the store migrated on reading was written at once, so a
 * fresh line is never in an older version.)
 */
export function baseOf(line: TabLine): unknown {
  if (line.base !== undefined) return line.base;
  const read = (parse(line.seen) as { state?: unknown } | undefined)?.state;
  const store = line.store?.();
  return line.fresh && store ? readThrough(store, read) : read;
}

/** A write after the save changed underneath (1 above). */
export function mergeWrite(name: string, line: TabLine, raw: string): void {
  const current = localStorage.getItem(name);
  const mine = JSON.parse(raw) as { state: unknown; version: number };
  const base = baseOf(line);
  if (same(mine.state, base)) return; // nothing of this tab's to save
  const env = parse(current) as { state?: unknown; version?: unknown } | undefined;
  const store = line.store?.();
  const opts = store?.persist.getOptions();
  let theirs: unknown;
  if (current === null) {
    // Removed since (Reset app data): this tab's changes go on the defaults, never its old data.
    theirs = store ? savedNow(store, true) : {};
  } else if (!isObj(env) || typeof env.version !== 'number') {
    theirs = undefined; // not a save at all: written over, as before
  } else if (env.version > mine.version) {
    return; // a newer Fermatina migrated this save: never write older data over it
  } else {
    theirs = env.version < mine.version && opts?.migrate ? opts.migrate(env.state, env.version) : env.state;
    // A save the store's own guard throws away whole is no one's work: this tab's memory heals it, as before.
    if (!(line.valid ?? isObj)(theirs)) theirs = undefined;
  }
  const out = theirs === undefined ? raw : JSON.stringify({ state: mergeBy(line.merge ?? 'fields', base, mine.state, theirs), version: mine.version });
  localStorage.setItem(name, out);
  line.seen = out;
  line.base = mine.state;
  line.fresh = false;
  line.behind = out !== raw;
  if (line.behind) line.adopt?.();
}
