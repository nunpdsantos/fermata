// Functional color system — scale degree determines color, not pitch class
export const DEGREE_COLORS = {
  1: '#60A5FA', // I (Tonic) — blue, stability
  2: '#A78BFA', // ii — violet
  3: '#F472B6', // iii — pink
  4: '#34D399', // IV — emerald
  5: '#FBBF24', // V (Dominant) — amber, tension
  6: '#FB923C', // vi — orange
  7: '#F87171', // vii (Leading tone) — red, strong tension
} as const;

/**
 * Degree colours as TEXT (D-28): the fills above read 1.3–2.4:1 on cream, so
 * coloured text uses these theme tokens instead — the same hue's 800 shade
 * by day, its 400 shade at night (≥ 4.5:1 on --bg / --card / --card-hover;
 * src/design/__tests__/themeContrast.test.ts). On a degree FILL, write with
 * ON_DEGREE (dark ink, 5.8–9.6:1).
 */
export const DEGREE_INKS = {
  1: 'var(--deg-ink-1)',
  2: 'var(--deg-ink-2)',
  3: 'var(--deg-ink-3)',
  4: 'var(--deg-ink-4)',
  5: 'var(--deg-ink-5)',
  6: 'var(--deg-ink-6)',
  7: 'var(--deg-ink-7)',
} as const;

/** Ink for text drawn ON a degree fill (both themes). */
export const ON_DEGREE = 'var(--on-degree)';

const INK_BY_FILL = new Map<string, string>(
  (Object.keys(DEGREE_COLORS) as unknown as (keyof typeof DEGREE_COLORS)[]).map((k) => [DEGREE_COLORS[k].toLowerCase(), DEGREE_INKS[k]]),
);

/**
 * The TEXT colour for something tinted with `color`: a degree fill hue → its
 * ink token; the accent → --accent-text; anything else unchanged.
 */
export function inkFor(color: string): string {
  const c = color.trim().toLowerCase();
  if (c === 'var(--accent)') return 'var(--accent-text)';
  return INK_BY_FILL.get(c) ?? color;
}

export const DEGREE_COLORS_DIM = {
  1: 'rgba(96, 165, 250, 0.15)',
  2: 'rgba(167, 139, 250, 0.15)',
  3: 'rgba(244, 114, 182, 0.15)',
  4: 'rgba(52, 211, 153, 0.15)',
  5: 'rgba(251, 191, 36, 0.15)',
  6: 'rgba(251, 146, 60, 0.15)',
  7: 'rgba(248, 113, 113, 0.15)',
} as const;

// Surface tokens — resolve to CSS custom properties for theme support
// Usage: style={{ backgroundColor: SURFACE.card }}
export const SURFACE = {
  bg: 'var(--bg)',
  bgRaised: 'var(--bg-raised)',
  card: 'var(--card)',
  cardHover: 'var(--card-hover)',
  cardActive: 'var(--card-active)',
  border: 'var(--border)',
  borderLight: 'var(--border-light)',
  borderSubtle: 'var(--border-subtle)',
  text: 'var(--text)',
  textMuted: 'var(--text-muted)',
  textDim: 'var(--text-dim)',
  inputBg: 'var(--input-bg)',
  accent: 'var(--accent)',
  accentHover: 'var(--accent-hover)',
  accentDim: 'var(--accent-dim)',
  accentBg: 'var(--accent-bg)',
  focusRing: 'var(--focus-ring)',
  shadowSm: 'var(--shadow-sm)',
  shadowMd: 'var(--shadow-md)',
  shadowLg: 'var(--shadow-lg)',
  shadowGlow: 'var(--shadow-glow)',
  pianoWhite: 'var(--piano-white)',
  pianoBlack: 'var(--piano-black)',
  pianoBorder: 'var(--piano-border)',
  pianoLabel: 'var(--piano-label)',
} as const;
