import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 9 Templates — 15 modules, ~75 generated exercises
// Focus: Ear training — every "listen" prompt is a real ear_training exercise
//        that plays the material (F-03 conversion). Visual/knowledge checks
//        keep honest, non-auditory wording.
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
        type: 'ear_training',
        promptTemplate: 'Listen to the pitch and identify it.',
        hintTemplate: 'Use reference pitches you know (A4 = 440 Hz, middle C = C4) to orient yourself.',
        params: {
          earMode: 'note',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          octaves: [3, 4, 5],
        },
      },
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this pitch and identify it. It includes an accidental.',
        hintTemplate: 'This note has a sharp or flat. Listen for whether it sounds higher or lower than the nearest natural note.',
        params: {
          earMode: 'note',
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
        type: 'ear_training',
        promptTemplate: 'Listen to this interval and identify it. Is the third major or minor?',
        hintTemplate: 'Major 3rd = 4 semitones (bright, happy). Minor 3rd = 3 semitones (dark, sad). The difference is just one half step, but the character changes dramatically.',
        params: {
          earMode: 'interval',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [3, 4],
          directions: ['ascending'],
          octaves: [4],
        },
      },
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this chord and identify its quality.',
        hintTemplate: 'Major sounds bright and open. Minor sounds dark and pensive. Focus on the 3rd: major 3rd = 4 semitones, minor 3rd = 3 semitones.',
        params: {
          earMode: 'chord',
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          chordQualities: ['major', 'minor'],
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
        type: 'ear_training',
        promptTemplate: 'Listen to this interval, played {direction}, and identify it. Focus on intervals up to a perfect 5th.',
        hintTemplate: 'Interval ear training: m2=1 (tense), M2=2 (step), m3=3 (sad), M3=4 (bright), P4=5 (open), P5=7 (power). Count the semitones you hear.',
        params: {
          earMode: 'interval',
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
        type: 'ear_training',
        promptTemplate: 'Listen to this wider interval, played {direction}, and identify it.',
        hintTemplate: 'Wider intervals: tritone=6 (tense), m6=8 (bittersweet), M6=9 (warm), m7=10 (jazz), M7=11 (longing), P8=12 (octave).',
        params: {
          earMode: 'interval',
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
        type: 'ear_training',
        promptTemplate: 'Listen to these two notes played simultaneously and identify the harmonic interval.',
        hintTemplate: 'Harmonic intervals sound both notes at once. Consonances (3, 4, 5, 7, 8, 9, 12 semitones) blend smoothly. Dissonances (1, 2, 6, 10, 11) create tension.',
        params: {
          earMode: 'interval',
          harmonic: true,
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
        type: 'ear_training',
        promptTemplate: 'Listen to this scale and identify its type.',
        hintTemplate: 'Major scale: W-W-H-W-W-W-H (bright, resolved). Natural minor: W-H-W-W-H-W-W (dark, open). Harmonic minor: raises the 7th, creating a distinctive step-and-a-half gap.',
        params: {
          earMode: 'scale',
          roots: ['C', 'G', 'D', 'F', 'A', 'E', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          octaves: [4],
          scaleTypes: ['major', 'natural_minor', 'harmonic_minor'],
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
        type: 'ear_training',
        promptTemplate: 'Listen to this scale and identify the mode. Listen for the characteristic note.',
        hintTemplate: 'Mode identifiers: Dorian = natural 6 in a minor context, Phrygian = b2, Lydian = #4, Mixolydian = b7 in a major context.',
        params: {
          earMode: 'scale',
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          octaves: [4],
          scaleTypes: ['dorian', 'phrygian', 'lydian', 'mixolydian'],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // ---- l9u31m3: Scale Recognition — Pentatonic, Blues, Symmetric ----
  {
    moduleId: 'l9u31m3',
    templates: [
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this scale and identify its type.',
        hintTemplate: 'Pentatonic scales have five notes and no half-step tension. The blues scale adds the "blue note" (b5). The whole-tone scale is all whole steps — dreamlike and rootless.',
        params: {
          earMode: 'scale',
          roots: ['C', 'D', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', ''],
          octaves: [4],
          scaleTypes: ['pentatonic_major', 'pentatonic_minor', 'blues', 'whole_tone'],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // ---- l9u31m4: Triad Quality Recognition ----
  {
    moduleId: 'l9u31m4',
    templates: [
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this triad and identify its quality.',
        hintTemplate: 'Major = bright/stable. Minor = dark/stable. Diminished = tense/unstable. Augmented = bright/unresolved.',
        params: {
          earMode: 'chord',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major', 'minor', 'diminished', 'augmented'],
        },
        points: 2,
      },
    ],
    targetCount: 6,
  },

  // ---- l9u31m5: Seventh Chord Quality Recognition ----
  {
    moduleId: 'l9u31m5',
    templates: [
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this seventh chord and identify its quality.',
        hintTemplate: 'maj7 = dreamy/lush. min7 = mellow/warm. dom7 = bright/needs resolution. half-dim7 = dark/unresolved. dim7 = very tense.',
        params: {
          earMode: 'chord',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major7', 'minor7', 'dominant7', 'half_diminished7', 'diminished7'],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 32: Melodic Dictation and Sight Singing
  // =========================================================================

  // ---- l9u32m1: Melodic Dictation — Diatonic ----
  {
    moduleId: 'l9u32m1',
    templates: [
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this pitch from a stepwise melody and identify it.',
        hintTemplate: 'In stepwise melodies, each note is a half step or whole step from the previous one. Sing the scale to orient yourself.',
        params: {
          earMode: 'note',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          octaves: [4, 5],
        },
      },
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this melodic interval, played {direction}, and identify it.',
        hintTemplate: 'Diatonic melodies mix steps (1-2 semitones) and leaps (M3=4, P4=5, P5=7, P8=12). Sing what you heard back to yourself before answering.',
        params: {
          earMode: 'interval',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [1, 2, 3, 4, 5, 7, 12],
          directions: ['ascending', 'descending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l9u32m2: Melodic Dictation — Chromatic ----
  {
    moduleId: 'l9u32m2',
    templates: [
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this chromatic note and identify it.',
        hintTemplate: 'Chromatic notes are accidentals that do not belong to the current key. They create tension that resolves to nearby diatonic notes.',
        params: {
          earMode: 'note',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['#', '#', '', '#', '#', '#', ''],
          octaves: [4],
        },
      },
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this chromatic interval, played {direction}, and identify it.',
        hintTemplate: 'Chromatic intervals include augmented and diminished qualities. This interval uses a note outside the diatonic scale.',
        params: {
          earMode: 'interval',
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          intervals: [1, 3, 6, 8, 10, 11],
          directions: ['ascending', 'descending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l9u32m3: Harmonic Dictation — Cadences and Progressions ----
  {
    moduleId: 'l9u32m3',
    templates: [
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this cadence in C major and identify it.',
        hintTemplate: 'Authentic (V-I) = conclusive arrival. Plagal (IV-I) = the "Amen" cadence. Deceptive (V-vi) = expected arrival sidestepped. Half (I-V) = pause on tension.',
        params: {
          earMode: 'progression',
          roots: ['C'],
          accidentals: [''],
          progressionSets: [
            ['V', 'I'],
            ['IV', 'I'],
            ['V', 'vi'],
            ['I', 'V'],
          ],
        },
        points: 2,
      },
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this chord progression in C major and identify the Roman numeral pattern.',
        hintTemplate: 'Focus on the bass motion and the quality of each chord. Common progressions: I-IV-V-I (basic), I-V-vi-IV (pop), ii-V-I (jazz), I-vi-IV-V (50s).',
        params: {
          earMode: 'progression',
          roots: ['C'],
          accidentals: [''],
          progressionSets: [
            ['I', 'IV', 'V', 'I'],
            ['I', 'V', 'vi', 'IV'],
            ['ii', 'V', 'I'],
            ['I', 'vi', 'IV', 'V'],
          ],
        },
        points: 2,
      },
    ],
    targetCount: 6,
  },

  // ---- l9u32m4: Sight Singing — Diatonic ----
  // Sight singing is production, not listening: the learner sings, then
  // answers. These stay visual/knowledge tasks with honest wording.
  {
    moduleId: 'l9u32m4',
    templates: [
      {
        type: 'scale_degree_id',
        promptTemplate: 'In the {root} {scaleType} scale, what degree is {note}? Sing up from the tonic to find it.',
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
  // template types, so the module relies on its hand-authored exercises in
  // exercisesL9.ts.
];

export default templates;
