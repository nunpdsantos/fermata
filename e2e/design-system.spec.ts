import { test, expect, type Browser, type Page } from '@playwright/test';
import { auditPage, type AuditResult } from './helpers/designAudit';

/**
 * Design system v2 acceptance (W11-A, D-28 / D-26), in a real browser, at
 * phone 390×844 and tablet 768×1024 (touch) and laptop 1440×900 (mouse), day
 * and night, on the main screens: Explore (piano and guitar), the instrument
 * dock (phone: Peek / Half / Full), Learn's level list and a lesson, a Drill
 * question and its feedback, and the Settings sheet. Every screen:
 *  - no text renders below 12 px (SVG text measured at its on-screen size);
 *  - every enabled control is ≥ 44 px on touch / ≥ 36 px with a mouse (the
 *    instrument's keys and frets, and links inside sentences, are exempt —
 *    see e2e/helpers/designAudit.ts);
 *  - every text colour is ≥ 4.5:1 on what is painted under it (3:1 large);
 *  - no horizontal page scroll;
 * and a toast never covers the instrument dock or Drill's answers.
 */

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
const THEMES = [
  { name: 'day', mode: 'fermata' },
  { name: 'night', mode: 'fermata-night' },
] as const;

type Box = { top: number; bottom: number; left: number; right: number };
const overlaps = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

async function open(browser: Browser, v: (typeof VIEWPORTS)[number], theme: string, state: Record<string, unknown>) {
  const context = await browser.newContext({
    viewport: v.viewport,
    isMobile: v.touch,
    hasTouch: v.touch,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    acceptDownloads: true,
  });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { themeMode: theme, language: 'en', ...state }, version: 6 }));
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(1200); // fonts, lazy views, entrance animations
  return { context, page };
}

function expectClean(r: AuditResult, where: string) {
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect(r.textNodes, `${where}: audited no text — the sweep did not run`).toBeGreaterThan(5);
  expect(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
}

async function exportToast(page: Page): Promise<Box> {
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Export backup' }).click();
  await download;
  await page.keyboard.press('Escape');
  const toast = page.getByRole('status').filter({ hasText: 'Backup downloaded' });
  await expect(toast).toBeVisible();
  return toast.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
  });
}

const boxOf = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
  });

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    test(`${v.name} ${th.name}: type ≥ 12 px, targets ≥ ${v.touch ? 44 : 36} px, contrast, no sideways scroll, toasts clear`, async ({ browser }) => {
      test.setTimeout(150_000);
      const opts = { minFontPx: 12, minTapPx: v.touch ? 44 : 36 };
      const where = (s: string) => `${v.name} ${th.name} ${s}`;

      // Explore + dock + toast over Explore.
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'piano', lastView: 'explore' });
        expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(v.touch);
        expectClean(await auditPage(page, opts), where('explore'));
        // A chord selected: the chord panel (voicing chips, formula, scales).
        await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
        await expect(page.getByRole('radiogroup', { name: 'Chord inversion' })).toBeVisible();
        await page.waitForTimeout(500);
        expectClean(await auditPage(page, opts), where('explore chord'));
        await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
        const toast = await exportToast(page);
        const dock = await boxOf(page, '[data-testid="instrument-dock"]');
        expect(overlaps(toast, dock), where('toast vs dock')).toBe(false);
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'guitar', lastView: 'explore' });
        await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        expectClean(await auditPage(page, opts), where('explore guitar'));
        const handle = page.getByRole('separator', { name: 'Instrument panel' });
        if (v.name === 'phone') {
          for (const [key, detent] of [['Home', 'peek'], ['ArrowUp', 'half'], ['End', 'full']] as const) {
            await handle.focus();
            await page.keyboard.press(key);
            await expect(page.locator('[data-testid="instrument-dock"]')).toHaveAttribute('data-detent', detent);
            await page.waitForTimeout(300);
            expectClean(await auditPage(page, opts), where(`dock ${detent}`));
          }
        } else {
          await expect(handle).toHaveCount(0); // docked panel, not a sheet
        }
        await context.close();
      }

      // Learn: level list, then a lesson.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' });
        await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
        expectClean(await auditPage(page, opts), where('learn levels'));
        await page.getByRole('button', { name: /The Staff and Clefs/ }).first().click();
        await expect(page.getByRole('heading', { level: 1, name: 'The Staff and Clefs' })).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(800);
        expectClean(await auditPage(page, opts), where('learn lesson'));
        await context.close();
      }

      // Drill: a question, then a wrong answer's feedback; a toast over it.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'drill' });
        const panel = page.locator('#drill-panel');
        await expect(panel.getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
        expectClean(await auditPage(page, opts), where('drill question'));
        let wrong = false;
        for (let i = 0; i < 12 && !wrong; i++) {
          const choices = panel.getByTestId('drill-answers').locator('button:not([disabled])').filter({ hasNotText: /Continue|Done|Clear|Learn about/ });
          const n = await choices.count();
          if (!n) break;
          await choices.nth(Math.min(1, n - 1)).click();
          const done = panel.getByRole('button', { name: /^Done$/ });
          if ((await done.count()) && (await done.isEnabled())) await done.click();
          await page.waitForTimeout(500);
          if (await panel.getByText(/Not quite|Same sound/).count()) wrong = true;
          else if (await panel.getByRole('button', { name: 'Continue' }).count()) await panel.getByRole('button', { name: 'Continue' }).click();
          else await page.waitForTimeout(1500); // a right answer moves on by itself
        }
        expect(wrong, where('reached a wrong-answer feedback')).toBe(true);
        expectClean(await auditPage(page, opts), where('drill feedback'));
        const answers = await boxOf(page, '[data-testid="drill-answers"]');
        const toast = await exportToast(page);
        expect(overlaps(toast, answers), where('toast vs drill answers')).toBe(false);
        await context.close();
      }

      // Settings sheet.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'explore' });
        await page.getByRole('button', { name: 'More', exact: true }).click();
        await page.getByRole('menuitem', { name: 'Settings' }).click();
        await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
        await page.waitForTimeout(300); // the sheet slides in
        expectClean(await auditPage(page, opts), where('settings'));
        await context.close();
      }
    });
  }
}
