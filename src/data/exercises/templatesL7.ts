import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 7 Templates — 16 modules, ~85 generated exercises
// Focus: Jazz chord symbols, ii-V-I, modal harmony, pop analysis,
//        scale/chord taxonomy
// ---------------------------------------------------------------------------

const ALL_ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 21: Jazz Harmony
  // =========================================================================

  // ---- l7u21m1: Jazz Chord Symbols/Extensions ----
  {
    moduleId: 'l7u21m1',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root} {quality} chord. Select all the required notes for this extended chord.',
        hintTemplate: 'Jazz extensions stack 3rds above the 7th: 9th = 2nd up an octave, 11th = 4th up, 13th = 6th up. Build from {root}.',
        params: {
          roots: ALL_ROOTS,
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major7', 'minor7', 'dominant7'],
          noteCounts: [4],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Decode this jazz chord symbol.',
        hintTemplate: 'Jazz symbols: triangle/maj7 = major 7, - or m = minor, 7 = dominant, ° = diminished, ø = half-diminished, + = augmented, sus = suspended.',
        params: {
          choiceSets: [
            [
              { label: 'C13 implies a dominant 7th chord with added 9th, 11th (usually omitted), and 13th', correct: true },
              { label: 'C13 has only root and 13th', correct: false },
              { label: 'C13 is a major 7th chord', correct: false },
              { label: 'C13 implies a minor chord', correct: false },
            ],
            [
              { label: 'Cmin7(b5) is the same as Cø (C half-diminished)', correct: true },
              { label: 'Cmin7(b5) is a fully diminished chord', correct: false },
              { label: 'Cmin7(b5) is a minor 7th chord', correct: false },
              { label: 'The b5 makes it an augmented chord', correct: false },
            ],
            [
              { label: 'C7(#9) is a dominant chord with an augmented 9th, often called the "Hendrix chord"', correct: true },
              { label: 'C7(#9) is a major 7th chord', correct: false },
              { label: 'The #9 means the 9th is sharpened above a major 9th', correct: false },
              { label: 'C7(#9) has no 7th', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u21m2: Shell Voicings ----
  {
    moduleId: 'l7u21m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which set of three notes is the correct shell voicing?',
        hintTemplate: 'A shell voicing uses only root, 3rd, and 7th — the 5th is omitted. The 3rd defines the chord quality (major/minor); the 7th defines the 7th-chord type (major7 / minor7 / dominant7).',
        params: {
          choiceSets: [
            [
              { label: 'Cmaj7 shell: C, E, B', correct: true },
              { label: 'Cmaj7 full: C, E, G, B', correct: false },
              { label: 'Cmaj7 without the 3rd: C, G, B', correct: false },
              { label: 'Cmaj7 without the 7th: C, E, G', correct: false },
            ],
            [
              { label: 'Dm7 shell: D, F, C', correct: true },
              { label: 'Dm7 full: D, F, A, C', correct: false },
              { label: 'Dm7 without the 3rd: D, A, C', correct: false },
              { label: 'Dm7 without the 7th: D, F, A', correct: false },
            ],
            [
              { label: 'G7 shell: G, B, F', correct: true },
              { label: 'G7 full: G, B, D, F', correct: false },
              { label: 'G7 without the 3rd: G, D, F', correct: false },
              { label: 'G7 without the 7th: G, B, D', correct: false },
            ],
            [
              { label: 'Fmaj7 shell: F, A, E', correct: true },
              { label: 'Fmaj7 full: F, A, C, E', correct: false },
              { label: 'Fmaj7 without the 3rd: F, C, E', correct: false },
              { label: 'Fmaj7 without the 7th: F, A, C', correct: false },
            ],
            [
              { label: 'Am7 shell: A, C, G', correct: true },
              { label: 'Am7 full: A, C, E, G', correct: false },
              { label: 'Am7 without the 3rd: A, E, G', correct: false },
              { label: 'Am7 without the 7th: A, C, E', correct: false },
            ],
            [
              { label: 'E7 shell: E, G#, D', correct: true },
              { label: 'E7 full: E, G#, B, D', correct: false },
              { label: 'E7 without the 3rd: E, B, D', correct: false },
              { label: 'E7 without the 7th: E, G#, B', correct: false },
            ],
            [
              { label: 'Bbmaj7 shell: Bb, D, A', correct: true },
              { label: 'Bbmaj7 full: Bb, D, F, A', correct: false },
              { label: 'Bbmaj7 without the 3rd: Bb, F, A', correct: false },
              { label: 'Bbmaj7 without the 7th: Bb, D, F', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How do shell voicings connect in a jazz context?',
        hintTemplate: 'In ii-V-I, the 3rd of one chord becomes the 7th of the next and vice versa. This voice-leading efficiency is called guide-tone lines.',
        params: {
          choiceSets: [
            [
              { label: 'Guide tones (3rds and 7ths) connect smoothly by step between chords in a ii-V-I', correct: true },
              { label: 'Shell voicings require large leaps between chords', correct: false },
              { label: 'Guide tones are the root and 5th', correct: false },
              { label: 'Voice leading does not matter in jazz', correct: false },
            ],
            [
              { label: 'The 3rd of ii becomes the 7th of V, and the 7th of ii becomes the 3rd of V', correct: true },
              { label: 'All notes stay the same between ii and V', correct: false },
              { label: 'The root of ii becomes the root of V', correct: false },
              { label: 'No voice-leading connection exists between ii and V', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u21m3: ii-V-I Progression ----
  {
    moduleId: 'l7u21m3',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build a minor 7th chord on {root} — the ii7 sound of a ii-V-I progression.',
        hintTemplate: 'A ii7 is a minor 7th chord on {root}: root + minor 3rd + perfect 5th + minor 7th. In jazz, ii-V-I is the most fundamental progression.',
        params: {
          roots: ['C', 'G', 'F', 'D', 'A', 'E', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          chordQualities: ['minor7'],
          noteCounts: [4],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze the ii-V-I progression in this context.',
        hintTemplate: 'ii-V-I in major: min7 -> dom7 -> maj7. In minor: min7b5 -> dom7(b9) -> min(maj7). This is the backbone of jazz harmony.',
        params: {
          choiceSets: [
            [
              { label: 'In minor keys, the ii chord is half-diminished (min7b5)', correct: true },
              { label: 'In minor keys, the ii chord is a minor 7th', correct: false },
              { label: 'Minor keys do not use ii-V-I', correct: false },
              { label: 'The ii in minor is a major 7th', correct: false },
            ],
            [
              { label: 'ii-V-I can be used to tonicize any chord, creating transient key centers', correct: true },
              { label: 'ii-V-I only works in the home key', correct: false },
              { label: 'ii-V-I cannot create tonicization', correct: false },
              { label: 'Only V-I creates tonicization in jazz', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u21m4: Tritone Substitution ----
  {
    moduleId: 'l7u21m4',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the tritone substitution for the dominant 7th on {root}. Replace it with a dom7 a tritone away.',
        hintTemplate: 'The tritone sub replaces a dom7 with another dom7 whose root is a tritone (6 semitones) away. Both share the same guide tones (3rd and 7th swap).',
        params: {
          roots: ['D', 'A', 'E', 'G', 'C', 'F', 'B'],
          accidentals: ['b', 'b', 'b', 'b', 'b', '#', ''],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Explain why tritone substitution works.',
        hintTemplate: 'Two dom7 chords a tritone apart share the same tritone interval (3rd and 7th swap). This creates chromatic bass motion: bII7 -> I instead of V7 -> I.',
        params: {
          choiceSets: [
            [
              { label: 'The 3rd and 7th of the original V7 become the 7th and 3rd of the tritone sub', correct: true },
              { label: 'Tritone subs share the same root', correct: false },
              { label: 'The two chords share no common tones', correct: false },
              { label: 'Tritone subs only work in minor keys', correct: false },
            ],
            [
              { label: 'The tritone sub creates a chromatic bass line: bII -> I (half step resolution)', correct: true },
              { label: 'The bass moves by a whole step', correct: false },
              { label: 'The bass always leaps a 5th', correct: false },
              { label: 'The bass motion is the same as V-I', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u21m5: Blues Forms ----
  {
    moduleId: 'l7u21m5',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale used in blues improvisation.',
        hintTemplate: 'The blues scale: root, b3, 4, b5, 5, b7 (6 notes). The pentatonic minor: root, b3, 4, 5, b7 (5 notes). Build from {root}.',
        params: {
          roots: ['C', 'G', 'A', 'E', 'D', 'F', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          scaleTypes: ['blues', 'pentatonic_minor'],
          noteCounts: [6, 5],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze the structure of a blues form.',
        hintTemplate: 'The 12-bar blues: I7 (4 bars), IV7 (2 bars), I7 (2 bars), V7 (1), IV7 (1), I7 (2). Jazz blues adds ii-V motion and tritone subs.',
        params: {
          choiceSets: [
            [
              { label: 'The basic 12-bar blues uses I7, IV7, and V7 as its primary chords', correct: true },
              { label: 'The 12-bar blues uses only major 7th chords', correct: false },
              { label: 'The 12-bar blues is 16 bars long', correct: false },
              { label: 'The blues form uses only the I chord', correct: false },
            ],
            [
              { label: 'Jazz blues often adds a ii-V to bar 4 (targeting IV7) and bars 9-10 (targeting I)', correct: true },
              { label: 'Jazz blues removes all dominant chords', correct: false },
              { label: 'Jazz blues never modifies the basic form', correct: false },
              { label: 'Jazz blues uses the same chords as basic blues', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l7u21m6: Rhythm Changes ----
  {
    moduleId: 'l7u21m6',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze the rhythm changes form.',
        hintTemplate: 'Rhythm changes (from Gershwin\'s "I Got Rhythm"): AABA form, 32 bars. A sections: I-vi-ii-V turnarounds. Bridge: III7-VI7-II7-V7 (cycle of dominants).',
        params: {
          choiceSets: [
            [
              { label: 'Rhythm changes A section is built on I-vi-ii-V turnarounds in Bb major', correct: true },
              { label: 'Rhythm changes uses 12-bar blues form', correct: false },
              { label: 'The A section is in C major', correct: false },
              { label: 'Rhythm changes has no standard key', correct: false },
            ],
            [
              { label: 'The bridge of rhythm changes uses a cycle of dominant 7th chords descending by 5ths', correct: true },
              { label: 'The bridge stays on one chord', correct: false },
              { label: 'The bridge uses minor 7th chords', correct: false },
              { label: 'The bridge is identical to the A section', correct: false },
            ],
            [
              { label: 'Rhythm changes form is AABA, totaling 32 bars', correct: true },
              { label: 'Rhythm changes is 12 bars', correct: false },
              { label: 'Rhythm changes is ABAB form', correct: false },
              { label: 'Rhythm changes has no fixed form', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 22: Modal and Pop Harmony
  // =========================================================================

  // ---- l7u22m1: Modal Scales and Characteristics ----
  {
    moduleId: 'l7u22m1',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale.',
        hintTemplate: 'The modes: Ionian (major), Dorian (b3, b7), Phrygian (b2, b3, b6, b7), Lydian (#4), Mixolydian (b7), Aeolian (natural minor), Locrian (b2, b3, b5, b6, b7).',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          scaleTypes: ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'],
          noteCounts: [7],
        },
        points: 2,
      },
    ],
    targetCount: 6,
  },

  // ---- l7u22m2: Modal Harmony and Vamps ----
  {
    moduleId: 'l7u22m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the characteristic chord or vamp that establishes this mode.',
        hintTemplate: 'Each mode has a characteristic note that distinguishes it. Dorian: natural 6. Phrygian: b2. Lydian: #4. Mixolydian: b7. Modal vamps emphasize these notes.',
        params: {
          choiceSets: [
            [
              { label: 'Dorian is distinguished from natural minor by its raised (natural) 6th degree', correct: true },
              { label: 'Dorian has a raised 7th', correct: false },
              { label: 'Dorian has a lowered 4th', correct: false },
              { label: 'Dorian is identical to natural minor', correct: false },
            ],
            [
              { label: 'Lydian is distinguished from major by its raised 4th degree (#4)', correct: true },
              { label: 'Lydian has a lowered 7th', correct: false },
              { label: 'Lydian has a lowered 3rd', correct: false },
              { label: 'Lydian is identical to major', correct: false },
            ],
            [
              { label: 'A D Dorian vamp (Dm7 - G7) emphasizes the natural 6th (B natural over D)', correct: true },
              { label: 'D Dorian uses Bb', correct: false },
              { label: 'D Dorian vamps use only one chord', correct: false },
              { label: 'Dorian vamps avoid the 6th degree', correct: false },
            ],
            [
              { label: 'Phrygian is characterized by the b2 interval, giving it a Spanish/flamenco flavor', correct: true },
              { label: 'Phrygian sounds identical to major', correct: false },
              { label: 'Phrygian has a raised 4th', correct: false },
              { label: 'Phrygian is the brightest mode', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u22m3: Modal Interchange in Pop ----
  {
    moduleId: 'l7u22m3',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build a {quality} triad on {root} — a chord pop music borrows from a parallel mode.',
        hintTemplate: 'Pop music frequently borrows chords from parallel modes: bVII from Mixolydian, bIII from Dorian/minor, iv from Aeolian. Build a {quality} triad on {root}.',
        params: {
          roots: ['B', 'E', 'A', 'D', 'G', 'C', 'F'],
          accidentals: ['b', 'b', 'b', '', '', '', ''],
          chordQualities: ['major', 'major', 'major', 'minor', 'major', 'minor', 'major'],
          noteCounts: [3],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the modal interchange used in this pop progression.',
        hintTemplate: 'Common modal interchange in pop: I - bVII - IV (Mixolydian bVII), I - bVI - bVII (Aeolian bVI, bVII), I - iv (Aeolian iv).',
        params: {
          choiceSets: [
            [
              { label: 'The bVII chord in a major key is borrowed from Mixolydian mode', correct: true },
              { label: 'bVII comes from Lydian mode', correct: false },
              { label: 'bVII is a diatonic chord in major', correct: false },
              { label: 'bVII is borrowed from Locrian', correct: false },
            ],
            [
              { label: 'The iv chord in a major key is borrowed from the parallel minor (Aeolian)', correct: true },
              { label: 'iv is diatonic in major keys', correct: false },
              { label: 'iv is borrowed from Lydian', correct: false },
              { label: 'iv does not exist as a borrowed chord', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u22m4: Pop Progressions (Nashville Numbers) ----
  {
    moduleId: 'l7u22m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze this common pop chord progression.',
        hintTemplate: 'Nashville Number System uses scale degrees: 1=I, 4=IV, 5=V, 6m=vi. Common: 1-5-6m-4, 1-4-5-1, 6m-4-1-5.',
        params: {
          choiceSets: [
            [
              { label: 'I-V-vi-IV is the most common pop progression, used in hundreds of songs', correct: true },
              { label: 'I-V-vi-IV is unique to classical music', correct: false },
              { label: 'This progression is rarely used in pop', correct: false },
              { label: 'I-V-vi-IV always sounds the same in every key', correct: false },
            ],
            [
              { label: 'vi-IV-I-V is the "sensitive" rotation of the same I-V-vi-IV progression', correct: true },
              { label: 'vi-IV-I-V is an entirely different progression', correct: false },
              { label: 'vi-IV-I-V does not work as a pop progression', correct: false },
              { label: 'Starting on vi makes it a minor key progression', correct: false },
            ],
            [
              { label: 'The Nashville Number System represents chords by scale degree number for easy transposition', correct: true },
              { label: 'Nashville numbers represent specific pitches', correct: false },
              { label: 'Nashville numbers are only for country music', correct: false },
              { label: 'Nashville numbers replace traditional notation entirely', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u22m5: Planing and Quartal Harmony ----
  {
    moduleId: 'l7u22m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Describe this harmonic technique used in modern and jazz contexts.',
        hintTemplate: 'Planing: moving a chord shape in parallel (diatonic or chromatic). Quartal harmony: chords built from stacked 4ths instead of 3rds, common in jazz and modal music.',
        params: {
          choiceSets: [
            [
              { label: 'Quartal harmony stacks perfect 4ths instead of 3rds, creating an open, ambiguous sound', correct: true },
              { label: 'Quartal harmony uses only major 3rds', correct: false },
              { label: 'Quartal harmony is the same as traditional triadic harmony', correct: false },
              { label: 'Quartal chords are always dissonant', correct: false },
            ],
            [
              { label: 'Planing (parallelism) moves a chord voicing up or down while maintaining the same intervals', correct: true },
              { label: 'Planing always uses contrary motion', correct: false },
              { label: 'Planing is prohibited in all musical styles', correct: false },
              { label: 'Planing changes the chord quality at each step', correct: false },
            ],
            [
              { label: 'Diatonic planing keeps all notes within the key; chromatic planing maintains exact intervals', correct: true },
              { label: 'Diatonic and chromatic planing are identical', correct: false },
              { label: 'Chromatic planing stays within one key', correct: false },
              { label: 'Diatonic planing uses all 12 chromatic notes', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 23: Scale/Chord Taxonomy
  // =========================================================================

  // ---- l7u23m1: Pentatonic and Blues Scales ----
  {
    moduleId: 'l7u23m1',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale.',
        hintTemplate: 'Pentatonic major: 1-2-3-5-6 (5 notes). Pentatonic minor: 1-b3-4-5-b7 (5 notes). Blues: 1-b3-4-b5-5-b7 (6 notes). Build from {root}.',
        params: {
          roots: ['C', 'G', 'A', 'D', 'E', 'F', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          scaleTypes: ['pentatonic_major', 'pentatonic_minor', 'blues'],
          noteCounts: [5, 5, 6],
        },
        points: 2,
      },
    ],
    targetCount: 6,
  },

  // ---- l7u23m2: Symmetric Scales ----
  {
    moduleId: 'l7u23m2',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale.',
        hintTemplate: 'Whole-tone: all whole steps (6 notes). Chromatic: all half steps (12 notes). These are symmetric scales — they sound the same from any starting note within the scale.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['whole_tone', 'chromatic'],
          noteCounts: [6, 12],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // ---- l7u23m3: Bebop and Jazz Scales ----
  {
    moduleId: 'l7u23m3',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale.',
        hintTemplate: 'Dorian: 1-2-b3-4-5-6-b7 (7 notes). Mixolydian: 1-2-3-4-5-6-b7 (7 notes). These modes are the basis of many jazz improvisations.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          scaleTypes: ['dorian', 'mixolydian'],
          noteCounts: [7],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which scale works best over this chord type?',
        hintTemplate: 'min7 -> Dorian. dom7 -> Mixolydian. maj7 -> Ionian or Lydian. min7b5 -> Locrian. dim7 -> diminished (WH). alt dom -> altered scale.',
        params: {
          choiceSets: [
            [
              { label: 'Dorian is the primary scale choice for minor 7th chords in jazz', correct: true },
              { label: 'Ionian is the standard choice for minor 7th chords', correct: false },
              { label: 'Locrian is used over minor 7th chords', correct: false },
              { label: 'Lydian is the default for minor 7th chords', correct: false },
            ],
            [
              { label: 'Mixolydian is the primary scale choice for dominant 7th chords', correct: true },
              { label: 'Dorian is used over dominant 7th chords', correct: false },
              { label: 'Aeolian is the default for dominant 7th chords', correct: false },
              { label: 'Phrygian is standard for dominant 7th chords', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u23m4: Chord-Scale Theory ----
  {
    moduleId: 'l7u23m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Match the chord type to its primary scale in chord-scale theory.',
        hintTemplate: 'Chord-scale theory: each chord has a parent scale. Avoid notes are half steps above chord tones. The scale colors the chord with available tensions.',
        params: {
          choiceSets: [
            [
              { label: 'Lydian is often preferred over Ionian for maj7 chords because it has no avoid notes', correct: true },
              { label: 'Ionian has no avoid notes over maj7', correct: false },
              { label: 'Locrian is preferred for maj7 chords', correct: false },
              { label: 'Avoid notes are irrelevant in chord-scale theory', correct: false },
            ],
            [
              { label: 'An "avoid note" is a scale degree that clashes (is a half step above) a chord tone', correct: true },
              { label: 'An avoid note is any note not in the chord', correct: false },
              { label: 'Avoid notes create consonance', correct: false },
              { label: 'There are no avoid notes in any scale', correct: false },
            ],
            [
              { label: 'Locrian is the primary scale for half-diminished (min7b5) chords', correct: true },
              { label: 'Dorian is used for half-diminished chords', correct: false },
              { label: 'Mixolydian is used for half-diminished chords', correct: false },
              { label: 'Half-diminished chords have no associated scale', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u23m5: Exotic and Non-Western Scales ----
  {
    moduleId: 'l7u23m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify this scale or its cultural context.',
        hintTemplate: 'Harmonic minor has an "exotic" sound from the augmented 2nd. Phrygian dominant (5th mode of harmonic minor) is used in flamenco and Middle Eastern music.',
        params: {
          choiceSets: [
            [
              { label: 'The Phrygian dominant scale (1-b2-3-4-5-b6-b7) is the 5th mode of harmonic minor', correct: true },
              { label: 'Phrygian dominant is the same as regular Phrygian', correct: false },
              { label: 'Phrygian dominant has a minor 3rd', correct: false },
              { label: 'Phrygian dominant is a whole-tone scale', correct: false },
            ],
            [
              { label: 'The Hungarian minor scale has two augmented 2nds, creating its distinctive dramatic sound', correct: true },
              { label: 'Hungarian minor is identical to natural minor', correct: false },
              { label: 'Hungarian minor has no augmented intervals', correct: false },
              { label: 'Hungarian minor is the same as melodic minor', correct: false },
            ],
            [
              { label: 'The Japanese Hirajoshi scale is a 5-note scale with a distinctive minor quality', correct: true },
              { label: 'Hirajoshi is a 7-note scale', correct: false },
              { label: 'Hirajoshi is identical to the Western major scale', correct: false },
              { label: 'Hirajoshi uses quarter tones', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },
];

export default templates;
