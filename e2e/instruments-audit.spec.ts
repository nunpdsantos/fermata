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

const practice = (lang: string) => JSON.parse(readFileSync(resolve(process.cwd(), `src/i18n/practice/${lang}.json`), 'utf8')) as { next: string; previous: string; play: string };
const LANGS = ['en', 'pt', 'es'] as const;

async function open(browser: Browser, opts: { w: number; h: number; touch?: boolean; lang?: string; instrument?: 'piano' | 'guitar'; state?: Record<string, unknown>; url?: string }) {
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
  await page.goto(opts.url ?? '/');
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
      } finally {
        await context.close();
      }
    });
  }
}

// ─── Q3: the chip strip, both ways (review of a611beb) ───────────────────────
/** The active chip inside the strip's box, and nothing scrolled vertically. */
async function stripState(sheet: Locator) {
  const chip = await sheet.locator('.practice-events').evaluate((el) => {
    const box = el.getBoundingClientRect();
    const items = Array.from(el.children);
    const active = el.querySelector('[aria-current="step"]')!;
    const at = active.getBoundingClientRect();
    return { index: items.indexOf(active), inside: at.left >= box.left - 1 && at.right <= box.right + 1, scrolled: el.scrollLeft };
  });
  return { ...chip, vertical: (await verticalScrolls(sheet)).map((s) => s.top) };
}
const press = (button: Locator) => button.evaluate((b) => (b as HTMLButtonElement).click()); // no scrolling on the test's side

for (const viewport of [{ w: 1440, h: 900 }, { w: 1024, h: 768 }, { w: 390, h: 844, touch: true }, { w: 320, h: 568, touch: true }, { w: 844, h: 390, touch: true }]) {
  test(`Q3: the active chip stays in the strip stepping both ways, playing and stepping back while playing, all four tabs, ${viewport.w}×${viewport.h}`, async ({ browser }) => {
    test.setTimeout(240_000);
    const { context, page } = await open(browser, { ...viewport, instrument: 'guitar' });
    try {
      await page.getByTestId('practice-open').click();
      const sheet = page.getByTestId('practice-sheet');
      await expect(sheet.getByTestId('practice-player')).toBeVisible();
      const next = sheet.getByRole('button', { name: practice('en').next, exact: true });
      const previous = sheet.getByRole('button', { name: practice('en').previous, exact: true });
      for (const tab of ['scales', 'walk', 'technical', 'rightHand']) {
        await press(sheet.locator(`[id="practice-tab-${tab}"]`));
        await expect(sheet.getByTestId('practice-player')).toBeVisible();
        await settle(page);
        const n = await sheet.locator('.practice-event').count();
        const failures: string[] = [];
        const expectAt = async (index: number, how: string) => {
          const s = await stripState(sheet);
          if (s.index !== index || !s.inside || s.vertical.some((v) => v !== 0)) failures.push(`${tab} ${how} ${index}: ${JSON.stringify(s)}`);
        };
        for (let i = 1; i < n; i++) { await press(next); await expectAt(i, 'forward'); }
        expect((await stripState(sheet)).scrolled, `${tab}: the strip scrolled to its end`).toBeGreaterThanOrEqual(0);
        for (let i = n - 2; i >= 0; i--) { await press(previous); await expectAt(i, 'back'); }
        // To the end, then Play from the start: the first chip comes back into view.
        for (let i = 1; i < n; i++) await press(next);
        await sheet.getByRole('combobox', { name: 'Tempo' }).selectOption('200');
        await press(sheet.getByRole('button', { name: practice('en').play }));
        for (let k = 0; k < 4; k++) {
          await page.waitForTimeout(450);
          const s = await stripState(sheet);
          if (!s.inside || s.vertical.some((v) => v !== 0)) failures.push(`${tab} playing: ${JSON.stringify(s)}`);
        }
        // Previous while playing: it stops there, in view.
        const at = (await stripState(sheet)).index;
        if (at > 0) { await press(previous); await settle(page); await expectAt(at - 1, 'previous while playing'); }
        expect(failures, `${tab}`).toEqual([]);
      }
    } finally {
      await context.close();
    }
  });
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
async function octaveRow(page: Page) {
  const g = page.locator('.piano-octave-row .chip-group').first();
  const rest = await g.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const chips = Array.from(el.querySelectorAll('.chip')).map((c) => c.getBoundingClientRect());
    return {
      cut: chips.filter((c) => c.left < box.right - 0.5 && c.right > box.right + 0.5).length,
      overflows: el.scrollWidth > el.clientWidth + 1, offScreen: box.right > innerWidth + 0.5 || box.left < -0.5,
      fade: el.parentElement!.hasAttribute('data-more-right'), count: chips.length,
    };
  });
  // Every octave reachable: scrolled to the end, the last pill is whole and on the screen.
  await g.evaluate((el) => { el.scrollLeft = el.scrollWidth; });
  await page.waitForTimeout(150);
  const end = await g.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const last = el.querySelector('.chip:last-child')!.getBoundingClientRect();
    return last.right <= box.right + 0.5 && last.left >= box.left - 0.5 && last.right <= innerWidth + 0.5;
  });
  return { ...rest, end };
}

for (const lang of LANGS) {
  for (const pointer of ['touch', 'mouse'] as const) {
    test(`Q14: no octave pill is cut off from 320 to 430 px, ${lang}, ${pointer}`, async ({ browser }) => {
      for (const w of [320, 344, 360, 375, 390, 400, 414, 430]) {
        const { context, page } = await open(browser, { w, h: 844, touch: pointer === 'touch', lang, state: { dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true, learn: false } } });
        try {
          await page.waitForTimeout(300);
          const row = await octaveRow(page);
          expect(row.offScreen, `${w}: the row stays on the screen`).toBe(false);
          expect(row.cut, `${w}: a pill is cut at the row's edge`).toBe(0);
          expect(row.fade, `${w}: the fade`).toBe(row.overflows);
          expect(row.end, `${w}: the last pill is reachable whole`).toBe(true);
        } finally {
          await context.close();
        }
      }
    });
  }
}

test('Q14: in the dock bar of a piano check on a short screen, every octave is reachable (568×320 touch, 844×390 mouse)', async ({ browser }) => {
  for (const viewport of [{ w: 568, h: 320, touch: true }, { w: 844, h: 390 }]) {
    const { context, page } = await open(browser, viewport);
    try {
      const dev = await page.request.get('/src/state/store.ts');
      test.skip(!dev.ok(), 'raising the check state reads the dev server\'s modules');
      await page.evaluate(async () => {
        const m = await import(/* @vite-ignore */ '/src/state/store.ts' as string) as { useAppStore: { setState: (s: object) => void } };
        m.useAppStore.setState({ exerciseInputActive: true });
      });
      await expect(page.locator('.dock-piano-tools .piano-octave-row')).toBeVisible();
      const row = await page.locator('.dock-piano-tools .piano-octave-row').evaluate((el) => {
        const r = el.getBoundingClientRect();
        const bar = el.closest('.dock-piano-tools')!.getBoundingClientRect();
        return { inBar: r.right <= bar.right + 0.5 && r.left >= bar.left - 0.5 };
      });
      expect(row.inBar, `${viewport.w}: the octave row stays inside the bar`).toBe(true);
      const g = page.locator('.dock-piano-tools .chip-group').first();
      await g.evaluate((el) => { el.scrollLeft = el.scrollWidth; });
      await page.waitForTimeout(150);
      const end = await g.evaluate((el) => {
        const box = el.getBoundingClientRect();
        const last = el.querySelector('.chip:last-child')!.getBoundingClientRect();
        return last.right <= box.right + 0.5 && last.right <= innerWidth + 0.5;
      });
      expect(end, `${viewport.w}: the last octave is reachable`).toBe(true);
    } finally {
      await context.close();
    }
  }
});

// ─── Chord-position chips: one line (review of a611beb, item 5) ─────────────
/** The controls row of the chord the page opened with, as drawn. */
async function chordControls(page: Page) {
  await expect(page.locator('.fretboard-controls .chord-shapes-line')).toBeVisible();
  await page.waitForTimeout(500);
  return page.evaluate(() => {
    const row = document.querySelector('.fretboard-controls')!;
    const chips = row.querySelector('.chord-shapes-line')!;
    const group = chips.querySelector('.chip-group')!;
    const flip = row.querySelector('[data-testid="flip-neck"]')!;
    const tuning = row.querySelector('select')!.closest('label')!;
    const top = (e: Element) => Math.round(e.getBoundingClientRect().top + e.getBoundingClientRect().height / 2);
    return {
      chipsLines: new Set(Array.from(group.querySelectorAll('.chip')).map((c) => Math.round(c.getBoundingClientRect().top))).size,
      sameLine: top(chips) === top(flip) && top(flip) === top(tuning),
      overflows: group.scrollWidth > group.clientWidth + 1,
      fade: group.parentElement!.hasAttribute('data-more-right'),
      dock: document.querySelector('[data-testid="instrument-dock"]')!.getBoundingClientRect().height,
    };
  });
}

for (const viewport of [{ w: 1440, h: 900 }, { w: 1280, h: 800 }, { w: 1024, h: 768 }, { w: 820, h: 1180, touch: true }, { w: 768, h: 1024, touch: true }, { w: 844, h: 390, touch: true }, { w: 390, h: 844, touch: true }, { w: 320, h: 568, touch: true }]) {
  test(`item 5: the chord chips stay on one line, scroll with the fade, and the dock is as tall in PT / ES as in EN, ${viewport.w}×${viewport.h}`, async ({ browser }) => {
    test.setTimeout(120_000);
    const results: Record<string, Awaited<ReturnType<typeof chordControls>>> = {};
    for (const lang of LANGS) {
      for (const wide of [false, true]) {
        const { context, page } = await open(browser, { ...viewport, lang, instrument: 'guitar', url: '/?key=C&scale=major&chord=C&inst=guitar', state: viewport.touch ? { dockDetents: { explore: 'full', learn: 'peek' }, dockChosen: { explore: true, learn: false } } : {} });
        try {
          if (wide) await page.addStyleTag({ content: '.fretboard-controls, .fretboard-controls * { letter-spacing: 0.04em !important; }' });
          const r = await chordControls(page);
          results[`${lang}${wide ? ' wide' : ''}`] = r;
          expect(r.chipsLines, `${lang}${wide ? ' wide' : ''}: one line of chips`).toBe(1);
          expect(r.fade, `${lang}${wide ? ' wide' : ''}: the fade shows exactly when the chips scroll`).toBe(r.overflows);
          if (viewport.w >= 640) expect(r.sameLine, `${lang}${wide ? ' wide' : ''}: beside Flip neck and the tuning`).toBe(true);
          // The selected chip is brought into view sideways: pick the last one without scrolling it ourselves.
          await page.locator('.chord-shapes-line .chip').last().evaluate((b) => (b as HTMLButtonElement).click());
          await page.waitForTimeout(200);
          const lastInView = await page.locator('.chord-shapes-line .chip-group').evaluate((el) => {
            const box = el.getBoundingClientRect();
            const c = el.querySelector('[aria-checked="true"]')!.getBoundingClientRect();
            return c.left >= box.left - 1 && c.right <= box.right + 1;
          });
          expect(lastInView, `${lang}${wide ? ' wide' : ''}: the selected chip in view`).toBe(true);
        } finally {
          await context.close();
        }
      }
    }
    // Where the chips share the line (from 640 px), the language never changes the dock's height.
    if (viewport.w >= 640) for (const k of Object.keys(results)) expect(results[k].dock, `${k}: dock as tall as in English`).toBe(results[k.endsWith('wide') ? 'en wide' : 'en'].dock);
  });
}
