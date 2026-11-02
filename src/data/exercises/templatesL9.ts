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
        promptTemplate: 'Listen to this interval and identify it. It is always a third — decide whether it is major or minor.',
        hintTemplate: 'Major 3rd = 4 semitones (bright, happy). Minor 3rd = 3 semitones (dark, sad). The difference is just one half step, but the character changes dramatically.',
        nudgeTemplate: 'Listen to the colour of the two notes: a bright, open third, or a darker, more somber one? To check, sing up from the lower note by half steps and count how many it takes to reach the upper one; the darker third is one half step narrower.',
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
        nudgeTemplate: 'Focus on the 3rd above the root: 4 half steps sounds bright and open, 3 half steps dark and pensive. Which one do you hear?',
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
        hintTemplate: 'Interval ear training: m2=1 (tense), M2=2 (step), m3=3 (sad), M3=4 (bright), P4=5 (open), tritone=6 (unstable), P5=7 (power). Count the semitones you hear.',
        nudgeTemplate: 'Count the half steps between the two notes (singing the steps in between helps), then recall which interval has that size.',
        params: {
          earMode: 'interval',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [1, 2, 3, 4, 5, 6, 7],
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
        hintTemplate: 'Wider intervals: m6=8 (bittersweet), M6=9 (warm), m7=10 (jazz), M7=11 (longing), P8=12 (octave).',
        nudgeTemplate: 'First listen whether the two notes blend as one note at two heights. If not, sing the lower note again, moved up to sit just above the upper one, name the small interval this makes, and invert it: the numbers add up to 9, and the quality turns into its opposite.',
        params: {
          earMode: 'interval',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [8, 9, 10, 11, 12],
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
      {
        // Compound intervals (objective + unit milestone, W4-18): m9, M9,
        // M10, P11 — 15 (m10) is left out because its table name is the
        // chord-symbol "Augmented 9th".
        type: 'ear_training',
        promptTemplate: 'Listen to these two notes played together and identify the compound interval (wider than an octave).',
        hintTemplate: 'A compound interval is a simple interval plus an octave: a 9th = octave + 2nd (m9 = 13, M9 = 14 semitones), a 10th = octave + 3rd (M10 = 16), an 11th = octave + 4th (P11 = 17). Listen for the simple interval above the octave.',
        nudgeTemplate: 'A compound interval is a simple interval plus an octave. Listen for the simple interval above the octave, name it, then add 7 to its number; the quality stays the same.',
        params: {
          earMode: 'interval',
          harmonic: true,
          roots: ['C', 'D', 'E', 'F'],
          accidentals: ['', '', '', ''],
          intervals: [13, 14, 16, 17],
          directions: ['ascending'],
          octaves: [3],
        },
      },
    ],
    targetCount: 7,
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
        hintTemplate: 'Major scale: W-W-H-W-W-W-H (bright, resolved). Natural minor: W-H-W-W-H-W-W (dark, open). Harmonic minor: raises the 7th, creating a distinctive step-and-a-half gap. Melodic minor (ascending): raises both the 6th and the 7th — minor at the bottom, major at the top.',
        nudgeTemplate: 'First the 3rd: 4 or 3 half steps above the tonic? If 3, follow the last notes up to the tonic: is the 7th a whole step or a half step below it, and is there a step-and-a-half gap just before the 7th?',
        params: {
          earMode: 'scale',
          roots: ['C', 'G', 'D', 'F', 'A', 'E', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          octaves: [4],
          scaleTypes: ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor'],
        },
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
        hintTemplate: 'Mode identifiers: Dorian = natural 6 in a minor context, Phrygian = b2, Lydian = #4, Mixolydian = b7 in a major context, Locrian = b2 and b5 (the darkest).',
        nudgeTemplate: 'First the 3rd: 4 or 3 half steps above the tonic? Then compare with the major scale (if 4) or the natural minor (if 3) and find what differs: a lowered 2nd (alone, or with a lowered 5th too), a raised 4th, a raised 6th or a lowered 7th?',
        params: {
          earMode: 'scale',
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          octaves: [4],
          scaleTypes: ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'],
        },
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
        hintTemplate: 'Pentatonic scales have five notes and no half-step tension. The blues scale adds the "blue note" (b5). The whole-tone scale is all whole steps — dreamlike and rootless. The diminished (half-whole) scale alternates half and whole steps — eight notes, symmetric and tense.',
        nudgeTemplate: 'Count the notes and the half steps: five notes with no half steps, six notes all a whole step apart, six with a chromatic note between the 4th and 5th, or eight alternating half and whole steps? If five, check whether the 3rd is 4 or 3 half steps above the tonic.',
        params: {
          earMode: 'scale',
          roots: ['C', 'D', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', ''],
          octaves: [4],
          scaleTypes: ['pentatonic_major', 'pentatonic_minor', 'blues', 'whole_tone', 'diminished_half_whole'],
        },
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
        nudgeTemplate: 'Hear the triad as two stacked 3rds, from the bottom up: 4 + 3, 3 + 4, 3 + 3 or 4 + 4 half steps? Check the outer 5th as well: perfect, or a half step narrower or wider?',
        params: {
          earMode: 'chord',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major', 'minor', 'diminished', 'augmented'],
        },
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
        hintTemplate: 'maj7 = dreamy/lush. min7 = mellow/warm. dom7 = bright/needs resolution. half-dim7 = dark/unresolved. dim7 = very tense. minor-major 7th = a dark minor triad under a bright major 7th, unsettling.',
        nudgeTemplate: 'Hear it in two layers. The triad: is the 3rd 4 or 3 half steps above the root, and is the 5th perfect or a half step lower? The 7th: is it 1, 2 or 3 half steps below the octave?',
        params: {
          earMode: 'chord',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major7', 'minor7', 'dominant7', 'half_diminished7', 'diminished7', 'minor_major7'],
        },
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
        promptTemplate: 'Listen to this note and identify it. Most notes in this set are sharps.',
        hintTemplate: 'Sharps such as C#, F# and G# lie outside C major; in a C major melody they would be chromatic notes, pulling toward a neighbouring scale note.',
        nudgeTemplate: 'Start from the reference note you hear first and sing up one half step at a time, counting, until you reach the note. Then place it on the keyboard: a black key takes its name from the white key just below it, plus a sharp.',
        params: {
          earMode: 'note',
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['#', '#', '', '#', '#', '#', ''],
          octaves: [4],
        },
      },
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this interval, played {direction}, and identify it.',
        hintTemplate: 'Count the half steps: minor 2nd = 1, minor 3rd = 3, tritone = 6, minor 6th = 8, minor 7th = 10, major 7th = 11. Measured up from a major-key tonic, the first five are exactly the notes outside the scale (b2, b3, #4, b6, b7).',
        nudgeTemplate: 'Sing from the lower note up to the upper one and count the half steps. For a wide leap, measure instead how far it falls short of an octave, then work back to its size.',
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
        nudgeTemplate: 'Listen to where it stops: on the home chord, on a minor chord where home was expected, or on an open chord that leaves things hanging? If it reaches home, does it arrive with the strong pull of the dominant or with the softer "Amen" sound?',
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
      },
      {
        type: 'ear_training',
        promptTemplate: 'Listen to this chord progression in C major and identify the Roman numeral pattern.',
        hintTemplate: 'Focus on the bass motion and the quality of each chord. Common progressions: I-IV-V-I (basic), I-V-vi-IV (pop), ii-V-I (jazz), I-vi-IV-V (50s).',
        nudgeTemplate: 'Count the chords (three or four?) and listen for minor chords: is there none, or does one come first, second or third? Then follow the bass to tell the major chords apart.',
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
        hintTemplate: 'Mentally sing the scale starting from {root} using solfege or numbers before selecting notes. Listen for the pattern of whole and half steps that gives the {scaleType} scale its sound.',
        params: {
          roots: ['C', 'G', 'F', 'D', 'A'],
          accidentals: ['', '', '', '', ''],
          scaleTypes: ['major', 'natural_minor'],
          noteCounts: [7],
        },
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
