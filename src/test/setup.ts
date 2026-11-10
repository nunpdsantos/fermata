/**
 * Vitest setup (after the i18n bootstrap, see vitest.config.ts).
 *
 * jsdom has no BroadcastChannel, but Node's global one leaks through — and it
 * connects EVERY module instance in the process: a usePWA from an earlier
 * test (vi.resetModules) would answer a later test's "is another tab busy?"
 * (src/services/otherTabs.ts). Tests run without one; a test that needs
 * cross-tab messages installs its own fake.
 */
(globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = undefined;

/**
 * The guitar neck (brief D, 2026-11-10): a browser with NO saved settings now
 * draws the neck as tab and chord charts do (nut left, thin string on top).
 * The existing tests were written against the old view, which a learner
 * with saved settings keeps — so every test file starts as such a learner:
 * a settings save that exists, without the neck fields. A test of the new
 * default clears storage and rehydrates (or sets the fields) itself.
 * (Same save as the e2e helpers' `LEGACY_NECK_SAVE`, e2e/helpers/welcome.ts.)
 */
try {
  localStorage.setItem('music-theory-app', JSON.stringify({ state: {}, version: 6 }));
} catch {
  // a test environment without storage: nothing to seed
}
