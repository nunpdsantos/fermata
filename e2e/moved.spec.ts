import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Browser, type BrowserContext, type Page, type Route } from '@playwright/test';
import { LAPTOP, LOCALE, PHONE, audit, type Lang, type View } from './helpers/wave1';

/**
 * Fermata becomes Fermatina (2026-11-14), in a real browser, in both configs
 * (the dev server, and the production build under its CSP):
 *  - UNDER THE OLD HOSTNAME (https://fermata-music.vercel.app, which this
 *    test never contacts — see `oldAddress`): the app says it has moved (a
 *    toast), its panel exports a real file — today's backup, format
 *    'fermata-backup' — and links to https://fermatina.com in a new tab;
 *    Settings → Your data says it too; "Don't remind me again" is kept; the
 *    old address goes on working with the learner's save as it was;
 *  - on the normal test address the same journey shows none of it and never
 *    reads or writes the reminder's flag;
 *  - the start screen's "I have a progress file", with a file exported in the
 *    same test from an old-shape save on the old address, lands in the app
 *    with that save, byte for byte, no door chosen; a file that is not a
 *    backup says so by the link and changes nothing;
 *  - robots.txt, sitemap.xml and the canonical link (and, on the build, a
 *    page the service worker controls still gets the two files).
 * How the old hostname is run: every request to https://fermata-music.vercel.app
 * is answered from this run's own server (relayed by the test, `relay`), any
 * WebSocket to it or to fermatina.com is closed unopened, any request to
 * fermatina.com is aborted and counted, and Chromium resolves both names to
 * this machine, so nothing can reach the real sites. Service workers are
 * blocked in those contexts (the worker under the old hostname is untested).
 * Words come from the locale files. With MOVED_SHOTS=<dir>, the screenshots
 * for the seat and the owner are written there.
 */

test.use({ launchOptions: { args: ['--host-resolver-rules=MAP fermata-music.vercel.app 127.0.0.1, MAP fermatina.com 127.0.0.1, MAP www.fermatina.com 127.0.0.1'] } });

const OLD = 'https://fermata-music.vercel.app';
const FLAG = 'fermatina-moved-v1';
const BACKUP_KEYS = ['music-theory-app', 'music-theory-progress', 'fermata-drill-v1', 'fermata-fingering-v1'];

type Locale = {
  movedEntry: { toast: string; action: string };
  start: { progressFile: string; doorsHeading: string };
  backup: { invalidFile: string; exported: string };
  settings: { title: string };
  nav: { more: string; musicTheory: string };
  common: { close: string };
};
type Moved = Record<'title' | 'intro' | 'step1' | 'export' | 'step2' | 'step3' | 'nothingSaved' | 'keepsWorking' | 'stop' | 'settingsLine', string>;
const json = <T,>(file: string) => JSON.parse(fs.readFileSync(file, 'utf8')) as T;
const WORDS: Record<Lang, Locale> = { en: json('src/i18n/locales/en.json'), pt: json('src/i18n/locales/pt.json'), es: json('src/i18n/locales/es.json') };
const MOVED: Record<Lang, Moved> = { en: json('src/i18n/moved/en.json'), pt: json('src/i18n/moved/pt.json'), es: json('src/i18n/moved/es.json') };

/** An old-shape save, as production holds the owner's (wave3-seams.spec.ts seam 9): no profile, no welcome flag. */
function oldSave(settings: Record<string, unknown> = {}): Record<string, string> {
  const fixture = json<{ state: Record<string, unknown>; version: number }>('src/state/__tests__/fixtures/settings-v6-before-start.json');
  const done = ['l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u2m1', 'l1u2m2', 'l1u3m1', 'l1u3m2', 'l1u3m3', 'l1u4m1', 'l1u4m2', 'l2u4m1', 'l2u4m2', 'l2u5m1'];
  const FAR = 4102444800000;
  return {
    'music-theory-app': JSON.stringify({ ...fixture, state: { ...fixture.state, ...settings } }),
    'music-theory-progress': JSON.stringify({ state: { progress: {
      completedModules: done,
      moduleProgress: { l2u5m2: ['t1'] },
      exerciseResults: Object.fromEntries(done.map((id) => [id, { scores: {}, totalAttempts: 2, lastAttemptAt: 1793500000000, passed: true }])),
      reviewSchedules: Object.fromEntries(done.map((id, i) => [id, { completedAt: 1790000000000 + i, nextReviewAt: FAR, intervalLevel: 3, reviewCount: 3, lastReviewedAt: 1793000000000 }])),
    } }, version: 4 }),
    'fermata-drill-v1': JSON.stringify(json('src/state/__tests__/fixtures/drill-v3-before-reading.json')),
    'fermata-fingering-v1': JSON.stringify({ state: { overrides: {}, labelMode: 'degree' }, version: 1 }),
    'fermata-learn-session-v1': JSON.stringify({ state: { screen: null, check: null }, version: 1 }),
  };
}

/** Seeds storage once per context (a reload keeps what the app saved) and records every touch of the reminder's flag. */
async function prepare(context: BrowserContext, stores: Record<string, string>) {
  await context.addInitScript((seed) => {
    if (!sessionStorage.getItem('__moved-seeded')) {
      localStorage.clear();
      for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
      sessionStorage.setItem('__moved-seeded', '1');
    }
    const w = window as unknown as { __flag: string[] };
    w.__flag = [];
    for (const name of ['getItem', 'setItem', 'removeItem'] as const) {
      const original = Storage.prototype[name] as (...a: unknown[]) => unknown;
      Object.defineProperty(Storage.prototype, name, {
        configurable: true,
        value(this: Storage, ...a: unknown[]) {
          if (a[0] === 'fermatina-moved-v1') w.__flag.push(name);
          return original.apply(this, a);
        },
      });
    }
  }, stores);
}
const flagTouches = (page: Page) => page.evaluate(() => (window as unknown as { __flag: string[] }).__flag);
const storageOf = (page: Page) => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)!])));

/** A request to the old hostname, answered by this run's own server (the test fetches it; the browser never leaves the machine). */
async function relay(route: Route, local: string) {
  const request = route.request();
  const url = new URL(request.url());
  const accept = request.headers().accept;
  const upstream = await fetch(`${local}${url.pathname}${url.search}`, {
    method: request.method(),
    headers: accept ? { accept } : {},
    body: request.postData() ?? undefined,
    redirect: 'manual',
  });
  const headers: Record<string, string> = {};
  upstream.headers.forEach((value, name) => {
    if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(name)) headers[name] = value;
  });
  await route.fulfill({ status: upstream.status, headers, body: Buffer.from(await upstream.arrayBuffer()) });
}

interface Opened { context: BrowserContext; page: Page; toNew: string[]; served: string[] }

/** A browser on the old address (see the header), with these stores saved there. */
async function oldAddress(browser: Browser, baseURL: string, v: View, lang: Lang, stores: Record<string, string>, colorScheme: 'light' | 'dark' = 'light'): Promise<Opened> {
  const context = await browser.newContext({
    viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', colorScheme,
    serviceWorkers: 'block', locale: LOCALE[lang], storageState: { cookies: [], origins: [] },
  });
  const local = new URL(baseURL).origin;
  const served: string[] = [];
  await context.route(`${OLD}/**`, (route) => {
    served.push(new URL(route.request().url()).pathname);
    return relay(route, local);
  });
  const toNew: string[] = [];
  await context.route(/^https?:\/\/(www\.)?fermatina\.com(\/|$)/, (route) => {
    toNew.push(route.request().url());
    return route.abort();
  });
  await context.routeWebSocket(/fermata-music\.vercel\.app|fermatina\.com/, (ws) => ws.close());
  await prepare(context, stores);
  return { context, page: await context.newPage(), toNew, served };
}

/** The same browser on the normal test address. */
async function normalAddress(browser: Browser, v: View, lang: Lang, stores: Record<string, string>): Promise<Opened> {
  const context = await browser.newContext({
    viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce',
    serviceWorkers: 'block', locale: LOCALE[lang], storageState: { cookies: [], origins: [] },
  });
  const toNew: string[] = [];
  await context.route(/^https?:\/\/(www\.)?fermatina\.com(\/|$)/, (route) => {
    toNew.push(route.request().url());
    return route.abort();
  });
  await prepare(context, stores);
  return { context, page: await context.newPage(), toNew, served: [] };
}

const toastRegion = (page: Page) => page.getByTestId('toast-region');
const movedToast = (page: Page, lang: Lang) => toastRegion(page).locator('.toast-card').filter({ hasText: WORDS[lang].movedEntry.toast });
const appReady = (page: Page) => expect(page.getByTestId('app-topbar')).toBeVisible({ timeout: 20_000 });

async function openSettings(page: Page, lang: Lang) {
  await page.getByRole('button', { name: new RegExp(`^${WORDS[lang].nav.more}`) }).click();
  await page.getByRole('menuitem', { name: WORDS[lang].settings.title, exact: true }).click();
  const sheet = page.getByRole('dialog', { name: WORDS[lang].settings.title });
  await expect(sheet).toBeVisible();
  return sheet;
}

async function expectAddressLink(link: ReturnType<Page['locator']>) {
  await expect(link).toHaveText('fermatina.com');
  await expect(link).toHaveAttribute('href', 'https://fermatina.com');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
}

/** The moving panel, opened from the toast. */
async function openPanel(page: Page, lang: Lang) {
  await expect(movedToast(page, lang)).toBeVisible({ timeout: 15_000 });
  await movedToast(page, lang).getByRole('button', { name: WORDS[lang].movedEntry.action }).click();
  const panel = page.getByRole('dialog', { name: MOVED[lang].title });
  await expect(panel).toBeVisible({ timeout: 15_000 });
  return panel;
}

/** "Export my progress" in the panel: a real download; its name and its contents. */
async function exportFromPanel(page: Page, panel: ReturnType<Page['locator']>, lang: Lang) {
  const [download] = await Promise.all([page.waitForEvent('download'), panel.getByRole('button', { name: MOVED[lang].export }).click()]);
  const file = await download.path();
  return { name: download.suggestedFilename(), file, body: JSON.parse(fs.readFileSync(file, 'utf8')) as { format: string; version: number; data: Record<string, unknown> } };
}

for (const [v, lang] of [[PHONE, 'en'], [LAPTOP, 'pt']] as const) {
  test(`old address (${v.name}, ${lang}): the toast, the panel, a real download of today's backup, the link, Settings' line; the save as it was`, async ({ browser, baseURL }) => {
    test.setTimeout(120_000);
    const stores = oldSave({ language: lang, themeMode: 'fermata' });
    const { context, page, toNew, served } = await oldAddress(browser, baseURL!, v, lang, stores);
    await page.goto(`${OLD}/`);
    await appReady(page);
    expect(new URL(page.url()).host).toBe('fermata-music.vercel.app');
    expect(served).toContain('/');

    const panel = await openPanel(page, lang);
    for (const key of ['intro', 'step1', 'step3', 'nothingSaved', 'keepsWorking'] as const) await expect(panel).toContainText(MOVED[lang][key]);
    await expect(panel.getByRole('listitem')).toHaveCount(3);
    await expect(panel.getByRole('listitem').nth(1)).toHaveText(MOVED[lang].step2);
    await expectAddressLink(panel.getByTestId('moved-link'));
    await audit(page, v, `moved panel ${v.name} ${lang}`);

    // Export: the same file Settings writes — today's format, every saved store as saved.
    const exported = await exportFromPanel(page, panel, lang);
    expect(exported.name).toMatch(/^fermatina-backup-\d{4}-\d{2}-\d{2}\.json$/);
    expect(exported.body.format).toBe('fermata-backup');
    expect(exported.body.version).toBe(1);
    expect(Object.keys(exported.body.data).sort()).toEqual([...BACKUP_KEYS].sort());
    for (const k of BACKUP_KEYS) expect(JSON.stringify(exported.body.data[k]), k).toBe(stores[k]);
    await expect(toastRegion(page)).toContainText(WORDS[lang].backup.exported);

    // Closed after an export: no reminder for the rest of this visit.
    await panel.getByRole('button', { name: WORDS[lang].common.close }).click();
    await expect(panel).toHaveCount(0);
    await page.waitForTimeout(2000);
    await expect(movedToast(page, lang)).toHaveCount(0);

    // Settings → Your data says it too, with the link.
    const settings = await openSettings(page, lang);
    await expect(settings.getByTestId('settings-moved')).toHaveText(MOVED[lang].settingsLine);
    await expectAddressLink(settings.getByTestId('settings-moved-link'));
    await page.keyboard.press('Escape');

    // The flag was read (the reminder's guard) and never written; fermatina.com was asked nothing;
    // the old address goes on with the save exactly as it was.
    expect(await flagTouches(page)).not.toContain('setItem');
    expect(toNew).toEqual([]);
    const after = await storageOf(page);
    expect(after[FLAG]).toBeUndefined();
    for (const k of Object.keys(stores)) expect(after[k], k).toBe(stores[k]);
    await context.close();
  });
}

/** The reminder's card where it stands: its box, its lines, and whether it is shown whole (not queued, not covered). */
async function toastAt(page: Page, lang: Lang) {
  const card = movedToast(page, lang);
  await expect(card).toHaveCount(1, { timeout: 15_000 });
  await page.waitForTimeout(800);
  return card.evaluate((el) => {
    const lines = (node: Element | null) => {
      if (!node) return 0;
      const range = document.createRange();
      range.selectNodeContents(node);
      return new Set(Array.from(range.getClientRects()).filter((r) => r.width > 0).map((r) => Math.round(r.top))).size;
    };
    const r = el.getBoundingClientRect();
    const message = el.querySelector('span.flex-1');
    const button = el.querySelector('button.btn-primary');
    const bar = document.querySelector('[data-testid="app-topbar"]')!.getBoundingClientRect();
    const dock = document.querySelector('[data-testid="instrument-dock"]');
    return {
      height: Math.round(r.height * 10) / 10,
      lines: lines(message),
      buttonLines: lines(button),
      queued: el.hasAttribute('data-toast-queued') || (el as HTMLElement).inert,
      shown: (el as HTMLElement).checkVisibility({ opacityProperty: true, visibilityProperty: true }),
      clipped: !!message && message.scrollHeight > message.clientHeight + 0.5,
      top: r.top, bottom: r.bottom, barBottom: bar.bottom,
      dockTop: dock ? dock.getBoundingClientRect().top : innerHeight,
      room: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--toast-room')) || null,
      detent: dock?.getAttribute('data-detent') ?? null,
    };
  });
}

// 2026-11-14 follow-up: the owner's phone (390×844), Explore, the guitar sheet at Full — the toast
// region keeps one toast's room there (toastLayout.ts, unchanged); the reminder must fit it in every
// language, whole. Measured in Learn too (the dock at its resting detent).
test('old address, 390×844, Explore with the instrument at Full: the reminder is shown whole in EN, PT and ES', async ({ browser, baseURL }) => {
  test.setTimeout(150_000);
  for (const lang of ['en', 'pt', 'es'] as const) {
    const { context, page } = await oldAddress(browser, baseURL!, PHONE, lang, oldSave({ language: lang, lastView: 'explore', themeMode: 'fermata' }));
    await page.goto(`${OLD}/`);
    await appReady(page);
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'full');
    const explore = await toastAt(page, lang);
    const where = `${lang} 390×844 Explore at Full`;
    expect.soft(explore.detent, where).toBe('full');
    expect.soft(explore.queued, `${where}: not queued`).toBe(false);
    expect.soft(explore.shown, `${where}: shown`).toBe(true);
    expect.soft(explore.clipped, `${where}: its words not cut`).toBe(false);
    expect.soft(explore.top, `${where}: under the top bar`).toBeGreaterThanOrEqual(explore.barBottom - 0.5);
    expect.soft(explore.bottom, `${where}: above the instrument sheet`).toBeLessThanOrEqual(explore.dockTop + 0.5);
    await page.locator('[data-tab="learn"]').click();
    await expect(page.locator('#learn-panel')).toBeVisible({ timeout: 15_000 });
    const learn = await toastAt(page, lang);
    expect.soft(learn.queued, `${lang} Learn: not queued`).toBe(false);
    test.info().annotations.push({ type: 'toast', description: `${lang}: Explore at Full ${explore.height} px, ${explore.lines} line(s) + button ${explore.buttonLines} line(s), room ${explore.room} px; Learn (${learn.detent}) ${learn.height} px, ${learn.lines} line(s) + button ${learn.buttonLines} line(s)` });
    console.log(`[toast] ${lang}: Explore at Full ${explore.height} px, ${explore.lines} line(s), button ${explore.buttonLines} line(s), queued=${explore.queued}, room ${explore.room} px; Learn (${learn.detent}) ${learn.height} px, ${learn.lines} line(s), button ${learn.buttonLines} line(s); dockTop ${explore.dockTop}, barBottom ${explore.barBottom}`);
    await context.close();
  }
});

test('old address: "Don\'t remind me again" is saved and kept across visits; Settings\' line stays', async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  const lang: Lang = 'en';
  const { context, page, toNew } = await oldAddress(browser, baseURL!, PHONE, lang, oldSave({ language: lang }));
  await page.goto(`${OLD}/`);
  await appReady(page);
  const panel = await openPanel(page, lang);
  await panel.getByRole('button', { name: MOVED[lang].stop }).click();
  await expect(panel).toHaveCount(0);
  await expect(movedToast(page, lang)).toHaveCount(0);
  // Focus goes to the top bar's "⋯" (Settings, with the moved line, is behind it), not to <body>.
  await expect(page.getByRole('button', { name: new RegExp(`^${WORDS[lang].nav.more}`) })).toBeFocused();
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(false);
  expect(await page.evaluate((k) => localStorage.getItem(k), FLAG)).toBe('{"stopped":true}');
  expect(await flagTouches(page)).toContain('setItem');

  await page.reload();
  await appReady(page);
  await page.waitForTimeout(3000);
  await expect(movedToast(page, lang)).toHaveCount(0);
  const settings = await openSettings(page, lang);
  await expect(settings.getByTestId('settings-moved')).toHaveText(MOVED[lang].settingsLine);
  expect(toNew).toEqual([]);
  await context.close();
});

for (const v of [PHONE, LAPTOP]) {
  test(`normal address (${v.name}): the same journey shows no notice, no Settings line, and never touches the flag`, async ({ browser }) => {
    test.setTimeout(90_000);
    const lang: Lang = 'en';
    const stores = oldSave({ language: lang });
    const { context, page, toNew } = await normalAddress(browser, v, lang, stores);
    await page.goto('/');
    await appReady(page);
    expect(new URL(page.url()).hostname).toBe('localhost');
    await page.waitForTimeout(3000);
    await expect(movedToast(page, lang)).toHaveCount(0);
    await expect(page.getByRole('dialog', { name: MOVED[lang].title })).toHaveCount(0);
    const settings = await openSettings(page, lang);
    await expect(settings.getByTestId('settings-moved')).toHaveCount(0);
    await expect(settings.getByRole('link', { name: 'fermatina.com' })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await page.reload();
    await appReady(page);
    await page.waitForTimeout(2000);
    await expect(movedToast(page, lang)).toHaveCount(0);
    expect(await flagTouches(page)).toEqual([]);
    const after = await storageOf(page);
    expect(after[FLAG]).toBeUndefined();
    for (const k of Object.keys(stores)) expect(after[k], k).toBe(stores[k]);
    expect(toNew).toEqual([]);
    await context.close();
  });
}

test('the start screen: a file exported on the old address in this test brings the learner in, byte for byte, no door chosen', async ({ browser, baseURL }) => {
  test.setTimeout(150_000);
  // 1. On the old address, an old-shape save (the owner's: Portuguese, Learn last, no profile): export it from the panel.
  const stores = oldSave();
  const old = await oldAddress(browser, baseURL!, PHONE, 'pt', stores);
  await old.page.goto(`${OLD}/`);
  await appReady(old.page);
  const panel = await openPanel(old.page, 'pt');
  const exported = await exportFromPanel(old.page, panel, 'pt');
  expect(old.toNew).toEqual([]);

  // 2. The new address (here the normal test address) in a browser that has never opened the app.
  const context = await browser.newContext({
    viewport: PHONE.viewport, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
    serviceWorkers: 'block', locale: LOCALE.en, storageState: { cookies: [], origins: [] },
  });
  const page = await context.newPage();
  await page.goto('/');
  const start = page.getByTestId('start-screen');
  await expect(start).toBeVisible({ timeout: 15_000 });
  // The link stands under the three doors.
  const link = start.getByRole('button', { name: WORDS.en.start.progressFile });
  await expect(link).toBeVisible();
  const doors = await start.getByRole('list').boundingBox();
  const linkBox = await link.boundingBox();
  expect(linkBox!.y).toBeGreaterThanOrEqual(doors!.y + doors!.height);
  let navigations = 0;
  page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) navigations++; });
  const dialogs: string[] = [];
  page.on('dialog', (d) => { dialogs.push(d.message()); void d.dismiss(); });
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), link.click()]);
  await chooser.setFiles(exported.file);

  // 3. In the app, with exactly that save: his view (Learn), his language, every store byte for byte.
  await expect(page.locator('#learn-panel')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('start-screen')).toHaveCount(0);
  await expect(page.getByRole('tab', { name: 'Aprender' })).toHaveAttribute('aria-selected', 'true');
  expect(navigations).toBeGreaterThan(0);
  expect(dialogs).toEqual([]);
  await page.waitForTimeout(1500);
  const after = await storageOf(page);
  for (const k of BACKUP_KEYS) expect(after[k], k).toBe(stores[k]);
  expect(after['fermata-welcome-v1']).toBe('seen');
  expect(JSON.parse(after['music-theory-app']).state.learnerProfile).toBeUndefined();
  expect(after[FLAG]).toBeUndefined();
  // A reload: still the app.
  await page.reload();
  await expect(page.locator('#learn-panel')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('start-screen')).toHaveCount(0);
  await old.context.close();
  await context.close();
});

test('the start screen: a file that is not a backup says so by the link, in the page; nothing changes', async ({ browser }) => {
  for (const lang of ['en', 'pt'] as const) {
    const context = await browser.newContext({
      viewport: LAPTOP.viewport, reducedMotion: 'reduce', serviceWorkers: 'block', locale: LOCALE[lang], storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await page.goto('/');
    const start = page.getByTestId('start-screen');
    await expect(start).toBeVisible({ timeout: 15_000 });
    const before = await storageOf(page);
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), start.getByRole('button', { name: WORDS[lang].start.progressFile }).click()]);
    await chooser.setFiles({ name: 'notes.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ format: 'something-else', data: {} })) });
    const error = start.getByTestId('start-import-error');
    await expect(error).toHaveText(WORDS[lang].backup.invalidFile);
    await expect(error).toHaveAttribute('role', 'alert');
    await audit(page, LAPTOP, `start screen, bad file (${lang})`);
    expect(await storageOf(page)).toEqual(before);
    await expect(start.getByRole('heading', { level: 2, name: WORDS[lang].start.doorsHeading })).toBeVisible();
    await context.close();
  }
});

test('the start screen on the old address: the moved line with its link, in the page; the progress-file link too', async ({ browser, baseURL }) => {
  test.setTimeout(60_000);
  for (const lang of ['en', 'pt'] as const) {
    const { context, page, toNew } = await oldAddress(browser, baseURL!, PHONE, lang, {});
    await page.goto(`${OLD}/`);
    const start = page.getByTestId('start-screen');
    await expect(start).toBeVisible({ timeout: 20_000 });
    const line = start.getByTestId('start-moved');
    await expect(line).toHaveText(WORDS[lang].movedEntry.toast);
    await expectAddressLink(line.getByRole('link'));
    await expect(start.getByRole('button', { name: WORDS[lang].start.progressFile })).toBeVisible();
    await audit(page, PHONE, `start screen on the old address (${lang})`);
    expect(toNew).toEqual([]);
    expect(await flagTouches(page)).toEqual([]);
    await context.close();
  }
});

test('robots.txt and sitemap.xml are served as files; the page names https://fermatina.com/ as canonical', async ({ page, request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(robots.headers()['content-type']).toMatch(/^text\/plain/);
  expect(await robots.text()).toBe('User-agent: *\nAllow: /\n\nSitemap: https://fermatina.com/sitemap.xml\n');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toMatch(/xml/);
  expect(await sitemap.text()).toContain('<loc>https://fermatina.com/</loc>');
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://fermatina.com/');
  await expect(page).toHaveTitle(/^Fermatina — /);
});

test('on the build, a page the service worker controls still gets robots.txt and sitemap.xml, not the app; neither is precached', async ({ page, request }) => {
  const manifest = await request.get('/manifest.webmanifest');
  test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'no service worker on the dev server (devOptions disabled)');
  const m = await manifest.json();
  expect([m.name, m.short_name]).toEqual(['Fermatina — Music Theory', 'Fermatina']);
  expect([m.start_url, m.scope, m.id]).toEqual(['/', '/', undefined]);
  const sw = await (await request.get('/sw.js')).text();
  expect(sw).not.toMatch(/robots\.txt"|sitemap\.xml"/);
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 20_000 }).toBe(true);
  // Known positive: a path that is no file gets the app's page from the worker.
  await page.goto('/no-such-page');
  await expect(page.locator('#root')).toHaveCount(1);
  await page.goto('/robots.txt');
  await expect(page.locator('body')).toHaveText(/^User-agent: \*/);
  await expect(page.locator('#root')).toHaveCount(0);
  await page.goto('/sitemap.xml');
  expect(await page.content()).toContain('https://fermatina.com/');
  await expect(page.locator('#root')).toHaveCount(0);
});

// ─── Screenshots for the seat and the owner (MOVED_SHOTS=<dir>) ─────────────
const SHOTS = process.env.MOVED_SHOTS;
test.describe('screenshots', () => {
  test.skip(!SHOTS, 'MOVED_SHOTS not set');
  test.describe.configure({ mode: 'serial' });
  const shot = (page: Page, name: string, clip?: { x: number; y: number; width: number; height: number }) =>
    page.screenshot({ path: path.join(SHOTS!, `${name}.png`), ...(clip ? { clip } : {}) });

  test('the top bar at 640, 768, 1024 and 1440 px (EN, PT)', async ({ browser }) => {
    test.setTimeout(180_000);
    for (const lang of ['en', 'pt'] as const) {
      for (const width of [640, 768, 1024, 1440]) {
        const v: View = { name: `w${width}`, viewport: { width, height: 800 }, touch: width < 1024 };
        const { context, page } = await normalAddress(browser, v, lang, oldSave({ language: lang, lastView: 'explore', themeMode: 'fermata' }));
        await page.goto('/');
        await appReady(page);
        await page.waitForTimeout(800);
        const bar = (await page.getByTestId('app-topbar').boundingBox())!;
        await shot(page, `topbar-${lang}-${width}`, { x: 0, y: 0, width, height: Math.ceil(bar.height) });
        await context.close();
      }
    }
  });

  test('the start screen with "I have a progress file" (390, 1440; EN, PT; and an error)', async ({ browser }) => {
    test.setTimeout(120_000);
    for (const lang of ['en', 'pt'] as const) {
      for (const v of [PHONE, LAPTOP]) {
        const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block', locale: LOCALE[lang], storageState: { cookies: [], origins: [] } });
        const page = await context.newPage();
        await page.goto('/');
        const start = page.getByTestId('start-screen');
        await expect(start).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(500);
        await shot(page, `start-${lang}-${v.viewport.width}`);
        await start.getByTestId('start-import').scrollIntoViewIfNeeded();
        await shot(page, `start-${lang}-${v.viewport.width}-link`);
        if (v === LAPTOP) {
          const [chooser] = await Promise.all([page.waitForEvent('filechooser'), start.getByTestId('start-import').click()]);
          await chooser.setFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{not json') });
          await expect(start.getByTestId('start-import-error')).toBeVisible();
          await shot(page, `start-${lang}-${v.viewport.width}-bad-file`);
        }
        await context.close();
      }
    }
  });

  test('the old address: the toast, the panel, Settings\' line and the start screen\'s line (390, 1440; EN, PT; day; one night)', async ({ browser, baseURL }) => {
    test.setTimeout(240_000);
    const runs: [View, Lang, 'day' | 'night'][] = [[PHONE, 'en', 'day'], [PHONE, 'pt', 'day'], [LAPTOP, 'en', 'day'], [LAPTOP, 'pt', 'day'], [PHONE, 'pt', 'night']];
    for (const [v, lang, theme] of runs) {
      const tag = `${lang}-${v.viewport.width}-${theme}`;
      // From Learn, the owner's own last view (the dock rests at Peek there; see the Explore-at-Full shot below).
      const { context, page } = await oldAddress(browser, baseURL!, v, lang, oldSave({ language: lang, lastView: 'learn', themeMode: theme === 'night' ? 'fermata-night' : 'fermata' }), theme === 'night' ? 'dark' : 'light');
      await page.goto(`${OLD}/`);
      await appReady(page);
      await expect(movedToast(page, lang)).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(800);
      await shot(page, `old-toast-${tag}`);
      const panel = await openPanel(page, lang);
      await page.waitForTimeout(600);
      await shot(page, `old-panel-${tag}`);
      await panel.getByTestId('moved-stop').scrollIntoViewIfNeeded();
      await shot(page, `old-panel-${tag}-end`);
      await page.keyboard.press('Escape');
      const settings = await openSettings(page, lang);
      await settings.getByTestId('settings-moved').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await shot(page, `old-settings-${tag}`);
      await context.close();
    }
    // A phone in Explore with the instrument at Full (the owner's saved detent): the toast region keeps one
    // toast line above the sheet; a card taller than that waits, queued and inert (layout/toastLayout.ts).
    for (const lang of ['en', 'pt'] as const) {
      const { context, page } = await oldAddress(browser, baseURL!, PHONE, lang, oldSave({ language: lang, lastView: 'explore', themeMode: 'fermata' }));
      await page.goto(`${OLD}/`);
      await appReady(page);
      await expect(movedToast(page, lang)).toHaveCount(1, { timeout: 15_000 });
      await page.waitForTimeout(800);
      const queued = await movedToast(page, lang).getAttribute('data-toast-queued');
      test.info().annotations.push({ type: 'explore-full', description: `${lang} 390 Explore at Full: the moved toast ${queued === null ? 'shows' : 'is queued (hidden, inert)'}` });
      await shot(page, `old-toast-${lang}-390-explore-full`);
      await context.close();
    }
    for (const [v, lang] of [[PHONE, 'en'], [PHONE, 'pt'], [LAPTOP, 'en'], [LAPTOP, 'pt']] as const) {
      const { context, page } = await oldAddress(browser, baseURL!, v, lang, {});
      await page.goto(`${OLD}/`);
      await expect(page.getByTestId('start-moved')).toBeVisible({ timeout: 20_000 });
      await page.waitForTimeout(500);
      await shot(page, `old-start-${lang}-${v.viewport.width}`);
      await context.close();
    }
  });
});
