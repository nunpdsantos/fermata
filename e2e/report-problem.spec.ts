import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { seededBrowser, LAPTOP, PHONE, PHONE_320, type Lang, type View } from './helpers/wave1';

/**
 * "Feedback or a problem" (2026-11-12, "Report a problem" until 2026-11-14) in a real browser, in both configs (dev
 * server and the production build under its CSP):
 * - nothing leaves the device before the tap: loading the app and visiting
 *   Explore, Learn, Drill and a lesson ask no other origin for anything;
 * - "⋯" → "Feedback or a problem" opens the English form in a new tab, the details
 *   box filled in through the link; in Portuguese, the Portuguese form;
 * - offline, a one-line notice and no new tab;
 * - the link at a lesson's foot points at the same form, carrying the lesson.
 * Google is never contacted: docs.google.com is routed to a stub page and
 * the tests read the new tab's address. The words come from the locale
 * files, so a wording fix never breaks this spec.
 * The open menu at 320 / 360 / 390 px, touch, in EN / PT / ES: the row on at
 * most two lines, nothing cut, at least --tap high, the menu on screen; the
 * measured figures go to the log. With REPORT_SHOTS=<dir>, it is saved there
 * as screenshots too.
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
  test(`${v.name}: "⋯" → "Feedback or a problem" opens the English form in a new tab, the details in the link`, async ({ browser }) => {
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

// The open menu with the row, at the narrowest phones, touch, in the three
// languages (pinned 2026-11-15: the row is close to its limit, two lines at
// all three widths on a Mac). For "Feedback or a problem": its words on at most two lines,
// nothing cut (no ellipsis, nothing clipped, no line wider than the room),
// the row at least --tap high, the menu inside the screen, no sideways
// scroll. One line per case goes to the log with the measured figures, so
// GitHub's Linux run shows how close it is.
for (const lang of ['en', 'pt', 'es'] as const) {
  test(`${lang}: the open "⋯" menu at 320, 360 and 390 px — the row whole on at most two lines, the menu on screen, no sideways scroll`, async ({ browser }) => {
    const shots = process.env.REPORT_SHOTS;
    const { context, page } = await start(browser, PHONE_320, lang);
    await page.goto('/');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 780 });
      await page.waitForTimeout(400);
      await more(page, lang).click();
      const menu = page.getByRole('menu', { name: WORDS[lang].nav.more });
      await expect(menu).toBeVisible();
      await expect(reportRow(page, lang)).toBeVisible();
      await page.waitForTimeout(300);
      const fit = await page.evaluate((label) => {
        const menuEl = document.querySelector<HTMLElement>('[role="menu"]')!;
        const m = menuEl.getBoundingClientRect();
        const row = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find((e) => e.textContent === label)!;
        const r = row.getBoundingClientRect();
        const text = row.querySelector('span')!;
        const t = text.getBoundingClientRect();
        // The words' line boxes: a rect starts a new line unless its middle
        // falls inside a line already seen (a fallback glyph sits a little
        // higher or lower on the same line).
        const range = document.createRange();
        range.selectNodeContents(text);
        const lines: { top: number; bottom: number; left: number; right: number }[] = [];
        for (const q of Array.from(range.getClientRects())) {
          if (q.width === 0) continue;
          const mid = (q.top + q.bottom) / 2;
          const line = lines.find((l) => mid >= l.top && mid <= l.bottom);
          if (line) {
            line.left = Math.min(line.left, q.left);
            line.right = Math.max(line.right, q.right);
          } else lines.push({ top: q.top, bottom: q.bottom, left: q.left, right: q.right });
        }
        const overflow = (el: HTMLElement) => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
        const ellipsis = [text, row].some((el) => getComputedStyle(el).textOverflow === 'ellipsis');
        return {
          tap: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tap')),
          menu: { left: m.left, right: m.right, top: m.top, bottom: m.bottom },
          vw: document.documentElement.clientWidth, vh: window.innerHeight,
          rowLeft: r.left, rowRight: r.right, rowHeight: r.height,
          available: t.width,
          lineWidths: lines.map((l) => l.right - l.left),
          // Cut: an ellipsis, anything clipped in the words, the row or the
          // menu, or a line reaching outside the words' box or the row.
          ellipsis,
          clipped: overflow(text) || overflow(row) || overflow(menuEl),
          outside: lines.some((l) => l.left < t.left - 0.5 || l.right > t.right + 0.5 || l.top < r.top - 0.5 || l.bottom > r.bottom + 0.5),
          sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      }, WORDS[lang].report.menuItem);
      const px = (n: number) => n.toFixed(1);
      console.log(`menu row "${WORDS[lang].report.menuItem}" ${lang} ${width}px: ${fit.lineWidths.length} line(s), ${fit.lineWidths.map(px).join(' + ')} px of ${px(fit.available)} px available; row ${px(fit.rowHeight)} px (--tap ${fit.tap} px)`);
      if (shots) {
        fs.mkdirSync(shots, { recursive: true });
        await page.screenshot({ path: path.join(shots, `menu-${lang}-${width}.png`) });
        fs.writeFileSync(path.join(shots, `menu-${lang}-${width}.json`), JSON.stringify(fit, null, 1));
      }
      const at = `${lang} ${width}px`;
      expect(fit.tap, `${at}: touch, so --tap is 44 px`).toBe(44);
      expect(fit.lineWidths.length, `${at}: the row's words on one or two lines`).toBeGreaterThanOrEqual(1);
      expect(fit.lineWidths.length, `${at}: the row's words on at most two lines`).toBeLessThanOrEqual(2);
      expect(fit.ellipsis, `${at}: no ellipsis`).toBe(false);
      expect(fit.clipped, `${at}: nothing clipped`).toBe(false);
      expect(fit.outside, `${at}: every line inside the row`).toBe(false);
      expect(fit.rowHeight, `${at}: the row at least --tap high`).toBeGreaterThanOrEqual(fit.tap);
      expect(fit.menu.left, `${at}: the menu's left edge on screen`).toBeGreaterThanOrEqual(0);
      expect(fit.menu.right, `${at}: the menu's right edge on screen`).toBeLessThanOrEqual(fit.vw);
      expect(fit.menu.top, `${at}: the menu's top on screen`).toBeGreaterThanOrEqual(0);
      expect(fit.menu.bottom, `${at}: the menu's bottom on screen`).toBeLessThanOrEqual(fit.vh);
      expect(fit.rowLeft).toBeGreaterThanOrEqual(0);
      expect(fit.rowRight).toBeLessThanOrEqual(fit.vw);
      expect(fit.sideways, `${at}: no sideways scroll`).toBe(false);
      await page.keyboard.press('Escape');
      await expect(menu).toHaveCount(0);
    }
    await context.close();
  });
}
