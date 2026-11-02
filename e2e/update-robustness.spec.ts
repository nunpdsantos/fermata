import { test, expect, type Page } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { startDeployProxy, type DeployProxy } from './helpers/deployProxy';

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
  const manifest = await page.request.get('/manifest.webmanifest');
  test.skip(!(manifest.headers()['content-type'] ?? '').includes('json'), 'No service worker on the dev server (devOptions disabled)');
  proxy = await startDeployProxy(baseURL!);
  // Count this tab's page loads and log every alert's text (sessionStorage
  // survives the reloads), so "silently" and "no reload" can be asserted.
  await page.addInitScript(() => {
    sessionStorage.setItem('e2e:loads', String(Number(sessionStorage.getItem('e2e:loads') ?? 0) + 1));
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

// ── 2. Never silently during a Drill session or a Sprint ──────────────────

/** Seed a real v2 Drill save (a session left after 3 answers) and open Drill. */
async function openDrillWithSave(page: Page, save: string) {
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [DRILL_KEY, save] as const);
  await page.getByRole('tab', { name: 'Drill' }).click(); // also makes Drill the view a launch restores
  await expect(page.locator('#drill-panel')).toBeVisible();
}
const drillPrompt = (page: Page) => page.locator('#drill-panel p.text-xl').first();

test('NEVER silently during a Drill session: a cold launch into one asks; Reload resumes it exactly', async ({ page }) => {
  await firstVisit(page);
  await openDrillWithSave(page, V2_DRILL_SAVE);
  await expect(page.getByText('4 of 8')).toBeVisible(); // the saved session, resumed at question 4
  await deployAndFind(page);
  const before = await loads(page);

  await coldLaunch(page); // a fresh start — but straight into the session
  await expect(page.getByText('4 of 8')).toBeVisible();
  await expect(updateToast(page)).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(3000);
  expect(await loads(page)).toBe(before + 1); // no reload behind the learner's back
  expect((await workerState(page)).waiting).toBe('installed'); // still waiting

  const question = await drillPrompt(page).textContent();
  await Promise.all([page.waitForEvent('load', { timeout: 20_000 }), updateToast(page).getByRole('button', { name: /^reload$/i }).click()]);
  await expect.poll(() => workerState(page), { timeout: 15_000 }).toEqual({ controlled: true, waiting: null, active: 'activated' });
  await expect(page.getByText('4 of 8')).toBeVisible();
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
