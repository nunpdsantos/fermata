import { test, expect } from '@playwright/test';

/**
 * Backup round trip (audit F-09 / R-02): export the persisted stores, wipe
 * them, import the file, and verify the data returns intact.
 */

const PROGRESS_KEY = 'music-theory-progress';

test.describe('Progress backup', () => {
  test('export → wipe → import restores Learn progress', async ({ page }) => {
    await page.goto('/');

    // Seed a distinctive progress envelope in the exact shape the progress
    // store persists (W9-18: import vets each section with its store's guard,
    // and the old fixture — raw progress at version 0 — is one the store
    // would have replaced with EMPTY progress after the reload).
    const seeded = {
      state: {
        progress: { completedModules: ['l1u1m1'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} },
      },
      version: 1,
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

    // A poll that lands while the page is reloading itself loses its
    // execution context — that is "not yet", not a failure (seen once in a
    // full parallel run after validation became async in W9-18).
    await expect
      .poll(
        () => page.evaluate(
          (key) => JSON.parse(localStorage.getItem(key) ?? 'null')?.state?.progress?.completedModules ?? null,
          PROGRESS_KEY,
        ).catch(() => null),
        { timeout: 10_000 },
      )
      .toEqual(['l1u1m1']);
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('a backup whose progress section is malformed is refused before the confirm step (W9-18)', async ({ page }) => {
    await page.goto('/');
    const real = {
      state: { progress: { completedModules: ['l1u1m1', 'l1u1m2'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} } },
      version: 1,
    };
    await page.evaluate(([key, value]) => localStorage.setItem(key as string, JSON.stringify(value)), [PROGRESS_KEY, real] as const);

    const bad = {
      format: 'fermata-backup',
      version: 1,
      exportedAt: '2026-10-30T12:00:00.000Z',
      data: { [PROGRESS_KEY]: { state: { completedModules: ['l1u1m1'] }, version: 0 } },
    };
    let dialogs = 0;
    page.on('dialog', (dialog) => { dialogs++; void dialog.dismiss(); });
    await page.getByRole('button', { name: 'Backup' }).click();
    await page.getByRole('menuitem', { name: 'Import backup' }).click();
    await page.locator('input[type="file"]').setInputFiles({
      name: 'bad-backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(bad)),
    });

    await expect(page.getByText(/not a valid Fermata backup|invalid/i).first()).toBeVisible({ timeout: 10_000 });
    expect(dialogs).toBe(0);
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), PROGRESS_KEY);
    expect(stored?.state?.progress?.completedModules).toEqual(['l1u1m1', 'l1u1m2']);
  });
});
