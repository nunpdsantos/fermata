/**
 * QA report 2, P5: Explore's continuation cues (`scrollCues.ts`). jsdom lays
 * nothing out, so each box is given its geometry; the browser half (the fade
 * painted, no room taken) is e2e/explore-piano-audit.spec.ts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contentBelow, trackExploreScrollCues } from '../scrollCues';

function box(el: HTMLElement, top: number, height: number, opts: { scrollHeight?: number; overflowY?: string } = {}) {
  el.getBoundingClientRect = () => ({ top, bottom: top + height, height, left: 0, right: 100, width: 100, x: 0, y: top, toJSON: () => ({}) }) as DOMRect;
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: height });
  Object.defineProperty(el, 'clientTop', { configurable: true, value: 0 });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: opts.scrollHeight ?? height });
  if (opts.overflowY) el.style.overflowY = opts.overflowY;
  return el;
}
function scroller(childBottom: number, opts: { scrollHeight: number; overflowY?: string }) {
  const el = box(document.createElement('div'), 0, 300, { overflowY: 'auto', ...opts });
  el.appendChild(box(document.createElement('div'), 0, childBottom));
  return el;
}

afterEach(() => { document.body.innerHTML = ''; vi.unstubAllGlobals(); });

describe('contentBelow: content, not scroll room', () => {
  it('a scroller whose last child ends below its foot has more', () => {
    expect(contentBelow(scroller(340, { scrollHeight: 340 }))).toBe(true);
  });
  it('one that scrolls only into its padding (a landing\'s tail padding, the metronome\'s room) has none', () => {
    expect(contentBelow(scroller(300, { scrollHeight: 380 }))).toBe(false);
  });
  it('one that does not scroll, or fits, has none', () => {
    expect(contentBelow(scroller(340, { scrollHeight: 340, overflowY: 'visible' }))).toBe(false);
    expect(contentBelow(scroller(280, { scrollHeight: 300 }))).toBe(false);
    expect(contentBelow(null)).toBe(false);
  });
});

describe('trackExploreScrollCues: the attributes the fades read', () => {
  it('marks the work column, the circle column and the work area, and clears them on clean-up', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 1; });
    const root = box(document.createElement('div'), 0, 600);
    root.className = 'explore-root';
    const work = box(document.createElement('div'), 100, 500);
    work.className = 'explore-work';
    const main = scroller(340, { scrollHeight: 340 });
    main.className = 'explore-main';
    const aside = scroller(280, { scrollHeight: 300 });
    aside.className = 'explore-aside';
    work.append(main, aside);
    root.append(work);
    document.body.append(root);
    const stop = trackExploreScrollCues(root);
    expect(work.hasAttribute('data-main-more-below')).toBe(true);
    expect(work.hasAttribute('data-aside-more-below')).toBe(false);
    expect(root.hasAttribute('data-more-below')).toBe(false);
    // The work area itself scrolling (below 1200 px), its content going on:
    work.style.overflowY = 'auto';
    Object.defineProperty(work, 'scrollHeight', { configurable: true, value: 700 });
    main.getBoundingClientRect = () => ({ top: 100, bottom: 700, height: 600, left: 0, right: 100, width: 100, x: 0, y: 100, toJSON: () => ({}) }) as DOMRect;
    work.dispatchEvent(new Event('scroll'));
    expect(root.hasAttribute('data-more-below')).toBe(true);
    stop();
    expect([root.hasAttribute('data-more-below'), work.hasAttribute('data-main-more-below')]).toEqual([false, false]);
  });
});
