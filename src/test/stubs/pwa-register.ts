/**
 * Test stub for the `virtual:pwa-register` module that vite-plugin-pwa
 * provides in real builds. Without it, vitest coverage cannot transform
 * usePWA.ts and silently excluded it from coverage (audit R-02).
 */
export interface RegisterSWOptions {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegisteredSW?: (swUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: unknown) => void;
}

export function registerSW(_options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void> {
  return async () => {};
}
