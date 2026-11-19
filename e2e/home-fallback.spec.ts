import fs from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { auditPage } from './helpers/designAudit';

/**
 * The home page's way on when its script does not run (2026-11-18, audit
 * A18). Until then the initial HTML of `/` held only an empty #root: with
 * JavaScript off, or the app's script blocked or failing, a learner saw a
 * blank page and no path to the readable lessons. Now plain links to the
 * three language homes and their lesson catalogues follow the (still empty)
 * #root (index.html, `#boot-links`, no script):
 *
 *  - with scripts off they show at once (a <noscript> style), WITHOUT the
 *    "taking a while" line (nothing is loading), and pass the design audit
 *    at 390 and 1440 px;
 *  - with scripts on, after the delay (2026-11-19: 2.5 s from the page's
 *    first frame, then a 0.6 s fade; CSS only), each language's line saying
 *    Fermatina is taking a while to start and the lessons can be read
 *    meanwhile, with its two links. True both when the start is slow and
 *    when the app's script failed: until 2026-11-19 the links alone came
 *    after 4 s, and a slow start (a phone on slow 3G draws the app ~4.3 s
 *    after its first frame) flashed them for 0.3 s and took them away;
 *  - once the app has put anything into #root they are gone (display: none,
 *    `#root:not(:empty)+#boot-links`): never shown on a normal start, checked
 *    on every frame from the first; on a slow start they go when it draws.
 * Runs on the dev server and on the build (index.html is the same file; on
 * the build it is served under the production CSP and precached).
 * With HOME_SHOTS=<dir>, the screenshots for the seat and the owner.
 */

/** Each language's line, word for word (index.html; src/site/strings.ts `bootSlow` is checked against it by the build). */
const SLOW = {
  en: 'Fermatina is taking a while to start. Meanwhile, you can read the lessons:',
  pt: 'A Fermatina está a demorar a arrancar. Entretanto, podes ler as lições:',
  es: 'Fermatina está tardando en arrancar. Mientras tanto, puedes leer las lecciones:',
} as const;
const HTML_LANG = { en: 'en', pt: 'pt-PT', es: 'es-ES' } as const;
/** The delay from the page's first frame, and the fade after it (index.html; pinned by src/site/check.ts homeFallbackProblems). */
const DELAY_MS = 2_500;
const FADE_MS = 600;

const LINKS = (() => {
  const json = (l: string) => JSON.parse(fs.readFileSync(`src/i18n/locales/${l}.json`, 'utf8')) as { tracks: { lessonsLabel: string } };
  const NAMES = { en: 'English', pt: 'Português', es: 'Español' } as const;
  const INDEX = { en: '/en/lessons/', pt: '/pt/licoes/', es: '/es/lecciones/' } as const;
  return (['en', 'pt', 'es'] as const).flatMap((l) => [
    { href: `/${l}/`, name: NAMES[l] },
    { href: INDEX[l], name: json(l).tracks.lessonsLabel },
  ]);
})();

/** The entry script: the dev server's module, or the build's hashed file. */
const ENTRY = /\/src\/main\.tsx(?:\?|$)|\/assets\/index-[^/]+\.js$/;

async function expectLinksShown(page: Page, where: string) {
  const box = page.locator('#boot-links');
  await expect(box, where).toBeVisible();
  for (const { href, name } of LINKS) {
    const link = box.locator(`a[href="${href}"]`);
    await expect(link, `${where} ${href}`).toHaveText(name);
    await expect(link, `${where} ${href}`).toBeVisible();
  }
  await expect(box.locator('a'), where).toHaveCount(LINKS.length);
}

/** With scripts on: each language's line, word for word, in that language, above its two links, drawn whole (the fade done). */
async function expectLinesShown(page: Page, where: string) {
  for (const lang of ['en', 'pt', 'es'] as const) {
    const item = page.locator(`#boot-links li[lang="${HTML_LANG[lang]}"]`);
    const line = item.locator('p');
    await expect(line, `${where} ${lang}`).toHaveText(SLOW[lang]);
    await expect(line, `${where} ${lang}`).toBeVisible();
    // Above its links, in its own row.
    const [l, a] = [await line.boundingBox(), await item.locator('a').first().boundingBox()];
    expect(l!.y + l!.height, `${where} ${lang}: the line above its links`).toBeLessThanOrEqual(a!.y + 1);
  }
  await expect(page.locator('#boot-links p'), where).toHaveCount(3);
  await expect.poll(() => page.locator('#boot-links').evaluate((el) => getComputedStyle(el).opacity), { message: `${where}: the fade ends` }).toBe('1');
}

interface Frames { states: string[]; firstFrame: number | null; shownAt: number | null; opaqueAt: number | null; opacities: string[] }
/**
 * Records, from the page's first frame, what the fallback shows on each frame:
 * 'hidden'; 'shown' = the six links AND the three lines visible; 'links
 * without the line' / 'line without the links' (never right with scripts on);
 * 'gone' = display: none. Also the first frame's time, when it was first
 * shown, when its fade ended (opacity 1) and every opacity drawn while shown.
 */
async function recordFrames(page: Page) {
  await page.addInitScript(() => {
    const rec: Frames = { states: [], firstFrame: null, shownAt: null, opaqueAt: null, opacities: [] };
    (window as unknown as { __frames: Frames }).__frames = rec;
    const seen = (el: Element) => {
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility === 'visible' && el.getClientRects().length > 0;
    };
    const look = (now: number) => {
      if (rec.firstFrame === null) rec.firstFrame = now;
      const box = document.getElementById('boot-links');
      let state = 'absent';
      if (box && getComputedStyle(box).display === 'none') state = 'gone';
      else if (box) {
        const links = Array.from(box.querySelectorAll('a'));
        const lines = Array.from(box.querySelectorAll('li > p'));
        const linksShown = links.length === 6 && links.every(seen);
        const linesShown = lines.length === 3 && lines.every(seen);
        state = linksShown && linesShown ? 'shown' : linksShown ? 'links without the line' : linesShown ? 'line without the links' : 'hidden';
        if (state === 'shown' && rec.shownAt === null) rec.shownAt = now;
        if (state === 'shown' && rec.opaqueAt === null && getComputedStyle(box).opacity === '1') rec.opaqueAt = now;
        // Every opacity drawn while shown, in order of first sight: a fade shows values between 0 and 1.
        if (state === 'shown' && !rec.opacities.includes(getComputedStyle(box).opacity)) rec.opacities.push(getComputedStyle(box).opacity);
      }
      if (rec.states[rec.states.length - 1] !== state) rec.states.push(state);
      if (rec.states.length < 20) requestAnimationFrame(look);
    };
    requestAnimationFrame(look);
  });
}
const framesOf = async (page: Page) => {
  const f = await page.evaluate(() => (window as unknown as { __frames: Frames }).__frames);
  // A first frame drawn before the parser reached #boot-links is not a state of the fallback.
  return { ...f, states: f.states[0] === 'absent' ? f.states.slice(1) : f.states };
};

test('the initial HTML of the home page: #root empty, then the six links, with no script of their own', async ({ request }) => {
  const html = await (await request.get('/')).text();
  // The entry script follows the links in index.html; the build moves it into the head.
  const box = html.match(/<div id="root"><\/div>\s*<div id="boot-links" data-nosnippet>([\s\S]*?)<\/div>\s*(?:<script\b[^>]*>\s*<\/script>\s*)*<\/body>/);
  expect(box, 'an empty #root, then the links, the last thing in the body').not.toBeNull();
  for (const { href } of LINKS) expect(box![1]).toContain(`href="${href}"`);
  expect(box![1]).not.toContain('<script');
  // Each language's item opens on its line, then its two links.
  for (const lang of ['en', 'pt', 'es'] as const) {
    expect(box![1], lang).toMatch(new RegExp(`<li lang="${HTML_LANG[lang]}"><p>${SLOW[lang]}</p><a href="/${lang}/">`));
  }
});

test('with scripts off, the home page shows the links at once, without the "taking a while" line (nothing is loading), and they pass the design audit at 390 and 1440 px', async ({ browser, baseURL }) => {
  for (const v of [{ width: 390, height: 844, touch: true }, { width: 1440, height: 900, touch: false }]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: v.width, height: v.height }, isMobile: v.touch, hasTouch: v.touch });
    const page = await context.newPage();
    await page.goto('/');
    const where = `scripts off ${v.width}px`;
    // Shown from the first moment, whole, not after the delay used with scripts on: looked at before any waiting.
    expect(await page.locator('#boot-links').evaluate((el) => [getComputedStyle(el).visibility, getComputedStyle(el).display, getComputedStyle(el).opacity].join()), where).toBe('visible,block,1');
    await expectLinksShown(page, where);
    // The line is in the page (known positive) and not drawn, now or later.
    await expect(page.locator('#boot-links p'), where).toHaveCount(3);
    for (const line of await page.locator('#boot-links p').all()) await expect(line, where).toBeHidden();
    await page.waitForTimeout(DELAY_MS + FADE_MS + 300);
    for (const line of await page.locator('#boot-links p').all()) await expect(line, `${where}, after the delay`).toBeHidden();
    const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
    const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
    expect.soft(r.targets, `${where}: audited no control`).toBeGreaterThanOrEqual(LINKS.length);
    expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
    expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
    expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
    expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
    expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
    const shots = process.env.HOME_SHOTS;
    if (shots) await page.screenshot({ path: `${shots}/home-scripts-off-${v.width}.png` });
    await context.close();
  }
  // On the build each link is a page of the site.
  const ctx = await browser.newContext();
  const isBuild = (await (await ctx.request.get(`${baseURL}/en/`)).text()).includes('<h1 class="hero">');
  if (isBuild) for (const { href } of LINKS) expect((await ctx.request.get(`${baseURL}${href}`)).status(), href).toBe(200);
  await ctx.close();
});

for (const v of [{ width: 390, height: 844, touch: true, scheme: 'light' }, { width: 1440, height: 900, touch: false, scheme: 'dark' }] as const) {
  test(`when the app's script fails to load: nothing until the delay, then each language's line with its links, which pass the design audit (${v.width} px, ${v.scheme === 'light' ? 'day' : 'night'})`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: v.width, height: v.height }, isMobile: v.touch, hasTouch: v.touch, colorScheme: v.scheme });
    // Night = the saved night theme, which index.html's one inline script applies before the first frame.
    if (v.scheme === 'dark') await context.addInitScript(() => localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'fermata-night' }, version: 6 })));
    const page = await context.newPage();
    await recordFrames(page);
    let blocked = 0;
    await page.route(ENTRY, (route) => { blocked++; return route.abort('failed'); });
    await page.goto('/');
    expect(blocked, 'the entry script was found and refused').toBe(1);
    // While the app might still be loading, nothing shows.
    expect(await page.locator('#boot-links').evaluate((el) => getComputedStyle(el).visibility)).toBe('hidden');
    await expect(page.locator('#boot-links')).toBeVisible({ timeout: 8_000 });
    await expectLinksShown(page, 'script failed');
    await expectLinesShown(page, 'script failed');
    const f = await framesOf(page);
    expect(f.states, 'hidden, then the line and the links together').toEqual(['hidden', 'shown']);
    // The delay counts from the page's first frame (when the app's stylesheet has arrived), then the fade.
    expect(f.shownAt! - f.firstFrame!, 'shown after the delay').toBeGreaterThanOrEqual(DELAY_MS - 100);
    expect(f.shownAt! - f.firstFrame!, 'shown at the delay (the page is idle: the next frame sees it)').toBeLessThanOrEqual(DELAY_MS + 700);
    // Then the fade, its length bounded both ways (a 3 s fade, or none, fails), with values between 0 and 1 drawn.
    expect(f.opaqueAt! - f.shownAt!, 'then a fade of its length').toBeGreaterThanOrEqual(FADE_MS - 150);
    expect(f.opaqueAt! - f.shownAt!, 'a fade of its length, no longer').toBeLessThanOrEqual(FADE_MS + 500);
    expect(f.opacities.filter((o) => o !== '1').length, `drawn part-way through the fade: ${f.opacities.join(' ')}`).toBeGreaterThan(0);
    const where = `script failed ${v.width}px ${v.scheme}`;
    // The app's colours: on the build its stylesheet is in index.html's head; the dev server injects it from the refused script.
    if (await page.locator('link[rel="stylesheet"][href^="/assets/"]').count()) {
      expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), where).toBe(v.scheme === 'light' ? 'rgb(245, 239, 226)' : 'rgb(24, 18, 8)');
    }
    const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
    const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
    expect.soft(r.textNodes, `${where}: audited no text`).toBeGreaterThan(5);
    expect.soft(r.targets, `${where}: audited no control`).toBeGreaterThanOrEqual(LINKS.length);
    expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
    expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
    expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
    expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
    expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
    const shots = process.env.HOME_SHOTS;
    if (shots) await page.screenshot({ path: `${shots}/home-script-failed-${v.width}-${v.scheme === 'light' ? 'day' : 'night'}.png` });
    await context.close();
  });
}

test('under reduced motion, when the app\'s script fails: still nothing until the delay, then the block whole at once, no fade (the app\'s own reduced-motion rule, build only)', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  // src/index.css shortens every animation to 0.01 ms under reduced motion; on the build its stylesheet is in index.html's
  // head, while the dev server injects it from the very script refused here, so there is nothing to test there.
  await page.goto('/en/');
  test.skip(!(await page.content()).includes('<h1 class="hero">'), 'the app\'s stylesheet arrives with the refused script on the dev server: run with playwright.preview.config.ts');
  await recordFrames(page);
  await page.route(ENTRY, (route) => route.abort('failed'));
  await page.goto('/');
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'reduced motion is on (known positive)').toBe(true);
  expect(await page.locator('#boot-links').evaluate((el) => getComputedStyle(el).visibility)).toBe('hidden');
  await expect(page.locator('#boot-links')).toBeVisible({ timeout: 8_000 });
  await expectLinksShown(page, 'reduced motion');
  await expectLinesShown(page, 'reduced motion');
  const f = await framesOf(page);
  expect(f.states).toEqual(['hidden', 'shown']);
  // The delay still applies, both ways.
  expect(f.shownAt! - f.firstFrame!, 'shown after the delay').toBeGreaterThanOrEqual(DELAY_MS - 100);
  expect(f.shownAt! - f.firstFrame!, 'shown at the delay').toBeLessThanOrEqual(DELAY_MS + 700);
  // Whole at once: the first frame that shows it draws it at full opacity, and no other opacity is ever drawn.
  expect(f.opaqueAt, 'whole on the frame it appears').toBe(f.shownAt);
  expect(f.opacities).toEqual(['1']);
  await context.close();
});

test('a slow normal start (the entry script 5 s late): after the delay the lines and links, true while the app loads; they go when it draws, at once and for good', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await recordFrames(page);
  let held = 0;
  await page.route(ENTRY, async (route) => {
    held++;
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    await route.continue();
  });
  // Not waiting for "load" (nor DOMContentLoaded): both wait for the held module script, by when the app has drawn.
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.locator('#boot-links')).toBeVisible({ timeout: 8_000 });
  await expectLinksShown(page, 'slow start');
  await expectLinesShown(page, 'slow start');
  const shots = process.env.HOME_SHOTS;
  if (shots) await page.screenshot({ path: `${shots}/home-slow-start-390-day.png` });
  // The app arrives and draws: the fallback goes at once.
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 30_000 });
  expect(await page.locator('#boot-links').evaluate((el) => getComputedStyle(el).display)).toBe('none');
  await page.waitForTimeout(1_000);
  expect(await page.locator('#boot-links').evaluate((el) => getComputedStyle(el).display)).toBe('none');
  expect(held, 'the entry script was held once').toBe(1);
  const f = await framesOf(page);
  // Never the links without their line, never a second appearance: hidden, shown, gone.
  expect(f.states).toEqual(['hidden', 'shown', 'gone']);
  expect(f.shownAt! - f.firstFrame!, 'shown after the delay').toBeGreaterThanOrEqual(DELAY_MS - 100);
  expect(f.shownAt! - f.firstFrame!, 'shown at the delay').toBeLessThanOrEqual(DELAY_MS + 700);
  expect(f.opaqueAt! - f.shownAt!, 'then a fade of its length').toBeGreaterThanOrEqual(FADE_MS - 150);
  expect(f.opaqueAt! - f.shownAt!, 'a fade of its length, no longer').toBeLessThanOrEqual(FADE_MS + 500);
  if (shots) await page.screenshot({ path: `${shots}/home-slow-start-drawn-390-day.png` });
});

test('on a normal start the links are never shown, on any frame, and are gone (display: none) once the app has drawn', async ({ page, browser }) => {
  // The dev server compiles the app's modules on their first request, which no
  // real start pays: load it once in another context first (on the build this
  // changes nothing for the page below: its own cache and storage are empty).
  const warm = await browser.newContext();
  const warmPage = await warm.newPage();
  await warmPage.goto('/');
  await expect(warmPage.locator('#root > *').first()).toBeVisible({ timeout: 20_000 });
  await warm.close();
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { __boot: string[] }).__boot = seen;
    const look = () => {
      const el = document.getElementById('boot-links');
      const style = el && getComputedStyle(el);
      const state = !el ? 'absent' : style!.display === 'none' ? 'gone' : style!.visibility === 'visible' && el.getClientRects().length ? 'visible' : 'hidden';
      if (seen[seen.length - 1] !== state) seen.push(state);
      if (seen.length < 50) requestAnimationFrame(look);
    };
    requestAnimationFrame(look);
    document.addEventListener('readystatechange', look);
  });
  await page.goto('/');
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
  const display = () => page.locator('#boot-links').evaluate((el) => getComputedStyle(el).display);
  expect(await display()).toBe('none');
  await expect(page.locator('#boot-links')).toBeHidden();
  await page.waitForTimeout(DELAY_MS + FADE_MS + 500); // past the delay and the fade: nothing comes back
  expect(await display()).toBe('none');
  await expect(page.getByRole('link', { name: 'Português' })).toHaveCount(0); // not in the accessibility tree either
  const seen = await page.evaluate(() => (window as unknown as { __boot: string[] }).__boot);
  // Known positive: the document turns "interactive" before module scripts run, so the probe saw the links in the page, hidden.
  expect(seen).toContain('hidden');
  expect(seen).not.toContain('visible');
  expect(seen[seen.length - 1]).toBe('gone');
});

test('while hidden, the links ask for no font of their own: until the app\'s script has arrived, only the two preloaded faces are fetched', async ({ page }) => {
  test.setTimeout(60_000);
  // An italic heading once made the browser fetch the italic face as soon as the stylesheet arrived, beside the
  // app's script: on a slow connection the app drew ~600 ms later (measured 2026-11-18). The links use the preloaded face only.
  // A slow connection (1.6 Mb/s, 150 ms), so the entry script takes a while to arrive and a face fetched early shows.
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  await page.goto('/');
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 25_000 });
  await expect.poll(() => page.evaluate(() => performance.getEntriesByType('resource').some((e) => e.name.includes('/fonts/source-serif-4-italic-latin.woff2'))), { timeout: 20_000 }).toBe(true);
  const fonts = await page.evaluate(() => {
    const all = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const entry = all.find((e) => /\/assets\/index-[^/]+\.js$|\/src\/main\.tsx(?:\?|$)/.test(e.name))!;
    const faces = all.filter((e) => e.name.includes('/fonts/'));
    return {
      entryEnd: entry ? entry.responseEnd : null,
      before: faces.filter((e) => e.startTime < entry.responseEnd).map((e) => new URL(e.name).pathname).sort(),
      after: faces.filter((e) => e.startTime >= entry.responseEnd).map((e) => new URL(e.name).pathname),
    };
  });
  expect(fonts.entryEnd, 'the entry script was found').not.toBeNull();
  expect(fonts.before).toEqual(['/fonts/fermata-accidentals.woff2', '/fonts/source-serif-4-latin.woff2']);
  expect(fonts.after, 'known positive: the app itself asks for the italic face once it runs').toContain('/fonts/source-serif-4-italic-latin.woff2');
});
