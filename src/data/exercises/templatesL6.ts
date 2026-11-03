import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 6 Templates — 12 modules
// Focus: Neapolitan chord, augmented sixths, enharmonic modulation,
//        advanced counterpoint
//
// W4a (2026-10-31): blocks re-keyed to the modules whose lessons teach them
// (chromatic mediants → l6u19m3, equal division of the octave → l6u19m4,
// triple counterpoint → l6u20m3); new templates for species 1–3, species
// 4–5 and part writing / score reading; parsimonious voice leading and
// quadruple counterpoint dropped (no lesson teaches them). Questions are
// worded as statements about a named topic (nothing on screen to point at),
// and options are balanced so the right one is not simply the longest.
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 18: Chromatic Harmony — Neapolitan and Augmented Sixths
  // =========================================================================

  // ---- l6u18m1: Neapolitan Chord bII ----
  {
    moduleId: 'l6u18m1',
    templates: [
      {
        // The Neapolitan of a minor key is the major triad on its lowered 2nd
        // degree, spelled on the letter above the tonic (C minor → Db, not C#).
        type: 'chord_build',
        promptTemplate: 'Build the Neapolitan chord (bII) of {key} minor.',
        hintTemplate: 'The Neapolitan is the major triad on the lowered 2nd degree: in {key} minor that is {root} major (root, major 3rd, perfect 5th).',
        params: {
          roots: ['D', 'E', 'A', 'G', 'C', 'F'],
          accidentals: ['b', 'b', 'b', 'b', 'b', ''],
          keys: ['C', 'D', 'G', 'F', 'Bb', 'E'],
          chordQualities: ['major'],
          noteCounts: [3],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about how the Neapolitan chord functions is true?',
        hintTemplate: 'The Neapolitan (bII or N6) is a pre-dominant chord that resolves to V (often via a cadential 6/4). It is almost always in first inversion.',
        params: {
          choiceSets: [
            [
          { label: 'Normally a pre-dominant that prepares V', correct: true },
          { label: 'Normally a dominant that resolves to I', correct: false },
          { label: 'Normally a tonic substitute that closes a phrase', correct: false },
          { label: 'Normally a passing harmony that links inversions of I', correct: false },
        ],
          ],
        },
      },
      {
        // One question per key: the keyed answer names the chord asked for (W4-26).
        type: 'multiple_choice',
        promptTemplate: 'Which option gives the correct Neapolitan chord (bII) of the minor key it names?',
        hintTemplate: 'The Neapolitan is the major triad on the lowered 2nd degree of the minor key: a half step above the tonic, spelled on the next letter.',
        params: {
          choiceSets: [
            [
              { label: 'In C minor: Db major (Db-F-Ab)', correct: true },
              { label: 'In C minor: D major (D-F#-A)', correct: false },
              { label: 'In C minor: Eb major (Eb-G-Bb)', correct: false },
              { label: 'In C minor: B major (B-D#-F#)', correct: false },
            ],
            [
              { label: 'In A minor: Bb major (Bb-D-F)', correct: true },
              { label: 'In A minor: B major (B-D#-F#)', correct: false },
              { label: 'In A minor: Bb minor (Bb-Db-F)', correct: false },
              { label: 'In A minor: C major (C-E-G)', correct: false },
            ],
            [
              { label: 'In E minor: F major (F-A-C)', correct: true },
              { label: 'In E minor: F# major (F#-A#-C#)', correct: false },
              { label: 'In E minor: D major (D-F#-A)', correct: false },
              { label: 'In E minor: F minor (F-Ab-C)', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u18m2: Italian/French Augmented 6th ----
  {
    moduleId: 'l6u18m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the Italian and French augmented sixth chords is true?',
        hintTemplate: 'Italian Aug6: b6, 1, #4 (3 notes). French Aug6: b6, 1, 2, #4 (4 notes, includes the 2nd). Both resolve to V with the outer voices expanding to an octave.',
        params: {
          choiceSets: [
            [
              { label: 'The Italian sixth has three notes: b6, 1 and #4', correct: true },
              { label: "The Italian sixth has three notes: 6, 1 and #4", correct: false },
              { label: "The Italian sixth has three notes: b3, 1 and #4", correct: false },
              { label: "The Italian sixth has three notes: b7, 1 and #4", correct: false },
            ],
            [
              { label: 'The French sixth adds degree 2 to the Italian', correct: true },
              { label: "The French sixth adds degree b3 to the Italian", correct: false },
              { label: "The French sixth adds degree 5 to the Italian", correct: false },
              { label: "The French sixth adds degree b7 to the Italian", correct: false },
            ],
            [
          { label: 'In D minor, Bb3–G#4 normally resolves to A3–A4', correct: true },
          { label: 'In D minor, Bb3–G#4 normally resolves to D3–D4', correct: false },
          { label: 'In D minor, Bb3–G#4 normally resolves to A3–A3', correct: false },
          { label: 'In D minor, Bb3–G#4 normally resolves to D3–D3', correct: false },
        ],
            [
              { label: 'In C minor, Ab3–F#4 normally resolves to G3–G4', correct: true },
              { label: 'In C minor, Ab3–F#4 normally resolves to A3–E4', correct: false },
              { label: 'In C minor, Ab3–F#4 normally resolves to F3–A4', correct: false },
              { label: 'In C minor, Ab3–F#4 normally resolves to G3–F#4', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u18m3: German Augmented 6th ----
  {
    moduleId: 'l6u18m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the German augmented sixth chord is true?',
        hintTemplate: 'German Aug6: b6, 1, b3, #4 (4 notes, includes the minor 3rd). Resolves to a cadential 6/4 to avoid parallel 5ths, then to V.',
        params: {
          choiceSets: [
            [
              { label: 'The German sixth contains b6, 1, b3 and #4', correct: true },
              { label: "The German sixth contains b6, 1, 3 and #4", correct: false },
              { label: "The German sixth contains b6, 1, b3 and 4", correct: false },
              { label: "The German sixth contains b6, 1, 3 and 4", correct: false },
            ],
            [
              { label: 'It usually moves to a cadential 6/4 first, avoiding parallel 5ths with V', correct: true },
              { label: 'It usually moves straight to root-position V, which is how it avoids parallel 5ths', correct: false },
              { label: 'It usually moves to a cadential 6/4 first, avoiding parallel octaves with I', correct: false },
              { label: 'It usually resolves straight to the tonic I, skipping the dominant', correct: false },
            ],
            [
              { label: 'It is enharmonically equivalent to a dominant 7th chord', correct: true },
              { label: 'It is enharmonically equivalent to a minor 7th chord', correct: false },
              { label: 'It is enharmonically equivalent to a diminished 7th chord', correct: false },
              { label: 'It is enharmonically equivalent to a major 7th chord', correct: false },
            ],
          ],
        },
      },
      {
        // The German sixth of a minor key sits on b6 (C minor → Ab, five letters
        // up): b6–1–b3–#4 (Ab C Eb F#) sounds exactly as the dominant 7th on b6
        // (Ab7), so it is graded by those pitch classes.
        type: 'chord_build',
        promptTemplate: 'Build the German augmented sixth chord of {key} minor.',
        hintTemplate: 'In {key} minor the German sixth is b6–1–b3–#4, built on {root}: {spelling}. It sounds exactly like {root}7, but its top note is spelled as an augmented 6th above {root}, not a minor 7th.',
        params: {
          roots: ['A', 'E', 'B', 'F', 'C', 'D'],
          accidentals: ['b', 'b', 'b', '', '', 'b'],
          keys: ['C', 'G', 'D', 'A', 'E', 'F'],
          // b6–1–b3–#4 of each key (F minor's #4 is B natural).
          spellings: ['Ab–C–Eb–F#', 'Eb–G–Bb–C#', 'Bb–D–F–G#', 'F–A–C–D#', 'C–E–G–A#', 'Db–F–Ab–B'],
          chordQualities: ['dominant7'],
          noteCounts: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l6u18m4: Enharmonic Modulation Gr+6 <-> V7 ----
  {
    moduleId: 'l6u18m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about modulating through the German sixth / V7 pivot is true?',
        hintTemplate: 'The German Aug6 is enharmonically identical to a dominant 7th chord. Respelling it allows a sudden modulation to a remote key: Gr+6 in one key = V7 in another.',
        params: {
          choiceSets: [
            [
          { label: 'The German sixth in E minor (C–E–G–A#), respelled as C7 (C–E–G–Bb), resolves to F', correct: true },
          { label: 'The German sixth in E minor (C–E–G–A#), respelled as C7 (C–E–G–Bb), resolves to G', correct: false },
          { label: 'The German sixth in E minor (C–E–G–A#), respelled as C7 (C–E–G–Bb), resolves to Bb', correct: false },
          { label: 'The German sixth in E minor (C–E–G–A#), respelled as C7 (C–E–G–Bb), resolves to D', correct: false },
        ],
            [
          { label: "It reaches keys a half step above or below the tonic", correct: true },
          { label: "It reaches keys a whole step above or below the tonic", correct: false },
          { label: "It reaches keys a perfect fifth above or below the tonic", correct: false },
          { label: "It reaches keys a major third above or below the tonic", correct: false },
        ],
          ],
        },
      },
      {
        // The history set has its own question (W4-26).
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the history of German-sixth enharmonic modulation is true?',
        hintTemplate: 'Composers from Mozart and Schubert onward used the double identity of the German sixth (and of the dominant 7th) to jump to remote keys; it became a hallmark of Romantic harmony.',
        params: {
          choiceSets: [
            [
          { label: "Romantic composers made wide use of it", correct: true },
          { label: 'Renaissance composers made wide use of it', correct: false },
          { label: 'Medieval composers made wide use of it', correct: false },
          { label: 'Twentieth-century strict serial composers made wide use of it', correct: false },
        ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 19: Enharmonic Modulation and Advanced Chromaticism
  // =========================================================================

  // ---- l6u19m1: Enharmonic Modulation via dim7 ----
  {
    moduleId: 'l6u19m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about enharmonic modulation with the diminished 7th chord is true?',
        hintTemplate: 'A dim7 chord divides the octave into equal minor 3rds. Any of its 4 notes can be respelled as the root, making it resolve to 4 different keys.',
        params: {
          choiceSets: [
            [
          { label: 'Enharmonic respelling preserves sound; any of the four chord tones can serve as the new leading tone', correct: true },
          { label: 'Enharmonic respelling preserves sound; the original root must serve as the new leading tone', correct: false },
          { label: 'Enharmonic respelling preserves sound; the lowest two notes are the candidates for the new leading tone', correct: false },
          { label: 'Enharmonic respelling preserves sound; a note written with a sharp must serve as the new leading tone', correct: false },
        ],
            [
          { label: "There are only 3 different dim7 chords; together they cover all 12 keys", correct: true },
          { label: "There are only 4 different dim7 chords; together they cover all 12 keys", correct: false },
          { label: "There are only 6 different dim7 chords; together they cover all 12 keys", correct: false },
          { label: "There are only 12 different dim7 chords; together they cover all 12 keys", correct: false },
        ],
            [
          { label: 'B°7 can be respelled with leading tones B→C, D→Eb, F→Gb and G#→A', correct: true },
          { label: 'B°7 can be respelled with leading tones B→Eb, D→C, F→Gb and G#→A', correct: false },
          { label: 'B°7 can be respelled with leading tones B→C, D→Eb, F→A and G#→Gb', correct: false },
          { label: 'B°7 can be respelled with leading tones B→Eb, D→C, F→A and G#→Gb', correct: false },
        ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u19m2: Common-Tone Diminished 7th ----
  {
    moduleId: 'l6u19m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the common-tone diminished 7th chord is true?',
        hintTemplate: 'A CT°7 shares a common tone with the chord it embellishes. It decorates (rather than functions harmonically toward) a major or dominant 7th chord.',
        params: {
          choiceSets: [
            [
          { label: "The embellished chord's root is usually a common tone; the dim7 decorates rather than tonicizes it", correct: true },
          { label: "The embellished chord's root is usually a common tone; the dim7 tonicizes rather than decorates it", correct: false },
          { label: "The embellished chord's root is usually its leading tone; the dim7 decorates rather than tonicizes it", correct: false },
          { label: "The embellished chord's root is usually its leading tone; the dim7 tonicizes rather than decorates it", correct: false },
        ],
            [
          { label: "One part holds its note as the other three shift a step to dress up the chord", correct: true },
          { label: "Three parts hold their notes as the other one shifts a step to dress up the chord", correct: false },
          { label: "One part holds its note as the other three leap a fifth to dress up the chord", correct: false },
          { label: "Three parts hold their notes as the other one leaps a fifth to dress up the chord", correct: false },
        ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u19m3: Chromatic Mediants and Altered Dominants (incl. Omnibus) ----
  {
    moduleId: 'l6u19m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the omnibus progression is true?',
        hintTemplate: 'The omnibus is a chromatic voice-exchange pattern where two voices move in contrary chromatic motion while other voices sustain common tones.',
        params: {
          choiceSets: [
            [
              { label: 'Two voices move chromatically in contrary motion while the others hold', correct: true },
              { label: "Two voices move chromatically in parallel motion while the others hold", correct: false },
              { label: "Two voices move diatonically in contrary motion while the others hold", correct: false },
              { label: "Two voices move diatonically in parallel motion while the others hold", correct: false },
            ],
            [
          { label: 'An omnibus exchange can use C–C#–D–Eb–E against E–Eb–D–C#–C, with the other voices held', correct: true },
          { label: 'An omnibus exchange can use C–C#–D–Eb–E against D–Db–C–B–Bb, with the other voices held', correct: false },
          { label: 'An omnibus exchange can use C–D–E against E–D–C, with the other voices held', correct: false },
          { label: 'An omnibus exchange can use C–C#–D–Eb–E against E–F–F#–G–G#, with the other voices held', correct: false },
        ],
          ],
        },
      },
      {
        // Re-keyed from l6u19m4 (W4-01): this module's lesson teaches chromatic mediants.
        type: 'multiple_choice',
        promptTemplate: 'Which statement about chromatic mediants is true?',
        hintTemplate: 'Chromatic mediants such as C major to E major or Ab major have roots a major or minor 3rd apart and the same quality; a chord tone lies outside the key, even if both roots are diatonic. These pairs share one common tone. Doubly chromatic mediants, such as C major to Eb minor, share none.',
        params: {
          choiceSets: [
            [
              { label: 'E major is a chromatic mediant of C major: roots a major 3rd apart, one common tone (E)', correct: true },
              { label: 'G major is a chromatic mediant of C major: roots a 5th apart, one common tone (G)', correct: false },
              { label: 'F major is a chromatic mediant of C major: roots a 4th apart, one common tone (C)', correct: false },
              { label: 'A minor is a chromatic mediant of C major: roots a minor 3rd apart, two common tones (C, E)', correct: false },
            ],
            [
          { label: "Chromatic mediants link roots a third apart, with a pitch outside the key", correct: true },
          { label: 'Chromatic mediants link roots a third apart using only notes of the key', correct: false },
          { label: 'Chromatic mediants alter one chord tone while keeping the same root', correct: false },
          { label: 'Chromatic mediants link roots a fifth apart, with a pitch outside the key', correct: false },
        ],
            [
              { label: 'Ab major is a chromatic mediant of C major: roots a major 3rd apart, one common tone (C)', correct: true },
              { label: 'Ab major is a chromatic mediant of C major: roots a minor 3rd apart, two common tones (C, Eb)', correct: false },
              { label: 'Ab major is the dominant of C major: roots a 5th apart, two common tones (C, G)', correct: false },
              { label: 'Ab major is the subdominant of C major: roots a 4th apart, one common tone (C)', correct: false },
            ],
          ],
        },
      },
      {
        // V+: the dominant triad with a raised 5th, which leads up a half step
        // to the 3rd of I (G+ → C: D# → E).
        type: 'chord_build',
        promptTemplate: 'Build V+, the altered dominant of {key} major (V with a raised 5th).',
        hintTemplate: 'V+ is the dominant triad with its 5th raised a half step: on {root} that is root, major 3rd, augmented 5th. The raised 5th pushes up to the 3rd of {key}.',
        params: {
          roots: ['G', 'C', 'D', 'A', 'F'],
          accidentals: ['', '', '', '', ''],
          keys: ['C', 'F', 'G', 'D', 'Bb'],
          chordQualities: ['augmented'],
          noteCounts: [3],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l6u19m4: Late Romantic Harmonic Techniques ----
  {
    moduleId: 'l6u19m4',
    templates: [
      {
        // Re-keyed from l6u20m2 (W4-01): equal division of the octave is this lesson's first concept.
        type: 'scale_build',
        promptTemplate: 'Build the {root} {scaleType} scale, which divides the octave into six equal whole steps.',
        hintTemplate: 'The whole-tone scale divides the octave into 6 equal whole steps: from {root}, add 2 semitones five times. With no half steps there is no leading tone, so no note feels like home.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['whole_tone'],
          noteCounts: [6],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about equal divisions of the octave is true?',
        hintTemplate: 'Equal divisions: tritone (2 equal parts, steps of 6 semitones), augmented triad (3 equal parts, steps of 4), diminished 7th (4 equal parts, steps of 3), whole-tone scale (6 equal parts, steps of 2).',
        params: {
          choiceSets: [
            [
              { label: 'An augmented triad divides the octave into 3 equal major 3rds', correct: true },
              { label: 'An augmented triad divides the octave into 4 equal minor 3rds', correct: false },
              { label: 'A diminished 7th chord divides the octave into 3 equal major 3rds', correct: false },
              { label: 'An augmented triad divides the octave into 2 equal tritones', correct: false },
            ],
            [
          { label: "There are only 2 whole-tone scales, each with 6 of the 12 notes", correct: true },
          { label: "There are only 6 whole-tone scales, each with 2 of the 12 notes", correct: false },
          { label: "There are only 3 whole-tone scales, each with 4 of the 12 notes", correct: false },
          { label: "There are only 4 whole-tone scales, each with 3 of the 12 notes", correct: false },
        ],
            [
          { label: 'A diminished seventh chord divides the octave into 4 equal parts of 3 semitones', correct: true },
          { label: 'A diminished seventh chord divides the octave into 3 equal parts of 4 semitones', correct: false },
          { label: 'A diminished seventh chord divides the octave into 6 equal parts of 2 semitones', correct: false },
          { label: 'A diminished seventh chord divides the octave into 2 equal parts of 6 semitones', correct: false },
        ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about late-Romantic nonfunctional harmony is true?',
        hintTemplate: 'Late-Romantic chords often connect by voice-leading proximity, common tones or colour rather than by tonic–dominant function; planing moves a chord shape in parallel.',
        params: {
          choiceSets: [
            [
              { label: 'Nonfunctional chord connections mainly favor smooth linear movement and shared pitches', correct: true },
              { label: 'Nonfunctional chord connections mainly favor parallel tritone motion in every voice', correct: false },
              { label: 'Nonfunctional chord connections mainly favor wide melodic leaps and abrupt register changes', correct: false },
              { label: 'Nonfunctional chord connections mainly favor removing shared pitches between successive chords', correct: false },
            ],
            [
              { label: 'Chromatic planing moves one chord shape in parallel, keeping its exact quality', correct: true },
              { label: 'Chromatic planing moves one chord shape in parallel, adjusting it to fit the key', correct: false },
              { label: 'Chromatic planing moves every voice in contrary motion toward the tonic', correct: false },
              { label: 'Chromatic planing keeps one chord and changes only its bass note', correct: false },
            ],
            [
          { label: 'Frequent chromatic changes and distant tonal destinations usually weaken the sense of a stable home key', correct: true },
          { label: 'Frequent chromatic changes and distant tonal destinations usually require a faster tempo', correct: false },
          { label: 'Frequent chromatic changes and distant tonal destinations usually clarify a stable home key', correct: false },
          { label: 'Frequent chromatic changes and distant tonal destinations usually remove rhythmic organization', correct: false },
        ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // =========================================================================
  // Unit 20: Advanced Counterpoint and Chromaticism
  // =========================================================================

  // ---- l6u20m1: Species Counterpoint — First through Third Species ----
  {
    moduleId: 'l6u20m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the cantus firmus and first species (1:1) is true?',
        hintTemplate: 'Cantus firmus: 8–12 whole notes, tonic to tonic, mostly stepwise, one climax. First species: consonances only (P1, 3rds, P5, 6ths, P8); begin on P1 or P8, or on P5 only when the counterpoint is above the cantus; end on P1 or P8 approached by step.',
        params: {
          choiceSets: [
            [
              { label: 'A cantus firmus begins and ends on the tonic and moves mostly by step', correct: true },
              { label: 'A cantus firmus begins on the dominant and moves mostly by leap', correct: false },
              { label: 'A cantus firmus mixes whole, half and quarter notes freely', correct: false },
              { label: 'A cantus firmus repeats notes often and has several separate high points', correct: false },
            ],
            [
              { label: 'First species permits only these intervals above the bass: unisons, 3rds, perfect 5ths, 6ths and octaves', correct: true },
              { label: 'First species permits only these intervals above the bass: unisons, 3rds, 4ths, perfect 5ths, 6ths and octaves', correct: false },
              { label: 'First species permits only these intervals above the bass: unisons, perfect 5ths and octaves', correct: false },
              { label: 'First species permits only these intervals above the bass: unisons, 2nds, 4ths, 6ths and octaves', correct: false },
            ],
            [
              { label: "It starts with a perfect consonance and closes on a unison or octave", correct: true },
              { label: "It starts with an imperfect consonance and closes on a unison or octave", correct: false },
              { label: "It starts with a perfect consonance and closes on an imperfect consonance", correct: false },
              { label: "It starts with an imperfect consonance and closes on an imperfect consonance", correct: false },
            ],
          ],
        },
      },
      {
        // Second species follows Fux: weak-beat dissonances are passing tones only (decision D-14).
        type: 'multiple_choice',
        promptTemplate: 'Which statement about second species (2:1) counterpoint is true?',
        hintTemplate: 'Second species: two notes against each cantus note. The strong beat is consonant; the weak beat may be consonant or a dissonant passing tone, approached and left by step in one direction.',
        params: {
          choiceSets: [
            [
              { label: 'A weak-beat dissonance must be a passing tone, approached and left by step', correct: true },
              { label: 'A weak-beat dissonance may be a passing tone or a neighbor tone', correct: false },
              { label: 'A strong-beat dissonance is allowed if it then resolves by step', correct: false },
              { label: 'A weak-beat dissonance may be approached or left by a leap of a 3rd or a 4th', correct: false },
            ],
            [
              { label: 'Every strong beat must be consonant with the cantus firmus', correct: true },
              { label: "Every strong beat must be dissonant with the cantus firmus", correct: false },
              { label: "Every weak beat must be consonant with the cantus firmus", correct: false },
              { label: "Every weak beat must be dissonant with the cantus firmus", correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about third species (4:1) counterpoint is true?',
        hintTemplate: 'Third species: four notes against each cantus note. The first is consonant; the others may be passing tones, neighbor tones, a cambiata (step to the dissonance, leap of a 3rd, step back) or a double neighbor.',
        nudgeTemplate: 'Third species sets four notes against each cantus note. Ask which of the four falls on the beat and so must be consonant; for each dissonant figure, trace its path note by note: by step or by leap, and does it come back to where it started?',
        params: {
          choiceSets: [
            [
          { label: 'The first note of each group of four is consonant; the other notes may be passing or neighbor dissonances', correct: true },
          { label: 'The first note of each group of four is dissonant; the other notes may be passing or neighbor dissonances', correct: false },
          { label: 'The first note of each group of four is consonant; the other notes may be dissonances entered and left by leap', correct: false },
          { label: 'The first note of each group of four is dissonant; the other notes may be dissonances entered and left by leap', correct: false },
        ],
            [
              { label: 'The cambiata steps to a dissonance, leaps a 3rd, then steps back', correct: true },
              { label: 'The cambiata leaps to a dissonance, then resolves it down by step', correct: false },
              { label: 'The cambiata ties a dissonance over the barline into the next beat', correct: false },
              { label: 'The cambiata steps to a dissonance and steps on in the same direction', correct: false },
            ],
            [
              { label: "A double neighbor is an upper and a lower neighbor in sequence around one note", correct: true },
              { label: "A double neighbor is a step to dissonance, a leap of a third in the same direction, then a step back", correct: false },
              { label: "A double neighbor is a weak-beat passing tone approached and left by step in the same direction", correct: false },
              { label: "A double neighbor is two consecutive passing tones approached and left by step in the same direction", correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u20m2: Species Counterpoint — Fourth and Fifth Species ----
  {
    moduleId: 'l6u20m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about fourth species (syncopated) counterpoint is true?',
        hintTemplate: 'Fourth species ties a note from a weak beat across the barline. If the tied note is dissonant on the strong beat it is a suspension: prepared as a consonance, resolved down by step. Above the cantus: 7-6, 4-3, 9-8; below it: 2-3.',
        params: {
          choiceSets: [
            [
          { label: "In a suspension, weak-beat preparation is tied into strong-beat dissonance and resolves by step from the higher note to the lower note", correct: true },
          { label: "In a suspension, strong-beat preparation is tied into weak-beat dissonance and resolves by step from the higher note to the lower note", correct: false },
          { label: "In a suspension, weak-beat preparation is tied into strong-beat dissonance and resolves by step from the lower note to the higher note", correct: false },
          { label: "In a suspension, strong-beat preparation is tied into weak-beat dissonance and resolves by step from the lower note to the higher note", correct: false },
        ],
            [
          { label: "A suspension is prepared as a consonance and resolves down by step", correct: true },
          { label: "A suspension is prepared as a dissonance and resolves up by step", correct: false },
          { label: "A suspension is prepared as a consonance and resolves up by step", correct: false },
          { label: "A suspension is prepared as a dissonance and resolves down by step", correct: false },
        ],
            [
          { label: 'Above the cantus the main dissonant suspensions are 7-6, 4-3 and 9-8; below it, 2-3', correct: true },
          { label: 'Above the cantus the main dissonant suspensions are 2-3, 4-3 and 9-8; below it, 7-6', correct: false },
          { label: 'Above the cantus the main dissonant suspensions are 7-6, 2-3 and 9-8; below it, 4-3', correct: false },
          { label: 'Above the cantus the main dissonant suspensions are 7-6, 4-3 and 2-3; below it, 9-8', correct: false },
        ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about suspension chains and fifth (florid) species is true?',
        hintTemplate: 'In a chain each resolution is tied over to become the next suspension. Fifth (florid) species mixes the note values of the first four species in one line, each kept to its own rules.',
        nudgeTemplate: 'In a chain, follow each note that has just resolved: what happens to it across the next barline? For fifth (florid) species, ask whether it throws away what the first four species taught or builds on it.',
        params: {
          choiceSets: [
            [
          { label: "In a suspension chain, each resolution is tied into the next chord to prepare another suspension", correct: true },
          { label: 'In a suspension chain, each suspension resolves up by step to become the next preparation', correct: false },
          { label: "In a suspension chain, each resolution leaps into the next chord to prepare another suspension", correct: false },
          { label: 'In a suspension chain, each resolution is replaced by a rest before the next preparation', correct: false },
        ],
            [
              { label: "Fifth species freely mixes earlier note values while retaining their dissonance rules", correct: true },
              { label: "Fifth species freely mixes earlier note values while discarding their dissonance rules", correct: false },
              { label: "Fifth species fixes earlier note values at five notes per cantus note while retaining their dissonance rules", correct: false },
              { label: "Fifth species fixes earlier note values at five notes per cantus note while discarding their dissonance rules", correct: false },
            ],
            [
              { label: 'Florid counterpoint keeps each earlier species\' rules for its own note values', correct: true },
              { label: 'Florid counterpoint applies suspension rules to passing tones and passing-note rules to suspensions', correct: false },
              { label: "Florid counterpoint drops earlier rules whenever whole notes and syncopation share the same line", correct: false },
              { label: "Florid counterpoint requires each note value to use a new rule unrelated to earlier species", correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l6u20m3: Three-Part and Invertible Counterpoint ----
  {
    moduleId: 'l6u20m3',
    templates: [
      {
        // Inversion at the octave maps an interval n to 9 − n, at the 10th to 11 − n, at the 12th to 13 − n.
        type: 'multiple_choice',
        promptTemplate: 'Which statement about invertible (double) counterpoint is true?',
        hintTemplate: 'Invertible counterpoint lets two voices swap places. At the octave an interval n becomes 9 − n (3rd → 6th, 5th → 4th); at the 10th, 11 − n (3rd → octave, 6th → 5th); at the 12th, 13 − n (5th → octave).',
        params: {
          choiceSets: [
            [
              { label: 'Swapping C4–E4 at the octave gives E4–C5', correct: true },
              { label: 'Swapping C4–E4 at the octave gives E4–B4', correct: false },
              { label: 'Swapping C4–E4 at the octave gives E4–A4', correct: false },
              { label: 'Swapping C4–E4 at the octave gives E4–D5', correct: false },
            ],
            [
              { label: 'At the octave, 5ths are avoided because they become dissonant 4ths', correct: true },
              { label: 'At the octave, 3rds are avoided because they become dissonant 6ths', correct: false },
              { label: 'At the octave, 5ths are preferred because they stay perfect 5ths', correct: false },
              { label: 'At the octave, 6ths are avoided because they become dissonant 2nds', correct: false },
            ],
            [
          { label: "At the 10th, a 3rd becomes an octave and a 6th becomes a 5th", correct: true },
          { label: "At the 10th, a 3rd becomes a 5th and a 6th becomes an octave", correct: false },
          { label: "At the 10th, an octave becomes a 6th and a 5th becomes a 3rd", correct: false },
          { label: "At the 10th, a 3rd stays a 3rd and a 6th stays a 6th", correct: false },
        ],
            [
          { label: "Swapping the parts at a twelfth turns a fifth into an octave", correct: true },
          { label: "Swapping the parts at a twelfth turns a fifth into a third", correct: false },
          { label: "Swapping the parts at a twelfth turns a fifth into a tenth", correct: false },
          { label: "Swapping the parts at a twelfth turns a fifth into a twelfth", correct: false },
        ],
          ],
        },
      },
      {
        // Re-keyed from l6u20m4 (W4-01): this lesson teaches triple counterpoint.
        // Three voices have 3! = 6 vertical orderings.
        type: 'multiple_choice',
        promptTemplate: 'Which statement about triple counterpoint is true?',
        hintTemplate: 'Triple counterpoint: three voices that work in all six vertical orderings (ABC, ACB, BAC, BCA, CAB, CBA), so every pair of voices must be invertible.',
        nudgeTemplate: 'Count how many ways three voices can be stacked from top to bottom, and ask which pairs of voices end up swapping places across those stackings.',
        params: {
          choiceSets: [
            [
          { label: 'A complete test checks all six permutations for valid counterpoint', correct: true },
          { label: 'A complete test checks the three cyclic rotations for valid counterpoint', correct: false },
          { label: 'A complete test checks the two orders preserving the original bass for valid counterpoint', correct: false },
          { label: 'A complete test checks the original order and its reversal for valid counterpoint', correct: false },
        ],
            [
          { label: 'Each of its three pairs must remain valid counterpoint after exchanging voices', correct: true },
          { label: 'Each of its three pairs must keep the same intervals after exchanging voices', correct: false },
          { label: 'Each of its three pairs must consist of perfect consonances after exchanging voices', correct: false },
          { label: 'Each of its three pairs must move in contrary motion after exchanging voices', correct: false },
        ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l6u20m4: Advanced Part Writing and Score Reading ----
  {
    moduleId: 'l6u20m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about harmonizing a soprano melody in SATB is true?',
        hintTemplate: 'Harmonizing a soprano: find the key and the cadence points, choose a bass line and chords that lead to them, fill in alto and tenor by the shortest path, then check for parallels, spacing and doubling.',
        nudgeTemplate: 'Plan the way a composer would: decide where the phrases are heading before filling in the details, and keep the final step for proofreading the result against the part-writing rules.',
        params: {
          choiceSets: [
            [
              { label: "Locate the melody's cadence points, then choose a bass and chords that support them", correct: true },
              { label: 'Harmonize from the first note and let the chords decide where each phrase ends', correct: false },
              { label: 'Write the inner voices first, then fit the bass to those voices', correct: false },
              { label: 'Choose a new chord for every melody note, then mark the phrase endings', correct: false },
            ],
            [
              { label: 'Last, check spacing, doubling and parallel fifths or octaves', correct: true },
              { label: 'Last, add parallel fifths between the outer voices', correct: false },
              { label: 'Last, double the leading tone at the final cadence', correct: false },
              { label: 'Last, cross the alto and tenor in the inner voices', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about figured bass realization is true?',
        hintTemplate: 'Figured bass: no figure = root position (5/3), 6 = first inversion, 6/4 = second inversion, 7 = root-position seventh, 6/5 = first inversion, 4/3 = second inversion, 4/2 = third inversion (7th in the bass).',
        params: {
          choiceSets: [
            [
              { label: 'A bass note with no figure is realized as a root-position (5/3) chord', correct: true },
              { label: 'A bass note with no figure is realized as a first-inversion (6/3) chord', correct: false },
              { label: 'A bass note with no figure is played alone, with no chord above it', correct: false },
              { label: 'A bass note with no figure is realized as a seventh chord (7)', correct: false },
            ],
            [
              { label: 'A 6 under a bass note means a triad in first inversion', correct: true },
              { label: 'A 6 under a bass note means a triad in second inversion', correct: false },
              { label: 'A 6 under a bass note means a triad in root position', correct: false },
              { label: 'A 6 under a bass note means a seventh chord in third inversion', correct: false },
            ],
            [
              { label: '6/4 under a bass note means a triad in second inversion', correct: true },
              { label: '6/4 under a bass note means a triad in first inversion', correct: false },
              { label: '6/4 under a bass note means a seventh chord in root position', correct: false },
              { label: '6/4 under a bass note means a triad in root position', correct: false },
            ],
            [
              { label: '4/2 under a bass note means a seventh chord with its 7th in the bass', correct: true },
              { label: '4/2 under a bass note means a seventh chord with its root in the bass', correct: false },
              { label: '4/2 under a bass note means a seventh chord with its 3rd in the bass', correct: false },
              { label: '4/2 under a bass note means a seventh chord with its 5th in the bass', correct: false },
            ],
          ],
        },
      },
      {
        // Bb clarinet: written C sounds Bb a major 2nd lower; horn in F: written C sounds F a perfect 5th lower.
        type: 'multiple_choice',
        promptTemplate: 'Which statement about transposing instruments in a full score is true?',
        hintTemplate: 'A transposing instrument sounds its name note when it reads C: a Bb clarinet sounds a major 2nd lower than written, a horn in F a perfect 5th lower. Transpose each part to concert pitch to hear the real harmony.',
        params: {
          choiceSets: [
            [
              { label: 'A Bb clarinet sounds a major 2nd lower than written: written C sounds Bb', correct: true },
              { label: 'A Bb clarinet sounds a major 2nd higher than written: written C sounds D', correct: false },
              { label: 'A Bb clarinet sounds a minor 3rd lower than written: written C sounds A', correct: false },
              { label: 'A Bb clarinet sounds exactly as written: written C sounds C', correct: false },
            ],
            [
              { label: 'For a horn in F, written C5 sounds F4', correct: true },
              { label: 'For a horn in F, written C5 sounds G5', correct: false },
              { label: 'For a horn in F, written C5 sounds Bb4', correct: false },
              { label: 'For a horn in F, written C5 sounds C5', correct: false },
            ],
            [
              { label: "To hear the real harmony, convert written pitch to concert pitch using the instrument's interval", correct: true },
              { label: "To hear the real harmony, convert concert pitch to written pitch using the instrument's interval", correct: false },
              { label: "To hear the real harmony, convert written pitch to concert pitch using the figured-bass intervals", correct: false },
              { label: "To hear the real harmony, convert concert pitch to written pitch using the figured-bass intervals", correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },
];

export default templates;
