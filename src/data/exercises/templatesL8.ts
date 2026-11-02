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
        hintTemplate: 'Fugue exposition: subject enters in tonic, answer enters in dominant (real or tonal), subsequent voices enter alternating T-D. A countersubject accompanies each new entry.',
        params: {
          choiceSets: [
            [
              { label: 'The subject enters first in the tonic key, and the answer enters in the dominant', correct: true },
              { label: 'The answer enters first, in the subdominant, and the subject follows it in the tonic key', correct: false },
              { label: 'Both subject and answer are in the tonic, so the exposition stays in its home key from the first entry on', correct: false },
              { label: 'The subject enters first in the dominant key, and the answer then enters in the tonic key', correct: false },
            ],
            [
              { label: 'A tonal answer adjusts intervals to avoid tonicizing the dominant at the entry point', correct: true },
              { label: 'A tonal answer transposes the subject exactly to the dominant, without changing any interval', correct: false },
              { label: 'A tonal answer is in a different meter', correct: false },
              { label: 'Tonal and real answers are the same concept under two names, used in different periods', correct: false },
            ],
            [
              { label: 'A real answer transposes the subject exactly to the dominant (up a P5 or down a P4)', correct: true },
              { label: 'A real answer changes some of the subject\'s intervals so it can stay in the tonic', correct: false },
              { label: "A tonal answer, not a real one, transposes the subject's intervals exactly to the dominant, a P5 above", correct: false },
              { label: 'A real answer is the countersubject, a second melody written against the subject', correct: false },
            ],
            [
              { label: 'The countersubject is a recurring melodic line that accompanies each new entry of the subject', correct: true },
              { label: 'The countersubject is just the subject itself, restated in the tonic each time a new voice enters', correct: false },
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
        promptTemplate: 'Which statement about fugal episodes, stretto and devices is true?',
        hintTemplate: 'Episodes: passages between subject entries, often using sequences based on fragments. Stretto: overlapping subject entries where the answer begins before the subject finishes.',
        params: {
          choiceSets: [
            [
              { label: 'In stretto, a new entry begins the subject before the previous one has finished it', correct: true },
              { label: 'In stretto each voice waits for the previous entry to end, and only then enters', correct: false },
              { label: 'In stretto, the wider the gap between entries, the more dramatically forceful the passage', correct: false },
              { label: 'Stretto is reserved for the exposition and avoided near the end of the fugue', correct: false },
            ],
            [
              { label: 'Episodes modulate between key areas, often using sequences derived from the subject', correct: true },
              { label: 'Episodes always state the whole subject in the tonic key, without modulating', correct: false },
              { label: 'Episodes are the middle entries: complete statements of the subject in related keys', correct: false },
              { label: 'Episodes must stay in the tonic key', correct: false },
            ],
            [
              { label: 'Augmentation doubles the note values', correct: true },
              { label: 'Augmentation adds extra notes to the subject while keeping all of its note values the same', correct: false },
              { label: 'Augmentation is the same as inversion', correct: false },
              { label: 'Augmentation shortens the note values', correct: false },
            ],
            [
              { label: 'Diminution presents the subject in shorter note values (usually halved)', correct: true },
              { label: 'Diminution removes notes from the subject but keeps its original note values', correct: false },
              { label: 'Diminution presents the subject in longer note values (usually doubled)', correct: false },
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
        promptTemplate: 'Which statement about the kinds of canon is true?',
        hintTemplate: 'Canon types: strict (exact imitation), at the octave, at the 5th, in inversion (contrary motion), in retrograde (crab canon), double canon (2 independent canons).',
        params: {
          choiceSets: [
            [
              { label: 'A canon in inversion (mirror canon) imitates the melody in contrary motion', correct: true },
              { label: 'A canon in inversion plays the melody backwards, last note first, at the same pitch level', correct: false },
              { label: 'A canon in inversion reverses the rhythm', correct: false },
              { label: 'Canon in inversion is the same as augmentation: the follower restates the melody in longer note values', correct: false },
            ],
            [
              { label: 'A crab canon (canon cancrizans) presents the melody in retrograde', correct: true },
              { label: 'A crab canon (canon cancrizans) turns the melody upside down, in contrary motion', correct: false },
              { label: 'A crab canon (canon cancrizans) doubles the note values in the follower', correct: false },
              { label: 'A crab canon (canon cancrizans) is a perpetual canon at the unison, with voices entering at regular intervals', correct: false },
            ],
            [
              { label: 'A perpetual canon loops to its start', correct: true },
              { label: 'A perpetual canon keeps adding voices and speeding up until it reaches a final cadence', correct: false },
              { label: 'A perpetual canon gradually speeds up', correct: false },
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
        promptTemplate: 'Which statement about sonata form is true?',
        hintTemplate: 'Sonata form sections: Exposition (FTG-TR-STG-CT), Development (fragmentation, sequences, remote keys), Recapitulation (all in tonic), optional Coda.',
        params: {
          choiceSets: [
            [
              { label: 'The transition in the exposition modulates from tonic to the secondary key area', correct: true },
              { label: 'The transition in the exposition stays in the tonic and only introduces the second theme', correct: false },
              { label: 'The transition is the closing material, which confirms the new key after the second theme', correct: false },
              { label: 'The transition is always omitted', correct: false },
            ],
            [
              { label: 'The development typically features fragmentation, sequence, and modulation through remote keys', correct: true },
              { label: "The development builds its retransition on the tonic to prepare the return", correct: false },
              { label: 'The development stays in the tonic', correct: false },
              { label: "The development sets the exposition's themes aside, introducing new melodies, each heard for the first time", correct: false },
            ],
            [
              { label: 'A false recapitulation begins the return of the theme in the wrong key before the real recap', correct: true },
              { label: 'A false recapitulation is the real recapitulation in the tonic key, with the first theme left out of it', correct: false },
              { label: 'A false recapitulation is the retransition, the passage built on the dominant to prepare the real return', correct: false },
              { label: 'A false recapitulation comes after the real recapitulation, as the opening of an expanded coda', correct: false },
            ],
            [
              { label: 'In a minor-key sonata, the second theme is typically in the relative major (III)', correct: true },
              { label: 'In a minor-key sonata, the second theme normally stays in the tonic minor and never modulates', correct: false },
              { label: 'Minor-key sonatas usually put the second theme in the subdominant (iv), a 4th above the tonic', correct: false },
              { label: 'In a minor-key sonata, the second theme is typically in the dominant minor (v), a 5th above the tonic', correct: false },
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
        hintTemplate: 'Ritornello: recurring orchestral passage alternating with solo episodes (Baroque concerto). Sonata-rondo: ABACAB\'A combines rondo and sonata principles.',
        params: {
          choiceSets: [
            [
              { label: 'Ritornello form alternates orchestral tutti passages with solo episodes', correct: true },
              { label: 'Ritornello form alternates solo passages with orchestral episodes, so the soloist plays the recurring theme', correct: false },
              { label: 'Ritornello only uses soloists', correct: false },
              { label: 'Ritornello form has no recurring material: each orchestral passage brings in a theme of its own', correct: false },
            ],
            [
              { label: 'Sonata-rondo combines the recurring A theme of rondo with sonata-form tonal relationships', correct: true },
              { label: 'Sonata-rondo is a plain rondo without any recurring theme, and it is used only in vocal music', correct: false },
              { label: 'Sonata-rondo is an ordinary rondo, ABACA, whose episodes stay in the tonic key', correct: false },
              { label: 'In sonata-rondo, the B section returns in the dominant in the second half', correct: false },
            ],
            [
              { label: 'A passacaglia is a set of variations over a recurring bass line (ground bass)', correct: true },
              { label: 'A passacaglia is a fugue in which the subject never returns once the exposition has ended', correct: false },
              { label: 'A passacaglia is a type of rondo (ABACA), in which a refrain keeps returning between contrasting episodes', correct: false },
              { label: 'A passacaglia has no recurring element', correct: false },
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
              { label: 'Strings from highest to lowest: violin I, violin II, viola, cello, double bass', correct: true },
              { label: 'Strings from highest to lowest: violas, violin I, violin II, double basses, cellos', correct: false },
              { label: 'Strings from highest to lowest: violin I, violin II, cello, viola, double bass', correct: false },
              { label: 'Double bass is higher than cello', correct: false },
            ],
            [
              { label: 'A Bb clarinet always sounds a major 2nd lower than written: it reads C and you hear Bb', correct: true },
              { label: 'A Bb clarinet sounds exactly as written, so its written C is heard as C', correct: false },
              { label: 'Bb clarinet sounds higher than written', correct: false },
              { label: 'Only percussion instruments transpose', correct: false },
            ],
            [
              { label: 'The horn in F sounds a perfect 5th lower than written', correct: true },
              { label: 'The horn in F sounds a perfect 5th higher than written, so its written C sounds as G', correct: false },
              { label: 'The horn in F is non-transposing, so its written C is the C you hear', correct: false },
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
        promptTemplate: 'Which statement about pitch-class sets is true?',
        hintTemplate: 'Pitch classes: C=0 through B=11. A pitch-class set lists unique PCs in ascending order. Normal form puts them in the most compact arrangement.',
        params: {
          choiceSets: [
            [
              { label: 'A pitch-class set treats octave and enharmonic equivalents as one class, using integers 0-11', correct: true },
              { label: 'A pitch-class set keeps letter names and octave numbers, so C4 and C5 count as two different classes', correct: false },
              { label: 'Pitch-class sets only work for tonal music', correct: false },
              { label: 'Pitch-class set integers range from 0 to 7', correct: false },
            ],
            [
              { label: 'Normal form always arranges the set in its most compact ascending order', correct: true },
              { label: 'Normal form always lists the pitch classes in numerical order from 0 to 11, whatever the span', correct: false },
              { label: 'Normal form uses descending order', correct: false },
              { label: 'There is no standard ordering for sets', correct: false },
            ],
            [
              { label: 'The set {C, E, G} = {0, 4, 7} is a major triad expressed as pitch classes', correct: true },
              { label: '{0, 4, 7} is a minor triad, because 4 semitones above the root is always a minor 3rd', correct: false },
              { label: 'The set {C, E, G} = {0, 4, 7} is a diminished triad expressed as pitch classes', correct: false },
              { label: 'Triads cannot be expressed as pitch-class sets', correct: false },
            ],
          ],
        },
      },
      {
        type: 'multiple_choice',
        promptTemplate: 'Which statement about interval vectors, prime form and Z-relations is true?',
        hintTemplate: 'Interval vector: counts of each interval class (ic 1-6) in a set, written as <x x x x x x>. Two sets are Z-related when they share the same interval vector but are NOT related by transposition or inversion (they belong to different set classes).',
        params: {
          choiceSets: [
            [
              { label: 'The interval vector counts occurrences of each interval class (1 through 6) in a pitch-class set', correct: true },
              { label: 'The interval vector counts only the perfect intervals (4ths and 5ths) in a set and ignores every 2nd, 3rd, 6th and 7th', correct: false },
              { label: 'The interval vector uses letter names', correct: false },
              { label: "Interval vectors are another name for normal form, which lists a set's pitch classes in ascending order", correct: false },
            ],
            [
              { label: 'Prime form transposes and/or inverts a set to its most compact form, always starting on 0', correct: true },
              { label: 'Prime form is the same as normal form: the set is not transposed to 0 or inverted', correct: false },
              { label: 'Prime form only transposes', correct: false },
              { label: 'Prime form always starts on the highest note', correct: false },
            ],
            [
              { label: 'Z-related sets share the same interval vector but are not transposition/inversion equivalent', correct: true },
              { label: 'Z-related sets are transpositions of each other, so their interval vectors differ', correct: false },
              { label: 'Z-related sets share a prime form, which is why their interval vectors match', correct: false },
              { label: 'Z-relation does not exist in set theory', correct: false },
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
              { label: 'A twelve-tone row uses each of the 12 pitch classes exactly once before any is repeated', correct: true },
              { label: 'A twelve-tone row may repeat its 12 pitch classes freely within the prime row', correct: false },
              { label: 'A tone row uses only 7 pitches', correct: false },
              { label: 'A tone row must be a scale', correct: false },
            ],
            [
              { label: 'The four basic row transformations are Prime, Inversion, Retrograde, and Retrograde Inversion', correct: true },
              { label: 'The four basic row transformations are Prime, Inversion, Retrograde and Augmentation', correct: false },
              { label: 'There are only 2 basic row transformations, Prime and Retrograde, because inversion is not a row form', correct: false },
              { label: 'Tone rows stay fixed once written, so the composer uses the original prime row unchanged throughout the piece', correct: false },
            ],
            [
              { label: 'The 12x12 matrix contains all 48 possible forms (12P + 12I + 12R + 12RI)', correct: true },
              { label: 'The 12x12 matrix shows only the 12 transpositions of the prime row, since inversions and retrogrades cannot be read from it', correct: false },
              { label: 'The matrix contains 36 row forms: P, I and R, but not RI', correct: false },
              { label: 'A tone row may leave out one pitch class, as long as the other eleven keep a fixed order', correct: false },
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
        hintTemplate: 'Planing moves a chord shape in parallel. Polytonality sounds two keys at once; pandiatonicism uses one key\'s notes freely, without functional harmony. Spectralism builds harmony from the overtone series; microtonality uses steps smaller than a semitone.',
        params: {
          choiceSets: [
            [
              { label: 'Polytonality always sounds two or more keys at once, e.g. C major against F# major', correct: true },
              { label: 'Polytonality means changing key many times within one melody, one key at a time', correct: false },
              { label: 'Polytonality uses no keys at all', correct: false },
              { label: 'Polytonality is a rhythmic technique', correct: false },
            ],
            [
              { label: 'Pandiatonicism uses only the notes of one key, freely, without functional chord progressions', correct: true },
              { label: 'Pandiatonicism freely uses all twelve chromatic notes, with no key and no functional harmony', correct: false },
              { label: 'Pandiatonicism uses only pentatonic scales', correct: false },
              { label: 'Pandiatonicism requires V-I cadences', correct: false },
            ],
            [
              { label: 'Chromatic planing always keeps the exact intervals; diatonic planing adjusts them to the scale', correct: true },
              { label: 'Chromatic planing keeps every voice in the key; diatonic planing keeps exact intervals', correct: false },
              { label: 'Planing always uses contrary motion', correct: false },
              { label: 'Planing changes the chord at every step', correct: false },
            ],
            [
              { label: 'Spectral music derives harmony from the overtone series and acoustic analysis of sound', correct: true },
              { label: 'Spectral music builds all of its harmony from a twelve-tone row and avoids the overtone series', correct: false },
              { label: 'Spectral music uses traditional tonal harmony, with chords stacked in thirds and V-I cadences at phrase ends', correct: false },
              { label: 'Spectral music avoids all pitched sounds', correct: false },
            ],
            [
              { label: 'Microtonality uses intervals smaller than a semitone, not only the 12 standard pitches', correct: true },
              { label: 'Microtonality uses only the 12 standard pitches but plays each of them extremely quietly', correct: false },
              { label: 'Microtonality uses only the 12 standard pitches', correct: false },
              { label: 'Microtonality is the same as atonality: both terms describe music that has no tonal center', correct: false },
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
        hintTemplate: 'Minimalism: repetitive patterns, gradual process, limited harmonic material. Pioneers: Reich (phasing), Glass (additive process), Riley (tape loops). Aleatory leaves elements to chance; extended techniques are unconventional ways of playing.',
        params: {
          choiceSets: [
            [
              { label: 'Phasing starts from two identical patterns and shifts them gradually out of sync', correct: true },
              { label: 'Phasing gradually adds notes to a repeated pattern so that it slowly grows', correct: false },
              { label: 'Phasing uses twelve-tone technique', correct: false },
              { label: 'Phasing involves changing the pitch content', correct: false },
            ],
            [
              { label: 'Additive process gradually adds notes to a repeated pattern, creating a slowly expanding melody', correct: true },
              { label: 'Additive process gradually removes one note from the pattern, repetition after repetition, creating a slowly shrinking melody', correct: false },
              { label: 'Additive process changes key with each repetition', correct: false },
              { label: 'Additive process is the same as theme and variations: each repetition presents a new decorated version of the original theme', correct: false },
            ],
            [
              { label: 'Aleatory music leaves some elements to chance or to the performer\'s choice', correct: true },
              { label: 'Aleatory music fixes every note and rhythm in advance and leaves the performer no choices at all', correct: false },
              { label: 'Aleatory music is always electronic', correct: false },
              { label: 'Aleatory means very fast music', correct: false },
            ],
            [
              { label: 'Extended techniques include multiphonics, prepared piano, col legno, and sprechstimme', correct: true },
              { label: 'Extended techniques are another name for aleatory music: the performer decides which notes to play', correct: false },
              { label: 'Extended techniques only apply to percussion', correct: false },
              { label: 'Extended techniques are repetitive patterns that evolve gradually, such as phasing', correct: false },
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
        hintTemplate: 'Polyrhythm: two divisions of the same span at once (3 against 2). Polymeter: two meters at once. Hemiola: 2 × 3 beats regrouped as 3 × 2. Metric modulation: a note value of the old tempo becomes a note value of the new one.',
        params: {
          choiceSets: [
            [
              { label: 'A polyrhythm sounds two conflicting divisions of the same span at once, e.g. 3 against 2', correct: true },
              { label: 'A polyrhythm is one rhythm played in unison by many instruments, so all parts divide the beat alike', correct: false },
              { label: 'A polyrhythm is a gradual accelerando', correct: false },
              { label: 'A polyrhythm always needs a compound time signature such as 6/8 and can never be written in 4/4', correct: false },
            ],
            [
              { label: 'Polymeter sets two meters against each other, e.g. 3/4 in one part against 4/4 in another', correct: true },
              { label: 'Polymeter means the piece changes from 3/4 to 4/4 halfway through, with every part changing together', correct: false },
              { label: 'Polymeter uses only one meter', correct: false },
              { label: 'Polymeter is the same as syncopation, where accents fall off the beat inside one meter that the parts share', correct: false },
            ],
            [
              { label: 'A hemiola regroups six beats from 2 × 3 into 3 × 2, e.g. two bars of 3/4 felt as one bar of 3/2', correct: true },
              { label: 'A hemiola doubles the tempo for a single bar, so that six beats are squeezed into the time of three beats', correct: false },
              { label: 'A hemiola is a rest of half a beat', correct: false },
              { label: 'A hemiola only exists in jazz', correct: false },
            ],
            [
              { label: 'Metric modulation: if triplet eighths at ♩ = 120 become the new eighth notes, the new ♩ = 180', correct: true },
              { label: 'Metric modulation: if triplet eighths at ♩ = 120 become the new eighths, the tempo of the new passage is still ♩ = 120, since a metric modulation never changes speed', correct: false },
              { label: 'Metric modulation means changing key', correct: false },
              { label: 'Metric modulation is a gradual ritardando, the music slowing little by little until a new, calmer tempo is reached', correct: false },
            ],
            [
              { label: 'A quintuplet fits five equal notes into the time normally taken by four of the same value', correct: true },
              { label: 'A quintuplet stretches four notes over five beats, so each one lasts longer than it is written', correct: false },
              { label: 'A quintuplet can only be written in 5/4', correct: false },
              { label: 'A quintuplet is a phrase five bars long, made by adding one extra bar to a regular four-bar phrase', correct: false },
            ],
          ],
        },
      },
    ],
    targetCount: 6,
  },

];

export default templates;
