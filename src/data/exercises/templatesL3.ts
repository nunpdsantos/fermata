import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 3 Templates — 13 modules, ~70 generated exercises
// Focus: Seventh chords, voice leading, cadences, phrase structure,
//        non-chord tones
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 9: Seventh Chords and Diatonic Harmony
  // =========================================================================

  // ---- l3u9m1: Seventh Chords — Five Qualities ----
  {
    moduleId: 'l3u9m1',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build a {root} {quality} chord. Select all 4 notes.',
        hintTemplate: 'Seventh chord construction from {root}: major7 = M3+P5+M7, minor7 = m3+P5+m7, dominant7 = M3+P5+m7, half-dim7 = m3+d5+m7, dim7 = m3+d5+dd7.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major7', 'minor7', 'dominant7', 'half_diminished7', 'diminished7'],
          noteCounts: [4],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the quality of this seventh chord based on its interval structure.',
        hintTemplate: 'Listen for the triad quality (major/minor/dim) and the 7th quality (major/minor/diminished) stacked on top.',
        params: {
          choiceSets: [
            [
              { label: 'Major triad + major 7th = major seventh chord', correct: true },
              { label: 'Major triad + major 7th = dominant seventh chord', correct: false },
              { label: 'Major triad + major 7th = minor seventh chord', correct: false },
              { label: 'Major triad + major 7th = half-diminished seventh chord', correct: false },
            ],
            [
              { label: 'Major triad + minor 7th = dominant seventh chord', correct: true },
              { label: 'Major triad + minor 7th = major seventh chord', correct: false },
              { label: 'Major triad + minor 7th = minor seventh chord', correct: false },
              { label: 'Major triad + minor 7th = diminished seventh chord', correct: false },
            ],
            [
              { label: 'Diminished triad + minor 7th = half-diminished seventh chord', correct: true },
              { label: 'Diminished triad + minor 7th = diminished seventh chord', correct: false },
              { label: 'Diminished triad + minor 7th = minor seventh chord', correct: false },
              { label: 'Diminished triad + minor 7th = dominant seventh chord', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l3u9m2: Seventh Chord Inversions ----
  {
    moduleId: 'l3u9m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the inversion and figured bass for this seventh chord.',
        hintTemplate: 'Seventh chord inversions: root pos = 7, 1st inv = 6/5, 2nd inv = 4/3, 3rd inv = 4/2 (or 2).',
        params: {
          choiceSets: [
            [
              { label: 'Third inversion of a seventh chord has the 7th in the bass (figured bass: 4/2)', correct: true },
              { label: 'Third inversion has the 5th in the bass', correct: false },
              { label: 'Third inversion has the 3rd in the bass', correct: false },
              { label: 'Third inversion has the root in the bass', correct: false },
            ],
            [
              { label: 'First inversion of a seventh chord uses figured bass 6/5', correct: true },
              { label: 'First inversion uses figured bass 4/3', correct: false },
              { label: 'First inversion uses figured bass 4/2', correct: false },
              { label: 'First inversion uses figured bass 7', correct: false },
            ],
            [
              { label: 'Second inversion of a seventh chord uses figured bass 4/3', correct: true },
              { label: 'Second inversion uses figured bass 6/5', correct: false },
              { label: 'Second inversion uses figured bass 4/2', correct: false },
              { label: 'Second inversion uses figured bass 6/4', correct: false },
            ],
            [
              { label: 'In second inversion, the 5th of the seventh chord is in the bass', correct: true },
              { label: 'In second inversion, the 3rd is in the bass', correct: false },
              { label: 'In second inversion, the 7th is in the bass', correct: false },
              { label: 'In second inversion, the root is in the bass', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u9m3: Diatonic Seventh Chords in Major ----
  {
    moduleId: 'l3u9m3',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the diatonic seventh chord on {root} in C major. Use only white keys.',
        hintTemplate: 'Diatonic 7th chords in C major: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. Build on {root} using only C major scale notes.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major7', 'minor7', 'minor7', 'major7', 'dominant7', 'minor7', 'half_diminished7'],
          noteCounts: [4],
        },
        points: 2,
      },
    ],
    targetCount: 5,
  },

  // ---- l3u9m4: Diatonic Seventh Chords in Minor ----
  {
    moduleId: 'l3u9m4',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the diatonic seventh chord on {root} in A minor (harmonic minor).',
        hintTemplate: 'In harmonic minor, the raised 7th creates different chord qualities than natural minor. The V chord becomes dominant7 and vii becomes diminished7. The raised 7th degree creates unusual chord qualities — don\'t be surprised by unfamiliar sonorities.',
        params: {
          roots: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          accidentals: ['', '', '', '', '', '', '#'],
          chordQualities: ['minor_major7', 'half_diminished7', 'augmented_major7', 'minor7', 'dominant7', 'major7', 'diminished7'],
          noteCounts: [4],
        },
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the quality of this diatonic seventh chord in minor.',
        hintTemplate: 'In harmonic minor, the raised 7th degree changes the quality of chords built on degrees III, V, and VII.',
        params: {
          choiceSets: [
            [
              { label: 'In harmonic minor, V7 is a dominant seventh chord', correct: true },
              { label: 'In harmonic minor, V7 is a minor seventh chord', correct: false },
              { label: 'In harmonic minor, V7 is a major seventh chord', correct: false },
              { label: 'In harmonic minor, V7 is a half-diminished seventh chord', correct: false },
            ],
            [
              { label: 'In harmonic minor, vii°7 is a fully diminished seventh chord', correct: true },
              { label: 'In harmonic minor, vii°7 is a half-diminished seventh chord', correct: false },
              { label: 'In harmonic minor, vii°7 is a minor seventh chord', correct: false },
              { label: 'In harmonic minor, vii°7 is a dominant seventh chord', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 10: Voice Leading and Cadences
  // =========================================================================

  // ---- l3u10m1: SATB Basics ----
  {
    moduleId: 'l3u10m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about SATB voice leading fundamentals.',
        hintTemplate: 'SATB ranges: Soprano C4-G5, Alto F3-C5, Tenor C3-G4, Bass E2-C4. Adjacent voices should stay within an octave (except bass-tenor).',
        params: {
          choiceSets: [
            [
              { label: 'Adjacent upper voices (S-A, A-T) should generally stay within an octave of each other', correct: true },
              { label: 'All four voices must always be within one octave total', correct: false },
              { label: 'There are no spacing restrictions between voices', correct: false },
              { label: 'Soprano and alto must always be a 3rd apart', correct: false },
            ],
            [
              { label: 'Voice crossing occurs when a lower voice goes above an adjacent higher voice', correct: true },
              { label: 'Voice crossing is when two voices sing the same note', correct: false },
              { label: 'Voice crossing is always encouraged for melodic interest', correct: false },
              { label: 'Voice crossing only applies to soprano and bass', correct: false },
            ],
            [
              { label: 'Doubling the root of a chord is generally the safest choice in root position', correct: true },
              { label: 'Doubling the 3rd is always preferred', correct: false },
              { label: 'Doubling the 7th creates the best sound', correct: false },
              { label: 'All chord tones must appear exactly once', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u10m2: Part-Writing Rules ----
  {
    moduleId: 'l3u10m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the voice-leading error or rule illustrated here.',
        hintTemplate: 'Avoid parallel 5ths and 8ves, resolve the leading tone up, resolve the 7th of a chord down, and keep common tones when possible.',
        params: {
          choiceSets: [
            [
              { label: 'Parallel fifths occur when two voices move from one P5 to another P5 in the same direction', correct: true },
              { label: 'Parallel fifths are always acceptable in SATB writing', correct: false },
              { label: 'Parallel fifths only occur between soprano and bass', correct: false },
              { label: 'Parallel fifths mean two voices are always a 5th apart', correct: false },
            ],
            [
              { label: 'The leading tone should resolve up by step to the tonic', correct: true },
              { label: 'The leading tone should resolve down to the dominant', correct: false },
              { label: 'The leading tone can move freely in any direction', correct: false },
              { label: 'The leading tone should always leap to the mediant', correct: false },
            ],
            [
              { label: 'The chordal 7th should resolve down by step', correct: true },
              { label: 'The chordal 7th should resolve up by step', correct: false },
              { label: 'The chordal 7th does not need to resolve', correct: false },
              { label: 'The chordal 7th should leap down a 5th', correct: false },
            ],
            [
              { label: 'Contrary motion between outer voices is generally preferred', correct: true },
              { label: 'Parallel motion between all voices is ideal', correct: false },
              { label: 'The bass should always move in the same direction as the soprano', correct: false },
              { label: 'Oblique motion is never used in SATB writing', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u10m3: Cadences — PAC, IAC, HC ----
  {
    moduleId: 'l3u10m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Classify this cadence type based on the chords and voice leading described.',
        hintTemplate: 'PAC: V-I with soprano on tonic. IAC: V-I with soprano NOT on tonic, or inverted chords. HC: ends on V. Plagal: IV-I. Deceptive: V-vi.',
        params: {
          choiceSets: [
            [
              { label: 'V to I with the soprano ending on the tonic is a Perfect Authentic Cadence (PAC)', correct: true },
              { label: 'This is an Imperfect Authentic Cadence (IAC)', correct: false },
              { label: 'This is a Half Cadence (HC)', correct: false },
              { label: 'This is a Deceptive Cadence', correct: false },
            ],
            [
              { label: 'A phrase ending on the V chord is a Half Cadence', correct: true },
              { label: 'A phrase ending on the V chord is a Perfect Authentic Cadence', correct: false },
              { label: 'A phrase ending on the V chord is a Plagal Cadence', correct: false },
              { label: 'A phrase ending on the V chord is a Deceptive Cadence', correct: false },
            ],
            [
              { label: 'V resolving to vi instead of I is a Deceptive Cadence', correct: true },
              { label: 'V resolving to vi is a Perfect Authentic Cadence', correct: false },
              { label: 'V resolving to vi is a Half Cadence', correct: false },
              { label: 'V resolving to vi is a Plagal Cadence', correct: false },
            ],
            [
              { label: 'IV to I is a Plagal Cadence (Amen cadence)', correct: true },
              { label: 'IV to I is a Perfect Authentic Cadence', correct: false },
              { label: 'IV to I is a Half Cadence', correct: false },
              { label: 'IV to I is a Deceptive Cadence', correct: false },
            ],
            [
              { label: 'V to I with the soprano on the 3rd is an Imperfect Authentic Cadence (IAC)', correct: true },
              { label: 'V to I with the soprano on the 3rd is a PAC', correct: false },
              { label: 'V to I with the soprano on the 3rd is a Half Cadence', correct: false },
              { label: 'V to I with the soprano on the 3rd is a Deceptive Cadence', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l3u10m4: Phrase Structure ----
  {
    moduleId: 'l3u10m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about musical phrase structure.',
        hintTemplate: 'A period has two phrases: antecedent (ending with HC or IAC) and consequent (ending with PAC). A sentence has a presentation (basic idea + repetition) and continuation.',
        params: {
          choiceSets: [
            [
              { label: 'A parallel period has antecedent and consequent phrases that begin with similar material', correct: true },
              { label: 'A parallel period has two unrelated phrases', correct: false },
              { label: 'A parallel period must be exactly 8 measures', correct: false },
              { label: 'A parallel period always ends with a half cadence', correct: false },
            ],
            [
              { label: 'The antecedent phrase typically ends with a weak cadence (HC or IAC)', correct: true },
              { label: 'The antecedent phrase always ends with a PAC', correct: false },
              { label: 'The antecedent phrase has no cadence', correct: false },
              { label: 'The antecedent is always the second phrase', correct: false },
            ],
            [
              { label: 'A sentence structure consists of a presentation phase followed by a continuation phase', correct: true },
              { label: 'A sentence is the same as a period', correct: false },
              { label: 'A sentence always has 3 phrases', correct: false },
              { label: 'A sentence must be 16 measures long', correct: false },
            ],
            [
              { label: 'A contrasting period has an antecedent and consequent that begin with different material', correct: true },
              { label: 'A contrasting period has identical phrases', correct: false },
              { label: 'A contrasting period always modulates', correct: false },
              { label: 'A contrasting period has three phrases', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 11: Non-Chord Tones
  // =========================================================================

  // ---- l3u11m1: Passing Tones ----
  {
    moduleId: 'l3u11m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify this non-chord tone based on its approach and resolution.',
        hintTemplate: 'A passing tone moves by step between two chord tones in the same direction. It fills in the gap between a 3rd.',
        params: {
          choiceSets: [
            [
              { label: 'A note approached by step and left by step in the same direction is a passing tone', correct: true },
              { label: 'It is a neighbor tone', correct: false },
              { label: 'It is a suspension', correct: false },
              { label: 'It is an appoggiatura', correct: false },
            ],
            [
              { label: 'Passing tones can be accented (on the beat) or unaccented (off the beat)', correct: true },
              { label: 'Passing tones are always on the beat', correct: false },
              { label: 'Passing tones are always off the beat', correct: false },
              { label: 'Passing tones are always chromatic', correct: false },
            ],
            [
              { label: 'A chromatic passing tone uses a pitch outside the current key', correct: true },
              { label: 'A chromatic passing tone is always diatonic', correct: false },
              { label: 'A chromatic passing tone must leap', correct: false },
              { label: 'Chromatic passing tones are forbidden in classical harmony', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u11m2: Neighbor Tones ----
  {
    moduleId: 'l3u11m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify this non-chord tone type and its characteristics.',
        hintTemplate: 'A neighbor tone steps away from a chord tone and returns to the same chord tone. Upper neighbors go up then back down; lower neighbors go down then back up.',
        params: {
          choiceSets: [
            [
              { label: 'A note that steps away from a chord tone and returns to it is a neighbor tone', correct: true },
              { label: 'It is a passing tone', correct: false },
              { label: 'It is a suspension', correct: false },
              { label: 'It is an escape tone', correct: false },
            ],
            [
              { label: 'A double neighbor (changing tone) decorates a note by going both above and below it', correct: true },
              { label: 'A double neighbor uses two consecutive passing tones', correct: false },
              { label: 'A double neighbor means two voices have neighbor tones simultaneously', correct: false },
              { label: 'A double neighbor is the same as a trill', correct: false },
            ],
            [
              { label: 'An incomplete neighbor is approached or left by leap instead of step', correct: true },
              { label: 'An incomplete neighbor never resolves', correct: false },
              { label: 'An incomplete neighbor uses a whole step only', correct: false },
              { label: 'An incomplete neighbor is the same as a suspension', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u11m3: Suspensions ----
  {
    moduleId: 'l3u11m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about suspensions in voice leading.',
        hintTemplate: 'A suspension has 3 parts: preparation (consonance), suspension (held over into dissonance), resolution (step down to consonance). Named by the intervals: 4-3, 7-6, 9-8, 2-3.',
        params: {
          choiceSets: [
            [
              { label: 'A 4-3 suspension holds the 4th above the bass then resolves down to a 3rd', correct: true },
              { label: 'A 4-3 suspension holds the 3rd then moves up to the 4th', correct: false },
              { label: 'A 4-3 suspension is an ascending resolution', correct: false },
              { label: 'A 4-3 suspension does not require preparation', correct: false },
            ],
            [
              { label: 'A suspension must be prepared as a consonance on a weak beat before being held into the strong beat', correct: true },
              { label: 'A suspension can appear without preparation', correct: false },
              { label: 'A suspension always resolves upward', correct: false },
              { label: 'A suspension is the same as an appoggiatura', correct: false },
            ],
            [
              { label: 'A 7-6 suspension holds the 7th above the bass then resolves down to a 6th', correct: true },
              { label: 'A 7-6 suspension resolves up to an octave', correct: false },
              { label: 'A 7-6 suspension is a bass suspension', correct: false },
              { label: 'A 7-6 suspension does not resolve', correct: false },
            ],
            [
              { label: 'A 9-8 suspension holds the 9th above the bass then resolves down to an octave', correct: true },
              { label: 'A 9-8 suspension resolves up by step', correct: false },
              { label: 'A 9-8 suspension is actually a 2-1 suspension', correct: false },
              { label: 'A 9-8 suspension occurs only in the bass voice', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l3u11m4: Anticipations and Pedal Points ----
  {
    moduleId: 'l3u11m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Classify this non-chord tone based on how it behaves.',
        hintTemplate: 'An anticipation arrives early (before the chord changes). A pedal point is a sustained or repeated note (usually tonic or dominant) held through changing harmonies above it.',
        params: {
          choiceSets: [
            [
              { label: 'An anticipation sounds a chord tone before the chord actually arrives', correct: true },
              { label: 'An anticipation is the same as a suspension', correct: false },
              { label: 'An anticipation requires preparation on a strong beat', correct: false },
              { label: 'An anticipation always resolves downward', correct: false },
            ],
            [
              { label: 'A tonic pedal point sustains the tonic note while harmonies change above it', correct: true },
              { label: 'A tonic pedal only occurs in the soprano', correct: false },
              { label: 'A tonic pedal must resolve after one measure', correct: false },
              { label: 'A tonic pedal is the same as an ostinato', correct: false },
            ],
            [
              { label: 'A dominant pedal point creates tension by holding the 5th scale degree through non-dominant harmonies', correct: true },
              { label: 'A dominant pedal only appears at the beginning of a piece', correct: false },
              { label: 'A dominant pedal always uses the leading tone', correct: false },
              { label: 'A dominant pedal is always in the soprano voice', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u11m5: Non-Chord Tone Review ----
  {
    moduleId: 'l3u11m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Classify the non-chord tone described: approached and left in this manner.',
        hintTemplate: 'Passing tone: step-step same direction. Neighbor: step-step returning. Suspension: held-step down. Appoggiatura: leap-step. Escape: step-leap. Anticipation: arrives early.',
        params: {
          choiceSets: [
            [
              { label: 'Approached by leap, resolved by step in the opposite direction = appoggiatura', correct: true },
              { label: 'This describes a passing tone', correct: false },
              { label: 'This describes a suspension', correct: false },
              { label: 'This describes an anticipation', correct: false },
            ],
            [
              { label: 'Approached by step, left by leap in the opposite direction = escape tone', correct: true },
              { label: 'This describes a passing tone', correct: false },
              { label: 'This describes a neighbor tone', correct: false },
              { label: 'This describes an anticipation', correct: false },
            ],
            [
              { label: 'A retardation is like a suspension but resolves upward', correct: true },
              { label: 'A retardation resolves downward by leap', correct: false },
              { label: 'A retardation has no preparation', correct: false },
              { label: 'A retardation is the same as an anticipation', correct: false },
            ],
            [
              { label: 'All non-chord tones create dissonance that resolves to consonance', correct: true },
              { label: 'Non-chord tones are always consonant', correct: false },
              { label: 'Non-chord tones never resolve', correct: false },
              { label: 'Non-chord tones only occur in the bass voice', correct: false },
            ],
          ],
        },
      },
      {
        type: 'interval_id',
        promptTemplate: 'Identify the interval created between the non-chord tone and the bass, starting from {root}.',
        hintTemplate: 'Count semitones from {root} to determine the interval. Non-chord tones often create seconds, sevenths, or augmented/diminished intervals against the bass.',
        params: {
          roots: ['C', 'G', 'F', 'D'],
          accidentals: ['', '', '', ''],
          intervals: [1, 2, 6, 10, 11],
          directions: ['ascending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },
];

export default templates;
