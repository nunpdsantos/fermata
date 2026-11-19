import { test, expect, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { LOCALE, type Lang } from './helpers/wave1';

/**
 * The tester's sheet in two tabs, and an empty dry run (audit A5, A20,
 * 2026-11-18). Built pages only (the sheet exists in `npm run build`'s
 * output): run with playwright.preview.config.ts; skipped on the dev server.
 *
 *  - A5: "New to music" and "I play, no theory" open in two tabs before any
 *    answer, a task marked on each, then either tab reloaded: both answers
 *    are still there (each tab used to write its whole memory, the other
 *    tab's answers missing, over the other's). Also two tabs of the SAME
 *    sheet, a result and a note in each, and a language chosen in one.
 *  - A20: "Send my answers" with nothing answered (no result, no note, no
 *    closing answer; a hint opened counts as nothing) opens no form and says
 *    so, in EN / PT / ES; one answer or one comment is enough to send.
 */

const KEY = 'fermatina-test-sheet-v1';
type Ui = Record<string, unknown> & { sendButton: string; empty?: string };
let DATA: Record<Lang, { ui: Ui }> | null = null;

test.beforeEach(async ({ request }) => {
  const res = await request.get('/test/');
  const html = await res.text();
  test.skip(!html.includes('id="sheet-data"'), 'the test sheet exists only in the build (npm run build): run with playwright.preview.config.ts');
  DATA ??= JSON.parse(html.match(/<script type="application\/json" id="sheet-data">([\s\S]*?)<\/script>/)![1]);
});
const ui = (lang: Lang) => DATA![lang].ui;

async function fresh(browser: Browser, lang: Lang = 'en'): Promise<{ context: BrowserContext; toGoogle: string[] }> {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: LOCALE[lang],
    storageState: { cookies: [], origins: [] }, serviceWorkers: 'block', reducedMotion: 'reduce',
  });
  const toGoogle: string[] = [];
  await context.route('https://docs.google.com/**', (route) => {
    toGoogle.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
  });
  return { context, toGoogle };
}

async function open(context: BrowserContext, address: string): Promise<Page> {
  const page = await context.newPage();
  await page.goto(address);
  await expect(page.locator('#view > *')).toBeVisible();
  return page;
}

const choose = (page: Page, task: string, r: 'ok' | 'hard' | 'no') => page.locator(`label[for="r-${task}-${r}"]`).click();
const checked = (page: Page, task: string, r: 'ok' | 'hard' | 'no') => expect(page.locator(`#r-${task}-${r}`)).toBeChecked();
async function reload(page: Page) {
  await page.reload();
  await expect(page.locator('#view > *')).toBeVisible();
}

test.describe('two tabs of the sheet (audit A5)', () => {
  test('"New to music" and "I play, no theory" in two tabs: a task marked on each survives reloading either tab', async ({ browser }) => {
    const { context } = await fresh(browser);
    const a = await open(context, '/test/?lang=en#new');
    const b = await open(context, '/test/?lang=en#player');
    await choose(a, 'n1', 'ok');
    await checked(a, 'n1', 'ok');
    await choose(b, 'p1', 'hard');
    await checked(b, 'p1', 'hard');
    // The audit's step: reload the first sheet — its tick used to disappear.
    await reload(a);
    await checked(a, 'n1', 'ok');
    await expect(a.locator('#progress')).toHaveText(/^1 of /);
    await reload(b);
    await checked(b, 'p1', 'hard');
    // And the other order: B answers again, A answers again, both reload.
    await choose(b, 'p2', 'no');
    await choose(a, 'n2', 'hard');
    await reload(b);
    await reload(a);
    await checked(a, 'n1', 'ok');
    await checked(a, 'n2', 'hard');
    await a.goto('/test/?lang=en#player');
    await checked(a, 'p1', 'hard');
    await checked(a, 'p2', 'no');
    const saved = JSON.parse((await a.evaluate((k) => localStorage.getItem(k), KEY))!);
    expect(Object.keys(saved.a).sort()).toEqual(['n1', 'n2', 'p1', 'p2']);
    await context.close();
  });

  test('two tabs of the SAME sheet: a result and a note in each, a closing answer in one; all survive both reloads', async ({ browser }) => {
    const { context } = await fresh(browser);
    const a = await open(context, '/test/?lang=en#new');
    const b = await open(context, '/test/?lang=en#new');
    await choose(a, 'n1', 'ok');
    await a.locator('#note-n1').fill('from tab A');
    await choose(b, 'n2', 'no');
    await b.locator('#note-n2').fill('from tab B');
    await b.locator('#q-new-what').fill('closing answer from B');
    await a.locator('#note-n1').fill('from tab A, edited');
    await reload(a);
    await reload(b);
    for (const page of [a, b]) {
      await checked(page, 'n1', 'ok');
      await checked(page, 'n2', 'no');
      await expect(page.locator('#note-n1')).toHaveValue('from tab A, edited');
      await expect(page.locator('#note-n2')).toHaveValue('from tab B');
      await expect(page.locator('#q-new-what')).toHaveValue('closing answer from B');
    }
    await context.close();
  });

  test('a tab left open shows the other tab\'s answers once they are saved, and its text to send includes them', async ({ browser }) => {
    const { context } = await fresh(browser);
    const a = await open(context, '/test/?lang=en#new');
    const b = await open(context, '/test/?lang=en#new');
    await choose(a, 'n1', 'ok');
    await a.locator('#note-n1').fill('seen in B');
    await checked(b, 'n1', 'ok');
    await expect(b.locator('#note-n1')).toHaveValue('seen in B');
    await expect(b.locator('#progress')).toHaveText(/^1 of /);
    await b.locator('#copy-btn').click();
    expect(await b.locator('#out').inputValue()).toContain('seen in B');
    await context.close();
  });

  test('"Clear this sheet" in one tab clears only that sheet: the other tab\'s sheet keeps its answers', async ({ browser }) => {
    const { context } = await fresh(browser);
    const a = await open(context, '/test/?lang=en#new');
    const b = await open(context, '/test/?lang=en#player');
    await choose(b, 'p1', 'ok');
    await choose(a, 'n1', 'ok');
    await a.locator('#clear-btn').click();
    await a.locator('#clear-btn').click();
    await expect(a.locator('#r-n1-ok')).not.toBeChecked();
    await reload(b);
    await checked(b, 'p1', 'ok');
    await reload(a);
    await expect(a.locator('#r-n1-ok')).not.toBeChecked();
    await context.close();
  });
});

test.describe('the answers on screen are the truth for the visit (second fix pass)', () => {
  test('another tab clears the sheet\'s key: the answers on screen stay, Send carries them, and the next answer saves them all again', async ({ browser }) => {
    const { context, toGoogle } = await fresh(browser);
    const a = await open(context, '/test/?lang=en#new');
    const b = await open(context, '/test/?lang=en#player');
    await choose(a, 'n1', 'ok');
    await choose(a, 'n2', 'hard');
    await b.evaluate((k) => localStorage.removeItem(k), KEY); // A hears of it (a storage event)
    await a.waitForTimeout(300);
    await checked(a, 'n1', 'ok');
    await checked(a, 'n2', 'hard');
    await expect(a.locator('#progress')).toHaveText(/^2 of /);
    const [popup] = await Promise.all([context.waitForEvent('page'), a.getByRole('button', { name: ui('en').sendButton, exact: true }).click()]);
    await popup.waitForLoadState('domcontentloaded');
    expect(toGoogle).toHaveLength(1);
    const find = ui('en').find as Record<string, string>;
    expect(decodeURIComponent(toGoogle[0])).toContain(`→ ${find.ok}`);
    expect(decodeURIComponent(toGoogle[0])).toContain(`→ ${find.hard}`);
    await choose(a, 'n3', 'no');
    await reload(a);
    await checked(a, 'n1', 'ok');
    await checked(a, 'n2', 'hard');
    await checked(a, 'n3', 'no');
    await context.close();
  });
});

test.describe('an empty dry run (audit A20)', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    test(`${lang}: nothing answered — "Send my answers" opens no form and says why; one answer is then enough`, async ({ browser }) => {
      const { context, toGoogle } = await fresh(browser, lang);
      const page = await open(context, `/test/?lang=${lang}#new`);
      let opened = 0;
      context.on('page', () => { opened += 1; });
      const send = page.getByRole('button', { name: ui(lang).sendButton, exact: true });
      await send.click();
      await expect(page.locator('#sheet-status')).toHaveText(String(ui(lang).empty));
      // A hint opened is not an answer.
      await page.locator('#hint-n2 summary').click();
      await send.click();
      await expect(page.locator('#sheet-status')).toHaveText(String(ui(lang).empty));
      // Blank space in a note is not an answer either.
      await page.locator('#note-n1').fill('   ');
      await send.click();
      await expect(page.locator('#sheet-status')).toHaveText(String(ui(lang).empty));
      await page.waitForTimeout(500);
      expect(opened).toBe(0);
      expect(toGoogle).toEqual([]);
      // One result: the form opens, and the line is gone.
      await choose(page, 'n1', 'hard');
      const [popup] = await Promise.all([context.waitForEvent('page'), send.click()]);
      await popup.waitForLoadState('domcontentloaded');
      expect(toGoogle).toHaveLength(1);
      await expect(page.locator('#sheet-status')).toHaveText('');
      await context.close();
    });
  }

  test('a comment alone (a note, or a closing answer) is enough to send', async ({ browser }) => {
    for (const fill of [(p: Page) => p.locator('#note-n3').fill('only a note'), (p: Page) => p.locator('#q-new-confusing').fill('only a closing answer')]) {
      const { context, toGoogle } = await fresh(browser);
      const page = await open(context, '/test/?lang=en#new');
      await fill(page);
      const [popup] = await Promise.all([context.waitForEvent('page'), page.getByRole('button', { name: ui('en').sendButton, exact: true }).click()]);
      await popup.waitForLoadState('domcontentloaded');
      expect(toGoogle).toHaveLength(1);
      await context.close();
    }
  });
});
