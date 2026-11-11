import { test, expect, type Browser, type Page } from '@playwright/test';
import { seededBrowser, savedState, LAPTOP, PHONE, type View } from './helpers/wave1';

/**
 * The metronome (wave 3, stream M) in a real browser: open it from "⋯",
 * start it, change the tempo and the bar, tap a tempo, put it away; it keeps
 * time while a scale plays, while the learner plays notes and opens a chord,
 * and in a lesson; it stops when the Progression loop starts (one line says
 * why) and when the page is hidden; a reload keeps the tempo and does not
 * start it. "Keeps time" is read on the audio seam: the clicks the metronome
 * handed to its audio clock (`clickLog()` of services/metronome/clickVoice.ts,
 * through the dev server's own module) — none taken back, every one on the
 * beat grid of the tempo.
 */

interface Click { at: number; accent: boolean; cancelledAt: number | null }
const clicks = (page: Page) =>
  page.evaluate(`(async () => (await import('/src/services/metronome/clickVoice.ts')).clickLog())()`) as Promise<Click[]>;
const pending = (page: Page) =>
  page.evaluate(`(async () => (await import('/src/services/metronome/clickVoice.ts')).pendingClicks())()`) as Promise<number>;
const audioNow = (page: Page) =>
  page.evaluate(`(async () => (await import('/src/services/metronome/clickVoice.ts')).clickClock())()`) as Promise<{ now: number; state: string } | null>;

const bar = (page: Page) => page.getByRole('region', { name: 'Metronome' });

/**
 * "Keeps time" is read on the metronome's audio clock through the dev
 * server's own module; the production build (playwright.preview.config.ts)
 * serves no /src modules, so there this spec is skipped with a note — never
 * silently on the dev server: only a build (the one serving the PWA
 * manifest) may lack them (the design-system sweep's rule; wave 3
 * integration). The bar on the build is covered by design-metronome.spec.ts
 * and e2e/wave3-seams.spec.ts.
 */
test.beforeEach(async ({ request }) => {
  const res = await request.get('/src/services/metronome/clickVoice.ts');
  const dev = res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
  if (!dev) {
    const manifest = await request.get('/manifest.webmanifest');
    expect((manifest.headers()['content-type'] ?? '').includes('json'), 'dev server without /src modules?').toBe(true);
  }
  test.skip(!dev, 'the clicks are read on the audio clock through the dev server\'s own module: skipped on the production build');
});

async function start(browser: Browser, v: View, settings: Record<string, unknown> = {}) {
  const { context, page } = await seededBrowser(browser, v, {
    themeMode: 'fermata', language: 'en', lastView: 'explore', instrument: 'piano',
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', ...settings,
  });
  await page.goto('/');
  await expect(page.getByTestId('instrument-dock')).toBeVisible({ timeout: 15_000 });
  return { context, page };
}

async function openMetronome(page: Page) {
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Metronome' }).click();
  await expect(bar(page)).toBeVisible();
  await expect(bar(page)).toHaveAttribute('data-measured', 'true');
}

/** Every click handed over so far that will sound (never taken back before its time) sits on the beat grid. */
function expectOnTheGrid(log: Click[], bpm: number, from = 0) {
  const kept = log.slice(from);
  expect(kept.filter((c) => c.cancelledAt !== null && c.cancelledAt < c.at), 'no click taken back').toEqual([]);
  const beat = 60 / bpm;
  for (let i = 1; i < kept.length; i++) expect(Math.abs(kept[i].at - kept[0].at - i * beat), `click ${i} on the beat`).toBeLessThan(1e-6);
}

/** Tap the Tap button `n` times exactly `ms` apart (timed in the page, as a learner's steady hand). */
async function tapAt(page: Page, n: number, ms: number) {
  await page.getByTestId('metronome-tap').evaluate((el, [count, gap]) => {
    const t0 = performance.now();
    for (let i = 0; i < count; i++) {
      while (performance.now() < t0 + i * gap) { /* wait for the beat */ }
      (el as HTMLButtonElement).click();
    }
  }, [n, ms] as const);
}

for (const v of [LAPTOP, PHONE]) {
  test(`${v.name}: open, start, change the tempo and the bar, tap, put away`, async ({ browser }) => {
    const { context, page } = await start(browser, v);
    await openMetronome(page);
    await expect(page.getByTestId('metronome-play')).toBeFocused();
    const input = page.getByRole('textbox', { name: 'Tempo, beats a minute' });
    await expect(input).toHaveValue('80');

    await page.getByTestId('metronome-play').click();
    await expect(bar(page)).toHaveAttribute('data-running', 'true');
    await expect.poll(async () => (await clicks(page)).length, { timeout: 8000 }).toBeGreaterThan(5);
    // The first beat of the bar is the accented click; then the count says where it is.
    const first = await clicks(page);
    expect(first.slice(0, 5).map((c) => c.accent)).toEqual([true, false, false, false, true]);
    await expect(page.getByTestId('metronome-count').locator('[data-current]')).toHaveCount(1);

    // Faster, typed, the bar: each from the next beat, still running.
    await page.getByRole('button', { name: 'Faster' }).click();
    await expect(input).toHaveValue('81');
    await input.fill('120');
    await input.press('Enter');
    await expect(input).toHaveValue('120');
    await page.getByRole('combobox', { name: 'Beats in a bar' }).selectOption('3');
    await expect(page.getByTestId('metronome-count').locator('.metro-beat')).toHaveText(['1', '2', '3']);
    const mark = (await clicks(page)).length;
    await page.waitForTimeout(3200);
    const after = (await clicks(page)).slice(mark).filter((c) => c.cancelledAt === null);
    expect(after.length).toBeGreaterThan(3);
    for (let i = 1; i < after.length; i++) expect(after[i].at - after[i - 1].at).toBeCloseTo(0.5, 6);
    // In threes: an accent every third click.
    const firstAccent = after.findIndex((c) => c.accent);
    expect(after.slice(firstAccent, firstAccent + 4).map((c) => c.accent)).toEqual([true, false, false, true]);
    expect(await savedState(page)).toMatchObject({ metronome: { bpm: 120, beats: 3 } });

    // Tap: four even gaps of 750 ms are 80 a minute.
    await tapAt(page, 5, 750);
    await expect(input).toHaveValue('80');

    // ■ leaves nothing queued; ✕ puts it away and gives focus back to "⋯".
    await page.getByTestId('metronome-play').click();
    await expect(bar(page)).not.toHaveAttribute('data-running', 'true');
    expect(await pending(page)).toBe(0);
    await page.getByTestId('metronome-play').click();
    await expect.poll(() => pending(page), { intervals: [50] }).toBeGreaterThan(0);
    await page.getByRole('button', { name: 'Close the metronome' }).click();
    await expect(bar(page)).toHaveCount(0);
    expect(await pending(page)).toBe(0);
    await expect(page.getByRole('button', { name: 'More', exact: true })).toBeFocused();
    await context.close();
  });
}

test('it keeps time while a scale plays, while the learner plays notes and opens a chord', async ({ browser }) => {
  const { context, page } = await start(browser, LAPTOP);
  await openMetronome(page);
  await page.getByTestId('metronome-play').click();
  await expect.poll(async () => (await clicks(page)).length).toBeGreaterThan(1);
  const t0 = (await audioNow(page))!.now;

  await page.getByRole('button', { name: 'Play scale' }).click();
  await page.waitForTimeout(600);
  for (const midi of [60, 62, 64]) await page.locator(`[data-piano-key][data-midi="${midi}"]:visible`).first().click();
  await page.getByRole('button', { name: 'C Major chord, degree 1' }).click();
  await expect(page.getByTestId('chord-detail')).toBeVisible();
  await page.getByTestId('chord-detail').getByRole('button', { name: 'Chord', exact: true }).click();
  await page.waitForTimeout(2500);

  await expect(bar(page)).toHaveAttribute('data-running', 'true');
  const log = await clicks(page);
  expectOnTheGrid(log, 80);
  // The audio clock really moved on, and the clicks kept coming past it.
  const now = (await audioNow(page))!;
  expect(now.state).toBe('running');
  expect(now.now - t0).toBeGreaterThan(3);
  expect(log[log.length - 1].at).toBeGreaterThan(now.now - 60 / 80);
  await expect.poll(() => pending(page), { timeout: 2000, intervals: [50] }).toBeGreaterThan(0);
  await context.close();
});

test('it stops when the Progression loop starts — one line says why — and ▶ again stops the loop', async ({ browser }) => {
  const { context, page } = await start(browser, LAPTOP, { progression: { chords: ['C', 'G', 'Am', 'F'], bpm: 90, beats: 4 } });
  await openMetronome(page);
  await page.getByTestId('metronome-play').click();
  await expect.poll(() => pending(page), { intervals: [50] }).toBeGreaterThan(0);

  await page.getByTestId('progression-toggle').click();
  await page.getByTestId('progression-play').click();
  await expect(page.getByTestId('progression-play')).toHaveAttribute('aria-pressed', 'true');
  await expect(bar(page)).not.toHaveAttribute('data-running', 'true');
  expect(await pending(page)).toBe(0);
  await expect(page.getByTestId('metronome-loop-note')).toHaveText('The Progression loop plays its own clicks to count you in, so the metronome stops when the loop starts.');

  // ▶ on the metronome: the newer clock wins.
  await page.getByTestId('metronome-play').click();
  await expect(bar(page)).toHaveAttribute('data-running', 'true');
  await expect(page.getByTestId('progression-play')).toHaveAttribute('aria-pressed', 'false');
  await context.close();
});

test('the page hidden stops it, and nothing stays queued', async ({ browser }) => {
  const { context, page } = await start(browser, PHONE);
  await openMetronome(page);
  await page.getByTestId('metronome-play').click();
  await expect.poll(() => pending(page), { intervals: [50] }).toBeGreaterThan(0);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(await pending(page)).toBe(0);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(bar(page)).not.toHaveAttribute('data-running', 'true');
  await context.close();
});

test('not in Drill, not while the tour plays', async ({ browser }) => {
  const { context, page } = await start(browser, LAPTOP);
  await openMetronome(page);
  await page.getByTestId('metronome-play').click();
  await page.getByRole('tab', { name: 'Drill' }).click();
  await expect(bar(page)).toHaveCount(0);
  expect(await pending(page)).toBe(0);
  // Where the bar is never shown the menu does not offer it.
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await expect(page.getByRole('menuitem', { name: 'Show me around' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Metronome' })).toHaveCount(0);
  // Wave 3 integration: the Drill menu, exactly (the tuner stays: it is a sheet, not tied to a view).
  await expect(page.getByRole('menuitem')).toHaveText(['Settings', 'Show me around', 'Tuner']);
  await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'Explore' }).click();
  await expect(bar(page)).toBeVisible();
  await expect(bar(page)).not.toHaveAttribute('data-running', 'true');

  // Running when the tour is asked for: it stops (so the tour is not refused as "work in progress") and the bar goes.
  await page.getByTestId('metronome-play').click();
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Show me around' }).click();
  await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
  await expect(bar(page)).toHaveCount(0);
  expect(await pending(page)).toBe(0);
  await page.getByTestId('tour-close').click();
  await expect(page.getByTestId('tour')).toHaveCount(0);
  await expect(bar(page)).toBeVisible();
  await context.close();
});

test('done means: 72 by tapping, a clear first beat in four, the C major scale played against it, a lesson read with it going, 72 again after a reload', async ({ browser }) => {
  const { context, page } = await start(browser, LAPTOP);
  await openMetronome(page);
  await tapAt(page, 5, 60000 / 72);
  await expect(page.getByRole('textbox', { name: 'Tempo, beats a minute' })).toHaveValue('72');
  await expect(page.getByRole('combobox', { name: 'Beats in a bar' })).toHaveValue('4');
  await page.getByTestId('metronome-play').click();
  await expect.poll(async () => (await clicks(page)).length).toBeGreaterThan(4);
  expect((await clicks(page)).slice(0, 5).map((c) => c.accent)).toEqual([true, false, false, false, true]);

  // The C major scale, played on the screen's piano.
  for (const midi of [60, 62, 64, 65, 67, 69, 71, 72]) {
    await page.locator(`[data-piano-key][data-midi="${midi}"]:visible`).first().click();
    await page.waitForTimeout(150);
  }
  await expect(bar(page)).toHaveAttribute('data-running', 'true');

  // A lesson, read with it going.
  await page.getByRole('tab', { name: 'Learn' }).click();
  await page.getByRole('button', { name: /The Staff and Clefs/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'The Staff and Clefs' })).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);
  await expect(bar(page)).toHaveAttribute('data-running', 'true');
  expectOnTheGrid(await clicks(page), 72);
  // (A beat at 72 is longer than the look-ahead: a click is queued for part of each beat.)
  await expect.poll(() => pending(page), { timeout: 2000, intervals: [50] }).toBeGreaterThan(0);

  // A reload: 72 again, not running.
  await page.reload();
  await expect(page.getByRole('button', { name: 'More', exact: true })).toBeVisible({ timeout: 15_000 });
  expect(await savedState(page)).toMatchObject({ metronome: { bpm: 72, beats: 4 } });
  await openMetronome(page);
  await expect(page.getByRole('textbox', { name: 'Tempo, beats a minute' })).toHaveValue('72');
  await expect(bar(page)).not.toHaveAttribute('data-running', 'true');
  expect(await clicks(page)).toEqual([]);
  await context.close();
});

test('the owner: nothing new on any screen but the menu item, and his save untouched until he changes the metronome', async ({ browser }) => {
  // His save: no metronome field (and no profile). The bar is never shown unless he opens it.
  const { context, page } = await start(browser, LAPTOP);
  await expect(page.getByTestId('metronome')).toHaveCount(0);
  for (const tab of ['Learn', 'Explore']) {
    await page.getByRole('tab', { name: tab }).click();
    await page.waitForTimeout(400);
    await expect(page.getByTestId('metronome')).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['Settings', 'Show me around', 'Tuner', 'Metronome']);
  await page.keyboard.press('Escape');
  // Opening it, starting and stopping it writes nothing; only a change of tempo or bar does.
  await openMetronome(page);
  await page.getByTestId('metronome-play').click();
  await page.waitForTimeout(500);
  await page.getByTestId('metronome-play').click();
  expect(await savedState(page)).not.toHaveProperty('metronome');
  await context.close();
});
