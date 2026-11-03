import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 6 Exercises — Chromatic Harmony — ~36 exercises across 12 modules
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 18: Chromatic Chords
  // =========================================================================

  // ---- l6u18m1: Neapolitan Chord bII ----
  l6u18m1: [
    {
      id: 'l6u18m1e1',
      type: 'chord_build',
      prompt: 'Build the Neapolitan chord (bII) in C minor. Select all 3 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: 'b',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'The Neapolitan chord is a major triad built on the lowered 2nd degree. In C minor, bII = Db major = Db, F, Ab (pitch classes 1, 5, 8).',
    },
    {
      id: 'l6u18m1e2',
      type: 'multiple_choice',
      prompt: 'What is the harmonic function of the Neapolitan chord (bII)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "A chromatic pre-dominant that prepares the dominant in place of ii or iv", correct: true },
          { label: "A chromatic dominant that replaces V and resolves directly to the tonic", correct: false },
          { label: "A chromatic tonic that prepares the dominant in place of ii or iv", correct: false },
          { label: "A chromatic dominant that prepares ii or iv in place of V", correct: false },
        ],
      },
      hint: 'The Neapolitan functions as a pre-dominant chord, typically moving to V (often through a cadential 6/4). It intensifies the approach to the dominant with its chromatic root.',
    },
    {
      id: 'l6u18m1e3',
      type: 'multiple_choice',
      prompt: 'Which bass note is usual for a Neapolitan chord in C minor?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'F', correct: true },
          { label: 'Db', correct: false },
          { label: 'Ab', correct: false },
          { label: 'C', correct: false },
        ],
      },
      hint: 'The Neapolitan is almost always found in first inversion (bII6), placing the 4th scale degree in the bass. This provides smoother voice leading to V.',
    },
  ],

  // ---- l6u18m2: Italian/French Augmented 6th ----
  l6u18m2: [
    {
      id: 'l6u18m2e1',
      type: 'multiple_choice',
      prompt: 'How many semitones does the augmented 6th interval span?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "10 semitones", correct: true },
          { label: "9 semitones", correct: false },
          { label: "8 semitones", correct: false },
          { label: "11 semitones", correct: false },
        ],
      },
      hint: 'An augmented 6th is one half step larger than a major 6th (9 semitones). It spans 10 semitones and is enharmonically the same size as a minor 7th, but the two notes resolve outward to an octave.',
    },
    {
      id: 'l6u18m2e2',
      type: 'multiple_choice',
      prompt: 'What distinguishes the Italian augmented 6th (It+6) from the French augmented 6th (Fr+6)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The French adds an augmented 4th above the bass; the Italian has only three notes', correct: true },
          { label: "The Italian adds an augmented 4th above the bass; the French has only three notes", correct: false },
          { label: 'The French adds a perfect 5th above the bass; the Italian has only three notes', correct: false },
          { label: 'The Italian adds a perfect 5th above the bass; the French has only three notes', correct: false },
        ],
      },
      hint: 'The Italian +6 is the simplest: b6, 1, #4 (three notes). The French +6 adds the 2nd scale degree (b6, 1, 2, #4), creating a characteristic whole-tone subset with an augmented 4th above the bass.',
      nudge: "Spell both over the same bass, b6: list each chord's scale degrees and count them. Then find the note the French has that the Italian lacks, and measure it against the bass.",
    },
    {
      id: 'l6u18m2e3',
      type: 'multiple_choice',
      prompt: 'What is the harmonic function of augmented 6th chords?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Pre-dominant: it prepares the dominant harmony in a cadential progression', correct: true },
          { label: 'Dominant: it prepares the tonic arrival in a cadential progression', correct: false },
          { label: 'Tonic: it provides the stable resting point at the end of a phrase', correct: false },
          { label: 'Mediant: it supplies the iii or VI harmony in the tonal progression', correct: false },
        ],
      },
      hint: 'All augmented 6th chords function as chromatic pre-dominants. The augmented 6th interval (b6 and #4) resolves outward by half step in both voices to the dominant note, creating an intensely directed approach to V.',
    },
  ],

  // ---- l6u18m3: German Augmented 6th ----
  l6u18m3: [
    {
      id: 'l6u18m3e1',
      type: 'multiple_choice',
      prompt: 'The German augmented 6th chord (Gr+6) is enharmonically equivalent to which common chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Dominant seventh', correct: true },
          { label: 'Diminished seventh', correct: false },
          { label: 'Half-diminished seventh', correct: false },
          { label: 'Major seventh', correct: false },
        ],
      },
      hint: 'The Gr+6 has the same pitch classes as a dominant 7th chord. For example, in C minor the Gr+6 (Ab, C, Eb, F#) sounds identical to Ab7 (Ab, C, Eb, Gb). The different spelling reflects different voice-leading destinations.',
    },
    {
      id: 'l6u18m3e2',
      type: 'multiple_choice',
      prompt: 'How is the German augmented 6th chord spelled in a minor key (e.g., C minor)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Ab, C, Eb, F# -- b6, 1, b3, #4", correct: true },
          { label: "Ab, C, D, F# -- b6, 1, 2, #4", correct: false },
          { label: "Ab, C, E, F# -- b6, 1, 3, #4", correct: false },
          { label: "A, C, Eb, F# -- 6, 1, b3, #4", correct: false },
        ],
      },
      hint: 'In C minor, the Gr+6 contains b6 (Ab), 1 (C), b3 (Eb), and #4 (F#). The crucial augmented 6th interval is between Ab and F#, which resolves outward to G-G (octave on the dominant).',
    },
    {
      id: 'l6u18m3e3',
      type: 'multiple_choice',
      prompt: 'Which is the standard German-sixth resolution that avoids parallel fifths?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Gr+6 → I6/4 → V", correct: true },
          { label: "Gr+6 → V → I6/4", correct: false },
          { label: 'Gr+6 → IV6/4 → V', correct: false },
          { label: 'Gr+6 → I6/4 → IV', correct: false },
        ],
      },
      hint: 'Like all augmented 6th chords, the Gr+6 resolves to V. b6 (usually in the bass) and #4 (in an upper voice) move outward by half step to an octave on the dominant pitch. A cadential 6/4 often intervenes to avoid parallel 5ths.',
    },
  ],

  // ---- l6u18m4: Enharmonic Modulation Gr+6 <-> V7 ----
  l6u18m4: [
    {
      id: 'l6u18m4e1',
      type: 'multiple_choice',
      prompt: 'What is the fundamental principle behind enharmonic modulation using the Gr+6 and V7?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Same sounding pitches; a new harmonic function and resolution', correct: true },
          { label: 'Same sounding pitches; the original function and resolution remain', correct: false },
          { label: 'Same sounding pitches; a new key signature suffices without harmonic reinterpretation', correct: false },
          { label: 'Same sounding pitches; a semitone alteration is required before reinterpretation', correct: false },
        ],
      },
      hint: 'Since Gr+6 and V7 are enharmonically identical, a single sonority can pivot between two distant keys. The respelling changes which voice leads where, redirecting the harmonic trajectory.',
    },
    {
      id: 'l6u18m4e2',
      type: 'multiple_choice',
      prompt: 'How many semitones apart are the keys connected by direct Gr+6/V7 enharmonic modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '1', correct: true },
          { label: '2', correct: false },
          { label: '7', correct: false },
          { label: '6', correct: false },
        ],
      },
      hint: 'Diatonic pivot chords work best between closely related keys. Reinterpreting the tonic key\'s Gr+6 as V7 (or vice versa) moves the tonic by a half step — C to Db is five steps around the circle of fifths, a distant key reached through a single chord. It is a signature technique of Romantic-era composers.',
      nudge: "Respell C major's Gr+6 (Ab, C, Eb, F#) with Gb in place of F#: which key is it now the V7 of? Then measure how far that tonic is from C, both as an interval and around the circle of fifths.",
    },
    {
      id: 'l6u18m4e3',
      type: 'multiple_choice',
      prompt: 'If a Gr+6 in C minor (Ab, C, Eb, F#) is reinterpreted as a V7, what key does it now tonicize?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Db major/minor -- respelled as Ab, C, Eb, Gb = Ab7 = V7/Db', correct: true },
          { label: "G major/minor -- respelled as Ab, C, Eb, Gb = Ab7 = V7/G", correct: false },
          { label: "F major/minor -- respelled as Ab, C, Eb, Gb = Ab7 = V7/F", correct: false },
          { label: "Eb major/minor -- respelled as Ab, C, Eb, Gb = Ab7 = V7/Eb", correct: false },
        ],
      },
      hint: 'Respelling F# as Gb turns the chord into Ab, C, Eb, Gb = Ab dominant 7th. Ab7 is V7 of Db, so the music can pivot smoothly from C minor into Db major — a shift of a half step, bridging very distant tonal territory.',
    },
  ],

  // =========================================================================
  // Unit 19: Advanced Chromatic Techniques
  // =========================================================================

  // ---- l6u19m1: Enharmonic Modulation via dim7 ----
  l6u19m1: [
    {
      id: 'l6u19m1e1',
      type: 'chord_build',
      prompt: 'Build a fully diminished 7th chord on C. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'diminished7',
        noteCount: 4,
      },
      hint: 'A diminished 7th chord stacks three minor 3rds: C (0), Eb (3), Gb (6), Bbb (9). These four pitch classes divide the octave into equal parts. Bbb is enharmonically A.',
    },
    {
      id: 'l6u19m1e2',
      type: 'multiple_choice',
      prompt: 'Which cyclic semitone spacing explains the symmetry of a fully diminished seventh chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '3 + 3 + 3 + 3', correct: true },
          { label: '2 + 4 + 2 + 4', correct: false },
          { label: '1 + 5 + 1 + 5', correct: false },
          { label: '3 + 3 + 4 + 2', correct: false },
        ],
      },
      hint: 'The dim7 chord is built entirely of minor 3rds (3 semitones each). Since 3 x 4 = 12, the four notes divide the octave evenly. This means every inversion of the chord sounds identical in interval structure.',
    },
    {
      id: 'l6u19m1e3',
      type: 'multiple_choice',
      prompt: 'How many different tonic roots can a single diminished 7th chord target as a leading-tone chord (viio7)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Four tonic roots", correct: true },
          { label: "Two tonic roots", correct: false },
          { label: "Twelve tonic roots", correct: false },
          { label: "One tonic root", correct: false },
        ],
      },
      hint: 'Because of its symmetry, each note of the dim7 chord can be respelled as a leading tone resolving up by half step to a different tonic. C-Eb-Gb-Bbb can be vii°7 of Db, E, G, or Bb.',
    },
  ],

  // ---- l6u19m2: Common-Tone Diminished 7th ----
  l6u19m2: [
    {
      id: 'l6u19m2e1',
      type: 'multiple_choice',
      prompt: 'Which four-note sonority can decorate F major as a common-tone diminished seventh, holding F?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'F–G#–B–D', correct: true },
          { label: 'F–A–C–E', correct: false },
          { label: 'F–A–C–Eb', correct: false },
          { label: 'F–Ab–C–Eb', correct: false },
        ],
      },
      hint: 'The common-tone diminished 7th keeps one note (the common tone) from the chord it decorates. The other three voices move by step, creating a chromatic neighbor-note embellishment.',
    },
    {
      id: 'l6u19m2e2',
      type: 'multiple_choice',
      prompt: 'In a CTo7 embellishing a C major chord, which note is typically the common tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "C", correct: true },
          { label: "E", correct: false },
          { label: "G", correct: false },
          { label: 'E and G', correct: false },
        ],
      },
      hint: 'The most common form retains the root of the target chord. For a CTo7 embellishing C major, C is held while the other voices (D#, F#, A) move by step back to the notes of the C major chord.',
    },
    {
      id: 'l6u19m2e3',
      type: 'multiple_choice',
      prompt: 'What is the primary function of a common-tone diminished 7th chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Ornamentation of a chord', correct: true },
          { label: 'Tonicization of a chord', correct: false },
          { label: 'Replacement of the dominant', correct: false },
          { label: 'Modulation to another key', correct: false },
        ],
      },
      hint: 'Unlike vii°7 (which has dominant function), the CTo7 is purely decorative. It embellishes a chord through chromatic neighbor motion, adding color without changing the harmonic direction.',
    },
  ],

  // ---- l6u19m3: Chromatic Mediants ----
  l6u19m3: [
    {
      id: 'l6u19m3e1',
      type: 'multiple_choice',
      prompt: 'Which pair illustrates a chromatic-mediant relationship?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C major → E major', correct: true },
          { label: 'C major → G major', correct: false },
          { label: 'C major → F major', correct: false },
          { label: 'C major → A minor', correct: false },
        ],
      },
      hint: 'Diatonic mediants (I-iii, I-vi) share two common tones. Chromatic mediants such as C major to E major or Ab major have roots a 3rd apart and the same quality (both major or both minor), with one common tone. Doubly chromatic mediants, such as C major to Eb minor, share none.',
    },
    {
      id: 'l6u19m3e2',
      type: 'multiple_choice',
      prompt: 'How many types of chromatic third relations exist between major triads?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Four types", correct: true },
          { label: "Two types", correct: false },
          { label: "Six types", correct: false },
          { label: "Three types", correct: false },
        ],
      },
      hint: 'From any major triad, you can move to another major triad a major or minor 3rd above or below: C to E, C to Eb, C to A, C to Ab. Each produces a different color, and all four are chromatic mediants.',
    },
    {
      id: 'l6u19m3e3',
      type: 'multiple_choice',
      prompt: 'In C major → E major, which smooth voice leading keeps the common E?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C→B, E→E, G→G#', correct: true },
          { label: 'C→C#, E→E, G→G#', correct: false },
          { label: 'C→B, E→E, G→G', correct: false },
          { label: 'C→C#, E→E, G→G', correct: false },
        ],
      },
      hint: 'Chromatic mediants often share one common tone while the other voices shift by half step. In some cases (doubly chromatic mediants like C major to Ab minor, Ab-Cb-Eb) there are zero common tones, and every voice shifts by half step: C to Cb, E to Eb, G to Ab.',
    },
  ],

  // ---- l6u19m4: Late Romantic Techniques ----
  l6u19m4: [
    {
      id: 'l6u19m4e1',
      type: 'multiple_choice',
      prompt: 'What characterizes "nonfunctional harmony" in late Romantic music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Chord connections are shaped mainly by shared pitches and gentle movement in each part', correct: true },
          { label: 'Chord connections are shaped mainly by moving every voice through the same tritone', correct: false },
          { label: 'Chord connections are shaped mainly by removing shared pitches between successive chords', correct: false },
          { label: 'Chord connections are shaped mainly by alternating two fixed chords throughout a piece', correct: false },
        ],
      },
      hint: 'In nonfunctional harmony, chord progressions are driven by smooth voice leading, shared tones, or coloristic effect rather than the traditional T-PD-D-T functional cycle. Wagner, Liszt, and late Chopin pioneered this approach.',
    },
    {
      id: 'l6u19m4e2',
      type: 'multiple_choice',
      prompt: 'What is chromatic planing (parallel harmony)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "All parts shift by an identical interval, preserving the chord's spacing", correct: true },
          { label: 'All parts move to notes of the key, adjusting the chord intervals', correct: false },
          { label: 'All parts except the bass stay fixed while the bass changes', correct: false },
          { label: 'All parts move to their nearest available chord notes', correct: false },
        ],
      },
      hint: 'Planing moves an entire chord structure (e.g., a major triad or dominant 7th) up or down chromatically or by whole steps, maintaining the same voicing. Debussy used this extensively.',
    },
    {
      id: 'l6u19m4e3',
      type: 'multiple_choice',
      prompt: 'What does "dissolution of tonality" refer to in late 19th-century music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The loss of a secure home key through pervasive chromaticism and remote modulation', correct: true },
          { label: 'The loss of regular meter through constantly changing time signatures', correct: false },
          { label: 'The loss of chordal harmony in favor of a single unison melody', correct: false },
          { label: 'The loss of thematic repetition in favor of continuously new material', correct: false },
        ],
      },
      hint: 'Composers like Wagner (Tristan und Isolde) used continuous chromaticism, deceptive resolutions, and enharmonic ambiguity so extensively that the sense of a home key became elusive — paving the way for atonality in the 20th century.',
    },
  ],

  // =========================================================================
  // Unit 20: Counterpoint and Part Writing
  // =========================================================================

  // ---- l6u20m1: Species Counterpoint 1-3 ----
  l6u20m1: [
    {
      id: 'l6u20m1e1',
      type: 'multiple_choice',
      prompt: 'What is the complete set of consonant intervals allowed above the lower cantus firmus in first species?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Unisons, 3rds, perfect 5ths, 6ths and octaves', correct: true },
          { label: 'Unisons, 3rds, 4ths, perfect 5ths, 6ths and octaves', correct: false },
          { label: 'Unisons, perfect 5ths and octaves', correct: false },
          { label: 'Unisons, 2nds, 4ths, 6ths and octaves', correct: false },
        ],
      },
      hint: 'First species allows only consonances: perfect consonances (P1, P5, P8) and imperfect consonances (3rds and 6ths). Dissonances (2nds, 4ths, 7ths, tritones) are forbidden in first species.',
    },
    {
      id: 'l6u20m1e2',
      type: 'multiple_choice',
      prompt: 'In second species counterpoint (two notes against one), how are dissonances treated?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Dissonances may appear only on weak beats as passing tones approached and left by step", correct: true },
          { label: "Dissonances may appear only on strong beats as passing tones approached and left by step", correct: false },
          { label: "Dissonances may appear only on weak beats as passing tones approached and left by leap", correct: false },
          { label: "Dissonances may appear only on strong beats as passing tones approached and left by leap", correct: false },
        ],
      },
      hint: 'Second species introduces the passing tone: a dissonance on a weak beat that fills in the gap between two consonances by stepwise motion. Strong beats must still be consonant.',
    },
    {
      id: 'l6u20m1e3',
      type: 'multiple_choice',
      prompt: 'What rhythmic relationship defines third species counterpoint?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Four notes in the counterpoint against each note of the cantus firmus", correct: true },
          { label: "Three notes in the counterpoint against each note of the cantus firmus", correct: false },
          { label: "Two notes in the counterpoint against each note of the cantus firmus", correct: false },
          { label: "One note in the counterpoint against each note of the cantus firmus", correct: false },
        ],
      },
      hint: 'Third species sets four quarter notes against each whole note in the cantus firmus. This introduces neighbor tones and double passing tones (two passing tones in a row, moving stepwise in one direction to fill a fourth) in addition to the passing tones from second species.',
    },
  ],

  // ---- l6u20m2: Species Counterpoint 4-5 ----
  l6u20m2: [
    {
      id: 'l6u20m2e1',
      type: 'multiple_choice',
      prompt: 'Which describes a fourth-species suspension?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Weak-beat preparation is held into strong-beat dissonance, resolving by step from the higher note to the lower note", correct: true },
          { label: "Strong-beat preparation is held into weak-beat dissonance, resolving by step from the higher note to the lower note", correct: false },
          { label: "Weak-beat preparation is held into strong-beat dissonance, resolving by step from the lower note to the higher note", correct: false },
          { label: "Strong-beat preparation is held into weak-beat dissonance, resolving by step from the lower note to the higher note", correct: false },
        ],
      },
      hint: 'Fourth species introduces the suspension: a consonance on a weak beat is tied into the next strong beat where it becomes a dissonance, then resolves downward by step. This creates the characteristic syncopated texture.',
    },
    {
      id: 'l6u20m2e2',
      type: 'multiple_choice',
      prompt: 'What defines fifth species counterpoint (florid counterpoint)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A mix of earlier species, using varied note values and their rules for dissonance', correct: true },
          { label: 'A mix of earlier species, using varied note values without their rules for dissonance', correct: false },
          { label: 'A mix of earlier species, using one fixed note value and their rules for dissonance', correct: false },
          { label: 'A mix of earlier species, using one fixed note value without their rules for dissonance', correct: false },
        ],
      },
      hint: 'Fifth (florid) species combines techniques from all four previous species into a flowing melodic line. It uses whole notes, half notes, quarter notes, suspensions, and passing tones in a musically satisfying way.',
    },
    {
      id: 'l6u20m2e3',
      type: 'multiple_choice',
      prompt: 'What are the three stages of a properly executed suspension?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Preparation (consonance), suspension (dissonance on strong beat), resolution (step down)", correct: true },
          { label: "Preparation (dissonance), suspension (consonance on strong beat), resolution (step down)", correct: false },
          { label: "Preparation (consonance), suspension (dissonance on strong beat), resolution (step up)", correct: false },
          { label: "Preparation (dissonance), suspension (consonance on strong beat), resolution (step up)", correct: false },
        ],
      },
      hint: 'A suspension requires: (1) Preparation — the note is introduced as a consonance; (2) Suspension — the note is held (tied) into a strong beat where it becomes dissonant; (3) Resolution — the note resolves downward by step to a consonance.',
    },
  ],

  // ---- l6u20m3: Three-Part/Invertible Counterpoint ----
  l6u20m3: [
    {
      id: 'l6u20m3e1',
      type: 'multiple_choice',
      prompt: 'What does "invertible counterpoint at the octave" mean?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The upper line can become the lower line while the counterpoint remains valid', correct: true },
          { label: 'The upper line can become the lower line only by abandoning valid counterpoint', correct: false },
          { label: 'The upper line remains the upper line while both lines reverse their note order', correct: false },
          { label: 'The upper line remains the upper line while both lines transpose by an octave', correct: false },
        ],
      },
      hint: 'In invertible counterpoint at the octave, voice A above voice B sounds correct, AND voice B above voice A also sounds correct. When the voices swap, intervals invert: 3rds become 6ths, 5ths become 4ths, etc.',
    },
    {
      id: 'l6u20m3e2',
      type: 'multiple_choice',
      prompt: 'What is triple counterpoint?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Three independent lines can exchange high, middle and low positions freely while preserving valid counterpoint', correct: true },
          { label: 'Three independent lines can exchange positions only if the original bass remains lowest', correct: false },
          { label: 'Three independent lines can exchange positions by cyclic rotation but fail in the other orders', correct: false },
          { label: 'Three independent lines can exchange positions only if the original melody remains highest', correct: false },
        ],
      },
      hint: 'Triple counterpoint means three voices (A, B, C) can be rearranged in any order — ABC, ACB, BAC, BCA, CAB, CBA — and all six permutations produce correct counterpoint. Bach mastered this technique.',
    },
    {
      id: 'l6u20m3e3',
      type: 'multiple_choice',
      prompt: 'Why must perfect 5ths be avoided or carefully handled in invertible counterpoint at the octave?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Inversion gives a 4th, treated as dissonant above the bass', correct: true },
          { label: 'Inversion gives a tritone, treated as dissonant above the bass', correct: false },
          { label: 'Inversion gives a 2nd, treated as dissonant above the bass', correct: false },
          { label: 'Inversion gives a 7th, treated as dissonant above the bass', correct: false },
        ],
      },
      hint: 'When voices invert at the octave, a P5 becomes a P4. In two-voice counterpoint, 4ths against the bass are dissonant. So any P5 in the original becomes a problem when the voices swap positions.',
    },
  ],

  // ---- l6u20m4: Advanced Part Writing ----
  l6u20m4: [
    {
      id: 'l6u20m4e1',
      type: 'multiple_choice',
      prompt: 'What are the four voices of chorale-style part writing, from highest to lowest?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Soprano, Alto, Tenor, Bass", correct: true },
          { label: "Soprano, Tenor, Alto, Bass", correct: false },
          { label: "Bass, Tenor, Alto, Soprano", correct: false },
          { label: "Alto, Soprano, Bass, Tenor", correct: false },
        ],
      },
      hint: 'SATB stands for Soprano (highest), Alto, Tenor, and Bass (lowest). Soprano and Alto share the treble staff; Tenor and Bass share the bass staff in standard chorale notation.',
    },
    {
      id: 'l6u20m4e2',
      type: 'multiple_choice',
      prompt: 'What does figured bass realization require a performer to do?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Supply the missing harmonies above the written lowest part, guided by its figures", correct: true },
          { label: 'Play the bass line alone, reading its numbers as chord durations', correct: false },
          { label: 'Double the bass line in three upper voices', correct: false },
          { label: 'Transpose each bass note by the interval its number shows', correct: false },
        ],
      },
      hint: 'Figured bass was the Baroque shorthand for harmony. The player reads the written bass note and the figures (numbers) below it, then fills in the upper voices to create complete chords following voice-leading rules.',
    },
    {
      id: 'l6u20m4e3',
      type: 'multiple_choice',
      prompt: 'When reading a transposing instrument score (e.g., Bb clarinet), what must you do to find the sounding pitch?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Apply the instrument’s sounding transposition to the written pitch', correct: true },
          { label: 'Apply no transposition to the written pitch', correct: false },
          { label: 'Apply the instrument’s sounding transposition backwards to the written pitch', correct: false },
          { label: 'Apply an upward-octave transposition to the written pitch', correct: false },
        ],
      },
      hint: 'A Bb clarinet sounds a major 2nd lower than written. When the part says C, the instrument sounds Bb. Score reading requires knowing each instrument\'s transposition to hear the actual (concert) pitches.',
    },
  ],
};

export default exercises;
