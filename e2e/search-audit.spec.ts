import { test, expect, type Browser, type Locator, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { seededBrowser, LAPTOP, PHONE, settle, type Lang, type View } from './helpers/wave1';

/**
 * Search and sharing, the audit of 18 November 2026 (stream B), as the
 * learner meets it on the dev server:
 *  A2  "key of A minor", then "key of G major": Explore shows G major (root
 *      AND scale), also from D dorian and with "key of G" alone;
 *  A3  Spanish "Do7" offers C7 first and D°7 second; "Sol7" opens G7;
 *      Portuguese "Ré7" opens D7; English "Do7" keeps D°7 first;
 *  A4  in a Drill session and in a Learn check, choosing "Dm7" opens Explore
 *      with D minor 7; the Drill / Learn tab brings back the same question;
 *  A13 results are named in the learner's language (PT «escala de Ré maior»
 *      → "D maior", with Dó-Ré-Mi "D (Ré) maior");
 *  A14 the arrows keep the selected result inside the list's visible box
 *      (only the list scrolls) and point the input's aria-activedescendant at it;
 *  Q14 the dialog's magnifier is an SVG, not the 🔎 emoji;
 *  A6  "Copy link" on C major in first inversion carries it; the link opens in
 *      first inversion with E the lowest tone.
 *
 * Rows are read as listbox options, and also as the base commit's buttons, so
 * this spec ran against 6de6c0e first and showed each fault there.
 * SEARCH_SHOTS=<dir> writes screenshots of the list (EN / PT / ES, day and
 * night, phone and laptop).
 */

const SHOTS = process.env.SEARCH_SHOTS;

async function open(browser: Browser, v: View, lang: Lang, state: Record<string, unknown> = {}, opts: { permissions?: string[]; path?: string } = {}) {
  const { context, page } = await seededBrowser(browser, v, { language: lang, lastView: 'explore', themeMode: 'fermata', ...state }, {}, { lang, permissions: opts.permissions });
  await page.goto(opts.path ?? '/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(600);
  return { context, page };
}

function dialogOf(page: Page): Locator {
  return page.getByRole('dialog').filter({ has: page.locator('input') });
}

/** The result rows: listbox options (since the fix) or the base commit's buttons. */
function rowsOf(dialog: Locator): Locator {
  return dialog.locator('[role="option"], .max-h-64 > button');
}

async function search(page: Page, q: string): Promise<Locator> {
  await page.keyboard.press('Control+k');
  const dialog = dialogOf(page);
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill(q);
  await expect(rowsOf(dialog).first()).toBeVisible();
  return dialog;
}

const rowTexts = async (dialog: Locator) => (await rowsOf(dialog).allTextContents()).map((s) => s.trim());

async function chooseRow(dialog: Locator, text: RegExp) {
  await rowsOf(dialog).filter({ hasText: text }).first().click();
  await expect(dialog).toHaveCount(0);
}

const summaryKey = (page: Page) => page.getByTestId('summary-key');
const chordHeading = (page: Page) => page.getByTestId('chord-detail').locator('h3');

test.describe('A2: a key search applies its root and its scale', () => {
  test('A minor, then "key of G major": G major; from D dorian "key of G": G major', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'en');
    let dialog = await search(page, 'key of A minor');
    await chooseRow(dialog, /Key$/);
    await expect(summaryKey(page)).toHaveText('A Natural Minor');
    dialog = await search(page, 'key of G major');
    await chooseRow(dialog, /Key$/);
    await expect(summaryKey(page)).toHaveText('G Major');
    await expect(page.getByTestId('scale-picker')).toHaveValue('major');

    await page.getByTestId('scale-picker').selectOption('dorian');
    await expect(summaryKey(page)).toHaveText(/ Dorian$/);
    dialog = await search(page, 'key of G');
    await chooseRow(dialog, /Key$/);
    await expect(summaryKey(page)).toHaveText('G Major');
    await context.close();
  });
});

test.describe('A3 + A13: solfège chords, named in the learner\'s language', () => {
  test('ES: "Do7" → C7 first, D°7 second; "Sol7" opens G7', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'es');
    let dialog = await search(page, 'Do7');
    const texts = await rowTexts(dialog);
    expect(texts.slice(0, 2)).toEqual(['C Séptima de dominanteAcorde', 'D Séptima disminuidaAcorde']);
    await chooseRow(dialog, /^C Séptima de dominante/);
    await expect(chordHeading(page)).toHaveText(/^CSéptima de dominante$/);
    dialog = await search(page, 'Sol7');
    expect((await rowTexts(dialog))[0]).toBe('G Séptima de dominanteAcorde');
    await chooseRow(dialog, /^G Séptima de dominante/);
    await expect(chordHeading(page)).toHaveText(/^GSéptima de dominante$/);
    await context.close();
  });

  test('PT: "Ré7" opens D7; «escala de Ré maior» is "D maior" ("D (Ré) maior" with Dó-Ré-Mi)', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'pt');
    let dialog = await search(page, 'Ré7');
    expect((await rowTexts(dialog))[0]).toBe('D Sétima da dominanteAcorde');
    await chooseRow(dialog, /^D Sétima da dominante/);
    await expect(chordHeading(page)).toHaveText(/^DSétima da dominante$/);
    dialog = await search(page, 'escala de Ré maior');
    expect((await rowTexts(dialog))[0]).toBe('D maiorEscala');
    await chooseRow(dialog, /^D maior/);
    await expect(summaryKey(page)).toHaveText('D maior');
    await context.close();

    const sol = await open(browser, LAPTOP, 'pt', { showSolfege: true });
    dialog = await search(sol.page, 'escala de Ré maior');
    expect((await rowTexts(dialog))[0]).toBe('D (Ré) maiorEscala');
    await chooseRow(dialog, /^D \(Ré\) maior/);
    await expect(summaryKey(sol.page)).toHaveText('D (Ré) maior');
    await sol.context.close();
  });

  test('EN: "Do7" keeps D°7 first, then C7', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'en');
    const dialog = await search(page, 'Do7');
    expect((await rowTexts(dialog)).slice(0, 2)).toEqual(['D Diminished 7thChord', 'C Dominant 7thChord']);
    await context.close();
  });
});

test.describe('A4: a chord chosen in Drill or Learn opens Explore, and the place is kept', () => {
  test('Drill, mid-session: "Dm7" → Explore with D minor 7; the Drill tab brings back the same question', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'en', { lastView: 'drill' });
    const panel = page.locator('#drill-panel');
    await panel.getByRole('button', { name: 'Start' }).click();
    const answers = panel.getByTestId('drill-answers');
    await expect(answers).toBeVisible({ timeout: 15_000 });
    // One answer, so the session is under way (work in progress).
    await answers.getByRole('button').first().click();
    const cont = panel.getByRole('button', { name: 'Continue' });
    if (await cont.isVisible().catch(() => false)) await cont.click();
    await page.waitForTimeout(800);
    const before = await panel.locator('.drill-question-prompt').textContent();
    const header = await panel.locator('.drill-question-header').textContent();

    const dialog = await search(page, 'Dm7');
    await page.keyboard.press('Enter');
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
    await expect(chordHeading(page)).toContainText('Minor 7th');
    await expect(chordHeading(page)).toHaveText(/^D/);

    await page.getByRole('tab', { name: 'Drill' }).click();
    await expect(panel.locator('.drill-question-prompt')).toHaveText(before!);
    await expect(panel.locator('.drill-question-header')).toHaveText(header!);
    await context.close();
  });

  test('Learn, in a check: "Dm7" → Explore with D minor 7; the Learn tab brings back the same question', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'en', { lastView: 'learn' });
    let dialog = await search(page, 'The Major Scale');
    await chooseRow(dialog, /^The Major Scale/);
    await expect(page.getByRole('heading', { level: 1, name: 'The Major Scale' })).toBeVisible({ timeout: 15_000 });
    const start = page.getByRole('button', { name: 'Start the check' });
    await start.scrollIntoViewIfNeeded();
    await start.click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    const position = await page.getByTestId('check-position').textContent();
    const prompt = await page.getByTestId('check-prompt').textContent();

    dialog = await search(page, 'Dm7');
    await page.keyboard.press('Enter');
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
    await expect(chordHeading(page)).toContainText('Minor 7th');

    await page.getByRole('tab', { name: 'Learn' }).click();
    await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('check-position')).toHaveText(position!);
    await expect(page.getByTestId('check-prompt')).toHaveText(prompt!);
    await context.close();
  });
});

test.describe('A14 + Q14: the list as a screen reader and a keyboard meet it', () => {
  for (const v of [LAPTOP, PHONE]) {
    test(`${v.name}: every arrow press keeps the selected result in the list's view; only the list scrolls; aria-activedescendant follows`, async ({ browser }) => {
      const { context, page } = await open(browser, v, 'en');
      const dialog = await search(page, 'C');
      const rows = rowsOf(dialog);
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(8);
      const list = dialog.locator('[role="listbox"], .max-h-64').first();
      const listBox = (await list.boundingBox())!;
      const pageScroll = () => page.evaluate(() => [window.scrollY, document.scrollingElement?.scrollTop ?? 0, document.body.scrollTop]);
      const scrollBefore = await pageScroll();
      const input = dialog.locator('input');
      const selected = () => dialog.locator('[aria-selected="true"], .max-h-64 > button[style*="card-hover"]').first();
      const steps = [...Array(count - 1).fill('ArrowDown'), ...Array(count - 1).fill('ArrowUp')];
      let index = 0;
      for (const key of steps) {
        await page.keyboard.press(key);
        index += key === 'ArrowDown' ? 1 : -1;
        await page.waitForTimeout(30);
        const row = selected();
        await expect(row, `${key} → row ${index}`).toHaveText(await rows.nth(index).textContent() ?? '');
        const box = (await row.boundingBox())!;
        expect(box.y, `${key} → row ${index}: its top is in the list's view`).toBeGreaterThanOrEqual(listBox.y - 0.5);
        expect(box.y + box.height, `${key} → row ${index}: its bottom is in the list's view`).toBeLessThanOrEqual(listBox.y + listBox.height + 0.5);
        expect(await pageScroll(), 'the page did not scroll').toEqual(scrollBefore);
        // Soft, so a missing announcement does not hide a row out of sight.
        expect.soft(await input.getAttribute('aria-activedescendant'), `${key} → row ${index}: aria-activedescendant`).toBe((await row.getAttribute('id')) ?? 'an option id');
      }
      await expect(input).toBeFocused();
      await expect(input).toHaveAttribute('role', 'combobox');
      await expect(input).toHaveAttribute('aria-expanded', 'true');
      await expect(input).toHaveAttribute('aria-controls', (await list.getAttribute('id')) ?? 'missing');
      // Q14: the app's monochrome magnifier, not an emoji.
      expect(await dialog.textContent()).not.toMatch(/\u{1F50E}|\u{1F50D}/u);
      await expect(dialog.locator('svg circle[r="7"]')).toHaveCount(1);
      await context.close();
    });
  }
});

test.describe('A6: a shared link carries the inversion', () => {
  test('C major, first inversion → "Copy link" → the link opens in first inversion, E lowest', async ({ browser, baseURL }) => {
    const { context, page } = await open(browser, LAPTOP, 'en', {}, { permissions: ['clipboard-read', 'clipboard-write'] });
    const dialog = await search(page, 'C');
    await chooseRow(dialog, /^C Major/);
    await page.getByRole('radio', { name: '1st Inv' }).click();
    await page.getByTestId('explore-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Copy link' }).click();
    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(link).toBe(`${baseURL}/?key=C&scale=major&chord=C&inst=piano&inv=1`);
    await context.close();

    const other = await open(browser, LAPTOP, 'en', {}, { path: new URL(link).pathname + new URL(link).search });
    await expect(other.page.getByRole('radio', { name: '1st Inv' })).toHaveAttribute('aria-checked', 'true', { timeout: 15_000 });
    const tones = other.page.getByTestId('chord-detail').getByRole('group', { name: 'Notes' }).getByRole('button');
    await expect(tones.first()).toHaveText(/^E/);
    // What ▶ Chord sounds (E lowest) is proved on the panel itself, through
    // the audio engine: shareLinkInversion.test.tsx; heard == lit:
    // chordPlaySound.test.tsx.
    expect(new URL(other.page.url()).search).toBe('');
    await other.context.close();
  });

  test('an old link (no inv) opens in root position; a malformed inv is ignored', async ({ browser }) => {
    for (const path of ['/?key=C&scale=major&chord=C&inst=piano', '/?key=C&scale=major&chord=C&inst=piano&inv=banana', '/?chord=C&inv=7']) {
      const { context, page } = await open(browser, LAPTOP, 'en', {}, { path });
      await expect(page.getByRole('radio', { name: 'Root' })).toHaveAttribute('aria-checked', 'true', { timeout: 15_000 });
      await context.close();
    }
  });
});

// ─── The fix pass after the review of b94d761 ────────────────────────────────
test.describe('review of b94d761', () => {
  test('item 5: after the arrows ran past the last row, the mouse pointing at a half-hidden row scrolls nothing', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'en');
    const dialog = await search(page, 'C');
    const rows = rowsOf(dialog);
    const count = await rows.count();
    for (let i = 0; i < count + 3; i++) await page.keyboard.press('ArrowDown');
    const list = dialog.getByRole('listbox');
    const box = (await list.boundingBox())!;
    expect(await list.evaluate((el) => el.scrollTop), 'the arrows scrolled to the last row').toBeGreaterThan(0);
    // The learner drags the list's scroll bar back to the top (no row is
    // pointed at on the way)…
    await list.evaluate((el) => { el.scrollTop = 0; });
    // …then points straight at the row the list's bottom edge cuts in half.
    const cut = await rows.evaluateAll((els, bottom) => els.findIndex((el) => {
      const r = el.getBoundingClientRect();
      return r.top < bottom && r.bottom > bottom;
    }), box.y + box.height);
    expect(cut, 'a row is cut by the list\'s bottom edge').toBeGreaterThan(0);
    const rowBox = (await rows.nth(cut).boundingBox())!;
    await page.mouse.move(rowBox.x + 40, box.y + box.height - 4, { steps: 1 });
    await expect(rows.nth(cut)).toHaveAttribute('aria-selected', 'true');
    await page.waitForTimeout(200);
    expect(await list.evaluate((el) => el.scrollTop), 'the mouse scrolled the list').toBe(0);
    await context.close();
  });

  test('item 7: "C/E" opens C major in 1st inversion, E the lowest tone; Copy link carries it', async ({ browser, baseURL }) => {
    const { context, page } = await open(browser, LAPTOP, 'en', {}, { permissions: ['clipboard-read', 'clipboard-write'] });
    const dialog = await search(page, 'C/E');
    await chooseRow(dialog, /^C Major\/E/);
    await expect(page.getByRole('radio', { name: '1st Inv' })).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByTestId('chord-detail').getByRole('group', { name: 'Notes' }).getByRole('button').first()).toHaveText(/^E/);
    await page.getByTestId('explore-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Copy link' }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/?key=C&scale=major&chord=C&inst=piano&inv=1`);
    await context.close();
  });

  test('item 8: "tuner" opens the tuner, "metronome" the metronome, as the "⋯" menu does; in Drill no metronome', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'en');
    let dialog = await search(page, 'tuner');
    await chooseRow(dialog, /^Tuner\s*Tool$/);
    await expect(page.getByRole('dialog', { name: /^Tuner/ })).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: /^Tuner/ })).toHaveCount(0);
    dialog = await search(page, 'metronome');
    await chooseRow(dialog, /^Metronome\s*Tool$/);
    await expect(page.getByTestId('metronome-play')).toBeFocused({ timeout: 15_000 });
    await context.close();

    const drill = await open(browser, LAPTOP, 'pt', { lastView: 'drill' });
    await drill.page.keyboard.press('Control+k');
    const d = dialogOf(drill.page);
    await d.locator('input').fill('metrónomo');
    await drill.page.waitForTimeout(300);
    await expect(d.locator('[data-search-type="Tool"]')).toHaveCount(0);
    await d.locator('input').fill('afinador');
    await expect(rowsOf(d).filter({ hasText: /^Afinador\s*Ferramenta$/ })).toHaveCount(1);
    await drill.context.close();
  });

  for (const from of ['drill', 'learn'] as const) {
    test(`item 9: a chord chosen from ${from} leaves focus on Explore's key picker, not on <body>`, async ({ browser }) => {
      const { context, page } = await open(browser, LAPTOP, 'en', { lastView: from });
      if (from === 'drill') {
        await page.locator('#drill-panel').getByRole('button', { name: 'Start' }).click();
        await expect(page.getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
        await page.getByTestId('drill-answers').getByRole('button').first().focus();
      }
      const dialog = await search(page, 'Dm7');
      await page.keyboard.press('Enter');
      await expect(dialog).toHaveCount(0);
      await expect(page.locator('#explore-panel [data-testid="key-picker"]')).toBeFocused({ timeout: 15_000 });
      await context.close();
    });
  }
});

// ─── Leftovers of 21 November 2026: Quick Search's keys ──────────────────────
// Q1: the dialog's code is fetched the first time search opens, and until it
// arrived nothing listened: an Escape or a second Ctrl+K there was lost and
// the dialog opened anyway. Here the code is HELD BACK on purpose (a route on
// its chunk, released by the test), so the keys always come before it.
// Q2: closing with Ctrl / Cmd+K gave focus back to nothing (Escape gave it
// back) and left the dialog remembering where focus had been.
// The fix pass after the cold review: whose default a Ctrl+K is, runs of keys
// inside one frame, and the browser's Back before the code arrives.
//
// What these rows see of search's state after each key: on the dev server,
// the store itself (its module); on both servers, the piano, which plays a
// letter of the computer keyboard (and takes its default) only while search
// is closed (components/instruments/Piano.tsx returns early while it is open).
// The unit tests (QuickSearch.test.tsx) hold the state after every key too.
test.describe('leftovers: Quick Search from the moment it is asked for', () => {
  const CHUNK = /\/QuickSearch(\.tsx|-[\w-]+\.js)(\?.*)?$/;
  const picker = (page: Page) => page.locator('#explore-panel [data-testid="key-picker"]');
  const menuButton = (page: Page) => page.locator('[data-testid="app-menu"] button').first();

  /** The store, where the dev server serves its module (the build has no such address: null). */
  async function storeOpen(page: Page): Promise<boolean | null> {
    return page.evaluate(async () => {
      const r = await fetch('/src/state/store.ts');
      if (!(r.headers.get('content-type') ?? '').includes('javascript')) return null;
      const { useAppStore } = await import('/src/state/store.ts' as string);
      return useAppStore.getState().quickSearchOpen as boolean;
    });
  }

  /** Two frames: what a key set in motion has been drawn. */
  const frames = (page: Page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

  /** Every keydown the page gets, with whether its default was prevented, read once its dispatch is over. */
  async function recordKeys(page: Page) {
    await page.evaluate(() => {
      const seen: [string, boolean][] = [];
      (window as unknown as { __keys: typeof seen }).__keys = seen;
      window.addEventListener('keydown', (e) => {
        if (['Control', 'Meta', 'Shift', 'Alt'].includes(e.key)) return; // a modifier pressed on its own
        setTimeout(() => seen.push([`${e.ctrlKey ? 'Ctrl+' : ''}${e.metaKey ? 'Meta+' : ''}${e.key}`, e.defaultPrevented]));
      }, true);
    });
  }
  const keysSeen = (page: Page) => page.evaluate(() => (window as unknown as { __keys: [string, boolean][] }).__keys.slice());
  /** The default of the last key the page got, once it has been recorded. */
  async function lastPrevented(page: Page, count: number): Promise<boolean> {
    await expect.poll(async () => (await keysSeen(page)).length).toBe(count);
    return (await keysSeen(page))[count - 1][1];
  }

  /** Search closed, as the piano sees it: an "a" plays C and takes its default only while search is closed. */
  async function closedForThePiano(page: Page): Promise<boolean> {
    const n = (await keysSeen(page)).length;
    await page.keyboard.press('a');
    return lastPrevented(page, n + 1);
  }

  /** A page with the dialog's code held back until `release`. */
  async function held(browser: Browser) {
    const { context, page } = await seededBrowser(browser, LAPTOP, { language: 'en', lastView: 'explore', themeMode: 'fermata' });
    let release!: () => void;
    const gate = new Promise<void>((r) => { release = r; });
    let asked!: (url: string) => void;
    const chunkUrl = new Promise<string>((r) => { asked = r; });
    await context.route(CHUNK, async (route) => {
      asked(route.request().url());
      await gate;
      await route.continue();
    });
    await page.goto('/');
    await expect(picker(page)).toBeVisible({ timeout: 15_000 });
    // The history model is its own chunk, fetched once the first screen is up: it has written its entry.
    await expect.poll(() => page.evaluate(() => (history.state as { fm?: number } | null)?.fm ?? 0), { timeout: 10_000 }).toBe(1);
    await page.waitForTimeout(400);
    await recordKeys(page);
    /** The code arrives: released, fetched and run (the page imports the same address, so this resolves once it has been evaluated), then drawn. */
    const arrive = async () => {
      release();
      await page.evaluate((u) => import(u).then(() => undefined), await chunkUrl);
      await frames(page);
      await page.waitForTimeout(300); // past the dialog's 50 ms focus timer
    };
    return { context, page, chunkUrl, arrive };
  }

  for (const [name, keys, opens] of [
    ['Escape', ['Escape'], false],
    ['a second Ctrl+K', ['Control+k'], false],
    ['a second Ctrl+K, then a third', ['Control+k', 'Control+k'], true],
  ] as const) {
    test(`Q1: the code held back, Ctrl+K then ${name}: the state after each key (the piano on both servers, the store too on the dev server); ${opens ? 'it opens with the code' : 'when the code arrives, no dialog appears and focus has not moved'}`, async ({ browser }) => {
      const { context, page, chunkUrl, arrive } = await held(browser);
      // Focus on a button: an "a" typed into the key picker (a select) would choose a key while search is open.
      await menuButton(page).focus();
      const dev = (await storeOpen(page)) !== null;
      expect(await closedForThePiano(page), 'before any key: closed (the probe sees it)').toBe(true);

      await page.keyboard.press('Control+k');
      await chunkUrl; // asked for, and held
      await frames(page);
      expect(await closedForThePiano(page), 'after Ctrl+K: asked for').toBe(false);
      if (dev) expect(await storeOpen(page), 'after Ctrl+K: asked for (store)').toBe(true);
      await expect(dialogOf(page), 'its code held back: nothing drawn yet').toHaveCount(0);
      for (const [i, key] of keys.entries()) {
        await page.keyboard.press(key);
        await frames(page);
        // Looked at after EACH key: two toggles would cancel out.
        const open = i % 2 === 1;
        expect(await closedForThePiano(page), `after ${key} (key ${i + 2})`).toBe(!open);
        if (dev) expect(await storeOpen(page), `after ${key} (key ${i + 2}, store)`).toBe(open);
      }
      await expect(dialogOf(page)).toHaveCount(0);
      await expect(menuButton(page), 'nothing has moved focus').toBeFocused();

      await arrive();
      if (opens) {
        await expect(dialogOf(page)).toBeVisible();
        await expect(dialogOf(page).locator('input')).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(dialogOf(page)).toHaveCount(0);
        await expect(menuButton(page), 'Escape gives focus back').toBeFocused();
      } else {
        await expect(dialogOf(page), 'no dialog appeared').toHaveCount(0);
        expect(await closedForThePiano(page), 'still closed').toBe(true);
        await expect(menuButton(page), 'focus has not moved').toBeFocused();
        // The code is there now and its keys work: one Ctrl+K opens, one closes.
        await page.keyboard.press('Control+k');
        await expect(dialogOf(page).locator('input')).toBeFocused();
        await page.keyboard.press('Control+k');
        await expect(dialogOf(page)).toHaveCount(0);
        await expect(menuButton(page)).toBeFocused();
      }
      await context.close();
    });
  }

  test('Ctrl+K is the app\'s, not the browser\'s: its default is prevented for the page\'s first press (the host\'s listener) and for later ones (the dialog\'s), in either case; Escape\'s is not', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'en');
    await recordKeys(page);
    await page.keyboard.press('Control+k');
    expect(await lastPrevented(page, 1), 'the first press of the page: the host\'s').toBe(true);
    await expect(dialogOf(page).locator('input')).toBeFocused();
    await page.keyboard.press('Control+k');
    expect(await lastPrevented(page, 2), 'a later press, closing: the dialog\'s').toBe(true);
    await expect(dialogOf(page)).toHaveCount(0);
    await page.keyboard.press('Control+Shift+K');
    expect(await lastPrevented(page, 3), 'a capital K, opening: the dialog\'s').toBe(true);
    await expect(dialogOf(page).locator('input')).toBeFocused();
    await page.keyboard.press('Escape');
    expect(await lastPrevented(page, 4), 'Escape is not taken from the page').toBe(false);
    await expect(dialogOf(page)).toHaveCount(0);
    expect((await keysSeen(page)).map(([k]) => k)).toEqual(['Ctrl+k', 'Ctrl+k', 'Ctrl+K', 'Escape']);
    await context.close();
  });

  test('Q2: every way of closing gives focus back to where it was when search opened, and the dialog remembers no element after', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, 'en');
    const ways: [string, () => Promise<unknown>][] = [
      ['Escape', () => page.keyboard.press('Escape')],
      ['Ctrl+K', () => page.keyboard.press('Control+k')],
      ['Cmd+K', () => page.keyboard.press('Meta+k')],
      ['a click on the backdrop', () => page.mouse.click(40, 860)],
      ['the browser\'s Back', () => page.goBack()],
    ];
    for (const [how, close] of ways) {
      await picker(page).focus();
      await page.keyboard.press('Control+k');
      await expect(dialogOf(page).locator('input'), `${how}: open, the input focused`).toBeFocused();
      await close();
      await expect(dialogOf(page), `${how}: closed`).toHaveCount(0);
      await expect(picker(page), `${how}: focus is back on the key picker`).toBeFocused();
      // Nothing remembered: opened from elsewhere and closed, focus goes back THERE. A dialog still
      // holding the key picker (its frame giving focus back without forgetting it) sends focus to it.
      await menuButton(page).focus();
      await page.keyboard.press('Control+k');
      await expect(dialogOf(page).locator('input'), `${how}: opened from the menu button`).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialogOf(page)).toHaveCount(0);
      await expect(menuButton(page), `${how}: the next close goes back to where that open began`).toBeFocused();
    }
    await context.close();
  });

  // Runs of keys faster than a frame (review item 3: close, open, close in one frame ended on <body>).
  const RUNS: { keys: ('Control+k' | 'Escape')[]; opens: boolean }[] = [
    { keys: ['Control+k', 'Control+k', 'Control+k'], opens: false },
    { keys: ['Control+k', 'Control+k', 'Control+k', 'Control+k'], opens: true },
    { keys: ['Escape', 'Control+k', 'Escape'], opens: false },
    { keys: ['Escape', 'Control+k', 'Control+k', 'Control+k'], opens: true },
  ];
  for (const how of ['real key presses', 'inside one task, a microtask between keys', 'inside one task, back to back'] as const) {
    test(`Q2: from open, runs of three and four keys (${how}) end with focus where search opened, or in the open dialog's input`, async ({ browser }) => {
      const { context, page } = await open(browser, LAPTOP, 'en');
      for (const run of RUNS) {
        const label = `${how}: ${run.keys.join(' ')}`;
        await picker(page).focus();
        await page.keyboard.press('Control+k');
        await expect(dialogOf(page).locator('input'), `${label}: open, the input focused`).toBeFocused();
        if (how === 'real key presses') {
          for (const k of run.keys) await page.keyboard.press(k);
        } else {
          await page.evaluate(async ([keys, drawn]) => {
            for (const k of keys) {
              const init = k === 'Escape' ? { key: 'Escape' } : { key: 'k', ctrlKey: true };
              (document.activeElement ?? document.body).dispatchEvent(new KeyboardEvent('keydown', { ...init, bubbles: true, cancelable: true }));
              // React schedules a key's change in a microtask: awaiting one lets it run, still inside this task.
              if (drawn) await Promise.resolve();
            }
          }, [run.keys, how === 'inside one task, a microtask between keys'] as const);
        }
        await frames(page);
        await page.waitForTimeout(400); // the frame, the 50 ms timer, the exit
        if (run.opens) {
          await expect(dialogOf(page).locator('input'), `${label}: ends open, the input`).toBeFocused();
          await page.keyboard.press('Escape');
          await expect(dialogOf(page)).toHaveCount(0);
        } else {
          await expect(dialogOf(page), `${label}: ends closed`).toHaveCount(0);
        }
        await expect(picker(page), `${label}: closed at last, focus where search opened`).toBeFocused();
      }
      await context.close();
    });
  }

  test('the browser\'s Back while the code is held back cancels search: the screen stays, no dialog when the code arrives, focus not moved, Forward brings nothing back; one entry for the open, none added since', async ({ browser }) => {
    const { context, page, chunkUrl, arrive } = await held(browser);
    const learnTab = page.locator('[role="tab"][data-tab="learn"]');
    const exploreTab = page.locator('[role="tab"][data-tab="explore"]');
    const at = () => page.evaluate(() => ({ i: (history.state as { i: number }).i, l: (history.state as { l: number }).l, length: history.length }));
    await learnTab.click();
    await expect(learnTab).toHaveAttribute('aria-selected', 'true');
    await expect(learnTab).toBeFocused();
    const before = await at();
    await page.keyboard.press('Control+k');
    await chunkUrl;
    await frames(page);
    expect(await at(), 'asked for: one entry, covering one layer').toEqual({ i: before.i + 1, l: 1, length: before.length + 1 });
    await page.goBack();
    await frames(page);
    await expect(learnTab, 'Back cancelled search: still Learn').toHaveAttribute('aria-selected', 'true');
    expect(await at(), 'on the entry it was asked from (the one for search still ahead)').toEqual({ ...before, length: before.length + 1 });
    await arrive();
    await expect(dialogOf(page), 'no dialog when the code arrives').toHaveCount(0);
    await expect(learnTab, 'focus has not moved').toBeFocused();
    await page.goForward();
    await frames(page);
    await page.waitForTimeout(200);
    await expect(dialogOf(page), 'Forward brings nothing back').toHaveCount(0);
    await expect(learnTab).toHaveAttribute('aria-selected', 'true');
    expect((await at()).length, 'no entry added by any of it').toBe(before.length + 1);
    // Back to the entry search was asked from, then once more: the screen before it.
    await page.goBack();
    await expect.poll(async () => (await at()).i).toBe(before.i);
    await page.goBack();
    await expect(exploreTab, 'the screen before').toHaveAttribute('aria-selected', 'true');
    await expect(dialogOf(page)).toHaveCount(0);
    await context.close();
  });
});

// ─── Screenshots: the list in EN / PT / ES, day and night ────────────────────
test.describe('screenshots', () => {
  test.skip(!SHOTS, 'SEARCH_SHOTS=<dir> writes the screenshots');
  const QUERIES: Record<Lang, string> = { en: 'Do7', pt: 'Ré', es: 'Do7' };
  for (const v of [PHONE, LAPTOP]) {
    for (const lang of ['en', 'pt', 'es'] as const) {
      for (const theme of ['fermata', 'fermata-night'] as const) {
        test(`${v.name} ${lang} ${theme}`, async ({ browser }) => {
          const { context, page } = await open(browser, v, lang, { themeMode: theme });
          await search(page, QUERIES[lang]);
          await page.keyboard.press('ArrowDown');
          await settle(page);
          fs.mkdirSync(SHOTS!, { recursive: true });
          await page.screenshot({ path: `${SHOTS}/search-${v.name}-${lang}-${theme === 'fermata' ? 'day' : 'night'}.png` });
          await context.close();
        });
      }
    }
  }
});
