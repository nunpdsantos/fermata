/**
 * Explore's Simple / Full view (wave 1, brief C).
 *
 * The learner's own choice wins once made (saved as `exploreDetail`, an
 * optional v6 field). Before that, a guided profile ('new', 'player') starts
 * in Simple and everyone else in Full — so a learner with no profile (every
 * save from before wave 1, every existing test) sees today's Explore.
 */
import { useAppStore } from './store.ts';
import type { ExploreDetail } from './storeTypes.ts';
import { isGuidedProfile, useLearnerProfile, type LearnerProfile } from './learnerProfile.ts';

export type { ExploreDetail };

/** The rule, without React: the saved choice, else the profile's default. */
export function resolveExploreDetail(saved: ExploreDetail | undefined, profile: LearnerProfile | null): ExploreDetail {
  return saved ?? (isGuidedProfile(profile) ? 'simple' : 'full');
}

/** React hook: the view Explore shows now. */
export function useExploreDetail(): ExploreDetail {
  const saved = useAppStore((s) => s.exploreDetail);
  const profile = useLearnerProfile();
  return resolveExploreDetail(saved, profile);
}

/** True while Explore shows its Simple view. */
export function useExploreSimple(): boolean {
  return useExploreDetail() === 'simple';
}
