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
