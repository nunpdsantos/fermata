import { memo, useCallback, useRef } from 'react';
import { noteToString } from '../../core/types/music.ts';
import type { Note } from '../../core/types/music.ts';
import type { FingerNumber } from '../../core/constants/guitarChordShapes.ts';
import { fingerLabel, readableTextOn } from './fretboardConstants.ts';
import type { PositionDot } from './fretboardConstants.ts';

interface FretCellProps {
  fret: number;
  stringIdx: number;
  /**
   * Context-aware spelling for the note name shown in this cell (chord/scale/key
   * aware). Letter + accidental only — the fretboard prints no octave number, so
   * a C♭/B♯ relabel never shifts anything. Positions, colours and pitch are
   * driven by `fret`/`stringIdx`/`color`, never by this label.
   */
  displayNote: Note;
  color: string | undefined;
  dotColor: string;
  isActive: boolean;
  isRoot: boolean;
  isMuted: boolean;
  fretMinWidth: number;
  isChordView: boolean;
  mobile?: boolean;
  // Voicing
  showVoicing: boolean;
  finger: FingerNumber | undefined;
  /** Classical-position dot for this cell (position view), if any. */
  positionDot?: PositionDot | null;
  // Scale dot (full fretboard)
  showScaleDot: boolean;
  /** Label for the full-neck scale dot (degree or note); defaults to the note name. */
  scaleDotLabel?: string;
  /** Plain highlight (exercise taps, chord tones in alternate tunings). */
  showHighlight?: boolean;
  // Keyboard navigation
  isFocused: boolean;
  onClick: () => void;
}

export const FretCell = memo(function FretCell({
  fret,
  stringIdx,
  displayNote,
  color,
  dotColor,
  isActive,
  isRoot,
  isMuted,
  fretMinWidth,
  isChordView,
  mobile = false,
  showVoicing,
  finger,
  positionDot = null,
  showScaleDot,
  scaleDotLabel,
  showHighlight = false,
  isFocused,
  onClick,
}: FretCellProps) {
  const noteLabel = noteToString(displayNote);
  const solidText = readableTextOn(dotColor);
  const dotData = (kind: string) => ({
    'data-dot': kind,
    'data-dot-string': stringIdx,
    'data-dot-fret': fret,
  });

  // Mobile fires on pointerdown for instant, scroll-arbitration-free triggering
  // (the cell carries touch-action:none, so a finger here never scrolls — the
  // scroll strip handles that). preventDefault on pointerdown suppresses the
  // compatibility click; firedFromPointer guards the rare browser that still
  // emits one, so a tap never double-fires. Desktop keeps onClick so the
  // container's drag-to-scroll click-suppression (onClickCapture) still works.
  const firedFromPointer = useRef(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!mobile) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault(); // suppress the synthetic click that would double-fire
      firedFromPointer.current = true;
      onClick();
    },
    [mobile, onClick],
  );

  const handleClick = useCallback(() => {
    if (firedFromPointer.current) {
      // The pointerdown already fired this cell; swallow the compat click.
      firedFromPointer.current = false;
      return;
    }
    onClick();
  }, [onClick]);

  const scaleLabel = scaleDotLabel ?? noteLabel;
  const scaleSolid = isActive || isRoot;

  return (
    <div
      data-fret={fret}
      data-string-row={stringIdx}
      role="button"
      aria-label={`${noteLabel}, fret ${fret}, string ${6 - stringIdx}`}
      aria-pressed={isActive}
      className="flex-1 flex items-center justify-center relative cursor-pointer"
      style={{
        minWidth: fretMinWidth,
        // Mobile: the cell owns its touch so a tap fires instantly and is never
        // arbitrated into a scroll (that arbitration dropped taps — WS12).
        ...(mobile ? { touchAction: 'none' } : undefined),
        ...(isFocused ? {
          outline: '2px solid var(--focus-ring)',
          outlineOffset: -2,
          borderRadius: 4,
        } : undefined),
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {/* String line */}
      <div
        className="absolute w-full"
        style={{
          height: 1 + (5 - stringIdx) * 0.3,
          backgroundColor: isMuted ? 'var(--border)' : 'var(--text-dim)',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      {/* Chord voicing dot */}
      {showVoicing && (
        <div
          {...dotData('voicing')}
          className="relative z-10 rounded-full flex items-center justify-center font-bold"
          style={{
            width: isChordView ? (mobile ? 30 : 26) : (mobile ? 26 : 22),
            height: isChordView ? (mobile ? 30 : 26) : (mobile ? 26 : 22),
            fontSize: finger && fingerLabel(finger) ? (isChordView ? (mobile ? 13 : 12) : (mobile ? 11 : 10)) : (mobile ? 11 : 10),
            backgroundColor: dotColor,
            color: solidText,
            boxShadow: isRoot
              ? `0 0 16px ${dotColor}aa, 0 0 6px ${dotColor}88`
              : `0 0 12px ${dotColor}88, 0 0 4px ${dotColor}66`,
            border: isRoot
              ? '3px solid #ffffff'
              : `2px solid ${dotColor}`,
          }}
        >
          {fingerLabel(finger) || noteLabel}
        </div>
      )}
      {/* Classical position dot */}
      {positionDot && (
        <div
          {...dotData('position')}
          title={positionDot.description}
          className="relative z-10 rounded-full flex items-center justify-center font-bold"
          style={{
            width: mobile ? 30 : 28,
            height: mobile ? 30 : 28,
            fontSize: mobile ? 13 : 12,
            backgroundColor: dotColor,
            color: solidText,
            boxShadow: positionDot.isRoot
              ? `0 0 16px ${dotColor}aa, 0 0 6px ${dotColor}88`
              : `0 0 10px ${dotColor}88`,
            border: positionDot.isRoot
              ? '3px solid #ffffff'
              : `2px solid ${dotColor}`,
            // A stretch (outside the 4-fret window) wears a dashed ring.
            ...(positionDot.isStretch ? { outline: '2px dashed var(--text)', outlineOffset: 1 } : undefined),
          }}
        >
          {positionDot.label}
          {positionDot.isEdited && (
            // Small corner mark: this is the learner's own fingering.
            <span
              aria-hidden="true"
              data-edited-mark
              className="absolute rounded-full"
              style={{ width: 7, height: 7, top: -1, right: -1, backgroundColor: 'var(--text)', border: '1px solid var(--bg)' }}
            />
          )}
        </div>
      )}
      {/* Plain highlight (exercise taps / chord tones without a shape) */}
      {showHighlight && !showVoicing && !positionDot && (
        <div
          {...dotData('highlight')}
          className="relative z-10 rounded-full flex items-center justify-center font-bold"
          style={{
            width: mobile ? 26 : 24,
            height: mobile ? 26 : 24,
            fontSize: mobile ? 11 : 10,
            backgroundColor: dotColor,
            color: solidText,
            border: isRoot ? '3px solid #ffffff' : `2px solid ${dotColor}`,
          }}
        >
          {noteLabel}
        </div>
      )}
      {/* Scale dot (no chord, whole-neck view) */}
      {showScaleDot && !showHighlight && (
        <div
          {...dotData('scale')}
          className="relative z-10 rounded-full flex items-center justify-center font-bold transition-all"
          style={{
            width: scaleSolid ? (mobile ? 26 : 24) : (mobile ? 24 : 22),
            height: scaleSolid ? (mobile ? 26 : 24) : (mobile ? 24 : 22),
            fontSize: mobile ? 11 : 10,
            backgroundColor: scaleSolid ? color : `${color}30`,
            // Non-root dots keep the pale tint but print their label in the
            // body text colour — ≥ 4.5:1 in both themes (audit W3-14; the old
            // label was the degree colour on its own tint, ~1.5:1).
            color: scaleSolid ? readableTextOn(color ?? '') : 'var(--text)',
            border: scaleSolid ? 'none' : `1.5px solid ${color}`,
            transform: isActive ? 'scale(1.2)' : 'scale(1)',
            boxShadow: isActive ? `0 0 12px ${color}, 0 0 4px ${color}88` : 'none',
          }}
        >
          {scaleLabel}
        </div>
      )}
    </div>
  );
});
