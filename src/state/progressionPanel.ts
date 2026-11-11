/**
 * Whether Explore's chords card shows the Progression panel (wave 2, stream
 * S), and what a request or a link offers it. Session only — open or closed
 * is never saved; the learner's chords are (`progression` in the main store,
 * state/progressionSave.ts).
 *
 * Eager and tiny: the chords card's "Progression" button and the request host
 * read it; the panel itself is a lazy chunk. The loop (in that chunk)
 * registers its stop here, so closing the panel — the button, a tour taking
 * its snapshot — stops the sound at once, before anything re-renders.
 */
import { create } from 'zustand';

/** Chords a lesson or a link brings while the learner already has some: offered, never put in silently. */
export interface ProgressionOffer {
  chords: readonly string[];
  bpm?: number;
}

interface PanelState {
  open: boolean;
  offer: ProgressionOffer | null;
}

const usePanelStore = create<PanelState>(() => ({ open: false, offer: null }));

let stopLoop: (() => void) | null = null;

/** The loop's stop (the lazy panel registers it while it can play); returns the unregister. */
export function registerLoopStop(stop: () => void): () => void {
  stopLoop = stop;
  return () => {
    if (stopLoop === stop) stopLoop = null;
  };
}

export function openProgressionPanel(): void {
  usePanelStore.setState({ open: true });
}

/** Close the panel: the loop stops first (synchronously), then the card shows its tabs again. */
export function closeProgressionPanel(): void {
  stopLoop?.();
  usePanelStore.setState({ open: false });
}

export function isProgressionPanelOpen(): boolean {
  return usePanelStore.getState().open;
}

/** React hook: is the panel open? */
export function useProgressionPanelOpen(): boolean {
  return usePanelStore((s) => s.open);
}

export function setProgressionOffer(offer: ProgressionOffer | null): void {
  usePanelStore.setState({ offer });
}

export function useProgressionOffer(): ProgressionOffer | null {
  return usePanelStore((s) => s.offer);
}

export function getProgressionOffer(): ProgressionOffer | null {
  return usePanelStore.getState().offer;
}

/** Test seam. */
export function resetProgressionPanel(): void {
  stopLoop = null;
  usePanelStore.setState({ open: false, offer: null });
}
