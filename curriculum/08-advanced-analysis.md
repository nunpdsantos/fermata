# Level 8: Analysis, Counterpoint & Post-Tonal

> **SUPERSEDED planning document — do not teach or build from it.**
> This was the pre-implementation spec for Level 8. It is not shipped and is
> not maintained. The app's Level 8 content lives in
> `src/core/constants/curriculumL8.ts` (EN) and the PT/ES overlays under
> `src/i18n/content/`; where the two disagree, the shipped `.ts` is right.
> The 2026-10-30 audit found theory errors and dead references here that the
> shipped lessons get right (C-74: e.g. "C Lydian + C Mixolydian = all notes of C major" — the union is nine pitch classes); they are deliberately left
> uncorrected (decision D-24, ledger W9-26).

**Difficulty:** Advanced+
**Prerequisites:** Level 7 complete
**Equivalence:** ABRSM Grade 8/Diploma, RCM Level 10/ARCT, Juilliard Theory V
**Estimated Modules:** 10-12

---

## 8.1 Fugue and Imitative Counterpoint

### Learning Objectives
- Analyze fugue structure (exposition, episodes, entries, stretto, coda)
- Distinguish subject from answer (real vs. tonal)
- Identify countersubjects, stretto, and augmentation/diminution
- Understand double and triple fugue

### Concepts

**Fugue Structure**
A fugue is a contrapuntal composition built from a single melody (the subject):

1. **Exposition:** Each voice enters in turn with the subject (or answer). First voice presents the subject alone. Second voice enters with the answer (subject at the dominant) while the first voice continues with the countersubject. Third and fourth voices continue the pattern.

2. **Episodes:** Transitional passages between subject entries. Built from fragments of the subject or countersubject, often as sequences. Episodes modulate to new keys for the next entry.

3. **Middle Entries:** The subject returns in various keys (relative major/minor, subdominant, etc.). Each entry is followed by an episode.

4. **Final Section:** Subject returns in the tonic key. Often includes stretto and climactic techniques. May end with a coda.

**Subject and Answer**
- Subject: the main theme, stated first in the tonic key
- Real answer: exact transposition of the subject to the dominant
- Tonal answer: modified transposition where the opening interval is adjusted to maintain tonal coherence (a 5th in the subject becomes a 4th in the answer, or vice versa). Used when the subject prominently features scale degrees 1 and 5.

**Countersubject**
A melodic line that consistently accompanies the subject. Written in invertible counterpoint so it can appear above or below the subject. A good countersubject complements the subject rhythmically and melodically.

**Stretto**
Subject entries that overlap — a new entry begins before the previous one finishes. Creates intensification and excitement. Often reserved for the climax of the fugue. The closer the entries, the tighter (and more impressive) the stretto.

**Compositional Devices**
- Augmentation: subject in longer note values (slowed down)
- Diminution: subject in shorter note values (sped up)
- Inversion: subject with all intervals reversed (ascending becomes descending)
- Retrograde: subject played backwards (rare in fugues)

**Double and Triple Fugue**
- Double fugue: two subjects, either presented together from the start or introduced separately and combined later
- Triple fugue: three subjects combined. Bach's Art of Fugue and the unfinished final fugue are the supreme examples.

### Interactive Exercises
- **Fugue map:** Given a fugue recording → identify exposition, episodes, middle entries, stretto
- **Subject/answer comparison:** Hear the subject, then the answer → identify real vs. tonal
- Primarily analytical/listening

### App Mapping
- Beyond current engine capabilities
- Would need multi-voice notation playback
- Audio examples from the canon could be used (public domain Bach fugues)
- Best taught as an analytical module with guided listening

---

## 8.2 Canon and Other Imitative Forms

### Learning Objectives
- Understand canon at various intervals (unison, octave, 5th, 4th, etc.)
- Recognize special canon types (inversion, retrograde, augmentation/diminution)
- Know the difference between strict canon and free imitation
- Identify the round as a subset of canon

### Concepts

**Strict Canon**
One voice (the leader/dux) presents a melody. A second voice (the follower/comes) enters after a time delay, repeating the melody exactly (transposed by some interval). The challenge: the leader must create a melody that produces valid harmony with the delayed copy of itself.

**Canon at Various Intervals**
- Canon at the unison: the follower enters on the same pitch
- Canon at the octave: the follower enters an octave above/below
- Canon at the 5th: the follower enters a fifth higher/lower
- Canon at the 4th: a fourth higher/lower
- Any interval is possible; the further from unison, the more challenging

**Special Canon Types**
- Canon by inversion (mirror canon): the follower inverts all intervals
- Canon by retrograde (crab canon): the follower plays the melody backwards
- Canon by augmentation: the follower plays at half speed
- Canon by diminution: the follower plays at double speed
- Combination canons: inversion + retrograde, etc.

**The Round**
A perpetual canon at the unison — all voices sing the same melody, entering at regular intervals, and the music loops. "Row, Row, Row Your Boat," "Frere Jacques." The simplest form of canon.

**Ricercar**
A predecessor to the fugue — an imitative composition, often more free than a strict fugue. The subject is treated in imitation but without the formal exposition-episode-entry structure.

### Interactive Exercises
- **Canon explorer:** Hear a melody, then hear it as a canon at different intervals
- **Canon type identifier:** Hear a canon → identify the type (inversion, retrograde, etc.)
- Primarily analytical/listening

### App Mapping
- Limited app interactivity potential
- Could demonstrate canonic imitation with two-voice piano playback (delayed second voice)

---

## 8.3 Large Form Analysis

### Learning Objectives
- Analyze sonata form in depth (with all sub-sections)
- Understand concerto form (double exposition)
- Analyze variation forms (theme and variations, chaconne, passacaglia)
- Identify rondo forms (5-part, 7-part) and ritornello form

### Concepts

**Sonata Form in Depth**
Expanding on Level 5's introduction:

*Exposition:*
- First theme group (FTG): tonic key, establishes character
- Transition (TR): modulates from tonic to secondary key (usually V in major, III in minor)
- Second theme group (STG): contrasting character, secondary key
- Closing theme (CT): reinforces secondary key, may be multiple closing ideas
- Medial caesura (MC): the dramatic pause between TR and STG

*Development:*
- Fragmentation: themes broken into motives
- Sequence: fragments repeated at different pitch levels
- Modulation: rapidly moving through various keys
- False recapitulation: a "fake" return of the theme in the wrong key
- Retransition: builds dominant preparation for the recapitulation

*Recapitulation:*
- FTG returns in tonic
- TR modified to stay in tonic (no modulation)
- STG in TONIC (the tonal resolution)
- CT in tonic
- Optional coda: can be extensive (Beethoven's codas are sometimes "second developments")

**Concerto Form**
Double exposition:
- Orchestral exposition: both themes in tonic
- Solo exposition: first theme in tonic, second in dominant (like a standard sonata)
- Development: solo and orchestra interplay
- Recapitulation: both themes in tonic
- Cadenza: soloist's unaccompanied passage, usually before the final coda

**Variation Forms**
- Theme and variations (sectional): theme → var.1 → var.2 → etc. Each variation is self-contained.
- Chaconne: continuous variations over a repeating harmonic pattern (typically 4 or 8 bars)
- Passacaglia: continuous variations over a repeating bass line (ground bass)
- Ground bass: the bass line repeats identically while upper voices change

**Rondo Forms**
- 5-part: A-B-A-C-A
- 7-part: A-B-A-C-A-B-A (or A-B-A-C-A-D-A)
- Sonata-rondo: combines rondo's recurring theme with sonata's developmental techniques. A-B-A-development-A-B-A.

**Ritornello Form**
Baroque orchestral form. The ritornello (a recurring orchestral passage) alternates with solo episodes. The ritornello returns in different keys. Similar in concept to rondo but more fluid.

### Interactive Exercises
- **Form timeline builder:** Listen to a movement → create a labeled timeline of sections
- **Sonata form detective:** Identify FTG, TR, STG, CT, development techniques
- Entirely analytical/listening

### App Mapping
- Beyond current app capabilities
- Best taught through guided listening with annotated score excerpts
- Could build a "form analysis" mode that displays section labels over audio playback

---

## 8.4 Orchestration and Instrumentation Awareness

### Learning Objectives
- Know the four orchestral families and their characteristics
- Identify instrument ranges and timbres
- Understand transposing instruments in orchestral context
- Recognize common orchestral doublings and textures

### Concepts

**The Four Orchestral Families**

*Strings (highest to lowest):*
Violin (G3-E7), Viola (C3-E6), Cello (C2-C6), Double Bass (E1-G4, sounds octave lower)
- Warm, sustaining, most versatile family
- Can play legato, staccato, pizzicato, tremolo, harmonics, col legno, sul ponticello

*Woodwinds (typical):*
Flute (C4-C7), Oboe (Bb3-G6), Clarinet in Bb (D3-Bb6, transposing), Bassoon (Bb1-Eb5)
Additional: Piccolo (C5-C8), English Horn in F (E3-C6, transposing), Bass Clarinet, Contrabassoon

*Brass:*
Horn in F (B1-F5, transposing), Trumpet in Bb (E3-Bb5, transposing), Trombone (E2-Bb4), Tuba (D1-F4)
- Powerful, capable of extreme dynamics, prominent in climaxes

*Percussion:*
Timpani (tuned), Snare drum, Bass drum, Cymbals, Triangle, Xylophone, Glockenspiel, Vibraphone, Marimba, Celesta, Harp (sometimes grouped separately)

**Score Order**
Standard orchestral score from top to bottom: Flutes → Oboes → Clarinets → Bassoons → Horns → Trumpets → Trombones → Tuba → Timpani → Percussion → Harp → Strings (Vln I → Vln II → Vla → Vc → Cb)

**Common Doublings and Textures**
- Octave doubling: same melody in two instruments an octave apart (flute + violin)
- Unison doubling: same pitch, different timbre (oboe + violin for warmth)
- Choir scoring: each instrument family plays a complete chord (woodwind choir, brass choir)
- Melody + accompaniment: strings sustain, winds carry the tune (or vice versa)

### Interactive Exercises
- **Instrument identifier:** Hear a solo instrument → name it
- **Range checker:** Given a passage → determine which instruments can play it
- Primarily reference/knowledge module

### App Mapping
- The synth engine uses piano/guitar sounds — not orchestral timbres
- This is knowledge-based rather than interactive
- Could add orchestral synth presets in the future

---

## 8.5 Post-Tonal Theory Introduction

### Learning Objectives
- Understand pitch class and the integer notation system (0-11)
- Calculate interval class vectors
- Find prime form and normal order of pitch-class sets
- Construct and manipulate twelve-tone rows

### Concepts

**From Tonal to Post-Tonal**
By the early 20th century, some composers abandoned the tonal system entirely. Traditional concepts (key, scale, chord, resolution) don't apply. New analytical tools were needed.

**Pitch Class**
Reduces all octave equivalents to a single class. All C's (any octave) = pitch class 0. All C#/Db's = pitch class 1. And so on through 11 (B). Now we work with 12 integers instead of note names. Enharmonic spellings are irrelevant — F# and Gb are both 6.

**Interval Class (IC)**
The "shortest distance" between two pitch classes. IC between 0 and 4 = 4 (or 8, but we take the smaller: 4). IC values range from 0 to 6. An interval and its complement (e.g., M3=4 and m6=8) map to the same IC (4).

**Pitch-Class Set**
An unordered collection of pitch classes. {0, 1, 4} = C, C#, E. Sets are the building blocks of post-tonal analysis (like chords are in tonal music, but without the tonal hierarchy).

**Normal Order**
The most compact arrangement of a set. Rotate the set to find the ordering with the smallest outer interval. {0, 4, 7} → [0, 4, 7] or [4, 7, 0] or [7, 0, 4]. The normal order is [0, 4, 7] (span of 7 semitones, the most compact).

**Prime Form**
The most reduced version of a set — starts on 0, most packed to the left. Used to identify set types across transpositions and inversions. {0, 4, 7} in prime form = [0, 3, 7] (invert and transpose to get the most compact left-packed form).

**Interval Class Vector (ICV)**
A six-number vector showing how many of each interval class a set contains. For [0, 4, 7] (major triad): <0, 0, 1, 1, 1, 0>. This fingerprint identifies the interval content of any set.

**Forte Numbers**
Allen Forte's catalog assigns each unique prime form a number: 3-11 = [0, 3, 7] (major/minor triad). This classification system is the standard reference.

**Twelve-Tone Technique (Serialism)**
Schoenberg's system: arrange all 12 pitch classes in a specific order (the tone row). The row is the raw material for the entire composition.

**Four Row Forms:**
- Prime (P): the original row
- Retrograde (R): the row backwards
- Inversion (I): each interval flipped (ascending → descending)
- Retrograde Inversion (RI): inversion played backwards

Each form can be transposed to start on any pitch class (P0 through P11, I0 through I11, etc.). Total: 48 row forms available.

**Twelve-Tone Matrix**
A 12x12 grid showing all 48 forms. P forms read left to right. R forms read right to left. I forms read top to bottom. RI forms read bottom to top. The matrix is the complete toolkit for a serial composition.

**Combinatoriality**
A row property where the first hexachord (first 6 notes) of one form and the first hexachord of another form together produce all 12 pitch classes. This ensures harmonic completeness when two row forms are combined.

### Interactive Exercises
- **Pitch class calculator:** Given note names → convert to pitch class integers
- **Normal order finder:** Given a pitch-class set → calculate normal order
- **Prime form calculator:** Given a set → find prime form and Forte number
- **Row builder:** Construct a twelve-tone row → generate all 48 forms
- **Matrix generator:** Build a 12-tone matrix from a row

### App Mapping
- None of this exists in the current engine
- Would need a new "post-tonal" module in the engine
- The piano keyboard maps naturally to pitch-class visualization (12 notes = 12 pitch classes)
- Twelve-tone matrix could be a new interactive component

---

## 8.6 Twentieth-Century and Contemporary Techniques

### Learning Objectives
- Identify quartal/quintal harmony, planing, polytonality
- Understand pandiatonicism and extended techniques
- Recognize minimalist patterns and metric modulation
- Survey aleatory, spectralism, and microtonality at awareness level

### Concepts

**Quartal and Quintal Harmony (Expanded)**
Beyond the modal context (Level 7): quartal/quintal structures as a complete harmonic language. Entire passages built exclusively from fourths and fifths. Bartok, Hindemith, Copland use quartal harmony structurally.

**Planing (Parallel Harmony)**
All voices move in parallel by the same interval:
- Chromatic planing: every note moves by the same number of half steps (exact transposition)
- Diatonic planing: every note moves by the same scale step (intervals change)
- Real planing: uses accidentals outside the key
- Tonal planing: stays within the key

**Polytonality / Bitonality**
Two or more keys sounding simultaneously. Milhaud's signature technique. Right hand in C major, left hand in F# major. Creates a rich, complex sonority that is not fully tonal but not atonal either.

**Polymodality**
Two or more modes sounding simultaneously, sharing the same tonic. C Lydian in the melody + C Mixolydian in the accompaniment = all notes of C major, but with different modal inflections in different voices.

**Pandiatonicism**
Using all notes of a diatonic scale freely, without functional harmonic rules. Any combination of notes from the scale is acceptable. Stravinsky's "Petrushka" uses this. Sounds tonal but without traditional resolution.

**Metric Modulation**
Changing tempo by reinterpreting a rhythmic value. A triplet eighth note in the old tempo becomes a regular eighth note in the new tempo (tempo increases by 3:2). Elliott Carter's hallmark technique. Creates precise, calculated tempo changes.

**Minimalism**
Repetitive structures that evolve gradually:
- Phase shifting: two identical patterns gradually go out of sync (Steve Reich)
- Additive process: notes are added one at a time to a pattern (Philip Glass)
- Pulse-based: steady rhythmic pulse with slowly evolving harmony

**Aleatory (Chance Music)**
Elements left to chance or performer choice:
- Cage's chance operations (I Ching, coin tosses)
- Controlled aleatory: performer chooses from options (Lutoslawski, Boulez)
- Mobile form: sections played in any order (Stockhausen)

**Extended Techniques (Awareness)**
- Prepared piano: objects placed on/between strings
- Multiphonics: producing multiple pitches on a single instrument
- Bowing techniques: sul ponticello, col legno, harmonics
- Vocal techniques: sprechstimme, overtone singing

**Microtonality (Awareness)**
- Quarter tones: dividing the half step in two
- Just intonation: intervals tuned to pure frequency ratios
- Spectral tuning: intervals derived from the overtone series
- 19-TET, 31-TET, 53-TET: equal divisions other than 12

### Interactive Exercises
- **Technique identifier:** Hear examples → classify (planing, polytonality, minimalism, etc.)
- **Quartal stack builder:** Build quartal chords on the piano
- **Phase pattern demo:** Hear two patterns gradually shift out of phase
- Primarily listening/recognition

### App Mapping
- Quartal stacks can be built on the piano
- Planing can be demonstrated by transposing chords chromatically
- Minimalist patterns could be built with the audio engine (looping)
- Most of this level is conceptual/listening

---

## 8.7 Advanced Rhythm and Meter

### Learning Objectives
- Execute and hear complex tuplets and cross-rhythms
- Understand polyrhythm vs. polymeter
- Recognize hemiola and metric modulation
- Survey additive and irrational rhythms

### Concepts

**Complex Tuplets**
Beyond triplets: quintuplets (5 in the space of 4), septuplets (7 in the space of 4 or 6), and nested tuplets (triplets within triplets). These create extremely fine rhythmic gradations.

**Cross-Rhythms**
Two different rhythmic groupings sounding simultaneously:
- 3 against 2: one voice plays 3 even notes while another plays 2 (or vice versa)
- 4 against 3: one plays 4, the other 3
- 5 against 4, 7 against 4, etc.
These create rhythmic tension and complexity. Common in African music, Brahms, Chopin.

**Polyrhythm vs. Polymeter**
- Polyrhythm: different rhythmic groupings within the SAME meter (3 against 2 in 4/4)
- Polymeter: different meters sounding simultaneously (one voice in 3/4, another in 4/4)
Polyrhythm maintains a shared downbeat; polymeter does not (downbeats diverge).

**Hemiola**
A specific 3-against-2 pattern at the bar level: in 3/4 time, two bars of 3/4 are grouped as three groups of 2 (or in 6/8, two groups of 3 reinterpreted as three groups of 2). Extremely common in Baroque music (Handel), Brahms, and Latin music.

**Metric Modulation (Expanded)**
Types of metric modulation:
- Simple: triplet becomes new beat (tempo ratio 3:2)
- Complex: quintuplet becomes new beat (ratio 5:4)
- Chain: multiple metric modulations in sequence
- Notation: the old and new note values are shown as equivalent

**Additive Rhythms**
Patterns built from unequal groups: 2+2+3, 3+2+2+3, etc. Common in:
- Balkan music (aksak patterns)
- Progressive rock (Tool, Meshuggah)
- 20th-century classical (Bartok, Stravinsky)

**Irrational Time Signatures**
Time signatures with denominators that aren't powers of 2: 4/3 (four third-notes per bar), 5/6 (five sixth-notes). Rare but used by Boulez, Ferneyhough. They indicate tempo relationships, not traditional beat divisions.

### Interactive Exercises
- **Cross-rhythm clapper:** Tap 3 against 2 (one hand each)
- **Hemiola spotter:** Hear a passage → identify the hemiola
- **Polyrhythm builder:** Layer two different rhythmic patterns
- Primarily rhythmic/aural

### App Mapping
- No rhythm system exists
- Cross-rhythms and polyrhythms could be demonstrated with the audio engine (two concurrent patterns)
- Advanced rhythmic concepts are primarily aural/conceptual

---

## Module Breakdown for Implementation

| Module ID | Topic | Interactive Elements |
|-----------|-------|---------------------|
| L8M01 | Fugue: Exposition and Subject/Answer (8.1) | Fugue map, guided listening |
| L8M02 | Fugue: Episodes, Stretto, and Devices (8.1) | Subject/answer comparison |
| L8M03 | Canon and Imitative Forms (8.2) | Canon explorer |
| L8M04 | Sonata Form in Depth (8.3) | Form timeline builder |
| L8M05 | Variation, Rondo, and Ritornello Forms (8.3) | Form identification |
| L8M06 | Orchestration Awareness (8.4) | Instrument identifier |
| L8M07 | Pitch-Class Sets and Set Theory (8.5) | PC calculator, prime form finder |
| L8M08 | Twelve-Tone Technique (8.5) | Row builder, matrix generator |
| L8M09 | 20th-Century Techniques: Planing, Polytonality, Pandiatonicism (8.6) | Technique identifier |
| L8M10 | Minimalism, Aleatory, and Extended Techniques (8.6) | Phase pattern demo |
| L8M11 | Advanced Rhythm: Polyrhythm, Hemiola, Metric Modulation (8.7) | Cross-rhythm clapper, polyrhythm builder |
