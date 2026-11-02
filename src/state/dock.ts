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
