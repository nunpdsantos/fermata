/**
 * The precise definition of a "fresh start" (W9b, services/freshStart.ts):
 * begins at a cold launch (or the first time a background-opened page is
 * shown) or on returning after ≥ LONG_ABSENCE_MS hidden; ends at the first
 * interaction or after FRESH_START_WINDOW_MS.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/react';

type Fresh = typeof import('../freshStart');

function setVisibility(state: 'visible' | 'hidden', dispatch = true) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
  if (dispatch) document.dispatchEvent(new Event('visibilitychange'));
}

async function load(): Promise<Fresh> {
  vi.resetModules();
  return import('../freshStart');
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-02T09:00:00Z'));
  setVisibility('visible', false);
});
afterEach(() => vi.useRealTimers());

describe('cold launch', () => {
  it('is fresh from launch until FRESH_START_WINDOW_MS has passed', async () => {
    const f = await load();
    expect(f.isFreshStart()).toBe(false); // not tracking yet
    f.startFreshStartTracking(() => {});
    expect(f.isFreshStart()).toBe(true);
    vi.advanceTimersByTime(f.FRESH_START_WINDOW_MS);
    expect(f.isFreshStart()).toBe(true);
    vi.advanceTimersByTime(1);
    expect(f.isFreshStart()).toBe(false);
  });

  it.each([
    ['pointerdown', () => fireEvent.pointerDown(window)],
    ['keydown', () => fireEvent.keyDown(document.body, { key: 'Tab' })],
    ['wheel', () => fireEvent.wheel(document.body)],
    ['touchstart', () => fireEvent.touchStart(document.body)],
    // A screen-reader user in browse mode: focus moves and scrolling, no pointer or key (review W9b-f).
    ['focusin', () => fireEvent.focusIn(document.body)],
    ['vertical scroll of an element (scroll does not bubble)', () => {
      const box = document.createElement('div');
      document.body.appendChild(box);
      box.scrollTop = 120;
      box.dispatchEvent(new Event('scroll', { bubbles: false }));
      box.remove();
    }],
  ])('ends at the first %s', async (_name, interact) => {
    const f = await load();
    f.startFreshStartTracking(() => {});
    interact();
    expect(f.isFreshStart()).toBe(false);
  });

  it('a sideways scroll does not end it (the app centres the piano strip by itself at boot)', async () => {
    const f = await load();
    f.startFreshStartTracking(() => {});
    const strip = document.createElement('div');
    document.body.appendChild(strip);
    strip.scrollLeft = 640;
    strip.dispatchEvent(new Event('scroll', { bubbles: false }));
    expect(f.isFreshStart()).toBe(true);
    strip.scrollTop = 30; // …but up / down does
    strip.dispatchEvent(new Event('scroll', { bubbles: false }));
    expect(f.isFreshStart()).toBe(false);
    strip.remove();
  });

  it('a page opened in the background becomes fresh when it is first shown', async () => {
    setVisibility('hidden', false);
    const f = await load();
    const onFresh = vi.fn();
    f.startFreshStartTracking(onFresh);
    expect(f.isFreshStart()).toBe(false);
    vi.advanceTimersByTime(60_000); // a minute in a background tab
    setVisibility('visible');
    expect(f.isFreshStart()).toBe(true);
    expect(onFresh).toHaveBeenCalledTimes(1);
  });
});

describe('return after a long absence', () => {
  it('hidden ≥ LONG_ABSENCE_MS, then shown: fresh again (even if used before), and the callback fires', async () => {
    const f = await load();
    const onFresh = vi.fn();
    f.startFreshStartTracking(onFresh);
    fireEvent.pointerDown(window);
    expect(f.isFreshStart()).toBe(false);
    setVisibility('hidden');
    vi.advanceTimersByTime(f.LONG_ABSENCE_MS);
    setVisibility('visible');
    expect(f.isFreshStart()).toBe(true);
    expect(onFresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(f.FRESH_START_WINDOW_MS + 1);
    expect(f.isFreshStart()).toBe(false);
  });

  it('hidden for less: not a fresh start, no callback', async () => {
    const f = await load();
    const onFresh = vi.fn();
    f.startFreshStartTracking(onFresh);
    fireEvent.pointerDown(window);
    setVisibility('hidden');
    vi.advanceTimersByTime(f.LONG_ABSENCE_MS - 1);
    setVisibility('visible');
    expect(f.isFreshStart()).toBe(false);
    expect(onFresh).not.toHaveBeenCalled();
  });

  it('tracking starts once per page', async () => {
    const f = await load();
    const first = vi.fn();
    const second = vi.fn();
    f.startFreshStartTracking(first);
    f.startFreshStartTracking(second);
    setVisibility('hidden');
    vi.advanceTimersByTime(f.LONG_ABSENCE_MS);
    setVisibility('visible');
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });
});
