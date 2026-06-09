import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 4 Exercises — ~45 exercises across 15 modules
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 12: Non-Chord Tones and Dominant Seventh
  // =========================================================================

  // ---- l4u12m1: Suspensions ----
  l4u12m1: [
    {
      id: 'l4u12m1e1',
      type: 'multiple_choice',
      prompt: 'What is a 4-3 suspension?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The 4th above the bass is held over from the previous chord and resolves down to the 3rd', correct: true },
          { label: 'The 3rd is raised to the 4th and stays there', correct: false },
          { label: 'A chord that alternates between the 4th and 3rd degrees', correct: false },
          { label: 'The bass moves from the 4th degree to the 3rd degree of the scale', correct: false },
        ],
      },
      hint: 'In a 4-3 suspension, the 4th above the bass is a dissonance carried over (suspended) from the previous chord. It then resolves downward by step to the consonant 3rd.',
      points: 1,
    },
    {
      id: 'l4u12m1e2',
      type: 'multiple_choice',
      prompt: 'What are the three phases of a suspension?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Preparation, suspension, resolution', correct: true },
          { label: 'Tension, climax, release', correct: false },
          { label: 'Approach, arrival, departure', correct: false },
          { label: 'Anticipation, suspension, retardation', correct: false },
        ],
      },
      hint: 'A suspension has three stages: preparation (the note is consonant in the previous chord), suspension (the note is held while the harmony changes, creating dissonance), and resolution (it moves stepwise to a consonance).',
      points: 1,
    },
    {
      id: 'l4u12m1e3',
      type: 'multiple_choice',
      prompt: 'In the key of C major, a V chord is sounding and the note F is held over from the previous IV chord before resolving to E. What type of non-chord tone is the F?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Suspension (4-3 over the V chord)', correct: true },
          { label: 'Passing tone', correct: false },
          { label: 'Appoggiatura', correct: false },
          { label: 'Escape tone', correct: false },
        ],
      },
      hint: 'The F was consonant in the IV chord (F-A-C), then held over into the V chord (G-B-D) where it is dissonant (a 4th above the bass G), and resolves down by step to E (the 3rd). This is a textbook 4-3 suspension.',
      points: 1,
    },
  ],

  // ---- l4u12m2: Appoggiatura / Escape Tone ----
  l4u12m2: [
    {
      id: 'l4u12m2e1',
      type: 'multiple_choice',
      prompt: 'How does an appoggiatura approach its dissonant note?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'By leap — it arrives on the dissonance without stepwise preparation', correct: true },
          { label: 'By step from above only', correct: false },
          { label: 'By being held over from the previous chord', correct: false },
          { label: 'By chromatic half step', correct: false },
        ],
      },
      hint: 'An appoggiatura is an accented non-chord tone approached by leap and resolved by step in the opposite direction. Unlike a suspension, it has no preparation — it leaps directly onto the dissonance.',
      points: 1,
    },
    {
      id: 'l4u12m2e2',
      type: 'multiple_choice',
      prompt: 'How does an escape tone differ from a passing tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'An escape tone is approached by step but leaves by leap in the opposite direction', correct: true },
          { label: 'An escape tone is approached by leap and leaves by step', correct: false },
          { label: 'An escape tone occurs on a strong beat while a passing tone occurs on a weak beat', correct: false },
          { label: 'There is no difference; they are the same thing', correct: false },
        ],
      },
      hint: 'An escape tone (echappee) moves stepwise from a chord tone, then leaps away in the opposite direction to the next chord tone. A passing tone moves stepwise in the same direction throughout.',
      points: 1,
    },
    {
      id: 'l4u12m2e3',
      type: 'multiple_choice',
      prompt: 'A retardation resolves in which direction?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Upward by step — it is a suspension that resolves up instead of down', correct: true },
          { label: 'Downward by step, like a standard suspension', correct: false },
          { label: 'Downward by leap', correct: false },
          { label: 'It does not resolve; it remains dissonant', correct: false },
        ],
      },
      hint: 'A retardation is essentially a suspension that resolves upward by step rather than downward. The most common example is 7-8, where the 7th above the bass resolves up to the octave.',
      points: 1,
    },
  ],

  // ---- l4u12m3: Pedal Point ----
  l4u12m3: [
    {
      id: 'l4u12m3e1',
      type: 'multiple_choice',
      prompt: 'What is a pedal point?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A sustained or repeated note held through changing harmonies above it', correct: true },
          { label: 'A non-chord tone that steps between two chord tones', correct: false },
          { label: 'A chord that is held for an entire phrase', correct: false },
          { label: 'The lowest note of any chord voicing', correct: false },
        ],
      },
      hint: 'A pedal point (or pedal tone) is a single note — usually the tonic or dominant — sustained in one voice while the other voices move through harmonies that may be dissonant against it. Named after the organ pedal that holds bass notes.',
      points: 1,
    },
    {
      id: 'l4u12m3e2',
      type: 'multiple_choice',
      prompt: 'What is a "changing tone" (also called a neighbor group or double neighbor)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Two non-chord tones that approach a chord tone from both above and below in succession', correct: true },
          { label: 'A chord tone that changes to a different chord tone', correct: false },
          { label: 'A modulation from one key to another', correct: false },
          { label: 'An accidental that changes the quality of a chord', correct: false },
        ],
      },
      hint: 'A changing tone (neighbor group) decorates a chord tone by moving to its upper neighbor, then its lower neighbor (or vice versa) before returning. For example: C-D-B-C ornaments the note C.',
      points: 1,
    },
    {
      id: 'l4u12m3e3',
      type: 'multiple_choice',
      prompt: 'Where is a pedal point most commonly found?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'In the bass voice, usually on the tonic or dominant pitch', correct: true },
          { label: 'In the soprano voice exclusively', correct: false },
          { label: 'Only between the two inner voices', correct: false },
          { label: 'Alternating between the highest and lowest voices', correct: false },
        ],
      },
      hint: 'Although pedal points can occur in any voice (an "inverted pedal" is in the soprano, an "inner pedal" is in a middle voice), the most common placement is in the bass on scale degree 1 (tonic pedal) or 5 (dominant pedal).',
      points: 1,
    },
  ],

  // ---- l4u12m4: V7 Resolution Rules ----
  l4u12m4: [
    {
      id: 'l4u12m4e1',
      type: 'chord_build',
      prompt: 'Build a V7 chord in the key of C major. This is G dominant 7th: G-B-D-F. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'G',
        rootAccidental: '',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'G7 = G, B, D, F. Root (G) + major 3rd (B) + perfect 5th (D) + minor 7th (F). The tritone between B and F drives the resolution to C major.',
      points: 2,
    },
    {
      id: 'l4u12m4e2',
      type: 'chord_build',
      prompt: 'Build a V7 chord in the key of G major. This is D dominant 7th: D-F#-A-C. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'D7 = D, F#, A, C. Root (D) + major 3rd (F#) + perfect 5th (A) + minor 7th (C). The tritone between F# and C resolves to G major.',
      points: 2,
    },
    {
      id: 'l4u12m4e3',
      type: 'multiple_choice',
      prompt: 'How does the tritone within V7 resolve when moving to I?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The leading tone (3rd of V7) resolves up by half step to the tonic; the 7th of V7 resolves down by half step', correct: true },
          { label: 'Both notes of the tritone resolve upward by step', correct: false },
          { label: 'The tritone expands outward to an octave', correct: false },
          { label: 'Both notes of the tritone move down by whole step', correct: false },
        ],
      },
      hint: 'In G7 resolving to C: B (leading tone, 3rd of V7) resolves up to C; F (7th of V7) resolves down to E. The tritone B-F contracts inward to C-E. This contrary motion is the engine of tonal resolution.',
      points: 1,
    },
  ],

  // ---- l4u12m5: V7 Inversions ----
  l4u12m5: [
    {
      id: 'l4u12m5e1',
      type: 'multiple_choice',
      prompt: 'What figured bass symbol represents V6/5 (V7 in first inversion)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '6/5 — the 3rd of the chord is in the bass', correct: true },
          { label: '4/3 — the 5th of the chord is in the bass', correct: false },
          { label: '4/2 — the 7th of the chord is in the bass', correct: false },
          { label: '7 — the root is in the bass', correct: false },
        ],
      },
      hint: 'V6/5 means the 3rd of V7 is the bass note. In C major, that means B is the lowest note of G7. The figures 6 and 5 describe the intervals above the bass (B to G = 6th, B to F = 5th).',
      points: 1,
    },
    {
      id: 'l4u12m5e2',
      type: 'multiple_choice',
      prompt: 'V4/3 (V7 in second inversion) typically resolves to which chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'I (or I6) — the bass (5th of V7) steps down to the root or 3rd of I', correct: true },
          { label: 'IV — the bass leaps up to the subdominant', correct: false },
          { label: 'vi — the bass moves to the submediant', correct: false },
          { label: 'It does not resolve; it is a stable chord', correct: false },
        ],
      },
      hint: 'V4/3 has the 5th of V7 in the bass (D in G7/D in C major). The D typically resolves stepwise — down to C (root of I) or up to E (giving I6). The tritone B-F still resolves as usual.',
      points: 1,
    },
    {
      id: 'l4u12m5e3',
      type: 'multiple_choice',
      prompt: 'In V4/2 (V7 in third inversion), which chord tone is in the bass?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The 7th of the chord', correct: true },
          { label: 'The root of the chord', correct: false },
          { label: 'The 3rd of the chord', correct: false },
          { label: 'The 5th of the chord', correct: false },
        ],
      },
      hint: 'V4/2 (also written V2) places the 7th of V7 in the bass. In C major, that means F is the bass note of G7. The F resolves down by step to E, producing I6 (C major in first inversion).',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 13: Diatonic Seventh Chords, Function, Sequences
  // =========================================================================

  // ---- l4u13m1: Pre-Dominant Sevenths ----
  l4u13m1: [
    {
      id: 'l4u13m1e1',
      type: 'chord_build',
      prompt: 'Build a ii7 chord in C major. This is D minor 7th: D-F-A-C. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'minor7',
        noteCount: 4,
      },
      hint: 'Dm7 = D, F, A, C. Root (D) + minor 3rd (F) + perfect 5th (A) + minor 7th (C). This is the most common pre-dominant seventh chord in major keys.',
      points: 2,
    },
    {
      id: 'l4u13m1e2',
      type: 'chord_build',
      prompt: 'Build a iiø7 chord in C minor. This is D half-diminished 7th: D-F-Ab-C. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'half_diminished7',
        noteCount: 4,
      },
      hint: 'Dø7 = D, F, Ab, C. Root (D) + minor 3rd (F) + diminished 5th (Ab) + minor 7th (C). In minor keys, the ii chord is half-diminished because the 5th (Ab) is lowered.',
      points: 2,
    },
    {
      id: 'l4u13m1e3',
      type: 'multiple_choice',
      prompt: 'Why is the ii7 chord considered a pre-dominant?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It most commonly progresses to V or V7, preparing the dominant harmony', correct: true },
          { label: 'It resolves directly to the tonic I chord', correct: false },
          { label: 'It replaces the dominant function entirely', correct: false },
          { label: 'It only appears before the IV chord', correct: false },
        ],
      },
      hint: 'In the standard T-PD-D-T functional model, ii (and ii7) serves a pre-dominant function. It creates harmonic momentum toward V, which then resolves to I. The ii-V-I progression is foundational in both classical and jazz.',
      points: 1,
    },
  ],

  // ---- l4u13m2: Mediant / Submediant Sevenths ----
  l4u13m2: [
    {
      id: 'l4u13m2e1',
      type: 'multiple_choice',
      prompt: 'In a major key, what is the quality of the iii7 chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Minor 7th — built on the mediant with a minor triad and minor 7th', correct: true },
          { label: 'Major 7th — built with a major triad and major 7th', correct: false },
          { label: 'Dominant 7th — a major triad with a minor 7th', correct: false },
          { label: 'Half-diminished 7th — a diminished triad with a minor 7th', correct: false },
        ],
      },
      hint: 'In C major, iii7 = E-G-B-D. The triad E-G-B is minor, and E to D is a minor 7th (10 semitones). So iii7 is a minor 7th chord, just like ii7 and vi7.',
      points: 1,
    },
    {
      id: 'l4u13m2e2',
      type: 'multiple_choice',
      prompt: 'In a major key, what is the quality of the vi7 chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Minor 7th — a minor triad plus a minor 7th above the root', correct: true },
          { label: 'Major 7th — a major triad plus a major 7th above the root', correct: false },
          { label: 'Dominant 7th — a major triad plus a minor 7th above the root', correct: false },
          { label: 'Diminished 7th — a diminished triad plus a diminished 7th', correct: false },
        ],
      },
      hint: 'In C major, vi7 = A-C-E-G. The triad A-C-E is minor, and A to G is a minor 7th (10 semitones). Like ii7 and iii7, the vi7 is a minor 7th chord.',
      points: 1,
    },
    {
      id: 'l4u13m2e3',
      type: 'multiple_choice',
      prompt: 'What is the quality of the Imaj7 chord in a major key, and where is it commonly used?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Major 7th — often used as a colorful tonic chord in jazz and pop', correct: true },
          { label: 'Dominant 7th — always resolves to IV', correct: false },
          { label: 'Minor 7th — used only in minor keys', correct: false },
          { label: 'Half-diminished 7th — creates strong dissonance at rest', correct: false },
        ],
      },
      hint: 'In C major, Imaj7 = C-E-G-B. The major 7th (B) adds warmth and color to the tonic triad without undermining its stability. It is a staple sonority in jazz, bossa nova, and many pop styles.',
      points: 1,
    },
  ],

  // ---- l4u13m3: Leading-Tone Sevenths ----
  l4u13m3: [
    {
      id: 'l4u13m3e1',
      type: 'chord_build',
      prompt: 'Build a fully diminished 7th chord on B (viio7 in C minor): B-D-F-Ab. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'B',
        rootAccidental: '',
        quality: 'diminished7',
        noteCount: 4,
      },
      hint: 'Bo7 = B, D, F, Ab. Root (B) + minor 3rd (D) + diminished 5th (F) + diminished 7th (Ab). All three upper intervals are minor 3rds stacked on top of each other (3+3+3 semitones).',
      points: 2,
    },
    {
      id: 'l4u13m3e2',
      type: 'chord_build',
      prompt: 'Build a half-diminished 7th chord on B (viiø7 in C major): B-D-F-A. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'B',
        rootAccidental: '',
        quality: 'half_diminished7',
        noteCount: 4,
      },
      hint: 'Bø7 = B, D, F, A. Root (B) + minor 3rd (D) + diminished 5th (F) + minor 7th (A). Unlike the fully diminished 7th, the top interval is a major 3rd (F to A), making the 7th minor rather than diminished.',
      points: 2,
    },
    {
      id: 'l4u13m3e3',
      type: 'multiple_choice',
      prompt: 'What is the key difference between a fully diminished 7th chord and a half-diminished 7th chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The fully diminished has a diminished 7th (9 semitones); the half-diminished has a minor 7th (10 semitones)', correct: true },
          { label: 'The fully diminished uses a minor triad; the half-diminished uses a major triad', correct: false },
          { label: 'The fully diminished has a perfect 5th; the half-diminished has a diminished 5th', correct: false },
          { label: 'They are the same chord with different names', correct: false },
        ],
      },
      hint: 'Both chords share a diminished triad (minor 3rd + diminished 5th). The difference is the 7th: fully diminished = diminished 7th (enharmonic major 6th, 9 semitones); half-diminished = minor 7th (10 semitones).',
      points: 1,
    },
  ],

  // ---- l4u13m4: Harmonic Function T-PD-D-T ----
  l4u13m4: [
    {
      id: 'l4u13m4e1',
      type: 'multiple_choice',
      prompt: 'In the T-PD-D-T functional model, which harmonic function does the ii chord serve?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Pre-dominant (PD) — it prepares the dominant', correct: true },
          { label: 'Tonic (T) — it substitutes for I', correct: false },
          { label: 'Dominant (D) — it resolves to I', correct: false },
          { label: 'It has no standard function', correct: false },
        ],
      },
      hint: 'The ii chord (along with IV) is the primary pre-dominant harmony. In the functional cycle T-PD-D-T, pre-dominants bridge tonic stability and dominant tension: I → ii → V → I.',
      points: 1,
    },
    {
      id: 'l4u13m4e2',
      type: 'multiple_choice',
      prompt: 'What is the standard order of harmonic functions in a tonal phrase?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Tonic → Pre-dominant → Dominant → Tonic', correct: true },
          { label: 'Dominant → Tonic → Pre-dominant → Dominant', correct: false },
          { label: 'Pre-dominant → Dominant → Tonic → Pre-dominant', correct: false },
          { label: 'Tonic → Dominant → Pre-dominant → Tonic', correct: false },
        ],
      },
      hint: 'The normative functional progression is T-PD-D-T. Music begins at rest (tonic), builds tension through pre-dominant and dominant, then returns to rest. Skipping stages is possible (T-D-T), but reversing the order (D before PD) is rare in common practice.',
      points: 1,
    },
    {
      id: 'l4u13m4e3',
      type: 'multiple_choice',
      prompt: 'Which chord can substitute for IV as a pre-dominant in a major key?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'ii — both share two common tones and serve the same pre-dominant function', correct: true },
          { label: 'V — because it is close to IV on the circle of fifths', correct: false },
          { label: 'iii — because it is adjacent to IV by step', correct: false },
          { label: 'viio — because it contains the leading tone', correct: false },
        ],
      },
      hint: 'In C major, IV = F-A-C and ii = D-F-A. They share F and A (two common tones) and both create pre-dominant momentum toward V. The ii chord is often preferred in four-part writing because ii-V features smooth bass motion by 5th.',
      points: 1,
    },
  ],

  // ---- l4u13m5: Harmonic Sequences ----
  l4u13m5: [
    {
      id: 'l4u13m5e1',
      type: 'multiple_choice',
      prompt: 'What is the most common diatonic harmonic sequence?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Descending fifths — each chord root falls a 5th (or rises a 4th): e.g. I-IV-viio-iii-vi-ii-V-I', correct: true },
          { label: 'Ascending fifths — each root rises a 5th', correct: false },
          { label: 'Descending thirds — each root falls a 3rd', correct: false },
          { label: 'Chromatic descent — each root falls a half step', correct: false },
        ],
      },
      hint: 'The descending-fifths (or circle-of-fifths) sequence moves each chord root down by a 5th diatonically. In C major: C-F-B-E-A-D-G-C (I-IV-viio-iii-vi-ii-V-I). This is the backbone of countless progressions in Western music.',
      points: 1,
    },
    {
      id: 'l4u13m5e2',
      type: 'multiple_choice',
      prompt: 'In a sequence based on ascending seconds, what is the pattern of root motion?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each chord root moves up by a diatonic second: e.g. I-ii-iii-IV', correct: true },
          { label: 'Each chord root moves down by a second: e.g. I-viio-vi-V', correct: false },
          { label: 'Roots alternate between ascending and descending seconds', correct: false },
          { label: 'Roots move by thirds but sound like seconds', correct: false },
        ],
      },
      hint: 'An ascending-seconds sequence moves each root stepwise up through the scale. While less common than descending fifths, it creates a strong sense of forward motion. It is often combined with alternating inversions for smooth voice leading.',
      points: 1,
    },
    {
      id: 'l4u13m5e3',
      type: 'multiple_choice',
      prompt: 'What defines a harmonic sequence?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A pattern of chord progressions repeated at successive pitch levels within the key', correct: true },
          { label: 'A single chord repeated multiple times', correct: false },
          { label: 'A melody played in different octaves', correct: false },
          { label: 'A series of modulations to distant keys', correct: false },
        ],
      },
      hint: 'A harmonic sequence takes a short chord pattern (the model) and repeats it at different diatonic pitch levels. The intervals between roots stay consistent, though their exact quality may change to stay within the key.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 14: Counterpoint, Meter, Analysis, Minor Harmony
  // =========================================================================

  // ---- l4u14m1: First / Second Species Counterpoint ----
  l4u14m1: [
    {
      id: 'l4u14m1e1',
      type: 'multiple_choice',
      prompt: 'In first species counterpoint, what is the fundamental rule?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Note against note — each note in the counterpoint aligns with one note in the cantus firmus, using only consonances', correct: true },
          { label: 'Two notes against one — the counterpoint moves twice as fast as the cantus firmus', correct: false },
          { label: 'Free rhythm — any rhythm can be used against the cantus firmus', correct: false },
          { label: 'Only unisons and octaves are allowed between the voices', correct: false },
        ],
      },
      hint: 'First species (1:1) is the simplest counterpoint: one note in the added voice for each note of the cantus firmus. Every vertical interval must be consonant (3rds, 5ths, 6ths, octaves, unisons). No dissonance is allowed.',
      points: 1,
    },
    {
      id: 'l4u14m1e2',
      type: 'multiple_choice',
      prompt: 'Which intervals are considered consonant in species counterpoint?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Unisons, 3rds, 5ths, 6ths, and octaves', correct: true },
          { label: 'Only perfect intervals: unisons, 4ths, 5ths, octaves', correct: false },
          { label: 'All intervals except the tritone', correct: false },
          { label: '2nds, 4ths, 7ths, and tritones', correct: false },
        ],
      },
      hint: 'In two-voice counterpoint, the consonances are: perfect consonances (unison, P5, P8) and imperfect consonances (m3, M3, m6, M6). The perfect 4th is treated as a dissonance in two-voice counterpoint. Seconds, 7ths, and tritones are dissonant.',
      points: 1,
    },
    {
      id: 'l4u14m1e3',
      type: 'multiple_choice',
      prompt: 'In second species counterpoint, how are dissonances (like passing tones) treated?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Dissonances may occur on weak beats only, approached and left by step in the same direction', correct: true },
          { label: 'Dissonances can occur on any beat as long as they resolve', correct: false },
          { label: 'No dissonances are allowed in second species', correct: false },
          { label: 'Dissonances must occur on strong beats and resolve on weak beats', correct: false },
        ],
      },
      hint: 'Second species (2:1) has two notes against each cantus firmus note. Strong beats must be consonant. Weak beats can include passing tones — stepwise dissonances that connect two consonances. This introduces controlled dissonance.',
      points: 1,
    },
  ],

  // ---- l4u14m2: Asymmetric Meters ----
  l4u14m2: [
    {
      id: 'l4u14m2e1',
      type: 'multiple_choice',
      prompt: 'How is 5/4 time typically grouped?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'As 3+2 or 2+3 — an asymmetric grouping of quarter-note beats', correct: true },
          { label: 'As 5 equal beats with no internal grouping', correct: false },
          { label: 'As 4+1, treating it like 4/4 with an extra beat', correct: false },
          { label: 'As 2.5+2.5, splitting evenly in half', correct: false },
        ],
      },
      hint: '5/4 is an asymmetric (or irregular) meter. It cannot be divided into equal groups, so it splits as 3+2 or 2+3. The choice of grouping affects the accent pattern and rhythmic feel.',
      points: 1,
    },
    {
      id: 'l4u14m2e2',
      type: 'multiple_choice',
      prompt: 'How does 7/8 time work as an additive meter?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It combines unequal groups of eighth notes (e.g. 2+2+3, 3+2+2, or 2+3+2)', correct: true },
          { label: 'It has 7 equal beats like a standard simple meter', correct: false },
          { label: 'It is a compound meter with dotted-quarter-note beats', correct: false },
          { label: 'It alternates between 3/8 and 4/8 every other measure', correct: false },
        ],
      },
      hint: '7/8 is an additive meter: 7 eighth notes are grouped into unequal sub-beats. Common groupings are 2+2+3 (short-short-long), 3+2+2 (long-short-short), or 2+3+2. The long group feels like a slightly stretched beat.',
      points: 1,
    },
    {
      id: 'l4u14m2e3',
      type: 'multiple_choice',
      prompt: 'What does the time signature "cut time" (alla breve, C with a vertical line) mean?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '2/2 time — two half-note beats per measure, felt in two rather than four', correct: true },
          { label: '4/4 time played at double speed', correct: false },
          { label: '2/4 time with the tempo cut in half', correct: false },
          { label: 'Any time signature where the note values are halved', correct: false },
        ],
      },
      hint: 'Cut time (alla breve) is 2/2: two half-note beats per measure. A 2/2 bar has the same total duration as a 4/4 bar, but it is counted in 2 (half-note beat) rather than 4 (quarter-note beat) — the same notes felt in two beats, giving a broader, faster-moving pulse.',
      points: 1,
    },
  ],

  // ---- l4u14m3: Chromatic Embellishment ----
  l4u14m3: [
    {
      id: 'l4u14m3e1',
      type: 'multiple_choice',
      prompt: 'What is a chromatic passing tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A non-chord tone that fills a whole step with a chromatic half step, moving by semitone between two chord tones', correct: true },
          { label: 'Any accidental that appears in the melody', correct: false },
          { label: 'A note that leaps chromatically from one chord tone to another', correct: false },
          { label: 'A passing tone that changes the key of the passage', correct: false },
        ],
      },
      hint: 'A chromatic passing tone fills the gap between two chord tones that are a whole step apart. For example, between C and D, a C# chromatic passing tone creates smooth semitone motion: C-C#-D.',
      points: 1,
    },
    {
      id: 'l4u14m3e2',
      type: 'multiple_choice',
      prompt: 'What is a chromatic neighbor tone?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A non-chord tone a half step above or below a chord tone, returning to the same chord tone', correct: true },
          { label: 'A neighbor tone that modulates to a new key', correct: false },
          { label: 'A tone borrowed from the parallel key', correct: false },
          { label: 'Any neighbor tone in a chromatic scale passage', correct: false },
        ],
      },
      hint: 'A chromatic neighbor is an embellishment that moves by semitone from a chord tone and returns: e.g. E-E#-E or G-Gb-G. It adds color without altering the harmonic direction, functioning as a surface decoration.',
      points: 1,
    },
    {
      id: 'l4u14m3e3',
      type: 'multiple_choice',
      prompt: 'How do you distinguish a chromatic embellishment from a structural chromatic note (like a secondary leading tone)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Embellishments are non-chord tones that decorate; structural chromatic notes change the harmony or tonicize a new chord', correct: true },
          { label: 'There is no difference; all chromatic notes are embellishments', correct: false },
          { label: 'Embellishments last longer than structural notes', correct: false },
          { label: 'Structural notes are always in the bass while embellishments are in upper voices', correct: false },
        ],
      },
      hint: 'Chromatic embellishments (passing tones, neighbors) are surface decorations that do not affect the underlying harmony. Structural chromatic notes (like applied leading tones or borrowed chords) actually change the chord or briefly tonicize a different key.',
      points: 1,
    },
  ],

  // ---- l4u14m4: Roman Numeral Analysis ----
  l4u14m4: [
    {
      id: 'l4u14m4e1',
      type: 'multiple_choice',
      prompt: 'In the key of C major, a chord contains the notes F, A, and C. What is its Roman numeral analysis?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'IV — F major triad built on the 4th scale degree', correct: true },
          { label: 'ii — D minor triad in first inversion', correct: false },
          { label: 'vi — A minor triad in first inversion', correct: false },
          { label: 'I6/4 — C major in second inversion', correct: false },
        ],
      },
      hint: 'F-A-C in root position is an F major triad. In C major, F is the 4th scale degree. A major triad on the 4th degree is notated with an uppercase Roman numeral: IV.',
      points: 1,
    },
    {
      id: 'l4u14m4e2',
      type: 'multiple_choice',
      prompt: 'In Roman numeral analysis, what do uppercase and lowercase numerals indicate?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Uppercase = major triad; lowercase = minor triad', correct: true },
          { label: 'Uppercase = root position; lowercase = inverted', correct: false },
          { label: 'Uppercase = diatonic chord; lowercase = chromatic chord', correct: false },
          { label: 'Uppercase = strong function; lowercase = weak function', correct: false },
        ],
      },
      hint: 'Roman numeral analysis encodes both scale degree and chord quality. Uppercase (I, IV, V) = major triads. Lowercase (ii, iii, vi) = minor triads. A superscript ° marks diminished (viio), and + marks augmented.',
      points: 1,
    },
    {
      id: 'l4u14m4e3',
      type: 'multiple_choice',
      prompt: 'What do the numbers after a Roman numeral (figured bass) indicate?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The intervals above the bass note, revealing the inversion of the chord', correct: true },
          { label: 'The scale degrees of the chord tones', correct: false },
          { label: 'The number of voices sounding the chord', correct: false },
          { label: 'The duration of the chord in beats', correct: false },
        ],
      },
      hint: 'Figured bass numbers show intervals above the lowest sounding note. No numbers (or 5/3) = root position. 6 (or 6/3) = first inversion. 6/4 = second inversion. For seventh chords: 7, 6/5, 4/3, 4/2 indicate root position through third inversion.',
      points: 1,
    },
  ],

  // ---- l4u14m5: Minor Key Harmony ----
  l4u14m5: [
    {
      id: 'l4u14m5e1',
      type: 'chord_build',
      prompt: 'Build the III chord in A minor (natural minor). This is C major: C-E-G. Select all 3 notes.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'In A natural minor (A-B-C-D-E-F-G), the triad on the 3rd degree is C-E-G, a major triad. This is III — the relative major. It is one of the characteristic chords of minor-key harmony.',
      points: 2,
    },
    {
      id: 'l4u14m5e2',
      type: 'chord_build',
      prompt: 'Build the VII chord in A minor (natural minor). This is G major: G-B-D. Select all 3 notes.',
      config: {
        type: 'chord_build',
        root: 'G',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
      hint: 'In A natural minor, the triad on the 7th degree is G-B-D, a major triad. VII (subtonic chord) is a whole step below the tonic, unlike viio (leading-tone chord) from harmonic minor.',
      points: 2,
    },
    {
      id: 'l4u14m5e3',
      type: 'multiple_choice',
      prompt: 'What is the subtonic VII chord in natural minor, and how does it differ from viio in harmonic minor?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'VII is a major triad a whole step below tonic; viio is a diminished triad a half step below — only viio has dominant function', correct: true },
          { label: 'VII and viio are the same chord with different names', correct: false },
          { label: 'VII is diminished and viio is major', correct: false },
          { label: 'Both have dominant function but VII is stronger', correct: false },
        ],
      },
      hint: 'In A natural minor, VII = G major (G-B-D), a whole step below A. In A harmonic minor, viio = G#-B-D (diminished), a half step below A. The raised 7th (G#) creates the leading tone that gives viio its strong pull toward the tonic.',
      points: 1,
    },
  ],
};

export default exercises;
