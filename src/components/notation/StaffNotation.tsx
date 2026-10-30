/**
 * StaffNotation — renders music notation using VexFlow.
 * Lazy-loads VexFlow on first use, shows skeleton while loading.
 */
import type { PitchedNote } from '../../core/types/music';
import { useStaffNotation } from './useStaffNotation';
import { StaffNotationSkeleton } from './StaffNotationSkeleton';

export interface StaffNotationProps {
  notes: PitchedNote[];
  clef?: 'treble' | 'bass';
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
  className?: string;
}

export function StaffNotation({
  notes,
  clef,
  keySignature,
  width,
  height = 150,
  noteColors,
  duration,
  chord,
  followInstrument,
  className,
}: StaffNotationProps) {
  const { containerRef, loading, height: fittedHeight } = useStaffNotation({
    notes,
    clef,
    keySignature,
    width,
    height,
    noteColors,
    duration,
    chord,
    followInstrument,
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
