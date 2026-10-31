/**
 * Review item 6 (W9): files the page fetched before the new service worker
 * controlled it (first visit — VexFlow, an early lesson level, samples) never
 * went through runtime caching, so they were missing offline. When the worker
 * takes control of a page that started uncontrolled, they are fetched again
 * through it. Browser evidence (scratch harness, no HTTP cache, worker's
 * network slowed): with the warm-up 8 notes drawn offline, without it 0.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

let container: EventTarget & { controller: unknown };
const fetchSpy = vi.fn(() => Promise.resolve(new Response('')));

function resources(names: string[]) {
  vi.spyOn(performance, 'getEntriesByType').mockReturnValue(names.map((name) => ({ name })) as unknown as PerformanceEntryList);
}

beforeEach(() => {
  vi.resetModules();
  fetchSpy.mockClear();
  vi.stubGlobal('fetch', fetchSpy);
  container = Object.assign(new EventTarget(), { controller: null as unknown });
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: container });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('warm the runtime caches once the worker takes over (review item 6)', () => {
  it('first visit (uncontrolled): on controllerchange, re-fetches same-origin /assets and /samples once each', async () => {
    resources([
      `${location.origin}/assets/vexflow-abc.js`,
      `${location.origin}/assets/curriculumL1-def.js`,
      `${location.origin}/assets/curriculumL1-def.js`,
      `${location.origin}/samples/piano/C4.mp3`,
      `${location.origin}/fonts/source-serif-4-latin.woff2`,
      'https://elsewhere.example/assets/x.js',
    ]);
    const pwa = await import('../usePWA');
    pwa.startPwaRegistration();
    expect(fetchSpy).not.toHaveBeenCalled();

    container.dispatchEvent(new Event('controllerchange'));
    const urls = (fetchSpy.mock.calls as unknown as Array<[string]>).map((c) => new URL(c[0]).pathname).sort();
    expect(urls).toEqual(['/assets/curriculumL1-def.js', '/assets/vexflow-abc.js', '/samples/piano/C4.mp3']);

    container.dispatchEvent(new Event('controllerchange')); // later takeovers (updates) don't repeat it
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it('a page that was already controlled at load does nothing (its requests already went through the worker)', async () => {
    container.controller = {};
    resources([`${location.origin}/assets/vexflow-abc.js`]);
    const pwa = await import('../usePWA');
    pwa.startPwaRegistration();
    container.dispatchEvent(new Event('controllerchange'));
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
