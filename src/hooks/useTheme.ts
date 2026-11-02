/* eslint-disable no-restricted-syntax -- theme-color meta tag values are
   set inline because they must match the :root CSS vars exactly. Moving
   them to tokens creates a sync-or-drift problem with the source-of-truth
   CSS. */
import { useEffect } from 'react';
import { useAppStore } from '../state/store.ts';
import { useMediaQuery } from './useMediaQuery.ts';
import type { ThemeMode } from '../state/storeTypes.ts';

export type AppliedTheme = 'fermata' | 'fermata-night';

const THEME_COLOR: Record<AppliedTheme, string> = {
  fermata: '#f5efe2',
  'fermata-night': '#181208',
};

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/** The theme a preference paints with: 'auto' follows the system setting. */
export function resolveTheme(mode: ThemeMode, systemDark: boolean): AppliedTheme {
  if (mode === 'auto') return systemDark ? 'fermata-night' : 'fermata';
  return mode;
}

/** The theme currently painted (reacts to the system setting under 'auto'). */
export function useResolvedTheme(): AppliedTheme {
  const themeMode = useAppStore((s) => s.themeMode);
  const systemDark = useMediaQuery(DARK_SCHEME_QUERY);
  return resolveTheme(themeMode, systemDark);
}

/**
 * Syncs the theme preference from the store to the <html> element class.
 * - 'fermata' (Day): no class (CSS variables default to Fermata day)
 * - 'fermata-night' (Night): .fermata-night class
 * - 'auto': follows prefers-color-scheme, live (W11-A Settings: Day / Night / Auto)
 *
 * index.html applies the same choice before first paint (no flash).
 */
export function useTheme() {
  const applied = useResolvedTheme();

  useEffect(() => {
    const root = document.documentElement.classList;
    root.toggle('fermata-night', applied === 'fermata-night');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLOR[applied]);
  }, [applied]);
}
