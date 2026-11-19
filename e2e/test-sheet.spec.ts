import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Browser, type Page } from '@playwright/test';
import { auditPage } from './helpers/designAudit';
import { LOCALE, type Lang } from './helpers/wave1';
import { TEST_FORM } from '../src/services/feedbackForms';

/**
 * The tester's sheet at /test/ (2026-11-14): a page the BUILD writes
 * (scripts/pages/build.ts → dist/test/), so this spec runs on `vite preview`
 * (playwright.preview.config.ts, the production headers and CSP) and skips,
 * with a note, on the dev server.
 *
 *  - EN / PT / ES at 320 (touch), 390 (touch) and 1440 px (mouse), day and
 *    night: the design audit (type ≥ 12 px, tap ≥ --tap, contrast, no
 *    sideways scroll, nothing cut off) on a sheet with an answer chosen, a
 *    hint open and the copy box shown, on the "check" sheet and the guide;
 *  - a sheet answered end to end, "Send my answers" opening the test form
 *    (docs.google.com is routed to a stub, never contacted) in a new tab with
 *    no opener, its two boxes holding the sheet line and exactly the text
 *    "Copy my answers" gives; nothing asked of another origin before the tap;
 *  - too long: nothing opens, the notice and the copy box; offline: one
 *    line, nothing opens; Copy; a reload keeps the answers; the keyboard;
 *  - the sheet never counts as the app's: a new browser that answered the
 *    sheet still gets the app's start screen; the app's exported backup does
 *    not carry the sheet's answers; with the app's service worker installed,
 *    /test/ is still the sheet (from the server) and nothing of it is cached;
 *  - no CSP report, no console message.
 * With TEST_SHOTS=<dir>, the screenshots for the seat and the owner.
 */

const KEY = 'fermatina-test-sheet-v1';
const LANGS: Lang[] = ['en', 'pt', 'es'];
const STUB = '<!doctype html><title>Test form (stub)</title><p>stub</p>';
type Content = { ui: Record<string, unknown> & { title: string; sendButton: string; copy: string; tooLong: string; offline: string; copied: string; copyfail: string; tabs: Record<string, string>; find: Record<string, string> }; sheets: Record<string, { tasks: { id: string; goal: string }[] }> };
let DATA: Record<Lang, Content> | null = null;

test.beforeEach(async ({ request }) => {
  const res = await request.get('/test/');
  const html = await res.text();
  test.skip(!html.includes('id="sheet-data"'), 'the test sheet exists only in the build (npm run build): run with playwright.preview.config.ts');
  DATA ??= JSON.parse(html.match(/<script type="application\/json" id="sheet-data">([\s\S]*?)<\/script>/)![1]);
});
const ui = (lang: Lang) => DATA![lang].ui;

/** A browser that has never opened Fermatina (no welcome flag, no save), its own Google stub, and a log of every request. */
async function freshContext(browser: Browser, opts: { width?: number; height?: number; touch?: boolean; lang?: Lang; scheme?: 'light' | 'dark'; permissions?: string[] } = {}) {
  const touch = opts.touch ?? true;
  const context = await browser.newContext({
    viewport: { width: opts.width ?? 390, height: opts.height ?? 844 }, isMobile: touch, hasTouch: touch,
    colorScheme: opts.scheme ?? 'light', locale: LOCALE[opts.lang ?? 'en'], storageState: { cookies: [], origins: [] },
    serviceWorkers: 'block', reducedMotion: 'reduce', permissions: opts.permissions,
  });
  const toGoogle: string[] = [];
  const requests: string[] = [];
  context.on('request', (r) => requests.push(r.url()));
  await context.route('https://docs.google.com/**', (route) => {
    toGoogle.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/html', body: STUB });
  });
  await context.addInitScript(() => {
    const w = window as unknown as { __csp: string[] };
    w.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  return { context, page: await context.newPage(), toGoogle, requests };
}

const ready = (page: Page) => expect(page.locator('#view > *')).toBeVisible();
const choose = (page: Page, task: string, r: 'ok' | 'hard' | 'no') => page.locator(`label[for="r-${task}-${r}"]`).click();

async function auditStatic(page: Page, touch: boolean, where: string, minTargets = 10) {
  const r = await auditPage(page, { minFontPx: 12, minTapPx: touch ? 44 : 36 });
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the audit did not run`).toBeGreaterThan(20);
  expect.soft(r.targets, `${where}: audited no control`).toBeGreaterThanOrEqual(minTargets);
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
    test(`${lang}, ${scheme === 'light' ? 'day' : 'night'}: /test/ passes the design audit at 320, 390 and 1440 px (a sheet with an answer, a hint and the copy box; the "check" sheet; the guide)`, async ({ browser }) => {
      test.setTimeout(120_000);
      for (const v of VIEWS) {
        const { context, page } = await freshContext(browser, { ...v, lang, scheme });
        const where = (view: string) => `/test/?lang=${lang}#${view} ${v.width}px ${scheme}`;
        await page.goto(`/test/?lang=${lang}#new`);
        await ready(page);
        await expect(page.locator('h1')).toHaveText(ui(lang).title);
        expect(await page.evaluate(() => document.documentElement.lang)).toBe(LOCALE[lang] === 'en-GB' ? 'en' : LOCALE[lang]);
        // Night by the system setting, as the app's tokens draw it.
        expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(scheme === 'light' ? 'rgb(245, 239, 226)' : 'rgb(24, 18, 8)');
        await choose(page, 'n1', 'ok');
        await page.locator('#hint-n2 summary').click();
        await page.locator('#copy-btn').click(); // no clipboard permission: the copy box and its notice show
        await expect(page.locator('#out')).toBeVisible();
        await auditStatic(page, v.touch, where('new'));
        for (const view of ['instrument', 'watching']) {
          await page.goto(`/test/?lang=${lang}#${view}`);
          await ready(page);
          // The guide has the header's 8 controls only (3 languages, Open Fermatina, 4 sheets).
          await auditStatic(page, v.touch, where(view), view === 'watching' ? 8 : 10);
        }
        expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([]);
        await context.close();
      }
    });
  }
}

test('with JavaScript off: the title, the lead, the way into the app and one line in each language saying the sheet needs JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/test/');
  await expect(page.locator('h1')).toHaveText(ui('en').title);
  // (Playwright's text engine skips <noscript>: read it by CSS and as the page's text.)
  await expect(page.locator('.noscript p')).toHaveText(LANGS.map((lang) => String(ui(lang).noscript)));
  for (const lang of LANGS) expect(await page.locator('body').innerText()).toContain(String(ui(lang).noscript));
  await expect(page.locator('#lang-switch')).toBeHidden();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await context.close();
});

test('a sheet answered end to end: "Send my answers" opens the test form (a stub) in a new tab from the tap, the sheet line and exactly the copied text in its two boxes; nothing asked of another origin before', async ({ browser, baseURL }) => {
  const { context, page, toGoogle, requests } = await freshContext(browser, { lang: 'pt' });
  const own = new URL(baseURL!).origin;
  const messages: string[] = [];
  page.on('console', (m) => messages.push(`${m.type()}: ${m.text()}`));
  await page.goto('/test/#player');
  await ready(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
  const tasks = DATA!.pt.sheets.player.tasks;
  for (const [i, task] of tasks.entries()) {
    await choose(page, task.id, (['ok', 'hard', 'no'] as const)[i % 3]);
    if (i % 2 === 0) await page.locator(`#note-${task.id}`).fill(`Nota ${i + 1}: «${task.id}» com acentos ção.\nSegunda linha.`);
  }
  await page.locator(`#hint-${tasks[1].id} summary`).click();
  for (const q of ['what', 'confusing', 'again', 'device', 'lang']) await page.locator(`#q-player-${q}`).fill(`Resposta ${q}`);
  await expect(page.locator('#progress')).toHaveText(`${tasks.length} de ${tasks.length} respondidas`);
  // The text "Copy my answers" gives (the copy box shows it whether or not the clipboard may be used).
  await page.locator('#copy-btn').click();
  const copied = await page.locator('#out').inputValue();
  // Known positive for the request log: the page's own files were seen.
  expect(requests).toContain(`${own}/test/sheet.js`);
  expect(requests.filter((u) => !u.startsWith(`${own}/`) && !u.startsWith('data:'))).toEqual([]);
  expect(toGoogle).toEqual([]);
  await expect(page.locator('#send-note')).toHaveText(String(ui('pt').sendNote));
  const [popup] = await Promise.all([context.waitForEvent('page'), page.getByRole('button', { name: ui('pt').sendButton, exact: true }).click()]);
  await popup.waitForLoadState('domcontentloaded');
  const url = new URL(popup.url());
  expect(`${url.origin}${url.pathname}`).toBe(TEST_FORM.url);
  expect([...url.searchParams.keys()]).toEqual(['usp', `entry.${TEST_FORM.sheetEntry}`, `entry.${TEST_FORM.answersEntry}`]);
  expect(url.searchParams.get(`entry.${TEST_FORM.sheetEntry}`)).toMatch(/^player · pt · \d{4}-\d{2}-\d{2}$/);
  const sent = url.searchParams.get(`entry.${TEST_FORM.answersEntry}`)!;
  expect(sent).toBe(copied);
  expect(sent).toContain('«p1» com acentos ção.\n   Segunda linha.');
  expect(sent.split('\n').at(-1)).toBe(`Navegador: ${await page.evaluate(() => navigator.userAgent)}`);
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  expect(toGoogle).toEqual([popup.url()]);
  expect(requests.filter((u) => !u.startsWith(`${own}/`) && !u.startsWith('data:'))).toEqual([popup.url()]);
  expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([]);
  expect(messages).toEqual([]);
  await context.close();
});

test('too long for the address: nothing opens; the notice, and the text to copy', async ({ browser }) => {
  const { context, page, toGoogle } = await freshContext(browser, { lang: 'en' });
  await page.goto('/test/');
  await ready(page);
  await page.locator('#note-n1').fill('é'.repeat(1300));
  let opened = 0;
  context.on('page', () => { opened += 1; });
  await page.getByRole('button', { name: ui('en').sendButton, exact: true }).click();
  await expect(page.locator('#sheet-status')).toHaveText(ui('en').tooLong);
  await expect(page.locator('#out')).toBeVisible();
  expect(await page.locator('#out').inputValue()).toContain('é'.repeat(1300));
  await page.waitForTimeout(800);
  expect(opened).toBe(0);
  expect(toGoogle).toEqual([]);
  await context.close();
});

test('offline: one line, and nothing opens', async ({ browser }) => {
  const { context, page, toGoogle } = await freshContext(browser, { lang: 'es' });
  await page.goto('/test/');
  await ready(page);
  await choose(page, 'n1', 'ok');
  await context.setOffline(true);
  let opened = 0;
  context.on('page', () => { opened += 1; });
  await page.getByRole('button', { name: ui('es').sendButton, exact: true }).click();
  await expect(page.locator('#sheet-status')).toHaveText(ui('es').offline);
  await page.waitForTimeout(800);
  expect(opened).toBe(0);
  expect(toGoogle).toEqual([]);
  await context.setOffline(false);
  await context.close();
});

test('"Copy my answers" puts the text on the clipboard and says so; a reload keeps the answers', async ({ browser, baseURL }) => {
  const { context, page } = await freshContext(browser, { lang: 'en', touch: false, width: 1440, height: 900, permissions: ['clipboard-read', 'clipboard-write'] });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(baseURL!).origin });
  await page.goto('/test/#instrument');
  await ready(page);
  await choose(page, 'i2', 'hard');
  await page.locator('#note-i2').fill('The icon is small.');
  await page.locator('#q-instrument-device').fill('MacBook, Chrome');
  await page.getByRole('button', { name: ui('en').copy, exact: true }).click();
  await expect(page.locator('#sheet-status')).toHaveText(ui('en').copied);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toBe(await page.locator('#out').inputValue());
  expect(clip).toContain('   → Partly\n   The icon is small.');
  expect(clip).toContain('MacBook, Chrome');
  await page.reload();
  await ready(page);
  await expect(page.locator('#r-i2-hard')).toBeChecked();
  await expect(page.locator('#note-i2')).toHaveValue('The icon is small.');
  await expect(page.locator('#q-instrument-device')).toHaveValue('MacBook, Chrome');
  expect(Object.keys(await page.evaluate(() => ({ ...localStorage })))).toEqual([KEY]);
  await context.close();
});

test('keyboard: every control is reached by Tab; arrows choose a result; Enter on "Send my answers" opens the form', async ({ browser }) => {
  const { context, page } = await freshContext(browser, { lang: 'en', touch: false, width: 1440, height: 900 });
  await page.goto('/test/#new');
  await ready(page);
  const stops: string[] = [];
  for (let i = 0; i < 120; i++) {
    await page.keyboard.press('Tab');
    const at = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return 'body';
      const r = el.getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0;
      const type = el.tagName === 'INPUT' ? `[${el.getAttribute('type')}]` : '';
      return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${type}${visible ? '' : ' (hidden)'}`;
    });
    stops.push(at);
    if (at === 'button#send-btn') break;
  }
  expect(stops.filter((s) => s.endsWith('(hidden)'))).toEqual([]);
  expect(stops.filter((s) => s === 'button').length).toBe(3); // the language switch
  expect(stops).toContain('a#open-app');
  expect(stops.filter((s) => s.startsWith('input#r-')).length).toBe(8); // one stop per result group
  expect(stops.filter((s) => s.startsWith('textarea#note-')).length).toBe(8);
  expect(stops).toContain('summary');
  expect(stops.at(-1)).toBe('button#send-btn');
  // Back to the first result group: arrows move AND choose (a native radio group).
  await page.locator('#r-n1-ok').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#r-n1-hard')).toBeChecked();
  await page.locator('#send-btn').focus();
  const [popup] = await Promise.all([context.waitForEvent('page'), page.keyboard.press('Enter')]);
  await popup.waitForLoadState('domcontentloaded');
  expect(popup.url().startsWith(`${TEST_FORM.url}?usp=pp_url&`)).toBe(true);
  await context.close();
});

// ─── The sheet is not the app's ───────────────────────────────────────────────

test('a new tester who answers the sheet first and then opens the app gets the app\'s start screen; the sheet\'s answers stay', async ({ browser }) => {
  const { context, page } = await freshContext(browser, { lang: 'en' });
  await page.goto('/test/');
  await ready(page);
  await choose(page, 'n1', 'ok');
  expect(Object.keys(await page.evaluate(() => ({ ...localStorage })))).toHaveLength(1); // the sheet saved its answers
  // "Open Fermatina": the app in a new tab, in the sheet's language.
  await expect(page.locator('#open-app')).toHaveAttribute('href', '/?lang=en');
  const [app] = await Promise.all([context.waitForEvent('page'), page.locator('#open-app').click()]);
  await expect(app.getByTestId('start-screen')).toBeVisible({ timeout: 20_000 });
  expect(await app.evaluate(() => localStorage.getItem('fermata-welcome-v1'))).toBe('pending');
  expect(JSON.parse((await app.evaluate((k) => localStorage.getItem(k), KEY))!).a.n1.r).toBe('ok');
  expect(Object.keys(await app.evaluate(() => ({ ...localStorage }))).sort()).toEqual(['fermata-welcome-v1', KEY, 'music-theory-app'].sort());
  await context.close();
});

test('the app\'s exported backup does not carry the sheet\'s answers', async ({ page }) => {
  // This page starts as a learner (the config's storageState: welcome seen, a settings save).
  await page.goto('/test/');
  await ready(page);
  await choose(page, 'n1', 'hard');
  await page.locator('#note-n1').fill('marker-for-the-backup-test');
  // Saved (wherever the sheet keeps it): the marker is in this browser's storage.
  expect(await page.evaluate(() => Object.values(localStorage).some((v) => v.includes('marker-for-the-backup-test')))).toBe(true);
  await page.goto('/');
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export backup' }).click()]);
  const file = fs.readFileSync((await download.path())!, 'utf8');
  expect(JSON.parse(file).format).toBe('fermata-backup'); // known positive: it is the app's backup
  expect(file).toContain('music-theory-app');
  expect(file).not.toContain(KEY);
  expect(file).not.toContain('marker-for-the-backup-test');
});

test('with the app\'s service worker installed, /test/ is still the sheet (from the server), and nothing of it is cached', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 20_000 }).toBe(true);
  // Known positive: an address of the app the precache does not hold literally gets the app's shell FROM the worker
  // (its navigation fallback; since 2026-11-18 it answers the app's own address only: e2e/not-found.spec.ts).
  // That allowlist alone now keeps this address from the app, so this test no longer sees the denylist behind it
  // (emptied, it still passes, 2026-11-19): `npm run check:sw` pins every denylist entry.
  const shell = await page.goto('/?view=explore');
  expect(shell!.fromServiceWorker()).toBe(true);
  for (const target of ['/test/', '/test/?lang=pt#player']) {
    const res = await page.goto(target);
    expect(res!.fromServiceWorker(), target).toBe(false);
    expect(res!.status(), target).toBe(200);
    await expect(page.locator('script[type="module"]'), target).toHaveCount(0);
    await ready(page);
    await expect(page.locator('#sheet-data')).toHaveCount(1);
    expect(await page.evaluate(() => !!navigator.serviceWorker.controller), target).toBe(true);
  }
  const cached = await page.evaluate(async () => {
    const out: string[] = [];
    for (const name of await caches.keys()) for (const req of await (await caches.open(name)).keys()) out.push(new URL(req.url).pathname);
    return out;
  });
  expect(cached).toContain('/index.html'); // known positive: the precache is there and readable
  expect(cached.filter((u) => u.startsWith('/test'))).toEqual([]);
});

// ─── Screenshots for the seat and the owner (TEST_SHOTS=<dir>) ───────────────
const SHOTS = process.env.TEST_SHOTS;
test.describe('screenshots', () => {
  test.skip(!SHOTS, 'TEST_SHOTS not set');
  test('the top of a sheet and the send panel at 390×844 and 1440×900, EN and PT by day, ES and one PT by night', async ({ browser }) => {
    test.setTimeout(120_000);
    fs.mkdirSync(SHOTS!, { recursive: true });
    const shots: [Lang, 'light' | 'dark', number, string][] = [
      ['en', 'light', 390, 'new'], ['en', 'light', 1440, 'new'], ['pt', 'light', 390, 'player'], ['pt', 'light', 1440, 'instrument'],
      ['pt', 'dark', 390, 'new'], ['es', 'light', 390, 'player'], ['es', 'dark', 1440, 'watching'],
    ];
    for (const [lang, scheme, width, view] of shots) {
      const { context, page } = await freshContext(browser, { lang, scheme, width, height: width < 500 ? 844 : 900, touch: width < 500 });
      await page.goto(`/test/?lang=${lang}#${view}`);
      await ready(page);
      const name = `test-${lang}-${width}-${scheme === 'light' ? 'day' : 'night'}-${view}`;
      if (view !== 'watching') {
        await choose(page, DATA![lang].sheets[view].tasks[0].id, 'ok');
        if (view !== 'instrument') await page.locator(`#hint-${DATA![lang].sheets[view].tasks[0].id} summary`).click();
      }
      await page.screenshot({ path: path.join(SHOTS!, `${name}-top.png`) });
      if (view !== 'watching') {
        await page.locator('#send-btn').scrollIntoViewIfNeeded();
        await page.locator('#send-h').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(SHOTS!, `${name}-send.png`) });
      }
      await context.close();
    }
  });
});
