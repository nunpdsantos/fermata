// Piano keyboard layout utilities

import { Note, NaturalNote, PitchedNote } from '../types/music';
import { getPitchClass } from '../constants/notes';

// Piano key dimensions
export const PIANO_DIMENSIONS = {
  whiteKey: { width: 40, height: 160 },
  blackKey: { width: 24, height: 100 },
  gap: 2,
  blackKeyOffset: 28, // from left edge of preceding white key
};

// Natural notes in order (one octave)
export const WHITE_KEY_NATURALS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Which white keys have a black key to their right
export const BLACK_KEY_AFTER: Record<NaturalNote, boolean> = {
  C: true, // C#
  D: true, // D#
  E: false, // No E# (it's F)
  F: true, // F#
  G: true, // G#
  A: true, // A#
  B: false, // No B# (it's C)
};

// Piano key data structure
export interface PianoKey {
  note: Note;
  octave: number;
  isBlack: boolean;
  midiNumber: number;
  // Position info (calculated during rendering)
  whiteKeyIndex?: number; // Index among white keys only (for positioning)
}

// Check if a note is a black key (has sharp/flat accidental)
export function isBlackKey(note: Note): boolean {
  return note.accidental === '#' || note.accidental === 'b';
}

// Convert Note + octave to MIDI number (A0 = 21, C4 = 60, C8 = 108)
export function getMidiNumber(note: Note, octave: number): number {
  const pitchClass = getPitchClass(note);
  return 12 + octave * 12 + pitchClass;
}

// Convert MIDI number back to Note + octave
export function midiToNote(midiNumber: number): PitchedNote {
  const octave = Math.floor((midiNumber - 12) / 12);
  const pitchClass = (midiNumber - 12) % 12;

  // Default to sharp spelling for black keys
  const noteMap: Record<number, Note> = {
    0: { natural: 'C', accidental: '' },
    1: { natural: 'C', accidental: '#' },
    2: { natural: 'D', accidental: '' },
    3: { natural: 'D', accidental: '#' },
    4: { natural: 'E', accidental: '' },
    5: { natural: 'F', accidental: '' },
    6: { natural: 'F', accidental: '#' },
    7: { natural: 'G', accidental: '' },
    8: { natural: 'G', accidental: '#' },
    9: { natural: 'A', accidental: '' },
    10: { natural: 'A', accidental: '#' },
    11: { natural: 'B', accidental: '' },
  };

  const note = noteMap[pitchClass];
  return { ...note, octave };
}

// Generate all keys for a given octave range
export function generateKeyboardKeys(startOctave: number, endOctave: number): PianoKey[] {
  const keys: PianoKey[] = [];
  let whiteKeyIndex = 0;

  // Handle the special case of octave 0 (piano starts at A0, not C0)
  if (startOctave === 0) {
    // A0
    keys.push({
      note: { natural: 'A', accidental: '' },
      octave: 0,
      isBlack: false,
      midiNumber: getMidiNumber({ natural: 'A', accidental: '' }, 0),
      whiteKeyIndex: whiteKeyIndex++,
    });
    // A#0
    keys.push({
      note: { natural: 'A', accidental: '#' },
      octave: 0,
      isBlack: true,
      midiNumber: getMidiNumber({ natural: 'A', accidental: '#' }, 0),
    });
    // B0
    keys.push({
      note: { natural: 'B', accidental: '' },
      octave: 0,
      isBlack: false,
      midiNumber: getMidiNumber({ natural: 'B', accidental: '' }, 0),
      whiteKeyIndex: whiteKeyIndex++,
    });
    // Continue from octave 1
    startOctave = 1;
  }

  // Generate full octaves
  for (let octave = startOctave; octave <= endOctave; octave++) {
    // Special case: octave 8 only has C
    if (octave === 8) {
      keys.push({
        note: { natural: 'C', accidental: '' },
        octave: 8,
        isBlack: false,
        midiNumber: getMidiNumber({ natural: 'C', accidental: '' }, 8),
        whiteKeyIndex: whiteKeyIndex++,
      });
      break;
    }

    for (const natural of WHITE_KEY_NATURALS) {
      // White key
      const whiteNote: Note = { natural, accidental: '' };
      keys.push({
        note: whiteNote,
        octave,
        isBlack: false,
        midiNumber: getMidiNumber(whiteNote, octave),
        whiteKeyIndex: whiteKeyIndex++,
      });

      // Black key (if applicable)
      if (BLACK_KEY_AFTER[natural]) {
        const blackNote: Note = { natural, accidental: '#' };
        keys.push({
          note: blackNote,
          octave,
          isBlack: true,
          midiNumber: getMidiNumber(blackNote, octave),
        });
      }
    }
  }

  return keys;
}

// Get only white keys from a key array
export function getWhiteKeys(keys: PianoKey[]): PianoKey[] {
  return keys.filter((k) => !k.isBlack);
}

// Get only black keys from a key array
export function getBlackKeys(keys: PianoKey[]): PianoKey[] {
  return keys.filter((k) => k.isBlack);
}

// Calculate the x position of a black key based on its preceding white key index
export function getBlackKeyPosition(precedingWhiteKeyIndex: number): number {
  const whiteKeyWidth = PIANO_DIMENSIONS.whiteKey.width + PIANO_DIMENSIONS.gap;
  return precedingWhiteKeyIndex * whiteKeyWidth + PIANO_DIMENSIONS.blackKeyOffset;
}

// Check if two notes are the same (considering enharmonic equivalents)
export function notesMatch(note1: Note, octave1: number, note2: Note, octave2: number): boolean {
  if (octave1 !== octave2) return false;
  return getPitchClass(note1) === getPitchClass(note2);
}

// Check if a PitchedNote matches a PianoKey
export function pitchedNoteMatchesKey(pitchedNote: PitchedNote, key: PianoKey): boolean {
  return notesMatch(pitchedNote, pitchedNote.octave, key.note, key.octave);
}

// Get the display label for a key
export function getKeyLabel(key: PianoKey, showOctaveNumber: boolean = false): string {
  const noteName = key.note.natural + key.note.accidental;
  if (showOctaveNumber && key.note.natural === 'C') {
    return `${noteName}${key.octave}`;
  }
  return noteName;
}

// Calculate total keyboard width based on number of white keys
export function getKeyboardWidth(whiteKeyCount: number): number {
  return (
    whiteKeyCount * (PIANO_DIMENSIONS.whiteKey.width + PIANO_DIMENSIONS.gap) - PIANO_DIMENSIONS.gap
  );
}

// White key index offsets within one octave (for scroll position calculation)
const WHITE_KEY_NOTE_INDEX: Record<NaturalNote, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

/**
 * Get the x-pixel position of a note on the keyboard.
 * Used for auto-scrolling the container to show highlighted notes.
 */
export function getNoteScrollPosition(note: Note, octave: number, startOctave: number): number {
  const step = PIANO_DIMENSIONS.whiteKey.width + PIANO_DIMENSIONS.gap; // 42px
  const octaveOffset = (octave - startOctave) * 7;
  const noteOffset = WHITE_KEY_NOTE_INDEX[note.natural];
  return (octaveOffset + noteOffset) * step;
}

// Find which white key index a black key should be positioned after
export function getBlackKeyPrecedingWhiteIndex(keys: PianoKey[], blackKey: PianoKey): number {
  // Find the white key that this black key comes after
  for (let i = keys.indexOf(blackKey) - 1; i >= 0; i--) {
    if (!keys[i].isBlack) {
      return keys[i].whiteKeyIndex!;
    }
  }
  return 0;
}

/**
 * Calculate scale notes with octave assignments for playback.
 * Each note is assigned an octave based on pitch class progression,
 * with an extra root note at the higher octave.
 */
export function getScaleNotesWithOctaves(notes: Note[], startOctave: number): PitchedNote[] {
  const result: PitchedNote[] = [];
  let currentOctave = startOctave;
  let lastPitchClass = -1;

  for (let i = 0; i < notes.length; i++) {
    const pitchClass = getPitchClass(notes[i]);
    if (i > 0 && pitchClass <= lastPitchClass) {
      currentOctave++;
    }
    result.push({ ...notes[i], octave: currentOctave });
    lastPitchClass = pitchClass;
  }

  // Add the octave note (root at higher octave)
  const rootPitchClass = getPitchClass(notes[0]);
  if (rootPitchClass <= lastPitchClass) {
    currentOctave++;
  }
  result.push({ ...notes[0], octave: currentOctave });

  return result;
}

/**
 * Calculate voiced chord notes with proper octave assignments.
 * Ensures notes ascend in pitch, matching the audio service voicing logic.
 * This is used to highlight the correct piano keys when playing chords.
 *
 * For low register (startOctave < 4), uses open voicing to avoid muddiness:
 * - Root stays in bass
 * - Third moves up an octave
 * - Fifth stays in middle
 * Example: C major at octave 3 → C3, G3, E4 instead of C3, E3, G3
 */
export function getVoicedChordNotes(notes: Note[], startOctave: number = 4): PitchedNote[] {
  // For low register (below middle C), use open voicing to avoid muddiness
  if (startOctave < 4 && notes.length >= 3) {
    return getOpenVoicedChordNotes(notes, startOctave);
  }

  // Standard close voicing for higher registers
  let currentOctave = startOctave;
  let lastPitchClass = -1;

  return notes.map((note, i) => {
    const pitchClass = getPitchClass(note);

    // If this pitch class is lower or equal to the last one, bump up the octave
    if (i > 0 && pitchClass <= lastPitchClass) {
      currentOctave++;
    }

    lastPitchClass = pitchClass;

    return {
      ...note,
      octave: currentOctave,
    };
  });
}

/**
 * Open voicing for low register chords - spreads notes to avoid muddiness.
 * Pattern: Root stays low, fifth in middle, third up an octave
 * This creates a clearer, more separated sound in the bass register.
 */
function getOpenVoicedChordNotes(notes: Note[], startOctave: number): PitchedNote[] {
  // Spread order: bass, fifth, third, then the rest (7th, 9th, …). Each note
  // is placed at the LOWEST pitch above the previous one, so the bass note
  // (the root, or the inversion's bass) always stays at the bottom — the old
  // version put the fifth in the root's octave even when that is below the
  // root (F major at octave 1 lit C1 F1 A2; audit W2-07).
  const order = notes.length >= 3
    ? [notes[0], notes[2], notes[1], ...notes.slice(3)]
    : notes;
  const result: PitchedNote[] = [];
  let previousMidi = -Infinity;
  for (const note of order) {
    const pc = getPitchClass(note);
    let octave = result.length === 0 ? startOctave : Math.floor((previousMidi - 12) / 12);
    while (12 + octave * 12 + pc <= previousMidi) octave++;
    result.push({ ...note, octave });
    previousMidi = 12 + octave * 12 + pc;
  }
  return result;
}

/** Lowest and highest MIDI numbers on the 88-key piano (A0, C8). */
export const PIANO_MIDI_RANGE = { low: 21, high: 108 } as const;

/**
 * Whether a scale played from `octave` (for `octaves` octaves, plus the top
 * tonic) stays on the 88 keys — the piano's octave buttons only offer octaves
 * that do (audit W2-07).
 */
export function octaveFitsKeyboard(scaleNotes: Note[], octave: number, octaves: number = 1): boolean {
  for (let k = 0; k < octaves; k++) {
    for (const p of getScaleNotesWithOctaves(scaleNotes, octave + k)) {
      const midi = getMidiNumber(p, p.octave);
      if (midi < PIANO_MIDI_RANGE.low || midi > PIANO_MIDI_RANGE.high) return false;
    }
  }
  return true;
}

/** Whether a chord voiced from `octave` (plus a slash bass an octave below) stays on the keys. */
export function chordFitsKeyboard(chordNotes: Note[], octave: number, bassNote?: Note): boolean {
  if (chordNotes.length === 0) return true;
  const midis = getVoicedChordNotes(chordNotes, octave).map((p) => getMidiNumber(p, p.octave));
  if (bassNote) midis.push(getMidiNumber(bassNote, octave - 1));
  return midis.every((m) => m >= PIANO_MIDI_RANGE.low && m <= PIANO_MIDI_RANGE.high);
}

/**
 * The exact pitches of a chord as the app both LIGHTS and PLAYS it: the
 * voicing above from `octave`, plus a slash-chord bass an octave below
 * (always under the voicing). One function for keys and sound, so what you
 * see is what you hear (audit W2-07 review).
 */
export function chordVoicingPitches(notes: Note[], octave: number, bassNote?: Note): PitchedNote[] {
  const voiced = notes.length > 0 ? getVoicedChordNotes(notes, octave) : [];
  return bassNote ? [{ ...bassNote, octave: octave - 1 }, ...voiced] : voiced;
}
