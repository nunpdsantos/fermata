/* eslint-disable no-restricted-syntax -- legacy instrument palette (string
   shading, muted/active markers). Migration deferred alongside PianoKey. */
import { memo, useRef } from 'react';
import { noteToString } from '../../core/types/music.ts';
import type { Note, PitchedNote } from '../../core/types/music.ts';
import type { ChordShape, FingerNumber } from '../../core/constants/guitarChordShapes.ts';
import { midiToNote } from '../../core/utils/pianoLayout.ts';
import { FretCell } from './FretCell.tsx';
import { readableTextOn, ACCENT_FILL } from './fretboardConstants.ts';
import type { FretNote, PositionDot } from './fretboardConstants.ts';

/**
 * What the board is showing:
 *  - 'chord'     a chord shape (standard tuning)
 *  - 'position'  a classical scale position (Open, I–XII)
 *  - 'scale'     the scale on the whole neck ("All")
 *  - 'highlight' plain pitch-class highlights: exercise taps (W3-04) or the
 *                chord's notes when no shape exists (alternate tunings, W3-05)
 */
export type FretboardMode = 'chord' | 'position' | 'scale' | 'highlight';

interface FretboardStringProps {
  stringIdx: number;
  visibleFrets: number[];
  fretMinWidth: number;
  mobile: boolean;
  isChordView: boolean;
  /** The lowest visible fret is the 1st, so the nut is drawn thick. */
  atNut: boolean;
  mode: FretboardMode;
  /** The tuning's name for this string — never re-spelled by key (W1-16). */
  stringName: string;
  // Data
  activeNotes: Set<number>;
  rootPitchClass: number | null;
  // Lookups
  getNoteColor: (note: PitchedNote) => string | undefined;
  /** Context-aware enharmonic spelling for a pitch class — display label only. */
  spellPitchClass: (pc: number) => Note;
  getFretNote: (stringIndex: number, fret: number) => FretNote;
  /** Tap / Enter on a cell (play, or cycle the finger in edit mode). */
  onCellActivate: (fn: FretNote) => void;
  // Chord
  currentShape: { shape: ChordShape; baseFret: number } | null;
  voicingLookup: Map<number, { fret: number; finger: FingerNumber | undefined } | null>;
  // Position view: fret → dot (fret 0 = open string)
  positionDots: Map<number, PositionDot> | undefined;
  // Whole-neck view: label for a scale dot by pitch class
  scaleLabelFor: (pc: number) => string;
  // Highlight view
  highlightPcs: Set<number> | null;
  // Keyboard navigation
  focusedFret: number | null;
}

export const FretboardString = memo(function FretboardString({
  stringIdx,
  visibleFrets,
  fretMinWidth,
  mobile,
  isChordView,
  atNut,
  mode,
  stringName,
  activeNotes,
  rootPitchClass,
  getNoteColor,
  spellPitchClass,
  getFretNote,
  onCellActivate,
  currentShape,
  voicingLookup,
  positionDots,
  scaleLabelFor,
  highlightPcs,
  focusedFret,
}: FretboardStringProps) {
  const openFretNote = getFretNote(stringIdx, 0);
  const openPitched = midiToNote(openFretNote.midiNumber);
  const openColor = getNoteColor(openPitched);
  const isOpenActive = activeNotes.has(openFretNote.midiNumber);
  const openPc = openFretNote.pitchClass;
  // Dot label for the open string follows the context spelling like every
  // other note dot; the string-NAME column (left) never does (W1-16).
  const openLabel = noteToString(spellPitchClass(openPc));
  const isOpenRoot = rootPitchClass !== null && openPc === rootPitchClass;

  // Chord voicing info
  const voicingInfo = voicingLookup.get(stringIdx);
  const isMuted = mode === 'chord' && currentShape !== null && voicingInfo === null;
  const isOpenVoicing =
    mode === 'chord' &&
    voicingInfo !== undefined &&
    voicingInfo !== null &&
    voicingInfo.fret === 0;

  // Open-string indicator: same instant-pointerdown behaviour as FretCell so a
  // touch on it fires without scroll arbitration (mobile); desktop keeps click.
  const openFiredFromPointer = useRef(false);
  const handleOpenPointerDown = (e: React.PointerEvent) => {
    if (!mobile || isMuted) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    openFiredFromPointer.current = true;
    onCellActivate(openFretNote);
  };
  const handleOpenClick = () => {
    if (openFiredFromPointer.current) {
      openFiredFromPointer.current = false;
      return;
    }
    if (!isMuted) onCellActivate(openFretNote);
  };

  // ── Open-string column content ─────────────────────────────
  const openDot = (kind: string, bg: string, label: string, ring: boolean, title?: string, solid = true) => (
    <div
      data-dot={kind}
      data-dot-string={stringIdx}
      data-dot-fret={0}
      title={title}
      className="rounded-full flex items-center justify-center font-bold"
      style={{
        width: mobile ? 26 : 24,
        height: mobile ? 26 : 24,
        fontSize: mobile ? 11 : 10,
        backgroundColor: solid ? bg : `${bg}30`,
        color: solid ? readableTextOn(bg) : 'var(--text)',
        border: ring ? '3px solid #ffffff' : `${solid ? 2 : 1.5}px solid ${bg}`,
        boxShadow: ring ? `0 0 12px ${bg}aa` : 'none',
        transform: isOpenActive ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      {label}
    </div>
  );

  let openContent: React.ReactNode = null;
  if (mode === 'chord') {
    if (isMuted) {
      openContent = <span className="font-bold" style={{ fontSize: 14, color: '#ef4444aa' }}>✕</span>;
    } else if (isOpenVoicing) {
      openContent = openDot('voicing', openColor ?? ACCENT_FILL, openLabel, isOpenRoot);
    }
  } else if (mode === 'position') {
    const dot = positionDots?.get(0);
    if (dot) openContent = openDot('position', openColor ?? ACCENT_FILL, dot.label, dot.isRoot, dot.description);
  } else if (mode === 'scale') {
    if (openColor) openContent = openDot('scale', openColor, scaleLabelFor(openPc), false, undefined, isOpenRoot || isOpenActive);
  } else if (highlightPcs?.has(openPc)) {
    openContent = openDot('highlight', openColor ?? ACCENT_FILL, openLabel, isOpenRoot);
  }

  return (
    <div className="flex items-center" style={{ height: mobile ? 32 : (isChordView ? 32 : 28) }}>
      {/* String name — always the tuning's (W1-16) */}
      <div
        data-string-name
        className="text-right pr-2 font-mono"
        style={{ width: 32, fontSize: 12, color: isMuted ? 'var(--text-dim)' : 'var(--text-muted)' }}
      >
        {stringName}
      </div>

      {/* Fretboard area */}
      <div className="flex flex-1 self-stretch items-stretch">
        {visibleFrets.map((fret) => {
          const fn = getFretNote(stringIdx, fret);
          // Colour stays driven by the physical (sharp-default) note — degree
          // lookup is pitch-class based, so the spelling is irrelevant to it.
          const pitched = midiToNote(fn.midiNumber);
          const color = getNoteColor(pitched);
          // Label uses the context-aware spelling for this pitch class.
          const displayNote = spellPitchClass(fn.pitchClass);
          const isActive = activeNotes.has(fn.midiNumber);
          const isInScale = color !== undefined;

          const isVoicingPosition =
            mode === 'chord' && voicingInfo !== undefined && voicingInfo !== null && voicingInfo.fret === fret;
          const finger = isVoicingPosition ? voicingInfo.finger : undefined;
          const positionDot = mode === 'position' ? positionDots?.get(fret) ?? null : null;
          const showScaleDot = mode === 'scale' && isInScale;
          const showHighlight = mode === 'highlight' && (highlightPcs?.has(fn.pitchClass) ?? false);

          const dotColor = color ?? ACCENT_FILL;
          const isRoot = rootPitchClass !== null && fn.pitchClass === rootPitchClass;

          return (
            <FretCell
              key={fret}
              fret={fret}
              stringIdx={stringIdx}
              displayNote={displayNote}
              color={color}
              dotColor={dotColor}
              isActive={isActive}
              isRoot={isRoot}
              isMuted={isMuted}
              fretMinWidth={fretMinWidth}
              isChordView={isChordView}
              mobile={mobile}
              showVoicing={isVoicingPosition}
              finger={finger}
              positionDot={positionDot}
              showScaleDot={showScaleDot}
              scaleDotLabel={showScaleDot ? scaleLabelFor(fn.pitchClass) : undefined}
              showHighlight={showHighlight}
              isFocused={focusedFret === fret}
              onClick={() => onCellActivate(fn)}
            />
          );
        })}
      </div>

      {/* Nut */}
      <div
        style={{
          width: atNut ? 6 : 2,
          backgroundColor: atNut ? 'var(--text-muted)' : 'var(--border)',
          height: '100%',
        }}
      />

      {/* Open string / muted indicator */}
      <div
        role="button"
        aria-label={isMuted ? `String ${6 - stringIdx} muted` : `${openLabel} open string`}
        className="flex items-center justify-center cursor-pointer"
        style={{ width: 40, ...(mobile ? { touchAction: 'none' } : undefined) }}
        onPointerDown={handleOpenPointerDown}
        onClick={handleOpenClick}
      >
        {openContent ?? (
          <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>{stringName}</span>
        )}
      </div>
    </div>
  );
});
