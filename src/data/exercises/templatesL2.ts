import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 2 Templates — 12 modules, ~65 generated exercises
// Focus: Key signatures, scale degree names, minor scales, compound meter,
//        interval quality, all triad types, inversions, diatonic harmony
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 4: All Major Keys and Scale Degrees
  // =========================================================================

  // ---- l2u4m1: All Major Keys / Circle of 5ths ----
  {
    moduleId: 'l2u4m1',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} major scale. Select all 7 notes using the correct sharps or flats.',
        hintTemplate: 'Apply the W-W-H-W-W-W-H pattern starting from {root}. Check the circle of fifths for the key signature.',
        params: {
          roots: ['D', 'A', 'E', 'F', 'B', 'G'],
          accidentals: ['', '', '', '', 'b', ''],
          scaleTypes: ['major'],
          noteCounts: [7],
        },
      },
      {
        // The staff shows a key signature; the learner reads it (W4-06).
        type: 'multiple_choice',
        promptTemplate: 'Which major key has this key signature?',
        hintTemplate: 'Count the sharps or flats. Sharps: G(1), D(2), A(3), E(4), B(5), F#(6). Flats: F(1), Bb(2), Eb(3), Ab(4), Db(5), Gb(6). The last sharp is a half step below the tonic; with two or more flats, the next-to-last flat names the key.',
        params: {
          choiceSets: [
            [
              { label: 'A major', correct: true },
              { label: 'D major', correct: false },
              { label: 'E major', correct: false },
              { label: 'Eb major', correct: false },
            ],
            [
              { label: 'E major', correct: true },
              { label: 'A major', correct: false },
              { label: 'B major', correct: false },
              { label: 'Ab major', correct: false },
            ],
            [
              { label: 'B major', correct: true },
              { label: 'E major', correct: false },
              { label: 'F# major', correct: false },
              { label: 'Db major', correct: false },
            ],
            [
              { label: 'F# major', correct: true },
              { label: 'B major', correct: false },
              { label: 'C# major', correct: false },
              { label: 'Gb major', correct: false },
            ],
            [
              { label: 'Bb major', correct: true },
              { label: 'F major', correct: false },
              { label: 'Eb major', correct: false },
              { label: 'D major', correct: false },
            ],
            [
              { label: 'Eb major', correct: true },
              { label: 'Bb major', correct: false },
              { label: 'Ab major', correct: false },
              { label: 'A major', correct: false },
            ],
            [
              { label: 'Ab major', correct: true },
              { label: 'Eb major', correct: false },
              { label: 'Db major', correct: false },
              { label: 'E major', correct: false },
            ],
            [
              { label: 'Db major', correct: true },
              { label: 'Ab major', correct: false },
              { label: 'Gb major', correct: false },
              { label: 'B major', correct: false },
            ],
          ],
          stimuli: [
            { notes: [], keySignature: 'A', clef: 'treble' },
            { notes: [], keySignature: 'E', clef: 'treble' },
            { notes: [], keySignature: 'B', clef: 'treble' },
            { notes: [], keySignature: 'F#', clef: 'treble' },
            { notes: [], keySignature: 'Bb', clef: 'treble' },
            { notes: [], keySignature: 'Eb', clef: 'treble' },
            { notes: [], keySignature: 'Ab', clef: 'treble' },
            { notes: [], keySignature: 'Db', clef: 'treble' },
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l2u4m2: Scale Degree Names ----
  {
    moduleId: 'l2u4m2',
    templates: [
      {
        type: 'scale_degree_id',
        promptTemplate: 'In the {root} {scaleType} scale, what degree number is the note {note}?',
        hintTemplate: 'Count up from {root} as degree 1 through the {scaleType} scale. The degree names are: tonic, supertonic, mediant, subdominant, dominant, submediant, leading tone.',
        params: {
          roots: ['C', 'G', 'D', 'F', 'A'],
          accidentals: ['', '', '', '', ''],
          scaleTypes: ['major'],
          degrees: [1, 2, 3, 4, 5, 6, 7],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Match the scale degree number to its traditional name.',
        hintTemplate: '1=tonic, 2=supertonic, 3=mediant, 4=subdominant, 5=dominant, 6=submediant, 7=leading tone.',
        params: {
          choiceSets: [
            [
              { label: 'The mediant is degree 3', correct: true },
              { label: 'The mediant is degree 4', correct: false },
              { label: 'The mediant is degree 5', correct: false },
              { label: 'The mediant is degree 2', correct: false },
            ],
            [
              { label: 'The submediant is degree 6', correct: true },
              { label: 'The submediant is degree 4', correct: false },
              { label: 'The submediant is degree 5', correct: false },
              { label: 'The submediant is degree 3', correct: false },
            ],
            [
              { label: 'The supertonic is degree 2', correct: true },
              { label: 'The supertonic is degree 3', correct: false },
              { label: 'The supertonic is degree 7', correct: false },
              { label: 'The supertonic is degree 1', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // =========================================================================
  // Unit 5: Minor Scales and Key Relationships
  // =========================================================================

  // ---- l2u5m1: Natural Minor ----
  {
    moduleId: 'l2u5m1',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} natural minor scale. Select all 7 notes following the W-H-W-W-H-W-W pattern.',
        hintTemplate: 'The {root} natural minor uses the pattern W-H-W-W-H-W-W. Compared to major, degrees 3, 6, and 7 are lowered by a half step.',
        params: {
          roots: ['A', 'D', 'E', 'G', 'C', 'B'],
          accidentals: ['', '', '', '', '', ''],
          scaleTypes: ['natural_minor'],
          noteCounts: [7],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l2u5m2: Harmonic/Melodic Minor ----
  {
    moduleId: 'l2u5m2',
    templates: [
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} harmonic minor scale. The 7th degree is raised compared to natural minor.',
        hintTemplate: 'Harmonic minor = natural minor with a raised 7th. This creates a leading tone a half step below the tonic {root}.',
        params: {
          roots: ['A', 'D', 'E', 'G', 'C'],
          accidentals: ['', '', '', '', ''],
          scaleTypes: ['harmonic_minor'],
          noteCounts: [7],
        },
      },
      {
        type: 'scale_build',
        promptTemplate: 'Build the {root} melodic minor scale (ascending form). Both the 6th and 7th degrees are raised.',
        hintTemplate: 'Melodic minor ascending = natural minor with raised 6th and 7th. This eliminates the augmented 2nd found in harmonic minor.',
        params: {
          roots: ['A', 'D', 'E', 'C'],
          accidentals: ['', '', '', ''],
          scaleTypes: ['melodic_minor'],
          noteCounts: [7],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l2u5m3: Relative/Parallel Keys ----
  {
    moduleId: 'l2u5m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about relative and parallel keys is true?',
        hintTemplate: 'Relative keys share the same key signature (e.g., C major / A minor). Parallel keys share the same tonic (e.g., C major / C minor).',
        params: {
          choiceSets: [
            [
              { label: 'The relative minor of G major is E minor', correct: true },
              { label: 'The relative minor of G major is G minor', correct: false },
              { label: 'The relative minor of G major is A minor', correct: false },
              { label: 'The relative minor of G major is B minor', correct: false },
            ],
            [
              { label: 'The relative minor of D major is B minor', correct: true },
              { label: 'The relative minor of D major is D minor', correct: false },
              { label: 'The relative minor of D major is A minor', correct: false },
              { label: 'The relative minor of D major is F# minor', correct: false },
            ],
            [
              { label: 'The relative major of F# minor is A major', correct: true },
              { label: 'The relative major of F# minor is F# major', correct: false },
              { label: 'The relative major of F# minor is D major', correct: false },
              { label: 'The relative major of F# minor is E major', correct: false },
            ],
            [
              { label: 'The relative minor of Eb major is C minor', correct: true },
              { label: 'The relative minor of Eb major is Eb minor', correct: false },
              { label: 'The relative minor of Eb major is Bb minor', correct: false },
              { label: 'The relative minor of Eb major is Ab minor', correct: false },
            ],
            [
              { label: 'Parallel keys share the same tonic but differ in mode', correct: true },
              { label: 'Parallel keys share a key signature but have different tonics', correct: false },
              { label: 'Parallel keys usually have tonics a perfect fifth apart', correct: false },
              { label: 'Parallel keys share their scale notes but begin on different tonics', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 6: Compound Meter and Syncopation
  // =========================================================================

  // ---- l2u6m1: Compound Meter ----
  {
    moduleId: 'l2u6m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about simple and compound meter is true?',
        hintTemplate: 'In compound meter the top number is 6, 9, or 12 and the beat divides into 3. In simple meter the beat divides into 2.',
        params: {
          choiceSets: [
            [
              { label: '12/8 is compound quadruple: four dotted-quarter beats', correct: true },
              { label: '12/8 is simple: twelve eighth-note beats', correct: false },
              { label: '12/8 is compound triple: three beats of four eighth notes', correct: false },
              { label: '12/8 is simple: six quarter-note beats', correct: false },
            ],
            [
              { label: '6/8 is compound duple: 2 beats of 3', correct: true },
              { label: '6/8 is simple triple: 3 beats, each dividing into 2', correct: false },
              { label: '6/8 is compound triple: 3 beats, each dividing into 3', correct: false },
              { label: '6/8 is simple: six quarter-note beats per measure', correct: false },
            ],
            [
              { label: '9/8 is compound triple: 3 main beats, each dividing into 3', correct: true },
              { label: '9/8 is simple: 9 eighth-note beats per measure', correct: false },
              { label: '9/8 is compound quadruple: 4 main beats, each dividing into 3', correct: false },
              { label: '9/8 is the same as 3/4', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l2u6m2: Syncopation ----
  {
    moduleId: 'l2u6m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about syncopation and triplets is true?',
        hintTemplate: 'Syncopation places emphasis on normally weak beats or subdivisions. It creates rhythmic surprise and forward momentum. A triplet fits three equal notes into the time normally taken by two of the same value.',
        params: {
          choiceSets: [
            [
              { label: 'Syncopation creates rhythmic interest by accenting off-beats', correct: true },
              { label: "Syncopation creates rhythmic interest by accenting strong beats", correct: false },
              { label: "Syncopation creates rhythmic interest by suppressing off-beat accents", correct: false },
              { label: "Syncopation creates rhythmic interest by subdividing beats without moving accents", correct: false },
            ],
            [
              { label: 'A tie from a weak beat across the barline creates syncopation by sustaining through the strong beat', correct: true },
              { label: "A tie from a weak beat across the barline creates syncopation by reattacking on the strong beat", correct: false },
              { label: "A tie from a weak beat across the barline creates syncopation by cutting off before the strong beat", correct: false },
              { label: 'A tie from a weak beat across the barline creates syncopation by adding an accent on the strong beat', correct: false },
            ],
            [
              { label: 'Three triplet eighths fill the time of two ordinary eighth notes', correct: true },
              { label: 'Three triplet eighths fill the time of four ordinary eighth notes', correct: false },
              { label: 'Three triplet eighths fill the time of three ordinary eighth notes', correct: false },
              { label: 'Three triplet eighths fill the time of one ordinary eighth note', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 7: Intervals, Triads, Diatonic Harmony
  // =========================================================================

  // ---- l2u7m1: Interval Quality ----
  {
    moduleId: 'l2u7m1',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Identify the {direction} interval from {root}. Determine both the number and quality.',
        hintTemplate: 'Count letter names from {root} for the interval number, then count semitones for the quality (major, minor, perfect, augmented, diminished).',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          intervals: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12],
          directions: ['ascending', 'descending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l2u7m2: Aug/Dim/Compound Intervals ----
  {
    moduleId: 'l2u7m2',
    templates: [
      {
        type: 'interval_id',
        promptTemplate: 'Identify this interval from {root}. It may be augmented, diminished, or compound.',
        hintTemplate: 'Augmented intervals are one semitone larger than perfect/major. Diminished are one semitone smaller than perfect/minor. Compound intervals exceed an octave.',
        params: {
          // Spelled by number AND size (W4-14): A4, d5, A5, d7, M9, m10, P11,
          // M13 — on roots where each needs at most one accidental.
          roots: ['D', 'E', 'G', 'A'],
          accidentals: ['', '', '', ''],
          intervals: [6, 6, 8, 9, 14, 15, 17, 21],
          intervalNumbers: [4, 5, 5, 7, 9, 10, 11, 13],
          directions: ['ascending'],
          octaves: [4],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l2u7m3: Four Triad Types ----
  {
    moduleId: 'l2u7m3',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the {root} {quality} triad. Select the 3 notes that form this chord.',
        hintTemplate: 'Major = root + M3(4) + P5(7). Minor = root + m3(3) + P5(7). Diminished = root + m3(3) + dim5(6). Augmented = root + M3(4) + aug5(8). Build from {root}.',
        params: {
          // roots.length === chordQualities.length → the generator pairs each
          // root with the quality at the same index. B is omitted from the
          // augmented group only: B augmented spells B-D#-F## (double sharp),
          // which is out of scope at Level 2.
          roots: [
            'C', 'D', 'E', 'F', 'G', 'A', 'B', // major
            'C', 'D', 'E', 'F', 'G', 'A', 'B', // minor
            'C', 'D', 'E', 'F', 'G', 'A', 'B', // diminished
            'C', 'D', 'E', 'F', 'G', 'A',      // augmented (no B)
          ],
          accidentals: [
            '', '', '', '', '', '', '',
            '', '', '', '', '', '', '',
            '', '', '', '', '', '', '',
            '', '', '', '', '', '',
          ],
          chordQualities: [
            'major', 'major', 'major', 'major', 'major', 'major', 'major',
            'minor', 'minor', 'minor', 'minor', 'minor', 'minor', 'minor',
            'diminished', 'diminished', 'diminished', 'diminished', 'diminished', 'diminished', 'diminished',
            'augmented', 'augmented', 'augmented', 'augmented', 'augmented', 'augmented',
          ],
          noteCounts: [3],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l2u7m4: Inversions/Figured Bass ----
  {
    moduleId: 'l2u7m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about inversions and figured bass is true?',
        hintTemplate: 'Root position = 5/3. First inversion = 6/3 (6). Second inversion = 6/4. The bass note determines the inversion.',
        params: {
          choiceSets: [
            [
              { label: 'In second inversion, the 5th of the chord is in the bass', correct: true },
              { label: 'In second inversion, the 3rd of the chord is in the bass', correct: false },
              { label: 'In second inversion, the root is in the bass', correct: false },
              { label: 'In second inversion, the 7th is in the bass', correct: false },
            ],
            [
              { label: 'A C/E chord is C major in first inversion', correct: true },
              { label: 'A C/E chord is E major in root position', correct: false },
              { label: 'A C/E chord is C major in second inversion', correct: false },
              { label: 'A C/E chord is an E minor chord', correct: false },
            ],
            [
              { label: 'Figured bass 6/4 indicates second inversion', correct: true },
              { label: 'Figured bass 6/4 indicates a chord in root position', correct: false },
              { label: 'Figured bass 6/4 indicates first inversion', correct: false },
              { label: 'Figured bass 6/4 indicates a seventh chord', correct: false },
            ],
            [
              { label: 'In first inversion, the 3rd of the chord is in the bass', correct: true },
              { label: 'In first inversion, the 5th of the chord is in the bass', correct: false },
              { label: 'In first inversion, the root stays in the bass', correct: false },
              { label: 'In first inversion, the 7th of the chord is in the bass', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l2u7m5: Diatonic Triads/Roman Numerals ----
  {
    moduleId: 'l2u7m5',
    templates: [
      {
        type: 'chord_build',
        promptTemplate: 'Build the diatonic triad on {root} as it appears in C major.',
        hintTemplate: 'Use only the notes of C major (no sharps or flats). The quality depends on which scale degree {root} occupies: I, IV, V are major; ii, iii, vi are minor; vii is diminished.',
        params: {
          roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          accidentals: ['', '', '', '', '', '', ''],
          chordQualities: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
          noteCounts: [3],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about the diatonic triads of a major key is true?',
        hintTemplate: 'In major keys: I(M) ii(m) iii(m) IV(M) V(M) vi(m) vii°(dim). Uppercase = major, lowercase = minor, ° = diminished.',
        params: {
          choiceSets: [
            [
              { label: 'The ii chord in a major key is minor', correct: true },
              { label: 'The ii chord in a major key is major', correct: false },
              { label: 'The ii chord in a major key is diminished', correct: false },
              { label: 'The ii chord in a major key is augmented', correct: false },
            ],
            [
              { label: 'The vi chord in a major key is minor', correct: true },
              { label: 'The vi chord in a major key is major', correct: false },
              { label: 'The vi chord in a major key is diminished', correct: false },
              { label: 'The vi chord in a major key is augmented', correct: false },
            ],
            [
              { label: 'The IV chord in a major key is major', correct: true },
              { label: 'The IV chord in a major key is minor', correct: false },
              { label: 'The IV chord in a major key is augmented', correct: false },
              { label: 'The IV chord in a major key is diminished', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },
];

export default templates;
