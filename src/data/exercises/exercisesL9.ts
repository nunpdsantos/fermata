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
      type: 'ear_training',
      prompt: 'Listen to this pitch and identify it.',
      config: {
        type: 'ear_training',
        mode: 'note',
        note: 'C',
        accidental: '',
        octave: 4,
      },
      hint: 'Middle C (C4) is the central reference point on the piano — anchor it in your ear.',
    },
    {
      id: 'l9u30m1e2',
      type: 'ear_training',
      prompt: 'Listen to this pitch and identify it.',
      config: {
        type: 'ear_training',
        mode: 'note',
        note: 'G',
        accidental: '',
        octave: 4,
      },
      hint: 'G4 is a perfect 5th above middle C — 7 semitones up. Compare it against C4 in your ear.',
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
    },
    {
      id: 'l9u30m1e4',
      type: 'multiple_choice',
      prompt: 'What does "register" refer to in music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The relative highness or lowness of a range of pitches', correct: true },
          { label: 'The loudness or softness with which the notes are played', correct: false },
          { label: 'The speed at which the notes are played, from very slow to very fast', correct: false },
          { label: 'The number of instruments playing simultaneously', correct: false },
        ],
      },
      hint: 'Register describes a portion of the pitch spectrum — low register, middle register, or high register.',
    },
  ],

  // ---- l9u30m2: Major vs Minor Recognition ----
  l9u30m2: [
    {
      id: 'l9u30m2e1',
      type: 'ear_training',
      prompt: 'Listen to this chord. Is it major or minor?',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'C',
        chordRootAccidental: '',
        quality: 'major',
        choices: [
          { label: 'Major', correct: true },
          { label: 'Minor', correct: false },
        ],
      },
      hint: 'The major 3rd (4 semitones from root) gives major chords a bright, stable character.',
    },
    {
      id: 'l9u30m2e2',
      type: 'ear_training',
      prompt: 'Listen to this chord. Is it major or minor?',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'C',
        chordRootAccidental: '',
        quality: 'minor',
        choices: [
          { label: 'Major', correct: false },
          { label: 'Minor', correct: true },
        ],
      },
      hint: 'The minor 3rd (3 semitones from root) gives minor chords a darker, more somber quality.',
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
    },
  ],

  // ---- l9u30m3: Interval Recognition P1-P5 ----
  l9u30m3: [
    {
      id: 'l9u30m3e1',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 1,
        direction: 'ascending',
      },
      hint: '1 semitone = minor 2nd (half step) — the smallest interval in Western music. Think of the "Jaws" theme.',
    },
    {
      id: 'l9u30m3e2',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 2,
        direction: 'ascending',
      },
      hint: '2 semitones = major 2nd (whole step). The everyday melodic step.',
    },
    {
      id: 'l9u30m3e3',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 3,
        direction: 'ascending',
      },
      hint: '3 semitones = minor 3rd — dark and melancholy. This interval defines the bottom of a minor triad.',
    },
    {
      id: 'l9u30m3e4',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 7,
        direction: 'ascending',
      },
      hint: '7 semitones = perfect 5th — strong and open. The most consonant interval after the octave and unison.',
    },
  ],

  // ---- l9u30m4: Interval Recognition m6-P8 ----
  l9u30m4: [
    {
      id: 'l9u30m4e1',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 8,
        direction: 'ascending',
      },
      hint: '8 semitones = minor 6th — bittersweet and yearning, with a poignant, somewhat tense quality.',
    },
    {
      id: 'l9u30m4e2',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 9,
        direction: 'ascending',
      },
      hint: '9 semitones = major 6th — warm, romantic and consonant.',
    },
    {
      id: 'l9u30m4e3',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 10,
        direction: 'ascending',
      },
      hint: '10 semitones = minor 7th — a dominant, bluesy tension that wants to resolve.',
    },
    {
      id: 'l9u30m4e4',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 12,
        direction: 'ascending',
      },
      hint: '12 semitones = perfect octave — the two notes sound like the same pitch at different heights.',
    },
  ],

  // ---- l9u30m5: Harmonic Intervals ----
  l9u30m5: [
    {
      id: 'l9u30m5e1',
      type: 'ear_training',
      prompt: 'Listen to these two notes played together and identify the harmonic interval.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        harmonic: true,
        root: 'D',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 5,
        direction: 'ascending',
      },
      hint: '5 semitones = perfect 4th. When sounded together it has an open, hollow quality.',
    },
    {
      id: 'l9u30m5e2',
      type: 'ear_training',
      prompt: 'Listen to these two notes played together and identify the harmonic interval.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        harmonic: true,
        root: 'E',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 4,
        direction: 'ascending',
      },
      hint: '4 semitones = major 3rd — a warm, consonant harmonic sound.',
    },
    {
      id: 'l9u30m5e3',
      type: 'multiple_choice',
      prompt: 'What is the difference between a harmonic interval and a melodic interval?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Harmonic intervals sound both notes at once; melodic intervals play them one after the other', correct: true },
          { label: 'Harmonic intervals are always consonant; melodic intervals are always dissonant', correct: false },
          { label: 'Harmonic intervals use sharps; melodic intervals use flats', correct: false },
          { label: 'Harmonic intervals span more than an octave; melodic intervals do not', correct: false },
        ],
      },
      hint: 'Harmonic = both notes at the same time. Melodic = one note after the other. The same two notes can form either type.',
    },
  ],

  // =========================================================================
  // Unit 31: Scale, Chord, Dictation
  // =========================================================================

  // ---- l9u31m1: Scale Recognition Major/Minor ----
  l9u31m1: [
    {
      id: 'l9u31m1e1',
      type: 'ear_training',
      prompt: 'Listen to this scale and identify its type.',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'major',
        choices: [
          { label: 'Major', correct: true },
          { label: 'Natural minor', correct: false },
          { label: 'Harmonic minor', correct: false },
        ],
      },
      hint: 'The major scale (W-W-H-W-W-W-H) has a bright, resolved character at every step.',
    },
    {
      id: 'l9u31m1e2',
      type: 'ear_training',
      prompt: 'Listen to this scale and identify its type.',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'A',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'natural_minor',
        choices: [
          { label: 'Major', correct: false },
          { label: 'Natural minor', correct: true },
          { label: 'Harmonic minor', correct: false },
        ],
      },
      hint: 'Natural minor (W-H-W-W-H-W-W) has a darker mood than major — the lowered 3rd, 6th and 7th shape its color.',
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
          { label: 'Mysterious, ambiguous and unsettled', correct: false },
          { label: 'Dissonant and unstable', correct: false },
        ],
      },
      hint: 'Major scales are perceived as bright and stable. The major 3rd and major 7th contribute to this positive character.',
    },
  ],

  // ---- l9u31m2: Mode Recognition ----
  l9u31m2: [
    {
      id: 'l9u31m2e1',
      type: 'ear_training',
      prompt: 'Listen to this scale and identify the mode.',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'D',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'dorian',
        choices: [
          { label: 'Dorian', correct: true },
          { label: 'Phrygian', correct: false },
          { label: 'Lydian', correct: false },
          { label: 'Mixolydian', correct: false },
        ],
      },
      hint: 'Dorian is like natural minor with a raised 6th degree — that natural 6 in a minor context is the characteristic tone.',
    },
    {
      id: 'l9u31m2e2',
      type: 'ear_training',
      prompt: 'Listen to this scale and identify the mode.',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'F',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'lydian',
        choices: [
          { label: 'Dorian', correct: false },
          { label: 'Phrygian', correct: false },
          { label: 'Lydian', correct: true },
          { label: 'Mixolydian', correct: false },
        ],
      },
      hint: 'Lydian is like major with a raised 4th degree — listen for the bright #4 pulling upward.',
    },
    {
      id: 'l9u31m2e3',
      type: 'multiple_choice',
      prompt: 'What is the characteristic tone that distinguishes Dorian from natural minor?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A raised (natural) 6th degree', correct: true },
          { label: 'A lowered 2nd degree', correct: false },
          { label: 'A raised 7th degree', correct: false },
          { label: 'A lowered 5th degree', correct: false },
        ],
      },
      hint: 'Dorian differs from natural minor by one note: the 6th degree is raised a half step. In D Dorian, that is B natural instead of Bb.',
    },
    {
      id: 'l9u31m2e4',
      type: 'ear_training',
      prompt: 'Listen to this scale and identify the mode.',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'G',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'major',
        choices: [
          { label: 'Ionian', correct: true },
          { label: 'Lydian', correct: false },
          { label: 'Mixolydian', correct: false },
          { label: 'Dorian', correct: false },
        ],
      },
      hint: 'Ionian is the major scale itself: mode 1, nothing altered. Lydian would raise its 4th (#4); Mixolydian would lower its 7th (b7).',
    },
    {
      id: 'l9u31m2e5',
      type: 'ear_training',
      prompt: 'Listen to this scale and identify the mode.',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'E',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'natural_minor',
        choices: [
          { label: 'Aeolian', correct: true },
          { label: 'Dorian', correct: false },
          { label: 'Phrygian', correct: false },
          { label: 'Locrian', correct: false },
        ],
      },
      hint: 'Aeolian is the natural minor scale: mode 6 of the major scale. Dorian would raise its 6th (natural 6); Phrygian would lower its 2nd (b2); Locrian lowers both its 2nd and its 5th.',
    },
  ],

  // ---- l9u31m3: Pentatonic/Blues/Symmetric ----
  l9u31m3: [
    {
      id: 'l9u31m3e1',
      type: 'ear_training',
      prompt: 'Listen to this scale and identify its type.',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'pentatonic_major',
        choices: [
          { label: 'Pentatonic major', correct: true },
          { label: 'Pentatonic minor', correct: false },
          { label: 'Blues', correct: false },
          { label: 'Whole tone', correct: false },
        ],
      },
      hint: 'Major pentatonic has five notes and no half steps — the major scale without its 4th and 7th degrees.',
    },
    {
      id: 'l9u31m3e2',
      type: 'ear_training',
      prompt: 'Listen to this scale and identify its type.',
      config: {
        type: 'ear_training',
        mode: 'scale',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        scaleType: 'blues',
        choices: [
          { label: 'Pentatonic major', correct: false },
          { label: 'Pentatonic minor', correct: false },
          { label: 'Blues', correct: true },
          { label: 'Whole tone', correct: false },
        ],
      },
      hint: 'The blues scale is the minor pentatonic plus the "blue note" (b5) — listen for that extra chromatic bite.',
    },
    {
      id: 'l9u31m3e3',
      type: 'multiple_choice',
      prompt: 'What is the "blue note" in a blues scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The flat 5th (or sharp 4th), between the 4th and 5th degrees', correct: true },
          { label: 'The tonic repeated an octave higher, at the very top of the scale', correct: false },
          { label: 'Any note played with vibrato', correct: false },
          { label: 'The leading tone of the key, the note a half step below the tonic', correct: false },
        ],
      },
      hint: 'The blue note is the b5 (or #4) added to the minor pentatonic. In C blues, it is Gb/F#, sitting between F and G.',
    },
  ],

  // ---- l9u31m4: Triad Quality Recognition ----
  l9u31m4: [
    {
      id: 'l9u31m4e1',
      type: 'ear_training',
      prompt: 'Listen to this triad and identify its quality.',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'E',
        chordRootAccidental: '',
        quality: 'diminished',
        choices: [
          { label: 'Major', correct: false },
          { label: 'Minor', correct: false },
          { label: 'Diminished', correct: true },
          { label: 'Augmented', correct: false },
        ],
      },
      hint: 'Diminished = two stacked minor 3rds. The tritone between root and 5th creates its tense, unstable quality.',
    },
    {
      id: 'l9u31m4e2',
      type: 'ear_training',
      prompt: 'Listen to this triad and identify its quality.',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'C',
        chordRootAccidental: '',
        quality: 'augmented',
        choices: [
          { label: 'Major', correct: false },
          { label: 'Minor', correct: false },
          { label: 'Diminished', correct: false },
          { label: 'Augmented', correct: true },
        ],
      },
      hint: 'Augmented = two stacked major 3rds. The symmetrical structure gives it a dreamy, unresolved quality.',
    },
    {
      id: 'l9u31m4e3',
      type: 'multiple_choice',
      prompt: 'What intervals make up a diminished triad?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Root, minor 3rd, and diminished 5th (a tritone)', correct: true },
          { label: 'Root, major 3rd, and perfect 5th (a major triad)', correct: false },
          { label: 'Root, minor 3rd, and perfect 5th', correct: false },
          { label: 'Root, major 3rd, and augmented 5th (two major 3rds)', correct: false },
        ],
      },
      hint: 'Diminished = minor 3rd (3 semitones) + diminished 5th (6 semitones). Two stacked minor 3rds produce the tritone between root and 5th.',
    },
    {
      id: 'l9u31m4e4',
      type: 'multiple_choice',
      prompt: 'How would you describe the sound of an augmented triad?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Tense and unresolved, with a dreamy, floating and ambiguous quality', correct: true },
          { label: 'Bright, settled and stable, just like a plain major chord', correct: false },
          { label: 'Dark and heavy like a minor chord', correct: false },
          { label: 'Hollow and medieval like a power chord', correct: false },
        ],
      },
      hint: 'Augmented triads divide the octave into three equal parts (major 3rd + major 3rd). This symmetry creates an ambiguous, suspended feeling.',
    },
  ],

  // ---- l9u31m5: Seventh Chord Quality ----
  l9u31m5: [
    {
      id: 'l9u31m5e1',
      type: 'ear_training',
      prompt: 'Listen to this seventh chord and identify its quality.',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'C',
        chordRootAccidental: '',
        quality: 'major7',
        choices: [
          { label: 'Major 7th', correct: true },
          { label: 'Minor 7th', correct: false },
          { label: 'Dominant 7th', correct: false },
          { label: 'Half-diminished 7th', correct: false },
        ],
      },
      hint: 'The major 7th chord layers a major 7th over a major triad — lush and dreamy, common in jazz and bossa nova.',
    },
    {
      id: 'l9u31m5e2',
      type: 'ear_training',
      prompt: 'Listen to this seventh chord and identify its quality.',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'D',
        chordRootAccidental: '',
        quality: 'minor7',
        choices: [
          { label: 'Major 7th', correct: false },
          { label: 'Minor 7th', correct: true },
          { label: 'Dominant 7th', correct: false },
          { label: 'Half-diminished 7th', correct: false },
        ],
      },
      hint: 'The minor 7th chord layers a minor 7th over a minor triad — mellow, warm and relaxed.',
    },
    {
      id: 'l9u31m5e3',
      type: 'multiple_choice',
      prompt: 'What gives a dominant 7th chord its characteristic sense of tension and desire to resolve?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The 3rd-to-7th tritone', correct: true },
          { label: 'The perfect 5th formed between the root and the 5th of the chord', correct: false },
          { label: 'The major 3rd between root and 3rd', correct: false },
          { label: 'The octave doubling of the root', correct: false },
        ],
      },
      hint: 'In G7 (G-B-D-F), B and F form a tritone (6 semitones). This dissonance creates the pull toward resolution to C major.',
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
          { label: 'As the IV chord of a 12-bar blues, where every chord is a dominant 7th', correct: false },
        ],
      },
      hint: 'The half-diminished seventh (m7b5) naturally occurs on the 2nd degree of harmonic minor. It serves as the predominant chord leading to V in minor key ii-V-i progressions.',
    },
  ],

  // =========================================================================
  // Unit 32: Dictation, Sight Singing, Contextual
  // =========================================================================

  // ---- l9u32m1: Melodic Dictation Diatonic ----
  l9u32m1: [
    {
      id: 'l9u32m1e1',
      type: 'ear_training',
      prompt: 'Listen to this note and identify it.',
      config: {
        type: 'ear_training',
        mode: 'note',
        note: 'E',
        accidental: '',
        octave: 4,
      },
      hint: 'This pitch is the 3rd degree of C major. Sing up from C to locate it.',
    },
    {
      id: 'l9u32m1e2',
      type: 'ear_training',
      prompt: 'Listen to this note and identify it.',
      config: {
        type: 'ear_training',
        mode: 'note',
        note: 'A',
        accidental: '',
        octave: 4,
      },
      hint: 'This pitch is the 6th degree of C major. Sing up from C to locate it.',
    },
    {
      id: 'l9u32m1e3',
      type: 'multiple_choice',
      prompt: 'What does "diatonic melody" mean?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A melody using only notes of the key', correct: true },
          { label: 'A melody that uses sharps and flats outside the key', correct: false },
          { label: 'A melody played on only one string of a guitar', correct: false },
          { label: 'A melody that moves exclusively by step, never by leap, from note to note', correct: false },
        ],
      },
      hint: 'Diatonic means "belonging to the key." A diatonic melody in C major uses only C, D, E, F, G, A, and B — no accidentals.',
    },
    {
      id: 'l9u32m1e4',
      type: 'multiple_choice',
      prompt: 'Which strategy is most effective for identifying individual scale degrees in a melody?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Relating each note to the tonic by singing the scale up to that degree', correct: true },
          { label: 'Memorizing the exact frequency, in hertz, of every single note on the keyboard', correct: false },
          { label: 'Counting the number of ledger lines on the staff', correct: false },
          { label: 'Playing the melody backwards to check your answer', correct: false },
        ],
      },
      hint: 'Scale degree hearing means perceiving each note in relation to the tonic. Singing up from "do" to the target note is a reliable method.',
    },
  ],

  // ---- l9u32m2: Melodic Dictation Chromatic ----
  l9u32m2: [
    {
      id: 'l9u32m2e1',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'E',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 1,
        direction: 'ascending',
      },
      hint: 'E to F is a half step (1 semitone) between two different letter names — a diatonic half step, already inside C major. A chromatic half step keeps the letter name (F to F#). Either kind often works as a passing or neighbor motion in a melody.',
    },
    {
      id: 'l9u32m2e2',
      type: 'ear_training',
      prompt: 'Listen to this ascending interval and identify it.',
      config: {
        type: 'ear_training',
        mode: 'interval',
        root: 'F',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 6,
        direction: 'ascending',
      },
      hint: 'The tritone (6 semitones, augmented 4th / diminished 5th) is one of the sharpest dissonances (with the minor 2nd and major 7th) and divides the octave exactly in half.',
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
          { label: 'The first note of a chromatic scale, which starts on the tonic and rises by half steps', correct: false },
          { label: 'A note held over from the previous chord into the next one, across the bar line', correct: false },
        ],
      },
      hint: 'A chromatic passing tone is a non-diatonic note that connects two diatonic notes a whole step apart, dividing that whole step into two half steps.',
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
          { label: 'Imperfect authentic cadence (IAC)', correct: false },
          { label: 'Deceptive cadence', correct: false },
        ],
      },
      hint: 'A perfect authentic cadence (PAC) requires V to I in root position with the tonic in the soprano. It provides the strongest sense of finality.',
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
    },
    {
      id: 'l9u32m4e3',
      type: 'multiple_choice',
      prompt: 'What is the most important preparation step before sight singing a melody?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Establishing the tonic by singing the scale or arpeggio of the key', correct: true },
          { label: 'Memorizing the entire melody by heart before you sing a single note of it', correct: false },
          { label: 'Reading the lyrics first, so you know exactly which words you will have to sing', correct: false },
          { label: 'Counting the total number of notes in the melody before you start to sing', correct: false },
        ],
      },
      hint: 'Establishing the key center (tonic) in your ear is essential. Singing a quick scale or tonic arpeggio grounds your pitch perception before reading the melody.',
    },
  ],

  // ---- l9u32m5: Contextual Listening ----
  l9u32m5: [
    {
      id: 'l9u32m5e1',
      type: 'multiple_choice',
      prompt: 'A single unaccompanied vocal line with no harmony is an example of which musical texture?',
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
    },
    {
      id: 'l9u32m5e2',
      type: 'multiple_choice',
      prompt: 'A pop song alternates verses (new lyrics each time, same music) with a chorus that comes back with the same lyrics and the same music. What form is this?',
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
    },
    {
      id: 'l9u32m5e3',
      type: 'multiple_choice',
      prompt: 'Which musical feature is most useful for identifying the historical style period of a piece?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The combination of instrumentation, harmonic language, and formal structure', correct: true },
          { label: 'The tempo marking alone, exactly as it is printed above the first bar of the score', correct: false },
          { label: 'The key signature alone', correct: false },
          { label: 'The total number of measures in the piece, counted from the first bar to the last', correct: false },
        ],
      },
      hint: 'Style periods are identified by a combination of factors: instrumentation (harpsichord vs. piano), harmonic vocabulary (triadic vs. chromatic), and formal conventions (binary vs. sonata form).',
    },
  ],
};

export default exercises;
