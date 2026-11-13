import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { seededBrowser, LAPTOP, PHONE, type Lang, type View } from './helpers/wave1';

/**
 * "Report a problem" (2026-11-12) in a real browser, in both configs (dev
 * server and the production build under its CSP):
 * - nothing leaves the device before the tap: loading the app and visiting
 *   Explore, Learn, Drill and a lesson ask no other origin for anything;
 * - "⋯" → "Report a problem" opens the English form in a new tab, the details
 *   box filled in through the link; in Portuguese, the Portuguese form;
 * - offline, a one-line notice and no new tab;
 * - the link at a lesson's foot points at the same form, carrying the lesson.
 * Google is never contacted: docs.google.com is routed to a stub page and
 * the tests read the new tab's address. The words come from the locale
 * files, so a wording fix never breaks this spec.
 * With REPORT_SHOTS=<dir>, the open menu at 320 / 360 / 390 px in EN / PT / ES
 * is saved there as screenshots.
 */

type Locale = { report: { menuItem: string; offline: string }; learn: { reportMistake: string }; nav: { more: string } };
const locale = (lang: Lang) => JSON.parse(fs.readFileSync(path.join('src/i18n/locales', `${lang}.json`), 'utf8')) as Locale;
const WORDS: Record<Lang, Locale> = { en: locale('en'), pt: locale('pt'), es: locale('es') };

// The forms, as src/services/reportProblem.ts has them (kept literal here: a typo there must fail here).
const FORMS: Record<Lang, { url: string; entry: string }> = {
  en: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfI4qQGg8oRbptK9oy4zASrremaS4T2n7mDRyeYVppSTpZyUw/viewform', entry: '1697729701' },
  pt: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSf2rxSG77Ob4ATDFYbblTLabkLJtVpIIPYnLGXvBH_ROtFMyQ/viewform', entry: '202781657' },
  es: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfMzJEA18XRIx3wQxFD-PKVvY7NLbPwI-XkmK4g-RceatMaUA/viewform', entry: '1963274376' },
};

const STUB = '<!doctype html><title>Report form (stub)</title><p>stub</p>';

async function start(browser: Parameters<typeof seededBrowser>[0], v: View, lang: Lang, lastView = 'explore') {
  const { context, page } = await seededBrowser(browser, v, { themeMode: 'fermata', language: lang, lastView }, {}, { lang });
  // Google is never contacted: every request there gets the stub, and is counted.
  const toGoogle: string[] = [];
  await context.route('https://docs.google.com/**', (route) => {
    toGoogle.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/html', body: STUB });
  });
  return { context, page, toGoogle };
}

/** Every request any page of the context makes to an origin other than the app's own. */
function watchOtherOrigins(context: BrowserContext, base: string) {
  const own = new URL(base).origin;
  const seen: string[] = [];
  context.on('request', (r) => {
    const url = r.url();
    if (url.startsWith('data:') || url.startsWith('blob:')) return;
    if (new URL(url).origin !== own) seen.push(`${r.method()} ${url}`);
  });
  return seen;
}

const more = (page: Page, lang: Lang) => page.getByRole('button', { name: new RegExp(`^${WORDS[lang].nav.more}`) });
const reportRow = (page: Page, lang: Lang) => page.getByRole('menuitem', { name: WORDS[lang].report.menuItem, exact: true });

/** The details box's value, read from a form address. */
const detailsIn = (url: string, lang: Lang) => new URL(url).searchParams.get(`entry.${FORMS[lang].entry}`) ?? '';

async function tapRowForPopup(context: BrowserContext, page: Page, lang: Lang) {
  await more(page, lang).click();
  const [popup] = await Promise.all([context.waitForEvent('page'), reportRow(page, lang).click()]);
  await popup.waitForLoadState('domcontentloaded');
  return popup;
}

test('nothing leaves the device before the tap: loading and visiting Explore, Learn, Drill and a lesson ask no other origin', async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  const { context, page, toGoogle } = await start(browser, LAPTOP, 'en');
  const other = watchOtherOrigins(context, baseURL!);
  await page.goto('/');
  await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
  for (const tab of ['Learn', 'Drill', 'Explore']) {
    await page.getByRole('tab', { name: tab }).click();
    await page.waitForTimeout(800);
  }
  await page.goto('/?lesson=l1u1m1');
  await expect(page.getByRole('heading', { level: 1, name: 'The Staff and Clefs' })).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('report-mistake').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  // The menu opened (the row shown, not tapped) asks nothing either.
  await more(page, 'en').click();
  await expect(reportRow(page, 'en')).toBeVisible();
  await page.waitForTimeout(500);
  expect(other, 'no request to another origin before the tap').toEqual([]);
  expect(toGoogle).toEqual([]);
  // No preconnect / prefetch / dns-prefetch to Google in the document.
  expect(await page.locator('link[href*="google"]').count()).toBe(0);
  // Known positive: the tap itself is seen by the same watcher (one GET, the form's, to the stub).
  const [popup] = await Promise.all([context.waitForEvent('page'), reportRow(page, 'en').click()]);
  await popup.waitForLoadState('domcontentloaded');
  expect(other).toEqual([`GET ${popup.url()}`]);
  await context.close();
});

for (const v of [LAPTOP, PHONE]) {
  test(`${v.name}: "⋯" → "Report a problem" opens the English form in a new tab, the details in the link`, async ({ browser }) => {
    const { context, page, toGoogle } = await start(browser, v, 'en');
    await page.goto('/');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    const popup = await tapRowForPopup(context, page, 'en');
    const url = popup.url();
    expect(url.startsWith(`${FORMS.en.url}?usp=pp_url&entry.${FORMS.en.entry}=`)).toBe(true);
    const size = v.viewport;
    const details = detailsIn(url, 'en').split(' · ');
    expect(details.slice(0, 2)).toEqual(['explore', 'en']);
    expect(details[2]).toMatch(/^release \d+ \((\d{4}-\d{2}-\d{2}|dev)\)$/);
    expect(details[3]).toBe(`${size.width}×${size.height}`);
    expect(details.slice(4).join(' · ')).toBe(await page.evaluate(() => navigator.userAgent));
    // The new tab has no way back to the app.
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    // The stub, not Google, answered: exactly one request, the form's.
    expect(toGoogle).toEqual([url]);
    // The app stays where it was.
    await expect(page.getByTestId('explore-root')).toBeVisible();
    await context.close();
  });
}

test('in Portuguese, the Portuguese form (from Drill)', async ({ browser }) => {
  const { context, page } = await start(browser, PHONE, 'pt', 'drill');
  await page.goto('/');
  await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
  const popup = await tapRowForPopup(context, page, 'pt');
  expect(popup.url().startsWith(`${FORMS.pt.url}?usp=pp_url&entry.${FORMS.pt.entry}=`)).toBe(true);
  expect(detailsIn(popup.url(), 'pt').split(' · ').slice(0, 2)).toEqual(['drill', 'pt']);
  await context.close();
});

test('offline: the notice, and no new tab', async ({ browser }) => {
  const { context, page, toGoogle } = await start(browser, PHONE, 'es');
  await page.goto('/');
  await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
  await context.setOffline(true);
  let opened = 0;
  context.on('page', () => { opened += 1; });
  await more(page, 'es').click();
  await reportRow(page, 'es').click();
  await expect(page.getByTestId('toast-region')).toContainText(WORDS.es.report.offline);
  await page.waitForTimeout(1000);
  expect(opened).toBe(0);
  expect(context.pages()).toHaveLength(1);
  expect(toGoogle).toEqual([]);
  await context.setOffline(false);
  await context.close();
});

for (const lang of ['en', 'pt'] as const) {
  test(`${lang}: the link at a lesson's foot is the form for the language, carrying the lesson; offline it goes nowhere`, async ({ browser }) => {
    const { context, page, toGoogle } = await start(browser, LAPTOP, lang, 'learn');
    await page.goto('/?lesson=l1u1m1');
    const link = page.getByRole('link', { name: WORDS[lang].learn.reportMistake, exact: true });
    await expect(link).toBeVisible({ timeout: 15_000 });
    const href = (await link.getAttribute('href'))!;
    expect(href.startsWith(`${FORMS[lang].url}?usp=pp_url&entry.${FORMS[lang].entry}=`)).toBe(true);
    expect(href).not.toContain('mailto:');
    const details = detailsIn(href, lang).split(' · ');
    expect(details.slice(0, 2)).toEqual(['learn', 'l1u1m1']);
    expect(details[3]).toBe(lang);
    expect(await link.getAttribute('target')).toBe('_blank');
    expect(await link.getAttribute('rel')).toBe('noopener noreferrer');
    // Its tap height is kept (--tap: 36 px with a mouse).
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(36);
    expect(toGoogle).toEqual([]);

    // Offline: the notice, and nothing opens.
    await context.setOffline(true);
    let opened = 0;
    const count = () => { opened += 1; };
    context.on('page', count);
    await link.click();
    await expect(page.getByTestId('toast-region')).toContainText(WORDS[lang].report.offline);
    await page.waitForTimeout(800);
    expect(opened).toBe(0);
    context.off('page', count);
    await context.setOffline(false);

    // Online: a new tab at the link's address (the stub answers).
    const [popup] = await Promise.all([context.waitForEvent('page'), link.click()]);
    await popup.waitForLoadState('domcontentloaded');
    expect(popup.url()).toBe(href);
    expect(toGoogle).toEqual([href]);
    await context.close();
  });
}

// The open menu with the new row, at the narrowest phones, in the three languages:
// no row cut, the menu on screen, no sideways scroll.
for (const lang of ['en', 'pt', 'es'] as const) {
  test(`${lang}: the open "⋯" menu at 320, 360 and 390 px — the row whole, the menu on screen, no sideways scroll`, async ({ browser }) => {
    const shots = process.env.REPORT_SHOTS;
    const { context, page } = await start(browser, { name: 'phone-320', viewport: { width: 320, height: 568 }, touch: true }, lang);
    await page.goto('/');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 780 });
      await page.waitForTimeout(400);
      await more(page, lang).click();
      const menu = page.getByRole('menu', { name: WORDS[lang].nav.more });
      await expect(menu).toBeVisible();
      await page.waitForTimeout(300);
      const fit = await page.evaluate((label) => {
        const m = document.querySelector('[role="menu"]')!.getBoundingClientRect();
        const row = Array.from(document.querySelectorAll('[role="menuitem"]')).find((e) => e.textContent === label) as HTMLElement;
        const r = row.getBoundingClientRect();
        const text = row.querySelector('span')!;
        const style = getComputedStyle(text);
        return {
          menuLeft: m.left, menuRight: m.right, vw: document.documentElement.clientWidth,
          rowLeft: r.left, rowRight: r.right, rowHeight: r.height,
          textCut: text.scrollWidth > text.clientWidth + 1 || style.textOverflow === 'ellipsis' && text.scrollWidth > text.clientWidth,
          sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          lines: (() => { const range = document.createRange(); range.selectNodeContents(text); return new Set(Array.from(range.getClientRects()).map((q) => Math.round(q.top))).size; })(),
        };
      }, WORDS[lang].report.menuItem);
      if (shots) {
        fs.mkdirSync(shots, { recursive: true });
        await page.screenshot({ path: path.join(shots, `menu-${lang}-${width}.png`) });
        fs.writeFileSync(path.join(shots, `menu-${lang}-${width}.json`), JSON.stringify(fit, null, 1));
      }
      const at = `${lang} ${width}px`;
      expect(fit.menuLeft, `${at}: the menu's left edge on screen`).toBeGreaterThanOrEqual(0);
      expect(fit.menuRight, `${at}: the menu's right edge on screen`).toBeLessThanOrEqual(fit.vw);
      expect(fit.rowLeft).toBeGreaterThanOrEqual(0);
      expect(fit.rowRight).toBeLessThanOrEqual(fit.vw);
      expect(fit.textCut, `${at}: the row's words are not cut`).toBe(false);
      expect(fit.sideways, `${at}: no sideways scroll`).toBe(false);
      expect(fit.rowHeight, `${at}: a full tap target`).toBeGreaterThanOrEqual(44);
      await page.keyboard.press('Escape');
      await expect(menu).toHaveCount(0);
    }
    await context.close();
  });
}
