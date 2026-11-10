import { test, expect, type Browser, type Page } from '@playwright/test';
import fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';

/**
 * "Also show Dó, Ré, Mi" (wave 1, stream E). With the setting on in PT (and
 * ES), each listed surface shows the letter AND the fixed-do name — the key
 * summary, the staff strip's names, the dock read-out, the key picker's root
 * chips, the key facts — and passes the design audit (no text under 12 px, no
 * small targets, contrast, no sideways scroll, nothing cut off) plus a check
 * that no name overlaps another or a notehead, at 390 and 320 px. With it off
 * nothing differs from today. Screenshots: SOLFEGE_SHOTS=<dir>.
 */

const SHOTS = process.env.SOLFEGE_SHOTS;
type Lang = 'pt' | 'es';
const WIDTHS = [
  { name: '390', viewport: { width: 390, height: 844 }, theme: 'fermata' },
  { name: '390', viewport: { width: 390, height: 844 }, theme: 'fermata-night' },
  { name: '320', viewport: { width: 320, height: 640 }, theme: 'fermata' },
] as const;

function seed(lang: Lang | 'en', showSolfege: boolean | undefined, theme: 'fermata' | 'fermata-night' = 'fermata') {
  const state: Record<string, unknown> = {
    themeMode: theme, language: lang, lastView: 'explore', instrument: 'piano',
    selectedKey: { natural: 'D', accidental: '' }, selectedScale: 'major',
  };
  if (showSolfege !== undefined) state.showSolfege = showSolfege;
  return JSON.stringify({ state, version: 6 });
}

async function open(browser: Browser, viewport: { width: number; height: number }, blob: string, touch = true) {
  const context = await browser.newContext({ viewport, isMobile: touch, hasTouch: touch, reducedMotion: 'reduce' });
  await context.addInitScript((b) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', b);
    sessionStorage.setItem('__seeded', '1');
  }, blob);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.strip-staff .vf-notehead')).toHaveCount(8, { timeout: 15_000 });
  await page.waitForTimeout(500);
  return { context, page };
}

function expectClean(r: AuditResult, where: string) {
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: sideways page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
}

/** No two names overlap (in the strip: none overlaps another, and all stay in the label band below the staff; chips: none overlaps another). */
async function overlaps(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const hit = (a: DOMRect, b: DOMRect) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
    const textBox = (el: Element) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
    const labels = Array.from(document.querySelectorAll('.strip-col')).flatMap((col, i) =>
      Array.from(col.querySelectorAll('.strip-name, .strip-solfege, .strip-degree, .strip-fn')).map((el) => ({ i, el, box: el.getBoundingClientRect() })));
    // (Each name line is a flex item of its column: its box is its line box,
    // as wide as its text. A text range's box is the font's whole content
    // area, taller than the 1.2 line height, so stacked lines' ranges always
    // touch — on main too.)
    for (let a = 0; a < labels.length; a++) for (let b = a + 1; b < labels.length; b++) {
      if (labels[a].el.contains(labels[b].el) || labels[b].el.contains(labels[a].el)) continue;
      if (hit(labels[a].box, labels[b].box)) out.push(`strip: "${labels[a].el.textContent}" (${labels[a].i}) overlaps "${labels[b].el.textContent}" (${labels[b].i})`);
    }
    // Every name stays in the label band under the staff, below the staff's
    // drawn lines (a notehead's own box is the music font's whole em, ~160 px,
    // so the lines — ledger lines included — are what is measured).
    const room = document.querySelector('.strip-labels-room')?.getBoundingClientRect();
    const ink = Array.from(document.querySelectorAll('.strip-staff svg path, .strip-staff svg rect')).map((e) => e.getBoundingClientRect()).filter((b) => b.height < 40 && b.width > 0);
    const inkBottom = Math.max(...ink.map((b) => b.bottom));
    for (const l of labels) {
      if (room && (l.box.top < room.top - 1 || l.box.bottom > room.bottom + 0.5)) out.push(`strip: "${l.el.textContent}" outside the label band`);
      if (l.box.top < inkBottom - 0.5) out.push(`strip: "${l.el.textContent}" reaches into the staff`);
    }
    const chips = Array.from(document.querySelectorAll('[data-root].chip')).filter((c) => c.getClientRects().length > 0).map((c) => ({ c, box: c.getBoundingClientRect() }));
    for (let a = 0; a < chips.length; a++) for (let b = a + 1; b < chips.length; b++) if (hit(chips[a].box, chips[b].box)) out.push(`chips: ${chips[a].c.textContent} / ${chips[b].c.textContent}`);
    for (const { c, box } of chips) { const t = textBox(c); if (t.left < box.left - 0.5 || t.right > box.right + 0.5) out.push(`chip text outside its chip: ${c.textContent}`); }
    return out;
  });
}

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
}

const EXPECT: Record<Lang, { summary: string; strip: string[]; readout: RegExp; readoutNarrow: string; chip: string; fact: string; on: string; off: string }> = {
  pt: {
    summary: 'D (Ré) maior · 2♯ · relativa B (Si) menor',
    strip: ['DRé', 'EMi', 'F♯Fá♯', 'GSol', 'ALá', 'BSi', 'C♯Dó♯', 'DRé'],
    readout: /^F♯ \(Fá♯\) — mediante de D maior/,
    readoutNarrow: 'F♯ (Fá♯)',
    chip: 'F♯ Fá♯',
    fact: 'B (Si) menor',
    on: 'Mostrar também Dó, Ré, Mi',
    off: 'D maior · 2♯ · relativa B menor',
  },
  es: {
    summary: 'D (Re) mayor · 2♯ · relativa B (Si) menor',
    strip: ['DRe', 'EMi', 'F♯Fa♯', 'GSol', 'ALa', 'BSi', 'C♯Do♯', 'DRe'],
    readout: /^F♯ \(Fa♯\) — mediante de D mayor/,
    readoutNarrow: 'F♯ (Fa♯)',
    chip: 'F♯ Fa♯',
    fact: 'B (Si) menor',
    on: 'Mostrar también Do, Re, Mi',
    off: 'D mayor · 2♯ · relativa B menor',
  },
};

// In the order they are drawn (final review: a syllable drawn before its letter passed).
const stripNames = (page: Page) => page.locator('.strip-col').evaluateAll((cols) =>
  cols.map((c) => [...c.querySelectorAll('.strip-name, .strip-solfege')].map((e) => e.textContent ?? '').join('')));

for (const lang of ['pt', 'es'] as const) {
  for (const w of WIDTHS) {
    const tone = w.theme === 'fermata' ? 'day' : 'night';
    test(`${lang} ${w.name} px ${tone}: with the setting on, every listed surface shows both names and passes the design audit`, async ({ browser }) => {
      test.setTimeout(60_000);
      const e = EXPECT[lang];
      const { context, page } = await open(browser, w.viewport, seed(lang, true, w.theme));

      // Key summary + staff strip.
      await expect(page.getByTestId('key-summary')).toHaveText(e.summary);
      expect(await stripNames(page)).toEqual(e.strip);
      // Dock read-out: tap F♯ on the strip (it becomes the focus note).
      await page.locator('.strip-col[data-note="F#"]').click();
      // The read-out tries each wording with the fixed-do name, then without,
      // before a shorter one, so the name never pushes out the note's role.
      // At 390 px the role fits beside both names; at 320 px the bar has room
      // for the note alone — with the setting off too — and shows "F♯ (Fá♯)".
      const readout = page.getByTestId('dock-readout').locator('.dock-context-text');
      await expect(readout).toHaveText(w.name === '390' ? e.readout : e.readoutNarrow);
      console.log(`[solfege] ${lang} ${w.name} read-out: ${await readout.textContent()}`);
      expectClean(await auditPage(page, { minFontPx: 12, minTapPx: 44 }), `${lang}-${w.name} explore`);
      expect(await overlaps(page)).toEqual([]);
      await shot(page, `solfege-on-${lang}-${w.name}-explore-${tone}`);

      // The key picker's sheet: the root chips and the key facts.
      await page.getByTestId('key-picker').click();
      const sheet = page.getByTestId('key-sheet');
      await expect(sheet).toBeVisible();
      await expect(sheet.getByRole('radio', { name: e.chip })).toBeVisible();
      await expect(sheet.getByTestId('key-facts')).toContainText(e.fact);
      await page.waitForTimeout(400);
      // The circle's wedges in this sheet are under 44 px at 320 px wide with
      // the setting OFF too (16 of them, 37–47 px — main as it is, not this
      // setting: the circle is untouched). Exempted here, reported to the seat.
      expectClean(await auditPage(page, { minFontPx: 12, minTapPx: 44, tapExempt: '[data-testid="key-sheet"] svg g[role="button"]' }), `${lang}-${w.name} key sheet`);
      expect(await overlaps(page)).toEqual([]);
      await shot(page, `solfege-on-${lang}-${w.name}-key-sheet-${tone}`);
      await context.close();
    });
  }

  test(`${lang}: off (the default) nothing differs from today`, async ({ browser }) => {
    const e = EXPECT[lang];
    const read = async (blob: string) => {
      const { context, page } = await open(browser, { width: 390, height: 844 }, blob);
      await page.locator('.strip-col[data-note="F#"]').click();
      await page.waitForTimeout(700);
      const out = {
        summary: await page.getByTestId('key-summary').textContent(),
        strip: await stripNames(page),
        readout: await page.getByTestId('dock-readout').locator('.dock-context-text').textContent(),
        solfegeNodes: await page.locator('.strip-solfege, .chip-solfege').count(),
        stripHeight: await page.getByTestId('scale-strip').evaluate((el) => el.getBoundingClientRect().height),
      };
      await page.getByTestId('key-picker').click();
      const chips = await page.getByTestId('key-sheet').locator('[data-root].chip').allTextContents();
      const facts = await page.getByTestId('key-sheet').getByTestId('key-facts').textContent();
      await context.close();
      return { ...out, chips, facts };
    };
    const absent = await read(seed(lang, undefined));
    const off = await read(seed(lang, false));
    expect(off).toEqual(absent);
    expect(off.summary).toBe(e.off);
    expect(off.solfegeNodes).toBe(0);
    expect(off.strip).toEqual(['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯', 'D']);
  });
}

for (const v of [
  { name: 'laptop-1440x900', viewport: { width: 1440, height: 900 }, touch: false },
  { name: 'laptop-1440x900', viewport: { width: 1440, height: 900 }, touch: false, theme: 'fermata-night' },
  { name: 'landscape-844x390', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet-820x1180', viewport: { width: 820, height: 1180 }, touch: true },
] as const) {
  const theme = 'theme' in v ? v.theme : 'fermata';
  const tone = theme === 'fermata' ? 'day' : 'night';
  test(`pt ${v.name} ${tone}: with the setting on, the workbench passes the audit and nothing overlaps`, async ({ browser }) => {
    const { context, page } = await open(browser, v.viewport, seed('pt', true, theme), v.touch);
    await expect(page.getByTestId('key-summary')).toHaveText(EXPECT.pt.summary);
    await page.locator('.strip-col[data-note="F#"]').click();
    await page.waitForTimeout(500);
    expectClean(await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 }), `pt ${v.name}`);
    expect(await overlaps(page)).toEqual([]);
    if (v.name.startsWith('laptop')) {
      // The aside's key facts keep the letters alone: its narrow value column
      // would wrap "B (Si) menor" and push the last fact out of view.
      await expect(page.locator('.explore-aside [data-testid="key-facts"]')).toContainText('B menor');
      await expect(page.locator('.explore-aside [data-testid="key-facts"]')).not.toContainText('(Si)');
      const aside = await page.locator('.explore-aside').evaluate((el) => ({ sh: el.scrollHeight, ch: el.clientHeight }));
      expect(aside.sh, 'the circle column needs no scrolling').toBeLessThanOrEqual(aside.ch + 1);
      // At 1440×900 nothing scrolls (CLAUDE.md, the workbench): measured, not assumed.
      const scroll = await page.locator('.explore-main').evaluate((el) => ({ sh: el.scrollHeight, ch: el.clientHeight }));
      console.log(`[solfege] ${v.name} work column scrollHeight ${scroll.sh} / clientHeight ${scroll.ch}`);
      expect(scroll.sh).toBeLessThanOrEqual(scroll.ch + 1);
    }
    await shot(page, `solfege-on-pt-${v.name}-explore-${tone}`);
    await context.close();
  });
}

test('1440×900, PT and ES, piano and guitar: with the setting on, every chord in key still opens with no scroll in the work column', async ({ browser }) => {
  test.setTimeout(120_000);
  for (const lang of ['pt', 'es'] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      const results: Record<string, number> = {};
      for (const on of [false, true]) {
        const blob = JSON.stringify({ state: { ...JSON.parse(seed(lang, on)).state, instrument }, version: 6 });
        const { context, page } = await open(browser, { width: 1440, height: 900 }, blob, false);
        if (instrument === 'guitar') await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        const cards = page.locator('.chord-row button');
        let least = Infinity;
        for (let i = 0; i < (await cards.count()); i++) {
          await cards.nth(i).click();
          await expect(page.getByTestId('chord-detail')).toBeVisible();
          await page.waitForTimeout(150);
          const m = await page.locator('.explore-main').evaluate((el) => {
            const top = el.getBoundingClientRect().top + el.clientTop - el.scrollTop;
            const bottom = Math.max(...Array.from(el.children).map((c) => c.getBoundingClientRect().bottom + parseFloat(getComputedStyle(c).marginBottom))) - top;
            return { scroll: el.scrollHeight, client: el.clientHeight, headroom: el.clientHeight - parseFloat(getComputedStyle(el).paddingBottom) - bottom };
          });
          expect(m.scroll, `${lang} ${instrument} ${on ? 'on' : 'off'} chord ${i}: no scroll`).toBeLessThanOrEqual(m.client + 1);
          least = Math.min(least, m.headroom);
        }
        results[on ? 'on' : 'off'] = Math.round(least);
        await context.close();
      }
      console.log(`[solfege] 1440x900 ${lang} ${instrument}: least headroom off ${results.off} px, on ${results.on} px`);
      // The workbench keeps its 40 px safety margin (explore-workbench.spec): on a
      // laptop the strip's columns are wide, so the name sits beside the letter.
      expect(results.on, `${lang} ${instrument}: headroom with the setting on`).toBeGreaterThanOrEqual(40);
    }
  }
});

test('pt 320 px, off: the read-out has room for the note alone there too (the setting adds its name, removes nothing)', async ({ browser }) => {
  const { context, page } = await open(browser, { width: 320, height: 640 }, seed('pt', false));
  await page.locator('.strip-col[data-note="F#"]').click();
  await expect(page.getByTestId('dock-readout').locator('.dock-context-text')).toHaveText('F♯');
  await context.close();
});

test('pt: the setting in Settings → Language (on, off), and not offered in English', async ({ browser }) => {
  const { context, page } = await open(browser, { width: 390, height: 844 }, seed('pt', undefined));
  await page.getByTestId('app-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Definições' }).click();
  const chip = page.getByRole('button', { name: EXPECT.pt.on });
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('solfege-setting')).toContainText('(C = Dó)');
  await shot(page, 'solfege-settings-pt-390-day');
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  expectClean(await auditPage(page, { minFontPx: 12, minTapPx: 44 }), 'pt settings');
  await shot(page, 'solfege-settings-pt-390-on-day');
  await page.getByRole('radio', { name: 'English' }).click();
  await expect(page.getByTestId('solfege-setting')).toHaveCount(0);
  await context.close();
});
