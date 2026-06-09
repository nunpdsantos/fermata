import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 5, Unit 15: Secondary Dominants and Tonicization (5 modules)
// ---------------------------------------------------------------------------

const l5u15m1: CurriculumModule = {
  id: 'l5u15m1',
  unitId: 'u15',
  levelId: 'l5',
  title: 'Secondary Dominants: V/V and V7/V',
  subtitle: 'The dominant of the dominant — your first applied chord',
  objectives: [
    'Understand what "V of something" means (temporarily tonicizing a diatonic chord)',
    'Build and resolve V/V and V7/V in major keys',
    'Identify the chromatic note (raised 4th) that creates the leading tone to V',
  ],
  concepts: [
    {
      title: 'The Core Idea: V of V',
      explanation:
        'Any diatonic chord (except diminished) can be temporarily treated as a "tonic" and given its own dominant. V/V means "the dominant of the dominant." In C major, V = G major. The dominant of G is D major. D major contains F# — a chromatic note that acts as a leading tone to G. This is the simplest form of chromaticism: borrowing a note from outside the key to strengthen motion toward a diatonic chord.',
      tryThisQuery: 'D major chord',
      tryThisLabel: 'Hear D major — the V/V in C major',
    },
    {
      title: 'V7/V — Adding the Seventh',
      explanation:
        'The seventh chord form V7/V is even more common than the triad. V7/V in C major = D7 (D–F#–A–C). The tritone F#–C resolves outward to G–B. The seventh adds the pulling power that makes secondary dominants so effective. In D7 resolving to G: F# rises to G (leading tone resolution), C falls to B (seventh resolves down by step). These are the same voice-leading rules as V7 to I, just applied to V as the temporary target.',
      tryThisQuery: 'D7',
      tryThisLabel: 'Hear D7 — the V7/V in C major',
    },
    {
      title: 'Resolution and Voice Leading',
      explanation:
        'Secondary dominants follow the same resolution rules as V7 to I. The chromatic "leading tone" resolves up by half step to the root of the target. The seventh (if present) resolves down by step. In D7 resolving to G: F# rises to G, C falls to B. The tritone F#–C resolves outward to G–B. Chromatic notes almost always resolve in the direction they were altered — sharps up, flats down.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Hear the G target after D7',
    },
  ],
  tasks: [
    {
      id: 'l5u15m1t1',
      instruction:
        "Type 'D major chord' — this is V/V in C major. The F# is the only chromatic note. It acts as a leading tone to G.",
      query: 'D major chord',
    },
    {
      id: 'l5u15m1t2',
      instruction:
        "Type 'D7' then 'G major chord' — hear how D7 creates a strong pull to G. The tritone F#–C inside D7 resolves outward to G–B.",
      query: 'D7',
    },
    {
      id: 'l5u15m1t3',
      instruction:
        "Compare 'D major chord' (V/V triad) with 'D7' (V7/V). The seventh form has more tension because of the tritone. Both target G, but D7 demands resolution more urgently.",
    },
  ],
  prerequisites: ['l4u14m5'],
};

const l5u15m2: CurriculumModule = {
  id: 'l5u15m2',
  unitId: 'u15',
  levelId: 'l5',
  title: 'Secondary Dominants of ii, iii, IV, vi',
  subtitle: 'Applied dominants for every diatonic target',
  objectives: [
    'Build and resolve V/ii, V/iii, V/IV, and V/vi in major keys',
    'Identify the chromatic note in each secondary dominant',
    'Recognize that V/IV uses the same notes as I (context determines function)',
  ],
  concepts: [
    {
      title: 'Secondary Dominants for Every Target',
      explanation:
        'Each diatonic chord (except viio) gets its own secondary dominant. V/ii = A(7) targeting Dm, with chromatic C#. V/iii = B(7) targeting Em, with chromatic D# and F#. V/IV = C(7) targeting F — same notes as I, distinguished only by context. V/vi = E(7) targeting Am, with chromatic G#. The seventh chord form (V7/X) is more common because the tritone inside it creates stronger pull toward the target.',
      tryThisQuery: 'A7',
      tryThisLabel: 'Hear A7 — the V7/ii in C major',
    },
    {
      title: 'The Special Case: V/IV',
      explanation:
        'V/IV in C major is C–E–G — identical notes to the tonic triad. The distinction is purely contextual: if C major is followed by F major, it functions as V/IV rather than I. Adding the seventh clarifies the function: V7/IV = C7 (C–E–G–Bb). The Bb is chromatic in C major and creates a tritone with E that pulls toward F. This is why V7/IV is much more common than the triad form — the seventh removes the ambiguity.',
      tryThisQuery: 'C7',
      tryThisLabel: 'Hear C7 — the V7/IV in C major (note the Bb)',
    },
    {
      title: 'Chromatic Notes and Their Targets',
      explanation:
        'Each secondary dominant introduces specific chromatic notes. V7/ii brings C# (leading tone to D). V7/iii brings D# (leading tone to E). V7/IV brings Bb (seventh above C, pulling to A in F major). V7/vi brings G# (leading tone to A). These chromatic notes always resolve in the direction they were altered: sharps resolve up, flats resolve down. Learning to hear these chromatic inflections is the key to identifying secondary dominants.',
      tryThisQuery: 'E7',
      tryThisLabel: 'Hear E7 — the V7/vi in C major',
    },
  ],
  tasks: [
    {
      id: 'l5u15m2t1',
      instruction:
        "Type 'A7' — this is V7/ii in C major. The C# acts as a leading tone to D. Now type 'Dm' to hear the resolution.",
      query: 'A7',
    },
    {
      id: 'l5u15m2t2',
      instruction:
        "Type 'E7' — this is V7/vi in C major. The G# pulls toward A. Compare with 'Em' (diatonic iii) — E7 has much more tension because of the chromatic G#.",
      query: 'E7',
    },
    {
      id: 'l5u15m2t3',
      instruction:
        "Type 'C7' — this is V7/IV in C major. The Bb is the giveaway that this is not functioning as a tonic chord. Now type 'F major chord' to hear the resolution.",
      query: 'C7',
    },
  ],
  prerequisites: ['l5u15m1'],
};

const l5u15m3: CurriculumModule = {
  id: 'l5u15m3',
  unitId: 'u15',
  levelId: 'l5',
  title: 'Secondary Leading-Tone Chords',
  subtitle: 'Building and resolving viio/X chords',
  objectives: [
    'Build viio/X and viio7/X for each diatonic target chord',
    'Understand the choice between half-diminished and fully-diminished secondary LT chords',
    'Resolve secondary leading-tone chords properly',
  ],
  concepts: [
    {
      title: 'What Are Secondary Leading-Tone Chords?',
      explanation:
        'Just as V can be "applied" to any diatonic chord, so can viio. Build a diminished triad (or seventh chord) on the note a half step below the target root. viio/V in C major = F#dim (F#–A–C), targeting G. viio/ii = C#dim (C#–E–G), targeting Dm. The leading-tone chord is a dominant substitute — it shares the same tritone as the corresponding V7 but lacks the root.',
      tryThisQuery: 'F#dim',
      tryThisLabel: 'Hear F#dim — viio/V in C major',
    },
    {
      title: 'Fully Diminished vs. Half-Diminished',
      explanation:
        'viio7/X (fully diminished seventh) is the more intense of the two, and the choice between them keys off the chord being tonicized rather than the home mode: minor targets take the fully diminished viio7/X, while major targets may be approached by either viio7/X or the milder viiø7/X — fully diminished secondary chords are common in major keys too. All intervals in viio7 are minor thirds, making the chord symmetrical — any note could function as the root. That symmetry enables enharmonic reinterpretation, which becomes important for distant modulation in Level 6.',
      tryThisQuery: 'Bdim7',
      tryThisLabel: 'Hear Bdim7 — a fully diminished seventh chord',
    },
    {
      title: 'Resolution and Comparison with V/X',
      explanation:
        'The root of the secondary leading-tone chord resolves up by half step to the root of the target, just as the diatonic leading tone resolves to the tonic. All other voices resolve by step or common tone, following standard diminished-chord resolution patterns. Comparing V7/X with viio7/X targeting the same chord reveals a shared tritone but different bass motion: V7/X moves the bass down a fifth (strong), while viio7/X moves the bass up a half step (smooth and chromatic). The choice depends on context — V/X is more emphatic, viio/X is more subtle.',
      tryThisQuery: 'C#dim',
      tryThisLabel: 'Hear C#dim — viio/ii in C major, targeting Dm',
    },
  ],
  tasks: [
    {
      id: 'l5u15m3t1',
      instruction:
        "Type 'F#dim' then 'G major chord' — the F# pulls up to G by half step. Compare this with 'D7' to 'G' — both target G but with different bass motion.",
      query: 'F#dim',
    },
    {
      id: 'l5u15m3t2',
      instruction:
        "Type 'G#dim7' — this is viio7/vi in C major. The G# is a leading tone to A. Now type 'Am' to hear the resolution.",
    },
    {
      id: 'l5u15m3t3',
      instruction:
        "Compare 'E7' (V7/vi) with 'G#dim7' (viio7/vi) — both target Am but the diminished chord has a smoother, more chromatic approach.",
    },
  ],
  prerequisites: ['l5u15m2'],
};

const l5u15m4: CurriculumModule = {
  id: 'l5u15m4',
  unitId: 'u15',
  levelId: 'l5',
  title: 'Tonicization vs. Modulation',
  subtitle: 'Distinguishing brief tonicization from permanent key change',
  objectives: [
    'Distinguish tonicization from modulation (brief vs. permanent key change)',
    'Recognize tonicization as a secondary dominant resolving to its target',
    'Identify extended tonicization (ii/V to V7/V to V)',
  ],
  concepts: [
    {
      title: 'Tonicization vs. Modulation',
      explanation:
        'Tonicization is a brief, momentary emphasis on a non-tonic chord. One or two chords "point to" the target, then the music returns to the home key. No key signature change, no cadence in the new key. Modulation is an actual change of key that persists — confirmed by a cadence in the new key. The rule of thumb: if there is a cadence in the new key, it is a modulation. If it is just V/X resolving to X, it is a tonicization.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — the home key to return to',
    },
    {
      title: 'Brief vs. Extended Tonicization',
      explanation:
        'A single V7/X to X is a brief tonicization. But multiple chords can function in the "temporary key." ii/V to V7/V to V creates a mini ii–V–I in the key of V. The temporary key has its own pre-dominant and dominant, but the music still returns to the original tonic. Extended tonicization blurs the line with modulation — the distinction depends on whether the music cadences and stays in the new key.',
      tryThisQuery: 'key of G',
      tryThisLabel: 'See G major — common tonicization target from C',
    },
    {
      title: 'Analyzing Tonicizations in Real Music',
      explanation:
        'When analyzing a passage with secondary dominants, bracket the tonicized region and label both the local function and the home-key function. In C major, the passage C–D7–G–C is analyzed as I–[V7/V–V]–I, where the brackets show the tonicized area. The cadence V7–I at the end confirms C as the true tonic. If the passage had continued in G with a cadence (D7–G as V7–I in G), the analysis would shift to modulation. The cadence test is the reliable dividing line between tonicization and modulation in real-world analysis.',
      tryThisQuery: 'D7',
      tryThisLabel: 'D7 tonicizes G but does not modulate to it',
    },
  ],
  tasks: [
    {
      id: 'l5u15m4t1',
      instruction:
        "Open 'key of C' and think: if you hear D7 followed by G7 followed by C, the D7 briefly tonicizes G, but the music returns to C. That is tonicization, not modulation.",
      query: 'key of C',
    },
    {
      id: 'l5u15m4t2',
      instruction:
        "Think through an extended tonicization: Am7 (ii/V) to D7 (V7/V) to G (V). Three chords function in the key of G, but the music returns to C. Still tonicization because there is no cadence in G.",
    },
    {
      id: 'l5u15m4t3',
      instruction:
        "Now imagine: D7 to G, then Am to D7 to G with a PAC in G major. The cadence in G confirms this is a modulation, not a tonicization. The cadence is the dividing line.",
    },
  ],
  prerequisites: ['l5u15m3'],

};

const l5u15m5: CurriculumModule = {
  id: 'l5u15m5',
  unitId: 'u15',
  levelId: 'l5',
  title: 'Dominant Chains and Sequential Tonicization',
  subtitle: 'Chains of applied dominants descending by fifths',
  objectives: [
    'Build chains of secondary dominants (each dominant resolves to the next)',
    'Understand sequential tonicization as a descending-fifths pattern with applied dominants',
    'Trace dominant chains on the Circle of Fifths',
  ],
  concepts: [
    {
      title: 'Chains of Secondary Dominants',
      explanation:
        'A chain of dominants where each resolves to the next: V7/vi to V7/ii to V7/V to V7 to I. Each chord is the dominant of the next, creating intense chromatic momentum descending by fifths. In C major: E7 targets Am, A7 targets Dm, D7 targets G, G7 targets C. The chain follows the Circle of Fifths counterclockwise. This technique creates powerful forward motion through accumulated chromatic tension.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See the fifths cycle that chains follow',
    },
    {
      title: 'Sequential Tonicization',
      explanation:
        'A harmonic sequence where each step tonicizes the next diatonic chord. Descending fifths with secondary dominants: V7/IV to IV, V7/iii to iii, V7/ii to ii, V7 to I. Each pair is a miniature V–I in a temporary key. The sequential pattern creates a predictable harmonic rhythm while the chromatic notes add color. This technique is common in Baroque sequences and jazz turnarounds.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — trace diatonic targets through the sequence',
    },
    {
      title: 'Dominant Chains in Practice',
      explanation:
        'The most common chain in jazz and popular music is the "countdown" progression: III7–VI7–II7–V7–I (in C: E7–A7–D7–G7–C). Each dominant seventh resolves down a fifth to the next. This is the backbone of rhythm changes bridges, jazz turnarounds, and countless pop progressions. The chain works because each resolution is a satisfying V7–I, and the overall motion drives relentlessly toward the tonic.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Hear G7 — the final dominant before tonic in any chain',
    },
  ],
  tasks: [
    {
      id: 'l5u15m5t1',
      instruction:
        "Open the Circle of Fifths and trace a dominant chain: E7 targets Am, A7 targets Dm, D7 targets G, G7 targets C. Each step is a fifth — the chain follows the circle counterclockwise.",
      query: 'circle of fifths',
    },
    {
      id: 'l5u15m5t2',
      instruction:
        "Type 'D7' then 'G7' then 'Cmaj7' — this is a chain of dominants. D7 tonicizes G, G7 tonicizes C. The final resolution to Cmaj7 confirms C as the real tonic.",
    },
    {
      id: 'l5u15m5t3',
      instruction:
        "Think through the full chain: E7 to A7 to D7 to G7 to C. Five chords, four dominant resolutions, each descending by fifth. Every chromatic note resolves into the next chord's target.",
    },
  ],
  prerequisites: ['l5u15m4'],

};

// ---------------------------------------------------------------------------
// Level 5, Unit 16: Modulation and Mode Mixture (5 modules)
// ---------------------------------------------------------------------------

const l5u16m1: CurriculumModule = {
  id: 'l5u16m1',
  unitId: 'u16',
  levelId: 'l5',
  title: 'Pivot Chord Modulation',
  subtitle: 'Finding shared chords between keys to modulate smoothly',
  objectives: [
    'Understand the pivot chord concept (a chord with valid function in both keys)',
    'Find pivot chords between any two closely related keys',
    'Analyze the modulatory process: establish key 1, pivot, confirm key 2',
  ],
  concepts: [
    {
      title: 'The Pivot Chord',
      explanation:
        'A pivot chord has a valid Roman numeral analysis in both the old key and the new key. It is the "hinge" — the listener reinterprets it. In a modulation from C major to G major, the chord Am is vi in C and ii in G. If the music pivots through Am, the ear transitions from hearing vi in C to ii in G. The pivot chord is the last chord that makes sense in the old key AND the first chord that makes sense in the new key.',
      tryThisQuery: 'key of G',
      tryThisLabel: 'See G major — common modulation target from C',
    },
    {
      title: 'The Modulatory Process',
      explanation:
        'Five steps: (1) Establish key 1 with a clear progression. (2) Approach a chord that exists in both keys. (3) The pivot chord — reinterpreted by both keys. (4) Follow the pivot with dominant function in the new key (V or V7). (5) Cadence in key 2 to confirm the modulation. The pivot chord makes the key change smooth because the listener does not notice the shift until the new dominant arrives.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — find shared chords with G major',
    },
    {
      title: 'Analysis Notation for Pivot Chords',
      explanation:
        'At the pivot chord, write Roman numerals for both keys. C: I – IV – vi / ii – V7 – I :G. The slash marks the pivot — Am is vi in C and ii in G. Everything before the slash is analyzed in C, everything after in G. This notation makes the double function explicit and shows exactly where the key shift happens.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See key neighbors — each pair shares many pivot chords',
    },
  ],
  tasks: [
    {
      id: 'l5u16m1t1',
      instruction:
        "Open 'key of C' then 'key of G' — list every chord that appears in both keys. Those are your pivot chord options (Am, C, Em, G appear in both).",
      query: 'key of C',
    },
    {
      id: 'l5u16m1t2',
      instruction:
        "Think through a modulation from C to G: play C, Am (pivot — vi in C, ii in G), D7 (V7 in G), G (new tonic). The pivot chord is where the ear shifts.",
    },
    {
      id: 'l5u16m1t3',
      instruction:
        "Open the Circle of Fifths — pick any key and identify its immediate neighbors. Those neighbors share the most chords, making pivot chord modulation easiest between adjacent keys.",
      query: 'circle of fifths',
    },
  ],
  prerequisites: ['l5u15m5'],

};

const l5u16m2: CurriculumModule = {
  id: 'l5u16m2',
  unitId: 'u16',
  levelId: 'l5',
  title: 'Modulation to Closely Related Keys',
  subtitle: 'Practical modulations to V, IV, vi, and relative major/minor',
  objectives: [
    'Identify closely related keys (differ by 0 or 1 accidental)',
    'Execute pivot chord modulations to the dominant (V), subdominant (IV), and relative minor (vi)',
    'Recognize the most common modulation targets in major and minor keys',
  ],
  concepts: [
    {
      title: 'Closely Related Keys',
      explanation:
        'Closely related keys share most of their notes, differing by zero or one accidental. For C major, the closely related keys are: G major (dominant, one sharp), F major (subdominant, one flat), A minor (relative minor), D minor (ii becomes tonic), and E minor (iii becomes tonic). These are the easiest modulations because many chords are shared between the keys. The Circle of Fifths shows them: any key and its immediate neighbors are closely related.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See closely related keys as neighbors on the circle',
    },
    {
      title: 'Modulation to the Dominant (I to V)',
      explanation:
        'The most natural and common modulation in major keys. From C major to G major, shared chords include Am (vi/ii), C (I/IV), Em (iii/vi), G (V/I). The modulation becomes clear when F# appears — it belongs to G major but not C major. A typical path: C – Am – D7 – G. The Am serves as pivot (vi in C, ii in G), D7 is V7 in G, and G cadences the new key.',
      tryThisQuery: 'key of G',
      tryThisLabel: 'See G major — the dominant key of C',
    },
    {
      title: 'Modulation to IV and vi',
      explanation:
        'Modulation to the subdominant (IV): From C major to F major, the arrival of Bb signals the new key. Shared chords include F (IV/I), Am (vi/iii), Dm (ii/vi), C (I/V). Modulation to the relative minor (vi): From C major to A minor, the arrival of G# (leading tone in A minor) confirms the shift. In minor keys, the most common modulation is to the relative major (III) — from A minor to C major.',
      tryThisQuery: 'key of F',
      tryThisLabel: 'See F major — the subdominant key of C',
    },
  ],
  tasks: [
    {
      id: 'l5u16m2t1',
      instruction:
        "Open 'key of C' and 'key of F' — identify shared chords. F major (IV in C, I in F), Dm (ii in C, vi in F), Am (vi in C, iii in F) are all potential pivot chords for modulating to IV.",
      query: 'key of C',
    },
    {
      id: 'l5u16m2t2',
      instruction:
        "Open the Circle of Fifths and pick C major. Count the closely related keys: G (one clockwise), F (one counterclockwise), Am (relative minor), Dm (ii), Em (iii). Five closely related keys total.",
      query: 'circle of fifths',
    },
    {
      id: 'l5u16m2t3',
      instruction:
        "Think through a modulation from C to Am: C – F – Dm (pivot: ii in C, iv in Am) – E7 (V7 in Am) – Am. The E7 with its G# confirms we have left C major.",
    },
  ],
  prerequisites: ['l5u16m1'],

};

const l5u16m3: CurriculumModule = {
  id: 'l5u16m3',
  unitId: 'u16',
  levelId: 'l5',
  title: 'Direct, Common-Tone, and Chromatic Modulation',
  subtitle: 'Modulation without diatonic pivot chords',
  objectives: [
    'Execute direct (phrase) modulation',
    'Understand common-tone modulation',
    'Recognize chromatic modulation (chromatic pivot)',
  ],
  concepts: [
    {
      title: 'Direct (Phrase) Modulation',
      explanation:
        'No pivot chord at all. One phrase ends in key 1, the next phrase begins in key 2. The key change happens between phrases, often with a breath or pause. This is the "truck driver" modulation common in pop music — the final chorus shifts up a half step or whole step for energy. It is the most abrupt type of modulation, relying on surprise rather than harmonic logic.',
      tryThisQuery: 'Db major scale',
      tryThisLabel: 'Hear Db major — a half step up from C',
    },
    {
      title: 'Common-Tone and Chromatic Modulation',
      explanation:
        'In common-tone modulation, one note is sustained or repeated while the harmony shifts to a new key. The held note connects the two key areas like a thread. A sustained G connects C major to Eb major (G is the 5th of C and the 3rd of Eb). In chromatic modulation, a chord is altered chromatically to signal the shift — the altered chord has no diatonic function in the original key. Both are more dramatic than pivot chord modulation.',
      tryThisQuery: 'Eb major scale',
      tryThisLabel: 'Hear Eb major — shares G with C major',
    },
    {
      title: 'Sequential and Enharmonic Modulation',
      explanation:
        'A harmonic sequence carries the music into a new key. The pattern\'s internal logic overrides the need for a pivot. A descending-fifths sequence can gradually shift the tonal center without any single chord functioning as a pivot. The listener follows the pattern rather than the key. Enharmonic modulation (using the same sound spelled differently to pivot between distant keys) is previewed here and treated in full in Level 6.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See how sequences follow the fifths cycle',
    },
  ],
  tasks: [
    {
      id: 'l5u16m3t1',
      instruction:
        "Type 'C major scale' then 'Db major scale' — imagine a song ending a phrase in C and starting the next in Db. That is a direct modulation — up a half step, no pivot needed.",
    },
    {
      id: 'l5u16m3t2',
      instruction:
        "Compare 'key of C' and 'key of Eb' — G is the 5th degree in C and the 3rd degree in Eb. A sustained G could connect these two distant keys via common-tone modulation.",
    },
    {
      id: 'l5u16m3t3',
      instruction:
        "Open the Circle of Fifths and trace: a sequence moving C, F, Bb, Eb gradually modulates from C major into Eb major. The pattern overrides the need for a formal pivot.",
      query: 'circle of fifths',
    },
  ],
  prerequisites: ['l5u16m2'],

};

const l5u16m4: CurriculumModule = {
  id: 'l5u16m4',
  unitId: 'u16',
  levelId: 'l5',
  title: 'Mode Mixture — Borrowed Chords',
  subtitle: 'Borrowing chords from the parallel minor for expressive color',
  objectives: [
    'Borrow chords from the parallel minor into a major-key context',
    'Identify the most common borrowed chords: bVI, bIII, bVII, iv, iio',
    'Understand how lowered scale degrees create chromatic voice leading',
  ],
  concepts: [
    {
      title: 'What Is Mode Mixture?',
      explanation:
        'Mode mixture means borrowing chords from the parallel key. In C major, the parallel key is C minor. Borrowing brings C-minor-family chords into a C major context. The result: unexpected darkness, wistfulness, or emotional depth that pure major harmony cannot achieve. The most common borrowed chords are iv (Fm), bVI (Ab), bVII (Bb), bIII (Eb), and iio (Ddim). Each adds a distinct color.',
      tryThisQuery: 'Ab major chord',
      tryThisLabel: 'Hear Ab — the bVI borrowed chord in C major',
    },
    {
      title: 'The Most Common Borrowed Chords',
      explanation:
        'iv (F minor in C) replaces IV with a dark subdominant. bVI (Ab major in C) is dramatic and cinematic — the Hollywood chord. bVII (Bb major in C) creates a rock cadence or modal feel. bIII (Eb major in C) sounds surprisingly bright despite containing a flat. These chords share lowered scale degrees (b3, b6, b7) from the parallel minor. The chromatic voice leading between diatonic and borrowed chords is part of what makes mode mixture so effective.',
      tryThisQuery: 'Fm',
      tryThisLabel: 'Hear Fm — the iv borrowed chord in C major',
    },
    {
      title: 'Voice Leading with Borrowed Chords',
      explanation:
        'Chromatic notes from borrowed chords follow their natural tendencies: lowered notes (b3, b6, b7) resolve downward. When iv (Fm) moves to I (C), the Ab in Fm falls to G in C major — smooth chromatic voice leading. When bVI (Ab) moves to V (G), the Ab falls to G by half step. These chromatic connections are part of what makes mode mixture so expressive. The color comes not just from the chord, but from the motion into and out of it.',
      tryThisQuery: 'Bb major chord',
      tryThisLabel: 'Hear Bb — the bVII borrowed chord in C major',
    },
  ],
  tasks: [
    {
      id: 'l5u16m4t1',
      instruction:
        "Type 'Ab major chord' in the context of C major — Ab contains Ab, C, Eb. The Ab and Eb are borrowed from C minor. This is bVI, the most cinematic borrowed chord.",
      query: 'Ab major chord',
    },
    {
      id: 'l5u16m4t2',
      instruction:
        "Compare 'F major chord' (diatonic IV) with 'Fm' (borrowed iv). The only difference is one note: A becomes Ab. That single chromatic change transforms the emotional character.",
    },
    {
      id: 'l5u16m4t3',
      instruction:
        "Type 'Bb major chord' — this is bVII in C major, borrowed from C minor. It is everywhere in rock and pop. Now type 'C major chord' to hear the bVII to I resolution.",
    },
  ],
  prerequisites: ['l5u16m3'],
};

const l5u16m5: CurriculumModule = {
  id: 'l5u16m5',
  unitId: 'u16',
  levelId: 'l5',
  title: 'Picardy Third and Mode Mixture in Minor',
  subtitle: 'Borrowing from parallel major into a minor-key context',
  objectives: [
    'Understand the Picardy third (major I ending a minor-key piece)',
    'Identify mode mixture in minor keys (borrowing from parallel major)',
    'Recognize the expressive effect of major chords in a minor context',
  ],
  concepts: [
    {
      title: 'The Picardy Third',
      explanation:
        'The Picardy third is mode mixture in the opposite direction: borrowing from parallel major into a minor key. A minor-key piece ends its final cadence on a major tonic (I instead of i). In C minor, the final chord becomes C major — the raised third (E natural instead of Eb) creates unexpected brightness, a ray of light at the end. Common in Baroque and Renaissance music, where minor-key pieces often end with a Picardy third, especially in late-Renaissance and early-Baroque cadences.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear C major — the Picardy third in a C minor context',
    },
    {
      title: 'Mode Mixture in Minor Keys',
      explanation:
        'Borrowing from parallel major into minor is less common but effective. Using IV (major) instead of iv (minor), or using I (major) instead of i (minor) at internal cadences. In C minor: F major (IV borrowed from C major) replaces the expected Fm. The raised note (A natural instead of Ab) adds brightness without leaving the minor key. This technique creates moments of warmth within an otherwise dark harmonic landscape.',
      tryThisQuery: 'F major chord',
      tryThisLabel: 'Hear F major — IV borrowed into C minor',
    },
    {
      title: 'The Expressive Range of Mode Mixture',
      explanation:
        'Mode mixture in both directions gives composers an enormous expressive palette. Major keys can darken by borrowing from minor (bVI, iv, bVII). Minor keys can brighten by borrowing from major (Picardy third, major IV). The ability to move freely between major and minor versions of chords built on the same roots is one of the defining features of Romantic-era harmony. It blurs the major/minor boundary entirely.',
      tryThisQuery: 'C minor scale',
      tryThisLabel: 'See C minor — the parallel key that lends and borrows',
    },
  ],
  tasks: [
    {
      id: 'l5u16m5t1',
      instruction:
        "Type 'C minor scale' to establish the minor context. Now type 'C major chord' — that raised third (E natural instead of Eb) is the Picardy third. Bright ending to a dark key.",
      query: 'C minor scale',
    },
    {
      id: 'l5u16m5t2',
      instruction:
        "Compare 'Fm' (diatonic iv in C minor) with 'F major chord' (borrowed IV from C major). The A natural instead of Ab adds a surprising warmth to the minor-key context.",
    },
    {
      id: 'l5u16m5t3',
      instruction:
        "Think through a minor-key ending with Picardy third: Dm7b5 (iiø7 in C minor), G7 (V7), then C major chord (Picardy I instead of Cm). The major ending transforms the entire emotional character of the cadence.",
    },
  ],
  prerequisites: ['l5u16m4'],
};

// ---------------------------------------------------------------------------
// Level 5, Unit 17: Form, Texture, and Voice Leading (4 modules)
// ---------------------------------------------------------------------------

const l5u17m1: CurriculumModule = {
  id: 'l5u17m1',
  unitId: 'u17',
  levelId: 'l5',
  title: 'Binary and Ternary Forms',
  subtitle: 'Two-part and three-part musical structures',
  objectives: [
    'Analyze binary form (simple, rounded, balanced)',
    'Analyze ternary form (ABA, composite)',
    'Distinguish sectional from continuous forms',
  ],
  concepts: [
    {
      title: 'Binary Form',
      explanation:
        "Binary form has two sections, each usually repeated. Simple binary (AB): the first section moves away from tonic (modulates or ends on V), the second returns. Rounded binary (ABA'): the A material returns at the end of the B section, providing closure. This is extremely common and is the basis of sonata form. Balanced binary: both sections end with the same material even if they begin differently. Most Baroque dances use binary form.",
      tryThisQuery: 'key of G',
      tryThisLabel: 'See G major — common second-section key in binary form',
    },
    {
      title: 'Ternary Form',
      explanation:
        'Ternary form (ABA) has three sections: statement, contrast, return. Each section is self-contained with its own cadences. The B section provides contrast — different key, different mood, different thematic material. Composite ternary nests forms within forms — Minuet and Trio is a composite ternary where each part is itself binary. The return of A after contrasting B material creates one of the most satisfying structures in music.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See C major — the "home key" that A sections return to',
    },
    {
      title: 'Sectional vs. Continuous',
      explanation:
        'A sectional form has clear boundaries: each section ends with a strong cadence in its own key and could stand alone. A continuous form flows between sections without strong internal cadences — the music pushes forward across section boundaries. The same letter-scheme (AB, ABA) can be either sectional or continuous. Sectional feels more like separate rooms; continuous feels like one flowing space divided by curtains.',
      tryThisQuery: 'key of F',
      tryThisLabel: 'See F major — common contrasting key area in form',
    },
  ],
  tasks: [
    {
      id: 'l5u17m1t1',
      instruction:
        "Think of a song you know well. Can you identify the sections? Label them with letters: A for the first idea, B for contrasting material, A' if the first idea returns with changes.",
    },
    {
      id: 'l5u17m1t2',
      instruction:
        "Open 'key of C' then 'key of G' — in binary form, the first section often modulates from C to G (tonic to dominant). The second section returns to C. This tonal plan creates the two-part structure.",
    },
    {
      id: 'l5u17m1t3',
      instruction:
        "Consider ternary form: A section in C major, B section modulates to G major for contrast, then A returns in C major. The key scheme reinforces the three-part structure.",
    },
  ],
  prerequisites: ['l5u16m5'],

};

const l5u17m2: CurriculumModule = {
  id: 'l5u17m2',
  unitId: 'u17',
  levelId: 'l5',
  title: 'Song Forms and Large Forms Introduction',
  subtitle: 'Verse-chorus, AABA, sonata form, rondo, and theme & variations',
  objectives: [
    'Recognize song forms (verse-chorus, AABA, strophic)',
    'Understand sonata form (exposition, development, recapitulation)',
    'Know rondo form and theme and variations structure',
  ],
  concepts: [
    {
      title: 'Song Forms',
      explanation:
        'Strophic form uses the same music for each verse — simple and repetitive (hymns, folk songs). Verse-chorus alternates changing verses with a fixed chorus — the most common pop form. AABA (32-bar form) has four eight-bar sections: A (theme), A (repeat), B (bridge/contrast), A (return) — standard in jazz standards. Through-composed has no repeated sections, used for narrative songs where the music follows the text.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See C major — typical home key for song form analysis',
    },
    {
      title: 'Sonata Form',
      explanation:
        'The crown jewel of Classical form. Three large sections: (1) Exposition — two theme groups in contrasting keys (first theme in tonic, second in dominant or relative major), usually repeated. (2) Development — themes are fragmented, recombined, and modulated through many keys. The most harmonically adventurous section. (3) Recapitulation — the exposition returns, but now both themes are in the tonic. The tonal conflict is resolved. Optional slow introduction and coda.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — typical first-theme key',
    },
    {
      title: 'Rondo and Theme & Variations',
      explanation:
        'In rondo form, a main theme (A) alternates with contrasting episodes. Five-part rondo: A–B–A–C–A. Seven-part rondo: A–B–A–C–A–B–A. The recurring A provides familiarity; the episodes provide variety. Common in Classical finales. Theme and variations states a theme and then repeats it with changes: melodic, harmonic, rhythmic, modal (major/minor switch), or character variation. Chaconne and passacaglia keep the bass line constant while upper voices vary.',
      tryThisQuery: 'C minor scale',
      tryThisLabel: 'See C minor — modal variation of C major',
    },
  ],
  tasks: [
    {
      id: 'l5u17m2t1',
      instruction:
        'Consider verse-chorus form: the verse changes lyrics each time (A, A\', A\'\') while the chorus stays the same (B). How does this compare to AABA form where A repeats before the bridge?',
    },
    {
      id: 'l5u17m2t2',
      instruction:
        "Sonata form practice: open 'key of C' (tonic) and 'key of G' (dominant). In the exposition, theme 1 is in C, theme 2 is in G. In the recapitulation, both themes return in C.",
    },
    {
      id: 'l5u17m2t3',
      instruction:
        "Type 'C major scale' then 'C minor scale' — switching from major to minor is one of the most common variation techniques (modal variation). Same tonic, completely different character.",
    },
  ],
  prerequisites: ['l5u17m1'],

};

const l5u17m3: CurriculumModule = {
  id: 'l5u17m3',
  unitId: 'u17',
  levelId: 'l5',
  title: 'Texture',
  subtitle: 'Monophonic, homophonic, polyphonic, and other texture types',
  objectives: [
    'Identify the five texture types by ear',
    'Understand how texture choice affects musical character',
    'Recognize texture changes within a piece',
  ],
  concepts: [
    {
      title: 'Monophony and Homophony',
      explanation:
        'Monophony is a single melodic line with no accompaniment — everyone performs the same melody, possibly in octaves. Gregorian chant and unaccompanied solo melodies are monophonic. Pure, focused, exposed. Homophony is one melody with chordal accompaniment — the melody dominates while other voices support. This is the most common texture in Western music: pop songs, hymns, Classical piano writing, orchestral melody with accompaniment.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play a single melodic line — monophonic texture',
    },
    {
      title: 'Polyphony and Counterpoint',
      explanation:
        'Polyphony means two or more independent melodies sounding simultaneously, each with its own rhythmic and melodic interest. Fugues, inventions, and Renaissance motets are polyphonic. Homorhythm is a specific texture where all voices move in the same rhythm but with different pitches — chorale-style writing. Heterophony occurs when multiple performers play the same melody simultaneously with individual variations, common in folk traditions.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — home key for counterpoint examples',
    },
    {
      title: 'Texture Changes Within a Piece',
      explanation:
        'Most pieces use multiple textures. A symphonic movement might begin with a monophonic theme, develop it homophonically with orchestral accompaniment, build to a polyphonic climax, and return to homophony. Texture changes are a primary tool for creating contrast and structure. A shift from homophony to polyphony increases complexity and intensity; a shift back provides relief and clarity.',
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Play a melody line — imagine adding accompaniment',
    },
  ],
  tasks: [
    {
      id: 'l5u17m3t1',
      instruction:
        'Play a single scale on the piano — that is monophonic texture. Now play a chord underneath a melody note — that is homophonic texture. The distinction is whether the accompaniment has independent melodic interest.',
    },
    {
      id: 'l5u17m3t2',
      instruction:
        'Think of five songs you know. Classify each by its primary texture: monophonic (solo unaccompanied), homophonic (melody + chords), or polyphonic (multiple independent melodies).',
    },
    {
      id: 'l5u17m3t3',
      instruction:
        'Consider a hymn: all voices move in the same rhythm with different pitches. That is homorhythm, a specific type of homophony. Compare with a fugue where each voice enters separately with the same melody.',
    },
  ],
  prerequisites: ['l5u17m2'],

};

const l5u17m4: CurriculumModule = {
  id: 'l5u17m4',
  unitId: 'u17',
  levelId: 'l5',
  title: 'Guide Tone Lines',
  subtitle: 'Tracing 3rds and 7ths through progressions',
  objectives: [
    'Define guide tones as the 3rds and 7ths of chords',
    'Trace guide tone lines through progressions',
    'Use guide tone voice leading as a composition tool',
  ],
  concepts: [
    {
      title: 'What Are Guide Tones?',
      explanation:
        'The 3rd and 7th of each chord are the notes that define its quality. The root tells you the chord name; the 3rd tells you major or minor; the 7th tells you the chord type (major 7th, dominant 7th, minor 7th). Together, the 3rd and 7th ARE the chord\u2019s identity. A bass player covering the root plus a pianist playing only the 3rd and 7th gives you a complete harmonic picture. Everything else is color.',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'See Dm7 — 3rd is F, 7th is C',
    },
    {
      title: 'Tracing Guide Tone Lines Through ii–V–I',
      explanation:
        'When you trace the 3rds and 7ths through a ii–V–I progression in C major, they form smooth voice-leading lines. Dm7: 3rd = F, 7th = C. G7: 3rd = B, 7th = F. Cmaj7: 3rd = E, 7th = B. The 7th of each chord becomes the 3rd of the next (C (7th of Dm7) drops to B (3rd of G7); F (7th of G7) drops to E (3rd of Cmaj7)). For improvisers, targeting guide tones guarantees you hit the essential chord tones. For arrangers, guide tone lines are the skeleton of inner voice parts.',
      tryThisQuery: 'G7',
      tryThisLabel: 'See G7 — 3rd is B, 7th is F',
    },
    {
      title: 'Guide Tones as a Composition and Improvisation Tool',
      explanation:
        'Guide tone voice leading is the Berklee approach to smooth inner-voice writing. To compose an arrangement, start with bass notes (roots or inversions) and guide tones (3rds and 7ths), then fill in color tones (5ths, extensions, alterations) around that skeleton. For improvisation, playing only the guide tones of a chord progression outlines the harmony with maximum efficiency — a bass player covering roots plus a pianist playing 3rds and 7ths gives a complete harmonic picture. Guide tone awareness transforms random note choices into targeted, harmonically connected lines.',
      tryThisQuery: 'Cmaj7',
      tryThisLabel: 'See Cmaj7 — 3rd is E, 7th is B',
    },
  ],
  tasks: [
    {
      id: 'l5u17m4t1',
      instruction:
        "Type 'Dm7' and find the 3rd (F) and 7th (C). Now type 'G7' — the 3rd is B and the 7th is F. Notice: the 7th of Dm7 (C) moved down to B (3rd of G7), and the 3rd of Dm7 (F) stayed as the 7th of G7.",
      query: 'Dm7',
    },
    {
      id: 'l5u17m4t2',
      instruction:
        "Type 'G7' then 'Cmaj7' — trace the guide tones: G7's 3rd (B) becomes Cmaj7's 7th (B, common tone). G7's 7th (F) drops to Cmaj7's 3rd (E). Every connection is stepwise or static.",
      query: 'G7',
    },
    {
      id: 'l5u17m4t3',
      instruction:
        "Play the full ii–V–I: 'Dm7', 'G7', 'Cmaj7'. The guide tone lines are F–F–E (descending by step) and C–B–B (descending by step then holding). This is the smoothest voice leading in tonal music.",
    },
  ],
  prerequisites: ['l5u17m3'],
};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

export const L5_UNITS: CurriculumUnit[] = [
  {
    id: 'u15',
    levelId: 'l5',
    title: 'Secondary Dominants and Tonicization',
    description:
      'Applied dominants, secondary leading-tone chords, tonicization, and dominant chains',
    icon: 'chords',
    modules: [l5u15m1, l5u15m2, l5u15m3, l5u15m4, l5u15m5],
    milestone: {
      skillsSummary: [
        'Build secondary dominants (V/X) for every diatonic target, including V7/V',
        'Build secondary leading-tone chords (viio/X) as dominant substitutes',
        'Distinguish tonicization from modulation and trace dominant chains descending by fifths',
      ],
      bridgeText:
        'You can now inject chromatic tension into any diatonic progression and chain dominants for momentum. Next you\u2019ll learn how to leave the key entirely — through modulation — and how to borrow chords from the parallel key for expressive color.',
      tryThisQuery: 'D7',
      tryThisLabel: 'Play D7 (V7/V in C major)',
      tryThisPrompt:
        'What note inside D7 is chromatic in C major? Where does it want to resolve?',
    },
  },
  {
    id: 'u16',
    levelId: 'l5',
    title: 'Modulation and Mode Mixture',
    description:
      'Pivot chord modulation, closely related keys, other modulation types, and modal borrowing',
    icon: 'harmony',
    modules: [l5u16m1, l5u16m2, l5u16m3, l5u16m4, l5u16m5],
    milestone: {
      skillsSummary: [
        'Execute pivot chord modulations to closely related keys (V, IV, vi)',
        'Recognize direct, common-tone, chromatic, and sequential modulation types',
        'Borrow chords from the parallel key in both directions (mode mixture in major and minor, Picardy third)',
      ],
      bridgeText:
        'You can now leave a key and return, borrow chords across mode boundaries, and navigate chromatic harmony with confidence. The final unit explores musical form, texture, and guide tone voice leading — the tools for understanding how entire pieces are structured.',
      tryThisQuery: 'Ab major chord',
      tryThisLabel: 'Play Ab (bVI borrowed chord in C major)',
      tryThisPrompt:
        'Which notes in Ab major are chromatic in C major? What parallel key do they come from?',
    },
  },
  {
    id: 'u17',
    levelId: 'l5',
    title: 'Form, Texture, and Voice Leading',
    description:
      'Musical forms, texture types, and guide tone voice leading',
    icon: 'scales',
    modules: [l5u17m1, l5u17m2, l5u17m3, l5u17m4],
    milestone: {
      skillsSummary: [
        'Analyze binary, ternary, and song forms with letter labels',
        'Identify sonata form, rondo, and theme-and-variations structures',
        'Trace guide tone lines (3rds and 7ths) through chord progressions for smooth voice leading',
      ],
      bridgeText: '',
      tryThisQuery: 'Dm7',
      tryThisLabel: 'Start a ii–V–I guide tone trace',
      tryThisPrompt:
        'Find the 3rd and 7th of Dm7. Can you predict where each moves in G7?',
    },
  },
];
