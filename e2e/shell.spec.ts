import { test, expect, type Page } from '@playwright/test';

/**
 * The app shell (W11-A, D-26 / D-28) in a real browser: the "⋯" menu and the
 * Settings sheet (keyboard, focus trap / return, Escape), the settings that
 * moved there, the tab highlight that can no longer drift, arrow keys on
 * choice chips, and the phone instrument sheet (keyboard, tap, drag, per-view
 * memory, safe-area padding).
 */

const seed = (page: Page, state: Record<string, unknown>) =>
  page.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { language: 'en', themeMode: 'fermata', ...state }, version: 6 }));

const more = (page: Page) => page.getByRole('button', { name: 'More', exact: true });

test.describe('"⋯" menu and Settings sheet', () => {
  test.beforeEach(async ({ page }) => {
    await seed(page, { lastView: 'explore' });
    await page.goto('/');
    await expect(more(page)).toBeVisible();
  });

  test('keyboard: open, move, Escape closes and returns focus; the sheet traps Tab and returns focus', async ({ page }) => {
    await more(page).focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu', { name: 'More' });
    await expect(menu).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Settings' })).toBeFocused();
    await page.keyboard.press('ArrowDown'); // wraps (one item today)
    await expect(page.getByRole('menuitem', { name: 'Settings' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(more(page)).toBeFocused();

    // Open Settings from the keyboard.
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Settings' })).toBeFocused();
    await page.keyboard.press('Enter');
    const sheet = page.getByRole('dialog', { name: 'Settings' });
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveAttribute('aria-modal', 'true');
    // Tab never leaves the sheet (20 presses, both directions).
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press(i < 10 ? 'Tab' : 'Shift+Tab');
      expect(await sheet.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(sheet).toHaveCount(0);
    await expect(more(page)).toBeFocused();
  });

  test('every setting that used to sit in the top bar is here and works', async ({ page }) => {
    await more(page).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    const sheet = page.getByRole('dialog', { name: 'Settings' });

    // Theme: Day / Night / Auto (Auto follows the system setting, live).
    await sheet.getByRole('radio', { name: 'Night' }).click();
    await expect(page.locator('html')).toHaveClass(/fermata-night/);
    await page.emulateMedia({ colorScheme: 'light' });
    await sheet.getByRole('radio', { name: 'Auto' }).click();
    await expect(page.locator('html')).not.toHaveClass(/fermata-night/);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveClass(/fermata-night/);
    await sheet.getByRole('radio', { name: 'Day' }).click();
    await expect(page.locator('html')).not.toHaveClass(/fermata-night/);

    // Data: export and import are here.
    await expect(sheet.getByRole('button', { name: 'Export backup' })).toBeVisible();
    await expect(sheet.getByRole('button', { name: 'Import backup' })).toBeVisible();

    // Footer: build date; "works offline" only with an active service worker.
    const footer = sheet.getByTestId('settings-footer');
    await expect(footer).toContainText(/Fermata · build \d{4}-\d{2}-\d{2}/);
    const controlled = await page.evaluate(() => !!navigator.serviceWorker?.controller);
    if (controlled) await expect(footer).toContainText('works offline');
    else await expect(footer).not.toContainText('works offline');

    // Language last: the whole UI switches (and the sheet with it).
    await sheet.getByRole('radio', { name: 'Português' }).click();
    await expect(page.getByRole('dialog', { name: 'Definições' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Explorar' })).toBeVisible();
  });

  test('a theme saved as Auto paints before React (dark system → night)', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await seed(page, { themeMode: 'auto' });
    await page.addInitScript(() => {
      (window as unknown as { __nightAt: number | null }).__nightAt = null;
      new MutationObserver(() => {
        const w = window as unknown as { __nightAt: number | null };
        if (w.__nightAt === null && document.documentElement?.classList.contains('fermata-night')) {
          w.__nightAt = document.getElementById('root')?.childElementCount ?? -1;
        }
      }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    });
    await page.goto('/');
    await expect(page.locator('#root')).not.toBeEmpty();
    const nightAt = await page.evaluate(() => (window as unknown as { __nightAt: number | null }).__nightAt);
    expect(nightAt).not.toBeNull();
    expect(nightAt!).toBeLessThanOrEqual(0);
    await context.close();
  });
});

test.describe('top bar tabs', () => {
  test('the highlight is the selected tab itself — aligned after fonts load, a resize and a language change', async ({ page }) => {
    await seed(page, { lastView: 'learn' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const check = async (name: string) => {
      const tab = page.getByRole('tab', { name });
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      const r = await page.getByRole('tablist').first().evaluate((list) => {
        const sel = list.querySelector('[aria-selected="true"]') as HTMLElement;
        const label = sel.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(sel);
        const text = range.getBoundingClientRect();
        return {
          // No separate, separately-measured indicator element any more.
          indicators: Array.from(list.children).filter((c) => getComputedStyle(c).position === 'absolute').length,
          bg: getComputedStyle(sel).backgroundColor,
          others: Array.from(list.querySelectorAll('[role="tab"]:not([aria-selected="true"])')).map((o) => getComputedStyle(o).backgroundColor),
          textInside: text.left >= label.left - 0.5 && text.right <= label.right + 0.5,
        };
      });
      expect(r.indicators).toBe(0);
      expect(r.others.every((b) => b !== r.bg)).toBe(true);
      expect(r.textInside).toBe(true);
    };
    await check('Learn');
    await page.setViewportSize({ width: 390, height: 844 });
    await check('Learn');
    await page.setViewportSize({ width: 844, height: 390 }); // orientation change
    await check('Learn');
    await page.evaluate(() => {
      const raw = JSON.parse(localStorage.getItem('music-theory-app')!);
      raw.state.language = 'es';
      localStorage.setItem('music-theory-app', JSON.stringify(raw));
    });
    await page.reload();
    await check('Aprender');
  });
});

test('choice chips: one Tab stop, arrow keys move and select', async ({ page }) => {
  await seed(page, { lastView: 'explore', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major' });
  await page.goto('/');
  const roots = page.getByRole('radiogroup', { name: 'Root' });
  const c = roots.getByRole('radio', { name: 'C', exact: true });
  await expect(c).toHaveAttribute('aria-checked', 'true');
  await expect(c).toHaveAttribute('tabindex', '0');
  await expect(roots.getByRole('radio', { name: 'D', exact: true })).toHaveAttribute('tabindex', '-1');
  await c.focus();
  await page.keyboard.press('ArrowRight');
  const db = roots.getByRole('radio', { name: 'Db', exact: true });
  await expect(db).toBeFocused();
  await expect(db).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft'); // wraps to B
  await expect(roots.getByRole('radio', { name: 'B', exact: true })).toHaveAttribute('aria-checked', 'true');
});

test.describe('phone instrument sheet (D-26)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('Peek / Half / Full by keyboard, the Show button, a tap and a drag; remembered per view; Learn starts at Peek', async ({ page }) => {
    await seed(page, { lastView: 'explore', instrument: 'piano' });
    await page.goto('/');
    const dock = page.getByTestId('instrument-dock');
    const handle = page.getByRole('separator', { name: 'Instrument panel' });
    await expect(dock).toHaveAttribute('data-detent', 'half'); // Explore's default

    await handle.focus();
    await page.keyboard.press('Home');
    await expect(dock).toHaveAttribute('data-detent', 'peek');
    await expect(handle).toHaveAttribute('aria-valuetext', 'Peek');
    // Collapsed to its bar: the instrument stays mounted but takes no room and
    // is inert (no Tab stops, hidden from assistive tech).
    const content = dock.locator('.detent-content');
    await expect(content).toHaveAttribute('inert', '');
    await expect(content).toHaveCSS('height', '0px');
    await page.keyboard.press('ArrowUp');
    await expect(dock).toHaveAttribute('data-detent', 'half');
    await page.keyboard.press('End');
    await expect(dock).toHaveAttribute('data-detent', 'full');
    await page.keyboard.press('Enter');
    await expect(dock).toHaveAttribute('data-detent', 'peek');

    // The bar's Show / Hide button.
    await dock.getByRole('button', { name: 'Show' }).click();
    await expect(dock).toHaveAttribute('data-detent', 'half');
    await expect(content).not.toHaveAttribute('inert', '');
    await expect(page.locator('[data-tour="play-note"]')).toBeInViewport();
    await dock.getByRole('button', { name: 'Hide' }).click();
    await expect(dock).toHaveAttribute('data-detent', 'peek');

    // Drag the handle up past the middle → Full.
    const box = (await handle.boundingBox())!;
    const x = box.x + 20;
    const y = box.y + 8;
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) await page.mouse.move(x, y - i * 60);
    await page.mouse.up();
    await expect(dock).toHaveAttribute('data-detent', 'full');

    // Remembered across a reload, per view; Learn starts at Peek.
    await page.reload();
    await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'full');
    await page.getByRole('tab', { name: 'Learn' }).click();
    await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'peek');
    await page.getByRole('tab', { name: 'Explore' }).click();
    await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'full');
  });

  test('a tap on the handle steps up; the sheet keeps the bottom safe area', async ({ page }) => {
    await seed(page, { lastView: 'explore', dockDetents: { explore: 'peek', learn: 'peek' } });
    await page.goto('/');
    const dock = page.getByTestId('instrument-dock');
    await expect(dock).toHaveAttribute('data-detent', 'peek');
    const handle = page.getByRole('separator', { name: 'Instrument panel' });
    const box = (await handle.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + 6); // the grip strip, clear of the bar's buttons
    await expect(dock).toHaveAttribute('data-detent', 'half');
    const pad = await dock.evaluate((el) => getComputedStyle(el).paddingBottom);
    expect(pad).toMatch(/px$/); // env(safe-area-inset-bottom) resolves (0 px off-notch)
    expect(await dock.evaluate((el) => el.getAttribute('style') ?? '')).toMatch(/height/);
  });
});
