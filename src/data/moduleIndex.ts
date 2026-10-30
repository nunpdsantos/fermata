/**
 * Lightweight static index of all 118 curriculum modules for search.
 *
 * Extracted from src/core/constants/curriculumL1-9.ts at build time
 * (see README.md / scripts/extractModuleIndex.ts for regeneration).
 *
 * The index is eager (~20 KB) so Cmd+K search returns Learn-module hits
 * instantly without triggering the lazy-loaded curriculum chunks.
 */

export interface ModuleIndexEntry {
  /** Module id, e.g. "l1u3m4" */
  id: string;
  /** Level id: "l1" through "l9" */
  level: string;
  /** Unit id: "u1", "u3" etc. */
  unitId: string;
  /** Module position in its unit (1-indexed) */
  moduleIndex: number;
  /** Display title in English */
  title: string;
  /** Display subtitle in English */
  subtitle: string;
  /** Extra search keywords not present in the title/subtitle. Lowercase. */
  keywords: string[];
}

/**
 * Concept keywords per module. Only populate entries whose titles don't
 * already carry the search terms a student might type. Lowercase.
 */
const EXTRA_KEYWORDS: Record<string, string[]> = {
  // Modes bundled into generic titles
  'l7u22m4': ['dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian', 'ionian', 'modal'],
  'l7u23m3': ['dorian b2', 'lydian augmented', 'lydian dominant', 'mixolydian b6', 'altered', 'super locrian'],
  'l7u23m4': ['phrygian dominant', 'hungarian', 'double harmonic', 'whole tone', 'diminished', 'octatonic'],
  'l9u31m2': ['dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian', 'ionian', 'modes', 'church modes'],
  // Chord types that aren't title-obvious
  'l2u7m3': ['triad', 'triads', 'major triad', 'minor triad', 'diminished triad', 'augmented triad'],
  'l3u9m1': ['maj7', 'm7', 'dominant 7', 'half diminished', 'diminished 7', 'seventh chord'],
  'l4u12m4': ['tritone', 'dominant seventh', 'v7 resolution'],
  'l7u21m1': ['maj9', 'add9', 'm11', 'alt', 'sus2', 'sus4', 'extensions'],
  // Pop / jazz subjects
  'l7u21m3': ['ii-v-i', '2-5-1', 'ii V I', 'jazz standard', 'turnaround'],
  'l7u21m5': ['12 bar', '12-bar', 'blues', 'shuffle'],
  'l7u23m1': ['nashville numbers', 'pop progression', '1-5-6-4', 'four chords'],
  // Ear training handles
  'l9u30m3': ['interval', 'perfect fifth', 'perfect fourth', 'major third', 'minor third', 'second', 'unison'],
  'l9u30m4': ['minor sixth', 'major sixth', 'minor seventh', 'major seventh', 'octave', 'interval'],
  'l9u31m4': ['triad quality', 'major', 'minor', 'diminished', 'augmented', 'ear'],
  // Form and large forms
  'l5u17m2': ['sonata', 'rondo', 'aaba', 'verse chorus', 'theme variations', 'song form'],
  'l8u26m1': ['sonata', 'exposition', 'recapitulation', 'development'],
  'l8u25m1': ['fugue', 'subject', 'answer', 'countersubject'],
  // Counterpoint
  'l4u14m1': ['counterpoint', 'species', 'first species', 'second species'],
  'l6u20m1': ['counterpoint', 'cantus firmus', 'species', 'florid'],
  // 20th century
  'l8u27m1': ['set theory', 'pitch class', 'forte'],
  'l8u27m2': ['twelve-tone', 'serialism', 'tone row', 'schoenberg'],
};

const RAW: Array<[string, string, string]> = [
  ['l1u1m1', 'The Staff and Clefs', 'The five-line grid that maps pitch to paper'],
  ['l1u1m2', 'Ledger Lines and the Grand Staff', 'Extending the staff and connecting treble and bass'],
  ['l1u1m3', 'Half Steps, Whole Steps, and Accidentals', 'The smallest distances in music and the symbols that modify pitch'],
  ['l1u1m4', 'The Chromatic Scale', 'All 12 notes in order — the complete pitch vocabulary'],
  ['l1u2m1', 'Note Values and Rests', 'How long notes last — from whole notes to sixteenth notes'],
  ['l1u2m2', 'Meter and Time Signatures', 'How beats group into measures — 2/4, 3/4, and 4/4'],
  ['l1u3m1', 'The Major Scale', 'The W-W-H-W-W-W-H pattern that defines major tonality'],
  ['l1u3m2', 'Key Signatures — First Four Keys', 'C, G, D, and F — the keys you will use most'],
  ['l1u3m3', 'Intervals by Number', 'Measuring distance between notes — unison through octave'],
  ['l1u3m4', 'Your First Chords — Major Triads', 'Three notes that sound complete — root, major third, perfect fifth'],
  ['l2u4m1', 'All Major Keys and the Circle of Fifths', 'The full set of 15 major key signatures and how they connect'],
  ['l2u4m2', 'Scale Degree Names and Functions', 'The seven functional names every musician must know'],
  ['l2u5m1', 'Natural Minor Scale', 'The W-H-W-W-H-W-W pattern and the darker side of tonality'],
  ['l2u5m2', 'Harmonic and Melodic Minor', 'Why three forms of minor exist — and what each one solves'],
  ['l2u5m3', 'Relative and Parallel Keys', 'Two ways to connect major and minor'],
  ['l2u6m1', 'Compound Meter: 6/8, 9/8, 12/8', 'When beats divide into three — the lilting feel of compound time'],
  ['l2u6m2', 'Syncopation and Triplets', 'Rhythms that push against the beat — accents on weak beats and borrowed divisions'],
  ['l2u7m1', 'Interval Quality: Perfect, Major, Minor', 'Classifying intervals by both number and quality'],
  ['l2u7m2', 'Augmented, Diminished, and Compound Intervals', 'The outer edges of interval quality and intervals beyond the octave'],
  ['l2u7m3', 'The Four Triad Types', 'Major, minor, diminished, augmented — building and identifying all four'],
  ['l2u7m4', 'Triad Inversions and Figured Bass', 'Same notes, different bass — root position, first inversion, second inversion'],
  ['l2u7m5', 'Diatonic Triads and Roman Numerals', 'The seven chords that belong to every major key — and how to name them'],
  ['l3u9m1', 'Seventh Chords: The Five Qualities', 'Build and identify all five standard seventh chord types and hear their distinct characters'],
  ['l3u9m2', 'Seventh Chord Inversions', 'Four positions for every seventh chord — root position through third inversion'],
  ['l3u9m3', 'Diatonic Seventh Chords in Major', 'Seventh chords on every degree of the major scale and the dominant seventh as harmonic engine'],
  ['l3u9m4', 'Diatonic Seventh Chords in Minor', 'Harmonic minor\u2019s seventh chord landscape — from the haunting i(m\u0394 7) to the explosive viio7'],
  ['l3u10m1', 'Voice Leading — SATB Basics', 'SATB voicing, ranges, spacing rules, and doubling conventions'],
  ['l3u10m2', 'Forbidden Parallels and Voice Motion (in Common-Practice Style)', 'The four motion types and the parallel fifths/octaves rules that govern part writing'],
  ['l3u10m3', 'Root Position Part Writing', 'Connecting root-position triads with smooth voice leading by root motion type'],
  ['l3u10m4', 'Triads in Inversion', 'When and why to use inverted triads — including the restricted second inversion'],
  ['l3u11m1', 'Cadences: The Complete Set', 'All six standard cadence types — the harmonic punctuation that shapes musical phrases'],
  ['l3u11m2', 'Phrases and Periods', 'Musical sentences, antecedent-consequent pairs, and the sentence (Satz) structure'],
  ['l3u11m3', 'Harmonic Rhythm', 'How the rate of chord change shapes musical momentum and phrase structure'],
  ['l3u11m4', 'Non-Chord Tones (Part 1)', 'Passing tones, neighbor tones, and anticipations — the seasoning of melody'],
  ['l3u11m5', 'Transposition', 'Moving music to any key while preserving all interval relationships'],
  ['l4u12m1', 'Suspensions', 'The 4-3, 7-6, 9-8, and 2-3 suspension types'],
  ['l4u12m2', 'Appoggiatura, Escape Tone, and Retardation', 'Accented and unaccented non-chord tones approached by leap or resolved upward'],
  ['l4u12m3', 'Pedal Point and Changing Tones', 'Sustained bass notes and double-neighbor ornaments'],
  ['l4u12m4', 'The Dominant Seventh — Resolution Rules', 'V7 tendency tones, voice leading, and the tritone resolution'],
  ['l4u12m5', 'V7 Inversions and Their Resolutions', 'How V6/5, V4/3, and V4/2 resolve to tonic positions'],
  ['l4u13m1', 'Pre-Dominant Seventh Chords: ii7 and IV7', 'The strongest pre-dominant sonorities and the ii7-V7-I progression'],
  ['l4u13m2', 'Mediant, Submediant, and Tonic Sevenths', 'iii7, vi7, Imaj7 — tonic-function sevenths and the jazz tonic'],
  ['l4u13m3', 'Leading-Tone Sevenths: vii\u00f87 and viio7', 'Half-diminished and fully diminished seventh chords as dominant substitutes'],
  ['l4u13m4', 'Harmonic Function: T \u2192 PD \u2192 D \u2192 T', 'Tonic, Pre-Dominant, and Dominant — the three pillars of tonal harmony'],
  ['l4u13m5', 'Harmonic Sequences', 'Repeating harmonic patterns that create directed motion through a key'],
  ['l4u14m1', 'First and Second Species Counterpoint', 'Combining independent melodies with consonance and dissonance rules'],
  ['l4u14m2', 'Asymmetric and Mixed Meters', 'Counting in 5, 7, and beyond — additive and mixed meters'],
  ['l4u14m3', 'Chromatic Embellishment', 'Adding chromatic color to diatonic harmony without changing the key'],
  ['l4u14m4', 'Roman Numeral Analysis Practice', 'Analyzing real harmonic progressions with full Roman numeral notation'],
  ['l4u14m5', 'Minor Key Harmony in Detail', 'How three minor scale forms create a fluid, expanded chord vocabulary'],
  ['l5u15m1', 'Secondary Dominants: V/V and V7/V', 'The dominant of the dominant — your first applied chord'],
  ['l5u15m2', 'Secondary Dominants of ii, iii, IV, vi', 'Applied dominants for every diatonic target'],
  ['l5u15m3', 'Secondary Leading-Tone Chords', 'Building and resolving viio/X chords'],
  ['l5u15m4', 'Tonicization vs. Modulation', 'Distinguishing brief tonicization from permanent key change'],
  ['l5u15m5', 'Dominant Chains and Sequential Tonicization', 'Chains of applied dominants descending by fifths'],
  ['l5u16m1', 'Pivot Chord Modulation', 'Finding shared chords between keys to modulate smoothly'],
  ['l5u16m2', 'Modulation to Closely Related Keys', 'Practical modulations to V, IV, vi, and relative major/minor'],
  ['l5u16m3', 'Direct, Common-Tone, and Chromatic Modulation', 'Modulation without diatonic pivot chords'],
  ['l5u16m4', 'Mode Mixture — Borrowed Chords', 'Borrowing chords from the parallel minor for expressive color'],
  ['l5u16m5', 'Picardy Third and Mode Mixture in Minor', 'Borrowing from parallel major into a minor-key context'],
  ['l5u17m1', 'Binary and Ternary Forms', 'Two-part and three-part musical structures'],
  ['l5u17m2', 'Song Forms and Large Forms Introduction', 'Verse-chorus, AABA, sonata form, rondo, and theme & variations'],
  ['l5u17m3', 'Texture', 'Monophonic, homophonic, polyphonic, and other texture types'],
  ['l5u17m4', 'Guide Tone Lines', 'Tracing 3rds and 7ths through progressions'],
  ['l6u18m1', 'The Neapolitan Chord (bII)', 'A dramatic chromatic pre-dominant built on the lowered second degree'],
  ['l6u18m2', 'Italian and French Augmented Sixth Chords', 'The augmented sixth interval and its two simpler national varieties'],
  ['l6u18m3', 'German Augmented Sixth and Its Dual Identity', 'The Gr+6 chord and its enharmonic equivalence with the dominant seventh'],
  ['l6u18m4', 'Enharmonic Modulation: Gr+6 \u2194 V7', 'Pivoting between distant keys by reinterpreting the German sixth as a dominant seventh'],
  ['l6u19m1', 'Enharmonic Modulation: Diminished Seventh', 'Four-way enharmonic flexibility of the fully diminished seventh chord'],
  ['l6u19m2', 'Common-Tone Diminished Seventh', 'The CTo7 chord as a chromatic embellishment sharing a common tone with its target'],
  ['l6u19m3', 'Chromatic Mediants and Altered Dominants', 'Third-related chromatic chords, altered dominants, and the omnibus progression'],
  ['l6u19m4', 'Late Romantic Harmonic Techniques', 'Nonfunctional harmony, chromatic planing, and the dissolution of tonality'],
  ['l6u20m1', 'Species Counterpoint: First through Third Species', 'Cantus firmus, note-against-note, 2:1, and 4:1 counterpoint'],
  ['l6u20m2', 'Species Counterpoint: Fourth and Fifth Species', 'Syncopated counterpoint, suspensions, and florid counterpoint'],
  ['l6u20m3', 'Three-Part Counterpoint and Invertible Counterpoint', 'Multi-voice counterpoint and invertible techniques at the octave, tenth, and twelfth'],
  ['l6u20m4', 'Advanced Part Writing and Score Reading', 'SATB harmonization, figured bass realization, and orchestral score reading'],
  ['l7u21m1', 'Jazz Chord Symbols and Extensions', 'The letter-based chord language of jazz — qualities, extensions, and alterations'],
  ['l7u21m2', 'Shell Voicings and Altered Chords', 'Root-3rd-7th shells, the alt chord, and suspended dominants'],
  ['l7u21m3', 'The ii-V-I Progression', 'The foundational unit of jazz harmony — in major and minor keys'],
  ['l7u21m4', 'Tritone Substitution', 'Replacing dominants a tritone away for chromatic bass motion'],
  ['l7u21m5', 'Blues Forms', 'The 12-bar blues, jazz blues, and minor blues'],
  ['l7u21m6', 'Rhythm Changes and Turnarounds', 'The AABA form, turnaround patterns, and the cycle of dominants'],
  ['l7u22m1', 'Chord-Scale Theory', 'Matching scales to chord symbols — a foundational approach to jazz improvisation'],
  ['l7u22m2', 'Upper Structures and Reharmonization', 'Voicing complex chords with simple triads, and enriching progressions'],
  ['l7u22m3', 'Coltrane Changes and Advanced Jazz Harmony', 'Giant Steps matrix, constant structure, and three-key-center architecture'],
  ['l7u22m4', 'Modal Harmony Fundamentals', 'Composing outside tonal gravity — modes as harmonic systems'],
  ['l7u22m5', 'Quartal/Quintal Voicings and Drones', 'Stacking fourths and fifths for ambiguous, open modal sounds'],
  ['l7u23m1', 'Pop Progressions and Nashville Numbers', 'Pop chord loops, the Nashville Number System, and loop-based harmony'],
  ['l7u23m2', 'Modal Mixture and Chromatic Mediants in Pop', 'Borrowed chords in pop and rock, chromatic mediants in film scores'],
  ['l7u23m3', 'Scales: Melodic Minor Modes', 'Seven modes of melodic minor and their jazz applications'],
  ['l7u23m4', 'Scales: Harmonic Minor Modes, Symmetric, and World', 'Harmonic minor modes, whole-tone, diminished, and world scales'],
  ['l7u23m5', 'Complete Chord Taxonomy', 'Every chord type in the engine — extended, suspended, added-tone, and special structures'],
  ['l8u25m1', 'Fugue: Exposition and Subject/Answer', 'Fugue exposition structure, subject vs. answer, and the countersubject'],
  ['l8u25m2', 'Fugue: Episodes, Stretto, and Devices', 'Transitional episodes, stretto technique, and subject transformations'],
  ['l8u25m3', 'Canon and Other Imitative Forms', 'Canons at various intervals and special types'],
  ['l8u26m1', 'Sonata Form in Depth', 'Exposition, development, and recapitulation in full sectional detail'],
  ['l8u26m2', 'Variation, Rondo, and Ritornello Forms', 'Theme and variations, chaconne, passacaglia, rondo, and ritornello'],
  ['l8u26m3', 'Orchestration and Instrumentation Awareness', 'Orchestral families, timbres, doublings, and transposition'],
  ['l8u27m1', 'Pitch-Class Sets and Set Theory', 'Pitch class, interval class, normal order, prime form, ICV, and Forte numbers'],
  ['l8u27m2', 'Twelve-Tone Technique', 'Tone rows, P/R/I/RI forms, the twelve-tone matrix, and combinatoriality'],
  ['l8u27m3', '20th-Century Techniques: Planing, Polytonality, Pandiatonicism', 'Quartal harmony, parallel motion, bitonality, and free diatonicism'],
  ['l8u27m4', 'Minimalism, Aleatory, and Extended Techniques', 'Phase shifting, additive process, chance music, and new sonic resources'],
  ['l8u27m5', 'Advanced Rhythm: Polyrhythm, Hemiola, Metric Modulation', 'Complex tuplets, cross-rhythms, polyrhythm, and metric modulation'],
  ['l9u30m1', 'Pitch Matching and Direction', 'Match pitch by ear, identify melodic direction, and perceive register differences'],
  ['l9u30m2', 'Major vs Minor Recognition', 'Distinguishing major and minor tonality by ear — chords, scales, and overall color'],
  ['l9u30m3', 'Interval Recognition: P1-P5', 'Identifying perfect and small intervals by ear using song associations and direct recognition'],
  ['l9u30m4', 'Interval Recognition: m6-P8', 'Identifying large intervals by ear — sixths, sevenths, and the octave'],
  ['l9u30m5', 'Harmonic Intervals and Compounds', 'Simultaneous interval recognition and compound intervals beyond the octave'],
  ['l9u31m1', 'Scale Recognition: Major and Minor Forms', 'Distinguishing major, natural minor, harmonic minor, and melodic minor by ear'],
  ['l9u31m2', 'Scale Recognition: Modes', 'Identifying all seven church modes by their characteristic tones'],
  ['l9u31m3', 'Scale Recognition: Pentatonic, Blues, Symmetric', 'Recognizing special scales by ear — pentatonic, blues, whole-tone, and diminished'],
  ['l9u31m4', 'Triad Quality Recognition', 'Identifying major, minor, diminished, and augmented triads by ear'],
  ['l9u31m5', 'Seventh Chord Quality Recognition', 'Identifying all seventh chord qualities by ear — from warm major 7th to tense diminished 7th'],
  ['l9u32m1', 'Melodic Dictation: Diatonic', 'Transcribing short diatonic melodies by ear — stepwise and triadic motion'],
  ['l9u32m2', 'Melodic Dictation: Chromatic', 'Transcribing melodies with chromatic passing tones, neighbor tones, and secondary dominants'],
  ['l9u32m3', 'Harmonic Dictation: Cadences and Progressions', 'Identifying cadences, transcribing progressions, and bass line dictation'],
  ['l9u32m4', 'Sight Singing Fundamentals', 'Movable-do solfege for sight singing in major and minor keys'],
  ['l9u32m5', 'Contextual Listening', 'Identifying texture, form, instruments, and style periods by ear'],
];

// Build the full index with derived level + unit + module-index fields.
export const MODULE_INDEX: ModuleIndexEntry[] = (() => {
  const byUnit = new Map<string, number>();
  return RAW.map(([id, title, subtitle]) => {
    const match = id.match(/^(l\d+)(u\d+)m(\d+)$/);
    if (!match) throw new Error(`Invalid module id: ${id}`);
    const [, level, unitId] = match;
    const unitKey = `${level}:${unitId}`;
    const moduleIndex = (byUnit.get(unitKey) ?? 0) + 1;
    byUnit.set(unitKey, moduleIndex);
    return {
      id,
      level,
      unitId,
      moduleIndex,
      title,
      subtitle,
      keywords: EXTRA_KEYWORDS[id] ?? [],
    };
  });
})();

export function findModulesByQuery(query: string, limit = 5): ModuleIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const matches: Array<{ entry: ModuleIndexEntry; score: number }> = [];
  for (const entry of MODULE_INDEX) {
    const t = entry.title.toLowerCase();
    const s = entry.subtitle.toLowerCase();
    let score = 0;
    if (t === q) score = 100;
    else if (t.startsWith(q)) score = 50;
    else if (t.includes(q)) score = 25;
    else if (s.includes(q)) score = 12;
    else {
      for (const kw of entry.keywords) {
        if (kw === q) { score = Math.max(score, 40); break; }
        if (kw.startsWith(q)) { score = Math.max(score, 20); }
        else if (kw.includes(q)) { score = Math.max(score, 8); }
      }
    }
    if (score > 0) matches.push({ entry, score });
  }
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, limit).map((m) => m.entry);
}
