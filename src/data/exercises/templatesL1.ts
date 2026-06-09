import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 1 Templates — 10 modules, ~55 generated exercises
// Focus: Staff & clefs, note identification, rhythm basics, major scale,
//        basic intervals, major triads
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 1: Notation and Pitch
  // =========================================================================

  // ---- l1u1m1: Staff & Clefs ----
  {
    moduleId: 'l1u1m1',
    templates: [
      {
        type: 'note_id',
        promptTemplate: 'Identify the note {note} on the treble clef staff.',
        hintTemplate: 'This note is {note} in octave {octave}. Use the treble clef line/space positions: lines are E-G-B-D-F, spaces are F-A-C-E.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          octaves: [4, 5],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which note sits on the indicated line or space of the staff?',
        hintTemplate: 'Remember the treble clef lines (E-G-B-D-F) and spaces (F-A-C-E).',
        params: {
          choiceSets: [
            [
              { label: 'The treble clef is also known as the G clef', correct: true },
              { label: 'The treble clef is also known as the F clef', correct: false },
              { label: 'The treble clef is also known as the C clef', correct: false },
              { label: 'The treble clef is also known as the D clef', correct: false },
            ],
            [
              { label: 'The bass clef marks the fourth line as F', correct: true },
              { label: 'The bass clef marks the second line as G', correct: false },
              { label: 'The bass clef marks the third line as C', correct: false },
              { label: 'The bass clef marks the first line as E', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l1u1m2: Ledger Lines ----
  {
    moduleId: 'l1u1m2',
    templates: [
      {
        type: 'note_id',
        promptTemplate: 'Identify this note that requires ledger lines: {note}{octave}.',
        hintTemplate: 'Notes above or below the staff use ledger lines. Count step by step from the nearest staff line to find {note}.',
        params: {
          roots: ['C', 'D', 'A', 'B', 'G'],
          accidentals: ['', '', '', '', ''],
          octaves: [3, 4, 5, 6],
        },
      },
      {
        type: 'note_id',
        promptTemplate: 'Identify this note on a ledger line below the treble staff.',
        hintTemplate: 'Below the treble staff: middle C sits on one ledger line. Count down from there for lower notes.',
        params: {
          roots: ['C', 'B', 'A'],
          accidentals: ['', '', ''],
          octaves: [3, 4],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l1u1m3: Half Steps & Whole Steps ----
  {
    moduleId: 'l1u1m3',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'What is the interval from {root} going {direction}? Is it a half step or whole step?',
        hintTemplate: 'A half step is 1 semitone (adjacent keys on the piano). A whole step is 2 semitones (one key between them). From {root}, count carefully.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [1, 2],
          directions: ['ascending'],
          octaves: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which pair of natural notes forms a half step?',
        hintTemplate: 'On the piano, most natural notes have a black key between them (whole step). Only two pairs are directly adjacent with no black key between them.',
        params: {
          choiceSets: [
            [
              { label: 'E and F', correct: true },
              { label: 'C and D', correct: false },
              { label: 'G and A', correct: false },
              { label: 'D and E', correct: false },
            ],
            [
              { label: 'B and C', correct: true },
              { label: 'A and B', correct: false },
              { label: 'F and G', correct: false },
              { label: 'G and A', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l1u1m4: Chromatic Scale ----
  {
    moduleId: 'l1u1m4',
    templates: [
      {
        type: 'note_id',
        promptTemplate: 'Identify this note: the black key that can be called {note}.',
        hintTemplate: 'Black keys have two names (enharmonic equivalents). This one can be called {note}.',
        params: {
          roots: ['C', 'D', 'F', 'G', 'A'],
          accidentals: ['#', '#', '#', '#', '#'],
          octaves: [4],
        },
      },
      {
        type: 'note_id',
        promptTemplate: 'Identify this note: the black key that can be called {note}.',
        hintTemplate: 'This black key sits between two white keys. It can be called {note}.',
        params: {
          roots: ['D', 'E', 'G', 'A', 'B'],
          accidentals: ['b', 'b', 'b', 'b', 'b'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // =========================================================================
  // Unit 2: Rhythm and Meter
  // =========================================================================

  // ---- l1u2m1: Note Values ----
  {
    moduleId: 'l1u2m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'How do these note values relate to each other?',
        hintTemplate: 'Each note value is exactly half the duration of the next larger value. Whole = 4 beats, half = 2, quarter = 1, eighth = 0.5 in 4/4 time.',
        params: {
          choiceSets: [
            [
              { label: 'Two half notes equal one whole note', correct: true },
              { label: 'Two half notes equal one quarter note', correct: false },
              { label: 'Four half notes equal one whole note', correct: false },
              { label: 'One half note equals four quarter notes', correct: false },
            ],
            [
              { label: 'Two eighth notes equal one quarter note', correct: true },
              { label: 'Two eighth notes equal one half note', correct: false },
              { label: 'Four eighth notes equal one quarter note', correct: false },
              { label: 'One eighth note equals one quarter note', correct: false },
            ],
            [
              { label: 'A dotted half note lasts 3 beats in 4/4 time', correct: true },
              { label: 'A dotted half note lasts 4 beats in 4/4 time', correct: false },
              { label: 'A dotted half note lasts 2 beats in 4/4 time', correct: false },
              { label: 'A dotted half note lasts 1.5 beats in 4/4 time', correct: false },
            ],
            [
              { label: 'A sixteenth note receives half a beat in 4/4 time', correct: false },
              { label: 'A sixteenth note receives one quarter of a beat in 4/4 time', correct: true },
              { label: 'A sixteenth note receives one beat in 4/4 time', correct: false },
              { label: 'A sixteenth note receives one eighth of a beat in 4/4 time', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l1u2m2: Meter & Time Signatures ----
  {
    moduleId: 'l1u2m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'What does this time signature tell you about the music?',
        hintTemplate: 'The top number is beats per measure. The bottom number tells you which note value gets one beat (4 = quarter, 8 = eighth, 2 = half).',
        params: {
          choiceSets: [
            [
              { label: '2/4 means 2 quarter-note beats per measure', correct: true },
              { label: '2/4 means 4 half-note beats per measure', correct: false },
              { label: '2/4 means 2 half-note beats per measure', correct: false },
              { label: '2/4 means 4 quarter-note beats per measure', correct: false },
            ],
            [
              { label: '6/8 is a compound meter with 2 main beats', correct: true },
              { label: '6/8 is a simple meter with 6 beats', correct: false },
              { label: '6/8 is the same as 3/4', correct: false },
              { label: '6/8 has 8 beats per measure', correct: false },
            ],
            [
              { label: 'Common time (C) is equivalent to 4/4', correct: true },
              { label: 'Common time (C) is equivalent to 2/2', correct: false },
              { label: 'Common time (C) means the piece is in C major', correct: false },
              { label: 'Common time (C) is equivalent to 3/4', correct: false },
            ],
            [
              { label: 'Cut time (alla breve) is equivalent to 2/2', correct: true },
              { label: 'Cut time is equivalent to 4/4', correct: false },
              { label: 'Cut time means to play at half tempo', correct: false },
              { label: 'Cut time is equivalent to 6/8', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 3: Scales, Intervals, and First Chords
  // =========================================================================

  // ---- l1u3m1: Major Scale ----
  {
    moduleId: 'l1u3m1',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} major scale. Select all 7 notes following the W-W-H-W-W-W-H pattern.',
        hintTemplate: 'The {root} major scale follows Whole-Whole-Half-Whole-Whole-Whole-Half steps starting from {root}. Count semitones: W=2, H=1.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A', 'E'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['major'],
          noteCounts: [7],
        },
      },
      {
        type: 'scale_degree_id',
        promptTemplate: 'In the {root} {scaleType} scale, what degree is the note {note}?',
        hintTemplate: 'Count up from {root} (degree 1) through the {scaleType} scale until you reach {note}.',
        params: {
          roots: ['C', 'G', 'F'],
          accidentals: ['', '', ''],
          scaleTypes: ['major'],
          degrees: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l1u3m2: Key Signatures ----
  {
    moduleId: 'l1u3m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'What is the key signature for this major key?',
        hintTemplate: 'Sharp keys follow the circle of fifths: G(1#), D(2#), A(3#), E(4#). Flat keys: F(1b), Bb(2b), Eb(3b), Ab(4b).',
        params: {
          choiceSets: [
            [
              { label: 'E major has 4 sharps: F#, C#, G#, D#', correct: true },
              { label: 'E major has 3 sharps: F#, C#, G#', correct: false },
              { label: 'E major has 5 sharps', correct: false },
              { label: 'E major has 2 sharps', correct: false },
            ],
            [
              { label: 'Bb major has 2 flats: Bb, Eb', correct: true },
              { label: 'Bb major has 1 flat: Bb', correct: false },
              { label: 'Bb major has 3 flats', correct: false },
              { label: 'Bb major has no flats', correct: false },
            ],
            [
              { label: 'Ab major has 4 flats: Bb, Eb, Ab, Db', correct: true },
              { label: 'Ab major has 3 flats', correct: false },
              { label: 'Ab major has 5 flats', correct: false },
              { label: 'Ab major has 2 flats', correct: false },
            ],
            [
              { label: 'C major has no sharps or flats', correct: true },
              { label: 'C major has 1 sharp', correct: false },
              { label: 'C major has 1 flat', correct: false },
              { label: 'C major has 7 sharps', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l1u3m3: Intervals ----
  {
    moduleId: 'l1u3m3',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Identify the interval from {root} going {direction}. Count both letter names and semitones.',
        hintTemplate: 'From {root}, count letter names for the interval number and semitones for the quality. {semitones} semitones {direction}.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          intervals: [2, 3, 4, 5, 7],
          directions: ['ascending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l1u3m4: Major Triads ----
  {
    moduleId: 'l1u3m4',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root} major triad. Select the root, major 3rd (4 semitones), and perfect 5th (7 semitones).',
        hintTemplate: 'A major triad = root + major 3rd (4 semitones up) + perfect 5th (7 semitones up). Start on {root} and count.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major'],
          noteCounts: [3],
        },
        points: 2,
      },
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root} major triad using the notes from the key signature.',
        hintTemplate: '{root} major triad: root ({root}), major 3rd, perfect 5th. Remember the key signature to find the correct notes.',
        params: {
          roots: ['F', 'G', 'D'],
          accidentals: ['', '', ''],
          chordQualities: ['major'],
          noteCounts: [3],
        },
        points: 2,
      },
    ],
    targetCount: 6,
  },
];

export default templates;
