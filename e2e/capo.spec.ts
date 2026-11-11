import { test, expect, type Browser, type Locator, type Page } from '@playwright/test';

/**
 * Wave 2, stream C: a capo on the guitar neck, in a real browser — phone,
 * phone held sideways (the full-neck view) and laptop. Put it on in Settings
 * (Guitar neck → Capo); the board draws it across all six strings with
 * nothing behind it; B♭ is played as the open G shape at the capo and the
 * line names both; a tap at the capo sounds and names that fret; the board's
 * own "Capo 3" control changes it; a reload keeps it (one optional field in
 * the save); taking it off returns the board and the save as they were.
 */

const VIEWS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
type View = (typeof VIEWS)[number];

const SAVE = {
  instrument: 'guitar', lastView: 'explore', language: 'en', themeMode: 'fermata',
  selectedKey: { natural: 'B', accidental: 'b' }, selectedScale: 'major', guitarScalePosition: 'all',
};

async function contextFor(browser: Browser, v: View) {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('capo-seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('capo-seeded', '1');
  }, JSON.stringify({ state: SAVE, version: 6 }));
  return { context, page: await context.newPage() };
}

const savedState = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state as Record<string, unknown>);

async function putOnInSettings(page: Page, fret: number) {
  await page.getByRole('button', { name: /^More/ }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Settings' });
  const select = dialog.getByTestId('capo-setting').getByRole('combobox', { name: 'Capo' });
  await select.scrollIntoViewIfNeeded();
  await expect(select).toHaveValue('0');
  await select.selectOption(String(fret));
  await expect(select).toHaveValue(String(fret));
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toHaveCount(0);
}

/** What a board draws: capo bars, dots and buttons, by fret. */
async function drawn(board: Locator) {
  return board.evaluate((root) => {
    const fretOf = (el: Element) => Number(el.closest('[data-fret]')?.getAttribute('data-fret') ?? (el.closest('[data-open-string]') ? 0 : -1));
    return {
      bars: Array.from(root.querySelectorAll('[data-capo-bar]')).map(fretOf),
      dotFrets: Array.from(root.querySelectorAll<HTMLElement>('[data-dot]')).map((d) => Number(d.dataset.dotFret)),
      outOfPlay: Array.from(root.querySelectorAll('[data-out-of-play]')).map((c) => ({ fret: fretOf(c), hidden: c.getAttribute('aria-hidden'), role: c.getAttribute('role') })),
      buttonFrets: Array.from(root.querySelectorAll('[role="button"][data-fret]')).map((b) => Number(b.getAttribute('data-fret'))),
      voicing: Object.fromEntries(Array.from(root.querySelectorAll<HTMLElement>('[data-dot="voicing"]')).map((d) => [d.dataset.dotString, Number(d.dataset.dotFret)])),
    };
  });
}

function expectNothingBehind(d: Awaited<ReturnType<typeof drawn>>, capo: number, where: string) {
  expect(d.bars, `${where}: the capo on every string`).toEqual(Array(6).fill(capo));
  expect(d.dotFrets.filter((f) => f < capo), `${where}: no dot behind the capo`).toEqual([]);
  expect(d.buttonFrets.filter((f) => f < capo), `${where}: nothing tappable behind the capo`).toEqual([]);
  expect(d.outOfPlay.length, `${where}: frets behind the capo drawn out of play`).toBeGreaterThan(0);
  for (const c of d.outOfPlay) {
    expect(c.fret).toBeLessThan(capo);
    expect(c.hidden).toBe('true');
    expect(c.role).toBeNull();
  }
}

async function pickBflat(page: Page) {
  await page.getByRole('button', { name: 'Bb Major chord, degree 1' }).click();
}

/** Phones: the sheet to Full, so the whole board is on screen. */
async function sheetFull(page: Page, v: View) {
  if (!v.touch || v.name === 'landscape') return;
  await page.getByRole('separator', { name: 'Instrument panel' }).focus();
  await page.keyboard.press('End');
  await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'full');
}

for (const v of VIEWS) {
  test(`${v.name}: put on in Settings, drawn and heard truthfully, changed on the board, kept by a reload, taken off`, async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await contextFor(browser, v);
    const samples: string[] = [];
    page.on('request', (r) => { if (/\/samples\/guitar\//.test(r.url())) samples.push(r.url()); });
    await page.goto('/');
    const dock = page.getByTestId('instrument-dock');
    await expect(dock.locator('[role="grid"]')).toBeVisible({ timeout: 15_000 });
    // No capo: none of it on the board.
    await expect(dock.locator('[data-capo-bar], [data-out-of-play], [data-testid="capo-control"]')).toHaveCount(0);
    const before = await savedState(page);
    expect(before).not.toHaveProperty('capoFret');

    await putOnInSettings(page, 3);
    expect((await savedState(page)).capoFret).toBe(3);
    await expect(dock.getByTestId('capo-control')).toHaveValue('3');
    await expect(page.getByTestId('dock-readout')).toContainText('Whole neck · Capo 3');
    expectNothingBehind(await drawn(dock), 3, `${v.name} whole neck`);

    // B♭ major: the open G shape at the capo, and the line naming both.
    await pickBflat(page);
    await expect(dock.getByTestId('capo-line')).toHaveText('B♭: the G shape, capo on fret 3');
    await sheetFull(page, v);
    const chord = await drawn(dock);
    expectNothingBehind(chord, 3, `${v.name} B♭`);
    expect(chord.voicing).toEqual({ 0: 6, 1: 5, 2: 3, 3: 3, 4: 3, 5: 6 });

    // A tap at the capo on string 3 (G3 + 3 = B♭3): sounded, named by its
    // real fret. (Sideways the docked board rests at Peek: the tap is made on
    // the full neck below.)
    if (v.name !== 'landscape') {
      const atCapo = dock.locator('[data-string-row="3"][data-fret="3"]');
      await expect(atCapo).toHaveAttribute('aria-label', 'Bb, fret 3, string 3, at the capo');
      if (v.touch) await atCapo.tap();
      else await atCapo.click();
      await expect(page.getByTestId('dock-readout')).toContainText('string 3 fret 3 (capo)');
      await expect.poll(() => samples.length, { message: 'the tap sounds' }).toBeGreaterThan(0);
    }

    if (v.name === 'landscape') {
      // The full neck: the capo, its control in the header, the line.
      await page.getByTestId('neck-open').click();
      const neck = page.getByTestId('neck-view');
      await expect(neck.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
      await expect(neck.getByTestId('capo-line')).toHaveText('B♭: the G shape, capo on fret 3');
      expectNothingBehind(await drawn(neck), 3, 'full neck');
      const rows = await neck.locator('[data-dock-row="string"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().bottom));
      for (const b of rows) expect(b).toBeLessThanOrEqual(v.viewport.height + 0.5);
      const atCapo = neck.locator('[data-string-row="3"][data-fret="3"]');
      await expect(atCapo).toHaveAttribute('aria-label', 'Bb, fret 3, string 3, at the capo');
      await atCapo.tap();
      await expect.poll(() => samples.length, { message: 'the tap sounds' }).toBeGreaterThan(0);
      // Nothing behind the capo answers a tap.
      const before = samples.length;
      await neck.locator('[data-string-row="3"][data-fret="1"]').tap({ force: true });
      await page.waitForTimeout(300);
      expect(samples.length).toBe(before);
      // Changed from the full neck's own control.
      await neck.getByTestId('capo-control').selectOption('5');
      await expect(neck.getByTestId('capo-line')).toHaveText('B♭: the F shape, capo on fret 5');
      expectNothingBehind(await drawn(neck), 5, 'full neck capo 5');
      await page.getByRole('button', { name: 'Close full neck' }).click();
      await expect(neck).toHaveCount(0);
    } else {
      // Changed on the board, without opening Settings.
      await dock.getByTestId('capo-control').selectOption('5');
      await expect(dock.getByTestId('capo-line')).toHaveText('B♭: the F shape, capo on fret 5');
      expectNothingBehind(await drawn(dock), 5, `${v.name} capo 5`);
    }
    // F's E-shape barre (1 3 3 2 1 1) five frets up.
    expect((await drawn(dock)).voicing).toEqual({ 0: 6, 1: 8, 2: 8, 3: 7, 4: 6, 5: 6 });
    expect((await savedState(page)).capoFret).toBe(5);

    // A reload keeps it.
    await page.reload();
    await expect(dock.locator('[role="grid"]')).toBeVisible({ timeout: 15_000 });
    await expect(dock.getByTestId('capo-control')).toHaveValue('5');
    expectNothingBehind(await drawn(dock), 5, `${v.name} after reload`);

    // Taken off on the board (sideways: on the full neck, where the board
    // is): the board as before, focus on it, the save without the field.
    await sheetFull(page, v);
    if (v.name === 'landscape') {
      await page.getByTestId('neck-open').click();
      const neck = page.getByTestId('neck-view');
      await expect(neck.locator('[data-dock-row="string"]')).toHaveCount(6, { timeout: 15_000 });
      await neck.getByTestId('capo-control').selectOption('0');
      await expect(neck.locator('[data-capo-bar], [data-out-of-play], [data-testid="capo-control"]')).toHaveCount(0);
      await expect(neck.locator('[role="grid"]')).toBeFocused();
      await page.getByRole('button', { name: 'Close full neck' }).click();
    } else {
      await dock.getByTestId('capo-control').selectOption('0');
      await expect(dock.locator('[role="grid"]')).toBeFocused();
    }
    await expect(dock.locator('[data-capo-bar], [data-out-of-play], [data-testid="capo-control"]')).toHaveCount(0);
    const after = await savedState(page);
    expect(after).not.toHaveProperty('capoFret');
    // Everything else as before (the time stamp and the sheet the test moved aside).
    const strip = ({ preferencesUpdatedAt: _p, dockDetents: _d, dockChosen: _c, ...rest }: Record<string, unknown>) => { void _p; void _d; void _c; return rest; };
    const restAfter = strip(after);
    const restBefore = strip(before);
    expect(restAfter).toEqual(restBefore);
    await context.close();
  });
}

test('Learn draws the neck without the capo; Explore keeps it', async ({ browser }) => {
  const v = VIEWS[2];
  const { context, page } = await contextFor(browser, v);
  await page.goto('/');
  const dock = page.getByTestId('instrument-dock');
  await expect(dock.locator('[role="grid"]')).toBeVisible({ timeout: 15_000 });
  await putOnInSettings(page, 2);
  await expect(dock.locator('[data-capo-bar]')).toHaveCount(6);
  await page.getByRole('tab', { name: 'Learn' }).click();
  await page.waitForTimeout(600);
  await expect(page.locator('[data-capo-bar], [data-out-of-play], [data-testid="capo-control"]')).toHaveCount(0);
  await page.getByRole('tab', { name: 'Explore' }).click();
  await expect(dock.locator('[data-capo-bar]')).toHaveCount(6, { timeout: 10_000 });
  await context.close();
});
