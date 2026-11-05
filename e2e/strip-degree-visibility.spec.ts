import { test, expect } from '@playwright/test';
import { stripDegreesFitAtRest } from './helpers/smallScreenAssertions';

for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
  for (const language of ['en', 'pt', 'es'] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      test(`${viewport.width} ${language} ${instrument}: every resting scale degree is whole`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport, isMobile: viewport.width < 640, hasTouch: viewport.width < 640,
          reducedMotion: 'reduce', serviceWorkers: 'block',
        });
        try {
          await context.addInitScript(({ language, instrument }) => {
            localStorage.clear();
            localStorage.setItem('music-theory-app', JSON.stringify({
              state: {
                themeMode: 'fermata', language, instrument, lastView: 'explore',
                selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
                dockDetents: { explore: 'peek', learn: 'peek' }, dockChosen: { explore: true, learn: false },
              },
              version: 6,
            }));
          }, { language, instrument });
          const page = await context.newPage();
          await page.goto('/');
          const columns = page.locator('.strip-col');
          await expect(page.locator('.strip-staff .vf-notehead')).toHaveCount(8);
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(300);
          // This MUST precede focus or scrolling: the planted opaque clef
          // covers the first numeral even though its DOM box is intact.
          const seen = new Set(await stripDegreesFitAtRest(page, 0));
          // A phone intentionally scrolls. Reach every later column using
          // the actual keyboard control, then test its settled resting view.
          await columns.first().focus();
          for (let index = 1; index < 8; index++) {
            await page.keyboard.press('ArrowRight');
            await expect(columns.nth(index)).toBeFocused();
            await page.waitForTimeout(300);
            for (const visible of await stripDegreesFitAtRest(page, index)) seen.add(visible);
          }
          expect([...seen].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
        } finally {
          await context.close();
        }
      });
    }
  }
}
