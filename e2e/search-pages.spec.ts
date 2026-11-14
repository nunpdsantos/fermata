import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Browser, type BrowserContext, type Page, type Route } from '@playwright/test';
import { auditPage } from './helpers/designAudit';
import { LOCALE, type Lang } from './helpers/wave1';
import { MODULE_INDEX } from '../src/data/moduleIndex';
import ptTitles from '../src/data/moduleTitles.pt';
import esTitles from '../src/data/moduleTitles.es';

/**
 * The search pages (2026-11-14, scripts/pages/ + src/site/): plain HTML that
 * reads without JavaScript, written by `npm run build` after `vite build`.
 * They exist only in the BUILD, so this spec runs on `vite preview`
 * (playwright.preview.config.ts, the production headers) and skips, with a
 * note, on the dev server.
 *
 *  - with JavaScript OFF, a landing page, the lesson index, a lesson and the
 *    glossary in each language show their text and pass the design audit
 *    (font sizes, tap sizes, contrast, no sideways scroll, nothing cut off)
 *    at 320 (touch), 390 (touch) and 1440 px (mouse), day and night;
 *  - they ask nothing of any other origin;
 *  - the JSON-LD data block raises no CSP report and no console message
 *    under the production CSP;
 *  - "Open this lesson in Fermatina" (https://fermatina.com/?lesson=…&lang=…)
 *    opens the app on that lesson in the page's language for a first-time
 *    visitor, and leaves a saved language alone — fermatina.com is answered
 *    from this run's own server (`relay`) and resolved to this machine, so
 *    the live site is never contacted;
 *  - `?lang=pt` alone opens the start screen, in Portuguese;
 *  - once the app's service worker controls the browser, a lesson page is
 *    still the page (from the server), and no page was precached.
 * With PAGES_SHOTS=<dir>, the screenshots for the seat and the owner.
 */

test.use({ launchOptions: { args: ['--host-resolver-rules=MAP fermatina.com 127.0.0.1, MAP www.fermatina.com 127.0.0.1'] } });

const SLUGS = JSON.parse(fs.readFileSync('scripts/pages/slugs.json', 'utf8')) as Record<string, Record<Lang, string>>;
const json = <T,>(file: string) => JSON.parse(fs.readFileSync(file, 'utf8')) as T;
type Words = { start: { tagline: string; doorsHeading: string }; learn: { title: string }; nav: { musicTheory: string } };
const WORDS: Record<Lang, Words> = { en: json('src/i18n/locales/en.json'), pt: json('src/i18n/locales/pt.json'), es: json('src/i18n/locales/es.json') };
const LANGS: Lang[] = ['en', 'pt', 'es'];
const PATHS: Record<Lang, { lessons: string; words: string }> = { en: { lessons: 'lessons', words: 'words' }, pt: { lessons: 'licoes', words: 'palavras' }, es: { lessons: 'lecciones', words: 'palabras' } };
const LESSON = 'l1u3m1';
const titleOf = (id: string, lang: Lang) => (lang === 'en' ? MODULE_INDEX.find((m) => m.id === id)!.title : (lang === 'pt' ? ptTitles : esTitles)[id][0]);
const lessonPath = (lang: Lang, id = LESSON) => `/${lang}/${PATHS[lang].lessons}/${SLUGS[id][lang]}/`;

/** The four kinds of page in a language, and the h1 each shows. */
const pagesOf = (lang: Lang) => [
  { name: 'landing', path: `/${lang}/`, h1: WORDS[lang].nav.musicTheory, has: WORDS[lang].start.tagline },
  { name: 'index', path: `/${lang}/${PATHS[lang].lessons}/`, h1: WORDS[lang].learn.title, has: titleOf('l9u32m5', lang) },
  { name: 'lesson', path: lessonPath(lang), h1: titleOf(LESSON, lang), has: titleOf('l1u3m2', lang) },
  { name: 'glossary', path: `/${lang}/${PATHS[lang].words}/`, h1: null, has: '' },
];

test.beforeEach(async ({ request }) => {
  const res = await request.get('/en/');
  test.skip(!(await res.text()).includes('<h1 class="hero">'), 'the search pages exist only in the build (npm run build): run with playwright.preview.config.ts');
});

/** The design audit's rules (e2e/helpers/designAudit.ts), as wave1's `audit` asserts them. */
async function auditStatic(page: Page, touch: boolean, where: string) {
  const r = await auditPage(page, { minFontPx: 12, minTapPx: touch ? 44 : 36 });
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the audit did not run`).toBeGreaterThan(5);
  expect.soft(r.targets, `${where}: audited no control`).toBeGreaterThan(2);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
  return r;
}

const VIEWS = [
  { width: 320, height: 568, touch: true },
  { width: 390, height: 844, touch: true },
  { width: 1440, height: 900, touch: false },
];

for (const lang of LANGS) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`${lang}, ${scheme === 'light' ? 'day' : 'night'}: with JavaScript off, landing, index, lesson and glossary show their text and pass the design audit at 320, 390 and 1440 px`, async ({ browser }) => {
      test.setTimeout(120_000);
      for (const v of VIEWS) {
        const context = await browser.newContext({
          viewport: { width: v.width, height: v.height }, isMobile: v.touch, hasTouch: v.touch,
          javaScriptEnabled: false, colorScheme: scheme, locale: LOCALE[lang],
        });
        const page = await context.newPage();
        for (const p of pagesOf(lang)) {
          const where = `${p.path} ${v.width}px ${scheme}`;
          const res = await page.goto(p.path);
          expect(res?.status(), where).toBe(200);
          if (p.h1) await expect(page.locator('h1'), where).toHaveText(p.h1);
          else await expect(page.locator('h1'), where).toBeVisible();
          if (p.has) await expect(page.locator('main'), where).toContainText(p.has);
          expect((await page.locator('main').innerText()).length, where).toBeGreaterThan(p.name === 'landing' ? 400 : 1000);
          expect(await page.evaluate(() => document.documentElement.lang)).toBe(lang === 'en' ? 'en' : LOCALE[lang]);
          // The page is the page: no app shell (its module script), only the data block.
          await expect(page.locator('script[type="module"]'), where).toHaveCount(0);
          await expect(page.locator('script:not([type="application/ld+json"])'), where).toHaveCount(0);
          // Night by the system setting, as the app's tokens draw it.
          const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
          expect(bg, where).toBe(scheme === 'light' ? 'rgb(245, 239, 226)' : 'rgb(24, 18, 8)');
          await auditStatic(page, v.touch, where);
        }
        await context.close();
      }
    });
  }
}

test('the pages load only files of their own site: zero requests to another origin (landing, index, lesson, glossary, each language)', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  for (const lang of LANGS) for (const p of pagesOf(lang)) await page.goto(p.path, { waitUntil: 'load' });
  const origin = new URL(baseURL!).origin;
  // Known positive: the recorder sees the pages' own files (the stylesheet, a font).
  expect(requests.some((u) => u === `${origin}/pages.css`)).toBe(true);
  expect(requests.some((u) => u.startsWith(`${origin}/fonts/`))).toBe(true);
  expect(requests.filter((u) => !u.startsWith(`${origin}/`))).toEqual([]);
  await context.close();
});

test('under the production headers (vite preview serves vercel.json\'s CSP) the JSON-LD block raises no CSP report and no console message', async ({ browser, baseURL }) => {
  const vercel = json<{ headers: { source: string; headers: { key: string; value: string }[] }[] }>('vercel.json');
  const csp = vercel.headers.find((h) => h.source === '/(.*)')!.headers.find((h) => h.key === 'Content-Security-Policy')!.value;
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const w = window as unknown as { __csp: string[] };
    w.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  const page = await context.newPage();
  const messages: string[] = [];
  page.on('console', (m) => messages.push(`${m.type()}: ${m.text()}`));
  // Known positive: a page under the same CSP with an inline script IS reported.
  await page.route('**/__csp-probe/', (route) => route.fulfill({ status: 200, headers: { 'content-type': 'text/html', 'content-security-policy': csp }, body: '<!doctype html><title>probe</title><script>document.title = "ran"</script>' }));
  await page.goto('/__csp-probe/');
  await expect.poll(() => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp.length)).toBeGreaterThan(0);
  expect(await page.title()).toBe('probe');
  messages.length = 0;
  for (const lang of LANGS) {
    for (const p of pagesOf(lang)) {
      const res = await page.goto(p.path);
      expect(res!.headers()['content-security-policy']).toBe(csp);
      expect(await page.locator('script[type="application/ld+json"]').count()).toBe(1);
      expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp), `${p.path} ${baseURL}`).toEqual([]);
    }
  }
  expect(messages).toEqual([]);
  await context.close();
});

// ─── From a page into the app ────────────────────────────────────────────────

/** A request to fermatina.com, answered by this run's own server (the test fetches it; the browser never leaves the machine). */
async function relay(route: Route, local: string) {
  const request = route.request();
  const url = new URL(request.url());
  const accept = request.headers().accept;
  const upstream = await fetch(`${local}${url.pathname}${url.search}`, { method: request.method(), headers: accept ? { accept } : {}, redirect: 'manual' });
  const headers: Record<string, string> = {};
  upstream.headers.forEach((value, name) => {
    if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(name)) headers[name] = value;
  });
  await route.fulfill({ status: upstream.status, headers, body: Buffer.from(await upstream.arrayBuffer()) });
}

/** A browser whose fermatina.com is this run's server; storage as given (empty = a first visit). */
async function browserWithAddress(browser: Browser, baseURL: string, locale: string, stores: Record<string, string>): Promise<{ context: BrowserContext; page: Page; asked: string[] }> {
  const context = await browser.newContext({ serviceWorkers: 'block', locale, storageState: { cookies: [], origins: [] }, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const local = new URL(baseURL).origin;
  const asked: string[] = [];
  await context.route(/^https?:\/\/(www\.)?fermatina\.com(\/|$)/, (route) => {
    asked.push(route.request().url());
    return relay(route, local);
  });
  await context.routeWebSocket(/fermatina\.com/, (ws) => ws.close());
  await context.addInitScript((seed) => {
    if (location.hostname !== 'fermatina.com' || sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
    sessionStorage.setItem('__seeded', '1');
  }, stores);
  return { context, page: await context.newPage(), asked };
}

const savedLanguage = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app') ?? '{}').state?.language ?? null);

test('"Open this lesson in Fermatina": a first-time visitor lands in the app on that lesson, in the page\'s language (an English browser, a Portuguese page)', async ({ browser, baseURL }) => {
  const { context, page, asked } = await browserWithAddress(browser, baseURL!, 'en-GB', {});
  await page.goto(`https://fermatina.com${lessonPath('pt')}`);
  await expect(page.locator('h1')).toHaveText(titleOf(LESSON, 'pt'));
  await page.locator('a.button').first().click();
  await expect(page.getByRole('heading', { level: 1, name: titleOf(LESSON, 'pt') })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('app-topbar')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
  // The address bar loses the link's parameters; the language is now saved.
  await expect.poll(() => page.evaluate(() => location.search)).toBe('');
  expect(page.url()).toBe('https://fermatina.com/');
  await expect.poll(() => savedLanguage(page)).toBe('pt');
  expect(asked[0]).toBe(`https://fermatina.com${lessonPath('pt')}`);
  expect(asked).toContain(`https://fermatina.com/?lesson=${LESSON}&lang=pt`);
  await context.close();
});

test('"Open this lesson in Fermatina" leaves a saved language alone: an English learner following a Spanish page reads the lesson in English', async ({ browser, baseURL }) => {
  const settings = JSON.stringify({ state: { language: 'en' }, version: 6 });
  const { context, page } = await browserWithAddress(browser, baseURL!, 'es-ES', { 'fermata-welcome-v1': 'seen', 'music-theory-app': settings });
  await page.goto(`https://fermatina.com${lessonPath('es')}`);
  await page.locator('a.button').last().click();
  await expect(page.getByRole('heading', { level: 1, name: titleOf(LESSON, 'en') })).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect.poll(() => page.evaluate(() => location.search)).toBe('');
  expect(await savedLanguage(page)).toBe('en');
  await context.close();
});

test('?lang=pt alone (the landing page\'s "Abrir a Fermatina") shows the start screen, in Portuguese, to a first-time visitor', async ({ browser, baseURL }) => {
  const { context, page } = await browserWithAddress(browser, baseURL!, 'en-GB', {});
  await page.goto('https://fermatina.com/pt/');
  await page.locator('a.button').click();
  await expect(page.getByTestId('start-screen')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(WORDS.pt.start.tagline)).toBeVisible();
  await expect(page.getByRole('heading', { name: WORDS.pt.start.doorsHeading })).toBeVisible();
  await expect.poll(() => page.evaluate(() => location.search)).toBe('');
  await context.close();
});

// ─── The service worker ───────────────────────────────────────────────────────

test('with the app\'s service worker installed, a lesson page is still the page, from the server; no page, stylesheet or image was precached', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 20_000 }).toBe(true);
  // Known positive: an address that is no file gets the app's shell FROM the worker.
  const shell = await page.goto('/no-such-page');
  expect(shell!.fromServiceWorker()).toBe(true);
  await expect(page.locator('script[type="module"]')).toHaveCount(1);
  for (const lang of LANGS) {
    for (const target of [lessonPath(lang), `/${lang}/`]) {
      const res = await page.goto(target);
      expect(res!.fromServiceWorker(), target).toBe(false);
      expect(res!.status(), target).toBe(200);
      await expect(page.locator('script[type="module"]'), target).toHaveCount(0);
      await expect(page.locator('h1'), target).toHaveText(target.endsWith(`/${lang}/`) ? WORDS[lang].nav.musicTheory : titleOf(LESSON, lang));
      expect(await page.evaluate(() => !!navigator.serviceWorker.controller), target).toBe(true);
    }
  }
  const cached = await page.evaluate(async () => {
    const out: string[] = [];
    for (const name of await caches.keys()) for (const req of await (await caches.open(name)).keys()) out.push(new URL(req.url).pathname);
    return out;
  });
  expect(cached).toContain('/index.html'); // known positive: the precache is there and readable
  expect(cached.filter((u) => /^\/(en|pt|es)\/|^\/pages\.css$|^\/og\.png$|^\/sitemap\.xml$/.test(u))).toEqual([]);
});

// ─── Screenshots for the seat and the owner (PAGES_SHOTS=<dir>) ─────────────
const SHOTS = process.env.PAGES_SHOTS;
test.describe('screenshots', () => {
  test.skip(!SHOTS, 'PAGES_SHOTS not set');
  test('landing, index, a lesson and the glossary at 390 and 1440 px, EN and PT by day, one set by night; the preview image', async ({ browser }) => {
    test.setTimeout(120_000);
    fs.mkdirSync(SHOTS!, { recursive: true });
    const shots: [Lang, 'light' | 'dark', number][] = [['en', 'light', 390], ['en', 'light', 1440], ['pt', 'light', 390], ['pt', 'light', 1440], ['pt', 'dark', 390], ['es', 'dark', 1440]];
    for (const [lang, scheme, width] of shots) {
      const context = await browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 }, isMobile: width < 500, hasTouch: width < 500, javaScriptEnabled: false, colorScheme: scheme });
      const page = await context.newPage();
      for (const p of pagesOf(lang)) {
        await page.goto(p.path);
        await page.screenshot({ path: path.join(SHOTS!, `${lang}-${p.name}-${width}-${scheme === 'light' ? 'day' : 'night'}.png`) });
      }
      if (width === 390 && scheme === 'light') {
        await page.goto(lessonPath(lang));
        await page.screenshot({ path: path.join(SHOTS!, `${lang}-lesson-${width}-day-full.png`), fullPage: true });
      }
      await context.close();
    }
    fs.copyFileSync('public/og.png', path.join(SHOTS!, 'og.png'));
  });
});
