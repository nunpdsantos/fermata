import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * Plain words in Explore (wave 1, brief C), in a real browser, on a phone
 * (390×844, touch) and a laptop (1440×900), in English and Portuguese:
 *  - tap a word → its explanation (laptop: a popover beside the word; phone:
 *    a bottom sheet), ▶ Hear it plays through the instrument (its keys
 *    light), Escape closes it and focus is back on the word, nothing on the
 *    page moved;
 *  - "Words on this screen" lists what is shown (Full shows the circle's
 *    words, Simple does not);
 *  - Simple ↔ Full keeps the key, the chord and the instrument;
 *  - Simple's contents: the short scale list, the summary in words, the
 *    degree numbers (1–7 in a major key, ♭3 in a minor pentatonic), the In
 *    key row only, the trimmed chord detail, no circle;
 *  - a guided profile (set through the wave-1 contract's setter) starts in
 *    Simple, and a learner's own choice wins over it after a reload.
 */

const VIEWS = {
  phone: { w: 390, h: 844, touch: true },
  laptop: { w: 1440, h: 900, touch: false },
} as const;

const TEXT = {
  en: { words: 'Words on this screen', relative: 'Relative key', hear: 'Hear it', full: 'Full view', seg: 'How much to show', summary: 'C Major · no sharps or flats', all: 'All scales…', see: 'See everything about this chord' },
  pt: { words: 'Palavras neste ecrã', relative: 'Tonalidade relativa', hear: 'Ouvir', full: 'Vista completa', seg: 'Quanto mostrar', summary: 'C maior · sem sustenidos nem bemóis', all: 'Todas as escalas…', see: 'Ver tudo sobre este acorde' },
} as const;

async function open(browser: Browser, view: keyof typeof VIEWS, state: Record<string, unknown> = {}) {
  const v = VIEWS[view];
  const context = await browser.newContext({
    viewport: { width: v.w, height: v.h }, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block',
  });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({
    state: { themeMode: 'fermata', language: 'en', lastView: 'explore', instrument: 'piano', baseOctave: 4, selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', ...state },
    version: 6,
  }));
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);
  return { context, page };
}

/** Where the Explore parts sit (to prove nothing moved). */
const layout = (page: Page) => page.evaluate(() => ['.explore-header', '.strip-card', '.chords-card', '[data-testid="instrument-dock"]']
  .map((s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? [Math.round(r.top), Math.round(r.height)] : null; }));

/** The dev server serves the app's modules (a production build does not). */
async function hasDevModules(page: Page) {
  const res = await page.request.get('/src/state/learnerProfile.ts');
  return res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
}


async function setDetail(page: Page, view: keyof typeof VIEWS, lang: 'en' | 'pt', to: 'simple' | 'full') {
  if (view === 'phone' && to === 'full') {
    // Simple's "⋯" offers the way back.
    await page.getByTestId('explore-menu').getByRole('button').click();
    await page.getByRole('menuitem', { name: TEXT[lang].full }).click();
  } else if (view === 'phone') {
    // Full's "⋯" is unchanged: a phone switches from the word list.
    await page.getByTestId('words-open').click();
    await page.getByTestId('glossary-sheet').getByRole('radio', { name: lang === 'en' ? 'Simple' : 'Simples' }).click();
    await page.keyboard.press('Escape');
  } else {
    await page.getByRole('radiogroup', { name: TEXT[lang].seg }).getByRole('radio', { name: to === 'simple' ? (lang === 'en' ? 'Simple' : 'Simples') : (lang === 'en' ? 'Full' : 'Completa') }).click();
  }
  await expect(page.getByTestId('explore-root')).toHaveAttribute('data-detail', to);
}

for (const view of ['phone', 'laptop'] as const) {
  for (const lang of ['en', 'pt'] as const) {
    test.describe(`${view} ${lang}`, () => {
      test('tap a word: its explanation, ▶ Hear it plays, Escape closes and focus returns; nothing moves', async ({ browser }) => {
        const { context, page } = await open(browser, view, { language: lang });
        const before = await layout(page);
        const word = page.getByTestId('key-summary').locator('.term[data-term="relativeKey"]');
        await expect(word).toHaveCSS('text-decoration-style', 'dotted');
        await word.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog', { name: TEXT[lang].relative });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByTestId('glossary-example')).toContainText(lang === 'en' ? 'A minor' : 'A menor');
        expect(await layout(page), 'opening an explanation moves nothing').toEqual(before);
        if (view === 'laptop') {
          // Beside the word, not over it, and clear of the instrument.
          const w = (await word.boundingBox())!;
          const d = (await dialog.boundingBox())!;
          expect(d.y >= w.y + w.height - 1 || d.y + d.height <= w.y + 1, 'the popover does not cover the word').toBe(true);
          const dock = (await page.getByTestId('instrument-dock').boundingBox())!;
          expect(d.y + d.height).toBeLessThanOrEqual(dock.y + 1);
        }
        const hear = dialog.getByRole('button', { name: TEXT[lang].hear });
        await hear.click();
        // It plays: the button says so while the notes sound, and they light on the piano.
        await expect(hear).toHaveAttribute('data-playing', 'true');
        if (await hasDevModules(page)) {
          await expect.poll(() => page.evaluate(`(async () => (await import('/src/state/store.ts')).useAppStore.getState().activeNotes.size)()`), { timeout: 4000 }).toBeGreaterThan(0);
        }
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(word).toBeFocused();
        await context.close();
      });

      test('"Words on this screen" lists what is shown, Full and Simple', async ({ browser }) => {
        const { context, page } = await open(browser, view, { language: lang });
        await page.locator('.chord-row button').nth(4).click();
        await expect(page.getByTestId('chord-detail')).toBeVisible();
        await page.getByTestId('words-open').first().click();
        const sheet = page.getByTestId('glossary-sheet');
        await expect(sheet.getByRole('heading', { name: TEXT[lang].words })).toBeVisible();
        const words = sheet.locator('[data-word]');
        const full = await words.evaluateAll((els) => els.map((e) => e.getAttribute('data-word')));
        expect(full).toEqual(expect.arrayContaining(['keySignature', 'relativeKey', 'degree', 'chordsInKey', 'romanNumeral', 'inversion', 'formula', 'compatibleScales', 'dominant']));
        // A laptop shows the circle beside the work; a phone keeps it in the key sheet.
        if (view === 'laptop') expect(full).toEqual(expect.arrayContaining(['circleOfFifths', 'dominantKey']));
        else expect(full).not.toContain('circleOfFifths');
        await sheet.locator('[data-word="inversion"] button').click();
        await expect(sheet.locator('[data-word="inversion"]')).toContainText(lang === 'en' ? '1st inversion B D G' : '1.ª inversão B D G');
        await page.keyboard.press('Escape');
        await expect(sheet).toBeHidden();
        await setDetail(page, view, lang, 'simple');
        await page.getByTestId('words-open').first().click();
        const simple = await page.getByTestId('glossary-sheet').locator('[data-word]').evaluateAll((els) => els.map((e) => e.getAttribute('data-word')));
        expect(simple).toEqual(expect.arrayContaining(['keySignature', 'degree', 'chordsInKey']));
        for (const gone of ['inversion', 'formula', 'compatibleScales', 'circleOfFifths', 'relativeKey', 'dominant']) expect(simple).not.toContain(gone);
        // After review: the list's own Simple / Full switch re-reads the page behind it.
        const listSheet = page.getByTestId('glossary-sheet');
        await listSheet.getByRole('radio', { name: lang === 'en' ? 'Full' : 'Completa' }).click();
        await expect.poll(() => listSheet.locator('[data-word]').evaluateAll((els) => els.map((e) => e.getAttribute('data-word')))).toEqual(expect.arrayContaining(['inversion', 'formula', 'compatibleScales']));
        await context.close();
      });

      test('Simple numbers a pentatonic scale by its degrees (as Full and the colours do)', async ({ browser }) => {
        const { context, page } = await open(browser, view, { language: lang, exploreDetail: 'simple', selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'pentatonic_minor' });
        await expect(page.locator('.strip-degree')).toHaveText(['1', '♭3', '4', '5', '♭7', '1']);
        await context.close();
      });

      test('Simple ↔ Full keeps the key, the chord and the instrument; Simple shows what a first-timer needs', async ({ browser }) => {
        const { context, page } = await open(browser, view, { language: lang, instrument: 'guitar', selectedKey: { natural: 'D', accidental: '' } });
        await page.locator('.chord-row button').nth(4).click(); // V = A
        await expect(page.getByTestId('chord-detail')).toBeVisible();
        await setDetail(page, view, lang, 'simple');
        // Key, scale and instrument from the save; the chord from the screen.
        const state = async () => ({
          ...(await page.evaluate(() => {
            const s = JSON.parse(localStorage.getItem('music-theory-app')!).state;
            return { key: s.selectedKey, scale: s.selectedScale, instrument: s.instrument };
          })),
          chord: (await page.locator('.chord-detail-name').textContent())?.replace(/\s+/g, ''),
          pressed: await page.locator('.chord-row button[aria-pressed="true"]').count(),
        });
        const expected = { key: { natural: 'D', accidental: '' }, scale: 'major', instrument: 'guitar', chord: lang === 'en' ? 'AMajor' : 'AMaior', pressed: 1 };
        expect(await state()).toEqual(expected);
        // Simple's contents.
        const picker = page.getByTestId('scale-picker');
        expect(await picker.locator('option').count()).toBe(6);
        await expect(picker.locator('option').last()).toHaveText(TEXT[lang].all);
        await expect(page.getByTestId('key-summary')).toHaveText(lang === 'en' ? 'D Major · 2 sharps' : 'D maior · 2 sustenidos');
        await expect(page.locator('.strip-degree')).toHaveText(['1', '2', '3', '4', '5', '6', '7', '1']);
        await expect(page.locator('.strip-fn')).toHaveCount(0);
        await expect(page.getByRole('tablist', { name: lang === 'en' ? 'Chords' : 'Acordes' })).toHaveCount(0);
        await expect(page.getByTestId('circle-card')).toHaveCount(0);
        const detail = page.getByTestId('chord-detail');
        await expect(detail.getByRole('radiogroup')).toHaveCount(0);
        await expect(detail.locator('.chord-detail-scales')).toHaveCount(0);
        await expect(page.getByTestId('chord-role')).toHaveCount(0);
        await expect(detail.getByTestId('see-everything')).toHaveText(new RegExp(TEXT[lang].see));
        // ▶ Chord stays in view, as in Full.
        await expect(detail.locator('.chord-detail-actions .btn-primary')).toBeInViewport();
        if (view === 'laptop') {
          const s = await page.evaluate(() => {
            const m = document.querySelector('.explore-main')!;
            const se = document.scrollingElement!;
            return { main: m.scrollHeight - m.clientHeight, page: se.scrollHeight - se.clientHeight };
          });
          expect(s, 'nothing scrolls at 1440×900 with a chord open').toEqual({ main: 0, page: 0 });
        } else {
          await page.getByTestId('key-picker').click();
          const sheet = page.getByTestId('key-sheet');
          await expect(sheet.locator('[data-root]')).toHaveCount(12);
          await expect(sheet.locator('.cof-root')).toHaveCount(0);
          await page.keyboard.press('Escape');
        }
        // And back: the chord's line into Full.
        await detail.getByTestId('see-everything').click();
        await expect(page.getByTestId('explore-root')).toHaveAttribute('data-detail', 'full');
        expect(await state()).toEqual(expected);
        await expect(page.getByTestId('chord-detail').locator('.chord-detail-scales')).toBeVisible();
        await context.close();
      });
    });
  }
}

test('a guided profile starts in Simple; the learner\'s own choice wins after a reload', async ({ browser }) => {
  const { context, page } = await open(browser, 'laptop');
  // The profile is set through the wave-1 contract's setter, a dev-server
  // module; a production build has no /src to import it from.
  test.skip(!(await hasDevModules(page)), 'needs the dev server\'s /src modules (setLearnerProfile)');
  await expect(page.getByTestId('explore-root')).toHaveAttribute('data-detail', 'full');
  await page.evaluate(`(async () => (await import('/src/state/learnerProfile.ts')).setLearnerProfile('new'))()`);
  await expect(page.getByTestId('explore-root')).toHaveAttribute('data-detail', 'simple');
  // "All scales…" switches to Full (and saves that choice).
  await page.getByTestId('scale-picker').selectOption('all-scales');
  await expect(page.getByTestId('explore-root')).toHaveAttribute('data-detail', 'full');
  await expect(page.getByTestId('scale-picker').locator('option')).toHaveCount(37);
  await page.reload();
  await expect(page.getByTestId('scale-strip')).toBeVisible();
  await page.evaluate(`(async () => (await import('/src/state/learnerProfile.ts')).setLearnerProfile('player'))()`);
  await expect(page.getByTestId('explore-root')).toHaveAttribute('data-detail', 'full');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.exploreDetail);
  expect(saved).toBe('full');
  await context.close();
});
