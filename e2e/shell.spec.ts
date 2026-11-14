import * as fs from 'node:fs';
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
// "Report a problem" (2026-11-12), the row after the metronome where it is offered: its words from the locale file.
const REPORT = (lang: 'en' | 'pt' | 'es') => (JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}.json`, 'utf8')) as { report: { menuItem: string } }).report.menuItem;

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
    // Wave 3: the whole menu, exactly, in this order (Search only below
    // 360 px, Update only while one waits); since 2026-11-12 "Report a problem" last.
    await expect(page.getByRole('menuitem')).toHaveText(['Settings', 'Show me around', 'Tuner', 'Metronome', REPORT('en')]);
    await expect(page.getByRole('menuitem', { name: 'Settings' })).toBeFocused();
    await page.keyboard.press('ArrowDown'); // the next items, then wraps
    await expect(page.getByRole('menuitem', { name: 'Show me around' })).toBeFocused();
    await page.keyboard.press('ArrowDown'); // wave 3: the tuner
    await expect(page.getByRole('menuitem', { name: 'Tuner' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Metronome' })).toBeFocused();
    await page.keyboard.press('ArrowDown'); // 2026-11-12: Report a problem
    await expect(page.getByRole('menuitem', { name: REPORT('en'), exact: true })).toBeFocused();
    await page.keyboard.press('ArrowDown');
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
    // The production build's worker claims the page a moment after load
    // (clientsClaim) and the footer follows the controller live: wait for
    // that control explicitly — reading it once raced it (W11-B delta
    // review). The dev server has no worker: never controlled there.
    const footer = sheet.getByTestId('settings-footer');
    await expect(footer).toContainText(/Fermatina · build \d{4}-\d{2}-\d{2}/);
    const manifest = await page.request.get('/manifest.webmanifest');
    const productionBuild = (manifest.headers()['content-type'] ?? '').includes('json');
    if (productionBuild) {
      await page.waitForFunction(() => !!navigator.serviceWorker?.controller, undefined, { timeout: 20_000 });
      await expect(footer).toContainText('works offline');
    } else {
      expect(await page.evaluate(() => !!navigator.serviceWorker?.controller)).toBe(false);
      await expect(footer).not.toContainText('works offline');
    }

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

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`the skip link is visible ABOVE the top bar when focused (review B1) — ${vp.width} px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: vp, hasTouch: vp.width < 640, isMobile: vp.width < 640 });
    const page = await context.newPage();
    await seed(page, { lastView: 'explore' });
    await page.goto('/');
    await expect(more(page)).toBeVisible();
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    const box = (await skip.boundingBox())!;
    expect(box.width).toBeGreaterThan(20);
    // What a pointer at its centre hits is the link itself — not the top bar.
    const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href') ?? null, [box.x + box.width / 2, box.y + box.height / 2]);
    expect(hit).toBe('#main-content');
    await context.close();
  });
}

// 2026-11-14: "Fermatina" is two letters longer than "Fermata", and from 640 to 743 px it ran
// under the tab strip in PT / ES. The word is drawn from 744 px only; below, the mark alone (as on
// phones), the name kept for screen readers. Drawn = a real box beside the mark; not drawn = the
// screen-reader-only box (1 px, clipped). Every language, touch and mouse, Explore and Learn.
test('the wordmark is drawn from 744 px only (not at 743): never under the tabs, always named', async ({ browser }) => {
  test.setTimeout(120_000);
  const names = { en: 'Explore', pt: 'Explorar', es: 'Explorar' } as const;
  for (const lang of ['en', 'pt', 'es'] as const) {
    for (const touch of [true, false]) {
      const context = await browser.newContext({ viewport: { width: 743, height: 800 }, isMobile: touch, hasTouch: touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      await seed(page, { language: lang, lastView: 'explore' });
      await page.goto('/');
      await expect(page.getByRole('tab', { name: names[lang] })).toBeVisible();
      for (const width of [639, 640, 743, 744, 768, 1024]) {
        await page.setViewportSize({ width, height: 800 });
        await page.waitForTimeout(150);
        const m = await page.evaluate(() => {
          const brand = document.querySelector('.app-brand') as HTMLElement;
          const b = brand.getBoundingClientRect();
          const tabs = document.querySelector('.app-tabs')!.getBoundingClientRect();
          return { width: b.width, right: b.right, tabsLeft: tabs.left, clip: getComputedStyle(brand).clipPath, text: brand.textContent };
        });
        const where = `${lang} ${touch ? 'touch' : 'mouse'} ${width}px`;
        expect(m.text, `${where}: the name is there for screen readers`).toBe('Fermatina');
        if (width >= 744) {
          expect(m.width, `${where}: the word is drawn`).toBeGreaterThan(40);
          expect(m.clip, `${where}: not clipped`).toBe('none');
          expect(m.right, `${where}: the word ends before the tabs begin`).toBeLessThanOrEqual(m.tabsLeft);
        } else {
          expect(m.width, `${where}: the word is not drawn (screen-reader only)`).toBeLessThanOrEqual(1);
        }
      }
      await context.close();
    }
  }
});

test('choice chips: one Tab stop, arrow keys move and select', async ({ page }) => {
  // The piano's octave chips (the root chips moved into the phone's key
  // picker sheet with the Explore workbench, W11-B).
  await seed(page, { lastView: 'explore', instrument: 'piano', baseOctave: 4, selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major' });
  await page.goto('/');
  const octaves = page.getByRole('radiogroup', { name: 'Base octave' });
  const c4 = octaves.getByRole('radio', { name: 'C4', exact: true });
  await expect(c4).toHaveAttribute('aria-checked', 'true');
  await expect(c4).toHaveAttribute('tabindex', '0');
  await expect(octaves.getByRole('radio', { name: 'C5', exact: true })).toHaveAttribute('tabindex', '-1');
  await c4.focus();
  await page.keyboard.press('ArrowRight');
  const c5 = octaves.getByRole('radio', { name: 'C5', exact: true });
  await expect(c5).toBeFocused();
  await expect(c5).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Home');
  const radios = octaves.getByRole('radio');
  await expect(radios.first()).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('ArrowLeft'); // wraps to the last
  await expect(radios.last()).toHaveAttribute('aria-checked', 'true');
});

test.describe('phone instrument sheet (D-26)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('Peek / Half / Full by keyboard, the Show button, a tap and a drag; remembered per view; Learn starts at Peek', async ({ page }) => {
    // The guitar: its board and controls are taller than Half, so the sheet
    // has all three stops (the keyboard fits at Half — next test).
    await seed(page, { lastView: 'explore', instrument: 'guitar' });
    await page.goto('/');
    const dock = page.getByTestId('instrument-dock');
    const handle = page.getByRole('separator', { name: 'Instrument panel' });
    await expect(dock).toHaveAttribute('data-detent', 'half'); // Explore's default
    await expect(page.locator('.fretboard-scroll')).toBeVisible();
    await expect(handle).toHaveAttribute('aria-valuemax', '2');

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

  test('never taller than its content: the keyboard leaves no empty band, has no separate Full, and the view stays live', async ({ page }) => {
    // 9 Nov (brief G): at 390×844 the keyboard ended 91 px above the sheet's
    // bottom at Half (407 px at Full). A Full the learner chose for the
    // guitar shows as Half under the keyboard; the guitar keeps its Full.
    await seed(page, { lastView: 'explore', instrument: 'piano', dockDetents: { explore: 'full', learn: 'peek' }, dockChosen: { explore: true, learn: false } });
    await page.goto('/');
    const dock = page.getByTestId('instrument-dock');
    const handle = page.getByRole('separator', { name: 'Instrument panel' });
    await expect(dock).toHaveAttribute('data-detent', 'half');
    await expect(handle).toHaveAttribute('aria-valuetext', 'Half');
    await expect(handle).toHaveAttribute('aria-valuemax', '1');
    await expect(page.locator('#main-content')).not.toHaveAttribute('inert', '');
    const band = () => dock.evaluate((sheet) => {
      const region = sheet.querySelector('#instrument-region')!.getBoundingClientRect();
      const s = sheet.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(sheet).paddingBottom) || 0;
      return { band: Math.round(s.bottom - pad - region.bottom), scrolls: sheet.querySelector('.detent-content')!.scrollHeight > sheet.querySelector('.detent-content')!.clientHeight + 1 };
    });
    expect(await band()).toEqual({ band: 0, scrolls: false });
    // The view got the room back: the sheet is the bar + the keyboard.
    const viewH = (await page.locator('#main-content').boundingBox())!.height;
    expect(viewH).toBeGreaterThan(844 / 2 + 40);
    // ↑ / End: nothing more to show; a tap folds it; Enter opens it again.
    await handle.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('ArrowUp');
    await expect(dock).toHaveAttribute('data-detent', 'half');
    const box = (await handle.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + 6);
    await expect(dock).toHaveAttribute('data-detent', 'peek');
    await handle.focus();
    await page.keyboard.press('Enter');
    await expect(dock).toHaveAttribute('data-detent', 'half');
    expect(await band()).toEqual({ band: 0, scrolls: false });
    // The guitar does need Full: three stops, and Full ends with the content.
    await dock.getByRole('radio', { name: 'Guitar' }).click();
    await expect(page.locator('.fretboard-scroll')).toBeVisible();
    await expect(handle).toHaveAttribute('aria-valuemax', '2');
    await handle.focus();
    await page.keyboard.press('End');
    await expect(dock).toHaveAttribute('data-detent', 'full');
    await expect(page.locator('#main-content')).toHaveAttribute('inert', '');
    await expect.poll(band).toEqual({ band: 0, scrolls: false });
    // Back to the keyboard: the saved Full shows as Half again.
    await dock.getByRole('radio', { name: 'Piano' }).click();
    await expect(dock).toHaveAttribute('data-detent', 'half');
    await expect(page.locator('#main-content')).not.toHaveAttribute('inert', '');
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

test('below 360 px the tabs keep their room: Search moves into the "⋯" menu; nothing scrolls sideways (PT)', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await seed(page, { language: 'pt', lastView: 'explore' });
  await page.goto('/');
  await expect(page.getByRole('tab', { name: 'Treino' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Pesquisa rápida/ })).toHaveCount(0);
  // The last tab ends before the menu button starts.
  const lastTab = (await page.getByRole('tab', { name: 'Treino' }).boundingBox())!;
  const menuButton = (await page.getByRole('button', { name: 'Mais', exact: true }).boundingBox())!;
  expect(lastTab.x + lastTab.width).toBeLessThanOrEqual(menuButton.x + 0.5);
  expect(await page.evaluate(() => document.scrollingElement!.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole('button', { name: 'Mais', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Pesquisar' }).click();
  // Quick Search (a lazy chunk) opens as a dialog.
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 });
  await context.close();
});

