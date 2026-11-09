import { test, expect, type Page } from '@playwright/test';
import { WELCOME_KEY } from './helpers/welcome';

/**
 * First visit and finding things (2026-11-09):
 *  - the welcome sheet: shown on empty storage only, never with saved data,
 *    each action, Escape, and never again after a reload — but again after a
 *    reload BEFORE anyone acted on it;
 *  - "Practise on the guitar" in Explore's "⋯", from the piano;
 *  - the offline-ready notice: no card over a phone's page (announced), a card
 *    on a laptop, none at all in the page that showed the welcome.
 */

const welcome = (page: Page) => page.getByRole('dialog', { name: 'Welcome to Fermata' });
const flag = (page: Page) => page.evaluate((k) => localStorage.getItem(k), WELCOME_KEY);

test.describe('the first-visit welcome', () => {
  // Empty storage: the config seeds "seen" for every other spec.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('shown on empty storage over Explore, focus inside; Escape closes it for good', async ({ page }) => {
    await page.goto('/');
    await expect(welcome(page)).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#explore-panel')).toBeVisible();
    await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
    expect(await flag(page)).toBe('pending');

    // A reload BEFORE acting on it: still there (boot has saved settings by now).
    await page.reload();
    await expect(welcome(page)).toBeVisible({ timeout: 15_000 });

    await page.keyboard.press('Escape');
    await expect(welcome(page)).toHaveCount(0);
    expect(await flag(page)).toBe('seen');
    await expect(page.getByRole('tab', { name: 'Explore' })).toBeFocused();
    await page.reload();
    await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(1000); // the lazy sheet would have loaded by now
    await expect(welcome(page)).toHaveCount(0);
  });

  for (const [label, tab, panel] of [
    ['Explore a key', 'Explore', '#explore-panel'],
    ['Start the course', 'Learn', '#learn-panel'],
    ['Try a drill', 'Drill', '#drill-panel'],
  ] as const) {
    test(`"${label}" closes it and opens ${tab}; never shown again after a reload`, async ({ page }) => {
      await page.goto('/');
      await expect(welcome(page)).toBeVisible({ timeout: 15_000 });
      await welcome(page).getByRole('button', { name: label }).click();
      await expect(welcome(page)).toHaveCount(0);
      await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator(panel)).toBeVisible();
      await page.reload();
      await expect(page.locator(panel)).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(1000);
      await expect(welcome(page)).toHaveCount(0);
    });
  }

  for (const key of ['music-theory-app', 'music-theory-progress', 'fermata-drill-v1', 'fermata-fingering-v1', 'fermata-learn-session-v1']) {
    test(`never shown to someone with saved data (${key})`, async ({ page }) => {
      await page.addInitScript((k) => {
        if (!sessionStorage.getItem('e2e:seeded')) {
          sessionStorage.setItem('e2e:seeded', '1');
          localStorage.setItem(k, k === 'music-theory-app' ? JSON.stringify({ state: { lastView: 'explore' }, version: 6 }) : '{}');
        }
      }, key);
      await page.goto('/');
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(1500);
      await expect(welcome(page)).toHaveCount(0);
      expect(await flag(page)).toBeNull();
    });
  }

  test('the page that showed the welcome skips the offline-ready notice', async ({ page }) => {
    await page.goto('/');
    await expect(welcome(page)).toBeVisible({ timeout: 15_000 });
    const raised = await page.evaluate(async () => {
      try { (await import(/* @vite-ignore */ '/src/hooks/usePWA.ts' as string)).showOfflineReady(); return true; } catch { return false; }
    });
    test.skip(!raised, 'needs the dev server\'s /src modules');
    await page.waitForTimeout(300);
    await expect(page.getByRole('alert').filter({ hasText: /offline/i })).toHaveCount(0);
    await welcome(page).getByRole('button', { name: 'Start the course' }).click();
    await page.waitForTimeout(300);
    await expect(page.getByRole('alert').filter({ hasText: /offline/i })).toHaveCount(0);
  });
});

test.describe('the offline-ready notice (no welcome)', () => {
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
