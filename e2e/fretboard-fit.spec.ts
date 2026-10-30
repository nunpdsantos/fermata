// Review blocker B1 (W3): in position view (V) on desktop, the 1st (high-E)
// string row must be fully visible inside the instrument dock and the
// viewport — including with the fingering editor open (its controls wrap to
// more rows). Before the fix the dock was capped at 260 px and the row sat
// below it (1280x800 EN: row bottom 833 px vs dock bottom 800 px).
// Works against the dev server (npm run test:e2e) or a `vite preview` build.
import { test, expect } from '@playwright/test';

const SCENARIOS = [
  { w: 1280, h: 800, lang: 'en', edit: false },
  { w: 1280, h: 800, lang: 'en', edit: true },
  { w: 1366, h: 768, lang: 'en', edit: false },
  { w: 1366, h: 768, lang: 'en', edit: true },
  { w: 1440, h: 900, lang: 'pt', edit: false },
  { w: 1440, h: 900, lang: 'pt', edit: true },
  { w: 1440, h: 900, lang: 'es', edit: true },
  { w: 1024, h: 768, lang: 'pt', edit: true },
];

const EDIT = /^(Edit fingering|Editar dedilhação|Editar digitación)$/;

for (const s of SCENARIOS) {
  test(`${s.w}x${s.h} ${s.lang}${s.edit ? ' edit' : ''}`, async ({ page }) => {
    await page.setViewportSize({ width: s.w, height: s.h });
    await page.addInitScript((lang) => {
      localStorage.setItem('music-theory-app', JSON.stringify({
        state: {
          selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', instrument: 'guitar',
          guitarTuningId: 'standard', guitarScalePosition: 5, language: lang, lastView: 'explore',
          themeMode: 'fermata', baseOctave: 4, scaleOctaves: 1, volume: 0.7, colorMode: 'functional',
          preferencesUpdatedAt: 1,
        },
        version: 6,
      }));
    }, s.lang);
    await page.goto('/');
    const grid = page.locator('[role="grid"]').first();
    await expect(grid).toBeVisible();
    if (s.edit) await page.getByRole('button', { name: EDIT }).click();
    await page.waitForTimeout(300);

    const region = await page.locator('[data-tour="play-note"]').boundingBox();
    const firstStringCell = await page.locator('[data-string-row="5"]').first().boundingBox();
    const sixthStringCell = await page.locator('[data-string-row="0"]').first().boundingBox();
    expect(region).not.toBeNull();
    expect(firstStringCell).not.toBeNull();
    const regionBottom = region!.y + region!.height;
    const rowBottom = firstStringCell!.y + firstStringCell!.height;
    const visibleBottom = Math.min(regionBottom, s.h);
    const main = await page.locator('#main-content').boundingBox();
    console.log(JSON.stringify({
      scenario: `${s.w}x${s.h} ${s.lang}${s.edit ? ' edit' : ''}`,
      regionTop: Math.round(region!.y), regionHeight: Math.round(region!.height), regionBottom: Math.round(regionBottom),
      string6Top: Math.round(sixthStringCell!.y), string1Bottom: Math.round(rowBottom), viewport: s.h,
      mainHeight: Math.round(main?.height ?? -1),
    }));
    expect(rowBottom).toBeLessThanOrEqual(visibleBottom + 0.5);
  });
}
