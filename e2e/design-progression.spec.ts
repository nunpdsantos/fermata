import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { audit, seededBrowser, type View } from './helpers/wave1';

/**
 * The design rules (e2e/helpers/designAudit.ts: type ≥ 12 px, targets ≥
 * 36 / 44 px, contrast, no sideways scroll, nothing cut off) on the
 * Progression panel (wave 2, stream S): empty, filled, playing, the
 * "Another chord" sheet, the common progressions sheet, and the capo lines
 * on the guitar — phone 390×844, landscape 844×390, tablet 820×1180 (touch),
 * laptop 1440×900 (mouse), day and night; PT and ES at 320 and 360 px. And:
 * the "Progression" button does not grow the card's heading row.
 * PROGRESSION_SHOTS=<dir> saves a screenshot of each screen.
 */

const VIEWS: View[] = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
];
const THEMES = [{ name: 'day', mode: 'fermata' }, { name: 'night', mode: 'fermata-night' }] as const;
const SHOTS = process.env.PROGRESSION_SHOTS;
const WORDS = {
  en: { open: 'Progression', another: 'Another chord', common: 'Common progressions', add: 'Add', loop: 'Loop', close: 'Close' },
  pt: { open: 'Progressão', another: 'Outro acorde', common: 'Progressões comuns', add: 'Adicionar', loop: 'Repetir', close: 'Fechar' },
  es: { open: 'Progresión', another: 'Otro acorde', common: 'Progresiones comunes', add: 'Añadir', loop: 'Repetir', close: 'Cerrar' },
} as const;
type Lang = keyof typeof WORDS;

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
}

async function check(page: Page, v: View, where: string) {
  await audit(page, v, where);
  await shot(page, where);
}

async function sweep(browser: Browser, v: View, theme: string, themeName: string, lang: Lang, full = true) {
  const w = WORDS[lang];
  const combo = `progression-${v.name}-${themeName}-${lang}`;
  const { context, page } = await seededBrowser(browser, v, {
    themeMode: theme, language: lang, instrument: 'guitar', lastView: 'explore',
    selectedKey: { natural: 'E', accidental: 'b' }, selectedScale: 'major',
  }, {}, { lang });
  await page.goto('/');
  await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });

  // Closed: the button adds nothing to the heading row's height (it takes one line).
  const head = page.locator('.chords-card .explore-card-head');
  const toggle = page.getByTestId('progression-toggle');
  expect((await toggle.boundingBox())!.height, 'a full tap target').toBeGreaterThanOrEqual(v.touch ? 44 : 36);
  const withButton = (await head.boundingBox())!.height;
  await toggle.evaluate((el) => { el.style.display = 'none'; });
  const without = (await head.boundingBox())!.height;
  await toggle.evaluate((el) => { el.style.display = ''; });
  expect(Math.abs(withButton - without), 'the heading row does not grow').toBeLessThanOrEqual(0.5);
  await page.getByRole('button', { name: w.open, exact: true }).click();
  await expect(page.getByTestId('progression-panel')).toBeVisible();
  await check(page, v, `${combo}--empty`);

  // Filled: E♭ A♭ B♭ C m (the capo has ideas in E♭).
  for (const c of ['E♭', 'A♭', 'B♭', 'Cm']) await page.getByRole('button', { name: `${w.add} ${c}`, exact: true }).click();
  await page.getByTestId('chords-card').scrollIntoViewIfNeeded();
  await check(page, v, `${combo}--filled`);
  if (!full) { await context.close(); return; }

  // The capo lines: an idea taken.
  await page.getByTestId('progression-capo').getByRole('radio').nth(1).click();
  await expect(page.getByTestId('progression-capo-now')).toBeVisible();
  await page.getByTestId('progression-capo').scrollIntoViewIfNeeded();
  await check(page, v, `${combo}--capo`);

  // Playing (slowly, so the marked chip holds still for the audit).
  for (let i = 0; i < 8; i++) await page.getByRole('button', { name: /^(Slower|Mais lento|Más lento)$/ }).click();
  await page.getByTestId('progression-play').click();
  await expect(page.locator('.prog-chip[data-playing]')).toHaveCount(1, { timeout: 10_000 });
  await check(page, v, `${combo}--playing`);
  await page.getByTestId('progression-play').click();

  // A chord from outside the key (dashed), then the sheets.
  await page.getByTestId('progression-another').click();
  const sheet = page.getByTestId('progression-another-sheet');
  await expect(sheet).toBeVisible();
  await check(page, v, `${combo}--another`);
  await sheet.getByRole('radio', { name: 'D♭' }).click();
  await sheet.getByTestId('progression-another-add').click();
  await expect(page.locator('.prog-chip[data-outside]')).toHaveCount(1);
  await page.getByTestId('progression-presets').click();
  await expect(page.getByTestId('progression-presets-sheet')).toBeVisible();
  await check(page, v, `${combo}--presets`);
  await page.getByTestId('progression-presets-sheet').getByRole('button', { name: w.close }).click();
  await page.getByTestId('progression-chips').scrollIntoViewIfNeeded();
  await check(page, v, `${combo}--outside`);
  // A chip's menu.
  await page.getByTestId('progression-chips').getByRole('button').first().click();
  await expect(page.getByRole('menu')).toBeVisible();
  await check(page, v, `${combo}--chip-menu`);
  await context.close();
}

for (const v of VIEWS) {
  for (const th of THEMES) {
    test(`${v.name}-${th.name}: the Progression panel passes the design rules`, async ({ browser }) => {
      test.setTimeout(180_000);
      await sweep(browser, v, th.mode, th.name, 'en');
    });
  }
}

for (const lang of ['pt', 'es'] as const) {
  for (const width of [320, 360] as const) {
    test(`${lang} at ${width} px: the Progression panel passes the design rules`, async ({ browser }) => {
      test.setTimeout(180_000);
      await sweep(browser, { name: `phone-${width}`, viewport: { width, height: width === 320 ? 568 : 740 }, touch: true }, 'fermata', 'day', lang);
    });
  }
}

for (const v of [VIEWS[0], VIEWS[1], VIEWS[3]]) {
  for (const th of THEMES) {
    test(`${v.name}-${th.name} PT: the panel's Portuguese words pass too`, async ({ browser }) => {
      test.setTimeout(120_000);
      await sweep(browser, v, th.mode, th.name, 'pt', false);
    });
  }
}

// Another tuning: the capo row says the ideas need standard tuning (no ideas, no shapes to play).
for (const v of [VIEWS[0], VIEWS[1], VIEWS[3]]) {
  for (const th of THEMES) {
    for (const lang of ['en', 'pt'] as const) {
      test(`${v.name}-${th.name} ${lang}: another tuning, the capo line passes the design rules`, async ({ browser }) => {
        test.setTimeout(120_000);
        const w = WORDS[lang];
        const { context, page } = await seededBrowser(browser, v, {
          themeMode: th.mode, language: lang, instrument: 'guitar', lastView: 'explore', guitarTuningId: 'half-step-down',
          selectedKey: { natural: 'E', accidental: 'b' }, selectedScale: 'major',
        }, {}, { lang });
        await page.goto('/');
        await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        await page.getByRole('button', { name: w.open, exact: true }).click();
        for (const c of ['E♭', 'A♭', 'B♭']) await page.getByRole('button', { name: `${w.add} ${c}`, exact: true }).click();
        const line = page.getByTestId('progression-capo-standard');
        await expect(line).toBeVisible();
        await expect(page.getByTestId('progression-capo').getByRole('radio')).toHaveCount(0);
        await line.scrollIntoViewIfNeeded();
        await check(page, v, `progression-${v.name}-${th.name}-${lang}--capo-standard-only`);
        await context.close();
      });
    }
  }
}
