/**
 * Asking Explore to open its Progression panel — a wave-2 contract
 * (2026-11-10).
 *
 * OWNER: the progression branch (stream S). It may replace the body below;
 * every other branch may only IMPORT the names exported here, and must not
 * change this file.
 *
 * Anything that wants the learner to land in the Progression panel (a
 * lesson's "Try this", a link) calls `requestProgression()`, then shows
 * Explore. The panel's host — mounted in Explore by stream S — watches
 * `useProgressionRequest()`, opens the panel, loads the chords if any were
 * given, and calls `clearProgressionRequest()`.
 *
 *   chords — chord symbols the app's parser reads (`parseChordSymbol`:
 *            "G", "Em", "D7", "F#m7"), in playing order. Left out or empty:
 *            the panel opens on whatever progression the learner has.
 *            Symbols the parser does not read are left out; at most 16 are
 *            taken.
 *   bpm    — (optional, added by stream S for share links) the tempo to go
 *            with the chords, 50–200; anything else is ignored.
 *
 * A request with chords REPLACES the learner's saved progression only when
 * the learner has none; otherwise the panel offers the new chords and the
 * learner chooses (stream S decides how; nothing saved is lost silently).
 *
 * How stream S does it (components/explore/ProgressionHost.tsx): the host,
 * mounted in Explore, opens the panel; with chords and an empty progression
 * it loads them; with the same chords at the same tempo (or no tempo) it
 * changes nothing; with other chords, or the same chords at another tempo,
 * the panel shows a line "A lesson or shared link offers these chords: G, D,
 * Em, C." (naming the tempo when the request has one) with "Use these"
 * (replaces) and "Keep mine" (drops the offer). The request is cleared
 * either way. A request made while Explore is not mounted waits until it is.
 */
import { create } from 'zustand';

export interface ProgressionRequest {
  chords?: readonly string[];
  bpm?: number;
}

interface ProgressionRequestState {
  requested: ProgressionRequest | null;
}

const useStore = create<ProgressionRequestState>(() => ({ requested: null }));

export function requestProgression(request: ProgressionRequest = {}): void {
  useStore.setState({ requested: { ...request } });
}

export function clearProgressionRequest(): void {
  useStore.setState({ requested: null });
}

/** React hook: the pending request, or null. */
export function useProgressionRequest(): ProgressionRequest | null {
  return useStore((s) => s.requested);
}

/** Outside React. */
export function getProgressionRequest(): ProgressionRequest | null {
  return useStore.getState().requested;
}
