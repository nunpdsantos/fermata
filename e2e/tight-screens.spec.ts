import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * The leftovers round, 21 November 2026 (builder E, "tight screens"): what
 * was left of the QA report's finding P5, "content is cut off at the bottom
 * of the screen with no sign that there is more", on the dev server and the
 * build alike, under reduced motion AND ordinary motion, with this machine's
 * text and with text 8 % wider (letter-spacing 0.04em, roughly how GitHub's
 * Linux draws it).
 *
 * E2. With the metronome's bar open, a chord chosen in Explore at 1366×768,
 * 1280×800, 1440×900 and 1536×864: once the page has stopped moving, the
 * chord's name and every control of its detail are in view — below what is
 * held at the top of the work column (the staff strip, where it is held),
 * clear of the bar, above the column's foot and its foot fade — with no
 * scrolling by the learner; and the landings that got it there are few and
 * the last of them changed nothing (a layout that changes after a landing —
 * the card or the detail growing, a margin arriving a frame late under
 * reduced motion — is followed by a landing right for it, never a loop).
 *  - Every In key chord and Build at the four sizes; every one of All Chords'
 *    51 qualities at 1366×768 and 1280×800 (rows split by quality, not
 *    sampled) and its minor chord at the two taller sizes.
 *  - The strip is held where both fit and lets go only where they cannot,
 *    two-sided for the In key chords at the two short sizes: a brute force
 *    over every whole-pixel scroll of the column with the strip held (the
 *    bar where it would stand for each, the fade where it would show) finds
 *    a held offset exactly where the strip stayed held.
 *  - Both orders: the bar open, then a chord; a chord, then the bar opened
 *    (it lands again). One page walks bar open → a chord that lets the strip
 *    go → the bar closed (the strip held again at once, the detail landed as
 *    with no bar) → opened → a chord that fits → deselected → another tab and
 *    back.
 *  - Both columns' foot fades are measured where they are drawn (hit-tested
 *    against a spacer), with the bar and without, at the four sizes.
 *  - On the dev server: the landing's forecast of where the bar will stand
 *    (`barPlaceWith`) equals the bar's own place, within a pixel, in seven
 *    states, the start hint showing in two.
 * At 57cda40 a held strip left 95–148 px above the bar for a detail of
 * 142–217 px (In key and All Chords; Build already fitted), the work column's
 * fade stood the bar's room above the foot, over the detail, and a chord
 * chosen before the bar opened was never landed again.
 *
 * E3. The phone sheet (375×667, 390×844, 360×640) at Peek, Half and Full,
 * piano, guitar and guitar in Open G: where its content goes on below the
 * foot, Explore's fade shows there, ending in the sheet's own surface colour
 * (at 57cda40 the only sign was a 3 px line), and at Half it lies under the
 * last whole row, never over the fret
 * numbers; scrolled to the end, the last control is in view and the fade
 * goes. Where everything fits, no fade, and the sheet does not scroll; nor
 * does it by padding alone. (The owner's ruling, 21 November 2026, on the
 * before / after pictures: "i like all the changed ones better" — the
 * guitar's Half 28 px taller included.)
 */

type Seed = Record<string, unknown>;
const WIDE_TEXT = '*, *::before, *::after { letter-spacing: 0.04em !important; }';
const TEXTS = [{ wide: false, label: '' }, { wide: true, label: ' (text 8 % wider)' }] as const;
const MOTIONS = [{ motion: 'reduce', label: '' }, { motion: 'no-preference', label: ', ordinary motion' }] as const;
type Motion = (typeof MOTIONS)[number]['motion'];
/**
 * The landings one choice brings, and the frames in which the column moves.
 * The code lands at most five times in a row for one cause (a choice, a size
 * changed, the bar opened or closed); a choice can bring several causes (the
 * detail opening, then the card's margin a frame late, then the bar moving
 * off it), so the count is bounded by what this spec measures, with a margin:
 * in its run of 21 November 2026 (third pass, dev server, this Mac), at most
 * 9 landings (once in 3,484; 7 or fewer in all but 2) and 3 frames moving
 * the column for one choice, bounded at 9 + 2 and 3 + 1.
 */
const MOST_LANDINGS = 11;
const MOST_MOVES = 4;

type Landed = { before: number; after: number; target: number };
/** The landings since counting began (where each found the column, where it left it, where it asked it to be), and the frames in which the column moved. */
type LandWindow = { __lands?: Landed[]; __moved?: number };
/** Start counting landings, and frames in which the column moves, afresh. */
const countLandings = (page: Page) => page.evaluate(() => { const w = window as unknown as LandWindow; w.__lands = []; w.__moved = 0; });

async function open(browser: Browser, baseURL: string, opts: { w: number; h: number; touch?: boolean; state?: Seed; wide?: boolean; motion?: Motion }) {
  const context = await browser.newContext({
    viewport: { width: opts.w, height: opts.h }, isMobile: !!opts.touch, hasTouch: !!opts.touch,
    reducedMotion: opts.motion ?? 'reduce', serviceWorkers: 'block',
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
  // Every landing scrolls the work column with scrollTo: counted, with where each left it.
  await context.addInitScript(() => {
    const proto = Element.prototype as unknown as { scrollTo: (...a: unknown[]) => void };
    const original = proto.scrollTo;
    proto.scrollTo = function (this: Element, ...a: unknown[]) {
      const before = this.scrollTop;
      original.apply(this, a);
      const top = (a[0] as { top?: number } | undefined)?.top ?? NaN;
      if (this.classList.contains('explore-main')) ((window as unknown as LandWindow).__lands ??= []).push({ before, after: this.scrollTop, target: top });
    };
    // Every frame: did the work column move since the last one?
    let last = NaN;
    const watch = () => {
      const main = document.querySelector('.explore-main');
      const now = main ? main.scrollTop : NaN;
      if (Number.isFinite(last) && Number.isFinite(now) && Math.abs(now - last) >= 0.5) {
        const w = window as unknown as LandWindow;
        w.__moved = (w.__moved ?? 0) + 1;
      }
      last = now;
      requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  });
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
 * Wait until the columns, the chords card, the detail, the bar and the dock
 * keep their sizes, places and scroll, and no landing comes, for eight frames
 * with no animation or transition running (under reduced motion every
 * property has a 0.01 ms transition: a restyled box shows its old size for a
 * frame; with ordinary motion the bar glides 0.2 s and the detail fades in).
 */
async function settled(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    const read = () => ['.explore-main', '.explore-aside', '.chords-card', '[data-testid="chord-detail"]', '[data-testid="metronome"]', '[data-testid="instrument-dock"]']
      .map((sel) => {
        const e = document.querySelector(sel);
        if (!e) return '-';
        const r = e.getBoundingClientRect();
        return `${e.clientHeight}/${e.scrollHeight}/${e.scrollTop}/${Math.round(r.top)}/${Math.round(r.left)}/${Math.round(r.height * 10)}`;
      }).join('|') + `|${((window as unknown as LandWindow).__lands ?? []).length}` + (document.getAnimations().some((a) => a.playState === 'running') ? '|moving' : '');
    let last = read(); let same = 0; let frames = 0;
    const tick = () => { const now = read(); same = now === last ? same + 1 : 0; last = now; if (same >= 8 || ++frames > 360) resolve(); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
}
async function landed(page: Page) {
  await settled(page);
  await page.waitForTimeout(250); // the bar's glide and the detail's fade-in, with ordinary motion
  await settled(page);
}

const WORDS = {
  en: { more: 'More', metronome: 'Metronome', inKey: 'In key', all: 'All Chords', build: 'Build', strip: 'Chromatic strip from C' },
  pt: { more: 'Mais', metronome: 'Metrónomo', inKey: 'Na tonalidade', all: 'Todos os acordes', build: 'Construir', strip: 'Faixa cromática a partir de C' },
  es: { more: 'Más', metronome: 'Metrónomo', inKey: 'En la tonalidad', all: 'Todos los acordes', build: 'Construir', strip: 'Franja cromática desde C' },
} as const;
type Lang = keyof typeof WORDS;

/** All Chords' 51 qualities, by the category chip that shows them (ChordBrowser's CHORD_QUALITY_GROUPS). */
const CATEGORIES = [
  ['major', 'minor', 'diminished', 'augmented'],
  ['major6', 'minor6', 'six_nine', 'minor_six_nine'],
  ['major7', 'minor7', 'dominant7', 'diminished7', 'half_diminished7', 'augmented7', 'minor_major7', 'augmented_major7', 'major7flat5', 'diminished_major7'],
  ['sus2', 'sus4', 'dominant7sus4', 'dominant9sus4', 'sus2sus4'],
  ['power'],
  ['major9', 'minor9', 'dominant9', 'add9', 'minor_add9'],
  ['dominant7flat9', 'dominant7sharp9', 'dominant7flat5', 'dominant7sharp5', 'dominant7alt', 'dominant7sharp5flat9', 'dominant7flat5flat9', 'dominant7sharp5sharp9', 'dominant7flat5sharp9', 'dominant7flat13'],
  ['dominant11', 'major11', 'minor11', 'dominant9sharp11', 'dominant7sharp11', 'add11', 'major7sharp11', 'major9sharp11'],
  ['dominant13', 'major13', 'minor13', 'dominant13flat9'],
];
const QUALITIES = CATEGORIES.flatMap((qs, category) => qs.map((quality) => ({ quality, category })));
/** All Chords' rows at the short sizes: the 51 in three parts of 17, every one asserted. */
const PARTS = [QUALITIES.slice(0, 17), QUALITIES.slice(17, 34), QUALITIES.slice(34)];

async function openBar(page: Page, lang: Lang) {
  const t = WORDS[lang];
  await page.getByRole('button', { name: new RegExp(`^${t.more}`) }).click();
  await page.getByRole('menuitem', { name: t.metronome }).click();
  await expect(page.getByTestId('metronome')).toHaveAttribute('data-measured', 'true');
}
/** ✕, the bar's last button. */
async function closeBar(page: Page) {
  await page.getByTestId('metronome').getByRole('button').last().click();
  await expect(page.getByTestId('metronome')).toHaveCount(0);
}
const toTop = async (page: Page) => { await page.locator('.explore-main').evaluate((el) => { el.scrollTop = 0; }); await settled(page); };
/**
 * A chord card, chosen with a dispatched click: with no chord chosen the bar
 * may stand over the cards (a learner would scroll first), and the landing
 * is then always measured from the column's top. Landings counted afresh.
 */
async function choose(page: Page, selector: string) {
  await countLandings(page);
  await page.locator(selector).dispatchEvent('click');
}

/**
 * After a landing: what of the detail is out of view (under the held strip,
 * below the column's foot, under the bar, or under the column's foot fade
 * where it is drawn while it shows), whether the strip is held, the room a
 * held strip leaves above the bar, the fade's offset from the column's real
 * foot, and the landings: how many, and whether the last changed nothing.
 */
type Landing = { held: boolean; attr: boolean; hidden: string[]; detail: number; roomHeld: number; name: string; fadeOffset: number; lands: number; lastNoop: boolean; moved: number; short: number };
const landingState = (page: Page) => page.evaluate((): Landing => {
  const bar = document.querySelector('[data-testid="metronome"]')?.getBoundingClientRect() ?? null;
  const main = document.querySelector<HTMLElement>('.explore-main')!;
  const m = main.getBoundingClientRect();
  const strip = main.querySelector<HTMLElement>(':scope > .strip-card')!;
  const held = getComputedStyle(strip).position === 'sticky';
  const viewTop = m.top + main.clientTop;
  const top = held ? strip.getBoundingClientRect().bottom : viewTop;
  const foot = viewTop + main.clientHeight;
  const detail = document.querySelector<HTMLElement>('[data-testid="chord-detail"]')!;
  const fade = getComputedStyle(main, '::after');
  const pad = parseFloat(getComputedStyle(main).paddingBottom) || 0;
  const fadeOn = document.querySelector('.explore-work')!.hasAttribute('data-main-more-below') && Number(fade.opacity) > 0;
  // Sticky inside the column's bottom padding: drawn `bottom` above the padding's top.
  const fadeBottom = foot - pad - (parseFloat(fade.bottom) || 0);
  const fadeTop = fadeBottom - (parseFloat(fade.height) || 0);
  const label = (el: Element) => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 24);
  const hidden: string[] = [];
  for (const el of Array.from(detail.querySelectorAll('.chord-detail-name, button, [role="radio"], .type-label, a'))) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.top < top - 0.5) hidden.push(`${label(el)}: under the held strip`);
    else if (r.bottom > foot + 0.5) hidden.push(`${label(el)}: below the column's foot`);
    else if (bar && r.bottom > bar.top + 1 && r.top < bar.bottom - 1 && r.right > bar.left + 1 && r.left < bar.right - 1) hidden.push(`${label(el)}: under the bar`);
    else if (fadeOn && r.bottom > fadeTop + 0.5 && r.top < fadeBottom - 0.5) hidden.push(`${label(el)}: under the column's foot fade`);
  }
  const roomHeld = bar ? bar.top - (viewTop + 2 + strip.offsetHeight) - 16 : Infinity;
  // The last landing changed nothing: it found the column where it left it, and the column is still there. (Not "where the
  // landing before it left it": the browser's scroll anchoring keeps the detail in place when the card grows above it.)
  const lands = (window as unknown as LandWindow).__lands ?? [];
  const last = lands[lands.length - 1];
  const lastNoop = !last || (Math.abs(last.after - last.before) < 0.5 && Math.abs(last.after - main.scrollTop) < 0.5);
  // How far the column ended from where the last landing asked it to be (0 with no landing).
  const short = last && Number.isFinite(last.target) ? Math.abs(main.scrollTop - last.target) : 0;
  return {
    held, attr: main.hasAttribute('data-strip-scrolls'), hidden, detail: detail.getBoundingClientRect().height, roomHeld,
    name: detail.querySelector('.chord-detail-name')!.textContent!.trim(), fadeOffset: fadeBottom - foot, lands: lands.length, lastNoop,
    moved: (window as unknown as LandWindow).__moved ?? 0, short,
  };
});

/**
 * The oracle for "held where both fit": with the strip held, every whole-pixel
 * scroll of the work column (no scrolling done: boxes shifted), the bar where
 * it would stand for each (the left edge, the right edge or the centre: the
 * first that misses the detail's box, else the least overlap — the bar's own
 * rule, written out here), the column's fade wherever items would go on
 * below its foot (by the app's rule, within a pixel counting as showing).
 * Is there a scroll that leaves the chord's name and every control in view?
 */
const heldOffsetExists = (page: Page) => page.evaluate(() => {
  const main = document.querySelector<HTMLElement>('.explore-main')!;
  const s = main.getBoundingClientRect();
  const strip = main.querySelector<HTMLElement>(':scope > .strip-card')!;
  const detail = document.querySelector<HTMLElement>('[data-testid="chord-detail"]')!;
  const viewTop = s.top + main.clientTop;
  const foot = viewTop + main.clientHeight;
  const heldBottom = viewTop + (parseFloat(getComputedStyle(main).paddingTop) || 0) + strip.offsetHeight;
  const bar = document.querySelector<HTMLElement>('[data-testid="metronome"]')!;
  const bw = bar.offsetWidth, bh = bar.offsetHeight;
  const barTop = document.querySelector('[data-testid="instrument-dock"]')!.getBoundingClientRect().top - 8 - bh;
  const lefts = [...new Set([12, Math.round(innerWidth - 12 - bw), Math.round((innerWidth - bw) / 2)])];
  const parts = Array.from(detail.querySelectorAll('.chord-detail-name, button, [role="radio"], .type-label, a')).map((el) => el.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
  const d = detail.getBoundingClientRect();
  const lowest = Math.max(...Array.from(main.children).map((c) => c.getBoundingClientRect().bottom));
  const at = main.scrollTop;
  for (let y = 0; y <= at + 800; y++) {
    const shift = at - y;
    const top = d.top + shift, bottom = d.bottom + shift;
    let left = lefts[0], least = Infinity;
    for (const l of lefts) {
      const area = Math.max(0, Math.min(l + bw, d.right) - Math.max(l, d.left)) * Math.max(0, Math.min(barTop + bh, bottom) - Math.max(barTop, top));
      if (area === 0) { left = l; break; }
      if (area < least) { least = area; left = l; }
    }
    const end = lowest + shift > foot ? foot - 28 : foot;
    const fits = parts.every((r) => {
      const t = r.top + shift, b = r.bottom + shift;
      const underBar = b > barTop + 1 && t < barTop + bh - 1 && r.right > left + 1 && r.left < left + bw - 1;
      return t >= heldBottom - 0.5 && b <= end + 0.5 && !underBar;
    });
    if (fits) return { exists: true, at: y };
  }
  return { exists: false, at: null as number | null };
});

/** The assertions every landing with the bar open meets (on Build under 900 px tall the strip scrolls by the owner's ruling, with no attribute). */
function checkLanding(r: Landing, where: string, build = false) {
  console.log(`[landing] ${where} (${r.name}): strip ${r.held ? 'held' : 'scrolls'}, detail ${r.detail.toFixed(0)} px, ${r.lands} landings, ${r.moved} frames moving${r.hidden.length ? `, out of view: ${r.hidden.join('; ')}` : ''}`);
  expect(r.hidden, `${where}: the chord's name and every control of its detail in view`).toEqual([]);
  expect(Math.abs(r.fadeOffset), `${where}: the column's foot fade drawn at its real foot, not the bar's room above it`).toBeLessThanOrEqual(0.5);
  if (build) expect(r.attr, `${where}: Build: the strip goes by the ruling's own rule, never this attribute`).toBe(false);
  else expect(r.attr, `${where}: the attribute and the strip agree`).toBe(!r.held);
  expect(r.lands, `${where}: a landing and few after it (${r.lands})`).toBeLessThanOrEqual(MOST_LANDINGS);
  expect(r.moved, `${where}: the column moved in few frames (${r.moved})`).toBeLessThanOrEqual(MOST_MOVES);
  expect(r.lastNoop, `${where}: the last landing changed nothing`).toBe(true);
  // Where the last landing asked it to be (the review saw 310 for 343.3 under reduced motion: its tail arrived late).
  expect(r.short, `${where}: the column where the last landing asked it to be`).toBeLessThanOrEqual(1);
}

test.describe('E2: with the bar open, In key and Build land in view; the strip held exactly where both fit', () => {
  for (const [w, h] of [[1366, 768], [1280, 800], [1440, 900], [1536, 864]] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      for (const language of ['en', 'pt', 'es'] as const) {
        for (const { wide, label: textLabel } of TEXTS) {
          for (const { motion, label: motionLabel } of MOTIONS) {
            test(`${w}×${h}, ${instrument}, ${language.toUpperCase()}${textLabel}${motionLabel}: In key 1–7, All Chords' minor and Build`, async ({ browser, baseURL }) => {
              test.setTimeout(150_000);
              const t = WORDS[language];
              const { context, page } = await open(browser, baseURL!, { w, h, wide, motion, state: { instrument, language } });
              await openBar(page, language);
              await settled(page);
              const short = h < 864;
              for (let i = 0; i < 7; i++) {
                await toTop(page);
                await choose(page, `.chord-row button >> nth=${i}`);
                await landed(page);
                const where = `${w}×${h} ${instrument} ${language}${textLabel}${motionLabel}, In key ${i + 1}`;
                const r = await landingState(page);
                checkLanding(r, where);
                if (short) {
                  // Two-sided: held exactly where a held scroll exists.
                  const o = await heldOffsetExists(page);
                  expect(r.held, `${where}: the strip is held exactly where a scroll with it held keeps everything in view (brute force: ${o.exists ? `scroll ${o.at}` : 'none'})`).toBe(o.exists);
                } else {
                  expect(r.held, `${where}: both fit here, the strip held`).toBe(true);
                }
                if (!r.held) expect(r.detail, `${where}: let go only where a held strip leaves less room than the detail needs above the bar`).toBeGreaterThan(r.roomHeld);
              }
              await toTop(page);
              await page.getByRole('tab', { name: t.all, exact: true }).click();
              await settled(page);
              await choose(page, '[data-quality="minor"]');
              await landed(page);
              const all = await landingState(page);
              checkLanding(all, `${w}×${h} ${instrument} ${language}${textLabel}${motionLabel}, All Chords minor`);
              if (!short) expect(all.held, `${w}×${h}: both fit here, the strip held`).toBe(true);
              await toTop(page);
              await page.getByRole('tab', { name: t.build, exact: true }).click();
              await settled(page);
              await countLandings(page);
              await page.getByRole('group', { name: t.strip }).getByRole('button').nth(4).dispatchEvent('click');
              await page.getByRole('group', { name: t.strip }).getByRole('button').nth(7).dispatchEvent('click');
              await landed(page);
              const build = await landingState(page);
              checkLanding(build, `${w}×${h} ${instrument} ${language}${textLabel}${motionLabel}, Build C major`, true);
              // Build under 900 px tall scrolls the strip by the owner's ruling of 19 November 2026; at 1440×900 both fit.
              if (h >= 900) expect(build.held, `${w}×${h}: both fit here, the strip held on Build`).toBe(true);
              // Back to In key: the column at its top, the strip held again.
              await page.getByRole('tab', { name: t.inKey, exact: true }).click();
              await settled(page);
              expect(await page.locator('.explore-main > .strip-card').evaluate((el) => getComputedStyle(el).position), 'In key again, no chord: the strip held').toBe('sticky');
              await context.close();
            });
          }
        }
      }
    }
  }
});

test.describe('E2: with the bar open, every All Chords quality lands in view at the two short sizes', () => {
  for (const [w, h] of [[1366, 768], [1280, 800]] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      for (const language of ['en', 'pt', 'es'] as const) {
        for (const { wide, label: textLabel } of TEXTS) {
          for (const { motion, label: motionLabel } of MOTIONS) {
            PARTS.forEach((part, p) => {
              test(`${w}×${h}, ${instrument}, ${language.toUpperCase()}${textLabel}${motionLabel}: All Chords, qualities ${p * 17 + 1}–${p * 17 + part.length} of 51`, async ({ browser, baseURL }) => {
                test.setTimeout(150_000);
                const t = WORDS[language];
                const { context, page } = await open(browser, baseURL!, { w, h, wide, motion, state: { instrument, language } });
                await openBar(page, language);
                await page.getByRole('tab', { name: t.all, exact: true }).click();
                await settled(page);
                let shown = 0;
                for (const { quality, category } of part) {
                  await toTop(page);
                  if (category !== shown) {
                    await page.getByRole('radiogroup', { name: t.all }).getByRole('radio').nth(category).dispatchEvent('click');
                    shown = category;
                    await settled(page);
                  }
                  await choose(page, `[data-quality="${quality}"]`);
                  await landed(page);
                  checkLanding(await landingState(page), `${w}×${h} ${instrument} ${language}${textLabel}${motionLabel}, All Chords ${quality}`);
                }
                await context.close();
              });
            });
          }
        }
      }
    }
  }
});

test.describe('E2: a chord chosen first, then the bar opened: the detail lands again, in view; closed, the strip held', () => {
  for (const [w, h] of [[1366, 768], [1280, 800]] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      for (const { wide, label: textLabel } of TEXTS) {
        for (const { motion, label: motionLabel } of MOTIONS) {
          test(`${w}×${h}, ${instrument}, EN${textLabel}${motionLabel}: In key 1–7 and three of All Chords, each before the bar`, async ({ browser, baseURL }) => {
            test.setTimeout(150_000);
            const { context, page } = await open(browser, baseURL!, { w, h, wide, motion, state: { instrument } });
            const each = async (where: string) => {
              await landed(page);
              await countLandings(page);
              await openBar(page, 'en');
              await landed(page);
              const r = await landingState(page);
              checkLanding(r, `${where}, then the bar`);
              await closeBar(page);
              await landed(page);
              const closed = await landingState(page);
              expect(closed.attr || !closed.held, `${where}, the bar closed: the strip held again`).toBe(false);
            };
            for (let i = 0; i < 7; i++) {
              await toTop(page);
              await choose(page, `.chord-row button >> nth=${i}`);
              await each(`${w}×${h} ${instrument}${textLabel}${motionLabel}, In key ${i + 1}`);
            }
            await toTop(page);
            await page.getByRole('tab', { name: 'All Chords', exact: true }).click();
            await settled(page);
            for (const { quality, category } of [QUALITIES[2], QUALITIES[14], QUALITIES[49]]) {
              await toTop(page);
              await page.getByRole('radiogroup', { name: 'All Chords' }).getByRole('radio').nth(category).dispatchEvent('click');
              await settled(page);
              await choose(page, `[data-quality="${quality}"]`);
              await each(`${w}×${h} ${instrument}${textLabel}${motionLabel}, All Chords ${quality}`);
            }
            await context.close();
          });
        }
      }
    }
  }
});

test.describe('E2: the strip goes exactly while the bar is open and the detail cannot fit with it held (one page, step by step)', () => {
  for (const { motion, label: motionLabel } of MOTIONS) {
    test(`1280×800, piano, EN${motionLabel}: bar open → In key 3 → bar closed → opened → the window wider and back → In key 1 → In key 3 again → deselected → another tab and back`, async ({ browser, baseURL }) => {
      test.setTimeout(120_000);
      const { context, page } = await open(browser, baseURL!, { w: 1280, h: 800, motion });
      const strip = () => page.locator('.explore-main > .strip-card').evaluate((el) => getComputedStyle(el).position);
      const attr = () => page.locator('.explore-main').evaluate((el) => el.hasAttribute('data-strip-scrolls'));
      const scroll = () => page.locator('.explore-main').evaluate((el) => el.scrollTop);
      // In view as with no bar (the landing at 57cda40): the name and ▶ Chord / ▶ Arpeggio in view, nothing under the held strip.
      const noBarInView = () => page.evaluate(() => {
        const main = document.querySelector<HTMLElement>('.explore-main')!;
        const m = main.getBoundingClientRect();
        const strip = main.querySelector('.strip-card')!.getBoundingClientRect();
        const foot = m.top + main.clientTop + main.clientHeight;
        const detail = document.querySelector('[data-testid="chord-detail"]')!;
        const parts = [detail.querySelector('.chord-detail-name')!, ...Array.from(detail.querySelectorAll('.chord-detail-actions button'))];
        return parts.filter((el) => { const r = el.getBoundingClientRect(); return r.top < strip.bottom - 0.5 || r.bottom > foot + 0.5; }).map((el) => el.textContent!.trim());
      });

      await openBar(page, 'en');
      await settled(page);
      await choose(page, '.chord-row button >> nth=2');
      await landed(page);
      let r = await landingState(page);
      checkLanding(r, `1. bar open, In key 3${motionLabel}`);
      expect([r.attr, await strip()], '1. In key 3 cannot fit with the strip held: it scrolls with the work').toEqual([true, 'static']);
      const firstAt = await scroll();

      await closeBar(page);
      expect([await attr(), await strip()], '2. the bar closed: the strip held again at once').toEqual([false, 'sticky']);
      await landed(page);
      expect(await noBarInView(), '2. landed as with no bar').toEqual([]);
      const closedAt = await scroll();

      await countLandings(page);
      await openBar(page, 'en');
      await landed(page);
      r = await landingState(page);
      checkLanding(r, `3. the bar opened again${motionLabel}`);
      expect([r.attr, await strip()], '3. opened again: In key 3 cannot fit held, the strip goes again').toEqual([true, 'static']);

      // The decision is made afresh at every landing: the window made wider (1440×900, where both fit) holds the strip; back, it goes again.
      await countLandings(page);
      await page.setViewportSize({ width: 1440, height: 900 });
      await landed(page);
      r = await landingState(page);
      checkLanding(r, `3a. the window widened to 1440×900, the bar open${motionLabel}`);
      expect([r.attr, await strip()], '3a. at 1440×900 both fit: the strip held again').toEqual([false, 'sticky']);
      await countLandings(page);
      await page.setViewportSize({ width: 1280, height: 800 });
      await landed(page);
      r = await landingState(page);
      checkLanding(r, `3b. back to 1280×800${motionLabel}`);
      expect([r.attr, await strip()], '3b. back at 1280×800: the strip goes again').toEqual([true, 'static']);

      await toTop(page);
      await choose(page, '.chord-row button >> nth=0');
      await landed(page);
      r = await landingState(page);
      checkLanding(r, `4. In key 1${motionLabel}`);
      expect([r.attr, await strip()], '4. In key 1 fits with the strip held: held').toEqual([false, 'sticky']);

      // A chord lands where it lands, wherever the bar stood: In key 3 first came with the bar at the left edge (nothing in its way), now after In key 1.
      await toTop(page);
      await choose(page, '.chord-row button >> nth=2');
      await landed(page);
      r = await landingState(page);
      checkLanding(r, `4a. In key 3 again${motionLabel}`);
      expect(Math.abs((await scroll()) - firstAt), `4a. In key 3 lands at ${await scroll()}, as when it was the first chord of the visit (${firstAt})`).toBeLessThanOrEqual(1);
      await toTop(page);
      await choose(page, '.chord-row button >> nth=0');
      await landed(page);

      await page.locator('.chord-row button').nth(0).dispatchEvent('click');
      await settled(page);
      await expect(page.getByTestId('chord-detail')).toHaveCount(0);
      expect([await attr(), await strip()], '5. deselected: held').toEqual([false, 'sticky']);

      await page.getByRole('tab', { name: 'All Chords', exact: true }).click();
      await settled(page);
      await page.getByRole('tab', { name: 'In key', exact: true }).click();
      await settled(page);
      expect([await attr(), await strip()], '6. another tab and back: held').toEqual([false, 'sticky']);

      // Step 2 landed as a fresh choice of In key 3 lands with no bar.
      await closeBar(page);
      await toTop(page);
      await choose(page, '.chord-row button >> nth=2');
      await landed(page);
      expect(Math.abs((await scroll()) - closedAt), `2. the bar closed with In key 3 kept: the column at ${closedAt}, as In key 3 chosen with no bar (${await scroll()})`).toBeLessThanOrEqual(1);
      expect([await attr(), await strip()], '7. no bar: held').toEqual([false, 'sticky']);
      await context.close();
    });
  }
});

test.describe('E2: both columns\' foot fades are drawn at their real foot, with the bar and without', () => {
  for (const [w, h] of [[1366, 768], [1280, 800], [1440, 900], [1536, 864]] as const) {
    for (const withBar of [true, false]) {
      test(`${w}×${h}, ${withBar ? 'the bar open' : 'no bar'}: the work column's and the circle column's fades, hit-tested against a spacer`, async ({ browser, baseURL }) => {
        const { context, page } = await open(browser, baseURL!, { w, h });
        if (withBar) await openBar(page, 'en');
        await settled(page);
        // Each fade made hittable (it changes no layout) and each column given real content below its foot: a spacer, scrolled so it covers the foot.
        await page.addStyleTag({ content: '.explore-main::after, .explore-aside::after { pointer-events: auto !important; }' });
        for (const sel of ['.explore-main', '.explore-aside']) {
          await page.locator(sel).evaluate((col) => {
            const spacer = document.createElement('div');
            spacer.setAttribute('data-test-spacer', '');
            spacer.style.cssText = 'height: 1200px; flex: none;';
            col.appendChild(spacer);
            col.scrollTop = spacer.offsetTop - col.clientHeight + 200;
          });
        }
        await settled(page);
        for (const sel of ['.explore-main', '.explore-aside']) {
          const m = await page.locator(sel).evaluate((col) => {
            const r = col.getBoundingClientRect();
            const foot = r.top + col.clientTop + col.clientHeight;
            const bar = document.querySelector('[data-testid="metronome"]')?.getBoundingClientRect();
            // An x in the column that the bar does not cover.
            const xs = [r.left + 10, r.right - 10, (r.left + r.right) / 2];
            const x = xs.find((v) => !bar || v < bar.left - 2 || v > bar.right + 2)!;
            const ys: number[] = [];
            for (let y = Math.floor(foot - 60); y <= Math.ceil(foot + 4); y++) if (document.elementFromPoint(x, y + 0.5) === col) ys.push(y);
            return { foot, top: ys.length ? Math.min(...ys) : null, bottom: ys.length ? Math.max(...ys) + 1 : null, more: col.closest('.explore-work')!.getAttribute(col.classList.contains('explore-main') ? 'data-main-more-below' : 'data-aside-more-below') !== null };
          });
          const where = `${w}×${h} ${withBar ? 'with the bar' : 'no bar'}, ${sel === '.explore-main' ? 'work column' : 'circle column'}`;
          console.log(`[fade] ${where}: foot ${m.foot.toFixed(1)}, fade drawn ${m.top}–${m.bottom}`);
          expect(m.more, `${where}: content below the foot, the fade shows`).toBe(true);
          expect(m.bottom, `${where}: the fade drawn down to the column's foot`).not.toBeNull();
          expect(Math.abs(m.bottom! - m.foot), `${where}: the fade's foot at the column's foot (${m.bottom} against ${m.foot.toFixed(1)})`).toBeLessThanOrEqual(1);
          expect(Math.abs(m.foot - m.top! - 28), `${where}: the fade 28 px tall from there`).toBeLessThanOrEqual(1);
        }
        await context.close();
      });
    }
  }
});

test.describe('E2: the landing\'s forecast of the bar is where the bar stands (dev server: it reads the module)', () => {
  const STATES = [
    { name: '1366×768 piano EN', w: 1366, h: 768, state: {}, wide: false },
    { name: '1280×800 guitar PT, text 8 % wider', w: 1280, h: 800, state: { instrument: 'guitar', language: 'pt' }, wide: true },
    { name: '1366×768 with the start hint', w: 1366, h: 768, state: { learnerProfile: 'player', startHint: 'player' }, wide: false },
    { name: '1200×520 PT, text 8 % wider, with the start hint', w: 1200, h: 520, state: { language: 'pt', learnerProfile: 'player', startHint: 'player' }, wide: true },
    { name: '1200×520 EN', w: 1200, h: 520, state: {}, wide: false },
    { name: '1536×864 ES', w: 1536, h: 864, state: { language: 'es' }, wide: false },
    { name: '1280×800 Simple view', w: 1280, h: 800, state: { exploreDetail: 'simple' }, wide: false },
  ] as const;
  for (const s of STATES) {
    test(`${s.name}: barPlaceWith equals the bar's own box, within a pixel, for In key 1–7`, async ({ browser, baseURL }) => {
      test.setTimeout(90_000);
      const probePage = await browser.newPage();
      const probe = await probePage.request.get(`${baseURL}/src/components/panels/chordScrollLanding.ts`);
      const dev = probe.ok() && (probe.headers()['content-type'] ?? '').includes('javascript');
      await probePage.close();
      test.skip(!dev, 'the build has no /src modules: dev server only');
      const { context, page } = await open(browser, baseURL!, { w: s.w, h: s.h, wide: s.wide, state: { ...s.state } });
      if ('startHint' in s.state) await expect(page.getByTestId('start-hint')).toBeVisible();
      await openBar(page, (('language' in s.state ? s.state.language : 'en') as Lang));
      for (let i = 0; i < 7; i++) {
        await toTop(page);
        await choose(page, `.chord-row button >> nth=${i}`);
        await landed(page);
        // The app's own module instance (the dev server's address for it), called on the page as it stands.
        // The forecast needs the metronome's placement, which the module loads only once a landing meets the bar: this
        // copy may not be the app's (the dev server serves an edited module at a new address), so it loads it itself.
        const d: number[] = await page.evaluate(`(async () => {
          const mod = await import('/src/components/panels/chordScrollLanding.ts');
          await mod.loadBarPlacement();
          const bar = document.querySelector('[data-testid="metronome"]');
          const real = bar.getBoundingClientRect();
          const forecast = mod.barPlaceWith(bar, document.querySelector('[data-testid="chord-detail"]').getBoundingClientRect());
          return [forecast.top - real.top, forecast.left - real.left, forecast.bottom - real.bottom, forecast.right - real.right].map((v) => Math.abs(v));
        })()`);
        expect(Math.max(...d), `${s.name}, In key ${i + 1}: forecast against the bar's box (top, left, bottom, right differences ${d.map((v) => v.toFixed(1)).join(', ')})`).toBeLessThanOrEqual(1);
      }
      await context.close();
    });
  }
});

test.describe('E2: with no bar, the nine landings are those of 57cda40 (this Mac\'s text, ordinary motion)', () => {
  // Measured once at 57cda40 itself (its landing code on this round's dev
  // server, 21 November 2026), on this Mac, EN, normal text, ordinary motion,
  // each chord chosen from the column's top: the work column's scroll after
  // In key 1–7, All Chords' minor and Build C major. The new code gives the
  // same 72 of 72 (and, under reduced motion, where 57cda40 landed short of
  // its own target in 16 of 72 — a margin and a padding arriving a frame
  // late — it now lands as here; the branch for the bar is never entered
  // without a bar: unit test "no bar: no forecast of the bar is made…").
  // The positions follow the text's metrics, so they are compared on macOS
  // only: GitHub's Linux draws text about 8 % wider. Each bound is the ±1 px
  // the title says: a row whose bound is wider than its title is a fault (the
  // second review planted ±60 here and every row still passed).
  const AT_57CDA40: Record<string, number[]> = {
    '1280x800 guitar': [61, 61, 61, 61, 61, 61, 61, 109, 219],
    '1280x800 piano': [61, 61, 61, 61, 61, 61, 61, 109, 219],
    '1366x768 guitar': [127, 127, 127, 127, 127, 127, 127, 170, 219],
    '1366x768 piano': [127, 127, 127, 127, 127, 127, 127, 170, 219],
    '1440x900 guitar': [0, 0, 0, 0, 0, 0, 0, 0, 105],
    '1440x900 piano': [0, 0, 0, 0, 0, 0, 0, 0, 105],
    '1536x864 guitar': [61, 61, 61, 61, 61, 61, 61, 109, 173],
    '1536x864 piano': [61, 61, 61, 61, 61, 61, 61, 109, 173],
  };
  for (const [key, expected] of Object.entries(AT_57CDA40)) {
    test(`${key}: In key 1–7, All Chords' minor and Build land where 57cda40 landed them, ±1 px, the strip as there`, async ({ browser, baseURL }) => {
      test.skip(process.platform !== 'darwin', 'positions recorded with this Mac\'s text; elsewhere the unit test holds the rule');
      test.setTimeout(90_000);
      const [size, instrument] = key.split(' ');
      const [w, h] = size.split('x').map(Number);
      const { context, page } = await open(browser, baseURL!, { w, h, motion: 'no-preference', state: { instrument } });
      const read = () => page.locator('.explore-main').evaluate((el) => ({
        scroll: el.scrollTop, attr: el.hasAttribute('data-strip-scrolls'), held: getComputedStyle(el.querySelector('.strip-card')!).position === 'sticky',
      }));
      const seen: number[] = [];
      for (let i = 0; i < 7; i++) {
        await toTop(page);
        await choose(page, `.chord-row button >> nth=${i}`);
        await landed(page);
        const r = await read();
        seen.push(r.scroll);
        expect([r.attr, r.held], `${key}, In key ${i + 1}: no attribute, the strip held`).toEqual([false, true]);
      }
      await toTop(page);
      await page.getByRole('tab', { name: 'All Chords', exact: true }).click();
      await settled(page);
      await choose(page, '[data-quality="minor"]');
      await landed(page);
      const all = await read();
      seen.push(all.scroll);
      expect([all.attr, all.held], `${key}, All Chords minor: no attribute, the strip held`).toEqual([false, true]);
      await toTop(page);
      await page.getByRole('tab', { name: 'Build', exact: true }).click();
      await settled(page);
      await page.getByRole('group', { name: 'Chromatic strip from C' }).getByRole('button').nth(4).dispatchEvent('click');
      await page.getByRole('group', { name: 'Chromatic strip from C' }).getByRole('button').nth(7).dispatchEvent('click');
      await landed(page);
      const build = await read();
      seen.push(build.scroll);
      expect(build.attr, `${key}, Build: no attribute`).toBe(false);
      console.log(`[no bar] ${key}: ${seen.join(', ')} (57cda40: ${expected.join(', ')})`);
      seen.forEach((v, i) => {
        expect(v, `${key}, landing ${i + 1}: at least 57cda40's ${expected[i]} − 1`).toBeGreaterThanOrEqual(expected[i] - 1);
        expect(v, `${key}, landing ${i + 1}: at most 57cda40's ${expected[i]} + 1`).toBeLessThanOrEqual(expected[i] + 1);
      });
      await context.close();
    });
  }
});

/** The phone sheet: its content against its visible foot, and the fade. */
type SheetState = {
  shown: string; clientH: number; scrollH: number; scrollTop: number; below: number;
  fade: { opacity: number; position: string; height: number; image: string; bottom: number };
  surface: string; foot: number; straddling: string[]; lastControlBottom: number; halfLine: boolean;
};
const sheetState = (page: Page) => page.evaluate((): SheetState => {
  const sheet = document.querySelector('[data-testid="instrument-dock"]')!;
  const c = sheet.querySelector<HTMLElement>('.detent-content')!;
  const r = c.getBoundingClientRect();
  const foot = r.top + c.clientTop + c.clientHeight;
  let lowest = -Infinity;
  for (const k of Array.from(c.children)) { const b = k.getBoundingClientRect(); if (b.height > 0) lowest = Math.max(lowest, b.bottom); }
  const after = getComputedStyle(c, '::after');
  const fadeHeight = parseFloat(after.height) || 0;
  // The fade's box: held at the visible foot (sticky): its top is the foot less its height.
  const fadeTop = foot - fadeHeight;
  const rows = Array.from(c.querySelectorAll('[data-dock-row]')).map((row) => ({ name: row.getAttribute('data-dock-row')!, box: row.getBoundingClientRect() }));
  const straddling = rows.filter(({ box }) => box.height > 0 && box.top < fadeTop - 0.5 && box.bottom > fadeTop + 0.5).map(({ name, box }) => `${name} ${box.top.toFixed(1)}–${box.bottom.toFixed(1)}`);
  const controls = Array.from(c.querySelectorAll('button, select, [role="radio"]')).map((el) => el.getBoundingClientRect()).filter((b) => b.height > 0);
  return {
    shown: sheet.getAttribute('data-detent')!, clientH: c.clientHeight, scrollH: c.scrollHeight, scrollTop: c.scrollTop,
    below: c.clientHeight > 0 ? lowest - foot : 0,
    fade: { opacity: after.content === 'none' || after.display === 'none' ? 0 : Number(after.opacity), position: after.position, height: fadeHeight, image: after.backgroundImage, bottom: foot },
    surface: getComputedStyle(sheet).backgroundColor,
    foot, straddling, lastControlBottom: controls.length ? Math.max(...controls.map((b) => b.bottom)) : 0,
    // Half shown without the band (the attribute says Half has none; the line is drawn at Half only).
    halfLine: sheet.hasAttribute('data-half-line') && sheet.getAttribute('data-detent') === 'half',
  };
});

/** A wheel over the sheet's content: the furthest its scroll went at any scroll event, and where it rests (a scroll put back at once still counts). */
async function wheelOverSheet(page: Page) {
  const content = page.locator('[data-testid="instrument-dock"] .detent-content');
  await content.evaluate((el) => {
    const w = window as unknown as { __sheetScroll: number };
    w.__sheetScroll = el.scrollTop;
    el.addEventListener('scroll', () => { w.__sheetScroll = Math.max(w.__sheetScroll, el.scrollTop); });
  });
  const box = (await content.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height - 4, 40));
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(200);
  await settled(page);
  return Math.max(await content.evaluate((el) => el.scrollTop), await page.evaluate(() => (window as unknown as { __sheetScroll: number }).__sheetScroll));
}

test.describe('E3: the phone sheet fades at its foot while content lies below, and never scrolls by padding', () => {
  const INSTRUMENTS = [
    { name: 'piano', state: { instrument: 'piano' } },
    { name: 'guitar', state: { instrument: 'guitar' } },
    { name: 'guitar in Open G', state: { instrument: 'guitar', guitarTuningId: 'open-g' } },
  ] as const;
  for (const [w, h] of [[375, 667], [390, 844], [360, 640]] as const) {
    for (const inst of INSTRUMENTS) {
      for (const language of ['en', 'pt', 'es'] as const) {
        for (const { wide, label: textLabel } of TEXTS) {
          test(`${w}×${h}, ${inst.name}, ${language.toUpperCase()}${textLabel}: Peek, Half and Full`, async ({ browser, baseURL }) => {
            test.setTimeout(60_000);
            const { context, page } = await open(browser, baseURL!, { w, h, touch: true, wide, state: { ...inst.state, language, dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true } } });
            const sheet = page.getByTestId('instrument-dock');
            const handle = sheet.getByRole('separator');
            for (const [asked, key] of [['half', null], ['full', 'End'], ['peek', 'Home']] as const) {
              if (key) { await handle.focus(); await handle.press(key); }
              await settled(page);
              const s = await sheetState(page);
              const where = `${w}×${h} ${inst.name} ${language}${textLabel}, ${asked} (shown ${s.shown})`;
              console.log(`[sheet] ${where}: content ${s.clientH}/${s.scrollH}, ${s.below.toFixed(1)} px below the foot, fade ${s.fade.opacity}`);
              if (asked === 'peek') {
                expect(s.shown, where).toBe('peek');
                expect(s.fade.opacity, `${where}: no fade at Peek (the content is folded away, not cut)`).toBe(0);
                continue;
              }
              // The guitar's controls lie below Half at these phones (they do not fit: the sheet must not pretend they do);
              // the piano's keyboard fits at Half.
              if (asked === 'half') expect(s.below > 1, `${where}: content below Half's foot`).toBe(inst.name !== 'piano');
              // At 360×640 the guitar's band would end across a string (its dots are drawn over the fade): Half as at
              // 57cda40, with its line (the next describe); everywhere else here the band is taken.
              expect(s.halfLine, `${where}: Half without the band only where it would cut a string`).toBe(asked === 'half' && w === 360 && inst.name !== 'piano');
              if (s.halfLine) {
                expect(s.fade.opacity, `${where}: no fade where Half has no band`).toBe(0);
              } else if (s.below > 1) {
                expect(s.fade.opacity, `${where}: content below the foot, the fade shows`).toBe(1);
                expect(s.fade.position, `${where}: held at the foot`).toBe('sticky');
                expect(s.fade.height, `${where}: Explore's 28 px`).toBe(28);
                expect(s.fade.image, `${where}: the fade ends in the sheet's own surface (${s.surface})`).toContain(`${s.surface} 85%`);
                expect(s.straddling, `${where}: no string or fret-number row half under the fade`).toEqual([]);
                // Scrolled to its end: the last control in view, and the fade gone.
                await page.locator('[data-testid="instrument-dock"] .detent-content').evaluate((el) => { el.scrollTop = el.scrollHeight; });
                await settled(page);
                const end = await sheetState(page);
                expect(end.below, `${where}: scrolled to the end, nothing below`).toBeLessThanOrEqual(1);
                expect(end.lastControlBottom, `${where}: scrolled to the end, the last control in view`).toBeLessThanOrEqual(end.foot + 0.5);
                expect(end.fade.opacity, `${where}: scrolled to the end, no fade`).toBe(0);
                await page.locator('[data-testid="instrument-dock"] .detent-content').evaluate((el) => { el.scrollTop = 0; });
              } else {
                expect(s.fade.opacity, `${where}: nothing below, no fade`).toBe(0);
                expect(await wheelOverSheet(page), `${where}: nothing below, the sheet does not scroll`).toBe(0);
              }
            }
            await context.close();
          });
        }
      }
    }
  }

  test('padding alone is never "more": a sheet whose only overflow is its padding does not scroll and shows no fade', async ({ browser, baseURL }) => {
    for (const { wide, label } of TEXTS) {
      const { context, page } = await open(browser, baseURL!, { w: 375, h: 667, touch: true, wide, state: { instrument: 'piano', dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true } } });
      // Padding at the content's foot, nothing more: the keyboard fits at Half.
      await page.addStyleTag({ content: '[data-testid="instrument-dock"] .detent-content { padding-bottom: 40px !important; }' });
      await settled(page);
      const s = await sheetState(page);
      expect(s.scrollH - s.clientH, `375×667 piano${label}: the padding overflows the content box (the case is real)`).toBeGreaterThanOrEqual(39);
      expect(s.below, `375×667 piano${label}: no content below the foot`).toBeLessThanOrEqual(1);
      expect(s.fade.opacity, `375×667 piano${label}: padding is not "more": no fade`).toBe(0);
      expect(await page.getByTestId('instrument-dock').evaluate((el) => el.hasAttribute('data-more-below')), `375×667 piano${label}: no "more below" mark (the 3 px line's, at 57cda40)`).toBe(false);
      expect(await wheelOverSheet(page), `375×667 piano${label}: the sheet does not scroll by its padding`).toBe(0);
      await context.close();
    }
  });
});

/** A phone on its side: the sheet's foot as drawn (the fade, the 3 px line) and the rows its foot cuts. */
const sidewaysFoot = (page: Page) => page.evaluate(() => {
  const sheet = document.querySelector('[data-testid="instrument-dock"]')!;
  const c = sheet.querySelector<HTMLElement>('.detent-content')!;
  const foot = c.getBoundingClientRect().top + c.clientTop + c.clientHeight;
  let lowest = -Infinity;
  for (const k of Array.from(c.children)) { const b = k.getBoundingClientRect(); if (b.height > 0) lowest = Math.max(lowest, b.bottom); }
  const drawn = (cs: CSSStyleDeclaration) => !['none', 'normal'].includes(cs.content) && cs.display !== 'none' && parseFloat(cs.height) > 0;
  const fade = getComputedStyle(c, '::after');
  const line = getComputedStyle(sheet, '::after');
  const cut = Array.from(c.querySelectorAll('[data-dock-row]')).map((row) => ({ name: row.getAttribute('data-dock-row')!, box: row.getBoundingClientRect() }))
    .filter(({ box }) => box.height > 0 && box.top < foot - 0.5 && box.bottom > foot + 0.5).map(({ name, box }) => `${name} ${box.top.toFixed(1)}–${box.bottom.toFixed(1)}`);
  return {
    shown: sheet.getAttribute('data-detent')!, below: c.clientHeight > 0 ? lowest - foot : 0,
    fadeDrawn: drawn(fade) && Number(fade.opacity) > 0,
    line: drawn(line) ? { height: parseFloat(line.height), bottom: sheet.getBoundingClientRect().bottom - parseFloat(line.bottom) } : null,
    sheetBottom: sheet.getBoundingClientRect().bottom, cut,
  };
});

test.describe('E3 leaves a phone on its side as at 57cda40: no fade, the 3 px line, Half as it was', () => {
  // 844×390 and 667×375: Half already stands at the view's 120 px floor, so the fade's whole band cannot be added under
  // its last whole row, and Full ends at the board's foot: the fade would lie over a whole string, the fret numbers or
  // the piano's strip. Measured against 57cda40 in all 54 cases (EN / PT / ES): the sheet's height, the view's, what
  // lies below, the cue and the rows under it equal, the screenshots identical.
  const INSTRUMENTS = [
    { name: 'piano', state: { instrument: 'piano' } },
    { name: 'guitar', state: { instrument: 'guitar' } },
    { name: 'guitar in Open G', state: { instrument: 'guitar', guitarTuningId: 'open-g' } },
  ] as const;
  for (const [w, h] of [[844, 390], [667, 375]] as const) {
    for (const inst of INSTRUMENTS) {
      for (const language of ['en', 'pt', 'es'] as const) {
        for (const { wide, label: textLabel } of TEXTS) {
          test(`${w}×${h}, ${inst.name}, ${language.toUpperCase()}${textLabel}: Peek, Half and Full`, async ({ browser, baseURL }) => {
            test.setTimeout(60_000);
            const { context, page } = await open(browser, baseURL!, { w, h, touch: true, wide, state: { ...inst.state, language, dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true } } });
            const handle = page.getByTestId('instrument-dock').getByRole('separator');
            for (const [asked, key] of [['half', null], ['full', 'End'], ['peek', 'Home']] as const) {
              if (key) { await handle.focus(); await handle.press(key); }
              await settled(page);
              const s = await sidewaysFoot(page);
              const where = `${w}×${h} ${inst.name} ${language}${textLabel}, ${asked} (shown ${s.shown})`;
              console.log(`[sideways] ${where}: ${s.below.toFixed(1)} px below the foot, fade ${s.fadeDrawn}, line ${JSON.stringify(s.line)}, cut ${s.cut.join('; ') || '-'}`);
              expect(s.shown, where).toBe(asked);
              if (asked !== 'peek') expect(s.below, `${where}: content goes on below the foot (the case is real)`).toBeGreaterThan(1);
              expect(s.fadeDrawn, `${where}: no fade on a phone on its side`).toBe(false);
              expect(s.line, `${where}: the 3 px line, as at 57cda40`).not.toBeNull();
              expect(s.line!.height, `${where}: 3 px`).toBe(3);
              expect(Math.abs(s.line!.bottom - s.sheetBottom), `${where}: at the sheet's foot`).toBeLessThanOrEqual(0.5);
              // Half as at 57cda40: it ends under the guitar's last whole string, no band added below it that cuts the next.
              if (asked === 'half' && inst.name !== 'piano') expect(s.cut, `${where}: no string or fret-number row cut by Half's foot`).toEqual([]);
            }
            await context.close();
          });
        }
      }
    }
  }
});

test.describe('E3 never ends Half\'s band across a string: where it would, Half is as at 57cda40, with its 3 px line', () => {
  // The guitar's dots are drawn over the fade: a band ending across a string cut them flat at the foot (320×568,
  // 360×640; design-system's PR A rows). The band ends across the Position row at 375×667 (the owner's picture) and
  // across nothing at 390×844.
  for (const [w, h, line] of [[320, 568, true], [360, 640, true], [375, 667, false], [390, 844, false]] as const) {
    for (const tuning of ['standard', 'open-g'] as const) {
      for (const language of ['en', 'pt', 'es'] as const) {
        test(`${w}×${h}, guitar ${tuning}, ${language.toUpperCase()}: Half ${line ? 'as at 57cda40, with its line' : 'with the band and the fade'}`, async ({ browser, baseURL }) => {
          const { context, page } = await open(browser, baseURL!, { w, h, touch: true, state: { instrument: 'guitar', guitarTuningId: tuning, language, dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true } } });
          await settled(page);
          const where = `${w}×${h} guitar ${tuning} ${language}, Half`;
          const s = await sheetState(page);
          const f = await sidewaysFoot(page);
          const dots = await page.evaluate(() => {
            const sheet = document.querySelector('[data-testid="instrument-dock"]')!;
            const c = sheet.querySelector<HTMLElement>('.detent-content')!;
            const foot = c.getBoundingClientRect().top + c.clientTop + c.clientHeight;
            return Array.from(sheet.querySelectorAll('[data-dot]')).map((d) => d.getBoundingClientRect())
              .filter((b) => b.top < foot - 0.5 && b.bottom > foot + 0.5).map((b) => `${b.top.toFixed(1)}–${b.bottom.toFixed(1)}`);
          });
          console.log(`[band] ${where}: line ${s.halfLine}, fade ${s.fade.opacity}, cut ${f.cut.join('; ') || '-'}, dots cut ${dots.join('; ') || '-'}`);
          expect(s.shown, where).toBe('half');
          expect(s.below, `${where}: content goes on below (the case is real)`).toBeGreaterThan(1);
          expect(dots, `${where}: no dot cut by Half's foot`).toEqual([]);
          expect(s.halfLine, `${where}: the band refused exactly where it would cut a string`).toBe(line);
          if (line) {
            expect(f.fadeDrawn, `${where}: no fade`).toBe(false);
            expect(f.line?.height, `${where}: the 3 px line, as at 57cda40`).toBe(3);
            expect(f.cut, `${where}: no row cut by Half's foot (as at 57cda40)`).toEqual([]);
          } else {
            expect(f.fadeDrawn, `${where}: the fade`).toBe(true);
            expect(f.line, `${where}: no line`).toBeNull();
            expect(f.cut.filter((c) => c.startsWith('string')), `${where}: no string cut by Half's foot`).toEqual([]);
          }
          await context.close();
        });
      }
    }
  }
});

test.describe('E2: with no bar, reduced motion lands where ordinary motion lands (the page against itself, every system)', () => {
  // At 57cda40, with no bar, the reduced-motion landing fell short of the
  // ordinary-motion one in 16, 3, 25 and 30 of these 59 landings at the four
  // sizes (the second review, by 6–62 px): a margin and a padding arrive a
  // frame late under reduced motion and nothing landed again. It now lands
  // where ordinary motion lands. Compared within the same run, so Linux's
  // wider text is no obstacle.
  for (const [w, h] of [[1366, 768], [1280, 800], [1440, 900], [1536, 864]] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      test(`${w}×${h}, ${instrument}: In key 1–7, every All Chords quality and Build, no bar: reduced motion = ordinary motion, ±1 px`, async ({ browser, baseURL }) => {
        test.setTimeout(300_000);
        const walk = async (motion: Motion) => {
          const { context, page } = await open(browser, baseURL!, { w, h, motion, state: { instrument } });
          const read = () => page.locator('.explore-main').evaluate((el) => el.scrollTop);
          const seen: number[] = [];
          for (let i = 0; i < 7; i++) {
            await toTop(page);
            await choose(page, `.chord-row button >> nth=${i}`);
            await landed(page);
            seen.push(await read());
          }
          await toTop(page);
          await page.getByRole('tab', { name: 'All Chords', exact: true }).click();
          await settled(page);
          let shown = 0;
          for (const { quality, category } of QUALITIES) {
            await toTop(page);
            if (category !== shown) {
              await page.getByRole('radiogroup', { name: 'All Chords' }).getByRole('radio').nth(category).dispatchEvent('click');
              shown = category;
              await settled(page);
            }
            await choose(page, `[data-quality="${quality}"]`);
            await landed(page);
            seen.push(await read());
          }
          await toTop(page);
          await page.getByRole('tab', { name: 'Build', exact: true }).click();
          await settled(page);
          await page.getByRole('group', { name: 'Chromatic strip from C' }).getByRole('button').nth(4).dispatchEvent('click');
          await page.getByRole('group', { name: 'Chromatic strip from C' }).getByRole('button').nth(7).dispatchEvent('click');
          await landed(page);
          seen.push(await read());
          await context.close();
          return seen;
        };
        const [reduced, ordinary] = await Promise.all([walk('reduce'), walk('no-preference')]);
        const names = [...Array.from({ length: 7 }, (_, i) => `In key ${i + 1}`), ...QUALITIES.map(({ quality }) => quality), 'Build C major'];
        const differ = names.map((name, i) => ({ name, reduced: reduced[i], ordinary: ordinary[i] })).filter((d) => Math.abs(d.reduced - d.ordinary) > 1);
        console.log(`[no bar, both motions] ${w}×${h} ${instrument}: ${names.length} landings, ${differ.length} differ${differ.length ? `: ${differ.map((d) => `${d.name} ${d.reduced} / ${d.ordinary}`).join('; ')}` : ''}`);
        expect(reduced.length).toBe(59);
        expect(differ, `${w}×${h} ${instrument}: every landing under reduced motion where ordinary motion puts it`).toEqual([]);
      });
    }
  }
});

test.describe('E2: a learner\'s own scrolling is never undone (the bar open, a chord landed)', () => {
  // Wheel steps and keys on the work column: the column ends where the input
  // takes it, every frame moves it the input's way or not at all, no landing
  // runs and the strip neither goes nor comes back.
  type Step = { label: string; wheel?: number; key?: string; sign: 1 | -1 };
  const STEPS: Step[] = [
    { label: 'wheel +60', wheel: 60, sign: 1 }, { label: 'wheel +120', wheel: 120, sign: 1 }, { label: 'wheel −120', wheel: -120, sign: -1 },
    { label: 'ArrowDown', key: 'ArrowDown', sign: 1 }, { label: 'PageDown', key: 'PageDown', sign: 1 }, { label: 'Space', key: 'Space', sign: 1 },
    { label: 'ArrowUp', key: 'ArrowUp', sign: -1 }, { label: 'PageUp', key: 'PageUp', sign: -1 }, { label: 'Shift+Space', key: 'Shift+Space', sign: -1 },
  ];
  for (const [w, h] of [[1366, 768], [1280, 800]] as const) {
    for (const { motion, label: motionLabel } of MOTIONS) {
      test(`${w}×${h}${motionLabel}: wheel steps and keys move the column where they take it, and nothing lands`, async ({ browser, baseURL }) => {
        test.setTimeout(120_000);
        const { context, page } = await open(browser, baseURL!, { w, h, motion, state: { instrument: 'piano' } });
        await openBar(page, 'en');
        await choose(page, '.chord-row button >> nth=2');
        await landed(page);
        const main = page.locator('.explore-main');
        // Keys go to the focused scroller (the column itself: no control is pressed).
        await main.evaluate((el) => { el.tabIndex = -1; el.focus({ preventScroll: true }); });
        const box = (await main.boundingBox())!;
        await page.mouse.move(box.x + box.width / 2, box.y + 60);
        const strip = () => main.evaluate((el) => `${el.hasAttribute('data-strip-scrolls')}|${getComputedStyle(el.querySelector('.strip-card')!).position}`);
        const stripAt = await strip();
        for (const step of STEPS) {
          const before = await main.evaluate((el) => {
            const w = window as unknown as LandWindow & { __trace?: number[] };
            w.__trace = [];
            const t0 = performance.now();
            const tick = () => { w.__trace!.push(el.scrollTop); if (performance.now() - t0 < 2000) requestAnimationFrame(tick); };
            requestAnimationFrame(tick);
            return { top: el.scrollTop, max: el.scrollHeight - el.clientHeight, lands: (w.__lands ?? []).length };
          });
          if (step.wheel) await page.mouse.wheel(0, step.wheel);
          else await page.keyboard.press(step.key!);
          await page.waitForTimeout(2100);
          const after = await main.evaluate((el) => {
            const w = window as unknown as LandWindow & { __trace?: number[] };
            return { top: el.scrollTop, trace: w.__trace ?? [], lands: (w.__lands ?? []).length };
          });
          const where = `${w}×${h}${motionLabel}, ${step.label} from ${before.top}`;
          const against = after.trace.slice(1).map((v, i) => v - after.trace[i]).filter((d) => d * step.sign < -0.5);
          console.log(`[own scroll] ${where}: ends at ${after.top} (max ${before.max}), ${after.trace.length} frames, ${against.length} against the input, ${after.lands - before.lands} landings`);
          expect(after.lands - before.lands, `${where}: no landing`).toBe(0);
          expect(against, `${where}: no frame moves the column against the input`).toEqual([]);
          if (step.wheel) {
            expect(Math.abs(after.top - Math.min(before.max, Math.max(0, before.top + step.wheel))), `${where}: where the wheel took it`).toBeLessThanOrEqual(1);
          } else {
            const room = step.sign > 0 ? before.max - before.top : before.top;
            if (room > 1) expect((after.top - before.top) * step.sign, `${where}: moved the key's way`).toBeGreaterThan(0);
          }
          expect(await strip(), `${where}: the strip as it was`).toBe(stripAt);
        }
        await context.close();
      });
    }
  }
});

test.describe('E2: Explore asks for none of the metronome before it is opened (the build\'s chunks)', () => {
  test('a chord chosen, no metronome: 0 requests for its chunks; opened: more than 0 (the known positive)', async ({ browser, baseURL }) => {
    const probePage = await browser.newPage();
    const probe = await probePage.request.get(`${baseURL}/src/components/panels/chordScrollLanding.ts`);
    const dev = probe.ok() && (probe.headers()['content-type'] ?? '').includes('javascript');
    await probePage.close();
    test.skip(dev, 'the build\'s chunks: on the dev server metronome.spec.ts holds it');
    const { context, page } = await open(browser, baseURL!, { w: 1280, h: 800, state: { instrument: 'piano' } });
    const loaded = () => page.evaluate(() => performance.getEntriesByType('resource').map((e) => new URL(e.name).pathname)
      .filter((p) => /^\/assets\/(MetronomeHost|placement|metronome)[^/]*\.(js|css)$/i.test(p)));
    await choose(page, '.chord-row button >> nth=2');
    await landed(page);
    await page.getByRole('tab', { name: 'All Chords', exact: true }).click();
    await settled(page);
    await choose(page, '[data-quality="minor"]');
    await landed(page);
    expect(await loaded(), 'Explore with chords chosen, the metronome never opened').toEqual([]);
    await openBar(page, 'en');
    await expect.poll(async () => (await loaded()).length, { message: 'opened: its chunks come' }).toBeGreaterThan(0);
    console.log(`[metronome chunks] after opening: ${(await loaded()).join(', ')}`);
    await context.close();
  });
});

/** The phone sheet on any screen: its height, the view's, the rows its foot cuts, the fade (drawn, its height) and the 3 px line. */
const sheetFoot = (page: Page) => page.evaluate(() => {
  const sheet = document.querySelector<HTMLElement>('[data-testid="instrument-dock"]')!;
  const c = sheet.querySelector<HTMLElement>('.detent-content')!;
  const foot = c.getBoundingClientRect().top + c.clientTop + c.clientHeight;
  let lowest = -Infinity;
  for (const k of Array.from(c.children)) { const b = k.getBoundingClientRect(); if (b.height > 0) lowest = Math.max(lowest, b.bottom); }
  const fade = getComputedStyle(c, '::after');
  const line = getComputedStyle(sheet, '::after');
  const drawn = (cs: CSSStyleDeclaration) => !['none', 'normal'].includes(cs.content) && cs.display !== 'none' && parseFloat(cs.height) > 0;
  const cut = Array.from(c.querySelectorAll('[data-dock-row], [data-testid="position-row"]')).map((el) => ({ n: el.getAttribute('data-dock-row') ?? 'position', b: el.getBoundingClientRect() }))
    .filter(({ b }) => b.height > 0 && b.top < foot - 0.5 && b.bottom > foot + 0.5).map(({ n }) => n);
  return {
    shown: sheet.getAttribute('data-detent')!, sheet: sheet.getBoundingClientRect().height, view: document.getElementById('main-content')!.getBoundingClientRect().height,
    below: c.clientHeight > 0 ? lowest - foot : 0, cut, fadeDrawn: drawn(fade) && Number(fade.opacity) > 0, fadeHeight: parseFloat(fade.height) || 0,
    line: drawn(line) ? parseFloat(line.height) : 0, overflowY: getComputedStyle(c).overflowY, fits: c.hasAttribute('data-fits'),
    fadeImage: fade.backgroundImage, surface: getComputedStyle(sheet).backgroundColor,
  };
});
/** Peek, Half and Full in turn, by the handle's keys. */
async function eachStop(page: Page, at: (asked: 'peek' | 'half' | 'full') => Promise<void>) {
  const handle = page.getByTestId('instrument-dock').getByRole('separator');
  for (const [asked, key] of [['half', null], ['full', 'End'], ['peek', 'Home']] as const) {
    if (key) { await handle.focus(); await handle.press(key); }
    await settled(page);
    await at(asked);
  }
}

test.describe('E3: every screen at most 500 px tall shows the sheet exactly as at 57cda40, at every stop', () => {
  // index.css's short-screen rule (max-height 500 px, SHORT_SCREEN_QUERY) is
  // the one place that decides it: no fade (its height 0), the 3 px line, and
  // DetentSheet reads that height for Half's band, so Half takes none. The
  // second review found Half 28 px taller at 700×480, 800×500, 1024×500,
  // 500×500, 450×480 and 360×500 (piano 233 → 261, guitar 220 → 248) for a
  // fade not drawn. Measured at 57cda40 on this Mac: [sheet, view] at Peek,
  // Half and Full, and the rows its foot cuts (compared on macOS only: the
  // bar's text sets the head's height); everywhere: no fade, its height 0,
  // the line wherever content goes on below or at Peek.
  const AT_57CDA40: Record<string, Record<'peek' | 'half' | 'full', [number, number, string[]]>> = {
    '360x500 guitar': { peek: [73, 367, []], half: [204, 236, []], full: [364, 76, ['position']] },
    '360x500 piano': { peek: [73, 367, []], half: [233, 207, []], full: [301, 139, []] },
    '450x480 guitar': { peek: [73, 347, []], half: [204, 216, []], full: [344, 76, ['position']] },
    '450x480 piano': { peek: [73, 347, []], half: [233, 187, []], full: [301, 119, []] },
    '500x500 guitar': { peek: [73, 367, []], half: [204, 236, []], full: [364, 76, ['position']] },
    '500x500 piano': { peek: [73, 367, []], half: [233, 207, []], full: [301, 139, []] },
    '667x375 guitar': { peek: [73, 242, []], half: [192, 123, []], full: [302, 13, []] },
    '667x375 piano': { peek: [73, 242, []], half: [195, 120, []], full: [239, 76, []] },
    '700x480 guitar': { peek: [73, 347, []], half: [220, 200, []], full: [344, 76, ['position']] },
    '700x480 piano': { peek: [73, 347, []], half: [233, 187, []], full: [297, 123, []] },
    '800x500 guitar': { peek: [73, 367, []], half: [220, 220, []], full: [364, 76, []] },
    '800x500 piano': { peek: [73, 367, []], half: [233, 207, []], full: [297, 143, []] },
    '844x390 guitar': { peek: [73, 257, []], half: [192, 138, []], full: [302, 28, []] },
    '844x390 piano': { peek: [73, 257, []], half: [210, 120, []], full: [254, 76, []] },
    '1024x500 guitar': { peek: [73, 367, []], half: [220, 220, []], full: [364, 76, []] },
    '1024x500 piano': { peek: [73, 367, []], half: [233, 207, []], full: [297, 143, []] },
  };
  for (const [key, expected] of Object.entries(AT_57CDA40)) {
    test(`${key}: Peek, Half and Full as at 57cda40, no fade, the 3 px line`, async ({ browser, baseURL }) => {
      const [size, instrument] = key.split(' ');
      const [w, h] = size.split('x').map(Number);
      const { context, page } = await open(browser, baseURL!, { w, h, touch: true, state: { instrument, dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true } } });
      await eachStop(page, async (asked) => {
        const s = await sheetFoot(page);
        const where = `${key}, ${asked}`;
        console.log(`[short] ${where}: sheet ${s.sheet}, view ${s.view}, cut ${s.cut.join(', ') || '-'}, ${s.below.toFixed(1)} below, line ${s.line}, fade ${s.fadeDrawn} (${s.fadeHeight} px)`);
        expect(s.shown, where).toBe(asked);
        expect([s.fadeDrawn, s.fadeHeight], `${where}: no fade, its height 0 (what Half's band reads)`).toEqual([false, 0]);
        expect(s.line, `${where}: the 3 px line wherever content goes on below, and at Peek`).toBe(asked === 'peek' || s.below > 1 ? 3 : 0);
        if (process.platform === 'darwin') {
          const [sheet, view, cut] = expected[asked];
          expect(Math.abs(s.sheet - sheet), `${where}: the sheet ${s.sheet} as at 57cda40 (${sheet})`).toBeLessThanOrEqual(0.5);
          expect(Math.abs(s.view - view), `${where}: the view ${s.view} as at 57cda40 (${view})`).toBeLessThanOrEqual(0.5);
          expect(s.cut, `${where}: the rows cut as at 57cda40`).toEqual(cut);
        }
      });
      await context.close();
    });
  }
  // At exactly 501 px the screen is not short: a phone-width sheet there is
  // an upright phone's. The piano's Half takes the band (40 px still below
  // it) with the fade; the guitar's band would end across a string, so its
  // Half is as at 57cda40 with the line, and Full, where content goes on,
  // has the fade.
  for (const [w, instrument] of [[360, 'piano'], [500, 'piano'], [360, 'guitar'], [639, 'guitar']] as const) {
    test(`${w}×501, ${instrument}: not a short screen: the fade's 28 px, and the upright phones' rule`, async ({ browser, baseURL }) => {
      const { context, page } = await open(browser, baseURL!, { w, h: 501, touch: true, state: { instrument, dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true } } });
      await eachStop(page, async (asked) => {
        if (asked === 'peek') return;
        const s = await sheetFoot(page);
        const where = `${w}×501 ${instrument}, ${asked}`;
        console.log(`[501] ${where}: sheet ${s.sheet}, ${s.below.toFixed(1)} below, fade ${s.fadeDrawn} (${s.fadeHeight} px), line ${s.line}`);
        expect(s.fadeHeight, `${where}: the fade is 28 px here`).toBe(28);
        if (s.below <= 1) return;
        const line = instrument === 'guitar' && asked === 'half';
        expect([s.fadeDrawn, s.line], `${where}: ${line ? 'Half without the band: the line' : 'the fade, not the line'}`).toEqual(line ? [false, 3] : [true, 0]);
        if (instrument === 'piano' && asked === 'half' && process.platform === 'darwin') expect(Math.abs(s.sheet - (233 + 28)), `${where}: Half with the band (57cda40: 233)`).toBeLessThanOrEqual(0.5);
      });
      await context.close();
    });
  }
});

test.describe('E3: Half shows everything where less than the band would stay hidden; the piano at the small sizes', () => {
  // The rule: where, after the band, less than the band's own height would
  // still be hidden, and showing everything fits in the room the view keeps,
  // Half shows everything and draws no fade (fitDockDetents). It changes the
  // piano at 320–430 px wide × 568 (282 → 301: 19 px were left under the fade)
  // and × 600 (298 → 301: 3 px); nothing else from 320×568 to 430×932.
  for (const [w, h, all] of [[320, 568, true], [340, 600, true], [360, 640, true], [360, 501, false]] as const) {
    test(`${w}×${h}, piano: Half ${all ? 'shows everything, no fade' : 'keeps the band and the fade (more than a band\'s height still below)'}`, async ({ browser, baseURL }) => {
      const { context, page } = await open(browser, baseURL!, { w, h, touch: true, state: { instrument: 'piano', dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true } } });
      const s = await sheetFoot(page);
      const where = `${w}×${h} piano, Half`;
      console.log(`[piano Half] ${where}: sheet ${s.sheet}, view ${s.view}, ${s.below.toFixed(1)} below, fade ${s.fadeDrawn}`);
      expect(s.shown).toBe('half');
      if (all) {
        expect(s.below, `${where}: everything shown`).toBeLessThanOrEqual(1);
        expect(s.fadeDrawn, `${where}: no fade`).toBe(false);
        expect(s.view, `${where}: the view keeps its 120 px`).toBeGreaterThanOrEqual(120);
      } else {
        expect(s.below, `${where}: more than the band's 28 px still below`).toBeGreaterThanOrEqual(28);
        expect(s.fadeDrawn, `${where}: the fade`).toBe(true);
      }
      await context.close();
    });
  }
});

test.describe('E3: content that fits is not scrollable (by style), and the fade ends in the sheet\'s own colour', () => {
  for (const [w, h, instrument, detent, fits] of [[375, 667, 'piano', 'half', true], [390, 844, 'piano', 'half', true], [360, 640, 'piano', 'half', true], [390, 844, 'guitar', 'full', true], [375, 667, 'guitar', 'half', false]] as const) {
    test(`${w}×${h}, ${instrument} at ${detent}: ${fits ? 'fits: not scrollable' : 'goes on below: scrollable'}`, async ({ browser, baseURL }) => {
      const { context, page } = await open(browser, baseURL!, { w, h, touch: true, state: { instrument, dockDetents: { explore: detent, learn: 'peek' }, dockChosen: { explore: true } } });
      const s = await sheetFoot(page);
      const where = `${w}×${h} ${instrument} ${detent}`;
      console.log(`[fits] ${where}: ${s.below.toFixed(1)} below, data-fits ${s.fits}, overflow-y ${s.overflowY}`);
      expect(s.fits, `${where}: data-fits`).toBe(fits);
      expect(s.overflowY, `${where}: computed overflow-y`).toBe(fits ? 'hidden' : 'auto');
      await context.close();
    });
  }
  for (const theme of ['fermata', 'fermata-night'] as const) {
    test(`375×667 guitar, ${theme === 'fermata' ? 'by day' : 'by night'}: the fade ends in the sheet's own surface colour, at Half and Full`, async ({ browser, baseURL }) => {
      const { context, page } = await open(browser, baseURL!, { w: 375, h: 667, touch: true, state: { instrument: 'guitar', themeMode: theme, dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true } } });
      await eachStop(page, async (asked) => {
        if (asked === 'peek') return;
        const s = await sheetFoot(page);
        const where = `375×667 guitar ${theme}, ${asked}`;
        console.log(`[fade colour] ${where}: ${s.fadeImage} on ${s.surface}`);
        expect(s.fadeDrawn, `${where}: the fade drawn (the case is real)`).toBe(true);
        expect(s.fadeImage, `${where}: ends in the sheet's own surface`).toContain(`${s.surface} 85%`);
        expect(s.fadeImage, `${where}: from transparent`).toMatch(/^linear-gradient\(rgba\(0, 0, 0, 0\)/);
      });
      await context.close();
    });
  }
});
