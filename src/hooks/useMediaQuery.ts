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

/** The phone layout (D-26): instrument as a pull-up sheet, Drill in the thumb zone. */
export const PHONE_QUERY = '(max-width: 639px)';

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
