import fs from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { auditPage } from './helpers/designAudit';

/**
 * The home page's way on when its script does not run (2026-11-18, audit
 * A18). Until then the initial HTML of `/` held only an empty #root: with
 * JavaScript off, or the app's script blocked or failing, a learner saw a
 * blank page and no path to the readable lessons. Now plain links to the
 * three language homes and their lesson catalogues follow the (still empty)
 * #root (index.html, `#boot-links`, no script):
 *
 *  - with scripts off they show at once (a <noscript> style) and pass the
 *    design audit at 390 and 1440 px;
 *  - when the app's script fails to load they show after a few seconds
 *    (CSS only: an animation delay keeps them hidden while the app loads);
 *  - once the app has put anything into #root they are gone (display: none,
 *    `#root:not(:empty)+#boot-links`): never shown on a normal start, checked
 *    on every frame from the first.
 * Runs on the dev server and on the build (index.html is the same file; on
 * the build it is served under the production CSP and precached).
 * With HOME_SHOTS=<dir>, the screenshots for the seat and the owner.
 */

const LINKS = (() => {
  const json = (l: string) => JSON.parse(fs.readFileSync(`src/i18n/locales/${l}.json`, 'utf8')) as { tracks: { lessonsLabel: string } };
  const NAMES = { en: 'English', pt: 'Português', es: 'Español' } as const;
  const INDEX = { en: '/en/lessons/', pt: '/pt/licoes/', es: '/es/lecciones/' } as const;
  return (['en', 'pt', 'es'] as const).flatMap((l) => [
    { href: `/${l}/`, name: NAMES[l] },
    { href: INDEX[l], name: json(l).tracks.lessonsLabel },
  ]);
})();

/** The entry script: the dev server's module, or the build's hashed file. */
const ENTRY = /\/src\/main\.tsx(?:\?|$)|\/assets\/index-[^/]+\.js$/;

async function expectLinksShown(page: Page, where: string) {
  const box = page.locator('#boot-links');
  await expect(box, where).toBeVisible();
  for (const { href, name } of LINKS) {
    const link = box.locator(`a[href="${href}"]`);
    await expect(link, `${where} ${href}`).toHaveText(name);
    await expect(link, `${where} ${href}`).toBeVisible();
  }
  await expect(box.locator('a'), where).toHaveCount(LINKS.length);
}

test('the initial HTML of the home page: #root empty, then the six links, with no script of their own', async ({ request }) => {
  const html = await (await request.get('/')).text();
  // The entry script follows the links in index.html; the build moves it into the head.
  const box = html.match(/<div id="root"><\/div>\s*<div id="boot-links">([\s\S]*?)<\/div>\s*(?:<script\b[^>]*>\s*<\/script>\s*)*<\/body>/);
  expect(box, 'an empty #root, then the links, the last thing in the body').not.toBeNull();
  for (const { href } of LINKS) expect(box![1]).toContain(`href="${href}"`);
  expect(box![1]).not.toContain('<script');
});

test('with scripts off, the home page shows the links at once, and they pass the design audit at 390 and 1440 px', async ({ browser, baseURL }) => {
  for (const v of [{ width: 390, height: 844, touch: true }, { width: 1440, height: 900, touch: false }]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: v.width, height: v.height }, isMobile: v.touch, hasTouch: v.touch });
    const page = await context.newPage();
    await page.goto('/');
    const where = `scripts off ${v.width}px`;
    // Shown from the first moment, not after the delay used when the script fails: looked at before any waiting.
    expect(await page.locator('#boot-links').evaluate((el) => [getComputedStyle(el).visibility, getComputedStyle(el).display].join()), where).toBe('visible,block');
    await expectLinksShown(page, where);
    const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
    const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
    expect.soft(r.targets, `${where}: audited no control`).toBeGreaterThanOrEqual(LINKS.length);
    expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
    expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
    expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
    expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
    expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
    const shots = process.env.HOME_SHOTS;
    if (shots) await page.screenshot({ path: `${shots}/home-scripts-off-${v.width}.png` });
    await context.close();
  }
  // On the build each link is a page of the site.
  const ctx = await browser.newContext();
  const isBuild = (await (await ctx.request.get(`${baseURL}/en/`)).text()).includes('<h1 class="hero">');
  if (isBuild) for (const { href } of LINKS) expect((await ctx.request.get(`${baseURL}${href}`)).status(), href).toBe(200);
  await ctx.close();
});

test('when the app\'s script fails to load, the links appear after a few seconds', async ({ page }) => {
  let blocked = 0;
  await page.route(ENTRY, (route) => { blocked++; return route.abort('failed'); });
  await page.goto('/');
  expect(blocked, 'the entry script was found and refused').toBe(1);
  // While the app might still be loading, nothing shows.
  expect(await page.locator('#boot-links').evaluate((el) => getComputedStyle(el).visibility)).toBe('hidden');
  await expect(page.locator('#boot-links')).toBeVisible({ timeout: 8_000 });
  await expectLinksShown(page, 'script failed');
  const shots = process.env.HOME_SHOTS;
  if (shots) await page.screenshot({ path: `${shots}/home-script-failed-1280.png` });
});

test('on a normal start the links are never shown, on any frame, and are gone (display: none) once the app has drawn', async ({ page }) => {
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { __boot: string[] }).__boot = seen;
    const look = () => {
      const el = document.getElementById('boot-links');
      const style = el && getComputedStyle(el);
      const state = !el ? 'absent' : style!.display === 'none' ? 'gone' : style!.visibility === 'visible' && el.getClientRects().length ? 'visible' : 'hidden';
      if (seen[seen.length - 1] !== state) seen.push(state);
      if (seen.length < 50) requestAnimationFrame(look);
    };
    requestAnimationFrame(look);
    document.addEventListener('readystatechange', look);
  });
  await page.goto('/');
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
  const display = () => page.locator('#boot-links').evaluate((el) => getComputedStyle(el).display);
  expect(await display()).toBe('none');
  await expect(page.locator('#boot-links')).toBeHidden();
  await page.waitForTimeout(4_500); // past the delay: nothing comes back
  expect(await display()).toBe('none');
  await expect(page.getByRole('link', { name: 'Português' })).toHaveCount(0); // not in the accessibility tree either
  const seen = await page.evaluate(() => (window as unknown as { __boot: string[] }).__boot);
  // Known positive: the document turns "interactive" before module scripts run, so the probe saw the links in the page, hidden.
  expect(seen).toContain('hidden');
  expect(seen).not.toContain('visible');
  expect(seen[seen.length - 1]).toBe('gone');
});

test('while hidden, the links ask for no font of their own: until the app\'s script has arrived, only the two preloaded faces are fetched', async ({ page }) => {
  test.setTimeout(60_000);
  // An italic heading once made the browser fetch the italic face as soon as the stylesheet arrived, beside the
  // app's script: on a slow connection the app drew ~600 ms later (measured 2026-11-18). The links use the preloaded face only.
  // A slow connection (1.6 Mb/s, 150 ms), so the entry script takes a while to arrive and a face fetched early shows.
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  await page.goto('/');
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 25_000 });
  await expect.poll(() => page.evaluate(() => performance.getEntriesByType('resource').some((e) => e.name.includes('/fonts/source-serif-4-italic-latin.woff2'))), { timeout: 20_000 }).toBe(true);
  const fonts = await page.evaluate(() => {
    const all = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const entry = all.find((e) => /\/assets\/index-[^/]+\.js$|\/src\/main\.tsx(?:\?|$)/.test(e.name))!;
    const faces = all.filter((e) => e.name.includes('/fonts/'));
    return {
      entryEnd: entry ? entry.responseEnd : null,
      before: faces.filter((e) => e.startTime < entry.responseEnd).map((e) => new URL(e.name).pathname).sort(),
      after: faces.filter((e) => e.startTime >= entry.responseEnd).map((e) => new URL(e.name).pathname),
    };
  });
  expect(fonts.entryEnd, 'the entry script was found').not.toBeNull();
  expect(fonts.before).toEqual(['/fonts/fermata-accidentals.woff2', '/fonts/source-serif-4-latin.woff2']);
  expect(fonts.after, 'known positive: the app itself asks for the italic face once it runs').toContain('/fonts/source-serif-4-italic-latin.woff2');
});
