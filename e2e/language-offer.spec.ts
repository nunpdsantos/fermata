import { test, expect, type Browser, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { auditPage } from './helpers/designAudit';
import { WELCOME_KEY, WELCOME_SEEN } from './helpers/welcome';

/**
 * A returning learner follows a link in another language (audit 2, P9, 19
 * November 2026). The saved language always wins (the owner, 18 November
 * 2026); what he agreed to: ONE lasting toast in the link's language offers
 * the switch with one tap, and nothing changes until that tap.
 *
 *  - saved EN, /?lang=pt: "Mudar para português?" · Mudar; the app stays
 *    English; the tap switches and saves it; ✕ leaves it English; a reload
 *    (the address is clean) offers nothing.
 *  - a first visit by /?lang=pt: the app simply starts in Portuguese, no offer.
 *  - saved PT, /?lang=pt: nothing.
 *  - a Drill session under way: the offer waits; once it is over, it shows.
 *  - the tester's sheet's "Open Fermatina" (`/?lang=…`, build only) and a
 *    public page's "Open this lesson" address (`?lesson=…&lang=…`).
 *  - the toast in PT and ES at 320 and 390 px, day and night, over Explore's
 *    sheet: whole, on screen, readable, its two buttons full targets.
 *
 * OFFER_SHOTS=<dir> writes the toast for the owner's eye.
 */

const SHOTS = process.env.OFFER_SHOTS;
const ASK = { en: 'Switch to English?', pt: 'Mudar para português?', es: '¿Cambiar a español?' } as const;
const ACTION = { en: 'Switch', pt: 'Mudar', es: 'Cambiar' } as const;
const DISMISS = { en: 'Dismiss', pt: 'Fechar', es: 'Cerrar' } as const;
type Lang = keyof typeof ASK;

/** A browser holding exactly `stores` under the run's own address (empty = a first visit). */
async function withStorage(browser: Browser, stores: Record<string, string>, viewport = { width: 1440, height: 900 }, touch = false, locale = 'en-GB') {
  const origin = new URL(test.info().project.use.baseURL!).origin;
  const context = await browser.newContext({
    storageState: { cookies: [], origins: [{ origin, localStorage: Object.entries(stores).map(([name, value]) => ({ name, value })) }] },
    viewport, isMobile: touch, hasTouch: touch, locale, serviceWorkers: 'block', reducedMotion: 'reduce',
  });
  return { context, page: await context.newPage() };
}
const returning = (language: Lang, extra: Record<string, string> = {}, themeMode = 'fermata', lastView = 'explore') => ({
  [WELCOME_KEY]: WELCOME_SEEN,
  'music-theory-app': JSON.stringify({ state: { language, themeMode, lastView }, version: 6 }),
  ...extra,
});
const savedLanguage = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app') ?? '{}').state?.language ?? null);
const toast = (page: Page, lang: Lang) => page.getByTestId('toast-region').getByRole('status').filter({ hasText: ASK[lang] });

test('saved English, /?lang=pt: one toast in Portuguese; English until the tap; the tap switches and saves it', async ({ browser }) => {
  const { context, page } = await withStorage(browser, returning('en'));
  await page.goto('/?lang=pt');
  await expect(toast(page, 'pt')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('tab', { name: 'Explore' })).toBeVisible();
  await expect(toast(page, 'pt').getByText(ASK.pt)).toHaveAttribute('lang', 'pt-PT');
  await expect.poll(() => page.evaluate(() => location.search)).toBe('');
  expect(await savedLanguage(page)).toBe('en');
  // One toast, one action.
  await expect(page.getByTestId('toast-region').getByRole('status')).toHaveCount(1);
  await toast(page, 'pt').getByRole('button', { name: ACTION.pt, exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
  await expect(page.getByRole('tab', { name: 'Explorar' })).toBeVisible();
  await expect.poll(() => savedLanguage(page)).toBe('pt');
  await expect(toast(page, 'pt')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Explorar' })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  await expect(page.getByTestId('toast-region').getByRole('status')).toHaveCount(0);
  await context.close();
});

test('saved English, /?lang=es, ✕: stays English, and nothing comes back after a reload', async ({ browser }) => {
  const { context, page } = await withStorage(browser, returning('en'));
  await page.goto('/?lang=es');
  await expect(toast(page, 'es')).toBeVisible({ timeout: 15_000 });
  await toast(page, 'es').getByRole('button', { name: DISMISS.en }).click();
  await expect(toast(page, 'es')).toHaveCount(0);
  expect(await savedLanguage(page)).toBe('en');
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Explore' })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  await expect(page.getByTestId('toast-region').getByRole('status')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

test('a first visit by /?lang=pt: the app starts in Portuguese and offers nothing', async ({ browser }) => {
  const { context, page } = await withStorage(browser, {});
  await page.goto('/?lang=pt');
  await expect(page.getByTestId('start-screen')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
  await page.getByRole('button', { name: /^Sei alguma teoria/ }).click();
  await expect(page.getByRole('tab', { name: 'Explorar' })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  await expect(page.getByTestId('toast-region').getByRole('status')).toHaveCount(0);
  await context.close();
});

test('saved Portuguese, /?lang=pt: they agree, nothing is offered', async ({ browser }) => {
  const { context, page } = await withStorage(browser, returning('pt'));
  await page.goto('/?lang=pt');
  await expect(page.getByRole('tab', { name: 'Explorar' })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  await expect(page.getByTestId('toast-region').getByRole('status')).toHaveCount(0);
  await context.close();
});

test('a Drill session under way: the offer waits, and shows once the session is over', async ({ browser }) => {
  // A session with one answer given (work in progress: services/workInProgress.ts).
  const item = 'degree:num-to-name:1';
  const now = Date.now();
  const drill = JSON.stringify({
    state: {
      items: { [item]: { card: { due: now + 6e5, stability: 2.3, difficulty: 2.1, elapsed_days: 0, scheduled_days: 0, reps: 1, lapses: 0, state: 1, learning_steps: 1, last_review: now - 1000 }, history: [{ ts: now - 1000, correct: true, ms: 1500, sessionId: `s${now - 5000}` }], tier: 'learning', introSessionId: `s${now - 5000}`, introCorrectCount: 1 } },
      settings: { length: 24, newPerSession: 4, families: { keysig: true, circle: true, scale: true, degree: true, interval: true, triad: true, seventh: true, roman: true, function: true, read: false }, sound: false, showTimer: false },
      sprintBests: {}, lifetime: { answered: 1, correct: 1 },
      activeSession: { id: `s${now - 5000}`, queue: [item, 'degree:num-to-name:2', 'degree:num-to-name:3', item], index: 1, asked: 1, correct: 1, startedAt: now - 5000, seed: 7, missRequeues: {} },
      sprint: null, introDone: true,
    },
    version: 3,
  });
  const { context, page } = await withStorage(browser, returning('en', { 'fermata-drill-v1': drill }, 'fermata', 'drill'));
  await page.goto('/?lang=pt');
  const panel = page.locator('#drill-panel');
  await expect(panel.getByRole('button', { name: 'End session' })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(2500);
  await expect(page.getByTestId('toast-region').getByRole('status')).toHaveCount(0);
  await panel.getByRole('button', { name: 'End session' }).click();
  await expect(toast(page, 'pt')).toBeVisible({ timeout: 4000 });
  expect(await savedLanguage(page)).toBe('en');
  await context.close();
});

test('the tester\'s sheet\'s "Open Fermatina" (build only): the learner\'s English stays, the sheet\'s language is offered', async ({ browser }) => {
  const { context, page } = await withStorage(browser, returning('en'));
  const res = await page.goto('/test/?lang=es');
  test.skip(!res || res.status() !== 200 || !(await page.locator('#sheet-data').count()), 'the tester\'s sheet is written by the build (dev server: not there)');
  const open = page.getByRole('link', { name: /Fermatina/ }).first();
  expect(await open.getAttribute('href')).toBe('/?lang=es');
  const [app] = await Promise.all([context.waitForEvent('page'), open.click()]);
  await expect(toast(app, 'es')).toBeVisible({ timeout: 15_000 });
  await expect(app.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

test('a public page\'s "Open this lesson" address (build only): the lesson opens in English, Portuguese is offered', async ({ browser }) => {
  const { context, page } = await withStorage(browser, returning('en'));
  const res = await page.goto('/pt/');
  test.skip(!res || res.status() !== 200 || !(await page.locator('a.button').count()), 'the public pages are written by the build (dev server: not there)');
  // The lesson index's first lesson page, and that page's button.
  await page.goto('/pt/licoes/');
  const lessonPage = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')!).find((h) => /^\/pt\/licoes\/[^/]+\/$/.test(h)));
  expect(lessonPage, 'a lesson page linked from the index').toBeTruthy();
  await page.goto(lessonPage!);
  const href = (await page.locator('a.button').first().getAttribute('href'))!;
  const target = new URL(href);
  expect(target.searchParams.get('lang')).toBe('pt');
  await page.goto(`${target.pathname}${target.search}`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 20_000 });
  await expect(toast(page, 'pt')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

// PT and ES at 320 and 390 px (the brief), EN at 390: on a phone, over Explore's sheet at Half.
for (const [lang, width, saved] of [['pt', 320, 'en'], ['pt', 390, 'es'], ['es', 320, 'pt'], ['es', 390, 'en'], ['en', 390, 'pt']] as const) {
  test(`the toast in ${lang}, ${width} px, day and night: whole, on screen, readable, full targets`, async ({ browser }) => {
    for (const themeMode of ['fermata', 'fermata-night']) {
      const { context, page } = await withStorage(browser, returning(saved, {}, themeMode), { width, height: 740 }, true);
      await page.goto(`/?lang=${lang}`);
      const card = toast(page, lang);
      await expect(card).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(400);
      const box = (await card.boundingBox())!;
      expect(box.x, 'inside the screen').toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 0.5);
      for (const name of [ACTION[lang], DISMISS[saved]]) {
        const b = (await card.getByRole('button', { name, exact: true }).boundingBox())!;
        expect(b.height, `${name}: a full target`).toBeGreaterThanOrEqual(44);
        expect(b.width).toBeGreaterThanOrEqual(44);
      }
      // Off the instrument's sheet.
      const sheet = (await page.getByTestId('instrument-dock').boundingBox())!;
      expect(box.y + box.height).toBeLessThanOrEqual(sheet.y + 0.5);
      const r = await auditPage(page, { minFontPx: 12, minTapPx: 44 });
      const where = `${lang} ${width} ${themeMode}`;
      const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 4));
      expect.soft(r.fontViolations, `${where}: small text ${fmt(r.fontViolations)}`).toEqual([]);
      expect.soft(r.contrastViolations, `${where}: contrast ${fmt(r.contrastViolations)}`).toEqual([]);
      expect.soft(r.clipViolations, `${where}: cut off ${fmt(r.clipViolations)}`).toEqual([]);
      expect.soft(r.tapViolations, `${where}: targets ${fmt(r.tapViolations)}`).toEqual([]);
      expect.soft(r.hScroll.scrollWidth, `${where}: sideways scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
      if (SHOTS) {
        mkdirSync(SHOTS, { recursive: true });
        await page.screenshot({ path: `${SHOTS}/language-offer-${lang}-${width}-${themeMode}.png` });
      }
      await context.close();
    }
  });
}
