import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 7 Templates — 16 modules
// Focus: Jazz chord symbols, ii-V-I, modal harmony, pop analysis,
//        scale/chord taxonomy
// Each block practises its own module (W4-01, 2026-10-31): the blocks had
// drifted one or two modules from the curriculum they were written for.
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
        promptTemplate: 'Build the {root} {quality} chord. Select every note, including the 9th above the 7th.',
        hintTemplate: 'Jazz extensions stack 3rds above the 7th: 9th = 2nd up an octave, 11th = 4th up, 13th = 6th up. Build from {root}.',
        params: {
          roots: ALL_ROOTS,
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major9', 'minor9', 'dominant9'],
          noteCounts: [5],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about jazz chord symbols is true?',
        hintTemplate: 'Jazz symbols: triangle/maj7 = major 7, - or m = minor, 7 = dominant, ° = diminished, ø = half-diminished, + = augmented, sus = suspended.',
        params: {
          choiceSets: [
            [
              { label: 'C13 implies a dominant 7th chord with added 9th, 11th (usually omitted), and 13th', correct: true },
              { label: 'C13 has only root and 13th', correct: false },
              { label: 'C13 is a C major triad with only the 13th (A) added on top and no 7th anywhere in the chord', correct: false },
              { label: 'C13 implies a minor chord', correct: false },
            ],
            [
              { label: 'Cmin7(b5) is the same as Cø (C half-diminished)', correct: true },
              { label: 'Cmin7(b5) is a fully diminished seventh chord, exactly the same chord as Cdim7 (C°7)', correct: false },
              { label: 'Cmin7(b5) is a minor 7th chord', correct: false },
              { label: 'The b5 makes it an augmented chord', correct: false },
            ],
            [
              { label: 'C7(#9) is a dominant chord with an augmented 9th, often called the "Hendrix chord"', correct: true },
              { label: 'C7(#9) is a major 7th chord', correct: false },
              { label: 'In C7(#9) the sharp 9th (D#) replaces the major 3rd, so the chord contains no E at all', correct: false },
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
        hintTemplate: 'A shell voicing uses only root, 3rd, and 7th — the 5th is omitted. The 3rd defines the chord quality (major/minor); the 7th defines the 7th-chord type (maj7 / m7 / dom7).',
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
        hintTemplate: 'In ii-V-I, the 3rd of ii is held as the 7th of V, while the 7th of ii falls a half step to the 3rd of V (and the same happens again from V to I). This voice-leading efficiency is called guide-tone lines.',
        params: {
          choiceSets: [
            [
              { label: 'Guide tones (3rds and 7ths) connect smoothly by step between chords in a ii-V-I', correct: true },
              { label: 'Shell voicings require large leaps between chords', correct: false },
              { label: 'Shell voicings move every voice by a large leap, because the 3rd and 7th never stay put from chord to chord', correct: false },
              { label: 'Voice leading does not matter in jazz', correct: false },
            ],
            [
              { label: 'The 3rd of ii is held as the 7th of V, and the 7th of ii falls a half step to the 3rd of V', correct: true },
              { label: 'Every note of ii is kept unchanged in V, since Dm7 and G7 share all four of their chord tones', correct: false },
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
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the ii-V-I progression is true?',
        hintTemplate: 'ii-V-I in major: min7 -> dom7 -> maj7. In minor: min7b5 -> dom7(b9) -> min(maj7). This is the backbone of jazz harmony.',
        params: {
          choiceSets: [
            [
              { label: 'In minor keys, the ii chord is half-diminished (min7b5)', correct: true },
              { label: 'In minor keys, the ii chord is a minor 7th', correct: false },
              { label: 'Minor keys do not use ii-V-I', correct: false },
              { label: 'In minor keys the ii chord is a major 7th chord, built on the raised 2nd degree', correct: false },
            ],
            [
              { label: 'ii-V-I can be used to tonicize any chord, creating transient key centers', correct: true },
              { label: 'ii-V-I only ever works in the home key; aiming it at any other chord is a voice-leading error', correct: false },
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
        promptTemplate: 'Build the tritone substitute for the V7 of {key} major.',
        hintTemplate: 'The V7 of {key} is built a perfect 5th above {key}. Its tritone substitute is the dominant 7th a tritone (6 semitones) away from that V7: {root}7, which slides down a half step to {key}.',
        params: {
          // root = ♭II of the key (V7 root + 6 semitones); keys whose ♭II needs no double flat
          roots: ['D', 'A', 'E', 'B', 'F', 'G', 'C'],
          accidentals: ['b', 'b', 'b', 'b', '', 'b', ''],
          keys: ['C', 'G', 'D', 'A', 'E', 'F', 'B'],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Tritone substitution: why does it work, and what does it change?',
        hintTemplate: 'Two dom7 chords a tritone apart share the same tritone interval (3rd and 7th swap). This creates chromatic bass motion: bII7 -> I instead of V7 -> I.',
        params: {
          choiceSets: [
            [
              { label: 'The 3rd and 7th of the original V7 become the 7th and 3rd of the tritone sub', correct: true },
              { label: 'Tritone subs share the same root', correct: false },
              { label: 'The two dominant chords share no notes at all, which is exactly why the substitution sounds so fresh', correct: false },
              { label: 'Tritone subs only work in minor keys', correct: false },
            ],
            [
              { label: 'The tritone sub creates a chromatic bass line: bII -> I (half step resolution)', correct: true },
              { label: 'The bass moves by a whole step', correct: false },
              { label: 'The bass of the substitute still falls a perfect 5th to the tonic, exactly as it does in V7-I', correct: false },
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
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze the structure of a blues form.',
        hintTemplate: 'The 12-bar blues: I7 (4 bars), IV7 (2 bars), I7 (2 bars), V7 (1), IV7 (1), I7 (2). Jazz blues adds ii-V motion and tritone subs.',
        params: {
          choiceSets: [
            [
              { label: 'The basic 12-bar blues uses I7, IV7, and V7 as its primary chords', correct: true },
              { label: 'The basic 12-bar blues uses only major 7th chords: Imaj7, IVmaj7 and Vmaj7 throughout', correct: false },
              { label: 'The 12-bar blues is 16 bars long', correct: false },
              { label: 'The blues form uses only the I chord', correct: false },
            ],
            [
              { label: 'Jazz blues often adds a ii-V to bar 4 (targeting IV7) and bars 9-10 (targeting I)', correct: true },
              { label: 'Jazz blues removes every dominant chord and replaces the whole form with a single minor vamp', correct: false },
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
              { label: 'Rhythm changes follows the 12-bar blues form, with its turnaround heard only in the final bar', correct: false },
              { label: 'The A section is in C major', correct: false },
              { label: 'Rhythm changes has no standard key', correct: false },
            ],
            [
              { label: 'The bridge of rhythm changes uses a cycle of dominant 7th chords descending by 5ths', correct: true },
              { label: 'The bridge stays on one chord', correct: false },
              { label: 'The bridge of rhythm changes stays on a single minor 7th chord for all eight of its bars', correct: false },
              { label: 'The bridge is identical to the A section', correct: false },
            ],
            [
              { label: 'Rhythm changes form is AABA, totaling 32 bars', correct: true },
              { label: 'Rhythm changes is 12 bars', correct: false },
              { label: 'Rhythm changes is a 12-bar form that alternates two blues choruses (ABAB)', correct: false },
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

  // ---- l7u22m1: Chord-Scale Theory ----
  {
    moduleId: 'l7u22m1',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale.',
        hintTemplate: 'The modes: Ionian (major), Dorian (b3, b7), Phrygian (b2, b3, b6, b7), Lydian (#4), Mixolydian (b7), Aeolian (natural minor), Locrian (b2, b3, b5, b6, b7).',
        params: {
          roots: ALL_ROOTS,
          accidentals: ['', '', '', '', '', '', ''],
          scaleTypes: ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'],
          noteCounts: [7],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which chord-scale pairing is correct?',
        hintTemplate: 'min7 -> Dorian. dom7 -> Mixolydian. maj7 -> Ionian or Lydian. min7b5 -> Locrian (or Locrian natural 2). An avoid note is a scale note a half step above a chord tone.',
        params: {
          choiceSets: [
            [
              { label: 'Dorian is the primary scale choice for minor 7th chords in jazz', correct: true },
              { label: 'Ionian is the standard choice for minor 7th chords', correct: false },
              { label: 'Locrian is the standard choice over a minor 7th chord, because its b5 matches the chord\'s 5th', correct: false },
              { label: 'Lydian is the default for minor 7th chords', correct: false },
            ],
            [
              { label: 'Mixolydian is the primary scale choice for dominant 7th chords', correct: true },
              { label: 'Dorian is used over dominant 7th chords', correct: false },
              { label: 'Aeolian is the standard choice over a dominant 7th chord, because its b3 suits the chord\'s 3rd', correct: false },
              { label: 'Phrygian is standard for dominant 7th chords', correct: false },
            ],
            [
              { label: 'Lydian is often preferred over Ionian for maj7 chords because it has no avoid notes', correct: true },
              { label: 'Ionian has no avoid notes over maj7, since its 4th lies a whole step above the chord\'s 3rd', correct: false },
              { label: 'Locrian is preferred for maj7 chords', correct: false },
              { label: 'Avoid notes are irrelevant in chord-scale theory', correct: false },
            ],
            [
              { label: 'An "avoid note" is a scale note a half step above a chord tone, so it clashes with it', correct: true },
              { label: 'An "avoid note" is any scale note that is not in the chord, so every 9th, 11th and 13th is one', correct: false },
              { label: 'Avoid notes create consonance', correct: false },
              { label: 'There are no avoid notes in any scale', correct: false },
            ],
            [
              { label: 'Locrian, or Locrian ♮2 (melodic minor mode 6), fits half-diminished (m7b5) chords', correct: true },
              { label: 'Dorian is the scale for half-diminished chords, because its natural 6th matches the chord\'s b5', correct: false },
              { label: 'Mixolydian is used for half-diminished chords', correct: false },
              { label: 'Half-diminished chords have no associated scale', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l7u22m2: Upper Structures and Reharmonization ----
  {
    moduleId: 'l7u22m2',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the upper-structure triad that sits over {key}7 and supplies its 9th, #11 and 13th.',
        hintTemplate: 'The 9th of {key}7 lies a whole step above {key}. The major triad on that note, {root}, holds the 9th (its root), the #11 (its 3rd) and the 13th (its 5th).',
        params: {
          // root = a whole step above the dominant's root (key): the II major triad
          roots: ['D', 'G', 'A', 'E', 'B', 'C'],
          accidentals: ['', '', '', '', '', ''],
          keys: ['C', 'F', 'G', 'D', 'A', 'Bb'],
          chordQualities: ['major'],
          noteCounts: [3],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about upper structures and reharmonization is true?',
        hintTemplate: 'An upper-structure triad sits over the dominant\'s shell (root, 3rd, b7); name its notes by their interval above the bass. Reharmonization swaps chords for others that still support the melody, often within the same function.',
        params: {
          choiceSets: [
            [
              { label: 'A D major triad over C7 supplies the 9th, #11 and 13th (the C13#11 sound)', correct: true },
              { label: 'A D major triad over C7 supplies the b9, #9 and b13', correct: false },
              { label: 'A D major triad over C7 only doubles the chord\'s root, 3rd and 5th, so it adds no colour at all', correct: false },
              { label: 'A D major triad over C7 turns it into a minor chord', correct: false },
            ],
            [
              { label: 'In C major, Em7 can replace Cmaj7: they share E, G and B and both have tonic function', correct: true },
              { label: 'In C major, G7 can replace Cmaj7 because both chords have tonic function and share every one of their notes', correct: false },
              { label: 'Em7 and Cmaj7 share no notes', correct: false },
              { label: 'Only V7 can replace a tonic chord', correct: false },
            ],
            [
              { label: 'Reharmonization replaces the chords under a melody with others that still support its notes', correct: true },
              { label: 'Reharmonization rewrites the melody\'s notes so that they fit the chords the tune already had, leaving the harmony untouched', correct: false },
              { label: 'Reharmonization means transposing a tune to a new key', correct: false },
              { label: 'Reharmonization removes all chords', correct: false },
            ],
            [
              { label: 'C#dim7 between Cmaj7 and Dm7 is a passing chord: the bass rises chromatically C-C#-D', correct: true },
              { label: 'C#dim7 between Cmaj7 and Dm7 is the new tonic, so the tune has modulated to C# minor for good', correct: false },
              { label: 'A passing chord must last a whole section', correct: false },
              { label: 'Passing chords cannot be diminished', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u22m3: Coltrane Changes ----
  {
    moduleId: 'l7u22m3',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'In Coltrane changes each key center is approached by its own V7. Build the V7 that leads into {key} major.',
        hintTemplate: 'A dominant 7th resolves down a perfect 5th: the V7 of {key} is built a 5th above {key}, on {root}.',
        params: {
          // Giant Steps centres B, G, Eb (and the same cycle on C, E, Ab); root = key + perfect 5th
          roots: ['F', 'D', 'B', 'G', 'B', 'E'],
          accidentals: ['#', '', 'b', '', '', 'b'],
          keys: ['B', 'G', 'Eb', 'C', 'E', 'Ab'],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about Coltrane changes is true?',
        hintTemplate: 'Giant Steps: three key centers a major 3rd apart (B, G, Eb), each reached through its own V7. Constant structure moves one chord quality in parallel, whatever the key.',
        params: {
          choiceSets: [
            [
              { label: 'Giant Steps moves through three key centers a major 3rd apart: B, G and Eb', correct: true },
              { label: 'Giant Steps moves through key centers a perfect 5th apart, one step at a time around the circle of fifths', correct: false },
              { label: 'Its key centers are a half step apart', correct: false },
              { label: 'It stays in one key throughout', correct: false },
            ],
            [
              { label: 'Three key centers a major 3rd apart divide the octave into three equal parts', correct: true },
              { label: 'Three key centers a major 3rd apart divide the octave into four equal parts, like a diminished 7th chord', correct: false },
              { label: 'They form a major scale', correct: false },
              { label: 'They never return to the first key', correct: false },
            ],
            [
              { label: 'Constant structure moves one chord quality in parallel, whatever the key (Cmaj7-Dbmaj7-Dmaj7)', correct: true },
              { label: 'Constant structure means one single chord is held for the whole tune while only the melody changes above it', correct: false },
              { label: 'Constant structure uses only diatonic chords', correct: false },
              { label: 'Constant structure forbids parallel motion', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u22m4: Modal Harmony Fundamentals ----
  {
    moduleId: 'l7u22m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about a mode\'s characteristic note is true?',
        hintTemplate: 'Each mode has a characteristic note that distinguishes it. Dorian: natural 6. Phrygian: b2. Lydian: #4. Mixolydian: b7. Modal vamps emphasize these notes.',
        params: {
          choiceSets: [
            [
              { label: 'Dorian is distinguished from natural minor by its raised (natural) 6th degree', correct: true },
              { label: 'Dorian has a raised 7th', correct: false },
              { label: 'Dorian is distinguished from natural minor by a raised 7th degree, which gives it a leading tone', correct: false },
              { label: 'Dorian is identical to natural minor', correct: false },
            ],
            [
              { label: 'Lydian is distinguished from major by its raised 4th degree (#4)', correct: true },
              { label: 'Lydian is distinguished from major by its lowered 7th degree (b7), the note Mixolydian adds', correct: false },
              { label: 'Lydian has a lowered 3rd', correct: false },
              { label: 'Lydian is identical to major', correct: false },
            ],
            [
              { label: 'A D Dorian vamp (Dm7 - G7) emphasizes the natural 6th (B natural over D)', correct: true },
              { label: 'A D Dorian vamp (Dm7 - Gm7) emphasizes Bb, the lowered 6th that gives D Dorian its colour', correct: false },
              { label: 'D Dorian vamps use only one chord', correct: false },
              { label: 'Dorian vamps avoid the 6th degree', correct: false },
            ],
            [
              { label: 'Phrygian is characterized by the b2 interval, giving it a Spanish/flamenco flavor', correct: true },
              { label: 'Phrygian sounds identical to major', correct: false },
              { label: 'Phrygian is characterized by its raised 4th, which makes it the brightest of all the modes', correct: false },
              { label: 'Phrygian has no b2', correct: false },
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
        promptTemplate: 'Which statement about quartal harmony and planing is true?',
        hintTemplate: 'Planing: moving a chord shape in parallel (diatonic or chromatic). Quartal harmony: chords built from stacked 4ths instead of 3rds, common in jazz and modal music.',
        params: {
          choiceSets: [
            [
              { label: 'Quartal harmony stacks perfect 4ths instead of 3rds, creating an open, ambiguous sound', correct: true },
              { label: 'Quartal harmony stacks major 3rds only, which makes it sound exactly like traditional triads', correct: false },
              { label: 'Quartal harmony is the same as traditional triadic harmony', correct: false },
              { label: 'Quartal chords are always dissonant', correct: false },
            ],
            [
              { label: 'Planing (parallelism) moves a whole chord shape up or down so that every voice moves in parallel', correct: true },
              { label: 'Planing always moves the voices in contrary motion, so that the chord shape changes at every step', correct: false },
              { label: 'Planing is prohibited in all musical styles', correct: false },
              { label: 'Planing changes the chord quality at each step', correct: false },
            ],
            [
              { label: 'Diatonic planing keeps all notes within the key; chromatic planing maintains exact intervals', correct: true },
              { label: 'Diatonic and chromatic planing are the same technique, since both keep every single note inside the key', correct: false },
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
  // Unit 23: Scale and Chord Taxonomy
  // =========================================================================

  // ---- l7u23m1: Pop Progressions and Nashville Numbers ----
  {
    moduleId: 'l7u23m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about pop progressions and Nashville numbers is true?',
        hintTemplate: 'Nashville Number System uses scale degrees: 1=I, 4=IV, 5=V, 6m=vi. Common: 1-5-6m-4, 1-4-5-1, 6m-4-1-5.',
        params: {
          choiceSets: [
            [
              { label: 'I-V-vi-IV is the most common pop progression, used in hundreds of songs', correct: true },
              { label: 'I-V-vi-IV belongs to classical chorale writing and is almost never heard in pop songs', correct: false },
              { label: 'This progression is rarely used in pop', correct: false },
              { label: 'I-V-vi-IV always sounds the same in every key', correct: false },
            ],
            [
              { label: 'vi-IV-I-V is the "sensitive" rotation of the same I-V-vi-IV progression', correct: true },
              { label: 'vi-IV-I-V is a completely different progression that shares no chords with I-V-vi-IV', correct: false },
              { label: 'vi-IV-I-V does not work as a pop progression', correct: false },
              { label: 'Starting on vi makes it a minor key progression', correct: false },
            ],
            [
              { label: 'The Nashville Number System represents chords by scale degree number for easy transposition', correct: true },
              { label: 'Nashville numbers name fixed pitches, so a chart written as 1-4-5 can only ever be played in C major', correct: false },
              { label: 'Nashville numbers are only for country music', correct: false },
              { label: 'Nashville numbers replace traditional notation entirely', correct: false },
            ],
          ],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'In {key} major, build the chord written 6m in Nashville numbers.',
        hintTemplate: '6m is the minor chord on scale degree 6 (vi): in {key} major that is {root} minor.',
        params: {
          // root = 6th degree of the key (key + 9 semitones, five letters up)
          roots: ['A', 'E', 'B', 'D', 'F', 'G'],
          accidentals: ['', '', '', '', '#', ''],
          keys: ['C', 'G', 'D', 'F', 'A', 'Bb'],
          chordQualities: ['minor'],
          noteCounts: [3],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u23m2: Modal Mixture and Chromatic Mediants in Pop ----
  {
    moduleId: 'l7u23m2',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'In {key} major, build the ♭VII chord borrowed from the parallel minor.',
        hintTemplate: 'The parallel minor ({key} minor) lends its ♭VII to {key} major: the major triad on {root}.',
        params: {
          // ♭VII = a whole step below the tonic, on the 7th letter: C→Bb, G→F, D→C, F→Eb, A→G, E→D
          roots: ['B', 'F', 'C', 'E', 'G', 'D'],
          accidentals: ['b', '', '', 'b', '', ''],
          keys: ['C', 'G', 'D', 'F', 'A', 'E'],
          chordQualities: ['major'],
          noteCounts: [3],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'In {key} major, build the ♭VI chord borrowed from the parallel minor.',
        hintTemplate: 'The parallel minor ({key} minor) lends its ♭VI to {key} major: the major triad on {root}.',
        params: {
          // ♭VI = 8 semitones above the tonic, on the 6th letter: C→Ab, G→Eb, D→Bb, F→Db, A→F, E→C
          roots: ['A', 'E', 'B', 'D', 'F', 'C'],
          accidentals: ['b', 'b', 'b', 'b', '', ''],
          keys: ['C', 'G', 'D', 'F', 'A', 'E'],
          chordQualities: ['major'],
          noteCounts: [3],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'In {key} major, build the iv chord borrowed from the parallel minor.',
        hintTemplate: 'The parallel minor ({key} minor) lends its iv to {key} major: the minor triad on {root}.',
        params: {
          // iv = the minor triad on the 4th degree (5 semitones up): C→F, G→C, D→G, F→Bb, A→D, E→A
          roots: ['F', 'C', 'G', 'B', 'D', 'A'],
          accidentals: ['', '', '', 'b', '', ''],
          keys: ['C', 'G', 'D', 'F', 'A', 'E'],
          chordQualities: ['minor'],
          noteCounts: [3],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about borrowed chords and chromatic mediants in pop is true?',
        hintTemplate: 'Common borrowing in pop: iv, bVI and bVII from the parallel minor (bVII is also the Mixolydian chord). Chromatic mediants: roots a 3rd apart, with notes outside the key.',
        params: {
          choiceSets: [
            [
              { label: 'The bVII chord in a major key is borrowed from the parallel minor (or Mixolydian)', correct: true },
              { label: 'The bVII chord is borrowed from Lydian, which is the only mode with a lowered 7th degree', correct: false },
              { label: 'bVII is a diatonic chord in major', correct: false },
              { label: 'bVII is borrowed from Locrian', correct: false },
            ],
            [
              { label: 'The iv chord in a major key is borrowed from the parallel minor (Aeolian)', correct: true },
              { label: 'The iv chord is diatonic in a major key, because the 4th degree of a major scale carries a minor triad', correct: false },
              { label: 'iv is borrowed from Lydian', correct: false },
              { label: 'iv does not exist as a borrowed chord', correct: false },
            ],
            [
              { label: 'The "Mario cadence" bVI-bVII-I uses two chords borrowed from the parallel minor', correct: true },
              { label: 'The "Mario cadence" bVI-bVII-I uses only diatonic chords of the major key, with nothing borrowed', correct: false },
              { label: 'It ends on the vi chord', correct: false },
              { label: 'It is a minor-key cadence only', correct: false },
            ],
            [
              { label: 'C major to E major is a chromatic mediant: roots a major 3rd apart, one common tone (E)', correct: true },
              { label: 'C major to E major is a plain diatonic move: both chords belong to C major and share two notes', correct: false },
              { label: 'C to E major is a dominant relationship', correct: false },
              { label: 'C major and E major share no notes', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l7u23m3: Scales: Melodic Minor Modes ----
  {
    moduleId: 'l7u23m3',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale.',
        hintTemplate: 'Melodic minor (jazz minor): 1-2-b3-4-5-6-7. Altered (mode 7 of melodic minor): 1-b2-#2-3-#4-#5-b7 — the melodic minor a half step above {root}.',
        params: {
          roots: ['C', 'D', 'E', 'G', 'A', 'F'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['melodic_minor', 'altered'],
          noteCounts: [7, 7],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the modes of melodic minor is true?',
        hintTemplate: 'Number the modes of C melodic minor (C D Eb F G A B) from each note: mode 4 starts on F (Lydian dominant), mode 6 on A (Locrian ♮2), mode 7 on B (altered).',
        params: {
          choiceSets: [
            [
              { label: 'The altered scale is mode 7 of melodic minor: G altered has the notes of Ab melodic minor', correct: true },
              { label: 'The altered scale is mode 7 of harmonic minor: G altered has exactly the notes of C harmonic minor', correct: false },
              { label: 'The altered scale has no altered notes', correct: false },
              { label: 'G altered is G major', correct: false },
            ],
            [
              { label: 'Lydian dominant is mode 4 of melodic minor and fits a dominant 7#11 chord', correct: true },
              { label: 'Lydian dominant is mode 4 of the major scale, so it fits a major 7th chord with a natural 4th', correct: false },
              { label: 'Lydian dominant has a major 7th', correct: false },
              { label: 'Lydian dominant fits minor chords', correct: false },
            ],
            [
              { label: 'Jazz melodic minor raises the 6th and 7th of natural minor, both going up and coming down', correct: true },
              { label: 'Jazz melodic minor lowers both the 6th and the 7th degree, which simply makes it the natural minor scale', correct: false },
              { label: 'It has a lowered 3rd and a lowered 7th', correct: false },
              { label: 'It is a pentatonic scale', correct: false },
            ],
            [
              { label: 'Locrian ♮2 is mode 6 of melodic minor and fits the half-diminished (m7b5) chord', correct: true },
              { label: 'Locrian ♮2 is mode 2 of melodic minor and fits the fully diminished seventh chord (dim7)', correct: false },
              { label: 'Locrian ♮2 has a perfect 5th', correct: false },
              { label: 'It fits a major 7th chord', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l7u23m4: Harmonic Minor Modes, Symmetric, and World Scales ----
  {
    moduleId: 'l7u23m4',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale.',
        hintTemplate: 'Whole-tone: all whole steps (6 notes). Chromatic: all half steps (12). Harmonic minor: natural minor with a raised 7th (7). Diminished half-whole: half and whole steps alternating (8).',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['whole_tone', 'chromatic', 'harmonic_minor', 'diminished_half_whole'],
          noteCounts: [6, 12, 7, 8],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about harmonic-minor modes, symmetric scales and world scales is true?',
        hintTemplate: 'Harmonic minor has an "exotic" sound from the augmented 2nd. Phrygian dominant (5th mode of harmonic minor) is used in flamenco and Middle Eastern music. Symmetric scales repeat one interval pattern.',
        params: {
          choiceSets: [
            [
              { label: 'The Phrygian dominant scale (1-b2-3-4-5-b6-b7) is the 5th mode of harmonic minor', correct: true },
              { label: 'The Phrygian dominant scale is simply the ordinary Phrygian mode, with the same minor 3rd', correct: false },
              { label: 'Phrygian dominant has a minor 3rd', correct: false },
              { label: 'Phrygian dominant is a whole-tone scale', correct: false },
            ],
            [
              { label: 'The Hungarian minor scale has two augmented 2nds, creating its distinctive dramatic sound', correct: true },
              { label: 'The Hungarian minor scale has no augmented 2nds at all: it is just the natural minor scale renamed', correct: false },
              { label: 'Hungarian minor has no augmented intervals', correct: false },
              { label: 'Hungarian minor is the same as melodic minor', correct: false },
            ],
            [
              { label: 'There are only two different whole-tone scales: on C and on Db', correct: true },
              { label: 'There are twelve different whole-tone scales, one starting on each of the chromatic notes', correct: false },
              { label: 'The whole-tone scale has 7 notes', correct: false },
              { label: 'It contains a perfect 5th', correct: false },
            ],
            [
              { label: 'The diminished scale alternates half and whole steps, giving 8 notes in an octave', correct: true },
              { label: 'The diminished scale alternates whole steps and minor 3rds, giving it 7 notes like the major scale', correct: false },
              { label: 'It is a pentatonic scale', correct: false },
              { label: 'It has no half steps', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l7u23m5: Complete Chord Taxonomy ----
  {
    moduleId: 'l7u23m5',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Chord families: build the {root} {quality} chord, stacking 3rds up to the 9th.',
        hintTemplate: 'Stack 3rds from {root}: root, 3rd, 5th, 7th, 9th — the 3rd and 7th set the family (major, minor or dominant).',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          chordQualities: ['major9', 'minor9', 'dominant9'],
          noteCounts: [5],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'Chord families: build the {root} {quality} chord.',
        hintTemplate: 'Minor-major 7th = minor triad + major 7th. Augmented major 7th = augmented triad (raised 5th) + major 7th. Build from {root}.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          chordQualities: ['minor_major7', 'augmented_major7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the chord families is true?',
        hintTemplate: 'Extensions (9, 11, 13) imply the 7th; added tones (add9, 6) do not. Sus chords replace the 3rd. A power chord is root and 5th only.',
        params: {
          choiceSets: [
            [
              { label: 'An extension implies the 7th: C9 contains Bb, while Cadd9 has no 7th at all', correct: true },
              { label: 'Cadd9 and C9 are the same chord, because an added 9th always brings the dominant 7th with it', correct: false },
              { label: 'C9 has no 3rd', correct: false },
              { label: 'Cadd9 contains B', correct: false },
            ],
            [
              { label: 'A sus4 chord replaces the 3rd with the 4th, so Csus4 is C-F-G', correct: true },
              { label: 'A sus4 chord keeps the 3rd and adds the 4th above it, so Csus4 is spelled C-E-F-G', correct: false },
              { label: 'Csus4 is C-Eb-G', correct: false },
              { label: 'Csus4 is a minor chord', correct: false },
            ],
            [
              { label: 'A power chord (C5) has only a root and a 5th, so it is neither major nor minor', correct: true },
              { label: 'A power chord (C5) is a C major triad with a doubled root, so it always sounds major', correct: false },
              { label: 'C5 contains the 5th degree only', correct: false },
              { label: 'C5 is a C minor triad', correct: false },
            ],
            [
              { label: 'The minor-major 7th chord is a minor triad with a major 7th: C-Eb-G-B', correct: true },
              { label: 'The minor-major 7th chord is a major triad with a minor 7th, which is the dominant 7th C-E-G-Bb', correct: false },
              { label: 'It has no 7th', correct: false },
              { label: 'It is C-E-G#-B', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

];

export default templates;
