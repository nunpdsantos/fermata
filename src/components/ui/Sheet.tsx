import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ScrollBody } from './ScrollBody';
import { IconButton } from './Button';
import { focusableIn, trapTab } from './focus';

/**
 * SHEET (design system v2, D-28) — a modal panel: a bottom sheet on phones
 * (drag the handle down, tap the scrim, press Escape or the ✕ to close), a
 * panel under the top bar on wider screens. It traps Tab, moves focus into
 * itself on open and RETURNS focus to whatever opened it on close.
 *
 * The non-modal, resizable sheet with detents (the phone instrument dock) is
 * DetentSheet.
 */
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  closeLabel: string;
  children: ReactNode;
  /** Primary decisions stay outside the scrolling body. */
  actions?: ReactNode;
  /** data-testid on the dialog. */
  testId?: string;
  /**
   * Room inside the dialog for a non-modal tool that must stay in reach
   * while this sheet is open (wave 3: the metronome's bar over the guitar
   * practice sheet, practising to a click being the point). Whatever is
   * portalled into it is above the scrim, in the sheet's Tab cycle and in
   * its screen-reader content. Empty, it renders no box.
   */
  companions?: boolean;
}

const DISMISS_DRAG_PX = 96;

export function Sheet({ open, onClose, title, closeLabel, children, actions, testId, companions }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const [dragY, setDragY] = useState(0);
  const drag = useRef<{ startY: number; pointer: number } | null>(null);

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    if (panel) (focusableIn(panel)[0] ?? panel).focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      } else if (panel) {
        trapTab(e, panel);
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (returnTo && returnTo.isConnected) returnTo.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="sheet-root" data-sheet-root="">
      <div className="sheet-scrim" aria-hidden="true" onClick={() => onCloseRef.current()} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-testid={testId}
        className="sheet-panel"
        style={dragY > 0 ? { transform: `translateY(${dragY}px)` } : undefined}
      >
        <div
          className="sheet-grab"
          aria-hidden="true"
          onPointerDown={(e) => {
            drag.current = { startY: e.clientY, pointer: e.pointerId };
            e.currentTarget.setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (drag.current?.pointer !== e.pointerId) return;
            setDragY(Math.max(0, e.clientY - drag.current.startY));
          }}
          onPointerUp={(e) => {
            if (drag.current?.pointer !== e.pointerId) return;
            const dy = e.clientY - drag.current.startY;
            drag.current = null;
            setDragY(0);
            if (dy > DISMISS_DRAG_PX) onCloseRef.current();
          }}
          onPointerCancel={() => {
            drag.current = null;
            setDragY(0);
          }}
        >
          <span className="sheet-grip" />
        </div>
        <div className="sheet-heading flex items-center justify-between gap-3 mb-1">
          <h2 id={titleId} className="text-title font-semibold" style={{ color: 'var(--text)' }}>
            {title}
          </h2>
          <IconButton
            aria-label={closeLabel}
            onClick={() => onCloseRef.current()}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            }
          />
        </div>
        <ScrollBody>{children}</ScrollBody>
        {actions && <div className="sheet-actions">{actions}</div>}
        {companions && <div className="sheet-companions" data-sheet-companions="" />}
      </div>
    </div>,
    document.body,
  );
}
