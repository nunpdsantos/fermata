/* eslint-disable no-restricted-syntax -- legacy instrument palette (fret
   marker outlines, contrast borders). Migration deferred alongside
   PianoKey — needs instrument-specific SURFACE tokens. */
import { memo, useCallback, useRef } from 'react';
import { noteToString } from '../../core/types/music.ts';
import type { PitchedNote } from '../../core/types/music.ts';
import type { FingerNumber } from '../../core/constants/guitarChordShapes.ts';
import { fingerLabel } from './fretboardConstants.ts';

interface FretCellProps {
  fret: number;
  stringIdx: number;
  pitched: PitchedNote;
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
  // Scale position
  showScalePos: boolean;
  scalePosIsRoot: boolean | undefined;
  scalePosDegree: string | undefined;
  // Scale dot (full fretboard)
  showScaleDot: boolean;
  // Keyboard navigation
  isFocused: boolean;
  onClick: () => void;
}

export const FretCell = memo(function FretCell({
  fret,
  stringIdx,
  pitched,
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
  showScalePos,
  scalePosIsRoot,
  scalePosDegree,
  showScaleDot,
  isFocused,
  onClick,
}: FretCellProps) {
  const noteLabel = noteToString(pitched);

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
          className="relative z-10 rounded-full flex items-center justify-center font-bold"
          style={{
            width: isChordView ? (mobile ? 30 : 26) : (mobile ? 26 : 22),
            height: isChordView ? (mobile ? 30 : 26) : (mobile ? 26 : 22),
            fontSize: finger && fingerLabel(finger) ? (isChordView ? (mobile ? 13 : 12) : (mobile ? 11 : 10)) : (mobile ? 10 : 9),
            backgroundColor: dotColor,
            color: '#000',
            boxShadow: isRoot
              ? `0 0 16px ${dotColor}aa, 0 0 6px ${dotColor}88`
              : `0 0 12px ${dotColor}88, 0 0 4px ${dotColor}66`,
            border: isRoot
              ? '3px solid #ffffff'
              : `2px solid ${dotColor}`,
          }}
        >
          {fingerLabel(finger) || noteToString(pitched)}
        </div>
      )}
      {/* Scale position dot */}
      {showScalePos && (
        <div
          className="relative z-10 rounded-full flex items-center justify-center font-bold"
          style={{
            width: mobile ? 28 : 24,
            height: mobile ? 28 : 24,
            fontSize: mobile ? 10 : 9,
            backgroundColor: dotColor,
            color: '#000',
            boxShadow: scalePosIsRoot
              ? `0 0 16px ${dotColor}aa, 0 0 6px ${dotColor}88`
              : `0 0 10px ${dotColor}88`,
            border: scalePosIsRoot
              ? '3px solid #ffffff'
              : `2px solid ${dotColor}`,
          }}
        >
          {scalePosDegree ?? noteToString(pitched)}
        </div>
      )}
      {/* Scale dot (no chord, no position selected) */}
      {showScaleDot && (
        <div
          className="relative z-10 rounded-full flex items-center justify-center font-bold transition-all"
          style={{
            width: isActive ? (mobile ? 24 : 20) : isRoot ? (mobile ? 24 : 20) : (mobile ? 20 : 16),
            height: isActive ? (mobile ? 24 : 20) : isRoot ? (mobile ? 24 : 20) : (mobile ? 20 : 16),
            fontSize: isActive || isRoot ? (mobile ? 9 : 8) : (mobile ? 8 : 7),
            backgroundColor: isActive ? color : isRoot ? color : `${color}30`,
            color: isActive || isRoot ? '#000' : color ?? 'var(--text)',
            border: isActive || isRoot ? 'none' : `1.5px solid ${color}88`,
            transform: isActive ? 'scale(1.2)' : 'scale(1)',
            boxShadow: isActive ? `0 0 12px ${color}, 0 0 4px ${color}88` : 'none',
          }}
        >
          {noteToString(pitched)}
        </div>
      )}
    </div>
  );
});
