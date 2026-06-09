import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 5 Templates — 14 modules, ~75 generated exercises
// Focus: Secondary dominants, tonicization, modulation, mode mixture,
//        musical form
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
        promptTemplate: 'Build a {root} major triad.',
        hintTemplate: 'A major triad: root + major 3rd + perfect 5th. This chord quality is used for secondary dominants like V/V.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A', 'E'],
          accidentals: ['', '', '', '', '', ''],
          chordQualities: ['major'],
          noteCounts: [3],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the function and resolution of V/V.',
        hintTemplate: 'V/V tonicizes the dominant chord. It contains a chromatic alteration (raised 4th scale degree) and resolves to V.',
        params: {
          choiceSets: [
            [
              { label: 'V/V contains the raised 4th scale degree and resolves to V', correct: true },
              { label: 'V/V contains the lowered 7th and resolves to IV', correct: false },
              { label: 'V/V is the same as the IV chord', correct: false },
              { label: 'V/V resolves to I', correct: false },
            ],
            [
              { label: 'In C major, V/V is D major (D-F#-A) resolving to G major', correct: true },
              { label: 'In C major, V/V is F major resolving to G', correct: false },
              { label: 'In C major, V/V is A major resolving to D', correct: false },
              { label: 'In C major, V/V is B major resolving to C', correct: false },
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
        promptTemplate: 'Build a {root} dominant 7th chord (the chord quality used for every secondary dominant).',
        hintTemplate: 'A secondary dominant is a dominant 7th built a perfect 5th above the chord it tonicizes. Here just build {root}7: root + major 3rd + perfect 5th + minor 7th. For example, A7 (A-C#-E-G) is V7/ii in C major, tonicizing D minor.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A'],
          accidentals: ['', '', '', '', ''],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify which chord is being tonicized by this secondary dominant.',
        hintTemplate: 'Each secondary dominant targets a specific diatonic chord. V7/ii resolves to ii, V7/IV resolves to IV, V7/vi resolves to vi, etc.',
        params: {
          choiceSets: [
            [
              { label: 'V7/vi in C major is E7 (E-G#-B-D), resolving to A minor', correct: true },
              { label: 'V7/vi in C major resolves to F major', correct: false },
              { label: 'V7/vi in C major is D7', correct: false },
              { label: 'V7/vi resolves to the dominant', correct: false },
            ],
            [
              { label: 'V7/IV in C major is C7 (C-E-G-Bb), resolving to F major', correct: true },
              { label: 'V7/IV in C major is F7', correct: false },
              { label: 'V7/IV resolves to G major', correct: false },
              { label: 'V7/IV contains no chromatic alterations', correct: false },
            ],
            [
              { label: 'V7/ii in C major is A7 (A-C#-E-G), resolving to D minor', correct: true },
              { label: 'V7/ii resolves to C major', correct: false },
              { label: 'V7/ii in C major is B7', correct: false },
              { label: 'V7/ii is the same as V/V', correct: false },
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
        promptTemplate: 'Identify the secondary leading-tone chord and its resolution.',
        hintTemplate: 'Secondary leading-tone chords (vii°/x) function like secondary dominants but are diminished. They resolve up by half step to their target chord.',
        params: {
          choiceSets: [
            [
              { label: 'vii°7/V in C major is F#dim7, resolving up to G', correct: true },
              { label: 'vii°7/V in C major is Bdim7', correct: false },
              { label: 'vii°7/V resolves down to F', correct: false },
              { label: 'vii°7/V is the same as V/V', correct: false },
            ],
            [
              { label: 'Secondary leading-tone chords have their root a half step below the target chord', correct: true },
              { label: 'They have their root a 5th above the target', correct: false },
              { label: 'They have their root a 4th below the target', correct: false },
              { label: 'The root placement is random', correct: false },
            ],
            [
              { label: 'vii°/x can be either a diminished triad or a fully diminished 7th chord', correct: true },
              { label: 'vii°/x is always a major chord', correct: false },
              { label: 'vii°/x is always a minor 7th chord', correct: false },
              { label: 'vii°/x must be a half-diminished chord', correct: false },
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
        promptTemplate: 'Distinguish between tonicization and modulation.',
        hintTemplate: 'Tonicization is a brief, momentary emphasis on a non-tonic chord (lasting 1-2 chords). Modulation is a more permanent shift to a new key (confirmed by a cadence in the new key).',
        params: {
          choiceSets: [
            [
              { label: 'Tonicization temporarily emphasizes a chord; modulation establishes a new key with a cadence', correct: true },
              { label: 'Tonicization and modulation mean the same thing', correct: false },
              { label: 'Tonicization requires a cadence in the new key', correct: false },
              { label: 'Modulation never uses chromatic chords', correct: false },
            ],
            [
              { label: 'A single secondary dominant followed by its target is tonicization, not modulation', correct: true },
              { label: 'One secondary dominant always creates a modulation', correct: false },
              { label: 'Tonicization requires at least 8 measures in the new key', correct: false },
              { label: 'There is no practical difference between the two', correct: false },
            ],
            [
              { label: 'Modulation is confirmed when the music cadences in the new key', correct: true },
              { label: 'Modulation requires changing the time signature', correct: false },
              { label: 'Modulation only happens at the end of a piece', correct: false },
              { label: 'Modulation never involves chromatic notes', correct: false },
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
        promptTemplate: 'Analyze this chain of secondary dominants.',
        hintTemplate: 'A dominant chain links secondary dominants: e.g., V7/vi -> V7/ii -> V7/V -> V7 -> I. Each dominant resolves to the next, creating chromatic motion toward the tonic.',
        params: {
          choiceSets: [
            [
              { label: 'In a dominant chain, each chord acts as V7 of the next chord', correct: true },
              { label: 'A dominant chain uses only diatonic chords', correct: false },
              { label: 'A dominant chain always moves in ascending 5ths', correct: false },
              { label: 'Dominant chains are limited to 2 chords', correct: false },
            ],
            [
              { label: 'The chain V7/vi -> V7/ii -> V7/V -> V -> I moves through descending 5ths', correct: true },
              { label: 'This chain moves through ascending 3rds', correct: false },
              { label: 'This chain has no pattern', correct: false },
              { label: 'This chain moves through ascending 5ths', correct: false },
            ],
            [
              { label: 'Extended tonicization using dominant chains creates chromatic bass motion', correct: true },
              { label: 'Dominant chains never produce chromatic motion', correct: false },
              { label: 'The bass always stays diatonic in dominant chains', correct: false },
              { label: 'Dominant chains only use root-position chords', correct: false },
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
        promptTemplate: 'Analyze this pivot chord modulation.',
        hintTemplate: 'A pivot chord belongs to both the old and new keys. It reinterprets a diatonic chord: e.g., IV in C = I in F. The pivot is the hinge between two key areas.',
        params: {
          choiceSets: [
            [
              { label: 'A pivot chord functions diatonically in both the old key and the new key', correct: true },
              { label: 'A pivot chord must be chromatic', correct: false },
              { label: 'A pivot chord only exists in minor keys', correct: false },
              { label: 'A pivot chord is always V7', correct: false },
            ],
            [
              { label: 'When modulating from C to G, the C major chord can pivot as IV in G', correct: true },
              { label: 'C major cannot function as a pivot chord', correct: false },
              { label: 'Pivots only work between relative keys', correct: false },
              { label: 'The pivot must be a diminished chord', correct: false },
            ],
            [
              { label: 'Closely related keys (differing by 1 sharp/flat) share the most pivot chords', correct: true },
              { label: 'Distant keys have more pivot chords', correct: false },
              { label: 'All keys share the same number of pivot chords', correct: false },
              { label: 'Pivot chords only work between parallel keys', correct: false },
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
          // Relative minors of common major keys: C->Am, G->Em, F->Dm, D->Bm, A->F#m, E->C#m.
          // Each is a genuine closely related key of its relative major.
          roots: ['A', 'E', 'D', 'B', 'F', 'C'],
          accidentals: ['', '', '', '', '#', '#'],
          scaleTypes: ['natural_minor'],
          noteCounts: [7],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the closely related keys for this tonic key.',
        hintTemplate: 'Each major key has 5 closely related keys: the dominant, subdominant, and the relative minors of all three (tonic, dominant, subdominant).',
        params: {
          choiceSets: [
            [
              { label: 'C major has closely related keys: G major, F major, A minor, E minor, D minor', correct: true },
              { label: 'C major is closely related to Db major and B major', correct: false },
              { label: 'C major has no closely related keys', correct: false },
              { label: 'C major is closely related to Ab major and Eb major', correct: false },
            ],
            [
              { label: 'G major has closely related keys: D major, C major, E minor, B minor, A minor', correct: true },
              { label: 'G major is closely related to Gb major', correct: false },
              { label: 'G major is only related to C major', correct: false },
              { label: 'G major is closely related to F major', correct: false },
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
        promptTemplate: 'Identify the characteristics of this modulation technique.',
        hintTemplate: 'Direct (phrase) modulation changes key abruptly at a phrase boundary without a pivot chord. Common in pop music and hymns.',
        params: {
          choiceSets: [
            [
              { label: 'A direct modulation shifts to a new key at a phrase boundary without a pivot chord', correct: true },
              { label: 'A direct modulation always uses a pivot chord', correct: false },
              { label: 'A direct modulation is the same as tonicization', correct: false },
              { label: 'A direct modulation only goes up by half step', correct: false },
            ],
            [
              { label: 'The "truck driver" modulation shifts up by half or whole step for dramatic effect', correct: true },
              { label: 'The truck driver modulation always goes to the dominant', correct: false },
              { label: 'This technique is unique to classical music', correct: false },
              { label: 'This modulation always descends', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How does common-tone modulation work?',
        hintTemplate: 'Common-tone modulation sustains a single pitch that is reinterpreted in the new key. Often used for remote modulations where few pivot chords exist.',
        params: {
          choiceSets: [
            [
              { label: 'Common-tone modulation sustains one note that becomes a different scale degree in the new key', correct: true },
              { label: 'Common-tone modulation requires all notes to be in common', correct: false },
              { label: 'Common-tone modulation never involves held notes', correct: false },
              { label: 'Common-tone modulation is the same as pivot chord modulation', correct: false },
            ],
            [
              { label: 'Common-tone modulation is especially useful for distant keys that share few chords', correct: true },
              { label: 'Common-tone modulation only works for closely related keys', correct: false },
              { label: 'This technique requires chromatic sequences', correct: false },
              { label: 'This technique is limited to relative major/minor', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze this chromatic modulation technique.',
        hintTemplate: 'Chromatic modulation uses a chromatic alteration to smoothly lead into the new key. One voice moves by half step from a diatonic note to a chromatic one in the new key.',
        params: {
          choiceSets: [
            [
              { label: 'Chromatic modulation features a voice moving by half step from a diatonic to a chromatic pitch', correct: true },
              { label: 'Chromatic modulation avoids all half steps', correct: false },
              { label: 'Chromatic modulation requires a pivot chord', correct: false },
              { label: 'Chromatic modulation always moves between parallel keys', correct: false },
            ],
            [
              { label: 'The chromatic alteration typically introduces the leading tone or a chord tone of the new key', correct: true },
              { label: 'The chromatic note is always the tonic of the new key', correct: false },
              { label: 'Chromatic modulation never involves leading tones', correct: false },
              { label: 'The alteration must be in the bass voice', correct: false },
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
          // Genuine parallel-minor borrowings IN A FIXED C major context:
          // Ab=bVI, Eb=bIII, Bb=bVII (major triads); F minor=iv.
          roots: ['A', 'E', 'B', 'F'],
          accidentals: ['b', 'b', 'b', ''],
          chordQualities: ['major', 'major', 'major', 'minor'],
          noteCounts: [3],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify this borrowed chord from the parallel minor.',
        hintTemplate: 'Common borrowed chords in major: iv (minor iv), bVI (flat-six major), bVII (flat-seven major), bIII. They add a darker color to a major key.',
        params: {
          choiceSets: [
            [
              { label: 'The bVI chord in C major is Ab major (borrowed from C minor)', correct: true },
              { label: 'The bVI chord in C major is F# major', correct: false },
              { label: 'The bVI chord in C major is A major', correct: false },
              { label: 'bVI does not exist in mode mixture', correct: false },
            ],
            [
              { label: 'The iv chord in C major is F minor (borrowed from C minor)', correct: true },
              { label: 'The iv chord in C major is F major unchanged', correct: false },
              { label: 'The iv chord in C major is A minor', correct: false },
              { label: 'Mode mixture cannot alter the subdominant', correct: false },
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
        promptTemplate: 'Classify this musical form based on its structure.',
        hintTemplate: 'Binary: two sections (AB). Ternary: three sections (ABA). Rounded binary: A modulates, B develops, A returns (||:A:||:BA:||).',
        params: {
          choiceSets: [
            [
              { label: 'A piece with two contrasting sections (AB) with both repeated is simple binary form', correct: true },
              { label: 'AB form is ternary', correct: false },
              { label: 'AB form is through-composed', correct: false },
              { label: 'AB form is rondo', correct: false },
            ],
            [
              { label: 'ABA form where the first section returns is ternary form', correct: true },
              { label: 'ABA form is binary', correct: false },
              { label: 'ABA form is strophic', correct: false },
              { label: 'ABA form is through-composed', correct: false },
            ],
            [
              { label: 'Rounded binary features the return of A material at the end of the B section', correct: true },
              { label: 'Rounded binary has three completely independent sections', correct: false },
              { label: 'Rounded binary never modulates', correct: false },
              { label: 'Rounded binary is the same as simple binary', correct: false },
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
        promptTemplate: 'Identify the characteristics of this musical form.',
        hintTemplate: 'Rondo: recurring refrain alternating with episodes (ABACA or ABACABA). Theme and variations: a theme followed by varied repetitions.',
        params: {
          choiceSets: [
            [
              { label: 'ABACABA is a seven-part rondo form', correct: true },
              { label: 'ABACABA is a ternary form', correct: false },
              { label: 'ABACABA is a binary form', correct: false },
              { label: 'ABACABA is sonata form', correct: false },
            ],
            [
              { label: 'In theme and variations, each variation preserves the harmonic structure while changing other elements', correct: true },
              { label: 'Variations must keep the exact melody', correct: false },
              { label: 'Variations always change the key', correct: false },
              { label: 'Variations never change the rhythm', correct: false },
            ],
            [
              { label: 'The rondo refrain (A) typically stays in the tonic key', correct: true },
              { label: 'The refrain modulates to a new key each time', correct: false },
              { label: 'Episodes must stay in the tonic key', correct: false },
              { label: 'The refrain is always different each time', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about sonata form structure.',
        hintTemplate: 'Sonata form: Exposition (theme 1 in tonic, theme 2 in dominant), Development (fragmentation, modulation), Recapitulation (both themes in tonic).',
        params: {
          choiceSets: [
            [
              { label: 'The exposition presents two theme groups: the first in tonic, the second in a contrasting key', correct: true },
              { label: 'The exposition only has one theme', correct: false },
              { label: 'Both themes are in the tonic key', correct: false },
              { label: 'The exposition is the middle section', correct: false },
            ],
            [
              { label: 'The development section fragments and develops themes through modulation and sequence', correct: true },
              { label: 'The development simply repeats the exposition', correct: false },
              { label: 'The development introduces entirely new themes', correct: false },
              { label: 'The development stays in the tonic key', correct: false },
            ],
            [
              { label: 'In the recapitulation, the second theme returns in the tonic key instead of the dominant', correct: true },
              { label: 'The recapitulation repeats the exposition exactly', correct: false },
              { label: 'The recapitulation is in the dominant key', correct: false },
              { label: 'The second theme is omitted in the recapitulation', correct: false },
            ],
            [
              { label: 'In a major key sonata, the second theme is typically in the dominant (V)', correct: true },
              { label: 'The second theme is always in the subdominant (IV)', correct: false },
              { label: 'The second theme is always in the relative minor', correct: false },
              { label: 'The second theme stays in the tonic', correct: false },
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
