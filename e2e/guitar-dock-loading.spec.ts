import { test, expect } from '@playwright/test';

/**
 * Review item 3 (W9): the fretboard is a lazy chunk; while it downloaded,
 * the dock collapsed to a 20 px spinner (piano 199 → 20 → fretboard 400 px
 * on a phone). The loading dock must keep roughly the fretboard's height.
 * The chunk is held back by a route so the loading state is observable;
 * service workers are blocked so the route sees the request.
 */
test.use({ serviceWorkers: 'block' });

const FRETBOARD_CHUNK = /\/Fretboard(\.tsx|-[\w-]+\.js)(\?.*)?$/;

for (const vp of [{ w: 1280, h: 900 }, { w: 390, h: 844 }]) {
  test(`guitar dock keeps its height while the fretboard loads (${vp.w}x${vp.h})`, async ({ page, context }) => {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    let release!: () => void;
    const gate = new Promise<void>((r) => { release = r; });
    await context.route(FRETBOARD_CHUNK, async (route) => { await gate; await route.continue(); });

    await page.goto('/');
    const dock = page.locator('[data-tour="play-note"]');
    await expect(dock).toBeVisible();
    await page.getByRole('tab', { name: 'Guitar' }).click();
    await expect(dock.getByTestId('view-loading')).toBeVisible();
    const loading = (await dock.boundingBox())!.height;

    release();
    await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(300);
    const loaded = (await dock.boundingBox())!.height;

    expect(loading).toBeGreaterThanOrEqual(250);
    expect(loading).toBeGreaterThanOrEqual(loaded * 0.75);
    expect(loading).toBeLessThanOrEqual(loaded * 1.25);
  });
}
