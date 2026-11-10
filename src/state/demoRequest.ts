/**
 * Asking for the self-playing tour — the wave-1 contract (2026-11-10).
 *
 * OWNER: the tour branch (stream B). It may replace the body below; every
 * other branch may only IMPORT the names exported here, and must not change
 * this file.
 *
 * Anything that wants the tour to start (the start screen's "Watch the tour"
 * button, a menu item) calls `requestDemo()`. The tour host — mounted once in
 * the shell by stream B (`components/tour/TourHost.tsx`) — watches
 * `useDemoRequest()`, plays the tour and calls `clearDemoRequest()` when it
 * ends or is stopped.
 *
 *   'intro'   — the one-minute tour of the whole app
 *   'explore' | 'learn' | 'drill' — a short tour of one screen
 *
 * Where the request came from (optional second argument, added by the tour
 * branch; the first argument keeps its meaning): 'start' (the default — the
 * start screen, which hides itself while a request is pending) or 'menu' (the
 * top bar's "⋯" → "Show me around"). Only a menu tour ends on "Stay here" /
 * "Back to where I was"; a start-screen tour simply ends, puts the app back
 * as it was and clears the request.
 */
import { create } from 'zustand';

export type DemoTour = 'intro' | 'explore' | 'learn' | 'drill';
export type DemoSource = 'start' | 'menu';

interface DemoRequestState {
  requested: DemoTour | null;
  source: DemoSource;
  /** The last tour asked for could not open (final review, 2026-11-10). */
  failed: boolean;
}

const useStore = create<DemoRequestState>(() => ({ requested: null, source: 'start', failed: false }));

export function requestDemo(tour: DemoTour = 'intro', source: DemoSource = 'start'): void {
  useStore.setState({ requested: tour, source, failed: false });
}

export function clearDemoRequest(): void {
  useStore.setState({ requested: null, source: 'start' });
}

/** React hook: the tour asked for, or null. */
export function useDemoRequest(): DemoTour | null {
  return useStore((s) => s.requested);
}

/** Outside React. */
export function getDemoRequest(): DemoTour | null {
  return useStore.getState().requested;
}

/**
 * The tour host could not open the tour (its chunk failed to load, or it
 * threw): it clears the request and notes it here, so the start screen —
 * which has no toast region — can say so. The next `requestDemo` clears it.
 */
export function noteDemoFailed(): void {
  useStore.setState({ failed: true });
}

/** React hook: the last tour asked for could not open. */
export function useDemoFailed(): boolean {
  return useStore((s) => s.failed);
}

/** Where the pending request came from ('start' when none is pending). */
export function getDemoSource(): DemoSource {
  return useStore.getState().source;
}
