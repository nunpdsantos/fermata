import { test, expect, type Browser, type Locator, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import {
  PHONE, LAPTOP, type View, type Lang, LOCALE,
  freshBrowser, seededBrowser, appKeys, savedState, neckDrawn, exploreDetail,
} from './helpers/wave1';
import { L1_UNITS } from '../src/core/constants/curriculumL1';

/**
 * The seams between wave 2's four branches (integration, 2026-11-10), each
 * proved in a real browser; the branches' own specs prove each part alone.
 *   1. a lesson opens the Progression panel   6. Drill's table ↔ the real lessons
 *   2. one name for the panel                 7. (saved fields: unit, wave2Fields.test)
 *   3. the capo, panel ↔ neck ↔ link          8. a first visit by ?prog=
 *   4. tunings: one rule on both surfaces     9. the doors and the tour
 *   5. the word "capo" ↔ the glossary        10. the owner
 * The sound of the loop with a capo is proved in src/__tests__/wave2CapoLoop.test.ts
 * (what is handed to the audio clock), the panel ↔ neck naming for every
 * chord of every preset in wave2Seams.test.ts, tunings in wave2Tunings.test.tsx.
 * Nothing here imports the app's modules in the page, so it runs on the dev
 * server and on the production build alike.
 */

const chipNames = (page: Page) => page.locator('[data-testid="progression-chips"] .prog-chip-name').allTextContents();
const startScreen = (page: Page) => page.getByTestId('start-screen');
const bar = (page: Page) => page.getByTestId('tour-bar');
// Read lazily: the owner's test also runs (to record) on wave2/base, which has no tracks.
const unit = (id: string) => L1_UNITS.find((u) => u.id === id)!;
const CHORDS = { get modules() { return unit('u35').modules; } };
const SOUND = { get modules() { return unit('u34').modules; } };

/** The Try This of a lesson whose query is this chord list. */
const tryThisWith = (page: Page, names: string[]) =>
  page.getByTestId('inline-try-this').filter({ has: page.getByTestId('try-this-chords').filter({ hasText: names.join('') }) }).first();

async function stepToEnd(page: Page, next = 'Next') {
  for (let i = 0; i < 14; i++) {
    await expect(bar(page)).toHaveAttribute('data-phase', 'holding', { timeout: 20_000 });
    const b = page.getByRole('button', { name: next, exact: true });
    if (!(await b.count())) return;
    await b.click();
  }
}

const allStorage = (page: Page) => page.evaluate(() => {
  const out: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i)!; out[k] = localStorage.getItem(k)!; }
  return out;
});

// ─── 1 + 2. A lesson opens the Progression panel; one name for it ──────────
test.describe('1. a lesson opens the Progression panel', () => {
  const firstList = () => CHORDS.modules[0].concepts.find((c) => c.tryThisQuery.startsWith('chords:'))!.tryThisQuery.slice('chords:'.length).trim().split(/\s+/);

  for (const v of [PHONE, LAPTOP]) {
    test(`${v.name}: "Open in Explore" on a chord list in lesson 1 opens the panel with exactly those chords (the learner has none)`, async ({ browser }) => {
      const { context, page } = await seededBrowser(browser, v, { language: 'en', instrument: 'piano' });
      await page.goto('/?lesson=l1u35m1');
      await expect(page.getByRole('heading', { level: 1, name: CHORDS.modules[0].title })).toBeVisible({ timeout: 15_000 });
      const first = firstList();
      expect(first).toEqual(['G', 'C', 'D', 'Em']);
      const block = tryThisWith(page, first);
      await block.scrollIntoViewIfNeeded();
      await block.getByRole('button', { name: 'Open in Explore' }).click();
      await expect(page.getByTestId('progression-panel')).toBeVisible({ timeout: 15_000 });
      expect(await chipNames(page)).toEqual(first);
      await expect(page.getByTestId('progression-offer')).toHaveCount(0);
      expect((await savedState(page)).progression).toEqual({ chords: first, bpm: 90, beats: 4 });
      await context.close();
    });
  }

  test('laptop: a learner with chords of their own is OFFERED the lesson\'s, never replaced; "Keep mine" keeps them', async ({ browser }) => {
    const mine = { chords: ['A', 'E'], bpm: 70, beats: 2 };
    const { context, page } = await seededBrowser(browser, LAPTOP, { language: 'en', instrument: 'piano', progression: mine });
    await page.goto('/?lesson=l1u35m1');
    await expect(page.getByRole('heading', { level: 1, name: CHORDS.modules[0].title })).toBeVisible({ timeout: 15_000 });
    await tryThisWith(page, firstList()).getByRole('button', { name: 'Open in Explore' }).click();
    const offer = page.getByTestId('progression-offer');
    await expect(offer).toBeVisible({ timeout: 15_000 });
    await expect(offer).toContainText('A lesson or shared link offers these chords: G, C, D, Em.');
    expect(await chipNames(page)).toEqual(['A', 'E']);
    expect((await savedState(page)).progression).toEqual(mine);
    await offer.getByRole('button', { name: 'Keep mine' }).click();
    await expect(offer).toHaveCount(0);
    expect(await chipNames(page)).toEqual(['A', 'E']);
    expect((await savedState(page)).progression).toEqual(mine);
    await context.close();
  });

  for (const lang of ['en', 'pt', 'es'] as const) {
    test(`${lang}: the chords track's closing card opens the panel on what the learner has, and both name it the same way (seam 2)`, async ({ browser }) => {
      const NAME = { en: 'Progression', pt: 'Progressão', es: 'Progresión' }[lang];
      const mine = { chords: ['D', 'A', 'Bm', 'G'], bpm: 90, beats: 4 };
      const { context, page } = await seededBrowser(browser, LAPTOP, { language: lang, instrument: 'piano', progression: mine }, {}, { lang });
      await page.goto('/?lesson=l1u35m10');
      const ending = page.getByTestId('track-ending');
      await expect(ending).toBeAttached({ timeout: 15_000 });
      await ending.scrollIntoViewIfNeeded();
      const go = ending.getByRole('button').first();
      await expect(go).toContainText(NAME);
      await go.click();
      const panel = page.getByTestId('progression-panel');
      await expect(panel).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('chords-card').getByRole('heading', { name: NAME, exact: true })).toBeVisible();
      expect(await chipNames(page)).toEqual(mine.chords);
      await expect(page.getByTestId('progression-offer')).toHaveCount(0);
      // Closed, the card's own button says the same word.
      await page.getByTestId('progression-toggle').click();
      await expect(page.getByTestId('progression-toggle')).toHaveText(NAME);
      await context.close();
    });
  }

  test('the closing card with nothing saved: the panel opens empty (its first-use state)', async ({ browser }) => {
    const { context, page } = await seededBrowser(browser, LAPTOP, { language: 'en', instrument: 'piano' });
    await page.goto('/?lesson=l1u35m10');
    const ending = page.getByTestId('track-ending');
    await expect(ending).toBeAttached({ timeout: 15_000 });
    await ending.scrollIntoViewIfNeeded();
    await ending.getByRole('button', { name: 'Loop your own songs in the Progression panel' }).click();
    await expect(page.getByTestId('progression-panel')).toHaveAttribute('data-state', 'empty', { timeout: 15_000 });
    expect(await savedState(page)).not.toHaveProperty('progression');
    await context.close();
  });
});

// ─── 3. The capo, end to end ───────────────────────────────────────────────
test.describe('3. the capo: panel ↔ neck ↔ link', () => {
  const KEY_BB = { selectedKey: { natural: 'B', accidental: 'b' }, selectedScale: 'major' };
  const LINES = ['B♭: the G shape, capo on fret 3', 'E♭: the C shape, capo on fret 3', 'F: the D shape, capo on fret 3'];

  for (const v of [PHONE, LAPTOP]) {
    test(`${v.name}: a capo idea sets the capo; the neck draws it and names, chord by chord, the shape the panel names; "No capo" clears both`, async ({ browser }) => {
      test.setTimeout(90_000);
      const { context, page } = await seededBrowser(browser, v, { language: 'en', instrument: 'guitar', ...KEY_BB, progression: { chords: ['Bb', 'Eb', 'F'], bpm: 200, beats: 2 } });
      await page.goto('/');
      const dock = page.getByTestId('instrument-dock');
      await expect(dock.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
      await expect(dock.locator('[data-capo-bar]')).toHaveCount(0);
      await page.getByTestId('progression-toggle').click();
      await expect(page.getByTestId('progression-panel')).toBeVisible();
      await page.getByRole('radio', { name: 'Fret 3: G, C, D' }).click();
      await expect(page.getByTestId('progression-capo-now')).toHaveText('Capo on fret 3: play G, C, D.');
      expect((await savedState(page)).capoFret).toBe(3);
      // The neck: the capo drawn across the strings, its own control on 3.
      await expect(dock.locator('[data-capo-bar]').first()).toBeAttached();
      await expect(dock.getByTestId('capo-control')).toHaveValue('3');
      // Loop: each chord, as it sounds, is the neck's chord — its line names the panel's shape.
      const play = page.getByTestId('progression-play');
      await play.scrollIntoViewIfNeeded();
      await play.click();
      const seen = new Set<string>();
      await expect.poll(async () => {
        for (const t of await dock.getByTestId('capo-line').allTextContents()) seen.add(t);
        return [...seen].sort();
      }, { timeout: 20_000, intervals: [100] }).toEqual([...LINES].sort());
      await play.click();
      await expect(page.locator('.prog-chip[data-playing]')).toHaveCount(0);
      // "No capo": gone from the panel, the neck and the save.
      await page.getByRole('radio', { name: 'No capo' }).click();
      await expect(page.getByTestId('progression-capo-now')).toHaveCount(0);
      await expect(dock.locator('[data-capo-bar]')).toHaveCount(0);
      await expect(dock.getByTestId('capo-control')).toHaveCount(0);
      await expect(dock.getByTestId('capo-line')).toHaveCount(0);
      expect(await savedState(page)).not.toHaveProperty('capoFret');
      await context.close();
    });
  }

  test('laptop: a link with ?prog=…&capo=3 shows the same: the panel\'s line, the capo on the neck, its line', async ({ browser }) => {
    const { context, page } = await seededBrowser(browser, LAPTOP, { language: 'en', instrument: 'piano' });
    await page.goto('/?key=Bb&scale=major&inst=guitar&prog=Bb,Eb,F&capo=3');
    await expect(page.getByTestId('progression-panel')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('progression-capo-now')).toHaveText('Capo on fret 3: play G, C, D.');
    const dock = page.getByTestId('instrument-dock');
    await expect(dock.locator('[data-capo-bar]').first()).toBeAttached({ timeout: 15_000 });
    await expect(dock.getByTestId('capo-control')).toHaveValue('3');
    // The panel open, the chords card has no In key row: the loop selects B♭.
    await page.getByTestId('progression-play').click();
    await expect.poll(() => dock.getByTestId('capo-line').allTextContents(), { timeout: 15_000 }).toContain(LINES[0]);
    await page.getByTestId('progression-play').click();
    expect(new URL(page.url()).search).toBe('');
    await context.close();
  });
});

// ─── 4. Tunings: one rule ──────────────────────────────────────────────────
test('4. Drop D: the panel says capo ideas need standard tuning, and the neck says its shapes do', async ({ browser }) => {
  const { context, page } = await seededBrowser(browser, LAPTOP, {
    language: 'en', instrument: 'guitar', guitarTuningId: 'drop-d', capoFret: 3,
    selectedKey: { natural: 'B', accidental: 'b' }, selectedScale: 'major', progression: { chords: ['Bb', 'Eb', 'F'], bpm: 90, beats: 4 },
  });
  await page.goto('/');
  const dock = page.getByTestId('instrument-dock');
  await expect(dock.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Bb Major chord, degree 1' }).click();
  // With the capo on (3) the frets behind it are blank: "from the capo up" (final review of wave 2).
  await expect(dock.getByText('Chord shapes are for standard tuning only. Showing the chord\'s notes from the capo up.')).toBeVisible();
  await expect(dock.getByTestId('capo-line')).toHaveCount(0);
  await page.getByTestId('progression-toggle').click();
  await expect(page.getByTestId('progression-capo-standard')).toHaveText("Capo ideas need standard tuning: Fermatina's chord shapes are for standard tuning only.");
  await expect(page.getByRole('radiogroup', { name: 'Capo ideas, for shapes with open strings' })).toHaveCount(0);
  await expect(page.getByTestId('progression-capo-now')).toHaveCount(0);
  await context.close();
});

// ─── 5. The word "capo" ────────────────────────────────────────────────────
test.describe('5. the word "capo": listed on the board, in Settings and on the practice note; its entry opens', () => {
  for (const v of [PHONE, LAPTOP]) {
    test(`${v.name}`, async ({ browser }) => {
      test.setTimeout(90_000);
      const { context, page } = await seededBrowser(browser, v, {
        language: 'en', instrument: 'guitar', capoFret: 3, selectedKey: { natural: 'B', accidental: 'b' }, selectedScale: 'major',
      });
      await page.goto('/');
      const dock = page.getByTestId('instrument-dock');
      await expect(dock.getByTestId('capo-control')).toBeVisible({ timeout: 15_000 });
      const words = async (scope: Page | Locator) => {
        await scope.getByTestId('words-open').first().click();
        const sheet = page.getByTestId('glossary-sheet');
        await expect(sheet).toBeVisible();
        return sheet;
      };
      // The board (the page's own list).
      let sheet = await words(page);
      await expect(sheet.locator('[data-word="capo"]')).toHaveCount(1);
      await sheet.locator('[data-word="capo"] button').click();
      await expect(sheet.locator('[data-word="capo"]')).toContainText('A clamp across all the strings at one fret.');
      await page.keyboard.press('Escape');
      await expect(sheet).toBeHidden();
      // Settings → Guitar neck (the sheet's own list).
      await page.getByRole('button', { name: /^More/ }).click();
      await page.getByRole('menuitem', { name: 'Settings' }).click();
      const settings = page.getByRole('dialog', { name: 'Settings' });
      await settings.getByTestId('capo-setting').scrollIntoViewIfNeeded();
      sheet = await words(settings.getByTestId('capo-setting'));
      await expect(sheet.locator('[data-word]')).toHaveCount(1);
      await expect(sheet.locator('[data-word="capo"]')).toHaveCount(1);
      await sheet.locator('[data-word="capo"] button').click();
      await expect(sheet.locator('[data-word="capo"]')).toContainText('G shapes with a capo on fret 2 sound in A');
      await page.keyboard.press('Escape');
      await expect(sheet).toBeHidden();
      await settings.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(settings).toBeHidden();
      // The practice sheet's note.
      await page.getByTestId('practice-open').click();
      const practice = page.getByRole('dialog').filter({ has: page.getByTestId('practice-capo-note') });
      await expect(practice.getByTestId('practice-capo-note')).toBeVisible({ timeout: 15_000 });
      sheet = await words(practice);
      await expect(sheet.locator('[data-word="capo"]')).toHaveCount(1);
      await context.close();
    });
  }
});

// ─── 6. Drill's table meets the real lessons ───────────────────────────────
test.describe('6. Drill: "Open the lesson" opens the track lesson; captions name it in every language', () => {
  const TITLES: Record<Lang, { m4: string; m5: string; follows: string; open: string }> = {
    en: { m4: 'A Scale Is a Ladder', m5: 'Three Notes Make a Chord', follows: 'Drill follows your lessons', open: 'Open the lesson' },
    pt: { m4: 'Uma escala é uma escada', m5: 'Três notas fazem um acorde', follows: 'O Treino segue as tuas lições', open: 'Abrir a lição' },
    es: { m4: 'Una escala es una escalera', m5: 'Tres notas forman un acorde', follows: 'La Práctica sigue tus lecciones', open: 'Abrir la lección' },
  };
  const QUOTE: Record<Lang, (s: string) => string> = { en: (s) => `“${s}”`, pt: (s) => `«${s}»`, es: (s) => `«${s}»` };

  for (const lang of ['en', 'pt', 'es'] as const) {
    test(`${lang}: the intro names the lesson that opens the first questions, and opens it`, async ({ browser }) => {
      const w = TITLES[lang];
      const { context, page } = await seededBrowser(browser, PHONE, { lastView: 'drill', language: lang, learnerProfile: 'new' }, {}, { lang });
      await page.goto('/');
      const intro = page.locator('#drill-panel').getByTestId('drill-intro');
      await expect(intro).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('drill-follow-lead')).toContainText(w.follows);
      await expect(page.getByTestId('drill-follow-empty')).toContainText(QUOTE[lang](w.m4));
      await page.getByRole('button', { name: w.open }).click();
      await expect(page.getByRole('heading', { level: 1, name: w.m4 })).toBeVisible({ timeout: 15_000 });
      await context.close();
    });
  }

  test('en laptop: a locked topic on the mastery map opens its lesson (l1u34m5)', async ({ browser }) => {
    const { context, page } = await seededBrowser(browser, LAPTOP, { lastView: 'drill', language: 'en', learnerProfile: 'new' });
    await page.goto('/');
    const panel = page.locator('#drill-panel');
    await expect(panel.getByTestId('drill-intro')).toBeVisible({ timeout: 15_000 });
    await panel.getByRole('button', { name: 'Choose topics myself' }).click();
    await panel.getByRole('button', { name: /^Choose topics$/ }).click();
    await panel.getByTestId('drill-follow-switch').click();
    await panel.getByRole('button', { name: /Mastery map/ }).click();
    await panel.getByRole('button', { name: `Unlocks with “${SOUND.modules[4].title}”` }).click();
    await expect(page.getByRole('heading', { level: 1, name: SOUND.modules[4].title })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('navigation', { name: /breadcrumb/i }).first()).toContainText('Start with sound');
    await context.close();
  });
});

// ─── 8. A first visit by link ──────────────────────────────────────────────
test('8. ?prog=G,D,Em,C in a new browser: the start screen steps aside, Explore opens on the panel, no door is saved; the next plain visit shows the start screen', async ({ browser }) => {
  const { context, page } = await freshBrowser(browser, PHONE);
  await page.goto('/?prog=G,D,Em,C');
  await expect(page.getByTestId('progression-panel')).toBeVisible({ timeout: 15_000 });
  await expect(startScreen(page)).toHaveCount(0);
  expect(await chipNames(page)).toEqual(['G', 'D', 'Em', 'C']);
  expect(new URL(page.url()).search).toBe('');
  expect(await appKeys(page)).toEqual(['fermata-welcome-v1', 'music-theory-app']);
  expect(await page.evaluate(() => localStorage.getItem('fermata-welcome-v1'))).toBe('pending');
  const s = await savedState(page);
  for (const k of ['learnerProfile', 'startHint', 'exploreDetail', 'showSolfege']) expect(s).not.toHaveProperty(k);
  await page.goto('/');
  await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
  await context.close();
});

// ─── 9. The doors and the tour ─────────────────────────────────────────────
test.describe('9. the doors and the tour', () => {
  for (const v of [PHONE, LAPTOP]) {
    test(`${v.name}: "New to music" lands in lesson 1 of Start with sound, sound one tap away`, async ({ browser }) => {
      const { context, page } = await freshBrowser(browser, v);
      await page.goto('/');
      await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
      await page.getByTestId('start-door-new').click();
      await expect(page.getByRole('heading', { level: 1, name: SOUND.modules[0].title })).toBeVisible({ timeout: 15_000 });
      const hear = page.getByTestId('inline-try-this').first().getByRole('button', { name: 'Hear it' });
      await expect(hear).toBeInViewport();
      const dock = await page.getByTestId('instrument-dock').boundingBox();
      const box = (await hear.boundingBox())!;
      if (dock) expect(box.y + box.height, 'Hear it above the dock').toBeLessThanOrEqual(dock.y + 1);
      await context.close();
    });

    test(`${v.name}: "I play" lands in Explore; its hint's link opens chord-first lesson 1`, async ({ browser }) => {
      const { context, page } = await freshBrowser(browser, v);
      await page.goto('/');
      await page.getByTestId('start-door-player').click();
      await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
      const link = page.getByTestId('start-hint').getByTestId('start-hint-lesson');
      await expect(link).toHaveText('Theory from the chords you know: lesson 1 →');
      await link.click();
      await expect(page.getByRole('heading', { level: 1, name: CHORDS.modules[0].title })).toBeVisible({ timeout: 15_000 });
      await context.close();
    });

    test(`${v.name}: "I know some theory" is as before: Explore, Full view, no hint`, async ({ browser }) => {
      const { context, page } = await freshBrowser(browser, v);
      await page.goto('/');
      await page.getByTestId('start-door-theory').click();
      await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
      expect(await exploreDetail(page)).toBe('full');
      await expect(page.getByTestId('start-hint')).toHaveCount(0);
      await context.close();
    });
  }

  test('the tour from the start screen runs to its end and writes nothing', async ({ browser }) => {
    test.setTimeout(150_000);
    const { context, page } = await freshBrowser(browser, LAPTOP);
    await page.goto('/');
    await expect(startScreen(page)).toBeVisible({ timeout: 15_000 });
    const before = await allStorage(page);
    await page.getByTestId('start-tour').click();
    await stepToEnd(page);
    await page.getByTestId('tour-done').click();
    await expect(startScreen(page)).toBeVisible();
    expect(await allStorage(page)).toEqual(before);
    await context.close();
  });

  for (const v of [PHONE, LAPTOP]) {
    test(`${v.name}: the tour from the menu with the Progression panel open runs, puts the panel back, and writes nothing`, async ({ browser }) => {
      test.setTimeout(150_000);
      const { context, page } = await seededBrowser(browser, v, { language: 'en', instrument: 'piano', progression: { chords: ['G', 'D', 'Em', 'C'], bpm: 90, beats: 4 } });
      await page.goto('/');
      await page.getByTestId('progression-toggle').click();
      await expect(page.getByTestId('progression-panel')).toBeVisible({ timeout: 15_000 });
      const before = await allStorage(page);
      await page.getByRole('button', { name: /^More/ }).click();
      await page.getByRole('menuitem', { name: 'Show me around' }).click();
      await stepToEnd(page);
      await expect(page.getByTestId('tour-caption')).toHaveText('Your turn.');
      await page.getByTestId('tour-restore').click();
      await expect(bar(page)).toHaveCount(0);
      await expect(page.getByTestId('progression-panel')).toBeVisible();
      expect(await chipNames(page)).toEqual(['G', 'D', 'Em', 'C']);
      expect(await allStorage(page)).toEqual(before);
      await context.close();
    });
  }
});

// ─── 10. The owner ─────────────────────────────────────────────────────────
/**
 * His save as production holds it (the frozen v6 fixture: B♭ Dorian, guitar
 * in Drop D, Portuguese, Learn last, no profile, no neck fields, no welcome
 * flag) and months of progress, a Drill history with a session under way,
 * fingerings and Learn's empty session record. What he SEES is compared with
 * what wave2/base (main + three contract files) showed the same save:
 * `e2e/fixtures/wave2-owner-main.json`, recorded there with
 * RECORD_OWNER_MAIN=1 (visible text per screen, the level grid's geometry,
 * the chords card's height). Wave 2 may add only what the briefs name.
 */
const OWNER_FIXTURE = 'e2e/fixtures/wave2-owner-main.json';
/** A store as the app writes it (compact JSON): the fixtures on disk are pretty-printed. */
const asSaved = (path: string) => JSON.stringify(JSON.parse(fs.readFileSync(path, 'utf8')));
const ownerSave = () => asSaved('src/state/__tests__/fixtures/settings-v6-before-start.json');
function ownerStores(): Record<string, string> {
  const done = [
    'l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u2m1', 'l1u2m2', 'l1u3m1', 'l1u3m2', 'l1u3m3', 'l1u4m1', 'l1u4m2',
    'l2u4m1', 'l2u4m2', 'l2u5m1',
  ];
  const FAR = 4102444800000; // 2100-01-01: no review falls due while the test runs
  return {
    'music-theory-app': ownerSave(),
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

async function ownerBrowser(browser: Browser, v: View) {
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
  return { context, page: await context.newPage() };
}

/** Visible text under `root`, in document order, leaving out `exclude` and the live clock. */
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
    out.push(t.replace(/\b\d+(\.\d)?\s?s\b/g, '#s'));
  }
  return out;
}, [root, exclude] as const);

const rectsOf = (page: Page, selector: string, exclude: string) => page.locator(selector).evaluateAll((els, ex) =>
  els.filter((e) => !e.closest(ex)).map((e) => { const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.height), (e.textContent ?? '').slice(0, 40)]; }), exclude);

interface OwnerView { learn: string[]; learnButtons: unknown[]; level1: string[]; explore: string[]; chordsCard: string[]; chordsCardHeight: number; drill: string[] }

async function ownerSession(page: Page, v: View): Promise<OwnerView> {
  await page.goto('/');
  // Learn (his last view): the overview.
  const learn = page.locator('#learn-panel');
  await expect(learn.locator('button').filter({ hasText: 'Fundamentos' }).first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(800);
  const view: Partial<OwnerView> = {};
  view.learn = (await visibleText(page, '#learn-panel', ['[data-testid="tracks-other"]']))!;
  view.learnButtons = await rectsOf(page, '#learn-panel button', '[data-testid="tracks-other"]');
  // Level 1.
  await learn.locator('button').filter({ hasText: 'Fundamentos' }).first().click();
  await page.waitForTimeout(800);
  view.level1 = (await visibleText(page, '#learn-panel'))!;
  // Explore.
  await page.locator('[data-tab="explore"]').click();
  await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
  if (v.touch) {
    // His dock is at Full; the sheet then covers the view: lower it to see the work.
    await page.locator('[data-testid="instrument-dock"] [role="separator"]').focus();
    await page.keyboard.press('ArrowDown');
  }
  await page.waitForTimeout(800);
  view.explore = (await visibleText(page, '#main-content'))!;
  view.chordsCard = (await visibleText(page, '[data-testid="chords-card"]'))!;
  view.chordsCardHeight = Math.round((await page.getByTestId('chords-card').boundingBox())!.height);
  if (v.touch) {
    await page.locator('[data-testid="instrument-dock"] [role="separator"]').focus();
    await page.keyboard.press('ArrowUp');
  }
  // Drill.
  await page.locator('[data-tab="drill"]').click();
  await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1000);
  view.drill = (await visibleText(page, '#drill-panel'))!;
  // Back to where he was.
  await page.locator('[data-tab="learn"]').click();
  await expect(learn).toBeVisible();
  await page.waitForTimeout(500);
  return view as OwnerView;
}

for (const v of [PHONE, LAPTOP]) {
  test(`10. the owner (${v.name}): every screen as on main, plus only the named additions; his whole save byte for byte`, async ({ browser }) => {
    test.setTimeout(120_000);
    const { context, page } = await ownerBrowser(browser, v);
    const before = ownerStores();
    const seen = await ownerSession(page, v);
    const after = await allStorage(page);

    if (process.env.RECORD_OWNER_MAIN) {
      const all = fs.existsSync(OWNER_FIXTURE) ? JSON.parse(fs.readFileSync(OWNER_FIXTURE, 'utf8')) : {};
      const changedKeys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((k) => after[k] !== before[k]);
      all[v.name] = { ...seen, storageUnchanged: changedKeys.length === 0, changedKeys };
      // Pixel positions depend on the system's fonts: say where they were measured.
      all.platform = process.platform;
      fs.mkdirSync('e2e/fixtures', { recursive: true });
      fs.writeFileSync(OWNER_FIXTURE, `${JSON.stringify(all, null, 1)}\n`);
      await context.close();
      return;
    }
    const recorded = JSON.parse(fs.readFileSync(OWNER_FIXTURE, 'utf8'));
    const main = recorded[v.name] as OwnerView;
    // The recording's pixel positions hold only on the system that made it
    // (a level card's text wraps differently under another system's fonts:
    // GitHub's Linux runners draw one card 19 px taller than the Mac that
    // recorded it). Elsewhere the same promise is proved without pixels from
    // the recording: the same buttons in the same order, and the additions
    // moving nothing above them (below).
    const samePlatform = recorded.platform === process.platform;

    // No start screen, no hint; Full view; his neck; no capo.
    await page.locator('[data-tab="explore"]').click();
    await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
    await expect(startScreen(page)).toHaveCount(0);
    await expect(page.getByTestId('start-hint')).toHaveCount(0);
    expect(await exploreDetail(page)).toBe('full');
    expect(await neckDrawn(page)).toEqual({ strings: [6, 5, 4, 3, 2, 1], nut: 'right' });
    await expect(page.locator('[data-capo-bar]')).toHaveCount(0);
    await expect(page.getByTestId('capo-control')).toHaveCount(0);
    // The chords card: its three tabs, plus only the new "Progressão" button, at the same height.
    await expect(page.getByTestId('chords-card').getByRole('tab')).toHaveCount(3);
    expect(seen.chordsCard.filter((t) => t !== 'Progressão')).toEqual(main.chordsCard);
    expect(seen.chordsCard.filter((t) => t === 'Progressão')).toHaveLength(1);
    expect(seen.chordsCardHeight).toBe(main.chordsCardHeight);
    // The whole of Explore: the same words, plus that one.
    expect(seen.explore.filter((t) => t !== 'Progressão')).toEqual(main.explore);
    // Learn's overview: unchanged above the level grid (same words, every button where it was), the two track cards below it.
    expect(seen.learn).toEqual(main.learn);
    type Rect = [number, number, string];
    expect((seen.learnButtons as Rect[]).map((b) => b[2])).toEqual((main.learnButtons as Rect[]).map((b) => b[2]));
    if (samePlatform) expect(seen.learnButtons).toEqual(main.learnButtons);
    await page.locator('[data-tab="learn"]').click();
    const other = page.getByTestId('tracks-other');
    await expect(other).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('tracks-start-here')).toHaveCount(0);
    await expect(other.getByTestId('track-card-sound')).toBeVisible();
    await expect(other.getByTestId('track-card-chords')).toBeVisible();
    // On every system: every button of the overview stands exactly where it
    // stands with the track cards taken out of the page, and the cards come
    // below the last of them.
    await page.waitForTimeout(300);
    const withCards = await rectsOf(page, '#learn-panel button', '[data-testid="tracks-other"]') as Rect[];
    await other.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
    const withoutCards = await rectsOf(page, '#learn-panel button', '[data-testid="tracks-other"]') as Rect[];
    await other.evaluate((el) => { (el as HTMLElement).style.display = ''; });
    expect(withCards.length).toBe((main.learnButtons as Rect[]).length);
    expect(withCards).toEqual(withoutCards);
    const lastLevel = withCards.reduce((m, [top, h]) => Math.max(m, top + h), 0);
    expect((await other.boundingBox())!.y).toBeGreaterThanOrEqual(lastLevel);
    // Level 1: as on main (its counts included).
    expect(seen.level1).toEqual(main.level1);
    // Drill: as on main, no "follows" wording.
    expect(seen.drill).toEqual(main.drill);
    expect(seen.drill.join(' ')).not.toMatch(/segue as tuas lições|Seguir as minhas lições|Follow my lessons/);
    // His whole save, every store, byte for byte, after a session through every view.
    expect(after).toEqual(before);
    await context.close();
  });
}
