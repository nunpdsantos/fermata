import { test, expect, type Page } from '@playwright/test';

/**
 * Drill's first visit (brief 2026-11-09): a fresh browser opened Drill
 * straight on "1 of 4 · Scale degree 1 is called…?". Now it opens on a short
 * intro; Start begins the session; the intro never comes back. And a miss no
 * longer grows the total ("1 of 4" → "1 of 5" was observed).
 */

async function openFresh(page: Page) {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { lastView: 'drill', language: 'en' }, version: 6 }));
    sessionStorage.setItem('__seeded', '1');
  });
  await page.goto('/');
}

const counter = (page: Page) => page.locator('#drill-panel').getByText(/^\d+ of \d+$/);

test('a fresh browser opens Drill on the intro; settings and back; Start begins; never again after a reload', async ({ page }) => {
  await openFresh(page);
  const panel = page.locator('#drill-panel');
  const intro = panel.getByTestId('drill-intro');
  await expect(intro).toBeVisible({ timeout: 15_000 });
  await expect(intro.getByRole('heading', { name: 'Quick questions on music facts' })).toBeVisible();
  await expect(intro.getByText('Key signatures')).toBeVisible();
  await expect(intro.getByText('A session is up to 24 questions. Your first one is shorter: just the new facts.')).toBeVisible();
  await expect(counter(page)).toHaveCount(0);

  // The settings link opens Drill's own settings; Back returns to the intro.
  await intro.getByRole('button', { name: /Choose topics/ }).click();
  await expect(panel.getByRole('heading', { name: 'Drill settings' })).toBeVisible();
  await panel.getByRole('button', { name: 'Back' }).click();
  await expect(intro).toBeVisible();

  await intro.getByRole('button', { name: 'Start' }).click();
  await expect(intro).toHaveCount(0);
  await expect(counter(page)).toHaveText('1 of 4');

  // A wrong answer: the missed fact will come back, the total stays 4.
  for (let i = 0; i < 14; i++) {
    const choices = panel.getByTestId('drill-answers').locator('button:not([disabled])');
    const count = await choices.count();
    if (!count) break;
    await choices.nth(Math.min(1, count - 1)).click();
    const done = panel.locator('button:not([disabled])').filter({ hasText: /^Done$/ });
    if (await done.count()) await done.first().click();
    await page.waitForTimeout(500);
    if (await panel.getByRole('button', { name: 'Continue', exact: true }).count()) break;
    await page.waitForTimeout(700); // a right answer moves on by itself
  }
  await expect(panel.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
  await expect(counter(page)).toHaveText(/^\d of 4$/);

  await page.reload();
  await expect(counter(page)).toBeVisible({ timeout: 15_000 });
  await expect(panel.getByTestId('drill-intro')).toHaveCount(0);
});
