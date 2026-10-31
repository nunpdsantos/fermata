import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 5 Templates — 14 modules, ~75 generated exercises
// Focus: Secondary dominants, tonicization, modulation, mode mixture,
//        musical form
//
// W4a (2026-10-31): questions are worded as statements about a named topic
// (nothing on screen to point at), and options are balanced so the right one
// is not simply the longest. PT/ES overlays mirror this file entry by entry.
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 15: Secondary Dominants and Tonicization
  // =========================================================================

  // ---- l5u15m1: Secondary Dominants V/V ----
  {
    moduleId: 'l5u15m1',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the {root} major triad.',
        hintTemplate: 'A major triad: root + major 3rd + perfect 5th. This chord quality is used for secondary dominants like V/V.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A', 'E'],
          accidentals: ['', '', '', '', '', ''],
          chordQualities: ['major'],
          noteCounts: [3],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about V/V (the dominant of the dominant) is true?',
        hintTemplate: 'V/V tonicizes the dominant chord. It contains a chromatic alteration (raised 4th scale degree) and resolves to V.',
        params: {
          choiceSets: [
            [
              { label: 'V/V contains the raised 4th scale degree and resolves to V', correct: true },
              { label: 'V/V contains the lowered 7th scale degree and resolves to IV', correct: false },
              { label: 'V/V contains the raised 4th scale degree and resolves to I', correct: false },
              { label: 'V/V contains only diatonic notes, so it is the same chord as ii', correct: false },
            ],
            [
              { label: 'In C major, V/V is D major (D-F#-A), resolving to G major', correct: true },
              { label: 'In C major, V/V is F major (F-A-C), resolving to G major', correct: false },
              { label: 'In C major, V/V is A major (A-C#-E), resolving to D minor', correct: false },
              { label: 'In C major, V/V is B major (B-D#-F#), resolving to C major', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u15m2: Secondary Dominants of ii, iii, IV, vi ----
  {
    moduleId: 'l5u15m2',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the {root} dominant 7th chord (a very common form of a secondary dominant).',
        hintTemplate: 'A secondary dominant is a major triad or dominant 7th built a perfect 5th above the chord it tonicizes. Here just build {root}7: root + major 3rd + perfect 5th + minor 7th. For example, A7 (A-C#-E-G) is V7/ii in C major, tonicizing D minor.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A'],
          accidentals: ['', '', '', '', ''],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about secondary dominants of ii, iii, IV and vi is true?',
        hintTemplate: 'Each secondary dominant targets a specific diatonic chord. V7/ii resolves to ii, V7/IV resolves to IV, V7/vi resolves to vi, etc.',
        params: {
          choiceSets: [
            [
              { label: 'V7/vi in C major is E7 (E-G#-B-D), resolving to A minor', correct: true },
              { label: 'V7/vi in C major is D7 (D-F#-A-C), resolving to G major', correct: false },
              { label: 'V7/vi in C major is E7 (E-G#-B-D), resolving to F major', correct: false },
              { label: 'V7/vi in C major is A7 (A-C#-E-G), resolving to D minor', correct: false },
            ],
            [
              { label: 'V7/IV in C major is C7 (C-E-G-Bb), resolving to F major', correct: true },
              { label: 'V7/IV in C major is F7 (F-A-C-Eb), resolving to Bb major', correct: false },
              { label: 'V7/IV in C major is C7 (C-E-G-Bb), resolving to G major', correct: false },
              { label: 'V7/IV in C major is G7 (G-B-D-F), resolving to C major', correct: false },
            ],
            [
              { label: 'V7/ii in C major is A7 (A-C#-E-G), resolving to D minor', correct: true },
              { label: 'V7/ii in C major is B7 (B-D#-F#-A), resolving to E minor', correct: false },
              { label: 'V7/ii in C major is A7 (A-C#-E-G), resolving to C major', correct: false },
              { label: 'V7/ii in C major is D7 (D-F#-A-C), resolving to G major', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u15m3: Secondary Leading-Tone Chords ----
  {
    moduleId: 'l5u15m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about secondary leading-tone chords is true?',
        hintTemplate: 'Secondary leading-tone chords (vii°/x) function like secondary dominants but are diminished. They resolve up by half step to their target chord.',
        params: {
          choiceSets: [
            [
              { label: 'vii°7/V in C major is F#dim7, resolving up to G', correct: true },
              { label: 'vii°7/V in C major is Bdim7, resolving up to C', correct: false },
              { label: 'vii°7/V in C major is F#dim7, resolving down to F', correct: false },
              { label: 'vii°7/V in C major is C#dim7, resolving up to D', correct: false },
            ],
            [
              { label: 'Their root lies a half step below the chord they resolve to', correct: true },
              { label: 'Their root lies a perfect 5th above the chord they resolve to', correct: false },
              { label: 'Their root lies a whole step below the chord they resolve to', correct: false },
              { label: 'Their root lies a major 3rd below the chord they resolve to', correct: false },
            ],
            [
              { label: 'It can be a diminished triad, a half-diminished 7th or a fully diminished 7th', correct: true },
              { label: 'It is always a major triad, exactly like the secondary dominant it replaces', correct: false },
              { label: 'It is always a minor 7th chord built on the root of its target', correct: false },
              { label: 'It can be a minor triad or a minor 7th, but never a diminished chord', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u15m4: Tonicization vs Modulation ----
  {
    moduleId: 'l5u15m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about tonicization and modulation is true?',
        hintTemplate: 'Tonicization is a brief, momentary emphasis on a non-tonic chord (lasting 1-2 chords). Modulation is a more permanent shift to a new key (confirmed by a cadence in the new key).',
        params: {
          choiceSets: [
            [
              { label: 'Tonicization briefly stresses a chord; modulation confirms a new key with a cadence', correct: true },
              { label: 'Tonicization confirms a new key with a cadence; modulation only briefly stresses a chord', correct: false },
              { label: 'Tonicization and modulation are two names for exactly the same process', correct: false },
              { label: 'Modulation never uses chromatic chords; tonicization always does', correct: false },
            ],
            [
              { label: 'A single secondary dominant and its target is a tonicization', correct: true },
              { label: 'A single secondary dominant and its target is always a modulation', correct: false },
              { label: 'A tonicization must last at least eight bars in the new key', correct: false },
              { label: 'A tonicization needs a perfect authentic cadence in the new key', correct: false },
            ],
            [
              { label: 'A modulation is confirmed when the music cadences in the new key', correct: true },
              { label: 'A modulation is confirmed as soon as the time signature changes', correct: false },
              { label: 'A modulation is confirmed by any single chromatic note in the melody', correct: false },
              { label: 'A modulation can only ever be confirmed at the very end of a piece', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u15m5: Dominant Chains ----
  {
    moduleId: 'l5u15m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about chains of secondary dominants is true?',
        hintTemplate: 'A dominant chain links secondary dominants: e.g., V7/vi -> V7/ii -> V7/V -> V7 -> I. Each dominant resolves to the next, creating chromatic motion toward the tonic.',
        params: {
          choiceSets: [
            [
              { label: 'In a dominant chain, each chord acts as V7 of the chord that follows', correct: true },
              { label: 'In a dominant chain, each chord acts as IV of the chord that follows', correct: false },
              { label: 'In a dominant chain, every chord stays diatonic to the home key', correct: false },
              { label: 'In a dominant chain, each chord acts as V7 of the chord that came before it', correct: false },
            ],
            [
              { label: 'The chain V7/vi -> V7/ii -> V7/V -> V -> I moves by descending 5ths', correct: true },
              { label: 'The chain V7/vi -> V7/ii -> V7/V -> V -> I moves by ascending 5ths', correct: false },
              { label: 'The chain V7/vi -> V7/ii -> V7/V -> V -> I moves by ascending 3rds', correct: false },
              { label: 'The chain V7/vi -> V7/ii -> V7/V -> V -> I moves by descending steps', correct: false },
            ],
            [
              { label: 'Each applied dominant usually adds a chromatic note: the leading tone of its target', correct: true },
              { label: 'Each applied dominant stays diatonic, so the chain adds no chromatic notes at all', correct: false },
              { label: 'Each applied dominant keeps the bass on one note for the whole chain', correct: false },
              { label: 'Each applied dominant must be played in second inversion', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 16: Modulation
  // =========================================================================

  // ---- l5u16m1: Pivot Chord Modulation ----
  {
    moduleId: 'l5u16m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about pivot-chord modulation is true?',
        hintTemplate: 'A pivot chord belongs to both the old and new keys. It reinterprets a diatonic chord: e.g., IV in C = I in F. The pivot is the hinge between two key areas.',
        params: {
          choiceSets: [
            [
              { label: 'A pivot chord is diatonic in both the old key and the new key', correct: true },
              { label: 'A pivot chord is diatonic in the old key but chromatic in the new key', correct: false },
              { label: 'A pivot chord must always be the V7 of the new key', correct: false },
              { label: 'A pivot chord can only link two minor keys', correct: false },
            ],
            [
              { label: 'From C to G, the C major chord can pivot as IV of G', correct: true },
              { label: 'From C to G, the C major chord can pivot as V of G', correct: false },
              { label: 'From C to G, the C major chord can pivot as vii° of G', correct: false },
              { label: 'From C to G, the C major chord cannot pivot at all', correct: false },
            ],
            [
              { label: 'Closely related keys (one accidental apart) share the most pivot chords', correct: true },
              { label: 'Distant keys, many accidentals apart, share the most pivot chords of all', correct: false },
              { label: 'Every pair of keys shares exactly the same number of pivot chords', correct: false },
              { label: 'Parallel keys (same tonic) always share the most pivot chords', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u16m2: Modulation to Closely Related Keys ----
  // (was keyed to l5u16m4 — re-keyed to match curriculum topic)
  {
    moduleId: 'l5u16m2',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} natural minor scale (the relative minor — a closely related key).',
        hintTemplate: 'A key and its relative minor share the same key signature (0 accidentals apart), so the relative minor is one of the closely related keys. Build {root} natural minor: the natural minor scale starting on {root}.',
        params: {
          roots: ['A', 'E', 'D', 'B', 'F', 'C'],
          accidentals: ['', '', '', '', '#', '#'],
          scaleTypes: ['natural_minor'],
          noteCounts: [7],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about closely related keys is true?',
        hintTemplate: 'Each major key has 5 closely related keys: the dominant, subdominant, and the relative minors of all three (tonic, dominant, subdominant).',
        params: {
          choiceSets: [
            [
              { label: 'C major\'s closely related keys: G major, F major, A minor, E minor, D minor', correct: true },
              { label: 'C major\'s closely related keys: D major, Bb major, B minor, G minor, F# minor', correct: false },
              { label: 'C major\'s closely related keys: Db major, B major, C minor, Bb minor, Eb minor', correct: false },
              { label: 'C major\'s closely related keys: G major, D major, A major, E major, B major', correct: false },
            ],
            [
              { label: 'G major\'s closely related keys: D major, C major, E minor, B minor, A minor', correct: true },
              { label: 'G major\'s closely related keys: Gb major, Ab major, G minor, Eb minor, F minor', correct: false },
              { label: 'G major\'s closely related keys: F major, Bb major, D minor, G minor, C minor', correct: false },
              { label: 'G major\'s closely related keys: D major, A major, E major, B major, F# major', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u16m3: Direct, Common-Tone, and Chromatic Modulation ----
  // (merged the Direct/Phrase, Common-Tone, and Chromatic blocks — the curriculum
  //  collapses all three into this one module; previously split across m2/m3/m5)
  {
    moduleId: 'l5u16m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about direct (phrase) modulation is true?',
        hintTemplate: 'Direct (phrase) modulation changes key abruptly at a phrase boundary without a pivot chord. Common in pop music and hymns.',
        params: {
          choiceSets: [
            [
              { label: 'A direct modulation moves to a new key at a phrase boundary, with no pivot', correct: true },
              { label: 'A direct modulation moves to a new key mid-phrase through a shared pivot chord', correct: false },
              { label: 'A direct modulation is just another name for a brief tonicization', correct: false },
              { label: 'A direct modulation can only move up by a half step', correct: false },
            ],
            [
              { label: 'The "truck driver" modulation jumps up a half or whole step for a lift', correct: true },
              { label: 'The "truck driver" modulation always moves down to the dominant key', correct: false },
              { label: 'The "truck driver" modulation is found only in Baroque and Classical music', correct: false },
              { label: 'The "truck driver" modulation always lowers the key by a semitone', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about common-tone modulation is true?',
        hintTemplate: 'Common-tone modulation sustains a single pitch that is reinterpreted in the new key. Often used for remote modulations where few pivot chords exist.',
        params: {
          choiceSets: [
            [
              { label: 'One held note is reheard as a different scale degree in the new key', correct: true },
              { label: 'One held note keeps exactly the same scale degree in the new key', correct: false },
              { label: 'Every note of the chord must be common to both of the keys', correct: false },
              { label: 'No note is held: the music stops, then restarts in the new key', correct: false },
            ],
            [
              { label: 'It is especially useful between distant keys that share few chords', correct: true },
              { label: 'It works only between closely related keys that share many chords', correct: false },
              { label: 'It requires a chromatic sequence through every key that lies in between', correct: false },
              { label: 'It works only between a key and its relative major or minor', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about chromatic modulation is true?',
        hintTemplate: 'Chromatic modulation uses a chromatic alteration to smoothly lead into the new key. One voice moves by half step from a diatonic note to a chromatic one in the new key.',
        params: {
          choiceSets: [
            [
              { label: 'One voice moves by half step from a diatonic note to a chromatic one', correct: true },
              { label: 'One voice leaps by a tritone from a diatonic note to a chromatic one', correct: false },
              { label: 'Every voice moves by whole step, so no half steps appear at all', correct: false },
              { label: 'It needs a pivot chord that is diatonic in both keys', correct: false },
            ],
            [
              { label: 'The altered note often becomes the leading tone or a chord tone of the new key', correct: true },
              { label: 'The altered note is always the tonic of the new key, never its leading tone', correct: false },
              { label: 'The altered note must always be in the bass, never in an upper voice', correct: false },
              { label: 'Chromatic modulation never involves the leading tone of the new key in any voice', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u16m4: Mode Mixture — Borrowed Chords ----
  // (was keyed to l5u17m1 — re-keyed to match curriculum topic)
  {
    moduleId: 'l5u16m4',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the {root} borrowed chord (a mode-mixture chord in C major).',
        hintTemplate: 'Mode mixture borrows chords from the parallel minor. In C major these borrowed chords are bVI (Ab major), bIII (Eb major), bVII (Bb major), and iv (F minor). Build {root} as written: lowered roots take major triads, the iv chord is F minor.',
        params: {
          roots: ['A', 'E', 'B', 'F'],
          accidentals: ['b', 'b', 'b', ''],
          chordQualities: ['major', 'major', 'major', 'minor'],
          noteCounts: [3],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about chords borrowed from the parallel minor is true?',
        hintTemplate: 'Common borrowed chords in major: iv (minor iv), bVI (flat-six major), bVII (flat-seven major), bIII. They add a darker color to a major key.',
        params: {
          choiceSets: [
            [
              { label: 'In C major, bVI is Ab major (Ab-C-Eb), borrowed from C minor', correct: true },
              { label: 'In C major, bVI is A major (A-C#-E), borrowed from A minor', correct: false },
              { label: 'In C major, bVI is F# major (F#-A#-C#), borrowed from C minor', correct: false },
              { label: 'In C major, bVI is Ab minor (Ab-Cb-Eb), borrowed from Ab minor', correct: false },
            ],
            [
              { label: 'In C major, iv is F minor (F-Ab-C), borrowed from C minor', correct: true },
              { label: 'In C major, iv is F major (F-A-C), unchanged from the major key', correct: false },
              { label: 'In C major, iv is A minor (A-C-E), borrowed from A minor', correct: false },
              { label: 'In C major, iv is D minor (D-F-A), borrowed from C minor', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u16m5: Picardy Third and Mode Mixture in Minor ----
  // No generated template: the template set has no item that teaches the Picardy
  // third / mixture-in-minor concept. (The mode-mixture chord_build belongs to the
  // major-key borrowing module l5u16m4.) Rather than attach an off-topic generated
  // exercise, this module relies on its hand-authored exercises only. Coverage gap
  // acknowledged in the WS5 audit (L5 E1).

  // =========================================================================
  // Unit 17: Form, Texture, and Voice Leading
  // =========================================================================

  // ---- l5u17m1: Binary and Ternary Forms ----
  // (was keyed to l5u17m2 — re-keyed to match curriculum topic)
  {
    moduleId: 'l5u17m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about binary and ternary form is true?',
        hintTemplate: 'Binary: two sections (AB). Ternary: three sections (ABA). Rounded binary: A modulates, B develops, A returns (||:A:||:BA:||).',
        params: {
          choiceSets: [
            [
              { label: 'Two contrasting sections, each repeated (||:A:||:B:||), is simple binary form', correct: true },
              { label: 'Two contrasting sections, each repeated (||:A:||:B:||), is ternary form', correct: false },
              { label: 'Two contrasting sections, each repeated (||:A:||:B:||), is rondo form', correct: false },
              { label: 'Two contrasting sections, each repeated (||:A:||:B:||), is through-composed form', correct: false },
            ],
            [
              { label: 'ABA, where the first section returns after a contrast, is ternary form', correct: true },
              { label: 'ABA, where the first section returns after a contrast, is rondo form', correct: false },
              { label: 'ABA, where the first section returns after a contrast, is strophic form', correct: false },
              { label: 'ABA, where the first section returns after a contrast, is through-composed form', correct: false },
            ],
            [
              { label: 'Rounded binary brings back A material at the end of the B section', correct: true },
              { label: 'Rounded binary has three independent sections that never return', correct: false },
              { label: 'Rounded binary never modulates away from the tonic key at any point', correct: false },
              { label: 'Rounded binary is just another name for simple binary form', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l5u17m2: Song Forms and Large Forms Introduction ----
  // (merged the Rondo/Variations and Sonata blocks — the curriculum covers rondo,
  //  theme & variations, and sonata together in this module; previously split across m3/m4)
  {
    moduleId: 'l5u17m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about rondo and theme-and-variations form is true?',
        hintTemplate: 'Rondo: recurring refrain alternating with episodes (ABACA or ABACABA). Theme and variations: a theme followed by varied repetitions.',
        params: {
          choiceSets: [
            [
              { label: 'ABACABA is a rondo in seven parts', correct: true },
              { label: 'ABACABA is a ternary form in three parts', correct: false },
              { label: 'ABACABA is a binary form in two parts', correct: false },
              { label: 'ABACABA is a sonata form in three parts', correct: false },
            ],
            [
              { label: 'Each variation keeps the theme recognizable while changing other elements', correct: true },
              { label: 'Each variation must keep the melody and the rhythm exactly the same', correct: false },
              { label: 'Each variation must move to a new key and never keep the original one', correct: false },
              { label: 'Each variation replaces the theme with unrelated, completely new material', correct: false },
            ],
            [
              { label: 'The rondo refrain (A) usually returns in the tonic key', correct: true },
              { label: 'The rondo refrain (A) moves to a new key every time it returns', correct: false },
              { label: 'The rondo episodes must all stay in the tonic key', correct: false },
              { label: 'The rondo refrain is completely rewritten every time', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about sonata form is true?',
        hintTemplate: 'Sonata form: Exposition (theme 1 in tonic, theme 2 in dominant), Development (fragmentation, modulation), Recapitulation (both themes in tonic).',
        params: {
          choiceSets: [
            [
              { label: 'The exposition has two theme groups: the first in the tonic, the second in a contrasting key', correct: true },
              { label: 'The exposition has two theme groups, and both of them stay in the tonic key from start to finish', correct: false },
              { label: 'The exposition has only one theme, which is then varied in the tonic key', correct: false },
              { label: 'The exposition is the middle section, between development and recapitulation', correct: false },
            ],
            [
              { label: 'The development fragments the themes and moves through several keys', correct: true },
              { label: 'The development repeats the exposition exactly, note for note, in the tonic', correct: false },
              { label: 'The development introduces only new themes, never earlier ones', correct: false },
              { label: 'The development stays in the tonic key from start to finish', correct: false },
            ],
            [
              { label: 'In the recapitulation, the second theme returns in the tonic, not the dominant', correct: true },
              { label: 'In the recapitulation, the second theme returns in the dominant, not the tonic', correct: false },
              { label: 'In the recapitulation, the second theme is left out altogether', correct: false },
              { label: 'The recapitulation repeats the exposition exactly, keys and all', correct: false },
            ],
            [
              { label: 'In a major-key sonata, the second theme is usually in the dominant (V)', correct: true },
              { label: 'In a major-key sonata, the second theme is usually in the subdominant (IV)', correct: false },
              { label: 'In a major-key sonata, the second theme is usually in the relative minor (vi)', correct: false },
              { label: 'In a major-key sonata, the second theme stays in the tonic (I)', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l5u17m3: Texture ----
  // No generated template: the template set has no item teaching texture types
  // (monophony, homophony, polyphony, etc.). This module relies on its
  // hand-authored exercises only. Coverage gap acknowledged in the WS5 audit (L5 E1).

  // ---- l5u17m4: Guide Tone Lines ----
  // No generated template: the template set has no item teaching guide-tone lines
  // (3rds and 7ths through progressions). This module relies on its hand-authored
  // exercises only. Coverage gap acknowledged in the WS5 audit (L5 E1).
];

export default templates;
