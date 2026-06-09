import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 6 Templates — 12 modules, ~65 generated exercises
// Focus: Neapolitan chord, augmented sixths, enharmonic modulation,
//        advanced counterpoint
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 18: Chromatic Harmony — Neapolitan and Augmented Sixths
  // =========================================================================

  // ---- l6u18m1: Neapolitan Chord bII ----
  {
    moduleId: 'l6u18m1',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root}{accidental} major triad (Neapolitan chord).',
        hintTemplate: 'The Neapolitan is a major triad built on the lowered 2nd scale degree. Build a major triad on {root}{accidental}.',
        params: {
          roots: ['D', 'E', 'A', 'G', 'C', 'F'],
          accidentals: ['b', 'b', 'b', 'b', 'b', ''],
          chordQualities: ['major'],
          noteCounts: [3],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How does the Neapolitan chord function and resolve?',
        hintTemplate: 'The Neapolitan (bII or N6) is a pre-dominant chord that resolves to V (often via a cadential 6/4). It is almost always in first inversion.',
        params: {
          choiceSets: [
            [
              { label: 'The Neapolitan is a pre-dominant chord that typically resolves to V or to a cadential 6/4', correct: true },
              { label: 'The Neapolitan resolves directly to I', correct: false },
              { label: 'The Neapolitan functions as a dominant chord', correct: false },
              { label: 'The Neapolitan is always in root position', correct: false },
            ],
            [
              { label: 'The Neapolitan chord in C minor is Db major (Db-F-Ab)', correct: true },
              { label: 'The Neapolitan in C minor is D major', correct: false },
              { label: 'The Neapolitan in C minor is Eb major', correct: false },
              { label: 'The Neapolitan in C minor is B major', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u18m2: Italian/French Augmented 6th ----
  {
    moduleId: 'l6u18m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the type and structure of this augmented sixth chord.',
        hintTemplate: 'Italian Aug6: b6, 1, #4 (3 notes). French Aug6: b6, 1, 2, #4 (4 notes, includes the 2nd). Both resolve to V with the outer voices expanding to an octave.',
        params: {
          choiceSets: [
            [
              { label: 'The Italian augmented 6th has 3 notes: b6, 1, and #4', correct: true },
              { label: 'The Italian augmented 6th has 4 notes', correct: false },
              { label: 'The Italian augmented 6th contains the 2nd scale degree', correct: false },
              { label: 'The Italian augmented 6th contains the 3rd scale degree', correct: false },
            ],
            [
              { label: 'The French augmented 6th adds the 2nd scale degree to the Italian Aug6', correct: true },
              { label: 'The French augmented 6th adds the 3rd scale degree', correct: false },
              { label: 'The French augmented 6th has only 2 notes', correct: false },
              { label: 'The French is identical to the Italian', correct: false },
            ],
            [
              { label: 'Augmented 6th chords resolve outward to an octave on the dominant', correct: true },
              { label: 'Augmented 6th chords resolve inward to a unison', correct: false },
              { label: 'Augmented 6th chords resolve to the tonic', correct: false },
              { label: 'Augmented 6th chords do not resolve', correct: false },
            ],
            [
              { label: 'The interval between b6 and #4 is an augmented 6th (10 semitones), which resolves to P8', correct: true },
              { label: 'The augmented 6th interval is 8 semitones', correct: false },
              { label: 'The augmented 6th resolves to a P5', correct: false },
              { label: 'The augmented 6th interval is 6 semitones', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u18m3: German Augmented 6th ----
  {
    moduleId: 'l6u18m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze the German augmented 6th chord and its resolution.',
        hintTemplate: 'German Aug6: b6, 1, b3, #4 (4 notes, includes the minor 3rd). Resolves to a cadential 6/4 to avoid parallel 5ths, then to V.',
        params: {
          choiceSets: [
            [
              { label: 'The German augmented 6th contains b6, 1, b3, and #4', correct: true },
              { label: 'The German Aug6 contains b6, 1, 2, and #4', correct: false },
              { label: 'The German Aug6 has only 3 notes', correct: false },
              { label: 'The German Aug6 contains the 5th scale degree', correct: false },
            ],
            [
              { label: 'The German Aug6 resolves to a cadential 6/4 to avoid parallel 5ths with V', correct: true },
              { label: 'The German Aug6 resolves directly to V in root position', correct: false },
              { label: 'The German Aug6 resolves to I', correct: false },
              { label: 'Parallel 5ths are acceptable with the German Aug6', correct: false },
            ],
            [
              { label: 'The German Aug6 is enharmonically equivalent to a dominant 7th chord', correct: true },
              { label: 'The German Aug6 is enharmonically equivalent to a minor 7th', correct: false },
              { label: 'The German Aug6 has no enharmonic equivalent', correct: false },
              { label: 'The German Aug6 is equivalent to a major 7th', correct: false },
            ],
          ],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root}{accidental} dominant seventh chord (enharmonic German augmented sixth).',
        hintTemplate: 'The German Aug6 is enharmonically equivalent to a dominant seventh chord. Build a dominant 7th on {root}{accidental}: root + major 3rd + perfect 5th + minor 7th.',
        params: {
          roots: ['A', 'C', 'D', 'E', 'G'],
          accidentals: ['b', 'b', 'b', 'b', 'b'],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
        points: 2,
      },
    ],
    targetCount: 6,
  },

  // ---- l6u18m4: Enharmonic Modulation Gr+6 <-> V7 ----
  {
    moduleId: 'l6u18m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'How does enharmonic reinterpretation of the German Aug6 enable modulation?',
        hintTemplate: 'The German Aug6 is enharmonically identical to a dominant 7th chord. Respelling it allows a sudden modulation to a remote key: Gr+6 in one key = V7 in another.',
        params: {
          choiceSets: [
            [
              { label: 'The German Aug6 in C minor (Ab-C-Eb-F#) can be respelled as Ab7 (Ab-C-Eb-Gb), resolving to Db', correct: true },
              { label: 'The German Aug6 cannot be reinterpreted as a dominant 7th', correct: false },
              { label: 'Enharmonic reinterpretation only works with Italian Aug6', correct: false },
              { label: 'The respelled chord resolves to the same key', correct: false },
            ],
            [
              { label: 'This enharmonic pivot enables modulation to keys a half step away from the dominant', correct: true },
              { label: 'This technique only modulates between parallel keys', correct: false },
              { label: 'This technique is limited to closely related keys', correct: false },
              { label: 'This type of modulation was never used historically', correct: false },
            ],
            [
              { label: 'The enharmonic ambiguity of the German Aug6 was exploited extensively by Romantic composers', correct: true },
              { label: 'This technique was only used in the Baroque era', correct: false },
              { label: 'Classical composers never used enharmonic modulation', correct: false },
              { label: 'This technique was invented in the 20th century', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 19: Enharmonic Modulation and Advanced Chromaticism
  // =========================================================================

  // ---- l6u19m1: Enharmonic Modulation via dim7 ----
  {
    moduleId: 'l6u19m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'How does the diminished 7th chord enable enharmonic modulation?',
        hintTemplate: 'A dim7 chord divides the octave into equal minor 3rds. Any of its 4 notes can be respelled as the root, making it resolve to 4 different keys.',
        params: {
          choiceSets: [
            [
              { label: 'Any note of a dim7 chord can function as the leading tone to a different key', correct: true },
              { label: 'A dim7 chord can only resolve to one key', correct: false },
              { label: 'Dim7 chords cannot be respelled', correct: false },
              { label: 'Only the root of a dim7 can act as leading tone', correct: false },
            ],
            [
              { label: 'There are only 3 distinct diminished 7th chords (enharmonically), covering all 12 keys', correct: true },
              { label: 'There are 12 distinct diminished 7th chords', correct: false },
              { label: 'There are 6 distinct diminished 7th chords', correct: false },
              { label: 'Each key has its own unique diminished 7th', correct: false },
            ],
            [
              { label: 'B°7 (B-D-F-Ab) can resolve to C, Eb, Gb, or A depending on enharmonic spelling', correct: true },
              { label: 'B°7 can only resolve to C', correct: false },
              { label: 'B°7 has 2 possible resolutions', correct: false },
              { label: 'B°7 resolves only to B major', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u19m2: Common-Tone Diminished 7th ----
  {
    moduleId: 'l6u19m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Explain the function of a common-tone diminished 7th chord.',
        hintTemplate: 'A CT°7 shares a common tone with the chord it embellishes. It decorates (rather than functions harmonically toward) a major or dominant 7th chord.',
        params: {
          choiceSets: [
            [
              { label: 'The CT°7 shares a common tone (usually the root) with the chord it embellishes', correct: true },
              { label: 'The CT°7 has no notes in common with the next chord', correct: false },
              { label: 'The CT°7 functions as a dominant chord', correct: false },
              { label: 'The CT°7 is the same as a secondary diminished chord', correct: false },
            ],
            [
              { label: 'The CT°7 embellishes a chord through neighbor-tone motion in three voices', correct: true },
              { label: 'The CT°7 creates a modulation', correct: false },
              { label: 'The CT°7 is always a passing chord', correct: false },
              { label: 'The CT°7 replaces the dominant function', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u19m3: Omnibus Progression ----
  {
    moduleId: 'l6u19m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Describe the omnibus progression and its voice-leading characteristics.',
        hintTemplate: 'The omnibus is a chromatic voice-exchange pattern where two voices move in contrary chromatic motion while other voices sustain common tones.',
        params: {
          choiceSets: [
            [
              { label: 'The omnibus features contrary chromatic motion in outer voices with common tones in inner voices', correct: true },
              { label: 'The omnibus uses only parallel motion', correct: false },
              { label: 'The omnibus has no chromatic movement', correct: false },
              { label: 'The omnibus is a simple I-IV-V-I progression', correct: false },
            ],
            [
              { label: 'The omnibus can prolong a dominant harmony through chromatic voice exchange', correct: true },
              { label: 'The omnibus always creates a modulation', correct: false },
              { label: 'The omnibus only prolongs tonic harmony', correct: false },
              { label: 'The omnibus was never used by any major composer', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u19m4: Chromatic Mediants ----
  {
    moduleId: 'l6u19m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the chromatic mediant relationship described.',
        hintTemplate: 'Chromatic mediants are chords related by a major or minor 3rd with roots that differ chromatically (e.g., C major to E major or Ab major). They share one common tone.',
        params: {
          choiceSets: [
            [
              { label: 'C major to E major is a chromatic mediant: roots a M3 apart, sharing one common tone (E)', correct: true },
              { label: 'C major to G major is a chromatic mediant', correct: false },
              { label: 'C major to F major is a chromatic mediant', correct: false },
              { label: 'Chromatic mediants share no common tones', correct: false },
            ],
            [
              { label: 'Chromatic mediants produce a striking color change because they shift mode while moving by 3rd', correct: true },
              { label: 'Chromatic mediants always sound subtle and gentle', correct: false },
              { label: 'Chromatic mediants are the same as diatonic mediants', correct: false },
              { label: 'Chromatic mediants are limited to major-key pieces', correct: false },
            ],
            [
              { label: 'C major to Ab major is a chromatic mediant: roots a M3 apart, sharing one common tone (C)', correct: true },
              { label: 'C major to Ab is a dominant relationship', correct: false },
              { label: 'This relationship has no common tones', correct: false },
              { label: 'C to Ab is a subdominant relationship', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // =========================================================================
  // Unit 20: Advanced Counterpoint and Chromaticism
  // =========================================================================

  // ---- l6u20m1: Chromatic Voice Leading ----
  {
    moduleId: 'l6u20m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze this chromatic voice-leading technique.',
        hintTemplate: 'Chromatic voice leading connects chords through half-step motion. It creates smooth connections between otherwise distant harmonies.',
        params: {
          choiceSets: [
            [
              { label: 'Chromatic voice leading uses half-step connections to create smooth motion between distant chords', correct: true },
              { label: 'Chromatic voice leading always uses whole steps', correct: false },
              { label: 'Chromatic voice leading is the same as diatonic voice leading', correct: false },
              { label: 'Chromatic voice leading ignores chord quality', correct: false },
            ],
            [
              { label: 'Parsimonious voice leading moves the minimum number of voices by the smallest intervals', correct: true },
              { label: 'Parsimonious voice leading requires all voices to move', correct: false },
              { label: 'Parsimonious means moving by large leaps', correct: false },
              { label: 'This concept was never studied theoretically', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u20m2: Equal Division of the Octave ----
  {
    moduleId: 'l6u20m2',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale, which divides the octave into equal intervals.',
        hintTemplate: 'The whole-tone scale divides the octave into 6 equal whole steps. The chromatic scale divides it into 12 equal half steps. These symmetric divisions create ambiguous tonality.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['whole_tone'],
          noteCounts: [6],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the symmetrical division of the octave described.',
        hintTemplate: 'Equal divisions: tritone (2 notes, div by 6), aug triad (3 notes, div by 4), dim7 (4 notes, div by 3), whole-tone (6 notes, div by 2).',
        params: {
          choiceSets: [
            [
              { label: 'An augmented triad divides the octave into 3 equal major 3rds', correct: true },
              { label: 'An augmented triad divides the octave into 4 equal parts', correct: false },
              { label: 'An augmented triad divides the octave into 2 equal parts', correct: false },
              { label: 'An augmented triad does not divide the octave equally', correct: false },
            ],
            [
              { label: 'There are only 2 whole-tone scales, each containing 6 of the 12 chromatic pitches', correct: true },
              { label: 'There are 12 whole-tone scales', correct: false },
              { label: 'There is only 1 whole-tone scale', correct: false },
              { label: 'There are 6 whole-tone scales', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l6u20m3: Advanced Invertible Counterpoint ----
  {
    moduleId: 'l6u20m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about invertible (double) counterpoint.',
        hintTemplate: 'Invertible counterpoint allows two voices to swap positions (the upper becomes lower and vice versa). At the octave: 3rds become 6ths, 5ths become 4ths, etc.',
        params: {
          choiceSets: [
            [
              { label: 'In invertible counterpoint at the octave, a 3rd becomes a 6th when voices swap', correct: true },
              { label: 'A 3rd stays a 3rd when voices swap', correct: false },
              { label: 'A 3rd becomes a 5th when voices swap', correct: false },
              { label: 'Intervals do not change when voices swap', correct: false },
            ],
            [
              { label: 'Perfect 5ths must be avoided in invertible counterpoint at the octave because they become 4ths', correct: true },
              { label: 'Perfect 5ths are the best intervals for invertible counterpoint', correct: false },
              { label: '5ths become 5ths when inverted at the octave', correct: false },
              { label: 'There are no restrictions on intervals in invertible counterpoint', correct: false },
            ],
            [
              { label: 'Invertible counterpoint at the 10th: a 3rd becomes an octave, a 6th becomes a 5th', correct: true },
              { label: 'At the 10th, all intervals remain unchanged', correct: false },
              { label: 'Invertible counterpoint only works at the octave', correct: false },
              { label: 'At the 10th, a 3rd becomes a 5th', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u20m4: Triple and Quadruple Counterpoint ----
  {
    moduleId: 'l6u20m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about triple and quadruple counterpoint.',
        hintTemplate: 'Triple counterpoint: 3 voices that can appear in any permutation (6 arrangements). Quadruple: 4 voices, 24 possible arrangements. Bach was the supreme master.',
        params: {
          choiceSets: [
            [
              { label: 'Triple counterpoint allows 3 voices to be rearranged in any of 6 permutations', correct: true },
              { label: 'Triple counterpoint has only 3 possible arrangements', correct: false },
              { label: 'Triple counterpoint means 3 separate fugues', correct: false },
              { label: 'Triple counterpoint has 12 permutations', correct: false },
            ],
            [
              { label: 'Quadruple counterpoint with 4 voices yields 24 possible arrangements', correct: true },
              { label: 'Quadruple counterpoint has 4 arrangements', correct: false },
              { label: 'Quadruple counterpoint has 12 arrangements', correct: false },
              { label: 'Quadruple counterpoint is impossible to write', correct: false },
            ],
            [
              { label: 'Writing triple/quadruple counterpoint requires each pair of voices to work in invertible counterpoint', correct: true },
              { label: 'Only the outer voices need to be invertible', correct: false },
              { label: 'No special voice-leading restrictions apply', correct: false },
              { label: 'Parallel 5ths are acceptable in triple counterpoint', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },
];

export default templates;
