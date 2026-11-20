import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The guitar dock's notice line (music audit 2, the review of builder K, item
 * 8): at 1440×900 in an alternate tuning with a chord selected the notice took
 * a line of its own and made the dock 26 px taller (321 → 347 px), pushing
 * Explore's circle column past the fold. From 1024 px the notice shares the
 * controls row's line where it fits beside the controls AND one whole chord
 * chip clear of the edge fades; where it does not, it takes its own line(s),
 * as below 1024 px — the layout decides, by widths (the chips' line is never
 * narrower than its label, the selected chip and both fades:
 * ChordShapeSelector, `.chord-shapes-line`).
 *
 * What is asserted holds on every platform, so it is asserted twice: with
 * this machine's text and with text 8 % wider (letter-spacing 0.04em, roughly
 * how GitHub's Linux draws it; e2e/neck-orientation.spec.ts does the same).
 * On every row:
 *  - the notice's own line boxes lie inside the dock (all four sides) and the
 *    window, and no ancestor that clips cuts any of them;
 *  - each chord case has its one selected chip (the Open G chord, which has
 *    no shapes, none), whole inside its row, the row at least as wide as it;
 *  - on the controls' line, the notice adds no height (± 0.5 px);
 *  - on its own line(s), it adds exactly its own box and the row's gap
 *    (6 px, `gap-y-1.5`), ± 0.5 px, and two lines at most.
 * Hard claims, with both texts: every chord's notice from 1280 px up shares
 * the controls' line in EN / PT / ES (the audit's figure: at 1440×900 in
 * Open G the chord notice adds no height); at 1024 px in PT and ES the
 * C7♯5♭9 / B notice takes its own line (there the notice and one whole chip
 * clear of the fades do not fit; on wider text, GitHub run #71, the chip was
 * cut to a 95 px row beside it).
 * By design, not asserted as a fixed number: (a) below 1280 px a chord's
 * notice may take its own line; (b) the scale position's notice may take one
 * line or two (two at 1024 px in PT on Linux), asserted as its box + the gap.
 * The fades: at a width where the chips scroll, every chip selected in turn,
 * by click and by the arrow keys, is clear of every fade that shows and is not
 * scrolled further than needed; and the chips' line is re-measured when the
 * text grows after the first layout (the ResizeObserver).
 */

// From 1024 px, where the rule starts.
const SIZES = [{ w: 1024, h: 768 }, { w: 1100, h: 768 }, { w: 1180, h: 800 }, { w: 1280, h: 720 }, { w: 1366, h: 768 }, { w: 1440, h: 900 }, { w: 1536, h: 864 }];
const LANGS = ['en', 'pt', 'es'] as const;
const TEXTS = [{ wide: false, label: '' }, { wide: true, label: ' (text 8 % wider)' }] as const;
const NO_BASS = 'standard, no grip has the bass (C7♯5♭9/B)';
// `chips(w)`: how many selected chips the controls row shows: a chord's grips
// in standard tuning; none for the Open G chord (shapes are standard tuning
// only); the scale position's chips below 1200 px, where from 1200 px the
// laptop dock carries the position as a select in its bar instead.
const CASES = [
  { name: NO_BASS, state: {}, url: '/?chord=C7%235b9/B&inst=guitar', chord: true, chips: () => 1 },
  { name: 'standard, the grip leaves out the 9 (B♭m9/B)', state: {}, url: '/?chord=Bbm9/B&inst=guitar', chord: true, chips: () => 1 },
  { name: 'Open G, a chord', state: { guitarTuningId: 'open-g' }, url: '/?chord=C&inst=guitar', chord: true, chips: () => 0 },
  { name: 'Open G, a note out of reach (G major, position III)', state: { guitarTuningId: 'open-g', selectedKey: { natural: 'G', accidental: '' }, guitarScalePosition: 3 }, url: '/', chord: false, chips: (w: number) => (w >= 1200 ? 0 : 1) },
] as const;
/** The controls row's gap between its lines (`gap-y-1.5`): what a notice on its own line adds besides its own box. */
const ROW_GAP = 6;
const WIDE_TEXT = '*, *::before, *::after { letter-spacing: 0.04em !important; }';
const SELECTED_CHIP = '.chip-row-scroll [aria-checked="true"]';

async function open(browser: Browser, size: { w: number; h: number }, lang: string, state: Record<string, unknown>, url: string, wide: boolean) {
  const context = await browser.newContext({ viewport: { width: size.w, height: size.h }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { language: lang, lastView: 'explore', instrument: 'guitar', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', ...state }, version: 6 }));
  const page = await context.newPage();
  await page.goto(url);
  await expect(page.locator('[role="grid"]').first()).toBeAttached({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  if (wide) await page.addStyleTag({ content: WIDE_TEXT });
  return { context, page };
}

/** Two frames and a pause: under reduced motion a restyled element can show its old size for one frame. */
const settled = (page: Page) => page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 250)))));
const dockHeight = (page: Page) => page.getByTestId('instrument-dock').evaluate((el) => el.getBoundingClientRect().height);

/** The notice's text, line box by line box: each inside the dock and the window, and inside every ancestor that clips. */
const noticeCut = (page: Page) => page.evaluate(() => {
  const dock = document.querySelector('[data-testid="instrument-dock"]')!;
  const notice = dock.querySelector('[role="status"]')!;
  const range = document.createRange();
  range.selectNodeContents(notice);
  const lines = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0);
  const problems: string[] = [];
  const within = (r: DOMRect, b: { left: number; right: number; top: number; bottom: number }, what: string) => {
    if (r.left < b.left - 0.5 || r.right > b.right + 0.5 || r.top < b.top - 0.5 || r.bottom > b.bottom + 0.5) problems.push(`a line ${r.left.toFixed(1)}–${r.right.toFixed(1)} × ${r.top.toFixed(1)}–${r.bottom.toFixed(1)} outside ${what}`);
  };
  const clips: { el: Element; what: string }[] = [];
  for (let el = notice.parentElement; el && el !== document.documentElement; el = el.parentElement) {
    const cs = getComputedStyle(el);
    if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') clips.push({ el, what: `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} (overflow ${cs.overflowX}/${cs.overflowY})` });
  }
  for (const r of lines) {
    within(r, dock.getBoundingClientRect(), 'the dock');
    within(r, { left: 0, top: 0, right: innerWidth, bottom: innerHeight }, 'the window');
    for (const c of clips) within(r, c.el.getBoundingClientRect(), c.what);
  }
  return { lines: lines.length, problems };
});

/** The always-true checks; returns where the notice sits and its box. */
async function checkRow(page: Page, where: string, chips: number) {
  const dock = page.getByTestId('instrument-dock');
  const notice = dock.getByRole('status');
  await expect(notice, where).toHaveCount(1);
  await expect(notice, where).toBeVisible();
  await settled(page);
  const box = (await notice.boundingBox())!;
  const dockBox = (await dock.boundingBox())!;
  // Inside the dock, on all four sides.
  expect(box.x, `${where}: notice inside the dock (left)`).toBeGreaterThanOrEqual(dockBox.x - 0.5);
  expect(box.x + box.width, `${where}: notice inside the dock (right)`).toBeLessThanOrEqual(dockBox.x + dockBox.width + 0.5);
  expect(box.y, `${where}: notice inside the dock (top)`).toBeGreaterThanOrEqual(dockBox.y - 0.5);
  expect(box.y + box.height, `${where}: notice inside the dock (bottom)`).toBeLessThanOrEqual(dockBox.y + dockBox.height + 0.5);
  // Nothing of its text cut: every line box inside the dock, the window and each ancestor that clips.
  const cut = await noticeCut(page);
  expect(cut.lines, `${where}: the notice's text has line boxes`).toBeGreaterThan(0);
  expect(cut.problems, `${where}: notice whole`).toEqual([]);
  // The selected chip (each chord case has one; the Open G chord has no shapes): whole inside its row, the row at least as wide.
  const chip = dock.locator(SELECTED_CHIP);
  await expect(chip, `${where}: selected chips`).toHaveCount(chips);
  let chipText = '';
  if (chips > 0) {
    const at = (await chip.boundingBox())!;
    const row = (await dock.locator('.chip-row-scroll').first().boundingBox())!;
    chipText = `, chip row ${row.width.toFixed(1)} px for a ${at.width.toFixed(1)} px chip`;
    expect(row.width, `${where}: chip row ${row.width.toFixed(1)} px, its selected chip ${at.width.toFixed(1)} px`).toBeGreaterThanOrEqual(at.width - 0.5);
    expect(at.x, `${where}: selected chip cut on the left (chip x ${at.x.toFixed(1)}, row x ${row.x.toFixed(1)})`).toBeGreaterThanOrEqual(row.x - 0.5);
    expect(at.x + at.width, `${where}: selected chip cut on the right`).toBeLessThanOrEqual(row.x + row.width + 0.5);
  }
  // On the controls' line or not: the notice starts above the bottom of the row's first control.
  const first = await page.evaluate(() => {
    const controls = document.querySelector('[data-testid="instrument-dock"] .fretboard-controls')!;
    const item = Array.from(controls.children).find((c) => c.getAttribute('role') !== 'status')!;
    const r = item.getBoundingClientRect();
    return { bottom: r.bottom };
  });
  const controls = (await dock.locator('.fretboard-controls').boundingBox())!;
  const lineHeight = await notice.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
  return { box, controls, sameLine: box.y < first.bottom - 1, lines: Math.round(box.height / lineHeight), lineHeight, chips: chipText };
}

for (const c of CASES) {
  for (const size of SIZES) {
    for (const lang of LANGS) {
      for (const text of TEXTS) {
        const mustShare = c.chord && size.w >= 1280;
        const mustOwn = c.name === NO_BASS && size.w === 1024 && lang !== 'en';
        const claim = mustShare ? 'shares the controls\' line and adds no height'
          : mustOwn ? 'takes its own line, adding its box and the gap'
            : 'on the controls\' line adds nothing; on its own line(s) adds its box and the gap';
        test(`${c.name}, ${size.w}×${size.h} ${lang}${text.label}: ${claim}`, async ({ browser }) => {
          const where = `${c.name} ${size.w}×${size.h} ${lang}${text.label}`;
          const { context, page } = await open(browser, size, lang, c.state, c.url, text.wide);
          try {
            const at = await checkRow(page, where, c.chips(size.w));
            const withIt = await dockHeight(page);
            await page.getByTestId('instrument-dock').getByRole('status').evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
            await settled(page);
            const without = await dockHeight(page);
            console.log(`notice height: ${where}: with ${withIt.toFixed(1)} px, without ${without.toFixed(1)} px, ${at.sameLine ? 'on the controls\' line' : `its own line(s): ${at.lines}, box ${at.box.height.toFixed(1)} px`}${at.chips}`);
            if (mustShare) expect(at.sameLine, `${where}: must share the controls' line`).toBe(true);
            if (mustOwn) expect(at.sameLine, `${where}: must take its own line`).toBe(false);
            if (at.sameLine) {
              expect(Math.abs(withIt - without), `${where}: on the controls' line, with ${withIt}, without ${without}`).toBeLessThanOrEqual(0.5);
            } else {
              expect(Math.abs(withIt - without - (at.box.height + ROW_GAP)), `${where}: own line: with ${withIt}, without ${without}, box ${at.box.height}, gap ${ROW_GAP}`).toBeLessThanOrEqual(0.5);
              expect(at.lines, `${where}: at most two lines`).toBeLessThanOrEqual(2);
            }
          } finally {
            await context.close();
          }
        });
      }
    }
  }
}

// Two notices at once take their own line (index.css, `data-notices="two"`;
// second review, item 5). No request reaches both since that review
// (fretboardTwoNotices.test.tsx), so the second sentence is SIMULATED here:
// added to a real notice with the mark the board sets.
for (const size of SIZES) {
  for (const lang of LANGS) {
    for (const text of TEXTS) {
      test(`two notices (simulated), ${size.w}×${size.h} ${lang}${text.label}: their own line(s) across the row; the chips keep the row and the selected one is whole`, async ({ browser }) => {
        const where = `two notices ${size.w}×${size.h} ${lang}${text.label}`;
        const { context, page } = await open(browser, size, lang, {}, '/?chord=C7%235b9/B&inst=guitar', text.wide);
        try {
          const notice = page.getByTestId('instrument-dock').getByRole('status');
          await expect(notice).toHaveCount(1);
          await notice.evaluate((el) => { el.textContent = `${el.textContent} ${el.textContent}`; el.setAttribute('data-notices', 'two'); });
          const at = await checkRow(page, where, 1);
          const row = (await page.getByTestId('instrument-dock').locator('.chip-row-scroll').first().boundingBox())!;
          const withIt = await dockHeight(page);
          await notice.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
          await settled(page);
          const without = await dockHeight(page);
          expect(at.sameLine, `${where}: on a line of their own`).toBe(false);
          // Across the row, and the chips keep the row's line with real room.
          expect(at.box.width, `${where}: the notice across the row (${at.box.width.toFixed(1)} of ${at.controls.width.toFixed(1)} px)`).toBeGreaterThan(at.controls.width - 40);
          expect(row.width, `${where}: the chips keep the row (${row.width.toFixed(1)} px)`).toBeGreaterThan(200);
          expect(Math.abs(withIt - without - (at.box.height + ROW_GAP)), `${where}: with ${withIt}, without ${without}, box ${at.box.height}`).toBeLessThanOrEqual(0.5);
          expect(at.lines, `${where}: at most two lines`).toBeLessThanOrEqual(2);
        } finally {
          await context.close();
        }
      });
    }
  }
}

// ─── The edge fades (cold review F1 / F4) ────────────────────────────────────
// Where the chips scroll (C7♯5♭9 / B at 1024×768: eight chips), each chip
// selected in turn is whole and clear of every fade that SHOWS (an end with
// nothing beyond it shows none: flush is right there). Not further than
// needed: selected WITHOUT focus (as from the full neck, which shares the
// grip, or a link), only the board's own scroll moves the row, and it stops
// with the chip at the fade's edge or at the row's end; by click or by the
// arrow keys the chip takes focus first (ui/roving.ts), and Chromium scrolls
// a focused chip that is partly out of view to the row's centre, so there it
// is either just clear or centred.
type FadeState = { n: number; idx: number; fade: number; clearL: number; clearR: number; moreL: boolean; moreR: boolean; scroll: number; maxScroll: number; inside: boolean };
const fadeState = (page: Page) => page.evaluate((): FadeState => {
  const line = document.querySelector('[data-testid="instrument-dock"] .chord-shapes-line')!;
  const edge = line.querySelector('.edge-fade')!;
  const row = edge.querySelector('.chip-group')!;
  const chips = Array.from(row.querySelectorAll('[role="radio"]'));
  const sel = row.querySelector('[aria-checked="true"]')!;
  const fade = parseFloat(getComputedStyle(edge, '::before').width);
  const f = edge.getBoundingClientRect();
  const c = sel.getBoundingClientRect();
  return {
    n: chips.length, idx: chips.indexOf(sel), fade,
    clearL: c.left - (f.left + fade), clearR: (f.right - fade) - c.right,
    moreL: edge.hasAttribute('data-more-left'), moreR: edge.hasAttribute('data-more-right'),
    scroll: row.scrollLeft, maxScroll: row.scrollWidth - row.clientWidth,
    inside: c.left >= f.left - 0.5 && c.right <= f.right + 0.5,
  };
});
function checkFades(before: FadeState, after: FadeState, where: string, focused: boolean) {
  const at = `${where}, chip ${after.idx + 1} of ${after.n} (scroll ${after.scroll.toFixed(1)} of ${after.maxScroll.toFixed(1)}, clear ${after.clearL.toFixed(1)} / ${after.clearR.toFixed(1)} px, fades ${after.moreL ? 'L' : '-'}${after.moreR ? 'R' : '-'})`;
  expect(after.fade, `${at}: the fades are 18 px`).toBe(18);
  expect(after.inside, `${at}: whole inside the row`).toBe(true);
  if (after.moreL) expect(after.clearL, `${at}: clear of the left fade`).toBeGreaterThanOrEqual(-0.5);
  if (after.moreR) expect(after.clearR, `${at}: clear of the right fade`).toBeGreaterThanOrEqual(-0.5);
  // Not further than needed (or, for a focused chip, centred by the browser).
  const centred = Math.abs(after.clearL - after.clearR) <= 1.5;
  if (after.scroll > before.scroll + 0.5 && after.scroll < after.maxScroll - 0.5) expect(after.clearR <= 1 || (focused && centred), `${at}: moved right no further than the fade${focused ? ', or centred by the focus' : ''}`).toBe(true);
  if (after.scroll < before.scroll - 0.5 && after.scroll > 0.5) expect(after.clearL <= 1 || (focused && centred), `${at}: moved left no further than the fade${focused ? ', or centred by the focus' : ''}`).toBe(true);
}

for (const lang of ['en', 'es'] as const) {
  for (const text of TEXTS) {
    for (const how of ['click', 'arrow keys', 'selection without focus'] as const) {
      test(`fades: C7♯5♭9 / B, 1024×768 ${lang}${text.label}, every chip by ${how}: clear of every fade that shows, no further than needed`, async ({ browser }) => {
        const where = `fades ${lang}${text.label} by ${how}`;
        const { context, page } = await open(browser, { w: 1024, h: 768 }, lang, {}, '/?chord=C7%235b9/B&inst=guitar', text.wide);
        try {
          await settled(page);
          const chips = page.getByTestId('instrument-dock').locator('.chord-shapes-line [role="radio"]');
          const n = await chips.count();
          expect(n, `${where}: enough chips to scroll`).toBeGreaterThanOrEqual(6);
          let state = await fadeState(page);
          expect(state.maxScroll, `${where}: the row scrolls`).toBeGreaterThan(50);
          const step = async (act: () => Promise<void>, want: number) => {
            const before = state;
            await act();
            await settled(page);
            state = await fadeState(page);
            console.log(`fade clearance: ${where}, chip ${state.idx + 1} of ${state.n}: left ${state.moreL ? state.clearL.toFixed(1) : 'no fade'}, right ${state.moreR ? state.clearR.toFixed(1) : 'no fade'}, scroll ${before.scroll.toFixed(1)} → ${state.scroll.toFixed(1)} of ${state.maxScroll.toFixed(1)}`);
            expect(state.idx, `${where}: selected`).toBe(want);
            checkFades(before, state, where, how !== 'selection without focus');
          };
          if (how === 'click') {
            for (let i = 0; i < n; i++) await step(() => chips.nth(i).click(), i);
            for (let i = n - 2; i >= 0; i--) await step(() => chips.nth(i).click(), i);
          } else if (how === 'selection without focus') {
            // A click event with no pointer and no focus: the chip is chosen, nothing takes focus.
            for (let i = 0; i < n; i++) await step(() => chips.nth(i).dispatchEvent('click'), i);
            for (let i = n - 2; i >= 0; i--) await step(() => chips.nth(i).dispatchEvent('click'), i);
            expect(await page.evaluate(() => document.activeElement?.getAttribute('role')), `${where}: no chip took focus`).not.toBe('radio');
          } else {
            await page.getByTestId('instrument-dock').locator(`.chord-shapes-line ${'[aria-checked="true"]'}`).focus();
            for (let i = 1; i < n; i++) await step(() => page.keyboard.press('ArrowRight'), i);
            for (let i = n - 2; i >= 0; i--) await step(() => page.keyboard.press('ArrowLeft'), i);
          }
        } finally {
          await context.close();
        }
      });
    }
  }
}

// ─── Re-measured when the text grows (cold review F5) ────────────────────────
// The chips' line beside the notice (1024×768 EN: the line 261 px, 75 px over
// its minimum), its text made much wider AFTER the first layout
// (letter-spacing 1em: the label and the chip grow by more than that slack and
// the fades' room together), so only re-measuring keeps the claim: the line's
// minimum follows the new widths, the notice moves to its own line, and the
// chip row is again at least as wide as its chip (without the ResizeObserver
// the row is left narrower than the chip: both assertions below fail).
test('re-measured when the text grows after the first layout: C7♯5♭9 / B, 1024×768 en, the chips\' text widened', async ({ browser }) => {
  const { context, page } = await open(browser, { w: 1024, h: 768 }, 'en', {}, '/?chord=C7%235b9/B&inst=guitar', false);
  try {
    const dock = page.getByTestId('instrument-dock');
    const before = await checkRow(page, 'before widening', 1);
    expect(before.sameLine, 'before widening: the notice shares the line (the chips squeezed beside it)').toBe(true);
    await page.addStyleTag({ content: '.chord-shapes-line, .chord-shapes-line * { letter-spacing: 1em !important; }' });
    await settled(page);
    const m = await page.evaluate(() => {
      const line = document.querySelector<HTMLElement>('[data-testid="instrument-dock"] .chord-shapes-line')!;
      const label = line.firstElementChild!.getBoundingClientRect().width;
      const chip = line.querySelector('[aria-checked="true"]')!.getBoundingClientRect().width;
      return { label, chip, gap: parseFloat(getComputedStyle(line).columnGap), min: parseFloat(line.style.minWidth), line: line.getBoundingClientRect().width };
    });
    const row = (await dock.locator('.chip-row-scroll').first().boundingBox())!;
    const at = (await dock.locator(SELECTED_CHIP).boundingBox())!;
    expect(m.min, `the line's minimum follows the widened text (label ${m.label.toFixed(1)} + gap ${m.gap} + chip ${m.chip.toFixed(1)} + 2 × 18)`).toBeCloseTo(Math.ceil(m.label + m.gap + m.chip + 36), 0);
    expect(row.width, `the chip row (${row.width.toFixed(1)} px) again at least as wide as its chip (${at.width.toFixed(1)} px)`).toBeGreaterThanOrEqual(at.width - 0.5);
    expect(at.x).toBeGreaterThanOrEqual(row.x - 0.5);
    expect(at.x + at.width).toBeLessThanOrEqual(row.x + row.width + 0.5);
  } finally {
    await context.close();
  }
});
