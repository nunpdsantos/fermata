/**
 * Audit W3-14: fretboard labels and chips must be legible — text contrast
 * ≥ 4.5:1 (WCAG AA, normal text) on the light (fermata) and night themes,
 * using the theme's own tokens, and tap targets ≥ 24 px.
 *
 * Parses the real src/index.css (like src/design/__tests__/themeContrast) and
 * checks every text/background pairing the fretboard paints:
 *   - chip text (inactive and active), group labels, string names, fret numbers
 *   - the position / chord / highlight badge and accent-coloured dots
 *   - whole-neck scale-dot labels (body text on a pale degree tint)
 *   - solid degree-coloured dots with the computed black/white label
 */
import { describe, it, expect } from 'vitest';
import { DEGREE_COLORS } from '../../../design/tokens/colors';
import { readableTextOn, chipStyle, CHIP_MIN_PX, CHIP_TEXT_PX, ACCENT_FILL, ON_ACCENT_FILL } from '../fretboardConstants';

const fs = (await import(/* @vite-ignore */ ['node', 'fs'].join(':'))) as {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
const fromHere = (rel: string) => decodeURIComponent(new URL(rel, import.meta.url).pathname);
const indexCss = fs.readFileSync(fromHere('../../../index.css'), 'utf8');

type RGB = [number, number, number];
function hexToRgb(hex: string): RGB {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as RGB;
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
const over = (fg: RGB, alpha: number, bg: RGB) => fg.map((v, i) => Math.round(v * alpha + bg[i] * (1 - alpha))) as RGB;

function themeVars(selector: RegExp): Record<string, string> {
  const re = new RegExp(`${selector.source}\\s*\\{([^}]*)\\}`, 'g');
  for (const m of indexCss.matchAll(re)) {
    if (!m[1].includes('--bg:')) continue;
    const vars: Record<string, string> = {};
    for (const d of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
    return vars;
  }
  throw new Error(`theme block ${selector} not found`);
}
const THEMES = {
  'fermata (day)': themeVars(/(?:^|\n):root/),
  'fermata-night': themeVars(/:root\.fermata-night/),
};
/** Resolve a hex literal or a var(--token) against a theme. */
function resolve(theme: Record<string, string>, value: string): RGB {
  const v = /^var\((--[\w-]+)\)$/.exec(value.trim());
  const raw = v ? theme[v[1]] : value;
  if (!raw || !/^#[0-9a-fA-F]{3,8}$/.test(raw)) throw new Error(`cannot resolve ${value} -> ${raw}`);
  return hexToRgb(raw);
}

const MIN = 4.5;
// The "degree colours off" fallback palette (useKeyContext): walnut tonic + light walnut.
const DOT_COLORS = [...Object.values(DEGREE_COLORS), '#a65a2a', '#c9a574'];

describe('fretboard text contrast, both themes (W3-14)', () => {
  for (const [name, theme] of Object.entries(THEMES)) {
    const bg = resolve(theme, 'var(--bg)');

    it(`${name}: chips, group labels, string names and fret numbers on the page background`, () => {
      const inactive = chipStyle(false);
      expect(contrast(resolve(theme, String(inactive.color)), bg)).toBeGreaterThanOrEqual(MIN);
      for (const token of ['var(--text-muted)', 'var(--text-dim)']) {
        expect(contrast(resolve(theme, token), bg), token).toBeGreaterThanOrEqual(MIN);
      }
    });

    it(`${name}: active chip, badges and accent-filled dots`, () => {
      const active = chipStyle(true);
      expect(active.backgroundColor).toBe(ACCENT_FILL);
      expect(active.color).toBe(ON_ACCENT_FILL);
      expect(contrast(resolve(theme, ON_ACCENT_FILL), resolve(theme, ACCENT_FILL))).toBeGreaterThanOrEqual(MIN);
      // Dots with no degree colour (exercise taps, chord tones outside the key)
      // use the same fill and readableTextOn() picks the matching label colour.
      expect(readableTextOn(ACCENT_FILL)).toBe(ON_ACCENT_FILL);
    });

    it(`${name}: whole-neck dot labels (body text on a pale degree tint)`, () => {
      for (const c of DOT_COLORS) {
        const tint = over(hexToRgb(c), 0x30 / 255, bg);
        expect(contrast(resolve(theme, 'var(--text)'), tint), c).toBeGreaterThanOrEqual(MIN);
      }
    });
  }

  it('solid degree-coloured dots get a readable black/white label', () => {
    for (const c of DOT_COLORS) {
      const text = readableTextOn(c);
      expect(contrast(hexToRgb(text), hexToRgb(c)), c).toBeGreaterThanOrEqual(MIN);
    }
  });
});

describe('tap targets and text size (W3-14)', () => {
  it('chips are at least 24 px and use 12 px text', () => {
    expect(CHIP_MIN_PX).toBeGreaterThanOrEqual(24);
    expect(CHIP_TEXT_PX).toBeGreaterThanOrEqual(12);
    const s = chipStyle(false);
    expect(Number(s.minHeight)).toBeGreaterThanOrEqual(24);
    expect(Number(s.minWidth)).toBeGreaterThanOrEqual(24);
  });
});
