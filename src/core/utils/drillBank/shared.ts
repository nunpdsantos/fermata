/**
 * Shared helpers and lookup tables for the drillBank generators.
 *
 * FAMILY_BASE rank layout:
 *   degree  0        stride 2   max  14*2-1  = 27
 *   circle  100      stride 2   max  100+82  = 182
 *   keysig  200      stride 10  max  200+10*14+6 = 346  < 600 (next family base)
 *   interval 600
 *   triad   1200
 *   scale   1700
 *   seventh 2400
 *   roman   3000
 *   function 3800
 */

import { buildScale, getRelativeMinor } from '../../constants/scales';
import type { Note } from '../../types/music';
import { noteToString } from '../../types/music';
import type { NaturalNote } from '../../types/music';
import type { DrillFamily } from '../../types/drill';
import { mulberry32, seededShuffle } from '../prng';

// ---------------------------------------------------------------------------
// Note constructor shorthand
// ---------------------------------------------------------------------------

export const N = (natural: NaturalNote, accidental: Note['accidental'] = ''): Note => ({
  natural,
  accidental,
});

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

/** Convert ASCII note string to unicode display (e.g. "F#" → "F♯", "Bb" → "B♭"). */
export function displayNote(n: Note): string {
  return noteToString(n)
    .replace(/##/g, '𝄪')
    .replace(/#/g, '♯')
    .replace(/bb/g, '𝄫')
    .replace(/b/g, '♭');
}

// ---------------------------------------------------------------------------
// Static key tables
// ---------------------------------------------------------------------------

/** All 15 major keys (circle order: sharps then flats). */
export const MAJOR_KEYS: Note[] = [
  N('C'),
  N('G'),
  N('D'),
  N('A'),
  N('E'),
  N('B'),
  N('F', '#'),
  N('C', '#'),
  N('F'),
  N('B', 'b'),
  N('E', 'b'),
  N('A', 'b'),
  N('D', 'b'),
  N('G', 'b'),
  N('C', 'b'),
];

/** Standard order of sharps in a key signature: F C G D A E B (all as sharps). */
export const SHARP_ORDER: Note[] = (['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const).map((l) =>
  N(l as NaturalNote, '#'),
);

/** Standard order of flats in a key signature: B E A D G C F (all as flats). */
export const FLAT_ORDER: Note[] = (['B', 'E', 'A', 'D', 'G', 'C', 'F'] as const).map((l) =>
  N(l as NaturalNote, 'b'),
);

/**
 * Priority order for rank computation — common keys first.
 * Keys stored as ASCII noteToString values.
 */
export const KEY_PRIORITY = [
  'C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'B', 'Db', 'F#', 'Gb', 'C#', 'Cb',
];

// ---------------------------------------------------------------------------
// Family rank bases
// ---------------------------------------------------------------------------

export const FAMILY_BASE: Record<DrillFamily, number> = {
  degree: 0,
  circle: 100,
  keysig: 200,
  interval: 600,
  triad: 1200,
  scale: 1700,
  seventh: 2400,
  roman: 3000,
  function: 3800,
};

// ---------------------------------------------------------------------------
// Rank helper
// ---------------------------------------------------------------------------

/**
 * Compute rank for an item keyed by a major-key string (ASCII noteToString).
 * Common keys sort first within a family.
 *
 * Circle and degree use stride 2 (as-is).
 * Keysig uses stride 10 to pack 7 offsets per key without collision:
 *   +0 key-to-count(major), +1 key-to-acc, +2 sig-to-key:major, +3 sig-to-key:minor,
 *   +4 rel-minor, +5 rel-major, +6 key-to-count(minor)
 * keysig max = 200 + 10*14 + 6 = 346, safely below keysig's next-family base (600).
 */
export function rankFor(family: DrillFamily, keyStr: string, offset = 0): number {
  const idx = KEY_PRIORITY.indexOf(keyStr);
  if (idx === -1) throw new Error(`rankFor: unknown key "${keyStr}"`);
  if (family === 'keysig') {
    return FAMILY_BASE[family] + 10 * idx + offset;
  }
  return FAMILY_BASE[family] + 4 * idx + offset;
}

// ---------------------------------------------------------------------------
// Deterministic shuffle helper (djb2 hash → mulberry32 seed)
// ---------------------------------------------------------------------------

export function djb2(s: string): number {
  let h = 5381;
  for (const c of s) {
    h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  }
  return h;
}

/** Shuffle choices deterministically based on a salt string. */
export function shuffleStable(choices: string[], salt: string): string[] {
  return seededShuffle(choices, mulberry32(djb2(salt)));
}

// ---------------------------------------------------------------------------
// Key signature engine
// ---------------------------------------------------------------------------

export interface KeySig {
  count: number;
  type: '#' | 'b' | 'none';
  accidentals: Note[];
}

/**
 * Derive key signature data for any major tonic by examining buildScale output.
 * Accidentals are returned in standard SHARP_ORDER / FLAT_ORDER sequence.
 */
export function keySignatureOf(majorTonic: Note): KeySig {
  const altered = buildScale(majorTonic, 'major').notes.filter((n) => n.accidental !== '');
  if (altered.length === 0) return { count: 0, type: 'none', accidentals: [] };
  const type = altered[0].accidental === '#' || altered[0].accidental === '##' ? '#' : 'b';
  const order = type === '#' ? SHARP_ORDER : FLAT_ORDER;
  return { count: altered.length, type, accidentals: order.slice(0, altered.length) };
}

/** All 14 practical roots used by triad and interval generators. */
export const PRACTICAL_ROOTS: Note[] = [
  N('C'),
  N('C', '#'),
  N('D', 'b'),
  N('D'),
  N('E', 'b'),
  N('E'),
  N('F'),
  N('F', '#'),
  N('G', 'b'),
  N('G'),
  N('A', 'b'),
  N('A'),
  N('B', 'b'),
  N('B'),
];

// Re-export for convenience in generators
export { noteToString, getRelativeMinor };
