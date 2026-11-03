/**
 * The instrument dock's resting heights (D-26). On a phone the dock is a
 * pull-up sheet: Peek (bar only), Half, Full. On a tablet or laptop it is a
 * docked panel: Peek = collapsed to its bar, Half / Full = open.
 */
export type Detent = 'peek' | 'half' | 'full';
export const DETENTS: readonly Detent[] = ['peek', 'half', 'full'];

/** Views that show the dock (Drill owns the whole screen). */
export type DockView = 'explore' | 'learn';

/** Per-view detent, persisted. Learn starts collapsed (D-20): the lesson text
 *  comes first, and an exercise that needs the instrument opens it. */
export const DEFAULT_DOCK_DETENTS: Record<DockView, Detent> = {
  explore: 'half',
  learn: 'peek',
};

/** A phone held sideways (or any short window): the view above a Half
 *  sheet is ~120 px, all header — so Explore rests at Peek there until the
 *  learner sets the dock themselves (W11-B review). Mirrors SHEET_QUERY's
 *  height half. */
export const SHORT_SCREEN_QUERY = '(max-height: 500px)';

const shortScreen = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(SHORT_SCREEN_QUERY).matches;

/** Explore's detent while the learner has not chosen one. */
export function defaultExploreDetent(short: boolean = shortScreen()): Detent {
  return short ? 'peek' : 'half';
}

/** The detents a first visit starts with, for this screen. */
export function initialDockDetents(): Record<DockView, Detent> {
  return { ...DEFAULT_DOCK_DETENTS, explore: defaultExploreDetent() };
}

/** A persisted `dockChosen` value ({ explore?, learn? } booleans), or null. */
export function sanitizeDockChosen(v: unknown): Record<DockView, boolean> | null {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return null;
  const r = v as Record<string, unknown>;
  if (Object.keys(r).some((k) => k !== 'explore' && k !== 'learn')) return null;
  if ((r.explore !== undefined && typeof r.explore !== 'boolean') || (r.learn !== undefined && typeof r.learn !== 'boolean')) return null;
  return { explore: r.explore === true, learn: r.learn === true };
}

export const isDetent = (v: unknown): v is Detent => v === 'peek' || v === 'half' || v === 'full';

/** A persisted `dockDetents` value, or null when it is not a valid one. */
export function sanitizeDockDetents(v: unknown): Record<DockView, Detent> | null {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return null;
  const r = v as Record<string, unknown>;
  const keys = Object.keys(r);
  if (keys.some((k) => k !== 'explore' && k !== 'learn')) return null;
  if (!isDetent(r.explore ?? DEFAULT_DOCK_DETENTS.explore) || !isDetent(r.learn ?? DEFAULT_DOCK_DETENTS.learn)) return null;
  return {
    explore: (r.explore as Detent | undefined) ?? DEFAULT_DOCK_DETENTS.explore,
    learn: (r.learn as Detent | undefined) ?? DEFAULT_DOCK_DETENTS.learn,
  };
}
