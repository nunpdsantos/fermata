import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 1 Exercises — ~40 exercises across 10 modules
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {

  l1u33m1: [
    {
      id: 'l1u33m1e1',
      type: 'multiple_choice',
      prompt: 'A guitar part has a treble clef with a small 8 below. How does written E4 sound?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: 'As E5',
            correct: false
          },
          {
            label: 'As E3',
            correct: true
          },
          {
            label: 'As E4',
            correct: false
          },
          {
            label: 'As B3',
            correct: false
          }
        ]
      },
      hint: 'The small 8 below the clef means one octave lower: written E4 sounds as E3.'
    },
    {
      id: 'l1u33m1e2',
      type: 'multiple_choice',
      prompt: 'What does ③ beside a guitar note specify?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: 'Finger 3',
            correct: false
          },
          {
            label: 'Fret 3',
            correct: false
          },
          {
            label: 'String 3',
            correct: true
          },
          {
            label: 'Position III',
            correct: false
          }
        ]
      },
      hint: 'A number in a circle specifies the string. Left-hand finger numbers are not circled.'
    },
    {
      id: 'l1u33m1e3',
      type: 'multiple_choice',
      prompt: 'In standard guitar tuning, which open string sounds E2?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: '⑥',
            correct: true
          },
          {
            label: '①',
            correct: false
          },
          {
            label: '④',
            correct: false
          },
          {
            label: '②',
            correct: false
          }
        ]
      },
      hint: 'String 6 is the thickest and lowest-pitched string: its open pitch is E2 in standard tuning.'
    }
  ],
  l1u33m2: [
    {
      id: 'l1u33m2e1',
      type: 'multiple_choice',
      prompt: 'Which left-hand finger does the number 4 name?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: 'Index',
            correct: false
          },
          {
            label: 'Ring',
            correct: false
          },
          {
            label: 'Middle',
            correct: false
          },
          {
            label: 'Little',
            correct: true
          }
        ]
      },
      hint: 'Left-hand fingers are 1 index, 2 middle, 3 ring and 4 little.'
    },
    {
      id: 'l1u33m2e2',
      type: 'multiple_choice',
      prompt: 'What does 0 mean in a guitar fingering?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: 'Play the string with no left-hand finger pressing it at any fret',
            correct: true
          },
          {
            label: 'Play the string with a left-hand finger pressing it at fret 1',
            correct: false
          },
          {
            label: 'Play the string with a left-hand barre pressing it at fret 1',
            correct: false
          },
          {
            label: 'Play the string with a left-hand finger pressing it at fret 3',
            correct: false
          }
        ]
      },
      hint: 'Zero means that no left-hand finger stops the string.'
    },
    {
      id: 'l1u33m2e3',
      type: 'multiple_choice',
      prompt: 'Which finger order does p-i-m-a specify?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: 'Little, index, middle, ring',
            correct: false
          },
          {
            label: 'Thumb, index, middle, ring',
            correct: true
          },
          {
            label: 'Thumb, index, middle, little',
            correct: false
          },
          {
            label: 'Ring, index, middle, thumb',
            correct: false
          }
        ]
      },
      hint: 'The right-hand letters are p thumb, i index, m middle and a ring.'
    },
    {
      id: 'l1u33m2e4',
      type: 'multiple_choice',
      prompt: 'Which letters mean thumb, ring, middle, index?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: 'a-p-m-i',
            correct: false
          },
          {
            label: 'p-i-m-a',
            correct: false
          },
          {
            label: 'p-a-m-i',
            correct: true
          },
          {
            label: 'a-m-p-i',
            correct: false
          }
        ]
      },
      hint: 'Read the letters in order: p is thumb, a is ring, m is middle and i is index.'
    }
  ],
  l1u33m3: [
    {
      id: 'l1u33m3e1',
      type: 'multiple_choice',
      prompt: 'In position V, which fret is the normal base for the index finger?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: 'Fret 4',
            correct: false
          },
          {
            label: 'Fret 5',
            correct: true
          },
          {
            label: 'Fret 6',
            correct: false
          },
          {
            label: 'Fret 7',
            correct: false
          }
        ]
      },
      hint: 'V means fifth position: the index finger is based at fret 5.'
    },
    {
      id: 'l1u33m3e2',
      type: 'multiple_choice',
      prompt: 'Which instruction does CV give in guitar notation?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: 'Partial barre at fret 5',
            correct: false
          },
          {
            label: 'Full barre at fret 4',
            correct: false
          },
          {
            label: 'Partial barre at fret 4',
            correct: false
          },
          {
            label: 'Full barre at fret 5',
            correct: true
          }
        ]
      },
      hint: 'C marks a full barre and V locates it at fret 5. V alone names the position without requiring a barre.'
    },
    {
      id: 'l1u33m3e3',
      type: 'multiple_choice',
      prompt: 'Which mark requests a partial barre at fret 5?',
      config: {
        type: 'multiple_choice',
        choices: [
          {
            label: '½CV',
            correct: true
          },
          {
            label: 'CV',
            correct: false
          },
          {
            label: 'V',
            correct: false
          },
          {
            label: '⑤',
            correct: false
          }
        ]
      },
      hint: '½C requests a partial barre; V sets its fret. The score or fingering tells you which strings to cover.'
    }
  ]
,
  // =========================================================================
  // Unit 1: Notation and Pitch
  // =========================================================================

  // ---- l1u1m1: Staff & Clefs ----
  l1u1m1: [
    {
      id: 'l1u1m1e1',
      type: 'note_id',
      prompt: 'Identify this note on the treble clef: it sits on a short extra line (a ledger line) just below the staff.',
      config: {
        type: 'note_id',
        note: 'C',
        accidental: '',
        octave: 4,
      },
      hint: 'Middle C sits on one ledger line just below the treble staff.',
      nudge: 'The treble clef curls around the second line, marking it as G. Count down from there, one letter for each line or space, until you reach the ledger line below the staff.',
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
      nudge: 'The treble clef curls around the second line, marking it as G. Step down from there, one letter for each space or line, until you reach the first line.',
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
      nudge: 'Count up from middle C (the ledger line just below the staff), one letter for each line or space, until you reach this line.',
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
          { label: 'Percussion clef', correct: false },
        ],
      },
      hint: 'The treble clef is also called the G clef because it wraps around the second line, defining it as G.',
      nudge: 'Each pitched clef began as a stylized letter and fixes one note on one line of the staff. Which clef has its curl wrapped around the second line from the bottom?',
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
        clef: 'treble',
        octave: 3,
      },
      hint: 'Below the treble staff: B3 is in the space below the first ledger line (C4), and A3 is on the second ledger line.',
      nudge: 'Start from middle C on the first ledger line below the treble staff and count down one letter for each line or space.',
    },
    {
      id: 'l1u1m2e2',
      type: 'note_id',
      prompt: 'Identify this note above the treble staff: it sits two ledger lines above the top line.',
      config: {
        type: 'note_id',
        note: 'C',
        accidental: '',
        clef: 'treble',
        octave: 6,
      },
      hint: 'C6 sits on the second ledger line above the treble staff. Count up from the top line (F5): G5, A5, B5, C6.',
      nudge: 'Start from the top line of the treble staff (F5) and count up one letter for each line or space: the space above it, the first ledger line, the next space, then the second ledger line.',
    },
    {
      id: 'l1u1m2e3',
      type: 'multiple_choice',
      prompt: 'What is the purpose of ledger lines?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'To notate pitches outside the staff', correct: true },
          { label: 'To separate measures on the staff', correct: false },
          { label: 'To raise every pitch by an octave', correct: false },
          { label: 'To connect two staves into one system', correct: false },
        ],
      },
      hint: 'The staff has only five lines. Notes that go beyond those lines need extra short lines to indicate their position.',
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
      hint: 'Compare it with the reference you heard first: is it higher, lower, or the very same note?',
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
      hint: 'It is higher than the reference C: sing up the white keys from C, one step at a time, until you reach it.',
    },
  ],

  // ---- l1u1m3: Half Steps & Whole Steps ----
  l1u1m3: [
    {
      id: 'l1u1m3e1',
      type: 'interval_id',
      prompt: 'What is the interval from Db down to C?',
      config: {
        type: 'interval_id',
        root: 'D',
        rootAccidental: 'b',
        rootOctave: 4,
        targetSemitones: 1,
        answer: 'step',
        direction: 'descending',
      },
      hint: 'Db down to C is the smallest possible distance in Western music: one half step (1 semitone), from the black key to the white key just below it. Two different letter names (D, C) make it a 2nd — a minor 2nd.',
      nudge: 'Find Db and C on the keyboard and look at what lies between them: are they direct neighbours, or is there another key, white or black, in between?',
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
        answer: 'step',
        direction: 'ascending',
      },
      hint: 'C to D is a whole step: two half steps, which equals 2 semitones. There is one key (C#/Db) between them.',
      nudge: 'Find C and D on the keyboard and count the keys from one to the other, black keys included: is D the very next key, or is there a key in between?',
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
        answer: 'step',
        direction: 'ascending',
      },
      hint: 'E to F is a natural half step: there is no black key between them on the piano. It is only 1 semitone.',
      nudge: 'Look at E and F on the keyboard: is there a black key between them, as there is between most neighbouring white keys?',
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
      nudge: 'A sharp raises a natural note by one half step, and every option here is a sharp. Which white key is this black key a half step above? Name it from that key.',
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
      nudge: 'A flat lowers a natural note by one half step, and every option here is a flat. Which white key is this black key a half step below? Name it from that key.',
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
      nudge: 'Count every key, white and black, from one C up to the next C, but leave out the top C: that is where the pattern starts again.',
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
        rhythm: { time: '4/4', notes: 'w' },
        choices: [
          { label: '4 beats', correct: true },
          { label: '2 beats', correct: false },
          { label: '1 beat', correct: false },
          { label: '8 beats', correct: false },
        ],
      },
      hint: 'A whole note fills an entire measure of 4/4 time. It lasts 4 quarter-note beats.',
      nudge: 'A whole note fills an entire bar of 4/4 on its own. Look at the time signature: what does its top number count?',
    },
    {
      id: 'l1u2m1e2',
      type: 'multiple_choice',
      prompt: 'How many beats does a half note receive in 4/4 time?',
      config: {
        type: 'multiple_choice',
        rhythm: { time: '4/4', notes: 'h h' },
        choices: [
          { label: '2 beats', correct: true },
          { label: '4 beats', correct: false },
          { label: '1 beat', correct: false },
          { label: '3 beats', correct: false },
        ],
      },
      hint: 'A half note is half the duration of a whole note. One whole = two halves = 4 beats / 2 = 2 beats each.',
      nudge: 'A half note lasts half as long as a whole note, and a whole note fills an entire bar of 4/4.',
    },
    {
      id: 'l1u2m1e3',
      type: 'multiple_choice',
      prompt: 'How many beats does a quarter note receive in 4/4 time?',
      config: {
        type: 'multiple_choice',
        rhythm: { time: '4/4', notes: 'q q q q' },
        choices: [
          { label: '1 beat', correct: true },
          { label: '2 beats', correct: false },
          { label: '1/2 beat', correct: false },
          { label: '4 beats', correct: false },
        ],
      },
      hint: 'In 4/4 time, the bottom number (4) tells you that a quarter note gets one beat. Four quarter notes fill one measure.',
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
        rhythm: { time: '4/4', notes: '>q q q q | >q q q q' },
        choices: [
          { label: '4 quarter-note beats per measure', correct: true },
          { label: '4 half-note beats per measure', correct: false },
          { label: '4 whole-note beats per measure', correct: false },
          { label: '4 eighth-note beats per measure', correct: false },
        ],
      },
      hint: 'The top number (4) is beats per measure. The bottom number (4) means the quarter note gets one beat.',
    },
    {
      id: 'l1u2m2e2',
      type: 'multiple_choice',
      prompt: 'What does the time signature 3/4 tell you?',
      config: {
        type: 'multiple_choice',
        rhythm: { time: '3/4', notes: '>q q q | >q q q' },
        choices: [
          { label: '3 quarter-note beats per measure', correct: true },
          { label: '3 half-note beats per measure', correct: false },
          { label: '3 whole-note beats per measure', correct: false },
          { label: '3 eighth-note beats per measure', correct: false },
        ],
      },
      hint: '3/4 means three quarter-note beats per measure. This creates the ONE-two-three waltz feel.',
    },
    {
      id: 'l1u2m2e3',
      type: 'multiple_choice',
      prompt: 'Which of the following best describes "simple meter"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The beat divides into 2 equal notes', correct: true },
          { label: 'The beat divides into 3 equal notes', correct: false },
          { label: 'The bar contains 2 beats', correct: false },
          { label: 'The bar contains 3 beats', correct: false },
        ],
      },
      hint: 'In simple meter, beats subdivide into two. In compound meter, beats subdivide into three. 4/4 and 3/4 are simple meters.',
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
          { label: '2 flats (Bb, Eb)', correct: false },
        ],
      },
      hint: 'G major needs F# to keep the W-W-H-W-W-W-H pattern. That single sharp is its key signature.',
    },
    {
      id: 'l1u3m2e2',
      type: 'multiple_choice',
      prompt: 'Which note is flattened in the key signature of F major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'B is flattened; A, E and F stay natural', correct: true },
          { label: 'E is flattened; A, B and F stay natural', correct: false },
          { label: 'A is flattened; B, E and F stay natural', correct: false },
          { label: 'F is flattened; A, B and E stay natural', correct: false },
        ],
      },
      hint: 'F major needs Bb to maintain the major scale pattern. The fourth note (B) must be lowered to Bb.',
    },
    {
      id: 'l1u3m2e3',
      type: 'multiple_choice',
      prompt: 'What is the key signature of D major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Key signature: F#, C#', correct: true },
          { label: 'Key signature: F#', correct: false },
          { label: 'Key signature: F#, C#, G#', correct: false },
          { label: 'Key signature: Bb, Eb', correct: false },
        ],
      },
      hint: 'D major adds C# on top of G major\'s F#. Sharps accumulate in order: F#, C#, G#, D#, A#, E#, B#.',
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
        answer: 'number',
        direction: 'ascending',
      },
      hint: 'C-D-E-F-G = 5 letter names = a 5th. C to G is 7 semitones, making it a perfect 5th.',
      nudge: "Say the letter names in order from C up to G and count them, counting both C and G: that total is the interval's number. Count the notes themselves, not the steps between them.",
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
        answer: 'number',
        direction: 'ascending',
      },
      hint: 'C-D-E-F = 4 letter names = a 4th. C to F is 5 semitones, making it a perfect 4th.',
      nudge: "Say the letter names in order from C up to F and count them, counting both C and F: that total is the interval's number. Count the notes themselves, not the steps between them.",
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
        answer: 'number',
        direction: 'ascending',
      },
      hint: 'C-D-E = 3 letter names = a 3rd. C to E is 4 semitones, making it a major 3rd.',
      nudge: "Say the letter names in order from C up to E and count them, counting both C and E: that total is the interval's number. Count the notes themselves, not the steps between them.",
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
    },
    {
      id: 'l1u3m4e3',
      type: 'chord_build',
      prompt: 'Build a B major triad. Select its three notes.',
      config: {
        type: 'chord_build',
        root: 'B',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'A major triad stacks a major 3rd (4 half steps from root) and then a minor 3rd on top (3 more), giving root + M3 + P5.',
    },
  ],

  // ---- Track "Start with sound" (wave 2): answered by ear or on the
  // instrument, never by reading a staff. The ear items in interval mode
  // carry authored `choices` (higher / lower, half / whole step).

  // ---- l1u34m1: High and Low ----
  l1u34m1: [
    {
      id: 'l1u34m1e1',
      type: 'ear_training',
      prompt: 'Listen to two notes, one after the other. Which one is higher?',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 7,
        direction: 'ascending',
        choices: [
          { label: 'The first note', correct: false },
          { label: 'The second note', correct: true },
          { label: 'Neither: they are the same note', correct: false },
        ],
      },
      hint: 'The second note was higher: the sound went up.',
      nudge: 'Play it again and hum along. Does your voice have to go up or down to follow the change?',
    },
    {
      id: 'l1u34m1e2',
      type: 'ear_training',
      prompt: 'Listen to two more notes, one after the other. Which one is higher?',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'E',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 5,
        direction: 'descending',
        choices: [
          { label: 'The first note', correct: true },
          { label: 'The second note', correct: false },
          { label: 'Neither: they are the same note', correct: false },
        ],
      },
      hint: 'The first note was higher: the sound went down.',
      nudge: 'Play it again and hum along. Does your voice have to go up or down to follow the change?',
    },
    {
      id: 'l1u34m1e3',
      type: 'ear_training',
      prompt: 'Listen to two notes. How does the second one compare with the first?',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 12,
        direction: 'ascending',
        choices: [
          { label: 'The same note again, higher', correct: true },
          { label: 'The same note again, lower', correct: false },
          { label: 'A different note, higher', correct: false },
          { label: 'A different note, lower', correct: false },
        ],
      },
      hint: 'It was an octave: the same note again, higher, so it keeps its name.',
      nudge: 'First decide whether the sound went up or down. Then hum both: do they feel alike, or quite different?',
    },
    {
      id: 'l1u34m1e4',
      type: 'multiple_choice',
      prompt: 'On a piano, where do you find the higher notes?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'On the right side', correct: true },
          { label: 'On the left side', correct: false },
          { label: 'On the middle keys', correct: false },
          { label: 'On the white keys', correct: false },
        ],
      },
      hint: 'On a piano the notes get higher from left to right: every key is a little higher than the key to its left.',
      nudge: 'Picture the lowest key of a piano. Which way do you move to go up from it?',
    },
    {
      id: 'l1u34m1e5',
      type: 'multiple_choice',
      prompt: 'On a guitar, which string sounds the highest when you play it open?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The thinnest string', correct: true },
          { label: 'The thickest string', correct: false },
          { label: 'The string in the middle', correct: false },
          { label: 'The string nearest to you', correct: false },
        ],
      },
      hint: 'Played open, each thinner string sounds higher than the one beside it, so the thinnest is the highest.',
      nudge: 'Think of the lesson on the guitar: how do the strings change from the lowest one to the next?',
    },
  ],

  // ---- l1u34m2: The Seven Letters ----
  l1u34m2: [
    {
      id: 'l1u34m2e1',
      type: 'multiple_choice',
      prompt: 'In the note names, which letter comes straight after G?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A', correct: true },
          { label: 'F', correct: false },
          { label: 'B', correct: false },
          { label: 'E', correct: false },
        ],
      },
      hint: 'There are only seven letters, A to G. After G the names start again at A, an octave higher.',
      nudge: 'There are only seven letters. What happens to the names after the last one?',
    },
    {
      id: 'l1u34m2e2',
      type: 'multiple_choice',
      prompt: 'On a piano, which white key sits just to the left of a group of two black keys?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C', correct: true },
          { label: 'D', correct: false },
          { label: 'F', correct: false },
          { label: 'E', correct: false },
        ],
      },
      hint: 'C is the white key just left of each group of two black keys. Just left of each group of three is F.',
      nudge: 'The black keys come in twos and threes. Picture a group of two and the white key on its left: which letter did the lesson give it?',
    },
    {
      id: 'l1u34m2e3',
      type: 'multiple_choice',
      prompt: 'On a guitar in the usual tuning, what are the open strings called, from the thickest to the thinnest?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'E, A, D, G, B, E', correct: true },
          { label: 'E, B, G, D, A, E', correct: false },
          { label: 'E, F, G, A, B, C', correct: false },
          { label: 'E, A, D, G, C, F', correct: false },
        ],
      },
      hint: 'From the thickest: E, A, D, G, B and E again, two octaves higher than the first.',
      nudge: 'The thickest and the thinnest strings share a letter, and the order runs from the thickest string. Which list fits both?',
    },
    {
      id: 'l1u34m2e4',
      type: 'scale_build',
      prompt: 'Starting on C, select seven notes, one for each letter. On the piano, use only white keys.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        noteCount: 7,
      },
      hint: 'C, D, E, F, G, A and B: one note for each letter, all of them white keys on the piano.',
      nudge: 'Start on C, the white key just left of a group of two black keys, and take the next white key each time until you have seven.',
    },
    {
      id: 'l1u34m2e5',
      type: 'multiple_choice',
      prompt: 'Two notes are an octave apart. How are they named?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'With the same letter', correct: true },
          { label: 'With the next letter', correct: false },
          { label: 'With the letter before', correct: false },
          { label: 'With the letter beside it', correct: false },
        ],
      },
      hint: 'Notes an octave apart sound so alike that they share their letter: the seven letters start again after G.',
      nudge: 'Count up the seven letters from any note. Where do you land when the names start again?',
    },
  ],

  // ---- l1u34m3: Half Steps and Whole Steps ----
  l1u34m3: [
    {
      id: 'l1u34m3e1',
      type: 'ear_training',
      prompt: 'Listen to two notes. How far apart are they?',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'E',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 1,
        direction: 'ascending',
        choices: [
          { label: 'A half step', correct: true },
          { label: 'A whole step', correct: false },
          { label: 'Two whole steps', correct: false },
        ],
      },
      hint: 'A half step: the two notes were neighbours, with no note between them.',
      nudge: 'Replay it and sing the two notes. Could another note fit between them, or not?',
    },
    {
      id: 'l1u34m3e2',
      type: 'ear_training',
      prompt: 'Listen to two more notes. How far apart are they?',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 2,
        direction: 'ascending',
        choices: [
          { label: 'A half step', correct: false },
          { label: 'A whole step', correct: true },
          { label: 'Two whole steps', correct: false },
        ],
      },
      hint: 'A whole step: two half steps, with one note skipped in between.',
      nudge: 'Replay it and sing the two notes. Could another note fit between them, or not?',
    },
    {
      id: 'l1u34m3e3',
      type: 'multiple_choice',
      prompt: 'What is C sharp (C♯)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The note a half step above C', correct: true },
          { label: 'The note a half step below C', correct: false },
          { label: 'The note a whole step above C', correct: false },
          { label: 'The note a whole step below C', correct: false },
        ],
      },
      hint: 'Sharp means a half step higher: C♯ is the black key just to the right of C, also called D♭.',
      nudge: 'Sharp and flat each move a note by the smallest distance there is. Which of them goes up?',
    },
    {
      id: 'l1u34m3e4',
      type: 'multiple_choice',
      prompt: 'Which two neighbouring white keys are only a half step apart?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'B and C', correct: true },
          { label: 'C and D', correct: false },
          { label: 'F and G', correct: false },
          { label: 'G and A', correct: false },
        ],
      },
      hint: 'There is no black key between B and C (nor between E and F), so they are only a half step apart.',
      nudge: 'Look for two white keys with no black key between them.',
    },
    {
      id: 'l1u34m3e5',
      type: 'scale_build',
      prompt: 'Select all twelve different notes from C up to B, white and black, each a half step from the next.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'chromatic',
        noteCount: 12,
      },
      hint: 'From C to B there are twelve notes, each a half step from the next: seven white keys and five black keys.',
      nudge: 'Start on C and take every key in turn, black and white, until the next one would be C again.',
    },
  ],

  // ---- l1u34m4: A Scale Is a Ladder ----
  l1u34m4: [
    {
      id: 'l1u34m4e1',
      type: 'scale_build',
      prompt: 'Build the major scale that starts on C: select its seven notes.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        noteCount: 7,
      },
      hint: 'C, D, E, F, G, A and B: all the white keys, because the two half steps fall on E to F and B to C.',
      nudge: 'Start on C and climb: whole, whole, half, whole, whole, whole, half.',
    },
    {
      id: 'l1u34m4e2',
      type: 'scale_build',
      prompt: 'Build the major scale that starts on G. Use the same steps as from C.',
      config: {
        type: 'scale_build',
        root: 'G',
        rootAccidental: '',
        scaleType: 'major',
        noteCount: 7,
      },
      hint: 'G, A, B, C, D, E and F♯: the F is raised so that the last step, up to G, is a half step.',
      nudge: 'Climb from G: whole, whole, half, whole, whole, whole, half. Check the last two steps carefully.',
    },
    {
      id: 'l1u34m4e3',
      type: 'ear_training',
      prompt: 'Listen to this scale. Which one is it?',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'major',
        choices: [
          { label: 'Major', correct: true },
          { label: 'Chromatic', correct: false },
          { label: 'Whole tone', correct: false },
        ],
      },
      hint: 'Major: whole and half steps mixed, climbing back to home at the top.',
      nudge: 'Replay it. Were all the steps the same size, and how many notes did you hear?',
    },
    {
      id: 'l1u34m4e4',
      type: 'ear_training',
      prompt: 'Listen to this climb. Which one is it?',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'chromatic',
        choices: [
          { label: 'Major', correct: false },
          { label: 'Chromatic', correct: true },
          { label: 'Whole tone', correct: false },
        ],
      },
      hint: 'Chromatic: every note, each a half step from the one before, thirteen notes from C to C.',
      nudge: 'Replay it. Were all the steps the same size, and how many notes did you hear?',
    },
    {
      id: 'l1u34m4e5',
      type: 'multiple_choice',
      prompt: 'Number the notes of a major scale 1 to 8 from the bottom. Where are its two half steps?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'From 3 to 4, and from 7 to 8', correct: true },
          { label: 'From 1 to 2, and from 5 to 6', correct: false },
          { label: 'From 2 to 3, and from 6 to 7', correct: false },
          { label: 'From 4 to 5, and from 7 to 8', correct: false },
        ],
      },
      hint: 'Whole, whole, half, whole, whole, whole, half: the third step (3 to 4) and the seventh (7 to 8) are the half steps.',
      nudge: 'Say the steps in order and count them on your fingers: which two are the small ones?',
    },
  ],

  // ---- l1u34m5: Three Notes Make a Chord ----
  l1u34m5: [
    {
      id: 'l1u34m5e1',
      type: 'chord_build',
      prompt: 'Build the C major chord: the 1st, 3rd and 5th notes of the C major scale.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'C, E and G: the 1st, 3rd and 5th notes of the C major scale.',
      nudge: 'Start on C, then take every other note of the C major scale until you have three.',
    },
    {
      id: 'l1u34m5e2',
      type: 'chord_build',
      prompt: 'Build C minor: start from C major and lower its middle note by a half step.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'minor',
        noteCount: 3,
      },
      hint: 'C, E♭ and G: the E of C major moves down a half step to E♭.',
      nudge: 'Build C major first, then move only the middle note one key lower.',
    },
    {
      id: 'l1u34m5e3',
      type: 'chord_build',
      prompt: 'Build G major: the 1st, 3rd and 5th notes of the G major scale.',
      config: {
        type: 'chord_build',
        root: 'G',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'G, B and D: the 1st, 3rd and 5th notes of the G major scale.',
      nudge: 'Climb the G major scale from G and keep every other note: the 1st, the 3rd and the 5th.',
    },
    {
      id: 'l1u34m5e4',
      type: 'ear_training',
      prompt: 'Listen to this chord. Is it major or minor?',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'F',
        chordRootAccidental: '',
        quality: 'major',
        choices: [
          { label: 'Major', correct: true },
          { label: 'Minor', correct: false },
        ],
      },
      hint: 'Major: it sounds bright and settled.',
      nudge: 'Replay it and listen to its colour: bright and settled, or darker?',
    },
    {
      id: 'l1u34m5e5',
      type: 'ear_training',
      prompt: 'Listen to one more chord. Is it major or minor?',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'A',
        chordRootAccidental: '',
        quality: 'minor',
        choices: [
          { label: 'Major', correct: false },
          { label: 'Minor', correct: true },
        ],
      },
      hint: 'Minor: it sounds darker, because its middle note is a half step lower than in a major chord.',
      nudge: 'Replay it and listen to its colour: bright and settled, or darker?',
    },
  ],
};

export default exercises;
