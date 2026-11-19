import fs from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { auditPage } from './helpers/designAudit';
import { NEW_STRINGS, LANGUAGE_NAMES } from '../src/site/strings';

/**
 * The site's own not-found page (2026-11-18, audits A21 / Q12). A mistyped
 * address used to get the host's bare 404 (no name, no way back). Vercel
 * serves dist/404.html with status 404 for every address that matches no
 * file (vercel.com/docs/routing/custom-404-pages); `vite preview` answers the
 * same way here (vite.config.ts `previewNotFound`), so this spec runs on the
 * build and skips, with a note, on the dev server.
 *
 *  - an unknown address, at the root or under a language, answers 404 with
 *    the page: the name, one sentence and the home and lesson catalogue of
 *    each language, in English, Portuguese and Spanish, with scripts off;
 *    noindex; nothing asked of another origin; every link answers 200;
 *  - the design audit at 320, 390 and 1440 px, day and night;
 *  - with the app installed (its service worker in control) the worker
 *    leaves an unknown address to the server, which answers the same 404
 *    page — never the app's own page at an address that is nobody's; offline
 *    such an address gets the browser's own "no connection", and the app's
 *    own address still opens from the worker.
 * With NOT_FOUND_SHOTS=<dir>, the screenshots for the seat and the owner.
 */

const LANGS = ['en', 'pt', 'es'] as const;
type Lang = (typeof LANGS)[number];
const HTML_LANG: Record<Lang, string> = { en: 'en', pt: 'pt-PT', es: 'es-ES' };
const LESSONS: Record<Lang, string> = { en: '/en/lessons/', pt: '/pt/licoes/', es: '/es/lecciones/' };
const json = <T,>(file: string) => JSON.parse(fs.readFileSync(file, 'utf8')) as T;
const LESSON_COUNT = Object.keys(json<Record<string, unknown>>('scripts/pages/slugs.json')).length;

/** Addresses that are no file of the build: the audit's two, one per language, a lesson's address mistyped, and a few more shapes. */
const UNKNOWN = [
  '/this-page-does-not-exist/',
  '/en/lessons/the-staff-and-clef/',
  '/pt/licoes/a-pauta-e-as-clave/',
  '/es/lecciones/no-existe/',
  '/en/lessons/nonexistent/',
  '/no-such-page',
  '/lessons/',
  '/en/lesson/?utm_source=test',
  // The app's page is /index.html; the host answers /index with 404 (no clean URLs). So must an installed app
  // (2026-11-19): Workbox's precache used to add ".html" to an address it did not hold, utm_ parameters dropped.
  '/index',
  '/index?utm_source=test',
];

test.beforeEach(async ({ request }) => {
  const res = await request.get('/en/');
  test.skip(!(await res.text()).includes('<h1 class="hero">'), 'the not-found page and the 404 status exist only on the build (npm run build): run with playwright.preview.config.ts');
});

/** The page as a learner reads it: the name, and per language its heading, its sentence and its two links. */
async function expectNotFoundPage(page: Page, where: string) {
  await expect(page.locator('h1'), where).toHaveText('Fermatina');
  await expect(page.locator('meta[name="robots"]'), where).toHaveAttribute('content', 'noindex');
  await expect(page.locator('script'), where).toHaveCount(0);
  for (const lang of LANGS) {
    const s = NEW_STRINGS[lang];
    const section = page.locator(`section[lang="${HTML_LANG[lang]}"]`);
    await expect(section.locator('h2'), `${where} ${lang}`).toHaveText(s.notFoundTitle);
    await expect(section.locator('p').first(), `${where} ${lang}`).toHaveText(s.notFoundLine);
    await expect(section.locator(`a[href="/${lang}/"]`), `${where} ${lang}`).toContainText(LANGUAGE_NAMES[lang]);
    await expect(section.locator(`a[href="${LESSONS[lang]}"]`), `${where} ${lang}`).toContainText(s.allLessons.replace('{{count}}', String(LESSON_COUNT)));
    await expect(section.locator('a'), `${where} ${lang}`).toHaveCount(2);
  }
}

test('an unknown address answers 404 with the site\'s own page, in English, Portuguese and Spanish, with scripts off', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  for (const address of UNKNOWN) {
    const res = await page.goto(address);
    expect(res!.status(), address).toBe(404);
    expect(res!.headers()['content-type'], address).toMatch(/^text\/html/);
    // The production headers, as on every other answer (vercel.json's catch-all rule).
    expect(res!.headers()['content-security-policy'], address).toContain("default-src 'self'");
    await expectNotFoundPage(page, address);
    // It is the page, not the app: no module script, no #root.
    await expect(page.locator('#root'), address).toHaveCount(0);
  }
  // Its links: the six pages answer 200, and the brand opens the app's home.
  const hrefs = await page.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.sort()).toEqual(['/', '/en/', '/en/lessons/', '/es/', '/es/lecciones/', '/pt/', '/pt/licoes/'].sort());
  for (const href of hrefs) expect((await page.request.get(href!)).status(), href!).toBe(200);
  // Followed like a link from deep inside a mistyped address: absolute paths, so they work at any depth.
  await page.goto('/en/lessons/the-staff-and-clef/');
  await page.locator('section[lang="pt-PT"]').getByRole('link', { name: LANGUAGE_NAMES.pt }).click();
  await expect(page).toHaveURL(/\/pt\/$/);
  await expect(page.locator('h1')).toHaveText('Fermatina');
  // Known positive for the recorder: the page's own files; nothing of another origin.
  const origin = new URL(baseURL!).origin;
  expect(requests.some((u) => u === `${origin}/pages.css`)).toBe(true);
  expect(requests.filter((u) => !u.startsWith(`${origin}/`))).toEqual([]);
  await context.close();
});

test('the page\'s own file, /404.html, is not in the sitemap and says noindex; an address that IS a page is unchanged', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('<loc>https://fermatina.com/en/</loc>'); // known positive
  expect(sitemap).not.toMatch(/404/);
  const file = await request.get('/404.html');
  expect(file.status()).toBe(200);
  expect(await file.text()).toContain('<meta name="robots" content="noindex">');
  for (const address of ['/', '/en/', '/en', '/pt/licoes/', '/robots.txt', '/manifest.webmanifest', '/?lesson=l1u3m1&lang=pt']) {
    expect((await request.get(address)).status(), address).toBe(200);
  }
});

const VIEWS = [
  { width: 320, height: 568, touch: true },
  { width: 390, height: 844, touch: true },
  { width: 1440, height: 900, touch: false },
];

for (const scheme of ['light', 'dark'] as const) {
  test(`${scheme === 'light' ? 'day' : 'night'}: the page passes the design audit at 320, 390 and 1440 px`, async ({ browser }) => {
    for (const v of VIEWS) {
      const context = await browser.newContext({ viewport: { width: v.width, height: v.height }, isMobile: v.touch, hasTouch: v.touch, javaScriptEnabled: false, colorScheme: scheme });
      const page = await context.newPage();
      const where = `${v.width}px ${scheme}`;
      expect((await page.goto('/this-page-does-not-exist/'))!.status(), where).toBe(404);
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg, where).toBe(scheme === 'light' ? 'rgb(245, 239, 226)' : 'rgb(24, 18, 8)');
      const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
      const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
      expect.soft(r.textNodes, `${where}: audited no text — the audit did not run`).toBeGreaterThan(5);
      expect.soft(r.targets, `${where}: audited no control`).toBeGreaterThan(5);
      expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
      expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
      expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
      expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
      expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
      const shots = process.env.NOT_FOUND_SHOTS;
      if (shots) await page.screenshot({ path: `${shots}/not-found-${v.width}-${scheme === 'light' ? 'day' : 'night'}.png`, fullPage: v.width !== 1440 });
      await context.close();
    }
  });
}

test('with the app installed, the worker leaves an unknown address to the server: the not-found page, never the app; offline, the browser\'s own error', async ({ page, context }) => {
  test.setTimeout(90_000);
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 20_000 }).toBe(true);
  // Known positive: an address of the app the precache does not hold literally is answered by the worker's navigation fallback.
  const app = await page.goto('/?view=explore');
  expect(app!.fromServiceWorker()).toBe(true);
  await expect(page.locator('script[type="module"]')).toHaveCount(1);
  for (const address of UNKNOWN) {
    const res = await page.goto(address);
    expect(res!.fromServiceWorker(), address).toBe(false);
    expect(res!.status(), address).toBe(404);
    await expectNotFoundPage(page, address);
    expect(await page.evaluate(() => !!navigator.serviceWorker.controller), address).toBe(true);
  }
  // Nothing of the page is cached by the worker.
  const cached = await page.evaluate(async () => {
    const out: string[] = [];
    for (const name of await caches.keys()) for (const req of await (await caches.open(name)).keys()) out.push(new URL(req.url).pathname);
    return out;
  });
  expect(cached).toContain('/index.html'); // known positive: the precache is there (stored with its revision in the query)
  expect(cached.filter((u) => /404/.test(u))).toEqual([]);

  // Offline (every request, the worker's included, refused; no HTTP cache): the app's
  // own address still opens from the worker, an unknown one is the browser's own error.
  await page.goto('/');
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await context.route('**/*', (route) => route.abort('internetdisconnected'));
  const offlineApp = await page.goto('/?view=explore');
  expect(offlineApp!.fromServiceWorker()).toBe(true);
  await expect(page.locator('#root')).toHaveCount(1);
  let error = '';
  await page.goto('/this-page-does-not-exist/').catch((e: Error) => { error = e.message; });
  expect(error).toMatch(/ERR_INTERNET_DISCONNECTED|ERR_FAILED/);
});
