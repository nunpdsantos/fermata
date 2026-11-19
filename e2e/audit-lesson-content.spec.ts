import { test, expect, type Page } from '@playwright/test';

/**
 * Audit of 18 November 2026, A22 / A27 / A29, in the browser: what three
 * lesson demonstrations really play, recorded on core audio's voice seam
 * (dev server only: the build serves no /src modules, so there the spec is
 * skipped with a note). The unit twin, with the staff's order too:
 * src/components/learn/__tests__/auditDemonstrations.test.tsx.
 */

type Played = { midi: number; when: number };

let devModules: boolean | undefined;
async function hasDevModules(page: Page) {
  if (devModules === undefined) {
    const res = await page.request.get('/src/core/services/audio.ts');
    devModules = res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
  }
  if (!devModules) test.info().annotations.push({ type: 'note', description: 'records core audio through /src modules: dev server only' });
  return devModules;
}

/** Record what core audio is asked to sound from now on (the app's own voice is put back by nothing in this test). */
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

/** The onsets heard, each a chord (or a single note) as MIDI numbers, low to high. */
async function onsets(page: Page): Promise<number[][]> {
  await page.waitForTimeout(300);
  const played = await page.evaluate(() => (window as unknown as { __played: Played[] }).__played);
  const sorted = [...played].sort((a, b) => a.when - b.when || a.midi - b.midi);
  const out: { when: number; midis: number[] }[] = [];
  for (const p of sorted) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.when - p.when) < 0.005) last.midis.push(p.midi);
    else out.push({ when: p.when, midis: [p.midi] });
  }
  return out.map((o) => o.midis);
}

async function openLesson(page: Page, id: string) {
  await page.goto(`/?lesson=${id}`);
  await expect(page.locator('[data-section="intro"]')).toBeVisible();
}

async function hear(page: Page, panel: ReturnType<Page['locator']>) {
  await panel.scrollIntoViewIfNeeded();
  // A first tap warms the app's own piano voice up; take the seam after it.
  await panel.getByRole('button', { name: 'Hear it', exact: true }).click();
  await page.waitForTimeout(500);
  await recordVoice(page);
  await panel.getByRole('button', { name: 'Hear it', exact: true }).click();
  return onsets(page);
}

const C4 = 60;

test.describe('audit A22, A27, A29: what the demonstrations play', () => {
  test('A22 — "Descending Large Intervals": C5 down to C4, one note at a time', async ({ page }) => {
    await openLesson(page, 'l9u30m4');
    test.skip(!(await hasDevModules(page)), 'dev server only');
    const played = await hear(page, page.locator('[data-section="c1"] [data-testid="inline-try-this"]'));
    expect(played).toEqual([[C4 + 12], [C4 + 11], [C4 + 9], [C4 + 7], [C4 + 5], [C4 + 4], [C4 + 2], [C4]]);
  });

  test('A27 — V4/2: G7/F then C/E, the bass falling F3 → E3; both chords shown', async ({ page }) => {
    await openLesson(page, 'l4u12m5');
    test.skip(!(await hasDevModules(page)), 'dev server only');
    const panel = page.locator('[data-section="c2"] [data-testid="inline-try-this"]');
    await expect(panel.getByRole('button', { name: 'G7/F: hear it and show it on the piano' })).toBeVisible();
    await expect(panel.getByRole('button', { name: 'C/E: hear it and show it on the piano' })).toBeVisible();
    const played = await hear(page, panel);
    expect(played.map((c) => Math.min(...c))).toEqual([C4 - 7, C4 - 8]); // F3, E3
  });

  test('A29 — jazz blues: F7 → F♯dim7 → C7/G over F3, F♯3, G3; the task names C7/G', async ({ page }) => {
    await openLesson(page, 'l7u21m5');
    test.skip(!(await hasDevModules(page)), 'dev server only');
    const played = await hear(page, page.locator('[data-section="c1"] [data-testid="inline-try-this"]'));
    expect(played.map((c) => Math.min(...c))).toEqual([C4 - 7, C4 - 6, C4 - 5]);
    await expect(page.locator('[data-section="tasks"]').getByRole('button', { name: '‘C7/G’' })).toBeVisible();
  });
});
