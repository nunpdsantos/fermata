import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';

/**
 * Design system v2 acceptance (W11-A, D-28 / D-26), in a real browser.
 *
 * Viewports: phone 390×844 and phone landscape 844×390 and tablet 768×1024
 * (touch), laptop 1440×900 (mouse); day and night. Screens: Explore (piano,
 * guitar; a chord selected in each of Diatonic / All / Build), the "⋯" menu
 * and the Settings sheet open, the instrument dock (phone: Peek / Half /
 * Full), Learn (level list, a returning learner's review queue, a lesson, an
 * exercise in its wrong-answer and right-answer states), Drill (a question,
 * a wrong answer's feedback, settings, the mastery map, the session summary).
 * Portuguese and Spanish at 390 px for the main screens. On every screen:
 *  - no text renders below 12 px (SVG text measured at its on-screen size);
 *  - every enabled control is ≥ 44 px on touch / ≥ 36 px with a mouse;
 *  - every text colour is ≥ 4.5:1 on what is painted under it (3:1 large);
 *  - no horizontal page scroll;
 *  - no visible text is cut off (ellipsis, line clamp, or overflow clipping);
 * a Tab walk finds a visible focus indicator on every stop, never covered;
 * and a full toast stack (update + offline-ready + install + an app toast)
 * stays on screen, off the instrument dock bar / sheet, the top bar and
 * Drill's answers, with every toast button the hit target at its centre
 * (phone at Peek / Half / Full, landscape, tablet, laptop) — and Reload works.
 * Exemptions (instrument keys/frets, inline links, disabled controls) are in
 * e2e/helpers/designAudit.ts and are COUNTED per screen.
 *
 * DESIGN_AUDIT_OUT=<dir> also writes each screen's audit (results.jsonl) and
 * a screenshot there — the reviewer's before/after material.
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
type Viewport = (typeof VIEWPORTS)[number];

const OUT = process.env.DESIGN_AUDIT_OUT;

// A returning learner with reviews due (Learn's review queue shows).
const DAY = 86_400_000;
const seededProgress = (now: number) => ({
  state: {
    progress: {
      completedModules: ['l1u1m1', 'l1u1m2', 'l1u1m3'],
      moduleProgress: {},
      exerciseResults: {},
      reviewSchedules: {
        l1u1m1: { completedAt: now - 9 * DAY, nextReviewAt: now - 2 * DAY, intervalLevel: 1, reviewCount: 1, lastReviewedAt: now - 3 * DAY },
        l1u1m2: { completedAt: now - 8 * DAY, nextReviewAt: now - 1 * DAY, intervalLevel: 0, reviewCount: 0, lastReviewedAt: now - 8 * DAY },
        l1u1m3: { completedAt: now - 2 * DAY, nextReviewAt: now + 3 * DAY, intervalLevel: 1, reviewCount: 1, lastReviewedAt: now - 2 * DAY },
      },
    },
  },
  version: 1,
});

type Box = { top: number; bottom: number; left: number; right: number };
const overlaps = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

async function open(browser: Browser, v: Viewport, theme: string, state: Record<string, unknown>, extra: { lang?: string; progress?: boolean | object } = {}) {
  const context = await browser.newContext({
    viewport: v.viewport,
    isMobile: v.touch,
    hasTouch: v.touch,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    acceptDownloads: true,
  });
  await context.addInitScript(
    ([blob, progress]) => {
      if (sessionStorage.getItem('__seeded')) return;
      localStorage.clear();
      localStorage.setItem('music-theory-app', blob);
      if (progress) localStorage.setItem('music-theory-progress', progress);
      sessionStorage.setItem('__seeded', '1');
    },
    [
      JSON.stringify({ state: { themeMode: theme, language: extra.lang ?? 'en', ...state }, version: 6 }),
      extra.progress === true ? JSON.stringify(seededProgress(Date.now())) : extra.progress ? JSON.stringify(extra.progress) : '',
    ] as const,
  );
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(1200); // fonts, lazy views, entrance animations
  return { context, page };
}

// Soft: one run reports every screen that fails, not just the first.
function expectClean(r: AuditResult, where: string) {
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the sweep did not run`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
}

/** Audit the page as it is now; record it (and a screenshot) when asked to. */
async function check(page: Page, v: Viewport, combo: string, screen: string) {
  const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  if (OUT) {
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: `${OUT}/${combo}--${screen}.png` });
    fs.appendFileSync(
      `${OUT}/results.jsonl`,
      JSON.stringify({
        combo,
        screen,
        minFont: r.minFont,
        fontViolations: r.fontViolations.length,
        minTap: r.minTap,
        tapViolations: r.tapViolations.length,
        minContrast: r.minContrast,
        contrastViolations: r.contrastViolations.length,
        hScroll: r.hScroll.scrollWidth > r.hScroll.clientWidth + 1,
        clipViolations: r.clipViolations.length,
        exempt: r.exempt,
        targets: r.targets,
        textNodes: r.textNodes,
      }) + '\n',
    );
  }
  expectClean(r, `${combo} ${screen}`);
}

const boxOf = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
  });

async function openSettings(page: Page) {
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  await page.waitForTimeout(300); // the sheet slides in
}

/** The current (not animating-out) Learn screen. */
const learnScreen = (page: Page) => page.locator('#learn-panel [data-learn-screen]:not([inert])');

// ── Focus walk (WCAG 2.4.7 visible, 2.4.11 not obscured) ─────────────────
/**
 * Tab from the top of the document through `steps` stops. At each stop: the
 * focused element must LOOK different from its unfocused self (an outline, a
 * ring, a changed border/fill on it or a descendant — e.g. the sheet handle's
 * ring is drawn on its grip), lie on screen, and be what a pointer at the
 * centre of its visible part hits (nothing covering it: top bar, sheet,
 * toasts). The first stop must be the skip link (review B1).
 */
async function focusWalk(page: Page, where: string, steps = 40) {
  await page.evaluate(() => {
    const h = document.documentElement;
    h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
    h.removeAttribute('tabindex');
  });
  const bad: unknown[] = [];
  const names: string[] = [];
  const seen = new Set<unknown>();
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body || el === document.documentElement) return null;
      const name = `${el.tagName.toLowerCase()}${el.getAttribute('role') ? `[${el.getAttribute('role')}]` : ''} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}"`;
      const sig = (root: Element) => [root, ...Array.from(root.querySelectorAll('*')).slice(0, 30)].map((e) => {
        const cs = getComputedStyle(e);
        return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor, cs.stroke, cs.strokeWidth].join('|');
      }).join('§');
      const focused = sig(el);
      // The same element unfocused (restore focus right after: still keyboard
      // modality, so :focus-visible matches again).
      el.blur();
      const resting = sig(el);
      el.focus({ preventScroll: true });
      const indicator = focused !== resting;
      const r = el.getBoundingClientRect();
      const vw = innerWidth, vh = innerHeight;
      const x0 = Math.max(r.left, 0), x1 = Math.min(r.right, vw), y0 = Math.max(r.top, 0), y1 = Math.min(r.bottom, vh);
      const onScreen = r.width > 0 && r.height > 0 && x1 - x0 >= 1 && y1 - y0 >= 1;
      let coveredBy: string | null = null;
      if (onScreen) {
        const hit = document.elementFromPoint((x0 + x1) / 2, (y0 + y1) / 2);
        if (!hit || !(hit === el || el.contains(hit))) {
          coveredBy = hit ? `${hit.tagName.toLowerCase()}.${String((hit as HTMLElement).className).slice(0, 40)}` : 'nothing';
        }
      }
      return { name, indicator, onScreen, coveredBy, id: el.outerHTML.slice(0, 120) };
    });
    if (!stop) continue;
    if (seen.has(stop.id) && names.length > 3) break; // wrapped around
    seen.add(stop.id);
    names.push(stop.name);
    if (!stop.indicator || !stop.onScreen || stop.coveredBy) bad.push(stop);
  }
  expect.soft(names[0] ?? '', `${where}: the first Tab stop is the skip link`).toMatch(/skip to/i);
  expect.soft(names.length, `${where}: the Tab walk reached no stops`).toBeGreaterThan(5);
  expect.soft(bad, `${where}: focus not visible / off screen / covered ${JSON.stringify(bad.slice(0, 5), null, 1)}`).toEqual([]);
}

// ── Toasts (W9-22, review B2) ──────────────────────────────────────────────
// The dev server serves the app's own modules (/src/…); `vite preview` does
// not. On the dev server the whole stack is raised through the same stores
// the app uses (update + offline-ready via the PWA store, an install offer
// via the browser event, plus an app toast); against the production build
// these steps are skipped and noted (e2e/pwa.spec.ts covers the real
// offline-ready + install stack there).
let devModules: boolean | undefined;
async function hasDevModules(page: Page) {
  if (devModules === undefined) {
    const res = await page.request.get('/src/hooks/usePWA.ts');
    devModules = res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
    if (!devModules) {
      // Never a silent skip on the dev server: only a production build (the
      // one that serves the PWA manifest) may lack the modules.
      const manifest = await page.request.get('/manifest.webmanifest');
      expect((manifest.headers()['content-type'] ?? '').includes('json'), 'dev server without /src modules?').toBe(true);
      test.info().annotations.push({ type: 'note', description: 'toast stack + sprint seeding need the dev server: skipped on this build' });
    }
  }
  return devModules;
}

async function raiseToastStack(page: Page): Promise<boolean> {
  if (!(await hasDevModules(page))) return false;
  await page.evaluate(`(async () => {
    const pwa = await import('/src/hooks/usePWA.ts');
    pwa.usePwaUpdateStore.setState({ needRefresh: true, offlineReady: true });
    const e = new Event('beforeinstallprompt');
    e.prompt = async () => {};
    e.userChoice = Promise.resolve({ outcome: 'dismissed' });
    window.dispatchEvent(e);
    const ts = await import('/src/state/toastStore.ts');
    ts.toast('Backup downloaded', 'success', 0);
  })()`);
  await expect(page.locator('.toast-card')).toHaveCount(4);
  await page.waitForTimeout(400); // the layout settles (sheet re-measures)
  return true;
}

async function lowerToastStack(page: Page) {
  await page.evaluate(`(async () => {
    const pwa = await import('/src/hooks/usePWA.ts');
    pwa.usePwaUpdateStore.setState({ needRefresh: false, offlineReady: false });
    const ts = await import('/src/state/toastStore.ts');
    ts.useToastStore.setState({ toasts: [] });
  })()`);
  await page.waitForTimeout(300);
  // Cleanup only (the hit test was toastsClear's job): the install offer's
  // Dismiss, clicked by script (no waiting on an element that may be leaving).
  await page.evaluate(() => document.querySelectorAll<HTMLButtonElement>('.toast-card button[aria-label="Dismiss"]').forEach((b) => b.click()));
  await expect(page.locator('.toast-card')).toHaveCount(0);
  await page.waitForTimeout(300);
}

/** Every toast: on screen, off `avoid`, its buttons the hit target. */
async function toastsClear(page: Page, where: string, avoid: string[]) {
  const vp = page.viewportSize()!;
  const cards = page.locator('.toast-card');
  const n = await cards.count();
  expect.soft(n, `${where}: the toast stack is up`).toBe(4);
  const avoidBoxes: { sel: string; box: Box }[] = [];
  for (const sel of avoid) {
    const loc = page.locator(sel).first();
    if ((await loc.count()) && (await loc.isVisible())) avoidBoxes.push({ sel, box: await boxOf(page, sel) });
  }
  for (let i = 0; i < n; i++) {
    const card = cards.nth(i);
    await card.evaluate((el) => el.scrollIntoView({ block: 'nearest' }));
    const b = await card.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    });
    const txt = ((await card.textContent()) ?? '').slice(0, 30);
    expect.soft(b.top >= 0 && b.left >= 0 && b.bottom <= vp.height + 0.5 && b.right <= vp.width + 0.5, `${where}: toast "${txt}" off screen ${JSON.stringify(b)}`).toBe(true);
    for (const a of avoidBoxes) expect.soft(overlaps(b, a.box), `${where}: toast "${txt}" over ${a.sel}`).toBe(false);
    const buttons = card.locator('button');
    for (let j = 0; j < (await buttons.count()); j++) {
      const hit = await buttons.nth(j).evaluate((btn) => {
        const r = btn.getBoundingClientRect();
        const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!h && (h === btn || btn.contains(h));
      });
      expect.soft(hit, `${where}: toast "${txt}" button ${j} is covered`).toBe(true);
    }
  }
}

/** The update toast's Reload reloads the page (dev: no worker, plain reload). */
async function reloadFromToast(page: Page, where: string) {
  const reload = page.locator('.toast-card').filter({ hasText: /new version/i }).getByRole('button', { name: 'Reload' });
  await expect(reload, `${where}: update toast shows Reload`).toBeVisible();
  await Promise.all([page.waitForEvent('load', { timeout: 15_000 }), reload.click()]);
}

// ── Learn helpers ──────────────────────────────────────────────────────────
async function openLessonBySearch(page: Page, title: string) {
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Quick search' });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill(title);
  await dialog.getByRole('button', { name: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
}

/** Answer the current choice exercise (right on the second try) and move on. */
async function answerChoice(page: Page) {
  const screen = learnScreen(page);
  const grid = screen.locator('.grid.grid-cols-2').first();
  await grid.locator('button:not([disabled])').last().click();
  await screen.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(400);
  const tryAgain = screen.getByRole('button', { name: 'Try Again' });
  if (await tryAgain.count()) {
    const revealed = (await screen.locator('button.text-success').first().textContent())?.trim();
    await tryAgain.click();
    if (revealed) {
      const exact = new RegExp(`^${revealed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
      await grid.locator('button').filter({ hasText: exact }).first().click();
      await screen.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(400);
    }
  }
  const cont = screen.getByRole('button', { name: /^(Continue|Next)$/ });
  if (await cont.count()) await cont.first().click();
  await page.waitForTimeout(300);
}

// Level 1 finished but for its last module, whose tasks and exercises are done:
// "Mark Module Complete" there raises the level-achievement overlay.
const L1_SRC = fs.readFileSync('src/core/constants/curriculumL1.ts', 'utf8');
const L1_MODULES = [...L1_SRC.matchAll(/id: '(l1u\d+m\d+)'/g)].map((m) => m[1]);
const levelEndProgress = () => {
  const last = L1_MODULES[L1_MODULES.length - 1];
  const tasks = [...L1_SRC.matchAll(new RegExp(`id: '(${last}t\\d+)'`, 'g'))].map((m) => m[1]);
  return {
    state: {
      progress: {
        completedModules: L1_MODULES.slice(0, -1),
        moduleProgress: { [last]: tasks },
        exerciseResults: { [last]: { scores: {}, totalAttempts: 1, lastAttemptAt: Date.now(), passed: true } },
        reviewSchedules: {},
      },
    },
    version: 1,
  };
};

// Sprint needs ≥ 5 facts at review tier: promote some of the bank (dev server
// modules, the same store instance the app reads).
async function seedSprintItems(page: Page): Promise<boolean> {
  if (!(await hasDevModules(page))) return false;
  await page.evaluate(`(async () => {
    const { useDrillStore } = await import('/src/state/drillStore.ts');
    const { generateDrillBank } = await import('/src/core/utils/drillBank/index.ts');
    const s = useDrillStore.getState();
    const card = Object.values(s.items)[0]?.card;
    if (!card) throw new Error('no answered item to copy a card from');
    const pick = generateDrillBank().filter((it) => s.settings.families[it.family]).slice(0, 12);
    const items = { ...s.items };
    for (const it of pick) items[it.id] = { card, history: [], tier: 'review', introCorrectCount: 0 };
    useDrillStore.setState({ items });
  })()`);
  return true;
}

async function exportToast(page: Page): Promise<Box> {
  const download = page.waitForEvent('download');
  await openSettings(page);
  await page.getByRole('button', { name: 'Export backup' }).click();
  await download;
  await page.keyboard.press('Escape');
  const toast = page.getByRole('status').filter({ hasText: 'Backup downloaded' });
  await expect(toast).toBeVisible();
  const box = await toast.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
  });
  const vp = page.viewportSize()!;
  expect.soft(box.top >= 0 && box.left >= 0 && box.bottom <= vp.height + 0.5 && box.right <= vp.width + 0.5, `backup toast on screen ${JSON.stringify(box)}`).toBe(true);
  // Dismiss it, so a later screen is not audited mid fade-out.
  await toast.getByRole('button', { name: 'Dismiss' }).click();
  await expect(toast).toHaveCount(0);
  return box;
}


async function openFirstLesson(page: Page, heading = 'The Staff and Clefs') {
  await page.getByRole('button', { name: new RegExp(heading) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
}

/** Answer choice exercises until we have seen a wrong answer and a right one. */
async function exerciseStates(page: Page, onState: (state: 'selected' | 'wrong' | 'right') => Promise<void>) {
  const screen = learnScreen(page);
  await screen.getByText('Exercises', { exact: true }).first().scrollIntoViewIfNeeded();
  const seen = new Set<string>();
  for (let i = 0; i < 12 && seen.size < 3; i++) {
    const grid = screen.locator('.grid.grid-cols-2').first();
    if (!(await grid.count())) break;
    const options = grid.locator('button:not([disabled])');
    if (!(await options.count())) break;
    await options.last().click();
    if (!seen.has('selected')) {
      // An answer chosen, Submit showing (review B3: Submit was 74–82 × 29–33 px).
      seen.add('selected');
      await page.waitForTimeout(300);
      await onState('selected');
    }
    await screen.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(400);
    const tryAgain = screen.getByRole('button', { name: 'Try Again' });
    if (await tryAgain.count()) {
      if (!seen.has('wrong')) {
        seen.add('wrong');
        await onState('wrong');
      }
      const revealed = (await screen.locator('button.text-success').first().textContent())?.trim();
      await tryAgain.click();
      if (revealed) {
        const exact = new RegExp(`^${revealed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
        await grid.locator('button').filter({ hasText: exact }).first().click();
        await screen.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(400);
      }
    }
    const cont = screen.getByRole('button', { name: /^(Continue|Next)$/ });
    if ((await cont.count()) && !seen.has('right') && (await screen.getByText(/Correct/).count())) {
      seen.add('right');
      await onState('right');
    }
    if (await cont.count()) await cont.first().click();
    await page.waitForTimeout(300);
  }
  expect([...seen].sort(), 'reached every exercise state').toEqual(['right', 'selected', 'wrong']);
}

/** Answer Drill questions until a wrong answer's feedback shows. */
async function drillWrong(page: Page, notQuite: RegExp, continueName: string) {
  const panel = page.locator('#drill-panel');
  for (let i = 0; i < 14; i++) {
    const choices = panel.getByTestId('drill-answers').locator('button:not([disabled])');
    const n = await choices.count();
    if (!n) break;
    await choices.nth(Math.min(1, n - 1)).click();
    const done = panel.locator('button:not([disabled])').filter({ hasText: /^(Done|Concluído|Listo|Hecho)$/ });
    if (await done.count()) await done.first().click();
    await page.waitForTimeout(500);
    if (await panel.getByText(notQuite).count()) return;
    const cont = panel.getByRole('button', { name: continueName, exact: true });
    if (await cont.count()) await cont.click();
    else await page.waitForTimeout(1500); // a right answer moves on by itself
  }
  throw new Error('never reached a wrong-answer feedback');
}

/** Where the instrument is a pull-up sheet: phones and short screens (SHEET_QUERY). */
const isSheet = (v: Viewport) => v.viewport.width < 640 || v.viewport.height <= 500;
const DOCK = '[data-testid="instrument-dock"]';
const TOPBAR = '.app-topbar';

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo}: type ≥ 12 px, targets ≥ ${v.touch ? 44 : 36} px, contrast, no clipping, focus, no sideways scroll, toasts clear`, async ({ browser }) => {
      test.setTimeout(480_000);
      const where = (s: string) => `${combo} ${s}`;

      // Explore; sharp and flat keys on the piano; the chord panel in
      // Diatonic / All / Build; a Tab walk; the toast over Explore; the "⋯"
      // menu and Settings; the whole toast stack, then Reload.
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'piano', lastView: 'explore' });
        expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(v.touch);
        await check(page, v, combo, 'explore');
        if (v.name === 'phone-landscape') {
          // A sheet, not a docked panel, and the view keeps real room (review M3).
          await expect(page.getByRole('separator', { name: 'Instrument panel' })).toHaveCount(1);
          const mainH = (await page.locator('#main-content').boundingBox())!.height;
          expect.soft(mainH, where('landscape: room left for the view')).toBeGreaterThanOrEqual(120);
        }
        await focusWalk(page, where('explore'));
        // Black keys carrying a sharp, then a flat (D major: F♯ C♯; E♭ major: E♭ A♭ B♭).
        const roots = page.getByRole('radiogroup', { name: 'Root' }).getByRole('radio');
        await roots.nth(2).click();
        await page.waitForTimeout(400);
        await check(page, v, combo, 'explore-sharps');
        await roots.nth(3).click();
        await page.waitForTimeout(400);
        await check(page, v, combo, 'explore-flats');
        await roots.nth(0).click();
        await page.waitForTimeout(300);
        await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
        await expect(page.getByRole('radiogroup', { name: 'Chord inversion' })).toBeVisible();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-diatonic');
        await page.getByRole('tab', { name: 'All Chords' }).click();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-all');
        await page.getByRole('tab', { name: 'Build' }).click();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-build');
        await page.getByRole('tab', { name: 'Diatonic' }).click();
        const toast = await exportToast(page);
        const dock = await boxOf(page, DOCK);
        expect(overlaps(toast, dock), where('toast vs dock')).toBe(false);
        // The "⋯" menu, then the Settings sheet.
        await page.getByRole('button', { name: 'More', exact: true }).click();
        await expect(page.getByRole('menu', { name: 'More' })).toBeVisible();
        await check(page, v, combo, 'menu');
        await page.keyboard.press('Escape');
        await openSettings(page);
        await check(page, v, combo, 'settings');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        // The whole stack over Explore at the default detent.
        if (await raiseToastStack(page)) {
          await toastsClear(page, where('explore toasts'), [DOCK, isSheet(v) ? '.detent-head' : '.dock-panel-bar', TOPBAR]);
          await check(page, v, combo, 'toasts');
          await reloadFromToast(page, where('explore'));
        }
        await context.close();
      }

      // Guitar + the dock's detents (a sheet on phones and short screens).
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'guitar', lastView: 'explore' });
        await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'explore-guitar');
        const handle = page.getByRole('separator', { name: 'Instrument panel' });
        const detents = [['Home', 'peek'], ['ArrowUp', 'half'], ['End', 'full']] as const;
        const setDetent = async (key: string, detent: string) => {
          await handle.focus();
          await page.keyboard.press(key);
          await expect(page.locator(DOCK)).toHaveAttribute('data-detent', detent);
          await page.waitForTimeout(300);
        };
        if (isSheet(v)) {
          for (const [key, detent] of detents) {
            await setDetent(key, detent);
            await check(page, v, combo, `dock-${detent}`);
            if (v.name === 'phone-landscape' && detent !== 'full') {
              const mainH = (await page.locator('#main-content').boundingBox())!.height;
              expect.soft(mainH, where(`landscape ${detent}: room left for the view`)).toBeGreaterThanOrEqual(120);
            }
          }
          await focusWalk(page, where('dock-full'));
          // The toast stack at every detent: never over the dock bar or sheet.
          if (await raiseToastStack(page)) {
            for (const [key, detent] of detents) {
              await setDetent(key, detent);
              await toastsClear(page, where(`toasts at ${detent}`), [DOCK, '.detent-head', TOPBAR]);
            }
            await reloadFromToast(page, where('dock-full'));
          }
        } else {
          await expect(handle).toHaveCount(0); // a docked panel, not a sheet
          await check(page, v, combo, 'dock-docked');
          // ‹ positions › on one line; the dock leaves the view most of the screen.
          const row = page.getByTestId('position-row');
          if (await row.count()) {
            const tops = await row.locator(':scope > button').evaluateAll((bs) => bs.map((b) => Math.round(b.getBoundingClientRect().top)));
            expect.soft(new Set(tops).size, where('position steppers on one line')).toBe(1);
          }
          const dockH = (await page.locator(DOCK).boundingBox())!.height;
          expect.soft(dockH, where('guitar dock height')).toBeLessThanOrEqual(v.viewport.height * 0.5);
          if (await raiseToastStack(page)) {
            await toastsClear(page, where('toasts over docked guitar'), [DOCK, TOPBAR]);
            await lowerToastStack(page);
          }
        }
        await context.close();
      }

      // Learn: level list, a lesson, an exercise selected / wrong / right.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' });
        await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'learn-levels');
        await openFirstLesson(page);
        await check(page, v, combo, 'learn-lesson');
        await focusWalk(page, where('learn-lesson'));
        await exerciseStates(page, (state) => check(page, v, combo, `learn-exercise-${state}`));
        await context.close();
      }

      // Learn: an exercise answered on the instrument; an ear-training one.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn', instrument: 'piano' });
        await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
        await openLessonBySearch(page, 'The Major Scale');
        const screen = learnScreen(page);
        await screen.getByText('Exercises', { exact: true }).first().scrollIntoViewIfNeeded();
        const checkAnswer = screen.getByRole('button', { name: 'Check Answer' });
        for (let i = 0; i < 8 && !(await checkAnswer.count()); i++) await answerChoice(page);
        await expect(checkAnswer, where('reached an instrument exercise')).toBeVisible();
        await checkAnswer.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await check(page, v, combo, 'learn-exercise-instrument');
        await openLessonBySearch(page, 'Pitch Matching and Direction');
        await learnScreen(page).getByText('Exercises', { exact: true }).first().scrollIntoViewIfNeeded();
        // Exercise order is shuffled: answer until an ear-training one is up.
        const replay = learnScreen(page).getByRole('button', { name: 'Replay audio' });
        for (let i = 0; i < 10 && !(await replay.count()); i++) await answerChoice(page);
        await expect(replay, where('ear-training exercise')).toBeVisible();
        await replay.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await check(page, v, combo, 'learn-exercise-ear');
        await context.close();
      }

      // Learn: the level-achievement overlay.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' }, { progress: levelEndProgress() });
        await expect(learnScreen(page).getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15_000 });
        await learnScreen(page).getByRole('button').filter({ has: page.locator('h3') }).first().click();
        await expect(page.getByRole('heading', { level: 1, name: 'Your First Chords — Major Triads' })).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(800);
        const done = learnScreen(page).getByRole('button', { name: 'Mark Module Complete' });
        await done.scrollIntoViewIfNeeded();
        await done.click();
        await expect(page.getByRole('heading', { name: 'Level 1 Complete!' })).toBeVisible();
        await page.waitForTimeout(700);
        await check(page, v, combo, 'learn-level-achievement');
        await context.close();
      }

      // Learn: a returning learner with reviews due.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' }, { progress: true });
        await expect(page.getByText('Review Queue').first()).toBeVisible({ timeout: 15_000 });
        await page.getByText('Review Queue').first().scrollIntoViewIfNeeded();
        await check(page, v, combo, 'learn-review-queue');
        await context.close();
      }

      // Drill: question, wrong-answer feedback (+ toasts over it), settings,
      // mastery map, the session summary, a Sprint.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'drill' });
        const panel = page.locator('#drill-panel');
        await expect(panel.getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'drill-question');
        await focusWalk(page, where('drill-question'));
        await drillWrong(page, /Not quite|Same sound/, 'Continue');
        await check(page, v, combo, 'drill-feedback');
        const answers = await boxOf(page, '[data-testid="drill-answers"]');
        const toast = await exportToast(page);
        expect(overlaps(toast, answers), where('toast vs drill answers')).toBe(false);
        if (await raiseToastStack(page)) {
          await toastsClear(page, where('toasts over drill'), ['[data-testid="drill-answers"]', TOPBAR]);
          await lowerToastStack(page);
        }
        await panel.getByRole('button', { name: 'Drill settings' }).click();
        await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
        await check(page, v, combo, 'drill-settings');
        await panel.getByRole('button', { name: /Mastery map/ }).click();
        await expect(panel.getByRole('heading', { name: 'Mastery' })).toBeVisible();
        await check(page, v, combo, 'drill-mastery');
        await panel.getByRole('button', { name: 'Back' }).click();
        await panel.getByRole('button', { name: 'End session' }).click();
        await expect(panel.getByRole('button', { name: 'New session' })).toBeVisible();
        await check(page, v, combo, 'drill-summary');
        if (await seedSprintItems(page)) {
          await panel.getByRole('button', { name: 'Sprint', exact: true }).click();
          await expect(panel.getByText(/^\d+s$/), where('a running sprint (not its empty state)')).toBeVisible();
          await page.waitForTimeout(400);
          await check(page, v, combo, 'drill-sprint');
        }
        await context.close();
      }
    });
  }
}

// Clipping at the widths where the chord cards are narrowest (1024 px, the
// review saw "Diminished" / "Disminuido" cut off there), in all three languages.
const CLIP_VIEWPORT = { name: 'desktop-1024', viewport: { width: 1024, height: 768 }, touch: false } as unknown as Viewport;
for (const lang of ['en', 'pt', 'es'] as const) {
  test(`1024-${lang}: chord cards and the dock at 1024 px are not cut off`, async ({ browser }) => {
    test.setTimeout(120_000);
    const combo = `desktop-1024-${lang}-day`;
    for (const instrument of ['piano', 'guitar'] as const) {
      const { context, page } = await open(browser, CLIP_VIEWPORT, 'fermata', { instrument, lastView: 'explore' }, { lang });
      await page.waitForTimeout(500);
      await check(page, CLIP_VIEWPORT, combo, `explore-${instrument}`);
      if (instrument === 'piano') {
        // All Chords + Build (the second and third tabs) in any language.
        const tabs = page.getByRole('tablist').last().getByRole('tab');
        await tabs.nth(1).click();
        await page.waitForTimeout(500);
        await check(page, CLIP_VIEWPORT, combo, 'explore-chord-all');
        await tabs.nth(2).click();
        await page.waitForTimeout(500);
        await check(page, CLIP_VIEWPORT, combo, 'explore-chord-build');
      }
      await context.close();
    }
  });
}

// Portuguese and Spanish at 390 px: longer words, same rules.
const LANGS = [
  { lang: 'pt', notQuite: /Não é bem isso|Mesmo som/, cont: 'Continuar', more: 'Mais', settings: 'Definições' },
  { lang: 'es', notQuite: /Incorrecto|Mismo sonido/, cont: 'Continuar', more: 'Más', settings: 'Ajustes' },
] as const;

for (const L of LANGS) {
  for (const th of THEMES) {
    const v = VIEWPORTS[0];
    const combo = `phone-${L.lang}-${th.name}`;
    test(`${combo}: the main screens in ${L.lang.toUpperCase()} pass the same rules`, async ({ browser }) => {
      test.setTimeout(240_000);
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'piano', lastView: 'explore' }, { lang: L.lang });
        await check(page, v, combo, 'explore');
        await page.getByRole('button', { name: L.more, exact: true }).click();
        await page.getByRole('menuitem', { name: L.settings }).click();
        await expect(page.getByRole('dialog', { name: L.settings })).toBeVisible();
        await page.waitForTimeout(300);
        await check(page, v, combo, 'settings');
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'guitar', lastView: 'explore' }, { lang: L.lang });
        await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'explore-guitar');
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' }, { lang: L.lang });
        await expect(learnScreen(page).getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'learn-levels');
        // The Continue card opens the first lesson.
        await learnScreen(page).getByRole('button').filter({ has: page.locator('h3') }).first().click();
        await expect(learnScreen(page).getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(800);
        await check(page, v, combo, 'learn-lesson');
        await context.close();
      }
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'drill' }, { lang: L.lang });
        await expect(page.locator('#drill-panel').getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'drill-question');
        await drillWrong(page, L.notQuite, L.cont);
        await check(page, v, combo, 'drill-feedback');
        await context.close();
      }
    });
  }
}
