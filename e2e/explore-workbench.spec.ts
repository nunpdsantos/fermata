import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The Explore workbench (W11-B, decisions D-25 / D-29 / D-30 and the D-26
 * landscape neck), in a real browser:
 *  - 1440×900: no page scroll and nothing scrolled inside either — the key
 *    summary, the staff strip, the chords (detail open) and the circle of
 *    fifths beside them, over the docked instrument (piano and guitar);
 *  - the LINKED FOCUS NOTE: B in the staff strip lights B on the piano and on
 *    the fretboard, and B on the instrument lights the strip's B; the
 *    read-out names it; screen readers hear it once it settles, not per note;
 *  - "⋯": Copy, Print and Compare are one tap away (D-29);
 *  - phone 390×844 and 844×390: no sideways page scroll; sideways, the guitar
 *    has a full-neck view with all six strings and frets 0–12.
 */

async function open(browser: Browser, opts: { w: number; h: number; touch?: boolean; state?: Record<string, unknown> }) {
  const context = await browser.newContext({
    viewport: { width: opts.w, height: opts.h },
    isMobile: !!opts.touch,
    hasTouch: !!opts.touch,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
  });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({
    state: {
      themeMode: 'fermata', language: 'en', lastView: 'explore', instrument: 'piano', baseOctave: 4,
      selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', guitarScalePosition: 0,
      ...opts.state,
    },
    version: 6,
  }));
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1000);
  return { context, page };
}

const readout = (page: Page) => page.getByTestId('dock-readout').locator('.dock-context-text');
const stripB = (page: Page) => page.locator('.strip-col[data-note="B"]').first();

/** Every box fully inside the viewport. */
async function inView(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top >= -0.5 && r.left >= -0.5 && r.bottom <= innerHeight + 0.5 && r.right <= innerWidth + 0.5 && r.height > 0;
  });
}

/** Nothing scrolls: not the page, not the work columns. */
async function scrollState(page: Page) {
  return page.evaluate(() => {
    const se = document.scrollingElement!;
    const box = (sel: string) => {
      const el = document.querySelector(sel);
      return el ? { scroll: el.scrollHeight, client: el.clientHeight } : null;
    };
    return {
      page: se.scrollHeight - se.clientHeight,
      sideways: se.scrollWidth - se.clientWidth,
      main: box('.explore-main'),
      aside: box('.explore-aside'),
      layout: document.querySelector('[data-testid="explore-work"]')?.getAttribute('data-layout'),
    };
  });
}

for (const instrument of ['piano', 'guitar'] as const) {
  test(`1440×900 ${instrument}: no scroll anywhere; summary, staff strip, chords (detail open) and the circle beside them, over the docked instrument`, async ({ browser }) => {
    const { context, page } = await open(browser, { w: 1440, h: 900, state: { instrument } });
    if (instrument === 'guitar') await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    await page.waitForTimeout(500);
    const s = await scrollState(page);
    expect(s.layout).toBe('workbench');
    expect(s.page, 'page scroll').toBeLessThanOrEqual(0);
    expect(s.sideways, 'sideways page scroll').toBeLessThanOrEqual(0);
    expect(s.main!.scroll, 'the main column needs no scrolling').toBeLessThanOrEqual(s.main!.client + 1);
    expect(s.aside!.scroll, 'the circle column needs no scrolling').toBeLessThanOrEqual(s.aside!.client + 1);
    for (const sel of ['[data-testid="key-summary"]', '[data-testid="scale-strip"]', '[data-testid="chords-card"]', '[data-testid="chord-detail"]', '[data-testid="circle-card"]', '[data-testid="key-facts"]', '[data-testid="instrument-dock"]']) {
      expect(await inView(page, sel), `${sel} fully on screen`).toBe(true);
    }
    // Beside the work, not under it; the dock is a docked panel, not a sheet.
    const main = (await page.locator('.explore-main').boundingBox())!;
    const circle = (await page.getByTestId('circle-card').boundingBox())!;
    expect(circle.x).toBeGreaterThanOrEqual(main.x + main.width - 1);
    await expect(page.getByRole('separator', { name: 'Instrument panel' })).toHaveCount(0);
    await expect(page.getByTestId('cof-chord-mark')).toHaveCount(1); // the chord's root is marked
    await expect(page.getByTestId('key-facts')).toContainText('Dominant key');
    await context.close();
  });
}

test('linked focus (piano): B in the staff strip lights B4 on the piano, and B4 on the piano lights the strip\'s B; the read-out says so', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1440, h: 900 });
  // Mouse over the strip's B.
  await stripB(page).hover();
  await expect(page.locator('[data-piano-key][data-focus-note]')).toHaveCount(1);
  await expect(page.locator('[data-piano-key][data-focus-note]')).toHaveAttribute('aria-label', 'B4');
  await expect(readout(page)).toHaveText('B — leading note of C Major · B4');
  // Keyboard: Tab into the strip, arrows to B (the 7th column).
  await page.mouse.move(5, 5);
  await expect(page.locator('[data-piano-key][data-focus-note]')).toHaveCount(0);
  await page.locator('.strip-col').first().focus();
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight');
  await expect(stripB(page)).toBeFocused();
  await expect(page.locator('[data-piano-key][data-focus-note]')).toHaveAttribute('aria-label', 'B4');
  await expect(readout(page)).toHaveText('B — leading note of C Major · B4');
  await stripB(page).blur();
  // Vice versa: the mouse over the piano's B4.
  // (Low on the ivory: the black keys cover its upper part.)
  const b4 = page.locator('[data-piano-key][aria-label="B4"]');
  const kb = (await b4.boundingBox())!;
  await b4.hover({ position: { x: kb.width / 2, y: kb.height - 20 } });
  await expect(stripB(page)).toHaveAttribute('data-on', 'true');
  await expect(readout(page)).toHaveText('B — leading note of C Major · B4');
  // With G major selected, B is its 3rd.
  await page.mouse.move(5, 5);
  await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
  await stripB(page).hover();
  await expect(readout(page)).toHaveText('B — 3rd of G · leading note of C Major · B4');
  await context.close();
});

test('linked focus (guitar): B in the strip lights the Bs of the open position, and a fret lights the strip', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1440, h: 900, state: { instrument: 'guitar' } });
  await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
  await stripB(page).hover();
  const lit = page.locator('[role="grid"] [data-focus-note]');
  await expect(lit).toHaveCount(2);
  await expect(page.locator('[data-string-row="1"][data-fret="2"]')).toHaveAttribute('data-focus-note', 'true');
  await expect(readout(page)).toHaveText('B — leading note of C Major · string 5 fret 2, string 2 open');
  // Vice versa: the mouse over string 5, fret 2.
  await page.mouse.move(5, 5);
  await expect(lit).toHaveCount(0);
  await page.locator('[data-string-row="1"][data-fret="2"]').hover();
  await expect(stripB(page)).toHaveAttribute('data-on', 'true');
  await expect(readout(page)).toHaveText('B — leading note of C Major · string 5 fret 2');
  await context.close();
});

test('the read-out is announced politely once the focus settles — not note by note', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1440, h: 900 });
  const live = page.getByTestId('dock-announce');
  await expect(live).toHaveAttribute('aria-live', 'polite');
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="dock-announce"]')!;
    (window as unknown as { __announced: string[] }).__announced = [];
    new MutationObserver(() => (window as unknown as { __announced: string[] }).__announced.push(el.textContent ?? '')).observe(el, { childList: true, characterData: true, subtree: true });
  });
  // Sweep the mouse along the strip, a note every 80 ms.
  for (const note of ['C', 'D', 'E', 'F', 'G']) {
    await page.locator(`.strip-col[data-note="${note}"]`).first().hover();
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(900);
  const announced = await page.evaluate(() => (window as unknown as { __announced: string[] }).__announced);
  expect(announced).toEqual(['G — dominant of C Major · G4']);
  await context.close();
});

test('"⋯" scale actions: Copy, Print and Compare stay one tap away (D-29)', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1440, h: 900 });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate(() => {
    (window as unknown as { __printed: number }).__printed = 0;
    window.print = () => { (window as unknown as { __printed: number }).__printed++; };
  });
  // Off the main surface.
  await expect(page.getByRole('button', { name: /Copy scale summary/ })).toHaveCount(0);
  const actions = page.getByRole('button', { name: 'Scale actions' });
  await actions.click();
  await page.getByRole('menuitem', { name: 'Copy scale summary to clipboard' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Copied to clipboard' })).toBeVisible();
  await actions.click();
  await page.getByRole('menuitem', { name: 'Print scale diagram' }).click();
  expect(await page.evaluate(() => (window as unknown as { __printed: number }).__printed)).toBe(1);
  await actions.click();
  await page.getByRole('menuitem', { name: 'Compare Scales' }).click();
  const sheet = page.getByRole('dialog', { name: 'Compare Scales' });
  await sheet.getByRole('combobox', { name: 'Select scale to compare' }).selectOption('lydian');
  await expect(sheet.getByRole('group', { name: 'Chromatic scale comparison' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveCount(0);
  await expect(actions).toBeFocused();
  await context.close();
});

test('390×844: one column, no sideways page scroll; the key picker is the circle of fifths', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 390, h: 844, touch: true });
  const s = await scrollState(page);
  expect(s.layout).toBe('phone');
  expect(s.sideways).toBeLessThanOrEqual(0);
  await expect(page.getByTestId('circle-card')).toHaveCount(0);
  await page.getByTestId('key-picker').click();
  const sheet = page.getByRole('dialog', { name: 'Key' });
  await expect(sheet.locator('g[role="button"][data-key]')).toHaveCount(24);
  await sheet.locator('g[role="button"][data-key="A minor"]').click();
  await expect(page.getByTestId('key-summary')).toContainText('A Natural Minor');
  await sheet.getByRole('radiogroup', { name: 'Root' }).getByRole('radio', { name: 'D', exact: true }).click();
  await expect(page.getByTestId('key-summary')).toContainText('D Natural Minor');
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveCount(0);
  await context.close();
});

test('844×390 guitar: the full-neck view shows all six strings and frets 0–12, and closes back to the dock', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 844, h: 390, touch: true, state: { instrument: 'guitar' } });
  const s = await scrollState(page);
  expect(s.sideways).toBeLessThanOrEqual(0);
  await page.getByTestId('neck-open').click();
  const neck = page.getByTestId('neck-view');
  await expect(neck.locator('[data-string-row="5"]').first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(300);
  const m = await neck.evaluate((root) => {
    const rows = [0, 1, 2, 3, 4, 5].map((st) => Array.from(root.querySelectorAll(`[data-string-row="${st}"]`)).map((c) => c.getBoundingClientRect()));
    const all = rows.flat();
    const frets = Array.from(root.querySelectorAll('[data-string-row="0"]')).map((c) => Number(c.getAttribute('data-fret')));
    return {
      onScreen: all.every((r) => r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight + 0.5 && r.right <= innerWidth + 0.5),
      strings: rows.filter((r) => r.length > 0).length,
      minFret: Math.min(...frets),
      maxFret: Math.max(...frets),
      cellW: Math.min(...all.map((r) => r.width)),
      cellH: Math.min(...all.map((r) => r.height)),
      sideways: document.scrollingElement!.scrollWidth - document.scrollingElement!.clientWidth,
      open: root.querySelectorAll('[data-open-string]').length,
    };
  });
  expect(m.strings).toBe(6);
  expect(m.open).toBe(6); // fret 0: the open strings
  expect(m.minFret).toBe(1);
  expect(m.maxFret).toBeGreaterThanOrEqual(12);
  expect(m.onScreen).toBe(true);
  expect(m.sideways).toBeLessThanOrEqual(0);
  // Fret cells are the instrument surface (tap-size exempt); reported here.
  test.info().annotations.push({ type: 'neck-cell', description: `smallest fret cell ${m.cellW.toFixed(1)}×${m.cellH.toFixed(1)} px` });
  console.log(`[neck] smallest fret cell ${m.cellW.toFixed(1)}×${m.cellH.toFixed(1)} px`);
  // The stepper walks the positions; the label toggle switches the dots.
  await neck.getByRole('button', { name: 'Next position' }).click();
  await expect(neck.getByRole('combobox', { name: 'Scale position' })).toHaveValue('1');
  await neck.getByRole('radio', { name: 'Notes' }).click();
  await expect(neck.getByRole('radio', { name: 'Notes' })).toHaveAttribute('aria-checked', 'true');
  // Escape closes; focus returns to the button that opened it.
  await page.keyboard.press('Escape');
  await expect(neck).toHaveCount(0);
  await expect(page.getByTestId('neck-open')).toBeFocused();
  await context.close();
});
