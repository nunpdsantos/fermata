import { test, expect, type Browser, type Page } from '@playwright/test';
import { auditPage } from './helpers/designAudit';
import { LOCALE, type Lang } from './helpers/wave1';

/**
 * The design rules on the new sentences of the saved-work stream (audit A15,
 * A16, A20, 2026-11-18): Settings → Your data with an export's damaged parts
 * named (two lines) and with an import the browser would not save; the start
 * screen's line by "I have a progress file"; the test sheet's empty Send
 * (build only). Phone 390×844 and 320×568, landscape 844×390, laptop
 * 1440×900, day and night, EN / PT / ES: type ≥ 12 px, tap ≥ --tap, text
 * contrast, nothing cut off, no sideways scroll, and the sentence on screen.
 */

type V = { w: number; h: number; touch: boolean; scheme: 'light' | 'dark'; lang: Lang };
const CASES: V[] = [
  { w: 390, h: 844, touch: true, scheme: 'light', lang: 'en' },
  { w: 390, h: 844, touch: true, scheme: 'dark', lang: 'en' },
  { w: 844, h: 390, touch: true, scheme: 'light', lang: 'en' },
  { w: 1440, h: 900, touch: false, scheme: 'dark', lang: 'en' },
  { w: 1440, h: 900, touch: false, scheme: 'light', lang: 'en' },
  { w: 320, h: 568, touch: true, scheme: 'light', lang: 'pt' },
  { w: 390, h: 844, touch: true, scheme: 'dark', lang: 'pt' },
  { w: 1440, h: 900, touch: false, scheme: 'light', lang: 'pt' },
  { w: 320, h: 568, touch: true, scheme: 'dark', lang: 'es' },
  { w: 844, h: 390, touch: true, scheme: 'light', lang: 'es' },
];
const name = (v: V) => `${v.lang} ${v.w}×${v.h} ${v.scheme === 'light' ? 'day' : 'night'}`;
const MORE = { en: 'More', pt: 'Mais', es: 'Más' } as const;
const SETTINGS = { en: 'Settings', pt: 'Definições', es: 'Ajustes' } as const;
const EXPORT = { en: 'Export backup', pt: 'Exportar dados', es: 'Exportar datos' } as const;

async function open(browser: Browser, v: V, saved: Record<string, string>) {
  const origin = new URL(test.info().project.use.baseURL!).origin;
  const context = await browser.newContext({
    viewport: { width: v.w, height: v.h }, isMobile: v.touch, hasTouch: v.touch, locale: LOCALE[v.lang], colorScheme: v.scheme,
    reducedMotion: 'reduce',
    storageState: { cookies: [], origins: [{ origin, localStorage: Object.entries(saved).map(([n, value]) => ({ name: n, value })) }] },
  });
  return { context, page: await context.newPage() };
}
const settingsSave = (v: V) => JSON.stringify({ state: { language: v.lang, themeMode: v.scheme === 'dark' ? 'fermata-night' : 'fermata' }, version: 6 });

async function check(page: Page, v: V, where: string, line: ReturnType<Page['locator']>, scroll = false) {
  if (scroll) await line.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400); // the sheet's own scroll to the sentence (smooth or not) has settled
  for (const el of await line.all()) {
    const box = (await el.boundingBox())!;
    expect(box.y, `${where}: the sentence on screen`).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height, `${where}: the sentence on screen`).toBeLessThanOrEqual(v.h + 1);
  }
  const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 4));
  expect.soft(r.textNodes, `${where}: audited no text`).toBeGreaterThan(10);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: sideways scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
}

async function openSettings(page: Page, lang: Lang) {
  await page.goto('/');
  await page.getByRole('button', { name: MORE[lang], exact: true }).click();
  await page.getByRole('menuitem', { name: SETTINGS[lang] }).click();
  await expect(page.getByTestId('settings-sheet')).toBeVisible();
}

const failWrites = (page: Page, key: string) => page.evaluate((k) => {
  const real = Storage.prototype.setItem;
  Storage.prototype.setItem = function (name: string, value: string) {
    if (name === k && value.includes('"imported"')) throw new DOMException('full', 'QuotaExceededError');
    return real.call(this, name, value);
  };
}, key);
const FILE = JSON.stringify({ format: 'fermata-backup', version: 1, exportedAt: '2026-11-18T10:00:00.000Z', data: {
  'music-theory-progress': { state: { progress: { completedModules: ['imported'], moduleProgress: {} } }, version: 4 },
} });

for (const v of CASES) {
  test(`${name(v)}: Settings → Your data says which part of an export was damaged, and that an import was not saved`, async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await open(browser, v, {
      'fermata-welcome-v1': 'seen',
      'music-theory-app': settingsSave(v),
      'music-theory-progress': '{"state":{"progress":{"completedMod',
      'fermata-fingering-v1': JSON.stringify({ state: { overrides: { 'not-a-key': 3, 'major|standard|p2|0|1': 2 }, labelMode: 'degree' }, version: 1 }),
    });
    await openSettings(page, v.lang);
    await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: EXPORT[v.lang] }).click()]);
    const notes = page.getByTestId('data-note');
    await expect(notes).toHaveCount(2);
    await check(page, v, `${name(v)} export`, notes);

    page.on('dialog', (d) => void d.accept());
    await failWrites(page, 'music-theory-progress');
    await page.getByTestId('backup-file-input').setInputFiles({ name: 'fermatina-backup.json', mimeType: 'application/json', buffer: Buffer.from(FILE) });
    await expect(notes).toHaveCount(1);
    await expect(notes).toHaveAttribute('role', 'alert');
    await check(page, v, `${name(v)} import`, notes);
    await context.close();
  });

  test(`${name(v)}: the start screen's line when a progress file could not be saved`, async ({ browser }) => {
    const { context, page } = await open(browser, v, {});
    await page.goto('/');
    await expect(page.getByTestId('start-screen')).toBeVisible({ timeout: 20_000 });
    await failWrites(page, 'music-theory-progress');
    await page.getByTestId('start-import-input').setInputFiles({ name: 'fermatina-backup.json', mimeType: 'application/json', buffer: Buffer.from(FILE) });
    const line = page.getByTestId('start-import-error');
    await expect(line).toBeVisible();
    await check(page, v, `${name(v)} start screen`, line, true);
    await context.close();
  });

  test(`${name(v)}: the test sheet's empty "Send my answers" (build only)`, async ({ browser }) => {
    const { context, page } = await open(browser, v, {});
    const html = await (await page.request.get('/test/')).text();
    test.skip(!html.includes('id="sheet-data"'), 'the test sheet exists only in the build: run with playwright.preview.config.ts');
    await page.goto(`/test/?lang=${v.lang}#new`);
    await expect(page.locator('#view > *')).toBeVisible();
    await page.locator('#send-btn').click();
    const line = page.locator('#sheet-status');
    await expect(line).not.toBeEmpty();
    await check(page, v, `${name(v)} sheet`, line, true);
    await context.close();
  });
}
