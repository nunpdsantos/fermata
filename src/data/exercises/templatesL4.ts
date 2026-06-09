import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 4 Templates — 11 module configs (Unit 14 counterpoint pooled onto
// l4u14m1; see the Unit 14 note below). Modules without a config fall back to
// hand-authored exercises in exercisesL4.ts.
// Focus: Advanced non-chord tones, dominant seventh, harmonic function,
//        sequences, counterpoint
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 12: Advanced Non-Chord Tones and Dominant Seventh
  // =========================================================================

  // ---- l4u12m1: Suspensions ----
  {
    moduleId: 'l4u12m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze this suspension figure and its resolution.',
        hintTemplate: 'Suspensions: 4-3 resolves to a 3rd, 7-6 to a 6th, 9-8 to an octave. The bass suspension 2-3 resolves downward (the bass descends by step; the interval above the bass grows from a 2nd to a 3rd). Chain suspensions create sequences.',
        params: {
          choiceSets: [
            [
              { label: 'A chain of 7-6 suspensions creates a descending stepwise motion in the upper voice', correct: true },
              { label: 'A chain of suspensions always ascends', correct: false },
              { label: 'Chain suspensions are prohibited in classical style', correct: false },
              { label: 'A chain of suspensions requires no preparation', correct: false },
            ],
            [
              { label: 'A decorated suspension adds a passing or neighbor tone between the suspension and resolution', correct: true },
              { label: 'A decorated suspension skips the resolution entirely', correct: false },
              { label: 'A decorated suspension is always chromatic', correct: false },
              { label: 'A decorated suspension resolves upward', correct: false },
            ],
            [
              { label: 'The suspension must be prepared as a consonance and held as a dissonance', correct: true },
              { label: 'Suspensions can appear without preparation in all styles', correct: false },
              { label: 'The suspension is always consonant', correct: false },
              { label: 'Suspensions can only occur in the soprano', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u12m2: Appoggiatura / Escape Tone ----
  {
    moduleId: 'l4u12m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Distinguish between these non-chord tone types based on approach and departure.',
        hintTemplate: 'Appoggiatura: leap to dissonance, step to resolution. Escape tone: step to dissonance, leap away. Both are typically accented.',
        params: {
          choiceSets: [
            [
              { label: 'An accented dissonance approached by leap and resolved by step = appoggiatura', correct: true },
              { label: 'This is an escape tone', correct: false },
              { label: 'This is a passing tone', correct: false },
              { label: 'This is a suspension', correct: false },
            ],
            [
              { label: 'An escape tone is approached by step and left by leap in the opposite direction', correct: true },
              { label: 'An escape tone is approached by leap and left by step', correct: false },
              { label: 'An escape tone is the same as an anticipation', correct: false },
              { label: 'An escape tone must resolve to the same note it departed from', correct: false },
            ],
            [
              { label: 'An unprepared appoggiatura is a hallmark of Romantic-era expression', correct: true },
              { label: 'Appoggiaturas are forbidden in Romantic music', correct: false },
              { label: 'Appoggiaturas must always be prepared like suspensions', correct: false },
              { label: 'Appoggiaturas only occur in the bass voice', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u12m3: Pedal Point ----
  {
    moduleId: 'l4u12m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about pedal points and their harmonic function.',
        hintTemplate: 'Pedal points are sustained or repeated notes (typically tonic or dominant in the bass) that create dissonances with changing harmonies above.',
        params: {
          choiceSets: [
            [
              { label: 'A double pedal sustains both tonic and dominant simultaneously', correct: true },
              { label: 'A double pedal uses two different keys', correct: false },
              { label: 'A double pedal always resolves to a single note', correct: false },
              { label: 'A double pedal is the same as a drone', correct: false },
            ],
            [
              { label: 'An inverted pedal occurs in an upper voice rather than the bass', correct: true },
              { label: 'An inverted pedal descends instead of sustaining', correct: false },
              { label: 'An inverted pedal changes pitch every measure', correct: false },
              { label: 'Inverted pedals are never found in classical music', correct: false },
            ],
            [
              { label: 'A pedal point typically begins and ends as a consonance with dissonance in between', correct: true },
              { label: 'A pedal point is always dissonant throughout', correct: false },
              { label: 'A pedal point never creates dissonance', correct: false },
              { label: 'A pedal point must last exactly 4 measures', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u12m4: V7 Resolution Rules ----
  {
    moduleId: 'l4u12m4',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root} dominant seventh chord.',
        hintTemplate: 'A dominant seventh chord: major triad + minor 7th. The 7th resolves down, the leading tone resolves up.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A', 'E', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How does the V7 chord resolve to I?',
        hintTemplate: 'In V7 to I: the leading tone resolves up to tonic, the 7th resolves down by step, the 5th of V can move to the root of I, the root of V can move to the root of I.',
        params: {
          choiceSets: [
            [
              { label: 'The tritone in V7 (between the 3rd and 7th) resolves by contrary motion: 3rd up, 7th down', correct: true },
              { label: 'The tritone resolves by parallel motion', correct: false },
              { label: 'The tritone does not resolve', correct: false },
              { label: 'Both notes of the tritone resolve downward', correct: false },
            ],
            [
              { label: 'In a V7-I resolution, the I chord often lacks the 5th to allow proper voice leading', correct: true },
              { label: 'The I chord must always be complete after V7', correct: false },
              { label: 'V7-I always produces parallel 5ths', correct: false },
              { label: 'The root of V7 must resolve to the 3rd of I', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u12m5: V7 Inversions ----
  {
    moduleId: 'l4u12m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the inversion of this V7 chord based on which chord tone is in the bass.',
        hintTemplate: 'V7 inversions: root pos (V7), 1st inv = V6/5 (3rd/leading tone in bass), 2nd inv = V4/3 (5th in bass), 3rd inv = V4/2 (7th in bass).',
        params: {
          choiceSets: [
            [
              { label: 'V6/5 has the leading tone in the bass, creating strong resolution up to I', correct: true },
              { label: 'V6/5 has the 5th in the bass', correct: false },
              { label: 'V6/5 has the 7th in the bass', correct: false },
              { label: 'V6/5 has the root in the bass', correct: false },
            ],
            [
              { label: 'V4/2 has the 7th in the bass and typically resolves to I6', correct: true },
              { label: 'V4/2 has the root in the bass', correct: false },
              { label: 'V4/2 has the 3rd in the bass', correct: false },
              { label: 'V4/2 resolves to V in root position', correct: false },
            ],
            [
              { label: 'V4/3 has the 5th in the bass and can resolve to I or I6', correct: true },
              { label: 'V4/3 has the leading tone in the bass', correct: false },
              { label: 'V4/3 has the 7th in the bass', correct: false },
              { label: 'V4/3 has the root in the bass', correct: false },
            ],
          ],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'Build the dominant seventh chord on {root}. This chord wants to resolve to a key a 5th below.',
        hintTemplate: 'A dominant seventh on {root}: {root} + major 3rd + perfect 5th + minor 7th. This chord resolves down a 5th (or up a 4th) to its tonic.',
        params: {
          roots: ['G', 'D', 'A', 'E', 'C', 'F', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 13: Harmonic Function and Sequences
  // =========================================================================

  // ---- l4u13m1: Pre-Dominant Sevenths ----
  {
    moduleId: 'l4u13m1',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root} minor seventh chord.',
        hintTemplate: 'A minor seventh chord: minor triad + minor 7th. It functions as a pre-dominant, leading to V or V7.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A', 'E'],
          accidentals: ['', '', '', '', '', ''],
          chordQualities: ['minor7'],
          noteCounts: [4],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How does the pre-dominant function work in harmonic progressions?',
        hintTemplate: 'Pre-dominant chords (ii, IV, ii7, IV7) prepare the dominant. They typically move T -> PD -> D -> T (tonic -> pre-dominant -> dominant -> tonic).',
        params: {
          choiceSets: [
            [
              { label: 'The standard harmonic progression is T -> PD -> D -> T', correct: true },
              { label: 'Pre-dominants always come after the dominant', correct: false },
              { label: 'Pre-dominants resolve directly to tonic', correct: false },
              { label: 'Only major chords can function as pre-dominants', correct: false },
            ],
            [
              { label: 'IV and ii (or their seventh chord forms) are the primary pre-dominant chords', correct: true },
              { label: 'Only the V chord functions as pre-dominant', correct: false },
              { label: 'iii is the primary pre-dominant chord', correct: false },
              { label: 'vi is the only pre-dominant chord', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u13m2: Harmonic Function Categories ----
  {
    moduleId: 'l4u13m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Classify this chord by its harmonic function: tonic, pre-dominant, or dominant.',
        hintTemplate: 'Tonic function: I, vi, iii. Pre-dominant: IV, ii. Dominant: V, vii°. These categories describe how chords function in progressions, not just their quality.',
        params: {
          choiceSets: [
            [
              { label: 'vi can substitute for I as a tonic-function chord', correct: true },
              { label: 'vi is a dominant-function chord', correct: false },
              { label: 'vi is always a pre-dominant chord', correct: false },
              { label: 'vi has no standard function', correct: false },
            ],
            [
              { label: 'vii° functions as a dominant because it shares 3 notes with V7', correct: true },
              { label: 'vii° functions as a tonic chord', correct: false },
              { label: 'vii° functions as a pre-dominant chord', correct: false },
              { label: 'vii° has no harmonic function', correct: false },
            ],
            [
              { label: 'iii can function as tonic (sharing 2 notes with I) or as dominant preparation', correct: true },
              { label: 'iii is always a dominant chord', correct: false },
              { label: 'iii is always a pre-dominant chord', correct: false },
              { label: 'iii is never used in common-practice harmony', correct: false },
            ],
            [
              { label: 'In the deceptive cadence V-vi, vi substitutes for I as a tonic-function chord', correct: true },
              { label: 'In V-vi, vi acts as a dominant chord', correct: false },
              { label: 'V-vi is not a real cadence', correct: false },
              { label: 'vi always rejects tonic function', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l4u13m3: Harmonic Rhythm ----
  {
    moduleId: 'l4u13m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about harmonic rhythm.',
        hintTemplate: 'Harmonic rhythm is the rate at which chords change. It can accelerate toward cadences, creating a sense of forward motion and arrival.',
        params: {
          choiceSets: [
            [
              { label: 'Harmonic rhythm typically accelerates approaching a cadence', correct: true },
              { label: 'Harmonic rhythm always stays constant', correct: false },
              { label: 'Harmonic rhythm always slows at cadences', correct: false },
              { label: 'Harmonic rhythm only changes between sections', correct: false },
            ],
            [
              { label: 'Faster harmonic rhythm creates a greater sense of momentum', correct: true },
              { label: 'Faster harmonic rhythm creates a calmer mood', correct: false },
              { label: 'Harmonic rhythm has no effect on musical energy', correct: false },
              { label: 'Slower harmonic rhythm always indicates the climax', correct: false },
            ],
            [
              { label: 'Chords typically change on strong beats in common-practice music', correct: true },
              { label: 'Chord changes only happen on beat 1', correct: false },
              { label: 'Chords can never change mid-measure', correct: false },
              { label: 'Harmonic rhythm is always one chord per measure', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u13m4: Sequences ----
  {
    moduleId: 'l4u13m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify this type of harmonic sequence.',
        hintTemplate: 'A sequence repeats a melodic/harmonic pattern at successively higher or lower pitch levels. Common types: descending 5ths, ascending 5-6, descending 3rds.',
        params: {
          choiceSets: [
            [
              { label: 'A descending fifths sequence moves through the circle of fifths: I-IV-vii°-iii-vi-ii-V-I', correct: true },
              { label: 'A descending fifths sequence moves up by 5ths', correct: false },
              { label: 'A descending fifths sequence only uses major chords', correct: false },
              { label: 'A descending fifths sequence always modulates', correct: false },
            ],
            [
              { label: 'An ascending 5-6 sequence uses alternating 5/3 and 6/3 chords moving upward by step', correct: true },
              { label: 'An ascending 5-6 sequence uses only root-position triads', correct: false },
              { label: 'An ascending 5-6 always descends', correct: false },
              { label: 'An ascending 5-6 sequence is not a real sequence type', correct: false },
            ],
            [
              { label: 'Sequences can temporarily override normal voice-leading rules (parallel 5ths may be acceptable)', correct: true },
              { label: 'Sequences must always follow strict voice-leading rules', correct: false },
              { label: 'Parallel 5ths are never acceptable in sequences', correct: false },
              { label: 'Sequences have no relationship to voice leading', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u13m5: Common Progressions ----
  {
    moduleId: 'l4u13m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the harmonic progression pattern described.',
        hintTemplate: 'Common progressions: I-V-vi-IV, I-IV-V-I, ii-V-I, I-vi-IV-V. Each has a characteristic sound and functional logic.',
        params: {
          choiceSets: [
            [
              { label: 'I-IV-V-I follows the standard T-PD-D-T functional pattern', correct: true },
              { label: 'I-IV-V-I is not a standard progression', correct: false },
              { label: 'I-IV-V-I violates functional harmony rules', correct: false },
              { label: 'I-IV-V-I is only used in jazz', correct: false },
            ],
            [
              { label: 'The "50s progression" I-vi-IV-V uses all three harmonic functions', correct: true },
              { label: 'I-vi-IV-V is a modern invention', correct: false },
              { label: 'I-vi-IV-V does not follow functional harmony', correct: false },
              { label: 'I-vi-IV-V always sounds sad', correct: false },
            ],
            [
              { label: 'Stepwise bass motion (like I-V6-vi or I6-ii6-V) creates smooth voice leading', correct: true },
              { label: 'Stepwise bass motion is forbidden in classical harmony', correct: false },
              { label: 'First inversions are never used to create stepwise bass lines', correct: false },
              { label: 'Bass lines should always leap by 4ths and 5ths', correct: false },
            ],
          ],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root} major triad.',
        hintTemplate: 'A major triad: root + major 3rd + perfect 5th. The IV chord has a warm, subdominant character.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A'],
          accidentals: ['', '', '', '', ''],
          chordQualities: ['major'],
          noteCounts: [3],
        },
        points: 2,
      },
    ],
    targetCount: 6,
  },

  // =========================================================================
  // Unit 14: Counterpoint, Meter, Analysis, and Minor Harmony
  // =========================================================================
  //
  // NOTE (WS5 A2 fix): The only species-counterpoint module in Unit 14 is
  // l4u14m1 ("First and Second Species Counterpoint"). The other u14 modules
  // are l4u14m2 (Asymmetric and Mixed Meters), l4u14m3 (Chromatic
  // Embellishment), l4u14m4 (Roman Numeral Analysis), and l4u14m5 (Minor Key
  // Harmony) — see curriculumL4.ts. Counterpoint generation templates had been
  // mis-keyed onto m2–m5, so learners on those topics were served counterpoint
  // questions. All genuinely-counterpoint templates (first species, second
  // species, and the species-interval-ID drill) are pooled here under l4u14m1.
  // m2–m5 now have no generated templates and fall back to their (correct)
  // hand-authored exercises in exercisesL4.ts.
  //
  // The former third/fourth/fifth-species template blocks were removed: this
  // curriculum does not teach 3rd/4th/5th species, so that content has no
  // matching module and was NOT invented onto an unrelated topic.

  // ---- l4u14m1: First and Second Species Counterpoint ----
  {
    moduleId: 'l4u14m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about first species counterpoint.',
        hintTemplate: 'First species: note against note. Use consonances (3rds, 6ths, perfect intervals). Begin and end on perfect consonances. Avoid parallel 5ths/8ves. Prefer contrary motion.',
        params: {
          choiceSets: [
            [
              { label: 'First species uses one note in the counterpoint for each note in the cantus firmus', correct: true },
              { label: 'First species uses two notes against one', correct: false },
              { label: 'First species uses four notes against one', correct: false },
              { label: 'First species has no rhythmic restrictions', correct: false },
            ],
            [
              { label: 'In first species, all vertical intervals must be consonant', correct: true },
              { label: 'Dissonances are freely allowed in first species', correct: false },
              { label: 'Only perfect intervals are allowed', correct: false },
              { label: 'Only imperfect intervals are allowed', correct: false },
            ],
            [
              { label: 'Approaching a perfect consonance by contrary motion is the safest approach', correct: true },
              { label: 'Perfect consonances should be approached by parallel motion', correct: false },
              { label: 'The approach to perfect consonances does not matter', correct: false },
              { label: 'Perfect consonances can only be reached by oblique motion', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about second species counterpoint.',
        hintTemplate: 'Second species: two notes against one. The first note of each measure must be consonant. The second note can be a consonance or a passing tone (dissonance).',
        params: {
          choiceSets: [
            [
              { label: 'In second species, dissonances are permitted as passing tones on weak beats', correct: true },
              { label: 'All notes must be consonant in second species', correct: false },
              { label: 'Dissonances can appear on strong beats in second species', correct: false },
              { label: 'Second species has no rules about dissonance', correct: false },
            ],
            [
              { label: 'Second species introduces the concept of dissonance treatment through passing tones', correct: true },
              { label: 'Second species introduces suspensions', correct: false },
              { label: 'Second species introduces appoggiaturas', correct: false },
              { label: 'Second species has no new concepts compared to first', correct: false },
            ],
          ],
        },
      },
      {
        type: 'interval_id',
        promptTemplate: 'What is the interval formed between the two voices? Starting from {root}.',
        hintTemplate: 'In species counterpoint, consonances are 3rds, 6ths, and perfect intervals (P1, P5, P8). Dissonances (2nds, 7ths, tritone) need special treatment.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          intervals: [3, 4, 5, 7, 8, 9, 12],
          directions: ['ascending'],
          octaves: [3],
        },
      },
    ],
    targetCount: 8,
  },
];

export default templates;
