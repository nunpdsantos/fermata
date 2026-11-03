import { test, expect, type Browser, type Locator, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';
import { learnScreens } from './helpers/learnDesignScreens';
import { L1_UNITS } from '../src/core/constants/curriculumL1';

/**
 * Design system v2 acceptance (W11-A, D-28 / D-26), in a real browser.
 *
 * Viewports: phone 390×844 and phone landscape 844×390 and tablet 768×1024
 * (touch), laptop 1440×900 (mouse); day and night. Screens: Explore (piano,
 * guitar; a chord selected in each of In key / All / Build, its detail open
 * in place; a linked focus note; the scale actions "⋯" menu and the Compare
 * sheet; the phone's key-picker sheet with the circle; the landscape
 * full-neck guitar view — W11-B), the "⋯" menu
 * and the Settings sheet open, the instrument dock (phone: Peek / Half /
 * Full), Learn (level list, a returning learner's review queue, a lesson, an
 * exercise in its wrong-answer and right-answer states; W4a's question
 * screens: a key signature on a question staff — 1–2 and 5–6 sharps or
 * flats — half / whole step and interval-number answers), Drill (a question, a wrong answer's feedback,
 * settings, the mastery map, the session summary). Portuguese and Spanish at
 * 390 px for the main screens and W4a's question screens. On every screen:
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

/**
 * Wait until nothing on the page is moving: no running Web Animation (CSS or
 * framer-motion's WAAPI), and every element's opacity and transform the same
 * on two looks 60 ms apart (a JS-driven tween too). Contrast measured mid
 * fade-in blends text with the page — the chord cards' flaky failures on
 * phone combos (W11-B). The contexts also run with prefers-reduced-motion,
 * which the components honour (entrances skip their fade).
 */
async function settle(page: Page) {
  const snapshot = () => page.evaluate(() => {
    const running = document.getAnimations().filter((a) => a.playState === 'running' || a.pending).length;
    let sig = '';
    // An entrance still in its delay (framer-motion / a JS tween): the
    // element sits at an inline opacity of 0 — not yet moving, so two equal
    // samples would pass it mid-entrance (review probe: a 500 ms delay).
    let waiting = 0;
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      const cs = getComputedStyle(el);
      if (cs.opacity !== '1' || cs.transform !== 'none') sig += `${cs.opacity}|${cs.transform};`;
      if ((el as HTMLElement).style?.opacity === '0') waiting++;
    }
    return { running, sig, waiting };
  });
  // Settled = nothing has changed for QUIET ms and no entrance is waiting;
  // an inline-0 element that has not moved for REST ms is at rest, not an
  // entrance (a faded-out leftover).
  const QUIET = 300;
  const REST = 1500;
  const start = Date.now();
  let prev = await snapshot();
  let quietSince = Date.now();
  while (Date.now() - start < 5000) {
    await page.waitForTimeout(60);
    const now = await snapshot();
    if (now.running > 0 || now.sig !== prev.sig) quietSince = Date.now();
    prev = now;
    const quiet = Date.now() - quietSince;
    if ((quiet >= QUIET && now.waiting === 0) || quiet >= REST) return;
  }
  throw new Error('the page never stopped moving (5 s)');
}

/** Audit the page as it is now; record it (and a screenshot) when asked to. */
async function check(page: Page, v: Viewport, combo: string, screen: string) {
  await settle(page);
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
    const stop = await page.evaluate(async () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body || el === document.documentElement) return null;
      const name = `${el.tagName.toLowerCase()}${el.getAttribute('role') ? `[${el.getAttribute('role')}]` : ''} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}"`;
      const sig = (root: Element) => [root, ...Array.from(root.querySelectorAll('*')).slice(0, 30)].map((e) => {
        const cs = getComputedStyle(e);
        return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor, cs.stroke, cs.strokeWidth].join('|');
      }).join('§');
      // Let a ring that React paints after the focus event land (two
      // frames) before each look — sampling once, under load, read a piano
      // key before its ring was drawn (W11-B review). Up to three tries.
      const frames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      let indicator = false;
      for (let attempt = 0; attempt < 3 && !indicator; attempt++) {
        await frames();
        const focused = sig(el);
        // The same element unfocused (restore focus right after: still
        // keyboard modality, so :focus-visible matches again).
        el.blur();
        await frames();
        const resting = sig(el);
        el.focus({ preventScroll: true });
        indicator = focused !== resting;
      }
      await frames();
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
    // The update toast with its "What's new" line (W9b) — the tallest it gets.
    pwa.usePwaUpdateStore.setState({
      needRefresh: true,
      offlineReady: true,
      incoming: { critical: false, notes: {
        en: 'Updates now install themselves when you open the app, never mid-session, and a Drill session or a Sprint picks up where you left off.',
        pt: 'As atualizações passam a instalar-se sozinhas quando abres a app, nunca a meio de uma sessão, e um Treino ou um Sprint continua onde ficaste.',
        es: 'Las actualizaciones ahora se instalan solas al abrir la app, nunca a mitad de una sesión, y una Práctica o un Sprint sigue donde lo dejaste.',
      } },
    });
    const e = new Event('beforeinstallprompt');
    e.prompt = async () => {};
    e.userChoice = Promise.resolve({ outcome: 'dismissed' });
    window.dispatchEvent(e);
    const ts = await import('/src/state/toastStore.ts');
    ts.toast('Backup downloaded', 'success', 0);
  })()`);
  await expect(page.locator('.toast-card')).toHaveCount(4);
  await page.waitForTimeout(400); // the layout settles (sheet re-measures)
  // The update toast's "What's new" line shows exactly where the region has
  // room for it (PWAPrompts NOTE_MIN_ROOM_PX = 160) — not over a phone's
  // instrument at Full / sideways, where the taller card would cover it.
  const room = await page.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--toast-room'), 10));
  const note = page.locator('.toast-card').filter({ hasText: 'What’s new: Updates now install themselves' });
  await expect(note, `the What's new line at --toast-room ${room}px`).toHaveCount(Number.isNaN(room) || room >= 160 ? 1 : 0);
  return true;
}

async function lowerToastStack(page: Page) {
  await page.evaluate(`(async () => {
    const pwa = await import('/src/hooks/usePWA.ts');
    pwa.usePwaUpdateStore.setState({ needRefresh: false, offlineReady: false, incoming: null });
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

/** Where each element is now (first match per selector; null if absent). */
const rectsOf = (page: Page, selectors: string[]) =>
  page.evaluate((sels) => sels.map((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { sel, top: r.top, left: r.left, width: r.width, height: r.height };
  }), selectors);

type Rects = Awaited<ReturnType<typeof rectsOf>>;
function expectSteady(before: Rects, now: Rects, where: string) {
  before.forEach((b, i) => {
    const n = now[i];
    if (!b || !n) return;
    const moved = Math.max(Math.abs(n.top - b.top), Math.abs(n.left - b.left), Math.abs(n.height - b.height), Math.abs(n.width - b.width));
    expect.soft(moved, `${where}: ${b.sel} moved`).toBeLessThan(2);
  });
}

/**
 * Round 4 (no layout shift): raise the whole stack and dismiss it again; the
 * instrument / the answers must not move (< 2 px) either way, and the toasts
 * must be clear of what they avoid. Returns false on a build without the dev
 * modules (skipped there, with a note).
 */
async function toastsInAndOut(page: Page, where: string, steady: string[], avoid: string[]) {
  const before = await rectsOf(page, steady);
  if (!(await raiseToastStack(page))) return false;
  await toastsClear(page, `${where} (toasts in)`, avoid);
  expectSteady(before, await rectsOf(page, steady), `${where} (toasts in)`);
  await lowerToastStack(page);
  expectSteady(before, await rectsOf(page, steady), `${where} (toasts out)`);
  return true;
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

/** The check's words in each language (en.json / pt.json / es.json). W4b: the
 *  exercises run in a focused check opened from the lesson's Check section. */
const EXERCISE_WORDS = {
  en: { start: 'Start the check', submit: 'Submit', next: /^(Continue|Next)$/, check: 'Check Answer' },
  pt: { start: 'Começar a verificação', submit: 'Enviar', next: /^(Continuar|Seguinte)$/, check: 'Verificar Resposta' },
  es: { start: 'Empezar la comprobación', submit: 'Enviar', next: /^(Continuar|Siguiente)$/, check: 'Comprobar Respuesta' },
} as const;
type Lang = keyof typeof EXERCISE_WORDS;

/** Open the lesson's check (W4b: a focused check, started from the Check section). */
async function startCheck(page: Page, lang: Lang = 'en') {
  const start = learnScreen(page).getByRole('button', { name: EXERCISE_WORDS[lang].start });
  await start.scrollIntoViewIfNeeded();
  await start.click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  await page.waitForTimeout(300);
}

/** Answer the current choice question (a second try after a miss — D-09: no answer is shown) and move on. */
async function answerChoice(page: Page, lang: Lang = 'en') {
  const words = EXERCISE_WORDS[lang];
  const answers = page.getByTestId('check-answers');
  await answers.locator('button[data-state="open"]').last().click();
  await page.getByRole('button', { name: words.submit }).click();
  await page.waitForTimeout(300);
  if ((await answers.locator('[data-state="tried"]').count()) && !(await answers.locator('[data-state="answer"]').count())) {
    await answers.locator('button[data-state="open"]').first().click();
    await page.getByRole('button', { name: words.submit }).click();
    await page.waitForTimeout(300);
  }
  const cont = page.getByRole('button', { name: words.next });
  if (await cont.count()) await cont.first().click();
  await page.waitForTimeout(300);
}

/** Get past the current exercise: a choice one is answered, a build one (on the piano) is failed. */
async function passExercise(page: Page, lang: Lang) {
  const words = EXERCISE_WORDS[lang];
  if (await page.getByTestId('check-answers').locator('button[data-state="open"]').count()) return answerChoice(page, lang);
  const check = page.getByRole('button', { name: words.check });
  const cont = page.getByRole('button', { name: words.next }).first();
  if (!(await check.count())) return;
  for (let attempt = 0; attempt < 2 && !(await cont.count()); attempt++) {
    // A miss keeps the picks and the input in place for the second try (W4b).
    await expect(check, `${lang}: a build exercise's Check Answer`).toBeVisible();
    // Middle C, which every dock shows (the strip's first key, A0, sits off
    // screen on a phone), tapped low on the key, below the black keys.
    if (await check.isDisabled()) {
      const key = page.locator('[data-piano-key][aria-label="C4"]:visible').first();
      const box = (await key.boundingBox())!;
      await key.click({ position: { x: box.width / 2, y: box.height * 0.85 } });
    }
    await check.click();
    await page.waitForTimeout(300);
  }
  await cont.click();
  await page.waitForTimeout(300);
}

/**
 * W4a's question screens: a question that points at a key signature drawn on
 * a staff (`exerciseStaff.ts` stimulus, no notes) — one of L1's (1–2 sharps
 * or flats) and one of L2's widest (B / F#, 5–6 sharps) — and intervals
 * answered by half / whole step and by number (the new choice labels, each
 * over its interval staff). Lessons open through Cmd+K by their translated
 * titles; the prompt is the same in both key-signature lessons.
 */
const W4A_QUESTIONS = {
  en: {
    keySigPrompt: 'Which major key has this key signature?',
    keySig: 'Key Signatures — First Four Keys',
    keySigWide: 'All Major Keys and the Circle of Fifths',
    step: { lesson: 'Half Steps, Whole Steps, and Accidentals', choice: 'Half step' },
    number: { lesson: 'Intervals by Number', choice: /^(Unison|2nd|3rd|4th|5th|6th|7th|Octave)$/ },
  },
  pt: {
    keySigPrompt: 'Que tonalidade maior tem esta armação de clave?',
    keySig: 'Armações de Clave — Primeiras Quatro Tonalidades',
    keySigWide: 'Todas as Tonalidades Maiores e o Círculo de Quintas',
    step: { lesson: 'Meios-Tons, Tons e Acidentes', choice: 'Meio-tom' },
    number: { lesson: 'Intervalos por Número', choice: /^(Uníssono|[2-7]\.ª|Oitava)$/ },
  },
  es: {
    keySigPrompt: '¿Qué tonalidad mayor tiene esta armadura de clave?',
    keySig: 'Armaduras de Clave — Primeras Cuatro Tonalidades',
    keySigWide: 'Todas las Tonalidades Mayores y el Círculo de Quintas',
    step: { lesson: 'Semitonos, Tonos y Alteraciones', choice: 'Semitono' },
    number: { lesson: 'Intervalos por Número', choice: /^(Unísono|[2-7]\.ª|Octava)$/ },
  },
} as const;

async function questionScreens(page: Page, lang: Lang, onScreen: (screen: string) => Promise<void>) {
  const q = W4A_QUESTIONS[lang];
  const screen = learnScreen(page);
  const toExercises = () => startCheck(page, lang);
  // Exercise order is shuffled: get past exercises until the wanted one is up.
  const until = async (up: () => Promise<boolean>, what: string) => {
    for (let i = 0; i < 12 && !(await up()); i++) await passExercise(page, lang);
    expect(await up(), `${lang}: reached ${what}`).toBe(true);
  };
  const choiceUp = (name: string | RegExp) => async () =>
    (await page.getByTestId('check-answers').locator('button').filter({ hasText: name }).count()) > 0;

  // A key signature with at least `glyphs` - 1 sharps or flats: VexFlow draws
  // the clef and each accidental as SVG text (C major's staff is the clef alone).
  const keySigPrompt = screen.getByText(q.keySigPrompt, { exact: true });
  const staff = keySigPrompt.locator('xpath=..').locator('svg').first();
  const keySigUp = (glyphs: number) => async () => {
    if (!(await keySigPrompt.count())) return false;
    // The clef, not just an <svg>: the loading skeleton is an svg too.
    await expect(staff.locator('text').first(), `${lang}: the key signature is drawn`).toBeVisible({ timeout: 15_000 });
    return (await staff.locator('text').count()) >= glyphs;
  };
  for (const [lesson, glyphs, name] of [
    [q.keySig, 2, 'learn-exercise-key-signature'],
    [q.keySigWide, 6, 'learn-exercise-key-signature-wide'],
  ] as const) {
    await openLessonBySearch(page, lesson);
    await toExercises();
    await until(keySigUp(glyphs), `a key signature with ${glyphs - 1}+ sharps or flats`);
    await staff.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await onScreen(name);
  }

  await openLessonBySearch(page, q.step.lesson);
  await toExercises();
  await until(choiceUp(new RegExp(`^${q.step.choice}$`)), 'a half / whole step question');
  await page.waitForTimeout(400);
  await onScreen('learn-exercise-step');

  await openLessonBySearch(page, q.number.lesson);
  await toExercises();
  await until(choiceUp(q.number.choice), 'an interval-number question');
  await page.waitForTimeout(400);
  await onScreen('learn-exercise-interval-number');
}

// Level 1 finished but for its last REQUIRED module. Optional guitar lessons
// do not gate completion and must not displace Major Triads in this fixture.
const L1_MODULES = L1_UNITS.filter((unit) => !unit.optional).flatMap((unit) => unit.modules);
const levelEndProgress = () => {
  const last = L1_MODULES[L1_MODULES.length - 1];
  const tasks = last.tasks.map((task) => task.id);
  return {
    state: {
      progress: {
        completedModules: L1_MODULES.slice(0, -1).map((module) => module.id),
        moduleProgress: { [last.id]: tasks },
        exerciseResults: { [last.id]: { scores: {}, totalAttempts: 1, lastAttemptAt: Date.now(), passed: true } },
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

/** Every button of a toast is at least the tap size (44 px on touch, 36 px with a mouse). */
async function toastButtonsAtTapSize(page: Page, toast: Locator, where: string) {
  const tap = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tap')) || 36);
  const sizes = await toast.locator('button').evaluateAll((bs) => bs.map((b) => { const r = b.getBoundingClientRect(); return [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10, b.getAttribute('aria-label') ?? b.textContent]; }));
  expect(sizes.length, `${where}: the toast has a button`).toBeGreaterThan(0);
  for (const [w, h, name] of sizes) expect.soft(Math.min(Number(w), Number(h)), `${where}: toast button "${name}" is ${w}×${h}, the tap size is ${tap}`).toBeGreaterThanOrEqual(tap - 0.5);
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
  await page.waitForTimeout(500); // settled
  await toastButtonsAtTapSize(page, toast, 'backup toast');
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

/**
 * Answer check questions until we have seen an answer selected, a first miss
 * (D-09: the hint and the struck option — no answer shown) and a right one,
 * then finish the set: the result screen (W4b).
 */
async function exerciseStates(page: Page, onState: (state: 'selected' | 'wrong' | 'right' | 'result') => Promise<void>) {
  await startCheck(page);
  const answers = page.getByTestId('check-answers');
  const seen = new Set<string>();
  for (let i = 0; i < 20; i++) {
    if (await page.getByTestId('check-result').count()) break;
    const options = answers.locator('button[data-state="open"]');
    if (!(await options.count())) break;
    await options.last().click();
    if (!seen.has('selected')) {
      // An answer chosen, Submit showing (review B3: Submit was 74–82 × 29–33 px).
      seen.add('selected');
      await page.waitForTimeout(300);
      await onState('selected');
    }
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(400);
    if ((await answers.locator('[data-state="tried"]').count()) && !(await answers.locator('[data-state="answer"]').count())) {
      if (!seen.has('wrong')) {
        seen.add('wrong');
        await onState('wrong');
      }
      await answers.locator('button[data-state="open"]').first().click();
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(400);
    }
    if (!seen.has('right') && (await page.getByTestId('check-thumb').getByText(/^Correct/).count())) {
      seen.add('right');
      await onState('right');
    }
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(300);
  }
  await expect(page.getByTestId('check-result')).toBeVisible();
  await page.waitForTimeout(300);
  await onState('result');
  seen.add('result');
  expect([...seen].sort(), 'reached every exercise state').toEqual(['result', 'right', 'selected', 'wrong']);
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

/**
 * Choose a root by pitch class: the Root select on a tablet / laptop, the
 * key-picker sheet's chips on a phone (W11-B) — audited there once.
 */
async function chooseRoot(page: Page, v: Viewport, pc: number, audit?: () => Promise<void>) {
  if (v.viewport.width >= 640) {
    await page.getByRole('combobox', { name: 'Root' }).selectOption(String(pc));
    return;
  }
  await page.getByTestId('key-picker').click();
  const sheet = page.getByRole('dialog', { name: 'Key' });
  await expect(sheet).toBeVisible();
  await page.waitForTimeout(300);
  if (audit) await audit();
  await sheet.getByRole('radiogroup', { name: 'Root' }).getByRole('radio').nth(pc).click();
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveCount(0);
}

/** Where the instrument is a pull-up sheet: phones and short screens (SHEET_QUERY). */
const isSheet = (v: Viewport) => v.viewport.width < 640 || v.viewport.height <= 500;
const DOCK = '[data-testid="instrument-dock"]';
const TOPBAR = '.app-topbar';
const INSTRUMENT = '[data-tour="play-note"], [role="grid"]';
const ANSWERS = '[data-testid="drill-answers"]';

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo} explore: type ≥ 12 px, targets ≥ ${v.touch ? 44 : 36} px, contrast, no clipping, focus, no sideways scroll, toasts clear`, async ({ browser }) => {
      test.setTimeout(240_000);
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
        await chooseRoot(page, v, 2, () => check(page, v, combo, 'key-sheet'));
        await page.waitForTimeout(400);
        await check(page, v, combo, 'explore-sharps');
        await chooseRoot(page, v, 3);
        await page.waitForTimeout(400);
        await check(page, v, combo, 'explore-flats');
        await chooseRoot(page, v, 0);
        await page.waitForTimeout(300);
        // A linked focus note: B in the staff strip, lit on the instrument.
        await page.locator('.strip-col[data-note="B"]').first().click();
        await expect(page.locator('[data-piano-key][data-focus-note]').first()).toBeAttached();
        await page.waitForTimeout(300);
        await check(page, v, combo, 'explore-focus');
        // The detail opens in place under the chord row (W11-B).
        await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
        await expect(page.getByRole('radiogroup', { name: 'Chord inversion' })).toBeVisible();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-diatonic');
        {
          const row = await boxOf(page, '.chord-row');
          const detail = await boxOf(page, '[data-testid="chord-detail"]');
          expect.soft(detail.top, where('chord detail opens under the chord row')).toBeGreaterThanOrEqual(row.bottom - 1);
        }
        await page.getByRole('tab', { name: 'All Chords' }).click();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-all');
        await page.getByRole('tab', { name: 'Build' }).click();
        await page.waitForTimeout(500);
        await check(page, v, combo, 'explore-chord-build');
        await page.getByRole('tab', { name: 'In key' }).click();
        // The chord detail open again: no toast may cover it (or the dock).
        await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
        await expect(page.getByTestId('chord-detail')).toBeVisible();
        await page.waitForTimeout(400);
        const toast = await exportToast(page);
        const dock = await boxOf(page, DOCK);
        expect(overlaps(toast, dock), where('toast vs dock')).toBe(false);
        const detailBox = await boxOf(page, '[data-testid="chord-detail"]');
        if (detailBox.bottom > 0) expect(overlaps(toast, detailBox), where('toast vs chord detail')).toBe(false);
        // The scale actions "⋯" (Copy / Print / Compare, D-29) and Compare.
        await page.getByRole('button', { name: 'Scale actions' }).click();
        await expect(page.getByRole('menu', { name: 'Scale actions' })).toBeVisible();
        await expect(page.getByRole('menuitem')).toHaveCount(3);
        await check(page, v, combo, 'explore-menu');
        await page.getByRole('menuitem', { name: 'Compare Scales' }).click();
        const compare = page.getByRole('dialog', { name: 'Compare Scales' });
        await expect(compare).toBeVisible();
        await compare.getByRole('combobox', { name: 'Select scale to compare' }).selectOption('natural_minor');
        await page.waitForTimeout(300);
        await check(page, v, combo, 'explore-compare');
        await page.keyboard.press('Escape');
        await expect(compare).toHaveCount(0);
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
        const avoidDock = [DOCK, isSheet(v) ? '.detent-head' : '.dock-panel-bar', TOPBAR, '[data-testid="chord-detail"]'];
        if (await toastsInAndOut(page, where('explore'), [DOCK, INSTRUMENT, '#main-content', '[data-testid="chord-detail"]'], avoidDock)) {
          await raiseToastStack(page);
          await check(page, v, combo, 'toasts');
          await reloadFromToast(page, where('explore'));
          // "Later" (round 5): the toast goes, a dot on "⋯" and its name say an
          // update waits; the menu item reloads.
          await expect(page.locator('#root')).not.toBeEmpty();
          await page.waitForTimeout(1200); // the reloaded page's entrance fades, as in open()
          await page.evaluate(`(async () => { (await import('/src/hooks/usePWA.ts')).usePwaUpdateStore.setState({ needRefresh: true }); })()`);
          const update = page.locator('.toast-card').filter({ hasText: /new version/i });
          await expect(update).toBeVisible();
          await expect(page.getByTestId('app-menu-badge')).toHaveCount(0);
          await update.getByRole('button', { name: 'Later' }).click();
          await expect(update).toHaveCount(0);
          await expect(page.getByTestId('app-menu-badge')).toBeVisible();
          const more = page.getByRole('button', { name: 'More — update ready' });
          await expect(more).toBeVisible();
          await check(page, v, combo, 'menu-badge');
          await more.click();
          await Promise.all([
            page.waitForEvent('load', { timeout: 15_000 }),
            page.getByRole('menuitem', { name: 'Update ready: reload' }).click(),
          ]);
        }
        await context.close();
      }

    });

    test(`${combo} guitar + dock: type ≥ 12 px, targets ≥ ${v.touch ? 44 : 36} px, contrast, no clipping, focus, no sideways scroll, toasts clear`, async ({ browser }) => {
      test.setTimeout(240_000);
      const where = (s: string) => `${combo} ${s}`;

      // Guitar + the dock's detents (a sheet on phones and short screens).
      {
        const { context, page } = await open(browser, v, th.mode, { instrument: 'guitar', lastView: 'explore' });
        await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, 'explore-guitar');
        if (v.name === 'laptop') {
          // The circle of fifths stands beside the work (D-30).
          await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
          await expect(page.getByTestId('cof-chord-mark')).toHaveCount(1);
          await page.waitForTimeout(400);
          await check(page, v, combo, 'explore-guitar-chord-circle');
          await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
          await page.waitForTimeout(300);
        }
        if (v.name === 'phone-landscape') {
          // The full-neck view (D-26 extra): all six strings, frets 0–12.
          await page.getByTestId('neck-open').click();
          const neck = page.getByTestId('neck-view');
          await expect(neck).toBeVisible();
          await expect(neck.locator('[data-string-row="0"]').first()).toBeVisible({ timeout: 15_000 });
          await page.waitForTimeout(400);
          await check(page, v, combo, 'guitar-neck');
          const fit = await neck.evaluate((root) => {
            const vh = innerHeight;
            const vw = innerWidth;
            const rows = [0, 1, 2, 3, 4, 5].map((s) => {
              const cells = Array.from(root.querySelectorAll(`[data-string-row="${s}"]`)).map((c) => c.getBoundingClientRect());
              return cells.every((r) => r.top >= 0 && r.bottom <= vh + 0.5 && r.left >= 0 && r.right <= vw + 0.5);
            });
            const frets = Array.from(root.querySelectorAll('[data-string-row="0"]')).map((c) => Number(c.getAttribute('data-fret')));
            const cell = root.querySelector('[data-string-row="3"][data-fret="5"]')!.getBoundingClientRect();
            return { rows, maxFret: Math.max(...frets), cellW: cell.width, cellH: cell.height };
          });
          expect.soft(fit.rows, where('neck: all six strings on screen')).toEqual([true, true, true, true, true, true]);
          expect.soft(fit.maxFret, where('neck: frets up to 12')).toBeGreaterThanOrEqual(12);
          test.info().annotations.push({ type: 'neck-cell', description: `${combo}: fret cell ${Math.round(fit.cellW)}×${Math.round(fit.cellH)} px` });
          await page.getByRole('button', { name: 'Close full neck' }).click();
          await expect(neck).toHaveCount(0);
          await expect(page.getByTestId('neck-open')).toBeFocused();
        }
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
          // The toast stack at every detent: never over the dock bar or sheet,
          // and nothing moves when it comes or goes (review round 4).
          for (const [key, detent] of detents) {
            await setDetent(key, detent);
            const ran = await toastsInAndOut(page, where(`dock ${detent}`), [DOCK, '.detent-head', INSTRUMENT, '#main-content'], [DOCK, '.detent-head', TOPBAR]);
            if (ran && v.name === 'phone-landscape' && detent !== 'full') {
              await raiseToastStack(page);
              const mainH = (await page.locator('#main-content').boundingBox())!.height;
              expect.soft(mainH, where(`landscape ${detent}: room left for the view with toasts up`)).toBeGreaterThanOrEqual(120);
              await lowerToastStack(page);
            }
          }
          if (await raiseToastStack(page)) await reloadFromToast(page, where('dock-full'));
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
          await toastsInAndOut(page, where('docked guitar'), [DOCK, INSTRUMENT, '#main-content'], [DOCK, TOPBAR]);
        }
        await context.close();
      }

    });

    test(`${combo} learn: type ≥ 12 px, targets ≥ ${v.touch ? 44 : 36} px, contrast, no clipping, focus, no sideways scroll, toasts clear`, async ({ browser }) => {
      test.setTimeout(300_000);
      const where = (s: string) => `${combo} ${s}`;

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
        await startCheck(page);
        const checkAnswer = page.getByRole('button', { name: 'Check Answer' });
        // 12 exercises, 3 of them builds: 9 answers always reach one (8 missed
        // when all three were shuffled last — 1 in 220 per run).
        for (let i = 0; i < 9 && !(await checkAnswer.count()); i++) await answerChoice(page);
        await expect(checkAnswer, where('reached an instrument exercise')).toBeVisible();
        await checkAnswer.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await check(page, v, combo, 'learn-exercise-instrument');
        await page.getByRole('button', { name: 'Exit the check' }).click();
        await openLessonBySearch(page, 'Pitch Matching and Direction');
        await startCheck(page);
        // Exercise order is shuffled: answer until an ear-training one is up.
        const replay = page.getByRole('button', { name: 'Replay audio' });
        for (let i = 0; i < 10 && !(await replay.count()); i++) await answerChoice(page);
        await expect(replay, where('ear-training exercise')).toBeVisible();
        await replay.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await check(page, v, combo, 'learn-exercise-ear');
        await context.close();
      }

      // Learn: a key signature on a question staff; half / whole step and
      // interval-number answers (W4a).
      {
        // The piano answers the build exercises the loop gets past.
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn', instrument: 'piano' });
        await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
        await questionScreens(page, 'en', (s) => check(page, v, combo, s));
        await context.close();
      }

      // Learn: the level-achievement overlay.
      {
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn' }, { progress: levelEndProgress() });
        await expect(learnScreen(page).getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15_000 });
        await learnScreen(page).getByRole('button').filter({ has: page.locator('h3') }).first().click();
        await expect(page.getByRole('heading', { level: 1, name: 'Your First Chords — Major Triads' })).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(800);
        const done = learnScreen(page).getByRole('button', { name: 'Complete the lesson' });
        await done.scrollIntoViewIfNeeded();
        await done.click();
        // The last lesson of Level 1 also completes its unit: the unit's
        // milestone comes first (D-23), then the level celebration.
        const milestone = page.getByRole('dialog', { name: 'Unit complete' });
        await expect(milestone).toBeVisible();
        await milestone.getByRole('button', { name: 'Continue' }).click();
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

    });

    test(`${combo} drill: type ≥ 12 px, targets ≥ ${v.touch ? 44 : 36} px, contrast, no clipping, focus, no sideways scroll, toasts clear`, async ({ browser }) => {
      test.setTimeout(240_000);
      const where = (s: string) => `${combo} ${s}`;

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
        await toastsInAndOut(page, where('drill'), [ANSWERS, `${ANSWERS} button`, '#main-content'], [ANSWERS, TOPBAR]);
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

// Common laptop sizes (W11-B), with a mouse: the workbench where it cannot
// all fit — only the work column may scroll; the circle (facts beside it
// below 900 px tall) and the instrument stay put; the same audit rules.
const LAPTOPS = [
  { name: 'laptop-1280x800', viewport: { width: 1280, height: 800 }, touch: false },
  { name: 'laptop-1366x768', viewport: { width: 1366, height: 768 }, touch: false },
  { name: 'laptop-1536x864', viewport: { width: 1536, height: 864 }, touch: false },
] as unknown as Viewport[];
for (const v of LAPTOPS) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo}: the workbench — only the work column scrolls; type, targets, contrast, clipping`, async ({ browser }) => {
      test.setTimeout(120_000);
      for (const instrument of ['piano', 'guitar'] as const) {
        const { context, page } = await open(browser, v, th.mode, { instrument, lastView: 'explore' });
        if (instrument === 'guitar') await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        await check(page, v, combo, `explore-${instrument}`);
        await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
        await expect(page.getByTestId('chord-detail')).toBeVisible();
        await check(page, v, combo, `explore-${instrument}-chord`);
        const s = await page.evaluate(() => {
          const se = document.scrollingElement!;
          const aside = document.querySelector('.explore-aside')!;
          const onScreen = (sel: string) => {
            const r = document.querySelector(sel)!.getBoundingClientRect();
            return r.top >= -0.5 && r.bottom <= innerHeight + 0.5 && r.left >= -0.5 && r.right <= innerWidth + 0.5;
          };
          return {
            page: se.scrollHeight - se.clientHeight,
            aside: aside.scrollHeight - aside.clientHeight,
            circle: onScreen('[data-testid="circle-card"]'),
            facts: onScreen('[data-testid="key-facts"]'),
            dock: onScreen('[data-testid="instrument-dock"]'),
          };
        });
        const where = `${combo} ${instrument}`;
        expect.soft(s.page, `${where}: page scroll`).toBeLessThanOrEqual(0);
        expect.soft(s.aside, `${where}: the circle column scrolls`).toBeLessThanOrEqual(1);
        expect.soft([s.circle, s.facts, s.dock], `${where}: circle, facts and dock on screen`).toEqual([true, true, true]);
        await context.close();
      }
    });
  }
}

// Circle of fifths under a real mouse (W11-A review round 5): hovering any
// wedge tints it (and its relative); every label must stay >= 4.5:1. The old
// tint put them at 3.6-3.7:1 — this test fails on it (checked).
for (const th of THEMES) {
  test(`laptop-${th.name}: every circle-of-fifths wedge hovered keeps its label readable`, async ({ browser }) => {
    test.setTimeout(120_000);
    const v = VIEWPORTS[3];
    const { context, page } = await open(browser, v, th.mode, { instrument: 'piano', lastView: 'explore', dockDetents: { explore: 'peek', learn: 'peek' } });
    const wedges = page.locator('g[role="button"][data-key]');
    const n = await wedges.count();
    expect(n, 'the circle of fifths is on the page').toBe(24);
    let tinted = 0;
    for (let i = 0; i < n; i++) {
      const w = wedges.nth(i);
      await w.scrollIntoViewIfNeeded();
      const label = await w.getAttribute('data-key');
      const resting = await w.locator('path').getAttribute('fill');
      const t = (await w.locator('text').first().boundingBox())!;
      await page.mouse.move(t.x + t.width / 2, t.y + t.height + 4);
      await page.waitForTimeout(200);
      if ((await w.locator('path').getAttribute('fill')) !== resting || (await w.locator('path').getAttribute('stroke')) === 'var(--accent)') tinted++;
      const r = await auditPage(page, { minFontPx: 12, minTapPx: 36 });
      expect.soft(r.contrastViolations, `hovering ${label}`).toEqual([]);
    }
    expect(tinted, 'the mouse really hovered the wedges').toBeGreaterThan(20);
    await context.close();
  });
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
        // W4a's question screens, translated (key-signature staff, step / number answers).
        const { context, page } = await open(browser, v, th.mode, { lastView: 'learn', instrument: 'piano' }, { lang: L.lang });
        await expect(learnScreen(page).getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15_000 });
        await questionScreens(page, L.lang, (s) => check(page, v, combo, s));
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

// The complete W4b sweep shares its assertions with design-learn.spec.ts.
// Include Spanish explicitly in this main gate, at the phone viewport.
for (const th of THEMES) {
  test(`phone-es-${th.name}: new Learn screens, pointer and final Re-read`, async ({ browser }) => {
    test.setTimeout(300_000);
    await learnScreens(browser, VIEWPORTS[0], th.mode, `phone-es-${th.name}`, 'es');
  });
}

// PT and ES on narrow phones, 360 and 320 px (W11-B review: the chords' In
// key / All / Build tabs ran off the card — "Construir" 44 % visible at 360,
// ~2 % at 320). Explore with each tab open: the tabs stay inside the card,
// and the same audit rules hold.
for (const L of LANGS) {
  for (const width of [360, 320] as const) {
    for (const th of THEMES) {
      const v = { name: `phone-${width}`, viewport: { width, height: width === 320 ? 568 : 740 }, touch: true } as unknown as Viewport;
      const combo = `phone${width}-${L.lang}-${th.name}`;
      test(`${combo}: Explore in ${L.lang.toUpperCase()} at ${width} px — the chord tabs fit, same rules`, async ({ browser }) => {
        test.setTimeout(120_000);
        const { context, page } = await open(browser, v, th.mode, { instrument: 'piano', lastView: 'explore', dockDetents: { explore: 'peek', learn: 'peek' } }, { lang: L.lang });
        await check(page, v, combo, 'explore');
        const tabs = page.getByTestId('chords-card').getByRole('tab');
        await expect(tabs).toHaveCount(3);
        for (let i = 0; i < 3; i++) {
          await tabs.nth(i).click();
          await page.waitForTimeout(300);
          const fit = await page.getByTestId('chords-card').evaluate((card) => {
            const c = card.getBoundingClientRect();
            return Array.from(card.querySelectorAll('[role="tab"]')).map((t) => {
              const r = t.getBoundingClientRect();
              return r.left >= c.left - 0.5 && r.right <= c.right + 0.5 && r.right <= innerWidth + 0.5;
            });
          });
          expect.soft(fit, `${combo}: every chord tab inside the card (tab ${i} open)`).toEqual([true, true, true]);
          await check(page, v, combo, `explore-chords-tab-${i}`);
        }
        await context.close();
      });
    }
  }
}
