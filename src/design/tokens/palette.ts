/**
 * Semantic color palette for app-wide cross-cutting colors.
 *
 * Named by role, not by hue (per brand tweak policy). If the brand shifts
 * tonight, every consumer that reads from here keeps working.
 *
 * Scope: colors used for cross-app meaning (success, warning, etc.).
 * Color systems with music-theory meaning (DEGREE_COLORS) or curriculum
 * identity (LEVEL_ACCENTS) live in sibling modules and reference entries
 * here where the role happens to overlap.
 */

export const palette = {
  /** Brand anchor — also L1 curriculum + tonic degree. */
  accent: '#60A5FA',
  /** Secondary info tone — sky. Used for L2 curriculum. */
  info: '#38BDF8',
  /** Success / completion / emerald — L3 curriculum, mediant/subdominant, toast. */
  success: '#34D399',
  /** Warning / review / amber — L5 curriculum, dominant degree, toast, review queue. */
  warning: '#FBBF24',
  /** Danger / error / red — L9 curriculum, leading tone, toast error, recording. */
  danger: '#F87171',
} as const;
