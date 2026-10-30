# Level 9: Ear Training & Aural Skills (Parallel Track)

**Difficulty:** Runs parallel to all levels (beginner through advanced)
**Prerequisites:** Level 1 for sub-levels 9.1-9.2; increases with each sub-level
**Equivalence:** Berklee Ear Training 1-4, RCM Aural Skills, AP Music Theory aural component
**Estimated Modules:** 12-16

---

## Design Note: Parallel Track Architecture

Ear training is NOT sequential after Level 8 — it runs alongside ALL other levels. Each sub-level here corresponds to the theoretical content of a specific level:

| Sub-Level | Aligns With | Focus |
|-----------|-------------|-------|
| 9.1 | Level 1 | Pitch basics, ascending/descending, major/minor recognition |
| 9.2 | Level 1-2 | Simple interval recognition |
| 9.3 | Level 2 | Scale and mode recognition |
| 9.4 | Level 2-3 | Chord quality recognition |
| 9.5 | Level 3-4 | Melodic dictation |
| 9.6 | Level 4-5 | Harmonic dictation |
| 9.7 | Level 3-6 | Sight singing / solfege |
| 9.8 | Level 5-8 | Contextual listening and analysis by ear |

Students should unlock ear training sub-levels as they progress through the corresponding theory levels.

---

## 9.1 Beginning Ear Training

### Learning Objectives
- Match pitch by singing or identifying on the piano
- Recognize ascending vs. descending melodic motion
- Distinguish high from low register
- Hear major vs. minor tonality (happy vs. sad)

### Concepts

**Pitch Matching**
The most fundamental aural skill: hear a note, reproduce it (by singing or finding it on an instrument). Start with single notes in the middle register. Then expand to higher and lower ranges. This trains the internal ear-to-voice/hand connection.

**Direction of Motion**
Can you tell if a melody goes up, down, or stays the same? This is more intuitive than it sounds — but making it conscious and precise is the goal. Play two notes: did the second go up, down, or stay the same?

**Register Identification**
High vs. low is relative. A bass clarinet's "high" is a flute's "low." Train relative register perception: is this note in the upper, middle, or lower range of the instrument?

**Major vs. Minor**
The most basic quality recognition. Major sounds bright/happy. Minor sounds dark/sad. At this stage, it's a gut feeling — the theoretical explanation (major vs. minor third) comes later.

### Interactive Exercises (High Priority for App)
- **Pitch matcher:** App plays a note → student finds it on the piano
- **Direction quiz:** App plays two notes → student indicates up/down/same
- **Major or minor:** App plays a chord or short melody → student identifies major or minor

### App Mapping
- Audio engine can play single notes and chords
- Piano provides the input interface (student clicks notes)
- Simple UI: play button + answer buttons (up/down/same, major/minor)
- Ear-training items come from the `ear_training` branch of `src/data/exercises/exerciseGenerator.ts` (there is no separate `earTrainingGenerator.ts`) — extend it for these exercises

---

## 9.2 Interval Recognition

### Learning Objectives
- Identify all simple intervals (m2 through P8) by ear, ascending and descending
- Use song associations as memory aids
- Hear intervals in harmonic (simultaneous) context
- Build speed through drill

### Concepts

**Song Associations**
A mnemonic technique: associate each interval with the opening of a well-known melody.

| Interval | Ascending Song | Descending Song |
|----------|---------------|-----------------|
| m2 | "Jaws" theme | "Joy to the World" (first 2 notes) |
| M2 | "Happy Birthday" | "Mary Had a Little Lamb" (first 2 notes) |
| m3 | "Greensleeves" | "Hey Jude" (hey-Jude) |
| M3 | "When the Saints" (oh-when) | "Swing Low" (swing-low) |
| P4 | "Here Comes the Bride" | "Born Free" |
| A4/d5 | "The Simpsons" (The-Simp) | "Blue Seven" (Sonny Rollins) |
| P5 | "Twinkle Twinkle" | first two notes of "Feelings" (Feel-ings) or the Flintstones theme (Flint-stones) |
| m6 | "The Entertainer" | "Love Story" theme |
| M6 | "My Bonnie" (my-bon) | "Nobody Knows" (no-body) |
| m7 | "Somewhere" (West Side Story) | "An American in Paris" |
| M7 | "Take On Me" (take-on) | — |
| P8 | "Somewhere Over the Rainbow" | — |

Note: Song associations are a training tool, not a permanent crutch. The goal is to internalize the interval sound directly.

**Harmonic Intervals**
Hearing intervals when both notes play simultaneously is harder than melodic (sequential) intervals. Perfect consonances (P5, P8) sound "open" and "fused." Imperfect consonances (3rds, 6ths) sound "warm." Dissonances (2nds, 7ths, tritone) sound "rough" or "tense."

**Compound Intervals**
After mastering simple intervals, extend to 9ths (octave + 2nd), 10ths (octave + 3rd), 11ths (octave + 4th). These sound like their simple counterparts but "wider."

### Interactive Exercises (High Priority for App)
- **Interval identification drill:** App plays two notes → student selects the interval name
- **Ascending and descending modes:** Toggle between ascending, descending, and harmonic intervals
- **Speed drill:** Timed interval identification — track accuracy and response time
- **Interval singing:** App shows an interval → student sings the second note → app validates with microphone (advanced)

### App Mapping
- Audio engine plays any interval
- All intervals defined in `core/constants/intervals.ts` with semitone values
- `exerciseGenerator.ts` (`ear_training`, interval mode) can generate random interval pairs
- UI: play button + multiple-choice buttons for interval names
- Consider adding difficulty levels (diatonic only → all intervals)

---

## 9.3 Scale and Mode Recognition

### Learning Objectives
- Distinguish major, natural minor, harmonic minor, and melodic minor by ear
- Identify all seven church modes
- Recognize pentatonic, blues, and whole-tone scales
- Hear the diminished scale's characteristic sound

### Concepts

**Major vs. Minor**
Building on 9.1: now identify specific minor FORMS:
- Natural minor: all diatonic, no leading tone. Sounds "folk" or "dark."
- Harmonic minor: the raised 7th creates an exotic, "Arabian" quality (augmented second between 6 and 7).
- Melodic minor: raised 6 and 7 ascending, natural descending. Smooth and jazzy.

**Modal Identification**
Each mode has a characteristic "color":
- Ionian: bright, resolved (the major sound)
- Dorian: minor but warm, jazzy (raised 6th makes it brighter than Aeolian)
- Phrygian: dark, Spanish, exotic (the b2 is unmistakable)
- Lydian: dreamy, floating, ethereal (the #4 creates lift)
- Mixolydian: bluesy, rock (the b7 makes it feel less "classical")
- Aeolian: dark, serious, folk (natural minor)
- Locrian: unstable, dark, rarely used as tonic (the b5 destroys stability)

**Training Method**
1. First: learn to hear major vs. natural minor (the basic difference)
2. Then: harmonic minor vs. melodic minor (the raised 7th, then raised 6th)
3. Then: modes that are "major-like" (Lydian, Mixolydian) vs. "minor-like" (Dorian, Phrygian)
4. Finally: all modes from any starting note

**Special Scales**
- Pentatonic major: sounds happy, open, folk/country
- Pentatonic minor: sounds bluesy, rock
- Blues scale: gritty, expressive (the added b5 is the "blue note")
- Whole tone: dreamy, floating, directionless (no half steps, no pull)
- Diminished (half-whole): tense, symmetric, jazz/film noir

### Interactive Exercises (High Priority for App)
- **Scale identification drill:** App plays a scale → student identifies the type
- **Mode comparison:** Play the same tonic with different modes → identify which mode
- **Scale singing:** App shows a scale → student plays/sings it on the piano → app validates

### App Mapping
- All scales exist in the engine (46 types)
- Audio engine can play any scale ascending/descending
- Piano and fretboard show scale patterns
- `exerciseGenerator.ts` (`ear_training`, scale mode) can generate random scale presentations
- This is where the app's existing scale infrastructure meets ear training directly

---

## 9.4 Chord Quality Recognition

### Learning Objectives
- Identify major, minor, diminished, and augmented triads by ear
- Identify all seventh chord qualities by ear
- Recognize chord inversions by their bass note
- Identify extended chords (9ths, 11ths, 13ths) — advanced

### Concepts

**Triad Quality**
- Major: bright, open, stable. The "default" chord sound.
- Minor: dark, warm, stable. Softened version of major.
- Diminished: tense, small, unstable. Wants to resolve.
- Augmented: strange, unresolved, dreamy. No clear resting point.

**Seventh Chord Quality**
- Major 7th: warm, lush, "jazz ballad." The major 7th interval is wide and smooth.
- Dominant 7th: tense, bluesy, needs resolution. The minor 7th adds grit.
- Minor 7th: mellow, smooth, "coffee shop jazz." Warm without tension.
- Half-diminished 7th: dark, yearning, "film noir." Unstable but not extreme.
- Fully diminished 7th: extremely tense, symmetric. Every note wants to move.
- Minor-major 7th: mysterious, unsettling. The clash between minor triad and major 7th.

**Inversion Recognition**
When a chord is inverted, the bass note changes the perceived character:
- Root position: grounded, strong
- First inversion: lighter, melodic bass
- Second inversion: unstable, floating (4th above the bass)
- Third inversion (7th chords): strong pull downward (7th in bass wants to resolve down)

Advanced students learn to hear the bass note independently and relate it to the root.

**Extended Chord Recognition**
- 9th chords: fuller, more colorful than 7ths
- 11th chords: wide, open (especially with #11 — Lydian sound)
- 13th chords: the richest basic voicing — contains almost all notes of the scale

### Interactive Exercises (High Priority for App)
- **Triad quality drill:** Hear a triad → identify quality
- **Seventh chord quality drill:** Hear a seventh chord → identify quality
- **Inversion identification:** Hear a triad or seventh chord → name the inversion
- **Extended chord drill:** Hear a chord → identify the highest extension (7th, 9th, 11th, 13th)
- **Speed drill:** Timed chord identification with accuracy tracking

### App Mapping
- All chord types in the engine
- Audio engine plays chords
- `exerciseGenerator.ts` (`ear_training`, chord mode) can generate random chord presentations
- `reverseChordParser.ts` can validate chord identification
- UI: play button + quality selection buttons

---

## 9.5 Melodic Dictation

### Learning Objectives
- Transcribe short diatonic melodies by ear
- Transcribe melodies with skips (triadic outlines)
- Handle chromatic tones in melodic dictation
- Perform two-part dictation (two simultaneous melodies)

### Concepts

**Melodic Dictation Process**
1. Listen to the full melody once for overall shape and key
2. Identify the meter and rhythmic framework
3. Listen again — focus on the first few notes
4. Write what you hear, building phrase by phrase
5. Listen again for details and corrections
6. Check: does your transcription make musical sense?

**Strategy: Framework First**
- Identify the key (listen for the final note — usually the tonic)
- Identify the meter (tap the beat)
- Identify the cadence (what does the ending sound like?)
- Then fill in the notes, starting with rhythm and contour

**Levels of Difficulty**
1. Stepwise diatonic in major (easiest)
2. Skips within triads (chord outlines)
3. Mixed steps and skips, diatonic
4. Minor keys (natural, harmonic, melodic)
5. Chromatic passing tones and neighbor tones
6. Chromaticism with secondary dominants
7. Two-part dictation (two voices simultaneously)

**Rhythm Dictation**
Separate from pitch: hear a rhythm → notate it. Start with simple meters (4/4, 3/4), then compound (6/8), then mixed meters.

### Interactive Exercises
- **Melodic dictation:** App plays a melody → student recreates it on the piano (or notation input)
- **Rhythm dictation:** App plays a rhythm → student taps it back
- **Contour drawing:** App plays a melody → student draws the pitch contour (up/down/same)
- **Difficulty progression:** Start with 4-note stepwise → build to 8-note chromatic

### App Mapping
- Audio engine can play melodies
- Piano provides input (student clicks notes in sequence)
- Would need a "playback and compare" system
- Rhythm input would need a dedicated tapping interface

---

## 9.6 Harmonic Dictation

### Learning Objectives
- Identify cadence types by ear
- Transcribe four-chord diatonic progressions
- Identify secondary dominants and modulations by ear
- Perform bass line dictation

### Concepts

**Harmonic Dictation Process**
1. Listen for the key (tonic chord, cadence)
2. Listen for the bass line (bass notes define harmony)
3. Identify the cadence at the end (what type?)
4. Listen for the chord quality at each change
5. Assign Roman numerals
6. Check for consistency (does the harmonic rhythm make sense?)

**Levels of Difficulty**
1. Two-chord cadences (V-I, IV-I, V-vi)
2. Four-chord diatonic progressions
3. Progressions with inversions
4. Progressions with seventh chords
5. Progressions with secondary dominants
6. Modulating passages
7. Chromatically complex passages

**Bass Line Dictation**
Often the most accessible entry point for harmonic dictation. The bass line outlines the harmonic motion. If you can hear the bass, you're most of the way to identifying the chords.

### Interactive Exercises
- **Cadence ear quiz:** Hear two chords → identify the cadence type
- **Progression dictation:** Hear a 4-chord progression → write the Roman numerals
- **Bass line dictation:** Hear a bass line → notate it
- **Harmonic dictation:** Full progression with Roman numerals, inversions, and NCTs

### App Mapping
- Progression parser can play sequences of chords
- Audio engine provides playback
- Student input: selection from Roman numeral options (multiple choice) or piano input
- `exerciseGenerator.ts` (`ear_training`, progression mode) can generate diatonic progressions from authored progression sets

---

## 9.7 Sight Singing / Solfege

### Learning Objectives
- Use movable-do solfege (do-re-mi-fa-sol-la-ti) for sight singing
- Sight sing in major keys with stepwise motion
- Sight sing in minor keys (with chromatic solfege: le, te)
- Perform rhythmic sight reading

### Concepts

**Solfege Systems**
- **Movable do:** "Do" always = tonic, regardless of key. Syllables indicate scale degree function. Accidentals use chromatic solfege (di, ri, fi, si, li for sharps; ra, me, se, le, te for flats).
- **Fixed do:** "Do" always = C, "Re" always = D, etc. Common in France and Italy. Syllables indicate absolute pitch.
- **Scale degree numbers:** 1-2-3-4-5-6-7. Sharps indicated by raised arrow, flats by lowered.

This curriculum uses **movable do** (the Kodaly/Berklee approach) — it reinforces functional hearing.

**The Solfege Syllables (Major)**
do - re - mi - fa - sol - la - ti - do

**Chromatic Solfege**
Ascending (sharps): do - di - re - ri - mi - fa - fi - sol - si - la - li - ti - do
Descending (flats): do - ti - te - la - le - sol - se - fa - mi - me - re - ra - do

**Minor Key Solfege**
For natural minor (la-based): la - ti - do - re - mi - fa - sol - la
For natural minor (do-based): do - re - me - fa - sol - le - te - do
Harmonic minor (do-based): do - re - me - fa - sol - le - ti - do

**Sight Reading Process**
1. Identify the key and time signature
2. Scan for the highest and lowest notes (range)
3. Look for patterns (scales, arpeggios, repeated motifs)
4. Set a tempo (slow enough to maintain accuracy)
5. Sing through, maintaining steady pulse

### Interactive Exercises
- **Solfege trainer:** App shows a note on the staff → student sings the solfege syllable → app validates pitch
- **Sight singing practice:** App displays a melody → student sings it → app checks accuracy
- **Rhythm reading:** App displays a rhythm → student taps it

### App Mapping
- Would need microphone input for pitch validation (browser Web Audio API supports this)
- Staff notation display needed
- A significant new feature set — but extremely valuable for a music education app

---

## 9.8 Contextual Listening

### Learning Objectives
- Identify texture (monophonic, homophonic, polyphonic) by ear
- Identify form by ear (binary, ternary, rondo, sonata)
- Identify instruments/timbres
- Assign music to style periods

### Concepts

**Texture Identification**
Listen for:
- Monophony: a single line, no accompaniment. Clean, exposed.
- Homophony: one clear melody with supporting harmony. Most common.
- Polyphony: multiple independent melodies. Dense, complex.
- Homorhythm: all voices in the same rhythm (chorale-style).

**Form by Ear**
Listen for:
- Repetition vs. contrast (same material = A, different material = B)
- Return of opening material (ABA or rondo)
- Sectional boundaries (cadences, pauses, tempo changes)
- Key changes (moving away from tonic and returning)

**Instrument/Timbre Identification**
Distinguishing instruments by their timbre (tone color). Violin vs. viola, trumpet vs. trombone, flute vs. clarinet. Each instrument has a unique overtone profile.

**Style Period Identification**
Recognize the general era of a piece:
- Baroque (1600-1750): continuous rhythm, basso continuo, ornamentation, terraced dynamics
- Classical (1750-1820): balanced phrases, Alberti bass, clear cadences, elegant simplicity
- Romantic (1820-1900): expanded orchestra, chromatic harmony, long melodies, dynamic extremes
- 20th Century (1900-2000): dissonance, new sounds, rhythmic complexity, formal experimentation

### Interactive Exercises
- **Texture quiz:** Hear a passage → identify the texture
- **Form listener:** Hear a short piece → map the form
- **Era identifier:** Hear excerpts → assign to style period
- Primarily listening/recognition

### App Mapping
- Requires audio example library (could use royalty-free recordings or generated examples)
- Quiz interface needed
- This is the most "academic" ear training module — less instrument interaction, more critical listening

---

## Module Breakdown for Implementation

| Module ID | Topic | Interactive Priority |
|-----------|-------|---------------------|
| L9M01 | Pitch Matching and Direction (9.1) | HIGH — core ear training |
| L9M02 | Major vs Minor Recognition (9.1) | HIGH — fundamental |
| L9M03 | Interval Recognition: P1-P5 (9.2) | HIGH — most requested feature |
| L9M04 | Interval Recognition: m6-P8 (9.2) | HIGH — completes interval set |
| L9M05 | Harmonic Intervals and Compounds (9.2) | MEDIUM |
| L9M06 | Scale Recognition: Major and Minor Forms (9.3) | HIGH — leverages existing engine |
| L9M07 | Scale Recognition: Modes (9.3) | HIGH — leverages existing engine |
| L9M08 | Scale Recognition: Pentatonic, Blues, Symmetric (9.3) | MEDIUM |
| L9M09 | Triad Quality Recognition (9.4) | HIGH — core chord ear training |
| L9M10 | Seventh Chord Quality Recognition (9.4) | HIGH — core chord ear training |
| L9M11 | Melodic Dictation: Diatonic (9.5) | MEDIUM — needs input system |
| L9M12 | Melodic Dictation: Chromatic (9.5) | MEDIUM |
| L9M13 | Harmonic Dictation: Cadences and Progressions (9.6) | MEDIUM — needs input system |
| L9M14 | Sight Singing Fundamentals (9.7) | LOW — needs microphone input |
| L9M15 | Contextual Listening (9.8) | LOW — needs audio library |

### Implementation Priority
The ear training modules marked HIGH can be built with the existing audio engine + simple quiz UI. They don't require notation input or microphone — just audio playback + multiple-choice answers. These should be the first ear training features implemented.
