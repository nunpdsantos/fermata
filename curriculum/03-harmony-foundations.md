# Level 3: Harmony Foundations

**Difficulty:** Intermediate Beginner
**Prerequisites:** Level 2 complete
**Equivalence:** ABRSM Grade 3-4, RCM Level 4-5, Kostka Ch. 5-10, Laitz Ch. 4-8, Berklee Harmony 1
**Estimated Modules:** 12-14

---

## 3.1 Seventh Chords — The Five Qualities

### Learning Objectives
- Build and identify all five standard seventh chord qualities
- Understand seventh chords as triads + a seventh
- Hear the distinct character of each quality
- Use chord symbols and figured bass for seventh chords

### Concepts

**What Is a Seventh Chord?**
A triad with a fourth note added — a seventh above the root. Four notes instead of three. Seventh chords add richness, tension, and color beyond what triads offer. They are the foundation of jazz, pop, and Romantic-era harmony.

**Five Standard Seventh Chord Qualities**

| Name | Symbol | Formula (semitones) | Thirds Stack | Sound |
|------|--------|-------------------|--------------|-------|
| Major seventh | maj7, M7, Δ7 | 0-4-7-11 | M3+m3+M3 | Warm, lush, jazzy |
| Dominant seventh | 7 | 0-4-7-10 | M3+m3+m3 | Tense, needs resolution |
| Minor seventh | m7, -7 | 0-3-7-10 | m3+M3+m3 | Mellow, smooth |
| Half-diminished seventh | m7b5, ø7 | 0-3-6-10 | m3+m3+M3 | Dark, yearning |
| Fully diminished seventh | dim7, o7 | 0-3-6-9 | m3+m3+m3 | Extremely tense, symmetrical |

**Additional Quality: Minor-Major Seventh**
Symbol: mMaj7, m(Δ7). Formula: 0-3-7-11. Minor triad + major seventh. Rare in pop/classical, used in film and jazz for a mysterious, unsettling quality.

**Seventh Chord Inversions**
Like triads, seventh chords can be inverted (4 positions total):
- Root position: 7 (root in bass)
- First inversion: 6/5 (third in bass)
- Second inversion: 4/3 (fifth in bass)
- Third inversion: 4/2 or 2 (seventh in bass)

### Interactive Exercises
- **Seventh chord builder:** Given root + quality → build on piano
- **Quality identifier:** Hear a seventh chord → name its quality
- **Comparison trainer:** Play maj7 vs. dom7 vs. m7 in sequence → learn the differences
- **Try This:** "Cmaj7", "C7", "Cm7", "Cm7b5", "Cdim7"

### App Mapping
- All seven qualities in `core/constants/chords.ts`
- Inversions supported via `chordInversion` state
- Existing Unit 3 Module 4 introduces seventh chords — significantly expand

---

## 3.2 Diatonic Seventh Chords

### Learning Objectives
- Build seventh chords on every degree of major and minor scales
- Identify the quality of each diatonic seventh chord
- Understand the dominant seventh (V7) as the most important seventh chord
- Label diatonic seventh chords with Roman numerals

### Concepts

**Diatonic Seventh Chords in Major**

| Degree | Roman Numeral | Quality | Example (C major) |
|--------|--------------|---------|-------------------|
| 1 | Imaj7 | Major 7th | C-E-G-B |
| 2 | ii7 | Minor 7th | D-F-A-C |
| 3 | iii7 | Minor 7th | E-G-B-D |
| 4 | IVmaj7 | Major 7th | F-A-C-E |
| 5 | V7 | Dominant 7th | G-B-D-F |
| 6 | vi7 | Minor 7th | A-C-E-G |
| 7 | viiø7 | Half-diminished 7th | B-D-F-A |

**The Dominant Seventh (V7)**
The ONLY naturally occurring dominant seventh in a major key. Contains the tritone (between the 3rd and 7th of the chord: B-F in C major). This tritone wants to resolve: B→C (leading tone to tonic), F→E (7th of V resolves down to 3rd of I). This resolution is the fundamental engine of tonal music.

**Diatonic Seventh Chords in Minor (Harmonic)**

| Degree | Roman Numeral | Quality | Example (A minor) |
|--------|--------------|---------|-------------------|
| 1 | i(mΔ7) | Minor-major 7th | A-C-E-G# |
| 2 | iiø7 | Half-diminished 7th | B-D-F-A |
| 3 | IIImaj7(#5) | Augmented-major 7th | C-E-G#-B |
| 4 | iv7 | Minor 7th | D-F-A-C |
| 5 | V7 | Dominant 7th | E-G#-B-D |
| 6 | VImaj7 | Major 7th | F-A-C-E |
| 7 | viio7 | Fully diminished 7th | G#-B-D-F |

**Key Observations**
- V7 exists in both major and minor (with the raised 7th in harmonic minor)
- The half-diminished seventh (iiø7 in minor, viiø7 in major) is a critical pre-dominant chord
- The fully diminished seventh (viio7 in harmonic minor) is an extremely tense dominant-function chord

### Interactive Exercises
- **Diatonic 7th explorer:** Select a key → see all 7 diatonic seventh chords
- **V7 resolution demo:** Play V7 → hear and see it resolve to I
- **Tritone spotlight:** Highlight the tritone within V7 → show its resolution
- **Try This:** Play through diatonic 7ths in C major, G major, A minor

### App Mapping
- All chord qualities exist in the engine
- `ChordGrid` component can display diatonic chords
- Progression parser can demonstrate V7-I and other resolutions
- Existing Unit 4 Module 1-3 covers diatonic triads — add the seventh chord layer

---

## 3.3 Voice Leading Fundamentals

### Learning Objectives
- Understand SATB voicing (soprano, alto, tenor, bass)
- Apply spacing and doubling rules
- Identify the four types of voice motion
- Avoid forbidden parallels (parallel 5ths and octaves)

### Concepts

**SATB — The Four Voices**
Traditional harmony uses four voices with specific ranges:
- Soprano: C4-G5 (top voice, usually carries the melody)
- Alto: F3-C5 (second voice)
- Tenor: C3-G4 (third voice)
- Bass: E2-C4 (bottom voice, defines the harmonic foundation)

**Spacing Rules**
- Between soprano and alto: no more than an octave
- Between alto and tenor: no more than an octave
- Between tenor and bass: can exceed an octave (the gap is acceptable)
- Voices should not cross (soprano should stay above alto, etc.)
- Voices should not overlap (soprano shouldn't go below where alto was on the previous beat, etc.)

**Doubling**
When a chord has only three notes but four voices, one note must be doubled. Default rules:
- Root position: double the root (strongest choice)
- First inversion: double the soprano note (flexible)
- Never double the leading tone (it has a mandatory resolution)
- In diminished triads: double the third (the most stable note)

**Four Types of Voice Motion**
Between any two voices moving from one chord to the next:
- Contrary motion: voices move in opposite directions (strongest, most independent)
- Oblique motion: one voice stays, the other moves (smooth)
- Similar motion: both move in the same direction by different amounts (acceptable)
- Parallel motion: both move in the same direction by the same interval (restricted)

**Forbidden Parallels**
- Parallel fifths: two voices a P5 apart, both moving by the same interval to another P5. Banned because they destroy voice independence (the voices fuse acoustically).
- Parallel octaves: same problem at the octave. The voices merge into one.
- Direct (hidden) fifths/octaves: similar motion into a P5 or P8, especially in outer voices. Acceptable only if soprano moves by step.
- Parallel thirds and sixths are fine — even encouraged.

### Interactive Exercises
- **Voice motion identifier:** See two chords → label the motion between each pair of voices
- **Parallel detector:** Given a SATB progression → find the forbidden parallels
- **Voicing validator:** Student voices a chord in SATB → app checks spacing, doubling, and crossing

### App Mapping
- No SATB/voice leading system exists yet
- Would need a multi-voice notation component
- This is the most infrastructure-heavy topic in Level 3 — may require a "theory mode" vs. instrument interaction mode

---

## 3.4 Root Position Part Writing

### Learning Objectives
- Connect triads in root position following voice leading rules
- Apply different strategies for root movement by 5th, 3rd, and 2nd
- Write smooth inner voices while maintaining proper doubling

### Concepts

**The Goal of Part Writing**
Write four independent voices that together produce correct harmony AND sound melodically smooth individually. Each voice should be singable. The bass defines the chord. The soprano carries the melody. Alto and tenor fill in the harmony.

**Root Movement by Fifth (Most Common)**
When roots are a fifth apart (I-IV, I-V, ii-V, etc.):
- One common tone exists between the chords — keep it in the same voice
- Move the other two voices to the nearest chord tones
- This produces the smoothest voice leading

**Root Movement by Third**
When roots are a third apart (I-iii, I-vi, IV-ii, etc.):
- Two common tones exist — keep both in the same voices
- Move only one voice (the non-common tone) to the nearest available note
- Very smooth, minimal motion

**Root Movement by Second (Step)**
When roots are a second apart (IV-V, V-vi, I-ii, etc.):
- No common tones — all upper voices must move
- Move all three upper voices in contrary motion to the bass
- This prevents parallels that easily creep in with stepwise bass movement

### Interactive Exercises
- **Part writing practice:** Given a bass line with Roman numerals → student fills in soprano, alto, tenor
- **Error checker:** Student's part writing is validated for parallels, spacing, doubling, crossing
- **Root motion classifier:** Given two chords → identify the root motion type and predict voice leading strategy

### App Mapping
- Requires notation editor for SATB
- Can be partially demonstrated with the piano (showing voice leading between chords)
- Audio playback of SATB voicings through the synth engine

---

## 3.5 First and Second Inversion Triads

### Learning Objectives
- Understand when and why to use first inversion (6/3) triads
- Know the restricted uses of second inversion (6/4) triads
- Apply proper doubling for inverted triads
- Recognize passing, neighbor, cadential, and pedal 6/4 patterns

### Concepts

**First Inversion (6/3) Uses**
First inversion triads are versatile and used for:
- **Bass line melody:** Creating a smooth, stepwise bass line (the most common reason)
- **Substitution:** Any root position triad can be placed in first inversion for variety
- **Passing function:** Moving between two root position chords (e.g., I → V6 → I6)
- **Weakened function:** First inversion is "lighter" than root position — less emphatic

**Doubling in First Inversion**
More flexible than root position. Generally double the soprano note. Avoid doubling the bass if it's a leading tone or a tendency tone. The third being in the bass slightly weakens the chord's identity.

**Second Inversion (6/4) — Restricted**
In common-practice harmony, second inversion triads are NOT freely used. The perfect fourth above the bass (between bass and root) was historically treated as a dissonance. Four sanctioned uses:

1. **Cadential 6/4:** I6/4 before V at a cadence. The I6/4 decorates V — it's heard as V with a double appoggiatura (the 6th and 4th resolve stepwise to the 5th and 3rd of V). Analyzed as V6/4-5/3 by some, or Cad.6/4 → V by others.

2. **Passing 6/4:** Between root position and first inversion of the same chord (or between two different chords) with a stepwise bass. I → V6/4 → I6.

3. **Pedal (Neighbor) 6/4:** Over a sustained bass note. The upper voices move away and return. I → IV6/4 → I (bass stays on tonic).

4. **Arpeggiated 6/4:** In arpeggiated accompaniment patterns where the bass moves through chord tones. Not truly a structural 6/4.

### Interactive Exercises
- **6/4 type identifier:** Given a bass line context → identify which type of 6/4 is being used
- **Bass line smoother:** Take a progression in root position → revoice with first inversions for a smoother bass
- **Cadential 6/4 demo:** Hear V6/4-5/3 → I vs. plain V → I

### App Mapping
- Inversions already supported in the engine
- Could demonstrate on piano by showing bass note movement between inversions
- "Try This" with slash chord notation: "C/E" (first inversion), "C/G" (second inversion)

---

## 3.6 Cadences — The Complete Set

### Learning Objectives
- Identify and hear all six standard cadence types
- Understand cadences as the "punctuation" of music
- Analyze cadences in context (end of phrase = cadence)
- Distinguish strong from weak cadences

### Concepts

**What Is a Cadence?**
A cadence is the harmonic "punctuation" at the end of a phrase. It creates a moment of arrival, pause, or resolution. Cadences define the boundaries of musical phrases, just as periods and commas define sentences.

**Perfect Authentic Cadence (PAC)**
V → I (or V7 → I), both in root position, soprano on the tonic (scale degree 1). The strongest possible cadence — a full stop (period). Gives a complete sense of closure.

**Imperfect Authentic Cadence (IAC)**
V → I, but one or more conditions of PAC are not met: one chord is inverted, soprano is on 3rd or 5th of I instead of root, or viio is substituted for V. Weaker than PAC — more like a comma.

**Half Cadence (HC)**
Any chord → V. The phrase ends on the dominant. No resolution — it sounds like a question waiting for an answer. Creates suspense. Very common at the end of antecedent phrases.

**Plagal Cadence (PC)**
IV → I. The "Amen" cadence (from church hymn endings). Softer and less dramatic than an authentic cadence. Often follows a PAC as a final reinforcement.

**Deceptive Cadence (DC)**
V → vi (in major) or V → VI (in minor). Sets up the expectation of resolution to I, then subverts it. The vi chord shares two notes with I (in C: A-C-E shares C and E with C-E-G), so it's a "close miss." Creates surprise and extends the phrase.

**Phrygian Half Cadence**
iv6 → V in minor keys. The bass moves down by half step (b6 → 5). Named for its similarity to the Phrygian mode's characteristic half step. Distinctive, dark sound. Common in Baroque music.

### Interactive Exercises
- **Cadence identifier:** Hear a two-chord progression → name the cadence type
- **Cadence builder:** Given a key and cadence type → play the correct chords
- **Phrase analysis:** Hear a 4-bar phrase → identify the cadence at the end
- **Try This:** "V I in C" (PAC), "I V in C" (HC), "IV I in C" (plagal), "V vi in C" (deceptive)

### App Mapping
- Progression parser already handles these patterns
- Existing Unit 4 Module 5 covers cadences — this deepens significantly
- Audio playback can demonstrate each cadence type

---

## 3.7 Phrases and Periods

### Learning Objectives
- Hear a phrase as a musical "sentence" with beginning, middle, and cadence
- Understand the period: antecedent (question) + consequent (answer)
- Distinguish parallel from contrasting periods
- Recognize the sentence (Satz) structure

### Concepts

**The Phrase**
The fundamental unit of musical form — typically 4 or 8 measures long. A phrase has:
- A beginning (establishes the key)
- A middle (creates motion and development)
- An end (a cadence)

Think of it as a musical sentence. It makes a complete musical "statement."

**The Period**
Two phrases paired together:
- **Antecedent** (first phrase): ends with a weak cadence (usually HC or IAC). Poses a "question."
- **Consequent** (second phrase): ends with a strong cadence (usually PAC). Provides the "answer."

**Parallel Period**
Both phrases begin with the same or similar material. The antecedent and consequent share an opening gesture but diverge at the cadence points. Most common type.

**Contrasting Period**
The two phrases begin with different material. Less common but creates more variety.

**Double Period**
Four phrases grouped as two pairs: the first pair forms a large antecedent, the second pair forms a large consequent. The strongest cadence comes at the very end.

**The Sentence (Satz)**
A phrase structure common in Classical music:
1. Basic idea (2 measures)
2. Repetition of basic idea (2 measures, often varied)
3. Continuation (2 measures, fragmentation and acceleration)
4. Cadence (2 measures)

Total: 8 measures. The sentence builds momentum through repetition, fragmentation, and acceleration toward the cadence.

**Phrase Groups**
When phrases don't fit neatly into period or sentence structure, they form phrase groups — related phrases that hang together without the strict antecedent-consequent relationship.

### Interactive Exercises
- **Phrase boundary detection:** Listen to a melody → tap when each phrase ends (identify cadences)
- **Period type identification:** Listen to an 8-bar passage → identify as parallel period, contrasting period, or sentence
- Knowledge-heavy module — primarily listening and analysis

### App Mapping
- Progression parser could play multi-chord sequences representing phrases
- No formal phrase/period visualization exists
- This is more analytical/conceptual — can be taught with audio examples and text

---

## 3.8 Harmonic Rhythm

### Learning Objectives
- Define harmonic rhythm as the rate of chord change
- Hear how harmonic rhythm interacts with meter
- Understand strong-beat vs. weak-beat chord changes
- Recognize that harmonic rhythm speeds up approaching cadences

### Concepts

**What Is Harmonic Rhythm?**
The pattern of chord changes over time. If chords change every bar = slow harmonic rhythm. Every beat = moderate. Every half-beat = fast. Harmonic rhythm is independent of melodic rhythm — the melody can move quickly over slow chord changes.

**Harmonic Rhythm and Meter**
Chord changes are strongest on strong beats. In 4/4, changing chords on beats 1 and 3 feels natural. Changing on beats 2 and 4 (syncopated harmonic rhythm) creates instability. Most common: one chord per measure or two chords per measure.

**Accelerating Toward Cadences**
A universal pattern: harmonic rhythm slows at the beginning of phrases and speeds up near cadences. A phrase might hold one chord for 2 bars, then another for 2 bars, then change chords every bar, then every beat at the cadence. This creates momentum.

### Interactive Exercises
- **Harmonic rhythm listener:** Hear a chord progression → tap each chord change
- **Speed comparison:** Same chords, different harmonic rhythms → compare the feel
- Primarily a listening/conceptual module

### App Mapping
- Progression playback could demonstrate different harmonic rhythms
- Audio engine can vary chord change timing

---

## 3.9 Non-Chord Tones (Part 1)

### Learning Objectives
- Identify passing tones, neighbor tones, and anticipations
- Distinguish accented from unaccented non-chord tones
- Understand NCTs as melodic embellishment over harmonic structure
- Find NCTs in melodies by comparing notes to the underlying chord

### Concepts

**What Are Non-Chord Tones (NCTs)?**
Notes in a melody that don't belong to the underlying chord. They create melodic interest, tension, and motion between chord tones. Without NCTs, melodies would only move in arpeggiated chord tones — mechanical and dull. NCTs are the "seasoning" of melody.

**Identifying NCTs**
Method: at each beat (or harmonic rhythm point), determine the chord. Any melody note that isn't part of that chord is an NCT. Classify by how the note is approached and left.

**Passing Tone (PT)**
Approached by step, left by step in the same direction. Fills in the gap between two chord tones. Like walking between two stepping stones.
- Unaccented PT: on a weak beat (more common). C → D → E where D is a PT between C and E.
- Accented PT: on a strong beat (more dramatic). Falls on the beat, giving it momentary emphasis.

**Neighbor Tone (NT)**
Approached by step, left by step back to the starting note. Decorates a single chord tone — leaves and returns.
- Upper neighbor: goes up then back. C → D → C.
- Lower neighbor: goes down then back. C → B → C.
- Accented and unaccented variants exist for both.

**Anticipation (ANT)**
Arrives early — a note of the NEXT chord sounds at the end of the current chord. Approached by step or chord tone, left by common tone (it becomes a chord tone when the harmony changes). Creates forward momentum.

**Incomplete Neighbors**
Approached by step but left by leap (or vice versa). Only one step connection instead of two. More dramatic and less smooth than complete neighbors.

### Interactive Exercises
- **NCT spotter:** Play a melody over chords → student identifies which notes are NCTs
- **NCT classifier:** Given a melody with highlighted NCTs → classify each (PT, NT, ANT)
- **Try This:** Play a scale passage over a single chord → see which notes are chord tones and which are passing tones

### App Mapping
- `earTrainingGenerator.ts` exists in core — could be extended for NCT exercises
- Piano can highlight chord tones in one color and NCTs in another
- No automatic NCT detection in the engine currently

---

## 3.10 Transposition

### Learning Objectives
- Transpose a melody to a different key
- Understand concert pitch vs. written pitch
- Know common transposing instruments and their transposition intervals
- Apply transposition systematically (interval method or key signature method)

### Concepts

**What Is Transposition?**
Moving an entire piece or passage to a different key while preserving all interval relationships. Every note shifts by the same interval. The melody sounds the same — just higher or lower. Transposition is practical (fitting a singer's range) and theoretical (understanding key relationships).

**Transposition Methods**
1. **Interval method:** Determine the interval between old key and new key. Shift every note by that interval. C major → Eb major = up a minor third → every note goes up a minor third.
2. **Key signature method:** Change the key signature, then adjust individual accidentals. Conceptually simpler for longer passages.

**Transposing Instruments**
Some instruments sound different from what they read:
- Bb instruments (trumpet, clarinet): written C sounds as the Bb a major second below. Write a major second higher than concert pitch. The tenor sax, also in Bb, sounds an octave and a major second lower: write a major ninth higher.
- Eb instruments (alto sax, baritone sax): written C sounds as Eb. Write a major sixth higher than concert pitch.
- F instruments (French horn, English horn): written C sounds as F. Write a perfect fifth higher.

**Concert Pitch**
"Concert pitch" means the actual sounding pitch. When an orchestra tunes to A440, every instrument plays their own "A" — but for transposing instruments, that means playing a different written note. The conductor's score may be in concert pitch (C score) or with transpositions.

### Interactive Exercises
- **Melody transposer:** Given a melody in one key → student transposes to another key on the piano
- **Transposing instrument quiz:** "A Bb trumpet plays a written C — what note sounds?"
- **Try This:** "C major scale" → "Eb major scale" — hear both, see the shift on the piano

### App Mapping
- Key selection in the store already allows changing keys
- Scale/chord display works in all keys
- Transposition is implicitly supported — any scale/chord can be viewed in any key

---

## Module Breakdown for Implementation

| Module ID | Topic | Interactive Elements |
|-----------|-------|---------------------|
| L3M01 | The Five Seventh Chord Qualities (3.1) | 7th chord builder, quality identifier |
| L3M02 | Seventh Chord Inversions (3.1) | Inversion demo on piano |
| L3M03 | Diatonic Seventh Chords in Major (3.2) | Diatonic 7th explorer, V7 resolution |
| L3M04 | Diatonic Seventh Chords in Minor (3.2) | Diatonic 7th in minor, tritone spotlight |
| L3M05 | Voice Leading — SATB Basics (3.3) | Voice motion identifier |
| L3M06 | Forbidden Parallels and Voice Motion (3.3) | Parallel detector |
| L3M07 | Root Position Part Writing (3.4) | Part writing practice |
| L3M08 | Triads in Inversion (3.5) | Bass line smoother, 6/4 demos |
| L3M09 | Cadences — All Six Types (3.6) | Cadence identifier, cadence builder |
| L3M10 | Phrases and Periods (3.7) | Phrase boundary detection |
| L3M11 | Harmonic Rhythm (3.8) | Harmonic rhythm listener |
| L3M12 | Non-Chord Tones: Passing, Neighbor, Anticipation (3.9) | NCT spotter |
| L3M13 | Transposition (3.10) | Melody transposer |
