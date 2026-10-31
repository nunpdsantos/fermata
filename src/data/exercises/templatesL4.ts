import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 4 Templates — 11 module configs (Unit 14 counterpoint pooled onto
// l4u14m1; see the Unit 14 note below). Modules without a config fall back to
// hand-authored exercises in exercisesL4.ts.
// Focus: Advanced non-chord tones, dominant seventh, harmonic function,
//        sequences, counterpoint
//
// Audit W4-01 (2026-10-31): the u13 blocks had drifted one module from their
// lessons. Harmonic function → l4u13m4, sequences → l4u13m5, harmonic rhythm
// → L3 (l3u11m3); the "common progressions" block and plain-triad builds
// were dropped. New templates teach l4u13m2 (iii7, vi7, Imaj7, I7) and
// l4u13m3 (leading-tone sevenths), built on a named key with the {key} token.
// Suspensions, pedal points, appoggiatura / escape tone / retardation and
// changing tones that L3 had quizzed early now live here, merged with the
// existing sets. Statement questions are worded as such (W4-06) and their
// options balanced so length is no cue (W4-09).
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
        promptTemplate: 'Which statement about suspensions is true?',
        hintTemplate: 'Suspensions: 4-3 resolves to a 3rd, 7-6 to a 6th, 9-8 to an octave. The bass suspension 2-3 resolves downward (the bass descends by step; the interval above the bass grows from a 2nd to a 3rd). Chain suspensions create sequences.',
        params: {
          choiceSets: [
            [
              { label: 'In a 4-3 suspension, the 4th above the bass resolves down to the 3rd', correct: true },
              { label: 'In a 4-3 suspension, the 3rd above the bass rises to the 4th', correct: false },
              { label: 'In a 4-3 suspension, the 4th above the bass resolves up to the 5th', correct: false },
              { label: 'In a 4-3 suspension, the bass moves from 4 down to 3', correct: false },
            ],
            [
              { label: 'In a 7-6 suspension, the 7th above the bass resolves down to the 6th', correct: true },
              { label: 'In a 7-6 suspension, the 7th above the bass resolves up to the octave', correct: false },
              { label: 'In a 7-6 suspension, the bass holds the dissonance while the upper voice moves', correct: false },
              { label: 'In a 7-6 suspension, the dissonance is never resolved', correct: false },
            ],
            [
              { label: 'In a 9-8 suspension, the 9th above the bass resolves down to the octave', correct: true },
              { label: 'In a 9-8 suspension, the 9th above the bass resolves up by step to the 10th', correct: false },
              { label: 'A 9-8 suspension is simply a 2-1 suspension in the bass voice', correct: false },
              { label: 'In a 9-8 suspension, the octave above the bass rises to the 9th', correct: false },
            ],
            [
              { label: 'In a 2-3 bass suspension, the bass resolves down and the 2nd becomes a 3rd', correct: true },
              { label: 'In a 2-3 bass suspension, the upper voice resolves down to a 3rd', correct: false },
              { label: 'In a 2-3 bass suspension, the bass rises by step and the 2nd becomes a 3rd', correct: false },
              { label: 'In a 2-3 bass suspension, the bass leaps away and the dissonance stays unresolved', correct: false },
            ],
            [
              { label: 'A suspension is prepared as a consonance, then held over into a dissonance', correct: true },
              { label: 'A suspension appears without preparation, on the strong beat', correct: false },
              { label: 'A suspension is prepared as a dissonance and resolves up', correct: false },
              { label: 'A suspension is the same thing as an anticipation', correct: false },
            ],
            [
              { label: 'A chain of 7-6 suspensions makes the upper voice descend by step', correct: true },
              { label: 'A chain of 7-6 suspensions makes the upper voice climb by step', correct: false },
              { label: 'Chains of suspensions are not allowed in common-practice style', correct: false },
              { label: 'A chain of 7-6 suspensions keeps the bass on one note', correct: false },
            ],
            [
              { label: 'A decorated suspension adds a note between the suspension and its resolution', correct: true },
              { label: 'A decorated suspension skips its resolution entirely', correct: false },
              { label: 'A decorated suspension must always use chromatic notes', correct: false },
              { label: 'A decorated suspension resolves upward by step instead of down to the note below', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u12m2: Appoggiatura, Escape Tone, and Retardation ----
  {
    moduleId: 'l4u12m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about appoggiaturas, escape tones and retardations is true?',
        hintTemplate: 'Appoggiatura: leap to the dissonance, step to the resolution — usually accented (on a strong beat). Escape tone: step to the dissonance, leap away — usually unaccented (on a weak beat). Retardation: held over like a suspension, resolving up by step (7-8).',
        params: {
          choiceSets: [
            [
              { label: 'An appoggiatura is approached by leap and resolved by step, usually on a strong beat', correct: true },
              { label: 'An appoggiatura is approached by step and left by leap, usually on a weak beat', correct: false },
              { label: 'An appoggiatura is held over from the previous chord, then resolved by step', correct: false },
              { label: 'An appoggiatura is approached and left by step in the same direction, on a weak beat', correct: false },
            ],
            [
              { label: 'An escape tone is approached by step and left by leap in the opposite direction', correct: true },
              { label: 'An escape tone is approached by leap and left by step in the opposite direction', correct: false },
              { label: 'An escape tone is the same thing as an anticipation of the next chord', correct: false },
              { label: 'An escape tone must return to the note it left, just as a neighbor tone does', correct: false },
            ],
            [
              { label: 'A retardation is held over like a suspension but resolves up by step', correct: true },
              { label: 'A retardation is held over like a suspension and resolves down by step', correct: false },
              { label: 'A retardation is approached by leap and has no preparation', correct: false },
              { label: 'A retardation resolves by leap, never by step', correct: false },
            ],
            [
              { label: 'B held over into a C major chord and rising to C: a 7-8 retardation', correct: true },
              { label: 'B held over into a C major chord and rising to C: a 4-3 suspension', correct: false },
              { label: 'B held over into a C major chord and rising to C: an escape tone', correct: false },
              { label: 'B held over into a C major chord and rising to C: an appoggiatura approached by leap', correct: false },
            ],
            [
              { label: 'Unprepared, accented appoggiaturas are a hallmark of Romantic expression', correct: true },
              { label: 'Appoggiaturas are forbidden in Romantic music', correct: false },
              { label: 'Appoggiaturas must always be prepared, exactly like suspensions', correct: false },
              { label: 'Appoggiaturas occur only in the bass voice, never in the melody that sits above it', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u12m3: Pedal Point and Changing Tones ----
  {
    moduleId: 'l4u12m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about pedal points and changing tones is true?',
        hintTemplate: 'Pedal points are sustained or repeated notes (typically tonic or dominant in the bass) that create dissonances with changing harmonies above. Changing tones decorate one note from above and below before returning to it.',
        params: {
          choiceSets: [
            [
              { label: 'A tonic pedal sustains the tonic while the harmonies above it change', correct: true },
              { label: 'A tonic pedal sustains the tonic, but only in the soprano voice', correct: false },
              { label: 'A tonic pedal must end after one bar so that the harmony can change', correct: false },
              { label: 'A tonic pedal is a repeated melodic pattern, the same thing as an ostinato in the bass', correct: false },
            ],
            [
              { label: 'A dominant pedal holds scale degree 5, building tension before the tonic returns', correct: true },
              { label: 'A dominant pedal holds the leading tone, scale degree 7', correct: false },
              { label: 'A dominant pedal is always in the soprano, while the bass moves freely below it', correct: false },
              { label: 'A dominant pedal holds scale degree 5 and may appear only at the very beginning of a piece', correct: false },
            ],
            [
              { label: 'A double pedal sustains the tonic and the dominant together', correct: true },
              { label: 'A double pedal uses two different keys', correct: false },
              { label: 'A double pedal must always resolve to a single note', correct: false },
              { label: 'A double pedal is a pedal that is repeated twice in a row', correct: false },
            ],
            [
              { label: 'An inverted pedal is held in an upper voice instead of the bass', correct: true },
              { label: 'An inverted pedal descends step by step instead of being held', correct: false },
              { label: 'An inverted pedal changes pitch in every bar', correct: false },
              { label: 'Inverted pedals never appear in classical music', correct: false },
            ],
            [
              { label: 'A pedal usually starts and ends consonant, with dissonance in between', correct: true },
              { label: 'A pedal is dissonant against every chord from beginning to end', correct: false },
              { label: 'A pedal never creates any dissonance with the harmonies above it', correct: false },
              { label: 'A pedal must last exactly four bars and must start and end on a downbeat', correct: false },
            ],
            [
              { label: 'Changing tones decorate one note from above and below, then return to it', correct: true },
              { label: 'Changing tones are two passing tones in a row that fill a 4th', correct: false },
              { label: 'Changing tones mean that two voices have neighbor tones at the same time', correct: false },
              { label: 'Changing tones are the same as a trill, alternating rapidly between two notes', correct: false },
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
        promptTemplate: 'Build the {root} dominant seventh chord.',
        hintTemplate: 'A dominant seventh chord: major triad + minor 7th. The 7th resolves down, the leading tone resolves up.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A', 'E', 'B'],
          accidentals: ['', '', '', '', '', '', 'b'],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How does the V7 chord resolve to I?',
        hintTemplate: 'In V7 to I: the leading tone resolves up to tonic, the 7th resolves down by step, the 5th of V can move to the root of I, the root of V can move to the root of I.',
        params: {
          choiceSets: [
            [
              { label: 'Its tritone resolves in contrary motion: the 3rd rises, the 7th falls', correct: true },
              { label: 'Its tritone resolves in parallel motion: both notes rise by step', correct: false },
              { label: 'Its tritone does not resolve: both notes are held into the I chord', correct: false },
              { label: 'Its tritone resolves outward: the 3rd falls and the 7th rises to the root of I', correct: false },
            ],
            [
              { label: 'In V7–I, the I chord often omits its 5th so the voices can resolve properly', correct: true },
              { label: 'In V7–I, the I chord must always be complete, with all three notes', correct: false },
              { label: 'V7–I always produces parallel 5ths, which are allowed here', correct: false },
              { label: 'In V7–I, the root of V7 must always move up by step to become the 3rd of the I chord', correct: false },
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
        promptTemplate: 'Which statement about the inversions of V7 is true?',
        hintTemplate: 'V7 inversions: root pos (V7), 1st inv = V6/5 (3rd/leading tone in bass), 2nd inv = V4/3 (5th in bass), 3rd inv = V4/2 (7th in bass).',
        params: {
          choiceSets: [
            [
              { label: 'V6/5 has the leading tone in the bass, which steps up to the tonic', correct: true },
              { label: 'V6/5 has the 5th of the chord in the bass, which steps down', correct: false },
              { label: 'V6/5 has the 7th of the chord in the bass, which falls to the 3rd of I', correct: false },
              { label: 'V6/5 has the root in the bass, which falls a 5th to the tonic', correct: false },
            ],
            [
              { label: 'V4/2 has the 7th in the bass, so it resolves to I6', correct: true },
              { label: 'V4/2 has the root in the bass, so it resolves to I', correct: false },
              { label: 'V4/2 has the 3rd in the bass, so it resolves to I6/4', correct: false },
              { label: 'V4/2 has the 5th in the bass, so it resolves to the V chord', correct: false },
            ],
            [
              { label: 'V4/3 has the 5th in the bass and can resolve to I or I6', correct: true },
              { label: 'V4/3 has the leading tone in the bass and can only resolve to IV', correct: false },
              { label: 'V4/3 has the 7th in the bass and must resolve to I6/4', correct: false },
              { label: 'V4/3 has the root in the bass and resolves to vi', correct: false },
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
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 13: Diatonic Seventh Chords and Harmonic Function
  // =========================================================================

  // ---- l4u13m1: Pre-Dominant Sevenths ----
  {
    moduleId: 'l4u13m1',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the {root} minor seventh chord.',
        hintTemplate: 'A minor seventh chord: minor triad + minor 7th. Built on scale degree 2 (ii7), it is the classic pre-dominant, leading to V or V7.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A', 'E'],
          accidentals: ['', '', '', '', '', ''],
          chordQualities: ['minor7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How does the pre-dominant function work in harmonic progressions?',
        hintTemplate: 'Pre-dominant chords (ii, IV, ii7, IV7) prepare the dominant. They typically move T -> PD -> D -> T (tonic -> pre-dominant -> dominant -> tonic).',
        params: {
          choiceSets: [
            [
              { label: 'The standard progression is T -> PD -> D -> T', correct: true },
              { label: 'Pre-dominants always come after the dominant', correct: false },
              { label: 'Pre-dominants resolve directly to the tonic', correct: false },
              { label: 'Only major chords can function as pre-dominants', correct: false },
            ],
            [
              { label: 'IV and ii (and IV7, ii7) are the main pre-dominant chords', correct: true },
              { label: 'V and vii° are the main pre-dominant chords', correct: false },
              { label: 'iii is the main pre-dominant chord, because it lies a step below IV', correct: false },
              { label: 'vi is the only chord that can work as a pre-dominant', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u13m2: Mediant, Submediant, and Tonic Sevenths ----
  {
    moduleId: 'l4u13m2',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the vi7 chord of {key} major.',
        hintTemplate: 'vi7 is the minor seventh chord on scale degree 6 of {key} major: {root}, then a minor 3rd, a perfect 5th and a minor 7th above it.',
        params: {
          roots: ['A', 'E', 'B', 'D', 'G', 'F'],
          accidentals: ['', '', '', '', '', '#'],
          keys: ['C', 'G', 'D', 'F', 'Bb', 'A'],
          chordQualities: ['minor7'],
          noteCounts: [4],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'Build the iii7 chord of {key} major.',
        hintTemplate: 'iii7 is the minor seventh chord on scale degree 3 of {key} major: {root}, then a minor 3rd, a perfect 5th and a minor 7th above it.',
        params: {
          roots: ['E', 'B', 'F', 'A', 'D'],
          accidentals: ['', '', '#', '', ''],
          keys: ['C', 'G', 'D', 'F', 'Bb'],
          chordQualities: ['minor7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about iii7, vi7 and the tonic sevenths is true?',
        hintTemplate: 'vi7 (and sometimes iii7) share notes with I and can stand in for it. Imaj7 is the jazz and pop tonic; I7 is the blues tonic. iii7–vi7–ii7–V7–I is a chain of falling fifths.',
        params: {
          choiceSets: [
            [
              { label: 'vi7 is the main tonic-function substitute for I', correct: true },
              { label: 'vi7 is a dominant-function chord that resolves to I', correct: false },
              { label: 'vi7 is a pre-dominant chord that only appears before V', correct: false },
              { label: 'vi7 has no harmonic function of its own', correct: false },
            ],
            [
              { label: 'V7–vi7 is a deceptive resolution in which the root of V7 is held as the 7th of vi7', correct: true },
              { label: 'V7–vi7 is a perfect authentic cadence in disguise', correct: false },
              { label: 'V7–vi7 is impossible, because vi7 shares no notes with V7', correct: false },
              { label: 'V7–vi7 is a half cadence, because it ends on a minor chord', correct: false },
            ],
            [
              { label: 'In jazz and pop, Imaj7 is the usual tonic, a resting point', correct: true },
              { label: 'In jazz and pop, Imaj7 is a tense chord that must resolve to IV', correct: false },
              { label: 'In jazz and pop, Imaj7 is avoided at the end of a ii–V–I', correct: false },
              { label: 'In jazz and pop, the tonic is always a plain triad, never a seventh', correct: false },
            ],
            [
              { label: 'In blues, I7 (a dominant seventh) is the stable tonic', correct: true },
              { label: 'In blues, I7 is avoided because dominant sevenths must resolve', correct: false },
              { label: 'In blues, only V is a dominant seventh, as in classical harmony', correct: false },
              { label: 'In blues, the tonic chord is a major seventh, Imaj7', correct: false },
            ],
            [
              { label: 'iii7 often starts a falling-fifths chain: iii7–vi7–ii7–V7–I', correct: true },
              { label: 'iii7 is the dominant of the key and normally resolves straight to I', correct: false },
              { label: 'iii7 is built on scale degree 6 of the major scale', correct: false },
              { label: 'iii7 is a major seventh chord in a major key', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l4u13m3: Leading-Tone Sevenths ----
  {
    moduleId: 'l4u13m3',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build viiø7, the leading-tone seventh chord of {key} major.',
        hintTemplate: 'viiø7 sits on the leading tone of {key} major ({root}): a half-diminished seventh — minor 3rd, diminished 5th and minor 7th above {root}.',
        params: {
          roots: ['B', 'F', 'C', 'E', 'A'],
          accidentals: ['', '#', '#', '', ''],
          keys: ['C', 'G', 'D', 'F', 'Bb'],
          chordQualities: ['half_diminished7'],
          noteCounts: [4],
        },
      },
      {
        type: 'chord_build',
        promptTemplate: 'Build vii°7, the leading-tone seventh chord of {key} minor (harmonic minor).',
        hintTemplate: 'vii°7 sits on the raised 7th of {key} harmonic minor ({root}): a fully diminished seventh — three stacked minor 3rds above {root}.',
        params: {
          roots: ['G', 'B', 'C', 'D', 'F'],
          accidentals: ['#', '', '#', '#', '#'],
          keys: ['A', 'C', 'D', 'E', 'G'],
          chordQualities: ['diminished7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about leading-tone seventh chords is true?',
        hintTemplate: 'viiø7 (major keys) is half-diminished: G9 without its root, in C major. vii°7 (minor keys) is fully diminished, built on the raised 7th; its four notes divide the octave into minor 3rds.',
        params: {
          choiceSets: [
            [
              { label: 'viiø7 in C major (B–D–F–A) is G9 without its root', correct: true },
              { label: 'viiø7 in C major (B–D–F–A) is G7 with an added 6th', correct: false },
              { label: 'viiø7 in C major (B–D–F–A) is a minor seventh chord on B', correct: false },
              { label: 'viiø7 in C major (B–D–F–A) is the tonic seventh, Imaj7', correct: false },
            ],
            [
              { label: 'vii°7 in A minor is G#–B–D–F, built on the raised 7th', correct: true },
              { label: 'vii°7 in A minor is G–B–D–F, built on the natural 7th', correct: false },
              { label: 'vii°7 in A minor is G#–B–D–F#, a half-diminished chord', correct: false },
              { label: 'vii°7 in A minor is B–D–F–A, built on the 2nd degree', correct: false },
            ],
            [
              { label: 'viiø7 has a minor 7th; vii°7 has a diminished 7th', correct: true },
              { label: 'viiø7 has a diminished 7th; vii°7 has a minor 7th', correct: false },
              { label: 'viiø7 and vii°7 are the same chord with two names', correct: false },
              { label: 'viiø7 has a major 7th; vii°7 has a perfect 5th and a minor 7th', correct: false },
            ],
            [
              { label: 'Bdim7, Ddim7, Fdim7 and G#dim7 contain the same four pitch classes', correct: true },
              { label: 'Bdim7 and Ddim7 share no notes, since their roots are a 3rd apart', correct: false },
              { label: 'Every diminished seventh chord has its own unique set of notes', correct: false },
              { label: 'A diminished seventh chord can be respelled on only one of its notes, its root', correct: false },
            ],
            [
              { label: 'Like V7, viiø7 resolves to I: the leading tone rises, the 7th falls', correct: true },
              { label: 'Like IV, viiø7 is a pre-dominant chord that resolves to V', correct: false },
              { label: 'viiø7 resolves to vi, its leading tone falling to the 6th degree', correct: false },
              { label: 'viiø7 does not resolve at all, because it is the most stable seventh chord in the key', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l4u13m4: Harmonic Function ----
  {
    moduleId: 'l4u13m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about harmonic function is true?',
        hintTemplate: 'Tonic function: I, vi, iii. Pre-dominant: IV, ii. Dominant: V, vii°. These categories describe how chords function in progressions, not just their quality.',
        params: {
          choiceSets: [
            [
              { label: 'vi can stand in for I as a tonic-function chord', correct: true },
              { label: 'vi is a dominant-function chord that resolves to I', correct: false },
              { label: 'vi is a pre-dominant chord that always moves to V', correct: false },
              { label: 'vi has no standard harmonic function', correct: false },
            ],
            [
              { label: 'vii° works as a dominant: it shares three notes with V7', correct: true },
              { label: 'vii° works as a tonic: it shares three notes with I', correct: false },
              { label: 'vii° works as a pre-dominant: it always moves to IV', correct: false },
              { label: 'vii° has no harmonic function', correct: false },
            ],
            [
              { label: 'iii can act as a weak tonic substitute: it shares two notes with I', correct: true },
              { label: 'iii is always a dominant chord, because it contains the leading tone', correct: false },
              { label: 'iii is the main pre-dominant chord of the key', correct: false },
              { label: 'iii never appears in common-practice harmony', correct: false },
            ],
            [
              { label: 'In the deceptive cadence V–vi, vi takes the place of I as tonic', correct: true },
              { label: 'In V–vi, vi acts as a dominant and pulls back to V', correct: false },
              { label: 'V–vi is not a real cadence', correct: false },
              { label: 'In V–vi, vi is a pre-dominant chord heading to IV', correct: false },
            ],
            [
              { label: 'D → PD (for example V–IV) is a retrogression: it reverses the usual flow', correct: true },
              { label: 'D → PD (for example V–IV) is the standard order of functions', correct: false },
              { label: 'D → PD (for example V–IV) is impossible in any style of music', correct: false },
              { label: 'D → PD (for example V–IV) is the strongest way to end a phrase, stronger than V–I', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l4u13m5: Harmonic Sequences ----
  {
    moduleId: 'l4u13m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about harmonic sequences is true?',
        hintTemplate: 'A sequence repeats a melodic/harmonic pattern at successively higher or lower pitch levels. Common types: descending 5ths, ascending 5-6, descending 3rds.',
        params: {
          choiceSets: [
            [
              { label: 'A descending-fifths sequence: I–IV–vii°–iii–vi–ii–V–I', correct: true },
              { label: 'A descending-fifths sequence: I–V–ii–vi–iii–vii°–IV–I', correct: false },
              { label: 'A descending-fifths sequence: I–ii–iii–IV–V–vi–vii°–I', correct: false },
              { label: 'A descending-fifths sequence uses only major chords, so it must leave the key', correct: false },
            ],
            [
              { label: 'An ascending 5-6 sequence alternates 5/3 and 6/3 chords over a rising bass', correct: true },
              { label: 'An ascending 5-6 sequence uses only root-position triads over a falling bass', correct: false },
              { label: 'An ascending 5-6 sequence moves the bass down by step', correct: false },
              { label: 'The 5-6 sequence is not a real type of sequence', correct: false },
            ],
            [
              { label: 'A sequence overrides normal functional order: the repeating pattern drives it', correct: true },
              { label: 'A sequence must follow the T–PD–D–T order in every chord', correct: false },
              { label: 'A sequence repeats one chord several times at the same pitch', correct: false },
              { label: 'A sequence is a series of modulations', correct: false },
            ],
            [
              { label: 'A descending-thirds sequence: I–vi–IV–ii, each root falling a 3rd', correct: true },
              { label: 'A descending-thirds sequence: I–V–vi–IV, each root falling a 3rd', correct: false },
              { label: 'A descending-thirds sequence: I–ii–iii–IV, each root falling a 3rd', correct: false },
              { label: 'A descending-thirds sequence: I–iii–V–vii°, each root falling a 3rd', correct: false },
            ],
            [
              { label: 'vi–ii–V–I is a fragment of the descending-fifths sequence', correct: true },
              { label: 'vi–ii–V–I is a fragment of the ascending-seconds sequence', correct: false },
              { label: 'vi–ii–V–I is a descending-thirds sequence', correct: false },
              { label: 'vi–ii–V–I is not part of any sequence, since it ends on the tonic', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
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
  // The former third/fourth/fifth-species template blocks were removed: Level
  // 4 teaches only first and second species (third to fifth species are L6,
  // l6u20m1–m2), so that content was NOT invented onto an unrelated topic.

  // ---- l4u14m1: First and Second Species Counterpoint ----
  {
    moduleId: 'l4u14m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about first species counterpoint is true?',
        hintTemplate: 'First species: note against note. Use consonances (3rds, 6ths, perfect intervals). Begin and end on perfect consonances. Avoid parallel 5ths/8ves. Prefer contrary motion.',
        params: {
          choiceSets: [
            [
              { label: 'First species: one counterpoint note against each cantus firmus note', correct: true },
              { label: 'First species: two counterpoint notes against each cantus firmus note', correct: false },
              { label: 'First species: four counterpoint notes against each cantus firmus note', correct: false },
              { label: 'First species: any rhythm at all against the cantus firmus', correct: false },
            ],
            [
              { label: 'In first species, every vertical interval must be a consonance', correct: true },
              { label: 'In first species, dissonances are allowed on any beat', correct: false },
              { label: 'In first species, only perfect intervals are allowed', correct: false },
              { label: 'In first species, only 3rds and 6ths are allowed', correct: false },
            ],
            [
              { label: 'A perfect consonance is best approached by contrary motion', correct: true },
              { label: 'A perfect consonance is best approached by parallel motion', correct: false },
              { label: 'How a perfect consonance is approached makes no difference', correct: false },
              { label: 'A perfect consonance may only be approached by oblique motion, never by step', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about second species counterpoint is true?',
        hintTemplate: 'Second species: two notes against one. The first note of each measure must be consonant. The second note can be a consonance or a passing tone (dissonance).',
        params: {
          choiceSets: [
            [
              { label: 'In second species, passing-tone dissonances may fall on weak beats', correct: true },
              { label: 'In second species, every note must be consonant, as in first species', correct: false },
              { label: 'In second species, dissonances may fall on the strong beats', correct: false },
              { label: 'In second species, there are no rules about dissonance', correct: false },
            ],
            [
              { label: 'Second species introduces dissonance, as passing tones on weak beats', correct: true },
              { label: 'Second species introduces the suspension, tied over the barline', correct: false },
              { label: 'Second species introduces the appoggiatura, approached by leap', correct: false },
              { label: 'Second species adds nothing new: it follows exactly the same rules as first species', correct: false },
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
