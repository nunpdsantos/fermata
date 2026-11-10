/**
 * DOM helpers of the tour: waiting for a target to be really there (present,
 * laid out and still), and placing the caption bar where it covers neither
 * the spotlighted element nor the instrument.
 */

export interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 16);
  });

const sameBox = (a: DOMRect, b: DOMRect) =>
  Math.abs(a.top - b.top) < 0.5 && Math.abs(a.left - b.left) < 0.5 &&
  Math.abs(a.width - b.width) < 0.5 && Math.abs(a.height - b.height) < 0.5;

function animating(el: Element): boolean {
  if (typeof el.getAnimations !== 'function') return false;
  try {
    return el.getAnimations({ subtree: true }).some((a) => a.playState === 'running' || a.pending);
  } catch {
    return false;
  }
}

/** Find a visible element for a selector (the first one with a box). */
export function findTarget(selector: string): Element | null {
  if (typeof document === 'undefined') return null;
  for (const el of Array.from(document.querySelectorAll(selector))) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

/** How many frames in a row the box must stay the same to count as settled. */
const STILL_FRAMES = 3;

/**
 * Resolve with the element once it is present, has a box, is not animating
 * and has kept the same box for a few frames — i.e. its view's chunk has
 * loaded and its entrance has finished. A guard (`timeoutMs`, not a wait for
 * anything in particular) resolves with whatever is there if it never
 * settles; an abort resolves with null.
 */
export async function waitSettled(selector: string, signal: AbortSignal, timeoutMs = 8000): Promise<Element | null> {
  const deadline = Date.now() + timeoutMs;
  let last: DOMRect | null = null;
  let still = 0;
  while (!signal.aborted) {
    const el = findTarget(selector);
    if (el) {
      const r = el.getBoundingClientRect();
      if (last && sameBox(last, r) && !animating(el)) still++;
      else still = 0;
      last = r;
      if (still >= STILL_FRAMES) return el;
    } else {
      last = null;
      still = 0;
    }
    if (Date.now() > deadline) return el;
    await nextFrame();
  }
  return null;
}

/** Resolve when `predicate` holds (checked on every change of `subscribe`), or on abort / guard timeout. */
export function waitUntil(
  subscribe: (listener: () => void) => () => void,
  predicate: () => boolean,
  signal: AbortSignal,
  timeoutMs = 8000,
): Promise<boolean> {
  return new Promise((resolve) => {
    if (predicate()) {
      resolve(true);
      return;
    }
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      unsubscribe();
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      resolve(ok);
    };
    const onAbort = () => finish(false);
    const unsubscribe = subscribe(() => {
      if (predicate()) finish(true);
    });
    const timer = setTimeout(() => finish(predicate()), timeoutMs);
    signal.addEventListener('abort', onAbort);
  });
}

export const overlapArea = (a: Box, b: Box): number =>
  Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
  Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

export interface BarPlacementInput {
  /** The window. */
  viewport: { width: number; height: number };
  /** The top bar's bottom edge. */
  topBarBottom: number;
  /** The top of whatever the bar must stay above (the instrument dock / sheet), or the window's bottom. */
  floor: number;
  /** The bar's own height and (largest) width. */
  barHeight: number;
  barWidth: number;
  /** The spotlighted element (null: none) — never covered if any place can avoid it. */
  target: Box | null;
  /** The element the tap cue is on (null: none) — avoided next. */
  cue: Box | null;
  /** True when the target is in the top bar (a tab): the bar may then not cover the top bar. */
  targetInTopBar: boolean;
}

export type BarSlot = 'bottom' | 'top' | 'over-topbar';

export interface BarPlace {
  slot: BarSlot;
  top: number;
  left: number;
}

const GAP = 8;
/** The side gutter, and the room kept around the spotlighted element (its ring is drawn 4 px outside it). */
export const BAR_GUTTER = 12;
const TARGET_MARGIN = 8;

const grow = (b: Box, by: number): Box => ({ top: b.top - by, bottom: b.bottom + by, left: b.left - by, right: b.right + by });

/**
 * Where the caption bar goes: just above the instrument (`bottom`), just
 * under the top bar (`top`), or — on a short screen, where the room between
 * them is the view's own ~120 px — over the top bar itself (`over-topbar`);
 * centred, or (where the window is wider than the bar) at the left or right
 * edge. The first place (in that order) that covers neither the target nor
 * the cued element wins; otherwise the one covering the target least (then
 * the cue). The bar never goes below `floor` (the instrument).
 */
export function placeBar(input: BarPlacementInput): BarPlace {
  const { topBarBottom, floor, barHeight, barWidth, targetInTopBar, viewport } = input;
  const target = input.target && grow(input.target, TARGET_MARGIN);
  const cue = input.cue;
  const tops: { slot: BarSlot; top: number }[] = [
    { slot: 'bottom', top: floor - GAP - barHeight },
    { slot: 'top', top: topBarBottom + GAP },
  ];
  if (!targetInTopBar) tops.push({ slot: 'over-topbar', top: Math.max(0, topBarBottom - barHeight) });
  const width = Math.min(barWidth, viewport.width - 2 * BAR_GUTTER);
  const lefts = [...new Set([
    Math.round((viewport.width - width) / 2),
    BAR_GUTTER,
    viewport.width - BAR_GUTTER - width,
  ])];
  // A place must keep the bar whole above the floor.
  const fits = tops.filter((s) => s.top >= 0 && s.top + barHeight <= floor);
  const rows = fits.length ? fits : [{ slot: 'over-topbar' as BarSlot, top: 0 }];
  let best: BarPlace = { ...rows[0], left: lefts[0] };
  let bestScore = Infinity;
  for (const row of rows) {
    for (const left of lefts) {
      const b: Box = { top: row.top, bottom: row.top + barHeight, left, right: left + width };
      const score = (target ? overlapArea(b, target) * 1000 : 0) + (cue ? overlapArea(b, cue) : 0);
      if (score === 0) return { ...row, left };
      if (score < bestScore) {
        best = { ...row, left };
        bestScore = score;
      }
    }
  }
  return best;
}
