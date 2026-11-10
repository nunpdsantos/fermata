import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 1, Unit 1: Notation and Pitch
// Reference: 01-foundations.md §1.1–1.2
// ---------------------------------------------------------------------------

const l1u1m1: CurriculumModule = {
  id: 'l1u1m1',
  unitId: 'u1',
  levelId: 'l1',
  title: 'The Staff and Clefs',
  subtitle: 'The five-line grid that maps pitch to paper',
  objectives: [
    'Identify the five-line staff as the foundation of Western notation',
    'Read treble and bass clef and know which pitches they center on',
    'Understand how position on the staff maps to pitch — higher = higher sound',
  ],
  concepts: [
    {
      title: 'The Five-Line Staff',
      explanation:
        'All written music lives on a staff — five horizontal lines and four spaces. Notes placed higher on the staff sound higher in pitch; notes placed lower sound lower. Each line and each space represents a specific pitch. The staff is the map; the notes are the landmarks.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See notes arranged by pitch',
    },
    {
      title: 'Treble and Bass Clef',
      explanation:
        "A clef sits at the beginning of a staff and tells you which pitches the lines and spaces represent. The treble clef (𝄞) centers on G above middle C — it's used for higher instruments and the right hand on piano. The bass clef (𝄢) centers on F below middle C — it's used for lower instruments and the left hand on piano. Without a clef, the staff is just lines — the clef gives them meaning. Guitar uses treble clef with a small 8 below: it sounds an octave lower than written. The optional Guitar Notation unit explains this convention.",
      tryThisQuery: 'key of C',
      tryThisLabel: 'C to C in treble clef and in bass clef',
      clefs: true,
    },
  ],
  tasks: [
    { id: 'l1u1m1t1', instruction: 'Look at the piano keyboard — notes go from low (left) to high (right), just like the staff goes from low (bottom) to high (top)' },
    { id: 'l1u1m1t2', instruction: "Type 'C major scale' and notice how each note occupies a higher position as the pitch rises" },
  ],
  prerequisites: [],
};

const l1u1m2: CurriculumModule = {
  id: 'l1u1m2',
  unitId: 'u1',
  levelId: 'l1',
  title: 'Ledger Lines and the Grand Staff',
  subtitle: 'Extending the staff and connecting treble and bass',
  objectives: [
    'Understand ledger lines as extensions above or below the staff',
    'Know that the grand staff combines treble and bass clefs connected by a brace',
    'Locate middle C as the ledger line between the two staves',
  ],
  concepts: [
    {
      title: 'Ledger Lines',
      explanation:
        'When notes go above or below the five-line staff, short horizontal lines called ledger lines are added. Middle C, for example, sits on one ledger line below the treble staff or one ledger line above the bass staff. Ledger lines extend the staff temporarily — they appear only where needed.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See middle C on the piano',
    },
    {
      title: 'The Grand Staff',
      explanation:
        "Piano music uses the grand staff — a treble staff on top and a bass staff on the bottom, joined by a brace and connected by a shared middle-C ledger line. The right hand typically reads treble clef; the left reads bass clef. Together they cover most of the piano's range. This is why pianists learn both clefs from the start.",
      tryThisQuery: 'key of C',
      tryThisLabel: 'Explore C on the full keyboard',
    },
  ],
  tasks: [
    { id: 'l1u1m2t1', instruction: 'Find middle C on the piano — it sits between the two halves of the grand staff' },
    { id: 'l1u1m2t2', instruction: 'Play notes below and above middle C to hear how the grand staff spans both registers' },
  ],
  prerequisites: ['l1u1m1'],
};

const l1u1m3: CurriculumModule = {
  id: 'l1u1m3',
  unitId: 'u1',
  levelId: 'l1',
  title: 'Half Steps, Whole Steps, and Accidentals',
  subtitle: 'The smallest distances in music and the symbols that modify pitch',
  objectives: [
    'Define half steps and whole steps as the building blocks of all scales',
    'Understand sharps, flats, and naturals as pitch modifiers',
    'Recognize enharmonic equivalents — same sound, different name',
  ],
  concepts: [
    {
      title: 'Half Steps and Whole Steps',
      explanation:
        "A half step is the smallest distance between two notes — like C to C# or E to F. On the piano, it's the very next key (white or black). A whole step equals two half steps — like C to D. These two distances are the atoms from which all scales, chords, and melodies are built.",
      tryThisQuery: 'C chromatic scale',
      tryThisLabel: 'See all half steps in order',
    },
    {
      title: 'Sharps, Flats, and Naturals',
      explanation:
        "A sharp (#) raises a note by one half step. A flat (b) lowers it by one half step. A natural (♮) cancels a previous sharp or flat. These symbols are called accidentals. Between most natural notes there's a note in between — C# sits between C and D. But E–F and B–C are already a half step apart, so there's no key between them.",
      tryThisQuery: 'key of G',
      tryThisLabel: 'See F# — the sharp in G major',
    },
    {
      title: 'Enharmonic Equivalents',
      explanation:
        "C# and Db are the same key on the piano — same pitch, different name. These are called enharmonic equivalents. Which name you use depends on context: in the key of D major the note is called C# (because it's a raised C); in the key of Ab major the same pitch is called Db (because it's a lowered D).",
      tryThisQuery: 'C chromatic scale',
      tryThisLabel: 'See all 12 notes',
    },
  ],
  tasks: [
    { id: 'l1u1m3t1', instruction: "Play adjacent notes on the chromatic scale — each step is a half step. Type 'C chromatic scale' to see them all" },
    { id: 'l1u1m3t2', instruction: 'Find E and F on the piano — notice there is no black key between them. This pair is a natural half step' },
    { id: 'l1u1m3t3', instruction: "Type 'key of G' — which note needs a sharp? The F becomes F# to maintain the major scale pattern" },
  ],
  prerequisites: ['l1u1m2'],
};

const l1u1m4: CurriculumModule = {
  id: 'l1u1m4',
  unitId: 'u1',
  levelId: 'l1',
  title: 'The Chromatic Scale',
  subtitle: 'All 12 notes in order — the complete pitch vocabulary',
  objectives: [
    'Know the chromatic scale as all 12 notes ascending by half steps',
    'Understand that the chromatic scale contains every possible note in Western music',
    'See how the 7 natural notes and 5 accidentals form the complete set',
  ],
  concepts: [
    {
      title: 'The 12 Notes',
      explanation:
        'Western music uses 12 distinct pitches, repeating in higher and lower octaves. The chromatic scale plays all 12 in order, each a half step apart: C, C#, D, D#, E, F, F#, G, G#, A, A#, B — then back to C an octave higher. These 12 notes are the complete pitch vocabulary. Every scale, chord, and melody is drawn from this set.',
      tryThisQuery: 'C chromatic scale',
      tryThisLabel: 'Hear all 12 notes',
    },
    {
      title: 'The Piano Layout',
      explanation:
        "The piano makes the 12 notes visible: 7 white keys (the naturals C–B) and 5 black keys (the sharps/flats). The pattern of 2 black keys then 3 black keys repeats across the keyboard. This layout is not arbitrary — it reflects the half-step gaps between E–F and B–C. Once you can see this pattern, you can find any note instantly.",
      tryThisQuery: 'key of C',
      tryThisLabel: 'See the natural notes on the keyboard',
    },
  ],
  tasks: [
    { id: 'l1u1m4t1', instruction: "Type 'C chromatic scale' and count all 12 notes before the pattern repeats" },
    { id: 'l1u1m4t2', instruction: 'On the piano, find the group of 2 black keys — the white key just below the group is always C' },
  ],
  prerequisites: ['l1u1m3'],
};

// ---------------------------------------------------------------------------
// Level 1, Unit 2: Rhythm and Meter
// Reference: 01-foundations.md §1.3–1.4
// Note: The app has no rhythm/notation visualization UI. These modules are
// knowledge-focused with tryThisQuery referencing relevant scales/chords
// for musical context — same approach as L9 ear training modules.
// ---------------------------------------------------------------------------

const l1u2m1: CurriculumModule = {
  id: 'l1u2m1',
  unitId: 'u2',
  levelId: 'l1',
  title: 'Note Values and Rests',
  subtitle: 'How long notes last — from whole notes to sixteenth notes',
  objectives: [
    'Know the standard note values: whole, half, quarter, eighth, sixteenth',
    'Understand the 2:1 ratio — each value is half the duration of the one above it',
    'Recognize rests as measured silence with the same duration hierarchy',
  ],
  concepts: [
    {
      title: 'The Duration Hierarchy',
      explanation:
        'Music organizes time through a hierarchy of note values. A whole note lasts the longest. A half note is half as long. A quarter note is half of that — and so on down to eighth and sixteenth notes. Each level divides by two: 1 whole = 2 halves = 4 quarters = 8 eighths = 16 sixteenths. This system lets musicians write any rhythm with precision.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Hear one bar each of whole, half, quarter and eighth notes',
      rhythm: { time: '4/4', notes: 'w | h h | q q q q | 8 8 8 8 8 8 8 8' },
    },
    {
      title: 'Rests',
      explanation:
        'Every note value has a corresponding rest — a symbol for measured silence. A quarter rest lasts as long as a quarter note. A half rest lasts as long as a half note. Rests are not "nothing" — they are active silences that shape phrases just as much as the notes themselves. Great musicians pay as much attention to where they do not play as to where they do.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear notes and rests share the beat: quarter, quarter rest; half, half rest',
      rhythm: { time: '4/4', notes: 'q qr q qr | h hr' },
    },
    {
      title: 'Dots and Ties',
      explanation:
        "A dot after a note increases its duration by half — a dotted half note lasts three beats instead of two (when the quarter note gets the beat). A tie connects two notes of the same pitch into one continuous sound — a half note tied to a quarter note lasts three beats total. Dots and ties let you create durations that don't fit neatly into the basic hierarchy.",
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Hear a dotted half, then a half tied to a quarter: both last three beats',
      rhythm: { time: '4/4', notes: 'h. q | h~ q q' },
    },
  ],
  tasks: [
    { id: 'l1u2m1t1', instruction: 'Tap a steady pulse on your desk. Each tap is a quarter note. Now tap only every other beat — those are half notes' },
    { id: 'l1u2m1t2', instruction: 'Clap the rhythm: quarter, quarter, half. The half note lasts as long as the two quarters combined' },
  ],
  prerequisites: ['l1u1m4'],
};

const l1u2m2: CurriculumModule = {
  id: 'l1u2m2',
  unitId: 'u2',
  levelId: 'l1',
  title: 'Meter and Time Signatures',
  subtitle: 'How beats group into measures — 2/4, 3/4, and 4/4',
  objectives: [
    'Understand meter as the recurring pattern of strong and weak beats',
    'Read simple time signatures: 2/4, 3/4, 4/4',
    'Feel the difference between duple (2), triple (3), and quadruple (4) meter',
  ],
  concepts: [
    {
      title: 'Pulse, Meter, and Measures',
      explanation:
        "Music has a steady pulse — the beat you tap your foot to. Meter organizes those beats into recurring groups of 2, 3, or 4, with the first beat of each group feeling stronger. A measure (or bar) is one complete group, separated by barlines. The time signature at the beginning tells you the grouping: 4/4 means four quarter-note beats per measure. 3/4 means three. 2/4 means two.",
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Hear 4/4: four beats to a bar, the first one stressed',
      rhythm: { time: '4/4', notes: '>q q q q | >q q q q' },
    },
    {
      title: 'Simple Time Signatures',
      explanation:
        "In simple meter, each beat divides naturally into two equal parts. 4/4 is the most common time signature — four quarter-note beats per measure, with beat 1 strongest and beat 3 having a secondary accent. 3/4 gives music a waltz feel — ONE-two-three, ONE-two-three. 2/4 creates a march-like feel — ONE-two, ONE-two. The top number is beats per measure; the bottom number is which note value gets one beat.",
      tryThisQuery: 'key of C',
      tryThisLabel: 'Hear 3/4: ONE-two-three, ONE-two-three',
      rhythm: { time: '3/4', notes: '>q q q | >q q q | >h q | >h.' },
    },
  ],
  tasks: [
    { id: 'l1u2m2t1', instruction: 'Tap a steady beat and emphasize every 4th tap — you are feeling 4/4 meter. Now try emphasizing every 3rd tap — that is 3/4' },
    { id: 'l1u2m2t2', instruction: 'Listen to a song you know and count beats until the pattern repeats. Most pop songs are in 4/4. Waltzes are in 3/4' },
  ],
  prerequisites: ['l1u2m1'],
};

// ---------------------------------------------------------------------------
// Level 1, Unit 3: Scales, Intervals, and First Chords
// Reference: 01-foundations.md §1.5–1.7
// ---------------------------------------------------------------------------

const l1u3m1: CurriculumModule = {
  id: 'l1u3m1',
  unitId: 'u3',
  levelId: 'l1',
  title: 'The Major Scale',
  subtitle: 'The W-W-H-W-W-W-H pattern that defines major tonality',
  objectives: [
    'Build a major scale from any starting note using the W-W-H-W-W-W-H pattern',
    'Understand that C major uses only white keys because the pattern falls naturally',
    'See that the same pattern in a different key requires sharps or flats',
  ],
  concepts: [
    {
      title: 'The Major Scale Pattern',
      explanation:
        "The major scale follows a specific sequence of whole and half steps: W-W-H-W-W-W-H. Starting from C, this gives you all white keys — that's why C major has no sharps or flats. Each note in the scale has a number called its scale degree, from 1 (the root) up to 7.",
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See the C major scale',
    },
    {
      title: 'The Pattern Works Anywhere',
      explanation:
        "The W-W-H pattern works from any starting note. Start on G and follow the pattern — you'll need F# instead of F to keep the intervals correct. Start on F and you'll need Bb. The pattern tells you exactly which notes need sharps or flats — you don't choose them.",
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Build G major — one sharp',
    },
    {
      title: 'Same Pattern, Same Sound',
      explanation:
        "Because every major scale uses the exact same step pattern, they all share the same bright, resolved quality — just at different pitch levels. This is why musicians play in different keys: to match a singer's range, suit an instrument, or change the color of a piece.",
      tryThisQuery: 'D major scale',
      tryThisLabel: 'Build D major — two sharps',
    },
  ],
  tasks: [
    { id: 'l1u3m1t1', instruction: "Type 'C major scale' and trace the W-W-H-W-W-W-H pattern on the piano" },
    { id: 'l1u3m1t2', instruction: "Type 'G major scale' — which note needs a sharp to maintain the pattern?" },
    { id: 'l1u3m1t3', instruction: "Type 'F major scale' — this one needs a flat. Which note?" },
  ],
  prerequisites: ['l1u2m2'],
};

const l1u3m2: CurriculumModule = {
  id: 'l1u3m2',
  unitId: 'u3',
  levelId: 'l1',
  title: 'Key Signatures — First Four Keys',
  subtitle: 'C, G, D, and F — the keys you will use most',
  objectives: [
    'Understand what a key signature is and why it exists',
    'Know the key signatures for C major (0), G major (1#), D major (2#), and F major (1b)',
    'Distinguish between a scale (a pattern) and a key (a musical context)',
  ],
  concepts: [
    {
      title: 'What Is a Key Signature?',
      explanation:
        "A key signature is shorthand — instead of writing a sharp or flat next to every affected note, it lists them once at the beginning. G major's key signature has one sharp (F#), meaning every F in the piece is played as F#. This saves clutter and tells you the key at a glance.",
      tryThisQuery: 'key of G',
      tryThisLabel: "See G's key signature — one sharp",
    },
    {
      title: 'Your First Four Keys',
      explanation:
        'Start with the most common keys: C major has no sharps or flats. G major has one sharp (F#). D major has two sharps (F#, C#). F major has one flat (Bb). Sharps always appear in order: F-C-G-D-A-E-B. Flats appear in the reverse: B-E-A-D-G-C-F. Each new key adds the next accidental in the sequence.',
      tryThisQuery: 'key of D',
      tryThisLabel: "See D's key signature — two sharps",
    },
    {
      title: 'Scale vs. Key',
      explanation:
        "A scale is a pattern of notes in order. A key is the musical context that uses those notes, with one note as 'home.' When you are 'in the key of G major,' the G major scale provides your notes, G is home, and the key signature tells you F is always sharp.",
      tryThisQuery: 'key of F',
      tryThisLabel: "See F's key signature — one flat",
    },
  ],
  tasks: [
    { id: 'l1u3m2t1', instruction: "Type 'key of G' — how many sharps does the key signature show?" },
    { id: 'l1u3m2t2', instruction: "Type 'key of D' — which new sharp was added beyond G major's F#?" },
    { id: 'l1u3m2t3', instruction: "Type 'key of F' — this is the first flat key. Which note is flatted?" },
  ],
  prerequisites: ['l1u3m1'],
};

const l1u3m3: CurriculumModule = {
  id: 'l1u3m3',
  unitId: 'u3',
  levelId: 'l1',
  title: 'Intervals by Number',
  subtitle: 'Measuring distance between notes — unison through octave',
  objectives: [
    'Name intervals from unison to octave by counting letter names',
    'Distinguish melodic intervals (notes in sequence) from harmonic intervals (notes together)',
    'Hear how larger intervals create wider leaps in melody',
  ],
  concepts: [
    {
      title: 'What Is an Interval?',
      explanation:
        "An interval measures the distance between two notes. To name it, count the letter names from the bottom note to the top, inclusive. C to E: C-D-E = 3 letters, so it's a 3rd. C to G: C-D-E-F-G = 5 letters, so it's a 5th. Same note to same note is a unison (1st). An octave (8th) spans from a note to the next occurrence of the same letter name.",
      tryThisQuery: 'C major chord',
      tryThisLabel: 'See C-E-G — a 3rd and a 5th',
    },
    {
      title: 'Melodic and Harmonic Intervals',
      explanation:
        'When two notes sound one after another, the interval is melodic — you hear it as a leap or step in a melody. When two notes sound at the same time, the interval is harmonic — you hear it as a blend or clash. The size is the same either way; only the presentation differs.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Hear melodic 2nds — step by step',
    },
    {
      title: 'Intervals in the Major Scale',
      explanation:
        'Every note in the major scale forms a specific interval with the root. From C: C-D is a 2nd, C-E is a 3rd, C-F is a 4th, C-G is a 5th, C-A is a 6th, C-B is a 7th, C-C is an octave. These are the basic interval numbers. Later you will learn that each number has a quality too (major, minor, perfect) — for now, the number is enough.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See the Circle of Fifths — built on 5th intervals',
    },
  ],
  tasks: [
    { id: 'l1u3m3t1', instruction: "Type 'C major chord' — the interval from C to E is a 3rd, and C to G is a 5th. Count the letters to verify" },
    { id: 'l1u3m3t2', instruction: "Type 'C major scale' — each adjacent pair is a 2nd (a step). Play non-adjacent notes to hear larger intervals" },
    { id: 'l1u3m3t3', instruction: 'Open the Circle of Fifths — each step around the circle is a 5th interval. Count the letters to confirm', query: 'circle of fifths' },
  ],
  prerequisites: ['l1u3m2'],
};

const l1u3m4: CurriculumModule = {
  id: 'l1u3m4',
  unitId: 'u3',
  levelId: 'l1',
  title: 'Your First Chords — Major Triads',
  subtitle: 'Three notes that sound complete — root, major third, perfect fifth',
  objectives: [
    'Build a major triad from any root: root + major 3rd + perfect 5th',
    'Read basic chord symbols: C, G, D, F (letter alone = major triad)',
    'Hear the bright, stable character that defines major triads',
  ],
  concepts: [
    {
      title: 'What Is a Chord?',
      explanation:
        'A chord is three or more notes sounding together. The simplest chord is a triad — three notes stacked in intervals of a 3rd. A major triad combines a root, the note a major 3rd above it (4 half steps), and the note a perfect 5th above the root (7 half steps). C major = C-E-G. The chord symbol is just the root letter: C means C major.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'Hear C major — root, third, fifth',
    },
    {
      title: 'Building Triads from Any Root',
      explanation:
        'The formula works from any starting note. G major = G-B-D. D major = D-F#-A. F major = F-A-C. Count 4 half steps up from the root for the 3rd, then 3 more half steps for the 5th (or 7 total from root to 5th). The bright, stable character of a major triad comes from this specific combination of intervals.',
      tryThisQuery: 'G major chord',
      tryThisLabel: 'Build G major',
    },
    {
      title: 'The Major Triad Sound',
      explanation:
        'Play several major triads — C, G, D, F. They all share the same bright, open, resolved quality despite starting on different notes. This is because they all use the same interval structure: major 3rd + minor 3rd (root to 3rd = 4 half steps, 3rd to 5th = 3 half steps). That consistent structure is what makes them all sound "major."',
      tryThisQuery: 'F major chord',
      tryThisLabel: 'Build F major',
    },
  ],
  tasks: [
    { id: 'l1u3m4t1', instruction: "Type 'C major chord' and count the half steps: C to E = 4 (major 3rd), E to G = 3 (minor 3rd), C to G = 7 (perfect 5th)" },
    { id: 'l1u3m4t2', instruction: "Type 'G major chord' — identify the root, 3rd, and 5th. Same interval pattern, different starting note" },
    { id: 'l1u3m4t3', instruction: "Play 'C major chord', 'G major chord', 'D major chord', 'F major chord' — hear the same bright quality in every key" },
  ],
  prerequisites: ['l1u3m3'],
};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

const guitarNotation: CurriculumUnit = {
  id: 'u33',
  levelId: 'l1',
  optional: true,
  icon: 'building-blocks',
  title: 'Guitar Notation — Optional',
  description: 'Clef, strings, fingers, positions and barres. These three lessons do not count towards level completion or unlocks.',
  modules: [
    {
      title: 'Guitar Notation: Clef and Strings',
      subtitle: 'Read sounding pitch and circled string numbers',
      objectives: [
        'Explain why guitar notation is written an octave above its sound',
        'Distinguish a string number from a finger number'
      ],
      concepts: [
        {
          title: 'The Small 8 Below the Clef',
          explanation: 'Guitar music uses the treble clef with a small 8 below it: the notes sound one octave lower than written. Written E4 sounds as E3. The small 8 changes the register, not the note names. In Explore, select Guitar to see this clef; Piano uses plain treble clef.',
          tryThisQuery: 'E major scale',
          tryThisLabel: 'Open in Explore, select Guitar, and compare the clef with Piano'
        },
        {
          title: 'Circled Numbers Name Strings',
          explanation: 'The symbols ① ② ③ ④ ⑤ ⑥ name strings, from the thinnest, highest-pitched string to the thickest, lowest-pitched string. In standard tuning, the open strings sound E4, B3, G3, D3, A2, E2. A circled ③ means play on string 3, not with finger 3. These pitch names describe the sound, before the written octave shift.',
          tryThisQuery: 'E minor chord',
          tryThisLabel: 'Show on Guitar and find the two open E strings'
        }
      ],
      tasks: [
        {
          id: 'l1u33m1t1',
          instruction: 'Select Guitar in Explore. Find the small 8 below the treble clef and explain the difference between written E4 and sounding E3.'
        },
        {
          id: 'l1u33m1t2',
          instruction: 'On your guitar, point to ① and ⑥. Say their sounding pitches in standard tuning, then find ③.'
        }
      ],
      id: 'l1u33m1',
      unitId: 'u33',
      levelId: 'l1',
      prerequisites: []
    },
    {
      title: 'Guitar Notation: The Two Hands',
      subtitle: 'Left-hand 0–4 and right-hand p-i-m-a',
      objectives: [
        'Read left-hand finger numbers and the open-string sign',
        'Decode p-i-m-a and distinguish an arpeggio from tremolo'
      ],
      concepts: [
        {
          title: 'Left-Hand Numbers',
          explanation: 'Left-hand numbers name the fingers that stop the strings: 1 = index, 2 = middle, 3 = ring, 4 = little finger. The number 0 means an open string: no left-hand finger stops it. These numbers are not circled string numbers. On the app fretboard, choose Fingers to see suggested left-hand fingerings.',
          tryThisQuery: 'C major scale',
          tryThisLabel: 'Show on Guitar and compare Fingers with Notes'
        },
        {
          title: 'Right-Hand Letters',
          explanation: 'The letters p-i-m-a name the plucking fingers: p = thumb, i = index, m = middle, a = ring. In an arpeggio, chord notes sound one after another. Read p-i-m-a as thumb, index, middle, ring. The tremolo pattern p-a-m-i is thumb, ring, middle, index: the order of the letters matters. The app plays pitches; practise the hand movements on your own guitar.',
          tryThisQuery: 'C major chord',
          tryThisLabel: 'Hear the chord, then pluck its notes separately on your guitar'
        }
      ],
      tasks: [
        {
          id: 'l1u33m2t1',
          instruction: 'On your guitar, play an open string, then stop it with fingers 1, 2, 3 and 4 in turn. Say the numbers as you play.'
        },
        {
          id: 'l1u33m2t2',
          instruction: 'Slowly mime p-i-m-a, then p-a-m-i. Name each plucking finger; do not confuse a right-hand letter with a left-hand number.'
        }
      ],
      id: 'l1u33m2',
      unitId: 'u33',
      levelId: 'l1',
      prerequisites: [
        'l1u33m1'
      ]
    },
    {
      title: 'Guitar Notation: Positions and Barres',
      subtitle: 'Roman numerals, C and ½C on the neck',
      objectives: [
        'Read Roman-numeral positions such as V',
        'Distinguish a position marking from a full or partial barre'
      ],
      concepts: [
        {
          title: 'Roman-Numeral Positions',
          explanation: 'A Roman numeral names the left-hand position: I = 1st, II = 2nd, V = 5th, VII = 7th. In position V the index finger is based at fret 5; the other fingers normally cover frets 6, 7 and 8. A position is a hand location, not a string number or a chord. A position marking alone does not demand a barre.',
          tryThisQuery: 'A minor scale',
          tryThisLabel: 'Show on Guitar and choose position V'
        },
        {
          title: 'The Barre Sign',
          explanation: 'A barre uses one finger, usually the index, to stop several strings at the same fret. C marks a full barre; ½C marks a partial barre. CV means a full barre at fret 5, while ½CV means a partial barre there. The score or fingering indicates which strings the partial barre covers; do not infer a fixed number of strings from ½ alone.',
          tryThisQuery: 'A minor chord',
          tryThisLabel: 'Show on Guitar; on your own guitar, locate fret 5 for CV'
        }
      ],
      tasks: [
        {
          id: 'l1u33m3t1',
          instruction: 'Choose position V on the app fretboard. Locate fret 5 and compare that position number with the finger numbers on the dots.'
        },
        {
          id: 'l1u33m3t2',
          instruction: 'Read V, CV and ½CV aloud. Explain which mark only locates the hand, which requests a full barre, and which requests a partial barre.'
        }
      ],
      id: 'l1u33m3',
      unitId: 'u33',
      levelId: 'l1',
      prerequisites: [
        'l1u33m2'
      ]
    }
  ]
};


// ---------------------------------------------------------------------------
// Track "Start with sound" (wave 2, 2026-11-10) — src/data/tracks.ts 'sound'.
// For someone new to music: no notation; every check is answered by ear or on
// the instrument. Optional (outside the nine levels' required path) and a
// track: not listed on the Level 1 page; its own card on Learn's overview.
// ---------------------------------------------------------------------------

const soundTrack: CurriculumUnit = {
  id: 'u34',
  levelId: 'l1',
  optional: true,
  track: 'sound',
  icon: 'building-blocks',
  title: 'Start with sound',
  description: 'Five short lessons by ear and on your instrument: high and low, the note names, steps, the major scale and your first chords. No reading music needed.',
  modules: [
    {
      id: 'l1u34m1',
      unitId: 'u34',
      levelId: 'l1',
      title: 'High and Low',
      subtitle: 'Every note is higher or lower than another',
      objectives: [
        'Hear whether a note is higher or lower than the one before',
        'Find the higher notes on the piano and on the guitar',
        'Hear the same note come back higher: the octave',
      ],
      concepts: [
        {
          title: 'Higher and Lower',
          explanation: 'Every musical note has a pitch: how high or low it sounds. When two notes are played one after the other, the second one is higher, lower or the same. You do not need any names to hear this. Listen, and ask yourself whether the sound went up or down.',
          tryThisQuery: 'A minor scale',
          tryThisLabel: 'Hear eight notes, each one higher than the one before',
        },
        {
          title: 'Higher on the Piano',
          explanation: 'On a piano, the notes get higher from left to right. The key at the far left is the lowest note and the key at the far right is the highest. Every key, white or black, is a different note, a little higher than the key just to its left.',
          tryThisQuery: 'C chromatic scale',
          tryThisLabel: 'Hear every key, white and black, from C up to the next C',
        },
        {
          title: 'Higher on the Guitar',
          explanation: 'On a guitar, a note gets higher as your finger moves along a string towards the body of the guitar, one fret at a time. The strings go from low to high too: played open, with no finger on them, the thickest string sounds the lowest and each thinner string sounds higher than the one beside it.',
          tryThisQuery: 'E minor scale',
          tryThisLabel: 'Hear notes climb from low to high, then show them on your instrument',
        },
        {
          title: 'The Same Note, Higher',
          explanation: 'Keep climbing from any note and you reach a note that sounds like the first one again, only higher. The two sound so alike that they share a name. That distance is called an octave. On the piano it is twelve keys further to the right, counting black and white; on a guitar string it is twelve frets further along.',
          tryThisQuery: 'C major scale',
          tryThisLabel: 'Hear C climb to the next C: the same name, a higher sound',
        },
      ],
      tasks: [
        { id: 'l1u34m1t1', instruction: 'Play any note, then a note to its right on the piano, or one fret nearer the body on the guitar. Listen: the second note is higher.' },
        { id: 'l1u34m1t2', instruction: 'Play a note and the same note an octave higher: on the piano, twelve keys to the right; on the guitar, an open string and then the same string at fret 12. Hear how alike they sound.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u34m2',
      unitId: 'u34',
      levelId: 'l1',
      title: 'The Seven Letters',
      subtitle: 'Notes are named A to G, then the names start again',
      objectives: [
        'Name notes with the seven letters, A to G',
        'Find C on the piano',
        'Name the six open strings of the guitar',
      ],
      concepts: [
        {
          title: 'Seven Letters, Round and Round',
          explanation: 'Notes are named with seven letters: A, B, C, D, E, F and G. After G the names start again at A, an octave higher. So the same seven letters come round again and again, each time higher.',
          tryThisQuery: 'A minor scale',
          tryThisLabel: 'Hear A, B, C, D, E, F and G, then A again, higher',
        },
        {
          title: 'Finding C on the Piano',
          explanation: 'The black keys of a piano come in groups of two and groups of three. The white key just to the left of each group of two black keys is C. From C, the white keys going right are D, E, F, G, A and B, then C again.',
          tryThisQuery: 'C major scale',
          tryThisLabel: 'Hear C, D, E, F, G, A and B, then C again',
        },
        {
          title: 'The Open Strings of the Guitar',
          explanation: 'On a guitar in the usual tuning, the six strings played open are named, from the thickest to the thinnest: E, A, D, G, B and E. The thickest and the thinnest strings are both E, two octaves apart.',
          tryThisQuery: 'E phrygian',
          tryThisLabel: 'Hear the seven letters from E: E, F, G, A, B, C, D and E again',
        },
        {
          title: 'The Next Letter Up',
          explanation: 'To go from one letter to the next, take the next white key to the right on the piano: C to D, D to E, and so on. On a guitar string the next letter is two frets further along, except from E to F and from B to C, which are only one fret apart.',
          tryThisQuery: 'F lydian',
          tryThisLabel: 'Hear the letters climb from F: F, G, A, B, C, D, E and F again',
        },
      ],
      tasks: [
        { id: 'l1u34m2t1', instruction: 'Piano: find every C, the white key just left of each group of two black keys, and play them from left to right. Guitar: play the open strings from the thickest to the thinnest and say their names.' },
        { id: 'l1u34m2t2', instruction: 'Play C, D, E, F, G, A, B and C again, saying each name as you play it. On the piano they are the white keys from any C; on the guitar, C is fret 3 of the A string, the second thickest.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u34m3',
      unitId: 'u34',
      levelId: 'l1',
      title: 'Half Steps and Whole Steps',
      subtitle: 'The smallest distances between notes, and the notes in between',
      objectives: [
        'Hear and find a half step: the nearest note',
        'Make a whole step out of two half steps',
        'Name the notes in between with sharps and flats',
      ],
      concepts: [
        {
          title: 'The Nearest Note: a Half Step',
          explanation: 'The nearest note above or below any note is a half step away. On the piano it is the very next key, black or white, with nothing in between. On the guitar it is the next fret on the same string. Twelve half steps in a row, every key from one C to the next, make the chromatic scale.',
          tryThisQuery: 'C chromatic scale',
          tryThisLabel: 'Hear twelve half steps in a row, from C up to the next C',
        },
        {
          title: 'Two Half Steps: a Whole Step',
          explanation: 'Two half steps make a whole step. On the piano a whole step skips one key: from C to D it jumps over the black key between them. On the guitar it is two frets along the same string. A scale made only of whole steps is called the whole-tone scale.',
          tryThisQuery: 'C whole tone scale',
          tryThisLabel: 'Hear whole steps only, from C up to the next C',
        },
        {
          title: 'The Notes in Between',
          explanation: 'Between C and D there is one more note: the black key. It has two names. It is C sharp (C♯), a half step above C, and D flat (D♭), a half step below D. Sharp means a half step higher; flat means a half step lower. Every black key has a sharp name and a flat name.',
          tryThisQuery: 'G major scale',
          tryThisLabel: 'Hear a climb from G with one black key in it, F♯',
        },
        {
          title: 'Where There Is No Black Key',
          explanation: 'Twice in every octave, two white keys sit side by side with no black key between them: E and F, and B and C. Each of those pairs is only a half step apart. Every other pair of neighbouring white keys is a whole step apart, with a black key between them.',
          tryThisQuery: 'C major scale',
          tryThisLabel: 'Hear the white keys from C, with half steps from E to F and from B to C',
        },
      ],
      tasks: [
        { id: 'l1u34m3t1', instruction: 'Play any note, then the note a half step higher: the next key on the piano, or the next fret on the guitar. Then play a whole step: two keys along, or two frets.' },
        { id: 'l1u34m3t2', instruction: 'Find C sharp: on the piano, the black key just right of C; on the guitar, fret 4 of the A string. Say both of its names: C sharp and D flat.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u34m4',
      unitId: 'u34',
      levelId: 'l1',
      title: 'A Scale Is a Ladder',
      subtitle: 'The major scale: whole, whole, half, whole, whole, whole, half',
      objectives: [
        'Hear a major scale climb from its first note to the same note an octave higher',
        'Build a major scale from any note with whole and half steps',
        'Hear the first note of the scale as home',
      ],
      concepts: [
        {
          title: 'Notes in Order: a Scale',
          explanation: 'A scale is a set of notes played in order, like the rungs of a ladder, from a starting note up to the same note an octave higher. One of them is the major scale. It has seven different notes, and then the first note comes back on top.',
          tryThisQuery: 'C major scale',
          tryThisLabel: 'Hear the C major scale: seven notes, then C again on top',
        },
        {
          title: 'Whole, Whole, Half, Whole, Whole, Whole, Half',
          explanation: 'The major scale climbs in this order of steps: whole, whole, half, whole, whole, whole, half. Number its notes 1 to 8 from the bottom: the two half steps are from 3 to 4 and from 7 to 8. From C the steps give C, D, E, F, G, A, B and C: all white keys, because the half steps fall on E to F and B to C.',
          tryThisQuery: 'key of C',
          tryThisLabel: 'Hear the steps from C: whole, whole, half, whole, whole, whole, half',
        },
        {
          title: 'From Any Note',
          explanation: 'Start on any note, take the same steps, and you get the major scale of that note. From G: G, A, B, C, D, E, F♯ and G. The F is raised to F♯ so that the last step, up to G, is a half step and the one before it a whole step. On one guitar string the same steps are 2, 2, 1, 2, 2, 2 and 1 frets.',
          tryThisQuery: 'G major scale',
          tryThisLabel: 'Hear the major scale from G, with F♯',
        },
        {
          title: 'Home',
          explanation: 'The first note of the scale is its home. As the scale climbs, the last steps lead the ear back to it, and when the top note arrives the scale sounds finished. Stop one note early, on the seventh, and it sounds as if something is still to come.',
          tryThisQuery: 'D major scale',
          tryThisLabel: 'Hear the major scale from D climb back home to D',
        },
      ],
      tasks: [
        { id: 'l1u34m4t1', instruction: 'Play the C major scale from C up to the next C, saying whole or half for each step as you play it.' },
        { id: 'l1u34m4t2', instruction: 'Choose any starting note and climb whole, whole, half, whole, whole, whole, half. On the guitar you can do it on one string: 2, 2, 1, 2, 2, 2 and 1 frets. Does the top note sound like home?' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u34m5',
      unitId: 'u34',
      levelId: 'l1',
      title: 'Three Notes Make a Chord',
      subtitle: 'Every other note of the scale, played together',
      objectives: [
        'Build a chord from every other note of a scale',
        'Hear the difference between a major and a minor chord',
        'Turn a major chord into a minor one by moving one note',
      ],
      concepts: [
        {
          title: 'Every Other Note',
          explanation: 'A chord is several notes played at the same time. The simplest chord takes three notes of a scale, skipping one each time: the 1st, the 3rd and the 5th. From the C major scale that gives C, E and G, the C major chord.',
          tryThisQuery: 'C major chord',
          tryThisLabel: 'Hear C, E and G together: the C major chord',
        },
        {
          title: 'Major Sounds Bright',
          explanation: 'Built this way on the first note of a major scale, the chord is a major chord, and it sounds bright and settled. G major is G, B and D; F major is F, A and C.',
          tryThisQuery: 'G major chord',
          tryThisLabel: 'Hear G major: G, B and D',
        },
        {
          title: 'Minor Sounds Darker',
          explanation: 'Lower the middle note of a major chord by a half step and you get a minor chord. C major is C, E and G; C minor is C, E♭ and G. Only that one note changes, and the chord sounds darker.',
          tryThisQuery: 'C minor chord',
          tryThisLabel: 'Hear C minor: C, E♭ and G',
        },
        {
          title: 'Where to Go From Here',
          explanation: 'You can now hear high and low, name the notes, find half and whole steps, build a major scale and make major and minor chords from it. In Explore you can choose any key and see its scale and its chords on your instrument. To read these notes written down, Level 1 starts with the staff.',
          tryThisQuery: 'A minor chord',
          tryThisLabel: 'Hear A minor: A, C and E',
        },
      ],
      tasks: [
        { id: 'l1u34m5t1', instruction: 'Play C, E and G together; on the piano they are three white keys with one white key skipped between each. Then lower E by a half step to E flat and hear the chord turn darker.' },
        { id: 'l1u34m5t2', instruction: 'Build a chord from G yourself: the 1st, 3rd and 5th notes of the G major scale, G, B and D. Play them together, or one after the other, then lower B by a half step to hear G minor.' },
      ],
      prerequisites: [],
    },
  ],
};

// ---------------------------------------------------------------------------
// Track "From the chords you know" (wave 2, 2026-11-10) — src/data/tracks.ts
// 'chords'. For someone who plays songs from chord names and shapes (often on
// guitar) and never learned why the chords go together. No staff needed: a
// Try This writes its notes by name; `chords: …` Try This queries play a list
// of chords in order and open them in Explore's Progression panel.
// ---------------------------------------------------------------------------

const chordsTrack: CurriculumUnit = {
  id: 'u35',
  levelId: 'l1',
  optional: true,
  track: 'chords',
  icon: 'chords',
  title: 'From the chords you know',
  description: 'Ten short lessons that start from the chords you already play: keys, the numbers on a chord chart, why chords pull towards home, sevenths, the capo and the notes for a solo. No reading music needed.',
  modules: [
    {
      id: 'l1u35m1',
      unitId: 'u35',
      levelId: 'l1',
      title: 'Your Chords Live in a Key',
      subtitle: 'G, C, D and Em share seven notes: the notes of G major',
      objectives: [
        'Find the three notes inside chords you already play',
        'See that G, C, D and Em use only the seven notes of G major',
        'Say what a key is: a family of seven notes and the chords built from them',
      ],
      concepts: [
        {
          title: 'Four Chords That Belong Together',
          explanation: 'Play G, C, D and Em one after the other, the way you change chords in a song. They sound as if they belong together, and there is a reason. However many strings you strum, each of these chords is made of three different notes: G is G, B and D; C is C, E and G; D is D, F♯ and A; Em is E, G and B.',
          tryThisQuery: 'chords: G C D Em',
          tryThisLabel: 'Hear G, C, D and Em, one after the other',
        },
        {
          title: 'Seven Notes Between Them',
          explanation: 'Put the notes of the four chords together and leave out the repeats: G, A, B, C, D, E and F♯. That is seven notes, and they are exactly the notes of the G major scale. Notice the F♯, from the D chord: the key of G has F♯ where the key of C has F.',
          tryThisQuery: 'G major scale',
          tryThisLabel: 'Hear the seven notes of G major, from G up to G',
        },
        {
          title: 'What a Key Is',
          explanation: 'A key is a family of seven notes and the chords built from them. To say that a song is in the key of G means that G sounds like home and that the notes of G major are the ones it is built from. The key is named after its home note: the key of G, or G major.',
          tryThisQuery: 'key of G',
          tryThisLabel: 'See the key of G: its seven notes on your instrument',
        },
        {
          title: 'Every Key Has Its Own Family',
          explanation: 'Every major key has seven notes of its own. The key of C has C, D, E, F, G, A and B, with no sharps or flats, and among its chords are C, F, G and Am. The key of D has two sharps, F♯ and C♯, and among its chords are D, G, A and Bm.',
          tryThisQuery: 'chords: C F G Am',
          tryThisLabel: 'Hear chords of the key of C: C, F, G and Am',
        },
      ],
      tasks: [
        { id: 'l1u35m1t1', instruction: 'Play G, C, D and Em in turn, and say the three notes of each one aloud: G B D, C E G, D F♯ A, E G B.' },
        { id: 'l1u35m1t2', instruction: 'Play the G major scale from G up to G, then strum G, C and D. On the guitar, find the F♯ in your D chord: fret 2 of the thinnest string.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m2',
      unitId: 'u35',
      levelId: 'l1',
      title: 'One, Four, Five',
      subtitle: 'The three major chords of a key: I, IV and V',
      objectives: [
        'Number the notes of a key from 1 to 7',
        'Find the three major chords of a major key: I, IV and V',
        'Hear G–C–D in G, C–F–G in C and D–G–A in D as the same move',
      ],
      concepts: [
        {
          title: 'Number the Notes',
          explanation: 'Number the seven notes of a key from its home note. In G, G is 1, A is 2, B is 3, C is 4, D is 5, E is 6 and F♯ is 7. A number says where a note stands in its key, whatever the note is called.',
          tryThisQuery: 'key of G',
          tryThisLabel: 'Hear the notes of G from 1 to 7, and 1 again on top',
        },
        {
          title: 'A Chord on Every Note',
          explanation: 'A key has a chord on each of its seven notes, built from the key\'s own notes. The chords are named by number, in Roman numerals: I, II, III, IV, V, VI, VII. In a major key the chords on 1, 4 and 5 are its three major chords, written in capitals: I, IV and V. In G they are G, C and D.',
          tryThisQuery: 'chords: G C D G',
          tryThisLabel: 'Hear I, IV, V and I in G: G, C, D and G',
        },
        {
          title: 'The Same Move in Every Key',
          explanation: 'Because the numbers belong to the key, I–IV–V–I is the same move in any key; only the names change. In C it is C, F, G and C; in D, D, G, A and D; in A, A, D, E and A; in E, E, A, B and E.',
          tryThisQuery: 'chords: C F G C',
          tryThisLabel: 'Hear I, IV, V and I in C: C, F, G and C',
        },
        {
          title: 'A Chart in Numbers',
          explanation: 'A chord chart written in numbers works in every key. I–IV–I–V means home, the chord on 4, home again, the chord on 5. Choose a key, find its notes 1, 4 and 5, and you know which chords to play.',
          tryThisQuery: 'chords: D G A D',
          tryThisLabel: 'Hear I, IV, V and I in D: D, G, A and D',
        },
      ],
      tasks: [
        { id: 'l1u35m2t1', instruction: 'Play I, IV, V and I in G (G, C, D, G), then in C (C, F, G, C). Does the move feel the same in both keys?' },
        { id: 'l1u35m2t2', instruction: 'Pick the key of a song you play. Count up its scale from 1 to find notes 4 and 5, then play its I, IV and V chords.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m3',
      unitId: 'u35',
      levelId: 'l1',
      title: 'The Minor Chords of the Key',
      subtitle: 'ii, iii and vi, one diminished chord, and the relative minor',
      objectives: [
        'Find the three minor chords of a major key: ii, iii and vi',
        'Know the diminished chord on 7',
        'Hear the vi chord as the home of the relative minor key',
      ],
      concepts: [
        {
          title: 'Three Minor Chords',
          explanation: 'In a major key the chords on 2, 3 and 6 are minor. They are written in small Roman numerals: ii, iii and vi. In G they are Am, Bm and Em; in C, Dm, Em and Am; in D, Em, F♯m and Bm.',
          tryThisQuery: 'chords: G Am Bm Em',
          tryThisLabel: 'Hear I, ii, iii and vi in G: G, Am, Bm and Em',
        },
        {
          title: 'The Chord on 7',
          explanation: 'The chord on 7, built from the key\'s own notes, is diminished: like a minor chord with its top note a half step lower, and it sounds tense. It is written vii°. In G it is F♯ diminished, F♯, A and C; in C it is B diminished, B, D and F.',
          tryThisQuery: 'F#dim',
          tryThisLabel: 'Hear vii° in G: F♯, A and C',
        },
        {
          title: 'The Whole Family',
          explanation: 'Every major key has the same pattern of seven chords: I, ii, iii, IV, V, vi and vii°. Major on 1, 4 and 5; minor on 2, 3 and 6; diminished on 7. In G: G, Am, Bm, C, D, Em and F♯dim. In C: C, Dm, Em, F, G, Am and Bdim.',
          tryThisQuery: 'chords: G Am Bm C D Em',
          tryThisLabel: 'Hear six chords of G: G, Am, Bm, C, D and Em',
        },
        {
          title: 'The Relative Minor',
          explanation: 'Em, the vi of G, is the home chord of a key of its own: E minor. E minor uses the same seven notes as G major, starting from E: E, F♯, G, A, B, C and D. Two keys that share all seven notes are relatives: E minor is the relative minor of G major. The relative minor of C is A minor, and of D, B minor. Which of the two is the key depends on which chord sounds like home.',
          tryThisQuery: 'chords: Em C D Em',
          tryThisLabel: 'Hear the same notes with Em as home: Em, C, D and Em',
        },
      ],
      tasks: [
        { id: 'l1u35m3t1', instruction: 'Play the chords of G in order, G, Am, Bm, C, D and Em, and listen for the three that sound darker.' },
        { id: 'l1u35m3t2', instruction: 'Play Em, C, D and Em a few times, then G, C, D and G. The notes are the same: which chord sounds like home in each?' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m4',
      unitId: 'u35',
      levelId: 'l1',
      title: 'Home and Away',
      subtitle: 'Why V leads back to I, and the softer way home',
      objectives: [
        'Hear I as home and V as a chord that wants to go back to it',
        'Find the note that pulls: the 7th note of the key, a half step under home',
        'Hear IV to I as a softer way home',
      ],
      concepts: [
        {
          title: 'Home',
          explanation: 'I is home. When a chord loop comes back to I it sounds settled, the way a scale sounds finished on its top note. Stop the loop on another chord and it sounds as if something is still to come.',
          tryThisQuery: 'chords: G C D G',
          tryThisLabel: 'Hear G, C, D and back home to G',
        },
        {
          title: 'V Pulls Back to I',
          explanation: 'V pulls hardest towards home. In G, the V chord, D, holds F♯: the 7th note of the key, a half step under G. A note that close to home leans towards it, and the ear wants F♯ to rise to G and the D chord to move to G. Play D and stop, and it sounds unfinished.',
          tryThisQuery: 'chords: G D G',
          tryThisLabel: 'Hear G, then D leaning towards home, then G',
        },
        {
          title: 'The Same Pull in Every Key',
          explanation: 'In every major key V holds the 7th note of the key, a half step under home. In C, the G chord holds B, under C; in D, the A chord holds C♯, under D; in A, the E chord holds G♯, under A; in E, the B chord holds D♯, under E.',
          tryThisQuery: 'chords: C G C',
          tryThisLabel: 'Hear the B of the G chord rise to C: C, G and C',
        },
        {
          title: 'IV to I: the Softer Way Home',
          explanation: 'IV leads home too, more gently. In G, C goes to G: the C chord has no note a half step under G, so nothing leans into home, and the move sounds calm rather than urgent. From V, coming home sounds like an arrival; from IV, like settling.',
          tryThisQuery: 'chords: G C G',
          tryThisLabel: 'Hear G, C and G: IV to I',
        },
      ],
      tasks: [
        { id: 'l1u35m4t1', instruction: 'Play G, C, D and stop on D. Wait, then play G. Then play G, D, C and stop on C, then G. Which stop sounded more unfinished?' },
        { id: 'l1u35m4t2', instruction: 'Play D, then F♯ and G one after the other: on the guitar, frets 2 and 3 of the thinnest string. Hear F♯ lean into G.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m5',
      unitId: 'u35',
      levelId: 'l1',
      title: 'Major and Minor: One Note',
      subtitle: 'The middle note, a half step lower',
      objectives: [
        'Find the one note that differs between a major chord and the minor chord on the same note',
        'Move it on the guitar, one fret lower, or on the piano, one key lower',
        'Tell major from minor by ear',
      ],
      concepts: [
        {
          title: 'One Note Apart',
          explanation: 'G major is G, B and D; G minor is G, B♭ and D. Only the middle note changes, and it moves down a half step. The same holds for every major chord and the minor chord on the same note: C and Cm, D and Dm, E and Em, A and Am.',
          tryThisQuery: 'chords: G Gm',
          tryThisLabel: 'Hear G, then Gm',
        },
        {
          title: 'One Fret Lower',
          explanation: 'On the guitar a half step is one fret, so the string that plays the middle note goes one fret lower. E to Em: the G string goes from fret 1 to open. A to Am: the B string goes from fret 2 to fret 1. D to Dm: the thinnest string goes from fret 2 to fret 1. In the open G and C shapes the middle note is also on an open string, which cannot go lower, so Gm and Cm need other shapes. On the piano the middle note moves to the next key down.',
          tryThisQuery: 'chords: E Em',
          tryThisLabel: 'Hear E, then Em: one note moves down a half step',
        },
        {
          title: 'Bright and Dark',
          explanation: 'Major chords sound brighter, minor chords darker, and that one note is the whole difference. It is also why a key has both kinds: in G, the chord on 1 gets B as its middle note and is G major, while the chord on 2 gets C, not C♯, and is A minor.',
          tryThisQuery: 'chords: A Am',
          tryThisLabel: 'Hear C♯ become C: A, then Am',
        },
      ],
      tasks: [
        { id: 'l1u35m5t1', instruction: 'Play E and then Em, and watch which finger moves. Do the same with A and Am, and with D and Dm.' },
        { id: 'l1u35m5t2', instruction: 'Play G and then G minor. On the guitar, try Gm as a barre at fret 3; on the piano, move the B of G major down one key to B♭.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m6',
      unitId: 'u35',
      levelId: 'l1',
      title: 'What Is Inside a Chord',
      subtitle: '1, 3 and 5: every other note from the chord\'s own note',
      objectives: [
        'Build a chord from every other note of a scale: 1, 3 and 5',
        'Name the root, the 3rd and the 5th of a chord you play',
        'See why six strings play only three different notes',
      ],
      concepts: [
        {
          title: 'Every Other Note',
          explanation: 'Start on a chord\'s own note and take every other note of its major scale: the 1st, the 3rd and the 5th. From G: G, skip A, B, skip C, D. So G major is G, B and D. From C it gives C, E and G; from D, D, F♯ and A.',
          tryThisQuery: 'G major chord',
          tryThisLabel: 'Hear G, B and D together: G major',
        },
        {
          title: 'Root, Third and Fifth',
          explanation: 'The three notes have names. The root, 1, is the chord\'s own note and gives it its name. The third, 3, makes it major or minor: it is the middle note you moved in the last lesson. The fifth, 5, is the highest of the three when they are stacked up from the root.',
          tryThisQuery: 'D major chord',
          tryThisLabel: 'Hear D major: D, F♯ and A',
        },
        {
          title: 'Six Strings, Three Notes',
          explanation: 'An open G chord sounds six strings but plays only three different notes. From the thickest string: G, B, D, G, B and G. Open Em is E, B, E, G, B and E. The notes are repeated in other octaves, which makes the chord sound fuller; it is still the same three notes.',
          tryThisQuery: 'E minor chord',
          tryThisLabel: 'Hear Em: E, G and B, however many strings play them',
        },
        {
          title: 'The Same Recipe for Every Chord of a Key',
          explanation: 'Every other note works for all the chords of a key, using the key\'s own notes. In G, from 2 it gives A, C and E: A minor. From 7 it gives F♯, A and C: F♯ diminished. The notes of the key decide which kind each chord is.',
          tryThisQuery: 'A minor chord',
          tryThisLabel: 'Hear Am: A, C and E',
        },
      ],
      tasks: [
        { id: 'l1u35m6t1', instruction: 'Play an open G chord one string at a time, from the thickest, and name each note: G, B, D, G, B, G.' },
        { id: 'l1u35m6t2', instruction: 'Choose a major chord you know and say its root. Count every other note of the root\'s major scale to find its 3rd and 5th, and play the three notes one after the other.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m7',
      unitId: 'u35',
      levelId: 'l1',
      title: 'The Seventh',
      subtitle: 'A fourth note on top: G7 is G, B, D and F',
      objectives: [
        'Build a seventh chord: 1, 3, 5 and a seventh',
        'See why G7 pulls to C',
        'Play the three chords of a twelve-bar blues: I7, IV7 and V7',
      ],
      concepts: [
        {
          title: 'A Fourth Note',
          explanation: 'A seventh chord adds a fourth note to the three: a seventh above the root, the seventh letter counting the root as the first. G7 is G, B, D and F. The F is a whole step under the G above, and that is the seventh a plain 7 in a chord name means.',
          tryThisQuery: 'G7',
          tryThisLabel: 'Hear G7: G, B, D and F',
        },
        {
          title: 'G7 Pulls to C',
          explanation: 'F is not one of the notes of G major, but it is one of the notes of C major: G, B, D and F all belong to C. In C, G is the V chord, so G7 is the V of C with a seventh, and it pulls to C even harder than G does: its B wants to rise to C and its F to fall to E.',
          tryThisQuery: 'chords: G7 C',
          tryThisLabel: 'Hear G7 and then C',
        },
        {
          title: 'V7 in Every Key',
          explanation: 'Each key has its V7: the chord on 5 with this seventh. The chord on 5 is called the dominant, so a chord like G7 or D7 is called a dominant 7th. D7, D, F♯, A and C, pulls to G. E7, E, G♯, B and D, pulls to A. B7, B, D♯, F♯ and A, pulls to E.',
          tryThisQuery: 'chords: D7 G',
          tryThisLabel: 'Hear D7 and then G',
        },
        {
          title: 'The Twelve-Bar Blues',
          explanation: 'The twelve-bar blues is a pattern of twelve bars on three chords, I, IV and V. In a blues all three are often played as seventh chords: I7, IV7 and V7. Here the sevenths do not lead to another key; they are part of the sound. One common form, in G: G7 for four bars, C7 for two, G7 for two, then D7, C7, G7 and D7 for one bar each.',
          tryThisQuery: 'chords: G7 G7 G7 G7 C7 C7 G7 G7 D7 C7 G7 D7',
          tryThisLabel: 'Hear the twelve bars in G, one chord for each bar',
        },
      ],
      tasks: [
        { id: 'l1u35m7t1', instruction: 'Play G7 and then C, then G and then C. Which of the two leans harder into C?' },
        { id: 'l1u35m7t2', instruction: 'Play the twelve-bar blues in G, four strums to a bar: G7 for four bars, C7 for two, G7 for two, then D7, C7, G7 and D7.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m8',
      unitId: 'u35',
      levelId: 'l1',
      title: 'Moving a Song: Other Keys and the Capo',
      subtitle: 'The numbers stay, the names change',
      objectives: [
        'Move a chord progression to another key by its numbers',
        'Work out which key a capo puts your shapes in',
        'Play the same loop in two keys',
      ],
      concepts: [
        {
          title: 'The Numbers Stay',
          explanation: 'Write a song\'s chords as numbers and it can be played in any key. I–V–vi–IV is G, D, Em and C in G. In A it is A, E, F♯m and D; in C, C, G, Am and F; in D, D, A, Bm and G.',
          tryThisQuery: 'chords: G D Em C',
          tryThisLabel: 'Hear I, V, vi and IV in G: G, D, Em and C',
        },
        {
          title: 'The Names Change',
          explanation: 'To move a song from G to A, move every chord up by the same distance. G to A is a whole step, so D becomes E, Em becomes F♯m and C becomes D. Count it in numbers or in frets: the result is the same.',
          tryThisQuery: 'chords: A E F#m D',
          tryThisLabel: 'Hear the same loop in A: A, E, F♯m and D',
        },
        {
          title: 'What a Capo Does',
          explanation: 'A capo presses all six strings down at one fret, so every shape you play sounds higher by that many frets, a half step for each. With the capo at fret 2, the G shape sounds A, C sounds D, D sounds E and Em sounds F♯m. G shapes with a capo at fret 2 sound in the key of A.',
          tryThisQuery: 'chords: A D E A',
          tryThisLabel: 'Hear G, C, D and G shapes with the capo at fret 2: A, D, E and A',
        },
        {
          title: 'Shape and Sound',
          explanation: 'With a capo each chord has two names: the shape you finger and the chord that sounds. The key is the one that sounds. C shapes with the capo at fret 4 are in the key of E; D shapes with the capo at fret 5 are in the key of G. A chart can be written either way, so check which one it means.',
          tryThisQuery: 'key of E',
          tryThisLabel: 'See the key of E: what C shapes sound like with the capo at fret 4',
        },
      ],
      tasks: [
        { id: 'l1u35m8t1', instruction: 'Play G, D, Em and C, then the same loop in A: A, E, F♯m and D. On the guitar, F♯m can be a barre at fret 2.' },
        { id: 'l1u35m8t2', instruction: 'Put a capo at fret 2 and play your G, D, Em and C shapes. They sound A, E, F♯m and D: compare them with the loop in A you played without it.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m9',
      unitId: 'u35',
      levelId: 'l1',
      title: 'Notes for a Melody or a Solo',
      subtitle: 'The seven notes of the key, and the five safest',
      objectives: [
        'Know which notes belong with the chords of a key',
        'Play the major pentatonic: five notes of the key',
        'Find the minor pentatonic from the relative minor\'s home note',
      ],
      concepts: [
        {
          title: 'The Notes of the Key',
          explanation: 'Every chord of a key is built from its seven notes, so a melody or a solo made of the same notes belongs with them. In G those are G, A, B, C, D, E and F♯. Held over some chords, a few of them rub, but none of them is out of the key.',
          tryThisQuery: 'G major scale',
          tryThisLabel: 'Hear the seven notes of G',
        },
        {
          title: 'Five Safe Notes',
          explanation: 'Leave out notes 4 and 7 and five remain: 1, 2, 3, 5 and 6. That is the major pentatonic scale; in G, G, A, B, D and E. Notes 4 and 7 are each a half step from a note of the I chord, C above B and F♯ under G, the closest two notes can rub. No two of the five are a half step apart, which makes them the safest choice over the chords of the key.',
          tryThisQuery: 'G major pentatonic',
          tryThisLabel: 'Hear the G major pentatonic: G, A, B, D and E',
        },
        {
          title: 'The Same Five from the Relative Minor',
          explanation: 'Play the same five notes from E, the home note of G\'s relative minor, and they are E, G, A, B and D: the E minor pentatonic. It is the same set of notes as the G major pentatonic, so over the chords of G major or of E minor both names give the same five notes.',
          tryThisQuery: 'E minor pentatonic',
          tryThisLabel: 'Hear the E minor pentatonic: E, G, A, B and D',
        },
        {
          title: 'In Other Keys',
          explanation: 'In C the major pentatonic is C, D, E, G and A, and the minor pentatonic of its relative, A minor, is A, C, D, E and G. In D it is D, E, F♯, A and B, and the B minor pentatonic is B, D, E, F♯ and A.',
          tryThisQuery: 'A minor pentatonic',
          tryThisLabel: 'Hear the A minor pentatonic: A, C, D, E and G',
        },
      ],
      tasks: [
        { id: 'l1u35m9t1', instruction: 'Play the G major pentatonic up and down: G, A, B, D, E and G. Then strum G, C or D and answer each chord with one of the five notes.' },
        { id: 'l1u35m9t2', instruction: 'Play the E minor pentatonic, E, G, A, B, D and E. On the guitar it lies on the open strings and frets 2 and 3: thickest string 0 and 3, then 0 and 2 on the next three strings, then 0 and 3 on the last two.' },
      ],
      prerequisites: [],
    },
    {
      id: 'l1u35m10',
      unitId: 'u35',
      levelId: 'l1',
      title: 'A Chord from Outside',
      subtitle: 'Borrowed chords, and how to tell the key anyway',
      objectives: [
        'Spot a chord that is not one of the key\'s seven',
        'Name F in the key of G as ♭VII, and A major as II, not ii',
        'Tell the key of a song from its home chord',
      ],
      concepts: [
        {
          title: 'Not Every Chord Is in the Key',
          explanation: 'Songs do not always keep to the seven chords of their key. A chord with a note the key does not have comes from outside it; it is said to be borrowed. You can spot one by its notes: if one of them is not in the key, the chord is not one of the key\'s seven.',
          tryThisQuery: 'chords: G F C G',
          tryThisLabel: 'Hear a loop with a chord from outside the key: G, F, C and G',
        },
        {
          title: 'F in the Key of G: ♭VII',
          explanation: 'F major is F, A and C. The key of G has F♯, not F, so F is not one of its chords. It stands on the 7th note of the key lowered by a half step, F instead of F♯, and it is major, so it is written ♭VII. F major is one of the chords of G minor, the minor key on the same home note.',
          tryThisQuery: 'F major chord',
          tryThisLabel: 'Hear F: F, A and C, with F instead of F♯',
        },
        {
          title: 'A Major in the Key of G: II, Not ii',
          explanation: 'The ii of G is A minor: A, C and E. A major has C♯ instead of C, a note G major does not have, so it is not the key\'s ii: it is written II, in capitals for a major chord. Its C♯ is a half step under D, so A major leans towards D, the V, the way V leans towards I.',
          tryThisQuery: 'chords: G A D G',
          tryThisLabel: 'Hear A major lean towards D: G, A, D and G',
        },
        {
          title: 'Telling the Key Anyway',
          explanation: 'One chord from outside does not change the key. Find the chord the song keeps coming back to and comes to rest on, then check that the other chords belong to that key. G, F, C and G is still in G: G is home, and C belongs to G too. From here, Explore shows any key with its chords, and Level 2 goes further into keys and how chords work together.',
          tryThisQuery: 'key of G',
          tryThisLabel: 'See the key of G and its notes on your instrument',
        },
      ],
      tasks: [
        { id: 'l1u35m10t1', instruction: 'Play G, F, C and G, then G, C, D and G. Which loop has a chord from outside the key of G, and which note gives it away?' },
        { id: 'l1u35m10t2', instruction: 'Take a song you play. Find its home chord, then check each chord against the chords of that key, and mark any chord from outside with the note that is not in the key.' },
      ],
      prerequisites: [],
    },
  ],
};

export const L1_UNITS: CurriculumUnit[] = [
  {
    id: 'u1',
    levelId: 'l1',
    title: 'Notation and Pitch',
    description: 'The staff, clefs, half steps, whole steps, accidentals, and the chromatic scale',
    icon: 'building-blocks',
    modules: [l1u1m1, l1u1m2, l1u1m3, l1u1m4],
    milestone: {
      skillsSummary: [
        'Read treble and bass clef and locate middle C on the grand staff',
        'Define half steps and whole steps and find them on the piano',
        'Identify sharps, flats, and enharmonic equivalents',
        'Know all 12 chromatic pitches and see them on the keyboard',
      ],
      bridgeText:
        "You know the 12 pitches and how distance works on the keyboard. Next you'll learn how time is organized in music — note values, rests, and meter.",
      tryThisQuery: 'C chromatic scale',
      tryThisLabel: 'Play all 12 notes in order',
      tryThisPrompt: 'Can you name every note before hearing it?',
    },
  },
  {
    id: 'u2',
    levelId: 'l1',
    title: 'Rhythm and Meter',
    description: 'Note values, rests, dots, ties, and simple time signatures',
    icon: 'scales',
    modules: [l1u2m1, l1u2m2],
    milestone: {
      skillsSummary: [
        'Know the note-value hierarchy from whole notes to sixteenth notes',
        'Understand dots and ties as duration modifiers',
        'Read simple time signatures: 2/4, 3/4, 4/4',
        'Feel duple, triple, and quadruple meter',
      ],
      bridgeText:
        "You understand both pitch and rhythm — the two dimensions of music notation. Now you'll combine them into scales, intervals, and your first chords.",
      tryThisQuery: 'G major scale',
      tryThisLabel: 'Play G major at a steady tempo',
      tryThisPrompt: 'Try tapping quarter notes while the scale plays.',
    },
  },
  {
    id: 'u3',
    levelId: 'l1',
    title: 'Scales, Intervals, and First Chords',
    description: 'The major scale, key signatures, interval numbers, and major triads',
    icon: 'chords',
    modules: [l1u3m1, l1u3m2, l1u3m3, l1u3m4],
    milestone: {
      skillsSummary: [
        'Build major scales in C, G, D, and F using the W-W-H-W-W-W-H pattern',
        'Read key signatures for the first four major keys',
        'Name intervals from unison to octave by counting letter names',
        'Build major triads from any root note',
      ],
      bridgeText: '',
      tryThisQuery: 'D major chord',
      tryThisLabel: 'Build a D major triad',
      tryThisPrompt: 'Name the three notes before playing.',
    },
    completionContent: {
      startedWith: 'A blank staff and a keyboard.',
      journeySummary: [
        'The staff, clefs, and how position maps to pitch',
        'Half steps, whole steps, sharps, flats, and all 12 chromatic notes',
        'Note values, rests, and how beats group into meter',
        'The major scale pattern and your first four key signatures',
        'Intervals by number — the distance system of music',
        'Major triads — your first chords, bright and stable',
      ],
      whatsNext:
        'Level 2 expands everything: all 12 major keys, minor scales, the full interval system, all four triad types, and diatonic harmony.',
      tryThisQuery: 'key of G',
      tryThisLabel: 'Explore the key of G',
      tryThisPrompt:
        'You know G major has one sharp. In Level 2 you will learn every key on the Circle of Fifths.',
    },
  },
  guitarNotation,
  // The starting tracks (wave 2, src/data/tracks.ts): after the levels' own
  // units, in TRACK order.
  soundTrack,
  chordsTrack,
];
