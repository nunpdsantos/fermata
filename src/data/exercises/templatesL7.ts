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
        hintTemplate: 'Jazz symbols: triangle/maj7 = major 7, - or m = minor, 7 = dominant, ° = diminished, ø = half-diminished, + = augmented, sus = suspended. Extensions are measured above the root: in C13, A is the 13th and F is usually omitted; in C7(#9), D# is the raised 9th alongside E and Bb.',
        params: {
          choiceSets: [
            [
              { label: "C13 keeps a dominant seventh foundation and reaches up to A; the F is normally left out", correct: true },
              { label: "C13 usually has a major seventh foundation and reaches up to A; its seventh is B", correct: false },
              { label: "C13 keeps a dominant seventh foundation and reaches up to Ab; its thirteenth is lowered", correct: false },
              { label: "C13 normally has a minor seventh foundation with Eb as its third; the A becomes its thirteenth", correct: false },
            ],
            [
              { label: 'Cmin7(b5) is the same as Cø (C half-diminished)', correct: true },
              { label: 'Cmin7(b5) is a fully diminished seventh chord, exactly the same chord as Cdim7 (C°7)', correct: false },
              { label: 'Cmin7(b5) is a minor 7th chord', correct: false },
              { label: 'The b5 makes it an augmented chord', correct: false },
            ],
            [
              { label: 'C7(#9) specifies E, Bb, D#', correct: true },
              { label: 'C7(#9) specifies E, B, D#', correct: false },
              { label: 'C7(#9) specifies Eb, Bb, D', correct: false },
              { label: 'C7(#9) specifies Eb, B, D', correct: false },
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
              { label: 'Cmaj7 shell: C, G, B', correct: false },
              { label: 'Cmaj7 shell: C, E, G', correct: false },
              { label: 'Cmaj7 shell: C, G, Bb', correct: false },
            ],
            [
              { label: 'Dm7 shell: D, F, C', correct: true },
              { label: 'Dm7 full: D, F, A, C', correct: false },
              { label: 'Dm7 without the 3rd: D, A, C', correct: false },
              { label: 'Dm7 without the 7th: D, F, A', correct: false },
            ],
            [
              { label: 'G7 shell: G, B, F', correct: true },
              { label: 'G7 shell: G, D, F', correct: false },
              { label: 'G7 shell: G, B, D', correct: false },
              { label: 'G7 shell: G, D, F#', correct: false },
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
              { label: 'E7 shell: E, B, D', correct: false },
              { label: 'E7 shell: E, G#, B', correct: false },
              { label: 'E7 shell: E, B, D#', correct: false },
            ],
            [
              { label: 'Bbmaj7 shell: Bb, D, A', correct: true },
              { label: 'Bbmaj7 shell: Bb, Eb, G', correct: false },
              { label: 'Bbmaj7 shell: Bb, F, C', correct: false },
              { label: 'Bbmaj7 shell: Bb, C, Eb', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How do shell voicings connect in a jazz context?',
        hintTemplate: 'In ii-V-I, the 3rd of ii is held as the 7th of V, while the 7th of ii falls a half step to the 3rd of V (and the same happens again from V to I). This voice-leading efficiency is called guide-tone lines.',
        nudgeTemplate: 'Spell the 3rd and 7th of each chord in a ii-V-I (in C: Dm7, G7, Cmaj7), then follow each of those notes into the next chord: which ones stay where they are, and how far do the others travel?',
        params: {
          choiceSets: [
            [
              { label: 'In Dm7–G7, F stays on F; C moves to B', correct: true },
              { label: 'In Dm7–G7, F moves to E; C moves to B', correct: false },
              { label: 'In Dm7–G7, F stays on F; C moves to D', correct: false },
              { label: 'In Dm7–G7, F moves to E; C moves to D', correct: false },
            ],
            [
              { label: 'In Bb7–Ebmaj7, D→D and Ab→G', correct: true },
              { label: 'In Bb7–Ebmaj7, D→Eb and Ab→G', correct: false },
              { label: 'In Bb7–Ebmaj7, D→D and Ab→F', correct: false },
              { label: 'In Bb7–Ebmaj7, D→Eb and Ab→F', correct: false },
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
        hintTemplate: 'ii-V-I in major: min7 -> dom7 -> maj7. In minor: min7b5 -> dom7(b9) -> min(maj7). This is the backbone of jazz harmony. A ii-V-I can also establish a temporary tonic elsewhere in the key.',
        params: {
          choiceSets: [
            [
              { label: 'In minor keys, the ii chord is half-diminished (min7b5)', correct: true },
              { label: "In minor keys, the ii chord is dominant seventh (7)", correct: false },
              { label: "In minor keys, the ii chord is major seventh (maj7)", correct: false },
              { label: "In minor keys, the ii chord is fully diminished (dim7)", correct: false },
            ],
            [
              { label: 'When a ii-V-I targets a chord other than I, that chord functions as the tonic of the temporary key', correct: true },
              { label: 'When a ii-V-I targets a chord other than I, that chord functions as the supertonic of the temporary key', correct: false },
              { label: 'When a ii-V-I targets a chord other than I, that chord functions as the subdominant of the temporary key', correct: false },
              { label: 'When a ii-V-I targets a chord other than I, that chord functions as the dominant of the temporary key', correct: false },
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
              { label: 'G7 and Db7 share the sounding pitches F and B', correct: true },
              { label: 'G7 and Db7 share the sounding pitches G and D', correct: false },
              { label: 'G7 and Db7 share the sounding pitches B and E', correct: false },
              { label: 'G7 and Db7 share the sounding pitches C and F', correct: false },
            ],
            [
              { label: 'The substitute bass descends one semitone to the tonic', correct: true },
              { label: 'The substitute bass descends one whole tone to the tonic', correct: false },
              { label: 'The substitute bass ascends one semitone to the tonic', correct: false },
              { label: 'The substitute bass ascends one whole tone to the tonic', correct: false },
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
              { label: 'The three basic chords of a 12-bar blues in F are F7, Bb7, C7', correct: true },
              { label: 'The three basic chords of a 12-bar blues in F are Fmaj7, Bb7, C7', correct: false },
              { label: 'The three basic chords of a 12-bar blues in F are F7, Bbmaj7, C7', correct: false },
              { label: 'The three basic chords of a 12-bar blues in F are Fmaj7, Bbmaj7, C7', correct: false },
            ],
            [
              { label: 'In C jazz blues, Gm7–C7 in bar 4 is a ii–V leading to F7', correct: true },
              { label: 'In C jazz blues, Dm7–G7 in bar 4 is a ii–V leading to F7', correct: false },
              { label: 'In C jazz blues, Gm7–C7 in bars 9–10 is a ii–V leading to C7', correct: false },
              { label: 'In C jazz blues, Am7–D7 in bars 9–10 is a ii–V leading to C7', correct: false },
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
              { label: "Rhythm changes A section is built on I-IV-vi-V turnarounds in Bb major", correct: false },
              { label: "Rhythm changes A section is built on I-V-vi-IV turnarounds in Bb major", correct: false },
              { label: "Rhythm changes A section is built on I-bVII-IV-I turnarounds in Bb major", correct: false },
            ],
            [
              { label: "The bridge links dominant chords whose roots fall a fifth each time", correct: true },
              { label: "The bridge links dominant chords whose roots rise a fifth each time", correct: false },
              { label: "The bridge links dominant chords whose roots fall a major third each time", correct: false },
              { label: "The bridge links dominant chords whose roots rise a half step each time", correct: false },
            ],
            [
              { label: 'Rhythm changes form is AABA, totaling 32 bars', correct: true },
              { label: "Rhythm changes form is ABAB, totaling 32 bars", correct: false },
              { label: "Rhythm changes form is ABBA, totaling 32 bars", correct: false },
              { label: "Rhythm changes form is ABAC, totaling 32 bars", correct: false },
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
        promptTemplate: 'Which statement about chord-scale theory is true?',
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
              { label: "Locrian and Locrian ♮2 both supply the chord tones of a half-diminished m7b5 chord", correct: true },
              { label: "Dorian and Aeolian both supply the chord tones of a half-diminished m7b5 chord", correct: false },
              { label: "Ionian and Lydian both supply the chord tones of a half-diminished m7b5 chord", correct: false },
              { label: "Mixolydian and Lydian dominant both supply the chord tones of a half-diminished m7b5 chord", correct: false },
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
        hintTemplate: 'An upper-structure triad sits over the dominant\'s shell (root, 3rd, b7); name its notes by their interval above the bass. Reharmonization swaps chords for others that still support the melody, often within the same function. Passing diminished chords can connect chords a step apart through chromatic bass motion.',
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
              { label: "In C major, Em7 can replace Cmaj7: they share E, G and B and both have dominant function", correct: false },
              { label: "In C major, Em7 can replace Cmaj7: they share C, E and G and both have tonic function", correct: false },
              { label: "In C major, Em7 can replace Cmaj7: they share C, E and G and both have dominant function", correct: false },
            ],
            [
              { label: "Reharmonization gives a familiar tune a fresh accompaniment by choosing different supporting chords", correct: true },
              { label: "Reharmonization gives the original chords a different melody by replacing the melody notes above them", correct: false },
              { label: "Reharmonization moves the melody and its original chords to a different key while preserving their harmonic functions", correct: false },
              { label: "Reharmonization changes the inversion of the original chords while preserving the melody and the chord identities", correct: false },
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
              { label: "The octave is split evenly between three tonal homes four semitones apart", correct: true },
              { label: 'The octave is split evenly between four tonal homes three semitones apart', correct: false },
              { label: 'The octave is split evenly between two tonal homes six semitones apart', correct: false },
              { label: 'The octave is split evenly between six tonal homes two semitones apart', correct: false },
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
              { label: "Take natural minor and lift its sixth note by a semitone to obtain Dorian", correct: true },
              { label: "Take natural minor and lift its seventh note by a semitone to obtain Dorian", correct: false },
              { label: "Take natural minor and lift its third note by a semitone to obtain Dorian", correct: false },
              { label: "Take natural minor and lower its second note by a semitone to obtain Dorian", correct: false },
            ],
            [
              { label: "Raise just the fourth note of a major scale to obtain Lydian", correct: true },
              { label: "Raise just the fifth note of a major scale to obtain Lydian", correct: false },
              { label: "Lower just the seventh note of a major scale to obtain Lydian", correct: false },
              { label: "Lower just the third note of a major scale to obtain Lydian", correct: false },
            ],
            [
              { label: 'A D Dorian vamp (Dm7 - G7) emphasizes the natural 6th (B natural over D)', correct: true },
              { label: "A D Dorian vamp (Dm7 - Gm7) emphasizes the lowered 6th (Bb over D)", correct: false },
              { label: "A D Dorian vamp (Dm7 - A7) emphasizes the raised 7th (C# over D)", correct: false },
              { label: "A D Dorian vamp (Dmaj7 - Gmaj7) emphasizes the major 3rd (F# over D)", correct: false },
            ],
            [
              { label: 'Phrygian is characterized by the b2 interval, giving it a Spanish/flamenco flavor', correct: true },
              { label: "Phrygian is characterized by the #4 interval, giving it a Spanish/flamenco flavor", correct: false },
              { label: 'Phrygian is characterized by the major 7th interval, giving it a Spanish/flamenco flavor', correct: false },
              { label: "Phrygian is characterized by the natural 6th interval, giving it a Spanish/flamenco flavor", correct: false },
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
              { label: 'The quartal stack D–G–C–F has three perfect fourths between adjacent notes', correct: true },
              { label: 'The quartal stack D–G–C–F has three augmented fourths between adjacent notes', correct: false },
              { label: 'The quartal stack D–G–C–F has perfect fourths alternating with perfect fifths', correct: false },
              { label: 'The quartal stack D–G–C–F has two perfect fourths between its three notes', correct: false },
            ],
            [
              { label: "Planing slides every note of a chord in the same direction at once", correct: true },
              { label: "Planing usually sends the highest chord tone upward while the lowest moves downward", correct: false },
              { label: "Planing holds every upper note still while moving the bass through the scale", correct: false },
              { label: "Planing breaks a chord into a melody by sounding its notes one after another", correct: false },
            ],
            [
              { label: 'Diatonic planing keeps all notes within the key; chromatic planing maintains exact intervals', correct: true },
              { label: "Diatonic planing maintains exact intervals; chromatic planing keeps all notes within the key", correct: false },
              { label: "Diatonic planing keeps all voices stationary; chromatic planing changes only the bass", correct: false },
              { label: "Diatonic planing moves all notes in contrary motion; chromatic planing maintains exact intervals", correct: false },
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
              { label: "I-V-vi-IV is common in pop, and its Roman numerals preserve the chord relationships across keys", correct: true },
              { label: "I-V-vi-IV is common in pop, and its Roman numerals keep the same absolute pitches across keys", correct: false },
              { label: "I-V-vi-IV is common in pop, and its vi represents a major chord on the sixth scale degree", correct: false },
              { label: 'I-V-vi-IV is common in pop, and its IV represents a minor chord on the fourth scale degree', correct: false },
            ],
            [
              { label: "vi-IV-I-V rotates I-V-vi-IV so that the same four chords begin on vi", correct: true },
              { label: "vi-IV-I-V rotates I-IV-vi-V so that the same four chords begin on vi", correct: false },
              { label: "vi-IV-I-V rotates I-vi-IV-V so that the same four chords begin on vi", correct: false },
              { label: "vi-IV-I-V rotates I-V-IV-vi so that the same four chords begin on vi", correct: false },
            ],
            [
              { label: 'Nashville charts number chord roots by scale degree from the tonic, making 4 the chord on the fourth degree', correct: true },
              { label: "Nashville charts usually number chord roots by semitones above the tonic, making 4 a major third", correct: false },
              { label: "Nashville charts number chord roots as fixed pitches, making 1 the note C in every key", correct: false },
              { label: "Nashville charts number chord durations in beats, making 4 a chord held for four beats", correct: false },
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
              { label: "Lydian dominant is mode 2 of melodic minor and fits a dominant 7#11 chord", correct: false },
              { label: "Lydian dominant is mode 6 of melodic minor and fits a dominant 7#11 chord", correct: false },
              { label: "Lydian dominant is mode 7 of melodic minor and fits a dominant 7#11 chord", correct: false },
            ],
            [
              { label: 'Jazz melodic minor raises the 6th and 7th of natural minor, both going up and coming down', correct: true },
              { label: 'Jazz melodic minor lowers both the 6th and the 7th degree, which simply makes it the natural minor scale', correct: false },
              { label: 'Jazz melodic minor has a lowered 3rd and a lowered 7th', correct: false },
              { label: 'Jazz melodic minor raises only the 7th of natural minor, like harmonic minor', correct: false },
            ],
            [
              { label: 'Locrian ♮2 is mode 6 of melodic minor and fits the half-diminished (m7b5) chord', correct: true },
              { label: "Locrian ♮2 is mode 2 of melodic minor and fits the half-diminished (m7b5) chord", correct: false },
              { label: "Locrian ♮2 is mode 4 of melodic minor and fits the half-diminished (m7b5) chord", correct: false },
              { label: "Locrian ♮2 is mode 7 of melodic minor and fits the half-diminished (m7b5) chord", correct: false },
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
        hintTemplate: 'Whole-tone: all whole steps (6 notes). Phrygian dominant: mode 5 of harmonic minor, 1-b2-3-4-5-b6-b7 (7). Harmonic minor: natural minor with a raised 7th (7). Diminished half-whole: half and whole steps alternating (8).',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['whole_tone', 'phrygian_dominant', 'harmonic_minor', 'diminished_half_whole'],
          noteCounts: [6, 7, 7, 8],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about harmonic-minor modes, symmetric scales and world scales is true?',
        hintTemplate: 'Harmonic minor has an "exotic" sound from the augmented 2nd. Phrygian dominant (5th mode of harmonic minor) is used in flamenco and Middle Eastern music. Symmetric scales repeat one interval pattern. Hungarian minor raises degree 4 of harmonic minor, giving two augmented seconds. Whole-tone scales use whole steps (two distinct collections); diminished scales alternate half and whole steps (eight notes).',
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
              { label: 'The Hungarian minor scale is mode 5 of harmonic minor, the Phrygian dominant, with a major 3rd', correct: false },
              { label: 'Hungarian minor has no augmented intervals', correct: false },
              { label: 'Hungarian minor is the same as melodic minor (raised 6th and 7th)', correct: false },
            ],
            [
              { label: 'There are only two different whole-tone scales: on C and on Db', correct: true },
              { label: 'There are twelve different whole-tone scales, one starting on each of the chromatic notes', correct: false },
              { label: 'The whole-tone scale has 7 notes', correct: false },
              { label: 'It contains a perfect 5th', correct: false },
            ],
            [
              { label: 'The diminished scale alternates half and whole steps, giving 8 notes in an octave', correct: true },
              { label: "The diminished scale alternates half and whole steps, giving 6 notes in an octave", correct: false },
              { label: "The diminished scale alternates half and whole steps, giving 7 notes in an octave", correct: false },
              { label: "The diminished scale alternates half and whole steps, giving 12 notes in an octave", correct: false },
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
        hintTemplate: 'Extensions (9, 11, 13) imply the 7th; added tones (add9, 6) do not. Sus chords replace the 3rd. A power chord is root and 5th only. A minor-major seventh combines a minor triad with a major seventh: C-Eb-G-B.',
        params: {
          choiceSets: [
            [
              { label: 'For C9, include the seventh Bb; for Cadd9, omit the seventh', correct: true },
              { label: 'For C9, omit the seventh; for Cadd9, include the seventh Bb', correct: false },
              { label: 'For C9, include the seventh B; for Cadd9, omit the seventh', correct: false },
              { label: 'For C9, omit the seventh; for Cadd9, include the seventh B', correct: false },
            ],
            [
              { label: 'A sus4 chord replaces the 3rd with the 4th, so Csus4 is C-F-G', correct: true },
              { label: 'A sus4 chord keeps the 3rd and adds the 4th, so Csus4 is C-E-F-G', correct: false },
              { label: 'A sus4 chord replaces the 3rd with the augmented 4th, so Csus4 is C-F#-G', correct: false },
              { label: "A sus4 chord replaces the 5th with the 4th, so Csus4 is C-E-F", correct: false },
            ],
            [
              { label: 'A power chord (C5) has only a root and a 5th, so it is neither major nor minor', correct: true },
              { label: 'A power chord (C5) is a C major triad with a doubled root, so it always sounds major', correct: false },
              { label: 'C5 contains the 5th degree only', correct: false },
              { label: 'C5 is a C minor triad', correct: false },
            ],
            [
              { label: 'The minor-major 7th chord on C contains C-Eb-G-B', correct: true },
              { label: 'The minor-major 7th chord on C contains C-E-G-Bb', correct: false },
              { label: 'The minor-major 7th chord on C contains C-Eb-G-Bb', correct: false },
              { label: 'The minor-major 7th chord on C contains C-E-G-B', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

];

export default templates;
