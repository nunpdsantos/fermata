import { useCallback, useEffect, useRef } from 'react';

/**
 * Pointer drag-to-scroll for a horizontally scrollable container.
 *
 * Extracted from the desktop fretboard drag logic (Fretboard.tsx) so the same
 * code drives BOTH:
 *   - desktop drag-to-scroll on the instrument surface (mouse), and
 *   - the mobile scroll strip (a slim handle below the surface — finger drag
 *     pans the keyboard/fretboard without ever touching a key/fret).
 *
 * Movement past `threshold` px latches `dragged` so a click that follows a drag
 * can be suppressed (desktop never wants a stray note after a pan). The handler
 * captures the pointer on the supplied element when one is given (the strip),
 * so the move/up always land on the same element even if the finger leaves it;
 * the desktop call site passes no capture target and listens on `document`
 * instead (its historical behaviour — capturing the surface would swallow the
 * per-key pointer events).
 *
 * setPointerCapture / releasePointerCapture are guarded: jsdom does not
 * implement them, and Safari/iOS does — calling defensively keeps both happy.
 */

interface UseDragScrollOptions {
  /** px of movement before a press counts as a drag (default 5). */
  threshold?: number;
  /** Only react to this mouse button (default 0 = primary). Ignored for touch/pen. */
  button?: number;
}

interface DragScrollState {
  startX: number;
  startScroll: number;
  dragged: boolean;
  pointerId: number | null;
  captureEl: HTMLElement | null;
}

export interface UseDragScrollResult {
  /** Attach to onPointerDown of the element that should initiate scrolling. */
  onPointerDown: (e: React.PointerEvent) => void;
  /**
   * True if the most recent press turned into a drag. Read this in an
   * onClickCapture handler to suppress the synthetic click after a drag.
   * Cleared by calling `consumeDragged()`.
   */
  didDrag: () => boolean;
  /** Read-and-reset the dragged flag (use inside onClickCapture). */
  consumeDragged: () => boolean;
}

export function useDragScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseDragScrollOptions = {},
): UseDragScrollResult {
  const { threshold = 5, button = 0 } = options;

  const state = useRef<DragScrollState>({
    startX: 0,
    startScroll: 0,
    dragged: false,
    pointerId: null,
    captureEl: null,
  });

  // Stable move/up refs so document listeners can be added/removed by identity.
  const onMoveRef = useRef<(e: PointerEvent) => void>(() => {});
  const onUpRef = useRef<(e: PointerEvent) => void>(() => {});

  const onMove = useCallback(
    (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (state.current.pointerId !== null && e.pointerId !== state.current.pointerId) return;
      const dx = e.clientX - state.current.startX;
      if (Math.abs(dx) > threshold) {
        state.current.dragged = true;
      }
      if (state.current.dragged) {
        el.scrollLeft = state.current.startScroll - dx;
      }
    },
    [containerRef, threshold],
  );

  const detach = useCallback(() => {
    const { captureEl, pointerId } = state.current;
    if (captureEl) {
      captureEl.removeEventListener('pointermove', onMoveRef.current as EventListener);
      captureEl.removeEventListener('pointerup', onUpRef.current as EventListener);
      captureEl.removeEventListener('pointercancel', onUpRef.current as EventListener);
      if (pointerId !== null) {
        try {
          captureEl.releasePointerCapture?.(pointerId);
        } catch {
          // jsdom / already-released — ignore
        }
      }
    } else {
      document.removeEventListener('pointermove', onMoveRef.current);
      document.removeEventListener('pointerup', onUpRef.current);
      document.removeEventListener('pointercancel', onUpRef.current);
    }
    state.current.pointerId = null;
    state.current.captureEl = null;
  }, []);

  // Assign move/up handlers in an effect (never mutate refs during render).
  useEffect(() => {
    onMoveRef.current = onMove;
    onUpRef.current = (e: PointerEvent) => {
      if (state.current.pointerId !== null && e.pointerId !== state.current.pointerId) return;
      detach();
    };
  }, [onMove, detach]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      // Mouse: respect the configured button. Touch/pen: always engage.
      if (e.pointerType === 'mouse' && e.button !== button) return;
      // Never hijack a press that began on an interactive child.
      if ((e.target as HTMLElement).closest('button')) return;

      e.preventDefault();
      state.current.startX = e.clientX;
      state.current.startScroll = el.scrollLeft;
      state.current.dragged = false;
      state.current.pointerId = e.pointerId;

      // Capture on the strip element so move/up follow the finger off the
      // handle. Desktop surface passes the event from the container itself;
      // capturing there would eat per-key events, so we fall back to document
      // listeners when capture is unavailable or the target is the container.
      const target = e.currentTarget as HTMLElement;
      const canCapture =
        typeof target.setPointerCapture === 'function' && target !== el;
      if (canCapture) {
        try {
          target.setPointerCapture(e.pointerId);
          state.current.captureEl = target;
          target.addEventListener('pointermove', onMoveRef.current as EventListener);
          target.addEventListener('pointerup', onUpRef.current as EventListener);
          target.addEventListener('pointercancel', onUpRef.current as EventListener);
        } catch {
          state.current.captureEl = null;
        }
      }
      if (!state.current.captureEl) {
        document.addEventListener('pointermove', onMoveRef.current);
        document.addEventListener('pointerup', onUpRef.current);
        document.addEventListener('pointercancel', onUpRef.current);
      }
    },
    [containerRef, button],
  );

  // Detach any dangling listeners (element or document) on unmount.
  useEffect(() => {
    return () => detach();
  }, [detach]);

  const didDrag = useCallback(() => state.current.dragged, []);
  const consumeDragged = useCallback(() => {
    const d = state.current.dragged;
    state.current.dragged = false;
    return d;
  }, []);

  return { onPointerDown, didDrag, consumeDragged };
}
