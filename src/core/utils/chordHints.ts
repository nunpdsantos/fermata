// Chord-search HINT layer — "catch from just a hint".
//
// Two deterministic, framework-agnostic helpers used by QuickSearch:
//   1. getChordCompletions  — partial symbol → common full chords ("Cmaj" → Cmaj7,
//                              Cmaj9, …; "C7#" → C7#9, C7#11, C7#5; "Cm" → Cm7, Cm9, …)
//   2. parseVerbalChord     — free-text words → a ParsedChord ("c sharp minor seven",
//                              "g dominant", "f sharp diminished seventh")
//
// Both reuse the real `parseChordSymbol`, so a completion/verbal result is only
// ever offered if it actually parses to a real chord. Alias tables are built once
// at module scope (the search runs per keystroke).

import type { Note } from '../types/music';
import { parseChordSymbol, type ParsedChord } from './chordParser';

export interface ChordCompletion {
  symbol: string; // the full symbol that parsed (e.g. "Cmaj7")
  parsed: ParsedChord;
}

// Common FULL chord qualities (symbol suffixes after the root), ORDERED by
// real-world commonality: triads & plain 7ths first, then 9/6/add, then denser
// alterations/extensions. The order IS the ranking — getChordCompletions keeps it.
// The user's typed fragment ("stem") filters this list by prefix, so e.g. "maj"
// keeps the maj* rows, "7#" keeps 7#9/7#11/7#5, "m" keeps the m* rows.
const COMPLETION_QUALITIES: string[] = [
  // triads
  '', 'm', 'dim', 'aug',
  // sixths
  '6', 'm6', '69',
  // sevenths (plain)
  'maj7', 'm7', '7', 'dim7', 'm7b5', 'mMaj7',
  // ninths
  'maj9', 'm9', '9',
  // adds / sus
  'add9', 'sus2', 'sus4', '7sus4',
  // elevenths / thirteenths
  'maj11', 'm11', '11', 'maj13', 'm13', '13',
  // altered dominants
  '7b9', '7#9', '7#11', '7#5', '7b5', '7alt',
  // lydian / power
  'maj7#11', '5', '6/9',
];

// A typed stem is normalized to a comparable prefix of the quality list. Capital
// 'M' = major (so "CM"/"CMaj" stays in the maj* family, NOT the minor m* family);
// unicode accidentals fold to ascii.
function normalizeStem(stem: string): string {
  return stem
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b')
    .replace(/^Maj/, 'maj') // CMaj… → maj…
    .replace(/^M(?=$|[679]|1)/, 'maj') // bare CM, CM7, CM9, CM11, CM13 → maj-family
    .toLowerCase();
}

/**
 * Suggest common full chords that complete a partial symbol.
 *
 * Splits the input into a root (letter + optional accidental) and a typed "stem"
 * (the quality fragment so far). The stem is used as a PREFIX FILTER over the
 * commonality-ordered quality list; each surviving quality is parsed as
 * `root + quality` and kept if it parses to a distinct quality. Result order is
 * the commonality order (the ranking); deduped and capped.
 *
 * Examples: "Cmaj" → Cmaj7, Cmaj9, Cmaj11, Cmaj13, Cmaj7#11; "C7#" → C7#9, C7#11,
 * C7#5; "Cm" → Cm, Cm6, Cm7, Cm7b5, CmMaj7, Cm9, …; "F#" → F#, F#m, F#dim, …
 */
export function getChordCompletions(input: string, cap = 8): ChordCompletion[] {
  const q = input.trim();
  if (!q || q.length > 24) return [];

  // Root = leading letter + optional accidental(s) (ascii or unicode).
  const rootMatch = q.match(/^([A-Ga-g])([#b♯♭]{0,2})/u);
  if (!rootMatch) return [];
  const root = rootMatch[0];
  const rawStem = q.slice(root.length);

  // A trailing bare accidental ("C7#") is the user mid-typing an alteration; keep
  // it as a prefix filter so only 7#… qualities survive.
  const stem = normalizeStem(rawStem);

  const results: ChordCompletion[] = [];
  const seenQualities = new Set<string>();

  const tryCandidate = (qualitySuffix: string) => {
    if (results.length >= cap) return;
    const symbol = root + qualitySuffix;
    const parsed = parseChordSymbol(symbol);
    if (!parsed) return;
    const key = `${parsed.quality}:${parsed.bassNote ? 'b' : ''}`;
    if (seenQualities.has(key)) return;
    seenQualities.add(key);
    results.push({ symbol, parsed });
  };

  for (const quality of COMPLETION_QUALITIES) {
    if (results.length >= cap) break;
    const ql = quality.toLowerCase();
    // Keep a quality only if what the user typed is a prefix of it (so "maj"
    // doesn't surface "m6"). Empty stem → everything (bare-root case).
    if (stem && !ql.startsWith(stem)) continue;
    // A lone "m" means MINOR — exclude the major-family "maj…" that also starts
    // with 'm' (mMaj7 is genuinely minor and is kept; "maj7"/"maj9"/… are not).
    if (stem === 'm' && ql.startsWith('maj')) continue;
    tryCandidate(quality);
  }

  return results;
}

// ── Verbal parsing ─────────────────────────────────────────────────────────

// Spelled-out numbers → degree digits.
const NUMBER_WORDS: Record<string, string> = {
  thirteen: '13',
  eleven: '11',
  nine: '9',
  seven: '7',
  six: '6',
  five: '5',
  four: '4',
  three: '3',
  two: '2',
};

// Verbal quality phrases → the symbol suffix the chord parser understands.
// Longest phrases first so "minor major seven" wins over "minor". Keys are the
// fully-normalized (spaces collapsed) quality words AFTER number-word expansion.
const VERBAL_QUALITY_TO_SUFFIX: Array<[string, string]> = [
  ['minormajor7', 'mMaj7'],
  ['minormaj7', 'mMaj7'],
  ['halfdiminished7', 'm7b5'],
  ['halfdiminished', 'm7b5'],
  ['diminishedmajor7', 'dim(maj7)'],
  ['diminished7', 'dim7'],
  ['diminishedseventh', 'dim7'],
  ['augmentedmajor7', 'maj7#5'],
  ['augmented7', 'aug7'],
  ['dominant13', '13'],
  ['dominant11', '11'],
  ['dominant9', '9'],
  ['dominant7', '7'],
  ['dominant', '7'], // "G dominant" → G7 (jazz convention)
  ['major13', 'maj13'],
  ['major11', 'maj11'],
  ['major9', 'maj9'],
  ['major7', 'maj7'],
  ['majorseventh', 'maj7'],
  ['minor13', 'm13'],
  ['minor11', 'm11'],
  ['minor9', 'm9'],
  ['minor7', 'm7'],
  ['minorseventh', 'm7'],
  ['minor6', 'm6'],
  ['major6', '6'],
  ['suspended4', 'sus4'],
  ['suspended2', 'sus2'],
  ['suspended', 'sus4'],
  ['diminished', 'dim'],
  ['augmented', 'aug'],
  ['minor', 'm'],
  ['major', ''],
  ['power', '5'],
];

/**
 * Resolve a free-text verbal chord into a ParsedChord.
 *
 * Handles: a root note word (C–G / A–B), "sharp"/"flat" root accidental words,
 * spelled-out degree numbers (seven → 7), and multi-word qualities ("half
 * diminished", "minor major seven", "dominant"). Returns null when the text
 * isn't a recognizable verbal chord. Deterministic — no scoring.
 *
 * Examples: "c sharp minor seven" → C♯ minor7, "d flat major seven" → D♭ major7,
 * "g dominant" → G7, "f sharp diminished seventh" → F♯ dim7, "b half diminished"
 * → B m7♭5.
 */
export function parseVerbalChord(input: string): ParsedChord | null {
  const q = input.trim().toLowerCase();
  // Must contain at least one space OR a quality word — a bare symbol is the
  // plain parser's job, not the verbal layer.
  if (!q) return null;
  if (q.length > 48) return null;

  // Tokenize on whitespace; the first token must be a note letter (optionally
  // already carrying an accidental like "c#").
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;

  // Root letter (+ inline accidental) from the first token.
  const first = tokens[0];
  const rootLetterMatch = first.match(/^([a-g])(#|b|♯|♭|sharp|flat)?$/);
  if (!rootLetterMatch) return null;

  let rest = tokens.slice(1);
  let accidental: '' | '#' | 'b' = '';
  const inlineAcc = rootLetterMatch[2];
  if (inlineAcc === '#' || inlineAcc === '♯' || inlineAcc === 'sharp') accidental = '#';
  else if (inlineAcc === 'b' || inlineAcc === '♭' || inlineAcc === 'flat') accidental = 'b';

  // A standalone next word may be the accidental ("c sharp …", "d flat …").
  if (!accidental && rest.length > 0) {
    if (rest[0] === 'sharp') {
      accidental = '#';
      rest = rest.slice(1);
    } else if (rest[0] === 'flat') {
      accidental = 'b';
      rest = rest.slice(1);
    }
  }

  const root: Note = { natural: rootLetterMatch[1].toUpperCase() as Note['natural'], accidental };

  // Quality phrase = remaining words, number-words expanded, spaces collapsed.
  let qualityPhrase = rest.join(' ');
  // Expand spelled-out numbers: "major seven" → "major7".
  for (const [word, digit] of Object.entries(NUMBER_WORDS)) {
    qualityPhrase = qualityPhrase.replace(new RegExp(`\\b${word}\\b`, 'g'), digit);
  }
  // Collapse to a single token (drop spaces & the filler word "seventh"→"7" handled below).
  const collapsed = qualityPhrase
    .replace(/\bseventh\b/g, '7')
    .replace(/[\s-]+/g, '');

  // Empty quality phrase → bare root = major triad.
  const suffix =
    collapsed === ''
      ? ''
      : (VERBAL_QUALITY_TO_SUFFIX.find(([phrase]) => phrase === collapsed)?.[1] ?? null);

  if (suffix === null) return null; // unrecognized quality words → not a verbal chord

  const symbol = `${root.natural}${root.accidental}${suffix}`;
  return parseChordSymbol(symbol);
}
