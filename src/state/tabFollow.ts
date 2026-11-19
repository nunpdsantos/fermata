/**
 * Following other tabs, loaded by the stores that follow (Learn progress,
 * Drill, fingerings), each from its own lazy chunk — never with the entry
 * (fix pass, 2026-11-19). `state/tabSync.ts` does the following; this only
 * loads it. A failed download costs nothing: saving never depends on it
 * (state/tabSafe.ts and tabMerge.ts are in the entry). It is tried again
 * when the browser is back online or the page is shown again; a second try
 * that succeeds never follows twice (followOtherTabs replaces its own).
 * Whether the browser fetches a failed module again depends on the browser:
 * WHATWG's "do not cache failed module fetches" (whatwg/html#10327, merged
 * 2026-07-15) is behind a runtime flag in Chromium and fixed in WebKit
 * (read 2026-11-19); where it is not, following resumes on the next visit.
 */
import type { Followed } from './tabSync';

export function followSoon<S extends object>(name: string, store: Followed<S>, keep?: readonly (keyof S)[]): void {
  const go = (): void => {
    import('./tabSync').then(
      (m) => void m.followOtherTabs(name, store, keep),
      () => {
        addEventListener('online', go, { once: true });
        document.addEventListener('visibilitychange', go, { once: true });
      },
    );
  };
  go();
}
