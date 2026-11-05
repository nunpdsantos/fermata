import { expect, it } from 'vitest';
import { stripViewport } from '../stripViewport';
it('ends between noteheads, with the continuation on the right', () => {
  expect(stripViewport([64, 112, 160, 208, 256, 304, 352, 400], 300, 440, 0)).toEqual({ width: 280, moreLeft: false, moreRight: true });
});
it('reports both edges in the middle and only the left at the end', () => {
  const xs = [64, 112, 160, 208, 256, 304, 352, 400];
  expect(stripViewport(xs, 300, 440, 48)).toEqual({ width: 280, moreLeft: true, moreRight: true });
  expect(stripViewport(xs, 300, 440, 160)).toEqual({ width: 280, moreLeft: true, moreRight: false });
});
it('keeps the entire workbench width and no cue when it fits', () => {
  expect(stripViewport([100, 200, 300], 800, 800, 0)).toEqual({ width: 800, moreLeft: false, moreRight: false });
});
