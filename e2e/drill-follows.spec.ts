import { test, expect, type Browser, type Page } from '@playwright/test';
import { WELCOME_KEY, WELCOME_SEEN } from './helpers/welcome';

/**
 * Drill follows the lessons (wave 2). Phone and laptop, EN and PT:
 *  - a new learner with nothing completed sees the "follows your lessons"
 *    intro and cannot start a session;
 *  - after l1u34m5 is completed (Learn's saved shape seeded) a session asks
 *    only triads in the listed chords;
 *  - a Level 2 lesson (l2u7m3) opens its family and those before it, nothing later;
 *  - "Choose topics myself" gives today's Drill back: the next session is
 *    composed from the topic choices again.
 */

const VIEWS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;

const WORDS = {
  en: { start: 'Start', myself: 'Choose topics myself', open: 'Open the lesson', settings: 'Drill settings', back: 'Back', end: 'End session', next: 'New session', topics: 'Topics', follows: /^Drill follows your lessons/ },
  pt: { start: 'Iniciar', myself: 'Escolher eu os tópicos', open: 'Abrir a lição', settings: 'Definições de treino', back: 'Voltar', end: 'Terminar sessão', next: 'Nova sessão', topics: 'Tópicos', follows: /^O Treino segue as tuas lições/ },
} as const;
type Lang = keyof typeof WORDS;

const TRACK_CHORDS = ['C:major', 'G:major', 'F:major', 'A:minor', 'E:minor', 'D:minor'];

async function open(browser: Browser, v: (typeof VIEWS)[number], lang: Lang, completed: string[]) {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(([settings, progress, welcomeKey, welcomeSeen]) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem(welcomeKey, welcomeSeen);
    localStorage.setItem('music-theory-app', settings);
    if (progress) localStorage.setItem('music-theory-progress', progress);
    sessionStorage.setItem('__seeded', '1');
  }, [
    JSON.stringify({ state: { lastView: 'drill', language: lang, learnerProfile: 'new' }, version: 6 }),
    completed.length
      ? JSON.stringify({ state: { progress: { completedModules: completed, moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} } }, version: 4 })
      : '',
    WELCOME_KEY,
    WELCOME_SEEN,
  ] as const);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#drill-panel').getByTestId('drill-intro')).toBeVisible({ timeout: 15_000 });
  return { context, page };
}

/** The saved session queue (the drill store's own save). */
async function savedQueue(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('fermata-drill-v1');
    return raw ? (JSON.parse(raw).state.activeSession?.queue ?? []) : [];
  });
}

/** 'triad:name-to-notes:C:major' → 'C:major' (a test-side reading of the id). */
const chordOf = (id: string) => id.split(':').slice(2).join(':');

for (const v of VIEWS) {
  for (const lang of ['en', 'pt'] as const) {
    const w = WORDS[lang];
    const combo = `${v.name}-${lang}`;

    test(`${combo}: nothing completed — the intro says Drill follows the lessons, and no session can start`, async ({ browser }) => {
      const { context, page } = await open(browser, v, lang, []);
      const intro = page.locator('#drill-panel').getByTestId('drill-intro');
      await expect(intro.getByTestId('drill-follow-lead')).toHaveText(w.follows);
      await expect(intro.getByTestId('drill-follow-empty')).toBeVisible();
      await expect(intro.getByRole('button', { name: w.start, exact: true })).toHaveCount(0);
      await expect(intro.getByRole('button', { name: w.open })).toBeVisible();
      await page.reload();
      await expect(intro).toBeVisible({ timeout: 15_000 });
      expect(await savedQueue(page)).toEqual([]);
      // Choose topics myself: today's intro, with Start.
      await intro.getByRole('button', { name: w.myself }).click();
      await expect(intro.getByRole('button', { name: w.start, exact: true })).toBeVisible();
      await expect(intro.getByTestId('drill-follow-switch')).toHaveAttribute('aria-pressed', 'false');
      await context.close();
    });

    test(`${combo}: after l1u34m5, a session asks only its triads; turning the switch off gives today's Drill`, async ({ browser }) => {
      const { context, page } = await open(browser, v, lang, ['l1u34m5']);
      const panel = page.locator('#drill-panel');
      await expect(panel.getByTestId('drill-follow-summary')).toBeVisible();
      await panel.getByRole('button', { name: w.start, exact: true }).click();
      await expect(panel.getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
      const queue = await savedQueue(page);
      expect(queue.length).toBe(4);
      for (const id of queue) {
        expect(id.startsWith('triad:'), id).toBe(true);
        expect(TRACK_CHORDS, id).toContain(chordOf(id));
      }

      // Off, from the settings: the topic chips are back.
      await panel.getByRole('button', { name: w.settings }).click();
      await expect(panel.getByTestId('drill-follow-switch')).toHaveAttribute('aria-pressed', 'true');
      await expect(panel.getByRole('group', { name: w.topics })).toHaveCount(0);
      await panel.getByRole('button', { name: w.myself }).click();
      await expect(panel.getByRole('group', { name: w.topics })).toBeVisible();
      await panel.getByRole('button', { name: w.back, exact: true }).click();
      // The running session keeps its questions; the next one is composed from the topics.
      expect(await savedQueue(page)).toEqual(queue);
      await panel.getByRole('button', { name: w.end }).click();
      await panel.getByRole('button', { name: w.next }).click();
      await expect(panel.getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
      const next = await savedQueue(page);
      expect(next.some((id) => !id.startsWith('triad:')), next.join(' ')).toBe(true);
      await context.close();
    });

    test(`${combo}: a Level 2 lesson opens its family and the ones before it, nothing later`, async ({ browser }) => {
      const { context, page } = await open(browser, v, lang, ['l2u7m3']);
      const panel = page.locator('#drill-panel');
      await panel.getByRole('button', { name: w.start, exact: true }).click();
      await expect(panel.getByTestId('drill-answers')).toBeVisible({ timeout: 15_000 });
      const queue = await savedQueue(page);
      expect(queue.length).toBeGreaterThan(0);
      for (const id of queue) {
        expect(['triad', 'read', 'interval', 'keysig', 'circle', 'degree', 'scale'], id).toContain(id.split(':')[0]);
      }
      await context.close();
    });
  }
}
