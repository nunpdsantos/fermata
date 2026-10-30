/**
 * Audit W0-03 (U-2 / F-05): on the default light theme ("fermata" day) the
 * right/wrong/hint text and answered chips used dark-theme Tailwind shades
 * (emerald-300, red-300, amber-300/400, #FBBF24) at ~1.2–1.8:1, and
 * --text-dim sat at 3.15–3.85:1.
 *
 * This test PARSES the real theme CSS (src/index.css) and Tailwind's own
 * palette (node_modules/tailwindcss/theme.css, OKLCH) and computes WCAG 2.x
 * contrast for every semantic text token against every surface it sits on,
 * in BOTH themes — including the translucent success/danger/warning tints the
 * feedback strips and answered chips paint behind that text.
 */
import { describe, it, expect } from 'vitest';
import { palette } from '../tokens/palette';

// Read the CSS from disk: under Vitest a `?raw` CSS import comes back as ''
// (CSS processing is off), so the files are read with Node's fs. The module
// specifier is built at runtime so the app tsconfig (no Node types) stays
// untouched; only readFileSync is used.
const fs = (await import(/* @vite-ignore */ ['node', 'fs'].join(':'))) as {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
const fromHere = (rel: string) => decodeURIComponent(new URL(rel, import.meta.url).pathname);
const indexCss = fs.readFileSync(fromHere('../../index.css'), 'utf8');
const twTheme = fs.readFileSync(fromHere('../../../node_modules/tailwindcss/theme.css'), 'utf8');

type RGB = [number, number, number];

// ─── Colour maths ─────────────────────────────────────────────────────────────

function hexToRgb(hex: string): RGB {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as RGB;
}

/** OKLCH (CSS `oklch(L% C H)`) → sRGB 0–255, clipped to gamut (Ottosson). */
function oklchToRgb(L: number, C: number, H: number): RGB {
  const l = L / 100;
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const [L3, M3, S3] = [l_ ** 3, m_ ** 3, s_ ** 3];
  const lin = [
    4.0767416621 * L3 - 3.3077115913 * M3 + 0.2309699292 * S3,
    -1.2684380046 * L3 + 2.6097574011 * M3 - 0.3413193965 * S3,
    -0.0041960863 * L3 - 0.7034186147 * M3 + 1.707614701 * S3,
  ];
  return lin.map((x) => {
    const c = Math.min(1, Math.max(0, x));
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(v * 255);
  }) as RGB;
}

function luminance([r, g, b]: RGB): number {
  const ch = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function contrast(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** `fg` at `alpha` painted over the opaque `bg`. */
function over(fg: RGB, alpha: number, bg: RGB): RGB {
  return fg.map((v, i) => Math.round(v * alpha + bg[i] * (1 - alpha))) as RGB;
}

// ─── CSS parsing ──────────────────────────────────────────────────────────────

/** Custom properties declared inside the first block whose selector matches. */
function themeVars(selector: RegExp): Record<string, string> {
  const re = new RegExp(`${selector.source}\\s*\\{([^}]*)\\}`, 'g');
  for (const m of indexCss.matchAll(re)) {
    if (!m[1].includes('--bg:')) continue; // the theme block, not the spacing one
    const vars: Record<string, string> = {};
    for (const d of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
    return vars;
  }
  throw new Error(`theme block ${selector} not found in index.css`);
}

function twColor(name: string): RGB {
  const m = twTheme.match(new RegExp(`--color-${name}:\\s*oklch\\(([\\d.]+)%\\s+([\\d.]+)\\s+([\\d.]+)\\)`));
  if (!m) throw new Error(`tailwind colour ${name} not found in tailwindcss/theme.css`);
  return oklchToRgb(Number(m[1]), Number(m[2]), Number(m[3]));
}

const THEMES = {
  'fermata (day)': themeVars(/(?:^|\n):root/),
  'fermata-night': themeVars(/:root\.fermata-night/),
};

function hexVar(vars: Record<string, string>, name: string): RGB {
  const v = vars[name];
  if (!v || !/^#[0-9a-fA-F]{3,8}$/.test(v)) throw new Error(`${name} missing or not a hex value: ${v}`);
  return hexToRgb(v);
}

// The tints the components paint behind the coloured text (Tailwind classes
// like bg-emerald-500/15, bg-emerald-400/10, and ReviewQueue's `${AMBER}20`).
const TINTS: Record<'success' | 'danger' | 'warning', { color: RGB; alpha: number; label: string }[]> = {
  success: [
    { color: twColor('emerald-500'), alpha: 0.1, label: 'emerald-500/10' },
    { color: twColor('emerald-500'), alpha: 0.15, label: 'emerald-500/15' },
    { color: twColor('emerald-500'), alpha: 0.2, label: 'emerald-500/20' },
    { color: twColor('emerald-400'), alpha: 0.1, label: 'emerald-400/10' },
  ],
  danger: [
    { color: twColor('red-500'), alpha: 0.1, label: 'red-500/10' },
    { color: twColor('red-500'), alpha: 0.15, label: 'red-500/15' },
  ],
  warning: [
    { color: twColor('amber-500'), alpha: 0.1, label: 'amber-500/10' },
    { color: twColor('amber-500'), alpha: 0.15, label: 'amber-500/15' },
    { color: twColor('amber-400'), alpha: 0.1, label: 'amber-400/10' },
    { color: hexToRgb(palette.warning), alpha: 0x20 / 255, label: 'palette.warning 20 (review chips)' },
  ],
};

const MIN_TEXT = 4.5; // WCAG 2.x AA, normal-size text

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('contrast maths sanity', () => {
  it('black on white is 21:1', () => {
    expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
  });
  it('OKLCH conversion: white and black round-trip; emerald-300 is the #5ee9b5 the audit measured', () => {
    expect(oklchToRgb(100, 0, 0)).toEqual([255, 255, 255]);
    expect(oklchToRgb(0, 0, 0)).toEqual([0, 0, 0]);
    expect(twColor('emerald-300')).toEqual(hexToRgb('#5ee9b5'));
  });
  it('known positive: the old day-theme feedback colour fails (emerald-300 on cream ≈ 1.3:1)', () => {
    const bg = hexVar(THEMES['fermata (day)'], '--bg');
    expect(contrast(twColor('emerald-300'), bg)).toBeLessThan(1.5);
  });
});

describe.each(Object.entries(THEMES))('semantic text tokens — %s', (_theme, vars) => {
  const surfaces: { label: string; rgb: RGB }[] = ['--bg', '--card', '--card-hover'].map((n) => ({
    label: n,
    rgb: hexVar(vars, n),
  }));

  it.each(['success', 'danger', 'warning'] as const)('--%s-text ≥ 4.5:1 on every surface + its tints', (role) => {
    const fg = hexVar(vars, `--${role}-text`);
    const failures: string[] = [];
    for (const s of surfaces) {
      const backs = [{ label: s.label, rgb: s.rgb }, ...TINTS[role].map((t) => ({ label: `${t.label} over ${s.label}`, rgb: over(t.color, t.alpha, s.rgb) }))];
      for (const b of backs) {
        const r = contrast(fg, b.rgb);
        if (r < MIN_TEXT) failures.push(`${b.label}: ${r.toFixed(2)}`);
      }
    }
    expect(failures).toEqual([]);
  });
});

describe('feedback/status components use the semantic tokens, not fixed dark-theme shades', () => {
  const FILES = [
    'components/drill/FeedbackStrip.tsx',
    'components/drill/ChoiceChips.tsx',
    'components/drill/NoteChips.tsx',
    'components/drill/AccidentalSlots.tsx',
    'components/drill/RootQualityChips.tsx',
    'components/drill/MasteryMap.tsx',
    'components/learn/exercises/ExerciseFeedback.tsx',
    'components/learn/exercises/inputs/ChoiceInput.tsx',
    'components/learn/ReviewQueue.tsx',
    'components/learn/UnitCard.tsx',
    'components/learn/ModuleView.tsx',
    'components/learn/ModuleRow.tsx',
  ];
  it.each(FILES)('%s', (rel) => {
    const src = fs.readFileSync(fromHere(`../../${rel}`), 'utf8');
    expect(src).not.toMatch(/text-(emerald|red|amber)-[1-4]00/);
    expect(src).toMatch(/text-(success|danger|warning)\b|var\(--(success|danger|warning)-text\)/);
  });
});

describe('--text-dim on the default light theme', () => {
  const day = THEMES['fermata (day)'];
  const dim = hexVar(day, '--text-dim');

  it.each(['--bg', '--card', '--card-hover'])('≥ 4.5:1 on %s', (surface) => {
    expect(contrast(dim, hexVar(day, surface))).toBeGreaterThanOrEqual(MIN_TEXT);
  });

  it('still reads as secondary: lighter than --text-muted, far lighter than --text', () => {
    const bg = hexVar(day, '--bg');
    expect(contrast(dim, bg)).toBeLessThan(contrast(hexVar(day, '--text-muted'), bg));
    expect(contrast(dim, bg)).toBeLessThan(contrast(hexVar(day, '--text'), bg) / 2);
  });
});
