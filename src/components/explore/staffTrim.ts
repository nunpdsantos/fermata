import type { PitchedNote } from '../../core/types/music.ts';
import { staffLine, staffLayout, staffPlan } from '../../utils/notationHelpers.ts';

/**
 * How much empty room the Explore staves can lose above and below (W11-B:
 * the workbench has to fit at 1440×900). VexFlow leaves four staff spaces of
 * headroom over the top line whatever the notes are; this measures, from the
 * same plan and layout StaffNotation draws, how far above the top line the
 * clef glyph and the highest note reach, and how far below the bottom line
 * the clef (and the guitar clef's little 8) and the lowest note reach — and
 * returns what can be trimmed with negative margins. Never trims ink.
 */
export function staffTrim(
  notes: readonly PitchedNote[],
  instrument: string,
  requestedHeight: number,
): { top: number; bottom: number; height: number } {
  const plan = staffPlan(notes, undefined, instrument, true);
  const layout = staffLayout(plan.written, plan.clef, requestedHeight);
  if (plan.written.length === 0) return { top: 0, bottom: 0, height: layout.height };
  const lines = plan.written.map((n) => staffLine(n, plan.clef));
  const staffTop = layout.staveY + 40;
  const staffBottom = layout.staveY + 80;
  // A notehead with its ledger line needs ~8 px either side of its centre.
  const noteTop = layout.staveY + 90 - 10 * Math.max(...lines) - 8;
  const noteBottom = layout.staveY + 90 - 10 * Math.min(...lines) + 8;
  // The treble clef curls ~16 px over the top line and ~22 px under the
  // bottom one; the guitar clef's 8 hangs ~12 px lower still.
  const clefTop = staffTop - 16;
  const clefBottom = staffBottom + 22 + (plan.annotation ? 12 : 0);
  const top = Math.max(0, Math.min(clefTop, noteTop) - 4);
  const bottom = Math.max(0, layout.height - Math.max(clefBottom, noteBottom) - 2);
  return { top, bottom, height: layout.height };
}
