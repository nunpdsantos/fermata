/* eslint-disable no-restricted-syntax -- legacy instrument palette (key
   shadows, active/hover tints). Migration deferred: needs instrument-specific
   SURFACE tokens that don't overlap the app-wide palette. */
import { memo, useCallback, useEffect, useRef } from 'react';
import type { PianoKey as PianoKeyData } from '../../core/utils/pianoLayout.ts';
import { noteToString } from '../../core/types/music.ts';
import type { Note } from '../../core/types/music.ts';
import { writtenOctave } from '../../core/utils/degreeSpelling.ts';
import { useAppStore } from '../../state/store.ts';
import { ON_DEGREE } from '../../design/tokens/colors.ts';

type SizeMode = 'mobile' | 'tablet' | 'desktop';

const DIMS: Record<SizeMode, { white: [number, number]; black: [number, number]; labelSize: string }> = {
  // Key labels never go below the 12 px floor (D-28; were 10 / 9 / 8 px).
  desktop: { white: [44, 210], black: [28, 130], labelSize: '12px' },
  tablet:  { white: [36, 160], black: [22, 100], labelSize: '12px' },
  mobile:  { white: [36, 130], black: [22, 80],  labelSize: '12px' },
};

interface PianoKeyProps {
  keyData: PianoKeyData;
  /**
   * Context-aware spelling for the NAME printed on this key (chord/scale/key
   * aware). DISPLAY ONLY: the key's identity, black/white, position, octave
   * number and `isC` octave-anchor all stay on the physical `keyData.note`.
   * A pc-11 key spelled "C♭" is still the physical B (white) key in B's slot;
   * only the printed letters change. Defaults to `keyData.note` when omitted.
   */
  displayNote?: Note;
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
  /** `visible`: the focus came from the keyboard (:focus-visible). */
  onFocus?: (keyData: PianoKeyData, visible?: boolean) => void;
  /** Lit as the linked focus note (W11-B): an accent ring inside the key. */
  isFocusNote?: boolean;
  /** A real mouse entered (true) / left (false) the key. */
  onHover?: (keyData: PianoKeyData, on: boolean) => void;
  onKeyBlur?: () => void;
}

export const PianoKeyComponent = memo(function PianoKeyComponent({
  keyData,
  displayNote,
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
  isFocusNote = false,
  onHover,
  onKeyBlur,
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
  // Every theme (Day, Night, Auto) is a Fermata theme.
  const isFermata = useAppStore((s) => s.themeMode === 'fermata' || s.themeMode === 'fermata-night' || s.themeMode === 'auto');

  // Roving tabindex: when this key becomes the tab stop, take focus ONLY if the
  // user is already navigating the keyboard (focus is on another key of the
  // same piano). Focusing on mount stole focus and scrolled Explore ~300 px
  // down on load (design review / audit W2-03). The page never scrolls for it;
  // the key is brought into view within the keyboard's own scroller.
  useEffect(() => {
    const el = elementRef.current;
    if (!isFocused || !el || document.activeElement === el) return;
    const keyboard = el.closest('[role="group"]');
    const active = document.activeElement;
    if (!keyboard || !active || active === el || !keyboard.contains(active)) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
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

  const handleFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    onFocus?.(keyData, e.currentTarget.matches(':focus-visible'));
  }, [keyData, onFocus]);

  const handleBlur = useCallback(() => {
    onKeyBlur?.();
    if (isPressed.current) {
      isPressed.current = false;
      onNoteOff(keyData);
    }
  }, [keyData, onNoteOff, onKeyBlur]);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') onHover?.(keyData, true);
    },
    [keyData, onHover],
  );

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
      if (e.pointerType === 'mouse') onHover?.(keyData, false);
      e.preventDefault();
      if (isPressed.current) {
        isPressed.current = false;
        onNoteOff(keyData);
      }
    },
    [keyData, onNoteOff, isMobile, onHover]
  );

  // The printed name follows the context spelling; everything physical (octave,
  // black/white, position) stays on keyData.note.
  const spelled = displayNote ?? keyData.note;
  const label = noteToString(spelled);
  // The always-on "C{octave}" anchor shows only when the key is DISPLAYED as a
  // natural C. Basing this on the spelling (not the physical C) means a C♯-major
  // context, which respells pitch class 0 as B♯, correctly prints "B♯" on the
  // physical C key instead of a misleading "C". The octave NUMBER stays physical
  // (keyData.octave) per the octave-boundary decision — labels are letter +
  // accidental, never octave-shifted for B♯/C♭.
  const isC = spelled.natural === 'C' && spelled.accidental === '';
  // What a screen reader announces is a full pitch name, so its octave follows
  // the LETTER (scientific pitch): the physical C5 key spelled B♯ is "B♯4" —
  // "B♯5" would be a different, higher note (audit W1-17).
  const spokenName = `${label}${writtenOctave(spelled, keyData.octave)}`;
  const color = highlightColor ?? 'var(--accent)';

  if (keyData.isBlack) {
    const [bw, bh] = dims.black;
    let bg: string;
    let opacity = 1;
    let border = '1px solid var(--piano-border)';
    let shadow = 'var(--piano-black-shadow)';
    let transform = 'none';
    // A label on a BLACK key is light (the ivory colour): --piano-label is a
    // dark ink for the ivory keys and read 2.4–2.5:1 on black (W11-A review).
    let labelColor = 'var(--piano-white)';

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
      // Degree hue as a FILL with dark ink (D-28; white on the 53% tint read ~2:1).
      bg = color;
      border = `1.5px solid ${color}`;
      labelColor = ON_DEGREE;
    } else if (isDimmed) {
      bg = 'var(--piano-black)';
    } else if (isHighlighted) {
      if (isFermata) {
        // A full degree fill with dark ink: the old 60% mix under a light
        // label read 3.3:1 on the amber / emerald keys (D-28).
        bg = color;
        labelColor = ON_DEGREE;
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
        data-piano-key=""
        data-scale-note={isHighlighted || undefined}
        data-midi={keyData.midiNumber}
        aria-label={spokenName}
        aria-pressed={isActive}
        tabIndex={isFocused ? 0 : -1}
        data-focus-ring="custom"
        className="absolute z-10 cursor-pointer select-none touch-none"
        data-focus-note={isFocusNote || undefined}
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
        onPointerEnter={handlePointerEnter}
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
            boxShadow: isFocusNote ? `${shadow}, inset 0 0 0 3px var(--accent), 0 0 0 2px var(--accent)` : shadow,
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
    // Dark ink, not the degree hue as text (1.3–2.4:1, D-28).
    labelColor = ON_DEGREE;
  } else if (isDimmed) {
    bg = 'var(--piano-white)';
  } else if (isHighlighted) {
    if (isFermata) {
      bg = `color-mix(in srgb, ${color} 35%, var(--piano-white))`;
      // The tinted ivory is light in BOTH themes: dark ink (night --text was 1.3:1).
      labelColor = ON_DEGREE;
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
      data-piano-key=""
      data-scale-note={isHighlighted || undefined}
      data-midi={keyData.midiNumber}
      aria-label={spokenName}
      aria-pressed={isActive}
      tabIndex={isFocused ? 0 : -1}
      data-focus-ring="custom"
      className="relative shrink-0 cursor-pointer select-none touch-none"
      data-focus-note={isFocusNote || undefined}
      style={{
        width: ww,
        height: wh,
        backgroundColor: bg,
        opacity,
        borderRadius: '0 0 6px 6px',
        // Longhand sides (no top edge): mixing the border shorthand with
        // borderTop made React warn on every re-render that changed it.
        borderLeft: isFocused ? '2px solid var(--focus-ring)' : border,
        borderRight: isFocused ? '2px solid var(--focus-ring)' : border,
        borderBottom: isFocused ? '2px solid var(--focus-ring)' : border,
        borderTop: 'none',
        boxShadow: isFocusNote ? `${shadow}, inset 0 0 0 3px var(--accent)` : shadow,
        transform,
        transition: 'transform 0.05s, background-color 0.08s, opacity 0.15s, box-shadow 0.15s, border 0.1s',
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
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
