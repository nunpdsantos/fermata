import { test, expect } from '@playwright/test';

test.describe('Learn flow — curriculum navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to Learn view
    await page.getByRole('tab', { name: 'Learn' }).click();
    await expect(page.locator('#learn-panel')).toBeVisible();
  });

  test('Learn view shows heading and level cards', async ({ page }) => {
    // Main heading
    await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible();

    // At least one level card button should be visible (there are 9 levels)
    // Level cards render as buttons with the level title text
    const levelButtons = page.locator('#learn-panel button').filter({ hasText: /Foundations|Expanding|Harmony|Diatonic|Chromaticism|Chromatic|Jazz|Analysis|Ear Training/i });
    await expect(levelButtons.first()).toBeVisible({ timeout: 10_000 });

    // Should have multiple level cards
    const count = await levelButtons.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('can click into Level 1', async ({ page }) => {
    // Wait for level cards to appear, then click the first one (Level 1)
    const level1 = page.locator('#learn-panel button').filter({ hasText: 'Foundations of Music Literacy' });
    await expect(level1).toBeVisible({ timeout: 10_000 });
    await level1.click();

    // Should now see unit cards within Level 1 detail view
    // Level detail shows unit cards with unit titles
    // Look for "Unit" text that appears in the breadcrumb or unit cards
    await expect(page.getByText(/unit/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('welcome banner shows Start Level 1 for fresh user', async ({ page }) => {
    // With no progress, we should see the welcome banner
    const startButton = page.getByRole('button', { name: 'Start Level 1' });
    await expect(startButton).toBeVisible({ timeout: 10_000 });
  });
});
