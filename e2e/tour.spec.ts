import { test, expect, type Browser, type Page } from '@playwright/test';
import { WELCOME_KEY, WELCOME_SEEN } from './helpers/welcome';

/**
 * "Show me" — the self-playing tour (wave 1, brief B), over the REAL app.
 *
 * Phone and laptop, EN and PT, piano and guitar: the intro runs to its end
 * card; at every step the caption bar covers neither the spotlighted element
 * nor the instrument; the bar appearing moves nothing (< 2 px, the toast
 * rule); stopping mid-way puts back the key, view and instrument; it works
 * from the keyboard alone; and a full run writes nothing to the progress,
 * Drill, fingering or learn-session saves (compared byte for byte), for a
 * returning learner and for a new one.
 *
 * Reduced motion (no auto-advance: Next steps) keeps the runs short and
 * deterministic; one laptop run plays by itself and times the tour.
 */

const VIEWPORTS = {
  phone: { viewport: { width: 390, height: 844 }, touch: true },
  laptop: { viewport: { width: 1440, height: 900 }, touch: false },
  landscape: { viewport: { width: 844, height: 390 }, touch: true },
} as const;
type Where = keyof typeof VIEWPORTS;

const MORE = { en: 'More', pt: 'Mais' } as const;
const SHOW_ME = { en: 'Show me around', pt: 'Mostra-me como funciona' } as const;
const NEXT = { en: 'Next', pt: 'Seguinte' } as const;
const END_CAPTION = { en: 'Your turn.', pt: 'Agora é a tua vez.' } as const;
const BACK_TO_START = { en: 'Back to where I was', pt: 'Voltar para onde estava' } as const;

const PROTECTED = ['music-theory-progress', 'fermata-drill-v1', 'fermata-fingering-v1', 'fermata-learn-session-v1'];
const APP = 'music-theory-app';
const LEARN = 'fermata-learn-session-v1';
const EMPTY_LEARN_RECORD = JSON.stringify({ state: { screen: null, check: null }, version: 1 });

interface Open {
  where: Where;
  lang?: 'en' | 'pt';
  state?: Record<string, unknown>;
  extra?: Record<string, string>;
  reducedMotion?: boolean;
}

async function open(browser: Browser, { where, lang = 'en', state = {}, extra = {}, reducedMotion = true }: Open) {
  const v = VIEWPORTS[where];
  const context = await browser.newContext({
    viewport: v.viewport,
    isMobile: v.touch,
    hasTouch: v.touch,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
    serviceWorkers: 'block',
  });
  await context.addInitScript(([blob, extraItems, welcome]) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem(welcome[0], welcome[1]);
    localStorage.setItem('music-theory-app', blob);
    for (const [k, val] of Object.entries(extraItems)) localStorage.setItem(k, val);
    sessionStorage.setItem('__seeded', '1');
  }, [
    JSON.stringify({ state: { language: lang, themeMode: 'fermata', lastView: 'explore', ...state }, version: 6 }),
    extra,
    [WELCOME_KEY, WELCOME_SEEN],
  ] as const);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('button', { name: MORE[lang], exact: true })).toBeVisible();
  await page.waitForTimeout(800);
  return { context, page };
}

const bar = (page: Page) => page.getByTestId('tour-bar');

async function startTour(page: Page, lang: 'en' | 'pt' = 'en') {
  await page.getByRole('button', { name: MORE[lang], exact: true }).click();
  await page.getByRole('menuitem', { name: SHOW_ME[lang] }).click();
  await expect(bar(page)).toBeVisible();
}

/** Wait for the step to have really finished its action (it then holds). */
async function holding(page: Page) {
  await expect(bar(page)).toHaveAttribute('data-phase', 'holding', { timeout: 15_000 });
  await expect(bar(page)).toHaveAttribute('data-measured', 'true');
  await page.waitForTimeout(250); // the bar and ring settle on the final layout
}

type Box = { top: number; bottom: number; left: number; right: number };
const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

/** The bar, the spotlighted target (the ring less its 4 px), and the instrument's visible part. */
const geometry = (page: Page) => page.evaluate(() => {
  const r = (el: Element | null) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: b.top, bottom: b.bottom, left: b.left, right: b.right };
  };
  const ring = r(document.querySelector('[data-testid="tour-spotlight"]'));
  const inst = r(document.querySelector('[data-tour="play-note"]'));
  const dock = r(document.querySelector('[data-testid="instrument-dock"]'));
  const clip = (b: { top: number; bottom: number; left: number; right: number } | null) =>
    b && { top: Math.max(0, b.top), bottom: Math.min(innerHeight, b.bottom), left: Math.max(0, b.left), right: Math.min(innerWidth, b.right) };
  return {
    step: document.querySelector('[data-testid="tour-bar"]')?.getAttribute('data-step') ?? null,
    bar: r(document.querySelector('[data-testid="tour-bar"]'))!,
    target: ring && { top: ring.top + 4, bottom: ring.bottom - 4, left: ring.left + 4, right: ring.right - 4 },
    instrument: clip(inst),
    dock,
    hScroll: document.scrollingElement!.scrollWidth > innerWidth + 1,
    width: innerWidth,
  };
});

/** Step through the whole tour with Next, checking the bar at every step; returns the step ids. */
async function stepThrough(page: Page, lang: 'en' | 'pt' = 'en') {
  const ids: string[] = [];
  for (let i = 0; i < 12; i++) {
    await holding(page);
    const g = await geometry(page);
    ids.push(g.step!);
    if (g.target) expect.soft(overlap(g.bar, g.target), `${g.step}: the bar covers the spotlighted element`).toBe(0);
    if (g.instrument && g.instrument.bottom > g.instrument.top) expect.soft(overlap(g.bar, g.instrument), `${g.step}: the bar covers the instrument`).toBe(0);
    expect.soft(g.bar.left, `${g.step}: bar on screen`).toBeGreaterThanOrEqual(0);
    expect.soft(g.bar.right, `${g.step}: bar on screen`).toBeLessThanOrEqual(g.width);
    expect.soft(g.hScroll, `${g.step}: sideways page scroll`).toBe(false);
    const next = page.getByRole('button', { name: NEXT[lang], exact: true });
    if (!(await next.count())) break;
    await next.click();
  }
  await expect(page.getByTestId('tour-caption')).toHaveText(END_CAPTION[lang]);
  return ids;
}

const storage = (page: Page, keys: string[]) =>
  page.evaluate((ks) => Object.fromEntries(ks.map((k) => [k, localStorage.getItem(k)])), keys);

/** What the app shows, read off the page: view (selected tab), key summary, instrument, selected chord's root. */
const state = (page: Page) => page.evaluate(() => {
  const summary = document.querySelector('[data-testid="key-summary"] .explore-summary-key')?.textContent ?? null;
  const detail = document.querySelector('[data-testid="chord-detail"]')?.textContent?.trim() ?? null;
  const inst = document.querySelector('[data-tour="instrument"] [role="radio"][aria-checked="true"]')?.textContent ?? '';
  return {
    view: document.querySelector('[data-tab][aria-selected="true"]')?.getAttribute('data-tab') ?? null,
    keyName: summary,
    key: summary ? summary.split(' ')[0] : null,
    instrument: /guit/i.test(inst) ? 'guitar' : /piano/i.test(inst) ? 'piano' : null,
    chord: detail ? (detail.match(/^[A-G][♭♯#b]?/)?.[0] ?? detail) : null,
  };
});

// ─── The intro runs to its end card ─────────────────────────────────────────
for (const where of ['phone', 'laptop'] as const) {
  for (const lang of ['en', 'pt'] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      test(`${where} ${lang} ${instrument}: the intro runs to "Your turn"; the bar never covers the target or the instrument`, async ({ browser }) => {
        test.setTimeout(120_000);
        const { context, page } = await open(browser, { where, lang, state: { instrument } });
        await startTour(page, lang);
        const ids = await stepThrough(page, lang);
        const expected = ['key', 'scale', 'chords', 'chord', 'instrument', ...(where === 'laptop' ? ['circle'] : []), 'learn', 'drill', 'end'];
        expect(ids).toEqual(expected);
        // The end card: back on the chord, on the viewer's own instrument.
        expect(await state(page)).toMatchObject({ view: 'explore', key: 'G', chord: 'D', instrument });
        await page.getByRole('button', { name: BACK_TO_START[lang] }).click();
        await expect(bar(page)).toHaveCount(0);
        expect(await state(page)).toMatchObject({ view: 'explore', key: 'C', instrument, chord: null });
        await context.close();
      });
    }
  }
}

test('landscape phone: the bar keeps off the target and the instrument at every step', async ({ browser }) => {
  test.setTimeout(120_000);
  const { context, page } = await open(browser, { where: 'landscape', state: { instrument: 'guitar' } });
  await startTour(page);
  const ids = await stepThrough(page);
  expect(ids).toEqual(['key', 'scale', 'chords', 'chord', 'instrument', 'learn', 'drill', 'end']);
  await context.close();
});

// ─── Stopping mid-way ───────────────────────────────────────────────────────
test('stopping mid-way restores the previous key, view and instrument', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, { where: 'laptop', state: { instrument: 'guitar', selectedKey: { natural: 'E', accidental: 'b' }, selectedScale: 'natural_minor' } });
  const before = await state(page);
  expect(before).toMatchObject({ key: 'E♭', instrument: 'guitar', view: 'explore' });
  const savedBefore = await storage(page, [APP]);
  await startTour(page);
  for (let i = 0; i < 4; i++) {
    await holding(page);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await holding(page);
  expect(await state(page)).toMatchObject({ key: 'G', instrument: 'piano', chord: 'D' });
  await page.getByRole('button', { name: 'End the tour' }).click();
  await expect(bar(page)).toHaveCount(0);
  expect(await state(page)).toEqual(before);
  await expect(page.getByRole('radio', { name: 'Guitar' })).toHaveAttribute('aria-checked', 'true');
  expect(await storage(page, [APP])).toEqual(savedBefore);
  // A reload boots on the learner's own settings.
  await page.reload();
  await page.waitForTimeout(800);
  expect(await state(page)).toEqual(before);
  await context.close();
});

test('stopping in Explore puts the chords card back on the tab the viewer had (All chords), with its chord', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, { where: 'laptop', state: { instrument: 'piano' } });
  await page.locator('#chords-tab-all').click();
  await expect(page.locator('#chords-tab-all')).toHaveAttribute('aria-selected', 'true');
  const pick = page.locator('#chords-panel [data-quality]').nth(1);
  const quality = (await pick.getAttribute('data-quality'))!;
  await pick.click();
  await expect(page.locator(`#chords-panel [data-quality="${quality}"]`)).toHaveAttribute('aria-pressed', 'true');
  await startTour(page);
  for (let i = 0; i < 2; i++) {
    await holding(page);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await holding(page);
  await expect(bar(page)).toHaveAttribute('data-step', 'chords');
  await expect(page.locator('#chords-tab-diatonic')).toHaveAttribute('aria-selected', 'true'); // the tour shows In key
  await page.getByRole('button', { name: 'End the tour' }).click();
  await expect(bar(page)).toHaveCount(0);
  await expect(page.locator('#chords-tab-all')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator(`#chords-panel [data-quality="${quality}"]`)).toHaveAttribute('aria-pressed', 'true');
  await context.close();
});

test('stopped while in Learn (started from the Learn overview): back on the Learn overview', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, { where: 'laptop', state: { lastView: 'learn', instrument: 'piano' } });
  await expect(page.locator('#learn-panel h1')).toBeVisible({ timeout: 15_000 });
  await startTour(page);
  for (let i = 0; i < 6; i++) {
    await holding(page);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await holding(page);
  await expect(bar(page)).toHaveAttribute('data-step', 'learn');
  await page.keyboard.press('Escape');
  await expect(bar(page)).toHaveCount(0);
  expect(await state(page)).toMatchObject({ view: 'learn', instrument: 'piano' });
  await context.close();
});

// ─── Toasts keep off the bar ────────────────────────────────────────────────
for (const where of ['phone', 'laptop', 'landscape'] as const) {
  test(`${where}: a toast raised during the tour never covers the caption bar (it waits while the bar is under the top bar)`, async ({ browser }) => {
    test.setTimeout(120_000);
    const { context, page } = await open(browser, { where });
    // The app's own toast store, served by the dev server only (as in design-system.spec).
    const res = await page.request.get('/src/state/toastStore.ts');
    test.skip(!(res.ok() && (res.headers()['content-type'] ?? '').includes('javascript')), 'needs the dev server\'s /src modules');
    await startTour(page);
    await holding(page);
    await page.evaluate(`(async () => { (await import('/src/state/toastStore.ts')).toast('Backup downloaded', 'success', 0); })()`);
    let shown = 0;
    for (let i = 0; i < 12; i++) {
      await holding(page);
      await page.waitForTimeout(300); // the toast region re-measures and the card slides in
      const g = await page.evaluate(() => {
        const r = (el: Element) => { const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right }; };
        const barEl = document.querySelector('[data-testid="tour-bar"]')!;
        const cards = Array.from(document.querySelectorAll('.toast-card')).filter((c) => !c.hasAttribute('data-toast-queued') && getComputedStyle(c).visibility !== 'hidden').map(r);
        return { step: barEl.getAttribute('data-step'), slot: barEl.getAttribute('data-slot'), bar: r(barEl), cards };
      });
      shown += g.cards.length;
      for (const c of g.cards) expect.soft(overlap(g.bar, c), `${g.step} (${g.slot}): a toast covers the bar`).toBe(0);
      const next = page.getByRole('button', { name: 'Next', exact: true });
      if (!(await next.count())) break;
      await next.click();
    }
    // Not vacuous: the toast did show beside the bar at some step.
    expect(shown).toBeGreaterThan(0);
    await context.close();
  });
}

// ─── Keyboard only ──────────────────────────────────────────────────────────
test('keyboard only: open from the menu, step with Enter, Escape or the end card returns focus', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, { where: 'laptop' });
  const more = page.getByRole('button', { name: 'More', exact: true });
  await more.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Show me around' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(bar(page)).toBeVisible();
  // Focus is in the bar, on Next (reduced motion: the viewer steps).
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeFocused();
  for (let i = 0; i < 12 && (await page.getByRole('button', { name: 'Next', exact: true }).count()); i++) {
    await holding(page);
    await page.keyboard.press('Enter');
  }
  await holding(page);
  await expect(page.getByTestId('tour-caption')).toHaveText('Your turn.');
  // Next left with the last step: focus went to the end card's own button.
  await expect(page.getByRole('button', { name: 'Back to where I was' })).toBeFocused();
  // Shift+Tab reaches the other controls, all inside the bar.
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Stay here' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(bar(page)).toHaveCount(0);
  await expect(more).toBeFocused();
  // "Stay here" kept the tour's key.
  expect(await state(page)).toMatchObject({ key: 'G', chord: 'D' });

  // Again, and Escape ends it at once.
  await more.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(bar(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(bar(page)).toHaveCount(0);
  await expect(more).toBeFocused();
  await context.close();
});

// ─── Nothing moves when the bar appears ─────────────────────────────────────
for (const where of ['phone', 'laptop', 'landscape'] as const) {
  test(`${where}: the bar appearing moves nothing (< 2 px)`, async ({ browser }) => {
    test.setTimeout(60_000);
    // Already on the tour's key, with the dock as the first step leaves it: only the bar is new.
    const { context, page } = await open(browser, {
      where,
      state: { selectedKey: { natural: 'G', accidental: '' }, selectedScale: 'major', ...(where === 'landscape' ? {} : { dockDetents: { explore: 'half', learn: 'peek' } }) },
    });
    const SELECTORS = ['.app-topbar', '#main-content', '[data-testid="explore-header"]', '[data-testid="scale-strip"]', '[data-testid="instrument-dock"]', '[data-tour="play-note"]'];
    const rects = () => page.evaluate((sels) => sels.map((s) => {
      const b = document.querySelector(s)?.getBoundingClientRect();
      return b ? [s, Math.round(b.top), Math.round(b.left), Math.round(b.height)] : [s, null];
    }), SELECTORS);
    const before = await rects();
    await startTour(page);
    await expect(bar(page)).toHaveAttribute('data-measured', 'true');
    const after = await rects();
    for (let i = 0; i < before.length; i++) {
      const [sel, ...a] = before[i];
      const [, ...b] = after[i];
      if (a[0] === null || b[0] === null) continue;
      for (let j = 0; j < a.length; j++) expect.soft(Math.abs((a[j] as number) - (b[j] as number)), `${sel} moved`).toBeLessThan(2);
    }
    await context.close();
  });
}

// ─── Watching never writes anyone's progress ────────────────────────────────
const NOW = Date.now();
const RETURNING = {
  'music-theory-progress': JSON.stringify({
    state: { progress: {
      completedModules: ['l1u1m1', 'l1u1m2'], moduleProgress: { l1u1m3: ['t1'] },
      exerciseResults: { l1u1m1: { attempts: 2, bestScore: 0.9, passed: true, scores: { l1u1m1e1: 1 } } },
      reviewSchedules: {
        l1u1m1: { completedAt: NOW - 9e8, nextReviewAt: NOW + 9e7, intervalLevel: 1, reviewCount: 1, lastReviewedAt: NOW - 9e7 },
        l1u1m2: { completedAt: NOW - 8e8, nextReviewAt: NOW + 9e7, intervalLevel: 0, reviewCount: 0, lastReviewedAt: NOW - 8e8 },
      },
    } },
    version: 4,
  }),
  'fermata-drill-v1': JSON.stringify({
    state: {
      items: {}, settings: { length: 24, newPerSession: 4, families: {}, sound: true, showTimer: false },
      sprintBests: {}, lifetime: { answered: 12, correct: 10 }, activeSession: null, sprint: null, introDone: true,
    },
    version: 3,
  }),
  'fermata-fingering-v1': JSON.stringify({ state: { overrides: {}, labelMode: 'degree' }, version: 1 }),
  'fermata-learn-session-v1': JSON.stringify({ state: { screen: { type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m3', section: null, at: NOW }, check: null }, version: 1 }),
};

for (const who of ['returning', 'new'] as const) {
  test(`${who} learner: a full run (guitar too) writes nothing to progress, Drill, fingering or the learn session`, async ({ browser }) => {
    test.setTimeout(120_000);
    const { context, page } = await open(browser, { where: 'laptop', state: { instrument: 'piano' }, extra: who === 'returning' ? RETURNING : {} });
    // Loading the stores the app has loaded at boot may already normalise them: compare from here.
    const before = await storage(page, [APP, ...PROTECTED]);
    await startTour(page);
    const ids: string[] = [];
    for (let i = 0; i < 12; i++) {
      await holding(page);
      ids.push((await bar(page).getAttribute('data-step'))!);
      // Mid-tour nothing has been written, not even the settings. (Learn saves
      // an empty "no lesson open" record the first time it opens — a new
      // learner's — which the tour takes back on the way out.)
      const now = await storage(page, [APP, ...PROTECTED]);
      if (who === 'new' && now[LEARN] === EMPTY_LEARN_RECORD) now[LEARN] = null;
      expect.soft(now, `during ${ids[ids.length - 1]}`).toEqual(before);
      const next = page.getByRole('button', { name: 'Next', exact: true });
      if (!(await next.count())) break;
      await next.click();
    }
    if (who === 'new') {
      // A new learner's tour opens Learn and Drill for real.
      expect(ids).toContain('learn');
    }
    await page.getByRole('button', { name: 'Back to where I was' }).click();
    await expect(bar(page)).toHaveCount(0);
    await page.waitForTimeout(500);
    expect(await storage(page, [APP, ...PROTECTED])).toEqual(before);
    await context.close();
  });
}

test('a new learner\'s tour really opens Learn and Drill (Drill on its intro, no session started)', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, { where: 'laptop' });
  await startTour(page);
  for (let i = 0; i < 12; i++) {
    await holding(page);
    const step = await bar(page).getAttribute('data-step');
    if (step === 'learn') await expect(page.locator('#learn-panel h1')).toBeVisible();
    if (step === 'drill') {
      await expect(page.locator('#drill-panel').getByTestId('drill-intro')).toBeVisible();
      break;
    }
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  expect(await page.evaluate(() => localStorage.getItem('fermata-drill-v1'))).toBeNull();
  await page.getByRole('button', { name: 'End the tour' }).click();
  await expect(bar(page)).toHaveCount(0);
  await context.close();
});

test('a returning learner\'s tour points at the Learn and Drill tabs instead of opening them', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, { where: 'laptop', extra: RETURNING });
  await startTour(page);
  for (let i = 0; i < 12; i++) {
    await holding(page);
    const step = await bar(page).getAttribute('data-step');
    if (step === 'learn' || step === 'drill') {
      const g = await geometry(page);
      const tab = await page.locator(`[data-tab="${step}"]`).boundingBox();
      expect(Math.abs(g.target!.top - tab!.y)).toBeLessThan(2);
      expect(Math.abs(g.target!.left - tab!.x)).toBeLessThan(2);
      expect(await state(page)).toMatchObject({ view: 'explore' });
    }
    if (step === 'drill') break;
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: 'End the tour' }).click();
  await context.close();
});

test('started in Learn with a lesson open: the end card says it lands on Explore (going back would re-save the lesson), and it does', async ({ browser }) => {
  test.setTimeout(120_000);
  const { context, page } = await open(browser, { where: 'laptop', state: { lastView: 'learn', instrument: 'piano' }, extra: RETURNING });
  await expect(page.locator('[data-tab="learn"]')).toHaveAttribute('aria-selected', 'true');
  const learnBefore = await storage(page, [LEARN]);
  await startTour(page);
  for (let i = 0; i < 12; i++) {
    await holding(page);
    const next = page.getByRole('button', { name: 'Next', exact: true });
    if (!(await next.count())) break;
    await next.click();
  }
  await expect(page.getByTestId('tour-caption')).toHaveText('Your turn.');
  await expect(page.getByRole('button', { name: 'Back to where I was' })).toHaveCount(0);
  await expect(page.getByTestId('tour-elsewhere')).toHaveText('You will be in Explore; Learn is one tap away.');
  await page.getByRole('button', { name: 'Put things back' }).click();
  await expect(bar(page)).toHaveCount(0);
  expect(await state(page)).toMatchObject({ view: 'explore', instrument: 'piano' });
  expect(await storage(page, [LEARN])).toEqual(learnBefore);
  await context.close();
});

// ─── Playing by itself ──────────────────────────────────────────────────────
test('laptop, motion allowed: the tour plays itself to the end card in about a minute; touching the app pauses it', async ({ browser }) => {
  test.setTimeout(180_000);
  const { context, page } = await open(browser, { where: 'laptop', reducedMotion: false });
  const t0 = Date.now();
  await startTour(page);
  await expect(page.getByTestId('tour-pause')).toBeVisible();
  await expect(page.getByTestId('tour-caption')).toHaveText('Your turn.', { timeout: 150_000 });
  const seconds = (Date.now() - t0) / 1000;
  console.log(`intro tour, laptop EN, played by itself: ${seconds.toFixed(1)} s`);
  expect(seconds).toBeGreaterThan(45);
  expect(seconds).toBeLessThan(100);
  // Back one step (Drill), then touch the app itself: paused, with Resume / End.
  await page.getByTestId('tour-back').click();
  await expect(bar(page)).toHaveAttribute('data-step', 'drill');
  await page.locator('#drill-intro-title').click();
  await expect(page.getByTestId('tour-paused')).toBeVisible();
  const step = await bar(page).getAttribute('data-step');
  await page.waitForTimeout(8000);
  await expect(bar(page)).toHaveAttribute('data-step', step!);
  await page.getByTestId('tour-end').click();
  await expect(bar(page)).toHaveCount(0);
  await context.close();
});
