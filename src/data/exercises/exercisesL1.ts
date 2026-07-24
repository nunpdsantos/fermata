import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 1 Exercises — ~40 exercises across 10 modules
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 1: Notation and Pitch
  // =========================================================================

  // ---- l1u1m1: Staff & Clefs ----
  l1u1m1: [
    {
      id: 'l1u1m1e1',
      type: 'note_id',
      prompt: 'Identify this note on the treble clef: it sits on the ledger line below the staff.',
      config: {
        type: 'note_id',
        note: 'C',
        accidental: '',
        octave: 4,
      },
      hint: 'Middle C sits on one ledger line just below the treble staff.',
      points: 1,
    },
    {
      id: 'l1u1m1e2',
      type: 'note_id',
      prompt: 'Identify this note: it sits on the first line of the treble staff.',
      config: {
        type: 'note_id',
        note: 'E',
        accidental: '',
        octave: 4,
      },
      hint: 'The treble clef lines from bottom to top are E-G-B-D-F. The first line is E4.',
      points: 1,
    },
    {
      id: 'l1u1m1e3',
      type: 'note_id',
      prompt: 'Identify this note: it sits on the second line of the treble staff.',
      config: {
        type: 'note_id',
        note: 'G',
        accidental: '',
        octave: 4,
      },
      hint: 'The treble clef curls around the second line, marking it as G. That is why it is also called the G clef.',
      points: 1,
    },
    {
      id: 'l1u1m1e4',
      type: 'multiple_choice',
      prompt: 'Which clef uses the second line of the staff as the reference point for the note G?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Treble clef', correct: true },
          { label: 'Bass clef', correct: false },
          { label: 'Alto clef', correct: false },
          { label: 'Tenor clef', correct: false },
        ],
      },
      hint: 'The treble clef is also called the G clef because it wraps around the second line, defining it as G.',
      points: 1,
    },
  ],

  // ---- l1u1m2: Ledger Lines ----
  l1u1m2: [
    {
      id: 'l1u1m2e1',
      type: 'note_id',
      prompt: 'Identify this note below the treble staff: it sits on the second ledger line below.',
      config: {
        type: 'note_id',
        note: 'A',
        accidental: '',
        octave: 3,
      },
      hint: 'Below the treble staff: B3 is in the space below the first ledger line (C4), and A3 is on the second ledger line.',
      points: 1,
    },
    {
      id: 'l1u1m2e2',
      type: 'note_id',
      prompt: 'Identify this note above the treble staff: it sits two ledger lines above the top line.',
      config: {
        type: 'note_id',
        note: 'C',
        accidental: '',
        octave: 6,
      },
      hint: 'C6 sits on the second ledger line above the treble staff. Count up from the top line (F5): G5, A5, B5, C6.',
      points: 1,
    },
    {
      id: 'l1u1m2e3',
      type: 'multiple_choice',
      prompt: 'What is the purpose of ledger lines?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'To extend the staff for notes that fall above or below its five lines', correct: true },
          { label: 'To indicate the tempo of a piece', correct: false },
          { label: 'To separate measures from one another', correct: false },
          { label: 'To show where rests occur', correct: false },
        ],
      },
      hint: 'The staff has only five lines. Notes that go beyond those lines need extra short lines to indicate their position.',
      points: 1,
    },
    {
      id: 'l1u1m2e_ear1',
      type: 'ear_training',
      prompt: 'Listen to this note and identify it.',
      config: {
        type: 'ear_training',
        mode: 'note',
        note: 'C',
        accidental: '',
        octave: 4,
      },
      hint: 'This is middle C -- the most central note on the piano keyboard.',
      points: 1,
    },
    {
      id: 'l1u1m2e_ear2',
      type: 'ear_training',
      prompt: 'Listen to this note and identify it.',
      config: {
        type: 'ear_training',
        mode: 'note',
        note: 'E',
        accidental: '',
        octave: 4,
      },
      hint: 'This natural note sits on the first line of the treble staff.',
      points: 1,
    },
    {
      id: 'l1u1m2e_ear3',
      type: 'ear_training',
      prompt: 'Listen to this note and identify it.',
      config: {
        type: 'ear_training',
        mode: 'note',
        note: 'G',
        accidental: '',
        octave: 4,
      },
      hint: 'This note sits on the second line of the treble staff -- the line the treble clef curls around.',
      points: 1,
    },
    {
      id: 'l1u1m2e_ear4',
      type: 'ear_training',
      prompt: 'Listen to this note and identify it.',
      config: {
        type: 'ear_training',
        mode: 'note',
        note: 'A',
        accidental: '',
        octave: 4,
      },
      hint: 'This is the standard tuning reference note at 440 Hz.',
      points: 1,
    },
  ],

  // ---- l1u1m3: Half Steps & Whole Steps ----
  l1u1m3: [
    {
      id: 'l1u1m3e1',
      type: 'interval_id',
      prompt: 'What is the interval from C to C#?',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 1,
        direction: 'ascending',
      },
      hint: 'C to C# is the smallest possible distance in Western music: one half step, which equals 1 semitone.',
      points: 1,
    },
    {
      id: 'l1u1m3e2',
      type: 'interval_id',
      prompt: 'What is the interval from C to D?',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 2,
        direction: 'ascending',
      },
      hint: 'C to D is a whole step: two half steps, which equals 2 semitones. There is one key (C#/Db) between them.',
      points: 1,
    },
    {
      id: 'l1u1m3e3',
      type: 'interval_id',
      prompt: 'What is the interval from E to F? This is a special pair of natural notes.',
      config: {
        type: 'interval_id',
        root: 'E',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 1,
        direction: 'ascending',
      },
      hint: 'E to F is a natural half step: there is no black key between them on the piano. It is only 1 semitone.',
      points: 1,
    },
  ],

  // ---- l1u1m4: Chromatic Scale ----
  l1u1m4: [
    {
      id: 'l1u1m4e1',
      type: 'note_id',
      prompt: 'Identify this note: the black key between F and G.',
      config: {
        type: 'note_id',
        note: 'F',
        accidental: '#',
        octave: 4,
        acceptEnharmonic: true,
      },
      hint: 'The black key between F and G can be called F# (F sharp) or Gb (G flat). Both names refer to the same pitch.',
      points: 1,
    },
    {
      id: 'l1u1m4e2',
      type: 'note_id',
      prompt: 'Identify this note: the black key between A and B.',
      config: {
        type: 'note_id',
        note: 'B',
        accidental: 'b',
        octave: 4,
        acceptEnharmonic: true,
      },
      hint: 'The black key between A and B can be called Bb (B flat) or A# (A sharp). In flat keys this note is called Bb.',
      points: 1,
    },
    {
      id: 'l1u1m4e3',
      type: 'multiple_choice',
      prompt: 'How many distinct pitches are in the chromatic scale before it repeats?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '12', correct: true },
          { label: '7', correct: false },
          { label: '8', correct: false },
          { label: '10', correct: false },
        ],
      },
      hint: 'The chromatic scale includes every note: 7 white keys + 5 black keys = 12 distinct pitches per octave.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 2: Rhythm and Meter
  // =========================================================================

  // ---- l1u2m1: Note Values ----
  l1u2m1: [
    {
      id: 'l1u2m1e1',
      type: 'multiple_choice',
      prompt: 'In 4/4 time, how many beats does a whole note last?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '4 beats', correct: true },
          { label: '2 beats', correct: false },
          { label: '1 beat', correct: false },
          { label: '8 beats', correct: false },
        ],
      },
      hint: 'A whole note fills an entire measure of 4/4 time. It lasts 4 quarter-note beats.',
      points: 1,
    },
    {
      id: 'l1u2m1e2',
      type: 'multiple_choice',
      prompt: 'How many beats does a half note receive in 4/4 time?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '2 beats', correct: true },
          { label: '4 beats', correct: false },
          { label: '1 beat', correct: false },
          { label: '3 beats', correct: false },
        ],
      },
      hint: 'A half note is half the duration of a whole note. One whole = two halves = 4 beats / 2 = 2 beats each.',
      points: 1,
    },
    {
      id: 'l1u2m1e3',
      type: 'multiple_choice',
      prompt: 'How many beats does a quarter note receive in 4/4 time?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '1 beat', correct: true },
          { label: '2 beats', correct: false },
          { label: '1/2 beat', correct: false },
          { label: '4 beats', correct: false },
        ],
      },
      hint: 'In 4/4 time, the bottom number (4) tells you that a quarter note gets one beat. Four quarter notes fill one measure.',
      points: 1,
    },
  ],

  // ---- l1u2m2: Meter & Time Signatures ----
  l1u2m2: [
    {
      id: 'l1u2m2e1',
      type: 'multiple_choice',
      prompt: 'What does the time signature 4/4 mean?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '4 quarter-note beats per measure', correct: true },
          { label: '4 half-note beats per measure', correct: false },
          { label: '4 eighth-note beats per measure', correct: false },
          { label: '4 measures per line', correct: false },
        ],
      },
      hint: 'The top number (4) is beats per measure. The bottom number (4) means the quarter note gets one beat.',
      points: 1,
    },
    {
      id: 'l1u2m2e2',
      type: 'multiple_choice',
      prompt: 'What does the time signature 3/4 tell you?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '3 quarter-note beats per measure', correct: true },
          { label: '3 half-note beats per measure', correct: false },
          { label: '4 beats grouped in threes', correct: false },
          { label: '3 measures of 4 beats', correct: false },
        ],
      },
      hint: '3/4 means three quarter-note beats per measure. This creates the ONE-two-three waltz feel.',
      points: 1,
    },
    {
      id: 'l1u2m2e3',
      type: 'multiple_choice',
      prompt: 'Which of the following best describes "simple meter"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each beat divides naturally into two equal parts', correct: true },
          { label: 'Each beat divides naturally into three equal parts', correct: false },
          { label: 'The music has no time signature', correct: false },
          { label: 'The tempo is slow and steady', correct: false },
        ],
      },
      hint: 'In simple meter, beats subdivide into two. In compound meter, beats subdivide into three. 4/4 and 3/4 are simple meters.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 3: Scales, Intervals, and First Chords
  // =========================================================================

  // ---- l1u3m1: Major Scale ----
  l1u3m1: [
    {
      id: 'l1u3m1e1',
      type: 'scale_build',
      prompt: 'Build the C major scale. Select all 7 notes on the instrument.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        noteCount: 7,
      },
      hint: 'C major uses only the white keys: C, D, E, F, G, A, B. The pattern is W-W-H-W-W-W-H.',
      points: 2,
    },
    {
      id: 'l1u3m1e2',
      type: 'scale_build',
      prompt: 'Build the G major scale. Select all 7 notes. Remember: one note needs a sharp.',
      config: {
        type: 'scale_build',
        root: 'G',
        rootAccidental: '',
        scaleType: 'major',
        noteCount: 7,
      },
      hint: 'G major: G, A, B, C, D, E, F#. The F must be raised to F# to maintain the W-W-H-W-W-W-H pattern.',
      points: 2,
    },
    {
      id: 'l1u3m1e_deg1',
      type: 'scale_degree_id',
      prompt: 'In the C major scale, what degree is the note E?',
      config: {
        type: 'scale_degree_id',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        note: 'E',
        noteAccidental: '',
        correctDegree: 3,
      },
      hint: 'Count up from the root: C=1, D=2, E=3.',
      points: 1,
    },
    {
      id: 'l1u3m1e_deg2',
      type: 'scale_degree_id',
      prompt: 'In the C major scale, what degree is the note G?',
      config: {
        type: 'scale_degree_id',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        note: 'G',
        noteAccidental: '',
        correctDegree: 5,
      },
      hint: 'G is the 5th note of C major — the dominant.',
      points: 1,
    },
    {
      id: 'l1u3m1e_deg3',
      type: 'scale_degree_id',
      prompt: 'In the C major scale, what degree is the note F?',
      config: {
        type: 'scale_degree_id',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        note: 'F',
        noteAccidental: '',
        correctDegree: 4,
      },
      hint: 'F is the 4th note of C major — the subdominant.',
      points: 1,
    },
    {
      id: 'l1u3m1e_deg4',
      type: 'scale_degree_id',
      prompt: 'In the G major scale, what degree is the note B?',
      config: {
        type: 'scale_degree_id',
        root: 'G',
        rootAccidental: '',
        scaleType: 'major',
        note: 'B',
        noteAccidental: '',
        correctDegree: 3,
      },
      hint: 'Count from G: G=1, A=2, B=3.',
      points: 1,
    },
  ],

  // ---- l1u3m2: Key Signatures ----
  l1u3m2: [
    {
      id: 'l1u3m2e1',
      type: 'multiple_choice',
      prompt: 'How many sharps does the key of G major have?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '1 sharp (F#)', correct: true },
          { label: '0 sharps or flats', correct: false },
          { label: '2 sharps (F#, C#)', correct: false },
          { label: '1 flat (Bb)', correct: false },
        ],
      },
      hint: 'G major needs F# to keep the W-W-H-W-W-W-H pattern. That single sharp is its key signature.',
      points: 1,
    },
    {
      id: 'l1u3m2e2',
      type: 'multiple_choice',
      prompt: 'Which key has the key signature of one flat (Bb)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'F major', correct: true },
          { label: 'Bb major', correct: false },
          { label: 'C major', correct: false },
          { label: 'G major', correct: false },
        ],
      },
      hint: 'F major needs Bb to maintain the major scale pattern. The fourth note (B) must be lowered to Bb.',
      points: 1,
    },
    {
      id: 'l1u3m2e3',
      type: 'multiple_choice',
      prompt: 'What is the key signature of D major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '2 sharps (F# and C#)', correct: true },
          { label: '1 sharp (F#)', correct: false },
          { label: '3 sharps (F#, C#, G#)', correct: false },
          { label: '2 flats (Bb, Eb)', correct: false },
        ],
      },
      hint: 'D major adds C# on top of G major\'s F#. Sharps accumulate in order: F#, C#, G#, D#, A#, E#, B#.',
      points: 1,
    },
  ],

  // ---- l1u3m3: Intervals ----
  l1u3m3: [
    {
      id: 'l1u3m3e1',
      type: 'interval_id',
      prompt: 'Identify the interval: C up to G. Count the letter names.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 7,
        direction: 'ascending',
      },
      hint: 'C-D-E-F-G = 5 letter names = a 5th. C to G is 7 semitones, making it a perfect 5th.',
      points: 1,
    },
    {
      id: 'l1u3m3e2',
      type: 'interval_id',
      prompt: 'Identify the interval: C up to F. Count the letter names.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 5,
        direction: 'ascending',
      },
      hint: 'C-D-E-F = 4 letter names = a 4th. C to F is 5 semitones, making it a perfect 4th.',
      points: 1,
    },
    {
      id: 'l1u3m3e3',
      type: 'interval_id',
      prompt: 'Identify the interval: C up to E. Count the letter names.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 4,
        direction: 'ascending',
      },
      hint: 'C-D-E = 3 letter names = a 3rd. C to E is 4 semitones, making it a major 3rd.',
      points: 1,
    },
  ],

  // ---- l1u3m4: Major Triads ----
  l1u3m4: [
    {
      id: 'l1u3m4e1',
      type: 'chord_build',
      prompt: 'Build a C major triad. Select the 3 notes: root, major 3rd, and perfect 5th.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'C major = C, E, G. Root (C) + major 3rd (E, 4 semitones up) + perfect 5th (G, 7 semitones up).',
      points: 2,
    },
    {
      id: 'l1u3m4e2',
      type: 'chord_build',
      prompt: 'Build a G major triad. Select the 3 notes that form this chord.',
      config: {
        type: 'chord_build',
        root: 'G',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'G major = G, B, D. Root (G) + major 3rd (B, 4 semitones up) + perfect 5th (D, 7 semitones up).',
      points: 2,
    },
    {
      id: 'l1u3m4e3',
      type: 'multiple_choice',
      prompt: 'What intervals make up a major triad?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Root, major 3rd (4 semitones), perfect 5th (7 semitones)', correct: true },
          { label: 'Root, minor 3rd (3 semitones), perfect 5th (7 semitones)', correct: false },
          { label: 'Root, major 3rd (4 semitones), minor 5th (6 semitones)', correct: false },
          { label: 'Root, perfect 4th (5 semitones), perfect 5th (7 semitones)', correct: false },
        ],
      },
      hint: 'A major triad stacks a major 3rd (4 half steps from root) and then a minor 3rd on top (3 more), giving root + M3 + P5.',
      points: 1,
    },
  ],
};

export default exercises;
