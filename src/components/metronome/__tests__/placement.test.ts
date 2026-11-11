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

  it('a phone on its side (844×390) with the practice sheet open: no room beside or above its panel, so the compact bar goes into the empty stretch of the sheet\'s heading, never over the panel\'s controls', () => {
    // The panel as measured there (8 px from the window's top and bottom, 16 px from its sides), the dock under the scrim.
    const panel = { top: 8, bottom: 382, left: 16, right: 828 };
    const heading = { top: 8, bottom: 68, left: 230, right: 768 }; // between the title and the sheet's ✕
    const input: MetronomePlacementInput = {
      viewport: { width: 844, height: 390 }, topBarBottom: 0, floor: 317, fullWidth: 524, fullHeight: 54, compactWidth: 168, compactHeight: 54,
      hard: [panel], topBarSpans: [],
    };
    // Without the heading's stretch (the place it took before): over the panel's edge.
    const before = placeMetronome(input);
    expect(overlapArea({ top: before.top, bottom: before.top + 54, left: before.left, right: before.left + 168 }, panel)).toBeGreaterThan(0);
    const p = placeMetronome({ ...input, sheetHeadingSpans: [heading] });
    expect(p).toEqual({ top: 8 + (60 - 54) / 2, left: Math.round(230 + (538 - 168) / 2), compact: true, inSheetHeading: true });
    const bar = { top: p.top, bottom: p.top + 54, left: p.left, right: p.left + 168 };
    // Inside the stretch: over neither the title nor the ✕.
    expect(bar.top).toBeGreaterThanOrEqual(heading.top);
    expect(bar.bottom).toBeLessThanOrEqual(heading.bottom);
    expect(bar.left).toBeGreaterThanOrEqual(heading.left + GAP);
    expect(bar.right).toBeLessThanOrEqual(heading.right - GAP);
    // A stretch too low or too narrow for the compact bar is passed over (the last resort as before).
    expect(placeMetronome({ ...input, sheetHeadingSpans: [{ ...heading, bottom: heading.top + 50 }] })).toEqual(before);
    expect(placeMetronome({ ...input, sheetHeadingSpans: [{ ...heading, right: heading.left + 168 + GAP }] })).toEqual(before);
    // Where there is room beside the panel (a laptop), the heading is never used.
    const laptop = placeMetronome({ viewport: { width: 1440, height: 900 }, topBarBottom: 0, floor: 900, fullWidth: 620, fullHeight: 54, compactWidth: 168, compactHeight: 54, hard: [{ top: 84, bottom: 852, left: 564, right: 1424 }], sheetHeadingSpans: [heading] });
    expect(laptop.inSheetHeading).toBeUndefined();
    expect(laptop.compact).toBe(false);
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

  it('answers that reach under the instrument: the place above them is passed over when it would cover the instrument', () => {
    // A low bar (20 px). The answers' upper row (440–475) covers the place above the instrument (472–492); their
    // lower row starts below the floor, so "just above it" (480–500, clear of both rows) would end past
    // floor − GAP = 492, on the instrument: only the floor rule turns it down.
    const upper = { top: 440, bottom: 475, left: 0, right: 390 };
    const lower = { top: 508, bottom: 700, left: 0, right: 390 };
    const p = placeMetronome(phone({ floor: 500, fullHeight: 20, hard: [upper, lower] }));
    expect(p.top + 20).toBeLessThanOrEqual(500 - GAP);
    expect(p).toEqual({ top: 440 - GAP - 20, left: GUTTER, compact: false });
  });

  it('never off the window\'s left edge, even for a bar wider than the window less a gutter', () => {
    // 290 px in a 300 px window: the right-edge place would be at −2. A detail at the right edge makes it the
    // place that covers least, so only the left ≥ 0 rule keeps it out.
    const detail = { top: 0, bottom: 900, left: 289, right: 300 };
    const p = placeMetronome({ viewport: { width: 300, height: 900 }, topBarBottom: 52, floor: 640, fullWidth: 290, fullHeight: 46, compactWidth: 200, compactHeight: 46, soft: [detail] });
    expect(p.left).toBeGreaterThanOrEqual(0);
    expect(p.left).toBe(5);
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
