import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 2 Exercises — ~50 exercises across 12 modules
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 4: All Major Keys and Scale Degrees
  // =========================================================================

  // ---- l2u4m1: All Major Keys / Circle of 5ths ----
  l2u4m1: [
    {
      id: 'l2u4m1e1',
      type: 'multiple_choice',
      prompt: 'What is the order of sharps as they appear in key signatures?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'F C G D A E B', correct: true },
          { label: 'B E A D G C F', correct: false },
          { label: 'C G D A E B F', correct: false },
          { label: 'F B E A D G C', correct: false },
        ],
      },
      hint: 'Remember the mnemonic: Father Charles Goes Down And Ends Battle. Sharps accumulate in this fixed order.',
    },
    {
      id: 'l2u4m1e2',
      type: 'multiple_choice',
      prompt: 'What is the order of flats as they appear in key signatures?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'B E A D G C F', correct: true },
          { label: 'F C G D A E B', correct: false },
          { label: 'C F B E A D G', correct: false },
          { label: 'E B A D G C F', correct: false },
        ],
      },
      hint: 'The order of flats is the reverse of sharps: Battle Ends And Down Goes Charles Father.',
    },
    {
      id: 'l2u4m1e3',
      type: 'scale_build',
      prompt: 'Build the D major scale. Select all 7 notes on the instrument. Remember: D major has 2 sharps.',
      config: {
        type: 'scale_build',
        root: 'D',
        rootAccidental: '',
        scaleType: 'major',
        noteCount: 7,
      },
      hint: 'D major: D, E, F#, G, A, B, C#. The two sharps are F# and C#, following the order of sharps.',
    },
    {
      id: 'l2u4m1e4',
      type: 'multiple_choice',
      prompt: 'How many sharps does the key of A major have?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '3 sharps (F#, C#, G#)', correct: true },
          { label: '2 sharps (F#, C#)', correct: false },
          { label: '4 sharps (F#, C#, G#, D#)', correct: false },
          { label: '1 sharp (F#)', correct: false },
        ],
      },
      hint: 'A major is three steps clockwise on the circle of fifths from C: G (1#), D (2#), A (3#). The sharps are F#, C#, G#.',
    },
  ],

  // ---- l2u4m2: Scale Degree Names ----
  l2u4m2: [
    {
      id: 'l2u4m2e1',
      type: 'multiple_choice',
      prompt: 'What is the name of the 5th degree of any major scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Dominant', correct: true },
          { label: 'Subdominant', correct: false },
          { label: 'Mediant', correct: false },
          { label: 'Supertonic', correct: false },
        ],
      },
      hint: 'The 5th scale degree is called the dominant because it is the second most important note after the tonic, dominating the key.',
    },
    {
      id: 'l2u4m2e2',
      type: 'multiple_choice',
      prompt: 'What is the 7th degree of the major scale called?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Leading tone', correct: true },
          { label: 'Subtonic', correct: false },
          { label: 'Dominant', correct: false },
          { label: 'Supertonic', correct: false },
        ],
      },
      hint: 'In a major scale, the 7th degree is a half step below the tonic. It "leads" strongly upward to the tonic, hence leading tone.',
    },
    {
      id: 'l2u4m2e3',
      type: 'multiple_choice',
      prompt: 'Which scale degree is called the subdominant?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '4th degree', correct: true },
          { label: '5th degree', correct: false },
          { label: '2nd degree', correct: false },
          { label: '6th degree', correct: false },
        ],
      },
      hint: 'The subdominant is the 4th degree. It sits a 5th below the tonic (sub = below), just as the dominant sits a 5th above.',
    },
  ],

  // =========================================================================
  // Unit 5: Minor Scales and Key Relationships
  // =========================================================================

  // ---- l2u5m1: Natural Minor ----
  l2u5m1: [
    {
      id: 'l2u5m1e1',
      type: 'scale_build',
      prompt: 'Build the A natural minor scale. Select all 7 notes. This scale uses only white keys.',
      config: {
        type: 'scale_build',
        root: 'A',
        rootAccidental: '',
        scaleType: 'natural_minor',
        noteCount: 7,
      },
      hint: 'A natural minor: A, B, C, D, E, F, G. The interval pattern is W-H-W-W-H-W-W. No sharps or flats needed.',
    },
    {
      id: 'l2u5m1e2',
      type: 'scale_build',
      prompt: 'Build the E natural minor scale. Select all 7 notes. One note needs a sharp.',
      config: {
        type: 'scale_build',
        root: 'E',
        rootAccidental: '',
        scaleType: 'natural_minor',
        noteCount: 7,
      },
      hint: 'E natural minor: E, F#, G, A, B, C, D. The F# is needed to maintain the W-H-W-W-H-W-W pattern.',
    },
    {
      id: 'l2u5m1e3',
      type: 'multiple_choice',
      prompt: 'What is the interval pattern of the natural minor scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'W-H-W-W-H-W-W', correct: true },
          { label: 'W-W-H-W-W-W-H', correct: false },
          { label: 'W-H-W-W-W-H-W', correct: false },
          { label: 'H-W-W-H-W-W-W', correct: false },
        ],
      },
      hint: 'The natural minor scale has half steps between degrees 2-3 and 5-6. Compare with major (W-W-H-W-W-W-H): the 3rd, 6th, and 7th are lowered.',
    },
    {
      id: 'l2u5m1e4',
      type: 'multiple_choice',
      prompt: 'Which degrees of the natural minor scale are lowered compared to the major scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '3rd, 6th, and 7th', correct: true },
          { label: '2nd, 3rd, and 6th', correct: false },
          { label: '3rd and 7th only', correct: false },
          { label: '2nd, 5th, and 7th', correct: false },
        ],
      },
      hint: 'Compare C major (C D E F G A B) with C natural minor (C D Eb F G Ab Bb). The 3rd, 6th, and 7th are each lowered by a half step.',
    },
  ],

  // ---- l2u5m2: Harmonic/Melodic Minor ----
  l2u5m2: [
    {
      id: 'l2u5m2e1',
      type: 'scale_build',
      prompt: 'Build the A harmonic minor scale. Select all 7 notes. Compared to natural minor, one note is raised.',
      config: {
        type: 'scale_build',
        root: 'A',
        rootAccidental: '',
        scaleType: 'harmonic_minor',
        noteCount: 7,
      },
      hint: 'A harmonic minor: A, B, C, D, E, F, G#. The 7th degree (G) is raised to G# to create a leading tone back to A.',
    },
    {
      id: 'l2u5m2e2',
      type: 'scale_build',
      prompt: 'Build the A melodic minor scale (ascending form). Two notes are raised compared to natural minor.',
      config: {
        type: 'scale_build',
        root: 'A',
        rootAccidental: '',
        scaleType: 'melodic_minor',
        noteCount: 7,
      },
      hint: 'A melodic minor ascending: A, B, C, D, E, F#, G#. Both the 6th (F to F#) and 7th (G to G#) are raised to smooth out the augmented 2nd.',
    },
    {
      id: 'l2u5m2e3',
      type: 'multiple_choice',
      prompt: 'What distinguishes the harmonic minor from the natural minor scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The 7th degree is raised by a half step', correct: true },
          { label: 'The 6th degree is raised by a half step', correct: false },
          { label: 'The 3rd degree is raised by a half step', correct: false },
          { label: 'The 2nd degree is lowered by a half step', correct: false },
        ],
      },
      hint: 'The harmonic minor raises the 7th degree to create a leading tone (half step below tonic). This is essential for forming a dominant chord (V) in minor keys.',
    },
    {
      id: 'l2u5m2e4',
      type: 'multiple_choice',
      prompt: 'Why does the melodic minor scale raise both the 6th and 7th degrees when ascending?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'To eliminate the augmented 2nd between the 6th and raised 7th in harmonic minor', correct: true },
          { label: 'To match the major scale exactly', correct: false },
          { label: 'To make it easier to play on the piano', correct: false },
          { label: 'To remove all half steps from the scale', correct: false },
        ],
      },
      hint: 'The harmonic minor has an awkward augmented 2nd (3 semitones) between the 6th and raised 7th. Raising the 6th also smooths this gap to a whole step.',
    },
  ],

  // ---- l2u5m3: Relative/Parallel Keys ----
  l2u5m3: [
    {
      id: 'l2u5m3e1',
      type: 'multiple_choice',
      prompt: 'What is the relative minor of C major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A minor', correct: true },
          { label: 'C minor', correct: false },
          { label: 'E minor', correct: false },
          { label: 'D minor', correct: false },
        ],
      },
      hint: 'The relative minor starts on the 6th degree of the major scale. In C major, the 6th degree is A. Both C major and A minor share the same key signature (no sharps or flats).',
    },
    {
      id: 'l2u5m3e2',
      type: 'multiple_choice',
      prompt: 'What is the relative major of D minor?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'F major', correct: true },
          { label: 'D major', correct: false },
          { label: 'Bb major', correct: false },
          { label: 'G major', correct: false },
        ],
      },
      hint: 'The relative major starts a minor 3rd (3 semitones) above the minor key. D up 3 semitones = F. Both D minor and F major share one flat (Bb).',
    },
    {
      id: 'l2u5m3e3',
      type: 'multiple_choice',
      prompt: 'What is the parallel minor of G major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'G minor', correct: true },
          { label: 'E minor', correct: false },
          { label: 'D minor', correct: false },
          { label: 'B minor', correct: false },
        ],
      },
      hint: 'Parallel keys share the same root note but differ in quality. The parallel minor of G major is G minor. They have different key signatures.',
    },
    {
      id: 'l2u5m3e4',
      type: 'multiple_choice',
      prompt: 'What is the difference between relative keys and parallel keys?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Relative keys share the same key signature; parallel keys share the same tonic', correct: true },
          { label: 'Relative keys share the same tonic; parallel keys share the same key signature', correct: false },
          { label: 'Relative keys are always major; parallel keys are always minor', correct: false },
          { label: 'There is no difference; they are the same concept', correct: false },
        ],
      },
      hint: 'C major and A minor are relative (same key signature: no sharps/flats). C major and C minor are parallel (same tonic: C).',
    },
  ],

  // =========================================================================
  // Unit 6: Compound Meter and Syncopation
  // =========================================================================

  // ---- l2u6m1: Compound Meter ----
  l2u6m1: [
    {
      id: 'l2u6m1e1',
      type: 'multiple_choice',
      prompt: 'In 6/8 time, how are the beats organized?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '2 main beats, each divided into 3 eighth notes', correct: true },
          { label: '6 equal beats of eighth notes', correct: false },
          { label: '3 main beats, each divided into 2 eighth notes', correct: false },
          { label: '8 beats grouped in sixes', correct: false },
        ],
      },
      hint: '6/8 is compound duple meter: 6 eighth notes are grouped as 2 groups of 3. Each group of 3 forms one main beat, giving a ONE-two-three TWO-two-three feel.',
    },
    {
      id: 'l2u6m1e2',
      type: 'multiple_choice',
      prompt: 'What defines compound meter?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each main beat divides naturally into 3 equal parts', correct: true },
          { label: 'Each main beat divides naturally into 2 equal parts', correct: false },
          { label: 'The time signature has a large top number', correct: false },
          { label: 'The tempo is faster than simple meter', correct: false },
        ],
      },
      hint: 'In compound meter, the beat unit is a dotted note that subdivides into three. In simple meter, beats subdivide into two.',
    },
    {
      id: 'l2u6m1e3',
      type: 'multiple_choice',
      prompt: 'How many main beats does 9/8 time have?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '3 main beats (each divided into 3 eighth notes)', correct: true },
          { label: '9 beats', correct: false },
          { label: '4 main beats', correct: false },
          { label: '2 main beats', correct: false },
        ],
      },
      hint: '9/8 is compound triple meter: 9 eighth notes form 3 groups of 3. Each group of 3 is one main beat (a dotted quarter note).',
    },
  ],

  // ---- l2u6m2: Syncopation ----
  l2u6m2: [
    {
      id: 'l2u6m2e1',
      type: 'multiple_choice',
      prompt: 'What is syncopation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Placing accents on normally weak beats or off-beats', correct: true },
          { label: 'Playing all notes at the same volume', correct: false },
          { label: 'Gradually speeding up the tempo', correct: false },
          { label: 'Playing notes in a different octave', correct: false },
        ],
      },
      hint: 'Syncopation disrupts the expected rhythmic pattern by stressing beats or parts of beats that are normally unaccented, creating rhythmic tension and energy.',
    },
    {
      id: 'l2u6m2e2',
      type: 'multiple_choice',
      prompt: 'What are triplets?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '3 notes played in the time normally occupied by 2 notes of the same value', correct: true },
          { label: '3 notes played one after another', correct: false },
          { label: 'A chord with 3 notes', correct: false },
          { label: '3 measures grouped together', correct: false },
        ],
      },
      hint: 'Triplets subdivide a beat into 3 equal parts instead of the usual 2. An eighth-note triplet fits 3 eighth notes in the space of one quarter note.',
    },
  ],

  // =========================================================================
  // Unit 7: Intervals, Triads, Diatonic Harmony
  // =========================================================================

  // ---- l2u7m1: Interval Quality ----
  l2u7m1: [
    {
      id: 'l2u7m1e1',
      type: 'interval_id',
      prompt: 'Identify the interval from C up to G. This is one of the most consonant intervals in music.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 7,
        direction: 'ascending',
      },
      hint: 'C to G is 7 semitones. This is a perfect 5th -- the interval found in power chords and the basis of the circle of fifths.',
    },
    {
      id: 'l2u7m1e2',
      type: 'interval_id',
      prompt: 'Identify the interval from C up to Eb. This interval gives minor chords their characteristic sound.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 3,
        direction: 'ascending',
      },
      hint: 'C to Eb is 3 semitones. This is a minor 3rd -- the interval that distinguishes minor chords from major chords.',
    },
    {
      id: 'l2u7m1e3',
      type: 'interval_id',
      prompt: 'Identify the interval from D up to B. Count both the letter names and the semitones.',
      config: {
        type: 'interval_id',
        root: 'D',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 9,
        direction: 'ascending',
      },
      hint: 'D to B spans 6 letter names (D-E-F-G-A-B) = a 6th. D to B is 9 semitones, making it a major 6th.',
    },
    {
      id: 'l2u7m1e4',
      type: 'multiple_choice',
      prompt: 'What makes an interval "perfect"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It does not come in major/minor variants -- only perfect, augmented, or diminished', correct: true },
          { label: 'It sounds perfectly in tune', correct: false },
          { label: 'It only uses white keys on the piano', correct: false },
          { label: 'It is always consonant', correct: false },
        ],
      },
      hint: 'Unisons, 4ths, 5ths, and octaves are "perfect" intervals. Unlike 2nds, 3rds, 6ths, and 7ths which come in major/minor pairs, perfect intervals have only one basic form.',
    },
    {
      id: 'l2u7m1e_ear1',
      type: 'ear_training',
      prompt: 'Listen to this interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 7,
        direction: 'ascending',
      },
      hint: 'This is one of the most consonant intervals. It spans 7 semitones and is the basis of the circle of fifths.',
    },
    {
      id: 'l2u7m1e_ear2',
      type: 'ear_training',
      prompt: 'Listen to this interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 4,
        direction: 'ascending',
      },
      hint: 'This bright, warm interval spans 4 semitones and defines the character of major chords.',
    },
    {
      id: 'l2u7m1e_ear3',
      type: 'ear_training',
      prompt: 'Listen to this interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 5,
        direction: 'ascending',
      },
      hint: 'This interval spans 5 semitones. It is the inversion of the perfect 5th.',
    },
    {
      id: 'l2u7m1e_ear4',
      type: 'ear_training',
      prompt: 'Listen to this interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 3,
        direction: 'ascending',
      },
      hint: 'This darker interval spans 3 semitones and gives minor chords their characteristic sound.',
    },
  ],

  // ---- l2u7m2: Aug/Dim/Compound ----
  l2u7m2: [
    {
      id: 'l2u7m2e1',
      type: 'interval_id',
      prompt: 'Identify the interval from C up to F#. This interval splits the octave exactly in half.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 6,
        direction: 'ascending',
      },
      hint: 'C to F# (or Gb) is 6 semitones -- exactly half of 12. This is the tritone, also called an augmented 4th or diminished 5th.',
    },
    {
      id: 'l2u7m2e2',
      type: 'interval_id',
      prompt: 'Identify the interval from C up to Db. This is the smallest named interval.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 1,
        direction: 'ascending',
      },
      hint: 'C to Db is 1 semitone. This is a minor 2nd -- the smallest interval in standard Western music, creating maximum tension.',
    },
    {
      id: 'l2u7m2e3',
      type: 'interval_id',
      prompt: 'Identify the interval from C up to B. This large interval is just one half step short of an octave.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 11,
        direction: 'ascending',
      },
      hint: 'C to B is 11 semitones. This is a major 7th -- a wide, dissonant interval often used in jazz chords.',
    },
    {
      id: 'l2u7m2e4',
      type: 'multiple_choice',
      prompt: 'What is a tritone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'An interval of 6 semitones that divides the octave in half', correct: true },
          { label: 'A chord built from 3 whole tones', correct: false },
          { label: 'An interval of 3 semitones', correct: false },
          { label: 'A scale with 3 notes', correct: false },
        ],
      },
      hint: 'The tritone spans 3 whole tones (6 semitones). It can be called an augmented 4th or diminished 5th. In medieval times it was called "the devil in music" due to its dissonance.',
    },
  ],

  // ---- l2u7m3: Four Triad Types ----
  l2u7m3: [
    {
      id: 'l2u7m3e1',
      type: 'chord_build',
      prompt: 'Build a D minor triad. Select the 3 notes: root, minor 3rd, and perfect 5th.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'minor',
        noteCount: 3,
      },
      hint: 'D minor = D, F, A. Root (D) + minor 3rd (F, 3 semitones up) + perfect 5th (A, 7 semitones up from root).',
    },
    {
      id: 'l2u7m3e2',
      type: 'chord_build',
      prompt: 'Build a B diminished triad. Select the 3 notes: root, minor 3rd, and diminished 5th.',
      config: {
        type: 'chord_build',
        root: 'B',
        rootAccidental: '',
        quality: 'diminished',
        noteCount: 3,
      },
      hint: 'B diminished = B, D, F. Root (B) + minor 3rd (D, 3 semitones up) + diminished 5th (F, 6 semitones up from root). Both intervals are minor 3rds stacked.',
    },
    {
      id: 'l2u7m3e3',
      type: 'multiple_choice',
      prompt: 'What notes make up an augmented triad built on C?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C, E, G# -- root, major 3rd, augmented 5th', correct: true },
          { label: 'C, Eb, G -- root, minor 3rd, perfect 5th', correct: false },
          { label: 'C, E, G -- root, major 3rd, perfect 5th', correct: false },
          { label: 'C, Eb, Gb -- root, minor 3rd, diminished 5th', correct: false },
        ],
      },
      hint: 'An augmented triad stacks two major 3rds: C to E (4 semitones) and E to G# (4 semitones). The 5th is raised (augmented) compared to a major triad.',
    },
    {
      id: 'l2u7m3e4',
      type: 'multiple_choice',
      prompt: 'Which triad type is considered the most unstable and dissonant?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Diminished -- two minor 3rds with a tritone between root and 5th', correct: true },
          { label: 'Minor -- because it sounds sad', correct: false },
          { label: 'Major -- because it is the most common', correct: false },
          { label: 'Augmented -- because it has a raised 5th', correct: false },
        ],
      },
      hint: 'The diminished triad contains a tritone (6 semitones) between its root and 5th. This makes it the most dissonant and unstable of the four triad types, strongly wanting to resolve.',
    },
  ],

  // ---- l2u7m4: Inversions/Figured Bass ----
  l2u7m4: [
    {
      id: 'l2u7m4e1',
      type: 'multiple_choice',
      prompt: 'What figured bass numbers represent a triad in root position?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '5/3 (often abbreviated by writing nothing)', correct: true },
          { label: '6/3', correct: false },
          { label: '6/4', correct: false },
          { label: '7/5/3', correct: false },
        ],
      },
      hint: 'In root position, the intervals above the bass are a 3rd and a 5th. Figured bass writes these as 5/3. Since root position is the default, the numbers are usually omitted.',
    },
    {
      id: 'l2u7m4e2',
      type: 'multiple_choice',
      prompt: 'What figured bass numbers represent a triad in first inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '6/3 (often abbreviated to just 6)', correct: true },
          { label: '5/3', correct: false },
          { label: '6/4', correct: false },
          { label: '4/2', correct: false },
        ],
      },
      hint: 'In first inversion, the 3rd of the chord is in the bass. The intervals above the bass are a 3rd and a 6th. Figured bass abbreviates 6/3 to just 6.',
    },
    {
      id: 'l2u7m4e3',
      type: 'multiple_choice',
      prompt: 'What is a triad inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Rearranging the chord so a note other than the root is the lowest note', correct: true },
          { label: 'Flipping the chord upside down so the top note becomes the bottom', correct: false },
          { label: 'Changing the chord from major to minor', correct: false },
          { label: 'Playing the chord in a different key', correct: false },
        ],
      },
      hint: 'Inversions change which chord tone is in the bass. Root position has the root in the bass, first inversion has the 3rd, second inversion has the 5th. The chord identity stays the same.',
    },
  ],

  // ---- l2u7m5: Diatonic Triads/Roman Numerals ----
  l2u7m5: [
    {
      id: 'l2u7m5e1',
      type: 'multiple_choice',
      prompt: 'In a major key, what is the quality of the iii chord (built on the 3rd degree)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Minor', correct: true },
          { label: 'Major', correct: false },
          { label: 'Diminished', correct: false },
          { label: 'Augmented', correct: false },
        ],
      },
      hint: 'The diatonic triads in major are: I(M) ii(m) iii(m) IV(M) V(M) vi(m) vii\u00b0(dim). Lowercase Roman numerals indicate minor quality. The iii chord is minor.',
    },
    {
      id: 'l2u7m5e2',
      type: 'multiple_choice',
      prompt: 'In a major key, what is the quality of the vii\u00b0 chord (built on the 7th degree)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Diminished', correct: true },
          { label: 'Minor', correct: false },
          { label: 'Major', correct: false },
          { label: 'Augmented', correct: false },
        ],
      },
      hint: 'The chord built on the 7th degree of the major scale (e.g., B-D-F in C major) contains a tritone between root and 5th, making it diminished. It is notated vii\u00b0.',
    },
    {
      id: 'l2u7m5e3',
      type: 'chord_build',
      prompt: 'Build an F major triad. This is the IV chord in the key of C major.',
      config: {
        type: 'chord_build',
        root: 'F',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'F major = F, A, C. Root (F) + major 3rd (A, 4 semitones up) + perfect 5th (C, 7 semitones up from root).',
    },
    {
      id: 'l2u7m5e4',
      type: 'chord_build',
      prompt: 'Build an A minor triad. This is the vi chord in the key of C major.',
      config: {
        type: 'chord_build',
        root: 'A',
        rootAccidental: '',
        quality: 'minor',
        noteCount: 3,
      },
      hint: 'A minor = A, C, E. Root (A) + minor 3rd (C, 3 semitones up) + perfect 5th (E, 7 semitones up from root).',
    },
  ],
};

export default exercises;
