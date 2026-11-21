import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The leftovers round, 21 November 2026 (builder E, "tight screens"): what
 * was left of the QA report's finding P5, "content is cut off at the bottom
 * of the screen with no sign that there is more", on the dev server and the
 * build alike, every row with this machine's text and with text 8 % wider
 * (letter-spacing 0.04em, roughly how GitHub's Linux draws it).
 *
 * E2. With the metronome's bar open, a chord chosen in Explore (In key 1–7,
 * All Chords, Build) at 1366×768, 1280×800, 1440×900 and 1536×864: the
 * chord's name and every control of its detail are in view, below what is
 * held at the top of the work column (the staff strip, where it is held),
 * clear of the bar and above the column's foot, with no scrolling by the
 * learner. At 57cda40 a held strip left 95–148 px above the bar for a detail
 * of 142–217 px: In key and All Chords left scale chips, "Learn about this"
 * or ▶ Arpeggio under the bar or below the fold (165 of 432 landings, the
 * builder's probe). Where both fit, the strip stays held (1440×900, 1536×864,
 * and the first chord of a visit at 1280×800); where they cannot, it scrolls
 * with the work for that chord, as Build's does (the owner's ruling of 19
 * November 2026), and only there: a strip let go is asserted to leave less
 * room than the detail needs.
 */

type Seed = Record<string, unknown>;
const WIDE_TEXT = '*, *::before, *::after { letter-spacing: 0.04em !important; }';
const TEXTS = [{ wide: false, label: '' }, { wide: true, label: ' (text 8 % wider)' }] as const;

async function open(browser: Browser, baseURL: string, opts: { w: number; h: number; touch?: boolean; state?: Seed; wide?: boolean }) {
  const context = await browser.newContext({
    viewport: { width: opts.w, height: opts.h }, isMobile: !!opts.touch, hasTouch: !!opts.touch,
    reducedMotion: 'reduce', serviceWorkers: 'block',
  });
  await context.addInitScript(({ blob, origin }) => {
    if (location.origin !== origin || sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('fermata-welcome-v1', 'seen');
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, { origin: new URL(baseURL).origin, blob: JSON.stringify({ state: {
    themeMode: 'fermata', language: 'en', lastView: 'explore', instrument: 'piano', baseOctave: 4,
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', guitarScalePosition: 0, ...opts.state,
  }, version: 6 }) });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  if (opts.state?.instrument === 'guitar') await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  if (opts.wide) await page.addStyleTag({ content: WIDE_TEXT });
  await settled(page);
  return { context, page };
}

/**
 * Wait until the columns, the dock or sheet, the detail and the bar keep their
 * sizes, places and scroll for three frames with no animation or transition
 * running (under reduced motion every property has a 0.01 ms transition, so a
 * restyled box can show its old size for a frame).
 */
async function settled(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    const read = () => ['.explore-main', '.explore-aside', '.explore-work', '[data-testid="instrument-dock"]', '.detent-content', '[data-testid="chord-detail"]', '[data-testid="metronome"]']
      .map((sel) => {
        const e = document.querySelector(sel);
        if (!e) return '-';
        const r = e.getBoundingClientRect();
        return `${e.clientHeight}/${e.scrollHeight}/${e.scrollTop}/${Math.round(r.top)}/${Math.round(r.left)}/${Math.round(r.height)}`;
      }).join('|') + (document.getAnimations().some((a) => a.playState === 'running') ? '|moving' : '');
    let last = read(); let same = 0; let frames = 0;
    const tick = () => { const now = read(); same = now === last ? same + 1 : 0; last = now; if (same >= 3 || ++frames > 180) resolve(); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
}

const WORDS = {
  en: { more: 'More', metronome: 'Metronome', all: 'All Chords', build: 'Build', strip: 'Chromatic strip from C' },
  pt: { more: 'Mais', metronome: 'Metrónomo', all: 'Todos os acordes', build: 'Construir', strip: 'Faixa cromática a partir de C' },
  es: { more: 'Más', metronome: 'Metrónomo', all: 'Todos los acordes', build: 'Construir', strip: 'Franja cromática desde C' },
} as const;

/**
 * After a landing: what of the detail is out of view (under the held strip, below the column's foot, under the bar, or
 * under the column's foot fade while it shows), whether the strip is held, the room a held strip leaves above the bar,
 * and where the fade is held: its sticky `bottom` offsets the column's bottom padding (the bar's room), so it stands at
 * the column's real foot — at 57cda40 it stood that padding above the foot, over a chord's formula and scales.
 */
type Landing = { held: boolean; hidden: string[]; detail: number; roomHeld: number; name: string; fadeOffset: number };
const landingState = (page: Page) => page.evaluate((): Landing => {
  const bar = document.querySelector('[data-testid="metronome"]')!.getBoundingClientRect();
  const main = document.querySelector<HTMLElement>('.explore-main')!;
  const m = main.getBoundingClientRect();
  const strip = main.querySelector<HTMLElement>(':scope > .strip-card')!;
  const held = getComputedStyle(strip).position === 'sticky';
  const viewTop = m.top + main.clientTop;
  const top = held ? strip.getBoundingClientRect().bottom : viewTop;
  const foot = viewTop + main.clientHeight;
  const detail = document.querySelector<HTMLElement>('[data-testid="chord-detail"]')!;
  const fade = getComputedStyle(main, '::after');
  const fadeOn = document.querySelector('.explore-work')!.hasAttribute('data-main-more-below') && Number(fade.opacity) > 0;
  const fadeTop = foot - (parseFloat(fade.height) || 0);
  const label = (el: Element) => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 24);
  const hidden: string[] = [];
  for (const el of Array.from(detail.querySelectorAll('.chord-detail-name, button, [role="radio"], .type-label, a'))) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.top < top - 0.5) hidden.push(`${label(el)}: under the held strip`);
    else if (r.bottom > foot + 0.5) hidden.push(`${label(el)}: below the column's foot`);
    else if (r.bottom > bar.top + 1 && r.top < bar.bottom - 1 && r.right > bar.left + 1 && r.left < bar.right - 1) hidden.push(`${label(el)}: under the bar`);
    else if (fadeOn && r.bottom > fadeTop + 0.5) hidden.push(`${label(el)}: under the column's foot fade`);
  }
  // A held strip stands at the column's top (its 2 px padding): the room it leaves above the bar, less the landing's 8 px on each side.
  const roomHeld = bar.top - (viewTop + 2 + strip.offsetHeight) - 16;
  const fadeOffset = parseFloat(fade.bottom) + parseFloat(getComputedStyle(main).paddingBottom);
  return { held, hidden, detail: detail.getBoundingClientRect().height, roomHeld, name: detail.querySelector('.chord-detail-name')!.textContent!.trim(), fadeOffset };
});

test.describe('E2: with the metronome\'s bar open, a chord\'s name and every control of its detail land in view', () => {
  for (const [w, h] of [[1366, 768], [1280, 800], [1440, 900], [1536, 864]] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      for (const language of ['en', 'pt', 'es'] as const) {
        for (const { wide, label: textLabel } of TEXTS) {
          test(`${w}×${h}, ${instrument}, ${language.toUpperCase()}${textLabel}: In key, All Chords and Build land in view; the strip held where both fit`, async ({ browser, baseURL }) => {
            test.setTimeout(120_000);
            const t = WORDS[language];
            const { context, page } = await open(browser, baseURL!, { w, h, wide, state: { instrument, language } });
            await page.getByRole('button', { name: new RegExp(`^${t.more}`) }).click();
            await page.getByRole('menuitem', { name: t.metronome }).click();
            await expect(page.getByTestId('metronome')).toHaveAttribute('data-measured', 'true');
            await settled(page);
            const land = async (what: string) => {
              await expect(page.getByTestId('chord-detail')).toBeVisible();
              await settled(page);
              await page.waitForTimeout(400); // a late re-landing (fonts, notation) comes within ~300 ms
              await settled(page);
              const r = await landingState(page);
              const where = `${w}×${h} ${instrument} ${language}${textLabel}, ${what} (${r.name})`;
              console.log(`[landing] ${where}: strip ${r.held ? 'held' : 'scrolls'}, detail ${r.detail.toFixed(0)} px, room under a held strip ${r.roomHeld.toFixed(0)} px${r.hidden.length ? `, out of view: ${r.hidden.join('; ')}` : ''}`);
              expect(r.hidden, `${where}: the chord's name and every control of its detail in view`).toEqual([]);
              expect(Math.abs(r.fadeOffset), `${where}: the column's foot fade held at its real foot, not the bar's room above it`).toBeLessThanOrEqual(0.5);
              // Let go only where a held strip could not leave the room the detail needs above the bar.
              if (!r.held && !what.startsWith('Build')) expect(r.detail, `${where}: the strip scrolls only where a held one leaves too little room`).toBeGreaterThan(r.roomHeld);
              // Where both fit, the strip stays held (Build under 900 px tall scrolls it by the owner's ruling of 19 November 2026).
              if (h >= 864 && !(what.startsWith('Build') && h < 900)) expect(r.held, `${where}: both fit here, so the strip stays held`).toBe(true);
              return r;
            };
            const top = async () => { await page.locator('.explore-main').evaluate((el) => { el.scrollTop = 0; }); await settled(page); };
            for (let i = 0; i < 7; i++) {
              await top();
              await page.locator('.chord-row button').nth(i).click();
              const r = await land(`In key ${i + 1}`);
              // Where both fit at 1280×800, the strip stays held: on the piano, In key 1 and 7 (186 px details, the chords
              // card's end in view under the held strip), the first chord of a visit included (the bar, still at the left
              // edge where nothing was in its way when the chord was chosen, moves to the right as the detail opens), and
              // In key 7, which fits only landed at the card's end (the landing's own first choice keeps the chord's row
              // with ▶ Chord and leaves the rest below the foot).
              if (w === 1280 && instrument === 'piano' && (i === 0 || i === 6)) expect(r.held, `In key ${i + 1} at 1280×800: both fit, the strip stays held`).toBe(true);
            }
            await top();
            await page.getByRole('tab', { name: t.all, exact: true }).click();
            await page.locator('[data-quality="minor"]').click();
            await land('All Chords, minor');
            await top();
            await page.getByRole('tab', { name: t.build, exact: true }).click();
            await page.getByRole('group', { name: t.strip }).getByRole('button').nth(4).click();
            await page.getByRole('group', { name: t.strip }).getByRole('button').nth(7).click();
            await land('Build, C major');
            // Back to In key: the work column back at its top, the strip held again.
            await page.getByRole('tab', { name: language === 'en' ? 'In key' : language === 'pt' ? 'Na tonalidade' : 'En la tonalidad', exact: true }).click();
            await settled(page);
            expect(await page.locator('.explore-main > .strip-card').evaluate((el) => getComputedStyle(el).position), 'In key again, no chord: the strip held').toBe('sticky');
            await context.close();
          });
        }
      }
    }
  }
});
