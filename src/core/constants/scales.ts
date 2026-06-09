// Scale formulas and definitions

import { ScaleType, Note, NaturalNote, Scale } from '../types/music';
import { getPitchClass, getNaturalAtInterval, NATURAL_TO_PITCH_CLASS, getSimplestSpelling } from './notes';
import { INTERVAL_SHORT_LABELS } from './chords';

// Scale formulas as semitone intervals from root
// Each number is the semitone distance from the root
export const SCALE_FORMULAS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  natural_minor: [0, 2, 3, 5, 7, 8, 10],
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
  melodic_minor: [0, 2, 3, 5, 7, 9, 11], // ascending form
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  pentatonic_major: [0, 2, 4, 7, 9],
  pentatonic_minor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
  // Symmetric and chromatic scales
  whole_tone: [0, 2, 4, 6, 8, 10],
  diminished_whole_half: [0, 2, 3, 5, 6, 8, 9, 11],
  diminished_half_whole: [0, 1, 3, 4, 6, 7, 9, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  // Advanced scales (Phase 1)
  altered: [0, 1, 3, 4, 6, 8, 10], // Mode 7 of melodic minor (Super Locrian)
  lydian_dominant: [0, 2, 4, 6, 7, 9, 10], // Mode 4 of melodic minor (Lydian b7)
  phrygian_dominant: [0, 1, 4, 5, 7, 8, 10], // Mode 5 of harmonic minor (Spanish Phrygian)
  major_blues: [0, 2, 3, 4, 7, 9], // Major pentatonic with added b3
  locrian_natural2: [0, 2, 3, 5, 6, 8, 10], // Mode 6 of melodic minor (Half-Diminished Scale)
  // Phase 2 - Bebop scales (8 notes)
  bebop_dominant: [0, 2, 4, 5, 7, 9, 10, 11], // Mixolydian with added major 7th
  bebop_major: [0, 2, 4, 5, 7, 8, 9, 11], // Major with added b6
  bebop_dorian: [0, 2, 3, 4, 5, 7, 9, 10], // Dorian with added major 3rd
  // Phase 2 - Remaining melodic minor modes
  dorian_b2: [0, 1, 3, 5, 7, 9, 10], // Mode 2 of melodic minor (Phrygian #6)
  lydian_augmented: [0, 2, 4, 6, 8, 9, 11], // Mode 3 of melodic minor (Lydian #5)
  mixolydian_b6: [0, 2, 4, 5, 7, 8, 10], // Mode 5 of melodic minor (Aeolian Dominant)
  // Phase 3 - World/Ethnic scales
  // European/Middle Eastern
  hungarian_minor: [0, 2, 3, 6, 7, 8, 11], // Gypsy Minor, Double Harmonic Minor
  hungarian_major: [0, 3, 4, 6, 7, 9, 10], // Major-ish with augmented 2nd
  double_harmonic: [0, 1, 4, 5, 7, 8, 11], // Byzantine, Arabic, Gypsy Major, Hijaz Kar
  persian: [0, 1, 4, 5, 6, 8, 11], // Distinctive Middle Eastern scale
  neapolitan_minor: [0, 1, 3, 5, 7, 8, 11], // Harmonic minor with lowered 2nd
  neapolitan_major: [0, 1, 3, 5, 7, 9, 11], // Melodic minor with lowered 2nd
  // Japanese pentatonic
  hirajoshi: [0, 2, 3, 7, 8], // Traditional Japanese pentatonic
  in_sen: [0, 1, 5, 7, 10], // Japanese pentatonic, dark/mysterious
  iwato: [0, 1, 5, 6, 10], // Japanese pentatonic, very dark
  // Other world
  egyptian: [0, 2, 5, 7, 10], // Suspended pentatonic (no 3rd or 6th)
};

// Scale degree names
export const SCALE_DEGREE_NAMES = [
  'Tonic', // 1
  'Supertonic', // 2
  'Mediant', // 3
  'Subdominant', // 4
  'Dominant', // 5
  'Submediant', // 6
  'Leading Tone', // 7 — default; use getSeventhDegreeName() for context-aware label
];

// Internal helper for the deprecated `getSeventhDegreeName` export below.
const SUBTONIC_SCALES = new Set<string>([
  'natural_minor',
  'dorian',
  'phrygian',
  'mixolydian',
  'locrian',
  'blues',
  'pentatonic_minor',
  'altered',
  'lydian_dominant',
  'dorian_b2',
  'mixolydian_b6',
  'locrian_natural2',
  'phrygian_dominant',
  'hungarian_major',
]);

// Context-aware 7th degree name. UI paths use `getScaleDegreeFunctionKey`
// (semitone-based); this scale-type-keyed variant is exercised by
// `scripts/audit/verify-engine.ts`.
export function getSeventhDegreeName(scaleType?: string): string {
  if (scaleType && SUBTONIC_SCALES.has(scaleType)) return 'Subtonic';
  return 'Leading Tone';
}

// Letter-aware short interval label for a scale degree. The same semitone count
// spells differently depending on letter position: 8 semitones at degree 6 is
// b6 (minor 6th), at degree 5 is #5 (augmented 5th). Only 7-note scales follow
// strict letter-per-degree; other lengths fall back to semitone-based labels.
const INTERVAL_LABEL_BY_DEGREE: Record<number, Record<number, string>> = {
  0: { 0: 'R' },
  1: { 1: 'b2', 2: '2', 3: '#2' },
  2: { 2: 'bb3', 3: 'b3', 4: '3' },
  3: { 4: 'b4', 5: '4', 6: '#4' },
  4: { 6: 'b5', 7: '5', 8: '#5' },
  5: { 7: 'bb6', 8: 'b6', 9: '6', 10: '#6' },
  6: { 9: 'bb7', 10: 'b7', 11: '7' },
};

export function getScaleDegreeIntervalLabel(
  degreeIndex: number,
  semitones: number,
  totalNotes: number,
): string {
  if (totalNotes === 7) {
    const byDegree = INTERVAL_LABEL_BY_DEGREE[degreeIndex]?.[semitones];
    if (byDegree) return byDegree;
  }
  return INTERVAL_SHORT_LABELS[semitones] ?? `${semitones}`;
}

// i18n key for the functional name of a scale degree (tonic, supertonic, etc.).
// Leading/subtonic for degree 7 depends on whether the semitone distance is 11 or 10.
export function getScaleDegreeFunctionKey(
  degreeIndex: number,
  semitones: number,
): string | null {
  switch (degreeIndex) {
    case 0: return 'degreeShort.tonic';
    case 1: return 'degreeShort.supertonic';
    case 2: return 'degreeShort.mediant';
    case 3: return 'degreeShort.subdominant';
    case 4: return semitones === 6 ? 'degreeShort.tritone' : 'degreeShort.dominant';
    case 5: return 'degreeShort.submediant';
    case 6: return semitones === 11 ? 'degreeShort.leading' : 'degreeShort.subtonic';
    default: return null;
  }
}

// Display names for scale types
export const SCALE_TYPE_NAMES: Record<ScaleType, string> = {
  major: 'Major',
  natural_minor: 'Natural Minor',
  harmonic_minor: 'Harmonic Minor',
  melodic_minor: 'Melodic Minor',
  dorian: 'Dorian',
  phrygian: 'Phrygian',
  lydian: 'Lydian',
  mixolydian: 'Mixolydian',
  locrian: 'Locrian',
  pentatonic_major: 'Major Pentatonic',
  pentatonic_minor: 'Minor Pentatonic',
  blues: 'Blues',
  // Symmetric and chromatic scales
  whole_tone: 'Whole Tone',
  diminished_whole_half: 'Diminished (W-H)',
  diminished_half_whole: 'Diminished (H-W)',
  chromatic: 'Chromatic',
  // Advanced scales (Phase 1)
  altered: 'Altered',
  lydian_dominant: 'Lydian Dominant',
  phrygian_dominant: 'Phrygian Dominant',
  major_blues: 'Major Blues',
  locrian_natural2: 'Locrian ♮2',
  // Phase 2 - Bebop scales
  bebop_dominant: 'Bebop Dominant',
  bebop_major: 'Bebop Major',
  bebop_dorian: 'Bebop Dorian',
  // Phase 2 - Remaining melodic minor modes
  dorian_b2: 'Dorian ♭2',
  lydian_augmented: 'Lydian Augmented',
  mixolydian_b6: 'Mixolydian ♭6',
  // Phase 3 - World/Ethnic scales
  hungarian_minor: 'Hungarian Minor',
  hungarian_major: 'Hungarian Major',
  double_harmonic: 'Double Harmonic',
  persian: 'Persian',
  neapolitan_minor: 'Neapolitan Minor',
  neapolitan_major: 'Neapolitan Major',
  hirajoshi: 'Hirajoshi',
  in_sen: 'In Sen',
  iwato: 'Iwato',
  egyptian: 'Egyptian',
};

// Calculate the correct accidental for a scale degree
function getAccidentalForPitchClass(targetPitchClass: number, natural: NaturalNote): Note {
  const basePitchClass = NATURAL_TO_PITCH_CLASS[natural];
  const diff = (targetPitchClass - basePitchClass + 12) % 12;

  // Handle cases where the difference could be negative (flats) or positive (sharps)
  if (diff === 0) {
    return { natural, accidental: '' };
  } else if (diff === 1) {
    return { natural, accidental: '#' };
  } else if (diff === 11) {
    return { natural, accidental: 'b' };
  } else if (diff === 2) {
    return { natural, accidental: '##' };
  } else if (diff === 10) {
    return { natural, accidental: 'bb' };
  }

  // Out of double-accidental range (e.g. F### in B#-rooted scales): the
  // one-letter-per-degree rule yields and the pitch is respelled
  // enharmonically — a right-sounding note beats a pure letter name.
  return getSimplestSpelling(targetPitchClass as Parameters<typeof getSimplestSpelling>[0]);
}

// Build a scale with correct enharmonic spelling
// This ensures each letter name appears once (for 7-note scales)
export function buildScale(root: Note, type: ScaleType): Scale {
  const formula = SCALE_FORMULAS[type];
  const rootPitchClass = getPitchClass(root);
  const notes: Note[] = [];

  for (let i = 0; i < formula.length; i++) {
    const targetPitchClass = (rootPitchClass + formula[i]) % 12;

    // For non-7-note scales, use scale degree mapping
    const degreeMap: Record<string, number[]> = {
      pentatonic_major: [0, 1, 2, 4, 5], // 1, 2, 3, 5, 6
      pentatonic_minor: [0, 2, 3, 4, 6], // 1, b3, 4, 5, b7
      blues: [0, 2, 3, 3, 4, 6], // 1, b3, 4, b5, 5, b7
      major_blues: [0, 1, 2, 2, 4, 5], // 1, 2, b3, 3, 5, 6 (Major pentatonic + blue note)
      whole_tone: [0, 1, 2, 3, 4, 5], // 6 notes, each a whole step
      diminished_whole_half: [0, 1, 2, 3, 4, 5, 6, 6], // 8 notes
      diminished_half_whole: [0, 1, 2, 3, 4, 5, 6, 6], // 8 notes
      chromatic: [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6], // 12 notes - sharps ascending
      // Phase 2 - Bebop scales (8 notes)
      bebop_dominant: [0, 1, 2, 3, 4, 5, 6, 6], // 1, 2, 3, 4, 5, 6, b7, 7
      bebop_major: [0, 1, 2, 3, 4, 5, 5, 6], // 1, 2, 3, 4, 5, b6, 6, 7
      bebop_dorian: [0, 1, 2, 2, 3, 4, 5, 6], // 1, 2, b3, 3, 4, 5, 6, b7
      // Phase 3 - Japanese pentatonic (5 notes)
      hirajoshi: [0, 1, 2, 4, 5], // 1, 2, b3, 5, b6
      in_sen: [0, 1, 3, 4, 6], // 1, b2, 4, 5, b7
      iwato: [0, 1, 3, 4, 6], // 1, b2, 4, b5, b7
      // Phase 3 - Egyptian pentatonic (5 notes)
      egyptian: [0, 1, 3, 4, 6], // 1, 2, 4, 5, b7 (suspended pentatonic)
    };

    if (degreeMap[type]) {
      const degrees = degreeMap[type];
      const natural = getNaturalAtInterval(root.natural, degrees[i]);
      notes.push(getAccidentalForPitchClass(targetPitchClass, natural));
    } else {
      // For 7-note scales, each letter name appears once
      const natural = getNaturalAtInterval(root.natural, i);
      notes.push(getAccidentalForPitchClass(targetPitchClass, natural));
    }
  }

  return { root, type, notes };
}

// Get relative minor of a major key
export function getRelativeMinor(majorRoot: Note): Note {
  const majorPitchClass = getPitchClass(majorRoot);
  const minorPitchClass = (majorPitchClass + 9) % 12; // Down 3 semitones = up 9
  const minorNatural = getNaturalAtInterval(majorRoot.natural, 5); // 6th degree
  return getAccidentalForPitchClass(minorPitchClass, minorNatural);
}

// Get relative major of a minor key
export function getRelativeMajor(minorRoot: Note): Note {
  const minorPitchClass = getPitchClass(minorRoot);
  const majorPitchClass = (minorPitchClass + 3) % 12; // Up 3 semitones
  const majorNatural = getNaturalAtInterval(minorRoot.natural, 2); // 3rd degree
  return getAccidentalForPitchClass(majorPitchClass, majorNatural);
}

// Get parallel minor (same root, different mode)
export function getParallelMinor(majorRoot: Note): Note {
  return majorRoot; // Same root note
}

// Get parallel major
export function getParallelMajor(minorRoot: Note): Note {
  return minorRoot; // Same root note
}
