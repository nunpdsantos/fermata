/**
 * Asking for the self-playing tour — the wave-1 contract (2026-11-10).
 *
 * OWNER: the tour branch (stream B). It may replace the body below; every
 * other branch may only IMPORT the names exported here, and must not change
 * this file.
 *
 * Anything that wants the tour to start (the start screen's "Watch the tour"
 * button, a menu item) calls `requestDemo()`. The tour host — mounted once in
 * the shell by stream B — watches `useDemoRequest()`, plays the tour and calls
 * `clearDemoRequest()` when it ends or is stopped.
 *
 *   'intro'   — the one-minute tour of the whole app
 *   'explore' | 'learn' | 'drill' — a short tour of one screen
 */
import { create } from 'zustand';

export type DemoTour = 'intro' | 'explore' | 'learn' | 'drill';

interface DemoRequestState {
  requested: DemoTour | null;
}

const useStore = create<DemoRequestState>(() => ({ requested: null }));

export function requestDemo(tour: DemoTour = 'intro'): void {
  useStore.setState({ requested: tour });
}

export function clearDemoRequest(): void {
  useStore.setState({ requested: null });
}

/** React hook: the tour asked for, or null. */
export function useDemoRequest(): DemoTour | null {
  return useStore((s) => s.requested);
}

/** Outside React. */
export function getDemoRequest(): DemoTour | null {
  return useStore.getState().requested;
}
