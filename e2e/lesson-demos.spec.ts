import { test, expect, type Page, type Locator } from '@playwright/test';
import { readStaffSvg, drawnSounds, midiOf, type DrawnScore } from '../src/test/staffReader';

/**
 * Second audit (18 November 2026), M50–M56 and QA P7, in the browser: what
 * each lesson demonstration plays and what its staff draws, against the
 * lesson's sentence — on the dev server AND on the production build.
 *
 * The sound is read where both servers have it, at the Web Audio layer: the
 * piano's sample downloads are refused, so core audio plays its own synth,
 * and every note's carrier oscillator (the one core gives an `onended`) is
 * recorded with its frequency, its start and its stop (core stops a note 0.1 s
 * after its length). The staff is read from the SVG VexFlow drew, by its
 * glyphs (`src/test/staffReader.ts`, handed to the page as it is). The unit
 * twin: src/components/learn/__tests__/lessonDemonstrations.test.tsx.
 */

test.use({ serviceWorkers: 'block' });

interface Heard { midi: number; at: number; dur: number }

test.beforeEach(async ({ page }) => {
  await page.route('**/samples/**', (route) => route.abort());
  await page.addInitScript(() => {
    type Rec = { f: number; at: number; end?: number; osc: OscillatorNode };
    const w = window as unknown as { __osc: Rec[] };
    w.__osc = [];
    const proto = OscillatorNode.prototype;
    const start = proto.start;
    const stop = proto.stop;
    proto.start = function (this: OscillatorNode & { __rec?: Rec }, when = 0) {
      this.__rec = { f: this.frequency.value, at: when, osc: this };
      w.__osc.push(this.__rec);
      return start.call(this, when);
    } as typeof proto.start;
    proto.stop = function (this: OscillatorNode & { __rec?: Rec }, when = 0) {
      if (this.__rec) this.__rec.end = when;
      return stop.call(this, when);
    } as typeof proto.stop;
  });
});

async function openLesson(page: Page, id: string) {
  await page.goto(`/?lesson=${id}`);
  await expect(page.locator('[data-section="intro"]')).toBeVisible();
}

const conceptPanel = (page: Page, n: number) => page.locator(`[data-section="c${n}"] [data-testid="inline-try-this"]`);

/** Press "Hear it": the notes core audio started, onsets from the first, by onset then pitch. */
async function hear(page: Page, panel: Locator): Promise<Heard[]> {
  await panel.scrollIntoViewIfNeeded();
  await page.evaluate(() => { (window as unknown as { __osc: unknown[] }).__osc = []; });
  await panel.getByRole('button', { name: 'Hear it', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __osc: unknown[] }).__osc.length)).toBeGreaterThan(0);
  await page.waitForTimeout(200);
  const raw = await page.evaluate(() => (window as unknown as { __osc: { f: number; at: number; end?: number; osc: OscillatorNode }[] }).__osc
    .filter((r) => r.osc.onended)
    .map((r) => ({ midi: Math.round(69 + 12 * Math.log2(r.f / 440)), at: r.at, dur: (r.end ?? r.at) - r.at - 0.1 })));
  const t0 = Math.min(...raw.map((r) => r.at));
  return raw.map((r) => ({ midi: r.midi, at: Math.round((r.at - t0) * 1000) / 1000, dur: Math.round(r.dur * 1000) / 1000 }))
    .sort((a, b) => a.at - b.at || a.midi - b.midi);
}

/** What the panel's staff draws, read from its glyphs in the page. */
async function drawn(panel: Locator): Promise<DrawnScore> {
  const svg = panel.locator('svg:has(g.vf-stavenote)');
  await expect(svg).toHaveCount(1);
  return svg.evaluate(readStaffSvg);
}

const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const name = (m: number) => `${NAMES[((m % 12) + 12) % 12]}${Math.floor(m / 12) - 1}`;
function onsets(notes: Heard[]): Heard[][] {
  const out: Heard[][] = [];
  for (const n of notes) {
    const last = out[out.length - 1];
    if (last && Math.abs(last[0].at - n.at) < 0.003) last.push(n);
    else out.push([n]);
  }
  return out;
}
const soundingAt = (n: Heard, t: number) => n.at <= t + 1e-3 && t < n.at + n.dur - 1e-3;

/** The drawing and the sound agree: the same pitches, onsets in proportion, lengths within the value. */
function expectDrawnAsPlayed(score: DrawnScore, played: Heard[]) {
  const written = drawnSounds(score);
  expect(written.map((w) => midiOf(w.pitch))).toEqual(played.map((p) => p.midi));
  const k = written.reduce((acc, w, i) => (acc || w.at === 0 ? acc : played[i].at / w.at), 0);
  written.forEach((w, i) => {
    if (!k) return;
    expect(Math.abs(played[i].at - w.at * k), `onset of ${w.pitch}`).toBeLessThan(0.005);
    const ratio = played[i].dur / (w.beats * k);
    expect(ratio, `length of ${w.pitch}`).toBeGreaterThan(0.75);
    expect(ratio, `length of ${w.pitch}`).toBeLessThan(1.01);
  });
}

test.describe('second audit: lesson demonstrations play and draw what the lesson says', () => {
  test('M50 — key signatures after the clef, in the three concepts and the task that asks about them', async ({ page }) => {
    await openLesson(page, 'l1u3m2');
    const cases = [
      { n: 0, signature: [{ sign: '#', letter: 'F' }], scale: ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'] },
      { n: 1, signature: [{ sign: '#', letter: 'F' }, { sign: '#', letter: 'C' }], scale: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'] },
      { n: 2, signature: [{ sign: 'b', letter: 'B' }], scale: ['F4', 'G4', 'A4', 'Bb4', 'C5', 'D5', 'E5', 'F5'] },
    ];
    for (const c of cases) {
      const panel = conceptPanel(page, c.n);
      const score = await drawn(panel);
      expect(score.staves.map((s) => s.signature)).toEqual([c.signature]);
      expect(score.notes.flatMap((x) => x.printed)).toEqual([]);
      const played = await hear(page, panel);
      expect(played.map((p) => name(p.midi))).toEqual(c.scale.map((s) => name(midiOf(s))));
      expectDrawnAsPlayed(score, played);
    }
    const chip = page.locator('[data-section="tasks"]').getByRole('button', { name: '‘key of D’' });
    await chip.scrollIntoViewIfNeeded();
    await chip.click();
    const task = page.locator('[data-section="tasks"] [data-testid="inline-try-this"]');
    expect((await drawn(task)).staves.map((s) => s.signature)).toEqual([[{ sign: '#', letter: 'F' }, { sign: '#', letter: 'C' }]]);
  });

  test('M51 and M52 — D–G–C–F in fourths; D natural minor over a D that keeps sounding', async ({ page }) => {
    await openLesson(page, 'l7u22m5');
    const quartal = conceptPanel(page, 0);
    await expect(quartal).toContainText('D–G–C–F');
    const q = await hear(page, quartal);
    const groups = onsets(q);
    expect(groups.map((g) => g.map((n) => name(n.midi)))).toEqual([['D4'], ['G4'], ['C5'], ['F5'], ['D4', 'G4', 'C5', 'F5']]);
    const together = groups[4].map((n) => n.midi);
    expect(together.slice(1).map((x, i) => x - together[i])).toEqual([5, 5, 5]);
    expectDrawnAsPlayed(await drawn(quartal), q);

    const pedal = conceptPanel(page, 2);
    const p = await hear(page, pedal);
    const low = p.filter((n) => n.midi < 62);
    const scale = p.filter((n) => n.midi >= 62);
    expect(scale.map((n) => name(n.midi))).toEqual(['D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5', 'D5']);
    // One D3, held under every note of the scale to the end: nothing left bare.
    expect(low.map((d) => name(d.midi))).toEqual(['D3']);
    for (const n of scale) expect(soundingAt(low[0], n.at) && low[0].at + low[0].dur >= n.at + n.dur - 0.005, name(n.midi)).toBe(true);
    const score = await drawn(pedal);
    expect(score.staves.map((s) => s.clef)).toEqual(['treble', 'bass']);
    expect(score.brace).toBe(true);
    expectDrawnAsPlayed(score, p);
  });

  test('M53 — the Dm7 shell D, F, C, then the full Dm7', async ({ page }) => {
    await openLesson(page, 'l7u21m2');
    const panel = conceptPanel(page, 0);
    const played = await hear(page, panel);
    expect(onsets(played).map((g) => g.map((n) => name(n.midi)))).toEqual([['D4', 'F4', 'C5'], ['D4', 'F4', 'A4', 'C5']]);
    expectDrawnAsPlayed(await drawn(panel), played);
  });

  test('M54 — E held while the bass falls from D to C', async ({ page }) => {
    await openLesson(page, 'l4u12m1');
    const panel = conceptPanel(page, 2);
    const played = await hear(page, panel);
    const e = played.filter((n) => name(n.midi) === 'E4');
    const bass = played.filter((n) => name(n.midi) !== 'E4');
    expect(e).toHaveLength(1);
    expect(bass.map((n) => name(n.midi))).toEqual(['D3', 'C3']);
    expect(soundingAt(e[0], bass[1].at)).toBe(true);
    const score = await drawn(panel);
    expect(score.staves.map((st) => st.clef)).toEqual(['treble', 'bass']);
    expectDrawnAsPlayed(score, played);
  });

  test('M55 — the full stack of thirds, then Cmaj13 without F', async ({ page }) => {
    await openLesson(page, 'l7u23m5');
    const panel = conceptPanel(page, 0);
    await expect(panel).toContainText('without the 11th (F)');
    const played = await hear(page, panel);
    const groups = onsets(played).map((g) => g.map((n) => name(n.midi)));
    expect(groups).toEqual([['C4'], ['E4'], ['G4'], ['B4'], ['D5'], ['F5'], ['A5'], ['C4', 'E4', 'G4', 'B4', 'D5', 'A5']]);
    expectDrawnAsPlayed(await drawn(panel), played);
  });

  test('M56 — every interval from the root, minor 2nd to perfect 5th, each pair from C', async ({ page }) => {
    await openLesson(page, 'l9u30m3');
    const panel = conceptPanel(page, 0);
    const played = await hear(page, panel);
    expect(played.map((n) => name(n.midi))).toEqual(['C4', 'C#4', 'C4', 'D4', 'C4', 'Eb4', 'C4', 'E4', 'C4', 'F4', 'C4', 'F#4', 'C4', 'G4']);
    const score = await drawn(panel);
    expect(score.notes.filter((n) => n.rest)).toHaveLength(6);
    expectDrawnAsPlayed(score, played);
  });

  test('QA P7 — ‘G7/B’ drawn and played as V6/5, the leading note once; the chord list of l1u35m3 climbs by step', async ({ page }) => {
    await openLesson(page, 'l4u12m5');
    const chip = page.locator('[data-section="tasks"]').getByRole('button', { name: '‘G7/B’' });
    await chip.scrollIntoViewIfNeeded();
    await chip.click();
    const task = page.locator('[data-section="tasks"] [data-testid="inline-try-this"]');
    const played = await hear(page, task);
    expect(played.map((n) => name(n.midi))).toEqual(['B4', 'D5', 'F5', 'G5']);
    expect((await drawn(task)).notes.flatMap((n) => n.pitches)).toEqual(['B4', 'D5', 'F5', 'G5']);

    await openLesson(page, 'l1u35m3');
    const list = await hear(page, conceptPanel(page, 2));
    expect(onsets(list).map((g) => name(Math.min(...g.map((n) => n.midi))))).toEqual(['G3', 'A3', 'B3', 'C4', 'D4', 'E4']);
  });

  test('a screen reader is given each staff as one image, its notes in words (English and Portuguese)', async ({ page, context }) => {
    await openLesson(page, 'l7u22m5');
    await expect(conceptPanel(page, 2).getByRole('img')).toHaveAttribute('aria-label',
      'Grand staff, treble and bass, in 4/4. Upper voice on the treble staff: D4, E4, F4 and G4 (quarter notes) | A4, B♭4, C5 and D5 (quarter notes). Lower voice on the bass staff: D3 (whole note tied to the next) | D3 (whole note).');
    const origin = new URL(test.info().project.use.baseURL!).origin;
    await context.addInitScript((o) => {
      if (location.origin === o) localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'pt' }, version: 6 }));
    }, origin);
    await openLesson(page, 'l1u3m2');
    await expect(conceptPanel(page, 1).getByRole('img')).toHaveAttribute('aria-label',
      'Pauta em clave de sol, 2 sustenidos na armação de clave: F♯ e C♯. D4, E4, F♯4, G4, A4, B4, C♯5 e D5 (semínimas).');
    // The lesson itself is in Portuguese (a known positive for the language seed).
    await expect(conceptPanel(page, 1)).toContainText('Vê a armação de D — dois sustenidos');
  });
});

const PANELS: [string, number][] = [
  ['l1u3m2', 0], ['l1u3m2', 1], ['l1u3m2', 2], ['l2u4m1', 0], ['l2u4m1', 2], ['l3u11m5', 1],
  ['l4u12m1', 1], ['l4u12m1', 2], ['l4u14m4', 0], ['l7u21m2', 0], ['l7u22m5', 0], ['l7u22m5', 2],
  ['l7u23m5', 0], ['l9u30m3', 0], ['l9u30m4', 1], ['l9u32m4', 2],
];

test.describe('the demonstrations\' staves fit, from the narrowest phone to a laptop, day and night', () => {
  for (const [width, height, lang] of [[320, 740, 'pt'], [390, 844, 'en'], [1440, 900, 'en']] as const) {
    for (const theme of ['fermata', 'fermata-night'] as const) {
      test(`${width}×${height} ${lang} ${theme}`, async ({ page, context }) => {
        const origin = new URL(test.info().project.use.baseURL!).origin;
        await context.addInitScript(([o, l, th]) => {
          if (location.origin === o) localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: l, themeMode: th }, version: 6 }));
        }, [origin, lang, theme] as const);
        await page.setViewportSize({ width, height });
        for (const [id, n] of PANELS) {
          await openLesson(page, id);
          const panel = conceptPanel(page, n);
          await panel.scrollIntoViewIfNeeded();
          const svg = panel.locator('svg:has(g.vf-stavenote)');
          await expect(svg).toHaveCount(1);
          const [p, s] = await Promise.all([panel.boundingBox(), svg.boundingBox()]);
          const where = `${id} c${n}`;
          // Inside the panel, never past its edge, and the page never scrolls sideways.
          expect(s!.x, where).toBeGreaterThanOrEqual(p!.x - 0.5);
          expect(s!.x + s!.width, where).toBeLessThanOrEqual(p!.x + p!.width + 0.5);
          expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), where).toBeLessThanOrEqual(0);
          // Notes one after another stand apart: in each voice, no notehead overlaps the one before.
          const score = await svg.evaluate(readStaffSvg);
          const voices = [...new Set(score.notes.map((x) => `${x.staff}:${x.voice}`))];
          for (const v of voices) {
            const xs = score.notes.filter((x) => `${x.staff}:${x.voice}` === v).map((x) => x.x).sort((a, b) => a - b);
            const gaps = xs.slice(1).map((x, i) => x - xs[i]);
            expect(Math.min(...gaps, Infinity), `${where} voice ${v}: ${xs.map(Math.round).join(' ')}`).toBeGreaterThanOrEqual(12);
          }
          // Drawn in the theme's ink: the staff lines use the text colour token.
          expect(await svg.evaluate((el) => (el.querySelector('g.vf-stave path') as SVGElement).style.stroke)).toBe('var(--text)');
        }
      });
    }
  }
});

test.describe('nothing below a demonstration moves when its staff arrives (fix pass, item 4)', () => {
  // The staff's code is held back 1.5 s, so its placeholder is what stands
  // there first: the distance from the panel to the next section must be the
  // same with the placeholder and with the drawing.
  for (const [width, height] of [[320, 740], [390, 844], [1440, 900]] as const) {
    test(`${width}×${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.route(/DemoStaffWithWords/, async (route) => {
        await new Promise((r) => setTimeout(r, 1500));
        await route.continue();
      });
      for (const [id, n] of [['l7u22m5', 0], ['l9u30m3', 0], ['l4u12m1', 1], ['l7u22m5', 2]] as const) {
        await openLesson(page, id);
        const panel = conceptPanel(page, n);
        await panel.scrollIntoViewIfNeeded();
        const gap = () => panel.evaluate((el) => {
          const section = el.closest('section')!;
          const next = section.nextElementSibling as HTMLElement;
          return next.getBoundingClientRect().top - el.getBoundingClientRect().top;
        });
        await expect(panel.getByTestId('demo-staff-placeholder')).toBeVisible();
        const before = await gap();
        await expect(panel.locator('svg:has(g.vf-stavenote)')).toHaveCount(1);
        await page.waitForTimeout(150);
        const after = await gap();
        expect(Math.abs(after - before), `${id} c${n}: ${before} → ${after}`).toBeLessThanOrEqual(0.5);
      }
    });
  }
});
