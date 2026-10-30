import { lazy, Suspense, useCallback, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import { applyUpdateOrReload } from '../hooks/usePWA.ts';
import { isChunkLoadError } from '../utils/chunkLoadError.ts';

export type ViewLoader = () => Promise<{ default: ComponentType }>;

function ViewLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text-muted)' }} />
    </div>
  );
}

function ViewErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8">
        <p className="text-zinc-400 text-sm mb-4">{t('error.viewError')}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          {t('common.tryAgain')}
        </button>
      </div>
    </div>
  );
}

// The lazy() wrappers outlive any one ViewSlot: App remounts the slot on every
// view switch (AnimatePresence keys its wrapper by view), and a fresh lazy()
// per mount would flash the spinner each time. Keyed by the (stable) loaders
// table; a retry swaps in a new wrapper for the failed view only.
const lazyCache = new WeakMap<object, Record<string, ComponentType>>();

function lazyViews<K extends string>(loaders: Record<K, ViewLoader>): Record<K, ComponentType> {
  let views = lazyCache.get(loaders) as Record<K, ComponentType> | undefined;
  if (!views) {
    views = {} as Record<K, ComponentType>;
    for (const key of Object.keys(loaders) as K[]) views[key] = lazy(loaders[key]);
    lazyCache.set(loaders, views);
  }
  return views;
}

/**
 * Renders one code-split view behind its own error boundary, with a "Try
 * again" that can actually recover (audit W9-03 / F-07).
 *
 * React caches a rejected `lazy()` import permanently, so resetting the
 * boundary alone re-throws the same failure. "Try again" therefore:
 *  - after a failed DOWNLOAD while online — typically a deploy has replaced
 *    the old file names (they 404) or a network blip — reloads (activating a
 *    waiting app update first, see usePWA), so the browser fetches current
 *    files with a fresh module map;
 *  - otherwise (offline, or a render error) builds a fresh `lazy()` for that
 *    view only and re-renders, so the download is attempted again.
 * Nothing here reloads on its own: only the learner's tap does.
 */
export function ViewSlot<K extends string>({ viewKey, loaders }: { viewKey: K; loaders: Record<K, ViewLoader> }) {
  const [, setAttempt] = useState(0);

  const retry = useCallback(
    (error: Error, reset: () => void) => {
      if (isChunkLoadError(error) && navigator.onLine) {
        void applyUpdateOrReload();
        return;
      }
      lazyCache.set(loaders, { ...lazyViews(loaders), [viewKey]: lazy(loaders[viewKey]) });
      setAttempt((n) => n + 1);
      reset();
    },
    [viewKey, loaders],
  );

  const View: ComponentType = lazyViews(loaders)[viewKey];
  return (
    <ErrorBoundary
      resetKey={viewKey}
      fallback={(error, reset) => <ViewErrorFallback onRetry={() => retry(error, reset)} />}
    >
      <Suspense fallback={<ViewLoadingFallback />}>
        <View />
      </Suspense>
    </ErrorBoundary>
  );
}
