/**
 * How the guitar neck is DRAWN (brief D, 2026-11-10): which side the nut is
 * on and which string is on top. Every guitar surface — the dock fretboard,
 * the landscape full-neck view, the practice sheet's neck and the Drill
 * reading board — takes its fret order, string order, open-string side,
 * scroll start and arrow keys from here. Only the picture turns: string
 * numbers, fret numbers, note names and screen-reader labels describe the
 * instrument and never change.
 *
 * String index 0 is the 6th (thick, low E) string, 5 the 1st (thin, high e),
 * everywhere in the app.
 */
import { useSyncExternalStore } from 'react';
import { useAppStore } from '../../state/store.ts';
import type { NeckNutSide, NeckTopString } from '../../state/storeTypes.ts';

export interface NeckOrientation {
  nut: NeckNutSide;
  top: NeckTopString;
}

const nutSide = () => useAppStore.getState().neckNutSide;
const topString = () => useAppStore.getState().neckTopString;

/**
 * The saved orientation (Settings → Guitar neck). A static render
 * (renderToStaticMarkup — the app itself never renders on a server) reads
 * the LIVE settings too: zustand's server snapshot is the store's initial
 * state, which is the no-save default, not the learner's saved view.
 */
export function useNeckOrientation(): NeckOrientation {
  const nut = useSyncExternalStore(useAppStore.subscribe, nutSide, nutSide);
  const top = useSyncExternalStore(useAppStore.subscribe, topString, topString);
  return { nut, top };
}

/** Frets in the order they are drawn, left to right: the nut end first when the nut is on the left. */
export function fretsAcross(frets: readonly number[], nut: NeckNutSide): number[] {
  return [...frets].sort(nut === 'left' ? (a, b) => a - b : (a, b) => b - a);
}

const LOW_FIRST = [0, 1, 2, 3, 4, 5] as const;
const HIGH_FIRST = [5, 4, 3, 2, 1, 0] as const;

/** String indices in the order they are drawn, top to bottom. */
export function stringsDown(top: NeckTopString): readonly number[] {
  return top === 'low' ? LOW_FIRST : HIGH_FIRST;
}

/**
 * The neighbour of `current` in a drawn sequence (frets left to right, or
 * strings top to bottom), `step` places on (+1 = right / down), clamped at
 * the ends. A value not in the sequence stays where it is.
 */
export function drawnNeighbour(drawn: readonly number[], current: number, step: 1 | -1): number {
  const i = drawn.indexOf(current);
  if (i < 0) return current;
  return drawn[Math.max(0, Math.min(drawn.length - 1, i + step))];
}

/** The scroll position that shows the nut end of a sideways-scrolling board. */
export function nutScrollLeft(el: HTMLElement, nut: NeckNutSide): number {
  return nut === 'left' ? 0 : el.scrollWidth - el.clientWidth;
}
