import { test, expect, type Page, type Request } from '@playwright/test';

/**
 * First-visit weight (audit W9-10 / W8-03 / D-22), in a real browser.
 * Works on the dev server (/src/... module URLs) and the preview build
 * (/assets/<name>-<hash>.js).
 */

function track(page: Page, pattern: RegExp): string[] {
  const urls: string[] = [];
  page.on('request', (r: Request) => {
    if (pattern.test(r.url())) urls.push(r.url());
  });
  return urls;
}

test('no piano samples download until the first key press', async ({ page }) => {
  const samples = track(page, /\/samples\/(piano|guitar)\//);
  await page.goto('/');
  await expect(page.getByRole('button', { name: /^C4$/ }).first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(4000); // the old code fetched all 30 on the first idle slot (≤ 3 s)
  expect(samples).toEqual([]);

  await page.getByRole('button', { name: /^C4$/ }).first().click();
  await expect.poll(() => samples.length, { timeout: 10_000 }).toBeGreaterThan(0);
  expect(samples.every((u) => u.includes('/samples/piano/'))).toBe(true); // only the selected instrument
});

test('opening Learn downloads one curriculum level for the Continue banner, not nine', async ({ page }) => {
  const levels = track(page, /curriculumL\d[^/]*\.(js|ts)(\?|$)/);
  await page.goto('/');
  await page.getByRole('tab', { name: 'Learn' }).click();
  await expect(page.getByText(/^continue$/i).first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);
  const distinct = new Set(levels.map((u) => u.match(/curriculumL(\d)/)![1]));
  expect([...distinct]).toEqual(['1']);
});

test('notation uses only the Bravura music font (no Gonville / Petaluma)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('svg text').first()).toBeAttached({ timeout: 20_000 }); // a staff rendered
  await page.waitForTimeout(1000);
  const families = await page.evaluate(() => {
    const out: string[] = [];
    document.fonts.forEach((f) => out.push(f.family.replace(/["']/g, '')));
    return out;
  });
  expect(families).toContain('Bravura');
  expect(families.filter((f) => /Gonville|Petaluma/.test(f))).toEqual([]);
});
