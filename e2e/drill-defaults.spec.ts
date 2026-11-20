import { test, expect, type Browser, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { auditPage } from './helpers/designAudit';
import { welcomeSeenState } from './helpers/welcome';

/**
 * Drill's defaults and start (audit 2, 19 November 2026), as the learner
 * meets them in the browser:
 *
 *  - P4: a first visit that chooses the piano on the start screen gets no
 *    "Reading (guitar)" (294 cards of the guitar's neck) in Drill; one that
 *    chooses the guitar does. The first session saves the value in force.
 *  - P6: with every topic off there is nothing to start: the intro says so,
 *    offers "Choose topics", and no session of nothing ("0 of 0 correct")
 *    is ever shown; nor with 0 new facts and no fact met.
 *  - The new lines in PT and ES at 320 and 390 px, day and night: whole, on
 *    screen, readable (the design audit).
 *
 * DRILL_SHOTS=<dir> writes the screens for the owner's eye.
 */

const SHOTS = process.env.DRILL_SHOTS;
type Lang = 'en' | 'pt' | 'es';
const READING: Record<Lang, string> = { en: 'Reading (guitar)', pt: 'Leitura (guitarra)', es: 'Lectura (guitarra)' };
const LINES: Record<Lang, { topics: string; newFacts: string; choose: string; settings: string }> = {
  en: { topics: 'No topic is chosen, so there is nothing to ask.', newFacts: 'Nothing to ask: new facts per session is set to 0, and you have not met any of these facts yet.', choose: 'Choose topics', settings: 'Drill settings' },
  pt: { topics: 'Nenhum tópico está escolhido, por isso não há nada para perguntar.', newFacts: 'Nada para perguntar: os factos novos por sessão estão a 0 e ainda não conheces nenhum destes factos.', choose: 'Escolher tópicos', settings: 'Definições de treino' },
  es: { topics: 'No hay ningún tema elegido, así que no hay nada que preguntar.', newFacts: 'Nada que preguntar: los conceptos nuevos por sesión están en 0 y aún no conoces ninguno de estos conceptos.', choose: 'Elegir temas', settings: 'Ajustes de práctica' },
};
const FAMILIES = ['keysig', 'circle', 'scale', 'degree', 'interval', 'triad', 'seventh', 'roman', 'function', 'read'];

const drillSave = (patch: { families?: Record<string, boolean>; newPerSession?: number; introDone?: boolean; lifetime?: { answered: number; correct: number } }) => JSON.stringify({
  state: {
    items: {},
    settings: { length: 24, newPerSession: patch.newPerSession ?? 4, families: patch.families ?? Object.fromEntries(FAMILIES.filter((f) => f !== 'read').map((f) => [f, true])), sound: false, showTimer: false },
    sprintBests: {}, lifetime: patch.lifetime ?? { answered: 0, correct: 0 }, activeSession: null, sprint: null, introDone: patch.introDone ?? false,
  },
  version: 3,
});

/** A learner with a settings save (and maybe a Drill save), on Drill — seeded under the run's own address. */
async function learner(browser: Browser, opts: { lang: Lang; drill?: string; themeMode?: string; width?: number; height?: number; touch?: boolean }) {
  const state = welcomeSeenState(test.info().project.use.baseURL!);
  state.origins[0].localStorage = state.origins[0].localStorage.map((e) =>
    e.name === 'music-theory-app' ? { ...e, value: JSON.stringify({ state: { language: opts.lang, themeMode: opts.themeMode ?? 'fermata', lastView: 'drill', instrument: 'piano' }, version: 6 }) } : e);
  if (opts.drill) state.origins[0].localStorage.push({ name: 'fermata-drill-v1', value: opts.drill });
  const touch = opts.touch ?? false;
  const context = await browser.newContext({
    storageState: state, viewport: { width: opts.width ?? 1440, height: opts.height ?? 900 }, isMobile: touch, hasTouch: touch,
    serviceWorkers: 'block', reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#drill-panel').getByTestId('drill-intro')).toBeVisible({ timeout: 15_000 });
  return { context, page };
}

const savedDrill = (page: Page) => page.evaluate(() => {
  const raw = localStorage.getItem('fermata-drill-v1');
  return raw ? JSON.parse(raw).state : null;
});

async function audit(page: Page, where: string, touch: boolean) {
  await page.waitForTimeout(300);
  const r = await auditPage(page, { minFontPx: 12, minTapPx: touch ? 44 : 36 });
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 4));
  expect.soft(r.textNodes, `${where}: audited no text`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: sideways scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
}

test.describe('P4: a first visit chooses its instrument on the start screen', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const instrument of ['Piano', 'Guitar'] as const) {
    test(`${instrument}: Drill's intro ${instrument === 'Piano' ? 'leaves guitar reading out' : 'lists guitar reading'}, and the first session saves it so`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-GB', serviceWorkers: 'block', reducedMotion: 'reduce', storageState: { cookies: [], origins: [] } });
      const page = await context.newPage();
      await page.goto('/');
      await expect(page.getByTestId('start-screen')).toBeVisible({ timeout: 15_000 });
      await page.getByRole('radiogroup', { name: "I'll use:" }).getByRole('radio', { name: instrument }).click();
      await page.getByRole('button', { name: /^I know some theory/ }).click();
      await expect(page.getByTestId('app-topbar')).toBeVisible({ timeout: 15_000 });
      await page.getByRole('tab', { name: 'Drill' }).click();
      const intro = page.locator('#drill-panel').getByTestId('drill-intro');
      await expect(intro).toBeVisible({ timeout: 15_000 });
      await expect(intro.getByText('Key signatures')).toBeVisible();
      if (instrument === 'Piano') await expect(intro.getByText(READING.en)).toHaveCount(0);
      else await expect(intro.getByText(READING.en)).toBeVisible();
      // Looking is not choosing: nothing about reading saved yet.
      expect((await savedDrill(page))?.settings?.families?.read).toBeUndefined();
      if (SHOTS) {
        mkdirSync(SHOTS, { recursive: true });
        await page.screenshot({ path: `${SHOTS}/drill-intro-${instrument.toLowerCase()}-first-visit-390.png` });
      }
      await intro.getByRole('button', { name: 'Start' }).click();
      await expect(page.locator('#drill-panel').getByText(/^1 of \d+$/)).toBeVisible();
      const saved = await savedDrill(page);
      expect(saved.settings.families.read).toBe(instrument === 'Guitar');
      if (instrument === 'Piano') expect(saved.activeSession.queue.filter((id: string) => id.startsWith('read:'))).toEqual([]);
      await context.close();
    });
  }
});

test.describe('P6: nothing to ask is said, never run', () => {
  test('the audit\'s path: every topic off from the intro — no Start, the line, Choose topics; never "0 of 0"', async ({ browser }) => {
    const { context, page } = await learner(browser, { lang: 'en' });
    const panel = page.locator('#drill-panel');
    await panel.getByRole('button', { name: 'Choose topics' }).click();
    const group = panel.getByRole('group', { name: 'Topics' });
    for (const chip of await group.getByRole('button').all()) {
      if ((await chip.getAttribute('aria-pressed')) === 'true') await chip.click();
    }
    await expect(group.locator('[aria-pressed="true"]')).toHaveCount(0);
    await panel.getByRole('button', { name: 'Back' }).click();
    const intro = panel.getByTestId('drill-intro');
    await expect(intro.getByTestId('drill-nothing')).toHaveText(LINES.en.topics);
    await expect(intro.getByRole('button', { name: 'Start' })).toHaveCount(0);
    await expect(panel.getByText(/0 of 0/)).toHaveCount(0);
    await intro.getByRole('button', { name: 'Choose topics' }).click();
    await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
    expect((await savedDrill(page)).activeSession).toBeNull();
    await context.close();
  });

  test('a returning learner with every topic off: the intro, not an empty session, after a reload too', async ({ browser }) => {
    const off = Object.fromEntries(FAMILIES.map((f) => [f, false]));
    const { context, page } = await learner(browser, { lang: 'en', drill: drillSave({ families: off, introDone: true, lifetime: { answered: 9, correct: 7 } }) });
    const panel = page.locator('#drill-panel');
    await expect(panel.getByTestId('drill-nothing')).toHaveText(LINES.en.topics);
    await page.reload();
    await expect(panel.getByTestId('drill-nothing')).toHaveText(LINES.en.topics, { timeout: 15_000 });
    await expect(panel.getByText(/Session complete|0 of 0/)).toHaveCount(0);
    expect((await savedDrill(page)).activeSession).toBeNull();
    await context.close();
  });

  // PT and ES at 320 and 390 px (the brief), EN at 390.
  for (const [lang, width] of [['en', 390], ['pt', 320], ['pt', 390], ['es', 320], ['es', 390]] as const) {
    {
      test(`${lang} ${width} px, day and night: both lines whole and readable, their one button`, async ({ browser }) => {
        for (const themeMode of ['fermata', 'fermata-night']) {
          for (const [kind, drill] of [
            ['topics', drillSave({ families: Object.fromEntries(FAMILIES.map((f) => [f, false])) })],
            ['newFacts', drillSave({ newPerSession: 0 })],
          ] as const) {
            const { context, page } = await learner(browser, { lang, drill, themeMode, width, height: 740, touch: true });
            const intro = page.locator('#drill-panel').getByTestId('drill-intro');
            await expect(intro.getByTestId('drill-nothing')).toHaveText(LINES[lang][kind]);
            const button = intro.getByRole('button', { name: kind === 'topics' ? LINES[lang].choose : LINES[lang].settings, exact: true });
            await expect(button).toBeVisible();
            const box = (await button.boundingBox())!;
            expect(box.y + box.height, `${lang} ${width} ${kind}: the button on screen`).toBeLessThanOrEqual(740);
            await audit(page, `${lang} ${width} ${themeMode} ${kind}`, true);
            if (SHOTS && themeMode === 'fermata') await page.screenshot({ path: `${SHOTS}/drill-nothing-${kind}-${lang}-${width}.png` });
            await context.close();
          }
        }
      });
    }
  }
});
