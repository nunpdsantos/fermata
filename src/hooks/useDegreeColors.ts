/**
 * Whether scale-degree functional colours (tonic=blue, dominant=amber, etc.)
 * should be rendered in the current UI context.
 *
 * Policy: always on. Functional degree colours are pedagogy-first — they
 * surface tonal function everywhere at all times. Both the Fermata day and
 * Fermata Night themes carry these colours as a design primitive, not an
 * opt-in overlay.
 *
 * Consumed by: ScaleDegreeBar, ChordGrid, CircleOfFifths, PianoKey, FretCell,
 * DetailPanel, ExerciseRunner — anywhere DEGREE_COLORS is currently read.
 */
export function useDegreeColorsEnabled(): boolean {
  return true;
}
