// Chord formulas and definitions

import {
  ChordQuality,
  Note,
  NaturalNote,
  Chord,
  SlashChord,
  PitchedNote,
} from '../types/music';
import { getPitchClass, NATURAL_TO_PITCH_CLASS, getSimplestSpelling } from './notes';

// Natural notes in order for letter distance calculations
const NATURALS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Get the natural note at a given letter distance from the root
function getNaturalAtLetterDistance(rootNatural: NaturalNote, letterDistance: number): NaturalNote {
  const rootIndex = NATURALS.indexOf(rootNatural);
  const targetIndex = (rootIndex + letterDistance) % 7;
  return NATURALS[targetIndex];
}

// Spell a target pitch class on a preferred natural letter. When the correct
// spelling would need a triple accidental (e.g. F### in B#-rooted chords), the
// letter rule yields and the pitch is respelled enharmonically — a
// right-sounding note beats a pure letter name.
function spellTargetPitchClass(targetPitchClass: number, targetNatural: NaturalNote): Note {
  const naturalPitchClass = NATURAL_TO_PITCH_CLASS[targetNatural];
  const diff = (targetPitchClass - naturalPitchClass + 12) % 12;

  if (diff === 0) return { natural: targetNatural, accidental: '' };
  if (diff === 1) return { natural: targetNatural, accidental: '#' };
  if (diff === 11) return { natural: targetNatural, accidental: 'b' };
  if (diff === 2) return { natural: targetNatural, accidental: '##' };
  if (diff === 10) return { natural: targetNatural, accidental: 'bb' };

  return getSimplestSpelling(targetPitchClass as Parameters<typeof getSimplestSpelling>[0]);
}

// Build a Note from a natural note and target pitch class
function buildNoteFromNaturalAndPitchClass(
  targetNatural: NaturalNote,
  targetPitchClass: number
): Note {
  return spellTargetPitchClass(targetPitchClass, targetNatural);
}

// Chord formulas as semitone intervals from root
export const CHORD_FORMULAS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  major6: [0, 4, 7, 9],
  minor6: [0, 3, 7, 9],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10],
  diminished7: [0, 3, 6, 9],
  half_diminished7: [0, 3, 6, 10],
  augmented7: [0, 4, 8, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  add9: [0, 4, 7, 14], // Root, major 3rd, perfect 5th, major 9th
  // Additional chord types
  minor_major7: [0, 3, 7, 11], // mMaj7 - minor triad + major 7th
  power: [0, 7], // 5 - root + perfect 5th only
  dominant7sus4: [0, 5, 7, 10], // 7sus4 - suspended dominant
  major9: [0, 4, 7, 11, 14], // Maj9 - major 7th + major 9th
  minor9: [0, 3, 7, 10, 14], // m9 - minor 7th + major 9th
  dominant9: [0, 4, 7, 10, 14], // 9 - dominant 7th + major 9th
  // Altered Dominants
  dominant7flat9: [0, 4, 7, 10, 13], // 7b9 - dominant 7th + minor 9th
  dominant7sharp9: [0, 4, 7, 10, 15], // 7#9 - dominant 7th + augmented 9th
  dominant7flat5: [0, 4, 6, 10], // 7b5 - dominant 7th with diminished 5th
  dominant7sharp5: [0, 4, 8, 10], // 7#5 - same as augmented7
  dominant7alt: [0, 4, 10, 13, 15, 18, 20], // 7alt - R, 3, b7 + all four alterations: b9, #9, #11, b13 (5th omitted, standard for alt)
  // Extended Chords
  dominant11: [0, 7, 10, 14, 17], // 11 - 3rd omitted (minor 9th clash with 11th)
  major11: [0, 7, 11, 14, 17], // maj11 - 3rd omitted (minor 9th clash with 11th)
  minor11: [0, 3, 7, 10, 14, 17], // m11 - minor 9th + perfect 11th
  dominant9sharp11: [0, 4, 7, 10, 14, 18], // 9#11 - dominant 9th + augmented 11th
  dominant13: [0, 4, 7, 10, 14, 21], // 13 - dominant 9th + major 13th
  major13: [0, 4, 7, 11, 14, 21], // maj13 - major 9th + major 13th
  minor13: [0, 3, 7, 10, 14, 21], // m13 - minor 9th + major 13th
  dominant13flat9: [0, 4, 7, 10, 13, 21], // 13b9 - dominant 13th with flat 9
  // Added Tones
  add11: [0, 4, 7, 17], // add11 - major triad + perfect 11th
  six_nine: [0, 4, 7, 9, 14], // 6/9 - major 6th + major 9th
  minor_six_nine: [0, 3, 7, 9, 14], // m6/9 - minor 6th + major 9th
  // Additional Suspensions
  dominant9sus4: [0, 5, 7, 10, 14], // 9sus4 - suspended dominant 9th
  sus2sus4: [0, 2, 5, 7], // sus2/4 - both suspensions
  // Altered 5ths with Major 7
  augmented_major7: [0, 4, 8, 11], // maj7#5 - augmented triad + major 7th
  major7flat5: [0, 4, 6, 11], // maj7b5 - major 7th with diminished 5th
  // Diminished Major 7 (rare - found in horror scores)
  diminished_major7: [0, 3, 6, 11], // dim(maj7) - diminished triad + major 7th
  // Major 7 #11 (Lydian chord)
  major7sharp11: [0, 4, 7, 11, 18], // maj7#11 - major 7th + augmented 11th
  // Combination altered dominants
  dominant7sharp5flat9: [0, 4, 8, 10, 13], // 7#5b9 - augmented dom7 + flat 9
  dominant7flat5flat9: [0, 4, 6, 10, 13], // 7b5b9 - flat 5 dom7 + flat 9
  dominant7sharp5sharp9: [0, 4, 8, 10, 15], // 7#5#9 - augmented dom7 + sharp 9
  dominant7flat5sharp9: [0, 4, 6, 10, 15], // 7b5#9 - flat 5 dom7 + sharp 9
};

// Letter distance from root for each chord tone
// 0 = root letter, 2 = 3rd letter, 4 = 5th letter, 6 = 7th letter, 1 = 9th (2nd), 3 = 11th (4th), 5 = 13th (6th)
// This is CRITICAL for correct enharmonic spelling - determines the letter name before calculating accidentals
export const CHORD_LETTER_DISTANCES: Record<ChordQuality, number[]> = {
  // Triads: Root, 3rd, 5th
  major: [0, 2, 4],
  minor: [0, 2, 4],
  diminished: [0, 2, 4],
  augmented: [0, 2, 4],

  // 6th chords: Root, 3rd, 5th, 6th (letter distance 5)
  major6: [0, 2, 4, 5],
  minor6: [0, 2, 4, 5],

  // 7th chords: Root, 3rd, 5th, 7th (letter distance 6)
  major7: [0, 2, 4, 6],
  minor7: [0, 2, 4, 6],
  dominant7: [0, 2, 4, 6],
  diminished7: [0, 2, 4, 6], // CRITICAL: 7th is letter distance 6, not 5!
  half_diminished7: [0, 2, 4, 6],
  augmented7: [0, 2, 4, 6],
  minor_major7: [0, 2, 4, 6],
  augmented_major7: [0, 2, 4, 6],
  major7flat5: [0, 2, 4, 6],
  diminished_major7: [0, 2, 4, 6],

  // Suspended chords
  sus2: [0, 1, 4], // 2nd is letter distance 1
  sus4: [0, 3, 4], // 4th is letter distance 3
  sus2sus4: [0, 1, 3, 4],
  dominant7sus4: [0, 3, 4, 6],
  dominant9sus4: [0, 3, 4, 6, 1],

  // Add chords
  add9: [0, 2, 4, 1], // 9th wraps to letter distance 1 (same as 2nd)
  add11: [0, 2, 4, 3], // 11th is letter distance 3 (same as 4th)

  // Power chord
  power: [0, 4],

  // 9th chords: Root, 3rd, 5th, 7th, 9th
  major9: [0, 2, 4, 6, 1],
  minor9: [0, 2, 4, 6, 1],
  dominant9: [0, 2, 4, 6, 1],

  // Altered dominants
  dominant7flat9: [0, 2, 4, 6, 1],
  dominant7sharp9: [0, 2, 4, 6, 1],
  dominant7flat5: [0, 2, 4, 6],
  dominant7sharp5: [0, 2, 4, 6],
  dominant7alt: [0, 2, 6, 1, 1, 3, 5], // R, 3rd, b7th, b9 + #9 share the 2nd letter (Db/D# over C), #11 on the 4th, b13 on the 6th

  // 11th chords: Root, 5th, 7th, 9th, 11th (3rd omitted)
  dominant11: [0, 4, 6, 1, 3],
  major11: [0, 4, 6, 1, 3],
  minor11: [0, 2, 4, 6, 1, 3],
  dominant9sharp11: [0, 2, 4, 6, 1, 3],

  // 13th chords: Root, 3rd, 5th, 7th, 9th, 13th (11th often omitted)
  dominant13: [0, 2, 4, 6, 1, 5],
  major13: [0, 2, 4, 6, 1, 5],
  minor13: [0, 2, 4, 6, 1, 5],
  dominant13flat9: [0, 2, 4, 6, 1, 5],

  // 6/9 chords: Root, 3rd, 5th, 6th, 9th
  six_nine: [0, 2, 4, 5, 1],
  minor_six_nine: [0, 2, 4, 5, 1],

  // Major 7 #11 (Lydian): Root, 3rd, 5th, 7th, 11th
  major7sharp11: [0, 2, 4, 6, 3],

  // Combination altered dominants: Root, 3rd, 5th, 7th, 9th
  dominant7sharp5flat9: [0, 2, 4, 6, 1],
  dominant7flat5flat9: [0, 2, 4, 6, 1],
  dominant7sharp5sharp9: [0, 2, 4, 6, 1],
  dominant7flat5sharp9: [0, 2, 4, 6, 1],
};

// Chord quality display names
export const CHORD_QUALITY_NAMES: Record<ChordQuality, string> = {
  major: 'Major',
  minor: 'Minor',
  diminished: 'Diminished',
  augmented: 'Augmented',
  major6: 'Major 6th',
  minor6: 'Minor 6th',
  major7: 'Major 7th',
  minor7: 'Minor 7th',
  dominant7: 'Dominant 7th',
  diminished7: 'Diminished 7th',
  half_diminished7: 'Half-Diminished 7th',
  augmented7: 'Augmented 7th',
  sus2: 'Suspended 2nd',
  sus4: 'Suspended 4th',
  add9: 'Add 9',
  // Additional chord types
  minor_major7: 'Minor-Major 7th',
  power: 'Power Chord',
  dominant7sus4: 'Dominant 7th Sus4',
  major9: 'Major 9th',
  minor9: 'Minor 9th',
  dominant9: 'Dominant 9th',
  // Altered Dominants
  dominant7flat9: 'Dominant 7th Flat 9',
  dominant7sharp9: 'Dominant 7th Sharp 9',
  dominant7flat5: 'Dominant 7th Flat 5',
  dominant7sharp5: 'Dominant 7th Sharp 5',
  dominant7alt: 'Altered Dominant',
  // Extended Chords
  dominant11: 'Dominant 11th',
  major11: 'Major 11th',
  minor11: 'Minor 11th',
  dominant9sharp11: 'Dominant 9th Sharp 11',
  dominant13: 'Dominant 13th',
  major13: 'Major 13th',
  minor13: 'Minor 13th',
  dominant13flat9: 'Dominant 13th Flat 9',
  // Added Tones
  add11: 'Add 11',
  six_nine: '6/9',
  minor_six_nine: 'Minor 6/9',
  // Additional Suspensions
  dominant9sus4: 'Dominant 9th Sus4',
  sus2sus4: 'Sus2/4',
  // Altered 5ths with Major 7
  augmented_major7: 'Augmented Major 7th',
  major7flat5: 'Major 7th Flat 5',
  // Diminished Major 7
  diminished_major7: 'Diminished Major 7th',
  // Major 7 #11
  major7sharp11: 'Major 7th Sharp 11',
  // Combination altered dominants
  dominant7sharp5flat9: 'Dominant 7th Sharp 5 Flat 9',
  dominant7flat5flat9: 'Dominant 7th Flat 5 Flat 9',
  dominant7sharp5sharp9: 'Dominant 7th Sharp 5 Sharp 9',
  dominant7flat5sharp9: 'Dominant 7th Flat 5 Sharp 9',
};

// Chord symbols (for display)
export const CHORD_SYMBOLS: Record<ChordQuality, string> = {
  major: '',
  minor: 'm',
  diminished: 'dim',
  augmented: 'aug',
  major6: '6',
  minor6: 'm6',
  major7: 'maj7',
  minor7: 'm7',
  dominant7: '7',
  diminished7: 'dim7',
  half_diminished7: 'm7b5',
  augmented7: 'aug7',
  sus2: 'sus2',
  sus4: 'sus4',
  add9: 'add9',
  // Additional chord types
  minor_major7: 'mMaj7',
  power: '5',
  dominant7sus4: '7sus4',
  major9: 'maj9',
  minor9: 'm9',
  dominant9: '9',
  // Altered Dominants
  dominant7flat9: '7b9',
  dominant7sharp9: '7#9',
  dominant7flat5: '7b5',
  dominant7sharp5: '7#5',
  dominant7alt: '7alt',
  // Extended Chords
  dominant11: '11',
  major11: 'maj11',
  minor11: 'm11',
  dominant9sharp11: '9#11',
  dominant13: '13',
  major13: 'maj13',
  minor13: 'm13',
  dominant13flat9: '13b9',
  // Added Tones
  add11: 'add11',
  six_nine: '6/9',
  minor_six_nine: 'm6/9',
  // Additional Suspensions
  dominant9sus4: '9sus4',
  sus2sus4: 'sus2/4',
  // Altered 5ths with Major 7
  augmented_major7: 'maj7#5',
  major7flat5: 'maj7b5',
  // Diminished Major 7
  diminished_major7: 'dim(maj7)',
  // Major 7 #11
  major7sharp11: 'maj7#11',
  // Combination altered dominants
  dominant7sharp5flat9: '7#5b9',
  dominant7flat5flat9: '7b5b9',
  dominant7sharp5sharp9: '7#5#9',
  dominant7flat5sharp9: '7b5#9',
};

// Build a chord with correct enharmonic spelling
// Uses CHORD_LETTER_DISTANCES to determine correct letter names, then calculates accidentals
export function buildChord(root: Note, quality: ChordQuality): Chord {
  const formula = CHORD_FORMULAS[quality];
  const letterDistances = CHORD_LETTER_DISTANCES[quality];

  if (!formula || !letterDistances) {
    console.warn(`Unknown chord quality: ${quality}`);
    return { root, quality, notes: [root] };
  }

  const rootPitchClass = getPitchClass(root);
  const notes: Note[] = [];

  for (let i = 0; i < formula.length; i++) {
    const semitones = formula[i];
    const letterDistance = letterDistances[i];

    // Get the target natural note (correct letter name based on chord structure)
    const targetNatural = getNaturalAtLetterDistance(root.natural, letterDistance);

    // Calculate what pitch class we need
    const targetPitchClass = (rootPitchClass + semitones) % 12;

    // Spell the tone on the structural letter (respelled if out of accidental range)
    notes.push(spellTargetPitchClass(targetPitchClass, targetNatural));
  }

  return { root, quality, notes };
}

// Get diatonic chords for a major key (triads)
export function getDiatonicTriads(root: Note): { chord: Chord; numeral: string }[] {
  const qualities: ChordQuality[] = [
    'major', // I
    'minor', // ii
    'minor', // iii
    'major', // IV
    'major', // V
    'minor', // vi
    'diminished', // vii°
  ];

  const numerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

  const rootPitchClass = getPitchClass(root);
  const scaleDegrees = [0, 2, 4, 5, 7, 9, 11]; // Major scale intervals

  return scaleDegrees.map((semitones, i) => {
    const degreePitchClass = (rootPitchClass + semitones) % 12;
    const degreeNatural = getNaturalAtLetterDistance(root.natural, i);
    const degreeRoot = buildNoteFromNaturalAndPitchClass(degreeNatural, degreePitchClass);

    return {
      chord: buildChord(degreeRoot, qualities[i]),
      numeral: numerals[i],
    };
  });
}

// Get diatonic seventh chords for a major key
export function getDiatonicSeventhChords(root: Note): { chord: Chord; numeral: string }[] {
  const qualities: ChordQuality[] = [
    'major7', // Imaj7
    'minor7', // ii7
    'minor7', // iii7
    'major7', // IVmaj7
    'dominant7', // V7
    'minor7', // vi7
    'half_diminished7', // viiø7
  ];

  const numerals = ['Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'viiø7'];

  const rootPitchClass = getPitchClass(root);
  const scaleDegrees = [0, 2, 4, 5, 7, 9, 11];

  return scaleDegrees.map((semitones, i) => {
    const degreePitchClass = (rootPitchClass + semitones) % 12;
    const degreeNatural = getNaturalAtLetterDistance(root.natural, i);
    const degreeRoot = buildNoteFromNaturalAndPitchClass(degreeNatural, degreePitchClass);

    return {
      chord: buildChord(degreeRoot, qualities[i]),
      numeral: numerals[i],
    };
  });
}

// Invert a chord (rearrange notes)
export function invertChord(chord: Chord, inversion: number): Chord {
  const notes = [...chord.notes];
  for (let i = 0; i < inversion && i < notes.length - 1; i++) {
    const first = notes.shift()!;
    notes.push(first);
  }
  return { ...chord, notes, inversion };
}

// Interval labels for each semitone distance (including compound intervals - BUG-016 fix)
export const INTERVAL_LABELS: Record<number, string> = {
  0: 'Root',
  1: 'Minor 2nd',
  2: 'Major 2nd',
  3: 'Minor 3rd',
  4: 'Major 3rd',
  5: 'Perfect 4th',
  6: 'Tritone',
  7: 'Perfect 5th',
  8: 'Minor 6th',
  9: 'Major 6th',
  10: 'Minor 7th',
  11: 'Major 7th',
  12: 'Octave',
  13: 'Minor 9th',
  14: 'Major 9th',
  15: 'Augmented 9th',
  16: 'Minor 10th',
  17: 'Perfect 11th',
  18: 'Augmented 11th',
  19: 'Perfect 12th',
  20: 'Minor 13th',
  21: 'Major 13th',
  22: 'Augmented 13th',
};

// Short interval labels for compact display (including compound intervals - BUG-016 fix)
export const INTERVAL_SHORT_LABELS: Record<number, string> = {
  0: 'R',
  1: 'm2',
  2: '2',
  3: 'm3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7',
  12: '8',
  13: 'b9',
  14: '9',
  15: '#9',
  16: 'm10',
  17: '11',
  18: '#11',
  19: 'P12',
  20: 'b13',
  21: '13',
  22: '#13',
};

// Chord-context interval-label overrides. The generic tables name 8 semitones
// "Minor 6th"/"b6" (correct for interval ID and scale degrees), but inside the
// augmented chord family that tone is spelled as a raised 5th.
const CHORD_CONTEXT_LABELS: Partial<Record<ChordQuality, Record<number, { label: string; short: string }>>> = {
  augmented: { 8: { label: 'Augmented 5th', short: '#5' } },
  augmented7: { 8: { label: 'Augmented 5th', short: '#5' } },
  augmented_major7: { 8: { label: 'Augmented 5th', short: '#5' } },
  dominant7sharp5: { 8: { label: 'Augmented 5th', short: '#5' } },
  dominant7sharp5flat9: { 8: { label: 'Augmented 5th', short: '#5' } },
  dominant7sharp5sharp9: { 8: { label: 'Augmented 5th', short: '#5' } },
};

// Get interval labels for a chord quality
export function getChordIntervalLabels(quality: ChordQuality): string[] {
  const formula = CHORD_FORMULAS[quality];
  return formula.map(
    (semitones) =>
      CHORD_CONTEXT_LABELS[quality]?.[semitones]?.label ?? INTERVAL_LABELS[semitones] ?? `${semitones} st`,
  );
}

// Get short interval labels for a chord quality
export function getChordShortIntervalLabels(quality: ChordQuality): string[] {
  const formula = CHORD_FORMULAS[quality];
  return formula.map(
    (semitones) =>
      CHORD_CONTEXT_LABELS[quality]?.[semitones]?.short ?? INTERVAL_SHORT_LABELS[semitones] ?? `${semitones}`,
  );
}

// Get interval labels for a chord with current inversion
// Returns labels in display order (matching the inverted notes array)
export function getInvertedChordIntervalLabels(
  quality: ChordQuality,
  inversion: number = 0
): string[] {
  const labels = getChordIntervalLabels(quality);
  const result = [...labels];
  for (let i = 0; i < inversion && i < result.length - 1; i++) {
    const first = result.shift()!;
    result.push(first);
  }
  return result;
}

// Get short interval labels for a chord with current inversion
export function getInvertedChordShortLabels(
  quality: ChordQuality,
  inversion: number = 0
): string[] {
  const labels = getChordShortIntervalLabels(quality);
  const result = [...labels];
  for (let i = 0; i < inversion && i < result.length - 1; i++) {
    const first = result.shift()!;
    result.push(first);
  }
  return result;
}

// Get inversion name
export function getInversionName(inversion: number, chordSize: number): string {
  if (inversion === 0) return 'Root Position';
  if (inversion === 1) return '1st Inversion';
  if (inversion === 2) return '2nd Inversion';
  if (inversion === 3 && chordSize >= 4) return '3rd Inversion';
  return `${inversion}th Inversion`;
}

// Get max inversions for a chord (based on number of notes)
export function getMaxInversions(quality: ChordQuality): number {
  return CHORD_FORMULAS[quality].length - 1;
}

// Diatonic chord qualities for each scale type
// Each array represents the chord quality built on each scale degree (1-7)
import { ScaleType, Scale } from '../types/music';

const DIATONIC_QUALITIES: Record<ScaleType, ChordQuality[]> = {
  // Major (Ionian): I, ii, iii, IV, V, vi, vii°
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],

  // Natural Minor (Aeolian): i, ii°, III, iv, v, VI, VII
  natural_minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],

  // Harmonic Minor: i, ii°, III+, iv, V, VI, vii°
  harmonic_minor: ['minor', 'diminished', 'augmented', 'minor', 'major', 'major', 'diminished'],

  // Melodic Minor: i, ii, III+, IV, V, vi°, vii°
  melodic_minor: ['minor', 'minor', 'augmented', 'major', 'major', 'diminished', 'diminished'],

  // Dorian: i, ii, III, IV, v, vi°, VII
  dorian: ['minor', 'minor', 'major', 'major', 'minor', 'diminished', 'major'],

  // Phrygian: i, II, III, iv, v°, VI, vii
  phrygian: ['minor', 'major', 'major', 'minor', 'diminished', 'major', 'minor'],

  // Lydian: I, II, iii, #iv°, V, vi, vii
  lydian: ['major', 'major', 'minor', 'diminished', 'major', 'minor', 'minor'],

  // Mixolydian: I, ii, iii°, IV, v, vi, VII
  mixolydian: ['major', 'minor', 'diminished', 'major', 'minor', 'minor', 'major'],

  // Locrian: i°, II, iii, iv, V, VI, vii
  locrian: ['diminished', 'major', 'minor', 'minor', 'major', 'major', 'minor'],

  // Non-7-note scales: no valid diatonic triads (thirds don't stack in these structures)
  pentatonic_major: [],
  pentatonic_minor: [],
  blues: [],
  whole_tone: [],
  diminished_whole_half: [
    'diminished',
    'diminished',
    'diminished',
    'diminished',
    'diminished',
    'diminished',
    'diminished',
    'diminished',
  ],
  diminished_half_whole: [
    'diminished',
    'diminished',
    'diminished',
    'diminished',
    'diminished',
    'diminished',
    'diminished',
    'diminished',
  ],
  chromatic: [], // No diatonic chords for chromatic scale

  // Advanced scales (Phase 1)
  // Altered (Super Locrian) - Mode 7 of melodic minor: i°, ii, iii, IV+, V, VI, vii°
  altered: ['diminished', 'minor', 'minor', 'augmented', 'major', 'major', 'diminished'],
  // Lydian Dominant - Mode 4 of melodic minor: I, II, iii°, iv°, v, vi, VII+
  lydian_dominant: ['major', 'major', 'diminished', 'diminished', 'minor', 'minor', 'augmented'],
  // Phrygian Dominant - Mode 5 of harmonic minor: I, II, iii°, iv, v°, VI+, vii
  phrygian_dominant: ['major', 'major', 'diminished', 'minor', 'diminished', 'augmented', 'minor'],
  // Major Blues (6 notes) - major tonality with blue note
  major_blues: ['major', 'minor', 'minor', 'major', 'major', 'minor'],
  // Locrian Natural 2 - Mode 6 of melodic minor: i°, ii°, iii, iv, V+, VI, VII
  locrian_natural2: ['diminished', 'diminished', 'minor', 'minor', 'augmented', 'major', 'major'],

  // Phase 2 - Bebop scales (8 notes)
  // Bebop Dominant - Mixolydian with passing tone, chords on main scale degrees
  bebop_dominant: [
    'major',
    'minor',
    'diminished',
    'major',
    'minor',
    'minor',
    'major',
    'diminished',
  ],
  // Bebop Major - Major with passing tone
  bebop_major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'minor', 'diminished'],
  // Bebop Dorian - Dorian with passing tone
  bebop_dorian: ['minor', 'minor', 'major', 'major', 'major', 'minor', 'diminished', 'major'],

  // Phase 2 - Remaining melodic minor modes
  // Dorian b2 (Mode 2 of melodic minor): i, II+, III, IV, v°, vi°, vii
  dorian_b2: ['minor', 'augmented', 'major', 'major', 'diminished', 'diminished', 'minor'],
  // Lydian Augmented (Mode 3 of melodic minor): I+, II, III, iv°, v°, vi, vii
  lydian_augmented: ['augmented', 'major', 'major', 'diminished', 'diminished', 'minor', 'minor'],
  // Mixolydian b6 (Mode 5 of melodic minor): I, ii°, iii°, iv, v, VI+, VII
  mixolydian_b6: ['major', 'diminished', 'diminished', 'minor', 'minor', 'augmented', 'major'],

  // Phase 3 - World/Ethnic scales
  // Hungarian Minor (Gypsy Minor): i, II+, III, #iv°, V, VI, vii°
  hungarian_minor: ['minor', 'augmented', 'major', 'diminished', 'major', 'major', 'diminished'],
  // Hungarian Major: I, ii°, III, #iv°, V, vi°, vii
  hungarian_major: ['major', 'diminished', 'major', 'diminished', 'major', 'diminished', 'minor'],
  // Double Harmonic (Byzantine/Arabic): I, ii°, III+, iv, V, VI+, vii°
  double_harmonic: [
    'major',
    'diminished',
    'augmented',
    'minor',
    'major',
    'augmented',
    'diminished',
  ],
  // Persian: I, ii°, III+, iv°, V, VI, vii°
  persian: ['major', 'diminished', 'augmented', 'diminished', 'major', 'major', 'diminished'],
  // Neapolitan Minor: i, II, III+, iv, V, VI, vii°
  neapolitan_minor: ['minor', 'major', 'augmented', 'minor', 'major', 'major', 'diminished'],
  // Neapolitan Major: I, ii, III, IV, V+, vi, vii°
  neapolitan_major: ['major', 'minor', 'major', 'major', 'augmented', 'minor', 'diminished'],

  // Japanese pentatonic scales (5 notes)
  // Hirajoshi: i, II, iii, V, vi
  hirajoshi: ['minor', 'major', 'minor', 'major', 'minor'],
  // In Sen: i, II, iv, V, vii
  in_sen: ['minor', 'major', 'minor', 'major', 'minor'],
  // Iwato: i°, II, iv, V°, vii
  iwato: ['diminished', 'major', 'minor', 'diminished', 'minor'],

  // Egyptian pentatonic (5 notes)
  // Egyptian (suspended pentatonic): no 3rd, ambiguous tonality
  egyptian: ['major', 'minor', 'major', 'minor', 'major'],
};

// Get roman numeral based on chord quality and degree
function getRomanNumeral(quality: ChordQuality, degree: number): string {
  const baseNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const base = baseNumerals[degree];

  // Lowercase for minor/diminished
  const isMinorType = ['minor', 'diminished', 'minor7', 'diminished7', 'half_diminished7'].includes(
    quality
  );
  const numeral = isMinorType ? base.toLowerCase() : base;

  // Add quality suffix
  if (quality === 'diminished') return numeral + '°';
  if (quality === 'augmented') return numeral + '+';
  return numeral;
}

// Get diatonic chords for any scale
export function getDiatonicChordsForScale(scale: Scale): { chord: Chord; numeral: string }[] {
  const qualities = DIATONIC_QUALITIES[scale.type];
  if (!qualities) {
    // Unknown scale type — fallback to major diatonic triads
    return getDiatonicTriads(scale.root);
  }
  if (qualities.length === 0) {
    // Scale has no diatonic harmony (pentatonic, blues, whole tone, etc.)
    return [];
  }

  return scale.notes.slice(0, qualities.length).map((note, i) => {
    const quality = qualities[i];
    const numeral = getRomanNumeral(quality, i);

    return {
      chord: buildChord(note, quality),
      numeral,
    };
  });
}

// Get diatonic triads for a natural minor key
export function getDiatonicTriadsMinor(root: Note): { chord: Chord; numeral: string }[] {
  const qualities: ChordQuality[] = [
    'minor', // i
    'diminished', // ii°
    'major', // III
    'minor', // iv
    'minor', // v
    'major', // VI
    'major', // VII
  ];

  const numerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

  const rootPitchClass = getPitchClass(root);
  const scaleDegrees = [0, 2, 3, 5, 7, 8, 10]; // Natural minor intervals

  return scaleDegrees.map((semitones, i) => {
    const degreePitchClass = (rootPitchClass + semitones) % 12;
    const degreeNatural = getNaturalAtLetterDistance(root.natural, i);
    const degreeRoot = buildNoteFromNaturalAndPitchClass(degreeNatural, degreePitchClass);

    return {
      chord: buildChord(degreeRoot, qualities[i]),
      numeral: numerals[i],
    };
  });
}

// Get diatonic seventh chords for a natural minor key
export function getDiatonicSeventhChordsMinor(root: Note): { chord: Chord; numeral: string }[] {
  const qualities: ChordQuality[] = [
    'minor7', // i7
    'half_diminished7', // iiø7
    'major7', // IIImaj7
    'minor7', // iv7
    'minor7', // v7
    'major7', // VImaj7
    'dominant7', // VII7
  ];

  const numerals = ['i7', 'iiø7', 'IIImaj7', 'iv7', 'v7', 'VImaj7', 'VII7'];

  const rootPitchClass = getPitchClass(root);
  const scaleDegrees = [0, 2, 3, 5, 7, 8, 10]; // Natural minor intervals

  return scaleDegrees.map((semitones, i) => {
    const degreePitchClass = (rootPitchClass + semitones) % 12;
    const degreeNatural = getNaturalAtLetterDistance(root.natural, i);
    const degreeRoot = buildNoteFromNaturalAndPitchClass(degreeNatural, degreePitchClass);

    return {
      chord: buildChord(degreeRoot, qualities[i]),
      numeral: numerals[i],
    };
  });
}

// Get diatonic seventh chords for harmonic minor key
export function getDiatonicSeventhChordsHarmonicMinor(
  root: Note
): { chord: Chord; numeral: string }[] {
  const qualities: ChordQuality[] = [
    'minor_major7', // imMaj7
    'half_diminished7', // iiø7
    'augmented_major7', // III+maj7 (augmented triad with major 7)
    'minor7', // iv7
    'dominant7', // V7 (this is why harmonic minor exists!)
    'major7', // VImaj7
    'diminished7', // vii°7
  ];

  const numerals = ['imMaj7', 'iiø7', 'III+7', 'iv7', 'V7', 'VImaj7', 'vii°7'];

  const rootPitchClass = getPitchClass(root);
  const scaleDegrees = [0, 2, 3, 5, 7, 8, 11]; // Harmonic minor intervals

  return scaleDegrees.map((semitones, i) => {
    const degreePitchClass = (rootPitchClass + semitones) % 12;
    const degreeNatural = getNaturalAtLetterDistance(root.natural, i);
    const degreeRoot = buildNoteFromNaturalAndPitchClass(degreeNatural, degreePitchClass);

    return {
      chord: buildChord(degreeRoot, qualities[i]),
      numeral: numerals[i],
    };
  });
}

// Diatonic seventh chord qualities for each scale type/mode
// Each array represents the 7th chord quality built on each scale degree (1-7)
export const DIATONIC_SEVENTH_CHORD_QUALITIES: Partial<Record<ScaleType, ChordQuality[]>> = {
  // Major (Ionian): Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7
  major: ['major7', 'minor7', 'minor7', 'major7', 'dominant7', 'minor7', 'half_diminished7'],

  // Natural Minor (Aeolian): i7, iiø7, IIImaj7, iv7, v7, VImaj7, VII7
  natural_minor: [
    'minor7',
    'half_diminished7',
    'major7',
    'minor7',
    'minor7',
    'major7',
    'dominant7',
  ],

  // Harmonic Minor: imMaj7, iiø7, III+maj7, iv7, V7, VImaj7, vii°7
  harmonic_minor: [
    'minor_major7',
    'half_diminished7',
    'augmented_major7',
    'minor7',
    'dominant7',
    'major7',
    'diminished7',
  ],

  // Melodic Minor: imMaj7, ii7, III+maj7, IV7, V7, viø7, viiø7
  melodic_minor: [
    'minor_major7',
    'minor7',
    'augmented_major7',
    'dominant7',
    'dominant7',
    'half_diminished7',
    'half_diminished7',
  ],

  // Dorian: i7, ii7, IIImaj7, IV7, v7, viø7, VIImaj7
  dorian: ['minor7', 'minor7', 'major7', 'dominant7', 'minor7', 'half_diminished7', 'major7'],

  // Phrygian: i7, IImaj7, III7, iv7, vø7, VImaj7, vii7
  phrygian: ['minor7', 'major7', 'dominant7', 'minor7', 'half_diminished7', 'major7', 'minor7'],

  // Lydian: Imaj7, II7, iii7, #ivø7, Vmaj7, vi7, vii7
  lydian: ['major7', 'dominant7', 'minor7', 'half_diminished7', 'major7', 'minor7', 'minor7'],

  // Mixolydian: I7, ii7, iiiø7, IVmaj7, v7, vi7, VIImaj7
  mixolydian: ['dominant7', 'minor7', 'half_diminished7', 'major7', 'minor7', 'minor7', 'major7'],

  // Locrian: iø7, IImaj7, iii7, iv7, Vmaj7, VI7, vii7
  locrian: ['half_diminished7', 'major7', 'minor7', 'minor7', 'major7', 'dominant7', 'minor7'],
};

// Build a slash chord (chord with alternate bass note)
export function buildSlashChord(
  root: Note,
  quality: ChordQuality,
  bassNote: Note,
  octave: number = 4
): SlashChord {
  const baseChord = buildChord(root, quality);
  const bassPitchClass = getPitchClass(bassNote);

  // Check if bass note is in the chord (making it an inversion)
  const chordPitchClasses = baseChord.notes.map((n) => getPitchClass(n));
  const isInversion = chordPitchClasses.includes(bassPitchClass);

  // Build pitched notes with bass in lowest position
  const bassOctave = octave - 1;
  const pitchedBass: PitchedNote = { ...bassNote, octave: bassOctave };

  // For inversions, remove the bass note from upper notes to avoid doubling
  // For non-inversions (polychords), keep all notes
  const upperNotes: PitchedNote[] = isInversion
    ? baseChord.notes
        .filter((n) => getPitchClass(n) !== bassPitchClass)
        .map((n) => ({ ...n, octave }))
    : baseChord.notes.map((n) => ({ ...n, octave }));

  return {
    root,
    quality,
    bassNote,
    isInversion,
    notes: [pitchedBass, ...upperNotes],
  };
}

// Parse a slash chord string like "C/E" or "Am7/G"
export function parseSlashChord(input: string): { chordPart: string; bassNote: string | null } {
  const slashIndex = input.lastIndexOf('/');
  if (slashIndex > 0 && slashIndex < input.length - 1) {
    const possibleBass = input.substring(slashIndex + 1);
    // Check if it looks like a bass note (single letter optionally with accidental)
    if (/^[A-Ga-g][#b\u266F\u266D]?$/.test(possibleBass)) {
      return {
        chordPart: input.substring(0, slashIndex),
        bassNote: possibleBass,
      };
    }
  }
  return { chordPart: input, bassNote: null };
}
