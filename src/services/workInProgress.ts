/**
 * "Is the learner in the middle of something?" — asked before an app update
 * is applied silently (W9b). Each part of the app that can hold work in
 * progress registers a check under its own source name; a later registration
 * under the same source replaces the earlier one. A check that throws counts
 * as work in progress (when in doubt, don't reload under the learner).
 *
 * Learn registers 'learn': true while a lesson or review is open in Learn
 * (reading counts) or a check (or practice round) is under way and not
 * finished; false on the Learn overview and level lists.
 */
const checks = new Map<string, () => boolean>();

/** Register (or replace) a source's check. Returns a function that unregisters it. */
export function registerWorkInProgress(source: string, isActive: () => boolean): () => void {
  checks.set(source, isActive);
  return () => {
    if (checks.get(source) === isActive) checks.delete(source);
  };
}

/** True if any registered check reports work in progress (a throwing check counts as true). */
export function hasWorkInProgress(): boolean {
  for (const isActive of checks.values()) {
    try {
      if (isActive()) return true;
    } catch {
      return true;
    }
  }
  return false;
}
