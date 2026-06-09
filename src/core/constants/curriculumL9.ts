import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 9: Ear Training & Aural Skills (Parallel Track)
// Runs alongside all theory levels. Unlocks after Level 1 completion.
// Engine support: PARTIAL for pitch/interval/scale/chord modules (audio
// playback works, but dedicated quiz UI not yet built). NONE for dictation,
// sight singing, and contextual listening modules.
//
// 15 modules across 3 units:
//   u30 (5 modules) — Pitch and Interval Training       [engine: PARTIAL]
//   u31 (5 modules) — Scale, Chord, and Dictation Skills [engine: PARTIAL]
//   u32 (5 modules) — Dictation, Sight Singing, and Contextual Listening [comingSoon]
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Unit 30: Pitch and Interval Training (5 modules)
// ---------------------------------------------------------------------------

const l9u30m1: CurriculumModule = {
  id: 'l9u30m1',
  unitId: 'u30',
  levelId: 'l9',
  title: 'Pitch Matching and Direction',
  subtitle: 'Match pitch by ear, identify melodic direction, and perceive register differences',
  objectives: [
    'Match pitch by singing or identifying notes on the piano',
    'Recognize ascending vs. descending melodic motion across registers',
    'Distinguish high from low register and perceive relative register placement',
  ],
  concepts: [
    {
      title: 'Pitch Matching',
      explanation:
        'The most fundamental aural skill is hearing a note and reproducing it — either by singing or finding it on an instrument. Start with single notes in the middle register (around middle C), then expand outward. Train by playing a note on the piano, then trying to find it again with your eyes closed. This builds the internal ear-to-hand connection that underpins all further ear training. The goal is not perfect pitch (which is largely innate) but reliable relative pitch — hearing a note in relation to a reference.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play through C major as a pitch reference',
    },
    {
      title: 'Direction of Motion',
      explanation:
        'Can you tell if a melody goes up, down, or stays the same? This is more intuitive than it sounds — but making the judgment conscious and precise is the goal. Play two notes in sequence and identify the direction. Ascending motion moves toward higher pitch; descending moves lower. Start with wide leaps (an octave apart) and gradually narrow the gap until you can detect motion by a single half step. This trains the contour perception you will need for melodic dictation later.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Listen to ascending stepwise motion',
    },
    {
      title: 'Register Perception',
      explanation:
        'High vs. low is always relative: a bass clarinet\'s "high" is a flute\'s "low." Register perception means identifying whether a note sits in the upper, middle, or lower range of the instrument. On the piano, the lowest octave has a booming, rumbling quality; the middle octaves sound clear and balanced; the highest octave is bright and thin. Train by playing notes across the full range and identifying which octave region they fall in without looking. This spatial hearing is essential for understanding orchestral voicings and arranging.',
      tryThisQuery: 'A major scale',
      tryThisLabel: 'Play A major — then try it in a different octave',
    },
  ],
  tasks: [
    {
      id: 'l9u30m1t1',
      instruction:
        "Type 'C major scale' and play through it on the piano. Try to sing each note as you hear it — match your voice to the pitch. Start in a comfortable range",
      query: 'C major scale',
    },
    {
      id: 'l9u30m1t2',
      instruction:
        'Play individual notes on the piano with your eyes closed — can you tell if the second note is higher or lower than the first? Start with wide leaps, then narrow the gap to adjacent keys',
    },
    {
      id: 'l9u30m1t3',
      instruction:
        'Play a note in the low register, then the same note name two octaves higher. Hear how the pitch quality changes but the note identity remains. This is register perception',
    },
  ],
  prerequisites: [],
};

const l9u30m2: CurriculumModule = {
  id: 'l9u30m2',
  unitId: 'u30',
  levelId: 'l9',
  title: 'Major vs Minor Recognition',
  subtitle: 'Distinguishing major and minor tonality by ear — chords, scales, and overall color',
  objectives: [
    'Distinguish major vs. minor triads by ear — bright/open vs. dark/somber',
    'Recognize major vs. minor tonality in scales and short melodies',
    'Develop instant gut-level recognition before theoretical explanation',
  ],
  concepts: [
    {
      title: 'Major vs. Minor Chords',
      explanation:
        'The most basic quality recognition in ear training. Major chords sound bright, open, and resolved. Minor chords sound dark, somber, and introspective. The theoretical explanation — the difference is the third degree, raised or lowered by a half step — is secondary at this stage. Train by playing major and minor chords side by side from the same root until the distinction becomes instant and automatic. This is a gut feeling first, an intellectual understanding second.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear major — then try "C minor chord"',
    },
    {
      title: 'Major vs. Minor Tonality',
      explanation:
        'Beyond individual chords, entire keys and melodies have a major or minor character. A melody in C major feels bright and settled; the same contour in C minor feels darker and more introspective. Listen to the overall emotional color rather than analyzing individual notes. Play a C major scale followed by a C natural minor scale — the shift in mood is unmistakable. This tonality recognition is the foundation for all further quality-based ear training.',
      tryThisQuery: 'C natural minor scale',
      tryThisLabel: 'Hear minor tonality — compare with C major scale',
    },
    {
      title: 'Training the Instant Judgment',
      explanation:
        'The goal of major/minor recognition is not analysis but reflex. You should hear the quality before your conscious mind names it. This requires repetition: play random major and minor chords from different roots and call out the quality as fast as possible. Speed matters because real music does not pause for you to analyze. Try less familiar roots — Ab, Db, F# — where your instrument familiarity cannot help. Once you can identify major vs. minor in under one second from any root, the skill is internalized.',
      tryThisQuery: 'Ab major chord',
      tryThisLabel: 'Try major from a less familiar root — still bright?',
    },
  ],
  tasks: [
    {
      id: 'l9u30m2t1',
      instruction:
        "Play 'C major chord' then 'C minor chord' back to back. Which sounds bright? Which sounds dark? Repeat until the distinction is instant",
      query: 'C major chord',
    },
    {
      id: 'l9u30m2t2',
      instruction:
        "Play 'G major chord' then 'Gm' — same exercise, different root. The quality difference should transfer regardless of the starting note",
      query: 'G major chord',
    },
    {
      id: 'l9u30m2t3',
      instruction:
        "Play 'C major scale' then 'C natural minor scale'. Listen to the overall color shift. Can you feel the mood change before the scale is halfway through?",
      query: 'C major scale',
    },
  ],
  prerequisites: ['l9u30m1'],
};

const l9u30m3: CurriculumModule = {
  id: 'l9u30m3',
  unitId: 'u30',
  levelId: 'l9',
  title: 'Interval Recognition: P1-P5',
  subtitle: 'Identifying perfect and small intervals by ear using song associations and direct recognition',
  objectives: [
    'Identify unison, minor 2nd, major 2nd, minor 3rd, major 3rd, perfect 4th, tritone, and perfect 5th by ear',
    'Use song associations as mnemonic training aids for each interval',
    'Recognize these intervals both ascending and descending',
  ],
  concepts: [
    {
      title: 'Song Associations: Small Intervals',
      explanation:
        'A proven mnemonic technique: associate each interval with a familiar melody opening. Minor 2nd ascending = Jaws theme. Major 2nd = Happy Birthday. Minor 3rd = Greensleeves. Major 3rd = When the Saints (oh-when). Perfect 4th = Here Comes the Bride. Tritone = The Simpsons (The-Simp). Perfect 5th = Twinkle Twinkle. These are training wheels — the goal is to internalize each interval sound directly, then retire the crutch. Start with ascending intervals only, then add descending once ascending is solid.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play C major — hear each interval from the root',
    },
    {
      title: 'Perfect vs. Imperfect Consonance',
      explanation:
        'The intervals in this module split into two families. Perfect consonances (P1, P4, P5) sound "open" and "hollow" — like a bell or an open string. They have a stark, bare quality. Imperfect consonances (m3, M3) sound "warm" and "blended" — the notes fuse smoothly but with more color. Seconds (m2, M2) are dissonances — they sound "rough" or "crunchy" when played together. The tritone is the most dissonant interval of all — tense, unstable, and demanding resolution. Learning to categorize by consonance/dissonance is faster than memorizing each interval individually. (In species counterpoint, studied in L4 and L6, the P4 above the bass is treated as a dissonance; the acoustic "perfect" classification here is ear-training-oriented.)',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear the major 3rd (C to E) and perfect 5th (C to G)',
    },
    {
      title: 'Ascending vs. Descending',
      explanation:
        'Every interval has a different character ascending vs. descending. Ascending minor 2nd sounds tense and creeping. Descending minor 2nd sounds sighing and resolving. Ascending perfect 4th sounds like a fanfare. Descending perfect 4th sounds grounded and cadential. You must train both directions independently — knowing an ascending perfect 5th does not automatically mean you can identify it descending. Use descending song associations as well: descending M2 = Mary Had a Little Lamb (first two notes), descending m3 = Hey Jude (hey-Jude). Build the descending set as a separate skill.',
      tryThisQuery: 'C7',
      tryThisLabel: 'Hear the tritone inside C7 (E to Bb)',
    },
  ],
  tasks: [
    {
      id: 'l9u30m3t1',
      instruction:
        "Type 'C major chord' — the interval from C to E is a major 3rd, and C to G is a perfect 5th. Sing the two intervals separately. Memorize each sound",
      query: 'C major chord',
    },
    {
      id: 'l9u30m3t2',
      instruction:
        'Play pairs of notes on the piano from C: C-Db (m2), C-D (M2), C-Eb (m3), C-E (M3), C-F (P4), C-Gb (tritone), C-G (P5). Name each before checking',
    },
    {
      id: 'l9u30m3t3',
      instruction:
        "Type 'C7' — find the tritone (E to Bb). This is the most unstable interval. Contrast it with the perfect 5th (C to G) in 'C major chord'. Stable vs. tense — hear the difference",
      query: 'C7',
    },
  ],
  prerequisites: ['l9u30m2'],
};

const l9u30m4: CurriculumModule = {
  id: 'l9u30m4',
  unitId: 'u30',
  levelId: 'l9',
  title: 'Interval Recognition: m6-P8',
  subtitle: 'Identifying large intervals by ear — sixths, sevenths, and the octave',
  objectives: [
    'Identify minor 6th, major 6th, minor 7th, major 7th, and perfect octave by ear',
    'Use song associations for large intervals, ascending and descending',
    'Combine with small-interval knowledge for complete simple interval recognition',
  ],
  concepts: [
    {
      title: 'Song Associations: Large Intervals',
      explanation:
        'Continuing the mnemonic approach for the upper half of the octave. Minor 6th = Love Story (Where Do I Begin). Major 6th = My Bonnie (my-bon). Minor 7th = Somewhere (West Side Story). Major 7th = Take On Me (take-on). Octave = Somewhere Over the Rainbow. Large intervals are harder to identify because they feel like "big leaps" and the size differences between them are proportionally smaller. The 6ths and 7ths are particularly tricky — they are inversions of 3rds and 2nds, so their character is related but wider. Train by contrasting pairs: m6 vs. M6, m7 vs. M7.',
      tryThisQuery: 'Cmaj7',
      tryThisLabel: 'Hear the major 7th interval (C to B)',
    },
    {
      title: 'Descending Large Intervals',
      explanation:
        'Descending intervals sound different from ascending even though the distance is the same. A descending perfect 5th (G down to C) sounds like a resolution or grounding motion. A descending major 6th sounds warm and nostalgic. Descending 7ths sound dramatic and wide. Train descending intervals separately — many students who master ascending intervals struggle with descending ones. Use descending song associations: descending P5 = Feelings (opening "Feelings, oh feelings..."), descending m3 = Hey Jude (hey-Jude). Build the descending set as its own skill.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play C major descending — hear intervals in reverse',
    },
    {
      title: 'Interval Inversion Relationships',
      explanation:
        'Large intervals are inversions of small ones: a major 6th is an inverted minor 3rd, a minor 7th is an inverted major 2nd, a major 7th is an inverted minor 2nd. This means their "flavor" is related — a minor 3rd and major 6th share warmth, a major 2nd and minor 7th share a bluesy quality. If you hear a large interval and cannot identify it directly, try mentally inverting it: does it sound like an inverted minor 3rd? Then it is a major 6th. This cross-referencing technique accelerates large-interval learning.',
      tryThisQuery: 'Cm7',
      tryThisLabel: 'Hear the minor 7th (C to Bb) — inversion of a major 2nd',
    },
  ],
  tasks: [
    {
      id: 'l9u30m4t1',
      instruction:
        "Play 'Cmaj7' — the outer interval from C to B is a major 7th. Now play C to Bb (minor 7th). The difference is one half step, but the character shifts from bright tension to bluesy pull",
      query: 'Cmaj7',
    },
    {
      id: 'l9u30m4t2',
      instruction:
        'Play C to Ab (m6) then C to A (M6) on the piano. Minor 6th sounds darker and more poignant. Major 6th sounds warmer and more open. Repeat from different roots until you can distinguish them reliably',
    },
    {
      id: 'l9u30m4t3',
      instruction:
        'Play C to high C (octave). The octave sounds like the "same note, different height." Now contrast with C to B (M7) — almost an octave, but with tension. That near-miss quality is the major 7th signature',
    },
  ],
  prerequisites: ['l9u30m3'],
};

const l9u30m5: CurriculumModule = {
  id: 'l9u30m5',
  unitId: 'u30',
  levelId: 'l9',
  title: 'Harmonic Intervals and Compounds',
  subtitle: 'Simultaneous interval recognition and compound intervals beyond the octave',
  objectives: [
    'Hear intervals when both notes play simultaneously (harmonic intervals)',
    'Distinguish consonant from dissonant harmonic intervals by sound quality',
    'Recognize compound intervals (9ths, 10ths, 11ths) as wider versions of simple intervals',
  ],
  concepts: [
    {
      title: 'Harmonic Intervals',
      explanation:
        'Hearing intervals when both notes play simultaneously is harder than melodic (sequential) intervals because the sounds fuse together. Perfect consonances (P5, P8) sound "open" and "hollow." Imperfect consonances (3rds, 6ths) sound "warm" and "blended." Dissonances (2nds, 7ths, tritone) sound "rough" or "tense." Learn melodic intervals first, then transition to harmonic. The quality distinction — consonant vs. dissonant — is your primary clue when notes sound simultaneously.',
      tryThisQuery: 'Cmaj7',
      tryThisLabel: 'Hear B against C — a major 7th interval',
    },
    {
      title: 'Compound Intervals',
      explanation:
        'After mastering simple intervals (within one octave), extend to compound intervals that span beyond the octave. A 9th = octave + 2nd. A 10th = octave + 3rd. An 11th = octave + 4th. A 13th = octave + 6th. Compound intervals sound like their simple counterparts but "wider" and more spacious. The quality rules carry over: a major 9th has the same quality as a major 2nd. You hear these constantly in extended jazz chords — the 9th in a Cmaj9 is the note D an octave above the root.',
      tryThisQuery: 'C7',
      tryThisLabel: 'Hear the tritone inside C7 (E to Bb)',
    },
    {
      title: 'Speed and Fluency Drills',
      explanation:
        'Interval recognition is only useful if it is fast. In real music, notes pass quickly — you do not have time for deliberation. The goal is to move from "analyze, then name" to "hear and know instantly." Train with timed drills: play two random notes and identify the interval within three seconds. Track accuracy over sessions. Start with a restricted set (perfect intervals only, or consonances only) and expand as accuracy exceeds 80 percent. Mixing melodic, harmonic, ascending, and descending presentations in the same drill builds robust, context-independent recognition.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear three intervals at once — P5, M3, and m3',
    },
  ],
  tasks: [
    {
      id: 'l9u30m5t1',
      instruction:
        'Play two notes simultaneously on the piano: C and E (M3), C and G (P5), C and B (M7). Listen to how they fuse differently. Consonances blend; dissonances create beats and roughness',
    },
    {
      id: 'l9u30m5t2',
      instruction:
        "Type 'Cmaj7' and listen to all the harmonic intervals within it: C-E (M3), C-G (P5), C-B (M7), E-G (m3), E-B (P5), G-B (M3). A single chord contains many simultaneous intervals",
      query: 'Cmaj7',
    },
    {
      id: 'l9u30m5t3',
      instruction:
        'Play C3 and D4 on the piano (a 9th). Compare with C4 and D4 (a 2nd). The 9th sounds like a wider, more spacious version of the 2nd. This is the compound interval principle in action',
    },
  ],
  prerequisites: ['l9u30m4'],
};

// ---------------------------------------------------------------------------
// Unit 31: Scale, Chord, and Dictation Skills (5 modules)
// ---------------------------------------------------------------------------

const l9u31m1: CurriculumModule = {
  id: 'l9u31m1',
  unitId: 'u31',
  levelId: 'l9',
  title: 'Scale Recognition: Major and Minor Forms',
  subtitle: 'Distinguishing major, natural minor, harmonic minor, and melodic minor by ear',
  objectives: [
    'Distinguish major from natural minor by overall color and mood',
    'Identify harmonic minor by the exotic augmented second between degrees 6 and 7',
    'Identify melodic minor by the raised 6th and 7th ascending, creating a smooth jazz quality',
  ],
  concepts: [
    {
      title: 'Major vs. Minor Forms',
      explanation:
        'Building on basic major/minor recognition: now identify specific minor forms. Natural minor sounds dark and folk-like — no strong pull at the end because the 7th degree is a whole step below the tonic (subtonic, not leading tone). Harmonic minor raises the 7th, creating a leading tone and an exotic augmented second between degrees 6 and 7 — an unmistakable sound. Melodic minor raises both the 6th and 7th ascending, smoothing the augmented second — it sounds jazzy and sophisticated. Train by playing all three from the same root (e.g. A) and isolating the differences.',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel: 'Hear the exotic raised 7th in harmonic minor',
    },
    {
      title: 'Training Method: Isolation',
      explanation:
        'The key to scale recognition is isolating what changes between similar scales. Play A major, then A natural minor — three notes change (C#/C, F#/F, G#/G). Now play A natural minor, then A harmonic minor — only one note changes (G to G#). Finally, A harmonic minor to A melodic minor ascending — again one note (F to F#). By narrowing your focus to the specific degrees that differ, you train faster than trying to hear the whole scale as a single unit.',
      tryThisQuery: 'A melodic minor scale',
      tryThisLabel: 'Hear melodic minor — smooth and jazzy',
    },
    {
      title: 'Key Center Anchoring',
      explanation:
        'Scale recognition becomes harder when the root changes. You may identify A natural minor easily but struggle with Eb natural minor because the unfamiliar key distracts you. The fix: always anchor to the tonic first. Play the root note, establish it as "home," then listen to the scale. Once the key center is anchored, the relative intervals between degrees are the same in every key. Train by practicing scale recognition across all twelve roots — the quality should be identifiable regardless of the starting pitch.',
      tryThisQuery: 'Eb natural minor scale',
      tryThisLabel: 'Hear natural minor from a less familiar root',
    },
  ],
  tasks: [
    {
      id: 'l9u31m1t1',
      instruction:
        "Play 'A natural minor scale', then 'A harmonic minor scale', then 'A melodic minor scale' back to back. Listen for what changes between each — the raised 7th, then the raised 6th",
      query: 'A natural minor scale',
    },
    {
      id: 'l9u31m1t2',
      instruction:
        "Play 'C major scale' then 'C natural minor scale'. Three degrees change. Can you hear all three shifts, or does the overall color change dominate your perception?",
      query: 'C major scale',
    },
    {
      id: 'l9u31m1t3',
      instruction:
        "Play 'E harmonic minor scale' — listen for the augmented second between the 6th and 7th degrees (C to D#). That exotic leap is the harmonic minor fingerprint",
      query: 'E harmonic minor scale',
    },
  ],
  prerequisites: ['l9u30m5'],
};

const l9u31m2: CurriculumModule = {
  id: 'l9u31m2',
  unitId: 'u31',
  levelId: 'l9',
  title: 'Scale Recognition: Modes',
  subtitle: 'Identifying all seven church modes by their characteristic tones',
  objectives: [
    'Identify each of the seven church modes by its characteristic color',
    'Distinguish major-like modes (Ionian, Lydian, Mixolydian) from minor-like modes (Dorian, Phrygian, Aeolian, Locrian)',
    'Hear the single characteristic tone that differentiates each mode from plain major or natural minor',
  ],
  concepts: [
    {
      title: 'Modal Character',
      explanation:
        'Each mode has a characteristic color defined by one or two notes that differ from plain major or natural minor. Dorian is minor with a raised 6th — warm and jazzy. Phrygian has a flat 2nd — dark and Spanish-sounding. Lydian has a sharp 4th — dreamy and floating. Mixolydian has a flat 7th — bluesy and rock-inflected. Locrian has a flat 2nd and flat 5th — unstable and rarely used as a tonic. Focus on these "characteristic tones" when identifying modes by ear.',
      tryThisQuery: 'C dorian',
      tryThisLabel: 'Hear Dorian — minor but warm (raised 6th)',
    },
    {
      title: 'Training Method: Major-like vs. Minor-like',
      explanation:
        'Start by sorting modes into two bins. Major-like modes have a major 3rd: Ionian (plain major), Lydian (#4 — dreamy), Mixolydian (b7 — bluesy). Minor-like modes have a minor 3rd: Aeolian (plain minor), Dorian (natural 6 — warm), Phrygian (b2 — dark), Locrian (b2 and b5 — unstable). First learn to identify the bin, then narrow to the specific mode. This binary first pass halves your choices immediately and is far more reliable than guessing from seven options.',
      tryThisQuery: 'C lydian',
      tryThisLabel: 'Hear Lydian — the dreamy #4 lifts the sound',
    },
    {
      title: 'Characteristic Tone Ear Anchors',
      explanation:
        'For each mode, train your ear on the one or two notes that make it unique. Dorian: play natural minor, then raise the 6th — hear the warmth enter. Phrygian: play natural minor, then lower the 2nd — hear it darken dramatically. Lydian: play major, then raise the 4th — hear it float. Mixolydian: play major, then lower the 7th — hear it relax into blues. Each characteristic tone creates a specific emotional shift. Memorize that shift, and you can identify any mode by finding its characteristic moment.',
      tryThisQuery: 'C phrygian',
      tryThisLabel: 'Hear Phrygian — the flat 2nd darkens everything',
    },
  ],
  tasks: [
    {
      id: 'l9u31m2t1',
      instruction:
        "Play 'C phrygian' then 'C dorian' — Phrygian is dark and Spanish (flat 2nd). Dorian is warmer (natural 6th). Both are minor modes but the character difference is dramatic",
      query: 'C phrygian',
    },
    {
      id: 'l9u31m2t2',
      instruction:
        "Play 'C lydian' then 'C major scale' (Ionian). The only difference is F vs F#. Lydian floats; Ionian settles. One note changes the entire mood",
      query: 'C lydian',
    },
    {
      id: 'l9u31m2t3',
      instruction:
        "Play 'C mixolydian' then 'C major scale'. Mixolydian has Bb instead of B — it sounds bluesy and less conclusive. This is the dominant sound in rock and blues",
      query: 'C mixolydian',
    },
  ],
  prerequisites: ['l9u31m1'],
};

const l9u31m3: CurriculumModule = {
  id: 'l9u31m3',
  unitId: 'u31',
  levelId: 'l9',
  title: 'Scale Recognition: Pentatonic, Blues, Symmetric',
  subtitle: 'Recognizing special scales by ear — pentatonic, blues, whole-tone, and diminished',
  objectives: [
    'Identify major and minor pentatonic scales by their open, gapped character',
    'Recognize the blues scale by its added blue note (flat 5th)',
    'Identify whole-tone and diminished scales by their symmetric, directionless quality',
  ],
  concepts: [
    {
      title: 'Pentatonic Scales',
      explanation:
        'Pentatonic major sounds open and folk-like — five notes, no half steps, no tension. It is the sound of campfire songs and Celtic melodies. Minor pentatonic sounds bluesy and raw — the backbone of rock and blues guitar. Both pentatonic scales are instantly recognizable because they lack the half-step tensions of diatonic scales. The gaps in the scale (missing 4th and 7th in major pentatonic, for example) create a distinctive open quality that no seven-note scale has.',
      tryThisQuery: 'C pentatonic scale',
      tryThisLabel: 'Hear pentatonic — open, folk-like, no tension',
    },
    {
      title: 'The Blues Scale',
      explanation:
        'The blues scale adds the flat 5th ("blue note") to minor pentatonic, creating grit and expressiveness. That single added note transforms clean pentatonic into something soulful and bending. The blue note sits between the perfect 4th and perfect 5th — a chromatic intruder that creates maximum tension against both neighbors. The blues scale is the backbone of blues, rock, and jazz improvisation, and its sound is instantly identifiable after even brief exposure.',
      tryThisQuery: 'blues scale',
      tryThisLabel: 'Hear the blues scale — gritty and expressive',
    },
    {
      title: 'Symmetric Scales',
      explanation:
        'Whole-tone and diminished scales are built from repeating interval patterns, giving them a unique directionless quality. The whole-tone scale uses only whole steps — no half steps at all — producing a dreamy, floating, unresolved quality associated with impressionism and film scoring. The diminished (half-whole) scale alternates half and whole steps, creating a tense, symmetric, jazz and film noir staple. Both scales lack a clear tonic pull because their symmetry means no single note feels more like "home" than any other.',
      tryThisQuery: 'whole tone scale',
      tryThisLabel: 'Hear whole tone — dreamy and directionless',
    },
  ],
  tasks: [
    {
      id: 'l9u31m3t1',
      instruction:
        "Play 'C pentatonic scale' then 'C blues scale' — the blues scale adds one note (Gb, the blue note). Can you hear the added grit and tension?",
      query: 'C pentatonic scale',
    },
    {
      id: 'l9u31m3t2',
      instruction:
        "Play 'C whole tone scale' — notice how every step is the same size. There is no pull toward any particular note. The scale floats without direction",
      query: 'whole tone scale',
    },
    {
      id: 'l9u31m3t3',
      instruction:
        "Compare 'C minor pentatonic' with 'C natural minor scale'. The pentatonic removes two notes (the 2nd and 6th), creating gaps. Those gaps give pentatonic its characteristic open sound",
      query: 'C minor pentatonic',
    },
  ],
  prerequisites: ['l9u31m2'],
};

const l9u31m4: CurriculumModule = {
  id: 'l9u31m4',
  unitId: 'u31',
  levelId: 'l9',
  title: 'Triad Quality Recognition',
  subtitle: 'Identifying major, minor, diminished, and augmented triads by ear',
  objectives: [
    'Identify major, minor, diminished, and augmented triads by ear',
    'Understand the stability distinction: perfect 5th (stable) vs. altered 5th (unstable)',
    'Recognize triad inversions by the character of the bass note',
  ],
  concepts: [
    {
      title: 'Triad Qualities by Ear',
      explanation:
        'Major sounds bright and settled — the default, stable chord. Minor sounds dark but still grounded — same stability, different color. Diminished sounds tense, small, and anxious — it wants to move somewhere. Augmented sounds strange, suspended, and directionless — no clear resolution. The key distinction: major and minor both have a perfect 5th (stability). Diminished and augmented have altered 5ths (instability). Train by playing all four qualities from the same root and closing your eyes before each one.',
      tryThisQuery: 'Cdim',
      tryThisLabel: 'Hear diminished — tense, small, anxious',
    },
    {
      title: 'Stable vs. Unstable Triads',
      explanation:
        'The perfect 5th is the interval that provides stability to a chord. Major triads (major 3rd + perfect 5th) and minor triads (minor 3rd + perfect 5th) both contain it — that is why they sound grounded even though their color differs. Diminished triads replace the perfect 5th with a diminished 5th (one half step smaller), creating a compressed, anxious quality. Augmented triads replace it with an augmented 5th (one half step larger), creating an expanded, unresolved quality. Hearing stable vs. unstable is the first filter — then refine to the specific quality.',
      tryThisQuery: 'Caug',
      tryThisLabel: 'Hear augmented — strange, expanded, unresolved',
    },
    {
      title: 'Recognizing Inversions',
      explanation:
        'When a triad is inverted, the bass note changes the perceived weight and stability. Root position sounds grounded and definitive — the root anchors everything. First inversion sounds lighter and more melodic — the 3rd in the bass creates a less stable but flowing feel. Second inversion sounds unstable — the 4th above the bass creates tension that historically requires resolution. Train by listening to the same chord in all its positions and noting how the character shifts while the quality (major/minor) remains the same.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear root position — grounded and definitive',
    },
  ],
  tasks: [
    {
      id: 'l9u31m4t1',
      instruction:
        "Play all four triad qualities from C: 'C major chord', 'Cm', 'Cdim', 'Caug'. Close your eyes and replay them — can you identify each by sound alone?",
      query: 'C major chord',
    },
    {
      id: 'l9u31m4t2',
      instruction:
        "Compare 'C major chord' with 'Cm'. The only difference is one note — E vs. Eb. That single half step changes bright to dark. Train this distinction across multiple roots",
      query: 'Cm',
    },
    {
      id: 'l9u31m4t3',
      instruction:
        "Play 'Cdim' then 'Caug' — both have altered 5ths and sound unstable, but in different ways. Diminished contracts inward (small, anxious). Augmented expands outward (strange, floating)",
      query: 'Cdim',
    },
  ],
  prerequisites: ['l9u31m3'],
};

const l9u31m5: CurriculumModule = {
  id: 'l9u31m5',
  unitId: 'u31',
  levelId: 'l9',
  title: 'Seventh Chord Quality Recognition',
  subtitle: 'Identifying all seventh chord qualities by ear — from warm major 7th to tense diminished 7th',
  objectives: [
    'Identify major 7th, dominant 7th, minor 7th, half-diminished, and fully diminished 7th chords by ear',
    'Hear the minor-major 7th chord as a distinct, unsettling quality',
    'Distinguish seventh chord qualities by their emotional character and tension level',
  ],
  concepts: [
    {
      title: 'Seventh Chord Qualities by Ear',
      explanation:
        'Six distinct seventh chord qualities, each with a unique emotional character. Major 7th (Cmaj7): warm, lush, jazz ballad. Dominant 7th (C7): tense, bluesy, demands resolution. Minor 7th (Cm7): mellow, smooth, relaxed. Half-diminished (Cm7b5): dark, yearning, film noir. Fully diminished (Cdim7): maximally tense, every note wants to move. Minor-major 7th (CmMaj7): mysterious, unsettling — the clash between minor triad and major 7th. Train by playing all six from the same root in sequence.',
      tryThisQuery: 'Cmaj7',
      tryThisLabel: 'Hear major 7th — warm and lush',
    },
    {
      title: 'The Dominant 7th vs. Major 7th Distinction',
      explanation:
        'The single most important seventh chord distinction. Major 7th (Cmaj7) and dominant 7th (C7) share a major triad but differ by one note: B (major 7th) vs. Bb (minor 7th). That half-step difference transforms the chord from warm repose to bluesy tension. The dominant 7th demands resolution — it pulls toward a chord a 5th below (C7 wants to go to F). The major 7th is content to sit still. This distinction is the gateway to hearing functional harmony, because the dominant 7th is the engine of harmonic motion.',
      tryThisQuery: 'C7',
      tryThisLabel: 'Hear dominant 7th — tense, bluesy, needs to move',
    },
    {
      title: 'The Dark Side: Half-Diminished and Fully Diminished',
      explanation:
        'Half-diminished (Cm7b5) and fully diminished (Cdim7) are the darkest seventh chord qualities. Half-diminished combines a diminished triad with a minor 7th — it sounds yearning, unstable, and cinematic. Fully diminished stacks minor thirds symmetrically — it is maximally tense, with every note equidistant and every note wanting to resolve. The distinction: half-diminished has one "normal" interval (the minor 7th from root) that gives it a touch of warmth. Fully diminished is uniformly compressed and tense throughout. In jazz, half-diminished is the ii chord in minor keys; fully diminished is a passing chord or dominant substitute.',
      tryThisQuery: 'Cm7b5',
      tryThisLabel: 'Hear half-diminished — dark and yearning',
    },
  ],
  tasks: [
    {
      id: 'l9u31m5t1',
      instruction:
        "Play these seventh chords in sequence: 'Cmaj7', 'C7', 'Cm7', 'Cm7b5', 'Cdim7'. Each has a distinct emotional signature. Describe what you feel for each",
      query: 'Cmaj7',
    },
    {
      id: 'l9u31m5t2',
      instruction:
        "Compare 'Cmaj7' (warm, resolved) with 'C7' (tense, needs to move). The only difference is one note — B vs. Bb. That single half step changes the entire character",
      query: 'C7',
    },
    {
      id: 'l9u31m5t3',
      instruction:
        "Play 'Cm7' then 'Cm7b5'. Minor 7th is mellow and smooth. Half-diminished is darker and yearning — the lowered 5th adds instability. This distinction matters in jazz and classical voice leading",
      query: 'Cm7',
    },
  ],
  prerequisites: ['l9u31m4'],
};

// ---------------------------------------------------------------------------
// Unit 32: Dictation, Sight Singing, and Contextual Listening (5 modules)
// All comingSoon — need dictation input UI, microphone, and audio library
// ---------------------------------------------------------------------------

const l9u32m1: CurriculumModule = {
  id: 'l9u32m1',
  unitId: 'u32',
  levelId: 'l9',
  title: 'Melodic Dictation: Diatonic',
  subtitle: 'Transcribing short diatonic melodies by ear — stepwise and triadic motion',
  objectives: [
    'Transcribe short diatonic melodies by ear using a systematic process',
    'Apply framework-first strategy: identify key, meter, and cadence before writing notes',
    'Handle stepwise motion and triadic skips (chord outlines like C-E-G) in major keys',
  ],
  concepts: [
    {
      title: 'The Dictation Process',
      explanation:
        'Melodic dictation follows a systematic process — rushing to write notes immediately is the most common mistake. First listen: get the overall shape, the key, and the meter. Identify the tonic by finding the note that feels like "home" — usually the final note. Second listen: focus on the first few notes and the last few notes. Third listen: fill in the middle, building phrase by phrase. Always start with rhythm and contour (the up-and-down shape), then refine to exact pitches. Check your work: does the transcription make musical sense?',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play a reference scale to anchor the key',
    },
    {
      title: 'Framework-First Strategy',
      explanation:
        'Before writing a single note, establish the framework that constrains your choices. Identify the key by listening for the tonic — the note of rest and resolution. Tap the beat to find the meter (is it in 2, 3, or 4?). Listen for the cadence at the end — does it resolve conclusively (authentic cadence) or leave you hanging (half cadence)? Then fill in notes, starting with rhythm and overall direction. The framework eliminates wrong answers before you begin, making the detail work far easier.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear the tonic chord — your anchor point',
    },
    {
      title: 'Contour Before Pitch',
      explanation:
        'Contour is the shape of a melody — its pattern of ups and downs — without specifying exact intervals. Before attempting to name specific pitches, draw the contour: does the melody rise, fall, arch, or remain level? A melody that arches (rises then falls) is the most common shape. A melody that descends throughout is less common and feels like it is settling. Contour is the skeleton of dictation. If your contour is wrong, your pitches will be wrong no matter how carefully you listen. Always get the shape right first, then fill in the exact notes.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Play G major — the simplest ascending contour',
    },
  ],
  tasks: [
    {
      id: 'l9u32m1t1',
      instruction:
        'Have a friend play 4-5 random notes from the C major scale on the piano. Try to sing them back, then find them on the keyboard. Start with stepwise motion only',
    },
    {
      id: 'l9u32m1t2',
      instruction:
        'Listen to a short melody and identify just the contour first — does it go up, down, stay level, or arch? Contour is the skeleton of dictation and should always come before exact pitches',
    },
    {
      id: 'l9u32m1t3',
      instruction:
        'Practice identifying the last note of a melody — is it the tonic? If so, the melody ends with resolution. If not, it feels unfinished. This single observation establishes the key',
    },
  ],
  prerequisites: ['l9u31m5'],

};

const l9u32m2: CurriculumModule = {
  id: 'l9u32m2',
  unitId: 'u32',
  levelId: 'l9',
  title: 'Melodic Dictation: Chromatic',
  subtitle: 'Transcribing melodies with chromatic passing tones, neighbor tones, and secondary dominants',
  objectives: [
    'Recognize chromatic passing tones and neighbor tones within diatonic melodies',
    'Hear the effect of secondary dominants in melodic lines — borrowed leading tones',
    'Progress through difficulty levels from chromatic embellishment to two-part dictation',
  ],
  concepts: [
    {
      title: 'Chromatic Embellishment',
      explanation:
        'Chromatic passing tones and neighbor tones are notes outside the key that connect or decorate diatonic notes. A chromatic passing tone fills in the gap between two diatonic notes a whole step apart — for example, C to C# to D in C major. A chromatic neighbor tone steps outside the key and immediately returns — D to D# to D. These notes create color and tension without changing the key. The ear training challenge is distinguishing chromatic embellishments (temporary departures) from actual modulations (permanent key changes). If the note resolves stepwise back into the key, it is likely an embellishment.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play the diatonic frame — then imagine chromatic fill',
    },
    {
      title: 'Secondary Dominants in Melodies',
      explanation:
        'When a melody briefly introduces a note outside the key that functions as a leading tone to a diatonic chord, you are hearing a secondary dominant influence. In C major, an F# might appear as a leading tone to G (the dominant) — it pulls strongly to G the way B pulls to C. In dictation, these borrowed leading tones are identifiable because they resolve by half step upward to a diatonic note. Hearing F# resolve to G in a C major melody is a secondary dominant cue: V/V (five of five). This is the bridge between diatonic and chromatic dictation.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Hear G7 — the leading tone B pulls to C',
    },
    {
      title: 'Difficulty Progression',
      explanation:
        'Chromatic dictation scales in clear levels. Level 1: chromatic passing tones between diatonic notes (C-C#-D). Level 2: chromatic neighbor tones (D-D#-D). Level 3: secondary leading tones resolving upward by half step (F#-G in C major). Level 4: chromatic sequences where a diatonic pattern is transposed chromatically. Level 5: two-part dictation with chromatic elements in both voices. Never skip levels — each builds on the previous one. At each stage, maintain at least 80 percent accuracy before advancing.',
      tryThisQuery: 'A natural minor scale',
      tryThisLabel: 'Hear minor — dictation gets harder with variable 6th and 7th',
    },
  ],
  tasks: [
    {
      id: 'l9u32m2t1',
      instruction:
        'Play a C major scale slowly, then insert a chromatic passing tone between D and E (play D-D#-E). Now try C-C#-D. Hear how the chromatic note creates momentary color without disrupting the key',
    },
    {
      id: 'l9u32m2t2',
      instruction:
        'In a C major context, play the sequence E-F#-G. The F# is a secondary leading tone to G. It feels like a temporary tonicization — G briefly becomes the center of gravity before C reasserts itself',
    },
    {
      id: 'l9u32m2t3',
      instruction:
        'Listen to any melody with your full attention and mark moments where a note feels "outside" the key. Does it resolve by step? If yes, it is likely a chromatic embellishment. If not, consider whether the key has shifted',
    },
  ],
  prerequisites: ['l9u32m1'],

};

const l9u32m3: CurriculumModule = {
  id: 'l9u32m3',
  unitId: 'u32',
  levelId: 'l9',
  title: 'Harmonic Dictation: Cadences and Progressions',
  subtitle: 'Identifying cadences, transcribing progressions, and bass line dictation',
  objectives: [
    'Identify cadence types (authentic, plagal, half, deceptive) by ear',
    'Transcribe four-chord diatonic progressions using Roman numerals',
    'Perform bass line dictation as the gateway to full harmonic transcription',
  ],
  concepts: [
    {
      title: 'Hearing the Bass Line',
      explanation:
        'The bass line is the gateway to harmonic dictation. The bass note defines the chord more than any other voice — it tells you the root (or the inversion). Train by listening to chord progressions and singing just the bass notes. If you can accurately track the bass, you are most of the way to identifying the harmony. Root-position chords have the clearest bass-to-chord relationship. Inversions require you to hear the bass as a non-root note and then infer the actual chord above it.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Listen to the bass note — it anchors the chord',
    },
    {
      title: 'Cadence Recognition',
      explanation:
        'Cadences are the punctuation of music — learn to hear them before tackling full progressions. The authentic cadence (V-I) sounds final and conclusive — a period. The plagal cadence (IV-I) sounds softer and warmer — like "Amen." The half cadence (ending on V) sounds incomplete — a question mark. The deceptive cadence (V-vi) surprises: you expect resolution to I but land on vi instead. Identifying the cadence at the end of a phrase gives you two chords immediately and anchors the key.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Hear V (G) — does it pull toward C (I)?',
    },
    {
      title: 'Progression Dictation Process',
      explanation:
        'Full harmonic dictation follows a systematic process. Step 1: listen for the key — identify the tonic chord and cadence. Step 2: track the bass line — bass notes outline the harmonic motion. Step 3: identify the chord quality at each bass note change — is it major, minor, or diminished? Step 4: assign Roman numerals based on the scale degree of each bass note. Step 5: check for consistency — does the harmonic rhythm (rate of chord change) make sense? Start with simple two-chord cadences and build to four-chord progressions.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See the diatonic chords available in C major',
    },
  ],
  tasks: [
    {
      id: 'l9u32m3t1',
      instruction:
        'Listen to music you know well and try to identify the cadences. Does each phrase end with a strong V-I (authentic)? A softer IV-I (plagal)? Or an unresolved half cadence ending on V?',
    },
    {
      id: 'l9u32m3t2',
      instruction:
        'Practice bass line dictation separately from full harmonic analysis — sing or hum the lowest note you hear in each chord of a progression. The bass is always your starting point',
    },
    {
      id: 'l9u32m3t3',
      instruction:
        'Start with two-chord cadences: play random V-I and IV-I pairs in different keys on the piano. Can you tell which cadence type it is before checking? Then add deceptive cadences (V-vi)',
    },
  ],
  prerequisites: ['l9u32m2'],

};

const l9u32m4: CurriculumModule = {
  id: 'l9u32m4',
  unitId: 'u32',
  levelId: 'l9',
  title: 'Sight Singing Fundamentals',
  subtitle: 'Movable-do solfege for sight singing in major and minor keys',
  objectives: [
    'Use movable-do solfege (do-re-mi-fa-sol-la-ti) for sight singing in major keys',
    'Apply chromatic solfege syllables for minor keys: me, le, te for lowered degrees',
    'Follow a systematic sight reading process: key, range, patterns, then sing',
  ],
  concepts: [
    {
      title: 'Movable-Do Solfege',
      explanation:
        'In movable-do solfege, "do" always represents the tonic of the current key — regardless of what note that is. C major: do=C. G major: do=G. Bb major: do=Bb. This maps syllables to function, not absolute pitch. "Sol" always feels like the dominant, "ti" always feels like the leading tone pulling toward "do." This is the Kodaly/Berklee approach, and its proponents argue it trains functional hearing more directly — you learn to hear relationships, not just note names. Fixed-do (where do always equals C), the standard in conservatories of many countries including France and Italy, builds absolute-pitch association instead — both systems are mainstream.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Sing along: do-re-mi-fa-sol-la-ti-do',
    },
    {
      title: 'Chromatic Solfege for Minor Keys',
      explanation:
        'Minor keys require modified syllables for the lowered degrees. In do-based minor: flat 3 = "me," flat 6 = "le," flat 7 = "te." Natural minor becomes: do-re-me-fa-sol-le-te-do. Harmonic minor raises the 7th back to "ti": do-re-me-fa-sol-le-ti-do. Melodic minor ascending raises both: do-re-me-fa-sol-la-ti-do. For chromatic alterations: ascending sharps use -i (di, ri, fi, si, li); descending flats use modified vowels (ra, me, se, le, te). These syllables make altered degrees explicit when you sing.',
      tryThisQuery: 'A natural minor scale',
      tryThisLabel: 'Sing: do-re-me-fa-sol-le-te-do (la-based minor, an alternative system common in Kodaly practice: la-ti-do-re-mi-fa-sol)',
    },
    {
      title: 'Sight Reading Process',
      explanation:
        'Before singing a single note, follow a checklist. (1) Identify the key signature and time signature. (2) Scan for the highest and lowest notes to know your vocal range requirements. (3) Look for patterns — scales, arpeggios, repeated motifs, sequences. (4) Set a tempo slow enough to maintain accuracy (speed develops naturally with practice). (5) Sing through maintaining a steady pulse above all else. A wrong note at a steady tempo is better than a right note with broken rhythm. The pulse is the skeleton; pitches are the flesh.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Sight sing G major: do starts on G',
    },
  ],
  tasks: [
    {
      id: 'l9u32m4t1',
      instruction:
        'Sing the major scale using solfege syllables: do-re-mi-fa-sol-la-ti-do. Start on any comfortable pitch. Then descend: do-ti-la-sol-fa-mi-re-do. Maintain a steady tempo throughout',
    },
    {
      id: 'l9u32m4t2',
      instruction:
        "Now sing natural minor using do-based solfege: do-re-me-fa-sol-le-te-do. Notice the three lowered syllables — 'me,' 'le,' and 'te' — these are the three degrees that differ from major",
    },
    {
      id: 'l9u32m4t3',
      instruction:
        'Practice simple arpeggio patterns: do-mi-sol (major arpeggio), do-me-sol (minor arpeggio), sol-ti-re (dominant arpeggio). Sing these in at least three different keys to internalize the function, not the absolute pitch',
    },
  ],
  prerequisites: ['l9u32m3'],

};

const l9u32m5: CurriculumModule = {
  id: 'l9u32m5',
  unitId: 'u32',
  levelId: 'l9',
  title: 'Contextual Listening',
  subtitle: 'Identifying texture, form, instruments, and style periods by ear',
  objectives: [
    'Identify musical texture: monophonic, homophonic, polyphonic, and homorhythmic',
    'Recognize formal structures by ear: binary, ternary, rondo, and verse-chorus',
    'Assign music to historical style periods by characteristic sonic traits',
  ],
  concepts: [
    {
      title: 'Texture Identification',
      explanation:
        'Musical texture describes how many voices are present and how they relate to each other. Monophony is a single unaccompanied line — clean and exposed, like a solo flute melody. Homophony is one melody with supporting harmony underneath — the most common texture in Western music (think a singer with guitar chords). Polyphony has multiple independent melodies happening simultaneously — dense and complex, like a Bach fugue. Homorhythm is a special case where all voices move in the same rhythm, like a chorale. Learning to hear texture is learning to hear how music is organized vertically.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'A chord is homophonic texture in miniature',
    },
    {
      title: 'Form by Ear',
      explanation:
        'Hearing form means tracking repetition and contrast over time. When material returns, label it "A." When new material appears, label it "B." Binary form is AB (two contrasting sections). Ternary is ABA (departure and return). Rondo alternates a recurring theme with contrasting episodes: ABACA. Verse-chorus is the pop equivalent of alternating sections. Listen for sectional boundaries — cadences, pauses, key changes, and shifts in texture or dynamics all signal formal divisions. The skill is attention span: you must hold the first section in memory to recognize its return.',
      tryThisQuery: 'key of G',
      tryThisLabel: 'Explore G major — most forms start and end in the home key',
    },
    {
      title: 'Style Period Recognition',
      explanation:
        'Each historical era has characteristic sounds you can learn to identify. Baroque (1600-1750): continuous rhythmic motor, basso continuo, ornamental melodies, terraced dynamics (sudden loud/soft shifts). Classical (1750-1820): balanced 4- and 8-bar phrases, Alberti bass patterns, clear cadences, elegant simplicity. Romantic (1820-1900): expanded orchestras, chromatic harmony, long sweeping melodies, extreme dynamic range. Twentieth century (1900-2000): dissonance as a primary resource, new timbres, rhythmic complexity, formal experimentation. Each period builds on and reacts against the previous one.',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel: 'Harmonic minor — a Baroque and Classical staple',
    },
  ],
  tasks: [
    {
      id: 'l9u32m5t1',
      instruction:
        'Listen to a piece of music and identify the texture. Is there one unaccompanied melody (monophony), a melody with chords (homophony), or multiple interweaving melodies (polyphony)?',
    },
    {
      id: 'l9u32m5t2',
      instruction:
        'Pick a song you know well and map its form. Label sections A, B, C. Is it verse-chorus (alternating AB)? ABA (departure and return)? Through-composed (no large-scale repetition)?',
    },
    {
      id: 'l9u32m5t3',
      instruction:
        'Listen to orchestral music and identify instrument families first: strings vs. brass vs. woodwinds vs. percussion. Then narrow to specific instruments within each family — violin vs. cello, trumpet vs. trombone, flute vs. clarinet',
    },
  ],
  prerequisites: ['l9u32m4'],

};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

export const L9_UNITS: CurriculumUnit[] = [
  {
    id: 'u30',
    levelId: 'l9',
    title: 'Pitch and Interval Training',
    description:
      'Pitch matching, melodic direction, major/minor recognition, and complete interval identification by ear',
    icon: 'scales',
    modules: [l9u30m1, l9u30m2, l9u30m3, l9u30m4, l9u30m5],
    milestone: {
      skillsSummary: [
        'Match pitch by ear and identify melodic direction across registers',
        'Recognize major vs. minor tonality instinctively from chords and scales',
        'Identify all simple intervals (m2 through P8) by ear, ascending and descending, melodically and harmonically',
        'Recognize compound intervals (9ths, 10ths, 11ths) as wider versions of simple intervals',
      ],
      bridgeText:
        'You can hear pitch, direction, intervals, and consonance vs. dissonance. Now you\u2019ll train your ears to recognize entire scales, chord qualities, and complete musical passages.',
      tryThisQuery: 'Cm',
      tryThisLabel: 'Hear C minor — dark and grounded',
      tryThisPrompt: 'Can you tell it is minor before looking at the notes?',
    },
  },
  {
    id: 'u31',
    levelId: 'l9',
    title: 'Scale, Chord, and Dictation Skills',
    description:
      'Scale and mode recognition, triad and seventh chord quality identification by ear',
    icon: 'chords',
    modules: [l9u31m1, l9u31m2, l9u31m3, l9u31m4, l9u31m5],
    milestone: {
      skillsSummary: [
        'Distinguish major, minor, modal, pentatonic, blues, and symmetric scales by ear',
        'Identify all four triad qualities and all seventh chord qualities by sound alone',
        'Hear the characteristic tones that define each mode and special scale',
      ],
      bridgeText:
        'Your ears can now decode scales and chords by sound alone. The final skills are dictation, sight singing, and contextual listening — connecting your ears to full musical comprehension.',
      tryThisQuery: 'Cm7b5',
      tryThisLabel: 'Hear half-diminished — dark and yearning',
      tryThisPrompt: 'Can you distinguish this from a minor 7th chord by ear?',
    },
  },
  {
    id: 'u32',
    levelId: 'l9',
    title: 'Dictation, Sight Singing, and Contextual Listening',
    description:
      'Melodic and harmonic dictation, movable-do solfege for sight singing, and critical listening for texture, form, and style',
    icon: 'harmony',
    modules: [l9u32m1, l9u32m2, l9u32m3, l9u32m4, l9u32m5],
    milestone: {
      skillsSummary: [
        'Transcribe diatonic and chromatic melodies by ear using systematic dictation processes',
        'Identify cadences and transcribe harmonic progressions using Roman numerals',
        'Sight sing in major and minor keys using movable-do solfege with chromatic syllables',
        'Identify musical textures, formal structures, and historical style periods by ear',
      ],
      bridgeText: '',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel: 'Sing along in solfege: do-re-me-fa-sol-le-ti-do',
      tryThisPrompt: 'Can you sing the raised 7th (ti) before hearing it?',
    },
  },
];
