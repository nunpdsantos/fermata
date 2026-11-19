import { test, expect, type Browser, type BrowserContext, type Locator, type Page } from '@playwright/test';

/**
 * Music audit 2 (18 November 2026), the guitar practice sheet (Explore → guitar → Practise), as a learner meets it:
 *  - M37: the editor does not offer a finger that already holds another fret at the same instant, and says where;
 *    a tap on the neck steps past it.
 *  - M38: a teacher's finger is kept in every tab that edits (Scales, Position walk, Technical set): after leaving
 *    the tab, after a reload and in a second tab, until Reset.
 *  - M39: tirando ↔ apoyando keeps the step and the tempo, paused and while playing.
 *  - M40 (dev server only: it records what the app hands the audio voice through the dev server's own modules):
 *    one string sounds one note at a time.
 *  - M41: B major (p+a) i m i names the barré and its strings, printed and spoken.
 * Runs on the dev server and on the build (`playwright.preview.config.ts`).
 */

const C = { natural: 'C', accidental: '' };
const B = { natural: 'B', accidental: '' };

async function open(browser: Browser, opts: { w: number; h: number; key?: typeof C; context?: BrowserContext }) {
  const touch = opts.w < 1000;
  const context = opts.context ?? await browser.newContext({ viewport: { width: opts.w, height: opts.h }, hasTouch: touch, isMobile: touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  // Seeded once per browser (a second tab and a reload find the save as the app left it), at the run's own
  // address. The config's first-visit state already holds an empty settings save, hence a marker of our own.
  await context.addInitScript((key) => {
    if (localStorage.getItem('e2e-audit2-seeded')) return;
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { instrument: 'guitar', lastView: 'explore', language: 'en', selectedKey: key, selectedScale: 'major' }, version: 6 }));
    localStorage.setItem('e2e-audit2-seeded', '1');
  }, opts.key ?? C);
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL!);
  return { context, page, sheet: await openSheet(page) };
}

async function openSheet(page: Page) {
  await page.getByTestId('practice-open').click();
  const sheet = page.getByTestId('practice-sheet');
  await expect(sheet.getByTestId('practice-player')).toBeVisible();
  return sheet;
}

const tab = (sheet: Locator, name: string) => sheet.getByRole('tab', { name, exact: true }).click();
const current = (sheet: Locator) => sheet.getByTestId('practice-current');
const next = (sheet: Locator) => sheet.getByRole('button', { name: 'Next note or chord' });

for (const viewport of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
  test(`M38: a teacher's finger is kept in the walk (leave, reload, second tab) and in every editing tab, then reset, ${viewport.w}×${viewport.h}`, async ({ browser }) => {
    const { context, page, sheet } = await open(browser, viewport);
    await tab(sheet, 'Position walk');
    await expect(current(sheet)).toContainText('1 of 63');
    await expect(current(sheet)).toContainText('C · Left hand 2 · string 5 fret 3');
    await sheet.getByRole('button', { name: 'Edit fingering' }).click();
    const reset = sheet.getByRole('button', { name: 'Reset to suggested' });
    await expect(reset).toBeDisabled();
    await sheet.getByRole('combobox', { name: 'Finger for C, string 5' }).selectOption('3');
    await expect(current(sheet)).toContainText('C · Left hand 3');
    await expect(reset).toBeEnabled();
    // Leave the tab and come back.
    await tab(sheet, 'Scales');
    await tab(sheet, 'Position walk');
    await expect(current(sheet)).toContainText('C · Left hand 3');
    // A second tab of the app, open alongside.
    const other = await context.newPage();
    await other.goto(test.info().project.use.baseURL!);
    const otherSheet = await openSheet(other);
    await tab(otherSheet, 'Position walk');
    await expect(current(otherSheet)).toContainText('C · Left hand 3');
    // A reload of the first.
    await page.reload();
    const again = await openSheet(page);
    await tab(again, 'Position walk');
    await expect(current(again)).toContainText('C · Left hand 3');
    // The other editing tabs keep theirs too: Scales (step 1) and Technical set (the 3rds pair).
    await tab(again, 'Scales');
    await again.getByRole('button', { name: 'Edit fingering' }).click();
    const scaleFinger = again.getByRole('combobox', { name: /Finger for/ });
    const suggested = await scaleFinger.inputValue();
    const chosen = suggested === '1' ? '2' : '1';
    await scaleFinger.selectOption(chosen);
    // Each tab's player starts out of editing.
    await tab(again, 'Technical set');
    await again.getByTestId('practice-exercise').selectOption('thirds-together');
    await again.getByRole('button', { name: 'Edit fingering' }).click();
    await again.getByRole('combobox', { name: 'Finger for C, string 5' }).selectOption('4');
    await page.reload();
    const third = await openSheet(page);
    await expect(third.getByRole('combobox', { name: /Finger for/ })).toHaveCount(0);
    await third.getByRole('button', { name: 'Edit fingering' }).click();
    await expect(third.getByRole('combobox', { name: /Finger for/ })).toHaveValue(chosen);
    await tab(third, 'Technical set');
    await third.getByTestId('practice-exercise').selectOption('thirds-together');
    await third.getByRole('button', { name: 'Edit fingering' }).click();
    await expect(third.getByRole('combobox', { name: 'Finger for C, string 5' })).toHaveValue('4');
    // Reset in the walk: the suggestion again, here and, followed, in the other tab.
    await tab(third, 'Position walk');
    await expect(current(third)).toContainText('C · Left hand 3');
    await third.getByRole('button', { name: 'Edit fingering' }).click();
    await third.getByRole('button', { name: 'Reset to suggested' }).click();
    await expect(current(third)).toContainText('C · Left hand 2');
    await expect(third.getByRole('button', { name: 'Reset to suggested' })).toBeDisabled();
    await expect(current(otherSheet)).toContainText('C · Left hand 2');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fermata-fingering-v1')!).state.overrides as Record<string, number>);
    expect(Object.keys(saved).some((k) => k.includes('|position-walk|'))).toBe(false);
    expect(Object.values(saved).sort()).toEqual([Number(chosen), 4].sort());
    await context.close();
  });
}

test('M37: a finger already on another fret at the same instant is not offered, the editor says where, the neck steps past it', async ({ browser }) => {
  const { context, sheet } = await open(browser, { w: 1440, h: 900 });
  await tab(sheet, 'Technical set');
  await sheet.getByTestId('practice-exercise').selectOption('thirds-together');
  await sheet.getByRole('button', { name: 'Edit fingering' }).click();
  const e = sheet.getByRole('combobox', { name: 'Finger for E, string 4' });
  await expect(e).toHaveValue('2');
  // (Playwright's toBeDisabled does not read an <option>: its own property does.)
  expect(await e.locator('option').evaluateAll((os) => os.map((o) => [(o as HTMLOptionElement).value, (o as HTMLOptionElement).disabled])))
    .toEqual([['1', false], ['2', false], ['3', true], ['4', false]]);
  await expect(sheet.getByTestId('practice-finger-busy')).toContainText([
    'Finger 2 is not offered for C on string 5: at the same time it already holds E on string 4, fret 2, and one finger cannot hold two frets.',
    'Finger 3 is not offered for E on string 4: at the same time it already holds C on string 5, fret 3, and one finger cannot hold two frets.',
  ]);
  // The neck: E is string 4 (row 2), fret 2. One tap: 2 → 4.
  await sheet.getByTestId('practice-neck').locator('[data-string-row="2"][data-fret="2"]').click();
  await expect(e).toHaveValue('4');
  await expect(current(sheet)).toContainText('E · Left hand 4');
  await expect(sheet.getByTestId('practice-clash')).toHaveCount(0);
  await context.close();
});

test('M37: a clash saved before this release is kept, named with both places, and mended by changing one finger', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript(() => {
    if (localStorage.getItem('e2e-audit2-seeded')) return;
    localStorage.setItem('fermata-fingering-v1', JSON.stringify({ state: { overrides: { 'route:1|standard|C|major|thirds-together|1|0|2|2': 3 }, labelMode: 'finger' }, version: 1 }));
  });
  const { sheet } = await open(browser, { w: 1440, h: 900, context });
  await tab(sheet, 'Technical set');
  await sheet.getByTestId('practice-exercise').selectOption('thirds-together');
  await expect(sheet.getByTestId('practice-clash')).toHaveText(
    'Finger 3 is on C on string 5, fret 3, and on E on string 4, fret 2, at the same time: one finger cannot hold two frets. Change one of them.');
  await sheet.getByRole('button', { name: 'Edit fingering' }).click();
  await sheet.getByRole('combobox', { name: 'Finger for C, string 5' }).selectOption('2');
  await expect(sheet.getByTestId('practice-clash')).toHaveCount(0);
  await context.close();
});

test('M39: the stroke keeps the step and the tempo, paused and while playing, both ways', async ({ browser }) => {
  const { context, sheet } = await open(browser, { w: 1440, h: 900 });
  const tempo = sheet.getByRole('combobox', { name: 'Tempo' });
  await tempo.selectOption('60');
  for (let i = 1; i < 7; i++) await next(sheet).click();
  await expect(current(sheet)).toContainText('7 of 29');
  await expect(current(sheet)).toContainText('B · Left hand 0 · string 2 fret 0');
  for (const stroke of ['apoyando', 'tirando']) {
    await sheet.getByRole('radio', { name: stroke }).click();
    await expect(current(sheet)).toContainText('7 of 29');
    await expect(tempo).toHaveValue('60');
  }
  await sheet.getByRole('button', { name: '▶ Play' }).click();
  await expect(sheet.getByRole('button', { name: '■ Stop' })).toBeVisible();
  await expect(current(sheet)).toContainText(/^(2|3) of 29/);
  for (const stroke of ['apoyando', 'tirando']) {
    const before = Number((await current(sheet).innerText()).match(/^(\d+) of/)![1]);
    await sheet.getByRole('radio', { name: stroke }).click();
    await expect(tempo).toHaveValue('60');
    await expect(sheet.getByRole('button', { name: '■ Stop' })).toBeVisible();
    // Still playing from where it was: the step goes on from there, never back to 1.
    await expect.poll(async () => Number((await current(sheet).innerText()).match(/^(\d+) of/)![1])).toBeGreaterThan(before);
  }
  await sheet.getByRole('button', { name: '■ Stop' }).click();
  await context.close();
});

test('M41: B major (p+a) i m i names the barré and its strings, printed and spoken, on every stroke of the bar that holds it', async ({ browser }) => {
  for (const viewport of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
    const { context, sheet } = await open(browser, { ...viewport, key: B });
    await tab(sheet, 'Right hand');
    await sheet.getByTestId('practice-pattern').selectOption('p+a-i-m-i');
    await expect(current(sheet)).toContainText('p · B · Left hand 1 · string 5 fret 2 · Partial barré');
    await expect(current(sheet)).toContainText('a · F♯ · Left hand 1 · string 1 fret 2 · Partial barré');
    await expect(sheet.getByTestId('practice-barre')).toHaveText('Barré: finger 1 across strings 1 to 5, fret 2');
    await expect(sheet.locator('.practice-event').first()).toHaveAttribute('aria-label', 'Step 1: B + F#. Barré: finger 1 across strings 1 to 5, fret 2');
    // Step 2 plucks string 3 at fret 4: the index stays down, so the line and the step's name stay; its note has no barré word.
    await expect(sheet.locator('.practice-event').nth(1)).toHaveAttribute('aria-label', 'Step 2: B. Barré: finger 1 across strings 1 to 5, fret 2');
    await next(sheet).click();
    await expect(sheet.getByTestId('practice-barre')).toHaveText('Barré: finger 1 across strings 1 to 5, fret 2');
    await expect(current(sheet)).toContainText(/i · B · Left hand \d · string 3 fret 4/);
    await expect(current(sheet)).not.toContainText('Partial barré');
    await context.close();
  }
});

test('M40: what the app hands the voice sounds one note per string at a time (C major, p i m i, 60 BPM)', async ({ browser }) => {
  const { context, page, sheet } = await open(browser, { w: 1440, h: 900 });
  // The dev server's own modules (asked for as JavaScript: the build answers unknown addresses with its 404 page).
  const probe = await page.request.get('/src/core/services/audio.ts');
  test.skip(!probe.ok() || !(probe.headers()['content-type'] ?? '').includes('javascript'),
    'The build has no /src modules to record the voice through; the schedule is proved in practiceAudit2.test.tsx and the corpus sweep.');
  await page.evaluate(async () => {
    const audio = (await import(/* @vite-ignore */ '/src/core/services/audio.ts' as string)) as { setInstrumentVoice: (v: unknown) => void };
    const w = window as unknown as { __plays: { midi: number; when: number; duration: number }[] };
    w.__plays = [];
    audio.setInstrumentVoice({
      playNote: (midi: number, when: number, duration: number) => { w.__plays.push({ midi, when, duration }); return true; },
      startNote: () => true, stopNote: () => {}, setVolume: () => {}, resume: () => Promise.resolve(), cancelScheduled: () => {},
    });
  });
  await tab(sheet, 'Right hand');
  await sheet.getByTestId('practice-pattern').selectOption('p-i-m-i');
  await sheet.getByRole('combobox', { name: 'Tempo' }).selectOption('60');
  await sheet.getByRole('button', { name: '▶ Play' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __plays: unknown[] }).__plays.length)).toBe(12);
  const plays = await page.evaluate(() => (window as unknown as { __plays: { midi: number; when: number; duration: number }[] }).__plays);
  // Offsets from the first note (they are handed over in one go, each with its delay).
  const t0 = plays[0].when;
  const notes = plays.map((p) => ({ midi: p.midi, at: Math.round((p.when - t0) * 1000) / 1000, end: Math.round((p.when - t0 + p.duration) * 1000) / 1000 }));
  // Bar 1 of I (the open C grip): C3 (string 5, p), the open G3 (string 3, i), C4 (string 2, m), the G3 again (i).
  expect(notes.slice(0, 4)).toEqual([{ midi: 48, at: 0, end: 3.9 }, { midi: 55, at: 1, end: 2.9 }, { midi: 60, at: 2, end: 3.9 }, { midi: 55, at: 3, end: 3.9 }]);
  // Every repeated pitch (in these grips, the same string plucked again) ends before it sounds again.
  for (const [k, n] of notes.entries()) {
    const again = notes.find((m, j) => j > k && m.midi === n.midi);
    if (again) expect(n.end, `MIDI ${n.midi} at ${n.at} s`).toBeLessThanOrEqual(again.at);
  }
  await sheet.getByRole('button', { name: '■ Stop' }).click();
  await context.close();
});
