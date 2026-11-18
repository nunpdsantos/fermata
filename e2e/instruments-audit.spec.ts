import { test, expect, type Browser, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { recordVoice, voiceLog } from './helpers/fakeMidi';

/**
 * QA audit of 18 November 2026, the instruments stream (builder D):
 *  - Q3: "Practise on the guitar" opened already scrolled down (134 px on a
 *    laptop), and again on every tab switch: the sheet opens at its top and
 *    stays there; only the chip strip scrolls sideways to its active chip.
 *  - A10: a bare click (assistive technology, element.click()) played no
 *    piano key: a mouse press, a touch, Enter, Space and a bare click each
 *    give exactly one note-on and one note-off, piano keys (white and black)
 *    and fretboard cells alike.
 *  - Q6: a chord above the nut named its starting fret twice ("2" and "2fr").
 *  - Q14: no octave pill is cut off at 320-430 px: the row fits, or it
 *    scrolls (its edge fade says so) and rests on whole pills.
 */

const practice = (lang: string) => JSON.parse(readFileSync(resolve(process.cwd(), `src/i18n/practice/${lang}.json`), 'utf8')) as { next: string };
const LANGS = ['en', 'pt', 'es'] as const;

async function open(browser: Browser, opts: { w: number; h: number; touch?: boolean; lang?: string; instrument?: 'piano' | 'guitar'; state?: Record<string, unknown> }) {
  const context = await browser.newContext({
    viewport: { width: opts.w, height: opts.h },
    isMobile: !!opts.touch,
    hasTouch: !!opts.touch,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
  });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({
    state: {
      language: opts.lang ?? 'en', lastView: 'explore', instrument: opts.instrument ?? 'piano', baseOctave: 4,
      selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
      ...(opts.touch ? { dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true, learn: false } } : {}),
      ...opts.state,
    },
    version: 6,
  }));
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

/** Two frames and a pause: whatever the app scrolls on mount has happened. */
const settle = (page: Page) => page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 400)))));

/** scrollTop of the window and of every element that scrolls vertically inside the sheet, itself included. */
const verticalScrolls = (sheet: Locator) => sheet.evaluate((root) => {
  const out: { el: string; top: number }[] = [{ el: 'window', top: Math.round(window.scrollY) }];
  const all = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
  for (let el: HTMLElement | null = root.parentElement; el; el = el.parentElement) all.push(el);
  for (const el of all) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) out.push({ el: `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 60), top: Math.round(el.scrollTop) });
  }
  return out;
});

// ─── Q3 ─────────────────────────────────────────────────────────────────────
for (const viewport of [{ w: 1440, h: 900 }, { w: 390, h: 844, touch: true }, { w: 844, h: 390, touch: true }]) {
  for (const lang of LANGS) {
    test(`Q3: the practice sheet opens at its top and stays there on every tab, ${viewport.w}×${viewport.h} ${lang}`, async ({ browser }) => {
      const { context, page } = await open(browser, { ...viewport, lang, instrument: 'guitar' });
      try {
        await page.getByTestId('practice-open').click();
        const sheet = page.getByTestId('practice-sheet');
        await expect(sheet.getByTestId('practice-player')).toBeVisible();
        await settle(page);
        const opened = await verticalScrolls(sheet);
        // Known positive: the sheet's body does scroll here (it is taller than its window).
        expect(opened.length, 'something in the sheet scrolls').toBeGreaterThan(1);
        expect(opened.map((s) => s.top), JSON.stringify(opened)).toEqual(opened.map(() => 0));
        for (const tab of ['walk', 'technical', 'rightHand', 'scales']) {
          await sheet.locator(`[id="practice-tab-${tab}"]`).click();
          await expect(sheet.getByTestId('practice-player')).toBeVisible();
          await settle(page);
          const after = await verticalScrolls(sheet);
          expect(after.map((s) => s.top), `${tab}: ${JSON.stringify(after)}`).toEqual(after.map(() => 0));
        }
        // The active chip is still brought into view sideways, and the sheet
        // stays where the learner left it (here: wherever showing "Next" took it).
        const next = sheet.getByRole('button', { name: practice(lang).next, exact: true });
        await next.scrollIntoViewIfNeeded();
        await settle(page);
        const shown = await verticalScrolls(sheet);
        const events = await sheet.locator('.practice-event').count();
        for (let i = 1; i < events; i++) await next.click();
        await settle(page);
        const strip = await sheet.locator('.practice-events').evaluate((el) => {
          const box = el.getBoundingClientRect();
          const chip = el.querySelector('[aria-current="step"]')!.getBoundingClientRect();
          return { scrolled: el.scrollLeft, overflows: el.scrollWidth > el.clientWidth + 1, inside: chip.left >= box.left - 1 && chip.right <= box.right + 1 };
        });
        expect(strip.overflows, 'the strip is wider than its window').toBe(true);
        expect(strip.scrolled, 'the strip scrolled sideways').toBeGreaterThan(0);
        expect(strip.inside, 'the active chip is inside the strip').toBe(true);
        expect(await verticalScrolls(sheet), 'stepping never scrolls the sheet').toEqual(shown);
      } finally {
        await context.close();
      }
    });
  }
}

// ─── A10 ────────────────────────────────────────────────────────────────────
type Op = { op: string; midi: number };
const ons = (log: Op[], midi: number) => log.filter((e) => e.midi === midi && e.op === 'start').length;
const offs = (log: Op[], midi: number) => log.filter((e) => e.midi === midi && e.op === 'stop').length;
const clearVoice = (page: Page) => page.evaluate(() => { (window as unknown as { __voice: unknown[] }).__voice.length = 0; });

async function expectOneNote(page: Page, midi: number, how: string, act: () => Promise<void>) {
  await clearVoice(page);
  await act();
  // A bare click holds its note briefly; a fretboard note rings 0.8 s.
  await page.waitForTimeout(1300);
  const log = await voiceLog(page);
  expect([ons(log, midi), offs(log, midi)], `${how} on ${midi}: ${JSON.stringify(log)}`).toEqual([1, 1]);
}

test('A10: a piano key, white and black, plays once for a mouse press, Enter, Space and a bare click (laptop)', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1440, h: 900 });
  try {
    test.skip(!(await recordVoice(page)), 'the voice recorder reads the dev server\'s modules');
    for (const midi of [60, 61]) {
      const key = page.locator(`[data-piano-key][data-midi="${midi}"]`).first();
      await key.scrollIntoViewIfNeeded();
      const box = (await key.boundingBox())!;
      // A white key's lower half is clear of the black keys.
      const at = { x: box.x + box.width / 2, y: box.y + box.height * (midi === 60 ? 0.85 : 0.5) };
      await expectOneNote(page, midi, 'mouse press', async () => { await page.mouse.click(at.x, at.y); });
      await expectOneNote(page, midi, 'Enter', async () => { await key.focus(); await page.keyboard.press('Enter'); });
      await expectOneNote(page, midi, 'Space', async () => { await key.focus(); await page.keyboard.press(' '); });
      await expectOneNote(page, midi, 'element.click()', async () => { await key.evaluate((el) => (el as HTMLElement).click()); });
    }
  } finally {
    await context.close();
  }
});

test('A10: a piano key, white and black, plays once for a touch and a bare click (phone)', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 390, h: 844, touch: true });
  try {
    test.skip(!(await recordVoice(page)), 'the voice recorder reads the dev server\'s modules');
    for (const midi of [60, 61]) {
      const key = page.locator(`[data-piano-key][data-midi="${midi}"]`).first();
      const box = (await key.boundingBox())!;
      await expectOneNote(page, midi, 'touch', async () => { await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height * (midi === 60 ? 0.85 : 0.5)); });
      await expectOneNote(page, midi, 'element.click()', async () => { await key.evaluate((el) => (el as HTMLElement).click()); });
    }
  } finally {
    await context.close();
  }
});

for (const viewport of [{ w: 1440, h: 900 }, { w: 390, h: 844, touch: true }]) {
  test(`A10: a fretboard cell plays once for each way of activating it, ${viewport.w}×${viewport.h}`, async ({ browser }) => {
    // Position V of C major: string 5 (A), fret 7 = E4… any drawn cell will do.
    const { context, page } = await open(browser, { ...viewport, instrument: 'guitar', state: { guitarScalePosition: 0 } });
    try {
      test.skip(!(await recordVoice(page)), 'the voice recorder reads the dev server\'s modules');
      // The open position: string 5 (A, index 1), fret 3 = C3 (MIDI 48).
      const cell = page.locator('[role="grid"] [data-string-row="1"][data-fret="3"][role="button"]').first();
      await expect(cell).toBeVisible();
      const midi = 48;
      if (viewport.touch) {
        const box = (await cell.boundingBox())!;
        await expectOneNote(page, midi, 'touch', async () => { await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); });
      } else {
        await expectOneNote(page, midi, 'mouse press', async () => { await cell.click(); });
      }
      await expectOneNote(page, midi, 'element.click()', async () => { await cell.evaluate((el) => (el as HTMLElement).click()); });
      // Enter / Space act on the board's keyboard cell: walk it to string 5, fret 3.
      const grid = page.locator('[role="grid"]').first();
      await grid.focus();
      await page.keyboard.press('ArrowDown'); // the first arrow puts the cell on the board
      const cellOf = () => page.evaluate(() => (document.querySelector('[role="grid"] [aria-live]') as HTMLElement).textContent ?? '');
      for (let i = 0; i < 12 && !/string 5.*fret 3|fret 3.*string 5/i.test(await cellOf()); i++) {
        const text = await cellOf();
        const string = Number(/string (\d)/i.exec(text)?.[1] ?? 6);
        const fret = Number(/fret (\d+)/i.exec(text)?.[1] ?? 0);
        if (string !== 5) await page.keyboard.press(string > 5 ? 'ArrowDown' : 'ArrowUp');
        else await page.keyboard.press(fret > 3 ? 'ArrowRight' : 'ArrowLeft');
      }
      expect(await cellOf()).toMatch(/string 5.*fret 3|fret 3.*string 5/i);
      await expectOneNote(page, midi, 'Enter', async () => { await page.keyboard.press('Enter'); });
      await expectOneNote(page, midi, 'Space', async () => { await page.keyboard.press(' '); });
    } finally {
      await context.close();
    }
  });
}

// ─── Q6 ─────────────────────────────────────────────────────────────────────
/** The fret-number row as a sighted learner reads it, left to right. */
const visibleFretRow = (page: Page) => page.locator('[data-dock-row="frets"]').first().evaluate((row) => {
  const words: string[] = [];
  const walk = (el: Element) => {
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        const box = (child.parentElement as HTMLElement).getBoundingClientRect();
        if (text && box.width > 1 && box.height > 1) words.push(text);
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child as Element);
    }
  };
  walk(row);
  return words.join(' ');
});

for (const nut of ['right', 'left'] as const) {
  test(`Q6: a chord above the nut names its starting fret once, nut on the ${nut}`, async ({ browser }) => {
    const { context, page } = await open(browser, {
      w: 1440, h: 900, instrument: 'guitar',
      state: { neckNutSide: nut, neckTopString: 'low' },
    });
    try {
      // I · C, then its A-shape barre at fret 3: the window starts at fret 2.
      await page.locator('.chord-row button').first().click();
      await page.getByRole('radiogroup', { name: 'Chord position' }).getByRole('radio', { name: 'A barre', exact: true }).click();
      await expect(page.locator('[data-dock-row="frets"]').first()).toBeVisible();
      const row = await visibleFretRow(page);
      expect(row).toBe(nut === 'right' ? '6 5 4 3 2' : '2 3 4 5 6');
      // The anchor badge keeps its meaning: the barre's fret, once, above the board.
      await expect(page.getByText('3fr', { exact: true })).toHaveCount(1);
      await expect(page.getByText('3fr', { exact: true })).toBeVisible();
    } finally {
      await context.close();
    }
  });
}

// ─── Q14 ────────────────────────────────────────────────────────────────────
for (const lang of LANGS) {
  test(`Q14: no octave pill is cut off from 320 to 430 px, ${lang}`, async ({ browser }) => {
    for (const w of [320, 344, 360, 375, 390, 400, 414, 430]) {
      const { context, page } = await open(browser, { w, h: 844, touch: true, lang });
      try {
        await page.waitForTimeout(300);
        const row = await page.locator('.piano-octave-row .chip-group').first().evaluate((g) => {
          const box = g.getBoundingClientRect();
          const chips = Array.from(g.querySelectorAll('.chip')).map((c) => c.getBoundingClientRect());
          const cut = chips.filter((c) => c.left < box.right - 0.5 && c.right > box.right + 0.5).length;
          return { cut, overflows: g.scrollWidth > g.clientWidth + 1, offScreen: box.right > innerWidth + 0.5, fade: g.parentElement!.hasAttribute('data-more-right') };
        });
        expect(row.offScreen, `${w}: the row stays on the screen`).toBe(false);
        expect(row.cut, `${w}: a pill is cut at the row's edge`).toBe(0);
        // A row that does not fit scrolls, and its fade says there is more.
        expect(row.fade, `${w}: the fade`).toBe(row.overflows);
        if (row.overflows) {
          await page.locator('.piano-octave-row .chip-group').first().evaluate((g) => { g.scrollLeft = g.scrollWidth; });
          await page.waitForTimeout(150);
          const end = await page.locator('.piano-octave-row .chip-group').first().evaluate((g) => {
            const box = g.getBoundingClientRect();
            const last = g.querySelector('.chip:last-child')!.getBoundingClientRect();
            return last.right <= box.right + 0.5 && last.left >= box.left - 0.5;
          });
          expect(end, `${w}: the last pill is reachable whole`).toBe(true);
        }
      } finally {
        await context.close();
      }
    }
  });
}
