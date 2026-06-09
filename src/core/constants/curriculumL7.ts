import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 7, Unit 21: Jazz Harmony (6 modules)
// Covers 7.1 (Chord Symbols, Shell Voicings) and 7.2 (ii-V-I, Tritone Sub,
// Blues Forms, Rhythm Changes/Turnarounds)
// ---------------------------------------------------------------------------

const l7u21m1: CurriculumModule = {
  id: 'l7u21m1',
  unitId: 'u21',
  levelId: 'l7',
  title: 'Jazz Chord Symbols and Extensions',
  subtitle: 'The letter-based chord language of jazz — qualities, extensions, and alterations',
  objectives: [
    'Read and write jazz chord symbols fluently, including quality indicators (maj7, m7, 7, ø7, o7)',
    'Build extended chords (9th, 11th, 13th) and understand the stacking principle',
    'Distinguish between extensions (imply 7th) and added tones (no 7th)',
    'Understand how alterations (b9, #9, #11, b13) chromatically modify extensions',
  ],
  concepts: [
    {
      title: 'The Jazz Chord Symbol System',
      explanation:
        'Jazz uses a letter-based system instead of Roman numerals. A root letter (C, D, E…) is followed by a quality indicator: maj7 (or triangle) for bright and stable, m7 (or dash) for warm and dark, 7 for dominant tension, ø7 for half-diminished instability, and o7 for fully diminished symmetry. This system is universal across jazz lead sheets and fake books. Every jazz musician must read symbols at sight — the symbol IS the chord.',
      tryThisQuery: 'Cmaj7',
      tryThisLabel: 'Build Cmaj7 — the bright, stable major seventh',
    },
    {
      title: 'Extensions: 9th, 11th, 13th',
      explanation:
        'Extensions are chord tones beyond the seventh, built by continuing to stack thirds above the octave. The 9th is an octave plus a 2nd, the 11th is an octave plus a 4th, and the 13th is an octave plus a 6th. A chord symbol with 13 implies the 7th, 9th, and 13th are present — the 11th is usually omitted in major and dominant chords because the natural 11th clashes with the major 3rd. Extensions vs. added tones: Cmaj9 implies a 7th; Cadd9 does not. Each extension adds harmonic richness and specificity to the voicing.',
      tryThisQuery: 'G13',
      tryThisLabel: 'Hear G13 — extensions stacked to the 13th',
    },
    {
      title: 'Alterations: b9, #9, #11, b13',
      explanation:
        'Alterations chromatically modify extensions on dominant chords. b9 darkens the sound, common on V7 resolving to minor. #9 is the "Hendrix chord" with its bluesy bite — actually a minor third above the root, notated as an augmented 9th. #11 replaces the natural 11 for a Lydian color, avoiding the 3rd/11 clash. b13 creates a tense altered dominant sound, enharmonic with #5. These alterations give jazz musicians precise control over color and tension on any dominant chord.',
      tryThisQuery: 'C7b9',
      tryThisLabel: 'Build C7b9 — darkened dominant resolving to minor',
    },
  ],
  tasks: [
    {
      id: 'l7u21m1t1',
      instruction:
        "Type 'Cmaj9', 'Dm11', and 'G13' one after another. For each chord, identify the root, quality, and which extensions are present. Notice how maj9 implies maj7, m11 implies m7+9+11, and 13 implies 7+9+13.",
    },
    {
      id: 'l7u21m1t2',
      instruction:
        "Compare 'Cmaj9' with 'Cadd9'. The first implies a 7th (C-E-G-B-D); the second does not (C-E-G-D). This distinction — extension vs. added tone — is critical to reading jazz symbols correctly.",
    },
    {
      id: 'l7u21m1t3',
      instruction:
        "Build a dominant alteration ladder: type 'C7', then 'C7b9', then 'C7#9', then 'C7#11'. Each alteration chromatically modifies one extension while keeping the dominant shell (C-E-Bb) intact.",
    },
  ],
  prerequisites: ['l6u20m4'],
};

const l7u21m2: CurriculumModule = {
  id: 'l7u21m2',
  unitId: 'u21',
  levelId: 'l7',
  title: 'Shell Voicings and Altered Chords',
  subtitle: 'Root-3rd-7th shells, the alt chord, and suspended dominants',
  objectives: [
    'Construct shell voicings (root, 3rd, 7th) for every chord quality',
    'Understand why the shell defines the chord — extensions are color, the shell is identity',
    'Build the "alt" chord (7alt) and understand its maximum-tension role',
    'Use sus4 and 7sus4 chords as pre-resolution dominant voicings',
  ],
  concepts: [
    {
      title: 'Shell Voicings: Root, 3rd, 7th',
      explanation:
        'Shell voicings strip a chord to its essentials: root, 3rd, and 7th. These three notes define the quality — major 3rd + major 7th = maj7, minor 3rd + minor 7th = m7, major 3rd + minor 7th = dominant 7. The 5th is omitted because it adds no quality information (it is perfect in all standard chord types). Extensions are layered on top of the shell. Shell voicings are the starting point for jazz piano comping and guitar chord-melody: learn the shells, then dress them with extensions.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'Build Dm7 — hear the minor shell (D, F, C)',
    },
    {
      title: 'The Alt Chord: Maximum Chromatic Tension',
      explanation:
        'C7alt is a dominant 7th with every extension altered: b9, #9, #11 (enharmonic with b5), and b13 (enharmonic with #5). It packs the maximum chromatic tension possible before resolution — every non-shell tone is chromatically displaced. The alt chord pairs exclusively with the altered (Super Locrian) scale, which is mode 7 of melodic minor a half step above the root (C altered = Db melodic minor). This is the go-to dominant sound for resolving to minor chords in jazz.',
      tryThisQuery: 'C7alt',
      tryThisLabel: 'Build C7alt — every extension altered',
    },
    {
      title: 'Suspended Dominants: 7sus4',
      explanation:
        'The 7sus4 chord replaces the 3rd with a 4th in a dominant 7th, creating an open, unresolved sound. C7sus4 contains C-F-G-Bb — no E, so no major/minor identity. In jazz, 7sus4 functions as a pre-resolution voicing: the sus4 resolves to the 3rd, then the entire chord resolves to I. The 7sus4 also serves as a modal, Dorian-leaning sound: a 9sus chord built a perfect 5th above the root of a minor chord (the V-of-ii position, e.g. G9sus over or instead of Dm) substitutes for the ii chord — Dm11/G is a common spelling of the same sound. Sus2 works similarly, replacing the 3rd with a 2nd for a bright, open quality.',
      tryThisQuery: 'G7sus4',
      tryThisLabel: 'Hear G7sus4 — suspended dominant, no 3rd',
    },
  ],
  tasks: [
    {
      id: 'l7u21m2t1',
      instruction:
        "Build shells across qualities: type 'Cmaj7', 'Cm7', 'C7', 'Cm7b5'. In each, identify the root, 3rd, and 7th. The 3rd and 7th change — that is what makes each quality distinct.",
    },
    {
      id: 'l7u21m2t2',
      instruction:
        "Type 'C7alt' — this is a dominant 7th with all altered extensions (b9, #9, #11/b5, b13/#5). Count the chromatic notes compared to a plain C7. This chord is maximum tension before resolution.",
    },
    {
      id: 'l7u21m2t3',
      instruction:
        "Compare 'G7' with 'G7sus4' — the sus4 replaces the B (major 3rd) with C (perfect 4th). The dominant function remains (the b7 still pulls downward), but the sound is open and unresolved.",
    },
  ],
  prerequisites: ['l7u21m1'],
};

const l7u21m3: CurriculumModule = {
  id: 'l7u21m3',
  unitId: 'u21',
  levelId: 'l7',
  title: 'The ii-V-I Progression',
  subtitle: 'The foundational unit of jazz harmony — in major and minor keys',
  objectives: [
    'Master the ii-V-I progression in major keys (Dm7-G7-Cmaj7)',
    'Master the ii-V-i progression in minor keys (Dm7b5-G7b9-Cm7)',
    'Understand related ii-V pairs — every V7 can be preceded by its ii',
    'Analyze jazz standards as chains of ii-V-I units, some complete, some partial',
  ],
  concepts: [
    {
      title: 'Major ii-V-I',
      explanation:
        'The ii-V-I is the foundational unit of jazz harmony. In C major: Dm7-G7-Cmaj7. The ii chord (Dm7) acts as a pre-dominant, setting up the V7 (G7) whose tritone (B-F) creates maximum tension, resolving to Cmaj7. The voice leading is remarkably smooth: the 3rd of ii (F) becomes the 7th of V, the 7th of ii (C) steps down to the 3rd of V (B), and the tritone of V resolves inward to the root and 3rd of I. This three-chord unit drives virtually every jazz standard.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'Start the ii-V-I: play Dm7 (ii in C)',
    },
    {
      title: 'Minor ii-V-i',
      explanation:
        'The minor ii-V-i uses the half-diminished ii and an altered dominant V. In C minor: Dm7b5-G7b9-Cm7. The Dm7b5 (half-diminished) has a darker pre-dominant color than the minor 7th used in major. The G7b9 adds the b9 (Ab) — the dark, tense alteration that pulls toward a minor resolution. The b9 is the b6 of the target minor key, which is why it sounds "right" resolving to minor. Many jazz musicians use G7alt instead of G7b9 for even more chromatic tension.',
      tryThisQuery: 'Dm7b5',
      tryThisLabel: 'Build Dm7b5 — the half-diminished ii for minor',
    },
    {
      title: 'Related ii-V Pairs',
      explanation:
        'Every dominant 7th chord can be preceded by its related ii chord — the minor 7th built a perfect 4th below the dominant root (or a 5th above). This "prepares" the dominant and creates smoother voice leading. If a song has E7 resolving somewhere, you can insert Bm7 before it: Bm7-E7 is a ii-V pair. Jazz musicians chain these pairs across key centers: Bm7-E7-Am7-D7-Gmaj7 is a chain of ii-V pairs cascading through the cycle of fifths, each pair targeting the next key.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Hear G7 — the V of the ii-V-I in C',
    },
  ],
  tasks: [
    {
      id: 'l7u21m3t1',
      instruction:
        "Build a major ii-V-I in C: type 'Dm7', then 'G7', then 'Cmaj7'. Listen to the tension build from ii through V and resolve to I. The tritone in G7 (B and F) resolves inward to C and E.",
    },
    {
      id: 'l7u21m3t2',
      instruction:
        "Now build a minor ii-V-i in C minor: type 'Dm7b5', then 'G7b9', then 'Cm7'. Compare the mood — the half-diminished ii and the b9 alteration darken everything compared to the major version.",
    },
    {
      id: 'l7u21m3t3',
      instruction:
        "Chain ii-V pairs: type 'Em7', 'A7', 'Dm7', 'G7', 'Cmaj7'. This is a cascading ii-V-I where each pair targets the next — Em7-A7 targets Dm7, then Dm7-G7 targets Cmaj7. The cycle of fifths in action.",
    },
  ],
  prerequisites: ['l7u21m2'],
};

const l7u21m4: CurriculumModule = {
  id: 'l7u21m4',
  unitId: 'u21',
  levelId: 'l7',
  title: 'Tritone Substitution',
  subtitle: 'Replacing dominants a tritone away for chromatic bass motion',
  objectives: [
    'Apply tritone substitution to any dominant 7th chord',
    'Understand why tritone subs work — shared tritone interval between the two dominants',
    'Add the related ii of the substituted dominant for an even richer chromatic line',
    'Recognize the back-door dominant (bVII7-I) as a related reharmonization technique',
  ],
  concepts: [
    {
      title: 'The Tritone Substitution',
      explanation:
        'Replace any dominant 7th chord with the dominant 7th a tritone away. G7 resolving to C becomes Db7 resolving to C. This works because G7 and Db7 share the same tritone interval (B-F enharmonic to Cb-F) — the 3rd of G7 (B) becomes the 7th of Db7, and vice versa. This guide-tone swap means the pair of notes that drives the resolution stays intact. The root and fifth change, but the tritone engine stays intact. The resulting chromatic bass motion (Db down to C) is smoother than the cycle-of-fifths motion (G to C), creating a sophisticated half-step descent.',
      tryThisQuery: 'Db7',
      tryThisLabel: 'Hear Db7 — the tritone sub of G7',
    },
    {
      title: 'Tritone Sub with Related ii',
      explanation:
        'Adding the related ii of the substituted dominant creates an even richer chromatic line. The ii of Db7 is Abm7, so the full tritone-sub ii-V-I is: Abm7-Db7-Cmaj7. The bass line descends chromatically: Ab-Db-C. Compare this with the original: Dm7-G7-Cmaj7 (bass: D-G-C). Both arrive at C, but the tritone-sub path is entirely chromatic. Jazz arrangers frequently mix both approaches in the same piece.',
      tryThisQuery: 'Abm7',
      tryThisLabel: 'Build Abm7 — the related ii of the tritone sub',
    },
    {
      title: 'The Back-Door Dominant',
      explanation:
        'The back-door dominant (bVII7-I) approaches the tonic from a whole step below instead of a fifth above. In C: Bb7-Cmaj7. The 3rd of Bb7 (D) resolves up to the 3rd of Cmaj7 (E), and the 7th of Bb7 (Ab) resolves down to the 5th of Cmaj7 (G). This creates a surprising, warm resolution that avoids the expected V7-I cadence. Common in jazz standards and bossa nova, the back-door dominant is best understood as borrowed from the parallel minor — it is the dominant of bIII (Eb), arriving instead at I. Its guide tones (D and Ab) are shared with the altered home dominant (G7b9), which is why Bb7 pulls so convincingly to C: D rises to E and Ab falls to G, both upper leading tones into Cmaj7.',
      tryThisQuery: 'Bb7',
      tryThisLabel: 'Hear Bb7 — the back-door dominant in C',
    },
  ],
  tasks: [
    {
      id: 'l7u21m4t1',
      instruction:
        "Apply tritone substitution: play 'Dm7', then 'Db7', then 'Cmaj7'. The Db7 replaces G7 — same tritone (F and B/Cb), but with chromatic bass descent (D-Db-C) instead of cycle-of-fifths (D-G-C).",
    },
    {
      id: 'l7u21m4t2',
      instruction:
        "Build the full tritone-sub ii-V: play 'Abm7', then 'Db7', then 'Cmaj7'. The bass line descends Ab-Db-C — pure chromatic motion. Compare with the original Dm7-G7-Cmaj7.",
    },
    {
      id: 'l7u21m4t3',
      instruction:
        "Try the back-door dominant: play 'Bb7' then 'Cmaj7'. The Bb7 resolves UP by a whole step to C instead of DOWN by a fifth. It sounds warm and unexpected — a favorite surprise ending in jazz ballads.",
    },
  ],
  prerequisites: ['l7u21m3'],
};

const l7u21m5: CurriculumModule = {
  id: 'l7u21m5',
  unitId: 'u21',
  levelId: 'l7',
  title: 'Blues Forms',
  subtitle: 'The 12-bar blues, jazz blues, and minor blues',
  objectives: [
    'Play the basic 12-bar blues form using dominant 7th chords throughout',
    'Understand the jazz blues enrichment: ii-V insertions, tritone subs, diminished passing chords',
    'Build a minor blues form with minor 7th chords and bVI7',
    'Recognize why all chords in the blues are dominant — the pervasive tension IS the blues sound',
  ],
  concepts: [
    {
      title: 'The 12-Bar Blues',
      explanation:
        'The 12-bar blues is the most played form in jazz and popular music. It is built on three dominant 7th chords: I7 for four bars, IV7 for two, I7 for two, then V7-IV7-I7-V7 for the final four. In C: C7-C7-C7-C7 / F7-F7-C7-C7 / G7-F7-C7-G7. In classical theory, only V should be dominant, but in blues EVERY chord is dominant. That pervasive dominant tension — tritones everywhere, nothing fully resolved — IS the blues sound. Every jazz musician must navigate this form in all 12 keys.',
      tryThisQuery: 'C7',
      tryThisLabel: 'Hear C7 — the tonic chord of C blues',
    },
    {
      title: 'Jazz Blues',
      explanation:
        'Jazz blues enriches the basic 12-bar form with ii-V insertions, tritone substitutions, and diminished passing chords. A common jazz blues in C: C7 / F7 / C7 / C7 / F7 / F#dim7 / C7 / A7 / Dm7 / G7 / C7-A7 / Dm7-G7. The #IVdim7 (F#dim7) acts as a chromatic passing chord between IV7 and I7. A7 (V7/ii) pulls to Dm7, supplying the ii-V logic of bars 8–9 and the turnaround. The final four bars become a turnaround with a ii-V (Dm7-G7) that cycles back to the top. Bird blues (Charlie Parker) adds even more substitutions and ii-V chains.',
      tryThisQuery: 'F7',
      tryThisLabel: 'Build F7 — the IV7 of C blues',
    },
    {
      title: 'Minor Blues',
      explanation:
        'Minor blues substitutes minor 7th chords for the dominant I and IV, creating a darker, more melancholic feel. A standard minor blues in C: Cm7-Cm7-Cm7-Cm7 / Fm7-Fm7-Cm7-Cm7 / Ab7-G7-Cm7-G7. The bVI7 (Ab7) replaces V7 in bar 9, creating a chromatic approach to V7 (G7) in bar 10. The minor blues is the foundation of hard bop and soul jazz. The overall mood is heavier and more introspective than the major blues.',
      tryThisQuery: 'Cm7',
      tryThisLabel: 'Hear Cm7 — the tonic of C minor blues',
    },
  ],
  tasks: [
    {
      id: 'l7u21m5t1',
      instruction:
        "Build the basic blues changes: play 'C7', 'F7', 'G7'. All three are dominant 7ths — in classical theory only V should be dominant, but in blues every chord is dominant. That pervasive tension IS the blues sound.",
    },
    {
      id: 'l7u21m5t2',
      instruction:
        "Add the jazz blues passing chord: play 'F7' then 'F#dim7' then 'C7'. The diminished chord connects IV7 to I7 with a chromatic bass ascent (F-F#-G, where G is the 5th of C). This is the signature jazz blues move.",
    },
    {
      id: 'l7u21m5t3',
      instruction:
        "Build the minor blues cadence: play 'Ab7' then 'G7' then 'Cm7'. The bVI7 (Ab7) drops chromatically to V7 (G7), which resolves to the minor tonic (Cm7). This bVI7-V7-i cadence defines the minor blues sound.",
    },
  ],
  prerequisites: ['l7u21m4'],
};

const l7u21m6: CurriculumModule = {
  id: 'l7u21m6',
  unitId: 'u21',
  levelId: 'l7',
  title: 'Rhythm Changes and Turnarounds',
  subtitle: 'The AABA form, turnaround patterns, and the cycle of dominants',
  objectives: [
    'Understand rhythm changes as a 32-bar AABA form derived from "I Got Rhythm"',
    'Build turnaround patterns: I-vi-ii-V, chromatic, diminished approach',
    'Analyze the rhythm changes bridge as a cycle of dominants (III7-VI7-II7-V7)',
    'Apply turnarounds at the end of any section to create smooth harmonic cycles',
  ],
  concepts: [
    {
      title: 'Rhythm Changes',
      explanation:
        'Rhythm changes, derived from Gershwin, is one of the two most common jazz forms (the other being the blues). It is a 32-bar AABA structure. The A sections use a turnaround-based progression: I-vi-ii-V in Bb major becomes Bbmaj7-Gm7-Cm7-F7. The bridge (B section) cycles through dominants a fourth apart: D7-G7-C7-F7 (III7-VI7-II7-V7). This bridge is one of the great improvisational challenges — four different key areas in eight bars. Hundreds of jazz compositions use rhythm changes as their harmonic foundation.',
      tryThisQuery: 'Bbmaj7',
      tryThisLabel: 'Build Bbmaj7 — the tonic of rhythm changes',
    },
    {
      title: 'Turnaround Patterns',
      explanation:
        'A turnaround is a short progression (usually two bars) at the end of a section that circles back to the beginning. The basic turnaround is I-vi-ii-V: in C, Cmaj7-Am7-Dm7-G7. Variants include the chromatic turnaround (I-bIII7-bVI7-bII7: Cmaj7-Eb7-Ab7-Db7) where every chord is a tritone sub, and the diminished approach (I-#Io7-ii-V: Cmaj7-C#dim7-Dm7-G7) where the diminished chord provides a chromatic bass connection. Each turnaround creates a satisfying sense of harmonic circularity.',
      tryThisQuery: 'Am7',
      tryThisLabel: 'Hear Am7 — the vi in a C turnaround',
    },
    {
      title: 'The Cycle of Dominants',
      explanation:
        'The bridge of rhythm changes uses a cycle of dominant 7th chords moving in fourths: D7-G7-C7-F7 in Bb. Each dominant resolves to the next as if it were a V-I, but the "I" is itself a dominant chord, so the resolution is perpetually deferred. This creates forward momentum without ever landing on a stable tonic. The cycle of dominants appears throughout jazz — in bridges, intros, and transitional passages. Each dominant chord implies its own key center briefly, making it a rich arena for improvisation.',
      tryThisQuery: 'D7',
      tryThisLabel: 'Build D7 — the first dominant in the bridge cycle',
    },
  ],
  tasks: [
    {
      id: 'l7u21m6t1',
      instruction:
        "Build a turnaround in C: play 'Cmaj7', 'Am7', 'Dm7', 'G7'. This I-vi-ii-V loop is the A section of rhythm changes (transposed from Bb). Notice how the G7 at the end pulls you back to Cmaj7.",
    },
    {
      id: 'l7u21m6t2',
      instruction:
        "Build the rhythm changes bridge cycle: play 'D7', 'G7', 'C7', 'F7'. Each dominant resolves to the next by a fourth — perpetual motion. Try matching each chord to its Mixolydian scale for improvisation ideas.",
    },
    {
      id: 'l7u21m6t3',
      instruction:
        "Apply the chromatic turnaround: play 'Cmaj7', 'Eb7', 'Ab7', 'Db7'. Every chord after the I is a tritone substitution — Eb7 subs for A7, Ab7 subs for D7, Db7 subs for G7. The roots C–Eb–Ab–Db move up a minor 3rd, then up two perfect 4ths — and the final Db7 resolves down a half step to C, the chromatic payoff of the substitutions.",
    },
  ],
  prerequisites: ['l7u21m5'],
};

// ---------------------------------------------------------------------------
// Level 7, Unit 22: Advanced Jazz, Modal, and Pop (5 modules)
// Covers 7.3 (Chord-Scale Theory, Upper Structures, Coltrane) and
// 7.4 (Modal Harmony, Quartal Voicings)
// ---------------------------------------------------------------------------

const l7u22m1: CurriculumModule = {
  id: 'l7u22m1',
  unitId: 'u22',
  levelId: 'l7',
  title: 'Chord-Scale Theory',
  subtitle: 'Matching scales to chord symbols — a foundational approach to jazz improvisation',
  objectives: [
    'Map every standard chord quality to its primary and alternative scales',
    'Understand why certain scales "work" over certain chords — shared chord tones as the basis',
    'Apply chord-scale theory to analyze and improvise over ii-V-I progressions',
    'Use the altered scale for 7alt chords and Lydian dominant for 7#11 chords',
  ],
  concepts: [
    {
      title: 'The Chord-Scale Map',
      explanation:
        'Every chord implies one or more compatible scales that provide the note palette for melody and improvisation. Maj7 maps to Ionian or Lydian, m7 to Dorian (most common), Aeolian, or Phrygian. Dominant 7 maps to Mixolydian, Lydian dominant, altered, whole-tone, or diminished half-whole depending on harmonic context. Half-diminished (m7b5) maps to Locrian or Locrian natural 2. Fully diminished uses the diminished whole-half scale. The m(maj7) chord maps to melodic minor or harmonic minor. This system is the core of jazz improvisation pedagogy.',
      tryThisQuery: 'C altered scale',
      tryThisLabel: 'See the altered scale — the scale for C7alt',
    },
    {
      title: 'Dominant Chord-Scale Choices',
      explanation:
        'The dominant 7th chord has the richest set of scale choices, determined by harmonic context. Unaltered dominant (resolving normally) uses Mixolydian. Dominant with #11 uses Lydian dominant (melodic minor mode 4). Dominant resolving to minor uses altered or Phrygian dominant. Dominant with b9 in a diminished context uses diminished half-whole. Dominant with a whole-tone sound uses the whole-tone scale. The choice is not arbitrary — it depends on what the chord resolves to and which extensions are specified in the symbol.',
      tryThisQuery: 'C lydian dominant',
      tryThisLabel: 'Hear Lydian dominant — the #11 dominant sound',
    },
    {
      title: 'Chord-Scale Alignment in ii-V-I',
      explanation:
        'In a major ii-V-I in C, the chord-scale alignment is: Dm7 = D Dorian, G7 = G Mixolydian, Cmaj7 = C Ionian (or C Lydian). All three scales share the same notes — they are modes of C major. This means the improviser can think in one key across the whole progression. In minor, the alignment shifts: Dm7b5 = D Locrian nat.2, G7alt = G altered (Ab melodic minor), Cm(maj7) = C melodic minor. Now three different note pools are in play, demanding faster thinking.',
      tryThisQuery: 'D dorian',
      tryThisLabel: 'See D Dorian — the chord-scale for Dm7 in C major',
    },
  ],
  tasks: [
    {
      id: 'l7u22m1t1',
      instruction:
        "Match chord to scale: type 'Dm7' (Dorian), then 'D dorian' to see the scale. Now try 'G7' (Mixolydian) and 'G mixolydian'. The chord tones sit inside the scale — this is chord-scale alignment.",
    },
    {
      id: 'l7u22m1t2',
      instruction:
        "Explore the altered dominant: type 'C altered scale', then 'C7alt'. Every note of the chord is contained in the scale. To find any altered scale quickly: play melodic minor a half step above the root (C altered = Db melodic minor).",
    },
    {
      id: 'l7u22m1t3',
      instruction:
        "Compare two dominant scales: type 'G mixolydian' (unaltered dominant) and then 'G altered scale' (maximum alteration). Mixolydian is bright and stable; altered is dark and chromatic. Context determines which to use.",
    },
  ],
  prerequisites: ['l7u21m6'],
};

const l7u22m2: CurriculumModule = {
  id: 'l7u22m2',
  unitId: 'u22',
  levelId: 'l7',
  title: 'Upper Structures and Reharmonization',
  subtitle: 'Voicing complex chords with simple triads, and enriching progressions',
  objectives: [
    'Construct upper-structure triads over dominant bass notes to voice extensions',
    'Understand how the upper triad creates specific extensions without spelling each note',
    'Apply basic reharmonization: substitute chords within the same function',
    'Use tritone subs, secondary dominants, and passing chords to enrich simple progressions',
  ],
  concepts: [
    {
      title: 'Upper-Structure Triads',
      explanation:
        'Upper-structure voicing places a simple triad in the upper register over a bass note and guide tones below. The triad creates specific extensions without spelling out each note individually. A D major triad over a C7 bass yields C13#11 — the D, F#, and A become the 9th, #11th, and 13th. An Eb major triad over C7 produces C7(#9). An Ab major triad over C7 produces C7(#9,b13). A Db major triad over C7 produces C7(b9,#11,b13) — the tritone-sub voicing. The upper triad is chosen for the extensions it generates, not for its own identity. This technique allows jazz pianists and arrangers to voice complex chords with simple shapes. (See Levine, The Jazz Theory Book, UST appendix.)',
      tryThisQuery: 'C13',
      tryThisLabel: 'Build C13 — hear the extensions an upper structure creates',
    },
    {
      title: 'Reharmonization Principles',
      explanation:
        'Reharmonization replaces the original chords of a melody with different chords that still support the melody notes. The melody notes become different extensions of the new chords. Basic techniques: substitute chords within the same function (iii for I, vi for IV), add secondary dominants before target chords, insert tritone substitutions, use passing diminished chords between diatonic chords, and apply chromatic bass motion. Every reharmonization must preserve the melody — the melody note must be a chord tone or acceptable extension of the new chord.',
      tryThisQuery: 'Em7',
      tryThisLabel: 'Build Em7 — a iii that can substitute for Cmaj7',
    },
    {
      title: 'Chromatic Bass Lines and Passing Chords',
      explanation:
        'One of the most powerful reharmonization tools is creating a chromatic bass line by inserting passing chords. Between C and Dm, insert C#dim7 — the bass walks C-C#-D. Between F and Em, insert F#dim7 (or Fmaj7-F#dim7-Em7). Diminished 7th chords are the most versatile passing chords because every diminished chord is enharmonically equivalent to three others (due to symmetric construction), so they connect to multiple destinations. Combined with tritone subs and secondary dominants, chromatic bass motion transforms simple diatonic progressions into rich jazz harmony.',
      tryThisQuery: 'C#dim7',
      tryThisLabel: 'Hear C#dim7 — a chromatic passing chord',
    },
  ],
  tasks: [
    {
      id: 'l7u22m2t1',
      instruction:
        "Explore upper structures: type 'C13#11' — this is the sound of a D major triad (D-F#-A = 9-#11-13) over a C7 shell (C-E-Bb). The complex symbol is voiced with a simple triad on top.",
    },
    {
      id: 'l7u22m2t2',
      instruction:
        "Try a function substitution: play 'Cmaj7' then play 'Em7'. Both are tonic-function chords in C major — Em7 shares three notes with Cmaj7 (E-G-B) but adds a different color. This is the simplest reharmonization.",
    },
    {
      id: 'l7u22m2t3',
      instruction:
        "Build a chromatic passing-chord line: play 'Cmaj7', then 'C#dim7', then 'Dm7'. The diminished chord creates a chromatic bass ascent (C-C#-D) and every voice moves by a half step or stays the same.",
    },
  ],
  prerequisites: ['l7u22m1'],
};

const l7u22m3: CurriculumModule = {
  id: 'l7u22m3',
  unitId: 'u22',
  levelId: 'l7',
  title: 'Coltrane Changes and Advanced Jazz Harmony',
  subtitle: 'Giant Steps matrix, constant structure, and three-key-center architecture',

  objectives: [
    'Analyze the Coltrane (Giant Steps) matrix — three major key centers a major third apart',
    'Understand why each key center is approached by its V7 dominant chord',
    'Recognize constant structure as a related technique — parallel chord motion regardless of key',
    'Appreciate the improvisational challenge of navigating three key centers at high tempo',
  ],
  concepts: [
    {
      title: 'The Giant Steps Matrix',
      explanation:
        'John Coltrane devised chord progressions that cycle through three major key centers separated by major thirds, dividing the octave into three equal parts. The Giant Steps progression: Bmaj7-D7-Gmaj7-Bb7-Ebmaj7-F#7-Bmaj7, touching keys B, G, and Eb (abbreviated — the full tune interleaves ii7 chords such as Am7-D7). Each key center is approached by its V7 chord. The result is extremely rapid harmonic rhythm that demands thinking in three keys simultaneously — one of the great challenges in jazz improvisation and a summit of chord-scale mastery.',
      tryThisQuery: 'Bmaj7',
      tryThisLabel: 'Start on Bmaj7 — the first key center',
    },
    {
      title: 'Constant Structure',
      explanation:
        'Constant structure moves the same chord quality chromatically or by some interval pattern regardless of key. Cmaj7-Dbmaj7-Dmaj7-Ebmaj7 (ascending major sevenths) creates parallel voice leading (planing) with a modern jazz color. This technique abandons functional harmony entirely — there is no key, only motion. Wayne Shorter and Herbie Hancock used constant structure extensively. It is related to Coltrane changes in that both treat chord movement as geometric patterns rather than functional progressions.',
      tryThisQuery: 'Dbmaj7',
      tryThisLabel: 'Hear Dbmaj7 — constant structure in motion',
    },
    {
      title: 'Three-Key-Center Improvisation',
      explanation:
        'Improvising over Coltrane changes requires thinking in three keys simultaneously at high tempo. The standard approach: play the major scale (or pentatonic) of each key center for the duration of that chord, switching instantly when the harmony moves. More advanced approaches use enclosures, digital patterns (1235, 1357), and superimposed pentatonics. The difficulty lies in the speed of harmonic rhythm — each key center may last only two beats. This is the Everest of jazz improvisation, requiring total command of all 12 keys.',
      tryThisQuery: 'Gmaj7',
      tryThisLabel: 'Hear Gmaj7 — the second key center',
    },
  ],
  tasks: [
    {
      id: 'l7u22m3t1',
      instruction:
        "Trace the Coltrane cycle: play 'Bmaj7', 'D7', 'Gmaj7', 'Bb7', 'Ebmaj7', 'F#7'. The three key centers (B, G, Eb) are a major third apart — they divide the octave into three equal parts.",
    },
    {
      id: 'l7u22m3t2',
      instruction:
        "Verify the three-key geometry: play 'B major chord', 'G major chord', 'Eb major chord'. These three roots (B, G, Eb) form an augmented triad — the most symmetric division of the octave into three parts.",
    },
    {
      id: 'l7u22m3t3',
      instruction:
        "Explore constant structure: play 'Cmaj7', 'Dbmaj7', 'Dmaj7', 'Ebmaj7'. The same chord quality moves chromatically — parallel motion that abandons functional harmony entirely. Listen to the color shift as the root ascends.",
    },
  ],
  prerequisites: ['l7u22m2'],
};

const l7u22m4: CurriculumModule = {
  id: 'l7u22m4',
  unitId: 'u22',
  levelId: 'l7',
  title: 'Modal Harmony Fundamentals',
  subtitle: 'Composing outside tonal gravity — modes as harmonic systems',
  objectives: [
    'Distinguish modal harmony from tonal harmony and understand why V-I is generally avoided',
    'Identify the characteristic tone of each mode and use it to select chords',
    'Build modal chord progressions that preserve the modal color',
    'Use pedal points, drones, and ostinato patterns to anchor the modal tonic',
  ],
  concepts: [
    {
      title: 'Modal vs. Tonal Thinking',
      explanation:
        'In tonal music, the V-I relationship defines the key and creates the gravitational pull that organizes all harmony. In modal music, V-I is generally avoided because it tends to collapse the modal color back into major or minor tonality. Modal harmony establishes the tonic through repetition, pedal points, drones, and non-dominant chord relationships. Miles Davis, McCoy Tyner, and Herbie Hancock built entire compositions on this principle — "So What" uses just two chords over a Dorian pedal. The mode itself IS the harmony.',
      tryThisQuery: 'D dorian',
      tryThisLabel: 'See D Dorian — the jazz modal staple',
    },
    {
      title: 'Characteristic Tones',
      explanation:
        'Each mode has one note that distinguishes it from plain major or natural minor — the characteristic tone. Dorian has a raised 6th compared to natural minor (the note that makes it brighter). Phrygian has a lowered 2nd (dark, Spanish flavor). Lydian has a raised 4th (bright, floating, dreamlike). Mixolydian has a lowered 7th (bluesy, rock). In tonal theory these are "avoid notes," but in modal writing they are the essential notes that must be emphasized in both melody and chord choices to establish the mode.',
      tryThisQuery: 'F lydian',
      tryThisLabel: 'Hear F Lydian — the raised 4th defines it',
    },
    {
      title: 'Modal Chord Progressions',
      explanation:
        'Each mode supports specific chord movements that reinforce its color. Dorian\'s defining color chord is the major IV over an i tonic — the raised 6th lives in it (Dm-G-Dm); ii and bVII serve as secondary colors. Phrygian centers on i and bII — the bII is a half step above the tonic, the signature Phrygian sound (Em-F-Em). Lydian\'s defining color chord is the major II over a I tonic — the raised 4th lives in it (C-D-C); vii shares that raised 4th as a secondary color. Mixolydian leans on I and bVII — the lowered 7th sits in the bVII chord (G-F-Dm-G). Avoid any chord that implies dominant-tonic resolution.',
      tryThisQuery: 'G mixolydian',
      tryThisLabel: 'See G Mixolydian — bVII is the key chord',
    },
  ],
  tasks: [
    {
      id: 'l7u22m4t1',
      instruction:
        "Type 'D dorian' and identify the characteristic tone (B natural — the raised 6th). Now type 'D natural minor scale' and compare — only one note differs. That single note defines the Dorian sound.",
    },
    {
      id: 'l7u22m4t2',
      instruction:
        "Type 'E phrygian' — the characteristic tone is F (the lowered 2nd). Build a Phrygian vamp: play 'Em' then 'F major chord' and back to 'Em'. The half-step root motion is the Phrygian signature.",
    },
    {
      id: 'l7u22m4t3',
      instruction:
        "Compare 'F lydian' with 'F major scale' — the only difference is the raised 4th (B natural instead of Bb). This single note transforms the entire harmonic character from grounded major to floating Lydian.",
    },
  ],
  prerequisites: ['l7u22m3'],
};

const l7u22m5: CurriculumModule = {
  id: 'l7u22m5',
  unitId: 'u22',
  levelId: 'l7',
  title: 'Quartal/Quintal Voicings and Drones',
  subtitle: 'Stacking fourths and fifths for ambiguous, open modal sounds',

  objectives: [
    'Build quartal voicings (stacked perfect fourths) and understand their harmonic ambiguity',
    'Understand quintal voicings as inverted quartal — stacked perfect fifths for an open, spacious sound',
    'Use pedal points and drones to anchor modal compositions without dominant function',
    'Recognize quartal voicing as McCoy Tyner\'s signature technique in modal jazz',
  ],
  concepts: [
    {
      title: 'Quartal Voicings',
      explanation:
        'Quartal chords are built by stacking perfect fourths instead of thirds. A quartal voicing on D: D-G-C-F. This could imply Dm7, Dm11, or simply a floating quartal sonority with no clear major/minor identity. The ambiguity is intentional and perfect for modal music — quartal voicings do not pull toward resolution the way triads do. McCoy Tyner built his entire signature sound on quartal stacks, often moving them in parallel over a bass pedal. In the right hand: fourths. In the left hand: the modal tonic as a drone.',
      tryThisQuery: 'Dm11',
      tryThisLabel: 'Hear Dm11 — a quartal stack in chord form',
    },
    {
      title: 'Quintal Voicings and Open Spacing',
      explanation:
        'Quintal voicings stack perfect fifths: D-A-E-B. This is the inversion of a quartal voicing (D-G-C-F inverted gives open fifths). The sound is spacious, open, and orchestral. Quintal voicings appear in 20th-century classical music (Bartok, Hindemith) and in modal jazz. The wide intervals create transparency — each note has room to resonate. Combined with a bass pedal, quintal voicings suggest modality without committing to any specific chord quality.',
      tryThisQuery: 'D5',
      tryThisLabel: 'Hear a D power chord — the simplest fifth stack',
    },
    {
      title: 'Pedal Points and Drones',
      explanation:
        'A pedal point is a sustained or repeated bass note over which the upper harmonies change freely. A drone is a continuously sounding pitch (or fifth) that anchors the tonal center. In modal music, pedal points and drones replace dominant function — the tonic is established by sheer persistence rather than by harmonic gravity. Indian classical music is entirely built on a drone (the tanpura). Miles Davis used pedal points in modal jazz to free the harmony from functional chord changes, allowing the soloist to explore the mode freely.',
      tryThisQuery: 'D natural minor scale',
      tryThisLabel: 'See D natural minor — a scale over a D pedal',
    },
  ],
  tasks: [
    {
      id: 'l7u22m5t1',
      instruction:
        "Build a quartal sound: type 'Dm11' — this contains the notes D-G-C-F when voiced in fourths. Compare with 'Dm7' — the 11th extension adds the quartal stacking that creates the open, ambiguous quality.",
    },
    {
      id: 'l7u22m5t2',
      instruction:
        "Explore the power chord as a minimal fifth stack: type 'C5', then 'D5', then 'E5'. Power chords are neither major nor minor — pure fifths with no third. This is quintal thinking at its most basic.",
    },
    {
      id: 'l7u22m5t3',
      instruction:
        "Compare 'D dorian' with 'D natural minor scale'. Over a D pedal drone, Dorian's raised 6th (B natural) creates a brighter modal color. The pedal anchors D as tonic while the scale defines the mode.",
    },
  ],
  prerequisites: ['l7u22m4'],
};

// ---------------------------------------------------------------------------
// Level 7, Unit 23: Pop Harmony and Complete Taxonomy (5 modules)
// Covers 7.5 (Pop Progressions, Modal Mixture), 7.6 (Scale Taxonomy),
// and 7.7 (Chord Taxonomy)
// ---------------------------------------------------------------------------

const l7u23m1: CurriculumModule = {
  id: 'l7u23m1',
  unitId: 'u23',
  levelId: 'l7',
  title: 'Pop Progressions and Nashville Numbers',
  subtitle: 'Pop chord loops, the Nashville Number System, and loop-based harmony',
  objectives: [
    'Analyze the most common pop chord progressions and their emotional signatures',
    'Understand the Nashville Number System and use it for instant transposition',
    'Recognize loop-based harmony as a distinct approach — the loop IS the harmony',
    'Identify the Axis (I-V-vi-IV), Sensitive (vi-IV-I-V), and other standard pop loops',
  ],
  concepts: [
    {
      title: 'Common Pop Progressions',
      explanation:
        'Pop music relies on a small set of chord loops with distinct emotional signatures. The I-V-vi-IV "Axis" progression feels uplifting and anthemic. Its rotation vi-IV-I-V ("Sensitive") feels emotional and modern. I-bVII-IV produces a Mixolydian, bluesy rock feel. The i-bVII-bVI-V "Andalusian" cadence — a stepwise descending bass from tonic to dominant, straight out of flamenco — sounds dark and cinematic. I-vi-IV-V is the classic 50s progression, nostalgic and warm. These loops repeat through entire sections — harmonic variation comes from melody, production, and arrangement rather than chord changes.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Start the I chord of a pop progression in C',
    },
    {
      title: 'Nashville Numbers and Loop Harmony',
      explanation:
        'The Nashville Number System simplifies Roman numerals for session musicians: plain numbers for major chords (1, 4, 5), a dash for minor (2-, 6-), superscript 7 for seventh chords. The key is stated once at the top of the chart, and everything else is relative — "1 5 6- 4" in the key of G means G-D-Em-C. This allows instant transposition: change the key declaration and play the same numbers. Modern pop builds on 2-4 chord loops that repeat through an entire section. The loop provides harmonic stability; all variation happens in the layers above it.',
      tryThisQuery: 'Am',
      tryThisLabel: 'Am is the vi in C — the emotional center of pop',
    },
    {
      title: 'Loop Rotations and Emotional Shifts',
      explanation:
        'The same four chords produce different emotional effects depending on which chord starts the loop. I-V-vi-IV starting on I feels triumphant and resolved. vi-IV-I-V starting on vi feels vulnerable and yearning. IV-V-vi-IV (starting on IV) creates a sense of aspiration. The starting chord defines where the emotional "home" sits within the loop. In pop production, the starting chord often aligns with the vocal melody hook, reinforcing the emotional shape of the lyric.',
      tryThisQuery: 'F major chord',
      tryThisLabel: 'Build F — the IV chord that drives pop resolution',
    },
  ],
  tasks: [
    {
      id: 'l7u23m1t1',
      instruction:
        "Build the Axis progression in C: play 'C major chord', 'G major chord', 'Am', 'F major chord'. This four-chord loop powers hundreds of pop hits — the I-V-vi-IV structure.",
    },
    {
      id: 'l7u23m1t2',
      instruction:
        "Now rotate to the Sensitive version: play 'Am', 'F major chord', 'C major chord', 'G major chord'. Same four chords (vi-IV-I-V), but starting on the minor chord creates a completely different emotional landscape.",
    },
    {
      id: 'l7u23m1t3',
      instruction:
        "Try the Mixolydian rock loop: play 'C major chord', 'Bb major chord', 'F major chord'. This I-bVII-IV pattern uses a borrowed bVII from the parallel minor, giving it a bluesy, classic rock feel.",
    },
  ],
  prerequisites: ['l7u22m5'],
};

const l7u23m2: CurriculumModule = {
  id: 'l7u23m2',
  unitId: 'u23',
  levelId: 'l7',
  title: 'Modal Mixture and Chromatic Mediants in Pop',
  subtitle: 'Borrowed chords in pop and rock, chromatic mediants in film scores',
  objectives: [
    'Apply modal mixture (borrowed chords from the parallel minor) in pop and rock contexts',
    'Recognize the minor iv, bVI, and bVII as the most common borrowed chords in pop',
    'Understand chromatic mediants (major-third-related chords) and their dramatic color shifts',
    'Identify the "Mario cadence" (bVI-bVII-I) and direct modulations in contemporary songwriting',
  ],
  concepts: [
    {
      title: 'Modal Mixture in Pop',
      explanation:
        'Borrowed chords from the parallel minor appear constantly in pop and rock. Minor iv replacing major IV creates the "heartbreak" sound — Fm in a C major song instantly shifts the mood to bittersweet. The b6 scale degree (Ab in C) is doing the emotional work, pulling the bright major sound toward minor darkness without fully committing. bVI and bVII are rock and cinematic staples: the progression bVI-bVII-I (Ab-Bb-C in C) is the "Mario cadence," a hallmark of 80s rock with its triumphant ascending bass.',
      tryThisQuery: 'Fm',
      tryThisLabel: 'Hear Fm — borrowed iv in C major',
    },
    {
      title: 'Chromatic Mediants in Film and Pop',
      explanation:
        'Chromatic mediants are chords whose roots are a major or minor third apart and which share zero or one common tones. C major to Ab major (down a major 3rd) creates a sudden darkening — used in film scores for mystery or foreboding. C major to E major (up a major 3rd) brightens dramatically — the "wonder" sound in fantasy film scores. These shifts work because the ear expects diatonic relationships; the chromatic mediant is close enough to be related but far enough to surprise. Pop uses them as surprise chord changes between sections.',
      tryThisQuery: 'Ab major chord',
      tryThisLabel: 'Hear Ab major — the bVI chromatic mediant in C',
    },
    {
      title: 'Direct Modulation and Truck Driver Key Changes',
      explanation:
        'Direct modulation shifts the key abruptly — no pivot chord, no preparation. The most common form is the "truck driver modulation": the final chorus jumps up a half step (or whole step) for a burst of energy. This works through sheer novelty — the sudden brightness of a higher key registers as emotional escalation. More sophisticated direct modulations use chromatic mediants: a verse in C major jumping to the bridge in Ab major creates a dramatic mood shift without any transition chords.',
      tryThisQuery: 'Db major chord',
      tryThisLabel: 'Hear Db — a half-step-up key change destination from C',
    },
  ],
  tasks: [
    {
      id: 'l7u23m2t1',
      instruction:
        "Apply modal mixture: replace the F major (IV) with 'Fm' (iv, borrowed from C minor). Hear how the mood shifts from bright to bittersweet — that Ab in the Fm is the borrowed b6 doing the emotional work.",
    },
    {
      id: 'l7u23m2t2',
      instruction:
        "Build the Mario cadence in C: play 'Ab major chord' (bVI), 'Bb major chord' (bVII), 'C major chord' (I). Both Ab and Bb are borrowed from C minor. The ascending bass (Ab-Bb-C) creates a triumphant arrival.",
    },
    {
      id: 'l7u23m2t3',
      instruction:
        "Try a chromatic mediant shift: play 'C major chord' then 'E major chord'. The root jumps up a major third, sharing only one common tone (E). This is the 'wonder' shift — used in film scores for magical or awe-inspiring moments.",
    },
  ],
  prerequisites: ['l7u23m1'],
};

const l7u23m3: CurriculumModule = {
  id: 'l7u23m3',
  unitId: 'u23',
  levelId: 'l7',
  title: 'Scales: Melodic Minor Modes',
  subtitle: 'Seven modes of melodic minor and their jazz applications',
  objectives: [
    'Navigate all seven modes of the ascending melodic minor scale',
    'Pair each mode with its primary chord-scale application in jazz',
    'Use Lydian dominant (mode 4) for dominant 7#11 chords',
    'Use the altered scale (mode 7) for 7alt chords — the most chromatic dominant sound',
  ],
  concepts: [
    {
      title: 'The Melodic Minor Parent Scale',
      explanation:
        'The ascending melodic minor scale raises both the 6th and 7th of natural minor, creating a scale with a minor 3rd but major 6th and 7th. Its interval pattern (W-H-W-W-W-W-H) generates seven modes, each with a distinct character and jazz application. Mode 1 (jazz minor itself) pairs with minor-major 7th chords — the m(maj7) sound. Unlike the diatonic modes which all share the same notes, melodic minor modes each have a unique chromatic flavor that makes them essential for navigating altered jazz harmony.',
      tryThisQuery: 'C melodic minor',
      tryThisLabel: 'See C melodic minor — the parent of 7 modes',
    },
    {
      title: 'Lydian Dominant and Mixolydian b6',
      explanation:
        'Mode 4 of melodic minor is Lydian dominant (#4 and b7) — the go-to scale for dominant 7#11 chords. It combines the raised 4th of Lydian with the flat 7th of Mixolydian, creating a bright dominant sound with no 3rd/11 clash. Mode 5 is Mixolydian b6 (also called Hindu or Aeolian dominant) — it works over dominant chords resolving to minor, providing a b6 that anticipates the minor key destination. Both modes sit at the heart of jazz improvisation over dominant chords with specific extensions.',
      tryThisQuery: 'C lydian dominant',
      tryThisLabel: 'Hear Lydian dominant — mode 4 of melodic minor',
    },
    {
      title: 'The Altered Scale (Super Locrian)',
      explanation:
        'Mode 7 of melodic minor is the altered scale, also called Super Locrian. Its formula from the root: H-W-H-W-W-W-W. It contains every possible alteration of a dominant chord: b9, #9, b5 (#11), and #5 (b13). The altered scale pairs exclusively with 7alt chords and is THE essential sound for dominant chords resolving to minor with maximum tension. The shortcut: the altered scale on any root equals the melodic minor scale starting a half step above (C altered = Db melodic minor). Locrian natural 2 (mode 6) is the standard half-diminished scale.',
      tryThisQuery: 'C altered scale',
      tryThisLabel: 'See the altered scale — mode 7 of melodic minor',
    },
  ],
  tasks: [
    {
      id: 'l7u23m3t1',
      instruction:
        "Explore the melodic minor family: type 'C melodic minor', then 'C lydian dominant', then 'C altered scale'. These are modes 1, 4, and 7 of the same parent scale (on different roots). Each has a completely different character.",
    },
    {
      id: 'l7u23m3t2',
      instruction:
        "Verify the altered scale shortcut: type 'C altered scale', then type 'Db melodic minor'. They contain the same notes — the altered scale on any root is the melodic minor a half step above. This is the fastest way to find any altered scale.",
    },
    {
      id: 'l7u23m3t3',
      instruction:
        "Match mode to chord: type 'C lydian dominant' alongside 'C7#11'. Every note of the chord sits inside the scale. Now try 'C altered scale' alongside 'C7alt'. The scale contains every altered extension — perfect alignment.",
    },
  ],
  prerequisites: ['l7u23m2'],
};

const l7u23m4: CurriculumModule = {
  id: 'l7u23m4',
  unitId: 'u23',
  levelId: 'l7',
  title: 'Scales: Harmonic Minor Modes, Symmetric, and World',
  subtitle: 'Harmonic minor modes, whole-tone, diminished, and world scales',
  objectives: [
    'Navigate all seven modes of harmonic minor and recognize the augmented-second signature',
    'Understand symmetric scales (whole-tone, diminished) and their limited transpositions',
    'Explore world and ethnic scales: double harmonic major, Hungarian minor, Persian, and more',
    'Use Phrygian dominant (harmonic minor mode 5) for flamenco, klezmer, and Middle Eastern sounds',
  ],
  concepts: [
    {
      title: 'Modes of Harmonic Minor',
      explanation:
        'Harmonic minor yields seven modes, each marked by a distinctive augmented-second interval that gives them an exotic color. The 5th mode, Phrygian dominant, is used extensively in flamenco, klezmer, and Middle Eastern music — it has a major 3rd over a Phrygian framework, creating a bright yet dark sound. The 4th mode, Dorian #4 (Ukrainian Dorian), appears in Eastern European folk traditions. The 6th mode, Lydian #2, begins with an augmented second that sounds immediately distinctive. Each mode has a defined chord-scale pairing and a characteristic cultural context.',
      tryThisQuery: 'C phrygian dominant',
      tryThisLabel: 'Hear Phrygian dominant — flamenco and klezmer',
    },
    {
      title: 'Symmetric Scales: Whole-Tone and Diminished',
      explanation:
        'Symmetric scales have repeating interval patterns that limit their transpositions. The whole-tone scale (W-W-W-W-W-W) has only 2 unique forms and produces a dreamy, unresolved, Debussy-like sound — 6 notes, no half steps, no strong pull in any direction. The diminished scale comes in two flavors: half-whole (H-W-H-W-H-W-H-W) and whole-half (W-H-W-H-W-H-W-H), with only 3 unique forms each. The half-whole version pairs with dominant b9 chords; the whole-half version pairs with diminished 7th chords. Both have 8 notes and divide the octave into four equal parts.',
      tryThisQuery: 'C whole tone scale',
      tryThisLabel: 'Hear the whole-tone scale — 6 notes, 2 unique forms',
    },
    {
      title: 'World and Ethnic Scales',
      explanation:
        'Beyond Western functional scales, the engine includes scales from diverse musical traditions. Double harmonic major (1-b2-3-4-5-b6-7) is used in Middle Eastern, Romani, and Indian music — two augmented seconds create an intensely exotic flavor. Hungarian minor (1-2-b3-#4-5-b6-7) features the raised 4th combined with minor quality. Persian (1-b2-3-4-b5-b6-7) has a distinctive dark color. Neapolitan minor and major provide the flattened 2nd of Neapolitan harmony. Each scale carries its cultural origin in its intervals.',
      tryThisQuery: 'C hungarian minor',
      tryThisLabel: 'Hear Hungarian minor — raised 4th in a minor scale',
    },
  ],
  tasks: [
    {
      id: 'l7u23m4t1',
      instruction:
        "Explore Phrygian dominant: type 'C phrygian dominant'. It has a b2 (Db) and a major 3rd (E) — the augmented second between them is the signature interval. This is the flamenco/klezmer sound. Compare with 'C phrygian' to hear the difference the major 3rd makes.",
    },
    {
      id: 'l7u23m4t2',
      instruction:
        "Type 'C whole tone scale' — notice only 6 notes and no half steps anywhere. Now type 'Db whole tone scale'. These are the only two unique whole-tone scales; every other root duplicates one of them. Total symmetry means total ambiguity.",
    },
    {
      id: 'l7u23m4t3',
      instruction:
        "Compare world scales: type 'C double harmonic major', then 'C hungarian minor'. Both feature augmented seconds but in different positions, creating very different melodic characters. The engine has 46 scales — explore freely.",
    },
  ],
  prerequisites: ['l7u23m3'],
};

const l7u23m5: CurriculumModule = {
  id: 'l7u23m5',
  unitId: 'u23',
  levelId: 'l7',
  title: 'Complete Chord Taxonomy',
  subtitle: 'All 42 chord types — extended, suspended, added-tone, and special structures',
  objectives: [
    'Build any extended chord (9th, 11th, 13th) in any quality from a root',
    'Understand suspended and added-tone chords and how they differ from extensions',
    'Explore special structures: quartal chords, power chords, and polychords',
    'Use the chord engine to identify and build any chord from its symbol',
  ],
  concepts: [
    {
      title: 'Extended Chords: 9ths Through 13ths',
      explanation:
        'Extended chords continue the third-stacking process beyond the seventh. Major, minor, and dominant qualities each produce distinct extension families. Cmaj9 adds a major 9th to Cmaj7. Cm11 adds a perfect 11th to Cm9. G13 adds a major 13th to G9 (with the 11th usually omitted in dominant chords to avoid the 3rd/11 clash). Altered extensions (b9, #9, #11, b13) create the chromatic tension essential to jazz voice leading. The engine supports all standard extensions across every quality.',
      tryThisQuery: 'Cmaj13',
      tryThisLabel: 'Build Cmaj13 — the full major extension stack',
    },
    {
      title: 'Suspended and Added-Tone Chords',
      explanation:
        'Suspended chords replace the 3rd with a 2nd (sus2) or 4th (sus4), removing the major/minor identity and creating an open, unresolved sound. The 7sus4 is a dominant 7th with a suspended 4th — common in jazz as a pre-resolution voicing. Added-tone chords keep the 3rd and add a tone without implying a 7th: Cadd9 has root, 3rd, 5th, and 9th but no 7th. The 6/9 chord (C6/9) adds both a 6th and 9th to a triad — a rich, stable jazz voicing that functions as an alternative tonic to maj7.',
      tryThisQuery: 'C7sus4',
      tryThisLabel: 'Hear C7sus4 — the suspended dominant',
    },
    {
      title: 'Special Structures: Quartal, Power, and Beyond',
      explanation:
        'Not all chords are built from stacked thirds. Quartal chords stack perfect fourths (D-G-C-F), producing an ambiguous, open quality central to modal jazz — McCoy Tyner built his signature sound on these voicings. Power chords (root and fifth only, no third) are the backbone of rock guitar, neither major nor minor. Polychords stack two independent triads to create complex sonorities used in orchestral and jazz writing. The engine covers 42 chord types spanning triads, sevenths, extensions, alterations, suspensions, added tones, and power chords.',
      tryThisQuery: 'C6/9',
      tryThisLabel: 'Hear C6/9 — a classic jazz voicing with no 7th',
    },
  ],
  tasks: [
    {
      id: 'l7u23m5t1',
      instruction:
        "Build the extension ladder on C: type 'Cmaj7', 'Cmaj9', 'Cmaj13' in sequence. Hear how each extension adds richness while the shell (C, E, B) remains the same.",
    },
    {
      id: 'l7u23m5t2',
      instruction:
        "Compare suspended and added-tone chords: type 'Csus4', then 'Cadd9', then 'C6/9'. Notice that sus4 has no 3rd, add9 has no 7th, and 6/9 has neither a 7th nor the resolution tension of a suspended chord.",
    },
    {
      id: 'l7u23m5t3',
      instruction:
        "Explore dominant variations: type 'C7', 'C9', 'C7sus4', 'C7b9', 'C7#9', 'C13'. All are dominant-family chords, but each has a distinct color — from warm (C9) to dark (C7b9) to gritty (C7#9) to wide (C13).",
    },
  ],
  prerequisites: ['l7u23m4'],
};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

export const L7_UNITS: CurriculumUnit[] = [
  {
    id: 'u21',
    levelId: 'l7',
    title: 'Jazz Harmony',
    description:
      'Jazz chord symbols, extensions, shell voicings, ii-V-I progressions, tritone substitution, blues forms, rhythm changes, and turnarounds',
    icon: 'harmony',
    modules: [l7u21m1, l7u21m2, l7u21m3, l7u21m4, l7u21m5, l7u21m6],
    milestone: {
      skillsSummary: [
        'Read and build any jazz chord symbol including extensions, alterations, and shell voicings',
        'Construct ii-V-I progressions in major and minor, apply tritone substitution and back-door dominants',
        'Navigate blues forms (12-bar, jazz blues, minor blues) and rhythm changes with turnarounds',
      ],
      bridgeText:
        'You command the full jazz harmonic vocabulary — symbols, progressions, blues forms, and turnarounds. Now deepen with chord-scale theory, reharmonization, and modal thinking.',
      tryThisQuery: 'Dm9',
      tryThisLabel: 'Build Dm9 — start a ii-V-I',
      tryThisPrompt:
        'Can you play a full ii-V-I with extensions? Try Dm9 — G13 — Cmaj9.',
    },
  },
  {
    id: 'u22',
    levelId: 'l7',
    title: 'Advanced Jazz, Modal, and Pop',
    description:
      'Chord-scale theory, upper structures, reharmonization, Coltrane changes, modal chord progressions, quartal voicings, and drones',
    icon: 'scales',
    modules: [l7u22m1, l7u22m2, l7u22m3, l7u22m4, l7u22m5],
    milestone: {
      skillsSummary: [
        'Match any chord to its compatible scales using chord-scale theory',
        'Voice complex chords using upper-structure triads and apply reharmonization techniques',
        'Build modal progressions that preserve each mode\'s characteristic color using pedal points and quartal voicings',
      ],
      bridgeText:
        'You can think in jazz, modal, and tonal frameworks and understand the advanced techniques that connect them. The final step: commanding the complete catalog of scales, chords, and pop harmony the engine offers.',
      tryThisQuery: 'E phrygian',
      tryThisLabel: 'Explore E Phrygian mode',
      tryThisPrompt:
        'Build a Phrygian vamp: alternate between Em and F major. Hear the lowered 2nd define the mode.',
    },
  },
  {
    id: 'u23',
    levelId: 'l7',
    title: 'Pop Harmony and Complete Taxonomy',
    description:
      'Pop progressions, Nashville numbers, modal mixture, chromatic mediants, all 46 scales (melodic minor modes, harmonic minor modes, symmetric, world), and all 42 chord types',
    icon: 'chords',
    modules: [l7u23m1, l7u23m2, l7u23m3, l7u23m4, l7u23m5],
    milestone: {
      skillsSummary: [
        'Analyze pop chord loops, apply modal mixture and chromatic mediants in contemporary contexts',
        'Navigate all 46 scales across every family: melodic minor modes, harmonic minor modes, symmetric, pentatonic, bebop, and world',
        'Build any of the 42 chord types from any root and match any chord to its compatible scales',
      ],
      bridgeText:
        'You have explored the full scope of the engine — every scale, every chord, every harmonic relationship across jazz, modal, and pop contexts. This is the complete toolkit for analysis, composition, and improvisation across any genre.',
      tryThisQuery: 'C altered scale',
      tryThisLabel: 'Revisit the altered scale',
      tryThisPrompt:
        'Play C7alt alongside the C altered scale. Every chord tone sits inside the scale — full chord-scale alignment.',
    },
  },
];
