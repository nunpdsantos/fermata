/* eslint-disable no-restricted-syntax -- theme-color meta tag values are
   set inline because they must match the :root CSS vars exactly. Moving
   them to tokens creates a sync-or-drift problem with the source-of-truth
   CSS. */
import { useEffect } from 'react';
import { useAppStore } from '../state/store.ts';

type AppliedTheme = 'fermata' | 'fermata-night';

const THEME_COLOR: Record<AppliedTheme, string> = {
  fermata: '#f5efe2',
  'fermata-night': '#181208',
};

/**
 * Syncs the theme preference from the store to the <html> element class.
 * - 'fermata': no class (CSS variables default to Fermata day)
 * - 'fermata-night': .fermata-night class (warm walnut/espresso dark variant)
 *
 * There is no system/media-query mode — theme is always explicit.
 */
export function useTheme() {
  const themeMode = useAppStore((s) => s.themeMode);

  useEffect(() => {
    const root = document.documentElement.classList;
    root.toggle('fermata-night', themeMode === 'fermata-night');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLOR[themeMode]);
  }, [themeMode]);
}
