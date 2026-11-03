import { expect, test, type Page } from '@playwright/test';

async function seed(page: Page, view: 'learn' | 'explore') {
  await page.addInitScript((lastView) => {
    localStorage.setItem('music-theory-app', JSON.stringify({ version: 6, state: {
      instrument: 'piano', lastView, language: 'en', baseOctave: 4, selectedKey: { natural: 'C', accidental: '' },
      selectedScale: 'major', scaleOctaves: 1, themeMode: 'fermata', dockDetents: { explore: 'full', learn: 'peek' },
    } }));
  }, view);
  await page.goto('/');
}

async function blackKeyErrors(page: Page) {
  return page.locator('.piano-scroll').evaluate((scroller) => {
    const keys = Array.from(scroller.querySelectorAll<HTMLElement>('[data-piano-key]'));
    const byMidi = new Map(keys.map((key) => [Number(key.dataset.midi), key]));
    const errors = keys.filter((key) => getComputedStyle(key).position === 'absolute').map((black) => {
      const midi = Number(black.dataset.midi);
      const left = byMidi.get(midi - 1)!.getBoundingClientRect();
      const right = byMidi.get(midi + 1)!.getBoundingClientRect();
      const box = black.getBoundingClientRect();
      return { midi, error: Math.abs((box.left + box.right) / 2 - (left.right + right.left) / 2) };
    });
    return { count: keys.length, blackCount: errors.length, bad: errors.filter(({ error }) => error > 2) };
  });
}

// Exhaustive integer widths, including both sides of every breakpoint. Tall
// screens use the dock above 639; short screens force the sheet at every width.
for (const height of [900, 390]) {
  test(`black-key centres at every width 360–1920, height ${height}`, async ({ browser }) => {
    test.setTimeout(240_000);
    const context = await browser.newContext({ viewport: { width: 360, height }, hasTouch: height === 390, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await seed(page, 'explore');
    await expect(page.locator('.piano-scroll')).toBeVisible();
    for (let width = 360; width <= 1920; width++) {
      await page.setViewportSize({ width, height });
      // Allow media-query subscriptions and layout effects to settle.
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      expect(await blackKeyErrors(page), `${width}×${height}`).toEqual({ count: 88, blackCount: 36, bad: [] });
    }
    await context.close();
  });
}

async function openInstrumentQuestion(page: Page) {
  // Search owns Ctrl/Cmd+K only once the shell has mounted (as learn-check waits).
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(800);
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog', { name: 'Quick search' });
  await search.locator('input').fill('The Major Scale');
  await search.getByRole('button', { name: /^The Major Scale/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'The Major Scale' })).toBeVisible();
  await page.getByRole('button', { name: 'Start the check' }).click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  const check = page.getByRole('button', { name: 'Check Answer', exact: true });
  // The real Major Scale check contains 9 choices and 3 instrument builds.
  for (let i = 0; i < 9 && !(await check.count()); i++) {
    const answers = page.getByTestId('check-answers');
    for (let attempt = 0; attempt < 2; attempt++) {
      await answers.locator('button[data-state="open"]').last().click();
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      await expect(answers.locator('[data-state="answer"], [data-state="tried"]')).not.toHaveCount(0);
      if (await answers.locator('[data-state="answer"]').count()) break;
    }
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.waitForTimeout(300); // outgoing question frame becomes inert
  }
  await expect(check).toBeVisible();
  await expect(page.locator('.piano-scroll')).toBeVisible();
}

async function expectOctaveInView(page: Page, octave: number) {
  await expect.poll(() => page.locator('.piano-scroll').evaluate((el, oct) => {
    const box = el.getBoundingClientRect();
    const c = el.querySelector(`[data-midi="${12 + oct * 12}"]`)!.getBoundingClientRect();
    const b = el.querySelector(`[data-midi="${23 + oct * 12}"]`)!.getBoundingClientRect();
    const ideal = (c.left + b.right) / 2 - box.left + el.scrollLeft - el.clientWidth / 2;
    const clamped = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, ideal));
    return c.left >= box.left - 2 && b.right <= box.right + 2 && Math.abs(el.scrollLeft - clamped) <= 2;
  }, octave)).toBe(true);
}

const VIEWPORTS = [
  [360, 800], [390, 844], [640, 900], [768, 1024], [1024, 768],
  [1280, 800], [1366, 768], [1440, 900], [1536, 864], [1920, 1080], [844, 390],
] as const;
for (const [width, height] of VIEWPORTS) {
  test(`Learn octave visible on entry, chip changes and rotation at ${width}×${height}`, async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1024 || height < 500, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await seed(page, 'learn');
    await openInstrumentQuestion(page);
    await expectOctaveInView(page, 4);
    const chooser = page.getByRole('radiogroup', { name: 'Base octave', exact: true });
    for (const octave of [1, 5, 7, 4]) {
      await chooser.getByRole('radio', { name: `C${octave}`, exact: true }).click();
      await expectOctaveInView(page, octave);
    }
    // Selecting a pitch lights that pitch class in all octaves; it must not
    // make navigation jump to the centre of the entire 88-key highlight set.
    const c4 = page.locator('[data-piano-key][data-midi="60"]');
    const keyBox = (await c4.boundingBox())!;
    await c4.click({ position: { x: keyBox.width / 2, y: keyBox.height * 0.85 } });
    await expect(page.getByRole('button', { name: 'Check Answer', exact: true })).toBeEnabled();
    await expectOctaveInView(page, 4);
    await page.setViewportSize({ width: height, height: width });
    await expectOctaveInView(page, 4);
    await context.close();
  });
}
