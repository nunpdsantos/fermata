/**
 * Who the learner says they are — the wave-1 contract (2026-11-10).
 *
 * OWNER: the start-screen branch (stream A). It replaces the in-memory body
 * below with the persisted one. Every other branch may only IMPORT the names
 * exported here, and must not change this file.
 *
 *   'new'    — new to music
 *   'player' — plays an instrument, never learned theory
 *   'theory' — knows some theory; wants the tools
 *   null     — never asked: a learner from before the start screen, or a first
 *              visit not answered yet. Treat null exactly like 'theory' (the
 *              app as it was before wave 1) — use `isGuidedProfile()`.
 */
import { create } from 'zustand';

export type LearnerProfile = 'new' | 'player' | 'theory';

interface LearnerProfileState {
  profile: LearnerProfile | null;
}

const useStore = create<LearnerProfileState>(() => ({ profile: null }));

/** React hook: the current profile (re-renders on change). */
export function useLearnerProfile(): LearnerProfile | null {
  return useStore((s) => s.profile);
}

/** Outside React. */
export function getLearnerProfile(): LearnerProfile | null {
  return useStore.getState().profile;
}

export function setLearnerProfile(profile: LearnerProfile | null): void {
  useStore.setState({ profile });
}

/** True for the two profiles that get the gentler defaults ('new', 'player'). */
export function isGuidedProfile(profile: LearnerProfile | null): boolean {
  return profile === 'new' || profile === 'player';
}
