import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 3 Templates — 13 modules
// Focus: Seventh chords, voice leading, cadences, phrase structure,
//        harmonic rhythm, non-chord tones, transposition
//
// Audit W4-01 (2026-10-31): the unit 10–11 blocks had drifted one or two
// modules from the lessons they were written for (Root Position Part Writing
// was quizzed on cadences, Cadences on passing tones …). Each block now sits
// in the module that teaches it: cadences → l3u11m1, phrases → l3u11m2,
// passing/neighbor/anticipation → l3u11m4, harmonic rhythm (from L4) →
// l3u11m3; suspensions, pedal points, appoggiatura/escape/retardation and
// changing tones moved to their L4 modules. New templates were written for
// root-position part writing, triads in inversion and transposition.
// Statement questions are worded as such (W4-06) and their options balanced
// so length is no cue (W4-09).
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
        promptTemplate: 'Build the {root} {quality} chord. Select all 4 notes.',
        hintTemplate: 'Seventh chord construction from {root}: major 7th = M3+P5+M7, minor 7th = m3+P5+m7, dominant 7th = M3+P5+m7, half-diminished 7th = m3+d5+m7, diminished 7th = m3+d5+d7.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major7', 'minor7', 'dominant7', 'half_diminished7', 'diminished7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which seventh-chord definition is correct?',
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
        promptTemplate: 'Which statement about seventh-chord inversions and their figured bass is true?',
        hintTemplate: 'Seventh chord inversions: root position = 7 (root in bass), 1st inversion = 6/5 (3rd in bass), 2nd inversion = 4/3 (5th in bass), 3rd inversion = 4/2 or 2 (7th in bass).',
        params: {
          choiceSets: [
            [
              { label: 'Third inversion has the 7th in the bass (4/2)', correct: true },
              { label: 'Third inversion has the 5th in the bass (4/3)', correct: false },
              { label: 'Third inversion has the 3rd in the bass (6/5)', correct: false },
              { label: 'Third inversion has the root in the bass (7)', correct: false },
            ],
            [
              { label: 'First inversion is figured 6/5', correct: true },
              { label: 'First inversion is figured 4/3', correct: false },
              { label: 'First inversion is figured 4/2', correct: false },
              { label: 'First inversion is figured 7/5/3', correct: false },
            ],
            [
              { label: 'Second inversion is figured 4/3', correct: true },
              { label: 'Second inversion is figured 6/5', correct: false },
              { label: 'Second inversion is figured 4/2', correct: false },
              { label: 'Second inversion is figured 6/4', correct: false },
            ],
            [
              { label: 'In second inversion, the 5th is in the bass', correct: true },
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
        hintTemplate: 'In harmonic minor, the raised 7th creates different chord qualities than natural minor. The V chord becomes a dominant 7th and vii becomes a diminished 7th. The raised 7th degree creates unusual chord qualities — don\'t be surprised by unfamiliar sonorities.',
        params: {
          roots: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          accidentals: ['', '', '', '', '', '', '#'],
          chordQualities: ['minor_major7', 'half_diminished7', 'augmented_major7', 'minor7', 'dominant7', 'major7', 'diminished7'],
          noteCounts: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about seventh chords in harmonic minor is true?',
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
              { label: 'In harmonic minor, vii°7 is fully diminished', correct: true },
              { label: 'In harmonic minor, vii°7 is a half-diminished seventh chord (m7b5)', correct: false },
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
  // Unit 10: Voice Leading
  // =========================================================================

  // ---- l3u10m1: SATB Basics ----
  {
    moduleId: 'l3u10m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about SATB voicing is true?',
        hintTemplate: 'SATB ranges: Soprano C4-G5, Alto F3-C5, Tenor C3-G4, Bass E2-C4. Adjacent voices should stay within an octave (except bass-tenor). Voice crossing puts a normally lower voice above its neighbor; in root-position triads, doubling the root is the usual starting point.',
        params: {
          choiceSets: [
            [
              { label: 'Upper adjacent voices: at most an octave; tenor–bass: may exceed an octave', correct: true },
              { label: 'Upper adjacent voices: may exceed an octave; tenor–bass: at most an octave', correct: false },
              { label: 'Upper adjacent voices: at most an octave; tenor–bass: at most an octave', correct: false },
              { label: 'Upper adjacent voices: may exceed an octave; tenor–bass: may exceed an octave', correct: false },
            ],
            [
              { label: 'Voice crossing: the alto sings B4 while the soprano sings G4', correct: true },
              { label: 'Voice crossing: the alto sings G4 while the soprano sings G4', correct: false },
              { label: 'Voice crossing: the alto sings G4 while the soprano sings B4', correct: false },
              { label: 'Voice crossing: the alto sings C4 while the soprano sings E4', correct: false },
            ],
            [
              { label: 'In root position, doubling the root is generally the safest choice', correct: true },
              { label: 'In root position, doubling the leading tone is generally the safest choice', correct: false },
              { label: 'In root position, doubling the 3rd is usually safer than doubling the root', correct: false },
              { label: 'In root position, a triad usually fills four voices without doubling a chord tone', correct: false },
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
        promptTemplate: 'Which voice-leading statement is true?',
        hintTemplate: 'Avoid parallel 5ths and 8ves, resolve the leading tone up, take care with direct 5ths and 8ves between the outer voices, and keep common tones when possible.',
        params: {
          choiceSets: [
            [
              { label: 'Parallel fifths: D4–A4 → E4–B4', correct: true },
              { label: 'Parallel fifths: D4–A4 → D4–B4', correct: false },
              { label: 'Parallel fifths: D4–A4 → E4–A4', correct: false },
              { label: 'Parallel fifths: D4–A4 → D4–A4', correct: false },
            ],
            [
              { label: 'The leading tone resolves up by step to the tonic', correct: true },
              { label: 'The leading tone resolves down by step to the submediant', correct: false },
              { label: 'The leading tone may move freely in any direction', correct: false },
              { label: 'The leading tone leaps up to the mediant', correct: false },
            ],
            [
              { label: 'A direct fifth in the outer voices is acceptable with soprano by step and bass by leap', correct: true },
              { label: 'A direct fifth in the outer voices is acceptable with soprano by leap and bass by step', correct: false },
              { label: 'A direct fifth in the outer voices is acceptable with soprano by leap and bass by leap', correct: false },
              { label: 'A direct fifth in the outer voices is acceptable whenever the bass moves by step', correct: false },
            ],
            [
              { label: 'Contrary motion between the outer voices is generally preferred', correct: true },
              { label: 'Parallel motion between all four voices is generally preferred', correct: false },
              { label: 'Similar motion between the outer voices is generally required', correct: false },
              { label: 'Oblique motion between the outer voices is generally forbidden', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u10m3: Root Position Part Writing ----
  {
    moduleId: 'l3u10m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about part writing with root-position triads is true?',
        hintTemplate: 'Roots a 5th apart share one common tone, roots a 3rd apart share two, roots a 2nd apart share none. Keep common tones in the same voice; when there are none, move the upper voices against the bass.',
        nudgeTemplate: 'Test each statement on real chords in C major — I–V (roots a 5th apart), I–vi (a 3rd), IV–V (a 2nd): spell both chords, count the notes they share and see how far each upper voice has to move. For doubling, ask which chord member is the most stable to reinforce.',
        params: {
          choiceSets: [
            [
              { label: 'Roots a 5th apart share one common tone: keep it in the same voice', correct: true },
              { label: "Roots a 5th apart share two common tones: keep them in the same voices", correct: false },
              { label: "Roots a 5th apart share two common tones: move them to different voices", correct: false },
              { label: "Roots a 5th apart share one common tone: move it to a different voice", correct: false },
            ],
            [
              { label: 'Roots a 3rd apart share two common tones: keep both and move one voice', correct: true },
              { label: 'Roots a 3rd apart share one common tone: keep that tone in the same voice', correct: false },
              { label: 'Roots a 3rd apart share no common tones: move all three upper voices', correct: false },
              { label: 'Roots a 3rd apart share three common tones: keep all three in the same voices', correct: false },
            ],
            [
              { label: 'Roots a 2nd apart share no common tones: move the upper voices against the bass', correct: true },
              { label: 'Roots a 2nd apart share two common tones: hold both and move one voice', correct: false },
              { label: 'Roots a 2nd apart: move all four voices in the same direction as the bass', correct: false },
              { label: 'Roots a 2nd apart share one common tone, which is held in the soprano while the others move', correct: false },
            ],
            [
              { label: "Each upper voice moves to the nearest available chord tone", correct: true },
              { label: 'Each upper voice leaps to a new chord tone to add melodic interest', correct: false },
              { label: 'Each upper voice moves to the chord tone an octave above', correct: false },
              { label: 'Each upper voice moves to the same chord tone as the bass', correct: false },
            ],
            [
              { label: 'In root-position triads, double the root by default', correct: true },
              { label: 'In root-position triads, double the leading tone', correct: false },
              { label: 'In root-position triads, double the 3rd by default', correct: false },
              { label: 'In root-position triads, never double any note', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u10m4: Triads in Inversion ----
  {
    moduleId: 'l3u10m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about triads in inversion is true?',
        hintTemplate: 'First inversion (6/3): 3rd in the bass, used for smooth bass lines. Second inversion (6/4): 5th in the bass, used only as a cadential, passing, pedal or arpeggiated 6/4. When the leading tone is in the bass (e.g. V6), do not double it.',
        nudgeTemplate: 'Read the figures as intervals above the bass: stack a 6th and a 3rd (6/3) or a 6th and a 4th (6/4) on a bass note and see which chord member ends up lowest. Then ask how each chord behaves: which notes have a strong pull, and in what few set patterns does a 6/4 appear?',
        params: {
          choiceSets: [
            [
              { label: 'First inversion puts the 3rd in the bass and can occur away from cadences', correct: true },
              { label: 'First inversion puts the 5th in the bass and can occur away from cadences', correct: false },
              { label: 'First inversion puts the 3rd in the bass and occurs only at cadences', correct: false },
              { label: 'First inversion puts the 5th in the bass and occurs only at cadences', correct: false },
            ],
            [
              { label: 'Common 6/4 types: cadential, passing, pedal, arpeggiated', correct: true },
              { label: 'Common 6/4 types: tonic, predominant, dominant, tonic substitute', correct: false },
              { label: 'Common 6/4 types: authentic, plagal, half, deceptive', correct: false },
              { label: 'Common 6/4 types: cadential, sequential, modulatory, tonicizing', correct: false },
            ],
            [
              { label: 'The cadential 6/4 decorates V: its 6th and 4th fall by step to the 5th and 3rd', correct: true },
              { label: 'The cadential 6/4 functions as tonic: its bass is the root of the tonic chord', correct: false },
              { label: 'The cadential 6/4 decorates V: its 6th falls to the 3rd and its 4th rises to the 5th', correct: false },
              { label: 'The cadential 6/4 functions as tonic: its 6th and 4th are freely used chord tones', correct: false },
            ],
            [
              { label: 'Second inversion puts the 5th in the bass and the root a 4th above it', correct: true },
              { label: 'Second inversion puts the 3rd in the bass and the root a 4th above it', correct: false },
              { label: 'Second inversion puts the 5th in the bass and the root a 6th above it', correct: false },
              { label: 'Second inversion puts the 3rd in the bass and the root a 6th above it', correct: false },
            ],
            [
              { label: 'When the leading tone is the bass of a first-inversion triad, sound the leading tone in one voice only', correct: true },
              { label: 'When the leading tone is the bass of a first-inversion triad, sound the leading tone in two voices', correct: false },
              { label: 'When the leading tone is the bass of a first-inversion triad, sound the leading tone in three voices', correct: false },
              { label: 'When the leading tone is the bass of a first-inversion triad, sound the leading tone in any number of voices', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 11: Cadences, Phrases, and Embellishment
  // =========================================================================

  // ---- l3u11m1: Cadences — The Complete Set ----
  {
    moduleId: 'l3u11m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which cadence label is correct?',
        hintTemplate: 'PAC: V-I with soprano on tonic. IAC: V-I with soprano NOT on tonic, or inverted chords. HC: ends on V. Plagal: IV-I. Deceptive: V-vi.',
        params: {
          choiceSets: [
            [
              { label: 'V–I, both in root position, soprano on the tonic: perfect authentic cadence (PAC)', correct: true },
              { label: 'V–I, both in root position, soprano on the tonic: imperfect authentic cadence (IAC)', correct: false },
              { label: 'V–I, both in root position, soprano on the tonic: half cadence', correct: false },
              { label: 'V–I, both in root position, soprano on the tonic: deceptive cadence', correct: false },
            ],
            [
              { label: 'A phrase ending on V: half cadence', correct: true },
              { label: 'A phrase ending on V: perfect authentic cadence', correct: false },
              { label: 'A phrase ending on V: plagal cadence', correct: false },
              { label: 'A phrase ending on V: deceptive cadence', correct: false },
            ],
            [
              { label: 'V resolving to vi: deceptive cadence', correct: true },
              { label: 'V resolving to vi: perfect authentic cadence (PAC)', correct: false },
              { label: 'V resolving to vi: half cadence', correct: false },
              { label: 'V resolving to vi: plagal cadence', correct: false },
            ],
            [
              { label: 'IV to I: plagal cadence', correct: true },
              { label: 'IV to I: perfect authentic cadence (PAC)', correct: false },
              { label: 'IV to I: half cadence', correct: false },
              { label: 'IV to I: deceptive cadence', correct: false },
            ],
            [
              { label: 'V–I with the soprano on the 3rd: imperfect authentic cadence', correct: true },
              { label: 'V–I with the soprano on the 3rd: perfect authentic cadence (PAC)', correct: false },
              { label: 'V–I with the soprano on the 3rd: half cadence', correct: false },
              { label: 'V–I with the soprano on the 3rd: deceptive cadence', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u11m2: Phrases and Periods ----
  {
    moduleId: 'l3u11m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about phrases and periods is true?',
        hintTemplate: 'A period has two phrases: antecedent (ending with HC or IAC) and consequent (ending with PAC). A sentence has a presentation (basic idea + repetition) and continuation. In a parallel period both phrases begin alike; in a contrasting period they begin with different material.',
        params: {
          choiceSets: [
            [
              { label: "A parallel period: both phrases begin with similar material, and the consequent has a stronger cadence than the antecedent", correct: true },
              { label: "A parallel period: both phrases begin with contrasting material, and the consequent has a stronger cadence than the antecedent", correct: false },
              { label: "A parallel period: both phrases begin with similar material, and the consequent has a weaker cadence than the antecedent", correct: false },
              { label: "A parallel period: both phrases begin with contrasting material, and the consequent has a weaker cadence than the antecedent", correct: false },
            ],
            [
              { label: 'The antecedent usually ends with a weak cadence (HC or IAC)', correct: true },
              { label: "The antecedent usually ends with the strongest cadence of the period (PAC)", correct: false },
              { label: 'The antecedent usually ends with a deceptive cadence (V–vi)', correct: false },
              { label: 'The antecedent usually ends with a plagal cadence (IV–I)', correct: false },
            ],
            [
              { label: 'A sentence: a presentation (idea + repeat), then a continuation', correct: true },
              { label: 'A sentence: a period (antecedent + consequent), then another period', correct: false },
              { label: 'A sentence: three presentations (idea + repeat), with no continuation', correct: false },
              { label: 'A sentence: a continuation, then a presentation (idea + repeat)', correct: false },
            ],
            [
              { label: 'A contrasting period: the two phrases begin with different material', correct: true },
              { label: 'A contrasting period: both phrases share similar opening material', correct: false },
              { label: 'A contrasting period: the consequent ends with a weaker cadence than the antecedent', correct: false },
              { label: 'A contrasting period: four phrases form two antecedent-consequent pairs', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u11m3: Harmonic Rhythm ----
  {
    moduleId: 'l3u11m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about harmonic rhythm is true?',
        hintTemplate: 'Harmonic rhythm is the rate at which chords change. It can accelerate toward cadences, creating a sense of forward motion and arrival. In common-practice music, chords usually change on strong beats.',
        params: {
          choiceSets: [
            [
              { label: 'Harmonic rhythm usually speeds up as a cadence approaches', correct: true },
              { label: 'Harmonic rhythm usually creates momentum by holding one chord through a cadence', correct: false },
              { label: 'Harmonic rhythm usually slows from one chord per beat to one per bar near a cadence', correct: false },
              { label: 'Harmonic rhythm usually follows the number of melody notes, regardless of when the chords change', correct: false },
            ],
            [
              { label: 'Faster harmonic rhythm usually makes the music feel more driven', correct: true },
              { label: 'Faster harmonic rhythm usually gives the passage a calmer, more static character', correct: false },
              { label: 'Faster harmonic rhythm usually makes the melody adopt shorter note values', correct: false },
              { label: 'Faster harmonic rhythm usually leaves the energy of the passage unchanged', correct: false },
            ],
            [
              { label: 'In common-practice music, chords usually change on strong beats', correct: true },
              { label: 'In common-practice music, chords usually change on weak beats rather than strong beats', correct: false },
              { label: 'In common-practice music, chords usually change whenever the melody moves to another note', correct: false },
              { label: 'In common-practice music, chords usually change whenever the bass repeats the same note', correct: false },
            ],
            [
              { label: 'Harmonic rhythm is the rate of chord changes', correct: true },
              { label: 'Harmonic rhythm is the rate of melody-note changes', correct: false },
              { label: 'Harmonic rhythm is the rate of tempo changes', correct: false },
              { label: 'Harmonic rhythm is the rate of meter changes', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 4,
  },

  // ---- l3u11m4: Non-Chord Tones (Part 1) ----
  {
    moduleId: 'l3u11m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about passing tones, neighbor tones and anticipations is true?',
        hintTemplate: 'Passing tone: step–step in the same direction between two chord tones. Neighbor: step away and back to the same chord tone (incomplete: one side by leap). Anticipation: a note of the next chord sounding early.',
        params: {
          choiceSets: [
            [
              { label: 'Approached and left by step in the same direction: a passing tone', correct: true },
              { label: 'Approached and left by step in the same direction: a neighbor tone', correct: false },
              { label: 'Approached and left by step in the same direction: an anticipation', correct: false },
              { label: 'Approached and left by step in the same direction: an incomplete neighbor', correct: false },
            ],
            [
              { label: 'Passing tones may be accented (on the beat) or unaccented', correct: true },
              { label: 'Passing tones can return by step to their starting chord tone (like complete neighbors)', correct: false },
              { label: 'Passing tones can announce the next chord early (without a stepwise connection)', correct: false },
              { label: 'Passing tones can be approached by step and left by leap (like incomplete neighbors)', correct: false },
            ],
            [
              { label: 'C–D–E over a C major chord: D is a passing tone', correct: true },
              { label: 'C–D–E over a C major chord: D is a chord tone', correct: false },
              { label: 'C–D–E over a C major chord: D is an anticipation', correct: false },
              { label: 'C–D–E over a C major chord: E is the passing tone', correct: false },
            ],
            [
              { label: 'A note that steps away from a chord tone and back to it: a neighbor tone', correct: true },
              { label: 'A note that steps away from a chord tone and back to it: a passing tone', correct: false },
              { label: 'A note that steps away from a chord tone and back to it: an anticipation', correct: false },
              { label: 'A note that steps away from a chord tone and back to it: an incomplete neighbor', correct: false },
            ],
            [
              { label: 'An incomplete neighbor is the middle note of G4–D4–E4 over a held C major chord', correct: true },
              { label: 'An incomplete neighbor is the middle note of E4–D4–C4 over a held C major chord', correct: false },
              { label: 'An incomplete neighbor is the middle note of E4–D4–E4 over a held C major chord', correct: false },
              { label: 'An incomplete neighbor is the middle note of E4–G4–C5 over a held C major chord', correct: false },
            ],
            [
              { label: 'An anticipation sounds a note of the next chord before that chord arrives', correct: true },
              { label: 'An anticipation fills the gap between two chord tones by step in the same direction', correct: false },
              { label: 'An anticipation departs by step from a chord tone and returns to its starting note', correct: false },
              { label: 'An anticipation is approached by step and left by leap, with one stepwise connection', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l3u11m5: Transposition ----
  {
    moduleId: 'l3u11m5',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Transpose the C major scale so that it starts on {root}. Select all 7 notes.',
        hintTemplate: 'Every note moves by the same interval as C moves to {root}, so the W-W-H-W-W-W-H pattern is kept: the result is the {root} major scale.',
        params: {
          roots: ['G', 'D', 'A', 'F', 'B', 'E'],
          accidentals: ['', '', '', '', 'b', 'b'],
          scaleTypes: ['major'],
          noteCounts: [7],
        },
      },
      {
        type: 'interval_id',
        promptTemplate: 'A melody that starts on {root} is transposed so that it starts on the second note shown. By what interval was it transposed?',
        hintTemplate: 'Count letter names from {root} to the new starting note for the interval number, and semitones ({semitones}) for its quality.',
        params: {
          roots: ['C', 'D', 'F', 'G'],
          accidentals: ['', '', '', ''],
          intervals: [2, 3, 4, 5, 7, 9],
          directions: ['ascending'],
          octaves: [4],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about transposition is true?',
        hintTemplate: 'Transposing moves every note by the same interval. Transposing instruments: Bb instruments sound a major 2nd lower than written, horn in F a perfect 5th lower.',
        params: {
          choiceSets: [
            [
              { label: 'Transposing moves every note by the same interval', correct: true },
              { label: 'Transposing moves only the melody, never the chords underneath', correct: false },
              { label: 'Transposing changes the intervals between the notes', correct: false },
              { label: 'Transposing keeps the letter names but changes the key signature', correct: false },
            ],
            [
              { label: 'A Bb trumpet sounds a major 2nd lower than written', correct: true },
              { label: 'A Bb trumpet sounds exactly the pitch that is written', correct: false },
              { label: 'A Bb trumpet sounds a major 2nd higher than written', correct: false },
              { label: 'A Bb trumpet sounds a perfect 5th lower than written', correct: false },
            ],
            [
              { label: 'C major transposed up a perfect 5th becomes G major, with one sharp', correct: true },
              { label: 'C major transposed up a perfect 5th becomes F major, with one flat', correct: false },
              { label: 'C major transposed up a perfect 5th keeps its key signature of no sharps or flats', correct: false },
              { label: 'C major transposed up a perfect 5th becomes D major, with two sharps', correct: false },
            ],
            [
              { label: 'A horn in F sounds a perfect 5th lower than written', correct: true },
              { label: 'A horn in F sounds a perfect 5th higher than written', correct: false },
              { label: 'A horn in F sounds a major 2nd lower than written', correct: false },
              { label: 'A horn in F sounds exactly the pitch that is written', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },
];

export default templates;
