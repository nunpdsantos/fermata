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
        promptTemplate: 'Which statement about V/V is true?',
        hintTemplate: 'V/V tonicizes the dominant chord. It contains a chromatic alteration (raised 4th scale degree) and resolves to V.',
        params: {
          choiceSets: [
            [
          { label: 'In F major, V/V contains B, which resolves to C', correct: true },
          { label: 'In F major, V/V contains B, which resolves to D', correct: false },
          { label: 'In F major, V/V contains B, which resolves to A', correct: false },
          { label: 'In F major, V/V contains B, which resolves to F', correct: false },
        ],
            [
              { label: 'In F major, V/V is G major (G–B–D) and resolves to C major', correct: true },
              { label: 'In F major, V/V is G minor (G–Bb–D) and resolves to C major', correct: false },
              { label: 'In F major, V/V is C major (C–E–G) and resolves to F major', correct: false },
              { label: 'In F major, V/V is C minor (C–Eb–G) and resolves to C major', correct: false },
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
              { label: 'V7/IV in E major is E7 (E–G#–B–D) and resolves to A major', correct: true },
              { label: 'V7/IV in E major is B7 (B–D#–F#–A) and resolves to E major', correct: false },
              { label: 'V7/IV in E major is E7 (E–G#–B–D) and resolves to B major', correct: false },
              { label: 'V7/IV in E major is F#7 (F#–A#–C#–E) and resolves to B major', correct: false },
            ],
            [
              { label: 'V7/ii in C major is A7 (A-C#-E-G), leading to D minor', correct: true },
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
          { label: 'In G major, vii°7/V is C#–E–G–Bb resolving to D', correct: true },
          { label: 'In G major, vii°7/V is F#–A–C–Eb resolving to G', correct: false },
          { label: 'In G major, vii°7/V is C#–E–G–Bb resolving to C', correct: false },
          { label: 'In G major, vii°7/V is D#–F#–A–C resolving to E', correct: false },
        ],
            [
          { label: 'Their root is one semitone below the tonic they lead into', correct: true },
          { label: 'Their root is one semitone above the tonic they lead into', correct: false },
          { label: 'Their root is one whole tone below the tonic they lead into', correct: false },
          { label: 'Their root is one whole tone above the tonic they lead into', correct: false },
        ],
            [
          { label: "The possible types are a diminished triad, a half-diminished seventh or a diminished seventh", correct: true },
          { label: 'The possible types are a major triad, a dominant seventh or a major seventh', correct: false },
          { label: 'The possible types are a minor triad, a minor seventh or a half-diminished seventh', correct: false },
          { label: 'The possible types are a major triad, a half-diminished seventh or a diminished seventh', correct: false },
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
        hintTemplate: 'Tonicization is a usually brief emphasis on a non-tonic chord, often just a secondary dominant and its target. Modulation is a more lasting shift to a new key, confirmed by a cadence in that key.',
        params: {
          choiceSets: [
            [
          { label: "Tonicization briefly stresses a chord; modulation confirms a new key with a cadence", correct: true },
          { label: "Tonicization confirms a new key with a cadence; modulation briefly stresses a chord", correct: false },
          { label: "Tonicization and modulation both confirm a new key with a cadence", correct: false },
          { label: "Tonicization and modulation both briefly stress a chord without confirming a new key", correct: false },
        ],
            [
          { label: "A single secondary dominant and its target is a tonicization", correct: true },
          { label: 'A single secondary dominant and its target is a modulation', correct: false },
          { label: 'A single secondary dominant and its target is a deceptive cadence', correct: false },
          { label: 'A single secondary dominant and its target is a plagal cadence', correct: false },
        ],
            [
          { label: "A modulation is confirmed when the music cadences in the new key", correct: true },
          { label: "A modulation is confirmed when the music cadences in the original key", correct: false },
          { label: 'A modulation is confirmed when the music returns to the original tonic without a cadence in the new key', correct: false },
          { label: 'A modulation is confirmed when the music emphasizes a chord briefly without a cadence in the new key', correct: false },
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
        hintTemplate: 'A dominant chain links secondary dominants: e.g., V7/vi → V7/ii → V7/V → V7 → I. Each dominant resolves to the next, creating chromatic motion toward the tonic.',
        params: {
          choiceSets: [
            [
              { label: 'In a dominant chain, each chord acts as V7 of the chord that follows', correct: true },
              { label: 'In a dominant chain, each chord acts as IV of the chord that follows', correct: false },
              { label: 'In a dominant chain, each chord acts as ii7 of the chord that follows', correct: false },
              { label: 'In a dominant chain, each chord acts as vi7 of the chord that follows', correct: false },
            ],
            [
          { label: "The chain V7/vi → V7/ii → V7/V → V → I moves by descending 5ths", correct: true },
          { label: "The chain V7/vi → V7/ii → V7/V → V → I moves by descending 3rds", correct: false },
          { label: "The chain V7/vi → V7/ii → V7/V → V → I moves by descending 2nds", correct: false },
          { label: "The chain V7/vi → V7/ii → V7/V → V → I moves by descending 4ths", correct: false },
        ],
            [
              { label: 'Each applied dominant usually adds a chromatic note: the leading tone of its target', correct: true },
              { label: "Each applied dominant usually adds a chromatic note: the subtonic of its target", correct: false },
              { label: "Each applied dominant often raises its 5th to create the leading tone of its target", correct: false },
              { label: "Each applied dominant typically lowers its 3rd to create the leading tone of its target", correct: false },
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
        promptTemplate: 'Which statement about diatonic pivot-chord modulation is true?',
        hintTemplate: 'A pivot chord belongs to both the old and new keys. It reinterprets a diatonic chord: e.g., IV in C = I in F. The pivot is the hinge between two key areas.',
        params: {
          choiceSets: [
            [
          { label: 'From C major to G major, A minor can serve as a diatonic pivot', correct: true },
          { label: 'From C major to G major, F major can serve as a diatonic pivot', correct: false },
          { label: 'From C major to G major, Bb major can serve as a diatonic pivot', correct: false },
          { label: 'From C major to G major, D major can serve as a diatonic pivot', correct: false },
        ],
            [
          { label: "From C to G, the C major chord can pivot as IV of G", correct: true },
          { label: "From C to G, the C major chord can pivot as V of G", correct: false },
          { label: "From C to G, the C major chord can pivot as ii of G", correct: false },
          { label: "From C to G, the C major chord can pivot as vi of G", correct: false },
        ],
            [
              { label: 'Closely related keys (at most one accidental apart) share the most pivot chords', correct: true },
              { label: 'Distant keys (many accidentals apart) share more pivot chords than closely related keys', correct: false },
              { label: 'Parallel keys (the same tonic in different modes) share more pivot chords than closely related keys', correct: false },
              { label: 'Closely related keys (at most one accidental apart) share no pivot chords in either key', correct: false },
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
          { label: "C major's closely related keys: G major, F major, A minor, E minor, D minor", correct: true },
          { label: 'C major\'s closely related keys: D major, G major, B minor, E minor, F# minor', correct: false },
          { label: 'C major\'s closely related keys: F major, Bb major, D minor, G minor, C minor', correct: false },
          { label: 'C major\'s closely related keys: Eb major, Ab major, C minor, F minor, Bb minor', correct: false },
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
        nudgeTemplate: 'Ask where the new key arrives (in the middle of a phrase or as a new phrase begins) and whether any chord prepares it. For a "truck driver" change, ask which way the key moves and what effect that has.',
        params: {
          choiceSets: [
            [
          { label: "At the start of a fresh phrase, the tonal center switches without a common chord connecting the keys", correct: true },
          { label: 'At the start of a fresh phrase, the tonal center switches through a common chord connecting the keys', correct: false },
          { label: 'At the start of a fresh phrase, the tonal center switches gradually through a prepared dominant of the new key', correct: false },
          { label: 'At the start of a fresh phrase, a chord is briefly tonicized while the original key remains established', correct: false },
        ],
            [
              { label: 'The "truck driver" modulation jumps up a half or whole step for a lift', correct: true },
              { label: 'The "truck driver" modulation moves to a new key through a shared pivot chord', correct: false },
              { label: 'The "truck driver" modulation repeats the phrase in the same key for a lift', correct: false },
              { label: 'The "truck driver" modulation lowers the key by a half or whole step to relax the tension', correct: false },
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
          { label: "A sustained pitch changes its role when the surrounding harmony establishes a different tonic", correct: true },
          { label: "A sustained pitch keeps its scale-degree role when the surrounding harmony establishes a different tonic", correct: false },
          { label: "A sustained pitch becomes the tonic whenever the surrounding harmony establishes a different key", correct: false },
          { label: "A sustained pitch becomes the dominant whenever the surrounding harmony establishes a different key", correct: false },
        ],
            [
              { label: 'The connecting pitch stays the same; the keys need not share a chord', correct: true },
              { label: 'The connecting pitch changes by a semitone; the keys need not share a chord', correct: false },
              { label: 'The connecting pitch stays the same; the keys must share a chord', correct: false },
              { label: 'The connecting pitch changes by a semitone; the keys must share a chord', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about chromatic modulation is true?',
        hintTemplate: 'Chromatic modulation uses a chromatic alteration to smoothly lead into the new key. One voice moves by half step from a diatonic note to a chromatic one in the new key.',
        nudgeTemplate: 'Chromatic modulation alters one note of a chord to steer into the new key. Follow the voice that carries the alteration: how far does it travel, and what role does the altered note take in the new key?',
        params: {
          choiceSets: [
            [
              { label: 'One voice moves by half step from a diatonic note to a chromatic one', correct: true },
              { label: 'One voice leaps by a tritone from a diatonic note to a chromatic one', correct: false },
              { label: 'The altered chord keeps the same function in both keys, so nothing is reinterpreted', correct: false },
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
        hintTemplate: 'Binary: two sections (AB). Ternary: three sections (ABA). Rounded binary: A often ends on V or in another key; after contrasting material, A material returns within the second section (||:A:||:B A\':||).',
        params: {
          choiceSets: [
            [
              { label: 'Two contrasting sections, each repeated (||:A:||:B:||), is simple binary form', correct: true },
              { label: 'Two contrasting sections, each repeated (||:A:||:B:||), is ternary form', correct: false },
              { label: 'Two contrasting sections, each repeated (||:A:||:B:||), is rondo form', correct: false },
              { label: 'Two contrasting sections, each repeated (||:A:||:B:||), is rounded binary form', correct: false },
            ],
            [
          { label: "ABA, where the first section returns after a contrast, is ternary form", correct: true },
          { label: 'ABA, where the first section returns after a contrast, is rondo form', correct: false },
          { label: 'ABA, where the first section returns after a contrast, is strophic form', correct: false },
          { label: 'ABA, where the first section returns after a contrast, is through-composed form', correct: false },
        ],
            [
              { label: 'Rounded binary always brings back A material at the end of the B section', correct: true },
              { label: 'Rounded binary always brings back B material at the end of the A section', correct: false },
              { label: 'Rounded binary always keeps the A material out of the B section', correct: false },
              { label: 'Rounded binary always brings back A as a separate section after the B section', correct: false },
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
          { label: 'ABACABA is a seven-part rondo', correct: true },
          { label: 'ABACABA is a seven-part theme and variations', correct: false },
          { label: 'ABACABA is a seven-part strophic form', correct: false },
          { label: 'ABACABA is a seven-part through-composed form', correct: false },
        ],
            [
              { label: 'Each variation keeps the theme recognizable while changing other elements', correct: true },
              { label: 'Each variation keeps the theme recognizable by repeating every musical element unchanged', correct: false },
              { label: 'Each variation replaces the theme with unrelated material while changing other elements', correct: false },
              { label: 'Each variation replaces the theme with unrelated material while keeping the other elements unchanged', correct: false },
            ],
            [
          { label: "When A comes back in a rondo, it normally brings the music home tonally", correct: true },
          { label: "When A comes back in a rondo, it normally keeps the music away from the home key", correct: false },
          { label: "When A comes back in a rondo, it normally makes the home key sound like the dominant of the preceding episode", correct: false },
          { label: "When A comes back in a rondo, it normally confirms the preceding episode as the new home key", correct: false },
        ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about sonata form is true?',
        hintTemplate: 'Sonata form: the exposition contrasts a tonic theme with a second key (usually the dominant in major, the relative major in minor); the development fragments and modulates; the recapitulation brings the second theme back in the tonic.',
        params: {
          choiceSets: [
            [
          { label: "The exposition has two theme groups: the first in the tonic, the second in a contrasting key", correct: true },
          { label: "The exposition has two theme groups: the first in a contrasting key, the second in the tonic", correct: false },
          { label: "The exposition has two theme groups: the first and second in the tonic, without a contrasting key", correct: false },
          { label: "The exposition has two theme groups: the first and second in a contrasting key, without the tonic", correct: false },
        ],
            [
              { label: 'The development fragments the themes and moves through several keys', correct: true },
              { label: 'The development repeats the exposition exactly, note for note, in the tonic', correct: false },
              { label: 'The development introduces only new themes, never earlier ones', correct: false },
              { label: 'The development stays in the tonic key from start to finish', correct: false },
            ],
            [
          { label: "In the recapitulation, the second theme returns in the tonic, not the dominant", correct: true },
          { label: "In the recapitulation, the second theme returns in the dominant, not the tonic", correct: false },
          { label: "In the recapitulation, the second theme returns in the subdominant, not the tonic", correct: false },
          { label: "In the recapitulation, the second theme returns in the supertonic, not the tonic", correct: false },
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
