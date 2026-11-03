import { test, expect } from '@playwright/test';
import { fret, readingFits, readingReady, readingSave, readingTargets } from './helpers/readingDrill';

for (const size of [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
]) {
  test(`reading on ${size.name}: wrong, reload verdict, Continue, right, high note and horizontal neck`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: size.viewport, isMobile: size.touch, hasTouch: size.touch, serviceWorkers: 'block', reducedMotion: 'reduce' });
    await context.addInitScript((save) => {
      if (sessionStorage.getItem('reading-seeded')) return;
      localStorage.clear();
      localStorage.setItem('music-theory-app', JSON.stringify({ version: 6, state: { lastView: 'drill', instrument: 'piano', guitarTuningId: 'drop-d', guitarScalePosition: 9, language: 'en' } }));
      localStorage.setItem('fermata-drill-v1', JSON.stringify(save));
      sessionStorage.setItem('reading-seeded', '1');
    }, readingSave());
    const page = await context.newPage();
    await page.goto('/');
    await readingReady(page);
    await expect(page.getByText('Where is this note in position V?')).toBeVisible();
    await expect(page.locator('[data-answer]')).toHaveCount(0);
    await expect(fret(page, 3, 5)).toHaveAttribute('aria-label', 'String 3, fret 5');
    await readingTargets(page);
    await readingFits(page);
    // Low E stays at the TOP; higher frets to the LEFT of the nut.
    const high = (await fret(page, 0, 9).boundingBox())!;
    const low = (await fret(page, 0, 5).boundingBox())!;
    const bottom = (await fret(page, 5, 5).boundingBox())!;
    expect(high.x).toBeLessThan(low.x);
    expect(low.y).toBeLessThan(bottom.y);
    await fret(page, 0, 5).click();
    await expect(page.getByText(/Not quite/)).toBeVisible();
    await expect(fret(page, 3, 5)).toHaveAttribute('data-answer', 'correct');
    await readingFits(page);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-drill-v1')!));
    expect(saved.state.activeSession.log.byFamily.read).toEqual({ asked: 1, correct: 0 });
    await page.reload();
    await readingReady(page);
    await expect(page.getByText(/Not quite/)).toBeVisible();
    await expect(fret(page, 3, 5)).toHaveAttribute('data-answer', 'correct');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.getByText(/Where is this note in the open position/)).toBeVisible();
    await expect(page.locator('[data-answer]')).toHaveCount(0);
    await fret(page, 4, 1).click();
    // Correct auto-advances after 600 ms; don't race the flash with screenshots.
    await expect(page.getByText('Where is this note on the guitar? Any string.')).toBeVisible();
    await readingReady(page);
    await fret(page, 0, 0).click();
    await expect(fret(page, 5, 15)).toHaveAttribute('data-answer', 'correct');
    // The reveal scrolls the neck itself to the high answer; the page stays put.
    await expect(fret(page, 5, 15)).toBeInViewport();
    await readingFits(page);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.locator('[data-answer]')).toHaveCount(0);
    const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state);
    expect(prefs).toMatchObject({ instrument: 'piano', guitarTuningId: 'drop-d', guitarScalePosition: 9 });
    await context.close();
  });
}
