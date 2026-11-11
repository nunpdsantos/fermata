import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { audit, overlap, seededBrowser, type Box, type Lang, type View } from './helpers/wave1';

/**
 * The design rules (e2e/helpers/designAudit.ts: type ≥ 12 px, targets ≥ 36 /
 * 44 px, contrast, no sideways scroll, nothing cut off) on the metronome's
 * bar (wave 3, stream M), at rest and running, in Explore and in a lesson
 * (and over a check's answers); over a phone's instrument sheet at Peek,
 * Half and Full; with a toast up — phone 390×844, landscape 844×390, tablet
 * 820×1180 (touch), laptop 1440×900 (mouse), day and night; PT and ES at
 * 320 and 360 px. And its geometry: never over the instrument, never over a
 * control of the top bar, never over a check's answers, inside the window;
 * opening it moves nothing (measured with and without it in the same run);
 * a toast coming and going moves it < 2 px and never covers it.
 * METRONOME_SHOTS=<dir> saves a screenshot of each screen.
 */

const VIEWS: View[] = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
];
const THEMES = [{ name: 'day', mode: 'fermata' }, { name: 'night', mode: 'fermata-night' }] as const;
const SHOTS = process.env.METRONOME_SHOTS;
const WORDS = {
  en: { more: 'More', item: 'Metronome', start: 'Start the metronome', stop: 'Stop the metronome', learn: 'Learn', explore: 'Explore', lesson: 'The Staff and Clefs', check: 'Start the check' },
  pt: { more: 'Mais', item: 'Metrónomo', start: 'Iniciar o metrónomo', stop: 'Parar o metrónomo', learn: 'Aprender', explore: 'Explorar', lesson: 'A pauta e as claves', check: 'Começar a verificação' },
  es: { more: 'Más', item: 'Metrónomo', start: 'Iniciar el metrónomo', stop: 'Parar el metrónomo', learn: 'Aprender', explore: 'Explorar', lesson: 'El pentagrama y las claves', check: 'Empezar la comprobación' },
} as const;

const BAR = '[data-testid="metronome"]';
const DOCK = '[data-testid="instrument-dock"]';

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
}

const boxOf = (page: Page, sel: string) => page.evaluate((s) => {
  const el = document.querySelector(s);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.height > 0 ? { top: r.top, bottom: r.bottom, left: r.left, right: r.right } : null;
}, sel) as Promise<Box | null>;

/** The top bar's controls (tabs, buttons), each a box. */
const topBarControls = (page: Page) => page.evaluate(() =>
  Array.from(document.querySelectorAll('.app-topbar button, .app-topbar [role="tab"], .app-topbar a'))
    .map((el) => el.getBoundingClientRect()).filter((r) => r.width > 1 && r.height > 1)
    .map((r) => ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right }))) as Promise<Box[]>;

/** The bar's geometry rules on whatever is on screen. */
async function geometry(page: Page, v: View, where: string) {
  const bar = await boxOf(page, BAR);
  expect(bar, `${where}: the bar is on screen`).not.toBeNull();
  const b = bar!;
  expect.soft(b.left, `${where}: inside the window (left)`).toBeGreaterThanOrEqual(0);
  expect.soft(b.right, `${where}: inside the window (right)`).toBeLessThanOrEqual(v.viewport.width);
  expect.soft(b.top, `${where}: inside the window (top)`).toBeGreaterThanOrEqual(0);
  expect.soft(b.bottom, `${where}: inside the window (bottom)`).toBeLessThanOrEqual(v.viewport.height);
  const dock = await boxOf(page, DOCK);
  if (dock) expect.soft(overlap(b, dock), `${where}: not over the instrument`).toBe(0);
  for (const c of await topBarControls(page)) expect.soft(overlap(b, c), `${where}: not over a control of the top bar`).toBe(0);
  const inTopBar = await page.locator(BAR).getAttribute('data-in-top-bar');
  const topBar = (await boxOf(page, '.app-topbar'))!;
  if (!inTopBar) expect.soft(b.top, `${where}: under the top bar`).toBeGreaterThanOrEqual(topBar.bottom - 0.5);
  const answers = await boxOf(page, '[data-testid="check-answer-zone"]');
  if (answers) expect.soft(overlap(b, answers), `${where}: not over the check's answers`).toBe(0);
  // A native select cuts its text off with no ellipsis the audit can see: the chosen option must fit.
  const select = page.locator(`${BAR} select`);
  if (await select.count()) {
    const fit = await select.evaluate((el: HTMLSelectElement) => {
      const cs = getComputedStyle(el);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const text = el.options[el.selectedIndex].text;
      const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      // On a phone the select gets the grid cell's width: leave 8 px of it for Linux's wider text (CI).
      // Elsewhere it sizes to its options; then the select itself is the room.
      const squeezed = getComputedStyle(el.closest('.metro-row')!).display === 'grid';
      const room = squeezed ? (el.closest('.metro-beats') as HTMLElement).clientWidth - pad : el.clientWidth - pad + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      return { text, need: ctx.measureText(text).width + (squeezed ? 8 : 0), room };
    });
    expect.soft(fit.need, `${where}: "${fit.text}" fits its select (with room to spare on a phone)`).toBeLessThanOrEqual(fit.room + 0.5);
  }
}

async function check(page: Page, v: View, where: string) {
  await audit(page, v, where);
  await geometry(page, v, where);
  await shot(page, where);
}

async function openBar(page: Page, lang: Lang) {
  await page.getByRole('button', { name: WORDS[lang].more, exact: true }).click();
  await page.getByRole('menuitem', { name: WORDS[lang].item }).click();
  await expect(page.locator(BAR)).toHaveAttribute('data-measured', 'true');
}

/** Start it and wait for the count to mark a beat. */
async function run(page: Page, lang: Lang) {
  await page.getByRole('button', { name: WORDS[lang].start }).click();
  await expect(page.locator(`${BAR} [data-current]`)).toHaveCount(1, { timeout: 5000 });
}
async function halt(page: Page, lang: Lang) {
  await page.getByRole('button', { name: WORDS[lang].stop }).click();
}

const setDetent = (page: Page, detent: 'peek' | 'half' | 'full') =>
  page.evaluate(`(async () => (await import('/src/state/store.ts')).useAppStore.getState().setDockDetent('explore', '${detent}'))()`);

async function open(browser: Browser, v: View, theme: string, lang: Lang, instrument: 'piano' | 'guitar' = 'guitar') {
  const { context, page } = await seededBrowser(browser, v, {
    themeMode: theme, language: lang, instrument, lastView: 'explore',
    selectedKey: { natural: 'G', accidental: '' }, selectedScale: 'major',
  }, {}, { lang });
  await page.goto('/');
  await expect(page.locator(DOCK)).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);
  return { context, page };
}

/**
 * The dev server serves the app's own modules (/src/…); the production build
 * (playwright.preview.config.ts) does not. The two steps that drive the app
 * through them (the sheet's detents, a toast) run on the dev server and are
 * skipped, with a note, on the build — never silently on the dev server: only
 * a build (the one that serves the PWA manifest) may lack them (the
 * design-system sweep's rule; wave 3 integration).
 */
async function hasDevModules(page: Page): Promise<boolean> {
  const res = await page.request.get('/src/state/store.ts');
  const dev = res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
  if (!dev) {
    const manifest = await page.request.get('/manifest.webmanifest');
    expect((manifest.headers()['content-type'] ?? '').includes('json'), 'dev server without /src modules?').toBe(true);
    test.info().annotations.push({ type: 'note', description: 'the detent and toast steps drive the app through /src modules: dev server only, skipped on this build' });
  }
  return dev;
}

async function sweep(browser: Browser, v: View, theme: string, themeName: string, lang: Lang, full = true) {
  const w = WORDS[lang];
  const combo = `metronome-${v.name}-${themeName}-${lang}`;
  const { context, page } = await open(browser, v, theme, lang);
  const dev = await hasDevModules(page);

  // Opening it moves nothing: the instrument and the view, with and without the bar, in this run.
  const without = { dock: await boxOf(page, DOCK), main: await boxOf(page, '#main-content') };
  await openBar(page, lang);
  await page.waitForTimeout(300);
  expect(await boxOf(page, DOCK), 'the bar moves the instrument by nothing').toEqual(without.dock);
  expect(await boxOf(page, '#main-content'), 'the bar moves the view by nothing').toEqual(without.main);

  await check(page, v, `${combo}--explore-rest`);
  await run(page, lang);
  await check(page, v, `${combo}--explore-running`);

  if (full && dev && (v.name === 'phone' || v.name === 'landscape')) {
    // Over the phone's sheet at each detent (the guitar has a Full).
    for (const d of ['peek', 'half', 'full'] as const) {
      await setDetent(page, d);
      await page.waitForTimeout(700);
      await check(page, v, `${combo}--sheet-${d}`);
    }
    await setDetent(page, v.name === 'landscape' ? 'peek' : 'half');
    await page.waitForTimeout(700);
  }

  if (full && dev) {
    // A toast comes and goes: it never covers the bar, and the bar moves < 2 px.
    const before = (await boxOf(page, BAR))!;
    await page.evaluate("import('/src/state/toastStore.ts').then((m) => m.toast('Copied to clipboard', 'success', 30000))");
    await expect(page.locator('.toast-region [role="status"], .toast-region [role="alert"]').first()).toBeVisible();
    await page.waitForTimeout(400);
    const during = (await boxOf(page, BAR))!;
    for (const t of await page.locator('.toast-region > *').evaluateAll((els) => els.map((e) => {
      const r = e.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, visible: getComputedStyle(e).visibility !== 'hidden' && r.height > 0 };
    }))) if (t.visible) expect.soft(overlap(t, during), `${combo}: the toast is not over the bar`).toBe(0);
    expect(Math.abs(during.top - before.top) + Math.abs(during.left - before.left), 'a toast moves the bar < 2 px').toBeLessThan(2);
    await check(page, v, `${combo}--toast`);
    await page.evaluate("import('/src/state/toastStore.ts').then((m) => m.useToastStore.setState({ toasts: [] }))");
    await page.waitForTimeout(500);
    const after = (await boxOf(page, BAR))!;
    expect(Math.abs(after.top - before.top) + Math.abs(after.left - before.left), 'the toast leaving moves the bar < 2 px').toBeLessThan(2);
  }

  // In a lesson (Learn, from its Continue card), running, then at rest.
  await page.getByRole('tab', { name: w.learn }).click();
  await page.getByRole('button', { name: new RegExp(w.lesson) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: w.lesson })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(700);
  await expect(page.locator(`${BAR}[data-running]`)).toHaveCount(1);
  await check(page, v, `${combo}--lesson-running`);
  await halt(page, lang);
  await check(page, v, `${combo}--lesson-rest`);

  if (full) {
    // A check: the bar keeps off the answers.
    const start = page.getByRole('button', { name: w.check });
    await start.scrollIntoViewIfNeeded();
    await start.click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    await page.waitForTimeout(600);
    await check(page, v, `${combo}--check`);
  }
  await context.close();
}

for (const v of VIEWS) {
  for (const th of THEMES) {
    test(`${v.name}-${th.name}: the metronome's bar passes the design rules`, async ({ browser }) => {
      test.setTimeout(180_000);
      await sweep(browser, v, th.mode, th.name, 'en');
    });
  }
}

for (const lang of ['pt', 'es'] as const) {
  for (const width of [320, 360] as const) {
    test(`${lang} at ${width} px: the metronome's bar passes the design rules`, async ({ browser }) => {
      test.setTimeout(180_000);
      await sweep(browser, { name: `phone-${width}`, viewport: { width, height: width === 320 ? 568 : 740 }, touch: true }, 'fermata', 'day', lang, false);
    });
  }
}

for (const lang of ['pt'] as const) {
  for (const v of [VIEWS[0], VIEWS[1], VIEWS[3]]) {
    test(`${lang} ${v.name}: the metronome's bar passes the design rules`, async ({ browser }) => {
      test.setTimeout(180_000);
      await sweep(browser, v, 'fermata', 'day', lang, false);
    });
  }
}

test('the count marks the beat with a fill (and a short pulse) — under reduced motion only an underline, no fill, no pulse', async ({ browser }) => {
  for (const reducedMotion of [false, true]) {
    const { context, page } = await seededBrowser(browser, VIEWS[3], { themeMode: 'fermata', language: 'en', lastView: 'explore' }, {}, { reducedMotion });
    await page.goto('/');
    await expect(page.locator(DOCK)).toBeVisible({ timeout: 15_000 });
    await openBar(page, 'en');
    await run(page, 'en');
    const style = await page.locator(`${BAR} .metro-count [data-current]`).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, animation: cs.animationName, underline: cs.textDecorationLine };
    });
    if (reducedMotion) {
      expect(style.bg).toBe('rgba(0, 0, 0, 0)');
      expect(style.animation).toBe('none');
      expect(style.underline).toBe('underline');
    } else {
      expect(style.bg).not.toBe('rgba(0, 0, 0, 0)');
      expect(style.animation).toBe('metro-pulse');
    }
    await context.close();
  }
});

/**
 * A phone on its side (844×390) with the guitar practice sheet open (wave 3,
 * second fix pass: the final review inferred, without measuring, that the
 * bar's fallback place might overlap the sheet's panel there). Measured: the
 * bar (portalled into the sheet) covers no control of the sheet, and ▶ / ■
 * and ✕ are each the element under the pointer at their centre and work.
 */
test('landscape 844×390, the guitar practice sheet open: the bar covers no control of the sheet; ▶ / ■ and ✕ can be reached and work', async ({ browser }) => {
  test.setTimeout(90_000);
  const v = VIEWS[1];
  expect(v.viewport).toEqual({ width: 844, height: 390 });
  const { context, page } = await open(browser, v, 'fermata', 'en');
  await openBar(page, 'en');
  await run(page, 'en');
  const practice = page.getByTestId('practice-open').first();
  await practice.scrollIntoViewIfNeeded();
  await practice.click();
  const sheet = page.getByRole('dialog', { name: 'Practise on the guitar' });
  await expect(sheet).toBeVisible();
  const bar = sheet.getByRole('region', { name: 'Metronome' });
  await expect(bar).toHaveAttribute('data-measured', 'true');
  await page.waitForTimeout(800); // the sheet's own entrance and the bar's placement settle
  await shot(page, 'metronome-landscape-practice-sheet');

  const measured = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]')!;
    const barEl = dialog.querySelector('[data-testid="metronome"]')!;
    const box = (r: DOMRect) => ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
    const panel = dialog.querySelector('.sheet-panel') ?? dialog;
    const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button, select, input, textarea, a[href], [role="slider"], [role="tab"], [role="switch"], [role="radio"], [role="checkbox"], [tabindex]:not([tabindex="-1"])'))
      .filter((el) => !barEl.contains(el))
      .map((el) => ({ name: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40), r: el.getBoundingClientRect() }))
      .filter((c) => c.r.width > 1 && c.r.height > 1)
      .map((c) => ({ name: c.name, ...box(c.r) }));
    return { bar: box(barEl.getBoundingClientRect()), panel: box(panel.getBoundingClientRect()), compact: barEl.hasAttribute('data-compact'), controls };
  });
  test.info().annotations.push({ type: 'measured', description: `844×390 practice sheet: panel ${JSON.stringify(measured.panel)}, bar ${JSON.stringify(measured.bar)} (compact: ${measured.compact}), ${measured.controls.length} controls` });
  expect(measured.controls.length, 'known positive: the sheet\'s controls were found').toBeGreaterThan(3);
  const covered = measured.controls.filter((c) => overlap(measured.bar, c) > 0).map((c) => c.name);
  expect(covered, 'the bar covers no control of the sheet').toEqual([]);
  expect(measured.bar.top).toBeGreaterThanOrEqual(0);
  expect(measured.bar.bottom).toBeLessThanOrEqual(v.viewport.height);
  expect(measured.bar.left).toBeGreaterThanOrEqual(0);
  expect(measured.bar.right).toBeLessThanOrEqual(v.viewport.width);

  /** The button is what a finger at its centre touches. */
  const reachable = async (testId: string) => {
    const b = (await bar.getByTestId(testId).boundingBox())!;
    return page.evaluate(([x, y, id]) => document.elementFromPoint(x as number, y as number)?.closest(`[data-testid="${id}"]`) !== null, [b.x + b.width / 2, b.y + b.height / 2, testId] as const);
  };
  expect(await reachable('metronome-play'), '■ is under the finger').toBe(true);
  expect(await reachable('metronome-close'), '✕ is under the finger').toBe(true);
  await bar.getByRole('button', { name: 'Stop the metronome' }).click();
  await expect(bar).not.toHaveAttribute('data-running', 'true');
  expect(await reachable('metronome-play'), '▶ is under the finger').toBe(true);
  await bar.getByRole('button', { name: 'Start the metronome' }).click();
  await expect(bar).toHaveAttribute('data-running', 'true');
  await bar.getByRole('button', { name: 'Close the metronome' }).click();
  await expect(page.getByTestId('metronome')).toHaveCount(0);
  await expect(sheet).toBeVisible();
  // ✕ stopped it and focus stayed in the sheet.
  expect(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null)).toBe(true);
  await context.close();
});
