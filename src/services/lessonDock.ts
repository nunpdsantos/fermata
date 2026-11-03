/**
 * The instrument dock in a lesson (decision D-20, audit W9-02), through the
 * dock's own API (`requestDock`): a lesson opens with the instrument folded
 * away (Peek) so the text comes first; a question that is answered on the
 * instrument — or a Try-This the learner asks to see — opens it to Half, and
 * it folds back to Peek afterwards. Folding back only undoes what the lesson
 * did: if the learner moved the dock themselves meanwhile (to Full, or back
 * to Peek), it is left where they put it.
 */
import { useAppStore } from '../state/store';

let openedByLesson = false;

const learnDetent = () => useAppStore.getState().dockDetents.learn;
const inLearn = () => useAppStore.getState().view === 'learn';

/** A lesson starts with the instrument folded away. */
export function foldDockForLesson(): void {
  openedByLesson = false;
  if (inLearn() && learnDetent() !== 'peek') useAppStore.getState().requestDock('peek');
}

/** Something in the lesson needs the instrument: open it if it is folded. */
export function openDockForLesson(): void {
  if (!inLearn()) return;
  if (learnDetent() === 'peek') {
    useAppStore.getState().requestDock('half');
    openedByLesson = true;
  }
}

/** That need is over: fold back, unless the learner has moved the dock since. */
export function foldDockAfterLesson(): void {
  if (openedByLesson && inLearn() && learnDetent() === 'half') useAppStore.getState().requestDock('peek');
  openedByLesson = false;
}
