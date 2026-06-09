import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 3, Unit 9: Seventh Chords and Diatonic Harmony
// Engine coverage: 3.1 Seventh Chord Qualities → FULL
//                  3.1 7th Chord Inversions → FULL
//                  3.2 Diatonic 7th Chords → FULL
//                  3.2 V7 and Tritone → FULL
// ---------------------------------------------------------------------------

const l3u9m1: CurriculumModule = {
  id: 'l3u9m1',
  unitId: 'u9',
  levelId: 'l3',
  title: 'Seventh Chords: The Five Qualities',
  subtitle:
    'Build and identify all five standard seventh chord types and hear their distinct characters',
  objectives: [
    'Build and identify all five standard seventh chord qualities by structure and sound',
    'Understand seventh chords as triads with a seventh added above the root',
    'Hear the distinct character of each quality — from warm to desperately tense',
  ],
  concepts: [
    {
      title: 'What Is a Seventh Chord?',
      explanation:
        'A seventh chord adds a fourth note — a seventh above the root — to a triad. Four notes instead of three. This extra note introduces richer color and greater harmonic tension than any triad can produce. Seventh chords are the harmonic backbone of jazz, pop, and Romantic-era classical music, and understanding them unlocks an entirely new dimension of chord vocabulary.',
      tryThisQuery: 'Cmaj7',
      tryThisLabel: 'Hear Cmaj7 — warm, lush, jazzy',
    },
    {
      title: 'The Five Standard Qualities',
      explanation:
        'Major seventh (Cmaj7): M3+m3+M3 — warm and lush. Dominant seventh (C7): M3+m3+m3 — tense and demanding resolution. Minor seventh (Cm7): m3+M3+m3 — mellow and smooth. Half-diminished (Cm7b5): m3+m3+M3 — dark and yearning. Fully diminished (Cdim7): m3+m3+m3 — extremely tense with a symmetrical structure where every note is a minor third apart. A sixth quality, the minor-major seventh (CmMaj7: m3+M3+M3), combines a minor triad with a major seventh — rare but hauntingly unsettling, used in film and jazz.',
      tryThisQuery: 'C7',
      tryThisLabel: 'Hear C7 — the dominant seventh demands resolution',
    },
    {
      title: 'Comparing Seventh Chord Colors',
      explanation:
        'The difference between Cmaj7 and C7 is a single half step: B natural versus Bb. That one note transforms a lush, stable sonority into a chord bursting with tension. Similarly, Cm7 and Cm7b5 differ only in the fifth (G versus Gb), but the half-diminished quality is far darker and more restless. Training your ear to these subtle distinctions is the foundation of advanced harmonic listening.',
      tryThisQuery: 'Cm7',
      tryThisLabel: 'Hear Cm7 — mellow and smooth',
    },
  ],
  tasks: [
    {
      id: 'l3u9m1t1',
      instruction:
        "Build all five C seventh chords in sequence: 'Cmaj7', 'C7', 'Cm7', 'Cm7b5', 'Cdim7'. Listen carefully to how each quality changes the chord's emotional character",
    },
    {
      id: 'l3u9m1t2',
      instruction:
        "Compare 'Cmaj7' and 'C7' back to back — the only difference is B vs. Bb. Hear how one half step transforms warmth into tension",
    },
    {
      id: 'l3u9m1t3',
      instruction:
        "Play 'Cdim7' — all four notes are exactly 3 half steps apart. This symmetry means there are only three distinct diminished seventh chords in the entire chromatic scale. Can you figure out which three?",
      query: 'Cdim7',
    },
  ],
  prerequisites: ['l2u7m5'],
};

const l3u9m2: CurriculumModule = {
  id: 'l3u9m2',
  unitId: 'u9',
  levelId: 'l3',
  title: 'Seventh Chord Inversions',
  subtitle:
    'Four positions for every seventh chord — root position through third inversion',
  objectives: [
    'Identify and build all four inversions of any seventh chord',
    'Use figured bass labels (7, 6/5, 4/3, 4/2) to name inversions',
    'Hear how each inversion changes the bass note and the chord\u2019s weight',
  ],
  concepts: [
    {
      title: 'Four Positions',
      explanation:
        'Because a seventh chord has four notes, it has four possible bass notes and therefore four inversions. Root position (figured bass: 7) places the root in the bass — the most grounded and common voicing. First inversion (6/5) puts the third in the bass, creating a lighter sonority. Second inversion (4/3) puts the fifth in the bass. Third inversion (4/2 or simply 2) puts the seventh in the bass — the most unstable position, strongly demanding downward resolution of the bass note.',
      tryThisQuery: 'Cmaj7',
      tryThisLabel: 'Hear Cmaj7 in root position — root in the bass',
    },
    {
      title: 'Figured Bass for Seventh Chords',
      explanation:
        'Figured bass labels describe the intervals above the bass note. Root position 7: intervals of a 7th, 5th, and 3rd above bass. First inversion 6/5: intervals of a 6th, 5th, and 3rd above bass. Second inversion 4/3: intervals of a 6th, 4th, and 3rd above bass. Third inversion 4/2: intervals of a 6th, 4th, and 2nd above bass. These shorthand labels tell performers both the chord and its voicing at a glance.',
      tryThisQuery: 'Cmaj7/E',
      tryThisLabel: 'Hear Cmaj7 in first inversion (6/5) — E in the bass',
    },
    {
      title: 'Third Inversion and Bass Resolution',
      explanation:
        'Third inversion (4/2) is the most unstable seventh chord position because the chordal seventh sits in the bass. The seventh is a dissonance that must resolve downward by step. In practice, a V4/2 resolves to I6 — the bass moves down by half step (F to E in C major) while the rest of the chord resolves normally. This downward-resolving bass gives third inversion its characteristic urgency and forward momentum.',
      tryThisQuery: 'Cmaj7/B',
      tryThisLabel:
        'Hear Cmaj7 in third inversion (4/2) — the seventh in the bass',
    },
  ],
  tasks: [
    {
      id: 'l3u9m2t1',
      instruction:
        "Play 'Cmaj7' in root position, then 'Cmaj7/E' (first inversion), 'Cmaj7/G' (second inversion), and 'Cmaj7/B' (third inversion). Same four notes — hear how the bass note changes the chord's character entirely",
    },
    {
      id: 'l3u9m2t2',
      instruction:
        "Compare 'G7' (root position V7 in C) with 'G7/F' (third inversion, V4/2). In third inversion the seventh (F) is in the bass and demands to resolve down to E — making V4/2 resolve naturally to I6",
      query: 'G7',
    },
    {
      id: 'l3u9m2t3',
      instruction:
        "Build 'Dm7/C' — Dm7 in third inversion. The chordal seventh (C) is in the bass. In the key of C major this is ii4/2; it resolves with the bass descending C → B. In Bach chorales the most frequent resolution is ii4/2 → V6; ii4/2 → V6/5 also occurs",
      query: 'Dm7/C',
    },
  ],
  prerequisites: ['l3u9m1'],
};

const l3u9m3: CurriculumModule = {
  id: 'l3u9m3',
  unitId: 'u9',
  levelId: 'l3',
  title: 'Diatonic Seventh Chords in Major',
  subtitle:
    'Seventh chords on every degree of the major scale and the dominant seventh as harmonic engine',
  objectives: [
    'Build seventh chords on every degree of the major scale and identify each quality',
    'Understand the dominant seventh (V7) and its tritone as the engine of tonal resolution',
    'Recognize the ii-V-I progression as a foundational harmonic motion across Western music',
  ],
  concepts: [
    {
      title: 'Diatonic Seventh Chords in Major',
      explanation:
        'Stack a seventh on every degree of the major scale using only notes from that key. The quality pattern is always the same: Imaj7, ii7, iii7, IVmaj7, V7, vi7, vii\u00f87. In C major: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. The dominant seventh (V7) is the only naturally occurring dominant-quality seventh chord, and the half-diminished vii\u00f87 functions as a dominant substitute.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See all diatonic chords in C major',
    },
    {
      title: 'The Dominant Seventh and Its Tritone',
      explanation:
        'V7 is the most structurally important seventh chord in tonal music. In C major, G7 contains the notes G-B-D-F. The tritone between B and F is the source of its tension: B (the leading tone) pulls up to C, while F (the chordal seventh) pulls down to E. This double resolution — outward in contrary motion — is the fundamental engine driving tonal harmony toward the tonic.',
      tryThisQuery: 'G7',
      tryThisLabel:
        'Hear the tritone inside G7 — B and F demand resolution',
    },
    {
      title: 'The ii-V-I Progression',
      explanation:
        'The most important chord progression in jazz — and a foundational harmonic motion across all Western music — chains the pre-dominant ii7 to the dominant V7 to the tonic Imaj7. In C major: Dm7-G7-Cmaj7. Each chord shares common tones with the next, producing smooth voice leading. The ii7 establishes subdominant tension, V7 intensifies it with the tritone, and Imaj7 resolves everything. This three-chord skeleton underpins everything from Bach chorales to jazz standards.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'Hear Dm7 — the ii7 sound in C major',
    },
  ],
  tasks: [
    {
      id: 'l3u9m3t1',
      instruction:
        "Open 'key of C' and identify the seventh chord quality on each degree: I is major seventh, ii is minor seventh, V is dominant seventh. Verify the full pattern matches Imaj7-ii7-iii7-IVmaj7-V7-vi7-vii\u00f87",
      query: 'key of C',
    },
    {
      id: 'l3u9m3t2',
      instruction:
        "Play 'G7' then 'Cmaj7' — hear how the dominant seventh resolves to the tonic. The tritone B-F opens outward to C-E. This is the V-I resolution that defines Western harmony",
    },
    {
      id: 'l3u9m3t3',
      instruction:
        "Play 'Dm7' then 'G7' — the ii-V progression is the most common two-chord motion in all of Western music. It combines pre-dominant function (ii) with dominant function (V) to create maximum forward momentum toward the tonic",
    },
  ],
  prerequisites: ['l3u9m2'],
};

const l3u9m4: CurriculumModule = {
  id: 'l3u9m4',
  unitId: 'u9',
  levelId: 'l3',
  title: 'Diatonic Seventh Chords in Minor',
  subtitle:
    'Harmonic minor\u2019s seventh chord landscape — from the haunting i(m\u03947) to the explosive viio7',
  objectives: [
    'Build seventh chords on every degree of the harmonic minor scale',
    'Identify the distinct qualities created by the raised seventh degree',
    'Understand the role of V7, viio7, and ii\u00f87 as the dominant-family chords in minor',
  ],
  concepts: [
    {
      title: 'Harmonic Minor Changes Everything',
      explanation:
        'The harmonic minor scale raises the seventh degree, creating dramatically different seventh chord qualities compared to major. On scale degree 1, the minor triad gains a major seventh, producing the rare minor-major seventh chord: i(m\u03947). On degree 3, the raised seventh turns the major triad into an augmented triad with a major seventh: III+maj7. These exotic qualities give minor keys their characteristic tension and darkness. (Half-diminished is written m7b5 or with the ⌀ symbol — so ii\u00F87 and Bm7b5 name the same chord.)',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel:
        'See A harmonic minor — the source scale for minor-key seventh chords',
    },
    {
      title: 'The Complete Diatonic Seventh Pattern in Minor',
      explanation:
        'In A harmonic minor the seventh chords on each degree are: i(m\u03947) on A (A-C-E-G\u266F), ii\u00f87 on B (B-D-F-A), III+maj7 on C (C-E-G\u266F-B), iv7 on D (D-F-A-C), V7 on E (E-G\u266F-B-D), VImaj7 on F (F-A-C-E), viio7 on G\u266F (G\u266F-B-D-F). The critical chords are V7 (dominant function, same as in major), viio7 (fully diminished, intensified dominant), and ii\u00f87 (the characteristic pre-dominant sonority in minor).',
      tryThisQuery: 'Bm7b5',
      tryThisLabel: 'Hear Bm7b5 — the ii\u00f87 chord in A minor',
    },
    {
      title: 'The ii\u00f87-V7-i Progression in Minor',
      explanation:
        'The minor-key counterpart to the major ii-V-I: ii\u00f87-V7-i. In A minor: Bm7b5-E7-Am. The half-diminished ii\u00f87 has a darker, more restless quality than the minor seventh ii7 of major keys. Combined with V7 (which contains the raised leading tone G\u266F), this progression drives toward the minor tonic with an intensity that the major-key version cannot match. The viio7 can substitute for V7, adding even more tension.',
      tryThisQuery: 'E7',
      tryThisLabel:
        'Hear E7 — the V7 in A minor with the raised leading tone G\u266F',
    },
  ],
  tasks: [
    {
      id: 'l3u9m4t1',
      instruction:
        "Open 'A harmonic minor scale' and build a seventh chord on each degree. Compare the pattern to A major — notice how the raised G\u266F changes the quality of chords on degrees i, III, V, and vii",
      query: 'A harmonic minor scale',
    },
    {
      id: 'l3u9m4t2',
      instruction:
        "Play 'Bm7b5' then 'E7' then 'Am' — this is ii\u00f87-V7-i in A minor. The half-diminished quality of ii\u00f87 gives this progression a darker, more urgent character than the major-key ii-V-I",
    },
    {
      id: 'l3u9m4t3',
      instruction:
        "Play 'G#dim7' — the viio7 in A harmonic minor. Like Cdim7, it is fully diminished with all minor-third intervals. It functions as an intensified dominant that can substitute for V7 in minor keys",
      query: 'G#dim7',
    },
  ],
  prerequisites: ['l3u9m3'],
};

// ---------------------------------------------------------------------------
// Level 3, Unit 10: Voice Leading and Part Writing
// Engine coverage: 3.3 Voice Leading (SATB) → NONE
//                  3.4 Root Position Part Writing → NONE
//                  3.5 Inversions in Context → PARTIAL
// ---------------------------------------------------------------------------

const l3u10m1: CurriculumModule = {
  id: 'l3u10m1',
  unitId: 'u10',
  levelId: 'l3',
  title: 'Voice Leading — SATB Basics',
  subtitle: 'SATB voicing, ranges, spacing rules, and doubling conventions',
  objectives: [
    'Understand SATB voicing with correct ranges, spacing, and doubling',
    'Apply doubling rules based on chord position and function',
    'Recognize voice crossing and voice overlap errors',
  ],
  concepts: [
    {
      title: 'SATB — The Four Voices',
      explanation:
        'Traditional harmony distributes notes across four voices with defined ranges: Soprano (C4-G5), Alto (F3-C5), Tenor (C3-G4), Bass (E2-C4). The soprano carries the melody and the bass defines the harmonic foundation. Adjacent upper voices must stay within an octave of each other, though the gap between tenor and bass may exceed an octave. Voices must never cross — soprano stays above alto, alto above tenor.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'See the notes of C major — imagine distributing them across four voices',
    },
    {
      title: 'Doubling and Spacing Rules',
      explanation:
        'When four voices play a three-note triad, one note must be doubled. In root position, double the root — it is the strongest, most stable choice. In first inversion, double the soprano note — unless the soprano is a tendency tone (leading tone, chromatically altered note). Never double the leading tone: it has a mandatory resolution to the tonic, and doubling it creates unavoidable parallel octaves. In diminished triads, double the third (the most stable note in an unstable chord).',
      tryThisQuery: 'Bdim',
      tryThisLabel: 'See Bdim — in SATB, double the third (D), never the root',
    },
    {
      title: 'Voice Overlap',
      explanation:
        'Voice overlap is a subtler error than crossing: it occurs when a voice moves past where the adjacent voice was on the previous beat. For example, if the alto was on D4 in beat 1, the soprano must not descend below D4 on beat 2, even if the alto has also moved lower. Overlap blurs voice identities just as crossing does, making the lines harder to follow as independent melodies.',
      tryThisQuery: 'F major chord',
      tryThisLabel: 'See F major — practice imagining SATB voicings on paper',
    },
  ],
  tasks: [
    {
      id: 'l3u10m1t1',
      instruction:
        'On paper, write a C major triad in SATB: Bass C2, Tenor G3, Alto E4, Soprano C5. Verify all spacing rules: soprano-alto gap (a minor 6th — under an octave), alto-tenor gap (a major 6th — under an octave), tenor-bass gap (a perfect 12th — tenor-bass may exceed an octave). All valid.',
    },
    {
      id: 'l3u10m1t2',
      instruction:
        'Explain why doubling the leading tone (B in C major) is forbidden: both B notes must resolve upward to C, producing parallel octaves — one of the most serious voice-leading errors',
    },
    {
      id: 'l3u10m1t3',
      instruction:
        'Write an F major triad in SATB with proper doubling: double the root F. Then write a viio (Bdim) triad — here double the third (D), not the root, because B is the leading tone and the root of a diminished chord is unstable',
    },
  ],
  prerequisites: ['l3u9m4'],

};

const l3u10m2: CurriculumModule = {
  id: 'l3u10m2',
  unitId: 'u10',
  levelId: 'l3',
  title: 'Forbidden Parallels and Voice Motion (in Common-Practice Style)',
  subtitle:
    'The four motion types and the parallel fifths/octaves rules that govern part writing',
  objectives: [
    'Identify the four types of voice motion: contrary, oblique, similar, parallel',
    'Recognize and avoid forbidden parallel fifths and octaves',
    'Understand direct (hidden) fifths and octaves and when they are acceptable',
  ],
  concepts: [
    {
      title: 'Four Types of Voice Motion',
      explanation:
        'Between any two voices moving from one chord to the next: contrary motion (opposite directions) produces the strongest independence and is always the safest choice. Oblique motion (one stays, one moves) is smooth and unobtrusive. Similar motion (same direction, different intervals) is acceptable but needs monitoring. Parallel motion (same direction, same interval) is the most restricted — certain parallel intervals are forbidden because they destroy the independence of the voices.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'See C major — the starting chord for voice motion exercises',
    },
    {
      title: 'Parallel Fifths and Octaves',
      explanation:
        'Parallel fifths occur when two voices a perfect fifth apart both move by the same interval to another perfect fifth. Parallel octaves are the same at the octave. Both are forbidden in common-practice harmony because the voices fuse acoustically — they stop sounding like independent melodic lines and collapse into a single reinforced line. Parallel thirds and sixths, by contrast, are encouraged because imperfect consonances maintain voice independence.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'See G major — practice moving from C to G and checking for parallels',
    },
    {
      title: 'Direct (Hidden) Fifths and Octaves',
      explanation:
        'Direct fifths and octaves occur when two voices move in similar motion (same direction but not the same interval) into a perfect fifth or octave. These are less severe than parallel fifths but still restricted, especially between the outer voices (soprano and bass). The standard exception: direct fifths or octaves are acceptable if the soprano moves by step, because stepwise soprano motion masks the effect. In inner voices, direct intervals are generally tolerated.',
      tryThisQuery: 'F major chord',
      tryThisLabel: 'See F major — imagine soprano and bass moving into a fifth',
    },
  ],
  tasks: [
    {
      id: 'l3u10m2t1',
      instruction:
        'Given two chords, C major (C-E-G) moving to F major (F-A-C), identify the motion type between each voice pair. If bass moves C down to F while soprano moves G up to A, that is contrary motion — the strongest and most desirable type',
    },
    {
      id: 'l3u10m2t2',
      instruction:
        'Identify the parallel fifths in this progression: soprano G-A, bass C-D. In the first chord the interval is a perfect fifth (C to G). In the second chord the interval is still a perfect fifth (D to A). Both voices moved up by step — parallel fifths. Forbidden.',
    },
    {
      id: 'l3u10m2t3',
      instruction:
        'Write C major to G major in SATB where the bass moves C up to G (a fifth) and the soprano moves E down to D (a step down). Classify each voice pair\u2019s motion type. Verify no parallel fifths or octaves exist',
    },
  ],
  prerequisites: ['l3u10m1'],

};

const l3u10m3: CurriculumModule = {
  id: 'l3u10m3',
  unitId: 'u10',
  levelId: 'l3',
  title: 'Root Position Part Writing',
  subtitle:
    'Connecting root-position triads with smooth voice leading by root motion type',
  objectives: [
    'Connect triads in root position following voice leading rules',
    'Apply different strategies based on whether roots move by fifth, third, or second',
    'Write smooth inner voices while maintaining proper doubling and avoiding parallels',
  ],
  concepts: [
    {
      title: 'The Goal of Part Writing',
      explanation:
        'Part writing produces four independent melodic lines that, taken together, create correct harmony. Each voice should be individually singable. The bass defines the chord. The soprano carries the melody. Alto and tenor fill the harmony. The challenge is moving all four voices smoothly from chord to chord while obeying spacing, doubling, and voice-motion rules simultaneously.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'See C major — the chord you will voice in four parts',
    },
    {
      title: 'Root Movement by Fifth — Keep the Common Tone',
      explanation:
        'When chord roots are a fifth apart (I-V, I-IV, ii-V), one common tone exists between the two chords. Keep that common tone in the same voice and move the other two upper voices to the nearest available chord tones. This is the most common root motion in tonal music and consistently produces the smoothest, most economical voice leading.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'See G major — I to V shares the common tone G',
    },
    {
      title: 'Root Movement by Third and by Second',
      explanation:
        'Roots a third apart (I-vi, I-iii, IV-ii) share two common tones — keep both in the same voices and move only the remaining voice. Roots a second apart (IV-V, V-vi, I-ii) share zero common tones — all three upper voices must move. For stepwise bass movement, move all upper voices in contrary motion to the bass to prevent the parallel fifths and octaves that easily creep in.',
      tryThisQuery: 'Am',
      tryThisLabel: 'See Am — I to vi shares two common tones (C and E)',
    },
  ],
  tasks: [
    {
      id: 'l3u10m3t1',
      instruction:
        'Write I-V-I in C major in SATB on paper. Between I and V, the common tone is G — keep it in the same voice. Between V and I, keep G again. Move the remaining voices to the nearest chord tones',
    },
    {
      id: 'l3u10m3t2',
      instruction:
        'Write IV-V in C major. The roots F and G are a second apart — zero common tones. Move all upper voices in contrary motion to the bass (bass rises F to G, upper voices descend). Check every voice pair for parallel fifths and octaves',
    },
    {
      id: 'l3u10m3t3',
      instruction:
        'Write I-vi in C major. The roots C and A are a third apart — two common tones (C and E). Keep both in the same voices and move only the remaining voice from G to A. This produces the smoothest possible voice leading with minimal motion',
    },
  ],
  prerequisites: ['l3u10m2'],

};

const l3u10m4: CurriculumModule = {
  id: 'l3u10m4',
  unitId: 'u10',
  levelId: 'l3',
  title: 'Triads in Inversion',
  subtitle:
    'When and why to use inverted triads — including the restricted second inversion',
  objectives: [
    'Understand when and why to use first inversion (6/3) triads for smoother bass lines',
    'Know the four sanctioned uses of second inversion (6/4) triads',
    'Apply proper doubling rules for inverted triads',
  ],
  concepts: [
    {
      title: 'First Inversion — Versatile and Smooth',
      explanation:
        'First inversion places the third in the bass, creating a lighter, less emphatic version of the chord. Its primary purpose is creating a smooth, stepwise bass line — the most common reason composers invert triads. Any root-position triad can be placed in first inversion for variety. Double the soprano note; avoid doubling the bass if it is a leading tone or tendency tone.',
      tryThisQuery: 'C/E',
      tryThisLabel: 'Hear C major in first inversion — E in the bass',
    },
    {
      title: 'Second Inversion — Restricted Usage',
      explanation:
        'Second inversion places the fifth in the bass, creating an interval of a perfect fourth above the bass — historically treated as dissonant. In common-practice harmony, second inversion triads are not freely used. Four sanctioned patterns exist: the cadential 6/4 (I6/4 decorating V at a cadence), the passing 6/4 (stepwise bass between inversions), the pedal 6/4 (upper voices move over a sustained bass), and the arpeggiated 6/4 in accompaniment figures.',
      tryThisQuery: 'C/G',
      tryThisLabel: 'Hear C major in second inversion — G in the bass',
    },
    {
      title: 'The Cadential 6/4',
      explanation:
        'The most important second-inversion pattern: I6/4 resolving to V at a cadence. The 6th and 4th above the bass act as double appoggiaturas that resolve stepwise down to the 5th and 3rd of V. Many theorists analyze this not as a tonic chord but as a decorated dominant — V with suspensions. This distinction matters: the cadential 6/4 functions as dominant, not tonic, despite its spelling.',
      tryThisQuery: 'F/A',
      tryThisLabel:
        'Hear F in first inversion — smooth bass line building block',
    },
  ],
  tasks: [
    {
      id: 'l3u10m4t1',
      instruction:
        "Play 'C/E' then 'C/G' — same three notes, different bass note. First inversion sounds lighter and smoother; second inversion sounds unstable and wants to resolve downward",
    },
    {
      id: 'l3u10m4t2',
      instruction:
        "Play 'C/G' then 'G7' — this demonstrates the cadential 6/4 pattern. The C/G functions as a decoration of the dominant, not as a real tonic chord. Hear how it flows naturally into G7",
    },
    {
      id: 'l3u10m4t3',
      instruction:
        "Play 'F/A' — F major in first inversion. The bass note A creates a smooth stepwise connection from G (a dominant chord) through A to Bb, enabling a walking bass line that root-position chords cannot achieve",
      query: 'F/A',
    },
  ],
  prerequisites: ['l3u10m3'],
};

// ---------------------------------------------------------------------------
// Level 3, Unit 11: Cadences, Phrases, and Embellishment
// Engine coverage: 3.6 Cadences → PARTIAL
//                  3.7 Phrases/Periods → NONE
//                  3.8 Harmonic Rhythm → NONE
//                  3.9 Non-Chord Tones → NONE
//                  3.10 Transposition → FULL
// ---------------------------------------------------------------------------

const l3u11m1: CurriculumModule = {
  id: 'l3u11m1',
  unitId: 'u11',
  levelId: 'l3',
  title: 'Cadences: The Complete Set',
  subtitle:
    'All six standard cadence types — the harmonic punctuation that shapes musical phrases',
  objectives: [
    'Identify and hear all six standard cadence types',
    'Understand cadences as harmonic punctuation defining phrase boundaries',
    'Distinguish strong cadences (PAC) from weak ones (HC, IAC) and deceptive resolutions',
  ],
  concepts: [
    {
      title: 'Authentic Cadences — Perfect and Imperfect',
      explanation:
        'The perfect authentic cadence (PAC) is V(7) to I, both in root position, with the soprano landing on scale degree 1. It is the strongest harmonic arrival — a full stop. The imperfect authentic cadence (IAC) also moves V to I but weakens the closure: one chord may be inverted, or the soprano lands on the 3rd or 5th of I instead of the root, or viio6 substitutes for V (leading-tone IAC). An IAC functions like a comma rather than a period.',
      tryThisQuery: 'G7',
      tryThisLabel:
        'Hear V7 in C major — the departure point of authentic cadences',
    },
    {
      title: 'Half, Plagal, and Deceptive Cadences',
      explanation:
        'A half cadence ends on V — any chord moving to the dominant. It sounds like an unanswered question, creating suspense at phrase boundaries. The plagal cadence (IV to I) is the gentle "Amen" cadence, softer than authentic. The deceptive cadence (V to vi) subverts the expected resolution: vi shares two tones with I (in C major, Am shares C and E with the C chord), producing a near-miss that surprises the listener and extends the phrase. In minor keys, the deceptive cadence is V to VI — a major chord (e.g., E7 to F in A minor). Because VI is major rather than minor, the shared-tone logic differs: VI shares only one tone with i (the tonic note itself), giving the minor deceptive cadence a warmer, more dramatic surprise than its major-key counterpart.',
      tryThisQuery: 'C major chord',
      tryThisLabel:
        'Hear the tonic — the destination of authentic and plagal cadences',
    },
    {
      title: 'The Phrygian Half Cadence',
      explanation:
        'Characteristic of minor keys: iv6 resolving to V, with the bass descending by half step from scale degree b6 to 5. This half-step descent in the bass gives the cadence its name — it resembles the characteristic falling half step of the Phrygian mode. Common in Baroque music, the Phrygian half cadence has a distinctively dark, archaic quality that no other cadence replicates.',
      tryThisQuery: 'Dm/F',
      tryThisLabel: 'Hear iv6 — the Phrygian HC approach in A minor',
    },
  ],
  tasks: [
    {
      id: 'l3u11m1t1',
      instruction:
        "Play 'G7' then 'C major chord' — this is a perfect authentic cadence (V7-I) in C major. The strongest possible harmonic conclusion. Hear the complete sense of resolution",
      query: 'G7',
    },
    {
      id: 'l3u11m1t2',
      instruction:
        "Play 'G7' then 'Am' — this is a deceptive cadence (V7-vi). You expected C major but got A minor instead. Notice how it extends the phrase rather than concluding it",
    },
    {
      id: 'l3u11m1t3',
      instruction:
        "Play 'F major chord' then 'C major chord' — this is a plagal cadence (IV-I). Gentler and more devotional than the authentic cadence. Often heard as a final 'Amen' after the real cadence",
    },
  ],
  prerequisites: ['l3u10m4'],
};

const l3u11m2: CurriculumModule = {
  id: 'l3u11m2',
  unitId: 'u11',
  levelId: 'l3',
  title: 'Phrases and Periods',
  subtitle:
    'Musical sentences, antecedent-consequent pairs, and the sentence (Satz) structure',
  objectives: [
    'Hear a phrase as a musical sentence with a beginning, middle, and cadence',
    'Understand the period as antecedent (question) paired with consequent (answer)',
    'Distinguish parallel periods, contrasting periods, and the sentence (Satz) structure',
  ],
  concepts: [
    {
      title: 'The Musical Phrase',
      explanation:
        'A phrase is the fundamental unit of musical form — typically 4 or 8 measures long. It has a beginning that establishes the key, a middle that develops harmonic motion, and an end marked by a cadence. Every cadence signals a phrase boundary. Think of a phrase as a complete musical thought, comparable to a sentence in spoken language — it makes a self-contained statement.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See the key of C — most phrases begin and end in a single key',
    },
    {
      title: 'Periods: Antecedent and Consequent',
      explanation:
        'A period pairs two phrases into a question-and-answer structure. The antecedent (first phrase) ends with a weak cadence — usually a half cadence or IAC — posing a musical question. The consequent (second phrase) ends with a strong cadence — usually a PAC — providing the answer. In a parallel period, both phrases share similar opening material. In a contrasting period, the openings differ. A double period groups four phrases into two larger antecedent-consequent pairs.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Hear V — the chord that ends an antecedent phrase (half cadence)',
    },
    {
      title: 'The Sentence (Satz)',
      explanation:
        'An alternative 8-measure phrase structure common in Classical music: a 2-measure basic idea is stated, then repeated (often varied) in measures 3-4, followed by a 2-measure continuation that fragments the idea and builds momentum, concluding with a 2-measure cadential gesture. The sentence creates forward drive through repetition, fragmentation, and rhythmic acceleration — a fundamentally different architecture from the balanced period.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear I — the tonic that anchors both sentence and period structures',
    },
  ],
  tasks: [
    {
      id: 'l3u11m2t1',
      instruction:
        'Listen to any well-known melody and identify where each phrase ends — each resting point or moment of arrival marks a cadence and a phrase boundary. Count the measures between cadences',
    },
    {
      id: 'l3u11m2t2',
      instruction:
        'Think of a parallel period as a question and answer that begin the same way but end differently. The antecedent asks (ending on a half cadence), and the consequent answers (ending on a PAC)',
    },
    {
      id: 'l3u11m2t3',
      instruction:
        'Identify the sentence structure in a Classical melody: find the 2-bar basic idea, its repetition, the fragmentation that follows, and the final cadence. Mozart and Beethoven use this form constantly',
    },
  ],
  prerequisites: ['l3u11m1'],

};

const l3u11m3: CurriculumModule = {
  id: 'l3u11m3',
  unitId: 'u11',
  levelId: 'l3',
  title: 'Harmonic Rhythm',
  subtitle:
    'How the rate of chord change shapes musical momentum and phrase structure',
  objectives: [
    'Define harmonic rhythm as the rate of chord change independent of melodic rhythm',
    'Hear how harmonic rhythm interacts with meter — strong beats vs. weak beats',
    'Recognize the universal pattern of harmonic rhythm accelerating toward cadences',
  ],
  concepts: [
    {
      title: 'What Is Harmonic Rhythm?',
      explanation:
        'Harmonic rhythm is the pattern of chord changes over time. One chord per measure is slow harmonic rhythm. One chord per beat is moderate. Two chords per beat is fast. Crucially, harmonic rhythm is independent of melodic rhythm — the melody can race over slow chord changes or sustain long notes over rapidly shifting harmony. It is one of the primary tools composers use to control tension and pacing.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear C major — imagine holding this chord for four full bars',
    },
    {
      title: 'Harmonic Rhythm, Meter, and Cadential Acceleration',
      explanation:
        'Chord changes are strongest on strong beats. In 4/4, changing chords on beats 1 and 3 feels grounded and natural; changing on beats 2 and 4 creates syncopated harmonic rhythm that feels unstable. A universal pattern across styles: harmonic rhythm accelerates toward cadences. A phrase might hold one chord for two bars, then change every bar, then every beat at the cadence — building momentum into the moment of arrival.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Hear V7 — cadential acceleration often culminates on the dominant',
    },
    {
      title: 'Harmonic Rhythm as an Expressive Tool',
      explanation:
        'Different harmonic rhythms create fundamentally different characters. A hymn with one chord per beat feels measured and stately. A jazz standard with two or more chords per bar feels harmonically dense and kinetic. A film score holding a single chord for eight bars creates vast, open space. Composers choose harmonic rhythm as deliberately as they choose chords — it shapes the listener experience at the deepest structural level.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'Hear Dm7 — in a fast harmonic rhythm this might last only one beat',
    },
  ],
  tasks: [
    {
      id: 'l3u11m3t1',
      instruction:
        'Listen to any piece and tap each time the chord changes. Is the harmonic rhythm slow (one chord per bar), moderate (two per bar), or fast (every beat)? Most phrases accelerate toward their cadences',
    },
    {
      id: 'l3u11m3t2',
      instruction:
        "Compare a hymn (slow harmonic rhythm — one chord per beat or per bar) to a bebop jazz standard (fast harmonic rhythm — two or more chords per bar). The rate of harmonic change directly shapes the music's character and energy",
    },
    {
      id: 'l3u11m3t3',
      instruction:
        'Pick a familiar song and map its harmonic rhythm across the verse and chorus. Does the chorus change chords faster or slower than the verse? How does that affect the emotional impact?',
    },
  ],
  prerequisites: ['l3u11m2'],

};

const l3u11m4: CurriculumModule = {
  id: 'l3u11m4',
  unitId: 'u11',
  levelId: 'l3',
  title: 'Non-Chord Tones (Part 1)',
  subtitle:
    'Passing tones, neighbor tones, and anticipations — the seasoning of melody',
  objectives: [
    'Identify passing tones, neighbor tones, and anticipations in a melodic line',
    'Distinguish accented from unaccented non-chord tones',
    'Understand NCTs as stepwise embellishments that animate otherwise static chord tones',
  ],
  concepts: [
    {
      title: 'What Are Non-Chord Tones?',
      explanation:
        'Non-chord tones (NCTs) are melody notes that do not belong to the underlying chord. They create melodic interest, tension, and stepwise motion between chord tones. Without them, melodies would consist only of arpeggiated chord tones — mechanical and lifeless. NCTs are classified by how they are approached and left: by step, by leap, or by common tone. They are the melodic seasoning that brings harmony to life.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'See C major — D, F, A, and B are non-chord tones against this chord',
    },
    {
      title: 'Passing Tones and Neighbor Tones',
      explanation:
        'A passing tone fills the gap between two different chord tones, approached and left by step in the same direction (C-D-E over a C chord, where D is a passing tone between C and E). A neighbor tone decorates a single chord tone — it departs by step and returns to its starting note (C-D-C, where D is an upper neighbor). Both types come in accented (on a strong beat, more dramatic) and unaccented (on a weak beat, more common) varieties.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See C major scale — scale steps between chord tones are passing tones',
    },
    {
      title: 'Anticipations and Incomplete Neighbors',
      explanation:
        'An anticipation arrives early — a note belonging to the next chord sounds at the end of the current chord, then sustains as the harmony catches up. It creates forward momentum by jumping ahead of the harmonic change. An incomplete neighbor is approached by step but left by leap (or vice versa), having only one stepwise connection. Incomplete neighbors are more dramatic and angular than their complete, symmetrical counterparts.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'See G major — anticipating a note of the next chord creates momentum',
    },
  ],
  tasks: [
    {
      id: 'l3u11m4t1',
      instruction:
        'Sing or play C-D-E over a C major chord. D does not belong to C-E-G — it is a passing tone connecting the root to the third by step in one direction',
    },
    {
      id: 'l3u11m4t2',
      instruction:
        'Sing or play E-F-E over a C major chord. F is an upper neighbor tone — it departs from E by step and returns to E, decorating the chord tone without changing harmony',
    },
    {
      id: 'l3u11m4t3',
      instruction:
        'Identify NCTs in a simple melody you know: play each note against the underlying chord and ask whether it belongs. Notes that do not belong are non-chord tones. Classify each as passing, neighbor, or anticipation based on its approach and departure',
    },
  ],
  prerequisites: ['l3u11m3'],

};

const l3u11m5: CurriculumModule = {
  id: 'l3u11m5',
  unitId: 'u11',
  levelId: 'l3',
  title: 'Transposition',
  subtitle:
    'Moving music to any key while preserving all interval relationships',
  objectives: [
    'Transpose a melody or passage to a different key using interval or key-signature methods',
    'Understand concert pitch vs. written pitch for transposing instruments',
    'Use the app to verify transpositions by comparing scales in different keys',
  ],
  concepts: [
    {
      title: 'What Is Transposition?',
      explanation:
        'Transposition moves an entire passage to a different key while preserving all interval relationships. Every note shifts by the same interval. The melody sounds identical — just higher or lower. Transposition serves both practical purposes (fitting a singer\'s range, matching instrument keys) and theoretical ones (understanding that the same harmonic logic operates in every key).',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See C major — your starting key for transposition',
    },
    {
      title: 'Two Transposition Methods',
      explanation:
        'The interval method: determine the interval between the original key and the target key, then shift every note by that exact interval. C major to Eb major is up a minor third, so every note goes up a minor third. The key signature method: change the key signature to the target key and adjust any accidentals to match. Both produce the same result; the interval method is more reliable for short passages.',
      tryThisQuery: 'Eb major scale',
      tryThisLabel: 'See Eb major — C major transposed up a minor third',
    },
    {
      title: 'Transposing Instruments and Concert Pitch',
      explanation:
        'Some instruments sound a different pitch than they read. Bb instruments (trumpet, clarinet, tenor sax) sound a major second lower than written — to hear concert C, they read D. Eb instruments like the alto saxophone sound a major sixth lower (or equivalently, a minor third higher). F instruments (French horn) sound a perfect fifth lower. Concert pitch is the actual sounding pitch; all instruments align to it when the orchestra tunes to A440.',
      tryThisQuery: 'Bb major scale',
      tryThisLabel:
        'See Bb major — what a Bb trumpet sounds when reading C major',
    },
  ],
  tasks: [
    {
      id: 'l3u11m5t1',
      instruction:
        "Compare 'C major scale' and 'G major scale' — every note has moved up a perfect fifth. The interval pattern W-W-H-W-W-W-H is preserved exactly; only the letter names change",
      query: 'G major scale',
    },
    {
      id: 'l3u11m5t2',
      instruction:
        "Open 'C major scale' then 'Eb major scale' — you have transposed up a minor third. Verify: C becomes Eb, D becomes F, E becomes G, and so on. Every interval is maintained",
      query: 'Eb major scale',
    },
    {
      id: 'l3u11m5t3',
      instruction:
        "A Bb trumpet reads 'C major scale' but produces the sound of 'Bb major scale'. Open both and verify: every sounding note is a major second lower than the written note. This is why trumpet parts are written a whole step higher than concert pitch",
    },
  ],
  prerequisites: ['l3u11m4'],
};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

export const L3_UNITS: CurriculumUnit[] = [
  {
    id: 'u9',
    levelId: 'l3',
    title: 'Seventh Chords and Diatonic Harmony',
    description:
      'The five seventh chord qualities, inversions, diatonic seventh chords in major and minor, and the dominant seventh as harmonic engine',
    icon: 'chords',
    modules: [l3u9m1, l3u9m2, l3u9m3, l3u9m4],
    milestone: {
      skillsSummary: [
        'Build and identify all five seventh chord qualities by sound and structure',
        'Voice seventh chords in all four inversions using figured bass notation',
        'Map diatonic seventh chords in any major or harmonic minor key using Roman numerals',
        'Hear the tritone inside V7 and understand its resolution as the engine of tonal music',
      ],
      bridgeText:
        'You can now build, invert, and analyze every standard seventh chord and locate them within major and minor keys. Next, you\u2019ll learn how to connect these chords smoothly through voice leading — the art of making each voice sing its own melodic line.',
      tryThisQuery: 'Bm7b5',
      tryThisLabel: 'Build the half-diminished vii\u00f87 in C major',
      tryThisPrompt:
        'This is the vii\u00f87 chord in C major. Can you name its four notes and explain why it functions as a dominant substitute?',
    },
  },
  {
    id: 'u10',
    levelId: 'l3',
    title: 'Voice Leading and Part Writing',
    description:
      'SATB voicing, spacing rules, forbidden parallels, connecting chords with smooth voice motion, and the role of inversions',
    icon: 'harmony',
    modules: [l3u10m1, l3u10m2, l3u10m3, l3u10m4],
    milestone: {
      skillsSummary: [
        'Apply SATB spacing, doubling, and voice-crossing rules correctly',
        'Identify the four types of voice motion and avoid forbidden parallels',
        'Connect root-position triads using common-tone and contrary-motion strategies',
        'Use first and second inversion triads to create smooth bass lines and cadential patterns',
      ],
      bridgeText:
        'You can now write and connect chords following the rules of voice leading. The final unit applies these skills to cadences, phrase structure, embellishment, and transposition — completing your harmony foundations.',
      tryThisQuery: 'C/E',
      tryThisLabel: 'Hear C major in first inversion',
      tryThisPrompt:
        'First inversion puts E in the bass. How does this create a smoother bass line when moving from a D chord to a C chord?',
    },
  },
  {
    id: 'u11',
    levelId: 'l3',
    title: 'Cadences, Phrases, and Embellishment',
    description:
      'All six cadence types, phrase and period structure, harmonic rhythm, non-chord tones, and transposition to any key',
    icon: 'scales',
    modules: [l3u11m1, l3u11m2, l3u11m3, l3u11m4, l3u11m5],
    milestone: {
      skillsSummary: [
        'Identify all six cadence types and their relative strength as harmonic punctuation',
        'Analyze phrase structures as periods (antecedent-consequent) or sentences (Satz)',
        'Hear how harmonic rhythm and non-chord tones shape the surface of tonal music',
        'Transpose any passage to a new key using interval or key-signature methods',
      ],
      bridgeText: '',
      tryThisQuery: 'Ab major scale',
      tryThisLabel: 'Transpose C major up a minor sixth to Ab',
      tryThisPrompt:
        'Every note of C major shifted up a minor sixth produces Ab major. Can you name all the notes before looking?',
    },
  },
];
