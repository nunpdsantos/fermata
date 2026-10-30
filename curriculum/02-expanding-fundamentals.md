# Level 2: Expanding Fundamentals

**Difficulty:** Early Beginner
**Prerequisites:** Level 1 complete
**Equivalence:** ABRSM Grade 2-3, RCM Level 2-4, Kostka Ch. 3-4, Laitz Ch. 2-3
**Estimated Modules:** 10-12

---

## 2.1 All Major Key Signatures

### Learning Objectives
- Identify all 15 major key signatures (including enharmonic pairs)
- Apply the order of sharps (F-C-G-D-A-E-B) and flats (B-E-A-D-G-C-F)
- Determine the key from a key signature and vice versa
- Understand the circle of fifths as a map of all keys

### Concepts

**The Full Set of Major Keys**
There are 15 major key signatures but only 12 distinct keys (3 enharmonic pairs):
- Sharp keys: C, G, D, A, E, B, F#, C# (0-7 sharps)
- Flat keys: C, F, Bb, Eb, Ab, Db, Gb, Cb (0-7 flats)
- Enharmonic pairs: B/Cb, F#/Gb, C#/Db

**Order of Sharps: F-C-G-D-A-E-B**
Each new sharp key adds one sharp. The new sharp is always a half step below the tonic. G major: F#. D major: F#, C#. A major: F#, C#, G#. The pattern follows the circle of fifths.

**Order of Flats: B-E-A-D-G-C-F**
The reverse of the sharps order. Each new flat key adds one flat. The new flat is always the 4th degree. F major: Bb. Bb major: Bb, Eb. Eb major: Bb, Eb, Ab.

**Quick Identification Tricks**
- Sharp keys: the last sharp is the 7th degree — go up a half step to find the key. Last sharp is F# → key is G.
- Flat keys: the second-to-last flat IS the key. Two flats (Bb, Eb) → key is Bb. Exception: one flat = F major.

**The Circle of Fifths**
Arrange all 12 keys in a circle. Moving clockwise: each key is a perfect fifth higher (adds one sharp). Moving counterclockwise: each key is a perfect fourth higher (adds one flat). The circle connects every key to its nearest neighbors.

### Interactive Exercises
- **Key signature flashcards:** Show a key signature → name the key (and vice versa)
- **Circle of Fifths navigator:** Interactive circle — click a key, see its signature, hear its scale
- **Try This:** "Ab major scale", "E major scale", "Db major scale" — explore unfamiliar keys

### App Mapping
- `CircleOfFifths` component already exists and is interactive
- All 12 keys fully supported in the engine
- Existing Unit 2 Modules 3-4 cover this — extend with the full set

---

## 2.2 Scale Degrees by Name

### Learning Objectives
- Name all seven scale degrees: tonic, supertonic, mediant, subdominant, dominant, submediant, leading tone
- Understand the functional significance of each degree name
- Distinguish leading tone (major/harmonic minor) from subtonic (natural minor)

### Concepts

**The Seven Scale Degree Names**
| Degree | Name | Function |
|--------|------|----------|
| 1 | Tonic | Home base, center of gravity, resolution point |
| 2 | Supertonic | Above the tonic, often moves to tonic or dominant |
| 3 | Mediant | Midpoint between tonic and dominant — defines major/minor quality |
| 4 | Subdominant | The "lower dominant": a 5th below the tonic, as the dominant is a 5th above — the "other pillar" |
| 5 | Dominant | Second most important note, creates tension toward tonic |
| 6 | Submediant | The "lower mediant": midway between the tonic and the subdominant below it |
| 7 | Leading Tone | Half step below tonic — creates the strongest pull "home" |

**Leading Tone vs. Subtonic**
- Leading tone: when degree 7 is a half step below tonic (in major and harmonic minor). Strong pull upward.
- Subtonic: when degree 7 is a whole step below tonic (in natural minor). Weaker pull — the name reflects its lower position.

**Why These Names Matter**
They're not arbitrary labels — they describe harmonic function. The dominant (5) and leading tone (7) create tension. The tonic (1) provides resolution. The subdominant (4) and supertonic (2) create motion toward the dominant. Understanding function is the key to understanding harmony.

### Interactive Exercises
- **Degree naming:** Play a scale, highlight a note → student names the degree
- **Function explorer:** Click any degree on the piano → hear how it sounds relative to the tonic (with the tonic sustained as a drone)
- **Leading tone demo:** Compare the pull of the leading tone (half step to tonic) vs. subtonic (whole step)

### App Mapping
- `ScaleDegreeBar` component already shows degrees with color coding
- Degree colors follow functional meaning (tonic=blue, dominant=amber, leading=red)
- The color system IS the functional system — powerful teaching tool

---

## 2.3 Minor Scales (All Three Forms)

### Learning Objectives
- Build natural, harmonic, and melodic minor scales from any starting note
- Understand why three forms of minor exist
- Identify relative and parallel major/minor relationships
- Hear the characteristic sound of each minor form

### Concepts

**Natural Minor Scale**
Pattern: W-H-W-W-H-W-W. A natural minor: A-B-C-D-E-F-G (all white keys). Every natural minor shares its key signature with its relative major (3 half steps up). The natural minor has a subtonic (whole step below tonic), not a leading tone.

**The Problem with Natural Minor**
The subtonic (whole step below tonic) doesn't pull strongly to the tonic. In common-practice harmony, the V chord in natural minor is minor (v) — it lacks the tension needed for a strong resolution. Solution: raise the 7th degree.

**Harmonic Minor Scale**
Natural minor with a raised 7th degree. Pattern: W-H-W-W-H-W+H-H (the W+H is an augmented second — 3 half steps). A harmonic minor: A-B-C-D-E-F-G#. Now the 7th is a leading tone, and the V chord is major. The augmented second between 6 and 7 gives it a distinctive, somewhat exotic sound.

**Melodic Minor Scale**
Fixes the augmented second by also raising the 6th degree — but only ascending. Ascending: W-H-W-W-W-W-H. Descending: natural minor (lowered 6 and 7). A melodic minor ascending: A-B-C-D-E-F#-G#. Descending: A-G-F-E-D-C-B-A. In jazz, the ascending form is used in both directions ("jazz minor").

**Relative Major and Minor**
Every major key has a relative minor (same key signature). The relative minor starts on the 6th degree of the major scale. C major → A minor. G major → E minor. The relationship: relative minor root is 3 half steps below the major root.

**Parallel Major and Minor**
Same root, different quality. C major and C minor. They share the tonic but have different 3rd, 6th, and 7th degrees. The parallel relationship becomes critical later in mode mixture (Level 5).

### Interactive Exercises
- **Minor scale builder:** Given a root, student builds each minor form on the piano
- **Three-form comparison:** Hear all three forms of the same minor scale back-to-back
- **Relative/parallel finder:** Given a major key → find its relative minor (and vice versa)
- **Try This:** "A natural minor", "A harmonic minor", "A melodic minor"

### App Mapping
- `core/constants/scales.ts`: `natural_minor: [0,2,3,5,7,8,10]`, `harmonic_minor: [0,2,3,5,7,8,11]`, `melodic_minor: [0,2,3,5,7,9,11]`
- All three forms fully supported, display on piano and fretboard works
- Existing Unit 2 Modules 1-2 cover major and natural minor — add harmonic and melodic

---

## 2.4 Compound Meter

### Learning Objectives
- Distinguish simple from compound meter
- Count in 6/8, 9/8, and 12/8
- Understand that compound meter divides beats into three (not two)
- Feel the difference between 3/4 and 6/8

### Concepts

**Simple vs. Compound**
In simple meter, each beat divides naturally into two equal parts. In compound meter, each beat divides into three. This creates a fundamentally different rhythmic feel — lilting, swaying, rocking vs. straight and driving.

**Compound Time Signatures**
- 6/8: 2 dotted-quarter beats per measure (each divides into 3 eighths). Feel: 1-2-3-4-5-6 → TWO groups of three.
- 9/8: 3 dotted-quarter beats per measure. Feel: THREE groups of three.
- 12/8: 4 dotted-quarter beats per measure. Feel: FOUR groups of three.

**Reading the Time Signature**
In compound meters, the top number is divisible by 3 (6, 9, 12). Divide by 3 to get the number of beats. The bottom number shows the division (eighth note), not the beat. The beat itself is a dotted note (dotted quarter in x/8 meters).

**3/4 vs. 6/8**
Both have 6 eighth notes per measure, but the grouping is different:
- 3/4: THREE beats of TWO eighths (1-and-2-and-3-and)
- 6/8: TWO beats of THREE eighths (1-2-3-4-5-6)
The accent pattern is completely different. 3/4 = waltz. 6/8 = jig/march.

### Interactive Exercises
- **Meter identification:** Hear a rhythmic pattern → identify simple vs compound
- **3/4 vs 6/8:** Hear examples of each → distinguish by accent pattern
- **Compound counting:** Count along with 6/8 and 12/8 patterns

### App Mapping
- No rhythm system currently exists
- This is conceptual/aural — can be taught through audio examples with metronome

---

## 2.5 Syncopation and Rhythmic Concepts

### Learning Objectives
- Recognize syncopation (accents on weak beats or between beats)
- Execute triplets and understand their notation
- Understand duplets in compound meter
- Feel dotted rhythms and swing feel

### Concepts

**Syncopation**
Placing accents where they're not expected — on weak beats, on the "and" of beats, or by tying notes across strong beats. Syncopation creates rhythmic tension and forward momentum. It's the rhythmic equivalent of a dissonance — disrupts the expected pattern.

**Triplets**
Three notes in the space of two. A quarter-note triplet fits three quarter notes in the space of two (one beat in 3/4 = one quarter triplet group). Marked with a "3" and a bracket. Creates a temporary compound feel within simple meter.

**Duplets**
The reverse: two notes in the space of three. Used in compound meter — two eighth notes where three would normally go. Marked with a "2." Creates a temporary simple feel within compound meter.

**Dotted Rhythms**
A dotted note followed by a note half its value: dotted quarter + eighth, dotted eighth + sixteenth. Creates a long-short pattern. Can feel stately (slow tempo) or driving (fast tempo). Distinct from triplet feel — dotted is 3:1 ratio, triplets are 2:1 ratio.

### Interactive Exercises
- **Syncopation clapper:** Tap along with syncopated rhythms
- **Triplet vs. straight:** Hear pairs of patterns, identify which uses triplets
- **Rhythm transformer:** Same melody played straight, then syncopated — compare

### App Mapping
- Audio engine can demonstrate these concepts with note timing
- Primarily conceptual/aural at this stage

---

## 2.6 Intervals — Full Quality System

### Learning Objectives
- Classify every interval with its quality: perfect, major, minor, augmented, diminished
- Calculate interval quality from any two notes
- Invert intervals (complement to 9, quality flips)
- Identify compound intervals (9th, 10th, 11th, etc.)

### Concepts

**The Quality System**
Intervals have both a number (distance) AND a quality (character):
- **Perfect intervals:** unison (P1), fourth (P4), fifth (P5), octave (P8). These intervals occur naturally between tonic and 4th/5th degrees. "Perfect" because of their acoustic purity (simple frequency ratios).
- **Major intervals:** 2nd (M2), 3rd (M3), 6th (M6), 7th (M7). These occur naturally between the tonic and each upper degree in a major scale.
- **Minor intervals:** m2, m3, m6, m7. One half step smaller than their major counterparts.
- **Augmented:** one half step larger than perfect or major. A4 (tritone), A5, A2, etc.
- **Diminished:** one half step smaller than perfect or minor. d5 (tritone), d4, d7, etc.

**The Tritone**
The interval of 6 half steps: augmented fourth (A4) or diminished fifth (d5) — same sound, different spelling. The most unstable interval in tonal music. Divides the octave exactly in half. Critical role in dominant seventh chords.

**Interval Inversion**
Flip an interval by moving the bottom note up an octave (or top note down):
- Number rule: interval + inversion = 9 (a 3rd inverts to a 6th: 3+6=9)
- Quality rule: major↔minor, augmented↔diminished, perfect↔perfect
- M3 inverts to m6. P4 inverts to P5. A4 inverts to d5.

**Compound Intervals**
Intervals larger than an octave. A 9th = octave + 2nd. A 10th = octave + 3rd. 11th = octave + 4th. 13th = octave + 6th. Same quality rules apply. These become important in extended chords (Level 3+).

**Calculating Interval Quality — Method**
1. Count the letter names (inclusive) → interval number
2. Count the half steps
3. Compare to the major scale: if the upper note is IN the major scale of the lower note, it's major (for 2,3,6,7) or perfect (for 1,4,5,8)
4. If it's a half step smaller → minor. Another half step → diminished. A half step larger than major/perfect → augmented.

### Interactive Exercises
- **Interval calculator:** Click two piano keys → app shows the full interval name (quality + number)
- **Interval builder:** Given "major 6th above D" → student finds the note (B)
- **Inversion trainer:** Given an interval → student names its inversion
- **Try This:** Demonstrate each interval type on the piano

### App Mapping
- `core/constants/intervals.ts`: Full interval definitions with semitone values, abbreviations, and names
- All interval calculations supported in the engine
- "Try This" system can display any interval

---

## 2.7 All Four Triad Types

### Learning Objectives
- Build and identify major, minor, diminished, and augmented triads
- Understand triad construction as stacked thirds
- Hear the characteristic sound of each quality
- Understand triad inversions and figured bass basics

### Concepts

**Four Triad Qualities**
Every triad is built by stacking two thirds:

| Quality | Formula | Intervals | Sound |
|---------|---------|-----------|-------|
| Major | Root + M3 + P5 | M3 + m3 | Bright, stable |
| Minor | Root + m3 + P5 | m3 + M3 | Dark, stable |
| Diminished | Root + m3 + d5 | m3 + m3 | Tense, unstable |
| Augmented | Root + M3 + A5 | M3 + M3 | Strange, unresolved |

**Stacked Thirds**
Major triad = major third + minor third (M3+m3). Minor = m3+M3. Diminished = m3+m3. Augmented = M3+M3. The combination of third types determines the triad quality.

**Triad Inversions**
- Root position: root is the lowest note (C-E-G). Figured bass: 5/3 (or no figure).
- First inversion: third is the lowest note (E-G-C). Figured bass: 6/3 (or just 6).
- Second inversion: fifth is the lowest note (G-C-E). Figured bass: 6/4.

The root doesn't change when you invert — C-E-G, E-G-C, and G-C-E are all C major triads in different inversions. The lowest note (bass note) changes.

**Figured Bass Introduction**
Numbers below the bass note indicate the intervals above it. Root position = 5/3 (a fifth and a third above the bass). First inversion = 6/3 (a sixth and a third). Second inversion = 6/4 (a sixth and a fourth). This was the standard notation in the Baroque era.

### Interactive Exercises
- **Triad builder:** Given a root and quality → student builds on the piano
- **Triad identifier:** Hear a triad → identify its quality (major/minor/dim/aug)
- **Inversion identifier:** See notes on the piano → identify root and inversion
- **Try This:** "C minor chord", "C diminished chord", "C augmented chord"

### App Mapping
- `core/constants/chords.ts`: `major: [0,4,7]`, `minor: [0,3,7]`, `diminished: [0,3,6]`, `augmented: [0,4,8]`
- Chord inversions fully supported in the engine (store has `chordInversion` state)
- Existing Unit 3 covers this well — enrich with figured bass explanation

---

## 2.8 Diatonic Triads in Major and Minor

### Learning Objectives
- Build a triad on every degree of the major and minor scales
- Identify the quality of each diatonic triad
- Use Roman numerals (uppercase = major, lowercase = minor)
- Recognize the quality pattern as a fingerprint of the key

### Concepts

**Diatonic Triads in Major**
Build a triad on each degree using ONLY notes from the key:

| Degree | Roman Numeral | Quality | Example (C major) |
|--------|--------------|---------|-------------------|
| 1 | I | Major | C-E-G |
| 2 | ii | Minor | D-F-A |
| 3 | iii | Minor | E-G-B |
| 4 | IV | Major | F-A-C |
| 5 | V | Major | G-B-D |
| 6 | vi | Minor | A-C-E |
| 7 | vii° | Diminished | B-D-F |

Pattern: **I - ii - iii - IV - V - vi - vii°** — always the same in every major key.

**Diatonic Triads in Minor (Harmonic Minor)**

| Degree | Roman Numeral | Quality | Example (A minor) |
|--------|--------------|---------|-------------------|
| 1 | i | Minor | A-C-E |
| 2 | ii° | Diminished | B-D-F |
| 3 | III+ | Augmented | C-E-G# |
| 4 | iv | Minor | D-F-A |
| 5 | V | Major | E-G#-B |
| 6 | VI | Major | F-A-C |
| 7 | vii° | Diminished | G#-B-D |

Pattern: **i - ii° - III+ - iv - V - VI - vii°** (using harmonic minor with raised 7th).

Note: In practice, III+ is rarely used — composers typically borrow from natural minor where III is a plain major triad.

**Roman Numeral Conventions**
- Uppercase = major triad (I, IV, V)
- Lowercase = minor triad (ii, iii, vi)
- ° superscript = diminished (vii°)
- + superscript = augmented (III+)
- This notation is universal — it works in any key

**Why the Pattern Is Fixed**
The arrangement of whole and half steps in the major scale forces specific interval combinations at each degree. The half steps (between 3-4 and 7-1) create the diminished triad on vii and determine which triads are major vs. minor. Change the scale → change the pattern.

### Interactive Exercises
- **Diatonic chord explorer:** Select a key → see all 7 diatonic triads displayed on the piano
- **Roman numeral quiz:** Play a diatonic chord → student identifies the Roman numeral
- **Quality pattern:** Build diatonic triads in a new key → verify the I-ii-iii-IV-V-vi-vii° pattern holds
- **Try This:** "Diatonic chords in G major", "Diatonic chords in D major"

### App Mapping
- Existing Unit 4 Module 1 covers this — strengthen and expand
- `ScaleDegreeBar` already shows scale degrees with colors
- Engine can build diatonic triads from any key/scale combination
- Could add a "diatonic chord palette" component showing all 7 chords

---

## 2.9 Additional Clefs

### Learning Objectives
- Read notes in alto (C) clef and tenor (C) clef
- Understand why different clefs exist (minimize ledger lines)
- Transpose between clefs mentally
- Recognize octave clefs (8va, 8vb, 15ma)

### Concepts

**The C Clefs**
The C clef designates middle C on whichever line it sits:
- Alto clef: middle C on the third (middle) line. Used by viola and sometimes trombone.
- Tenor clef: middle C on the fourth line. Used by cello, bassoon, and trombone in higher registers.

**Why Multiple Clefs?**
Each instrument has a different range. The goal: keep most notes on the staff without excessive ledger lines. Viola's range sits between treble and bass → alto clef puts it perfectly centered. Cello's upper range needs fewer ledger lines → tenor clef.

**Octave Transposition Signs**
- 8va (ottava): play one octave higher than written
- 8vb (ottava bassa): play one octave lower than written
- 15ma: play two octaves higher
- These are shorthand to avoid extreme ledger lines

### Interactive Exercises
- **Clef comparison:** Same note shown in treble, bass, alto, and tenor clef → see where it lands
- **Clef reading:** Notes in alto/tenor clef → name them
- Knowledge module — limited interactivity in a piano/guitar app

### App Mapping
- Less directly interactive in this app (no notation editor)
- Important for theoretical completeness
- Could be a text-heavy reference module with audio examples

---

## 2.10 Musical Terms Expanded

### Learning Objectives
- Know tempo modification terms (accelerando, ritardando, a tempo, rubato)
- Recognize additional articulation marks (tenuto, sforzando, marcato)
- Understand navigation symbols (D.C., D.S., Coda, Fine)
- Identify basic ornaments (trill, mordent, turn, grace note)

### Concepts

**Tempo Modifications**
- Accelerando (accel.): gradually faster
- Ritardando (rit.): gradually slower
- Rallentando (rall.): gradually slower (similar to rit.)
- A tempo: return to the original tempo
- Rubato: flexible tempo for expressive purposes

**Additional Articulation**
- Tenuto (-): hold for full value, slight emphasis
- Sforzando (sfz): sudden strong accent
- Marcato (^): strong accent, even more than regular accent
- Portato (tenuto + staccato): gently separated notes

**Navigation Symbols**
- D.C. (Da Capo): return to the beginning
- D.S. (Dal Segno): return to the sign (𝄋)
- Coda (⊕): jump to the coda (ending section)
- Fine: the end (used with D.C. or D.S.)

**Basic Ornaments**
- Trill (tr): rapid alternation between the written note and the note above
- Mordent: quick alternation with the note below (or above for inverted mordent)
- Turn: ornamental figure: note above → main note → note below → main note
- Grace note (appoggiatura/acciaccatura): small note before the main note, stealing time from it

### Interactive Exercises
- **Term flashcards:** Definition → term (and vice versa)
- **Ornament audio:** Hear each ornament played → identify it
- Knowledge module — vocabulary building

### App Mapping
- Reference material, less interactive
- Audio demonstrations possible through the synth engine

---

## Module Breakdown for Implementation

| Module ID | Topic | Interactive Elements |
|-----------|-------|---------------------|
| L2M01 | All Major Keys and the Circle of Fifths (2.1) | Circle of Fifths navigator, key sig flashcards |
| L2M02 | Scale Degree Names and Functions (2.2) | Degree naming, function explorer with drone |
| L2M03 | Natural Minor Scale (2.3) | Minor scale builder, "Try This" |
| L2M04 | Harmonic and Melodic Minor (2.3) | Three-form comparison, "Try This" |
| L2M05 | Relative and Parallel Keys (2.3) | Relative/parallel finder |
| L2M06 | Compound Meter: 6/8, 9/8, 12/8 (2.4) | Meter identification, 3/4 vs 6/8 |
| L2M07 | Syncopation and Triplets (2.5) | Rhythm transformer |
| L2M08 | Interval Quality: Perfect, Major, Minor (2.6) | Interval calculator on piano |
| L2M09 | Augmented, Diminished, and Compound Intervals (2.6) | Interval builder, inversion trainer |
| L2M10 | The Four Triad Types (2.7) | Triad builder, quality identifier |
| L2M11 | Triad Inversions and Figured Bass (2.7) | Inversion identifier on piano |
| L2M12 | Diatonic Triads and Roman Numerals (2.8) | Diatonic chord explorer, RN quiz |
