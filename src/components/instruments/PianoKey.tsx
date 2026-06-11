/* eslint-disable no-restricted-syntax -- legacy instrument palette (key
   shadows, active/hover tints). Migration deferred: needs instrument-specific
   SURFACE tokens that don't overlap the app-wide palette. */
import { memo, useCallback, useEffect, useRef } from 'react';
import type { PianoKey as PianoKeyData } from '../../core/utils/pianoLayout.ts';
import { noteToString } from '../../core/types/music.ts';
import { useAppStore } from '../../state/store.ts';

type SizeMode = 'mobile' | 'tablet' | 'desktop';

const DIMS: Record<SizeMode, { white: [number, number]; black: [number, number]; labelSize: string }> = {
  desktop: { white: [44, 210], black: [28, 130], labelSize: '10px' },
  tablet:  { white: [36, 160], black: [22, 100], labelSize: '9px' },
  mobile:  { white: [36, 130], black: [22, 80],  labelSize: '8px' },
};

interface PianoKeyProps {
  keyData: PianoKeyData;
  isHighlighted: boolean;
  highlightColor?: string;
  isActive: boolean;
  isChordTone: boolean;
  isVoicingNote: boolean;
  isDimmed: boolean;
  onNoteOn: (keyData: PianoKeyData) => void;
  onNoteOff: (keyData: PianoKeyData) => void;
  showLabel: boolean;
  sizeMode?: SizeMode;
  isFocused?: boolean;
  onKeyDown?: (e: React.KeyboardEvent, keyData: PianoKeyData) => void;
  onKeyUp?: (e: React.KeyboardEvent, keyData: PianoKeyData) => void;
  onFocus?: (keyData: PianoKeyData) => void;
}

export const PianoKeyComponent = memo(function PianoKeyComponent({
  keyData,
  isHighlighted,
  highlightColor,
  isActive,
  isChordTone,
  isVoicingNote,
  isDimmed,
  onNoteOn,
  onNoteOff,
  showLabel,
  sizeMode = 'desktop',
  isFocused = false,
  onKeyDown,
  onKeyUp,
  onFocus,
}: PianoKeyProps) {
  const isMobile = sizeMode === 'mobile';

  // Two input models, deliberately separate:
  //
  //  • DESKTOP + keyboard (Enter/Space): a single `isPressed` boolean, fired
  //    unconditionally on press, released on up/leave/blur — IDENTICAL to the
  //    pre-WS12 behaviour. Desktop note-OFF is owned by the Piano container
  //    (it captures the pointer for drag-to-scroll), so the key's own up rarely
  //    fires; gating note-on behind a long-lived "is it on?" ref would desync
  //    and silence the second press. Unconditional fire is correct here.
  //
  //  • MOBILE touch: per-pointerId tracking in `touchPointers`, so a chord of
  //    fingers across keys plays them all and releasing one finger releases
  //    only its key. The key captures its pointer, so its up/cancel always
  //    lands here (a finger sliding off releases THIS key, no neighbour
  //    retrigger — v1 choice). noteOn fires when the set goes 0→1, noteOff when
  //    it returns to 0, so two fingers on one key never double-fire.
  const isPressed = useRef(false);
  const touchPointers = useRef<Set<number>>(new Set());
  const touchNoteOn = useRef(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const dims = DIMS[sizeMode];

  const refreshTouchNote = useCallback(() => {
    const desired = touchPointers.current.size > 0;
    if (desired && !touchNoteOn.current) {
      touchNoteOn.current = true;
      onNoteOn(keyData);
    } else if (!desired && touchNoteOn.current) {
      touchNoteOn.current = false;
      onNoteOff(keyData);
    }
  }, [keyData, onNoteOn, onNoteOff]);
  // Fermata theme: solid colour fills on white keys destroy the white/black
  // hierarchy because the warm walnut accent looks like a black key. Switch to
  // a soft top-tint so the key still reads as white while the colour signals
  // "in scale".
  const isFermata = useAppStore((s) => s.themeMode === 'fermata' || s.themeMode === 'fermata-night');

  useEffect(() => {
    if (isFocused && elementRef.current && document.activeElement !== elementRef.current) {
      elementRef.current.focus({ preventScroll: false });
    }
  }, [isFocused]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        if (!isPressed.current) {
          isPressed.current = true;
          onNoteOn(keyData);
        }
      }
      onKeyDown?.(e, keyData);
    },
    [keyData, onNoteOn, onKeyDown],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && isPressed.current) {
        isPressed.current = false;
        onNoteOff(keyData);
      }
      onKeyUp?.(e, keyData);
    },
    [keyData, onNoteOff, onKeyUp],
  );

  const handleFocus = useCallback(() => {
    onFocus?.(keyData);
  }, [keyData, onFocus]);

  const handleBlur = useCallback(() => {
    if (isPressed.current) {
      isPressed.current = false;
      onNoteOff(keyData);
    }
  }, [keyData, onNoteOff]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile) {
        // Own the touch: capture so this pointer's up/cancel always lands here
        // even if the finger slides off the key. Guarded — jsdom lacks capture.
        e.preventDefault();
        try {
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        } catch {
          // capture unsupported (jsdom) — pointerup still arrives here
        }
        touchPointers.current.add(e.pointerId);
        refreshTouchNote();
        return;
      }
      // Desktop: unconditional note-on (matches pre-WS12); container owns drag.
      e.preventDefault();
      isPressed.current = true;
      onNoteOn(keyData);
    },
    [keyData, onNoteOn, refreshTouchNote, isMobile]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile) {
        touchPointers.current.delete(e.pointerId);
        refreshTouchNote();
        return;
      }
      e.preventDefault();
      if (isPressed.current) {
        isPressed.current = false;
        onNoteOff(keyData);
      }
    },
    [keyData, onNoteOff, refreshTouchNote, isMobile]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      // Mobile: the pointer is captured, so a finger sliding off the key does
      // NOT release via leave — it releases on this key's pointerup/cancel
      // (v1: no cross-key slide retriggering). Leave is a no-op on touch.
      if (isMobile) return;
      // Desktop: the mouse leaving a pressed key releases that note.
      e.preventDefault();
      if (isPressed.current) {
        isPressed.current = false;
        onNoteOff(keyData);
      }
    },
    [keyData, onNoteOff, isMobile]
  );

  const label = noteToString(keyData.note);
  const isC = keyData.note.natural === 'C' && keyData.note.accidental === '';
  const color = highlightColor ?? 'var(--accent)';

  if (keyData.isBlack) {
    const [bw, bh] = dims.black;
    let bg: string;
    let opacity = 1;
    let border = '1px solid var(--piano-border)';
    let shadow = 'var(--piano-black-shadow)';
    let transform = 'none';
    let labelColor = 'var(--piano-label)';

    if (isActive) {
      bg = color;
      shadow = `inset 0 -2px 4px rgba(0,0,0,0.3), 0 0 8px ${color}66`;
      transform = 'translateY(1px)';
      labelColor = '#000';
    } else if (isVoicingNote) {
      bg = color;
      border = `2px solid #fff`;
      shadow = `0 0 16px ${color}, 0 0 6px ${color}88`;
      transform = 'translateY(2px)';
      labelColor = '#000';
    } else if (isChordTone) {
      bg = `${color}88`;
      border = `1.5px solid ${color}`;
      labelColor = '#fff';
    } else if (isDimmed) {
      bg = 'var(--piano-black)';
    } else if (isHighlighted) {
      if (isFermata) {
        bg = `color-mix(in srgb, ${color} 60%, var(--piano-black))`;
        labelColor = 'var(--piano-white)';
      } else {
        bg = color;
        opacity = 0.8;
        labelColor = '#000';
      }
    } else {
      bg = 'var(--piano-black)';
    }

    // On mobile, add invisible padding around black keys for larger touch area
    const touchPad = sizeMode === 'mobile' ? 4 : 0;

    return (
      <div
        ref={elementRef}
        role="button"
        aria-label={`${label}${keyData.octave}`}
        aria-pressed={isActive}
        tabIndex={isFocused ? 0 : -1}
        data-focus-ring="custom"
        className="absolute z-10 cursor-pointer select-none touch-none"
        style={{
          width: bw + touchPad * 2,
          height: bh + touchPad,
          padding: touchPad ? `0 ${touchPad}px ${touchPad}px` : undefined,
          left: -touchPad,
          outline: isFocused ? '2px solid var(--focus-ring)' : 'none',
          outlineOffset: 2,
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div
          style={{
            width: bw,
            height: bh,
            backgroundColor: bg,
            opacity,
            borderRadius: '0 0 4px 4px',
            border,
            boxShadow: shadow,
            transform,
            transition: 'transform 0.05s, background-color 0.08s, opacity 0.15s, box-shadow 0.15s, border 0.1s',
            position: 'relative',
          }}
        >
          {showLabel && (isHighlighted || isChordTone || isVoicingNote) && (
            <span
              className="absolute bottom-1 left-1/2 -translate-x-1/2 font-bold"
              style={{ color: labelColor, fontSize: dims.labelSize }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    );
  }

  // White key
  const [ww, wh] = dims.white;
  let bg: string;
  let opacity = 1;
  let border = '1px solid var(--piano-border)';
  let shadow = 'var(--piano-white-shadow)';
  let transform = 'none';
  let labelColor = 'var(--piano-label)';

  if (isActive) {
    bg = color;
    shadow = `inset 0 -2px 6px rgba(0,0,0,0.15), 0 0 10px ${color}66`;
    transform = 'translateY(1px)';
    labelColor = '#000';
  } else if (isVoicingNote) {
    bg = color;
    border = `3px solid #fff`;
    shadow = `0 0 20px ${color}, 0 0 8px ${color}88`;
    transform = 'translateY(2px)';
    labelColor = '#000';
  } else if (isChordTone) {
    bg = `${color}33`;
    border = `2px solid ${color}88`;
    labelColor = color;
  } else if (isDimmed) {
    bg = 'var(--piano-white)';
  } else if (isHighlighted) {
    if (isFermata) {
      bg = `color-mix(in srgb, ${color} 35%, var(--piano-white))`;
      labelColor = 'var(--text)';
    } else {
      bg = color;
      opacity = 0.7;
      labelColor = '#000';
    }
  } else {
    bg = 'var(--piano-white)';
  }

  return (
    <div
      ref={elementRef}
      role="button"
      aria-label={`${label}${keyData.octave}`}
      aria-pressed={isActive}
      tabIndex={isFocused ? 0 : -1}
      data-focus-ring="custom"
      className="relative shrink-0 cursor-pointer select-none touch-none"
      style={{
        width: ww,
        height: wh,
        backgroundColor: bg,
        opacity,
        borderRadius: '0 0 6px 6px',
        border: isFocused ? '2px solid var(--focus-ring)' : border,
        borderTop: 'none',
        boxShadow: shadow,
        transform,
        transition: 'transform 0.05s, background-color 0.08s, opacity 0.15s, box-shadow 0.15s, border 0.1s',
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span
        className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold"
        style={{ color: labelColor, fontSize: dims.labelSize }}
      >
        {showLabel && (isC ? `C${keyData.octave}` : (isHighlighted || isChordTone || isVoicingNote) ? label : '')}
      </span>
    </div>
  );
});
