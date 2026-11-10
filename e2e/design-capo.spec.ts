import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';
import { smallScreenAssertions, dialogButtonsFit } from './helpers/smallScreenAssertions';

/**
 * Wave 2, stream C: the capo under the design system's rules, in a real
 * browser — the same audit as e2e/design-system.spec.ts (type ≥ 12 px,
 * targets ≥ 44 px on touch / 36 px with a mouse, text contrast on what is
 * painted under it, nothing cut off, no sideways page scroll), on: the board
 * with a capo and a chord (its grip, the line, the board's "Capo 3"
 * control), the whole neck with a capo, the Open position at the capo, the
 * landscape full neck, and Settings with its Capo row. Phone 390×844, phone
 * sideways 844×390, tablet 768×1024 (touch) and laptop 1440×900, day and
 * night, in the owner's neck (nut right, thick string on top) and the new
 * visitor's (nut left, thin string on top); PT and ES at 320 and 360 px.
 *
 * `open` / `settle` / `check` repeat design-system.spec.ts's (they are local
 * to that spec). DESIGN_AUDIT_OUT=<dir> writes each screen's audit + a
 * screenshot there.
 */

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'phone-landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
const THEMES = [
  { name: 'day', mode: 'fermata' },
  { name: 'night', mode: 'fermata-night' },
] as const;
type Viewport = { name: string; viewport: { width: number; height: number }; touch: boolean };
const OUT = process.env.DESIGN_AUDIT_OUT;
const isSheet = (v: Viewport) => v.viewport.width < 640 || v.viewport.height <= 500;
const TAB_NECK = { neckNutSide: 'left', neckTopString: 'high' } as const;

const CAPO_SAVE = {
  instrument: 'guitar', lastView: 'explore',
  selectedKey: { natural: 'B', accidental: 'b' }, selectedScale: 'major', capoFret: 3,
};

async function open(browser: Browser, v: Viewport, theme: string, state: Record<string, unknown>, lang = 'en') {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { themeMode: theme, language: lang, ...state }, version: 6 }));
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await expect(page.locator('[role="grid"]').first()).toBeAttached({ timeout: 15_000 });
  await page.waitForTimeout(1200);
  return { context, page };
}

function expectClean(r: AuditResult, where: string) {
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the sweep did not run`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
}

async function settle(page: Page) {
  const snapshot = () => page.evaluate(() => {
    const running = document.getAnimations().filter((a) => a.playState === 'running' || a.pending).length;
    let sig = '';
    let waiting = 0;
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      const cs = getComputedStyle(el);
      if (cs.opacity !== '1' || cs.transform !== 'none') sig += `${cs.opacity}|${cs.transform};`;
      if ((el as HTMLElement).style?.opacity === '0') waiting++;
    }
    return { running, sig, waiting };
  });
  const start = Date.now();
  let prev = await snapshot();
  let quietSince = Date.now();
  while (Date.now() - start < 5000) {
    await page.waitForTimeout(60);
    const now = await snapshot();
    if (now.running > 0 || now.sig !== prev.sig) quietSince = Date.now();
    prev = now;
    const quiet = Date.now() - quietSince;
    if ((quiet >= 300 && now.waiting === 0) || quiet >= 1500) return;
  }
  throw new Error('the page never stopped moving (5 s)');
}

async function check(page: Page, v: Viewport, combo: string, screen: string) {
  await settle(page);
  await smallScreenAssertions(page, screen);
  await dialogButtonsFit(page);
  const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  if (OUT) {
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: `${OUT}/${combo}--${screen}.png` });
  }
  expectClean(r, `${combo} ${screen}`);
}

async function sheetTo(page: Page, v: Viewport, detent: 'half' | 'full') {
  if (!isSheet(v)) return;
  const handle = page.getByRole('separator', { name: /Instrument panel|Painel do instrumento|Panel del instrumento/ });
  await handle.focus();
  // Full = End; Half = Peek (Home), then one step up.
  if (detent === 'full') await page.keyboard.press('End');
  else { await page.keyboard.press('Home'); await page.keyboard.press('ArrowUp'); }
  await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', detent);
  await page.waitForTimeout(300);
}

async function openSettings(page: Page, lang: string) {
  await page.getByRole('button', { name: { en: 'More', pt: 'Mais', es: 'Más' }[lang], exact: true }).click();
  await page.getByRole('menuitem', { name: { en: 'Settings', pt: 'Definições', es: 'Ajustes' }[lang] }).click();
  const row = page.getByTestId('capo-setting');
  await row.scrollIntoViewIfNeeded();
  await expect(row).toBeVisible();
}

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    for (const [neckName, neck] of [['owner', {}], ['tabneck', TAB_NECK]] as const) {
      const combo = `${v.name}-${th.name}-${neckName}`;
      test(`${combo}: the capo on the board, the full neck and Settings pass the design rules`, async ({ browser }) => {
        test.setTimeout(180_000);
        {
          // The whole neck with a capo (a sheet at Full: the widest board).
          const sheet = isSheet(v) ? { dockDetents: { explore: 'full', learn: 'peek' }, dockChosen: { explore: true, learn: false } } : {};
          const { context, page } = await open(browser, v, th.mode, { ...CAPO_SAVE, guitarScalePosition: 'all', ...sheet, ...neck });
          await expect(page.locator('[data-capo-bar]')).toHaveCount(6);
          await check(page, v, combo, 'capo-whole-neck');
          await context.close();
        }
        {
          // The Open position at the capo, then B♭ as the G shape at the capo.
          const { context, page } = await open(browser, v, th.mode, { ...CAPO_SAVE, guitarScalePosition: null, ...neck });
          if (v.name !== 'phone-landscape') {
            await sheetTo(page, v, 'full');
            await expect(page.getByTestId('position-badge')).toHaveText('Open');
            await check(page, v, combo, 'capo-open-position');
            await sheetTo(page, v, 'half');
          }
          await page.getByRole('button', { name: 'Bb Major chord, degree 1' }).click();
          await expect(page.getByTestId('capo-line').first()).toHaveText('B♭: the G shape, capo on fret 3');
          await sheetTo(page, v, 'full');
          await check(page, v, combo, 'capo-chord');
          if (v.name === 'phone-landscape') {
            await page.getByTestId('neck-open').click();
            const neckView = page.getByTestId('neck-view');
            await expect(neckView.locator('[data-capo-bar]')).toHaveCount(6, { timeout: 15_000 });
            await page.waitForTimeout(400);
            await check(page, v, combo, 'capo-full-neck');
            const overflow = await neckView.evaluate((el) => el.scrollHeight - el.clientHeight);
            expect.soft(overflow, `${combo}: full neck has no vertical overflow`).toBeLessThanOrEqual(0);
            await page.getByRole('button', { name: 'Close full neck' }).click();
          }
          await openSettings(page, 'en');
          await check(page, v, combo, 'capo-settings');
          await context.close();
        }
      });
    }
  }
}

// PT and ES at 320 and 360 px: Settings' Capo row and the board's line.
for (const lang of ['pt', 'es'] as const) {
  for (const width of [320, 360]) {
    test(`${width}-${lang}: the capo's words fit and read`, async ({ browser }) => {
      test.setTimeout(120_000);
      const v: Viewport = { name: `phone${width}`, viewport: { width, height: width === 320 ? 568 : 740 }, touch: true };
      const { context, page } = await open(browser, v, 'fermata', { ...CAPO_SAVE, guitarScalePosition: null }, lang);
      await page.getByRole('button', { name: /^Acorde de Bb .*, gra(u|do) 1$/ }).click();
      await expect(page.getByTestId('capo-line').first()).toHaveText(lang === 'pt' ? 'B♭: a forma de G, capo no traste 3' : 'B♭: la forma de G, capo en el traste 3');
      await sheetTo(page, v, 'full');
      await check(page, v, `${v.name}-${lang}`, 'capo-chord');
      await openSettings(page, lang);
      await check(page, v, `${v.name}-${lang}`, 'capo-settings');
      await context.close();
    });
  }
}
