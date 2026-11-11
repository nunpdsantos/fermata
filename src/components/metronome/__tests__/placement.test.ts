/**
 * Where the metronome's bar goes (wave 3, stream M): above the instrument,
 * under the top bar, never over either, never over a check's answers, off
 * the chord's detail where it can be; compact where the full bar has no
 * room (a phone's sheet at Full).
 */
import { describe, it, expect } from 'vitest';
import { placeMetronome, overlapArea, GAP, GUTTER, type MetronomePlacementInput } from '../placement';

const phone = (over: Partial<MetronomePlacementInput> = {}): MetronomePlacementInput => ({
  viewport: { width: 390, height: 844 },
  topBarBottom: 60,
  floor: 520,
  fullWidth: 366,
  fullHeight: 104,
  compactWidth: 200,
  compactHeight: 54,
  ...over,
});

describe('placeMetronome', () => {
  it('a phone: just above the sheet, the window\'s width less the gutters', () => {
    expect(placeMetronome(phone())).toEqual({ top: 520 - GAP - 104, left: GUTTER, compact: false });
  });

  it('a phone\'s sheet at Full (76 px left above it): compact, still above the sheet and under the top bar', () => {
    const p = placeMetronome(phone({ floor: 60 + 76 }));
    expect(p.compact).toBe(true);
    expect(p.top).toBe(60 + 76 - GAP - 54);
    expect(p.top).toBeGreaterThanOrEqual(60 + GAP);
    expect(p.top + 54).toBeLessThanOrEqual(60 + 76 - GAP);
  });

  it('a check\'s answers in the lower half: just above them, never over them', () => {
    const answers = { top: 420, bottom: 640, left: 16, right: 374 };
    const p = placeMetronome(phone({ floor: 640, hard: [answers] }));
    expect(p).toEqual({ top: 420 - GAP - 104, left: GUTTER, compact: false });
    expect(overlapArea({ top: p.top, bottom: p.top + 104, left: p.left, right: p.left + 366 }, answers)).toBe(0);
  });

  it('answers that leave room below them (a laptop): the place above the instrument', () => {
    const answers = { top: 300, bottom: 500, left: 400, right: 1000 };
    const p = placeMetronome({ viewport: { width: 1440, height: 900 }, topBarBottom: 52, floor: 640, fullWidth: 620, fullHeight: 46, compactWidth: 200, compactHeight: 46, hard: [answers] });
    expect(p.top).toBe(640 - GAP - 46);
    expect(p.left).toBe(GUTTER);
  });

  it('a laptop: at the left edge; moved off the chord\'s detail when it is there', () => {
    const base = { viewport: { width: 1440, height: 900 }, topBarBottom: 52, floor: 640, fullWidth: 620, fullHeight: 46, compactWidth: 200, compactHeight: 46 };
    expect(placeMetronome(base).left).toBe(GUTTER);
    const detail = { top: 560, bottom: 700, left: 20, right: 700 };
    const p = placeMetronome({ ...base, soft: [detail] });
    expect(p.left).toBe(1440 - GUTTER - 620);
    expect(p.compact).toBe(false);
  });

  it('a phone held sideways at Full (no room above the sheet): compact, in an empty stretch of the top bar', () => {
    const spans = [{ top: 0, bottom: 60, left: 115, right: 313 }, { top: 0, bottom: 60, left: 533, right: 650 }];
    const p = placeMetronome({ viewport: { width: 844, height: 390 }, topBarBottom: 60, floor: 88, fullWidth: 524, fullHeight: 54, compactWidth: 168, compactHeight: 54, topBarSpans: spans });
    expect(p).toEqual({ top: 3, left: Math.round(115 + (198 - 168) / 2), compact: true, inTopBar: true });
    // A stretch too narrow is passed over.
    const narrow = placeMetronome({ viewport: { width: 390, height: 844 }, topBarBottom: 60, floor: 70, fullWidth: 366, fullHeight: 104, compactWidth: 168, compactHeight: 54, topBarSpans: [{ top: 0, bottom: 60, left: 40, right: 85 }] });
    expect(narrow.inTopBar).toBeUndefined();
  });

  it('the chord\'s detail everywhere: the place covering it least, never off the floor', () => {
    const detail = { top: 0, bottom: 900, left: 0, right: 1440 };
    const p = placeMetronome({ viewport: { width: 1440, height: 900 }, topBarBottom: 52, floor: 640, fullWidth: 620, fullHeight: 46, compactWidth: 200, compactHeight: 46, soft: [detail] });
    expect(p.top).toBe(640 - GAP - 46);
  });

  it('under the start hint, never over it', () => {
    const p = placeMetronome(phone({ topClear: 200, floor: 300 }));
    expect(p.top).toBeGreaterThanOrEqual(200 + GAP);
    expect(p.compact).toBe(true);
  });

  it('no room at all: compact, as low as it can go, never above the top bar', () => {
    const p = placeMetronome(phone({ floor: 90 }));
    expect(p).toEqual({ top: 60 + GAP, left: GUTTER, compact: true });
  });

  it('a window narrower than the bar: never off its left edge', () => {
    const p = placeMetronome(phone({ viewport: { width: 200, height: 600 }, fullWidth: 400 }));
    expect(p.left).toBeGreaterThanOrEqual(0);
  });
});
