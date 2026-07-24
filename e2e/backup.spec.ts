import { test, expect } from '@playwright/test';

/**
 * Backup round trip (audit F-09 / R-02): export the persisted stores, wipe
 * them, import the file, and verify the data returns intact.
 */

const PROGRESS_KEY = 'music-theory-progress';

test.describe('Progress backup', () => {
  test('export → wipe → import restores Learn progress', async ({ page }) => {
    await page.goto('/');

    // Seed a distinctive, valid progress envelope.
    const seeded = {
      state: { completedModules: ['l1u1m1'], completedTasks: {}, exerciseResults: {} },
      version: 0,
    };
    await page.evaluate(
      ([key, value]) => localStorage.setItem(key as string, JSON.stringify(value)),
      [PROGRESS_KEY, seeded] as const,
    );

    // Export from the Backup menu.
    await page.getByRole('button', { name: 'Backup' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'Export backup' }).click();
    const download = await downloadPromise;
    const filePath = await download.path();
    expect(filePath).toBeTruthy();

    // Wipe the store and confirm it is gone.
    await page.evaluate((key) => localStorage.removeItem(key), PROGRESS_KEY);
    expect(await page.evaluate((key) => localStorage.getItem(key), PROGRESS_KEY)).toBeNull();

    // Import: accept the confirm dialog; the app writes to localStorage and
    // reloads itself. Poll the store rather than racing the self-reload.
    page.on('dialog', (dialog) => void dialog.accept());
    await page.getByRole('button', { name: 'Backup' }).click();
    await page.getByRole('menuitem', { name: 'Import backup' }).click();
    await page.locator('input[type="file"]').setInputFiles(filePath!);

    await expect
      .poll(
        () => page.evaluate(
          (key) => JSON.parse(localStorage.getItem(key) ?? 'null')?.state?.completedModules ?? null,
          PROGRESS_KEY,
        ),
        { timeout: 10_000 },
      )
      .toEqual(['l1u1m1']);
    await expect(page.locator('#root')).not.toBeEmpty();
  });
});
