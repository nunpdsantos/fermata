import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { audit, seededBrowser, type View, type Lang } from './helpers/wave1';

/**
 * The design rules (e2e/helpers/designAudit.ts: type ≥ 12 px, targets ≥ 36 /
 * 44 px, contrast, no sideways scroll, nothing cut off) on the screens the
 * 2026-11-18 audit fixes of stream C changed: Build (its readout one line of
 * facts on the workbench, the root label beside its select, the new words),
 * Build with a chord open, All Chords (the new heading, the Ninths with
 * Cm(add9)), and the circle with a hovered chord wedge ("Opens F minor").
 * Laptops 1280×800, 1366×768, 1440×900, 1536×864 (mouse), tablet 820×1180
 * and phone 390×844 (touch), day and night; PT and ES at 1440, 390 and 320.
 * EXPLORE_TOOLS_SHOTS=<dir> saves a screenshot of each screen.
 */

const LAPTOPS: View[] = [[1280, 800], [1366, 768], [1440, 900], [1536, 864]].map(([w, h]) => ({ name: `laptop-${w}`, viewport: { width: w, height: h }, touch: false }));
const TABLET: View = { name: 'tablet', viewport: { width: 820, height: 1180 }, touch: true };
const PHONE: View = { name: 'phone', viewport: { width: 390, height: 844 }, touch: true };
const PHONE_320: View = { name: 'phone-320', viewport: { width: 320, height: 568 }, touch: true };
const THEMES = [{ name: 'day', mode: 'fermata' }, { name: 'night', mode: 'fermata-night' }] as const;
const SHOTS = process.env.EXPLORE_TOOLS_SHOTS;
const WORDS = {
  en: { build: 'Build', all: 'All Chords' },
  pt: { build: 'Construir', all: 'Todos os acordes' },
  es: { build: 'Construir', all: 'Todos los acordes' },
} as const;

async function check(page: Page, v: View, where: string) {
  await audit(page, v, where);
  if (SHOTS) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: `${SHOTS}/${where}.png` });
  }
}

async function sweep(browser: Browser, v: View, theme: { name: string; mode: string }, lang: Lang, circle = true) {
  const w = WORDS[lang];
  const combo = `explore-tools-${v.name}-${theme.name}-${lang}`;
  const { context, page } = await seededBrowser(browser, v, {
    themeMode: theme.mode, language: lang, lastView: 'explore', instrument: 'piano', baseOctave: 4,
    selectedKey: { natural: 'F', accidental: '#' }, selectedScale: 'major', exploreDetail: 'full', exploreCircleOpen: true,
  }, {}, { lang });
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);

  // Build, nothing built yet; then F♯ A♯ C♯ E (F♯7, the V7 of B — outside F♯ major's E♯).
  await page.getByRole('tab', { name: w.build, exact: true }).click();
  await expect(page.getByTestId('builder-readout')).toBeVisible();
  await check(page, v, `${combo}--build`);
  const notes = page.locator('.chords-card [role="group"] button');
  for (const step of [4, 7, 10]) await notes.nth(step).click();
  await expect(page.getByTestId('chord-detail')).toBeVisible();
  await check(page, v, `${combo}--build-chord`);
  await page.getByTestId('builder-readout').scrollIntoViewIfNeeded();
  await check(page, v, `${combo}--build-readout`);

  // All Chords: its heading, and the Ninths (Cm(add9)'s family) with a card open.
  await page.locator('.explore-main').evaluate((el) => { el.scrollTop = 0; });
  await page.getByRole('tab', { name: w.all, exact: true }).click();
  // The categories in order: triads, sixths, sevenths, sus, power, ninths.
  await page.getByRole('radiogroup', { name: w.all }).getByRole('radio').nth(5).click();
  await page.locator('[data-quality="minor_add9"]').click();
  await expect(page.getByTestId('chord-detail')).toBeVisible();
  await check(page, v, `${combo}--all-ninths`);

  // The circle, a chord wedge whose key has another name, hovered.
  if (circle && !v.touch) {
    const wedge = page.locator('[data-testid="circle-card"] g[role="button"][data-key="F minor"]');
    await wedge.hover();
    await expect(page.getByTestId('cof-hover-opens')).toBeVisible();
    await check(page, v, `${combo}--circle-opens`);
  }
  await context.close();
}

for (const v of LAPTOPS) {
  for (const theme of THEMES) {
    test(`${v.name} ${theme.name} en`, async ({ browser }) => { await sweep(browser, v, theme, 'en'); });
  }
}
for (const v of [TABLET, PHONE]) {
  for (const theme of THEMES) {
    test(`${v.name} ${theme.name} en`, async ({ browser }) => { await sweep(browser, v, theme, 'en', false); });
  }
}
for (const lang of ['pt', 'es'] as const) {
  for (const v of [LAPTOPS[2], LAPTOPS[0], PHONE, PHONE_320]) {
    test(`${v.name} day ${lang}`, async ({ browser }) => { await sweep(browser, v, THEMES[0], lang, !v.touch); });
  }
}
