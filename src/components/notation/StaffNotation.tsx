/**
 * StaffNotation — renders music notation using VexFlow.
 * Lazy-loads VexFlow on first use, shows skeleton while loading.
 */
import type { PitchedNote } from '../../core/types/music';
import { useStaffNotation, type StaffLayoutInfo } from './useStaffNotation';
import { StaffNotationSkeleton } from './StaffNotationSkeleton';

export interface StaffNotationProps {
  notes: PitchedNote[];
  clef?: 'treble' | 'bass';
  /** Clef annotation for already-written notation (does not transpose notes). */
  annotation?: '8vb';
  keySignature?: string;
  width?: number;
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
    height,
    noteColors,
    duration,
    chord,
    followInstrument,
    noteDim,
    onLayout,
  });

  if (loading) {
    return <StaffNotationSkeleton height={height} />;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: width ?? '100%', height: fittedHeight, minHeight: fittedHeight }}
    />
  );
}
