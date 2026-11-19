import { smallScreenAssertions, dialogButtonsFit } from './smallScreenAssertions';
import { expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './designAudit';

/**
 * The design-system rules (W11-A, e2e/design-system.spec.ts) on W4b's new
 * Learn screens: the lesson with its section rail (laptop) or section picker
 * and its sheet (phone, tablet, landscape), a Try This shown on the
 * instrument, the focused check (a question, the hint state after a miss, a
 * right answer), a melody item, a rhythm item, the result screen, the unlock
 * dialog and a unit milestone — phone 390×844, landscape 844×390, tablet
 * 768×1024 (touch) and laptop 1440×900 (mouse), day and night; PT and ES at 390 px.
 * On every screen: type ≥ 12 px, targets ≥ 44 / 36 px, contrast, no sideways
 * scroll, nothing cut off (e2e/helpers/designAudit.ts). And: a toast raised
 * during the check never covers the answers, and nothing moves.
 *
 * DESIGN_AUDIT_OUT=<dir> also writes each screen's audit and a screenshot.
 */

export const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'phone-landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
  { name: 'phone-landscape-small', viewport: { width: 740, height: 360 }, touch: true },
] as const;
export const THEMES = [
  { name: 'day', mode: 'fermata' },
  { name: 'night', mode: 'fermata-night' },
] as const;
type Viewport = { readonly name: string; readonly viewport: { readonly width: number; readonly height: number }; readonly touch: boolean };
const OUT = process.env.DESIGN_AUDIT_OUT;

const WORDS = {
  en: { exit: 'Exit the check', minor: 'Natural Minor Scale', pattern: 'W-H-W-W-H-W-W', pointer: 'Look again at', build: 'Check Answer', start: 'Start the check', submit: 'Submit', cont: 'Continue', show: 'Show on the piano', unlock: 'Unlock anyway', staff: 'The Staff and Clefs', values: 'Note Values and Rests', dictation: 'Melodic Dictation: Diatonic', chromatic: 'The Chromatic Scale', level3: 'Harmony Foundations' },
  pt: { exit: 'Sair da verificação', minor: 'Escala menor natural', pattern: 'T-mT-T-T-mT-T-T', pointer: 'Volta a ver', build: 'Verificar resposta', start: 'Começar a verificação', submit: 'Enviar', cont: 'Continuar', show: 'Mostrar no piano', unlock: 'Desbloquear mesmo assim', staff: 'A pauta e as claves', values: 'Figuras rítmicas e pausas', dictation: 'Ditado melódico: diatónico', chromatic: 'A escala cromática', level3: 'Fundamentos de harmonia' },
  es: { exit: 'Salir de la comprobación', minor: 'Escala menor natural', pattern: 'T-S-T-T-S-T-T', pointer: 'Vuelve a mirar', build: 'Comprobar respuesta', start: 'Empezar la comprobación', submit: 'Enviar', cont: 'Continuar', show: 'Mostrar en el piano', unlock: 'Desbloquear de todos modos', staff: 'El pentagrama y las claves', values: 'Figuras rítmicas y silencios', dictation: 'Dictado melódico: diatónico', chromatic: 'La escala cromática', level3: 'Fundamentos de armonía' },
} as const;
type Lang = keyof typeof WORDS;

async function open(browser: Browser, v: Viewport, theme: string, lang: Lang, progress?: object, extra: Record<string, string> = {}) {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(([blob, prog, more]) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('music-theory-app', blob);
    if (prog) localStorage.setItem('music-theory-progress', prog);
    for (const [k, val] of Object.entries(JSON.parse(more) as Record<string, string>)) localStorage.setItem(k, val);
    sessionStorage.setItem('__seeded', '1');
  }, [JSON.stringify({ state: { themeMode: theme, language: lang, lastView: 'learn', instrument: 'piano' }, version: 6 }), progress ? JSON.stringify(progress) : '', JSON.stringify(extra)] as const);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(1000);
  return { context, page };
}

async function check(page: Page, v: Viewport, combo: string, screen: string) {
  await smallScreenAssertions(page, screen);
  await dialogButtonsFit(page);
  const r: AuditResult = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  if (OUT) {
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: `${OUT}/${combo}--${screen}.png` });
    fs.appendFileSync(`${OUT}/results.jsonl`, JSON.stringify({ combo, screen, fontViolations: r.fontViolations.length, tapViolations: r.tapViolations.length, contrastViolations: r.contrastViolations.length, clipViolations: r.clipViolations.length, hScroll: r.hScroll.scrollWidth > r.hScroll.clientWidth + 1, exempt: r.exempt, textNodes: r.textNodes }) + '\n');
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

async function openLesson(page: Page, title: string) {
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog').filter({ has: page.locator('input') });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill(title);
  // QuickSearch appends the localized result type; a scale can share the title.
  // Its results are listbox options since the 2026-11-18 audit (A14).
  await dialog.getByRole('option', { name: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(Lesson|Lição|Lección)$`) }).click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(700);
}

/**
 * Start the lesson's check. Each screen is audited from a known state: a run
 * left with an answer in it would be KEPT (the Back stream, 19 November 2026),
 * and starting another lesson's check then asks first (the choice, audited on
 * its own below) — so a sweep leaves every run as a learner would (✕ Exit,
 * `exitCheck`) before it starts the next, and stops here if it did not.
 */
async function startCheck(page: Page, lang: Lang) {
  const start = page.getByRole('button', { name: WORDS[lang].start });
  await start.scrollIntoViewIfNeeded();
  await start.click();
  await expect(page.getByTestId('focused-check').or(page.getByTestId('kept-choice'))).toBeVisible();
  await expect(page.getByTestId('kept-choice'), 'an earlier run is still kept: leave it (exitCheck) before starting another').toHaveCount(0);
  await page.waitForTimeout(400);
}

/** Leave the check as a learner does, by its ✕: the run ends (nothing kept), the lesson shows. */
export async function exitCheck(page: Page, lang: Lang) {
  await page.getByRole('button', { name: WORDS[lang].exit, exact: true }).click();
  await expect(page.getByTestId('focused-check')).toHaveCount(0);
}

/** Miss the current question twice (or once, for two options) and move on. */
async function skipQuestion(page: Page, lang: Lang) {
  const answers = page.getByTestId('check-answers');
  if (!(await answers.count())) {
    const submit = page.getByRole('button', { name: WORDS[lang].build, exact: true });
    const cont = page.getByRole('button', { name: WORDS[lang].cont, exact: true });
    for (let attempt = 0; attempt < 2 && !(await cont.count()); attempt++) {
      if (await submit.isDisabled()) {
        const key = page.locator('[data-piano-key][aria-label="C4"]:visible').first();
        const box = (await key.boundingBox())!;
        await key.click({ position: { x: box.width / 2, y: box.height * 0.85 } });
      }
      await submit.click();
    }
    await cont.click();
    return;
  }
  for (let i = 0; i < 2 && !(await answers.locator('[data-state="answer"]').count()); i++) {
    await answers.locator('button[data-state="open"]').last().click();
    await page.getByRole('button', { name: WORDS[lang].submit }).click();
    await page.waitForTimeout(250);
  }
  await page.getByRole('button', { name: WORDS[lang].cont }).click();
  await page.waitForTimeout(250);
}

export const isSheet = (v: Viewport) => v.viewport.width < 640 || v.viewport.height <= 500;

// A unit one lesson from done (L1 unit 1), its last lesson's tasks ticked and check passed.
const unitEndProgress = () => ({
  state: { progress: { completedModules: ['l1u1m1', 'l1u1m2', 'l1u1m3'], moduleProgress: { l1u1m4: ['l1u1m4t1', 'l1u1m4t2'] }, exerciseResults: { l1u1m4: { scores: {}, totalAttempts: 1, lastAttemptAt: Date.now(), passed: true } }, reviewSchedules: {} } },
  version: 2,
});

export async function learnScreens(browser: Browser, v: Viewport, theme: string, combo: string, lang: Lang) {
  const w = WORDS[lang];
  // Lesson: rail or picker (+ its sheet), a Try This shown on the instrument.
  {
    const { context, page } = await open(browser, v, theme, lang);
    await openLesson(page, w.staff);
    if (v.viewport.width >= 1024) {
      await expect(page.getByTestId('section-rail')).toBeVisible();
      await check(page, v, combo, 'lesson-rail');
    } else {
      await expect(page.getByTestId('section-picker')).toBeVisible();
      await check(page, v, combo, 'lesson-picker');
      await page.getByTestId('section-picker').locator('button[aria-haspopup="dialog"]').click();
      await expect(page.getByTestId('section-sheet')).toBeVisible();
      await page.waitForTimeout(300);
      await check(page, v, combo, 'lesson-section-sheet');
      await page.keyboard.press('Escape');
    }
    const tryThis = page.locator('[data-section="c0"] [data-testid="inline-try-this"]');
    await tryThis.scrollIntoViewIfNeeded();
    await tryThis.getByRole('button', { name: w.show }).click();
    await page.waitForTimeout(500);
    await check(page, v, combo, 'lesson-try-this-shown');

    // The check: a question, the hint state after a miss, then the result.
    await startCheck(page, lang);
    await check(page, v, combo, 'check-question');
    const answers = page.getByTestId('check-answers');
    let hinted = false;
    for (let i = 0; i < 12 && !hinted; i++) {
      await answers.locator('button[data-state="open"]').last().click();
      await page.getByRole('button', { name: w.submit }).click();
      await page.waitForTimeout(300);
      if ((await answers.locator('[data-state="tried"]').count()) && !(await answers.locator('[data-state="answer"]').count())) {
        hinted = true;
        await check(page, v, combo, 'check-hint');
        // A toast during the check: it stays off the answers and nothing moves.
        const before = await page.getByTestId('check-answer-zone').boundingBox();
        const raised = await page.evaluate(`(async () => {
          try { const m = await import('/src/state/toastStore.ts'); m.toast('A long message that wraps onto two lines on a phone, raised during the check', 'info'); return true; } catch { return false; }
        })()`);
        if (raised) {
          const toast = page.locator('.toast-card').first();
          await expect(toast).toBeVisible();
          await page.waitForTimeout(400); // settled
          // Its Dismiss button is a full tap target (44 px on touch, 36 with a mouse).
          const tap = v.touch ? 44 : 36;
          const dismiss = (await toast.getByRole('button').first().boundingBox())!;
          expect.soft(Math.min(dismiss.width, dismiss.height), `${combo}: toast Dismiss ${dismiss.width}×${dismiss.height} < ${tap}`).toBeGreaterThanOrEqual(tap - 0.5);
          const t = (await toast.boundingBox())!;
          // The answers and Submit (the verdict above them may be covered for a moment, as in Drill).
          const thumb = (await page.getByTestId('check-answer-zone').boundingBox())!;
          expect.soft(t.y + t.height <= thumb.y + 0.5 || t.y >= thumb.y + thumb.height, `${combo}: the toast covers the answers ${JSON.stringify({ t, thumb })}`).toBe(true);
          expect.soft(Math.abs(thumb.y - before!.y), `${combo}: the answers moved under a toast`).toBeLessThan(2);
          // Dismissed before the next screen is audited.
          await toast.getByRole('button', { name: /^(Dismiss|Fechar|Cerrar|Close)$/ }).click();
          await expect(page.locator('.toast-card')).toHaveCount(0);
        }
      }
      if (!hinted) {
        if (!(await answers.locator('[data-state="answer"]').count())) {
          await answers.locator('button[data-state="open"]').first().click();
          await page.getByRole('button', { name: w.submit }).click();
        }
        await page.getByRole('button', { name: w.cont }).click();
        await page.waitForTimeout(250);
      }
    }
    expect(hinted, `${combo}: reached a first miss`).toBe(true);
    await answers.locator('button[data-state="open"]').first().click();
    await page.getByRole('button', { name: w.submit }).click();
    await page.waitForTimeout(300);
    await check(page, v, combo, 'check-final');
    await page.getByRole('button', { name: w.cont }).click();
    for (let i = 0; i < 20 && !(await page.getByTestId('check-result').count()); i++) await skipQuestion(page, lang);
    await expect(page.getByTestId('check-result')).toBeVisible();
    await page.waitForTimeout(300);
    await check(page, v, combo, 'check-result');
    await context.close();
  }
  // D-09: a pointer can name the section, but only a final item opens it.
  {
    // Natural Minor is in Level 2. Unlock it for this step in every language,
    // including the Spanish sweep in design-system.spec.ts.
    const { context, page } = await open(browser, v, theme, lang, {
      state: { progress: { completedModules: [], moduleProgress: {}, unlockedLevels: ['l2'] } },
      version: 2,
    });
    await openLesson(page, w.minor);
    await startCheck(page, lang);
    const target = page.getByTestId('check-answers').getByRole('button', { name: w.pattern, exact: true });
    for (let i = 0; i < 20 && !(await target.count()); i++) await skipQuestion(page, lang);
    await expect(target).toBeVisible();
    const position = await page.getByTestId('check-position').textContent();
    await page.getByTestId('check-answers').locator('button[data-state="open"]').filter({ hasNotText: w.pattern }).first().click();
    await page.getByRole('button', { name: w.submit, exact: true }).click();
    // The pointer names the section ("Look again at: 1 · …", or only its number
    // when the title would give the answer away) — never the answer.
    await expect(page.getByText(new RegExp(`^${w.pointer}`))).toBeVisible();
    await expect(page.getByTestId('check-reread-toggle')).toHaveCount(0);
    await expect(page.getByTestId('check-reread')).toHaveCount(0);
    await expect(page.locator('[data-state="answer"]')).toHaveCount(0);
    // Settle like every other step: under reduced motion every element keeps
    // a 0.01 ms transition (index.css), so the frame the state changes in can
    // still show the option's previous text colour.
    await page.waitForTimeout(300);
    await check(page, v, combo, 'check-pointer');
    await target.click();
    await page.getByRole('button', { name: w.submit, exact: true }).click();
    await page.getByTestId('check-reread-toggle').click();
    await expect(page.getByTestId('check-reread')).toBeVisible();
    await expect(page.getByTestId('check-reread')).toContainText(w.pattern);
    await expect(page.getByTestId('check-position')).toHaveText(position!);
    // The same settle as before 'check-pointer': on GitHub's Linux run of 19 November 2026 the audit read the
    // answer in the frame it turned final, still in the selected option's ink (#181208 on the night's #142b1a,
    // 1.24:1), and passed on retry.
    await page.waitForTimeout(300);
    await check(page, v, combo, 'check-final-reread-expanded');
    await page.reload();
    await expect(page.getByTestId('check-position')).toHaveText(position!);
    await expect(page.locator('[data-state="answer"]')).toHaveCount(1);
    await page.getByTestId('check-reread-toggle').click();
    await expect(page.getByTestId('check-reread')).toContainText(w.pattern);
    await context.close();
  }
  // A melody item (staves as answers, the reference line) and a rhythm item.
  {
    const { context, page } = await open(browser, v, theme, lang);
    await openLesson(page, w.dictation);
    await startCheck(page, lang);
    const melody = page.locator('[data-testid="check-answers"] button[aria-label^="Melod"]');
    for (let i = 0; i < 16 && !(await melody.count()); i++) await skipQuestion(page, lang);
    await expect(page.locator('[data-testid="check-answers"] svg').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('ear-reference')).toBeVisible();
    await page.waitForTimeout(800);
    await check(page, v, combo, 'check-melody');
    await exitCheck(page, lang);
    await openLesson(page, w.values);
    await page.locator('[data-section="c0"] [data-testid="rhythm-staff"] svg').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await check(page, v, combo, 'lesson-rhythm');
    await startCheck(page, lang);
    for (let i = 0; i < 10 && !(await page.locator('[data-testid="focused-check"] [data-testid="rhythm-staff"]').count()); i++) await skipQuestion(page, lang);
    await expect(page.locator('[data-testid="focused-check"] [data-testid="rhythm-staff"] svg')).toBeVisible();
    await check(page, v, combo, 'check-rhythm');
    await context.close();
  }
  // Unlock anyway (a locked level) and a unit milestone.
  {
    const { context, page } = await open(browser, v, theme, lang, unitEndProgress());
    await page.locator('#learn-panel [data-learn-screen]:not([inert])').getByRole('button').filter({ hasText: w.level3 }).filter({ has: page.locator('h3') }).first().click();
    await page.getByRole('button', { name: w.unlock }).click();
    await expect(page.getByTestId('unlock-dialog')).toBeVisible();
    await page.waitForTimeout(400);
    await check(page, v, combo, 'unlock-dialog');
    await page.keyboard.press('Escape');
    await openLesson(page, w.chromatic);
    const complete = page.getByTestId('check-card').getByRole('button').first();
    await complete.scrollIntoViewIfNeeded();
    await complete.click();
    await expect(page.getByTestId('milestone-sheet')).toBeVisible();
    await page.waitForTimeout(500);
    await check(page, v, combo, 'unit-milestone');
    await context.close();
  }
}

// ── What a check left under way says (the Back stream, 19 November 2026) ───────────────────────────

/** The longest lesson title in all three languages (curriculum l3u10m2; src/data/moduleTitles.*.ts). */
const LONG = {
  en: 'Forbidden Parallels and Voice Motion (in Common-Practice Style)',
  pt: 'Quintas e oitavas paralelas proibidas e movimento de vozes (no estilo da prática comum)',
  es: 'Quintas y octavas paralelas prohibidas y movimiento de voces (en el estilo de la práctica común)',
} as const;
const KEPT_WORDS = {
  en: { checkKept: /Your check is kept: question \d+ of \d+\./, cont: 'Continue', cancel: 'Cancel', sprintKept: 'Your Sprint is paused, with the time it had left.', endSession: 'End session' },
  pt: { checkKept: /A tua verificação ficou guardada: pergunta \d+ de \d+\./, cont: 'Continuar', cancel: 'Cancelar', sprintKept: 'O teu sprint está em pausa, com o tempo que lhe restava.', endSession: 'Terminar sessão' },
  es: { checkKept: /Tu comprobación se ha guardado: pregunta \d+ de \d+\./, cont: 'Continuar', cancel: 'Cancelar', sprintKept: 'Tu sprint está en pausa, con el tiempo que le quedaba.', endSession: 'Terminar sesión' },
} as const;

/** A run kept by Back, as the Learn session saves it (the shipped v1 fixture's run: question 2 of 3, one answer). */
function keptSession(kind: 'check' | 'review' | 'practice', lang: Lang): string {
  const check = {
    moduleId: 'l3u10m2', kind, lang, fingerprints: { l3u10m2e1: 'a', l3u10m2e2: 'b', l3u10m2e3: 'c' },
    run: { order: ['l3u10m2e2', 'l3u10m2e1', 'l3u10m2e3'], index: 1, scores: [1], items: [{ id: 'l3u10m2e2', answers: ['x'], score: 1, answer: 'x' }], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null },
    finished: false, at: Date.now(), away: true,
  };
  return JSON.stringify({ state: { screen: null, check }, version: 1 });
}

/**
 * Wait until nothing moves (design-system.spec.ts' own rule): no running Web
 * Animation, every opacity and transform the same for 300 ms, no entrance
 * waiting at an inline opacity of 0 — an audit mid fade-in reads blended text.
 */
async function settle(page: Page) {
  const snapshot = () => page.evaluate(() => {
    const running = document.getAnimations().filter((a) => a.playState === 'running' || a.pending).length;
    let sig = '';
    let waiting = 0;
    for (const el of Array.from(document.querySelectorAll('body *'))) {
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

/** The choice is on screen, its first button focused with a visible ring, its Cancel a full tap; then the audit. */
async function auditChoice(page: Page, v: Viewport, combo: string, screen: string, lang: Lang) {
  const choice = page.getByTestId('kept-choice');
  await expect(choice).toBeVisible();
  await expect(choice).toContainText(LONG[lang]);
  await expect(page.getByTestId('kept-back')).toBeFocused();
  // Reached from the keyboard, the focus is shown (:focus-visible draws the ring).
  expect.soft(await page.getByTestId('kept-back').evaluate((b) => b.matches(':focus-visible') && getComputedStyle(b).outlineStyle !== 'none'), `${combo} ${screen}: the first button's focus is not visible`).toBe(true);
  const tap = v.touch ? 44 : 36;
  for (const id of ['kept-back', 'kept-start', 'kept-cancel']) {
    const box = (await page.getByTestId(id).boundingBox())!;
    expect.soft(Math.min(box.width, box.height), `${combo} ${screen}: ${id} ${box.width}×${box.height} < ${tap}`).toBeGreaterThanOrEqual(tap - 0.5);
  }
  await expect(page.getByTestId('kept-cancel')).toHaveText(KEPT_WORDS[lang].cancel);
  await choice.scrollIntoViewIfNeeded();
  await settle(page);
  await check(page, v, combo, screen);
}

/** A toast that names what was kept, with Continue: on screen, its buttons full taps, then the audit. */
async function auditKeptToast(page: Page, v: Viewport, combo: string, screen: string, lang: Lang, text: string | RegExp) {
  const toast = page.locator('.toast-card').filter({ hasText: text });
  await expect(toast).toBeVisible();
  await expect(toast.getByRole('button', { name: KEPT_WORDS[lang].cont })).toBeVisible();
  await settle(page);
  const vp = page.viewportSize()!;
  const t = (await toast.boundingBox())!;
  expect.soft(t.y >= 0 && t.x >= 0 && t.y + t.height <= vp.height + 0.5 && t.x + t.width <= vp.width + 0.5, `${combo} ${screen}: the toast is on screen ${JSON.stringify(t)}`).toBe(true);
  const tap = v.touch ? 44 : 36;
  for (const b of await toast.getByRole('button').all()) {
    const box = (await b.boundingBox())!;
    expect.soft(Math.min(box.width, box.height), `${combo} ${screen}: toast button ${await b.textContent()} ${box.width}×${box.height}`).toBeGreaterThanOrEqual(tap - 0.5);
  }
  await check(page, v, combo, screen);
}

/**
 * The screens a check left under way brings (the Back stream, 19 November
 * 2026), none of which the sweeps above meet: the lesson card's "kept" line
 * with Continue; the choice before another check or a review would replace a
 * kept run — over a kept check, a kept practice round and a kept review, with
 * the longest lesson title there is; the "kept" toast (the active tab left a
 * check) and the "paused" toast (Back left a Sprint).
 */
export async function keptScreens(browser: Browser, v: Viewport, theme: string, combo: string, lang: Lang) {
  const w = WORDS[lang];
  // A real run of the long lesson's check, one answer given.
  {
    const { context, page } = await open(browser, v, theme, lang);
    await openLesson(page, LONG[lang]);
    await startCheck(page, lang);
    const answers = page.getByTestId('check-answers');
    if (await answers.count()) {
      await answers.locator('button[data-state="open"]').last().click();
      await page.getByRole('button', { name: w.submit }).click();
    } else {
      await skipQuestion(page, lang);
    }
    await page.waitForTimeout(400);
    // The active Learn tab leaves it: Learn's first screen, and the toast that says it is kept.
    await page.locator('[role="tab"][data-tab="learn"]').click();
    await auditKeptToast(page, v, combo, 'kept-toast-check', lang, KEPT_WORDS[lang].checkKept);
    await page.locator('.toast-card').getByRole('button').last().click().catch(() => undefined);
    // Its lesson again: the card's line, and Continue.
    await openLesson(page, LONG[lang]);
    await expect(page.getByTestId('check-kept')).toBeVisible();
    await expect(page.getByTestId('check-continue')).toBeVisible();
    await page.getByTestId('check-card').scrollIntoViewIfNeeded();
    await settle(page);
    await check(page, v, combo, 'kept-card');
    // Another lesson's check, started from the keyboard: the choice.
    await openLesson(page, w.values);
    const start = page.getByTestId('check-start');
    await start.scrollIntoViewIfNeeded();
    await start.focus();
    await page.keyboard.press('Enter');
    await auditChoice(page, v, combo, 'kept-choice-check', lang);
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('check-start')).toBeFocused();
    await context.close();
  }
  // A kept practice round, then a due review opened; a kept review, then a lesson's check.
  {
    const now = Date.now();
    const day = 86_400_000;
    const progress = { state: { progress: { completedModules: ['l1u2m1'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: { l1u2m1: { completedAt: now - 3 * day, nextReviewAt: now - day, intervalLevel: 0, reviewCount: 0, lastReviewedAt: now - 3 * day } } } }, version: 2 };
    const { context, page } = await open(browser, v, theme, lang, progress, { 'fermata-learn-session-v1': keptSession('practice', lang) });
    const row = page.locator('#learn-panel').getByRole('button', { name: new RegExp(w.values) }).first();
    await row.scrollIntoViewIfNeeded();
    await row.focus();
    await page.keyboard.press('Enter');
    await auditChoice(page, v, combo, 'kept-choice-review-over-practice', lang);
    await page.evaluate((raw) => localStorage.setItem('fermata-learn-session-v1', raw), keptSession('review', lang));
    await openLesson(page, w.values);
    const start = page.getByTestId('check-start');
    await start.scrollIntoViewIfNeeded();
    await start.focus();
    await page.keyboard.press('Enter');
    await auditChoice(page, v, combo, 'kept-choice-check-over-review', lang);
    await context.close();
  }
}

/** The "paused" toast: a Sprint left by Back. A real save, its facts known (review), so a Sprint can run. */
export async function pausedToast(browser: Browser, v: Viewport, theme: string, combo: string, lang: Lang, drillSave: string) {
  const { context, page } = await open(browser, v, theme, lang, undefined, { 'fermata-drill-v1': drillSave });
  await page.locator('[role="tab"][data-tab="drill"]').click();
  const panel = page.locator('#drill-panel');
  await panel.getByRole('button', { name: KEPT_WORDS[lang].endSession }).click();
  await panel.getByRole('button', { name: 'Sprint', exact: true }).click();
  await expect(panel.getByText(/^\d+s$/)).toBeVisible();
  await page.goBack();
  await auditKeptToast(page, v, combo, 'paused-toast-sprint', lang, KEPT_WORDS[lang].sprintKept);
  await context.close();
}
