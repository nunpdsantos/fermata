import { test, expect, type Page } from '@playwright/test';

/**
 * Real Learn exercise journey (audit R-02): answer wrong, see hint, retry
 * using the revealed answer, submit correct, walk the full set to the
 * summary, and confirm completion stays gated behind the pass threshold.
 */

// Each Learn screen is a [data-learn-screen] frame; a frame that is animating
// OUT is inert. Scoping every locator to the CURRENT screen (identified by
// its heading) keeps a click from landing on the outgoing one — the flake
// was "click the module" hitting the Level page's fading Continue banner,
// whose text also says "The Staff and Clefs" (audit W9-08 / F-10).
function screenWithHeading(page: Page, heading: string | RegExp) {
  return page
    .locator('#learn-panel [data-learn-screen]:not([inert])')
    .filter({ has: page.getByRole('heading', { level: 1, name: heading }) });
}

async function openStaffAndClefs(page: Page) {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Learn' }).click();

  const overview = screenWithHeading(page, 'Learn');
  const level1 = overview.getByRole('button').filter({ hasText: 'Foundations of Music Literacy' });
  await expect(level1).toBeVisible({ timeout: 10_000 });
  await level1.click();

  const levelPage = screenWithHeading(page, 'Foundations of Music Literacy');
  await expect(levelPage).toBeVisible({ timeout: 10_000 });
  // The unit card ("Unit 1 · Notation and Pitch"), never the Continue banner
  // above it (which also names the unit, but not "Unit 1").
  await levelPage.getByRole('button').filter({ hasText: /Unit 1/i }).filter({ hasText: 'Notation and Pitch' }).first().click();

  const unitPage = screenWithHeading(page, 'Notation and Pitch');
  const module = unitPage.getByRole('button').filter({ hasText: 'The Staff and Clefs' }).first();
  await expect(module).toBeVisible({ timeout: 10_000 });
  await module.click();

  await expect(screenWithHeading(page, 'The Staff and Clefs').getByText('Exercises', { exact: true })).toBeVisible({ timeout: 10_000 });
}

test.describe('Learn — exercise journey', () => {
  test('wrong answer → hint + retry with revealed answer → correct; set reaches summary; completion stays gated', async ({ page }) => {
    test.slow(); // full-set walk takes ~25 s under parallel worker load
    await openStaffAndClefs(page);

    const choiceGrid = page.locator('#learn-panel .grid.grid-cols-2');
    await expect(choiceGrid.first()).toBeVisible({ timeout: 10_000 });

    let sawRetryFlow = false;

    // Walk the whole set (bounded loop — sets are well under 20 exercises).
    for (let i = 0; i < 20; i++) {
      const summaryVisible = await page.getByText(/Exercises Complete!|Keep Practicing/).count();
      if (summaryVisible > 0) break;

      const options = choiceGrid.first().locator('button');
      await expect(options.first()).toBeVisible({ timeout: 10_000 });

      // Deliberately pick the LAST option first (arbitrary guess).
      await options.last().click();
      await page.getByRole('button', { name: 'Submit' }).click();

      const tryAgain = page.getByRole('button', { name: 'Try Again' });
      if (await tryAgain.count()) {
        sawRetryFlow = true;
        // Feedback reveals the correct option (semantic success text); remember it.
        const revealed = await page.locator('#learn-panel button.text-success').first().textContent();
        expect(revealed).toBeTruthy();
        await tryAgain.click();

        // Second attempt with the revealed answer must be correct → 0.5 pts.
        // Exact match: "G" must not select "G#".
        const exact = new RegExp(`^${revealed!.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
        await choiceGrid.first().locator('button').filter({ hasText: exact }).first().click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
        await page.getByRole('button', { name: 'Continue' }).click();
      } else {
        // First try was right (Continue) or second failure (Next).
        const next = page.getByRole('button', { name: /Continue|Next/ });
        await expect(next.first()).toBeVisible();
        await next.first().click();
      }
    }

    // The set finished with a summary either way.
    await expect(page.getByText(/Exercises Complete!|Keep Practicing/)).toBeVisible();
    expect(sawRetryFlow).toBe(true);

    // Retry-heavy runs score ~50% < 80%: completion must stay gated unless
    // the set actually passed.
    const passed = (await page.getByText('Exercises Complete!').count()) > 0;
    if (!passed) {
      await expect(page.getByText('Mark Module Complete')).toHaveCount(0);
    }
  });
});
