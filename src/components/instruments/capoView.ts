/**
 * Where the capo applies (wave 2, stream C). The capo is a saved setting
 * (`state/capo.ts`), but only Explore's guitar — the dock fretboard and the
 * landscape full-neck view — draws it. Learn (lessons, checks, instrument
 * answers), Drill's reading board and the guitar practice sheet draw the
 * neck without it, as before.
 */
import { useAppStore } from '../../state/store.ts';
import { useCapoFret } from '../../state/capo.ts';

/**
 * The term id the glossary gives the word "capo" (written by the Progression
 * branch). A constant, not a literal attribute: until that entry exists the
 * mark is ignored by "Words on this screen" (`visibleTermIds` keeps only
 * known ids), and the glossary test's literal-id scan would refuse it.
 */
export const CAPO_TERM = 'capo';

/** The capo fret Explore's guitar draws: the setting in Explore outside an exercise, else 0. */
export function useExploreCapo(): number {
  const capo = useCapoFret();
  const exploring = useAppStore((s) => s.view === 'explore' && !s.exerciseInputActive && s.instrument === 'guitar');
  return exploring ? capo : 0;
}
