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
        promptTemplate: 'Identify the note shown on or just around the treble staff.',
        hintTemplate: 'Use the treble clef line/space positions: lines are E-G-B-D-F, spaces are F-A-C-E.',
        nudgeTemplate: 'Start from the line the treble clef curls around, which holds the note the clef centers on. Count up or down from there, one letter for each line or space, until you reach the note.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          octaves: [4, 5],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the clefs is true?',
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
              { label: 'The bass clef marks the fourth line (from the bottom) as F', correct: true },
              { label: 'The bass clef marks the second line from the bottom as G', correct: false },
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
        // Below the treble staff (bottom line E4): C4 on the 1st ledger line,
        // B3 under it, A3 on the 2nd, G3 under it, F3 on the 3rd (audit W4-05).
        type: 'note_id',
        promptTemplate: 'Identify this note below the treble staff. Count down line by line from the bottom of the staff.',
        hintTemplate: 'Below the treble staff, middle C sits on the first ledger line. Count down by step from there: lines and spaces alternate, so the next ledger line down holds A and the one after that F.',
        nudgeTemplate: 'The bottom line of the treble staff is E. Count down from it one letter at a time, alternating space and ledger line (the space just below the staff, then the first ledger line, then the space under it…), until you reach the note.',
        params: {
          roots: ['C', 'B', 'A', 'G', 'F'],
          accidentals: ['', '', '', '', ''],
          noteOctaves: [4, 3, 3, 3, 3],
          clef: 'treble',
        },
      },
      {
        // Above the treble staff (top line F5): A5 on the 1st ledger line, B5
        // above it, C6 on the 2nd, D6 above it, E6 on the 3rd.
        type: 'note_id',
        promptTemplate: 'Identify this note above the treble staff. Count up line by line from the top of the staff.',
        hintTemplate: 'The top line of the treble staff is F. Count up by step: G sits just above the staff, A on the first ledger line, C on the second and E on the third.',
        params: {
          roots: ['A', 'B', 'C', 'D', 'E'],
          accidentals: ['', '', '', '', ''],
          noteOctaves: [5, 5, 6, 6, 6],
          clef: 'treble',
        },
      },
      {
        // Above the bass staff (top line A3): middle C (C4) on the 1st ledger
        // line, D4 above it, E4 on the 2nd.
        type: 'note_id',
        promptTemplate: 'Identify this note above the bass staff. Count up line by line from the top of the staff.',
        hintTemplate: 'The top line of the bass staff is A. Middle C sits on the first ledger line above it — the same middle C that sits on the first ledger line below the treble staff. E is on the second ledger line.',
        nudgeTemplate: 'The top line of the bass staff is A. Count up from it one letter at a time, alternating space and ledger line (the space just above the staff, then the first ledger line, then the space above it…), until you reach the note.',
        params: {
          roots: ['C', 'D', 'E'],
          accidentals: ['', '', ''],
          noteOctaves: [4, 4, 4],
          clef: 'bass',
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
        promptTemplate: 'What is the {direction} interval from {root}? Is it a half step or whole step?',
        hintTemplate: 'A half step is 1 semitone (adjacent keys on the piano). A whole step is 2 semitones (one key between them). From {root}, count carefully.',
        nudgeTemplate: 'Find {root} and the second note on the keyboard, counting black keys too: is the second note the very next key up, or is there one key in between?',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [1, 2],
          directions: ['ascending'],
          octaves: [4],
          // L1 names steps, not interval qualities (W4-15).
          intervalAnswer: 'step',
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
        promptTemplate: 'Identify this black-key note, written here with a sharp.',
        hintTemplate: 'Every black key has two names (enharmonic equivalents): one spelled with a sharp, one with a flat. Read the accidental on the staff: this one is written as a sharp.',
        params: {
          roots: ['C', 'D', 'F', 'G', 'A'],
          accidentals: ['#', '#', '#', '#', '#'],
          octaves: [4],
        },
      },
      {
        type: 'note_id',
        promptTemplate: 'Identify this black-key note, written here with a flat.',
        hintTemplate: 'Every black key has two names (enharmonic equivalents): one spelled with a sharp, one with a flat. Read the accidental on the staff: this one is written as a flat.',
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
        promptTemplate: 'Which statement about note values is true?',
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
              { label: 'A sixteenth note receives three quarters of a beat in 4/4 time', correct: false },
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
        promptTemplate: 'Which statement about time signatures is true?',
        hintTemplate: 'The top number counts the beats in each measure: 2 = duple, 3 = triple, 4 = quadruple. The bottom number 4 means each beat is a quarter note.',
        params: {
          choiceSets: [
            [
              { label: '2/4 means 2 quarter-note beats in every measure', correct: true },
              { label: '2/4 means 4 half-note beats per measure', correct: false },
              { label: '2/4 means 2 half-note beats per measure', correct: false },
              { label: '2/4 means 4 quarter-note beats per measure', correct: false },
            ],
            [
              { label: '3/4 groups its beats in threes: strong-weak-weak', correct: true },
              { label: '3/4 groups its beats in pairs: strong-weak, strong-weak', correct: false },
              { label: '3/4 groups its beats in fours: strong-weak-medium-weak', correct: false },
              { label: '3/4 has no strong beat', correct: false },
            ],
            [
              { label: '4/4 is quadruple: four beats per measure', correct: true },
              { label: '4/4 is triple: three beats per measure', correct: false },
              { label: '4/4 is duple: two beats per measure', correct: false },
              { label: '4/4 means four measures on each line of music', correct: false },
            ],
            [
              { label: 'In 2/4, 3/4 and 4/4, the bottom 4 means a quarter note gets one beat', correct: true },
              { label: 'In 2/4, 3/4 and 4/4, the bottom 4 means a whole note gets one beat', correct: false },
              { label: 'In 2/4, 3/4 and 4/4, the bottom 4 means each measure lasts four beats', correct: false },
              { label: 'In 2/4, 3/4 and 4/4, the bottom 4 sets the tempo at four beats per second', correct: false },
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
        // The staff shows a key signature; the learner reads it (W4-06).
        // Only the four keys this module teaches (W4-15).
        type: 'multiple_choice',
        promptTemplate: 'Which major key has this key signature?',
        hintTemplate: 'No sharps or flats = C major. One sharp (F#) = G major. Two sharps (F#, C#) = D major. One flat (Bb) = F major.',
        nudgeTemplate: 'Count the sharps or flats and note which ones they are. With sharps, the key note sits a half step above the last sharp; otherwise, find the major scale that needs exactly that one flat, or no black keys at all.',
        params: {
          choiceSets: [
            [
              { label: 'C major', correct: true },
              { label: 'G major', correct: false },
              { label: 'D major', correct: false },
              { label: 'F major', correct: false },
            ],
            [
              { label: 'G major', correct: true },
              { label: 'D major', correct: false },
              { label: 'F major', correct: false },
              { label: 'C major', correct: false },
            ],
            [
              { label: 'D major', correct: true },
              { label: 'G major', correct: false },
              { label: 'C major', correct: false },
              { label: 'F major', correct: false },
            ],
            [
              { label: 'F major', correct: true },
              { label: 'C major', correct: false },
              { label: 'G major', correct: false },
              { label: 'D major', correct: false },
            ],
          ],
          stimuli: [
            { notes: [], keySignature: 'C', clef: 'treble' },
            { notes: [], keySignature: 'G', clef: 'treble' },
            { notes: [], keySignature: 'D', clef: 'treble' },
            { notes: [], keySignature: 'F', clef: 'treble' },
          ],
        },
      },
    ],
    targetCount: 4,
  },

  // ---- l1u3m3: Intervals ----
  {
    moduleId: 'l1u3m3',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Identify the {direction} interval from {root} by its number: count the letter names, including both notes.',
        hintTemplate: 'Count the letter names from {root} up to the second note, counting both: two letters make a 2nd, three a 3rd, four a 4th, five a 5th.',
        nudgeTemplate: "Count the letter names from {root} up to the second note, counting both notes: the number of letters you say is the interval's number. Count the notes themselves, not the steps between them.",
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          intervals: [2, 3, 4, 5, 7],
          directions: ['ascending'],
          octaves: [4],
          // "For now, the number is enough" (L1): answers are 2nd, 3rd … (W4-15).
          intervalAnswer: 'number',
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
        promptTemplate: 'Build the {root} major triad. Select the root, major 3rd (4 semitones), and perfect 5th (7 semitones).',
        hintTemplate: 'A major triad = root + major 3rd (4 semitones up) + perfect 5th (7 semitones up). Start on {root} and count.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major'],
          noteCounts: [3],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'Build the {root} major triad using the notes from the key signature.',
        hintTemplate: '{root} major triad: root ({root}), major 3rd, perfect 5th. Remember the key signature to find the correct notes.',
        params: {
          roots: ['F', 'G', 'D'],
          accidentals: ['', '', ''],
          chordQualities: ['major'],
          noteCounts: [3],
        },
      },
    ],
    targetCount: 6,
  },
];

export default templates;
