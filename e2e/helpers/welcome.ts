import type { BrowserContext } from '@playwright/test';

/**
 * The first-visit gate (src/state/welcomeGate.ts) shows a browser with nothing
 * saved the start screen (wave 1; a welcome sheet before it), IN PLACE of the
 * app. Specs that start from empty storage test something else, so both
 * Playwright configs seed its "seen" flag through
 * `storageState` (it reaches the `page` fixture AND every
 * `browser.newContext()` in a test — Playwright applies config `use` options
 * to those too). A spec that loads the app from ANOTHER origin (the deploy
 * proxies in pwa.spec / update-robustness.spec) seeds it with
 * `seedWelcomeSeen(context)`. e2e/start-screen.spec.ts empties storage to
 * test the start screen itself.
 */
export const WELCOME_KEY = 'fermata-welcome-v1';
export const WELCOME_SEEN = 'seen';

export function welcomeSeenState(origin: string) {
  return {
    cookies: [],
    origins: [{ origin, localStorage: [{ name: WELCOME_KEY, value: WELCOME_SEEN }] }],
  };
}

/** For pages on an origin the config's storageState does not cover. */
export async function seedWelcomeSeen(context: BrowserContext): Promise<void> {
  await context.addInitScript(([key, value]) => {
    try {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, value);
    } catch {
      // storage blocked: nothing to seed
    }
  }, [WELCOME_KEY, WELCOME_SEEN] as const);
}
