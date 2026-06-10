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
  const paramView = new URLSearchParams(search).get('view');
  return isViewMode(paramView) ? paramView : lastView;
}
