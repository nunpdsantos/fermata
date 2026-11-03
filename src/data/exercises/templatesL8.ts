import type { ModuleTemplateConfig } from './exerciseTemplates';

// ---------------------------------------------------------------------------
// Level 8 Templates — 11 modules
// Focus: Fugue analysis, large form, orchestration, set theory,
//        twentieth-century techniques
// Each block practises its own module (W4-01, 2026-10-31): the L8u27 blocks
// had drifted one module from the curriculum they were written for.
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
        promptTemplate: 'Which statement about the fugue exposition is true?',
        hintTemplate: 'Fugue exposition: the subject enters in the tonic and the answer responds at the dominant level. A real answer transposes exactly, up a perfect 5th or down a perfect 4th. A tonal answer adjusts the opening: scale degree 5 is answered by 1, preserving the tonic–dominant frame rather than tonicizing the dominant immediately. Later voices alternate tonic and dominant entries; a countersubject is a recurring line that accompanies later entries.',
        params: {
          choiceSets: [
            [
              { label: 'The subject enters first in the tonic key, and the answer enters in the dominant', correct: true },
              { label: "The subject enters first in the dominant key, and the answer enters in the tonic", correct: false },
              { label: "The subject enters first in the tonic key, and the answer enters in the tonic", correct: false },
              { label: "The subject enters first in the dominant key, and the answer enters in the dominant", correct: false },
            ],
            [
              { label: 'A tonal answer adjusts intervals to avoid tonicizing the dominant at the entry point', correct: true },
              { label: 'A tonal answer transposes the subject exactly to the dominant, adjusting no intervals at the entry point', correct: false },
              { label: "A tonal answer adjusts instrumentation to keep the subject in its original voice", correct: false },
              { label: "A tonal answer preserves pitch intervals exactly and changes meter to establish the dominant", correct: false },
            ],
            [
              { label: 'A real answer transposes the subject exactly to the dominant (up a P5 or down a P4)', correct: true },
              { label: "A real answer transposes the subject exactly to the subdominant (up a P4 or down a P5)", correct: false },
              { label: "A real answer transposes the subject exactly to the tonic (up a P8 or down a P8)", correct: false },
              { label: "A real answer transposes the subject exactly to the leading tone (up a M7 or down a m2)", correct: false },
            ],
            [
              { label: "The countersubject is a recurring melodic line that accompanies later entries of the subject", correct: true },
              { label: "The countersubject is the subject itself, transposed to accompany later entries of the subject", correct: false },
              { label: "The countersubject is the answer itself, restated to introduce later entries of the subject", correct: false },
              { label: "The countersubject is a sustained bass pitch held unchanged beneath later entries of the subject", correct: false },
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
        promptTemplate: 'Which statement about fugal episodes, stretto and devices is true?',
        hintTemplate: 'Episodes: passages between subject entries, often using sequences based on fragments. Stretto: overlapping subject entries where the answer begins before the subject finishes. Augmentation lengthens note values, commonly doubling them; diminution shortens them, commonly by half.',
        params: {
          choiceSets: [
            [
              { label: 'Stretto overlaps subject entries: the next begins before the previous ends', correct: true },
              { label: 'Stretto separates subject entries: the next begins after the previous ends', correct: false },
              { label: 'Stretto augments subject entries: the next doubles the previous note values', correct: false },
              { label: 'Stretto retrogrades subject entries: the next reverses the previous note order', correct: false },
            ],
            [
              { label: 'Episodes modulate between key areas, often using sequences derived from the subject', correct: true },
              { label: "Episodes are complete subject statements in new keys, usually accompanied by the countersubject", correct: false },
              { label: "Episodes present the first subject entry in each voice, establishing the exposition of the fugue", correct: false },
              { label: "Episodes are overlapping entries of the complete subject, often beginning before earlier entries finish", correct: false },
            ],
            [
              { label: 'Augmentation multiplies note values by two', correct: true },
              { label: 'Augmentation divides note values by two', correct: false },
              { label: 'Augmentation reverses the sequence of notes', correct: false },
              { label: 'Augmentation reverses the direction of intervals', correct: false },
            ],
            [
              { label: 'Diminution presents the subject in shorter note values (usually halved)', correct: true },
              { label: "Diminution presents the subject in longer note values (usually doubled)", correct: false },
              { label: "Diminution means deleting notes while keeping the remaining note values unchanged", correct: false },
              { label: "Diminution means reversing the note order while keeping the original note values", correct: false },
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
        promptTemplate: 'Which statement about the kinds of canon is true?',
        hintTemplate: 'Canon types: strict (exact imitation), at the octave, at the 5th, in inversion (contrary motion), in retrograde (crab canon), double canon (2 independent canons). A perpetual canon reconnects its ending to its beginning so it can repeat continuously.',
        params: {
          choiceSets: [
            [
              { label: 'An inversion canon turns each melodic ascent into a descent and each descent into an ascent', correct: true },
              { label: 'An inversion canon reads the melody from its last note back to its first note', correct: false },
              { label: 'An inversion canon retains the melody but gives each note twice its original duration', correct: false },
              { label: 'An inversion canon retains the melody but gives each note half its original duration', correct: false },
            ],
            [
              { label: "A crab canon means reading the melody from end to beginning", correct: true },
              { label: "A crab canon means reading the melody with its interval directions reversed", correct: false },
              { label: "A crab canon means reading the melody with its note durations doubled", correct: false },
              { label: "A crab canon means reading the melody as a continuously repeating round", correct: false },
            ],
            [
              { label: "The defining feature of a perpetual canon is that it loops to its start", correct: true },
              { label: "The defining feature of a perpetual canon is that it reverses its note order", correct: false },
              { label: "The defining feature of a perpetual canon is that it doubles its note values", correct: false },
              { label: "The defining feature of a perpetual canon is that it halves its note values", correct: false },
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
        promptTemplate: 'Which statement about sonata form is true?',
        hintTemplate: 'Sonata form sections: Exposition (first theme group, transition, second theme group, closing theme), Development (fragmentation, sequences, remote keys), Recapitulation (all in tonic), optional Coda. A false recapitulation suggests the return in a different key before the true tonic return.',
        params: {
          choiceSets: [
            [
              { label: 'The transition in the exposition modulates from tonic to the secondary key area', correct: true },
              { label: "The transition in the exposition modulates from the secondary key area back to the tonic", correct: false },
              { label: "The transition in the exposition confirms the secondary key after the second theme has finished", correct: false },
              { label: "The transition in the exposition restates the first theme in the tonic after the development", correct: false },
            ],
            [
              { label: 'The development typically features fragmentation, sequence, and modulation through remote keys', correct: true },
              { label: "The development typically introduces the two contrasting themes and establishes their original key areas", correct: false },
              { label: "The development typically restates both themes in the tonic to resolve their original tonal contrast", correct: false },
              { label: "The development typically introduces the concerto soloist after the first orchestral exposition", correct: false },
            ],
            [
              { label: 'A false recapitulation begins the return of the theme in the wrong key before the real recap', correct: true },
              { label: 'A false recapitulation is the real recapitulation in the tonic key, with the first theme left out of it', correct: false },
              { label: 'A false recapitulation is the retransition, the passage built on the dominant to prepare the real return', correct: false },
              { label: 'A false recapitulation comes after the real recapitulation, as the opening of an expanded coda', correct: false },
            ],
            [
              { label: 'In the exposition of a sonata in A minor, the second theme is typically in C major', correct: true },
              { label: 'In the exposition of a sonata in A minor, the second theme is typically in A major', correct: false },
              { label: 'In the exposition of a sonata in A minor, the second theme is typically in B minor', correct: false },
              { label: 'In the exposition of a sonata in A minor, the second theme is typically in D minor', correct: false },
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
        promptTemplate: 'Which statement about variation, rondo and ritornello forms is true?',
        hintTemplate: 'Ritornello: recurring orchestral passage alternating with solo episodes (Baroque concerto). Sonata-rondo: ABACAB\'A combines rondo and sonata principles. A passacaglia develops variations over a recurring bass line.',
        params: {
          choiceSets: [
            [
              { label: 'Ritornello form gives returning refrains to the tutti and contrasting passages to the soloist', correct: true },
              { label: 'Ritornello form gives the recurring theme to the soloist and new material to each orchestral tutti', correct: false },
              { label: 'Ritornello form gives the opening theme to the orchestra and never brings it back', correct: false },
              { label: 'Ritornello form gives the orchestral theme to each solo episode as an exact copy', correct: false },
            ],
            [
              { label: "Sonata-rondo typically brings back its A theme and returns to B in the tonic in the second half", correct: true },
              { label: "Sonata-rondo typically brings back its A theme and returns to B in the secondary key in the second half", correct: false },
              { label: "Sonata-rondo typically avoids bringing back its A theme and returns to B in the tonic in the second half", correct: false },
              { label: "Sonata-rondo typically brings back its A theme and omits the return of B in the second half", correct: false },
            ],
            [
              { label: "A passacaglia is a set of variations over a recurring bass line", correct: true },
              { label: "A passacaglia is a recurring refrain alternating with contrasting melodic episodes", correct: false },
              { label: "A passacaglia is a two-theme structure with exposition, development and recapitulation", correct: false },
              { label: "A passacaglia is a recurring orchestral passage alternating with contrasting solo episodes", correct: false },
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
        promptTemplate: 'Which statement about orchestral instruments is true?',
        hintTemplate: 'Orchestra families: strings, woodwinds, brass, percussion. Each instrument has a characteristic range, timbre, and role in the ensemble. A transposing instrument sounds at a different pitch than written.',
        params: {
          choiceSets: [
            [
              { label: "String staves from top to bottom in a standard orchestral score: violin I, violin II, viola, cello, double bass", correct: true },
              { label: "String staves from top to bottom in a standard orchestral score: viola, violin II, violin I, cello, double bass", correct: false },
              { label: "String staves from top to bottom in a standard orchestral score: violin I, violin II, cello, viola, double bass", correct: false },
              { label: "String staves from top to bottom in a standard orchestral score: violin I, violin II, viola, double bass, cello", correct: false },
            ],
            [
              { label: 'On a Bb clarinet, written D5 always sounds C5', correct: true },
              { label: 'On a Bb clarinet, written D5 always sounds E5', correct: false },
              { label: 'On a Bb clarinet, written D5 always sounds B4', correct: false },
              { label: 'On a Bb clarinet, written D5 always sounds F5', correct: false },
            ],
            [
              { label: 'The horn in F sounds a perfect 5th lower than written', correct: true },
              { label: "The horn in F sounds a perfect 5th higher than written", correct: false },
              { label: "The horn in F sounds a perfect 4th lower than written", correct: false },
              { label: "The horn in F sounds an octave lower than written", correct: false },
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
        promptTemplate: 'Which statement about pitch-class sets is true?',
        hintTemplate: 'Pitch classes: C=0 through B=11. A pitch-class set lists unique PCs in ascending order. Normal order (also called normal form) puts them in the most compact arrangement.',
        params: {
          choiceSets: [
            [
              { label: 'A pitch-class set treats octave and enharmonic equivalents as one class, using integers 0-11', correct: true },
              { label: 'A pitch-class set keeps letter names and octave numbers, so C4 and C5 count as two different classes', correct: false },
              { label: 'Pitch-class sets only work for tonal music', correct: false },
              { label: 'Pitch-class set integers range from 0 to 7', correct: false },
            ],
            [
              { label: "Normal form packs the notes tightly within an octave, read from low to high", correct: true },
              { label: "Normal form packs the notes tightly within an octave, read from high to low", correct: false },
              { label: "Normal form packs the notes across the widest span within an octave, read from low to high", correct: false },
              { label: "Normal form packs the notes across the widest span within an octave, read from high to low", correct: false },
            ],
            [
              { label: 'The pitch classes {0, 4, 7} spell the notes of a C major chord', correct: true },
              { label: 'The pitch classes {0, 4, 7} spell the notes of an E major chord', correct: false },
              { label: 'The pitch classes {0, 4, 7} spell the notes of a G major chord', correct: false },
              { label: 'The pitch classes {0, 4, 7} spell the notes of a B major chord', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about interval vectors, prime form and Z-relations is true?',
        hintTemplate: 'Interval vector: counts of each interval class (ic 1-6) in a set, written as <x x x x x x>. Two sets are Z-related when they share the same interval vector but are NOT related by transposition or inversion (they belong to different set classes). Prime form selects the most compact representative after comparing transpositions and inversions, then starts it on 0.',
        params: {
          choiceSets: [
            [
              { label: 'The interval vector counts occurrences of each interval class (1 through 6) in a pitch-class set', correct: true },
              { label: "The interval vector counts occurrences of each interval class (1 through 12) in a pitch-class set", correct: false },
              { label: "The interval vector counts occurrences of each interval class (0 through 5) in a pitch-class set", correct: false },
              { label: "The interval vector counts occurrences of each interval class (0 through 11) in a pitch-class set", correct: false },
            ],
            [
              { label: 'Prime form compares transpositions and inversions, then starts the selected form on 0', correct: true },
              { label: 'Prime form compares transpositions alone, then starts the selected form on 0', correct: false },
              { label: 'Prime form compares transpositions and inversions, then keeps the selected form at its original pitch level', correct: false },
              { label: 'Prime form compares transpositions alone, then keeps the selected form at its original pitch level', correct: false },
            ],
            [
              { label: "Z-related sets have matching interval inventories but cannot be matched by shifting or mirroring", correct: true },
              { label: 'Z-related sets have matching interval inventories because transposition maps one directly onto the other', correct: false },
              { label: "Z-related sets share a prime form but differ in the number of occurrences of each interval class", correct: false },
              { label: "Z-related sets have different interval inventories but can be matched by shifting or mirroring", correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l8u27m2: Twelve-Tone Technique ----
  {
    moduleId: 'l8u27m2',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about twelve-tone technique is true?',
        hintTemplate: 'The tone row uses all 12 pitch classes in a fixed order. Transformations: P (prime), I (inversion), R (retrograde), RI (retrograde inversion). The 12x12 matrix organizes all 48 row forms.',
        params: {
          choiceSets: [
            [
              { label: 'The original row orders all 12 pitch classes, without duplicating one within that row', correct: true },
              { label: 'The original row orders all 12 pitch classes, then duplicates its first pitch class as a thirteenth entry', correct: false },
              { label: 'The original row divides all 12 pitch classes into two independent six-note rows', correct: false },
              { label: 'The original row divides all 12 pitch classes into three independent four-note rows', correct: false },
            ],
            [
              { label: "The four basic forms read the row forwards, backwards, upside down, or backwards and upside down", correct: true },
              { label: "The four basic forms read the row forwards, backwards, twice as slowly, or twice as quickly", correct: false },
              { label: "The four basic forms read the row forwards, upside down, twice as slowly, or twice as quickly", correct: false },
              { label: "The four basic forms read the row backwards, upside down, twice as slowly, or twice as quickly", correct: false },
            ],
            [
              { label: 'A 12×12 matrix displays 48 row forms', correct: true },
              { label: 'A 12×12 matrix displays 24 row forms', correct: false },
              { label: 'A 12×12 matrix displays 36 row forms', correct: false },
              { label: 'A 12×12 matrix displays 12 row forms', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l8u27m3: Planing, Polytonality, and Pandiatonicism ----
  {
    moduleId: 'l8u27m3',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about planing, polytonality and spectral music is true?',
        hintTemplate: 'Planing moves a chord shape in parallel. Polytonality sounds two or more keys at once; pandiatonicism uses one key\'s notes freely, without functional harmony. Spectralism builds harmony from the overtone series; microtonality uses steps smaller than a semitone.',
        params: {
          choiceSets: [
            [
              { label: 'Polytonality always sounds two or more keys at once, e.g. C major against F# major', correct: true },
              { label: "Polytonality always sounds two modes on one tonic, e.g. C Lydian against C Mixolydian", correct: false },
              { label: "Polytonality always sounds two keys successively, e.g. C major followed by F# major", correct: false },
              { label: "Polytonality always sounds one key in two registers, e.g. C major in treble and bass", correct: false },
            ],
            [
              { label: 'Pandiatonicism uses a diatonic collection without requiring functional progressions', correct: true },
              { label: 'Pandiatonicism uses a chromatic collection without requiring functional progressions', correct: false },
              { label: 'Pandiatonicism uses a diatonic collection while requiring functional progressions', correct: false },
              { label: 'Pandiatonicism uses a chromatic collection while requiring functional progressions', correct: false },
            ],
            [
              { label: 'Chromatic planing always keeps the exact intervals; diatonic planing adjusts them to the scale', correct: true },
              { label: "Chromatic planing usually adjusts intervals to the scale; diatonic planing keeps the exact intervals", correct: false },
              { label: "Chromatic planing moves the outer voices in contrary motion; diatonic planing moves them in parallel", correct: false },
              { label: "Chromatic planing holds the bass still while upper voices move; diatonic planing moves every voice", correct: false },
            ],
            [
              { label: "Spectral music builds chords by studying a sound's constituent frequencies", correct: true },
              { label: "Spectral music builds chords by studying a twelve-tone row's ordered pitches", correct: false },
              { label: "Spectral music builds chords by studying a key's cycle of dominant chords", correct: false },
              { label: "Spectral music builds chords by studying a melody's written note durations", correct: false },
            ],
            [
              { label: 'Microtonality uses intervals smaller than a semitone, not only the 12 standard pitches', correct: true },
              { label: "Microtonality uses intervals equal to a semitone, restricted to the 12 standard pitches", correct: false },
              { label: "Microtonality uses changes of loudness rather than changes of pitch", correct: false },
              { label: "Microtonality uses changes of duration rather than changes of pitch", correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

  // ---- l8u27m4: Minimalism, Aleatory, and Extended Techniques ----
  {
    moduleId: 'l8u27m4',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about minimalism, aleatory and extended techniques is true?',
        hintTemplate: 'Minimalism: repetitive patterns, gradual process, limited harmonic material. Pioneers: Reich (phasing), Glass (additive process), Riley (tape loops). Aleatory leaves elements to chance; extended techniques are unconventional ways of playing or singing.',
        params: {
          choiceSets: [
            [
              { label: 'Phasing shifts two identical repeating patterns gradually out of synchronization', correct: true },
              { label: 'Phasing keeps two identical repeating patterns exactly synchronized', correct: false },
              { label: 'Phasing expands two identical repeating patterns by adding notes', correct: false },
              { label: 'Phasing gives two identical repeating patterns new pitches chosen by chance', correct: false },
            ],
            [
              { label: 'An additive process lengthens a repeating pattern by gradually inserting notes', correct: true },
              { label: 'An additive process shortens a repeating pattern by gradually deleting notes', correct: false },
              { label: 'An additive process shifts two repeating patterns gradually out of synchronization', correct: false },
              { label: 'An additive process chooses the notes of a repeating pattern by chance', correct: false },
            ],
            [
              { label: 'Aleatory music leaves some elements to chance or to the performer\'s choice', correct: true },
              { label: "Aleatory music fixes pitches, durations and dynamics in advance without chance or performer choice", correct: false },
              { label: "Aleatory music means expanding a repeated pattern by gradually adding notes to it", correct: false },
              { label: "Aleatory music means shifting two identical repeated patterns gradually out of sync", correct: false },
            ],
            [
              { label: 'Extended techniques include multiphonics, prepared piano, col legno and Sprechstimme', correct: true },
              { label: 'Extended techniques include phasing, addition, repetition and gradual transformation', correct: false },
              { label: 'Extended techniques include coin tosses, star charts, mobile form and chance operations', correct: false },
              { label: 'Extended techniques include steady pulse, drones, repeated patterns and additive rhythms', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 5,
  },

  // ---- l8u27m5: Advanced Rhythm ----
  {
    moduleId: 'l8u27m5',
    templates: [
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about polyrhythm, hemiola and metric modulation is true?',
        hintTemplate: 'Polyrhythm: two divisions of the same span at once (3 against 2). Polymeter: two meters at once. Hemiola: 2 × 3 beats regrouped as 3 × 2. Metric modulation: a note value of the old tempo becomes a note value of the new one. In simple meter, a sixteenth-note quintuplet fits five equal notes into the span of four ordinary sixteenths.',
        params: {
          choiceSets: [
            [
              { label: 'A polyrhythm sounds two conflicting divisions of the same span at once, e.g. 3 against 2', correct: true },
              { label: "A polyrhythm usually divides the same span identically in each part, e.g. 3 equal notes against 3 equal notes", correct: false },
              { label: "A polyrhythm speeds up a single rhythmic pattern, e.g. repeated eighth notes accelerating from 80 to 120 beats per minute", correct: false },
              { label: "A polyrhythm changes every part to a new meter together, e.g. 3/4 followed by 4/4 at the next bar line", correct: false },
            ],
            [
              { label: 'Polymeter sets two meters against each other, e.g. 3/4 in one part against 4/4 in another', correct: true },
              { label: "Polymeter keeps the same meter in both parts, e.g. 3/4 in one part against 3/4 in another", correct: false },
              { label: "Polymeter changes the meter of both parts together, e.g. 3/4 in both parts followed by 4/4 in both", correct: false },
              { label: "Polymeter divides one shared meter differently, e.g. three notes against two inside one bar of 6/8", correct: false },
            ],
            [
              { label: 'A hemiola regroups six beats from 2 × 3 into 3 × 2, e.g. two bars of 3/4 felt as one bar of 3/2', correct: true },
              { label: "A hemiola usually doubles the tempo, e.g. six quarter-note beats squeezed into the duration of three", correct: false },
              { label: 'A hemiola keeps six beats in 3 + 3 but shifts the accent to beat 2 of each bar', correct: false },
              { label: "A hemiola adds a beat to each triple bar, e.g. two bars of 3/4 expanded into two bars of 4/4", correct: false },
            ],
            [
              { label: 'Metric modulation: if triplet eighths at ♩ = 120 become the new eighth notes, the new ♩ = 180', correct: true },
              { label: "Metric modulation: if triplet eighths at ♩ = 120 become the new eighth notes, the new ♩ = 120", correct: false },
              { label: "Metric modulation: if triplet eighths at ♩ = 120 become the new eighth notes, the new ♩ = 80", correct: false },
              { label: "Metric modulation: if triplet eighths at ♩ = 120 become the new eighth notes, the new ♩ = 240", correct: false },
            ],
            [
              { label: 'In simple meter, a sixteenth-note quintuplet fits five notes into the time of four ordinary sixteenths', correct: true },
              { label: 'In simple meter, a sixteenth-note quintuplet fits five notes into the time of three ordinary sixteenths', correct: false },
              { label: 'In simple meter, a sixteenth-note quintuplet fits five notes into the time of five ordinary sixteenths', correct: false },
              { label: 'In simple meter, a sixteenth-note quintuplet fits five notes into the time of six ordinary sixteenths', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

];

export default templates;
