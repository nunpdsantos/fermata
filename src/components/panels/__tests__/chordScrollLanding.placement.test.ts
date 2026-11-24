import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The leftovers round, third pass: the metronome's placement reaches the
// landing by a dynamic import, only once its bar stands over the column. Its
// three endings, each in a fresh copy of the module (the loaded placement is
// kept module-wide): already loaded, the landing goes on at once; late, the
// column is not scrolled until it is in; failed, the landing goes on as with
// no bar, once, no landing asked every frame, and the code is not asked for
// again. jsdom has no layout: every box is stubbed, as in
// chordScrollLanding.test.ts.
type Landing = typeof import('../chordScrollLanding');

const rect = (top: number, height: number, left = 20, width = 700) => ({ top, bottom: top + height, left, right: left + width, width, height, x: left, y: top, toJSON() {} }) as DOMRect;
let frames = new Map<number, FrameRequestCallback>();
let asked = 0;
const flush = () => { const run = [...frames.values()]; frames = new Map(); run.forEach((f) => f(0)); return run.length; };
/** An idle stretch: 120 frames, the tasks between them run; how many landing frames were asked for in it. */
const idle = async () => {
  let ran = 0;
  for (let i = 0; i < 120; i++) { await new Promise((r) => setTimeout(r, 0)); ran += flush(); }
  return ran;
};

beforeEach(() => {
  vi.resetModules();
  asked = 0;
  frames = new Map();
  vi.stubGlobal('innerWidth', 1280);
  vi.stubGlobal('innerHeight', 800);
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => { asked++; frames.set(asked, f); return asked; });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => { frames.delete(id); });
});
afterEach(() => {
  document.body.innerHTML = '';
  delete document.documentElement.dataset.metroRoom;
  vi.unstubAllGlobals();
  vi.doUnmock('../../metronome/placement');
});

/** A column 300 px tall with the held strip to 250 and a 290 px detail 100 px below the view (no bar: it lands at 94): no room for it under the strip with the bar over the foot. */
function page(landing: Landing, withBar: boolean) {
  document.body.innerHTML = `
    <header class="app-topbar"></header>
    <div class="explore-main"><div class="strip-card" style="position: sticky"></div>
      <section class="chords-card"><div class="explore-card-head"></div><div class="chord-row"></div>
        <div data-testid="chord-detail"><div class="chord-detail-row"><h3 class="chord-detail-name">C</h3><div class="chord-detail-actions"><button>Chord</button></div></div><button>Learn about this</button></div>
      </section></div>
    <section data-testid="instrument-dock"></section>
    ${withBar ? '<div data-testid="metronome" style="top: 354px; left: 12px"></div>' : ''}`;
  const q = <T extends Element>(s: string) => document.querySelector<T>(s)!;
  const boxes = new Map<Element, DOMRect>([
    [q('.app-topbar'), rect(0, 56, 0, 1280)],
    [q('.explore-main'), rect(100, 300)],
    [q('.strip-card'), rect(102, 148)],
    [q('.chords-card'), rect(352, 310)],
    [q('.explore-card-head'), rect(352, 8)],
    [q('.chord-row'), rect(356, 2)],
    [q('[data-testid="chord-detail"]'), rect(360, 290)],
    [q('.chord-detail-row'), rect(360, 60)],
    [q('.chord-detail-name'), rect(362, 20, 30, 80)],
    [q('.chord-detail-actions'), rect(390, 30)],
    [q('.chord-detail-actions button'), rect(390, 30, 30, 90)],
    [q('[data-testid="chord-detail"] > button'), rect(610, 30, 30, 120)],
    [q('[data-testid="instrument-dock"]'), rect(408, 392, 0, 1280)],
  ]);
  for (const [el, box] of boxes) el.getBoundingClientRect = () => box;
  const scroller = q<HTMLElement>('.explore-main');
  Object.defineProperty(scroller, 'clientHeight', { value: 300 });
  Object.defineProperty(scroller, 'scrollHeight', { value: 570 });
  const scrollTo = vi.fn();
  scroller.scrollTo = scrollTo as unknown as HTMLElement['scrollTo'];
  if (withBar) {
    const bar = q<HTMLElement>('[data-testid="metronome"]');
    Object.defineProperty(bar, 'offsetWidth', { value: 635 });
    Object.defineProperty(bar, 'offsetHeight', { value: 46 });
    bar.getBoundingClientRect = () => rect(354, 46, 12, 635);
    document.documentElement.dataset.metroRoom = '';
  }
  const stop = landing.landChordDetail(q<HTMLElement>('[data-testid="chord-detail"]'), scroller, q<HTMLElement>('.strip-card'), () => 8);
  return { scroller, scrollTo, stop };
}

/** The placement module as the dynamic import finds it: loaded, late until `arrive()`, or failing; `imports` counts the attempts. */
function placementModule(ending: 'loaded' | 'late' | 'fails') {
  let arrive = () => {};
  const arrived = new Promise<void>((r) => { arrive = r; });
  const state = { imports: 0, arrive };
  vi.doMock('../../metronome/placement', async () => {
    state.imports++;
    if (ending === 'fails') throw new Error('the chunk did not load (offline)');
    if (ending === 'late') await arrived;
    return vi.importActual<typeof import('../../metronome/placement')>('../../metronome/placement');
  });
  return state;
}

/** Where the column lands with no bar (the same layout, a fresh copy of the module). */
async function noBarTarget() {
  vi.resetModules();
  const landing = await import('../chordScrollLanding');
  const { scrollTo, stop } = page(landing, false);
  flush();
  stop();
  document.body.innerHTML = '';
  vi.resetModules();
  return scrollTo.mock.calls.at(-1)![0];
}

describe('the bar\'s placement: its three endings', () => {
  it('already loaded: the first landing goes on at once, the bar\'s branch taken (the strip goes)', async () => {
    const mod = placementModule('loaded');
    const landing = await import('../chordScrollLanding');
    await landing.loadBarPlacement();
    const { scroller, scrollTo, stop } = page(landing, true);
    expect(scrollTo).toHaveBeenCalled();
    expect(scroller.hasAttribute('data-strip-scrolls')).toBe(true);
    expect(await idle(), 'settled: no landing asked in an idle stretch').toBeLessThanOrEqual(8);
    expect(mod.imports).toBe(1);
    stop();
  });

  it('late: the column is not scrolled until the code is in, then the detail lands with the bar\'s branch', async () => {
    const mod = placementModule('late');
    const landing = await import('../chordScrollLanding');
    const { scroller, scrollTo, stop } = page(landing, true);
    for (let i = 0; i < 5; i++) { await new Promise((r) => setTimeout(r, 0)); flush(); }
    expect(scrollTo, 'waiting: the column not scrolled').not.toHaveBeenCalled();
    mod.arrive();
    await vi.dynamicImportSettled();
    await idle();
    expect(scrollTo).toHaveBeenCalled();
    expect(scroller.hasAttribute('data-strip-scrolls')).toBe(true);
    expect(mod.imports).toBe(1);
    stop();
  });

  it('failed: the landing goes on as with no bar, once; no landing asked every frame; the code not asked for again', async () => {
    const target = await noBarTarget();
    const mod = placementModule('fails');
    const landing = await import('../chordScrollLanding');
    const first = page(landing, true);
    await vi.dynamicImportSettled();
    const ran = await idle();
    expect(target.top, 'the case is real: with no bar the column scrolls').toBeGreaterThan(0);
    expect(first.scrollTo, 'the column scrolled as with no bar').toHaveBeenLastCalledWith(target);
    expect(first.scroller.hasAttribute('data-strip-scrolls'), 'no bar\'s branch: the strip held').toBe(false);
    expect(ran, 'a few landings to settle, then none: not one every frame').toBeLessThanOrEqual(8);
    const before = asked;
    expect(await idle(), 'an idle stretch after it: no landing asked').toBe(0);
    expect(asked).toBe(before);
    first.stop();
    // A later landing (another chord): it lands at once, and the code is not asked for again.
    const second = page(landing, true);
    expect(second.scrollTo).toHaveBeenLastCalledWith(target);
    await idle();
    expect(mod.imports, 'one attempt in all').toBe(1);
    second.stop();
  });
});
