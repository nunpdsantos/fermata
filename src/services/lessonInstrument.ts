/**
 * The instrument in a lesson (W4b, decision D-20 / audit W9-02).
 *
 * In Learn the dock used to show whatever was last open in Explore ("A minor
 * pentatonic, Box 2" during a clef lesson). Now the LESSON drives it: the
 * section being read shows its Try-This on the instrument, through the same
 * resolver and store selection as the Try-This executor
 * (resolveTheoryQuery → applyResolvedTheoryQuery) — just without jumping to
 * Explore.
 *
 * Learn only BORROWS the instrument: the first lesson selection remembers
 * Explore's key and scale, and they are given back the moment the app leaves
 * Learn (a store subscription, so it happens inside the view switch, before
 * anything else selects). "Open in Explore" keeps the lesson's selection
 * instead (`keepLessonInstrument`, then the executor as before).
 */
import { useAppStore } from '../state/store';
import { resolveTheoryQuery } from '../utils/theoryQuery';
import { applyResolvedTheoryQuery } from '../utils/queryExecutor';
import type { Note, ScaleType } from '../core/types/music';

let saved: { key: Note; scale: ScaleType } | null = null;
let unsubscribe: (() => void) | null = null;

function borrow(): void {
  if (saved) return;
  const s = useAppStore.getState();
  saved = { key: s.selectedKey, scale: s.selectedScale };
  unsubscribe = useAppStore.subscribe((state, prev) => {
    if (prev.view === 'learn' && state.view !== 'learn') returnLessonInstrument();
  });
}

function release(): void {
  saved = null;
  unsubscribe?.();
  unsubscribe = null;
}

/**
 * Show a lesson query on the instrument (no view change). Returns false when
 * the query names nothing the instrument can show (the circle of fifths, or a
 * query the resolver does not know) — the instrument is then left as it is.
 */
export function showLessonQuery(query: string): boolean {
  const resolved = resolveTheoryQuery(query);
  if (!resolved || resolved.kind === 'circle') return false;
  borrow();
  applyResolvedTheoryQuery(resolved);
  return true;
}

/** Give Explore back the key and scale it had before the lesson borrowed the instrument. */
export function returnLessonInstrument(): void {
  if (!saved) return;
  const { key, scale } = saved;
  release();
  const s = useAppStore.getState();
  s.setKey(key);
  s.setScale(scale);
}

/** The learner is taking the lesson's selection to Explore: keep it there. */
export function keepLessonInstrument(): void {
  release();
}

/** Test seam: is Explore's selection currently on loan to a lesson? */
export function isLessonInstrumentBorrowed(): boolean {
  return saved !== null;
}
