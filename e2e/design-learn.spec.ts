import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';

/**
 * The design-system rules (W11-A, e2e/design-system.spec.ts) on W4b's new
 * Learn screens: the lesson with its section rail (laptop) or section picker
 * and its sheet (phone, tablet, landscape), a Try This shown on the
 * instrument, the focused check (a question, the hint state after a miss, a
 * right answer), a melody item, a rhythm item, the result screen, the unlock
 * dialog and a unit milestone — phone 390×844, landscape 844×390, tablet
 * 768×1024 (touch) and laptop 1440×900 (mouse), day and night; PT at 390 px.
 * On every screen: type ≥ 12 px, targets ≥ 44 / 36 px, contrast, no sideways
 * scroll, nothing cut off (e2e/helpers/designAudit.ts). And: a toast raised
 * during the check never covers the answers, and nothing moves.
 *
 * DESIGN_AUDIT_OUT=<dir> also writes each screen's audit and a screenshot.
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
type Viewport = (typeof VIEWPORTS)[number];
const OUT = process.env.DESIGN_AUDIT_OUT;

const WORDS = {
  en: { start: 'Start the check', submit: 'Submit', cont: 'Continue', show: 'Show on the piano', unlock: 'Unlock anyway', staff: 'The Staff and Clefs', values: 'Note Values and Rests', dictation: 'Melodic Dictation: Diatonic', chromatic: 'The Chromatic Scale', level3: 'Harmony Foundations' },
  pt: { start: 'Começar a verificação', submit: 'Enviar', cont: 'Continuar', show: 'Mostrar no piano', unlock: 'Desbloquear mesmo assim', staff: 'A Pauta e as Claves', values: 'Figuras Rítmicas e Pausas', dictation: 'Ditado Melódico: Diatónico', chromatic: 'A Escala Cromática', level3: 'Fundamentos de Harmonia' },
} as const;
type Lang = keyof typeof WORDS;

async function open(browser: Browser, v: Viewport, theme: string, lang: Lang, progress?: object) {
  const context = await browser.newContext({ viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(([blob, prog]) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('music-theory-app', blob);
    if (prog) localStorage.setItem('music-theory-progress', prog);
    sessionStorage.setItem('__seeded', '1');
  }, [JSON.stringify({ state: { themeMode: theme, language: lang, lastView: 'learn', instrument: 'piano' }, version: 6 }), progress ? JSON.stringify(progress) : ''] as const);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(1000);
  return { context, page };
}

async function check(page: Page, v: Viewport, combo: string, screen: string) {
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
  await dialog.getByRole('button', { name: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(700);
}

async function startCheck(page: Page, lang: Lang) {
  const start = page.getByRole('button', { name: WORDS[lang].start });
  await start.scrollIntoViewIfNeeded();
  await start.click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  await page.waitForTimeout(400);
}

/** Miss the current question twice (or once, for two options) and move on. */
async function skipQuestion(page: Page, lang: Lang) {
  const answers = page.getByTestId('check-answers');
  for (let i = 0; i < 2 && !(await answers.locator('[data-state="answer"]').count()); i++) {
    await answers.locator('button[data-state="open"]').last().click();
    await page.getByRole('button', { name: WORDS[lang].submit }).click();
    await page.waitForTimeout(250);
  }
  await page.getByRole('button', { name: WORDS[lang].cont }).click();
  await page.waitForTimeout(250);
}

const isSheet = (v: Viewport) => v.viewport.width < 640 || v.viewport.height <= 500;

// A unit one lesson from done (L1 unit 1), its last lesson's tasks ticked and check passed.
const unitEndProgress = () => ({
  state: { progress: { completedModules: ['l1u1m1', 'l1u1m2', 'l1u1m3'], moduleProgress: { l1u1m4: ['l1u1m4t1', 'l1u1m4t2'] }, exerciseResults: { l1u1m4: { scores: {}, totalAttempts: 1, lastAttemptAt: Date.now(), passed: true } }, reviewSchedules: {} } },
  version: 2,
});

async function learnScreens(browser: Browser, v: Viewport, theme: string, combo: string, lang: Lang) {
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

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo}: W4b Learn screens pass the design rules`, async ({ browser }) => {
      test.setTimeout(240_000);
      await learnScreens(browser, v, th.mode, combo, 'en');
      expect(isSheet(v) || v.viewport.width >= 768).toBe(true);
    });
  }
}

test('phone-pt-day: W4b Learn screens in Portuguese pass the design rules', async ({ browser }) => {
  test.setTimeout(240_000);
  await learnScreens(browser, VIEWPORTS[0], 'fermata', 'phone-pt-day', 'pt');
});
