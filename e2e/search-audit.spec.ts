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
