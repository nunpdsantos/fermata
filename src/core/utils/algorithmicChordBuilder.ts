// Algorithmic Chord Builder - Dynamically constructs ANY valid chord symbol
// This system parses chord symbols into components and builds notes using interval math

import { Note, NaturalNote, Accidental, PitchClass } from '../types/music';
import { getSimplestSpelling } from '../constants/notes';

// Interval values in semitones from the root
const INTERVALS: Record<string, number> = {
  // Basic intervals
  R: 0,
  b2: 1,
  '2': 2,
  '#2': 3,
  b3: 3,
  '3': 4,
  '4': 5,
  '#4': 6,
  b5: 6,
  '5': 7,
  '#5': 8,
  b6: 8,
  '6': 9,
  bb7: 9,
  b7: 10,
  '7': 11,
  // Extended intervals (compound - octave + interval)
  b9: 13,
  '9': 14,
  '#9': 15,
  '11': 17,
  '#11': 18,
  b13: 20,
  '13': 21,
};

// Letter distances from root for correct enharmonic spelling
// This ensures we spell chord tones with the correct letter name
const LETTER_DISTANCES: Record<string, number> = {
  R: 0,
  '2': 1,
  b2: 1,
  '#2': 1,
  '3': 2,
  b3: 2,
  '4': 3,
  '#4': 3,
  '5': 4,
  b5: 4,
  '#5': 4,
  '6': 5,
  b6: 5,
  '7': 6,
  b7: 6,
  bb7: 6,
  '9': 1,
  b9: 1,
  '#9': 1, // 9th = 2nd, wraps to letter distance 1
  '11': 3,
  '#11': 3, // 11th = 4th, letter distance 3
  '13': 5,
  b13: 5, // 13th = 6th, letter distance 5
};

// Natural notes in order
const NATURALS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Natural note to pitch class mapping
const NATURAL_TO_PITCH: Record<NaturalNote, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/**
 * Parsed chord symbol components
 */
export interface ParsedChordSymbol {
  root: Note;
  triadQuality: 'major' | 'minor' | 'diminished' | 'augmented';
  seventhType: 'maj7' | 'min7' | 'dom7' | 'dim7' | null;
  extensions: string[]; // ['9', '11', '13']
  alterations: Record<string, 'flat' | 'sharp'>; // { '5': 'flat', '9': 'sharp' }
  suspended: 'sus2' | 'sus4' | null;
  addedTones: string[]; // ['6', '9', '11']
  omittedTones: string[]; // ['3', '5'] for no3, omit5
  bass: Note | null;
}

/**
 * Result from building an algorithmic chord
 */
export interface AlgorithmicChordResult {
  notes: Note[];
  name: string;
  parsed: ParsedChordSymbol;
}

/**
 * Parse a root note string like "C", "F#", "Bb" into a Note object
 */
function parseRootNote(s: string): Note {
  const letter = s[0].toUpperCase() as NaturalNote;
  const accPart = s
    .slice(1)
    .replace(/\u266F/g, '#')
    .replace(/\u266D/g, 'b');
  let acc: Accidental = '';
  if (accPart === '#' || accPart === 'b' || accPart === '##' || accPart === 'bb') {
    acc = accPart as Accidental;
  }
  return { natural: letter, accidental: acc };
}

/**
 * Get pitch class (0-11) for a note
 */
function getPitchClass(note: Note): number {
  // Defensive: default to C (pitch class 0) if natural is invalid (BUG-013 fix)
  let pc = NATURAL_TO_PITCH[note.natural] ?? 0;
  if (note.accidental === '#') pc += 1;
  else if (note.accidental === 'b') pc -= 1;
  else if (note.accidental === '##') pc += 2;
  else if (note.accidental === 'bb') pc -= 2;
  return ((pc % 12) + 12) % 12;
}

/**
 * Get the natural note at a given letter distance from root
 */
function getNaturalAtDistance(root: NaturalNote, distance: number): NaturalNote {
  const rootIndex = NATURALS.indexOf(root);
  // Defensive: if root is invalid, default to C (BUG-013 fix)
  if (rootIndex === -1) return 'C';
  return NATURALS[(rootIndex + distance) % 7];
}

/**
 * Spell a target pitch class on the structural letter. When that letter would
 * need a triple accidental (e.g. the third of a C-double-flat minor chord is
 * E-triple-flat), the letter rule yields and the pitch is respelled
 * enharmonically — same policy as the core chord builder (chords.ts). Before
 * audit W9-28 the fallback returned a single #/b on the structural letter,
 * which changed the PITCH (Cbb minor → Cbb Eb Gbb).
 */
function spellPitchClassOnLetter(targetPC: number, natural: NaturalNote): Note {
  // Defensive: default to C (pitch class 0) if natural is invalid (BUG-013 fix)
  const naturalPC = NATURAL_TO_PITCH[natural] ?? 0;
  const diff = (targetPC - naturalPC + 12) % 12;

  if (diff === 0) return { natural, accidental: '' };
  if (diff === 1) return { natural, accidental: '#' };
  if (diff === 11) return { natural, accidental: 'b' };
  if (diff === 2) return { natural, accidental: '##' };
  if (diff === 10) return { natural, accidental: 'bb' };

  return getSimplestSpelling(targetPC as PitchClass);
}

/**
 * Normalize written words to symbols
 * "G7sharp5flat9" -> "G7#5b9"
 * "Cdiminished7" -> "Cdim7"
 * "Faugmented" -> "Faug"
 */
function normalizeChordInput(input: string): string {
  const s = input.trim();
  if (!s) return s;

  // Preserve case of root note, normalize rest
  const rootMatch = s.match(/^([A-Ga-g])([#b♯♭]?)/);
  if (!rootMatch) return s;

  const root = rootMatch[0].charAt(0).toUpperCase() + rootMatch[0].slice(1).toLowerCase();
  let rest = s.substring(rootMatch[0].length);

  // Convert to lowercase for matching
  rest = rest.toLowerCase();

  // Word to symbol replacements (order matters - longer patterns first)
  const replacements: [RegExp, string][] = [
    // Word numbers to digits (must come FIRST so "sharp nine" -> "sharp 9" -> "#9")
    [/thirteen/g, '13'],
    [/eleven/g, '11'],
    [/nine/g, '9'],
    [/seven/g, '7'],
    [/six/g, '6'],
    [/five/g, '5'],
    [/four/g, '4'],
    [/two/g, '2'],

    // Sharps and flats with numbers
    [/sharp\s*(\d+)/g, '#$1'], // sharp9 -> #9, sharp 11 -> #11
    [/flat\s*(\d+)/g, 'b$1'], // flat9 -> b9, flat 5 -> b5
    [/#\s*(\d+)/g, '#$1'], // # 9 -> #9 (remove space)
    [/b\s*(\d+)/g, 'b$1'], // b 9 -> b9 (remove space)

    // Standalone sharp/flat (for root note extensions)
    [/sharp/g, '#'],
    [/flat/g, 'b'],

    // Quality words
    [/diminished/g, 'dim'],
    [/augmented/g, 'aug'],
    [/dominant/g, ''], // "dominant7" -> "7"
    [/minor/g, 'm'],
    [/major/g, 'maj'],
    [/half\s*dim(inished)?/g, 'ø'],

    // Suspended
    [/suspended\s*4/g, 'sus4'],
    [/suspended\s*2/g, 'sus2'],
    [/sus\s*4/g, 'sus4'],
    [/sus\s*2/g, 'sus2'],

    // Added
    [/added?\s*(\d+)/g, 'add$1'], // add9, added 9 -> add9

    // Remove extra spaces
    [/\s+/g, ''],
  ];

  for (const [pattern, replacement] of replacements) {
    rest = rest.replace(pattern, replacement);
  }

  return root + rest;
}

/**
 * Parse a chord symbol string into its components
 * Examples: "Cmaj7", "Dm7b5", "G7#9", "Fmaj13#11", "Am(add9)", "Bb7sus4", "C/E"
 */
export function parseChordSymbol(symbol: string): ParsedChordSymbol | null {
  // First, normalize the input (convert words like "sharp", "flat" to symbols)
  const normalized = normalizeChordInput(symbol);
  let s = normalized;
  if (!s) return null;

  // Extract bass note if present (slash chord)
  let bass: Note | null = null;
  const slashIndex = s.lastIndexOf('/');
  if (slashIndex > 0) {
    const bassPart = s.substring(slashIndex + 1);
    // Check if it's a bass note (not 6/9 pattern)
    if (/^[A-Ga-g][#b\u266F\u266D]?$/.test(bassPart)) {
      // Make sure we're not matching 6/9
      const beforeSlash = s.substring(0, slashIndex);
      if (!beforeSlash.endsWith('6') || bassPart !== '9') {
        bass = parseRootNote(bassPart);
        s = beforeSlash;
      }
    }
  }

  // Extract root note
  const rootMatch = s.match(/^([A-Ga-g])([#b\u266F\u266D]*)/);
  if (!rootMatch) return null;

  const root = parseRootNote(rootMatch[0]);
  s = s.substring(rootMatch[0].length);

  // Initialize result
  const result: ParsedChordSymbol = {
    root,
    triadQuality: 'major',
    seventhType: null,
    extensions: [],
    alterations: {},
    suspended: null,
    addedTones: [],
    omittedTones: [],
    bass,
  };

  // Normalize the quality string for easier parsing
  // Strip parentheses but keep their content for alterations like 7(#9) -> 7#9
  let q = s
    .replace(/\u266F/g, '#')
    .replace(/\u266D/g, 'b')
    .replace(/\s+/g, '')
    .replace(/[()]/g, ''); // Remove parentheses: C7(#9) -> C7#9

  // Create lowercase version for case-insensitive matching but preserve original for some checks
  const ql = q.toLowerCase();

  // Check for suspended first (affects whether we have a 3rd)
  if (ql.includes('sus4') || (ql.includes('sus') && !ql.includes('sus2'))) {
    result.suspended = 'sus4';
    q = q.replace(/sus4/gi, '').replace(/sus(?![2])/gi, '');
  } else if (ql.includes('sus2')) {
    result.suspended = 'sus2';
    q = q.replace(/sus2/gi, '');
  }

  // Re-create lowercase after modifications
  let qLower = q.toLowerCase();

  // Check for half-diminished first (before other patterns)
  if (
    qLower.includes('\u00F8') ||
    qLower.includes('halfdim') ||
    qLower === 'm7b5' ||
    qLower === 'min7b5' ||
    qLower === '-7b5'
  ) {
    result.triadQuality = 'diminished';
    result.seventhType = 'min7';
    result.alterations['5'] = 'flat';
    q = q.replace(/\u00F8|halfdim(inished)?|m7b5|min7b5|-7b5/gi, '');
    qLower = q.toLowerCase();
  }

  // Check for triad quality markers
  // Minor patterns (check before major to catch 'm' correctly)
  if (qLower.startsWith('min') || (qLower.startsWith('m') && !qLower.startsWith('maj'))) {
    result.triadQuality = 'minor';
    if (qLower.startsWith('minor')) {
      q = q.substring(5);
    } else if (qLower.startsWith('min')) {
      q = q.substring(3);
    } else if (qLower.startsWith('m') && !qLower.startsWith('maj')) {
      q = q.substring(1);
    }
  } else if (qLower.startsWith('dim') || qLower.startsWith('\u00B0') || qLower.startsWith('o')) {
    result.triadQuality = 'diminished';
    if (qLower.startsWith('diminished')) {
      q = q.substring(10);
    } else if (qLower.startsWith('dim')) {
      q = q.substring(3);
    } else {
      q = q.substring(1);
    }
  } else if (qLower.startsWith('aug') || qLower.startsWith('+')) {
    result.triadQuality = 'augmented';
    if (qLower.startsWith('augmented')) {
      q = q.substring(9);
    } else if (qLower.startsWith('aug')) {
      q = q.substring(3);
    } else {
      q = q.substring(1);
    }
  } else if (qLower.startsWith('maj') || q.startsWith('M')) {
    result.triadQuality = 'major';
    // Only consume the prefix when it's purely a triad quality marker.
    // When followed by a digit (7, 9, 11, 13), 'maj'/'M' is part of
    // the seventh type token (e.g., 'maj7' = major 7th) and must be
    // left in q for the 7th type handler below.
    if (qLower.startsWith('major') && !/^major\d/.test(qLower)) {
      q = q.substring(5);
    } else if (qLower.startsWith('maj') && !/^maj\d/.test(qLower)) {
      q = q.substring(3);
    } else if (q.startsWith('M') && !/^M\d/.test(q)) {
      q = q.substring(1);
    }
  }

  qLower = q.toLowerCase();

  // Check for "add" tones (no 7th implied)
  // Handles plain (add9) and altered (add#11, addb9, add#9) variants
  const addMatches = q.match(/add[#b]?\d+/gi);
  if (addMatches) {
    for (const m of addMatches) {
      const tone = m.replace(/add/i, '');
      result.addedTones.push(tone);
    }
    q = q.replace(/add[#b]?\d+/gi, '');
    qLower = q.toLowerCase();
  }

  // Check for omitted tones: no3, omit3, no5, omit5, etc.
  // Common patterns: "no3", "(no3)", "omit3", "omit5"
  const omitMatches = q.match(/(?:no|omit)(\d+)/gi);
  if (omitMatches) {
    for (const m of omitMatches) {
      const num = m.replace(/(?:no|omit)/i, '');
      if (!result.omittedTones.includes(num)) {
        result.omittedTones.push(num);
      }
    }
    q = q.replace(/(?:no|omit)\d+/gi, '');
    qLower = q.toLowerCase();
  }

  // Check for 6 chord (special case - adds 6th, no 7th)
  // Handle 6/9 first
  if (qLower.includes('6/9') || qLower.includes('69')) {
    result.addedTones.push('6', '9');
    q = q.replace(/6\/9|69/gi, '');
    qLower = q.toLowerCase();
  } else if (/^6(?![0-9])/.test(qLower) || /(?<![0-9])6$/.test(qLower)) {
    result.addedTones.push('6');
    q = q.replace(/6/g, '');
    qLower = q.toLowerCase();
  }

  // Check for 7th type
  // Major 7, 9, 11, 13 (maj7, maj9, maj11, maj13 all imply major 7th)
  if (/maj(7|9|11|13)|ma7|M(7|9|11|13)|\u03947|\u0394/i.test(q)) {
    result.seventhType = 'maj7';
    q = q.replace(/maj(?=7|9|11|13)|ma(?=7)|M(?=7|9|11|13)|\u03947|\u0394/gi, '');
  }
  // Check if it's a minor-major 7 (mMaj7, mmaj7, minmaj7)
  else if (
    result.triadQuality === 'minor' &&
    (/maj(7|9|11|13)/i.test(q) || /M(7|9|11|13)/.test(q))
  ) {
    result.seventhType = 'maj7';
    q = q.replace(/maj(?=7|9|11|13)|M(?=7|9|11|13)/gi, '');
  }
  // Check if it's a diminished-major 7 (dimMaj7, dim(maj7)) - rare but valid
  else if (
    result.triadQuality === 'diminished' &&
    (/\(maj7\)|maj7/i.test(q) || /\(M7\)|M7/.test(q))
  ) {
    result.seventhType = 'maj7';
    q = q.replace(/\(?maj7\)?|\(?M7\)?/gi, '');
  }
  // Diminished 7 (for diminished triad with plain 7)
  else if (result.triadQuality === 'diminished' && /7/.test(q) && !result.seventhType) {
    // Check if it's already half-diminished (set above)
    if (!result.alterations['5']) {
      result.seventhType = 'dim7';
    }
    q = q.replace(/7/, '');
  }
  // Generic 7 or extensions that imply 7
  else if (/7|9|11|13/.test(qLower)) {
    if (result.triadQuality === 'minor') {
      result.seventhType = 'min7';
    } else if (result.triadQuality === 'diminished') {
      result.seventhType = 'min7'; // half-diminished by default unless fully diminished specified
    } else {
      result.seventhType = 'dom7';
    }
    q = q.replace(/7(?![0-9])/, '');
  }

  qLower = q.toLowerCase();

  // Check for alterations FIRST (b5, #5, b9, #9, #11, b13)
  // Must check before extensions so "b9" doesn't get split into "b" + "9"
  // Note: Using string patterns instead of RegExp objects to avoid global flag state issues
  const altPatterns: { match: string; replace: RegExp; degree: string; type: 'flat' | 'sharp' }[] =
    [
      { match: '#5', replace: /#5|\+5/g, degree: '5', type: 'sharp' },
      { match: '+5', replace: /#5|\+5/g, degree: '5', type: 'sharp' },
      { match: 'b5', replace: /b5|-5/g, degree: '5', type: 'flat' },
      { match: '-5', replace: /b5|-5/g, degree: '5', type: 'flat' },
      { match: '#9', replace: /#9|\+9/g, degree: '9', type: 'sharp' },
      { match: '+9', replace: /#9|\+9/g, degree: '9', type: 'sharp' },
      { match: 'b9', replace: /b9|-9/g, degree: '9', type: 'flat' },
      { match: '-9', replace: /b9|-9/g, degree: '9', type: 'flat' },
      { match: '#11', replace: /#11|\+11/g, degree: '11', type: 'sharp' },
      { match: '+11', replace: /#11|\+11/g, degree: '11', type: 'sharp' },
      { match: 'b11', replace: /b11|-11/g, degree: '11', type: 'flat' },
      { match: '-11', replace: /b11|-11/g, degree: '11', type: 'flat' },
      { match: '#13', replace: /#13|\+13/g, degree: '13', type: 'sharp' },
      { match: '+13', replace: /#13|\+13/g, degree: '13', type: 'sharp' },
      { match: 'b13', replace: /b13|-13/g, degree: '13', type: 'flat' },
      { match: '-13', replace: /b13|-13/g, degree: '13', type: 'flat' },
    ];

  for (const { match, replace, degree, type } of altPatterns) {
    if (q.includes(match)) {
      result.alterations[degree] = type;
      // If altered extension, make sure it's in the extensions list
      if (['9', '11', '13'].includes(degree) && !result.extensions.includes(degree)) {
        result.extensions.push(degree);
      }
      q = q.replace(replace, '');
    }
  }

  qLower = q.toLowerCase();

  // Check for extensions (9, 11, 13)
  // Match the highest extension - it implies lower ones
  const extMatch = q.match(/(13|11|9)/);
  if (extMatch) {
    const ext = parseInt(extMatch[1]);
    // Higher extensions imply lower ones (only add if not already present from alterations)
    if (ext >= 9 && !result.extensions.includes('9')) result.extensions.push('9');
    if (ext >= 11 && !result.extensions.includes('11')) result.extensions.push('11');
    if (ext >= 13 && !result.extensions.includes('13')) result.extensions.push('13');
    q = q.replace(/(13|11|9)/, '');
    qLower = q.toLowerCase();

    // If we have extensions but no 7th type set yet, set dominant 7
    if (!result.seventhType && result.triadQuality === 'major') {
      result.seventhType = 'dom7';
    }
  }

  // Handle "alt" chord (all tensions altered)
  if (/alt/i.test(q)) {
    result.triadQuality = 'major'; // altered chords have a major 3rd
    result.seventhType = 'dom7';
    result.alterations['5'] = 'flat';
    result.alterations['9'] = 'flat';
    if (!result.extensions.includes('9')) result.extensions.push('9');
  }

  // Trailing '+' means augmented (e.g., C7+ = C aug7)
  // Check after all other parsing so it doesn't conflict with +5/+9/+11/+13
  qLower = q.toLowerCase();
  if (/\+$/.test(q.trim()) && result.triadQuality === 'major') {
    result.triadQuality = 'augmented';
  }

  // Ensure extensions are in ascending order (9, 11, 13).
  // Alterations push their degree before the extension handler runs,
  // so e.g. #11 can end up before 9 in the array.
  const extOrder: Record<string, number> = { '9': 0, '11': 1, '13': 2 };
  result.extensions.sort((a, b) => (extOrder[a] ?? 9) - (extOrder[b] ?? 9));

  return result;
}

/**
 * Build chord notes from a parsed chord symbol
 */
export function buildChordFromParsed(parsed: ParsedChordSymbol): Note[] {
  const intervals: string[] = ['R'];

  // Check if an interval should be omitted
  const isOmitted = (degree: string): boolean => parsed.omittedTones.includes(degree);

  // Add 3rd (or suspended note) - unless omitted
  if (!isOmitted('3')) {
    if (parsed.suspended === 'sus2') {
      intervals.push('2');
    } else if (parsed.suspended === 'sus4') {
      intervals.push('4');
    } else if (parsed.triadQuality === 'minor' || parsed.triadQuality === 'diminished') {
      intervals.push('b3');
    } else {
      intervals.push('3');
    }
  }

  // Add 5th (with alterations) - unless omitted
  if (!isOmitted('5')) {
    if (parsed.alterations['5'] === 'flat' || parsed.triadQuality === 'diminished') {
      intervals.push('b5');
    } else if (parsed.alterations['5'] === 'sharp' || parsed.triadQuality === 'augmented') {
      intervals.push('#5');
    } else {
      intervals.push('5');
    }
  }

  // Add 7th
  if (parsed.seventhType === 'maj7') {
    intervals.push('7');
  } else if (parsed.seventhType === 'min7' || parsed.seventhType === 'dom7') {
    intervals.push('b7');
  } else if (parsed.seventhType === 'dim7') {
    intervals.push('bb7');
  }

  // Add extensions
  for (const ext of parsed.extensions) {
    if (ext === '9') {
      // Skip if sus2 already added the 2nd (same pitch as 9)
      if (intervals.includes('2')) continue;
      const alt = parsed.alterations['9'];
      intervals.push(alt === 'flat' ? 'b9' : alt === 'sharp' ? '#9' : '9');
    } else if (ext === '11') {
      // Skip natural 11 if sus4 already added the 4th (same pitch)
      // Altered 11 (#11) is a different pitch and should still be added
      if (intervals.includes('4') && parsed.alterations['11'] !== 'sharp') continue;
      const alt = parsed.alterations['11'];
      intervals.push(alt === 'sharp' ? '#11' : '11');
    } else if (ext === '13') {
      const alt = parsed.alterations['13'];
      intervals.push(alt === 'flat' ? 'b13' : '13');
    }
  }

  // Add "add" tones (plain: "9", altered: "#11", "b9", "#9")
  for (const add of parsed.addedTones) {
    if (add === '6' && !intervals.includes('6')) intervals.push('6');
    else if (add === '2' && !intervals.includes('2')) intervals.push('2');
    else if (add === '4' && !intervals.includes('4')) intervals.push('4');
    else if (/^[#b]?\d+$/.test(add)) {
      // Determine the interval name (e.g., "9", "b9", "#11")
      const interval = add.startsWith('#') || add.startsWith('b') ? add : add;
      if (!intervals.includes(interval)) intervals.push(interval);
    }
  }

  // Build notes from intervals
  return buildNotesFromIntervals(parsed.root, intervals);
}

/**
 * Build actual Note objects from root and interval list
 */
function buildNotesFromIntervals(root: Note, intervalNames: string[]): Note[] {
  const notes: Note[] = [];
  const rootPitchClass = getPitchClass(root);

  for (const intervalName of intervalNames) {
    const semitones = INTERVALS[intervalName];
    const letterDistance = LETTER_DISTANCES[intervalName];

    if (semitones === undefined || letterDistance === undefined) continue;

    // Get target natural note (correct letter name)
    const targetNatural = getNaturalAtDistance(root.natural, letterDistance);

    // Calculate target pitch class
    const targetPitchClass = (rootPitchClass + semitones) % 12;

    // Spell on the structural letter (respelled if out of accidental range)
    notes.push(spellPitchClassOnLetter(targetPitchClass, targetNatural));
  }

  return notes;
}

/**
 * Format a parsed chord symbol into a display name
 */
export function formatChordName(parsed: ParsedChordSymbol): string {
  let name = `${parsed.root.natural}${parsed.root.accidental || ''}`;

  // Add triad quality
  if (parsed.triadQuality === 'minor') name += 'm';
  else if (parsed.triadQuality === 'diminished') name += 'dim';
  else if (parsed.triadQuality === 'augmented') name += 'aug';

  // Add 7th
  if (parsed.seventhType === 'maj7') {
    if (parsed.triadQuality === 'minor') {
      name += 'Maj7'; // mMaj7
    } else {
      name += 'maj7';
    }
  } else if (parsed.seventhType === 'min7' && parsed.triadQuality !== 'minor') {
    name += 'm7';
  } else if (parsed.seventhType === 'dom7') {
    name += '7';
  } else if (parsed.seventhType === 'dim7') {
    name += '7'; // dim7 is implied for diminished
  } else if (parsed.seventhType === 'min7' && parsed.triadQuality === 'minor') {
    name += '7';
  }

  // Replace 7 with highest NATURAL extension (not altered ones)
  // G7b9 should stay "G7b9", not become "G9b9"
  // G9#5 should become "G9#5" (9 is natural)
  if (parsed.extensions.includes('13') && !parsed.alterations['13']) {
    name = name.replace(/7$/, '13');
  } else if (parsed.extensions.includes('11') && !parsed.alterations['11']) {
    name = name.replace(/7$/, '11');
  } else if (parsed.extensions.includes('9') && !parsed.alterations['9']) {
    name = name.replace(/7$/, '9');
  }

  // Add alterations
  for (const [degree, type] of Object.entries(parsed.alterations)) {
    name += type === 'flat' ? `b${degree}` : `#${degree}`;
  }

  // Add suspension
  if (parsed.suspended) {
    name += parsed.suspended;
  }

  // Add added tones
  for (const add of parsed.addedTones) {
    if (add === '6') {
      // Check if also has 9 for 6/9
      if (parsed.addedTones.includes('9')) {
        if (!name.includes('6/9')) {
          name += '6/9';
        }
      } else {
        name += '6';
      }
    } else if (add !== '9' || !parsed.addedTones.includes('6')) {
      // Don't add 9 separately if we have 6/9
      name += `(add${add})`;
    }
  }

  // Add omitted tones
  for (const omit of parsed.omittedTones) {
    name += `(no${omit})`;
  }

  // Add bass note
  if (parsed.bass) {
    name += `/${parsed.bass.natural}${parsed.bass.accidental || ''}`;
  }

  return name;
}

/**
 * Main entry point - try to build any chord from a symbol string
 * Returns null if the symbol cannot be parsed
 */
export function buildAlgorithmicChord(symbol: string): AlgorithmicChordResult | null {
  const parsed = parseChordSymbol(symbol);
  if (!parsed) return null;

  const notes = buildChordFromParsed(parsed);
  const name = formatChordName(parsed);

  return { notes, name, parsed };
}

/**
 * Check if a string looks like it could be a chord symbol
 * Used to determine if we should try algorithmic parsing
 */
export function looksLikeAlgorithmicChord(s: string): boolean {
  const trimmed = s.trim();

  // Must start with a note letter
  if (!/^[A-Ga-g]/.test(trimmed)) return false;

  // Should not contain question words or sentence-like patterns
  if (/\s+(is|are|the|a|an)\s+/i.test(trimmed)) return false;

  // Check if this looks like a written-word chord (e.g., "G7sharp5b11", "E flat major 9")
  const chordWordPattern = /\b(sharp|flat|diminished|augmented|minor|major|dominant|sus|add)\b/i;
  const hasChordWords = chordWordPattern.test(trimmed);

  // For written-word chords, allow longer strings
  if (hasChordWords) {
    if (trimmed.length > 40) return false;
  } else {
    // Should be relatively compact for symbol notation
    if (trimmed.length > 25) return false;
  }

  // Try to parse it
  return parseChordSymbol(trimmed) !== null;
}

/**
 * Get interval labels for an algorithmically-built chord
 * Useful for displaying interval information on the chord card
 */
export function getAlgorithmicChordIntervalLabels(parsed: ParsedChordSymbol): string[] {
  const labels: string[] = ['R'];

  // Check if an interval should be omitted
  const isOmitted = (degree: string): boolean => parsed.omittedTones.includes(degree);

  // 3rd or suspension - unless omitted
  if (!isOmitted('3')) {
    if (parsed.suspended === 'sus2') {
      labels.push('2');
    } else if (parsed.suspended === 'sus4') {
      labels.push('4');
    } else if (parsed.triadQuality === 'minor' || parsed.triadQuality === 'diminished') {
      labels.push('b3');
    } else {
      labels.push('3');
    }
  }

  // 5th - unless omitted
  if (!isOmitted('5')) {
    if (parsed.alterations['5'] === 'flat' || parsed.triadQuality === 'diminished') {
      labels.push('b5');
    } else if (parsed.alterations['5'] === 'sharp' || parsed.triadQuality === 'augmented') {
      labels.push('#5');
    } else {
      labels.push('5');
    }
  }

  // 7th
  if (parsed.seventhType === 'maj7') {
    labels.push('7');
  } else if (parsed.seventhType === 'min7' || parsed.seventhType === 'dom7') {
    labels.push('b7');
  } else if (parsed.seventhType === 'dim7') {
    labels.push('bb7');
  }

  // Extensions
  for (const ext of parsed.extensions) {
    if (ext === '9') {
      if (labels.includes('2')) continue; // sus2 already covers this pitch
      const alt = parsed.alterations['9'];
      labels.push(alt === 'flat' ? 'b9' : alt === 'sharp' ? '#9' : '9');
    } else if (ext === '11') {
      if (labels.includes('4') && parsed.alterations['11'] !== 'sharp') continue; // sus4
      const alt = parsed.alterations['11'];
      labels.push(alt === 'sharp' ? '#11' : '11');
    } else if (ext === '13') {
      const alt = parsed.alterations['13'];
      labels.push(alt === 'flat' ? 'b13' : '13');
    }
  }

  // Added tones (plain: "9", altered: "#11", "b9", "#9")
  for (const add of parsed.addedTones) {
    if (add === '6') labels.push('6');
    else if (add === '2' && parsed.suspended !== 'sus2') labels.push('2');
    else if (add === '4' && parsed.suspended !== 'sus4') labels.push('4');
    else if (/^[#b]?\d+$/.test(add)) {
      if (!labels.includes(add)) labels.push(add);
    }
  }

  return labels;
}
