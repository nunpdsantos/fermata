import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';

/**
 * Design system v2 acceptance (W11-A, D-28 / D-26), in a real browser.
 *
 * Viewports: phone 390×844 and phone landscape 844×390 and tablet 768×1024
 * (touch), laptop 1440×900 (mouse); day and night. Screens: Explore (piano,
 * guitar; a chord selected in each of Diatonic / All / Build), the "⋯" menu
 * and the Settings sheet open, the instrument dock (phone: Peek / Half /
 * Full), Learn (level list, a returning learner's review queue, a lesson, an
 * exercise in its wrong-answer and right-answer states), Drill (a question,
 * a wrong answer's feedback, settings, the mastery map, the session summary).
 * Portuguese and Spanish at 390 px for the main screens. On every screen:
 *  - no text renders below 12 px (SVG text measured at its on-screen size);
 *  - every enabled control is ≥ 44 px on touch / ≥ 36 px with a mouse;
 *  - every text colour is ≥ 4.5:1 on what is painted under it (3:1 large);
 *  - no horizontal page scroll;
 * and a toast never covers the instrument dock or Drill's answers.
 * Exemptions (instrument keys/frets, inline links, disabled controls) are in
 * e2e/helpers/designAudit.ts and are COUNTED per screen.
 *
 * DESIGN_AUDIT_OUT=<dir> also writes each screen's audit (results.jsonl) and
 * a screenshot there — the reviewer's before/after material.
 */

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'phone-landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
const THEMES = [
  { name: 'day', mode: 'fermata' },
  { name: 'night', mode: 'fermata-night' },
] as const;
type Viewport = (typeof VIEWPORTS)[number];

const OUT = process.env.DESIGN_AUDIT_OUT;

// A returning learner with reviews due (Learn's review queue shows).
const DAY = 86_400_000;
const seededProgress = (now: number) => ({
  state: {
    progress: {
      completedModules: ['l1u1m1', 'l1u1m2', 'l1u1m3'],
      moduleProgress: {},
      exerciseResults: {},
      reviewSchedules: {
        l1u1m1: { completedAt: now - 9 * DAY, nextReviewAt: now - 2 * DAY, intervalLevel: 1, reviewCount: 1, lastReviewedAt: now - 3 * DAY },
        l1u1m2: { completedAt: now - 8 * DAY, nextReviewAt: now - 1 * DAY, intervalLevel: 0, reviewCount: 0, lastReviewedAt: now - 8 * DAY },
        l1u1m3: { completedAt: now - 2 * DAY, nextReviewAt: now + 3 * DAY, intervalLevel: 1, reviewCount: 1, lastReviewedAt: now - 2 * DAY },
      },
    },
  },
  version: 1,
});

type Box = { top: number; bottom: number; left: number; right: number };
const overlaps = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

async function open(browser: Browser, v: Viewport, theme: string, state: Record<string, unknown>, extra: { lang?: string; progress?: boolean } = {}) {
  const context = await browser.newContext({
    viewport: v.viewport,
    isMobile: v.touch,
    hasTouch: v.touch,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    acceptDownloads: true,
  });
  await context.addInitScript(
    ([blob, progress]) => {
      if (sessionStorage.getItem('__seeded')) return;
      localStorage.clear();
      localStorage.setItem('music-theory-app', blob);
      if (progress) localStorage.setItem('music-theory-progress', progress);
      sessionStorage.setItem('__seeded', '1');
    },
    [
      JSON.stringify({ state: { themeMode: theme, language: extra.lang ?? 'en', ...state }, version: 6 }),
      extra.progress ? JSON.stringify(seededProgress(Date.now())) : '',
    ] as const,
  );
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(1200); // fonts, lazy views, entrance animations
  return { context, page };
}

// Soft: one run reports every screen that fails, not just the first.
function expectClean(r: AuditResult, where: string) {
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the sweep did not run`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
}

/** Audit the page as it is now; record it (and a screenshot) when asked to. */
async function check(page: Page, v: Viewport, combo: string, screen: string) {
  const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  if (OUT) {
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: `${OUT}/${combo}--${screen}.png` });
    fs.appendFileSync(
      `${OUT}/results.jsonl`,
      JSON.stringify({
        combo,
        screen,
        minFont: r.minFont,
        fontViolations: r.fontViolations.length,
        minTap: r.minTap,
        tapViolations: r.tapViolations.length,
        minContrast: r.minContrast,
        contrastViolations: r.contrastViolations.length,
        hScroll: r.hScroll.scrollWidth > r.hScroll.clientWidth + 1,
        exempt: r.exempt,
        targets: r.targets,
        textNodes: r.textNodes,
      }) + '\n',
    );
  }
  expectClean(r, `${combo} ${screen}`);
}

const boxOf = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
  });

async function openSettings(page: Page) {
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  await page.waitForTimeout(300); // the sheet slides in
}

async function exportToast(page: Page): Promise<Box> {
  const download = page.waitForEvent('download');
  await openSettings(page);
  await page.getByRole('button', { name: 'Export backup' }).click();
  await download;
  await page.keyboard.press('Escape');
  const toast = page.getByRole('status').filter({ hasText: 'Backup downloaded' });
  await expect(toast).toBeVisible();
  const box = await toast.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
  });
  // Dismiss it, so a later screen is not audited mid fade-out.
  await toast.getByRole('button', { name: 'Dismiss' }).click();
  await expect(toast).toHaveCount(0);
  return box;
}

/** The current (not animating-out) Learn screen. */
const learnScreen = (page: Page) => page.locator('#learn-panel [data-learn-screen]:not([inert])');

async function openFirstLesson(page: Page, heading = 'The Staff and Clefs') {
  await page.getByRole('button', { name: new RegExp(heading) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
}

/** Answer choice exercises until we have seen a wrong answer and a right one. */
async function exerciseStates(page: Page, onState: (state: 'wrong' | 'right') => Promise<void>) {
  const screen = learnScreen(page);
  await screen.getByText('Exercises', { exact: true }).first().scrollIntoViewIfNeeded();
  const seen = new Set<string>();
  for (let i = 0; i < 12 && seen.size < 2; i++) {
    const grid = screen.locator('.grid.grid-cols-2').first();
    if (!(await grid.count())) break;
    const options = grid.locator('button:not([disabled])');
    if (!(await options.count())) break;
    await options.last().click();
    await screen.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(400);
    const tryAgain = screen.getByRole('button', { name: 'Try Again' });
    if (await tryAgain.count()) {
      if (!seen.has('wrong')) {
        seen.add('wrong');
        await onState('wrong');
      }
      const revealed = (await screen.locator('button.text-success').first().textContent())?.trim();
      await tryAgain.click();
      if (revealed) {
        const exact = new RegExp(`^${revealed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
        await grid.locator('button').filter({ hasText: exact }).first().click();
        await screen.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(400);
      }
    }
    const cont = screen.getByRole('button', { name: /^(Continue|Next)$/ });
    if ((await cont.count()) && !seen.has('right') && (await screen.getByText(/Correct/).count())) {
      seen.add('right');
      await onState('right');
    }
    if (await cont.count()) await cont.first().click();
    await page.waitForTimeout(300);
  }
  expect([...seen].sort(), 'reached both exercise states').toEqual(['right', 'wrong']);
}

/** Answer Drill questions until a wrong answer's feedback shows. */
async function drillWrong(page: Page, notQuite: RegExp, continueName: string) {
  const panel = page.locator('#drill-panel');
  for (let i = 0; i < 14; i++) {
    const choices = panel.getByTestId('drill-answers').locator('button:not([disabled])');
    const n = await choices.count();
    if (!n) break;
    await choices.nth(Math.min(1, n - 1)).click();
    const done = panel.locator('button:not([disabled])').filter({ hasText: /^(Done|Concluído|Listo|Hecho)$/ });
    if (await done.count()) await done.first().click();
    await page.waitForTimeout(500);
    if (await panel.getByText(notQuite).count()) return;
    const cont = panel.getByRole('button', { name: continueName, exact: true });
    if (await cont.count()) await cont.click();
    else await page.waitForTimeout(1500); // a right answer moves on by itself
  }
  throw new Error('never reached a wrong-answer feedback');
}

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo}: type ≥ 12 px, targets ≥ ${v.touch ? 44 : 36} px, contrast, no sideways scroll, toasts clear`, async ({ browser }) => {
      test.setTimeout(300_000);
      const where = (s: string) => `${combo} ${s}`;

      // Explore; the chord panel in Diatonic / All / Build; the toast over Explore.
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'piano', lastView: 'explore' });
        expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(v.touch);
        await check(page, v, combo, 'explore');
        await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
        await expect(page.getByRole('radiogroup', { name: 'Chord inversion' })).toBeVisible();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-diatonic');
        await page.getByRole('tab', { name: 'All Chords' }).click();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-all');
        await page.getByRole('tab', { name: 'Build' }).click();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-build');
        await page.getByRole('tab', { name: 'Diatonic' }).click();
        const toast = await exportToast(page);
        const dock = await boxOf(page, '[data-testid="instrument-dock"]');
        expect(overlaps(toast, dock), where('toast vs dock')).toBe(false);
        // The "⋯" menu, then the Settings sheet.
        await page.getByRole('button', { name: 'More', exact: true }).click();
        await expect(page.getByRole('menu', { name: 'More' })).toBeVisible();
        await check(page, v, combo, 'menu');
        await page.keyboard.press('Escape');
        await openSettings(page);
        await check(page, v, combo, 'settings');
        await context.close();
      }

      // Guitar + the dock's detents (a sheet on phones only).
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'guitar', lastView: 'explore' });
        await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'explore-guitar');
        const handle = page.getByRole('separator', { name: 'Instrument panel' });
        if (v.viewport.width < 640) {
          for (const [key, detent] of [['Home', 'peek'], ['ArrowUp', 'half'], ['End', 'full']] as const) {
            await handle.focus();
            await page.keyboard.press(key);
            await expect(page.locator('[data-testid="instrument-dock"]')).toHaveAttribute('data-detent', detent);
            await page.waitForTimeout(300);
            await check(page, v, combo, `dock-${detent}`);
          }
        } else {
          await expect(handle).toHaveCount(0); // a docked panel, not a sheet
          await check(page, v, combo, 'dock-docked');
        }
        await context.close();
      }

      // Learn: level list, a lesson, an exercise wrong and right.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' });
        await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'learn-levels');
        await openFirstLesson(page);
        await check(page, v, combo, 'learn-lesson');
        await exerciseStates(page, (state) => check(page, v, combo, `learn-exercise-${state}`));
        await context.close();
      }

      // Learn: a returning learner with reviews due.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' }, { progress: true });
        await expect(page.getByText('Review Queue').first()).toBeVisible({ timeout: 15_000 });
        await page.getByText('Review Queue').first().scrollIntoViewIfNeeded();
        await check(page, v, combo, 'learn-review-queue');
        await context.close();
      }

      // Drill: question, wrong-answer feedback (+ a toast over it), settings,
      // mastery map, the session summary.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'drill' });
        const panel = page.locator('#drill-panel');
        await expect(panel.getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'drill-question');
        await drillWrong(page, /Not quite|Same sound/, 'Continue');
        await check(page, v, combo, 'drill-feedback');
        const answers = await boxOf(page, '[data-testid="drill-answers"]');
        const toast = await exportToast(page);
        expect(overlaps(toast, answers), where('toast vs drill answers')).toBe(false);
        await panel.getByRole('button', { name: 'Drill settings' }).click();
        await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
        await check(page, v, combo, 'drill-settings');
        await panel.getByRole('button', { name: /Mastery map/ }).click();
        await expect(panel.getByRole('heading', { name: 'Mastery' })).toBeVisible();
        await check(page, v, combo, 'drill-mastery');
        await panel.getByRole('button', { name: 'Back' }).click();
        await panel.getByRole('button', { name: 'End session' }).click();
        await expect(panel.getByRole('button', { name: 'New session' })).toBeVisible();
        await check(page, v, combo, 'drill-summary');
        await context.close();
      }
    });
  }
}

// Portuguese and Spanish at 390 px: longer words, same rules.
const LANGS = [
  { lang: 'pt', notQuite: /Não é bem isso|Mesmo som/, cont: 'Continuar', more: 'Mais', settings: 'Definições' },
  { lang: 'es', notQuite: /Incorrecto|Mismo sonido/, cont: 'Continuar', more: 'Más', settings: 'Ajustes' },
] as const;

for (const L of LANGS) {
  for (const th of THEMES) {
    const v = VIEWPORTS[0];
    const combo = `phone-${L.lang}-${th.name}`;
    test(`${combo}: the main screens in ${L.lang.toUpperCase()} pass the same rules`, async ({ browser }) => {
      test.setTimeout(240_000);
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'piano', lastView: 'explore' }, { lang: L.lang });
        await check(page, v, combo, 'explore');
        await page.getByRole('button', { name: L.more, exact: true }).click();
        await page.getByRole('menuitem', { name: L.settings }).click();
        await expect(page.getByRole('dialog', { name: L.settings })).toBeVisible();
        await page.waitForTimeout(300);
        await check(page, v, combo, 'settings');
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'guitar', lastView: 'explore' }, { lang: L.lang });
        await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'explore-guitar');
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' }, { lang: L.lang });
        await expect(learnScreen(page).getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'learn-levels');
        // The Continue card opens the first lesson.
        await learnScreen(page).getByRole('button').filter({ has: page.locator('h3') }).first().click();
        await expect(learnScreen(page).getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(800);
        await check(page, v, combo, 'learn-lesson');
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'drill' }, { lang: L.lang });
        await expect(page.locator('#drill-panel').getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'drill-question');
        await drillWrong(page, L.notQuite, L.cont);
        await check(page, v, combo, 'drill-feedback');
        await context.close();
      }
    });
  }
}
