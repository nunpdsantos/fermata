/**
 * Work in progress — the one question an app update asks before it applies
 * itself without asking: "would reloading now cut something off?"
 *
 * Each part of the app that holds unsaved, in-progress work registers a
 * check (Drill: a session or a Sprint under way — src/state/drillWork.ts;
 * Learn: an exercise check in progress, registered by Learn). usePWA only
 * applies a waiting update silently when no registered source reports
 * active (W9b). Interface fixed by the coordinator; W4b uses the same file.
 */

const sources = new Map<string, () => boolean>();

/** Sources that hold unsaved, in-progress work (a Drill session, a Learn check…). */
export function registerWorkInProgress(source: string, isActive: () => boolean): () => void {
  // Registering the same source again replaces its check.
  sources.set(source, isActive);
  return () => {
    // Only remove our own check — never a newer registration of the same source.
    if (sources.get(source) === isActive) sources.delete(source);
  };
}

/** True if any registered source reports active. A check that throws counts as active (the safe side). */
export function hasWorkInProgress(): boolean {
  for (const isActive of sources.values()) {
    try {
      if (isActive()) return true;
    } catch {
      return true;
    }
  }
  return false;
}
