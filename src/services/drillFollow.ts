/**
 * "Follow my lessons" (wave 2): which lessons are completed, whether the
 * switch is in force, and the pool a session draws from while it is.
 *
 * Drill has no link to lesson progress by design: this file reads
 * `music-theory-progress` straight from localStorage and NEVER writes, the
 * way services/tour/guards.ts does — loading the progress store would
 * hydrate it, may migrate and save it, and would pull it into Drill's chunk.
 */
import type { DrillFamily, DrillItem, ItemSrsState } from '../core/types/drill';
import { DRILL_FAMILIES } from '../core/types/drill';
import type { LearnerProfile } from '../state/storeTypes';
import { isItemUnlocked, type DrillUnlock } from '../data/drillUnlocks';

/** The progress store's key (state/progressStore.ts). */
export const PROGRESS_STORAGE_KEY = 'music-theory-progress';

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * The completed lesson ids in the saved Learn progress; [] when there is
 * none or it cannot be read (blocked storage, broken JSON, another shape).
 * Accepts the current save ({ state: { progress: { completedModules } } }) of
 * any version — completions survive every progress migration — and the
 * oldest one (the progress itself at the top level). Non-string entries are
 * skipped. Never writes.
 */
export function readCompletedLessons(storage: Pick<Storage, 'getItem'> | null = safeLocalStorage()): string[] {
  try {
    const raw = storage?.getItem(PROGRESS_STORAGE_KEY);
    if (raw == null) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) return [];
    const progress = isObject(parsed.state) && isObject(parsed.state.progress)
      ? parsed.state.progress
      : parsed;
    const done = progress.completedModules;
    if (!Array.isArray(done)) return [];
    return [...new Set(done.filter((id): id is string => typeof id === 'string'))];
  } catch {
    return [];
  }
}

function safeLocalStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/**
 * The value of the switch in force. Saved → that. Never set → ON for a
 * learner who came in by the "new to music" or "I play" door and has no
 * Drill history yet; OFF for everyone else (the owner: no profile, months of
 * history), so nobody already drilling sees a change.
 */
export function followInForce(
  saved: boolean | undefined,
  profile: LearnerProfile | null,
  hasDrillHistory: boolean,
): boolean {
  if (saved !== undefined) return saved;
  return (profile === 'new' || profile === 'player') && !hasDrillHistory;
}

/**
 * The session pool while the switch is on: what the lessons open, plus every
 * fact already being learned (a scheduled card is never dropped). The topic
 * choices are set aside, not changed: turning the switch off brings them back.
 */
export function followPool(unlock: DrillUnlock, states: Record<string, ItemSrsState>): (item: DrillItem) => boolean {
  return (item) => states[item.id] !== undefined || isItemUnlocked(unlock, item);
}

/** True when a session with the switch on would have nothing to ask. */
export function followHasNothing(
  bank: readonly DrillItem[],
  unlock: DrillUnlock,
  states: Record<string, ItemSrsState>,
): boolean {
  const inPool = followPool(unlock, states);
  return !bank.some(inPool);
}

/**
 * The topic set a Sprint uses while following: every family the session pool
 * reaches (Sprint then keeps its own rule — facts already in review or by
 * heart — so it draws from the same pool; its best is kept per this set).
 */
export function followFamilies(
  bank: readonly DrillItem[],
  unlock: DrillUnlock,
  states: Record<string, ItemSrsState>,
): Record<DrillFamily, boolean> {
  const inPool = followPool(unlock, states);
  const out = Object.fromEntries(DRILL_FAMILIES.map((f) => [f, false])) as Record<DrillFamily, boolean>;
  for (const item of bank) if (!out[item.family] && inPool(item)) out[item.family] = true;
  return out;
}

const PIANO_EXCLUDED: ReadonlySet<DrillFamily> = new Set<DrillFamily>(['read']);
const NOTHING_EXCLUDED: ReadonlySet<DrillFamily> = new Set<DrillFamily>();

/**
 * Families following the lessons never opens for this instrument (the seat's
 * decision S-2, final review of wave 2): guitar reading (the neck's notes)
 * is not offered to a learner whose instrument is the piano — neither as
 * unlocked nor as next. With the guitar selected, as before. The switch off
 * (the owner) does not read this.
 */
export function followExcluded(instrument: string): ReadonlySet<DrillFamily> {
  return instrument === 'guitar' ? NOTHING_EXCLUDED : PIANO_EXCLUDED;
}
