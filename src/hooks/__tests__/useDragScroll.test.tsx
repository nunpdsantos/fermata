import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useDragScroll } from '../useDragScroll';

// ---------------------------------------------------------------------------
// Harness: a scroll container + a drag handle that drives it.
// `captureMode` toggles whether the handle exposes setPointerCapture (Safari)
// or not (jsdom default) — exercising both code paths.
// ---------------------------------------------------------------------------

function makePointer(
  type: string,
  init: Partial<PointerEventInit> & { clientX?: number; pointerId?: number },
): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: init.pointerId ?? 1,
    button: init.button ?? 0,
    pointerType: init.pointerType ?? 'touch',
    clientX: init.clientX ?? 0,
    ...init,
  });
}

interface HarnessProps {
  threshold?: number;
  onClickStrip?: () => void;
}

function Harness({ threshold, onClickStrip }: HarnessProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { onPointerDown, consumeDragged } = useDragScroll(containerRef, { threshold });
  return (
    <div>
      <div ref={containerRef} data-testid="container" style={{ overflowX: 'auto' }}>
        <div style={{ width: 2000 }}>content</div>
      </div>
      <div
        data-testid="strip"
        onPointerDown={onPointerDown}
        onClickCapture={() => {
          if (consumeDragged()) return; // suppressed after drag
          onClickStrip?.();
        }}
      >
        strip
      </div>
    </div>
  );
}

beforeEach(() => {
  // jsdom doesn't implement these; default off so we exercise the document path.
  // Individual tests stub them on the element when testing capture.
  delete (HTMLElement.prototype as unknown as { setPointerCapture?: unknown }).setPointerCapture;
  delete (HTMLElement.prototype as unknown as { releasePointerCapture?: unknown }).releasePointerCapture;
});

afterEach(cleanup);

describe('useDragScroll', () => {
  it('drags past threshold update container.scrollLeft (document path)', () => {
    const { getByTestId } = render(<Harness threshold={5} />);
    const container = getByTestId('container');
    const strip = getByTestId('strip');

    // Start at scrollLeft 100
    container.scrollLeft = 100;

    fireEvent(strip, makePointer('pointerdown', { clientX: 200, pointerId: 1 }));
    // Move left by 60px -> scrollLeft should grow by 60 (start - dx)
    fireEvent(document, makePointer('pointermove', { clientX: 140, pointerId: 1 }));

    expect(container.scrollLeft).toBe(160);

    fireEvent(document, makePointer('pointerup', { clientX: 140, pointerId: 1 }));
    // After up, further moves do nothing
    fireEvent(document, makePointer('pointermove', { clientX: 0, pointerId: 1 }));
    expect(container.scrollLeft).toBe(160);
  });

  it('does NOT scroll for sub-threshold movement', () => {
    const { getByTestId } = render(<Harness threshold={8} />);
    const container = getByTestId('container');
    const strip = getByTestId('strip');
    container.scrollLeft = 50;

    fireEvent(strip, makePointer('pointerdown', { clientX: 100, pointerId: 1 }));
    // Move 4px — below the 8px threshold
    fireEvent(document, makePointer('pointermove', { clientX: 96, pointerId: 1 }));
    expect(container.scrollLeft).toBe(50);
  });

  it('suppresses the click that follows a drag, allows a clean tap through', () => {
    const onClickStrip = vi.fn();
    const { getByTestId } = render(<Harness threshold={5} onClickStrip={onClickStrip} />);
    const container = getByTestId('container');
    const strip = getByTestId('strip');
    container.scrollLeft = 0;

    // --- Drag, then click: click is suppressed ---
    fireEvent(strip, makePointer('pointerdown', { clientX: 100, pointerId: 1 }));
    fireEvent(document, makePointer('pointermove', { clientX: 40, pointerId: 1 }));
    fireEvent(document, makePointer('pointerup', { clientX: 40, pointerId: 1 }));
    fireEvent.click(strip);
    expect(onClickStrip).not.toHaveBeenCalled();

    // --- Clean tap (no drag): click goes through ---
    fireEvent(strip, makePointer('pointerdown', { clientX: 100, pointerId: 2 }));
    fireEvent(document, makePointer('pointerup', { clientX: 100, pointerId: 2 }));
    fireEvent.click(strip);
    expect(onClickStrip).toHaveBeenCalledTimes(1);
  });

  it('ignores non-primary mouse buttons but engages touch', () => {
    const { getByTestId } = render(<Harness threshold={5} />);
    const container = getByTestId('container');
    const strip = getByTestId('strip');
    container.scrollLeft = 0;

    // Right mouse button — ignored
    fireEvent(
      strip,
      makePointer('pointerdown', { clientX: 100, pointerId: 1, pointerType: 'mouse', button: 2 }),
    );
    fireEvent(document, makePointer('pointermove', { clientX: 40, pointerId: 1, pointerType: 'mouse' }));
    expect(container.scrollLeft).toBe(0);
  });

  it('uses pointer capture on the handle when available (Safari path)', () => {
    const captured: number[] = [];
    const released: number[] = [];
    (HTMLElement.prototype as unknown as { setPointerCapture: (id: number) => void }).setPointerCapture = function (id: number) {
      captured.push(id);
    };
    (HTMLElement.prototype as unknown as { releasePointerCapture: (id: number) => void }).releasePointerCapture = function (id: number) {
      released.push(id);
    };

    const { getByTestId } = render(<Harness threshold={5} />);
    const container = getByTestId('container');
    const strip = getByTestId('strip');
    container.scrollLeft = 0;

    fireEvent(strip, makePointer('pointerdown', { clientX: 100, pointerId: 7 }));
    expect(captured).toContain(7);

    // With capture, move/up are delivered to the captured ELEMENT, not document.
    fireEvent(strip, makePointer('pointermove', { clientX: 40, pointerId: 7 }));
    expect(container.scrollLeft).toBe(60);

    fireEvent(strip, makePointer('pointerup', { clientX: 40, pointerId: 7 }));
    expect(released).toContain(7);
  });

  it('ignores move events from a different pointerId (multi-touch isolation)', () => {
    const { getByTestId } = render(<Harness threshold={5} />);
    const container = getByTestId('container');
    const strip = getByTestId('strip');
    container.scrollLeft = 0;

    fireEvent(strip, makePointer('pointerdown', { clientX: 100, pointerId: 1 }));
    // A different finger's move should be ignored
    fireEvent(document, makePointer('pointermove', { clientX: 0, pointerId: 99 }));
    expect(container.scrollLeft).toBe(0);
    // The owning pointer still drives it
    fireEvent(document, makePointer('pointermove', { clientX: 40, pointerId: 1 }));
    expect(container.scrollLeft).toBe(60);
  });
});
