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
        "A clef sits at the beginning of a staff and tells you which pitches the lines and spaces represent. The treble clef (𝄞) centers on G above middle C — it's used for higher instruments and the right hand on piano. The bass clef (𝄢) centers on F below middle C — it's used for lower instruments and the left hand on piano. Without a clef, the staff is just lines — the clef gives them meaning.",
      tryThisQuery: 'key of C',
      tryThisLabel: 'Explore the key of C',
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
        'Build major scales in C, G, D, and F using the W-W-H pattern',
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
];
