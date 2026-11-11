import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';
import { smallScreenAssertions } from './helpers/smallScreenAssertions';
import { WELCOME_KEY, WELCOME_SEEN } from './helpers/welcome';

/**
 * The design rules (e2e/helpers/designAudit.ts, as design-system.spec.ts
 * applies them) on "Drill follows the lessons" (wave 2): the intro with
 * nothing unlocked, Drill settings with the switch on (what is unlocked, what
 * comes next) and off (the topic chips), and the mastery map with locked
 * topics. Phone 390×844, landscape 844×390, tablet 820×1180 (touch) and
 * laptop 1440×900 (mouse), day and night; PT and ES at 320 and 360 px.
 * Type ≥ 12 px, targets ≥ 44 / 36 px, contrast, no sideways scroll, nothing
 * cut off.
 *
 * FOLLOW_SHOTS=<dir> also saves a screenshot of each screen.
 */

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
const NARROW = [
  { name: 'phone-320', viewport: { width: 320, height: 568 }, touch: true },
  { name: 'phone-360', viewport: { width: 360, height: 740 }, touch: true },
] as const;
const THEMES = [
  { name: 'day', mode: 'fermata' },
  { name: 'night', mode: 'fermata-night' },
] as const;
type View = (typeof VIEWPORTS)[number] | (typeof NARROW)[number];
type Lang = 'en' | 'pt' | 'es';

const WORDS = {
  en: { start: 'Start', settings: 'Drill settings', myself: 'Choose topics myself', mastery: /Mastery map/ },
  pt: { start: 'Iniciar', settings: 'Definições de treino', myself: 'Escolher eu os tópicos', mastery: /Mapa de domínio/ },
  es: { start: 'Empezar', settings: 'Ajustes de práctica', myself: 'Elegir yo los temas', mastery: /Mapa de dominio/ },
} as const;

const SHOTS = process.env.FOLLOW_SHOTS;

async function open(browser: Browser, v: View, theme: string, lang: Lang, completed: string[]) {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(([settings, progress, welcomeKey, welcomeSeen]) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem(welcomeKey, welcomeSeen);
    localStorage.setItem('music-theory-app', settings);
    if (progress) localStorage.setItem('music-theory-progress', progress);
    sessionStorage.setItem('__seeded', '1');
  }, [
    JSON.stringify({ state: { lastView: 'drill', language: lang, themeMode: theme, learnerProfile: 'new', instrument: 'piano' }, version: 6 }),
    completed.length
      ? JSON.stringify({ state: { progress: { completedModules: completed, moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} } }, version: 4 })
      : '',
    WELCOME_KEY,
    WELCOME_SEEN,
  ] as const);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#drill-panel').getByTestId('drill-intro')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);
  return { context, page };
}

async function check(page: Page, v: View, combo: string, screen: string) {
  await page.waitForTimeout(300);
  await smallScreenAssertions(page, screen);
  const r: AuditResult = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  if (SHOTS) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: `${SHOTS}/drill-follow--${combo}--${screen}.png` });
  }
  const where = `${combo} ${screen}`;
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
}

async function sweep(browser: Browser, v: View, theme: string, combo: string, lang: Lang) {
  const w = WORDS[lang];
  {
    const { context, page } = await open(browser, v, theme, lang, []);
    await expect(page.getByTestId('drill-follow-empty')).toBeVisible();
    await check(page, v, combo, 'intro-nothing-unlocked');
    await context.close();
  }
  {
    // Two lessons of the sound track done: scales and triads part-open.
    const { context, page } = await open(browser, v, theme, lang, ['l1u34m4', 'l1u34m5']);
    const panel = page.locator('#drill-panel');
    await expect(panel.getByTestId('drill-follow-summary')).toBeVisible();
    await check(page, v, combo, 'intro-unlocked');
    await panel.getByRole('button', { name: w.start, exact: true }).click();
    await expect(panel.getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
    await panel.getByRole('button', { name: w.settings }).click();
    await expect(panel.getByTestId('drill-follow-switch')).toHaveAttribute('aria-pressed', 'true');
    await check(page, v, combo, 'settings-switch-on');
    await panel.getByRole('button', { name: w.myself }).click();
    await expect(panel.getByTestId('drill-follow-switch')).toHaveAttribute('aria-pressed', 'false');
    await check(page, v, combo, 'settings-switch-off');
    await panel.getByTestId('drill-follow-switch').click();
    await panel.getByRole('button', { name: w.mastery }).click();
    await expect(panel.locator('[data-follow-caption="locked"]').first()).toBeVisible();
    await check(page, v, combo, 'mastery-locked');
    await context.close();
  }
}

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo}: Drill follows the lessons — intro, settings on / off, mastery map pass the design rules`, async ({ browser }) => {
      test.setTimeout(180_000);
      await sweep(browser, v, th.mode, combo, 'en');
    });
  }
}

for (const lang of ['pt', 'es'] as const) {
  for (const v of NARROW) {
    const combo = `${v.name}-${lang}-day`;
    test(`${combo}: Drill follows the lessons in ${lang.toUpperCase()} at ${v.viewport.width} px`, async ({ browser }) => {
      test.setTimeout(180_000);
      await sweep(browser, v, 'fermata', combo, lang);
    });
  }
}

// Portuguese at the phone size, day and night (the screenshots of the new text).
for (const th of THEMES) {
  const combo = `phone-pt-${th.name}`;
  test(`${combo}: Drill follows the lessons in PT at 390 px`, async ({ browser }) => {
    test.setTimeout(180_000);
    await sweep(browser, VIEWPORTS[0], th.mode, combo, 'pt');
  });
}
