/**
 * Boot view resolution — pure helpers for picking the initial ViewMode at app
 * start. Kept out of App.tsx so the component file only exports components
 * (react-refresh) and so the logic is unit-testable in isolation.
 */
import type { ViewMode } from './storeTypes.ts';

export const VALID_VIEWS: readonly ViewMode[] = ['explore', 'learn', 'drill'];

export function isViewMode(v: string | null): v is ViewMode {
  return v !== null && (VALID_VIEWS as readonly string[]).includes(v);
}

/**
 * Resolve the boot view from a URL query string and the persisted lastView.
 * A valid ?view= param wins (PWA shortcut / deep link); otherwise lastView is
 * restored.
 */
export function pickBootView(search: string, lastView: ViewMode): ViewMode {
  return requestedView(search) ?? lastView;
}

/** The view a boot address asks for (`?view=`, the installed app's "Start Drill" shortcut), or null. */
export function requestedView(search: string): ViewMode | null {
  const paramView = new URLSearchParams(search).get('view');
  return isViewMode(paramView) ? paramView : null;
}

/**
 * A view asked for by the boot address while the start screen is owed
 * (audit 2026-11-18, Q13): the start screen still asks who the visitor is —
 * `view` is not a share parameter, so it never skips it — and the door the
 * visitor chooses then opens that view (state/startDoors.ts
 * `chooseStartDoor`), instead of dropping it. Noted once at boot by
 * `applyStartLinkRule` (state/startGate.ts), taken by the door. In memory
 * only: a reload of the start screen has a clean address, and asks nothing
 * more of the next door.
 */
let carriedView: ViewMode | null = null;

export function carryViewRequest(view: ViewMode | null): void {
  carriedView = view;
}

/** The carried request, once (null when there is none). */
export function takeViewRequest(): ViewMode | null {
  const view = carriedView;
  carriedView = null;
  return view;
}
