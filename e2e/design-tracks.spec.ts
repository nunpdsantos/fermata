import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';
import { smallScreenAssertions, dialogButtonsFit } from './helpers/smallScreenAssertions';
import { settle } from './helpers/wave1';
import { levelCorpus } from '../src/data/exercises/__tests__/learnCorpus';
import { buildChord } from '../src/core/constants/chords';
import { buildScale } from '../src/core/constants/scales';
import { getPitchClass } from '../src/core/constants/notes';
import type { Accidental, ChordQuality, NaturalNote, ScaleType } from '../src/core/types/music';

/**
 * Wave 2 design sweep for the starting tracks: the design-system rules
 * (e2e/helpers/designAudit.ts — type ≥ 12 px, targets ≥ 44 / 36 px,
 * contrast, no sideways scroll, nothing cut off) on every new screen —
 *   the overview's track cards (a newcomer's "Start here" at the top; the
 *   owner's "Other ways in" below the grid), a track's page, a sound-first
 *   lesson with its first Try This open (names, no staff), each new kind of
 *   check (an ear question with written options: "which is higher?" and
 *   "half or whole step?", and after a first miss; an ear scale with
 *   written options), and the closing card —
 * at phone 390×844, landscape 844×390, tablet 768×1024 (touch) and laptop
 * 1440×900, day and night, EN; PT and ES at 320 and 360 px.
 *
 * Screenshots of every screen at 390×844, 844×390 and 1440×900, day and
 * night, EN and PT, go to _review/shots/ when TRACKS_SHOTS=1.
 */

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
const NARROW = [
  { name: 'phone-320', viewport: { width: 320, height: 568 }, touch: true },
  { name: 'phone-360', viewport: { width: 360, height: 740 }, touch: true },
] as const;
type Viewport = (typeof VIEWPORTS)[number] | (typeof NARROW)[number];
const THEMES = [{ name: 'day', mode: 'fermata' }, { name: 'night', mode: 'fermata-night' }] as const;
type Lang = 'en' | 'pt' | 'es';
const SHOTS = process.env.TRACKS_SHOTS ? '_review/shots' : null;
const SHOT_SIZES = ['phone', 'landscape', 'laptop'];

const W = {
  en: { start: 'Start the check', submit: 'Submit', build: 'Check Answer', cont: 'Continue', lesson5: 'Three Notes Make a Chord' },
  pt: { start: 'Começar a verificação', submit: 'Enviar', build: 'Verificar resposta', cont: 'Continuar', lesson5: 'Três notas fazem um acorde' },
  es: { start: 'Empezar la comprobación', submit: 'Enviar', build: 'Comprobar respuesta', cont: 'Continuar', lesson5: 'Tres notas forman un acorde' },
} as const;

/** prompt|sorted options → keyed answer (choice items); prompt → pitch classes (builds). */
type Key = { choice: Map<string, string>; build: Map<string, number[]> };
function answerKey(lang: Lang): Key {
  const choice = new Map<string, string>();
  const build = new Map<string, number[]>();
  for (const { moduleId, exercise } of levelCorpus(1, lang)) {
    if (!moduleId.startsWith('l1u34')) continue;
    const c = exercise.config;
    const choices = c.type === 'multiple_choice' ? c.choices : c.type === 'ear_training' ? c.choices : undefined;
    if (choices) choice.set(`${exercise.prompt}|${choices.map((x) => x.label).sort().join('§')}`, choices.find((x) => x.correct)!.label);
    if (c.type === 'chord_build' || c.type === 'scale_build') {
      const root = { natural: c.root as NaturalNote, accidental: (c.rootAccidental || '') as Accidental };
      const notes = c.type === 'chord_build' ? buildChord(root, c.quality as ChordQuality).notes : buildScale(root, c.scaleType as ScaleType).notes;
      build.set(exercise.prompt, [...new Set(notes.map(getPitchClass))]);
    }
  }
  return { choice, build };
}

async function open(browser: Browser, v: Viewport, theme: string, lang: Lang, settings: Record<string, unknown> = {}) {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(([blob]) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('fermata-welcome-v1', 'seen');
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, [JSON.stringify({ state: { themeMode: theme, language: lang, lastView: 'learn', instrument: 'piano', ...settings }, version: 6 })] as const);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#learn-panel')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);
  return { context, page };
}

async function check(page: Page, v: Viewport, combo: string, screen: string) {
  await settle(page);
  await smallScreenAssertions(page, screen);
  await dialogButtonsFit(page);
  const r: AuditResult = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  if (SHOTS && SHOT_SIZES.includes(v.name) && /-(en|pt)-/.test(`${combo}-`)) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: `${SHOTS}/tracks--${combo}--${screen}.png` });
  }
  const where = `${combo} ${screen}`;
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
}

/** Answer the check (right first time) until a question whose prompt matches; returns its options. */
async function untilQuestion(page: Page, lang: Lang, key: Key, prompt: RegExp) {
  for (let guard = 0; guard < 8; guard++) {
    const pos = (await page.getByTestId('check-position').textContent())!.trim();
    const text = (await page.getByTestId('check-prompt').textContent())!.trim();
    const answers = page.getByTestId('check-answers');
    if (await answers.count()) {
      const labels = await answers.locator('button').evaluateAll((bs) => bs.map((b) => b.getAttribute('data-answer') ?? ''));
      const right = key.choice.get(`${text}|${[...labels].sort().join('§')}`);
      expect(right, `answer for "${text}"`).toBeTruthy();
      if (prompt.test(text)) return { right: right!, wrong: labels.find((l) => l !== right)! };
      await answers.locator(`button[data-answer="${right!.replace(/"/g, '\\"')}"]`).click();
      await page.getByRole('button', { name: W[lang].submit, exact: true }).click();
    } else {
      for (const pc of key.build.get(text) ?? []) {
        const k = page.locator(`[data-piano-key][data-midi="${60 + pc}"]:visible`).first();
        await k.scrollIntoViewIfNeeded();
        const box = (await k.boundingBox())!;
        await k.click({ position: { x: box.width / 2, y: box.height * 0.8 } });
      }
      await page.getByRole('button', { name: W[lang].build, exact: true }).click();
    }
    await page.getByRole('button', { name: W[lang].cont, exact: true }).click();
    await expect(page.getByTestId('check-position')).not.toHaveText(pos);
  }
  throw new Error(`no question matching ${prompt}`);
}

/** Open a track lesson from the overview: the card, then the lesson's row. */
async function openTrackLesson(page: Page, n: number) {
  await page.getByTestId('track-card-sound').click();
  await expect(page.getByTestId('track-page-sound')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('track-page-sound').getByRole('listitem').nth(n - 1).getByRole('button').click();
  await expect(page.getByTestId('inline-try-this').first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(500);
}

async function trackScreens(browser: Browser, v: Viewport, theme: string, lang: Lang, combo: string, full: boolean) {
  const key = answerKey(lang);
  const prompts = {
    higher: { en: /Which one is higher\?$/, pt: /Qual é a mais aguda\?$/, es: /¿Cuál es más aguda\?$/ }[lang],
    steps: { en: /How far apart are they\?$/, pt: /A que distância estão\?$/, es: /¿A qué distancia están\?$/ }[lang],
    scale: { en: /^Listen to this scale/, pt: /^Ouve esta escala/, es: /^Escucha esta escala/ }[lang],
  };
  // The newcomer's overview: "Start here" at the top.
  {
    const { context, page } = await open(browser, v, theme, lang, { learnerProfile: 'new' });
    await expect(page.getByTestId('tracks-start-here')).toBeVisible();
    await check(page, v, combo, 'overview-start-here');
    if (!full) {
      // Narrow PT / ES: the lesson and the closing card too.
      await openTrackLesson(page, 2);
      expect(await page.getByTestId('try-this-names').count()).toBe(4);
      await check(page, v, combo, 'lesson-2');
      await context.close();
      return;
    }
    // The track page.
    await page.getByTestId('track-card-sound').click();
    await expect(page.getByTestId('track-page-sound')).toBeVisible({ timeout: 15_000 });
    await check(page, v, combo, 'track-page');
    // Lesson 1, its first Try This open (names, no staff).
    await page.getByTestId('track-page-sound').getByRole('listitem').first().getByRole('button').click();
    await expect(page.getByTestId('try-this-names').first()).toBeVisible({ timeout: 15_000 });
    await check(page, v, combo, 'lesson-1');
    // Ear, written options: which is higher? — the question, then after a miss.
    await page.getByRole('button', { name: W[lang].start }).click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    const q = await untilQuestion(page, lang, key, prompts.higher);
    await check(page, v, combo, 'check-ear-higher');
    await page.getByTestId('check-answers').locator(`button[data-answer="${q.wrong}"]`).click();
    await page.getByRole('button', { name: W[lang].submit, exact: true }).click();
    await page.waitForTimeout(300);
    await check(page, v, combo, 'check-ear-higher-nudge');
    await context.close();
  }
  // Ear, written options: half or whole step; an ear scale with written options.
  {
    const { context, page } = await open(browser, v, theme, lang, { learnerProfile: 'new' });
    await openTrackLesson(page, 3);
    await page.getByRole('button', { name: W[lang].start }).click();
    await untilQuestion(page, lang, key, prompts.steps);
    await check(page, v, combo, 'check-ear-steps');
    await context.close();
  }
  {
    const { context, page } = await open(browser, v, theme, lang, { learnerProfile: 'new' });
    await openTrackLesson(page, 4);
    await page.getByRole('button', { name: W[lang].start }).click();
    await untilQuestion(page, lang, key, prompts.scale);
    await check(page, v, combo, 'check-ear-scale');
    await context.close();
  }
  // The closing card (lesson 5), and the owner's overview: "Other ways in" below the grid.
  {
    const { context, page } = await open(browser, v, theme, lang);
    const other = page.getByTestId('tracks-other');
    await other.scrollIntoViewIfNeeded();
    await check(page, v, combo, 'overview-other-ways');
    await openTrackLesson(page, 5);
    await expect(page.getByRole('heading', { level: 1, name: W[lang].lesson5 })).toBeAttached();
    await page.getByTestId('track-ending').scrollIntoViewIfNeeded();
    await check(page, v, combo, 'closing-card');
    await context.close();
  }
}

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    const combo = `${v.name}-en-${th.name}`;
    test(`${combo}: track screens pass the design rules`, async ({ browser }) => {
      test.setTimeout(240_000);
      await trackScreens(browser, v, th.mode, 'en', combo, true);
    });
  }
}

// PT for the screenshots (and its own audit) at the three screenshot sizes, day and night.
for (const v of VIEWPORTS.filter((x) => SHOT_SIZES.includes(x.name))) {
  for (const th of THEMES) {
    const combo = `${v.name}-pt-${th.name}`;
    test(`${combo}: track screens in Portuguese pass the design rules`, async ({ browser }) => {
      test.setTimeout(240_000);
      await trackScreens(browser, v, th.mode, 'pt', combo, true);
    });
  }
}

for (const v of NARROW) {
  for (const lang of ['pt', 'es'] as const) {
    const combo = `${v.name}-${lang}-day`;
    test(`${combo}: the overview and a sound lesson fit`, async ({ browser }) => {
      test.setTimeout(120_000);
      await trackScreens(browser, v, 'fermata', lang, combo, false);
    });
  }
}

// The player hint's lesson link (wave 2) shows only once the chords track's
// lesson 1 exists — not in this branch. Simulated here through the dev
// server's own module (its eager set gains 'l1u35m1'), so the hint is
// measured WITH the link: it must still fit at 320×568 in PT (and ES), above
// the instrument, under the top bar, and pass the design rules.
for (const lang of ['pt', 'es'] as const) {
  test(`phone-320-${lang}: the player hint with its lesson link fits`, async ({ browser }) => {
    const v = NARROW[0];
    const context = await browser.newContext({ viewport: v.viewport, isMobile: true, hasTouch: true, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.addInitScript(([blob]) => {
      if (sessionStorage.getItem('__seeded')) return;
      localStorage.clear();
      localStorage.setItem('fermata-welcome-v1', 'seen');
      localStorage.setItem('music-theory-app', blob);
      sessionStorage.setItem('__seeded', '1');
    }, [JSON.stringify({ state: { themeMode: 'fermata', language: lang, lastView: 'explore', instrument: 'guitar', learnerProfile: 'player', startHint: 'player', showSolfege: true, neckNutSide: 'left', neckTopString: 'high' }, version: 6 })] as const);
    const page = await context.newPage();
    await page.goto('/');
    const hint = page.getByTestId('start-hint');
    await expect(hint).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('start-hint-lesson')).toHaveCount(0);
    await page.evaluate(async () => {
      const tracks = await import(/* @vite-ignore */ '/src/data/tracks.ts' as string);
      (tracks.WRITTEN_TRACK_LESSONS as Set<string>).add('l1u35m1');
      // Re-render the hint (what is SHOWN; nothing owed changes).
      const { useStartHintStore } = await import(/* @vite-ignore */ '/src/state/startHint.ts' as string);
      useStartHintStore.setState({ shown: null });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      useStartHintStore.setState({ shown: 'player' });
    });
    await expect(page.getByTestId('start-hint-lesson')).toHaveText(lang === 'pt' ? 'Teoria a partir dos acordes que conheces: lição 1 →' : 'Teoría desde los acordes que conoces: lección 1 →');
    const box = async (sel: string) => (await page.locator(sel).first().boundingBox())!;
    const h = await box('[data-testid="start-hint"]');
    const top = await box('.app-topbar');
    const dock = await box('[data-testid="instrument-dock"]');
    expect(h.y).toBeGreaterThanOrEqual(top.y + top.height - 1);
    expect(h.y + h.height).toBeLessThanOrEqual(dock.y + 1);
    await check(page, v, `phone-320-${lang}-day`, 'player-hint-with-link');
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/tracks--phone-320-${lang}-day--player-hint-with-link.png` });
    await context.close();
  });
}
