import type { BrowserContext } from '@playwright/test';

/**
 * The first-visit welcome (src/state/welcomeGate.ts) is a modal sheet shown to
 * a browser with nothing saved. Specs that start from empty storage test
 * something else, so both Playwright configs seed its "seen" flag through
 * `storageState` (it reaches the `page` fixture AND every
 * `browser.newContext()` in a test — Playwright applies config `use` options
 * to those too). A spec that loads the app from ANOTHER origin (the deploy
 * proxies in pwa.spec / update-robustness.spec) seeds it with
 * `seedWelcomeSeen(context)`. e2e/welcome.spec.ts empties storage to test the
 * welcome itself.
 */
export const WELCOME_KEY = 'fermata-welcome-v1';
export const WELCOME_SEEN = 'seen';

/**
 * The guitar neck (brief D, 2026-11-10): a browser with NO saved settings
 * draws the neck as tab and chord charts do (nut left, thin string on top).
 * The existing specs were written against the old view (nut right, thick
 * string on top), which a learner with saved settings keeps — so beside the
 * welcome seed they start as such a learner: a settings save that exists
 * without the neck fields. A spec that writes its own settings save gets the
 * old view the same way (its save has no neck fields); e2e/neck-orientation
 * .spec.ts seeds each orientation itself, the new default included.
 */
export const SETTINGS_KEY = 'music-theory-app';
export const LEGACY_NECK_SAVE = JSON.stringify({ state: {}, version: 6 });

export function welcomeSeenState(origin: string) {
  return {
    cookies: [],
    origins: [{ origin, localStorage: [
      { name: WELCOME_KEY, value: WELCOME_SEEN },
      { name: SETTINGS_KEY, value: LEGACY_NECK_SAVE },
    ] }],
  };
}

/** For pages on an origin the config's storageState does not cover. */
export async function seedWelcomeSeen(context: BrowserContext): Promise<void> {
  await context.addInitScript(([key, value, settingsKey, settings]) => {
    try {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, value);
        // First load on this origin: the old neck, as for the config's
        // storageState (a later load keeps whatever the app saved).
        if (localStorage.getItem(settingsKey) === null) localStorage.setItem(settingsKey, settings);
      }
    } catch {
      // storage blocked: nothing to seed
    }
  }, [WELCOME_KEY, WELCOME_SEEN, SETTINGS_KEY, LEGACY_NECK_SAVE] as const);
}
