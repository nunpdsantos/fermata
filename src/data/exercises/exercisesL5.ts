import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 5 Exercises — Chromaticism & Modulation (~42 exercises across 14 modules)
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 15: Secondary Dominants and Tonicization
  // =========================================================================

  // ---- l5u15m1: Secondary Dominants V/V ----
  l5u15m1: [
    {
      id: 'l5u15m1e1',
      type: 'chord_build',
      prompt: 'Build V/V in C major. The secondary dominant of V is a D major triad. Select the 3 notes: D, F#, A.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'V/V in C means "the V chord of G major." The dominant of G is D major: D (2), F# (6), A (9). The F# is chromatic -- it does not belong to C major.',
      points: 2,
    },
    {
      id: 'l5u15m1e2',
      type: 'chord_build',
      prompt: 'Build V7/V in C major. This is a D dominant 7th chord: D, F#, A, C. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'V7/V in C = D7: D (2), F# (6), A (9), C (0). The added minor 7th (C) strengthens the pull toward G. The F# is the chromatic alteration.',
      points: 2,
    },
    {
      id: 'l5u15m1e3',
      type: 'multiple_choice',
      prompt: 'What is V/V?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A secondary dominant that tonicizes the dominant chord of the key', correct: true },
          { label: 'The fifth chord played twice in a row', correct: false },
          { label: 'A diminished chord built on the second scale degree', correct: false },
          { label: 'The dominant chord in second inversion', correct: false },
        ],
      },
      hint: 'V/V means "the dominant of the dominant." In C major, V is G. The dominant of G is D major. So V/V in C = D major, a chromatic chord that temporarily tonicizes G.',
      points: 1,
    },
  ],

  // ---- l5u15m2: Secondary Dominants of ii, iii, IV, vi ----
  l5u15m2: [
    {
      id: 'l5u15m2e1',
      type: 'multiple_choice',
      prompt: 'In C major, what chord functions as V/ii?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A major (A, C#, E) -- the dominant of D minor', correct: true },
          { label: 'G major (G, B, D) -- the dominant of C', correct: false },
          { label: 'E major (E, G#, B) -- the dominant of A minor', correct: false },
          { label: 'F major (F, A, C) -- the subdominant', correct: false },
        ],
      },
      hint: 'In C major, ii is D minor. The dominant of D minor is A major (A, C#, E). The C# is the chromatic note that creates the leading tone to D.',
      points: 1,
    },
    {
      id: 'l5u15m2e2',
      type: 'multiple_choice',
      prompt: 'In C major, what chord functions as V/IV?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'C major (C, E, G) -- the dominant of F', correct: true },
          { label: 'G major (G, B, D) -- the dominant of C', correct: false },
          { label: 'Bb major (Bb, D, F) -- borrowed from C minor', correct: false },
          { label: 'D major (D, F#, A) -- the dominant of G', correct: false },
        ],
      },
      hint: 'V/IV means the dominant of IV. In C major, IV is F. The dominant of F is C major. This is unusual because C major is already the tonic -- context determines whether it functions as I or V/IV.',
      points: 1,
    },
    {
      id: 'l5u15m2e3',
      type: 'multiple_choice',
      prompt: 'What defines an applied (secondary) dominant?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A major triad or dominant 7th that resolves to a diatonic chord other than I, acting as V of that chord', correct: true },
          { label: 'Any dominant 7th chord used in a progression', correct: false },
          { label: 'A chord that modulates permanently to a new key', correct: false },
          { label: 'The V chord resolving deceptively to vi', correct: false },
        ],
      },
      hint: 'An applied dominant temporarily acts as V (or V7) of a diatonic chord. It introduces chromatic notes to create a leading-tone resolution to its target, without establishing a new key.',
      points: 1,
    },
  ],

  // ---- l5u15m3: Secondary Leading-Tone Chords ----
  l5u15m3: [
    {
      id: 'l5u15m3e1',
      type: 'multiple_choice',
      prompt: 'What is the function of a secondary leading-tone chord (e.g., viio/V)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It acts as a diminished chord that resolves up by half step to the tonicized chord, like viio resolves to I', correct: true },
          { label: 'It replaces the dominant chord entirely in cadences', correct: false },
          { label: 'It functions as a passing chord with no harmonic pull', correct: false },
          { label: 'It is the leading tone of the key played as a single note', correct: false },
        ],
      },
      hint: 'viio/V works the same way viio works in a key: the root is a half step below the target chord, and the diminished quality creates strong resolution drive upward to the target.',
      points: 1,
    },
    {
      id: 'l5u15m3e2',
      type: 'multiple_choice',
      prompt: 'What is the difference between a half-diminished 7th and a fully-diminished 7th chord in the context of secondary leading-tone chords?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Half-diminished has a minor 7th above the root; fully-diminished has a diminished 7th (one semitone lower)', correct: true },
          { label: 'Half-diminished resolves up; fully-diminished resolves down', correct: false },
          { label: 'Half-diminished is used in major keys only; fully-diminished in minor keys only', correct: false },
          { label: 'There is no difference; they are the same chord', correct: false },
        ],
      },
      hint: 'Both have a diminished triad (root, m3, dim5). The 7th differs: half-dim has a minor 7th (10 semitones), fully-dim has a diminished 7th (9 semitones). Fully-dim is more common as a secondary leading-tone chord.',
      points: 1,
    },
    {
      id: 'l5u15m3e3',
      type: 'multiple_choice',
      prompt: 'In C major, what is the target chord that viio/V resolves to?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'G major (V) -- the viio/V resolves up by half step to the dominant', correct: true },
          { label: 'C major (I) -- it resolves to the tonic', correct: false },
          { label: 'F major (IV) -- it resolves to the subdominant', correct: false },
          { label: 'D minor (ii) -- it resolves to the supertonic', correct: false },
        ],
      },
      hint: 'The "/V" tells you the target: V. In C major, V is G. viio/V is F# diminished (F#, A, C), and the F# resolves up by half step to G, the root of the target chord.',
      points: 1,
    },
  ],

  // ---- l5u15m4: Tonicization vs Modulation ----
  l5u15m4: [
    {
      id: 'l5u15m4e1',
      type: 'multiple_choice',
      prompt: 'What is tonicization?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A brief, temporary emphasis on a non-tonic chord using its own dominant, without leaving the original key', correct: true },
          { label: 'A permanent change of key center to a new tonic', correct: false },
          { label: 'Playing the tonic chord repeatedly to establish the key', correct: false },
          { label: 'Transposing a melody to a new key', correct: false },
        ],
      },
      hint: 'Tonicization is fleeting: a secondary dominant or leading-tone chord briefly treats a diatonic chord as a local tonic, but the original key remains in control. Think of it as a momentary detour.',
      points: 1,
    },
    {
      id: 'l5u15m4e2',
      type: 'multiple_choice',
      prompt: 'How do you distinguish modulation from tonicization?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Modulation establishes a new key through cadences and extended passages; tonicization is brief and returns to the original key', correct: true },
          { label: 'Modulation uses sharps; tonicization uses flats', correct: false },
          { label: 'Modulation only occurs at the end of a piece; tonicization occurs in the middle', correct: false },
          { label: 'There is no real difference; the terms are interchangeable', correct: false },
        ],
      },
      hint: 'The key test: does the new tonal center stick around with its own cadences and stable passages? If yes, it is a modulation. If the original key reasserts itself quickly, it is just a tonicization.',
      points: 1,
    },
    {
      id: 'l5u15m4e3',
      type: 'multiple_choice',
      prompt: 'When a tonicization is extended over several measures but does not fully establish the new key, what is it called?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'An extended tonicization -- longer than a single chord but lacking full cadential confirmation in the new key', correct: true },
          { label: 'A pivot chord modulation', correct: false },
          { label: 'A deceptive cadence', correct: false },
          { label: 'A chromatic sequence', correct: false },
        ],
      },
      hint: 'Extended tonicizations occupy a gray area: they last longer than a quick V/x - x motion, but the new key is never confirmed with a strong cadence. The boundary between extended tonicization and modulation is subjective.',
      points: 1,
    },
  ],

  // ---- l5u15m5: Dominant Chains ----
  l5u15m5: [
    {
      id: 'l5u15m5e1',
      type: 'multiple_choice',
      prompt: 'What is a chain of secondary dominants?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A sequence where each chord acts as V7 of the next, moving through multiple tonicizations before resolving to the tonic', correct: true },
          { label: 'Playing the V chord of every major key in succession', correct: false },
          { label: 'A series of diminished chords descending chromatically', correct: false },
          { label: 'Alternating between I and V repeatedly', correct: false },
        ],
      },
      hint: 'A dominant chain creates cascading tension: e.g., V7/vi - V7/ii - V7/V - V7 - I. Each dominant 7th resolves to the next link, pulling the harmony back toward the tonic through a cycle.',
      points: 1,
    },
    {
      id: 'l5u15m5e2',
      type: 'multiple_choice',
      prompt: 'In a chain of secondary dominants descending by fifths (e.g., V7/vi - V7/ii - V7/V - V - I in C major), what root motion connects each chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each root falls by a perfect 5th (or rises by a perfect 4th) to the next', correct: true },
          { label: 'Each root rises by a half step chromatically', correct: false },
          { label: 'Each root falls by a whole step', correct: false },
          { label: 'The roots alternate between ascending and descending 3rds', correct: false },
        ],
      },
      hint: 'Dominant chains exploit the strongest root motion in tonal music: down a 5th. Each V7 resolves down a 5th to its target, and that target is reinterpreted as the next V7.',
      points: 1,
    },
    {
      id: 'l5u15m5e3',
      type: 'multiple_choice',
      prompt: 'What is sequential tonicization?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A harmonic pattern where the same tonicization gesture (e.g., V7 - target) is repeated at different pitch levels in sequence', correct: true },
          { label: 'A modulation that passes through every key in the circle of fifths', correct: false },
          { label: 'Playing scales in sequence ascending chromatically', correct: false },
          { label: 'A series of deceptive cadences in different keys', correct: false },
        ],
      },
      hint: 'Sequential tonicization applies the same harmonic pattern (often V7 - chord) to successive scale degrees, creating a predictable but colorful chromatic motion. It is common in Baroque and jazz music.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 16: Modulation and Mode Mixture
  // =========================================================================

  // ---- l5u16m1: Pivot Chord Modulation ----
  l5u16m1: [
    {
      id: 'l5u16m1e1',
      type: 'multiple_choice',
      prompt: 'What is a pivot chord in modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A chord that belongs to both the old key and the new key, serving as the hinge between them', correct: true },
          { label: 'The first chord of the new key that contains a chromatic note', correct: false },
          { label: 'A diminished chord that resolves the modulation', correct: false },
          { label: 'The dominant chord of the original key', correct: false },
        ],
      },
      hint: 'A pivot chord is diatonic in both keys. For example, when modulating from C major to G major, the chord E minor is both iii in C and vi in G, creating a smooth harmonic bridge between the two keys.',
      points: 1,
    },
    {
      id: 'l5u16m1e2',
      type: 'multiple_choice',
      prompt: 'When modulating from C major to G major, which chord could serve as a pivot?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'E minor -- it is iii in C major and vi in G major', correct: true },
          { label: 'F major -- it is IV in C major and not diatonic in G major', correct: false },
          { label: 'Bb major -- it is borrowed from C minor', correct: false },
          { label: 'F# diminished -- it signals the new key', correct: false },
        ],
      },
      hint: 'Find chords common to both keys. C major: C Dm Em F G Am Bdim. G major: G Am Bm C D Em F#dim. Shared chords include C, Em, Am, G. E minor as iii/vi is a strong pivot choice.',
      points: 1,
    },
    {
      id: 'l5u16m1e3',
      type: 'multiple_choice',
      prompt: 'What is the typical process of a pivot chord modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Establish the old key, introduce the pivot chord, then confirm the new key with a cadence', correct: true },
          { label: 'Play a chromatic scale between the two keys', correct: false },
          { label: 'Stop playing, change key signature, then resume', correct: false },
          { label: 'Repeat the tonic of the new key until the listener adjusts', correct: false },
        ],
      },
      hint: 'Pivot chord modulation unfolds in three stages: (1) the old key is clearly established, (2) a diatonic chord is reinterpreted as belonging to the new key, (3) the new key is confirmed with a cadence (typically V-I).',
      points: 1,
    },
  ],

  // ---- l5u16m2: Modulation to Closely Related Keys ----
  l5u16m2: [
    {
      id: 'l5u16m2e1',
      type: 'multiple_choice',
      prompt: 'How many closely related keys does a major key have?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '5 -- the keys whose signatures differ by at most one sharp or flat', correct: true },
          { label: '2 -- only the dominant and subdominant', correct: false },
          { label: '12 -- every key is closely related', correct: false },
          { label: '3 -- the relative minor, dominant, and subdominant', correct: false },
        ],
      },
      hint: 'Closely related keys differ by at most one accidental in their key signatures. For C major: G major (+1#), F major (+1b), A minor (relative), E minor (rel. of G), D minor (rel. of F). That gives 5 closely related keys.',
      points: 1,
    },
    {
      id: 'l5u16m2e2',
      type: 'multiple_choice',
      prompt: 'Why is modulating to the dominant key (V) considered one of the smoothest modulations?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The dominant key differs by only one accidental, and the two keys share most of their diatonic chords', correct: true },
          { label: 'The dominant key has the same tonic note', correct: false },
          { label: 'The dominant key uses no sharps or flats', correct: false },
          { label: 'The dominant is always the brightest sounding key', correct: false },
        ],
      },
      hint: 'C major and G major share 6 of 7 notes (only F vs F#). This overlap means many chords are common to both keys, providing abundant pivot chord options and a seamless transition.',
      points: 1,
    },
    {
      id: 'l5u16m2e3',
      type: 'multiple_choice',
      prompt: 'Which of the following are closely related keys to C major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'G major, F major, A minor, E minor, D minor', correct: true },
          { label: 'Db major, Ab major, Eb major, Bb major, F minor', correct: false },
          { label: 'G major, D major, A major, E major, B major', correct: false },
          { label: 'C minor, Eb major, Ab major, Bb major, F minor', correct: false },
        ],
      },
      hint: 'Closely related keys share all but one accidental with C major (0 sharps/flats). G major has 1#, F major has 1b, and their relative minors (E minor, D minor) plus the relative minor of C (A minor) complete the set.',
      points: 1,
    },
  ],

  // ---- l5u16m3: Direct/Common-Tone/Chromatic Modulation ----
  l5u16m3: [
    {
      id: 'l5u16m3e1',
      type: 'multiple_choice',
      prompt: 'What is a direct (or phrase) modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A modulation that moves to the new key abruptly at a phrase boundary, without a pivot chord', correct: true },
          { label: 'A modulation that uses a pivot chord shared between the two keys', correct: false },
          { label: 'A modulation that moves by half step using chromatic voice leading', correct: false },
          { label: 'A modulation that happens gradually over many measures', correct: false },
        ],
      },
      hint: 'Direct modulation is the most abrupt type: one phrase ends in the old key, and the next phrase simply starts in the new key. No pivot chord or chromatic preparation bridges the gap. Common in pop and hymn tunes.',
      points: 1,
    },
    {
      id: 'l5u16m3e2',
      type: 'multiple_choice',
      prompt: 'What is a common-tone modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A modulation where a single sustained pitch serves as a bridge between two keys, reinterpreted in the new key context', correct: true },
          { label: 'A modulation where the bass note stays on the tonic throughout', correct: false },
          { label: 'A modulation that uses only notes common to both scales', correct: false },
          { label: 'A modulation that resolves to the common chord of two keys', correct: false },
        ],
      },
      hint: 'In common-tone modulation, one note is held (or repeated) while the harmony shifts around it. That note gains a new function in the new key. This technique works well for modulating to distant keys.',
      points: 1,
    },
    {
      id: 'l5u16m3e3',
      type: 'multiple_choice',
      prompt: 'What is a chromatic modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A modulation achieved by chromatically altering one or more notes in a chord to pivot into the new key', correct: true },
          { label: 'A modulation that uses only chromatic scales', correct: false },
          { label: 'A modulation to a key with more sharps or flats', correct: false },
          { label: 'A modulation that avoids all diatonic chords', correct: false },
        ],
      },
      hint: 'Chromatic modulation uses half-step voice leading to transform a chord from the old key into a chord that belongs to the new key. One or more notes shift by a semitone, smoothly redirecting the harmony.',
      points: 1,
    },
  ],

  // ---- l5u16m4: Mode Mixture — Borrowed Chords ----
  l5u16m4: [
    {
      id: 'l5u16m4e1',
      type: 'chord_build',
      prompt: 'Build bVI in C major. This chord is borrowed from C minor: Ab major (Ab, C, Eb). Select all 3 notes.',
      config: {
        type: 'chord_build',
        root: 'A',
        rootAccidental: 'b',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'bVI in C major = Ab major: Ab (8), C (0), Eb (3). This chord is borrowed from C natural minor, where VI is Ab major. The Ab and Eb are chromatic notes in C major.',
      points: 2,
    },
    {
      id: 'l5u16m4e2',
      type: 'chord_build',
      prompt: 'Build iv in C major. This chord is borrowed from C minor: F minor (F, Ab, C). Select all 3 notes.',
      config: {
        type: 'chord_build',
        root: 'F',
        rootAccidental: '',
        quality: 'minor',
        noteCount: 3,
      },
      hint: 'iv in C major = F minor: F (5), Ab (8), C (0). In C major, IV is F major (F, A, C). Borrowing from C minor lowers the A to Ab, creating the darker-sounding minor subdominant.',
      points: 2,
    },
    {
      id: 'l5u16m4e3',
      type: 'multiple_choice',
      prompt: 'What is mode mixture (also called modal interchange)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Borrowing chords from the parallel minor (or major) key to add chromatic color without leaving the home key', correct: true },
          { label: 'Mixing two different modes like Dorian and Mixolydian in the same passage', correct: false },
          { label: 'Playing a major and minor chord at the same time', correct: false },
          { label: 'Switching between relative major and minor keys', correct: false },
        ],
      },
      hint: 'Mode mixture borrows chords from the parallel key (same tonic, opposite mode). In C major, you borrow from C minor: bIII (Eb), iv (Fm), bVI (Ab), bVII (Bb). These add darkness and chromatic richness.',
      points: 1,
    },
  ],

  // ---- l5u16m5: Picardy Third ----
  l5u16m5: [
    {
      id: 'l5u16m5e1',
      type: 'multiple_choice',
      prompt: 'What is a Picardy third (tierce de Picardie)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Ending a piece in a minor key with a major tonic chord by raising the third of the final chord', correct: true },
          { label: 'A chord progression that uses only thirds', correct: false },
          { label: 'A minor third interval used in a major key', correct: false },
          { label: 'A French ornamental trill on the third degree', correct: false },
        ],
      },
      hint: 'The Picardy third is a centuries-old technique: a minor-key piece ends on a major I chord (e.g., C minor piece ending on C major). The raised third creates a bright, resolved ending after minor-key darkness.',
      points: 1,
    },
    {
      id: 'l5u16m5e2',
      type: 'multiple_choice',
      prompt: 'In mode mixture, what does it mean to borrow from the parallel major in a minor key?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Using chords from the major key with the same tonic, such as a major IV or major I chord, in a minor-key context', correct: true },
          { label: 'Modulating permanently to the major key', correct: false },
          { label: 'Playing the major scale over minor chords', correct: false },
          { label: 'Using the relative major key chords', correct: false },
        ],
      },
      hint: 'Mode mixture works in both directions. A minor key can borrow from its parallel major: e.g., in A minor, you can borrow IV from A major (D major instead of D minor) to brighten the harmony temporarily.',
      points: 1,
    },
    {
      id: 'l5u16m5e3',
      type: 'multiple_choice',
      prompt: 'Which of the following is an example of mode mixture in a minor key?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Using a major IV chord in a minor key, borrowed from the parallel major', correct: true },
          { label: 'Using the V chord in a minor key (which requires a raised 7th from harmonic minor)', correct: false },
          { label: 'Modulating to the relative major key', correct: false },
          { label: 'Using a secondary dominant to tonicize the dominant', correct: false },
        ],
      },
      hint: 'The V chord in minor comes from harmonic minor \u2014 it belongs to the minor key itself, not to mode mixture. Mode mixture borrows chords from the parallel key. A major IV in minor (e.g., D major in A minor instead of D minor) is the classic example; Level 4 traced the same chord to ascending melodic minor, and both readings are common.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 17: Form, Texture, Voice Leading
  // =========================================================================

  // ---- l5u17m1: Binary and Ternary Forms ----
  l5u17m1: [
    {
      id: 'l5u17m1e1',
      type: 'multiple_choice',
      prompt: 'What is binary form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A two-part structure (A-B) where each section is usually repeated, and B often modulates or contrasts with A', correct: true },
          { label: 'A piece with only two chords', correct: false },
          { label: 'A composition for two instruments', correct: false },
          { label: 'A form with two identical sections played twice', correct: false },
        ],
      },
      hint: 'Binary form (AB) divides a piece into two complementary sections. Section A typically ends away from the tonic (often on V), and section B returns to the tonic. Both sections are usually repeated (||: A :||: B :||).',
      points: 1,
    },
    {
      id: 'l5u17m1e2',
      type: 'multiple_choice',
      prompt: 'What distinguishes rounded binary form from simple binary form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'In rounded binary, the A material returns at the end of the B section, creating an ABA-like structure within the binary framework', correct: true },
          { label: 'Rounded binary has curved phrase endings instead of straight cadences', correct: false },
          { label: 'Rounded binary repeats each section three times instead of two', correct: false },
          { label: 'Rounded binary is always in a minor key', correct: false },
        ],
      },
      hint: 'Rounded binary (||: A :||: B A\' :||) brings back the opening A material at the end of the B section. Simple binary does not return to A. Many Classical minuets and scherzos use rounded binary form.',
      points: 1,
    },
    {
      id: 'l5u17m1e3',
      type: 'multiple_choice',
      prompt: 'What is ternary form (ABA)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A three-part structure where the first section returns after a contrasting middle section, with each section being self-contained', correct: true },
          { label: 'A piece with three different melodies that never repeat', correct: false },
          { label: 'A form where the tempo changes three times', correct: false },
          { label: 'A piece written in 3/4 time', correct: false },
        ],
      },
      hint: 'Ternary form has three distinct sections: A (statement), B (contrast), A (return). Unlike rounded binary, each section in ternary form is harmonically self-contained, usually ending with a cadence in its own key.',
      points: 1,
    },
  ],

  // ---- l5u17m2: Song Forms ----
  l5u17m2: [
    {
      id: 'l5u17m2e1',
      type: 'multiple_choice',
      prompt: 'What is verse-chorus form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A form where verses have the same music but different lyrics, alternating with a recurring chorus that has fixed lyrics and melody', correct: true },
          { label: 'A form where the verse and chorus are identical', correct: false },
          { label: 'A form with only a verse section and no chorus', correct: false },
          { label: 'A classical form used exclusively in opera', correct: false },
        ],
      },
      hint: 'Verse-chorus is the most common pop/rock form. Verses advance the story with changing lyrics over the same music. The chorus provides the emotional peak with a consistent, memorable hook.',
      points: 1,
    },
    {
      id: 'l5u17m2e2',
      type: 'multiple_choice',
      prompt: 'What is AABA form (also called 32-bar song form)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A form with a repeated A section, a contrasting B section (bridge), and a final return of A, typically 32 bars total', correct: true },
          { label: 'A form with four identical 8-bar sections', correct: false },
          { label: 'A form with two verses and two choruses', correct: false },
          { label: 'A jazz improvisation structure with no fixed sections', correct: false },
        ],
      },
      hint: 'AABA is the classic Tin Pan Alley / Great American Songbook form. Each section is typically 8 bars. The B section (bridge or "middle eight") provides contrast before the final A returns. Many jazz standards use this form.',
      points: 1,
    },
    {
      id: 'l5u17m2e3',
      type: 'multiple_choice',
      prompt: 'What are the three main sections of sonata form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Exposition, development, and recapitulation', correct: true },
          { label: 'Verse, chorus, and bridge', correct: false },
          { label: 'Introduction, theme, and coda', correct: false },
          { label: 'Prelude, fugue, and postlude', correct: false },
        ],
      },
      hint: 'Sonata form: the exposition presents two contrasting themes in different keys, the development fragments and transforms them through distant keys, and the recapitulation restates both themes in the home key.',
      points: 1,
    },
  ],

  // ---- l5u17m3: Texture ----
  l5u17m3: [
    {
      id: 'l5u17m3e1',
      type: 'multiple_choice',
      prompt: 'What is monophonic texture?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A single melodic line with no accompaniment or harmony -- one voice, one pitch at a time', correct: true },
          { label: 'A melody with chordal accompaniment underneath', correct: false },
          { label: 'Multiple independent melodies sounding simultaneously', correct: false },
          { label: 'A solo instrument playing chords', correct: false },
        ],
      },
      hint: 'Monophony is the simplest texture: a single unaccompanied melody. Even if many people sing or play the same melody (in unison or octaves), it remains monophonic because there is only one musical line.',
      points: 1,
    },
    {
      id: 'l5u17m3e2',
      type: 'multiple_choice',
      prompt: 'What is polyphonic texture?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Two or more independent melodic lines sounding simultaneously, each with its own rhythm and contour', correct: true },
          { label: 'A single melody played by many instruments in unison', correct: false },
          { label: 'A melody supported by block chords', correct: false },
          { label: 'Music with no discernible melody', correct: false },
        ],
      },
      hint: 'Polyphony features multiple independent voices, each with melodic interest. A Bach fugue is the classic example: each voice enters with the same theme but then moves independently, weaving a complex contrapuntal web.',
      points: 1,
    },
    {
      id: 'l5u17m3e3',
      type: 'multiple_choice',
      prompt: 'What is homophonic texture?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A primary melody accompanied by chords or harmonic support, where all parts move in the same rhythm or support the melody', correct: true },
          { label: 'All voices singing the same melody at the same pitch', correct: false },
          { label: 'Two equally important melodies intertwining', correct: false },
          { label: 'Music without any melody, consisting only of rhythmic patterns', correct: false },
        ],
      },
      hint: 'Homophony has one dominant melody with harmonic accompaniment. Most pop, rock, and classical music from the Classical era onward is homophonic. A singer with guitar chords is a clear example.',
      points: 1,
    },
  ],

  // ---- l5u17m4: Guide Tone Lines ----
  l5u17m4: [
    {
      id: 'l5u17m4e1',
      type: 'multiple_choice',
      prompt: 'What are guide tones?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The 3rd and 7th of each chord, which define its quality and create smooth voice leading between chords', correct: true },
          { label: 'The root and 5th of each chord', correct: false },
          { label: 'The melody notes that fall on strong beats', correct: false },
          { label: 'Chromatic passing tones between chord tones', correct: false },
        ],
      },
      hint: 'Guide tones (3rds and 7ths) are the most harmonically defining notes of a chord. The root and 5th are structurally important but generic; the 3rd determines major/minor and the 7th determines chord type.',
      points: 1,
    },
    {
      id: 'l5u17m4e2',
      type: 'multiple_choice',
      prompt: 'In a ii7-V7-I progression in C major (Dm7-G7-Cmaj7), how do the guide tones move?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The guide tones move by step or remain as common tones: F-C in Dm7, F-B in G7, E-B in Cmaj7', correct: true },
          { label: 'The guide tones jump by large intervals between each chord', correct: false },
          { label: 'The guide tones remain the same notes throughout all three chords', correct: false },
          { label: 'The guide tones follow the bass line exactly', correct: false },
        ],
      },
      hint: 'Dm7 guide tones: F (3rd), C (7th). Into G7: F holds as a common tone and becomes the 7th, while C steps down a half step to B, the 3rd. Into Cmaj7: B holds and becomes the 7th, while F steps down a half step to E, the 3rd. Minimal motion = smooth voice leading.',
      points: 1,
    },
    {
      id: 'l5u17m4e3',
      type: 'multiple_choice',
      prompt: 'What is the fundamental voice leading principle that guide tones illustrate?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Move each voice to the nearest available chord tone, preferring stepwise motion and common tones over leaps', correct: true },
          { label: 'All voices should move in parallel motion at all times', correct: false },
          { label: 'Each voice should leap to the most distant chord tone for variety', correct: false },
          { label: 'The top voice must always ascend while the bottom voice descends', correct: false },
        ],
      },
      hint: 'Good voice leading minimizes movement: hold common tones, move other voices by step. This creates smooth, connected harmonic progressions. Guide tone lines demonstrate this principle with just the two most essential notes per chord.',
      points: 1,
    },
  ],
};

export default exercises;
