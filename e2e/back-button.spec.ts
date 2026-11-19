import { test, expect, type Browser, type BrowserContext, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { levelCorpus } from '../src/data/exercises/__tests__/learnCorpus';

/**
 * The browser's Back and Forward inside Fermatina (second audit round, QA
 * report 2 point 3 and point 10's fourth bullet; the owner's ruling of 18
 * November 2026: "Back steps back one screen, and never loses a check or a
 * drill in progress"). One test per group of rows of the table of screens
 * (state/appHistory.ts and the stream's report), each with a mouse (laptop)
 * and with touch (phone) where the row exists on both. Back and Forward are
 * Playwright's `goBack` / `goForward`, which the browser runs as its own
 * buttons do.
 *
 * Every pushState the app makes is recorded with the user activation it had
 * (`navigator.userActivation.isActive`): Chromium marks every entry of a
 * document that adds one without an activation as skippable, and its Back
 * button then leaves the app — no entry may be pushed without one.
 */

const DRILL_SAVE = readFileSync(new URL('../src/state/__tests__/fixtures/drill-v2-store.json', import.meta.url), 'utf8');
/** The same real save, its facts known (review), so a Sprint can run. */
const SPRINT_READY = (() => {
  const save = JSON.parse(DRILL_SAVE) as { state: { items: Record<string, { tier: string }> } };
  for (const item of Object.values(save.state.items)) item.tier = 'review';
  return JSON.stringify(save);
})();

const MODES = [
  { name: 'mouse', viewport: { width: 1440, height: 900 }, touch: false },
  { name: 'touch', viewport: { width: 390, height: 844 }, touch: true },
] as const;
type Mode = { name: string; viewport: { width: number; height: number }; touch: boolean };

interface Seed {
  /** Fields of the settings save (`music-theory-app`). */
  settings?: Record<string, unknown>;
  progress?: unknown;
  drill?: string;
  /** Nothing saved at all: the start screen shows. */
  fresh?: boolean;
}

async function open(browser: Browser, mode: Mode, seed: Seed = {}, path = '/', workers: 'block' | 'allow' = 'block'): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ viewport: mode.viewport, isMobile: mode.touch, hasTouch: mode.touch, reducedMotion: 'reduce', serviceWorkers: workers });
  await context.addInitScript(([seedJson]) => {
    const s = JSON.parse(seedJson) as Seed;
    if (!sessionStorage.getItem('__seeded')) {
      localStorage.clear();
      if (!s.fresh) {
        localStorage.setItem('fermata-welcome-v1', 'seen');
        localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'fermata', language: 'en', instrument: 'piano', lastView: 'explore', ...s.settings }, version: 6 }));
      }
      if (s.progress) localStorage.setItem('music-theory-progress', JSON.stringify(s.progress));
      if (s.drill) localStorage.setItem('fermata-drill-v1', s.drill);
      sessionStorage.setItem('__seeded', '1');
    }
    // Every entry the app pushes, with the user activation it had.
    const pushes: { active: boolean | null; state: unknown }[] = [];
    (window as unknown as { __pushes: typeof pushes }).__pushes = pushes;
    const push = history.pushState.bind(history);
    history.pushState = (state: unknown, unused: string, url?: string | URL | null) => {
      pushes.push({ active: navigator.userActivation ? navigator.userActivation.isActive : null, state });
      push(state, unused, url);
    };
  }, [JSON.stringify(seed)] as const);
  const page = await context.newPage();
  await page.goto(path);
  await expect(page.locator('#root')).not.toBeEmpty();
  // The history module is its own chunk, fetched once the first screen is up.
  await expect.poll(() => page.evaluate(() => (history.state as { fm?: number } | null)?.fm ?? 0), { timeout: 10_000 }).toBe(1);
  return { context, page };
}

const press = (mode: Mode, target: Locator) => (mode.touch ? target.tap() : target.click());
const tab = (page: Page, view: 'explore' | 'learn' | 'drill') => page.locator(`[role="tab"][data-tab="${view}"]`);
const expectView = (page: Page, view: 'explore' | 'learn' | 'drill') => expect(tab(page, view)).toHaveAttribute('aria-selected', 'true');
const entry = (page: Page) => page.evaluate(() => history.state as { i: number; v: string; s?: string; l: number } | null);
const historyLength = (page: Page) => page.evaluate(() => history.length);
async function noPushWithoutActivation(page: Page) {
  const pushes = await page.evaluate(() => (window as unknown as { __pushes: { active: boolean | null }[] }).__pushes);
  expect(pushes.filter((p) => p.active === false), 'an entry pushed without a user activation').toEqual([]);
  return pushes.length;
}
/** The browser's Back / Forward; the app may pass over an entry that shows nothing new, so callers assert what they expect to see. */
const back = (page: Page) => page.goBack();
const forward = (page: Page) => page.goForward();
async function expectLeft(page: Page) {
  await expect.poll(() => page.url(), { message: 'Back at the first screen leaves Fermatina' }).toBe('about:blank');
}

// ── Learn: the check's answer key, from the app's own corpus ────────────────

const LESSON = { id: 'l1u2m1', title: 'Note Values and Rests', unit: 'Rhythm and Metre', questions: 7 };
function answerKey(): Map<string, string> {
  const key = new Map<string, string>();
  for (const item of levelCorpus(1, 'en')) {
    if (item.moduleId !== LESSON.id || item.exercise.config.type !== 'multiple_choice') continue;
    const labels = item.exercise.config.choices.map((c) => c.label).sort().join('§');
    key.set(`${item.exercise.prompt}|${labels}`, item.exercise.config.choices.find((c) => c.correct)!.label);
  }
  return key;
}
async function keyed(page: Page, key: Map<string, string>) {
  const prompt = (await page.getByTestId('check-prompt').textContent())!.trim();
  const labels = await page.getByTestId('check-answers').locator('button').evaluateAll((bs) => bs.map((b) => b.getAttribute('data-answer') ?? ''));
  const right = key.get(`${prompt}|${[...labels].sort().join('§')}`);
  expect(right, `answer key for "${prompt}"`).toBeTruthy();
  return { right: right!, wrong: labels.find((l) => l !== right)! };
}
const option = (page: Page, label: string) => page.getByTestId('check-answers').locator(`button[data-answer="${label.replace(/"/g, '\\"')}"]`);
async function answer(mode: Mode, page: Page, label: string) {
  await press(mode, option(page, label));
  await press(mode, page.getByRole('button', { name: 'Submit', exact: true }));
}
/** What a check in progress is: the position, the pips, the option struck after a first miss. */
async function checkState(page: Page) {
  return {
    position: (await page.getByTestId('check-position').textContent())!.trim(),
    pips: await page.getByTestId('check-pips').locator('[data-score]').evaluateAll((ps) => ps.map((p) => p.getAttribute('data-score'))),
    tried: await page.getByTestId('check-answers').locator('button[data-state="tried"]').evaluateAll((bs) => bs.map((b) => b.getAttribute('data-answer'))),
    prompt: (await page.getByTestId('check-prompt').textContent())!.trim(),
  };
}

const lessonHeading = (page: Page, title: string) => page.getByRole('heading', { level: 1, name: title });
const overview = (page: Page) => page.getByRole('heading', { name: 'Learn Music Theory' });
const levelOneCard = (page: Page) => page.getByRole('button', { name: /Foundations of Music Literacy/ }).first();
const levelOnePage = (page: Page) => page.locator('#learn-panel').getByRole('heading', { name: 'Foundations of Music Literacy' });
const unitPage = (page: Page) => page.locator('#learn-panel').getByRole('heading', { name: LESSON.unit });

for (const mode of MODES) {
  test.describe(`${mode.name}`, () => {
    test('views: Back returns to the view you came from, Forward retraces, Back at the first screen leaves', async ({ browser }) => {
      const { context, page } = await open(browser, mode);
      await expectView(page, 'explore');
      const start = await historyLength(page);
      await press(mode, tab(page, 'learn'));
      await expect(overview(page)).toBeVisible();
      await press(mode, tab(page, 'drill'));
      await expect(page.getByTestId('drill-intro')).toBeVisible();
      expect(await historyLength(page)).toBe(start + 2);

      await back(page);
      await expectView(page, 'learn');
      await expect(overview(page)).toBeVisible();
      await back(page);
      await expectView(page, 'explore');
      await forward(page);
      await expectView(page, 'learn');
      await forward(page);
      await expectView(page, 'drill');
      await expect(page.getByTestId('drill-intro')).toBeVisible();
      expect(await noPushWithoutActivation(page)).toBe(2);

      await back(page);
      await back(page);
      await expectView(page, 'explore');
      await back(page);
      await expectLeft(page);
      // Forward comes back into the app, on its first screen.
      await forward(page);
      await expectView(page, 'explore');
      await context.close();
    });

    test('Learn: overview → level → unit → lesson → check; Back from a check with answers keeps it, exactly; the result; Back to Explore', async ({ browser }) => {
      test.setTimeout(120_000);
      const key = answerKey();
      expect(key.size).toBe(LESSON.questions);
      const { context, page } = await open(browser, mode);
      await press(mode, tab(page, 'learn'));
      await expect(overview(page)).toBeVisible();
      await press(mode, levelOneCard(page));
      await expect(levelOnePage(page)).toBeVisible();
      await press(mode, page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.unit) }).first());
      await expect(unitPage(page)).toBeVisible();
      await press(mode, page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.title) }).first());
      await expect(lessonHeading(page, LESSON.title)).toBeVisible();
      await press(mode, page.getByTestId('check-card').getByRole('button', { name: 'Start the check' }));
      await expect(page.getByTestId('focused-check')).toBeVisible();

      // Q1 right, Q2 wrong then right (½), Q3: a first miss, its second try pending.
      const q1 = await keyed(page, key);
      await answer(mode, page, q1.right);
      await press(mode, page.getByRole('button', { name: 'Continue', exact: true }));
      const q2 = await keyed(page, key);
      await answer(mode, page, q2.wrong);
      await answer(mode, page, q2.right);
      await press(mode, page.getByRole('button', { name: 'Continue', exact: true }));
      await expect(page.getByTestId('check-position')).toHaveText(`3 / ${LESSON.questions}`);
      const q3 = await keyed(page, key);
      await answer(mode, page, q3.wrong);
      await expect(option(page, q3.wrong)).toHaveAttribute('data-state', 'tried');
      const inProgress = await checkState(page);

      // Back: the lesson, at its check card, which says the check is kept.
      await back(page);
      await expect(page.getByTestId('focused-check')).toHaveCount(0);
      await expect(lessonHeading(page, LESSON.title)).toBeVisible();
      await expect(page.getByTestId('check-kept')).toHaveText(`Your check is kept: question 3 of ${LESSON.questions}.`);
      await expect(page.getByTestId('check-kept')).toBeInViewport();
      // Forward: the same question, the same pips, the same tried option.
      await forward(page);
      await expect(page.getByTestId('focused-check')).toBeVisible();
      expect(await checkState(page)).toEqual(inProgress);
      // Back, then the card's own way in: the same again.
      await back(page);
      await press(mode, page.getByTestId('check-continue'));
      await expect(page.getByTestId('focused-check')).toBeVisible();
      expect(await checkState(page)).toEqual(inProgress);

      // Back: the lesson, the unit, the level, the overview, Explore. The check is still kept.
      await back(page);
      await expect(lessonHeading(page, LESSON.title)).toBeVisible();
      await back(page);
      await expect(unitPage(page)).toBeVisible();
      await back(page);
      await expect(levelOnePage(page)).toBeVisible();
      await back(page);
      await expect(overview(page)).toBeVisible();
      await back(page);
      await expectView(page, 'explore');
      // Forward all the way: the check, exactly where it was.
      for (let i = 0; i < 5; i++) {
        await forward(page);
        await page.waitForTimeout(150);
      }
      await expect(page.getByTestId('focused-check')).toBeVisible();
      expect(await checkState(page)).toEqual(inProgress);

      // Finish it: the result replaces the check (Back from it is the lesson; Forward is the result again).
      await answer(mode, page, q3.right);
      await press(mode, page.getByRole('button', { name: 'Continue', exact: true }));
      for (let i = 4; i <= LESSON.questions; i++) {
        await expect(page.getByTestId('check-position')).toHaveText(`${i} / ${LESSON.questions}`);
        const { right } = await keyed(page, key);
        await answer(mode, page, right);
        await press(mode, page.getByRole('button', { name: 'Continue', exact: true }));
      }
      const score = (await page.getByTestId('result-score').textContent())!;
      await back(page);
      await expect(lessonHeading(page, LESSON.title)).toBeVisible();
      await expect(page.getByTestId('check-kept')).toHaveCount(0);
      await forward(page);
      await expect(page.getByTestId('result-score')).toHaveText(score);
      await noPushWithoutActivation(page);
      await context.close();
    });

    test('Drill: the intro and its settings; a session with answers is kept on Back; settings → mastery map; the active Drill tab; a Sprint', async ({ browser }) => {
      test.setTimeout(90_000);
      const { context, page } = await open(browser, mode);
      const panel = page.locator('#drill-panel');
      await press(mode, tab(page, 'drill'));
      const intro = panel.getByTestId('drill-intro');
      await expect(intro).toBeVisible();
      await press(mode, intro.getByRole('button', { name: /Choose topics/ }));
      await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
      await back(page);
      await expect(intro).toBeVisible();
      await press(mode, intro.getByRole('button', { name: 'Start' }));
      const counter = panel.getByText(/^\d+ of \d+$/);
      await expect(counter).toHaveText('1 of 8');
      // An answer that holds (a miss: its verdict waits for Continue).
      const prompt = panel.locator('p.text-xl').first();
      for (let i = 0; i < 12 && !(await panel.getByRole('button', { name: 'Continue', exact: true }).count()); i++) {
        const choices = panel.getByTestId('drill-answers').locator('button:not([disabled])');
        await press(mode, choices.nth(Math.min(1, (await choices.count()) - 1)));
        const done = panel.locator('button:not([disabled])').filter({ hasText: /^Done$/ });
        if (await done.count()) await press(mode, done.first());
        await page.waitForTimeout(900);
      }
      await expect(panel.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
      const where = { counter: await counter.textContent(), prompt: await prompt.textContent() };

      // Back leaves Drill for Explore; the session is kept, and a toast says so with a way back.
      await back(page);
      await expectView(page, 'explore');
      const kept = page.getByTestId('toast-region').getByText('Your Drill session is kept, on the question you were on.');
      await expect(kept).toBeVisible();
      await press(mode, page.getByTestId('toast-region').getByRole('button', { name: 'Continue' }));
      await expectView(page, 'drill');
      await expect(counter).toHaveText(where.counter!);
      await expect(prompt).toHaveText(where.prompt!);
      await expect(panel.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();

      // Its settings → the mastery map: Back steps back through them to the question.
      await press(mode, panel.getByRole('button', { name: 'Drill settings' }));
      await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
      await press(mode, panel.getByRole('button', { name: /Mastery map/ }));
      await expect(panel.getByRole('heading', { name: 'Mastery' })).toBeVisible();
      await back(page);
      await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
      await back(page);
      await expect(prompt).toHaveText(where.prompt!);
      await forward(page);
      await forward(page);
      await expect(panel.getByRole('heading', { name: 'Mastery' })).toBeVisible();
      // P10: the active Drill tab leaves the mastery map for Drill's question; Back returns to the map.
      await press(mode, tab(page, 'drill'));
      await expect(panel.getByRole('heading', { name: 'Mastery' })).toHaveCount(0);
      await expect(prompt).toHaveText(where.prompt!);
      await back(page);
      await expect(panel.getByRole('heading', { name: 'Mastery' })).toBeVisible();
      await noPushWithoutActivation(page);
      await context.close();
    });

    test('Drill: a Sprint with time left is paused by Back and resumed by Forward (score, question, time)', async ({ browser }) => {
      test.setTimeout(60_000);
      const { context, page } = await open(browser, mode, { drill: SPRINT_READY });
      const panel = page.locator('#drill-panel');
      await press(mode, tab(page, 'drill'));
      await expect(panel.getByText('4 of 9')).toBeVisible();
      await press(mode, panel.getByRole('button', { name: 'End session' }));
      await press(mode, panel.getByRole('button', { name: 'Sprint', exact: true }));
      const clock = panel.getByText(/^\d+s$/);
      await expect(clock).toBeVisible();
      // One answer, then Back.
      const prompt = panel.locator('p.text-xl').first();
      const first = await prompt.textContent();
      const answers = prompt.locator('xpath=following-sibling::div[1]');
      for (let i = 0; i < 10 && (await prompt.textContent()) === first; i++) {
        const done = answers.locator('button:not([disabled])').filter({ hasText: /^Done$/ });
        await press(mode, (await done.count()) ? done.first() : answers.locator('button:not([disabled])').first());
        await page.waitForTimeout(150);
      }
      await expect(prompt).not.toHaveText(first!);
      const score = await panel.getByText(/^\d+ correct$/).textContent();
      const question = await prompt.textContent();
      const seconds = Number((await clock.textContent())!.replace('s', ''));
      await back(page);
      await expect(panel.getByText('Session complete')).toBeVisible();
      await expect(page.getByTestId('toast-region').getByText('Your Sprint is paused, with the time it had left.')).toBeVisible();
      await page.waitForTimeout(2500); // paused: no time passes
      await forward(page);
      await expect(prompt).toHaveText(question!);
      await expect(panel.getByText(/^\d+ correct$/)).toHaveText(score!);
      const after = Number((await clock.textContent())!.replace('s', ''));
      expect(after).toBeLessThanOrEqual(seconds);
      expect(after).toBeGreaterThanOrEqual(seconds - 1);
      await noPushWithoutActivation(page);
      await context.close();
    });

    test('sheets and dialogs: Back closes the top one, as Escape does, and moves nowhere else', async ({ browser }) => {
      test.setTimeout(90_000);
      const { context, page } = await open(browser, mode, { settings: { instrument: 'guitar' } });
      await press(mode, tab(page, 'learn'));
      await expect(overview(page)).toBeVisible();
      await press(mode, tab(page, 'explore'));
      await expectView(page, 'explore');
      const closesOnBack = async (opener: () => Promise<void>, dialog: Locator) => {
        const before = await entry(page);
        await opener();
        await expect(dialog).toBeVisible();
        await back(page);
        await expect(dialog).toHaveCount(0);
        await expectView(page, 'explore');
        const after = (await entry(page))!;
        expect({ v: after.v, s: after.s ?? '' }, 'the screen behind it stays').toEqual({ v: before!.v, s: before!.s ?? '' });
        // Forward reopens nothing.
        await forward(page);
        await expect(dialog).toHaveCount(0);
        await expectView(page, 'explore');
      };
      // Settings ("⋯" → Settings).
      await closesOnBack(async () => {
        await press(mode, page.getByTestId('app-menu').getByRole('button').first());
        await press(mode, page.getByRole('menuitem', { name: 'Settings' }));
      }, page.getByTestId('settings-sheet'));
      // Quick Search.
      await closesOnBack(() => page.keyboard.press('Control+k'), page.getByRole('dialog').filter({ has: page.locator('input') }));
      // The tuner.
      await closesOnBack(async () => {
        await press(mode, page.getByTestId('app-menu').getByRole('button').first());
        await press(mode, page.getByRole('menuitem', { name: 'Tuner' }));
      }, page.getByTestId('tuner-sheet'));
      // The guitar practice sheet, with a word explained inside it: the word first, then the sheet.
      await press(mode, page.getByTestId('practice-open'));
      const practice = page.getByTestId('practice-sheet');
      await expect(practice).toBeVisible();
      const word = practice.locator('.term[data-term]').first();
      if (await word.count()) {
        await press(mode, word);
        const explanation = mode.touch ? page.getByTestId('glossary-sheet') : page.getByTestId('glossary-popover');
        await expect(explanation).toBeVisible();
        await back(page);
        await expect(explanation).toHaveCount(0);
        await expect(practice).toBeVisible();
      }
      await back(page);
      await expect(practice).toHaveCount(0);
      await expectView(page, 'explore');
      // A word on the workbench: the popover (mouse) or its sheet (touch).
      await closesOnBack(() => press(mode, page.getByTestId('key-summary').locator('.term[data-term="relativeKey"]')),
        mode.touch ? page.getByTestId('glossary-sheet') : page.getByTestId('glossary-popover'));
      // The key sheet (a phone's key picker).
      if (mode.touch) await closesOnBack(() => press(mode, page.getByTestId('key-picker')), page.getByTestId('key-sheet'));
      // Then Back goes on as usual: to Learn, where the tab was before.
      await back(page);
      await expectView(page, 'learn');
      // The unlock dialog (a locked level).
      await press(mode, page.getByRole('button', { name: /Expanding Fundamentals/ }).first());
      await press(mode, page.getByRole('button', { name: 'Unlock anyway' }));
      const unlock = page.getByTestId('unlock-dialog');
      await expect(unlock).toBeVisible();
      await back(page);
      await expect(unlock).toHaveCount(0);
      await expect(page.getByTestId('locked-level')).toBeVisible();
      await noPushWithoutActivation(page);
      await context.close();
    });

    test('the start screen: Back leaves it; the tour from it ends on Back and the start screen returns; a door replaces it', async ({ browser }) => {
      const { context, page } = await open(browser, mode, { fresh: true });
      const startScreen = page.getByTestId('start-screen');
      await expect(startScreen).toBeVisible();
      await press(mode, page.getByTestId('start-tour'));
      await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
      await back(page);
      await expect(page.getByTestId('tour-bar')).toHaveCount(0);
      await expect(startScreen).toBeVisible({ timeout: 10_000 });
      // A door: its screen takes the start screen's place (which never shows again), so Back leaves.
      await press(mode, startScreen.getByRole('button', { name: /I know some theory/ }));
      await expectView(page, 'explore');
      await noPushWithoutActivation(page);
      await back(page);
      await expectLeft(page);
      await context.close();
    });
  });
}

test('Learn deep links: Quick Search, "Learn about this" and Drill\'s family link — Back returns where they were opened', async ({ browser }) => {
  test.setTimeout(90_000);
  const mode = MODES[0];
  const { context, page } = await open(browser, mode, { drill: DRILL_SAVE });
  // Explore → "Learn about this" on a chord → the lesson → Back: Explore.
  await page.getByTestId('chords-card').getByRole('button').filter({ hasText: /^V/ }).first().click();
  await page.getByTestId('chord-detail').getByRole('button', { name: /Learn about this/ }).click();
  await expectView(page, 'learn');
  await expect(page.locator('#learn-panel h1')).toBeVisible();
  await back(page);
  await expectView(page, 'explore');
  // Quick Search's lesson result, from Explore → Back: Explore.
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog').filter({ has: page.locator('input') });
  await search.locator('input').fill('Relative and Parallel Keys');
  await search.getByRole('option', { name: /^Relative and Parallel Keys/ }).first().click();
  await expect(lessonHeading(page, 'Relative and Parallel Keys')).toBeVisible();
  await back(page);
  await expectView(page, 'explore');
  await expect(search).toHaveCount(0);
  // Drill's family link under a missed answer → the lesson → Back: the same question, its verdict.
  await tab(page, 'drill').click();
  const panel = page.locator('#drill-panel');
  await expect(panel.getByText('4 of 9')).toBeVisible();
  const prompt = await panel.locator('p.text-xl').first().textContent();
  for (let i = 0; i < 12 && !(await panel.getByRole('button', { name: /Learn about this/ }).count()); i++) {
    const choices = panel.getByTestId('drill-answers').locator('button:not([disabled])');
    if (!(await choices.count())) break;
    await choices.last().click();
    await page.waitForTimeout(900);
  }
  const learnMore = panel.getByRole('button', { name: /Learn about this/ });
  await expect(learnMore).toBeVisible();
  const missed = await panel.locator('p.text-xl').first().textContent();
  expect(missed).toBeTruthy();
  await learnMore.click();
  await expectView(page, 'learn');
  await back(page);
  await expectView(page, 'drill');
  await expect(panel.locator('p.text-xl').first()).toHaveText(missed!);
  await expect(panel.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
  expect(prompt).toBeTruthy();
  await noPushWithoutActivation(page);
  await context.close();
});

test('a review: Back from one with an answer keeps it; Re-read from its result opens the lesson and Back returns to the result', async ({ browser }) => {
  test.setTimeout(90_000);
  const now = Date.now();
  const day = 86_400_000;
  const progress = {
    state: {
      progress: {
        completedModules: [LESSON.id], moduleProgress: {}, exerciseResults: {},
        reviewSchedules: { [LESSON.id]: { completedAt: now - 3 * day, nextReviewAt: now - day, intervalLevel: 0, reviewCount: 0, lastReviewedAt: now - 3 * day } },
      },
    },
    version: 2,
  };
  const key = answerKey();
  const { context, page } = await open(browser, MODES[0], { progress, settings: { lastView: 'learn' } });
  await expect(overview(page)).toBeVisible();
  const review = page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.title) }).first();
  await review.click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  const q1 = await keyed(page, key);
  await answer(MODES[0], page, q1.wrong);
  const state = await checkState(page);
  await back(page);
  await expect(overview(page)).toBeVisible();
  await expect(page.getByTestId('toast-region').getByText(/^Your review is kept: question 1 of \d+\.$/)).toBeVisible();
  await forward(page);
  expect(await checkState(page)).toEqual(state);
  // Finish it, then Re-read from its result.
  await answer(MODES[0], page, q1.right);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  while (!(await page.getByTestId('check-result').count())) {
    const { right } = await keyed(page, key);
    await answer(MODES[0], page, right);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
  }
  const score = (await page.getByTestId('result-score').textContent())!;
  await page.getByTestId('check-result').getByRole('button', { name: /Re-read/ }).first().click();
  await expect(lessonHeading(page, LESSON.title)).toBeVisible();
  await back(page);
  await expect(page.getByTestId('result-score')).toHaveText(score);
  await noPushWithoutActivation(page);
  await context.close();
});

test('a reload anywhere keeps the place, and Back and Forward still work after it', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, MODES[0], { drill: DRILL_SAVE });
  await tab(page, 'learn').click();
  await levelOneCard(page).click();
  await expect(levelOnePage(page)).toBeVisible();
  await page.reload();
  await expect(levelOnePage(page)).toBeVisible(); // a level page is no saved screen: the entry kept it
  await back(page);
  await expect(overview(page)).toBeVisible();
  await back(page);
  await expectView(page, 'explore');
  await forward(page);
  await forward(page);
  await expect(levelOnePage(page)).toBeVisible();
  // Drill's mastery map, reloaded.
  await tab(page, 'drill').click();
  const panel = page.locator('#drill-panel');
  await panel.getByRole('button', { name: 'Drill settings' }).click();
  await panel.getByRole('button', { name: /Mastery map/ }).click();
  await expect(panel.getByRole('heading', { name: 'Mastery' })).toBeVisible();
  await page.reload();
  await expect(panel.getByRole('heading', { name: 'Mastery' })).toBeVisible();
  await back(page);
  await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
  await back(page);
  await expect(panel.getByText('4 of 9')).toBeVisible();
  await back(page);
  await expect(levelOnePage(page)).toBeVisible();
  await context.close();
});

test('no entry for what is not a screen: a chord, a key, a scale, Play, a section read, a task ticked, a Drill answer', async ({ browser }) => {
  const { context, page } = await open(browser, MODES[0], { drill: DRILL_SAVE });
  const length = await historyLength(page);
  const chords = page.getByTestId('chords-card').getByRole('button').filter({ hasText: /^(I|ii|iii|IV|V|vi)/ });
  await chords.nth(1).click();
  await chords.nth(3).click();
  await page.getByTestId('scale-strip').locator('button[data-midi]').nth(2).click();
  await page.getByRole('button', { name: /Play scale/ }).first().click();
  await page.getByTestId('scale-picker').selectOption('dorian');
  expect(await historyLength(page)).toBe(length);
  await tab(page, 'drill').click();
  const panel = page.locator('#drill-panel');
  await expect(panel.getByText('4 of 9')).toBeVisible();
  const after = await historyLength(page);
  await panel.getByTestId('drill-answers').locator('button:not([disabled])').first().click();
  await page.waitForTimeout(1200);
  expect(await historyLength(page)).toBe(after);
  // A lesson is one screen: its sections, a Try This, a task ticked are not.
  await tab(page, 'learn').click();
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog').filter({ has: page.locator('input') });
  await search.locator('input').fill('The Major Scale');
  await search.getByRole('option', { name: /^The Major Scale/ }).first().click();
  await expect(lessonHeading(page, 'The Major Scale')).toBeVisible();
  const lesson = await historyLength(page);
  const rail = page.getByTestId('section-rail');
  await rail.locator('[data-section-link="c1"]').click();
  await rail.locator('[data-section-link="tasks"]').click();
  await page.locator('[data-section="tasks"] button[aria-pressed]').first().click();
  await page.locator('[data-section="c1"] [data-testid="inline-try-this"]').getByRole('button', { name: 'Hear it' }).click();
  await page.waitForTimeout(500);
  expect(await historyLength(page)).toBe(lesson);
  await noPushWithoutActivation(page);
  await context.close();
});

test('a first visit by a link: Back leaves (a lesson page\'s "Open this lesson", a shared chord)', async ({ browser }) => {
  for (const path of ['/?lesson=l1u1m1&lang=en', '/?key=G&scale=major&chord=D7']) {
    const { context, page } = await open(browser, MODES[1], { fresh: true }, path);
    await expect(page.getByTestId('start-screen')).toHaveCount(0);
    await back(page);
    await expectLeft(page);
    await context.close();
  }
});

test('the tour leaves no history behind it: one entry of its own, and Back ends it', async ({ browser }) => {
  test.setTimeout(60_000);
  const { context, page } = await open(browser, MODES[0]);
  const length = await historyLength(page);
  await page.getByTestId('app-menu').getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Show me around' }).click();
  await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(6000); // a few steps: the tour moves the screen itself
  expect(await historyLength(page)).toBe(length + 1);
  await back(page);
  await expect(page.getByTestId('tour-bar')).toHaveCount(0);
  await expectView(page, 'explore');
  await back(page);
  await expectLeft(page);
  await context.close();
});

test('the landscape full neck: Back closes it', async ({ browser }) => {
  const mode = { name: 'landscape', viewport: { width: 844, height: 390 }, touch: true };
  const { context, page } = await open(browser, mode, { settings: { instrument: 'guitar' } });
  await press(mode, tab(page, 'learn'));
  await press(mode, tab(page, 'explore'));
  await press(mode, page.getByTestId('neck-open'));
  await expect(page.getByTestId('neck-view')).toBeVisible();
  await back(page);
  await expect(page.getByTestId('neck-view')).toHaveCount(0);
  await expectView(page, 'explore');
  await back(page);
  await expectView(page, 'learn');
  await context.close();
});
