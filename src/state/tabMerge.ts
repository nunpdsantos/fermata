/**
 * Saving with more than one tab open: the merging write (audit A1,
 * 2026-11-18). Not needed until another tab (or a direct write: an import, a
 * reset) has changed a save since this tab last read or wrote it, so it is
 * not in the entry bundle: state/tabSafe.ts loads it at once and hands it
 * those writes. It imports nothing at run time (its chunk needs no other).
 *
 * 1. The write (`mergeWrite`): only THIS tab's changes since `base` are
 *    written on top of what is saved now, by the store's rules (2). A tab
 *    that changed nothing writes nothing. Nothing comes back from the dead:
 *    a save that was removed (Reset app data) counts as the store's
 *    defaults, so only this tab's new change goes on them; an imported one
 *    is merged into the same way; a save in an OLDER version (an older tab
 *    wrote it) is first migrated with the store's own migration; a save in a
 *    NEWER version (another tab runs a newer Fermatina, which already
 *    migrated it) is never written over — this tab's change is dropped
 *    instead (that tab shows "Reload to finish updating" once the new
 *    version took over). A tab woken from the background with old memory is
 *    covered by the same rule: its first write sees that the save changed.
 *
 * 2. The rules (`mergeBy`, a store's `Rule`; without one, as for the
 *    settings, each top-level field this tab changed wins and every other
 *    field is kept): a node this tab did not change keeps the other tab's
 *    value; a node only this tab changed takes this tab's; where both changed
 *    the same node, its rule decides — lists of ids are sets (both tabs'
 *    additions and removals apply: a task ticked in each tab stays ticked),
 *    counters add both tabs' increments, "passed" stays passed, a best stays
 *    the best, and anything else takes this tab's (its latest action).
 */
import type { TabLine } from './tabSafe';

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** What a store's memory (or, with `initial`, its defaults) saves, as plain JSON. */
export function savedNow(store: NonNullable<TabLine['store']>, initial?: boolean): unknown {
  const partialize = store.persist.getOptions().partialize ?? ((s: unknown) => s);
  return JSON.parse(JSON.stringify(partialize((initial ? store.getInitialState() : store.getState()) as never)) ?? 'null');
}

/** Equal as saved (both sides come from the same code, so key order matches). */
export const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const parse = (raw: string | null | undefined): unknown => {
  try {
    return raw == null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
};

/** How a node merges (2 above); 'fields' = each top-level field this tab changed wins (the default). */
export type Rule = 'set' | 'sum' | 'max' | 'or' | 'atomic' | 'fields' | { [key: string]: Rule } | ((b: unknown, m: unknown, t: unknown) => unknown);

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
  if (rule === 'fields') rule = {};
  const bo = isObj(b) ? b : {};
  const out: Record<string, unknown> = {};
  for (const k of new Set([...Object.keys(t), ...Object.keys(m), ...Object.keys(bo)])) {
    // Own keys only: a saved id such as "constructor" must never pick up an inherited member as its rule.
    const v = mergeBy((Object.hasOwn(rule, k) ? rule[k] : rule['*']) ?? 'atomic', bo[k], m[k], t[k]);
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** A write after the save changed underneath (1 above). */
export function mergeWrite(name: string, line: TabLine, raw: string): void {
  const current = localStorage.getItem(name);
  const mine = JSON.parse(raw) as { state: unknown; version: number };
  const base = line.base === undefined ? (parse(line.seen) as { state?: unknown } | undefined)?.state : line.base;
  if (same(mine.state, base)) return; // nothing of this tab's to save
  const env = parse(current) as { state?: unknown; version?: unknown } | undefined;
  const opts = line.store?.persist.getOptions();
  let theirs: unknown;
  if (current === null) {
    // Removed since (Reset app data): this tab's change goes on the defaults, never its old data.
    theirs = line.store ? savedNow(line.store, true) : {};
  } else if (!isObj(env) || typeof env.version !== 'number') {
    theirs = undefined; // not a save at all: written over, as before
  } else if (env.version > mine.version) {
    return; // a newer Fermatina migrated this save: never write older data over it
  } else {
    theirs = env.version < mine.version && opts?.migrate ? opts.migrate(env.state, env.version) : env.state;
  }
  const out = theirs === undefined ? raw : JSON.stringify({ state: mergeBy(line.merge ?? 'fields', base, mine.state, theirs), version: mine.version });
  localStorage.setItem(name, out);
  line.seen = out;
  line.base = mine.state;
  line.behind = out !== raw;
  if (line.behind) line.adopt?.();
}
