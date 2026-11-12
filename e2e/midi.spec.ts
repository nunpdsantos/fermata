import { test, expect, type Browser, type Page } from '@playwright/test';
import { installFakeMidi, noteOn, noteOff, sendMidi, midiCalls, recordVoice, voiceLog, soundingNow } from './helpers/fakeMidi';
import { levelCorpus } from '../src/data/exercises/__tests__/learnCorpus';
import { buildChord } from '../src/core/constants/chords';
import { getPitchClass } from '../src/core/constants/notes';
import type { Accidental, ChordQuality, NaturalNote } from '../src/core/types/music';

/**
 * Wave 3, stream K — a MIDI keyboard, end to end in a real browser (the dev
 * server). Web MIDI is faked BEFORE the app loads (e2e/helpers/fakeMidi.ts):
 * a MIDIAccess delivering real byte messages. NO REAL KEYBOARD is involved.
 *  - Explore: turning it on in Settings asks once, for the least (no sysex,
 *    no software synths), and names the keyboard; C–E–G pressed lights the
 *    three keys, sounds them in the instrument voice (recorded on the app's
 *    own core audio seam — dev server only) and names the last in the dock's
 *    read-out; releasing ends them; the time from the MIDI message to the
 *    call that starts the sound is measured and reported;
 *  - a lesson's "Build a C major triad" check answered from the keyboard
 *    (every build of the check, in fact), graded right;
 *  - the cable pulled mid-chord releases everything;
 *  - a later visit: turned on again only if the browser still allows it
 *    (the permission granted); otherwise nothing is asked.
 */

const SAVE = {
  instrument: 'piano', language: 'en', baseOctave: 4, selectedKey: { natural: 'F', accidental: '' },
  selectedScale: 'major', scaleOctaves: 1, themeMode: 'fermata',
};

async function open(browser: Browser, state: Record<string, unknown>, opts: { grant?: boolean } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  if (opts.grant) await context.grantPermissions(['midi']);
  await installFakeMidi(context);
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { ...SAVE, ...state }, version: 6 }));
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await expect(page.getByTestId('instrument-dock')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);
  return { context, page };
}

async function turnOnInSettings(page: Page) {
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  const row = page.getByTestId('midi-setting');
  await row.scrollIntoViewIfNeeded();
  const chip = row.getByRole('button', { name: 'Use a MIDI keyboard' });
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await chip.click();
  await expect(row.getByTestId('midi-status')).toHaveText('Connected: Test Piano');
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('settings-sheet')).toHaveCount(0);
  // The mouse left over a piano key would be the focus note (hover wins over the last note played).
  await page.mouse.move(2, 2);
}

const key = (page: Page, midi: number) => page.locator(`[data-piano-key][data-midi="${midi}"]`);

test('Explore: C–E–G on the keyboard sounds and lights them and names the last; releasing ends them', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, { lastView: 'explore' });
  // Off by default: nothing asked, no mark.
  expect(await midiCalls(page)).toEqual([]);
  await expect(page.getByTestId('midi-mark')).toHaveCount(0);
  const dev = await recordVoice(page);
  await turnOnInSettings(page);
  expect(await midiCalls(page)).toEqual([{ sysex: false, software: false }]);
  await expect(page.getByTestId('midi-mark')).toBeVisible();
  await expect(page.getByTestId('midi-mark')).toHaveAttribute('aria-label', 'MIDI keyboard connected');

  for (const m of [60, 64, 67]) await sendMidi(page, noteOn(m));
  for (const m of [60, 64, 67]) await expect(key(page, m)).toHaveAttribute('aria-pressed', 'true');
  await expect(key(page, 62)).toHaveAttribute('aria-pressed', 'false');
  // The read-out names the last note played (G; in F major, the 2nd).
  await expect(page.getByTestId('dock-readout')).toContainText(/^G\b/);
  if (dev) {
    expect(await soundingNow(page)).toEqual([60, 64, 67]);
    const delays = (await voiceLog(page)).filter((c) => c.op === 'start').map((c) => c.delayMs);
    test.info().annotations.push({ type: 'latency', description: `MIDI message → voice.startNote: ${delays.map((d) => d.toFixed(2)).join(', ')} ms` });
    console.log(`[midi latency] MIDI message → voice.startNote (ms): ${delays.map((d) => d.toFixed(2)).join(', ')}`);
    for (const d of delays) expect(d, 'the sound starts in the same turn as the MIDI message').toBeLessThan(16);
  } else {
    test.info().annotations.push({ type: 'note', description: 'the sound is recorded on the dev server only (/src modules): not checked on this build' });
  }
  for (const m of [60, 64, 67]) await sendMidi(page, noteOff(m));
  for (const m of [60, 64, 67]) await expect(key(page, m)).toHaveAttribute('aria-pressed', 'false');
  if (dev) expect(await soundingNow(page)).toEqual([]);
  // The saved field says "on".
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.midiKeyboard);
  expect(saved).toBe(true);
  await context.close();
});

test('the cable pulled mid-chord releases everything', async ({ browser }) => {
  test.setTimeout(90_000);
  const { context, page } = await open(browser, { lastView: 'explore' });
  const dev = await recordVoice(page);
  await turnOnInSettings(page);
  for (const m of [60, 64, 67]) await sendMidi(page, noteOn(m));
  await sendMidi(page, [0xb0, 64, 127]); // the pedal down too
  for (const m of [60, 64, 67]) await expect(key(page, m)).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => (window as unknown as { __midi: { unplug: (id: string) => void } }).__midi.unplug('kbd'));
  for (const m of [60, 64, 67]) await expect(key(page, m)).toHaveAttribute('aria-pressed', 'false');
  if (dev) expect(await soundingNow(page)).toEqual([]);
  await expect(page.getByTestId('midi-mark')).toHaveCount(0);
  // Plugged back in: heard again.
  await page.evaluate(() => (window as unknown as { __midi: { plug: (id: string, n: string) => void } }).__midi.plug('kbd', 'Test Piano'));
  await expect(page.getByTestId('midi-mark')).toBeVisible();
  await sendMidi(page, noteOn(62));
  await expect(key(page, 62)).toHaveAttribute('aria-pressed', 'true');
  await context.close();
});

test('a later visit: back on only while the browser still allows it; otherwise nothing is asked', async ({ browser }) => {
  test.setTimeout(90_000);
  {
    const { context, page } = await open(browser, { lastView: 'explore', midiKeyboard: true }, { grant: true });
    await expect(page.getByTestId('midi-mark')).toBeVisible();
    expect(await midiCalls(page)).toEqual([{ sysex: false, software: false }]);
    await context.close();
  }
  {
    const { context, page } = await open(browser, { lastView: 'explore', midiKeyboard: true });
    await page.waitForTimeout(800);
    expect(await midiCalls(page)).toEqual([]);
    await expect(page.getByTestId('midi-mark')).toHaveCount(0);
    // Not allowed any more: the saved "on" goes.
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('music-theory-app')!).state.midiKeyboard);
    expect(saved).toBeUndefined();
    await context.close();
  }
});

/** prompt → the build's pitch classes; prompt|options → the keyed choice (the app's own corpus, read in Node). */
function answerKey() {
  const build = new Map<string, number[]>();
  const choice = new Map<string, string>();
  for (const { moduleId, exercise } of levelCorpus(1, 'en')) {
    if (moduleId !== 'l1u3m4') continue;
    const c = exercise.config;
    if (c.type === 'chord_build') {
      const root = { natural: c.root as NaturalNote, accidental: (c.rootAccidental || '') as Accidental };
      build.set(exercise.prompt, [...new Set(buildChord(root, c.quality as ChordQuality).notes.map(getPitchClass))]);
    } else if (c.type === 'multiple_choice' || (c.type === 'ear_training' && c.choices)) {
      const choices = c.choices!;
      choice.set(`${exercise.prompt}|${choices.map((x) => x.label).sort().join('§')}`, choices.find((x) => x.correct)!.label);
    }
  }
  return { build, choice };
}

test('a lesson\'s "Build a C major triad" check answered from the keyboard is graded right', async ({ browser }) => {
  test.setTimeout(180_000);
  const { build, choice } = answerKey();
  expect([...build.keys()].some((p) => p.startsWith('Build a C major triad')), 'the corpus has the C major build').toBe(true);
  const { context, page } = await open(browser, { lastView: 'learn', dockDetents: { explore: 'half', learn: 'peek' } });
  await turnOnInSettings(page);
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog', { name: 'Quick search' });
  await search.locator('input').fill('Your First Chords');
  await search.getByRole('button', { name: /^Your First Chords/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: /Your First Chords/ })).toBeVisible();
  await page.getByRole('button', { name: 'Start the check' }).click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  let builtC = false;
  for (;;) {
    const pos = (await page.getByTestId('check-position').textContent())!.trim();
    const [cur, total] = pos.split(/\s*\/\s*/).map(Number);
    const prompt = (await page.getByTestId('check-prompt').textContent())!.trim();
    const pcs = build.get(prompt);
    if (pcs) {
      // Played on the keyboard: each key down and up, in octave 4 (the check takes pitch classes).
      for (const pc of pcs) {
        await sendMidi(page, noteOn(60 + pc));
        await sendMidi(page, noteOff(60 + pc));
      }
      // Nothing is submitted by playing: the learner does that.
      await expect(page.getByTestId('check-pips').locator(`i:nth-child(${cur})`)).toHaveAttribute('data-score', 'now');
      await page.getByRole('button', { name: 'Check Answer', exact: true }).click();
      await expect(page.getByTestId('check-pips').locator(`i:nth-child(${cur})`)).toHaveAttribute('data-score', '1');
      if (prompt.startsWith('Build a C major triad')) {
        builtC = true;
        await expect(page.locator('[data-tone="correct"]')).toContainText('Correct');
      }
    } else {
      const answers = page.getByTestId('check-answers');
      const labels = await answers.locator('button').evaluateAll((bs) => bs.map((b) => b.getAttribute('data-answer') ?? ''));
      const right = choice.get(`${prompt}|${[...labels].sort().join('§')}`);
      if (right) await answers.locator(`button[data-answer="${right.replace(/"/g, '\\"')}"]`).click();
      else await answers.locator('button[data-state="open"]').last().click();
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      if (!right && !(await answers.locator('[data-state="answer"]').count())) {
        await answers.locator('button[data-state="open"]').last().click();
        await page.getByRole('button', { name: 'Submit', exact: true }).click();
      }
    }
    await page.getByRole('button', { name: /^(Continue|Next)$/, exact: true }).click();
    if (cur === total) break;
    await expect(page.getByTestId('check-position')).not.toHaveText(pos);
  }
  expect(builtC, 'the C major build was asked and answered').toBe(true);
  await context.close();
});
