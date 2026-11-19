import { test, expect, type Browser, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { welcomeSeenState } from './helpers/welcome';

/**
 * A lesson's practice tasks (audit Q5, 18 November 2026), as the learner
 * meets them: under "On your piano" or "On your guitar", whichever is
 * selected, no task tells the learner to type (the quoted query is a link
 * the learner taps) and none sends a guitarist to the piano; and the link of
 * a rewritten task still runs its query, on the piano and on the guitar, in
 * English, Portuguese and Spanish.
 *
 * TASK_SHOTS=<dir> writes the tasks section of "The Staff and Clefs" with
 * the guitar selected (laptop and phone, EN and PT) for the owner's eye.
 */

const PORT = Number(process.env.PW_PORT ?? 5173);
const SHOTS = process.env.TASK_SHOTS;

type Lang = 'en' | 'pt' | 'es';
type Instrument = 'piano' | 'guitar';

const WORDS: Record<Lang, { heading: Record<Instrument, string>; show: Record<Instrument, string>; tap: RegExp; typing: RegExp }> = {
  en: { heading: { piano: 'On your piano', guitar: 'On your guitar' }, show: { piano: 'Show on the piano', guitar: 'Show on the guitar' }, tap: /^Tap ‘G major scale’ — which note needs a sharp/, typing: /\b(?:type|typing)\b/i },
  pt: { heading: { piano: 'No teu piano', guitar: 'Na tua guitarra' }, show: { piano: 'Mostrar no piano', guitar: 'Mostrar na guitarra' }, tap: /^Carrega em ‘G major scale’ — que nota precisa de sustenido/, typing: /(?<!\p{L})escrev\p{L}*/iu },
  es: { heading: { piano: 'En tu piano', guitar: 'En tu guitarra' }, show: { piano: 'Mostrar en el piano', guitar: 'Mostrar en la guitarra' }, tap: /^Pulsa ‘G major scale’ — ¿qué nota necesita sostenido/, typing: /(?<!\p{L})escrib\p{L}*/iu },
};

/** A learner with a settings save: the language, the instrument, Learn. */
async function learner(browser: Browser, lang: Lang, instrument: Instrument, viewport = { width: 1440, height: 900 }) {
  const state = welcomeSeenState(`http://localhost:${PORT}`);
  state.origins[0].localStorage = state.origins[0].localStorage.map((e) =>
    e.name === 'music-theory-app' ? { ...e, value: JSON.stringify({ state: { language: lang, themeMode: 'fermata', lastView: 'learn', instrument }, version: 6 }) } : e);
  const context = await browser.newContext({ storageState: state, viewport, serviceWorkers: 'block', reducedMotion: 'reduce' });
  return { context, page: await context.newPage() };
}

const tasks = (page: Page) => page.locator('[data-section="tasks"]');
/** Each task's instruction (the header's "0/3" is not one). */
const taskTexts = (page: Page) => tasks(page).locator('.divide-y > div > div:first-child > span.text-ui');

async function openLesson(page: Page, id: string) {
  await page.goto(`/?lesson=${id}`);
  await expect(tasks(page)).toBeAttached({ timeout: 15_000 });
  await tasks(page).scrollIntoViewIfNeeded();
}

/** What the instrument is showing (the lesson borrows the main store's selection). */
const selection = (page: Page): Promise<string> =>
  page.evaluate(`(async () => {
    const s = (await import('/src/state/store.ts')).useAppStore.getState();
    return s.selectedKey.natural + s.selectedKey.accidental + ' ' + s.selectedScale;
  })()`);

for (const lang of ['en', 'pt', 'es'] as const) {
  for (const instrument of ['piano', 'guitar'] as const) {
    test(`${lang}, ${instrument}: the tasks of "The Major Scale" say tap, and the link shows G major on the ${instrument}`, async ({ browser }) => {
      const { context, page } = await learner(browser, lang, instrument);
      const w = WORDS[lang];
      await openLesson(page, 'l1u3m1');
      await expect(tasks(page).getByRole('heading', { level: 2 })).toHaveText(w.heading[instrument]);
      const rows = taskTexts(page);
      await expect(rows).toHaveCount(3);
      for (const text of await rows.allTextContents()) expect(text).not.toMatch(w.typing);
      await expect(rows.nth(1)).toHaveText(w.tap);

      // The link is a button that opens the Try This in place, under its task.
      const link = tasks(page).getByRole('button', { name: '‘G major scale’' });
      await expect(link).toHaveAttribute('aria-expanded', 'false');
      expect(await selection(page)).not.toBe('G major');
      await link.click();
      await expect(link).toHaveAttribute('aria-expanded', 'true');
      const panel = tasks(page).getByTestId('inline-try-this');
      await expect(panel).toBeVisible();
      await expect(panel).toContainText('‘G major scale’');
      await panel.getByRole('button', { name: w.show[instrument] }).click();
      await expect.poll(() => selection(page)).toBe('G major');

      if (instrument === 'piano') {
        // The keys of G major are lit, F♯ among them, F not.
        await expect.poll(() => page.locator('[data-piano-key][data-scale-note]').evaluateAll((keys) =>
          [...new Set(keys.map((k) => Number((k as HTMLElement).dataset.midi) % 12))].sort((a, b) => a - b))).toEqual([0, 2, 4, 6, 7, 9, 11]);
      } else {
        // The fretboard draws the scale's dots.
        await expect(page.locator('[data-dot]').first()).toBeVisible({ timeout: 10_000 });
      }
      await context.close();
    });
  }
}

test('guitar selected, "The Staff and Clefs": the first task no longer sends the learner to the piano', async ({ browser }) => {
  const { context, page } = await learner(browser, 'en', 'guitar');
  await openLesson(page, 'l1u1m1');
  await expect(tasks(page).getByRole('heading', { level: 2 })).toHaveText('On your guitar');
  const rows = taskTexts(page);
  await expect(rows.nth(0)).toHaveText(/^Look at your instrument — .*on the guitar fret by fret towards the body$/);
  await expect(rows.nth(1)).toHaveText(/^Tap ‘C major scale’ and notice/);
  for (const text of await rows.allTextContents()) expect(text).not.toMatch(/piano keyboard|\bType\b/);
  await context.close();
});

test('screenshots of the tasks with the guitar selected (TASK_SHOTS)', async ({ browser }) => {
  test.skip(!SHOTS, 'set TASK_SHOTS=<dir> to write them');
  mkdirSync(SHOTS!, { recursive: true });
  for (const [name, viewport] of [['laptop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]] as const) {
    for (const lang of ['en', 'pt'] as const) {
      const { context, page } = await learner(browser, lang, 'guitar', viewport);
      await openLesson(page, 'l1u1m1');
      await page.waitForTimeout(400);
      await tasks(page).screenshot({ path: `${SHOTS}/tasks-l1u1m1-guitar-${name}-day-${lang}.png` });
      await context.close();
    }
  }
});
