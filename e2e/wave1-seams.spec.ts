import { test, expect, type Page } from '@playwright/test';
import {
  PHONE, PHONE_320, LANDSCAPE, TABLET, LAPTOP, type Lang,
  freshBrowser, seededBrowser, appKeys, savedState, audit, overlap, boxOf, neckDrawn, exploreDetail,
} from './helpers/wave1';

/**
 * The seams between wave 1's five branches (integration, 2026-11-10), each
 * proved in a real browser. The branches' own specs prove each feature
 * alone; these prove the features together:
 *   1. start screen ↔ tour          6. tour ↔ plain words (the word step)
 *   2. start screen ↔ share links   7. Do-Re-Mi ↔ Simple view
 *   3. start screen ↔ plain words   8. share links ↔ Simple view
 *   4. start screen ↔ guitar neck   9. Settings: the three new rows
 *   5. tour ↔ Simple view          10. toasts: a held link survives a tour
 * Steps that need the dev server's /src modules skip on the build.
 */

const T = {
  en: { more: 'More', showMe: 'Show me around', next: 'Next', settings: 'Settings', player: 'I play, but never learned theory', guitar: 'Guitar' },
  pt: { more: 'Mais', showMe: 'Mostra-me como funciona', next: 'Seguinte', settings: 'Definições', player: 'Toco, mas nunca aprendi teoria', guitar: 'Guitarra' },
  es: { more: 'Más', showMe: 'Enséñame cómo funciona', next: 'Siguiente', settings: 'Ajustes', player: 'Toco, pero nunca aprendí teoría', guitar: 'Guitarra' },
} as const;

const bar = (page: Page) => page.getByTestId('tour-bar');
const startScreen = (page: Page) => page.getByTestId('start-screen');

async function holding(page: Page) {
  await expect(bar(page)).toHaveAttribute('data-phase', 'holding', { timeout: 20_000 });
  await expect(bar(page)).toHaveAttribute('data-measured', 'true');
  await page.waitForTimeout(250);
}

/** Step with Next (reduced motion) until `stopAt` (a step id) or the end card; returns the ids seen. */
async function stepTo(page: Page, lang: Lang, stopAt?: string, each?: (step: string) => Promise<void>) {
  const ids: string[] = [];
  for (let i = 0; i < 14; i++) {
    await holding(page);
    const step = (await bar(page).getAttribute('data-step'))!;
    ids.push(step);
    if (each) await each(step);
    if (step === stopAt) return ids;
    const next = page.getByRole('button', { name: T[lang].next, exact: true });
    if (!(await next.count())) break;
    await next.click();
  }
  return ids;
}

async function menuTour(page: Page, lang: Lang = 'en') {
  await page.getByRole('button', { name: new RegExp(`^${T[lang].more}`) }).click();
  await page.getByRole('menuitem', { name: T[lang].showMe }).click();
  await expect(bar(page)).toBeVisible();
}

// ─── 1. Start screen ↔ tour ─────────────────────────────────────────────────
test.describe('1. start screen ↔ tour', () => {
  for (const v of [PHONE, LAPTOP]) {
    test(`${v.name}: the tour from the start screen plays, puts everything back, and the start screen returns (focus on the tour button, and after a reload)`, async ({ browser }) => {
      test.setTimeout(150_000);
      const { context, page } = await freshBrowser(browser, v);
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      const keysBefore = await appKeys(page);
      await page.getByTestId('start-tour').click();
      await expect(startScreen(page)).toHaveCount(0);
      const ids = await stepTo(page, 'en');
      expect(ids).toContain('learn');
      expect(ids).toContain('drill');
      expect(ids.at(-1)).toBe('end');
      // A start-screen tour simply ends: one "Done".
      await page.getByTestId('tour-done').click();
      await expect(startScreen(page)).toBeVisible();
      await expect(page.getByTestId('start-tour')).toBeFocused();
      // Nothing the start screen counts as "has used the app" (hasLearningData).
      expect(await appKeys(page)).toEqual(keysBefore);
      await page.reload();
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await context.close();
    });
  }

  test('stopped half-way (Close at the chord step): the start screen returns, and after a reload', async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await freshBrowser(browser, PHONE);
    await page.goto('/');
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    const keysBefore = await appKeys(page);
    await page.getByTestId('start-tour').click();
    await stepTo(page, 'en', 'chord');
    await page.getByTestId('tour-close').click();
    await expect(startScreen(page)).toBeVisible();
    await expect(page.getByTestId('start-tour')).toBeFocused();
    expect(await appKeys(page)).toEqual(keysBefore);
    await page.reload();
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    await context.close();
  });

  for (const at of ['learn', 'drill'] as const) {
    test(`the tab closed (pagehide) while the tour stands in ${at === 'learn' ? 'Learn' : 'Drill'}: nothing is left that ends the start screen`, async ({ browser }) => {
      test.setTimeout(90_000);
      const { context, page } = await freshBrowser(browser, LAPTOP);
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      const keysBefore = await appKeys(page);
      await page.getByTestId('start-tour').click();
      await stepTo(page, 'en', at);
      await expect(page.locator(at === 'learn' ? '#learn-panel h1' : '#drill-intro-title')).toBeVisible();
      // A reload fires pagehide on the old page (the tour ends there as Close does).
      await page.reload();
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      expect(await appKeys(page)).toEqual(keysBefore);
      await context.close();
    });
  }

  test('a tour whose chunk cannot load clears the request: the start screen is back, not a bare app', async ({ browser }) => {
    test.setTimeout(60_000);
    const { context, page } = await freshBrowser(browser, PHONE);
    await page.route(/TourPlayer/, (route) => route.abort());
    await page.goto('/');
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('start-tour').click();
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    await expect(bar(page)).toHaveCount(0);
    await context.close();
  });
});

// ─── 2. Start screen ↔ share links ──────────────────────────────────────────
test.describe('2. start screen ↔ share links (one rule: openedFromShareLink)', () => {
  for (const [name, link, check] of [
    ['a key + chord + guitar link', '/?key=D&scale=major&chord=A&inst=guitar', async (page: Page) => {
      await expect(page.getByTestId('key-summary')).toContainText('D Major');
      await expect(page.getByTestId('chord-detail').locator('h3')).toContainText('A');
      await expect(page.getByRole('radio', { name: 'Guitar' }).first()).toHaveAttribute('aria-checked', 'true');
    }],
    ['a link with a bare # inside a value (?chord=F#m7)', '/?key=E&scale=major&chord=F#m7', async (page: Page) => {
      await expect(page.getByTestId('key-summary')).toContainText('E Major');
      await expect(page.getByTestId('chord-detail').locator('h3')).toContainText('F♯');
    }],
  ] as const) {
    test(`a truly new browser: ${name} opens its content with no start screen; the next plain visit shows the start screen`, async ({ browser }) => {
      test.setTimeout(60_000);
      const { context, page } = await freshBrowser(browser, PHONE);
      await page.goto(link);
      await expect(page.locator('#explore-panel')).toBeVisible({ timeout: 15_000 });
      await check(page);
      await expect(startScreen(page)).toHaveCount(0);
      expect(new URL(page.url()).search).toBe('');
      expect(new URL(page.url()).hash).toBe('');
      // Only settings were saved.
      expect(await appKeys(page)).toEqual(['fermata-welcome-v1', 'music-theory-app']);
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await context.close();
    });
  }
});

// ─── 3. Start screen ↔ plain words ──────────────────────────────────────────
test.describe('3. start screen ↔ plain words', () => {
  for (const door of ['new', 'player', 'theory'] as const) {
    test(`door "${door}" lands in Explore in ${door === 'theory' ? 'Full' : 'Simple'} view`, async ({ browser }) => {
      const { context, page } = await freshBrowser(browser, LAPTOP);
      await page.goto('/');
      await page.getByTestId(`start-door-${door}`).click();
      await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
      expect(await exploreDetail(page)).toBe(door === 'theory' ? 'full' : 'simple');
      await expect(page.getByTestId('start-hint')).toHaveCount(door === 'theory' ? 0 : 1);
      await context.close();
    });
  }
  test('an existing learner (a save from before wave 1) lands in Full view, no hint', async ({ browser }) => {
    const { context, page } = await seededBrowser(browser, LAPTOP, { lastView: 'explore', language: 'en' });
    await page.goto('/');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    expect(await exploreDetail(page)).toBe('full');
    await expect(page.getByTestId('start-hint')).toHaveCount(0);
    await context.close();
  });

  // The start hint and Simple view together, everywhere: nothing overlaps or
  // is clipped, and on a phone ▶ Chord stays in view when a chord opens.
  for (const v of [PHONE, PHONE_320, LANDSCAPE, TABLET, LAPTOP]) {
    for (const instrument of ['piano', 'guitar'] as const) {
      for (const lang of ['en', 'pt', 'es'] as const) {
        const hint = instrument === 'piano' ? 'new' : 'player';
        // PT / ES: what a door leaves since the owner's 8.1 — Dó-Ré-Mi on.
        test(`${v.name} ${instrument} ${lang}${lang === 'en' ? '' : ' + Dó-Ré-Mi'}: Simple view with the "${hint}" hint fits; ▶ Chord in view with a chord open`, async ({ browser }) => {
          test.setTimeout(60_000);
          const { context, page } = await seededBrowser(browser, v, {
            lastView: 'explore', language: lang, themeMode: 'fermata', instrument,
            learnerProfile: hint, startHint: hint, neckNutSide: 'left', neckTopString: 'high',
            ...(lang === 'en' ? {} : { showSolfege: true }),
          }, {}, { lang });
          await page.goto('/');
          const hintEl = page.getByTestId('start-hint');
          await expect(hintEl).toBeVisible({ timeout: 15_000 });
          expect(await exploreDetail(page)).toBe('simple');
          if (lang !== 'en') await expect(page.getByTestId('key-summary')).toContainText(lang === 'pt' ? 'C (Dó)' : 'C (Do)');
          const where = `${v.name} ${instrument} ${lang}`;
          const topBar = (await boxOf(page, '.app-topbar'))!;
          const hb = (await boxOf(page, '[data-testid="start-hint"]'))!;
          const dock = (await boxOf(page, '[data-testid="instrument-dock"]'))!;
          expect(overlap(hb, topBar), `${where}: hint under the top bar`).toBe(0);
          expect(hb.bottom, `${where}: hint above the instrument`).toBeLessThanOrEqual(dock.top + 1);
          await audit(page, v, `${where} simple+hint`);
          // A chord: on a phone ▶ Chord comes above the sheet, below the hint.
          const card = page.locator('[data-tour="chord-row"] > button').first();
          await card.scrollIntoViewIfNeeded();
          await card.click();
          const play = page.locator('[data-tour="play-chord"]');
          await expect(play).toBeVisible();
          await page.waitForTimeout(600); // the detail scrolls itself into view
          const pb = (await boxOf(page, '[data-tour="play-chord"]'))!;
          const dock2 = (await boxOf(page, '[data-testid="instrument-dock"]'))!;
          const hint2 = await boxOf(page, '[data-testid="start-hint"]');
          expect.soft(pb.top, `${where}: ▶ Chord below the top of the view`).toBeGreaterThanOrEqual((hint2 ?? topBar).bottom - 1);
          expect.soft(pb.bottom, `${where}: ▶ Chord above the instrument`).toBeLessThanOrEqual(dock2.top + 1);
          expect.soft(pb.bottom, `${where}: ▶ Chord on screen`).toBeLessThanOrEqual(v.viewport.height);
          await audit(page, v, `${where} simple+hint+chord`);
          await context.close();
        });
      }
    }
  }
});

// ─── 4. Start screen ↔ guitar neck ──────────────────────────────────────────
test.describe('4. start screen ↔ guitar neck', () => {
  test('new browser → language switched on the start screen → reload → "player" + Guitar: nut left, thin string on top, still after a reload', async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await freshBrowser(browser, LAPTOP);
    await page.goto('/');
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    await startScreen(page).getByRole('radio', { name: 'Português' }).click();
    await expect(page.getByText('Qual é o teu ponto de partida?')).toBeVisible();
    // That first write must not make a new visitor a "legacy" one.
    const first = await savedState(page);
    expect(first).toMatchObject({ language: 'pt', neckNutSide: 'left', neckTopString: 'high' });
    await page.reload();
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    await startScreen(page).getByRole('radio', { name: T.pt.guitar }).click();
    await page.getByTestId('start-door-player').click();
    expect(await neckDrawn(page)).toEqual({ strings: [1, 2, 3, 4, 5, 6], nut: 'left' });
    await page.reload();
    await expect(startScreen(page)).toHaveCount(0);
    expect(await neckDrawn(page)).toEqual({ strings: [1, 2, 3, 4, 5, 6], nut: 'left' });
    await context.close();
  });

  test("the owner's frozen v6 save: nut right, thick string on top, no start screen, Full, no hint, 'I know some theory', written back with no new field", async ({ browser }) => {
    test.setTimeout(60_000);
    const fs = await import('node:fs');
    const raw = fs.readFileSync('src/state/__tests__/fixtures/settings-v6-before-start.json', 'utf8');
    const frozen = JSON.parse(raw) as { state: Record<string, unknown>; version: number };
    // Explore, so the neck is drawn (the fixture's own lastView is Learn).
    const save: { state: Record<string, unknown>; version: number } = { ...frozen, state: { ...frozen.state, lastView: 'explore' } };
    const { context, page } = await seededBrowser(browser, LAPTOP, {}, {}, { lang: 'pt', raw: JSON.stringify(save) });
    await page.goto('/');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await expect(startScreen(page)).toHaveCount(0);
    expect(await exploreDetail(page)).toBe('full');
    await expect(page.getByTestId('start-hint')).toHaveCount(0);
    expect(await neckDrawn(page)).toEqual({ strings: [6, 5, 4, 3, 2, 1], nut: 'right' });
    // Written back (boot writes the save) with none of the new fields.
    const written = JSON.parse((await page.evaluate(() => localStorage.getItem('music-theory-app')))!);
    expect(written.version).toBe(6);
    const { preferencesUpdatedAt: _a, ...after } = written.state;
    const { preferencesUpdatedAt: _b, ...before } = save.state;
    expect(after).toEqual(before);
    for (const k of ['learnerProfile', 'startHint', 'exploreDetail', 'neckNutSide', 'neckTopString', 'showSolfege']) expect(written.state).not.toHaveProperty(k);
    await page.getByRole('button', { name: /^Mais/ }).click();
    await page.getByRole('menuitem', { name: T.pt.settings }).click();
    const dialog = page.getByRole('dialog', { name: T.pt.settings });
    await expect(dialog.getByRole('radio', { name: 'Sei alguma teoria' })).toHaveAttribute('aria-checked', 'true');
    await context.close();
  });
});

// ─── 5. Tour ↔ Simple view ──────────────────────────────────────────────────
test.describe('5. tour ↔ Simple view', () => {
  const RUNS = [
    ...[PHONE, LAPTOP].flatMap((v) => (['piano', 'guitar'] as const).map((instrument) => ({ v, instrument, lang: 'en' as Lang }))),
    // A pt-PT newcomer's default screen since 8.1: Simple + the hint + Dó-Ré-Mi.
    ...[PHONE, LAPTOP].map((v) => ({ v, instrument: 'guitar' as const, lang: 'pt' as Lang })),
  ];
  for (const { v, instrument, lang } of RUNS) {
    {
      test(`${v.name} ${instrument} ${lang}${lang === 'pt' ? ' + Dó-Ré-Mi' : ''}: a guided learner's tour from the menu runs to its end card in Simple, never over the hint, and "Back to where I was" returns to Simple; the "player" hint survives`, async ({ browser }) => {
        test.setTimeout(150_000);
        const { context, page } = await seededBrowser(browser, v, {
          lastView: 'explore', language: lang, themeMode: 'fermata', instrument,
          learnerProfile: 'player', startHint: 'player', neckNutSide: 'left', neckTopString: 'high',
          selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'major',
          ...(lang === 'pt' ? { showSolfege: true } : {}),
        }, {}, { lang });
        await page.goto('/');
        await expect(page.getByTestId('start-hint')).toBeVisible({ timeout: 15_000 });
        expect(await exploreDetail(page)).toBe('simple');
        await menuTour(page, lang);
        const ids = await stepTo(page, lang, undefined, async (step) => {
          const b = (await boxOf(page, '[data-testid="tour-bar"]'))!;
          const h = await boxOf(page, '[data-testid="start-hint"]');
          if (h) expect.soft(overlap(b, h), `${v.name} ${instrument} ${step}: the caption bar lies over the start hint`).toBe(0);
          // Simple has no chords tabs: the tour never shows them.
          if (await page.getByTestId('explore-root').count()) expect.soft(await page.locator('#chords-tab-diatonic').count(), `${step}: chords tabs`).toBe(0);
        });
        expect(ids).not.toContain('circle');
        expect(ids).toContain('word');
        expect(ids.at(-1)).toBe('end');
        await page.getByTestId('tour-restore').click();
        await expect(bar(page)).toHaveCount(0);
        expect(await exploreDetail(page)).toBe('simple');
        await expect(page.getByTestId('key-summary')).toContainText(lang === 'pt' ? 'A (Lá) maior' : 'A Major');
        if (lang === 'pt') expect((await savedState(page)).showSolfege).toBe(true);
        // The tour's own chord pick did not end the "player" hint.
        expect((await savedState(page)).startHint).toBe('player');
        await expect(page.getByTestId('start-hint')).toBeVisible();
        await context.close();
      });
    }
  }
});

// ─── 6. Tour ↔ plain words: the word step ───────────────────────────────────
test.describe('6. the tour\'s word step', () => {
  for (const v of [LAPTOP, PHONE, LANDSCAPE]) {
    test(`${v.name}: a dotted word opens its explanation (${v === LAPTOP ? 'popover' : 'sheet'}); the bar and it never cover each other; Next is in reach; leaving closes it; nothing is written`, async ({ browser }) => {
      test.setTimeout(120_000);
      const { context, page } = await seededBrowser(browser, v, { lastView: 'explore', language: 'en', themeMode: 'fermata', instrument: 'piano' });
      await page.goto('/');
      await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(500);
      const saveBefore = await page.evaluate(() => localStorage.getItem('music-theory-app'));
      await menuTour(page);
      await stepTo(page, 'en', 'word');
      await expect(page.getByTestId('tour-caption')).toHaveText('Any word with a dotted line explains itself. Tap it.');
      const panelSel = v === LAPTOP ? '[data-testid="glossary-popover"]' : '[data-testid="glossary-sheet"]';
      const explanation = page.locator(v === LAPTOP ? '[data-testid="glossary-popover"]' : '[data-testid="glossary-sheet"]');
      await expect(explanation).toBeVisible();
      await expect(explanation.locator('.glossary-plain').first()).toBeVisible();
      // Full view: the word is "V · dominant".
      await expect(page.locator('[data-testid="chord-role"] button.term')).toHaveText('V · dominant');
      const b = (await boxOf(page, '[data-testid="tour-bar"]'))!;
      const p = (await boxOf(page, panelSel))!;
      expect(overlap(b, p), `${v.name}: the bar and the explanation overlap`).toBe(0);
      // Next is the element at its own centre (not under a sheet's scrim).
      const next = page.getByRole('button', { name: 'Next', exact: true });
      const hit = await next.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const at = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!at && (at === el || el.contains(at));
      });
      expect(hit, `${v.name}: Next is covered`).toBe(true);
      await next.click();
      await holding(page);
      await expect(page.locator('[data-testid="glossary-popover"], [data-testid="glossary-sheet"]')).toHaveCount(0);
      await page.getByTestId('tour-close').click();
      await expect(bar(page)).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('music-theory-app'))).toBe(saveBefore);
      await context.close();
    });
  }

  test('stopped on the word step: the explanation closes and the app is put back', async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await seededBrowser(browser, LAPTOP, { lastView: 'explore', language: 'en', instrument: 'piano', selectedKey: { natural: 'E', accidental: 'b' }, selectedScale: 'major' });
    await page.goto('/');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await menuTour(page);
    await stepTo(page, 'en', 'word');
    await expect(page.getByTestId('glossary-popover')).toBeVisible();
    await page.getByTestId('tour-close').click();
    await expect(page.getByTestId('glossary-popover')).toHaveCount(0);
    await expect(page.getByTestId('key-summary')).toContainText('E♭ Major');
    await context.close();
  });
});

// ─── 7. Do-Re-Mi ↔ Simple view ──────────────────────────────────────────────
test.describe('7. Do-Re-Mi ↔ Simple view', () => {
  for (const lang of ['pt', 'es'] as const) {
    for (const v of [PHONE, PHONE_320]) {
      test(`${lang} ${v.name}: Simple's summary, note strip and root chips show both names, letter first, and pass the audit`, async ({ browser }) => {
        test.setTimeout(60_000);
        const { context, page } = await seededBrowser(browser, v, {
          lastView: 'explore', language: lang, themeMode: 'fermata', instrument: 'piano', learnerProfile: 'new', showSolfege: true,
          selectedKey: { natural: 'G', accidental: '' }, selectedScale: 'major',
        }, {}, { lang });
        await page.goto('/');
        await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
        expect(await exploreDetail(page)).toBe('simple');
        const sol = lang === 'pt' ? 'Sol' : 'Sol';
        const summary = page.getByTestId('key-summary');
        // "G (Sol) maior · um sustenido" / "G (Sol) mayor · un sostenido": the letter, the name, the words.
        await expect(summary).toContainText(`G (${sol})`);
        await expect(summary).toContainText(lang === 'pt' ? 'um sustenido' : 'un sostenido');
        expect((await summary.textContent())!.indexOf('G')).toBeLessThan((await summary.textContent())!.indexOf(sol));
        const strip = page.getByTestId('scale-strip');
        await expect(strip).toContainText(lang === 'pt' ? 'Ré' : 'Re');
        await audit(page, v, `${lang} ${v.name} simple solfege`);
        // The key sheet's root chips (a phone).
        await page.getByTestId('key-picker').click();
        const chip = page.getByRole('radio', { name: /^D\b/ }).first();
        await expect(chip).toContainText(lang === 'pt' ? 'Ré' : 'Re');
        await audit(page, v, `${lang} ${v.name} key sheet solfege`);
        await context.close();
      });
    }
  }
});

// ─── 8. Share links ↔ Simple view ───────────────────────────────────────────
test.describe('8. share links ↔ Simple view', () => {
  test('a link naming a scale outside Simple\'s short list opens with that scale selected; Copy link is in Simple\'s menu', async ({ browser, baseURL }) => {
    test.setTimeout(60_000);
    const { context, page } = await seededBrowser(browser, LAPTOP, { lastView: 'explore', language: 'en', learnerProfile: 'new' }, {}, { permissions: ['clipboard-read', 'clipboard-write'] });
    await page.goto('/?key=D&scale=dorian');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    expect(await exploreDetail(page)).toBe('simple');
    await expect(page.getByTestId('key-summary')).toContainText('D Dorian');
    const scale = page.getByTestId('scale-picker');
    await expect(scale).toHaveAttribute('data-short', '');
    await expect(scale).toHaveValue('dorian');
    await page.getByRole('button', { name: 'Scale actions' }).click();
    await page.getByRole('menuitem', { name: 'Copy link' }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/?key=D&scale=dorian&inst=piano`);
    await context.close();
  });
});

// ─── 9. Settings ────────────────────────────────────────────────────────────
test.describe('9. Settings: "How I use Fermata", "Guitar neck", Do-Re-Mi', () => {
  for (const lang of ['pt', 'es'] as const) {
    for (const theme of ['fermata', 'fermata-night'] as const) {
      test(`${lang} 320 px ${theme === 'fermata' ? 'day' : 'night'}: the three additions coexist and pass the audit`, async ({ browser }) => {
        test.setTimeout(60_000);
        const { context, page } = await seededBrowser(browser, PHONE_320, { lastView: 'explore', language: lang, themeMode: theme, learnerProfile: 'player' }, {}, { lang });
        await page.goto('/');
        await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
        await page.getByRole('button', { name: new RegExp(`^${T[lang].more}`) }).click();
        await page.getByRole('menuitem', { name: T[lang].settings }).click();
        const dialog = page.getByRole('dialog', { name: T[lang].settings });
        await expect(dialog).toBeVisible();
        await page.waitForTimeout(300);
        await expect(dialog.getByTestId('solfege-setting')).toBeVisible();
        await expect(dialog.getByText(lang === 'pt' ? 'Como uso o Fermata' : 'Cómo uso Fermata').first()).toBeVisible();
        await expect(dialog.getByTestId('neck-settings')).toBeAttached();
        await audit(page, PHONE_320, `${lang} settings top`);
        await dialog.getByTestId('neck-settings').scrollIntoViewIfNeeded();
        await audit(page, PHONE_320, `${lang} settings neck`);
        await context.close();
      });
    }
  }
});

// ─── 10. Toasts: a held link survives a tour ────────────────────────────────
test('10. a held share link ("Open") survives a tour and stays tappable after it', async ({ browser }) => {
  test.setTimeout(150_000);
  const { context, page } = await seededBrowser(browser, PHONE, { lastView: 'explore', language: 'en', instrument: 'piano' });
  await page.goto('/?lesson=l2u5m3');
  await expect(page.getByRole('heading', { level: 1, name: 'Relative and Parallel Keys' })).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('section-picker').getByRole('button', { name: 'Check', exact: true }).click();
  await page.getByRole('button', { name: 'Start the check' }).click();
  await page.getByTestId('check-answers').locator('button').first().click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.goto('/?key=D&scale=major&chord=A&inst=guitar');
  await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Exit the check' }).click();
  const open = page.getByTestId('toast-region').getByRole('button', { name: 'Open' });
  await expect(open).toBeVisible({ timeout: 10_000 });
  // The tour plays (its bar keeps toasts off itself), then ends.
  await menuTour(page);
  await stepTo(page, 'en', 'chord');
  await page.getByTestId('tour-close').click();
  await expect(bar(page)).toHaveCount(0);
  await expect(open).toBeVisible({ timeout: 10_000 });
  const hit = await open.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const at = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!at && (at === el || el.contains(at));
  });
  expect(hit, 'the Open button is tappable').toBe(true);
  await open.click();
  await expect(page.getByTestId('key-summary')).toContainText('D Major', { timeout: 15_000 });
  await expect(page.getByRole('radio', { name: 'Guitar' }).first()).toHaveAttribute('aria-checked', 'true');
  await context.close();
});

// ─── 8.1 Dó-Ré-Mi for a new PT / ES visitor: where it does and does not come on ──
test.describe('8.1 Dó-Ré-Mi on for a new PT / ES visitor, at a door only', () => {
  for (const lang of ['pt', 'es'] as const) {
    test(`${lang}: the tour from the start screen shows letters only and saves nothing (a known limit); the door then turns both names on`, async ({ browser }) => {
      test.setTimeout(150_000);
      const { context, page } = await freshBrowser(browser, LAPTOP, lang);
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await page.getByTestId('start-tour').click();
      await holding(page);
      // The tour's first step chooses G major: letters only.
      await expect(page.getByTestId('key-summary')).toContainText(lang === 'pt' ? 'G maior' : 'G mayor');
      await expect(page.getByTestId('key-summary')).not.toContainText('(Sol)');
      await stepTo(page, lang);
      await page.getByTestId('tour-done').click();
      await expect(startScreen(page)).toBeVisible();
      expect(await savedState(page)).not.toHaveProperty('showSolfege');
      await page.getByTestId('start-door-theory').click();
      await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
      expect((await savedState(page)).showSolfege).toBe(true);
      await expect(page.getByTestId('key-summary')).toContainText(lang === 'pt' ? 'C (Dó)' : 'C (Do)');
      await context.close();
    });
  }

  test('pt: a new visitor who arrives by a share link sees letters only until a door (a known limit)', async ({ browser }) => {
    const { context, page } = await freshBrowser(browser, PHONE, 'pt');
    await page.goto('/?key=D&scale=major&chord=A&inst=guitar');
    await expect(page.getByTestId('key-summary')).toContainText('D maior', { timeout: 15_000 });
    await expect(page.getByTestId('key-summary')).not.toContainText('(Ré)');
    expect(await savedState(page)).not.toHaveProperty('showSolfege');
    await context.close();
  });

  test('en: a door in English writes nothing; switching to Portuguese later finds the switch off (a known limit)', async ({ browser }) => {
    const { context, page } = await freshBrowser(browser, PHONE, 'en');
    await page.goto('/');
    await page.getByTestId('start-door-new').click();
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    expect(await savedState(page)).not.toHaveProperty('showSolfege');
    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await page.getByRole('dialog', { name: 'Settings' }).getByRole('radio', { name: 'Português' }).click();
    const chip = page.getByTestId('solfege-setting').getByRole('button', { name: 'Mostrar também Dó, Ré, Mi' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(await savedState(page)).not.toHaveProperty('showSolfege');
    await context.close();
  });
});
