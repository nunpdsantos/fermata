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
    },
    {
      id: 'l7u21m1e3',
      type: 'multiple_choice',
      prompt: 'In jazz chord symbols, what does "alt" (as in G7alt) indicate?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "A dominant whose fifth or ninth has been raised or lowered", correct: true },
          { label: "A dominant whose third has been replaced by the fourth", correct: false },
          { label: "A dominant whose seventh has been raised to a major seventh", correct: false },
          { label: "A dominant whose root has been removed from the voicing", correct: false },
        ],
      },
      hint: 'The "alt" suffix means the chord has altered extensions: b9, #9, b5 (or #11), and #5 (or b13). It is paired with the altered (superlocrian) scale.',
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
          { label: "Root, 3rd, and 5th only — omitting the 7th and extensions", correct: false },
          { label: "Root, 5th, and 7th only — omitting the 3rd and extensions", correct: false },
          { label: "Root, 5th, and 9th only — omitting the 3rd and 7th", correct: false },
        ],
      },
      hint: 'Shell voicings strip a chord to its essentials: root defines the bass, 3rd determines major/minor quality, and 7th determines the chord type (maj7, dom7, m7). In those chords the perfect 5th is redundant; in m7b5 and dim7 chords the flatted 5th is what defines the chord, so it stays.',
    },
    {
      id: 'l7u21m2e2',
      type: 'multiple_choice',
      prompt: 'What is the defining characteristic of an altered dominant chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It always has a dominant 7th with one or more chromatically altered 5ths or 9ths', correct: true },
          { label: 'It usually replaces the major 3rd with a suspended 4th', correct: false },
          { label: 'It raises the minor 7th to a major 7th', correct: false },
          { label: 'It is defined by leaving the root out of the voicing', correct: false },
        ],
      },
      hint: 'An altered dominant keeps the root, 3rd, and b7 but chromatically alters the 5th (b5 or #5) and/or 9th (b9 or #9), creating maximum tension before resolution.',
    },
    {
      id: 'l7u21m2e3',
      type: 'multiple_choice',
      prompt: 'How does G7sus4 delay resolution when it leads to G7?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'By replacing the 3rd with a 4th', correct: true },
          { label: 'By adding a 4th alongside the 3rd', correct: false },
          { label: 'By replacing the 5th with a 4th', correct: false },
          { label: 'By holding the 4th until it rises to the 5th', correct: false },
        ],
      },
      hint: 'A sus4 chord replaces the 3rd with a 4th, removing the major/minor quality. In jazz, G7sus4 often precedes G7 in a V7sus4 to V7 to I resolution, delaying the leading tone.',
    },
  ],

  // ---- l7u21m3: ii-V-I Progression ----
  l7u21m3: [
    {
      id: 'l7u21m3e1',
      type: 'chord_build',
      prompt: 'Build the ii7 chord in C major. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: '',
        quality: 'minor7',
        noteCount: 4,
      },
      hint: 'Dm7 = D, F, A, C. Root (D), minor 3rd (F), perfect 5th (A), minor 7th (C). Pitch classes: 2, 5, 9, 0.',
    },
    {
      id: 'l7u21m3e2',
      type: 'chord_build',
      prompt: 'Build the V7 chord in C major. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'G',
        rootAccidental: '',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'G7 = G, B, D, F. Root (G), major 3rd (B), perfect 5th (D), minor 7th (F). Pitch classes: 7, 11, 2, 5.',
    },
    {
      id: 'l7u21m3e3',
      type: 'multiple_choice',
      prompt: 'Why is the ii-V-I the most important progression in jazz?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Preparation → tension → rest', correct: true },
          { label: 'Tension → rest → preparation', correct: false },
          { label: 'Rest → tension → preparation', correct: false },
          { label: 'Rest → preparation → tension', correct: false },
        ],
      },
      hint: 'The ii-V-I encapsulates complete harmonic motion: preparation (ii), tension (V), resolution (I). Nearly every jazz standard contains multiple ii-V-I progressions in various keys.',
    },
  ],

  // ---- l7u21m4: Tritone Substitution ----
  l7u21m4: [
    {
      id: 'l7u21m4e1',
      type: 'chord_build',
      prompt: 'Build the tritone substitution of G7. Select all 4 notes.',
      config: {
        type: 'chord_build',
        root: 'D',
        rootAccidental: 'b',
        quality: 'dominant7',
        noteCount: 4,
      },
      hint: 'Db7 = Db, F, Ab, Cb. The tritone sub shares the same tritone interval (F-Cb enharmonic to F-B) as the original G7 chord. Pitch classes: 1, 5, 8, 11.',
    },
    {
      id: 'l7u21m4e2',
      type: 'multiple_choice',
      prompt: 'What is the principle behind replacing a dominant seventh chord with another dominant seventh a tritone away?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Their thirds and sevenths are the same two pitch classes, with their roles exchanged", correct: true },
          { label: "Their roots and fifths are usually the same two pitch classes, with their roles exchanged", correct: false },
          { label: "Their thirds and sevenths move up a whole step, keeping the same roles in the new chord", correct: false },
          { label: 'Their roots are a tritone apart, and their fifths remain the same pitch class', correct: false },
        ],
      },
      hint: 'G7 has B and F as its 3rd and 7th. Db7 has F and Cb (=B) as its 3rd and 7th. The guide tones are identical (enharmonically), so Db7 can resolve to C just like G7.',
    },
    {
      id: 'l7u21m4e3',
      type: 'multiple_choice',
      prompt: 'In the progression Dm7 - Db7 - Cmaj7, what is the Db7 chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A tritone substitution for G7, so the bass line moves only by half steps from D to Db to C', correct: true },
          { label: 'A back-door dominant substitution, so the bass line moves only by half steps from D to Db to C', correct: false },
          { label: "A tritone substitution for D7, so the bass line moves only by half steps from D to Db to C", correct: false },
          { label: "A tritone substitution for F7, so the bass line moves only by half steps from D to Db to C", correct: false },
        ],
      },
      hint: 'Db7 replaces G7 (the V7). The bass descends chromatically: D (ii) - Db (tritone sub of V) - C (I). This smooth voice leading is one of the main benefits of tritone subs.',
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
          { label: "V7-V7-V7-V7 | IV7-IV7-V7-V7 | I7-IV7-V7-I7 (C7-F7-G7 form)", correct: false },
          { label: "IV7-IV7-IV7-IV7 | I7-I7-IV7-IV7 | V7-I7-IV7-V7 (C7-F7-G7 form)", correct: false },
          { label: "I7-I7-I7-I7 | V7-V7-I7-I7 | IV7-V7-I7-IV7 (C7-F7-G7 form)", correct: false },
        ],
      },
      hint: 'The 12-bar blues follows a specific pattern over 12 measures: 4 bars of I7, 2 bars of IV7, 2 bars of I7, then V7-IV7-I7-V7, whose last two bars (I7-V7) form the turnaround. All chords are dominant 7ths.',
    },
    {
      id: 'l7u21m5e2',
      type: 'multiple_choice',
      prompt: 'Why does the I chord in blues use a dominant 7th quality (e.g., C7) instead of a major 7th?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'The lowered seventh belongs to the blues sound even at rest, so C7 keeps Bb above its major third', correct: true },
          { label: 'The lowered seventh forces I7 to resolve to IV, so C7 can never end a blues', correct: false },
          { label: "The lowered seventh turns the blues tonic into a minor triad by changing E to Eb", correct: false },
          { label: "The lowered seventh removes the blues tonic's third, so C7 consists of C, G and Bb", correct: false },
        ],
      },
      hint: 'In blues, the b7 is part of the blues scale and the overall blues sound. Every chord — I, IV, and V — uses dominant 7th quality. This defies classical theory, where I7 would imply a secondary dominant.',
    },
    {
      id: 'l7u21m5e3',
      type: 'multiple_choice',
      prompt: 'What is commonly added to the basic 12-bar blues to create a "jazz blues"?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'ii-V turnarounds, tritone substitutions, and diminished passing chords', correct: true },
          { label: 'Minor-blues substitutions: minor 7th chords on I and IV, with bVI7 (Ab7) for V7', correct: false },
          { label: 'A key change every 4 bars, up a half step each time (C, Db, D…)', correct: false },
          { label: 'Exclusively minor chords throughout', correct: false },
        ],
      },
      hint: 'Jazz blues enriches the basic form by inserting ii-V progressions (e.g., bars 9-10 become ii-V instead of just V-IV), adding tritone subs, and using quick ii-V turnarounds to create harmonic motion.',
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
          { label: "AABA — 32 bars in four 8-bar sections", correct: true },
          { label: "ABAB — 32 bars in four 8-bar sections", correct: false },
          { label: "ABBA — 32 bars in four 8-bar sections", correct: false },
          { label: "ABAC — 32 bars in four 8-bar sections", correct: false },
        ],
      },
      hint: 'Rhythm changes follow a 32-bar AABA form: the A sections use I-vi-ii-V based progressions, and the B section (bridge) typically uses a cycle of dominants. Based on the chord changes to a famous Gershwin tune.',
    },
    {
      id: 'l7u21m6e2',
      type: 'multiple_choice',
      prompt: 'What is a typical turnaround progression at the end of an A section in rhythm changes?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'I–vi–ii–V', correct: true },
          { label: 'ii–V–I–V', correct: false },
          { label: 'IV–I–V–I', correct: false },
          { label: 'I–V–vi–IV', correct: false },
        ],
      },
      hint: 'The turnaround (I-vi-ii-V) cycles back to the top of the form. In jazz, the vi is often replaced with VI7 (a secondary dominant), and further embellished with tritone subs and passing chords.',
    },
    {
      id: 'l7u21m6e3',
      type: 'multiple_choice',
      prompt: 'Which dominant-seventh chain is typical in the bridge of rhythm changes in Bb major?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'D7–G7–C7–F7', correct: true },
          { label: 'D7–C7–F7–G7', correct: false },
          { label: 'D7–F7–C7–G7', correct: false },
          { label: 'D7–F7–G7–C7', correct: false },
        ],
      },
      hint: 'The bridge typically features a chain of dominant 7ths: III7-VI7-II7-V7 (in Bb: D7-G7-C7-F7). Each dominant resolves down a fifth to the next, creating strong forward motion.',
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
    },
    {
      id: 'l7u22m1e3',
      type: 'multiple_choice',
      prompt: 'What is the fundamental principle of chord-scale theory?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Match the melody scale to the currently sounding chord', correct: true },
          { label: 'Keep the melody scale fixed by the initial key signature', correct: false },
          { label: 'Build the melody scale from the next three chord roots', correct: false },
          { label: 'Use the major scale on every chord root, including minor chords', correct: false },
        ],
      },
      hint: 'Chord-scale theory matches each chord to a scale (often a mode). Over Dm7, play D dorian; over G7, play G mixolydian; over Cmaj7, play C ionian. The scale changes with each chord.',
    },
  ],

  // ---- l7u22m2: Upper Structures ----
  l7u22m2: [
    {
      id: 'l7u22m2e1',
      type: 'multiple_choice',
      prompt: 'Which voicing illustrates an upper-structure triad for C7?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'D–F#–A above C–E–Bb', correct: true },
          { label: 'C–E–G above C–E–Bb', correct: false },
          { label: 'E–G–Bb above C–E–Bb', correct: false },
          { label: 'E–G–B above C–E–Bb', correct: false },
        ],
      },
      hint: 'Upper structures layer a simple triad (e.g., D major) over the dominant’s shell (root, 3rd and b7; e.g., C, E and Bb), creating complex extensions. D/C7 gives C7 with 9th, #11th, and 13th.',
    },
    {
      id: 'l7u22m2e2',
      type: 'multiple_choice',
      prompt: 'What is reharmonization in jazz?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Giving the same tune a different set of supporting chords", correct: true },
          { label: "Giving the same chords a different tune above them", correct: false },
          { label: "Moving the tune and all its chords into another key", correct: false },
          { label: "Moving each chord into another inversion under the tune", correct: false },
        ],
      },
      hint: 'Reharmonization changes the harmonic context under a melody. Techniques include tritone substitution, chord quality changes, chromatic approaches, and constant structure movement.',
    },
    {
      id: 'l7u22m2e3',
      type: 'multiple_choice',
      prompt: 'What is a chromatic bass line in jazz harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A bass line moving by half steps, often through inversions, passing chords and tritone subs', correct: true },
          { label: "A bass line moving by whole steps, often through inversions, passing chords and tritone subs", correct: false },
          { label: "A bass line moving by minor thirds, often through inversions, passing chords and tritone subs", correct: false },
          { label: "A bass line moving by perfect fifths, often through inversions, passing chords and tritone subs", correct: false },
        ],
      },
      hint: 'Chromatic bass motion creates smooth voice leading: e.g., C - B - Bb - A (Cmaj7 - B7 or G/B - Bb7 or C7/Bb - Am7). Each chord is chosen to support a half-step bass descent.',
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
          { label: "Three equally spaced tonal homes, a major third from one to the next", correct: true },
          { label: "Four equally spaced tonal homes, a minor third from one to the next", correct: false },
          { label: "Two equally spaced tonal homes, a tritone from one to the next", correct: false },
          { label: "Six equally spaced tonal homes, a whole step from one to the next", correct: false },
        ],
      },
      hint: 'Coltrane changes cycle through three key centers a major 3rd apart (e.g., B, G, Eb). These three keys divide the octave symmetrically into three equal segments of 4 semitones each.',
    },
    {
      id: 'l7u22m3e2',
      type: 'multiple_choice',
      prompt: 'In Coltrane changes, how are the key centers typically approached?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'By a dominant 7th a perfect fifth above the tonic', correct: true },
          { label: 'By a dominant 7th a major third above the tonic', correct: false },
          { label: 'By a major 7th a perfect fifth above the tonic', correct: false },
          { label: 'By a major 7th a major third above the tonic', correct: false },
        ],
      },
      hint: 'Coltrane prepares each tonic with its dominant: e.g., Bmaj7 - D7 - Gmaj7 - Bb7 - Ebmaj7. The D7 is the V7 of G, Bb7 is the V7 of Eb. This creates constant dominant-tonic motion.',
    },
    {
      id: 'l7u22m3e3',
      type: 'multiple_choice',
      prompt: 'What is "constant structure" in jazz harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Keeping the same chord shape while shifting it outside the key", correct: true },
          { label: "Keeping the same bass note while changing the chords above it", correct: false },
          { label: "Keeping the same key while changing the chord qualities inside it", correct: false },
          { label: "Keeping the same melody while replacing its accompanying chords", correct: false },
        ],
      },
      hint: 'Constant structure moves a fixed chord type (e.g., maj7) through a sequence of roots (e.g., Cmaj7 - Ebmaj7 - Gbmaj7 - Amaj7). The voicing shape stays identical while the root pattern creates harmonic interest.',
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
    },
    {
      id: 'l7u22m4e3',
      type: 'multiple_choice',
      prompt: 'How does modal harmony differ from tonal (functional) harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Modal harmony keeps a static center and avoids V-I resolution, letting the mode\'s color define the sound', correct: true },
          { label: "Modal harmony uses more chords than tonal harmony — all seven, one for each degree's mode", correct: false },
          { label: 'Modal harmony always uses minor scales exclusively', correct: false },
          { label: "Modal harmony relies on strong V-I resolution, like tonal harmony, but uses the mode's own color", correct: false },
        ],
      },
      hint: 'In tonal harmony, chords have functions (tonic, dominant, subdominant) that drive toward resolution. In modal harmony, one mode colors a static vamp or drone, and progressions avoid V-I cadences that would establish a key.',
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
          { label: 'Notes stacked in perfect 4ths instead of 3rds', correct: true },
          { label: "Notes stacked in perfect 5ths instead of 3rds", correct: false },
          { label: "Notes stacked in major 3rds instead of 4ths", correct: false },
          { label: "Notes stacked in minor 2nds instead of 3rds", correct: false },
        ],
      },
      hint: 'Quartal harmony stacks 4ths (e.g., C-F-Bb-Eb). This creates an ambiguous, open sound that avoids clear major/minor quality. McCoy Tyner popularized quartal voicings in modal jazz.',
    },
    {
      id: 'l7u22m5e2',
      type: 'multiple_choice',
      prompt: 'How does quintal harmony differ from quartal harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Quintal harmony stacks perfect 5ths instead of 4ths, an equally open sound', correct: true },
          { label: "Quintal harmony stacks perfect 4ths instead of 5ths, an equally open sound", correct: false },
          { label: "Quintal harmony stacks major 3rds instead of minor 3rds, an equally open sound", correct: false },
          { label: "Quintal harmony stacks minor 3rds instead of perfect 4ths, an equally open sound", correct: false },
        ],
      },
      hint: 'While a 4th inverts to a 5th, the voicing sound differs based on register and spacing. Quintal voicings (e.g., C-G-D-A) create wide, bright sonorities. Both avoid traditional tertian (3rd-based) harmony.',
    },
    {
      id: 'l7u22m5e3',
      type: 'multiple_choice',
      prompt: 'What role do drones play in modal and quartal harmony?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "They keep one pitch in your ear while the colors above it can change", correct: true },
          { label: "They usually mark subdivisions of the beat without sustaining a stable pitch center", correct: false },
          { label: "They move the tonal center up by a semitone whenever the chord above changes", correct: false },
          { label: "They sharpen the leading tone by sustaining the tonic, making the mode major", correct: false },
        ],
      },
      hint: 'A drone (sustained bass note or open 5th) establishes a modal center. Over a D drone, you can freely explore D dorian, D mixolydian, or other modes without the harmony pulling toward resolution.',
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
      nudge: 'Play each option in C and listen. The loop uses four different chords, all from the key, and starts on the tonic: which pattern have you heard in countless pop songs?',
    },
    {
      id: 'l7u23m1e2',
      type: 'multiple_choice',
      prompt: 'What is the Nashville number system?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Numbers tell the band where each chord sits in the key, so 4 means the chord built on the fourth scale degree', correct: true },
          { label: "Numbers tell the band how many beats each chord lasts, so 4 means a chord lasting four beats", correct: false },
          { label: "Numbers usually tell the guitarist which fret to play, so 1 means the first fret in every key", correct: false },
          { label: "Numbers measure semitones above the tonic, so 4 means the chord rooted a major third above it", correct: false },
        ],
      },
      hint: 'The Nashville number system writes chords as scale-degree numbers (1=I, 4=IV, 5=V). A chart reading "1-5-6m-4" can be played in any key instantly. It is used extensively in Nashville studio sessions.',
    },
    {
      id: 'l7u23m1e3',
      type: 'multiple_choice',
      prompt: 'What is a "pop loop" and why is it effective?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A short repeating progression that keeps the harmony steady while melody and lyrics change', correct: true },
          { label: "A short repeating melody that keeps the tune steady while the underlying chord progression changes", correct: false },
          { label: "A short chord progression that changes its sequence on each return to follow the changing lyrics", correct: false },
          { label: "A short repeating bass pattern beneath chord progressions that change instead of repeating", correct: false },
        ],
      },
      hint: 'Pop loops (like I-V-vi-IV or vi-IV-I-V) repeat a small harmonic pattern throughout a song. The static harmony lets melody, rhythm, and production carry the musical interest, which suits verse/chorus forms.',
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
          { label: 'An enharmonic respelling of the vii° chord of C major, B diminished, written as Bb', correct: false },
        ],
      },
      hint: 'bVII is borrowed from C mixolydian or C natural minor. In C major, Bb is not diatonic, but borrowing it creates a rock/pop sound. This is modal mixture (also called modal interchange or borrowed chords).',
    },
    {
      id: 'l7u23m2e2',
      type: 'multiple_choice',
      prompt: 'What emotional effect does a chromatic mediant relationship (e.g., C major to Ab major) typically create in pop music?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'A dramatic, cinematic shift in color — unexpected, yet smooth thanks to a shared tone', correct: true },
          { label: 'A sense of returning home to the tonic', correct: false },
          { label: 'No noticeable effect at all, since the two chords belong to the same key and sound alike', correct: false },
          { label: 'A dissonant clash that sounds like a mistake', correct: false },
        ],
      },
      hint: 'C major (C, E, G) and Ab major (Ab, C, Eb) share one common tone (C). The E and Eb are a half step apart, creating the smooth color shift characteristic of chromatic mediants.',
    },
    {
      id: 'l7u23m2e3',
      type: 'multiple_choice',
      prompt: 'What is a direct (or abrupt) modulation in pop songwriting?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "Changing to another key without a connecting chord", correct: true },
          { label: "Changing to another key through a pivot chord shared by both keys", correct: false },
          { label: 'Changing to another key gradually, through a sequence that passes through several keys', correct: false },
          { label: 'Changing to another key without a pivot chord, but always exactly one half step higher', correct: false },
        ],
      },
      hint: 'Direct modulation (also called abrupt or phrase modulation) simply starts a new section in the new key with no harmonic preparation. Common in pop: the final chorus jumps up a half step or whole step for energy.',
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
    },
    {
      id: 'l7u23m3e3',
      type: 'multiple_choice',
      prompt: 'The lydian dominant scale (4th mode of melodic minor) is commonly used over which chord type?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Dominant 7th chords with a #11, such as tritone subs and non-resolving dominants', correct: true },
          { label: 'Minor 7th chords in a ii-V-I, since the Lydian dominant scale contains a minor 3rd (b3)', correct: false },
          { label: 'Major 7th chords functioning as tonic', correct: false },
          { label: 'Diminished 7th passing chords', correct: false },
        ],
      },
      hint: 'Lydian dominant (e.g., C D E F# G A Bb) combines a #4 (lydian) with a b7 (dominant). It fits dominant 7(#11) chords and is the go-to scale for tritone substitution chords.',
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
    },
    {
      id: 'l7u23m4e3',
      type: 'multiple_choice',
      prompt: 'What is the defining property of a symmetric scale?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: "A repeating spacing pattern partitions the octave equally", correct: true },
          { label: "A repeating spacing pattern produces twelve distinct transpositions", correct: false },
          { label: "A repeating spacing pattern requires seven notes per octave", correct: false },
          { label: "A repeating spacing pattern needs two octaves before repeating", correct: false },
        ],
      },
      hint: 'Symmetric scales repeat a fixed interval pattern (e.g., whole tone = W-W-W-W-W-W; diminished = H-W-H-W-H-W-H-W). This symmetry means they have fewer unique transpositions than asymmetric scales.',
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
          { label: '7 — one triad type for each degree of the scale', correct: false },
        ],
      },
      hint: 'There are exactly 4 triad types, defined by their 3rd and 5th: major (M3+P5), minor (m3+P5), diminished (m3+dim5), and augmented (M3+aug5). All other triadic labels are variants of these four.',
    },
    {
      id: 'l7u23m5e2',
      type: 'multiple_choice',
      prompt: 'What makes a chord an "extended" chord?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'It has notes beyond the 7th (9th, 11th or 13th), built by stacking more 3rds', correct: true },
          { label: "It has added tones above a triad (6th, 9th or both), without including a 7th", correct: false },
          { label: "It has substitutions for the 3rd (2nd or 4th), forming a suspension within the chord", correct: false },
          { label: "It has octave doublings of chord tones (root, 3rd, 5th or 7th), with no added pitch classes", correct: false },
        ],
      },
      hint: 'Extended chords continue the tertian (3rd-stacking) principle past the 7th: 9th = octave + 2nd, 11th = octave + 4th, 13th = octave + 6th. A 13th chord theoretically contains all 7 scale degrees.',
    },
    {
      id: 'l7u23m5e3',
      type: 'multiple_choice',
      prompt: 'Which grouping correctly organizes the main chord quality families?',
      config: {
        type: 'multiple_choice',
        choices: [
          { label: 'Major, minor, dominant, diminished and augmented, each with its 7th and extended forms', correct: true },
          { label: 'Triads, sevenths, ninths, elevenths and thirteenths, each with its different qualities', correct: false },
          { label: 'Tonic, predominant, dominant, tonic substitute and dominant substitute, each with its different voicings', correct: false },
          { label: 'Diatonic, borrowed, secondary, chromatic-mediant and enharmonic chords, each with its different origins', correct: false },
        ],
      },
      hint: 'Chord families are distinguished by their core intervals: major has a major 3rd and perfect 5th (a major 7th in maj7); dominant seventh has a major 3rd and minor 7th; minor has a minor 3rd and perfect 5th; diminished has a minor 3rd and diminished 5th; augmented has a major 3rd and augmented 5th. Seventh chords and extensions expand these families.',
    },
  ],
};

export default exercises;
