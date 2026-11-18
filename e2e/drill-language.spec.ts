import { test, expect, type Page } from '@playwright/test';

/**
 * Portuguese and Spanish Drill without English (audit A12, 2026-11-18): a
 * short session, saved as the old release would have left it, is answered by
 * the TRANSLATED chips and graded right (the chips submit the bank's English
 * values, the learner reads the translation); interval names, seventh-chord
 * names and the explanation clauses read in the learner's language; nothing
 * overflows at 320 px.
 */

const QUEUE = [
  'interval:pair-to-name:C:E',
  'function:chord-function:G:ii',
  'seventh:notes-to-name:C#:half_diminished7',
  'interval:semitones-to-name:6',
  'interval:note-above:F#:M3',
];
const FAMILIES = { keysig: true, circle: true, scale: true, degree: true, interval: true, triad: true, seventh: true, roman: true, function: true, read: false };
const CARD = { due: 0, stability: 5, difficulty: 5, elapsed_days: 0, scheduled_days: 5, reps: 3, lapses: 0, state: 2, learning_steps: 0 };

function drillSave() {
  return {
    state: {
      items: Object.fromEntries(QUEUE.map((id) => [id, { card: CARD, history: [], tier: 'review', introCorrectCount: 1 }])),
      settings: { length: 12, newPerSession: 12, families: FAMILIES, sound: false, showTimer: false, followLessons: false },
      sprintBests: {},
      lifetime: { answered: 0, correct: 0 },
      activeSession: { id: 's1', queue: QUEUE, index: 0, asked: 0, correct: 0, startedAt: 1_000, seed: 7, missRequeues: {} },
      sprint: null,
      introDone: true,
    },
    version: 3,
  };
}

async function openDrill(page: Page, language: 'pt' | 'es') {
  await page.addInitScript(([lang, drill]) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { lastView: 'drill', language: lang }, version: 6 }));
    localStorage.setItem('fermata-drill-v1', drill);
    sessionStorage.setItem('__seeded', '1');
  }, [language, JSON.stringify(drillSave())] as const);
  await page.goto('/');
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const savedSession = (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('fermata-drill-v1')!).state.activeSession as { correct: number; asked: number });

const CASES = {
  pt: {
    q1: 'De C até E é que intervalo?', c1: ['3.ª menor', '2.ª maior', '3.ª maior', '4.ª perfeita'], a1: '3.ª maior', right: 'Correto',
    q2: 'Em G maior, A menor (ii) funciona como…?', wrong2: 'Dominante',
    verdict2: 'Não é bem isso — Subdominante (pré-dominante)',
    why2: 'A menor puxa para longe da tónica — cria tensão em direção a V — é essa a sua função harmónica.',
    cont: 'Continuar', q3: 'E – B – C♯ – G — que acorde é este?', quality: 'Meio-diminuto',
    q4: 'Que intervalo tem 6 meios-tons?', a4: 'Trítono', a2: 'Subdominante (pré-dominante)',
    q5: 'Uma 3.ª maior acima de F♯?',
  },
  es: {
    q1: 'De C hasta E ¿es qué intervalo?', c1: ['3.ª menor', '2.ª mayor', '3.ª mayor', '4.ª justa'], a1: '3.ª mayor', right: 'Correcto',
    q2: 'En G mayor, ¿qué función tiene A menor (ii)?', wrong2: 'Dominante',
    verdict2: 'Incorrecto — Subdominante (predominante)',
    why2: 'A menor tira lejos de la tónica — crea tensión hacia V — esa es su función armónica.',
    cont: 'Continuar', q3: 'E – B – C♯ – G — ¿qué acorde es este?', quality: 'Semidisminuido',
    q4: '¿Qué intervalo tiene 6 semitonos?', a4: 'Tritono', a2: 'Subdominante (predominante)',
    q5: '¿Una 3.ª mayor por encima de F♯?',
  },
} as const;

for (const lang of ['pt', 'es'] as const) {
  test(`${lang.toUpperCase()}: a short session answered by the translated chips is graded right`, async ({ page }) => {
    const c = CASES[lang];
    await openDrill(page, lang);
    const panel = page.locator('#drill-panel');
    const prompt = panel.locator('p.text-xl').first();
    const answers = panel.getByTestId('drill-answers');

    await expect(prompt).toHaveText(c.q1, { timeout: 15_000 });
    await expect(answers.getByRole('button')).toHaveText([...c.c1]);
    await answers.getByRole('button', { name: c.a1, exact: true }).click();
    await expect(panel.getByText(c.right, { exact: true })).toBeVisible();

    // A wrong answer: the verdict names the right one, the explanation reads in the learner's language.
    await expect(prompt).toHaveText(c.q2);
    await answers.getByRole('button', { name: c.wrong2, exact: true }).click();
    await expect(panel.getByText(c.verdict2)).toBeVisible();
    await expect(panel.getByText(c.why2)).toBeVisible();
    await expect(panel).not.toContainText(/home|creates|toward|Major|Minor|Perfect/);
    await panel.getByRole('button', { name: c.cont, exact: true }).click();

    await expect(prompt).toHaveText(c.q3);
    await answers.getByRole('button', { name: 'C♯', exact: true }).click();
    await answers.getByRole('button', { name: c.quality, exact: true }).click();
    await expect(panel.getByText(c.right, { exact: true })).toBeVisible();

    await expect(prompt).toHaveText(c.q4);
    await answers.getByRole('button', { name: c.a4, exact: true }).click();
    await expect(panel.getByText(c.right, { exact: true })).toBeVisible();

    // The note-above question and the missed function item (requeued), in the order the session gives them.
    const seen: string[] = [];
    for (let i = 0; i < 2; i++) {
      await expect(prompt).toHaveText(new RegExp(`^(${escape(c.q2)}|${escape(c.q5)})$`));
      const text = (await prompt.textContent())!;
      expect(seen).not.toContain(text);
      seen.push(text);
      await answers.getByRole('button', { name: text === c.q5 ? 'A♯' : c.a2, exact: true }).click();
      await expect(panel.getByText(c.right, { exact: true })).toBeVisible();
      await expect(panel.getByText(c.right, { exact: true })).toHaveCount(0); // moves on by itself
    }

    await expect.poll(() => savedSession(page)).toMatchObject({ asked: 6, correct: 5 });
  });

  test(`${lang.toUpperCase()}: the translated verdict and explanation fit at 320 px`, async ({ page }) => {
    const c = CASES[lang];
    await page.setViewportSize({ width: 320, height: 740 });
    await openDrill(page, lang);
    const panel = page.locator('#drill-panel');
    await expect(panel.locator('p.text-xl').first()).toHaveText(c.q1, { timeout: 15_000 });
    await panel.getByTestId('drill-answers').getByRole('button', { name: c.a1, exact: true }).click();
    await expect(panel.locator('p.text-xl').first()).toHaveText(c.q2);
    await panel.getByTestId('drill-answers').getByRole('button', { name: c.wrong2, exact: true }).click();
    await expect(panel.getByText(c.why2)).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBe(0);
  });
}
