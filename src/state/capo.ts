/**
 * The guitar capo — a wave-2 contract (2026-11-10).
 *
 * OWNER: the capo branch (stream C). It may replace the body below; every
 * other branch may only IMPORT the names exported here, and must not change
 * this file.
 *
 *   0      — no capo (the app as it was before wave 2)
 *   1 … 9  — a capo on that fret: every open string sounds that many half
 *            steps higher, and chord shapes are played above it
 *
 * The Progression panel (stream S) reads it to say which shapes to play and
 * sets it when the learner takes a "capo on fret N" suggestion; the
 * fretboard (stream C) draws it.
 *
 * A SAVED setting (stream C): the main store's optional `capoFret` field
 * (`state/store.ts`), written to the v6 save only while a capo is on (1 … 9),
 * so a save from someone who never uses one is written back byte for byte.
 * It is only a setting: Explore's guitar draws it (dock and full neck);
 * Learn, Drill's reading board and the practice sheet draw the neck without
 * it, and switching to the piano leaves it as it is.
 */
import { useAppStore } from './store.ts';

export const MAX_CAPO_FRET = 9;

function clampCapo(fret: number): number {
  if (!Number.isFinite(fret)) return 0;
  return Math.min(MAX_CAPO_FRET, Math.max(0, Math.round(fret)));
}

/** React hook: the capo fret, 0 when there is none. */
export function useCapoFret(): number {
  return useAppStore((s) => s.capoFret);
}

/** Outside React. */
export function getCapoFret(): number {
  return useAppStore.getState().capoFret;
}

/** Anything outside 0 … MAX_CAPO_FRET is brought into range; fractions are rounded. */
export function setCapoFret(fret: number): void {
  const next = clampCapo(fret);
  if (next === useAppStore.getState().capoFret) return;
  useAppStore.setState({ capoFret: next, preferencesUpdatedAt: Date.now() });
}
