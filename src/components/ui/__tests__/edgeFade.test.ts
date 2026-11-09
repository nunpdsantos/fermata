import { afterEach, describe, expect, it, vi } from 'vitest';
import { scrollEdges, trackScrollEdges } from '../edgeFade';

afterEach(() => { vi.unstubAllGlobals(); document.body.replaceChildren(); });

describe('scrollEdges (the staff strip rule: 1 px of slack)', () => {
  it('a row that fits says nothing', () => {
    expect(scrollEdges(0, 300, 300)).toEqual({ moreLeft: false, moreRight: false });
    expect(scrollEdges(0, 300, 301)).toEqual({ moreLeft: false, moreRight: false });
  });
  it('at rest an overflowing row has more on the right only', () => {
    expect(scrollEdges(0, 300, 640)).toEqual({ moreLeft: false, moreRight: true });
  });
  it('scrolled part way: both sides; at the end: the left only', () => {
    expect(scrollEdges(120, 300, 640)).toEqual({ moreLeft: true, moreRight: true });
    expect(scrollEdges(340, 300, 640)).toEqual({ moreLeft: true, moreRight: false });
    expect(scrollEdges(339.5, 300, 640)).toEqual({ moreLeft: true, moreRight: false });
  });
});

function scroller(clientWidth: number, scrollWidth: number) {
  const el = document.createElement('div');
  Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => clientWidth });
  Object.defineProperty(el, 'scrollWidth', { configurable: true, get: () => scrollWidth });
  return {
    el,
    set(next: { clientWidth?: number; scrollWidth?: number }) {
      clientWidth = next.clientWidth ?? clientWidth;
      scrollWidth = next.scrollWidth ?? scrollWidth;
    },
  };
}

describe('trackScrollEdges', () => {
  it('marks the host while there is more off a side, follows scroll and resize, and cleans up', () => {
    let resize = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { resize = callback; }
      observe() {}
      disconnect = disconnect;
    });
    const host = document.createElement('div');
    const row = scroller(300, 640);
    row.el.append(document.createElement('button'));
    host.append(row.el);
    document.body.append(host);
    const marks = () => [host.hasAttribute('data-more-left'), host.hasAttribute('data-more-right')];

    const stop = trackScrollEdges(host, () => host.firstElementChild as HTMLElement);
    expect(marks()).toEqual([false, true]);
    row.el.scrollLeft = 120;
    row.el.dispatchEvent(new Event('scroll'));
    expect(marks()).toEqual([true, true]);
    row.el.scrollLeft = 340;
    row.el.dispatchEvent(new Event('scroll'));
    expect(marks()).toEqual([true, false]);
    // Wider screen (rotation, resize): the whole row fits — no fades at all.
    row.el.scrollLeft = 0;
    row.set({ clientWidth: 700 });
    resize();
    expect(marks()).toEqual([false, false]);
    stop();
    expect(disconnect).toHaveBeenCalled();
    expect(host.hasAttribute('data-more-left') || host.hasAttribute('data-more-right')).toBe(false);
  });

  it('reads a scroller outside the host (the phone instrument strip)', () => {
    const strip = document.createElement('div');
    const keys = scroller(390, 2000);
    document.body.append(strip, keys.el);
    const stop = trackScrollEdges(strip, () => keys.el);
    expect(strip.hasAttribute('data-more-right')).toBe(true);
    expect(strip.hasAttribute('data-more-left')).toBe(false);
    keys.el.scrollLeft = 500;
    keys.el.dispatchEvent(new Event('scroll'));
    expect(strip.hasAttribute('data-more-left')).toBe(true);
    stop();
  });

  it('with no scroller there is nothing to mark', () => {
    const host = document.createElement('div');
    const stop = trackScrollEdges(host, () => null);
    expect(host.hasAttribute('data-more-left') || host.hasAttribute('data-more-right')).toBe(false);
    stop();
  });
});
