import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { WELCOME_KEY } from './helpers/welcome';

/**
 * Audit fixes, 18 November 2026 (stream E), in a real browser:
 *
 * Q13 — `/?view=drill`, the installed app's "Start Drill" shortcut, on a FIRST
 * visit: the start screen still asks who the visitor is (the profile is asked
 * there; `view` is not a share parameter, so it never skipped the screen),
 * and after the door the visitor chose, Drill opens. Before, the door's own
 * destination replaced the request.
 *
 * A19 — the public entrance pages' doors carry the visitor's choice:
 * `/?start=new|player|theory&lang=…`. On a first visit the start gate takes
 * that door at once, exactly as tapping it would (the same saved fields —
 * compared with a tap in the same language —, the same first screen), and
 * the start screen never appears. A bad value: the start screen, as a plain
 * visit. A visitor with saved data is never re-profiled. A shared link in the
 * same address wins, as it does over the start screen. The address bar loses
 * the parameter.
 *
 * And the audit's claim that `/?root=…` skipped the start screen: `root` is
 * no parameter of the app (state/shareParams.ts) — a first visit with it gets
 * the start screen.
 */

test.use({ storageState: { cookies: [], origins: [] } });

type Lang = 'en' | 'pt' | 'es';
const LOCALE: Record<Lang, string> = { en: 'en-GB', pt: 'pt-PT', es: 'es-ES' };
const json = <T,>(f: string) => JSON.parse(fs.readFileSync(f, 'utf8')) as T;
type Words = { nav: { drill: string; explore: string; learn: string }; start: { doorsHeading: string; door: Record<'new' | 'player' | 'theory', { title: string }> } };
const WORDS: Record<Lang, Words> = { en: json('src/i18n/locales/en.json'), pt: json('src/i18n/locales/pt.json'), es: json('src/i18n/locales/es.json') };
const SOUND_LESSON_1: Record<Lang, string> = { en: 'High and Low', pt: 'Agudo e grave', es: 'Agudo y grave' };
const DOORS = ['new', 'player', 'theory'] as const;
type Door = (typeof DOORS)[number];

const LAPTOP = { viewport: { width: 1440, height: 900 }, touch: false };
const PHONE = { viewport: { width: 390, height: 844 }, touch: true };

/** A browser that has never opened the app (or one with `stores` saved), watching for the start screen from the first node. */
async function browserWith(browser: Browser, lang: Lang, v = LAPTOP, stores: Record<string, string> = {}) {
  const context = await browser.newContext({
    viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block',
    locale: LOCALE[lang], storageState: { cookies: [], origins: [] },
  });
  await context.addInitScript((items) => {
    const w = window as unknown as { __startSeen: boolean };
    w.__startSeen = false;
    new MutationObserver(() => {
      if (document.querySelector('[data-testid="start-screen"], [data-testid="start-screen-loading"]')) w.__startSeen = true;
    }).observe(document, { childList: true, subtree: true });
    if (sessionStorage.getItem('__seeded')) return;
    for (const [k, val] of Object.entries(items)) localStorage.setItem(k, val);
    sessionStorage.setItem('__seeded', '1');
  }, stores);
  return { context, page: await context.newPage() };
}

const startSeen = (page: Page) => page.evaluate(() => (window as unknown as { __startSeen: boolean }).__startSeen);
const flag = (page: Page) => page.evaluate((k) => localStorage.getItem(k), WELCOME_KEY);
const rawSettings = (page: Page) => page.evaluate(() => localStorage.getItem('music-theory-app'));
/** The saved settings, timestamps left out (a tap and a link happen at different moments). */
const savedFields = async (page: Page) => {
  const state = JSON.parse((await rawSettings(page)) ?? '{}').state ?? {};
  delete state.preferencesUpdatedAt;
  return state as Record<string, unknown>;
};

async function landed(page: Page, door: Door, lang: Lang) {
  if (door === 'new') await expect(page.getByRole('heading', { level: 1, name: SOUND_LESSON_1[lang] })).toBeVisible({ timeout: 15_000 });
  else await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
  const tab = door === 'new' ? WORDS[lang].nav.learn : WORDS[lang].nav.explore;
  await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
  // The start hint: in Explore for "player" (raised by the door); "new" owes it to Explore; "theory" none.
  await expect(page.getByTestId('start-hint')).toHaveCount(door === 'player' ? 1 : 0);
}

test.describe('Q13: the "Start Drill" shortcut on a first visit', () => {
  for (const door of DOORS) {
    test(`/?view=drill: the start screen asks; "${WORDS.en.start.door[door].title}" then opens Drill`, async ({ browser }) => {
      const { context, page } = await browserWith(browser, 'en');
      await page.goto('/?view=drill');
      await expect(page.getByTestId('start-screen')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('heading', { level: 2, name: WORDS.en.start.doorsHeading })).toBeVisible();
      await expect.poll(() => page.evaluate(() => location.search)).toBe('');
      await page.getByTestId(`start-door-${door}`).click();
      await expect(page.getByTestId('start-screen')).toHaveCount(0);
      await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('tab', { name: WORDS.en.nav.drill })).toHaveAttribute('aria-selected', 'true');
      // The door's own fields are saved as ever; the view asked for is where the visitor is.
      expect(await savedFields(page)).toMatchObject({ learnerProfile: door, lastView: 'drill' });
      expect(await flag(page)).toBe('seen');
      // A reload: Drill again, no start screen.
      await page.reload();
      await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('start-screen')).toHaveCount(0);
      await context.close();
    });
  }

  test('phone: the same, in Portuguese', async ({ browser }) => {
    const { context, page } = await browserWith(browser, 'pt', PHONE);
    await page.goto('/?view=drill');
    await expect(page.getByTestId('start-screen')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('start-door-theory').click();
    await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('tab', { name: WORDS.pt.nav.drill })).toHaveAttribute('aria-selected', 'true');
    await context.close();
  });

  test('a returning visitor: /?view=drill opens Drill at once, as before', async ({ browser }) => {
    const { context, page } = await browserWith(browser, 'en', LAPTOP, {
      [WELCOME_KEY]: 'seen',
      'music-theory-app': JSON.stringify({ state: { language: 'en', lastView: 'explore' }, version: 6 }),
    });
    await page.goto('/?view=drill');
    await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
    expect(await startSeen(page)).toBe(false);
    await context.close();
  });

  test('the audit\'s other example: /?root=C is no parameter of the app — a first visit gets the start screen', async ({ browser }) => {
    const { context, page } = await browserWith(browser, 'en');
    await page.goto('/?root=C');
    await expect(page.getByTestId('start-screen')).toBeVisible({ timeout: 15_000 });
    await context.close();
  });
});

test.describe('A19: a door chosen on a public entrance page', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    for (const door of DOORS) {
      test(`${lang}: /?start=${door}&lang=${lang} takes the door at once — the same fields and first screen as tapping it`, async ({ browser }) => {
        // The tap, for comparison: a first visit in the same language, the door tapped.
        const tap = await browserWith(browser, lang);
        await tap.page.goto(`/?lang=${lang}`);
        await expect(tap.page.getByTestId('start-screen')).toBeVisible({ timeout: 15_000 });
        await tap.page.getByTestId(`start-door-${door}`).click();
        await landed(tap.page, door, lang);
        const tapped = await savedFields(tap.page);
        await tap.context.close();

        const { context, page } = await browserWith(browser, lang);
        await page.goto(`/?start=${door}&lang=${lang}`);
        await landed(page, door, lang);
        expect(await startSeen(page), 'the start screen never appears').toBe(false);
        await expect.poll(() => page.evaluate(() => location.search)).toBe('');
        expect(await flag(page)).toBe('seen');
        const linked = await savedFields(page);
        expect(linked).toEqual(tapped);
        expect(linked).toMatchObject({ learnerProfile: door, language: lang });
        // Dó-Ré-Mi: a door chosen in Portuguese or Spanish turns it on — by the link too.
        expect(linked.showSolfege ?? false).toBe(lang !== 'en');
        // A reload: the same place, never the start screen.
        await page.reload();
        await landed(page, door, lang);
        expect(await startSeen(page)).toBe(false);
        await context.close();
      });
    }
  }

  for (const bad of ['bogus', 'THEORYX', 'new%20door', 'x'.repeat(80)]) {
    test(`a bad value (${bad.slice(0, 12)}): the start screen, as a plain first visit; the address cleaned`, async ({ browser }) => {
      const { context, page } = await browserWith(browser, 'pt');
      await page.goto(`/?start=${bad}&lang=pt`);
      await expect(page.getByTestId('start-screen')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('heading', { level: 2, name: WORDS.pt.start.doorsHeading })).toBeVisible();
      await expect.poll(() => page.evaluate(() => location.search)).toBe('');
      expect(await flag(page)).toBe('pending');
      expect(await savedFields(page)).not.toHaveProperty('learnerProfile');
      await context.close();
    });
  }

  test('a visitor with saved data is never re-profiled: the link changes nothing they saved', async ({ browser }) => {
    const settings = JSON.stringify({ state: { language: 'pt', lastView: 'learn', instrument: 'guitar' }, version: 6 });
    const { context, page } = await browserWith(browser, 'pt', LAPTOP, { [WELCOME_KEY]: 'seen', 'music-theory-app': settings });
    await page.goto('/?start=new&lang=en');
    await expect(page.getByRole('tab', { name: WORDS.pt.nav.learn })).toHaveAttribute('aria-selected', 'true', { timeout: 15_000 });
    await page.waitForTimeout(800);
    expect(await startSeen(page)).toBe(false);
    const saved = await savedFields(page);
    expect(saved).not.toHaveProperty('learnerProfile');
    expect(saved).not.toHaveProperty('startHint');
    expect(saved).toMatchObject({ language: 'pt', instrument: 'guitar' });
    await expect.poll(() => page.evaluate(() => location.search)).toBe('');
    await context.close();
  });

  test('a visitor owed the start screen who has used the app since (learning data) is not profiled either', async ({ browser }) => {
    const { context, page } = await browserWith(browser, 'en', LAPTOP, {
      [WELCOME_KEY]: 'pending',
      'music-theory-progress': JSON.stringify({ state: { progress: { completedModules: ['l1u1m1'] } }, version: 4 }),
    });
    await page.goto('/?start=player&lang=en');
    await expect(page.getByTestId('app-topbar')).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(800);
    expect(await startSeen(page)).toBe(false);
    expect(await savedFields(page)).not.toHaveProperty('learnerProfile');
    expect(await flag(page)).toBe('seen');
    await context.close();
  });

  test('a shared link in the same address wins (the wave-1 rule): its lesson opens, no door is taken', async ({ browser }) => {
    const { context, page } = await browserWith(browser, 'en');
    await page.goto('/?lesson=l1u3m1&start=theory&lang=en');
    await expect(page.getByRole('heading', { level: 1, name: 'The Major Scale' })).toBeVisible({ timeout: 15_000 });
    expect(await startSeen(page)).toBe(false);
    expect(await savedFields(page)).not.toHaveProperty('learnerProfile');
    expect(await flag(page)).toBe('pending');
    await context.close();
  });

  test('with the Drill shortcut too: the door is taken, then Drill opens', async ({ browser }) => {
    const { context, page } = await browserWith(browser, 'en');
    await page.goto('/?start=theory&view=drill&lang=en');
    await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
    expect(await startSeen(page)).toBe(false);
    expect(await savedFields(page)).toMatchObject({ learnerProfile: 'theory', lastView: 'drill' });
    await context.close();
  });
});

test.describe('A19 on the build: the public landing pages\' own door links', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    test(`${lang}: each door of /${lang}/ opens the app with that door taken, no start screen`, async ({ browser, request, baseURL }) => {
      const res = await request.get(`/${lang}/`);
      const html = res.ok() ? await res.text() : '';
      test.skip(!html.includes('id="doors"'), 'the public pages exist only in the build: skipped on the dev server');
      const section = html.slice(html.indexOf('id="doors"'), html.indexOf('</section>', html.indexOf('id="doors"')));
      const hrefs = [...section.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
      expect(hrefs).toEqual(DOORS.map((door) => `https://fermatina.com/?start=${door}&lang=${lang}`));
      for (const [i, href] of hrefs.entries()) {
        // The live site is never asked: the same address on this run's own server.
        const local = href.replace('https://fermatina.com', baseURL!);
        const { context, page } = await browserWith(browser, lang);
        await page.goto(local);
        await landed(page, DOORS[i], lang);
        expect(await startSeen(page)).toBe(false);
        expect(await savedFields(page)).toMatchObject({ learnerProfile: DOORS[i], language: lang });
        await context.close();
      }
    });
  }
});
