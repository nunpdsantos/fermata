import { test, expect } from '@playwright/test';
import { buildScale, SCALE_FORMULAS } from '../src/core/constants/scales';
import { getDiatonicChordsForScale } from '../src/core/constants/chords';
import { getKeyScaleSuggestions } from '../src/core/constants/chordScaleRelationships';
import type { ScaleType } from '../src/core/types/music';

// Seat execution only. Use actual rendered widths, including the loaded font,
// translated labels, formula and lesson link; no estimated per-letter widths.
const catalogue = Object.keys(SCALE_FORMULAS) as ScaleType[];
const root = { natural: 'A', accidental: '' } as const;

for (const language of ['en', 'pt', 'es'] as const) {
  for (const instrument of ['piano', 'guitar'] as const) {
    for (const selectedScale of catalogue) {
      test(`${language} ${instrument} ${selectedScale}: every In-key chord has two detail rows at 1440×900`, async ({ browser }) => {
        expect(catalogue).toHaveLength(37);
        const context = await browser.newContext({
          viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block',
        });
        try {
          await context.addInitScript((state) => {
            localStorage.setItem('music-theory-app', JSON.stringify({ state, version: 6 }));
          }, {
            language, instrument, selectedScale, selectedKey: root,
            themeMode: 'fermata', lastView: 'explore', guitarScalePosition: 0,
          });
          const page = await context.newPage();
          await page.goto('/');
          await expect(page.getByTestId('scale-strip').locator('.strip-staff svg')).toBeVisible({ timeout: 15_000 });
          await page.evaluate(() => document.fonts.ready);
          const scale = buildScale(root, selectedScale);
          const chords = getDiatonicChordsForScale(scale);
          const cards = page.locator('.chord-row button');
          await expect(cards).toHaveCount(chords.length);
          // Scales with no In-key triads must not silently reuse a stale detail.
          await expect(page.getByTestId('chord-detail')).toHaveCount(0);
          for (const [index, { chord }] of chords.entries()) {
            await test.step(`chord ${index + 1}: ${chord.root.natural}${chord.root.accidental} ${chord.quality}`, async () => {
              await cards.nth(index).click();
              const detail = page.getByTestId('chord-detail');
              await expect(detail).toBeVisible();
              // Let ResizeObserver and the existing scroll landing settle.
              await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
              const geometry = await detail.evaluate((el) => {
                const rows = Array.from(el.querySelectorAll<HTMLElement>('.chord-detail-row'));
                const main = el.querySelector<HTMLElement>('.chord-detail-main')!;
                const options = el.querySelector<HTMLElement>('.chord-scale-options');
                const chips = Array.from(options?.querySelectorAll<HTMLButtonElement>('button') ?? []);
                const visible = chips.filter((chip) => getComputedStyle(chip).display !== 'none');
                const row = rows[1].getBoundingClientRect();
                const link = rows[1].querySelector<HTMLElement>('.btn-link')!;
                const controls = [...visible, link];
                const gap = options ? parseFloat(getComputedStyle(options).columnGap) : 0;
                const widths = chips.map((chip) => {
                  const hidden = chip.hasAttribute('data-fit-hidden');
                  chip.removeAttribute('data-fit-hidden');
                  const width = chip.getBoundingClientRect().width;
                  chip.toggleAttribute('data-fit-hidden', hidden);
                  return width;
                });
                return {
                  tap: parseFloat(getComputedStyle(el).getPropertyValue('--tap')),
                  heights: rows.map((r) => r.getBoundingClientRect().height),
                  height: main.getBoundingClientRect().height,
                  rowGap: parseFloat(getComputedStyle(main).rowGap),
                  overflow: rows.map((r) => r.scrollWidth - r.clientWidth),
                  visible: visible.map((chip) => chip.dataset.scale),
                  keyVisible: visible.some((chip) => chip.dataset.keyNotes === 'true'),
                  widths, gap, available: options?.getBoundingClientRect().width ?? 0,
                  controls: controls.map((control) => {
                    const box = control.getBoundingClientRect();
                    return { width: box.width, height: box.height, font: parseFloat(getComputedStyle(control).fontSize),
                      inside: box.left >= row.left - 1 && box.right <= row.right + 1 && box.top >= row.top - 1 && box.bottom <= row.bottom + 1 };
                  }),
                  collisions: controls.slice(1).some((control, i) => control.getBoundingClientRect().left < controls[i].getBoundingClientRect().right),
                };
              });
              expect(geometry.heights).toHaveLength(2);
              for (const height of geometry.heights) expect(height).toBeLessThanOrEqual(geometry.tap + 1);
              expect(geometry.height).toBeLessThanOrEqual(2 * geometry.tap + geometry.rowGap + 1);
              for (const overflow of geometry.overflow) expect(overflow).toBeLessThanOrEqual(1);
              for (const control of geometry.controls) {
                expect(control.inside).toBe(true);
                expect(control.width).toBeGreaterThanOrEqual(36);
                expect(control.height).toBeGreaterThanOrEqual(36);
                expect(control.font).toBeGreaterThanOrEqual(12);
              }
              expect(geometry.collisions).toBe(false);
              const priority = { primary: 0, secondary: 1, color: 2 };
              const suggestions = [...getKeyScaleSuggestions(chord, scale)].sort((a, b) =>
                Number(!!b.keyNotes) - Number(!!a.keyNotes) || priority[a.fit] - priority[b.fit]);
              expect(geometry.visible).toEqual(suggestions.slice(0, geometry.visible.length).map((s) => s.scale));
              if (suggestions.some((s) => s.keyNotes)) expect(geometry.keyVisible).toBe(true);
              const next = geometry.visible.length + 1;
              if (next <= suggestions.length) {
                // Maximal prefix: don't drop a chip that could fit in priority order.
                expect(geometry.widths.slice(0, next).reduce((sum, width) => sum + width, 0) + (next - 1) * geometry.gap)
                  .toBeGreaterThan(geometry.available - 1);
              }
            });
          }
        } finally {
          await context.close();
        }
      });
    }
  }
}
