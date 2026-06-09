/* eslint-disable no-restricted-syntax -- legacy instrument palette (string
   shading, muted/active markers). Migration deferred alongside PianoKey. */
import { memo } from 'react';
import { noteToString } from '../../core/types/music.ts';
import type { PitchedNote } from '../../core/types/music.ts';
import type { ChordShape, FingerNumber } from '../../core/constants/guitarChordShapes.ts';
import type { GuitarTuning } from '../../core/constants/guitarTunings.ts';
import { midiToNote } from '../../core/utils/pianoLayout.ts';
import { FretCell } from './FretCell.tsx';
import type { FretNote } from './fretboardConstants.ts';

interface FretboardStringProps {
  stringIdx: number;
  visibleFrets: number[];
  fretMinWidth: number;
  mobile: boolean;
  isChordView: boolean;
  isOpenPosition: boolean;
  // Data
  tuning: GuitarTuning;
  tuningPitchClasses: number[];
  activeNotes: Set<number>;
  rootPitchClass: number | null;
  // Lookups
  getNoteColor: (note: PitchedNote) => string | undefined;
  getFretNote: (stringIndex: number, fret: number) => FretNote;
  handleFretClick: (fn: FretNote) => void;
  // Chord
  currentShape: { shape: ChordShape; baseFret: number } | null;
  voicingLookup: Map<number, { fret: number; finger: FingerNumber | undefined } | null>;
  // Scale position
  currentScalePos: { baseFret: number } | null;
  scalePositionLookup: Map<number, { fret: number; degree: string; finger?: number; isRoot?: boolean }[]>;
  // Keyboard navigation
  focusedFret: number | null;
}

export const FretboardString = memo(function FretboardString({
  stringIdx,
  visibleFrets,
  fretMinWidth,
  mobile,
  isChordView,
  isOpenPosition,
  tuning,
  tuningPitchClasses,
  activeNotes,
  rootPitchClass,
  getNoteColor,
  getFretNote,
  handleFretClick,
  currentShape,
  voicingLookup,
  currentScalePos,
  scalePositionLookup,
  focusedFret,
}: FretboardStringProps) {
  const openLabel = noteToString(tuning.strings[stringIdx]);
  const openFretNote = getFretNote(stringIdx, 0);
  const openPitched = midiToNote(openFretNote.midiNumber);
  const openColor = getNoteColor(openPitched);
  const isOpenActive = activeNotes.has(openFretNote.midiNumber);
  const openPc = tuningPitchClasses[stringIdx] % 12;
  const isOpenRoot = rootPitchClass !== null && openPc === rootPitchClass;

  // Chord voicing info
  const voicingInfo = voicingLookup.get(stringIdx);
  const isMuted = currentShape !== null && voicingInfo === null;
  const isOpenVoicing =
    currentShape !== null &&
    voicingInfo !== undefined &&
    voicingInfo !== null &&
    voicingInfo.fret === 0;

  // Scale position notes for this string
  const scalePosNotes = scalePositionLookup.get(stringIdx);

  return (
    <div className="flex items-center" style={{ height: mobile ? 32 : (isChordView ? 30 : 28) }}>
      {/* String label */}
      <div
        className="text-right pr-2 text-[10px] font-mono"
        style={{ width: 32, color: isMuted ? 'var(--text-dim)' : 'var(--text-muted)' }}
      >
        {openLabel}
      </div>

      {/* Fretboard area */}
      <div className="flex flex-1 self-stretch items-stretch">
        {visibleFrets.map((fret) => {
          const fn = getFretNote(stringIdx, fret);
          const pitched = midiToNote(fn.midiNumber);
          const color = getNoteColor(pitched);
          const isActive = activeNotes.has(fn.midiNumber);
          const isInScale = color !== undefined;

          // Chord voicing position
          const isVoicingPosition =
            voicingInfo !== undefined && voicingInfo !== null && voicingInfo.fret === fret;
          const finger = isVoicingPosition ? voicingInfo.finger : undefined;

          // Scale position note at this fret
          const scalePosNote = scalePosNotes?.find((n) => n.fret === fret);
          const isScalePosNote = !!scalePosNote;

          // What to show
          const showVoicing = isVoicingPosition;
          const showScalePos = !currentShape && isScalePosNote;
          const showScaleDot = !currentShape && !currentScalePos && isInScale;

          const dotColor = color ?? 'var(--accent)';
          const isRoot = rootPitchClass !== null && fn.pitchClass === rootPitchClass;

          return (
            <FretCell
              key={fret}
              fret={fret}
              stringIdx={stringIdx}
              pitched={pitched}
              color={color}
              dotColor={dotColor}
              isActive={isActive}
              isRoot={isRoot}
              isMuted={isMuted}
              fretMinWidth={fretMinWidth}
              isChordView={isChordView}
              mobile={mobile}
              showVoicing={showVoicing}
              finger={finger}
              showScalePos={showScalePos}
              scalePosIsRoot={scalePosNote?.isRoot}
              scalePosDegree={scalePosNote?.degree}
              showScaleDot={showScaleDot}
              isFocused={focusedFret === fret}
              onClick={() => handleFretClick(fn)}
            />
          );
        })}
      </div>

      {/* Nut */}
      <div
        style={{
          width: !isChordView || isOpenPosition ? 6 : 2,
          backgroundColor: !isChordView || isOpenPosition ? 'var(--text-muted)' : 'var(--border)',
          height: '100%',
        }}
      />

      {/* Open string / muted indicator */}
      <div
        role="button"
        aria-label={isMuted ? `String ${6 - stringIdx} muted` : `${openLabel} open string`}
        className="flex items-center justify-center cursor-pointer"
        style={{ width: 40 }}
        onClick={() => !isMuted && handleFretClick(openFretNote)}
      >
        {isMuted ? (
          <span className="font-bold" style={{ fontSize: 14, color: '#ef4444aa' }}>
            ✕
          </span>
        ) : isOpenVoicing ? (
          <div
            className="rounded-full flex items-center justify-center font-bold"
            style={{
              width: isChordView ? 22 : 20,
              height: isChordView ? 22 : 20,
              fontSize: 9,
              backgroundColor: openColor ?? 'var(--accent)',
              color: '#000',
              boxShadow: isOpenRoot
                ? `0 0 16px ${(openColor ?? 'var(--accent)')}aa, 0 0 6px ${(openColor ?? 'var(--accent)')}88`
                : `0 0 10px ${(openColor ?? 'var(--accent)')}88`,
              border: isOpenRoot
                ? '3px solid #ffffff'
                : `2px solid ${openColor ?? 'var(--accent)'}`,
            }}
          >
            {openLabel}
          </div>
        ) : openColor && !currentShape ? (
          <div
            className="rounded-full flex items-center justify-center font-bold"
            style={{
              width: 20,
              height: 20,
              fontSize: 8,
              backgroundColor: isOpenActive ? openColor : `${openColor}cc`,
              color: '#000',
              transform: isOpenActive ? 'scale(1.15)' : 'scale(1)',
              boxShadow: isOpenActive ? `0 0 8px ${openColor}` : 'none',
            }}
          >
            {openLabel}
          </div>
        ) : (
          <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{openLabel}</span>
        )}
      </div>
    </div>
  );
});
