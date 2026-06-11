// Core music theory types

// Natural notes (no accidentals)
export type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// Accidentals
export type Accidental = '' | '#' | 'b' | '##' | 'bb';

// Full note name (e.g., "C#", "Db", "F##")
export interface Note {
  natural: NaturalNote;
  accidental: Accidental;
}

// Pitch class (0-11, where 0 = C)
export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// Note with octave for audio playback
export interface PitchedNote extends Note {
  octave: number;
}

// Scale types
export type ScaleType =
  | 'major'
  | 'natural_minor'
  | 'harmonic_minor'
  | 'melodic_minor'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian'
  | 'pentatonic_major'
  | 'pentatonic_minor'
  | 'blues'
  // Symmetric and chromatic scales
  | 'whole_tone'
  | 'diminished_whole_half'
  | 'diminished_half_whole'
  | 'chromatic'
  // Advanced scales (Phase 1)
  | 'altered'
  | 'lydian_dominant'
  | 'phrygian_dominant'
  | 'major_blues'
  | 'locrian_natural2'
  // Phase 2 - Bebop scales
  | 'bebop_dominant'
  | 'bebop_major'
  | 'bebop_dorian'
  // Phase 2 - Remaining melodic minor modes
  | 'dorian_b2'
  | 'lydian_augmented'
  | 'mixolydian_b6'
  // Phase 3 - World/Ethnic scales
  // European/Middle Eastern
  | 'hungarian_minor'
  | 'hungarian_major'
  | 'double_harmonic'
  | 'persian'
  | 'neapolitan_minor'
  | 'neapolitan_major'
  // Japanese pentatonic
  | 'hirajoshi'
  | 'in_sen'
  | 'iwato'
  // Other world
  | 'egyptian';

export interface Scale {
  root: Note;
  type: ScaleType;
  notes: Note[];
}

// Chord quality
export type ChordQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'major6'
  | 'minor6'
  | 'major7'
  | 'minor7'
  | 'dominant7'
  | 'diminished7'
  | 'half_diminished7'
  | 'augmented7'
  | 'sus2'
  | 'sus4'
  | 'add9'
  // Additional chord types
  | 'minor_major7'
  | 'power'
  | 'dominant7sus4'
  | 'major9'
  | 'minor9'
  | 'dominant9'
  // Altered Dominants
  | 'dominant7flat9'
  | 'dominant7sharp9'
  | 'dominant7flat5'
  | 'dominant7sharp5'
  | 'dominant7alt'
  // Extended Chords
  | 'dominant11'
  | 'major11'
  | 'minor11'
  | 'dominant9sharp11'
  | 'dominant7sharp11' // 7#11 — dominant 7th + #11, NO 9th (sibling of dominant9sharp11)
  | 'major9sharp11' // maj9#11 — major 7th + 9th + #11 (Lydian-major with the 9th)
  | 'dominant13'
  | 'major13'
  | 'minor13'
  | 'dominant13flat9'
  | 'dominant7flat13' // 7b13 — dominant 7th + b13, NO 9th unless written
  // Added Tones
  | 'add11'
  | 'six_nine'
  | 'minor_six_nine'
  // Additional Suspensions
  | 'dominant9sus4'
  | 'sus2sus4'
  // Altered 5ths with Major 7
  | 'augmented_major7'
  | 'major7flat5'
  | 'major7sharp11'
  // Diminished Major 7 (rare - diminished triad + major 7)
  | 'diminished_major7'
  // Combination altered dominants
  | 'dominant7sharp5flat9'
  | 'dominant7flat5flat9'
  | 'dominant7sharp5sharp9'
  | 'dominant7flat5sharp9';

export interface Chord {
  root: Note;
  quality: ChordQuality;
  notes: Note[];
  inversion?: number;
  // Slash chord bass note (e.g., the G in Dm7/G)
  bassNote?: Note;
  // For algorithmically-built chords with complex names (e.g., G7#5b9)
  algorithmicDisplayName?: string;
  algorithmicIntervalLabels?: string[];
}

// Slash chord (chord with alternate bass note)
export interface SlashChord {
  root: Note;
  quality: ChordQuality;
  bassNote: Note;
  isInversion: boolean; // true if bass note is part of the chord
  notes: PitchedNote[];
}

// Interval types
export type IntervalQuality = 'perfect' | 'major' | 'minor' | 'augmented' | 'diminished';
export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Interval {
  quality: IntervalQuality;
  number: IntervalNumber;
  semitones: number;
}

// Key signature
export interface KeySignature {
  root: Note;
  mode: 'major' | 'minor';
  accidentals: { note: NaturalNote; accidental: '#' | 'b' }[];
}

// Mode (for modes of the major scale)
export type ModeName =
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian';

export interface Mode {
  name: ModeName;
  root: Note;
  parentMajor: Note;
  degree: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  notes: Note[];
  characteristicNote?: Note;
}

// Circle of Fifths position
export interface CirclePosition {
  major: Note;
  minor: Note;
  position: number; // 0-11, clockwise from C
  sharps: number;
  flats: number;
}

// Helper to convert Note to display string
export function noteToString(note: Note): string {
  return `${note.natural}${note.accidental}`;
}

// Helper to parse string to Note (validates double accidentals - BUG-006 fix)
export function stringToNote(str: string): Note {
  const natural = str[0].toUpperCase() as NaturalNote;
  const accPart = str.slice(1);
  // Validate accidental - only allow valid values
  let accidental: Accidental = '';
  if (accPart === '#' || accPart === 'b' || accPart === '##' || accPart === 'bb') {
    accidental = accPart;
  }
  return { natural, accidental };
}

// === CHORD/SCALE IDENTIFICATION TYPES ===

// Chord identification result from reverse lookup
export interface ChordIdentification {
  chord: Chord;
  confidence: 'exact' | 'likely' | 'possible';
  score: number; // 0-100
  interpretation: string; // Human-readable explanation
  missingNotes?: Note[]; // Notes that would complete the chord
  extraNotes?: Note[]; // Notes in input not part of the chord
}

// Scale identification result from reverse lookup
export interface ScaleIdentification {
  scale: Scale;
  confidence: 'exact' | 'likely' | 'possible';
  score: number; // 0-100
  interpretation: string;
  matchingDegrees: number[]; // Which scale degrees are matched
  missingDegrees: number[]; // Which scale degrees are missing
}
