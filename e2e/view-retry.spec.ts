import { test, expect } from '@playwright/test';

/**
 * Audit W9-03: a view whose file failed to download recovers from "Try
 * again" once the network is back — in a real browser, where a failed
 * dynamic import is a real network error (not a test double). Works against
 * the dev server (/src/views/LearnView.tsx) and the preview build
 * (/assets/LearnView-<hash>.js).
 */
test('Learn recovers from a failed download via "Try again"', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();

  // Make the Learn view's file fail to download.
  await page.context().route(/LearnView[^/]*\.(js|tsx)(\?.*)?$/, (route) => route.abort('internetdisconnected'));
  await page.getByRole('tab', { name: 'Learn' }).click();
  const tryAgain = page.getByRole('button', { name: /try again/i });
  await expect(tryAgain).toBeVisible({ timeout: 10_000 });

  // Network back; the learner taps "Try again". Online + failed download →
  // the app reloads to fetch current files (this also proves Chromium's
  // error wording is recognised as a failed download).
  await page.context().unroute(/LearnView[^/]*\.(js|tsx)(\?.*)?$/);
  // The reload may wait for the service worker: on a first visit (this test's) one may still be installing,
  // and "Try again" (hooks/usePWA.ts applyUpdateOrReload) asks the server for an update (up to
  // UPDATE_CHECK_TIMEOUT_MS, 5 s) and lets an installing worker finish (up to INSTALL_WAIT_MS, 8 s) before
  // it reloads; where a worker is then waiting and its takeover is lost, TAKEOVER_FALLBACK_MS (4 s) more
  // pass before the plain reload — 17 s at most, which this 20 s wait covers. Under a loaded machine the
  // first two took longer than the 10 s this waited before (the merged branch's whole-suite run,
  // 19 November 2026; measured at 7–8 s with the precache slowed, at 153caab too).
  const reloaded = page.waitForEvent('load', { timeout: 20_000 });
  await tryAgain.click();
  await reloaded;

  await expect(page.locator('#learn-panel')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('Foundations of Music Literacy')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('This view encountered an error.')).toHaveCount(0);
});
