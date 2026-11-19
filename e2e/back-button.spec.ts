import { test, expect, type Browser, type BrowserContext, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { levelCorpus } from '../src/data/exercises/__tests__/learnCorpus';
import { MODULE_INDEX } from '../src/data/moduleIndex';
import { OPTIONAL_UNIT_IDS } from '../src/core/constants/optionalCurriculum';

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
    // Once per context (a second tab of it, or a reload, must keep what the first saved).
    if (!localStorage.getItem('__seeded')) {
      localStorage.clear();
      if (!s.fresh) {
        localStorage.setItem('fermata-welcome-v1', 'seen');
        localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'fermata', language: 'en', instrument: 'piano', lastView: 'explore', ...s.settings }, version: 6 }));
      }
      if (s.progress) localStorage.setItem('music-theory-progress', JSON.stringify(s.progress));
      if (s.drill) localStorage.setItem('fermata-drill-v1', s.drill);
      localStorage.setItem('__seeded', '1');
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
/** The mouse's own back button (sent to the browser as a real input event, not an entry picked by Playwright). */
async function mouseBack(page: Page) {
  if (page.context().browser()?.browserType().name() !== 'chromium') return void (await page.goBack());
  const cdp = await page.context().newCDPSession(page);
  for (const type of ['mousePressed', 'mouseReleased'] as const) {
    await cdp.send('Input.dispatchMouseEvent', { type, x: 20, y: 300, button: 'back', buttons: type === 'mousePressed' ? 8 : 0, clickCount: 1 });
  }
  await cdp.detach();
}
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
  const buttons = await page.getByTestId('check-answers').locator('button').evaluateAll((bs) => bs.map((b) => ({ label: b.getAttribute('data-answer') ?? '', tried: b.getAttribute('data-state') === 'tried' })));
  const labels = buttons.map((b) => b.label);
  const right = key.get(`${prompt}|${[...labels].sort().join('§')}`);
  expect(right, `answer key for "${prompt}"`).toBeTruthy();
  return { right: right!, wrong: buttons.find((b) => b.label !== right && !b.tried)!.label };
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

      // With a mouse, its own back button; with touch, the browser's Back.
      await (mode.touch ? back(page) : mouseBack(page));
      await expectView(page, 'learn');
      await expect(overview(page)).toBeVisible();
      await (mode.touch ? back(page) : mouseBack(page));
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
      // Whatever the shuffled first question asks (a choice, or notes to spell then Done): chips not yet chosen, then Done.
      for (let i = 0; i < 12 && (await prompt.textContent()) === first; i++) {
        const done = answers.locator('button:not([disabled])').filter({ hasText: /^Done$/ });
        const fresh = answers.locator('button:not([disabled]):not([aria-pressed="true"])').filter({ hasNotText: /^Done$/ });
        await press(mode, (await done.count()) ? done.first() : fresh.first());
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
      // The "⋯" menu itself (a menu is not a dialog, but nothing is left open over another screen).
      await closesOnBack(() => press(mode, page.getByTestId('app-menu').getByRole('button').first()), page.getByRole('menu'));
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
      // Its "Words on this screen": a second sheet over it. Back closes that one first.
      await press(mode, practice.getByRole('button', { name: /Words on this screen/ }).first());
      const words = page.getByTestId('glossary-sheet');
      await expect(words).toBeVisible();
      await back(page);
      await expect(words).toHaveCount(0);
      await expect(practice).toBeVisible();
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

test('a lesson reopened while its check is kept: the lesson, its card offering the check; a tab back into Learn reopens the check itself', async ({ browser }) => {
  test.setTimeout(90_000);
  const mode = MODES[0];
  const key = answerKey();
  const { context, page } = await open(browser, mode);
  await tab(page, 'learn').click();
  await levelOneCard(page).click();
  await page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.unit) }).first().click();
  const row = page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.title) }).first();
  await row.click();
  await page.getByTestId('check-card').getByRole('button', { name: 'Start the check' }).click();
  const q1 = await keyed(page, key);
  await answer(mode, page, q1.right);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  const state = await checkState(page);
  await back(page);
  await back(page);
  await expect(unitPage(page)).toBeVisible();
  await row.click();
  await expect(lessonHeading(page, LESSON.title)).toBeVisible();
  await expect(page.getByTestId('focused-check')).toHaveCount(0);
  await expect(page.getByTestId('check-kept')).toHaveText(`Your check is kept: question 2 of ${LESSON.questions}.`);
  // Quick Search's lesson result, the same.
  await tab(page, 'explore').click();
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog').filter({ has: page.locator('input') });
  await search.locator('input').fill(LESSON.title);
  await search.getByRole('option', { name: new RegExp(`^${LESSON.title}`) }).first().click();
  await expect(page.getByTestId('check-kept')).toBeVisible();
  // Into the check, then away by a tab and back by the tab: the check itself, as before this change.
  await page.getByTestId('check-continue').click();
  expect(await checkState(page)).toEqual(state);
  await tab(page, 'drill').click();
  await tab(page, 'learn').click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  expect(await checkState(page)).toEqual(state);
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
  // Step by step (under reduced motion the tour waits for Next) until it has shown Learn and Drill:
  // the tour moves the screen itself, and a tap on Next is a user activation.
  const seen = new Set<string>();
  for (let i = 0; i < 14 && !(seen.has('learn') && seen.has('drill')); i++) {
    const next = page.getByTestId('tour-next');
    await expect(next).toBeEnabled({ timeout: 15_000 });
    await next.click();
    await page.waitForTimeout(700);
    for (const v of ['learn', 'drill'] as const) if ((await tab(page, v).getAttribute('aria-selected')) === 'true') seen.add(v);
  }
  expect([...seen].sort(), 'the tour showed Learn and Drill').toEqual(['drill', 'learn']);
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

test('the build, with the service worker in control and then offline: Back, Forward and a reload land where the table says', async ({ browser }) => {
  test.setTimeout(120_000);
  const mode = MODES[1];
  const { context, page } = await open(browser, mode, {}, '/', 'allow');
  const manifest = await page.request.get('/manifest.webmanifest');
  test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'No service worker on the dev server: the build only');
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, { timeout: 20_000 });
  await page.waitForTimeout(3000); // the precache settles
  const key = answerKey();

  const walk = async () => {
    await press(mode, tab(page, 'learn'));
    await press(mode, levelOneCard(page));
    await press(mode, page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.unit) }).first());
    await press(mode, page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.title) }).first());
    await expect(lessonHeading(page, LESSON.title)).toBeVisible();
    const card = page.getByTestId('check-card');
    await press(mode, (await card.getByTestId('check-continue').count()) ? card.getByTestId('check-continue') : card.getByRole('button', { name: 'Start the check' }));
    await expect(page.getByTestId('focused-check')).toBeVisible();
    const q = await keyed(page, key);
    await answer(mode, page, q.wrong);
    const state = await checkState(page);
    await back(page);
    await expect(page.getByTestId('check-kept')).toBeVisible();
    await forward(page);
    expect(await checkState(page)).toEqual(state);
    await page.reload();
    await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
    expect(await checkState(page)).toEqual(state);
    await back(page);
    await expect(lessonHeading(page, LESSON.title)).toBeVisible();
    await back(page);
    await expect(unitPage(page)).toBeVisible();
    for (let i = 0; i < 3; i++) await back(page);
    await expectView(page, 'explore');
    return state;
  };
  await walk();

  // Offline: every request the page or the worker makes fails; the worker alone answers.
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await context.route('**/*', (route) => route.abort('internetdisconnected'));
  await page.reload();
  await expectView(page, 'explore');
  await walk();
  await back(page);
  await expectLeft(page);
  await forward(page);
  await expectView(page, 'explore');
  await noPushWithoutActivation(page);
  await context.close();
});

// ── The cold review's faults (second audit round, review B-1), each in a real browser ─────────────

/** The dev server's own modules (the build has none): for what only the app's state can show. */
async function devModule<T>(page: Page, path: string, fn: string): Promise<T | undefined> {
  const probe = await page.request.get(path);
  if (!(probe.headers()['content-type'] ?? '').includes('javascript')) return undefined;
  return page.evaluate(async ([p, f]) => {
    const m = (await import(/* @vite-ignore */ p)) as Record<string, () => unknown>;
    return m[f]() as T;
  }, [path, fn] as const);
}

/** A check of LESSON started from its card, with question 1 missed once (an answer given; its second try pending). */
async function startAnswered(mode: Mode, page: Page, key: Map<string, string>) {
  await press(mode, tab(page, 'learn'));
  await press(mode, levelOneCard(page));
  await press(mode, page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.unit) }).first());
  await press(mode, page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.title) }).first());
  await press(mode, page.getByTestId('check-start'));
  await expect(page.getByTestId('focused-check')).toBeVisible();
  const q1 = await keyed(page, key);
  await answer(mode, page, q1.wrong);
  return { q1, state: await checkState(page) };
}

test.describe('review B-1', () => {
  test('A1: the skip link moves focus and adds no entry; an entry the app did not write never traps Back', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0]);
    await tab(page, 'learn').click();
    await expect(overview(page)).toBeVisible();
    const length = await historyLength(page);
    await page.locator('a[href="#main-content"]').focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main-content');
    expect(await historyLength(page)).toBe(length);
    expect(page.url()).not.toContain('#');
    // Any other fragment link (none in the app today): its entry is ours at once, and Back passes it.
    await page.evaluate(() => {
      const a = Object.assign(document.createElement('a'), { href: '#somewhere', textContent: 'x' });
      document.getElementById('main-content')!.appendChild(a);
    });
    await page.locator('a[href="#somewhere"]').click();
    await expect.poll(() => page.evaluate(() => (history.state as { fm?: number } | null)?.fm ?? 0)).toBe(1);
    expect(page.url()).not.toContain('#');
    await back(page);
    await expectView(page, 'explore');
    // An entry written by something else (a library's pushState): Back from it lands on ours, no bounce; the next Back moves on.
    await forward(page);
    await expectView(page, 'learn');
    await page.evaluate(() => history.pushState(null, '', location.pathname));
    await back(page);
    await page.waitForTimeout(500);
    await expectView(page, 'learn');
    expect(await page.evaluate(() => (history.state as { fm?: number } | null)?.fm ?? 0)).toBe(1);
    await back(page);
    await expectView(page, 'explore');
    await context.close();
  });

  test('A2: starting another lesson\'s check asks first when a kept one has an answer: back to it, or start here', async ({ browser }) => {
    test.setTimeout(90_000);
    const mode = MODES[0];
    const key = answerKey();
    const { context, page } = await open(browser, mode);
    const { state } = await startAnswered(mode, page, key);
    await back(page);
    await expect(page.getByTestId('check-kept')).toBeVisible();
    await back(page);
    await expect(unitPage(page)).toBeVisible();
    await page.locator('#learn-panel').getByRole('button', { name: /Meter and Time Signatures|Time Signatures/ }).first().click();
    await expect(page.locator('#learn-panel h1')).toBeVisible();
    await page.getByTestId('check-start').click();
    const choice = page.getByTestId('kept-choice');
    await expect(choice).toContainText(`Your check in “${LESSON.title}” is kept: question 1 of ${LESSON.questions}. If you start this check, that one is lost.`);
    await expect(page.getByTestId('kept-back')).toBeFocused();
    await expect(page.getByTestId('focused-check')).toHaveCount(0);
    // Back to it: the same question, exactly.
    await page.getByTestId('kept-back').click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    expect(await checkState(page)).toEqual(state);
    await expect(lessonHeading(page, LESSON.title)).toHaveCount(0);
    // Again, and this time start here: the kept one goes.
    await back(page);
    await expect(page.locator('#learn-panel h1')).toBeVisible();
    await page.getByTestId('check-start').click();
    await page.getByTestId('kept-start').click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    await expect(page.getByTestId('check-position')).toHaveText(/^1 \/ \d+$/);
    await noPushWithoutActivation(page);
    await context.close();
  });

  for (const how of ['older than a day', 'its question changed'] as const) {
    test(`A3: a kept check ${how} is dropped when its lesson opens: the card promises nothing`, async ({ browser }) => {
      test.setTimeout(90_000);
      const mode = MODES[0];
      const { context, page } = await open(browser, mode);
      await startAnswered(mode, page, answerKey());
      await back(page);
      await expect(page.getByTestId('check-kept')).toBeVisible();
      await page.evaluate((h) => {
        const raw = JSON.parse(localStorage.getItem('fermata-learn-session-v1')!);
        if (h === 'older than a day') raw.state.check.at = Date.now() - 25 * 60 * 60 * 1000;
        else raw.state.check.identities[raw.state.check.run.order[0]] = 'an exercise that no longer is';
        localStorage.setItem('fermata-learn-session-v1', JSON.stringify(raw));
      }, how);
      await page.reload();
      await expect(lessonHeading(page, LESSON.title)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('check-start')).toBeVisible();
      await expect(page.getByTestId('check-kept')).toHaveCount(0);
      await expect(page.getByTestId('check-continue')).toHaveCount(0);
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-learn-session-v1')!).state.check)).toBeNull();
      await context.close();
    });
  }

  test('A4: a check on screen holds the tour, a shared link and an update; one Back has put away holds nothing', async ({ browser }) => {
    test.setTimeout(90_000);
    const mode = MODES[0];
    const { context, page } = await open(browser, mode);
    await startAnswered(mode, page, answerKey());
    // On screen: work in progress.
    expect(await devModule<boolean>(page, '/src/services/workInProgress.ts', 'hasWorkInProgress') ?? true).toBe(true);
    const linked = await context.newPage();
    await linked.goto('/?key=G&scale=major');
    await expect(linked.getByTestId('toast-region')).toContainText(/G/, { timeout: 15_000 });
    await linked.waitForTimeout(800);
    expect(await linked.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.selectedKey?.natural ?? 'C'), 'held: not applied').not.toBe('G');
    await linked.close();
    await page.getByTestId('app-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Show me around' }).click();
    await expect(page.getByTestId('toast-region')).toContainText('Finish or leave your check first.');
    await expect(page.getByTestId('tour-bar')).toHaveCount(0);
    // Put away by Back: kept, and nothing is held.
    await page.keyboard.press('Escape');
    await back(page);
    await expect(page.getByTestId('check-kept')).toBeVisible();
    expect(await devModule<boolean>(page, '/src/services/workInProgress.ts', 'hasWorkInProgress') ?? false).toBe(false);
    // What another tab reads: the save says it is put away.
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('fermata-learn-session-v1')!).state.check.away)).toBe(true);
    const linked2 = await context.newPage();
    await linked2.goto('/?key=G&scale=major');
    // Applied: the key it names is the one saved. (Not read off that tab's Explore, which, at 153caab
    // too, now and then stays empty in a second tab under load: a fault outside this branch.)
    await expect.poll(() => linked2.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.selectedKey.natural), { timeout: 15_000 }).toBe('G');
    await linked2.close();
    await page.getByTestId('app-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Show me around' }).click();
    await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
    await context.close();
  });

  test('A4: a check left by a tab is still Learn\'s current screen (held, as before); a lesson opened over it puts it away (held no more)', async ({ browser }) => {
    test.setTimeout(90_000);
    const mode = MODES[0];
    const { context, page } = await open(browser, mode);
    await startAnswered(mode, page, answerKey());
    await tab(page, 'explore').click();
    await expectView(page, 'explore');
    expect(await devModule<boolean>(page, '/src/services/workInProgress.ts', 'hasWorkInProgress') ?? true).toBe(true);
    expect((await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-learn-session-v1')!).state.check)).away).toBeUndefined();
    // Quick Search opens another lesson: Learn's current screen is that lesson now.
    await page.keyboard.press('Control+k');
    const search = page.getByRole('dialog').filter({ has: page.locator('input') });
    await search.locator('input').fill('Relative and Parallel Keys');
    await search.getByRole('option', { name: /^Relative and Parallel Keys/ }).first().click();
    await expect(lessonHeading(page, 'Relative and Parallel Keys')).toBeVisible();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('fermata-learn-session-v1')!).state.check.away)).toBe(true);
    expect(await devModule<boolean>(page, '/src/services/workInProgress.ts', 'hasWorkInProgress') ?? false).toBe(false);
    await page.getByTestId('app-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Show me around' }).click();
    await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
    await context.close();
  });

  test('A6: Back into Explore brings the chord back as it was left (its detail open); tapping Explore\'s own tab still clears it', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0]);
    await page.getByTestId('chords-card').getByRole('button').filter({ hasText: /^V/ }).first().click();
    const detail = page.getByTestId('chord-detail');
    await expect(detail).toBeVisible();
    const before = (await detail.innerText()).slice(0, 40);
    await detail.getByRole('button', { name: /Learn about this/ }).click();
    await expectView(page, 'learn');
    await back(page);
    await expectView(page, 'explore');
    await expect(detail).toBeVisible();
    expect((await detail.innerText()).slice(0, 40)).toBe(before);
    await tab(page, 'explore').click();
    await expect(detail).toHaveCount(0);
    await context.close();
  });

  test('A8: the active tab tapped mid-check or mid-Sprint leaves it with the same notice as Back, and Continue returns', async ({ browser }) => {
    test.setTimeout(90_000);
    const mode = MODES[0];
    const { context, page } = await open(browser, mode, { drill: SPRINT_READY });
    const { state } = await startAnswered(mode, page, answerKey());
    await tab(page, 'learn').click();
    await expect(overview(page)).toBeVisible();
    await expect(page.getByTestId('toast-region')).toContainText(`Your check is kept: question 1 of ${LESSON.questions}.`);
    await page.getByTestId('toast-region').getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    expect(await checkState(page)).toEqual(state);
    // A Sprint.
    await tab(page, 'drill').click();
    const panel = page.locator('#drill-panel');
    await panel.getByRole('button', { name: 'End session' }).click();
    await panel.getByRole('button', { name: 'Sprint', exact: true }).click();
    await expect(panel.getByText(/^\d+s$/)).toBeVisible();
    await tab(page, 'drill').click();
    await expect(panel.getByText('Session complete')).toBeVisible();
    await expect(page.getByTestId('toast-region')).toContainText('Your Sprint is paused, with the time it had left.');
    await page.getByTestId('toast-region').getByRole('button', { name: 'Continue' }).click();
    await expect(panel.getByText(/^\d+s$/)).toBeVisible();
    await context.close();
  });

  test('A9: the last lesson of a level — Back closes the milestone, then the celebration, and moves nowhere else; a reload and Forward agree', async ({ browser }) => {
    test.setTimeout(90_000);
    const src = readFileSync(new URL('../src/core/constants/curriculumL1.ts', import.meta.url), 'utf8');
    const tasks = [...new Set(src.match(/l1u3m4t\d+/g) ?? [])];
    const done = ['l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u1m4', 'l1u2m1', 'l1u2m2', 'l1u3m1', 'l1u3m2', 'l1u3m3'];
    const now = Date.now();
    const schedules = Object.fromEntries(done.map((id) => [id, { completedAt: now - 1000, nextReviewAt: now + 86_400_000, intervalLevel: 0, reviewCount: 0, lastReviewedAt: now - 1000 }]));
    const progress = { state: { progress: { completedModules: done, moduleProgress: { l1u3m4: tasks }, exerciseResults: { l1u3m4: { scores: {}, totalAttempts: 1, lastAttemptAt: now, passed: true } }, reviewSchedules: schedules } }, version: 2 };
    const { context, page } = await open(browser, MODES[0], { progress });
    await tab(page, 'learn').click();
    await levelOneCard(page).click();
    await page.locator('#learn-panel').getByRole('button', { name: /Your First Chords/ }).first().click(); // the level's Continue
    const lesson = page.getByRole('heading', { level: 1, name: /Your First Chords/ });
    await expect(lesson).toBeVisible();
    await page.getByRole('button', { name: 'Complete the lesson' }).first().click();
    const milestone = page.getByRole('dialog', { name: 'Unit complete' });
    await expect(milestone).toBeVisible();
    const entryHere = (await entry(page))!;
    await back(page);
    await expect(milestone).toHaveCount(0);
    const celebration = page.getByText('Level 1 Complete!');
    await expect(celebration).toBeVisible();
    await back(page);
    await expect(celebration).toHaveCount(0);
    await page.waitForTimeout(800);
    await expect(lesson).toBeVisible();
    // The entry under the learner names the lesson shown, at an index that is its own.
    const now2 = (await entry(page))!;
    expect(now2.s).toBe('module/l1/u3/l1u3m4');
    expect(now2.i).toBeLessThanOrEqual(entryHere.i);
    await page.reload();
    await expect(lesson).toBeVisible({ timeout: 15_000 });
    await forward(page);
    await page.waitForTimeout(800);
    await expect(lesson).toBeVisible();
    await back(page);
    await expect(levelOnePage(page)).toBeVisible();
    await context.close();
  });

  test('A10: Learn and Drill tapped in one moment leave Drill\'s entry with no screen named; Back from Drill settings is Drill\'s question, not Learn', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0], { drill: DRILL_SAVE });
    await tab(page, 'drill').click();
    const panel = page.locator('#drill-panel');
    await expect(panel.getByText('4 of 9')).toBeVisible();
    await page.evaluate(() => {
      (document.querySelector('[role="tab"][data-tab="learn"]') as HTMLElement).click();
      (document.querySelector('[role="tab"][data-tab="drill"]') as HTMLElement).click();
    });
    await page.waitForTimeout(800);
    await panel.getByRole('button', { name: 'Drill settings' }).click();
    await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
    await back(page);
    await expectView(page, 'drill');
    await expect(panel.getByText('4 of 9')).toBeVisible();
    await context.close();
  });

  test('A11: after the app\'s own ← a Back never shows the screen it left nor one it went back past; closed layers cost no press', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0], { drill: DRILL_SAVE });
    await tab(page, 'drill').click();
    const panel = page.locator('#drill-panel');
    await expect(panel.getByText('4 of 9')).toBeVisible();
    await panel.getByRole('button', { name: 'Drill settings' }).click();
    await panel.getByRole('button', { name: /Mastery map/ }).click();
    await expect(panel.getByRole('heading', { name: 'Mastery' })).toBeVisible();
    await panel.getByRole('button', { name: 'Back' }).click(); // "← Mastery": to Drill's question
    await expect(panel.getByText('4 of 9')).toBeVisible();
    await back(page);
    await expectView(page, 'explore');
    // Learn: a lesson, Next lesson, its ← to the unit, then Back: the level, not either lesson.
    await tab(page, 'learn').click();
    await levelOneCard(page).click();
    await page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.unit) }).first().click();
    await page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.title) }).first().click();
    await page.getByRole('button', { name: /Next lesson/ }).last().click();
    await expect(lessonHeading(page, LESSON.title)).toHaveCount(0);
    await page.getByRole('button', { name: 'Back', exact: true }).first().click(); // the lesson's ←: its unit
    await expect(unitPage(page)).toBeVisible();
    await back(page);
    await expect(levelOnePage(page)).toBeVisible();
    // A sheet, the menu and Quick Search opened and closed by their own controls: one Back still changes the screen.
    await forward(page);
    await expect(unitPage(page)).toBeVisible();
    await page.getByTestId('app-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await page.getByTestId('settings-sheet').getByRole('button', { name: 'Close' }).click();
    await page.getByTestId('app-menu').getByRole('button').first().click();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Control+k');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await back(page);
    await expect(levelOnePage(page)).toBeVisible();
    await context.close();
  });

  test('A13: after Back changes the screen, focus is on its heading (its name is read), not on the page body', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0]);
    await tab(page, 'learn').click();
    await levelOneCard(page).click();
    await expect(levelOnePage(page)).toBeVisible();
    await back(page);
    await expect(overview(page)).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.activeElement?.textContent?.trim())).toBe('Learn Music Theory');
    await back(page);
    await expectView(page, 'explore');
    await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('#explore-panel') && /^H[12]$/.test(document.activeElement.tagName))).toBe(true);
    await context.close();
  });

  test('A14: only a real activation arms a push — not Escape, a modifier alone or a shortcut (the app\'s own state, dev server)', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0]);
    if ((await devModule<boolean>(page, '/src/state/appHistory.ts', 'isArmedForTests')) === undefined) {
      test.info().annotations.push({ type: 'note', description: 'reads the app\'s own module: dev server only' });
      await context.close();
      return;
    }
    await tab(page, 'learn').click();
    await back(page); // a traversal disarms
    expect(await devModule<boolean>(page, '/src/state/appHistory.ts', 'isArmedForTests')).toBe(false);
    for (const key of ['Escape', 'Shift', 'Control', 'Alt', 'Meta', 'Alt+ArrowLeft', 'Meta+BracketLeft']) {
      await page.keyboard.press(key);
      expect(await devModule<boolean>(page, '/src/state/appHistory.ts', 'isArmedForTests'), key).toBe(false);
    }
    await page.keyboard.press('a');
    expect(await devModule<boolean>(page, '/src/state/appHistory.ts', 'isArmedForTests')).toBe(true);
    await context.close();
  });

  test('A14: a touch that scrolls (it ends in touchend, with no tap) arms nothing; a tap does (dev server, Chromium)', async ({ browser }) => {
    const mode = MODES[1];
    const { context, page } = await open(browser, mode);
    const armed = () => devModule<boolean>(page, '/src/state/appHistory.ts', 'isArmedForTests');
    if ((await armed()) === undefined || page.context().browser()?.browserType().name() !== 'chromium') {
      test.info().annotations.push({ type: 'note', description: 'reads the app\'s own module through CDP touches: dev server, Chromium only' });
      await context.close();
      return;
    }
    await press(mode, tab(page, 'learn'));
    await back(page); // a traversal disarms
    expect(await armed()).toBe(false);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 500 }] });
    for (let k = 1; k <= 8; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: 500 - k * 30 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(300);
    expect(await armed()).toBe(false);
    await press(mode, page.getByTestId('key-summary'));
    expect(await armed()).toBe(true);
    await context.close();
  });

  test('two tabs: A on Explore, B moves to Learn, A reloads and stays on Explore (this tab\'s entry before any tab\'s last view)', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0]);
    const b = await context.newPage();
    await b.goto('/');
    await b.locator('[role="tab"][data-tab="learn"]').click();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.lastView)).toBe('learn');
    await page.reload();
    await expectView(page, 'explore');
    await b.close();
    await context.close();
  });

  test('a running Sprint: Back, reload, Forward — the same question, score and time', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0], { drill: SPRINT_READY });
    await tab(page, 'drill').click();
    const panel = page.locator('#drill-panel');
    await panel.getByRole('button', { name: 'End session' }).click();
    await panel.getByRole('button', { name: 'Sprint', exact: true }).click();
    const clock = panel.getByText(/^\d+s$/);
    await expect(clock).toBeVisible();
    const prompt = panel.locator('p.text-xl').first();
    const question = await prompt.textContent();
    const seconds = Number((await clock.textContent())!.replace('s', ''));
    await back(page);
    await expect(panel.getByText('Session complete')).toBeVisible();
    await page.reload();
    // Drill's first screen again (the summary is not kept across a reload, as before: a new session starts), the Sprint paused.
    await expectView(page, 'drill');
    await expect(clock).toHaveCount(0);
    await forward(page);
    await expect(prompt).toHaveText(question!);
    const after = Number((await clock.textContent())!.replace('s', ''));
    expect(after).toBeLessThanOrEqual(seconds);
    expect(after).toBeGreaterThanOrEqual(seconds - 2);
    await context.close();
  });

  test('the tour ended with "Stay here": the entry follows the view it ended on, and Back goes on from there', async ({ browser }) => {
    test.setTimeout(120_000);
    // From Learn, which the tour always leaves (its first steps are Explore's, its last Drill's).
    const { context, page } = await open(browser, MODES[0], { settings: { lastView: 'learn' } });
    await expect(overview(page)).toBeVisible();
    await page.getByTestId('app-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Show me around' }).click();
    await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
    const caption = page.getByTestId('tour-caption');
    for (let i = 0; i < 16 && !(await page.getByTestId('tour-stay').count()); i++) {
      // Let the step finish what it shows (a view it opens) before moving on.
      await page.waitForTimeout(1200);
      const before = (await caption.textContent()) ?? '';
      await page.getByTestId('tour-next').click();
      await expect(caption).not.toHaveText(before, { timeout: 15_000 });
    }
    const view = await page.locator('[role="tab"][data-tab][aria-selected="true"]').getAttribute('data-tab');
    await page.getByTestId('tour-stay').click();
    await expect(page.getByTestId('tour-bar')).toHaveCount(0);
    expect(view, 'the tour ended away from where it began').not.toBe('learn');
    expect((await entry(page))!.v).toBe(view);
    await expectView(page, view as 'explore' | 'drill');
    await context.close();
  });
});

// ── The second cold review (review B-2), each in a real browser ─────────────────────────────────

/** A lesson title as a pattern (some carry ( ) ? or +). */
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const nextLesson = (page: Page, title: string) => page.getByRole('button', { name: new RegExp(`^Next lesson\\s*${esc(title)}$`) }).last();
const previousLesson = (page: Page, title: string) => page.getByRole('button', { name: new RegExp(`^Previous\\s*${esc(title)}$`) }).last();
const placeOf = (m: { id: string; level: string; unitId: string }) => `module/${m.level}/${m.unitId}/${m.id}`;

test.describe('review B-2', () => {
  // Item 1: "Next lesson" from a unit's last lesson paired the next lesson with the CURRENT unit and showed an
  // empty panel (in every release since the first Learn view, February 2026). Every unit boundary of every level.
  for (let n = 1; n <= 9; n++) {
    test(`item 1: level ${n} — Next from every unit's last lesson shows the next lesson in its own unit, Previous comes back; the level's last lesson has no Next`, async ({ browser }) => {
      test.setTimeout(240_000);
      const lessons = MODULE_INDEX.filter((m) => m.level === `l${n}` && !OPTIONAL_UNIT_IDS.has(m.unitId));
      const boundaries = lessons.slice(0, -1).map((m, k) => [m, lessons[k + 1]] as const).filter(([a, b]) => a.unitId !== b.unitId);
      expect(boundaries.length, 'a level with more than one unit').toBeGreaterThan(0);
      const { context, page } = await open(browser, MODES[0], { settings: { lastView: 'learn' } });
      for (const [last, first] of boundaries) {
        await page.goto(`/?lesson=${last.id}`);
        await expect(lessonHeading(page, last.title)).toBeVisible({ timeout: 15_000 });
        await nextLesson(page, first.title).click();
        await expect(lessonHeading(page, first.title), `${last.id} → ${first.id}`).toBeVisible();
        expect((await entry(page))?.s).toBe(placeOf(first));
        await previousLesson(page, last.title).click();
        await expect(lessonHeading(page, last.title), `${first.id} → ${last.id}`).toBeVisible();
        expect((await entry(page))?.s).toBe(placeOf(last));
        // Back retraces both.
        await back(page);
        await expect(lessonHeading(page, first.title)).toBeVisible();
      }
      const end = lessons.at(-1)!;
      await page.goto(`/?lesson=${end.id}`);
      await expect(lessonHeading(page, end.title)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('button', { name: /^Next lesson/ })).toHaveCount(0);
      await context.close();
    });
  }

  test('item 1: an optional unit (guitar notation, the two tracks) walks inside itself; its last lesson has no Next, its first no Previous', async ({ browser }) => {
    test.setTimeout(120_000);
    const { context, page } = await open(browser, MODES[0], { settings: { lastView: 'learn' } });
    for (const unit of OPTIONAL_UNIT_IDS) {
      const lessons = MODULE_INDEX.filter((m) => m.unitId === unit);
      await page.goto(`/?lesson=${lessons[0].id}`);
      await expect(lessonHeading(page, lessons[0].title)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('button', { name: /^Previous/ })).toHaveCount(0);
      await nextLesson(page, lessons[1].title).click();
      await expect(lessonHeading(page, lessons[1].title)).toBeVisible();
      expect((await entry(page))?.s).toBe(placeOf(lessons[1]));
      await page.goto(`/?lesson=${lessons.at(-1)!.id}`);
      await expect(lessonHeading(page, lessons.at(-1)!.title)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('button', { name: /^Next lesson/ })).toHaveCount(0);
    }
    await context.close();
  });

  // Item 2: each part by itself, from a state where it differs from what Explore opens with.
  const exploreState = (page: Page) => page.evaluate(() => {
    const tab = ['diatonic', 'all', 'build'].find((id) => document.getElementById(`chords-tab-${id}`)?.getAttribute('aria-selected') === 'true') ?? null;
    const detail = document.querySelector('[data-testid="chord-detail"]');
    return {
      tab,
      name: detail?.querySelector('h3, h2, [data-testid="chord-name"]')?.textContent?.trim() ?? (detail ? detail.textContent!.trim().slice(0, 12) : null),
      inversion: detail?.querySelector('[role="radio"][aria-checked="true"]')?.textContent?.trim() ?? null,
      blocks: document.querySelectorAll('[role="group"][aria-label^="Chromatic strip"] button[aria-pressed="true"]').length,
      category: document.querySelector('[data-testid="chords-card"] [role="radiogroup"] [role="radio"][aria-checked="true"]')?.textContent?.trim() ?? null,
    };
  });
  async function leaveAndComeBack(page: Page) {
    await tab(page, 'learn').click();
    await expectView(page, 'learn');
    await back(page);
    await expectView(page, 'explore');
    await expect(page.getByTestId('chords-card')).toBeVisible();
  }

  test('item 2: Back into Explore brings back each part as it was: the chord and 1st / 2nd inversion (In key), All Chords\' category and its chord\'s detail, the built chord on Build', async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await open(browser, MODES[0]);
    const detail = page.getByTestId('chord-detail');
    // In key: V on its 1st inversion, then on its 2nd.
    for (const k of [1, 2]) {
      await page.getByTestId('chords-card').getByRole('button').filter({ hasText: /^V/ }).first().click();
      await detail.getByRole('radio').nth(k).click();
      const left = await exploreState(page);
      expect(left.inversion).toBe(k === 1 ? '1st Inv' : '2nd Inv');
      await leaveAndComeBack(page);
      await expect.poll(() => exploreState(page)).toEqual(left);
      await tab(page, 'explore').click(); // Explore's own tab clears it, as before
      await expect(detail).toHaveCount(0);
    }
    // All Chords, a chord of a later category: the category and the chord's detail come back.
    await page.locator('#chords-tab-all').click();
    await page.getByTestId('chords-card').getByRole('radio').nth(2).click();
    await page.getByTestId('chords-card').locator('button[data-quality]').nth(1).click();
    await expect(detail).toBeVisible();
    const all = await exploreState(page);
    expect(all.tab).toBe('all');
    await leaveAndComeBack(page);
    await expect.poll(() => exploreState(page)).toEqual(all);
    await expect(detail).toBeVisible();
    // Build: C, E, G built, on its 1st inversion.
    await page.locator('#chords-tab-build').click();
    const strip = page.getByRole('group', { name: /Chromatic strip/ }).locator('button');
    await strip.nth(4).click();
    await strip.nth(7).click();
    await expect(detail).toBeVisible();
    await detail.getByRole('radio').nth(1).click();
    const built = await exploreState(page);
    expect(built).toMatchObject({ tab: 'build', blocks: 3, inversion: '1st Inv' });
    await leaveAndComeBack(page);
    await expect.poll(() => exploreState(page)).toEqual(built);
    // Forward and Back again: the same.
    await forward(page);
    await expectView(page, 'learn');
    await back(page);
    await expect.poll(() => exploreState(page)).toEqual(built);
    await context.close();
  });

  test('item 2: the degree and the detail flag come back with no chord too (no screen reads them today: set through the store, dev server)', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0]);
    const STORE = '/src/state/store.ts';
    const read = () => page.evaluate(async (path) => {
      const m = (await import(/* @vite-ignore */ path)) as { useAppStore: { getState: () => { selectedChord: unknown; selectedDegree: number | null; detailPanelOpen: boolean } } };
      const s = m.useAppStore.getState();
      return { chord: s.selectedChord, degree: s.selectedDegree, detail: s.detailPanelOpen };
    }, STORE);
    if (!(await page.request.get(STORE)).headers()['content-type']?.includes('javascript')) test.skip(true, 'the build has no modules to reach the store');
    await page.evaluate(async (path) => {
      const m = (await import(/* @vite-ignore */ path)) as { useAppStore: { setState: (s: object) => void } };
      m.useAppStore.setState({ selectedChord: null, selectedDegree: 4, detailPanelOpen: true });
    }, STORE);
    await leaveAndComeBack(page);
    expect(await read()).toEqual({ chord: null, degree: 4, detail: true });
    await context.close();
  });

  // Item 3: the window is tens of milliseconds; history.go is delayed by 500 ms to hold it open.
  test('item 3: a tab tapped while the app\'s own ← moves the history is a screen of its own after it: no entry lost, none pushed', async ({ browser }) => {
    test.setTimeout(90_000);
    const context = await browser.newContext({ viewport: MODES[0].viewport, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.addInitScript(() => {
      if (!localStorage.getItem('__seeded')) {
        localStorage.clear();
        localStorage.setItem('fermata-welcome-v1', 'seen');
        localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'fermata', language: 'en', instrument: 'piano', lastView: 'learn' }, version: 6 }));
        localStorage.setItem('__seeded', '1');
      }
      const go = history.go.bind(history);
      history.go = (d?: number) => void setTimeout(() => go(d), 500);
      const pushes: unknown[] = [];
      (window as unknown as { __pushes: unknown[] }).__pushes = pushes;
      const push = history.pushState.bind(history);
      history.pushState = (s: unknown, u: string, url?: string | URL | null) => { pushes.push({ active: navigator.userActivation?.isActive ?? null, state: s }); push(s, u, url); };
    });
    const page = await context.newPage();
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => (history.state as { fm?: number } | null)?.fm ?? 0), { timeout: 15_000 }).toBe(1);
    await levelOneCard(page).click();
    await page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.unit) }).first().click();
    await page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.title) }).first().click();
    await expect(lessonHeading(page, LESSON.title)).toBeVisible();
    const lesson = (await entry(page))!;
    const length = await historyLength(page);
    await page.locator('#learn-panel').getByRole('button', { name: new RegExp(`^(Back|${esc(LESSON.unit)})`) }).first().click(); // the lesson's ←
    await page.waitForTimeout(100);
    await tab(page, 'drill').click(); // while the history is still moving
    await expectView(page, 'drill');
    await expect.poll(() => entry(page), { timeout: 5_000 }).toMatchObject({ i: lesson.i, v: 'drill' });
    expect(await historyLength(page), 'nothing pushed').toBe(length);
    await noPushWithoutActivation(page);
    await back(page);
    await expect(unitPage(page)).toBeVisible();
    expect((await entry(page))?.s).toBe(`unit/l1/u2`);
    await back(page);
    await expect(levelOnePage(page)).toBeVisible();
    await context.close();
  });

  // Item 4.
  test('item 4: a check left with no answer is nothing kept — the card and the toast say nothing, a new check needs no choice; Forward starts it again', async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await open(browser, MODES[0], { settings: { lastView: 'learn' } }, `/?lesson=${LESSON.id}`);
    await expect(lessonHeading(page, LESSON.title)).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('check-start').click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    await back(page);
    await expect(page.getByTestId('check-start')).toBeVisible();
    await expect(page.getByTestId('check-kept')).toHaveCount(0);
    await expect(page.getByTestId('check-continue')).toHaveCount(0);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-learn-session-v1')!).state.check)).toBeNull();
    await forward(page);
    await expect(page.getByTestId('focused-check')).toBeVisible();
    await expect(page.getByTestId('check-position')).toHaveText(/^1 \/ \d+$/);
    // Left for another view by Back (no answer): no toast.
    await back(page);
    await back(page);
    await page.waitForTimeout(400);
    await expect(page.getByTestId('toast-region').getByText(/kept/)).toHaveCount(0);
    // Another lesson's check starts with no choice: nothing is kept.
    await page.goto('/?lesson=l1u2m2');
    await expect(page.locator('#learn-panel h1')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('check-start').click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    await expect(page.getByTestId('kept-choice')).toHaveCount(0);
    await context.close();
  });

  for (const mode of MODES) {
    test(`item 4 (${mode.name}): the choice has a way out — Escape and Cancel give back the card, focus on the button that opened it; nothing is lost`, async ({ browser }) => {
      test.setTimeout(90_000);
      const key = answerKey();
      const { context, page } = await open(browser, mode);
      const { state } = await startAnswered(mode, page, key);
      await back(page);
      await back(page);
      await expect(unitPage(page)).toBeVisible();
      await press(mode, page.locator('#learn-panel').getByRole('button', { name: /Time Signatures/ }).first());
      await expect(page.locator('#learn-panel h1')).toBeVisible();
      for (const how of mode.touch ? ['Cancel'] : ['Escape', 'Cancel']) {
        await press(mode, page.getByTestId('check-start'));
        await expect(page.getByTestId('kept-choice')).toBeVisible();
        await expect(page.getByTestId('check-start')).toHaveCount(0);
        if (how === 'Escape') await page.keyboard.press('Escape');
        else await press(mode, page.getByTestId('kept-cancel'));
        await expect(page.getByTestId('kept-choice')).toHaveCount(0);
        await expect(page.getByTestId('check-start')).toBeFocused();
        await expect(page.getByTestId('focused-check')).toHaveCount(0);
      }
      // The kept one is still there, exactly.
      await press(mode, page.getByTestId('check-start'));
      await press(mode, page.getByTestId('kept-back'));
      await expect(page.getByTestId('focused-check')).toBeVisible();
      expect(await checkState(page)).toEqual(state);
      await context.close();
    });
  }

  // The choice's other words, in Portuguese and Spanish: a kept practice round before a review, a kept review before a check.
  const WORDS = {
    pt: {
      practice: 'A tua ronda de prática em «A pauta e as claves» ficou guardada: pergunta 2 de 3. Se começares esta revisão, essa perde-se.',
      review: 'A tua revisão de «A pauta e as claves» ficou guardada: pergunta 2 de 3. Se começares esta verificação, essa perde-se.',
      back: 'Voltar a «A pauta e as claves»', startReview: 'Começar esta revisão', startCheck: 'Começar esta verificação', cancel: 'Cancelar', overview: 'Aprender teoria musical',
    },
    es: {
      practice: 'Tu ronda de práctica en «El pentagrama y las claves» se ha guardado: pregunta 2 de 3. Si empiezas este repaso, lo guardado se pierde.',
      review: 'Tu repaso de «El pentagrama y las claves» se ha guardado: pregunta 2 de 3. Si empiezas esta comprobación, lo guardado se pierde.',
      back: 'Volver a «El pentagrama y las claves»', startReview: 'Empezar este repaso', startCheck: 'Empezar esta comprobación', cancel: 'Cancelar', overview: 'Aprender teoría musical',
    },
  } as const;
  for (const lang of ['pt', 'es'] as const) {
    test(`item 4 (${lang}): the choice before a review over a kept practice round, and before a check over a kept review, in the learner's language; Cancel leaves the review`, async ({ browser }) => {
      test.setTimeout(90_000);
      const now = Date.now();
      const day = 86_400_000;
      const progress = { state: { progress: { completedModules: [LESSON.id], moduleProgress: {}, exerciseResults: {}, reviewSchedules: { [LESSON.id]: { completedAt: now - 3 * day, nextReviewAt: now - day, intervalLevel: 0, reviewCount: 0, lastReviewedAt: now - 3 * day } } } }, version: 2 };
      const { context, page } = await open(browser, MODES[0], { progress, settings: { lastView: 'learn', language: lang } });
      const keep = (kind: 'practice' | 'review') => page.evaluate(([k, l]) => {
        // The shipped v1 save's run (lesson l1u1m1, question 2 of 3, one answer given), kept by Back.
        const check = { moduleId: 'l1u1m1', kind: k, lang: l, fingerprints: { l1u1m1e1: '66e6fdf2', l1u1m1e2: 'bfcb733e', l1u1m1e3: '36f41596' }, run: { order: ['l1u1m1e2', 'l1u1m1e1', 'l1u1m1e3'], index: 1, scores: [1], items: [{ id: 'l1u1m1e2', answers: ['x'], score: 1, answer: 'x' }], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null }, finished: false, at: Date.now(), away: true };
        localStorage.setItem('fermata-learn-session-v1', JSON.stringify({ state: { screen: null, check }, version: 1 }));
      }, [kind, lang] as const);
      // A practice round kept; the due review opened from the overview.
      await keep('practice');
      await page.reload();
      await expect(page.locator('#learn-panel h1')).toBeVisible({ timeout: 15_000 });
      await page.locator('#learn-panel').getByRole('button', { name: new RegExp(lang === 'pt' ? 'Figuras rítmicas e pausas' : 'Figuras rítmicas y silencios') }).first().click();
      const choice = page.getByTestId('kept-choice');
      await expect(choice).toContainText(WORDS[lang].practice);
      await expect(page.getByTestId('kept-back')).toHaveText(WORDS[lang].back);
      await expect(page.getByTestId('kept-start')).toHaveText(WORDS[lang].startReview);
      await expect(page.getByTestId('kept-cancel')).toHaveText(WORDS[lang].cancel);
      await expect(page.getByTestId('focused-check')).toHaveCount(0);
      // Cancel: a review has no card, so it is left (as its own "Back to Learn"); nothing started, the kept round stays.
      await page.getByTestId('kept-cancel').click();
      await expect(choice).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1, name: WORDS[lang].overview })).toBeVisible();
      await expect(page.getByTestId('focused-check')).toHaveCount(0);
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-learn-session-v1')!).state.check.kind)).toBe('practice');
      // A review kept; a lesson's check started.
      await keep('review');
      await page.goto(`/?lesson=${LESSON.id}`);
      await expect(page.locator('#learn-panel h1')).toBeVisible({ timeout: 15_000 });
      await page.getByTestId('check-start').click();
      await expect(choice).toContainText(WORDS[lang].review);
      await expect(page.getByTestId('kept-start')).toHaveText(WORDS[lang].startCheck);
      await context.close();
    });
  }

  // The rows the review found missing.
  test('a Sprint ended by its ✕: Forward onto its entry starts no new Sprint, nor its clock (DrillView\'s `reopenable`)', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0], { drill: SPRINT_READY });
    await tab(page, 'drill').click();
    const panel = page.locator('#drill-panel');
    await panel.getByRole('button', { name: 'End session' }).click();
    await panel.getByRole('button', { name: 'Sprint', exact: true }).click();
    const clock = panel.getByText(/^\d+s$/);
    await expect(clock).toBeVisible();
    await expect.poll(async () => (await entry(page))?.s).toBe('sprint');
    await panel.getByRole('button', { name: 'End session' }).click(); // the Sprint's ✕
    await expect(clock).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('fermata-drill-v1')!).state.sprint)).toBeNull();
    await forward(page);
    await page.waitForTimeout(1200);
    await expect(clock).toHaveCount(0);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-drill-v1')!).state.sprint)).toBeNull();
    expect((await entry(page))?.s).toBe('');
    await context.close();
  });

  test('a review on screen with an answer is Learn\'s current screen: not put away, and it holds the tour (LearnView\'s `showsRun` for a review)', async ({ browser }) => {
    test.setTimeout(90_000);
    const now = Date.now();
    const day = 86_400_000;
    const progress = { state: { progress: { completedModules: [LESSON.id], moduleProgress: {}, exerciseResults: {}, reviewSchedules: { [LESSON.id]: { completedAt: now - 3 * day, nextReviewAt: now - day, intervalLevel: 0, reviewCount: 0, lastReviewedAt: now - 3 * day } } } }, version: 2 };
    const key = answerKey();
    const { context, page } = await open(browser, MODES[0], { progress, settings: { lastView: 'learn' } });
    await page.locator('#learn-panel').getByRole('button', { name: new RegExp(LESSON.title) }).first().click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    const q1 = await keyed(page, key);
    await answer(MODES[0], page, q1.wrong);
    await page.waitForTimeout(600);
    const check = await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-learn-session-v1')!).state.check);
    expect(check).toMatchObject({ kind: 'review', moduleId: LESSON.id });
    expect(check.away).toBeUndefined();
    await page.getByTestId('app-menu').getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Show me around' }).click();
    await expect(page.getByTestId('toast-region')).toContainText('Finish or leave your check first.');
    await expect(page.getByTestId('tour-bar')).toHaveCount(0);
    await context.close();
  });

  for (const where of ['a lesson', 'Drill settings'] as const) {
    test(`two tabs: A on ${where}, B moves elsewhere, A reloads and stays on ${where}`, async ({ browser }) => {
      const { context, page } = await open(browser, MODES[0], { drill: DRILL_SAVE });
      if (where === 'a lesson') {
        await page.goto(`/?lesson=${LESSON.id}`);
        await expect(lessonHeading(page, LESSON.title)).toBeVisible({ timeout: 15_000 });
      } else {
        await tab(page, 'drill').click();
        await page.locator('#drill-panel').getByRole('button', { name: 'Drill settings' }).click();
        await expect.poll(async () => (await entry(page))?.s).toBe('settings');
      }
      const here = await entry(page);
      const b = await context.newPage();
      await b.goto('/');
      await b.locator(`[role="tab"][data-tab="${where === 'a lesson' ? 'drill' : 'explore'}"]`).click();
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.lastView)).toBe(where === 'a lesson' ? 'drill' : 'explore');
      await page.reload();
      await expectView(page, where === 'a lesson' ? 'learn' : 'drill');
      if (where === 'a lesson') await expect(lessonHeading(page, LESSON.title)).toBeVisible({ timeout: 15_000 });
      await expect.poll(() => entry(page)).toEqual(here);
      await b.close();
      await context.close();
    });
  }

  // Item 5.
  test('item 5: after a reload the app\'s own ← still goes Back to the entries before it: Back never shows the lesson it went back past', async ({ browser }) => {
    test.setTimeout(90_000);
    const { context, page } = await open(browser, MODES[0], { settings: { lastView: 'learn' } });
    const track = MODULE_INDEX.filter((m) => m.unitId === 'u34');
    await page.locator('#learn-panel').getByRole('button', { name: /Start with sound/ }).first().click();
    await expect.poll(async () => (await entry(page))?.s).toBe('unit/l1/u34');
    await page.locator('#learn-panel').getByRole('button', { name: new RegExp(esc(track[0].title)) }).first().click();
    await expect(lessonHeading(page, track[0].title)).toBeVisible();
    for (let k = 1; k <= 3; k++) {
      await nextLesson(page, track[k].title).click();
      await expect(lessonHeading(page, track[k].title)).toBeVisible();
    }
    await page.reload();
    await expect(lessonHeading(page, track[3].title)).toBeVisible({ timeout: 15_000 });
    await expect.poll(() => page.evaluate(() => (history.state as { fm?: number } | null)?.fm ?? 0)).toBe(1);
    await page.locator('#learn-panel').getByRole('button', { name: /^(Back|Start with sound)/ }).first().click(); // the lesson's ←
    await expect.poll(async () => (await entry(page))?.s).toBe('unit/l1/u34');
    await back(page);
    await expect(overview(page)).toBeVisible();
    await forward(page);
    await expect.poll(async () => (await entry(page))?.s).toBe('unit/l1/u34');
    await forward(page);
    await expect(lessonHeading(page, track[0].title)).toBeVisible();
    await context.close();
  });

  // Item 6.
  test('item 6: after Back to Drill\'s question (no heading), focus is on the main region at once, never on the page body', async ({ browser }) => {
    const { context, page } = await open(browser, MODES[0], { drill: DRILL_SAVE, settings: { lastView: 'drill' } });
    await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#drill-panel button').first()).toBeVisible({ timeout: 15_000 });
    await tab(page, 'explore').click();
    await expectView(page, 'explore');
    await back(page);
    await expectView(page, 'drill');
    const seen: string[] = [];
    for (let k = 0; k < 6; k++) {
      seen.push(await page.evaluate(() => (document.activeElement === document.body ? 'body' : document.activeElement?.id || document.activeElement?.tagName) ?? 'none'));
      await page.waitForTimeout(100);
    }
    expect(seen.slice(1), seen.join(' ')).not.toContain('body');
    expect(seen.slice(1).every((s) => s === 'main-content' || /^H[12]$/.test(s)), seen.join(' ')).toBe(true);
    await context.close();
  });
});
