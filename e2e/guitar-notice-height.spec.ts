import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The guitar dock's notice line (the review of builder K, item 8, from the
 * Explore builder): at 1440×900 in an alternate tuning with a chord selected
 * the notice took a line of its own and made the dock 26 px taller (321 →
 * 347 px), pushing Explore's circle column past the fold. From 1024 px the
 * notice now shares the controls row's line (the chord chips give up width
 * and scroll sideways, the selected chip kept in view).
 *
 * Measured with and without the notice in the same run (the notice hidden by
 * a style on the page, nothing else changed), at 1024×768, 1100×768,
 * 1180×800, 1280×720, 1366×768, 1440×900 and 1536×864, in EN / PT / ES. A CHORD's notice adds no height: standard
 * tuning (a bass the neck cannot give; a grip that leaves out a named tone)
 * and Open G (shapes are for standard tuning only).
 *
 * Not at 1024 px in Spanish for the two longest (NARROW, below), which take a
 * line (or two) of their own there.
 *
 * A SCALE POSITION's notice in Open G (a note out of reach) cannot: on one
 * line it is 882 / 981 / 1,035 px (EN / PT / ES) and the row's controls leave
 * 108–546 px beside them; on two lines it is 40.6 px tall, more than the
 * row's 36 px line. So it keeps its own line, as before: 26.3 px — pinned as
 * that, so it can grow no further. Its words are never cut: every notice
 * stays visible, whole, inside the dock.
 */

// From 1024 px, where the rule starts (the second review: the spec began at 1280, so the claim had no test).
const SIZES = [{ w: 1024, h: 768 }, { w: 1100, h: 768 }, { w: 1180, h: 800 }, { w: 1280, h: 720 }, { w: 1366, h: 768 }, { w: 1440, h: 900 }, { w: 1536, h: 864 }];
const LANGS = ['en', 'pt', 'es'] as const;
const CASES = [
  { name: 'standard, no grip has the bass (C7♯5♭9/B)', state: {}, url: '/?chord=C7%235b9/B&inst=guitar', adds: 0 },
  { name: 'standard, the grip leaves out the 9 (B♭m9/B)', state: {}, url: '/?chord=Bbm9/B&inst=guitar', adds: 0 },
  { name: 'Open G, a chord', state: { guitarTuningId: 'open-g' }, url: '/?chord=C&inst=guitar', adds: 0 },
  // One line of text-ui (20.3 px) and the row's gap (6 px): it does not fit beside the controls.
  { name: 'Open G, a note out of reach (G major, position III)', state: { guitarTuningId: 'open-g', selectedKey: { natural: 'G', accidental: '' }, guitarScalePosition: 3 }, url: '/', adds: 26.3 },
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

// Measured where the words do not fit even so, at 1024 px in Spanish (the
// second review asked for this width): "Las formas de acordes solo existen
// para la afinación estándar…" (744 px on one line) takes its own line,
// +26.3 px; the scale-position notice takes two, +46.6 px. Pinned as they are.
const NARROW: Record<string, number> = {
  'Open G, a chord|1024|es': 26.3,
  'Open G, a note out of reach (G major, position III)|1024|es': 46.6,
};
for (const c of CASES) {
  for (const size of SIZES) {
    for (const lang of LANGS) {
      const adds = NARROW[`${c.name}|${size.w}|${lang}`] ?? c.adds;
      const claim = adds === 0 ? 'the notice adds no height to the dock' : adds > 30 ? 'the notice takes two lines of its own and no more (it does not fit beside the controls)' : 'the notice takes one line of its own and no more (it does not fit beside the controls)';
      test(`${c.name}, ${size.w}×${size.h} ${lang}: ${claim}`, async ({ browser }) => {
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
          // The chord chips give up width, never the selected chip: it stays in view.
          const chip = page.getByTestId('instrument-dock').locator('.chip-row-scroll [aria-checked="true"]');
          if ((await chip.count()) > 0) {
            const at = (await chip.boundingBox())!;
            const row = (await page.getByTestId('instrument-dock').locator('.chip-row-scroll').first().boundingBox())!;
            expect(at.x).toBeGreaterThanOrEqual(row.x - 0.5);
            expect(at.x + at.width).toBeLessThanOrEqual(row.x + row.width + 0.5);
          }
          await notice.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
          await settled(page);
          const without = await dockHeight(page);
          console.log(`notice height: ${c.name} ${size.w}x${size.h} ${lang}: with ${withIt.toFixed(1)} px, without ${without.toFixed(1)} px`);
          expect(withIt, `with the notice ${withIt}, without ${without}`).toBeLessThanOrEqual(without + adds + 0.5);
        } finally {
          await context.close();
        }
      });
    }
  }
}

// Two notices at once take their own line (index.css, `data-notices="two"`;
// second review, item 5: Cm(add11)/F♯ squeezed the chips to 62 px). No request
// reaches both since that review (fretboardTwoNotices.test.tsx), so the second
// sentence is SIMULATED here: added to a real notice with the mark the board
// sets, to see what the stylesheet does with it.
for (const size of SIZES) {
  for (const lang of LANGS) {
    test(`two notices (simulated), ${size.w}×${size.h} ${lang}: their own line, the chips keep the row and the selected one is whole`, async ({ browser }) => {
      const { context, page } = await open(browser, size, lang, {}, '/?chord=C7%235b9/B&inst=guitar');
      try {
        const notice = page.getByTestId('instrument-dock').getByRole('status');
        await expect(notice).toHaveCount(1);
        await notice.evaluate((el) => { el.textContent = `${el.textContent} ${el.textContent}`; el.setAttribute('data-notices', 'two'); });
        await settled(page);
        const box = (await notice.boundingBox())!;
        const row = (await page.getByTestId('instrument-dock').locator('.chip-row-scroll').first().boundingBox())!;
        const controls = (await page.getByTestId('instrument-dock').locator('.fretboard-controls').boundingBox())!;
        // Its own line: below the chips, as wide as the row.
        expect(box.y).toBeGreaterThanOrEqual(row.y + row.height - 0.5);
        expect(box.width).toBeGreaterThan(controls.width - 40);
        const chip = page.getByTestId('instrument-dock').locator('.chip-row-scroll [aria-checked="true"]');
        const at = (await chip.boundingBox())!;
        expect(at.x).toBeGreaterThanOrEqual(row.x - 0.5);
        expect(at.x + at.width).toBeLessThanOrEqual(row.x + row.width + 0.5);
        expect(row.width).toBeGreaterThan(200);
      } finally {
        await context.close();
      }
    });
  }
}
