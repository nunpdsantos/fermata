import { expect, type Browser, type Page } from '@playwright/test';
import { auditPage } from './designAudit';
import { smallScreenAssertions, dialogButtonsFit } from './smallScreenAssertions';

/**
 * Shared by the wave-1 integration specs (wave1-seams.spec.ts,
 * wave1-journeys.spec.ts): a TRULY new browser (no welcome flag, no settings
 * save — the configs seed both for every other spec), a seeded one, the
 * design audit, and what the guitar neck draws.
 */

export interface View { name: string; viewport: { width: number; height: number }; touch: boolean }

export const PHONE: View = { name: 'phone', viewport: { width: 390, height: 844 }, touch: true };
export const PHONE_320: View = { name: 'phone-320', viewport: { width: 320, height: 568 }, touch: true };
export const LANDSCAPE: View = { name: 'landscape', viewport: { width: 844, height: 390 }, touch: true };
export const TABLET: View = { name: 'tablet', viewport: { width: 820, height: 1180 }, touch: true };
export const LAPTOP: View = { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false };

export type Lang = 'en' | 'pt' | 'es';
export const LOCALE: Record<Lang, string> = { en: 'en-GB', pt: 'pt-PT', es: 'es-ES' };

/** Every app key in storage, sorted (the start screen's "has this visitor used the app?" reads these). */
export const appKeys = (page: Page) => page.evaluate(() =>
  Object.keys(localStorage).filter((k) => k.startsWith('music-theory') || k.startsWith('fermata-')).sort());

export const savedState = (page: Page) => page.evaluate(() =>
  JSON.parse(localStorage.getItem('music-theory-app') ?? '{}').state ?? {}) as Promise<Record<string, unknown>>;

/**
 * A browser that has never opened Fermata: empty storage, the browser's
 * language as given. `extraInit` runs before the app on every page load.
 */
export async function freshBrowser(browser: Browser, v: View, lang: Lang = 'en', opts: { reducedMotion?: boolean; permissions?: string[] } = {}) {
  const context = await browser.newContext({
    viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch,
    reducedMotion: opts.reducedMotion === false ? 'no-preference' : 'reduce',
    serviceWorkers: 'block', locale: LOCALE[lang], storageState: { cookies: [], origins: [] },
    permissions: opts.permissions,
  });
  const page = await context.newPage();
  return { context, page };
}

/**
 * A browser with saved data: the welcome flag 'seen', the given settings save
 * (written as-is: a save without the neck fields is a learner from before
 * them) and any other store, seeded once (a reload keeps what the app saved).
 */
export async function seededBrowser(
  browser: Browser, v: View,
  settings: Record<string, unknown>,
  extra: Record<string, string> = {},
  opts: { lang?: Lang; reducedMotion?: boolean; permissions?: string[]; raw?: string } = {},
) {
  const context = await browser.newContext({
    viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch,
    reducedMotion: opts.reducedMotion === false ? 'no-preference' : 'reduce',
    serviceWorkers: 'block', locale: LOCALE[opts.lang ?? 'en'], storageState: { cookies: [], origins: [] },
    permissions: opts.permissions,
  });
  await context.addInitScript(([blob, items]) => {
    if (sessionStorage.getItem('__w1seeded')) return;
    localStorage.clear();
    localStorage.setItem('fermata-welcome-v1', 'seen');
    localStorage.setItem('music-theory-app', blob);
    for (const [k, val] of Object.entries(items)) localStorage.setItem(k, val);
    sessionStorage.setItem('__w1seeded', '1');
  }, [opts.raw ?? JSON.stringify({ state: settings, version: 6 }), extra] as const);
  const page = await context.newPage();
  return { context, page };
}

/** Nothing on the page is moving (the design sweep's rule, e2e/design-system.spec.ts). */
export async function settle(page: Page) {
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

/** The design sweep's audit (font ≥ 12 px, tap size, contrast, no sideways scroll, no clipped text), soft. */
export async function audit(page: Page, v: View, where: string) {
  await settle(page);
  await smallScreenAssertions(page, where);
  await dialogButtonsFit(page);
  const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the audit did not run`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
  return r;
}

export type Box = { top: number; bottom: number; left: number; right: number };
export const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

export const boxOf = (page: Page, selector: string) => page.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
}, selector) as Promise<Box | null>;

/**
 * What the docked guitar draws, from geometry and what it SAYS: the string
 * numbers top to bottom, and the side the open strings stand on.
 */
export async function neckDrawn(page: Page): Promise<{ strings: number[]; nut: 'left' | 'right' | null }> {
  const board = page.locator('[data-testid="instrument-dock"] [role="grid"]').first();
  await expect(board).toBeVisible({ timeout: 15_000 });
  return board.evaluate((root) => {
    const rows = Array.from(root.querySelectorAll('[data-dock-row="string"]')).map((row) => {
      const cells = Array.from(row.querySelectorAll('[data-fret][aria-label]'));
      const open = row.querySelector('[data-open-string]')!.getBoundingClientRect();
      const first = cells[0].getBoundingClientRect();
      const last = cells[cells.length - 1].getBoundingClientRect();
      // The label ends on the string's number in every language ("… string 6", "… corda 6").
      const string = Number(/(\d+)\D*$/.exec(cells[0].getAttribute('aria-label') ?? '')?.[1]);
      const nut: 'left' | 'right' | null = open.right <= Math.min(first.left, last.left) + 0.5 ? 'left' : open.left >= Math.max(first.right, last.right) - 0.5 ? 'right' : null;
      return { string, top: row.getBoundingClientRect().top, nut };
    }).sort((a, b) => a.top - b.top);
    const sides = [...new Set(rows.map((r) => r.nut))] as ('left' | 'right' | null)[];
    return { strings: rows.map((r) => r.string), nut: sides.length === 1 ? sides[0] : null };
  });
}

/** The Explore view now shown: Simple or Full (ExploreView's data-detail). */
export const exploreDetail = (page: Page) =>
  page.locator('.explore-root').first().getAttribute('data-detail');
