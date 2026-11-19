import { test, expect, type Browser, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { welcomeSeenState } from './helpers/welcome';

/**
 * A lesson task's quoted phrase in the learner's language (the owner, 19
 * November 2026: "the labels should be in the learner language as well").
 * The token stays the English query (what a tap runs); the words in the
 * quotes are the name of what it opens, as Explore then names it:
 *
 *  - PT / ES: «Carrega em ‘C maior’», «Pulsa ‘A menor natural’», a chord in
 *    words «‘C Maior’»; a symbol (‘C7’, ‘Am’) as written; English as before.
 *  - Tapped: the panel repeats the same words; "Open in Explore" shows them
 *    as Explore's own name for it (the key summary, the chord's heading).
 *  - A screen reader hears the label, not the token.
 *
 * LABEL_SHOTS=<dir> writes one lesson's tasks in PT and ES at 390 and 1440 px.
 */

const SHOTS = process.env.LABEL_SHOTS;
type Lang = 'en' | 'pt' | 'es';
const OPEN: Record<Lang, string> = { en: 'Open in Explore', pt: 'Abrir em Explorar', es: 'Abrir en Explorar' };

async function lesson(browser: Browser, lang: Lang, id: string, viewport = { width: 1440, height: 900 }) {
  const state = welcomeSeenState(test.info().project.use.baseURL!);
  state.origins[0].localStorage = state.origins[0].localStorage.map((e) =>
    e.name === 'music-theory-app' ? { ...e, value: JSON.stringify({ state: { language: lang, themeMode: 'fermata', lastView: 'learn', instrument: 'piano' }, version: 6 }) } : e);
  const touch = viewport.width < 640;
  const context = await browser.newContext({ storageState: state, viewport, isMobile: touch, hasTouch: touch, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`/?lesson=${id}`);
  await expect(page.locator('[data-section="tasks"]')).toBeAttached({ timeout: 15_000 });
  await page.locator('[data-section="tasks"]').scrollIntoViewIfNeeded();
  return { context, page };
}

/** The task phrases (buttons inside the task list), as drawn and as named for a screen reader. */
const phrases = (page: Page) => page.locator('[data-section="tasks"] button[aria-expanded]').evaluateAll((bs) =>
  bs.map((b) => ({ text: b.textContent ?? '', name: (b as HTMLElement).getAttribute('aria-label') })));

test('screenshots of one lesson\'s tasks (LABEL_SHOTS)', async ({ browser }) => {
  test.skip(!SHOTS, 'only when LABEL_SHOTS is set');
  mkdirSync(SHOTS!, { recursive: true });
  for (const lang of ['en', 'pt', 'es'] as const) {
    for (const width of [390, 1440]) {
      const { context, page } = await lesson(browser, lang, 'l4u14m5', { width, height: width < 640 ? 844 : 900 });
      await page.waitForTimeout(400);
      await page.locator('[data-section="tasks"]').screenshot({ path: `${SHOTS}/task-labels-l4u14m5-${lang}-${width}.png` });
      await context.close();
    }
  }
});

for (const [lang, want] of [
  ['pt', ['‘C Maior’', '‘E Maior’', '‘G Maior’', '‘A menor natural’', '‘A menor harmónica’']],
  ['es', ['‘C Mayor’', '‘E Mayor’', '‘G Mayor’', '‘A menor natural’', '‘A menor armónica’']],
] as const) {
  test(`${lang}: the phrases read in ${lang === 'pt' ? 'Portuguese' : 'Spanish'}; tapped, the panel and Explore name them so`, async ({ browser }) => {
    const { context, page } = await lesson(browser, lang, 'l4u14m5');
    const shown = await phrases(page);
    for (const w of want) expect(shown.map((p) => p.text), w).toContain(w);
    // No English word left inside the quotes; no hidden name with the token.
    for (const p of shown) {
      // English words of the tokens ("natural" is Portuguese and Spanish too).
      expect(p.text, p.text).not.toMatch(/\b(major|minor|chord|scale|key|harmonic|melodic)\b/i);
      expect(p.name).toBeNull();
    }
    // The scale: tap, the panel repeats it, Explore names it the same.
    const scale = page.locator('[data-section="tasks"]').getByRole('button', { name: want[3], exact: true });
    await scale.click();
    const panel = page.locator('[data-section="tasks"] [data-testid="inline-try-this"]');
    await expect(panel).toContainText(want[3]);
    await panel.getByRole('button', { name: OPEN[lang] }).click();
    await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('explore-header')).toContainText(want[3].slice(1, -1));
    await context.close();
  });
}

test('pt: a chord in words, tapped and opened in Explore: the chord\'s heading is the phrase\'s words', async ({ browser }) => {
  const { context, page } = await lesson(browser, 'pt', 'l4u14m5');
  await page.locator('[data-section="tasks"]').getByRole('button', { name: '‘G Maior’', exact: true }).first().click();
  const panel = page.locator('[data-section="tasks"] [data-testid="inline-try-this"]');
  await expect(panel).toContainText('‘G Maior’');
  await panel.getByRole('button', { name: OPEN.pt }).click();
  await expect(page.getByTestId('chord-detail')).toBeVisible({ timeout: 15_000 });
  // The heading draws the root and the quality's name side by side.
  const heading = await page.locator('.chord-detail-name').evaluate((h) => `${h.firstChild!.textContent} ${h.querySelector('.chord-detail-quality')!.textContent}`);
  expect(heading).toBe('G Maior');
  await context.close();
});

test('en: the phrases are the tokens, as before', async ({ browser }) => {
  const { context, page } = await lesson(browser, 'en', 'l4u14m5');
  const shown = (await phrases(page)).map((p) => p.text);
  for (const w of ['‘C major chord’', '‘E major chord’', '‘G major chord’', '‘A natural minor scale’', '‘A harmonic minor scale’']) expect(shown).toContain(w);
  await context.close();
});
