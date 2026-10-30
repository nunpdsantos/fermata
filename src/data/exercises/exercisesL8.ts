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
          { label: 'The subject is the main theme stated first; the answer is its imitation in the dominant key', correct: true },
          { label: 'The subject is played by strings; the answer is played by winds', correct: false },
          { label: 'The subject is in major; the answer is in minor', correct: false },
          { label: 'The subject is fast; the answer is slow', correct: false },
        ],
      },
      hint: 'The subject enters first in the tonic key. The answer follows in the dominant, imitating the subject a fifth higher (or fourth lower).',
      points: 1,
    },
    {
      id: 'l8u25m1e2',
      type: 'multiple_choice',
      prompt: 'What distinguishes a "real answer" from a "tonal answer" in a fugue?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A real answer transposes the subject exactly; a tonal answer adjusts intervals (typically answering 5 with 1) so the answer does not undermine the tonic key', correct: true },
          { label: 'A real answer is louder; a tonal answer is softer', correct: false },
          { label: 'A real answer uses the same rhythm; a tonal answer changes the rhythm', correct: false },
          { label: 'A real answer is in the same octave; a tonal answer is an octave higher', correct: false },
        ],
      },
      hint: 'A real answer is an exact transposition to the dominant. A tonal answer modifies certain intervals (typically scale degrees 1 and 5) to maintain tonal coherence.',
      points: 1,
    },
    {
      id: 'l8u25m1e3',
      type: 'multiple_choice',
      prompt: 'What happens during the exposition of a fugue?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each voice enters successively with the subject or answer until all voices have stated the theme', correct: true },
          { label: 'All voices play the subject simultaneously in unison', correct: false },
          { label: 'The subject is developed through fragmentation and sequence', correct: false },
          { label: 'The subject is presented in augmentation and diminution', correct: false },
        ],
      },
      hint: 'The exposition is the opening section where voices enter one at a time, alternating between subject (tonic) and answer (dominant).',
      points: 1,
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
          { label: 'To modulate between keys and provide contrast using fragments of the subject', correct: true },
          { label: 'To introduce a completely new theme unrelated to the subject', correct: false },
          { label: 'To restate the subject in all voices simultaneously', correct: false },
          { label: 'To conclude the fugue with a final cadence', correct: false },
        ],
      },
      hint: 'Episodes are passages between subject entries that typically use sequences built from subject fragments. They serve as modulatory bridges.',
      points: 1,
    },
    {
      id: 'l8u25m2e2',
      type: 'multiple_choice',
      prompt: 'What is "stretto" in a fugue?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Overlapping entries of the subject where a new voice begins before the previous one finishes', correct: true },
          { label: 'A gradual increase in tempo toward the end of the fugue', correct: false },
          { label: 'The final cadence where all voices resolve together', correct: false },
          { label: 'A section where the subject is played backward', correct: false },
        ],
      },
      hint: 'Stretto compresses subject entries so they overlap, creating intensified counterpoint. It often appears near the climax of a fugue.',
      points: 1,
    },
    {
      id: 'l8u25m2e3',
      type: 'multiple_choice',
      prompt: 'In fugal technique, what does "augmentation" mean?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The subject is presented with note values doubled (proportionally longer)', correct: true },
          { label: 'The subject is presented with additional chromatic notes', correct: false },
          { label: 'The subject is played by more instruments than originally', correct: false },
          { label: 'The subject is transposed to a higher octave', correct: false },
        ],
      },
      hint: 'Augmentation stretches the subject by multiplying its note durations (typically by two). Diminution does the opposite, halving note values.',
      points: 1,
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
          { label: 'A composition where one voice is imitated exactly by another voice entering after a delay', correct: true },
          { label: 'A composition where all voices play different melodies simultaneously', correct: false },
          { label: 'A composition with a repeating bass line', correct: false },
          { label: 'A composition that modulates through all twelve keys', correct: false },
        ],
      },
      hint: 'A canon is strict imitation: one voice (the leader or dux) is followed at a fixed time interval by one or more voices (the follower or comes) copying it exactly.',
      points: 1,
    },
    {
      id: 'l8u25m3e2',
      type: 'multiple_choice',
      prompt: 'In a "canon at the fifth," how does the follower relate to the leader?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The follower imitates the leader transposed up (or down) by a perfect fifth', correct: true },
          { label: 'The follower enters five beats after the leader', correct: false },
          { label: 'The follower plays only the fifth note of each phrase', correct: false },
          { label: 'The follower plays the leader melody five times', correct: false },
        ],
      },
      hint: 'The interval name refers to the pitch transposition, not the time delay. A canon at the fifth transposes the melody by a P5.',
      points: 1,
    },
    {
      id: 'l8u25m3e3',
      type: 'multiple_choice',
      prompt: 'What is the difference between strict and free imitation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Strict imitation copies intervals exactly; free imitation allows modifications for harmonic or melodic reasons', correct: true },
          { label: 'Strict imitation is faster; free imitation is slower', correct: false },
          { label: 'Strict imitation uses only consonances; free imitation uses only dissonances', correct: false },
          { label: 'Strict imitation is for vocal music; free imitation is for instrumental music', correct: false },
        ],
      },
      hint: 'Strict imitation preserves every interval precisely. Free imitation allows alterations to intervals while maintaining the general shape and rhythm of the model.',
      points: 1,
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
          { label: 'A first theme in the tonic and a second theme in a contrasting key (usually the dominant)', correct: true },
          { label: 'A fast theme and a slow theme both in the tonic', correct: false },
          { label: 'A theme for strings and a theme for winds in the same key', correct: false },
          { label: 'A major theme and its minor-mode variant', correct: false },
        ],
      },
      hint: 'The exposition establishes tonal conflict: the first theme group is in the tonic, the second theme group moves to the dominant (or relative major in minor keys).',
      points: 1,
    },
    {
      id: 'l8u26m1e2',
      type: 'multiple_choice',
      prompt: 'What is the primary purpose of the development section in sonata form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'To explore, fragment, and transform thematic material through modulation and motivic development', correct: true },
          { label: 'To introduce entirely new themes not heard in the exposition', correct: false },
          { label: 'To repeat the exposition exactly in a different key', correct: false },
          { label: 'To provide a slow, lyrical contrast to the exposition', correct: false },
        ],
      },
      hint: 'The development takes ideas from the exposition and works them through various keys, sequences, and contrapuntal techniques, building tension toward the recapitulation.',
      points: 1,
    },
    {
      id: 'l8u26m1e3',
      type: 'multiple_choice',
      prompt: 'In the recapitulation of a sonata form, what key is the second theme presented in?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The tonic key, resolving the tonal conflict of the exposition', correct: true },
          { label: 'The dominant key, exactly as in the exposition', correct: false },
          { label: 'The subdominant key as a compromise', correct: false },
          { label: 'A remote key chosen freely by the composer', correct: false },
        ],
      },
      hint: 'The recapitulation resolves the harmonic tension by bringing back both theme groups in the tonic. The second theme, originally in the dominant, now returns in the home key.',
      points: 1,
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
          { label: 'Nothing; each variation is completely independent', correct: false },
        ],
      },
      hint: 'Variations typically preserve the harmonic framework and phrase structure of the theme while altering melody, rhythm, texture, or mode.',
      points: 1,
    },
    {
      id: 'l8u26m2e2',
      type: 'multiple_choice',
      prompt: 'Which pattern best describes rondo form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'ABACA (or ABACABA) — a recurring refrain alternates with contrasting episodes', correct: true },
          { label: 'AABB — two sections each repeated', correct: false },
          { label: 'ABA — a ternary structure with a contrasting middle', correct: false },
          { label: 'ABCD — four different sections played once each', correct: false },
        ],
      },
      hint: 'Rondo form features a main theme (A) that keeps returning between different contrasting sections (B, C, etc.). The minimum pattern is ABACA.',
      points: 1,
    },
    {
      id: 'l8u26m2e3',
      type: 'multiple_choice',
      prompt: 'What is a chaconne (or passacaglia)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A set of continuous variations over a repeating bass line or harmonic progression', correct: true },
          { label: 'A fast dance in triple meter with no repeats', correct: false },
          { label: 'A vocal form with alternating verses and refrains', correct: false },
          { label: 'A fugue with a chromatic subject', correct: false },
        ],
      },
      hint: 'A chaconne/passacaglia is a variation form built over a repeating bass pattern (ground bass). The upper voices change while the bass cycles continuously.',
      points: 1,
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
          { label: 'Strings, Woodwinds, Brass, Percussion', correct: true },
          { label: 'Strings, Winds, Keyboards, Voices', correct: false },
          { label: 'High instruments, Low instruments, Rhythm, Melody', correct: false },
          { label: 'Violins, Cellos, Trumpets, Drums', correct: false },
        ],
      },
      hint: 'The standard orchestral sections are: Strings (violin, viola, cello, bass), Woodwinds (flute, oboe, clarinet, bassoon), Brass (horn, trumpet, trombone, tuba), and Percussion.',
      points: 1,
    },
    {
      id: 'l8u26m3e2',
      type: 'multiple_choice',
      prompt: 'What does it mean for an instrument to be a "transposing instrument"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Its written pitch differs from the pitch that actually sounds (concert pitch)', correct: true },
          { label: 'It can play in any key without difficulty', correct: false },
          { label: 'It can change its tuning during a performance', correct: false },
          { label: 'It transposes music automatically for the player', correct: false },
        ],
      },
      hint: 'A transposing instrument produces a different pitch than what is notated. This simplifies fingerings across instrument families of different sizes.',
      points: 1,
    },
    {
      id: 'l8u26m3e3',
      type: 'multiple_choice',
      prompt: 'When a Bb clarinet plays a written C, what concert pitch sounds?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Bb (a major 2nd lower than written)', correct: true },
          { label: 'D (a major 2nd higher than written)', correct: false },
          { label: 'C (same as written)', correct: false },
          { label: 'Eb (a minor 3rd higher than written)', correct: false },
        ],
      },
      hint: 'A Bb instrument sounds a major 2nd lower than written. When the player reads C, the audience hears Bb. To sound a concert C, the player must read D.',
      points: 1,
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
      points: 1,
    },
    {
      id: 'l8u27m1e2',
      type: 'multiple_choice',
      prompt: 'What is the "normal order" of a pitch-class set?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The arrangement of pitch classes in ascending order within the smallest possible interval span', correct: true },
          { label: 'The order in which the notes appear in the musical score', correct: false },
          { label: 'The arrangement sorted by frequency from lowest to highest', correct: false },
          { label: 'An alphabetical arrangement of note names', correct: false },
        ],
      },
      hint: 'Normal order is the most compact ascending arrangement of a pitch-class set. You rotate through all orderings and pick the one with the smallest outer interval.',
      points: 1,
    },
    {
      id: 'l8u27m1e3',
      type: 'multiple_choice',
      prompt: 'What is the purpose of reducing a pitch-class set to its "prime form"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'To create a standard label so that transpositionally and inversionally related sets share the same identity', correct: true },
          { label: 'To determine which key the music is in', correct: false },
          { label: 'To find the root of a chord', correct: false },
          { label: 'To convert the set into standard music notation', correct: false },
        ],
      },
      hint: 'Prime form is the most reduced version of a set, starting on 0 and packed as tightly as possible to the left. It lets analysts compare sets regardless of transposition or inversion.',
      points: 1,
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
          { label: 'An ordered arrangement of all 12 pitch classes, each appearing exactly once, used as the basis for a composition', correct: true },
          { label: 'A chromatic scale played from bottom to top', correct: false },
          { label: 'A series of 12 chords used as a harmonic progression', correct: false },
          { label: 'Twelve measures of music that repeat throughout a piece', correct: false },
        ],
      },
      hint: 'A tone row (or series) is a fixed ordering of all 12 chromatic pitch classes. No pitch class repeats until all 12 have been sounded.',
      points: 1,
    },
    {
      id: 'l8u27m2e2',
      type: 'multiple_choice',
      prompt: 'What are the four basic forms of a twelve-tone row?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Prime (P), Retrograde (R), Inversion (I), Retrograde-Inversion (RI)', correct: true },
          { label: 'Major, Minor, Augmented, Diminished', correct: false },
          { label: 'Tonic, Dominant, Subdominant, Leading Tone', correct: false },
          { label: 'Original, Transposed, Modulated, Developed', correct: false },
        ],
      },
      hint: 'P is the original row. R reverses it. I inverts all intervals. RI applies both retrograde and inversion. Each can also be transposed to any of the 12 pitch levels.',
      points: 1,
    },
    {
      id: 'l8u27m2e3',
      type: 'multiple_choice',
      prompt: 'What is the purpose of a twelve-tone matrix?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'To display all 48 row forms (12 transpositions each of P, R, I, RI) in a single 12x12 grid', correct: true },
          { label: 'To show which instruments play each note of the row', correct: false },
          { label: 'To convert pitch-class numbers into standard notation', correct: false },
          { label: 'To calculate the harmonic rhythm of a serial composition', correct: false },
        ],
      },
      hint: 'The matrix (or magic square) is a 12x12 grid. Rows read left-to-right give P forms, right-to-left give R, columns top-to-bottom give I, and bottom-to-top give RI.',
      points: 1,
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
          { label: 'Moving chords or intervals in parallel motion, either keeping the exact intervallic structure (chromatic planing) or adjusting it to the scale (diatonic planing)', correct: true },
          { label: 'Gradually increasing the tempo throughout a passage', correct: false },
          { label: 'Alternating between two different keys every measure', correct: false },
          { label: 'Writing only in stepwise (conjunct) motion', correct: false },
        ],
      },
      hint: 'Planing moves a fixed chord shape or interval up or down in parallel. Debussy famously used parallel triads and ninth chords, abandoning traditional voice-leading rules.',
      points: 1,
    },
    {
      id: 'l8u27m3e2',
      type: 'multiple_choice',
      prompt: 'What is polytonality?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The simultaneous use of two or more different keys', correct: true },
          { label: 'Music that changes key frequently within a single melodic line', correct: false },
          { label: 'The use of all twelve tones equally without a tonal center', correct: false },
          { label: 'A texture with multiple independent rhythmic patterns', correct: false },
        ],
      },
      hint: 'Polytonality layers different tonal centers at the same time. Bitonality (two keys) is the most common type. Milhaud and Stravinsky used it extensively.',
      points: 1,
    },
    {
      id: 'l8u27m3e3',
      type: 'multiple_choice',
      prompt: 'What is pandiatonicism?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The free use of all diatonic scale tones without traditional functional harmony or voice-leading rules', correct: true },
          { label: 'Music that uses only pentatonic scales', correct: false },
          { label: 'The use of all twelve chromatic tones simultaneously', correct: false },
          { label: 'A diatonic melody harmonized exclusively with triads', correct: false },
        ],
      },
      hint: 'Pandiatonicism uses diatonic pitch material (e.g., all white keys) but without tonal hierarchy or functional progressions. Stravinsky and Copland employed this freely.',
      points: 1,
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
          { label: 'Music built on extensive repetition of short patterns with gradual, subtle changes over time', correct: true },
          { label: 'Music that uses the fewest possible instruments', correct: false },
          { label: 'Music that lasts less than one minute', correct: false },
          { label: 'Music that avoids all repetition in favor of constant variation', correct: false },
        ],
      },
      hint: 'Minimalism (Riley, Reich, Glass, Adams) features repetitive patterns, steady pulse, consonant harmony, and slow processes of gradual transformation.',
      points: 1,
    },
    {
      id: 'l8u27m4e2',
      type: 'multiple_choice',
      prompt: 'What is aleatory (or aleatoric) music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Music in which some element of the composition or performance is left to chance or performer choice', correct: true },
          { label: 'Music composed entirely by a computer algorithm', correct: false },
          { label: 'Music that is always performed at a very fast tempo', correct: false },
          { label: 'Music that uses only electronic instruments', correct: false },
        ],
      },
      hint: 'Aleatory comes from the Latin "alea" (dice). Cage, Lutoslawski, and others incorporated randomness or performer indeterminacy into their compositions.',
      points: 1,
    },
    {
      id: 'l8u27m4e3',
      type: 'multiple_choice',
      prompt: 'Which of the following is an example of an "extended technique"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Playing inside the piano by plucking or muting the strings directly', correct: true },
          { label: 'Playing a standard scale at a very fast tempo', correct: false },
          { label: 'Using a metronome during performance', correct: false },
          { label: 'Sight-reading a new piece of music', correct: false },
        ],
      },
      hint: 'Extended techniques produce non-standard sounds: prepared piano, col legno, multiphonics, flutter-tonguing, bowing behind the bridge, and many more.',
      points: 1,
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
          { label: 'Two or more conflicting rhythmic patterns performed simultaneously', correct: true },
          { label: 'A single rhythm played by multiple instruments in unison', correct: false },
          { label: 'A rhythm that gradually speeds up', correct: false },
          { label: 'A rhythm notated in a compound time signature', correct: false },
        ],
      },
      hint: 'Polyrhythm layers different rhythmic groupings at the same time (e.g., triplets against duplets, or 4 against 3). Each layer maintains its own pulse division.',
      points: 1,
    },
    {
      id: 'l8u27m5e2',
      type: 'multiple_choice',
      prompt: 'What is a hemiola?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A rhythmic device that creates the effect of 3 beats against 2 (or 2 against 3) within the same span of time', correct: true },
          { label: 'A rest that lasts exactly half a beat', correct: false },
          { label: 'A technique where the tempo doubles suddenly', correct: false },
          { label: 'A syncopated rhythm used only in jazz', correct: false },
        ],
      },
      hint: 'Hemiola regroups beats so that what was felt in three is temporarily felt in two, or vice versa. Common in Baroque music and Latin American rhythms.',
      points: 1,
    },
    {
      id: 'l8u27m5e3',
      type: 'multiple_choice',
      prompt: 'What is metric modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A change in tempo achieved by reinterpreting a note value from the old meter as the beat unit of the new meter', correct: true },
          { label: 'Changing from a major to a minor key', correct: false },
          { label: 'Playing the same rhythm in a different octave', correct: false },
          { label: 'Gradually slowing down at the end of a piece', correct: false },
        ],
      },
      hint: 'Metric modulation (a term associated with Elliott Carter) uses a common rhythmic value as a pivot between two tempos. For example, an eighth-note triplet in the old tempo becomes the new eighth note.',
      points: 1,
    },
  ],
};

export default exercises;
