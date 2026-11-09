import { describe, expect, it } from 'vitest';
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

// 9 Nov (brief G): Half and Full are never taller than the content needs —
// the phone keyboard ended 91 px above the sheet's bottom at Half (390×844)
// and 407 px at Full. `content` = the content's natural height.
describe('never taller than the content', () => {
  const HEAD = 73; // bar + 1 px border, as measured at 390×844
  it('content shorter than Half: Half and Full are the content, one stop (no separate Full)', () => {
    // 390×844 piano: Half 392, Full 708 (784 − 76), keyboard 228 px.
    const fitted = fitDockDetents(392, 708, 784, HEAD, [], 0, 228);
    expect(fitted.half).toBe(HEAD + 228);
    expect(fitted.full).toBe(HEAD + 228);
    expect(fitted.fullDistinct).toBe(false);
  });
  it('content shorter than Half: a first dot does not grow it (no row is cut, so no dot clearance)', () => {
    // A Learn build question on the guitar: the board has no dots until the
    // learner taps a fret; the sheet must not move when one appears.
    const strings = [{ top: 20, bottom: 48 }, { top: 48, bottom: 76 }];
    const before = fitDockDetents(392, 708, 784, HEAD, strings, 200, 279);
    const after = fitDockDetents(392, 708, 784, HEAD, [{ ...strings[0], dots: { top: 22, bottom: 46 } }, strings[1]], 200, 279);
    expect(before).toEqual(after);
    expect(after).toEqual({ half: HEAD + 279, halfBottomGap: 0, full: HEAD + 279, fullDistinct: false });
  });
  it('content taller than Half, shorter than Full: Half unchanged (row-fitted), Full ends at the content', () => {
    // 390×844 guitar: board + controls 523 px, a position row crossing Half's edge.
    const rows = [{ top: 300, bottom: 344 }];
    const uncapped = fitDockDetents(392, 708, 784, HEAD, rows, 260);
    const fitted = fitDockDetents(392, 708, 784, HEAD, rows, 260, 523);
    expect(fitted.half).toBe(uncapped.half);
    expect(fitted.half).toBe(HEAD + 300);
    expect(uncapped.full).toBe(708);
    expect(fitted.full).toBe(HEAD + 523);
    expect(fitted.fullDistinct).toBe(true);
  });
  it('content taller than Full: nothing changes (Full keeps the toast room)', () => {
    const fitted = fitDockDetents(392, 708, 784, HEAD, [], 0, 900);
    expect(fitted).toEqual({ ...fitDockDetents(392, 708, 784, HEAD, [], 0), fullDistinct: true });
    expect(fitted.half).toBe(392);
    expect(fitted.full).toBe(708);
  });
  it('the guitar board grows Full past the toast room, but never past the content or the screen', () => {
    // A board that needs more than Full's preferred height (landscape).
    expect(fitDockDetents(210, 254, 330, 72, [], 230, 364).full).toBe(302);
    // The content (board + controls) ends below the board but above the
    // preferred Full: Full ends with the content.
    expect(fitDockDetents(210, 320, 400, 72, [], 230, 240).full).toBe(312);
    expect(fitDockDetents(210, 254, 330, 72, [], 500, 600).full).toBe(330);
  });
  it('landscape (844×390): Half stops between strings exactly as before; Full fits the board', () => {
    const rows = Array.from({ length: 6 }, (_, i) => ({
      top: 30 + i * 28, bottom: 58 + i * 28,
      dots: { top: 30 + i * 28, bottom: 58 + i * 28 },
    }));
    const fitted = fitDockDetents(210, 254, 330, 72, rows, 230, 364);
    expect(fitted.half).toBe(190);
    expect(fitted.full).toBe(302);
    expect(fitted.fullDistinct).toBe(true);
    // A landscape keyboard taller than Full (224 px vs 182): unchanged.
    expect(fitDockDetents(210, 254, 330, 72, [], 0, 224)).toMatchObject({ half: 210, full: 254, fullDistinct: true });
  });
  it('unmeasured content (0) caps nothing', () => {
    expect(fitDockDetents(392, 708, 784, HEAD, [], 0, 0)).toMatchObject({ half: 392, full: 708, fullDistinct: true });
  });
});
