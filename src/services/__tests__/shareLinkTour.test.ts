/**
 * A shared link and the tour, and a learner who moved while work is in
 * progress (services/shareLinkOpen.ts; leftovers round, review S-2):
 *
 *  - The tour's end puts back what it found (services/tour/session.ts
 *    `finish`, which clears the tour's request LAST, after the restore, on
 *    every ending: Close, Escape, "Put things back", Done, End, "Stay here",
 *    the page left). So while it plays a link is never applied: one arriving
 *    is held (the waiting line) and offered with "Open" once the tour has
 *    ended; "Open" tapped on an earlier offer while it plays waits the same
 *    way. One toast at a time; the work-in-progress rule still holds after.
 *  - A learner who moved while work is in progress: held first (nothing is
 *    offered mid-work), then offered with "Open" once the work is over; never
 *    applied by itself.
 * Fake timers: the held link looks again every HELD_LINK_POLL_MS.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { openShareLink, resetShareLinkOpen, HELD_LINK_POLL_MS } from '../shareLinkOpen.ts';
import { registerWorkInProgress } from '../workInProgress.ts';
import { requestDemo, clearDemoRequest } from '../../state/demoRequest.ts';
import { useAppStore } from '../../state/store.ts';
import { useToastStore } from '../../state/toastStore.ts';
import { readShareParams } from '../../state/shareParams.ts';
import type { Note } from '../../core/types/music.ts';

const LINK = readShareParams('?key=G&scale=major')!;
const C: Note = { natural: 'C', accidental: '' };
const G: Note = { natural: 'G', accidental: '' };
const WAITING = ['This link opens G Major. Fermatina will offer to open it when you have finished what you are doing.', null];
const READY = ['Ready to open the link: G Major', 'Open'];
const toasts = () => useToastStore.getState().toasts.map((t) => [t.message, t.action?.label ?? null]);
const key = () => useAppStore.getState().selectedKey;
/** The action as the learner taps it (layout/Toast.tsx: the toast closes, then the action runs). */
function tapOpen() {
  const t = useToastStore.getState().toasts.find((x) => x.action)!;
  useToastStore.getState().removeToast(t.id);
  t.action!.onSelect();
}
const tick = () => vi.advanceTimersByTime(HELD_LINK_POLL_MS);

beforeEach(() => {
  vi.useFakeTimers();
  useAppStore.setState({ view: 'explore', selectedKey: C, selectedScale: 'major', selectedChord: null });
  useToastStore.setState({ toasts: [] });
});

afterEach(() => {
  clearDemoRequest();
  resetShareLinkOpen();
  vi.useRealTimers();
});

describe('a shared link while the tour plays', () => {
  it('a link arriving while it plays is held, and offered with “Open” only once the tour has ended', async () => {
    requestDemo('intro', 'menu');
    expect(await openShareLink(LINK, LINK)).toBe('held');
    expect(toasts()).toEqual([WAITING]);
    tick();
    tick();
    expect(toasts().filter((t) => t[1] === 'Open'), 'no offer while the tour plays').toEqual([]);
    expect(key()).toEqual(C);
    clearDemoRequest(); // every ending of the tour, after it has put things back
    tick();
    expect(toasts()).toEqual([READY]);
    tapOpen();
    expect(key()).toEqual(G);
  });

  it('the learner who asked for the tour while the link waited (moved): held the same way, then offered', async () => {
    requestDemo('intro', 'menu');
    expect(await openShareLink(LINK, LINK, () => true)).toBe('held');
    expect(toasts()).toEqual([WAITING]);
    clearDemoRequest();
    tick();
    expect(toasts()).toEqual([READY]);
    expect(key()).toEqual(C);
  });

  it('“Open” tapped on an earlier offer while the tour plays waits for its end (one toast at a time), then is offered again', async () => {
    expect(await openShareLink(LINK, LINK, () => true)).toBe('offered');
    expect(toasts()).toEqual([READY]);
    requestDemo('intro', 'menu');
    tapOpen();
    expect(key(), 'not applied under the tour').toEqual(C);
    expect(toasts()).toEqual([WAITING]);
    tick();
    expect(toasts()).toEqual([WAITING]);
    clearDemoRequest();
    tick();
    expect(toasts()).toEqual([READY]);
    tapOpen();
    expect(key()).toEqual(G);
  });

  it('after the tour, work in progress still holds the link', async () => {
    requestDemo('intro', 'menu');
    let busy = true;
    const unregister = registerWorkInProgress('tour-test-check', () => busy);
    try {
      expect(await openShareLink(LINK, LINK)).toBe('held');
      clearDemoRequest();
      tick();
      tick();
      expect(toasts().filter((t) => t[1] === 'Open'), 'the check is still on').toEqual([]);
      busy = false;
      tick();
      expect(toasts()).toEqual([READY]);
      expect(key()).toEqual(C);
    } finally {
      unregister();
    }
  });
});

describe('the learner moved AND work is in progress', () => {
  it('held first (nothing offered mid-work), offered with “Open” once the work is over, never applied by itself', async () => {
    let busy = true;
    const unregister = registerWorkInProgress('moved-test-check', () => busy);
    try {
      expect(await openShareLink(LINK, LINK, () => true)).toBe('held');
      expect(toasts()).toEqual([WAITING]);
      tick();
      expect(toasts()).toEqual([WAITING]);
      busy = false;
      tick();
      expect(toasts()).toEqual([READY]);
      expect(key()).toEqual(C);
      tapOpen();
      expect(key()).toEqual(G);
    } finally {
      unregister();
    }
  });
});
