/**
 * The colours of a search result's category label ("Chord", "Scale", "Key",
 * "Lesson") — audit A11, 2026-11-18.
 *
 * Each category is a degree hue painted as a light tint (8 %, `14` in hex) with
 * that hue's INK as the text (`inkFor`: `--deg-ink-N`, the design system's
 * rule D-28 — a 400 hue as text on cream is 1.3–2.4:1). Before, the text was
 * the hue itself (Chord 1.41:1 by day) and Scale was `--accent` on
 * `--accent-dim` (3.69:1; even `--accent-text` cannot reach 4.5:1 on that tint
 * over the selected row's `--card-hover`, 4.00:1), so Scale takes the orange
 * degree hue, the one nearest the accent. Every label is ≥ 4.5:1 on the row
 * at rest (`--bg`) and selected (`--card-hover`), day and night
 * (`searchBadgeContrast.test.tsx` computes it from index.css).
 */
import { DEGREE_COLORS, inkFor } from '../../design/tokens/colors.ts';
import type { SearchResultType } from './quickSearchResults.ts';

export const SEARCH_BADGE_DEGREE: Record<SearchResultType, keyof typeof DEGREE_COLORS> = {
  Scale: 6,
  Chord: 5,
  Key: 4,
  Lesson: 2,
  // The app's tools (tuner, metronome: review of b94d761, item 8).
  Tool: 1,
};

/** The tint's alpha, as the two hex digits appended to the hue. */
export const SEARCH_BADGE_TINT = '14';

export function searchBadgeColors(type: SearchResultType, degreeColorsOn: boolean): { backgroundColor: string; color: string } {
  if (!degreeColorsOn) return { backgroundColor: 'var(--card)', color: 'var(--text-muted)' };
  const hue = DEGREE_COLORS[SEARCH_BADGE_DEGREE[type]];
  return { backgroundColor: `${hue}${SEARCH_BADGE_TINT}`, color: inkFor(hue) };
}
