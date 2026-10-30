/* eslint-disable no-restricted-syntax -- readableTextOn() returns pure black
   or white, chosen by WCAG contrast against a computed dot colour; there is
   no theme token for "the most readable of black/white on this hex". */
import type { FingerNumber } from '../../core/constants/guitarChordShapes.ts';
import { GUITAR_MAX_FRET } from '../../core/utils/guitarPositions.ts';

/** Frets drawn on the full neck — the same limit the position engine respects. */
export const FULL_FRETS = GUITAR_MAX_FRET;
export const CHORD_FRET_WINDOW = 5;
export const FRET_MARKERS = [3, 5, 7, 9, 12, 15];
export const DOUBLE_MARKERS = [12];

export interface FretNote {
  stringIndex: number; // 0 = 6th (low E), 5 = 1st (high E)
  fret: number;
  pitchClass: number;
  midiNumber: number;
}

/** Finger label for display. 0 = open/muted (no label), 'bar' = index finger (1). */
export function fingerLabel(f: FingerNumber | undefined): string {
  if (f === undefined || f === 0) return '';
  if (f === 'bar') return '1';
  return String(f);
}

/** A dot drawn in a scale position (classical position view). */
export interface PositionDot {
  label: string;
  isRoot: boolean;
  isStretch: boolean;
  /** The learner's own fingering is shown (W10-05). */
  isEdited: boolean;
  /** Spoken description for screen readers ("finger 2, degree b3"). */
  description: string;
}

function relativeLuminance(hex: string): number | null {
  const m = /^#([0-9a-f]{6})/i.exec(hex.trim());
  if (!m) return null;
  const ch = (i: number) => {
    const v = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4);
}

/**
 * Black or white, whichever reads better on a solid `bg` (WCAG contrast).
 * Degree colours are light, so this is black for them; the darker walnut of
 * the "degree colours off" palette gets white. Non-hex (CSS variable)
 * backgrounds are the accent, which pairs with the page background colour.
 */
export function readableTextOn(bg: string): string {
  const l = relativeLuminance(bg);
  if (l === null) return 'var(--bg)';
  const onBlack = (l + 0.05) / 0.05;
  const onWhite = 1.05 / (l + 0.05);
  return onBlack >= onWhite ? '#000' : '#fff';
}

// Shared chip look (audit W3-14): ≥ 24 px tap targets, 12 px text, theme
// tokens only — inactive text is --text-muted on --bg, active is --bg on
// --accent (contrast checked in __tests__/fretboardContrast.test.ts).
export const CHIP_CLASS = 'inline-flex items-center justify-center rounded transition-colors font-medium';
export const CHIP_TEXT_PX = 12;
export const CHIP_MIN_PX = 28;

export function chipStyle(isActive: boolean, disabled = false): React.CSSProperties {
  return {
    minHeight: CHIP_MIN_PX,
    minWidth: CHIP_MIN_PX,
    padding: '0 8px',
    fontSize: CHIP_TEXT_PX,
    backgroundColor: isActive ? 'var(--accent)' : 'transparent',
    color: isActive ? 'var(--bg)' : 'var(--text-muted)',
    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'default' : 'pointer',
  };
}

