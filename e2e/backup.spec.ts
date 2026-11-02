import { test, expect, type Page } from '@playwright/test';

/**
 * Backup round trip (audit F-09 / R-02): export the persisted stores, wipe
 * them, import the file, and verify the data returns intact. Export / Import
 * live in Settings ("⋯" → Settings → Your data) since W11-A.
 */

const PROGRESS_KEY = 'music-theory-progress';

async function openSettings(page: Page) {
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
}

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

    // Export from Settings.
    await openSettings(page);
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export backup' }).click();
    const download = await downloadPromise;
    const filePath = await download.path();
    expect(filePath).toBeTruthy();

    // Wipe the store and confirm it is gone.
    await page.evaluate((key) => localStorage.removeItem(key), PROGRESS_KEY);
    expect(await page.evaluate((key) => localStorage.getItem(key), PROGRESS_KEY)).toBeNull();

    // Import: accept the confirm dialog; the app writes to localStorage and
    // reloads itself. Poll the store rather than racing the self-reload.
    // The reload is COUNTED (W11-A): the store check alone also passed when
    // the import wrote localStorage but never reloaded the app.
    let navigations = 0;
    page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) navigations++; });
    page.on('dialog', (dialog) => void dialog.accept());
    const fileChooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import backup' }).click();
    await (await fileChooser).setFiles(filePath!);

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
    await expect.poll(() => navigations, { timeout: 10_000 }).toBeGreaterThan(0);
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
    await openSettings(page);
    const fileChooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import backup' }).click();
    await (await fileChooser).setFiles({
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
