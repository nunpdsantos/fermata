import { useSyncExternalStore } from 'react';

function subscribeController(cb: () => void): () => void {
  const sw = typeof navigator !== 'undefined' ? navigator.serviceWorker : undefined;
  if (!sw) return () => {};
  sw.addEventListener('controllerchange', cb);
  return () => sw.removeEventListener('controllerchange', cb);
}

/**
 * True while a service worker controls this page — i.e. the app's files are
 * served from the offline cache. Settings only says "works offline" then.
 */
export function useServiceWorkerActive(): boolean {
  return useSyncExternalStore(
    subscribeController,
    () => typeof navigator !== 'undefined' && !!navigator.serviceWorker?.controller,
    () => false,
  );
}
