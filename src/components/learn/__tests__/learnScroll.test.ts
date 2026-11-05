import { expect, it } from 'vitest';
import { learnScrollInsets } from '../learnScroll';
it('reserves only actual sticky and dock overlap, with eight pixels of room', () => {
  expect(learnScrollInsets({ top: 60, bottom: 318 }, 60, 0, 318)).toEqual({ top: 8, bottom: 8 });
  expect(learnScrollInsets({ top: 40, bottom: 390 }, 60, 61, 318)).toEqual({ top: 89, bottom: 80 });
});
