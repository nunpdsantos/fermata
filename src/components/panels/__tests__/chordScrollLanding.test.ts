import { afterEach, describe, expect, it, vi } from 'vitest';
import { barPlaceWith, chordLanding, rowClipEdge, wholeRows, type RowSpan } from '../chordScrollLanding';

const row = (top: number, height: number): RowSpan => ({ top, bottom: top + height });

it('keeps the selected row with the entire detail at the exact 8px + 8px fit boundary', () => {
  const rows = [row(190, 36), row(238, 64)];
  const detail = row(308, 98), stripBottom = 168;
  const target = chordLanding(rows, detail, 352, 352, stripBottom + 8);
  expect(target).toBe(62);
  expect(rows[1].top - target).toBe(stripBottom + 8);
  expect(detail.bottom - target).toBe(352 - 8);
});

it('does not clamp strip clearance down when the detail is taller than its view', () => {
  const rows = [row(190, 36), row(238, 76)];
  const detail = row(320, 190);
  const target = chordLanding(rows, detail, 410, 322, 168 + 8);
  expect(target).toBe(144);
  expect(detail.top - target).toBe(176);
  expect(410 - target).toBeLessThanOrEqual(322);
});

it('keeps the card row accessible with play when only the remaining detail needs scrolling', () => {
  const rows = [row(190, 36), row(238, 64)];
  const target = chordLanding(rows, row(308, 210), 352, 352, 176);
  expect(rows[1].top - target).toBeGreaterThanOrEqual(176);
  expect(352 - target).toBeLessThanOrEqual(352 - 8);
});

it.each([4, 6, 8, 10, 12])('clips a hidden row in its %ipx gap, including the 8px roomAbove clearance', (gap) => {
  const rows = [row(190, 36), row(226 + gap, 64), row(296 + gap, 0)];
  const target = rows[1].top - 176;
  const edge = rowClipEdge(rows, target + 168);
  const visibleEdge = Math.max(target + 168, edge);
  expect(rows.filter((r) => r.top < visibleEdge && r.bottom > visibleEdge)).toEqual([]);
  expect(rows[1].top).toBeGreaterThanOrEqual(visibleEdge);
  expect(rowClipEdge(rows, 168)).toBe(0); // manual return to the controls releases the clip
});

it('merges labels and controls that share a row before choosing its gap', () => {
  expect(wholeRows([row(200, 12), row(190, 36), row(232, 64), row(238, 36)]))
    .toEqual([row(190, 36), row(232, 64)]);
});

// The owner's ruling of 19 November 2026: on Build, with the strip scrolling
// (a laptop under 900 px tall), the landing keeps the card's head, or else the
// builder's root row, with the chord's first row and ▶ Chord. Spans measured
// at 1366×768 and 1536×864 (EN piano, C E G): the head at 192, the root row at
// 238, the notes at 278, the readout at 377, the detail 448–590 with ▶ Chord
// ending at 537; the work column 331 / 427 px tall, 19 px of room above.
const head = row(192, 42), root = row(238, 36);
const buildRows = [head, root, row(278, 91), row(377, 61)];
const builtDetail = row(448, 142);

it('Build, the strip scrolling: the root row through ▶ Chord when the head cannot fit with them (1366×768)', () => {
  const target = chordLanding(buildRows, builtDetail, 537, 331, 19, { rows: [head, root], through: 537 });
  expect(target).toBe(root.top - 19);
  expect(537 - target).toBeLessThanOrEqual(331 - 8);
  // Without the preference the whole detail wins and the root row, the notes
  // and the readout's top go off screen: what the ruling changes.
  expect(chordLanding(buildRows, builtDetail, 537, 331, 19)).toBe(377 - 19);
});

it('Build, the strip scrolling: the head as well when it fits (1536×864)', () => {
  expect(chordLanding(buildRows, builtDetail, 537, 427, 19, { rows: [head, root], through: 537 })).toBe(head.top - 19);
});

it('Build, the strip scrolling: the usual landing when the root row cannot fit with ▶ Chord (the longest readout)', () => {
  const tall = { rows: [head, root], through: root.top + 330 };
  expect(chordLanding(buildRows, builtDetail, 537, 331, 19, tall)).toBe(chordLanding(buildRows, builtDetail, 537, 331, 19));
});

// The leftovers round (21 November 2026, E2): whether a held strip leaves the
// chord's detail in view is judged against the place the metronome's bar
// takes once the detail is there (MetronomeBar re-places it every frame with
// `placeMetronome`, keeping off the detail), not the place it has before: the
// first chord of a visit meets the bar at the left edge, where nothing was
// yet in its way. 1280×800: the bar 635 × 46 above a dock at 476.
describe('barPlaceWith: where the bar will stand once the detail is there', () => {
  const box = (top: number, left: number, width: number, height: number) => ({ top, left, right: left + width, bottom: top + height, width, height, x: left, y: top, toJSON() {} }) as DOMRect;
  afterEach(() => { document.body.innerHTML = ''; vi.unstubAllGlobals(); });
  const setUp = (barLeft: number) => {
    vi.stubGlobal('innerWidth', 1280);
    vi.stubGlobal('innerHeight', 800);
    document.body.innerHTML = '<header class="app-topbar"></header><div data-testid="metronome"></div><section data-testid="instrument-dock"></section>';
    const rects: Record<string, DOMRect> = {
      'app-topbar': box(0, 0, 1280, 56),
      metronome: box(422, barLeft, 635, 46),
      'instrument-dock': box(476, 0, 1280, 324),
    };
    for (const el of Array.from(document.body.children)) {
      const key = el.getAttribute('data-testid') ?? el.className;
      el.getBoundingClientRect = () => rects[key];
    }
    return document.querySelector<HTMLElement>('[data-testid="metronome"]')!;
  };
  it('a detail across the work column (20–744): the bar goes to the right edge, wherever it stands now', () => {
    for (const now of [12, 633]) {
      expect(barPlaceWith(setUp(now), { top: 300, bottom: 486, left: 20, right: 744 })).toEqual({ top: 422, bottom: 468, left: 633, right: 1268 });
    }
  });
  it('a detail clear of the left edge\'s place: the bar stays at the left edge', () => {
    expect(barPlaceWith(setUp(633), { top: 100, bottom: 400, left: 20, right: 744 })).toEqual({ top: 422, bottom: 468, left: 12, right: 647 });
  });
  it('a detail out of the window: nothing to keep off, the left edge', () => {
    expect(barPlaceWith(setUp(633), { top: -400, bottom: -100, left: 20, right: 744 })).toEqual({ top: 422, bottom: 468, left: 12, right: 647 });
  });
});
