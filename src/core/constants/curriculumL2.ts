import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 2, Unit 4: All Major Keys and Scale Degrees
// Reference: 02-expanding-fundamentals.md §2.1–2.2
// ---------------------------------------------------------------------------

const l2u4m1: CurriculumModule = {
  id: 'l2u4m1',
  unitId: 'u4',
  levelId: 'l2',
  title: 'All Major Keys and the Circle of Fifths',
  subtitle: 'The full set of 15 major key signatures and how they connect',
  objectives: [
    'Identify all 15 major key signatures including enharmonic pairs',
    'Apply the order of sharps (F-C-G-D-A-E-B) and flats (B-E-A-D-G-C-F)',
    'Determine the key from a key signature and vice versa',
    'Use the Circle of Fifths as a map of all keys',
  ],
  concepts: [
    {
      title: 'The Full Set of Major Keys',
      explanation:
        'There are 15 major key signatures but only 12 distinct keys. Three pairs are enharmonic — they sound identical but are spelled differently: B/Cb, F#/Gb, and C#/Db. Sharp keys run from C (0 sharps) through C# (7 sharps). Flat keys run from C through Cb (7 flats).',
      tryThisQuery: 'B major scale',
      tryThisLabel: 'See B major — 5 sharps',
    },
    {
      title: 'Order of Sharps and Flats',
      explanation:
        'Sharps always appear in the same order: F-C-G-D-A-E-B. Each new sharp key adds the next sharp in line. G major has F#. D major has F# and C#. Flats are the reverse: B-E-A-D-G-C-F. F major has Bb. Bb major has Bb and Eb. This order never changes.',
      tryThisQuery: 'key of A',
      tryThisLabel: 'See A major — 3 sharps',
    },
    {
      title: 'Quick Identification Tricks',
      explanation:
        'For sharp keys: the last sharp is always the 7th scale degree — go up a half step to find the key name. If the last sharp is F#, the key is G. For flat keys: the second-to-last flat IS the key. If you have Bb and Eb, the key is Bb. The exception: one flat always means F major.',
      tryThisQuery: 'Db major scale',
      tryThisLabel: 'See Db major — 5 flats',
    },
  ],
  tasks: [
    {
      id: 'l2u4m1t1',
      instruction: 'Open the Circle of Fifths and name all sharp keys moving clockwise from C',
      query: 'circle of fifths',
    },
    {
      id: 'l2u4m1t2',
      instruction: "Type 'Ab major scale' — how many flats does it need? Can you name them in order?",
    },
    {
      id: 'l2u4m1t3',
      instruction: "Type 'E major scale' — the last sharp is D#. Go up a half step: E. The trick works!",
    },
  ],
  prerequisites: ['l1u3m4'],
};

const l2u4m2: CurriculumModule = {
  id: 'l2u4m2',
  unitId: 'u4',
  levelId: 'l2',
  title: 'Scale Degree Names and Functions',
  subtitle: 'The seven functional names every musician must know',
  objectives: [
    'Name all seven scale degrees: tonic, supertonic, mediant, subdominant, dominant, submediant, leading tone',
    'Understand the functional significance of each degree name',
    'Distinguish leading tone from subtonic',
  ],
  concepts: [
    {
      title: 'The Seven Scale Degree Names',
      explanation:
        'Each scale degree has a functional name: 1=Tonic (home), 2=Supertonic (above tonic), 3=Mediant (midpoint between tonic and dominant), 4=Subdominant (the "lower dominant" — a 5th below the tonic, as the dominant is a 5th above), 5=Dominant (creates tension toward tonic), 6=Submediant (the "lower mediant" — midway between the tonic and the subdominant below it), 7=Leading Tone (half step below tonic, strongest pull home).',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See all seven degrees of C major',
    },
    {
      title: 'Leading Tone vs. Subtonic',
      explanation:
        "When degree 7 is a half step below the tonic (as in major and harmonic minor), it's called the leading tone — it pulls strongly upward to resolve. When degree 7 is a whole step below the tonic (as in natural minor), it's called the subtonic — the pull is weaker. This distinction explains why harmonic minor exists: composers raised the 7th to create a leading tone.",
      tryThisQuery: 'A natural minor scale',
      tryThisLabel: 'Hear the subtonic in natural minor',
    },
    {
      title: 'Why These Names Matter',
      explanation:
        "The names aren't arbitrary labels — they describe harmonic function. The dominant (5) and leading tone (7) create tension. The tonic (1) provides resolution. The subdominant (4) and supertonic (2) create motion toward the dominant. Understanding function is the key to understanding harmony. The color system in this app encodes these functions: blue=tonic, amber=dominant, red=leading tone.",
      tryThisQuery: 'key of G',
      tryThisLabel: 'See degree colors in G major',
    },
  ],
  tasks: [
    {
      id: 'l2u4m2t1',
      instruction: "Open 'key of C' and name each scale degree by its functional name, from tonic to leading tone",
    },
    {
      id: 'l2u4m2t2',
      instruction: 'Look at the degree colors — which degree is blue (tonic)? Which is amber (dominant)? Which is red (leading tone)?',
    },
    {
      id: 'l2u4m2t3',
      instruction: "Type 'A natural minor scale' then 'A harmonic minor scale' — which raises the 7th to create a leading tone?",
    },
  ],
  prerequisites: ['l2u4m1'],
};

// ---------------------------------------------------------------------------
// Level 2, Unit 5: Minor Scales and Key Relationships
// Reference: 02-expanding-fundamentals.md §2.3
// ---------------------------------------------------------------------------

const l2u5m1: CurriculumModule = {
  id: 'l2u5m1',
  unitId: 'u5',
  levelId: 'l2',
  title: 'Natural Minor Scale',
  subtitle: 'The W-H-W-W-H-W-W pattern and the darker side of tonality',
  objectives: [
    'Build the natural minor scale from any starting note using W-H-W-W-H-W-W',
    'Hear the contrasting character of major and minor scales',
    'Understand that every minor key shares its key signature with a relative major',
  ],
  concepts: [
    {
      title: 'The Natural Minor Pattern',
      explanation:
        'The natural minor scale follows W-H-W-W-H-W-W — compare that to the major\'s W-W-H-W-W-W-H. The half steps fall in different places, and that changes everything. A natural minor is the easiest one to see: it uses only white keys, A through G and back to A.',
      tryThisQuery: 'A natural minor scale',
      tryThisLabel: 'Hear A natural minor — all white keys',
    },
    {
      title: 'Major vs. Minor Character',
      explanation:
        'Play a C major scale, then play a C minor scale. Minor sounds darker, more emotional — you can hear it instantly. The difference comes from three lowered degrees: the 3rd, 6th, and 7th are each a half step lower than in major. These three changes transform bright and resolved into dark and introspective.',
      tryThisQuery: 'C minor scale',
      tryThisLabel: 'Compare C minor with C major',
    },
  ],
  tasks: [
    {
      id: 'l2u5m1t1',
      instruction: "Play 'A natural minor scale' then 'C major scale' — they use the same notes but start on different notes. Hear how the mood changes completely",
    },
    {
      id: 'l2u5m1t2',
      instruction: "Type 'D minor scale' — which note gets a flat to maintain the W-H-W-W-H-W-W pattern?",
    },
    {
      id: 'l2u5m1t3',
      instruction: "Type 'E minor scale' — how many sharps does it need? Compare with G major (its relative major)",
    },
  ],
  prerequisites: ['l2u4m2'],
};

const l2u5m2: CurriculumModule = {
  id: 'l2u5m2',
  unitId: 'u5',
  levelId: 'l2',
  title: 'Harmonic and Melodic Minor',
  subtitle: 'Why three forms of minor exist — and what each one solves',
  objectives: [
    'Build harmonic minor by raising the 7th degree of natural minor',
    'Build melodic minor by raising both the 6th and 7th degrees ascending',
    'Understand why three forms exist: natural for purity, harmonic for cadences, melodic for smooth melody',
  ],
  concepts: [
    {
      title: 'Harmonic Minor',
      explanation:
        'Harmonic minor raises the 7th degree by a half step, creating a leading tone. A harmonic minor: A-B-C-D-E-F-G#. Now the V chord is major, giving the key a strong dominant-tonic pull. The trade-off: an augmented second (3 half steps) appears between the 6th and 7th degrees, giving harmonic minor its distinctive exotic sound.',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel: 'Hear the raised 7th',
    },
    {
      title: 'Melodic Minor',
      explanation:
        'Melodic minor fixes the augmented second by also raising the 6th degree — but traditionally only when ascending. Ascending: W-H-W-W-W-W-H. Descending: natural minor. A melodic minor ascending: A-B-C-D-E-F#-G#. In jazz, the ascending form is used in both directions and called the "jazz minor" scale.',
      tryThisQuery: 'A melodic minor scale',
      tryThisLabel: 'Hear melodic minor',
    },
    {
      title: 'Three Forms, Three Purposes',
      explanation:
        'Natural minor is pure and folk-like but its minor v chord lacks resolution power. Harmonic minor gives you a major V chord with a leading tone — essential for strong cadences. Melodic minor smooths the awkward augmented second for vocal and instrumental melodies. Composers choose between forms based on what the music needs at each moment.',
      tryThisQuery: 'E minor scale',
      tryThisLabel: 'Build E natural minor',
    },
  ],
  tasks: [
    {
      id: 'l2u5m2t1',
      instruction: "Play 'A natural minor', 'A harmonic minor', and 'A melodic minor' back to back — hear how each form sounds different",
    },
    {
      id: 'l2u5m2t2',
      instruction: "Type 'D harmonic minor scale' — which note is raised compared to D natural minor?",
    },
    {
      id: 'l2u5m2t3',
      instruction: "Type 'E melodic minor scale' — identify the two notes that are raised compared to natural minor",
    },
  ],
  prerequisites: ['l2u5m1'],
};

const l2u5m3: CurriculumModule = {
  id: 'l2u5m3',
  unitId: 'u5',
  levelId: 'l2',
  title: 'Relative and Parallel Keys',
  subtitle: 'Two ways to connect major and minor',
  objectives: [
    'Find relative major/minor pairs using the 6th degree / 3rd degree rule',
    'Understand parallel major/minor as same root, different quality',
    'See how these relationships appear on the Circle of Fifths',
  ],
  concepts: [
    {
      title: 'Relative Keys',
      explanation:
        'Relative keys share the same key signature but have different tonics. To find the relative minor of a major key, go to the 6th degree. C major → A minor. G major → E minor. To find the relative major, go to the 3rd degree of the minor scale. A minor → C major. The Circle of Fifths shows both: major keys on the outer ring, their relative minors on the inner ring.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See relative keys on the Circle',
    },
    {
      title: 'Parallel Keys',
      explanation:
        "Parallel keys share the same root but have different qualities. C major and C minor are parallel. They share the tonic note but differ in the 3rd, 6th, and 7th degrees. The parallel relationship becomes critical later in mode mixture — borrowing chords from the parallel key to add color.",
      tryThisQuery: 'C minor scale',
      tryThisLabel: 'Compare C minor with C major',
    },
  ],
  tasks: [
    {
      id: 'l2u5m3t1',
      instruction: "Type 'Eb major scale' — what is the 6th degree? That's the relative minor. Verify with the Circle of Fifths",
    },
    {
      id: 'l2u5m3t2',
      instruction: "Type 'C major scale' then 'C minor scale' — which three notes change? (3rd, 6th, 7th). These are parallel keys",
    },
    {
      id: 'l2u5m3t3',
      instruction: "On the Circle of Fifths, find D major on the outer ring. What minor key sits inside it? Verify with 'B minor scale'",
      query: 'circle of fifths',
    },
  ],
  prerequisites: ['l2u5m2'],
};

// ---------------------------------------------------------------------------
// Level 2, Unit 6: Compound Meter and Syncopation
// Reference: 02-expanding-fundamentals.md §2.4–2.5
// Note: The app has no rhythm/notation visualization UI. These modules are
// knowledge-focused with tryThisQuery referencing relevant scales/chords
// for musical context — same approach as L9 ear training modules.
// ---------------------------------------------------------------------------

const l2u6m1: CurriculumModule = {
  id: 'l2u6m1',
  unitId: 'u6',
  levelId: 'l2',
  title: 'Compound Meter: 6/8, 9/8, 12/8',
  subtitle: 'When beats divide into three — the lilting feel of compound time',
  objectives: [
    'Distinguish simple meter (beats divide by 2) from compound meter (beats divide by 3)',
    'Read compound time signatures: 6/8, 9/8, 12/8',
    'Feel the difference between 3/4 (three duple beats) and 6/8 (two triple beats)',
  ],
  concepts: [
    {
      title: 'Simple vs. Compound',
      explanation:
        'In simple meter, each beat divides naturally into two equal parts (a quarter note splits into two eighths). In compound meter, each beat divides into three (a dotted quarter splits into three eighths). The top number in compound signatures is 6, 9, or 12 — divide by 3 to find the number of beats: 6/8 has 2 beats, 9/8 has 3, 12/8 has 4.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Feel a lilting pulse — ONE-and-a TWO-and-a',
    },
    {
      title: '3/4 vs. 6/8',
      explanation:
        '3/4 has three beats, each dividing into two: ONE-and TWO-and THREE-and. 6/8 has two beats, each dividing into three: ONE-and-a TWO-and-a. Same total number of eighth notes per measure (six), but different grouping. 3/4 feels like a waltz; 6/8 feels like a jig. The distinction is about feel, not math.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Try counting in groups of 3 vs groups of 2',
    },
  ],
  tasks: [
    {
      id: 'l2u6m1t1',
      instruction: 'Tap a steady pulse and group eighth notes by threes: ONE-and-a TWO-and-a. This is the feel of 6/8 — two big beats, each with three subdivisions',
    },
    {
      id: 'l2u6m1t2',
      instruction: 'Now tap in 3/4: ONE-and TWO-and THREE-and. Same number of eighth notes, but the accent pattern is completely different. Feel the waltz vs. jig distinction',
    },
  ],
  prerequisites: ['l2u5m3'],
};

const l2u6m2: CurriculumModule = {
  id: 'l2u6m2',
  unitId: 'u6',
  levelId: 'l2',
  title: 'Syncopation and Triplets',
  subtitle: 'Rhythms that push against the beat — accents on weak beats and borrowed divisions',
  objectives: [
    'Define syncopation as accenting beats or parts of beats that are normally weak',
    'Understand triplets as borrowed groupings of three within a duple context',
    'Hear how syncopation creates energy and forward momentum',
  ],
  concepts: [
    {
      title: 'Syncopation',
      explanation:
        "Syncopation places accents where the ear doesn't expect them — on weak beats or between beats. Instead of ONE-two-THREE-four, a syncopated rhythm might stress the 'and' of beat 2: one-two-AND-three-four. This displacement creates rhythmic tension and energy. Syncopation is the driving force behind jazz, funk, Latin music, and virtually all popular music. Without it, rhythm is predictable; with it, rhythm comes alive.",
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Play a chord — now imagine striking it on the "and" of 2',
    },
    {
      title: 'Triplets and Duplets',
      explanation:
        'A triplet divides a beat that normally has two subdivisions into three equal parts. In 4/4, an eighth-note triplet squeezes three notes into the space of two — it creates a brief compound feel inside simple meter. The reverse also exists: a duplet divides a compound beat into two instead of three. These borrowed divisions add rhythmic variety and cross-rhythm effects.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Hear a chord — imagine three pulses in one beat',
    },
  ],
  tasks: [
    {
      id: 'l2u6m2t1',
      instruction: 'Clap steady quarter notes, then shift your clap to the "and" between beats. That off-beat emphasis is syncopation',
    },
    {
      id: 'l2u6m2t2',
      instruction: 'Tap two even beats, then try tapping three evenly in the same time span. That 3-against-2 feeling is the essence of a triplet',
    },
  ],
  prerequisites: ['l2u6m1'],
};

// ---------------------------------------------------------------------------
// Level 2, Unit 7: Intervals, Triads, and Diatonic Harmony
// Reference: 02-expanding-fundamentals.md §2.6–2.8
// ---------------------------------------------------------------------------

const l2u7m1: CurriculumModule = {
  id: 'l2u7m1',
  unitId: 'u7',
  levelId: 'l2',
  title: 'Interval Quality: Perfect, Major, Minor',
  subtitle: 'Classifying intervals by both number and quality',
  objectives: [
    'Understand that intervals have both a number (distance) and a quality (character)',
    'Classify perfect intervals: unison, 4th, 5th, octave',
    'Classify major and minor intervals: 2nd, 3rd, 6th, 7th',
  ],
  concepts: [
    {
      title: 'The Quality System',
      explanation:
        "In Level 1, you measured intervals by number: a 3rd, a 5th. Now add quality — which refines the number with precise character. Perfect intervals (unison, 4th, 5th, octave) occur naturally between the tonic and scale degrees 1, 4, 5, and 8. Major intervals (2nd, 3rd, 6th, 7th) occur between the tonic and upper degrees in a major scale. Minor intervals are one half step smaller than major.",
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See all major-scale intervals from C',
    },
    {
      title: 'How to Determine Quality',
      explanation:
        "Method: (1) Count the letter names to get the interval number. (2) Count the half steps. (3) Compare to the major scale: if the upper note is in the major scale of the lower note, it's major (for 2,3,6,7) or perfect (for 1,4,5,8). (4) One half step smaller than major = minor.",
      tryThisQuery: 'Cm',
      tryThisLabel: 'Hear a minor 3rd in C minor',
    },
    {
      title: 'Hearing the Difference',
      explanation:
        'Perfect intervals sound "open" and "hollow" — stable and strong. Major intervals sound bright and wide. Minor intervals are one half step narrower and sound darker, more emotional. Play C to E (major 3rd) then C to Eb (minor 3rd) — the half-step difference creates an entirely different character.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear the major 3rd in a chord',
    },
  ],
  tasks: [
    {
      id: 'l2u7m1t1',
      instruction: "Type 'C major chord' then 'Cm' — the only difference is E vs. Eb. Major 3rd (4 half steps) vs. minor 3rd (3 half steps). One semitone changes everything",
    },
    {
      id: 'l2u7m1t2',
      instruction: "Type 'C major scale' — every interval from C to each upper note is either perfect (4th, 5th, octave) or major (2nd, 3rd, 6th, 7th). This is the reference set",
    },
    {
      id: 'l2u7m1t3',
      instruction: 'What quality is the interval from C to F? Count: C-D-E-F = 4th. F is in C major, so it is a perfect 4th',
    },
  ],
  prerequisites: ['l2u6m2'],
};

const l2u7m2: CurriculumModule = {
  id: 'l2u7m2',
  unitId: 'u7',
  levelId: 'l2',
  title: 'Augmented, Diminished, and Compound Intervals',
  subtitle: 'The outer edges of interval quality and intervals beyond the octave',
  objectives: [
    'Understand augmented as one half step larger than perfect or major',
    'Understand diminished as one half step smaller than perfect or minor',
    'Identify compound intervals (9th, 10th, 11th, 13th) and the tritone',
  ],
  concepts: [
    {
      title: 'Augmented and Diminished',
      explanation:
        "Augmented means one half step larger than perfect or major. Diminished means one half step smaller than perfect or minor. A perfect 5th (7 half steps) becomes augmented at 8 half steps or diminished at 6. The interval of 6 half steps — the tritone — goes by two names: augmented fourth or diminished fifth. Same sound, different spelling.",
      tryThisQuery: 'C7',
      tryThisLabel: 'Hear the tritone inside C7',
    },
    {
      title: 'The Tritone',
      explanation:
        'The tritone divides the octave exactly in half and is the most unstable interval in tonal music. It plays a critical role in dominant seventh chords, where it creates the tension that drives resolution. Inside C7, the tritone lies between E and Bb — both notes demanding resolution.',
      tryThisQuery: 'Cdim',
      tryThisLabel: 'Hear the diminished 5th in Cdim',
    },
    {
      title: 'Compound Intervals',
      explanation:
        'Intervals larger than an octave are compound intervals. A 9th = octave + 2nd. A 10th = octave + 3rd. An 11th = octave + 4th. A 13th = octave + 6th. The quality rules carry over: a major 9th has the same quality as a major 2nd. These intervals become important in extended chords.',
      tryThisQuery: 'Cmaj9',
      tryThisLabel: 'The 9th is a compound 2nd',
    },
  ],
  tasks: [
    {
      id: 'l2u7m2t1',
      instruction: "What's the interval from C to F#? Count letters (C-D-E-F = 4th). F is in C major but F# is a half step higher, so it's an augmented 4th — a tritone",
    },
    {
      id: 'l2u7m2t2',
      instruction: "Type 'C7' and listen — the tritone between E and Bb is what gives the dominant seventh its tension and need to resolve",
    },
    {
      id: 'l2u7m2t3',
      instruction: "Type 'Cmaj9' — the 9th (D) is the 2nd degree an octave higher. What quality is C to D? Major 2nd, so major 9th",
    },
  ],
  prerequisites: ['l2u7m1'],
};

const l2u7m3: CurriculumModule = {
  id: 'l2u7m3',
  unitId: 'u7',
  levelId: 'l2',
  title: 'The Four Triad Types',
  subtitle: 'Major, minor, diminished, augmented — building and identifying all four',
  objectives: [
    'Build all four triad types from any root note using stacked thirds',
    'Understand the stability distinction: perfect 5th vs. altered 5th',
    'Hear the characteristic sound of each quality',
  ],
  concepts: [
    {
      title: 'Four Triad Qualities',
      explanation:
        'Every triad stacks two thirds. Major = major 3rd + minor 3rd (M3+m3), root to 5th is a perfect 5th. Minor = minor 3rd + major 3rd (m3+M3), root to 5th is still a perfect 5th. Diminished = minor 3rd + minor 3rd (m3+m3), root to 5th is a diminished 5th. Augmented = major 3rd + major 3rd (M3+M3), root to 5th is an augmented 5th.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear the stable major triad',
    },
    {
      title: 'Stable vs. Unstable',
      explanation:
        "Major and minor are stable — they both have a perfect 5th, which provides a grounded foundation. Diminished sounds tense and small — its diminished 5th compresses the chord. Augmented sounds strange and unresolved — its augmented 5th expands the chord. Stability vs. instability is determined by whether the 5th is perfect or altered.",
      tryThisQuery: 'Cdim',
      tryThisLabel: 'Hear diminished — tense and small',
    },
    {
      title: 'Reading Chord Symbols',
      explanation:
        "Letter alone = major (C). Lowercase 'm' = minor (Cm). 'dim' or '°' = diminished (Cdim). 'aug' or '+' = augmented (Caug). These symbols tell you both the root and the quality at a glance.",
      tryThisQuery: 'Caug',
      tryThisLabel: 'Hear augmented — floating and unresolved',
    },
  ],
  tasks: [
    {
      id: 'l2u7m3t1',
      instruction: "Build all four C triads: 'C major chord', 'Cm', 'Cdim', 'Caug' — which two sound stable? Which two sound unstable?",
    },
    {
      id: 'l2u7m3t2',
      instruction: "Type 'Fdim' and count: root to 3rd is 3 half steps (m3), 3rd to 5th is 3 half steps (m3). Both thirds are minor — that's what makes it diminished",
    },
    {
      id: 'l2u7m3t3',
      instruction: "Type 'Caug' and count: root to 3rd is 4 half steps (M3), 3rd to 5th is 4 half steps (M3). Both thirds are major — augmented",
    },
  ],
  prerequisites: ['l2u7m2'],
};

const l2u7m4: CurriculumModule = {
  id: 'l2u7m4',
  unitId: 'u7',
  levelId: 'l2',
  title: 'Triad Inversions and Figured Bass',
  subtitle: 'Same notes, different bass — root position, first inversion, second inversion',
  objectives: [
    'Understand root position, first inversion, and second inversion of triads',
    'Read figured bass symbols: 5/3, 6/3 (or just 6), and 6/4',
    'Use slash notation for inversions: C/E = first inversion, C/G = second inversion',
  ],
  concepts: [
    {
      title: 'Three Positions',
      explanation:
        'A triad has three notes, so it has three possible bass notes. Root position puts the root in the bass — the most grounded voicing. First inversion puts the 3rd in the bass — lighter and more melodic. Second inversion puts the 5th in the bass — unstable, with the 4th above the bass historically treated as a dissonance requiring resolution.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear root position — C in the bass',
    },
    {
      title: 'Figured Bass',
      explanation:
        'Figured bass numbers describe intervals above the bass note. Root position = 5/3 (a fifth and a third above the bass). First inversion = 6/3 (abbreviated to just 6). Second inversion = 6/4. This was the standard notation in the Baroque era and remains central to music theory analysis.',
      tryThisQuery: 'C/E',
      tryThisLabel: 'First inversion = 6 position',
    },
    {
      title: 'Why Inversions Matter',
      explanation:
        'Inversions let chords connect smoothly. Instead of jumping between root-position chords, inversions create stepwise bass lines — the most important ingredient of elegant voice leading. A bass line that moves by step sounds more polished than one that leaps constantly.',
      tryThisQuery: 'C/G',
      tryThisLabel: 'Second inversion = 6/4 position',
    },
  ],
  tasks: [
    {
      id: 'l2u7m4t1',
      instruction: "Type 'C major chord', 'C/E', and 'C/G' in sequence — same three notes, but hear how the character changes with each bass note",
    },
    {
      id: 'l2u7m4t2',
      instruction: "Type 'C/E' — E is in the bass. The intervals above are a 3rd (E to G) and a 6th (E to C). That's why it's called the 6 position",
    },
    {
      id: 'l2u7m4t3',
      instruction: "Type 'Am/C' — A minor with C in the bass. C is the 3rd of Am, so this is first inversion. Hear how it sounds lighter than root-position Am",
    },
  ],
  prerequisites: ['l2u7m3'],
};

const l2u7m5: CurriculumModule = {
  id: 'l2u7m5',
  unitId: 'u7',
  levelId: 'l2',
  title: 'Diatonic Triads and Roman Numerals',
  subtitle: 'The seven chords that belong to every major key — and how to name them',
  objectives: [
    'Build a triad on every degree of the major scale using only notes from that scale',
    'Know the quality pattern: I-ii-iii-IV-V-vi-vii°',
    'Read Roman numerals: uppercase = major, lowercase = minor, ° = diminished',
  ],
  concepts: [
    {
      title: 'Building Diatonic Triads',
      explanation:
        'Build a triad on each degree of the major scale using only notes from that scale. In C major: C-E-G (major), D-F-A (minor), E-G-B (minor), F-A-C (major), G-B-D (major), A-C-E (minor), B-D-F (diminished). The quality pattern is always I-ii-iii-IV-V-vi-vii° — in every major key. Only the note names change.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See all diatonic triads in C',
    },
    {
      title: 'Roman Numeral Conventions',
      explanation:
        'Uppercase Roman numerals indicate major triads (I, IV, V). Lowercase indicate minor triads (ii, iii, vi). The degree symbol (°) indicates diminished (vii°). This notation is universal — it works in any key. When you see I-IV-V, you know the chord functions regardless of what specific notes are used.',
      tryThisQuery: 'key of G',
      tryThisLabel: 'See the same pattern in G major',
    },
    {
      title: 'Why the Pattern Is Fixed',
      explanation:
        'The W-W-H-W-W-W-H step pattern of the major scale forces specific interval combinations at each degree. The half steps between degrees 3-4 and 7-1 create the diminished triad on vii and determine which triads are major versus minor. Change the scale and you change the pattern — which is exactly what happens in minor keys.',
      tryThisQuery: 'key of D',
      tryThisLabel: 'Verify the pattern in D major',
    },
  ],
  tasks: [
    {
      id: 'l2u7m5t1',
      instruction: "Open 'key of C' — play each diatonic chord. Before playing, predict whether it will sound major or minor based on its Roman numeral",
    },
    {
      id: 'l2u7m5t2',
      instruction: "Open 'key of G' — verify the same I-ii-iii-IV-V-vi-vii° pattern with different note names",
    },
    {
      id: 'l2u7m5t3',
      instruction: "Open 'key of Eb' — name all seven diatonic triads. What notes make up the ii chord?",
    },
  ],
  prerequisites: ['l2u7m4'],
};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

export const L2_UNITS: CurriculumUnit[] = [
  {
    id: 'u4',
    levelId: 'l2',
    title: 'All Major Keys and Scale Degrees',
    description: 'All 15 major key signatures, the Circle of Fifths, and scale degree names and functions',
    icon: 'scales',
    modules: [l2u4m1, l2u4m2],
    milestone: {
      skillsSummary: [
        'Identify all 15 major key signatures and navigate the full Circle of Fifths',
        'Name scale degrees by function: tonic, dominant, leading tone, and more',
        'Use quick-identification tricks for sharp and flat keys',
      ],
      bridgeText:
        'You know every major key and every scale degree by name. Now you will explore the darker side of tonality — the three forms of minor and how major and minor keys relate.',
      tryThisQuery: 'F# major scale',
      tryThisLabel: 'Build F# major — 6 sharps',
      tryThisPrompt: 'Can you name all 6 sharps before looking?',
    },
  },
  {
    id: 'u5',
    levelId: 'l2',
    title: 'Minor Scales and Key Relationships',
    description: 'Natural, harmonic, and melodic minor scales, plus relative and parallel key connections',
    icon: 'scales',
    modules: [l2u5m1, l2u5m2, l2u5m3],
    milestone: {
      skillsSummary: [
        'Build all three forms of minor scales in any key',
        'Understand why three forms exist and when each is used',
        'Find relative and parallel key relationships instantly',
      ],
      bridgeText:
        'You now command both sides of tonality — major and minor. Next, you will expand your rhythmic vocabulary with compound meter and syncopation.',
      tryThisQuery: 'D harmonic minor scale',
      tryThisLabel: 'Build D harmonic minor',
      tryThisPrompt: 'Which note is raised compared to natural minor?',
    },
  },
  {
    id: 'u6',
    levelId: 'l2',
    title: 'Compound Meter and Syncopation',
    description: 'Compound time signatures, syncopation, triplets, and advanced rhythmic concepts',
    icon: 'building-blocks',
    modules: [l2u6m1, l2u6m2],
    milestone: {
      skillsSummary: [
        'Distinguish simple meter from compound meter by how beats subdivide',
        'Read compound time signatures: 6/8, 9/8, 12/8',
        'Hear syncopation as accents on normally weak beats',
        'Understand triplets as borrowed groupings of three',
      ],
      bridgeText:
        'You understand both simple and compound rhythm. The final unit brings together the full interval system, all four triad types, and diatonic harmony.',
      tryThisQuery: 'A major scale',
      tryThisLabel: 'Feel the pulse in A major',
      tryThisPrompt: 'Try counting in groups of 3 (compound) then 2 (simple).',
    },
  },
  {
    id: 'u7',
    levelId: 'l2',
    title: 'Intervals, Triads, and Diatonic Harmony',
    description: 'The complete interval quality system, all four triad types, inversions with figured bass, and diatonic triads with Roman numerals',
    icon: 'chords',
    modules: [l2u7m1, l2u7m2, l2u7m3, l2u7m4, l2u7m5],
    milestone: {
      skillsSummary: [
        'Classify any interval by quality: perfect, major, minor, augmented, diminished',
        'Identify compound intervals and the tritone',
        'Build and identify all four triad types from any root',
        'Use figured bass and slash notation for inversions',
        'Build diatonic triads in any major key using the I-ii-iii-IV-V-vi-vii° pattern',
      ],
      bridgeText: '',
      tryThisQuery: 'key of Bb',
      tryThisLabel: 'Explore the key of Bb',
      tryThisPrompt: 'Name the diatonic triads before checking.',
    },
    completionContent: {
      startedWith: 'Four major keys and basic triads.',
      journeySummary: [
        'All 15 major key signatures and the complete Circle of Fifths',
        'Scale degree names and their functional significance',
        'Three forms of minor: natural, harmonic, and melodic',
        'Relative and parallel key relationships',
        'Compound meter, syncopation, and triplets',
        'The full interval quality system including augmented, diminished, and compound',
        'All four triad types and inversions with figured bass',
        'Diatonic triads and Roman numeral analysis',
      ],
      whatsNext:
        'Level 3 adds seventh chords, voice leading, cadences, phrase structure, and non-chord tones — the tools for analyzing real music.',
      tryThisQuery: 'key of Bb',
      tryThisLabel: 'Explore the key of Bb',
      tryThisPrompt:
        'Name all seven diatonic triads. You have every tool you need.',
    },
  },
];
