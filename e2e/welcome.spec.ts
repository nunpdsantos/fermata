import { test, expect } from '@playwright/test';

/**
 * Finding things (2026-11-09):
 *  - "Practise on the guitar" in Explore's "⋯", from the piano;
 *  - the offline-ready notice: no card over a phone's page (announced), a card
 *    on a laptop.
 * The first-visit welcome sheet tested here until wave 1 was replaced by the
 * start screen: e2e/start-screen.spec.ts (it also checks that the page that
 * showed it skips the offline-ready notice).
 */

test.describe('the offline-ready notice (no start screen)', () => {
  for (const vp of [{ width: 390, height: 844, card: false }, { width: 844, height: 390, card: false }, { width: 1440, height: 900, card: true }]) {
    test(`${vp.width}×${vp.height}: ${vp.card ? 'a card' : 'announced, no card over the page'}`, async ({ browser }) => {
      const touch = vp.width < 1000;
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: touch, isMobile: touch && vp.width < 640, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      await page.goto('/?view=learn');
      await expect(page.locator('#learn-panel')).toBeVisible({ timeout: 15_000 });
      const raised = await page.evaluate(async () => {
        try { (await import(/* @vite-ignore */ '/src/hooks/usePWA.ts' as string)).showOfflineReady(); return true; } catch { return false; }
      });
      test.skip(!raised, 'needs the dev server\'s /src modules');
      if (vp.card) {
        await expect(page.locator('.toast-card').filter({ hasText: 'App ready for offline use' })).toBeVisible();
      } else {
        await expect(page.getByTestId('offline-ready-status')).toHaveText('App ready for offline use');
        await page.waitForTimeout(300);
        await expect(page.locator('.toast-card')).toHaveCount(0);
      }
      await context.close();
    });
  }
});

test.describe('"Practise on the guitar" from the piano', () => {
  for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    test(`${vp.width}×${vp.height}: "⋯" offers it; it switches to the guitar and opens the practice panel`, async ({ browser }) => {
      const touch = vp.width < 1000;
      const context = await browser.newContext({ viewport: vp, hasTouch: touch, isMobile: touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
      await context.addInitScript(() => {
        if (sessionStorage.getItem('e2e:seeded')) return;
        sessionStorage.setItem('e2e:seeded', '1');
        localStorage.setItem('music-theory-app', JSON.stringify({ state: { instrument: 'piano', lastView: 'explore', language: 'en' }, version: 6 }));
      });
      const page = await context.newPage();
      await page.goto('/');
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('practice-open')).toHaveCount(0); // the toolbar button: guitar only, unchanged
      await page.getByRole('button', { name: 'Scale actions' }).click();
      await page.getByRole('menuitem', { name: 'Practise on the guitar' }).click();
      await expect(page.getByTestId('practice-sheet')).toBeVisible();
      await expect(page.getByRole('dialog', { name: 'Practise on the guitar' })).toBeVisible();
      const instrument = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.instrument);
      expect(instrument).toBe('guitar');
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('practice-sheet')).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Scale actions' })).toBeFocused();
      await context.close();
    });
  }
});
