import { useLayoutEffect, useRef } from 'react';
import { useDragScroll } from '../../hooks/useDragScroll.ts';
import { trackScrollEdges } from '../ui/edgeFade.ts';

interface ScrollStripProps {
  /** The horizontally-scrollable element this strip pans. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Accessible-name for the (visually decorative) handle's region. */
  label: string;
  /**
   * What the strip is for, written on it ("Slide here to scroll the keys"),
   * between a ‹ and a › that show only while there is more of the
   * instrument off that side. With nothing off either side the strip
   * hides (CSS). Without it the strip shows grip dots only.
   */
  hint?: string;
}

/**
 * Mobile-only drag handle that pans a scroll container horizontally.
 *
 * Why it exists: the instrument keys/frets carry `touch-action: none` so a
 * finger on a key fires a note instantly and never gets stolen by the browser's
 * scroll/tap arbitration (that arbitration was dropping notes — WS12). With the
 * surface no longer scrollable by touch, this strip is the dedicated place to
 * scroll to other octaves/positions. It complements (does not replace) the
 * octave buttons (piano) and position chips (fretboard).
 *
 * It owns its touch via `touch-action: none` and drives `container.scrollLeft`
 * manually through useDragScroll (pointer-captured on the strip so the drag
 * follows the finger off the handle). It MUST be `none`, not `pan-x`: pan-x
 * invites the browser to claim the horizontal gesture natively, which fires
 * pointercancel and starves our manual pointermove scrolling on real iOS —
 * while synthetic-event tests pass. Learned the hard way (WS12 hotfix).
 * Five grip dots alone did not say what the band was for (5 Nov eye
 * review), so the dock's piano and guitar write it on the strip (`hint`),
 * and its ‹ › say which way there is more (the edge fades' rule).
 * The strip is aria-hidden — keyboard and scrollbar users reach octaves via the
 * focusable container + on-screen controls, so nothing is lost for a11y.
 */
export function ScrollStrip({ containerRef, label, hint }: ScrollStripProps) {
  const { onPointerDown } = useDragScroll(containerRef, { threshold: 4 });
  const stripRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip || !hint) return;
    return trackScrollEdges(strip, () => containerRef.current);
  }, [containerRef, hint]);

  return (
    <div
      ref={stripRef}
      data-testid="scroll-strip"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      className={`w-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing${hint ? ' scroll-strip-hint' : ''}`}
      style={{
        height: 26,
        touchAction: 'none',
        backgroundColor: 'var(--card)',
        borderTop: '1px solid var(--border-subtle)',
      }}
      title={label}
    >
      {hint ? (
        <>
          <span className="scroll-strip-arrow" data-side="left">‹</span>
          <span className="text-caption scroll-strip-text">{hint}</span>
          <span className="scroll-strip-arrow" data-side="right">›</span>
        </>
      ) : (
        /* Grip dots — purely decorative affordance. */
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'var(--text-dim)',
                opacity: 0.55,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
