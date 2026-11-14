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

/**
 * The guitar neck (brief D, 2026-11-10): beside the welcome seed the specs
 * start as a learner with a settings save that exists without the neck
 * fields — the legacy view, nut right, thick string on top. From 2026-11-10
 * to 2026-11-14 a browser with NO save drew the tab view instead and this
 * seed kept the specs on the old one; since 2026-11-14 a browser with
 * nothing saved draws the same view (facing a player) and saves nothing
 * about the neck, so the seed no longer decides the neck: it stays so the
 * specs keep booting as they were written (a save exists). A spec that
 * writes its own settings save gets the same view (no neck fields);
 * e2e/neck-orientation.spec.ts seeds each orientation itself, a browser
 * with nothing saved included, and the tab view is set explicitly wherever
 * a spec tests it.
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
