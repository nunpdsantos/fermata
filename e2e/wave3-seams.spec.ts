import { test, expect, type Browser, type BrowserContext, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { launchWithFakeMic, micContext, micFixture, RECORD_STREAMS } from './helpers/micFixtures';
import { installFakeMidi, noteOn, noteOff, sendMidi } from './helpers/fakeMidi';
import { PHONE, LAPTOP, LOCALE, type View } from './helpers/wave1';
import { levelCorpus } from '../src/data/exercises/__tests__/learnCorpus';
import { buildChord } from '../src/core/constants/chords';
import { buildScale } from '../src/core/constants/scales';
import { getPitchClass } from '../src/core/constants/notes';
import type { Accidental, ChordQuality, NaturalNote, ScaleType } from '../src/core/types/music';

/**
 * The seams between wave 3's three branches (integration, 2026-11-11) — the
 * microphone (T), MIDI keyboards (K), the metronome (M) — each in a real
 * browser. What needs no browser is in src/__tests__/wave3Seams.test.tsx,
 * src/components/learn/exercises/__tests__/answerListening.test.tsx and
 * src/state/__tests__/wave3Fields.test.ts.
 *   1. the microphone answers a check        6. one menu
 *   2. the app does not hear itself          7. (saved fields: wave3Fields.test)
 *   3. one microphone session per check      8. the header
 *   4. MIDI and the microphone together      9. the owner
 *   5. the metronome and everything else    10. a newcomer, by playing
 * The microphone is Chromium's fake device fed from WAV files of known notes
 * (e2e/helpers/micFixtures.ts); MIDI is a fake MIDIAccess delivering byte
 * messages (e2e/helpers/fakeMidi.ts). No real instrument is involved. A step
 * that reads the app's own modules (/src/…) runs on the dev server only and
 * says so on the production build; every other step runs on both.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

const C_E_G = micFixture('w3-c-e-g', [
  { midi: 60, seconds: 0.9 }, { silence: 0.35 },
  { midi: 64, seconds: 0.9 }, { silence: 0.35 },
  { midi: 67, seconds: 0.9 }, { silence: 0.8 },
]);
/** A steady E4, looping (the learner holding one note). */
const E4 = micFixture('w3-e4', [{ midi: 64, seconds: 4 }]);
/** A steady C4 (what the speaker's C would sound like in the room). */
const C4 = micFixture('w3-c4', [{ midi: 60, seconds: 4 }]);

type Settings = Record<string, unknown>;

async function openApp(browser: Browser, baseURL: string, v: View, settings: Settings, opts: { midi?: boolean; grant?: string[] } = {}) {
  const context = await micContext(browser, baseURL, {
    viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block', locale: LOCALE.en,
  });
  if (opts.grant) await context.grantPermissions(opts.grant);
  if (opts.midi) await installFakeMidi(context);
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__w3seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__w3seeded', '1');
  }, JSON.stringify({ state: { language: 'en', themeMode: 'fermata', instrument: 'piano', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', ...settings }, version: 6 }));
  await context.addInitScript(RECORD_STREAMS);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  return { context, page };
}

/** The tracks the page got from getUserMedia, by state. */
const tracks = (page: Page) => page.evaluate(() => {
  const streams = (window as unknown as { __micStreams?: MediaStream[] }).__micStreams ?? [];
  const all = streams.flatMap((s) => s.getTracks());
  return { streams: streams.length, live: all.filter((t) => t.readyState === 'live').length, ended: all.filter((t) => t.readyState === 'ended').length };
});

/** Does the server serve the app's own modules (the dev server)? A build must be the one with a manifest. */
async function devModules(page: Page): Promise<boolean> {
  const res = await page.request.get('/src/services/externalNotes.ts');
  const dev = res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
  if (!dev) {
    const manifest = await page.request.get('/manifest.webmanifest');
    expect((manifest.headers()['content-type'] ?? '').includes('json'), 'a build without /src modules serves the manifest').toBe(true);
    test.info().annotations.push({ type: 'note', description: 'steps that read the app\'s own modules run on the dev server only' });
  }
  return dev;
}

/** Dev only: every note reported through the contract, kept on window.__notes with its time. */
async function probeNotes(page: Page) {
  await page.evaluate(`(async () => {
    const m = await import('/src/services/externalNotes.ts');
    window.__notes = [];
    m.subscribeExternalNotes((n) => window.__notes.push({ ...n, t: performance.now() }));
  })()`);
}
type Heard = { midi: number; on: boolean; source: string; t: number };
const notesHeard = (page: Page) => page.evaluate(() => (window as unknown as { __notes: Heard[] }).__notes);
const micOns = async (page: Page) => (await notesHeard(page)).filter((n) => n.source === 'mic' && n.on).map((n) => n.midi);

/** Dev only: what core audio is asked to sound, recorded on its voice seam (the MIDI spec's recorder). */
async function recordVoice(page: Page) {
  await page.evaluate(`(async () => {
    const audio = await import('/src/core/services/audio.ts');
    window.__voice = [];
    audio.setInstrumentVoice({
      playNote: (midi) => { window.__voice.push({ op: 'play', midi }); return true; },
      startNote: (midi) => { window.__voice.push({ op: 'start', midi }); return true; },
      stopNote: (midi) => { window.__voice.push({ op: 'stop', midi }); },
      setVolume: () => {}, resume: () => Promise.resolve(), cancelScheduled: () => {},
    });
  })()`);
}
const voiceLog = (page: Page) => page.evaluate(() => (window as unknown as { __voice: { op: string; midi: number }[] }).__voice);

const pianoKey = (page: Page, midi: number) => page.locator(`[data-piano-key][data-midi="${midi}"]`).first();

/** prompt|sorted options → the keyed answer; prompt → a build's pitch classes (the app's own corpus, read in Node). */
function answerKey(modulePrefix: string) {
  const choice = new Map<string, string>();
  const build = new Map<string, number[]>();
  for (const { moduleId, exercise } of levelCorpus(1, 'en')) {
    if (!moduleId.startsWith(modulePrefix)) continue;
    const c = exercise.config;
    const choices = c.type === 'multiple_choice' ? c.choices : c.type === 'ear_training' ? c.choices : undefined;
    if (choices) choice.set(`${exercise.prompt}|${choices.map((x) => x.label).sort().join('§')}`, choices.find((x) => x.correct)!.label);
    else if (c.type === 'chord_build' || c.type === 'scale_build') {
      const root = { natural: c.root as NaturalNote, accidental: (c.rootAccidental || '') as Accidental };
      const notes = c.type === 'chord_build' ? buildChord(root, c.quality as ChordQuality).notes : buildScale(root, c.scaleType as ScaleType).notes;
      build.set(exercise.prompt, [...new Set(notes.map(getPitchClass))]);
    }
  }
  return { choice, build };
}
type Key = ReturnType<typeof answerKey>;
const prompt = async (page: Page) => (await page.getByTestId('check-prompt').textContent())!.trim();
const position = async (page: Page) => (await page.getByTestId('check-position').textContent())!.trim();
const chips = (page: Page) => page.getByTestId('check-answer-zone').locator('span.rounded-md').allTextContents();

/** Answer the question on screen, right, on the screen; then Continue. */
async function answerOnScreen(page: Page, key: Key) {
  const pos = await position(page);
  const p = await prompt(page);
  const answers = page.getByTestId('check-answers');
  if (await answers.count()) {
    const labels = await answers.locator('button').evaluateAll((bs) => bs.map((b) => b.getAttribute('data-answer') ?? ''));
    const right = key.choice.get(`${p}|${[...labels].sort().join('§')}`);
    expect(right, `answer for "${p}"`).toBeTruthy();
    await answers.locator(`button[data-answer="${right!.replace(/"/g, '\\"')}"]`).click();
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
  } else {
    const pcs = key.build.get(p);
    expect(pcs, `build for "${p}"`).toBeTruthy();
    const have = (await chips(page)).length;
    if (have === 0) {
      for (const pc of pcs!) {
        const k = page.locator(`[data-piano-key][data-midi="${60 + pc}"]:visible`).first();
        await k.scrollIntoViewIfNeeded();
        const box = (await k.boundingBox())!;
        await k.click({ position: { x: box.width / 2, y: box.height * 0.8 } });
      }
    }
    await page.getByRole('button', { name: 'Check Answer', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForTimeout(250);
  if (await page.getByTestId('check-position').count()) await expect(page.getByTestId('check-position')).not.toHaveText(pos);
}

/** Open a lesson's check (a lesson link) and answer on the screen until `want` is the question. */
async function checkUntil(page: Page, lesson: string, key: Key, want: (prompt: string) => boolean) {
  await page.goto(`/?lesson=${lesson}`);
  const start = page.getByRole('button', { name: 'Start the check' });
  await start.scrollIntoViewIfNeeded();
  await start.click();
  await expect(page.getByTestId('focused-check')).toBeVisible();
  for (let i = 0; i < 30; i++) {
    if (want(await prompt(page))) return;
    await answerOnScreen(page, key);
  }
  throw new Error('the question never came');
}

/** "⋯" → Tuner, Start listening (the microphone allowed by the fake UI). */
async function openTunerListening(page: Page) {
  await page.getByRole('button', { name: /^More/ }).click();
  await page.getByRole('menuitem', { name: 'Tuner' }).click();
  const sheet = page.getByRole('dialog', { name: /^Tuner/ });
  await expect(sheet).toBeVisible();
  await sheet.getByRole('button', { name: 'Start listening' }).click();
  await expect(sheet.getByTestId('listening-mark')).toBeVisible({ timeout: 10_000 });
  return sheet;
}

async function useMyInstrument(page: Page) {
  await page.getByRole('button', { name: 'Use my instrument' }).click();
  await expect(page.getByText('To hear the notes you play, Fermata listens through the microphone; the sound never leaves this device.')).toBeVisible();
  await page.getByRole('button', { name: 'Allow the microphone' }).click();
  await expect(page.getByTestId('use-my-instrument').getByTestId('listening-mark')).toBeVisible({ timeout: 10_000 });
}

const C_MAJOR_L1 = 'Build a C major triad. Select the 3 notes: root, major 3rd, and perfect 5th.';

// ─── 1. The microphone answers a check ─────────────────────────────────────
test.describe('1. the microphone answers a check', () => {
  let browser: Browser;
  test.beforeAll(async () => { browser = await launchWithFakeMic(C_E_G); });
  test.afterAll(async () => { await browser.close(); });

  test('a real chord_build check: C, E and G played fill the answer and it is graded right; a mic note is never sounded', async ({ baseURL }) => {
    test.setTimeout(120_000);
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'learn' });
    const key = answerKey('l1u3m4');
    await checkUntil(page, 'l1u3m4', key, (p) => p === C_MAJOR_L1);
    const dev = await devModules(page);
    if (dev) {
      await probeNotes(page);
      await recordVoice(page);
    }
    await useMyInstrument(page);
    await expect.poll(async () => (await chips(page)).sort(), { timeout: 20_000 }).toEqual(['C', 'E', 'G']);
    await page.getByRole('button', { name: 'Check Answer', exact: true }).click();
    const cur = Number((await position(page)).split('/')[0]);
    await expect(page.getByTestId('check-pips').locator(`i:nth-child(${cur})`)).toHaveAttribute('data-score', '1');
    if (dev) {
      expect([...new Set(await micOns(page))].sort()).toEqual([60, 64, 67]);
      // Nothing heard by the microphone reached the audio engine.
      expect((await voiceLog(page)).filter((c) => c.op === 'start' || c.op === 'play')).toEqual([]);
    }
    expect((await tracks(page)).live).toBe(1);
    await page.getByRole('button', { name: 'Exit the check' }).click();
    await expect.poll(() => tracks(page)).toEqual({ streams: 1, live: 0, ended: 1 });
    await context.close();
  });

  test('Explore: the tuner\'s "Show what I play on the instrument" lights the note heard', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'explore' });
    await expect(page.getByTestId('instrument-dock')).toBeVisible({ timeout: 15_000 });
    const sheet = await openTunerListening(page);
    await sheet.getByTestId('tuner-show').click();
    await expect.poll(async () => {
      for (const m of [60, 64, 67]) if ((await pianoKey(page, m).getAttribute('aria-pressed')) === 'true') return true;
      return false;
    }, { timeout: 15_000 }).toBe(true);
    await sheet.getByRole('button', { name: 'Close the tuner' }).click();
    await expect.poll(() => tracks(page)).toEqual({ streams: 1, live: 0, ended: 1 });
    for (const m of [60, 64, 67]) await expect(pianoKey(page, m)).toHaveAttribute('aria-pressed', 'false');
    await context.close();
  });
});

// ─── 2. The app does not hear itself ───────────────────────────────────────
test.describe('2. the app does not hear itself', () => {
  let browser: Browser;
  test.beforeAll(async () => { browser = await launchWithFakeMic(E4); });
  test.afterAll(async () => { await browser.close(); });

  /** For `ms`, the tuner names E (the microphone hears it) and the key is never lit (no note reported). */
  async function hearsButReportsNothing(page: Page, sheet: ReturnType<Page['getByRole']>, ms: number) {
    await expect(sheet.getByTestId('tuner-note')).toHaveText('E', { timeout: 10_000 });
    const end = Date.now() + ms;
    while (Date.now() < end) {
      expect(await pianoKey(page, 64).getAttribute('aria-pressed'), 'the app\'s own sound reported as the learner\'s note').toBe('false');
      await page.waitForTimeout(100);
    }
  }

  test('nothing playing: E held is reported (the known positive)', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'explore' });
    const sheet = await openTunerListening(page);
    await sheet.getByTestId('tuner-show').click();
    await expect(pianoKey(page, 64)).toHaveAttribute('aria-pressed', 'true', { timeout: 10_000 });
    await context.close();
  });

  test('while the Progression loop plays: the tuner still reads E, no note is reported', async ({ baseURL }) => {
    test.setTimeout(60_000);
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'explore', progression: { chords: ['G', 'D', 'Em', 'C'], bpm: 120, beats: 4 } });
    const dev = await devModules(page);
    await page.getByTestId('progression-toggle').click();
    await expect(page.getByTestId('progression-panel')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('progression-panel').getByRole('button', { name: /^Loop/ }).click();
    if (dev) await probeNotes(page);
    const sheet = await openTunerListening(page);
    await sheet.getByTestId('tuner-show').click();
    // Four chords of four beats at 120 a minute: a cycle lasts 8 s. Watched for 9 s, so at least one handover from
    // one cycle to the next (queued 0.75 s before the end) is heard too (wave 3 final review: 3 s saw part of one).
    await hearsButReportsNothing(page, sheet, 9000);
    if (dev) expect(await micOns(page)).toEqual([]);
    await context.close();
  });

  test('while the metronome clicks (240 a minute: one click into the next): the tuner reads E, no note is reported, and it keeps time', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'explore', metronome: { bpm: 240, beats: 4 } });
    const dev = await devModules(page);
    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Metronome' }).click();
    await page.getByTestId('metronome-play').click();
    await expect(page.getByTestId('metronome')).toHaveAttribute('data-running', 'true');
    if (dev) await probeNotes(page);
    const sheet = await openTunerListening(page);
    await sheet.getByTestId('tuner-show').click();
    await hearsButReportsNothing(page, sheet, 3000);
    if (dev) {
      expect(await micOns(page)).toEqual([]);
      const log = await page.evaluate(`(async () => (await import('/src/services/metronome/clickVoice.ts')).clickLog())()`) as { at: number; cancelledAt: number | null }[];
      expect(log.length, 'the metronome kept clicking while the tuner listened').toBeGreaterThan(10);
      expect(log.filter((c) => c.cancelledAt !== null && c.cancelledAt < c.at)).toEqual([]);
    }
    await context.close();
  });

  test('while the tuner plays a string ("Hear", the guitar voice called directly): no note is reported', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'explore', instrument: 'guitar' });
    const sheet = await openTunerListening(page);
    await sheet.getByTestId('tuner-show').click();
    // The known positive first, then the reference string.
    const fret = page.locator('[data-testid="instrument-dock"] [aria-pressed="true"], [data-testid="instrument-dock"] [data-active="true"]');
    await expect.poll(async () => fret.count(), { timeout: 10_000 }).toBeGreaterThan(0);
    await sheet.getByRole('button', { name: 'Hear string 1, E' }).click();
    await expect.poll(async () => fret.count(), { timeout: 2_000 }).toBe(0);
    const end = Date.now() + 2500;
    while (Date.now() < end) {
      expect(await fret.count(), 'the reference string reported as the learner\'s note').toBe(0);
      await page.waitForTimeout(100);
    }
    await context.close();
  });
});

// ─── 3. One microphone session per check ───────────────────────────────────
test.describe('3. one microphone session for the whole check', () => {
  let browser: Browser;
  test.beforeAll(async () => { browser = await launchWithFakeMic(C_E_G); });
  test.afterAll(async () => { await browser.close(); });

  test('turned on in one question: the next questions use the same stream (one request), the mark stays; leaving ends it', async ({ baseURL }) => {
    test.setTimeout(120_000);
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'learn' });
    const key = answerKey('l1u3m4');
    await checkUntil(page, 'l1u3m4', key, (p) => p === C_MAJOR_L1);
    await useMyInstrument(page);
    await expect.poll(async () => (await chips(page)).sort(), { timeout: 20_000 }).toEqual(['C', 'E', 'G']);
    await page.getByRole('button', { name: 'Check Answer', exact: true }).click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    // Every later question: still listening, through the first stream.
    for (let i = 0; i < 3 && (await page.getByTestId('check-position').count()); i++) {
      await expect(page.getByTestId('use-my-instrument').getByTestId('listening-mark')).toBeVisible();
      expect(await tracks(page)).toEqual({ streams: 1, live: 1, ended: 0 });
      // Answer by screen; a build question first clears what the room added.
      if (!(await page.getByTestId('check-answers').count())) {
        await page.getByRole('button', { name: 'Use my instrument' }).click();
        await page.getByRole('button', { name: 'Clear' }).click();
        await answerOnScreen(page, key);
        break;
      }
      await answerOnScreen(page, key);
    }
    // Off, or the check left: no track.
    if (await page.getByRole('button', { name: 'Exit the check' }).count()) await page.getByRole('button', { name: 'Exit the check' }).click();
    await expect.poll(() => tracks(page)).toEqual({ streams: 1, live: 0, ended: 1 });
    await context.close();
  });
});

// ─── 4. MIDI and the microphone together ───────────────────────────────────
test.describe('4. a MIDI keyboard and the microphone together', () => {
  let browser: Browser;
  // The microphone hears a steady C4: what the room would hear of the app sounding the key.
  test.beforeAll(async () => { browser = await launchWithFakeMic(C4); });
  test.afterAll(async () => { await browser.close(); });

  test('a key played is sounded once by the app, not heard back as a second note, and held once in the answer', async ({ baseURL }) => {
    test.setTimeout(120_000);
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'learn', midiKeyboard: true }, { midi: true, grant: ['midi'] });
    const dev = await devModules(page);
    test.skip(!dev, 'the voice seam and the reported notes are read through the dev server\'s own modules');
    const key = answerKey('l1u3m4');
    await checkUntil(page, 'l1u3m4', key, (p) => p === C_MAJOR_L1);
    await probeNotes(page);
    await recordVoice(page);
    await useMyInstrument(page);
    // The MIDI key goes down while the microphone already hears "it".
    await sendMidi(page, noteOn(60));
    await page.waitForTimeout(2500);
    await sendMidi(page, noteOff(60));
    // Held: no mic note at all (the app is sounding).
    const heldEnd = await page.evaluate(() => performance.now());
    const heard = await notesHeard(page);
    expect(heard.filter((n) => n.source === 'mic' && n.on && n.t < heldEnd)).toEqual([]);
    expect((await voiceLog(page)).filter((c) => c.op === 'start')).toEqual([{ op: 'start', midi: 60 }]);
    expect(await chips(page)).toEqual(['C']);
    // Later the room's C is reported; the answer still holds C once.
    await page.waitForTimeout(2000);
    expect(await chips(page)).toEqual(['C']);
    expect((await voiceLog(page)).filter((c) => c.op === 'start')).toEqual([{ op: 'start', midi: 60 }]);
    await context.close();
  });
});

// ─── 5. The metronome and everything else ──────────────────────────────────
test.describe('5. the metronome', () => {
  for (const v of [PHONE, LAPTOP]) {
    test(`${v.name}: the guitar practice sheet open, the bar stands above it: ■ works by pointer and by keyboard, and it is in the sheet's content`, async ({ browser, baseURL }) => {
      const { context, page } = await openApp(browser, baseURL!, v, { lastView: 'explore', instrument: 'guitar' });
      await expect(page.getByTestId('instrument-dock')).toBeVisible({ timeout: 15_000 });
      await page.getByRole('button', { name: /^More/ }).click();
      await page.getByRole('menuitem', { name: 'Metronome' }).click();
      const metro = page.getByTestId('metronome');
      await metro.getByTestId('metronome-play').click();
      await expect(metro).toHaveAttribute('data-running', 'true');
      const open = page.getByTestId('practice-open').first();
      // Scrolled to the very end, the view's last control comes out from under the bar
      // (the scrollers end below it while it stands there).
      await page.evaluate(() => document.querySelectorAll<HTMLElement>('.explore-work, .explore-main, .explore-root').forEach((el) => { el.scrollTop = el.scrollHeight; }));
      await page.waitForTimeout(300);
      const barBox = (await metro.boundingBox())!;
      const openBox = (await open.boundingBox())!;
      expect(openBox.y + openBox.height <= barBox.y || openBox.y >= barBox.y + barBox.height || openBox.x >= barBox.x + barBox.width,
        `"Practise on the guitar" can be scrolled out from under the bar (${JSON.stringify(openBox)} / ${JSON.stringify(barBox)})`).toBe(true);
      await open.click();
      const sheet = page.getByRole('dialog', { name: 'Practise on the guitar' });
      await expect(sheet).toBeVisible();
      // In the dialog's own content (screen readers, the Tab cycle) and above its scrim.
      const inSheet = sheet.getByRole('region', { name: 'Metronome' });
      await expect(inSheet).toBeVisible();
      await expect(inSheet).toHaveAttribute('data-measured', 'true');
      const stop = inSheet.getByRole('button', { name: 'Stop the metronome' });
      const box = (await stop.boundingBox())!;
      const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('[data-testid="metronome-play"]') !== null, [box.x + box.width / 2, box.y + box.height / 2]);
      expect(hit, '■ is the element under the pointer (not the scrim)').toBe(true);
      // Where it stands: never over the sheet's panel where there is room (logged).
      const panel = (await sheet.boundingBox())!;
      const bar = (await inSheet.boundingBox())!;
      test.info().annotations.push({ type: 'measured', description: `${v.name}: panel ${JSON.stringify(panel)}, bar ${JSON.stringify(bar)}` });
      const overlapPx = Math.max(0, Math.min(panel.x + panel.width, bar.x + bar.width) - Math.max(panel.x, bar.x)) * Math.max(0, Math.min(panel.y + panel.height, bar.y + bar.height) - Math.max(panel.y, bar.y));
      expect(overlapPx, 'the bar covers nothing of the sheet (above a phone\'s sheet, beside a laptop\'s)').toBe(0);
      // By keyboard: Tab from the sheet's first control reaches ■ within the sheet's cycle.
      let reached = false;
      for (let i = 0; i < 40 && !reached; i++) {
        await page.keyboard.press('Tab');
        reached = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') === 'metronome-play');
      }
      expect(reached, 'Tab reaches ■ while the sheet is open').toBe(true);
      await page.keyboard.press('Enter');
      await expect(inSheet).not.toHaveAttribute('data-running', 'true');
      await expect(sheet).toBeVisible();
      // And by pointer: ▶ again, then ■.
      await inSheet.getByRole('button', { name: 'Start the metronome' }).click();
      await expect(inSheet).toHaveAttribute('data-running', 'true');
      await inSheet.getByRole('button', { name: 'Stop the metronome' }).click();
      await expect(inSheet).not.toHaveAttribute('data-running', 'true');
      await expect(sheet).toBeVisible();
      // The sheet closed: the bar is back on the page, focus where the sheet put it.
      await page.keyboard.press('Escape');
      await expect(sheet).toHaveCount(0);
      await expect(page.getByTestId('metronome')).toBeVisible();
      expect(await page.getByTestId('metronome').evaluate((el) => el.closest('[role="dialog"]') === null)).toBe(true);
      await context.close();
    });
  }

  test('it keeps time while a MIDI keyboard plays', async ({ browser, baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'explore', midiKeyboard: true }, { midi: true, grant: ['midi'] });
    const dev = await devModules(page);
    test.skip(!dev, 'the clicks are read on the audio seam through the dev server\'s own module');
    await expect(page.getByTestId('midi-mark')).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Metronome' }).click();
    await page.getByTestId('metronome-play').click();
    for (const m of [60, 64, 67, 72]) {
      await sendMidi(page, noteOn(m));
      await page.waitForTimeout(300);
      await sendMidi(page, noteOff(m));
    }
    await page.waitForTimeout(800);
    await expect(page.getByTestId('metronome')).toHaveAttribute('data-running', 'true');
    const log = await page.evaluate(`(async () => (await import('/src/services/metronome/clickVoice.ts')).clickLog())()`) as { at: number; cancelledAt: number | null }[];
    expect(log.length).toBeGreaterThan(3);
    expect(log.filter((c) => c.cancelledAt !== null && c.cancelledAt < c.at), 'no click taken back').toEqual([]);
    for (let i = 1; i < log.length; i++) expect(Math.abs(log[i].at - log[0].at - i * 60 / 80)).toBeLessThan(1e-6);
    await context.close();
  });
});

// ─── 6. One menu ───────────────────────────────────────────────────────────
test('6. one menu: Settings, Show me around, Tuner, Metronome; in Drill no Metronome; during the tour neither', async ({ browser, baseURL }) => {
  test.setTimeout(60_000);
  const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'explore' });
  const items = async () => {
    await page.getByRole('button', { name: /^More/ }).click();
    const list = await page.getByRole('menuitem').allTextContents();
    await page.keyboard.press('Escape');
    return list;
  };
  expect(await items()).toEqual(['Settings', 'Show me around', 'Tuner', 'Metronome']);
  await page.getByRole('tab', { name: 'Drill' }).click();
  await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
  expect(await items()).toEqual(['Settings', 'Show me around', 'Tuner']);
  await page.getByRole('tab', { name: 'Explore' }).click();
  await page.getByRole('button', { name: /^More/ }).click();
  await page.getByRole('menuitem', { name: 'Show me around' }).click();
  await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
  expect(await items()).toEqual(['Settings', 'Show me around']);
  await page.getByTestId('tour-close').click();
  await expect(page.getByTestId('tour')).toHaveCount(0);
  expect(await items()).toEqual(['Settings', 'Show me around', 'Tuner', 'Metronome']);
  await context.close();
});

// ─── 8. The header ─────────────────────────────────────────────────────────
test.describe('8. the header (production build)', () => {
  let browser: Browser;
  test.beforeAll(async () => { browser = await launchWithFakeMic(E4); });
  test.afterAll(async () => { await browser.close(); });

  test('served with microphone=(self): the microphone opens; camera and geolocation stay refused', async ({ baseURL }) => {
    const { context, page } = await openApp(browser, baseURL!, LAPTOP, { lastView: 'explore' }, { grant: ['camera', 'geolocation', 'microphone'] });
    const headers = (await page.request.get('/')).headers();
    test.skip(!headers['content-security-policy'], 'the dev server sends no production headers; this runs on the preview config');
    expect(headers['permissions-policy']).toBe('camera=(), microphone=(self), geolocation=()');
    const policy = await page.evaluate(() => {
      const p = (document as unknown as { featurePolicy?: { allowsFeature: (f: string) => boolean } }).featurePolicy;
      return p ? { microphone: p.allowsFeature('microphone'), camera: p.allowsFeature('camera'), geolocation: p.allowsFeature('geolocation') } : null;
    });
    if (policy) expect(policy).toEqual({ microphone: true, camera: false, geolocation: false });
    // Even with every permission granted to the browser, the page's policy refuses these two.
    const camera = await page.evaluate(() => navigator.mediaDevices.getUserMedia({ video: true }).then(() => 'opened', (e: Error) => e.name));
    expect(camera).toBe('NotAllowedError');
    const geo = await page.evaluate(() => new Promise<string>((resolve) => navigator.geolocation.getCurrentPosition(() => resolve('granted'), (e) => resolve(e.code === e.PERMISSION_DENIED ? 'denied' : `error ${e.code}`), { timeout: 5000 })));
    expect(geo).toBe('denied');
    const sheet = await openTunerListening(page);
    await expect(sheet.getByTestId('tuner-note')).toHaveText('E', { timeout: 10_000 });
    expect((await tracks(page)).live).toBe(1);
    await context.close();
  });
});

// ─── 9. The owner ──────────────────────────────────────────────────────────
/**
 * His save as production holds it (the frozen v6 fixture: B♭ Dorian, guitar
 * in Drop D, Portuguese, Learn last, no profile, no neck fields, no welcome
 * flag), months of progress, a Drill history with a session under way,
 * fingerings and Learn's empty session record (wave 2's owner, seam 10).
 * What he SEES is compared with what wave3/base (main + the contract file)
 * showed the same save: `e2e/fixtures/wave3-owner-base.json`, recorded there
 * with RECORD_OWNER_BASE=1. Wave 3 may add, for him, only: "Afinador" and
 * "Metrónomo" in "⋯", "Afinar" on the guitar dock's bar (640 px and wider),
 * the "Teclado MIDI" row in Settings. Words are compared on every system;
 * pixel positions only on the system that recorded them; "the additions move
 * nothing" is measured with and without them in the same run.
 */
const OWNER_FIXTURE = 'e2e/fixtures/wave3-owner-base.json';
const asSaved = (path: string) => JSON.stringify(JSON.parse(fs.readFileSync(path, 'utf8')));
function ownerStores(): Record<string, string> {
  const done = ['l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u2m1', 'l1u2m2', 'l1u3m1', 'l1u3m2', 'l1u3m3', 'l1u4m1', 'l1u4m2', 'l2u4m1', 'l2u4m2', 'l2u5m1'];
  const FAR = 4102444800000;
  return {
    'music-theory-app': asSaved('src/state/__tests__/fixtures/settings-v6-before-start.json'),
    'music-theory-progress': JSON.stringify({ state: { progress: {
      completedModules: done,
      moduleProgress: { l2u5m2: ['t1'] },
      exerciseResults: Object.fromEntries(done.map((id) => [id, { scores: {}, totalAttempts: 2, lastAttemptAt: 1793500000000, passed: true }])),
      reviewSchedules: Object.fromEntries(done.map((id, i) => [id, { completedAt: 1790000000000 + i, nextReviewAt: FAR, intervalLevel: 3, reviewCount: 3, lastReviewedAt: 1793000000000 }])),
    } }, version: 4 }),
    'fermata-drill-v1': asSaved('src/state/__tests__/fixtures/drill-v3-before-reading.json'),
    'fermata-fingering-v1': JSON.stringify({ state: { overrides: {}, labelMode: 'degree' }, version: 1 }),
    'fermata-learn-session-v1': JSON.stringify({ state: { screen: null, check: null }, version: 1 }),
  };
}

async function ownerBrowser(browser: Browser, v: View): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({
    viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce',
    serviceWorkers: 'block', locale: LOCALE.pt, storageState: { cookies: [], origins: [] },
  });
  await context.addInitScript((stores) => {
    if (sessionStorage.getItem('__owner')) return;
    localStorage.clear();
    for (const [k, val] of Object.entries(stores)) localStorage.setItem(k, val);
    sessionStorage.setItem('__owner', '1');
  }, ownerStores());
  // Every request the page could make of a microphone, a camera or MIDI is counted (none may be made).
  await context.addInitScript(() => {
    const w = window as unknown as { __asked: string[] };
    w.__asked = [];
    const media = navigator.mediaDevices;
    if (media) {
      for (const name of ['getUserMedia', 'enumerateDevices', 'getDisplayMedia'] as const) {
        const original = (media as unknown as Record<string, (...a: unknown[]) => unknown>)[name];
        if (typeof original !== 'function') continue;
        Object.defineProperty(media, name, { configurable: true, value: (...a: unknown[]) => { w.__asked.push(name); return original.apply(media, a); } });
      }
    }
    const midi = (navigator as unknown as { requestMIDIAccess?: (...a: unknown[]) => unknown }).requestMIDIAccess;
    if (midi) Object.defineProperty(navigator, 'requestMIDIAccess', { configurable: true, value: (...a: unknown[]) => { w.__asked.push('requestMIDIAccess'); return midi.apply(navigator, a); } });
    const query = navigator.permissions?.query?.bind(navigator.permissions);
    if (query) Object.defineProperty(navigator.permissions, 'query', { configurable: true, value: (d: { name: string }) => { w.__asked.push(`permissions:${d.name}`); return query(d as PermissionDescriptor); } });
  });
  return { context, page: await context.newPage() };
}

const visibleText = (page: Page, root: string, exclude: string[] = []) => page.evaluate(([root, exclude]) => {
  const r = document.querySelector(root);
  if (!r) return null;
  const out: string[] = [];
  const walker = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement!;
    const t = (n.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!t || exclude.some((s) => el.closest(s))) continue;
    if (!el.checkVisibility({ visibilityProperty: true })) continue;
    out.push(t.replace(/\b\d+(\.\d)?\s?s\b/g, '#s').replace(/\d{4}-\d{2}-\d{2}/g, '#date').replace(/daqui a \d+ /g, 'daqui a # '));
  }
  return out;
}, [root, exclude] as const);

type Rect = [number, number, number, number, string];
const rectsOf = (page: Page, selector: string, exclude = '[data-none]') => page.locator(selector).evaluateAll((els, ex) =>
  els.filter((e) => !e.closest(ex) && (e as HTMLElement).offsetParent !== null).map((e) => {
    const b = e.getBoundingClientRect();
    return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height), (e.getAttribute('aria-label') ?? e.textContent ?? '').trim().slice(0, 40)];
  }), exclude) as Promise<Rect[]>;
const allStorage = (page: Page) => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)!])));

interface OwnerView {
  learn: string[]; level1: string[]; explore: string[]; dockBar: string[]; dockBarButtons: Rect[]; menu: string[]; settings: string[]; drill: string[];
}
/** Wave 3's additions for him, by what they say (PT). */
const ADDED_MENU = ['Afinador', 'Metrónomo'];
const TUNE = 'Afinar';
const MIDI_ROW = '[data-testid="midi-setting"]';

async function ownerSession(page: Page, v: View): Promise<OwnerView> {
  await page.goto('/');
  const learn = page.locator('#learn-panel');
  await expect(learn.locator('button').filter({ hasText: 'Fundamentos' }).first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  const view: Partial<OwnerView> = {};
  view.learn = (await visibleText(page, '#learn-panel'))!;
  await learn.locator('button').filter({ hasText: 'Fundamentos' }).first().click();
  await page.waitForTimeout(800);
  view.level1 = (await visibleText(page, '#learn-panel'))!;
  await page.locator('[data-tab="explore"]').click();
  await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
  if (v.touch) {
    await page.locator('[data-testid="instrument-dock"] [role="separator"]').focus();
    await page.keyboard.press('ArrowDown');
  }
  await page.waitForTimeout(800);
  view.explore = (await visibleText(page, '#main-content'))!;
  view.dockBar = (await visibleText(page, '[data-testid="instrument-dock"] .dock-bar-row'))!;
  view.dockBarButtons = await rectsOf(page, '[data-testid="instrument-dock"] .dock-bar-row button');
  if (v.touch) {
    await page.locator('[data-testid="instrument-dock"] [role="separator"]').focus();
    await page.keyboard.press('ArrowUp');
  }
  // "⋯" and Settings (opened and closed: nothing written).
  await page.getByRole('button', { name: /^Mais/ }).click();
  view.menu = await page.getByRole('menuitem').allTextContents();
  await page.getByRole('menuitem', { name: 'Definições' }).click();
  const settings = page.getByRole('dialog', { name: 'Definições' });
  await expect(settings).toBeVisible();
  await page.waitForTimeout(600);
  view.settings = await settings.evaluate((root) => {
    const out: string[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = (n.textContent ?? '').replace(/\s+/g, ' ').trim();
      // The build date in the footer is the day of the build, not part of what he sees changing.
      if (t && !(n.parentElement as HTMLElement).closest('[data-testid="midi-setting"]')) out.push(t.replace(/\d{4}-\d{2}-\d{2}/g, '#date'));
    }
    return out;
  });
  await page.keyboard.press('Escape');
  await expect(settings).toHaveCount(0);
  await page.locator('[data-tab="drill"]').click();
  await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1000);
  view.drill = (await visibleText(page, '#drill-panel'))!;
  await page.locator('[data-tab="learn"]').click();
  await expect(learn).toBeVisible();
  await page.waitForTimeout(500);
  return view as OwnerView;
}

for (const v of [PHONE, LAPTOP]) {
  test(`9. the owner (${v.name}): every screen as on wave3/base, plus only the named additions; nothing asked of a microphone or MIDI; his whole save byte for byte`, async ({ browser }) => {
    test.setTimeout(120_000);
    const { context, page } = await ownerBrowser(browser, v);
    const before = ownerStores();
    const seen = await ownerSession(page, v);
    const after = await allStorage(page);
    const asked = await page.evaluate(() => (window as unknown as { __asked: string[] }).__asked);

    if (process.env.RECORD_OWNER_BASE) {
      const all = fs.existsSync(OWNER_FIXTURE) ? JSON.parse(fs.readFileSync(OWNER_FIXTURE, 'utf8')) : {};
      const changedKeys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((k) => after[k] !== before[k]);
      all[v.name] = { ...seen, storageUnchanged: changedKeys.length === 0, changedKeys, asked };
      all.platform = process.platform;
      fs.mkdirSync('e2e/fixtures', { recursive: true });
      fs.writeFileSync(OWNER_FIXTURE, `${JSON.stringify(all, null, 1)}\n`);
      await context.close();
      return;
    }
    const recorded = JSON.parse(fs.readFileSync(OWNER_FIXTURE, 'utf8'));
    const base = recorded[v.name] as OwnerView & { storageUnchanged: boolean; asked: string[] };
    const samePlatform = recorded.platform === process.platform;
    expect(base.storageUnchanged, 'on wave3/base his save was written back unchanged').toBe(true);

    // Nothing asked of a microphone, a camera or MIDI (not even whether it is allowed).
    expect(asked).toEqual(base.asked);
    expect(asked.filter((a) => /getUserMedia|enumerateDevices|getDisplayMedia|requestMIDIAccess|microphone|midi|camera/.test(a))).toEqual([]);
    // Learn, Level 1, Explore's view and Drill: the same words.
    expect(seen.learn).toEqual(base.learn);
    expect(seen.level1).toEqual(base.level1);
    expect(seen.explore).toEqual(base.explore);
    expect(seen.drill).toEqual(base.drill);
    // "⋯": the same items, then Afinador and Metrónomo.
    expect(seen.menu).toEqual([...base.menu, ...ADDED_MENU]);
    // Settings: the same words outside the one new row; the row is there.
    expect(seen.settings).toEqual(base.settings);
    // The dock's bar: the same words, plus "Afinar" from 640 px.
    const wide = v.viewport.width >= 640;
    expect(seen.dockBar.filter((t) => t !== TUNE)).toEqual(base.dockBar);
    expect(seen.dockBar.filter((t) => t === TUNE)).toHaveLength(wide ? 1 : 0);
    const labels = (rs: Rect[]) => rs.map((r) => r[4]);
    expect(labels(seen.dockBarButtons).filter((l) => l !== TUNE)).toEqual(labels(base.dockBarButtons));
    if (samePlatform) expect(seen.dockBarButtons.filter((r) => r[4] !== TUNE)).toEqual(base.dockBarButtons);

    // In this run, with and without each addition: it moves nothing else.
    await page.locator('[data-tab="explore"]').click();
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('start-hint')).toHaveCount(0);
    await page.waitForTimeout(600);
    if (wide) {
      const tune = page.getByTestId('dock-tune');
      await expect(tune).toHaveText(TUNE);
      const others = '[data-testid="instrument-dock"] .dock-bar-row button:not([data-testid="dock-tune"]), [data-testid="instrument-dock"] .dock-bar-row select, [data-testid="dock-readout"] .dock-context-text';
      const withTune = await rectsOf(page, others);
      const dockWith = await page.getByTestId('instrument-dock').boundingBox();
      await tune.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
      await page.waitForTimeout(300);
      const withoutTune = await rectsOf(page, others);
      const dockWithout = await page.getByTestId('instrument-dock').boundingBox();
      await tune.evaluate((el) => { (el as HTMLElement).style.display = ''; });
      test.info().annotations.push({ type: 'measured', description: `${v.name} dock bar with Afinar ${JSON.stringify(withTune)} / without ${JSON.stringify(withoutTune)}` });
      expect(dockWith, 'the dock does not grow with Afinar').toEqual(dockWithout);
      // Every other control of the bar, and the read-out's words, exactly where they were: the read-out's free room gives Afinar its place.
      expect(withTune).toEqual(withoutTune);
    } else {
      await expect(page.getByTestId('dock-tune')).toHaveCount(0);
    }
    // Settings: every row above the MIDI row stays put; below it, all move by exactly its height.
    await page.getByRole('button', { name: /^Mais/ }).click();
    await page.getByRole('menuitem', { name: 'Definições' }).click();
    const sheet = page.getByRole('dialog', { name: 'Definições' });
    const row = sheet.locator(MIDI_ROW);
    await expect(row).toBeVisible();
    await expect(row.getByRole('button', { name: 'Usar um teclado MIDI' })).toHaveAttribute('aria-pressed', 'false');
    await page.waitForTimeout(400);
    const controls = `[data-testid="settings-sheet"] button:not(${MIDI_ROW} *), [data-testid="settings-sheet"] select:not(${MIDI_ROW} *)`;
    const scroller = sheet.locator('.sheet-body');
    await scroller.evaluate((el) => { el.scrollTop = 0; });
    const withRow = await rectsOf(page, controls);
    const rowBox = (await row.boundingBox())!;
    const gap = await row.evaluate((el) => {
      const next = el.nextElementSibling as HTMLElement | null;
      return next ? next.getBoundingClientRect().top - el.getBoundingClientRect().bottom : 0;
    });
    await row.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
    await page.waitForTimeout(200);
    const withoutRow = await rectsOf(page, controls);
    await row.evaluate((el) => { (el as HTMLElement).style.display = ''; });
    expect(withRow.map((r) => r[4])).toEqual(withoutRow.map((r) => r[4]));
    for (let i = 0; i < withRow.length; i++) {
      const [l, t, w, h, name] = withRow[i];
      const [l0, t0, w0, h0] = withoutRow[i];
      expect([l, w, h], `${name}: same size and column`).toEqual([l0, w0, h0]);
      if (t0 < rowBox.y) expect(t, `${name} (above the MIDI row) does not move`).toBe(t0);
      // `t` and `t0` are each rounded to a whole pixel, so their difference can be
      // one off the true shift where a row's height is fractional (GitHub's Linux
      // fonts: 161 expected, 162 measured). One pixel of rounding, no more.
      else expect(Math.abs((t - t0) - (rowBox.height + gap)), `${name} (below the MIDI row) moves by the row's height`).toBeLessThanOrEqual(1);
    }
    await page.keyboard.press('Escape');
    // No mark in the dock bar for MIDI (off), no listening mark, no metronome bar anywhere.
    await expect(page.getByTestId('midi-mark')).toHaveCount(0);
    await expect(page.getByTestId('listening-mark')).toHaveCount(0);
    await expect(page.getByTestId('metronome')).toHaveCount(0);
    // Still nothing asked; his whole save, every store, byte for byte, after a session through every view.
    // (The same two checks as above: exactly what wave3/base asked, and nothing of a microphone, a camera, a screen or MIDI.)
    const askedAfter = await page.evaluate(() => (window as unknown as { __asked: string[] }).__asked);
    expect(askedAfter).toEqual(base.asked);
    expect(askedAfter.filter((a) => /getUserMedia|enumerateDevices|getDisplayMedia|requestMIDIAccess|microphone|midi|camera/.test(a))).toEqual([]);
    expect(after).toEqual(before);
    // And once more after these measurements, back where he was.
    await page.locator('[data-tab="learn"]').click();
    await expect(page.locator('#learn-panel')).toBeVisible();
    await page.waitForTimeout(500);
    expect(await allStorage(page)).toEqual(before);
    await context.close();
  });
}

// ─── 10. A newcomer, by playing ────────────────────────────────────────────
test.describe('10. a newcomer on a phone answers a sound-first check by playing', () => {
  let browser: Browser;
  test.beforeAll(async () => { browser = await launchWithFakeMic(C_E_G); });
  test.afterAll(async () => { await browser.close(); });

  test('"Three Notes Make a Chord": "Use my instrument", C, E and G played, the check passed', async ({ baseURL }) => {
    test.setTimeout(150_000);
    const { context, page } = await openApp(browser, baseURL!, PHONE, { lastView: 'learn', learnerProfile: 'new' });
    const key = answerKey('l1u34');
    const want = 'Build the C major chord: the 1st, 3rd and 5th notes of the C major scale.';
    await checkUntil(page, 'l1u34m5', key, (p) => p === want);
    await useMyInstrument(page);
    await expect.poll(async () => (await chips(page)).sort(), { timeout: 20_000 }).toEqual(['C', 'E', 'G']);
    await page.getByRole('button', { name: 'Check Answer', exact: true }).click();
    const cur = Number((await position(page)).split('/')[0]);
    await expect(page.getByTestId('check-pips').locator(`i:nth-child(${cur})`)).toHaveAttribute('data-score', '1');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    // The rest on the screen, the microphone off (the room would otherwise add its C, E, G to the next builds).
    if (await page.getByRole('button', { name: 'Use my instrument' }).count()) await page.getByRole('button', { name: 'Use my instrument' }).click();
    await expect.poll(() => tracks(page)).toEqual({ streams: 1, live: 0, ended: 1 });
    while (await page.getByTestId('check-position').count()) await answerOnScreen(page, key);
    await expect(page.getByTestId('result-score')).toHaveText(/^5 of 5$/, { timeout: 10_000 });
    await context.close();
  });
});
