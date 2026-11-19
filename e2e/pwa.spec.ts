import { test, expect, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { seedWelcomeSeen } from './helpers/welcome';

// ─── The site's icon for search engines (2026-11-15) ─────────────────────────
// Google's search results take an icon in BMP, GIF, ICO, PNG, JPEG, PPM or
// TIFF (not SVG) from the home page's rel="icon"; /favicon.ico answers
// whatever asks without reading a page. Both are FILES: from the server
// without a worker (a crawler), and still the files once the app's worker
// controls the browser (neither is ever the app's shell).
const ICON_TYPE = /^image\/(?:x-icon|vnd\.microsoft\.icon)$/;
const sha256 = (b: Buffer) => createHash('sha256').update(b).digest('hex');
const SITE_ICONS = [
  { url: '/favicon.ico', type: ICON_TYPE, file: 'public/favicon.ico' },
  { url: '/icon-192.png', type: /^image\/png$/, file: 'public/icon-192.png' },
] as const;
async function isBuild(page: Page): Promise<boolean> {
  const manifest = await page.request.get('/manifest.webmanifest');
  return (manifest.headers()['content-type'] ?? '').includes('json');
}

test.describe('the site\'s icon for search engines (2026-11-15)', () => {
  test('without a worker (a crawler): /favicon.ico and /icon-192.png are the files; the built home page lists the PNG as rel="icon" first, then the SVG', async ({ page }) => {
    test.skip(!(await isBuild(page)), 'the built files and headers: run with playwright.preview.config.ts');
    for (const icon of SITE_ICONS) {
      const res = await page.request.get(icon.url);
      expect(res.status(), icon.url).toBe(200);
      expect(res.headers()['content-type'], icon.url).toMatch(icon.type);
      expect(sha256(await res.body()), `${icon.url} is ${icon.file}, byte for byte`).toBe(sha256(fs.readFileSync(icon.file)));
    }
    const home = await (await page.request.get('/')).text();
    const icons = [...home.matchAll(/<link\b[^>]*\brel="(?:icon|apple-touch-icon)"[^>]*>/g)].map((m) => m[0]);
    expect(icons, 'the built index.html').toEqual([
      '<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />',
      '<link rel="icon" type="image/svg+xml" href="/icon.svg" />',
      '<link rel="apple-touch-icon" href="/icon-192.png" />',
    ]);
    expect(home).not.toMatch(/<link\b[^>]*favicon/);
  });

  test('with the app\'s worker in control: fetched, drawn and typed as an address, both are still the files, never the app\'s shell; favicon.ico is not precached', async ({ page }) => {
    test.skip(!(await isBuild(page)), 'no service worker on the dev server (devOptions disabled)');
    await page.goto('/');
    await page.waitForFunction(() => navigator.serviceWorker.controller?.state === 'activated', undefined, { timeout: 20_000 });
    for (const icon of SITE_ICONS) {
      // As the page (or the browser's own icon request) fetches it: not a navigation.
      const got = await page.evaluate(async (url) => {
        const r = await fetch(url);
        const digest = await crypto.subtle.digest('SHA-256', await r.arrayBuffer());
        const img = new Image();
        img.src = url;
        await img.decode();
        return { status: r.status, type: r.headers.get('content-type'), sha: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join(''), drawn: [img.naturalWidth, img.naturalHeight] };
      }, icon.url);
      expect(got.status, icon.url).toBe(200);
      expect(got.type, icon.url).toMatch(icon.type);
      expect(got.sha, `${icon.url} is ${icon.file}, byte for byte`).toBe(sha256(fs.readFileSync(icon.file)));
      expect(got.drawn[0], `${icon.url} decodes as an image`).toBeGreaterThan(0);
      expect(got.drawn[0], `${icon.url} is square`).toBe(got.drawn[1]);
      expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    }
    // As a typed address (a navigation): a precached file comes from the
    // precache (the PNG, the manifest's icon); the worker's fallback answers
    // only the app's own address (since 2026-11-18), and favicon.ico is on
    // its denylist too, so it comes from the server.
    for (const icon of SITE_ICONS) {
      const res = (await page.goto(icon.url))!;
      expect(res.status(), icon.url).toBe(200);
      expect(res.headers()['content-type'], icon.url).toMatch(icon.type);
      expect(sha256(await res.body()), `${icon.url}, typed, is ${icon.file}`).toBe(sha256(fs.readFileSync(icon.file)));
      expect(res.fromServiceWorker(), `${icon.url}: from the precache (png) or the server (ico)`).toBe(icon.url === '/icon-192.png');
    }
    const cached = await page.evaluate(async () => {
      const out: string[] = [];
      for (const name of await caches.keys()) for (const req of await (await caches.open(name)).keys()) out.push(new URL(req.url).pathname);
      return out;
    });
    expect(cached).toContain('/icon-192.png'); // known positive: the precache is there and readable
    expect(cached.filter((u) => /favicon/.test(u))).toEqual([]);
  });
});

test.describe('PWA basics', () => {
  test('page has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Fermatina — Music theory, from the instrument out');
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
    expect(manifest.name).toBe('Fermatina — Music Theory');
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
    // Prompt mode: the ONLY skipWaiting is inside the SKIP_WAITING message
    // handler that the "new version — reload" toast triggers. autoUpdate
    // emitted an unconditional self.skipWaiting() and reloaded on its own.
    expect(text).toContain('SKIP_WAITING');
    expect(text.match(/skipWaiting/g) ?? []).toHaveLength(1);
  });

  test('a new version waits, asks, and one tap on Reload applies it (W9-06, prompt mode in a real browser)', async ({ page, baseURL }) => {
    const manifest = await page.request.get('/manifest.webmanifest');
    test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'No service worker on the dev server (devOptions disabled)');

    // A tiny proxy in front of `vite preview` plays the deploy: while `deployed`
    // is false it relays everything untouched; once true it serves /sw.js with
    // one extra comment, so the browser sees NEW worker bytes and installs a new
    // version. (Playwright routes do not see the browser's own sw.js update
    // fetch, and dist/ must stay untouched, hence the proxy.)
    let deployed = false;
    const proxy = createServer((req, res) => {
      void (async () => {
        const upstream = await fetch(new URL(req.url ?? '/', baseURL), { method: req.method, redirect: 'manual' });
        let body = Buffer.from(await upstream.arrayBuffer());
        if (deployed && new URL(req.url ?? '/', 'http://x').pathname === '/sw.js') {
          body = Buffer.concat([body, Buffer.from('\n// e2e: a new version was deployed\n')]);
        }
        res.statusCode = upstream.status;
        upstream.headers.forEach((value, name) => {
          if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(name)) res.setHeader(name, value);
        });
        res.setHeader('content-length', body.length);
        res.end(body);
      })().catch(() => { res.statusCode = 502; res.end(); });
    });
    await new Promise<void>((resolve) => proxy.listen(0, '127.0.0.1', resolve));
    try {
      const origin = `http://localhost:${(proxy.address() as AddressInfo).port}`;
      const workerState = () => page.evaluate(async () => {
        const reg = await navigator.serviceWorker.getRegistration();
        return { controlled: !!navigator.serviceWorker.controller, waiting: reg?.waiting?.state ?? null, active: reg?.active?.state ?? null };
      });

      // First install: the worker takes control of the open page (clientsClaim).
      // The proxy is its own origin: the config's "welcome seen" seed is not there.
      await seedWelcomeSeen(page.context());
      await page.goto(`${origin}/`);
      await expect.poll(async () => (await workerState()).controlled, { timeout: 20_000 }).toBe(true);
      await expect(page.getByRole('alert').filter({ hasText: /offline/i })).toBeVisible({ timeout: 15_000 });

      // The learner is using the app (a key press): mid-use, an update ASKS.
      // (W9b: at an untouched fresh start with nothing in progress it would
      // apply silently instead — e2e/update-robustness.spec.ts.)
      await page.keyboard.press('Shift');
      // A new version goes live; the page marks THIS load (it vanishes on reload).
      deployed = true;
      await page.evaluate(() => { (window as unknown as { __pageLoad: number }).__pageLoad = 1; });
      await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())!.update(); });

      // The new worker installs and WAITS — it must not activate by itself…
      await expect.poll(async () => (await workerState()).waiting, { timeout: 15_000 }).toBe('installed');
      // …the learner is asked…
      const toast = page.getByRole('alert').filter({ hasText: /new version/i });
      await expect(toast).toBeVisible();
      // …and nothing happened behind their back: same page, still waiting.
      await page.waitForTimeout(1000);
      expect(await page.evaluate(() => (window as unknown as { __pageLoad?: number }).__pageLoad)).toBe(1);
      expect((await workerState()).waiting).toBe('installed');

      // One tap on Reload activates the waiting worker and reloads the page.
      const reloaded = page.waitForEvent('load', { timeout: 15_000 });
      await toast.getByRole('button', { name: /^reload$/i }).click();
      await reloaded;

      await expect(page.locator('#root')).not.toBeEmpty();
      expect(await page.evaluate(() => (window as unknown as { __pageLoad?: number }).__pageLoad)).toBeUndefined();
      await expect.poll(workerState, { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
      await expect(page.getByRole('alert').filter({ hasText: /new version/i })).toHaveCount(0);
    } finally {
      await new Promise<void>((resolve) => proxy.close(() => resolve()));
    }
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
    // W9-22 / W11-A: the stack sits ABOVE the instrument dock, never on it.
    const dock = (await page.getByTestId('instrument-dock').boundingBox())!;
    const dockBox = { top: dock.y, bottom: dock.y + dock.height, left: dock.x, right: dock.x + dock.width };
    for (const b of boxes) expect(overlap(b, dockBox)).toBe(false);
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

    // registration.active can already exist while the worker is ACTIVATING,
    // before clientsClaim takes control. A fixed sleep races that takeover
    // under load, so the next navigation can hit the disconnected network.
    // Activated + controlling means precaching and the first claim finished.
    await page.waitForFunction(
      () => navigator.serviceWorker.controller?.state === 'activated',
      undefined,
      { timeout: 15_000 },
    );

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
