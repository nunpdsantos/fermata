import { test, expect, type Page } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { startDeployProxy, type DeployProxy } from './helpers/deployProxy';
import { seedWelcomeSeen } from './helpers/welcome';

/**
 * W9b — update robustness, in a real browser on the PRODUCTION build
 * (`vite preview`; skipped on the dev server, which has no service worker).
 * A deploy is played by a proxy (e2e/helpers/deployProxy.ts): new worker
 * bytes, optionally a new version.json, optionally the old build's /assets/
 * gone from the server.
 *
 *  1. A waiting update applies silently on a fresh start with nothing in
 *     progress — and says so afterwards.
 *  2. It is NEVER applied silently during a Drill session or a Sprint (a cold
 *     launch straight into one); the learner's Reload resumes it exactly.
 *  3. A critical update put off with "Later" applies at the next safe moment;
 *     its note shows in EN / PT / ES.
 *  4. A page left on the old build opens every lazily loaded view and level
 *     with the old build's files gone from the server.
 */

const NOTE = {
  en: 'E2E: a better circle of fifths.',
  pt: 'E2E: um ciclo de quintas melhor.',
  es: 'E2E: un círculo de quintas mejor.',
};
const nextRelease = (over: Record<string, unknown> = {}) => ({
  build: 'e2e000000000', date: '2026-11-02', release: 99, critical: false, criticalSince: 0, notes: NOTE, ...over,
});

const DRILL_KEY = 'fermata-drill-v1';
const V2_DRILL_SAVE = readFileSync(new URL('../src/state/__tests__/fixtures/drill-v2-store.json', import.meta.url), 'utf8');

let proxy: DeployProxy;

test.beforeEach(async ({ page, baseURL }) => {
  // Worker installs, deploys and reloads: generous under a loaded machine
  // (one run at load average ~25 took 30 s per test; unloaded: 4–16 s).
  test.setTimeout(90_000);
  const manifest = await page.request.get('/manifest.webmanifest');
  test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'No service worker on the dev server (devOptions disabled)');
  proxy = await startDeployProxy(baseURL!);
  // Each proxy is its own origin: seed the welcome's "seen" flag there too
  // (e2e/helpers/welcome.ts) — every tab of this context.
  await seedWelcomeSeen(page.context());
  // Count this tab's page loads and log every alert's text (sessionStorage
  // survives the reloads), so "silently" and "no reload" can be asserted.
  await page.addInitScript(() => {
    sessionStorage.setItem('e2e:loads', String(Number(sessionStorage.getItem('e2e:loads') ?? 0) + 1));
    // "Time away": Date.now runs ahead by e2e:skew ms (see awayFor).
    const realNow = Date.now.bind(Date);
    Date.now = () => realNow() + Number(sessionStorage.getItem('e2e:skew') ?? 0);
    new MutationObserver(() => {
      const seen = JSON.parse(sessionStorage.getItem('e2e:alerts') ?? '[]') as string[];
      for (const el of Array.from(document.querySelectorAll('[role="alert"]'))) {
        const text = `${sessionStorage.getItem('e2e:loads')}|${el.textContent}`;
        if (!seen.includes(text)) seen.push(text);
      }
      sessionStorage.setItem('e2e:alerts', JSON.stringify(seen));
    }).observe(document, { childList: true, subtree: true, characterData: true });
  });
});

test.afterEach(async () => {
  await proxy?.close();
});

// Polled across reloads: a navigation in progress reads as "not yet".
const loads = (page: Page) => page.evaluate(() => Number(sessionStorage.getItem('e2e:loads'))).catch(() => -1);
const alertsOfLoad = async (page: Page, load: number) =>
  ((await page.evaluate(() => JSON.parse(sessionStorage.getItem('e2e:alerts') ?? '[]'))) as string[])
    .filter((a) => a.startsWith(`${load}|`))
    .map((a) => a.slice(a.indexOf('|') + 1));
const workerState = (page: Page) =>
  page
    .evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      return { controlled: !!navigator.serviceWorker.controller, waiting: reg?.waiting?.state ?? null, active: reg?.active?.state ?? null };
    })
    .catch(() => ({ controlled: false, waiting: 'navigating', active: null }));
const updateToast = (page: Page) => page.getByRole('alert').filter({ hasText: /new version/i });

/** First visit through the proxy: the worker installs and controls the page. */
async function firstVisit(page: Page) {
  await page.goto(`${proxy.origin}/`);
  await expect.poll(async () => (await workerState(page)).controlled, { timeout: 20_000 }).toBe(true);
  await expect(page.getByRole('alert').filter({ hasText: /offline/i })).toBeVisible({ timeout: 15_000 });
}

/** A deploy goes live and this page finds it: the new worker installs and waits. */
async function deployAndFind(page: Page, options: Parameters<DeployProxy['deploy']>[0] = {}) {
  proxy.deploy(options);
  await page.evaluate(async () => {
    await (await navigator.serviceWorker.getRegistration())!.update();
  });
  await expect.poll(async () => (await workerState(page)).waiting, { timeout: 20_000 }).toBe('installed');
}

/** The learner is using the app (a key press): no longer a fresh start. */
const interact = (page: Page) => page.keyboard.press('Shift');

/** The learner leaves the app for `ms` and comes back (visibility simulated; the clock skewed). */
async function awayFor(page: Page, ms: number) {
  await page.evaluate((away) => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    sessionStorage.setItem('e2e:skew', String(Number(sessionStorage.getItem('e2e:skew') ?? 0) + away));
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  }, ms);
}

/** A cold launch: the app is opened again (a new page load in this tab). */
async function coldLaunch(page: Page) {
  await page.goto(`${proxy.origin}/`);
  await expect(page.locator('#root')).not.toBeEmpty();
}

test('a waiting update applies silently on a fresh start with nothing in progress, then says so', async ({ page }) => {
  await firstVisit(page);
  await interact(page);
  await deployAndFind(page, { versionJson: nextRelease() });
  // Mid-use it asks (W9-06) — the prompt carries the waiting release's note.
  await expect(updateToast(page)).toBeVisible();
  await expect(updateToast(page)).toContainText(`What’s new: ${NOTE.en}`);
  const before = await loads(page);

  await coldLaunch(page);
  // The page reloads by itself once the new worker takes over…
  await expect.poll(() => loads(page), { timeout: 20_000 }).toBe(before + 2);
  await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
  // …the launch never asked…
  expect((await alertsOfLoad(page, before + 1)).filter((a) => /new version/i.test(a))).toEqual([]);
  // …and the new page says what happened.
  await expect(page.getByRole('alert').filter({ hasText: 'Updated to the latest version' })).toBeVisible();
  await expect(updateToast(page)).toHaveCount(0);

  // Settings' footer: still a dated build that works offline (W11-A line).
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Settings' })).toContainText(/build \d{4}-\d{2}-\d{2} · works offline/);
});

test('silence counts as busy: another tab that cannot answer (as on an older version) keeps a launch from applying silently', async ({ page, context }) => {
  await firstVisit(page);
  await interact(page);
  await deployAndFind(page);

  // A second tab of the app that cannot take part in the "busy?" exchange —
  // like a tab still running a version from before W9b.
  const silent = await context.newPage();
  await silent.addInitScript(() => {
    (window as unknown as { BroadcastChannel?: unknown }).BroadcastChannel = undefined;
  });
  await silent.goto(`${proxy.origin}/`);
  await expect(silent.locator('#root')).not.toBeEmpty();
  await expect(updateToast(silent)).toBeVisible({ timeout: 10_000 }); // it cannot ask either: it asks the learner

  // A cold launch in the first tab: the worker counts 2 windows, only 1 can answer.
  const before = await loads(page);
  await coldLaunch(page);
  await expect(updateToast(page)).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(3000);
  expect(await loads(page)).toBe(before + 1); // no reload behind either tab's back
  expect((await workerState(page)).waiting).toBe('installed');

  // That tab closes; the next launch is alone again and goes in silently.
  await silent.close();
  await coldLaunch(page);
  await expect.poll(() => loads(page), { timeout: 20_000 }).toBe(before + 3);
  await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
  await expect(page.getByRole('alert').filter({ hasText: 'Updated to the latest version' })).toBeVisible();
});

// ── 1b. Learn: unfinished checks are busy; overview and reading are idle ──

async function openLesson(page: Page, title: string) {
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Quick search' });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill(title);
  await dialog.getByRole('button', { name: new RegExp(`^${title}`) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible({ timeout: 15_000 });
}

async function openCheck(page: Page) {
  await openLesson(page, 'The Staff and Clefs');
  await page.getByTestId('section-rail').locator('[data-section-link="check"]').click();
  await page.getByRole('button', { name: 'Start the check' }).click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
}

for (const place of ['overview', 'lesson'] as const) {
  test(`Learn ${place}: back after 31 min applies silently`, async ({ page }) => {
    await firstVisit(page);
    if (place === 'lesson') await openLesson(page, 'The Staff and Clefs');
    else await page.getByRole('tab', { name: 'Learn' }).click();
    await deployAndFind(page);
    await expect(updateToast(page)).toBeVisible();
    const before = await loads(page);
    await awayFor(page, 31 * 60_000);
    await expect.poll(() => loads(page), { timeout: 20_000 }).toBe(before + 1);
    await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
    if (place === 'lesson') await expect(page.getByRole('heading', { level: 1, name: 'The Staff and Clefs' })).toBeVisible();
  });
}

test('a cold launch with a saved Learn check asks before any lazy Learn view loads; Reload resumes it', async ({ page }) => {
  await firstVisit(page);
  await openCheck(page);
  const prompt = await page.getByTestId('check-prompt').textContent();
  await deployAndFind(page);
  const before = await loads(page);
  await coldLaunch(page);
  await expect(updateToast(page)).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(3000);
  expect(await loads(page)).toBe(before + 1);
  expect((await workerState(page)).waiting).toBe('installed');
  await expect(page.getByTestId('check-prompt')).toHaveText(prompt!);
  await Promise.all([page.waitForEvent('load', { timeout: 20_000 }), updateToast(page).getByRole('button', { name: /^reload$/i }).click()]);
  await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
  await expect(page.getByTestId('check-prompt')).toHaveText(prompt!);
});

test('in a Learn check, back after 31 min: the update asks; reading afterwards is idle', async ({ page }) => {
  await firstVisit(page);
  await openCheck(page);
  await deployAndFind(page);
  await expect(updateToast(page)).toBeVisible();
  const before = await loads(page);

  await awayFor(page, 31 * 60_000);
  await page.waitForTimeout(5000);
  expect(await loads(page)).toBe(before); // no reload under an unfinished check
  expect((await workerState(page)).waiting).toBe('installed');
  await expect(page.getByTestId('focused-check')).toBeVisible();

  // Control: back in the lesson, the same return goes in silently.
  await page.getByRole('button', { name: 'Exit the check' }).click();
  await expect(page.getByTestId('focused-check')).toHaveCount(0);
  await page.waitForTimeout(2000); // the lesson settles before the learner leaves
  await awayFor(page, 31 * 60_000);
  await expect.poll(() => loads(page), { timeout: 20_000 }).toBe(before + 1);
  await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
});

test('a tab in a Learn check is not reloaded by another tab\'s cold launch (B1); a takeover it did not ask for asks instead', async ({ page, context }) => {
  await firstVisit(page);
  await openCheck(page);
  await deployAndFind(page);
  const before = await loads(page);

  const tab2 = await context.newPage();
  await tab2.goto(`${proxy.origin}/?view=explore`); // idle locally; tab 1's check must block it
  await expect(updateToast(tab2)).toBeVisible({ timeout: 10_000 }); // tab 1 said "busy": it asks
  await page.waitForTimeout(3000);
  expect(await loads(page)).toBe(before);
  expect((await workerState(page)).waiting).toBe('installed');
  await expect(page.getByTestId('focused-check')).toBeVisible();

  // Tab 2's learner taps Reload: the update takes over. Tab 1 did not ask —
  // it is not reloaded under its learner, it asks (review W9b-g).
  await Promise.all([tab2.waitForEvent('load', { timeout: 20_000 }), updateToast(tab2).getByRole('button', { name: /^reload$/i }).click()]);
  await expect(page.getByRole('alert').filter({ hasText: 'Reload to finish updating' })).toBeVisible({ timeout: 15_000 });
  expect(await loads(page)).toBe(before);
  await expect(page.getByTestId('focused-check')).toBeVisible();
  await Promise.all([
    page.waitForEvent('load', { timeout: 20_000 }),
    page.getByRole('alert').filter({ hasText: 'Reload to finish updating' }).getByRole('button', { name: /^reload$/i }).click(),
  ]);
  expect(await loads(page)).toBe(before + 1);
});

// ── 1c. A late takeover never reloads under the learner (review W9b-g) ────

test('interaction after SKIP_WAITING but before takeover blocks the plugin too; Reload still takes one click', async ({ page }) => {
  await firstVisit(page);
  await interact(page);
  await deployAndFind(page);
  const before = await loads(page);
  // Observe the real activation request, then interact in the same task.
  // The worker cannot deliver controllerchange until this task has ended.
  await page.addInitScript(() => {
    const postMessage = ServiceWorker.prototype.postMessage;
    let requestedAt: number | null = null;
    ServiceWorker.prototype.postMessage = function (message: unknown, options?: StructuredSerializeOptions | Transferable[]) {
      const result = Reflect.apply(postMessage, this, [message, options]);
      if (message && typeof message === 'object' && 'type' in message && message.type === 'SKIP_WAITING') {
        requestedAt = performance.now();
        window.dispatchEvent(new Event('pointerdown'));
      }
      return result;
    };
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (requestedAt !== null) sessionStorage.setItem('e2e:takeover-ms', String(performance.now() - requestedAt));
    });
  });
  await coldLaunch(page);
  const finish = page.getByRole('alert').filter({ hasText: 'Reload to finish updating' });
  await expect(finish).toBeVisible({ timeout: 15_000 });
  expect(await loads(page)).toBe(before + 1);
  const elapsed = await page.evaluate(() => sessionStorage.getItem('e2e:takeover-ms'));
  expect(elapsed).not.toBeNull();
  expect(Number(elapsed)).toBeLessThan(4000); // exercised the expected-takeover window
  await page.waitForTimeout(4500);
  await expect(updateToast(page)).toHaveCount(0); // no stale silent timeout
  await expect(finish).toBeVisible();
  await Promise.all([
    page.waitForEvent('load', { timeout: 20_000 }),
    finish.getByRole('button', { name: /^reload$/i }).click(),
  ]);
  expect(await loads(page)).toBe(before + 2);
});

test('a silent apply whose takeover comes late: the prompt after 4 s, then "Reload to finish updating" — no reload under the learner', async ({ page }) => {
  await firstVisit(page);
  await interact(page);
  await deployAndFind(page, { lateSkipWaitingMs: 8000 }); // the new worker obeys SKIP_WAITING 8 s late
  const before = await loads(page);

  await coldLaunch(page); // fresh start: it tries the silent apply…
  await expect(updateToast(page)).toBeVisible({ timeout: 10_000 }); // …gives up after 4 s and asks
  await interact(page); // the learner is busy now
  await expect(page.getByRole('alert').filter({ hasText: 'Reload to finish updating' })).toBeVisible({ timeout: 15_000 });
  expect(await loads(page)).toBe(before + 1); // the late takeover did not reload the page
  await expect(updateToast(page)).toHaveCount(0);
  await expect.poll(() => workerState(page), { timeout: 10_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });

  await Promise.all([
    page.waitForEvent('load', { timeout: 20_000 }),
    page.getByRole('alert').filter({ hasText: 'Reload to finish updating' }).getByRole('button', { name: /^reload$/i }).click(),
  ]);
  expect(await loads(page)).toBe(before + 2);
  await expect(page.getByRole('alert').filter({ hasText: 'Reload to finish updating' })).toHaveCount(0);
});

// ── 2. Never silently during a Drill session or a Sprint ──────────────────

/**
 * Seed a real v2 Drill save (a session left after 3 answers) and open Drill.
 * Its header reads "4 of 9" (was "4 of 8" before 2026-11-09): 6 facts, and a
 * second look for each of the 3 new to that session (triad C, scale C, and
 * the Roman numeral on screen) — the old total would have grown to 9 the
 * moment the Roman numeral was answered (sessionCounter.ts).
 */
async function openDrillWithSave(page: Page, save: string) {
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [DRILL_KEY, save] as const);
  await page.getByRole('tab', { name: 'Drill' }).click(); // also makes Drill the view a launch restores
  await expect(page.locator('#drill-panel')).toBeVisible();
}
const drillPrompt = (page: Page) => page.locator('#drill-panel p.text-xl').first();

test('another tab saving idle cannot hide a live Drill session from either update decision', async ({ page, context }) => {
  await firstVisit(page);
  await openDrillWithSave(page, V2_DRILL_SAVE);
  await expect(page.getByText('4 of 9')).toBeVisible();
  const before = await loads(page);
  const tab2 = await context.newPage();
  await tab2.goto(`${proxy.origin}/?view=explore`);
  await expect(tab2.getByRole('tab', { name: 'Explore' })).toHaveAttribute('aria-selected', 'true');
  await tab2.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key)!);
    saved.state.activeSession = null;
    saved.state.sprint = null;
    localStorage.setItem(key, JSON.stringify(saved));
  }, DRILL_KEY);
  await deployAndFind(page);
  await awayFor(page, 31 * 60_000); // this tab's own fresh-start decision
  await expect(updateToast(page)).toBeVisible();
  await tab2.goto(`${proxy.origin}/?view=explore`); // the other tab asks this one's live check
  await expect(updateToast(tab2)).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(4500);
  expect(await loads(page)).toBe(before);
  expect((await workerState(page)).waiting).toBe('installed');
  await expect(page.getByText('4 of 9')).toBeVisible();
  await tab2.close();
});

test('NEVER silently during a Drill session: a cold launch into one asks; Reload resumes it exactly', async ({ page }) => {
  await firstVisit(page);
  await openDrillWithSave(page, V2_DRILL_SAVE);
  await expect(page.getByText('4 of 9')).toBeVisible(); // the saved session, resumed at question 4
  await deployAndFind(page);
  const before = await loads(page);

  await coldLaunch(page); // a fresh start — but straight into the session
  await expect(page.getByText('4 of 9')).toBeVisible();
  await expect(updateToast(page)).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(3000);
  expect(await loads(page)).toBe(before + 1); // no reload behind the learner's back
  expect((await workerState(page)).waiting).toBe('installed'); // still waiting

  const question = await drillPrompt(page).textContent();
  await Promise.all([page.waitForEvent('load', { timeout: 20_000 }), updateToast(page).getByRole('button', { name: /^reload$/i }).click()]);
  await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
  await expect(page.getByText('4 of 9')).toBeVisible();
  await expect(drillPrompt(page)).toHaveText(question!);
});

test('NEVER silently during a Sprint: a cold launch into one asks; Reload resumes the run (score, time)', async ({ page }) => {
  // The same real save, with its five facts known (review) so a Sprint can run.
  const save = JSON.parse(V2_DRILL_SAVE) as { state: { items: Record<string, { tier: string }> } };
  for (const item of Object.values(save.state.items)) item.tier = 'review';
  await firstVisit(page);
  await openDrillWithSave(page, JSON.stringify(save));
  await page.getByRole('button', { name: 'End session' }).click();
  await page.getByRole('button', { name: 'Sprint' }).click();
  await expect(page.getByText('60s')).toBeVisible();
  await deployAndFind(page);
  const before = await loads(page);

  await coldLaunch(page);
  await expect(page.getByText(/^\d+s$/)).toBeVisible(); // straight back into the Sprint
  await expect(updateToast(page)).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(3000);
  expect(await loads(page)).toBe(before + 1);
  expect((await workerState(page)).waiting).toBe('installed');

  const seconds = Number((await page.getByText(/^\d+s$/).textContent())!.replace('s', ''));
  const question = await drillPrompt(page).textContent();
  expect(seconds).toBeGreaterThan(40);
  await Promise.all([page.waitForEvent('load', { timeout: 20_000 }), updateToast(page).getByRole('button', { name: /^reload$/i }).click()]);
  await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
  const after = Number((await page.getByText(/^\d+s$/).textContent())!.replace('s', ''));
  expect(after).toBeLessThanOrEqual(seconds);
  expect(after).toBeGreaterThanOrEqual(seconds - 3); // the reload's own second or two
  await expect(page.getByText('0 correct')).toBeVisible();
  await expect(drillPrompt(page)).toHaveText(question!);
});

// ── 3. Critical + "Later" → the next safe moment; the note in EN / PT / ES ──

async function switchLanguage(page: Page, label: string) {
  await page.getByTestId('app-topbar').getByRole('button', { name: /^(More|Mais|Más)( — .*)?$/ }).click();
  await page.getByRole('menuitem', { name: /^(Settings|Definições|Ajustes)$/ }).click();
  const dialog = page.getByRole('dialog', { name: /^(Settings|Definições|Ajustes)$/ });
  await dialog.getByRole('radio', { name: label }).click();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
}

test('a critical update put off with "Later" applies when the learner switches away; its note reads in EN / PT / ES', async ({ page }) => {
  await firstVisit(page);
  await interact(page);
  await deployAndFind(page, { versionJson: nextRelease({ critical: true, criticalSince: 99 }) });

  await expect(updateToast(page)).toContainText(`What’s new: ${NOTE.en}`);
  await switchLanguage(page, 'Português');
  await expect(page.getByRole('alert').filter({ hasText: 'Nova versão disponível' })).toContainText(`Novidades: ${NOTE.pt}`);
  await switchLanguage(page, 'Español');
  await expect(page.getByRole('alert').filter({ hasText: 'Nueva versión disponible' })).toContainText(`Novedades: ${NOTE.es}`);
  await switchLanguage(page, 'English');

  await updateToast(page).getByRole('button', { name: 'Later' }).click();
  await expect(updateToast(page)).toHaveCount(0);
  const before = await loads(page);
  await page.waitForTimeout(2000);
  expect((await workerState(page)).waiting).toBe('installed'); // "Later" holds while the learner is here

  // The learner switches to another app (simulated: headless pages stay visible).
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => loads(page), { timeout: 20_000 }).toBe(before + 1);
  await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
  await expect(page.getByRole('alert').filter({ hasText: 'Updated to the latest version' })).toBeVisible();
});

test('a critical update never applies while a Drill session is under way — not even when the page is hidden', async ({ page }) => {
  await firstVisit(page);
  await openDrillWithSave(page, V2_DRILL_SAVE);
  await deployAndFind(page, { versionJson: nextRelease({ critical: true, criticalSince: 99 }) });
  await expect(updateToast(page)).toBeVisible();
  const before = await loads(page);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(3000);
  expect(await loads(page)).toBe(before);
  expect((await workerState(page)).waiting).toBe('installed');
});

// ── 4. The old page keeps working: every lazy view / level from its cache ──

async function openLessonBySearch(page: Page, title: string) {
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Quick search' });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill(title);
  await dialog.getByRole('button', { name: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible({ timeout: 15_000 });
}

/** The first module of each level (src/data/moduleIndex.ts). */
const FIRST_MODULES = [
  'The Staff and Clefs',
  'All Major Keys and the Circle of Fifths',
  'Seventh Chords: The Five Qualities',
  'Suspensions',
  'Secondary Dominants: V/V and V7/V',
  'The Neapolitan Chord (bII)',
  'Jazz Chord Symbols and Extensions',
  'Fugue: Exposition and Subject/Answer',
  'Pitch Matching and Direction',
];

test('a page left on the old build opens every lazy view and level with the old files gone from the server', async ({ page, context }) => {
  test.setTimeout(120_000);
  await firstVisit(page);
  // Nothing from the HTTP cache: whatever loads below came from the worker.
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  // Build "B" goes live and build A's files vanish from the server; the
  // learner (busy: no silent update) puts it off and keeps working on build A.
  await interact(page);
  await deployAndFind(page, { dropOldAssets: true });
  await updateToast(page).getByRole('button', { name: 'Later' }).click();
  const errorScreen = page.getByText('This view encountered an error.');

  // Every view…
  await page.getByRole('tab', { name: 'Learn' }).click();
  await expect(page.getByText('Foundations of Music Literacy').first()).toBeVisible({ timeout: 10_000 });
  await page.getByRole('tab', { name: 'Drill' }).click();
  await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 10_000 });
  await page.getByRole('tab', { name: 'Explore' }).click();
  await page.getByRole('radio', { name: 'Guitar' }).click(); // the lazy fretboard
  await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 10_000 });
  // …every level (its curriculum, exercises and notation), via Quick Search…
  for (const title of FIRST_MODULES) await openLessonBySearch(page, title);
  // …and the translated content.
  for (const label of ['Português', 'Español']) {
    await switchLanguage(page, label);
    await page.getByRole('tab').nth(1).click(); // Learn
    await expect(page.locator('#learn-panel')).toBeVisible();
    await page.getByRole('tab').first().click(); // Explore
  }
  await expect(errorScreen).toHaveCount(0);

  // Then EVERY JS / CSS file of build A, fetched by the old page: all answer.
  const files = readdirSync(new URL('../dist/assets/', import.meta.url)).filter((f) => /\.(js|css)$/.test(f));
  const failed = await page.evaluate(async (names) => {
    const bad: string[] = [];
    for (const name of names) {
      const res = await fetch(`/assets/${name}`).catch(() => null);
      if (!res || !res.ok) bad.push(name);
    }
    return bad;
  }, files);
  expect(failed).toEqual([]);
  expect(files.length).toBeGreaterThan(100);
  // Not one of them came from the server (it would have answered 404).
  expect(proxy.blockedAssetRequests).toEqual([]);
  expect((await workerState(page)).waiting).toBe('installed'); // still on build A, update still waiting
});
