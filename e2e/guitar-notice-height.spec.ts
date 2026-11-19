import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The guitar dock's notice line (the review of builder K, item 8, from the
 * Explore builder): at 1440×900 in an alternate tuning with a chord selected
 * the notice took a line of its own and made the dock 26 px taller (321 →
 * 347 px), pushing Explore's circle column past the fold. The notice now
 * shares the controls row where it fits on one line.
 *
 * Measured with and without the notice in the same run (the notice hidden by
 * a style on the page, nothing else changed): with it, the dock is no taller,
 * at 1280×720, 1366×768, 1440×900 and 1536×864, in EN / PT / ES, in standard
 * tuning (a bass the neck cannot give; a grip that leaves out a named tone)
 * and in Open G (a chord: shapes are for standard tuning only; a scale
 * position with a note out of reach). The notice's words are never cut: it
 * stays visible, whole, inside the dock.
 */

const SIZES = [{ w: 1280, h: 720 }, { w: 1366, h: 768 }, { w: 1440, h: 900 }, { w: 1536, h: 864 }];
const LANGS = ['en', 'pt', 'es'] as const;
const CASES = [
  { name: 'standard, no grip has the bass (C7♯5♯9)', state: {}, url: '/?chord=C7%235%239&inst=guitar' },
  { name: 'standard, the grip leaves out the 9 (C9/D♭)', state: {}, url: '/?chord=C9/Db&inst=guitar' },
  { name: 'Open G, a chord', state: { guitarTuningId: 'open-g' }, url: '/?chord=C&inst=guitar' },
  { name: 'Open G, a note out of reach (G major, position III)', state: { guitarTuningId: 'open-g', selectedKey: { natural: 'G', accidental: '' }, guitarScalePosition: 3 }, url: '/' },
] as const;

async function open(browser: Browser, size: { w: number; h: number }, lang: string, state: Record<string, unknown>, url: string) {
  const context = await browser.newContext({ viewport: { width: size.w, height: size.h }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { language: lang, lastView: 'explore', instrument: 'guitar', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', ...state }, version: 6 }));
  const page = await context.newPage();
  await page.goto(url);
  await expect(page.locator('[role="grid"]').first()).toBeAttached({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

/** Two frames and a pause: under reduced motion a restyled element can show its old size for one frame. */
const settled = (page: Page) => page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 250)))));
const dockHeight = (page: Page) => page.getByTestId('instrument-dock').evaluate((el) => el.getBoundingClientRect().height);

for (const c of CASES) {
  for (const size of SIZES) {
    for (const lang of LANGS) {
      test(`${c.name}, ${size.w}×${size.h} ${lang}: the notice adds no height to the dock`, async ({ browser }) => {
        const { context, page } = await open(browser, size, lang, c.state, c.url);
        try {
          const notice = page.getByTestId('instrument-dock').getByRole('status');
          await expect(notice).toHaveCount(1);
          await expect(notice).toBeVisible();
          await settled(page);
          const withIt = await dockHeight(page);
          // Whole: inside the dock, no line cut off by the dock or the window.
          const box = (await notice.boundingBox())!;
          const dock = (await page.getByTestId('instrument-dock').boundingBox())!;
          expect(box.x).toBeGreaterThanOrEqual(dock.x - 0.5);
          expect(box.x + box.width).toBeLessThanOrEqual(dock.x + dock.width + 0.5);
          expect(await notice.evaluate((el) => el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1)).toBe(true);
          await notice.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
          await settled(page);
          const without = await dockHeight(page);
          console.log(`notice height: ${c.name} ${size.w}x${size.h} ${lang}: with ${withIt.toFixed(1)} px, without ${without.toFixed(1)} px`);
          expect(withIt, `with the notice ${withIt}, without ${without}`).toBeLessThanOrEqual(without + 0.5);
        } finally {
          await context.close();
        }
      });
    }
  }
}
