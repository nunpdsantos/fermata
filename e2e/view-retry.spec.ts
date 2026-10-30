import { test, expect } from '@playwright/test';

/**
 * Audit W9-03: a view whose file failed to download recovers from "Try
 * again" once the network is back — in a real browser, where a failed
 * dynamic import is a real network error (not a test double). Works against
 * the dev server (/src/views/LearnView.tsx) and the preview build
 * (/assets/LearnView-<hash>.js).
 */
test('Learn recovers from a failed download via "Try again"', async ({ page }) => {
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
  const reloaded = page.waitForEvent('load', { timeout: 10_000 });
  await tryAgain.click();
  await reloaded;

  await expect(page.locator('#learn-panel')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('Foundations of Music Literacy')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('This view encountered an error.')).toHaveCount(0);
});
