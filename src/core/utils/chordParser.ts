// Universal chord parser - handles ANY valid chord notation
// This parser bypasses AI for chord lookups, providing fast, deterministic results
// Falls back to algorithmic chord builder for complex chords not in the explicit quality list

import { Note, NaturalNote, Accidental, ChordQuality, Chord } from '../types/music';
import { buildChord } from '../constants/chords';
import { getPitchClass } from '../constants/notes';
import {
  buildAlgorithmicChord,
  getAlgorithmicChordIntervalLabels,
  ParsedChordSymbol,
} from './algorithmicChordBuilder';

export interface ParsedChord {
  root: Note;
  quality: ChordQuality;
  bassNote?: Note; // For slash chords
  // Algorithmic chord data (when quality is 'algorithmic')
  algorithmicNotes?: Note[];
  algorithmicDisplayName?: string;
  algorithmicIntervalLabels?: string[];
  algorithmicParsed?: ParsedChordSymbol;
}

// Special marker type for algorithmic chords
// This extends ChordQuality conceptually but is handled specially in the system
export type ExtendedChordQuality = ChordQuality | 'algorithmic';

/**
 * Materialize a ParsedChord into a playable/selectable Chord: algorithmic
 * notes win when present, otherwise the quality formula builds the notes; a
 * slash-chord bass is prepended when its pitch class is not already present.
 * Single source for QuickSearch and the Try-This query executor.
 */
export function chordFromParsed(parsed: ParsedChord): Chord {
  const chord: Chord =
    parsed.algorithmicNotes && parsed.algorithmicNotes.length > 0
      ? { root: parsed.root, quality: parsed.quality, notes: parsed.algorithmicNotes }
      : buildChord(parsed.root, parsed.quality);
  if (parsed.algorithmicDisplayName) {
    chord.algorithmicDisplayName = parsed.algorithmicDisplayName;
  }
  if (parsed.algorithmicIntervalLabels) {
    chord.algorithmicIntervalLabels = parsed.algorithmicIntervalLabels;
  }
  if (parsed.bassNote) {
    chord.bassNote = parsed.bassNote;
    const bassPc = getPitchClass(parsed.bassNote);
    if (!chord.notes.some((n) => getPitchClass(n) === bassPc)) {
      chord.notes = [parsed.bassNote, ...chord.notes];
    }
  }
  return chord;
}

/**
 * Normalize accidental symbols to standard notation
 * Supports single and double accidentals: #, b, ##, bb
 */
function normalizeAccidental(acc: string): Accidental {
  if (!acc) return '';
  const normalized = acc
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b')
    .replace(/𝄪/g, '##')
    .replace(/𝄫/g, 'bb');
  if (normalized === '#' || normalized === 'b' || normalized === '##' || normalized === 'bb') {
    return normalized as Accidental;
  }
  return '';
}

/**
 * Parse the quality string portion of a chord symbol
 * Returns the ChordQuality or null if unrecognized
 */
function parseQualityString(q: string): ChordQuality | null {
  // Strip spaces and normalize unicode accidentals BEFORE lowercasing
  // so we can check case-sensitive patterns (M, M7, Δ, Δ7, etc.) first.
  const raw = q.replace(/\s+/g, '').replace(/♯/g, '#').replace(/♭/g, 'b');

  // === Case-sensitive checks (M = major, Δ = major) ===
  // These MUST run before lowercasing, because M → m would match minor.
  if (raw === 'M') return 'major';
  if (raw === 'M7' || raw === 'Δ7' || raw === 'Δ') return 'major7';
  if (raw === 'M9' || raw === 'Δ9') return 'major9';
  if (raw === 'M11' || raw === 'Δ11') return 'major11';
  if (raw === 'M13' || raw === 'Δ13') return 'major13';
  if (raw === 'M7#11' || raw === 'M7(#11)' || raw === 'Δ7#11') return 'major7sharp11';
  if (raw === 'M7b5') return 'major7flat5';
  if (raw === 'M7#5' || raw === '+M7') return 'augmented_major7';
  // Minor-major hybrids that use uppercase M
  if (raw === 'mM7' || raw === '-M7') return 'minor_major7';
  if (raw === 'dimM7' || raw === 'dim(M7)') return 'diminished_major7';

  // Now lowercase for case-insensitive matching
  const s = raw.toLowerCase();

  // Empty = major triad
  if (s === '' || s === 'maj' || s === 'major') return 'major';

  // Order matters - check longer/more specific patterns first!

  // === MINOR-MAJOR 7 (must check before minor 7) ===
  // Patterns: mMaj7, m(maj7), minmaj7, mmaj7, -maj7, -M7, m/maj7
  if (
    /^m(in)?(or)?\(?maj7?\)?$/.test(s) ||
    s === 'mm7' ||
    s === 'mmaj7' ||
    s === '-maj7' ||
    s === '-m7' ||
    s === 'm/maj7' ||
    s === 'minmaj7' ||
    s === 'minormajor7' ||
    s === 'm(maj7)' ||
    s === 'min(maj7)' ||
    s === 'minor(maj7)'
  ) {
    return 'minor_major7';
  }

  // === HALF-DIMINISHED (m7b5) ===
  // Must check before m7 and dim patterns
  if (
    s === 'm7b5' ||
    s === 'min7b5' ||
    s === 'minor7b5' ||
    s === 'm7♭5' ||
    s === '-7b5' ||
    s === 'min7♭5' ||
    s === 'ø' ||
    s === 'ø7' ||
    s === 'o/' ||
    s === 'o/7' ||
    s === 'halfdim' ||
    s === 'halfdim7' ||
    s === 'halfdiminished' ||
    s === 'halfdiminished7'
  ) {
    return 'half_diminished7';
  }

  // === DIMINISHED MAJOR 7 (rare - diminished triad + major 7th) ===
  // Must check before diminished 7 and diminished triad
  if (
    s === 'dim(maj7)' ||
    s === 'dimmaj7' ||
    s === '°maj7' ||
    s === '°(maj7)' ||
    s === 'omaj7' ||
    s === 'o(maj7)' ||
    s === 'diminished(maj7)' ||
    s === 'diminishedmaj7' ||
    s === 'diminishedmajor7'
  ) {
    return 'diminished_major7';
  }

  // === DIMINISHED 7 (fully diminished) ===
  if (s === 'dim7' || s === '°7' || s === 'o7' || s === 'diminished7') {
    return 'diminished7';
  }

  // === DIMINISHED TRIAD ===
  if (s === 'dim' || s === '°' || s === 'o' || s === 'diminished') {
    return 'diminished';
  }

  // === AUGMENTED MAJOR 7 ===
  if (
    s === 'augmaj7' ||
    s === '+maj7' ||
    s === 'maj7#5' ||
    s === 'augmentedmajor7' ||
    s === 'maj7+'
  ) {
    return 'augmented_major7';
  }

  // === AUGMENTED 7 (dominant) ===
  if (s === 'aug7' || s === '+7' || s === '7#5' || s === '7+5' || s === 'augmented7') {
    return 'augmented7';
  }

  // === AUGMENTED TRIAD ===
  if (s === 'aug' || s === '+' || s === 'augmented') {
    return 'augmented';
  }

  // === MAJOR 7 FLAT 5 ===
  if (s === 'maj7b5' || s === 'maj7♭5' || s === 'major7b5' || s === 'major7flat5') {
    return 'major7flat5';
  }

  // === MAJOR 7 VARIATIONS ===
  if (s === 'maj7' || s === 'delta7' || s === 'major7' || s === 'ma7') {
    return 'major7';
  }
  if (s === 'maj9' || s === 'delta9' || s === 'major9') return 'major9';
  if (s === 'maj11' || s === 'delta11' || s === 'major11') return 'major11';
  if (s === 'maj13' || s === 'delta13' || s === 'major13') return 'major13';

  // === MAJOR 7 #11 (Lydian chord) ===
  if (s === 'maj7#11' || s === 'major7#11' || s === 'maj7(#11)' || s === 'major7sharp11') {
    return 'major7sharp11';
  }

  // === MINOR VARIATIONS ===
  if (s === 'm' || s === 'min' || s === 'minor' || s === '-') return 'minor';
  if (s === 'm7' || s === 'min7' || s === 'minor7' || s === '-7' || s === 'mi7') return 'minor7';
  if (s === 'm9' || s === 'min9' || s === 'minor9' || s === '-9') return 'minor9';
  if (s === 'm11' || s === 'min11' || s === 'minor11' || s === '-11') return 'minor11';
  if (s === 'm13' || s === 'min13' || s === 'minor13' || s === '-13') return 'minor13';
  if (s === 'm6' || s === 'min6' || s === 'minor6' || s === '-6') return 'minor6';
  if (s === 'm6/9' || s === 'm69' || s === 'min69' || s === 'minor69') return 'minor_six_nine';

  // === DOMINANT 7 AND EXTENSIONS ===
  if (s === '7' || s === 'dom7' || s === 'dominant7') return 'dominant7';
  if (s === '9' || s === 'dom9' || s === 'dominant9') return 'dominant9';
  if (s === '11' || s === 'dom11' || s === 'dominant11') return 'dominant11';
  if (s === '13' || s === 'dom13' || s === 'dominant13') return 'dominant13';

  // === ALTERED DOMINANTS ===
  // Support both plain and parenthetical notation: 7b9, 7(b9), 7(♭9)
  if (
    s === '7b9' ||
    s === '7♭9' ||
    s === '7(b9)' ||
    s === '7(♭9)' ||
    s === 'dom7b9' ||
    s === 'dominant7b9' ||
    s === 'dominant7flat9'
  ) {
    return 'dominant7flat9';
  }
  if (
    s === '7#9' ||
    s === '7♯9' ||
    s === '7(#9)' ||
    s === '7(♯9)' ||
    s === 'dom7#9' ||
    s === 'dominant7#9' ||
    s === 'dominant7sharp9'
  ) {
    return 'dominant7sharp9';
  }
  if (
    s === '7b5' ||
    s === '7♭5' ||
    s === '7(b5)' ||
    s === '7(♭5)' ||
    s === 'dom7b5' ||
    s === 'dominant7b5' ||
    s === 'dominant7flat5'
  ) {
    return 'dominant7flat5';
  }
  if (
    s === '7#5' ||
    s === '7♯5' ||
    s === '7(#5)' ||
    s === '7(♯5)' ||
    s === 'dom7#5' ||
    s === 'dominant7#5' ||
    s === 'dominant7sharp5'
  ) {
    return 'dominant7sharp5';
  }
  if (s === '7alt' || s === 'alt' || s === 'alt7' || s === 'altered' || s === 'dominant7alt') {
    return 'dominant7alt';
  }
  if (
    s === '9#11' ||
    s === '9♯11' ||
    s === '9(#11)' ||
    s === '9(♯11)' ||
    s === 'dom9#11' ||
    s === 'dominant9#11' ||
    s === 'dominant9sharp11'
  ) {
    return 'dominant9sharp11';
  }
  if (
    s === '13b9' ||
    s === '13♭9' ||
    s === '13(b9)' ||
    s === '13(♭9)' ||
    s === 'dom13b9' ||
    s === 'dominant13b9' ||
    s === 'dominant13flat9'
  ) {
    return 'dominant13flat9';
  }

  // === COMBINATION ALTERED DOMINANTS ===
  // 7#5b9 - augmented dominant with flat 9
  if (
    s === '7#5b9' ||
    s === '7♯5♭9' ||
    s === '7(#5)(b9)' ||
    s === '7#5(b9)' ||
    s === '7(#5)b9' ||
    s === 'aug7b9' ||
    s === '+7b9' ||
    s === 'dominant7#5b9' ||
    s === 'dominant7sharp5flat9'
  ) {
    return 'dominant7sharp5flat9';
  }
  // 7b5b9 - flat 5 dominant with flat 9
  if (
    s === '7b5b9' ||
    s === '7♭5♭9' ||
    s === '7(b5)(b9)' ||
    s === '7b5(b9)' ||
    s === '7(b5)b9' ||
    s === 'dominant7b5b9' ||
    s === 'dominant7flat5flat9'
  ) {
    return 'dominant7flat5flat9';
  }
  // 7#5#9 - augmented dominant with sharp 9
  if (
    s === '7#5#9' ||
    s === '7♯5♯9' ||
    s === '7(#5)(#9)' ||
    s === '7#5(#9)' ||
    s === '7(#5)#9' ||
    s === 'aug7#9' ||
    s === '+7#9' ||
    s === 'dominant7#5#9' ||
    s === 'dominant7sharp5sharp9'
  ) {
    return 'dominant7sharp5sharp9';
  }
  // 7b5#9 - flat 5 dominant with sharp 9
  if (
    s === '7b5#9' ||
    s === '7♭5♯9' ||
    s === '7(b5)(#9)' ||
    s === '7b5(#9)' ||
    s === '7(b5)#9' ||
    s === 'dominant7b5#9' ||
    s === 'dominant7flat5sharp9'
  ) {
    return 'dominant7flat5sharp9';
  }

  // === SUSPENDED ===
  if (s === 'sus' || s === 'sus4') return 'sus4';
  if (s === 'sus2') return 'sus2';
  if (s === '7sus4' || s === '7sus' || s === 'dom7sus4' || s === 'dominant7sus4')
    return 'dominant7sus4';
  if (s === '9sus4' || s === '9sus' || s === 'dom9sus4' || s === 'dominant9sus4')
    return 'dominant9sus4';
  if (s === 'sus2sus4' || s === 'sus24' || s === 'sus2/4') return 'sus2sus4';

  // === ADDED TONES ===
  if (s === 'add9' || s === 'add2' || s === '(add9)' || s === '2') return 'add9';
  if (s === 'add11' || s === '(add11)') return 'add11';
  if (s === '6' || s === 'maj6' || s === 'major6') return 'major6';
  if (s === '6/9' || s === '69' || s === 'sixnine') return 'six_nine';

  // === POWER CHORD ===
  if (s === '5' || s === 'power' || s === 'powerchord') return 'power';

  return null;
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
  const rootMatch = s.match(/^([A-Ga-g])([#b♯♭]?)/i);
  if (!rootMatch) return s;

  const root = rootMatch[0].charAt(0).toUpperCase() + rootMatch[0].slice(1).toLowerCase();
  let rest = s.substring(rootMatch[0].length);

  // Normalize written words to symbols (case-insensitive replacements)
  // Apply replacements (order matters - longer patterns first)
  rest = rest
    .replace(/sharp\s*(\d+)/gi, '#$1') // sharp9 -> #9
    .replace(/flat\s*(\d+)/gi, 'b$1') // flat9 -> b9
    .replace(/#\s*(\d+)/g, '#$1') // # 9 -> #9
    .replace(/b\s*(\d+)/g, 'b$1') // b 9 -> b9
    .replace(/sharp/gi, '#')
    .replace(/flat/gi, 'b')
    .replace(/diminished/gi, 'dim')
    .replace(/augmented/gi, 'aug')
    .replace(/dominant/gi, '') // dominant7 -> 7
    .replace(/minor/gi, 'm')
    .replace(/major/gi, 'maj')
    .replace(/half\s*dim(inished)?/gi, 'ø')
    .replace(/suspended\s*(\d)/gi, 'sus$1')
    .replace(/sus\s*(\d)/gi, 'sus$1')
    .replace(/added?\s*(\d+)/gi, 'add$1')
    .replace(/\s+/g, '');

  return root + rest;
}

/**
 * Universal chord parser - handles ANY valid chord notation
 * Examples: C, Cm, Cmaj7, C7b9, Cm7b5, Cdim7, Caug, C/E, Cmaj7/G, C6/9, Cm(maj7), C7#9#11, etc.
 *
 * @param input The chord symbol to parse (e.g., "Cmaj7", "F#m7b5", "Bb/D")
 * @returns ParsedChord object if valid, null if parsing fails
 */
export function parseChordSymbol(input: string): ParsedChord | null {
  // Input validation
  if (input === null || input === undefined) return null;
  if (typeof input !== 'string') return null;
  if (input.length === 0 || input.length > 50) return null;

  // First, normalize the input (convert words like "sharp", "flat" to symbols)
  const normalized = normalizeChordInput(input);
  if (!normalized) return null;

  // Handle slash chords first - split on last /
  let chordPart = normalized;
  let bassPart: string | null = null;

  const slashIndex = normalized.lastIndexOf('/');
  if (slashIndex > 0) {
    const afterSlash = normalized.substring(slashIndex + 1);
    // Check if it's a bass note (single letter + optional accidental, including double)
    // Must NOT match chord qualities like 6/9
    if (/^[A-Ga-g][#b♯♭𝄪𝄫]{0,2}$/u.test(afterSlash)) {
      // But also check it's not part of 6/9 pattern
      const beforeSlash = normalized.substring(0, slashIndex);
      if (!/6$/.test(beforeSlash) || afterSlash !== '9') {
        chordPart = beforeSlash;
        bassPart = afterSlash;
      }
    }
  }

  // Parse the main chord part
  // Pattern: letter + optional accidental (single or double) + quality
  // Supports: C, C#, Cb, C##, Cbb, and unicode variants
  const chordRegex = /^([A-Ga-g])([#b♯♭𝄪𝄫]{0,2})(.*)$/u;
  const match = chordPart.match(chordRegex);
  if (!match) return null;

  const rootLetter = match[1].toUpperCase() as NaturalNote;
  const rootAccidental = normalizeAccidental(match[2]);
  const qualityPart = match[3].trim();

  // Validate root letter
  if (!['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(rootLetter)) {
    return null;
  }

  // Parse the quality
  const quality = parseQualityString(qualityPart);

  // If explicit quality found, use it
  if (quality) {
    const result: ParsedChord = {
      root: { natural: rootLetter, accidental: rootAccidental },
      quality,
    };

    // Parse bass note if present
    if (bassPart) {
      const bassLetter = bassPart[0].toUpperCase() as NaturalNote;
      const bassAccidental = normalizeAccidental(bassPart.slice(1));

      if (!['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(bassLetter)) {
        return null;
      }

      result.bassNote = { natural: bassLetter, accidental: bassAccidental };
    }

    return result;
  }

  // If no explicit quality match, try algorithmic chord builder
  // This handles complex chords like Cmaj7#11, G7b9#11, Dm9b5, etc.
  const algorithmicResult = buildAlgorithmicChord(normalized);
  if (algorithmicResult) {
    const result: ParsedChord = {
      root: algorithmicResult.parsed.root,
      // Use 'major' as fallback quality for type compatibility
      // The actual notes come from algorithmicNotes
      quality: mapAlgorithmicToExplicitQuality(algorithmicResult.parsed),
      algorithmicNotes: algorithmicResult.notes,
      algorithmicDisplayName: algorithmicResult.name,
      algorithmicIntervalLabels: getAlgorithmicChordIntervalLabels(algorithmicResult.parsed),
      algorithmicParsed: algorithmicResult.parsed,
    };

    // Add bass note if present
    if (algorithmicResult.parsed.bass) {
      result.bassNote = algorithmicResult.parsed.bass;
    }

    return result;
  }

  return null;
}

/**
 * Map algorithmic chord parsing to the closest explicit ChordQuality
 * Used for type compatibility while the actual notes come from algorithmicNotes
 */
function mapAlgorithmicToExplicitQuality(parsed: ParsedChordSymbol): ChordQuality {
  const { triadQuality, seventhType, suspended, addedTones, alterations, extensions } = parsed;

  // Suspended chords
  if (suspended === 'sus2') return 'sus2';
  if (suspended === 'sus4') {
    if (seventhType === 'dom7') {
      if (extensions.includes('9')) return 'dominant9sus4';
      return 'dominant7sus4';
    }
    return 'sus4';
  }

  // 6th chords
  if (addedTones.includes('6') && !seventhType) {
    if (addedTones.includes('9')) {
      return triadQuality === 'minor' ? 'minor_six_nine' : 'six_nine';
    }
    return triadQuality === 'minor' ? 'minor6' : 'major6';
  }

  // Add chords
  if (!seventhType && addedTones.includes('9') && !addedTones.includes('6')) return 'add9';
  if (!seventhType && addedTones.includes('11')) return 'add11';

  // No 7th - triads
  if (!seventhType && extensions.length === 0) {
    if (triadQuality === 'minor') return 'minor';
    if (triadQuality === 'diminished') return 'diminished';
    if (triadQuality === 'augmented') return 'augmented';
    return 'major';
  }

  // 7th chords
  if (seventhType === 'maj7') {
    if (triadQuality === 'minor') return 'minor_major7';
    if (triadQuality === 'diminished') return 'diminished_major7';
    if (triadQuality === 'augmented') return 'augmented_major7';
    if (alterations['5'] === 'flat') return 'major7flat5';
    if (extensions.includes('13')) return 'major13';
    if (extensions.includes('11')) return 'major11';
    if (extensions.includes('9')) return 'major9';
    return 'major7';
  }

  if (seventhType === 'min7') {
    if (triadQuality === 'diminished' || alterations['5'] === 'flat') return 'half_diminished7';
    if (extensions.includes('13')) return 'minor13';
    if (extensions.includes('11')) return 'minor11';
    if (extensions.includes('9')) return 'minor9';
    return 'minor7';
  }

  if (seventhType === 'dim7') return 'diminished7';

  if (seventhType === 'dom7') {
    // Altered dominants
    if (alterations['5'] === 'flat' && alterations['9'] === 'flat') return 'dominant7alt';
    if (alterations['5'] === 'flat') return 'dominant7flat5';
    if (alterations['5'] === 'sharp' || triadQuality === 'augmented') return 'dominant7sharp5';
    if (alterations['9'] === 'flat') {
      if (extensions.includes('13')) return 'dominant13flat9';
      return 'dominant7flat9';
    }
    if (alterations['9'] === 'sharp') return 'dominant7sharp9';
    if (alterations['11'] === 'sharp') return 'dominant9sharp11';

    // Extended dominants
    if (extensions.includes('13')) return 'dominant13';
    if (extensions.includes('11')) return 'dominant11';
    if (extensions.includes('9')) return 'dominant9';
    return 'dominant7';
  }

  // Augmented 7
  if (triadQuality === 'augmented' && seventhType) return 'augmented7';

  // Fallback to major
  return 'major';
}

/**
 * Check if a query looks like a chord symbol (not a question/explanation request)
 * Used to determine if we should bypass AI entirely
 *
 * @param query The user's input query
 * @returns true if the query appears to be a chord symbol
 */
export function looksLikeChordSymbol(query: string): boolean {
  // Input validation
  if (!query || typeof query !== 'string') return false;

  const q = query.trim();
  if (!q) return false;

  // Must start with a note letter
  if (!/^[A-Ga-g]/.test(q)) return false;

  // Should NOT be a question or explanation request
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
    /^show\s+me\s/i,
    /^play\s/i,
  ];

  if (questionPatterns.some((p) => p.test(q))) return false;

  // Check if this looks like a written-word chord (e.g., "G7sharp5b11", "E flat major 9")
  // These contain chord-specific words that indicate it's a chord notation, not prose
  // Include abbreviated forms: dim, aug, min, maj, dom
  const chordWordPattern =
    /\b(sharp|flat|diminished|dim|augmented|aug|minor|min|major|maj|dominant|dom|sus|add)\b/i;
  const hasChordWords = chordWordPattern.test(q);

  // For written-word chords, allow longer strings and spaces
  if (hasChordWords) {
    // But still limit reasonable length (e.g., "E flat major 9 sharp 11" = ~24 chars)
    if (q.length > 40) return false;
  } else {
    // For symbol notation, be more strict
    // Should be relatively short (chord symbols are compact)
    // Extended limit to accommodate complex alterations: Abmaj7#5b9#11/Gb = 18 chars (BUG-007 fix)
    if (q.length > 20) return false;

    // Must not contain spaces (chord symbols don't have spaces in the symbol part)
    if (q.includes(' ')) return false;
  }

  // Try to parse it - this is the definitive test
  return parseChordSymbol(q) !== null;
}

/**
 * Check if a query is a chord query (possibly with prefixes like "show me", "what is")
 * and extract the chord symbol if found
 *
 * @param query The user's input query
 * @returns ParsedChord if a chord was found, null otherwise
 */
export function extractChordFromQuery(query: string): ParsedChord | null {
  // Input validation
  if (!query || typeof query !== 'string') return null;

  const q = query.trim();

  // First, try direct parsing (just the chord symbol)
  const direct = parseChordSymbol(q);
  if (direct) return direct;

  // Try removing common prefixes
  const prefixPatterns = [
    /^(?:what\s+is\s+(?:a\s+|an\s+|the\s+)?)/i,
    /^(?:show\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?)/i,
    /^(?:play\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?)/i,
    /^(?:explain\s+(?:a\s+|an\s+|the\s+)?)/i,
    /^(?:how\s+(?:do\s+(?:i|you)\s+)?play\s+(?:a\s+|an\s+|the\s+)?)/i,
  ];

  for (const pattern of prefixPatterns) {
    const match = q.match(pattern);
    if (match) {
      const remaining = q.substring(match[0].length).trim();
      // Remove trailing "chord" or "chord?"
      const chordPart = remaining.replace(/\s+chord\??$/i, '').trim();
      const parsed = parseChordSymbol(chordPart);
      if (parsed) return parsed;
    }
  }

  // Try removing trailing "chord" or "chord?"
  const withoutChord = q.replace(/\s+chord\??$/i, '').trim();
  if (withoutChord !== q) {
    const parsed = parseChordSymbol(withoutChord);
    if (parsed) return parsed;
  }

  return null;
}

/**
 * Format a parsed chord for display
 * @param parsed The parsed chord data
 * @returns A human-readable chord name
 */
export function formatParsedChordName(parsed: ParsedChord): string {
  // If this is an algorithmic chord with a custom display name, use it
  if (parsed.algorithmicDisplayName) {
    return parsed.algorithmicDisplayName;
  }

  const QUALITY_DISPLAY_NAMES: Record<ChordQuality, string> = {
    major: 'Major',
    minor: 'Minor',
    diminished: 'Diminished',
    augmented: 'Augmented',
    major6: 'Major 6',
    minor6: 'Minor 6',
    major7: 'Major 7',
    minor7: 'Minor 7',
    dominant7: 'Dominant 7',
    diminished7: 'Diminished 7',
    half_diminished7: 'Half-Diminished 7',
    augmented7: 'Augmented 7',
    sus2: 'Sus2',
    sus4: 'Sus4',
    add9: 'Add9',
    minor_major7: 'Minor-Major 7',
    power: 'Power',
    dominant7sus4: '7sus4',
    major9: 'Major 9',
    minor9: 'Minor 9',
    dominant9: 'Dominant 9',
    dominant7flat9: '7b9',
    dominant7sharp9: '7#9',
    dominant7flat5: '7b5',
    dominant7sharp5: '7#5',
    dominant7alt: 'Altered',
    dominant11: '11',
    major11: 'Major 11',
    minor11: 'Minor 11',
    dominant9sharp11: '9#11',
    dominant13: '13',
    major13: 'Major 13',
    minor13: 'Minor 13',
    dominant13flat9: '13b9',
    add11: 'Add11',
    six_nine: '6/9',
    minor_six_nine: 'm6/9',
    dominant9sus4: '9sus4',
    sus2sus4: 'Sus2/4',
    augmented_major7: 'Aug Maj7',
    major7flat5: 'Maj7b5',
    diminished_major7: 'Dim(Maj7)',
    major7sharp11: 'Maj7#11',
    dominant7sharp5flat9: '7#5b9',
    dominant7flat5flat9: '7b5b9',
    dominant7sharp5sharp9: '7#5#9',
    dominant7flat5sharp9: '7b5#9',
  };

  const rootStr = `${parsed.root.natural}${parsed.root.accidental}`;
  const qualityStr = QUALITY_DISPLAY_NAMES[parsed.quality] || parsed.quality;

  if (parsed.bassNote) {
    const bassStr = `${parsed.bassNote.natural}${parsed.bassNote.accidental}`;
    return `${rootStr} ${qualityStr}/${bassStr}`;
  }

  return `${rootStr} ${qualityStr}`;
}

/**
 * Check if a parsed chord was built algorithmically
 */
export function isAlgorithmicChord(parsed: ParsedChord): boolean {
  return parsed.algorithmicNotes !== undefined && parsed.algorithmicNotes.length > 0;
}
