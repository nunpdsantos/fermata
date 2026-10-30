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
import type { ScaleType, Scale } from '../types/music';
import {
  type Degree,
  degreeSemitones,
  degreeOf,
  formatDegree,
  intervalNameOfDegree,
  spellScale,
  CHURCH_MODES,
} from '../utils/degreeSpelling';

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
  // 7#11 - R, M3, P5, m7, #11. The no-9 sibling of dominant9sharp11 (which adds the
  // major 9th). #11 = 18 st (octave + tritone). R=0,3=4,5=7,b7=10,#11=18.
  dominant7sharp11: [0, 4, 7, 10, 18],
  // maj9#11 - R, M3, P5, M7, M9, #11. Lydian-major colour carrying the 9th, distinct
  // from major7sharp11 (no 9) and major11 (3rd omitted, natural 11). M7=11,M9=14,#11=18.
  major9sharp11: [0, 4, 7, 11, 14, 18],
  dominant13: [0, 4, 7, 10, 14, 21], // 13 - dominant 9th + major 13th
  major13: [0, 4, 7, 11, 14, 21], // maj13 - major 9th + major 13th
  minor13: [0, 3, 7, 10, 14, 21], // m13 - minor 9th + major 13th
  dominant13flat9: [0, 4, 7, 10, 13, 21], // 13b9 - dominant 13th with flat 9
  // 7b13 - R, M3, P5, m7, b13. The b13 (Ab over C) sits a semitone above the natural
  // 5th, which is RETAINED (unlike 7alt). No 9th unless explicitly written. b13 = 20 st
  // (octave + minor 6th). R=0,3=4,5=7,b7=10,b13=20.
  dominant7flat13: [0, 4, 7, 10, 20],
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
  // 7#11: Root, 3rd, 5th, 7th, #11 (no 9th). #11 letter distance 3 (the 4th letter).
  dominant7sharp11: [0, 2, 4, 6, 3],
  // maj9#11: Root, 3rd, 5th, 7th, 9th, #11. 9th=letter 1, #11=letter 3.
  major9sharp11: [0, 2, 4, 6, 1, 3],

  // 13th chords: Root, 3rd, 5th, 7th, 9th, 13th (11th often omitted)
  dominant13: [0, 2, 4, 6, 1, 5],
  major13: [0, 2, 4, 6, 1, 5],
  minor13: [0, 2, 4, 6, 1, 5],
  dominant13flat9: [0, 2, 4, 6, 1, 5],
  // 7b13: Root, 3rd, 5th, 7th, b13 (no 9th). b13 letter distance 5 (the 6th letter).
  dominant7flat13: [0, 2, 4, 6, 5],

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
  dominant7sharp11: 'Dominant 7th Sharp 11',
  major9sharp11: 'Major 9th Sharp 11',
  dominant13: 'Dominant 13th',
  major13: 'Major 13th',
  minor13: 'Minor 13th',
  dominant13flat9: 'Dominant 13th Flat 9',
  dominant7flat13: 'Dominant 7th Flat 13',
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
  dominant7sharp11: '7#11',
  major9sharp11: 'maj9#11',
  dominant13: '13',
  major13: 'maj13',
  minor13: 'm13',
  dominant13flat9: '13b9',
  dominant7flat13: '7b13',
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
  16: 'Major 10th', // 12 + major 3rd (the minor 10th is 15) — audit W1-14
  17: 'Perfect 11th',
  18: 'Augmented 11th',
  19: 'Perfect 12th',
  20: 'Minor 13th',
  21: 'Major 13th',
  22: 'Augmented 13th',
};

// Short labels for a semitone count, in the degree style the whole app uses
// (b3, not m3 — audit W1-11). Displays that know the spelling read labels from
// the spelled note instead (utils/degreeSpelling); this table is the fallback.
export const INTERVAL_SHORT_LABELS: Record<number, string> = {
  0: 'R',
  1: 'b2',
  2: '2',
  3: 'b3',
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
  16: '10',
  17: '11',
  18: '#11',
  19: '12',
  20: 'b13',
  21: '13',
  22: '#13',
};

// Chord-formula labels are READ FROM THE SPELLED CHORD (audit W1-11/W1-12): the
// degree number comes from the chord tone's letter distance (compound above
// the octave: 9, 11, 13) and the alteration from its semitones, in b3 style
// with the root shown as "R". So a minor 3rd is "b3" (never "m3"), the 4th
// tone of a diminished 7th is "bb7" (B-double-flat in C, never "6") and an
// augmented chord's 5th is "#5".
function chordToneDegree(quality: ChordQuality, index: number): Degree {
  const semitones = CHORD_FORMULAS[quality][index];
  const letter = CHORD_LETTER_DISTANCES[quality][index];
  const number = letter + 1 + (semitones >= 12 ? 7 : 0);
  return { number, alteration: semitones - degreeSemitones({ number, alteration: 0 }) };
}

// Get interval labels for a chord quality ("Root", "Minor 3rd", "Diminished 7th")
export function getChordIntervalLabels(quality: ChordQuality): string[] {
  return CHORD_FORMULAS[quality].map((_, i) => {
    const d = chordToneDegree(quality, i);
    return d.number === 1 && d.alteration === 0 ? 'Root' : intervalNameOfDegree(d).long;
  });
}

// Get short interval labels for a chord quality ("R", "b3", "5", "bb7")
export function getChordShortIntervalLabels(quality: ChordQuality): string[] {
  return CHORD_FORMULAS[quality].map((_, i) => formatDegree(chordToneDegree(quality, i), 'R'));
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

// ─── Diatonic harmony (audit W2-04 / W2-08) ─────────────────────────────────
//
// A scale's "diatonic" triads are built by STACKING THIRDS WITHIN THE SCALE —
// degree i takes the scale's own notes i, i+2, i+4 — and kept only when that
// stack is a major, minor, diminished or augmented triad. Hand-written quality
// tables used to put notes outside the scale on the buttons (Persian "I" was a
// C major chord although G is not in C Persian).
//
// Which scales get chords:
//   - 7-note scales: every degree whose stack is a triad (exotic scales can have
//     gaps, e.g. a diminished third between letter-thirds).
//   - 8-note BEBOP scales: the parent mode plus one chromatic passing tone, so
//     the chords are the parent mode's (mixolydian / major / dorian) on the
//     parent degrees; the passing tone gets none.
//   - Diminished (octatonic) scales: none — every alternate-note stack is the
//     same diminished chord, so there are no seven degrees to number.
//   - 5-, 6- and 12-note scales: none (thirds do not stack within them).
//
// Numerals: case and °/+ by quality; the five church modes are written against
// the parallel major (decision D-13 / audit W2-08: Mixolydian ♭VII, Phrygian
// ♭II, Lydian ♯iv°), matching the L7 lessons. Major, the minor scales and the
// other heptatonic scales keep the classical plain numerals (minor's III VI VII).

/** Bebop scales harmonised as their parent mode. */
const BEBOP_PARENT: Partial<Record<ScaleType, ScaleType>> = {
  bebop_dominant: 'mixolydian',
  bebop_major: 'major',
  bebop_dorian: 'dorian',
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented';

function classifyStack(third: number, fifth: number): TriadQuality | null {
  if (third === 4 && fifth === 7) return 'major';
  if (third === 3 && fifth === 7) return 'minor';
  if (third === 3 && fifth === 6) return 'diminished';
  if (third === 4 && fifth === 8) return 'augmented';
  return null;
}

/** Roman numeral for a triad on a 0-based degree, prefixed ♭/♯ by `alteration`. */
function romanNumeral(degreeIndex: number, quality: TriadQuality, alteration: number): string {
  const base = ROMAN_NUMERALS[degreeIndex];
  const prefix = alteration < 0 ? '♭'.repeat(-alteration) : '♯'.repeat(alteration);
  const cased = quality === 'minor' || quality === 'diminished' ? base.toLowerCase() : base;
  const suffix = quality === 'diminished' ? '°' : quality === 'augmented' ? '+' : '';
  return `${prefix}${cased}${suffix}`;
}

export interface DiatonicTriad {
  chord: Chord;
  numeral: string;
  /** Scale degree number of the chord root (1–7). */
  degree: number;
}

// Get diatonic chords for any scale
export function getDiatonicChordsForScale(scale: Scale): DiatonicTriad[] {
  const modeType = BEBOP_PARENT[scale.type] ?? scale.type;
  const notes = modeType === scale.type ? scale.notes : spellScale(scale.root, modeType);
  if (notes.length !== 7) return [];
  const flatPrefixes = CHURCH_MODES.has(modeType);

  const out: DiatonicTriad[] = [];
  for (let i = 0; i < 7; i++) {
    const root = notes[i];
    const rootPc = getPitchClass(root);
    const third = (getPitchClass(notes[(i + 2) % 7]) - rootPc + 12) % 12;
    const fifth = (getPitchClass(notes[(i + 4) % 7]) - rootPc + 12) % 12;
    const quality = classifyStack(third, fifth);
    if (!quality) continue;
    const alteration = flatPrefixes ? degreeOf(scale.root, root).alteration : 0;
    out.push({
      chord: buildChord(root, quality),
      numeral: romanNumeral(i, quality, alteration),
      degree: i + 1,
    });
  }
  return out;
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
