import { afterEach, describe, expect, it, vi } from 'vitest';
import { barPlaceWith, chordLanding, footFadeShows, landChordDetail, rowClipEdge, wholeRows, type RowSpan } from '../chordScrollLanding';
import { placeMetronome } from '../../metronome/placement';

// The bar's own rule, watched: called through, counted.
vi.mock('../../metronome/placement', async (importOriginal) => {
  const real = await importOriginal<typeof import('../../metronome/placement')>();
  return { ...real, placeMetronome: vi.fn(real.placeMetronome) };
});

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
    // Its size, and its place as MetronomeBar writes it (what the landing reads: not the glide's current box).
    const bar = document.querySelector<HTMLElement>('[data-testid="metronome"]')!;
    Object.defineProperty(bar, 'offsetWidth', { value: 635 });
    Object.defineProperty(bar, 'offsetHeight', { value: 46 });
    bar.style.top = '422px';
    bar.style.left = `${barLeft}px`;
    return bar;
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

// The leftovers round, second pass: with no bar the landing never enters the
// bar's branch (no forecast of the bar, the strip never let go), as at
// 57cda40; with a bar over the foot and a detail taller than the room under
// the held strip it lets the strip go (the known positive), and closing the
// bar (`html[data-metro-room]` taken off) holds it again at once. jsdom has
// no layout: every box is stubbed.
describe('landChordDetail: the bar\'s branch only while the bar is open', () => {
  const rect = (top: number, height: number, left = 20, width = 700) => ({ top, bottom: top + height, left, right: left + width, width, height, x: left, y: top, toJSON() {} }) as DOMRect;
  let frames: FrameRequestCallback[] = [];
  const flush = () => { const run = frames; frames = []; run.forEach((f) => f(0)); };
  afterEach(() => {
    document.body.innerHTML = '';
    delete document.documentElement.dataset.metroRoom;
    vi.unstubAllGlobals();
    vi.mocked(placeMetronome).mockClear();
  });
  const setUp = (withBar: boolean) => {
    vi.mocked(placeMetronome).mockClear();
    vi.stubGlobal('innerWidth', 1280);
    vi.stubGlobal('innerHeight', 800);
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => { frames.push(f); return frames.length; });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    frames = [];
    document.body.innerHTML = `
      <header class="app-topbar"></header>
      <div class="explore-main"><div class="strip-card" style="position: sticky"></div>
        <section class="chords-card"><div class="explore-card-head"></div><div class="chord-row"></div>
          <div data-testid="chord-detail"><div class="chord-detail-row"><h3 class="chord-detail-name">C</h3><div class="chord-detail-actions"><button>Chord</button></div></div><button>Learn about this</button></div>
        </section></div>
      <section data-testid="instrument-dock"></section>
      ${withBar ? '<div data-testid="metronome" style="top: 354px; left: 12px"></div>' : ''}`;
    const q = <T extends Element>(s: string) => document.querySelector<T>(s)!;
    // The column 300 px tall from y 100; the held strip to 250; a detail of 290 px from 260 (no room for it under the strip).
    const boxes = new Map<Element, DOMRect>([
      [q('.app-topbar'), rect(0, 56, 0, 1280)],
      [q('.explore-main'), rect(100, 300)],
      [q('.strip-card'), rect(102, 148)],
      [q('.chords-card'), rect(252, 310)],
      [q('.explore-card-head'), rect(252, 8)],
      [q('.chord-row'), rect(256, 2)],
      [q('[data-testid="chord-detail"]'), rect(260, 290)],
      [q('.chord-detail-row'), rect(260, 60)],
      [q('.chord-detail-name'), rect(262, 20, 30, 80)],
      [q('.chord-detail-actions'), rect(290, 30)],
      [q('.chord-detail-actions button'), rect(290, 30, 30, 90)],
      [q('[data-testid="chord-detail"] > button'), rect(510, 30, 30, 120)],
      [q('[data-testid="instrument-dock"]'), rect(408, 392, 0, 1280)],
    ]);
    for (const [el, box] of boxes) el.getBoundingClientRect = () => box;
    const scroller = q<HTMLElement>('.explore-main');
    Object.defineProperty(scroller, 'clientHeight', { value: 300 });
    Object.defineProperty(scroller, 'scrollHeight', { value: 470 });
    scroller.scrollTo = () => {};
    if (withBar) {
      const bar = q<HTMLElement>('[data-testid="metronome"]');
      Object.defineProperty(bar, 'offsetWidth', { value: 635 });
      Object.defineProperty(bar, 'offsetHeight', { value: 46 });
      bar.getBoundingClientRect = () => rect(354, 46, 12, 635);
      document.documentElement.dataset.metroRoom = '';
    }
    const setAttribute = vi.spyOn(scroller, 'setAttribute');
    const stop = landChordDetail(q<HTMLElement>('[data-testid="chord-detail"]'), scroller, q<HTMLElement>('.strip-card'), () => 8);
    flush();
    return { scroller, setAttribute, stop };
  };

  it('no bar: no forecast of the bar is made and the strip is never let go', () => {
    const { scroller, setAttribute, stop } = setUp(false);
    expect(placeMetronome).not.toHaveBeenCalled();
    expect(setAttribute.mock.calls.filter(([name]) => name === 'data-strip-scrolls')).toEqual([]);
    expect(scroller.hasAttribute('data-strip-scrolls')).toBe(false);
    stop();
  });

  it('known positive: a bar over the foot and a detail with no room under the held strip: the strip goes; the bar closed, it is held again at once', async () => {
    const { scroller, stop } = setUp(true);
    expect(placeMetronome).toHaveBeenCalled();
    expect(scroller.hasAttribute('data-strip-scrolls')).toBe(true);
    document.querySelector('[data-testid="metronome"]')!.remove();
    delete document.documentElement.dataset.metroRoom;
    await Promise.resolve(); // the attribute's observer
    expect(scroller.hasAttribute('data-strip-scrolls')).toBe(false);
    stop();
  });
});

// The rounding edge (review of this round): the column shows its fade once
// its items go on more than a pixel below its foot, and the scroller takes
// the nearest whole pixel, so the landing counts the fade from the foot.
describe('footFadeShows: a fade within a pixel of showing counts as showing', () => {
  it('the review\'s Minor 13th: 331.99 px below the top of a 331 px column, asked at 170.3, shows (at 170 the card ended 332.3 px down)', () => {
    expect(footFadeShows(170.3 + 331.99, 170.3, 331)).toBe(true);
    expect(footFadeShows(170.3 + 331.99, 170, 331)).toBe(true);
  });
  it('items ending at the foot or above: no fade', () => {
    expect(footFadeShows(501, 170, 331)).toBe(false);
    expect(footFadeShows(480, 170, 331)).toBe(false);
  });
  it('anything past the foot counts, a pixel or less included', () => {
    expect(footFadeShows(501.2, 170, 331)).toBe(true);
    expect(footFadeShows(502.5, 170, 331)).toBe(true);
  });
});
