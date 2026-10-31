# Level 7: Jazz, Pop, Modal & Extended Systems

> **SUPERSEDED planning document — do not teach or build from it.**
> This was the pre-implementation spec for Level 7. It is not shipped and is
> not maintained. The app's Level 7 content lives in
> `src/core/constants/curriculumL7.ts` (EN) and the PT/ES overlays under
> `src/i18n/content/`; where the two disagree, the shipped `.ts` is right.
> The 2026-10-30 audit found theory errors and dead references here that the
> shipped lessons get right (C-78: e.g. "Eb triad over C7 = C7#9b13", Andalusian cadence as i-bVI-bIII-bVII, references to non-existent progressionPatterns.ts / modes.ts); they are deliberately left
> uncorrected (decision D-24, ledger W9-26).

**Difficulty:** Advanced
**Prerequisites:** Level 6 complete
**Equivalence:** ABRSM Grade 7-8, RCM Level 9-10, Berklee Harmony 3-4
**Estimated Modules:** 14-16

---

## 7.1 Jazz Chord Symbol System

### Learning Objectives
- Read and write jazz chord symbols fluently
- Understand extensions (9th, 11th, 13th) and alterations (b9, #9, #11, b13)
- Build added-tone and suspended chords in jazz context
- Map chord symbols to voicings on piano and guitar

### Concepts

**The Chord Symbol System**
Jazz uses a letter-based system instead of Roman numerals:
- Root letter: C, D, E, F, G, A, B (with # or b)
- Quality: maj7 (or Δ7), m7 (or -7), 7 (dominant), ø7 (half-dim), o7 (fully dim)
- Extensions: 9, 11, 13 (imply all lower extensions)
- Alterations: b9, #9, #11, b13, b5, #5
- Added tones: add9, add11 (don't imply 7th)
- Suspensions: sus4, sus2, 7sus4

**Extensions**
Extensions are chord tones beyond the seventh, built by continuing to stack thirds:
- 9th = octave + 2nd (2 semitones above the octave)
- 11th = octave + 4th (5 semitones above the octave)
- 13th = octave + 6th (9 semitones above the octave)

Key rule: a chord symbol with 13 implies 7th, 9th, and 13th are present (11th is usually omitted in major/dominant chords because it clashes with the 3rd).

**Alterations**
Chromatically modified extensions:
- b9: darkens the chord, common on V7 resolving to minor
- #9: the "Hendrix chord" — bluesy, aggressive. Actually a minor third above the root.
- #11: replaces the natural 11 to avoid clashing with the major 3rd. Lydian sound.
- b13: replaces the natural 13. Creates an altered dominant sound. Enharmonic with #5.

**The "alt" Chord**
C7alt = dominant seventh with ALL altered extensions (b9, #9, b5/#11, b13/#5). The most chromatic dominant chord. Resolves to the target with maximum tension release. Pairs with the altered (super Locrian) scale.

**Shell Voicings**
The minimum notes for a jazz chord: root, 3rd, 7th. The 3rd and 7th define the chord quality; the root names it. Extensions are added on top. Shell voicings are the starting point for jazz piano and guitar comping.

### Interactive Exercises
- **Chord symbol reader:** Given a symbol like "Dm9" → build it on the piano
- **Extension builder:** Start with a seventh chord → add 9th, 11th, 13th one at a time
- **Shell voicing practice:** Given a chord → play root-3rd-7th (left hand), add extensions (right hand)
- **Try This:** "Cmaj9", "Dm11", "G13", "C7alt"

### App Mapping
- Extended chords (9, 11, 13) exist in `core/constants/chords.ts`
- Altered chords (7b9, 7#9, 7#11, etc.) exist in the engine
- Chord parser handles all these symbols
- This maps directly to existing infrastructure

---

## 7.2 Jazz Progressions

### Learning Objectives
- Master the ii-V-I progression in major and minor
- Apply tritone substitution
- Understand the blues form (12-bar, jazz blues, minor blues)
- Recognize rhythm changes and standard jazz forms
- Build turnarounds

### Concepts

**The ii-V-I Progression**
The foundational jazz progression:
- **Major ii-V-I:** Dm7 → G7 → Cmaj7 (ii-7 → V7 → Imaj7)
- **Minor ii-V-i:** Dø7 → G7b9 → Cm7 (iiø7 → V7b9 → i-7)

In jazz, virtually every harmonic motion can be broken down into ii-V-I units. Songs are analyzed as chains of ii-V-I progressions, some complete, some partial (ii-V with no I, or just V-I).

**Related ii-V Pairs**
Every V7 chord can be preceded by its related ii chord. This "prepares" the dominant and creates smoother motion. In a progression: Cmaj7 → A7 → Dm7 → G7 → Cmaj7, the A7 is V7/ii, and Dm7 is its related ii.

**Tritone Substitution**
Replace any dominant seventh chord with the dominant seventh a tritone away. G7 → C becomes Db7 → C. Why? G7 (G-B-D-F) and Db7 (Db-F-Ab-Cb) share the same tritone (B-F = Cb-F). The tritone is the engine of resolution; the root and fifth are less critical. The chromatic bass motion (Db → C) is smoother than the fifth motion (G → C).

**Tritone Sub with Related ii**
Add the ii of the substituted dominant: Dm7 → Db7 → Cmaj7 (ii → bII7 → I). Or: Abm7 → Db7 → Cmaj7 (bvi-7 → bII7 → I). Creates a chromatic bass descent.

**Back-Door Dominant**
bVII7 → I. In C: Bb7 → Cmaj7. The bVII7 approaches the tonic from a whole step below instead of a fifth above. Common in jazz standards. The 3rd of bVII7 (D) and the 7th (Ab) resolve to the 3rd and root of I.

**Blues Form**

12-bar blues (basic):
```
| I7  | I7  | I7  | I7  |
| IV7 | IV7 | I7  | I7  |
| V7  | IV7 | I7  | V7  |
```

Jazz blues (with ii-V's and tritone subs):
```
| I7     | IV7    | I7     | I7     |
| IV7    | #IVo7  | I7     | vi7    |
| ii7    | V7     | I7 vi7 | ii7 V7 |
```

Minor blues:
```
| i7     | i7     | i7     | i7     |
| iv7    | iv7    | i7     | i7     |
| bVI7   | V7     | i7     | V7     |
```

**Rhythm Changes**
Based on "I Got Rhythm" (Gershwin). 32-bar AABA form:
- A sections: I-vi-ii-V turnaround pattern
- B section (bridge): cycle of dominants (III7 → VI7 → II7 → V7)
- One of the most common jazz vehicles for improvisation

**Turnarounds**
A short progression (usually 2 bars) at the end of a section that circles back to the beginning:
- I → vi → ii → V (basic)
- I → bIII7 → bVI7 → bII7 (chromatic)
- I → #Io7 → ii → V (diminished approach)
- iii → VI7 → ii → V (with secondary dominant)

### Interactive Exercises
- **ii-V-I builder:** Build ii-V-I in every key (major and minor)
- **Tritone sub spotter:** Hear a progression → identify the tritone substitution
- **Blues form builder:** Construct a jazz blues from the basic 12-bar template
- **Turnaround practice:** Play through common turnarounds in multiple keys
- **Try This:** "ii V I in C", "ii V I in F minor"

### App Mapping
- `progressionPatterns.ts` already has ii-V-I, blues progressions, rhythm changes
- Progression parser handles these patterns
- Chord-scale relationships map every chord to appropriate scales
- This is CORE to the app's existing strength

---

## 7.3 Jazz Harmony — Advanced

### Learning Objectives
- Apply chord-scale theory (matching scales to chord symbols)
- Use upper-structure triads for voicing
- Understand Coltrane changes (Giant Steps matrix)
- Apply reharmonization techniques
- Build polychords and slash chords

### Concepts

**Chord-Scale Theory (Complete)**
Every chord implies one or more scales. The scale provides the available note palette for melody and improvisation:

| Chord Quality | Primary Scale | Alternatives |
|--------------|--------------|-------------|
| maj7 | Ionian (major) | Lydian (#11 color) |
| m7 | Dorian | Aeolian, Phrygian |
| 7 (dominant) | Mixolydian | Lydian dominant, altered, whole-tone, dim H-W |
| ø7 | Locrian | Locrian nat.2 |
| o7 | Diminished W-H | — |
| m(maj7) | Melodic minor | Harmonic minor |
| 7alt | Altered (Super Locrian) | — |
| 7sus4 | Mixolydian | Dorian |

**Upper-Structure Triads**
A voicing technique: play a simple triad in the right hand over a bass note + guide tones in the left hand. The triad creates specific extensions:
- D triad over C7 = C13#11 (D-F#-A over C-E-Bb)
- Eb triad over C7 = C7#9b13 (Eb-G-Bb over C-E)
- The upper triad is selected for its extensions, not its own identity

**Coltrane Changes (Giant Steps)**
John Coltrane's innovation: chord progressions that cycle through three major keys separated by major thirds (dividing the octave into three equal parts):
- Bmaj7 → D7 → Gmaj7 → Bb7 → Ebmaj7 → F#7 → Bmaj7
- Three key centers: B, G, Eb (major thirds apart)
- Each key is approached by its V7
- Extremely challenging to improvise over — requires thinking in three keys simultaneously

**Reharmonization**
Replacing the original chords of a melody with different chords that still support the melody notes:
- Substitute chords within the same function
- Add secondary dominants, tritone subs, passing diminished chords
- Use chromatic bass motion
- Apply modal interchange
- The melody notes become different extensions of the new chords

**Polychords and Slash Chords**
- Slash chord: chord/bass note. C/E = C major with E in bass (first inversion). D/C = D triad over C bass (creates Cmaj9 sound).
- Polychord: two independent triads stacked. D/C (or D over C) — the upper triad and lower triad function together as one complex sonority.

**Constant Structure**
Moving the same chord quality chromatically or by some pattern regardless of key:
- Cmaj7 → Dbmaj7 → Dmaj7 → Ebmaj7 (ascending major sevenths)
- The voice leading is parallel (planing), creating a modern jazz color

### Interactive Exercises
- **Chord-scale matcher:** Given a chord → select the appropriate scale(s)
- **Upper structure explorer:** Given a dominant chord → try different upper triads → hear the extensions
- **Reharmonization workshop:** Given a simple melody + basic chords → reharmonize with richer chords
- **Try This:** Explore chord-scale relationships using the existing engine

### App Mapping
- `chordScaleRelationships.ts` is EXACTLY this topic — fully built
- Slash chord parser exists
- All chord/scale combinations can be displayed on piano and fretboard
- This is where the engine shines — maximum interactivity

---

## 7.4 Modal Harmony

### Learning Objectives
- Compose and analyze harmony that avoids V-I (preserving modal quality)
- Identify the characteristic tone of each mode and use it in chord choices
- Build modal chord progressions for each mode
- Understand quartal and quintal voicings in modal context

### Concepts

**Modal vs. Tonal**
In tonal music, the V → I relationship defines the key. In modal music, V → I is AVOIDED because it pulls the ear toward major/minor tonality, destroying the modal color. Modal harmony uses different chord relationships to establish the tonic.

**Characteristic Tones**
Each mode has one note that distinguishes it from major or natural minor — the "avoid" note in tonal thinking, but the ESSENTIAL note in modal thinking:
- Dorian: raised 6th (compared to natural minor)
- Phrygian: lowered 2nd (compared to natural minor)
- Lydian: raised 4th (compared to major)
- Mixolydian: lowered 7th (compared to major)
- Aeolian: lowered 6th and 7th (compared to major)
- Locrian: lowered 2nd and 5th (compared to natural minor)

**Modal Chord Progressions**

| Mode | Key Chords | Avoid | Example |
|------|-----------|-------|---------|
| Dorian (i) | i, II, IV, bVII | V (don't use dominant) | Dm → Em → C → Dm |
| Phrygian (i) | i, bII | V, IV (too tonal) | Em → F → Em |
| Lydian (I) | I, II, vii | IV (b/c it's diminished) | C → D → Bm → C |
| Mixolydian (I) | I, bVII, v | vii° (too diminished) | G → F → Dm → G |
| Aeolian (i) | i, bVI, bVII, bIII | V (makes it harmonic minor) | Am → F → G → Am |

**Quartal Voicings**
Chords built in fourths instead of thirds. Ambiguous — they don't clearly point to major or minor. This ambiguity is perfect for modal music. A quartal voicing on D: D-G-C-F. Could be Dm7, Dm11, or just a floating quartal sound. McCoy Tyner's signature voicing.

**Quintal Voicings**
Built in fifths: D-A-E-B. Open, spacious sound. Closely related to quartal (a quintal voicing is an inverted quartal voicing). Common in 20th-century classical and modal jazz.

**Pedal Point and Drone**
Modal music often uses a sustained bass note (drone) or pedal point. This anchors the mode to a tonic without needing harmonic motion. Indian classical music is entirely based on a drone. Miles Davis used pedal points extensively in modal jazz.

**Ostinato-Based Modal Harmony**
A short, repeating bass pattern (ostinato) provides the harmonic foundation. The upper voices are free to explore the mode. This is a fundamental technique in funk, fusion, and film music.

### Interactive Exercises
- **Modal chord builder:** Select a mode → see which chords support it → build progressions
- **Characteristic tone highlighter:** Highlight the one note that defines each mode
- **Modal vs tonal comparison:** Hear the same melody over modal vs tonal harmony
- **Quartal voicing builder:** Build quartal stacks on the piano
- **Try This:** "D dorian", "E phrygian", "F lydian", "G mixolydian"

### App Mapping
- All 7 modes fully defined in `core/constants/modes.ts` with characteristic intervals
- Mode display on piano and fretboard works
- `chordScaleRelationships.ts` maps modes to chord contexts
- The existing color system (functional degree colors) could add modal degree highlighting

---

## 7.5 Contemporary / Pop Harmony

### Learning Objectives
- Analyze common pop progressions and their variations
- Use the Nashville Number System
- Understand loop-based harmony and its constraints
- Apply chromatic mediants, modal mixture, and planing in pop/rock contexts

### Concepts

**The Nashville Number System**
A simplified Roman numeral system used by session musicians:
- Numbers 1-7 represent scale degrees (like Roman numerals)
- Major chords: plain numbers (1, 4, 5)
- Minor chords: dash (2-, 6-)
- Seventh chords: superscript 7 (57)
- Key is stated once, everything else is relative
- Allows instant transposition (just change the key)

**Common Pop Progressions**

| Progression | RN | Feel |
|------------|-----|------|
| I-V-vi-IV | Axis | Uplifting, anthemic |
| vi-IV-I-V | Sensitive | Emotional, modern pop |
| I-IV-vi-V | Pop-rock | Driving, optimistic |
| I-vi-IV-V | 50s | Classic, nostalgic |
| I-bVII-IV | Mixolydian | Bluesy, rock |
| i-bVI-bIII-bVII | Andalusian | Dark, cinematic |
| I-iii-IV-V | 80s | Soaring |
| I-IV | Plagal shuttle | Dreamy, hypnotic |
| I-V | Power shuttle | Energetic, simple |

**Loop-Based Harmony**
Modern pop/electronic music often uses 2-4 chord loops that repeat throughout an entire section (or song). The loop IS the harmony. Variation comes from melody, lyrics, production, and arrangement — not harmonic progression. This is a fundamentally different approach from classical harmonic thinking.

**Modal Mixture in Pop**
Borrowed chords are everywhere in pop:
- Minor iv in a major key (replacing IV): the "heartbreak" sound
- bVI and bVII: rock and cinematic staples
- I → bIII → IV: the "truck driver's gear change" approach chord
- bVI → bVII → I: the Mario cadence, also common in 80s rock

**Chromatic Mediants in Film and Pop**
Film scores use major-third-related chords (chromatic mediants) for dramatic key shifts:
- C major → Ab major (down a M3): sudden darkening
- C major → E major (up a M3): brightening/wonder
- These appear in pop as surprise chord changes

**The "Truck Driver" Modulation**
Direct modulation up a half step (or whole step) for the final chorus. No pivot chord, no preparation — just a sudden key change. Creates energy and excitement through sheer novelty. Extremely common in pop (Whitney Houston, Bon Jovi, etc.).

**Song Form Elements**
- Intro: sets mood, establishes groove
- Verse: tells the story, often lower energy
- Pre-chorus: builds tension toward the chorus
- Chorus: the hook, highest energy, most memorable melody
- Bridge: contrast (different key, rhythm, or energy)
- Outro: winds down, often fades or repeats hook
- Interlude: instrumental break between sections
- Drop (in EDM): rhythmic/dynamic contrast after buildup

### Interactive Exercises
- **Nashville number translator:** Roman numerals → Nashville numbers (and vice versa)
- **Pop progression identifier:** Hear a 4-chord loop → identify the progression
- **Modal mixture in pop:** Hear a progression with borrowed chords → identify which chords are borrowed
- **Try This:** "I V vi IV in C", "vi IV I V in A minor"

### App Mapping
- `progressionPatterns.ts` already has many of these patterns categorized
- Progression parser handles all of these
- This maps directly to the existing "pop progression" section of the engine

---

## 7.6 Scales — Complete Taxonomy

### Learning Objectives
- Know every major scale family (diatonic, melodic minor modes, harmonic minor modes)
- Understand symmetric scales (whole-tone, diminished, augmented)
- Explore pentatonic and blues family scales
- Survey bebop and world/ethnic scales

### Concepts

**The Major Scale and Its Modes (7)**
Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian — covered in Level 2. These are the foundation.

**Modes of Melodic Minor (7)**
Starting on each degree of the ascending melodic minor scale:
1. Melodic minor (jazz minor): W-H-W-W-W-W-H
2. Dorian b2 (Phrygian #6): H-W-W-W-W-H-W
3. Lydian augmented (#4, #5): W-W-W-W-H-W-H
4. Lydian dominant (overtone scale, #4, b7): W-W-W-H-W-H-W
5. Mixolydian b6 (Hindu/Aeolian dominant): W-W-H-W-H-W-W
6. Locrian natural 2 (half-diminished scale): W-H-W-H-W-W-W
7. Altered / Super Locrian: H-W-H-W-W-W-W

**Modes of Harmonic Minor (7)**
Starting on each degree of the harmonic minor scale:
1. Harmonic minor: W-H-W-W-H-A2-H (A2 = augmented second)
2. Locrian #6: H-W-W-H-A2-H-W
3. Ionian #5 (augmented major): W-W-H-A2-H-W-H
4. Dorian #4 (Ukrainian Dorian): W-H-A2-H-W-H-W
5. Phrygian dominant (Freygish/Hijaz): H-A2-H-W-H-W-W
6. Lydian #2: A2-H-W-H-W-W-H
7. Altered dominant bb7 (Ultra Locrian): H-W-H-W-W-H-A2

**Symmetric Scales (4)**
- Chromatic: all 12 notes (H-H-H-H...)
- Whole tone: 6 notes (W-W-W-W-W-W). Only 2 unique whole-tone scales exist.
- Diminished half-whole (octatonic): 8 notes (H-W-H-W-H-W-H-W). Only 3 unique forms.
- Diminished whole-half: 8 notes (W-H-W-H-W-H-W-H). Same 3 forms, different starting point.

**Pentatonic and Blues Family (6)**
- Major pentatonic: 1-2-3-5-6 (no 4 or 7 — no half steps)
- Minor pentatonic: 1-b3-4-5-b7 (blues/rock foundation)
- Blues scale: minor pentatonic + b5 (the "blue note")
- Major blues: major pentatonic + b3
- Japanese pentatonics: Hirajoshi (1-2-b3-5-b6), In Sen (1-b2-4-5-b7)

**Bebop Scales (4)**
8-note scales that add a chromatic passing tone to a 7-note scale, ensuring chord tones fall on strong beats:
- Bebop dominant: Mixolydian + natural 7
- Bebop major: Ionian + #5
- Bebop Dorian: Dorian + natural 3
- Bebop melodic minor: melodic minor + b3

**World/Ethnic Scales (10+)**
- Double harmonic major (Byzantine/Arabic): 1-b2-3-4-5-b6-7
- Hungarian minor: 1-2-b3-#4-5-b6-7
- Hungarian major: 1-#2-3-#4-5-6-b7
- Neapolitan minor: 1-b2-b3-4-5-b6-7
- Neapolitan major: 1-b2-b3-4-5-6-7
- Persian: 1-b2-3-4-b5-b6-7
- Enigmatic: 1-b2-3-#4-#5-#6-7
- Egyptian: 1-2-4-5-b7 (suspended pentatonic)
- Iwato (Japanese): 1-b2-4-b5-b7

### Interactive Exercises
- **Scale explorer:** Select any scale family → cycle through all modes → hear and see each on piano/fretboard
- **Scale comparison:** Two scales side by side → highlight the notes that differ
- **Chord-scale matcher:** Given a chord → explore all compatible scales
- **Try This:** Any scale by name — the engine supports all of them

### App Mapping
- 46 scales already defined in `core/constants/scales.ts`
- All display on piano and fretboard
- Guitar CAGED positions exist for many scales
- This section IS the app's core strength — maximum interactivity

---

## 7.7 Chords — Complete Taxonomy

### Learning Objectives
- Catalog all chord types from triads through polychords
- Understand the construction logic (stacked thirds, quartal, etc.)
- Know when and where each chord type is used
- Build any chord from its formula

### Concepts

**Full Chord Catalog**
(See detailed listing in the overview document — 42+ chord types in the engine, covering triads, seventh chords, extended chords, altered dominants, suspensions, added tones, and power chords.)

**Special Structures**
- Quartal chords: stacked perfect fourths (D-G-C-F). Ambiguous quality, modal/jazz sound.
- Quintal chords: stacked perfect fifths (D-A-E-B). Open, spacious.
- Secundal chords / clusters: stacked seconds (C-D-E-F). Dense, dissonant, percussive.
- Polychords: two triads stacked (e.g., G triad over C triad = complex upper-structure voicing).
- Mystic chord (Scriabin): C-F#-Bb-E-A-D. Built from augmented fourth + two perfect fourths + two whole steps.

### Interactive Exercises
- **Chord builder:** Given any chord symbol → build it on the piano
- **Chord identifier:** Play any set of notes → the engine identifies the chord
- **Voicing explorer:** Same chord, different voicings → compare the sound
- **Try This:** Any chord by name or symbol

### App Mapping
- 42 chord types in the engine, all with semitone formulas
- `reverseChordParser.ts` identifies chords from note sets
- `algorithmicChordBuilder.ts` builds chords from any root + quality
- Guitar voicings in `guitarChordShapes.ts`
- Maximum interactivity — this IS the app

---

## Module Breakdown for Implementation

| Module ID | Topic | Interactive Elements |
|-----------|-------|---------------------|
| L7M01 | Jazz Chord Symbols and Extensions (7.1) | Chord symbol reader, extension builder |
| L7M02 | Shell Voicings and Altered Chords (7.1) | Shell voicing practice |
| L7M03 | The ii-V-I Progression (7.2) | ii-V-I builder in all keys |
| L7M04 | Tritone Substitution (7.2) | Tritone sub spotter |
| L7M05 | Blues Forms (7.2) | Blues form builder |
| L7M06 | Rhythm Changes and Turnarounds (7.2) | Turnaround practice |
| L7M07 | Chord-Scale Theory (7.3) | Chord-scale matcher |
| L7M08 | Upper Structures and Reharmonization (7.3) | Upper structure explorer |
| L7M09 | Coltrane Changes and Advanced Jazz Harmony (7.3) | Giant Steps analysis |
| L7M10 | Modal Harmony Fundamentals (7.4) | Modal chord builder |
| L7M11 | Quartal/Quintal Voicings and Drones (7.4) | Quartal voicing builder |
| L7M12 | Pop Progressions and Nashville Numbers (7.5) | Pop progression identifier |
| L7M13 | Modal Mixture and Chromatic Mediants in Pop (7.5) | Borrowed chord identifier |
| L7M14 | Scales: Melodic Minor Modes (7.6) | Scale explorer |
| L7M15 | Scales: Harmonic Minor Modes, Symmetric, World (7.6) | Scale comparison |
| L7M16 | Complete Chord Taxonomy (7.7) | Chord builder/identifier |
