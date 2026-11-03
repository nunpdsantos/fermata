import { expect, type Page } from '@playwright/test';

export const READING_QUEUE = ['read:staff-to-fret:V:C5', 'read:staff-to-fret:open:C5', 'read:staff-to-fret:any:G6'];

/** A deterministic v3 session; works against preview too (no /src imports). */
export function readingSave(queue = READING_QUEUE) {
  return {
    version: 3,
    state: {
      items: {}, settings: { length: 12, newPerSession: 4, families: { keysig: false, circle: false, scale: false, degree: false, interval: false, triad: false, seventh: false, roman: false, function: false, read: true }, sound: false, showTimer: false },
      sprintBests: {}, lifetime: { answered: 0, correct: 0 }, sprint: null,
      activeSession: { id: 'reading-e2e', queue, index: 0, asked: 0, correct: 0, startedAt: 1793613600000, seed: 42, missRequeues: {} },
    },
  };
}

export const fret = (page: Page, stringIndex: number, fretNumber: number) => page.locator(`[data-testid="reading-board"] [data-string-row="${stringIndex}"][data-fret="${fretNumber}"]`);

export async function readingReady(page: Page) {
  await expect(page.getByTestId('reading-board')).toBeVisible();
  await expect(page.locator('.reading-staff svg .vf-stavenote')).toHaveCount(1);
  // Bravura's treble-8vb glyph, not just a generic treble staff.
  await expect(page.locator('.reading-staff .vf-clef')).toContainText('\ue052');
}

/** These cells have no instrument-size exemption: reading needs 44 px targets. */
export async function readingTargets(page: Page) {
  const sizes = await page.getByTestId('reading-board').locator('[data-fret]').evaluateAll((cells) => cells.map((cell) => {
    const r = cell.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }));
  expect(sizes.length).toBeGreaterThanOrEqual(30);
  expect(sizes.every(({ w, h }) => w >= 43.9 && h >= 43.9)).toBe(true);
}

export async function readingFits(page: Page) {
  const layout = await page.evaluate(() => {
    const onScreen = (selector: string) => {
      const r = document.querySelector(selector)!.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1;
    };
    const content = document.querySelector('.drill-content')!;
    const scroller = content.parentElement!;
    return {
      staff: onScreen('.reading-staff'), board: onScreen('[data-testid="reading-board"]'), answers: onScreen('[data-testid="drill-answers"]'),
      scroll: scroller.scrollHeight - scroller.clientHeight,
      pageScroll: document.scrollingElement!.scrollHeight - document.scrollingElement!.clientHeight,
    };
  });
  expect(layout).toEqual({ staff: true, board: true, answers: true, scroll: 0, pageScroll: 0 });
}
