import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// 2026-10-31 (W9, review B2): every release until 2026-11-14 ships workbox
// skipWaiting (ONE_OFF_SKIP_WAITING in vite.config.ts) so installed clients
// still on the old autoUpdate code — which only reloads on `activated` — keep
// updating. While it is on the built worker skips waiting on its own. It is
// removed in the first release after 2026-11-14 (the dated
// src/__tests__/oneOffSkipWaiting.test.ts fails until it is); delete this
// branch then.
const ONE_OFF_SKIP_WAITING = /const ONE_OFF_SKIP_WAITING = true\b/.test(readFileSync('vite.config.ts', 'utf8'));

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

  test('updates wait for the learner: the built worker only skips waiting when asked (W9-06)', async ({ page }) => {
    const res = await page.request.get('/sw.js');
    const text = await res.text();
    test.skip(
      !res.ok() || !text.includes('precacheAndRoute'),
      'No built service worker on the dev server (devOptions disabled)',
    );
    // First install still controls the open page (runtime caching from visit one).
    expect(text).toContain('clientsClaim()');
    if (ONE_OFF_SKIP_WAITING) {
      // Transition window (see the note at the top): skips waiting by itself.
      expect(text).toContain('skipWaiting()');
      return;
    }
    // Prompt mode: the ONLY skipWaiting is inside the SKIP_WAITING message
    // handler that the "new version — reload" toast triggers. autoUpdate
    // emitted an unconditional self.skipWaiting() and reloaded on its own.
    expect(text).toContain('SKIP_WAITING');
    expect(text.match(/skipWaiting/g) ?? []).toHaveLength(1);
  });

  test('PWA toasts stack instead of covering each other (review B1)', async ({ page }) => {
    await page.goto('/');
    const manifest = await page.request.get('/manifest.webmanifest');
    test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'No SW / manifest on the dev server');

    // First install → "ready to work offline"; then a (synthetic) install offer.
    await expect(page.getByRole('alert').filter({ hasText: /offline/i })).toBeVisible({ timeout: 15_000 });
    await page.evaluate(() => {
      const e = new Event('beforeinstallprompt') as Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };
      e.prompt = async () => {};
      e.userChoice = Promise.resolve({ outcome: 'dismissed' });
      window.dispatchEvent(e);
    });
    await expect(page.getByRole('alert')).toHaveCount(2);

    const boxes = await page.getByRole('alert').evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    }));
    const overlap = (a: typeof boxes[0], b: typeof boxes[0]) =>
      a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    expect(overlap(boxes[0], boxes[1])).toBe(false);
    // Both toasts' own buttons are the hit target at their centre (nothing on top).
    for (const name of [/dismiss/i, /install/i]) {
      const btn = page.getByRole('alert').getByRole('button', { name }).first();
      const box = (await btn.boundingBox())!;
      const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('button')?.getAttribute('aria-label') ?? document.elementFromPoint(x, y)?.closest('button')?.textContent, [box.x + box.width / 2, box.y + box.height / 2]);
      expect(String(hit)).toMatch(name);
    }
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
