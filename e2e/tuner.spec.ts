import { test, expect, type Browser, type Page } from '@playwright/test';
import { launchWithFakeMic, micContext, micFixture, RECORD_STREAMS, tapMicOn, turnOnMic } from './helpers/micFixtures';

/**
 * Wave 3, brief T, and the one microphone switch (brief U): the microphone,
 * through Chromium's real capture path — a fake device fed from a WAV file
 * of known notes (e2e/helpers/micFixtures.ts). On the dev server and on the
 * production build (`playwright.preview.config.ts` serves vercel.json's
 * headers, so the microphone opens there under the production
 * Permissions-Policy, `microphone=(self)`).
 *
 *  - The guitar's "Tune", the switch at the tuner's top: the low E a little
 *    flat is named E, string 6, "flat", "tighten"; in tune reads "In tune".
 *    "⋯" → Tuner works too.
 *  - The auto-off table, each row ending with no live track (asserted on the
 *    tracks themselves) and, where there is one, a true sentence: the view
 *    changed, the page hidden, the tuner closed over Drill, the tour asked
 *    for, three minutes with no note (the page's clock advanced), refused,
 *    missing, busy, unplugged.
 *  - The switch in a real chord_build check: C, E and G played one at a
 *    time are EMITTED (services/externalNotes.ts) and, through the one
 *    listener (stream K), fill the answer.
 */

const E2_FLAT = micFixture('e2-flat', [{ midi: 40, cents: -18, seconds: 2.4 }, { silence: 0.1 }]);
const E2_IN_TUNE = micFixture('e2-in-tune', [{ midi: 40, cents: 1, seconds: 2.4 }, { silence: 0.1 }]);
const C_E_G = micFixture('c-e-g', [
  { midi: 60, seconds: 0.9 }, { silence: 0.35 },
  { midi: 64, seconds: 0.9 }, { silence: 0.35 },
  { midi: 67, seconds: 0.9 }, { silence: 0.8 },
]);

const SAVE = (instrument: 'guitar' | 'piano', lastView: 'explore' | 'learn') =>
  JSON.stringify({ state: { instrument, lastView, language: 'en', themeMode: 'fermata' }, version: 6 });

async function openApp(browser: Browser, baseURL: string, instrument: 'guitar' | 'piano', lastView: 'explore' | 'learn' = 'explore', init?: () => void) {
  const context = await micContext(browser, baseURL, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('tuner-seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('tuner-seeded', '1');
  }, SAVE(instrument, lastView));
  await context.addInitScript(RECORD_STREAMS);
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  return { context, page };
}

/** The tracks the page opened, by state. */
const tracks = (page: Page) => page.evaluate(() => {
  const all = ((window as unknown as { __micStreams?: MediaStream[] }).__micStreams ?? []).flatMap((s) => s.getTracks());
  return { live: all.filter((t) => t.readyState === 'live').length, ended: all.filter((t) => t.readyState === 'ended').length };
});

async function openTunerFromDock(page: Page) {
  await page.getByTestId('dock-tune').click();
  const sheet = page.getByRole('dialog', { name: /^Tuner/ });
  await expect(sheet).toBeVisible();
  return sheet;
}

async function hideThePage(page: Page) {
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
}

const SILENCE = micFixture('silence', [{ silence: 1 }]);

/** The top bar's switch (Explore). */
const barSwitch = (page: Page) => page.locator('[data-testid="mic-switch"][data-place="bar"]');

test.describe('the tuner hears the low E string a little flat', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(E2_FLAT);
  });
  test.afterAll(async () => {
    await browser.close();
  });

  test('Tune → the switch at its top: E, string 6, flat, tighten; closed over Explore it stays on (the top bar says so), the top bar\'s switch turns it off: no track', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'guitar');
    // On the production build (preview serves vercel.json's headers) the page
    // is served with the policy that lets it use the microphone; the dev
    // server sends no such headers.
    const headers = (await page.request.get('/')).headers();
    if (headers['content-security-policy']) expect(headers['permissions-policy']).toBe('camera=(), microphone=(self), geolocation=()');
    const sheet = await openTunerFromDock(page);
    await expect(sheet.getByText('To tell you which note you play and whether it is in tune, Fermata listens through the microphone; the sound never leaves this device.')).toBeVisible();
    await expect(sheet.getByRole('button', { name: 'Microphone' })).toHaveAttribute('aria-pressed', 'false');
    expect(await tracks(page)).toEqual({ live: 0, ended: 0 });
    await turnOnMic(sheet);
    await expect(sheet.getByRole('button', { name: 'Microphone' })).toHaveText('Microphone On');
    const reading = sheet.getByTestId('tuner-reading');
    await expect(reading).toHaveAttribute('data-state', 'flat', { timeout: 10_000 });
    await expect(sheet.getByTestId('tuner-note')).toHaveText('E');
    await expect(sheet.getByTestId('tuner-target')).toHaveText('String 6 · E');
    await expect(sheet.getByTestId('tuner-words')).toHaveText(/^\d+ cents flat \(too low\)$/);
    // The reading is smoothed: it eases in from the note's first frames, so
    // the first "flat" frame can still be on its way (−9 seen under load).
    // Same bounds, read once it has settled.
    await expect
      .poll(async () => Number(await reading.getAttribute('data-cents')), { message: 'the fixture is 18 cents flat', timeout: 5_000 })
      .toBeGreaterThanOrEqual(-24);
    await expect.poll(async () => Number(await reading.getAttribute('data-cents')), { timeout: 5_000 }).toBeLessThanOrEqual(-12);
    const cents = Number(await reading.getAttribute('data-cents'));
    expect(cents, 'the fixture is 18 cents flat').toBeGreaterThanOrEqual(-24);
    expect(cents).toBeLessThanOrEqual(-12);
    await expect(sheet.getByText('Tighten the string a little.')).toBeVisible();
    expect(await tracks(page)).toEqual({ live: 1, ended: 0 });
    await sheet.getByRole('button', { name: 'Close the tuner' }).click();
    await expect(sheet).toHaveCount(0);
    // Explore can use what is played: still on, and the top bar's switch says so.
    expect(await tracks(page)).toEqual({ live: 1, ended: 0 });
    await expect(barSwitch(page)).toHaveAttribute('aria-pressed', 'true');
    await barSwitch(page).click();
    await expect(barSwitch(page)).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(() => tracks(page)).toEqual({ live: 0, ended: 1 });
    await context.close();
  });

  test('the page hidden while listening: no track running, and it says so', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'guitar');
    const sheet = await openTunerFromDock(page);
    await turnOnMic(sheet);
    await hideThePage(page);
    await expect.poll(() => tracks(page)).toEqual({ live: 0, ended: 1 });
    await expect(sheet.getByTestId('tuner-message')).toHaveText('Listening stopped because Fermata was no longer on screen (for example, you switched to another app or tab).');
    await expect(sheet.getByRole('button', { name: 'Microphone' })).toHaveAttribute('aria-pressed', 'false');
    await context.close();
  });

  test('"⋯" → Tuner with the piano: the note heard, no strings', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'piano');
    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Tuner' }).click();
    const sheet = page.getByRole('dialog', { name: /^Tuner/ });
    await turnOnMic(sheet);
    await expect(sheet.getByTestId('tuner-note')).toHaveText('E', { timeout: 10_000 });
    await expect(sheet.getByTestId('tuner-strings')).toHaveCount(0);
    await context.close();
  });

  // ─── The auto-off table (brief U), each row ending with no live track ───
  test('off: the view changes (Explore → Learn): no sentence, no track', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'piano');
    await turnOnMic(page);
    expect(await tracks(page)).toEqual({ live: 1, ended: 0 });
    await page.getByRole('tab', { name: 'Learn' }).click();
    await expect.poll(() => tracks(page)).toEqual({ live: 0, ended: 1 });
    await page.getByRole('tab', { name: 'Explore' }).click();
    await expect(barSwitch(page)).toHaveAttribute('data-state', 'off');
    await expect(page.getByTestId('mic-bar-note')).toHaveCount(0);
    await context.close();
  });

  test('off: the tuner closes over Drill (nothing behind it can use a played note): no track; Drill\'s top bar has no switch', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'piano');
    await page.getByRole('tab', { name: 'Drill' }).click();
    await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('mic-switch')).toHaveCount(0);
    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Tuner' }).click();
    const sheet = page.getByRole('dialog', { name: /^Tuner/ });
    await turnOnMic(sheet);
    expect(await tracks(page)).toEqual({ live: 1, ended: 0 });
    await sheet.getByRole('button', { name: 'Close the tuner' }).click();
    await expect.poll(() => tracks(page)).toEqual({ live: 0, ended: 1 });
    await context.close();
  });

  test('off: the tour is asked for ("⋯" → Show me around): the switch leaves the bar, no track', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'piano');
    await turnOnMic(page);
    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Show me around' }).click();
    await expect.poll(() => tracks(page)).toEqual({ live: 0, ended: 1 });
    await expect(page.getByTestId('mic-switch')).toHaveCount(0);
    await context.close();
  });

  test('off: the microphone unplugged (its track ends): a true sentence under the bar, no track', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'piano');
    await turnOnMic(page);
    await page.evaluate(() => {
      const t = (window as unknown as { __micStreams: MediaStream[] }).__micStreams[0].getAudioTracks()[0];
      t.dispatchEvent(new Event('ended'));
    });
    await expect.poll(() => tracks(page)).toEqual({ live: 0, ended: 1 });
    await expect(page.getByTestId('mic-problem')).toHaveText('The microphone was disconnected, so listening stopped.');
    await expect(barSwitch(page)).toHaveAttribute('aria-pressed', 'false');
    await context.close();
  });
});

test.describe('three minutes with no note heard (the page\'s clock advanced)', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(SILENCE);
  });
  test.afterAll(async () => {
    await browser.close();
  });

  test('on in Explore, nothing played: on at 2:59, off at 3:00 with its sentence under the bar; no track', async ({ baseURL }) => {
    test.setTimeout(60_000);
    const context = await micContext(browser, baseURL!, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.addInitScript((blob) => {
      if (sessionStorage.getItem('tuner-seeded')) return;
      localStorage.setItem('music-theory-app', blob);
      sessionStorage.setItem('tuner-seeded', '1');
    }, SAVE('piano', 'explore'));
    await context.addInitScript(RECORD_STREAMS);
    const page = await context.newPage();
    await page.clock.install();
    await page.goto('/');
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await turnOnMic(page);
    expect(await tracks(page)).toEqual({ live: 1, ended: 0 });
    await page.clock.fastForward('02:58');
    await page.waitForTimeout(300);
    await expect(barSwitch(page)).toHaveAttribute('aria-pressed', 'true');
    expect(await tracks(page)).toEqual({ live: 1, ended: 0 });
    await page.clock.fastForward('00:03');
    await expect(barSwitch(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('mic-problem')).toHaveText('The microphone turned itself off: no note was heard for three minutes.');
    await expect.poll(() => tracks(page)).toEqual({ live: 0, ended: 1 });
    // Until the next tap: a tap anywhere else closes the line.
    await page.getByTestId('explore-root').click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('mic-bar-note')).toHaveCount(0);
    await context.close();
  });
});

test.describe('the tuner reads the low E in tune', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(E2_IN_TUNE);
  });
  test.afterAll(async () => {
    await browser.close();
  });

  test('In tune ✓', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'guitar');
    const sheet = await openTunerFromDock(page);
    await turnOnMic(sheet);
    await expect(sheet.getByTestId('tuner-reading')).toHaveAttribute('data-state', 'inTune', { timeout: 10_000 });
    await expect(sheet.getByTestId('tuner-words')).toHaveText('In tune ✓');
    await context.close();
  });
});

test.describe('when the microphone cannot be used', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(E2_FLAT);
  });
  test.afterAll(async () => {
    await browser.close();
  });

  for (const [name, error, sentence] of [
    ['refused', 'NotAllowedError', "The microphone is blocked for Fermata, so the tuner can't hear you."],
    ['missing', 'NotFoundError', "No microphone was found on this device, so the tuner can't hear you."],
    ['busy', 'NotReadableError', "The microphone couldn't start: another app may be using it. Close it, then try again."],
  ] as const) {
    test(`${name}: off, a true sentence, Hear still works, no track`, async ({ baseURL }) => {
      const { context, page } = await openApp(browser, baseURL!, 'guitar', 'explore');
      // The browser's own answer, as it gives it (DOMException name).
      await page.evaluate((errorName) => {
        navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('no', errorName));
      }, error);
      const sheet = await openTunerFromDock(page);
      await tapMicOn(sheet);
      await expect(sheet.getByTestId('tuner-message')).toContainText(sentence);
      await expect(sheet.getByTestId('tuner-message')).toContainText('You can still tune by ear: “Hear” plays each string.');
      await expect(sheet.getByRole('button', { name: 'Microphone' })).toHaveAttribute('aria-pressed', 'false');
      await sheet.getByRole('button', { name: 'Hear string 6, E' }).click();
      await expect(sheet.getByText(/^Fermata is playing string 6 \(E\)/)).toBeVisible();
      expect(await tracks(page)).toEqual({ live: 0, ended: 0 });
      await context.close();
    });
  }
});

test.describe('refused by the browser itself', () => {
  // The browser itself refuses (its fake permission UI set to deny), as a learner's "Block" does.
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(E2_FLAT, 'deny');
  });
  test.afterAll(async () => {
    await browser.close();
  });

  test('the permission refused: no track, a true sentence, Hear still works', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'guitar');
    const sheet = await openTunerFromDock(page);
    await tapMicOn(sheet);
    await expect(sheet.getByTestId('tuner')).toHaveAttribute('data-phase', 'problem', { timeout: 10_000 });
    await expect(sheet.getByTestId('tuner-message')).toContainText("The microphone is blocked for Fermata, so the tuner can't hear you.");
    await expect(sheet.getByTestId('tuner-message')).toContainText("To allow it, open this site's settings");
    expect(await tracks(page)).toEqual({ live: 0, ended: 0 });
    await sheet.getByRole('button', { name: 'Hear string 1, E' }).click();
    await expect(sheet.getByText(/^Fermata is playing string 1 \(E\)/)).toBeVisible();
    await context.close();
  });

  test('the switch in a check, refused: off, a true sentence, the screen still answers', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, 'piano', 'learn');
    await page.goto('/?lesson=l1u3m4');
    const start = page.getByRole('button', { name: 'Start the check' });
    await start.scrollIntoViewIfNeeded();
    await start.click();
    const checkAnswer = page.getByRole('button', { name: 'Check Answer' });
    for (let i = 0; i < 12 && !(await checkAnswer.count()); i++) await answerChoice(page);
    await tapMicOn(page.getByTestId('check-mic'));
    await expect(page.getByTestId('mic-problem')).toHaveText("The microphone is blocked for Fermata. To allow it, open this site's settings (beside the address, or your phone's settings for this browser). You can still answer on the screen.");
    await expect(page.getByTestId('check-mic').getByRole('button', { name: 'Microphone' })).toHaveAttribute('aria-pressed', 'false');
    expect(await tracks(page)).toEqual({ live: 0, ended: 0 });
    await expect(checkAnswer).toBeVisible();
    await context.close();
  });
});

async function answerChoice(page: Page) {
  const answers = page.getByTestId('check-answers');
  await answers.locator('button[data-state="open"]').last().click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(300);
  if ((await answers.locator('[data-state="tried"]').count()) && !(await answers.locator('[data-state="answer"]').count())) {
    await answers.locator('button[data-state="open"]').first().click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(300);
  }
  const cont = page.getByRole('button', { name: /^(Continue|Next)$/ });
  if (await cont.count()) await cont.first().click();
  await page.waitForTimeout(300);
}

test.describe('answering a check by playing', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(C_E_G);
  });
  test.afterAll(async () => {
    await browser.close();
  });

  test('the switch in a real chord_build check emits C, E and G as they are played', async ({ baseURL }) => {
    test.setTimeout(90_000);
    const { context, page } = await openApp(browser, baseURL!, 'piano', 'learn');
    await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press('Control+k');
    const search = page.getByRole('dialog', { name: 'Quick search' });
    await search.locator('input').fill('Major Triads');
    await search.getByRole('button', { name: /^Your First Chords — Major Triads/ }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'Your First Chords — Major Triads' })).toBeVisible({ timeout: 15_000 });
    const start = page.getByRole('button', { name: 'Start the check' });
    await start.scrollIntoViewIfNeeded();
    await start.click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
    const checkAnswer = page.getByRole('button', { name: 'Check Answer' });
    for (let i = 0; i < 12 && !(await checkAnswer.count()); i++) await answerChoice(page);
    await expect(checkAnswer, 'reached a chord_build question').toBeVisible();

    // What reaches the contract: a probe through the dev server's own module
    // (the production build has no /src; there the "Heard" line is the proof).
    const dev = await page.evaluate(async () => /javascript/.test((await fetch('/src/services/externalNotes.ts')).headers.get('content-type') ?? ''));
    if (dev) {
      await page.evaluate(`(async () => {
        const m = await import('/src/services/externalNotes.ts');
        const seen = [];
        window.__emitted = seen;
        m.subscribeExternalNotes((n) => seen.push(n));
      })()`);
    }

    const zone = page.getByTestId('check-mic');
    const toggle = zone.getByRole('button', { name: 'Microphone' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(zone.getByText('With the microphone on, the notes you play are added to your answer.')).toBeVisible();
    // The top bar shows the same switch while the check is open.
    await expect(page.getByTestId('app-topbar').getByRole('button', { name: 'Microphone' })).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect(page.getByText('To hear the notes you play, Fermata listens through the microphone; the sound never leaves this device.')).toBeVisible();
    await page.getByRole('button', { name: 'Turn on the microphone' }).click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('app-topbar').getByRole('button', { name: 'Microphone' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('mic-heard')).toHaveText(/^Heard: (C|E|G)$/, { timeout: 10_000 });

    if (dev) {
      await expect.poll(async () => page.evaluate(() => {
        const ons = ((window as unknown as { __emitted: { midi: number; on: boolean; source: string }[] }).__emitted).filter((n) => n.on);
        return [...new Set(ons.map((n) => `${n.midi}:${n.source}`))].sort();
      }), { timeout: 15_000 }).toEqual(['60:mic', '64:mic', '67:mic']);
      const sequence = await page.evaluate(() => (window as unknown as { __emitted: { midi: number; on: boolean }[] }).__emitted.map((n) => `${n.midi}${n.on ? '+' : '-'}`));
      // One at a time: every note ends before the next one starts.
      for (let i = 1; i < sequence.length; i++) {
        if (sequence[i].endsWith('+')) expect(sequence[i - 1], sequence.join(' ')).toMatch(/-$/);
      }
    }
    expect(await tracks(page)).toEqual({ live: 1, ended: 0 });

    // The answer fills in, through the one listener (stream K; integration).
    await expect.poll(async () => (await page.getByTestId('check-answer-zone').locator('span.rounded-md').allTextContents()).sort(), { timeout: 15_000 }).toEqual(['C', 'E', 'G']);

    // Leaving the check stops the microphone.
    await page.getByRole('button', { name: 'Exit the check' }).click();
    await expect.poll(() => tracks(page)).toEqual({ live: 0, ended: 1 });
    await context.close();
  });

  test('the answer fills in from the notes played (through the one listener)', async ({ baseURL }) => {
    test.setTimeout(90_000);
    const { context, page } = await openApp(browser, baseURL!, 'piano', 'learn');
    await expect(page.getByRole('heading', { name: 'Learn Music Theory' })).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press('Control+k');
    const search = page.getByRole('dialog', { name: 'Quick search' });
    await search.locator('input').fill('Major Triads');
    await search.getByRole('button', { name: /^Your First Chords — Major Triads/ }).first().click();
    await page.getByRole('button', { name: 'Start the check' }).click();
    const checkAnswer = page.getByRole('button', { name: 'Check Answer' });
    for (let i = 0; i < 12 && !(await checkAnswer.count()); i++) await answerChoice(page);
    await turnOnMic(page.getByTestId('check-mic'));
    await expect.poll(async () => (await page.getByTestId('check-answer-zone').locator('span.rounded-md').allTextContents()).sort(), { timeout: 15_000 }).toEqual(['C', 'E', 'G']);
    await context.close();
  });
});
