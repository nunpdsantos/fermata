// Universal scale/mode parser - handles ANY valid scale notation
// This parser bypasses AI for scale lookups, providing fast, deterministic results

import { Note, NaturalNote, Accidental, ScaleType, ModeName } from '../types/music';
import { SCALE_TYPE_NAMES } from '../constants/scales';

export interface ParsedScale {
  root: Note;
  scaleType: ScaleType | ModeName;
  isMode: boolean;
}

/**
 * Normalize accidental symbols to standard notation
 */
function normalizeAccidental(acc: string): Accidental {
  if (!acc) return '';
  const normalized = acc.replace(/♯/g, '#').replace(/♭/g, 'b');
  if (normalized === '#' || normalized === 'b' || normalized === '##' || normalized === 'bb') {
    return normalized as Accidental;
  }
  return '';
}

/**
 * Mode names that should use ModeCard
 */
const MODE_NAMES: Record<string, ModeName> = {
  dorian: 'dorian',
  phrygian: 'phrygian',
  lydian: 'lydian',
  mixolydian: 'mixolydian',
  locrian: 'locrian',
  aeolian: 'aeolian',
  ionian: 'ionian',
};

/**
 * Scale types that should use ScaleBlock
 */
const SCALE_TYPES: Record<string, ScaleType> = {
  major: 'major',
  minor: 'natural_minor',
  natural_minor: 'natural_minor',
  'natural minor': 'natural_minor',
  harmonic_minor: 'harmonic_minor',
  'harmonic minor': 'harmonic_minor',
  melodic_minor: 'melodic_minor',
  'melodic minor': 'melodic_minor',
  pentatonic: 'pentatonic_major',
  major_pentatonic: 'pentatonic_major',
  'major pentatonic': 'pentatonic_major',
  pentatonic_major: 'pentatonic_major',
  minor_pentatonic: 'pentatonic_minor',
  'minor pentatonic': 'pentatonic_minor',
  pentatonic_minor: 'pentatonic_minor',
  blues: 'blues',
  chromatic: 'chromatic',
  whole_tone: 'whole_tone',
  'whole tone': 'whole_tone',
  wholetone: 'whole_tone',
  diminished: 'diminished_whole_half',
  diminished_whole_half: 'diminished_whole_half',
  diminished_half_whole: 'diminished_half_whole',
  octatonic: 'diminished_whole_half',
  // Advanced scales (Phase 1)
  // Altered Scale (Super Locrian) - Mode 7 of melodic minor
  altered: 'altered',
  superlocrian: 'altered',
  'super locrian': 'altered',
  super_locrian: 'altered',
  'diminished whole tone': 'altered',
  diminished_whole_tone: 'altered',
  // Lydian Dominant - Mode 4 of melodic minor
  lydian_dominant: 'lydian_dominant',
  'lydian dominant': 'lydian_dominant',
  lydiandominant: 'lydian_dominant',
  'lydian b7': 'lydian_dominant',
  lydian_b7: 'lydian_dominant',
  overtone: 'lydian_dominant',
  'overtone scale': 'lydian_dominant',
  acoustic: 'lydian_dominant',
  'acoustic scale': 'lydian_dominant',
  // Phrygian Dominant - Mode 5 of harmonic minor
  phrygian_dominant: 'phrygian_dominant',
  'phrygian dominant': 'phrygian_dominant',
  phrygiandominant: 'phrygian_dominant',
  spanish: 'phrygian_dominant',
  'spanish phrygian': 'phrygian_dominant',
  spanish_phrygian: 'phrygian_dominant',
  freygish: 'phrygian_dominant',
  jewish: 'phrygian_dominant',
  'jewish scale': 'phrygian_dominant',
  hijaz: 'phrygian_dominant',
  // Major Blues - Major pentatonic with b3
  major_blues: 'major_blues',
  'major blues': 'major_blues',
  majorblues: 'major_blues',
  blues_major: 'major_blues',
  'blues major': 'major_blues',
  // Locrian Natural 2 - Mode 6 of melodic minor
  locrian_natural2: 'locrian_natural2',
  'locrian natural 2': 'locrian_natural2',
  'locrian natural2': 'locrian_natural2',
  'locrian #2': 'locrian_natural2',
  'locrian_#2': 'locrian_natural2',
  'locrian#2': 'locrian_natural2',
  half_diminished: 'locrian_natural2',
  'half diminished': 'locrian_natural2',
  halfdiminished: 'locrian_natural2',
  half_diminished_scale: 'locrian_natural2',
  'half diminished scale': 'locrian_natural2',
  // Phase 2 - Bebop scales
  bebop_dominant: 'bebop_dominant',
  'bebop dominant': 'bebop_dominant',
  bebopdominant: 'bebop_dominant',
  bebop_mixolydian: 'bebop_dominant',
  'bebop mixolydian': 'bebop_dominant',
  dominant_bebop: 'bebop_dominant',
  'dominant bebop': 'bebop_dominant',
  bebop_major: 'bebop_major',
  'bebop major': 'bebop_major',
  bebopmajor: 'bebop_major',
  major_bebop: 'bebop_major',
  'major bebop': 'bebop_major',
  bebop_dorian: 'bebop_dorian',
  'bebop dorian': 'bebop_dorian',
  bebopdorian: 'bebop_dorian',
  bebop_minor: 'bebop_dorian',
  'bebop minor': 'bebop_dorian',
  bebopminor: 'bebop_dorian',
  minor_bebop: 'bebop_dorian',
  'minor bebop': 'bebop_dorian',
  // Phase 2 - Remaining melodic minor modes
  dorian_b2: 'dorian_b2',
  'dorian b2': 'dorian_b2',
  dorianb2: 'dorian_b2',
  dorian_flat2: 'dorian_b2',
  'dorian flat 2': 'dorian_b2',
  'dorian flat2': 'dorian_b2',
  'phrygian_#6': 'dorian_b2',
  'phrygian #6': 'dorian_b2',
  'phrygian#6': 'dorian_b2',
  javanese: 'dorian_b2',
  assyrian: 'dorian_b2',
  lydian_augmented: 'lydian_augmented',
  'lydian augmented': 'lydian_augmented',
  lydianaugmented: 'lydian_augmented',
  'lydian_#5': 'lydian_augmented',
  'lydian #5': 'lydian_augmented',
  'lydian#5': 'lydian_augmented',
  mixolydian_b6: 'mixolydian_b6',
  'mixolydian b6': 'mixolydian_b6',
  mixolydianb6: 'mixolydian_b6',
  mixolydian_flat6: 'mixolydian_b6',
  'mixolydian flat 6': 'mixolydian_b6',
  'mixolydian flat6': 'mixolydian_b6',
  mixolydian_b13: 'mixolydian_b6',
  'mixolydian b13': 'mixolydian_b6',
  mixolydianb13: 'mixolydian_b6',
  hindu: 'mixolydian_b6',
  hindu_scale: 'mixolydian_b6',
  'hindu scale': 'mixolydian_b6',
  aeolian_dominant: 'mixolydian_b6',
  'aeolian dominant': 'mixolydian_b6',
  'aeolian dominant scale': 'mixolydian_b6',
  // Phase 3 - World/Ethnic scales
  // Hungarian
  hungarian_minor: 'hungarian_minor',
  'hungarian minor': 'hungarian_minor',
  hungarianminor: 'hungarian_minor',
  gypsy_minor: 'hungarian_minor',
  'gypsy minor': 'hungarian_minor',
  gypsyminor: 'hungarian_minor',
  double_harmonic_minor: 'hungarian_minor',
  hungarian_major: 'hungarian_major',
  'hungarian major': 'hungarian_major',
  hungarianmajor: 'hungarian_major',
  // Double Harmonic / Byzantine / Arabic
  double_harmonic: 'double_harmonic',
  'double harmonic': 'double_harmonic',
  doubleharmonic: 'double_harmonic',
  // "Double harmonic major" is the full name the L7 lessons use (W9-01).
  double_harmonic_major: 'double_harmonic',
  'double harmonic major': 'double_harmonic',
  byzantine: 'double_harmonic',
  byzantine_scale: 'double_harmonic',
  'byzantine scale': 'double_harmonic',
  arabic: 'double_harmonic',
  arabic_scale: 'double_harmonic',
  'arabic scale': 'double_harmonic',
  gypsy_major: 'double_harmonic',
  'gypsy major': 'double_harmonic',
  gypsymajor: 'double_harmonic',
  hijaz_kar: 'double_harmonic',
  'hijaz kar': 'double_harmonic',
  hijazkar: 'double_harmonic',
  // Persian
  persian: 'persian',
  persian_scale: 'persian',
  'persian scale': 'persian',
  // Neapolitan
  neapolitan_minor: 'neapolitan_minor',
  'neapolitan minor': 'neapolitan_minor',
  neapolitanminor: 'neapolitan_minor',
  neapolitan_major: 'neapolitan_major',
  'neapolitan major': 'neapolitan_major',
  neapolitanmajor: 'neapolitan_major',
  // Japanese
  hirajoshi: 'hirajoshi',
  hirajoshi_scale: 'hirajoshi',
  'hirajoshi scale': 'hirajoshi',
  in_sen: 'in_sen',
  'in sen': 'in_sen',
  insen: 'in_sen',
  iwato: 'iwato',
  iwato_scale: 'iwato',
  'iwato scale': 'iwato',
  // Egyptian
  egyptian: 'egyptian',
  egyptian_scale: 'egyptian',
  'egyptian scale': 'egyptian',
  suspended_pentatonic: 'egyptian',
  'suspended pentatonic': 'egyptian',
  suspendedpentatonic: 'egyptian',
};

/**
 * Parse scale type string to ScaleType or ModeName
 */
function parseScaleType(s: string): { scaleType: ScaleType | ModeName | null; isMode: boolean } {
  const normalized = s.toLowerCase().replace(/[-_]/g, ' ').trim();

  // Check if it's a mode first (modes take priority for ModeCard display)
  if (MODE_NAMES[normalized]) {
    return { scaleType: MODE_NAMES[normalized], isMode: true };
  }

  // Check if it's a regular scale
  if (SCALE_TYPES[normalized]) {
    return { scaleType: SCALE_TYPES[normalized], isMode: false };
  }

  // Try variations with underscores
  const withUnderscores = normalized.replace(/\s+/g, '_');
  if (SCALE_TYPES[withUnderscores]) {
    return { scaleType: SCALE_TYPES[withUnderscores], isMode: false };
  }

  return { scaleType: null, isMode: false };
}

/**
 * Universal scale/mode parser
 * Examples: "C major", "D dorian", "E pentatonic", "F# minor", "Bb mixolydian", "chromatic"
 *
 * @param input The scale/mode to parse (e.g., "C major", "D dorian", "chromatic")
 * @returns ParsedScale object if valid, null if parsing fails
 */
export function parseScaleSymbol(input: string): ParsedScale | null {
  // Input validation
  if (input === null || input === undefined) return null;
  if (typeof input !== 'string') return null;
  if (input.length === 0 || input.length > 100) return null;

  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  // Pattern: root note (optional) + scale/mode name
  // Root: letter A-G, optional accidental (#, b, sharp symbols)
  // Scale: major, minor, dorian, phrygian, lydian, mixolydian, locrian, aeolian, ionian,
  //        pentatonic, major pentatonic, minor pentatonic, blues, chromatic, whole tone, diminished

  // Pattern with root note: "C major", "D# dorian", "Bb minor pentatonic"
  // Extended to include: altered, super locrian, lydian dominant, lydian b7, overtone, acoustic,
  // phrygian dominant, spanish, freygish, jewish, hijaz, major blues, locrian natural 2, half diminished
  // Phase 2: bebop scales, dorian b2, lydian augmented, mixolydian b6, hindu, aeolian dominant
  // Phase 3: hungarian minor/major, double harmonic, byzantine, arabic, persian, neapolitan, hirajoshi, in sen, iwato, egyptian
  const withRootPattern =
    /^([a-g])([#b♯♭]?)[\s-]*(major|minor|natural\s*minor|harmonic\s*minor|melodic\s*minor|dorian|phrygian|lydian|mixolydian|locrian|aeolian|ionian|pentatonic|major\s*pentatonic|minor\s*pentatonic|blues|major\s*blues|chromatic|whole[\s-]?tone|wholetone|diminished|octatonic|altered|super[\s-]?locrian|lydian[\s-]?dominant|lydian[\s-]?b7|overtone|acoustic|phrygian[\s-]?dominant|spanish(?:\s*phrygian)?|freygish|jewish|hijaz|locrian[\s-]?(?:natural[\s-]?2|#2)|half[\s-]?diminished(?:\s*scale)?|bebop[\s-]?dominant|bebop[\s-]?major|bebop[\s-]?dorian|bebop[\s-]?minor|bebop[\s-]?mixolydian|dominant[\s-]?bebop|major[\s-]?bebop|minor[\s-]?bebop|dorian[\s-]?b2|dorian[\s-]?flat[\s-]?2|phrygian[\s-]?#6|javanese|assyrian|lydian[\s-]?augmented|lydian[\s-]?#5|mixolydian[\s-]?b6|mixolydian[\s-]?flat[\s-]?6|mixolydian[\s-]?b13|hindu(?:\s*scale)?|aeolian[\s-]?dominant|hungarian[\s-]?minor|hungarian[\s-]?major|gypsy[\s-]?minor|gypsy[\s-]?major|double[\s-]?harmonic(?:[\s-]?(?:minor|major))?|byzantine(?:\s*scale)?|arabic(?:\s*scale)?|hijaz[\s-]?kar|persian(?:\s*scale)?|neapolitan[\s-]?minor|neapolitan[\s-]?major|hirajoshi(?:\s*scale)?|in[\s-]?sen|iwato(?:\s*scale)?|egyptian(?:\s*scale)?|suspended[\s-]?pentatonic)$/i;

  // Pattern without root note: just the scale/mode name (use C as default)
  // "dorian", "mixolydian", "blues", "chromatic"
  const noRootPattern =
    /^(major|minor|dorian|phrygian|lydian|mixolydian|locrian|aeolian|ionian|pentatonic|major\s*pentatonic|minor\s*pentatonic|blues|major\s*blues|chromatic|whole[\s-]?tone|wholetone|diminished|octatonic|altered|super[\s-]?locrian|lydian[\s-]?dominant|lydian[\s-]?b7|overtone|acoustic|phrygian[\s-]?dominant|spanish(?:\s*phrygian)?|freygish|jewish|hijaz|locrian[\s-]?(?:natural[\s-]?2|#2)|half[\s-]?diminished(?:\s*scale)?|bebop[\s-]?dominant|bebop[\s-]?major|bebop[\s-]?dorian|bebop[\s-]?minor|bebop[\s-]?mixolydian|dominant[\s-]?bebop|major[\s-]?bebop|minor[\s-]?bebop|dorian[\s-]?b2|dorian[\s-]?flat[\s-]?2|phrygian[\s-]?#6|javanese|assyrian|lydian[\s-]?augmented|lydian[\s-]?#5|mixolydian[\s-]?b6|mixolydian[\s-]?flat[\s-]?6|mixolydian[\s-]?b13|hindu(?:\s*scale)?|aeolian[\s-]?dominant|hungarian[\s-]?minor|hungarian[\s-]?major|gypsy[\s-]?minor|gypsy[\s-]?major|double[\s-]?harmonic(?:[\s-]?(?:minor|major))?|byzantine(?:\s*scale)?|arabic(?:\s*scale)?|hijaz[\s-]?kar|persian(?:\s*scale)?|neapolitan[\s-]?minor|neapolitan[\s-]?major|hirajoshi(?:\s*scale)?|in[\s-]?sen|iwato(?:\s*scale)?|egyptian(?:\s*scale)?|suspended[\s-]?pentatonic)$/i;

  let rootLetter = 'C';
  let rootAccidental = '';
  let scaleTypePart = '';

  const withRootMatch = normalized.match(withRootPattern);
  if (withRootMatch) {
    rootLetter = withRootMatch[1].toUpperCase();
    rootAccidental = normalizeAccidental(withRootMatch[2]);
    scaleTypePart = withRootMatch[3].toLowerCase();
  } else {
    const noRootMatch = normalized.match(noRootPattern);
    if (noRootMatch) {
      scaleTypePart = noRootMatch[1].toLowerCase();
    } else {
      return null;
    }
  }

  const { scaleType, isMode } = parseScaleType(scaleTypePart);
  if (!scaleType) return null;

  return {
    root: {
      natural: rootLetter as NaturalNote,
      accidental: rootAccidental as Accidental,
    },
    scaleType,
    isMode,
  };
}

/**
 * Check if a query looks like a scale/mode symbol (not a question/explanation request)
 * Used to determine if we should bypass AI entirely
 *
 * @param query The user's input query
 * @returns true if the query appears to be a scale/mode symbol
 */
export function looksLikeScaleSymbol(query: string): boolean {
  // Input validation
  if (!query || typeof query !== 'string') return false;

  const q = query.trim().toLowerCase();
  if (!q) return false;

  // Should NOT be a question or explanation request at the START
  const questionPatterns = [
    /^what\s/i,
    /^how\s/i,
    /^why\s/i,
    /^explain\s/i,
    /^tell\s/i,
    /^describe\s/i,
    /^compare\s/i,
    /^can\s+you\s/i,
    /^please\s/i,
  ];

  if (questionPatterns.some((p) => p.test(q))) return false;

  // Should be relatively short (scale symbols are compact)
  // Longest realistic: "Bb minor pentatonic" = 18 chars
  if (q.length > 25) return false;

  // Try to parse it - this is the definitive test
  return parseScaleSymbol(q) !== null;
}

/**
 * Extract scale from query with prefixes like "show me", "play", "what is"
 *
 * @param query The user's input query
 * @returns ParsedScale if a scale was found, null otherwise
 */
export function extractScaleFromQuery(query: string): ParsedScale | null {
  // Input validation
  if (!query || typeof query !== 'string') return null;

  const q = query.trim();

  // First, try direct parsing (just the scale/mode symbol)
  const direct = parseScaleSymbol(q);
  if (direct) return direct;

  // Try removing common prefixes
  const prefixPatterns = [
    /^(?:what\s+is\s+(?:a\s+|an\s+|the\s+)?)/i,
    /^(?:show\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?)/i,
    /^(?:play\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?)/i,
    /^(?:explain\s+(?:a\s+|an\s+|the\s+)?)/i,
    /^(?:how\s+(?:do\s+(?:i|you)\s+)?play\s+(?:a\s+|an\s+|the\s+)?)/i,
  ];

  let cleaned = q;
  for (const pattern of prefixPatterns) {
    const match = q.match(pattern);
    if (match) {
      cleaned = q.substring(match[0].length).trim();
      break;
    }
  }

  // Remove trailing "scale" or "mode" or "?"
  cleaned = cleaned
    .replace(/\s+(scale|mode)(\?)?$/i, '')
    .replace(/\?$/, '')
    .trim();

  // Try parsing the cleaned version
  const parsed = parseScaleSymbol(cleaned);
  if (parsed) return parsed;

  return null;
}

/**
 * Format a parsed scale for display
 * @param parsed The parsed scale data
 * @returns A human-readable scale/mode name
 */
export function formatParsedScaleName(parsed: ParsedScale): string {
  const rootStr = `${parsed.root.natural}${parsed.root.accidental}`;

  if (parsed.isMode) {
    // Mode names - capitalize first letter
    const modeName =
      (parsed.scaleType as string).charAt(0).toUpperCase() + (parsed.scaleType as string).slice(1);
    return `${rootStr} ${modeName}`;
  }

  // Scale types - use the display name from SCALE_TYPE_NAMES
  const scaleTypeName = SCALE_TYPE_NAMES[parsed.scaleType as ScaleType] || parsed.scaleType;
  return `${rootStr} ${scaleTypeName}`;
}
