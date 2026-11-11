import { test, expect, type Page } from '@playwright/test';
import { PHONE, LAPTOP, type View, freshBrowser, seededBrowser, savedState } from './helpers/wave1';
import { levelCorpus } from '../src/data/exercises/__tests__/learnCorpus';
import { buildChord } from '../src/core/constants/chords';
import { buildScale } from '../src/core/constants/scales';
import { getPitchClass } from '../src/core/constants/notes';
import type { Accidental, ChordQuality, NaturalNote, ScaleType } from '../src/core/types/music';
import { L1_UNITS } from '../src/core/constants/curriculumL1';
import ptCurriculumL1 from '../src/i18n/content/pt/curriculumL1';

/**
 * Wave 2, "Start with sound" end to end (phone 390×844 and laptop 1440×900,
 * English and Portuguese, the dev server):
 *  - a TRULY new visitor chooses Piano + "I'm new to music" and lands in
 *    lesson 1 of the track, its first Try This on screen and not under the
 *    dock: one tap on "Hear it" sounds it, its notes are written by name;
 *  - all five lessons, start to finish: the two tasks ticked, the check
 *    passed (every question answered by ear or on the piano; no staff in a
 *    lesson or a check), the lesson completed, "Next lesson" — and the last
 *    one ends on the closing card;
 *  - PT with Dó-Ré-Mi on (a door chosen in Portuguese turns it on): lesson 2
 *    gives the solfège names once, the Try This shows them beside the letters;
 *  - the owner (his v6 save, no profile) sees both track cards BELOW the
 *    level grid, under "Other ways in"; Level 1 still lists 4 units, 0/10;
 *  - wave 2, L2, "From the chords you know": a TRULY new visitor chooses
 *    Piano + "I play" and lands in Explore with the player hint; its link
 *    "Theory from the chords you know: lesson 1 →" opens lesson 1; all ten
 *    lessons, start to finish (tasks, every check right, the lesson
 *    completed, "Next lesson"; no staff in a lesson), the track's card and
 *    page show the progress, and lesson 10 ends on the closing card.
 *
 * The answer key is the app's own corpus, read in Node (prompt + options on
 * screen → the keyed answer; a build → its notes as pitch classes).
 */

test.use({ storageState: { cookies: [], origins: [] } });

const W = {
  en: {
    door: "I'm new to music", piano: 'Piano', learn: 'Learn', hear: 'Hear it', start: 'Start the check', submit: 'Submit', build: 'Check Answer', cont: 'Continue',
    complete: 'Complete the lesson', next: 'Next lesson', ending: 'Where next?', otherWays: 'Other ways in', track: 'Start with sound',
    lessons: ['High and Low', 'The Seven Letters', 'Half Steps and Whole Steps', 'A Scale Is a Ladder', 'Three Notes Make a Chord'],
  },
  pt: {
    door: 'A música é nova para mim', piano: 'Piano', learn: 'Aprender', hear: 'Ouvir', start: 'Começar a verificação', submit: 'Enviar', build: 'Verificar resposta', cont: 'Continuar',
    complete: 'Concluir a lição', next: 'Lição seguinte', ending: 'E agora?', otherWays: 'Outras formas de começar', track: 'Começa pelo som',
    lessons: ['Agudo e grave', 'As sete letras', 'Meios-tons e tons', 'Uma escala é uma escada', 'Três notas fazem um acorde'],
  },
} as const;
type Lang = keyof typeof W;

/** prompt|sorted options → the keyed answer; prompt → a build's pitch classes. */
function answerKey(lang: Lang, unit: 'l1u34' | 'l1u35' = 'l1u34') {
  const choice = new Map<string, string>();
  const build = new Map<string, number[]>();
  for (const { moduleId, exercise } of levelCorpus(1, lang)) {
    if (!moduleId.startsWith(unit)) continue;
    const c = exercise.config;
    const choices = c.type === 'multiple_choice' ? c.choices : c.type === 'ear_training' ? c.choices : undefined;
    if (choices) {
      choice.set(`${exercise.prompt}|${choices.map((x) => x.label).sort().join('§')}`, choices.find((x) => x.correct)!.label);
    } else if (c.type === 'chord_build' || c.type === 'scale_build') {
      const root = { natural: c.root as NaturalNote, accidental: (c.rootAccidental || '') as Accidental };
      const notes = c.type === 'chord_build' ? buildChord(root, c.quality as ChordQuality).notes : buildScale(root, c.scaleType as ScaleType).notes;
      build.set(exercise.prompt, [...new Set(notes.map(getPitchClass))]);
    } else {
      throw new Error(`${exercise.id}: a type the tracks must not use (${c.type})`);
    }
  }
  return { choice, build };
}

/**
 * The dev server serves the app's own modules (/src/…); the production build
 * does not. Never a silent skip on the dev server: only a build (the one that
 * serves the PWA manifest) may lack them (design-system.spec's rule).
 */
let devModules: boolean | undefined;
async function hasDevModules(page: Page) {
  if (devModules === undefined) {
    const res = await page.request.get('/src/core/services/audio.ts');
    devModules = res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
    if (!devModules) {
      const manifest = await page.request.get('/manifest.webmanifest');
      expect((manifest.headers()['content-type'] ?? '').includes('json'), 'dev server without /src modules?').toBe(true);
    }
  }
  if (!devModules) test.info().annotations.push({ type: 'note', description: 'the audio-clock check needs the dev server: skipped on this build' });
  return devModules;
}

/** VexFlow staves drawn inside an element (the known positive: any Level 1 lesson). */
const staves = (page: Page, scope: string) => page.locator(`${scope} svg .vf-stave, ${scope} svg.vf-stave, ${scope} [data-testid="rhythm-staff"], ${scope} .staff-skeleton`).count();

async function answerCheck(page: Page, lang: Lang, key: ReturnType<typeof answerKey>) {
  const w = W[lang];
  await page.getByRole('button', { name: w.start }).click();
  const check = page.getByTestId('focused-check');
  await expect(check).toBeVisible();
  for (;;) {
    const pos = (await page.getByTestId('check-position').textContent())!.trim();
    const [cur, total] = pos.split(/\s*\/\s*/).map(Number);
    // No staff in a sound-first check.
    expect(await staves(page, '[data-testid="focused-check"]')).toBe(0);
    const prompt = (await page.getByTestId('check-prompt').textContent())!.trim();
    const answers = page.getByTestId('check-answers');
    if (await answers.count()) {
      const labels = await answers.locator('button').evaluateAll((bs) => bs.map((b) => b.getAttribute('data-answer') ?? ''));
      const right = key.choice.get(`${prompt}|${[...labels].sort().join('§')}`);
      expect(right, `answer for "${prompt}"`).toBeTruthy();
      await answers.locator(`button[data-answer="${right!.replace(/"/g, '\\"')}"]`).click();
      await page.getByRole('button', { name: w.submit, exact: true }).click();
    } else {
      const pcs = key.build.get(prompt);
      expect(pcs, `build for "${prompt}"`).toBeTruthy();
      for (const pc of pcs!) {
        const k = page.locator(`[data-piano-key][data-midi="${60 + pc}"]:visible`).first();
        await k.scrollIntoViewIfNeeded();
        const box = (await k.boundingBox())!;
        // White keys: low on the key, below the black ones.
        await k.click({ position: { x: box.width / 2, y: box.height * 0.8 } });
      }
      await page.getByRole('button', { name: w.build, exact: true }).click();
    }
    await expect(page.getByTestId('check-pips').locator(`i:nth-child(${cur})`)).toHaveAttribute('data-score', '1');
    await page.getByRole('button', { name: w.cont, exact: true }).click();
    if (cur === total) break;
    await expect(page.getByTestId('check-position')).not.toHaveText(pos);
  }
}

for (const v of [PHONE, LAPTOP] as View[]) {
  for (const lang of ['en', 'pt'] as const) {
    test(`newcomer ${v.name} ${lang}: "new to music" → lesson 1 with its Try This one tap away → all five lessons and checks, no staff → the closing card`, async ({ browser }) => {
      test.setTimeout(300_000);
      const w = W[lang];
      const key = answerKey(lang);
      const { context, page } = await freshBrowser(browser, v, lang);
      await page.goto('/');
      const start = page.getByTestId('start-screen');
      await expect(start).toBeVisible({ timeout: 15_000 });
      await start.getByRole('radio', { name: w.piano }).click();
      await page.getByRole('button', { name: new RegExp(`^${w.door}`) }).click();
      await expect(page.getByRole('heading', { level: 1, name: w.lessons[0] })).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('tab', { name: w.learn })).toHaveAttribute('aria-selected', 'true');
      if (lang === 'pt') expect((await savedState(page)).showSolfege).toBe(true);

      // Lesson 1 opens with its first Try This on screen, above the dock: one tap to hear.
      await page.waitForTimeout(800);
      const first = page.getByTestId('inline-try-this').first();
      const hear = first.getByRole('button', { name: w.hear });
      const hb = (await hear.boundingBox())!;
      const dock = (await page.getByTestId('instrument-dock').boundingBox())!;
      expect(hb.y, 'Hear it is on screen').toBeGreaterThanOrEqual(0);
      expect(hb.y + hb.height, 'Hear it is above the dock').toBeLessThanOrEqual(dock.y + 1);
      await expect(first.getByTestId('try-this-names')).toBeVisible();
      await hear.click();
      // It sounds: the app's audio clock runs after that one tap (the dev server's own module;
      // the production build has no /src modules, so there this one step is skipped and noted —
      // integration, as design-system.spec does for its dev-only steps).
      if (await hasDevModules(page)) {
        await expect.poll(() => page.evaluate(async () => {
          const audio = await import(/* @vite-ignore */ '/src/core/services/audio.ts' as string);
          return audio.getAudioState();
        })).toBe('running');
      }

      for (let i = 0; i < 5; i++) {
        await expect(page.getByRole('heading', { level: 1, name: w.lessons[i] })).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(400);
        // No staff anywhere in the lesson; every Try This writes its notes.
        expect(await staves(page, '#learn-panel')).toBe(0);
        const tries = page.getByTestId('inline-try-this');
        expect(await tries.count()).toBe(4);
        expect(await page.getByTestId('try-this-names').count()).toBe(4);
        await expect(page.locator('[data-section="songs"]')).toHaveCount(0);
        // Breadcrumb: the track, not Level 1.
        const crumb = page.getByRole('navigation', { name: /breadcrumb|navegação/i }).first();
        await expect(crumb).toContainText(w.track);
        await expect(crumb).not.toContainText(lang === 'pt' ? 'Nível 1' : 'Level 1');
        // The two tasks.
        const tasks = page.locator('[data-section="tasks"] button[aria-pressed]');
        expect(await tasks.count()).toBe(2);
        for (let t = 0; t < 2; t++) await tasks.nth(t).click();
        await answerCheck(page, lang, key);
        await expect(page.getByTestId('result-score')).toHaveText(/^5 (of|de) 5$/);
        await page.getByRole('button', { name: w.complete }).click();
        await page.waitForTimeout(600);
        if (i < 4) {
          // (On a laptop the rail offers it too; the one under the lesson.)
          await page.getByRole('button', { name: new RegExp(`${w.next}\\s*${w.lessons[i + 1]}`) }).last().click();
        }
      }
      // The last lesson ends on the closing card, with no next lesson.
      const ending = page.getByTestId('track-ending');
      await ending.scrollIntoViewIfNeeded();
      await expect(ending.getByRole('heading', { level: 2, name: w.ending })).toBeVisible();
      await expect(page.getByRole('button', { name: new RegExp(`^${w.next}`) })).toHaveCount(0);
      const progress = JSON.parse((await page.evaluate(() => localStorage.getItem('music-theory-progress')))!).state.progress;
      expect(progress.completedModules).toEqual(['l1u34m1', 'l1u34m2', 'l1u34m3', 'l1u34m4', 'l1u34m5']);
      await context.close();
    });
  }
}

test('pt with Dó-Ré-Mi on: lesson 2 gives the solfège names once; the Try This shows them beside the letters', async ({ browser }) => {
  const { context, page } = await seededBrowser(browser, PHONE, { lastView: 'learn', language: 'pt', learnerProfile: 'new', showSolfege: true, instrument: 'piano' }, {}, { lang: 'pt' });
  await page.goto('/');
  await page.getByTestId('track-card-sound').click();
  await page.getByRole('button', { name: /As sete letras/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'As sete letras' })).toBeVisible({ timeout: 15_000 });
  const text = await page.locator('[data-section="c0"]').textContent();
  expect(text).toContain('C = Dó, D = Ré, E = Mi, F = Fá, G = Sol, A = Lá, B = Si');
  expect(text).toContain('Esta aplicação escreve as letras; nas Definições podes mostrar também Dó, Ré, Mi ao lado delas.');
  await expect(page.getByTestId('try-this-names').first()).toHaveText('A (Lá)B (Si)C (Dó)D (Ré)E (Mi)F (Fá)G (Sol)A (Lá)');
  await context.close();
});

test('the owner (his v6 save, no profile): the track card below the level grid, under "Other ways in"; Level 1 as on main', async ({ browser }) => {
  const { context, page } = await seededBrowser(browser, LAPTOP, { lastView: 'learn', language: 'en', themeMode: 'fermata', instrument: 'piano' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('tracks-start-here')).toHaveCount(0);
  const other = page.getByTestId('tracks-other');
  await expect(other.getByRole('heading', { level: 2, name: 'Other ways in' })).toBeVisible();
  const gridBottom = await page.getByText('Ear Training & Aural Skills').evaluate((e) => e.closest('button')!.getBoundingClientRect().bottom);
  const otherTop = (await other.boundingBox())!.y;
  expect(otherTop).toBeGreaterThan(gridBottom);
  await expect(other.getByTestId('track-card-sound')).toContainText('0 of 5 lessons');
  await expect(other.getByTestId('track-card-chords')).toContainText('0 of 10 lessons');
  expect((await other.getByTestId('track-card-chords').boundingBox())!.y).toBeGreaterThan((await other.getByTestId('track-card-sound').boundingBox())!.y);
  // Level 1: four units, 10 modules — the track is not part of it.
  await page.getByText('Foundations of Music Literacy').click();
  await expect(page.getByRole('heading', { level: 1, name: 'Foundations of Music Literacy' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('0/10')).toBeVisible();
  await expect(page.getByText('Start with sound')).toHaveCount(0);
  await expect(page.getByText('From the chords you know')).toHaveCount(0);
  expect(await savedState(page)).not.toHaveProperty('learnerProfile');
  await context.close();
});

test('the staff detector this spec relies on finds the staff in a Level 1 lesson (its known positive)', async ({ browser }) => {
  const { context, page } = await seededBrowser(browser, LAPTOP, { lastView: 'learn', language: 'en', instrument: 'piano' });
  await page.goto('/');
  await page.getByText('Foundations of Music Literacy').click();
  await page.getByText('Notation and Pitch').first().click();
  await page.getByText('The Staff and Clefs').first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'The Staff and Clefs' })).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => staves(page, '#learn-panel'), { timeout: 15_000 }).toBeGreaterThan(0);
  await expect(page.getByTestId('try-this-names')).toHaveCount(0);
  await context.close();
});

// ── Wave 2, L2: the player's journey through "From the chords you know" ──
const CHORDS = L1_UNITS.find((u) => u.id === 'u35')!;
const P = {
  en: {
    door: 'I play, but never learned theory', link: 'Theory from the chords you know: lesson 1 →', track: 'From the chords you know',
    titles: CHORDS.modules.map((m) => m.title), level: 'Level 1', progress: (n: number) => `${n} of 10 lessons`,
    end: ['Loop your own songs in the Progression panel', 'Go deeper: Level 2'],
  },
  pt: {
    door: 'Toco, mas nunca aprendi teoria', link: 'Teoria a partir dos acordes que conheces: lição 1 →', track: 'A partir dos acordes que conheces',
    titles: CHORDS.modules.map((m) => ptCurriculumL1.modules[m.id].title!), level: 'Nível 1', progress: (n: number) => `${n} de 10 lições`,
    end: ['Tocar em ciclo os acordes das tuas músicas no painel Progressão', 'Ir mais fundo: Nível 2'],
  },
} as const;

for (const v of [PHONE, LAPTOP] as View[]) {
  for (const lang of ['en', 'pt'] as const) {
    test(`player ${v.name} ${lang}: "I play" → Explore's hint → its link opens lesson 1 → all ten lessons and checks, no staff → the track's progress → the closing card`, async ({ browser }) => {
      test.setTimeout(600_000);
      const w = W[lang];
      const p = P[lang];
      const key = answerKey(lang, 'l1u35');
      const checks = new Map<string, number>();
      for (const { moduleId } of levelCorpus(1, lang)) if (moduleId.startsWith('l1u35')) checks.set(moduleId, (checks.get(moduleId) ?? 0) + 1);
      const { context, page } = await freshBrowser(browser, v, lang);
      await page.goto('/');
      const start = page.getByTestId('start-screen');
      await expect(start).toBeVisible({ timeout: 15_000 });
      await start.getByRole('radio', { name: w.piano }).click();
      await page.getByRole('button', { name: new RegExp(`^${p.door}`) }).click();
      // The player hint in Explore ends on its link into lesson 1.
      const hint = page.getByTestId('start-hint');
      await expect(hint).toBeVisible({ timeout: 15_000 });
      const link = hint.getByTestId('start-hint-lesson');
      await expect(link).toHaveText(p.link);
      await link.click();
      await expect(page.getByRole('heading', { level: 1, name: p.titles[0] })).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('tab', { name: w.learn })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByTestId('start-hint')).toHaveCount(0);

      for (let i = 0; i < 10; i++) {
        const mod = CHORDS.modules[i];
        await expect(page.getByRole('heading', { level: 1, name: p.titles[i] })).toBeVisible({ timeout: 15_000 });
        await page.waitForTimeout(400);
        // No staff anywhere in the lesson: chord lists show their chords, the rest note names.
        expect(await staves(page, '#learn-panel')).toBe(0);
        expect(await page.getByTestId('inline-try-this').count()).toBe(mod.concepts.length);
        const lists = mod.concepts.filter((c) => c.tryThisQuery.startsWith('chords:')).length;
        expect(await page.getByTestId('try-this-chords').count()).toBe(lists);
        expect(await page.getByTestId('try-this-names').count()).toBe(mod.concepts.length - lists);
        await expect(page.locator('[data-section="songs"]')).toHaveCount(0);
        const crumb = page.getByRole('navigation', { name: /breadcrumb|navegação/i }).first();
        await expect(crumb).toContainText(p.track);
        await expect(crumb).not.toContainText(p.level);
        const tasks = page.locator('[data-section="tasks"] button[aria-pressed]');
        expect(await tasks.count()).toBe(2);
        for (let t = 0; t < 2; t++) await tasks.nth(t).click();
        await answerCheck(page, lang, key);
        const n = checks.get(mod.id)!;
        await expect(page.getByTestId('result-score')).toHaveText(new RegExp(`^${n} (of|de) ${n}$`));
        await page.getByRole('button', { name: w.complete }).click();
        await page.waitForTimeout(600);
        if (i < 9) await page.getByRole('button', { name: new RegExp(`${w.next}\\s*${p.titles[i + 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }).last().click();
      }
      // Lesson 10 ends on the closing card, with no next lesson.
      const ending = page.getByTestId('track-ending');
      await ending.scrollIntoViewIfNeeded();
      await expect(ending.getByRole('heading', { level: 2, name: w.ending })).toBeVisible();
      await expect(ending.getByRole('button')).toHaveText([...p.end]);
      await expect(page.getByRole('button', { name: new RegExp(`^${w.next}`) })).toHaveCount(0);
      const progress = JSON.parse((await page.evaluate(() => localStorage.getItem('music-theory-progress')))!).state.progress;
      expect(progress.completedModules).toEqual(CHORDS.modules.map((m) => m.id));
      // The track's page and card show it all done.
      await page.getByRole('navigation', { name: /breadcrumb|navegação/i }).first().getByText(p.track).click();
      await expect(page.getByTestId('track-page-chords').getByTestId('track-progress')).toHaveText(p.progress(10), { timeout: 15_000 });
      await page.getByRole('navigation', { name: /breadcrumb|navegação/i }).first().getByText(w.learn).click();
      await expect(page.getByTestId('tracks-start-here').getByTestId('track-card-chords')).toContainText(p.progress(10), { timeout: 15_000 });
      await context.close();
    });
  }
}
