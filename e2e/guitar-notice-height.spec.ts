import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The guitar dock's notice line (music audit 2, the review of builder K, item
 * 8): at 1440×900 in an alternate tuning with a chord selected the notice took
 * a line of its own and made the dock 26 px taller (321 → 347 px), pushing
 * Explore's circle column past the fold. From 1024 px the notice shares the
 * controls row's line where it fits beside the controls AND one whole chord
 * chip; where it does not, it takes its own line(s), as below 1024 px — the
 * layout decides, by widths (the chips' line is never narrower than its
 * selected chip: ChordShapeSelector, `.chord-shapes-line`).
 *
 * What is asserted holds on every platform, so it is asserted twice: with
 * this machine's text and with text 8 % wider (letter-spacing 0.04em, roughly
 * how GitHub's Linux draws it; e2e/neck-orientation.spec.ts does the same).
 * On every row:
 *  - the notice is whole (nothing cut) and inside the dock;
 *  - the selected chord chip is whole inside its row, and the row is at
 *    least as wide as that chip;
 *  - on the controls' line, the notice adds no height (± 0.5 px);
 *  - on its own line(s), it adds exactly its own box and the row's gap
 *    (6 px, `gap-y-1.5`), ± 0.5 px, and two lines at most.
 * Hard claims, with both texts: every chord's notice from 1280 px up shares
 * the controls' line in EN / PT / ES (the audit's figure: at 1440×900 in
 * Open G the chord notice adds no height). Below 1280 px it may take a line:
 * at 1024 px in Spanish it must (a learner on wider text saw the selected
 * chip cut to 95 px beside it, GitHub run #71).
 */

// From 1024 px, where the rule starts.
const SIZES = [{ w: 1024, h: 768 }, { w: 1100, h: 768 }, { w: 1180, h: 800 }, { w: 1280, h: 720 }, { w: 1366, h: 768 }, { w: 1440, h: 900 }, { w: 1536, h: 864 }];
const LANGS = ['en', 'pt', 'es'] as const;
const TEXTS = [{ wide: false, label: '' }, { wide: true, label: ' (text 8 % wider)' }] as const;
const CASES = [
  { name: 'standard, no grip has the bass (C7♯5♭9/B)', state: {}, url: '/?chord=C7%235b9/B&inst=guitar', chord: true },
  { name: 'standard, the grip leaves out the 9 (B♭m9/B)', state: {}, url: '/?chord=Bbm9/B&inst=guitar', chord: true },
  { name: 'Open G, a chord', state: { guitarTuningId: 'open-g' }, url: '/?chord=C&inst=guitar', chord: true },
  { name: 'Open G, a note out of reach (G major, position III)', state: { guitarTuningId: 'open-g', selectedKey: { natural: 'G', accidental: '' }, guitarScalePosition: 3 }, url: '/', chord: false },
] as const;
/** The controls row's gap between its lines (`gap-y-1.5`): what a notice on its own line adds besides its own box. */
const ROW_GAP = 6;
const WIDE_TEXT = '*, *::before, *::after { letter-spacing: 0.04em !important; }';

async function open(browser: Browser, size: { w: number; h: number }, lang: string, state: Record<string, unknown>, url: string, wide: boolean) {
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
  if (wide) await page.addStyleTag({ content: WIDE_TEXT });
  return { context, page };
}

/** Two frames and a pause: under reduced motion a restyled element can show its old size for one frame. */
const settled = (page: Page) => page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 250)))));
const dockHeight = (page: Page) => page.getByTestId('instrument-dock').evaluate((el) => el.getBoundingClientRect().height);

/** The always-true checks; returns where the notice sits and its box. */
async function checkRow(page: Page, where: string) {
  const dock = page.getByTestId('instrument-dock');
  const notice = dock.getByRole('status');
  await expect(notice, where).toHaveCount(1);
  await expect(notice, where).toBeVisible();
  await settled(page);
  const box = (await notice.boundingBox())!;
  const dockBox = (await dock.boundingBox())!;
  // Whole, and inside the dock.
  expect(box.x, `${where}: notice inside the dock (left)`).toBeGreaterThanOrEqual(dockBox.x - 0.5);
  expect(box.x + box.width, `${where}: notice inside the dock (right)`).toBeLessThanOrEqual(dockBox.x + dockBox.width + 0.5);
  expect(await notice.evaluate((el) => el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1), `${where}: notice whole`).toBe(true);
  // The selected chip whole inside its row; the row at least as wide as it.
  const chip = dock.locator('.chip-row-scroll [aria-checked="true"]');
  let chips = '';
  if ((await chip.count()) > 0) {
    const at = (await chip.boundingBox())!;
    const row = (await dock.locator('.chip-row-scroll').first().boundingBox())!;
    chips = `, chip row ${row.width.toFixed(1)} px for a ${at.width.toFixed(1)} px chip`;
    expect(row.width, `${where}: chip row ${row.width.toFixed(1)} px, its selected chip ${at.width.toFixed(1)} px`).toBeGreaterThanOrEqual(at.width - 0.5);
    expect(at.x, `${where}: selected chip cut on the left (chip x ${at.x.toFixed(1)}, row x ${row.x.toFixed(1)})`).toBeGreaterThanOrEqual(row.x - 0.5);
    expect(at.x + at.width, `${where}: selected chip cut on the right`).toBeLessThanOrEqual(row.x + row.width + 0.5);
  }
  // On the controls' line or not: the notice starts above the bottom of the row's first control.
  const first = await page.evaluate(() => {
    const controls = document.querySelector('[data-testid="instrument-dock"] .fretboard-controls')!;
    const item = Array.from(controls.children).find((c) => c.getAttribute("role") !== "status")!;
    const r = item.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom };
  });
  const lineHeight = await notice.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
  return { box, sameLine: box.y < first.bottom - 1, lines: Math.round(box.height / lineHeight), lineHeight, chips };
}

for (const c of CASES) {
  for (const size of SIZES) {
    for (const lang of LANGS) {
      for (const text of TEXTS) {
        const mustShare = c.chord && size.w >= 1280;
        const claim = mustShare ? 'shares the controls\' line and adds no height' : 'on the controls\' line adds nothing; on its own line(s) adds its box and the gap';
        test(`${c.name}, ${size.w}×${size.h} ${lang}${text.label}: ${claim}`, async ({ browser }) => {
          const where = `${c.name} ${size.w}×${size.h} ${lang}${text.label}`;
          const { context, page } = await open(browser, size, lang, c.state, c.url, text.wide);
          try {
            const at = await checkRow(page, where);
            const withIt = await dockHeight(page);
            await page.getByTestId('instrument-dock').getByRole('status').evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
            await settled(page);
            const without = await dockHeight(page);
            console.log(`notice height: ${where}: with ${withIt.toFixed(1)} px, without ${without.toFixed(1)} px, ${at.sameLine ? 'on the controls\' line' : `its own line(s): ${at.lines}, box ${at.box.height.toFixed(1)} px`}${at.chips}`);
            if (mustShare) expect(at.sameLine, `${where}: must share the controls' line`).toBe(true);
            if (at.sameLine) {
              expect(Math.abs(withIt - without), `${where}: on the controls' line, with ${withIt}, without ${without}`).toBeLessThanOrEqual(0.5);
            } else {
              expect(Math.abs(withIt - without - (at.box.height + ROW_GAP)), `${where}: own line: with ${withIt}, without ${without}, box ${at.box.height}, gap ${ROW_GAP}`).toBeLessThanOrEqual(0.5);
              expect(at.lines, `${where}: at most two lines`).toBeLessThanOrEqual(2);
            }
          } finally {
            await context.close();
          }
        });
      }
    }
  }
}

// Two notices at once take their own line (index.css, `data-notices="two"`;
// second review, item 5). No request reaches both since that review
// (fretboardTwoNotices.test.tsx), so the second sentence is SIMULATED here:
// added to a real notice with the mark the board sets.
for (const size of SIZES) {
  for (const lang of LANGS) {
    for (const text of TEXTS) {
      test(`two notices (simulated), ${size.w}×${size.h} ${lang}${text.label}: their own line(s); the chips keep the row and the selected one is whole`, async ({ browser }) => {
        const where = `two notices ${size.w}×${size.h} ${lang}${text.label}`;
        const { context, page } = await open(browser, size, lang, {}, '/?chord=C7%235b9/B&inst=guitar', text.wide);
        try {
          const notice = page.getByTestId('instrument-dock').getByRole('status');
          await expect(notice).toHaveCount(1);
          await notice.evaluate((el) => { el.textContent = `${el.textContent} ${el.textContent}`; el.setAttribute('data-notices', 'two'); });
          const at = await checkRow(page, where);
          const withIt = await dockHeight(page);
          await notice.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
          await settled(page);
          const without = await dockHeight(page);
          expect(at.sameLine, `${where}: on a line of their own`).toBe(false);
          expect(Math.abs(withIt - without - (at.box.height + ROW_GAP)), `${where}: with ${withIt}, without ${without}, box ${at.box.height}`).toBeLessThanOrEqual(0.5);
          expect(at.lines, `${where}: at most two lines`).toBeLessThanOrEqual(2);
        } finally {
          await context.close();
        }
      });
    }
  }
}
