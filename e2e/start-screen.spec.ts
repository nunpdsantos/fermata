import { test, expect, type Browser, type Page } from '@playwright/test';
import { WELCOME_KEY } from './helpers/welcome';

/**
 * The start screen (wave 1) and the start hint, in a real browser — phone
 * 390×844 and laptop 1440×900, English and Portuguese:
 *  - an empty browser gets the start screen as its own page: the workbench
 *    never appears before a door (watched from the first DOM node);
 *  - each door saves the profile and the instrument; "new" lands in lesson 1
 *    of "Start with sound" in Learn (wave 2), the other two in Explore;
 *    after a door, never again (reload);
 *  - saved data of any store: never shown;
 *  - the tour button asks for the tour and the screen steps aside; when the
 *    request clears (no door), it is back;
 *  - a shared link wins on its visit; the next plain visit gets the screen,
 *    unless the app was really used since (progress saved);
 *  - the language switch, and a Portuguese / Spanish browser's first visit;
 *  - keyboard only: Tab through every control, arrows in the segments, Enter
 *    on a door;
 *  - the start hint: there from Explore's first paint ("new": the first time
 *    Explore is opened after the door), nothing moves, covers neither the
 *    instrument nor the chord row; no link into Learn ("new": never;
 *    "player": not until the chords track's lesson 1 exists — wave 2); ✕
 *    and acting on it (a chord picked) end it for good, in both profiles; ✕
 *    sends focus to the key picker;
 *  - the page that showed the start screen skips the offline-ready notice.
 */

// Empty storage: the configs seed "seen" for every other spec.
test.use({ storageState: { cookies: [], origins: [] } });

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
type Viewport = (typeof VIEWPORTS)[number];

const WORDS = {
  en: {
    locale: 'en-GB', tour: 'Watch the one-minute tour', heading: 'Where are you starting from?', instrument: "I'll use:",
    doors: { new: "I'm new to music", player: 'I play, but never learned theory', theory: 'I know some theory' },
    guitar: 'Guitar', piano: 'Piano', lang: 'Language', explore: 'Explore', dismiss: 'Dismiss the tip',
    learn: 'Learn', soundLesson1: 'High and Low',
  },
  pt: {
    locale: 'pt-PT', tour: 'Ver a visita guiada de um minuto', heading: 'Qual é o teu ponto de partida?', instrument: 'Vou usar:',
    doors: { new: 'A música é nova para mim', player: 'Toco, mas nunca aprendi teoria', theory: 'Sei alguma teoria' },
    guitar: 'Guitarra', piano: 'Piano', lang: 'Idioma', explore: 'Explorar', dismiss: 'Fechar a dica',
    learn: 'Aprender', soundLesson1: 'Agudo e grave',
  },
} as const;
type Lang = keyof typeof WORDS;

/**
 * A fresh browser in that language; records whether anything of the app's
 * shell or workbench was ever in the DOM while the start screen was owed
 * (a MutationObserver from the first node on).
 */
async function fresh(browser: Browser, v: Viewport, lang: Lang, init?: () => void) {
  const context = await browser.newContext({
    viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block',
    locale: WORDS[lang].locale, storageState: { cookies: [], origins: [] },
  });
  await context.addInitScript(() => {
    const w = window as unknown as { __flash: string[]; __startSeen: boolean };
    w.__flash = [];
    w.__startSeen = false;
    const look = () => {
      if (document.querySelector('[data-testid="start-screen"], [data-testid="start-screen-loading"]')) w.__startSeen = true;
      for (const sel of ['.app-topbar', '#explore-panel', '[data-testid="explore-header"]', '[data-testid="instrument-dock"]']) {
        if (document.querySelector(sel) && !w.__flash.includes(sel)) w.__flash.push(sel);
      }
    };
    new MutationObserver(look).observe(document, { childList: true, subtree: true });
  });
  if (init) await context.addInitScript({ content: `(${init.toString()})()` });
  const page = await context.newPage();
  return { context, page };
}

const startScreen = (page: Page) => page.getByTestId('start-screen');
const flag = (page: Page) => page.evaluate((k) => localStorage.getItem(k), WELCOME_KEY);
const savedState = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app') ?? '{}').state ?? {});
const flash = (page: Page) => page.evaluate(() => (window as unknown as { __flash: string[] }).__flash);

/** Ask the dev server's own module (the app's instance) to end the tour request. */
async function clearTour(page: Page): Promise<boolean> {
  return page.evaluate(async () => {
    try {
      (await import(/* @vite-ignore */ '/src/state/demoRequest.ts' as string)).clearDemoRequest();
      return true;
    } catch {
      return false;
    }
  });
}

for (const v of VIEWPORTS) {
  for (const lang of ['en', 'pt'] as const) {
    const W = WORDS[lang];
    const combo = `${v.name}-${lang}`;

    test(`${combo}: shown on empty storage as its own page, nothing of the workbench first; in the browser's language`, async ({ browser }) => {
      const { context, page } = await fresh(browser, v, lang);
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('heading', { level: 1, name: 'Fermata' })).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: W.heading })).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'pt' ? 'pt-PT' : 'en');
      await page.waitForTimeout(1500); // Explore's code is prefetched by now
      expect(await flash(page)).toEqual([]);
      expect(await page.evaluate(() => (window as unknown as { __startSeen: boolean }).__startSeen)).toBe(true);
      expect(await flag(page)).toBe('pending');
      // A reload before a door: still there.
      await page.reload();
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      expect(await flash(page)).toEqual([]);
      await context.close();
    });

    for (const [door, instrument] of [['new', 'guitar'], ['player', 'piano'], ['theory', 'guitar']] as const) {
      const lands = door === 'new' ? 'lesson 1 of "Start with sound" in Learn' : 'Explore';
      test(`${combo}: "${W.doors[door]}" with the ${instrument} saves both, lands in ${lands}; never again after a reload`, async ({ browser }) => {
        const { context, page } = await fresh(browser, v, lang);
        await page.goto('/');
        await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
        await page.getByRole('radiogroup', { name: W.instrument }).getByRole('radio', { name: instrument === 'guitar' ? W.guitar : W.piano }).click();
        await page.getByRole('button', { name: new RegExp(`^${W.doors[door]}`) }).click();
        await expect(startScreen(page)).toHaveCount(0);
        // Wave 2: "new" opens the first sound-first lesson; the others, Explore.
        const tab = door === 'new' ? W.learn : W.explore;
        const landed = () => (door === 'new'
          ? page.getByRole('heading', { level: 1, name: W.soundLesson1 })
          : page.getByTestId('explore-header'));
        await expect(landed()).toBeVisible({ timeout: 15_000 });
        await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByRole('tab', { name: tab })).toBeFocused();
        expect(await savedState(page)).toMatchObject({ learnerProfile: door, instrument, lastView: door === 'new' ? 'learn' : 'explore' });
        expect(await flag(page)).toBe('seen');
        // The guitar is the instrument: drawn in Explore; in Learn the dock rests
        // folded on a laptop (D-20), so its Piano / Guitar switch says it.
        if (instrument === 'guitar' && door !== 'new') await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
        if (instrument === 'guitar' && door === 'new') await expect(page.getByRole('radio', { name: W.guitar }).first()).toHaveAttribute('aria-checked', 'true');
        // The hint shows in Explore only; "new" still owes it (shown on the first visit to Explore).
        await expect(page.getByTestId('start-hint')).toHaveCount(door === 'player' ? 1 : 0);
        expect((await savedState(page)).startHint ?? null).toBe(door === 'theory' ? null : door);
        await page.reload();
        await expect(landed()).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(1000);
        await expect(startScreen(page)).toHaveCount(0);
        expect(await savedState(page)).toMatchObject({ learnerProfile: door, instrument });
        await context.close();
      });
    }
  }
}

test.describe('who never sees it', () => {
  for (const key of ['music-theory-app', 'music-theory-progress', 'fermata-drill-v1', 'fermata-fingering-v1', 'fermata-learn-session-v1']) {
    test(`someone with saved data (${key}): the app, exactly as before`, async ({ browser }) => {
      const { context, page } = await fresh(browser, VIEWPORTS[0], 'en', () => {
        if (sessionStorage.getItem('e2e:seeded')) return;
        sessionStorage.setItem('e2e:seeded', '1');
        // The key comes in through the page URL's hash (init scripts cannot take arguments here).
        const k = decodeURIComponent(location.hash.slice(1));
        localStorage.setItem(k, k === 'music-theory-app' ? JSON.stringify({ state: { lastView: 'explore' }, version: 6 }) : '{}');
      });
      await page.goto(`/#${encodeURIComponent(key)}`);
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(1500);
      await expect(startScreen(page)).toHaveCount(0);
      expect(await page.evaluate(() => (window as unknown as { __startSeen: boolean }).__startSeen)).toBe(false);
      // Known positive for the "no workbench first" watcher used above.
      expect(await flash(page)).toContain('.app-topbar');
      expect(await flag(page)).toBeNull();
      expect(await savedState(page)).not.toHaveProperty('learnerProfile');
      await context.close();
    });
  }
});

test.describe('the tour, a shared link, the language, the keyboard', () => {
  for (const v of VIEWPORTS) {
    test(`${v.name}: the tour button asks for the tour and steps aside; back when the request clears`, async ({ browser }) => {
      const { context, page } = await fresh(browser, v, 'en');
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await page.getByRole('button', { name: 'Watch the one-minute tour' }).click();
      await expect(startScreen(page)).toHaveCount(0);
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      const requested = await page.evaluate(async () => {
        try { return (await import(/* @vite-ignore */ '/src/state/demoRequest.ts' as string)).getDemoRequest(); } catch { return 'no-dev-modules'; }
      });
      test.skip(requested === 'no-dev-modules', 'needs the dev server\'s /src modules');
      expect(requested).toBe('intro');
      expect(await flag(page)).toBe('pending'); // no door yet
      expect(await clearTour(page)).toBe(true);
      await expect(startScreen(page)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Watch the one-minute tour' })).toBeFocused();
      await expect(page.locator('.app-topbar')).toHaveCount(0);
      await context.close();
    });

    test(`${v.name}: a shared link wins on its visit; the next plain visit gets the start screen`, async ({ browser }) => {
      const { context, page } = await fresh(browser, v, 'en');
      await page.goto('/?key=G&scale=major');
      await expect(page.locator('.app-topbar')).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(1500);
      await expect(startScreen(page)).toHaveCount(0);
      expect(await page.evaluate(() => (window as unknown as { __startSeen: boolean }).__startSeen)).toBe(false);
      expect(await flag(page)).toBe('pending');
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await context.close();
    });

    test(`${v.name}: a shared-link visitor who then uses the app (progress saved) is a returning learner: no start screen`, async ({ browser }) => {
      const { context, page } = await fresh(browser, v, 'en');
      await page.goto('/?key=G&scale=major');
      await expect(page.locator('.app-topbar')).toBeVisible({ timeout: 15_000 });
      expect(await flag(page)).toBe('pending');
      // Real use since: a Learn progress save (the store writes only on the learner's work).
      await page.evaluate(() => localStorage.setItem('music-theory-progress', '{}'));
      await page.goto('/');
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(1500);
      await expect(startScreen(page)).toHaveCount(0);
      expect(await flag(page)).toBe('seen');
      await context.close();
    });
  }

  test('the language switch changes the page at once and is saved', async ({ browser }) => {
    const { context, page } = await fresh(browser, VIEWPORTS[0], 'en');
    await page.goto('/');
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    await page.getByRole('radiogroup', { name: 'Language' }).getByRole('radio', { name: 'Português' }).click();
    await expect(page.getByRole('heading', { level: 2, name: WORDS.pt.heading })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
    await page.getByRole('radiogroup', { name: 'Idioma' }).getByRole('radio', { name: 'Español' }).click();
    await expect(page.getByRole('heading', { level: 2, name: '¿Cuál es tu punto de partida?' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { level: 2, name: '¿Cuál es tu punto de partida?' })).toBeVisible({ timeout: 15_000 });
    expect(await savedState(page)).toMatchObject({ language: 'es' });
    await context.close();
  });

  test('a Spanish browser gets Spanish on its first visit', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'es-ES', storageState: { cookies: [], origins: [] }, serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 2, name: '¿Cuál es tu punto de partida?' })).toBeVisible({ timeout: 15_000 });
    await context.close();
  });

  for (const v of VIEWPORTS) {
    test(`${v.name}: keyboard only — every control in order, arrows in the segments, Enter on a door`, async ({ browser }) => {
      const { context, page } = await fresh(browser, v, 'en');
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
      const stops: string[] = [];
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        stops.push(await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return `${el.getAttribute('role') ?? el.tagName.toLowerCase()}:${(el.textContent ?? '').trim().slice(0, 24)}`;
        }));
        // Every stop is on screen (the page scrolls to it) and shows a ring.
        const shown = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          const r = el.getBoundingClientRect();
          return r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(el).outlineStyle !== 'none';
        });
        expect(shown, stops[i]).toBe(true);
      }
      expect(stops).toEqual([
        'button:Watch the one-minute tou',
        'radio:Piano',
        "button:I'm new to musicStart wi",
        'button:I play, but never learne',
        'button:I know some theoryStraig',
        'radio:English',
      ]);
      // Arrows in "I'll use" move AND select (one Tab stop for the segment).
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Shift+Tab');
      await expect(page.getByRole('radio', { name: 'Piano' })).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('radio', { name: 'Guitar' })).toBeFocused();
      await expect(page.getByRole('radio', { name: 'Guitar' })).toHaveAttribute('aria-checked', 'true');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: /^I'm new to music/ })).toBeFocused();
      await page.keyboard.press('Enter');
      // Wave 2: "new" opens lesson 1 of "Start with sound"; focus on the Learn tab.
      await expect(page.getByRole('heading', { level: 1, name: 'High and Low' })).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('tab', { name: 'Learn' })).toBeFocused();
      expect(await savedState(page)).toMatchObject({ learnerProfile: 'new', instrument: 'guitar' });
      await context.close();
    });
  }
});

test.describe('the start hint', () => {
  for (const v of VIEWPORTS) {
    test(`${v.name}: "new" — after lesson 1, there from Explore's first paint, nothing moves, covers nothing; no link into Learn; a chord picked ends it for good`, async ({ browser }) => {
      const { context, page } = await fresh(browser, v, 'en');
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      // Watch from the door on: was the hint in the DOM when the Explore header first was?
      // (Wave 2: the door opens lesson 1 of "Start with sound"; Explore comes when they open it.)
      await page.evaluate(() => {
        const w = window as unknown as { __hintFirst: boolean | null };
        w.__hintFirst = null;
        const mo = new MutationObserver(() => {
          if (w.__hintFirst === null && document.querySelector('[data-testid="explore-header"]')) {
            w.__hintFirst = !!document.querySelector('[data-testid="start-hint"]');
            mo.disconnect();
          }
        });
        mo.observe(document, { childList: true, subtree: true });
      });
      await page.getByRole('button', { name: /^I'm new to music/ }).click();
      await expect(page.getByRole('heading', { level: 1, name: 'High and Low' })).toBeVisible({ timeout: 15_000 });
      const hint = page.getByTestId('start-hint');
      await expect(hint).toHaveCount(0);
      await page.getByRole('tab', { name: 'Explore' }).click();
      await expect(hint).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('explore-header')).toBeVisible();
      expect(await page.evaluate(() => (window as unknown as { __hintFirst: boolean | null }).__hintFirst)).toBe(true);
      await expect(hint).toContainText('Tap a piano key to hear it.');
      await page.waitForTimeout(800);
      const rects = () => page.evaluate(() => Object.fromEntries(
        ['[data-testid="start-hint"]', '[data-testid="explore-header"]', '[data-testid="instrument-dock"]', '.chord-row', '#main-content']
          .map((s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return [s, r ? { top: r.top, bottom: r.bottom, left: r.left, right: r.right } : null]; }),
      ));
      const a = await rects();
      await page.waitForTimeout(1200);
      const b = await rects();
      for (const k of Object.keys(a)) {
        if (!a[k] || !b[k]) continue;
        expect(Math.abs(a[k]!.top - b[k]!.top), `${k} moved`).toBeLessThan(2);
      }
      // Covers nothing: it ends above the view, the dock and the chord row.
      const h = b['[data-testid="start-hint"]']!;
      expect(h.bottom).toBeLessThanOrEqual(b['#main-content']!.top + 1);
      expect(h.bottom).toBeLessThanOrEqual(b['[data-testid="instrument-dock"]']!.top + 1);
      if (b['.chord-row']) expect(h.bottom).toBeLessThanOrEqual(b['.chord-row']!.top + 1);
      // One action, ✕; no link into Learn.
      await expect(hint.getByRole('button')).toHaveCount(1);
      await expect(hint.getByRole('button')).toHaveAccessibleName('Dismiss the tip');
      await expect(hint.getByRole('link')).toHaveCount(0);
      // Acting on it: a chord. The line stays while in Explore (nothing jumps under the tap)…
      const before = await page.getByTestId('explore-header').boundingBox();
      await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
      await page.waitForTimeout(400);
      await expect(hint).toBeVisible();
      expect(Math.abs((await page.getByTestId('explore-header').boundingBox())!.y - before!.y)).toBeLessThan(2);
      expect(await savedState(page)).not.toHaveProperty('startHint');
      // …and gone once Explore is left and on the next load.
      await page.getByRole('tab', { name: 'Learn' }).click();
      await expect(page.locator('#learn-panel')).toBeVisible({ timeout: 15_000 });
      await page.getByRole('tab', { name: 'Explore' }).click();
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      await expect(hint).toHaveCount(0);
      await page.reload();
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      await expect(hint).toHaveCount(0);
      await context.close();
    });

    test(`${v.name}: "player" — survives a reload until done; a chord picked ends it without moving the page; ✕ too`, async ({ browser }) => {
      const { context, page } = await fresh(browser, v, 'en');
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await page.getByRole('button', { name: /^I play, but never learned theory/ }).click();
      const hint = page.getByTestId('start-hint');
      await expect(hint).toHaveText('Pick the key of a song you play, for example G. The chords below belong to it: tap one.', { timeout: 15_000 });
      await expect(hint.getByRole('button')).toHaveCount(1);
      await page.reload();
      await expect(hint).toBeVisible({ timeout: 15_000 });
      // Acting on it: a chord. The line stays while in Explore (nothing jumps under the tap)…
      const before = await page.getByTestId('explore-header').boundingBox();
      await page.getByRole('button', { name: 'G Major chord, degree 5' }).click();
      await page.waitForTimeout(400);
      await expect(hint).toBeVisible();
      expect(Math.abs((await page.getByTestId('explore-header').boundingBox())!.y - before!.y)).toBeLessThan(2);
      expect(await savedState(page)).not.toHaveProperty('startHint');
      // …and it is gone on the next load.
      await page.reload();
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(800);
      await expect(hint).toHaveCount(0);
      await context.close();
    });
  }

  test('✕ ends it for good', async ({ browser }) => {
    const { context, page } = await fresh(browser, VIEWPORTS[0], 'pt');
    await page.goto('/');
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /^Toco, mas nunca aprendi teoria/ }).click();
    const hint = page.getByTestId('start-hint');
    await expect(hint).toContainText('Escolhe a tonalidade', { timeout: 15_000 });
    await hint.getByRole('button', { name: 'Fechar a dica' }).click();
    await expect(hint).toHaveCount(0);
    // Focus lands on Explore's key picker, the first control under the hint (the seat's decision 3).
    await expect(page.getByTestId('explore-header').getByTestId('key-picker')).toBeFocused();
    await page.reload();
    await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(800);
    await expect(hint).toHaveCount(0);
    await context.close();
  });
});

test('the page that showed the start screen skips the offline-ready notice', async ({ browser }) => {
  const { context, page } = await fresh(browser, VIEWPORTS[1], 'en');
  await page.goto('/');
  await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
  const raised = await page.evaluate(async () => {
    try { (await import(/* @vite-ignore */ '/src/hooks/usePWA.ts' as string)).showOfflineReady(); return true; } catch { return false; }
  });
  test.skip(!raised, 'needs the dev server\'s /src modules');
  await page.getByRole('button', { name: /^I know some theory/ }).click();
  await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(300);
  await expect(page.getByRole('alert').filter({ hasText: /offline/i })).toHaveCount(0);
  await context.close();
});

test('Settings → "How I use Fermata" changes the profile; no start screen, no hint', async ({ browser }) => {
  const { context, page } = await fresh(browser, VIEWPORTS[1], 'en', () => {
    if (sessionStorage.getItem('e2e:seeded')) return;
    sessionStorage.setItem('e2e:seeded', '1');
    localStorage.setItem('fermata-welcome-v1', 'seen');
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { lastView: 'explore', language: 'en' }, version: 6 }));
  });
  await page.goto('/');
  await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  const group = page.getByRole('radiogroup', { name: 'How I use Fermata' });
  await expect(group.getByRole('radio', { name: 'I know some theory' })).toHaveAttribute('aria-checked', 'true');
  await group.getByRole('radio', { name: 'New to music' }).click();
  await expect(group.getByRole('radio', { name: 'New to music' })).toHaveAttribute('aria-checked', 'true');
  expect(await savedState(page)).toMatchObject({ learnerProfile: 'new' });
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('start-hint')).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  await expect(startScreen(page)).toHaveCount(0);
  await expect(page.getByTestId('start-hint')).toHaveCount(0);
  await context.close();
});
