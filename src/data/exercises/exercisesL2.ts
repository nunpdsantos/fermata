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
      nudge: "Each new sharp lies a perfect 5th above the previous one. Start from the single sharp in G major's key signature and keep going up in 5ths.",
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
      nudge: "Each new flat lies a perfect 4th above (a 5th below) the previous one. Start from the single flat in F major's key signature and keep going.",
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
      nudge: 'Think about its job: after the tonic, it is the strongest degree in the key, and its chord pulls the music most firmly back home.',
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
      nudge: 'In major, the 7th degree sits only a half step below the tonic (not a whole step), so it pulls strongly upward into it.',
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
      nudge: "'Sub' means below: the subdominant lies a 5th below the tonic, just as the dominant lies a 5th above. In C major, count down a 5th from C and see which degree you land on.",
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
      nudge: 'Compare C major with C natural minor, whose key signature has three flats. Find which scale degrees those three flats land on.',
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
          { label: 'To eliminate the half step between the raised 7th and the tonic', correct: false },
          { label: 'To turn the scale into its parallel major by raising the 6th and 7th', correct: false },
          { label: 'To replace the leading tone with a whole step below the tonic', correct: false },
        ],
      },
      hint: 'The 7th is raised to make a leading tone a half step below the tonic. Harmonic minor has an augmented 2nd (3 semitones) between the 6th and raised 7th; raising the 6th too reduces this gap to a whole step.',
      nudge: 'Play harmonic minor going up and listen to the jump from the 6th to the raised 7th. What happens to that jump when the 6th is raised as well?',
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
      nudge: 'The relative minor uses the same key signature and starts on the 6th degree of the major scale. Count up the C major scale to find it.',
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
      nudge: "The relative major shares the key signature and starts a minor 3rd (3 semitones) above the minor key's tonic. Count 3 semitones up from D.",
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
          { label: 'A minor', correct: false },
          { label: 'C minor', correct: false },
        ],
      },
      hint: 'Parallel keys share the same tonic but differ in mode. The parallel minor of G major is G minor. They have different key signatures.',
      nudge: "Parallel keys keep the same tonic and change only the quality (and with it the key signature). Don't confuse them with relative keys, which share a key signature.",
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
          { label: 'Relative keys share the same tonic and key signature; parallel keys share neither', correct: false },
          { label: 'Relative keys share neither tonic nor key signature; parallel keys share both', correct: false },
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
        rhythm: { time: '6/8', notes: '>8 8 8 >8 8 8 | >q. >q.' },
        choices: [
          { label: '2 main beats, grouped as 3 + 3 eighth notes', correct: true },
          { label: '6 main beats, one for each eighth note', correct: false },
          { label: '3 main beats, grouped as 2 + 2 + 2 eighth notes', correct: false },
          { label: '2 main beats, grouped as 4 + 2 eighth notes', correct: false },
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
          { label: 'Each beat divides into 3 equal parts', correct: true },
          { label: 'Each beat divides into 2 equal parts', correct: false },
          { label: 'Each measure has exactly 3 main beats', correct: false },
          { label: 'Each time signature has 8 as its bottom number', correct: false },
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
        rhythm: { time: '9/8', notes: '>8 8 8 >8 8 8 >8 8 8' },
        choices: [
          { label: '3 main beats', correct: true },
          { label: '9 main beats', correct: false },
          { label: '4 main beats', correct: false },
          { label: '2 main beats', correct: false },
        ],
      },
      hint: '9/8 is compound triple meter: 9 eighth notes form 3 groups of 3. Each group of 3 is one main beat (a dotted quarter note).',
      nudge: '9/8 is a compound meter: the eighth notes are grouped in threes, and each group is one main beat. How many groups fit into nine eighth notes?',
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
        rhythm: { time: '4/4', notes: '8 >q 8 q q | 8 >q 8 h' },
        choices: [
          { label: 'Placing accents on normally weak beats or off-beats', correct: true },
          { label: "Placing accents on normally strong beats or downbeats", correct: false },
          { label: "Dividing beats into triplets without shifting their accents", correct: false },
          { label: "Dividing beats into equal pairs without shifting their accents", correct: false },
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
        rhythm: { time: '2/4', notes: '8 8 t8 t8 t8 | q q' },
        choices: [
          { label: '3 equal notes in the time normally taken by 2 of the same value', correct: true },
          { label: '3 equal notes in the time normally taken by 4 of the same value', correct: false },
          { label: '3 equal notes in the time normally taken by 6 of the same value', correct: false },
          { label: '3 equal notes in the time normally taken by 1 of the same value', correct: false },
        ],
      },
      hint: 'Triplets fit 3 equal notes into the time normally taken by 2 of the same value. An eighth-note triplet fits 3 eighth notes in the space of one quarter note.',
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
      nudge: 'First count the letter names from C up to G, both included, to get the number. Then count the half steps from C up to G and compare them with the sizes that number can have.',
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
      nudge: 'Count the letter names from C up to Eb to get the number. Then compare Eb with the note of the same letter in the C major scale: is it the same note or a half step lower, and what does that do to the quality?',
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
      nudge: 'Count the letter names from D up to B, both included, to get the number. Then count the half steps from D up to B and compare them with the sizes that number can have.',
    },
    {
      id: 'l2u7m1e4',
      type: 'multiple_choice',
      prompt: 'What makes an interval "perfect"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It has no major/minor forms: only perfect, augmented or diminished', correct: true },
          { label: "It has no augmented/diminished forms: only perfect, major or minor", correct: false },
          { label: 'It occurs from the tonic to degrees 2, 3, 6 and 7 of a major scale', correct: false },
          { label: 'It has major and minor forms, like thirds and sixths', correct: false },
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
      nudge: 'Count the half steps from C up to F#, one key at a time, and compare the total with the 12 half steps of an octave. Which option names the interval of exactly that size?',
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
      nudge: 'Count the letter names from C up to Db to get the number. Then compare Db with the note of the same letter in the C major scale: is it the same note or a half step lower, and what does that do to the quality?',
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
      nudge: 'Count the letter names from C up to B, both included, to get the number. Then count the half steps from C up to B and compare them with the sizes that number can have.',
    },
    {
      id: 'l2u7m2e4',
      type: 'multiple_choice',
      prompt: 'What is a tritone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'An interval of 6 semitones that divides the octave in half', correct: true },
          { label: 'An interval of 4 semitones that divides the octave into three', correct: false },
          { label: 'An interval of 3 semitones that divides the octave into four', correct: false },
          { label: 'An interval of 2 semitones that divides the octave into six', correct: false },
        ],
      },
      hint: 'The tritone spans 3 whole tones (6 semitones). It can be called an augmented 4th or diminished 5th.',
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
      prompt: 'Which triad type has a tritone between its root and its 5th?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Diminished -- two stacked minor 3rds', correct: true },
          { label: 'Minor -- a minor 3rd under a major 3rd', correct: false },
          { label: 'Major -- a major 3rd under a minor 3rd', correct: false },
          { label: 'Augmented -- two stacked major 3rds', correct: false },
        ],
      },
      hint: 'A tritone is 6 semitones. Two minor 3rds (3 + 3) span exactly 6, so only the diminished triad has a tritone from root to 5th. Major and minor span 7 (a perfect 5th); augmented spans 8 (an augmented 5th).',
      nudge: 'A tritone is 6 semitones. For each triad type, add up the semitones of its two stacked 3rds (major 3rd = 4, minor 3rd = 3) and find the combination that totals 6.',
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
          { label: '5/3 (usually left unwritten)', correct: true },
          { label: '6/3 (usually shortened to 6)', correct: false },
          { label: '6/4 (always written in full)', correct: false },
          { label: '7/5/3 (a seventh chord)', correct: false },
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
          { label: '6/3 (usually shortened to 6)', correct: true },
          { label: '5/3 (usually left unwritten)', correct: false },
          { label: '6/4 (always written in full)', correct: false },
          { label: '4/2 (a seventh-chord figure)', correct: false },
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
          { label: 'Rearranging the chord so a note other than the root is the highest note', correct: false },
          { label: 'Rearranging the chord so a note other than the root is doubled', correct: false },
          { label: 'Rearranging the chord so its notes span more than an octave', correct: false },
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
      nudge: 'Build it in C major: stack 3rds on E using white keys only, then count the semitones from the root up to the 3rd and up to the 5th. The lowercase Roman numeral is a clue too.',
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
      nudge: 'Build it in C major on B using white keys only, then count the semitones from the root to the 5th. Is that a perfect 5th (7 semitones) or something smaller?',
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
