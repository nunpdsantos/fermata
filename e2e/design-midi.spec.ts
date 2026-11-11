import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';
import { smallScreenAssertions, dialogButtonsFit } from './helpers/smallScreenAssertions';
import { installFakeMidi, noteOn } from './helpers/fakeMidi';

/**
 * Wave 3, stream K: the MIDI keyboard's screens under the design system's
 * rules, in a real browser — the same audit as e2e/design-system.spec.ts
 * (type ≥ 12 px, targets ≥ 44 px on touch / 36 px with a mouse, text
 * contrast on what is painted under it, nothing cut off, no sideways page
 * scroll), on: Settings' "MIDI keyboard" row off, on with a keyboard, on with
 * none connected, and in a browser without Web MIDI; and the dock bar with
 * its mark (a key held, so the read-out names a note beside it). The mark
 * must not change the bar's height or move the instrument, measured with
 * and without it in the same run. Phone 390×844, phone sideways 844×390,
 * tablet 768×1024 (touch) and laptop 1440×900, day and night; PT and ES at
 * 320 and 360 px. Web MIDI is faked (e2e/helpers/fakeMidi.ts); no real
 * keyboard. DESIGN_AUDIT_OUT=<dir> writes each screen's audit + a screenshot.
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
type Midi = 'device' | 'none' | 'unsupported';
const OUT = process.env.DESIGN_AUDIT_OUT;

const W = {
  en: { more: 'More', settings: 'Settings', toggle: 'Use a MIDI keyboard', connected: 'Connected: Test Piano', none: 'No MIDI keyboard is connected.', unsupported: 'This browser cannot use a MIDI keyboard' },
  pt: { more: 'Mais', settings: 'Definições', toggle: 'Usar um teclado MIDI', connected: 'Ligado: Test Piano', none: 'Não há nenhum teclado MIDI ligado.', unsupported: 'Este navegador não consegue usar um teclado MIDI' },
  es: { more: 'Más', settings: 'Ajustes', toggle: 'Usar un teclado MIDI', connected: 'Conectado: Test Piano', none: 'No hay ningún teclado MIDI conectado.', unsupported: 'Este navegador no puede usar un teclado MIDI' },
} as const;
type Lang = keyof typeof W;

async function open(browser: Browser, v: Viewport, theme: string, midi: Midi, lang: Lang = 'en') {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  if (midi === 'unsupported') {
    // Chromium has Web MIDI: take it away, as Safari has none.
    await context.addInitScript(() => {
      delete (Navigator.prototype as unknown as Record<string, unknown>).requestMIDIAccess;
    });
  } else {
    await installFakeMidi(context, midi === 'device' ? [['kbd', 'Test Piano']] : []);
  }
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { themeMode: theme, language: lang, instrument: 'piano', lastView: 'explore', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major' }, version: 6 }));
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await expect(page.getByTestId('instrument-dock')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1000);
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

async function openSettings(page: Page, lang: Lang) {
  await page.getByRole('button', { name: W[lang].more, exact: true }).click();
  await page.getByRole('menuitem', { name: W[lang].settings }).click();
  const row = page.getByTestId('midi-setting');
  await row.scrollIntoViewIfNeeded();
  await expect(row).toBeVisible();
  return row;
}

async function closeSettings(page: Page) {
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('settings-sheet')).toHaveCount(0);
  // A mouse left over a key would be the focus note (hover wins over the last note played).
  await page.mouse.move(2, 2);
}

/** The dock bar and the instrument under it, measured. */
const dockBoxes = (page: Page) => page.evaluate(() => {
  const r = (sel: string) => {
    const b = document.querySelector(sel)?.getBoundingClientRect();
    return b ? { top: Math.round(b.top * 2) / 2, height: Math.round(b.height * 2) / 2 } : null;
  };
  return { bar: r('.dock-bar-row'), keys: r('#instrument-region') };
});

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo}: the MIDI keyboard's Settings row and the dock mark pass the design rules`, async ({ browser }) => {
      test.setTimeout(180_000);
      {
        const { context, page } = await open(browser, v, th.mode, 'device');
        const before = await dockBoxes(page);
        await expect(page.getByTestId('midi-mark')).toHaveCount(0);
        const row = await openSettings(page, 'en');
        await expect(row.getByRole('button', { name: W.en.toggle })).toHaveAttribute('aria-pressed', 'false');
        await check(page, v, combo, 'midi-settings-off');
        await row.getByRole('button', { name: W.en.toggle }).click();
        await expect(row.getByTestId('midi-status')).toHaveText(W.en.connected);
        await check(page, v, combo, 'midi-settings-on-device');
        await closeSettings(page);
        await expect(page.getByTestId('midi-mark')).toBeVisible();
        // The mark changes neither the bar's height nor where the instrument sits.
        expect(await dockBoxes(page), `${combo}: the mark moves nothing`).toEqual(before);
        // A key held: the read-out names it beside the mark.
        await page.evaluate((b) => (window as unknown as { __midi: { send: (i: string, b: number[]) => void } }).__midi.send('kbd', b), noteOn(64));
        await expect(page.locator('[data-piano-key][data-midi="64"]')).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByTestId('dock-readout')).toContainText(/^E\b/);
        await check(page, v, combo, 'midi-dock-mark');
        expect(await dockBoxes(page), `${combo}: a held key moves nothing`).toEqual(before);
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, 'none');
        const row = await openSettings(page, 'en');
        await row.getByRole('button', { name: W.en.toggle }).click();
        await expect(row.getByTestId('midi-status')).toContainText(W.en.none);
        await check(page, v, combo, 'midi-settings-on-none');
        await closeSettings(page);
        await expect(page.getByTestId('midi-mark')).toHaveCount(0);
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, 'unsupported');
        const row = await openSettings(page, 'en');
        await expect(row.getByTestId('midi-status')).toContainText(W.en.unsupported);
        await expect(row.getByRole('button')).toHaveCount(0);
        await check(page, v, combo, 'midi-settings-unsupported');
        await context.close();
      }
    });
  }
}

// PT and ES at 320 and 360 px: every state of the row, and the dock with its mark.
for (const lang of ['pt', 'es'] as const) {
  for (const width of [320, 360]) {
    test(`${width}-${lang}: the MIDI keyboard's words fit and read`, async ({ browser }) => {
      test.setTimeout(150_000);
      const v: Viewport = { name: `phone${width}`, viewport: { width, height: width === 320 ? 568 : 740 }, touch: true };
      const combo = `${v.name}-${lang}`;
      {
        const { context, page } = await open(browser, v, 'fermata', 'device', lang);
        const row = await openSettings(page, lang);
        await check(page, v, combo, 'midi-settings-off');
        await row.getByRole('button', { name: W[lang].toggle }).click();
        await expect(row.getByTestId('midi-status')).toHaveText(W[lang].connected);
        await check(page, v, combo, 'midi-settings-on-device');
        await closeSettings(page);
        await page.evaluate((b) => (window as unknown as { __midi: { send: (i: string, b: number[]) => void } }).__midi.send('kbd', b), noteOn(64));
        await expect(page.getByTestId('midi-mark')).toBeVisible();
        await check(page, v, combo, 'midi-dock-mark');
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, 'fermata', 'none', lang);
        const row = await openSettings(page, lang);
        await row.getByRole('button', { name: W[lang].toggle }).click();
        await expect(row.getByTestId('midi-status')).toContainText(W[lang].none);
        await check(page, v, combo, 'midi-settings-on-none');
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, 'fermata', 'unsupported', lang);
        const row = await openSettings(page, lang);
        await expect(row.getByTestId('midi-status')).toContainText(W[lang].unsupported);
        await check(page, v, combo, 'midi-settings-unsupported');
        await context.close();
      }
    });
  }
}
