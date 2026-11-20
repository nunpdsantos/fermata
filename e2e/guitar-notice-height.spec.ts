import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The guitar dock's notice line (music audit 2, the review of builder K, item
 * 8): at 1440×900 in an alternate tuning with a chord selected the notice took
 * a line of its own and made the dock 26 px taller (321 → 347 px), pushing
 * Explore's circle column past the fold. Below 1280 px the notice takes a
 * line of its own, as in release 16 at every width. From 1280 px it shares
 * the controls row's line where it fits beside the controls AND the chips'
 * line at its minimum; where it does not, it takes its own line(s) — the
 * layout decides, by widths. The chips' line is never narrower than its
 * label, the WIDEST chip of the row and both fades (ChordShapeSelector,
 * `.chord-shapes-line`), so the grip selected never moves the notice; and the
 * selected chip is placed again whenever the row's own box changes.
 *
 * The main rows are asserted twice: with this machine's text and with text
 * 8 % wider (letter-spacing 0.04em, roughly how GitHub's Linux draws it;
 * e2e/neck-orientation.spec.ts does the same). The own line below 1280 px
 * holds at any text width; the sharing from 1280 px holds with text up to
 * about 0.05em wider than this Mac's (GitHub's Linux is within that), beyond
 * which the notice rightly takes its own line and those rows would fail.
 * On every row that measures the notice (`checkRow`):
 *  - the notice's own line boxes lie inside the dock (all four sides) and the
 *    window, and no ancestor that clips cuts any of them;
 *  - each chord case has its one selected chip (the Open G chord, which has
 *    no shapes, none), whole inside its row, the row at least as wide as it;
 *  - on the controls' line, the notice adds no height (± 0.5 px);
 *  - on its own line(s), it adds exactly its own box and the row's gap
 *    (6 px, `gap-y-1.5`), ± 0.5 px, and two lines at most;
 *  - every grip selected in turn (without focus): for one notice text, one
 *    dock height and one line (the notice's text changes with the grip only
 *    where a grip leaves out a tone: "This shape leaves out …", Fretboard.tsx
 *    `leavesOutNotice`; each text is held to its own height, and logged);
 *  - no ResizeObserver loop message, in the console or as a window error.
 * Hard claims, two-sided, with both texts: below 1280 px every notice takes
 * its own line, in EN / PT / ES; from 1280 px every chord's notice shares the
 * controls' line (the audit's figure: at 1440×900 in Open G the chord notice
 * adds no height). By design, not a fixed number: from 1280 px the scale
 * position's notice may take one line or two, asserted as its box + the gap.
 * The fades: where the chips scroll, every chip selected in turn, by click,
 * by the arrow keys and without focus, is clear of every fade that shows and
 * is not scrolled further than needed; the selected chip is placed again when
 * the row narrows or widens from outside (a longer notice, the window across
 * 1280 px); the line's minimum is the widest chip's, so at the very width
 * where the notice leaves the controls' line no grip brings it back; and the
 * chips' line is re-measured when the text grows after the first layout.
 */

// From 1024 px; 1279 / 1280 on either side of where the notice may share the line.
const SIZES = [{ w: 1024, h: 768 }, { w: 1100, h: 768 }, { w: 1180, h: 800 }, { w: 1279, h: 800 }, { w: 1280, h: 720 }, { w: 1366, h: 768 }, { w: 1440, h: 900 }, { w: 1536, h: 864 }];
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
const NO_BASS_URL = '/?chord=C7%235b9/B&inst=guitar';

// No ResizeObserver loop, two ways. (1) No message: the console's, and the
// window's error events (Chromium reports "ResizeObserver loop completed with
// undelivered notifications" as an error event). Under reduced motion every
// property is transitioned (index.css, 0.01 ms), so a size written in an
// observer's callback changes a frame later and is never reported: hence
// (2) a quiet window: every observer of the page counted for 500 ms while
// nothing changes. A loop calls back every frame (the planted one below:
// dozens in that time); one or two callbacks are a last size landing late,
// not a loop (the same 0.01 ms transition: on GitHub's dev shard one came in
// a row with no chips at all, run 44688260743, first attempt), so two at
// most are let pass. Two known-positive rows below plant one loop of each kind.
const consoleSeen = new WeakMap<Page, string[]>();
const RO_MESSAGE = /ResizeObserver/;
function listen(page: Page) {
  const seen: string[] = [];
  consoleSeen.set(page, seen);
  page.on('console', (m) => { if (RO_MESSAGE.test(m.text())) seen.push(m.text()); });
  page.on('pageerror', (e) => { if (RO_MESSAGE.test(String(e))) seen.push(String(e)); });
}
const ERROR_LOG = () => {
  const w = window as unknown as { __roErrors: string[]; __roCalls: number };
  w.__roErrors = [];
  w.__roCalls = 0;
  window.addEventListener('error', (e) => { if (/ResizeObserver/.test(String(e.message))) w.__roErrors.push(String(e.message)); });
  const Native = window.ResizeObserver;
  window.ResizeObserver = class extends Native {
    constructor(callback: ResizeObserverCallback) {
      super((entries, observer) => { w.__roCalls++; callback(entries, observer); });
    }
  };
};
type LoopWindow = { __roErrors: string[]; __roCalls: number };
async function expectNoLoop(page: Page, where: string) {
  const errors = await page.evaluate(() => (window as unknown as LoopWindow).__roErrors.slice());
  expect([...errors, ...(consoleSeen.get(page) ?? [])], `${where}: no ResizeObserver loop message`).toEqual([]);
  const calls = await page.evaluate(() => new Promise<number[]>((done) => {
    const w = window as unknown as LoopWindow;
    const from = w.__roCalls;
    setTimeout(() => done([from, w.__roCalls]), 500);
  }));
  expect(calls[1] - calls[0], `${where}: no ResizeObserver callback in 500 ms with nothing changing (${calls[0]} → ${calls[1]}; two at most are a late size landing, a loop is one every frame)`).toBeLessThanOrEqual(2);
}

type Motion = 'reduce' | 'no-preference';
async function open(browser: Browser, size: { w: number; h: number }, lang: string, state: Record<string, unknown>, url: string, wide: boolean | string, motion: Motion = 'reduce') {
  const context = await browser.newContext({ viewport: { width: size.w, height: size.h }, reducedMotion: motion, serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { language: lang, lastView: 'explore', instrument: 'guitar', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', ...state }, version: 6 }));
  await context.addInitScript(ERROR_LOG);
  const page = await context.newPage();
  listen(page);
  await page.goto(url);
  await expect(page.locator('[role="grid"]').first()).toBeAttached({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  if (wide) await page.addStyleTag({ content: typeof wide === 'string' ? wide : WIDE_TEXT });
  return { context, page };
}

/** Two frames and a pause: under reduced motion a restyled element can show its old size for one frame. */
const settled = (page: Page) => page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 250)))));
const dockHeight = (page: Page) => page.getByTestId('instrument-dock').evaluate((el) => el.getBoundingClientRect().height);
const gripChips = (page: Page) => page.getByTestId('instrument-dock').locator('.chord-shapes-line [role="radio"]');

/** The notice's text, the dock's height and whether the notice is on the controls' line (null: no notice). */
type GripState = { text: string; height: number; sameLine: boolean | null };
const gripState = (page: Page) => page.evaluate((): GripState => {
  const dock = document.querySelector('[data-testid="instrument-dock"]')!;
  const controls = dock.querySelector('.fretboard-controls')!;
  const notice = controls.querySelector(':scope > [role="status"]');
  const first = Array.from(controls.children).find((c) => c.getAttribute('role') !== 'status')!.getBoundingClientRect();
  return { text: notice?.textContent ?? '', height: dock.getBoundingClientRect().height, sameLine: notice ? notice.getBoundingClientRect().top < first.bottom - 1 : null };
});

/** For one notice text, one dock height (± 0.5 px) and one line: `seen[i]` is the state with chip i selected. */
function oneHeightPerText(seen: GripState[], where: string) {
  const groups = new Map<string, number[]>();
  seen.forEach((g, i) => groups.set(g.text, [...(groups.get(g.text) ?? []), i]));
  const parts: string[] = [];
  for (const [text, idx] of groups) {
    const first = seen[idx[0]];
    parts.push(`chips ${idx.map((i) => i + 1).join(',')}: ${text ? `"${text.length > 48 ? `${text.slice(0, 48)}…` : text}"` : 'no notice'} ${first.sameLine === null ? '' : first.sameLine ? 'on the controls\' line' : 'own line'}, dock ${idx.map((i) => seen[i].height.toFixed(1)).join('/')}`);
    for (const i of idx) {
      expect(Math.abs(seen[i].height - first.height), `${where}: chip ${i + 1} gives the dock ${seen[i].height.toFixed(1)} px, chip ${idx[0] + 1} ${first.height.toFixed(1)} px, for the same notice`).toBeLessThanOrEqual(0.5);
      expect(seen[i].sameLine, `${where}: chip ${i + 1} puts the same notice on ${seen[i].sameLine ? 'the controls\' line' : 'its own line'}, chip ${idx[0] + 1} not`).toBe(first.sameLine);
    }
  }
  console.log(`per grip: ${where}: ${groups.size === 1 ? 'one notice' : `${groups.size} notices`}; ${parts.join('; ')}`);
  return groups.size;
}

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
        const mustOwn = size.w < 1280;
        const claim = mustShare ? 'shares the controls\' line and adds no height'
          : mustOwn ? 'takes its own line, adding its box and the gap'
            : 'on the controls\' line adds nothing; on its own line(s) adds its box and the gap';
        test(`${c.name}, ${size.w}×${size.h} ${lang}${text.label}: ${claim}`, async ({ browser }) => {
          const where = `${c.name} ${size.w}×${size.h} ${lang}${text.label}`;
          const { context, page } = await open(browser, size, lang, c.state, c.url, text.wide);
          try {
            const at = await checkRow(page, where, c.chips(size.w));
            const withIt = await dockHeight(page);
            // By its place, not its role: hidden, it leaves the accessibility tree.
            const notice = page.getByTestId('instrument-dock').locator('.fretboard-controls > [role="status"]');
            await notice.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
            await settled(page);
            const without = await dockHeight(page);
            await notice.evaluate((el) => { (el as HTMLElement).style.display = ''; });
            await settled(page);
            console.log(`notice height: ${where}: with ${withIt.toFixed(1)} px, without ${without.toFixed(1)} px, ${at.sameLine ? 'on the controls\' line' : `its own line(s): ${at.lines}, box ${at.box.height.toFixed(1)} px`}${at.chips}`);
            if (mustShare) expect(at.sameLine, `${where}: must share the controls' line`).toBe(true);
            if (mustOwn) expect(at.sameLine, `${where}: below 1280 px, must take its own line`).toBe(false);
            if (at.sameLine) {
              expect(Math.abs(withIt - without), `${where}: on the controls' line, with ${withIt}, without ${without}`).toBeLessThanOrEqual(0.5);
            } else {
              expect(Math.abs(withIt - without - (at.box.height + ROW_GAP)), `${where}: own line: with ${withIt}, without ${without}, box ${at.box.height}, gap ${ROW_GAP}`).toBeLessThanOrEqual(0.5);
              expect(at.lines, `${where}: at most two lines`).toBeLessThanOrEqual(2);
            }
            // Every grip in turn, without focus: for one notice text, one dock height and one line.
            if (c.chips(size.w) > 0 && c.chord) {
              const chips = gripChips(page);
              const initial = await chips.evaluateAll((els) => els.findIndex((el) => el.getAttribute('aria-checked') === 'true'));
              const seen: GripState[] = [];
              for (let i = 0; i < (await chips.count()); i++) {
                await chips.nth(i).dispatchEvent('click');
                await settled(page);
                seen.push(await gripState(page));
              }
              oneHeightPerText(seen, where);
              expect(Math.abs(seen[initial].height - withIt), `${where}: chip ${initial + 1} again, the dock ${seen[initial].height.toFixed(1)} px as at first ${withIt.toFixed(1)} px`).toBeLessThanOrEqual(0.5);
            }
            await expectNoLoop(page, where);
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
        const { context, page } = await open(browser, size, lang, {}, NO_BASS_URL, text.wide);
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
          await expectNoLoop(page, where);
        } finally {
          await context.close();
        }
      });
    }
  }
}

// ─── The edge fades (cold review F1 / F4) ────────────────────────────────────
// C7♯5♭9 / B, eight chips: at 1024×768 the notice has its own line and the
// chips have the row (with this machine's text in English they all fit and no
// fade shows; with wider text, or in Spanish, they scroll); at 1280×720, the
// narrowest width where the notice shares the line, they share it with the
// notice and scroll. Each chip selected in turn is whole and clear of every
// fade that SHOWS (an end with nothing beyond it shows none: flush is right
// there). Not further than needed: selected WITHOUT focus (as from the full
// neck, which shares the grip, or a link), only the board's own scroll moves
// the row, and it stops with the chip at the fade's edge or at the row's end;
// by click or by the arrow keys the chip takes focus first (ui/roving.ts), and
// Chromium scrolls a focused chip that is partly out of view to the row's
// centre, so there it is either just clear or centred. And the grip selected
// moves nothing else: the notice's text, its line and the dock's height are
// the same at every step.
type FadeState = GripState & { n: number; idx: number; fade: number; clearL: number; clearR: number; moreL: boolean; moreR: boolean; scroll: number; maxScroll: number; inside: boolean; edge: number; widths: number[] };
const fadeState = (page: Page) => page.evaluate((): FadeState => {
  const dock = document.querySelector('[data-testid="instrument-dock"]')!;
  const controls = dock.querySelector('.fretboard-controls')!;
  const notice = controls.querySelector(':scope > [role="status"]');
  const first = Array.from(controls.children).find((c) => c.getAttribute('role') !== 'status')!.getBoundingClientRect();
  const line = dock.querySelector('.chord-shapes-line')!;
  const edge = line.querySelector('.edge-fade')!;
  const row = edge.querySelector('.chip-group')!;
  const chips = Array.from(row.querySelectorAll('[role="radio"]'));
  const sel = row.querySelector('[aria-checked="true"]')!;
  const fade = parseFloat(getComputedStyle(edge, '::before').width);
  const f = edge.getBoundingClientRect();
  const r = row.getBoundingClientRect();
  const c = sel.getBoundingClientRect();
  return {
    text: notice?.textContent ?? '', height: dock.getBoundingClientRect().height, sameLine: notice ? notice.getBoundingClientRect().top < first.bottom - 1 : null,
    n: chips.length, idx: chips.indexOf(sel), fade,
    clearL: c.left - (f.left + fade), clearR: (f.right - fade) - c.right,
    moreL: edge.hasAttribute('data-more-left'), moreR: edge.hasAttribute('data-more-right'),
    scroll: row.scrollLeft, maxScroll: row.scrollWidth - row.clientWidth,
    // Whole: inside the box that clips it, the scroller (2 px outside the
    // fades' box on each side, room for a focus ring). At the row's far end
    // the last chip can lie up to 1 px past the fades' box: the scroll range
    // is whole pixels, so a fraction of the content cannot be scrolled to; it
    // is drawn whole, in the scroller's padding, where no fade shows.
    inside: c.left >= r.left - 0.5 && c.right <= r.right + 0.5, edge: f.width,
    widths: chips.map((x) => x.getBoundingClientRect().width),
  };
});
const fadeText = (s: FadeState) => `chip ${s.idx + 1} of ${s.n} (scroll ${s.scroll.toFixed(1)} of ${s.maxScroll.toFixed(1)}, clear ${s.clearL.toFixed(1)} / ${s.clearR.toFixed(1)} px, fades ${s.moreL ? 'L' : '-'}${s.moreR ? 'R' : '-'}, row ${s.edge.toFixed(1)} px)`;
/** The selected chip whole inside the row and clear of every fade that shows. */
function checkPlaced(s: FadeState, where: string) {
  const at = `${where}, ${fadeText(s)}`;
  expect(s.fade, `${at}: the fades are 18 px`).toBe(18);
  expect(s.inside, `${at}: whole inside the row`).toBe(true);
  if (s.moreL) expect(s.clearL, `${at}: clear of the left fade`).toBeGreaterThanOrEqual(-0.5);
  if (s.moreR) expect(s.clearR, `${at}: clear of the right fade`).toBeGreaterThanOrEqual(-0.5);
}
function checkFades(before: FadeState, after: FadeState, where: string, focused: boolean) {
  checkPlaced(after, where);
  const at = `${where}, ${fadeText(after)}`;
  // Not further than needed (or, for a focused chip, centred by the browser).
  // Chromium centres the chip as it takes focus, before the selection is
  // drawn: then the chip selected turns bolder and the one left lighter
  // (`.chip[aria-checked="true"]`, weight 600 against 500), which moves the
  // chip off centre by up to the sum of those width changes on each side.
  const reweighted = after.widths.reduce((sum, w, i) => sum + Math.abs(w - (before.widths[i] ?? w)), 0);
  const centred = Math.abs(after.clearL - after.clearR) <= 1.5 + 2 * reweighted;
  if (after.scroll > before.scroll + 0.5 && after.scroll < after.maxScroll - 0.5) expect(after.clearR <= 1 || (focused && centred), `${at}: moved right no further than the fade${focused ? ', or centred by the focus' : ''}`).toBe(true);
  if (after.scroll < before.scroll - 0.5 && after.scroll > 0.5) expect(after.clearL <= 1 || (focused && centred), `${at}: moved left no further than the fade${focused ? ', or centred by the focus' : ''}`).toBe(true);
}

const FADE_SIZES = [{ w: 1024, h: 768, share: false }, { w: 1280, h: 720, share: true }] as const;
for (const size of FADE_SIZES) {
  for (const lang of ['en', 'es'] as const) {
    for (const text of TEXTS) {
      for (const how of ['click', 'arrow keys', 'selection without focus'] as const) {
        test(`fades: C7♯5♭9 / B, ${size.w}×${size.h} ${lang}${text.label}, every chip by ${how}: clear of every fade that shows, no further than needed, the notice's line and the dock unmoved`, async ({ browser }) => {
          const where = `fades ${size.w}×${size.h} ${lang}${text.label} by ${how}`;
          const { context, page } = await open(browser, size, lang, {}, NO_BASS_URL, text.wide);
          try {
            await settled(page);
            const chips = gripChips(page);
            const n = await chips.count();
            expect(n, `${where}: eight grips`).toBeGreaterThanOrEqual(6);
            let state = await fadeState(page);
            const start = state;
            expect(start.sameLine, `${where}: the notice ${size.share ? 'shares the controls\' line' : 'on its own line'}`).toBe(size.share);
            // Where the notice shares the line the chips must scroll, or there is nothing to test.
            if (size.share) expect(start.maxScroll, `${where}: the row scrolls`).toBeGreaterThan(50);
            console.log(`fade row: ${where}: row ${start.edge.toFixed(1)} px, scrolls ${start.maxScroll.toFixed(1)} px, dock ${start.height.toFixed(1)} px, notice ${start.sameLine ? 'on the controls\' line' : 'own line'}`);
            const step = async (act: () => Promise<void>, want: number) => {
              const before = state;
              await act();
              await settled(page);
              state = await fadeState(page);
              console.log(`fade clearance: ${where}, chip ${state.idx + 1} of ${state.n}: left ${state.moreL ? state.clearL.toFixed(1) : 'no fade'}, right ${state.moreR ? state.clearR.toFixed(1) : 'no fade'}, scroll ${before.scroll.toFixed(1)} → ${state.scroll.toFixed(1)} of ${state.maxScroll.toFixed(1)}, dock ${state.height.toFixed(1)}`);
              expect(state.idx, `${where}: selected`).toBe(want);
              checkFades(before, state, where, how !== 'selection without focus');
              // This chord's notice does not change with the grip; its line and the dock's height do not either.
              expect(state.text, `${where}, chip ${want + 1}: the same notice`).toBe(start.text);
              expect(state.sameLine, `${where}, chip ${want + 1}: the notice's line unchanged`).toBe(start.sameLine);
              expect(Math.abs(state.height - start.height), `${where}, chip ${want + 1}: the dock ${state.height.toFixed(1)} px, at first ${start.height.toFixed(1)} px`).toBeLessThanOrEqual(0.5);
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
            await expectNoLoop(page, where);
          } finally {
            await context.close();
          }
        });
      }
    }
  }
}

// ─── Placed again when the row's box changes (B) ─────────────────────────────
// The last chip selected (the row scrolled to its end, or not scrolling at
// all), then the row made NARROWER from outside: a longer notice beside the
// chips at 1280×720, or the window from 1279 to 1280 px, where the notice
// moves up onto the controls' line. Nothing about the chips or their label
// changes, so only re-placing on the row's own box brings the chip back: the
// precondition asserts the row now scrolls further than where it was left
// (without re-placing, the last chip is cut by that much). Then the reverse,
// WIDER: the notice's text as it was, the window back to 1279 px.
async function lastChip(page: Page) {
  const chips = gripChips(page);
  await chips.nth((await chips.count()) - 1).dispatchEvent('click');
  await settled(page);
  return fadeState(page);
}
const MOTIONS = [{ motion: 'reduce' as Motion, label: '' }, { motion: 'no-preference' as Motion, label: ', motion not reduced' }];
for (const lang of ['en', 'es'] as const) {
  for (const text of TEXTS) {
    for (const { motion, label: motionLabel } of MOTIONS) {
      test(`placed again (B): C7♯5♭9 / B, 1280×720 ${lang}${text.label}${motionLabel}, a longer notice narrows the chips' row, then its text as it was widens it: the last chip in view and clear each time`, async ({ browser }) => {
        const where = `placed again, a longer notice, 1280×720 ${lang}${text.label}${motionLabel}`;
        const { context, page } = await open(browser, { w: 1280, h: 720 }, lang, {}, NO_BASS_URL, text.wide, motion);
        try {
          await settled(page);
          const before = await lastChip(page);
          expect(before.sameLine, `${where}: the notice on the controls' line`).toBe(true);
          checkPlaced(before, `${where}, before`);
          // Characters added to the notice one by one while it stays on the
          // controls' line, until the row is 60 px narrower (or the next one
          // would send the notice to its own line). Text changes no transitioned
          // property: the layout read back here is the new one.
          const grown = await page.evaluate(() => {
            const controls = document.querySelector('[data-testid="instrument-dock"] .fretboard-controls')!;
            const notice = controls.querySelector<HTMLElement>(':scope > [role="status"]')!;
            const edge = controls.querySelector('.chord-shapes-line .edge-fade')!;
            const first = Array.from(controls.children).find((c) => c.getAttribute('role') !== 'status')!;
            const shared = () => notice.getBoundingClientRect().top < first.getBoundingClientRect().bottom - 1;
            const original = notice.textContent!;
            const more = original.replace(/\s+/g, '');
            const width0 = edge.getBoundingClientRect().width;
            let k = 0;
            for (let next = 1; next <= more.length; next++) {
              notice.textContent = `${original} ${more.slice(0, next)}`;
              if (!shared()) break;
              k = next;
              if (width0 - edge.getBoundingClientRect().width >= 60) break;
            }
            notice.textContent = k ? `${original} ${more.slice(0, k)}` : original;
            return { chars: k, narrowedBy: width0 - edge.getBoundingClientRect().width, shared: shared() };
          });
          await settled(page);
          const narrower = await fadeState(page);
          console.log(`placed again: ${where}: ${grown.chars} characters added, the row ${before.edge.toFixed(1)} → ${narrower.edge.toFixed(1)} px; before ${fadeText(before)}; after ${fadeText(narrower)}`);
          expect(grown.shared, `${where}: the longer notice still on the controls' line`).toBe(true);
          expect(narrower.maxScroll, `${where}: precondition, the row now scrolls further (${narrower.maxScroll.toFixed(1)} px) than where the chip was left (${before.scroll.toFixed(1)} px)`).toBeGreaterThan(before.scroll + 1);
          checkPlaced(narrower, `${where}, narrower`);
          await page.getByTestId('instrument-dock').getByRole('status').evaluate((el, t) => { el.textContent = t; }, before.text);
          await settled(page);
          const wider = await fadeState(page);
          expect(wider.edge, `${where}: the row wider again`).toBeGreaterThan(narrower.edge + 1);
          checkPlaced(wider, `${where}, wider`);
          await expectNoLoop(page, where);
        } finally {
          await context.close();
        }
      });

      test(`placed again (B): C7♯5♭9 / B, ${lang}${text.label}${motionLabel}, the window from 1279 to 1280 px (the notice moves up, the chips' row narrows) and back: the last chip in view and clear each time`, async ({ browser }) => {
        const where = `placed again, the window 1279 ↔ 1280 px, ${lang}${text.label}${motionLabel}`;
        const { context, page } = await open(browser, { w: 1279, h: 800 }, lang, {}, NO_BASS_URL, text.wide, motion);
        try {
          await settled(page);
          const before = await lastChip(page);
          expect(before.sameLine, `${where}: at 1279 px the notice on its own line`).toBe(false);
          checkPlaced(before, `${where}, 1279 px`);
          await page.setViewportSize({ width: 1280, height: 800 });
          await settled(page);
          const narrower = await fadeState(page);
          console.log(`placed again: ${where}: the row ${before.edge.toFixed(1)} → ${narrower.edge.toFixed(1)} px; at 1279 ${fadeText(before)}; at 1280 ${fadeText(narrower)}`);
          expect(narrower.sameLine, `${where}: at 1280 px the notice on the controls' line`).toBe(true);
          expect(narrower.maxScroll, `${where}: precondition, the row now scrolls further (${narrower.maxScroll.toFixed(1)} px) than where the chip was left (${before.scroll.toFixed(1)} px)`).toBeGreaterThan(before.scroll + 1);
          checkPlaced(narrower, `${where}, 1280 px`);
          await page.setViewportSize({ width: 1279, height: 800 });
          await settled(page);
          const wider = await fadeState(page);
          expect(wider.sameLine, `${where}: back at 1279 px the notice on its own line`).toBe(false);
          expect(wider.edge, `${where}: the row wider again`).toBeGreaterThan(narrower.edge + 1);
          checkPlaced(wider, `${where}, back at 1279 px`);
          await expectNoLoop(page, where);
        } finally {
          await context.close();
        }
      });
    }
  }
}

// ─── The line's minimum is the widest chip's (C) ─────────────────────────────
// At 1280×720 the notice is widened from outside (padding, 1 px at a time,
// found by halving) to the very width where it no longer fits beside the
// controls and the chips' line: it overflows that line by under 1 px. Then
// every grip is selected in turn (without focus). The line's minimum is the
// widest chip's, so no narrower grip brings the notice back up: one line and
// one dock height for all. With a minimum from the selected chip, a grip 21 px
// narrower than the widest (this machine, English) frees 21 px and the notice
// moves up, changing the dock's height by its own line.
for (const lang of ['en', 'es'] as const) {
  for (const text of TEXTS) {
    test(`widest chip (C): C7♯5♭9 / B, 1280×720 ${lang}${text.label}, the notice just too wide to share the line: every grip leaves it on its own line, one dock height`, async ({ browser }) => {
      const where = `widest chip, 1280×720 ${lang}${text.label}`;
      const { context, page } = await open(browser, { w: 1280, h: 720 }, lang, {}, NO_BASS_URL, text.wide);
      try {
        await settled(page);
        const chips = gripChips(page);
        const widths = await chips.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
        const widest = widths.indexOf(Math.max(...widths));
        expect(Math.max(...widths) - Math.min(...widths), `${where}: grips of different widths (${widths.map((x) => x.toFixed(1)).join(', ')})`).toBeGreaterThan(2);
        await chips.nth(widest).dispatchEvent('click');
        await settled(page);
        // Padding is a transitioned property (under reduced motion every
        // property is, for 0.01 ms): switched off on the notice so each step's
        // layout is read at once.
        const pad = await page.evaluate(() => {
          const controls = document.querySelector('[data-testid="instrument-dock"] .fretboard-controls')!;
          const notice = controls.querySelector<HTMLElement>(':scope > [role="status"]')!;
          notice.style.setProperty('transition', 'none', 'important');
          const first = Array.from(controls.children).find((c) => c.getAttribute('role') !== 'status')!;
          const own = (p: number) => { notice.style.paddingRight = `${p}px`; return notice.getBoundingClientRect().top >= first.getBoundingClientRect().bottom - 1; };
          if (own(0) || !own(2000)) return -1;
          let lo = 0;
          let hi = 2000;
          while (hi - lo > 1) { const mid = Math.floor((lo + hi) / 2); if (own(mid)) hi = mid; else lo = mid; }
          own(hi);
          return hi;
        });
        expect(pad, `${where}: a padding that just sends the notice to its own line`).toBeGreaterThan(0);
        await settled(page);
        const seen: GripState[] = [];
        for (let i = 0; i < widths.length; i++) {
          await chips.nth(i).dispatchEvent('click');
          await settled(page);
          seen.push(await gripState(page));
        }
        console.log(`widest chip: ${where}: chips ${widths.map((x) => x.toFixed(1)).join(', ')} px, the widest chip ${widest + 1}; the notice padded ${pad} px`);
        expect(oneHeightPerText(seen, where), `${where}: this chord's notice does not change with the grip`).toBe(1);
        expect(seen[0].sameLine, `${where}: on its own line`).toBe(false);
        await expectNoLoop(page, where);
      } finally {
        await context.close();
      }
    });
  }
}

// ─── The configuration of GitHub run #71 at b4fc9ab, on this machine (A) ─────
// 1024×768, English, text 0.06em wider (the nearest this Mac comes to that
// run): at b4fc9ab / 505f2e9 grips 1–4 put the notice on its own line (the
// line's minimum from a 90.3 px chip did not fit beside it) and grip 5, 69.3
// px, let it share the line: the row shrank from 641 to 114 px AFTER grip 5
// was placed (under reduced motion the new min-width is a 0.01 ms transition,
// applied a frame or more later), nothing placed it again, and it was left
// 339 px past the row's right edge. Every grip in turn, without focus: whole,
// clear of the fades, the notice's line and the dock's height unchanged.
for (const { motion, label: motionLabel } of MOTIONS) {
  test(`the run-#71 configuration (A): C7♯5♭9 / B, 1024×768 en, text 0.06em wider${motionLabel}, every grip without focus: in view, clear, the notice's line and the dock unchanged`, async ({ browser }) => {
    const where = `run-#71 configuration, 1024×768 en, text 0.06em wider${motionLabel}`;
    const { context, page } = await open(browser, { w: 1024, h: 768 }, 'en', {}, NO_BASS_URL, '*, *::before, *::after { letter-spacing: 0.06em !important; }', motion);
    try {
      await settled(page);
      const chips = gripChips(page);
      const n = await chips.count();
      const start = await fadeState(page);
      const seen: GripState[] = [];
      for (let i = 0; i < n; i++) {
        await chips.nth(i).dispatchEvent('click');
        await settled(page);
        const s = await fadeState(page);
        console.log(`run #71: ${where}, ${fadeText(s)}, notice ${s.sameLine ? 'on the controls\' line' : 'own line'}, dock ${s.height.toFixed(1)} px`);
        expect(s.idx, `${where}: selected`).toBe(i);
        checkPlaced(s, where);
        seen.push(s);
      }
      expect(oneHeightPerText(seen, where), `${where}: this chord's notice does not change with the grip`).toBe(1);
      expect(Math.abs(seen[0].height - start.height), `${where}: the dock as at first`).toBeLessThanOrEqual(0.5);
      await expectNoLoop(page, where);
    } finally {
      await context.close();
    }
  });
}

// ─── Re-measured when the chips grow (cold review F5) ───────────────────────
// The chips' line beside the notice at 1280×720 (EN; the narrowest width where
// they share it): its line takes the room the notice leaves it, so when only
// the chips' text grows AFTER the first layout (letter-spacing 3em on the
// chips, not the label) the row's own box keeps its width and only the
// observer on the chips tells the line: its minimum follows the new widths
// (the widest chip as drawn selected), the notice moves to its own line, and
// the chip row is again at least as wide as its chip (without re-measuring,
// the row stays ~319 px for a ~460 px chip). Motion reduced and not: written
// inside the observer's callback, the new minimum made Chromium report a
// ResizeObserver loop with motion not reduced (with it reduced, the 0.01 ms
// transition hid it).
for (const { motion, label: motionLabel } of MOTIONS) {
  test(`re-measured when the chips' text grows after the first layout: C7♯5♭9 / B, 1280×720 en${motionLabel}`, async ({ browser }) => {
    const where = `re-measured${motionLabel}`;
    const { context, page } = await open(browser, { w: 1280, h: 720 }, 'en', {}, NO_BASS_URL, false, motion);
    try {
      const dock = page.getByTestId('instrument-dock');
      const before = await checkRow(page, `${where}, before widening`, 1);
      expect(before.sameLine, `${where}, before widening: the notice shares the line (the chips squeezed beside it)`).toBe(true);
      const slack = await page.evaluate(() => {
        const line = document.querySelector<HTMLElement>('[data-testid="instrument-dock"] .chord-shapes-line')!;
        return { line: line.getBoundingClientRect().width, row: line.querySelector('.edge-fade')!.getBoundingClientRect().width, min: parseFloat(line.style.minWidth) };
      });
      await page.addStyleTag({ content: '.chord-shapes-line [role="radio"] { letter-spacing: 3em !important; }' });
      await settled(page);
      // The widest chip as drawn selected, measured here on copies of its own.
      const m = await page.evaluate(() => {
        const line = document.querySelector<HTMLElement>('[data-testid="instrument-dock"] .chord-shapes-line')!;
        const row = line.querySelector('.chip-group')!;
        const label = line.firstElementChild!.getBoundingClientRect().width;
        const copies = Array.from(row.querySelectorAll('[role="radio"]'), (c) => {
          const copy = c.cloneNode(true) as HTMLElement;
          copy.setAttribute('aria-checked', 'true');
          copy.style.cssText = 'position: absolute; visibility: hidden';
          return copy;
        });
        row.append(...copies);
        const widest = Math.max(...copies.map((c) => c.getBoundingClientRect().width));
        for (const c of copies) c.remove();
        return { label, widest, gap: parseFloat(getComputedStyle(line).columnGap), min: parseFloat(line.style.minWidth), line: line.getBoundingClientRect().width };
      });
      const row = (await dock.locator('.chip-row-scroll').first().boundingBox())!;
      const at = (await dock.locator(SELECTED_CHIP).boundingBox())!;
      const after = await checkRow(page, `${where}, after widening`, 1);
      console.log(`re-measured: ${where}: before, the line ${slack.line.toFixed(1)} px (the row ${slack.row.toFixed(1)} px) for a minimum of ${slack.min} px; after, label ${m.label.toFixed(1)} + gap ${m.gap} + widest chip ${m.widest.toFixed(1)} + 36 → minimum ${m.min} px, the line ${m.line.toFixed(1)} px, the row ${row.width.toFixed(1)} px for a ${at.width.toFixed(1)} px chip, the notice ${after.sameLine ? 'on the controls\' line' : 'on its own line'}`);
      expect(m.min, `${where}: the line's minimum follows the widened chips (label ${m.label.toFixed(1)} + gap ${m.gap} + widest chip ${m.widest.toFixed(1)} + 2 × 18)`).toBeCloseTo(Math.ceil(m.label + m.gap + m.widest + 36), 0);
      expect(row.width, `${where}: the chip row (${row.width.toFixed(1)} px) again at least as wide as its chip (${at.width.toFixed(1)} px)`).toBeGreaterThanOrEqual(at.width - 0.5);
      expect(at.x).toBeGreaterThanOrEqual(row.x - 0.5);
      expect(at.x + at.width).toBeLessThanOrEqual(row.x + row.width + 0.5);
      expect(after.sameLine, `${where}: the notice moved to its own line`).toBe(false);
      await expectNoLoop(page, where);
    } finally {
      await context.close();
    }
  });
}

// ─── A learner's own text spacing (cold review of the third pass, F1) ────────
// WCAG 1.4.12's text spacing (letter-spacing 0.12em, word-spacing 0.16em) on
// everything, set once the page has loaded (so these rows also pass through
// the re-measure and its next-frame write). The line's minimum is still its label,
// the gap, the widest chip as drawn selected and both fades: measured here on
// real copies of the chips, against the minimum the app wrote from its
// canvas measure (which adds the letter-spacing after every character and the
// word-spacing after every space itself). Without the word-spacing term the
// minimum came short by 2.2 px for each space in the widest chip's words.
// Whether the notice shares the line at this spacing is not this row's claim.
for (const lang of LANGS) {
  test(`a learner's own text spacing (letter-spacing 0.12em, word-spacing 0.16em): the chips' line keeps its minimum for the widest chip as drawn, C7♯5♭9 / B, 1280×720 ${lang}`, async ({ browser }) => {
    const where = `own text spacing, 1280×720 ${lang}`;
    const { context, page } = await open(browser, { w: 1280, h: 720 }, lang, {}, NO_BASS_URL, '*, *::before, *::after { letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }');
    try {
      await checkRow(page, where, 1);
      const m = await page.evaluate(() => {
        const line = document.querySelector<HTMLElement>('[data-testid="instrument-dock"] .chord-shapes-line')!;
        const row = line.querySelector('.chip-group')!;
        const label = line.firstElementChild!.getBoundingClientRect().width;
        const copies = Array.from(row.querySelectorAll('[role="radio"]'), (c) => {
          const copy = c.cloneNode(true) as HTMLElement;
          copy.setAttribute('aria-checked', 'true');
          copy.style.cssText = 'position: absolute; visibility: hidden';
          return copy;
        });
        row.append(...copies);
        const widths = copies.map((c) => c.getBoundingClientRect().width);
        const widest = Math.max(...widths);
        const words = copies[widths.indexOf(widest)].textContent ?? '';
        for (const c of copies) c.remove();
        return { label, widest, words, spaces: (words.match(/[ \u00a0]/g) ?? []).length, gap: parseFloat(getComputedStyle(line).columnGap), min: parseFloat(line.style.minWidth) };
      });
      const exact = m.label + m.gap + m.widest + 36;
      console.log(`own text spacing: ${where}: label ${m.label.toFixed(1)} + gap ${m.gap} + widest chip "${m.words}" ${m.widest.toFixed(1)} + 36 = ${exact.toFixed(1)} px; the line's minimum ${m.min} px`);
      expect(m.spaces, `${where}: the widest chip's words hold a space (else the word-spacing is not tested): "${m.words}"`).toBeGreaterThan(0);
      // The minimum is that sum rounded up to a whole pixel.
      expect(m.min - exact, `${where}: the line's minimum ${m.min} px for label ${m.label.toFixed(1)} + gap ${m.gap} + widest chip ${m.widest.toFixed(1)} + 2 × 18 = ${exact.toFixed(1)} px`).toBeGreaterThanOrEqual(-0.1);
      expect(m.min - exact, `${where}: the line's minimum ${m.min} px no more than a pixel over ${exact.toFixed(1)} px`).toBeLessThanOrEqual(1.1);
      // The copies woke the edge fade's own observer (it watches the row's children): let that pass first.
      await settled(page);
      await expectNoLoop(page, where);
    } finally {
      await context.close();
    }
  });
}

// ─── The loop detector sees a loop (two known positives) ─────────────────────
// An observer planted on the page that changes its own target's size each
// time it is told. (1) With the size not transitioned the browser reports it;
// (2) with the size transitioned (reduced motion: every property, 0.01 ms) it
// reports nothing, but calls back frame after frame: the quiet window sees
// it. Either way, the check every row above ends on must fail.
for (const transitioned of [false, true]) {
  test(`the ResizeObserver loop check catches a planted loop${transitioned ? ' the browser does not report (its size transitioned)' : ' the browser reports'}`, async ({ browser }) => {
    const { context, page } = await open(browser, { w: 1280, h: 720 }, 'en', {}, NO_BASS_URL, false);
    try {
      await settled(page);
      const planted = await page.evaluate((transitioned) => new Promise<{ errors: string[]; calls: number }>((done) => {
        const w = window as unknown as LoopWindow;
        const el = document.createElement('div');
        el.style.cssText = 'width: 10px; height: 10px';
        if (!transitioned) el.style.setProperty('transition', 'none', 'important');
        document.body.append(el);
        const from = w.__roCalls;
        new ResizeObserver(() => { el.style.width = `${parseFloat(el.style.width) + 1}px`; }).observe(el);
        setTimeout(() => done({ errors: w.__roErrors.slice(), calls: w.__roCalls - from }), 300);
      }), transitioned);
      console.log(`loop detector: ${transitioned ? 'transitioned' : 'not transitioned'}: ${planted.errors.length} messages, ${planted.calls} callbacks in 300 ms; the first message "${planted.errors[0] ?? ''}"`);
      if (!transitioned) expect(planted.errors.some((m) => /ResizeObserver loop/.test(m)), 'the planted loop is reported').toBe(true);
      else expect(planted.errors, 'a transitioned loop is not reported').toEqual([]);
      expect(planted.calls, 'the planted loop calls back again and again').toBeGreaterThan(5);
      await expect(expectNoLoop(page, 'the planted loop')).rejects.toThrow(transitioned ? /no ResizeObserver callback in 500 ms/ : /no ResizeObserver loop message/);
    } finally {
      await context.close();
    }
  });
}
