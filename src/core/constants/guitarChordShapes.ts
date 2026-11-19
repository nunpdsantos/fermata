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
  // C-shape Barre Major (moveable) - root on 5th string, 3 frets above the
  // index barre (D major: x 5 4 2 3 2).
  {
    name: 'C-shape Barre',
    shortName: 'C barre',
    type: 'barre',
    cagedShape: 'C',
    rootString: 5,
    rootFretOffset: 3,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 3, finger: 4 }, // 5th - root (little finger)
      { fret: 2, finger: 3 }, // 4th - 3rd (ring)
      { fret: 0, finger: 'bar' }, // 3rd - 5th (index barre)
      { fret: 1, finger: 2 }, // 2nd - root (middle)
      { fret: 0, finger: 'bar' }, // 1st - 3rd (index barre)
    ],
    barreInfo: { fret: 0, fromString: 3, toString: 1 },
  },
  // G-shape Barre Major (moveable) - root on 6th string, 3 frets above the
  // index barre (A major: 5 4 2 2 2 5).
  {
    name: 'G-shape Barre',
    shortName: 'G barre',
    type: 'barre',
    cagedShape: 'G',
    rootString: 6,
    rootFretOffset: 3,
    strings: [
      { fret: 3, finger: 3 }, // 6th - root (ring)
      { fret: 2, finger: 2 }, // 5th - 3rd (middle)
      { fret: 0, finger: 'bar' }, // 4th - 5th (index barre)
      { fret: 0, finger: 'bar' }, // 3rd - root (index barre)
      { fret: 0, finger: 'bar' }, // 2nd - 3rd (index barre)
      { fret: 3, finger: 4 }, // 1st - root (little finger)
    ],
    barreInfo: { fret: 0, fromString: 4, toString: 2 },
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
      // 1st - 3rd (little finger). The ring finger cannot hold the 3rd and
      // 1st strings across the 2nd, a fret lower (QA audit Q1, 2026-11-18);
      // fingers 1 3 2 4 as fachords.com gives Eb7 x x 1 3 2 3.
      { fret: 2, finger: 4 },
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
      // Ring, middle, index (fachords.com, Gmaj7 3 2 0 0 0 2): the old 2 1 . . . 3
      // put the middle finger a fret beyond the ring (QA audit Q1).
      { fret: 3, finger: 3 }, // 6th - G (root)
      { fret: 2, finger: 2 }, // 5th - B
      { fret: 0, finger: 0 }, // 4th - D
      { fret: 0, finger: 0 }, // 3rd - G
      { fret: 0, finger: 0 }, // 2nd - B
      { fret: 2, finger: 1 }, // 1st - F# (7)
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
      // Fingers 1 3 2 4 (fachords.com, Ebdim7 x x 1 2 1 2): one finger cannot
      // hold the 3rd and 1st strings across the 2nd, a fret lower (QA audit Q1).
      { fret: 0, finger: 1 }, // 4th - root
      { fret: 1, finger: 3 }, // 3rd - b5
      { fret: 0, finger: 2 }, // 2nd - bb7
      { fret: 1, finger: 4 }, // 1st - b3
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
    // Index on the root; the ring finger lies across strings 4-1 two frets
    // up (finger 1 used to be printed on both frets, audit W3-09).
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      { fret: 0, finger: 1 }, // 5th - root (index)
      { fret: 2, finger: 3 }, // 4th - 5th (ring, partial barre)
      { fret: 2, finger: 3 }, // 3rd - root
      { fret: 2, finger: 3 }, // 2nd - 3rd
      { fret: 2, finger: 3 }, // 1st - 6th
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
      // Fingers 1 2 3 1 4 1 (tabs4acoustic.com, Fm6 1 3 3 1 3 1): the little
      // finger cannot hold the 4th and 2nd strings across the barred 3rd
      // (QA audit Q1).
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 2 }, // 5th - 5th
      { fret: 2, finger: 3 }, // 4th - root
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
    shortName: 'E barre',
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
      { fret: 0, finger: 'bar' }, // 2nd - 9th
      { fret: 0, finger: 'bar' }, // 1st - 5th
    ],
    barreInfo: { fret: 0, fromString: 5, toString: 1 },
  },
  // Dadd9-shape Barre (moveable) - root on 4th string
  {
    name: 'Dadd9-shape Barre',
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
// MINOR MAJOR 7 SHAPES (mMaj7)
// ============================================

const MINOR_MAJOR7_SHAPES: ChordShape[] = [
  // AmMaj7 Open
  {
    name: 'AmMaj7 Open',
    shortName: 'A shape',
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
    shortName: 'E shape',
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
    shortName: 'E barre',
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
    shortName: 'A barre',
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
    shortName: 'C shape',
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
    shortName: 'A barre',
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
    shortName: 'E barre',
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
];

// ============================================
// DOMINANT 7 FLAT 5 SHAPES (7b5)
// ============================================

const DOMINANT7FLAT5_SHAPES: ChordShape[] = [
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
    shortName: 'A barre',
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
    shortName: 'E barre',
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
      // The open A13 (x 0 2 0 2 2: index, middle, ring on the 4th, 2nd and
      // 1st strings, akordy.kytary.cz) with the index barring the open
      // strings: x 1 2 1 3 4. The ring finger cannot hold the 4th and 2nd
      // strings across the barred 3rd (QA audit Q1).
      { fret: 0, finger: 'bar' }, // 5th - root (index barre)
      { fret: 2, finger: 2 }, // 4th - 5th (middle)
      { fret: 0, finger: 'bar' }, // 3rd - b7 (index barre)
      { fret: 2, finger: 3 }, // 2nd - 3rd (ring)
      { fret: 2, finger: 4 }, // 1st - 13th (6th) (little)
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
    shortName: 'A barre',
    type: 'barre',
    cagedShape: 'A',
    rootString: 5,
    rootFretOffset: 0,
    strings: [
      { fret: null, finger: 0 }, // 6th - muted
      // Fingers 1 3 2 4 4: the ring finger cannot hold the 4th and 2nd
      // strings across the 3rd, a fret lower (QA audit Q1); the little finger
      // takes the 2nd and 1st strings together, as fachords.com does for
      // Cmaj13 8 x 9 9 10 10.
      { fret: 0, finger: 1 }, // 5th - root (index)
      { fret: 2, finger: 3 }, // 4th - 5th (ring)
      { fret: 1, finger: 2 }, // 3rd - M7 (middle)
      { fret: 2, finger: 4 }, // 2nd - 3rd (little, with the 1st string)
      { fret: 2, finger: 4 }, // 1st - 13th (6th) (little)
    ],
  },
  // EMaj13-shape Barre - root on 6th string
  {
    name: 'E-shape Maj13 Barre',
    shortName: 'E barre',
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
    shortName: 'C shape',
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
];

// ============================================
// MINOR SIX NINE SHAPES (m6/9)
// ============================================

const MINORSIXNINE_SHAPES: ChordShape[] = [
  // Am6/9 Open
  {
    name: 'Am6/9 Open',
    shortName: 'A shape',
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
    shortName: 'A barre',
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
      // Fingers 1 3 3 3 1 4: the ring finger lies across the 5th, 4th and 3rd
      // strings (as in the E-shape add9 barre above) and the little finger
      // takes the 1st. The old 1 2 3 4 1 4 held the 3rd and 1st strings with
      // one finger across the barred 2nd (QA audit Q1). No reference found
      // for this grip: for the teacher to confirm.
      { fret: 0, finger: 'bar' }, // 6th - root
      { fret: 2, finger: 3 }, // 5th - 5th
      { fret: 2, finger: 3 }, // 4th - root
      { fret: 2, finger: 3 }, // 3rd - 4th
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
  // EMaj7#5-shape Barre - root on 6th string
  {
    name: 'E-shape Maj7#5 Barre',
    shortName: 'E barre',
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
  // EMaj7b5-shape Barre - root on 6th string
  {
    name: 'E-shape Maj7b5 Barre',
    shortName: 'E barre',
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
  // EdimMaj7-shape Barre - root on 6th string
  {
    name: 'E-shape dimMaj7 Barre',
    shortName: 'E barre',
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
  minor_major7: MINOR_MAJOR7_SHAPES,
  dominant7sus4: DOMINANT7SUS4_SHAPES,
  major9: MAJOR9_SHAPES,
  minor9: MINOR9_SHAPES,
  dominant7sharp9: DOMINANT7SHARP9_SHAPES,
  dominant7flat5: DOMINANT7FLAT5_SHAPES,
  dominant7sharp5: DOMINANT7SHARP5_SHAPES,
  dominant7alt: DOMINANT7ALT_SHAPES,
  dominant11: DOMINANT11_SHAPES,
  major11: MAJOR11_SHAPES,
  minor11: MINOR11_SHAPES,
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

      // Fret of the root on its string, minus where the root sits inside the
      // shape (rootFretOffset — 0 when the root is under the barre).
      let baseFret = (rootPitchClass - openStringPitchClass - shape.rootFretOffset + 24) % 12;

      // For some shapes, we want to avoid fret 0 (use 12 instead)
      if (baseFret === 0) baseFret = 12;

      // Never place a shape past the frets the board draws (audit W3-09:
      // the E-shape sus2 for E reached fret 16).
      const top = Math.max(...shape.strings.map((p) => (p.fret === null ? 0 : p.fret)));
      if (baseFret + top > GUITAR_MAX_FRET) continue;

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
import { GUITAR_MAX_FRET } from '../utils/guitarPositions';

/**
 * Can a placed shape be played as drawn (audit W3-09)?
 *  - every fretted string has a finger, and each finger presses ONE fret
 *    (several strings on that fret is a partial barre; 'bar' is the index);
 *  - a barre never lies across a string that rings open or is fretted below
 *    it, and both of its ends sit on the barre fret;
 *  - nothing is past the frets the board draws.
 * And (QA audit Q1, 2026-11-18) the hand itself:
 *  - a finger on several strings lies across every string between them, so
 *    each of those must sound at that fret under the same finger, or higher
 *    under another finger: never open, muted or lower (one finger on G12 and
 *    e12 cannot let B ring at 11);
 *  - fingers lie in order along the neck, and fingers a < b are at most
 *    (b − a) + 1 frets apart (one finger per fret plus one fret of stretch);
 *  - the drawn barre is the index finger's.
 * With a capo on fret `capo` (wave 2) the capo is the nut: a string at the
 * capo rings "open" (no finger), nothing may sit behind it, and a barre lies
 * above it.
 */
export function isPlayableChordShape(
  entry: { shape: ChordShape; baseFret: number },
  maxFret: number = GUITAR_MAX_FRET,
  capo: number = 0
): boolean {
  const { shape, baseFret } = entry;
  const fingerFret = new Map<number, number>();
  const fingerOn: (number | null)[] = shape.strings.map(() => null);
  for (let i = 0; i < 6; i++) {
    const p = shape.strings[i];
    if (p.fret === null) continue;
    const abs = baseFret + p.fret;
    if (abs < capo || abs > maxFret) return false;
    if (abs === capo) continue;
    if (p.finger === undefined || p.finger === 0) return false;
    const f = p.finger === 'bar' ? 1 : p.finger;
    const prev = fingerFret.get(f);
    if (prev !== undefined && prev !== abs) return false;
    fingerFret.set(f, abs);
    fingerOn[i] = f;
  }
  for (const [f, fret] of fingerFret) {
    const first = fingerOn.indexOf(f);
    const last = fingerOn.lastIndexOf(f);
    for (let i = first + 1; i < last; i++) {
      const p = shape.strings[i];
      if (p.fret === null || fingerOn[i] === null) return false;
      const abs = baseFret + p.fret;
      if (abs < fret || (abs === fret && fingerOn[i] !== f)) return false;
    }
  }
  for (const [a, fa] of fingerFret) {
    for (const [b, fb] of fingerFret) {
      if (a < b && (fa > fb || fb - fa > b - a + 1)) return false;
    }
  }
  if (shape.barreInfo) {
    const bf = baseFret + shape.barreInfo.fret;
    if (bf <= capo) return false;
    const a = 6 - shape.barreInfo.fromString;
    const b = 6 - shape.barreInfo.toString;
    for (let s = Math.min(a, b); s <= Math.max(a, b); s++) {
      const p = shape.strings[s];
      if (p.fret === null) continue;
      const abs = baseFret + p.fret;
      if (abs === capo || abs < bf) return false;
    }
    for (const end of [a, b]) {
      const p = shape.strings[end];
      if (p.fret === null || baseFret + p.fret !== bf) return false;
      // The drawn barre is the index finger's (Q1).
      if (p.finger !== 'bar' && p.finger !== 1) return false;
    }
  }
  return true;
}
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
//   • the tone that NAMES the chord (music audit 2, M44, 2026-11-19): the 9 of
//     a ninth chord, the 11 of an eleventh, the 13 of a thirteenth, the 5 of
//     a power chord, the 2 of sus2sus4 — and every tone a name spells out
//     besides its number (9♯11: the 9 and the ♯11; 9sus4: the 9 and the 4;
//     13♭9: the 13 and the ♭9). A "Cmaj11" that leaves out F is Cmaj9.
//
// Omitting the 5th, and the tones between the 7th and the named one (the 9 of
// an eleventh chord; the 9 and 11 of a thirteenth), is acceptable and is NOT
// in this set: "composers and arrangers often omit chord tones from extended
// harmonies, but generally retain at least the root, third, seventh, and
// whatever note is the furthest extension in the chord … the fifth and notes
// between the seventh and the highest factor can be omitted" (Toby Rush,
// Music Theory for the 21st-Century Classroom, ch. 6,
// https://tobyrush.com/book/text/ftt/ftt06.html); on the guitar, a 13th
// "usually drop[s] the eleventh … the ninth and the fifth can be omitted as
// well" (B. Milewski, Guitar Decomposed 9: Extension Chords,
// https://bartoszmilewski.com/2020/06/11/guitar-decomposed-9-extension-chords/).
// The 3rd of a dominant / major eleventh is already out of its formula
// (chords.ts: it clashes with the 11th — Ithaca College, Theory III, Extended
// Tertian Chords: "omit the third and the ninth", https://musictech.ithaca.edu/
// MusicTech/ICTheory/OnlineText/TheoryIII/Unit4/ExTer/ExTer.html).
// Returns the required pitch classes for `chord`.
/**
 * The tone each name carries (M44, above): its number, and any tone it spells
 * out besides (9♯11: the 9; 13♭9: the 13 — their ♯11 / ♭9 are defining
 * already). Offsets above the root.
 */
const NAMED_TONES: Partial<Record<ChordQuality, number[]>> = {
  power: [7],
  sus2sus4: [2],
  dominant9: [2],
  major9: [2],
  minor9: [2],
  dominant9sus4: [2],
  dominant11: [5],
  major11: [5],
  minor11: [5],
  dominant13: [9],
  major13: [9],
  minor13: [9],
  dominant13flat9: [9],
  dominant9sharp11: [2],
  major9sharp11: [2],
};

/**
 * `named` false leaves the named tones out: the set of release 16, used only
 * where no grip that sounds them can give the asked bass (`chordShapesForCapo`).
 */
function essentialPitchClasses(chord: Chord, named = true): Set<number> {
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
    minor_add9: [2],
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
  // A named tone only where the chord's own notes hold it: a chord the parser
  // builds note by note borrows the nearest quality (C9♭13 is "dominant13"),
  // whose named 13 (A) it does not sound, and requiring it left no grip with
  // every tone, so the board fell back to grips without the 3rd or the ♭7
  // (found in the review fix pass, sweeping the parser's slash chords).
  if (named) {
    const own = new Set(chord.notes.map((n) => getPitchClass(n)));
    for (const off of NAMED_TONES[quality as ChordQuality] ?? []) if (own.has((rootPc + off) % 12)) add(off);
  }

  return required;
}

/**
 * The chord's essential tones (above) that a grip leaves out, spelled as the
 * chord spells them, in the chord's order — empty when it sounds them all.
 * The board names them under such a grip (M44: where no grip within a hand's
 * reach sounds the tone that names the chord, the screen says which it
 * leaves out). The grip's frets are the real ones (a capo already in them),
 * so `chord` is the chord as it sounds, never the one below the capo.
 */
export function gripLeavesOut(entry: { shape: ChordShape; baseFret: number }, chord: Chord): Note[] {
  const sounding = new Set(shapeSoundingPitchClasses(entry.shape, entry.baseFret));
  const essentials = essentialPitchClasses(chord);
  const seen = new Set<number>();
  return chord.notes.filter((n) => {
    const pc = getPitchClass(n);
    if (!essentials.has(pc) || sounding.has(pc) || seen.has(pc)) return false;
    seen.add(pc);
    return true;
  });
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
// Every tier is chosen among the grips that fit below `maxFret` (with a capo
// on fret c the hand has 15 − c frets above it): at capo 9 the hand-made C5
// grips, moved up, were all past fret 15, so the board offered nothing while
// the generator had one (music audit 2, M45: strings 4 and 3 at frets 10 and
// 12). At the default, 15, the tiers are exactly as before.
export function getChordShapesWithFallback(
  chord: Chord,
  maxFret: number = GUITAR_MAX_FRET
): { shape: ChordShape; baseFret: number }[] {
  return shapesWithFallback(chord, maxFret, essentialPitchClasses(chord));
}

function shapesWithFallback(
  chord: Chord,
  maxFret: number,
  essentials: Set<number>
): { shape: ChordShape; baseFret: number }[] {
  // Every inversion and slash bass of a chord asks for the same grips: kept
  // (pure; the oldest dropped past FALLBACK_MAX), each caller its own array.
  const key = [noteToString(chord.root), chord.quality, chord.notes.map(noteToString).join(' '), chord.algorithmicDisplayName ?? '', maxFret, [...essentials].sort((x, y) => x - y).join(',')].join('|');
  const known = FALLBACK.get(key);
  if (known) return [...known];
  const found = shapesWithFallbackUncached(chord, maxFret, essentials);
  if (FALLBACK.size >= FALLBACK_MAX) FALLBACK.delete(FALLBACK.keys().next().value as string);
  FALLBACK.set(key, found);
  return [...found];
}
const FALLBACK = new Map<string, { shape: ChordShape; baseFret: number }[]>();
const FALLBACK_MAX = 5_000;

function shapesWithFallbackUncached(
  chord: Chord,
  maxFret: number,
  essentials: Set<number>
): { shape: ChordShape; baseFret: number }[] {
  // The chord's pitch-class set — the contract every rendered shape must honour.
  const chordPitchClasses = new Set(chord.notes.map((n) => getPitchClass(n)));

  // For algorithmically-built chords (those with algorithmicDisplayName),
  // their quality may not match a library key, so skip the hand library.
  const isAlgorithmicChord = !!chord.algorithmicDisplayName;

  const handClean = isAlgorithmicChord
    ? []
    : getChordShapes(chord.root, chord.quality).filter(
        (e) => shapeHasOnlyChordTones(e, chordPitchClasses) && isPlayableChordShape(e, maxFret)
      );

  // 1. Hand shapes that are also essentials-complete.
  const handComplete = handClean.filter((e) => shapeHasEssentials(e, essentials));
  if (handComplete.length > 0) return handComplete;

  // 2. Generated shapes that are essentials-complete. Ask the generator to keep
  //    every essential tone (it searches harder for these dense chords), then
  //    enforce no-wrong-note on the result.
  try {
    const genEssential = generateAlgorithmicShapes(chord, undefined, essentials).filter(
      (e) => shapeHasOnlyChordTones(e, chordPitchClasses) && isPlayableChordShape(e, maxFret)
    );
    if (genEssential.length > 0) return genEssential;
  } catch (e) {
    console.warn('Failed to generate essentials-complete chord shapes:', e);
  }

  // Unconstrained generated candidates (the safety net), held to no-wrong-note.
  let genClean: { shape: ChordShape; baseFret: number }[] = [];
  try {
    genClean = generateAlgorithmicShapes(chord).filter(
      (e) => shapeHasOnlyChordTones(e, chordPitchClasses) && isPlayableChordShape(e, maxFret)
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

// ── Default order (what the fretboard shows first) ────────────────────────────

/** Absolute fret of the lowest FRETTED note (0 for an all-open shape). */
function lowestFrettedFret({ shape, baseFret }: { shape: ChordShape; baseFret: number }): number {
  // Transposed open shapes encode the barre as open strings + baseFret, so
  // filter on the absolute fret, not the shape-relative one.
  let min = Infinity;
  for (const pos of shape.strings) {
    if (pos.fret !== null) {
      const abs = baseFret + pos.fret;
      if (abs > 0) min = Math.min(min, abs);
    }
  }
  return min === Infinity ? 0 : min;
}

/**
 * The C-shape and G-shape major barres are real but harder grips; they are
 * offered, never the default (review #1, W3: restoring them must not change
 * the default for Db or Ab major from the A-/E-shape barre).
 */
const OFFERED_NOT_DEFAULT = new Set(['C-shape Barre', 'G-shape Barre']);

/**
 * Order shapes for display: nut-closest first, so the default is the
 * familiar voicing (Cm → the A-shape barre at fret 3, not one at fret 8),
 * with the C-/G-shape barres after every other shape. Stable otherwise.
 */
export function sortShapesForDefault<T extends { shape: ChordShape; baseFret: number }>(shapes: T[]): T[] {
  const rank = (e: T) => (OFFERED_NOT_DEFAULT.has(e.shape.name) ? 1 : 0);
  return [...shapes].sort((a, b) => rank(a) - rank(b) || lowestFrettedFret(a) - lowestFrettedFret(b));
}

// ── Requested bass: inversions and slash chords (audit W3-11) ────────────────

/** The open strings' MIDI numbers in standard tuning, 6th to 1st (E2 A2 D3 G3 B3 E4). */
const OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64];

/**
 * The lowest PITCH a placed shape sounds (MIDI; a capo is already in its
 * frets), or null when nothing sounds. Not the lowest string: the open A (A2)
 * is lower than the low E at fret 9 (C♯3), so `9 0 0 x x 0` has A in the bass
 * (independent review of a611beb, 2026-11-19).
 */
export function lowestSoundingMidi(entry: { shape: ChordShape; baseFret: number }): number | null {
  let low: number | null = null;
  entry.shape.strings.forEach((p, i) => {
    if (p.fret === null) return;
    const midi = OPEN_STRING_MIDI[i] + entry.baseFret + p.fret;
    if (low === null || midi < low) low = midi;
  });
  return low;
}

/** Pitch class of the lowest pitch a placed shape sounds (standard tuning). */
export function lowestSoundingPitchClass(entry: { shape: ChordShape; baseFret: number }): number | null {
  const low = lowestSoundingMidi(entry);
  return low === null ? null : low % 12;
}

/**
 * Add the bass on a free (muted) string below the shape's lowest sounding
 * string: open if that string's open note is the bass, otherwise fretted
 * within a 4-fret hand span with a free finger that keeps finger order
 * (lower fret → lower finger). Returns null when no string can take it.
 *
 * When every finger is already down (the D7 shape since its fingering was
 * corrected, QA audit Q1), the bass may instead REPLACE the same note higher
 * up, the way a guitarist turns the D-shape E7 (x x 2 4 3 4) into E7/G♯
 * (4 x 2 4 3 x): that string is muted and its finger takes the bass. Only a
 * note under its own finger, never one under the index barre.
 */
/** A grip's name with the bass it was given ("E shape/G"); root position adds nothing. */
function withBassName(shape: ChordShape, bassLabel: string): Pick<ChordShape, 'name' | 'shortName'> {
  return bassLabel ? { name: `${shape.name} / ${bassLabel}`, shortName: `${shape.shortName}/${bassLabel}` } : { name: shape.name, shortName: shape.shortName };
}

function withBassAdded(
  entry: { shape: ChordShape; baseFret: number },
  bassPc: number,
  bassLabel: string,
  maxFret: number
): { shape: ChordShape; baseFret: number } | null {
  const added = addBassBelow(entry, bassPc, bassLabel, maxFret);
  if (added) return added;
  const { shape, baseFret } = entry;
  for (let i = 5; i >= 0; i--) {
    const p = shape.strings[i];
    if (p.fret === null || p.finger === 'bar' || !p.finger) continue;
    if ((OPEN_STRING_PITCH_CLASSES[i] + baseFret + p.fret + 120) % 12 !== bassPc) continue;
    const strings = shape.strings.map((q, j) => (j === i ? { fret: null, finger: 0 as FingerNumber } : { ...q })) as ChordShape['strings'];
    const freed = addBassBelow({ shape: { ...shape, strings }, baseFret }, bassPc, bassLabel, maxFret);
    if (freed) return freed;
  }
  return null;
}

function addBassBelow(
  entry: { shape: ChordShape; baseFret: number },
  bassPc: number,
  bassLabel: string,
  maxFret: number
): { shape: ChordShape; baseFret: number } | null {
  const { shape, baseFret } = entry;
  const lowest = shape.strings.findIndex((p) => p.fret !== null);
  if (lowest <= 0) return null;
  const fretted: { abs: number; finger: number }[] = [];
  for (const p of shape.strings) {
    if (p.fret === null) continue;
    const abs = baseFret + p.fret;
    if (abs > 0) fretted.push({ abs, finger: p.finger === 'bar' ? 1 : Number(p.finger ?? 0) });
  }
  for (let s = lowest - 1; s >= 0; s--) {
    const first = (bassPc - OPEN_STRING_PITCH_CLASSES[s] + 12) % 12;
    for (const fret of [first, first + 12]) {
      if (fret > maxFret) continue;
      let finger: FingerNumber = 0;
      if (fret > 0) {
        const all = [...fretted.map((n) => n.abs), fret];
        if (Math.max(...all) - Math.min(...all) > 3) continue;
        const used = new Set(fretted.map((n) => n.finger));
        // A free finger in order along the neck AND within reach of every
        // finger already down (Q1: Db m11 / C♭ put the middle finger three
        // frets past the index barre; the little finger reaches it).
        const candidate = ([1, 2, 3, 4] as const).find(
          (f) =>
            !used.has(f) &&
            fretted.every((n) =>
              n.abs < fret ? n.finger < f && fret - n.abs <= f - n.finger + 1
                : n.abs > fret ? n.finger > f && n.abs - fret <= n.finger - f + 1
                  : true)
        );
        if (candidate === undefined) continue;
        finger = candidate;
      }
      const strings = shape.strings.map((p) => ({ ...p })) as ChordShape['strings'];
      strings[s] = { fret: fret - baseFret, finger };
      const extended: ChordShape = { ...shape, ...withBassName(shape, bassLabel), strings };
      const placed = { shape: extended, baseFret };
      // The bass must be what sounds lowest, not only the lowest string.
      if (isPlayableChordShape(placed, maxFret) && lowestSoundingPitchClass(placed) === bassPc) return placed;
    }
  }
  return null;
}

/**
 * Mute every string below the lowest string that already sounds the bass's
 * pitch class, kept only when that note is then the lowest PITCH —
 * the usual way a guitarist plays an inversion from a known grip (G open
 * 320003 → x20003 for G/B). Kept only if at least three strings still sound
 * and every essential chord tone survives.
 */
function withLowerStringsMuted(
  entry: { shape: ChordShape; baseFret: number },
  bassPc: number,
  required: Set<number>,
  bassLabel: string,
  maxFret: number
): { shape: ChordShape; baseFret: number } | null {
  const { shape, baseFret } = entry;
  const idx = shape.strings.findIndex(
    (p, i) => p.fret !== null && (OPEN_STRING_PITCH_CLASSES[i] + baseFret + p.fret + 120) % 12 === bassPc
  );
  if (idx <= 0) return null;
  const strings = shape.strings.map((p, i) => (i < idx ? { fret: null, finger: 0 as FingerNumber } : { ...p })) as ChordShape['strings'];
  const sounding = new Set<number>();
  let count = 0;
  strings.forEach((p, i) => {
    if (p.fret === null) return;
    count++;
    sounding.add((OPEN_STRING_PITCH_CLASSES[i] + baseFret + p.fret + 120) % 12);
  });
  if (count < 3) return null;
  for (const pc of required) if (!sounding.has(pc)) return null;
  // Re-derive the barre from the index-finger strings that remain.
  let barreInfo = shape.barreInfo;
  if (barreInfo) {
    const bars = strings.map((p, i) => (p.fret !== null && p.finger === 'bar' ? i : -1)).filter((i) => i >= 0);
    if (bars.length >= 2) {
      barreInfo = { fret: barreInfo.fret, fromString: 6 - Math.min(...bars), toString: 6 - Math.max(...bars) };
    } else {
      barreInfo = undefined;
      for (const i of bars) strings[i] = { ...strings[i], finger: 1 };
    }
  }
  const trimmed: ChordShape = { ...shape, ...withBassName(shape, bassLabel), strings, barreInfo };
  if (!barreInfo) delete trimmed.barreInfo;
  const placed = { shape: trimmed, baseFret };
  // The bass string's note must also be the lowest pitch left sounding.
  return isPlayableChordShape(placed, maxFret) && lowestSoundingPitchClass(placed) === bassPc ? placed : null;
}

/**
 * The bass on the lowest sounding string itself, in place of the note that
 * string played — the way the open Em7 (0 2 0 0 0 0) becomes Em7/G
 * (3 2 0 0 0 0): the low E goes, the high E keeps the root (music audit 2,
 * M45). Kept only when every essential chord tone still sounds, the string
 * rings open or a finger takes it (see below), the lowest string is not under
 * the drawn barre, and the bass is then the lowest pitch. Where the plain
 * re-fret finds no finger, the string above it may be muted to free one, if
 * every essential tone still sounds (G 3 2 0 0 0 3 → G/F♯ 2 x 0 0 0 3).
 */
function withLowestRefretted(
  entry: { shape: ChordShape; baseFret: number },
  bassPc: number,
  required: Set<number>,
  bassLabel: string,
  maxFret: number
): { shape: ChordShape; baseFret: number } | null {
  return refretLowest(entry, bassPc, required, bassLabel, maxFret, false) ?? refretLowest(entry, bassPc, required, bassLabel, maxFret, true);
}

function refretLowest(
  entry: { shape: ChordShape; baseFret: number },
  bassPc: number,
  required: Set<number>,
  bassLabel: string,
  maxFret: number,
  muteNeighbour: boolean
): { shape: ChordShape; baseFret: number } | null {
  const { shape, baseFret } = entry;
  const s = shape.strings.findIndex((p) => p.fret !== null);
  if (s < 0 || shape.strings[s].finger === 'bar') return null;
  const base = shape.strings.map((p) => ({ ...p })) as ChordShape['strings'];
  if (muteNeighbour) {
    const n = base.findIndex((p, i) => i > s && p.fret !== null);
    if (n < 0 || base[n].finger === 'bar') return null;
    base[n] = { fret: null, finger: 0 };
  }
  const fretted: { abs: number; finger: number }[] = [];
  base.forEach((p, i) => {
    if (i === s || p.fret === null) return;
    const abs = baseFret + p.fret;
    if (abs > 0) fretted.push({ abs, finger: p.finger === 'bar' ? 1 : Number(p.finger ?? 0) });
  });
  const first = (bassPc - OPEN_STRING_PITCH_CLASSES[s] + 12) % 12;
  for (const fret of [first, first + 12]) {
    if (fret > maxFret || fret === baseFret + (shape.strings[s].fret as number)) continue;
    let finger: FingerNumber = 0;
    if (fret > 0) {
      const all = [...fretted.map((n) => n.abs), fret];
      if (Math.max(...all) - Math.min(...all) > 3) continue;
      const used = new Set(fretted.map((n) => n.finger));
      // As addBassBelow, and one rule more, because this finger is on the
      // LOWEST string: where it is a higher finger than one on a string
      // above it, it lies diagonally past that finger, at least as many
      // frets higher as their numbers differ — as the open C (x 3 2 0 1 0,
      // ring 3 over middle 2 over index 1) and G (3 2 0 0 0 4) do, and as
      // Em7/G does (3 2 0 0 0 0). Never the little finger on string 5 at
      // fret 3 behind three fingers on fret 2 (A/C x 3 2 2 2 0): no hand
      // reaches over its own index so (the builder's rule; for the teacher).
      // A free finger first; else the index, where it is already down at this
      // fret, lies on across the lowest string too (G/F♯ 2 2 0 0 0 3, the index
      // over the two low strings: music audit 2, review item 4).
      const fits = (f: number) =>
        fretted.every((n) =>
          (n.abs < fret ? n.finger < f && fret - n.abs <= f - n.finger + 1
            : n.abs > fret ? n.finger > f && n.abs - fret <= n.finger - f + 1
              : true) && (n.finger > f || fret - n.abs >= f - n.finger));
      const free = ([1, 2, 3, 4] as const).find((f) => !used.has(f) && fits(f));
      const indexHere = fretted.some((n) => n.finger === 1 && n.abs === fret) && fits(1);
      if (free !== undefined) finger = free;
      else if (indexHere) finger = shape.barreInfo && baseFret + shape.barreInfo.fret === fret ? 'bar' : 1;
      else continue;
    }
    const strings = base.map((p) => ({ ...p })) as ChordShape['strings'];
    strings[s] = { fret: fret - baseFret, finger };
    let barreInfo = shape.barreInfo;
    if (finger === 'bar' && barreInfo) barreInfo = { ...barreInfo, fromString: Math.max(barreInfo.fromString, 6 - s) };
    const placed = { shape: { ...shape, ...withBassName(shape, bassLabel), strings, ...(barreInfo ? { barreInfo } : {}) }, baseFret };
    const sounding = new Set(shapeSoundingPitchClasses(placed.shape, baseFret));
    if ([...required].some((pc) => !sounding.has(pc))) continue;
    if (placed.shape.strings.filter((p) => p.fret !== null).length < 3) continue;
    if (isPlayableChordShape(placed, maxFret) && lowestSoundingPitchClass(placed) === bassPc) return placed;
  }
  return null;
}

/**
 * The last way to give the asked bass (music audit 2, review item 4): ask the
 * voicing generator for grips whose lowest pitch is the bass — with a slash
 * bass that is not a chord tone added to the notes it may place — that sound
 * every required tone, and keep those a hand can play (`isPlayableChordShape`)
 * on at least three strings. C9/E 0 3 2 3 3 x, which no hand-made C9 grip
 * gives (the library's C9 shapes are an E-shape barre at 8 and two that
 * lack the 3rd or the 9th).
 */
function searchedForBass(
  chord: Chord,
  bassPc: number,
  required: Set<number>,
  bassLabel: string,
  maxFret: number
): { shape: ChordShape; baseFret: number }[] {
  const isTone = chord.notes.some((n) => getPitchClass(n) === bassPc);
  const placing = isTone || !chord.bassNote ? chord : { ...chord, notes: [...chord.notes, chord.bassNote] };
  const allowed = new Set(placing.notes.map((n) => getPitchClass(n)));
  let found: { shape: ChordShape; baseFret: number }[] = [];
  try {
    found = generateAlgorithmicShapes(placing, undefined, required, bassPc);
  } catch (e) {
    console.warn('Failed to search grips for a bass:', e);
  }
  return found
    .filter((e) =>
      shapeHasOnlyChordTones(e, allowed) && shapeHasEssentials(e, required) && isPlayableChordShape(e, maxFret) &&
      lowestSoundingPitchClass(e) === bassPc && e.shape.strings.filter((p) => p.fret !== null).length >= 3)
    .map((e) => ({ shape: { ...e.shape, ...withBassName(e.shape, bassLabel) }, baseFret: e.baseFret }));
}

/**
 * Fingers for absolute frets (6th string first; null = muted, 0 = open) that
 * the app's hand rule accepts (`isPlayableChordShape`), or null. Fingers lie
 * in order along the neck, so taking the stopped notes by fret (then string)
 * every acceptable fingering is a non-decreasing run of finger numbers, one
 * finger staying on one fret (at most 84 runs for six notes); among those
 * that pass, one where no finger lies behind a lower-numbered finger on a
 * higher string (the diagonal rule of `refretLowest`) is preferred. The index
 * across two strings or more is drawn as a barre.
 */
function fingersFor(frets: (number | null)[], maxFret: number): ChordShape['strings'] | null {
  const notes = frets.flatMap((f, s) => (f === null || f === 0 ? [] : [{ s, f }])).sort((a, b) => a.f - b.f || a.s - b.s);
  const asStrings = (fingers: number[]): ChordShape['strings'] => {
    const index = notes.filter((_, i) => fingers[i] === 1).length > 1;
    return frets.map((f, s) => {
      const i = notes.findIndex((n) => n.s === s);
      return { fret: f, finger: (i < 0 ? 0 : fingers[i] === 1 && index ? 'bar' : fingers[i]) as FingerNumber };
    }) as ChordShape['strings'];
  };
  const barreOf = (strings: ChordShape['strings']) => {
    const bars = strings.flatMap((p, i) => (p.finger === 'bar' ? [i] : []));
    return bars.length > 1 ? { fret: strings[bars[0]].fret as number, fromString: 6 - bars[0], toString: 6 - bars[bars.length - 1] } : undefined;
  };
  const playable = (strings: ChordShape['strings']) => {
    const barreInfo = barreOf(strings);
    const shape: ChordShape = { name: 'Search', shortName: 'Search', type: 'open', cagedShape: 'C', rootString: 6, rootFretOffset: 0, strings, ...(barreInfo ? { barreInfo } : {}) };
    return isPlayableChordShape({ shape, baseFret: 0 }, maxFret);
  };
  const diagonal = (fingers: number[]) =>
    notes.every((a, i) => notes.every((b, j) => !(a.s < b.s && fingers[i] > fingers[j]) || a.f - b.f >= fingers[i] - fingers[j]));
  let fallback: ChordShape['strings'] | null = null;
  const fingers: number[] = [];
  const walk = (i: number): ChordShape['strings'] | null => {
    if (i === notes.length) {
      const strings = asStrings(fingers);
      if (!playable(strings)) return null;
      if (diagonal(fingers)) return strings;
      fallback ??= strings;
      return null;
    }
    for (let f = i === 0 ? 1 : fingers[i - 1]; f <= 4; f++) {
      if (i > 0 && f === fingers[i - 1] && notes[i].f !== notes[i - 1].f) continue;
      fingers[i] = f;
      const done = walk(i + 1);
      if (done) return done;
    }
    return null;
  };
  if (notes.length === 0) return frets.map((f) => ({ fret: f, finger: 0 })) as ChordShape['strings'];
  return walk(0) ?? fallback;
}

/**
 * The last way before a grip that leaves out a tone (music audit 2, review
 * item 4): every grip within reach, hand by hand, with the asked bass as its
 * lowest pitch, only the chord's tones (and a slash bass), every required
 * tone, and at least four strings (else three), each fingered as
 * `fingersFor` finds; those the board would show first are kept (four at
 * most). The voicing generator ranks its own top few and missed most of them.
 */
function searchedAcrossTheNeck(
  chord: Chord,
  bassPc: number,
  required: Set<number>,
  bassLabel: string,
  maxFret: number
): { shape: ChordShape; baseFret: number }[] {
  const allowed = new Set([...chord.notes.map((n) => getPitchClass(n)), bassPc]);
  const found = new Map<string, { shape: ChordShape; baseFret: number }>();
  for (const least of [4, 3]) {
    for (let w = 1; w + 3 <= Math.max(4, maxFret); w++) {
      const options = OPEN_STRING_MIDI.map((open) => {
        const o: (number | null)[] = [null];
        if (allowed.has(open % 12)) o.push(0);
        for (let f = w; f <= Math.min(w + 3, maxFret); f++) if (allowed.has((open + f) % 12)) o.push(f);
        return o;
      });
      const frets: (number | null)[] = new Array(6).fill(null);
      const pick = (s: number) => {
        if (s === 6) {
          const midis = frets.flatMap((f, i) => (f === null ? [] : [OPEN_STRING_MIDI[i] + f]));
          if (midis.length < least || Math.min(...midis) % 12 !== bassPc) return;
          const pcs = new Set(midis.map((m) => m % 12));
          for (const pc of required) if (!pcs.has(pc)) return;
          const key = frets.map((f) => (f === null ? 'x' : f)).join('-');
          if (found.has(key)) return;
          const strings = fingersFor(frets, maxFret);
          if (!strings) return;
          // Stored as the generator stores its own: from the lowest stopped
          // fret (an open string a negative offset), "open" only with nothing
          // stopped, named "Pos N" — so the chip reads "Fret N" (or "Open"),
          // and the Progression panel's "open grip" means what it always has.
          const stopped = frets.filter((f): f is number => f !== null && f > 0);
          const baseFret = stopped.length > 0 ? Math.min(...stopped) : 0;
          const relative = strings.map((p) => ({ ...p, fret: p.fret === null ? null : (p.fret as number) - baseFret })) as ChordShape['strings'];
          const bars = strings.flatMap((p, i) => (p.finger === 'bar' ? [i] : []));
          const barre = bars.length > 1 ? { fret: (strings[bars[0]].fret as number) - baseFret, fromString: 6 - bars[0], toString: 6 - bars[bars.length - 1] } : undefined;
          const shape: ChordShape = {
            name: 'Search', shortName: `Pos ${baseFret}`, type: baseFret === 0 ? 'open' : 'barre', cagedShape: 'C', rootString: 6, rootFretOffset: 0, strings: relative,
            ...(barre ? { barreInfo: barre } : {}),
          };
          const placed = { shape: { ...shape, ...withBassName(shape, bassLabel) }, baseFret };
          if (isPlayableChordShape(placed, maxFret)) found.set(key, placed);
          return;
        }
        for (const f of options[s]) { frets[s] = f; pick(s + 1); }
        frets[s] = null;
      };
      pick(0);
    }
    if (found.size > 0) break;
  }
  return boardOrder([...found.values()], bassLabel ? { pc: bassPc, outside: bassOutsideChord(chord, bassPc) } : null).slice(0, 4);
}

/**
 * A grip given a bass from an open shape stays "open" (the Progression
 * panel's "open grip", `hasOpenGrip`) only while every stopped fret is within
 * the open position and its stretch — frets 1–4 and the little finger up to
 * fret 5, as the scale positions have it (`guitarPositions`): Cmaj7/A
 * 5 3 2 0 0 0 stays open, Em7/C 8 x 0 0 0 0 — the open Em7 with its low
 * string re-fretted to fret 8 — is not an open grip (review of builder K).
 */
function inOpenPositionOrNot(entry: { shape: ChordShape; baseFret: number }): { shape: ChordShape; baseFret: number } {
  if (entry.shape.type !== 'open') return entry;
  const stopped = entry.shape.strings.every((p) => p.fret === null || entry.baseFret + p.fret <= 5);
  return stopped ? entry : { shape: { ...entry.shape, type: 'barre' }, baseFret: entry.baseFret };
}

/**
 * A 7alt grip sounds at least one of its alterations (♭9 ♯9 ♯11 ♭13): the
 * required set names each tone a grip must sound, and cannot say "one of",
 * so a grip a bass is given by muting, re-fretting or a search could sound
 * only R 3 ♭7, a C7 under the name C7alt (round one's walk caught it). Every
 * other chord: true.
 */
function keepsItsAlteration(entry: { shape: ChordShape; baseFret: number }, chord: Chord): boolean {
  if (chord.quality !== 'dominant7alt') return true;
  const root = getPitchClass(chord.root);
  const sounding = new Set(shapeSoundingPitchClasses(entry.shape, entry.baseFret));
  return [1, 3, 6, 8].some((o) => sounding.has((root + o) % 12));
}

/**
 * Order chord shapes so the first one has `bassPc` as its lowest PITCH
 * (`lowestSoundingPitchClass`, never the lowest string):
 * existing shapes with that bass first (in their given order); else every
 * shape the four ways give — the strings below a bass-note string muted,
 * the bass added on a free lower string (slash chords), the lowest string
 * re-fretted to the bass (M45), and the generator's grips with that bass
 * (`searchedForBass`); else a search across the neck (`searchedAcrossTheNeck`). `bassMatched` is false when none of these
 * exists — the shapes are then returned unchanged, so the caller can say so
 * instead of silently ignoring the request.
 */
export function arrangeShapesForBass(
  shapes: { shape: ChordShape; baseFret: number }[],
  chord: Chord,
  bassPc: number | null,
  bassLabel: string,
  { maxFret = GUITAR_MAX_FRET, required = essentialPitchClasses(chord) }: { maxFret?: number; required?: Set<number> } = {}
): { shapes: { shape: ChordShape; baseFret: number }[]; bassMatched: boolean } {
  if (bassPc === null) return { shapes, bassMatched: true };
  const matching = shapes.filter((e) => lowestSoundingPitchClass(e) === bassPc);
  if (matching.length > 0) {
    return { shapes: [...matching, ...shapes.filter((e) => !matching.includes(e))], bassMatched: true };
  }
  const tier = (make: (e: { shape: ChordShape; baseFret: number }) => { shape: ChordShape; baseFret: number } | null) =>
    shapes.map(make).filter((e): e is { shape: ChordShape; baseFret: number } => e !== null);
  // Every grip the four ways give (music audit 2, review item 5: the first way
  // alone gave C/G only x x x 0 1 0, and never the bass added under the open C,
  // 3 3 2 0 1 0; nor C/B♭ x 1 2 0 1 0, which only the generator's own
  // fingering finds); the board then orders them (`boardOrder`).
  const found = [
    ...tier((e) => withLowerStringsMuted(e, bassPc, required, bassLabel, maxFret)),
    ...tier((e) => withBassAdded(e, bassPc, bassLabel, maxFret)),
    ...tier((e) => withLowestRefretted(e, bassPc, required, bassLabel, maxFret)),
    ...searchedForBass(chord, bassPc, required, bassLabel, maxFret),
  ].filter((e) => keepsItsAlteration(e, chord)).map(inOpenPositionOrNot);
  if (found.length > 0) return { shapes: [...found, ...shapes], bassMatched: true };
  const searched = searchedAcrossTheNeck(chord, bassPc, required, bassLabel, maxFret).filter((e) => keepsItsAlteration(e, chord));
  if (searched.length > 0) return { shapes: [...searched, ...shapes], bassMatched: true };
  return { shapes, bassMatched: false };
}

// ── A capo (wave 2, stream C) ─────────────────────────────────────────────────
//
// With a capo on fret c a guitarist plays the SHAPES of the chord c half steps
// lower, moved c frets up: B♭ with a capo on 3 is played as the open G shape
// at the capo. So the grips for a chord are the grips of that lower chord
// (the same pipeline, its same order: the nut-closest first becomes the
// capo-closest), each drawn c frets higher; every one is checked again with
// the capo as the nut.

import { preferredRootSpelling, spellIntervalAbove, letterDistance } from '../utils/degreeSpelling';
import { noteToString } from '../types/music';

/**
 * The chord the hand makes under a capo on fret `capo`: `chord` moved DOWN
 * `capo` half steps. Spelled by the engine, never from a semitone count
 * alone: the root takes the name the key picker gives its pitch class (as a
 * major or a minor key, by the chord's third — the open shapes' own names: G,
 * Am, E, D…), and every other tone keeps its letter distance from the root,
 * so the chord's spelling pattern (3rd, 5th, ♭7…) is the same as the
 * original's.
 */
export function chordBelowCapo(chord: Chord, capo: number): Chord {
  if (capo === 0) return chord;
  const rootPc = getPitchClass(chord.root);
  const pcs = new Set(chord.notes.map((n) => getPitchClass(n)));
  const minor = pcs.has((rootPc + 3) % 12) && !pcs.has((rootPc + 4) % 12);
  const root = preferredRootSpelling(rootPc - capo, minor ? 'natural_minor' : 'major');
  const move = (n: Note): Note =>
    spellIntervalAbove(root, letterDistance(chord.root.natural, n.natural) + 1, (getPitchClass(n) - rootPc + 12) % 12);
  const bassNote = chord.bassNote ? move(chord.bassNote) : undefined;
  return {
    ...chord,
    root,
    notes: chord.notes.map(move),
    ...(bassNote ? { bassNote } : {}),
    // A chord the parser built carries its whole name: give it the new root
    // and bass too ("Am(add9)", capo 3 → "F♯m(add9)", never "F♯Am(add9)").
    ...(chord.algorithmicDisplayName ? { algorithmicDisplayName: renameRootAndBass(chord, root, bassNote) } : {}),
  };
}

/** An algorithmic chord's name with `root` (and `bass`) in place of its own. */
function renameRootAndBass(chord: Chord, root: Note, bass: Note | undefined): string {
  let s = chord.algorithmicDisplayName ?? '';
  const oldRoot = noteToString(chord.root);
  if (s.startsWith(oldRoot)) s = noteToString(root) + s.slice(oldRoot.length);
  if (chord.bassNote && bass) {
    const oldBass = `/${noteToString(chord.bassNote)}`;
    if (s.endsWith(oldBass)) s = `${s.slice(0, -oldBass.length)}/${noteToString(bass)}`;
  }
  return s;
}

/**
 * The bass a learner asks for: a slash chord's bass, else the chosen
 * inversion's lowest tone — the ROOT in root position (music audit 2, M43:
 * the inversion chips name a bass for every choice, "Root" included, and the
 * staff and the sound follow it; C augmented seventh's grip with E lowest
 * contradicted "Root"). `label` is what a grip given that bass is called
 * after its shape ("/E"); root position adds none.
 */
function askedBassOf(chord: Chord, inversion: number): { note: Note; label: string } {
  if (chord.bassNote) return { note: chord.bassNote, label: noteToString(chord.bassNote) };
  if (inversion > 0 && chord.notes.length > 0) {
    const note = chord.notes[inversion % chord.notes.length];
    return { note, label: noteToString(note) };
  }
  return { note: chord.root, label: '' };
}

type Placed = { shape: ChordShape; baseFret: number };

/** A grip's absolute frets, 6th string first ("x-3-2-0-1-0"): one grip, one chip. */
const gripFrets = (e: Placed) => e.shape.strings.map((p) => (p.fret === null ? 'x' : e.baseFret + p.fret)).join('-');

/** The first of each grip (by its frets): "Open/A" and "Fret 3/A" were one grip, x 0 0 0 0 0 (review item 3). */
function onePerGrip<T extends Placed>(list: T[]): T[] {
  const seen = new Set<string>();
  return list.filter((e) => {
    const k = gripFrets(e);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** The bass a request asks for, and whether it is a tone of the chord (`boardOrder`). */
type AskedBass = { pc: number; outside: boolean };

/**
 * Whether `bassPc` lies outside the chord's own tones: D/C's C, not C/E's E.
 * A chord the parser built carries a foreign slash bass FIRST in `notes`
 * (`chordFromParsed`); that note is not one of its tones. The root is always
 * one (C/C).
 */
function bassOutsideChord(chord: Chord, bassPc: number): boolean {
  const pcs = chord.notes.map((n) => getPitchClass(n));
  if (bassPc === getPitchClass(chord.root)) return false;
  const prepended = !!chord.bassNote && chord.notes.length > 0 && getPitchClass(chord.notes[0]) === bassPc && !pcs.slice(1).includes(bassPc);
  return !(prepended ? pcs.slice(1) : pcs).includes(bassPc);
}

/**
 * The open position, as the Progression panel's "open grip" has it
 * (`inOpenPositionOrNot`, `hasOpenGrip`): strings sounding at the nut, and
 * every stopped fret at 5 or below. Read from the grip's own frets, so a
 * library shape and a searched grip are judged alike.
 */
function inOpenPosition(e: Placed): boolean {
  const frets = e.shape.strings.map((p) => (p.fret === null ? null : e.baseFret + p.fret));
  return frets.some((f) => f === 0) && frets.every((f) => f === null || f <= 5);
}

/** How many strings sound this pitch class. */
function soundsHowOften(e: Placed, pc: number): number {
  return e.shape.strings.filter((p, s) => p.fret !== null && (OPEN_STRING_MIDI[s] + e.baseFret + p.fret) % 12 === pc).length;
}

/**
 * The board's order (music audit 2, review item 5, and the coordinator's
 * refinement of 19 November), applied to grips of equal standing — every
 * one offered has the asked bass and, but for the second pass's (after the
 * whole ones), every named tone, and a hand can play it:
 *   1. the C- and G-shape major barres after every other grip (as before);
 *   2. for an asked bass that is NOT a tone of the chord, a grip that sounds
 *      it once — as its lowest note — before one that sounds it again higher
 *      up: D/C x 3 0 2 3 2, not x 3 0 2 1 2, which is D7/C to the ear (the
 *      piano voices an outside bass once since this round). A bass that is a
 *      chord tone may be doubled. First among the new rules because it is
 *      about what the chord IS; the rest are about the hand;
 *   3. for an asked bass, a grip in the open position (`inOpenPosition`)
 *      before one that is not: G/D x x 0 0 0 3, not x 5 5 4 3 3; A/C♯
 *      x 4 2 2 2 0, not x 4 2 2 2 5 (the little finger stretched to fret 5).
 *      Before the string count, as the grip a teacher shows first is the open
 *      one, even on four strings;
 *   4. a grip on four strings or more before one on three or fewer;
 *   5. the lowest position first (`lowestFrettedFret`: an all-open grip is 0);
 *   6. for an asked bass (an inversion, a slash chord), at one position more
 *      strings first: C/E 0 3 2 0 1 0 before x x 2 0 1 0, Em/G 3 2 2 0 0 0
 *      before x x x 0 0 0;
 *   7. otherwise as found (hand-made before generated, as before).
 * Rules 2, 3 and 6 are for an asked bass only: in root position the order is
 * the hand-made library's (rule 6 there moved Fmaj7 from x x 3 2 1 0 to the
 * barre 1 3 2 2 1 1, one of the commonest chords). (Weighing how far up the
 * hand reaches was tried: it put the generator's grips with muted inner
 * strings first, G/B x 2 0 0 0 x.)
 */
function boardOrder<T extends Placed>(list: T[], asked: AskedBass | null): T[] {
  const strings = (e: T) => e.shape.strings.filter((p) => p.fret !== null).length;
  const rank = (e: T) => [
    OFFERED_NOT_DEFAULT.has(e.shape.name) ? 1 : 0,
    asked && asked.outside && soundsHowOften(e, asked.pc) > 1 ? 1 : 0,
    asked && !inOpenPosition(e) ? 1 : 0,
    strings(e) <= 3 ? 1 : 0,
    lowestFrettedFret(e),
    asked ? -strings(e) : 0,
  ];
  return list
    .map((e, i) => ({ e, i, r: rank(e) }))
    .sort((a, b) => a.r.reduce((d, x, k) => d || x - b.r[k], 0) || a.i - b.i)
    .map((x) => x.e);
}

/**
 * The grips for `chord` itself (no capo) with every fret at or below
 * `maxFret`, in the board's order, and whether they have the asked bass
 * (`askedBassOf`) as their lowest PITCH (music audit 2, M43): when some grip
 * has it, only those are offered — a learner who asked for C/E is never
 * shown, as C/E, a grip with C lowest (the C shape x 3 2 0 1 0 sits under
 * root position, where it belongs); when none has it, every grip is offered
 * and the board says no shape has that bass.
 *
 * The tone that names the chord (M44, `essentialPitchClasses`) is asked of
 * every grip first, through every way of giving the bass (`arrangeShapesForBass`,
 * its last the generator's search). Only when none gives a grip that sounds it
 * are grips that leave it out considered (the set of release 16), those that
 * sound every tone first; the board then says which tone the grip leaves out
 * (`gripLeavesOut`). The bass the learner chose outranks the extension.
 */
function shapesAt(chord: Chord, inversion: number, maxFret: number): { shapes: Placed[]; bassMatched: boolean } {
  const key = [noteToString(chord.root), chord.quality, chord.notes.map(noteToString).join(' '), chord.bassNote ? noteToString(chord.bassNote) : '', chord.algorithmicDisplayName ?? '', inversion, maxFret].join('|');
  const known = SHAPES_AT.get(key);
  if (known) return { shapes: [...known.shapes], bassMatched: known.bassMatched };
  const found = shapesAtUncached(chord, inversion, maxFret);
  if (SHAPES_AT.size >= SHAPES_AT_MAX) SHAPES_AT.delete(SHAPES_AT.keys().next().value as string);
  SHAPES_AT.set(key, found);
  return { shapes: [...found.shapes], bassMatched: found.bassMatched };
}

/**
 * At most this many grips on the board, the first of its order: every way of
 * giving a bass, the generator's included, gave a slash chord up to 17 chips
 * (C/E) and the teacher tens of thousands of grips to review; a chord's
 * hand-made grips are six at most, so no list of them is cut.
 */
const BOARD_GRIPS = 8;

/**
 * `shapesAt` is pure, and the generator behind it costs milliseconds; a capo
 * asks again for the same chord below it, so the answers are kept (the
 * oldest dropped past SHAPES_AT_MAX). A caller gets its own array.
 */
const SHAPES_AT = new Map<string, { shapes: Placed[]; bassMatched: boolean }>();
const SHAPES_AT_MAX = 20_000;

function shapesAtUncached(chord: Chord, inversion: number, maxFret: number): { shapes: Placed[]; bassMatched: boolean } {
  const asked = askedBassOf(chord, inversion);
  const bassPc = getPitchClass(asked.note);
  const offer = (named: boolean) => {
    const required = essentialPitchClasses(chord, named);
    const sorted = sortShapesForDefault(shapesWithFallback(chord, maxFret, required));
    const arranged = arrangeShapesForBass(sorted, chord, bassPc, asked.label, { maxFret, required });
    return { all: arranged.shapes, matching: arranged.shapes.filter((e) => lowestSoundingPitchClass(e) === bassPc) };
  };
  const bassAsked: AskedBass | null = asked.label !== '' ? { pc: bassPc, outside: bassOutsideChord(chord, bassPc) } : null;
  const strict = offer(true);
  if (strict.matching.length > 0) return { shapes: boardOrder(onePerGrip(strict.matching), bassAsked).slice(0, BOARD_GRIPS), bassMatched: true };
  const relaxed = offer(false);
  if (relaxed.matching.length > 0) {
    const grips = onePerGrip(relaxed.matching);
    const whole = grips.filter((e) => gripLeavesOut(e, chord).length === 0);
    return { shapes: [...boardOrder(whole, bassAsked), ...boardOrder(grips.filter((e) => !whole.includes(e)), bassAsked)].slice(0, BOARD_GRIPS), bassMatched: true };
  }
  return { shapes: boardOrder(onePerGrip(strict.all), bassAsked).slice(0, BOARD_GRIPS), bassMatched: false };
}

/**
 * Every grip the fretboard offers for `chord` (in `inversion`) with a capo on
 * fret `capo`, in order (the first is the default), whether they put the
 * asked bass lowest, and the chord whose shapes they are (`shapesAt`).
 *
 * With a capo the hand makes the shapes of `chordBelowCapo(chord, capo)`: the
 * board offers that chord's grips at no capo, in the same order, each moved
 * `capo` frets up and kept if it is playable with the capo as its nut — so a
 * capo changes where a grip sits, never which comes first (review item 2:
 * reach once filtered the hand-made grips before a bass was found, and F♯m
 * first inversion at capo 6 lost x x x 8 8 8, moved up). Only where none of
 * those fits with the asked bass are the grips sought again within the frets
 * left above the capo (C5 at capo 9: x x 10 12 13 x, M45).
 */
export function chordShapesForCapo(
  chord: Chord,
  inversion: number,
  capo: number
): { shapes: Placed[]; bassMatched: boolean; shapeChord: Chord } {
  const shapeChord = chordBelowCapo(chord, capo);
  const atNut = shapesAt(shapeChord, inversion, GUITAR_MAX_FRET);
  if (capo === 0) return { ...atNut, shapeChord };
  const up = (list: Placed[]) => list
    .map((e) => ({ shape: e.shape, baseFret: e.baseFret + capo }))
    .filter((e) => isPlayableChordShape(e, GUITAR_MAX_FRET, capo));
  const fits = up(atNut.shapes);
  if (fits.length > 0 && atNut.bassMatched) return { shapes: fits, bassMatched: true, shapeChord };
  const near = shapesAt(shapeChord, inversion, GUITAR_MAX_FRET - capo);
  const nearFits = up(near.shapes);
  if (near.bassMatched && nearFits.length > 0) return { shapes: nearFits, bassMatched: true, shapeChord };
  return { shapes: fits.length > 0 ? fits : nearFits, bassMatched: false, shapeChord };
}
