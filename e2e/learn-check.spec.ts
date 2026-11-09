import { test, expect, type Browser, type Page } from '@playwright/test';
import { levelCorpus } from '../src/data/exercises/__tests__/learnCorpus';

/**
 * W4b acceptance, in a real browser (EN and PT, phone 390×844 and laptop
 * 1440×900): a learner reads a lesson section by section, does a Try This in
 * place, starts the check, misses one (sees the hint — not the answer), gets
 * it right on the second try, finishes, sees the result screen and practises
 * the missed one. Then: a reload in the middle of a check lands on the same
 * question with the same scores and attempt; "Unlock anyway" persists; Level 9
 * badges show; a unit milestone appears once.
 *
 * The answer key comes from the app's own corpus (prompt + the set of option
 * labels on screen → the keyed answer), read in Node — the page itself never
 * reveals an answer before an item is final, which is the point.
 */

const MODULE = 'l2u5m3'; // Relative and Parallel Keys: 9 multiple-choice questions
const W = {
  en: { lesson: 'Relative and Parallel Keys', start: 'Start the check', submit: 'Submit', cont: 'Continue', show: 'Show on the piano', hear: 'Hear it', retry: /have another go\.$/, hint: /^(Hint: |Look again at)/, second: 'Correct on the second try', practise: "Practise the one I didn't get first time", practiceScore: '1 of 1 right', check: 'Check' },
  pt: { lesson: 'Tonalidades relativas e homónimas', start: 'Começar a verificação', submit: 'Enviar', cont: 'Continuar', show: 'Mostrar no piano', hear: 'Ouvir', retry: /tenta outra vez\.$/, hint: /^(Dica: |Volta a ver)/, second: 'Correto à segunda tentativa', practise: 'Praticar a que não acertei à primeira', practiceScore: '1 de 1 certas', check: 'Verificação' },
} as const;
type Lang = keyof typeof W;

function answerKey(lang: Lang): Map<string, string> {
  const key = new Map<string, string>();
  for (const item of levelCorpus(2, lang)) {
    if (item.moduleId !== MODULE || item.exercise.config.type !== 'multiple_choice') continue;
    const labels = item.exercise.config.choices.map((c) => c.label).sort().join('§');
    key.set(`${item.exercise.prompt}|${labels}`, item.exercise.config.choices.find((c) => c.correct)!.label);
  }
  return key;
}

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;

async function open(browser: Browser, v: (typeof VIEWPORTS)[number], lang: Lang, progress?: object) {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(([blob, prog]) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('music-theory-app', blob);
    if (prog) localStorage.setItem('music-theory-progress', prog);
    sessionStorage.setItem('__seeded', '1');
  }, [JSON.stringify({ state: { themeMode: 'fermata', language: lang, lastView: 'learn', instrument: 'piano' }, version: 6 }), progress ? JSON.stringify(progress) : ''] as const);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(800);
  return { context, page };
}

async function openLesson(page: Page, title: string) {
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog').filter({ has: page.locator('input') });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill(title);
  await dialog.getByRole('button', { name: new RegExp(`^${title}`) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible({ timeout: 15_000 });
}

/** The question on screen: its prompt and its option labels. */
async function question(page: Page) {
  const prompt = (await page.getByTestId('check-prompt').textContent())!.trim();
  const labels = await page.getByTestId('check-answers').locator('button').evaluateAll((bs) => bs.map((b) => b.getAttribute('data-answer') ?? ''));
  return { prompt, labels };
}
async function correctFor(page: Page, key: Map<string, string>) {
  const { prompt, labels } = await question(page);
  const right = key.get(`${prompt}|${[...labels].sort().join('§')}`);
  expect(right, `answer key for "${prompt}"`).toBeTruthy();
  return { right: right!, wrong: labels.find((l) => l !== right)! };
}
const option = (page: Page, label: string) => page.getByTestId('check-answers').locator(`button[data-answer="${label.replace(/"/g, '\\"')}"]`);

for (const v of VIEWPORTS) {
  for (const lang of ['en', 'pt'] as const) {
    test(`${v.name} ${lang}: lesson by sections → Try This in place → check (hint, not the answer) → result → practise the missed one`, async ({ browser }) => {
      test.setTimeout(120_000);
      const w = W[lang];
      const key = answerKey(lang);
      expect(key.size).toBe(9);
      const { context, page } = await open(browser, v, lang);
      await openLesson(page, w.lesson);

      // Section by section: the second concept, through the rail or the picker.
      if (v.name === 'laptop') {
        const rail = page.getByTestId('section-rail');
        await rail.locator('[data-section-link="c1"]').click();
        await expect(rail.locator('[data-section-link="c1"]')).toHaveAttribute('aria-current', 'location', { timeout: 5000 });
      } else {
        await page.getByTestId('section-picker').locator('button[aria-haspopup="dialog"]').click();
        await page.getByTestId('section-sheet').locator('[data-section-link="c1"]').click();
        await expect(page.getByTestId('section-picker')).toContainText('2 ·', { timeout: 5000 });
      }

      // Try This in place: hear it, then show it on the instrument (the dock opens, the view stays Learn).
      const tryThis = page.locator('[data-section="c1"] [data-testid="inline-try-this"]');
      await tryThis.getByRole('button', { name: w.hear }).click();
      await tryThis.getByRole('button', { name: w.show }).click();
      await expect(page.locator('#learn-panel')).toBeVisible();
      if (v.name === 'laptop') await expect(page.getByTestId('instrument-dock')).toHaveAttribute('data-detent', 'half');

      // The check is one tap away.
      if (v.name === 'laptop') await page.getByTestId('section-rail').locator('[data-section-link="check"]').click();
      else await page.getByTestId('section-picker').getByRole('button', { name: w.check, exact: true }).click();
      await page.getByRole('button', { name: w.start }).click();
      await expect(page.getByTestId('focused-check')).toBeVisible();

      // Question 1: a miss → "Not X — have another go" + a nudge or the lesson section to look at again
      // (review B1); nothing marks the answer.
      const first = await correctFor(page, key);
      await option(page, first.wrong).click();
      await page.getByRole('button', { name: w.submit }).click();
      await expect(page.getByTestId('check-thumb').getByText(w.retry)).toBeVisible();
      await expect(page.getByTestId('check-thumb').getByText(w.hint)).toBeVisible();
      await expect(page.locator('[data-state="answer"]')).toHaveCount(0);
      await expect(option(page, first.wrong)).toHaveAttribute('data-state', 'tried');
      await expect(option(page, first.wrong)).toBeDisabled();
      if (v.name === 'phone') {
        // Answers low on a phone, in thumb reach: Submit sits in the lower part
        // of the screen and the answers run down to it. Their TOP is not
        // asserted: it depends on which question the shuffle puts first (a long
        // PT question with two- and three-line options starts at ~316 px,
        // which failed the old "> 322" one run in eight; 9 Nov 2026).
        const box = (await page.getByTestId('check-answers').boundingBox())!;
        const submit = (await page.getByRole('button', { name: w.submit, exact: true }).boundingBox())!;
        expect(submit.y).toBeGreaterThan(844 * 0.6);
        expect(box.y + box.height).toBeGreaterThan(844 / 2);
        expect(submit.y - (box.y + box.height)).toBeLessThan(40);
        // …and below the question and its feedback (never overlapping them).
        const prompt = (await page.getByTestId('check-prompt').boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(prompt.y + prompt.height);
      }
      // …right on the second try.
      await option(page, first.right).click();
      await page.getByRole('button', { name: w.submit }).click();
      await expect(page.getByText(w.second)).toBeVisible();
      await expect(option(page, first.right)).toHaveAttribute('data-state', 'answer');
      await page.getByRole('button', { name: w.cont }).click();

      // The rest, right first time.
      for (let i = 2; i <= 9; i++) {
        await expect(page.getByTestId('check-position')).toHaveText(`${i} / 9`);
        const { right } = await correctFor(page, key);
        await option(page, right).click();
        await page.getByRole('button', { name: w.submit }).click();
        await page.getByRole('button', { name: w.cont }).click();
      }

      // The result screen: 8.5 of 9, the one missed question, and a way on.
      const result = page.getByTestId('check-result');
      await expect(result).toBeVisible();
      await expect(result.getByTestId('result-score')).toHaveText(lang === 'en' ? '8.5 of 9' : '8,5 de 9');
      await expect(result.getByTestId('missed-question')).toHaveCount(1);
      await expect(result.getByTestId('missed-answer')).toHaveText(first.right);
      await page.getByRole('button', { name: w.practise }).click();
      await expect(page.getByTestId('check-position')).toHaveText('1 / 1');
      await option(page, first.right).click();
      await page.getByRole('button', { name: w.submit }).click();
      await page.getByRole('button', { name: w.cont }).click();
      await expect(page.getByTestId('result-score')).toHaveText(w.practiceScore);
      await context.close();
    });
  }
}

test('a reload in the middle of a check loses nothing: question 4 of 9, same scores, same attempt', async ({ browser }) => {
  test.setTimeout(90_000);
  const key = answerKey('en');
  const { context, page } = await open(browser, VIEWPORTS[1], 'en');
  await openLesson(page, W.en.lesson);
  await page.getByTestId('section-rail').locator('[data-section-link="check"]').click();
  await page.getByRole('button', { name: W.en.start }).click();
  // Q1 wrong then right (½), Q2 and Q3 right (1, 1); Q4: a first miss.
  const q1 = await correctFor(page, key);
  await option(page, q1.wrong).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await option(page, q1.right).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  for (let i = 0; i < 2; i++) {
    const { right } = await correctFor(page, key);
    await option(page, right).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
  }
  await expect(page.getByTestId('check-position')).toHaveText('4 / 9');
  const q4 = await correctFor(page, key);
  await option(page, q4.wrong).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  const pipsBefore = await page.getByTestId('check-pips').locator('i').evaluateAll((is) => is.map((i) => i.getAttribute('data-score')));
  const promptBefore = (await question(page)).prompt;

  await page.reload();
  await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('check-position')).toHaveText('4 / 9');
  expect((await question(page)).prompt).toBe(promptBefore);
  expect(await page.getByTestId('check-pips').locator('i').evaluateAll((is) => is.map((i) => i.getAttribute('data-score')))).toEqual(pipsBefore);
  expect(pipsBefore.slice(0, 3)).toEqual(['0.5', '1', '1']);
  await expect(page.getByTestId('check-thumb').getByText(W.en.retry)).toBeVisible();
  await expect(option(page, q4.wrong)).toHaveAttribute('data-state', 'tried');
  // …and it carries on: the second try counts ½.
  await option(page, q4.right).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText(W.en.second)).toBeVisible();
  await context.close();
});

test('PT: a translation fix shipped between two loads keeps the check: question 4 of 9, same scores, same attempt', async ({ browser, request }) => {
  test.setTimeout(90_000);
  // The fix is shipped by rewriting the PT overlay modules the dev server
  // serves (/src/…); `vite preview` serves them hashed and minified, so there
  // it is skipped and noted — never silently on the dev server: only a
  // production build (the one with the PWA manifest) may lack the modules.
  const overlay = await request.get('/src/i18n/content/pt/exercisesL2.ts');
  const dev = overlay.ok() && (overlay.headers()['content-type'] ?? '').includes('javascript');
  if (!dev) {
    const manifest = await request.get('/manifest.webmanifest');
    expect((manifest.headers()['content-type'] ?? '').includes('json'), 'dev server without /src modules?').toBe(true);
    test.info().annotations.push({ type: 'note', description: 'rewriting the PT overlay needs the dev server: skipped on this build' });
  }
  test.skip(!dev, 'needs the dev server\'s /src modules');
  const key = answerKey('pt');
  const { context, page } = await open(browser, VIEWPORTS[1], 'pt');
  await openLesson(page, W.pt.lesson);
  await page.getByTestId('section-rail').locator('[data-section-link="check"]').click();
  await page.getByRole('button', { name: W.pt.start }).click();
  // Q1 wrong then right (½), Q2 and Q3 right (1, 1); Q4: a first miss.
  const q1 = await correctFor(page, key);
  await option(page, q1.wrong).click();
  await page.getByRole('button', { name: W.pt.submit }).click();
  await option(page, q1.right).click();
  await page.getByRole('button', { name: W.pt.submit }).click();
  await page.getByRole('button', { name: W.pt.cont }).click();
  for (let i = 0; i < 2; i++) {
    const { right } = await correctFor(page, key);
    await option(page, right).click();
    await page.getByRole('button', { name: W.pt.submit }).click();
    await page.getByRole('button', { name: W.pt.cont }).click();
  }
  await expect(page.getByTestId('check-position')).toHaveText('4 / 9');
  const q4 = await correctFor(page, key);
  await option(page, q4.wrong).click();
  await page.getByRole('button', { name: W.pt.submit }).click();
  const pipsBefore = await page.getByTestId('check-pips').locator('i').evaluateAll((is) => is.map((i) => i.getAttribute('data-score')));
  const promptBefore = (await question(page)).prompt;

  // The release: every PT question of this lesson reworded (authored items and
  // the template), the English untouched — a translation-only fix.
  const patched: string[] = [];
  await page.route(/\/src\/i18n\/content\/pt\/(exercises|templates)L2\.ts/, async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    expect(body).toContain('export default overlay;');
    const reword = route.request().url().includes('/exercisesL2.ts')
      ? "for (const k of Object.keys(overlay)) if (k.startsWith('l2u5m3')) overlay[k] = { ...overlay[k], prompt: overlay[k].prompt + ' (revisto)' };"
      : "overlay.l2u5m3 = overlay.l2u5m3.map((t) => ({ ...t, promptTemplate: t.promptTemplate + ' (revisto)' }));";
    patched.push(route.request().url());
    await route.fulfill({ response, body: body.replace('export default overlay;', `${reword}\nexport default overlay;`) });
  });
  await page.reload();
  await expect(page.getByTestId('focused-check')).toBeVisible({ timeout: 15_000 });
  expect(patched.length).toBe(2);
  await expect(page.getByTestId('check-position')).toHaveText('4 / 9');
  expect((await question(page)).prompt).toBe(`${promptBefore} (revisto)`);
  expect(await page.getByTestId('check-pips').locator('i').evaluateAll((is) => is.map((i) => i.getAttribute('data-score')))).toEqual(pipsBefore);
  expect(pipsBefore.slice(0, 3)).toEqual(['0.5', '1', '1']);
  await expect(page.getByTestId('check-thumb').getByText(W.pt.retry)).toBeVisible();
  await expect(option(page, q4.wrong)).toHaveAttribute('data-state', 'tried');
  // …and it carries on: the second try counts ½.
  await option(page, q4.right).click();
  await page.getByRole('button', { name: W.pt.submit }).click();
  await expect(page.getByText(W.pt.second)).toBeVisible();
  await context.close();
});

test('Unlock anyway persists across a reload; Level 9 shows "Pairs with Level n"', async ({ browser }) => {
  const { context, page } = await open(browser, VIEWPORTS[1], 'en');
  const panel = page.locator('#learn-panel [data-learn-screen]:not([inert])');
  await panel.getByRole('button').filter({ hasText: 'Harmony Foundations' }).first().click();
  await expect(page.getByText('This level follows Level 2.')).toBeVisible();
  await page.getByRole('button', { name: 'Unlock anyway' }).click();
  const dialog = page.getByRole('dialog', { name: 'Unlock Level 3?' });
  await expect(dialog).toContainText('Level 3 builds on Level 2, Expanding Fundamentals');
  await dialog.getByRole('button', { name: 'Unlock Level 3' }).click();
  await expect(page.getByTestId('unlocked-early')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-progress')!).state.progress.unlockedLevels);
  expect(stored).toEqual(['l3']);
  const l3card = page.locator('#learn-panel').getByRole('button').filter({ hasText: 'Harmony Foundations' }).first();
  await expect(l3card).not.toContainText('Complete Level 2');

  await page.locator('#learn-panel').getByRole('button').filter({ hasText: 'Ear Training' }).first().click();
  await page.locator('#learn-panel [data-learn-screen]:not([inert])').getByRole('button').filter({ hasText: /Unit 2/ }).first().click();
  await expect(page.getByText('Pairs with Level 7').first()).toBeVisible();
  await context.close();
});

test('a unit milestone shows once, when its last lesson is completed', async ({ browser }) => {
  const L1U1 = ['l1u1m1', 'l1u1m2', 'l1u1m3'];
  const last = 'l1u1m4';
  const progress = {
    state: { progress: { completedModules: L1U1, moduleProgress: { [last]: [`${last}t1`, `${last}t2`] }, exerciseResults: { [last]: { scores: {}, totalAttempts: 1, lastAttemptAt: Date.now(), passed: true } }, reviewSchedules: {} } },
    version: 2,
  };
  const { context, page } = await open(browser, VIEWPORTS[0], 'en', progress);
  await openLesson(page, 'The Chromatic Scale');
  await page.getByRole('button', { name: 'Complete the lesson' }).click();
  const dialog = page.getByRole('dialog', { name: 'Unit complete' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('What you can do now');
  await dialog.getByRole('button', { name: 'Continue' }).click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'The Chromatic Scale' })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  await expect(page.getByRole('dialog', { name: 'Unit complete' })).toHaveCount(0);
  await context.close();
});
