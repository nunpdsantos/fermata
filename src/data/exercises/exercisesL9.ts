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
      nudge: 'Compare it with the reference pitch played first: is it higher, lower, or exactly the same note? Sing the reference, then the note, and listen for any step between them.',
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
      nudge: 'Compare it with the reference C you heard first: sing up the major scale from C, one note at a time, until you reach it, and count how many steps you climbed.',
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
      nudge: 'Think of pitch as height: if the second note is higher, did the melody go up or down? Pick the word that names that direction.',
    },
    {
      id: 'l9u30m1e4',
      type: 'multiple_choice',
      prompt: 'What does "register" refer to in music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The high or low region where pitches sound', correct: true },
          { label: 'The highest-to-lowest span of a melody', correct: false },
          { label: 'The upward or downward motion of a melody', correct: false },
          { label: 'The number of notes sounding in a chord', correct: false },
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
      nudge: 'Listen to the 3rd above the root: is it 4 half steps (a brighter, open sound) or 3 half steps (a darker, more somber one)?',
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
      nudge: "Sing the root and then the chord's 3rd: are they 4 half steps apart (brighter) or 3 (darker)?",
    },
    {
      id: 'l9u30m2e3',
      type: 'multiple_choice',
      prompt: 'Which triad is the minor form of C–E–G?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C–Eb–G', correct: true },
          { label: 'C–E#–G', correct: false },
          { label: 'C#–E–G', correct: false },
          { label: 'C–E–Gb', correct: false },
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
      nudge: 'Judge the size first: are the two notes as close together as two different notes can be, tense and creeping, or is there room for another note between them?',
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
      nudge: 'Is it a step or a leap? If it is a step, decide whether the notes are neighbouring keys (tight and tense) or have one key between them (a plain, everyday step).',
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
      nudge: 'It is a small leap, wider than a step. Listen to its colour: bright and open, or darker and more melancholy? Then sing up from the lower note by half steps to confirm the size.',
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
      nudge: 'Listen to the character of the leap: tense and unstable, warm and sweet, or bare, open and strong? Then count the half steps up from the lower note to confirm.',
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
      nudge: 'A wide leap with a bittersweet, yearning colour. To check, sing the lower note again an octave up, name the small interval it makes with the other note, and invert it: the numbers add up to 9, and the quality turns into its opposite.',
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
      nudge: 'A wide leap that still sounds warm and sweet. To check, sing the lower note again an octave up, name the small interval it makes with the other note, and invert it: the numbers add up to 9, and the quality turns into its opposite.',
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
      nudge: 'A very wide leap with a bluesy pull that wants to resolve. Sing the lower note an octave up and compare: does the leap fall a half step short of that octave, or a whole step short?',
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
      nudge: 'Listen for whether the two notes blend so completely that they sound like one note at two heights, or whether some rub or tension remains between them.',
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
      nudge: 'Sort it by sound first: open and hollow, warm and blended, or rough and tense? Then sing the two notes one after the other and count the half steps between them to pin down the size.',
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
      nudge: 'Sort it by sound first: open and hollow, warm and blended, or rough and tense? If it is warm, decide whether it is the brighter or the darker kind: sing the two notes one after the other and count the half steps.',
    },
    {
      id: 'l9u30m5e3',
      type: 'multiple_choice',
      prompt: 'What is the difference between a harmonic interval and a melodic interval?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Harmonic intervals sound both notes at once; melodic intervals play them one after the other', correct: true },
          { label: "Harmonic intervals sound both notes one after the other; melodic intervals play them at once", correct: false },
          { label: 'Harmonic intervals sound both notes in the same octave; melodic intervals play them in different octaves', correct: false },
          { label: 'Harmonic intervals sound both notes on one instrument; melodic intervals play them on two instruments', correct: false },
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
      nudge: 'Check the 3rd above the tonic first: 4 half steps or 3? If 3, listen to the top of the scale: is there a step-and-a-half gap between the 6th and the 7th?',
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
      nudge: 'Sing up from the tonic: is the 3rd 4 or 3 half steps above it? Then listen to the 7th: is it a whole step below the top tonic, or a half step with a step-and-a-half gap beneath it?',
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
          { label: 'Mysterious, ambiguous, and unsettled', correct: false },
          { label: 'Dissonant, harsh, and unstable', correct: false },
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
      nudge: 'First the 3rd: 4 or 3 half steps above the tonic? Then compare with the major scale (if 4) or the natural minor (if 3) and find the one degree that differs: a lowered 2nd, a raised 4th, a raised 6th or a lowered 7th?',
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
      nudge: 'Is the 3rd 4 or 3 half steps above the tonic? Compare the scale with the major (if 4) or the natural minor (if 3) and listen for the one degree that is different: the 2nd, the 4th, the 6th or the 7th?',
    },
    {
      id: 'l9u31m2e3',
      type: 'multiple_choice',
      prompt: 'What is the characteristic tone that distinguishes Dorian from natural minor?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "The 6th degree raised by one semitone", correct: true },
          { label: "The 7th degree raised by one semitone", correct: false },
          { label: "The 3rd degree raised by one semitone", correct: false },
          { label: 'The 2nd degree lowered by one semitone', correct: false },
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
      nudge: 'Compare each degree with the major scale you know: is the 4th raised, the 7th lowered, the 3rd lowered, or does every degree match?',
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
      nudge: 'Compare each degree with the natural minor scale: is the 6th raised, the 2nd lowered, the 2nd and 5th both lowered, or does every degree match?',
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
      nudge: 'Count the notes and listen for half steps. If there are five notes and no half steps, check the 3rd: is it 4 or 3 half steps above the tonic?',
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
      nudge: 'Count the notes and listen for half steps: five notes with none, six notes all a whole step apart, or six notes with an extra chromatic note squeezed between the 4th and the 5th?',
    },
    {
      id: 'l9u31m3e3',
      type: 'multiple_choice',
      prompt: 'What is the "blue note" in a blues scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The flat 5th (or sharp 4th), between the 4th and 5th degrees', correct: true },
          { label: "The flat 2nd (or sharp tonic), between the 1st and 2nd degrees", correct: false },
          { label: "The flat 6th (or sharp 5th), between the 5th and 6th degrees", correct: false },
          { label: "The natural 7th (or flat octave), between the flat 7th and the tonic", correct: false },
        ],
      },
      hint: 'The blue note is the b5 (or #4) that the six-note blues scale adds to the minor pentatonic. In C blues, it is Gb/F#, between F and G.',
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
      nudge: 'Listen to the outer interval, root to 5th: is it a perfect 5th, or a half step narrower or wider? Then check the two stacked 3rds: 4 or 3 half steps each?',
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
      nudge: 'Stack the two 3rds you hear, from the bottom up: are they 4 + 3, 3 + 4, 3 + 3 or 4 + 4 half steps? The outer 5th helps too: perfect, or a half step narrower or wider?',
    },
    {
      id: 'l9u31m4e3',
      type: 'multiple_choice',
      prompt: 'What intervals make up a diminished triad?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Root + minor 3rd + diminished 5th', correct: true },
          { label: 'Root + major 3rd + diminished 5th', correct: false },
          { label: 'Root + minor 3rd + perfect 5th', correct: false },
          { label: 'Root + major 3rd + perfect 5th', correct: false },
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
      nudge: 'First the triad: is the 3rd 4 or 3 half steps above the root, and is the 5th perfect or a half step lower? Then the 7th: is it a half step or a whole step below the octave?',
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
      nudge: 'Hear it in two layers. The triad: is the 3rd 4 or 3 half steps above the root, and is the 5th perfect or lowered? The 7th: does it sit a half step or a whole step below the octave?',
    },
    {
      id: 'l9u31m5e3',
      type: 'multiple_choice',
      prompt: 'What gives a dominant 7th chord its characteristic sense of tension and desire to resolve?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The tritone between the 3rd and the 7th', correct: true },
          { label: 'The tritone between the root and the 5th', correct: false },
          { label: 'The perfect 5th between the root and the 5th', correct: false },
          { label: 'The major 3rd between the root and the 3rd', correct: false },
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
          { label: "As the i chord in minor keys (e.g. Am7b5 in A minor)", correct: false },
          { label: "As the V chord in minor keys (e.g. Em7b5 in A minor)", correct: false },
          { label: "As the iv chord in minor keys (e.g. Dm7b5 in A minor)", correct: false },
        ],
      },
      hint: 'The half-diminished seventh (m7b5) occurs diatonically on ii in natural or harmonic minor and on vii in major. In minor-key ii-V-i progressions, it is the usual predominant leading to V.',
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
          { label: 'A melody using notes outside the key', correct: false },
          { label: 'A melody that rises and then falls', correct: false },
          { label: 'A melody that moves only by step', correct: false },
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
          { label: "Relating each note to the dominant by calling the dominant the first scale degree", correct: false },
          { label: "Relating each note to the tonic by counting every semitone as a new scale degree", correct: false },
          { label: "Relating each note to the first melody note by calling that note the tonic", correct: false },
        ],
      },
      hint: 'Scale degree hearing means perceiving each note in relation to the tonic. Singing the scale up from the tonic to the target note is a reliable method.',
    },
    {
      id: 'l9u32m1e5',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'C',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['C4', 'D4', 'E4', 'D4', 'C4'], correct: true },
          { notes: ['E4', 'F4', 'G4', 'F4', 'E4'], correct: false },
          { notes: ['G4', 'E4', 'C4', 'B3', 'G3'], correct: false },
        ],
      },
      hint: 'Follow the contour first: does the line come back to where it started, or keep climbing?',
    },
    {
      id: 'l9u32m1e6',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'C',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['E4', 'F4', 'G4', 'E4', 'C4'], correct: true },
          { notes: ['C4', 'D4', 'E4', 'F4', 'G4'], correct: false },
          { notes: ['G4', 'A4', 'B4', 'G4', 'E4'], correct: false },
        ],
      },
      hint: 'It rises by step, then skips back down through the notes of the tonic chord to finish on the tonic.',
    },
    {
      id: 'l9u32m1e7',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'G',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['G4', 'B4', 'D5', 'B4', 'G4'], correct: true },
          { notes: ['G4', 'A4', 'B4', 'C5', 'G4'], correct: false },
          { notes: ['G4', 'D5', 'C5', 'A4', 'G4'], correct: false },
        ],
      },
      hint: 'Steps or skips? A melody that outlines the tonic chord moves by thirds and ends where it began.',
    },
    {
      id: 'l9u32m1e8',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'F',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['A4', 'G4', 'F4', 'E4', 'F4'], correct: true },
          { notes: ['F4', 'A4', 'G4', 'F4', 'A4'], correct: false },
          { notes: ['C5', 'E5', 'D5', 'C5', 'D5'], correct: false },
        ],
      },
      hint: 'Listen to the ending: the last note is the tonic, reached from the note a half step below it.',
    },
    {
      id: 'l9u32m1e9',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'C',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['G4', 'E4', 'F4', 'D4', 'C4'], correct: true },
          { notes: ['G4', 'F4', 'E4', 'C4', 'D4'], correct: false },
          { notes: ['G4', 'D4', 'C4', 'E4', 'B3'], correct: false },
        ],
      },
      hint: 'It falls from the 5th to the tonic, but not straight down the scale: listen for the skips.',
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
      nudge: 'Is the leap stable and open, or restless and unresolved, as if it must move on? Count the half steps up from the lower note and compare the total with the 12 of an octave.',
    },
    {
      id: 'l9u32m2e3',
      type: 'multiple_choice',
      prompt: 'What is a chromatic passing tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A note that connects two scale notes a whole step apart by half steps', correct: true },
          { label: "A note a half step above a scale note that returns to it", correct: false },
          { label: "A note a half step below a scale note that returns to it", correct: false },
          { label: "A note sustained while other scale notes move above it", correct: false },
        ],
      },
      hint: 'A chromatic passing tone is a non-diatonic note that connects two diatonic notes a whole step apart, dividing that whole step into two half steps.',
    },
    {
      id: 'l9u32m2e4',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'C',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['C4', 'C#4', 'D4', 'E4', 'D4'], correct: true },
          { notes: ['E4', 'F4', 'F#4', 'G4', 'E4'], correct: false },
          { notes: ['G4', 'G#4', 'A4', 'B4', 'G4'], correct: false },
        ],
      },
      hint: 'A chromatic passing tone fills a whole step: listen for the note squeezed between the first two scale notes.',
    },
    {
      id: 'l9u32m2e5',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'C',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['E4', 'D#4', 'E4', 'F4', 'E4'], correct: true },
          { notes: ['E4', 'F4', 'F#4', 'G4', 'E4'], correct: false },
          { notes: ['E4', 'G4', 'G#4', 'A4', 'E4'], correct: false },
        ],
      },
      hint: 'One note steps just outside the key and comes straight back: a chromatic neighbour tone.',
    },
    {
      id: 'l9u32m2e6',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'C',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['E4', 'F#4', 'G4', 'F4', 'E4'], correct: true },
          { notes: ['C4', 'C#4', 'D4', 'E4', 'C4'], correct: false },
          { notes: ['G4', 'G#4', 'A4', 'G4', 'B4'], correct: false },
        ],
      },
      hint: 'Listen for the note that pulls up into G by a half step: a secondary leading tone (V/V).',
    },
    {
      id: 'l9u32m2e7',
      type: 'ear_training',
      prompt: 'Listen to the melody and choose the one you heard.',
      config: {
        type: 'ear_training',
        mode: 'melody',
        root: 'C',
        rootAccidental: '',
        melodyChoices: [
          { notes: ['G4', 'G#4', 'A4', 'G4', 'E4'], correct: true },
          { notes: ['E4', 'D#4', 'E4', 'F4', 'G4'], correct: false },
          { notes: ['C4', 'D4', 'D#4', 'E4', 'C4'], correct: false },
        ],
      },
      hint: 'A sharp leads up by a half step to the next note. Where does the line go after it?',
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
      nudge: 'Ask three things: does V go to I, are both chords in root position, and does the melody land on the tonic? When all three hold, it is the strongest, most final kind of authentic cadence; if one fails, it is the weaker kind.',
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
      nudge: 'Look at the last chord: a cadence that ends on the tonic sounds closed; one that stops on the dominant sounds open, like a comma. Which name describes an open, unfinished ending?',
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
      nudge: 'The dominant leads you to expect the tonic, but a different chord arrives instead. Which cadence is named for the ear being misled, rather than for arriving or pausing?',
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
      nudge: 'In movable solfege the syllables follow the scale degrees, not fixed pitches, and the tonic always takes the first syllable of the series. Which syllable opens it?',
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
      nudge: 'In movable-do solfege the syllables follow the scale degrees: in C major, Do = C. Count up the scale syllable by syllable until you reach Mi.',
    },
    {
      id: 'l9u32m4e3',
      type: 'multiple_choice',
      prompt: 'Which preparation establishes a tonal reference before sight singing a melody?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Find the tonic by singing the key’s scale or arpeggio', correct: true },
          { label: 'Find the tonic by choosing the highest melody note', correct: false },
          { label: 'Find the tonic by choosing the first melody note', correct: false },
          { label: 'Find the tonic by using the note named by the clef', correct: false },
        ],
      },
      hint: 'Establishing the key center (tonic) in your ear is essential. Singing a quick scale or tonic arpeggio grounds your pitch perception before reading the melody.',
      nudge: 'Before reading any notes, your ear needs a reference point: the pitch every other note is heard against. Which option gives your ear that home base?',
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
      nudge: 'Texture names come from Greek prefixes. Count how many independent lines are sounding and how they relate, then match that to the prefix.',
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
          { label: 'Rondo (ABACA)', correct: false },
          { label: 'Sonata form', correct: false },
        ],
      },
      hint: 'Verse-chorus form alternates verses (changing lyrics, same melody) with a recurring chorus. It is the most common structure in popular music.',
      nudge: 'Look at what the song is built from: two kinds of section that alternate, one of which comes back unchanged. Which form is named after exactly those sections?',
    },
    {
      id: 'l9u32m5e3',
      type: 'multiple_choice',
      prompt: 'Which musical feature is most useful for identifying the historical style period of a piece?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The combination of instrumentation, harmonic language, and formal structure', correct: true },
          { label: 'The combination of key signature, time signature, and tempo marking', correct: false },
          { label: 'The combination of melodic range, dynamics, and piece length', correct: false },
          { label: 'The combination of the first note, the last note, and the highest note', correct: false },
        ],
      },
      hint: 'Style periods are identified by a combination of factors: instrumentation (harpsichord vs. piano), harmonic vocabulary (mostly diatonic vs. heavily chromatic), and formal conventions (binary vs. sonata form).',
    },
  ],
};

export default exercises;
