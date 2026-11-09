import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * Chip rows and the phone keyboard (5 Nov eye review, brief E of 9 Nov):
 *  - the band under the phone keyboard says what it is for ("Slide here to
 *    scroll the keys") and its ‹ › show which way there is more;
 *  - the sideways rows (chord cards In key, the Build tab's interval steps,
 *    the octave chips) wear the staff strip's edge fades, only while the row
 *    overflows, in Day and Night; a row that fits has none;
 *  - a chord card's focus ring follows :focus-visible (keyboard only);
 *  - at 1440 px and wider, compatible-scale chips that do not fit are offered
 *    by a "+n" menu, reachable and usable from the keyboard.
 */

async function open(browser: Browser, opts: { w: number; h: number; touch?: boolean; theme?: string; lang?: string }) {
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
      themeMode: opts.theme ?? 'fermata', language: opts.lang ?? 'en', lastView: 'explore', instrument: 'piano', baseOctave: 4,
      selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', guitarScalePosition: 0,
    },
    version: 6,
  }));
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  return { context, page };
}

/** The fade state of the EdgeFade around `scroller`, as drawn. */
async function fades(page: Page, scroller: string) {
  return page.locator(scroller).first().evaluate((el) => {
    const host = el.parentElement!;
    const before = getComputedStyle(host, '::before');
    const after = getComputedStyle(host, '::after');
    return {
      host: host.classList.contains('edge-fade'),
      overflows: el.scrollWidth > el.clientWidth + 1,
      left: Number(before.opacity), right: Number(after.opacity),
      // The fade blends into the surface the row sits on.
      to: after.backgroundImage,
    };
  });
}

/** [left, right] fade opacity, read until settled: the reduced-motion rule
 * gives every property a 0.01 ms transition, which reads 0 at its start. */
const sides = (page: Page, scroller: string) => fades(page, scroller).then((f) => [f.left, f.right]);

async function scrollToEnd(page: Page, scroller: string) {
  await page.locator(scroller).first().evaluate((el) => { el.scrollLeft = el.scrollWidth; });
  await page.waitForTimeout(150);
}

const CHORD_ROW = '.chord-row';
const OCTAVES = '.piano-octave-row .chip-group';
const STEPS = '#chords-panel .overflow-x-auto';

for (const theme of ['fermata', 'fermata-night']) {
  test(`phone 390×844 ${theme}: the sideways rows fade only where there is more; the keyboard band says what it does`, async ({ browser }) => {
    const { context, page } = await open(browser, { w: 390, h: 844, touch: true, theme });
    try {
      for (const row of [CHORD_ROW, OCTAVES]) {
        const rest = await fades(page, row);
        expect(rest.host, `${row} is wrapped`).toBe(true);
        expect(rest.overflows, `${row} overflows on a phone`).toBe(true);
        await expect.poll(() => sides(page, row), { message: `${row} at rest` }).toEqual([0, 1]);
        await scrollToEnd(page, row);
        await expect.poll(() => sides(page, row), { message: `${row} at its end` }).toEqual([1, 0]);
      }
      // Each fade ends in the colour of the surface under its row.
      const surfaces = await page.evaluate(() => {
        const card = getComputedStyle(document.querySelector('.chords-card')!).backgroundColor;
        const keys = getComputedStyle(document.querySelector('[aria-label="Piano keyboard"]')!).backgroundColor;
        return { card, keys };
      });
      expect((await fades(page, CHORD_ROW)).to).toContain(surfaces.card);
      expect((await fades(page, OCTAVES)).to).toContain(surfaces.keys);

      // The band under the keys: labelled, its arrows follow the keyboard.
      const strip = page.getByTestId('scroll-strip');
      await expect(strip).toContainText('Slide here to scroll the keys');
      const arrows = async () => strip.evaluate((el) => Array.from(el.querySelectorAll('.scroll-strip-arrow')).map((a) => getComputedStyle(a).visibility));
      const keys = page.locator('.piano-scroll');
      await keys.evaluate((el) => { el.scrollLeft = 0; });
      await expect.poll(arrows).toEqual(['hidden', 'visible']);
      await keys.evaluate((el) => { el.scrollLeft = el.scrollWidth; });
      await expect.poll(arrows).toEqual(['visible', 'hidden']);
      // Its text reads (≥ 4.5:1 is the design sweep's job; here: on screen, 12 px+).
      const text = strip.locator('.scroll-strip-text');
      expect(parseFloat(await text.evaluate((el) => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(12);

      // The guitar's board fits a phone in its window: nothing to pan, no strip.
      await page.getByRole('radio', { name: 'Guitar' }).click();
      await expect(page.locator('.fretboard-scroll')).toBeVisible();
      await page.waitForTimeout(500);
      const board = await page.locator('.fretboard-scroll').evaluate((el) => el.scrollWidth > el.clientWidth + 1);
      if (board) await expect(page.getByTestId('scroll-strip')).toContainText('Slide here to scroll the frets');
      else await expect(page.getByTestId('scroll-strip')).toBeHidden();
      await page.getByRole('radio', { name: 'Piano' }).click();
      await expect(page.getByTestId('scroll-strip')).toBeVisible();

      // Build: the interval steps.
      await page.getByRole('tab', { name: 'Build' }).click();
      await expect(page.locator(STEPS)).toBeVisible();
      expect((await fades(page, STEPS)).overflows).toBe(true);
      await expect.poll(() => sides(page, STEPS)).toEqual([0, 1]);
      await scrollToEnd(page, STEPS);
      await expect.poll(() => sides(page, STEPS)).toEqual([1, 0]);
    } finally {
      await context.close();
    }
  });
}

test('laptop 1440×900: rows that fit show no fade', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1440, h: 900 });
  try {
    for (const row of [CHORD_ROW, OCTAVES]) {
      expect((await fades(page, row)).overflows, `${row} fits`).toBe(false);
      await expect.poll(() => sides(page, row), { message: row }).toEqual([0, 0]);
    }
    await page.getByRole('tab', { name: 'Build' }).click();
    await expect(page.locator(STEPS)).toBeVisible();
    expect((await fades(page, STEPS)).overflows).toBe(false);
    await expect.poll(() => sides(page, STEPS)).toEqual([0, 0]);
  } finally {
    await context.close();
  }
});

test('a chord card shows its focus ring for the keyboard only', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1440, h: 900 });
  try {
    const ii = page.getByRole('button', { name: 'D Minor chord, degree 2' });
    const ring = () => ii.evaluate((el) => ({ focused: document.activeElement === el, outline: getComputedStyle(el).outlineStyle }));
    // Mouse: open, then close the detail — focused, but no ring.
    await ii.click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    await ii.click();
    await expect(page.getByTestId('chord-detail')).toHaveCount(0);
    expect(await ring()).toEqual({ focused: true, outline: 'none' });
    // Keyboard: Shift+Tab away and back — now the ring shows, like any card.
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    expect(await ring()).toEqual({ focused: true, outline: 'solid' });
  } finally {
    await context.close();
  }
});

test('touch: tapping a chord card leaves no ring', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 390, h: 844, touch: true });
  try {
    const ii = page.getByRole('button', { name: 'D Minor chord, degree 2' });
    await ii.tap();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    await ii.tap();
    await expect(page.getByTestId('chord-detail')).toHaveCount(0);
    expect(await ii.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('none');
  } finally {
    await context.close();
  }
});

for (const { w, h } of [{ w: 1536, h: 864 }, { w: 1440, h: 900 }]) {
  test(`${w}×${h}: hidden compatible scales are offered by "+n", from the keyboard`, async ({ browser }) => {
    const { context, page } = await open(browser, { w, h });
    try {
      await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
      const detail = page.getByTestId('chord-detail');
      await expect(detail).toBeVisible();
      await page.waitForTimeout(300);
      const state = await detail.evaluate((el) => {
        const options = el.querySelector('.chord-scale-options')!;
        const chips = Array.from(options.children).filter((c) => c.tagName === 'BUTTON') as HTMLElement[];
        return {
          hidden: chips.filter((c) => getComputedStyle(c).display === 'none').map((c) => c.dataset.scale),
          shown: chips.filter((c) => getComputedStyle(c).display !== 'none').map((c) => c.dataset.scale),
        };
      });
      const more = page.getByTestId('chord-scale-more').getByRole('button');
      if (state.hidden.length === 0) {
        // Everything fits at this width: no "+n".
        await expect(page.getByTestId('chord-scale-more')).toHaveCount(0);
        return;
      }
      await expect(more).toBeVisible();
      await expect(more).toHaveText(`+${state.hidden.length}`);
      await expect(more).toHaveAccessibleName(`+${state.hidden.length} more scale${state.hidden.length > 1 ? 's' : ''}`);
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      // "+n" is inside the row, not cut off, and clear of the last chip.
      const fit = await detail.evaluate((el) => {
        const row = el.querySelector('.chord-scale-options')!.closest('.chord-detail-row')!.getBoundingClientRect();
        const btn = el.querySelector('[data-scale-more] button')!.getBoundingClientRect();
        const shown = Array.from(el.querySelectorAll('.chord-scale-options > button')).filter((c) => getComputedStyle(c).display !== 'none');
        const last = shown[shown.length - 1].getBoundingClientRect();
        return { inside: btn.left >= row.left - 1 && btn.right <= row.right + 1, clear: btn.left >= last.right, width: btn.width, height: btn.height };
      });
      expect(fit).toMatchObject({ inside: true, clear: true });
      expect(fit.width).toBeGreaterThanOrEqual(36);
      expect(fit.height).toBeGreaterThanOrEqual(36);

      // Keyboard: focus it, open with Enter, the hidden scales are the items.
      await more.focus();
      await page.keyboard.press('Enter');
      const menu = page.getByRole('menu', { name: 'Compatible Scales' });
      await expect(menu).toBeVisible();
      const items = menu.getByRole('menuitem');
      await expect(items).toHaveCount(state.hidden.length);
      await expect(items.first()).toBeFocused();
      const first = state.hidden[0]!;
      // Choosing one makes it the key, as a chip does (root = the chord's).
      await page.keyboard.press('Enter');
      await expect(menu).toHaveCount(0);
      await expect(page.getByRole('combobox', { name: 'Root' })).toHaveValue('7');
      await expect(page.getByRole('combobox', { name: 'Scale' })).toHaveValue(first);
    } finally {
      await context.close();
    }
  });
}
