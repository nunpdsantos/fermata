import { test, expect, type BrowserContext, type Page } from '@playwright/test';

/**
 * Two tabs of the app, one browser (audit A1, 2026-11-18): every saved store
 * is shared by the tabs of a browser (localStorage), and until this fix each
 * tab wrote its whole memory over the other's on every change.
 *
 *  - The audit's own case first, exactly as written: "High and Low" open in
 *    two tabs before ticking anything, the first task ticked in tab A, the
 *    second in tab B, then reloads — the counter AND each checkbox, after
 *    reloading both. Then the same with tab B frozen in the background while
 *    A ticks (Chromium's own page freezing), and with tab B never hearing of
 *    A's tick at all (its storage events swallowed): its write must still
 *    keep A's tick.
 *  - Every other saved store: the settings (with the optional fields),
 *    Drill's spaced-repetition memory, the fingerings, Learn's open lesson.
 *  - Nothing back from the dead: after "Reset app data", a backup imported,
 *    or a newer version's save in one tab, the other tab's old memory is
 *    never written back.
 * The store-level steps use the dev server's /src modules (the app's own
 * store instances); they skip, with a note, on the production build.
 */

const LESSON = '/?lesson=l1u34m1&lang=en';
const PROGRESS = 'music-theory-progress';

async function openLesson(page: Page, address = LESSON): Promise<void> {
  await page.goto(address);
  await expect(page.locator('[data-section="tasks"]')).toBeVisible({ timeout: 20_000 });
}
const tasks = (page: Page) => page.locator('[data-section="tasks"] button[aria-pressed]');
const counter = (page: Page) => page.locator('[data-section="tasks"] .tabular-nums');

async function twoTabs(context: BrowserContext, address = LESSON): Promise<[Page, Page]> {
  const a = await context.newPage();
  const b = await context.newPage();
  await openLesson(a, address);
  await openLesson(b, address);
  return [a, b];
}

async function expectBothTicked(pages: Page[]) {
  for (const page of pages) {
    await page.reload();
    await expect(page.locator('[data-section="tasks"]')).toBeVisible({ timeout: 20_000 });
    await expect(counter(page)).toHaveText('2/2');
    await expect(tasks(page).nth(0)).toHaveAttribute('aria-pressed', 'true');
    await expect(tasks(page).nth(1)).toHaveAttribute('aria-pressed', 'true');
  }
}

const read = (page: Page, key: string) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), key);

test.describe('two tabs of a lesson (audit A1)', () => {
  test('High and Low in two tabs: a task ticked in each — both stay ticked after reloading both tabs', async ({ browser }) => {
    const context = await browser.newContext();
    const [a, b] = await twoTabs(context);
    await expect(counter(a)).toHaveText('0/2');
    await expect(counter(b)).toHaveText('0/2');

    await tasks(a).nth(0).click();
    await expect(tasks(a).nth(0)).toHaveAttribute('aria-pressed', 'true');
    // Tab B shows A's tick without a reload (it follows the saved progress).
    await expect(tasks(b).nth(0)).toHaveAttribute('aria-pressed', 'true');
    await tasks(b).nth(1).click();
    await expect(tasks(b).nth(1)).toHaveAttribute('aria-pressed', 'true');

    await expectBothTicked([a, b]);
    await context.close();
  });

  test('tab B frozen in the background while A ticks (Chromium page freezing): B\'s tick after it wakes keeps A\'s', async ({ browser }) => {
    const context = await browser.newContext();
    const [a, b] = await twoTabs(context);
    const cdp = await context.newCDPSession(b);
    await cdp.send('Page.setWebLifecycleState', { state: 'frozen' });
    await tasks(a).nth(0).click();
    await expect(tasks(a).nth(0)).toHaveAttribute('aria-pressed', 'true');
    await cdp.send('Page.setWebLifecycleState', { state: 'active' });
    await tasks(b).nth(1).click();
    await expectBothTicked([a, b]);
    await context.close();
  });

  test('tab B never hears of A\'s tick (its storage events swallowed): its own tick still keeps A\'s', async ({ browser }) => {
    const context = await browser.newContext();
    const a = await context.newPage();
    const b = await context.newPage();
    // Before the app's own code: B's storage events stop here, as for a tab that missed them.
    await b.addInitScript(() => window.addEventListener('storage', (e) => e.stopImmediatePropagation(), true));
    await openLesson(a);
    await openLesson(b);
    await tasks(a).nth(0).click();
    await expect(tasks(a).nth(0)).toHaveAttribute('aria-pressed', 'true');
    await b.waitForTimeout(300);
    await expect(tasks(b).nth(0)).toHaveAttribute('aria-pressed', 'false'); // known positive: B did not hear
    await tasks(b).nth(1).click();
    // B's write kept A's tick, and B now shows what it saved.
    await expect(tasks(b).nth(0)).toHaveAttribute('aria-pressed', 'true');
    await expectBothTicked([a, b]);
    await context.close();
  });
});

test.describe('nothing comes back from the dead (A1)', () => {
  test('"Reset app data" in tab A: tab B\'s old ticks are never written back; only its next tick', async ({ browser }) => {
    const context = await browser.newContext();
    const [a, b] = await twoTabs(context);
    await tasks(a).nth(0).click();
    await expect(tasks(b).nth(0)).toHaveAttribute('aria-pressed', 'true');
    const cdp = await context.newCDPSession(b);
    await cdp.send('Page.setWebLifecycleState', { state: 'frozen' }); // B keeps its old memory
    // The error screen's "Reset app data" (ErrorBoundary.handleResetAppData): every app key removed, then a reload.
    await a.evaluate(() => {
      for (const k of Object.keys(localStorage)) if (k.startsWith('music-theory') || k.startsWith('fermata-drill') || k.startsWith('fermata-fingering') || k.startsWith('fermata-learn')) localStorage.removeItem(k);
    });
    await cdp.send('Page.setWebLifecycleState', { state: 'active' });
    await tasks(b).nth(1).click();
    const saved = await read(b, PROGRESS);
    expect(saved.state.progress.moduleProgress).toEqual({ l1u34m1: ['l1u34m1t2'] });
    await openLesson(a); // the reset reloads the app; the lesson opened again
    await expect(counter(a)).toHaveText('1/2');
    await expect(tasks(a).nth(0)).toHaveAttribute('aria-pressed', 'false');
    await context.close();
  });

  test('a backup imported in tab A (Settings → Import): tab B\'s old progress is not written back over it', async ({ browser }) => {
    const context = await browser.newContext();
    const [a, b] = await twoTabs(context);
    await tasks(a).nth(0).click(); // old progress: task 1
    await expect(tasks(b).nth(0)).toHaveAttribute('aria-pressed', 'true');
    const cdp = await context.newCDPSession(b);
    await cdp.send('Page.setWebLifecycleState', { state: 'frozen' });
    const file = JSON.stringify({ format: 'fermata-backup', version: 1, exportedAt: '2026-11-18T10:00:00.000Z', data: {
      [PROGRESS]: { state: { progress: { completedModules: ['l1u1m1'], moduleProgress: { l1u1m1: ['l1u1m1t1'] } } }, version: 4 },
    } });
    a.on('dialog', (d) => void d.accept());
    await a.getByRole('button', { name: 'More', exact: true }).click();
    await a.getByRole('menuitem', { name: 'Settings' }).click();
    await Promise.all([
      a.waitForEvent('load'),
      a.getByTestId('backup-file-input').setInputFiles({ name: 'fermatina-backup-2026-11-18.json', mimeType: 'application/json', buffer: Buffer.from(file) }),
    ]);
    await cdp.send('Page.setWebLifecycleState', { state: 'active' });
    await tasks(b).nth(1).click();
    const saved = await read(b, PROGRESS);
    expect(saved.state.progress.completedModules).toEqual(['l1u1m1']);
    expect(saved.state.progress.moduleProgress).toEqual({ l1u1m1: ['l1u1m1t1'], l1u34m1: ['l1u34m1t2'] });
    await context.close();
  });

  test('a newer Fermatina migrated the save in another tab: this tab never writes its older progress over it', async ({ browser }) => {
    const context = await browser.newContext();
    const [a, b] = await twoTabs(context);
    const newer = JSON.stringify({ state: { progress: { completedModules: ['from-a-newer-release'], moduleProgress: {} } }, version: 99 });
    await a.evaluate(([k, v]) => localStorage.setItem(k, v), [PROGRESS, newer] as const);
    await tasks(b).nth(0).click();
    await tasks(b).nth(1).click();
    await b.waitForTimeout(300);
    expect(await b.evaluate((k) => localStorage.getItem(k), PROGRESS)).toBe(newer);
    await context.close();
  });
});

// ─── The other saved stores, through the app's own store instances (dev server) ───

async function devOnly(page: Page) {
  const res = await page.request.get('/src/state/tabSafe.ts');
  test.skip(!res.ok() || !(await res.text()).includes('tabSafeStorage'), 'needs the dev server\'s /src modules');
}

test.describe('every other saved store (A1)', () => {
  test('settings (music-theory-app): theme set in tab A, capo in tab B (Settings) — both kept after reloading both; nothing else changed', async ({ browser }) => {
    const context = await browser.newContext();
    const a = await context.newPage();
    const b = await context.newPage();
    for (const p of [a, b]) {
      await p.goto('/');
      await p.getByRole('button', { name: 'More', exact: true }).click();
      await p.getByRole('menuitem', { name: 'Settings' }).click();
    }
    await a.getByRole('radio', { name: 'Night' }).click();
    await b.getByTestId('capo-setting').locator('select').selectOption('3');
    for (const p of [a, b]) await p.reload();
    const s = await read(a, 'music-theory-app');
    expect(s.state.themeMode).toBe('fermata-night');
    expect(s.state.capoFret).toBe(3);
    await expect(a.locator('html')).toHaveClass(/fermata-night/);
    await context.close();
  });

  test('Drill (fermata-drill-v1): two tabs answering, the same fact and different ones, with and without events — every review kept', async ({ browser }) => {
    const context = await browser.newContext();
    const a = await context.newPage();
    const b = await context.newPage();
    // B never hears of A's answers (the write alone must keep them).
    await b.addInitScript(() => window.addEventListener('storage', (e) => e.stopImmediatePropagation(), true));
    await a.goto('/');
    await devOnly(a);
    await b.goto('/');
    // The app's own Drill store (the dev server's module), answering as the view does.
    const answer = (page: Page, ids: string[], t0: number) => page.evaluate(`(async () => {
      const m = await import('/src/state/drillStore.ts');
      const item = (id) => ({ id, family: 'interval', promptKey: 'p', promptParams: {}, input: { format: 'choice', choices: ['A', 'B'] }, answer: { kind: 'choice', correct: 'A' }, whyKey: 'w', whyParams: {}, rank: 0 });
      const ids = ${JSON.stringify(ids)};
      m.useDrillStore.getState().startSession(ids.map(item), ${t0});
      ids.forEach((id, i) => m.useDrillStore.getState().recordAnswer(item(id), true, 800, ${t0} + 10 + i));
    })()`);
    await answer(a, ['f1', 'f2'], 1_800_000_000_000);
    await answer(b, ['f2', 'f3'], 1_800_000_100_000);
    await answer(a, ['f4'], 1_800_000_200_000);
    for (const p of [a, b]) await p.reload();
    const s = (await read(a, 'fermata-drill-v1')).state;
    expect(Object.keys(s.items).sort()).toEqual(['f1', 'f2', 'f3', 'f4']);
    expect(s.items.f2.history).toHaveLength(2);
    expect(s.lifetime).toEqual({ answered: 5, correct: 5 });
    await context.close();
  });

  test('fingerings (fermata-fingering-v1) and Learn\'s open lesson (fermata-learn-session-v1): neither tab erases the other\'s', async ({ browser }) => {
    const context = await browser.newContext();
    const a = await context.newPage();
    const b = await context.newPage();
    await a.goto('/');
    await devOnly(a);
    await b.goto('/');
    const fingering = (page: Page, key: string, finger: number) =>
      page.evaluate(`import('/src/state/fingeringStore.ts').then((m) => m.useFingeringStore.getState().setOverride('${key}', ${finger}))`);
    await fingering(a, 'major|standard|p2|0|1', 2);
    await fingering(b, 'major|standard|p2|1|0', 1);
    expect((await read(a, 'fermata-fingering-v1')).state.overrides).toEqual({ 'major|standard|p2|0|1': 2, 'major|standard|p2|1|0': 1 });
    // Both tabs in Learn (its store loads with Learn); a check under way in A; B then opens another lesson: A's check stays saved.
    const learn = (page: Page, call: string) => page.evaluate(`import('/src/state/learnSessionStore.ts').then((m) => { ${call} })`);
    for (const p of [a, b]) await learn(p, '');
    await learn(a, `m.useLearnSessionStore.getState().setCheck({ moduleId: 'l1u1m1', kind: 'check', lang: 'en', fingerprints: { l1u1m1e1: 'f' }, run: { order: ['l1u1m1e1'], index: 0, scores: [], items: [], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null }, finished: false, at: Date.now() })`);
    await learn(b, `m.useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m1', section: null, at: Date.now() })`);
    const session = (await read(a, 'fermata-learn-session-v1')).state;
    expect(session.check?.moduleId).toBe('l1u1m1');
    expect(session.screen?.moduleId).toBe('l1u34m1');
    await context.close();
  });
});
