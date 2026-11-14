import { test, expect, type Browser, type Locator, type Page } from '@playwright/test';
import { readingSave } from './helpers/readingDrill';

/**
 * Brief D (2026-11-10): the guitar neck the way the player knows it.
 * Settings → Guitar neck: nut on the left / right, thin / thick string on top.
 * Since 2026-11-14 a browser with no saved settings starts as you see the
 * neck facing a player — nut RIGHT, thick string on top, the legacy view —
 * and saves nothing about the neck; a save from 10–14 November that holds
 * the tab view (nut left, thin string on top) keeps it. For each
 * combination, at phone, landscape and laptop: chosen in Settings, it
 * survives a reload; at first paint all six strings and the nut are in view
 * and the fret numbers rise away from the nut; tapping a DRAWN cell (found by
 * its place on screen, not its data) sounds and names that string and fret;
 * the full-neck view and the practice neck agree with the dock. "Flip neck"
 * on the board (2026-11-14) mirrors both settings at once. The Drill reading
 * board grades a tap in the default view and in the tab view.
 */

const VIEWS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
type View = (typeof VIEWS)[number];
const COMBOS = [['left', 'high'], ['left', 'low'], ['right', 'high'], ['right', 'low']] as const;
type Nut = 'left' | 'right';
type Top = 'high' | 'low';

const NUT_LABEL = { left: 'Nut on the left', right: 'Nut on the right' } as const;
const TOP_LABEL = { high: 'Thin string on top', low: 'Thick string on top' } as const;

async function contextFor(browser: Browser, v: View, settings: Record<string, unknown> | null, drill?: object) {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(([blob, drillBlob]) => {
    if (sessionStorage.getItem('neck-seeded')) return;
    localStorage.removeItem('music-theory-app'); // the config's legacy seed
    if (blob) localStorage.setItem('music-theory-app', blob);
    if (drillBlob) localStorage.setItem('fermata-drill-v1', drillBlob);
    sessionStorage.setItem('neck-seeded', '1');
  }, [settings ? JSON.stringify({ state: settings, version: 6 }) : '', drill ? JSON.stringify(drill) : ''] as const);
  const page = await context.newPage();
  return { context, page };
}

const guitarSave = (v: View, nut: Nut, top: Top) => ({
  instrument: 'guitar', lastView: 'explore', language: 'en', themeMode: 'fermata',
  selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', guitarScalePosition: 'all',
  // Phones: the sheet at Full, so the board is on screen.
  ...(v.touch ? { dockDetents: { explore: 'full', learn: 'peek' }, dockChosen: { explore: true, learn: false } } : {}),
  neckNutSide: nut, neckTopString: top,
});

/** The same save with no neck field at all (the default view, nothing saved about the neck). */
const guitarSaveNoNeck = (v: View) => {
  const { neckNutSide: _n, neckTopString: _t, ...rest } = guitarSave(v, 'right', 'low');
  return rest;
};

/** What a board draws, from its geometry and what it SAYS (aria-labels), not its data attributes. */
async function measure(board: Locator) {
  return board.evaluate((root) => {
    const box = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    };
    const rows = Array.from(root.querySelectorAll('[data-dock-row="string"]')).map((row) => {
      const cells = Array.from(row.querySelectorAll('[role="button"][aria-label*=", fret "]'));
      const open = row.querySelector('[data-open-string]')!;
      // The nut is the open string's neighbour on the frets' side.
      const nut = open.previousElementSibling ?? open.nextElementSibling!;
      const said = /string (\d)$/.exec(cells[0].getAttribute('aria-label')!)![1];
      return { string: Number(said), row: box(row), open: box(open), nut: box(nut), firstCell: box(cells[0]), lastCell: box(cells[cells.length - 1]) };
    });
    return { rows, vw: innerWidth, vh: innerHeight };
  });
}

/** Fret numbers in screen order (left to right). */
async function fretNumbersOnScreen(row: Locator) {
  const labels = await row.evaluate((el) => Array.from(el.querySelectorAll('div, span'))
    .filter((d) => d.children.length === 0 && /^\d+$/.test(d.textContent ?? ''))
    .map((d) => { const r = d.getBoundingClientRect(); return { n: Number(d.textContent), x: r.left + r.width / 2, w: r.width }; }));
  return labels.sort((a, b) => a.x - b.x);
}

function expectOrientation(m: Awaited<ReturnType<typeof measure>>, nut: Nut, top: Top, where: string) {
  const rows = [...m.rows].sort((a, b) => a.row.top - b.row.top);
  expect(rows.map((r) => r.string), `${where}: strings top to bottom`).toEqual(top === 'high' ? [1, 2, 3, 4, 5, 6] : [6, 5, 4, 3, 2, 1]);
  for (const r of rows) {
    // The open strings and the nut sit on the nut side of the frets.
    if (nut === 'left') expect(r.open.right, `${where}: open string left of the frets`).toBeLessThanOrEqual(Math.min(r.firstCell.left, r.lastCell.left) + 0.5);
    else expect(r.open.left, `${where}: open string right of the frets`).toBeGreaterThanOrEqual(Math.max(r.firstCell.right, r.lastCell.right) - 0.5);
  }
}

const ascending = (xs: number[]) => xs.every((x, i) => i === 0 || xs[i - 1] < x);

async function chooseInSettings(page: Page, nut: Nut, top: Top) {
  await page.getByRole('button', { name: /^More/ }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Settings' });
  const row = dialog.getByTestId('neck-settings');
  await expect(row).toContainText('The nut is where the open strings start. Guitar tab usually puts the thin string on top.');
  await row.getByRole('radio', { name: NUT_LABEL[nut] }).click();
  await row.getByRole('radio', { name: TOP_LABEL[top] }).click();
  await expect(row.getByRole('radio', { name: NUT_LABEL[nut] })).toHaveAttribute('aria-checked', 'true');
  await expect(row.getByRole('radio', { name: TOP_LABEL[top] })).toHaveAttribute('aria-checked', 'true');
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toHaveCount(0);
}

const flip = { left: 'right', right: 'left', high: 'low', low: 'high' } as const;

for (const v of VIEWS) {
  for (const [nut, top] of COMBOS) {
    test(`${v.name}: nut ${nut}, ${top === 'high' ? 'thin' : 'thick'} string on top — chosen, reloaded, in view, hit-tested, full neck and practice agree`, async ({ browser }) => {
      test.setTimeout(90_000);
      // Start from the OTHER view on both axes, then choose this one.
      const { context, page } = await contextFor(browser, v, guitarSave(v, flip[nut], flip[top]));
      await page.goto('/');
      const grid = page.locator('[role="grid"]').first();
      await expect(grid).toBeVisible({ timeout: 15_000 });
      await chooseInSettings(page, nut, top);
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state);
      // The old view is saved by leaving the field out (store.ts).
      expect(saved.neckNutSide).toBe(nut === 'left' ? 'left' : undefined);
      expect(saved.neckTopString).toBe(top === 'high' ? 'high' : undefined);

      await page.reload();
      await expect(grid).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(500);
      const where = `${v.name} ${nut}/${top}`;

      // First paint: all six strings and the nut in view (the whole neck is
      // wider than a phone: it opens at the nut end).
      const m = await measure(page.getByTestId('instrument-dock'));
      expect(m.rows).toHaveLength(6);
      expectOrientation(m, nut, top, where);
      const gridBox = (await grid.boundingBox())!;
      for (const r of m.rows) {
        expect(r.row.top, `${where}: string ${r.string} in view`).toBeGreaterThanOrEqual(-0.5);
        expect(r.row.bottom, `${where}: string ${r.string} in view`).toBeLessThanOrEqual(m.vh + 0.5);
        for (const part of [r.open, r.nut]) {
          expect(part.left, `${where}: nut end of string ${r.string} in view`).toBeGreaterThanOrEqual(Math.max(0, gridBox.x) - 0.5);
          expect(part.right, `${where}: nut end of string ${r.string} in view`).toBeLessThanOrEqual(Math.min(m.vw, gridBox.x + gridBox.width) + 0.5);
        }
      }
      // Fret numbers rise away from the nut.
      const numbers = await fretNumbersOnScreen(page.locator('[data-dock-row="frets"]').first());
      const fretted = numbers.filter((n) => n.n > 0).map((n) => n.n);
      expect(ascending(nut === 'left' ? fretted : [...fretted].reverse()), `${where}: ${fretted}`).toBe(true);
      expect(nut === 'left' ? fretted[0] : fretted.at(-1)).toBe(1);

      // Hit-testing: the cell DRAWN on the second string from the top, under
      // the "3", sounds and names that string and fret.
      const samples: string[] = [];
      page.on('request', (r) => { if (/\/samples\/guitar\//.test(r.url())) samples.push(r.url()); });
      const rowsByY = [...m.rows].sort((a, b) => a.row.top - b.row.top);
      const three = numbers.find((n) => n.n === 3)!;
      const x = three.x;
      const y = rowsByY[1].row.cy;
      if (v.touch) await page.touchscreen.tap(x, y);
      else await page.mouse.click(x, y);
      const expectedString = top === 'high' ? 2 : 5;
      await expect(page.getByTestId('dock-readout')).toContainText(new RegExp(` · string ${expectedString} fret 3(,|$)`));
      await expect(page.locator(`[aria-label$=", fret 3, string ${expectedString}"][data-focus-note]`)).toHaveCount(1);
      await expect.poll(() => samples.length, { message: `${where}: the tap sounds` }).toBeGreaterThan(0);

      // The full-neck view (a phone held sideways) agrees with the dock.
      if (v.name === 'landscape') {
        await page.getByTestId('neck-open').click();
        const neck = page.getByTestId('neck-view');
        await expect(neck.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
        await page.waitForTimeout(300);
        const nm = await measure(neck);
        expectOrientation(nm, nut, top, `${where} full neck`);
        for (const r of nm.rows) expect(r.row.bottom).toBeLessThanOrEqual(nm.vh + 0.5);
        const neckNumbers = (await fretNumbersOnScreen(neck.locator('[data-dock-row="frets"]'))).filter((n) => n.n > 0).map((n) => n.n);
        expect(ascending(nut === 'left' ? neckNumbers : [...neckNumbers].reverse())).toBe(true);
        await page.getByRole('button', { name: 'Close full neck' }).click();
        await expect(neck).toHaveCount(0);
      }

      // The practice sheet's neck agrees too (the phone sheet lowered to
      // Peek first: at Full the view under it is inert).
      if (v.touch) {
        await page.getByRole('separator', { name: 'Instrument panel' }).focus();
        await page.keyboard.press('Home');
        await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'peek');
      }
      await page.getByTestId('practice-open').click();
      const sheet = page.getByTestId('practice-sheet');
      const practiceNeck = sheet.getByTestId('practice-neck');
      await expect(practiceNeck.locator('[data-dock-row="string"]')).toHaveCount(6);
      const pm = await measure(practiceNeck);
      expectOrientation(pm, nut, top, `${where} practice`);
      const header = practiceNeck.locator(':scope > .flex.text-caption');
      const practiceNumbers = (await fretNumbersOnScreen(header)).map((n) => n.n);
      expect(ascending(nut === 'left' ? practiceNumbers : [...practiceNumbers].reverse()), `${where} practice: ${practiceNumbers}`).toBe(true);
      await sheet.getByRole('button', { name: 'Close', exact: true }).click();
      await context.close();
    });
  }

  test(`${v.name}: a browser with no saved settings draws the view facing a player everywhere, saves nothing about the neck, and keeps it`, async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await contextFor(browser, v, null);
    await page.goto('/');
    await page.getByRole('radio', { name: 'Guitar' }).click();
    await expect(page.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
    await page.waitForTimeout(400);
    expectOrientation(await measure(page.getByTestId('instrument-dock')), 'right', 'low', `${v.name} default`);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state);
    expect(saved.instrument).toBe('guitar'); // the save exists…
    expect(saved).not.toHaveProperty('neckNutSide'); // …with nothing about the neck
    expect(saved).not.toHaveProperty('neckTopString');
    // (A phone on its side rests at Peek, where the sheet's content is inert: read the attribute.)
    await expect(page.getByTestId('flip-neck')).toHaveAttribute('aria-label', 'Flip neck. Now: nut on the right, thick string on top.');
    await page.reload();
    await expect(page.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
    await page.waitForTimeout(400);
    expectOrientation(await measure(page.getByTestId('instrument-dock')), 'right', 'low', `${v.name} default, reloaded`);
    // The landscape full neck agrees.
    if (v.name === 'landscape') {
      await page.getByTestId('neck-open').click();
      const neck = page.getByTestId('neck-view');
      await expect(neck.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
      await page.waitForTimeout(300);
      expectOrientation(await measure(neck), 'right', 'low', `${v.name} default full neck`);
      await expect(neck.getByTestId('flip-neck')).toHaveCount(0); // the full neck has no controls row
      await page.getByRole('button', { name: 'Close full neck' }).click();
      await expect(neck).toHaveCount(0);
    }
    // The practice sheet's neck agrees (the phone sheet lowered to Peek first).
    if (v.touch) {
      await page.getByRole('separator', { name: 'Instrument panel' }).focus();
      await page.keyboard.press('Home');
      await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'peek');
    }
    await page.getByTestId('practice-open').click();
    const sheet = page.getByTestId('practice-sheet');
    await expect(sheet.getByTestId('practice-neck').locator('[data-dock-row="string"]')).toHaveCount(6);
    expectOrientation(await measure(sheet.getByTestId('practice-neck')), 'right', 'low', `${v.name} default practice`);
    await expect(sheet.getByTestId('flip-neck')).toHaveCount(0);
    await sheet.getByRole('button', { name: 'Close', exact: true }).click();
    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    const row = page.getByTestId('neck-settings');
    await expect(row.getByRole('radio', { name: 'Nut on the right' })).toHaveAttribute('aria-checked', 'true');
    await expect(row.getByRole('radio', { name: 'Thick string on top' })).toHaveAttribute('aria-checked', 'true');
    // Still nothing about the neck saved after all that.
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state);
    expect(after).not.toHaveProperty('neckNutSide');
    expect(after).not.toHaveProperty('neckTopString');
    await context.close();
  });

  test(`${v.name}: "Flip neck" turns the dock and the practice neck to the tab view and back, keeps keyboard focus, and a reload keeps the choice`, async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await contextFor(browser, v, guitarSaveNoNeck(v));
    await page.goto('/');
    const dock = page.getByTestId('instrument-dock');
    await expect(dock.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
    await page.waitForTimeout(400);
    expectOrientation(await measure(dock), 'right', 'low', `${v.name} before the flip`);
    const flip = page.getByTestId('flip-neck');
    // A real click (a tap on touch screens).
    if (v.touch) await flip.tap();
    else await flip.click();
    await expect(flip).toBeFocused();
    await expect(flip).toHaveAccessibleName('Flip neck. Now: nut on the left, thin string on top.');
    await page.waitForTimeout(400);
    expectOrientation(await measure(dock), 'left', 'high', `${v.name} flipped`);
    let saved = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state);
    expect(saved).toMatchObject({ neckNutSide: 'left', neckTopString: 'high' });
    // The practice sheet's neck follows (the phone sheet lowered to Peek first).
    if (v.touch) {
      await page.getByRole('separator', { name: 'Instrument panel' }).focus();
      await page.keyboard.press('Home');
      await expect(dock).toHaveAttribute('data-detent', 'peek');
    }
    await page.getByTestId('practice-open').click();
    const sheet = page.getByTestId('practice-sheet');
    await expect(sheet.getByTestId('practice-neck').locator('[data-dock-row="string"]')).toHaveCount(6);
    expectOrientation(await measure(sheet.getByTestId('practice-neck')), 'left', 'high', `${v.name} flipped practice`);
    await sheet.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(sheet).toHaveCount(0);
    // The phone sheet back to Full, so the button is reachable after the reload.
    if (v.touch) {
      await page.getByRole('separator', { name: 'Instrument panel' }).focus();
      await page.keyboard.press('End');
      await expect(dock).toHaveAttribute('data-detent', 'full');
    }
    // A reload keeps the tab view.
    await page.reload();
    await expect(dock.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
    await page.waitForTimeout(400);
    expectOrientation(await measure(dock), 'left', 'high', `${v.name} flipped, reloaded`);
    // Back with the keyboard: Enter on the focused button; focus stays on it.
    await flip.focus();
    await page.keyboard.press('Enter');
    await expect(flip).toBeFocused();
    await expect(flip).toHaveAccessibleName('Flip neck. Now: nut on the right, thick string on top.');
    await page.waitForTimeout(400);
    expectOrientation(await measure(dock), 'right', 'low', `${v.name} flipped back`);
    saved = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state);
    // Back at the default view, the save says nothing about the neck again.
    expect(saved).not.toHaveProperty('neckNutSide');
    expect(saved).not.toHaveProperty('neckTopString');
    await context.close();
  });

  test(`${v.name}: a save holding the tab view (a visitor of 10–14 November) keeps it, untouched`, async ({ browser }) => {
    const save = guitarSave(v, 'left', 'high');
    const { context, page } = await contextFor(browser, v, save);
    await page.goto('/');
    const dock = page.getByTestId('instrument-dock');
    await expect(dock.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
    await page.waitForTimeout(400);
    expectOrientation(await measure(dock), 'left', 'high', `${v.name} saved tab view`);
    await expect(page.getByTestId('flip-neck')).toHaveAccessibleName('Flip neck. Now: nut on the left, thin string on top.');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state);
    expect(saved).toMatchObject({ neckNutSide: 'left', neckTopString: 'high' });
    if (v.name === 'landscape') {
      await page.getByTestId('neck-open').click();
      const neck = page.getByTestId('neck-view');
      await expect(neck.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
      await page.waitForTimeout(300);
      expectOrientation(await measure(neck), 'left', 'high', `${v.name} saved tab view, full neck`);
      await page.getByRole('button', { name: 'Close full neck' }).click();
    }
    await context.close();
  });
}

for (const v of VIEWS.filter((x) => x.name !== 'landscape')) {
  for (const [what, settings, nut, top] of [
    ['the default view, nothing saved (nut right, thick string on top)', null, 'right', 'low'],
    ['the tab view, saved (nut left, thin string on top)', { neckNutSide: 'left', neckTopString: 'high' }, 'left', 'high'],
  ] as const) {
    test(`${v.name}: the Drill reading board grades a tap in ${what}`, async ({ browser }) => {
      // Drill is reached by its tab.
      const { context, page } = await contextFor(browser, v, settings, readingSave());
      await page.goto('/');
      await page.getByRole('tab', { name: 'Drill' }).click();
      const board = page.getByTestId('reading-board');
      await expect(board).toBeVisible({ timeout: 15_000 });
      await expect(page.getByText('Where is this note in position V?')).toBeVisible();
      await expect(page.getByTestId('reading-corner')).toHaveText(top === 'high' ? '①–⑥' : '⑥–①');
      await expect(page.getByTestId('reading-corner')).toHaveAttribute('aria-label', top === 'high' ? 'Strings 1 to 6' : 'Strings 6 to 1');
      await page.waitForTimeout(300);
      // Strings top to bottom; fret numbers rise away from the open strings.
      const rows = await board.locator('[data-reading-string]').evaluateAll((els) => els.map((e) => ({ s: Number(e.textContent), y: e.getBoundingClientRect().top + e.getBoundingClientRect().height / 2 })));
      expect([...rows].sort((a, b) => a.y - b.y).map((r) => r.s)).toEqual(top === 'high' ? [1, 2, 3, 4, 5, 6] : [6, 5, 4, 3, 2, 1]);
      const numbers = await fretNumbersOnScreen(board.locator('[data-testid="reading-corner"]').locator('..'));
      const order = numbers.map((n) => n.n);
      const fromNut = nut === 'left' ? order : [...order].reverse();
      expect(fromNut[0]).toBe(0);
      expect(ascending(fromNut), `${order}`).toBe(true);
      // C5 in position V is string 3, fret 5: tap the place DRAWN there.
      const x = numbers.find((n) => n.n === 5)!.x;
      const y = rows.find((r) => r.s === 3)!.y;
      if (v.touch) await page.touchscreen.tap(x, y);
      else await page.mouse.click(x, y);
      // Right: it advances on its own after 600 ms, and the log says so.
      await expect(page.getByText(/Where is this note in the open position/)).toBeVisible();
      const log = await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-drill-v1')!).state.activeSession.log.byFamily.read);
      expect(log).toEqual({ asked: 1, correct: 1 });
      // The board has no "Flip neck" (Drill has no controls row).
      await expect(page.getByTestId('flip-neck')).toHaveCount(0);
      await context.close();
    });
  }
}

/**
 * "Flip neck" adds NO height (the seat's hard requirement, 2026-11-14): the
 * dock (or the phone's sheet) and the controls row are exactly as tall with
 * the button as with it taken out of the page, in the same run — the tight
 * cases of the builder's sweep, in normal text and with the controls' text
 * 8 % wider (letter-spacing 0.04em, roughly how GitHub's Linux draws it).
 * Asserted only where the builder's measurement left at least 8 px on the
 * button's line with the wider text (a case near its limit would pass here and
 * fail under GitHub's wider text); the screens where a line IS added are
 * accepted and listed in CLAUDE.md, not asserted. The word shows beside "Edit
 * fingering" below 440 px and everywhere from 1280 px; elsewhere the glyph
 * stands alone in a --tap square. Nothing of the button is cut off, and it is
 * a full tap target.
 */
const FIT_CASES = [
  // Laptops from 1280 px: the word shows (least room, ES with wider text at 1280×800: 47 px).
  { w: 1280, h: 800, touch: false, lang: 'es', chord: false },
  { w: 1280, h: 800, touch: false, lang: 'pt', chord: true },
  { w: 1366, h: 768, touch: false, lang: 'es', chord: false },
  { w: 1440, h: 900, touch: false, lang: 'es', chord: false },
  { w: 1440, h: 900, touch: false, lang: 'pt', chord: true },
  { w: 1536, h: 864, touch: false, lang: 'en', chord: false },
  // 1024×768: the glyph alone (at least 116 px left).
  { w: 1024, h: 768, touch: false, lang: 'es', chord: false },
  { w: 1024, h: 768, touch: false, lang: 'pt', chord: true },
  // A phone on its side, scale view (at least 59 px left; with a chord a line is added inside the capped sheet — accepted, not asserted).
  { w: 844, h: 390, touch: true, lang: 'es', chord: false, detent: 'half' },
  { w: 844, h: 390, touch: true, lang: 'pt', chord: false, detent: 'full' },
  // Phones: the word beside "Edit fingering", the glyph before the tuning.
  { w: 390, h: 844, touch: true, lang: 'pt', chord: false, detent: 'half' },
  { w: 390, h: 844, touch: true, lang: 'pt', chord: false, detent: 'full' },
  { w: 390, h: 844, touch: true, lang: 'es', chord: true, detent: 'full' },
  { w: 360, h: 740, touch: true, lang: 'es', chord: true, detent: 'half' },
  { w: 360, h: 740, touch: true, lang: 'pt', chord: false, detent: 'full' },
  // 320 px: PT / ES in the scale view keep only 4–5 px with the wider text — too near the limit to assert; EN keeps 47.
  { w: 320, h: 568, touch: true, lang: 'en', chord: false, detent: 'half' },
  { w: 320, h: 568, touch: true, lang: 'pt', chord: true, detent: 'full' },
  { w: 320, h: 568, touch: true, lang: 'es', chord: true, detent: 'half' },
] as const;

for (const c of FIT_CASES) {
  const where = `${c.w}×${c.h}${'detent' in c ? ` ${c.detent}` : ''} ${c.lang} ${c.chord ? 'chord' : 'scale'}`;
  test(`${where}: "Flip neck" adds no height, normal text and 8 % wider; the word where it costs nothing`, async ({ browser }) => {
    test.setTimeout(60_000);
    for (const wide of [false, true]) {
      const context = await browser.newContext({ viewport: { width: c.w, height: c.h }, isMobile: c.touch, hasTouch: c.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
      await context.addInitScript((blob) => {
        if (sessionStorage.getItem('fit-seeded')) return;
        localStorage.setItem('music-theory-app', blob);
        sessionStorage.setItem('fit-seeded', '1');
      }, JSON.stringify({ state: {
        instrument: 'guitar', lastView: 'explore', language: c.lang, themeMode: 'fermata',
        selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
        ...('detent' in c ? { dockDetents: { explore: c.detent, learn: 'peek' }, dockChosen: { explore: true, learn: false } } : {}),
      }, version: 6 }));
      const page = await context.newPage();
      await page.goto('/');
      const flip = page.getByTestId('flip-neck');
      await expect(flip).toBeAttached({ timeout: 15_000 });
      if (c.chord) await page.locator('[data-tour="chord-row"] > button').first().evaluate((b: HTMLElement) => b.click());
      if (wide) await page.addStyleTag({ content: '.fretboard-controls, .fretboard-controls * { letter-spacing: 0.04em !important; }' });
      await page.waitForTimeout(800);
      const heights = () => page.evaluate(() => ({
        dock: document.querySelector('[data-testid="instrument-dock"]')!.getBoundingClientRect().height,
        row: document.querySelector('.fretboard-controls')!.getBoundingClientRect().height,
      }));
      const withIt = await heights();
      const button = await flip.evaluate((b) => {
        const word = b.querySelector('.flip-neck-word')!.getBoundingClientRect();
        const tap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tap'));
        const r = b.getBoundingClientRect();
        return { w: r.width, h: r.height, wordW: word.width, tap, clipped: b.scrollWidth > b.clientWidth + 0.5 };
      });
      expect(button.h, `${where}: a full tap target`).toBeGreaterThanOrEqual(button.tap - 0.5);
      expect(button.clipped, `${where}: nothing of the button cut off`).toBe(false);
      const place = await flip.getAttribute('data-place');
      expect(place, `${where}: beside "Edit fingering" in the scale view, before the tuning with a chord`).toBe(c.chord ? 'before-tuning' : 'after-edit');
      if (c.w >= 1280 || (c.w < 440 && place === 'after-edit')) expect(button.wordW, `${where}: the word shows`).toBeGreaterThan(20);
      else {
        expect(button.wordW, `${where}: the word is screen-reader only`).toBeLessThanOrEqual(1);
        expect(Math.abs(button.w - button.tap), `${where}: a --tap square`).toBeLessThan(0.5);
      }
      await flip.evaluate((b) => b.remove());
      await page.waitForTimeout(800);
      const without = await heights();
      expect(withIt.dock, `${where}${wide ? ' (text 8 % wider)' : ''}: dock / sheet height`).toBe(without.dock);
      expect(withIt.row, `${where}${wide ? ' (text 8 % wider)' : ''}: controls row height`).toBe(without.row);
      await context.close();
    }
  });
}
