import { expect, it } from 'vitest';
import { chordLanding, rowClipEdge, wholeRows, type RowSpan } from '../chordScrollLanding';

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
