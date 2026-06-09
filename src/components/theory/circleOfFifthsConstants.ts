import type { Note, ScaleType } from '../../core/types/music.ts';

// Circle of fifths order (clockwise from top = C)
export const CIRCLE_MAJOR: Note[] = [
  { natural: 'C', accidental: '' },
  { natural: 'G', accidental: '' },
  { natural: 'D', accidental: '' },
  { natural: 'A', accidental: '' },
  { natural: 'E', accidental: '' },
  { natural: 'B', accidental: '' },
  { natural: 'G', accidental: 'b' },
  { natural: 'D', accidental: 'b' },
  { natural: 'A', accidental: 'b' },
  { natural: 'E', accidental: 'b' },
  { natural: 'B', accidental: 'b' },
  { natural: 'F', accidental: '' },
];

export const CIRCLE_MINOR: Note[] = [
  { natural: 'A', accidental: '' },
  { natural: 'E', accidental: '' },
  { natural: 'B', accidental: '' },
  { natural: 'F', accidental: '#' },
  { natural: 'C', accidental: '#' },
  { natural: 'G', accidental: '#' },
  { natural: 'E', accidental: 'b' },
  { natural: 'B', accidental: 'b' },
  { natural: 'F', accidental: '' },
  { natural: 'C', accidental: '' },
  { natural: 'G', accidental: '' },
  { natural: 'D', accidental: '' },
];

export const KEY_SIGNATURES = ['', '1\u266F', '2\u266F', '3\u266F', '4\u266F', '5\u266F', '6\u266F/6\u266D', '5\u266D', '4\u266D', '3\u266D', '2\u266D', '1\u266D'];

export const MINOR_SCALES: ScaleType[] = ['natural_minor', 'harmonic_minor', 'melodic_minor'];
export const MINOR_SCALE_LABELS: Record<string, string> = {
  natural_minor: 'Natural',
  harmonic_minor: 'Harmonic',
  melodic_minor: 'Melodic',
};

export const ROMAN_NUMERALS: Record<number, string> = {
  1: 'I', 2: 'ii', 3: 'iii', 4: 'IV', 5: 'V', 6: 'vi', 7: 'vii\u00B0',
};

export const SIZE = 300;
export const CENTER = SIZE / 2;
export const MAJOR_INNER = 84;
export const MAJOR_OUTER = 120;
export const MINOR_INNER = 50;
export const MINOR_OUTER = 80;
export const KEYSIG_R = 132;
export const SEG_GAP = 1.2;

// Tonic accent color — uses the theme's accent CSS var so the Circle of
// Fifths follows dark/light/fermata automatically. color-mix() gives us
// percentage alpha without baking hex values.
export const TONIC_HUE = 'var(--accent)';

// Helper: semi-transparent accent. pct is 0-100.
export const accentAlpha = (pct: number): string =>
  `color-mix(in srgb, var(--accent) ${pct}%, transparent)`;

// Distance-based fills for major ring (0 = selected, handled with glow)
export const DIST_FILL_MAJOR = [
  TONIC_HUE,         // 0 — selected
  accentAlpha(22),   // 1 — nearest neighbor (share 6/7 notes)
  accentAlpha(14),   // 2 — share 5/7
  accentAlpha(9),    // 3 — share 4/7
  accentAlpha(5),    // 4 — share 3/7
  'var(--card)',     // 5 — distant
  'var(--bg-raised)',// 6 — tritone
];
export const DIST_STROKE_MAJOR = [
  'var(--bg-raised)',
  accentAlpha(31),
  accentAlpha(21),
  accentAlpha(13),
  'var(--border)',
  'var(--border-subtle)',
  'var(--border-subtle)',
];
export const DIST_TEXT_MAJOR = [
  'var(--bg)', 'var(--text)', 'var(--text-muted)', 'var(--text-muted)', 'var(--text-dim)', 'var(--border-light)', 'var(--border)',
];

// Minor ring — slightly subtler
export const DIST_FILL_MINOR = [
  TONIC_HUE,         // 0
  accentAlpha(16),   // 1
  accentAlpha(9),    // 2
  accentAlpha(5),    // 3
  'var(--bg-raised)',// 4
  'var(--bg)',       // 5
  'var(--bg)',       // 6
];
export const DIST_STROKE_MINOR = [
  'var(--bg-raised)',
  accentAlpha(25),
  accentAlpha(16),
  accentAlpha(9),
  'var(--border-subtle)',
  'var(--border-subtle)',
  'var(--card)',
];
export const DIST_TEXT_MINOR = [
  'var(--bg)', 'var(--text-muted)', 'var(--text-muted)', 'var(--text-dim)', 'var(--border-light)', 'var(--border)', 'var(--border)',
];

export const DISTANCE_LABELS = [
  'Current key',
  'Closely related · 6 shared notes',
  'Related · 5 shared notes',
  '4 shared notes',
  '3 shared notes',
  '2 shared notes',
  'Tritone · 2 shared notes',
];
