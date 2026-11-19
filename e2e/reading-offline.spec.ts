import fs from 'node:fs';
import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { NEW_STRINGS } from '../src/site/strings';

/**
 * What the reading pages say about working offline, against what happens
 * (2026-11-18, audit A17). Until then every page's foot said Fermatina
 * "works offline after your first visit"; but a reading page installs no
 * service worker, and the app's worker leaves /en/, /pt/, /es/ to the server
 * by design (vite.config.ts navigateFallbackDenylist / globIgnores, pinned by
 * check:sw). The foot now says what to open while online and what then works
 * offline: the app, not these pages. This spec proves that sentence from a
 * FRESH visit (no storage, no worker) that starts on a lesson page:
 *
 *  1. the page says it, and no longer says the old sentence;
 *  2. visiting the reading page alone installs nothing: offline, neither the
 *     page nor the app opens;
 *  3. online, open Fermatina once (the landing page's "Open Fermatina",
 *     taken on this run's own server), and the app then opens offline — the
 *     reading pages still do not.
 * Offline = every request refused, the worker's own included, and no HTTP
 * cache (as e2e/offline-after-visit.spec.ts does: `setOffline` does not stop
 * the worker's fetches). Build only (vite preview).
 */

test.use({ storageState: { cookies: [], origins: [] } });

const SLUGS = JSON.parse(fs.readFileSync('scripts/pages/slugs.json', 'utf8')) as Record<string, Record<'en' | 'pt' | 'es', string>>;
const LESSON = (lang: 'en' | 'pt' | 'es') => `/${lang}/${{ en: 'lessons', pt: 'licoes', es: 'lecciones' }[lang]}/${SLUGS.l1u3m1[lang]}/`;
/** The sentence the foot used to carry (src/i18n/locales/*.json start.footer, the app's start screen). */
const OLD = { en: 'Works offline after your first visit.', pt: 'Depois da primeira visita, funciona offline.', es: 'Tras la primera visita, funciona sin conexión.' };
/**
 * What the foot says now, spelled out here word for word (2026-11-19, review: a
 * PT rewording saying the pages work offline passed a test that compared the
 * page with the generator's own string).
 */
const FOOT = {
  en: 'Free. No account. Open Fermatina once while you are online, and from then on the app works offline; these reading pages need a connection. Your progress stays in this browser.',
  pt: 'Grátis. Sem conta. Abre a Fermatina uma vez com ligação à internet e, a partir daí, a app funciona offline; estas páginas de leitura precisam de ligação. O teu progresso fica neste navegador.',
  es: 'Gratis. Sin cuenta. Abre Fermatina una vez con conexión a internet y, a partir de entonces, la app funciona sin conexión; estas páginas de lectura necesitan conexión. Tu progreso se queda en este navegador.',
};

test.beforeEach(async ({ request }) => {
  const res = await request.get('/en/');
  test.skip(!(await res.text()).includes('<h1 class="hero">'), 'the reading pages exist only in the build (npm run build): run with playwright.preview.config.ts');
});

async function goOffline(context: BrowserContext, page: Page) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await context.route('**/*', (route) => route.abort('internetdisconnected'));
}
const opens = async (page: Page, address: string) => page.goto(address).then((r) => r?.status() ?? 0, () => 0);

for (const lang of ['en', 'pt', 'es'] as const) {
  test(`${lang}: every kind of page says what to open online and what then works offline, and no longer says "after your first visit"`, async ({ page }) => {
    for (const address of [`/${lang}/`, LESSON(lang)]) {
      await page.goto(address);
      const foot = await page.locator('footer').innerText();
      expect(foot, address).toContain(FOOT[lang]);
      expect(await page.locator('body').innerText(), address).not.toContain(OLD[lang]);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      for (const meta of [description, await page.locator('meta[property="og:description"]').getAttribute('content'), await page.locator('meta[name="twitter:description"]').getAttribute('content')]) {
        expect(meta, address).not.toContain(OLD[lang]);
      }
    }
  });
}

test('from a fresh visit to a lesson page: nothing works offline; after opening Fermatina once online, the app does and the reading pages still do not', async ({ page, context }) => {
  test.setTimeout(90_000);
  // 1. A fresh visit to a reading page, and what it says.
  await page.goto(LESSON('en'));
  const foot = await page.locator('footer').innerText();
  await page.waitForTimeout(2_000);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  expect(await page.evaluate(() => caches.keys())).toEqual([]);

  // 2. Offline after that visit alone: neither the page again nor the app.
  await goOffline(context, page);
  expect(await opens(page, LESSON('en')), 'the lesson page offline').toBe(0);
  expect(await opens(page, '/'), 'the app offline').toBe(0);
  await context.unrouteAll({ behavior: 'ignoreErrors' });
  // So the page must not promise "works offline after your first visit"; it says what to open instead.
  expect(foot, 'the page promises what a visit to it does not give').not.toContain(OLD.en);
  expect(foot).toContain(FOOT.en);

  // 3. Online, open Fermatina once, as the page says: its landing page's "Open Fermatina".
  await page.goto('/en/');
  const button = page.locator('p.open a.button');
  await expect(button).toHaveText(NEW_STRINGS.en.openApp);
  const href = await button.getAttribute('href');
  expect(href).toBe('https://fermatina.com/?lang=en');
  await page.goto(new URL(href!).search ? `/${new URL(href!).search}` : '/');
  await expect(page.getByRole('heading', { level: 1, name: 'Fermatina' })).toBeVisible(); // the start screen
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 20_000 }).toBe(true);
  // The worker has stored the app (its page and entry script) before we go offline.
  await expect.poll(async () => page.evaluate(async () => {
    const urls: string[] = [];
    for (const name of await caches.keys()) for (const r of await (await caches.open(name)).keys()) urls.push(new URL(r.url).pathname);
    return urls.includes('/index.html') && urls.some((u) => /^\/assets\/index-.*\.js$/.test(u));
  }), { timeout: 20_000 }).toBe(true);

  await goOffline(context, page);
  expect(await opens(page, '/'), 'the app offline, after opening it once').toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: 'Fermatina' })).toBeVisible({ timeout: 10_000 });
  expect(await opens(page, '/?lesson=l1u3m1&lang=en'), 'a lesson in the app offline').toBe(200);
  await expect(page.locator('h1, h2').filter({ hasText: /\S/ }).first()).toBeVisible({ timeout: 10_000 });
  for (const address of [LESSON('en'), '/en/', '/pt/', '/es/lecciones/']) expect(await opens(page, address), `${address} offline`).toBe(0);
});
