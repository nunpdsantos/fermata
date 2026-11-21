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
 * foot, Explore's own fade shows there (at 57cda40 the only sign was a 3 px
 * line), and at Half it lies under the last whole row, never over the fret
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
/** A landing and the few after it that a late size calls for; the code stops after at most five in a row. */
const MOST_LANDINGS = 10;

type Landed = { after: number };
/** The landings since counting began, and where the column stood then. */
type LandWindow = { __lands?: Landed[]; __landsFrom?: number };
/** Start counting landings afresh. */
const countLandings = (page: Page) => page.evaluate(() => {
  const w = window as unknown as LandWindow;
  w.__lands = [];
  w.__landsFrom = document.querySelector('.explore-main')!.scrollTop;
});

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
      original.apply(this, a);
      if (this.classList.contains('explore-main')) ((window as unknown as LandWindow).__lands ??= []).push({ after: this.scrollTop });
    };
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
type Landing = { held: boolean; attr: boolean; hidden: string[]; detail: number; roomHeld: number; name: string; fadeOffset: number; lands: number; lastNoop: boolean };
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
  // The last landing changed nothing: it left the column where the one before it (or, alone, where the count began) had.
  const w = window as unknown as LandWindow;
  const lands = w.__lands ?? [];
  const before = lands.length >= 2 ? lands[lands.length - 2].after : (w.__landsFrom ?? NaN);
  const lastNoop = lands.length === 0 || (Math.abs(lands[lands.length - 1].after - before) < 0.5 && Math.abs(lands[lands.length - 1].after - main.scrollTop) < 0.5);
  return {
    held, attr: main.hasAttribute('data-strip-scrolls'), hidden, detail: detail.getBoundingClientRect().height, roomHeld,
    name: detail.querySelector('.chord-detail-name')!.textContent!.trim(), fadeOffset: fadeBottom - foot, lands: lands.length, lastNoop,
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
  console.log(`[landing] ${where} (${r.name}): strip ${r.held ? 'held' : 'scrolls'}, detail ${r.detail.toFixed(0)} px, ${r.lands} landings${r.hidden.length ? `, out of view: ${r.hidden.join('; ')}` : ''}`);
  expect(r.hidden, `${where}: the chord's name and every control of its detail in view`).toEqual([]);
  expect(Math.abs(r.fadeOffset), `${where}: the column's foot fade drawn at its real foot, not the bar's room above it`).toBeLessThanOrEqual(0.5);
  if (build) expect(r.attr, `${where}: Build: the strip goes by the ruling's own rule, never this attribute`).toBe(false);
  else expect(r.attr, `${where}: the attribute and the strip agree`).toBe(!r.held);
  expect(r.lands, `${where}: a landing and few after it (${r.lands})`).toBeLessThanOrEqual(MOST_LANDINGS);
  expect(r.lastNoop, `${where}: the last landing changed nothing`).toBe(true);
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
        const d: number[] = await page.evaluate(`(async () => {
          const mod = await import('/src/components/panels/chordScrollLanding.ts');
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
  // only: GitHub's Linux draws text about 8 % wider.
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
  exploreFade: string; foot: number; straddling: string[]; lastControlBottom: number;
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
    fade: { opacity: after.content === 'none' ? 0 : Number(after.opacity), position: after.position, height: fadeHeight, image: after.backgroundImage, bottom: foot },
    exploreFade: getComputedStyle(document.querySelector('.explore-root')!, '::after').backgroundImage,
    foot, straddling, lastControlBottom: controls.length ? Math.max(...controls.map((b) => b.bottom)) : 0,
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
              if (s.below > 1) {
                expect(s.fade.opacity, `${where}: content below the foot, the fade shows`).toBe(1);
                expect(s.fade.position, `${where}: held at the foot`).toBe('sticky');
                expect(s.fade.height, `${where}: Explore's 28 px`).toBe(28);
                expect(s.fade.image, `${where}: Explore's own fade`).toBe(s.exploreFade);
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
