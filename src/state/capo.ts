/**
 * The guitar capo — a wave-2 contract (2026-11-10).
 *
 * OWNER: the capo branch (stream C). It may replace the body below (the
 * placeholder keeps the value for the session only; the owner makes it a
 * saved setting); every other branch may only IMPORT the names exported
 * here, and must not change this file.
 *
 *   0      — no capo (the app as it was before wave 2)
 *   1 … 9  — a capo on that fret: every open string sounds that many half
 *            steps higher, and chord shapes are played above it
 *
 * The Progression panel (stream S) reads it to say which shapes to play and
 * sets it when the learner takes a "capo on fret N" suggestion; the
 * fretboard (stream C) draws it.
 */
import { create } from 'zustand';

export const MAX_CAPO_FRET = 9;

const useStore = create<{ fret: number }>(() => ({ fret: 0 }));

function clampCapo(fret: number): number {
  if (!Number.isFinite(fret)) return 0;
  return Math.min(MAX_CAPO_FRET, Math.max(0, Math.round(fret)));
}

/** React hook: the capo fret, 0 when there is none. */
export function useCapoFret(): number {
  return useStore((s) => s.fret);
}

/** Outside React. */
export function getCapoFret(): number {
  return useStore.getState().fret;
}

/** Anything outside 0 … MAX_CAPO_FRET is brought into range; fractions are rounded. */
export function setCapoFret(fret: number): void {
  useStore.setState({ fret: clampCapo(fret) });
}
