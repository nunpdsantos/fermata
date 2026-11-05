import { useLayoutEffect, useSyncExternalStore, type RefObject } from 'react';

/**
 * Where toasts may go (W9-22, W11-A review round 4).
 *
 * Toasts are an OVERLAY — never in the page flow — so showing or dismissing
 * one moves nothing: no instrument key, no Drill answer (the in-flow band of
 * round 3 shifted them by up to 269 px). The region sits under the top bar
 * and may grow only down to the first element registered here with
 * `useToastAvoid` (the instrument dock / sheet, Drill's answers): it never
 * covers them. Two CSS custom properties on <html> carry the result:
 *   --toast-top   the region's top (the top bar's bottom + 8 px)
 *   --toast-room  the height it may take before an avoided element (- 8 px)
 * index.css reads them (`.toast-region`). ToastRegion queues whole cards
 * when the stack is taller than the room.
 */
const avoided = new Set<HTMLElement>();
let observer: ResizeObserver | null = null;
let frame = 0;

const GAP = 8;

// The room, also for React (W9b: the update toast shows its "What's new"
// line only where it fits — useToastRoom).
let lastRoom = Number.POSITIVE_INFINITY;
const roomListeners = new Set<() => void>();

export function measureToastRoom(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const bar = document.querySelector('.app-topbar');
  const top = (bar ? bar.getBoundingClientRect().bottom : 0) + GAP;
  let limit = window.innerHeight;
  for (const el of avoided) {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.top < limit) limit = r.top;
  }
  const room = Math.max(0, Math.floor(limit - GAP - top));
  root.style.setProperty('--toast-top', `${Math.round(top)}px`);
  root.style.setProperty('--toast-room', `${room}px`);
  if (room !== lastRoom) {
    lastRoom = room;
    for (const listener of roomListeners) listener();
  }
}

function subscribeRoom(listener: () => void): () => void {
  roomListeners.add(listener);
  return () => roomListeners.delete(listener);
}

/**
 * The height (px) toasts may take before an avoided element, as last
 * measured; Infinity until the first measurement (nothing to avoid yet).
 */
export function useToastRoom(): number {
  return useSyncExternalStore(subscribeRoom, () => lastRoom, () => lastRoom);
}

function schedule(): void {
  if (typeof requestAnimationFrame === 'undefined') {
    measureToastRoom();
    return;
  }
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    measureToastRoom();
  });
}

function ensureObserver(): ResizeObserver | null {
  if (observer || typeof ResizeObserver === 'undefined') return observer;
  observer = new ResizeObserver(schedule);
  const bar = document.querySelector('.app-topbar');
  if (bar) observer.observe(bar);
  window.addEventListener('resize', schedule);
  // A scrolled view can carry an avoided element (Drill's answers) with it.
  document.addEventListener('scroll', schedule, true);
  return observer;
}

/**
 * Keep toasts clear of this element. Its parent is observed too: a Drill
 * answer block keeps its size while the question above it grows, but its top
 * moves.
 */
export function useToastAvoid(ref: RefObject<HTMLElement | null>, active = true): void {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    avoided.add(el);
    const ro = ensureObserver();
    ro?.observe(el);
    if (el.parentElement) ro?.observe(el.parentElement);
    measureToastRoom();
    return () => {
      avoided.delete(el);
      ro?.unobserve(el);
      if (el.parentElement) ro?.unobserve(el.parentElement);
      schedule();
    };
  }, [ref, active]);
}

/** For tests: forget every registration. */
export function resetToastLayoutForTests(): void {
  avoided.clear();
  observer?.disconnect();
  observer = null;
  lastRoom = Number.POSITIVE_INFINITY;
}

/** Whole cards only. PWA priority order is retained; cards that do not fit
 * wait, without displacing the app. Re-evaluate as room/cards change. */
export function fitToastQueue(heights: readonly number[], room: number): { visible: boolean[]; tops: number[]; height: number } {
  let used = 0;
  let waiting = false;
  const tops: number[] = [];
  const visible = heights.map((height) => {
    const top = used ? used + GAP : 0;
    const fits = !waiting && height > 0 && top + height <= room;
    if (!fits) waiting = true;
    tops.push(fits ? top : 0);
    if (fits) used = top + height;
    return fits;
  });
  return { visible, tops, height: used };
}
