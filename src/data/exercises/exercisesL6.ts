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
      prompt: 'Build the Neapolitan chord (bII) in C minor. This is a Db major triad: select Db, F, and Ab.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: 'b',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'The Neapolitan chord is a major triad built on the lowered 2nd degree. In C minor, bII = Db major = Db, F, Ab (pitch classes 1, 5, 8).',
      points: 2,
    },
    {
      id: 'l6u18m1e2',
      type: 'multiple_choice',
      prompt: 'What is the harmonic function of the Neapolitan chord (bII)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Pre-dominant -- it substitutes for ii or iv and moves to V', correct: true },
          { label: 'Dominant -- it resolves directly to the tonic', correct: false },
          { label: 'Tonic -- it functions as a substitute for I', correct: false },
          { label: 'Passing chord -- it has no structural function', correct: false },
        ],
      },
      hint: 'The Neapolitan functions as a pre-dominant chord, typically moving to V (often through a cadential 6/4). It intensifies the approach to the dominant with its chromatic root.',
      points: 1,
    },
    {
      id: 'l6u18m1e3',
      type: 'multiple_choice',
      prompt: 'In which inversion is the Neapolitan chord most typically found?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'First inversion (bII6) with the 3rd in the bass', correct: true },
          { label: 'Root position with the lowered 2nd degree in the bass', correct: false },
          { label: 'Second inversion (bII6/4) with the 5th in the bass', correct: false },
          { label: 'It appears equally in all inversions', correct: false },
        ],
      },
      hint: 'The Neapolitan is almost always found in first inversion (bII6), placing the 4th scale degree in the bass. This provides smoother voice leading to V.',
      points: 1,
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
          { label: '10 semitones -- enharmonically equivalent to a minor 7th', correct: true },
          { label: '9 semitones -- the same as a major 6th', correct: false },
          { label: '8 semitones -- the same as a minor 6th', correct: false },
          { label: '11 semitones -- the same as a major 7th', correct: false },
        ],
      },
      hint: 'An augmented 6th is one half step larger than a major 6th (9 semitones). It spans 10 semitones and is enharmonically the same size as a minor 7th, but the two notes resolve outward to an octave.',
      points: 1,
    },
    {
      id: 'l6u18m2e2',
      type: 'multiple_choice',
      prompt: 'What distinguishes the Italian augmented 6th (It+6) from the French augmented 6th (Fr+6)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The French adds an augmented 4th above the bass; the Italian has only three notes', correct: true },
          { label: 'The Italian has four notes; the French has only three', correct: false },
          { label: 'The French resolves to the tonic; the Italian resolves to the dominant', correct: false },
          { label: 'They are the same chord with different names based on the era of use', correct: false },
        ],
      },
      hint: 'The Italian +6 is the simplest: b6, 1, #4 (three notes). The French +6 adds the 2nd scale degree (b6, 1, 2, #4), creating a characteristic whole-tone subset with an augmented 4th above the bass.',
      points: 1,
    },
    {
      id: 'l6u18m2e3',
      type: 'multiple_choice',
      prompt: 'What is the harmonic function of augmented 6th chords?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Pre-dominant -- they intensify motion toward the dominant', correct: true },
          { label: 'Dominant -- they resolve directly to the tonic', correct: false },
          { label: 'Tonic prolongation -- they decorate the tonic harmony', correct: false },
          { label: 'Mediant function -- they substitute for iii or VI', correct: false },
        ],
      },
      hint: 'All augmented 6th chords function as chromatic pre-dominants. The augmented 6th interval (b6 and #4) resolves outward by half step in both voices to the dominant note, creating an intensely directed approach to V.',
      points: 1,
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
          { label: 'A dominant 7th chord (V7) -- same pitches, different spelling and resolution', correct: true },
          { label: 'A diminished 7th chord -- same interval structure', correct: false },
          { label: 'A half-diminished 7th chord -- same sound, different context', correct: false },
          { label: 'A major 7th chord -- identical in close position', correct: false },
        ],
      },
      hint: 'The Gr+6 has the same pitch classes as a dominant 7th chord. For example, in C minor the Gr+6 (Ab, C, Eb, F#) sounds identical to Ab7 (Ab, C, Eb, Gb). The different spelling reflects different voice-leading destinations.',
      points: 1,
    },
    {
      id: 'l6u18m3e2',
      type: 'multiple_choice',
      prompt: 'How is the German augmented 6th chord spelled in a minor key (e.g., C minor)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Ab, C, Eb, F# -- b6, 1, b3, #4', correct: true },
          { label: 'Ab, C, E, F# -- b6, 1, 3, #4', correct: false },
          { label: 'Ab, Cb, Eb, F# -- b6, b1, b3, #4', correct: false },
          { label: 'Ab, C, Eb, Gb -- b6, 1, b3, b5', correct: false },
        ],
      },
      hint: 'In C minor, the Gr+6 contains b6 (Ab), 1 (C), b3 (Eb), and #4 (F#). The crucial augmented 6th interval is between Ab and F#, which resolves outward to G-G (octave on the dominant).',
      points: 1,
    },
    {
      id: 'l6u18m3e3',
      type: 'multiple_choice',
      prompt: 'The German augmented 6th chord typically resolves to which chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The dominant (V) or cadential 6/4, with b6 and #4 resolving outward to 5', correct: true },
          { label: 'The tonic (I) directly in root position', correct: false },
          { label: 'The subdominant (IV) as part of a plagal cadence', correct: false },
          { label: 'The supertonic (ii) to begin a pre-dominant chain', correct: false },
        ],
      },
      hint: 'Like all augmented 6th chords, the Gr+6 resolves to V. The outer voices (b6 and #4) converge on the dominant pitch by half step. A cadential 6/4 often intervenes to avoid parallel 5ths.',
      points: 1,
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
          { label: 'A chord that functions as Gr+6 in one key can be respelled as V7 in a distant key, or vice versa', correct: true },
          { label: 'Any dominant 7th chord can substitute for any augmented 6th chord in any key', correct: false },
          { label: 'The modulation requires chromatic voice leading in all four voices simultaneously', correct: false },
          { label: 'The two chords share the same resolution regardless of their spelling', correct: false },
        ],
      },
      hint: 'Since Gr+6 and V7 are enharmonically identical, a single sonority can pivot between two distant keys. The respelling changes which voice leads where, redirecting the harmonic trajectory.',
      points: 1,
    },
    {
      id: 'l6u18m4e2',
      type: 'multiple_choice',
      prompt: 'Enharmonic modulation via Gr+6/V7 allows direct modulation to keys that are how far apart?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Distant keys -- e.g. tonics a half step apart (C to Db), five steps around the circle of fifths, far beyond diatonic pivot range', correct: true },
          { label: 'Only closely related keys within one accidental difference', correct: false },
          { label: 'Only between parallel major and minor', correct: false },
          { label: 'Only between relative major and minor keys', correct: false },
        ],
      },
      hint: 'Diatonic pivot chords only connect closely related keys. Reinterpreting the tonic key\'s Gr+6 as V7 (or vice versa) moves the tonic by a half step -- C to Db is five steps around the circle of fifths, a distant key reached through a single chord. It is a signature technique of Romantic-era composers.',
      points: 1,
    },
    {
      id: 'l6u18m4e3',
      type: 'multiple_choice',
      prompt: 'If a Gr+6 in C minor (Ab, C, Eb, F#) is reinterpreted as a V7, what key does it now tonicize?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Db major/minor -- respelled as Ab, C, Eb, Gb = Ab7 = V7/Db', correct: true },
          { label: 'G major -- because F# resolves up to G', correct: false },
          { label: 'F major -- the chord becomes V7/F', correct: false },
          { label: 'Eb major -- because Eb is the middle note', correct: false },
        ],
      },
      hint: 'Respelling F# as Gb turns the chord into Ab, C, Eb, Gb = Ab dominant 7th. Ab7 is V7 of Db, so the music can pivot smoothly from C minor into Db major -- a shift of a half step, bridging very distant tonal territory.',
      points: 1,
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
      prompt: 'Build a fully diminished 7th chord on C. Select 4 notes: C, Eb, Gb, and Bbb (enharmonic A).',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'diminished7',
        noteCount: 4,
      },
      hint: 'A diminished 7th chord stacks three minor 3rds: C (0), Eb (3), Gb (6), Bbb (9). These four pitch classes divide the octave into equal parts. Bbb is enharmonically A.',
      points: 2,
    },
    {
      id: 'l6u19m1e2',
      type: 'multiple_choice',
      prompt: 'Why is the fully diminished 7th chord symmetrical?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It divides the 12-semitone octave into four equal minor 3rds (0, 3, 6, 9)', correct: true },
          { label: 'It contains only natural notes with no sharps or flats', correct: false },
          { label: 'Its inversions produce different interval content each time', correct: false },
          { label: 'It has the same number of major and minor intervals', correct: false },
        ],
      },
      hint: 'The dim7 chord is built entirely of minor 3rds (3 semitones each). Since 3 x 4 = 12, the four notes divide the octave evenly. This means every inversion of the chord sounds identical in interval structure.',
      points: 1,
    },
    {
      id: 'l6u19m1e3',
      type: 'multiple_choice',
      prompt: 'How many different keys can a single diminished 7th chord resolve to as a leading-tone chord (viio7)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Four keys -- any of its four notes can be treated as a leading tone', correct: true },
          { label: 'Two keys -- one major and one minor', correct: false },
          { label: 'Twelve keys -- one for each semitone', correct: false },
          { label: 'One key -- determined by its root', correct: false },
        ],
      },
      hint: 'Because of its symmetry, each note of the dim7 chord can be respelled as a leading tone resolving up by half step to a different tonic. C-Eb-Gb-Bbb can be viio7 of Db, E, G, or Bb.',
      points: 1,
    },
  ],

  // ---- l6u19m2: Common-Tone Diminished 7th ----
  l6u19m2: [
    {
      id: 'l6u19m2e1',
      type: 'multiple_choice',
      prompt: 'What defines a common-tone diminished 7th chord (CTo7)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A diminished 7th chord that shares one note with the chord it embellishes', correct: true },
          { label: 'A diminished 7th chord that resolves to the dominant', correct: false },
          { label: 'Any diminished 7th chord used in a minor key', correct: false },
          { label: 'A diminished 7th chord that shares all notes with the next chord', correct: false },
        ],
      },
      hint: 'The common-tone diminished 7th keeps one note (the common tone) from the chord it decorates. The other three voices move by step, creating a chromatic neighbor-note embellishment.',
      points: 1,
    },
    {
      id: 'l6u19m2e2',
      type: 'multiple_choice',
      prompt: 'In a CTo7 embellishing a C major chord, which note is typically the common tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The root of the chord being embellished (C)', correct: true },
          { label: 'The 3rd of the chord being embellished (E)', correct: false },
          { label: 'The 5th of the chord being embellished (G)', correct: false },
          { label: 'The 7th of the chord being embellished (B)', correct: false },
        ],
      },
      hint: 'The most common form retains the root of the target chord. For a CTo7 embellishing C major, C is held while the other voices (D#, F#, A) move by step back to the notes of the C major chord.',
      points: 1,
    },
    {
      id: 'l6u19m2e3',
      type: 'multiple_choice',
      prompt: 'What is the primary function of a common-tone diminished 7th chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Embellishment -- it prolongs or decorates a chord rather than driving harmonic progression', correct: true },
          { label: 'Pre-dominant -- it prepares the dominant like augmented 6th chords', correct: false },
          { label: 'Dominant -- it resolves to the tonic with leading-tone motion', correct: false },
          { label: 'Modulatory -- it always initiates a key change', correct: false },
        ],
      },
      hint: 'Unlike viio7 (which has dominant function), the CTo7 is purely decorative. It embellishes a chord through chromatic neighbor motion, adding color without changing the harmonic direction.',
      points: 1,
    },
  ],

  // ---- l6u19m3: Chromatic Mediants ----
  l6u19m3: [
    {
      id: 'l6u19m3e1',
      type: 'multiple_choice',
      prompt: 'What defines a chromatic mediant relationship between two chords?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Two chords whose roots are a 3rd apart with a chromatic alteration changing the expected quality', correct: true },
          { label: 'Two chords whose roots are a 2nd apart connected by chromatic passing tones', correct: false },
          { label: 'Any chord progression that uses chromatic voice leading', correct: false },
          { label: 'Two chords that share all three notes but in different inversions', correct: false },
        ],
      },
      hint: 'Diatonic mediants (I-iii, I-vi) share two common tones. Chromatic mediants (e.g., C major to E major, or C major to Ab major) have roots a 3rd apart but with altered quality, sharing only one or zero common tones.',
      points: 1,
    },
    {
      id: 'l6u19m3e2',
      type: 'multiple_choice',
      prompt: 'How many types of chromatic third relations exist between major triads?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Four -- upper/lower major 3rd and upper/lower minor 3rd (e.g., C-E, C-Ab, C-Eb, C-A)', correct: true },
          { label: 'Two -- one ascending and one descending', correct: false },
          { label: 'Six -- one for each interval class', correct: false },
          { label: 'Three -- major, minor, and diminished third relations', correct: false },
        ],
      },
      hint: 'From any major triad, you can move to another major triad a major or minor 3rd above or below: C to E, C to Eb, C to A, C to Ab. Each produces a different color, and all four are chromatic mediants.',
      points: 1,
    },
    {
      id: 'l6u19m3e3',
      type: 'multiple_choice',
      prompt: 'What is the characteristic voice-leading feature of chromatic mediant progressions?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'One or zero common tones with chromatic (half-step) motion in the moving voices', correct: true },
          { label: 'All voices move by step in the same direction', correct: false },
          { label: 'Two common tones with one voice moving by whole step', correct: false },
          { label: 'Root motion by fifth with altered chord tones', correct: false },
        ],
      },
      hint: 'Chromatic mediants often share one common tone while the other voices shift by half step. In some cases (doubly chromatic mediants like C major to Ab minor, Ab-Cb-Eb) there are zero common tones, and every voice shifts by half step: C to Cb, E to Eb, G to Ab.',
      points: 1,
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
          { label: 'Chords are connected by voice leading or color rather than by tonic-dominant function', correct: true },
          { label: 'The music avoids using triads or seventh chords entirely', correct: false },
          { label: 'All chords are diminished or augmented with no major or minor triads', correct: false },
          { label: 'The harmony uses only two chords throughout an entire piece', correct: false },
        ],
      },
      hint: 'In nonfunctional harmony, chord progressions are driven by smooth voice leading, shared tones, or coloristic effect rather than the traditional T-PD-D-T functional cycle. Wagner, Liszt, and late Chopin pioneered this approach.',
      points: 1,
    },
    {
      id: 'l6u19m4e2',
      type: 'multiple_choice',
      prompt: 'What is chromatic planing (parallel harmony)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Moving a fixed chord shape in parallel motion by half steps or whole steps', correct: true },
          { label: 'Alternating between two chords repeatedly', correct: false },
          { label: 'Resolving every chord chromatically to the next by half step in the bass', correct: false },
          { label: 'Playing all twelve chromatic pitches simultaneously', correct: false },
        ],
      },
      hint: 'Planing moves an entire chord structure (e.g., a major triad or dominant 7th) up or down chromatically or by whole steps, maintaining the same voicing. Debussy used this extensively.',
      points: 1,
    },
    {
      id: 'l6u19m4e3',
      type: 'multiple_choice',
      prompt: 'What does "dissolution of tonality" refer to in late 19th-century music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The weakening of a clear tonal center through pervasive chromaticism and remote modulations', correct: true },
          { label: 'The deliberate use of only one key throughout an entire composition', correct: false },
          { label: 'The elimination of rhythm and meter from musical structure', correct: false },
          { label: 'The replacement of all harmony with unison melodies', correct: false },
        ],
      },
      hint: 'Composers like Wagner (Tristan und Isolde) used continuous chromaticism, deceptive resolutions, and enharmonic ambiguity so extensively that the sense of a home key became elusive -- paving the way for atonality in the 20th century.',
      points: 1,
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
      prompt: 'In first species counterpoint (note against note), which intervals are considered consonant above the cantus firmus?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Unisons, 3rds, 5ths, 6ths, and octaves', correct: true },
          { label: 'Only perfect consonances: unisons, 5ths, and octaves', correct: false },
          { label: 'All intervals except the tritone', correct: false },
          { label: '2nds, 4ths, and 7ths in addition to 3rds and 6ths', correct: false },
        ],
      },
      hint: 'First species allows only consonances: perfect consonances (P1, P5, P8) and imperfect consonances (3rds and 6ths). Dissonances (2nds, 4ths, 7ths, tritones) are forbidden in first species.',
      points: 1,
    },
    {
      id: 'l6u20m1e2',
      type: 'multiple_choice',
      prompt: 'In second species counterpoint (two notes against one), how are dissonances treated?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Dissonances may appear only on weak beats as passing tones approached and left by step', correct: true },
          { label: 'Dissonances are completely forbidden as in first species', correct: false },
          { label: 'Dissonances may appear on any beat as long as they resolve by step', correct: false },
          { label: 'Dissonances are allowed freely on both strong and weak beats', correct: false },
        ],
      },
      hint: 'Second species introduces the passing tone: a dissonance on a weak beat that fills in the gap between two consonances by stepwise motion. Strong beats must still be consonant.',
      points: 1,
    },
    {
      id: 'l6u20m1e3',
      type: 'multiple_choice',
      prompt: 'What rhythmic relationship defines third species counterpoint?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Four notes in the counterpoint against each note of the cantus firmus', correct: true },
          { label: 'Three notes against each cantus firmus note', correct: false },
          { label: 'Two notes against each cantus firmus note', correct: false },
          { label: 'Free rhythm with no fixed ratio', correct: false },
        ],
      },
      hint: 'Third species sets four quarter notes against each whole note in the cantus firmus. This introduces neighbor tones and double passing tones (two passing tones in a row, moving stepwise in one direction to fill a fourth) in addition to the passing tones from second species.',
      points: 1,
    },
  ],

  // ---- l6u20m2: Species Counterpoint 4-5 ----
  l6u20m2: [
    {
      id: 'l6u20m2e1',
      type: 'multiple_choice',
      prompt: 'Fourth species counterpoint is primarily defined by what rhythmic device?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Syncopation through suspensions -- tied notes create dissonance on strong beats', correct: true },
          { label: 'Dotted rhythms alternating between long and short notes', correct: false },
          { label: 'Triplet figures against duple meter', correct: false },
          { label: 'Freely mixed note values without any specific pattern', correct: false },
        ],
      },
      hint: 'Fourth species introduces the suspension: a consonance on a weak beat is tied into the next strong beat where it becomes a dissonance, then resolves downward by step. This creates the characteristic syncopated texture.',
      points: 1,
    },
    {
      id: 'l6u20m2e2',
      type: 'multiple_choice',
      prompt: 'What defines fifth species counterpoint (florid counterpoint)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A free combination of all previous species -- mixed note values, passing tones, and suspensions', correct: true },
          { label: 'Five notes against each note of the cantus firmus', correct: false },
          { label: 'Counterpoint written for five voices simultaneously', correct: false },
          { label: 'Strict imitation at the fifth interval throughout', correct: false },
        ],
      },
      hint: 'Fifth (florid) species combines techniques from all four previous species into a flowing melodic line. It uses whole notes, half notes, quarter notes, suspensions, and passing tones in a musically satisfying way.',
      points: 1,
    },
    {
      id: 'l6u20m2e3',
      type: 'multiple_choice',
      prompt: 'What are the three stages of a properly executed suspension?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Preparation (consonance), suspension (dissonance on strong beat), resolution (step down)', correct: true },
          { label: 'Attack (dissonance), sustain (held note), release (leap away)', correct: false },
          { label: 'Approach by leap, hold, resolve by leap', correct: false },
          { label: 'Consonance, consonance, dissonance', correct: false },
        ],
      },
      hint: 'A suspension requires: (1) Preparation -- the note is introduced as a consonance; (2) Suspension -- the note is held (tied) into a strong beat where it becomes dissonant; (3) Resolution -- the note resolves downward by step to a consonance.',
      points: 1,
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
          { label: 'Two voices can swap positions (upper becomes lower) and still produce correct counterpoint', correct: true },
          { label: 'The melody is played backwards (retrograde) at the octave', correct: false },
          { label: 'Both voices are transposed up by an octave simultaneously', correct: false },
          { label: 'The intervals between voices are inverted (3rds become 6ths) but voices stay in place', correct: false },
        ],
      },
      hint: 'In invertible counterpoint at the octave, voice A above voice B sounds correct, AND voice B above voice A also sounds correct. When the voices swap, intervals invert: 3rds become 6ths, 5ths become 4ths, etc.',
      points: 1,
    },
    {
      id: 'l6u20m3e2',
      type: 'multiple_choice',
      prompt: 'What is triple counterpoint?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Three voices written so any of the six possible vertical orderings produce valid counterpoint', correct: true },
          { label: 'Counterpoint in triple meter (3/4 or 3/8)', correct: false },
          { label: 'Three repetitions of the same counterpoint at different pitch levels', correct: false },
          { label: 'A fugue with exactly three subjects', correct: false },
        ],
      },
      hint: 'Triple counterpoint means three voices (A, B, C) can be rearranged in any order -- ABC, ACB, BAC, BCA, CAB, CBA -- and all six permutations produce correct counterpoint. Bach mastered this technique.',
      points: 1,
    },
    {
      id: 'l6u20m3e3',
      type: 'multiple_choice',
      prompt: 'Why must perfect 5ths be avoided or carefully handled in invertible counterpoint at the octave?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A 5th inverts to a 4th, which is treated as a dissonance against the bass in strict counterpoint', correct: true },
          { label: 'Perfect 5ths are always forbidden in all types of counterpoint', correct: false },
          { label: 'A 5th inverts to a tritone, creating an unusable interval', correct: false },
          { label: 'Perfect 5ths cannot be inverted at all', correct: false },
        ],
      },
      hint: 'When voices invert at the octave, a P5 becomes a P4. In two-voice counterpoint, 4ths against the bass are dissonant. So any P5 in the original becomes a problem when the voices swap positions.',
      points: 1,
    },
  ],

  // ---- l6u20m4: Advanced Part Writing ----
  l6u20m4: [
    {
      id: 'l6u20m4e1',
      type: 'multiple_choice',
      prompt: 'What are the four voices in SATB (chorale-style) part writing, from highest to lowest?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Soprano, Alto, Tenor, Bass', correct: true },
          { label: 'Soprano, Alto, Treble, Bass', correct: false },
          { label: 'Soprano, Baritone, Tenor, Bass', correct: false },
          { label: 'Soprano, Alto, Tenor, Baritone', correct: false },
        ],
      },
      hint: 'SATB stands for Soprano (highest), Alto, Tenor, and Bass (lowest). Soprano and Alto share the treble staff; Tenor and Bass share the bass staff in standard chorale notation.',
      points: 1,
    },
    {
      id: 'l6u20m4e2',
      type: 'multiple_choice',
      prompt: 'What does figured bass realization require a performer to do?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Read a bass line with numbers and improvise the upper voices to form the indicated chords', correct: true },
          { label: 'Play only the bass notes exactly as written with no additions', correct: false },
          { label: 'Transpose the bass line to match the figured numbers', correct: false },
          { label: 'Double every bass note at the octave in both hands', correct: false },
        ],
      },
      hint: 'Figured bass was the Baroque shorthand for harmony. The player reads the written bass note and the figures (numbers) below it, then fills in the upper voices to create complete chords following voice-leading rules.',
      points: 1,
    },
    {
      id: 'l6u20m4e3',
      type: 'multiple_choice',
      prompt: 'When reading a transposing instrument score (e.g., Bb clarinet), what must you do to find the sounding pitch?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Transpose the written pitch by the instrument\'s transposition interval to find the concert pitch', correct: true },
          { label: 'Play the written pitch exactly as notated -- transposing instruments sound as written', correct: false },
          { label: 'Move every note up one octave from the written pitch', correct: false },
          { label: 'Read the part in a different clef to find the correct pitch', correct: false },
        ],
      },
      hint: 'A Bb clarinet sounds a major 2nd lower than written. When the part says C, the instrument sounds Bb. Score reading requires knowing each instrument\'s transposition to hear the actual (concert) pitches.',
      points: 1,
    },
  ],
};

export default exercises;
