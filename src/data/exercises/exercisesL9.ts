import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 9 Exercises — Ear Training & Aural Skills
// ~50 exercises across 15 modules
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 30: Pitch and Interval Training
  // =========================================================================

  // ---- l9u30m1: Pitch Matching/Direction ----
  l9u30m1: [
    {
      id: 'l9u30m1e1',
      type: 'note_id',
      prompt: 'Identify this pitch shown on the staff.',
      config: {
        type: 'note_id',
        note: 'C',
        accidental: '',
        octave: 4,
      },
      hint: 'Middle C (C4) is the central reference point on the piano, sitting on the ledger line below the treble staff.',
      points: 1,
    },
    {
      id: 'l9u30m1e2',
      type: 'note_id',
      prompt: 'Listen to this pitch and identify it. It is a perfect 5th above middle C.',
      config: {
        type: 'note_id',
        note: 'G',
        accidental: '',
        octave: 4,
      },
      hint: 'G4 is a perfect 5th above C4 — 7 semitones up. It sits on the second line of the treble staff.',
      points: 1,
    },
    {
      id: 'l9u30m1e3',
      type: 'multiple_choice',
      prompt: 'When a second pitch sounds higher than the first, what is the direction of pitch movement?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Ascending', correct: true },
          { label: 'Descending', correct: false },
          { label: 'Oblique', correct: false },
          { label: 'Static', correct: false },
        ],
      },
      hint: 'Ascending means moving upward in pitch. Descending means moving downward.',
      points: 1,
    },
    {
      id: 'l9u30m1e4',
      type: 'multiple_choice',
      prompt: 'What does "register" refer to in music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The relative highness or lowness of a range of pitches', correct: true },
          { label: 'The volume level of a performance', correct: false },
          { label: 'The speed at which notes are played', correct: false },
          { label: 'The number of instruments playing simultaneously', correct: false },
        ],
      },
      hint: 'Register describes a portion of the pitch spectrum — low register, middle register, or high register.',
      points: 1,
    },
  ],

  // ---- l9u30m2: Major vs Minor Recognition ----
  l9u30m2: [
    {
      id: 'l9u30m2e1',
      type: 'chord_build',
      prompt: 'Build a C major triad. Listen to its bright, stable quality as you select the notes.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'C major = C, E, G. The major 3rd (4 semitones from root) gives it a bright character.',
      points: 2,
    },
    {
      id: 'l9u30m2e2',
      type: 'chord_build',
      prompt: 'Build a C minor triad. Listen to how the lowered 3rd changes the mood compared to major.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'minor',
        noteCount: 3,
      },
      hint: 'C minor = C, Eb, G. The minor 3rd (3 semitones from root) gives it a darker, more somber quality.',
      points: 2,
    },
    {
      id: 'l9u30m2e3',
      type: 'multiple_choice',
      prompt: 'What is the structural difference between a major and a minor triad?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The third is lowered by a half step in minor', correct: true },
          { label: 'The fifth is lowered by a half step in minor', correct: false },
          { label: 'The root is raised by a half step in minor', correct: false },
          { label: 'Minor triads have four notes instead of three', correct: false },
        ],
      },
      hint: 'Major triad: root + major 3rd (4 semitones) + P5. Minor triad: root + minor 3rd (3 semitones) + P5. Only the 3rd changes.',
      points: 1,
    },
  ],

  // ---- l9u30m3: Interval Recognition P1-P5 ----
  l9u30m3: [
    {
      id: 'l9u30m3e1',
      type: 'interval_id',
      prompt: 'Listen to this ascending interval from C. It is the smallest interval in Western music. Identify it.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 1,
        direction: 'ascending',
      },
      hint: '1 semitone = minor 2nd (half step). C to Db. Think of the "Jaws" theme.',
      points: 1,
    },
    {
      id: 'l9u30m3e2',
      type: 'interval_id',
      prompt: 'Listen to this ascending interval from C. It spans a whole step. Identify it.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 2,
        direction: 'ascending',
      },
      hint: '2 semitones = major 2nd (whole step). C to D.',
      points: 1,
    },
    {
      id: 'l9u30m3e3',
      type: 'interval_id',
      prompt: 'Listen to this ascending interval from C. It has a dark, melancholy quality. Identify it.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 3,
        direction: 'ascending',
      },
      hint: '3 semitones = minor 3rd. C to Eb. This interval defines the bottom of a minor triad.',
      points: 1,
    },
    {
      id: 'l9u30m3e4',
      type: 'interval_id',
      prompt: 'Listen to this ascending interval from C. It sounds strong and open. Identify it.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 7,
        direction: 'ascending',
      },
      hint: '7 semitones = perfect 5th. C to G. The most consonant interval after the octave and unison.',
      points: 1,
    },
  ],

  // ---- l9u30m4: Interval Recognition m6-P8 ----
  l9u30m4: [
    {
      id: 'l9u30m4e1',
      type: 'interval_id',
      prompt: 'Listen to this ascending interval from C. It has a bittersweet, yearning quality. Identify it.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 8,
        direction: 'ascending',
      },
      hint: '8 semitones = minor 6th. C to Ab. It has a poignant, somewhat tense quality.',
      points: 1,
    },
    {
      id: 'l9u30m4e2',
      type: 'interval_id',
      prompt: 'Listen to this ascending interval from C. It has a warm, romantic quality. Identify it.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 9,
        direction: 'ascending',
      },
      hint: '9 semitones = major 6th. C to A. A warm, consonant interval.',
      points: 1,
    },
    {
      id: 'l9u30m4e3',
      type: 'interval_id',
      prompt: 'Listen to this ascending interval from C. It creates strong tension wanting to resolve. Identify it.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 10,
        direction: 'ascending',
      },
      hint: '10 semitones = minor 7th. C to Bb. It has a dominant, bluesy tension.',
      points: 1,
    },
    {
      id: 'l9u30m4e4',
      type: 'interval_id',
      prompt: 'Listen to this ascending interval from C. The two notes sound like the same pitch at different heights. Identify it.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 12,
        direction: 'ascending',
      },
      hint: '12 semitones = perfect octave. C4 to C5. The two pitches share the same letter name.',
      points: 1,
    },
  ],

  // ---- l9u30m5: Harmonic Intervals ----
  l9u30m5: [
    {
      id: 'l9u30m5e1',
      type: 'interval_id',
      prompt: 'These two notes sound simultaneously from D. The interval is open and stable. Identify it.',
      config: {
        type: 'interval_id',
        root: 'D',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 5,
        direction: 'ascending',
      },
      hint: '5 semitones = perfect 4th. D to G. When sounded together, it has an open, hollow quality.',
      points: 1,
    },
    {
      id: 'l9u30m5e2',
      type: 'interval_id',
      prompt: 'These two notes sound simultaneously from E. The interval is bright and sweet. Identify it.',
      config: {
        type: 'interval_id',
        root: 'E',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 4,
        direction: 'ascending',
      },
      hint: '4 semitones = major 3rd. E to G#. The major 3rd gives a warm, consonant harmonic sound.',
      points: 1,
    },
    {
      id: 'l9u30m5e3',
      type: 'multiple_choice',
      prompt: 'What is the difference between a harmonic interval and a melodic interval?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Harmonic intervals sound simultaneously; melodic intervals sound in sequence', correct: true },
          { label: 'Harmonic intervals are consonant; melodic intervals are dissonant', correct: false },
          { label: 'Harmonic intervals use sharps; melodic intervals use flats', correct: false },
          { label: 'Harmonic intervals span more than an octave; melodic intervals do not', correct: false },
        ],
      },
      hint: 'Harmonic = both notes at the same time. Melodic = one note after the other. The same two notes can form either type.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 31: Scale, Chord, Dictation
  // =========================================================================

  // ---- l9u31m1: Scale Recognition Major/Minor ----
  l9u31m1: [
    {
      id: 'l9u31m1e1',
      type: 'scale_build',
      prompt: 'Build the C major scale. Listen to the bright, resolved character of each step.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        noteCount: 7,
      },
      hint: 'C major: C, D, E, F, G, A, B. All white keys. Pattern: W-W-H-W-W-W-H.',
      points: 2,
    },
    {
      id: 'l9u31m1e2',
      type: 'scale_build',
      prompt: 'Build the A natural minor scale. Compare its darker mood to the major scale.',
      config: {
        type: 'scale_build',
        root: 'A',
        rootAccidental: '',
        scaleType: 'natural_minor',
        noteCount: 7,
      },
      hint: 'A natural minor: A, B, C, D, E, F, G. All white keys. Pattern: W-H-W-W-H-W-W.',
      points: 2,
    },
    {
      id: 'l9u31m1e3',
      type: 'multiple_choice',
      prompt: 'Which best describes the overall character of a major scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Bright, happy, and resolved', correct: true },
          { label: 'Dark, sad, and tense', correct: false },
          { label: 'Mysterious and ambiguous', correct: false },
          { label: 'Dissonant and unstable', correct: false },
        ],
      },
      hint: 'Major scales are perceived as bright and stable. The major 3rd and major 7th contribute to this positive character.',
      points: 1,
    },
  ],

  // ---- l9u31m2: Mode Recognition ----
  l9u31m2: [
    {
      id: 'l9u31m2e1',
      type: 'scale_build',
      prompt: 'Build the D Dorian scale. It is like natural minor but with a raised 6th degree.',
      config: {
        type: 'scale_build',
        root: 'D',
        rootAccidental: '',
        scaleType: 'dorian',
        noteCount: 7,
      },
      hint: 'D Dorian: D, E, F, G, A, B, C. All white keys starting on D. The B natural (raised 6th) is the characteristic tone.',
      points: 2,
    },
    {
      id: 'l9u31m2e2',
      type: 'scale_build',
      prompt: 'Build the F Lydian scale. It is like major but with a raised 4th degree.',
      config: {
        type: 'scale_build',
        root: 'F',
        rootAccidental: '',
        scaleType: 'lydian',
        noteCount: 7,
      },
      hint: 'F Lydian: F, G, A, B, C, D, E. All white keys starting on F. The B natural (raised 4th) is the characteristic tone.',
      points: 2,
    },
    {
      id: 'l9u31m2e3',
      type: 'multiple_choice',
      prompt: 'What is the characteristic tone that distinguishes Dorian from natural minor?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A raised 6th degree', correct: true },
          { label: 'A lowered 2nd degree', correct: false },
          { label: 'A raised 7th degree', correct: false },
          { label: 'A lowered 5th degree', correct: false },
        ],
      },
      hint: 'Dorian differs from natural minor by one note: the 6th degree is raised a half step. In D Dorian, that is B natural instead of Bb.',
      points: 1,
    },
  ],

  // ---- l9u31m3: Pentatonic/Blues/Symmetric ----
  l9u31m3: [
    {
      id: 'l9u31m3e1',
      type: 'scale_build',
      prompt: 'Build the C major pentatonic scale. It removes the half steps from the major scale.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'pentatonic_major',
        noteCount: 5,
      },
      hint: 'C major pentatonic: C, D, E, G, A. Five notes — the major scale without the 4th and 7th degrees.',
      points: 2,
    },
    {
      id: 'l9u31m3e2',
      type: 'scale_build',
      prompt: 'Build the C blues scale. It adds the "blue note" to the minor pentatonic.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'blues',
        noteCount: 6,
      },
      hint: 'C blues: C, Eb, F, Gb, G, Bb. Six notes — the minor pentatonic plus the flat 5th (Gb), which is the blue note.',
      points: 2,
    },
    {
      id: 'l9u31m3e3',
      type: 'multiple_choice',
      prompt: 'What is the "blue note" in a blues scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The chromatic note between the 4th and 5th degrees (flat 5th / sharp 4th)', correct: true },
          { label: 'The minor 3rd of any chord', correct: false },
          { label: 'Any note played with vibrato', correct: false },
          { label: 'The leading tone of the key', correct: false },
        ],
      },
      hint: 'The blue note is the b5 (or #4) added to the minor pentatonic. In C blues, it is Gb/F#, sitting between F and G.',
      points: 1,
    },
  ],

  // ---- l9u31m4: Triad Quality Recognition ----
  l9u31m4: [
    {
      id: 'l9u31m4e1',
      type: 'chord_build',
      prompt: 'Build an E diminished triad. It has a tense, unstable quality.',
      config: {
        type: 'chord_build',
        root: 'E',
        rootAccidental: '',
        quality: 'diminished',
        noteCount: 3,
      },
      hint: 'E diminished = E, G, Bb. Two stacked minor 3rds: E to G (3 semitones) and G to Bb (3 semitones). The tritone between root and 5th creates tension.',
      points: 2,
    },
    {
      id: 'l9u31m4e2',
      type: 'chord_build',
      prompt: 'Build a C augmented triad. It has a dreamy, unresolved quality.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'augmented',
        noteCount: 3,
      },
      hint: 'C augmented = C, E, G#. Two stacked major 3rds: C to E (4 semitones) and E to G# (4 semitones). Symmetrical structure.',
      points: 2,
    },
    {
      id: 'l9u31m4e3',
      type: 'multiple_choice',
      prompt: 'What intervals make up a diminished triad?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Root, minor 3rd, and diminished 5th (tritone)', correct: true },
          { label: 'Root, major 3rd, and perfect 5th', correct: false },
          { label: 'Root, minor 3rd, and perfect 5th', correct: false },
          { label: 'Root, major 3rd, and augmented 5th', correct: false },
        ],
      },
      hint: 'Diminished = minor 3rd (3 semitones) + diminished 5th (6 semitones). Two stacked minor 3rds produce the tritone between root and 5th.',
      points: 1,
    },
    {
      id: 'l9u31m4e4',
      type: 'multiple_choice',
      prompt: 'How would you describe the sound of an augmented triad?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Tense and unresolved with a dreamy, floating quality', correct: true },
          { label: 'Bright and stable like a major chord', correct: false },
          { label: 'Dark and heavy like a minor chord', correct: false },
          { label: 'Hollow and medieval like a power chord', correct: false },
        ],
      },
      hint: 'Augmented triads divide the octave into three equal parts (major 3rd + major 3rd). This symmetry creates an ambiguous, suspended feeling.',
      points: 1,
    },
  ],

  // ---- l9u31m5: Seventh Chord Quality ----
  l9u31m5: [
    {
      id: 'l9u31m5e1',
      type: 'chord_build',
      prompt: 'Build a Cmaj7 chord. It has a lush, sophisticated quality.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'major7',
        noteCount: 4,
      },
      hint: 'Cmaj7 = C, E, G, B. A C major triad plus the major 7th (B, 11 semitones from root). Common in jazz and bossa nova.',
      points: 2,
    },
    {
      id: 'l9u31m5e2',
      type: 'chord_build',
      prompt: 'Build a Dm7 chord. It has a mellow, relaxed quality.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'minor7',
        noteCount: 4,
      },
      hint: 'Dm7 = D, F, A, C. A D minor triad plus the minor 7th (C, 10 semitones from root).',
      points: 2,
    },
    {
      id: 'l9u31m5e3',
      type: 'multiple_choice',
      prompt: 'What gives a dominant 7th chord its characteristic sense of tension and desire to resolve?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The tritone formed between the major 3rd and the minor 7th', correct: true },
          { label: 'The perfect 5th between root and 5th', correct: false },
          { label: 'The major 3rd between root and 3rd', correct: false },
          { label: 'The octave doubling of the root', correct: false },
        ],
      },
      hint: 'In G7 (G-B-D-F), B and F form a tritone (6 semitones). This dissonance creates the pull toward resolution to C major.',
      points: 1,
    },
    {
      id: 'l9u31m5e4',
      type: 'multiple_choice',
      prompt: 'In which musical context is the half-diminished seventh chord most commonly found?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'As the ii chord in minor keys (e.g. Bm7b5 in A minor)', correct: true },
          { label: 'As the I chord in major keys', correct: false },
          { label: 'As the V chord in major keys', correct: false },
          { label: 'As the IV chord in blues progressions', correct: false },
        ],
      },
      hint: 'The half-diminished seventh (m7b5) naturally occurs on the 2nd degree of harmonic minor. It serves as the predominant chord leading to V in minor key ii-V-i progressions.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 32: Dictation, Sight Singing, Contextual
  // =========================================================================

  // ---- l9u32m1: Melodic Dictation Diatonic ----
  l9u32m1: [
    {
      id: 'l9u32m1e1',
      type: 'note_id',
      prompt: 'Listen to this note within a C major context and identify it. It is the 3rd scale degree.',
      config: {
        type: 'note_id',
        note: 'E',
        accidental: '',
        octave: 4,
      },
      hint: 'E4 is the 3rd degree of C major. It sits on the first line of the treble staff.',
      points: 1,
    },
    {
      id: 'l9u32m1e2',
      type: 'note_id',
      prompt: 'Listen to this note within a C major context and identify it. It is the 6th scale degree.',
      config: {
        type: 'note_id',
        note: 'A',
        accidental: '',
        octave: 4,
      },
      hint: 'A4 is the 6th degree of C major. It sits in the second space of the treble staff.',
      points: 1,
    },
    {
      id: 'l9u32m1e3',
      type: 'multiple_choice',
      prompt: 'What does "diatonic melody" mean?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A melody that uses only the notes of the prevailing key or scale', correct: true },
          { label: 'A melody that uses sharps and flats outside the key', correct: false },
          { label: 'A melody played on only one string of a guitar', correct: false },
          { label: 'A melody that moves exclusively by step', correct: false },
        ],
      },
      hint: 'Diatonic means "belonging to the key." A diatonic melody in C major uses only C, D, E, F, G, A, and B — no accidentals.',
      points: 1,
    },
    {
      id: 'l9u32m1e4',
      type: 'multiple_choice',
      prompt: 'Which strategy is most effective for hearing individual scale degrees in a melody?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Relating each note to the tonic by singing the scale up to that degree', correct: true },
          { label: 'Memorizing the frequency in hertz of every note', correct: false },
          { label: 'Counting the number of ledger lines on the staff', correct: false },
          { label: 'Playing the melody backwards to check your answer', correct: false },
        ],
      },
      hint: 'Scale degree hearing means perceiving each note in relation to the tonic. Singing up from "do" to the target note is a reliable method.',
      points: 1,
    },
  ],

  // ---- l9u32m2: Melodic Dictation Chromatic ----
  l9u32m2: [
    {
      id: 'l9u32m2e1',
      type: 'interval_id',
      prompt: 'Listen to this chromatic half step ascending from E. Identify the interval.',
      config: {
        type: 'interval_id',
        root: 'E',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 1,
        direction: 'ascending',
      },
      hint: '1 semitone ascending from E = E to F. A chromatic half step in a melodic context often functions as a passing tone.',
      points: 1,
    },
    {
      id: 'l9u32m2e2',
      type: 'interval_id',
      prompt: 'Listen to this highly dissonant interval ascending from F. It divides the octave exactly in half. Identify it.',
      config: {
        type: 'interval_id',
        root: 'F',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 6,
        direction: 'ascending',
      },
      hint: '6 semitones = tritone (augmented 4th / diminished 5th). F to B. It is the most dissonant interval and divides the octave symmetrically.',
      points: 1,
    },
    {
      id: 'l9u32m2e3',
      type: 'multiple_choice',
      prompt: 'What is a chromatic passing tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A note outside the key that fills in a whole step between two diatonic notes', correct: true },
          { label: 'Any note played with an accent', correct: false },
          { label: 'The first note of a chromatic scale', correct: false },
          { label: 'A note that is sustained across a bar line', correct: false },
        ],
      },
      hint: 'A chromatic passing tone is a non-diatonic note that connects two diatonic notes a whole step apart, dividing that whole step into two half steps.',
      points: 1,
    },
  ],

  // ---- l9u32m3: Harmonic Dictation ----
  l9u32m3: [
    {
      id: 'l9u32m3e1',
      type: 'multiple_choice',
      prompt: 'A phrase ends with V moving to I, both in root position, with the melody arriving on the tonic. What type of cadence is this?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Perfect authentic cadence (PAC)', correct: true },
          { label: 'Half cadence', correct: false },
          { label: 'Plagal cadence', correct: false },
          { label: 'Deceptive cadence', correct: false },
        ],
      },
      hint: 'A perfect authentic cadence (PAC) requires V to I in root position with the tonic in the soprano. It provides the strongest sense of finality.',
      points: 1,
    },
    {
      id: 'l9u32m3e2',
      type: 'multiple_choice',
      prompt: 'A musical phrase pauses on the V chord without resolving. What type of cadence is this?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Half cadence', correct: true },
          { label: 'Perfect authentic cadence', correct: false },
          { label: 'Plagal cadence', correct: false },
          { label: 'Deceptive cadence', correct: false },
        ],
      },
      hint: 'A half cadence ends on V, creating a feeling of suspension or incompleteness — like a comma rather than a period.',
      points: 1,
    },
    {
      id: 'l9u32m3e3',
      type: 'multiple_choice',
      prompt: 'You expect V to resolve to I, but instead it moves to vi. What type of cadence produces this surprise?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Deceptive cadence', correct: true },
          { label: 'Half cadence', correct: false },
          { label: 'Perfect authentic cadence', correct: false },
          { label: 'Plagal cadence', correct: false },
        ],
      },
      hint: 'A deceptive cadence substitutes vi for the expected I after V. The ear expects resolution but gets a surprise detour.',
      points: 1,
    },
  ],

  // ---- l9u32m4: Sight Singing ----
  l9u32m4: [
    {
      id: 'l9u32m4e1',
      type: 'multiple_choice',
      prompt: 'In movable-do solfege, what syllable is always assigned to the tonic of the current key?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Do', correct: true },
          { label: 'La', correct: false },
          { label: 'Sol', correct: false },
          { label: 'Re', correct: false },
        ],
      },
      hint: 'In movable-do, "Do" always represents the tonic regardless of key. In C major, Do = C. In G major, Do = G.',
      points: 1,
    },
    {
      id: 'l9u32m4e2',
      type: 'multiple_choice',
      prompt: 'In the key of C major, which note corresponds to the solfege syllable "Mi"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'E', correct: true },
          { label: 'D', correct: false },
          { label: 'F', correct: false },
          { label: 'G', correct: false },
        ],
      },
      hint: 'Do-Re-Mi-Fa-Sol-La-Ti maps to the 7 scale degrees. In C major: C(Do), D(Re), E(Mi), F(Fa), G(Sol), A(La), B(Ti).',
      points: 1,
    },
    {
      id: 'l9u32m4e3',
      type: 'multiple_choice',
      prompt: 'What is the most important preparation step before sight singing a melody?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Establishing the tonic by singing the scale or arpeggio of the key', correct: true },
          { label: 'Memorizing the entire melody before beginning', correct: false },
          { label: 'Reading the lyrics first', correct: false },
          { label: 'Counting the total number of notes', correct: false },
        ],
      },
      hint: 'Establishing the key center (tonic) in your ear is essential. Singing a quick scale or tonic arpeggio grounds your pitch perception before reading the melody.',
      points: 1,
    },
  ],

  // ---- l9u32m5: Contextual Listening ----
  l9u32m5: [
    {
      id: 'l9u32m5e1',
      type: 'multiple_choice',
      prompt: 'You hear a single unaccompanied vocal line with no harmony. What musical texture is this?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Monophonic', correct: true },
          { label: 'Homophonic', correct: false },
          { label: 'Polyphonic', correct: false },
          { label: 'Heterophonic', correct: false },
        ],
      },
      hint: 'Monophonic texture consists of a single melodic line with no accompaniment or harmony. One voice, one line.',
      points: 1,
    },
    {
      id: 'l9u32m5e2',
      type: 'multiple_choice',
      prompt: 'A song alternates between a recurring section and contrasting sections (A-B-A-B). What form is this?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Verse-chorus form', correct: true },
          { label: 'Through-composed form', correct: false },
          { label: 'Rondo form', correct: false },
          { label: 'Sonata form', correct: false },
        ],
      },
      hint: 'Verse-chorus form alternates verses (changing lyrics, same melody) with a recurring chorus. It is the most common structure in popular music.',
      points: 1,
    },
    {
      id: 'l9u32m5e3',
      type: 'multiple_choice',
      prompt: 'Which musical feature is most useful for identifying the historical style period of a piece?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The combination of instrumentation, harmonic language, and formal structure', correct: true },
          { label: 'The tempo marking alone', correct: false },
          { label: 'The key signature alone', correct: false },
          { label: 'The number of measures in the piece', correct: false },
        ],
      },
      hint: 'Style periods are identified by a combination of factors: instrumentation (harpsichord vs. piano), harmonic vocabulary (triadic vs. chromatic), and formal conventions (binary vs. sonata form).',
      points: 1,
    },
  ],
};

export default exercises;
