import { test, expect, type Page } from '@playwright/test';

/**
 * Real Learn check journey (audit R-02, redone for W4b / D-09): a wrong first
 * answer shows the hint and strikes the option but NEVER marks the answer;
 * the answer is marked only when the item is final; the set walks to the
 * result screen, which always offers a next step; completion stays gated
 * behind the pass mark.
 */

// Each Learn screen is a [data-learn-screen] frame; a frame that is animating
// OUT is inert. Scoping every locator to the CURRENT screen keeps a click from
// landing on the outgoing one (audit W9-08 / F-10).
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
  await levelPage.getByRole('button').filter({ hasText: /Unit 1/i }).filter({ hasText: 'Notation and Pitch' }).first().click();
  const unitPage = screenWithHeading(page, 'Notation and Pitch');
  const module = unitPage.getByRole('button').filter({ hasText: 'The Staff and Clefs' }).first();
  await expect(module).toBeVisible({ timeout: 10_000 });
  await module.click();
  await expect(screenWithHeading(page, 'The Staff and Clefs')).toBeVisible({ timeout: 10_000 });
}

test.describe('Learn — check journey', () => {
  test('wrong answer → hint, option struck, answer NOT shown → second try → result screen with a next step; completion gated', async ({ page }) => {
    test.slow();
    await openStaffAndClefs(page);
    await page.getByRole('button', { name: 'Start the check' }).click();
    const answers = page.getByTestId('check-answers');
    await expect(answers).toBeVisible({ timeout: 10_000 });

    let sawHintFirst = false;
    for (let i = 0; i < 20; i++) {
      if (await page.getByTestId('check-result').count()) break;
      const open = answers.locator('button[data-state="open"]');
      await open.last().click();
      await page.getByRole('button', { name: 'Submit' }).click();
      if (await page.getByText(/have another go\.$/).count()) {
        sawHintFirst = true;
        // D-09: the hint, the tried option struck — and nothing marks the answer.
        await expect(answers.locator('[data-state="answer"]')).toHaveCount(0);
        await expect(answers.locator('[data-state="tried"]')).toHaveCount(1);
        await answers.locator('button[data-state="open"]').first().click();
        await page.getByRole('button', { name: 'Submit' }).click();
      }
      // Final: the answer is marked now.
      await expect(answers.locator('[data-state="answer"]')).toHaveCount(1);
      await page.getByRole('button', { name: 'Continue' }).click();
    }

    const result = page.getByTestId('check-result');
    await expect(result).toBeVisible();
    expect(sawHintFirst).toBe(true);
    const passed = (await result.getByText(/^Passed/).count()) > 0;
    if (!passed) {
      await expect(page.getByRole('button', { name: 'Start over' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Complete the lesson' })).toHaveCount(0);
    }
    await expect(page.getByRole('button', { name: 'Back to the lesson' })).toBeVisible();
  });
});
