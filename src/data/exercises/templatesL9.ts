import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 9 Templates — 15 modules, ~80 generated exercises
// Focus: Ear training — interval recognition, chord ID, melodic dictation,
//        sight singing
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 30: Pitch and Interval Training
  // =========================================================================

  // ---- l9u30m1: Pitch Matching/Direction ----
  {
    moduleId: 'l9u30m1',
    templates: [
      {
        type: 'note_id',
        promptTemplate: 'Identify the pitch shown on the staff.',
        hintTemplate: 'Use reference pitches you know (A4 = 440 Hz, middle C = C4) to orient yourself.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          octaves: [3, 4, 5],
        },
      },
      {
        type: 'note_id',
        promptTemplate: 'Identify this pitch. It includes an accidental.',
        hintTemplate: 'This note has a sharp or flat. Listen for whether it sounds higher or lower than the nearest natural note.',
        params: {
          roots: ['C', 'D', 'F', 'G', 'A'],
          accidentals: ['#', '#', '#', '#', '#'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l9u30m2: Major vs Minor Recognition ----
  {
    moduleId: 'l9u30m2',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Listen and identify this interval from {root}. Is it major or minor?',
        hintTemplate: 'Major 3rd = 4 semitones (bright, happy). Minor 3rd = 3 semitones (dark, sad). The difference is just one half step, but the character changes dramatically.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [3, 4],
          directions: ['ascending'],
          octaves: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Distinguish major from minor quality by ear.',
        hintTemplate: 'Major sounds bright and open. Minor sounds dark and pensive. Focus on the 3rd: major 3rd = 4 semitones, minor 3rd = 3 semitones.',
        params: {
          choiceSets: [
            [
              { label: 'A major chord sounds bright because it has a major 3rd (4 semitones)', correct: true },
              { label: 'A major chord sounds bright because of the perfect 5th', correct: false },
              { label: 'Major and minor chords sound identical', correct: false },
              { label: 'The root determines whether a chord sounds bright', correct: false },
            ],
            [
              { label: 'A minor chord sounds darker because it has a minor 3rd (3 semitones)', correct: true },
              { label: 'Minor chords have a lower root', correct: false },
              { label: 'Minor chords lack a 5th', correct: false },
              { label: 'The 5th makes a chord sound minor', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l9u30m3: Interval Recognition P1-P5 ----
  {
    moduleId: 'l9u30m3',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Listen and identify this interval from {root} going {direction}. Focus on intervals up to a perfect 5th.',
        hintTemplate: 'Interval ear training: m2=1 (tense), M2=2 (step), m3=3 (sad), M3=4 (bright), P4=5 (open), P5=7 (power). From {root}, count semitones.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [1, 2, 3, 4, 5, 7],
          directions: ['ascending', 'descending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l9u30m4: Interval Recognition m6-P8 ----
  {
    moduleId: 'l9u30m4',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Listen and identify this wider interval from {root} going {direction}.',
        hintTemplate: 'Wider intervals: tritone=6 (tense), m6=8 (bittersweet), M6=9 (warm), m7=10 (jazz), M7=11 (longing), P8=12 (octave). From {root}.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [6, 8, 9, 10, 11, 12],
          directions: ['ascending', 'descending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l9u30m5: Harmonic Intervals ----
  {
    moduleId: 'l9u30m5',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Listen to these two notes played simultaneously from {root} and identify the harmonic interval.',
        hintTemplate: 'Harmonic intervals sound both notes at once. Consonances (3, 4, 5, 7, 8, 9, 12) blend smoothly. Dissonances (1, 2, 6, 10, 11) create tension. From {root}.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          intervals: [3, 4, 5, 7, 8, 9, 12],
          directions: ['ascending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 31: Chord and Scale Recognition
  // =========================================================================

  // ---- l9u31m1: Scale Recognition Major/Minor ----
  {
    moduleId: 'l9u31m1',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'After listening, build the {root} {scaleType} scale you heard. Select all notes.',
        hintTemplate: 'Major scale: W-W-H-W-W-W-H (bright, resolved). Natural minor: W-H-W-W-H-W-W (dark, open). Harmonic minor: raises the 7th. Build from {root}.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A', 'E', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          scaleTypes: ['major', 'natural_minor', 'harmonic_minor'],
          noteCounts: [7],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // ---- l9u31m2: Scale Recognition Modal ----
  {
    moduleId: 'l9u31m2',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale. Listen for the characteristic note that defines this mode.',
        hintTemplate: 'Mode identifiers: Dorian = natural 6 in minor context, Phrygian = b2, Lydian = #4, Mixolydian = b7 in major context. Build from {root}.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['dorian', 'phrygian', 'lydian', 'mixolydian'],
          noteCounts: [7],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // ---- l9u31m3: Triad Quality by Ear ----
  {
    moduleId: 'l9u31m3',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Listen and build the {root} {quality} triad. Identify the chord quality by ear.',
        hintTemplate: 'Major = bright/stable. Minor = dark/stable. Diminished = tense/unstable. Augmented = bright/unresolved. Build the triad on {root}.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major', 'minor', 'diminished', 'augmented'],
          noteCounts: [3],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // ---- l9u31m4: Seventh Chord Quality by Ear ----
  {
    moduleId: 'l9u31m4',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Listen and build the {root} {quality} chord. Identify the seventh chord quality by ear.',
        hintTemplate: 'maj7 = dreamy/lush. min7 = mellow/warm. dom7 = bright/needs resolution. half-dim7 = dark/unresolved. dim7 = very tense. Build on {root}.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major7', 'minor7', 'dominant7', 'half_diminished7', 'diminished7'],
          noteCounts: [4],
        },
        points: 2,
      },
    ],
    targetCount: 6,
  },

  // ---- l9u31m5: Chord Progression by Ear ----
  {
    moduleId: 'l9u31m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Listen to this chord progression and identify the Roman numeral analysis.',
        hintTemplate: 'Focus on the bass motion and the quality of each chord. Common progressions: I-IV-V-I, I-V-vi-IV, ii-V-I. Listen for resolution and tension patterns.',
        params: {
          choiceSets: [
            [
              { label: 'I - IV - V - I: the most basic harmonic progression in tonal music', correct: true },
              { label: 'I - ii - iii - IV', correct: false },
              { label: 'I - V - IV - I', correct: false },
              { label: 'I - vi - ii - V', correct: false },
            ],
            [
              { label: 'I - V - vi - IV: the most common pop progression', correct: true },
              { label: 'I - IV - V - vi', correct: false },
              { label: 'I - vi - V - IV', correct: false },
              { label: 'I - ii - V - I', correct: false },
            ],
            [
              { label: 'ii - V - I: the fundamental jazz progression', correct: true },
              { label: 'I - V - ii: the jazz standard', correct: false },
              { label: 'V - ii - I: the typical jazz resolution', correct: false },
              { label: 'I - ii - V: the jazz approach', correct: false },
            ],
            [
              { label: 'I - vi - IV - V: the "50s progression"', correct: true },
              { label: 'I - V - IV - vi', correct: false },
              { label: 'vi - I - IV - V', correct: false },
              { label: 'I - IV - vi - V', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 32: Melodic Dictation and Sight Singing
  // =========================================================================

  // ---- l9u32m1: Stepwise Melodic Dictation ----
  {
    moduleId: 'l9u32m1',
    templates: [
      {
        type: 'note_id',
        promptTemplate: 'Identify the note shown on the staff.',
        hintTemplate: 'In stepwise melodies, each note is a half step or whole step from the previous one. Sing the scale to orient yourself.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          octaves: [4, 5],
        },
      },
      {
        type: 'interval_id',
        promptTemplate: 'Identify the step from {root}: is it a half step or whole step?',
        hintTemplate: 'Half steps (1 semitone) sound closer/more tense. Whole steps (2 semitones) sound more open. From {root}, listen carefully.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [1, 2],
          directions: ['ascending', 'descending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l9u32m2: Leaping Melodic Dictation ----
  {
    moduleId: 'l9u32m2',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Listen to this leap from {root} and identify the interval.',
        hintTemplate: 'Common melodic leaps: M3 (4, bright), P4 (5, open), P5 (7, strong), m6 (8, expressive), P8 (12, octave). From {root}, identify the interval.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [3, 4, 5, 7, 8, 9, 12],
          directions: ['ascending', 'descending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l9u32m3: Chromatic Melodic Dictation ----
  {
    moduleId: 'l9u32m3',
    templates: [
      {
        type: 'note_id',
        promptTemplate: 'Identify this chromatic note.',
        hintTemplate: 'Chromatic notes are accidentals that do not belong to the current key. They create tension that resolves to nearby diatonic notes.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['#', '#', '', '#', '#', '#', ''],
          octaves: [4],
        },
      },
      {
        type: 'interval_id',
        promptTemplate: 'Identify this chromatic interval from {root}.',
        hintTemplate: 'Chromatic intervals include augmented and diminished qualities. From {root}, this interval uses a note outside the diatonic scale.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          intervals: [1, 3, 6, 8, 10, 11],
          directions: ['ascending', 'descending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l9u32m4: Sight Singing — Diatonic ----
  {
    moduleId: 'l9u32m4',
    templates: [
      {
        type: 'scale_degree_id',
        promptTemplate: 'In the {root} {scaleType} scale, identify degree {degree}. Sing from the tonic up to find it.',
        hintTemplate: 'Sight singing uses solfege (do-re-mi-fa-sol-la-ti) or scale degree numbers. In {root} {scaleType}, count up from {root} to find degree {degree}.',
        params: {
          roots: ['C', 'G', 'F', 'D', 'A', 'E'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['major', 'natural_minor'],
          degrees: [1, 2, 3, 4, 5, 6, 7],
        },
      },
      {
        type: 'scale_build',
        promptTemplate: 'Sing and then build the {root} {scaleType} scale. Select all 7 notes.',
        hintTemplate: 'Mentally sing the scale starting from {root} using solfege or numbers before selecting notes. {scaleType} scale has a distinctive sound pattern.',
        params: {
          roots: ['C', 'G', 'F', 'D', 'A'],
          accidentals: ['', '', '', '', ''],
          scaleTypes: ['major', 'natural_minor'],
          noteCounts: [7],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // l9u32m5 (Contextual Listening) intentionally has no generated templates.
  // Texture/form/style-period identification doesn't map to the current
  // template types (scale_build, scale_degree_id, etc.), so the module relies
  // on its hand-authored multiple_choice exercises in exercisesL9.ts.
];

export default templates;
