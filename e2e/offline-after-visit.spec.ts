import { test, expect } from '@playwright/test';

/**
 * Review item 6 (W9): after ONE online visit, the app must open offline —
 * Explore, Learn's level list, the guitar dock and Quick Search — from the
 * service worker alone. `context.setOffline` does not stop the worker's own
 * fetches, so every network request (page AND worker) is aborted by a route
 * instead, and the page's HTTP cache is disabled through CDP: whatever works
 * below came out of the worker's caches. Production build only (preview).
 */
test('Explore, Learn, guitar and search open offline after one online visit', async ({ page, context }) => {
  await page.goto('/');
  const manifest = await page.request.get('/manifest.webmanifest');
  test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'No service worker on the dev server');

  await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, { timeout: 20_000 });
  await expect(page.locator('#explore-panel')).toBeVisible();
  await page.waitForTimeout(3000); // precache + cache warm-up settle

  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await context.route('**/*', (route) => route.abort('internetdisconnected'));

  await page.reload();
  const errorScreen = page.getByText('This view encountered an error.');

  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 10_000 });
  await expect(errorScreen).toHaveCount(0);

  await page.getByRole('tab', { name: 'Learn' }).click();
  await expect(page.getByText('Foundations of Music Literacy').first()).toBeVisible({ timeout: 10_000 });
  await expect(errorScreen).toHaveCount(0);

  await page.getByRole('tab', { name: 'Explore' }).click();
  await page.getByRole('tab', { name: 'Guitar' }).click();
  await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 10_000 });

  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 });
});
