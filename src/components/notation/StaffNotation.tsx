/**
 * StaffNotation — renders music notation using VexFlow.
 * Lazy-loads VexFlow on first use, shows skeleton while loading.
 */
import type { PitchedNote } from '../../core/types/music';
import { useStaffNotation, type StaffLayoutInfo } from './useStaffNotation';
import type { ClefAnnotation } from '../../utils/notationHelpers';
import { StaffNotationSkeleton } from './StaffNotationSkeleton';

export interface StaffNotationProps {
  notes: PitchedNote[];
  clef?: 'treble' | 'bass';
  /** Clef annotation for already-written notation (does not transpose notes). */
  annotation?: ClefAnnotation;
  keySignature?: string;
  width?: number;
  /** Reserve space before notes, e.g. for wide labels beside a clef. */
  minNoteStartX?: number;
  height?: number;
  /** Map of note index → hex color for degree-based highlighting */
  noteColors?: Record<number, string>;
  /** VexFlow duration: 'w' (whole) | 'h' (half) | 'q' (quarter). Default: 'q' */
  duration?: string;
  /** When true, render all notes stacked as a single chord (one head, multiple
   *  pitches). When false (default), render notes sequentially as a melody. */
  chord?: boolean;
  /** Show what the selected instrument plays (Explore). Off for authored
   *  notation such as Learn exercises, which is never transposed. */
  followInstrument?: boolean;
  /** Notes drawn in the dim text colour (index → true). */
  noteDim?: Record<number, boolean>;
  /** Notehead centres after each render (see useStaffNotation). */
  onLayout?: (layout: StaffLayoutInfo) => void;
  className?: string;
}

export function StaffNotation({
  notes,
  clef,
  annotation,
  keySignature,
  width,
  minNoteStartX,
  height = 150,
  noteColors,
  duration,
  chord,
  followInstrument,
  noteDim,
  onLayout,
  className,
}: StaffNotationProps) {
  const { containerRef, loading, height: fittedHeight } = useStaffNotation({
    notes,
    clef,
    annotation,
    keySignature,
    width,
    minNoteStartX,
    height,
    noteColors,
    duration,
    chord,
    followInstrument,
    noteDim,
    onLayout,
  });

  // While VexFlow loads, hold the height the drawing will take (the fitted
  // height, known before it loads), not the one asked for: a staff with a
  // ledger line drew 100 px under an 80 px skeleton, and everything below it
  // moved 20 px down when it arrived (Build's readout, scrolled clear of the
  // dock, went back under it — e2e/explore-tools-audit.spec.ts Q4).
  if (loading) {
    return <StaffNotationSkeleton height={fittedHeight} />;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: width ?? '100%', height: fittedHeight, minHeight: fittedHeight }}
    />
  );
}
