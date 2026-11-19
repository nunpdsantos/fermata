import { test, expect, type Browser, type Page } from '@playwright/test';
import { auditPage, type AuditResult } from './helpers/designAudit';
import { recordVoice, voiceLog } from './helpers/fakeMidi';

/**
 * Music audit 2 (18 November 2026), the Explore guitar in a real browser
 * (builder K):
 *  - M43: a grip offered for an asked bass has that bass lowest (C/E: every
 *    chip; no C shape x 3 2 0 1 0 under "1st Inv").
 *  - M44: a shape that leaves out a tone the chord's name carries says which
 *    ("This shape leaves out C (9)." under B♭m9 over B; C9 / E, the
 *    first round's case, has whole grips since the review fix pass).
 *  - M46: the Drop D notice names both pitches it cannot reach, and where.
 *  - M47: the arrow keys reach the open strings (and stop at a capo).
 *  - M48: a cell of the grip says it is the chord's and its finger.
 * The two notices are new or longer: the design rules (type, contrast,
 * nothing cut off, no sideways scroll) hold on them at 1440×900 and, in
 * PT and ES, at 390 and 320 px.
 */

type View = { w: number; h: number; touch: boolean };
const LAPTOP: View = { w: 1440, h: 900, touch: false };
const TAB_NECK = { neckNutSide: 'left', neckTopString: 'high' } as const;

async function open(browser: Browser, v: View, state: Record<string, unknown>, opts: { lang?: string; url?: string } = {}) {
  const context = await browser.newContext({ viewport: { width: v.w, height: v.h }, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({
    state: {
      language: opts.lang ?? 'en', lastView: 'explore', instrument: 'guitar', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
      ...(v.touch ? { dockDetents: { explore: 'full', learn: 'peek' }, dockChosen: { explore: true, learn: false } } : {}),
      ...state,
    },
    version: 6,
  }));
  const page = await context.newPage();
  await page.goto(opts.url ?? '/');
  await expect(page.locator('[role="grid"]').first()).toBeAttached({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

/** The page holds still (design-capo.spec.ts's settle: no animation, no opacity / transform change for 300 ms). */
async function settle(page: Page) {
  const snapshot = () => page.evaluate(() => {
    const running = document.getAnimations().filter((a) => a.playState === 'running' || a.pending).length;
    let sig = '';
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      const cs = getComputedStyle(el);
      if (cs.opacity !== '1' || cs.transform !== 'none') sig += `${cs.opacity}|${cs.transform};`;
    }
    return { running, sig };
  });
  const start = Date.now();
  let prev = await snapshot();
  let quietSince = Date.now();
  while (Date.now() - start < 5000) {
    await page.waitForTimeout(60);
    const now = await snapshot();
    if (now.running > 0 || now.sig !== prev.sig) quietSince = Date.now();
    prev = now;
    if (Date.now() - quietSince >= 300) return;
  }
  throw new Error('the page never stopped moving (5 s)');
}

function expectClean(r: AuditResult, where: string) {
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the sweep did not run`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
}

const OPEN_MIDI = [40, 45, 50, 55, 59, 64];
/** The grip on the board: each sounding string's pitch, from its dots. */
const gripMidis = (page: Page) => page.evaluate((open) =>
  Array.from(document.querySelectorAll<HTMLElement>('[role="grid"] [data-dot="voicing"]')).map((el) => open[Number(el.dataset.dotString)] + Number(el.dataset.dotFret)), OPEN_MIDI);
const live = (page: Page) => page.locator('[role="grid"] [aria-live]').first();

test.describe('M47: the arrow keys reach the open strings', () => {
  for (const [name, neck, toNut, away] of [
    ['the owner\'s neck (nut right)', {}, 'ArrowRight', 'ArrowLeft'],
    ['the tab view (nut left, thin string on top)', TAB_NECK, 'ArrowLeft', 'ArrowRight'],
  ] as const) {
    // What Enter does is seen on both servers: the note it plays stays the
    // pinned focus note once the keyboard leaves the board, where moving onto
    // the cell alone leaves nothing lit. Its SOUND is checked on the dev
    // server only (the voice is replaced through its modules); a build cannot
    // be listened to here.
    test(`${name}: from fret 1 toward the nut is the open string; Enter plays it (stays lit; heard on the dev server only); and back`, async ({ browser }) => {
      const { context, page } = await open(browser, LAPTOP, { guitarScalePosition: 'all', ...neck });
      try {
        const recording = await recordVoice(page);
        const grid = page.getByRole('grid', { name: 'Guitar fretboard' });
        await grid.focus();
        await page.keyboard.press('ArrowDown');
        const top = 'neckTopString' in neck ? 1 : 6;
        await expect(live(page)).toHaveText(new RegExp(`^String ${top}, fret 1, `));
        await page.keyboard.press(toNut);
        await expect(live(page)).toHaveText(`String ${top}, open, E`);
        const ring = page.locator('[data-open-string][data-keyboard-cell]');
        await expect(ring).toHaveCount(1);
        expect(await ring.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
        await page.keyboard.press(toNut); // nothing past the open string
        await expect(live(page)).toHaveText(`String ${top}, open, E`);
        const lit = page.locator('[role="grid"] [data-open-string][data-focus-note]');
        const leave = () => page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        // Not played yet: with the keyboard gone, nothing stays lit.
        await leave();
        await expect(lit).toHaveCount(0);
        await grid.focus();
        await expect(ring).toHaveCount(1);
        await page.keyboard.press('Enter');
        // Played as a tap plays it: the read-out names the open string…
        await expect(page.getByTestId('dock-readout')).toContainText(`string ${top} open`);
        // …and it stays lit, the pinned note, once the keyboard leaves.
        await leave();
        await expect(lit).toHaveCount(1);
        await expect(page.getByTestId('dock-readout')).toContainText(`string ${top} open`);
        await grid.focus();
        // …and, on the dev server, the voice is asked for that one pitch.
        if (recording) await expect.poll(async () => (await voiceLog(page)).filter((c) => c.op !== 'stop').map((c) => c.midi)).toEqual([top === 6 ? 40 : 64]);
        // All six strings, along the open column.
        const order = top === 6 ? [6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6];
        const names: Record<number, string> = { 6: 'E', 5: 'A', 4: 'D', 3: 'G', 2: 'B', 1: 'E' };
        for (const s of order.slice(1)) {
          await page.keyboard.press('ArrowDown');
          await expect(live(page)).toHaveText(`String ${s}, open, ${names[s]}`);
        }
        await page.keyboard.press(away);
        await expect(live(page)).toHaveText(new RegExp(`^String ${order[5]}, fret 1, `));
      } finally {
        await context.close();
      }
    });
  }

  test('with a capo the frets behind it stay out of play: toward the nut stops at the capo', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, { guitarScalePosition: 'all', capoFret: 2 });
    try {
      await page.getByRole('grid', { name: 'Guitar fretboard' }).focus();
      await page.keyboard.press('ArrowDown');
      for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
      await expect(live(page)).toHaveText(/^String 6, fret 2, at the capo, /);
      await expect(page.locator('[data-open-string][data-keyboard-cell]')).toHaveCount(0);
    } finally {
      await context.close();
    }
  });
});

test.describe('M48 and M43: what the grip says, and which grips an asked bass offers', () => {
  test('C major: a cell of the grip names its finger; open, muted and other cells', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, {}, { url: '/?chord=C&inst=guitar' });
    try {
      const grid = page.getByRole('grid', { name: 'Guitar fretboard' });
      await expect(grid.getByRole('button', { name: 'C, fret 3, string 5, in the chord, finger 3', exact: true })).toBeVisible();
      await expect(grid.getByRole('button', { name: 'G open string, in the chord', exact: true })).toBeVisible();
      await expect(grid.getByRole('button', { name: 'String 6 muted', exact: true })).toBeVisible();
      await expect(grid.getByRole('button', { name: 'F, fret 3, string 4', exact: true })).toBeVisible();
      await grid.focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await expect(live(page)).toHaveText('String 5, fret 3, C, in the chord, finger 3');
    } finally {
      await context.close();
    }
  });

  test('C/E (first inversion): every chip draws E lowest; the C shape is not among them', async ({ browser }) => {
    const { context, page } = await open(browser, LAPTOP, {}, { url: '/?chord=C&inv=1&inst=guitar' });
    try {
      const chips = page.getByRole('radiogroup', { name: 'Chord position' }).getByRole('radio');
      const n = await chips.count();
      expect(n).toBeGreaterThan(1);
      for (let i = 0; i < n; i++) {
        await chips.nth(i).click();
        await expect(chips.nth(i)).toHaveAttribute('aria-checked', 'true');
        const midis = await gripMidis(page);
        expect(Math.min(...midis) % 12, `chip ${i + 1}: ${await chips.nth(i).textContent()}`).toBe(4);
      }
      await expect(chips.filter({ hasText: /^C shape$/ })).toHaveCount(0);
    } finally {
      await context.close();
    }
  });
});

// ─── The two notices: their words, and the design rules on them ─────────────
const NOTICE_CASES = [
  // C9 / E has whole grips since the review fix pass (0 3 2 3 3 x first); B♭m9 over B has none.
  { name: 'B♭m9 over B', state: {}, url: '/?chord=Bbm9/B&inst=guitar', words: { en: 'This shape leaves out C (9).', pt: 'Esta forma deixa de fora C (9).', es: 'Esta forma deja fuera C (9).' } },
  {
    name: 'D major, Drop D, position XII', state: { selectedKey: { natural: 'D', accidental: '' }, guitarTuningId: 'drop-d', guitarScalePosition: 12 }, url: '/',
    words: {
      en: /so F♯3 and G3, between them, are out of the hand's reach in this position\. You will find them in position [IVX]+\./,
      pt: /por isso F♯3 e G3, entre elas, ficam fora do alcance da mão nesta posição\. Encontra-las na posição [IVX]+\./,
      es: /así que F♯3 y G3, entre ellas, quedan fuera del alcance de la mano en esta posición\. Las encuentras en la posición [IVX]+\./,
    },
  },
] as const;
const NOTICE_VIEWS: { lang: 'en' | 'pt' | 'es'; v: View }[] = [
  { lang: 'en', v: LAPTOP },
  { lang: 'pt', v: { w: 390, h: 844, touch: true } },
  { lang: 'es', v: { w: 390, h: 844, touch: true } },
  { lang: 'pt', v: { w: 320, h: 568, touch: true } },
  { lang: 'es', v: { w: 320, h: 568, touch: true } },
];
for (const c of NOTICE_CASES) {
  for (const { lang, v } of NOTICE_VIEWS) {
    test(`${c.name}, ${lang} ${v.w}×${v.h}: the notice reads whole and the board passes the design rules`, async ({ browser }) => {
      const { context, page } = await open(browser, v, c.state, { lang, url: c.url });
      try {
        const notice = page.getByRole('status').filter({ hasText: c.words[lang] });
        await expect(notice).toHaveCount(1);
        await notice.scrollIntoViewIfNeeded();
        await settle(page);
        const box = (await notice.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(v.w + 0.5);
        const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
        expectClean(r, `${c.name} ${lang} ${v.w}`);
      } finally {
        await context.close();
      }
    });
  }
}
