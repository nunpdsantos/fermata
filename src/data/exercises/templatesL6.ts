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
              { label: 'It is a pre-dominant that moves to V', correct: true },
              { label: 'It is a dominant: it resolves straight to the tonic I', correct: false },
              { label: 'It is a tonic substitute that ends phrases in place of the tonic chord', correct: false },
              { label: 'It is a passing chord with no harmonic function of its own', correct: false },
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
              { label: 'The Italian sixth has four notes: b6, 1, 2 and #4', correct: false },
              { label: 'The Italian sixth has three notes: 6, 1 and #4', correct: false },
              { label: 'The Italian sixth has three notes: b6, 1 and 5', correct: false },
            ],
            [
              { label: 'The French sixth adds degree 2 to the Italian', correct: true },
              { label: 'The French sixth adds scale degree b3 to the Italian sixth', correct: false },
              { label: 'The French sixth adds scale degree 5 to the Italian sixth', correct: false },
              { label: 'The French sixth drops the #4 from the Italian sixth', correct: false },
            ],
            [
              { label: 'They expand to an octave on the dominant', correct: true },
              { label: 'They resolve inward to a unison on the tonic note', correct: false },
              { label: 'They resolve outward to an octave on the tonic', correct: false },
              { label: 'They resolve inward to a third on the subdominant', correct: false },
            ],
            [
              { label: 'b6 up to #4 is an augmented 6th (10 semitones) that expands to an octave', correct: true },
              { label: 'b6 up to #4 is a minor 6th (8 semitones) that contracts to a perfect 5th', correct: false },
              { label: 'b6 up to #4 is a major 6th (9 semitones) that expands to an octave', correct: false },
              { label: 'b6 up to #4 is a tritone (6 semitones) that contracts to a major 3rd', correct: false },
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
              { label: 'The German sixth contains b6, 1, 2 and #4', correct: false },
              { label: 'The German sixth contains b6, b2, b3 and #4', correct: false },
              { label: 'The German sixth contains 6, 1, b3 and #4', correct: false },
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
              { label: 'The German sixth of C minor (Ab-C-Eb-F#), respelled as Ab7 (Ab-C-Eb-Gb), leads to Db', correct: true },
              { label: 'The German sixth of C minor (Ab-C-Eb-F#), respelled as Ab7 (Ab-C-Eb-Gb), leads to Eb', correct: false },
              { label: 'The German sixth of C minor (Ab-C-Eb-F#) can never be respelled as a dominant 7th', correct: false },
              { label: 'Only the Italian sixth of C minor (Ab-C-F#) can be respelled as a dominant 7th', correct: false },
            ],
            [
              { label: 'The pivot reaches keys a half step above or below the tonic', correct: true },
              { label: 'The pivot reaches only keys a perfect 5th above or below the tonic', correct: false },
              { label: 'The pivot reaches only the parallel major or minor of the tonic', correct: false },
              { label: 'The pivot reaches only keys a whole step above or below the tonic', correct: false },
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
              { label: 'Romantic composers exploited it extensively', correct: true },
              { label: 'Only Baroque composers used the German sixth\'s double identity', correct: false },
              { label: 'It was first invented by twentieth-century composers of atonal music', correct: false },
              { label: 'Classical and Romantic composers both avoided enharmonic modulation entirely', correct: false },
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
              { label: 'Any note of a dim7 can serve as leading tone', correct: true },
              { label: 'Only the written root of a dim7 chord can act as a leading tone', correct: false },
              { label: 'A dim7 chord can lead to only one key: a half step above its root', correct: false },
              { label: 'A dim7 chord cannot be respelled without changing how it sounds', correct: false },
            ],
            [
              { label: 'There are only 3 different dim7 chords; together they cover all 12 keys', correct: true },
              { label: 'There are 12 different dim7 chords, one built on each of the 12 notes', correct: false },
              { label: 'There are 6 different dim7 chords, one on each note of a whole-tone scale', correct: false },
              { label: 'There are 4 different dim7 chords, one for each minor 3rd of the octave', correct: false },
            ],
            [
              { label: 'B°7 (B-D-F-Ab) can resolve to C, Eb, Gb or A, depending on its spelling', correct: true },
              { label: 'B°7 (B-D-F-Ab) can resolve to C, D, E or F, depending on its spelling', correct: false },
              { label: 'B°7 (B-D-F-Ab) can resolve only to C major, because B is its written root', correct: false },
              { label: 'B°7 (B-D-F-Ab) can resolve only to the notes it already contains', correct: false },
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
              { label: 'The CT°7 shares one note, usually the root, with the chord it embellishes', correct: true },
              { label: 'The CT°7 shares no notes at all with the chord it embellishes', correct: false },
              { label: 'The CT°7 shares two notes, the 3rd and 5th, with the chord it embellishes', correct: false },
              { label: 'The CT°7 is a dominant chord that resolves straight to its own tonic, just like V7', correct: false },
            ],
            [
              { label: 'It embellishes a chord: one voice holds while three voices move by step', correct: true },
              { label: 'It embellishes a chord: all four voices move by step and none holds', correct: false },
              { label: 'It modulates: all four voices leap together to a chord in a distant new key', correct: false },
              { label: 'It replaces the dominant: its root resolves up a half step to the tonic', correct: false },
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
              { label: 'All the voices move in parallel chromatic motion, with no common tones', correct: false },
              { label: 'Two voices move in parallel fifths while the other voices leap', correct: false },
              { label: 'One voice moves chromatically while every other voice leaps', correct: false },
            ],
            [
              { label: 'It can prolong a dominant harmony through chromatic voice exchange', correct: true },
              { label: 'It always modulates to a distant key through chromatic voice exchange', correct: false },
              { label: 'It can prolong only the tonic harmony, never the dominant harmony', correct: false },
              { label: 'It replaces the final cadence of a phrase with a plagal cadence, from IV back to I', correct: false },
            ],
          ],
        },
      },
      {
        // Re-keyed from l6u19m4 (W4-01): this module's lesson teaches chromatic mediants.
        type: 'multiple_choice',
        promptTemplate: 'Which statement about chromatic mediants is true?',
        hintTemplate: 'Chromatic mediants are chords related by a major or minor 3rd with roots that differ chromatically (e.g., C major to E major or Ab major). They share one common tone.',
        params: {
          choiceSets: [
            [
              { label: 'E major is a chromatic mediant of C major: roots a major 3rd apart, one common tone (E)', correct: true },
              { label: 'G major is a chromatic mediant of C major: roots a 5th apart, one common tone (G)', correct: false },
              { label: 'F major is a chromatic mediant of C major: roots a 4th apart, one common tone (C)', correct: false },
              { label: 'A minor is a chromatic mediant of C major: roots a minor 3rd apart, two common tones (C, E)', correct: false },
            ],
            [
              { label: 'Chromatic mediants move by a 3rd and alter at least one note chromatically', correct: true },
              { label: 'Chromatic mediants move by a 3rd and keep every note inside the key', correct: false },
              { label: 'Chromatic mediants move by a 5th and keep every single note of the key unchanged', correct: false },
              { label: 'Chromatic mediants move by a step and share all three of their notes', correct: false },
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
              { label: 'There are only 2 whole-tone scales, each with 6 of the 12 notes', correct: true },
              { label: 'There are 12 whole-tone scales, one starting on each of the 12 notes', correct: false },
              { label: 'There is only 1 whole-tone scale, and it holds all 12 notes', correct: false },
              { label: 'There are 6 whole-tone scales, one for each of its 6 notes', correct: false },
            ],
            [
              { label: 'A diminished 7th chord divides the octave into 4 equal minor 3rds', correct: true },
              { label: 'A diminished 7th chord divides the octave into 6 equal whole steps', correct: false },
              { label: 'A diminished 7th chord divides the octave into 2 equal perfect 5ths', correct: false },
              { label: 'A diminished 7th chord does not divide the octave into equal parts', correct: false },
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
              { label: 'Chords can connect by half-step voice leading instead of by function', correct: true },
              { label: 'Chords can connect only by root motion of a 5th, as in functional harmony', correct: false },
              { label: 'Chords connect by large leaps in every voice to avoid common tones', correct: false },
              { label: 'Every nonfunctional succession must still end on a V–I cadence', correct: false },
            ],
            [
              { label: 'Chromatic planing moves one chord shape in parallel, keeping its exact quality', correct: true },
              { label: 'Chromatic planing moves one chord shape in parallel, adjusting it to fit the key', correct: false },
              { label: 'Chromatic planing moves every voice in contrary motion toward the tonic', correct: false },
              { label: 'Chromatic planing keeps one chord and changes only its bass note', correct: false },
            ],
            [
              { label: 'Extended tonality weakens the tonal center through remote keys and chromaticism', correct: true },
              { label: 'Extended tonality strengthens the tonal center by repeating V–I cadences', correct: false },
              { label: 'Extended tonality uses only the seven notes of one key from start to finish', correct: false },
              { label: 'Extended tonality is just another name for the strict rules of species counterpoint', correct: false },
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
        hintTemplate: 'Cantus firmus: 8–12 whole notes, tonic to tonic, mostly stepwise, one climax. First species: consonances only (P1, 3rds, P5, 6ths, P8); begin on P1, P5 or P8; end on P1 or P8 approached by step.',
        params: {
          choiceSets: [
            [
              { label: 'A cantus firmus begins and ends on the tonic and moves mostly by step', correct: true },
              { label: 'A cantus firmus begins on the dominant and moves mostly by leap', correct: false },
              { label: 'A cantus firmus mixes whole, half and quarter notes freely', correct: false },
              { label: 'A cantus firmus repeats notes often and has several separate high points', correct: false },
            ],
            [
              { label: 'First species uses only consonances: unisons, 3rds, 5ths, 6ths and octaves', correct: true },
              { label: 'First species uses only perfect consonances: unisons, 4ths, 5ths and octaves', correct: false },
              { label: 'First species allows a passing dissonance on every second note', correct: false },
              { label: 'First species uses only 3rds and 6ths, never a unison, 5th or octave', correct: false },
            ],
            [
              { label: 'It begins on a unison, 5th or octave and ends on a unison or octave', correct: true },
              { label: 'It begins on a 3rd or a 6th and ends on a 5th that is approached by leap', correct: false },
              { label: 'It begins and ends on a 3rd, the sweetest of the consonances, to avoid a hollow sound', correct: false },
              { label: 'It may end on any consonance, approached by step or by leap', correct: false },
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
              { label: 'Every weak beat must be dissonant with the cantus firmus', correct: false },
              { label: 'Strong beats may be dissonant when the following weak beat is consonant', correct: false },
              { label: 'Every strong beat must form a unison with the cantus firmus', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about third species (4:1) counterpoint is true?',
        hintTemplate: 'Third species: four notes against each cantus note. The first is consonant; the others may be passing tones, neighbor tones, a cambiata (step to the dissonance, leap of a 3rd, step back) or a double neighbor.',
        params: {
          choiceSets: [
            [
              { label: 'The first of each four notes is consonant; the others may be passing or neighbor tones', correct: true },
              { label: 'All four notes against each cantus note must be consonant with it', correct: false },
              { label: 'The first of each four notes may be dissonant as long as the other three are all consonant', correct: false },
              { label: 'Only the last of each four notes must be consonant with the cantus, since it leads on to the next note', correct: false },
            ],
            [
              { label: 'The cambiata steps to a dissonance, leaps a 3rd, then steps back', correct: true },
              { label: 'The cambiata leaps to a dissonance, then resolves it down by step', correct: false },
              { label: 'The cambiata ties a dissonance over the barline into the next beat', correct: false },
              { label: 'The cambiata steps to a dissonance and steps on in the same direction', correct: false },
            ],
            [
              { label: 'A double neighbor decorates one note with its upper and lower neighbors in turn', correct: true },
              { label: 'A double neighbor is two consecutive passing tones in the same direction, not returning to the first note', correct: false },
              { label: 'A double neighbor sounds two dissonances at the same time, in two different voices', correct: false },
              { label: 'A double neighbor repeats the same note twice on the strong beats', correct: false },
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
              { label: 'A note is tied from a weak beat across the barline to the next strong beat', correct: true },
              { label: 'A note is tied from a strong beat to the weak beat that follows it in the same bar', correct: false },
              { label: 'Every note is struck on the strong beat and left on the weak beat', correct: false },
              { label: 'No ties are used at all; the line is syncopated by rests on each strong beat', correct: false },
            ],
            [
              { label: 'A suspension is prepared as a consonance and resolves down by step', correct: true },
              { label: 'A suspension is prepared as a dissonance and then resolves up by step', correct: false },
              { label: 'A suspension is prepared as a consonance and resolves up by step', correct: false },
              { label: 'A suspension needs no preparation and resolves down by leap', correct: false },
            ],
            [
              { label: 'Above the cantus the dissonant suspensions are 7-6, 4-3 and 9-8; below it, 2-3', correct: true },
              { label: 'Above the cantus the dissonant suspensions are 6-5, 3-2 and 8-7; below it, 4-5', correct: false },
              { label: 'Above the cantus the only dissonant suspension is 2-3; below it, 7-6 and 4-3', correct: false },
              { label: 'Above or below the cantus, the only dissonant suspension allowed is 4-3', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about suspension chains and fifth (florid) species is true?',
        hintTemplate: 'In a chain each resolution is tied over to become the next suspension. Fifth (florid) species mixes the note values of the first four species in one line, each kept to its own rules.',
        params: {
          choiceSets: [
            [
              { label: 'In a chain, each resolution is tied over to prepare the next suspension', correct: true },
              { label: 'In a chain, each suspension resolves up by step to prepare the next one', correct: false },
              { label: 'In a chain, every suspension is followed by a consonant leap of a 5th', correct: false },
              { label: 'In a chain, the suspensions must alternate between the two voices', correct: false },
            ],
            [
              { label: 'Fifth species freely combines the note values of the first four species', correct: true },
              { label: 'Fifth species uses five notes against each note of the cantus firmus', correct: false },
              { label: 'Fifth species is counterpoint written for five independent voices, one for each species', correct: false },
              { label: 'Fifth species drops all of the dissonance rules of the four earlier species', correct: false },
            ],
            [
              { label: 'Florid counterpoint keeps each earlier species\' rules for its own note values', correct: true },
              { label: 'Florid counterpoint ignores the dissonance rules so that the line can move freely', correct: false },
              { label: 'Florid counterpoint allows only whole notes against the cantus firmus', correct: false },
              { label: 'Florid counterpoint forbids ties across the barline, so suspensions can no longer appear in it', correct: false },
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
              { label: 'At the octave, a 3rd becomes a 6th when the voices swap', correct: true },
              { label: 'At the octave, a 3rd stays a 3rd when the voices swap', correct: false },
              { label: 'At the octave, a 3rd becomes a 5th when the voices swap', correct: false },
              { label: 'At the octave, a 3rd becomes a 7th when the voices swap', correct: false },
            ],
            [
              { label: 'At the octave, 5ths are avoided because they become dissonant 4ths', correct: true },
              { label: 'At the octave, 3rds are avoided because they become dissonant 6ths', correct: false },
              { label: 'At the octave, 5ths are preferred because they stay perfect 5ths', correct: false },
              { label: 'At the octave, 6ths are avoided because they become dissonant 2nds', correct: false },
            ],
            [
              { label: 'At the 10th, a 3rd becomes an octave and a 6th becomes a 5th', correct: true },
              { label: 'At the 10th, a 3rd becomes a 6th and a 6th becomes a 3rd', correct: false },
              { label: 'At the 10th, a 3rd becomes a 5th and a 6th becomes an octave', correct: false },
              { label: 'At the 10th, every interval stays exactly the same size', correct: false },
            ],
            [
              { label: 'At the 12th, a 5th becomes an octave when the voices swap', correct: true },
              { label: 'At the 12th, a 5th becomes a 4th when the two voices swap places', correct: false },
              { label: 'At the 12th, a 5th becomes a 6th when the voices swap', correct: false },
              { label: 'At the 12th, a 3rd becomes a 6th whenever the two voices swap', correct: false },
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
        params: {
          choiceSets: [
            [
              { label: 'Its three voices work in all 6 possible vertical orderings', correct: true },
              { label: 'Its three voices work in only 3 possible vertical orderings', correct: false },
              { label: 'Its three voices work in all 9 possible vertical orderings', correct: false },
              { label: 'Its three voices work in all 12 possible vertical orderings', correct: false },
            ],
            [
              { label: 'Every pair of its voices must work as invertible counterpoint', correct: true },
              { label: 'Only its two outer voices need to work as invertible counterpoint', correct: false },
              { label: 'Its voices may move in parallel 5ths, since they will be reordered', correct: false },
              { label: 'Only its top voice may move; the two lower voices stay fixed', correct: false },
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
        params: {
          choiceSets: [
            [
              { label: 'Find the cadence points first, then choose a bass line and chords that lead there', correct: true },
              { label: 'Write the alto and tenor first, then fit a bass and soprano around them', correct: false },
              { label: 'Choose any chord for each note first, then fix the cadences and voices at the very end', correct: false },
              { label: 'Harmonize from the first note and let the chords decide where each phrase ends', correct: false },
            ],
            [
              { label: 'Last, check for parallel 5ths and octaves, spacing and doubling errors', correct: true },
              { label: 'Last, add parallel 5ths and octaves between the outer voices for strength', correct: false },
              { label: 'Last, double the leading tone in every dominant chord for a fuller sound', correct: false },
              { label: 'Last, cross the alto and tenor so that each inner voice has more room', correct: false },
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
              { label: 'A horn in F sounds a perfect 5th lower than written: written C sounds F', correct: true },
              { label: 'A horn in F sounds a perfect 5th higher than written: written C sounds G', correct: false },
              { label: 'A horn in F sounds a major 2nd lower than written: written C sounds Bb', correct: false },
              { label: 'A horn in F sounds exactly as written: written C sounds C', correct: false },
            ],
            [
              { label: 'To hear the real harmony, transpose each part by its instrument\'s interval', correct: true },
              { label: 'Transposing parts already sound as written, so no transposition is needed', correct: false },
              { label: 'To hear the real harmony, move every part up one octave from where it is written', correct: false },
              { label: 'To hear the real harmony, read only the string parts and ignore the winds', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },
];

export default templates;
