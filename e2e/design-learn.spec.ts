import { test, expect } from '@playwright/test';
import { learnScreens, VIEWPORTS, THEMES, isSheet } from './helpers/learnDesignScreens';

for (const v of VIEWPORTS) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo}: W4b Learn screens pass the design rules`, async ({ browser }) => {
      test.setTimeout(240_000);
      await learnScreens(browser, v, th.mode, combo, 'en');
      expect(isSheet(v) || v.viewport.width >= 768).toBe(true);
    });
  }
}

test('phone-pt-day: W4b Learn screens in Portuguese pass the design rules', async ({ browser }) => {
  test.setTimeout(240_000);
  await learnScreens(browser, VIEWPORTS[0], 'fermata', 'phone-pt-day', 'pt');
});
