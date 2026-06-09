import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 8 Templates — 11 modules, ~60 generated exercises
// Focus: Fugue analysis, large form, orchestration, set theory,
//        twentieth-century techniques
// ---------------------------------------------------------------------------

const templates: ModuleTemplateConfig[] = [
  // =========================================================================
  // Unit 25: Fugue and Imitative Counterpoint
  // =========================================================================

  // ---- l8u25m1: Fugue Exposition ----
  {
    moduleId: 'l8u25m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze this element of a fugue exposition.',
        hintTemplate: 'Fugue exposition: subject enters in tonic, answer enters in dominant (real or tonal), subsequent voices enter alternating T-D. A countersubject accompanies each new entry.',
        params: {
          choiceSets: [
            [
              { label: 'The subject enters first in the tonic key, and the answer enters in the dominant', correct: true },
              { label: 'The answer enters in the subdominant', correct: false },
              { label: 'Both subject and answer are in the tonic', correct: false },
              { label: 'The subject enters in the dominant first', correct: false },
            ],
            [
              { label: 'A tonal answer adjusts intervals to avoid tonicizing the dominant at the entry point', correct: true },
              { label: 'A tonal answer transposes the subject exactly', correct: false },
              { label: 'A tonal answer is in a different meter', correct: false },
              { label: 'Tonal and real answers are identical concepts', correct: false },
            ],
            [
              { label: 'A real answer transposes the subject exactly to the dominant (up a P5 or down a P4)', correct: true },
              { label: 'A real answer modifies some intervals', correct: false },
              { label: 'A real answer uses inversion', correct: false },
              { label: 'A real answer is always in the tonic', correct: false },
            ],
            [
              { label: 'The countersubject is a recurring melodic line that accompanies each new entry of the subject', correct: true },
              { label: 'The countersubject is the same as the subject', correct: false },
              { label: 'The countersubject only appears once', correct: false },
              { label: 'The countersubject is always in unison with the answer', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l8u25m2: Fugue Episodes and Stretto ----
  {
    moduleId: 'l8u25m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify this fugal technique.',
        hintTemplate: 'Episodes: passages between subject entries, often using sequences based on fragments. Stretto: overlapping subject entries where the answer begins before the subject finishes.',
        params: {
          choiceSets: [
            [
              { label: 'In stretto, a new voice begins the subject before the previous voice has finished it', correct: true },
              { label: 'Stretto means playing the subject slowly', correct: false },
              { label: 'Stretto is the same as an episode', correct: false },
              { label: 'Stretto only occurs in the exposition', correct: false },
            ],
            [
              { label: 'Episodes modulate between key areas, often using sequences derived from the subject', correct: true },
              { label: 'Episodes always state the subject in full', correct: false },
              { label: 'Episodes never use material from the subject', correct: false },
              { label: 'Episodes must stay in the tonic key', correct: false },
            ],
            [
              { label: 'Augmentation presents the subject in longer note values (doubled durations)', correct: true },
              { label: 'Augmentation means adding more notes to the subject', correct: false },
              { label: 'Augmentation is the same as inversion', correct: false },
              { label: 'Augmentation shortens the note values', correct: false },
            ],
            [
              { label: 'Diminution presents the subject in shorter note values (halved durations)', correct: true },
              { label: 'Diminution means removing notes from the subject', correct: false },
              { label: 'Diminution is the same as retrograde', correct: false },
              { label: 'Diminution makes the subject louder', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l8u25m3: Canon ----
  {
    moduleId: 'l8u25m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify this type of canon.',
        hintTemplate: 'Canon types: strict (exact imitation), at the octave, at the 5th, in inversion (contrary motion), in retrograde (crab canon), double canon (2 independent canons).',
        params: {
          choiceSets: [
            [
              { label: 'A canon in inversion (mirror canon) imitates the melody in contrary motion', correct: true },
              { label: 'A canon in inversion transposes the melody', correct: false },
              { label: 'A canon in inversion reverses the rhythm', correct: false },
              { label: 'Canon in inversion is the same as augmentation', correct: false },
            ],
            [
              { label: 'A crab canon (canon cancrizans) presents the melody in retrograde', correct: true },
              { label: 'A crab canon is played sideways', correct: false },
              { label: 'A crab canon uses inversion', correct: false },
              { label: 'A crab canon has no relationship to the original melody', correct: false },
            ],
            [
              { label: 'A perpetual (infinite) canon loops back to the beginning seamlessly', correct: true },
              { label: 'A perpetual canon gradually speeds up', correct: false },
              { label: 'A perpetual canon adds new voices indefinitely', correct: false },
              { label: 'A perpetual canon always has a clear ending', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 26: Large-Scale Form and Orchestration
  // =========================================================================

  // ---- l8u26m1: Sonata Form ----
  {
    moduleId: 'l8u26m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze this aspect of sonata form in detail.',
        hintTemplate: 'Sonata form sections: Exposition (P-T-S-C), Development (fragmentation, sequences, remote keys), Recapitulation (all in tonic), optional Coda.',
        params: {
          choiceSets: [
            [
              { label: 'The transition in the exposition modulates from tonic to the secondary key area', correct: true },
              { label: 'The transition stays in the tonic throughout', correct: false },
              { label: 'The transition introduces the second theme', correct: false },
              { label: 'The transition is always omitted', correct: false },
            ],
            [
              { label: 'The development typically features fragmentation, sequence, and modulation through remote keys', correct: true },
              { label: 'The development simply repeats the exposition', correct: false },
              { label: 'The development stays in the tonic', correct: false },
              { label: 'The development introduces entirely new themes', correct: false },
            ],
            [
              { label: 'A false recapitulation begins the return of the theme in the wrong key before the real recap', correct: true },
              { label: 'A false recapitulation omits the first theme', correct: false },
              { label: 'A false recapitulation is in the tonic', correct: false },
              { label: 'False recapitulations never occur in classical sonatas', correct: false },
            ],
            [
              { label: 'In a minor-key sonata, the second theme is typically in the relative major (III)', correct: true },
              { label: 'In minor-key sonatas, the second theme stays in the tonic', correct: false },
              { label: 'Minor-key sonatas use the dominant for the second theme', correct: false },
              { label: 'Minor-key sonatas do not have a second theme', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l8u26m2: Variation, Rondo, and Ritornello ----
  {
    moduleId: 'l8u26m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the formal structure described.',
        hintTemplate: 'Ritornello: recurring orchestral passage alternating with solo episodes (Baroque concerto). Sonata-rondo: ABACAB\'A combines rondo and sonata principles.',
        params: {
          choiceSets: [
            [
              { label: 'Ritornello form alternates orchestral tutti passages with solo episodes', correct: true },
              { label: 'Ritornello is the same as rondo', correct: false },
              { label: 'Ritornello only uses soloists', correct: false },
              { label: 'Ritornello has no recurring material', correct: false },
            ],
            [
              { label: 'Sonata-rondo combines the recurring A theme of rondo with sonata-form tonal relationships', correct: true },
              { label: 'Sonata-rondo is simply a rondo', correct: false },
              { label: 'Sonata-rondo has no recurring theme', correct: false },
              { label: 'Sonata-rondo is limited to vocal music', correct: false },
            ],
            [
              { label: 'A passacaglia is a set of variations over a recurring bass line (ground bass)', correct: true },
              { label: 'A passacaglia has no recurring element', correct: false },
              { label: 'A passacaglia is a type of rondo', correct: false },
              { label: 'A passacaglia is the same as a fugue', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l8u26m3: Orchestration ----
  {
    moduleId: 'l8u26m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about orchestration and instrument families.',
        hintTemplate: 'Orchestra families: strings, woodwinds, brass, percussion. Each instrument has a characteristic range, timbre, and role in the ensemble.',
        params: {
          choiceSets: [
            [
              { label: 'The standard string section order from highest to lowest is: violin I, violin II, viola, cello, double bass', correct: true },
              { label: 'Violas are higher than violins', correct: false },
              { label: 'Cellos are higher than violas', correct: false },
              { label: 'Double bass is higher than cello', correct: false },
            ],
            [
              { label: 'Transposing instruments sound at a different pitch than written: Bb clarinet sounds a M2 lower than written', correct: true },
              { label: 'All orchestral instruments are non-transposing', correct: false },
              { label: 'Bb clarinet sounds higher than written', correct: false },
              { label: 'Only percussion instruments transpose', correct: false },
            ],
            [
              { label: 'The horn in F sounds a perfect 5th lower than written', correct: true },
              { label: 'The horn in F sounds a perfect 5th higher than written', correct: false },
              { label: 'The horn in F is non-transposing', correct: false },
              { label: 'The horn in F sounds an octave lower', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // =========================================================================
  // Unit 27: Set Theory and Twentieth-Century Techniques
  // =========================================================================

  // ---- l8u27m1: Pitch-Class Sets ----
  {
    moduleId: 'l8u27m1',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about pitch-class set theory.',
        hintTemplate: 'Pitch classes: C=0 through B=11. A pitch-class set lists unique PCs in ascending order. Normal form puts them in the most compact arrangement.',
        params: {
          choiceSets: [
            [
              { label: 'A pitch-class set removes octave and enharmonic equivalence, using integers 0-11', correct: true },
              { label: 'Pitch-class sets use letter names and octave numbers', correct: false },
              { label: 'Pitch-class sets only work for tonal music', correct: false },
              { label: 'Pitch-class set integers range from 0 to 7', correct: false },
            ],
            [
              { label: 'Normal form arranges the set in the most compact ascending order', correct: true },
              { label: 'Normal form always starts on C', correct: false },
              { label: 'Normal form uses descending order', correct: false },
              { label: 'There is no standard ordering for sets', correct: false },
            ],
            [
              { label: 'The set {C, E, G} = {0, 4, 7} is a major triad expressed as pitch classes', correct: true },
              { label: '{0, 4, 7} represents a minor triad', correct: false },
              { label: '{0, 4, 7} represents a diminished triad', correct: false },
              { label: 'Triads cannot be expressed as pitch-class sets', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l8u27m2: Interval Vectors and Set Classes ----
  {
    moduleId: 'l8u27m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Analyze interval vectors and set class properties.',
        hintTemplate: 'Interval vector: counts of each interval class (ic 1-6) in a set, written as <x x x x x x>. Two sets are Z-related when they share the same interval vector but are NOT related by transposition or inversion (they belong to different set classes).',
        params: {
          choiceSets: [
            [
              { label: 'The interval vector counts occurrences of each interval class (1 through 6) in a pitch-class set', correct: true },
              { label: 'The interval vector counts only perfect intervals', correct: false },
              { label: 'The interval vector uses letter names', correct: false },
              { label: 'Interval vectors are the same as normal form', correct: false },
            ],
            [
              { label: 'Prime form transposes and/or inverts a set to its most compact form starting on 0', correct: true },
              { label: 'Prime form is the same as normal form', correct: false },
              { label: 'Prime form only transposes', correct: false },
              { label: 'Prime form always starts on the highest note', correct: false },
            ],
            [
              { label: 'Z-related sets share the same interval vector but are not transposition/inversion equivalent', correct: true },
              { label: 'Z-related means they are transpositionally equivalent', correct: false },
              { label: 'Z-related sets have different interval vectors', correct: false },
              { label: 'Z-relation does not exist in set theory', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l8u27m3: Twelve-Tone Technique ----
  {
    moduleId: 'l8u27m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Answer this question about twelve-tone (serial) technique.',
        hintTemplate: 'The tone row uses all 12 pitch classes in a fixed order. Transformations: P (prime), I (inversion), R (retrograde), RI (retrograde inversion). The 12x12 matrix organizes all 48 row forms.',
        params: {
          choiceSets: [
            [
              { label: 'A twelve-tone row uses each of the 12 pitch classes exactly once before any is repeated', correct: true },
              { label: 'A tone row can repeat pitches freely', correct: false },
              { label: 'A tone row uses only 7 pitches', correct: false },
              { label: 'A tone row must be a scale', correct: false },
            ],
            [
              { label: 'The four basic row transformations are Prime, Inversion, Retrograde, and Retrograde Inversion', correct: true },
              { label: 'There are only 2 row transformations', correct: false },
              { label: 'Row transformations include augmentation and diminution', correct: false },
              { label: 'Tone rows cannot be transformed', correct: false },
            ],
            [
              { label: 'The 12x12 matrix contains all 48 possible forms (12P + 12I + 12R + 12RI)', correct: true },
              { label: 'The matrix has 24 row forms', correct: false },
              { label: 'The matrix has 144 row forms', correct: false },
              { label: 'Each row form is unique to one cell', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l8u27m4: Minimalism and Postminimalism ----
  {
    moduleId: 'l8u27m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify the characteristics of this twentieth/twenty-first century technique.',
        hintTemplate: 'Minimalism: repetitive patterns, gradual process, limited harmonic material. Pioneers: Reich (phasing), Glass (additive process), Riley (tape loops).',
        params: {
          choiceSets: [
            [
              { label: 'Phasing gradually shifts two identical patterns out of sync, creating evolving textures', correct: true },
              { label: 'Phasing keeps patterns perfectly synchronized', correct: false },
              { label: 'Phasing uses twelve-tone technique', correct: false },
              { label: 'Phasing involves changing the pitch content', correct: false },
            ],
            [
              { label: 'Additive process gradually adds notes to a repeated pattern, creating a slowly expanding melody', correct: true },
              { label: 'Additive process removes notes from patterns', correct: false },
              { label: 'Additive process changes key with each repetition', correct: false },
              { label: 'Additive process is the same as theme and variations', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l8u27m5: Spectralism and Extended Techniques ----
  {
    moduleId: 'l8u27m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Identify this contemporary compositional technique.',
        hintTemplate: 'Spectralism: composition based on the acoustic properties of sound (overtone series, spectral analysis). Extended techniques: unconventional ways of playing instruments.',
        params: {
          choiceSets: [
            [
              { label: 'Spectral music derives harmony from the overtone series and acoustic analysis of sound', correct: true },
              { label: 'Spectral music uses traditional tonal harmony', correct: false },
              { label: 'Spectral music is based on twelve-tone technique', correct: false },
              { label: 'Spectral music avoids all pitched sounds', correct: false },
            ],
            [
              { label: 'Extended techniques include multiphonics, prepared piano, col legno, and harmonics', correct: true },
              { label: 'Extended techniques are standard orchestral playing', correct: false },
              { label: 'Extended techniques only apply to percussion', correct: false },
              { label: 'Extended techniques were invented in the Baroque era', correct: false },
            ],
            [
              { label: 'Microtonality divides the octave into intervals smaller than a semitone', correct: true },
              { label: 'Microtonality uses only the 12 standard pitches', correct: false },
              { label: 'Microtonality means playing very quietly', correct: false },
              { label: 'Microtonality is the same as atonality', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },
];

export default templates;
