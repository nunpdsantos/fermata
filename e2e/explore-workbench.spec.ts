import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The Explore workbench (W11-B, decisions D-25 / D-29 / D-30 and the D-26
 * landscape neck), in a real browser:
 *  - 1440×900: no page scroll and nothing scrolled inside either — the key
 *    summary, the staff strip, the chords (detail open) and the circle of
 *    fifths beside them, over the docked instrument (piano and guitar) —
 *    with ≥ 40 px to spare in the work column for every chord in key, in
 *    EN / PT / ES (it once fitted with 0 px on a Mac and overflowed on CI);
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

/**
 * Room to spare at the foot of the main column: its content box's bottom
 * less the last card's. Negative = it overflows (and scrolls) by that much.
 * The 1440×900 layout must not fit "just": a wrapped line on another
 * platform's glyph widths (CI on Linux) once cost a whole detail row.
 */
async function headroom(page: Page) {
  return page.evaluate(() => {
    const m = document.querySelector('.explore-main')!;
    const top = m.getBoundingClientRect().top + m.clientTop - m.scrollTop;
    const bottom = Math.max(...Array.from(m.children).map((c) => c.getBoundingClientRect().bottom + parseFloat(getComputedStyle(c).marginBottom))) - top;
    return m.clientHeight - parseFloat(getComputedStyle(m).paddingBottom) - bottom;
  });
}
const HEADROOM = 40;

/** Each chord in key in turn: its detail opens in two rows, nothing scrolls, the headroom holds. */
async function everyChordFits(page: Page, label: string) {
  const cards = page.locator('.chord-row button');
  const n = await cards.count();
  expect(n).toBe(7);
  for (let i = 0; i < n; i++) {
    if ((await cards.nth(i).getAttribute('aria-pressed')) !== 'true') await cards.nth(i).click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    const name = await page.locator('.chord-detail-name').textContent();
    const rows = await page.locator('[data-testid="chord-detail"] .chord-detail-row').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
    expect(rows, `${label} ${name}: the detail's rows are one line each`).toEqual([36, 36]);
    const s = await scrollState(page);
    expect(s.main!.scroll, `${label} ${name}: the main column needs no scrolling`).toBeLessThanOrEqual(s.main!.client + 1);
    expect(await headroom(page), `${label} ${name}: px to spare in the main column`).toBeGreaterThanOrEqual(HEADROOM);
  }
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
    expect(await headroom(page), 'px to spare in the main column').toBeGreaterThanOrEqual(HEADROOM);
    expect(s.aside!.scroll, 'the circle column needs no scrolling').toBeLessThanOrEqual(s.aside!.client + 1);
    // The staff strip shows the chord (its tones lit); the detail's own small
    // staff is for narrower screens and paper.
    await expect(page.getByTestId('chord-staff')).toBeHidden();
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
    // Not just G: every chord in key (the minor ones list more scales).
    await everyChordFits(page, instrument);
    await context.close();
  });
}

test('1440×900 in Portuguese and Spanish: every chord in key opens in place, two rows, no scroll, the same headroom', async ({ browser }) => {
  for (const language of ['pt', 'es']) {
    const { context, page } = await open(browser, { w: 1440, h: 900, state: { language } });
    await everyChordFits(page, language);
    await context.close();
  }
});

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

// Common laptops: at 1440×900 nothing scrolls (above); shorter, the WORK
// column scrolls and nothing else — the circle (its facts beside it) and the
// instrument stay put.
for (const [w, h] of [[1280, 800], [1366, 768], [1536, 864]] as const) {
  test(`${w}×${h}: only the work column scrolls; the circle and the instrument stay put`, async ({ browser }) => {
    const { context, page } = await open(browser, { w, h, state: { instrument: 'guitar' } });
    await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
    // Before a chord: everything on screen.
    for (const sel of ['[data-testid="circle-card"]', '[data-testid="key-facts"]', '[data-testid="instrument-dock"]', '[data-testid="key-summary"]', '[data-testid="scale-strip"]']) {
      expect(await inView(page, sel), `${sel} fully on screen`).toBe(true);
    }
    const circleTop = (await page.getByTestId('circle-card').boundingBox())!.y;
    // A chord: its detail scrolls into view in the WORK column only.
    await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    await page.waitForTimeout(700);
    const s = await scrollState(page);
    expect(s.layout).toBe('workbench');
    expect(s.page).toBeLessThanOrEqual(0);
    expect(s.sideways).toBeLessThanOrEqual(0);
    expect(s.aside!.scroll, 'the circle column does not scroll').toBeLessThanOrEqual(s.aside!.client + 1);
    for (const sel of ['[data-testid="circle-card"]', '[data-testid="key-facts"]', '[data-testid="instrument-dock"]', '[data-testid="key-summary"]']) {
      expect(await inView(page, sel), `${sel} fully on screen`).toBe(true);
    }
    const play = page.getByTestId('chord-detail').getByRole('button', { name: 'Chord', exact: true });
    const pb = (await play.boundingBox())!;
    const work = (await page.locator('.explore-main').boundingBox())!;
    expect(pb.y >= work.y - 1 && pb.y + pb.height <= work.y + work.height + 1, '▶ Chord in view').toBe(true);
    expect((await page.getByTestId('circle-card').boundingBox())!.y).toBe(circleTop);
    await context.close();
  });
}

test('768×1024: the circle below the work folds, and stays as left across a reload', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 768, h: 1024, touch: true });
  const toggle = page.getByRole('button', { name: 'Circle of Fifths' });
  // Folded by default: the tablet column is short.
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('key-facts')).toBeHidden();
  await expect(page.locator('g[role="button"][data-key]').first()).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('g[role="button"][data-key]').first()).toBeVisible();
  await expect(page.getByTestId('key-facts')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Circle of Fifths' })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Circle of Fifths' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Circle of Fifths' })).toHaveAttribute('aria-expanded', 'false');
  await context.close();
});

test('staff noteheads wear their degree colour (the ink shade), dimmed outside a chord', async ({ browser }) => {
  for (const theme of ['fermata', 'fermata-night'] as const) {
    const { context, page } = await open(browser, { w: 1440, h: 900, state: { themeMode: theme } });
    await expect(page.locator('.strip-staff g.vf-stavenote').first()).toBeAttached({ timeout: 15_000 });
    const fills = () => page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const toRgb = (hex: string) => {
        const n = parseInt(hex.slice(1), 16);
        return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
      };
      const want = [1, 2, 3, 4, 5, 6, 7, 1].map((d) => toRgb(root.getPropertyValue(`--deg-ink-${d}`).trim()));
      const got = Array.from(document.querySelectorAll('.strip-staff g.vf-stavenote')).map((g) => getComputedStyle(g.querySelector('text')!).fill);
      return { want, got, dim: toRgb(root.getPropertyValue('--text-dim').trim()) };
    });
    const before = await fills();
    expect(before.got, theme).toEqual(before.want);
    await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
    await page.waitForTimeout(300);
    const after = await fills();
    // C major's G chord: G (5), B (7), D (2) keep their colour; the rest dim.
    expect(after.got, theme).toEqual([after.dim, after.want[1], after.dim, after.dim, after.want[4], after.dim, after.want[6], after.dim]);
    await context.close();
  }
});

test('print: a clean page — staff with its strip aligned, chords, circle and key facts; no dock, no menus; Night prints light', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1440, h: 900, state: { themeMode: 'fermata-night' } });
  await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
  await expect(page.getByTestId('chord-detail')).toBeVisible();
  await page.getByRole('button', { name: 'Scale actions' }).click();
  await page.emulateMedia({ media: 'print' });
  // Paper width (A4 at 96 dpi less margins): the strip scales with it.
  await page.setViewportSize({ width: 718, height: 1000 });
  await page.waitForTimeout(400);
  const p = await page.evaluate(() => {
    const shown = (sel: string) => Array.from(document.querySelectorAll(sel)).some((e) => e.getClientRects().length > 0);
    const heads = Array.from(document.querySelectorAll('.strip-staff g.vf-stavenote')).map((g) => {
      const r = g.querySelector('text')!.getBoundingClientRect();
      return r.left + r.width / 2;
    });
    const cols = Array.from(document.querySelectorAll('.strip-col')).map((c) => {
      const r = c.getBoundingClientRect();
      return r.left + r.width / 2;
    });
    const strip = document.querySelector('.strip-body')!.getBoundingClientRect();
    const staff = document.querySelector('.strip-staff svg')!.getBoundingClientRect();
    return {
      offset: Math.max(...heads.map((x, i) => Math.abs(x - cols[i]))),
      staffInside: staff.left >= strip.left - 0.5 && staff.right <= strip.right + 0.5,
      dock: shown('[data-testid="instrument-dock"]'),
      topbar: shown('.app-topbar'),
      menus: shown('.menu-popup') || shown('.explore-pickers'),
      // Screen-only bits: the In key / All / Build tabs, "Learn about this",
      // "Tap a note to hear it".
      screenOnly: [
        shown('[data-testid="chords-card"] [role="tablist"]'),
        Array.from(document.querySelectorAll('button')).some((b) => /Learn about this/.test(b.textContent ?? '') && b.getClientRects().length > 0),
        Array.from(document.querySelectorAll('.explore-card-hint span')).some((e) => /Tap a note/.test(e.textContent ?? '') && e.getClientRects().length > 0),
      ],
      // The chord's own small staff: hidden on the workbench screen, printed.
      parts: ['[data-testid="scale-strip"]', '[data-testid="chords-card"]', '[data-testid="circle-card"]', '[data-testid="key-facts"]', '[data-testid="chord-staff"]'].map(shown),
      ink: getComputedStyle(document.body).color,
      bg: getComputedStyle(document.body).backgroundColor,
    };
  });
  expect(p.offset, 'noteheads over their columns').toBeLessThan(3);
  expect(p.staffInside, 'the staff stays inside its strip').toBe(true);
  expect([p.dock, p.topbar, p.menus]).toEqual([false, false, false]);
  expect(p.screenOnly, 'tabs, "Learn about this", the tap hint: not printed').toEqual([false, false, false]);
  expect(p.parts).toEqual([true, true, true, true, true]);
  expect([p.ink, p.bg]).toEqual(['rgb(17, 17, 17)', 'rgb(255, 255, 255)']);
  const pdf = await page.pdf({ format: 'A4' });
  expect(pdf.byteLength).toBeGreaterThan(10_000);
  await context.close();
});

test('phone, sheet at Half: a tapped chord\'s detail comes into view (▶ Chord on screen, above the sheet)', async ({ browser }) => {
  for (const [w, h] of [[390, 844], [360, 740]] as const) {
    const { context, page } = await open(browser, { w, h, touch: true, state: { dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true, learn: false } } });
    await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'half');
    await page.getByRole('button', { name: 'G Major chord, degree 5' }).tap();
    const play = page.getByTestId('chord-detail').getByRole('button', { name: 'Chord', exact: true });
    await expect(play).toBeVisible();
    await page.waitForTimeout(700); // the smooth scroll
    const r = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('[data-testid="chord-detail"] button')).find((e) => e.textContent?.trim() === 'Chord')!.getBoundingClientRect();
      const sheet = document.querySelector('[data-testid="instrument-dock"]')!.getBoundingClientRect();
      const main = document.getElementById('main-content')!.getBoundingClientRect();
      return { top: b.top, bottom: b.bottom, viewTop: main.top, sheetTop: sheet.top };
    });
    expect(r.top, `${w}: ▶ Chord below the top of the view`).toBeGreaterThanOrEqual(r.viewTop - 1);
    expect(r.bottom, `${w}: ▶ Chord above the sheet`).toBeLessThanOrEqual(r.sheetTop + 1);
    await context.close();
  }
});

test('a phone sideways rests Explore\'s dock at Peek until the learner sets it; then their choice stays', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 844, h: 390, touch: true });
  const dock = page.getByTestId('instrument-dock');
  await expect(dock).toHaveAttribute('data-detent', 'peek');
  expect((await page.locator('#main-content').boundingBox())!.height).toBeGreaterThan(200);
  // The learner opens it: remembered across a reload.
  const handle = page.getByRole('separator', { name: 'Instrument panel' });
  await handle.focus();
  await page.keyboard.press('ArrowUp');
  await expect(dock).toHaveAttribute('data-detent', 'half');
  await page.reload();
  await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'half');
  await context.close();
  // Upright, a first visit opens at Half as before.
  const tall = await open(browser, { w: 390, h: 844, touch: true });
  await expect(tall.page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'half');
  await tall.context.close();
});

test('with a chord on the fretboard, the scale\'s other notes stay in view, faded and unlabelled — dock and full neck', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 844, h: 390, touch: true, state: { instrument: 'guitar' } });
  await page.getByRole('button', { name: 'G Major chord, degree 5' }).tap();
  await page.getByTestId('neck-open').tap();
  const neck = page.getByTestId('neck-view');
  await expect(neck.locator('[data-dot="voicing"]').first()).toBeVisible({ timeout: 15_000 });
  const dots = await neck.evaluate((root) => {
    const ctx = Array.from(root.querySelectorAll('[data-dot="context"]'));
    return {
      context: ctx.length,
      labelled: ctx.filter((d) => (d.textContent ?? '').trim() !== '').length,
      faded: ctx.every((d) => Number(getComputedStyle(d).opacity) < 0.6),
      voicing: root.querySelectorAll('[data-dot="voicing"]').length,
      // No faded dot where the shape already has one.
      overlap: ctx.filter((d) => d.parentElement?.querySelector('[data-dot="voicing"]')).length,
    };
  });
  expect(dots.voicing).toBeGreaterThan(0);
  expect(dots.context).toBeGreaterThan(10);
  expect(dots.labelled).toBe(0);
  expect(dots.faded).toBe(true);
  expect(dots.overlap).toBe(0);
  await context.close();
});
