import { test, expect, type Page, type Locator } from '@playwright/test';
import { auditPage } from './helpers/designAudit';

// W10-UI-c: authored for the seat to run locally; builder does not run Playwright.
const labels = {
  en: { up: '↑ Ascending', down: '↓ Descending', play: 'Play classical melodic minor ascending and descending', unit: 'Guitar Notation — Optional', modules: ['Guitar Notation: Clef and Strings', 'Guitar Notation: The Two Hands', 'Guitar Notation: Positions and Barres'], check: 'Start the check' },
  pt: { up: '↑ Ascendente', down: '↓ Descendente', play: 'Tocar a escala menor melódica clássica a subir e a descer', unit: 'Notação de guitarra — opcional', modules: ['Notação de guitarra: clave e cordas', 'Notação de guitarra: as duas mãos', 'Notação de guitarra: posições e pestanas'], check: 'Começar a verificação' },
  es: { up: '↑ Ascendente', down: '↓ Descendente', play: 'Tocar la escala menor melódica clásica al subir y al bajar', unit: 'Notación de guitarra — opcional', modules: ['Notación de guitarra: clave y cuerdas', 'Notación de guitarra: las dos manos', 'Notación de guitarra: posiciones y cejillas'], check: 'Empezar la comprobación' },
} as const;

// TopBar's nav.quickSearchLabel in each language, including its spoken hint.
const searchLabels = {
  en: 'Quick search, Command+K',
  pt: 'Pesquisa rápida, Command+K',
  es: 'Búsqueda rápida, Command+K',
} as const;

async function audit(page: Page, touch: boolean) {
  await page.evaluate(() => document.fonts.ready);
  // Reduced motion is requested; wait for delayed entrances too, as in Learn's sweep.
  await page.waitForTimeout(1000);
  const r = await auditPage(page, { minFontPx: 12, minTapPx: touch ? 44 : 36 });
  expect(r.textNodes).toBeGreaterThan(5);
  expect(r.fontViolations).toEqual([]);
  expect(r.tapViolations).toEqual([]);
  expect(r.contrastViolations).toEqual([]);
  expect(r.clipViolations).toEqual([]);
  expect(r.hScroll.scrollWidth).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
}

// Check actual rendered scale highlights, independent of the staff's labels.
async function expectInstrumentPitches(root: Page | Locator, instrument: 'piano' | 'guitar', direction: 'up' | 'down') {
  const expected = direction === 'down' ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 4, 6, 8, 9, 11];
  const lit = root.locator(instrument === 'piano' ? '[data-piano-key][data-scale-note]' : '[data-dot]');
  await expect.poll(() => lit.evaluateAll((els, kind) => {
    const openMidi = [40, 45, 50, 55, 59, 64];
    const pcs = els.map((el) => kind === 'piano'
      ? Number(el.getAttribute('data-midi')) % 12
      : (openMidi[Number(el.getAttribute('data-dot-string'))] + Number(el.getAttribute('data-dot-fret'))) % 12);
    return [...new Set(pcs)].sort((a, b) => a - b);
  }, instrument)).toEqual(expected); // Descending includes F/G (5/7), excludes F#/G# (6/8).
}

for (const lang of ['en', 'pt', 'es'] as const) {
  for (const instrument of ['piano', 'guitar'] as const) {
    test(`${lang} ${instrument}: classical melodic minor fits the 1440×900 workbench in both directions`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      await context.addInitScript((state) => {
        localStorage.setItem('music-theory-app', JSON.stringify({ state, version: 6 }));
      }, { themeMode: 'fermata', language: lang, lastView: 'explore', instrument, selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'melodic_minor', guitarScalePosition: 0 });
      const page = await context.newPage();
      await page.goto('/');
      await expect(page.getByTestId('scale-strip').locator('.strip-staff svg')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('button', { name: labels[lang].play })).toBeVisible();
      const cols = page.locator('.strip-col');
      for (const direction of ['up', 'down'] as const) {
        await page.getByRole('radio', { name: labels[lang][direction] }).click();
        // The preceding layout sweep leaves a chord selected; clear it so the
        // guitar is showing its scale dots rather than a chord voicing.
        const selectedChord = page.locator('.chord-row button[aria-pressed="true"]');
        if (await selectedChord.count()) await selectedChord.click();
        await expectInstrumentPitches(page, instrument, direction);
        await expect(cols).toHaveCount(8);
        expect(await cols.evaluateAll((xs) => xs.map((x) => x.getAttribute('data-note')))).toEqual(direction === 'up' ? ['A', 'B', 'C', 'D', 'E', 'F#', 'G#', 'A'] : ['A', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
        const chords = page.locator('.chord-row button');
        await expect(chords).toHaveCount(7);
        for (let i = 0; i < 7; i++) {
          if (await chords.nth(i).getAttribute('aria-pressed') !== 'true') await chords.nth(i).click();
          await expect(page.getByTestId('chord-detail')).toBeVisible();
          await page.waitForTimeout(400);
          const scroll = await page.evaluate(() => ['html', '.explore-main', '.explore-aside', '.strip-scroll'].map((sel) => {
            const el = document.querySelector(sel)!;
            return { sel, vertical: el.scrollHeight - el.clientHeight, horizontal: el.scrollWidth - el.clientWidth };
          }));
          for (const box of scroll) {
            expect(box.vertical, `${direction} chord ${i}: ${box.sel}`).toBeLessThanOrEqual(1);
            expect(box.horizontal, `${direction} chord ${i}: ${box.sel}`).toBeLessThanOrEqual(1);
          }
        }
        await audit(page, false);
      }
      await context.close();
    });
  }

  test(`${lang}: optional guitar lessons and their checks are searchable on a phone`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.addInitScript((language) => {
      localStorage.setItem('music-theory-app', JSON.stringify({ state: { language, lastView: 'learn', instrument: 'guitar', themeMode: 'fermata' }, version: 6 }));
    }, lang);
    const page = await context.newPage();
    await page.goto('/');
    for (const title of labels[lang].modules) {
      await page.getByTestId('app-topbar').getByRole('button', { name: searchLabels[lang], exact: true }).click();
      const dialog = page.getByRole('dialog').filter({ has: page.locator('input') });
      await expect(dialog).toBeVisible();
      await dialog.locator('input').fill(title);
      await dialog.getByRole('button', { name: new RegExp(`^${title}\\s+(Lesson|Lição|Lección)$`) }).click();
      await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
      await audit(page, true);
      await page.getByRole('button', { name: labels[lang].check }).click();
      await expect(page.locator('[data-testid="focused-check"]')).toBeVisible();
      await audit(page, true);
      // Leave the run using the actual exit control before searching another lesson.
      await page.getByRole('button', { name: /^(Exit the check|Sair da verificação|Salir de la comprobación)$/ }).click();
    }
    await context.close();
  });
}

test('descending melodic minor survives opening the full neck, in position and all-note modes', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(() => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: {
      themeMode: 'fermata', language: 'en', lastView: 'explore', instrument: 'guitar',
      selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'melodic_minor', guitarScalePosition: 0,
    }, version: 6 }));
  });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('radio', { name: labels.en.down }).click();
  await expectInstrumentPitches(page, 'guitar', 'down');
  await page.setViewportSize({ width: 844, height: 390 });
  await page.getByTestId('neck-open').click();
  const neck = page.getByTestId('neck-view');
  await expect(neck).toBeVisible();
  await expectInstrumentPitches(neck, 'guitar', 'down');
  await neck.getByRole('combobox', { name: 'Scale position' }).selectOption('all');
  await expectInstrumentPitches(neck, 'guitar', 'down');
  await page.keyboard.press('Escape');
  await expect(neck).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectInstrumentPitches(page, 'guitar', 'down');
  await page.getByRole('radio', { name: labels.en.up }).click();
  await expectInstrumentPitches(page, 'guitar', 'up');
  await context.close();
});
