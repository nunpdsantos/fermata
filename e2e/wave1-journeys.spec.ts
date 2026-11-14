import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { PHONE, LAPTOP, type View, freshBrowser, seededBrowser, savedState, neckDrawn, exploreDetail } from './helpers/wave1';

/**
 * Wave 1 end to end (integration, 2026-11-10): three people, phone and
 * laptop, through the merged app. Nothing here reaches into the app's
 * modules, so it runs on the dev server and on the production build alike.
 *
 *  - Newcomer: an empty browser → the start screen → the tour to its end →
 *    back on the start screen → "I'm new" + Piano → Simple view with the
 *    hint (no link into Learn) → tap a word → its explanation → reload → the
 *    same place → ✕ ends the hint for good.
 *    (English: nothing about Dó-Ré-Mi is saved.)
 *  - Player: an empty Portuguese browser → the start screen in Portuguese →
 *    "Toco, mas nunca aprendi teoria" + Guitarra → Simple, the guitar docked,
 *    the neck as seen facing a player (nut on the right, thick string on
 *    top: the default since 2026-11-14, nothing about it saved), the hint, and both names (Dó-Ré-Mi is on after a door
 *    in PT, the owner's 8.1) → a key and a chord → the hint gone for good →
 *    Settings: Dó-Ré-Mi off → letters only → reload → still off → on again
 *    → Copy link → that link in a second empty browser → the same key, chord
 *    and instrument, no start screen.
 *  - Owner: the production-shaped v6 save and his four other stores → no
 *    start screen, Full view, nut on the right, nothing new saved; "Show me
 *    around" runs and "Back to where I was" puts back his key, scale, chord,
 *    instrument and view; the four other stores are byte-identical after.
 */

const bar = (page: Page) => page.getByTestId('tour-bar');

async function stepToEnd(page: Page, next: string) {
  for (let i = 0; i < 14; i++) {
    await expect(bar(page)).toHaveAttribute('data-phase', 'holding', { timeout: 20_000 });
    const b = page.getByRole('button', { name: next, exact: true });
    if (!(await b.count())) return;
    await b.click();
  }
}

/** The link a "Copy link" / "Share link" press hands over, on any device. */
async function captureShare(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __shared: string[] };
    w.__shared = [];
    Object.defineProperty(navigator, 'share', { configurable: true, value: async (d: { url?: string }) => { w.__shared.push(d.url ?? ''); } });
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    const clip = { writeText: async (s: string) => { w.__shared.push(s); }, readText: async () => w.__shared.at(-1) ?? '' };
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clip });
  });
}

for (const v of [PHONE, LAPTOP] as View[]) {
  test(`newcomer (${v.name}): start screen → tour → start screen → "I'm new" + Piano → lesson 1 of "Start with sound" → Explore: Simple with the hint → a word explained → reload, same place`, async ({ browser }) => {
    test.setTimeout(180_000);
    const { context, page } = await freshBrowser(browser, v);
    await page.goto('/');
    const start = page.getByTestId('start-screen');
    await expect(start).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('start-tour').click();
    await expect(start).toHaveCount(0);
    await stepToEnd(page, 'Next');
    await expect(page.getByTestId('tour-caption')).toHaveText('Your turn.');
    await page.getByTestId('tour-done').click();
    await expect(start).toBeVisible();
    await start.getByRole('radio', { name: 'Piano' }).click();
    await page.getByTestId('start-door-new').click();
    // Wave 2: the door opens lesson 1 of "Start with sound"; the hint waits for Explore.
    await expect(page.getByRole('heading', { level: 1, name: 'High and Low' })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('start-hint')).toHaveCount(0);
    await page.getByRole('tab', { name: 'Explore' }).click();
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    expect(await exploreDetail(page)).toBe('simple');
    const hint = page.getByTestId('start-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toHaveText('Tap a piano key to hear it.');
    await expect(hint.getByRole('link')).toHaveCount(0);
    await expect(hint.getByRole('button')).toHaveCount(1);
    // A word, its explanation (popover on a laptop, a sheet on a phone).
    await page.getByTestId('summary-key').click();
    const explanation = page.locator(v.touch ? '[data-testid="glossary-sheet"]' : '[data-testid="glossary-popover"]');
    await expect(explanation).toBeVisible({ timeout: 15_000 });
    await expect(explanation.locator('.glossary-plain').first()).not.toBeEmpty();
    await page.keyboard.press('Escape');
    await expect(explanation).toHaveCount(0);
    await page.reload();
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await expect(start).toHaveCount(0);
    expect(await exploreDetail(page)).toBe('simple');
    await expect(hint).toBeVisible();
    expect(await savedState(page)).toMatchObject({ learnerProfile: 'new', startHint: 'new', instrument: 'piano' });
    expect(await savedState(page)).not.toHaveProperty('showSolfege');
    // ✕: gone, and still gone after a reload.
    await hint.getByRole('button', { name: 'Dismiss the tip' }).click();
    await expect(hint).toHaveCount(0);
    await page.reload();
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(500);
    await expect(hint).toHaveCount(0);
    expect(await savedState(page)).not.toHaveProperty('startHint');
    await context.close();
  });

  test(`player (${v.name}, pt-PT): start screen in Portuguese → guitar player → Simple, the neck facing a player → key + chord → hint gone → Dó-Ré-Mi → Copy link → a second empty browser opens the same`, async ({ browser }) => {
    test.setTimeout(150_000);
    const { context, page } = await freshBrowser(browser, v, 'pt');
    await captureShare(page);
    await page.goto('/');
    const start = page.getByTestId('start-screen');
    await expect(start).toBeVisible({ timeout: 15_000 });
    await expect(start.getByRole('heading', { level: 2 })).toHaveText('Qual é o teu ponto de partida?');
    await start.getByRole('radio', { name: 'Guitarra' }).click();
    await start.getByText('Toco, mas nunca aprendi teoria').click();
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    expect(await exploreDetail(page)).toBe('simple');
    await expect(page.getByRole('radio', { name: 'Guitarra' }).first()).toHaveAttribute('aria-checked', 'true');
    expect(await neckDrawn(page)).toEqual({ strings: [6, 5, 4, 3, 2, 1], nut: 'right' });
    expect(await savedState(page)).not.toHaveProperty('neckNutSide');
    expect(await savedState(page)).not.toHaveProperty('neckTopString');
    await expect(page.getByTestId('start-hint')).toBeVisible();
    // Both names, right after the door: no visit to Settings.
    await expect(page.getByTestId('key-summary')).toContainText('C (Dó) maior');
    expect((await savedState(page)).showSolfege).toBe(true);
    // The key of a song: G.
    if (v.touch) {
      await page.getByTestId('key-picker').click();
      await page.getByRole('dialog').getByRole('radio', { name: /^G( Sol)?$/ }).click(); // "G Sol": the chip shows both names
      await page.getByRole('dialog').getByRole('button', { name: 'Fechar', exact: true }).click();
    } else {
      await page.getByTestId('key-picker').selectOption({ label: 'G' });
    }
    await expect(page.getByTestId('key-summary')).toContainText('G (Sol) maior');
    // A chord of that key: the hint is done (it leaves with Explore, never to return).
    await page.locator('[data-tour="chord-row"] > button').nth(3).click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    expect((await savedState(page)).startHint).toBeUndefined();
    // Settings: Dó-Ré-Mi off → letters only, and still off after a reload; then on again.
    const toggle = async (pressed: 'true' | 'false') => {
      await page.getByRole('button', { name: /^Mais/ }).click();
      await page.getByRole('menuitem', { name: 'Definições' }).click();
      const settings = page.getByRole('dialog', { name: 'Definições' });
      const chip = settings.getByTestId('solfege-setting').getByRole('button', { name: 'Mostrar também Dó, Ré, Mi' });
      await expect(chip).toHaveAttribute('aria-pressed', pressed === 'true' ? 'false' : 'true');
      await chip.click();
      await expect(chip).toHaveAttribute('aria-pressed', pressed);
      await settings.getByRole('button', { name: 'Fechar', exact: true }).click();
    };
    await toggle('false');
    await expect(page.getByTestId('key-summary')).toContainText('G maior');
    await expect(page.getByTestId('key-summary')).not.toContainText('(Sol)');
    expect(await savedState(page)).not.toHaveProperty('showSolfege');
    await page.reload();
    await expect(page.getByTestId('key-summary')).toContainText('G maior', { timeout: 15_000 });
    await expect(page.getByTestId('key-summary')).not.toContainText('(Sol)');
    await toggle('true');
    await expect(page.getByTestId('key-summary')).toContainText('G (Sol) maior');
    await expect(page.getByTestId('start-hint')).toHaveCount(0); // done for good: gone after that reload
    // The open chord is not saved: after the reload it is picked again.
    await page.locator('[data-tour="chord-row"] > button').nth(3).click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    // The link, from Simple's own menu.
    await page.getByRole('button', { name: 'Ações da escala' }).click();
    await page.getByRole('menuitem', { name: v.touch ? 'Partilhar ligação' : 'Copiar ligação' }).click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { __shared: string[] }).__shared.length)).toBe(1);
    const link = await page.evaluate(() => (window as unknown as { __shared: string[] }).__shared[0]);
    expect(new URL(link).search).toBe('?key=G&scale=major&chord=C&inst=guitar');
    await page.reload();
    await expect(page.getByTestId('start-hint')).toHaveCount(0);
    await context.close();

    // Someone who has never opened Fermata opens it.
    const other = await freshBrowser(browser, v, 'pt');
    await other.page.goto(new URL(link).pathname + new URL(link).search);
    await expect(other.page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await expect(other.page.getByTestId('start-screen')).toHaveCount(0);
    await expect(other.page.getByTestId('key-summary')).toContainText('G maior');
    await expect(other.page.getByTestId('chord-detail').locator('h3')).toContainText('C');
    await expect(other.page.getByRole('radio', { name: 'Guitarra' }).first()).toHaveAttribute('aria-checked', 'true');
    await other.context.close();
  });

  test(`owner (${v.name}): his v6 save → no start screen, Full, nut right, nothing new saved; "Show me around" and "Back to where I was" put everything back; his four other stores byte-identical`, async ({ browser }) => {
    test.setTimeout(180_000);
    const fixture = JSON.parse(fs.readFileSync('src/state/__tests__/fixtures/settings-v6-before-start.json', 'utf8')) as { state: Record<string, unknown>; version: number };
    // His save as production holds it, in Explore with a chord open (the fixture's own view is Learn).
    const save: { state: Record<string, unknown>; version: number } = { ...fixture, state: { ...fixture.state, lastView: 'explore', language: 'en' } };
    const NOW = Date.now();
    const OTHER = {
      'music-theory-progress': JSON.stringify({ state: { progress: {
        completedModules: ['l1u1m1', 'l1u1m2'], moduleProgress: { l1u1m3: ['t1'] },
        exerciseResults: { l1u1m1: { attempts: 2, bestScore: 0.9, passed: true, scores: { l1u1m1e1: 1 } } },
        reviewSchedules: {
          l1u1m1: { completedAt: NOW - 9e8, nextReviewAt: NOW + 9e7, intervalLevel: 1, reviewCount: 1, lastReviewedAt: NOW - 9e7 },
          l1u1m2: { completedAt: NOW - 8e8, nextReviewAt: NOW + 9e7, intervalLevel: 0, reviewCount: 0, lastReviewedAt: NOW - 8e8 },
        },
      } }, version: 4 }),
      'fermata-drill-v1': JSON.stringify({ state: {
        items: {}, settings: { length: 24, newPerSession: 4, families: {}, sound: true, showTimer: false },
        sprintBests: {}, lifetime: { answered: 12, correct: 10 }, activeSession: null, sprint: null, introDone: true,
      }, version: 3 }),
      'fermata-fingering-v1': JSON.stringify({ state: { overrides: {}, labelMode: 'degree' }, version: 1 }),
      'fermata-learn-session-v1': JSON.stringify({ state: { screen: null, check: null }, version: 1 }),
    };
    const { context, page } = await seededBrowser(browser, v, {}, OTHER, { raw: JSON.stringify(save) });
    await page.goto('/');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('start-screen')).toHaveCount(0);
    expect(await exploreDetail(page)).toBe('full');
    await expect(page.getByTestId('start-hint')).toHaveCount(0);
    expect(await neckDrawn(page)).toEqual({ strings: [6, 5, 4, 3, 2, 1], nut: 'right' });
    // His save keeps Explore's dock at Full: on a phone the sheet then covers
    // the view, so he lowers it to Half (its own handle, ↓) before choosing.
    if (v.touch) {
      const handle = page.locator('[data-testid="instrument-dock"] [role="separator"]');
      await handle.focus();
      await page.keyboard.press('ArrowDown');
      await expect(page.locator('#main-content')).not.toHaveAttribute('inert', '');
    }
    // He opens a chord of his key (B♭ Dorian).
    await page.locator('[data-tour="chord-row"] > button').nth(3).click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    const keyName = await page.getByTestId('key-summary').locator('.explore-summary-key').textContent();
    const chordName = await page.getByTestId('chord-detail').locator('h3').textContent();
    const written = JSON.parse((await page.evaluate(() => localStorage.getItem('music-theory-app')))!);
    for (const k of ['learnerProfile', 'startHint', 'exploreDetail', 'neckNutSide', 'neckTopString', 'showSolfege']) expect(written.state).not.toHaveProperty(k);
    const othersBefore = await page.evaluate((ks) => ks.map((k) => localStorage.getItem(k)), Object.keys(OTHER));
    expect(othersBefore).toEqual(Object.values(OTHER));

    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Show me around' }).click();
    await stepToEnd(page, 'Next');
    await expect(page.getByTestId('tour-caption')).toHaveText('Your turn.');
    await page.getByTestId('tour-restore').click();
    await expect(bar(page)).toHaveCount(0);
    expect(await exploreDetail(page)).toBe('full');
    await expect(page.getByTestId('key-summary').locator('.explore-summary-key')).toHaveText(keyName!);
    await expect(page.getByTestId('chord-detail').locator('h3')).toHaveText(chordName!);
    await expect(page.getByRole('radio', { name: 'Guitar' }).first()).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('[data-tab="explore"]')).toHaveAttribute('aria-selected', 'true');
    expect(await page.evaluate((ks) => ks.map((k) => localStorage.getItem(k)), Object.keys(OTHER))).toEqual(othersBefore);
    const after = JSON.parse((await page.evaluate(() => localStorage.getItem('music-theory-app')))!);
    for (const k of ['learnerProfile', 'startHint', 'exploreDetail', 'neckNutSide', 'neckTopString', 'showSolfege']) expect(after.state).not.toHaveProperty(k);
    expect(after.state).toMatchObject({ selectedKey: save.state.selectedKey, selectedScale: save.state.selectedScale, instrument: 'guitar', guitarTuningId: 'drop-d' });
    // Final review (2026-11-10): his whole save, not four fields — the tour
    // leaves nothing of its own (dock, position, octave, volume, stamps).
    expect(after).toEqual(written);
    await context.close();
  });
}
