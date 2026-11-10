import { lazy, Suspense, useState } from 'react';
import { useShareFallbackStore } from '../../state/shareFallbackStore.ts';

const ShareFallbackSheet = lazy(() => import('./ShareFallbackSheet.tsx'));

/**
 * Always mounted (App). When a link could be neither shared nor copied
 * (services/shareLinkMake.ts), the sheet with the link in a selectable field
 * — its own small chunk, fetched the first time it is needed (precached).
 */
export function ShareLinkHost() {
  const url = useShareFallbackStore((s) => s.url);
  const [mounted, setMounted] = useState(false);
  if (url && !mounted) setMounted(true); // derive-during-render: load on first use
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <ShareFallbackSheet />
    </Suspense>
  );
}
