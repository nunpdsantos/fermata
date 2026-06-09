import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 4, Unit 12: Non-Chord Tones and Dominant Seventh
// ---------------------------------------------------------------------------

const l4u12m1: CurriculumModule = {
  id: 'l4u12m1',
  unitId: 'u12',
  levelId: 'l4',
  title: 'Suspensions',
  subtitle: 'The 4-3, 7-6, 9-8, and 2-3 suspension types',
  objectives: [
    'Understand the three-phase suspension pattern: preparation, dissonance, resolution',
    'Identify all four suspension types by their intervals above the bass',
    'Recognize the 2-3 bass suspension: the bass resolves downward by step, and the interval above it grows from a 2nd to a 3rd',
  ],
  concepts: [
    {
      title: 'The Suspension Mechanism',
      explanation:
        'A suspension is a note held (tied) from the previous chord into the new chord, creating a dissonance that resolves by step (usually downward). It has three phases: preparation (consonant note in the previous chord), suspension (the same note held over into the new chord, now dissonant, on a strong beat), and resolution (the held note moves by step to a consonant chord tone). The dissonance on the strong beat is what gives suspensions their expressive power \u2014 the listener expects consonance and gets tension instead.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear the consonant resolution target',
    },
    {
      title: 'Suspension Types: 4-3, 7-6, 9-8',
      explanation:
        'Suspensions are named by the intervals they form above the bass at the moment of dissonance and resolution. The 4-3 suspension is the most common: a 4th above the bass resolves to a 3rd. The 7-6 suspension holds a 7th that resolves to a 6th \u2014 common in sequences and chains of suspensions. The 9-8 suspension holds a 9th (or 2nd an octave up) that resolves to an octave. All three resolve downward by step.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Imagine holding C over this chord (4-3 sus)',
    },
    {
      title: 'The 2-3 Bass Suspension',
      explanation:
        'The 2-3 suspension is unique: it occurs in the bass voice rather than an upper voice. The bass note is held from the previous chord, forming a 2nd against a stationary upper voice, then resolves downward by step. The label "2-3" describes the interval above the bass: as the bass descends, that interval grows from a 2nd to a 3rd — the upper voice does not move. The bass, like all standard suspensions, resolves by step downward. (Kostka/Payne, Tonal Harmony, Ch. 12.)',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hold E in an upper voice while the bass descends D → C — the interval above the bass grows from a 2nd to a 3rd',
    },
  ],
  tasks: [
    {
      id: 'l4u12m1t1',
      instruction: "Play 'C major chord' and imagine holding the note F while the chord sounds \u2014 the F is a dissonant 4th above the bass that wants to resolve down to E (a 4-3 suspension pattern)",
    },
    {
      id: 'l4u12m1t2',
      instruction: "In a 7-6 suspension, a 7th above the bass resolves to a 6th. Imagine the note B held over a C bass: B is a 7th, and it resolves down to A (a 6th above C). This creates a gentler dissonance than the 4-3",
    },
    {
      id: 'l4u12m1t3',
      instruction: "Compare the three upper-voice suspension types: 4-3 (most common, strong dissonance), 7-6 (moderate, often chained in sequences), 9-8 (wide spacing, octave resolution). All share the same preparation-dissonance-resolution mechanism",
    },
  ],
  prerequisites: ['l3u11m5'],

};

const l4u12m2: CurriculumModule = {
  id: 'l4u12m2',
  unitId: 'u12',
  levelId: 'l4',
  title: 'Appoggiatura, Escape Tone, and Retardation',
  subtitle: 'Accented and unaccented non-chord tones approached by leap or resolved upward',
  objectives: [
    'Identify the appoggiatura by its leap approach and step resolution on a strong beat',
    'Recognize the escape tone as the reverse: step approach, leap departure',
    'Understand the retardation as a suspension that resolves upward instead of down',
  ],
  concepts: [
    {
      title: 'The Appoggiatura',
      explanation:
        'The appoggiatura is approached by leap and resolved by step in the opposite direction, landing on a strong beat. The word means "leaning note" \u2014 it leans heavily into its resolution, creating a dramatic, accented dissonance more striking than a passing tone because the leap makes it unexpected. The leap creates surprise, and the stepwise resolution provides the expected relief. Appoggiaturas are a hallmark of expressive, Romantic-era melody.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Hear stepwise motion that appoggiaturas decorate',
    },
    {
      title: 'The Escape Tone',
      explanation:
        'The escape tone (echappee) is the reverse of the appoggiatura: approached by step and left by leap in the opposite direction. It steps away from a chord tone, then leaps back to a different chord tone, creating a brief decorative gesture on a weak beat. Because it lands on a weak beat and departs by leap, it is less dramatic than the appoggiatura \u2014 a fleeting ornament rather than an expressive accent.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Stepwise motion is where escape tones begin',
    },
    {
      title: 'The Retardation',
      explanation:
        'A retardation uses the same held-note mechanism as a suspension but resolves upward by step instead of downward. The most typical retardation is 7-8: the leading tone is held over from the dominant chord and resolves up to the tonic. It sounds like a suspension that goes the "wrong" way. Retardations are less common than suspensions because upward resolution is less natural in tonal voice leading, but the 7-8 retardation is idiomatic at cadential points.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'The B in G major can retard upward to C',
    },
  ],
  tasks: [
    {
      id: 'l4u12m2t1',
      instruction: "Classify these NCTs by approach and departure: appoggiatura (leap to strong beat, step resolution in opposite direction), escape tone (step approach, leap departure in opposite direction), retardation (held note, step up). The appoggiatura and escape tone are mirror images",
    },
    {
      id: 'l4u12m2t2',
      instruction: "Play 'G major chord' \u2014 imagine the note B held over while the chord changes to C major. B resolves up to C: that is a 7-8 retardation, the most common retardation type",
    },
    {
      id: 'l4u12m2t3',
      instruction: "Compare: a suspension resolves DOWN by step (4-3: F down to E), while a retardation resolves UP by step (7-8: B up to C). Same mechanism, opposite direction. Suspensions are far more common because downward resolution feels more natural",
    },
  ],
  prerequisites: ['l4u12m1'],

};

const l4u12m3: CurriculumModule = {
  id: 'l4u12m3',
  unitId: 'u12',
  levelId: 'l4',
  title: 'Pedal Point and Changing Tones',
  subtitle: 'Sustained bass notes and double-neighbor ornaments',
  objectives: [
    'Understand the pedal point as a sustained note over changing harmonies',
    'Identify bass, inverted, internal, and double pedal types',
    'Recognize changing tones (double neighbor) as a paired ornamental figure',
  ],
  concepts: [
    {
      title: 'The Pedal Point',
      explanation:
        'A pedal point is a sustained or repeated note (usually in the bass) over changing harmonies, creating alternating dissonances and consonances as the chords move above it. Tonic pedals anchor beginnings and endings of pieces, providing grounding stability. Dominant pedals build tension before a return to the tonic, creating a sense of anticipation as harmonies shift above the held dominant note.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'C is the most common tonic pedal note',
    },
    {
      title: 'Pedal Point Types',
      explanation:
        'The bass pedal is the most common type, with the sustained note in the lowest voice. An inverted pedal sustains a note in the soprano voice while harmonies move below. An internal pedal holds a note in an inner voice (alto or tenor), creating a subtler effect. A double pedal sustains two notes simultaneously, usually tonic and dominant (like C and G held together), creating a powerful anchoring effect.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'G is the dominant pedal note in C major',
    },
    {
      title: 'Changing Tones (Double Neighbor)',
      explanation:
        'Changing tones are a pair of neighbor tones in sequence: chord tone, upper neighbor, lower neighbor, back to the original chord tone (or the reverse order). Also called a "neighbor group" or "double neighbor." They create a decorative orbit around a single pitch, embellishing it from both sides before returning. The figure typically spans a weak-beat position and adds melodic interest without disrupting the underlying harmony.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Imagine orbiting around E with F then D',
    },
  ],
  tasks: [
    {
      id: 'l4u12m3t1',
      instruction: "Imagine a bass note C sustained while chords change above: C major, F major, G7, C major. The F and G7 chords create dissonance against the bass C \u2014 that is a tonic pedal point in action",
    },
    {
      id: 'l4u12m3t2',
      instruction: "Now imagine a dominant pedal: the bass holds G while chords shift above (G, C/G, D/G, G). The sustained G creates growing tension that resolves when the harmony finally aligns with the bass",
    },
    {
      id: 'l4u12m3t3',
      instruction: "A changing tone figure around E in C major: E-F-D-E. The F is the upper neighbor, D is the lower neighbor, and the figure returns to E. This double-neighbor ornament decorates a single chord tone from both sides",
    },
  ],
  prerequisites: ['l4u12m2'],

};

const l4u12m4: CurriculumModule = {
  id: 'l4u12m4',
  unitId: 'u12',
  levelId: 'l4',
  title: 'The Dominant Seventh \u2014 Resolution Rules',
  subtitle: 'V7 tendency tones, voice leading, and the tritone resolution',
  objectives: [
    'Master V7 resolution tendencies: the 7th resolves down, the leading tone resolves up',
    'Voice complete and incomplete V7 chords correctly',
    'Understand the tritone contraction that drives V7-I resolution',
  ],
  concepts: [
    {
      title: 'V7 Tendency Tones',
      explanation:
        'The dominant seventh chord contains two tendency tones that create its powerful gravitational pull toward the tonic. The leading tone (the 3rd of V7) resolves up by half step to the tonic. The chordal 7th resolves down by step to the 3rd of I. Together, these two voices form a tritone that contracts to an imperfect consonance (a 3rd or 6th), generating the strongest harmonic drive in tonal music.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Hear the unresolved tension of G7',
    },
    {
      title: 'Complete vs. Incomplete V7',
      explanation:
        'A complete V7 has all four tones: root, 3rd, 5th, and 7th. An incomplete V7 omits the 5th and doubles the root, used when voice leading with the complete form would be awkward. When a complete V7 resolves to I, the resulting tonic chord is often incomplete (tripled root, missing 5th) because both tendency tones must resolve correctly. This trade-off between chord completeness and voice-leading smoothness is a central concern in part-writing.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear the resolution target of G7',
    },
    {
      title: 'The Tritone Resolution',
      explanation:
        'The tritone between the leading tone and the chordal 7th is what makes V7 uniquely powerful. In G7, the tritone is B-F. When G7 resolves to C, B rises to C and F falls to E \u2014 the tritone contracts to the consonant third C-E. This contraction from maximum dissonance to consonance is the engine of tonal resolution. Every V7-I motion in every key follows this same tritone-to-consonance pattern.',
      tryThisQuery: 'G7',
      tryThisLabel: 'B and F form the tritone inside G7',
    },
  ],
  tasks: [
    {
      id: 'l4u12m4t1',
      instruction: "Type 'G7' \u2014 identify the two tendency tones: B (leading tone, resolves up to C) and F (chordal 7th, resolves down to E). Together they form the tritone that drives V7-I resolution",
      query: 'G7',
    },
    {
      id: 'l4u12m4t2',
      instruction: "Now type 'C major chord' \u2014 this is where G7 resolves. B went to C, F went to E. The tritone contracted to the consonant interval C-E",
      query: 'C major chord',
    },
    {
      id: 'l4u12m4t3',
      instruction: "Play 'G7' then 'C major chord' back to back \u2014 hear the tension-resolution cycle. The dominant seventh is the strongest chord-to-chord motion in tonal music",
    },
  ],
  prerequisites: ['l4u12m3'],
};

const l4u12m5: CurriculumModule = {
  id: 'l4u12m5',
  unitId: 'u12',
  levelId: 'l4',
  title: 'V7 Inversions and Their Resolutions',
  subtitle: 'How V6/5, V4/3, and V4/2 resolve to tonic positions',
  objectives: [
    'Resolve all four inversions of V7 to their proper tonic targets',
    'Understand why V4/2 almost always resolves to I6 (first-inversion tonic)',
    'Recognize how inversion determines bass motion and resolution',
  ],
  concepts: [
    {
      title: 'V7 Root Position and First Inversion (V6/5)',
      explanation:
        'Root position V7 resolves to I with the most emphatic effect \u2014 the bass drops a fifth (or rises a fourth) to the tonic root. First inversion V6/5 places the leading tone in the bass, which must step up by half step to the tonic. This creates the smoothest possible bass motion into the tonic chord and is especially useful when a stepwise bass line is desired.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Root position V7 in C major',
    },
    {
      title: 'Second Inversion (V4/3)',
      explanation:
        'V4/3 places the 5th of the dominant chord in the bass. It can resolve to either I (root position tonic) or I6 (first-inversion tonic), giving the composer flexibility in shaping the bass line. The bass note (the 5th of V) typically steps down to the tonic root or moves to the 3rd of I. V4/3 often appears in the middle of phrases as a passing dominant between tonic positions.',
      tryThisQuery: 'G/D',
      tryThisLabel: 'V4/3 has D (the 5th) in the bass',
    },
    {
      title: 'Third Inversion (V4/2)',
      explanation:
        'V4/2 places the chordal 7th in the bass. Since the 7th is a tendency tone that must resolve down by step, V4/2 almost always resolves to I6 (first-inversion tonic). In G7, the 7th is F; F must step down to E, giving C/E (I6) as the resolution. This constraint is absolute in strict voice leading \u2014 V4/2 to root-position I would leave the bass 7th unresolved.',
      tryThisQuery: 'G7/F',
      tryThisLabel: 'Play G7/F to hear V4/2 bass motion (F → E as the 7th resolves)',
    },
  ],
  tasks: [
    {
      id: 'l4u12m5t1',
      instruction: "Type 'G7' \u2014 root position, bass is G. The bass drops a 5th to C when resolving to I. This is the strongest, most emphatic V7-I bass motion",
      query: 'G7',
    },
    {
      id: 'l4u12m5t2',
      instruction: "Type 'G/B' \u2014 this is V6/5 with the leading tone B in the bass. B must step up to C, giving smooth stepwise bass motion into the tonic. Compare the effect with root-position G7",
      query: 'G/B',
    },
    {
      id: 'l4u12m5t3',
      instruction: "V4/2 puts F (the 7th) in the bass. F must resolve down to E, so V4/2 resolves to C/E (I6). This is not a choice \u2014 the tendency tone in the bass locks the resolution to first-inversion tonic",
    },
  ],
  prerequisites: ['l4u12m4'],
};

// ---------------------------------------------------------------------------
// Level 4, Unit 13: Diatonic Seventh Chords, Function, and Sequences
// ---------------------------------------------------------------------------

const l4u13m1: CurriculumModule = {
  id: 'l4u13m1',
  unitId: 'u13',
  levelId: 'l4',
  title: 'Pre-Dominant Seventh Chords: ii7 and IV7',
  subtitle: 'The strongest pre-dominant sonorities and the ii7-V7-I progression',
  objectives: [
    'Build and identify ii7 (minor 7th in major) and ii\u00F87 (half-diminished in minor)',
    'Understand the ii7-V7-I progression as the strongest functional sequence in tonal harmony',
    'Recognize IV7/IVmaj7 as a subdominant seventh with added warmth',
  ],
  concepts: [
    {
      title: 'The ii7 Chord',
      explanation:
        'The ii7 is the most important pre-dominant chord. In major keys it is a minor seventh chord; in minor keys it becomes a half-diminished seventh (ii\u00F87). The progression ii7-V7-I is the strongest functional sequence in tonal harmony because the root of ii7 (D) is a common tone with the 5th of V (D in G-B-D-F), creating a seamless voice-leading connection. The bass moves by descending fifth (or ascending fourth) at each step, reinforcing the gravitational pull toward the tonic.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'Hear ii7 in the key of C',
    },
    {
      title: 'The IV7 / IVmaj7 Chord',
      explanation:
        'IVmaj7 serves a subdominant (pre-dominant) function with added warmth and color. The major seventh interval gives it a lush quality distinct from the simpler IV triad. The seventh intensifies the pull toward the dominant by adding another voice that wants to resolve. While less common than ii7 in classical practice, IVmaj7 appears frequently in jazz and pop harmony as an alternative pre-dominant sonority.',
      tryThisQuery: 'Fmaj7',
      tryThisLabel: 'Hear IVmaj7 in the key of C',
    },
    {
      title: 'The ii7-V7-I Progression',
      explanation:
        'This three-chord sequence is the most fundamental harmonic progression in jazz and one of the strongest in all tonal music. Each chord flows into the next by descending fifth: D(m7) to G(7) to C. The voice leading is exceptionally smooth: the 7th of each chord resolves by step into the next chord, and common tones connect adjacent harmonies. In jazz, this progression is often extended: iii7-vi7-ii7-V7-Imaj7, a full circle-of-fifths descent.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'Start the ii7-V7-I in C major',
    },
  ],
  tasks: [
    {
      id: 'l4u13m1t1',
      instruction: "Type 'Dm7' then 'G7' then 'Cmaj7' \u2014 this is the ii7-V7-Imaj7 progression, the most fundamental chord sequence in jazz and the strongest functional progression in tonal harmony",
    },
    {
      id: 'l4u13m1t2',
      instruction: "Compare 'Dm7' with 'Fmaj7' \u2014 both are pre-dominant function in C major. Dm7 (ii7) has a darker, more propulsive quality; Fmaj7 (IVmaj7) is warmer and more expansive. Both lead naturally to G7 (V7)",
    },
    {
      id: 'l4u13m1t3',
      instruction: "Type 'Dm7' and notice the common tone with G7: the note D. The 7th of Dm7 (C) resolves by step to B (the 3rd of G7). This seamless voice-leading connection is why ii7-V7 is so strong",
      query: 'Dm7',
    },
  ],
  prerequisites: ['l4u12m5'],
};

const l4u13m2: CurriculumModule = {
  id: 'l4u13m2',
  unitId: 'u13',
  levelId: 'l4',
  title: 'Mediant, Submediant, and Tonic Sevenths',
  subtitle: 'iii7, vi7, Imaj7 \u2014 tonic-function sevenths and the jazz tonic',
  objectives: [
    'Understand iii7 as a tonic substitute and circle-of-fifths link',
    'Recognize vi7 as the primary tonic-function substitute and deceptive resolution target',
    'Distinguish Imaj7 (jazz tonic) from I7 (blues tonic)',
  ],
  concepts: [
    {
      title: 'The iii7 and vi7 Chords',
      explanation:
        'The iii7 functions as a tonic substitute (sharing two notes with I) or as a link in circle-of-fifths motion: iii7-vi7-ii7-V7-I. It rarely appears on its own but is essential in extended sequences. The vi7 is the primary tonic-function substitute; vi7-ii7-V7-I is extremely common in both classical and jazz harmony. The deceptive resolution V7-vi7 is smoother than V7-vi because the seventh chord shares more notes with V7, softening the surprise.',
      tryThisQuery: 'Em7',
      tryThisLabel: 'Hear iii7 in the key of C',
    },
    {
      title: 'The Tonic Seventh: Imaj7',
      explanation:
        'In classical harmony, the 7th on a tonic chord is typically treated as a passing tone or suspension that resolves. In jazz and pop, Imaj7 is the standard tonic voicing \u2014 warm, rich, and sophisticated. The major seventh interval (B in Cmaj7) adds color without creating dominant-quality tension. Imaj7 is the resting point of the ii7-V7-Imaj7 progression, the most characteristic jazz cadence.',
      tryThisQuery: 'Cmaj7',
      tryThisLabel: 'Hear the jazz tonic: Cmaj7',
    },
    {
      title: 'The Blues Tonic: I7',
      explanation:
        'In blues, the I chord is a dominant seventh (I7), giving every chord the characteristic tension that defines the style. C7 as a tonic chord is "wrong" by classical standards (dominant sevenths should resolve, not rest) but exactly right in blues. In a 12-bar blues, all three primary chords (I7, IV7, V7) are dominant sevenths. This transforms the dominant seventh from a chord of tension into the basic sonic building block.',
      tryThisQuery: 'Am7',
      tryThisLabel: 'Hear vi7 in the key of C',
    },
  ],
  tasks: [
    {
      id: 'l4u13m2t1',
      instruction: "Type 'Cmaj7' \u2014 notice the major 7th interval (B to C). Now type 'C7' \u2014 the minor 7th (Bb) gives it a completely different character. Cmaj7 is tonic function; C7 is dominant quality (or blues tonic)",
    },
    {
      id: 'l4u13m2t2',
      instruction: "Play the extended circle: 'Em7' (iii7) \u2192 'Am7' (vi7) \u2192 'Dm7' (ii7) \u2192 'G7' (V7) \u2192 'Cmaj7' (Imaj7). Each root falls a fifth. This is the full descending-fifths fragment from iii to I",
    },
    {
      id: 'l4u13m2t3',
      instruction: "Compare 'Am7' with 'Am' \u2014 the seventh (G) adds smoothness to vi7 and makes the deceptive resolution V7-vi7 flow more naturally than V7-vi. The added note creates a common tone with V7",
      query: 'Am7',
    },
  ],
  prerequisites: ['l4u13m1'],
};

const l4u13m3: CurriculumModule = {
  id: 'l4u13m3',
  unitId: 'u13',
  levelId: 'l4',
  title: 'Leading-Tone Sevenths: vii\u00F87 and viio7',
  subtitle: 'Half-diminished and fully diminished seventh chords as dominant substitutes',
  objectives: [
    'Build and resolve vii\u00F87 (half-diminished, in major) and viio7 (fully diminished, in minor)',
    'Understand leading-tone sevenths as rootless dominant ninths',
    'Recognize the enharmonic flexibility of the fully diminished seventh chord',
  ],
  concepts: [
    {
      title: 'The Half-Diminished vii\u00F87',
      explanation:
        'The vii\u00F87 in major keys functions like a rootless V7 \u2014 its notes are the 3rd, 5th, 7th, and 9th of V. In C major, B\u00F87 contains B-D-F-A, which are the upper four notes of G9 (G-B-D-F-A with the G root removed). It resolves to I with the same tendency-tone logic: B rises to C, F falls to E. The half-diminished quality is less tense than the fully diminished, giving it a gentler dominant pull.',
      tryThisQuery: 'Bm7b5',
      tryThisLabel: 'Hear vii\u00F87 in the key of C',
    },
    {
      title: 'The Fully Diminished viio7',
      explanation:
        'The viio7 in minor keys is built from the raised 7th degree of harmonic minor. All four notes are tendency tones pulling toward resolution, making it the most tense of all diatonic seventh chords. In A minor, G#dim7 contains G#-B-D-F \u2014 every note wants to move by step. The fully diminished seventh divides the octave into equal minor thirds, giving it a symmetric, restless quality.',
      tryThisQuery: 'Bdim7',
      tryThisLabel: 'Hear the fully diminished viio7',
    },
    {
      title: 'Enharmonic Flexibility',
      explanation:
        'Because the fully diminished seventh chord divides the octave into four equal minor thirds, any of its four notes can be respelled as the root. G#dim7, Bdim7, Ddim7, and Fdim7 all contain the same pitches (enharmonically). This makes the fully diminished seventh a powerful pivot chord for modulation \u2014 one chord can resolve to four different keys. This enharmonic flexibility becomes central to chromatic modulation in Level 6.',
      tryThisQuery: 'Bdim7',
      tryThisLabel: 'Same pitches as G#dim7, Ddim7, Fdim7',
    },
  ],
  tasks: [
    {
      id: 'l4u13m3t1',
      instruction: "Type 'Bm7b5' (B half-diminished 7) \u2014 this is vii\u00F87 in C major. Its notes B-D-F-A are the same as G9 without the root G. It resolves to C major with B rising to C and F falling to E",
      query: 'Bm7b5',
    },
    {
      id: 'l4u13m3t2',
      instruction: "Type 'Bdim7' (B fully diminished 7) \u2014 this is viio7 in C minor. Compare its sound with 'Bm7b5': the fully diminished version is more tense because every note is a tendency tone",
      query: 'Bdim7',
    },
    {
      id: 'l4u13m3t3',
      instruction: "Open 'key of C' and identify all seven diatonic seventh chords: Imaj7, ii7, iii7, IVmaj7, V7, vi7, vii\u00F87. The leading-tone seventh (vii\u00F87) is the only diminished-quality chord in major keys",
      query: 'key of C',
    },
  ],
  prerequisites: ['l4u13m2'],
};

const l4u13m4: CurriculumModule = {
  id: 'l4u13m4',
  unitId: 'u13',
  levelId: 'l4',
  title: 'Harmonic Function: T \u2192 PD \u2192 D \u2192 T',
  subtitle: 'Tonic, Pre-Dominant, and Dominant \u2014 the three pillars of tonal harmony',
  objectives: [
    'Classify every diatonic chord by function: Tonic (T), Pre-Dominant (PD), Dominant (D)',
    'Understand the standard progression T \u2192 PD \u2192 D \u2192 T as the fundamental harmonic sentence',
    'Recognize retrogressions and chord substitution within functional groups',
  ],
  concepts: [
    {
      title: 'The Three Harmonic Functions',
      explanation:
        'Every diatonic chord serves one of three functions. Tonic (T) chords \u2014 I, vi, and sometimes iii \u2014 provide stability and the sense of home. Pre-Dominant (PD) chords \u2014 ii and IV \u2014 create departure and motion, signaling that the harmony is heading somewhere. Dominant (D) chords \u2014 V and vii\u00B0 \u2014 generate tension and urgency that demands resolution back to the tonic. The degree colors in this app encode these functions: blue for tonic stability, amber for dominant tension.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See function colors on the degree bar',
    },
    {
      title: 'The Standard Functional Progression',
      explanation:
        'T \u2192 PD \u2192 D \u2192 T is the fundamental harmonic sentence, mirroring narrative structure: establish home, depart, create tension, resolve. Nearly all tonal music follows this pattern at some structural level. The order matters: PD \u2192 D increases tension, D \u2192 T releases it. Reversing the flow (retrogression) feels unusual because it releases tension prematurely \u2014 D \u2192 PD or PD \u2192 T without passing through D creates deflection, avoidance of resolution, or a gentle return.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'Trace I-IV-V-I as T-PD-D-T',
    },
    {
      title: 'Chord Substitution Within Functions',
      explanation:
        'Chords within the same functional group can substitute for each other because they share scale degrees. The vi can replace I (this is why the deceptive cadence V-vi works \u2014 vi is tonic-function). The ii can replace IV (both are pre-dominant). The vii\u00B0 can replace V (both are dominant-function). Substitution explains why so many different progressions work: they follow the same T-PD-D-T functional pattern with different specific chords filling each role.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See which chords share function',
    },
  ],
  tasks: [
    {
      id: 'l4u13m4t1',
      instruction: "Open 'key of C' and classify each diatonic chord: I(T), ii(PD), iii(T), IV(PD), V(D), vi(T), vii\u00B0(D). Notice how the degree bar colors map to these functions",
      query: 'key of C',
    },
    {
      id: 'l4u13m4t2',
      instruction: "Trace the progression I-vi-ii-V-I through function labels: T-T-PD-D-T. Even with a substitution (vi standing in for I), the functional flow T \u2192 PD \u2192 D \u2192 T is maintained",
    },
    {
      id: 'l4u13m4t3',
      instruction: "Consider I-V-IV-I (T-D-PD-T). This is a retrogression \u2014 D moves to PD instead of resolving to T. It sounds unusual in classical music but is common in rock. Can you hear the difference in harmonic direction?",
    },
  ],
  prerequisites: ['l4u13m3'],
};

const l4u13m5: CurriculumModule = {
  id: 'l4u13m5',
  unitId: 'u13',
  levelId: 'l4',
  title: 'Harmonic Sequences',
  subtitle: 'Repeating harmonic patterns that create directed motion through a key',
  objectives: [
    'Recognize descending-fifths, ascending-seconds, and descending-thirds sequence patterns',
    'Understand how sequences create directional harmonic momentum that overrides normal functional logic',
    'Hear sequences in context across Baroque, Classical, and pop styles',
  ],
  concepts: [
    {
      title: 'What Is a Harmonic Sequence?',
      explanation:
        'A harmonic sequence is a pattern of chords that repeats at regular intervals, transposing up or down with each repetition. Sequences create strong directional momentum \u2014 the listener hears the pattern and anticipates its continuation. They temporarily override normal functional progressions because the repeating pattern itself provides the harmonic logic. Any deviation from the established pattern is immediately noticeable, which makes sequences both predictable and compelling.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See all diatonic chords for sequence building',
    },
    {
      title: 'The Descending Fifths Sequence',
      explanation:
        'The most common harmonic sequence. Roots descend by fifths: I-IV-vii\u00B0-iii-vi-ii-V-I. Each chord resolves to the next as if it were a local V-I motion. The full circle returns to the starting key. Any subset works as a usable progression: vi-ii-V-I is a descending-fifths fragment used constantly in tonal music. Adding seventh chords makes the voice leading even smoother because the 7th of each chord resolves by step into the next chord.',
      tryThisQuery: 'Am7',
      tryThisLabel: 'vi7 starts a common fifths descent',
    },
    {
      title: 'Ascending Seconds and Descending Thirds',
      explanation:
        'In an ascending-seconds sequence, roots move up by step: I-ii-iii-IV-V, creating a climbing sensation. First inversions are often used to keep the bass line smooth (the 5-6 technique). In a descending-thirds sequence, roots fall by thirds: I-vi-IV-ii, producing a gentle, falling motion common in Romantic music. Each pair in a thirds sequence shares a common tone, making the voice leading exceptionally smooth.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'ii7 sits at the center of many sequences',
    },
  ],
  tasks: [
    {
      id: 'l4u13m5t1',
      instruction: "Map the descending fifths in C major: C-F-Bdim-Em-Am-Dm-G-C (I-IV-vii\u00B0-iii-vi-ii-V-I). Open 'key of C' and play each chord \u2014 hear how each root drops a fifth to the next",
      query: 'key of C',
    },
    {
      id: 'l4u13m5t2',
      instruction: "Play 'Am7' then 'Dm7' then 'G7' then 'Cmaj7' \u2014 this is a descending-fifths fragment (vi7-ii7-V7-Imaj7), the most common chord progression in jazz",
    },
    {
      id: 'l4u13m5t3',
      instruction: "Identify the sequence type in I-vi-IV-ii: each root drops a third (C-A-F-D). This is a descending-thirds sequence. Notice how each adjacent pair shares a common tone, keeping the voice leading smooth",
    },
  ],
  prerequisites: ['l4u13m4'],

};

// ---------------------------------------------------------------------------
// Level 4, Unit 14: Counterpoint, Meter, Analysis, and Minor Harmony
// ---------------------------------------------------------------------------

const l4u14m1: CurriculumModule = {
  id: 'l4u14m1',
  unitId: 'u14',
  levelId: 'l4',
  title: 'First and Second Species Counterpoint',
  subtitle: 'Combining independent melodies with consonance and dissonance rules',
  objectives: [
    'Understand counterpoint as the art of combining independent melodic lines',
    'Apply consonance and dissonance classification to two-voice textures',
    'Write first species (1:1) and second species (2:1) counterpoint following voice-leading rules',
  ],
  concepts: [
    {
      title: 'What Is Counterpoint?',
      explanation:
        'Counterpoint is the art of combining two or more independent melodic lines that are harmonically related but melodically independent. While harmony is a vertical perspective (chords stacked at a moment in time), counterpoint is horizontal (melodies unfolding over time and interweaving). The two perspectives complement each other \u2014 good harmony usually implies good counterpoint, and vice versa. Counterpoint was the dominant compositional technique from the Renaissance through the Baroque era.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'A scale is the simplest melodic line',
    },
    {
      title: 'Consonance and Dissonance in Counterpoint',
      explanation:
        'In two-part counterpoint, every vertical interval between the voices is classified. Perfect consonances (P1, P5, P8) are the most stable but sound hollow if overused. Imperfect consonances (m3, M3, m6, M6) are stable and warm \u2014 they form the backbone of good counterpoint, providing the best balance of harmony and independence. Dissonances (m2, M2, P4, tritone, m7, M7) are unstable and must resolve by step to a consonance.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'C-E is an imperfect consonance (M3)',
    },
    {
      title: 'First and Second Species',
      explanation:
        'First species (1:1) places one counterpoint note against each note in the cantus firmus (given melody). Every interval must be consonant. Begin and end on P1, P5, or P8, use mostly imperfect consonances, and never approach perfect consonances in parallel motion. Second species (2:1) adds two notes against each cantus firmus note. Strong beats must be consonant; in strict species the only dissonance allowed on a weak beat is the passing tone, approached and left by step (dissonant neighbor tones arrive later, in third species — though some modern texts admit them earlier). Weak beats may also be consonant — a leap to a consonant interval is permitted. This is where non-chord tones first enter counterpoint.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Imagine a second voice against this line',
    },
  ],
  tasks: [
    {
      id: 'l4u14m1t1',
      instruction: "Classify these intervals for counterpoint: C-E (imperfect consonance, M3), C-G (perfect consonance, P5), C-F (dissonance, P4 in two-voice texture), C-B (dissonance, M7)",
    },
    {
      id: 'l4u14m1t2',
      instruction: "Play 'C major scale' ascending and imagine a second voice a third above (E-F-G-A-B-C-D-E). This parallel-thirds motion is imperfect consonance throughout \u2014 stable and warm, the ideal counterpoint texture",
      query: 'C major scale',
    },
    {
      id: 'l4u14m1t3',
      instruction: "Why are parallel perfect fifths forbidden? Because two voices moving in parallel P5s lose their melodic independence \u2014 they begin to sound like one doubled voice, not two individual lines. Imperfect consonances maintain independence better",
    },
  ],
  prerequisites: ['l4u13m5'],

};

const l4u14m2: CurriculumModule = {
  id: 'l4u14m2',
  unitId: 'u14',
  levelId: 'l4',
  title: 'Asymmetric and Mixed Meters',
  subtitle: 'Counting in 5, 7, and beyond \u2014 additive and mixed meters',
  objectives: [
    'Count and feel asymmetric meters: 5/4, 5/8, 7/4, 7/8',
    'Understand additive meter groupings (2+3, 3+2, 2+2+3) as the building blocks of irregular rhythm',
    'Recognize mixed meters where the time signature changes from measure to measure',
  ],
  concepts: [
    {
      title: 'Asymmetric Meters',
      explanation:
        'Asymmetric meters have beat counts that do not divide evenly into equal groups. 5/4 or 5/8 groups as either 2+3 or 3+2 \u2014 the grouping determines the rhythmic feel entirely. 7/4 or 7/8 groups as 2+2+3, 2+3+2, or 3+2+2. The unequal grouping creates a lopsided groove that is characteristic of Balkan folk music, progressive rock, and much 20th-century concert music.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Count 7 scale tones in groups of 2+2+3',
    },
    {
      title: 'Additive Meters',
      explanation:
        'Additive meters are built by combining groups of 2 and 3 beats. 5 = 2+3 or 3+2. 7 = 2+2+3 or 2+3+2 or 3+2+2. 8 = 3+3+2, common in Balkan music and some rock. 11 = 2+2+3+2+2, used by Dave Brubeck and others. The internal grouping pattern is what gives each meter its distinctive character \u2014 the same total number of beats with different groupings creates entirely different rhythmic feels.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Count 5 tones in groups of 3+2',
    },
    {
      title: 'Mixed Meters and Cut Time',
      explanation:
        'Mixed meter changes the time signature from measure to measure: one bar of 4/4, the next of 3/4, then 5/4. This creates an unpredictable, shifting rhythmic surface common in film scores and progressive rock. Cut time (alla breve, 2/2) uses two half-note beats per measure \u2014 a 2/2 bar has the same total duration as a 4/4 bar, but the beat unit is the half note rather than the quarter, so the music is counted in 2 and gains a broader, faster-moving feel with stronger metric drive. Cut time is standard in marches and fast Classical movements.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Tap along in cut time: 2 beats per bar',
    },
  ],
  tasks: [
    {
      id: 'l4u14m2t1',
      instruction: "Tap a 7/8 pattern grouped as 2+2+3: count '1-2, 1-2, 1-2-3' with emphasis on each group's first beat. Then regroup as 3+2+2: '1-2-3, 1-2, 1-2'. The feel changes completely even though the total beats are the same",
    },
    {
      id: 'l4u14m2t2',
      instruction: "Clap a 5/4 pattern: try 2+3 ('1-2, 1-2-3') then 3+2 ('1-2-3, 1-2'). The first feels like a march with an extra stumble; the second feels like a waltz with extra momentum",
    },
    {
      id: 'l4u14m2t3',
      instruction: "Alternate a 4/4 bar with a 3/4 bar and repeat the cycle several times \u2014 this is the simplest mixed meter. Notice how the shifting bar length creates an unpredictable, asymmetric rhythmic feel even from two symmetric meters",
    },
  ],
  prerequisites: ['l4u14m1'],

};

const l4u14m3: CurriculumModule = {
  id: 'l4u14m3',
  unitId: 'u14',
  levelId: 'l4',
  title: 'Chromatic Embellishment',
  subtitle: 'Adding chromatic color to diatonic harmony without changing the key',
  objectives: [
    'Recognize chromatic passing tones and chromatic neighbor tones',
    'Distinguish chromatic embellishment (decorative) from structural chromaticism (secondary dominants, modulation)',
    'Hear how chromatic motion adds smoothness and color to voice leading',
  ],
  concepts: [
    {
      title: 'Chromatic Passing and Neighbor Tones',
      explanation:
        'A chromatic passing tone fills in a whole step with a non-diatonic note: C-C\u266F-D uses the chromatic C\u266F to connect two diatonic tones smoothly. A chromatic neighbor tone orbits a chord tone using a chromatic half step: E-E\u266D-E creates a tighter orbit than a diatonic neighbor. Both add smoothness and color to otherwise plain diatonic lines. They are especially common in bass lines and inner voices, where the added chromaticism enriches the texture without disrupting the melody.',
      tryThisQuery: 'chromatic scale',
      tryThisLabel: 'Hear all 12 chromatic steps',
    },
    {
      title: 'Embellishment vs. Structural Chromaticism',
      explanation:
        'At this level, chromaticism is decorative \u2014 it adds color to diatonic harmony without changing the key. A chromatic passing tone between scale degrees 4 and 5 is decoration. A V/V chord (secondary dominant) is structural chromaticism that briefly points to a new tonal center. The distinction matters: embellishment ornaments the surface while structure alters the harmonic direction. Structural chromaticism including secondary dominants and modulation comes in Level 5.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'The diatonic framework chromaticism decorates',
    },
    {
      title: 'Chromatic Contrary Motion',
      explanation:
        'In chromatic contrary motion, two voices move chromatically in opposite directions, converging or diverging by half step. For example, the bass ascends C-C\u266F while an upper voice descends E-E\u266D, both converging on D. This creates a striking cross-motion effect that adds intensity and sophistication to voice leading without leaving the key — and it is a staple building block for the chromatic chords studied in Level 6.',
      tryThisQuery: 'chromatic scale',
      tryThisLabel: 'Chromatic steps are the raw material',
    },
  ],
  tasks: [
    {
      id: 'l4u14m3t1',
      instruction: "Type 'chromatic scale' and play through it \u2014 every note is a half step apart. Now play 'C major scale' \u2014 notice the whole steps (C-D, D-E, F-G, G-A, A-B) that chromaticism could fill in",
      query: 'chromatic scale',
    },
    {
      id: 'l4u14m3t2',
      instruction: "Imagine the bass line C-C\u266F-D under a chord change from I to ii in C major. The C\u266F is a chromatic passing tone \u2014 it does not change the key, it simply smooths the whole-step motion from C to D",
    },
    {
      id: 'l4u14m3t3',
      instruction: "Compare 'C major scale' (7 notes per octave) with 'chromatic scale' (12 notes per octave). The 5 additional chromatic notes are the raw material for chromatic embellishment within a diatonic key",
      query: 'C major scale',
    },
  ],
  prerequisites: ['l4u14m2'],
};

const l4u14m4: CurriculumModule = {
  id: 'l4u14m4',
  unitId: 'u14',
  levelId: 'l4',
  title: 'Roman Numeral Analysis Practice',
  subtitle: 'Analyzing real harmonic progressions with full Roman numeral notation',
  objectives: [
    'Analyze chord progressions with complete Roman numeral notation including quality and inversion',
    'Identify cadences, non-chord tones, and inversions in context',
    'Develop fluency in reading chorale-style textures and labeling harmonic function',
  ],
  concepts: [
    {
      title: 'The Analysis Method',
      explanation:
        'Roman numeral analysis follows a systematic process: (1) determine the key from the key signature and cadence patterns, (2) at each harmonic rhythm point, identify the chord \u2014 which notes are sounding, (3) determine root and quality, (4) label with Roman numeral, quality symbol, and inversion figure, (5) identify NCTs as notes that do not belong to the chord, (6) mark cadences at phrase endings. This method transforms intuitive listening into structured understanding.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See all chords available for analysis in C',
    },
    {
      title: 'Reading Chorale Textures',
      explanation:
        'Four-voice chorale texture places soprano and alto on the treble staff (stems up and down respectively), tenor and bass on the bass staff. Start analysis by identifying the bass note \u2014 it determines the inversion. Then identify the remaining chord tones above. Circle any notes that do not fit the chord \u2014 these are non-chord tones. Suspensions and passing tones can make chords look wrong on the surface; always analyze the underlying harmony at the point of resolution.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'A simple chord to practice identifying',
    },
    {
      title: 'Common Analysis Traps',
      explanation:
        'The most common mistake is misidentifying chords in inversion by looking only at the bass note. A chord with E in the bass, G above, and C above is not E minor \u2014 it is C major in first inversion (I6). Another trap: suspensions make the chord look "wrong" at the moment of dissonance. Always analyze through to the resolution to determine the actual harmony. Context determines the best reading when a note could serve as either a chord tone or a non-chord tone.',
      tryThisQuery: 'C/E',
      tryThisLabel: 'C/E is I6, not an E chord',
    },
  ],
  tasks: [
    {
      id: 'l4u14m4t1',
      instruction: "Type 'C/E' \u2014 this is C major in first inversion (I6 in C major). The bass note is E, but the chord is still C major. Practice identifying the root, not just the lowest note",
      query: 'C/E',
    },
    {
      id: 'l4u14m4t2',
      instruction: "Analyze this progression in C major: C-Dm-G-C. In Roman numerals: I-ii-V-I. Function labels: T-PD-D-T. This is the fundamental harmonic sentence in its simplest form",
    },
    {
      id: 'l4u14m4t3',
      instruction: "Add an inversion: C-Dm/F-G7-C becomes I-ii6-V7-I. The ii chord in first inversion puts F in the bass, creating a smooth stepwise bass line: C-F-G-C. Inversions are a tool for controlling bass voice leading",
    },
  ],
  prerequisites: ['l4u14m3'],
};

const l4u14m5: CurriculumModule = {
  id: 'l4u14m5',
  unitId: 'u14',
  levelId: 'l4',
  title: 'Minor Key Harmony in Detail',
  subtitle: 'How three minor scale forms create a fluid, expanded chord vocabulary',
  objectives: [
    'Understand how the three minor scale forms produce different diatonic chord qualities',
    'Know the practical chord vocabulary of minor keys drawn from all three forms',
    'Recognize the subtonic VII chord in natural minor and the augmented III+ problem in harmonic minor',
  ],
  concepts: [
    {
      title: 'The Minor Key Chord Palette',
      explanation:
        'In practice, minor keys draw chords from all three minor forms: V and vii\u00B0 from harmonic minor (because the leading tone is needed for strong cadences), i, iv, VI, and III from natural minor (using the unaltered 6th and 7th), and ii and IV from melodic minor ascending (which raises the 6th, in addition to the 7th). This gives minor keys more chord options than major keys, not fewer. The composer chooses which form to use based on voice leading needs and the desired harmonic color.',
      tryThisQuery: 'A natural minor scale',
      tryThisLabel: 'See the natural minor foundation',
    },
    {
      title: 'The Subtonic VII and the Augmented III+',
      explanation:
        'In natural minor, the 7th degree is a whole step below the tonic, producing a major triad VII instead of the diminished vii\u00B0 found in harmonic minor. The VII often moves to III or creates a Mixolydian-flavored cadence common in rock and pop. Building a triad on the 3rd degree of harmonic minor produces an augmented triad (III+) because the raised 7th becomes the 5th of that triad. III+ is harsh and rarely used; composers almost always use the natural-minor III (a plain major triad) instead.',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel: 'See the raised 7th that creates V and vii\u00B0',
    },
    {
      title: 'The Fluid Minor System',
      explanation:
        'Unlike major (one scale, one fixed set of diatonic chords), minor is fluid \u2014 the 6th and 7th degrees are variable. This variability is a feature, not a flaw. A minor-key passage might use a natural-minor III-VII cadence in one phrase and a harmonic-minor V-i cadence in the next, drawing freely from the full palette. Understanding this fluidity is essential for analyzing real music, where minor-key harmony rarely stays within a single scale form throughout.',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel: 'Compare with natural minor above',
    },
  ],
  tasks: [
    {
      id: 'l4u14m5t1',
      instruction: "Type 'A natural minor scale' then 'A harmonic minor scale' \u2014 the only difference is G vs. G\u266F. That single raised note changes the v chord to V and the VII chord to vii\u00B0, transforming the harmonic possibilities",
      query: 'A natural minor scale',
    },
    {
      id: 'l4u14m5t2',
      instruction: "Play 'Am' then 'E major chord' (V-i with harmonic minor's leading tone G\u266F). Now play 'Am' then 'Em' (v-i with natural minor's G natural). Hear how the major V creates a much stronger resolution to the tonic",
    },
    {
      id: 'l4u14m5t3',
      instruction: "In A minor, the subtonic VII chord is G major (G-B-D). Play 'G major chord' then 'C major chord' (VII-III in A minor). This natural-minor progression is heard constantly in rock and pop music as bVII-bIII",
    },
  ],
  prerequisites: ['l4u14m4'],
};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

export const L4_UNITS: CurriculumUnit[] = [
  {
    id: 'u12',
    levelId: 'l4',
    title: 'Non-Chord Tones and Dominant Seventh',
    description: 'Suspensions, appoggiaturas, pedal points, dominant seventh resolution rules, and V7 inversions',
    icon: 'harmony',
    modules: [l4u12m1, l4u12m2, l4u12m3, l4u12m4, l4u12m5],
    milestone: {
      skillsSummary: [
        'Identify suspensions, appoggiaturas, escape tones, retardations, pedal points, and changing tones',
        'Resolve V7 in all inversions with correct voice leading and tendency tone treatment',
        'Understand why V4/2 must resolve to I6 and how each inversion determines bass motion',
      ],
      bridgeText:
        'You now understand all non-chord tone types and can resolve the dominant seventh in every inversion. Next you will explore the full palette of diatonic seventh chords, classify chords by harmonic function, and discover how sequences create directed harmonic motion.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Play G7 and resolve to C major',
      tryThisPrompt: 'Can you name the two tendency tones and where each one resolves?',
    },
  },
  {
    id: 'u13',
    levelId: 'l4',
    title: 'Diatonic Seventh Chords, Function, and Sequences',
    description: 'Pre-dominant, mediant, and leading-tone sevenths, harmonic function theory, and harmonic sequences',
    icon: 'scales',
    modules: [l4u13m1, l4u13m2, l4u13m3, l4u13m4, l4u13m5],
    milestone: {
      skillsSummary: [
        'Build and resolve all diatonic seventh chords including ii7, iii7, vi7, vii\u00F87, and viio7',
        'Classify every diatonic chord by harmonic function: Tonic, Pre-Dominant, or Dominant',
        'Recognize descending-fifths, ascending-seconds, and descending-thirds harmonic sequences',
      ],
      bridgeText:
        'You can now build every diatonic seventh chord, understand how each functions within a key, and hear how chords move in sequential patterns. The final unit applies all of this knowledge to counterpoint, meter, chromatic embellishment, analysis, and the rich harmonic world of minor keys.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'Start a ii7-V7-Imaj7 progression',
      tryThisPrompt: 'Can you trace the ii7-V7-Imaj7 progression and identify the function of each chord?',
    },
  },
  {
    id: 'u14',
    levelId: 'l4',
    title: 'Counterpoint, Meter, Analysis, and Minor Harmony',
    description: 'Two-part counterpoint, asymmetric meters, chromatic embellishment, Roman numeral analysis, and minor key chord systems',
    icon: 'chords',
    modules: [l4u14m1, l4u14m2, l4u14m3, l4u14m4, l4u14m5],
    milestone: {
      skillsSummary: [
        'Apply consonance and dissonance rules in first and second species counterpoint',
        'Perform complete Roman numeral analysis including inversions, NCTs, and cadences',
        'Navigate the fluid minor key chord palette drawn from all three minor scale forms',
      ],
      bridgeText: '',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel: 'Explore the harmonic minor chord palette',
      tryThisPrompt: 'Which chords come from harmonic minor and which from natural minor?',
    },
  },
];
