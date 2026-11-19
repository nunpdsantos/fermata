/**
 * Boot view resolution — pure helpers for picking the initial ViewMode at app
 * start. Kept out of App.tsx so the component file only exports components
 * (react-refresh) and so the logic is unit-testable in isolation.
 */
import type { ViewMode } from './storeTypes.ts';

export const VALID_VIEWS: readonly ViewMode[] = ['explore', 'learn', 'drill'];

export function isViewMode(v: unknown): v is ViewMode {
  return (VALID_VIEWS as readonly unknown[]).includes(v);
}

/**
 * Resolve the boot view from a URL query string and the persisted lastView.
 * A valid ?view= param wins (PWA shortcut / deep link); then the view of this
 * tab's history entry (a reload lands where this tab was — state/appHistory.ts;
 * lastView is the last view of ANY tab); otherwise lastView is restored.
 */
export function pickBootView(search: string, lastView: ViewMode, entry?: unknown): ViewMode {
  const paramView = new URLSearchParams(search).get('view');
  const kept = (entry as { v?: unknown } | null | undefined)?.v;
  return isViewMode(paramView) ? paramView : isViewMode(kept) ? kept : lastView;
}
