import { test, expect, type Browser, type BrowserContextOptions, type Page } from '@playwright/test';
import fs from 'node:fs';

/**
 * Shared links (wave 1, stream E), dev server and preview (production
 * headers + service worker):
 *  - a student who has never opened Fermatina opens "D major, the A chord, on
 *    guitar" and sees exactly that (phone and laptop); the address bar is
 *    clean afterwards;
 *  - a lesson link opens the lesson;
 *  - a link opened during a check does not lose the check: it waits, then
 *    offers itself with "Open";
 *  - a link opened in a second tab, the first on Learn, draws Explore with
 *    the link, the CPU slowed (release 17 removed the exit that held it back);
 *  - while the link's own code is on its way, the loading sign and no view,
 *    no history written; another view chosen meanwhile draws and the link is
 *    offered; code that cannot be fetched says so, and Try Again opens the
 *    link (this entry's state kept);
 *  - the learner is free until the link is APPLIED (review S-1): Try Again
 *    reloads exactly the address opened, in every form; a lesson offered is
 *    named in PT / ES also when the titles come late; leaving during the
 *    titles, a key from Quick Search, the instrument switch, a capo from
 *    Settings, Back to another screen of the same view and a lesson opened
 *    while on Learn all end the wait and the link is offered; the tour holds
 *    the link until it has ended ("Open" tapped while it plays included);
 *    another tab, ?lang=, ?start= and notes played do not; offline, Try
 *    Again keeps the page and the link;
 *  - "Copy link" puts the expected address on the clipboard (laptop) or in
 *    the share sheet (phone), and when the browser refuses both, the link is
 *    shown in a selectable field;
 *  - preview only: a link opened in an app the service worker already
 *    controls, and offline.
 * Screenshots: SHARE_SHOTS=<dir>.
 */

const SHOTS = process.env.SHARE_SHOTS;
const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const LAPTOP = { viewport: { width: 1440, height: 900 } };
const DEVICES = [
  { name: 'phone', opts: PHONE },
  { name: 'laptop', opts: LAPTOP },
] as const;

const LINK = '/?key=D&scale=major&chord=A&inst=guitar';

async function newPage(browser: Browser, opts: BrowserContextOptions, seed?: object) {
  const context = await browser.newContext({ reducedMotion: 'reduce', ...opts });
  if (seed) {
    await context.addInitScript((blob) => {
      if (sessionStorage.getItem('__seeded')) return;
      localStorage.setItem('music-theory-app', blob);
      sessionStorage.setItem('__seeded', '1');
    }, JSON.stringify(seed));
  }
  const page = await context.newPage();
  return { context, page };
}

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
}

async function expectDMajorAChordGuitar(page: Page) {
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('key-summary')).toContainText('D Major');
  await expect(page.getByTestId('chord-detail').locator('h3')).toContainText('A');
  await expect(page.getByTestId('chord-detail').locator('h3')).toContainText('Major');
  await expect(page.getByRole('radio', { name: 'Guitar' }).first()).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('[role="grid"]').first()).toBeVisible();
  // The address bar is clean: a refresh does not open the link again.
  expect(new URL(page.url()).search).toBe('');
}

for (const d of DEVICES) {
  test(`${d.name}: a cold open of a key + chord + guitar link shows exactly that`, async ({ browser }) => {
    const { context, page } = await newPage(browser, d.opts);
    await page.goto(LINK);
    await expectDMajorAChordGuitar(page);
    await shot(page, `share-cold-open-${d.name}-day-en`);
    // A refresh keeps it (saved as the learner's own selection) and opens no link again.
    await page.reload();
    await expect(page.getByTestId('key-summary')).toContainText('D Major');
    await expect(page.getByTestId('toast-region')).not.toContainText('link');
    await context.close();
  });

  test(`${d.name}: a lesson link opens that lesson; the address bar is clean`, async ({ browser }) => {
    const { context, page } = await newPage(browser, d.opts);
    await page.goto('/?lesson=l2u5m3');
    await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
    expect(new URL(page.url()).search).toBe('');
    await shot(page, `share-lesson-open-${d.name}-day-en`);
    await context.close();
  });
}

test('a broken or hostile link opens the app as usual and says so', async ({ browser }) => {
  const { context, page } = await newPage(browser, LAPTOP);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`/?key=%3Cscript%3Ealert(1)%3C%2Fscript%3E&scale=constructor&chord=${'C7'.repeat(40)}&lesson=..%2F..%2F&inst=banjo`);
  await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('toast-region')).toContainText('This link could not be read, so Fermatina opened as usual.');
  await expect(page.getByTestId('key-summary')).toContainText('C Major');
  expect(new URL(page.url()).search).toBe('');
  expect(errors).toEqual([]);
  await context.close();
});

test('a link opened during a check does not lose the check; it waits, then offers “Open”', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await newPage(browser, PHONE);
  await page.goto('/?lesson=l2u5m3');
  await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('section-picker').getByRole('button', { name: 'Check', exact: true }).click();
  await page.getByRole('button', { name: 'Start the check' }).click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  // Answer the first question (right or wrong: either is work in progress).
  await page.getByTestId('check-answers').locator('button').first().click();
  await page.getByRole('button', { name: 'Submit' }).click();
  const pips = await page.getByTestId('check-pips').innerHTML();
  const position = await page.getByTestId('check-position').textContent();

  // The teacher's link arrives (opened in this tab).
  await page.goto(LINK);
  await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('check-position')).toHaveText(position!);
  expect(await page.getByTestId('check-pips').innerHTML()).toBe(pips);
  await expect(page.getByTestId('toast-region')).toContainText('This link opens D Major, the A chord, on the guitar. Fermatina will offer to open it when you have finished what you are doing.');
  expect(new URL(page.url()).search).toBe('');
  await shot(page, 'share-held-during-check-phone-day-en');

  // Leaving the check ends the work: the link offers itself.
  await page.getByRole('button', { name: 'Exit the check' }).click();
  const open = page.getByTestId('toast-region').getByRole('button', { name: 'Open' });
  await expect(open).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId('toast-region')).toContainText('Ready to open the link: D Major, the A chord, on the guitar');
  await shot(page, 'share-ready-offer-phone-day-en');
  await open.click();
  await expectDMajorAChordGuitar(page);
  await context.close();
});

// A link opened in a SECOND tab of the same browser (shared storage), the
// first tab on Learn: the new tab boots on Learn (the last view saved) and the
// link switches it to Explore. Until release 17 the views sat in
// framer-motion's AnimatePresence, mode "wait": when the link's switch landed
// within a few milliseconds of Learn's empty panel being mounted, that panel
// never started its exit, so Explore's panel, waiting for it, never came, and
// the piano showed the link's key over an empty work area (on the build with
// the CPU slowed 6×: 60 of 60 at 153caab; 0 of 60 at 57cda40, which unmounts a
// view at once). The CPU is slowed on purpose (Chromium, DevTools Protocol) and
// the whole walk runs three times, each in a fresh browser context: with that
// exit put back, one walk caught it 36 times in 40 on the build, and the three
// walks 20 times in 20. The dev server delivers the link's code module by
// module, after that window (0 of 30 there with the exit put back): there it
// is caught by src/__tests__/viewLeavesAtOnce.test.tsx.
test('a link opened in a second tab, the first on Learn, draws Explore with the link (CPU slowed 6×)', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'CPU throttling is Chromium’s (DevTools Protocol)');
  test.setTimeout(120_000);
  for (let walk = 1; walk <= 3; walk++) {
    const { context, page } = await newPage(browser, LAPTOP);
    await page.goto('/');
    await page.locator('[role="tab"][data-tab="learn"]').click();
    await expect(page.locator('#learn-panel h1').first()).toBeVisible({ timeout: 15_000 });
    // The view the next tab boots on.
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.lastView)).toBe('learn');

    const second = await context.newPage();
    const cdp = await context.newCDPSession(second);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    await second.goto('/?key=G&scale=major');
    await expect(second.getByTestId('key-summary'), `walk ${walk}: Explore's work area, with the link's key`).toContainText('G Major', { timeout: 15_000 });
    await expect(second.locator('[role="tab"][data-tab="explore"]')).toHaveAttribute('aria-selected', 'true');
    // Drawn, not only present: Explore's panel is the one view panel, at full
    // opacity (Playwright counts opacity 0 as visible).
    await expect.poll(() => second.evaluate(() => Array.from(document.querySelectorAll('#explore-panel, #learn-panel, #drill-panel'), (p) => `${p.id} ${getComputedStyle(p).opacity}`)), { timeout: 10_000 }).toEqual(['explore-panel 1']);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    if (walk === 1) await shot(second, 'share-second-tab-laptop-day-en');
    await context.close();
  }
});

// ── The link's own code on its way, or failing (leftovers round, S2 / S3) ──
// The code that opens a link (services/shareLinkOpen.ts) is its own chunk on
// the build and its own module on the dev server: a route holds it back until
// the test lets it go, or aborts it as a dropped connection does.
const LINK_CODE = /\/(assets\/shareLinkOpen-[^/]*\.js|src\/services\/shareLinkOpen\.ts)(\?.*)?$/;
// No service worker: once one controls the page it serves the code from its
// precache, where no route can hold or abort it (a learner then gets it).
const NO_WORKER = { ...LAPTOP, serviceWorkers: 'block' as const };

async function holdLinkCode(page: Page) {
  let release!: () => void;
  const released = new Promise<void>((r) => {
    release = r;
  });
  let asked = 0;
  await page.route(LINK_CODE, async (route) => {
    asked++;
    await released;
    await route.continue();
  });
  return { release, asked: () => asked };
}

const dockTop = (page: Page) => page.locator('[data-testid="instrument-dock"]').evaluate((d) => d.getBoundingClientRect().top);

test('while the link’s own code is on its way the work area shows the loading sign, no view under it; then the link, no other key first', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER);
  // Every text the key summary ever shows in this page.
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { __keys: string[] }).__keys = seen;
    new MutationObserver(() => {
      const k = document.querySelector('[data-testid="key-summary"]')?.textContent;
      if (k && seen[seen.length - 1] !== k) seen.push(k);
    }).observe(document, { subtree: true, childList: true, characterData: true });
  });
  const code = await holdLinkCode(page);
  await page.goto('/?key=G&scale=major');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  // Held: the loading sign a view shows while its own code loads, and no view mounted under it.
  const loading = page.locator('#explore-panel').getByTestId('view-loading');
  await expect(loading).toBeVisible();
  await expect(page.getByTestId('key-summary')).toHaveCount(0);
  expect(new URL(page.url()).search).toBe('');
  await shot(page, 'share-link-code-held-laptop-day-en');
  const held = await dockTop(page);
  // The history module arrives during the wait and writes its one entry; after that nothing is
  // written until the link applies, and no view is mounted (the panel holds the loading sign only).
  await expect.poll(() => page.evaluate(() => (history.state as { fm?: number } | null)?.fm ?? 0), { timeout: 10_000 }).toBe(1);
  const entry = () => page.evaluate(() => ({ length: history.length, state: JSON.stringify(history.state) }));
  const before = await entry();
  await page.waitForTimeout(600);
  expect(await entry()).toEqual(before);
  await expect(page.locator('#explore-panel > *')).toHaveCount(1);
  await expect(page.locator('#explore-panel h1, #explore-panel h2')).toHaveCount(0);

  code.release();
  await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
  await expect(loading).toHaveCount(0);
  expect((await entry()).length, 'the link applied without a new entry').toBe(before.length);
  expect(await page.evaluate(() => (window as unknown as { __keys: string[] }).__keys)).toEqual(['G Major · 1♯ · relative E minor']);
  // The instrument holds still from the loading sign to the link's view (two-sided).
  expect(Math.abs((await dockTop(page)) - held)).toBeLessThanOrEqual(1);
  await context.close();
});

test('going to another view while the link’s own code is on its way: that view draws, and the link is offered with “Open”, never applied over it', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER);
  const code = await holdLinkCode(page);
  await page.goto('/?key=G&scale=major');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);

  await page.locator('[role="tab"][data-tab="learn"]').click();
  await expect(page.locator('#learn-panel h1').first()).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('view-loading')).toHaveCount(0);

  code.release();
  const open = page.getByTestId('toast-region').getByRole('button', { name: 'Open' });
  await expect(open).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('toast-region')).toContainText('Ready to open the link: G Major');
  await expect(page.locator('[role="tab"][data-tab="learn"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#learn-panel h1').first()).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.selectedKey?.natural ?? 'C'), 'not applied over Learn').toBe('C');

  await open.click();
  await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
  await context.close();
});

test('a link whose own code cannot be fetched: the app opens as usual and says so; Try Again opens it, a failure again says so again', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER);
  let fail = true;
  let asked = 0;
  await page.route(LINK_CODE, (route) => {
    asked++;
    return fail ? route.abort('internetdisconnected') : route.continue();
  });
  const region = page.getByTestId('toast-region');
  const tryAgain = region.getByRole('button', { name: 'Try Again' });

  await page.goto('/?key=G&scale=major');
  await expect(page.getByTestId('key-summary')).toContainText('C Major', { timeout: 15_000 });
  await expect(region).toContainText('The link could not open.');
  await expect(page.getByTestId('view-loading')).toHaveCount(0);
  expect(new URL(page.url()).search).toBe('');
  expect(asked).toBe(1);
  await shot(page, 'share-link-code-failed-laptop-day-en');

  // Two screens on (Learn, then Explore: two entries of this tab), then Try Again: the page
  // reloads on the link's address with this entry's state kept (the same entry, no new one).
  await page.locator('[role="tab"][data-tab="learn"]').click();
  await expect(page.locator('#learn-panel h1').first()).toBeVisible({ timeout: 15_000 });
  await page.locator('[role="tab"][data-tab="explore"]').click();
  await expect(page.getByTestId('key-summary')).toContainText('C Major', { timeout: 15_000 });
  const entry = () => page.evaluate(() => ({ length: history.length, i: (history.state as { i?: number } | null)?.i }));
  const before = await entry();
  expect(before.i).toBe(2);

  // It fails again and says so again.
  await tryAgain.click();
  await expect.poll(() => asked, { timeout: 15_000 }).toBe(2);
  await expect(tryAgain).toBeVisible({ timeout: 15_000 });
  await expect(region).toContainText('The link could not open.');
  await expect(page.getByTestId('key-summary')).toContainText('C Major');
  expect(new URL(page.url()).search).toBe('');
  await expect.poll(entry, { timeout: 10_000 }).toEqual(before);

  // The connection is back: Try Again opens the link as a first visit does.
  fail = false;
  await tryAgain.click();
  await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
  expect(asked).toBe(3);
  await expect(region).not.toContainText('The link could not open.');
  expect(new URL(page.url()).search).toBe('');
  await context.close();
});

// Every address a document of this page was loaded with, kept across reloads (sessionStorage).
async function recordBoots(page: Page) {
  await page.addInitScript(() => {
    const boots = JSON.parse(sessionStorage.getItem('__boots') ?? '[]') as string[];
    boots.push(location.href);
    sessionStorage.setItem('__boots', JSON.stringify(boots));
  });
  return () => page.evaluate(() => JSON.parse(sessionStorage.getItem('__boots') ?? '[]') as string[]);
}

test('Try Again reloads EXACTLY the address the page was opened with, in every form a link takes', async ({ browser, baseURL }) => {
  test.setTimeout(120_000);
  const FORMS = [
    '/?key=G&scale=major',
    '/?key=F#&inst=guitar', // a link's own # makes a fragment: ?key=F with #&inst=guitar
    '/?chord=F#m7',
    '/?prog=F#m7,B7',
    '/?lang=pt&key=D&scale=major',
    '/?view=drill&key=D',
    '/?utm_source=chat&key=D&chord=A',
    '/?lang=pt&view=drill&utm_source=chat&key=D#intro',
  ];
  for (const form of FORMS) {
    const { context, page } = await newPage(browser, NO_WORKER);
    const boots = await recordBoots(page);
    await page.route(LINK_CODE, (route) => route.abort('internetdisconnected'));
    await page.goto(form);
    const tryAgain = page.getByTestId('toast-region').getByRole('button', { name: /^(Try Again|Tentar novamente)$/ });
    await expect(tryAgain, form).toBeVisible({ timeout: 15_000 });
    expect(await boots(), form).toEqual([`${baseURL}${form}`]);
    await tryAgain.click();
    await expect.poll(async () => (await boots()).length, { message: form, timeout: 15_000 }).toBe(2);
    expect((await boots())[1], `${form}: the reloaded document`).toBe(`${baseURL}${form}`);
    await context.close();
  }
});

// The lesson titles in Portuguese and Spanish are their own chunk (module on the dev server).
const TITLES = (lang: 'pt' | 'es') => new RegExp(`/(assets/i18n-moduleTitles\\.${lang}-[^/]*\\.js|src/data/moduleTitles\\.${lang}\\.ts)(\\?.*)?$`);

async function holdTitles(page: Page, lang: 'pt' | 'es') {
  let release!: () => void;
  const released = new Promise<void>((r) => {
    release = r;
  });
  let asked = 0;
  await page.route(TITLES(lang), async (route) => {
    asked++;
    await released;
    await route.continue();
  });
  return { release, asked: () => asked };
}

const LESSON_OFFER = {
  pt: ['Já podes abrir a ligação: a lição «Tonalidades relativas e homónimas»', 'Abrir'],
  es: ['Ya puedes abrir el enlace: la lección «Tonalidades relativas y homónimas»', 'Abrir'],
} as const;

test('a lesson offered names its title in the learner’s language (PT, ES), also when that language’s titles arrive after the code', async ({ browser }) => {
  test.setTimeout(90_000);
  for (const lang of ['pt', 'es'] as const) {
    const { context, page } = await newPage(browser, NO_WORKER, { state: { language: lang }, version: 6 });
    const code = await holdLinkCode(page);
    const titles = await holdTitles(page, lang);
    await page.goto('/?lesson=l2u5m3');
    await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
    // The learner goes to Drill while the link's code is on its way.
    await page.locator('[role="tab"][data-tab="drill"]').click();
    await expect(page.locator('#drill-panel h1, #drill-panel h2').first()).toBeVisible({ timeout: 15_000 });
    code.release();
    await expect.poll(titles.asked, { message: `${lang}: the link's code asks for the titles`, timeout: 15_000 }).toBe(1);
    await page.waitForTimeout(500);
    const region = page.getByTestId('toast-region');
    await expect(region.getByRole('button', { name: LESSON_OFFER[lang][1] }), `${lang}: no offer before the titles (it would be in English)`).toHaveCount(0);
    titles.release();
    await expect(region).toContainText(LESSON_OFFER[lang][0], { timeout: 15_000 });
    await expect(page.locator('[role="tab"][data-tab="drill"]')).toHaveAttribute('aria-selected', 'true');
    await context.close();
  }
});

test('the learner is free until the link is applied: leaving after its code has arrived, while the lesson titles are on their way, draws that place at once and offers the link', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER, { state: { language: 'pt' }, version: 6 });
  const titles = await holdTitles(page, 'pt');
  await page.goto('/?lesson=l2u5m3');
  await expect.poll(titles.asked, { timeout: 15_000 }).toBe(1);
  await expect(page.getByTestId('view-loading')).toBeVisible();
  await page.locator('[role="tab"][data-tab="drill"]').click();
  await expect(page.locator('#drill-panel h1, #drill-panel h2').first()).toBeVisible({ timeout: 5_000 });
  await expect(page.getByTestId('view-loading')).toHaveCount(0);
  titles.release();
  await expect(page.getByTestId('toast-region')).toContainText(LESSON_OFFER.pt[0], { timeout: 15_000 });
  await expect(page.locator('[role="tab"][data-tab="drill"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#learn-panel')).toHaveCount(0);
  await context.close();
});

test('a key chosen through Quick Search while the link waits, in the same view: drawn at once, never overwritten; the link is offered', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER);
  const code = await holdLinkCode(page);
  await page.goto('/?key=G&scale=major');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  // E♭ major: only the key changes (the scale stays major), so this row alone sees the key watched.
  await page.keyboard.press('Control+k');
  const input = page.getByRole('dialog').locator('input');
  await input.fill('Eb major');
  await expect(page.getByRole('dialog').getByRole('option').first()).toContainText('E♭ Major');
  await input.press('Enter');
  await expect(page.getByTestId('key-summary')).toContainText('E♭ Major', { timeout: 15_000 });
  await expect(page.getByTestId('view-loading')).toHaveCount(0);

  code.release();
  const region = page.getByTestId('toast-region');
  await expect(region).toContainText('Ready to open the link: G Major', { timeout: 15_000 });
  await expect(page.getByTestId('key-summary')).toContainText('E♭ Major');
  await region.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
  await context.close();
});

test('the instrument switched while the link waits: drawn at once, never overwritten; the link is offered', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER);
  const code = await holdLinkCode(page);
  await page.goto('/?key=G&scale=major&inst=piano');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  await page.getByRole('radio', { name: 'Guitar' }).first().click();
  await expect(page.getByTestId('key-summary')).toContainText('C Major', { timeout: 15_000 });
  await expect(page.locator('[role="grid"]').first()).toBeVisible();
  code.release();
  await expect(page.getByTestId('toast-region')).toContainText('Ready to open the link: G Major, on the piano', { timeout: 15_000 });
  await expect(page.getByRole('radio', { name: 'Guitar' }).first()).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByTestId('key-summary')).toContainText('C Major');
  await context.close();
});

const WAITING_D = 'This link opens D Major. Fermatina will offer to open it when you have finished what you are doing.';

test('the tour asked for while the link waits: the view is drawn for it; the link is held while it plays and offered once it has ended (Escape)', async ({ browser }) => {
  test.setTimeout(60_000);
  const { context, page } = await newPage(browser, NO_WORKER);
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { __keys: string[] }).__keys = seen;
    new MutationObserver(() => {
      const k = document.querySelector('[data-testid="key-summary"]')?.textContent;
      if (k && seen[seen.length - 1] !== k) seen.push(k);
    }).observe(document, { subtree: true, childList: true, characterData: true });
  });
  const code = await holdLinkCode(page);
  // D major: the tour shows G major itself, so the link's key must differ.
  await page.goto('/?key=D&scale=major');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  await page.getByTestId('app-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Show me around' }).click();
  await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('view-loading')).toHaveCount(0);
  // The tour's own first step (a key of its own); an Escape before it has run is the tour's own
  // known limit (it then keeps that key), not this row's subject.
  await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
  // Asked for, the tour ended the wait at once: Explore was drawn with the key the tour found
  // (C) before its first step set its own (G). Left to that step, the view would come only with G.
  const keys = await page.evaluate(() => (window as unknown as { __keys: string[] }).__keys.map((k) => k.split(' · ')[0]));
  expect(keys.slice(0, 2), 'the view drawn when the tour was asked for, before its first step').toEqual(['C Major', 'G Major']);
  code.release();
  const region = page.getByTestId('toast-region');
  // While the tour plays: the link waits (its end would put back what it found), no "Open".
  await expect(region).toContainText(WAITING_D, { timeout: 15_000 });
  await page.waitForTimeout(2000);
  await expect(region.getByRole('button', { name: 'Open' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('tour-bar')).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByTestId('key-summary'), 'the tour put back what it found').toContainText('C Major', { timeout: 15_000 });
  await expect(region).toContainText('Ready to open the link: D Major', { timeout: 15_000 });
  await region.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByTestId('key-summary')).toContainText('D Major', { timeout: 15_000 });
  await context.close();
});

test('“Open” tapped while the tour plays waits for the tour’s end (“Put things back”), one toast at a time, then the link opens', async ({ browser }) => {
  test.setTimeout(120_000);
  const { context, page } = await newPage(browser, NO_WORKER);
  const code = await holdLinkCode(page);
  await page.goto('/?key=D&scale=major');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  // The learner goes to Learn while the link waits: it is offered.
  await page.locator('[role="tab"][data-tab="learn"]').click();
  await expect(page.locator('#learn-panel h1').first()).toBeVisible({ timeout: 15_000 });
  code.release();
  const region = page.getByTestId('toast-region');
  const open = region.getByRole('button', { name: 'Open' });
  await expect(open).toBeVisible({ timeout: 15_000 });
  // Then the tour, and "Open" tapped while it plays.
  await page.getByTestId('app-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Show me around' }).click();
  await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 }); // the tour's own key
  await open.click();
  await expect(region).toContainText(WAITING_D);
  await expect(open).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.selectedKey?.natural ?? 'C'), 'not applied under the tour').not.toBe('D');
  // To the tour's end card, then "Put things back".
  const caption = page.getByTestId('tour-caption');
  for (let i = 0; i < 16 && !(await page.getByTestId('tour-restore').count()); i++) {
    await page.waitForTimeout(1200);
    const before = (await caption.textContent()) ?? '';
    await page.getByTestId('tour-next').click();
    await expect(caption).not.toHaveText(before, { timeout: 15_000 });
    await expect(open, 'no offer while the tour plays').toHaveCount(0);
  }
  await page.getByTestId('tour-restore').click();
  await expect(page.getByTestId('tour-bar')).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator('#learn-panel h1').first(), 'the tour put back what it found').toBeVisible({ timeout: 15_000 });
  await expect(open).toBeVisible({ timeout: 15_000 });
  await expect(open).toHaveCount(1);
  await open.click();
  await expect(page.getByTestId('key-summary')).toContainText('D Major', { timeout: 15_000 });
  await context.close();
});

test('Back to another screen of the same view while the link waits: that screen is drawn and the link offered, never applied over it', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await newPage(browser, NO_WORKER);
  let mode: 'fail' | 'hold' = 'fail';
  let release!: () => void;
  const held = new Promise<void>((r) => {
    release = r;
  });
  let asked = 0;
  await page.route(LINK_CODE, async (route) => {
    asked++;
    if (mode === 'fail') return route.abort('internetdisconnected');
    await held;
    await route.continue();
  });
  await page.goto('/?key=G&scale=major');
  const region = page.getByTestId('toast-region');
  const tryAgain = region.getByRole('button', { name: 'Try Again' });
  await expect(tryAgain).toBeVisible({ timeout: 15_000 });
  // Screens of Learn, each an entry of this tab, which the reload of Try Again keeps.
  await page.locator('[role="tab"][data-tab="learn"]').click();
  await page.getByRole('button', { name: /Foundations of Music Literacy/ }).first().click();
  await page.locator('#learn-panel').getByRole('button', { name: /Rhythm and Metre/ }).first().click();
  await page.locator('#learn-panel').getByRole('button', { name: /Note Values and Rests/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Note Values and Rests' })).toBeVisible({ timeout: 15_000 });
  const onLesson = await page.evaluate(() => history.state as { i: number; v: string; s?: string });
  // Try Again with the code held: the page reloads on the lesson's entry and waits.
  mode = 'hold';
  await tryAgain.click();
  await expect.poll(() => asked, { timeout: 15_000 }).toBe(2);
  await expect(page.getByTestId('view-loading')).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => page.evaluate(() => (history.state as { s?: string } | null)?.s)).toBe(onLesson.s);
  // Back: the unit's page, another screen of the same view (Learn).
  await page.goBack();
  await expect(page.locator('#learn-panel').getByRole('heading', { name: 'Rhythm and Metre' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('view-loading')).toHaveCount(0);
  const onUnit = await page.evaluate(() => history.state as { i: number; v: string; s?: string });
  expect(onUnit.i).toBe(onLesson.i - 1);
  release();
  await expect(region).toContainText('Ready to open the link: G Major', { timeout: 15_000 });
  await expect(page.locator('[role="tab"][data-tab="learn"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#learn-panel').getByRole('heading', { name: 'Rhythm and Metre' })).toBeVisible();
  expect(await page.evaluate(() => history.state), 'the entry is not rewritten by the link').toEqual(onUnit);
  await context.close();
});

// A check in progress on a laptop: Level 1 → "Rhythm and Metre" → "Note Values and Rests", one answer given.
async function checkInProgress(page: Page) {
  await page.locator('[role="tab"][data-tab="learn"]').click();
  await page.getByRole('button', { name: /Foundations of Music Literacy/ }).first().click();
  await page.locator('#learn-panel').getByRole('button', { name: /Rhythm and Metre/ }).first().click();
  await page.locator('#learn-panel').getByRole('button', { name: /Note Values and Rests/ }).first().click();
  await page.getByTestId('check-start').click();
  await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('check-answers').locator('button').first().click();
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
}

test('the learner moves while the link waits AND a check is in progress: held with the waiting line, no “Open” while the check is on, their choice kept, offered once the check is left', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await newPage(browser, NO_WORKER);
  await page.goto('/');
  await checkInProgress(page);
  // The link arrives in this tab (its code held): the check is saved, the page reloads on the link.
  const code = await holdLinkCode(page);
  await page.goto('/?key=G&scale=major&capo=2');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  await expect(page.getByTestId('view-loading')).toBeVisible();
  // The learner changes something the link sets: the capo, in Settings.
  await page.getByTestId('app-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await page.getByRole('dialog').getByRole('combobox', { name: /capo/i }).first().selectOption({ label: 'Capo 3' });
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('focused-check'), 'the wait ended: the check is drawn').toBeVisible({ timeout: 15_000 });
  code.release();
  const region = page.getByTestId('toast-region');
  const open = region.getByRole('button', { name: 'Open' });
  await expect(region).toContainText('This link opens G Major, a capo on fret 2. Fermatina will offer to open it when you have finished what you are doing.', { timeout: 15_000 });
  await page.waitForTimeout(2000);
  await expect(open, 'no “Open” while the check is on').toHaveCount(0);
  const capo = () => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.capoFret);
  expect(await capo()).toBe(3);
  await page.getByRole('button', { name: 'Exit the check' }).click();
  await expect(open).toBeVisible({ timeout: 15_000 });
  await expect(region).toContainText('Ready to open the link: G Major, a capo on fret 2');
  expect(await capo(), 'nothing applied by itself').toBe(3);
  await context.close();
});

test('Back pressed while the link is held by a check in progress: that entry’s screen is drawn, the link offered once the check is over, nothing applied by itself', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await newPage(browser, NO_WORKER);
  let fail = true;
  await page.route(LINK_CODE, (route) => (fail ? route.abort('internetdisconnected') : route.continue()));
  await page.goto('/?key=G&scale=major');
  const region = page.getByTestId('toast-region');
  const tryAgain = region.getByRole('button', { name: 'Try Again' });
  await expect(tryAgain).toBeVisible({ timeout: 15_000 });
  // A check in progress, its screens entries of this tab (kept by the reload of Try Again).
  await checkInProgress(page);
  fail = false;
  await tryAgain.click();
  // Reloaded on the check's entry: the code arrives, the check holds the link.
  await expect(region).toContainText('This link opens G Major. Fermatina will offer to open it when you have finished what you are doing.', { timeout: 15_000 });
  await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
  const savedKey = () => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.selectedKey?.natural ?? 'C');
  expect(await savedKey()).toBe('C');
  // Back: the lesson's page; the check is put away (kept), so the work is over.
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Note Values and Rests' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('focused-check')).toHaveCount(0);
  const open = region.getByRole('button', { name: 'Open' });
  await expect(open).toBeVisible({ timeout: 15_000 });
  await expect(region).toContainText('Ready to open the link: G Major');
  expect(await savedKey(), 'nothing applied by itself').toBe('C');
  await expect(page.locator('[role="tab"][data-tab="learn"]')).toHaveAttribute('aria-selected', 'true');
  await open.click();
  await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
  await context.close();
});

// The popstate listeners on window, counted as the browser holds them (type, listener, capture).
async function countBackListeners(page: Page) {
  await page.addInitScript(() => {
    const add = window.addEventListener;
    const remove = window.removeEventListener;
    const held: { l: unknown; capture: boolean }[] = [];
    const captureOf = (o: unknown) => (typeof o === 'boolean' ? o : !!(o as { capture?: boolean } | undefined)?.capture);
    window.addEventListener = function (this: Window, ...a: Parameters<Window['addEventListener']>) {
      const [type, l, o] = a;
      if (type === 'popstate' && l && !held.some((h) => h.l === l && h.capture === captureOf(o))) held.push({ l, capture: captureOf(o) });
      return add.apply(this, a);
    } as Window['addEventListener'];
    window.removeEventListener = function (this: Window, ...a: Parameters<Window['removeEventListener']>) {
      const [type, l, o] = a;
      const k = type === 'popstate' ? held.findIndex((h) => h.l === l && h.capture === captureOf(o)) : -1;
      if (k >= 0) held.splice(k, 1);
      return remove.apply(this, a);
    } as Window['removeEventListener'];
    (window as unknown as { __back: () => number }).__back = () => held.length;
  });
  return () => page.evaluate(() => (window as unknown as { __back: () => number }).__back());
}
const historyModule = (page: Page) => expect.poll(() => page.evaluate(() => (history.state as { fm?: number } | null)?.fm ?? 0), { timeout: 10_000 }).toBe(1);

test('the popstate listeners on window: N with no link, N + 1 while the link waits, N again once it is applied, offered or has failed', async ({ browser }) => {
  test.setTimeout(90_000);
  // N: no link (the history module's own listener).
  let n: number;
  {
    const { context, page } = await newPage(browser, NO_WORKER);
    const count = await countBackListeners(page);
    await page.goto('/');
    await expect(page.getByTestId('key-summary')).toBeVisible({ timeout: 15_000 });
    await historyModule(page);
    n = await count();
    await context.close();
  }
  for (const outcome of ['applied', 'offered', 'failed'] as const) {
    const { context, page } = await newPage(browser, NO_WORKER);
    const count = await countBackListeners(page);
    let release!: () => void;
    const released = new Promise<void>((r) => {
      release = r;
    });
    let asked = 0;
    await page.route(LINK_CODE, async (route) => {
      asked++;
      await released;
      return outcome === 'failed' ? route.abort('internetdisconnected') : route.continue();
    });
    await page.goto('/?key=G&scale=major');
    await expect.poll(() => asked, { timeout: 15_000 }).toBe(1);
    await historyModule(page);
    expect(await count(), `${outcome}: while the link waits`).toBe(n + 1);
    if (outcome === 'offered') {
      await page.locator('[role="tab"][data-tab="learn"]').click();
      await expect(page.locator('#learn-panel h1').first()).toBeVisible({ timeout: 15_000 });
      expect(await count(), 'offered: still listening until the link is decided').toBe(n + 1);
    }
    release();
    const region = page.getByTestId('toast-region');
    if (outcome === 'applied') await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
    if (outcome === 'offered') await expect(region).toContainText('Ready to open the link: G Major', { timeout: 15_000 });
    if (outcome === 'failed') await expect(region).toContainText('The link could not open.', { timeout: 15_000 });
    await expect.poll(count, { message: `${outcome}: once settled`, timeout: 5_000 }).toBe(n);
    await context.close();
  }
});

test('a lesson opened through Quick Search while the wait is already on Learn (the view does not change): drawn at once; the link is offered', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER, { state: { lastView: 'learn' }, version: 6 });
  const code = await holdLinkCode(page);
  await page.goto('/?key=G&scale=major');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  await expect(page.locator('[role="tab"][data-tab="learn"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('view-loading')).toBeVisible();
  await page.keyboard.press('Control+k');
  const input = page.getByRole('dialog').locator('input');
  await input.fill('Note Values and Rests');
  await page.getByRole('dialog').getByRole('option', { name: /Note Values and Rests/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Note Values and Rests' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('view-loading')).toHaveCount(0);
  code.release();
  await expect(page.getByTestId('toast-region')).toContainText('Ready to open the link: G Major', { timeout: 15_000 });
  await expect(page.getByRole('heading', { level: 1, name: 'Note Values and Rests' })).toBeVisible();
  await context.close();
});

test('a capo chosen in Settings while the link waits: drawn at once, never overwritten; the link is offered', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER);
  const code = await holdLinkCode(page);
  await page.goto('/?key=G&scale=major&capo=2');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  await page.getByTestId('app-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await page.getByRole('dialog').getByRole('combobox', { name: /capo/i }).first().selectOption({ label: 'Capo 3' });
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('key-summary')).toContainText('C Major', { timeout: 15_000 });
  await expect(page.getByTestId('view-loading')).toHaveCount(0);
  code.release();
  await expect(page.getByTestId('toast-region')).toContainText('Ready to open the link: G Major, a capo on fret 2', { timeout: 15_000 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.capoFret)).toBe(3);
  await context.close();
});

test('notes played while the link waits (a piano key by mouse, keys on the computer’s keyboard) make no offer: the link applies as usual', async ({ browser }) => {
  const { context, page } = await newPage(browser, NO_WORKER);
  const code = await holdLinkCode(page);
  await page.goto('/?key=G&scale=major');
  await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
  const key = page.locator('[data-piano-key]').nth(14);
  await key.click();
  await page.locator('body').press('a');
  await page.locator('body').press('s');
  await expect(page.getByTestId('view-loading')).toBeVisible();
  code.release();
  await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
  await page.waitForTimeout(500);
  await expect(page.getByTestId('toast-region')).not.toContainText('Ready to open the link');
  await context.close();
});

test('what is not the learner’s act here does not turn an open into an offer: another tab’s choices, ?lang= and ?start= on a first visit', async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  // Another tab of the same browser changes the key, the instrument and the view while this one waits.
  {
    const { context, page: other } = await newPage(browser, NO_WORKER);
    await other.goto('/');
    await expect(other.getByTestId('key-summary')).toContainText('C Major', { timeout: 15_000 });
    const page = await context.newPage();
    const code = await holdLinkCode(page);
    await page.goto('/?key=G&scale=major');
    await expect.poll(code.asked, { timeout: 15_000 }).toBe(1);
    await other.getByRole('combobox', { name: 'Root' }).selectOption({ label: 'E♭' });
    await other.getByRole('radio', { name: 'Guitar' }).first().click();
    await other.locator('[role="tab"][data-tab="learn"]').click();
    await expect.poll(() => other.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.lastView)).toBe('learn');
    // Here, the learner touches something the link does not set: the piano's octave.
    await page.getByRole('radio', { name: 'C3' }).click();
    await expect(page.getByRole('radio', { name: 'C3' })).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByTestId('view-loading')).toBeVisible();
    code.release();
    await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
    await expect(page.getByTestId('toast-region')).not.toContainText('Ready to open the link');
    await context.close();
  }
  // A first visit (nothing saved) by a link with ?lang=pt, then with ?start=theory: applied, never offered.
  for (const [address, key] of [['/?lang=pt&key=G&scale=major', 'G maior'], ['/?start=theory&key=G&scale=major', 'G Major']] as const) {
    const context = await browser.newContext({ ...NO_WORKER, reducedMotion: 'reduce', storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    const code = await holdLinkCode(page);
    await page.goto(`${baseURL}${address}`);
    await expect.poll(code.asked, { message: address, timeout: 15_000 }).toBe(1);
    await expect(page.getByTestId('view-loading')).toBeVisible();
    code.release();
    await expect(page.getByTestId('key-summary'), address).toContainText(key, { timeout: 15_000 });
    await expect(page.getByTestId('toast-region')).not.toContainText(/Ready to open|Já podes abrir/);
    await context.close();
  }
});

test('offline, Try Again never turns the page into the browser’s error page: with no worker the page and the link are kept; with a worker in control the reload comes from its cache', async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  {
    const { context, page } = await newPage(browser, NO_WORKER);
    const boots = await recordBoots(page);
    await page.route(LINK_CODE, (route) => route.abort('internetdisconnected'));
    await page.goto('/?key=F#&inst=guitar');
    const region = page.getByTestId('toast-region');
    const tryAgain = region.getByRole('button', { name: 'Try Again' });
    await expect(tryAgain).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('key-summary')).toContainText('C Major', { timeout: 15_000 }); // Explore's own code is here
    await context.setOffline(true);
    await tryAgain.click();
    // The tapped toast leaves as its replacement comes: one, then.
    await expect(tryAgain, 'the toast comes back').toHaveCount(1);
    await expect(tryAgain).toBeVisible();
    await expect(region).toContainText('The link could not open.');
    await page.waitForTimeout(1500);
    expect(page.url()).toBe(`${baseURL}/`);
    await expect(page.getByTestId('key-summary')).toContainText('C Major');
    expect(await boots(), 'no reload').toHaveLength(1);
    // Back online: the same Try Again opens the link it kept.
    await context.setOffline(false);
    await page.unroute(LINK_CODE);
    await tryAgain.click();
    await expect(page.getByTestId('key-summary')).toContainText('F♯ Major', { timeout: 15_000 });
    await expect(page.getByRole('radio', { name: 'Guitar' }).first()).toHaveAttribute('aria-checked', 'true');
    expect((await boots())[1]).toBe(`${baseURL}/?key=F#&inst=guitar`);
    await context.close();
  }
  {
    const { context, page } = await newPage(browser, LAPTOP);
    const manifest = await page.request.get('/manifest.webmanifest');
    if ((manifest.headers()['content-type'] ?? '').includes('json')) {
      // The page is not controlled yet on a first visit: its request for the code goes out, and fails.
      await page.route(LINK_CODE, (route) => route.abort('internetdisconnected'));
      await page.goto('/?key=G&scale=major');
      const tryAgain = page.getByTestId('toast-region').getByRole('button', { name: 'Try Again' });
      await expect(tryAgain).toBeVisible({ timeout: 15_000 });
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, { timeout: 30_000 });
      await context.setOffline(true);
      await tryAgain.click();
      await expect(page.getByTestId('key-summary')).toContainText('G Major', { timeout: 15_000 });
      expect(page.url()).toBe(`${baseURL}/`);
    } else {
      test.info().annotations.push({ type: 'note', description: 'No service worker on the dev server: the half with a worker in control runs on the build' });
    }
    await context.close();
  }
});

test('laptop: Copy link puts the expected address on the clipboard (Explore and a lesson)', async ({ browser, baseURL }) => {
  const { context, page } = await newPage(browser, { ...LAPTOP, permissions: ['clipboard-read', 'clipboard-write'] });
  await page.goto(LINK);
  await expectDMajorAChordGuitar(page);
  await page.getByTestId('explore-menu').getByRole('button').first().click();
  await shot(page, 'share-explore-menu-laptop-day-en');
  await page.getByRole('menuitem', { name: 'Copy link' }).click();
  await expect(page.getByTestId('toast-region')).toContainText('Link copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/?key=D&scale=major&chord=A&inst=guitar`);

  // A sharp key and a slash chord, chosen in the app. Its bass F♯ is the
  // chord's 3rd, so D/F♯ opens as D major in first inversion and the link
  // carries it so (review of b94d761, item 7).
  await page.goto('/?key=F%23&scale=natural_minor&chord=D%2FF%23&inst=piano');
  await expect(page.getByTestId('key-summary')).toContainText('F♯ Natural Minor');
  await expect(page.getByRole('radio', { name: '1st Inv' })).toHaveAttribute('aria-checked', 'true');
  await page.getByTestId('explore-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Copy link' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/?key=F%23&scale=natural_minor&chord=D&inst=piano&inv=1`);

  await page.goto('/?lesson=l2u5m3');
  await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('lesson-menu').getByRole('button').first().click();
  await shot(page, 'share-lesson-menu-laptop-day-en');
  await page.getByRole('menuitem', { name: 'Copy link' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/?lesson=l2u5m3`);
  await context.close();
});

test('phone: Share link hands the address to the share sheet', async ({ browser, baseURL }) => {
  const { context, page } = await newPage(browser, PHONE);
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: (data: ShareData) => {
        (window as unknown as { __shared: ShareData[] }).__shared = [...((window as unknown as { __shared?: ShareData[] }).__shared ?? []), data];
        return Promise.resolve();
      },
    });
  });
  await page.goto(LINK);
  await expectDMajorAChordGuitar(page);
  await page.getByTestId('explore-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Share link' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __shared?: ShareData[] }).__shared?.map((s) => s.url))).toEqual([`${baseURL}/?key=D&scale=major&chord=A&inst=guitar`]);
  await context.close();
});

for (const theme of ['day', 'night'] as const) {
  test(`when the browser refuses to copy, the link is shown in a selectable field (${theme})`, async ({ browser, baseURL }) => {
    const { context, page } = await newPage(browser, PHONE, { state: { themeMode: theme === 'day' ? 'fermata' : 'fermata-night', language: 'en' }, version: 6 });
    // The share sheet refuses with a DOMException by day and with a plain
    // TypeError by night (review 2026-11-10): only the learner closing the
    // sheet (AbortError) may end delivery; every other failure reaches the field.
    await context.addInitScript((kind) => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } });
      Object.defineProperty(navigator, 'share', { configurable: true, value: () => Promise.reject(kind === 'type' ? new TypeError('cannot share this') : new DOMException('no', 'NotAllowedError')) });
    }, theme === 'day' ? 'dom' : 'type');
    await page.goto(LINK);
    await expectDMajorAChordGuitar(page);
    await page.getByTestId('explore-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Share link' }).click();
    const field = page.getByTestId('share-fallback-field');
    await expect(field).toBeVisible();
    await expect(field).toHaveValue(`${baseURL}/?key=D&scale=major&chord=A&inst=guitar`);
    await expect.poll(() => field.evaluate((el: HTMLInputElement) => el.selectionEnd! - el.selectionStart!)).toBe(`${baseURL}/?key=D&scale=major&chord=A&inst=guitar`.length);
    await shot(page, `share-fallback-phone-${theme}-en`);
    await page.getByTestId('share-fallback').getByRole('button', { name: 'Close' }).click();
    await expect(field).toHaveCount(0);
    await context.close();
  });
}

// ── Production headers + service worker (preview only) ─────────────────────

async function previewOnly(page: Page) {
  const manifest = await page.request.get('/manifest.webmanifest');
  test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'No service worker on the dev server');
}

test('preview: a link opened in an app the service worker already controls', async ({ browser }) => {
  const { context, page } = await newPage(browser, PHONE);
  await page.goto('/');
  await previewOnly(page);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, { timeout: 20_000 });
  await page.goto(LINK);
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await expectDMajorAChordGuitar(page);
  await context.close();
});

test('preview: a link opens offline after one online visit', async ({ browser }) => {
  const { context, page } = await newPage(browser, LAPTOP);
  await page.goto('/');
  await previewOnly(page);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, { timeout: 20_000 });
  await expect(page.locator('#explore-panel')).toBeVisible();
  await page.waitForTimeout(3000); // precache + cache warm-up settle
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await context.route('**/*', (route) => route.abort('internetdisconnected'));
  await page.goto(LINK);
  await expectDMajorAChordGuitar(page);
  await page.goto('/?lesson=l2u5m3');
  await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
  await context.close();
});
