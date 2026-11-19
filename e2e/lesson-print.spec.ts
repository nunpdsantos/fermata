import { test, expect, type Browser, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { welcomeSeenState } from './helpers/welcome';

/**
 * A printed lesson (audit 2, P10, 19 November 2026): its text, staves,
 * rhythms, song references and tasks — not the screen's furniture (the
 * section rail or picker, "Hear it", "Show on the piano", "Open in Explore",
 * the check's card and "Start the check", Previous / Next, "Found a
 * mistake?", the top bar, the dock), in one column, Night printed as light
 * with every printed word readable on the paper. Printed at A4 width as
 * Explore's print test does (explore-workbench.spec.ts), and from a laptop's
 * screen, where the rail was drawn when the learner printed.
 *
 * PRINT_SHOTS=<dir> writes the printed lesson (A4) as PNGs for the owner's eye.
 */

const SHOTS = process.env.PRINT_SHOTS;

async function lesson(browser: Browser, id: string, themeMode: 'fermata' | 'fermata-night', viewport: { width: number; height: number }) {
  const state = welcomeSeenState(test.info().project.use.baseURL!);
  state.origins[0].localStorage = state.origins[0].localStorage.map((e) =>
    e.name === 'music-theory-app' ? { ...e, value: JSON.stringify({ state: { language: 'en', themeMode, lastView: 'learn', instrument: 'piano' }, version: 6 }) } : e);
  const context = await browser.newContext({ storageState: state, viewport, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`/?lesson=${id}`);
  await expect(page.locator('[data-section="check"]')).toBeAttached({ timeout: 15_000 });
  await expect(page.locator('[data-testid="inline-try-this"]').first()).toBeVisible();
  return { context, page };
}

/** What prints, read off the page laid out for paper. */
function printed(page: Page) {
  return page.evaluate(() => {
    const shown = (e: Element) => e.getClientRects().length > 0;
    const any = (sel: string) => Array.from(document.querySelectorAll(sel)).some(shown);
    const buttonNamed = (re: RegExp) => Array.from(document.querySelectorAll('button, a')).some((b) => re.test((b.textContent ?? '').trim()) && shown(b));
    // Every element that draws words of its own: its colour against the paper.
    const lum = (rgb: number[]) => {
      const [r, g, b] = rgb.map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const paper = lum([255, 255, 255]);
    const faint: string[] = [];
    for (const el of Array.from(document.querySelectorAll('[data-learn-scroll] *'))) {
      const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent ?? '').join('').trim();
      if (!own || !shown(el)) continue;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
      const l = lum(parse(style.color));
      const ratio = (paper + 0.05) / (l + 0.05);
      if (ratio < 4.5) faint.push(`${own.slice(0, 40)} (${style.color}, ${ratio.toFixed(2)}:1)`);
    }
    const intro = document.querySelector('[data-section="intro"]')!;
    const column = intro.getBoundingClientRect();
    // The lesson's column against its grid: on a laptop's screen the rail took 250 px + a gap on its left.
    const grid = intro.parentElement!.parentElement!.getBoundingClientRect();
    return {
      furniture: {
        rail: any('[data-testid="section-rail"]'),
        picker: any('[data-testid="section-picker"]'),
        hearIt: buttonNamed(/^Hear it$/),
        showOn: buttonNamed(/^Show on the (piano|guitar)$/),
        openInExplore: buttonNamed(/^Open in Explore$/),
        startCheck: buttonNamed(/^(Start the check|Check again)$/) || any('[data-testid="check-card"]'),
        prevNext: buttonNamed(/^(Previous|Next lesson)/),
        mistake: any('[data-testid="report-mistake"]') || buttonNamed(/Found a mistake/),
        back: Array.from(document.querySelectorAll('[data-section="intro"] button[aria-label="Back"]')).some(shown),
        topBar: any('.app-topbar'),
        dock: any('[data-testid="instrument-dock"]'),
      },
      content: {
        title: any('h1'),
        objectives: any('[data-section="intro"] li'),
        concepts: Array.from(document.querySelectorAll('section[data-section]'))
          .filter((s) => /^c\d+$/.test(s.getAttribute('data-section')!))
          .map((s) => shown(s) && shown(s.querySelector('h2')!) && shown(s.querySelector('.learn-concept-text')!)),
        staves: Array.from(document.querySelectorAll('[data-testid="inline-try-this"] svg')).filter(shown).length,
        rhythms: Array.from(document.querySelectorAll('[data-testid="rhythm-staff"]')).filter(shown).length,
        songs: document.querySelector('[data-section="songs"]') ? any('[data-section="songs"]') : null,
        tasks: document.querySelector('[data-section="tasks"]') ? any('[data-section="tasks"]') : null,
        // Every task prints its tick box (one task ends "… on your instrument", which the dock's rule caught).
        taskBoxes: [
          Array.from(document.querySelectorAll('[data-section="tasks"] button[aria-pressed]')).filter(shown).length,
          document.querySelectorAll('[data-section="tasks"] button[aria-pressed]').length,
        ],
      },
      // One column: the lesson starts at the paper's left margin, no rail's room beside it.
      left: column.left - grid.left,
      width: column.width,
      ink: getComputedStyle(document.body).color,
      bg: getComputedStyle(document.body).backgroundColor,
      faint,
      sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

const NO_FURNITURE = {
  rail: false, picker: false, hearIt: false, showOn: false, openInExplore: false, startCheck: false,
  prevNext: false, mistake: false, back: false, topBar: false, dock: false,
};

for (const themeMode of ['fermata', 'fermata-night'] as const) {
  test(`print a lesson (${themeMode === 'fermata' ? 'Day' : 'Night'}): text, staves, songs and tasks in one column, no screen furniture, readable ink`, async ({ browser }) => {
    // "The Major Scale": a staff in every Try This, song references, tasks.
    const { context, page } = await lesson(browser, 'l1u3m1', themeMode, { width: 1440, height: 900 });
    await expect(page.getByTestId('section-rail')).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(300);
    // As printed from the laptop's screen (the rail was drawn).
    const wide = await printed(page);
    expect(wide.furniture, 'laptop: nothing of the screen prints').toEqual(NO_FURNITURE);
    expect(wide.left, 'laptop: one column, no rail beside it').toBeLessThan(30);
    expect(wide.width, 'laptop: the lesson at its own width, not in the rail\'s 250 px column').toBeGreaterThan(600);
    expect(wide.faint, 'laptop: every printed word ≥ 4.5:1 on the paper').toEqual([]);
    // At paper width (A4 at 96 dpi less margins).
    await page.setViewportSize({ width: 718, height: 1000 });
    await page.waitForTimeout(400);
    const a4 = await printed(page);
    expect(a4.furniture, 'A4: nothing of the screen prints').toEqual(NO_FURNITURE);
    expect(a4.content.title && a4.content.objectives).toBe(true);
    expect(a4.content.concepts.length).toBeGreaterThan(1);
    expect(a4.content.concepts.every(Boolean)).toBe(true);
    expect(a4.content.staves, 'every Try This keeps its staff').toBeGreaterThanOrEqual(a4.content.concepts.length);
    expect(a4.content.songs).toBe(true);
    expect(a4.content.tasks).toBe(true);
    expect(a4.content.taskBoxes[0], 'every task\'s box').toBe(a4.content.taskBoxes[1]);
    expect(a4.content.taskBoxes[1]).toBe(3);
    expect(a4.left).toBeLessThan(30);
    expect(a4.width, 'the column fills the paper').toBeGreaterThan(600);
    expect(a4.sideways).toBe(0);
    expect([a4.ink, a4.bg], 'Night prints as light').toEqual(['rgb(17, 17, 17)', 'rgb(255, 255, 255)']);
    expect(a4.faint, 'every printed word ≥ 4.5:1 on the paper').toEqual([]);
    const pdf = await page.pdf({ format: 'A4' });
    expect(pdf.byteLength).toBeGreaterThan(10_000);
    if (SHOTS) {
      mkdirSync(SHOTS, { recursive: true });
      await page.screenshot({ path: `${SHOTS}/lesson-print-a4-${themeMode}.png`, fullPage: true });
    }
    await context.close();
  });
}

test('print a rhythm lesson: the rhythms print, their play buttons do not', async ({ browser }) => {
  const { context, page } = await lesson(browser, 'l1u2m1', 'fermata-night', { width: 390, height: 844 });
  await page.emulateMedia({ media: 'print' });
  await page.setViewportSize({ width: 718, height: 1000 });
  await page.waitForTimeout(400);
  const p = await printed(page);
  expect(p.furniture).toEqual(NO_FURNITURE);
  expect(p.content.rhythms, 'each concept\'s rhythm').toBe(p.content.concepts.length);
  expect(p.faint).toEqual([]);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/lesson-print-a4-rhythm-night.png`, fullPage: true });
  await context.close();
});
