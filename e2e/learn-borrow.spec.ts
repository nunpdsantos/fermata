import { test, expect, type Page } from '@playwright/test';

/**
 * B2 (W4b review), in a real browser: Learn BORROWS the instrument (D-20) —
 * and a reload or a closed tab in the middle of a lesson must not turn the
 * lesson's selection into Explore's. Explore is on F# melodic minor; the
 * first lesson ("The Staff and Clefs") puts C major on the instrument.
 *
 * Only the FIRST page is seeded (page.addInitScript, guarded per tab by
 * sessionStorage so a reload keeps what the app saved): a page opened later in
 * the same context — the reopened tab — starts from whatever localStorage
 * holds, exactly like a real browser.
 */

test.use({ serviceWorkers: 'block', contextOptions: { reducedMotion: 'reduce' } });

const LESSON = 'The Staff and Clefs';
const FS_MELODIC_MINOR = /^F#\s*Melodic Minor$/;
const C_MAJOR = /^C\s*Major$/;

async function seedExplore(page: Page) {
  await page.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({
    state: { language: 'en', themeMode: 'fermata', lastView: 'explore', instrument: 'piano', selectedKey: { natural: 'F', accidental: '#' }, selectedScale: 'melodic_minor' },
    version: 6,
  }));
  await page.goto('/');
  await expectExplore(page, FS_MELODIC_MINOR);
}

/** Explore's scale heading ("F# Melodic Minor"). */
async function expectExplore(page: Page, name: RegExp) {
  await expect(page.locator('#explore-panel').getByRole('heading', { name })).toBeVisible({ timeout: 15_000 });
}

const lessonHeading = (page: Page) => page.getByRole('heading', { level: 1, name: LESSON });

/** Learn → the Continue card (a fresh learner's first lesson). */
async function openLesson(page: Page) {
  await page.getByRole('tab', { name: 'Learn' }).click();
  await page.getByRole('button', { name: new RegExp(LESSON) }).first().click();
  await expect(lessonHeading(page)).toBeVisible({ timeout: 15_000 });
}

/** What the main store has saved for the next boot. */
const savedSelection = (page: Page) =>
  page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('music-theory-app') ?? '{}').state ?? {};
    return { key: s.selectedKey, scale: s.selectedScale };
  });
const FS_SAVED = { key: { natural: 'F', accidental: '#' }, scale: 'melodic_minor' };

test.describe('Learn borrows the instrument — reloads and closed tabs (B2)', () => {
  test('a reload in the middle of a lesson: back in Explore, F# melodic minor', async ({ page }) => {
    await seedExplore(page);
    await openLesson(page);
    // The lesson has the instrument; the save keeps Explore's own selection.
    expect(await savedSelection(page)).toEqual(FS_SAVED);

    await page.reload();
    await expect(lessonHeading(page)).toBeVisible({ timeout: 15_000 }); // the lesson is reopened
    await page.getByRole('tab', { name: 'Explore' }).click();
    await expectExplore(page, FS_MELODIC_MINOR);
    expect(await savedSelection(page)).toEqual(FS_SAVED);
  });

  test('a closed tab in the middle of a lesson, reopened: the lesson comes back, and Explore still has F# melodic minor', async ({ page }) => {
    await seedExplore(page);
    await openLesson(page);
    const context = page.context();
    await page.close();

    const reopened = await context.newPage();
    await reopened.goto('/');
    await expect(lessonHeading(reopened)).toBeVisible({ timeout: 15_000 });
    await reopened.getByRole('tab', { name: 'Explore' }).click();
    await expectExplore(reopened, FS_MELODIC_MINOR);
  });

  test('a closed tab whose saved lesson has expired: Learn opens on the levels, and Explore still has F# melodic minor', async ({ page }) => {
    await seedExplore(page);
    await openLesson(page);
    // A day passes: the saved lesson position is older than the session's 24 h.
    await page.evaluate(() => {
      const key = 'fermata-learn-session-v1';
      const blob = JSON.parse(localStorage.getItem(key)!);
      blob.state.screen.at = Date.now() - 25 * 60 * 60 * 1000;
      localStorage.setItem(key, JSON.stringify(blob));
    });
    const context = page.context();
    await page.close();

    const reopened = await context.newPage();
    await reopened.goto('/');
    await expect(reopened.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
    await expect(lessonHeading(reopened)).toHaveCount(0);
    await reopened.getByRole('tab', { name: 'Explore' }).click();
    await expectExplore(reopened, FS_MELODIC_MINOR);
  });

  test('"Open in Explore" after a reload keeps the lesson\'s selection there — and after the next reload too', async ({ page }) => {
    await seedExplore(page);
    await openLesson(page);
    await page.reload();
    await expect(lessonHeading(page)).toBeVisible({ timeout: 15_000 });

    // The first concept's Try This is "C major scale".
    await page.getByTestId('inline-try-this').first().getByRole('button', { name: 'Open in Explore' }).click();
    await expectExplore(page, C_MAJOR);
    await page.reload();
    await expectExplore(page, C_MAJOR);
  });
});
