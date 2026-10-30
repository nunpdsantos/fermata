import type { ExerciseDefinition } from '../../core/types/exercise';

// ---------------------------------------------------------------------------
// Level 7 Exercises — ~48 exercises across 16 modules
// Jazz, Pop & Modal Harmony
// ---------------------------------------------------------------------------

const exercises: Record<string, ExerciseDefinition[]> = {
  // =========================================================================
  // Unit 21: Jazz Harmony (6 modules)
  // =========================================================================

  // ---- l7u21m1: Jazz Chord Symbols/Extensions ----
  l7u21m1: [
    {
      id: 'l7u21m1e1',
      type: 'chord_build',
      prompt: 'Build a Cmaj9 chord. Select all 5 notes: root, major 3rd, perfect 5th, major 7th, and major 9th.',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'major9',
        noteCount: 5,
      },
      hint: 'Cmaj9 = C, E, G, B, D. Stack: root (C), major 3rd (E), perfect 5th (G), major 7th (B), major 9th (D). Pitch classes: 0, 4, 7, 11, 2.',
      points: 2,
    },
    {
      id: 'l7u21m1e2',
      type: 'chord_build',
      prompt: 'Build a Dm9 chord. Select all 5 notes: root, minor 3rd, perfect 5th, minor 7th, and major 9th.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'minor9',
        noteCount: 5,
      },
      hint: 'Dm9 = D, F, A, C, E. Stack: root (D), minor 3rd (F), perfect 5th (A), minor 7th (C), major 9th (E). Pitch classes: 2, 5, 9, 0, 4.',
      points: 2,
    },
    {
      id: 'l7u21m1e3',
      type: 'multiple_choice',
      prompt: 'In jazz chord symbols, what does "alt" (as in G7alt) indicate?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A dominant chord with both altered 5ths and altered 9ths (b5/#5, b9/#9)', correct: true },
          { label: 'An alternate voicing of a standard dominant chord', correct: false },
          { label: 'A chord that alternates between major and minor quality', correct: false },
          { label: 'A chord that can be substituted by any other chord', correct: false },
        ],
      },
      hint: 'The "alt" suffix means the chord has altered extensions: b9, #9, b5 (or #11), and #5 (or b13). It is paired with the altered (superlocrian) scale.',
      points: 1,
    },
  ],

  // ---- l7u21m2: Shell Voicings ----
  l7u21m2: [
    {
      id: 'l7u21m2e1',
      type: 'multiple_choice',
      prompt: 'A shell voicing typically contains which chord tones?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Root, 3rd, and 7th only — omitting the 5th and extensions', correct: true },
          { label: 'Root, 5th, and octave — omitting the 3rd and 7th', correct: false },
          { label: 'All seven notes of the parent scale', correct: false },
          { label: 'Root and 5th only — a power chord voicing', correct: false },
        ],
      },
      hint: 'Shell voicings strip a chord to its essentials: root defines the bass, 3rd determines major/minor quality, and 7th determines the chord type (maj7, dom7, m7). In those chords the perfect 5th is redundant; in m7b5 and dim7 chords the flatted 5th is what defines the chord, so it stays.',
      points: 1,
    },
    {
      id: 'l7u21m2e2',
      type: 'multiple_choice',
      prompt: 'What is the defining characteristic of an altered dominant chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It has a dominant 7th with one or more chromatically altered 5ths or 9ths', correct: true },
          { label: 'It replaces the 3rd with a suspended 4th', correct: false },
          { label: 'It uses only notes from the whole-tone scale', correct: false },
          { label: 'It omits the root entirely', correct: false },
        ],
      },
      hint: 'An altered dominant keeps the root, 3rd, and b7 but chromatically alters the 5th (b5 or #5) and 9th (b9 or #9), creating maximum tension before resolution.',
      points: 1,
    },
    {
      id: 'l7u21m2e3',
      type: 'multiple_choice',
      prompt: 'In jazz harmony, what is the typical function of a sus4 chord (e.g., G7sus4)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It delays resolution by replacing the 3rd with a 4th, creating anticipation before V7', correct: true },
          { label: 'It always functions as a tonic chord', correct: false },
          { label: 'It acts as a substitute for the ii chord', correct: false },
          { label: 'It is used exclusively in modal jazz', correct: false },
        ],
      },
      hint: 'A sus4 chord replaces the 3rd with a 4th, removing the major/minor quality. In jazz, G7sus4 often precedes G7 in a V7sus4 to V7 to I resolution, delaying the leading tone.',
      points: 1,
    },
  ],

  // ---- l7u21m3: ii-V-I Progression ----
  l7u21m3: [
    {
      id: 'l7u21m3e1',
      type: 'chord_build',
      prompt: 'Build the ii7 chord in C major (Dm7). Select all 4 notes: D, F, A, C.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'minor7',
        noteCount: 4,
      },
      hint: 'Dm7 = D, F, A, C. Root (D), minor 3rd (F), perfect 5th (A), minor 7th (C). Pitch classes: 2, 5, 9, 0.',
      points: 2,
    },
    {
      id: 'l7u21m3e2',
      type: 'chord_build',
      prompt: 'Build the V7 chord in C major (G7). Select all 4 notes: G, B, D, F.',
      config: {
        type: 'chord_build',
        root: 'G',
        rootAccidental: '',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'G7 = G, B, D, F. Root (G), major 3rd (B), perfect 5th (D), minor 7th (F). Pitch classes: 7, 11, 2, 5.',
      points: 2,
    },
    {
      id: 'l7u21m3e3',
      type: 'multiple_choice',
      prompt: 'Why is the ii-V-I the most important progression in jazz?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It combines subdominant, dominant, and tonic functions in the strongest possible cadential motion', correct: true },
          { label: 'It was invented by Duke Ellington and became a jazz standard', correct: false },
          { label: 'It uses only three notes total across all three chords', correct: false },
          { label: 'It avoids any dissonance, making it easy to improvise over', correct: false },
        ],
      },
      hint: 'The ii-V-I encapsulates complete harmonic motion: preparation (ii), tension (V), resolution (I). Nearly every jazz standard contains multiple ii-V-I progressions in various keys.',
      points: 1,
    },
  ],

  // ---- l7u21m4: Tritone Substitution ----
  l7u21m4: [
    {
      id: 'l7u21m4e1',
      type: 'chord_build',
      prompt: 'Build the tritone substitution of G7: Db7. Select all 4 notes: Db, F, Ab, Cb.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: 'b',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'Db7 = Db, F, Ab, Cb. The tritone sub shares the same tritone interval (F-Cb enharmonic to F-B) as the original G7 chord. Pitch classes: 1, 5, 8, 11.',
      points: 2,
    },
    {
      id: 'l7u21m4e2',
      type: 'multiple_choice',
      prompt: 'What is the principle behind tritone substitution?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Two dominant 7th chords a tritone apart share the same 3rd and 7th (enharmonically), so one can replace the other', correct: true },
          { label: 'Any chord can be replaced by the chord a tritone away regardless of quality', correct: false },
          { label: 'The tritone sub always moves the root up by a whole step', correct: false },
          { label: 'It replaces the V chord with the IV chord', correct: false },
        ],
      },
      hint: 'G7 has B and F as its 3rd and 7th. Db7 has F and Cb (=B) as its 3rd and 7th. The guide tones are identical (enharmonically), so Db7 can resolve to C just like G7.',
      points: 1,
    },
    {
      id: 'l7u21m4e3',
      type: 'multiple_choice',
      prompt: 'In the progression Dm7 - Db7 - Cmaj7, what is the Db7 chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A tritone substitution for G7, creating a chromatic bass line (D - Db - C)', correct: true },
          { label: 'A borrowed chord from Db major', correct: false },
          { label: 'The Neapolitan chord in first inversion', correct: false },
          { label: 'A passing diminished chord respelled enharmonically', correct: false },
        ],
      },
      hint: 'Db7 replaces G7 (the V7). The bass descends chromatically: D (ii) - Db (tritone sub of V) - C (I). This smooth voice leading is one of the main benefits of tritone subs.',
      points: 1,
    },
  ],

  // ---- l7u21m5: Blues Forms ----
  l7u21m5: [
    {
      id: 'l7u21m5e1',
      type: 'multiple_choice',
      prompt: 'What is the standard chord progression for a basic 12-bar blues in the key of C?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'I7-I7-I7-I7 | IV7-IV7-I7-I7 | V7-IV7-I7-V7 (C7-F7-G7 form)', correct: true },
          { label: 'I-IV-V-I | I-IV-V-I | I-IV-V-I (simple three-chord repeated)', correct: false },
          { label: 'ii-V-I-vi | ii-V-I-vi | ii-V-I-vi (jazz turnaround repeated)', correct: false },
          { label: 'I-V-vi-IV | I-V-vi-IV | I-V-vi-IV (pop loop repeated)', correct: false },
        ],
      },
      hint: 'The 12-bar blues follows a specific pattern over 12 measures: 4 bars of I7, 2 bars of IV7, 2 bars of I7, then V7-IV7-I7-V7 (turnaround). All chords are dominant 7ths.',
      points: 1,
    },
    {
      id: 'l7u21m5e2',
      type: 'multiple_choice',
      prompt: 'Why does the I chord in blues use a dominant 7th quality (e.g., C7) instead of a major 7th?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Blues tonality uses the b7 as a blue note; the dominant 7th on every chord is a defining feature of the style', correct: true },
          { label: 'Because blues musicians did not know about major 7th chords', correct: false },
          { label: 'The dominant 7th is easier to play on guitar', correct: false },
          { label: 'It is a notational convention that does not affect the sound', correct: false },
        ],
      },
      hint: 'In blues, the b7 is part of the blues scale and the overall blues sound. Every chord — I, IV, and V — uses dominant 7th quality. This defies classical theory, where I7 would imply a secondary dominant.',
      points: 1,
    },
    {
      id: 'l7u21m5e3',
      type: 'multiple_choice',
      prompt: 'What is commonly added to the basic 12-bar blues to create a "jazz blues"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'ii-V turnarounds, tritone substitutions, and diminished passing chords', correct: true },
          { label: 'Only major 7th chords replace all dominant 7ths', correct: false },
          { label: 'A key change every 4 bars', correct: false },
          { label: 'Exclusively minor chords throughout', correct: false },
        ],
      },
      hint: 'Jazz blues enriches the basic form by inserting ii-V progressions (e.g., bars 9-10 become ii-V instead of just V-IV), adding tritone subs, and using quick ii-V turnarounds to create harmonic motion.',
      points: 1,
    },
  ],

  // ---- l7u21m6: Rhythm Changes ----
  l7u21m6: [
    {
      id: 'l7u21m6e1',
      type: 'multiple_choice',
      prompt: 'What is the form of "rhythm changes" in jazz?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'AABA — 32 bars with an 8-bar bridge', correct: true },
          { label: 'ABAB — alternating 8-bar sections', correct: false },
          { label: '12-bar blues repeated with variations', correct: false },
          { label: 'Through-composed with no repeating sections', correct: false },
        ],
      },
      hint: 'Rhythm changes follow a 32-bar AABA form: the A sections use I-vi-ii-V based progressions, and the B section (bridge) typically uses a cycle of dominants. Based on the chord changes to a famous Gershwin tune.',
      points: 1,
    },
    {
      id: 'l7u21m6e2',
      type: 'multiple_choice',
      prompt: 'What is a typical turnaround progression at the end of an A section in rhythm changes?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'I - vi - ii - V (or I - VI7 - ii - V7)', correct: true },
          { label: 'IV - V - I - I', correct: false },
          { label: 'I - IV - I - V', correct: false },
          { label: 'vi - IV - I - V', correct: false },
        ],
      },
      hint: 'The turnaround (I-vi-ii-V) cycles back to the top of the form. In jazz, the vi is often replaced with VI7 (a secondary dominant), and further embellished with tritone subs and passing chords.',
      points: 1,
    },
    {
      id: 'l7u21m6e3',
      type: 'multiple_choice',
      prompt: 'What harmonic device is commonly used in the bridge of rhythm changes?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A cycle of dominant 7th chords moving through a cycle of fifths (each resolving down a fifth to the next)', correct: true },
          { label: 'A sustained pedal note with no chord changes', correct: false },
          { label: 'An exact repeat of the A section in a different key', correct: false },
          { label: 'A twelve-tone serial row', correct: false },
        ],
      },
      hint: 'The bridge typically features a chain of dominant 7ths: III7-VI7-II7-V7 (in Bb: D7-G7-C7-F7). Each dominant resolves down a fifth to the next, creating strong forward motion.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 22: Advanced Jazz, Modal, Pop (5 modules)
  // =========================================================================

  // ---- l7u22m1: Chord-Scale Theory ----
  l7u22m1: [
    {
      id: 'l7u22m1e1',
      type: 'scale_build',
      prompt: 'Build D dorian — the chord-scale for Dm7 in a ii-V-I in C. Select all 7 notes.',
      config: {
        type: 'scale_build',
        root: 'D',
        rootAccidental: '',
        scaleType: 'dorian',
        noteCount: 7,
      },
      hint: 'D dorian: D, E, F, G, A, B, C. It is the 2nd mode of C major. The natural 6th (B) distinguishes it from natural minor (which has Bb). Pitch classes: 2, 4, 5, 7, 9, 11, 0.',
      points: 2,
    },
    {
      id: 'l7u22m1e2',
      type: 'scale_build',
      prompt: 'Build G mixolydian — the chord-scale for G7 in a ii-V-I in C. Select all 7 notes.',
      config: {
        type: 'scale_build',
        root: 'G',
        rootAccidental: '',
        scaleType: 'mixolydian',
        noteCount: 7,
      },
      hint: 'G mixolydian: G, A, B, C, D, E, F. It is the 5th mode of C major. The b7 (F instead of F#) defines the dominant sound. Pitch classes: 7, 9, 11, 0, 2, 4, 5.',
      points: 2,
    },
    {
      id: 'l7u22m1e3',
      type: 'multiple_choice',
      prompt: 'What is the fundamental principle of chord-scale theory?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each chord in a progression has a corresponding scale whose notes are all available for melody and improvisation', correct: true },
          { label: 'Every chord must only use notes from one fixed scale throughout a piece', correct: false },
          { label: 'Scales are built by stacking chords on top of each other', correct: false },
          { label: 'Chord-scale theory only applies to major keys', correct: false },
        ],
      },
      hint: 'Chord-scale theory matches each chord to a parent scale. Over Dm7, play D dorian; over G7, play G mixolydian; over Cmaj7, play C ionian. The scale changes with each chord.',
      points: 1,
    },
  ],

  // ---- l7u22m2: Upper Structures ----
  l7u22m2: [
    {
      id: 'l7u22m2e1',
      type: 'multiple_choice',
      prompt: 'What is an upper structure triad in jazz voicing?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A triad played in the upper register over a different root and 7th in the bass, producing extensions and alterations', correct: true },
          { label: 'The top three notes of any seventh chord', correct: false },
          { label: 'A triad played one octave higher than written', correct: false },
          { label: 'A structural analysis technique for identifying form', correct: false },
        ],
      },
      hint: 'Upper structures layer a simple triad (e.g., D major) over a bass note and 7th (e.g., C and Bb), creating complex extensions. D/C7 gives C7 with 9th, #11th, and 13th.',
      points: 1,
    },
    {
      id: 'l7u22m2e2',
      type: 'multiple_choice',
      prompt: 'What is reharmonization in jazz?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Replacing the original chords of a melody with different chords that still support the melody notes', correct: true },
          { label: 'Playing the same chords but in a different key', correct: false },
          { label: 'Adding harmony vocals to a solo melody', correct: false },
          { label: 'Removing all chords and playing the melody unaccompanied', correct: false },
        ],
      },
      hint: 'Reharmonization changes the harmonic context under a melody. Techniques include tritone substitution, chord quality changes, chromatic approaches, and constant structure movement.',
      points: 1,
    },
    {
      id: 'l7u22m2e3',
      type: 'multiple_choice',
      prompt: 'What is a chromatic bass line in jazz harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A bass line that moves by half steps, often achieved through inversions, passing chords, and tritone substitutions', correct: true },
          { label: 'A bass line that uses only the 12-tone chromatic scale with no repetition', correct: false },
          { label: 'A bass line that only plays on the chromatic notes (black keys)', correct: false },
          { label: 'A bass line that moves in contrary motion to the melody', correct: false },
        ],
      },
      hint: 'Chromatic bass motion creates smooth voice leading: e.g., C - B - Bb - A (Cmaj7 - B7 or G/B - Bb7 or C7/Bb - Am7). Each chord is chosen to support a half-step bass descent.',
      points: 1,
    },
  ],

  // ---- l7u22m3: Coltrane Changes ----
  l7u22m3: [
    {
      id: 'l7u22m3e1',
      type: 'multiple_choice',
      prompt: 'What key center movement defines "Coltrane changes" (as in Giant Steps)?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Key centers moving by major 3rds, dividing the octave into three equal parts', correct: true },
          { label: 'Key centers moving by minor 2nds chromatically', correct: false },
          { label: 'Key centers moving by perfect 5ths around the cycle', correct: false },
          { label: 'Key centers alternating between two keys a tritone apart', correct: false },
        ],
      },
      hint: 'Coltrane changes cycle through three key centers a major 3rd apart (e.g., B, G, Eb). These three keys divide the octave symmetrically into three equal segments of 4 semitones each.',
      points: 1,
    },
    {
      id: 'l7u22m3e2',
      type: 'multiple_choice',
      prompt: 'In Coltrane changes, how are the key centers typically approached?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Each key center is preceded by its own V7 chord, creating rapid ii-V or V-I motion', correct: true },
          { label: 'Key centers are connected by diminished passing chords only', correct: false },
          { label: 'Direct modulation without any preparation', correct: false },
          { label: 'Each key is approached by a deceptive cadence from the previous key', correct: false },
        ],
      },
      hint: 'Coltrane prepares each tonic with its dominant: e.g., Bmaj7 - D7 - Gmaj7 - Bb7 - Ebmaj7. The D7 is the V7 of G, Bb7 is the V7 of Eb. This creates constant dominant-tonic motion.',
      points: 1,
    },
    {
      id: 'l7u22m3e3',
      type: 'multiple_choice',
      prompt: 'What is "constant structure" in jazz harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Moving the same chord quality in parallel through a non-diatonic root pattern, maintaining voicing shape', correct: true },
          { label: 'Using the same chord for an entire song', correct: false },
          { label: 'A structural analysis method for identifying melodic motifs', correct: false },
          { label: 'Building all chords from the same four notes', correct: false },
        ],
      },
      hint: 'Constant structure moves a fixed chord type (e.g., maj7) through a sequence of roots (e.g., Cmaj7 - Ebmaj7 - Gbmaj7 - Amaj7). The voicing shape stays identical while the root pattern creates harmonic interest.',
      points: 1,
    },
  ],

  // ---- l7u22m4: Modal Harmony ----
  l7u22m4: [
    {
      id: 'l7u22m4e1',
      type: 'scale_build',
      prompt: 'Build the D dorian mode. This mode creates a minor sound with a characteristic natural 6th.',
      config: {
        type: 'scale_build',
        root: 'D',
        rootAccidental: '',
        scaleType: 'dorian',
        noteCount: 7,
      },
      hint: 'D dorian: D, E, F, G, A, B, C. Compared to D natural minor, the 6th degree is raised (B natural instead of Bb). Pitch classes: 2, 4, 5, 7, 9, 11, 0.',
      points: 2,
    },
    {
      id: 'l7u22m4e2',
      type: 'scale_build',
      prompt: 'Build the E phrygian mode. This mode has a distinctive half step from the root to the 2nd degree.',
      config: {
        type: 'scale_build',
        root: 'E',
        rootAccidental: '',
        scaleType: 'phrygian',
        noteCount: 7,
      },
      hint: 'E phrygian: E, F, G, A, B, C, D. The b2 (F natural, a half step above E) gives phrygian its dark, Spanish-flavored character. Pitch classes: 4, 5, 7, 9, 11, 0, 2.',
      points: 2,
    },
    {
      id: 'l7u22m4e3',
      type: 'multiple_choice',
      prompt: 'How does modal harmony differ from tonal (functional) harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Modal harmony emphasizes a static tonal center and avoids dominant-tonic resolution, letting the mode color define the sound', correct: true },
          { label: 'Modal harmony uses more chords than tonal harmony', correct: false },
          { label: 'Modal harmony always uses minor scales exclusively', correct: false },
          { label: 'There is no functional difference; they are interchangeable terms', correct: false },
        ],
      },
      hint: 'In tonal harmony, chords have functions (tonic, dominant, subdominant) that drive toward resolution. In modal harmony, one mode colors a static vamp or drone, and progressions avoid V-I cadences that would establish a key.',
      points: 1,
    },
  ],

  // ---- l7u22m5: Quartal/Quintal Voicings ----
  l7u22m5: [
    {
      id: 'l7u22m5e1',
      type: 'multiple_choice',
      prompt: 'What defines a quartal voicing?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Notes stacked in intervals of perfect 4ths instead of 3rds', correct: true },
          { label: 'A voicing that uses four notes from a seventh chord', correct: false },
          { label: 'A chord played in four different octaves simultaneously', correct: false },
          { label: 'A voicing technique exclusive to string quartets', correct: false },
        ],
      },
      hint: 'Quartal harmony stacks 4ths (e.g., C-F-Bb-Eb). This creates an ambiguous, open sound that avoids clear major/minor quality. McCoy Tyner popularized quartal voicings in modal jazz.',
      points: 1,
    },
    {
      id: 'l7u22m5e2',
      type: 'multiple_choice',
      prompt: 'How does quintal harmony differ from quartal harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Quintal harmony stacks perfect 5ths instead of 4ths, producing an equally open but slightly different sound', correct: true },
          { label: 'Quintal uses five notes while quartal uses four', correct: false },
          { label: 'Quintal is used in pop music while quartal is used in jazz', correct: false },
          { label: 'They are identical since a 4th inverted is a 5th', correct: false },
        ],
      },
      hint: 'While a 4th inverts to a 5th, the voicing sound differs based on register and spacing. Quintal voicings (e.g., C-G-D-A) create wide, bright sonorities. Both avoid traditional tertian (3rd-based) harmony.',
      points: 1,
    },
    {
      id: 'l7u22m5e3',
      type: 'multiple_choice',
      prompt: 'What role do drones play in modal and quartal harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'They anchor the tonal center, allowing modal colors to unfold without functional chord progressions', correct: true },
          { label: 'They provide rhythmic subdivision for the ensemble', correct: false },
          { label: 'They are only used in Indian classical music, not jazz', correct: false },
          { label: 'They create dominant function by sustaining the 5th of the key', correct: false },
        ],
      },
      hint: 'A drone (sustained bass note or open 5th) establishes a modal center. Over a D drone, you can freely explore D dorian, D mixolydian, or other modes without the harmony pulling toward resolution.',
      points: 1,
    },
  ],

  // =========================================================================
  // Unit 23: Pop Harmony and Taxonomy (5 modules)
  // =========================================================================

  // ---- l7u23m1: Pop Progressions ----
  l7u23m1: [
    {
      id: 'l7u23m1e1',
      type: 'multiple_choice',
      prompt: 'Which chord progression is often called the "four-chord pop loop"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'I - V - vi - IV', correct: true },
          { label: 'I - IV - V - I', correct: false },
          { label: 'ii - V - I - vi', correct: false },
          { label: 'I - bVII - IV - I', correct: false },
        ],
      },
      hint: 'I-V-vi-IV (in C: C-G-Am-F) is one of the most common pop progressions. It loops indefinitely and supports both uplifting and melancholic melodies depending on which chord the melody emphasizes.',
      points: 1,
    },
    {
      id: 'l7u23m1e2',
      type: 'multiple_choice',
      prompt: 'What is the Nashville number system?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A shorthand that uses Arabic numerals (1-7) for scale degrees, allowing instant transposition to any key', correct: true },
          { label: 'A method of counting bars in country music recordings', correct: false },
          { label: 'A tuning system developed in Nashville recording studios', correct: false },
          { label: 'A rhythm notation system for session drummers', correct: false },
        ],
      },
      hint: 'The Nashville number system writes chords as scale-degree numbers (1=I, 4=IV, 5=V). A chart reading "1-5-6m-4" can be played in any key instantly. It is used extensively in Nashville studio sessions.',
      points: 1,
    },
    {
      id: 'l7u23m1e3',
      type: 'multiple_choice',
      prompt: 'What is a "pop loop" and why is it effective?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A short repeating chord progression (usually 4 bars) that provides harmonic continuity while the melody and lyrics evolve', correct: true },
          { label: 'A digital audio loop sampled from an existing hit song', correct: false },
          { label: 'A specific production technique that repeats the chorus melody', correct: false },
          { label: 'A bass riff that cycles through all 12 notes', correct: false },
        ],
      },
      hint: 'Pop loops (like I-V-vi-IV or vi-IV-I-V) repeat a small harmonic pattern throughout a song. The static harmony lets melody, rhythm, and production carry the musical interest, which suits verse/chorus forms.',
      points: 1,
    },
  ],

  // ---- l7u23m2: Modal Mixture in Pop ----
  l7u23m2: [
    {
      id: 'l7u23m2e1',
      type: 'multiple_choice',
      prompt: 'When a pop song in a major key uses a bVII chord (e.g., Bb major in the key of C), what technique is being used?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Modal mixture (borrowing from the parallel minor/mixolydian mode)', correct: true },
          { label: 'A modulation to the key of Bb major', correct: false },
          { label: 'A secondary dominant targeting the IV chord', correct: false },
          { label: 'An enharmonic respelling of the vii diminished chord', correct: false },
        ],
      },
      hint: 'bVII is borrowed from C mixolydian or C natural minor. In C major, Bb is not diatonic, but borrowing it creates a rock/pop sound. This is modal mixture (also called modal interchange or borrowed chords).',
      points: 1,
    },
    {
      id: 'l7u23m2e2',
      type: 'multiple_choice',
      prompt: 'What emotional effect does a chromatic mediant relationship (e.g., C major to Ab major) typically create in pop music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A dramatic, cinematic shift in color — unexpected but smooth due to shared or closely related tones', correct: true },
          { label: 'A sense of returning home to the tonic', correct: false },
          { label: 'No noticeable effect since the chords are closely related', correct: false },
          { label: 'A dissonant clash that sounds like a mistake', correct: false },
        ],
      },
      hint: 'C major (C, E, G) and Ab major (Ab, C, Eb) share one common tone (C). The E and Eb are a half step apart, creating the smooth color shift characteristic of chromatic mediants.',
      points: 1,
    },
    {
      id: 'l7u23m2e3',
      type: 'multiple_choice',
      prompt: 'What is a direct (or abrupt) modulation in pop songwriting?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Changing key without any pivot chord or preparation — the new key simply starts', correct: true },
          { label: 'A gradual key change that takes several measures to complete', correct: false },
          { label: 'A modulation that always moves up by a half step', correct: false },
          { label: 'Using a ii-V-I to smoothly transition between keys', correct: false },
        ],
      },
      hint: 'Direct modulation (also called abrupt or phrase modulation) simply starts a new section in the new key with no harmonic preparation. Common in pop: the final chorus jumps up a half step or whole step for energy.',
      points: 1,
    },
  ],

  // ---- l7u23m3: Melodic Minor Modes ----
  l7u23m3: [
    {
      id: 'l7u23m3e1',
      type: 'scale_build',
      prompt: 'Build the C melodic minor scale (ascending form). Select all 7 notes.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'melodic_minor',
        noteCount: 7,
      },
      hint: 'C melodic minor: C, D, Eb, F, G, A, B. It is like C major with a b3. The natural 6th (A) and natural 7th (B) distinguish it from natural and harmonic minor. Pitch classes: 0, 2, 3, 5, 7, 9, 11.',
      points: 2,
    },
    {
      id: 'l7u23m3e2',
      type: 'scale_build',
      prompt: 'Build the G altered scale (7th mode of Ab melodic minor). Select all 7 notes.',
      config: {
        type: 'scale_build',
        root: 'G',
        rootAccidental: '',
        scaleType: 'altered',
        noteCount: 7,
      },
      hint: 'G altered (superlocrian): G, Ab, Bb, Cb, Db, Eb, F. Every non-essential tone is altered: b9, #9 (=b3), b5 (#11), b13 (#5). Pitch classes: 7, 8, 10, 11, 1, 3, 5.',
      points: 2,
    },
    {
      id: 'l7u23m3e3',
      type: 'multiple_choice',
      prompt: 'The lydian dominant scale (4th mode of melodic minor) is commonly used over which chord type?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Dominant 7th chords with a #11, especially tritone substitutions and non-resolving dominants', correct: true },
          { label: 'Minor 7th chords in a ii-V-I', correct: false },
          { label: 'Major 7th chords functioning as tonic', correct: false },
          { label: 'Diminished 7th passing chords', correct: false },
        ],
      },
      hint: 'Lydian dominant (e.g., C D E F# G A Bb) combines a #4 (lydian) with a b7 (dominant). It fits dominant 7(#11) chords and is the go-to scale for tritone substitution chords.',
      points: 1,
    },
  ],

  // ---- l7u23m4: Harmonic Minor Modes/Symmetric/World ----
  l7u23m4: [
    {
      id: 'l7u23m4e1',
      type: 'scale_build',
      prompt: 'Build the C whole-tone scale. This 6-note symmetric scale has equal whole-step intervals throughout.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'whole_tone',
        noteCount: 6,
      },
      hint: 'C whole tone: C, D, E, F#, G#, A#. Every interval is a whole step (2 semitones). Only two whole-tone scales exist (the other starts on Db). Pitch classes: 0, 2, 4, 6, 8, 10.',
      points: 2,
    },
    {
      id: 'l7u23m4e2',
      type: 'scale_build',
      prompt: 'Build the C diminished half-whole scale. This 8-note symmetric scale alternates half and whole steps.',
      config: {
        type: 'scale_build',
        root: 'C',
        rootAccidental: '',
        scaleType: 'diminished_half_whole',
        noteCount: 8,
      },
      hint: 'C diminished half-whole: C, Db, Eb, E, F#, G, A, Bb. It alternates half step, whole step throughout. Only three distinct diminished scales exist. Pitch classes: 0, 1, 3, 4, 6, 7, 9, 10.',
      points: 2,
    },
    {
      id: 'l7u23m4e3',
      type: 'multiple_choice',
      prompt: 'What is the defining property of a symmetric scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It divides the octave into equal segments using a repeating interval pattern, producing limited transpositions', correct: true },
          { label: 'It has the same ascending and descending form', correct: false },
          { label: 'It contains exactly 7 notes like diatonic scales', correct: false },
          { label: 'It sounds the same played forward or backward', correct: false },
        ],
      },
      hint: 'Symmetric scales repeat a fixed interval pattern (e.g., whole tone = W-W-W-W-W-W; diminished = H-W-H-W-H-W-H-W). This symmetry means they have fewer unique transpositions than asymmetric scales.',
      points: 1,
    },
  ],

  // ---- l7u23m5: Complete Chord Taxonomy ----
  l7u23m5: [
    {
      id: 'l7u23m5e1',
      type: 'multiple_choice',
      prompt: 'How many basic triad types exist in Western music theory?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: '4 — major, minor, diminished, and augmented', correct: true },
          { label: '2 — major and minor only', correct: false },
          { label: '3 — major, minor, and diminished', correct: false },
          { label: '7 — one for each scale degree', correct: false },
        ],
      },
      hint: 'There are exactly 4 triad types, defined by their 3rd and 5th: major (M3+P5), minor (m3+P5), diminished (m3+dim5), and augmented (M3+aug5). All other triadic labels are variants of these four.',
      points: 1,
    },
    {
      id: 'l7u23m5e2',
      type: 'multiple_choice',
      prompt: 'What makes a chord an "extended" chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It includes notes beyond the 7th — the 9th, 11th, or 13th — built by continuing to stack 3rds', correct: true },
          { label: 'It uses more than 4 notes from any source', correct: false },
          { label: 'It spans more than one octave on the instrument', correct: false },
          { label: 'It adds chromatic notes not found in the parent scale', correct: false },
        ],
      },
      hint: 'Extended chords continue the tertian (3rd-stacking) principle past the 7th: 9th = octave + 2nd, 11th = octave + 4th, 13th = octave + 6th. A 13th chord theoretically contains all 7 scale degrees.',
      points: 1,
    },
    {
      id: 'l7u23m5e3',
      type: 'multiple_choice',
      prompt: 'Which grouping correctly organizes the main chord quality families?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Major family (maj, maj7, maj9), minor family (m, m7, m9), dominant family (7, 9, 13), diminished family (dim, dim7), augmented family (aug, aug7)', correct: true },
          { label: 'Consonant chords (major, minor) and dissonant chords (all 7th chords and beyond)', correct: false },
          { label: 'Diatonic family (I, ii, iii, IV, V, vi) and chromatic family (everything else)', correct: false },
          { label: 'Simple chords (triads) and complex chords (anything with more than 3 notes)', correct: false },
        ],
      },
      hint: 'Chord quality families group chords by their core sound: the major family has a major 3rd and major 7th; the dominant family has a major 3rd and minor 7th; the minor family has a minor 3rd. Extensions expand each family.',
      points: 1,
    },
  ],
};

export default exercises;
