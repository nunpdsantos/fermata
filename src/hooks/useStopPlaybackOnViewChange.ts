import { useEffect } from 'react';
import { cancelScheduledAudio } from '../core/services/audio.ts';
import { useAppStore } from '../state/store.ts';

/**
 * Leaving a view stops what it was playing (audit W8-01): a scale, arpeggio
 * or reveal scheduled in Explore / Drill must not keep sounding — or keep
 * lighting keys on the instrument dock, which stays mounted — in the next
 * view. One-shot sound is cancelled and the cancelled phrases' visuals are
 * settled by core; notes the learner is HOLDING on the instrument are left
 * alone. Call once, in App.
 */
export function useStopPlaybackOnViewChange(): void {
  useEffect(
    () =>
      useAppStore.subscribe((state, prev) => {
        if (state.view !== prev.view) cancelScheduledAudio();
      }),
    [],
  );
}
