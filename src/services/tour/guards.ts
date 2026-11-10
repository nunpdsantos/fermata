/**
 * What the tour may do without writing to anyone's saved work.
 *
 * The tour never calls a progress / drill / fingering / learn-session action.
 * But Learn and Drill write on their OWN when their view opens in some states,
 * so the tour only goes there when opening them writes nothing:
 *
 *  - Learn re-saves an open lesson or review (with a new time) and drops a
 *    stale check when it opens; it backfills review schedules for modules
 *    completed before spaced repetition existed; loading the progress store
 *    migrates (and saves) a save from an older release. In any of those
 *    states the tour points at the Learn tab instead of opening it.
 *  - Drill starts a session by itself for a learner with Drill history (or
 *    resumes one / a Sprint), and loading its store migrates an older save.
 *    Unless Drill has never been used, the tour points at the Drill tab.
 *
 * Read from storage only: importing those stores would load (and possibly
 * migrate) them — the very write being avoided.
 */
import { hasWorkInProgress } from '../workInProgress';
import { LEARN_SESSION_KEY } from '../../state/learnSessionPersistence';
import { DRILL_STORE_KEY_LITERAL, drillStateHasWork, readPersistedDrillState } from '../../state/drillWork';
import { RETIRED_EXERCISE_IDS } from '../../state/retiredExerciseIds';
import { useAppStore } from '../../state/store';

export const PROGRESS_KEY = 'music-theory-progress';
/** Mirrors PROGRESS_STORE_VERSION in progressStore.ts (same formula, no store import). */
const PROGRESS_VERSION = Math.max(1, ...RETIRED_EXERCISE_IDS.map((r) => r.version));
const DRILL_VERSION = 3;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function readJson(key: string): unknown {
  const raw = localStorage.getItem(key);
  return raw === null ? undefined : (JSON.parse(raw) as unknown);
}

/** Opening Learn now would write nothing (see above). Any doubt: false. */
export function learnVisitIsQuiet(): boolean {
  try {
    if (useAppStore.getState().pendingLearnTarget) return false;
    const session = readJson(LEARN_SESSION_KEY);
    if (session !== undefined) {
      if (!isObject(session) || !isObject(session.state)) return false;
      if (session.state.screen != null || session.state.check != null) return false;
    }
    const progress = readJson(PROGRESS_KEY);
    if (progress !== undefined) {
      if (!isObject(progress) || progress.version !== PROGRESS_VERSION) return false;
      const p = isObject(progress.state) ? progress.state.progress : undefined;
      if (!isObject(p)) return false;
      const done = Array.isArray(p.completedModules) ? p.completedModules : [];
      const schedules = isObject(p.reviewSchedules) ? p.reviewSchedules : {};
      if (done.some((id) => typeof id !== 'string' || !schedules[id])) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Opening Drill now would write nothing: Drill has never been used (it shows its intro). */
export function drillVisitIsQuiet(): boolean {
  try {
    const raw = readJson(DRILL_STORE_KEY_LITERAL);
    if (raw === undefined) return true;
    if (!isObject(raw) || raw.version !== DRILL_VERSION || !isObject(raw.state)) return false;
    const s = raw.state;
    return s.introDone === false && s.activeSession == null && s.sprint == null;
  } catch {
    return false;
  }
}

/** Going back to `view` at the end writes nothing. */
export function returnIsQuiet(view: 'explore' | 'learn' | 'drill'): boolean {
  if (view === 'learn') return learnVisitIsQuiet();
  if (view === 'drill') return drillVisitIsQuiet();
  return true;
}

/** Why the tour may not start now (work in progress), or null. */
export function busyReason(): 'drill' | 'check' | null {
  if (!hasWorkInProgress()) return null;
  try {
    if (useAppStore.getState().view === 'drill' && drillStateHasWork(readPersistedDrillState())) return 'drill';
  } catch {
    // unreadable drill state: the generic reason
  }
  return 'check';
}
