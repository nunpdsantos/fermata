/**
 * One resolver for every typed theory query — the curriculum's Try-This
 * buttons (queryExecutor) and Cmd+K search (quickSearchResults) both route
 * through `resolveTheoryQuery`, so a query a lesson tells the learner to type
 * ("C major scale", "C major chord", "C whole tone scale", "key of G") gives
 * the same answer in both places (W9-01).
 *
 * Portuguese and Spanish phrasings are accepted too (W6-09): "escala de C
 * maior", "acorde de Ré menor", "C menor harmónica", "Do mayor", "tonalidad
 * de La menor" are translated to the English query language first. Note
 * names may be letters (the app's convention, D-18) or solfège.
 *
 * Pure: no store access. `executeTheoryQuery` applies the result.
 */
import { stringToNote, type Note, type ScaleType } from '../core/types/music';
import {
  parseChordSymbol,
  looksLikeChordSymbol,
  type ParsedChord,
} from '../core/utils/chordParser';
import { parseScaleSymbol, type ParsedScale } from '../core/utils/scaleParser';

export type ResolvedTheoryQuery =
  | { kind: 'key'; root: Note; minor: boolean }
  | { kind: 'circle' }
  | { kind: 'rootlessScale'; scaleType: ScaleType }
  | { kind: 'scale'; root: Note; scaleType: ScaleType; parsed: ParsedScale }
  | { kind: 'chord'; parsed: ParsedChord };

// Mode names the scale parser reports that map onto base scale types.
const MODE_TO_SCALE: Record<string, ScaleType> = {
  ionian: 'major',
  aeolian: 'natural_minor',
};

// Rootless scale-name lookup ("blues scale" keeps the current key).
const ROOTLESS_SCALE_MAP: Record<string, ScaleType> = {
  major: 'major',
  minor: 'natural_minor',
  'natural minor': 'natural_minor',
  'harmonic minor': 'harmonic_minor',
  'melodic minor': 'melodic_minor',
  chromatic: 'chromatic',
  'whole tone': 'whole_tone',
  blues: 'blues',
  'major blues': 'major_blues',
  pentatonic: 'pentatonic_major',
  'major pentatonic': 'pentatonic_major',
  'pentatonic major': 'pentatonic_major',
  'minor pentatonic': 'pentatonic_minor',
  'pentatonic minor': 'pentatonic_minor',
  altered: 'altered',
  // "The diminished scale" with no other qualifier conventionally means W-H.
  diminished: 'diminished_whole_half',
};

// Word-form chord names → symbol suffixes the chord parser understands.
const CHORD_WORD_SUFFIXES: Array<[RegExp, string]> = [
  [/\s+half[\s-]?diminished(?:\s+7th|\s+seventh)?$/i, 'm7b5'],
  [/\s+diminished\s+7th$/i, 'dim7'],
  [/\s+diminished\s+seventh$/i, 'dim7'],
  [/\s+dominant\s+7th$/i, '7'],
  [/\s+dominant\s+seventh$/i, '7'],
  [/\s+dominant$/i, '7'],
  [/\s+major\s+7th$/i, 'maj7'],
  [/\s+major\s+seventh$/i, 'maj7'],
  [/\s+minor\s+7th$/i, 'm7'],
  [/\s+minor\s+seventh$/i, 'm7'],
  [/\s+major$/i, ''],
  [/\s+minor$/i, 'm'],
  [/\s+diminished$/i, 'dim'],
  [/\s+augmented$/i, 'aug'],
];

/** "C diminished 7th chord" → "Cdim7"; returns null when not a word form. */
function normalizeChordWords(q: string): string | null {
  const stripped = q.replace(/\s+(?:chord|triad)$/i, '');
  if (stripped === q && !/\s/.test(q)) return null; // plain symbol, no normalizing needed
  for (const [pattern, suffix] of CHORD_WORD_SUFFIXES) {
    if (pattern.test(stripped)) {
      const root = stripped.replace(pattern, '').trim();
      if (/^[A-Ga-g][#b]?$/.test(root)) return `${root[0].toUpperCase()}${root.slice(1)}${suffix}`;
    }
  }
  return null;
}

/** Resolve one candidate string (English query language). */
function resolveEnglish(q: string): ResolvedTheoryQuery | null {
  if (!q) return null;

  // "key of X" / "key of X major|minor"
  const keyMatch = q.match(/^key\s+of\s+([A-Ga-g][#b]?)(\s+major|\s+minor)?$/i);
  if (keyMatch) {
    return {
      kind: 'key',
      root: stringToNote(keyMatch[1][0].toUpperCase() + keyMatch[1].slice(1)),
      minor: keyMatch[2]?.trim().toLowerCase() === 'minor',
    };
  }

  if (q.toLowerCase() === 'circle of fifths') return { kind: 'circle' };

  // Rootless scale names ("blues scale") — exact match. Checked before the
  // rooted parser, whose leniency would read "blues" as root B + leftovers.
  const rootless = ROOTLESS_SCALE_MAP[q.toLowerCase().replace(/\s+scale$/, '').trim()];
  if (rootless) return { kind: 'rootlessScale', scaleType: rootless };

  // Rooted scales and modes ("D dorian", "Bb major scale", "C altered scale").
  // The parser does not accept a trailing "scale", so retry without it.
  const parsedScale = parseScaleSymbol(q) ?? parseScaleSymbol(q.replace(/\s+scale$/i, ''));
  if (parsedScale) {
    const scaleType = (MODE_TO_SCALE[parsedScale.scaleType] ?? parsedScale.scaleType) as ScaleType;
    return { kind: 'scale', root: parsedScale.root, scaleType, parsed: parsedScale };
  }

  // Chords: word forms first ("C major chord"), then plain symbols (G7, C7alt,
  // C/E). parseChordSymbol is lenient about trailing text, so plain symbols are
  // gated behind looksLikeChordSymbol to keep prose from becoming a C chord.
  const wordForm = normalizeChordWords(q);
  const chordInput = wordForm ?? (looksLikeChordSymbol(q) ? q : null);
  const parsedChord = chordInput ? parseChordSymbol(chordInput) : null;
  if (parsedChord) return { kind: 'chord', parsed: parsedChord };

  return null;
}

// ─── Portuguese / Spanish → English query language ─────────────────────────

const SOLFEGE_TO_LETTER: Record<string, string> = {
  do: 'C', re: 'D', mi: 'E', fa: 'F', sol: 'G', la: 'A', si: 'B',
};

// Multi-word phrases first (order matters: longer, more specific first).
const PHRASES: Array<[RegExp, string]> = [
  [/\b(?:menor harmonica|menor armonica)\b/g, 'harmonic minor'],
  [/\bmenor melodica\b/g, 'melodic minor'],
  [/\bmenor natural\b/g, 'natural minor'],
  [/\b(?:pentatonica (?:maior|mayor)|(?:maior|mayor) pentatonica)\b/g, 'major pentatonic'],
  [/\b(?:pentatonica menor|menor pentatonica)\b/g, 'minor pentatonic'],
  [/\bblues (?:maior|mayor)\b/g, 'major blues'],
  [/\b(?:de )?(?:tons inteiros|tonos enteros)\b/g, 'whole tone'],
  [/\b(?:lidi[oa] dominante|dominante lidi[oa])\b/g, 'lydian dominant'],
  [/\b(?:frigi[oa] dominante|dominante frigi[oa])\b/g, 'phrygian dominant'],
  [/\bsuper ?locri[oa]\b/g, 'super locrian'],
  [/\b(?:menor hungara|hungara menor)\b/g, 'hungarian minor'],
  [/\b(?:dupla harmonica|duplo harmonico|doble armonica)\b/g, 'double harmonic'],
  [/\b(?:meio[ -]?diminut[oa]|semi[ -]?diminut[oa]|semi[ -]?disminuid[oa])\b/g, 'half diminished'],
  [/\b(?:(?:com|con) )?(?:setima|septima) (?:da|de) dominante\b/g, 'dominant 7th'],
  [/\bdominante (?:com|con) (?:setima|septima)\b/g, 'dominant 7th'],
  [/\b(?:(?:com|con) )?(?:setima|septima) (?:diminuta|disminuida)\b/g, 'diminished 7th'],
  [/\b(?:maior|mayor) (?:com|con) (?:setima|septima) (?:maior|mayor)\b/g, 'major 7th'],
  [/\b(?:(?:com|con) )?(?:setima|septima) (?:maior|mayor)\b/g, 'major 7th'],
  [/\bmenor (?:com|con) (?:setima|septima)(?: menor)?\b/g, 'minor 7th'],
  [/\b(?:(?:com|con) )?(?:setima|septima) menor\b/g, 'minor 7th'],
];

const WORDS: Record<string, string> = {
  maior: 'major', mayor: 'major',
  menor: 'minor',
  diminuto: 'diminished', diminuta: 'diminished', disminuido: 'diminished', disminuida: 'diminished',
  aumentado: 'augmented', aumentada: 'augmented',
  dominante: 'dominant',
  cromatica: 'chromatic', cromatico: 'chromatic',
  pentatonica: 'pentatonic',
  octatonica: 'octatonic',
  alterada: 'altered',
  dorico: 'dorian', doria: 'dorian', dorica: 'dorian',
  frigio: 'phrygian', frigia: 'phrygian',
  lidio: 'lydian', lidia: 'lydian',
  mixolidio: 'mixolydian', mixolidia: 'mixolydian',
  eolio: 'aeolian', eolico: 'aeolian', eolia: 'aeolian',
  locrio: 'locrian', locria: 'locrian',
  jonio: 'ionian', jonico: 'ionian', jonia: 'ionian',
};

function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Translate a Portuguese/Spanish theory query to the English query language,
 * or return null when it carries no PT/ES vocabulary or solfège root.
 *   "escala de C maior"      → "C major scale"
 *   "acorde de Ré menor"     → "D minor chord"
 *   "C menor harmónica"      → "C harmonic minor"
 *   "Fá sustenido menor"     → "F# minor"
 *   "tonalidad de La menor"  → "key of A minor"
 */
export function toEnglishTheoryQuery(query: string): string | null {
  let q = stripDiacritics(query.trim().toLowerCase())
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b')
    .replace(/\s+/g, ' ');
  if (!q) return null;
  const original = q;

  // Leading noun: escala / acorde / tonalidade / tonalidad / tom (de|da|do|del)
  let suffix = '';
  let prefix = '';
  const lead = q.match(/^(escala|acorde|triade|triada|tonalidade|tonalidad|tom)(?: (?:de|da|do|del))? /);
  if (lead) {
    if (lead[1] === 'escala') suffix = ' scale';
    else if (lead[1] === 'acorde' || lead[1] === 'triade' || lead[1] === 'triada') suffix = ' chord';
    else prefix = 'key of ';
    q = q.slice(lead[0].length);
  }

  // "escala maior de C", "escala de tons inteiros de Ré": the root comes last
  // after de/da/do/del — move it to the front.
  const trailingRoot = q.match(/^(.+?) (?:de|da|do|del) ((?:do|re|mi|fa|sol|la|si|[a-g])(?:#|b)?(?: (?:sustenido|sostenido|bemol))?)$/);
  if (trailingRoot && !/^(?:do|re|mi|fa|sol|la|si|[a-g])(?:#|b)?(?: |$)/.test(q)) {
    q = `${trailingRoot[2]} ${trailingRoot[1]}`;
  }

  // Root: letter or solfège, optional accidental word or sign.
  const root = q.match(/^(do|re|mi|fa|sol|la|si|[a-g])(#|b)?(?: (sustenido|sostenido|bemol))?(?= |$)/);
  if (!root) return null;
  let letter = root[1].length === 1 ? root[1].toUpperCase() : SOLFEGE_TO_LETTER[root[1]];
  if (root[2]) letter += root[2];
  else if (root[3]) letter += root[3] === 'bemol' ? 'b' : '#';
  let rest = q.slice(root[0].length).trim();

  for (const [pattern, replacement] of PHRASES) rest = rest.replace(pattern, replacement);
  rest = rest
    .split(' ')
    .filter(Boolean)
    .map((w) => WORDS[w] ?? w)
    .join(' ');

  const out = `${prefix}${letter}${rest ? ` ${rest}` : ''}${suffix}`;
  // Nothing translated → not a PT/ES query (avoid re-resolving English input).
  if (out.toLowerCase() === original) return null;
  return out;
}

/**
 * Resolve a typed query (English, Portuguese or Spanish) to a theory object,
 * or null when nothing matches.
 */
export function resolveTheoryQuery(query: string): ResolvedTheoryQuery | null {
  const q = query.trim();
  if (!q) return null;
  const direct = resolveEnglish(q);
  if (direct) return direct;
  const translated = toEnglishTheoryQuery(q);
  return translated ? resolveEnglish(translated) : null;
}

// ─── Quoted queries inside lesson text ─────────────────────────────────────

/**
 * A quoted token: straight, curly or guillemet quotes. A quote glued to a
 * letter or digit on its outer side is an apostrophe ("don't", "it's"), not
 * a quote, so it never opens or closes a token.
 */
const QUOTED_TOKEN =
  /(?<![\p{L}\p{N}])['"‘“«]([^'"‘’“”«»\n]{1,60}?)['"’”»](?![\p{L}\p{N}])/gu;

export interface QuotedQuery {
  /** Offset of the opening quote in the text */
  index: number;
  /** Length of the token including both quotes */
  length: number;
  /** The query between the quotes, trimmed */
  query: string;
}

/**
 * Quoted tokens in lesson text that resolve to a theory query — "Type 'C
 * major scale'", "Toca 'G7' e depois 'C major chord'", "Compara 'D dorian'
 * con 'D natural minor scale'". Quoted prose that is not a query is skipped.
 */
export function findQuotedQueries(text: string): QuotedQuery[] {
  const out: QuotedQuery[] = [];
  for (const m of text.matchAll(QUOTED_TOKEN)) {
    const query = m[1].trim();
    // Lessons never quote a note as a lone lowercase letter; a quoted "e" or
    // "a" is a word — the rhythm syllable in 'one-e-and-a', PT "o "e" entre
    // tempos" — not a chord.
    if (/^[a-z]$/.test(query)) continue;
    if (resolveTheoryQuery(query) !== null) {
      out.push({ index: m.index ?? 0, length: m[0].length, query });
    }
  }
  return out;
}
