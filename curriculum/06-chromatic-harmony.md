# Level 6: Chromatic Harmony (Advanced)

> **SUPERSEDED planning document — do not teach or build from it.**
> This was the pre-implementation spec for Level 6. It is not shipped and is
> not maintained. The app's Level 6 content lives in
> `src/core/constants/curriculumL6.ts` (EN) and the PT/ES overlays under
> `src/i18n/content/`; where the two disagree, the shipped `.ts` is right.
> The 2026-10-30 audit found theory errors and dead references here that the
> shipped lessons get right (C-74: e.g. §6.3 viio7 of A spelled Ab-Cb-Ebb-Gbb, CTo7 "the other three voices resolve by half step"); they are deliberately left
> uncorrected (decision D-24, ledger W9-26).

**Difficulty:** Advanced Intermediate
**Prerequisites:** Level 5 complete
**Equivalence:** ABRSM Grade 6-7, RCM Level 8-9, Kostka Ch. 21-25, Laitz Ch. 21-27, Berklee Harmony 3
**Estimated Modules:** 10-12

---

## 6.1 The Neapolitan Chord (bII)

### Learning Objectives
- Build the Neapolitan chord (major triad on lowered 2nd degree)
- Use bII6 as a chromatic pre-dominant chord
- Apply proper voice leading (b2 resolves down)
- Recognize the Neapolitan's dramatic emotional effect

### Concepts

**What Is the Neapolitan?**
A major triad built on the lowered second scale degree. In C major/minor: Db-F-Ab. Named after the Neapolitan school of opera (18th century), though its use is much broader. It's chromatic, dramatic, and almost always used in first inversion (bII6).

**Why First Inversion?**
In root position, the bass would be b2 (Db in C). In first inversion, the bass is 4 (F) — a much more common bass note that connects smoothly to the dominant. bII6 → V has the bass motion 4 → 5, the same as IV → V. The upper voice has the dramatic chromatic note (b2).

**Function: Chromatic Pre-Dominant**
bII6 replaces ii or IV as a pre-dominant chord. Progression: bII6 → V → I (or bII6 → Cad.6/4 → V → I). The lowered 2nd degree (Db in C) must resolve DOWN — either to the leading tone (in V) or to the tonic.

**Voice Leading**
- b2 (the root of bII in the upper voice) resolves DOWN to the leading tone or to 1
- 4 (bass, the third of bII) moves UP to 5 (root of V) or stays as a common tone
- b6 (the fifth of bII) resolves DOWN to 5
- Never double b2 — it's a strong tendency tone

**Neapolitan in Root Position**
Less common but exists, especially in Romantic music. Root position bII is more emphatic and surprising. Sometimes tonicized (V/bII → bII).

**Emotional Effect**
The Neapolitan sounds dark, majestic, and weighty. The lowered second degree brings a note from the Phrygian mode into the harmony. It's a signature sound of Beethoven, Schubert, and film music.

### Interactive Exercises
- **Neapolitan builder:** Given a key → build the Neapolitan chord on the piano
- **Neapolitan in context:** Hear bII6 → V → I → compare to ii → V → I
- **Try This:** Play Db major chord in the context of C minor → hear the Neapolitan effect

### App Mapping
- Any major triad exists in the engine — Db major is just another chord
- The dramatic effect requires hearing it in context (progression playback)
- No special engine support needed beyond what exists

---

## 6.2 Augmented Sixth Chords

### Learning Objectives
- Build all three types: Italian (It+6), French (Fr+6), German (Gr+6)
- Understand the augmented sixth interval and its resolution (expands to octave on 5)
- Resolve each type correctly to V (or Cad.6/4 → V)
- Recognize the enharmonic relationship between Gr+6 and dominant seventh

### Concepts

**The Augmented Sixth Interval**
All augmented sixth chords share one feature: an augmented sixth interval between b6 in the bass and #4 in an upper voice. This interval resolves outward by contrary motion: b6 → 5 (down) and #4 → 5 (up). The result: an octave on scale degree 5 — the root of the dominant chord.

In C major/minor: Ab (b6) to F# (#4) = augmented sixth. Resolves to G-G (octave on 5).

**Italian Augmented Sixth (It+6)**
Three notes: b6, 1, #4. In C: Ab-C-F#. The simplest form — just the augmented sixth interval plus scale degree 1. Resolves to V with doubled root.

**French Augmented Sixth (Fr+6)**
Four notes: b6, 1, 2, #4. In C: Ab-C-D-F#. Adds scale degree 2 to the Italian sixth. Contains two tritones (Ab-D and C-F#). The "whole-tone" quality makes it sound exotic and unresolved.

**German Augmented Sixth (Gr+6)**
Four notes: b6, 1, b3, #4. In C: Ab-C-Eb-F#. Adds b3 (from minor mode) to the Italian sixth. Sounds identical to a dominant seventh chord (Ab-C-Eb-Gb = Ab7). This enharmonic equivalence is exploited in enharmonic modulation.

**Resolution to V**
All three types resolve to V:
- It+6 → V: outer voices expand to octave, middle voice stays or moves to leading tone
- Fr+6 → V: 2 resolves to leading tone (7), everything else follows the standard pattern
- Gr+6 → V: the b3 creates a voice-leading problem (parallel fifths to V). Solution: resolve through Cad.6/4 first (Gr+6 → I6/4 → V), which breaks up the parallels.

**Augmented Sixth Chords on Other Degrees**
While most common on b6 (resolving to V), augmented sixth chords can be built on other scale degrees. Augmented sixth of ii, for instance, resolves to ii. These are rarer.

### Interactive Exercises
- **Aug6 builder:** Given a key → build It+6, Fr+6, and Gr+6 on the piano
- **Aug6 comparison:** Hear all three types in the same key → compare their color
- **Resolution practice:** Given each type → resolve correctly to V
- **Enharmonic demo:** Play Gr+6 → compare to Ab7 → same sound, different function

### App Mapping
- These chords don't map neatly to standard chord symbols in the engine
- Would need special chord definitions or custom voicing
- Best taught with explicit note sets on the piano
- The enharmonic Gr+6 = dom7 relationship connects to the existing chord system

---

## 6.3 Enharmonic Modulation

### Learning Objectives
- Modulate between distant keys using enharmonic reinterpretation
- Use the German sixth / dominant seventh equivalence
- Use the diminished seventh chord's enharmonic flexibility
- Apply common-tone diminished seventh chords

### Concepts

**Enharmonic Reinterpretation**
Two chords that sound identical but are spelled differently and function differently. By respelling a chord, you can pivot between keys that are very far apart on the circle of fifths.

**German Sixth ↔ Dominant Seventh**
The German augmented sixth chord in one key is enharmonically identical to a dominant seventh chord in another key. Ab-C-Eb-F# (Gr+6 in C) = Ab-C-Eb-Gb (Ab7 = V7 of Db). This means you can approach it as Gr+6 in C and resolve it as V7 of Db — pivoting from C to Db major in one chord.

**Diminished Seventh Chord Reinterpretation**
A fully diminished seventh chord divides the octave into four equal parts (all minor thirds). Any of its four notes can be heard as the root. This means a single dim7 chord can function in FOUR different keys:
- B-D-F-Ab = viio7 of C
- D-F-Ab-Cb = viio7 of Eb
- F-Ab-Cb-Ebb = viio7 of Gb
- Ab-Cb-Ebb-Gbb = viio7 of A

By respelling and resolving to a different tonic, you can jump to a key a minor third, tritone, or major sixth away.

**Common-Tone Diminished Seventh**
A diminished seventh chord that shares a common tone with the chord it embellishes. The common tone (usually the root of the target chord) is held while the other three voices resolve by half step. Creates a dramatic chromatic approach to a chord without actually changing keys. Often notated as CTo7.

### Interactive Exercises
- **Enharmonic respelling:** Given a chord → spell it as Gr+6, then as V7 → identify both target keys
- **Dim7 reinterpretation:** Given a dim7 chord → find all four possible resolutions
- **Enharmonic modulation builder:** Construct a modulation from C to a distant key using enharmonic pivot

### App Mapping
- Enharmonic equivalents are built into the pitch system
- The `reverseChordParser` could identify diminished seventh chords from their notes
- This is highly analytical — best taught through guided examples

---

## 6.4 Extended Chromatic Techniques

### Learning Objectives
- Identify chromatic mediant relationships (major-third-related keys)
- Recognize doubly-applied dominants (V/V/V)
- Understand altered dominants (V+, V7b5)
- Hear the omnibus progression and chromatic voice exchange

### Concepts

**Chromatic Mediants**
Two chords whose roots are a major or minor third apart AND whose qualities create a chromatic relationship (at least one common tone, at least one chromatic shift). C major → Ab major (chromatic mediant by M3). C major → E major (chromatic mediant by M3).

Types:
- Diatonic mediant: I → iii or I → vi (thirds apart, diatonic)
- Chromatic mediant: I → bVI, I → bIII, I → III, I → VI (thirds apart, chromatic)
- Doubly chromatic mediant: No common tones at all

Chromatic mediants produce a dramatic, "cinematic" harmonic shift. Common in film scores and late Romantic music.

**Doubly-Applied Dominants**
V/V/V = the dominant of the dominant of the dominant. In C: V = G, V/V = D, V/V/V = A. A7 → D7 → G7 → C. Each dominant resolves to the next in a chain. Usually limited to V/V/V (three levels deep).

**Altered Dominants**
Dominants with chromatically altered notes:
- V+ (augmented dominant): raised fifth. Resolves to I with the #5 moving up to the 3rd of I.
- V7b5: lowered fifth. Common in jazz.
- V7#5: same as V+ with a seventh.
The alterations create additional chromatic tension that intensifies the resolution.

**Omnibus Progression**
A specific chromatic voice-exchange pattern where one voice ascends chromatically while another descends chromatically, with the other voices holding steady. Creates a slowly evolving harmonic shift through a series of dominant seventh and augmented sixth chords. Common in 19th-century music.

### Interactive Exercises
- **Chromatic mediant spotter:** Hear two chords → identify the chromatic mediant relationship
- **Altered dominant builder:** Build V+ and V7b5 in various keys
- **Try This:** Explore chromatic mediants on the piano (C major → Ab major → E major)

### App Mapping
- Augmented chords and altered dominants exist in the engine
- Chromatic mediants can be demonstrated by playing chords whose roots are a M3/m3 apart
- No special engine support needed

---

## 6.5 Late Romantic Harmonic Techniques

### Learning Objectives
- Recognize equal division of the octave (whole-tone, diminished patterns)
- Identify nonfunctional chord successions
- Understand chromatic planing (parallel motion)
- Hear the expansion and eventual dissolution of tonality

### Concepts

**Equal Division of the Octave**
Symmetric patterns that divide the 12 semitones equally:
- By 2: whole-tone scale (6 notes, 2 whole-tone scales possible)
- By 3: augmented triad / diminished seventh (4 notes)
- By 4: augmented triad (3 notes)
- By 6: tritone (2 notes)

These symmetrical structures create tonal ambiguity because no single note feels like "home." Used extensively by Debussy, Ravel, Liszt, and Wagner.

**Nonfunctional Chord Successions**
Chord progressions that don't follow T-PD-D-T logic. Chords are connected by:
- Voice-leading logic (each voice moves minimally)
- Common-tone logic (a note is sustained between chords)
- Color/mood logic (chords chosen for their sound quality, not function)

This marks the beginning of the end of functional tonality.

**Chromatic Planing**
Moving a chord shape in parallel (up or down by step or half step) without regard for key. Every note moves by the same interval. Creates a wash of color rather than functional progression. Debussy's hallmark technique.

Types:
- Chromatic planing: all notes move by the same number of half steps
- Diatonic planing: all notes move by step within the key (intervals change to stay diatonic)

**Extended Tonality**
Music that still has a tonal center but stretches the boundaries:
- Remote modulations become frequent and rapid
- Chromatic saturation makes key identification difficult
- Traditional cadences are avoided or disguised
- Dissonance is no longer resolved in conventional ways

### Interactive Exercises
- **Planing demo:** Hear a chord moved in parallel up the chromatic scale → hear the effect
- **Whole-tone explorer:** Play the whole-tone scale and chords built from it
- **Functional vs. nonfunctional:** Hear two progressions → identify which follows functional logic

### App Mapping
- Whole-tone and diminished scales exist in the engine
- Augmented and diminished chords exist
- Planing can be demonstrated by transposing a chord shape chromatically on the piano

---

## 6.6 Species Counterpoint — Complete

### Learning Objectives
- Write cantus firmus following the rules
- Master all five species of counterpoint
- Understand how species counterpoint builds to free counterpoint
- Apply species techniques to real composition

### Concepts

**Cantus Firmus (CF)**
The given melody against which counterpoint is written. Rules for a good CF:
- 8-12 notes long, all whole notes
- Begins and ends on tonic
- Mostly stepwise motion (leaps are rare and compensated by contrary motion)
- One high point (climax), approached and left by step
- No repeated notes, no sequences
- Range: within an octave (tenth at most)

**First Species (1:1) — Review and Mastery**
Note against note. Rules:
- Begin on P1, P5, or P8
- End on P1 or P8, approached by step (or half step)
- Mostly imperfect consonances (3rds, 6ths)
- No parallel P5 or P8
- No direct (hidden) P5 or P8 (similar motion into perfect consonance)
- No more than three consecutive 3rds or 6ths
- Voice crossing and voice overlap forbidden

**Second Species (2:1) — Review and Mastery**
Two notes against each CF note:
- Strong beats: consonant
- Weak beats: consonant or dissonant (if passing tone or neighbor)
- No unisons on strong beats (except first and last)
- The added rhythmic motion introduces the concept of dissonance treatment

**Third Species (4:1)**
Four notes against each CF note:
- First note of each group: consonant
- Second, third, fourth: can be dissonant as passing tones, neighbor tones, or cambiata
- The **cambiata** (changing tones): step to dissonance → leap of a third → step back. A specific ornamental figure allowed in third species.
- Double neighbors: upper and lower neighbor in sequence
- Greater melodic freedom and ornamentation

**Fourth Species (Syncopated)**
The counterpoint is syncopated — tied from weak beat to strong beat:
- The tied note on the strong beat creates a suspension (if dissonant)
- Suspension must resolve DOWN by step on the next weak beat
- Consonant suspensions: no resolution needed (but less interesting)
- This species is the birthplace of the suspension as a musical technique
- Allowed suspensions: 7-6, 4-3, (2-3 in bass)
- 9-8 suspension also occurs

**Fifth Species (Florid)**
Combines all previous species freely:
- The counterpoint uses whole notes, half notes, quarter notes, and syncopation
- All previous rules apply for their respective note values
- The most musically interesting and closest to real composition
- Demonstrates how species counterpoint builds to free counterpoint

### Interactive Exercises
- **Species validator:** Student writes counterpoint → app checks all rules (parallel motion, dissonance treatment, etc.)
- **Species by species:** Practice each species with auto-generated cantus firmi
- **CF writer:** Student writes a cantus firmus → app validates against CF rules

### App Mapping
- No counterpoint system exists
- Would need a melody input system (notation editor) for real interactive counterpoint
- Could be partially taught with guided examples and the "Try This" system showing two-voice passages

---

## 6.7 Three-Part and Four-Part Counterpoint

### Learning Objectives
- Extend species counterpoint to three and four voices
- Understand invertible counterpoint (at the octave, tenth, twelfth)
- Apply triple counterpoint techniques

### Concepts

**Adding Voices**
When a third voice is added, it must form valid intervals with BOTH existing voices simultaneously. The harmonic possibilities expand but so do the constraints. Three-part writing can produce full triads, adding harmonic dimension to the contrapuntal texture.

**Invertible Counterpoint at the Octave**
Two melodies that work correctly whether voice A is above voice B or voice B is above voice A. When inverted (one voice transposed by an octave), all intervals must remain acceptable. This means: 3rds become 6ths (fine), 5ths become 4ths (problem — 4ths are dissonant above the bass in common-practice style). So invertible counterpoint at the octave avoids 5ths.

**Invertible Counterpoint at the Tenth and Twelfth**
- At the tenth: one voice transposed by a tenth. 3rds become octaves, 6ths become 5ths. Different interval restrictions.
- At the twelfth: one voice transposed by a twelfth. 3rds become 10ths, 5ths become octaves. J.S. Bach used this extensively.

**Triple Counterpoint**
Three melodies that work in ANY vertical arrangement (6 possible permutations: ABC, ACB, BAC, BCA, CAB, CBA). All six arrangements must produce valid counterpoint. Extremely demanding to write.

### Interactive Exercises
- **Inversion demo:** Hear a two-voice passage → hear it with voices swapped → both should sound correct
- Knowledge-heavy module, less interactive

### App Mapping
- Beyond current engine capabilities
- Primarily analytical/educational content

---

## 6.8 Advanced Part Writing and Score Reading

### Learning Objectives
- Harmonize soprano and bass melodies in SATB
- Realize figured bass
- Read full orchestral scores
- Create piano reductions from full scores

### Concepts

**Soprano Harmonization**
Given a soprano melody, choose appropriate chords and fill in alto, tenor, and bass:
1. Determine the key and identify cadence points
2. Choose a bass line and chord progression (functional)
3. Fill in inner voices following voice-leading rules
4. Check for errors (parallels, spacing, doubling, voice crossing)

**Figured Bass Realization**
Given a bass line with figures (numbers), realize the full chord:
- The figures indicate intervals above the bass
- Accidentals modify specific notes
- Fill in the upper three voices (S, A, T) following voice-leading rules
- This was the everyday skill of Baroque keyboardists

**Score Reading**
Reading a full orchestral or chamber score:
- Know score order: woodwinds → brass → percussion → strings (top to bottom)
- Transpose instruments to concert pitch mentally
- Use C clefs (alto for viola, tenor for cello/trombone)
- Reduce multi-voice parts to essential harmonic content

**Piano Reduction**
Condensing a full score onto two staves:
- Right hand: upper voices and melody
- Left hand: bass and lower harmony
- Preserve essential voice leading and harmonic content
- Omit doublings and non-essential parts

### Interactive Exercises
- **Harmonization practice:** Given a soprano melody → harmonize in SATB
- **Figured bass realization:** Given a figured bass → realize the chords
- Requires notation input/output — high infrastructure need

### App Mapping
- Beyond current engine capabilities
- Would need a notation editor component
- Advanced module — lower priority for app implementation

---

## Module Breakdown for Implementation

| Module ID | Topic | Interactive Elements |
|-----------|-------|---------------------|
| L6M01 | The Neapolitan Chord (6.1) | Neapolitan builder, contextual listening |
| L6M02 | Italian and French Augmented Sixth Chords (6.2) | Aug6 builder, comparison |
| L6M03 | German Augmented Sixth and Its Dual Identity (6.2) | Resolution practice, enharmonic demo |
| L6M04 | Enharmonic Modulation: Gr+6 ↔ V7 (6.3) | Enharmonic respelling |
| L6M05 | Enharmonic Modulation: Diminished Seventh (6.3) | Dim7 reinterpretation, 4-key demo |
| L6M06 | Common-Tone Diminished Seventh (6.3) | CTo7 builder |
| L6M07 | Chromatic Mediants and Altered Dominants (6.4) | Chromatic mediant spotter |
| L6M08 | Late Romantic Techniques (6.5) | Planing demo, whole-tone explorer |
| L6M09 | Species Counterpoint: First through Third Species (6.6) | Species validator |
| L6M10 | Species Counterpoint: Fourth and Fifth Species (6.6) | Suspension practice |
| L6M11 | Three-Part Counterpoint and Invertible Counterpoint (6.7) | Inversion demo |
| L6M12 | Advanced Part Writing and Score Reading (6.8) | Harmonization practice |
