import type { PitchedNote } from '../../core/types/music.ts';
import { staffInkBounds, staffLayout, staffPlan } from '../../utils/notationHelpers.ts';

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
  keySignature?: string,
): { top: number; bottom: number; height: number } {
  const plan = staffPlan(notes, undefined, instrument, true);
  const options = { annotation: plan.annotation, duration: 'w', keySignature };
  const layout = staffLayout(plan.written, plan.clef, requestedHeight, options);
  const ink = staffInkBounds(plan.written, plan.clef, options);
  const top = Math.max(0, layout.staveY + ink.top - 4);
  const bottom = Math.max(0, layout.height - (layout.staveY + ink.bottom) - 2);
  return { top, bottom, height: layout.height };
}

/**
 * Only the scale strip has an unclipped label band beside the clef's tail.
 * Keep the full annotated SVG, but let the 8 occupy that band's empty left
 * end. Flow reserves the ordinary clef hook plus all note/signature ink;
 * the strip's labels start to the right, under the noteheads. Other callers
 * must use staffTrim: without the label band this tailroom is not available.
 */
export function scaleStripTrim(
  notes: readonly PitchedNote[],
  instrument: string,
  requestedHeight: number,
  keySignature?: string,
): { top: number; bottom: number; height: number } {
  const trim = staffTrim(notes, instrument, requestedHeight, keySignature);
  if (instrument !== 'guitar') return trim;
  const plan = staffPlan(notes, undefined, instrument, true);
  const options = { duration: 'w', keySignature };
  const layout = staffLayout(plan.written, plan.clef, requestedHeight, { ...options, annotation: plan.annotation });
  const flowInk = staffInkBounds(plan.written, plan.clef, options);
  return { ...trim, bottom: Math.max(0, trim.height - (layout.staveY + flowInk.bottom) - 2) };
}
