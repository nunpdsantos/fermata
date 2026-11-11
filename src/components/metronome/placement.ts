/**
 * Where the metronome's bar goes (wave 3, stream M) — pure.
 *
 * Placed as the tour's caption bar is (`services/tour/dom.ts` placeBar): a
 * fixed overlay, never in the page flow, just above the instrument (the
 * dock / the phone's sheet: the `floor`) and below the top bar — never over
 * either. It never covers a check's answers (`hard` boxes): when the place
 * above the instrument would, it goes just above the answers instead. It
 * keeps off the chord's detail where it can (`soft` boxes: the left / right
 * / centre place that covers it least; the left edge when nothing is in the way). Where its full bar does not fit
 * between the top bar and the floor (a phone's sheet at Full), it shows its
 * compact form (▶ / ■, the count, the tempo, ✕). Where not even that fits
 * (a phone held sideways with its sheet at Full: ~28 px are left), the
 * compact bar goes into an EMPTY stretch of the top bar (between the name
 * and the tabs, or the tabs and the search) — over no control of it, and
 * never over the instrument.
 */

export interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface MetronomePlacementInput {
  viewport: { width: number; height: number };
  /** The top bar's bottom edge. */
  topBarBottom: number;
  /** The bottom of what stands in the flow under the top bar (the start hint), if anything. */
  topClear?: number;
  /** The top of the instrument (dock / sheet), or the window's bottom. */
  floor: number;
  /** The bar's size in its full and its compact form (widths already capped to the window less the gutters). */
  fullWidth: number;
  fullHeight: number;
  compactWidth: number;
  compactHeight: number;
  /** Never covered (a check's answers). */
  hard?: readonly Box[];
  /** Covered as little as possible (the chord's detail). */
  soft?: readonly Box[];
  /** The empty stretches of the top bar (no control in them), for the last resort. */
  topBarSpans?: readonly Box[];
}

export interface MetronomePlace {
  top: number;
  left: number;
  compact: boolean;
  /** In an empty stretch of the top bar (then toasts, under the top bar, never meet it). */
  inTopBar?: boolean;
}

export const GAP = 8;
export const GUTTER = 12;

export const overlapArea = (a: Box, b: Box): number =>
  Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
  Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

export function placeMetronome(input: MetronomePlacementInput): MetronomePlace {
  const { viewport, floor } = input;
  const hard = input.hard ?? [];
  const soft = input.soft ?? [];
  const ceiling = Math.max(input.topBarBottom, input.topClear ?? 0) + GAP;
  const leftsFor = (width: number) => {
    // The left edge first (on a laptop's Explore, the work column's free foot, not the circle's facts).
    const lefts = [...new Set([
      GUTTER,
      Math.round(viewport.width - GUTTER - width),
      Math.round((viewport.width - width) / 2),
    ])].filter((l) => l >= 0);
    return lefts.length ? lefts : [0];
  };

  const tryForm = (width: number, height: number, compact: boolean): MetronomePlace | null => {
    const lefts = leftsFor(width);
    // Just above the instrument first, then just above each of the answers (lowest first).
    const tops = [floor - GAP - height, ...hard.map((b) => b.top - GAP - height).sort((a, b) => b - a)];
    let best: MetronomePlace | null = null;
    let bestScore = Infinity;
    for (const top of tops) {
      if (top < ceiling || top + height > floor - GAP + 0.5) continue;
      for (const left of lefts) {
        const box: Box = { top, bottom: top + height, left, right: left + width };
        if (hard.some((b) => overlapArea(box, b) > 0)) continue;
        const score = soft.reduce((sum, b) => sum + overlapArea(box, b), 0);
        if (score === 0) return { top, left, compact };
        if (score < bestScore) {
          best = { top, left, compact };
          bestScore = score;
        }
      }
    }
    return best;
  };

  const inTopBar = (): MetronomePlace | null => {
    for (const span of input.topBarSpans ?? []) {
      const room = span.right - span.left - 2 * GAP;
      if (room < input.compactWidth || span.bottom - span.top < input.compactHeight) continue;
      return {
        top: Math.round(span.top + (span.bottom - span.top - input.compactHeight) / 2),
        left: Math.round(span.left + (span.right - span.left - input.compactWidth) / 2),
        compact: true,
        inTopBar: true,
      };
    }
    return null;
  };

  return tryForm(input.fullWidth, input.fullHeight, false)
    ?? tryForm(input.compactWidth, input.compactHeight, true)
    ?? inTopBar()
    // Nowhere free: compact, as low as the floor lets it (never above the top bar).
    ?? { top: Math.max(ceiling, floor - GAP - input.compactHeight), left: leftsFor(input.compactWidth)[0], compact: true };
}
