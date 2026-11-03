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
      prompt: 'Build V/V in C major. Select all 3 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'V/V in C means "the V chord of G major." The dominant of G is D major: D (2), F# (6), A (9). The F# is chromatic -- it does not belong to C major.',
    },
    {
      id: 'l5u15m1e2',
      type: 'chord_build',
      prompt: 'Build V7/V in C major. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'V7/V in C = D7: D (2), F# (6), A (9), C (0). The added minor 7th (C) strengthens the pull toward G. The F# is the chromatic alteration.',
    },
    {
      id: 'l5u15m1e3',
      type: 'multiple_choice',
      prompt: 'What is V/V?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "The chord that makes the dominant sound briefly like a local tonic", correct: true },
          { label: "The chord that makes the subdominant sound briefly like a local tonic", correct: false },
          { label: "The chord that makes the supertonic sound briefly like a local tonic", correct: false },
          { label: "The chord that makes the submediant sound briefly like a local tonic", correct: false },
        ],
      },
      hint: 'V/V means "the dominant of the dominant." In C major, V is G. The dominant of G is D major. So V/V in C = D major, a chromatic chord that temporarily tonicizes G.',
    },
  ],

  // ---- l5u15m2: Secondary Dominants of ii, iii, IV, vi ----
  l5u15m2: [
    {
      id: 'l5u15m2e1',
      type: 'chord_build',
      prompt: "Build V/ii in C major. Select all 3 notes.",
      config: { type: 'chord_build', root: 'A', rootAccidental: '', quality: 'major', noteCount: 3 },
      hint: 'In C major, ii is D minor. The dominant of D minor is A major (A, C#, E). The C# is the chromatic note that creates the leading tone to D.',
    },
    {
      id: 'l5u15m2e2',
      type: 'chord_build',
      prompt: "Build V/IV in C major. Select all 3 notes.",
      config: { type: 'chord_build', root: 'C', rootAccidental: '', quality: 'major', noteCount: 3 },
      hint: 'V/IV means the dominant of IV. In C major, IV is F. The dominant of F is C major. This is unusual because C major is already the tonic — context determines whether it functions as I or V/IV.',
    },
    {
      id: 'l5u15m2e3',
      type: 'multiple_choice',
      prompt: 'What defines an applied (secondary) dominant?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A major triad or dominant 7th that resolves to a diatonic chord other than I, always acting as V of that chord', correct: true },
          { label: 'A major triad or dominant 7th that resolves to I, always acting as V of the original tonic', correct: false },
          { label: 'A major triad or dominant 7th that establishes a new key permanently, confirmed by a cadence', correct: false },
          { label: 'A minor triad or minor 7th that resolves to I, always acting as V of the original tonic', correct: false },
        ],
      },
      hint: 'An applied dominant temporarily acts as V (or V7) of a diatonic chord. It introduces chromatic notes to create a leading-tone resolution to its target, without establishing a new key.',
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
          { label: 'Its root rises a semitone to the root of the tonicized chord', correct: true },
          { label: 'Its root falls a semitone to the root of the tonicized chord', correct: false },
          { label: 'Its root falls a perfect fifth to the root of the tonicized chord', correct: false },
          { label: 'Its root rises a perfect fifth to the root of the tonicized chord', correct: false },
        ],
      },
      hint: 'vii°/V works the same way vii° works in a key: the root is a half step below the target chord, and the diminished quality creates strong resolution drive upward to the target.',
      nudge: 'Think of what viio does in a key: its root is the leading tone. In viio/V, whose leading tone is that root, and which way does a leading tone want to go?',
    },
    {
      id: 'l5u15m3e2',
      type: 'multiple_choice',
      prompt: 'What is the difference between a half-diminished 7th and a fully-diminished 7th chord in the context of secondary leading-tone chords?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Half-diminished has a minor 7th above the root; fully-diminished has a diminished 7th (one semitone lower)", correct: true },
          { label: "Half-diminished has a diminished 7th above the root; fully-diminished has a minor 7th (one semitone higher)", correct: false },
          { label: 'Half-diminished has a minor 7th above the root; fully-diminished has a minor 7th (the same interval)', correct: false },
          { label: 'Half-diminished has a diminished 7th above the root; fully-diminished has a diminished 7th (the same interval)', correct: false },
        ],
      },
      hint: 'Both have a diminished triad (root, m3, dim5). The 7th differs: half-dim has a minor 7th (10 semitones), fully-dim has a diminished 7th (9 semitones). Fully-dim is more common as a secondary leading-tone chord.',
    },
    {
      id: 'l5u15m3e3',
      type: 'multiple_choice',
      prompt: 'In C major, what is the target chord that viio/V resolves to?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'G major', correct: true },
          { label: 'C major', correct: false },
          { label: 'F major', correct: false },
          { label: 'D minor', correct: false },
        ],
      },
      hint: 'The "/V" tells you the target: V. In C major, V is G. vii°/V is F# diminished (F#, A, C), and the F# resolves up by half step to G, the root of the target chord.',
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
          { label: "Briefly making another chord sound like home while the larger passage stays in its original key", correct: true },
          { label: "A permanent change from the original key to a new tonic, set up by its own dominant chord and confirmed by a cadence", correct: false },
          { label: "Playing the tonic chord over and over, in every voice and register, until the home key is firmly established", correct: false },
          { label: "Transposing a melody and its accompaniment into a new key, so the passage is heard at a new pitch", correct: false },
        ],
      },
      hint: 'Tonicization is fleeting: a secondary dominant or leading-tone chord briefly treats a diatonic chord as a local tonic, but the original key remains in control. Think of it as a momentary detour.',
    },
    {
      id: 'l5u15m4e2',
      type: 'multiple_choice',
      prompt: 'How do you distinguish modulation from tonicization?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Modulation establishes a new key; tonicization briefly emphasizes a chord", correct: true },
          { label: "Tonicization establishes a new key; modulation briefly emphasizes a chord", correct: false },
          { label: "Modulation and tonicization both establish a new key", correct: false },
          { label: "Modulation and tonicization both briefly emphasize a chord", correct: false },
        ],
      },
      hint: 'The key test: does the new tonal center stick around with its own cadences and stable passages? If yes, it is a modulation. If the original key reasserts itself quickly, it is just a tonicization.',
    },
    {
      id: 'l5u15m4e3',
      type: 'multiple_choice',
      prompt: 'When a non-tonic chord is emphasized as a local tonic over several measures but no cadence confirms a new key, what is this called?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "An extended tonicization", correct: true },
          { label: "A pivot chord modulation", correct: false },
          { label: "A deceptive cadence", correct: false },
          { label: "A chromatic sequence", correct: false },
        ],
      },
      hint: 'Extended tonicizations occupy a gray area: they last longer than a quick V/x - x motion, but the new key is never confirmed with a strong cadence. The boundary between extended tonicization and modulation is subjective.',
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
          { label: 'In a chain of V7 chords, each target lies a perfect fourth above its dominant', correct: true },
          { label: 'In a chain of V7 chords, each target is the home tonic again', correct: false },
          { label: 'In a chain of V7 chords, each target lies a whole step above its dominant', correct: false },
          { label: 'In a chain of V7 chords, each target lies a minor third above its dominant', correct: false },
        ],
      },
      hint: 'A dominant chain creates cascading tension: e.g., V7/vi - V7/ii - V7/V - V7 - I. Each dominant 7th resolves to the next link, pulling the harmony back toward the tonic through a cycle.',
    },
    {
      id: 'l5u15m5e2',
      type: 'multiple_choice',
      prompt: 'In a chain of secondary dominants (e.g., V7/vi - V7/ii - V7/V - V - I in C major), what root motion connects each chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each root falls by a perfect 5th (or rises by a perfect 4th) to the next', correct: true },
          { label: 'Each root falls by a perfect 4th (or rises by a perfect 5th) to the next', correct: false },
          { label: 'Each root falls by a major 2nd (or rises by a minor 7th) to the next', correct: false },
          { label: 'Each root falls by a minor 3rd (or rises by a major 6th) to the next', correct: false },
        ],
      },
      hint: 'Dominant chains exploit the strongest root motion in tonal music: down a 5th. Each V7 resolves down a 5th to its target, and that target is reinterpreted as the next V7.',
    },
    {
      id: 'l5u15m5e3',
      type: 'multiple_choice',
      prompt: 'What is sequential tonicization?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A pattern in which the same tonicizing gesture (e.g., V7 - target) is repeated at different pitch levels', correct: true },
          { label: "A pattern in which the same tonicizing gesture (e.g., V7 - target) is played in reverse at each new pitch level", correct: false },
          { label: "A pattern in which the same tonicizing gesture (e.g., V7 - target) is repeated at one unchanged pitch level", correct: false },
          { label: "A pattern in which the same tonicizing gesture (e.g., V7 - target) is replaced by unrelated chords at each pitch level", correct: false },
        ],
      },
      hint: 'Sequential tonicization applies the same harmonic pattern (often V7 - chord) to successive scale degrees, creating a predictable but colorful chromatic motion. It is common in Baroque and jazz music.',
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
          { label: "A harmony that belongs to both tonalities", correct: true },
          { label: "A harmony that belongs to the new tonality but not the old", correct: false },
          { label: "A harmony that belongs to the old tonality but not the new", correct: false },
          { label: "A harmony that belongs to neither tonality and has no shared function", correct: false },
        ],
      },
      hint: 'A pivot chord is diatonic in both keys. For example, when modulating from C major to G major, the chord E minor is both iii in C and vi in G, creating a smooth harmonic bridge between the two keys.',
    },
    {
      id: 'l5u16m1e2',
      type: 'multiple_choice',
      prompt: 'Which chord is a diatonic pivot between C major and G major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Chord of E minor', correct: true },
          { label: 'Chord of F major', correct: false },
          { label: 'Chord of Bb major', correct: false },
          { label: 'Chord of F# diminished', correct: false },
        ],
      },
      hint: 'Find chords common to both keys. C major: C Dm Em F G Am Bdim. G major: G Am Bm C D Em F#dim. Shared chords include C, Em, Am, G. E minor as iii/vi is a strong pivot choice.',
    },
    {
      id: 'l5u16m1e3',
      type: 'multiple_choice',
      prompt: 'What is the typical process of a pivot chord modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Order: establish the old key, introduce the pivot chord, then confirm the new key with a cadence', correct: true },
          { label: 'Order: establish the new key, introduce the pivot chord, then confirm the old key with a cadence', correct: false },
          { label: 'Order: introduce the pivot chord, establish the old key, then confirm the new key with a cadence', correct: false },
          { label: 'Order: establish the old key, confirm the new key with a cadence, then introduce the pivot chord', correct: false },
        ],
      },
      hint: 'Pivot chord modulation unfolds in three stages: (1) the old key is clearly established, (2) a diatonic chord is reinterpreted as belonging to the new key, (3) the new key is confirmed with a cadence (typically V-I).',
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
          { label: "5 closely related keys", correct: true },
          { label: "2 closely related keys", correct: false },
          { label: "12 closely related keys", correct: false },
          { label: "3 closely related keys", correct: false },
        ],
      },
      hint: 'Closely related keys differ by at most one accidental in their key signatures. For C major: G major (+1#), F major (+1b), A minor (relative), E minor (rel. of G), D minor (rel. of F). That gives 5 closely related keys.',
    },
    {
      id: 'l5u16m2e2',
      type: 'multiple_choice',
      prompt: 'Why is modulating to the dominant key (V) considered one of the smoothest modulations?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Six pitches stay the same, leaving several shared harmonies available to connect the two tonalities", correct: true },
          { label: "Two pitches stay the same, leaving a single shared harmony to connect the two tonalities", correct: false },
          { label: "The pitches stay the same because the dominant key has the same key signature", correct: false },
          { label: "The pitches stay the same because the dominant key is the relative minor of the original key", correct: false },
        ],
      },
      hint: 'C major and G major share 6 of 7 notes (only F vs F#). This overlap means many chords are common to both keys, providing abundant pivot chord options and a seamless transition.',
    },
    {
      id: 'l5u16m2e3',
      type: 'multiple_choice',
      prompt: 'Which of the following are closely related keys to C major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "G major, F major, A minor, E minor, D minor", correct: true },
          { label: 'D major, G major, B minor, E minor, F# minor', correct: false },
          { label: 'F major, Bb major, D minor, G minor, C minor', correct: false },
          { label: 'Eb major, Ab major, C minor, F minor, Bb minor', correct: false },
        ],
      },
      hint: 'Closely related keys have key signatures that differ from C major’s (no sharps or flats) by at most one accidental. G major has 1#, F major has 1b, and their relative minors (E minor, D minor) plus the relative minor of C (A minor) complete the set.',
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
          { label: "An abrupt switch of tonal center between phrases, without a shared harmony connecting them", correct: true },
          { label: 'A gradual switch of tonal center through a shared harmony connecting two phrases', correct: false },
          { label: 'A brief emphasis on a chord within a phrase, with the original tonal center retained', correct: false },
          { label: 'A gradual switch of tonal center within a phrase through a connecting chromatic sequence', correct: false },
        ],
      },
      hint: 'Direct modulation is the most abrupt type: one phrase ends in the old key, and the next phrase simply starts in the new key. No pivot chord or chromatic preparation bridges the gap. Common in pop and hymn tunes.',
    },
    {
      id: 'l5u16m3e2',
      type: 'multiple_choice',
      prompt: 'What is a common-tone modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "A pitch stays sounding while the surrounding harmony gives it a new tonal meaning", correct: true },
          { label: 'A pitch changes its sound while the surrounding harmony gives it a new tonal meaning', correct: false },
          { label: 'A pitch stays sounding while the surrounding harmony stays in the same key', correct: false },
          { label: 'A pitch changes its sound while the surrounding harmony stays in the same key', correct: false },
        ],
      },
      hint: 'In common-tone modulation, one note is held (or repeated) while the harmony shifts around it. That note gains a new function in the new key. This technique works well for modulating to distant keys.',
    },
    {
      id: 'l5u16m3e3',
      type: 'multiple_choice',
      prompt: 'What is a chromatic modulation?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A modulation achieved by chromatically altering one or more notes in a chord to pivot into the new key', correct: true },
          { label: 'A modulation achieved by moving to a key with more sharps or flats', correct: false },
          { label: 'A modulation achieved by chromatically altering the melody while the harmony stays in the old key', correct: false },
          { label: 'A modulation achieved by starting a new phrase directly in a different key', correct: false },
        ],
      },
      hint: 'Chromatic modulation uses half-step voice leading to transform a chord from the old key into a chord that belongs to the new key. One or more notes shift by a semitone, smoothly redirecting the harmony.',
    },
  ],

  // ---- l5u16m4: Mode Mixture — Borrowed Chords ----
  l5u16m4: [
    {
      id: 'l5u16m4e1',
      type: 'chord_build',
      prompt: 'Build bVI in C major, a chord borrowed from C minor. Select all 3 notes.',
      config: {
        type: 'chord_build',
        root: 'A',
        rootAccidental: 'b',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'bVI in C major = Ab major: Ab (8), C (0), Eb (3). This chord is borrowed from C natural minor, where VI is Ab major. The Ab and Eb are chromatic notes in C major.',
    },
    {
      id: 'l5u16m4e2',
      type: 'chord_build',
      prompt: 'Build iv in C major, a chord borrowed from C minor. Select all 3 notes.',
      config: {
        type: 'chord_build',
        root: 'F',
        rootAccidental: '',
        quality: 'minor',
        noteCount: 3,
      },
      hint: 'iv in C major = F minor: F (5), Ab (8), C (0). In C major, IV is F major (F, A, C). Borrowing from C minor lowers the A to Ab, creating the darker-sounding minor subdominant.',
    },
    {
      id: 'l5u16m4e3',
      type: 'multiple_choice',
      prompt: 'What is mode mixture (also called modal interchange)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Taking harmonies from the opposite mode on the same tonic", correct: true },
          { label: 'Taking harmonies from the relative major or minor key', correct: false },
          { label: 'Taking harmonies from the opposite mode on a different tonic', correct: false },
          { label: 'Taking harmonies from the dominant key, a 5th above', correct: false },
        ],
      },
      hint: 'Mode mixture borrows chords from the parallel key (same tonic, opposite mode). In C major, you borrow from C minor: bIII (Eb), iv (Fm), bVI (Ab), bVII (Bb). These add darkness and chromatic richness.',
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
          { label: "Ending a piece in a minor key with a major tonic chord by raising only the third of the final chord", correct: true },
          { label: "Ending a piece in a major key with a minor tonic chord by lowering only the third of the final chord", correct: false },
          { label: "Ending a piece in a minor key with a major dominant chord instead of the final tonic chord", correct: false },
          { label: "Ending a piece in a major key with a minor subdominant chord instead of the final tonic chord", correct: false },
        ],
      },
      hint: 'The Picardy third is a centuries-old technique: a minor-key piece ends on a major I chord (e.g., C minor piece ending on C major). The raised third creates a bright, resolved ending after minor-key darkness.',
    },
    {
      id: 'l5u16m5e2',
      type: 'multiple_choice',
      prompt: 'In mode mixture, what does it mean to borrow from the parallel major in a minor key?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Using chords from the major key with the same tonic in a minor-key context', correct: true },
          { label: 'Using chords from the relative major key in a minor-key context', correct: false },
          { label: "Using chords from a major key with a different tonic in a minor-key context", correct: false },
          { label: 'Using chords from the major key a 5th above in a minor-key context', correct: false },
        ],
      },
      hint: 'Mode mixture works in both directions. A minor key can borrow from its parallel major: e.g., in A minor, you can borrow IV from A major (D major instead of D minor) to brighten the harmony temporarily.',
    },
    {
      id: 'l5u16m5e3',
      type: 'multiple_choice',
      prompt: 'Which of the following is an example of mode mixture in a minor key?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Using a major IV chord in a minor key, borrowed from the parallel major', correct: true },
          { label: 'Using a major III chord in a minor key, shared with the relative major', correct: false },
          { label: 'Using a major V chord in a minor key, built with the raised 7th of harmonic minor', correct: false },
          { label: 'Using a minor iv chord in a minor key, built from its natural minor scale', correct: false },
        ],
      },
      hint: 'The V chord in minor comes from harmonic minor \u2014 it belongs to the minor key itself, not to mode mixture. Mode mixture borrows chords from the parallel key. A major IV in minor (e.g., D major in A minor instead of D minor) is a common example; Level 4 traced the same chord to ascending melodic minor, and both readings are common.',
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
          { label: 'A design with an opening section followed by a contrasting second section', correct: true },
          { label: 'A design with three sections: A, B and a return to A', correct: false },
          { label: 'A design with two simultaneous lines: melody and accompaniment', correct: false },
          { label: 'A design with repeated pairs of phrases: question and answer', correct: false },
        ],
      },
      hint: 'Binary form (AB) divides a piece into two complementary sections. Section A typically ends away from the tonic (often on V), and section B returns to the tonic. Both sections are usually repeated (||: A :||: B :||).',
    },
    {
      id: 'l5u17m1e2',
      type: 'multiple_choice',
      prompt: 'What distinguishes rounded binary form from simple binary form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Part of the opening theme comes back within the second section, rather than forming a separate third section", correct: true },
          { label: "Part of the opening theme comes back as a separate third section after the second ends", correct: false },
          { label: "Part of the contrasting theme comes back within the first section before the second begins", correct: false },
          { label: "Part of the opening theme disappears from the second section rather than returning within it", correct: false },
        ],
      },
      hint: 'Rounded binary (||: A :||: B A\' :||) brings back the opening A material at the end of the B section. Simple binary does not return to A. Many Classical minuets and scherzos use rounded binary form.',
    },
    {
      id: 'l5u17m1e3',
      type: 'multiple_choice',
      prompt: 'What is ternary form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "A three-part structure where the first section returns after a contrasting middle section", correct: true },
          { label: 'A three-part structure where three contrasting sections appear without a return', correct: false },
          { label: 'A three-part structure where one theme receives two successive variations', correct: false },
          { label: 'A three-part structure where the same music repeats for three sets of lyrics', correct: false },
        ],
      },
      hint: 'Ternary form has three distinct sections: A (statement), B (contrast), A (return). Unlike rounded binary, each section in ternary form is harmonically self-contained, usually ending with a cadence in its own key.',
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
          { label: 'A form in which verses with new lyrics alternate with a recurring chorus', correct: true },
          { label: "A form in which the verses keep the same lyrics while each chorus introduces new lyrics", correct: false },
          { label: "A form in which a recurring verse alternates with contrasting instrumental episodes instead of a chorus", correct: false },
          { label: "A form in which verses lead into a bridge and return without a recurring chorus", correct: false },
        ],
      },
      hint: 'Verse-chorus is the most common pop/rock form. Verses advance the story with changing lyrics over the same music. The chorus provides the emotional peak with a consistent, memorable hook.',
    },
    {
      id: 'l5u17m2e2',
      type: 'multiple_choice',
      prompt: 'What is AABA form (also called 32-bar song form)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'An AABA song in which B is a contrasting bridge before A returns', correct: true },
          { label: 'An AABA song in which B repeats the same music as A with new lyrics', correct: false },
          { label: 'An AABA song in which B is the verse and each A is its repeating chorus', correct: false },
          { label: 'An AABA song in which B is an instrumental repeat of A with the same melody and harmony', correct: false },
        ],
      },
      hint: 'AABA is the classic Tin Pan Alley / Great American Songbook form. Each section is typically 8 bars. The B section (bridge or "middle eight") provides contrast before the final A returns. Many jazz standards use this form.',
    },
    {
      id: 'l5u17m2e3',
      type: 'multiple_choice',
      prompt: 'What is the usual order of the three main sections of sonata form?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Exposition → development → recapitulation', correct: true },
          { label: 'Development → recapitulation → exposition', correct: false },
          { label: 'Recapitulation → development → exposition', correct: false },
          { label: 'Recapitulation → exposition → development', correct: false },
        ],
      },
      hint: 'Sonata form: the exposition presents two contrasting themes in different keys, the development fragments and transforms them through a series of other keys, and the recapitulation restates both themes in the home key.',
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
          { label: 'One melody with chordal accompaniment -- other voices support the main melodic line', correct: false },
          { label: 'Two independent melodies sounding simultaneously -- each with its own rhythmic interest', correct: false },
          { label: 'One melody played simultaneously with individual variations -- the performers differ in their melodic lines', correct: false },
        ],
      },
      hint: 'Monophony is the simplest texture: a single unaccompanied melody. Even if many people sing or play the same melody (in unison or octaves), it remains monophonic because there is only one musical line.',
    },
    {
      id: 'l5u17m3e2',
      type: 'multiple_choice',
      prompt: 'What is polyphonic texture?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Two or more independent melodic lines sounding at once with their own rhythms and contours', correct: true },
          { label: 'A single melodic line with no accompaniment, performed in unison or octaves by several voices', correct: false },
          { label: 'One melody with chordal accompaniment, the other voices supporting its rhythmic and melodic interest', correct: false },
          { label: 'One melody performed simultaneously with individual variations, each performer ornamenting the same line', correct: false },
        ],
      },
      hint: 'Polyphony features multiple independent voices, each with melodic interest. A Bach fugue is the classic example: each voice enters with the same theme but then moves independently, weaving a complex contrapuntal web.',
    },
    {
      id: 'l5u17m3e3',
      type: 'multiple_choice',
      prompt: 'What is homophonic texture?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A primary melody accompanied by chords or harmonic support, where all parts move in the same rhythm or support the melody', correct: true },
          { label: 'A single melodic line performed by all voices in unison or octaves, without chordal accompaniment', correct: false },
          { label: 'Two independent melodic lines sounding simultaneously, each with its own rhythmic and melodic interest', correct: false },
          { label: 'A single melody played simultaneously with individual variations, with no chordal accompaniment beneath it', correct: false },
        ],
      },
      hint: 'Homophony has one dominant melody with harmonic accompaniment. Most pop, rock, and classical music from the Classical era onward is homophonic. A singer with guitar chords is a clear example.',
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
          { label: 'Chord thirds and sevenths', correct: true },
          { label: 'Chord roots and fifths', correct: false },
          { label: 'Chord ninths and elevenths', correct: false },
          { label: 'Melody notes on strong beats', correct: false },
        ],
      },
      hint: 'Guide tones (3rds and 7ths) are the most harmonically defining notes of a chord. The root and 5th are structurally important but generic; the 3rd determines major/minor and the 7th determines chord type.',
    },
    {
      id: 'l5u17m4e2',
      type: 'multiple_choice',
      prompt: 'In ii7-V7-I in C major (Dm7-G7-Cmaj7), which notes are the guide tones of each chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "F-C in Dm7, F-B in G7, E-B in Cmaj7", correct: true },
          { label: 'D-A in Dm7, G-D in G7, C-G in Cmaj7', correct: false },
          { label: 'F-A in Dm7, B-D in G7, E-G in Cmaj7', correct: false },
          { label: 'A-C in Dm7, D-F in G7, G-B in Cmaj7', correct: false },
        ],
      },
      hint: 'Dm7 guide tones: F (3rd), C (7th). Into G7: F holds as a common tone and becomes the 7th, while C steps down a half step to B, the 3rd. Into Cmaj7: B holds and becomes the 7th, while F steps down a half step to E, the 3rd. Minimal motion = smooth voice leading.',
      nudge: "Guide tones are each chord's 3rd and 7th. Spell them for Dm7, G7 and Cmaj7, then compare: which notes stay put from one chord to the next, and how far do the others move?",
    },
    {
      id: 'l5u17m4e3',
      type: 'multiple_choice',
      prompt: 'What is the fundamental voice leading principle that guide tones illustrate?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Move each voice to its nearest chord tone", correct: true },
          { label: "Move each voice to the next chord root", correct: false },
          { label: "Move each voice to the next chord fifth", correct: false },
          { label: "Move each voice by the same interval", correct: false },
        ],
      },
      hint: 'Good voice leading minimizes movement: hold common tones, move other voices by step. This creates smooth, connected harmonic progressions. Guide tone lines demonstrate this principle with just the two most essential notes per chord.',
    },
  ],
};

export default exercises;
