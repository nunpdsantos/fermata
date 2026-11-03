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
        hintTemplate: 'Seventh chord inversions: root pos = 7, 1st inv = 6/5, 2nd inv = 4/3, 3rd inv = 4/2 (or 2).',
        params: {
          choiceSets: [
            [
              { label: 'Third inversion has the 7th in the bass (4/2)', correct: true },
              { label: 'Third inversion puts the 5th in the bass (figured 4/3)', correct: false },
              { label: 'Third inversion puts the 3rd in the bass (figured 6/5)', correct: false },
              { label: 'Third inversion keeps the root in the bass (figured 7)', correct: false },
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
              { label: 'In second inversion, the root stays in the bass', correct: false },
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
        hintTemplate: 'SATB ranges: Soprano C4-G5, Alto F3-C5, Tenor C3-G4, Bass E2-C4. Adjacent voices should stay within an octave (except bass-tenor).',
        params: {
          choiceSets: [
            [
              { label: 'Soprano–alto and alto–tenor stay within an octave; tenor–bass may be wider', correct: true },
              { label: 'All four voices must fit inside a single octave, from the bass up to the soprano', correct: false },
              { label: 'Any spacing is allowed, as long as each voice stays in its own range', correct: false },
              { label: 'Tenor–bass must stay within an octave, while the upper voices may spread out', correct: false },
            ],
            [
              { label: 'Voice crossing: a lower voice goes above the next voice up', correct: true },
              { label: 'Voice crossing: two voices sing the same note at the same time', correct: false },
              { label: 'Voice crossing: the soprano and the bass move in contrary motion', correct: false },
              { label: 'Voice crossing: a habit encouraged in chorales for extra melodic interest', correct: false },
            ],
            [
              { label: 'In root position, doubling the root is generally the safest choice', correct: true },
              { label: 'In root position, the leading tone is the best note to double', correct: false },
              { label: 'In root position, doubling the 3rd is always preferred', correct: false },
              { label: 'In root position, no note should ever be doubled', correct: false },
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
              { label: 'Parallel fifths: two voices a P5 apart move in the same direction to another P5', correct: true },
              { label: 'Parallel fifths: any two voices a 5th apart anywhere in a chord, whether or not they move', correct: false },
              { label: 'Parallel fifths: an error only when they occur between soprano and bass', correct: false },
              { label: 'Parallel fifths: acceptable in SATB as long as both voices move by step rather than leap', correct: false },
            ],
            [
              { label: 'The leading tone resolves up by step to the tonic', correct: true },
              { label: 'The leading tone resolves down by step to the submediant', correct: false },
              { label: 'The leading tone may move freely in any direction', correct: false },
              { label: 'The leading tone leaps up to the mediant', correct: false },
            ],
            [
              { label: 'Direct fifths between outer voices are allowed if the soprano moves by step', correct: true },
              { label: 'Direct fifths between outer voices are allowed if the soprano leaps instead of stepping', correct: false },
              { label: 'Direct fifths come from two outer voices moving in contrary motion into a perfect fifth', correct: false },
              { label: 'Direct fifths are not allowed even between the inner voices', correct: false },
            ],
            [
              { label: 'Contrary motion between the outer voices is generally preferred', correct: true },
              { label: 'Parallel motion between all four voices is generally preferred', correct: false },
              { label: 'The bass should usually move in the same direction as the soprano', correct: false },
              { label: 'Oblique motion is never used in four-part writing', correct: false },
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
              { label: 'Roots a 5th apart share no common tones: move every upper voice', correct: false },
              { label: 'Roots a 5th apart share two common tones: move only one voice', correct: false },
              { label: 'Roots a 5th apart share one common tone, which should move to a different voice', correct: false },
            ],
            [
              { label: 'Roots a 3rd apart share two common tones: keep both and move one voice', correct: true },
              { label: 'Roots a 3rd apart share one common tone: keep it and move two voices', correct: false },
              { label: 'Roots a 3rd apart share no common tones: move all three upper voices', correct: false },
              { label: 'Roots a 3rd apart share all three tones, so the upper voices never need to move', correct: false },
            ],
            [
              { label: 'Roots a 2nd apart share no common tones: move the upper voices against the bass', correct: true },
              { label: 'Roots a 2nd apart share two common tones: hold both and move one voice', correct: false },
              { label: 'Roots a 2nd apart: move all four voices in the same direction as the bass', correct: false },
              { label: 'Roots a 2nd apart share one common tone, which is held in the soprano while the others move', correct: false },
            ],
            [
              { label: 'Each upper voice moves to the nearest available chord tone', correct: true },
              { label: 'Each upper voice leaps to a new chord tone to add melodic interest', correct: false },
              { label: 'The bass must always move to its nearest chord tone, by step if possible', correct: false },
              { label: 'All four voices should move together in the same direction', correct: false },
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
        hintTemplate: 'First inversion (6/3): 3rd in the bass, used for smooth bass lines. Second inversion (6/4): 5th in the bass, used only as a cadential, passing, pedal or arpeggiated 6/4.',
        nudgeTemplate: 'Read the figures as intervals above the bass: stack a 6th and a 3rd (6/3) or a 6th and a 4th (6/4) on a bass note and see which chord member ends up lowest. Then ask how each chord behaves: which notes have a strong pull, and in what few set patterns does a 6/4 appear?',
        params: {
          choiceSets: [
            [
              { label: 'First inversion (6/3) puts the 3rd in the bass and smooths the bass line', correct: true },
              { label: 'First inversion (6/3) puts the 5th in the bass and is kept for cadences', correct: false },
              { label: 'First inversion (6/3) keeps the root in the bass but moves the 3rd up an octave', correct: false },
              { label: 'First inversion (6/3) is used only at the end of a piece', correct: false },
            ],
            [
              { label: 'The four common 6/4 chords: cadential, passing, pedal and arpeggiated', correct: true },
              { label: 'The four common 6/4 chords: root, first, second and third inversion', correct: false },
              { label: 'A 6/4 chord may be used freely anywhere in a phrase, just like a first-inversion triad', correct: false },
              { label: 'The only acceptable 6/4 chord is the one that ends a piece on the tonic', correct: false },
            ],
            [
              { label: 'The cadential 6/4 decorates V: its 6th and 4th fall by step to the 5th and 3rd', correct: true },
              { label: 'The cadential 6/4 is a tonic chord that ends the phrase in place of I', correct: false },
              { label: 'The cadential 6/4 resolves its 6th and 4th upward by step into the following tonic chord', correct: false },
              { label: 'The cadential 6/4 falls on a weak beat after the dominant chord, as a passing decoration of the bass line', correct: false },
            ],
            [
              { label: 'Second inversion (6/4) puts the 5th in the bass, with the root a 4th above it', correct: true },
              { label: 'Second inversion (6/4) puts the 3rd in the bass, with the root a 6th above it', correct: false },
              { label: 'Second inversion (6/4) puts the root in the bass, with the 5th a perfect 4th above it', correct: false },
              { label: 'Second inversion (6/4) puts the 7th in the bass', correct: false },
            ],
            [
              { label: 'In a first-inversion triad, avoid doubling the bass when it is the leading tone', correct: true },
              { label: 'In a first-inversion triad, always double the bass note, whatever it is', correct: false },
              { label: 'In a first-inversion triad, double the leading tone in the bass', correct: false },
              { label: 'In a first-inversion triad, no note may be doubled', correct: false },
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
        hintTemplate: 'A period has two phrases: antecedent (ending with HC or IAC) and consequent (ending with PAC). A sentence has a presentation (basic idea + repetition) and continuation.',
        params: {
          choiceSets: [
            [
              { label: 'A parallel period: both phrases begin with similar material', correct: true },
              { label: 'A parallel period: two phrases with unrelated material and the same cadence', correct: false },
              { label: 'A parallel period: always eight bars long', correct: false },
              { label: 'A parallel period: both phrases end with a half cadence', correct: false },
            ],
            [
              { label: 'The antecedent usually ends with a weak cadence (HC or IAC)', correct: true },
              { label: 'The antecedent usually ends with a PAC', correct: false },
              { label: 'The antecedent has no cadence', correct: false },
              { label: 'The antecedent is always the second phrase of the period', correct: false },
            ],
            [
              { label: 'A sentence: a presentation (idea + repeat), then a continuation', correct: true },
              { label: 'A sentence: another name for a period of two phrases', correct: false },
              { label: 'A sentence: always three phrases, each with its own cadence', correct: false },
              { label: 'A sentence: a continuation first, then the basic idea and its repetition', correct: false },
            ],
            [
              { label: 'A contrasting period: the two phrases begin with different material', correct: true },
              { label: 'A contrasting period: the two phrases are identical from start to finish', correct: false },
              { label: 'A contrasting period: it always modulates, ending its second phrase in a new key', correct: false },
              { label: 'A contrasting period: it has three phrases, the last one returning to the opening idea', correct: false },
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
        hintTemplate: 'Harmonic rhythm is the rate at which chords change. It can accelerate toward cadences, creating a sense of forward motion and arrival.',
        params: {
          choiceSets: [
            [
              { label: 'Harmonic rhythm usually speeds up as a cadence approaches', correct: true },
              { label: 'Harmonic rhythm stays constant from the start of a piece to the end', correct: false },
              { label: 'Harmonic rhythm usually slows down the closer a cadence gets', correct: false },
              { label: 'Harmonic rhythm changes only between sections', correct: false },
            ],
            [
              { label: 'Faster harmonic rhythm creates a greater sense of momentum', correct: true },
              { label: 'Faster harmonic rhythm creates a calmer, more static mood', correct: false },
              { label: 'Harmonic rhythm has no effect on the energy of a passage', correct: false },
              { label: 'Faster harmonic rhythm means the melody must use faster note values', correct: false },
            ],
            [
              { label: 'In common-practice music, chords usually change on strong beats', correct: true },
              { label: 'Chords may change only on beat 1 of a bar', correct: false },
              { label: 'Chords can never change in the middle of a bar', correct: false },
              { label: 'Changing chords on beats 2 and 4 is the most stable, normal choice in 4/4', correct: false },
            ],
            [
              { label: 'Harmonic rhythm is the rate of chord change, not the melody\'s rhythm', correct: true },
              { label: 'Harmonic rhythm is the rhythm the melody plays', correct: false },
              { label: 'Harmonic rhythm is the speed of the bass line', correct: false },
              { label: 'Harmonic rhythm means the number of beats in each bar of the melody', correct: false },
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
              { label: 'Passing tones always fall on the beat, never between beats', correct: false },
              { label: 'Passing tones, like neighbor tones, return to the chord tone they started from', correct: false },
              { label: 'Passing tones must always be notes from outside the key', correct: false },
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
              { label: 'An incomplete neighbor is approached or left by leap instead of step', correct: true },
              { label: 'An incomplete neighbor never resolves', correct: false },
              { label: 'An incomplete neighbor moves by a whole step only', correct: false },
              { label: 'An incomplete neighbor is approached and left by step, with no leap, like a full neighbor tone', correct: false },
            ],
            [
              { label: 'An anticipation sounds a note of the next chord before that chord arrives', correct: true },
              { label: 'An anticipation holds over a note of the previous chord', correct: false },
              { label: 'An anticipation always resolves downward by step', correct: false },
              { label: 'An anticipation is a note that belongs to neither of the two chords', correct: false },
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
