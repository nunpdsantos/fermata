import { test, expect, type Browser, type BrowserContextOptions, type Page } from '@playwright/test';
import fs from 'node:fs';

/**
 * Shared links (wave 1, stream E), dev server and preview (production
 * headers + service worker):
 *  - a student who has never opened Fermatina opens "D major, the A chord, on
 *    guitar" and sees exactly that (phone and laptop); the address bar is
 *    clean afterwards;
 *  - a lesson link opens the lesson;
 *  - a link opened during a check does not lose the check: it waits, then
 *    offers itself with "Open";
 *  - "Copy link" puts the expected address on the clipboard (laptop) or in
 *    the share sheet (phone), and when the browser refuses both, the link is
 *    shown in a selectable field;
 *  - preview only: a link opened in an app the service worker already
 *    controls, and offline.
 * Screenshots: SHARE_SHOTS=<dir>.
 */

const SHOTS = process.env.SHARE_SHOTS;
const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const LAPTOP = { viewport: { width: 1440, height: 900 } };
const DEVICES = [
  { name: 'phone', opts: PHONE },
  { name: 'laptop', opts: LAPTOP },
] as const;

const LINK = '/?key=D&scale=major&chord=A&inst=guitar';

async function newPage(browser: Browser, opts: BrowserContextOptions, seed?: object) {
  const context = await browser.newContext({ reducedMotion: 'reduce', ...opts });
  if (seed) {
    await context.addInitScript((blob) => {
      if (sessionStorage.getItem('__seeded')) return;
      localStorage.setItem('music-theory-app', blob);
      sessionStorage.setItem('__seeded', '1');
    }, JSON.stringify(seed));
  }
  const page = await context.newPage();
  return { context, page };
}

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
}

async function expectDMajorAChordGuitar(page: Page) {
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('key-summary')).toContainText('D Major');
  await expect(page.getByTestId('chord-detail').locator('h3')).toContainText('A');
  await expect(page.getByTestId('chord-detail').locator('h3')).toContainText('Major');
  await expect(page.getByRole('radio', { name: 'Guitar' }).first()).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('[role="grid"]').first()).toBeVisible();
  // The address bar is clean: a refresh does not open the link again.
  expect(new URL(page.url()).search).toBe('');
}

for (const d of DEVICES) {
  test(`${d.name}: a cold open of a key + chord + guitar link shows exactly that`, async ({ browser }) => {
    const { context, page } = await newPage(browser, d.opts);
    await page.goto(LINK);
    await expectDMajorAChordGuitar(page);
    await shot(page, `share-cold-open-${d.name}-day-en`);
    // A refresh keeps it (saved as the learner's own selection) and opens no link again.
    await page.reload();
    await expect(page.getByTestId('key-summary')).toContainText('D Major');
    await expect(page.getByTestId('toast-region')).not.toContainText('link');
    await context.close();
  });

  test(`${d.name}: a lesson link opens that lesson; the address bar is clean`, async ({ browser }) => {
    const { context, page } = await newPage(browser, d.opts);
    await page.goto('/?lesson=l2u5m3');
    await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
    expect(new URL(page.url()).search).toBe('');
    await shot(page, `share-lesson-open-${d.name}-day-en`);
    await context.close();
  });
}

test('a broken or hostile link opens the app as usual and says so', async ({ browser }) => {
  const { context, page } = await newPage(browser, LAPTOP);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`/?key=%3Cscript%3Ealert(1)%3C%2Fscript%3E&scale=constructor&chord=${'C7'.repeat(40)}&lesson=..%2F..%2F&inst=banjo`);
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('toast-region')).toContainText('This link could not be read, so Fermatina opened as usual.');
  await expect(page.getByTestId('key-summary')).toContainText('C Major');
  expect(new URL(page.url()).search).toBe('');
  expect(errors).toEqual([]);
  await context.close();
});

test('a link opened during a check does not lose the check; it waits, then offers “Open”', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await newPage(browser, PHONE);
  await page.goto('/?lesson=l2u5m3');
  await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('section-picker').getByRole('button', { name: 'Check', exact: true }).click();
  await page.getByRole('button', { name: 'Start the check' }).click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  // Answer the first question (right or wrong: either is work in progress).
  await page.getByTestId('check-answers').locator('button').first().click();
  await page.getByRole('button', { name: 'Submit' }).click();
  const pips = await page.getByTestId('check-pips').innerHTML();
  const position = await page.getByTestId('check-position').textContent();

  // The teacher's link arrives (opened in this tab).
  await page.goto(LINK);
  await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('check-position')).toHaveText(position!);
  expect(await page.getByTestId('check-pips').innerHTML()).toBe(pips);
  await expect(page.getByTestId('toast-region')).toContainText('This link opens D Major, the A chord, on the guitar. Fermatina will offer to open it when you have finished what you are doing.');
  expect(new URL(page.url()).search).toBe('');
  await shot(page, 'share-held-during-check-phone-day-en');

  // Leaving the check ends the work: the link offers itself.
  await page.getByRole('button', { name: 'Exit the check' }).click();
  const open = page.getByTestId('toast-region').getByRole('button', { name: 'Open' });
  await expect(open).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId('toast-region')).toContainText('Ready to open the link: D Major, the A chord, on the guitar');
  await shot(page, 'share-ready-offer-phone-day-en');
  await open.click();
  await expectDMajorAChordGuitar(page);
  await context.close();
});

test('laptop: Copy link puts the expected address on the clipboard (Explore and a lesson)', async ({ browser, baseURL }) => {
  const { context, page } = await newPage(browser, { ...LAPTOP, permissions: ['clipboard-read', 'clipboard-write'] });
  await page.goto(LINK);
  await expectDMajorAChordGuitar(page);
  await page.getByTestId('explore-menu').getByRole('button').first().click();
  await shot(page, 'share-explore-menu-laptop-day-en');
  await page.getByRole('menuitem', { name: 'Copy link' }).click();
  await expect(page.getByTestId('toast-region')).toContainText('Link copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/?key=D&scale=major&chord=A&inst=guitar`);

  // A sharp key and a slash chord, chosen in the app.
  await page.goto('/?key=F%23&scale=natural_minor&chord=D%2FF%23&inst=piano');
  await expect(page.getByTestId('key-summary')).toContainText('F♯ Natural Minor');
  await page.getByTestId('explore-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Copy link' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/?key=F%23&scale=natural_minor&chord=D%2FF%23&inst=piano`);

  await page.goto('/?lesson=l2u5m3');
  await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('lesson-menu').getByRole('button').first().click();
  await shot(page, 'share-lesson-menu-laptop-day-en');
  await page.getByRole('menuitem', { name: 'Copy link' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/?lesson=l2u5m3`);
  await context.close();
});

test('phone: Share link hands the address to the share sheet', async ({ browser, baseURL }) => {
  const { context, page } = await newPage(browser, PHONE);
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: (data: ShareData) => {
        (window as unknown as { __shared: ShareData[] }).__shared = [...((window as unknown as { __shared?: ShareData[] }).__shared ?? []), data];
        return Promise.resolve();
      },
    });
  });
  await page.goto(LINK);
  await expectDMajorAChordGuitar(page);
  await page.getByTestId('explore-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Share link' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __shared?: ShareData[] }).__shared?.map((s) => s.url))).toEqual([`${baseURL}/?key=D&scale=major&chord=A&inst=guitar`]);
  await context.close();
});

for (const theme of ['day', 'night'] as const) {
  test(`when the browser refuses to copy, the link is shown in a selectable field (${theme})`, async ({ browser, baseURL }) => {
    const { context, page } = await newPage(browser, PHONE, { state: { themeMode: theme === 'day' ? 'fermata' : 'fermata-night', language: 'en' }, version: 6 });
    // The share sheet refuses with a DOMException by day and with a plain
    // TypeError by night (review 2026-11-10): only the learner closing the
    // sheet (AbortError) may end delivery; every other failure reaches the field.
    await context.addInitScript((kind) => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } });
      Object.defineProperty(navigator, 'share', { configurable: true, value: () => Promise.reject(kind === 'type' ? new TypeError('cannot share this') : new DOMException('no', 'NotAllowedError')) });
    }, theme === 'day' ? 'dom' : 'type');
    await page.goto(LINK);
    await expectDMajorAChordGuitar(page);
    await page.getByTestId('explore-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Share link' }).click();
    const field = page.getByTestId('share-fallback-field');
    await expect(field).toBeVisible();
    await expect(field).toHaveValue(`${baseURL}/?key=D&scale=major&chord=A&inst=guitar`);
    await expect.poll(() => field.evaluate((el: HTMLInputElement) => el.selectionEnd! - el.selectionStart!)).toBe(`${baseURL}/?key=D&scale=major&chord=A&inst=guitar`.length);
    await shot(page, `share-fallback-phone-${theme}-en`);
    await page.getByTestId('share-fallback').getByRole('button', { name: 'Close' }).click();
    await expect(field).toHaveCount(0);
    await context.close();
  });
}

// ── Production headers + service worker (preview only) ─────────────────────

async function previewOnly(page: Page) {
  const manifest = await page.request.get('/manifest.webmanifest');
  test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'No service worker on the dev server');
}

test('preview: a link opened in an app the service worker already controls', async ({ browser }) => {
  const { context, page } = await newPage(browser, PHONE);
  await page.goto('/');
  await previewOnly(page);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, { timeout: 20_000 });
  await page.goto(LINK);
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await expectDMajorAChordGuitar(page);
  await context.close();
});

test('preview: a link opens offline after one online visit', async ({ browser }) => {
  const { context, page } = await newPage(browser, LAPTOP);
  await page.goto('/');
  await previewOnly(page);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, { timeout: 20_000 });
  await expect(page.locator('#explore-panel')).toBeVisible();
  await page.waitForTimeout(3000); // precache + cache warm-up settle
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await context.route('**/*', (route) => route.abort('internetdisconnected'));
  await page.goto(LINK);
  await expectDMajorAChordGuitar(page);
  await page.goto('/?lesson=l2u5m3');
  await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
  await context.close();
});
