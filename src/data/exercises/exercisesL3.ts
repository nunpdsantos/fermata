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
      nudge: 'Build a seventh chord on each degree of C major, white keys only, and find the one with a major triad and a minor 7th. The chord type is named after that degree.',
    },
    {
      id: 'l3u9m1e4',
      type: 'multiple_choice',
      prompt: 'What is the difference between a half-diminished 7th and a fully diminished 7th chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Half-diminished has a minor 7th; fully diminished has a diminished 7th', correct: true },
          { label: "Half-diminished has a minor 7th; fully diminished has a minor 7th", correct: false },
          { label: "Half-diminished has a diminished 7th; fully diminished has a minor 7th", correct: false },
          { label: "Half-diminished has a diminished 7th; fully diminished has a diminished 7th", correct: false },
        ],
      },
      hint: 'Both share a diminished triad (root, m3, dim5). The half-diminished adds a minor 7th (10 semitones), while the fully diminished adds a diminished 7th (9 semitones).',
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
      nudge: 'Listen in two steps. First the triad underneath: bright (major), soft (minor), or tense and hollow (diminished)? Then the 7th on top: is it right next to the root an octave up, rubbing against it, or a whole step below it?',
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
      nudge: 'Listen in two steps. First the triad underneath: bright (major), soft (minor), or tense and hollow (diminished)? Then the 7th on top: is it right next to the root an octave up, rubbing against it, or a whole step below it?',
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
      nudge: 'Listen in two steps. First the triad underneath: bright (major), soft (minor), or tense and hollow (diminished)? Then the 7th on top: is it right next to the root an octave up, rubbing against it, or a whole step below it?',
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
      nudge: 'Listen in two steps. First the triad underneath: bright (major), soft (minor), or tense and hollow (diminished)? Then the 7th on top: is it right next to the root an octave up, rubbing against it, or a whole step below it?',
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
          { label: '6/5 (shorthand for 6/5/3)', correct: false },
          { label: '4/3 (shorthand for 6/4/3)', correct: false },
          { label: '4/2 (shorthand for 6/4/2)', correct: false },
        ],
      },
      hint: 'In root position, the intervals above the bass are 3rd, 5th, and 7th. The full figuring 7/5/3 is shortened to just 7.',
    },
    {
      id: 'l3u9m2e2',
      type: 'multiple_choice',
      prompt: 'What figured bass symbol represents a seventh chord in first inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '6/5 (shorthand for 6/5/3)', correct: true },
          { label: '7 (shorthand for 7/5/3)', correct: false },
          { label: '4/3 (shorthand for 6/4/3)', correct: false },
          { label: '4/2 (shorthand for 6/4/2)', correct: false },
        ],
      },
      hint: 'First inversion places the 3rd of the chord in the bass. The characteristic intervals above the bass are a 6th and a 5th, giving the symbol 6/5.',
    },
    {
      id: 'l3u9m2e3',
      type: 'multiple_choice',
      prompt: 'Which figured bass symbol represents a seventh chord in third inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '4/2 (shorthand for 6/4/2)', correct: true },
          { label: '6/5 (shorthand for 6/5/3)', correct: false },
          { label: '4/3 (shorthand for 6/4/3)', correct: false },
          { label: '7 (shorthand for 7/5/3)', correct: false },
        ],
      },
      hint: 'Third inversion places the 7th of the chord in the bass. The intervals above the bass are a 2nd and a 4th, giving the symbol 4/2 (or 2).',
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
    },
    {
      id: 'l3u9m3e3',
      type: 'multiple_choice',
      prompt: 'The V7 chord contains a tritone. Which two notes form it in the key of C major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'B and F -- the leading tone and the 4th scale degree', correct: true },
          { label: "G and D -- the root of the chord and the 2nd scale degree", correct: false },
          { label: "G and B -- the root of the chord and the leading tone", correct: false },
          { label: "D and F -- the 2nd scale degree and the 4th scale degree", correct: false },
        ],
      },
      hint: 'In G7 (G-B-D-F), the tritone is between B (the 3rd) and F (the 7th), spanning 6 semitones. B resolves up to C while F resolves down to E, creating the V7-I resolution.',
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
    },
    {
      id: 'l3u9m4e2',
      type: 'multiple_choice',
      prompt: 'In A harmonic minor, what triad is built on the raised seventh degree G#?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Diminished', correct: true },
          { label: 'Augmented', correct: false },
          { label: 'Major', correct: false },
          { label: 'Minor', correct: false },
        ],
      },
      hint: 'In A natural minor, VII is G-B-D (major). Raising G to G# in harmonic minor gives G#-B-D, which is diminished (root to 3rd = m3, root to 5th = dim5).',
    },
    {
      id: 'l3u9m4e3',
      type: 'multiple_choice',
      prompt: 'What is the quality of the seventh chord built on the 2nd degree of harmonic minor (ii in A minor = B)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Half-diminished 7th (m7b5)', correct: true },
          { label: "Minor 7th (m7)", correct: false },
          { label: "Diminished 7th (dim7)", correct: false },
          { label: "Dominant 7th (7)", correct: false },
        ],
      },
      hint: 'In A harmonic minor, the ii7 chord is B-D-F-A: a diminished triad (B-D-F) plus a minor 7th (A). This combination is called half-diminished, written Bm7b5 or B\u00f8.',
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
          { label: 'C4 to G5', correct: true },
          { label: 'C3 to G4', correct: false },
          { label: 'F3 to C5', correct: false },
          { label: 'E2 to C4', correct: false },
        ],
      },
      hint: 'The soprano is the highest voice in SATB. Its practical range is approximately C4 (middle C) to G5. Exceeding this range makes the part difficult to sing.',
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
      nudge: "The rule protects each voice's independence. Which motion makes two voices fuse into one, by moving together while keeping the same open, hollow-sounding consonance?",
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
          { label: 'They usually turn the consonant fifth between two voices into a harmonic dissonance', correct: false },
          { label: 'They usually put both voices outside the range that singers can produce', correct: false },
          { label: 'They change the written durations when two voices move in the same direction', correct: false },
        ],
      },
      hint: 'Perfect intervals (unisons, 5ths, octaves) have strong acoustic fusion. When two voices move in parallel 5ths, they lose their individual identity, reducing the number of perceived independent lines.',
    },
    {
      id: 'l3u10m2e2',
      type: 'multiple_choice',
      prompt: "Which definitions correctly describe the four types of motion between two voices?",
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Contrary: opposite directions; parallel: same direction and interval; similar: same direction, different intervals; oblique: one voice holds', correct: true },
          { label: 'Contrary: opposite directions; parallel: same direction, different intervals; similar: same direction and interval; oblique: one voice holds', correct: false },
          { label: 'Contrary: opposite directions; parallel: same direction and interval; similar: one voice holds; oblique: same direction, different intervals', correct: false },
          { label: 'Contrary: opposite directions; parallel: one voice holds; similar: same direction, different intervals; oblique: same direction and interval', correct: false },
        ],
      },
      hint: 'Parallel = same direction, same interval. Similar = same direction, different interval. Oblique = one voice moves, the other stays. Contrary = opposite directions.',
      nudge: 'Classify by how two voices move relative to each other: in the same direction or in opposite ones, keeping the same interval or changing it, or with one voice holding still.',
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
      nudge: 'Independence means each voice keeps its own shape. Which motion makes the two lines least alike, so that neither seems to shadow the other?',
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
          { label: "Transfer the common tone to another voice and move the others by step", correct: false },
          { label: "Retain the common tone in the same voice and move the others in parallel with the bass", correct: false },
          { label: "Transfer the common tone to another voice and move the others in parallel with the bass", correct: false },
        ],
      },
      hint: 'When roots move by 5th (or 4th), the two chords share one common tone. Holding it in the same voice ensures smooth voice leading while the other voices move by step.',
      nudge: 'Spell I and V in C major and find the note they share. How can that shared note help every voice move as little as possible?',
    },
    {
      id: 'l3u10m3e2',
      type: 'multiple_choice',
      prompt: 'When two root-position chords have roots a 2nd apart (e.g., IV to V), what is the best voice leading approach?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Move the upper three voices in contrary motion to the bass', correct: true },
          { label: 'Move the upper voices in parallel motion with the bass', correct: false },
          { label: 'Hold a common tone while the bass moves by step', correct: false },
          { label: 'Move soprano and bass in parallel octaves', correct: false },
        ],
      },
      hint: 'When roots move by step, there are no common tones. Moving the upper voices contrary to the bass prevents parallel 5ths and octaves while keeping voice motion smooth.',
    },
    {
      id: 'l3u10m3e3',
      type: 'multiple_choice',
      prompt: 'What is the "law of the shortest way" in voice leading?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each upper voice moves to the closest tone of the next chord', correct: true },
          { label: 'Each upper voice keeps the same note through every chord change', correct: false },
          { label: 'Each upper voice follows the bass in the same direction', correct: false },
          { label: 'Each upper voice moves by leap while the bass moves by step', correct: false },
        ],
      },
      hint: 'Smooth voice leading minimizes the distance each voice travels. Stepwise motion (or common-tone retention) is preferred over leaps, producing more singable, connected lines.',
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
          { label: '5/3 (often omitted)', correct: false },
          { label: '6/4 (always written in full)', correct: false },
          { label: '7 (shorthand for 7/5/3)', correct: false },
        ],
      },
      hint: 'First inversion places the 3rd of the chord in the bass. The intervals above the bass are a 3rd and a 6th. The full 6/3 is abbreviated to just 6.',
    },
    {
      id: 'l3u10m4e2',
      type: 'multiple_choice',
      prompt: 'The cadential 6/4 chord occurs on which part of the cadence?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'On a strong beat, preparing V at the cadence', correct: true },
          { label: 'On a weak beat, preparing V at the cadence', correct: false },
          { label: 'On a strong beat, following V at the cadence', correct: false },
          { label: 'On a weak beat, following V at the cadence', correct: false },
        ],
      },
      hint: 'The cadential 6/4 (I6/4) functions as a decoration of the dominant. It appears on a strong beat with the bass on scale degree 5, and the 6th and 4th above the bass fall by step to the 5th and 3rd to form V.',
    },
    {
      id: 'l3u10m4e3',
      type: 'multiple_choice',
      prompt: 'Why is second inversion (6/4) used more carefully than first inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The 4th above the bass is a dissonance that requires specific resolution', correct: true },
          { label: 'The 6th above the bass is a dissonance that usually resolves to an octave', correct: false },
          { label: 'The 5th in the bass is an unstable note that has to resolve down by step', correct: false },
          { label: 'The inversion changes a consonant major triad into a dissonant diminished triad', correct: false },
        ],
      },
      hint: 'The perfect 4th above the bass (in 6/4 position) was treated as a dissonance in common-practice harmony. It typically appears in four specific contexts: cadential, passing, pedal, and arpeggiated 6/4.',
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
          { label: 'V to I, both in root position, with the tonic in the soprano', correct: true },
          { label: 'V to I, both in first inversion, with the tonic in the soprano', correct: false },
          { label: 'V to I, both in root position, with the 3rd of I in the soprano', correct: false },
          { label: 'V to I, both in root position, with the 5th of I in the soprano', correct: false },
        ],
      },
      hint: 'A PAC has three requirements: (1) V goes to I, (2) both chords are in root position, and (3) the soprano lands on the tonic note (scale degree 1). It is the strongest cadence type.',
    },
    {
      id: 'l3u11m1e2',
      type: 'multiple_choice',
      prompt: 'On which chord does a half cadence end?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'V', correct: true },
          { label: 'IV', correct: false },
          { label: 'vi', correct: false },
          { label: 'I', correct: false },
        ],
      },
      hint: 'A half cadence ends on V, creating an open, unresolved feeling -- like a comma in a sentence. The chord preceding V can be, for example, I, ii, IV, or vi. It demands continuation.',
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
    },
    {
      id: 'l3u11m1e4',
      type: 'multiple_choice',
      prompt: 'What is a plagal cadence?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'IV to I', correct: true },
          { label: 'V to I', correct: false },
          { label: 'V to vi', correct: false },
          { label: 'ii to V', correct: false },
        ],
      },
      hint: 'The plagal cadence moves from IV to I. It is often called the "Amen" cadence because it is traditionally used at the end of hymns. It has a gentler, less driven quality than V-I.',
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
          { label: 'Two phrases: the first ends with a weaker cadence, the second with a stronger cadence', correct: true },
          { label: 'Two phrases: the first ends with a stronger cadence, the second with a weaker cadence', correct: false },
          { label: 'Two phrases: both share a basic idea and end with the same weak cadence', correct: false },
          { label: 'Two phrases: the first is a continuation, the second repeats the basic idea', correct: false },
        ],
      },
      hint: 'The antecedent ends with a weaker cadence, usually a half cadence or an imperfect authentic cadence (IAC). The consequent answers with a stronger cadence, usually a perfect authentic cadence (PAC). It is the increase in cadential strength that links the two phrases.',
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
    },
    {
      id: 'l3u11m2e3',
      type: 'multiple_choice',
      prompt: 'In the classical "sentence" structure, what happens after the presentation (the basic idea and its repetition)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A continuation that fragments and accelerates toward a cadence', correct: true },
          { label: 'A continuation that states the basic idea a third time unchanged before the cadence', correct: false },
          { label: "A continuation that abandons the cadence and restarts the basic idea", correct: false },
          { label: 'A continuation that answers the presentation with a contrasting phrase, as in a period', correct: false },
        ],
      },
      hint: 'The classical sentence has two parts: a presentation (basic idea + repetition) and a continuation (fragmentation + acceleration toward a cadence). The continuation drives the phrase to its conclusion.',
    },
  ],

  // ---- l3u11m3: Harmonic Rhythm ----
  l3u11m3: [
    {
      id: 'l3u11m3e1',
      type: 'multiple_choice',
      prompt: 'Harmonic rhythm measures the rate of change of which musical element?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The chords', correct: true },
          { label: 'The melody', correct: false },
          { label: 'The tempo', correct: false },
          { label: 'The accompaniment figuration', correct: false },
        ],
      },
      hint: 'Harmonic rhythm refers to how frequently the underlying harmony changes, independent of surface rhythmic activity. A passage can have fast melodic rhythm but slow harmonic rhythm (one chord per bar).',
    },
    {
      id: 'l3u11m3e2',
      type: 'multiple_choice',
      prompt: 'How does harmonic rhythm typically behave as a cadence approaches?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It speeds up -- chords change more often near the cadence', correct: true },
          { label: 'It slows down -- chords change less often as the cadence nears', correct: false },
          { label: 'It stays the same -- chords change at the same rate near the cadence', correct: false },
          { label: 'It slows down -- a single chord is usually sustained through the final cadence', correct: false },
        ],
      },
      hint: 'Cadential acceleration is a common technique: chord changes speed up near cadences, creating a sense of momentum and arrival. For example, chords might change every bar, then every two beats, then every beat at the cadence.',
    },
    {
      id: 'l3u11m3e3',
      type: 'multiple_choice',
      prompt: 'How does slow harmonic rhythm differ in effect from fast harmonic rhythm?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Slow creates stability and repose; fast creates tension and momentum', correct: true },
          { label: 'Slow creates momentum and tension; fast creates open space', correct: false },
          { label: 'Slow sets longer melody notes; fast sets shorter melody notes', correct: false },
          { label: 'Slow fixes one melody note per bar; fast fixes one per beat', correct: false },
        ],
      },
      hint: 'Slow harmonic rhythm (one chord for several bars) gives a sense of calm or stasis. Fast harmonic rhythm (multiple chord changes per bar) creates urgency, complexity, and forward drive.',
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
          { label: 'A non-chord tone approached by step that returns by step to its starting chord tone', correct: false },
          { label: 'A non-chord tone that sounds a note belonging to the next chord early', correct: false },
          { label: 'A non-chord tone approached by step and left by leap between chord tones', correct: false },
        ],
      },
      hint: 'A passing tone fills in the gap between two chord tones a 3rd apart. It is approached by step and left by step in the same direction. Example: in a C chord, D passes between C and E.',
    },
    {
      id: 'l3u11m4e2',
      type: 'multiple_choice',
      prompt: 'Which pattern has a neighbor tone in the middle over a held C major chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'E4–F4–E4', correct: true },
          { label: 'E4–D4–C4', correct: false },
          { label: 'G4–E4–G4', correct: false },
          { label: 'E4–G4–C5', correct: false },
        ],
      },
      hint: 'A neighbor tone (or auxiliary tone) leaves a chord tone by step (up or down) and returns to the same chord tone. It decorates a single pitch: chord tone → step away → step back.',
      nudge: 'Over a C major chord, compare C–D–C with C–D–E: one of them is a passing tone. What does the D do in the other one?',
    },
    {
      id: 'l3u11m4e3',
      type: 'multiple_choice',
      prompt: 'What is an anticipation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A non-chord tone that sounds a note of the next chord early', correct: true },
          { label: 'A non-chord tone that fills the gap between two chord tones by step', correct: false },
          { label: 'A non-chord tone that departs by step and returns to its starting note', correct: false },
          { label: 'A non-chord tone that is approached by step and left by leap', correct: false },
        ],
      },
      hint: 'An anticipation "anticipates" the next chord by sounding one of its tones early, before the harmony changes. It is typically a short, unaccented note that resolves by staying on the same pitch.',
    },
  ],

  // ---- l3u11m5: Transposition ----
  l3u11m5: [
    {
      id: 'l3u11m5e1',
      type: 'interval_id',
      prompt: 'A melody that starts on C4 is transposed so that it starts on the second note shown. By what interval was it transposed?',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 2,
        direction: 'ascending',
      },
      hint: 'A major 2nd is 2 semitones. C up 2 semitones = D. Transposing up by a major 2nd moves every note up by a whole step.',
      nudge: 'The transposition interval is the interval from C up to the new starting note. Count the letter names from C to the second note on the staff for the number, then count the half steps between them for the quality.',
    },
    {
      id: 'l3u11m5e2',
      type: 'interval_id',
      prompt: 'C4 is transposed to the second note shown. Name the interval of this transposition.',
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 7,
        direction: 'ascending',
      },
      hint: 'A perfect 5th is 7 semitones. C up 7 semitones = G. Transposing up a P5 is one of the most common transpositions, moving from C major to G major.',
      nudge: 'Every note moves by the same interval, so measure it on the first note alone: count the letter names from C up to the second note shown, both included, then check whether that note belongs to C major to settle the quality.',
    },
    {
      id: 'l3u11m5e3',
      type: 'multiple_choice',
      prompt: 'A melody in C major is transposed up a minor 3rd. What is the new key signature?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Key signature of Eb major: 3 flats', correct: true },
          { label: 'Key signature of D major: 2 sharps', correct: false },
          { label: 'Key signature of E major: 4 sharps', correct: false },
          { label: 'Key signature of Ab major: 4 flats', correct: false },
        ],
      },
      hint: 'Transposition shifts everything to a new key. Moving up a minor 3rd (3 semitones) from C major lands on Eb major. The new key signature (3 flats) preserves all the interval relationships.',
    },
  ],
};

export default exercises;
