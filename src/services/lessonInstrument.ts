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
 * Learn only BORROWS the instrument: the first lesson selection puts
 * Explore's key and scale on loan (`lessonLoan` in the main store), and they
 * are given back the moment the app leaves Learn (a store subscription, so it
 * happens inside the view switch, before anything else selects). "Open in
 * Explore" keeps the lesson's selection instead (`keepLessonInstrument`, then
 * the executor as before).
 *
 * Reloads and closed tabs (B2): the loan lives in memory only, but while it
 * is set the main store SAVES the loaned selection in place of the lesson's
 * (store.ts partialize). So every boot — a reload mid-lesson, a reopened tab,
 * a saved lesson that has expired, a boot into another view — starts on
 * Explore's own key and scale, with nothing to give back; a reopened lesson
 * simply borrows them again. (The loan used to be a module variable while the
 * store saved the lesson's selection: after a reload the reopened lesson
 * recorded its own selection as Explore's.)
 */
import { useAppStore } from '../state/store';
import { resolveTheoryQuery } from '../utils/theoryQuery';
import { applyResolvedTheoryQuery } from '../utils/queryExecutor';

let unsubscribe: (() => void) | null = null;

function borrow(): void {
  const s = useAppStore.getState();
  if (!s.lessonLoan) useAppStore.setState({ lessonLoan: { key: s.selectedKey, scale: s.selectedScale } });
  unsubscribe ??= useAppStore.subscribe((state, prev) => {
    if (prev.view === 'learn' && state.view !== 'learn') returnLessonInstrument();
  });
}

function stopWatching(): void {
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
  stopWatching();
  const loan = useAppStore.getState().lessonLoan;
  if (!loan) return;
  const s = useAppStore.getState();
  // Selection first, loan last: every save on the way holds Explore's selection.
  s.setKey(loan.key);
  s.setScale(loan.scale);
  useAppStore.setState({ lessonLoan: null });
}

/** The learner is taking the lesson's selection to Explore: keep it there (and in the save). */
export function keepLessonInstrument(): void {
  stopWatching();
  if (useAppStore.getState().lessonLoan) useAppStore.setState({ lessonLoan: null });
}

/** Test seam: is Explore's selection currently on loan to a lesson? */
export function isLessonInstrumentBorrowed(): boolean {
  return useAppStore.getState().lessonLoan !== null;
}
