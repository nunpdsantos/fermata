import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 3 Exercises — ~45 exercises across 13 modules
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 9: Seventh Chords and Diatonic Harmony
  // =========================================================================

  // ---- l3u9m1: Seventh Chords — Five Qualities ----
  l3u9m1: [
    {
      id: 'l3u9m1e1',
      type: 'chord_build',
      prompt: 'Build a Cmaj7 chord. Select all 4 notes: root, major 3rd, perfect 5th, and major 7th.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'major7',
        noteCount: 4,
      },
      hint: 'Cmaj7 = C, E, G, B. A major triad (C-E-G) plus a major 7th (B, 11 semitones above the root).',
      points: 2,
    },
    {
      id: 'l3u9m1e2',
      type: 'chord_build',
      prompt: 'Build a Dm7 chord. Select all 4 notes: root, minor 3rd, perfect 5th, and minor 7th.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'minor7',
        noteCount: 4,
      },
      hint: 'Dm7 = D, F, A, C. A minor triad (D-F-A) plus a minor 7th (C, 10 semitones above the root).',
      points: 2,
    },
    {
      id: 'l3u9m1e3',
      type: 'multiple_choice',
      prompt: 'Which seventh chord quality has a major triad with a minor 7th?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Dominant 7th', correct: true },
          { label: 'Major 7th', correct: false },
          { label: 'Minor 7th', correct: false },
          { label: 'Half-diminished 7th', correct: false },
        ],
      },
      hint: 'The dominant 7th (e.g., G7) combines a major triad with a minor 7th. It is the only seventh chord type with this combination, creating strong tension that resolves to the tonic.',
      points: 1,
    },
    {
      id: 'l3u9m1e4',
      type: 'multiple_choice',
      prompt: 'What is the difference between a half-diminished 7th and a fully diminished 7th chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Half-diminished has a minor 7th; fully diminished has a diminished 7th (double-flatted)', correct: true },
          { label: 'Half-diminished has a major 7th; fully diminished has a minor 7th', correct: false },
          { label: 'They use different triads: half-diminished is minor, fully diminished is diminished', correct: false },
          { label: 'There is no difference; they are the same chord', correct: false },
        ],
      },
      hint: 'Both share a diminished triad (root, m3, dim5). The half-diminished adds a minor 7th (10 semitones), while the fully diminished adds a diminished 7th (9 semitones).',
      points: 1,
    },
    {
      id: 'l3u9m1e_ear1',
      type: 'ear_training',
      prompt: 'Listen to this seventh chord and identify its quality.',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'C',
        chordRootAccidental: '',
        quality: 'major7',
        choices: [
          { label: 'Major 7', correct: true },
          { label: 'Dominant 7', correct: false },
          { label: 'Minor 7', correct: false },
          { label: 'Half-diminished 7', correct: false },
        ],
      },
      hint: 'A major 7th chord: a major triad plus a major 7th (C-E-G-B). Warm and lush — the 7th sits just a half step below the octave.',
      points: 1,
    },
    {
      id: 'l3u9m1e_ear2',
      type: 'ear_training',
      prompt: 'Listen to this seventh chord and identify its quality.',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'A',
        chordRootAccidental: '',
        quality: 'minor7',
        choices: [
          { label: 'Major 7', correct: false },
          { label: 'Dominant 7', correct: false },
          { label: 'Minor 7', correct: true },
          { label: 'Half-diminished 7', correct: false },
        ],
      },
      hint: 'A minor 7th chord: a minor triad plus a minor 7th (A-C-E-G). Soft and mellow, without the restless pull of the dominant 7th.',
      points: 1,
    },
    {
      id: 'l3u9m1e_ear3',
      type: 'ear_training',
      prompt: 'Listen to this seventh chord and identify its quality.',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'D',
        chordRootAccidental: '',
        quality: 'dominant7',
        choices: [
          { label: 'Major 7', correct: false },
          { label: 'Dominant 7', correct: true },
          { label: 'Minor 7', correct: false },
          { label: 'Half-diminished 7', correct: false },
        ],
      },
      hint: 'A dominant 7th chord: a major triad plus a minor 7th (D-F#-A-C). The tritone F#-C inside it makes it restless — it wants to resolve.',
      points: 1,
    },
    {
      id: 'l3u9m1e_ear4',
      type: 'ear_training',
      prompt: 'Listen to this seventh chord and identify its quality.',
      config: {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'E',
        chordRootAccidental: '',
        quality: 'half_diminished7',
        choices: [
          { label: 'Major 7', correct: false },
          { label: 'Dominant 7', correct: false },
          { label: 'Minor 7', correct: false },
          { label: 'Half-diminished 7', correct: true },
        ],
      },
      hint: 'A half-diminished 7th chord: a diminished triad plus a minor 7th (E-G-Bb-D). Dark and unsettled — like a minor 7th chord with a lowered 5th.',
      points: 1,
    },
  ],

  // ---- l3u9m2: Seventh Chord Inversions ----
  l3u9m2: [
    {
      id: 'l3u9m2e1',
      type: 'multiple_choice',
      prompt: 'What figured bass symbol represents a seventh chord in root position?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '7 (shorthand for 7/5/3)', correct: true },
          { label: '6/5', correct: false },
          { label: '4/3', correct: false },
          { label: '4/2', correct: false },
        ],
      },
      hint: 'In root position, the intervals above the bass are 3rd, 5th, and 7th. The full figuring 7/5/3 is shortened to just 7.',
      points: 1,
    },
    {
      id: 'l3u9m2e2',
      type: 'multiple_choice',
      prompt: 'What figured bass symbol represents a seventh chord in first inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '6/5 (shorthand for 6/5/3)', correct: true },
          { label: '7', correct: false },
          { label: '4/3', correct: false },
          { label: '4/2', correct: false },
        ],
      },
      hint: 'First inversion places the 3rd of the chord in the bass. The characteristic intervals above the bass are a 6th and a 5th, giving the symbol 6/5.',
      points: 1,
    },
    {
      id: 'l3u9m2e3',
      type: 'multiple_choice',
      prompt: 'Which figured bass symbol represents a seventh chord in third inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '4/2 (shorthand for 6/4/2)', correct: true },
          { label: '6/5', correct: false },
          { label: '4/3', correct: false },
          { label: '7', correct: false },
        ],
      },
      hint: 'Third inversion places the 7th of the chord in the bass. The intervals above the bass are a 2nd and a 4th, giving the symbol 4/2 (or 2).',
      points: 1,
    },
  ],

  // ---- l3u9m3: Diatonic Seventh Chords in Major ----
  l3u9m3: [
    {
      id: 'l3u9m3e1',
      type: 'chord_build',
      prompt: 'Build a G7 (dominant 7th) chord. This is the V7 in C major. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'G',
        rootAccidental: '',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'G7 = G, B, D, F. A major triad (G-B-D) plus a minor 7th (F, 10 semitones above G). The tritone B-F drives resolution to C.',
      points: 2,
    },
    {
      id: 'l3u9m3e2',
      type: 'chord_build',
      prompt: 'Build an Am7 chord. This is the vi7 in C major. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'A',
        rootAccidental: '',
        quality: 'minor7',
        noteCount: 4,
      },
      hint: 'Am7 = A, C, E, G. A minor triad (A-C-E) plus a minor 7th (G, 10 semitones above A).',
      points: 2,
    },
    {
      id: 'l3u9m3e3',
      type: 'multiple_choice',
      prompt: 'The V7 chord contains a tritone. Which two notes form it in the key of C major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'B and F -- the leading tone and the 4th scale degree', correct: true },
          { label: 'G and D -- the root and 5th of the V chord', correct: false },
          { label: 'C and F# -- the tonic and a chromatic note', correct: false },
          { label: 'E and Bb -- the 3rd and a borrowed flat', correct: false },
        ],
      },
      hint: 'In G7 (G-B-D-F), the tritone is between B (the 3rd) and F (the 7th), spanning 6 semitones. B resolves up to C while F resolves down to E, creating the V7-I resolution.',
      points: 1,
    },
  ],

  // ---- l3u9m4: Diatonic Seventh Chords in Minor ----
  l3u9m4: [
    {
      id: 'l3u9m4e1',
      type: 'chord_build',
      prompt: 'Build an E7 chord (V7 in A minor, using harmonic minor). Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'E',
        rootAccidental: '',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'E7 = E, G#, B, D. The G# comes from the raised 7th degree of A harmonic minor. This dominant 7th chord provides the leading tone (G#) that resolves to A.',
      points: 2,
    },
    {
      id: 'l3u9m4e2',
      type: 'multiple_choice',
      prompt: 'In A natural minor, the chord built on the 7th degree (G) is a major triad. Why does this change in harmonic minor?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Raising the 7th degree (G to G#) turns VII into vii°, a diminished triad', correct: true },
          { label: 'The 7th degree chord is always diminished regardless of the minor scale form', correct: false },
          { label: 'Harmonic minor lowers the 7th degree, creating a diminished chord', correct: false },
          { label: 'The chord quality does not change between natural and harmonic minor', correct: false },
        ],
      },
      hint: 'In A natural minor, VII is G-B-D (major). Raising G to G# in harmonic minor gives G#-B-D, which is diminished (root to 3rd = m3, root to 5th = dim5).',
      points: 1,
    },
    {
      id: 'l3u9m4e3',
      type: 'multiple_choice',
      prompt: 'What is the quality of the seventh chord built on the 2nd degree of harmonic minor (ii in A minor = B)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Half-diminished 7th (m7b5)', correct: true },
          { label: 'Minor 7th', correct: false },
          { label: 'Fully diminished 7th', correct: false },
          { label: 'Dominant 7th', correct: false },
        ],
      },
      hint: 'In A harmonic minor, the ii7 chord is B-D-F-A: a diminished triad (B-D-F) plus a minor 7th (A). This combination is called half-diminished, written Bm7b5 or B\u00f8.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 10: Voice Leading and Part Writing
  // =========================================================================

  // ---- l3u10m1: SATB Basics ----
  l3u10m1: [
    {
      id: 'l3u10m1e1',
      type: 'multiple_choice',
      prompt: 'What is the standard range for the soprano voice in SATB writing?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C4 to G5 (middle C to the G an octave and a fifth above)', correct: true },
          { label: 'C3 to G4', correct: false },
          { label: 'G3 to D5', correct: false },
          { label: 'C5 to C7', correct: false },
        ],
      },
      hint: 'The soprano is the highest voice in SATB. Its practical range is approximately C4 (middle C) to G5. Exceeding this range makes the part difficult to sing.',
      points: 1,
    },
    {
      id: 'l3u10m1e2',
      type: 'multiple_choice',
      prompt: 'In SATB writing, which type of motion between two voices is generally forbidden?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Parallel motion in perfect 5ths or octaves', correct: true },
          { label: 'Contrary motion in any interval', correct: false },
          { label: 'Oblique motion where one voice stays on the same note', correct: false },
          { label: 'Similar motion in 3rds', correct: false },
        ],
      },
      hint: 'Parallel perfect 5ths and octaves are avoided because they undermine the independence of voices. Each voice should sound like its own melodic line, and parallel perfects cause voices to fuse.',
      points: 1,
    },
    {
      id: 'l3u10m1e3',
      type: 'multiple_choice',
      prompt: 'In root-position triads, which chord tone should typically be doubled?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The root of the chord', correct: true },
          { label: 'The 3rd of the chord', correct: false },
          { label: 'The 5th of the chord', correct: false },
          { label: 'Any chord tone equally', correct: false },
        ],
      },
      hint: 'Doubling the root reinforces the chord identity and is the safest choice. Avoid doubling the leading tone (scale degree 7) or other tendency tones, as it creates resolution problems.',
      points: 1,
    },
  ],

  // ---- l3u10m2: Forbidden Parallels ----
  l3u10m2: [
    {
      id: 'l3u10m2e1',
      type: 'multiple_choice',
      prompt: 'Why are parallel perfect 5ths considered problematic in voice leading?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'They destroy voice independence by making two voices sound as one', correct: true },
          { label: 'They create dissonance that the ear cannot resolve', correct: false },
          { label: 'They are physically impossible to sing', correct: false },
          { label: 'They violate the rules of rhythm', correct: false },
        ],
      },
      hint: 'Perfect intervals (unisons, 5ths, octaves) have strong acoustic fusion. When two voices move in parallel 5ths, they lose their individual identity, reducing the number of perceived independent lines.',
      points: 1,
    },
    {
      id: 'l3u10m2e2',
      type: 'multiple_choice',
      prompt: 'What are the four types of motion between two voices?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Parallel, similar, oblique, and contrary', correct: true },
          { label: 'Ascending, descending, static, and mixed', correct: false },
          { label: 'Conjunct, disjunct, chromatic, and diatonic', correct: false },
          { label: 'Consonant, dissonant, resolved, and suspended', correct: false },
        ],
      },
      hint: 'Parallel = same direction, same interval. Similar = same direction, different interval. Oblique = one voice moves, the other stays. Contrary = opposite directions.',
      points: 1,
    },
    {
      id: 'l3u10m2e3',
      type: 'multiple_choice',
      prompt: 'Which type of voice motion is most effective at creating independent voice lines?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Contrary motion -- voices move in opposite directions', correct: true },
          { label: 'Parallel motion -- voices move in the same direction by the same interval', correct: false },
          { label: 'Similar motion -- voices move in the same direction by different intervals', correct: false },
          { label: 'All types are equally effective', correct: false },
        ],
      },
      hint: 'Contrary motion maximizes voice independence because the voices travel in opposite directions. This is the most valued type of motion in counterpoint and part writing.',
      points: 1,
    },
  ],

  // ---- l3u10m3: Root Position Part Writing ----
  l3u10m3: [
    {
      id: 'l3u10m3e1',
      type: 'multiple_choice',
      prompt: 'When two root-position chords have roots a 5th apart (e.g., I to V), what voice leading technique is most important?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Retain the common tone in the same voice and move the others by step', correct: true },
          { label: 'Move all four voices in the same direction', correct: false },
          { label: 'Keep all voices as close together as possible regardless of common tones', correct: false },
          { label: 'Double the 3rd of the second chord', correct: false },
        ],
      },
      hint: 'When roots move by 5th (or 4th), the two chords share one common tone. Holding it in the same voice ensures smooth voice leading while the other voices move by step.',
      points: 1,
    },
    {
      id: 'l3u10m3e2',
      type: 'multiple_choice',
      prompt: 'When two root-position chords have roots a 2nd apart (e.g., IV to V), what is the best voice leading approach?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Move the upper three voices in contrary motion to the bass', correct: true },
          { label: 'Move all voices in parallel motion with the bass', correct: false },
          { label: 'Hold one voice as a common tone', correct: false },
          { label: 'Skip all voices to the nearest chord tone', correct: false },
        ],
      },
      hint: 'When roots move by step, there are no common tones. Moving the upper voices contrary to the bass prevents parallel 5ths and octaves while keeping voice motion smooth.',
      points: 1,
    },
    {
      id: 'l3u10m3e3',
      type: 'multiple_choice',
      prompt: 'What is the "law of the shortest way" in voice leading?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each voice should move to the nearest available chord tone, preferring stepwise motion', correct: true },
          { label: 'The bass should always move the shortest distance', correct: false },
          { label: 'Chords should be spaced as close together as possible', correct: false },
          { label: 'The piece should use the fewest possible chords', correct: false },
        ],
      },
      hint: 'Smooth voice leading minimizes the distance each voice travels. Stepwise motion (or common-tone retention) is preferred over leaps, producing more singable, connected lines.',
      points: 1,
    },
  ],

  // ---- l3u10m4: Triads in Inversion ----
  l3u10m4: [
    {
      id: 'l3u10m4e1',
      type: 'multiple_choice',
      prompt: 'What is the figured bass symbol for a triad in first inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '6 (shorthand for 6/3)', correct: true },
          { label: '5/3', correct: false },
          { label: '6/4', correct: false },
          { label: '7', correct: false },
        ],
      },
      hint: 'First inversion places the 3rd of the chord in the bass. The intervals above the bass are a 3rd and a 6th. The full 6/3 is abbreviated to just 6.',
      points: 1,
    },
    {
      id: 'l3u10m4e2',
      type: 'multiple_choice',
      prompt: 'The cadential 6/4 chord occurs on which part of the cadence?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'On a strong beat, immediately before the dominant (V) chord', correct: true },
          { label: 'On a weak beat, after the tonic chord', correct: false },
          { label: 'At the very beginning of a phrase', correct: false },
          { label: 'Only at the end of a piece, on the final chord', correct: false },
        ],
      },
      hint: 'The cadential 6/4 (I6/4) functions as a decoration of the dominant. It appears on a strong beat with the bass on scale degree 5, and the upper voices resolve down by step to form V.',
      points: 1,
    },
    {
      id: 'l3u10m4e3',
      type: 'multiple_choice',
      prompt: 'Why is second inversion (6/4) used more carefully than first inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The 4th above the bass is a dissonance that requires specific resolution', correct: true },
          { label: 'Second inversion chords sound worse than first inversion', correct: false },
          { label: 'The 5th in the bass makes the chord impossible to identify', correct: false },
          { label: 'Second inversion is banned in all classical music', correct: false },
        ],
      },
      hint: 'The perfect 4th above the bass (in 6/4 position) was treated as a dissonance in common-practice harmony. It typically appears in four specific contexts: cadential, passing, pedal, and arpeggiated 6/4.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 11: Cadences, Phrases, Embellishment
  // =========================================================================

  // ---- l3u11m1: Cadences ----
  l3u11m1: [
    {
      id: 'l3u11m1e1',
      type: 'multiple_choice',
      prompt: 'What defines a Perfect Authentic Cadence (PAC)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'V to I with both chords in root position and the tonic in the soprano on the I chord', correct: true },
          { label: 'Any progression that ends on the I chord', correct: false },
          { label: 'IV to I in root position', correct: false },
          { label: 'V to I with the 3rd of I in the soprano', correct: false },
        ],
      },
      hint: 'A PAC has three requirements: (1) V goes to I, (2) both chords are in root position, and (3) the soprano lands on the tonic note (scale degree 1). It is the strongest cadence type.',
      points: 1,
    },
    {
      id: 'l3u11m1e2',
      type: 'multiple_choice',
      prompt: 'What is a half cadence?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Any cadence that ends on the dominant (V) chord', correct: true },
          { label: 'A cadence that ends on the tonic (I) chord', correct: false },
          { label: 'A cadence that uses only half notes', correct: false },
          { label: 'A cadence that modulates to a new key', correct: false },
        ],
      },
      hint: 'A half cadence ends on V, creating an open, unresolved feeling -- like a comma in a sentence. The chord preceding V can be I, ii, IV, or vi. It demands continuation.',
      points: 1,
    },
    {
      id: 'l3u11m1e3',
      type: 'multiple_choice',
      prompt: 'In a deceptive cadence, what happens?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'V resolves to vi instead of the expected I', correct: true },
          { label: 'I resolves to V instead of the expected IV', correct: false },
          { label: 'IV resolves to ii instead of V', correct: false },
          { label: 'The cadence is played softer than expected', correct: false },
        ],
      },
      hint: 'The deceptive cadence (V to vi) sets up the expectation of a resolution to I but "deceives" the listener by going to vi instead. Vi shares two notes with I, making it a smooth but surprising substitution.',
      points: 1,
    },
    {
      id: 'l3u11m1e4',
      type: 'multiple_choice',
      prompt: 'What is a plagal cadence?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'IV to I -- the "Amen" cadence', correct: true },
          { label: 'V to I -- the strongest cadence', correct: false },
          { label: 'V to vi -- the deceptive cadence', correct: false },
          { label: 'ii to V -- a common pre-dominant progression', correct: false },
        ],
      },
      hint: 'The plagal cadence moves from IV to I. It is often called the "Amen" cadence because it is traditionally used at the end of hymns. It has a gentler, less driven quality than V-I.',
      points: 1,
    },
  ],

  // ---- l3u11m2: Phrases and Periods ----
  l3u11m2: [
    {
      id: 'l3u11m2e1',
      type: 'multiple_choice',
      prompt: 'What is an antecedent-consequent period?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Two phrases where the first ends with a half cadence and the second with an authentic cadence', correct: true },
          { label: 'A single phrase repeated exactly twice', correct: false },
          { label: 'Two phrases that are completely unrelated', correct: false },
          { label: 'A phrase that modulates to the dominant and back', correct: false },
        ],
      },
      hint: 'A period is a pair of phrases: the antecedent (question) ends inconclusively with a half cadence, and the consequent (answer) ends conclusively with a PAC. Together they make one complete musical statement, like a question and its answer.',
      points: 1,
    },
    {
      id: 'l3u11m2e2',
      type: 'multiple_choice',
      prompt: 'What makes a parallel period different from a contrasting period?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A parallel period begins both phrases with similar melodic material', correct: true },
          { label: 'A parallel period has two phrases of the same length', correct: false },
          { label: 'A parallel period uses the same cadence at the end of both phrases', correct: false },
          { label: 'A parallel period has voices moving in parallel motion', correct: false },
        ],
      },
      hint: 'In a parallel period, the consequent phrase begins like the antecedent but diverges to reach a stronger cadence. In a contrasting period, the two phrases start with different melodic ideas.',
      points: 1,
    },
    {
      id: 'l3u11m2e3',
      type: 'multiple_choice',
      prompt: 'In the classical "sentence" structure, what happens after the initial idea (presentation)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A continuation that fragments and accelerates toward a cadence', correct: true },
          { label: 'An exact repetition of the presentation', correct: false },
          { label: 'A contrasting section in a new key', correct: false },
          { label: 'A silence followed by a new theme', correct: false },
        ],
      },
      hint: 'The classical sentence has two parts: a presentation (basic idea + repetition) and a continuation (fragmentation + acceleration toward a cadence). The continuation drives the phrase to its conclusion.',
      points: 1,
    },
  ],

  // ---- l3u11m3: Harmonic Rhythm ----
  l3u11m3: [
    {
      id: 'l3u11m3e1',
      type: 'multiple_choice',
      prompt: 'What is harmonic rhythm?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The rate at which chords change in a passage', correct: true },
          { label: 'The rhythm played by the harmony instruments', correct: false },
          { label: 'The speed of the melody', correct: false },
          { label: 'The time signature of the piece', correct: false },
        ],
      },
      hint: 'Harmonic rhythm refers to how frequently the underlying harmony changes, independent of surface rhythmic activity. A passage can have fast melodic rhythm but slow harmonic rhythm (one chord per bar).',
      points: 1,
    },
    {
      id: 'l3u11m3e2',
      type: 'multiple_choice',
      prompt: 'What typically happens to harmonic rhythm at cadence points?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It accelerates -- chords change more frequently approaching the cadence', correct: true },
          { label: 'It decelerates -- chords change less frequently at cadences', correct: false },
          { label: 'It stays the same throughout the phrase', correct: false },
          { label: 'It stops completely before the cadence chord', correct: false },
        ],
      },
      hint: 'Cadential acceleration is a common technique: chord changes speed up near cadences, creating a sense of momentum and arrival. For example, chords might change every bar, then every two beats, then every beat at the cadence.',
      points: 1,
    },
    {
      id: 'l3u11m3e3',
      type: 'multiple_choice',
      prompt: 'How does slow harmonic rhythm differ in effect from fast harmonic rhythm?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Slow creates stability and repose; fast creates tension and momentum', correct: true },
          { label: 'Slow is always used in minor keys; fast in major keys', correct: false },
          { label: 'Slow means fewer notes per bar; fast means more notes per bar', correct: false },
          { label: 'There is no perceptible difference for the listener', correct: false },
        ],
      },
      hint: 'Slow harmonic rhythm (one chord for several bars) gives a sense of calm or stasis. Fast harmonic rhythm (multiple chord changes per bar) creates urgency, complexity, and forward drive.',
      points: 1,
    },
  ],

  // ---- l3u11m4: Non-Chord Tones Part 1 ----
  l3u11m4: [
    {
      id: 'l3u11m4e1',
      type: 'multiple_choice',
      prompt: 'What is a passing tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A non-chord tone that moves by step between two chord tones in the same direction', correct: true },
          { label: 'A note that is held over from the previous chord', correct: false },
          { label: 'A non-chord tone approached by leap and resolved by step', correct: false },
          { label: 'A decorative trill on a chord tone', correct: false },
        ],
      },
      hint: 'A passing tone fills in the gap between two chord tones a 3rd apart. It is approached by step and left by step in the same direction. Example: in a C chord, D passes between C and E.',
      points: 1,
    },
    {
      id: 'l3u11m4e2',
      type: 'multiple_choice',
      prompt: 'What is a neighbor tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A non-chord tone that steps away from a chord tone and then steps back to it', correct: true },
          { label: 'A non-chord tone that moves by step between two different chord tones', correct: false },
          { label: 'A chord tone that repeats on the next beat', correct: false },
          { label: 'A tone borrowed from a neighboring key', correct: false },
        ],
      },
      hint: 'A neighbor tone (or auxiliary tone) leaves a chord tone by step (up or down) and returns to the same chord tone. It decorates a single pitch: chord tone -> step away -> step back.',
      points: 1,
    },
    {
      id: 'l3u11m4e3',
      type: 'multiple_choice',
      prompt: 'What is an anticipation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A non-chord tone that arrives early -- sounding a note of the next chord before the chord changes', correct: true },
          { label: 'A chord tone that is delayed until after the beat', correct: false },
          { label: 'A note that is held over from the previous chord', correct: false },
          { label: 'A rest that replaces an expected note', correct: false },
        ],
      },
      hint: 'An anticipation "anticipates" the next chord by sounding one of its tones early, before the harmony changes. It is typically a short, unaccented note that resolves by staying on the same pitch.',
      points: 1,
    },
  ],

  // ---- l3u11m5: Transposition ----
  l3u11m5: [
    {
      id: 'l3u11m5e1',
      type: 'interval_id',
      prompt: 'Transpose C4 up by a major 2nd. Identify the interval of 2 semitones ascending from C.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 2,
        direction: 'ascending',
      },
      hint: 'A major 2nd is 2 semitones. C up 2 semitones = D. Transposing up by a major 2nd moves every note up by a whole step.',
      points: 1,
    },
    {
      id: 'l3u11m5e2',
      type: 'interval_id',
      prompt: 'Transpose C4 up by a perfect 5th. Identify the interval of 7 semitones ascending from C.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 7,
        direction: 'ascending',
      },
      hint: 'A perfect 5th is 7 semitones. C up 7 semitones = G. Transposing up a P5 is one of the most common transpositions, moving from C major to G major.',
      points: 1,
    },
    {
      id: 'l3u11m5e3',
      type: 'multiple_choice',
      prompt: 'When transposing a melody up by a minor 3rd, what happens to the key signature?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It changes to reflect the new key (e.g., C major becomes Eb major, gaining 3 flats)', correct: true },
          { label: 'It stays the same; only the notes move', correct: false },
          { label: 'Sharps and flats are removed', correct: false },
          { label: 'Every note gets an accidental', correct: false },
        ],
      },
      hint: 'Transposition shifts everything to a new key. Moving up a minor 3rd (3 semitones) from C major lands on Eb major. The new key signature (3 flats) preserves all the interval relationships.',
      points: 1,
    },
  ],
};

export default exercises;
