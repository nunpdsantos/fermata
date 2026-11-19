import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { learnScreens, keptScreens, pausedToast, VIEWPORTS, THEMES, isSheet } from './helpers/learnDesignScreens';

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

// What a check or a Sprint left under way says (the Back stream): the lesson card's "kept" line, the choice
// before another run would replace a kept one (over a check, a practice round and a review, the longest title),
// the "kept" and "paused" toasts. Four viewports, day and night; Portuguese and Spanish at 320 px.
const DRILL_SAVE = (() => {
  const save = JSON.parse(readFileSync(new URL('../src/state/__tests__/fixtures/drill-v2-store.json', import.meta.url), 'utf8')) as { state: { items: Record<string, { tier: string }> } };
  for (const item of Object.values(save.state.items)) item.tier = 'review';
  return JSON.stringify(save);
})();
const PHONE_320 = { name: 'phone-320', viewport: { width: 320, height: 568 }, touch: true } as const;
for (const v of VIEWPORTS.slice(0, 4)) {
  for (const th of THEMES) {
    const combo = `${v.name}-${th.name}`;
    test(`${combo}: a kept check — its card, the choice (over a check, a practice round, a review), the kept and paused toasts — pass the design rules`, async ({ browser }) => {
      test.setTimeout(240_000);
      await keptScreens(browser, v, th.mode, combo, 'en');
      await pausedToast(browser, v, th.mode, combo, 'en', DRILL_SAVE);
    });
  }
}
for (const lang of ['pt', 'es'] as const) {
  test(`phone-320-${lang}-day: a kept check, the choice and the toasts in ${lang === 'pt' ? 'Portuguese' : 'Spanish'} pass the design rules`, async ({ browser }) => {
    test.setTimeout(240_000);
    await keptScreens(browser, PHONE_320, 'fermata', `phone-320-${lang}-day`, lang);
    await pausedToast(browser, PHONE_320, 'fermata', `phone-320-${lang}-day`, lang, DRILL_SAVE);
  });
}
