import { registerWorkInProgress } from '../services/workInProgress';
import { isFresh, LEARN_SESSION_KEY } from './learnSessionPersistence';

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Read on every call until the lazy Learn store replaces this registration. */
export function persistedLearnCheckInProgress(now = Date.now()): boolean {
  const raw = localStorage.getItem(LEARN_SESSION_KEY);
  if (raw === null) return false;
  const saved: unknown = JSON.parse(raw);
  if (!isObject(saved) || !isObject(saved.state)) throw new Error('Unknown Learn session');
  const check = saved.state.check;
  if (check == null) return false;
  if (!isObject(check)) throw new Error('Unknown Learn check');
  if (check.finished === true) return false;
  if (typeof check.at === 'number' && Number.isFinite(check.at)) {
    if (!isFresh(check.at, now)) return false;
    if (check.finished === false) return true;
  }
  // Only absence, completion or a timestamp outside the fresh window proves
  // there is no work under the live check's rule.
  // Corrupt JSON/storage and ambiguous status throw: the registry treats them
  // as busy. Do not reject a potentially active check for malformed run/content
  // fields or an unknown version here; the lazy store owns full validation.
  throw new Error('Ambiguous Learn check');
}

export function registerLearnWorkInProgress(): () => void {
  // Seat decision: check-only, unfinished and fresh, even behind another view.
  // Reading a module/review is idle; review/practice exercise checks still count.
  return registerWorkInProgress('learn', () => persistedLearnCheckInProgress());
}
