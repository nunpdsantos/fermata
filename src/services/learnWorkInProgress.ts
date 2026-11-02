/**
 * Learn's side of "work in progress" — INTERIM (W9b review B1).
 *
 * Inside a lesson a silent update must never reload the page: the learner
 * would be dropped back to the Learn overview, mid-lesson or mid-exercise.
 * Which Learn screen is open (overview / level / unit / module / review) is
 * held in LearnView's own state, not in a store, so this interim check is the
 * conservative one: the whole Learn view counts as work in progress, the
 * overview included (an update there asks instead of going in silently).
 *
 * W4b registers its precise check under the same source key, 'learn' —
 * registering a source again replaces it (services/workInProgress.ts) — and
 * removes this file's registration (main.tsx) on rebase.
 */
import { registerWorkInProgress } from './workInProgress';
import { useAppStore } from '../state/store';

export const LEARN_WORK_SOURCE = 'learn';

export function registerInterimLearnWorkInProgress(): () => void {
  return registerWorkInProgress(LEARN_WORK_SOURCE, () => useAppStore.getState().view === 'learn');
}
