import { test, expect } from '@playwright/test';

test.describe('PWA basics', () => {
  test('page has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Fermata — Music theory, from the instrument out');
  });

  test('manifest is served at /manifest.webmanifest', async ({ page }) => {
    const response = await page.goto('/manifest.webmanifest');
    expect(response).not.toBeNull();
    // The dev server does not serve the PWA manifest (devOptions disabled in
    // vite.config.ts) — it SPA-fallbacks to index.html. Against
    // `vite preview`/production this must be real JSON with status 200.
    const contentType = response!.headers()['content-type'] ?? '';
    test.skip(
      !contentType.includes('json'),
      'PWA manifest not served by the dev server (devOptions disabled)',
    );
    expect(response!.status()).toBe(200);

    const manifest = await response!.json();
    expect(manifest.name).toBe('Fermata — Music Theory');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('service worker registers in production-like mode', async ({ page }) => {
    await page.goto('/');

    // Wait for app to load
    await expect(page.locator('#root')).not.toBeEmpty();

    const swSupported = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(swSupported).toBe(true);

    // The dev service worker is disabled (vite.config.ts devOptions.enabled:
    // false), so this test only asserts registration against a production
    // build (`vite preview`), detected by the manifest being served.
    const manifestResponse = await page.request.get('/manifest.webmanifest');
    const contentType = manifestResponse.headers()['content-type'] ?? '';
    test.skip(
      !contentType.includes('json'),
      'SW does not register on the dev server (devOptions disabled)',
    );

    await page.waitForFunction(
      async () => (await navigator.serviceWorker.getRegistrations()).length > 0,
      undefined,
      { timeout: 10_000 },
    );
    const registrations = await page.evaluate(async () => {
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.length;
    });
    expect(registrations).toBeGreaterThanOrEqual(1);
  });

  test('Drill opens offline on a fresh profile (manifest shortcut path)', async ({ page, context }) => {
    await page.goto('/');
    // Skip against the dev server (no SW there) — same detection as above.
    const manifestResponse = await page.request.get('/manifest.webmanifest');
    const contentType = manifestResponse.headers()['content-type'] ?? '';
    test.skip(
      !contentType.includes('json'),
      'SW does not register on the dev server (devOptions disabled)',
    );

    // Wait for the service worker to activate and finish precaching.
    await page.waitForFunction(
      async () => !!(await navigator.serviceWorker.getRegistration())?.active,
      undefined,
      { timeout: 15_000 },
    );
    await page.waitForTimeout(1500);

    await context.setOffline(true);
    await page.goto('/?view=drill');

    // The advertised shortcut must land in Drill, not the error boundary.
    await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('This view encountered an error.')).toHaveCount(0);
    await context.setOffline(false);
  });

  test('app shell renders with correct structure', async ({ page }) => {
    await page.goto('/');

    // Skip-to-content link exists (accessibility)
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Main content area exists
    const main = page.locator('#main-content');
    await expect(main).toBeVisible();

    // Header with nav exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });
});
