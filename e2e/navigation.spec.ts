import { test, expect } from '@playwright/test';

test.describe('Navigation — first load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('app loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Wait for the app to finish rendering
    await expect(page.locator('#root')).not.toBeEmpty();

    // Allow React dev-mode warnings, but no hard errors
    const realErrors = errors.filter(
      (msg) => !msg.includes('Warning:') && !msg.includes('DevTools'),
    );
    expect(realErrors).toHaveLength(0);
  });

  test('three view tabs are visible (Explore, Learn, Drill)', async ({ page }) => {
    const tablist = page.getByRole('tablist', { name: 'App views' });
    await expect(tablist).toBeVisible();

    await expect(page.getByRole('tab', { name: 'Explore' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Learn' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Drill' })).toBeVisible();
  });

  test('Explore tab is selected by default', async ({ page }) => {
    const exploreTab = page.getByRole('tab', { name: 'Explore' });
    await expect(exploreTab).toHaveAttribute('aria-selected', 'true');
  });

  test('can switch between views', async ({ page }) => {
    // Switch to Learn
    await page.getByRole('tab', { name: 'Learn' }).click();
    await expect(page.getByRole('tab', { name: 'Learn' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('#learn-panel')).toBeVisible();

    // Switch back to Explore
    await page.getByRole('tab', { name: 'Explore' }).click();
    await expect(page.getByRole('tab', { name: 'Explore' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('#explore-panel')).toBeVisible();
  });

  test('instrument region is visible at the bottom', async ({ page }) => {
    const instrument = page.getByRole('region', { name: /instrument/i });
    await expect(instrument).toBeVisible();
  });
});
