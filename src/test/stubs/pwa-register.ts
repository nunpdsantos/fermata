/**
 * Test stub for the `virtual:pwa-register` module that vite-plugin-pwa
 * provides in real builds. Without it, vitest coverage cannot transform
 * usePWA.ts and silently excluded it from coverage (audit R-02).
 *
 * It records what the app registered with, so tests can play the plugin's
 * part: fire `onNeedRefresh` / `onOfflineReady`, hand over a registration via
 * `onRegisteredSW`, and see whether the app asked to activate an update.
 */
export interface RegisterSWOptions {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegisteredSW?: (swUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: unknown) => void;
}

export const pwaRegisterStub = {
  /** Options from the most recent registerSW() call (undefined if none). */
  lastOptions: undefined as RegisterSWOptions | undefined,
  registerCalls: 0,
  /** Each call of the returned updateServiceWorker(reloadPage) function. */
  updateCalls: [] as Array<boolean | undefined>,
  reset() {
    this.lastOptions = undefined;
    this.registerCalls = 0;
    this.updateCalls = [];
  },
};

export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void> {
  pwaRegisterStub.lastOptions = options;
  pwaRegisterStub.registerCalls++;
  return async (reloadPage?: boolean) => {
    pwaRegisterStub.updateCalls.push(reloadPage);
  };
}
