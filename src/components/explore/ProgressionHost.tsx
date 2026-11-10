import { useEffect } from 'react';
import { clearProgressionRequest, useProgressionRequest } from '../../state/progressionRequest';
import { applyProgressionRequest } from './progressionRequestApply';

/**
 * Explore's host for `requestProgression()` (wave 2, stream S): a lesson or a
 * shared link asks, Explore (where this is mounted) opens the Progression
 * panel and loads or offers the chords, and the request is cleared.
 */
export function ProgressionHost() {
  const request = useProgressionRequest();
  useEffect(() => {
    if (!request) return;
    clearProgressionRequest();
    applyProgressionRequest(request).catch((e) => console.warn('[progression] request not applied', e));
  }, [request]);
  return null;
}
