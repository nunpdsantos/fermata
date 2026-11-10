/**
 * Who the learner says they are — the wave-1 contract (2026-11-10).
 *
 * OWNER: the start-screen branch (stream A). Every other branch may only
 * IMPORT the names exported here, and must not change this file.
 *
 *   'new'    — new to music
 *   'player' — plays an instrument, never learned theory
 *   'theory' — knows some theory; wants the tools
 *   null     — never asked: a learner from before the start screen, or a first
 *              visit not answered yet. Treat null exactly like 'theory' (the
 *              app as it was before wave 1) — use `isGuidedProfile()`.
 *
 * Saved with the other preferences (`music-theory-app`, field
 * `learnerProfile`, so it travels in the backup file): set by a start-screen
 * door (state/startDoors.ts) or Settings → "How I use Fermata". The field is
 * written only once set, so the save of anyone never asked is unchanged
 * (store.ts partialize; persist stays v6).
 */
import { useAppStore } from './store.ts';
import type { LearnerProfile } from './storeTypes.ts';

export type { LearnerProfile } from './storeTypes.ts';

/** React hook: the current profile (re-renders on change). */
export function useLearnerProfile(): LearnerProfile | null {
  return useAppStore((s) => s.learnerProfile);
}

/** Outside React. */
export function getLearnerProfile(): LearnerProfile | null {
  return useAppStore.getState().learnerProfile;
}

export function setLearnerProfile(profile: LearnerProfile | null): void {
  useAppStore.setState({ learnerProfile: profile, preferencesUpdatedAt: Date.now() });
}

/** True for the two profiles that get the gentler defaults ('new', 'player'). */
export function isGuidedProfile(profile: LearnerProfile | null): boolean {
  return profile === 'new' || profile === 'player';
}
