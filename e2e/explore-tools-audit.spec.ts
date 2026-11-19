import { test, expect, type Page } from '@playwright/test';
import { seededBrowser, type View, type Lang } from './helpers/wave1';

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

async function openBuild(page: Page, lang: Lang) {
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
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

for (const [w, h] of LAPTOPS) {
  test(`Q4 ${w}×${h}: Build's readout and inspector over the docked piano, EN / PT / ES`, async ({ browser }) => {
    const v: View = { name: 'laptop', viewport: { width: w, height: h }, touch: false };
    for (const lang of LANGS) {
      const { context, page } = await seededBrowser(browser, v, {
        themeMode: 'fermata', language: lang, lastView: 'explore', instrument: 'piano', baseOctave: 4,
        selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
      }, {}, { lang });
      await openBuild(page, lang);
      const where = `${w}×${h} ${lang}`;
      let g = await geometry(page);
      const dockHeight = g.dockHeight;
      expect(dockHeight, `${where}: the piano shows at Half`).toBeGreaterThan(200);
      expect(g.pageScroll, `${where}: the page never scrolls`).toBeLessThanOrEqual(0);
      if (w === 1440) {
        // The audit's own screen: everything of the builder, nothing scrolled.
        expect(g.columnScroll, `${where}: the work column needs no scrolling`).toBeLessThanOrEqual(1);
        expect(whole(g.notes, g), `${where}: the 13 notes on screen`).toBe(true);
        expect(whole(g.readout, g), `${where}: the readout on screen`).toBe(true);
        console.log(`[q4] ${where} rest: ${Math.round(g.bottom - g.readout!.bottom)} px to spare under the readout`);
        expect(g.bottom - g.readout!.bottom, `${where}: room to spare (Linux draws text wider)`).toBeGreaterThanOrEqual(8);
      }
      await scrollReadoutIntoView(page);
      g = await geometry(page);
      expect(whole(g.readout, g), `${where}: before a chord, the readout can be scrolled wholly into view`).toBe(true);

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
    }
  });
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
