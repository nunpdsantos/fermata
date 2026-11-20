import { test, expect, type Page } from '@playwright/test';
import { seededBrowser, PHONE, type View, type Lang } from './helpers/wave1';

/**
 * Audit 2026-11-18, stream C (Explore tools), in a real browser:
 *
 * Q4 — Build's "Detected" readout and the chord inspector were cut off behind
 * the piano dock at 1440×900 with the piano showing (the default), and a
 * built chord's detail landed with the readout scrolled away. At 1280×800,
 * 1366×768, 1440×900 and 1536×864, EN / PT / ES, the instrument showing at
 * Half throughout:
 *   - the page itself never scrolls (at 1366×768 a screen-reader-only line of
 *     the detail stretched it by 27 px);
 *   - at 1440×900, before anything is built, the whole builder — controls,
 *     the 13 notes and the readout — is on screen with room to spare;
 *   - at every size the readout can be brought wholly into view between the
 *     held staff strip and the dock by scrolling the work column, before and
 *     after a chord is built (it is never only reachable by hiding the dock);
 *   - and it STAYS there when the staff strip's staff arrives: VexFlow is
 *     held back until the readout has been scrolled into view, then let go
 *     (review of the second round, 20 November 2026: the strip's loading
 *     skeleton was 80 px and the drawn staff 100, so a staff that arrived
 *     late — a fresh dev server on GitHub's runners — moved everything under
 *     it 20 px down and put the readout back under the dock; release 16 did
 *     the same, only less often too late). Held two ways (`holdVexFlow`):
 *     the loader with the library, so the strip shows ScaleStrip's Suspense
 *     fallback; then the library alone, so StaffNotation itself mounts and
 *     shows its OWN skeleton. Each time the strip's height is compared too;
 *     at 1440×900 that is the only check that can see a 20 px drop (the
 *     readout has 23 px to spare there), the readout's carries it elsewhere;
 *   - in normal text and with the text 8 % wider (letter-spacing 0.04em,
 *     roughly how GitHub's Linux draws it);
 *   - after a chord is built, ▶ Chord is in view, and wherever the readout
 *     and the detail's actions fit together under the strip (1280, 1440,
 *     1536 — logged per size) the readout lands in view with them; at
 *     1440×900 the 13 notes too.
 * Q14 — Explore has one top heading (h1), before every h2.
 * A8 — the circle says where a wedge leads before the tap: hovered, a wedge
 * whose label is a chord of another name shows "Opens <key>".
 */

const LAPTOPS: [number, number][] = [[1280, 800], [1366, 768], [1440, 900], [1536, 864]];
const LANGS: Lang[] = ['en', 'pt', 'es'];
const BUILD = { en: 'Build', pt: 'Construir', es: 'Construir' } as const;

async function openBuild(page: Page, lang: Lang, wide = false) {
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  if (wide) await page.addStyleTag({ content: 'body *:not(svg):not(svg *) { letter-spacing: 0.04em !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('tab', { name: BUILD[lang], exact: true }).click();
  await expect(page.getByTestId('builder-readout')).toBeAttached();
  await page.waitForTimeout(300);
}

/** Where things are, against the room the work column shows between the held strip and the dock. */
function geometry(page: Page) {
  return page.evaluate(() => {
    const box = (sel: string) => { const e = document.querySelector(sel); return e ? e.getBoundingClientRect().toJSON() as DOMRect : null; };
    const main = document.querySelector<HTMLElement>('.explore-main')!;
    const m = main.getBoundingClientRect(), strip = box('.strip-card')!, dock = box('[data-testid="instrument-dock"]')!;
    const top = Math.max(m.top, strip.bottom), bottom = Math.min(m.bottom, dock.top);
    const span = (b: DOMRect | null) => (b ? { top: b.top, bottom: b.bottom } : null);
    return {
      top, bottom, dockHeight: dock.height,
      pageScroll: document.scrollingElement!.scrollHeight - innerHeight,
      columnScroll: main.scrollHeight - main.clientHeight,
      readout: span(box('[data-testid="builder-readout"]')),
      notes: span(box('.chords-card [role="group"]')),
      actions: span(box('[data-testid="chord-detail"] .chord-detail-actions')),
      detail: span(box('[data-testid="chord-detail"]')),
    };
  });
}
const whole = (b: { top: number; bottom: number } | null, g: { top: number; bottom: number }) =>
  !!b && b.top >= g.top - 0.5 && b.bottom <= g.bottom + 0.5;

/**
 * Hold VexFlow back until `release()`. What each configuration serves (read
 * 20 November 2026): the dev server `/src/utils/vexflowLoader.ts` (the
 * loader) and `/node_modules/.vite/deps/vexflow_bravura.js` (the library);
 * the build `assets/vexflowLoader-<hash>.js` and `assets/vexflow-<hash>.js`
 * (the library's chunk is named in vite.config.ts).
 *  - 'loader' holds both (/vexflow/): useStaffNotation imports the loader, so
 *    the lazy StaffNotation chunk cannot run, the library is never asked for,
 *    and each staff shows the Suspense fallback its caller gives (ScaleStrip,
 *    ChordStaff);
 *  - 'library' holds the library alone: StaffNotation mounts, asks for it and
 *    shows its OWN skeleton (StaffNotation.tsx).
 * `asked` lists the paths held, to prove which of the two it was.
 */
const HOLDS = { loader: /vexflow/i, library: /\/vexflow(?:_bravura|-[\w-]+)\.js(?:\?|$)/ } as const;
type Hold = keyof typeof HOLDS;
async function holdVexFlow(page: Page, hold: Hold) {
  let release!: () => void;
  const held = new Promise<void>((r) => { release = r; });
  const asked: string[] = [];
  await page.route(HOLDS[hold], async (route) => { asked.push(new URL(route.request().url()).pathname); await held; await route.continue(); });
  return { hold, asked, release: () => release() };
}

/**
 * What a staff shows: 'drawn', 'none', or whose skeleton — 'fallback' (its
 * caller's Suspense fallback) or 'own' (StaffNotation's, while VexFlow
 * loads). The two skeletons are the same markup; which one it is comes from
 * React's fiber of it: the nearer of a lazy component (StaffNotation, lazy in
 * every caller) and a Suspense boundary above it.
 */
function staffShows(page: Page, sel: string) {
  return page.evaluate((sel) => {
    type Fiber = { tag: number; elementType?: { $$typeof?: symbol } | null; return: Fiber | null };
    const box = document.querySelector(sel);
    if (!box) return 'none';
    if (box.querySelector('g.vf-stavenote')) return 'drawn';
    const skeleton = box.querySelector('.animate-pulse');
    if (!skeleton) return 'none';
    const key = Object.keys(skeleton).find((k) => k.startsWith('__reactFiber$'));
    for (let f = key ? (skeleton as unknown as Record<string, Fiber>)[key] : null; f; f = f.return) {
      if (f.elementType?.$$typeof === Symbol.for('react.lazy')) return 'own';
      if (f.tag === 13) return 'fallback'; // a Suspense boundary
    }
    return 'skeleton';
  }, sel);
}

/** The hold took (the right paths asked for) and each staff shows the skeleton it should. */
async function expectSkeletons(page: Page, vf: Awaited<ReturnType<typeof holdVexFlow>>, staffs: string[], where: string) {
  const isLoader = (p: string) => /vexflowLoader/.test(p);
  await expect.poll(() => vf.asked.length, `${where}: VexFlow asked for and held`).toBeGreaterThan(0);
  if (vf.hold === 'loader') {
    expect(vf.asked.every(isLoader), `${where}: only the loader held, the library never asked for (${vf.asked.join(', ')})`).toBe(true);
  } else {
    expect(vf.asked.some(isLoader), `${where}: the loader let through, the library held (${vf.asked.join(', ')})`).toBe(false);
  }
  const want = vf.hold === 'loader' ? 'fallback' : 'own';
  for (const sel of staffs) {
    await expect.poll(() => staffShows(page, sel), `${where}: ${sel} shows ${want === 'own' ? "StaffNotation's own skeleton" : "its caller's Suspense fallback"}`).toBe(want);
  }
}

const height = (page: Page, sel: string) => page.locator(sel).evaluate((e) => e.getBoundingClientRect().height);

/** Scroll the work column (as a wheel would) until the readout is wholly between the strip and the dock. */
async function scrollReadoutIntoView(page: Page) {
  await page.evaluate(() => {
    const main = document.querySelector<HTMLElement>('.explore-main')!;
    const strip = document.querySelector('.strip-card')!.getBoundingClientRect();
    const dock = document.querySelector('[data-testid="instrument-dock"]')!.getBoundingClientRect();
    const r = document.querySelector('[data-testid="builder-readout"]')!.getBoundingClientRect();
    const bottom = Math.min(main.getBoundingClientRect().bottom, dock.top);
    if (r.bottom > bottom) main.scrollTop += r.bottom - bottom + 4;
    else if (r.top < strip.bottom) main.scrollTop -= strip.bottom - r.top + 4;
  });
  await page.waitForTimeout(150);
}

for (const [w, h] of LAPTOPS) for (const wide of [false, true]) {
  test(`Q4 ${w}×${h}${wide ? ', text 8 % wider' : ''}: Build's readout and inspector over the docked piano, EN / PT / ES`, async ({ browser }) => {
    const v: View = { name: 'laptop', viewport: { width: w, height: h }, touch: false };
    for (const lang of LANGS) {
      const { context, page } = await seededBrowser(browser, v, {
        themeMode: 'fermata', language: lang, lastView: 'explore', instrument: 'piano', baseOctave: 4,
        selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
      }, {}, { lang });
      // Hold VexFlow back (the loader with the library: the strip shows
      // ScaleStrip's Suspense fallback) until the readout has been scrolled
      // into view, so the staff always arrives late.
      const vf = await holdVexFlow(page, 'loader');
      await openBuild(page, lang, wide);
      const where = `${w}×${h} ${lang}${wide ? ' (text 8 % wider)' : ''}`;
      await expectSkeletons(page, vf, ['.strip-staff'], where);
      let g = await geometry(page);
      const dockHeight = g.dockHeight;
      expect(dockHeight, `${where}: the piano shows at Half`).toBeGreaterThan(200);
      expect(g.pageScroll, `${where}: the page never scrolls`).toBeLessThanOrEqual(0);
      if (w === 1440) {
        // The audit's own screen: everything of the builder, nothing scrolled.
        // (The 23 px to spare here are more than a late staff's 20 px drop, so
        // the readout's checks below cannot see one at this size: the strip's
        // height check can, and the three shorter sizes carry the readout's.)
        expect(g.columnScroll, `${where}: the work column needs no scrolling`).toBeLessThanOrEqual(1);
        expect(whole(g.notes, g), `${where}: the 13 notes on screen`).toBe(true);
        expect(whole(g.readout, g), `${where}: the readout on screen`).toBe(true);
        console.log(`[q4] ${where} rest: ${Math.round(g.bottom - g.readout!.bottom)} px to spare under the readout`);
        expect(g.bottom - g.readout!.bottom, `${where}: room to spare (Linux draws text wider)`).toBeGreaterThanOrEqual(8);
      }
      await scrollReadoutIntoView(page);
      g = await geometry(page);
      expect(whole(g.readout, g), `${where}: before a chord, the readout can be scrolled wholly into view`).toBe(true);
      // The staff arrives: nothing above the readout grows, so it stays in view.
      expect(await page.locator('.strip-staff g.vf-stavenote').count(), `${where}: the staff not drawn yet`).toBe(0);
      const strip = await height(page, '.strip-card');
      vf.release();
      await expect(page.locator('.strip-staff g.vf-stavenote').first()).toBeAttached({ timeout: 15_000 });
      await page.waitForTimeout(150);
      g = await geometry(page);
      expect(whole(g.readout, g), `${where}: the staff drawn, the readout still wholly in view`).toBe(true);
      expect(await height(page, '.strip-card'), `${where}: the staff drawn, the strip no taller than its fallback`).toBeCloseTo(strip, 0);

      // C E G: a chord, its detail opens under the builder.
      await page.locator('.explore-main').evaluate((el) => { el.scrollTop = 0; });
      const notes = page.locator('.chords-card [role="group"] button');
      await notes.nth(4).click();
      await notes.nth(7).click();
      await expect(page.getByTestId('chord-detail')).toBeVisible();
      await page.waitForTimeout(500);
      g = await geometry(page);
      expect(g.dockHeight, `${where}: the instrument is still shown`).toBe(dockHeight);
      expect(g.pageScroll, `${where}: the page never scrolls, a chord open`).toBeLessThanOrEqual(0);
      // What made it scroll at 1366×768: the detail's screen-reader-only line
      // (absolutely placed) was positioned against the page, not the work
      // column, so below the fold it stretched the page by 27 px. Every such
      // line in the column is placed inside it.
      const escaped = await page.evaluate(() => {
        const main = document.querySelector('.explore-main')!;
        return Array.from(main.querySelectorAll<HTMLElement>('.sr-only')).filter((e) => !e.offsetParent || !main.contains(e.offsetParent)).map((e) => e.textContent);
      });
      expect(escaped, `${where}: screen-reader lines placed against the page`).toEqual([]);
      expect(whole(g.actions, g), `${where}: ▶ Chord in view`).toBe(true);
      const fits = !!g.readout && !!g.actions && g.actions.bottom - g.readout.top <= g.bottom - g.top - 8;
      console.log(`[q4] ${where} chord: readout ${whole(g.readout, g) ? 'in view' : 'scrolled away'}, notes ${whole(g.notes, g) ? 'in view' : 'scrolled away'}, detail ${whole(g.detail, g) ? 'whole' : 'partly'}; readout + actions ${Math.round(g.actions!.bottom - g.readout!.top)} of ${Math.round(g.bottom - g.top - 8)} px`);
      if (w !== 1366) {
        expect(fits, `${where}: readout and actions fit together`).toBe(true);
        expect(whole(g.readout, g), `${where}: the readout lands in view with the detail`).toBe(true);
      }
      if (w === 1440) {
        expect(whole(g.notes, g), `${where}: the 13 notes stay in view`).toBe(true);
        expect(whole(g.detail, g), `${where}: the whole detail in view`).toBe(true);
      }
      await scrollReadoutIntoView(page);
      g = await geometry(page);
      expect(whole(g.readout, g), `${where}: a chord open, the readout can be scrolled wholly into view`).toBe(true);
      expect(g.dockHeight).toBe(dockHeight);
      await context.close();

      // Again with the library alone held: the loader comes, StaffNotation
      // mounts and shows its OWN skeleton (review of the fix, 20 November
      // 2026: holding /vexflow/ holds the loader too, so the first pass only
      // ever shows ScaleStrip's fallback, and StaffNotation's own skeleton
      // put back at the height asked for passed it).
      {
        const { context, page } = await seededBrowser(browser, v, {
          themeMode: 'fermata', language: lang, lastView: 'explore', instrument: 'piano', baseOctave: 4,
          selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
        }, {}, { lang });
        const vf = await holdVexFlow(page, 'library');
        await openBuild(page, lang, wide);
        const own = `${where}, StaffNotation's own skeleton`;
        await expectSkeletons(page, vf, ['.strip-staff'], own);
        await scrollReadoutIntoView(page);
        let g = await geometry(page);
        expect(whole(g.readout, g), `${own}: the readout can be scrolled wholly into view`).toBe(true);
        expect(await staffShows(page, '.strip-staff'), `${own}: still the skeleton on screen`).toBe('own');
        const strip = await height(page, '.strip-card');
        vf.release();
        await expect(page.locator('.strip-staff g.vf-stavenote').first()).toBeAttached({ timeout: 15_000 });
        await page.waitForTimeout(150);
        g = await geometry(page);
        expect(whole(g.readout, g), `${own}: the library arrived, the readout still wholly in view`).toBe(true);
        expect(await height(page, '.strip-card'), `${own}: the library arrived, the strip no taller than the skeleton`).toBeCloseTo(strip, 0);
        await context.close();
      }
    }
  });
}

// Review of the staff-skeleton fix (20 November 2026): nothing tested the
// chord's own small staff (the detail's, shown under 1200 px wide), so its
// fallback put back at CHORD_STAFF_HEIGHT under its comment got past every
// row. The chord C is drawn taller than the 80 px asked for (C4's ledger
// line on the piano: 100 px; the guitar's staff, written an octave up under
// its 8vb clef: 108), and with an 80 px skeleton the chord detail and the
// chords card's foot moved 20 / 28 px when VexFlow arrived (390×844: the
// detail 389.8 → 409.8, the card's bottom 564.2 → 584.2). A phone and a
// laptop size where the chord staff shows, piano and guitar, the chord C
// selected (a share link), VexFlow held both ways (`holdVexFlow`): the
// chord staff's box, the chord detail's height, the chords card's bottom
// and the strip's staff, measured on the skeletons and again once both
// staffs are drawn: none moves.
const CHORD_STAFF_VIEWS: View[] = [PHONE, { name: 'laptop', viewport: { width: 1024, height: 768 }, touch: false }];
for (const v of CHORD_STAFF_VIEWS) for (const instrument of ['piano', 'guitar'] as const) {
  test(`Staff skeletons ${v.viewport.width}×${v.viewport.height} ${instrument}, the chord C: nothing moves when VexFlow arrives (the Suspense fallbacks, then StaffNotation's own)`, async ({ browser }) => {
    for (const hold of ['loader', 'library'] as const) {
      const { context, page } = await seededBrowser(browser, v, {
        themeMode: 'fermata', language: 'en', lastView: 'explore', instrument, baseOctave: 4,
        selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
      });
      const vf = await holdVexFlow(page, hold);
      await page.goto(`/?key=C&scale=major&chord=C&inst=${instrument}`);
      await expect(page.getByTestId('chord-staff')).toBeVisible({ timeout: 15_000 });
      if (instrument === 'guitar') await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
      await page.evaluate(() => document.fonts.ready);
      const where = `${v.viewport.width}×${v.viewport.height} ${instrument}, ${hold === 'loader' ? 'the Suspense fallbacks' : "StaffNotation's own skeletons"}`;
      await expectSkeletons(page, vf, ['.strip-staff', '[data-testid="chord-staff"]'], where);
      await page.waitForTimeout(300);
      const measure = () => page.evaluate(() => {
        const box = (sel: string) => document.querySelector(sel)!.getBoundingClientRect();
        return {
          'the chord staff (height)': box('[data-testid="chord-staff"]').height,
          'the chord staff (top)': box('[data-testid="chord-staff"]').top,
          "the chord detail's height": box('[data-testid="chord-detail"]').height,
          "the chords card's bottom": box('[data-testid="chords-card"]').bottom,
          "the strip's staff (height)": box('.strip-staff').height,
        };
      });
      const before = await measure();
      expect(await staffShows(page, '[data-testid="chord-staff"]'), `${where}: still the skeleton on screen`).toBe(hold === 'loader' ? 'fallback' : 'own');
      vf.release();
      await expect(page.locator('[data-testid="chord-staff"] g.vf-stavenote').first()).toBeAttached({ timeout: 15_000 });
      await expect(page.locator('.strip-staff g.vf-stavenote').first()).toBeAttached({ timeout: 15_000 });
      await page.waitForTimeout(150);
      const after = await measure();
      console.log(`[skeletons] ${where}: ${Object.entries(before).map(([k, b]) => `${k} ${Math.round(b * 10) / 10} → ${Math.round(after[k as keyof typeof after] * 10) / 10}`).join(', ')}`);
      // The case that moved: a chord drawn taller than the 80 px asked for.
      expect(after['the chord staff (height)'], `${where}: the chord drawn taller than the 80 px asked for`).toBeGreaterThan(80);
      for (const k of Object.keys(before) as (keyof typeof before)[]) {
        expect(after[k], `${where}: ${k} unchanged when VexFlow arrived`).toBeCloseTo(before[k], 0);
      }
      await context.close();
    }
  });
}

// The owner's ruling of 19 November 2026: on the Build tab of a laptop under
// 900 px tall the staff strip may scroll with the work, so that Build fits.
// Done means: at 1280×800, 1366×768 and 1536×864, piano and guitar, EN / PT /
// ES, a chord built, once its detail has landed the builder's root row, its 13
// notes, the readout, ▶ Chord and the chord's first row are all on screen at
// once, nothing cut in half at the top, no sideways scroll, the instrument at
// Half; at 1440×900 the strip stays held on Build, as before. The chords:
// C E G, G7 and C9 (a two-line readout, as nearly every chord has), and the
// longest readout measured (F♯ 13♭9 in C major: its root outside the key,
// four notes outside; four lines in PT).
// Every case is held to the landing's rule, against the room measured: when
// the root row through ▶ Chord fits (the room less the clearance the landing
// keeps above, `scroll-padding-top`, and 8 px below), all five are on screen
// (and the tabs too when they also fit); otherwise the readout and ▶ Chord.
// What must fit outright: the three usual chords at 1366×768 and 1536×864,
// and the longest readout at 1536×864. On macOS the usual three fit at
// 1280×800 as well, and the longest at 1366×768 in English (logged, not
// asserted): with text about 8 % wider, as GitHub's Linux runners draw it
// (simulated with letter-spacing), C9's readout and first row wrap at
// 1280×800, the Spanish header wraps there with the guitar (44 px less
// room), and the longest readout wraps at 1366×768 in English.
const BUILD_CHORDS = [
  { name: 'C E G', root: 'C', steps: [4, 7], longest: false },
  { name: 'G7', root: 'G', steps: [4, 7, 10], longest: false },
  { name: 'C9', root: 'C', steps: [2, 4, 7, 10], longest: false },
  { name: 'F♯13♭9 (the longest readout)', root: 'F#', steps: [1, 4, 7, 9, 10], longest: true },
];
for (const [w, h] of [[1280, 800], [1366, 768], [1536, 864], [1440, 900]] as const) {
  for (const instrument of ['piano', 'guitar'] as const) {
    test(`Q4, the owner's ruling: ${w}×${h} ${instrument}, Build — root row, notes, readout, ▶ Chord and the first row on screen together (EN / PT / ES)`, async ({ browser }) => {
      const v: View = { name: 'laptop', viewport: { width: w, height: h }, touch: false };
      for (const lang of LANGS) {
        const { context, page } = await seededBrowser(browser, v, {
          themeMode: 'fermata', language: lang, lastView: 'explore', instrument, baseOctave: 4,
          selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
        }, {}, { lang });
        await page.goto('/');
        await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
        if (instrument === 'guitar') await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        await page.evaluate(() => document.fonts.ready);
        await page.getByRole('tab', { name: BUILD[lang], exact: true }).click();
        await expect(page.getByTestId('builder-readout')).toBeAttached();
        await page.waitForTimeout(300);
        const dockHeight = (await page.getByTestId('instrument-dock').boundingBox())!.height;
        expect(dockHeight, `${w}×${h} ${instrument} ${lang}: the instrument shows at Half`).toBeGreaterThan(200);
        for (const chord of BUILD_CHORDS) {
          const where = `${w}×${h} ${instrument} ${lang} ${chord.name}`;
          await page.locator('.explore-main').evaluate((el) => { el.scrollTop = 0; });
          await page.locator('.chords-card select').first().selectOption(chord.root);
          const notes = page.locator('.chords-card [role="group"] button');
          for (const s of chord.steps) await notes.nth(s).click();
          await expect(page.getByTestId('chord-detail')).toBeVisible();
          await page.waitForTimeout(500);
          const m = await page.evaluate(() => {
            const main = document.querySelector<HTMLElement>('.explore-main')!;
            const mr = main.getBoundingClientRect();
            const strip = document.querySelector<HTMLElement>('.strip-card')!;
            const sticky = getComputedStyle(strip).position === 'sticky';
            const dock = document.querySelector('[data-testid="instrument-dock"]')!.getBoundingClientRect();
            // A held strip covers what passes under it; one that scrolls covers nothing.
            const top = sticky ? Math.max(mr.top, strip.getBoundingClientRect().bottom) : mr.top;
            const bottom = Math.min(mr.bottom, dock.top);
            const parts = {
              'the root row': document.querySelector('.chord-builder > [data-chord-scroll-row]')!,
              'the 13 notes': document.querySelector('.chords-card [role="group"]')!,
              'the readout': document.querySelector('[data-testid="builder-readout"]')!,
              '▶ Chord': document.querySelector('[data-testid="chord-detail"] .chord-detail-actions')!,
              "the chord's first row": document.querySelector('[data-testid="chord-detail"] .chord-detail-row')!,
            };
            const off = Object.entries(parts).filter(([, e]) => { const r = e.getBoundingClientRect(); return r.top < top - 0.5 || r.bottom > bottom + 0.5; }).map(([k]) => k);
            // No control left cut in half at the top: by the held strip, or
            // by the work column's own edge when the strip scrolls.
            const card = document.querySelector<HTMLElement>('.chords-card')!;
            const edge = Math.max(top, card.getBoundingClientRect().top + (parseFloat(card.style.clipPath.replace('inset(', '')) || 0));
            const detail = document.querySelector('[data-testid="chord-detail"]')!;
            const sliced = Array.from(card.querySelectorAll<HTMLElement>('button, label, h2, select, [role="tab"]'))
              .filter((e) => !detail.contains(e) && e.getBoundingClientRect().height > 0)
              .filter((e) => { const r = e.getBoundingClientRect(); return r.top < edge - 0.5 && r.bottom > edge + 0.5; })
              .map((e) => e.textContent?.trim() || e.getAttribute('aria-label'));
            const root = parts['the root row'].getBoundingClientRect().top;
            const through = Math.max(parts['▶ Chord'].getBoundingClientRect().bottom, parts["the chord's first row"].getBoundingClientRect().bottom);
            return {
              sticky, off, sliced, need: Math.round(through - root), room: Math.round(bottom - top),
              headInView: card.querySelector('.explore-card-head')!.getBoundingClientRect().top >= top - 0.5,
              headNeed: Math.round(through - card.querySelector('.explore-card-head')!.getBoundingClientRect().top),
              // The landing keeps its clearance from the work column's own top.
              clearance: parseFloat(main.style.scrollPaddingTop) || 0, fromTop: Math.round(bottom - mr.top),
              sideways: Math.max(document.scrollingElement!.scrollWidth - innerWidth, main.scrollWidth - main.clientWidth),
              page: document.scrollingElement!.scrollHeight - innerHeight,
              readoutAndPlay: !['the readout', '▶ Chord'].some((k) => off.includes(k)),
            };
          });
          const available = m.fromTop - m.clearance - 8;
          console.log(`[q4-ruling] ${where}: ${m.off.length ? `off screen: ${m.off.join(', ')}` : 'all on screen'}${m.headInView ? ', the tabs too' : ''}; ${m.sticky ? 'the strip held, as before' : `root row to ▶ Chord ${m.need} px of ${available} (the strip scrolling)`}`);
          expect(m.sideways, `${where}: no sideways scroll`).toBeLessThanOrEqual(0);
          expect(m.page, `${where}: the page never scrolls`).toBeLessThanOrEqual(0);
          expect(m.sliced, `${where}: nothing cut in half at the top`).toEqual([]);
          expect((await page.getByTestId('instrument-dock').boundingBox())!.height, `${where}: the instrument still at Half`).toBe(dockHeight);
          if (h === 900) {
            // 1440×900: nothing changes — the strip stays held on Build.
            expect(m.sticky, `${where}: the strip held`).toBe(true);
          } else {
            expect(m.sticky, `${where}: on Build the strip scrolls with the work`).toBe(false);
            if (w !== 1280 && (!chord.longest || w === 1536)) expect(m.need, `${where}: root row to ▶ Chord fits`).toBeLessThanOrEqual(available);
            if (m.need <= available) expect(m.off, `${where}: all on screen together`).toEqual([]);
            else expect(m.readoutAndPlay, `${where}: where it cannot all fit, the readout and ▶ Chord land together`).toBe(true);
            // Where there is room for them as well, the tabs stay in view.
            if (m.headNeed <= available) expect(m.headInView, `${where}: the tabs in view too`).toBe(true);
            if (w === 1536 && !chord.longest) expect(m.headInView, `${where}: the tabs in view at 1536×864`).toBe(true);
          }
          await page.getByRole('button', { name: /^(Clear|Limpar|Limpiar)$/ }).click();
        }
        // In key keeps the strip held (its point: the chord's tones lit above the detail).
        await page.getByRole('tab', { name: { en: 'In key', pt: 'Na tonalidade', es: 'En la tonalidad' }[lang], exact: true }).click();
        await page.locator('.chord-row button').nth(4).click();
        await expect(page.getByTestId('chord-detail')).toBeVisible();
        expect(await page.locator('.strip-card').evaluate((el) => getComputedStyle(el).position), `${w}×${h} ${lang}: In key keeps the strip held`).toBe('sticky');
        await context.close();
      }
    });
  }
}

test('Q14: Explore has one h1, before every h2 (EN / PT / ES)', async ({ browser }) => {
  const v: View = { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false };
  for (const [lang, name] of [['en', 'Explore'], ['pt', 'Explorar'], ['es', 'Explorar']] as const) {
    const { context, page } = await seededBrowser(browser, v, { themeMode: 'fermata', language: lang, lastView: 'explore' }, {}, { lang });
    await page.goto('/');
    await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(name);
    const before = await page.evaluate(() => {
      const one = document.querySelector('h1')!;
      return Array.from(document.querySelectorAll('h2')).every((h2) => !!(one.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    expect(before, `${lang}: the h1 comes before every h2`).toBe(true);
    // Read, not drawn: nothing on screen moved for it.
    const box = await h1.boundingBox();
    expect(box!.width * box!.height).toBeLessThanOrEqual(1);
    await context.close();
  }
});

test('A8: F♯ major, hovering "E♯° (vii°)" says it opens F minor; tapping does', async ({ browser }) => {
  const v: View = { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false };
  const { context, page } = await seededBrowser(browser, v, {
    themeMode: 'fermata', language: 'en', lastView: 'explore', selectedKey: { natural: 'F', accidental: '#' }, selectedScale: 'major',
  });
  await page.goto('/');
  const wedge = page.getByRole('button', { name: 'E♯° (vii°) in F♯ Major — select F minor' });
  await expect(wedge).toBeVisible({ timeout: 15_000 });
  await wedge.hover();
  await expect(page.getByTestId('cof-hover-opens')).toHaveText('Opens F minor');
  await wedge.click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.selectedScale)).toBe('natural_minor');
  await context.close();
});
