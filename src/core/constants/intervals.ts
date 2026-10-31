// Interval constants
//
// (Audit W9-17 / C-90: the unused buildInterval — which spelled by pitch
// class, so C + 3 semitones came out D# instead of Eb — and its unused name
// table were deleted.)

import type { Interval } from '../types/music';

// ============================================================================
// Interval Name Lookups
// ============================================================================

/** Maps interval abbreviations to semitone counts (case-sensitive: M = major, m = minor) */
export const ABBREVIATION_TO_SEMITONES: Record<string, number> = {
  P1: 0,
  m2: 1,
  M2: 2,
  m3: 3,
  M3: 4,
  P4: 5,
  A4: 6,
  d5: 6,
  TT: 6,
  P5: 7,
  m6: 8,
  M6: 9,
  m7: 10,
  M7: 11,
  P8: 12,
};

// ============================================================================
// Semitone to Interval Object
// ============================================================================

/** Maps semitone count to default Interval object */
export const SEMITONES_TO_INTERVAL: Record<number, Interval> = {
  0: { quality: 'perfect', number: 1, semitones: 0 },
  1: { quality: 'minor', number: 2, semitones: 1 },
  2: { quality: 'major', number: 2, semitones: 2 },
  3: { quality: 'minor', number: 3, semitones: 3 },
  4: { quality: 'major', number: 3, semitones: 4 },
  5: { quality: 'perfect', number: 4, semitones: 5 },
  6: { quality: 'augmented', number: 4, semitones: 6 },
  7: { quality: 'perfect', number: 5, semitones: 7 },
  8: { quality: 'minor', number: 6, semitones: 8 },
  9: { quality: 'major', number: 6, semitones: 9 },
  10: { quality: 'minor', number: 7, semitones: 10 },
  11: { quality: 'major', number: 7, semitones: 11 },
  12: { quality: 'perfect', number: 8, semitones: 12 },
};
