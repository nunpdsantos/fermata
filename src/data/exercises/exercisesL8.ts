import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 8 Exercises — 33 exercises across 11 modules
// Analysis, Counterpoint & Post-Tonal
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 25: Fugue and Imitative Forms
  // =========================================================================

  // ---- l8u25m1: Fugue Exposition ----
  l8u25m1: [
    {
      id: 'l8u25m1e1',
      type: 'multiple_choice',
      prompt: 'In a fugue exposition, what is the difference between the subject and the answer?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "The subject leads; its answer follows in the key a fifth higher", correct: true },
          { label: 'The answer leads; its subject follows in the key a fifth higher', correct: false },
          { label: 'The subject leads; its answer follows in the key a fifth lower', correct: false },
          { label: 'The answer leads; its subject follows in the key a fifth lower', correct: false },
        ],
      },
      hint: 'The subject enters first in the tonic key. The answer follows in the dominant, imitating the subject a fifth higher (or fourth lower).',
    },
    {
      id: 'l8u25m1e2',
      type: 'multiple_choice',
      prompt: 'What distinguishes a "real answer" from a "tonal answer" in a fugue?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "A real answer keeps exact intervals; a tonal answer adjusts them so they do not undermine the tonic key", correct: true },
          { label: "A tonal answer keeps exact intervals; a real answer adjusts them so they do not undermine the tonic key", correct: false },
          { label: "A real answer keeps exact rhythms; a tonal answer adjusts them so they do not undermine the tonic key", correct: false },
          { label: "A tonal answer keeps exact rhythms; a real answer adjusts them so they do not undermine the tonic key", correct: false },
        ],
      },
      hint: 'A real answer is an exact transposition to the dominant. A tonal answer adjusts the subject’s opening so that scale degree 5 is answered by 1 (and 1 by 5), preserving the tonic–dominant frame.',
    },
    {
      id: 'l8u25m1e3',
      type: 'multiple_choice',
      prompt: 'What happens during the exposition of a fugue?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Successive voices introduce the subject and its answer until every voice has entered', correct: true },
          { label: 'Simultaneous voices introduce the subject and its answer as a single choral entry', correct: false },
          { label: 'Successive voices develop fragments of the subject before any complete statement', correct: false },
          { label: 'Successive voices introduce the answer before the first statement of the subject', correct: false },
        ],
      },
      hint: 'The exposition is the opening section where voices enter one at a time, alternating between subject (tonic) and answer (dominant).',
    },
  ],

  // ---- l8u25m2: Fugue Episodes and Stretto ----
  l8u25m2: [
    {
      id: 'l8u25m2e1',
      type: 'multiple_choice',
      prompt: 'What is the primary function of an episode in a fugue?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "To connect subject entries through sequences and modulation", correct: true },
          { label: "To replace subject entries with unrelated themes, using sequences and modulation", correct: false },
          { label: "To repeat the exposition's complete subject entries in their original key sequence", correct: false },
          { label: "To present subject entries together in unison, without connecting sequences or modulation", correct: false },
        ],
      },
      hint: 'Episodes are passages between subject entries that typically use sequences built from subject fragments. They serve as modulatory bridges.',
    },
    {
      id: 'l8u25m2e2',
      type: 'multiple_choice',
      prompt: 'What is "stretto" in a fugue?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Overlapping entries of the subject', correct: true },
          { label: 'Non-overlapping entries of the subject', correct: false },
          { label: 'Entries of the subject in doubled note values', correct: false },
          { label: 'Entries of the subject in reversed note order', correct: false },
        ],
      },
      hint: 'Stretto compresses subject entries so they overlap, creating intensified counterpoint. It often appears near the climax of a fugue.',
    },
    {
      id: 'l8u25m2e3',
      type: 'multiple_choice',
      prompt: 'In fugal technique, what does "augmentation" mean?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Multiply every note duration by 2', correct: true },
          { label: 'Divide every note duration by 2', correct: false },
          { label: 'Reverse the sequence of note durations', correct: false },
          { label: 'Keep every note duration and raise every pitch', correct: false },
        ],
      },
      hint: 'Augmentation stretches the subject by multiplying its note durations (typically by two). Diminution does the opposite, halving note values.',
    },
  ],

  // ---- l8u25m3: Canon ----
  l8u25m3: [
    {
      id: 'l8u25m3e1',
      type: 'multiple_choice',
      prompt: 'What is a canon?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Exact imitation entering after a delay', correct: true },
          { label: 'Exact doubling entering at the same time', correct: false },
          { label: 'An ostinato beneath an unrelated melody', correct: false },
          { label: 'Alternating phrases without melodic imitation', correct: false },
        ],
      },
      hint: 'A canon is strict imitation: one voice (the leader or dux) is followed at a fixed time interval by one or more voices (the follower or comes) copying it exactly.',
    },
    {
      id: 'l8u25m3e2',
      type: 'multiple_choice',
      prompt: 'A canon begins on C4; the next voice enters later on G4 and imitates the same melody transposed. What is its entry interval?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A perfect fifth', correct: true },
          { label: 'A perfect fourth', correct: false },
          { label: 'A major third', correct: false },
          { label: 'A whole step', correct: false },
        ],
      },
      hint: 'The interval name refers to the pitch transposition, not the time delay. A canon at the fifth transposes the melody by a P5.',
    },
    {
      id: 'l8u25m3e3',
      type: 'multiple_choice',
      prompt: 'What is the difference between strict and free imitation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Strict imitation keeps the original intervals unchanged; free imitation can adapt them', correct: true },
          { label: "Strict imitation can adapt the original intervals; free imitation keeps them unchanged", correct: false },
          { label: "Strict imitation keeps the original rhythm; free imitation reverses it", correct: false },
          { label: "Strict imitation reverses the original rhythm; free imitation keeps it unchanged", correct: false },
        ],
      },
      hint: 'Strict imitation preserves every interval precisely. Free imitation allows alterations to intervals while maintaining the general shape and rhythm of the model.',
    },
  ],

  // =========================================================================
  // Unit 26: Large Form and Orchestration
  // =========================================================================

  // ---- l8u26m1: Sonata Form ----
  l8u26m1: [
    {
      id: 'l8u26m1e1',
      type: 'multiple_choice',
      prompt: 'What are the two main thematic areas presented in a sonata-form exposition?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "First theme: tonic; second theme: contrasting key", correct: true },
          { label: "First theme: contrasting key; second theme: tonic", correct: false },
          { label: "First theme: tonic; second theme: tonic", correct: false },
          { label: "First theme: dominant; second theme: dominant", correct: false },
        ],
      },
      hint: 'The exposition establishes tonal conflict: the first theme group is in the tonic, the second theme group moves to the dominant (or relative major in minor keys).',
    },
    {
      id: 'l8u26m1e2',
      type: 'multiple_choice',
      prompt: 'What is the primary purpose of the development section in sonata form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'To fragment and develop the themes', correct: true },
          { label: "To introduce and contrast the themes", correct: false },
          { label: "To restate both themes in the tonic", correct: false },
          { label: "To close both themes with a coda", correct: false },
        ],
      },
      hint: 'The development takes ideas from the exposition and works them through various keys, sequences, and contrapuntal techniques, building tension toward the recapitulation.',
    },
    {
      id: 'l8u26m1e3',
      type: 'multiple_choice',
      prompt: 'In the recapitulation of a sonata in C major, which key normally presents the second theme?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C major', correct: true },
          { label: 'G major', correct: false },
          { label: 'C minor', correct: false },
          { label: 'G minor', correct: false },
        ],
      },
      hint: 'The recapitulation resolves the harmonic tension by bringing back both theme groups in the tonic. The second theme, originally in the dominant, now returns in the home key.',
    },
  ],

  // ---- l8u26m2: Variation, Rondo, and Ritornello ----
  l8u26m2: [
    {
      id: 'l8u26m2e1',
      type: 'multiple_choice',
      prompt: 'In a theme-and-variations form, what remains constant across variations?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The underlying harmonic structure and/or melodic outline of the theme', correct: true },
          { label: 'The exact melody and rhythm without any changes', correct: false },
          { label: 'Only the tempo and dynamics', correct: false },
          { label: 'The texture and register of the theme, while the melody and rhythm are transformed', correct: false },
        ],
      },
      hint: 'Variations typically preserve the harmonic framework and phrase structure of the theme while altering melody, rhythm, texture, or mode.',
    },
    {
      id: 'l8u26m2e2',
      type: 'multiple_choice',
      prompt: 'Which pattern best describes rondo form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "ABACA (or ABACABA): the main tune keeps coming back", correct: true },
          { label: 'ABAB (or ABABAB): A alternates with the same episode, ending on B', correct: false },
          { label: "ABCD (or ABCDEF): each section introduces another theme", correct: false },
          { label: "AABB (or AABBCC): each section repeats before the next", correct: false },
        ],
      },
      hint: 'Rondo form features a main theme (A) that returns between contrasting sections. Five-part patterns include ABACA and ABABA.',
    },
    {
      id: 'l8u26m2e3',
      type: 'multiple_choice',
      prompt: 'What is a chaconne (or passacaglia)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Continuous variations over a recurring bass or harmonic pattern", correct: true },
          { label: "Contrasting episodes between returns of a refrain", correct: false },
          { label: "Imitative entries of a subject in successive voices", correct: false },
          { label: "Contrasting themes in an exposition, development and recapitulation", correct: false },
        ],
      },
      hint: 'A chaconne/passacaglia is a variation form built over a repeating bass pattern (ground bass). The upper voices change while the bass cycles continuously.',
    },
  ],

  // ---- l8u26m3: Orchestration ----
  l8u26m3: [
    {
      id: 'l8u26m3e1',
      type: 'multiple_choice',
      prompt: 'What are the four standard families of the modern orchestra?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Strings, woodwinds, brass, percussion', correct: true },
          { label: 'Strings, keyboards, woodwinds, voices', correct: false },
          { label: 'Strings, brass, voices, keyboards', correct: false },
          { label: 'Strings, voices, percussion, brass', correct: false },
        ],
      },
      hint: 'The standard orchestral sections are: Strings (violin, viola, cello, bass), Woodwinds (flute, oboe, clarinet, bassoon), Brass (horn, trumpet, trombone, tuba), and Percussion.',
      nudge: 'Orchestral families group instruments by how they make their sound (bowing or plucking, blowing, buzzing the lips, striking or shaking), not by register, by role or by single instruments.',
    },
    {
      id: 'l8u26m3e2',
      type: 'multiple_choice',
      prompt: 'What does it mean for an instrument to be a "transposing instrument"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The note you hear differs from the written note', correct: true },
          { label: 'The note you hear matches the written pitch, but the music uses an unusual clef', correct: false },
          { label: 'The note you hear changes when you play louder', correct: false },
          { label: 'The note you hear is chosen freely, independently of the written pitch', correct: false },
        ],
      },
      hint: 'A transposing instrument produces a different pitch than what is notated. This simplifies fingerings across instrument families of different sizes.',
    },
    {
      id: 'l8u26m3e3',
      type: 'multiple_choice',
      prompt: 'When a Bb clarinet plays a written D, what concert pitch sounds?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C', correct: true },
          { label: 'E', correct: false },
          { label: 'D', correct: false },
          { label: 'F', correct: false },
        ],
      },
      hint: 'A Bb clarinet sounds a major 2nd lower than written. When the player reads C, the audience hears Bb. To sound a concert C, the player must read D.',
    },
  ],

  // =========================================================================
  // Unit 27: Post-Tonal and Contemporary
  // =========================================================================

  // ---- l8u27m1: Pitch-Class Sets ----
  l8u27m1: [
    {
      id: 'l8u27m1e1',
      type: 'multiple_choice',
      prompt: 'In pitch-class integer notation, what number represents the note C?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '0', correct: true },
          { label: '1', correct: false },
          { label: '12', correct: false },
          { label: '7', correct: false },
        ],
      },
      hint: 'Pitch-class integer notation assigns C = 0, C#/Db = 1, D = 2, and so on through B = 11. The system is modulo 12.',
      nudge: 'Each pitch class is numbered by its distance in half steps above C, counting modulo 12 (so 12 wraps round). Apply that rule to C itself.',
    },
    {
      id: 'l8u27m1e2',
      type: 'multiple_choice',
      prompt: 'Which is the normal order of the pitch-class set {1, 6, 9}?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '[6, 9, 1]', correct: true },
          { label: '[1, 6, 9]', correct: false },
          { label: '[9, 1, 6]', correct: false },
          { label: '[1, 9, 6]', correct: false },
        ],
      },
      hint: 'Normal order is the most compact ascending arrangement of a pitch-class set. You rotate through all orderings and pick the one with the smallest outer interval.',
    },
    {
      id: 'l8u27m1e3',
      type: 'multiple_choice',
      prompt: 'Which pitch-class set has the same prime form as {0, 4, 7}, allowing transposition and inversion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '{0, 3, 7}', correct: true },
          { label: '{0, 1, 6}', correct: false },
          { label: '{0, 2, 8}', correct: false },
          { label: '{0, 4, 11}', correct: false },
        ],
      },
      hint: 'Prime form is the most reduced version of a set, starting on 0 and packed as tightly as possible to the left. It lets analysts compare sets regardless of transposition or inversion.',
    },
  ],

  // ---- l8u27m2: Twelve-Tone Technique ----
  l8u27m2: [
    {
      id: 'l8u27m2e1',
      type: 'multiple_choice',
      prompt: 'What is a twelve-tone row?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Twelve pitch classes in a fixed order, each appearing once', correct: true },
          { label: 'Twelve pitch classes in a freely chosen order, each appearing once', correct: false },
          { label: 'Twelve pitch classes in a fixed order, with repetitions allowed', correct: false },
          { label: 'Twelve pitch classes in a freely chosen order, with repetitions allowed', correct: false },
        ],
      },
      hint: 'A tone row (or series) is a fixed ordering of all 12 chromatic pitch classes. No pitch class repeats until all 12 have been sounded.',
    },
    {
      id: 'l8u27m2e2',
      type: 'multiple_choice',
      prompt: 'Which pair correctly defines the row forms R and I?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'R reverses note order; I reverses interval direction', correct: true },
          { label: 'R reverses interval direction; I reverses note order', correct: false },
          { label: 'R doubles note values; I halves note values', correct: false },
          { label: 'R halves note values; I doubles note values', correct: false },
        ],
      },
      hint: 'P is the original row. R reverses it. I inverts all intervals. RI applies both retrograde and inversion. Each can also be transposed to any of the 12 pitch levels.',
    },
    {
      id: 'l8u27m2e3',
      type: 'multiple_choice',
      prompt: 'What is the purpose of a twelve-tone matrix?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'To obtain transposed, inverted and backward versions of a pitch row', correct: true },
          { label: 'To obtain harmonized, inverted and backward versions of a pitch row', correct: false },
          { label: 'To obtain transposed, harmonized and rhythmically augmented versions of a pitch row', correct: false },
          { label: 'To obtain rhythmically augmented, harmonized and backward versions of a pitch row', correct: false },
        ],
      },
      hint: 'The matrix (or magic square) is a 12x12 grid. Rows read left-to-right give P forms, right-to-left give R, columns top-to-bottom give I, and bottom-to-top give RI.',
    },
  ],

  // ---- l8u27m3: 20th Century Techniques ----
  l8u27m3: [
    {
      id: 'l8u27m3e1',
      type: 'multiple_choice',
      prompt: 'What is "planing" (also called parallelism) in early 20th-century music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Moving chords in parallel: chromatic planing keeps their exact intervals, diatonic planing fits them to the scale', correct: true },
          { label: "Moving chords in parallel: chromatic planing fits them to the scale, diatonic planing keeps their exact intervals", correct: false },
          { label: "Moving chords in parallel: chromatic planing keeps their exact intervals, diatonic planing keeps their exact intervals", correct: false },
          { label: "Moving chords in parallel: chromatic planing fits them to the scale, diatonic planing fits them to the scale", correct: false },
        ],
      },
      hint: 'Planing moves a fixed chord shape or interval up or down in parallel. Debussy famously used parallel triads and ninth chords, abandoning traditional voice-leading rules.',
    },
    {
      id: 'l8u27m3e2',
      type: 'multiple_choice',
      prompt: 'What is polytonality?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Several tonal centers heard together", correct: true },
          { label: "Several tonal centers heard in succession", correct: false },
          { label: "Several meters heard together", correct: false },
          { label: "Several meters heard in succession", correct: false },
        ],
      },
      hint: 'Polytonality layers different tonal centers at the same time. Bitonality (two keys) is the most common type. Milhaud and Stravinsky used it extensively.',
    },
    {
      id: 'l8u27m3e3',
      type: 'multiple_choice',
      prompt: 'What is pandiatonicism?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Using one diatonic scale freely, without the usual pull of one chord towards another", correct: true },
          { label: "Using all twelve chromatic notes freely, without the usual pull of one chord towards another", correct: false },
          { label: "Using one diatonic scale within functional progressions, with each dominant resolving onto the tonic", correct: false },
          { label: "Using all twelve chromatic notes within functional progressions, with each dominant resolving onto the tonic", correct: false },
        ],
      },
      hint: 'Pandiatonicism uses diatonic pitch material (e.g., all white keys) but without tonal hierarchy or functional progressions. Stravinsky and Copland employed this freely.',
    },
  ],

  // ---- l8u27m4: Minimalism and Aleatory ----
  l8u27m4: [
    {
      id: 'l8u27m4e1',
      type: 'multiple_choice',
      prompt: 'Which of the following best describes musical minimalism?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Music based on extensive repetition of short patterns, with gradual changes over time', correct: true },
          { label: 'Music defined by using as few performers as possible', correct: false },
          { label: 'Music defined by a total duration of less than one minute', correct: false },
          { label: 'Music based on a continuous succession of new, nonrepeating themes', correct: false },
        ],
      },
      hint: 'Minimalism (Riley, Reich, Glass, Adams) features repetitive patterns, steady pulse, consonant harmony, and slow processes of gradual transformation.',
    },
    {
      id: 'l8u27m4e2',
      type: 'multiple_choice',
      prompt: 'What is aleatory (or aleatoric) music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Music whose form or details depend on chance procedures or performer decisions', correct: true },
          { label: 'Music whose form and details are fixed completely in advance', correct: false },
          { label: 'Music whose pitch material comes from the harmonic spectrum', correct: false },
          { label: 'Music whose repeated patterns expand by gradual rhythmic additions', correct: false },
        ],
      },
      hint: 'Aleatory comes from the Latin "alea" (dice). Cage, Lutosławski, and others incorporated randomness or performer indeterminacy into their compositions.',
    },
    {
      id: 'l8u27m4e3',
      type: 'multiple_choice',
      prompt: 'Which of the following is an example of an "extended technique"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Damping piano strings by touching them with the fingers', correct: true },
          { label: "Sounding piano strings by pressing the keys", correct: false },
          { label: "Damping piano strings by releasing the keys without pedal", correct: false },
          { label: "Sustaining piano strings by holding the pedal down", correct: false },
        ],
      },
      hint: 'Extended techniques produce non-standard sounds: prepared piano, col legno, multiphonics, flutter-tonguing, bowing behind the bridge, and many more.',
    },
  ],

  // ---- l8u27m5: Advanced Rhythm ----
  l8u27m5: [
    {
      id: 'l8u27m5e1',
      type: 'multiple_choice',
      prompt: 'What is a polyrhythm?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Conflicting rhythmic patterns played simultaneously', correct: true },
          { label: 'Conflicting rhythmic patterns played consecutively', correct: false },
          { label: 'Identical rhythmic patterns played simultaneously', correct: false },
          { label: 'Identical rhythmic patterns played consecutively', correct: false },
        ],
      },
      hint: 'Polyrhythm layers different rhythmic groupings at the same time (e.g., triplets against duplets, or 4 against 3). Each layer maintains its own pulse division.',
    },
    {
      id: 'l8u27m5e2',
      type: 'multiple_choice',
      prompt: 'What is a hemiola?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A device that creates the effect of 3 beats against 2 (or 2 against 3) in the same span of time', correct: true },
          { label: "A device that sounds 3 and 4 equal beats simultaneously over the same span of time", correct: false },
          { label: "A device that shifts an accent away from a strong beat without creating a 3-against-2 grouping", correct: false },
          { label: "A device that gradually speeds up the beat while keeping the number of beats in each group unchanged", correct: false },
        ],
      },
      hint: 'Hemiola regroups beats so that what was felt in three is temporarily felt in two, or vice versa. Common in Baroque music and Latin American rhythms.',
    },
    {
      id: 'l8u27m5e3',
      type: 'multiple_choice',
      prompt: 'What is metric modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A tempo change made by treating a note value of the old meter as the beat unit of the new one', correct: true },
          { label: "A regrouping of two triple groups into three duple groups while the tempo and note durations stay unchanged", correct: false },
          { label: "A change of accents within the old meter while the tempo, beat unit and note values stay unchanged", correct: false },
          { label: "A gradual tempo change without a precise shared note value linking the old beat to the new one", correct: false },
        ],
      },
      hint: 'Metric modulation uses a shared rhythmic value to establish a precise relation between two tempos. For example, one note of a quarter-note triplet at the old tempo becomes the new quarter-note beat: quarter note = 120 becomes quarter note = 180.',
    },
  ],
};

export default exercises;
