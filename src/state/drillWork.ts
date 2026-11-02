/**
 * Drill's side of "work in progress" (W9b, src/services/workInProgress.ts).
 *
 * A waiting app update may apply itself silently only when nothing would be
 * cut off. In Drill that means: no session with answers in it still running,
 * no answered question whose feedback is on screen, no Sprint under way.
 *
 * The check reads the PERSISTED drill state (zustand's persist writes
 * localStorage synchronously on every change, so it is the live state), which
 * keeps it in the entry chunk without importing the drill store — that would
 * pull ts-fsrs into the entry (CLAUDE.md) — and makes it right from the first
 * moment of a cold launch, before the Drill view's code has even loaded.
 */
import { registerWorkInProgress } from '../services/workInProgress';
import { useAppStore } from './store';

/**
 * localStorage key of the drill store — a literal, like ErrorBoundary's, so
 * this module never imports drillStore (ts-fsrs). drillWork.test.ts keeps it
 * equal to DRILL_STORE_KEY in src/state/drillStore.ts.
 */
export const DRILL_STORE_KEY_LITERAL = 'fermata-drill-v1';

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function count(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/**
 * The drill state (any persisted version) holds work a reload would interrupt:
 *  - a Sprint with time left, or
 *  - a session showing the feedback of an answered question, or
 *  - a session with at least one answer that is not complete yet
 *    (a session nobody has answered in yet is not work: it resumes as it was).
 */
export function drillStateHasWork(state: unknown): boolean {
  if (!isObject(state)) return false;
  if (isObject(state.sprint) && count(state.sprint.secondsLeft) > 0) return true;
  const session = state.activeSession;
  if (!isObject(session)) return false;
  if (isObject(session.feedback)) return true;
  const length = isObject(state.settings) ? count(state.settings.length, 24) : 24;
  const asked = count(session.asked);
  const queued = Array.isArray(session.queue) ? session.queue.length : 0;
  return asked > 0 && asked < length && count(session.index) < queued;
}

/** The persisted drill state, or null when none is saved. Throws on a corrupt blob. */
export function readPersistedDrillState(): unknown {
  const raw = localStorage.getItem(DRILL_STORE_KEY_LITERAL);
  if (raw === null) return null;
  const parsed: unknown = JSON.parse(raw);
  return isObject(parsed) ? (parsed.state ?? null) : null;
}

/**
 * Register Drill as a work-in-progress source: active while the learner is IN
 * the Drill view and the drill state holds work. (An abandoned session in
 * another view is not interrupted by a reload — it resumes exactly, W9b.)
 * A corrupt saved blob throws, which the registry counts as busy.
 */
export function registerDrillWorkInProgress(): () => void {
  return registerWorkInProgress('drill', () =>
    useAppStore.getState().view === 'drill' && drillStateHasWork(readPersistedDrillState()),
  );
}
