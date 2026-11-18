import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { seededBrowser, audit, PHONE, PHONE_320, LANDSCAPE, LAPTOP, type Lang, type View } from './helpers/wave1';

/**
 * Quick Search under the design system's rules (audit 2026-11-18, stream B):
 * the open list with every category label shown (Chord, Scale, Key, Lesson),
 * at rest and with a lower row selected by the arrows — type ≥ 12 px, targets
 * ≥ 44 px on touch / 36 px with a mouse, every text against what is painted
 * under it ≥ 4.5:1 (A11: the labels were 1.17–3.69:1 by day), nothing cut
 * off, no sideways scroll. Phone 390×844, phone sideways 844×390 and laptop
 * 1440×900, day and night, EN / PT / ES; PT and ES at 320 px too.
 * DESIGN_AUDIT_OUT=<dir> writes a screenshot of each screen.
 */

const OUT = process.env.DESIGN_AUDIT_OUT;
const THEMES = [
  { name: 'day', mode: 'fermata' },
  { name: 'night', mode: 'fermata-night' },
] as const;
/** Together they bring all four categories (and enough rows to scroll on a phone). */
const QUERIES: Record<Lang, readonly string[]> = {
  en: ['key of G', 'D dorian', 'C', 'tritone'],
  pt: ['tonalidade de Sol', 'D dórico', 'C', 'trítono'],
  es: ['tonalidad de Sol', 'D dórico', 'C', 'tritono'],
};

async function openSearch(browser: Browser, v: View, lang: Lang, theme: string): Promise<{ page: Page; close: () => Promise<void> }> {
  const { context, page } = await seededBrowser(browser, v, { language: lang, lastView: 'explore', themeMode: theme }, {}, { lang });
  await page.goto('/');
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);
  return { page, close: () => context.close() };
}

async function show(page: Page, q: string) {
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog').filter({ has: page.locator('input') });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill(q);
  await expect(dialog.getByRole('option').first()).toBeVisible();
  return dialog;
}

async function shot(page: Page, name: string) {
  if (!OUT) return;
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

const cases: { v: View; langs: readonly Lang[] }[] = [
  { v: PHONE, langs: ['en', 'pt', 'es'] },
  { v: LANDSCAPE, langs: ['en'] },
  { v: LAPTOP, langs: ['en', 'pt', 'es'] },
  { v: PHONE_320, langs: ['pt', 'es'] },
];

for (const { v, langs } of cases) {
  for (const th of THEMES) {
    for (const lang of langs) {
      const combo = `${v.name} ${th.name} ${lang}`;
      test(`${combo}: the open list, at rest and with a lower row selected — every rule of the design system`, async ({ browser }) => {
        test.setTimeout(90_000);
        const { page, close } = await openSearch(browser, v, lang, th.mode);
        for (const [n, q] of QUERIES[lang].entries()) {
          const dialog = await show(page, q);
          const types = await dialog.locator('[data-search-type]').evaluateAll((els) => els.map((e) => e.getAttribute('data-search-type')));
          await audit(page, v, `${combo} "${q}" at rest`);
          await shot(page, `design-search-${v.name}-${th.name}-${lang}-q${n + 1}-rest`);
          const count = await dialog.getByRole('option').count();
          for (let i = 1; i < count; i++) await page.keyboard.press('ArrowDown');
          await expect(dialog.getByRole('option').last()).toHaveAttribute('aria-selected', 'true');
          await audit(page, v, `${combo} "${q}" last row selected`);
          await shot(page, `design-search-${v.name}-${th.name}-${lang}-q${n + 1}-selected`);
          await page.keyboard.press('Escape');
          await expect(dialog).toHaveCount(0);
          expect(types.length, `${combo} "${q}": results shown`).toBeGreaterThan(0);
        }
        await close();
      });
    }
  }
}

for (const lang of ['en', 'pt', 'es'] as const) {
  test(`${lang}: every category label is audited (the sweep is not vacuous)`, async ({ browser }) => {
    const { page, close } = await openSearch(browser, LAPTOP, lang, 'fermata');
    const seen = new Set<string>();
    for (const q of QUERIES[lang]) {
      const dialog = await show(page, q);
      for (const t of await dialog.locator('[data-search-type]').evaluateAll((els) => els.map((e) => e.getAttribute('data-search-type')))) seen.add(t!);
      await page.keyboard.press('Escape');
    }
    expect([...seen].sort()).toEqual(['Chord', 'Key', 'Lesson', 'Scale']);
    await close();
  });
}
