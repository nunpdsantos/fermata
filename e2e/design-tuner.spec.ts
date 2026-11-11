import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';
import { smallScreenAssertions, dialogButtonsFit } from './helpers/smallScreenAssertions';
import { launchWithFakeMic, micContext, micFixture, RECORD_STREAMS } from './helpers/micFixtures';

/**
 * Wave 3, brief T: the tuner and "Use my instrument" under the design
 * system's rules (type ≥ 12 px, targets ≥ 44 px on touch / 36 px with a
 * mouse, contrast on what is painted, nothing cut off, no sideways scroll):
 * the tuner off (before asking), asking, listening (a flat low E), in tune,
 * refused; the guitar's string row in standard tuning and in Drop D; "Use
 * my instrument" in a check, before asking and listening. Phone 390×844,
 * phone sideways 844×390, tablet 768×1024 (touch) and laptop 1440×900, day
 * and night; PT and ES at 320 and 360 px (and 390 / 1440 for PT's shots).
 * The microphone is Chromium's fake device playing a WAV (micFixtures.ts).
 *
 * `open` / `settle` / `check` repeat design-capo.spec.ts's. DESIGN_AUDIT_OUT
 * =<dir> writes a screenshot of each screen at 390×844, 844×390 and
 * 1440×900 (the sizes the review asks for).
 */

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'phone-landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
const THEMES = [
  { name: 'day', mode: 'fermata' },
  { name: 'night', mode: 'fermata-night' },
] as const;
type Viewport = { name: string; viewport: { width: number; height: number }; touch: boolean };
type Lang = 'en' | 'pt' | 'es';
const OUT = process.env.DESIGN_AUDIT_OUT;
const SHOT_SIZES = new Set(['390x844', '844x390', '1440x900']);
// The config's base URL (dev or preview), set by each test from its fixture.
let base = '';

const WORDS = {
  en: { more: 'More', tuner: 'Tuner', tune: 'Tune', start: 'Start listening', stop: 'Stop listening', close: 'Close the tuner', use: 'Use my instrument', allow: 'Allow the microphone', checkStart: 'Start the check', submit: 'Submit', next: /^(Continue|Next)$/, check: 'Check Answer' },
  pt: { more: 'Mais', tuner: 'Afinador', tune: 'Afinar', start: 'Começar a ouvir', stop: 'Parar de ouvir', close: 'Fechar o afinador', use: 'Usar o meu instrumento', allow: 'Permitir o microfone', checkStart: 'Começar a verificação', submit: 'Enviar', next: /^(Continuar|Seguinte)$/, check: 'Verificar resposta' },
  es: { more: 'Más', tuner: 'Afinador', tune: 'Afinar', start: 'Empezar a escuchar', stop: 'Dejar de escuchar', close: 'Cerrar el afinador', use: 'Usar mi instrumento', allow: 'Permitir el micrófono', checkStart: 'Empezar la comprobación', submit: 'Enviar', next: /^(Continuar|Siguiente)$/, check: 'Comprobar respuesta' },
} as const;

async function open(browser: Browser, v: Viewport, theme: string, state: Record<string, unknown>, lang: Lang = 'en', init?: () => void, path = '/') {
  const context = await micContext(browser, base, { viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { themeMode: theme, language: lang, ...state }, version: 6 }));
  await context.addInitScript(RECORD_STREAMS);
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  await page.goto(path);
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(1000);
  return { context, page };
}

function expectClean(r: AuditResult, where: string) {
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the sweep did not run`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
}

async function settle(page: Page) {
  const snapshot = () => page.evaluate(() => {
    const running = document.getAnimations().filter((a) => a.playState === 'running' || a.pending).length;
    let sig = '';
    let waiting = 0;
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      if (el.closest('.tuner-meter')) continue; // the needle follows the sound: it is meant to move
      const cs = getComputedStyle(el);
      if (cs.opacity !== '1' || cs.transform !== 'none') sig += `${cs.opacity}|${cs.transform};`;
      if ((el as HTMLElement).style?.opacity === '0') waiting++;
    }
    return { running, sig, waiting };
  });
  const start = Date.now();
  let prev = await snapshot();
  let quietSince = Date.now();
  while (Date.now() - start < 5000) {
    await page.waitForTimeout(60);
    const now = await snapshot();
    if (now.running > 0 || now.sig !== prev.sig) quietSince = Date.now();
    prev = now;
    const quiet = Date.now() - quietSince;
    if ((quiet >= 300 && now.waiting === 0) || quiet >= 1500) return;
  }
  throw new Error('the page never stopped moving (5 s)');
}

async function check(page: Page, v: Viewport, combo: string, screen: string) {
  await settle(page);
  await smallScreenAssertions(page, screen);
  await dialogButtonsFit(page);
  const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  if (OUT && SHOT_SIZES.has(`${v.viewport.width}x${v.viewport.height}`)) {
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: `${OUT}/${combo}--${screen}.png` });
  }
  expectClean(r, `${combo} ${screen}`);
}

async function openTuner(page: Page, lang: Lang, from: 'menu' | 'dock') {
  const w = WORDS[lang];
  if (from === 'dock' && (await page.getByTestId('dock-tune').count())) await page.getByTestId('dock-tune').click();
  else {
    await page.getByRole('button', { name: w.more, exact: true }).click();
    await page.getByRole('menuitem', { name: w.tuner }).click();
  }
  const sheet = page.getByTestId('tuner-sheet');
  await expect(sheet).toBeVisible();
  return sheet;
}

const ASKING = () => {
  navigator.mediaDevices.getUserMedia = () => new Promise(() => undefined);
};
const REFUSED = () => {
  navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('refused', 'NotAllowedError'));
};

/** The tuner's screens on one viewport, theme and language. */
async function tunerScreens(browser: Browser, v: Viewport, theme: string, combo: string, lang: Lang) {
  const w = WORDS[lang];
  // Off (before asking), then listening to a flat low E, then off again.
  {
    const { context, page } = await open(browser, v, theme, { instrument: 'guitar', lastView: 'explore' }, lang);
    // The two ways in: the dock bar's "Tune" (not on an upright phone: no room on its bar) and the "⋯" menu's "Tuner".
    if (v.viewport.width >= 640) await expect(page.getByTestId('dock-tune')).toBeVisible();
    else await expect(page.getByTestId('dock-tune')).toHaveCount(0);
    await check(page, v, combo, 'dock-with-tune');
    await page.getByRole('button', { name: w.more, exact: true }).click();
    await expect(page.getByRole('menuitem', { name: w.tuner })).toBeVisible();
    await check(page, v, combo, 'menu-with-tuner');
    await page.keyboard.press('Escape');
    const sheet = await openTuner(page, lang, 'dock');
    await expect(sheet.getByTestId('tuner-strings')).toHaveAttribute('data-tuning', 'standard');
    await check(page, v, combo, 'tuner-off');
    await sheet.getByRole('button', { name: w.start }).click();
    await expect(sheet.getByTestId('tuner-reading')).toHaveAttribute('data-state', 'flat', { timeout: 10_000 });
    await check(page, v, combo, 'tuner-listening-flat');
    await sheet.getByRole('button', { name: w.stop }).click();
    await expect(sheet.getByTestId('tuner')).toHaveAttribute('data-phase', 'idle');
    await context.close();
  }
  // Asking (the browser's question still open), from the menu.
  {
    const { context, page } = await open(browser, v, theme, { instrument: 'guitar', lastView: 'explore' }, lang, ASKING);
    const sheet = await openTuner(page, lang, 'menu');
    await sheet.getByRole('button', { name: w.start }).click();
    await expect(sheet.getByTestId('tuner')).toHaveAttribute('data-phase', 'asking');
    await check(page, v, combo, 'tuner-asking');
    await context.close();
  }
  // Refused, with another tuning's strings (Drop D).
  {
    const { context, page } = await open(browser, v, theme, { instrument: 'guitar', lastView: 'explore', guitarTuningId: 'drop-d' }, lang, REFUSED);
    const sheet = await openTuner(page, lang, 'dock');
    await expect(sheet.getByTestId('tuner-strings')).toHaveAttribute('data-tuning', 'drop-d');
    await sheet.getByRole('button', { name: w.start }).click();
    await expect(sheet.getByTestId('tuner')).toHaveAttribute('data-phase', 'problem');
    await check(page, v, combo, 'tuner-refused-drop-d');
    await context.close();
  }
}

async function answerChoice(page: Page, lang: Lang) {
  const w = WORDS[lang];
  const answers = page.getByTestId('check-answers');
  await answers.locator('button[data-state="open"]').last().click();
  await page.getByRole('button', { name: w.submit }).click();
  await page.waitForTimeout(300);
  if ((await answers.locator('[data-state="tried"]').count()) && !(await answers.locator('[data-state="answer"]').count())) {
    await answers.locator('button[data-state="open"]').first().click();
    await page.getByRole('button', { name: w.submit }).click();
    await page.waitForTimeout(300);
  }
  const cont = page.getByRole('button', { name: w.next });
  if (await cont.count()) await cont.first().click();
  await page.waitForTimeout(300);
}

/** "Use my instrument" in a chord_build check: before asking, then listening. */
async function answerScreens(browser: Browser, v: Viewport, theme: string, combo: string, lang: Lang) {
  const w = WORDS[lang];
  // A share link opens the lesson (wave 1): "Your First Chords — Major Triads".
  const { context, page } = await open(browser, v, theme, { instrument: 'piano', lastView: 'learn' }, lang, undefined, '/?lesson=l1u3m4');
  const start = page.getByRole('button', { name: w.checkStart });
  await expect(start).toBeAttached({ timeout: 15_000 });
  await start.scrollIntoViewIfNeeded();
  await start.click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  const checkAnswer = page.getByRole('button', { name: w.check });
  for (let i = 0; i < 12 && !(await checkAnswer.count()); i++) await answerChoice(page, lang);
  await expect(checkAnswer).toBeVisible();
  const toggle = page.getByRole('button', { name: w.use });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  await expect(page.getByTestId('use-my-instrument')).toHaveAttribute('data-state', 'explain');
  await check(page, v, combo, 'answer-explain');
  await page.getByRole('button', { name: w.allow }).click();
  await expect(page.getByTestId('use-my-instrument')).toHaveAttribute('data-state', 'on', { timeout: 10_000 });
  await check(page, v, combo, 'answer-listening');
  await context.close();
}

test.describe('the tuner and the answer control (a flat low E)', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(micFixture('design-e2-flat', [{ midi: 40, cents: -20, seconds: 2.4 }, { silence: 0.1 }]));
  });
  test.afterAll(async () => {
    await browser.close();
  });

  for (const v of VIEWPORTS) {
    for (const th of THEMES) {
      const combo = `${v.name}-${th.name}`;
      test(`${combo}: the tuner off, asking, listening, refused, the strings (standard, Drop D)`, async ({ baseURL }) => {
        base = baseURL!;
        test.setTimeout(180_000);
        await tunerScreens(browser, v, th.mode, combo, 'en');
      });
      test(`${combo}: "Use my instrument" in a check`, async ({ baseURL }) => {
        base = baseURL!;
        test.setTimeout(180_000);
        await answerScreens(browser, v, th.mode, combo, 'en');
      });
    }
  }

  for (const lang of ['pt', 'es'] as const) {
    const sizes: Viewport[] = [
      { name: 'phone320', viewport: { width: 320, height: 568 }, touch: true },
      { name: 'phone360', viewport: { width: 360, height: 740 }, touch: true },
      ...(lang === 'pt' ? [VIEWPORTS[0], VIEWPORTS[3]] : []),
    ];
    for (const v of sizes) {
      test(`${v.name}-${lang}: the tuner's and the answer control's words fit and read`, async ({ baseURL }) => {
        base = baseURL!;
        test.setTimeout(240_000);
        await tunerScreens(browser, v, 'fermata', `${v.name}-day-${lang}`, lang);
        await answerScreens(browser, v, 'fermata', `${v.name}-day-${lang}`, lang);
      });
    }
  }
});

/**
 * "Tune" adds one button to the guitar's dock bar and moves nothing else:
 * measured with and without it in the same run (it is hidden by a style in
 * the second measurement), the bar keeps its height and the instrument its
 * place; the bar never scrolls sideways.
 */
test.describe('the dock bar with "Tune"', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(micFixture('design-silence', [{ silence: 0.5 }]));
  });
  test.afterAll(async () => {
    await browser.close();
  });
  const LANDSCAPE_SMALL: Viewport = { name: 'phone-landscape-small', viewport: { width: 640, height: 360 }, touch: true };
  const sizes: [Viewport, Lang][] = [
    ...(['en', 'pt', 'es'] as const).flatMap((lang) => [...VIEWPORTS, LANDSCAPE_SMALL].map((v) => [v, lang] as [Viewport, Lang])),
    [{ name: 'laptop1280', viewport: { width: 1280, height: 800 }, touch: false }, 'en'],
    [{ name: 'phone320', viewport: { width: 320, height: 568 }, touch: true }, 'pt'],
  ];
  // With a capo the context line is at its longest ("Open position · Capo on fret 3").
  const cases = [...sizes.map(([v, lang]) => [v, lang, false] as const), ...sizes.map(([v, lang]) => [v, lang, true] as const)];
  for (const [v, lang, capo] of cases) {
    test(`${v.name}-${lang}${capo ? ' with a capo' : ''}: the bar keeps its height and the instrument its place`, async ({ baseURL }) => {
      base = baseURL!;
      const { context, page } = await open(browser, v, 'fermata', { instrument: 'guitar', lastView: 'explore', ...(capo ? { capoFret: 3 } : {}) }, lang);
      // An upright phone's bar has no room: no button there ("⋯" → Tuner).
      if (v.viewport.width < 640) {
        await expect(page.getByTestId('instrument-dock')).toBeVisible();
        await expect(page.getByTestId('dock-tune')).toHaveCount(0);
        await context.close();
        return;
      }
      await expect(page.getByTestId('dock-tune')).toBeVisible();
      await page.waitForTimeout(400);
      const measure = () => page.evaluate(() => {
        const bar = document.querySelector('.dock-bar-row') as HTMLElement;
        const region = document.getElementById('instrument-region');
        return {
          bar: bar.getBoundingClientRect().height,
          barOverflow: bar.scrollWidth - bar.clientWidth,
          instrumentTop: region ? region.getBoundingClientRect().top : null,
        };
      });
      const withTune = await measure();
      await page.addStyleTag({ content: '[data-testid="dock-tune"] { display: none !important; }' });
      await page.waitForTimeout(400);
      const without = await measure();
      expect(withTune.bar, `${v.name}-${lang}: bar height`).toBeCloseTo(without.bar, 0);
      expect(withTune.barOverflow, `${v.name}-${lang}: the bar does not scroll sideways`).toBeLessThanOrEqual(0);
      if (withTune.instrumentTop !== null && without.instrumentTop !== null) expect(withTune.instrumentTop).toBeCloseTo(without.instrumentTop, 0);
      await context.close();
    });
  }
});

test.describe('the tuner in tune', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(micFixture('design-e2-in-tune', [{ midi: 40, cents: 0, seconds: 2.4 }, { silence: 0.1 }]));
  });
  test.afterAll(async () => {
    await browser.close();
  });

  for (const v of VIEWPORTS) {
    for (const th of THEMES) {
      const combo = `${v.name}-${th.name}`;
      test(`${combo}: in tune`, async ({ baseURL }) => {
        base = baseURL!;
        test.setTimeout(120_000);
        const { context, page } = await open(browser, v, th.mode, { instrument: 'guitar', lastView: 'explore' });
        const sheet = await openTuner(page, 'en', 'dock');
        await sheet.getByRole('button', { name: WORDS.en.start }).click();
        await expect(sheet.getByTestId('tuner-reading')).toHaveAttribute('data-state', 'inTune', { timeout: 10_000 });
        await check(page, v, combo, 'tuner-in-tune');
        await context.close();
      });
    }
  }
});
