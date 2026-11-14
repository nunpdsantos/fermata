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
 * Every test file starts as a learner with a settings save that exists,
 * without the neck fields (brief D, 2026-11-10). From 2026-11-10 to
 * 2026-11-14 a browser with NO save drew the tab view and this seed kept the
 * suites on the old one; since 2026-11-14 both draw the same view (nut
 * right, thick string on top: facing a player), so the seed no longer
 * decides the neck. It stays so the suites keep booting the way they were
 * written (a save exists: the store's merge runs on load). A test of a
 * browser with nothing saved clears storage and rehydrates itself; a test of
 * the tab view sets the fields. (Same save as the e2e helpers'
 * `LEGACY_NECK_SAVE`, e2e/helpers/welcome.ts.)
 */
try {
  localStorage.setItem('music-theory-app', JSON.stringify({ state: {}, version: 6 }));
} catch {
  // a test environment without storage: nothing to seed
}
