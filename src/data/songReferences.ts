/**
 * Song references for curriculum modules — factual metadata (song titles + artist names)
 * with original educational context text. NOT lyrics or copyrighted content.
 *
 * L1–L3 coverage (~35 modules, ~80 entries). L4–L9 can be added incrementally.
 */

export interface SongReference {
  song: string;
  artist: string;
  context: string;
}

const SONG_REFERENCES: Record<string, SongReference[]> = {
  // ─── Level 1 ────────────────────────────────────────────────────────────────

  // L1U1: Notation and Pitch
  'l1u1m1': [
    { song: 'Für Elise', artist: 'Ludwig van Beethoven', context: 'Written primarily in the treble clef, making it a classic first piece for reading staff notation.' },
    { song: 'Ode to Joy', artist: 'Ludwig van Beethoven', context: 'Uses stepwise motion in a narrow range — ideal for practicing note reading on the treble staff.' },
  ],
  'l1u1m2': [
    { song: 'Clair de Lune', artist: 'Claude Debussy', context: 'The left hand frequently ventures into ledger lines below the bass clef, demonstrating extended range across the grand staff.' },
    { song: 'Prelude in C Major (BWV 846)', artist: 'J.S. Bach', context: 'Written across both staves of the grand staff with arpeggiated figures spanning a wide register.' },
  ],
  'l1u1m3': [
    { song: 'Flight of the Bumblebee', artist: 'Nikolai Rimsky-Korsakov', context: 'Built entirely on chromatic half steps, illustrating sharps and flats in rapid succession.' },
    { song: 'Black Dog', artist: 'Led Zeppelin', context: 'The iconic riff uses chromatic passing tones (half steps) between diatonic scale degrees.' },
  ],
  'l1u1m4': [
    { song: 'Chromatic Fantasy and Fugue', artist: 'J.S. Bach', context: 'One of the earliest masterworks built around extensive chromatic scale passages.' },
    { song: 'Misty', artist: 'Erroll Garner', context: 'The melody incorporates chromatic neighbor tones that color the major tonality.' },
  ],

  // L1U2: Rhythm and Meter
  'l1u2m1': [
    { song: 'Twinkle Twinkle Little Star', artist: 'Traditional (Mozart variations)', context: 'Uses only quarter notes and half notes in 4/4 time — the simplest rhythmic vocabulary.' },
    { song: 'Billie Jean', artist: 'Michael Jackson', context: 'The bass line demonstrates steady quarter-note pulse with eighth-note subdivisions.' },
  ],
  'l1u2m2': [
    { song: 'The Blue Danube', artist: 'Johann Strauss II', context: 'The archetypal waltz — count ONE-two-three throughout and the 3/4 meter reveals itself instantly.' },
    { song: 'Yankee Doodle', artist: 'Traditional', context: 'A brisk 2/4 march — two beats per bar, with the strong-weak pattern that defines duple meter.' },
  ],

  // L1U3: Scales, Intervals, and First Chords
  'l1u3m1': [
    { song: 'Do-Re-Mi', artist: 'Rodgers & Hammerstein (The Sound of Music)', context: 'The melody literally ascends and descends the major scale, teaching each degree by name.' },
    { song: 'Joy to the World', artist: 'Traditional (Handel arrangement)', context: 'The opening melody is a descending major scale from tonic to tonic.' },
  ],
  'l1u3m2': [
    { song: 'Brown Eyed Girl', artist: 'Van Morrison', context: 'Written in G major (one sharp — F#), demonstrating how a simple key signature shapes the sound of a classic song.' },
    { song: 'Hey Jude', artist: 'The Beatles', context: 'In the key of F major (one flat), a good entry point for reading key signatures beyond C major.' },
  ],
  'l1u3m3': [
    { song: 'Here Comes the Bride', artist: 'Richard Wagner', context: 'Opens with a perfect fourth — one of the most recognizable intervals in Western music.' },
    { song: 'Somewhere Over the Rainbow', artist: 'Harold Arlen', context: 'The opening leap is an octave, the largest basic interval. A classic interval-recognition reference.' },
    { song: 'Star Wars Main Theme', artist: 'John Williams', context: 'Opens with a perfect fifth, a foundational interval for ear training.' },
  ],
  'l1u3m4': [
    { song: 'Let It Be', artist: 'The Beatles', context: 'Built on a four-chord progression (C–G–Am–F) where all major chords are root-position triads.' },
    { song: 'Three Little Birds', artist: 'Bob Marley', context: 'Uses simple major triads (A, D, E) in a repeating pattern — the essence of basic chord harmony.' },
  ],

  // ─── Level 2 ────────────────────────────────────────────────────────────────

  // L2U4: All Major Keys and Scale Degrees
  'l2u4m1': [
    { song: 'Lean on Me', artist: 'Bill Withers', context: 'In C major — demonstrates how the circle of fifths places the simplest key at 12 o\'clock.' },
    { song: 'Piano Sonata No. 11 (K. 331)', artist: 'W.A. Mozart', context: 'Written in A major (three sharps), showcasing how composers work comfortably in sharp keys.' },
  ],
  'l2u4m2': [
    { song: 'Twinkle Twinkle Little Star', artist: 'Traditional', context: 'Melody moves 1–1–5–5–6–6–5, clearly outlining tonic, dominant, and submediant scale degrees.' },
    { song: 'Happy Birthday', artist: 'Traditional', context: 'Contains prominent 5th (dominant) and 1st (tonic) scale degree motion — a natural example of functional degrees.' },
  ],

  // L2U5: Minor Scales and Key Relationships
  'l2u5m1': [
    { song: 'Losing My Religion', artist: 'R.E.M.', context: 'Built on the natural minor (Aeolian) scale in A minor, with the characteristic flat seventh.' },
    { song: 'Eleanor Rigby', artist: 'The Beatles', context: 'Built on Em and C chords with a modal flavor that mixes Aeolian and Dorian — the melody raises the 6th (C♯) in places, giving it a modal rather than purely diatonic minor quality.' },
  ],
  'l2u5m2': [
    { song: 'Hava Nagila', artist: 'Traditional', context: 'Uses the harmonic minor scale — the augmented second between b6 and #7 gives it its distinctive sound.' },
    { song: 'Smooth Criminal', artist: 'Michael Jackson', context: 'The use of E major (V) over an A minor tonality implies harmonic minor, with the raised 7th degree (G#) creating a strong pull back to the tonic.' },
  ],
  'l2u5m3': [
    { song: 'Stairway to Heaven', artist: 'Led Zeppelin', context: 'Begins in A minor (relative minor of C major), then modulates — a classic relative key relationship.' },
    { song: 'While My Guitar Gently Weeps', artist: 'The Beatles', context: 'Moves between A minor verses and its relative major context (C major), demonstrating the close relationship between relative keys that share the same key signature.' },
  ],

  // L2U6: Compound Meter and Syncopation
  'l2u6m1': [
    { song: 'House of the Rising Sun', artist: 'Traditional (The Animals)', context: 'The arpeggiated accompaniment in 6/8 time demonstrates compound-duple meter, where each of the two main beats subdivides into groups of three eighth notes (some editions notate it in 12/8; the compound-duple feel is the same).' },
    { song: 'We Are the Champions', artist: 'Queen', context: 'The verse is in 6/8 before the chorus shifts feel — a contrast between compound and simple meter.' },
    { song: 'America', artist: 'Leonard Bernstein (West Side Story)', context: 'Alternates between 6/8 and 3/4 meter — the same six eighth notes regrouped, the classic compound-vs-simple hemiola.' },
  ],
  'l2u6m2': [
    { song: 'Maple Leaf Rag', artist: 'Scott Joplin', context: 'A defining example of syncopation in ragtime — accents consistently fall between beats.' },
    { song: 'Superstition', artist: 'Stevie Wonder', context: 'Heavy syncopation in both the clavinet riff and vocal line, with accents on the "and" of beats.' },
  ],

  // L2U7: Intervals, Triads, and Diatonic Harmony
  'l2u7m1': [
    { song: 'Amazing Grace', artist: 'Traditional', context: 'Opens with a perfect fourth leap, and the melody outlines major and minor intervals throughout.' },
    { song: 'When the Saints Go Marching In', artist: 'Traditional', context: 'The opening four-note figure (C–E–F–G) begins with a bright major third leap — one of the classic ear-training references for identifying the M3 interval.' },
  ],
  'l2u7m2': [
    { song: 'Maria', artist: 'Leonard Bernstein (West Side Story)', context: 'Opens with an augmented fourth (tritone) — the "devil\'s interval" used for dramatic effect.' },
    { song: 'A Whole New World', artist: 'Alan Menken (Aladdin)', context: 'Contains compound intervals (9ths, 10ths) in the melody, extending beyond the octave.' },
  ],
  'l2u7m3': [
    { song: 'Oh! Darling', artist: 'The Beatles', context: 'Features major, minor, and augmented triads — the E augmented chord creates tension before resolving, demonstrating how different triad qualities serve different harmonic functions.' },
    { song: 'Creep', artist: 'Radiohead', context: 'The I–III–IV–iv progression (G–B–C–Cm) features a chromatic major chord (III) borrowed from outside the key and a borrowed minor subdominant (iv), showing how triad quality creates emotional color.' },
  ],
  'l2u7m4': [
    { song: 'Canon in D', artist: 'Johann Pachelbel', context: 'The bass line moves through root position and first inversion triads — a textbook example of figured bass voice leading.' },
    { song: 'Prelude in C Major (BWV 846)', artist: 'J.S. Bach', context: 'Each measure arpegiates a chord, many in first or second inversion, following figured bass conventions.' },
  ],
  'l2u7m5': [
    { song: 'Pachelbel Canon', artist: 'Johann Pachelbel', context: 'The progression I–V–vi–iii–IV–I–IV–V demonstrates five of the seven diatonic triads in a descending bass pattern that became one of the most famous chord progressions in Western music.' },
    { song: 'No Woman No Cry', artist: 'Bob Marley', context: 'Uses the I–V–vi–IV progression — the most common diatonic Roman numeral pattern in pop music.' },
  ],

  // ─── Level 3 ────────────────────────────────────────────────────────────────

  // L3U9: Seventh Chords and Diatonic Harmony
  'l3u9m1': [
    { song: 'Autumn Leaves', artist: 'Joseph Kosma', context: 'The chord changes cycle through major seventh, minor seventh, and dominant seventh — three of the five seventh chord qualities in one standard.' },
    { song: 'Girl from Ipanema', artist: 'Antonio Carlos Jobim', context: 'Opens on a major seventh chord, establishing the warm quality that defines bossa nova harmony.' },
  ],
  'l3u9m2': [
    { song: 'Gymnopédie No. 1', artist: 'Erik Satie', context: 'Uses seventh chords in various inversions for voice-leading smoothness between chords.' },
    { song: 'Misty', artist: 'Erroll Garner', context: 'The piano arrangement features seventh chords in close-position inversions throughout.' },
  ],
  'l3u9m3': [
    { song: 'All the Things You Are', artist: 'Jerome Kern', context: 'Cycles through diatonic seventh chords in major keys using the circle-of-fifths motion (vi7–ii7–V7–Imaj7).' },
    { song: 'I Got Rhythm', artist: 'George Gershwin', context: 'The "rhythm changes" progression (Imaj7–vi7–ii7–V7) became a template for hundreds of jazz compositions.' },
  ],
  'l3u9m4': [
    { song: 'Blue Bossa', artist: 'Kenny Dorham', context: 'Opens in C minor with a i7–iv7–iiø7–V7 progression, demonstrating how diatonic seventh chords and the ii–V cadential motion function in a minor key.' },
    { song: 'Summertime', artist: 'George Gershwin (Porgy and Bess)', context: 'The minor-key seventh chord progression (i–iiø7–V7–i) creates the languid feel of the song.' },
  ],

  // L3U10: Voice Leading and Part Writing
  'l3u10m1': [
    { song: 'Jesu, Joy of Man\'s Desiring', artist: 'J.S. Bach', context: 'The chorale sections are model SATB writing — each voice moves smoothly within its range.' },
    { song: 'A Mighty Fortress Is Our God', artist: 'Martin Luther / J.S. Bach', context: 'Bach\'s harmonization is a textbook example of four-part SATB chorale writing.' },
  ],
  'l3u10m2': [
    { song: 'Prelude in C Major (BWV 846)', artist: 'J.S. Bach', context: 'Despite being arpeggiated, the underlying voice leading avoids parallel fifths and octaves throughout.' },
  ],
  'l3u10m3': [
    { song: 'Amazing Grace', artist: 'Traditional (hymn arrangements)', context: 'Standard hymn harmonizations use root-position triads connected by proper voice leading — a part-writing exercise staple.' },
  ],
  'l3u10m4': [
    { song: 'Ave Maria', artist: 'Charles Gounod (over Bach\'s Prelude)', context: 'The accompaniment features triads in inversion moving by step, creating smooth bass lines under the melody.' },
  ],

  // L3U11: Cadences, Phrases, and Embellishment
  'l3u11m1': [
    { song: 'Hallelujah', artist: 'Leonard Cohen', context: 'Each verse ends with a clear authentic cadence (V–I) on the word "Hallelujah." The lyric narrates its own harmony: "the fourth, the fifth" (IV–V), "the minor fall" (vi), "the major lift" (IV) — and that V–vi move is a textbook deceptive-cadence gesture.' },
    { song: 'Yesterday', artist: 'The Beatles', context: 'Contains both half cadences (pausing on V) and authentic cadences within its phrase structure.' },
  ],
  'l3u11m2': [
    { song: 'Ode to Joy', artist: 'Ludwig van Beethoven', context: 'The melody is structured as a parallel period — two phrases, the first ending on a half cadence, the second on an authentic cadence.' },
    { song: 'Twinkle Twinkle Little Star', artist: 'Traditional', context: 'A textbook example of antecedent-consequent phrase structure forming a musical period.' },
  ],
  'l3u11m3': [
    { song: 'Bohemian Rhapsody', artist: 'Queen', context: 'Uses dramatically varied harmonic rhythm — from slow ballad chords to rapid-fire operatic changes.' },
    { song: 'Let It Be', artist: 'The Beatles', context: 'Maintains steady harmonic rhythm with one chord per bar, making the harmonic pace easy to feel and analyze.' },
  ],
  'l3u11m4': [
    { song: 'Moonlight Sonata', artist: 'Ludwig van Beethoven', context: 'The arpeggiated accompaniment features passing tones and neighbor tones between chord tones.' },
    { song: 'Clair de Lune', artist: 'Claude Debussy', context: 'Rich in non-chord tones — suspensions, appoggiaturas, and passing tones create its dreamy quality.' },
  ],
  'l3u11m5': [
    { song: 'Air on the G String', artist: 'J.S. Bach', context: 'The ornate melody line is built on chains of suspensions and passing tones over a simple bass.' },
    { song: 'Nocturne in Eb Major (Op. 9 No. 2)', artist: 'Frédéric Chopin', context: 'The ornamented melody weaves chromatic passing tones and neighbor tones around structural chord tones.' },
  ],

  // L4U14: Asymmetric and Mixed Meters
  'l4u14m2': [
    { song: 'Take Five', artist: 'Dave Brubeck', context: 'Written in 5/4 time (3+2), demonstrating how asymmetric meters create distinctive rhythmic character.' },
    { song: 'Money', artist: 'Pink Floyd', context: 'The famous bass riff is in 7/4 — count the loop and feel the extra beat that simple meter would not allow.' },
  ],
};

export function getSongReferences(moduleId: string): SongReference[] {
  return SONG_REFERENCES[moduleId] ?? [];
}

/** Get the full song reference map (used by content resolver for overlays). */
export function getAllSongReferences(): Record<string, SongReference[]> {
  return SONG_REFERENCES;
}
