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
 *
 * A request with chords REPLACES the learner's saved progression only when
 * the learner has none; otherwise the panel offers the new chords and the
 * learner chooses (stream S decides how; nothing saved is lost silently).
 */
import { create } from 'zustand';

export interface ProgressionRequest {
  chords?: readonly string[];
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
