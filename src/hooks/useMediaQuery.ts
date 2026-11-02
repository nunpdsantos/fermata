import { useCallback, useSyncExternalStore } from 'react';

// Environments without matchMedia (jsdom in unit tests) read as "no match".
const hasMatchMedia = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!hasMatchMedia()) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => hasMatchMedia() && window.matchMedia(query).matches,
    () => false,
  );
}

/** The phone layout (D-26): Drill in the thumb zone. */
export const PHONE_QUERY = '(max-width: 639px)';

/**
 * Where the instrument is a pull-up sheet (and toasts a band under the top
 * bar): phones, AND any short screen — a phone in landscape (844×390) is
 * wide, but a docked panel there left 0–6 px for the view (W11-A review).
 * index.css uses the same media query.
 */
export const SHEET_QUERY = '(max-width: 639px), (max-height: 500px)';

/** Below 640px (phone) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/** Between 640px and 1023px (tablet) */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

/** Below 1024px (phone or tablet) */
export function useIsCompact(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}
