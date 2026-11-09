import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { fitDockDetents, type DockRow } from './detentGeometry';
import { DETENTS, type Detent } from '../../state/dock';

/**
 * DETENT SHEET (design system v2, D-26) — a NON-modal sheet pinned to the
 * bottom of the screen that rests at three heights: Peek (its bar only),
 * Half and Full. The whole bar is the handle: drag it, tap an empty part of
 * it (steps up: Peek → Half → Full → Peek), or focus it and use ↑ / ↓,
 * Home / End, Enter (Peek ⇄ Half). It is a WAI-ARIA window splitter
 * (role="separator" with a value), so its state is announced. The bar's own
 * controls sit above the handle and take their own taps. Respects the
 * bottom safe-area inset. The phone instrument dock is one.
 *
 * Half and Full are never taller than the content needs (fitDockDetents).
 * When the whole content fits at Half, there is nothing more for Full to
 * show: the sheet has two stops, Peek and Half — a Full that was asked for is
 * shown (and announced) as Half, the handle steps Peek ⇄ Half, and the
 * learner's saved choice is kept for an instrument that does need Full.
 */
export interface DetentSheetProps {
  detent: Detent;
  onDetent: (detent: Detent) => void;
  /** Height (px) the sheet may grow to — the area under the top bar. */
  available: number;
  /** Accessible name of the handle, e.g. "Instrument panel". */
  handleLabel: string;
  detentLabels: Record<Detent, string>;
  /**
   * Preferred gap above Full. A guitar board may need this room to show
   * every string; ToastRegion then queues cards that cannot fit.
   */
  fullGap?: number;
  /** Controls shown on the bar at every detent. */
  bar: ReactNode;
  children: ReactNode;
  testId?: string;
  /** The detent the sheet SHOWS (a Full with nothing more to show is Half). */
  onShown?: (detent: Detent) => void;
}

const TAP_SLOP_PX = 6;
const HALF_SHARE = 0.5;
/** Half never leaves the view less than this… */
const VIEW_MIN_PX = 120;
/** …and, room allowing, gives the content at least this (a whole keyboard
 *  on a phone held sideways, where 50 % was a sliver of the keys). */
const HALF_CONTENT_MIN_PX = 160;

const coarsePointer = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
const estimatePeek = () => (coarsePointer() ? 44 : 36) + 28;

export function DetentSheet({ detent, onDetent, available, fullGap = 0, handleLabel, detentLabels, bar, children, testId, onShown }: DetentSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  // `content`: the content's natural height (0 until measured: no cap).
  const [geometry, setGeometry] = useState<{ rows: DockRow[]; boardBottom: number; content: number }>({ rows: [], boardBottom: 0, content: 0 });
  const headRef = useRef<HTMLDivElement>(null);
  // First render: a close estimate (tap + 28 px: grip strip + bar), corrected
  // by measurement before it matters — starting at 0 drew the sheet 1 px tall
  // for a frame, then grew it (a load-time layout shift of 0.2–0.7).
  const [peekHeight, setPeekHeight] = useState(estimatePeek);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const drag = useRef<{ pointer: number; startY: number; startH: number; moved: boolean } | null>(null);
  const contentId = useId();

  // Peek = the head (handle + bar) plus the safe-area padding.
  useLayoutEffect(() => {
    const head = headRef.current;
    if (!head) return;
    const measure = () => {
      const section = head.parentElement;
      const pad = section ? parseFloat(getComputedStyle(section).paddingBottom) || 0 : 0;
      const border = section ? parseFloat(getComputedStyle(section).borderTopWidth) || 0 : 0;
      setPeekHeight(head.offsetHeight + pad + border);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(head);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => {
      content.parentElement?.toggleAttribute('data-more-below', content.scrollTop + content.clientHeight < content.scrollHeight - 1);
      const origin = content.getBoundingClientRect().top - content.scrollTop;
      const rows = Array.from(content.querySelectorAll<HTMLElement>('[data-dock-row], .fretboard-controls > *')).map((el) => {
        const r = el.getBoundingClientRect();
        const dots = Array.from(el.querySelectorAll('[data-dot]')).map((dot) => dot.getBoundingClientRect()).filter((dot) => dot.height > 0);
        return {
          top: r.top - origin, bottom: r.bottom - origin,
          ...(dots.length ? { dots: { top: Math.min(...dots.map((dot) => dot.top)) - origin, bottom: Math.max(...dots.map((dot) => dot.bottom)) - origin } } : {}),
        };
      }).filter((r) => r.bottom > r.top);
      const board = content.querySelector('.fretboard-scroll');
      const boardBottom = board ? board.getBoundingClientRect().bottom - origin : 0;
      // How tall the content is on its own: the lowest bottom of its
      // children (laid out at their natural height even at Peek, where the
      // scroller is 0 px tall), rounded up so it never needs to scroll.
      const bottoms = Array.from(content.children).map((el) => el.getBoundingClientRect()).filter((r) => r.height > 0).map((r) => r.bottom - origin);
      const natural = bottoms.length ? Math.ceil(Math.max(...bottoms) - 0.01) : 0;
      const next = { rows, boardBottom, content: natural };
      setGeometry((prev) => JSON.stringify(prev) === JSON.stringify(next) ? prev : next);
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    const observe = () => {
      ro?.disconnect();
      ro?.observe(content);
      // The children too: the content box keeps the sheet's height, so it
      // does not resize when the instrument inside it grows or shrinks.
      Array.from(content.children).forEach((el) => ro?.observe(el));
      content.querySelectorAll('[data-dock-row], [data-dot], .fretboard-controls, .fretboard-scroll').forEach((el) => ro?.observe(el));
      measure();
    };
    const mo = new MutationObserver(observe);
    mo.observe(content, { childList: true, subtree: true });
    observe();
    content.addEventListener('scroll', measure, { passive: true });
    return () => { ro?.disconnect(); mo.disconnect(); content.removeEventListener('scroll', measure); };
  }, []);

  const preferredFull = Math.max(peekHeight, available - fullGap);
  const halfFloor = Math.min(peekHeight + HALF_CONTENT_MIN_PX, available - VIEW_MIN_PX);
  const fitted = fitDockDetents(
    Math.min(preferredFull, Math.max(peekHeight, Math.round(available * HALF_SHARE), halfFloor)),
    preferredFull, available, peekHeight, geometry.rows, geometry.boardBottom, geometry.content,
  );
  const full = fitted.full;
  const heights: Record<Detent, number> = { peek: peekHeight, half: fitted.half, full };
  // The stops this content has: no Full when everything fits at Half.
  const stops: readonly Detent[] = fitted.fullDistinct ? DETENTS : DETENTS.slice(0, 2);
  const shown: Detent = stops.includes(detent) ? detent : 'half';
  const index = stops.indexOf(shown);
  const step = (dir: 1 | -1) => stops[Math.min(stops.length - 1, Math.max(0, index + dir))];
  const last = stops[stops.length - 1];

  useLayoutEffect(() => {
    onShown?.(shown);
  }, [shown, onShown]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: Detent | null = null;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') next = step(1);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') next = step(-1);
    else if (e.key === 'Home') next = 'peek';
    else if (e.key === 'End') next = last;
    else if (e.key === 'Enter' || e.key === ' ') next = shown === 'peek' ? 'half' : 'peek';
    if (next) {
      e.preventDefault();
      if (next !== shown) onDetent(next);
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    drag.current = { pointer: e.pointerId, startY: e.clientY, startH: heights[shown], moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointer !== e.pointerId) return;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dy) < TAP_SLOP_PX) return;
    d.moved = true;
    setDragHeight(Math.min(full, Math.max(peekHeight, d.startH - dy)));
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointer !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) {
      // A tap on the handle steps up, and from the top stop back to Peek.
      onDetent(shown === last ? 'peek' : stops[index + 1]);
      return;
    }
    const h = Math.min(full, Math.max(peekHeight, d.startH - (e.clientY - d.startY)));
    const nearest = stops.reduce((best, k) => (Math.abs(heights[k] - h) < Math.abs(heights[best] - h) ? k : best), shown);
    setDragHeight(null);
    if (nearest !== shown) onDetent(nearest);
  };
  const onPointerCancel = () => {
    drag.current = null;
    setDragHeight(null);
  };

  const height = dragHeight ?? (shown === 'peek' ? undefined : heights[shown]);
  const collapsed = shown === 'peek' && dragHeight === null;

  return (
    <section
      className="detent-sheet"
      data-testid={testId}
      data-detent={shown}
      style={height !== undefined ? { height } : undefined}
    >
      <div ref={headRef} className="detent-head">
        <div
          role="separator"
          tabIndex={0}
          aria-orientation="horizontal"
          aria-label={handleLabel}
          aria-valuemin={0}
          aria-valuemax={stops.length - 1}
          aria-valuenow={index}
          aria-valuetext={detentLabels[shown]}
          aria-controls={contentId}
          className="detent-handle"
          data-focus-ring="custom"
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <span className="sheet-grip" aria-hidden="true" />
        </div>
        <div className="detent-bar">{bar}</div>
      </div>
      <div
        ref={contentRef}
        id={contentId}
        className="detent-content"
        inert={collapsed}
        aria-hidden={collapsed || undefined}
        style={collapsed ? { height: 0 } : shown === 'half' ? { marginBottom: fitted.halfBottomGap } : undefined}
      >
        {children}
      </div>
    </section>
  );
}
