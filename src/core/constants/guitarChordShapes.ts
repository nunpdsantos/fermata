// Guitar chord shape definitions based on the CAGED system
// Each shape defines exact string/fret positions for playable chord voicings

import { Note } from '../types/music';

// Fret position for a single string
// null = muted (X), 0 = open (O), 1+ = fretted
export type StringFret = number | null;

// Finger assignment: 1=index, 2=middle, 3=ring, 4=pinky, 0=open/muted, 'bar'=barre
export type FingerNumber = 0 | 1 | 2 | 3 | 4 | 'bar';

// A single string position in a chord shape
export interface ChordStringPosition {
  fret: StringFret;
  finger?: FingerNumber;
}

// Complete chord shape definition
export interface ChordShape {
  name: string; // "C Major Open", "E-shape Barre Major"
  shortName: string; // "Open", "E-shape", "A-shape"
  type: 'open' | 'barre';
  cagedShape: 'C' | 'A' | 'G' | 'E' | 'D'; // Which CAGED shape this derives from
  rootString: 1 | 2 | 3 | 4 | 5 | 6; // Which string has the root note
  rootFretOffset: number; // Fret offset from shape start to root
  // String positions from 6th (low E) to 1st (high E)
  strings: [
    ChordStringPosition, // 6th string
    ChordStringPosition, // 5th string
    ChordStringPosition, // 4th string
    ChordStringPosition, // 3rd string
    ChordStringPosition, // 2nd string
    ChordStringPosition, // 1st string
  ];
  barreInfo?: {
    fret: number; // Which fret the barre is on (relative to shape)
    fromString: number; // Start string (6=low E)
    toString: number; // End string (1=high E)
  };
}

// Chord shape library organized by quality
export interface ChordShapeLibrary {
  [quality: string]: ChordShape[];
}

// ============================================
// MAJOR CHORD SHAPES
// ============================================

const MAJOR_SHAPES: ChordShape[] = [
  // C Major Open
  {
    name: 'C Major Open',
    shortName: 'C shape',
    type: 'open',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 3 }, // 5th - C (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 1, finger: 1 }, // 2nd - C
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // G Major Open
  {
    name: 'G Major Open',
    shortName: 'G shape',
    type: 'open',
    cagedShape: 'G',
    rootString: 6,
    rootFretOffset: 3,
    strings: [
      { fret: 3, finger: 2 }, // 6th - G (root)
      { fret: 2, finger: 1 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 3, finger: 3 }, // 1st - G
    ],
  },
  // D Major Open
  {
    name: 'D Major Open',
    shortName: 'D shape',
    type: 'open',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 0 }, // 4th - D (root)
      { fret: 2, finger: 1 }, // 3rd - A
      { fret: 3, finger: 3 }, // 2nd - D
      { fret: 2, finger: 2 }, // 1st - F#
    ],
  },
  // E Major Open
  {
    name: 'E Major Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 2, finger: 3 }, // 4th - E
      { fret: 1, finger: 1 }, // 3rd - G#
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // A Major Open
  {
    name: 'A Major Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 1 }, // 4th - E
      { fret: 2, finger: 2 }, // 3rd - A
      { fret: 2, finger: 3 }, // 2nd - C#
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E-shape Barre Major (moveable)
  {
    name: 'E-shape Barre',
    shortName: 'E barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th
      { fret: 2, finger: 4 }, // 4th
      { fret: 1, finger: 2 }, // 3rd
      { fret: 0, finger: 'bar' }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A-shape Barre Major (moveable)
  {
    name: 'A-shape Barre',
    shortName: 'A barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th
      { fret: 2, finger: 3 }, // 3rd
      { fret: 2, finger: 4 }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // C-shape Barre Major (moveable) - root on 5th string
  {
    name: 'C-shape Barre',
    shortName: 'C barre',
    type: 'barre',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root (index barre)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 1, finger: 2 }, // 3rd - root (middle)
      { fret: 2, finger: 4 }, // 2nd - 3rd (pinky)
      { fret: 0, finger: 'bar' }, // 1st - 5th (index barre)
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // D-shape Barre Major (moveable) - root on 4th string
  {
    name: 'D-shape Barre',
    shortName: 'D barre',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 2 }, // 3rd - 5th
      { fret: 3, finger: 4 }, // 2nd - root
      { fret: 2, finger: 3 }, // 1st - 3rd
    ],
  },
  // G-shape Barre Major (moveable) - root on 6th string
  {
    name: 'G-shape Barre',
    shortName: 'G barre',
    type: 'barre',
    cagedShape: 'G',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 3rd
      { fret: 0, finger: 1 }, // 4th - 5th
      { fret: 0, finger: 1 }, // 3rd - root
      { fret: 0, finger: 1 }, // 2nd - 3rd
      { fret: 3, finger: 4 }, // 1st - root
    ],
  },
];

// ============================================
// MINOR CHORD SHAPES
// ============================================

const MINOR_SHAPES: ChordShape[] = [
  // A Minor Open
  {
    name: 'A Minor Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 2, finger: 3 }, // 3rd - A
      { fret: 1, finger: 1 }, // 2nd - C
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E Minor Open
  {
    name: 'E Minor Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 2, finger: 3 }, // 4th - E
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // D Minor Open
  {
    name: 'D Minor Open',
    shortName: 'D shape',
    type: 'open',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 0 }, // 4th - D (root)
      { fret: 2, finger: 2 }, // 3rd - A
      { fret: 3, finger: 3 }, // 2nd - D
      { fret: 1, finger: 1 }, // 1st - F
    ],
  },
  // E-shape Barre Minor (moveable)
  {
    name: 'Em-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th
      { fret: 2, finger: 4 }, // 4th
      { fret: 0, finger: 'bar' }, // 3rd
      { fret: 0, finger: 'bar' }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A-shape Barre Minor (moveable)
  {
    name: 'Am-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 3 }, // 4th
      { fret: 2, finger: 4 }, // 3rd
      { fret: 1, finger: 2 }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // C-shape Barre Minor (moveable) - root on 5th string
  {
    name: 'Cm-shape Barre',
    shortName: 'C shape',
    type: 'barre',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 2, finger: 3 }, // 4th - 5th
      { fret: 1, finger: 2 }, // 3rd - root
      { fret: 1, finger: 2 }, // 2nd - b3
      { fret: 0, finger: 1 }, // 1st - 5th
    ],
  },
  // D-shape Barre Minor (moveable) - root on 4th string
  {
    name: 'Dm-shape Barre',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 3 }, // 3rd - 5th
      { fret: 3, finger: 4 }, // 2nd - root
      { fret: 1, finger: 2 }, // 1st - b3
    ],
  },
];

// ============================================
// DOMINANT 7TH CHORD SHAPES
// ============================================

const DOMINANT7_SHAPES: ChordShape[] = [
  // E7 Open
  {
    name: 'E7 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D (b7)
      { fret: 1, finger: 1 }, // 3rd - G#
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // A7 Open
  {
    name: 'A7 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 0, finger: 0 }, // 3rd - G (b7)
      { fret: 2, finger: 3 }, // 2nd - C#
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // D7 Open
  {
    name: 'D7 Open',
    shortName: 'D shape',
    type: 'open',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 0 }, // 4th - D (root)
      { fret: 2, finger: 2 }, // 3rd - A
      { fret: 1, finger: 1 }, // 2nd - C (b7)
      { fret: 2, finger: 3 }, // 1st - F#
    ],
  },
  // G7 Open
  {
    name: 'G7 Open',
    shortName: 'G shape',
    type: 'open',
    cagedShape: 'G',
    rootString: 6,
    rootFretOffset: 3,
    strings: [
      { fret: 3, finger: 3 }, // 6th - G (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 1, finger: 1 }, // 1st - F (b7)
    ],
  },
  // C7 Open
  {
    name: 'C7 Open',
    shortName: 'C shape',
    type: 'open',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 3 }, // 5th - C (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 3, finger: 4 }, // 3rd - Bb (b7)
      { fret: 1, finger: 1 }, // 2nd - C
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E7-shape Barre (moveable)
  {
    name: 'E7-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th
      { fret: 0, finger: 'bar' }, // 4th - b7
      { fret: 1, finger: 2 }, // 3rd
      { fret: 0, finger: 'bar' }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A7-shape Barre (moveable)
  {
    name: 'A7-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th
      { fret: 0, finger: 'bar' }, // 3rd - b7
      { fret: 2, finger: 3 }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // D7-shape Barre (moveable) - root on 4th string
  {
    name: 'D7-shape Barre',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root (index)
      { fret: 2, finger: 3 }, // 3rd - 5th (ring)
      { fret: 1, finger: 2 }, // 2nd - b7 (middle)
      { fret: 2, finger: 3 }, // 1st - 3rd (ring barring with 3rd string)
    ],
  },
  // C7-shape Barre (moveable) - root on 5th string
  {
    name: 'C7-shape Barre',
    shortName: 'C shape',
    type: 'barre',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 2, finger: 3 }, // 4th - 5th
      { fret: 3, finger: 4 }, // 3rd - b7
      { fret: 2, finger: 2 }, // 2nd - 3rd
      { fret: 0, finger: 1 }, // 1st - 5th
    ],
  },
];

// ============================================
// MINOR 7TH CHORD SHAPES
// ============================================

const MINOR7_SHAPES: ChordShape[] = [
  // Am7 Open (A shape)
  {
    name: 'Minor 7 - A shape Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 0, finger: 0 }, // 3rd - G (b7)
      { fret: 1, finger: 1 }, // 2nd - C
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Em7 Open (E shape)
  {
    name: 'Minor 7 - E shape Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D (b7)
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Dm7 Open (D shape)
  {
    name: 'Minor 7 - D shape Open',
    shortName: 'D shape',
    type: 'open',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 0 }, // 4th - D (root)
      { fret: 2, finger: 2 }, // 3rd - A
      { fret: 1, finger: 1 }, // 2nd - C (b7)
      { fret: 1, finger: 1 }, // 1st - F
    ],
  },
  // E-shape Barre (moveable)
  {
    name: 'Minor 7 - E shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th
      { fret: 0, finger: 'bar' }, // 4th - b7
      { fret: 0, finger: 'bar' }, // 3rd
      { fret: 0, finger: 'bar' }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A-shape Barre (moveable)
  {
    name: 'Minor 7 - A shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 3 }, // 4th
      { fret: 0, finger: 'bar' }, // 3rd - b7
      { fret: 1, finger: 2 }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // D-shape Barre (moveable) - root on 4th string
  {
    name: 'Minor 7 - D shape Barre',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 3 }, // 3rd - 5th
      { fret: 1, finger: 2 }, // 2nd - b7
      { fret: 1, finger: 2 }, // 1st - b3
    ],
  },
  // C-shape Barre (moveable) - root on 5th string
  {
    name: 'Minor 7 - C shape Barre',
    shortName: 'C shape',
    type: 'barre',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 2, finger: 3 }, // 4th - 5th
      { fret: 3, finger: 4 }, // 3rd - b7
      { fret: 1, finger: 2 }, // 2nd - b3
      { fret: 0, finger: 1 }, // 1st - 5th
    ],
  },
];

// ============================================
// MAJOR 7TH CHORD SHAPES
// ============================================

const MAJOR7_SHAPES: ChordShape[] = [
  // Cmaj7 Open
  {
    name: 'Cmaj7 Open',
    shortName: 'C shape',
    type: 'open',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 3 }, // 5th - C (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B (7)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Fmaj7 Open (partial)
  {
    name: 'Fmaj7 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 4,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 3, finger: 3 }, // 4th - F (root)
      { fret: 2, finger: 2 }, // 3rd - A
      { fret: 1, finger: 1 }, // 2nd - C
      { fret: 0, finger: 0 }, // 1st - E (7)
    ],
  },
  // Gmaj7 Open
  {
    name: 'Gmaj7 Open',
    shortName: 'G shape',
    type: 'open',
    cagedShape: 'G',
    rootString: 6,
    rootFretOffset: 3,
    strings: [
      { fret: 3, finger: 2 }, // 6th - G (root)
      { fret: 2, finger: 1 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 2, finger: 3 }, // 1st - F# (7)
    ],
  },
  // Amaj7 Open
  {
    name: 'Amaj7 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 1, finger: 1 }, // 3rd - G# (7)
      { fret: 2, finger: 3 }, // 2nd - C#
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Dmaj7 Open
  {
    name: 'Dmaj7 Open',
    shortName: 'D shape',
    type: 'open',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 0 }, // 4th - D (root)
      { fret: 2, finger: 1 }, // 3rd - A
      { fret: 2, finger: 2 }, // 2nd - C# (7)
      { fret: 2, finger: 3 }, // 1st - F#
    ],
  },
  // Emaj7-shape Barre (moveable) - root on 6th string
  {
    name: 'Emaj7-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th - 5th
      { fret: 1, finger: 2 }, // 4th - 7th
      { fret: 1, finger: 2 }, // 3rd - 3rd
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // Amaj7-shape Barre (moveable) - root on 5th string
  {
    name: 'Amaj7-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 2, finger: 3 }, // 4th - 5th
      { fret: 1, finger: 2 }, // 3rd - 7th
      { fret: 2, finger: 4 }, // 2nd - 3rd
      { fret: 0, finger: 1 }, // 1st - 5th
    ],
  },
  // Dmaj7-shape Barre (moveable) - root on 4th string
  {
    name: 'Dmaj7-shape Barre',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 2 }, // 3rd - 5th
      { fret: 2, finger: 3 }, // 2nd - 7th
      { fret: 2, finger: 4 }, // 1st - 3rd
    ],
  },
];

// ============================================
// SUSPENDED CHORD SHAPES
// ============================================

const SUS4_SHAPES: ChordShape[] = [
  // Asus4 Open
  {
    name: 'Asus4 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 1 }, // 4th - E
      { fret: 2, finger: 2 }, // 3rd - A
      { fret: 3, finger: 3 }, // 2nd - D (4th)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Dsus4 Open
  {
    name: 'Dsus4 Open',
    shortName: 'D shape',
    type: 'open',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 0 }, // 4th - D (root)
      { fret: 2, finger: 1 }, // 3rd - A
      { fret: 3, finger: 3 }, // 2nd - D
      { fret: 3, finger: 4 }, // 1st - G (4th)
    ],
  },
  // Esus4 Open
  {
    name: 'Esus4 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 2, finger: 3 }, // 4th - E
      { fret: 2, finger: 4 }, // 3rd - A (4th)
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E-shape Barre sus4 (moveable)
  {
    name: 'E-shape Barre sus4',
    shortName: 'E barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th
      { fret: 2, finger: 4 }, // 4th
      { fret: 2, finger: 4 }, // 3rd - 4th
      { fret: 0, finger: 'bar' }, // 2nd
      { fret: 0, finger: 'bar' }, // 1st
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A-shape Barre sus4 (moveable)
  {
    name: 'A-shape Barre sus4',
    shortName: 'A barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 2, finger: 3 }, // 3rd - root octave
      { fret: 3, finger: 4 }, // 2nd - 4th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
];

const SUS2_SHAPES: ChordShape[] = [
  // Asus2 Open
  {
    name: 'Asus2 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 1 }, // 4th - E
      { fret: 2, finger: 2 }, // 3rd - A
      { fret: 0, finger: 0 }, // 2nd - B (2nd)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Dsus2 Open
  {
    name: 'Dsus2 Open',
    shortName: 'D shape',
    type: 'open',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 0 }, // 4th - D (root)
      { fret: 2, finger: 1 }, // 3rd - A
      { fret: 3, finger: 3 }, // 2nd - D
      { fret: 0, finger: 0 }, // 1st - E (2nd)
    ],
  },
  // Esus2 Open
  {
    name: 'Esus2 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 1 }, // 5th - B
      { fret: 4, finger: 3 }, // 4th - F# (2nd)
      { fret: 4, finger: 4 }, // 3rd - B
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E-shape Barre sus2 (moveable)
  {
    name: 'E-shape Barre sus2',
    shortName: 'E barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th - 5th
      { fret: 4, finger: 4 }, // 4th - 2nd
      { fret: 4, finger: 4 }, // 3rd - 5th
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A-shape Barre sus2 (moveable)
  {
    name: 'A-shape Barre sus2',
    shortName: 'A barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 2, finger: 3 }, // 3rd - root
      { fret: 0, finger: 'bar' }, // 2nd - 2nd
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
];

// ============================================
// DIMINISHED CHORD SHAPES
// ============================================

const DIMINISHED_SHAPES: ChordShape[] = [
  // Dim A-shape barre (root on 5th string) - most common
  {
    name: 'Dim A-shape',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 1, finger: 2 }, // 4th - b5
      { fret: 2, finger: 3 }, // 3rd - root octave
      { fret: 1, finger: 2 }, // 2nd - b3
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // Dim E-shape barre (root on 6th string)
  {
    name: 'Dim E-shape',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 1, finger: 2 }, // 5th - b5
      { fret: 2, finger: 3 }, // 4th - root octave
      { fret: 0, finger: 1 }, // 3rd - b3
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // Dim D-shape (root on 4th string) - higher voicing
  {
    name: 'Dim D-shape',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 3 }, // 3rd - b5
      { fret: 2, finger: 3 }, // 2nd - root octave
      { fret: 1, finger: 2 }, // 1st - b3
    ],
  },
];

// ============================================
// AUGMENTED CHORD SHAPES
// ============================================

const AUGMENTED_SHAPES: ChordShape[] = [
  // Aug E-shape barre (root on 6th string)
  {
    name: 'Aug E-shape',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 3, finger: 4 }, // 5th - #5
      { fret: 2, finger: 3 }, // 4th - root octave
      { fret: 1, finger: 2 }, // 3rd - 3
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // Aug A-shape barre (root on 5th string)
  {
    name: 'Aug A-shape',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 3, finger: 4 }, // 4th - #5
      { fret: 2, finger: 3 }, // 3rd - 3
      { fret: 2, finger: 3 }, // 2nd - root octave
      { fret: 1, finger: 2 }, // 1st - #5 octave
    ],
  },
  // Aug symmetrical shape (augmented triads are symmetrical - repeat every 4 frets)
  {
    name: 'Aug D-shape',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 3, finger: 4 }, // 3rd - #5
      { fret: 3, finger: 4 }, // 2nd - 3
      { fret: 2, finger: 3 }, // 1st - root octave
    ],
  },
];

// ============================================
// HALF-DIMINISHED (m7b5) CHORD SHAPES
// ============================================

const HALF_DIMINISHED_SHAPES: ChordShape[] = [
  // m7b5 E-shape barre (root on 6th string)
  {
    name: 'm7b5 E-shape',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 1, finger: 2 }, // 5th - b5
      { fret: 0, finger: 1 }, // 4th - b7
      { fret: 0, finger: 1 }, // 3rd - b3
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // m7b5 A-shape barre (root on 5th string)
  {
    name: 'm7b5 A-shape',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 1, finger: 2 }, // 4th - b5
      { fret: 0, finger: 1 }, // 3rd - b7
      { fret: 1, finger: 3 }, // 2nd - b3
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // m7b5 D-shape (root on 4th string) - jazz voicing
  {
    name: 'm7b5 D-shape',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 3, finger: 4 }, // 3rd - b5
      { fret: 2, finger: 3 }, // 2nd - b7
      { fret: 1, finger: 2 }, // 1st - b3
    ],
  },
];

// ============================================
// DIMINISHED 7TH CHORD SHAPES
// ============================================

const DIMINISHED7_SHAPES: ChordShape[] = [
  // Dim7 E-shape barre (root on 6th string)
  {
    name: 'Dim7 E-shape',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 1, finger: 2 }, // 5th - b5
      { fret: 2, finger: 3 }, // 4th - bb7
      { fret: 0, finger: 1 }, // 3rd - b3
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // Dim7 A-shape barre (root on 5th string) - most common
  {
    name: 'Dim7 A-shape',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 1, finger: 2 }, // 4th - b5
      { fret: 2, finger: 3 }, // 3rd - bb7
      { fret: 1, finger: 2 }, // 2nd - b3
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // Dim7 D-shape (root on 4th string) - compact voicing
  {
    name: 'Dim7 D-shape',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 1, finger: 2 }, // 3rd - b5
      { fret: 0, finger: 1 }, // 2nd - bb7
      { fret: 1, finger: 2 }, // 1st - b3
    ],
  },
];

// ============================================
// 6TH CHORD SHAPES
// ============================================

const SIXTH_SHAPES: ChordShape[] = [
  // C6 Open
  {
    name: 'C6 Open',
    shortName: 'C shape',
    type: 'open',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 3 }, // 5th - C (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 2, finger: 2 }, // 3rd - A (6th)
      { fret: 1, finger: 1 }, // 2nd - C
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // A6 Open
  {
    name: 'A6 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 1 }, // 4th - E
      { fret: 2, finger: 1 }, // 3rd - A
      { fret: 2, finger: 1 }, // 2nd - C#
      { fret: 2, finger: 2 }, // 1st - F# (6th)
    ],
  },
  // G6 Open
  {
    name: 'G6 Open',
    shortName: 'G shape',
    type: 'open',
    cagedShape: 'G',
    rootString: 6,
    rootFretOffset: 3,
    strings: [
      { fret: 3, finger: 2 }, // 6th - G (root)
      { fret: 2, finger: 1 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E (6th)
    ],
  },
  // E6-shape Barre (moveable) - root on 6th string
  {
    name: 'E6-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 2, finger: 3 }, // 4th - root (ring barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: 2, finger: 4 }, // 2nd - 6th (pinky)
      { fret: 0, finger: 'bar' }, // 1st - root (index barre)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A6-shape Barre (moveable) - root on 5th string
  {
    name: 'A6-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 1 }, // 4th - 5th
      { fret: 2, finger: 1 }, // 3rd - root
      { fret: 2, finger: 1 }, // 2nd - 3rd
      { fret: 2, finger: 2 }, // 1st - 6th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // D6-shape Barre (moveable) - root on 4th string
  {
    name: 'D6-shape Barre',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 2 }, // 3rd - 5th
      { fret: 2, finger: 3 }, // 2nd - root
      { fret: 2, finger: 4 }, // 1st - 3rd (or 6th variation)
    ],
  },
];

// ============================================
// MINOR 6TH CHORD SHAPES
// ============================================

const MINOR6_SHAPES: ChordShape[] = [
  // Am6 Open
  {
    name: 'Am6 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 2, finger: 3 }, // 3rd - A
      { fret: 1, finger: 1 }, // 2nd - C (b3)
      { fret: 2, finger: 4 }, // 1st - F# (6th)
    ],
  },
  // Em6 Open
  {
    name: 'Em6 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 2, finger: 3 }, // 4th - E
      { fret: 0, finger: 0 }, // 3rd - G (b3)
      { fret: 2, finger: 4 }, // 2nd - C# (6th)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Em6-shape Barre (moveable) - root on 6th string
  {
    name: 'Em6-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th - 5th
      { fret: 2, finger: 4 }, // 4th - root
      { fret: 0, finger: 'bar' }, // 3rd - b3
      { fret: 2, finger: 4 }, // 2nd - 6th
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // Am6-shape Barre (moveable) - root on 5th string
  {
    name: 'Am6-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root (index)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 2, finger: 3 }, // 3rd - root (ring barre)
      { fret: 1, finger: 2 }, // 2nd - b3 (middle)
      { fret: 2, finger: 4 }, // 1st - 6th (pinky)
    ],
  },
  // Dm6-shape Barre (moveable) - root on 4th string
  {
    name: 'Dm6-shape Barre',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 3 }, // 3rd - 5th
      { fret: 1, finger: 2 }, // 2nd - b3
      { fret: 2, finger: 4 }, // 1st - 6th
    ],
  },
];

// ============================================
// ADD9 CHORD SHAPES
// ============================================

const ADD9_SHAPES: ChordShape[] = [
  // Cadd9 Open
  {
    name: 'Cadd9 Open',
    shortName: 'C shape',
    type: 'open',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 2 }, // 5th - C (root)
      { fret: 2, finger: 1 }, // 4th - E
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 3, finger: 3 }, // 2nd - D (9th)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Gadd9 Open
  {
    name: 'Gadd9 Open',
    shortName: 'G shape',
    type: 'open',
    cagedShape: 'G',
    rootString: 6,
    rootFretOffset: 3,
    strings: [
      { fret: 3, finger: 2 }, // 6th - G (root)
      { fret: 2, finger: 1 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 3, finger: 4 }, // 1st - A (9th)
    ],
  },
  // Dadd9 Open
  {
    name: 'Dadd9 Open',
    shortName: 'D shape',
    type: 'open',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 0 }, // 4th - D (root)
      { fret: 2, finger: 1 }, // 3rd - A
      { fret: 3, finger: 3 }, // 2nd - D
      { fret: 0, finger: 0 }, // 1st - E (9th)
    ],
  },
  // Aadd9 Open
  {
    name: 'Aadd9 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 1 }, // 4th - E
      { fret: 2, finger: 1 }, // 3rd - A
      { fret: 0, finger: 0 }, // 2nd - B (9th)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // Eadd9-shape Barre (moveable) - root on 6th string
  {
    name: 'Eadd9-shape Barre',
    shortName: 'E add9 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 2, finger: 3 }, // 4th - root (ring barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: 0, finger: 'bar' }, // 2nd - 5th (index barre)
      { fret: 2, finger: 4 }, // 1st - 9th (pinky)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 2 },
  },
  // Aadd9-shape Barre (moveable) - root on 5th string
  {
    name: 'Aadd9-shape Barre',
    shortName: 'A add9 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 2, finger: 3 }, // 3rd - root
      { fret: 0, finger: 'bar' }, // 2nd - 9th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // Dadd9-shape Barre (moveable) - root on 4th string
  {
    name: 'Dadd9-shape Barre',
    shortName: 'D add9 barre',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 2 }, // 3rd - 5th
      { fret: 3, finger: 4 }, // 2nd - root
      { fret: 0, finger: 1 }, // 1st - 9th
    ],
  },
];

// ============================================
// 9TH CHORD SHAPES (with 7th)
// ============================================

const NINTH_SHAPES: ChordShape[] = [
  // A9 Open
  {
    name: 'A9 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E
      { fret: 0, finger: 0 }, // 3rd - G (b7)
      { fret: 0, finger: 0 }, // 2nd - B (9th)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E9 Open
  {
    name: 'E9 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D (b7)
      { fret: 1, finger: 1 }, // 3rd - G#
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 2, finger: 3 }, // 1st - F# (9th)
    ],
  },
  // E9-shape Barre (moveable) - root on 6th string
  {
    name: 'E9-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 0, finger: 'bar' }, // 4th - b7 (index barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: 0, finger: 'bar' }, // 2nd - 5th (index barre)
      { fret: 2, finger: 4 }, // 1st - 9th (pinky)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 2 },
  },
  // A9-shape Barre (moveable) - root on 5th string
  {
    name: 'A9-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 0, finger: 'bar' }, // 3rd - b7
      { fret: 0, finger: 'bar' }, // 2nd - 9th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // D9-shape (moveable) - root on 4th string - compact jazz voicing
  {
    name: 'D9-shape Barre',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 2, finger: 3 }, // 3rd - 5th
      { fret: 1, finger: 2 }, // 2nd - b7
      { fret: 2, finger: 4 }, // 1st - 3rd
    ],
  },
];

// ============================================
// POWER CHORD SHAPES
// ============================================

const POWER_SHAPES: ChordShape[] = [
  // E5 Open Power Chord
  {
    name: 'E5 Open Power',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 1 }, // 5th - B (5th)
      { fret: 2, finger: 2 }, // 4th - E (octave)
      { fret: null, finger: 0 }, // 3rd - muted
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // A5 Open Power Chord
  {
    name: 'A5 Open Power',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 1 }, // 4th - E (5th)
      { fret: 2, finger: 2 }, // 3rd - A (octave)
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // E5-shape Barre (moveable) - root on 6th string
  {
    name: 'E5-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 2, finger: 3 }, // 5th - 5th
      { fret: 2, finger: 4 }, // 4th - octave
      { fret: null, finger: 0 }, // 3rd - muted
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // A5-shape Barre (moveable) - root on 5th string
  {
    name: 'A5-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 2, finger: 3 }, // 4th - 5th
      { fret: 2, finger: 4 }, // 3rd - octave
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
];

// ============================================
// AUGMENTED 7 SHAPES (7#5)
// ============================================

const AUGMENTED7_SHAPES: ChordShape[] = [
  // E7#5-shape Barre - root on 6th string
  {
    name: 'E7#5-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 1, finger: 2 }, // 4th - b7 (middle barre across 4th-2nd)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle barre)
      { fret: 1, finger: 2 }, // 2nd - #5 (middle barre)
      { fret: null, finger: 0 }, // 1st - muted
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 6 },
  },
  // A7#5-shape Barre - root on 5th string
  {
    name: 'A7#5-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 3, finger: 4 }, // 4th - #5
      { fret: 1, finger: 2 }, // 3rd - 3rd
      { fret: 2, finger: 3 }, // 2nd - b7
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
];

// ============================================
// MINOR MAJOR 7 SHAPES (mMaj7)
// ============================================

const MINOR_MAJOR7_SHAPES: ChordShape[] = [
  // AmMaj7 Open
  {
    name: 'AmMaj7 Open',
    shortName: 'Am(M7) shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E (5th)
      { fret: 1, finger: 1 }, // 3rd - G# (M7)
      { fret: 1, finger: 1 }, // 2nd - C (b3)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // EmMaj7 Open
  {
    name: 'EmMaj7 Open',
    shortName: 'Em(M7) shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B (5th)
      { fret: 1, finger: 1 }, // 4th - D# (M7)
      { fret: 0, finger: 0 }, // 3rd - G (b3)
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E-shape mMaj7 Barre - root on 6th string
  {
    name: 'E-shape mMaj7 Barre',
    shortName: 'Em(M7) barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th - 5th
      { fret: 1, finger: 2 }, // 4th - M7
      { fret: 0, finger: 'bar' }, // 3rd - b3
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A-shape mMaj7 Barre - root on 5th string
  {
    name: 'A-shape mMaj7 Barre',
    shortName: 'Am(M7) barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 3 }, // 4th - 5th
      { fret: 1, finger: 2 }, // 3rd - M7
      { fret: 1, finger: 2 }, // 2nd - b3
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
];

// ============================================
// DOMINANT 7 SUS4 SHAPES (7sus4)
// ============================================

const DOMINANT7SUS4_SHAPES: ChordShape[] = [
  // A7sus4 Open
  {
    name: 'A7sus4 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 1 }, // 4th - E (5th)
      { fret: 0, finger: 0 }, // 3rd - G (b7)
      { fret: 3, finger: 3 }, // 2nd - D (4th)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E7sus4 Open
  {
    name: 'E7sus4 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B (5th)
      { fret: 0, finger: 0 }, // 4th - D (b7)
      { fret: 2, finger: 3 }, // 3rd - A (4th)
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // E-shape 7sus4 Barre - root on 6th string
  {
    name: 'E-shape 7sus4 Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th - 5th
      { fret: 0, finger: 'bar' }, // 4th - b7
      { fret: 2, finger: 4 }, // 3rd - 4th
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
  // A-shape 7sus4 Barre - root on 5th string
  {
    name: 'A-shape 7sus4 Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 0, finger: 'bar' }, // 3rd - b7
      { fret: 3, finger: 4 }, // 2nd - 4th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
];

// ============================================
// MAJOR 9 SHAPES (Maj9)
// ============================================

const MAJOR9_SHAPES: ChordShape[] = [
  // CMaj9 Open
  {
    name: 'CMaj9 Open',
    shortName: 'CMaj9 shape',
    type: 'open',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 2 }, // 5th - C (root)
      { fret: 2, finger: 1 }, // 4th - E (3rd)
      { fret: 4, finger: 4 }, // 3rd - B (M7)
      { fret: 3, finger: 3 }, // 2nd - D (9th)
      { fret: 0, finger: 0 }, // 1st - E
    ],
  },
  // A-shape Maj9 Barre - root on 5th string
  {
    name: 'A-shape Maj9 Barre',
    shortName: 'AMaj9 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root (index barre)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 1, finger: 2 }, // 3rd - M7 (middle)
      { fret: 0, finger: 'bar' }, // 2nd - 9th (index barre)
      { fret: 0, finger: 'bar' }, // 1st - 5th (index barre)
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // E-shape Maj9 Barre - root on 6th string
  {
    name: 'E-shape Maj9 Barre',
    shortName: 'EMaj9 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 1, finger: 2 }, // 4th - M7 (middle barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle barre)
      { fret: 0, finger: 'bar' }, // 2nd - 5th (index barre)
      { fret: 2, finger: 4 }, // 1st - 9th (pinky)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 2 },
  },
];

// ============================================
// MINOR 9 SHAPES (m9)
// ============================================

const MINOR9_SHAPES: ChordShape[] = [
  // Am9 Open
  {
    name: 'Am9 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E (5th)
      { fret: 0, finger: 0 }, // 3rd - G (b7)
      { fret: 0, finger: 0 }, // 2nd - B (9th)
      { fret: 0, finger: 0 }, // 1st - E (5th)
    ],
  },
  // Em9 Open
  {
    name: 'Em9 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 2 }, // 5th - B (5th)
      { fret: 0, finger: 0 }, // 4th - D (b7)
      { fret: 0, finger: 0 }, // 3rd - G (b3)
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 2, finger: 3 }, // 1st - F# (9th)
    ],
  },
  // A-shape m9 Barre - root on 5th string
  {
    name: 'A-shape m9 Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 0, finger: 'bar' }, // 3rd - b7
      { fret: 0, finger: 'bar' }, // 2nd - 9th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // E-shape m9 Barre - root on 6th string
  {
    name: 'E-shape m9 Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 5th
      { fret: 0, finger: 'bar' }, // 4th - b7
      { fret: 0, finger: 'bar' }, // 3rd - b3
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 2, finger: 3 }, // 1st - 9th
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 2 },
  },
];

// ============================================
// DOMINANT 7 FLAT 9 SHAPES (7b9)
// ============================================

const DOMINANT7FLAT9_SHAPES: ChordShape[] = [
  // E7b9-shape Barre - root on 6th string
  {
    name: 'E7b9-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 0, finger: 'bar' }, // 4th - b7 (index barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle barre)
      { fret: 1, finger: 2 }, // 2nd - b9 (middle barre)
      { fret: null, finger: 0 }, // 1st - muted
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 4 },
  },
  // A7b9-shape Barre - root on 5th string
  {
    name: 'A7b9-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root (index)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: 2, finger: 4 }, // 2nd - b7 (pinky)
      { fret: 1, finger: 2 }, // 1st - b9 (middle stretches)
    ],
  },
  // Compact 7b9 voicing - root on 4th string
  {
    name: 'D7b9-shape Barre',
    shortName: 'D shape',
    type: 'barre',
    cagedShape: 'D',
    rootString: 4,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: null, finger: 0 }, // 5th - muted
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 1, finger: 2 }, // 3rd - 3rd
      { fret: 1, finger: 2 }, // 2nd - b7
      { fret: 1, finger: 2 }, // 1st - b9
    ],
  },
];

// ============================================
// DOMINANT 7 SHARP 9 SHAPES (7#9) - "Hendrix chord"
// ============================================

const DOMINANT7SHARP9_SHAPES: ChordShape[] = [
  // E7#9-shape Barre - root on 6th string (Hendrix chord)
  {
    name: 'E7#9-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (barre with index)
      { fret: 2, finger: 3 }, // 5th - 5th (ring finger)
      { fret: 0, finger: 'bar' }, // 4th - b7 (barre with index)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle finger)
      { fret: 3, finger: 4 }, // 2nd - #9 (pinky)
      { fret: null, finger: 0 }, // 1st - muted
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 4 },
  },
  // A7#9-shape Barre - root on 5th string
  {
    name: 'A7#9-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root (index)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: 2, finger: 3 }, // 2nd - b7 (ring barring 4th & 2nd)
      { fret: 3, finger: 4 }, // 1st - #9 (pinky)
    ],
  },
];

// ============================================
// DOMINANT 7 FLAT 5 SHAPES (7b5)
// ============================================

const DOMINANT7FLAT5_SHAPES: ChordShape[] = [
  // A7b5-shape Barre - root on 5th string
  {
    name: 'A7b5-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 1, finger: 2 }, // 4th - b5
      { fret: 1, finger: 2 }, // 3rd - 3rd
      { fret: 2, finger: 3 }, // 2nd - b7
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // E7b5-shape Barre - root on 6th string
  {
    name: 'E7b5-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 1, finger: 2 }, // 5th - b5
      { fret: 0, finger: 1 }, // 4th - b7
      { fret: 1, finger: 3 }, // 3rd - 3rd
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
];

// ============================================
// DOMINANT 7 SHARP 5 SHAPES (7#5)
// ============================================

const DOMINANT7SHARP5_SHAPES: ChordShape[] = [
  // E7#5-shape Barre - root on 6th string
  {
    name: 'E7#5-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 3, finger: 4 }, // 5th - #5 (pinky)
      { fret: 0, finger: 'bar' }, // 4th - b7 (index barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 4 },
  },
  // A7#5-shape Barre - root on 5th string
  {
    name: 'A7#5-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 3, finger: 4 }, // 4th - #5
      { fret: 1, finger: 2 }, // 3rd - 3rd
      { fret: 2, finger: 3 }, // 2nd - b7
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
];

// ============================================
// DOMINANT 7 ALT SHAPES (7alt - b5, #5, b9, #9)
// ============================================

const DOMINANT7ALT_SHAPES: ChordShape[] = [
  // E7alt-shape Barre - root on 6th string (b5, b9 voicing)
  {
    name: 'E7alt-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 1, finger: 2 }, // 5th - b5
      { fret: 0, finger: 1 }, // 4th - b7
      { fret: 1, finger: 3 }, // 3rd - 3rd
      { fret: 1, finger: 4 }, // 2nd - b9
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // A7alt-shape Barre - root on 5th string (#5, #9 voicing)
  {
    name: 'A7alt-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 1, finger: 2 }, // 4th - b5
      { fret: 1, finger: 2 }, // 3rd - 3rd
      { fret: 2, finger: 3 }, // 2nd - b7
      { fret: 3, finger: 4 }, // 1st - #9
    ],
  },
];

// ============================================
// DOMINANT 11 SHAPES (11)
// ============================================

const DOMINANT11_SHAPES: ChordShape[] = [
  // A11-shape Barre - root on 5th string
  {
    name: 'A11-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 0, finger: 'bar' }, // 4th - 5th
      { fret: 0, finger: 'bar' }, // 3rd - b7
      { fret: 0, finger: 'bar' }, // 2nd - 9th
      { fret: 0, finger: 'bar' }, // 1st - 11th (4th)
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // E11-shape Barre - root on 6th string
  {
    name: 'E11-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 5th
      { fret: 0, finger: 'bar' }, // 4th - b7
      { fret: 2, finger: 3 }, // 3rd - 11th (4th)
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// MAJOR 11 SHAPES (Maj11)
// ============================================

const MAJOR11_SHAPES: ChordShape[] = [
  // AMaj11-shape Barre - root on 5th string
  {
    name: 'A-shape Maj11 Barre',
    shortName: 'AMaj11 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root (index barre)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 1, finger: 2 }, // 3rd - M7 (middle)
      { fret: 0, finger: 'bar' }, // 2nd - 9th (index barre)
      { fret: 0, finger: 'bar' }, // 1st - 11th (4th) (index barre)
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // EMaj11-shape Barre - root on 6th string
  {
    name: 'E-shape Maj11 Barre',
    shortName: 'EMaj11 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 1, finger: 2 }, // 4th - M7 (middle)
      { fret: 2, finger: 4 }, // 3rd - 11th (4th) (pinky)
      { fret: 0, finger: 'bar' }, // 2nd - 5th (index barre)
      { fret: 0, finger: 'bar' }, // 1st - root (index barre)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// MINOR 11 SHAPES (m11)
// ============================================

const MINOR11_SHAPES: ChordShape[] = [
  // Am11 Open
  {
    name: 'Am11 Open',
    shortName: 'A shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 0, finger: 0 }, // 4th - D (11th)
      { fret: 0, finger: 0 }, // 3rd - G (b7)
      { fret: 0, finger: 0 }, // 2nd - B (9th)
      { fret: 0, finger: 0 }, // 1st - E (5th)
    ],
  },
  // Am11-shape Barre - root on 5th string
  {
    name: 'A-shape m11 Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 0, finger: 'bar' }, // 4th - 11th (4th)
      { fret: 0, finger: 'bar' }, // 3rd - b7
      { fret: 0, finger: 'bar' }, // 2nd - 9th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // Em11-shape Barre - root on 6th string
  {
    name: 'E-shape m11 Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 5th
      { fret: 0, finger: 'bar' }, // 4th - b7
      { fret: 2, finger: 3 }, // 3rd - 11th (4th)
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// DOMINANT 9 SHARP 11 SHAPES (9#11)
// ============================================

const DOMINANT9SHARP11_SHAPES: ChordShape[] = [
  // A9#11-shape Barre - root on 5th string
  {
    name: 'A9#11-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 1, finger: 2 }, // 4th - #11
      { fret: 0, finger: 1 }, // 3rd - b7
      { fret: 0, finger: 1 }, // 2nd - 9th
      { fret: 1, finger: 3 }, // 1st - 3rd
    ],
  },
  // E9#11-shape Barre - root on 6th string
  {
    name: 'E9#11-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 0, finger: 'bar' }, // 4th - b7 (index barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle barre)
      { fret: 1, finger: 2 }, // 2nd - #11 (middle barre)
      { fret: 2, finger: 4 }, // 1st - 9th (pinky)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 4 },
  },
];

// ============================================
// DOMINANT 13 SHAPES (13)
// ============================================

const DOMINANT13_SHAPES: ChordShape[] = [
  // A13-shape Barre - root on 5th string
  {
    name: 'A13-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root (index barre)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 0, finger: 'bar' }, // 3rd - b7 (index barre)
      { fret: 2, finger: 3 }, // 2nd - 9th
      { fret: 2, finger: 4 }, // 1st - 13th (6th)
    ],
  },
  // E13-shape Barre - root on 6th string
  {
    name: 'E13-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 0, finger: 'bar' }, // 4th - b7 (index barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: 2, finger: 4 }, // 2nd - 13th (6th) (pinky)
      { fret: 0, finger: 'bar' }, // 1st - root (index barre)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// MAJOR 13 SHAPES (Maj13)
// ============================================

const MAJOR13_SHAPES: ChordShape[] = [
  // AMaj13-shape Barre - root on 5th string
  {
    name: 'A-shape Maj13 Barre',
    shortName: 'AMaj13 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root (index)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 1, finger: 2 }, // 3rd - M7 (middle)
      { fret: 2, finger: 3 }, // 2nd - 9th (ring barre)
      { fret: 2, finger: 4 }, // 1st - 13th (6th) (pinky)
    ],
  },
  // EMaj13-shape Barre - root on 6th string
  {
    name: 'E-shape Maj13 Barre',
    shortName: 'EMaj13 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 1, finger: 2 }, // 4th - M7 (middle barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle barre)
      { fret: 2, finger: 4 }, // 2nd - 13th (6th) (pinky)
      { fret: 0, finger: 'bar' }, // 1st - root (index barre)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// MINOR 13 SHAPES (m13)
// ============================================

const MINOR13_SHAPES: ChordShape[] = [
  // Am13-shape Barre - root on 5th string
  {
    name: 'A-shape m13 Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 0, finger: 1 }, // 3rd - b7
      { fret: 2, finger: 3 }, // 2nd - 9th
      { fret: 2, finger: 4 }, // 1st - 13th (6th)
    ],
  },
  // Em13-shape Barre - root on 6th string
  {
    name: 'E-shape m13 Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 5th
      { fret: 0, finger: 'bar' }, // 4th - b7
      { fret: 0, finger: 'bar' }, // 3rd - b3
      { fret: 2, finger: 3 }, // 2nd - 13th (6th)
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// DOMINANT 13 FLAT 9 SHAPES (13b9)
// ============================================

const DOMINANT13FLAT9_SHAPES: ChordShape[] = [
  // A13b9-shape Barre - root on 5th string
  {
    name: 'A13b9-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root (index barre)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 0, finger: 'bar' }, // 3rd - b7 (index barre)
      { fret: 1, finger: 2 }, // 2nd - b9 (middle)
      { fret: 2, finger: 4 }, // 1st - 13th (6th) (pinky)
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 3 },
  },
  // E13b9-shape Barre - root on 6th string
  {
    name: 'E13b9-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 0, finger: 'bar' }, // 4th - b7 (index barre)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: 2, finger: 4 }, // 2nd - 13th (6th) (pinky)
      { fret: 1, finger: 2 }, // 1st - b9 (middle stretches)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 4 },
  },
];

// ============================================
// ADD 11 SHAPES (add11)
// ============================================

const ADD11_SHAPES: ChordShape[] = [
  // Cadd11 Open
  {
    name: 'Cadd11 Open',
    shortName: 'C shape',
    type: 'open',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 3 }, // 5th - C (root)
      { fret: 2, finger: 2 }, // 4th - E (3rd)
      { fret: 0, finger: 0 }, // 3rd - G (5th)
      { fret: 1, finger: 1 }, // 2nd - C
      { fret: 3, finger: 4 }, // 1st - F (11th)
    ],
  },
  // A-shape add11 Barre - root on 5th string
  {
    name: 'A-shape add11 Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 2, finger: 3 }, // 3rd - 3rd
      { fret: 0, finger: 'bar' }, // 2nd - 11th (4th)
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // E-shape add11 Barre - root on 6th string
  {
    name: 'E-shape add11 Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 5th
      { fret: 2, finger: 3 }, // 4th - root
      { fret: 2, finger: 4 }, // 3rd - 11th (4th)
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 0, finger: 'bar' }, // 1st - root
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// SIX NINE SHAPES (6/9)
// ============================================

const SIXNINE_SHAPES: ChordShape[] = [
  // C6/9 Open
  {
    name: 'C6/9 Open',
    shortName: 'C6/9 shape',
    type: 'open',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 2 }, // 5th - C (root)
      { fret: 2, finger: 1 }, // 4th - E (3rd)
      { fret: 2, finger: 1 }, // 3rd - A (6th)
      { fret: 3, finger: 3 }, // 2nd - D (9th)
      { fret: 0, finger: 0 }, // 1st - E (3rd)
    ],
  },
  // A-shape 6/9 Barre - root on 5th string
  {
    name: 'A-shape 6/9 Barre',
    shortName: 'A6/9 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root (index)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 1, finger: 2 }, // 3rd - 3rd (middle)
      { fret: 2, finger: 3 }, // 2nd - 6th (ring barre)
      { fret: 2, finger: 4 }, // 1st - 9th (pinky)
    ],
  },
  // E-shape 6/9 Barre - root on 6th string
  {
    name: 'E-shape 6/9 Barre',
    shortName: 'E6/9 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 1, finger: 2 }, // 4th - 3rd (middle barre)
      { fret: 1, finger: 2 }, // 3rd - 6th (middle barre)
      { fret: 2, finger: 4 }, // 2nd - 9th (pinky)
      { fret: 0, finger: 'bar' }, // 1st - root (index barre)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// MINOR SIX NINE SHAPES (m6/9)
// ============================================

const MINORSIXNINE_SHAPES: ChordShape[] = [
  // Am6/9 Open
  {
    name: 'Am6/9 Open',
    shortName: 'Am6/9 shape',
    type: 'open',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 0 }, // 5th - A (root)
      { fret: 2, finger: 2 }, // 4th - E (5th)
      { fret: 2, finger: 2 }, // 3rd - F# (6th)
      { fret: 0, finger: 0 }, // 2nd - B (9th)
      { fret: 0, finger: 0 }, // 1st - E (5th)
    ],
  },
  // A-shape m6/9 Barre - root on 5th string
  {
    name: 'A-shape m6/9 Barre',
    shortName: 'Am6/9 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 2, finger: 3 }, // 3rd - 6th
      { fret: 0, finger: 'bar' }, // 2nd - 9th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // E-shape m6/9 Barre - root on 6th string
  {
    name: 'E-shape m6/9 Barre',
    shortName: 'Em6/9 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root (index barre)
      { fret: 2, finger: 3 }, // 5th - 5th (ring)
      { fret: 1, finger: 2 }, // 4th - 6th (middle)
      { fret: 0, finger: 'bar' }, // 3rd - b3 (index barre)
      { fret: 2, finger: 4 }, // 2nd - 9th (pinky)
      { fret: 0, finger: 'bar' }, // 1st - root (index barre)
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 1 },
  },
];

// ============================================
// DOMINANT 9 SUS4 SHAPES (9sus4)
// ============================================

const DOMINANT9SUS4_SHAPES: ChordShape[] = [
  // A9sus4-shape Barre - root on 5th string
  {
    name: 'A9sus4-shape Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 0, finger: 'bar' }, // 3rd - b7
      { fret: 0, finger: 'bar' }, // 2nd - 9th
      { fret: 3, finger: 4 }, // 1st - 4th (sus)
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 2 },
  },
  // E9sus4-shape Barre - root on 6th string
  {
    name: 'E9sus4-shape Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 5th
      { fret: 0, finger: 'bar' }, // 4th - b7
      { fret: 2, finger: 3 }, // 3rd - 4th (sus)
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 2, finger: 4 }, // 1st - 9th
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 2 },
  },
];

// ============================================
// SUS2 SUS4 SHAPES (sus2sus4 / add9add11)
// ============================================

const SUS2SUS4_SHAPES: ChordShape[] = [
  // Esus2sus4 Open
  {
    name: 'Esus2sus4 Open',
    shortName: 'E shape',
    type: 'open',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 0 }, // 6th - E (root)
      { fret: 2, finger: 1 }, // 5th - B (5th)
      { fret: 2, finger: 2 }, // 4th - E (root)
      { fret: 2, finger: 3 }, // 3rd - A (4th)
      { fret: 0, finger: 0 }, // 2nd - B (5th)
      { fret: 2, finger: 4 }, // 1st - F# (2nd)
    ],
  },
  // E-shape sus2sus4 Barre - root on 6th string
  {
    name: 'E-shape sus2sus4 Barre',
    shortName: 'E shape',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 5th
      { fret: 2, finger: 3 }, // 4th - root
      { fret: 2, finger: 4 }, // 3rd - 4th
      { fret: 0, finger: 'bar' }, // 2nd - 5th
      { fret: 2, finger: 4 }, // 1st - 2nd
    ],
    barreInfo: { fret: 0, fromString: 6, toString: 2 },
  },
  // A-shape sus2sus4 Barre - root on 5th string
  {
    name: 'A-shape sus2sus4 Barre',
    shortName: 'A shape',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 'bar' }, // 5th - root
      { fret: 2, finger: 2 }, // 4th - 5th
      { fret: 2, finger: 3 }, // 3rd - 2nd
      { fret: 0, finger: 'bar' }, // 2nd - 4th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
];

// ============================================
// AUGMENTED MAJOR 7 SHAPES (Maj7#5)
// ============================================

const AUGMENTED_MAJOR7_SHAPES: ChordShape[] = [
  // AMaj7#5-shape Barre - root on 5th string
  {
    name: 'A-shape Maj7#5 Barre',
    shortName: 'AMaj7#5 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 3, finger: 4 }, // 4th - #5
      { fret: 1, finger: 2 }, // 3rd - M7
      { fret: 1, finger: 2 }, // 2nd - 3rd
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // EMaj7#5-shape Barre - root on 6th string
  {
    name: 'E-shape Maj7#5 Barre',
    shortName: 'EMaj7#5 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 3, finger: 4 }, // 5th - #5
      { fret: 1, finger: 2 }, // 4th - M7
      { fret: 1, finger: 2 }, // 3rd - 3rd
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
];

// ============================================
// MAJOR 7 FLAT 5 SHAPES (Maj7b5)
// ============================================

const MAJOR7FLAT5_SHAPES: ChordShape[] = [
  // AMaj7b5-shape Barre - root on 5th string
  {
    name: 'A-shape Maj7b5 Barre',
    shortName: 'AMaj7b5 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 1, finger: 2 }, // 4th - b5
      { fret: 1, finger: 2 }, // 3rd - M7
      { fret: 1, finger: 2 }, // 2nd - 3rd
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // EMaj7b5-shape Barre - root on 6th string
  {
    name: 'E-shape Maj7b5 Barre',
    shortName: 'EMaj7b5 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 1, finger: 2 }, // 5th - b5
      { fret: 1, finger: 2 }, // 4th - M7
      { fret: 1, finger: 2 }, // 3rd - 3rd
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
];

// ============================================
// DIMINISHED MAJOR 7 SHAPES (dimMaj7)
// ============================================

const DIMINISHED_MAJOR7_SHAPES: ChordShape[] = [
  // AdimMaj7-shape Barre - root on 5th string
  {
    name: 'A-shape dimMaj7 Barre',
    shortName: 'AdimMaj7 barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root
      { fret: 1, finger: 2 }, // 4th - b5
      { fret: 1, finger: 2 }, // 3rd - M7
      { fret: 0, finger: 1 }, // 2nd - b3
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
  // EdimMaj7-shape Barre - root on 6th string
  {
    name: 'E-shape dimMaj7 Barre',
    shortName: 'EdimMaj7 barre',
    type: 'barre',
    cagedShape: 'E',
    rootString: 6,
    rootFretOffset: 0,
    strings: [
      { fret: 0, finger: 1 }, // 6th - root
      { fret: 1, finger: 2 }, // 5th - b5
      { fret: 1, finger: 2 }, // 4th - M7
      { fret: 0, finger: 1 }, // 3rd - b3
      { fret: null, finger: 0 }, // 2nd - muted
      { fret: null, finger: 0 }, // 1st - muted
    ],
  },
];

// ============================================
// SHAPE LIBRARY
// ============================================

export const CHORD_SHAPE_LIBRARY: ChordShapeLibrary = {
  major: MAJOR_SHAPES,
  minor: MINOR_SHAPES,
  dominant7: DOMINANT7_SHAPES,
  minor7: MINOR7_SHAPES,
  major7: MAJOR7_SHAPES,
  sus4: SUS4_SHAPES,
  sus2: SUS2_SHAPES,
  diminished: DIMINISHED_SHAPES,
  augmented: AUGMENTED_SHAPES,
  halfDiminished: HALF_DIMINISHED_SHAPES,
  diminished7: DIMINISHED7_SHAPES,
  sixth: SIXTH_SHAPES,
  minor6: MINOR6_SHAPES,
  add9: ADD9_SHAPES,
  dominant9: NINTH_SHAPES,
  // New chord types
  power: POWER_SHAPES,
  augmented7: AUGMENTED7_SHAPES,
  minor_major7: MINOR_MAJOR7_SHAPES,
  dominant7sus4: DOMINANT7SUS4_SHAPES,
  major9: MAJOR9_SHAPES,
  minor9: MINOR9_SHAPES,
  dominant7flat9: DOMINANT7FLAT9_SHAPES,
  dominant7sharp9: DOMINANT7SHARP9_SHAPES,
  dominant7flat5: DOMINANT7FLAT5_SHAPES,
  dominant7sharp5: DOMINANT7SHARP5_SHAPES,
  dominant7alt: DOMINANT7ALT_SHAPES,
  dominant11: DOMINANT11_SHAPES,
  major11: MAJOR11_SHAPES,
  minor11: MINOR11_SHAPES,
  dominant9sharp11: DOMINANT9SHARP11_SHAPES,
  dominant13: DOMINANT13_SHAPES,
  major13: MAJOR13_SHAPES,
  minor13: MINOR13_SHAPES,
  dominant13flat9: DOMINANT13FLAT9_SHAPES,
  add11: ADD11_SHAPES,
  six_nine: SIXNINE_SHAPES,
  minor_six_nine: MINORSIXNINE_SHAPES,
  dominant9sus4: DOMINANT9SUS4_SHAPES,
  sus2sus4: SUS2SUS4_SHAPES,
  augmented_major7: AUGMENTED_MAJOR7_SHAPES,
  major7flat5: MAJOR7FLAT5_SHAPES,
  diminished_major7: DIMINISHED_MAJOR7_SHAPES,
};

// Map chord quality aliases to library keys
const QUALITY_MAP: Record<string, string> = {
  // Major
  major: 'major',
  maj: 'major',
  '': 'major',
  // Minor
  minor: 'minor',
  min: 'minor',
  m: 'minor',
  // Dominant 7
  dominant7: 'dominant7',
  dom7: 'dominant7',
  '7': 'dominant7',
  // Minor 7
  minor7: 'minor7',
  min7: 'minor7',
  m7: 'minor7',
  // Major 7
  major7: 'major7',
  maj7: 'major7',
  M7: 'major7',
  // Sus4
  sus4: 'sus4',
  sus: 'sus4',
  suspended4: 'sus4',
  // Sus2
  sus2: 'sus2',
  suspended2: 'sus2',
  // Diminished
  diminished: 'diminished',
  dim: 'diminished',
  '°': 'diminished',
  o: 'diminished',
  // Augmented
  augmented: 'augmented',
  aug: 'augmented',
  '+': 'augmented',
  // Half-diminished (m7b5)
  halfDiminished: 'halfDiminished',
  'half-diminished': 'halfDiminished',
  half_diminished7: 'halfDiminished',
  m7b5: 'halfDiminished',
  min7b5: 'halfDiminished',
  ø: 'halfDiminished',
  ø7: 'halfDiminished',
  // Diminished 7
  diminished7: 'diminished7',
  dim7: 'diminished7',
  '°7': 'diminished7',
  o7: 'diminished7',
  // 6th chords
  sixth: 'sixth',
  '6': 'sixth',
  major6: 'sixth',
  maj6: 'sixth',
  // Minor 6
  minor6: 'minor6',
  m6: 'minor6',
  min6: 'minor6',
  // Add9
  add9: 'add9',
  add2: 'add9',
  // Dominant 9
  dominant9: 'dominant9',
  '9': 'dominant9',
  dom9: 'dominant9',
  // Power chord
  power: 'power',
  '5': 'power',
  // Augmented 7 (7#5)
  augmented7: 'augmented7',
  '7#5': 'augmented7',
  '+7': 'augmented7',
  aug7: 'augmented7',
  // Minor Major 7
  minor_major7: 'minor_major7',
  mMaj7: 'minor_major7',
  minMaj7: 'minor_major7',
  'm(M7)': 'minor_major7',
  // Dominant 7 sus4
  dominant7sus4: 'dominant7sus4',
  '7sus4': 'dominant7sus4',
  '7sus': 'dominant7sus4',
  // Major 9
  major9: 'major9',
  Maj9: 'major9',
  M9: 'major9',
  // Minor 9
  minor9: 'minor9',
  m9: 'minor9',
  min9: 'minor9',
  // Dominant 7 flat 9
  dominant7flat9: 'dominant7flat9',
  '7b9': 'dominant7flat9',
  '7♭9': 'dominant7flat9',
  // Dominant 7 sharp 9
  dominant7sharp9: 'dominant7sharp9',
  '7#9': 'dominant7sharp9',
  '7♯9': 'dominant7sharp9',
  // Dominant 7 flat 5
  dominant7flat5: 'dominant7flat5',
  '7b5': 'dominant7flat5',
  '7♭5': 'dominant7flat5',
  // Dominant 7 sharp 5 (same as augmented7, '7#5' mapped above)
  dominant7sharp5: 'dominant7sharp5',
  // Dominant 7 alt
  dominant7alt: 'dominant7alt',
  '7alt': 'dominant7alt',
  alt: 'dominant7alt',
  // Dominant 11
  dominant11: 'dominant11',
  '11': 'dominant11',
  // Major 11
  major11: 'major11',
  Maj11: 'major11',
  M11: 'major11',
  // Minor 11
  minor11: 'minor11',
  m11: 'minor11',
  min11: 'minor11',
  // Dominant 9 sharp 11
  dominant9sharp11: 'dominant9sharp11',
  '9#11': 'dominant9sharp11',
  // Dominant 13
  dominant13: 'dominant13',
  '13': 'dominant13',
  // Major 13
  major13: 'major13',
  Maj13: 'major13',
  M13: 'major13',
  // Minor 13
  minor13: 'minor13',
  m13: 'minor13',
  min13: 'minor13',
  // Dominant 13 flat 9
  dominant13flat9: 'dominant13flat9',
  '13b9': 'dominant13flat9',
  '13♭9': 'dominant13flat9',
  // Add 11
  add11: 'add11',
  add4: 'add11',
  // Six Nine
  six_nine: 'six_nine',
  '6/9': 'six_nine',
  '69': 'six_nine',
  // Minor Six Nine
  minor_six_nine: 'minor_six_nine',
  'm6/9': 'minor_six_nine',
  m69: 'minor_six_nine',
  // Dominant 9 sus4
  dominant9sus4: 'dominant9sus4',
  '9sus4': 'dominant9sus4',
  '9sus': 'dominant9sus4',
  // Sus2 Sus4
  sus2sus4: 'sus2sus4',
  sus24: 'sus2sus4',
  // Augmented Major 7
  augmented_major7: 'augmented_major7',
  'Maj7#5': 'augmented_major7',
  'M7#5': 'augmented_major7',
  '+Maj7': 'augmented_major7',
  // Major 7 flat 5
  major7flat5: 'major7flat5',
  Maj7b5: 'major7flat5',
  M7b5: 'major7flat5',
  // Diminished Major 7
  diminished_major7: 'diminished_major7',
  dimMaj7: 'diminished_major7',
  '°Maj7': 'diminished_major7',
};

// Note to pitch class for calculating barre positions and validating that a
// shape sounds only chord tones. MUST include double accidentals: diminished
// 7ths spell a bb7, and many diminished/augmented/altered chords carry bb/##
// tones (e.g. Ab dim = Ab, Cb, Ebb). Missing keys would fall back to the
// natural letter and mis-compute both barre frets and the no-wrong-note filter.
const NOTE_TO_PITCH_CLASS: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  'E#': 5,
  Fb: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  'B#': 0,
  Cb: 11,
  // Double accidentals
  Cbb: 10,
  'C##': 2,
  Dbb: 0,
  'D##': 4,
  Ebb: 2,
  'E##': 6,
  Fbb: 3,
  'F##': 7,
  Gbb: 5,
  'G##': 9,
  Abb: 7,
  'A##': 11,
  Bbb: 9,
  'B##': 1,
};

// Open string pitch classes (6th to 1st)
const OPEN_STRING_PITCH_CLASSES = [4, 9, 2, 7, 11, 4]; // E A D G B E

function getPitchClass(note: Note): number {
  const key = `${note.natural}${note.accidental}`;
  return NOTE_TO_PITCH_CLASS[key] ?? NOTE_TO_PITCH_CLASS[note.natural] ?? 0;
}

// Get available chord shapes for a given chord
export function getChordShapes(
  root: Note,
  quality: string
): { shape: ChordShape; baseFret: number }[] {
  const normalizedQuality = QUALITY_MAP[quality] || QUALITY_MAP[quality.toLowerCase()];
  if (!normalizedQuality) return [];

  const shapes = CHORD_SHAPE_LIBRARY[normalizedQuality];
  if (!shapes) return [];

  const rootPitchClass = getPitchClass(root);
  const results: { shape: ChordShape; baseFret: number }[] = [];

  for (const shape of shapes) {
    if (shape.type === 'open') {
      // Check if this open shape can play the requested root
      const rootStringIndex = 6 - shape.rootString; // Convert to 0-indexed from top
      const openStringPitchClass = OPEN_STRING_PITCH_CLASSES[rootStringIndex];
      const rootFret = shape.strings[rootStringIndex].fret;

      if (rootFret !== null) {
        const shapePitchClass = (openStringPitchClass + rootFret) % 12;
        if (shapePitchClass === rootPitchClass) {
          results.push({ shape, baseFret: 0 });
        }
      }
    } else {
      // Barre chord - calculate the fret position
      const rootStringIndex = 6 - shape.rootString;
      const openStringPitchClass = OPEN_STRING_PITCH_CLASSES[rootStringIndex];

      // How many semitones up from the open string to the root?
      let baseFret = (rootPitchClass - openStringPitchClass + 12) % 12;

      // For some shapes, we want to avoid fret 0 (use 12 instead)
      if (baseFret === 0) baseFret = 12;

      results.push({ shape, baseFret });
    }
  }

  return results;
}

// Get the best/default shape for a chord (usually the first available)
export function getDefaultChordShape(
  root: Note,
  quality: string
): { shape: ChordShape; baseFret: number } | null {
  const shapes = getChordShapes(root, quality);
  return shapes.length > 0 ? shapes[0] : null;
}

// Import the algorithmic generator for fallback
import { generateChordShapes as generateAlgorithmicShapes } from '../utils/guitarVoicingGenerator';
import { Chord, ChordQuality } from '../types/music';
import { CHORD_FORMULAS } from './chords';

// Sounding pitch classes of a single shape under STANDARD tuning. A string is
// muted when fret === null; otherwise its absolute fret is baseFret + fret (the
// exact resolution the Fretboard renderer's voicingLookup performs), so this is
// the ground-truth set of notes the shape produces.
function shapeSoundingPitchClasses(
  shape: ChordShape,
  baseFret: number
): number[] {
  const pcs: number[] = [];
  shape.strings.forEach((pos, stringIndex) => {
    if (pos.fret === null) return;
    const absFret = baseFret + pos.fret;
    pcs.push((OPEN_STRING_PITCH_CLASSES[stringIndex] + absFret) % 12);
  });
  return pcs;
}

// A shape is correct only if EVERY note it sounds belongs to the chord. A
// shape that sounds a pitch class outside the chord is a wrong-note bug (a
// "C major" grip that rings a B, say) and must never reach the fretboard. This
// guard is data-driven: it catches any mis-authored hand shape AND any stray
// algorithmic voicing, measured against the chord's own pitch-class set.
function shapeHasOnlyChordTones(
  entry: { shape: ChordShape; baseFret: number },
  chordPitchClasses: Set<number>
): boolean {
  return shapeSoundingPitchClasses(entry.shape, entry.baseFret).every((pc) =>
    chordPitchClasses.has(pc)
  );
}

// ── Essential / defining chord tones (derived from the engine formula) ────────
//
// A guitar voicing of a 5–6 note chord can't sound every tone on six strings,
// and a heuristic voicing search will happily drop the very tone that gives the
// chord its name (a "7#9" with no #9, a "maj7" rendered as a plain triad). The
// essential-tone set is the minimum a voicing MUST carry to still BE the chord:
//
//   • root (always)
//   • the 3rd (m3 or M3) — or, for sus chords, the suspension (2 or 4)
//   • the 7th (m7 or M7) whenever the formula carries one
//   • the DEFINING tension — the b5/#5/b9/#9/#11/b13/6/add tone that is the
//     chord's identity and would make the voicing read as a plainer chord if
//     dropped.
//
// Omitting the 5th, or 9/11/13 COLOUR tones on a crowded chord, is acceptable
// and is NOT in this set. Returns the required pitch classes for `chord`.
function essentialPitchClasses(chord: Chord): Set<number> {
  const rootPc = getPitchClass(chord.root);
  const quality = chord.quality;
  const formula = CHORD_FORMULAS[quality as ChordQuality];
  const required = new Set<number>();
  if (!formula) {
    // Unknown/exotic quality with no formula (algorithmic display chords): fall
    // back to requiring just the root — the no-wrong-note filter still applies.
    required.add(rootPc);
    return required;
  }
  const offsets = new Set(formula.map((s) => ((s % 12) + 12) % 12));
  const add = (off: number) => required.add((rootPc + off) % 12);

  // Root
  add(0);

  // Third slot: 3rd, else sus.
  if (offsets.has(4)) add(4);
  else if (offsets.has(3)) add(3);
  else if (offsets.has(5) && quality.includes('sus')) add(5);
  else if (offsets.has(2) && quality.includes('sus')) add(2);
  // power chords (no 3rd / no sus) keep no third-slot requirement.

  // Seventh (only one of m7/M7 is ever present).
  if (offsets.has(11)) add(11);
  else if (offsets.has(10)) add(10);

  // Defining tensions / identity tones, per quality. Mirrors the chordDisplay
  // verification harness — the tones without which the chord is mislabelled.
  const DEFINING: Partial<Record<ChordQuality, number[]>> = {
    diminished: [6],
    diminished7: [6, 9],
    half_diminished7: [6],
    major7flat5: [6],
    diminished_major7: [6],
    dominant7flat5: [6],
    dominant7flat5flat9: [6, 1],
    dominant7flat5sharp9: [6, 3],
    augmented: [8],
    augmented7: [8],
    augmented_major7: [8],
    dominant7sharp5: [8],
    dominant7sharp5flat9: [8, 1],
    dominant7sharp5sharp9: [8, 3],
    major6: [9],
    minor6: [9],
    // 6/9 chords are named for BOTH the 6 and the 9 — keep both (drop the 5th).
    six_nine: [9, 2],
    minor_six_nine: [9, 2],
    add9: [2],
    add11: [5],
    dominant7flat9: [1],
    dominant7sharp9: [3],
    dominant13flat9: [1],
    dominant7sharp11: [6],
    major7sharp11: [6],
    dominant9sharp11: [6],
    major9sharp11: [6],
    dominant7flat13: [8],
  };
  for (const off of DEFINING[quality as ChordQuality] ?? []) add(off);

  return required;
}

/** Does this shape sound every essential tone of the chord? */
function shapeHasEssentials(
  entry: { shape: ChordShape; baseFret: number },
  essentials: Set<number>
): boolean {
  const sounding = new Set(shapeSoundingPitchClasses(entry.shape, entry.baseFret));
  for (const pc of essentials) {
    if (!sounding.has(pc)) return false;
  }
  return true;
}

// Get chord shapes with algorithmic fallback for any chord
// This function accepts a full Chord object and will generate shapes algorithmically
// if no pre-defined shapes are available for the chord quality.
//
// Selection contract (graceful degradation — NEVER a blank board for a real
// chord, and NEVER a wrong note):
//   1. Prefer hand-authored shapes that are wrong-note-free AND carry every
//      essential tone (idiomatic and complete).
//   2. Else the algorithmic generator's wrong-note-free, essentials-complete
//      voicings (covers exotic chords and qualities whose every hand shape was
//      broken or incomplete).
//   3. Else any wrong-note-free shape (hand first, then generated) — a complete
//      voicing isn't physically reachable, so the best no-wrong-note grip wins.
//   4. Else (only if generation fails) empty.
export function getChordShapesWithFallback(
  chord: Chord
): { shape: ChordShape; baseFret: number }[] {
  // The chord's pitch-class set — the contract every rendered shape must honour.
  const chordPitchClasses = new Set(chord.notes.map((n) => getPitchClass(n)));
  const essentials = essentialPitchClasses(chord);

  // For algorithmically-built chords (those with algorithmicDisplayName),
  // their quality may not match a library key, so skip the hand library.
  const isAlgorithmicChord = !!chord.algorithmicDisplayName;

  const handClean = isAlgorithmicChord
    ? []
    : getChordShapes(chord.root, chord.quality).filter((e) =>
        shapeHasOnlyChordTones(e, chordPitchClasses)
      );

  // 1. Hand shapes that are also essentials-complete.
  const handComplete = handClean.filter((e) => shapeHasEssentials(e, essentials));
  if (handComplete.length > 0) return handComplete;

  // 2. Generated shapes that are essentials-complete. Ask the generator to keep
  //    every essential tone (it searches harder for these dense chords), then
  //    enforce no-wrong-note on the result.
  try {
    const genEssential = generateAlgorithmicShapes(chord, undefined, essentials).filter((e) =>
      shapeHasOnlyChordTones(e, chordPitchClasses)
    );
    if (genEssential.length > 0) return genEssential;
  } catch (e) {
    console.warn('Failed to generate essentials-complete chord shapes:', e);
  }

  // Unconstrained generated candidates (the safety net), held to no-wrong-note.
  let genClean: { shape: ChordShape; baseFret: number }[] = [];
  try {
    genClean = generateAlgorithmicShapes(chord).filter((e) =>
      shapeHasOnlyChordTones(e, chordPitchClasses)
    );
  } catch (e) {
    console.warn('Failed to generate algorithmic chord shapes:', e);
    genClean = [];
  }

  // A generated shape that happens to be essentials-complete (belt-and-braces;
  // the strict pass above is the primary source).
  const genComplete = genClean.filter((e) => shapeHasEssentials(e, essentials));
  if (genComplete.length > 0) return genComplete;

  // 3. Graceful degradation: no essentials-complete voicing is reachable, so
  //    return the best no-wrong-note grips (hand first — they're idiomatic),
  //    rather than a blank board. Such a chord is flagged by the verification
  //    harness's allow-list so the omission is documented, not silent.
  if (handClean.length > 0) return handClean;
  return genClean;
}
