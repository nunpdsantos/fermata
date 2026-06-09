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
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'How many sharps or flats does this major key have?',
        hintTemplate: 'Follow the circle of fifths. Sharps: G(1), D(2), A(3), E(4), B(5). Flats: F(1), Bb(2), Eb(3), Ab(4), Db(5).',
        params: {
          choiceSets: [
            [
              { label: 'B major has 5 sharps', correct: true },
              { label: 'B major has 4 sharps', correct: false },
              { label: 'B major has 6 sharps', correct: false },
              { label: 'B major has 3 sharps', correct: false },
            ],
            [
              { label: 'Eb major has 3 flats', correct: true },
              { label: 'Eb major has 2 flats', correct: false },
              { label: 'Eb major has 4 flats', correct: false },
              { label: 'Eb major has 1 flat', correct: false },
            ],
            [
              { label: 'Db major has 5 flats', correct: true },
              { label: 'Db major has 4 flats', correct: false },
              { label: 'Db major has 6 flats', correct: false },
              { label: 'Db major has 3 flats', correct: false },
            ],
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
        promptTemplate: 'In the {root} {scaleType} scale, what degree number is the given note?',
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
        points: 2,
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
        points: 2,
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
        points: 2,
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
        promptTemplate: 'Identify the relationship between these keys.',
        hintTemplate: 'Relative keys share the same key signature (e.g., C major / A minor). Parallel keys share the same tonic (e.g., C major / C minor).',
        params: {
          choiceSets: [
            [
              { label: 'The relative minor of G major is E minor', correct: true },
              { label: 'The relative minor of G major is G minor', correct: false },
              { label: 'The relative minor of G major is D minor', correct: false },
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
              { label: 'Parallel keys share the same tonic but differ in quality', correct: true },
              { label: 'Parallel keys share the same key signature', correct: false },
              { label: 'Parallel keys are always a 5th apart', correct: false },
              { label: 'Parallel keys use the same notes', correct: false },
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
        promptTemplate: 'Classify this time signature as simple or compound.',
        hintTemplate: 'In compound meter the top number is 6, 9, or 12 and the beat divides into 3. In simple meter the beat divides into 2.',
        params: {
          choiceSets: [
            [
              { label: '12/8 is compound quadruple: 4 beats each dividing into 3', correct: true },
              { label: '12/8 is simple: 12 beats per measure', correct: false },
              { label: '12/8 is compound triple: 3 beats each dividing into 4', correct: false },
              { label: '12/8 is simple quadruple: 4 beats of 3 eighth notes', correct: false },
            ],
            [
              { label: '3/8 is simple triple: 3 eighth-note beats per measure', correct: true },
              { label: '3/8 is compound: 1 beat dividing into 3', correct: false },
              { label: '3/8 is the same as 6/8', correct: false },
              { label: '3/8 is compound triple', correct: false },
            ],
            [
              { label: '9/8 is compound triple: 3 main beats, each dividing into 3', correct: true },
              { label: '9/8 is simple: 9 eighth-note beats per measure', correct: false },
              { label: '9/8 is compound duple', correct: false },
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
        promptTemplate: 'Answer this question about syncopation and rhythmic techniques.',
        hintTemplate: 'Syncopation places emphasis on normally weak beats or subdivisions. It creates rhythmic surprise and forward momentum.',
        params: {
          choiceSets: [
            [
              { label: 'Syncopation creates rhythmic interest by accenting off-beats', correct: true },
              { label: 'Syncopation means playing everything on the beat', correct: false },
              { label: 'Syncopation removes all accents from the music', correct: false },
              { label: 'Syncopation always involves triplets', correct: false },
            ],
            [
              { label: 'A tie across the barline creates syncopation by sustaining into the strong beat', correct: true },
              { label: 'A tie across the barline has no rhythmic effect', correct: false },
              { label: 'A tie across the barline always doubles the tempo', correct: false },
              { label: 'Ties can only occur within a single measure', correct: false },
            ],
            [
              { label: 'Hemiola creates the illusion of shifting between duple and triple groupings', correct: true },
              { label: 'Hemiola is the same as a ritardando', correct: false },
              { label: 'Hemiola means playing notes an octave higher', correct: false },
              { label: 'Hemiola only occurs in 4/4 time', correct: false },
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
        promptTemplate: 'Identify the interval from {root} going {direction}. Determine both the number and quality.',
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
          roots: ['C', 'D', 'F', 'G', 'A', 'E'],
          accidentals: ['', '', '', '', '', ''],
          intervals: [1, 3, 4, 6, 8, 10, 11],
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
        promptTemplate: 'Build a {root} {quality} triad. Select the 3 notes that form this chord.',
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
        points: 2,
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
        promptTemplate: 'Answer this question about chord inversions and figured bass notation.',
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
              { label: 'Figured bass 6/4 indicates root position', correct: false },
              { label: 'Figured bass 6/4 indicates first inversion', correct: false },
              { label: 'Figured bass 6/4 indicates a seventh chord', correct: false },
            ],
            [
              { label: 'The cadential 6/4 functions as a dominant embellishment', correct: true },
              { label: 'The cadential 6/4 functions as a tonic chord', correct: false },
              { label: 'The cadential 6/4 functions as a subdominant', correct: false },
              { label: 'The cadential 6/4 is never used in classical music', correct: false },
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
        points: 2,
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the Roman numeral and quality for this diatonic triad.',
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
