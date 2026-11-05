import { expect, it } from 'vitest';
import { fitDockDetents } from '../detentGeometry';
it('Half stops before a partially visible position row', () => {
  expect(fitDockDetents(380, 680, 760, 72, [{ top: 280, bottom: 324 }], 260).half).toBe(352);
});
it('landscape Half stops between strings and Full fits all strings plus fret numbers', () => {
  const rows = Array.from({ length: 6 }, (_, i) => ({ top: 30 + i * 28, bottom: 58 + i * 28 }));
  const fitted = fitDockDetents(210, 254, 330, 72, rows, 230);
  expect(fitted.half).toBe(186);
  expect(fitted.full).toBe(302);
});
it('never grows Full beyond the available screen', () => {
  expect(fitDockDetents(210, 254, 330, 72, [], 500).full).toBe(330);
});
it('reserves 4 px outside Half even when dots fill adjacent string rows', () => {
  const rows = Array.from({ length: 6 }, (_, i) => ({
    top: 30 + i * 28, bottom: 58 + i * 28,
    dots: { top: 30 + i * 28, bottom: 58 + i * 28 },
  }));
  const fitted = fitDockDetents(210, 254, 330, 72, rows, 230);
  expect(fitted.half).toBe(190);
  expect(fitted.halfBottomGap).toBe(4);
  expect(fitted.half - 72 - rows[2].dots.bottom).toBe(4);
  expect(fitted.full).toBe(302);
});
it('drops one row when the nominal Half edge has no space for dot clearance', () => {
  const rows = Array.from({ length: 6 }, (_, i) => ({
    top: 30 + i * 28, bottom: 58 + i * 28,
    dots: { top: 30 + i * 28, bottom: 58 + i * 28 },
  }));
  const fitted = fitDockDetents(186, 254, 330, 72, rows, 230);
  expect(fitted.half).toBe(162);
  expect(fitted.half - 72 - rows[1].dots.bottom).toBe(4);
});
it('rejects a row whose box fits but whose dots cross the content edge', () => {
  const fitted = fitDockDetents(210, 254, 330, 72, [
    { top: 80, bottom: 100, dots: { top: 78, bottom: 102 } },
    { top: 120, bottom: 132, dots: { top: 116, bottom: 136 } },
  ], 230);
  expect(fitted.half).toBe(192);
  expect(fitted.full).toBe(302);
});
