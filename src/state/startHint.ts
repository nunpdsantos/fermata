/**
 * The start hint (wave 1): one short line in Explore after a 'new' or
 * 'player' door of the start screen — what to do first. The 'player' hint
 * ends on one link (wave 2): lesson 1 of "From the chords you know" — shown
 * only once that lesson exists (`startHintLesson`). Rendered by the shell
 * (components/layout/StartHint.tsx), in the page flow under the top bar, so it
 * covers nothing, and it is there from Explore's first paint after the door,
 * so nothing moves when it shows. Only the learner's own ✕ or action removes
 * it (that move is theirs).
 *
 * Two pieces of state:
 *  - OWED (saved, `startHint` in `music-theory-app`, only while owed): it
 *    comes back after a reload until it is done.
 *  - SHOWN (this page only): what is on screen now. Usually the same; it
 *    differs after a 'player' picks a chord — that is acting on the hint, so
 *    it is no longer owed, but the line stays until they leave Explore, so
 *    the page does not jump under the tap.
 *
 * Done (owed → null, remembered) when:
 *  - ✕ (dismissStartHint), either kind;
 *  - the 'player' hint's lesson link (followStartHintLesson);
 *  - a chord picked in Explore (not while a tour is playing), either kind.
 *    ('new' also ended on "Start lesson 1 →" until 2026-11-10: the owner took
 *    the link out until a sound-first first lesson comes in wave 2.)
 * Changing the profile in Settings never raises a hint.
 */
import { create } from 'zustand';
import { useAppStore } from './store.ts';
import { getDemoRequest } from './demoRequest.ts';
import type { StartHintKind } from './storeTypes.ts';
import { TRACKS, firstLessonOf, isTrackWritten, WRITTEN_TRACK_LESSONS } from '../data/tracks.ts';

export type { StartHintKind } from './storeTypes.ts';

interface ShownState {
  shown: StartHintKind | null;
}

/** What is on screen in this page (not saved). Starts as what is owed. */
export const useStartHintStore = create<ShownState>(() => ({ shown: useAppStore.getState().startHint }));

/** React hook: the hint to show in Explore now, or null. */
export function useShownStartHint(): StartHintKind | null {
  return useStartHintStore((s) => s.shown);
}

/** A door raised it (state/startDoors.ts): owed and shown. null clears both. */
export function raiseStartHint(kind: StartHintKind | null): void {
  useAppStore.setState({ startHint: kind });
  useStartHintStore.setState({ shown: kind });
}

/** ✕: gone, for good. */
export function dismissStartHint(): void {
  raiseStartHint(null);
}

/**
 * The lesson a hint offers (wave 2), or null: the 'player' hint offers lesson
 * 1 of "From the chords you know" — only once that lesson is written (it is
 * in the module index; `WRITTEN_TRACK_LESSONS` is its eager copy). The 'new'
 * hint offers none: its door already opened its lesson.
 */
export function startHintLesson(
  kind: StartHintKind | null,
  written: ReadonlySet<string> = WRITTEN_TRACK_LESSONS,
): { levelId: string; unitId: string; moduleId: string } | null {
  if (kind !== 'player' || !isTrackWritten(TRACKS.chords, written)) return null;
  return firstLessonOf(TRACKS.chords);
}

/** The hint's lesson link: acting on the hint ends it (no longer owed), and opens the lesson. */
export function followStartHintLesson(written: ReadonlySet<string> = WRITTEN_TRACK_LESSONS): void {
  const target = startHintLesson(useStartHintStore.getState().shown, written);
  if (!target) return;
  useAppStore.setState({ startHint: null });
  useAppStore.getState().openLearnTarget(target);
}

// A chord picked in Explore has done what either hint asks; leaving Explore
// takes away a hint that is no longer owed.
useAppStore.subscribe((state, prev) => {
  if (
    state.startHint !== null &&
    state.view === 'explore' &&
    // A chord picked: any new one, also straight after another (a menu
    // tour's "Stay here" leaves its chord selected).
    state.selectedChord !== null && state.selectedChord !== prev.selectedChord &&
    state.lessonLoan === null &&
    getDemoRequest() === null
  ) {
    useAppStore.setState({ startHint: null });
    return;
  }
  if (state.view !== prev.view && state.view !== 'explore' && state.startHint === null && useStartHintStore.getState().shown !== null) {
    useStartHintStore.setState({ shown: null });
  }
});
