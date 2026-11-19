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

/**
 * Every element in Learn's region that draws words of its own (text, or SVG
 * text by its fill), with its colour as it lands on the paper — its alpha and
 * every ancestor's opacity laid over white — below 4.5:1 (review of bd14071).
 * Installed in the page as window.__faintWords.
 */
function installFaintScan(page: Page) {
  return page.evaluate(() => {
    const lum = (rgb: number[]) => {
      const [r, g, b] = rgb.map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const rgba = (c: string): number[] | null => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return [r, g, b, a];
    };
    const opacityOf = (el: Element) => {
      let o = 1;
      for (let e: Element | null = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
      return o;
    };
    const w = window as unknown as { __faintWords: () => string[]; __scanned: { html: number; svg: number } };
    w.__faintWords = () => {
      const shown = (e: Element) => e.getClientRects().length > 0;
      const out: string[] = [];
      w.__scanned = { html: 0, svg: 0 };
      for (const el of Array.from(document.querySelectorAll('[data-learn-scroll] *'))) {
        const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent ?? '').join('').trim();
        if (!own || !shown(el)) continue;
        const style = getComputedStyle(el);
        if (style.visibility === 'hidden') continue;
        const svgText = el instanceof SVGElement;
        const paint = rgba(svgText ? style.fill : style.color);
        if (!paint) continue;
        const alpha = paint[3] * opacityOf(el) * (svgText ? Number(style.fillOpacity || 1) : 1);
        if (alpha === 0) continue;
        w.__scanned[svgText ? 'svg' : 'html']++;
        const onPaper = paint.slice(0, 3).map((c) => c * alpha + 255 * (1 - alpha));
        const ratio = 1.05 / (lum(onPaper) + 0.05);
        if (ratio < 4.5) out.push(`${own.slice(0, 40)} <${el.tagName.toLowerCase()}> (${svgText ? style.fill : style.color} × ${alpha.toFixed(2)}, ${ratio.toFixed(2)}:1)`);
      }
      return out;
    };
  });
}

/** What prints, read off the page laid out for paper. */
async function printed(page: Page) {
  await installFaintScan(page);
  return page.evaluate(() => {
    const faintWords = (window as unknown as { __faintWords: () => string[] }).__faintWords;
    const shown = (e: Element) => e.getClientRects().length > 0;
    const any = (sel: string) => Array.from(document.querySelectorAll(sel)).some(shown);
    const buttonNamed = (re: RegExp) => Array.from(document.querySelectorAll('button, a')).some((b) => re.test((b.textContent ?? '').trim()) && shown(b));
    const faint = faintWords();
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
    // The scan reads the staves' SVG text and HTML text, and flags a planted faint word (alpha, opacity, SVG fill).
    const scan = await page.evaluate(() => {
      const w = window as unknown as { __faintWords: () => string[]; __scanned: { html: number; svg: number } };
      const host = document.querySelector('[data-section="intro"]')!;
      const plant = (html: string) => { const d = document.createElement('div'); d.innerHTML = html; host.appendChild(d); return d; };
      const planted = [
        plant('<span style="color: rgba(17,17,17,0.2)">alpha-plant</span>'),
        plant('<span style="opacity: 0.3; color: #111">opacity-plant</span>'),
        plant('<svg width="80" height="20"><text x="0" y="15" style="fill: #bbb">fill-plant</text></svg>'),
      ];
      const flagged = w.__faintWords().filter((f) => /-plant/.test(f)).length;
      planted.forEach((p) => p.remove());
      return { flagged, scanned: w.__faintWords().length === 0 ? w.__scanned : null };
    });
    expect(scan.flagged, 'the three planted faint words are flagged').toBe(3);
    expect(scan.scanned!.svg, 'staff text read by its fill').toBeGreaterThan(5);
    expect(scan.scanned!.html).toBeGreaterThan(30);
    // The mechanism: Learn's scroller prints whole (it neither clips nor scrolls on paper).
    const scroller = await page.evaluate(() => {
      const el = document.querySelector('.learn-scroll') as HTMLElement;
      const cs = getComputedStyle(el);
      const last = document.querySelector('[data-section="tasks"]')!.getBoundingClientRect();
      return { overflowY: cs.overflowY, inner: el.scrollHeight - el.clientHeight, lastBottom: last.bottom, scrollerBottom: el.getBoundingClientRect().bottom };
    });
    expect(scroller.overflowY).toBe('visible');
    expect(scroller.inner, 'no scrolling inside the scroller').toBeLessThanOrEqual(1);
    expect(scroller.lastBottom).toBeLessThanOrEqual(scroller.scrollerBottom + 1);
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

test('print a chord-list Try This: the chords print as words, the card does not break across pages', async ({ browser }) => {
  const { context, page } = await lesson(browser, 'l1u35m1', 'fermata-night', { width: 1440, height: 900 });
  await expect(page.getByTestId('try-this-chords').first()).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await page.setViewportSize({ width: 718, height: 1000 });
  await page.waitForTimeout(400);
  const chips = await page.evaluate(() => {
    const group = document.querySelector('[data-testid="try-this-chords"]')!;
    const card = group.closest('[data-testid="inline-try-this"]')!;
    return {
      cardBreak: getComputedStyle(card).breakInside,
      chips: Array.from(group.querySelectorAll('button')).map((b) => {
        const cs = getComputedStyle(b);
        return { text: b.textContent, shown: b.getClientRects().length > 0, border: cs.borderTopWidth, bg: cs.backgroundColor, minHeight: cs.minHeight };
      }),
      otherButtons: Array.from(card.querySelectorAll('button')).filter((b) => !group.contains(b) && b.getClientRects().length > 0).length,
    };
  });
  expect(chips.cardBreak).toBe('avoid');
  expect(chips.chips.length).toBeGreaterThan(2);
  for (const c of chips.chips) expect(c, c.text!).toMatchObject({ shown: true, border: '0px', bg: 'rgba(0, 0, 0, 0)', minHeight: '0px' });
  expect(chips.otherButtons, 'Hear it / Open in Explore do not print').toBe(0);
  await context.close();
});

test('Night printed as light: each of the print block\'s twelve inks is its day shade, ≥ 4.5:1 on paper', async ({ browser }) => {
  const { context, page } = await lesson(browser, 'l1u3m1', 'fermata-night', { width: 1440, height: 900 });
  await page.emulateMedia({ media: 'print' });
  const inks = await page.evaluate(() => {
    const names = ['--success-text', '--danger-text', '--warning-text', ...Array.from({ length: 9 }, (_, i) => `--level-text-l${i + 1}`)];
    const lum = (hex: string) => {
      const [r, g, b] = (hex.match(/[0-9a-f]{2}/gi) ?? []).map((h) => parseInt(h, 16) / 255).map((s) => (s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    return names.map((n) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      return { n, v, ratio: Math.round((1.05 / (lum(v) + 0.05)) * 100) / 100 };
    });
  });
  expect(inks).toHaveLength(12);
  // The day theme's own values (index.css :root), as printed in Night.
  expect(Object.fromEntries(inks.map((i) => [i.n, i.v]))).toEqual({
    '--success-text': '#006045', '--danger-text': '#9f0712', '--warning-text': '#973c00',
    '--level-text-l1': '#235591', '--level-text-l2': '#005c82', '--level-text-l3': '#006440', '--level-text-l4': '#006356',
    '--level-text-l5': '#785200', '--level-text-l6': '#8a4200', '--level-text-l7': '#8d3063', '--level-text-l8': '#5d4697', '--level-text-l9': '#943135',
  });
  for (const i of inks) expect(i.ratio, i.n).toBeGreaterThanOrEqual(4.5);
  await context.close();
});

test('a screen that is not a lesson, printed in Night: Learn\'s overview (the review queue, every level\'s card, a completed lesson) reads on paper', async ({ browser }) => {
  const state = welcomeSeenState(test.info().project.use.baseURL!);
  const now = Date.now();
  state.origins[0].localStorage = state.origins[0].localStorage.map((e) =>
    e.name === 'music-theory-app' ? { ...e, value: JSON.stringify({ state: { language: 'en', themeMode: 'fermata-night', lastView: 'learn', instrument: 'piano' }, version: 6 }) } : e);
  state.origins[0].localStorage.push({ name: 'music-theory-progress', value: JSON.stringify({ state: { progress: {
    completedModules: ['l1u1m1'], moduleProgress: {}, exerciseResults: {},
    reviewSchedules: { l1u1m1: { completedAt: now - 9e8, nextReviewAt: now - 1000, intervalLevel: 1, reviewCount: 1, lastReviewedAt: now - 9e7 } },
  } }, version: 4 }) });
  const context = await browser.newContext({ storageState: state, viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByText('Review Queue').first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  await page.emulateMedia({ media: 'print' });
  await page.setViewportSize({ width: 718, height: 1000 });
  await page.waitForTimeout(400);
  await installFaintScan(page);
  const r = await page.evaluate(() => {
    const w = window as unknown as { __faintWords: () => string[]; __scanned: { html: number; svg: number } };
    const heading = Array.from(document.querySelectorAll('h3')).find((h) => /Review Queue/.test(h.textContent ?? ''))!;
    return { faint: w.__faintWords(), scanned: w.__scanned, queue: getComputedStyle(heading).color };
  });
  expect(r.queue, 'the review queue\'s ink: --warning-text\'s day shade').toBe('rgb(151, 60, 0)');
  expect(r.scanned.html).toBeGreaterThan(30);
  expect(r.faint, 'every printed word ≥ 4.5:1 on the paper').toEqual([]);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/learn-overview-print-a4-night.png`, fullPage: true });
  await context.close();
});
