import { test, expect } from '@playwright/test';

// Main (03fc07d): 220 px. Losing the laptop padding utility adds 8 px to
// the dock and takes those pixels from both Explore workbench columns.
for (const language of ['en', 'pt', 'es'] as const) {
  test(`1440×900 ${language}: docked guitar retains main's 220 px grid height`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      isMobile: false,
      hasTouch: false,
      reducedMotion: 'reduce',
      serviceWorkers: 'block',
    });
    try {
      await context.addInitScript((lang) => {
        localStorage.clear();
        localStorage.setItem('music-theory-app', JSON.stringify({
          state: {
            themeMode: 'fermata', language: lang, lastView: 'explore', instrument: 'guitar',
            selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', guitarScalePosition: 0,
          },
          version: 6,
        }));
      }, language);
      const page = await context.newPage();
      await page.goto('/');
      const dock = page.getByTestId('instrument-dock');
      const grid = dock.getByRole('grid');
      await expect(grid).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('scale-strip')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByTestId('explore-work')).toHaveAttribute('data-layout', 'workbench');
      await expect(dock.getByRole('separator')).toHaveCount(0);

      const expectMainHeight = async (state: string) => {
        await expect.poll(
          () => grid.evaluate((element) => element.getBoundingClientRect().height),
          { message: `${language} ${state}: docked laptop fretboard matches main's 220 px height` },
        ).toBe(220);
      };
      // Open position includes the translated badge ("Abierta" in Spanish).
      await expectMainHeight('open position');
      const chords = page.locator('.chord-row button');
      await expect(chords).toHaveCount(7);
      for (let index = 0; index < 7; index++) {
        await chords.nth(index).click();
        await expect(chords.nth(index)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByTestId('chord-detail')).toBeVisible();
        await expectMainHeight(`chord ${index + 1}`);
      }
    } finally {
      await context.close();
    }
  });
}
