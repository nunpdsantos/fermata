import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 6, Unit 18: Chromatic Chords (4 modules)
// Engine coverage: 6.1 Neapolitan = PARTIAL, 6.2 Aug6 = NONE, 6.3 Enharmonic = NONE
// ---------------------------------------------------------------------------

const l6u18m1: CurriculumModule = {
  id: 'l6u18m1',
  unitId: 'u18',
  levelId: 'l6',
  title: 'The Neapolitan Chord (bII)',
  subtitle: 'A dramatic chromatic pre-dominant built on the lowered second degree',
  objectives: [
    'Build the Neapolitan chord (major triad on the lowered 2nd degree) and use bII6 as a chromatic pre-dominant',
    'Apply proper voice leading where b2 resolves downward and the bass moves 4 to 5',
    'Recognize the Neapolitan\u2019s dark, majestic emotional effect and its Phrygian color',
  ],
  concepts: [
    {
      title: 'What Is the Neapolitan?',
      explanation:
        'The Neapolitan is a major triad built on the lowered second scale degree. In C major or C minor, that chord is Db major (Db-F-Ab). Named after the Neapolitan school of opera, it functions as a dramatic chromatic replacement for the typical pre-dominant chord (ii or IV). It is almost always used in first inversion (bII6), placing the 4th scale degree in the bass for smooth connection to the dominant.',
      tryThisQuery: 'Db major chord',
      tryThisLabel: 'Play Db major \u2014 the Neapolitan in C minor',
    },
    {
      title: 'Why First Inversion (bII6)?',
      explanation:
        'In first inversion, the bass note is the 4th scale degree (F in C minor), which connects smoothly to the dominant via the bass motion 4 \u2192 5 \u2014 the same motion as IV \u2192 V. The chromatic drama lives in the upper voices, where the lowered 2nd degree (Db) resolves downward to the leading tone or tonic. Root position bII is rarer but appears in Romantic music for a more emphatic, surprising effect.',
      tryThisQuery: 'Db/F',
      tryThisLabel: 'Hear Db/F \u2014 Neapolitan in first inversion',
    },
    {
      title: 'Voice Leading and Emotional Effect',
      explanation:
        'The lowered 2nd degree is a strong tendency tone that must resolve downward \u2014 either to the leading tone when moving to V, or directly to the tonic. Never double it. The b6 (fifth of bII) also resolves down to 5. The Neapolitan sounds dark, majestic, and weighty, importing a Phrygian-mode color into the harmony. It is a signature sound of Beethoven, Schubert, and modern film scores.',
      tryThisQuery: 'C minor scale',
      tryThisLabel: 'See C minor \u2014 the Neapolitan\u2019s home context',
    },
  ],
  tasks: [
    {
      id: 'l6u18m1t1',
      instruction:
        "Type 'Db major chord' to hear the Neapolitan chord of C minor. Notice how Db-F-Ab sounds dark and dramatic compared to a standard Dm or F chord in this context",
      query: 'Db major chord',
    },
    {
      id: 'l6u18m1t2',
      instruction:
        "Type 'Db/F' to hear the first inversion Neapolitan. The bass note F connects smoothly to G (dominant). This is the standard bII6 voicing used in classical music",
      query: 'Db/F',
    },
    {
      id: 'l6u18m1t3',
      instruction:
        'Think through the Neapolitan in other minor keys: in A minor, bII is Bb major. In E minor, bII is F major. In D minor, bII is Eb major. In each case, it is a major triad one half step above the tonic',
    },
  ],
  prerequisites: ['l5u17m4'],
};

const l6u18m2: CurriculumModule = {
  id: 'l6u18m2',
  unitId: 'u18',
  levelId: 'l6',
  title: 'Italian and French Augmented Sixth Chords',
  subtitle: 'The augmented sixth interval and its two simpler national varieties',
  objectives: [
    'Understand the augmented sixth interval (b6 to #4) and its outward resolution to an octave on scale degree 5',
    'Build the Italian sixth (It+6): b6, 1, #4 and resolve it to V',
    'Build the French sixth (Fr+6): b6, 1, 2, #4 and recognize its whole-tone color',
  ],
  concepts: [
    {
      title: 'The Augmented Sixth Interval',
      explanation:
        'All augmented sixth chords contain an augmented sixth interval between the lowered 6th degree in the bass and the raised 4th degree in an upper voice. In C: Ab (b6) up to F# (#4). This interval resolves outward by contrary motion \u2014 Ab moves down to G, F# moves up to G \u2014 producing an octave on scale degree 5, the root of the dominant chord. This outward resolution is the defining gesture of the entire augmented sixth family.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major \u2014 the context for augmented sixths',
    },
    {
      title: 'The Italian Sixth (It+6)',
      explanation:
        'The Italian sixth has three notes: b6, 1, #4. In C: Ab-C-F#. It is the simplest augmented sixth chord \u2014 just the augmented sixth interval plus scale degree 1 to fill out the sonority. It resolves directly to V with scale degree 1 doubled. Because it contains only three notes, it is the lightest and most transparent member of the family.',
      tryThisQuery: 'Ab major chord',
      tryThisLabel: 'Hear Ab \u2014 the bass note of augmented sixths in C',
    },
    {
      title: 'The French Sixth (Fr+6)',
      explanation:
        'The French sixth has four notes: b6, 1, 2, #4. In C: Ab-C-D-F#. It adds scale degree 2 to the Italian sixth. The result contains two tritones (Ab-D and C-F#), giving it a distinctive whole-tone quality \u2014 all four notes belong to the same whole-tone collection. This exotic, unresolved color makes the French sixth a favorite of composers seeking maximum pre-dominant tension.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Hear G major \u2014 the V chord these resolve to in C',
    },
  ],
  tasks: [
    {
      id: 'l6u18m2t1',
      instruction:
        'Spell the Italian sixth in C: Ab-C-F#. Now spell it in G: Eb-G-C#. The pattern is always b6, 1, #4 of the target key. Practice building It+6 in D, A, and Eb',
    },
    {
      id: 'l6u18m2t2',
      instruction:
        'Spell the French sixth in C: Ab-C-D-F#. Notice the two tritones: Ab to D and C to F#. All four notes belong to the whole-tone scale on C. Spell Fr+6 in G and in D',
    },
    {
      id: 'l6u18m2t3',
      instruction:
        "Type 'Ab major chord' and listen. Now imagine adding F# in an upper voice. The interval Ab to F# is the augmented sixth that defines this entire chord family",
      query: 'Ab major chord',
    },
  ],
  prerequisites: ['l6u18m1'],

};

const l6u18m3: CurriculumModule = {
  id: 'l6u18m3',
  unitId: 'u18',
  levelId: 'l6',
  title: 'German Augmented Sixth and Its Dual Identity',
  subtitle: 'The Gr+6 chord and its enharmonic equivalence with the dominant seventh',
  objectives: [
    'Build the German sixth (Gr+6): b6, 1, b3, #4 and recognize its rich, full sonority',
    'Recognize that Gr+6 is enharmonically identical to a dominant seventh chord',
    'Resolve Gr+6 through a cadential 6/4 to avoid parallel fifths',
  ],
  concepts: [
    {
      title: 'The German Sixth (Gr+6)',
      explanation:
        'The German sixth has four notes: b6, 1, b3, #4. In C: Ab-C-Eb-F#. It adds the lowered 3rd degree (from minor mode) to the Italian sixth. Unlike the French sixth\u2019s whole-tone color, the German sixth sounds rich and full \u2014 it is a complete four-note sonority with a minor quality in its lower three notes.',
      tryThisQuery: 'Ab7',
      tryThisLabel: 'Hear Ab7 \u2014 the enharmonic twin of Gr+6 in C',
    },
    {
      title: 'Enharmonic Equivalence: Gr+6 = V7',
      explanation:
        'Respell the German sixth in C: Ab-C-Eb-F# becomes Ab-C-Eb-Gb when F# is rewritten as Gb. Ab-C-Eb-Gb is Ab dominant seventh (Ab7). The same sound serves two completely different functions \u2014 Gr+6 resolving to V in C, or V7 resolving to I in Db. This dual identity is the foundation of enharmonic modulation between distant keys.',
      tryThisQuery: 'Db major chord',
      tryThisLabel: 'Hear Db major \u2014 where Ab7 resolves as V7',
    },
    {
      title: 'The Parallel Fifths Problem',
      explanation:
        'When Gr+6 resolves directly to V, the voice motion b3 \u2192 2 (Eb \u2192 D in C) and b6 \u2192 5 (Ab \u2192 G) creates parallel fifths \u2014 forbidden in strict part writing. The standard solution is to insert a cadential 6/4 chord: Gr+6 \u2192 I6/4 \u2192 V. The 6/4 chord breaks the parallel motion. Italian and French sixths do not have this problem because they lack the b3.',
      tryThisQuery: 'C/G',
      tryThisLabel: 'Hear C/G \u2014 the cadential 6/4 that breaks parallels',
    },
  ],
  tasks: [
    {
      id: 'l6u18m3t1',
      instruction:
        'Spell the German sixth in C: Ab-C-Eb-F#. Now respell F# as Gb: Ab-C-Eb-Gb = Ab7. Same sound, completely different function. This enharmonic equivalence is exploited in enharmonic modulation',
    },
    {
      id: 'l6u18m3t2',
      instruction:
        'Spell the German sixth in D: Bb-D-F-G#. Respell G# as Ab: Bb-D-F-Ab = Bb7 = V7 of Eb. Spell Gr+6 in A and find its dominant seventh twin',
    },
    {
      id: 'l6u18m3t3',
      instruction:
        "Type 'Ab7' to hear the chord. This is simultaneously V7 of Db and Gr+6 in C. The resolution you choose determines which key the listener perceives",
      query: 'Ab7',
    },
  ],
  prerequisites: ['l6u18m2'],

};

const l6u18m4: CurriculumModule = {
  id: 'l6u18m4',
  unitId: 'u18',
  levelId: 'l6',
  title: 'Enharmonic Modulation: Gr+6 \u2194 V7',
  subtitle: 'Pivoting between distant keys by reinterpreting the German sixth as a dominant seventh',
  objectives: [
    'Modulate between distant keys using the Gr+6/V7 enharmonic equivalence',
    'Map the key relationships accessible through this pivot (keys a half step apart)',
    'Apply the technique in both directions: Gr+6 \u2192 V7 and V7 \u2192 Gr+6',
  ],
  concepts: [
    {
      title: 'The Gr+6/V7 Pivot in Action',
      explanation:
        'To modulate from C to Db using this technique: establish C as the key, approach the chord Ab-C-Eb-F# as Gr+6 in C, then resolve it as Ab7 (V7 of Db) to Db major. The listener\u2019s ear accepts both interpretations because the chord is acoustically identical. The resolution determines the perceived key. The same pitch (F\u266f/G\u266d) moves in opposite directions depending on interpretation: as \u266f4 in the augmented sixth, it resolves up; as \u266d7 of the dominant seventh, it resolves down. This single chord pivots between keys that are a half step apart \u2014 among the most distant relationships on the circle of fifths.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See how distant C and Db are on the circle',
    },
    {
      title: 'Working in Both Directions',
      explanation:
        'The pivot works in reverse too. To modulate from Db to C: establish Db, approach Ab7 as V7 of Db, then resolve it as Gr+6 in C by treating it as Ab-C-Eb-F# resolving to G (V of C). The same chord that can take you from C to Db can also bring you back. Any key pair related by a half step is accessible through this technique.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Hear G major \u2014 V of C, the arrival after Gr+6 resolves',
    },
    {
      title: 'Mapping All Possible Gr+6/V7 Pivots',
      explanation:
        'Since any dominant seventh chord can be reinterpreted as a German sixth, every key has access to a modulation target a half step above or below. From C, Gr+6 reaches Db. From D, Gr+6 reaches Eb. From F#, Gr+6 reaches G. The technique opens direct modulatory paths between keys that would otherwise require many intermediate steps through the circle of fifths.',
      tryThisQuery: 'Db major chord',
      tryThisLabel: 'Hear Db major \u2014 the distant arrival key from C',
    },
  ],
  tasks: [
    {
      id: 'l6u18m4t1',
      instruction:
        'Spell the German sixth in D: Bb-D-F-G#. Respell G# as Ab: Bb-D-F-Ab = Bb7 = V7 of Eb. You can pivot from D major to Eb major through a single chord',
    },
    {
      id: 'l6u18m4t2',
      instruction:
        'Plan a modulation from A major to Bb major using Gr+6/V7. First: what is the Gr+6 in A? (F-A-C-D#.) Respell D# as Eb: F-A-C-Eb = F7 = V7 of Bb. Resolve to Bb',
    },
    {
      id: 'l6u18m4t3',
      instruction:
        "Type 'Db major chord' and hear the arrival key. A single enharmonic reinterpretation moved us from C to Db \u2014 five positions around the circle of fifths in one step",
      query: 'Db major chord',
    },
  ],
  prerequisites: ['l6u18m3'],

};

// ---------------------------------------------------------------------------
// Level 6, Unit 19: Advanced Chromatic Techniques (4 modules)
// Engine coverage: 6.3 Enharmonic = NONE, 6.4 Chromatic Mediants = PARTIAL, 6.5 Late Romantic = PARTIAL
// ---------------------------------------------------------------------------

const l6u19m1: CurriculumModule = {
  id: 'l6u19m1',
  unitId: 'u19',
  levelId: 'l6',
  title: 'Enharmonic Modulation: Diminished Seventh',
  subtitle: 'Four-way enharmonic flexibility of the fully diminished seventh chord',
  objectives: [
    'Understand that a fully diminished seventh chord divides the octave into four equal minor thirds',
    'Reinterpret any note of a dim7 chord as the leading tone to resolve into four different tonics (each accessible in major or minor)',
    'Apply dim7 enharmonic modulation to reach keys a minor third, tritone, or major sixth away',
  ],
  concepts: [
    {
      title: 'The Diminished Seventh\u2019s Symmetry',
      explanation:
        'A fully diminished seventh chord divides the octave into four equal minor thirds. B-D-F-Ab: each adjacent pair is a minor third apart. Because of this perfect symmetry, the chord sounds the same regardless of which note is considered the root. There are only three distinct diminished seventh chords in the twelve-tone system \u2014 every dim7 chord is an enharmonic respelling of one of these three.',
      tryThisQuery: 'Bdim7',
      tryThisLabel: 'Hear Bdim7 \u2014 four equal minor thirds',
    },
    {
      title: 'Four Possible Resolutions',
      explanation:
        'Because any of the four notes can serve as the leading tone, one diminished seventh chord can function as viio7 in four different keys. B-D-F-Ab resolves to C minor (B is leading tone). Respell as D-F-Ab-Cb: resolves to Eb minor (D is leading tone). Respell as F-Ab-Cb-Ebb: resolves to Gb minor. Respell as G#-B-D-F (G# as leading tone): resolves to A minor. The four target keys — C, Eb, Gb, A — are each a minor third apart.',
      tryThisQuery: 'C minor scale',
      tryThisLabel: 'See C minor \u2014 one of four possible resolutions',
    },
    {
      title: 'Applying Dim7 Enharmonic Modulation',
      explanation:
        'To modulate from C minor to A minor via dim7: use viio7 of C minor (B-D-F-Ab), then respell Ab as G# to get viio7 of A minor (G#-B-D-F), and resolve to A minor. The chord does not change sonically \u2014 only the spelling and resolution change. This technique reaches keys a minor third, tritone, or major sixth away in a single step, making it the most versatile enharmonic pivot in tonal music.',
      tryThisQuery: 'A minor scale',
      tryThisLabel: 'See A minor \u2014 a distant target key from C',
    },
  ],
  tasks: [
    {
      id: 'l6u19m1t1',
      instruction:
        "Type 'Bdim7' \u2014 this chord can resolve to C minor, Eb minor, Gb minor, or A minor. All four resolutions are equally valid. Enharmonic spelling determines the destination key",
      query: 'Bdim7',
    },
    {
      id: 'l6u19m1t2',
      instruction:
        'Map the four resolutions of Bdim7 on the circle of fifths: C, Eb, Gb, A. They are each a minor third apart \u2014 dividing the octave into four equal parts, just like the chord itself',
    },
    {
      id: 'l6u19m1t3',
      instruction:
        'Start from F#dim7 (F#-A-C-Eb). Find the four target keys: G minor (F# as leading tone), Bb minor (A as leading tone), Db minor (C as leading tone), E minor (Eb respelled as D# as leading tone)',
    },
  ],
  prerequisites: ['l6u18m4'],

};

const l6u19m2: CurriculumModule = {
  id: 'l6u19m2',
  unitId: 'u19',
  levelId: 'l6',
  title: 'Common-Tone Diminished Seventh',
  subtitle: 'The CTo7 chord as a chromatic embellishment sharing a common tone with its target',
  objectives: [
    'Build a CTo7 chord that shares the root of its target chord',
    'Resolve CTo7 correctly by holding the common tone and moving the other three voices by step (two by half step, one by whole step)',
    'Distinguish CTo7 from functional viio7 \u2014 CTo7 embellishes rather than modulates',
  ],
  concepts: [
    {
      title: 'What Is CTo7?',
      explanation:
        'A common-tone diminished seventh chord shares one note (the common tone) with the chord it embellishes. The common tone is usually the root of the target chord. The other three notes of the dim7 chord each resolve by step (two by half step, one by whole step) to the remaining chord tones. Unlike a functional viio7, CTo7 does not change the key \u2014 it creates a dramatic chromatic approach to a chord the listener already expects.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear C major \u2014 the target chord a CTo7 embellishes',
    },
    {
      title: 'Building CTo7',
      explanation:
        'To build CTo7 of C major: keep C as the common tone, then fill in a diminished seventh chord that includes C. One option: C-D#-F#-A (= C with D#dim7 around it). D# resolves up by half step to E, F# resolves up by half step to G, A resolves down by whole step to G. Two voices move by half step, one by whole step, while C holds firm. The result is a shimmering chromatic approach.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Play C major \u2014 hear the resolution target',
    },
    {
      title: 'CTo7 in Musical Context',
      explanation:
        'CTo7 is common in Romantic music and film scores. It often embellishes the tonic (CTo7 \u2192 I) or the dominant (CTo7 \u2192 V). Because it does not change the key, it functions more like a chromatic neighbor chord than a true modulation. The notation CTo7 distinguishes it from a viio7 analysis, which would imply a tonicization. CTo7 is pure color and embellishment.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Hear G major \u2014 CTo7 can also embellish V',
    },
  ],
  tasks: [
    {
      id: 'l6u19m2t1',
      instruction:
        'Build CTo7 of C major: keep C, add a dim7 chord containing C. One result: C-D#-F#-A. Check that D# and F# each resolve by half step (to E and G), while A resolves by whole step down to G',
    },
    {
      id: 'l6u19m2t2',
      instruction:
        'Build CTo7 of G major: keep G, add a dim7 chord containing G. Result: G-A#-C#-E. A# resolves to B, C# resolves to D, E resolves to D (whole step down). The target is G-B-D',
    },
    {
      id: 'l6u19m2t3',
      instruction:
        "Type 'C major chord' and hear the resolution target. Now imagine the CTo7 chord (C-D#-F#-A) approaching it \u2014 three voices shift by step (two by half step, one by whole step) while C sustains. This is pure chromatic embellishment, not modulation",
      query: 'C major chord',
    },
  ],
  prerequisites: ['l6u19m1'],

};

const l6u19m3: CurriculumModule = {
  id: 'l6u19m3',
  unitId: 'u19',
  levelId: 'l6',
  title: 'Chromatic Mediants and Altered Dominants',
  subtitle: 'Third-related chromatic chords, altered dominants, and the omnibus progression',
  objectives: [
    'Identify chromatic mediant relationships (roots a third apart with at least one chromatic shift)',
    'Build altered dominants (V+, V7b5, V7#5) and understand their intensified resolution to I',
    'Recognize the omnibus progression as a chromatic voice-exchange pattern through dominant sonorities',
  ],
  concepts: [
    {
      title: 'Chromatic Mediants',
      explanation:
        'A chromatic mediant is a chord whose root is a major or minor third away from the current chord, with at least one chromatic alteration between them. From C major, Ab major and E major are chromatic mediants \u2014 each shares one common tone with C but shifts the other notes chromatically. Doubly chromatic mediants share no common tones at all. These dramatic shifts are a signature of film scores and late Romantic music. Some chromatic mediants (like \u266dVI) can also be analyzed as mode mixture \u2014 the distinction depends on context and function.',
      tryThisQuery: 'Ab major chord',
      tryThisLabel: 'Hear Ab major \u2014 chromatic mediant of C',
    },
    {
      title: 'Altered Dominants',
      explanation:
        'Altered dominants add chromatic tension to the dominant chord. V+ (augmented dominant) raises the fifth, which resolves upward to the 3rd of I. V7b5 lowers the fifth, common in jazz. V7#5 combines the augmented fifth with a seventh. Doubly-applied dominants (V/V/V) extend the chain one level further: in C, A7 \u2192 D7 \u2192 G7 \u2192 C creates cascading forward momentum through sequential dominant resolutions.',
      tryThisQuery: 'E major chord',
      tryThisLabel: 'Hear E major \u2014 another chromatic mediant of C',
    },
    {
      title: 'The Omnibus Progression',
      explanation:
        'The omnibus is a chromatic voice-exchange pattern where one voice ascends chromatically while another descends, with the remaining voices holding steady. This creates a slowly evolving harmonic landscape moving through dominant seventh and augmented sixth sonorities. Common in 19th-century music, it produces a sense of harmonic wandering without clear functional direction.',
      tryThisQuery: 'C7#5',
      tryThisLabel: 'Hear C7#5 \u2014 an altered dominant sonority',
    },
  ],
  tasks: [
    {
      id: 'l6u19m3t1',
      instruction:
        "Play 'Ab major chord', then 'C major chord', then 'E major chord' \u2014 hear how each chromatic mediant shares one note with C major but shifts the other two chromatically. The effect is vivid and dramatic",
      query: 'Ab major chord',
    },
    {
      id: 'l6u19m3t2',
      instruction:
        'Think through the V/V/V chain in C: A7 resolves to D7, D7 resolves to G7, G7 resolves to C. Each link is a dominant-to-tonic resolution creating cascading forward momentum',
    },
    {
      id: 'l6u19m3t3',
      instruction:
        "Type 'C7#5' to hear an altered dominant. The raised fifth creates additional chromatic tension that intensifies the resolution to the tonic. Compare it to a plain C7",
      query: 'C7#5',
    },
  ],
  prerequisites: ['l6u19m2'],
};

const l6u19m4: CurriculumModule = {
  id: 'l6u19m4',
  unitId: 'u19',
  levelId: 'l6',
  title: 'Late Romantic Harmonic Techniques',
  subtitle: 'Nonfunctional harmony, chromatic planing, and the dissolution of tonality',
  objectives: [
    'Recognize equal division of the octave (whole-tone, diminished, augmented patterns) as sources of tonal ambiguity',
    'Identify nonfunctional chord successions and chromatic planing as alternatives to functional harmony',
    'Understand extended tonality as the stretching and eventual dissolution of tonal centers',
  ],
  concepts: [
    {
      title: 'Equal Division of the Octave',
      explanation:
        'Symmetric patterns that divide the 12 half steps equally create tonal ambiguity because no single note feels like home. Division by 2 yields the whole-tone scale (6 notes, only 2 transpositions possible). Division by 3 yields the diminished seventh chord (4 notes). Division by 4 yields the augmented triad (3 notes). These structures were exploited by Debussy, Ravel, Liszt, and Wagner to blur or dissolve key centers.',
      tryThisQuery: 'whole tone scale',
      tryThisLabel: 'Hear the whole-tone scale \u2014 division by 2',
    },
    {
      title: 'Nonfunctional Chord Successions',
      explanation:
        'In late Romantic music, chord progressions increasingly abandon functional logic (T-PD-D-T). Instead, chords connect through voice-leading proximity (each voice moves minimally), common-tone persistence (a pitch sustains across chord changes), or pure sonority logic (chords chosen for color, not function). This marks the beginning of tonality\u2019s dissolution and the road toward atonality.',
      tryThisQuery: 'C diminished scale',
      tryThisLabel: 'Hear the diminished scale \u2014 8 notes alternating whole and half steps',
    },
    {
      title: 'Chromatic Planing and Extended Tonality',
      explanation:
        'Planing moves a chord shape in parallel by step or half step, ignoring key constraints. Chromatic planing (all half steps) produces a wash of pure color with no functional direction. Diatonic planing adjusts interval quality to stay in the key. Extended tonality stretches tonal boundaries: remote modulations become frequent, chromatic saturation makes key identification difficult, and traditional cadences are avoided. This is the twilight of common-practice tonality.',
      tryThisQuery: 'whole tone scale',
      tryThisLabel: 'Explore the whole-tone world \u2014 Debussy\u2019s palette',
    },
  ],
  tasks: [
    {
      id: 'l6u19m4t1',
      instruction:
        "Type 'whole tone scale' \u2014 every adjacent interval is a whole step. No half steps, no leading tones, no dominant pull. This is pure tonal ambiguity, the foundation of Debussy\u2019s harmonic language",
      query: 'whole tone scale',
    },
    {
      id: 'l6u19m4t2',
      instruction:
        "Type 'C diminished scale' \u2014 this alternating whole-half pattern creates a symmetric eight-note scale containing four tritones and four minor thirds, dividing the octave into equal parts",
      query: 'C diminished scale',
    },
    {
      id: 'l6u19m4t3',
      instruction:
        'Imagine moving a C major triad up by half step repeatedly: C-Db-D-Eb... Each chord is a parallel transposition. No voice leads functionally \u2014 every note shifts by the same amount. This is chromatic planing in its purest form',
    },
  ],
  prerequisites: ['l6u19m3'],
};

// ---------------------------------------------------------------------------
// Level 6, Unit 20: Counterpoint and Part Writing (4 modules)
// Engine coverage: 6.6 Species = NONE, 6.7 3/4-Part = NONE, 6.8 Part Writing = NONE
// ---------------------------------------------------------------------------

const l6u20m1: CurriculumModule = {
  id: 'l6u20m1',
  unitId: 'u20',
  levelId: 'l6',
  title: 'Species Counterpoint: First through Third Species',
  subtitle: 'Cantus firmus, note-against-note, 2:1, and 4:1 counterpoint',
  objectives: [
    'Write a cantus firmus following established rules (8\u201312 notes, stepwise, single climax)',
    'Master first species (1:1) consonances and second species (2:1) weak-beat dissonance treatment',
    'Master third species (4:1) with passing tones, neighbors, cambiata, and double neighbors',
  ],
  concepts: [
    {
      title: 'Cantus Firmus and First Species (1:1)',
      explanation:
        'The cantus firmus (CF) is a simple melody of 8\u201312 whole notes, beginning and ending on the tonic, mostly stepwise with one climax point. First species places one note against each CF note using only consonances \u2014 begin on P1, P5, or P8, end on P1 or P8 approached by step, favor imperfect consonances (3rds and 6ths), and prohibit parallel perfect intervals. No voice crossing, no more than three consecutive 3rds or 6ths.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See the notes available for a CF in C major',
    },
    {
      title: 'Second Species (2:1)',
      explanation:
        'Two notes against each CF note. Strong beats must be consonant with the CF. Weak beats may also be consonant \u2014 a leap to a consonant interval is permitted. Weak beats may be dissonant if approached and left by step (passing tone) or if they step away and return (neighbor tone). No unisons on strong beats except at the beginning and end. Second species introduces the fundamental principle of dissonance treatment: dissonance is permitted only when controlled by stepwise motion.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'See G major \u2014 another common CF key',
    },
    {
      title: 'Third Species (4:1)',
      explanation:
        'Four notes against each CF note. The first note of each group must be consonant; the remaining three may be dissonant as passing tones, neighbor tones, or the cambiata figure (step to dissonance, leap of a third, step back). Double neighbors (upper and lower neighbor in sequence) are also permitted. Third species produces the most melodically active and ornamented counterpoint before syncopation enters in fourth species.',
      tryThisQuery: 'D major scale',
      tryThisLabel: 'See D major \u2014 try tracing a cantus firmus',
    },
  ],
  tasks: [
    {
      id: 'l6u20m1t1',
      instruction:
        'Rules for a cantus firmus: begins and ends on tonic, mostly stepwise, one climax approached and left by step, no repeated notes, range within an octave. Try mentally composing one in C major using only C-D-E-F-G-A-B-C',
    },
    {
      id: 'l6u20m1t2',
      instruction:
        'In first species, begin on a perfect unison, fifth, or octave. Use mostly imperfect consonances (3rds and 6ths). Prohibit parallel perfect fifths and octaves. End on a unison or octave approached by step',
    },
    {
      id: 'l6u20m1t3',
      instruction:
        'In third species, the cambiata is a specific ornamental figure: consonance, step to dissonance, leap of a third in the same direction, then step back. It allows a dissonant note to be left by leap \u2014 the only exception to the rule that dissonance must resolve by step',
    },
  ],
  prerequisites: ['l6u19m4'],

};

const l6u20m2: CurriculumModule = {
  id: 'l6u20m2',
  unitId: 'u20',
  levelId: 'l6',
  title: 'Species Counterpoint: Fourth and Fifth Species',
  subtitle: 'Syncopated counterpoint, suspensions, and florid counterpoint',
  objectives: [
    'Master fourth species (syncopated): tied notes creating suspensions that resolve downward by step',
    'Identify standard dissonant suspensions (7-6, 4-3, 9-8, 2-3) and chain them into sequences',
    'Master fifth species (florid): combining all previous species freely in a single line',
  ],
  concepts: [
    {
      title: 'Fourth Species: Syncopation and Suspensions',
      explanation:
        'Fourth species introduces syncopation \u2014 notes tied from a weak beat across the barline to the next strong beat. When the tied note is dissonant against the CF on the strong beat, it creates a suspension. The suspension has three phases: preparation (consonance on the weak beat), dissonance (the tied note on the strong beat), and resolution (downward step to consonance). Standard dissonant suspensions are 7-6, 4-3, and 9-8 above the CF, and 2-3 when the counterpoint is below.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See C major \u2014 trace suspension patterns',
    },
    {
      title: 'Suspension Chains',
      explanation:
        'Suspensions can be chained together: each resolution becomes the preparation for the next suspension. A chain of 7-6 suspensions or 4-3 suspensions creates a stepwise descending line of tied-over dissonances, producing one of the most expressive textures in tonal music. Suspension chains are a hallmark of Baroque and Renaissance music and remain fundamental to all part writing.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'See G major \u2014 imagine a chain of 7-6 suspensions',
    },
    {
      title: 'Fifth Species: Florid Counterpoint',
      explanation:
        'Fifth species combines all previous species freely: whole notes, half notes, quarter notes, and syncopation coexist in a single line. All the rules from earlier species apply to their respective note values. Florid counterpoint is the closest species exercise gets to real musical composition, demonstrating how strict rules produce genuinely musical results and forming the bridge from academic counterpoint to free composition.',
      tryThisQuery: 'D major scale',
      tryThisLabel: 'See D major \u2014 the canvas for florid counterpoint',
    },
  ],
  tasks: [
    {
      id: 'l6u20m2t1',
      instruction:
        'Fourth species suspensions: 7-6 and 4-3 are the standard dissonant suspensions. The dissonance occurs on the strong beat (the tied note) and resolves down by step on the weak beat. This pattern is the origin of all suspension usage in tonal music',
    },
    {
      id: 'l6u20m2t2',
      instruction:
        'A chain of 7-6 suspensions: the 6 (consonant resolution) is immediately tied over to become the 7 (dissonant suspension) against the next CF note. Each resolution feeds the next suspension, creating continuous melodic and harmonic tension',
    },
    {
      id: 'l6u20m2t3',
      instruction:
        'Fifth species combines everything: a measure might begin with a tied suspension (4th species), resolve into quarter notes (3rd species), then settle on a half note (2nd species). The art is in balancing variety with coherent melodic shape',
    },
  ],
  prerequisites: ['l6u20m1'],

};

const l6u20m3: CurriculumModule = {
  id: 'l6u20m3',
  unitId: 'u20',
  levelId: 'l6',
  title: 'Three-Part Counterpoint and Invertible Counterpoint',
  subtitle: 'Multi-voice counterpoint and invertible techniques at the octave, tenth, and twelfth',
  objectives: [
    'Extend species counterpoint to three and four voices with valid intervals against all existing parts',
    'Understand invertible counterpoint at the octave, tenth, and twelfth and the interval restrictions each imposes',
    'Apply triple counterpoint techniques where three melodies work in any of six vertical arrangements',
  ],
  concepts: [
    {
      title: 'Adding Voices: Three- and Four-Part Writing',
      explanation:
        'When a third voice enters, it must form valid intervals with both existing voices simultaneously, multiplying the constraints. Three-part writing produces complete triads, adding harmonic richness. Four-part writing further constrains movement but opens the full SATB texture. Each additional voice exponentially increases the number of interval pairs that must be checked for parallel fifths and octaves.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear a three-note triad \u2014 the simplest 3-voice sonority',
    },
    {
      title: 'Invertible Counterpoint at the Octave',
      explanation:
        'Invertible counterpoint at the octave means two melodies work correctly with either voice on top. When inverted, 3rds become 6ths (acceptable), but 5ths become 4ths (dissonant above the bass in common-practice style). So invertible counterpoint at the octave avoids 5ths. Inversion at the tenth transforms 3rds into octaves and 6ths into 5ths. Inversion at the twelfth transforms 5ths into octaves \u2014 J.S. Bach used this extensively in his fugues.',
      tryThisQuery: 'C/E',
      tryThisLabel: 'Hear C/E \u2014 inverting the bass changes the texture',
    },
    {
      title: 'Triple Counterpoint',
      explanation:
        'Triple counterpoint requires three melodies that work in all six vertical permutations (ABC, ACB, BAC, BCA, CAB, CBA) \u2014 extraordinarily demanding to write. All six arrangements must produce valid counterpoint with proper consonance treatment. This is the pinnacle of contrapuntal craft, demonstrated most fully in Bach\u2019s fugues and the Art of Fugue.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Hear G major \u2014 another three-voice sonority to invert',
    },
  ],
  tasks: [
    {
      id: 'l6u20m3t1',
      instruction:
        'In three-part writing, check every pair of voices for parallel fifths and octaves. With voices A, B, and C, you must verify A-B, A-C, and B-C \u2014 three pairs instead of one',
    },
    {
      id: 'l6u20m3t2',
      instruction:
        'For invertible counterpoint at the octave: intervals transform as follows \u2014 unison becomes octave, 2nd becomes 7th, 3rd becomes 6th, 4th becomes 5th, 5th becomes 4th. Since 4ths are dissonant above the bass, 5ths must be avoided in the original',
    },
    {
      id: 'l6u20m3t3',
      instruction:
        'Triple counterpoint has six permutations. If melody A is above B and B is above C in the original, all five other orderings must also produce valid counterpoint. Bach achieved this routinely in his fugues',
    },
  ],
  prerequisites: ['l6u20m2'],

};

const l6u20m4: CurriculumModule = {
  id: 'l6u20m4',
  unitId: 'u20',
  levelId: 'l6',
  title: 'Advanced Part Writing and Score Reading',
  subtitle: 'SATB harmonization, figured bass realization, and orchestral score reading',
  objectives: [
    'Harmonize soprano and bass melodies in four-part SATB texture following voice-leading rules',
    'Realize figured bass by filling in upper voices from bass figures and accidentals',
    'Read full orchestral scores by transposing instruments to concert pitch and reducing to harmonic content',
  ],
  concepts: [
    {
      title: 'Soprano Harmonization',
      explanation:
        'Given a soprano melody, the task is to choose chords and fill in alto, tenor, and bass. The process: determine the key and locate cadence points, choose a bass line and chord progression that supports the melody functionally, fill in inner voices following voice-leading rules, then check for errors (parallel fifths/octaves, spacing violations, doubling mistakes, voice crossing).',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major diatonic chords \u2014 the harmonization palette',
    },
    {
      title: 'Figured Bass Realization',
      explanation:
        'Figured bass notation provides a bass line with numbers indicating intervals above each note. No figures means root position (5/3), 6 means first inversion, 6/4 means second inversion, 7 means a root-position seventh chord. Accidentals modify specific intervals. Realizing figured bass \u2014 filling in the upper three voices in real time \u2014 was the everyday skill of every Baroque keyboardist.',
      tryThisQuery: 'key of G',
      tryThisLabel: 'See G major \u2014 practice figured bass mentally',
    },
    {
      title: 'Orchestral Score Reading',
      explanation:
        'A full orchestral score arranges instruments top to bottom: woodwinds, brass, percussion, strings. Transposing instruments (clarinet in Bb, horn in F) are written at a different pitch than they sound. Reading a score requires mentally transposing these parts to concert pitch, reading C clefs (alto for viola, tenor for cello), and reducing multiple voices to their essential harmonic content.',
      tryThisQuery: 'Bb major scale',
      tryThisLabel: 'See Bb major \u2014 the key a Bb clarinet reads in',
    },
  ],
  tasks: [
    {
      id: 'l6u20m4t1',
      instruction:
        'To harmonize a soprano melody: first identify cadence points (they determine harmonic goals), then work backward from each cadence to fill in the chord progression. Inner voices follow the shortest path between chord tones',
    },
    {
      id: 'l6u20m4t2',
      instruction:
        'Figured bass shorthand: no figures = root position (5/3), 6 = first inversion, 6/4 = second inversion, 7 = root-position seventh, 6/5 = first inversion seventh, 4/3 = second inversion seventh, 4/2 = third inversion seventh',
    },
    {
      id: 'l6u20m4t3',
      instruction:
        'Transposing instruments: a Bb clarinet sounds a whole step lower than written (reads C, audience hears Bb). A horn in F sounds a perfect fifth lower than written. Score readers must transpose mentally to hear actual pitches',
    },
  ],
  prerequisites: ['l6u20m3'],

};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

export const L6_UNITS: CurriculumUnit[] = [
  {
    id: 'u18',
    levelId: 'l6',
    title: 'Chromatic Chords',
    description:
      'Neapolitan chord, augmented sixth chords, and enharmonic modulation via the German sixth',
    icon: 'chords',
    modules: [l6u18m1, l6u18m2, l6u18m3, l6u18m4],
    milestone: {
      skillsSummary: [
        'Build and resolve the Neapolitan chord (bII6) as a chromatic pre-dominant',
        'Construct Italian, French, and German augmented sixth chords and understand their distinct characters',
        'Recognize the Gr+6/V7 enharmonic equivalence and use it to modulate between distant keys',
      ],
      bridgeText:
        'You can now deploy the most dramatic chromatic chords in tonal music and modulate between distant keys through the German sixth pivot. Next you\u2019ll explore diminished seventh reinterpretation, common-tone embellishment, and the broader chromatic landscape that pushed tonality to its limits.',
      tryThisQuery: 'Db major chord',
      tryThisLabel: 'Play the Neapolitan of C',
      tryThisPrompt:
        'Can you spell the Neapolitan chord in three other minor keys before checking?',
    },
  },
  {
    id: 'u19',
    levelId: 'l6',
    title: 'Advanced Chromatic Techniques',
    description:
      'Diminished seventh modulation, common-tone embellishment, chromatic mediants, and late Romantic dissolution',
    icon: 'harmony',
    modules: [l6u19m1, l6u19m2, l6u19m3, l6u19m4],
    milestone: {
      skillsSummary: [
        'Use diminished seventh enharmonic reinterpretation to modulate to four possible keys',
        'Apply common-tone diminished seventh chords (CTo7) as chromatic embellishments',
        'Identify chromatic mediant relationships, altered dominants, and nonfunctional late Romantic techniques',
      ],
      bridgeText:
        'You\u2019ve traced chromaticism from individual chords through enharmonic modulation to the dissolution of functional tonality itself. Now you\u2019ll build the contrapuntal skills that underpin all part writing \u2014 from strict species counterpoint to full orchestral score reading.',
      tryThisQuery: 'whole tone scale',
      tryThisLabel: 'Explore the whole-tone scale',
      tryThisPrompt:
        'Play it and notice: no half steps, no leading tones, no sense of key. How does that feel compared to a major scale?',
    },
  },
  {
    id: 'u20',
    levelId: 'l6',
    title: 'Counterpoint and Part Writing',
    description:
      'Complete species counterpoint, invertible counterpoint, SATB harmonization, and score reading',
    icon: 'scales',
    modules: [l6u20m1, l6u20m2, l6u20m3, l6u20m4],
    milestone: {
      skillsSummary: [
        'Apply all five species of counterpoint from cantus firmus through florid writing',
        'Understand invertible and triple counterpoint techniques used in Bach\u2019s fugues',
        'Harmonize melodies in SATB, realize figured bass, and read orchestral scores',
      ],
      bridgeText:
        'You\u2019ve completed the full arc of chromatic harmony and contrapuntal technique. These skills \u2014 chromatic chords, enharmonic modulation, species counterpoint, and part writing \u2014 form the toolkit of advanced tonal composition and analysis.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See C major \u2014 compose a cantus firmus',
      tryThisPrompt:
        'Try writing an 8-note cantus firmus in C major: start on C, end on C, mostly stepwise, one high point. Can you follow all the rules?',
    },
  },
];
