import { test, expect, type Browser, type Page } from '@playwright/test';

/**
 * Second audit round, 19 November 2026 (stream X, Explore and piano), in the
 * browser, on the dev server and the build alike:
 *
 *  - M58 (music audit 2): a chord's small staff, its ▶ Chord and its
 *    ▶ Arpeggio are one voicing. At 153caab, piano at C4, C/E as written
 *    (Simple view) played E3 C4 E4 G4 while the staff drew and the arpeggio
 *    played C4 E4 G4; a bass outside the chord (Dm7/G, C/D, C/B♭) was
 *    doubled and the chord pushed up an octave; at C3 the arpeggio was
 *    close, the chord open and the staff at C4. Read here: the noteheads
 *    the staff DREW (their line or space, under the clef it drew), the keys
 *    the piano lights while ▶ Chord sounds, and the order in which ▶ Arpeggio
 *    lights them; on the dev server also what the audio engine is handed.
 *  - M59: the staff strip draws and sounds where the piano's octave is (C3:
 *    C3–C4, in the bass clef), back and forth between C3 and C4.
 *  - P5 (QA report 2): every area of Explore that scrolls shows a fade at
 *    its foot while it has more below; at 375×667 the guitar's Half keeps
 *    the fret numbers with the strings. (The measurements before / after are
 *    in the builder's report; `explore-workbench.spec.ts` keeps the
 *    1440×900 fit.)
 *  - The chord detail's landing keeps ▶ Chord and the detail's second row
 *    out from under the metronome's bar.
 */

type Seed = Record<string, unknown>;
async function open(browser: Browser, baseURL: string, opts: { w: number; h: number; touch?: boolean; state?: Seed; path?: string }) {
  const context = await browser.newContext({
    viewport: { width: opts.w, height: opts.h }, isMobile: !!opts.touch, hasTouch: !!opts.touch,
    reducedMotion: 'reduce', serviceWorkers: 'block',
  });
  await context.addInitScript(({ blob, origin }) => {
    if (location.origin !== origin || sessionStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('fermata-welcome-v1', 'seen');
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, { origin: new URL(baseURL).origin, blob: JSON.stringify({ state: {
    themeMode: 'fermata', language: 'en', lastView: 'explore', instrument: 'piano', baseOctave: 4,
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', guitarScalePosition: 0, ...opts.state,
  }, version: 6 }) });
  const page = await context.newPage();
  await page.goto(opts.path ?? '/');
  await expect(page.getByTestId('scale-strip')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);
  return { context, page };
}

// On a dev server just started, the first import of core audio through its
// own /src address can make Vite optimise a dependency it had not met and
// reload every page (seen once in a full run: the share link's chord gone
// after the reload). Import it once, on a page of its own, before any test.
test.beforeAll(async ({ browser, baseURL }) => {
  const page = await browser.newPage();
  const res = await page.request.get(`${baseURL}/src/core/services/audio.ts`);
  if (res.ok() && (res.headers()['content-type'] ?? '').includes('javascript')) {
    await page.goto(`${baseURL}/`);
    await page.evaluate("import('/src/core/services/audio.ts')");
    await page.waitForTimeout(1500);
  }
  await page.close();
});

let devModules: boolean | undefined;
async function hasDevModules(page: Page) {
  if (devModules === undefined) {
    const res = await page.request.get('/src/core/services/audio.ts');
    devModules = res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
  }
  if (!devModules) test.info().annotations.push({ type: 'note', description: 'what the audio engine is handed is read through the dev server\'s own module: that part is skipped on the build' });
  return devModules;
}
async function recordVoice(page: Page) {
  await page.evaluate(`(async () => {
    const audio = await import('/src/core/services/audio.ts');
    window.__played = [];
    audio.setInstrumentVoice({
      playNote: (midi, when) => { window.__played.push({ midi, when }); return true; },
      startNote: () => true, stopNote: () => {}, setVolume: () => {}, resume: () => Promise.resolve(), cancelScheduled: () => {},
    });
  })()`);
}
async function heard(page: Page): Promise<number[]> {
  const p = await page.evaluate(() => (window as unknown as { __played: { midi: number; when: number }[] }).__played.splice(0));
  return [...p].sort((a, b) => a.when - b.when || a.midi - b.midi).map((x) => x.midi);
}

/** Diatonic position (octave × 7 + letter) of a sounding MIDI number, spelled with one of `letters` (B♯ and C♭ cross the octave). */
function position(midi: number, spellings: string[]): number {
  const LETTERS = 'CDEFGAB';
  const PCS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const ACC: Record<string, number> = { '': 0, '♯': 1, '#': 1, '♭': -1, b: -1, '𝄪': 2, '𝄫': -2 };
  const name = spellings.find((s) => (((PCS[s[0]] + (ACC[s.slice(1)] ?? 0)) % 12) + 12) % 12 === midi % 12);
  if (!name) throw new Error(`no spelling for ${midi} among ${spellings}`);
  const natural = PCS[name[0]] + (ACC[name.slice(1)] ?? 0);
  const octave = Math.round((midi - natural) / 12) - 1;
  return octave * 7 + LETTERS.indexOf(name[0]);
}

/** Every notehead a staff DREW, as a sounding diatonic position, low to high: its line or space under the clef it drew. */
async function staffPositions(page: Page, selector: string): Promise<number[]> {
  return page.locator(selector).first().evaluate((root) => {
    const svg = root.querySelector('svg')!;
    const lines = Array.from(svg.querySelectorAll('g.vf-stave > path')).map((p) => {
      const n = (p.getAttribute('d')?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
      return n.length === 4 && n[1] === n[3] && n[0] !== n[2] ? n[1] : null;
    }).filter((y): y is number => y !== null).sort((a, b) => a - b);
    const bottomLine = lines[4];
    const half = (lines[4] - lines[0]) / 8;
    const glyph = svg.querySelector('g.vf-clef text')!.textContent!.codePointAt(0)!.toString(16);
    // Bottom line: treble E4 (4·7+2), bass G2 (2·7+4); an 8vb clef sounds an octave below, 8va above.
    const base = { e050: 30, e052: 30 - 7, e053: 30 + 7, e062: 18, e064: 18 - 7, e065: 18 + 7 }[glyph];
    if (base === undefined) throw new Error(`clef ${glyph}`);
    // One head per group: its notehead glyph (U+E0A0–E0FF), not a ledger line's.
    return Array.from(svg.querySelectorAll('g.vf-notehead')).map((g) => {
      const t = Array.from(g.querySelectorAll('text')).find((x) => { const c = x.textContent!.codePointAt(0)!; return c >= 0xe0a0 && c <= 0xe0ff; })!;
      const b = (t as SVGGraphicsElement).getBBox();
      return base + Math.round((bottomLine - (b.y + b.height / 2)) / half);
    }).sort((a, b) => a - b);
  });
}

const litKeys = (page: Page) => page.locator('[data-piano-key][aria-pressed="true"]').evaluateAll((els) => els.map((e) => Number(e.getAttribute('data-midi'))).sort((a, b) => a - b));
/** The order in which piano keys light from now on. */
async function watchLighting(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __lit: number[] };
    w.__lit = [];
    const obs = new MutationObserver((records) => {
      for (const r of records) {
        const el = r.target as HTMLElement;
        if (el.getAttribute('aria-pressed') === 'true' && r.oldValue !== 'true') w.__lit.push(Number(el.getAttribute('data-midi')));
      }
    });
    obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'], attributeOldValue: true });
  });
}
const lighting = (page: Page) => page.evaluate(() => (window as unknown as { __lit: number[] }).__lit.splice(0));

test.describe('M58: the chord staff, ▶ Chord and ▶ Arpeggio are one voicing', () => {
  const CASES = [
    // symbol, view, octave, the voicing as MIDI (piano)
    ['C/E', 'simple', 4, [52, 60, 64, 67]],
    ['C/G', 'simple', 4, [55, 60, 64, 67]],
    ['G7/F', 'simple', 4, [53, 67, 71, 74, 77]],
    ['C/E', 'full', 4, [64, 67, 72]],
    ['Dm7/G', 'full', 4, [55, 62, 65, 69, 72]],
    ['C/D', 'full', 4, [50, 60, 64, 67]],
    ['C/Bb', 'full', 4, [58, 60, 64, 67]],
    ['C', 'full', 3, [48, 55, 64]],
  ] as const;
  for (const [symbol, view, octave, voicing] of CASES) {
    test(`piano at C${octave}, ${symbol} (${view} view): drawn, played and arpeggiated as ${voicing.join(' ')}`, async ({ browser, baseURL }) => {
      const { context, page } = await open(browser, baseURL!, { w: 1024, h: 900, state: { exploreDetail: view, baseOctave: octave }, path: `/?key=C&scale=major&chord=${encodeURIComponent(symbol)}&inst=piano` });
      const detail = page.getByTestId('chord-detail');
      await expect(detail).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('chord-staff').locator('g.vf-notehead').first()).toBeAttached();
      const spellings = (await detail.getByRole('group', { name: 'Notes' }).getByRole('button').allTextContents()).map((s) => s.trim());
      const expected = voicing.map((m) => position(m, spellings));
      expect(await staffPositions(page, '[data-testid="chord-staff"]'), 'the staff draws').toEqual(expected);
      const dev = await hasDevModules(page);
      // A first tap warms the app's own voice up; record after it.
      await detail.getByRole('button', { name: 'Chord', exact: true }).click();
      await page.waitForTimeout(1700);
      if (dev) await recordVoice(page);
      await detail.getByRole('button', { name: 'Chord', exact: true }).click();
      await page.waitForTimeout(150);
      expect(await litKeys(page), '▶ Chord lights').toEqual([...voicing]);
      if (dev) expect(await heard(page), '▶ Chord is handed to the audio engine').toEqual([...voicing]);
      await page.waitForTimeout(1600);
      await watchLighting(page);
      await detail.getByRole('button', { name: 'Arpeggio', exact: true }).click();
      await page.waitForTimeout(400 * voicing.length + 300);
      expect(await lighting(page), '▶ Arpeggio lights the voicing from the bass up').toEqual([...voicing]);
      if (dev) expect(await heard(page), '▶ Arpeggio is handed to the audio engine in that order').toEqual([...voicing]);
      await context.close();
    });
  }

  test('guitar, C/E as written (Simple view): the staff draws the bass the chord plays (E2, written E3 under the treble-8vb clef)', async ({ browser, baseURL }) => {
    const { context, page } = await open(browser, baseURL!, { w: 1024, h: 900, state: { exploreDetail: 'simple', instrument: 'guitar' }, path: '/?key=C&scale=major&chord=C%2FE&inst=guitar' });
    await expect(page.getByTestId('chord-staff').locator('g.vf-notehead').first()).toBeAttached({ timeout: 15_000 });
    const spellings = ['C', 'E', 'G'];
    expect(await staffPositions(page, '[data-testid="chord-staff"]')).toEqual([40, 48, 52, 55].map((m) => position(m, spellings)));
    if (await hasDevModules(page)) {
      const detail = page.getByTestId('chord-detail');
      await detail.getByRole('button', { name: 'Chord', exact: true }).click();
      await page.waitForTimeout(1700);
      await recordVoice(page);
      await detail.getByRole('button', { name: 'Chord', exact: true }).click();
      await page.waitForTimeout(150);
      expect(await heard(page)).toEqual([40, 48, 52, 55]);
      await page.waitForTimeout(1600);
      await detail.getByRole('button', { name: 'Arpeggio', exact: true }).click();
      await page.waitForTimeout(2000);
      expect(await heard(page)).toEqual([40, 48, 52, 55]);
    }
    await context.close();
  });
});

test.describe('M59: the staff strip follows the piano\'s octave', () => {
  test('C major: C4 → C3 → C4 — the strip draws (bass clef at C3), lists and sounds its octave; degrees 1 and 8 light their keys', async ({ browser, baseURL }) => {
    const { context, page } = await open(browser, baseURL!, { w: 1024, h: 900 });
    const dev = await hasDevModules(page);
    const strip = async () => page.locator('.strip-col').evaluateAll((els) => els.map((e) => ({ midi: Number(e.getAttribute('data-midi')), note: e.getAttribute('data-note')! })));
    for (const octave of [4, 3, 4, 3]) {
      await page.getByRole('radio', { name: `C${octave}`, exact: true }).click();
      await expect(page.locator('.strip-col').first()).toHaveAttribute('data-midi', String(12 * (octave + 1)));
      await page.waitForTimeout(300);
      const cols = await strip();
      expect(cols.map((c) => c.midi), `C${octave}`).toEqual([0, 2, 4, 5, 7, 9, 11, 12].map((i) => 12 * (octave + 1) + i));
      const glyph = await page.locator('.strip-staff svg g.vf-clef text').first().evaluate((t) => t.textContent!.codePointAt(0)!.toString(16));
      expect(glyph, `C${octave}: the clef`).toBe(octave === 3 ? 'e062' : 'e050');
      expect(await staffPositions(page, '.strip-staff'), `C${octave}: the strip draws its own pitches`)
        .toEqual(cols.map((c) => position(c.midi, [c.note])));
      // Degrees 1 and 8, tapped: each lights its own key.
      for (const i of [0, 7]) {
        await page.locator('.strip-col').nth(i).click();
        await expect.poll(() => litKeys(page), `C${octave}: degree ${i + 1}`).toContain(cols[i].midi);
        await page.waitForTimeout(800);
      }
      if (dev) {
        await recordVoice(page);
        await page.getByRole('button', { name: 'Play scale ascending' }).click();
        await page.waitForTimeout(2600);
        expect(await heard(page), `C${octave}: ▶ Play scale`).toEqual(cols.map((c) => c.midi));
      }
    }
    await context.close();
  });
});

/** Wait until the work column, the circle column and the dock keep their sizes, and the work column its scroll, for three frames. */
async function settled(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    const read = () => ['.explore-main', '.explore-aside', '.explore-work', '[data-testid="instrument-dock"]', '[data-testid="chord-detail"]']
      .map((sel) => { const e = document.querySelector(sel); return e ? `${e.clientHeight}/${e.scrollHeight}/${e.scrollTop}/${Math.round(e.getBoundingClientRect().top)}` : '-'; }).join('|');
    let last = read(); let same = 0; let frames = 0;
    const tick = () => { const now = read(); same = now === last ? same + 1 : 0; last = now; if (same >= 3 || ++frames > 120) resolve(); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
}

test.describe('P5: an area that scrolls shows a fade at its foot while it has more', () => {
  /** Each fade: whether it is painted, and the box it is drawn in; and how much content its scroller has below its foot. */
  const cues = (page: Page) => page.evaluate(() => {
    const root = document.querySelector('.explore-root')!;
    const below = (el: HTMLElement | null) => {
      if (!el || !/(auto|scroll)/.test(getComputedStyle(el).overflowY) || el.scrollHeight <= el.clientHeight + 1) return 0;
      const foot = el.getBoundingClientRect().top + el.clientTop + el.clientHeight;
      return Math.max(0, Math.round(Math.max(...Array.from(el.children).map((c) => c.getBoundingClientRect().bottom)) - foot));
    };
    const fade = (el: Element | null, pseudo: string) => {
      if (!el) return { opacity: NaN, width: NaN, position: '' };
      const cs = getComputedStyle(el, pseudo);
      return { opacity: Number(cs.opacity), width: parseFloat(cs.width), position: cs.position };
    };
    // A column's content width: where its own last item (the fade) is drawn.
    const box = (sel: string) => {
      const e = document.querySelector<HTMLElement>(sel);
      if (!e) return null;
      const cs = getComputedStyle(e);
      return { width: e.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) };
    };
    const main = document.querySelector<HTMLElement>('.explore-main');
    const aside = document.querySelector<HTMLElement>('.explore-aside');
    return {
      main: { below: below(main), fade: fade(main, '::after'), box: box('.explore-main') },
      aside: { below: below(aside), fade: fade(aside, '::after'), box: box('.explore-aside') },
      work: { below: Math.max(below(document.querySelector('.explore-work')), below(root as HTMLElement)), fade: fade(root, '::after') },
    };
  });
  const shown = (c: { below: number; fade: { opacity: number } }) => ({ more: c.below > 1, fade: c.fade.opacity });
  /** The fade is its OWN column's: held at the column's foot (sticky), as wide as the column's content. */
  const overItsColumn = (c: { fade: { width: number; position: string }; box: { width: number } | null }, label: string) => {
    expect(c.box, label).not.toBeNull();
    expect(c.fade.position, `${label}: held at the column's visible foot`).toBe('sticky');
    expect(Math.abs(c.fade.width - c.box!.width), `${label}: the fade is as wide as its column`).toBeLessThanOrEqual(1);
  };

  test('1280×720 with the guitar: both columns overflow and both fade, each over its own column; scrolled to the foot, the fade goes', async ({ browser, baseURL }) => {
    const { context, page } = await open(browser, baseURL!, { w: 1280, h: 720, state: { instrument: 'guitar' } });
    await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
    await settled(page);
    let c = await cues(page);
    expect(shown(c.main)).toEqual({ more: true, fade: 1 });
    expect(shown(c.aside)).toEqual({ more: true, fade: 1 });
    overItsColumn(c.main, 'work column');
    overItsColumn(c.aside, 'circle column');
    await page.locator('.explore-aside').evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await page.locator('.explore-main').evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await settled(page);
    c = await cues(page);
    expect(shown(c.main)).toEqual({ more: false, fade: 0 });
    expect(shown(c.aside)).toEqual({ more: false, fade: 0 });
    await context.close();
  });

  test('1366×768 with the guitar, chord I open: a cut of a few px gets the fade too', async ({ browser, baseURL }) => {
    const { context, page } = await open(browser, baseURL!, { w: 1366, h: 768, state: { instrument: 'guitar' } });
    await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
    await page.locator('.chord-row button').first().click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    await settled(page);
    const c = await cues(page);
    console.log(`[cue] 1366×768 guitar, chord I: ${c.main.below} px below the work column's foot`);
    expect(c.main.below, 'a small cut (the review measured 6 px)').toBeGreaterThan(1);
    expect(c.main.below).toBeLessThan(40);
    expect(c.main.fade.opacity).toBe(1);
    // The circle column fits here: its fade stays off (each fade reads its own column).
    expect(shown(c.aside)).toEqual({ more: false, fade: 0 });
    overItsColumn(c.main, 'work column');
    await context.close();
  });

  for (const language of ['en', 'pt']) {
    test(`1440×900, Open G, a chord selected (the audit's figure 5c), ${language.toUpperCase()}: the circle column's cut fact gets the fade`, async ({ browser, baseURL }) => {
      const { context, page } = await open(browser, baseURL!, { w: 1440, h: 900, state: { instrument: 'guitar', guitarTuningId: 'open-g', language } });
      await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
      await page.locator('.chord-row button').first().click();
      await expect(page.getByTestId('chord-detail')).toBeVisible();
      await settled(page);
      const c = await cues(page);
      console.log(`[cue] 1440×900 Open G ${language}, chord I: ${c.aside.below} px below the circle column's foot`);
      expect(c.aside.below, 'the notice line makes the dock taller: the last fact is cut').toBeGreaterThan(1);
      expect(c.aside.fade.opacity).toBe(1);
      overItsColumn(c.aside, 'circle column');
      // The work column fits: its fade stays off.
      expect(shown(c.main)).toEqual({ more: false, fade: 0 });
      await context.close();
    });
  }

  test('1440×900, standard tuning: nothing overflows, no fade; the fades add no height (measured with and without them)', async ({ browser, baseURL }) => {
    const { context, page } = await open(browser, baseURL!, { w: 1440, h: 900, state: { instrument: 'guitar' } });
    await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
    await page.locator('.chord-row button').nth(4).click();
    await settled(page);
    const c = await cues(page);
    expect([c.main.fade.opacity, c.aside.fade.opacity, c.work.fade.opacity]).toEqual([0, 0, 0]);
    const size = () => page.evaluate(() => ['.explore-main', '.explore-aside', '.explore-work'].map((s) => {
      const e = document.querySelector(s)!;
      return [e.scrollHeight, e.clientHeight];
    }));
    const withCues = await size();
    await page.addStyleTag({ content: '.explore-root::after, .explore-main::after, .explore-aside::after { display: none !important; }' });
    await settled(page);
    expect(await size()).toEqual(withCues);
    await context.close();
  });

  test('375×667 with the guitar: the work area fades above the sheet, and the sheet\'s Half keeps the fret numbers with the strings', async ({ browser, baseURL }) => {
    const { context, page } = await open(browser, baseURL!, { w: 375, h: 667, touch: true, state: { instrument: 'guitar' } });
    const dock = page.getByTestId('instrument-dock');
    await expect(dock).toHaveAttribute('data-detent', 'half');
    await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
    await settled(page);
    expect(shown((await cues(page)).work)).toEqual({ more: true, fade: 1 });
    const geo = await page.evaluate(() => {
      const d = document.querySelector('[data-testid="instrument-dock"]')!;
      const content = d.querySelector('.detent-content')!.getBoundingClientRect();
      const frets = d.querySelector('[data-dock-row="frets"]')!.getBoundingClientRect();
      const strings = Array.from(d.querySelectorAll('[data-dock-row="string"]')).map((r) => r.getBoundingClientRect());
      return { contentBottom: content.bottom, fretsBottom: frets.bottom, lastString: Math.max(...strings.map((s) => s.bottom)), view: document.getElementById('main-content')!.getBoundingClientRect().height };
    });
    expect(geo.lastString, 'six strings shown').toBeLessThanOrEqual(geo.contentBottom + 0.5);
    expect(geo.fretsBottom, 'their fret numbers shown with them').toBeLessThanOrEqual(geo.contentBottom + 0.5);
    expect(geo.view, 'the view keeps at least 120 px').toBeGreaterThanOrEqual(120);
    // Scrolled to the foot, the chords card is above the sheet and the fade goes.
    await page.locator('.explore-work').evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await settled(page);
    expect(shown((await cues(page)).work)).toEqual({ more: false, fade: 0 });
    const cards = await page.locator('.chord-row button').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().bottom));
    const sheetTop = (await dock.boundingBox())!.y;
    expect(Math.max(...cards)).toBeLessThanOrEqual(sheetTop + 0.5);
    await context.close();
  });
});

const WORDS = {
  en: { more: 'More', metronome: 'Metronome', all: 'All Chords', build: 'Build', strip: 'Chromatic strip from C' },
  pt: { more: 'Mais', metronome: 'Metrónomo', all: 'Todos os acordes', build: 'Construir', strip: 'Faixa cromática a partir de C' },
  es: { more: 'Más', metronome: 'Metrónomo', all: 'Todos los acordes', build: 'Construir', strip: 'Franja cromática desde C' },
} as const;

test.describe('the chord detail lands clear of the metronome\'s bar', () => {
  // The bar is a fixed overlay above the instrument's right end. After the
  // landing has settled: ▶ Chord and ▶ Arpeggio are never under it; where the
  // whole detail fits in the room between the held strip (or the column's
  // top) and the bar, nothing of it is; nothing of the detail, and no wedge
  // of the circle, is stuck there (each can be scrolled out). At 153caab the
  // landing counted the bar's band as visible (1440×900: "Learn about this"
  // under it); at fa31a35, in Portuguese at 1280×800, «Arpejo» settled 15 px
  // under it.
  for (const [w, h] of [[1440, 900], [1536, 864], [1366, 768], [1280, 800]] as const) {
    for (const instrument of ['piano', 'guitar'] as const) {
      for (const language of ['en', 'pt', 'es'] as const) {
        test(`${w}×${h}, ${instrument}, ${language.toUpperCase()}: with the bar open, In key, All Chords and Build land clear of it`, async ({ browser, baseURL }) => {
          test.setTimeout(90_000);
          const t = WORDS[language];
          const { context, page } = await open(browser, baseURL!, { w, h, state: { instrument, language } });
          if (instrument === 'guitar') await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
          await page.getByRole('button', { name: new RegExp(`^${t.more}`) }).click();
          await page.getByRole('menuitem', { name: t.metronome }).click();
          await expect(page.getByTestId('metronome')).toHaveAttribute('data-measured', 'true');
          await settled(page);
          const look = () => page.evaluate(() => {
            const b = document.querySelector('[data-testid="metronome"]')!.getBoundingClientRect();
            const main = document.querySelector<HTMLElement>('.explore-main')!;
            const aside = document.querySelector<HTMLElement>('.explore-aside')!;
            const strip = document.querySelector<HTMLElement>('.strip-card')!;
            const detail = document.querySelector<HTMLElement>('[data-testid="chord-detail"]')!;
            const covers = (el: Element) => {
              const r = el.getBoundingClientRect();
              return r.height > 0 && r.bottom > b.top + 1 && r.top < b.bottom - 1 && r.right > b.left + 1 && r.left < b.right - 1;
            };
            const freeable = (el: Element, scroller: HTMLElement) => {
              const start = scroller.scrollTop;
              for (let y = 0; y <= scroller.scrollHeight - scroller.clientHeight; y += 8) {
                scroller.scrollTop = y;
                if (!covers(el)) { scroller.scrollTop = start; return true; }
              }
              scroller.scrollTop = start;
              return false;
            };
            const under = Array.from(detail.querySelectorAll('button, .type-label')).filter(covers);
            const wedges = Array.from(aside.querySelectorAll('g[role="button"], text')).filter(covers);
            const edge = getComputedStyle(strip).position === 'sticky' ? strip.getBoundingClientRect().bottom : main.getBoundingClientRect().top;
            const name = (el: Element) => (el.textContent ?? '').trim().slice(0, 20);
            return {
              room: Math.round(b.top - edge - 16), detail: Math.round(detail.getBoundingClientRect().height),
              under: under.map(name),
              stuck: [...under.filter((el) => !freeable(el, main)), ...wedges.filter((el) => !freeable(el, aside))].map(name),
              actionsUnder: Array.from(detail.querySelectorAll('.chord-detail-actions button')).filter(covers).map(name),
            };
          });
          const land = async (label: string) => {
            await expect(page.getByTestId('chord-detail')).toBeVisible();
            await settled(page);
            await page.waitForTimeout(400); // a late re-landing (fonts, notation) comes within ~300 ms
            await settled(page);
            const r = await look();
            console.log(`[landing] ${w}×${h} ${instrument} ${language} ${label}: room ${r.room} px, detail ${r.detail} px, under the bar ${JSON.stringify(r.under)}`);
            expect(r.actionsUnder, `${label}: ▶ Chord / ▶ Arpeggio clear of the bar`).toEqual([]);
            if (r.detail <= r.room) expect(r.under, `${label}: the detail fits above the bar, so nothing of it is under it`).toEqual([]);
            expect(r.stuck, `${label}: nothing stuck under the bar (the detail, the circle's wedges)`).toEqual([]);
          };
          const top = async () => { await page.locator('.explore-main').evaluate((el) => { el.scrollTop = 0; }); await settled(page); };
          for (let i = 0; i < 7; i++) {
            await top();
            await page.locator('.chord-row button').nth(i).click();
            await land(`In key ${i + 1}`);
          }
          await top();
          await page.getByRole('tab', { name: t.all, exact: true }).click();
          await page.locator('[data-quality="minor"]').click();
          await land('All Chords, minor');
          await top();
          await page.getByRole('tab', { name: t.build, exact: true }).click();
          await page.getByRole('group', { name: t.strip }).getByRole('button').nth(4).click();
          await page.getByRole('group', { name: t.strip }).getByRole('button').nth(7).click();
          await land('Build, C major');
          await context.close();
        });
      }
    }
  }
});

test('a chord opened first and the metronome after: the work column still ends below the bar (its tail never replaces the bar\'s room)', async ({ browser, baseURL }) => {
  // Review of the second round: the landing wrote its tail as an inline
  // padding (2 px here) that shadowed the bar's room (index.css, 54 + 8 px).
  for (const [w, h] of [[1366, 768], [1280, 800], [1536, 864]] as const) {
    const { context, page } = await open(browser, baseURL!, { w, h, state: { instrument: 'guitar' } });
    await expect(page.locator('[role="grid"]').first()).toBeVisible({ timeout: 15_000 });
    await page.locator('.chord-row button').nth(4).click();
    await expect(page.getByTestId('chord-detail')).toBeVisible();
    await settled(page);
    await page.getByRole('button', { name: /^More/ }).click();
    await page.getByRole('menuitem', { name: 'Metronome' }).click();
    await expect(page.getByTestId('metronome')).toHaveAttribute('data-measured', 'true');
    await settled(page);
    const r = await page.evaluate(() => {
      const m = document.querySelector<HTMLElement>('.explore-main')!;
      return { pad: parseFloat(getComputedStyle(m).paddingBottom), room: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--metro-room')) };
    });
    expect(r.room, `${w}×${h}: the bar takes room`).toBeGreaterThan(0);
    expect(r.pad, `${w}×${h}: the work column's padding covers the bar's room`).toBeGreaterThanOrEqual(r.room + 8);
    await context.close();
  }
});
