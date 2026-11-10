/**
 * The start hint (wave 1): one short line in Explore after a 'new' or
 * 'player' door of the start screen — what to do first. Rendered by the shell
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
 *  - 'new': "Start lesson 1 →" (startFirstLesson) — it opens the first lesson;
 *  - 'player': a chord picked in Explore (not while a tour is playing).
 * Changing the profile in Settings never raises a hint.
 */
import { create } from 'zustand';
import { useAppStore } from './store.ts';
import { getDemoRequest } from './demoRequest.ts';
import type { StartHintKind } from './storeTypes.ts';

export type { StartHintKind } from './storeTypes.ts';

/** The first lesson of the course (Level 1, unit 1, module 1). */
export const FIRST_LESSON = { levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1' } as const;

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

/** 'new' hint's action: done, and the first lesson opens. */
export function startFirstLesson(): void {
  raiseStartHint(null);
  useAppStore.getState().openLearnTarget({ ...FIRST_LESSON });
}

// A 'player' picking a chord in Explore has done what the hint asks; leaving
// Explore takes away a hint that is no longer owed.
useAppStore.subscribe((state, prev) => {
  if (
    state.startHint === 'player' &&
    state.view === 'explore' &&
    state.selectedChord !== null && prev.selectedChord === null &&
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
