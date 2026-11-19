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
  // "G chord", «acorde de Sol»: a root and the word, no quality — the major
  // triad, as the bare "G" is (review of b94d761, item 9).
  if (stripped !== q && /^[A-Ga-g][#b]?$/.test(stripped.trim())) {
    const root = stripped.trim();
    return `${root[0].toUpperCase()}${root.slice(1)}`;
  }
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

/** The PT / ES scale and chord words of a phrase, in English (phrases first). */
function translateWords(text: string): string {
  let out = text;
  for (const [pattern, replacement] of PHRASES) out = out.replace(pattern, replacement);
  return out
    .split(' ')
    .filter(Boolean)
    .map((w) => WORDS[w] ?? w)
    .join(' ');
}

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
  if (!root) {
    // No root: a scale's name alone («dórico», «menor harmónica», «escala
    // dórica») reads as its English form does ("dorian", "harmonic minor") —
    // review of b94d761, item 9. Not after "tonalidade" (a key needs a root).
    if (prefix) return null;
    const words = translateWords(q);
    const bare = `${words}${suffix}`;
    return words !== q ? bare : null;
  }
  let letter = root[1].length === 1 ? root[1].toUpperCase() : SOLFEGE_TO_LETTER[root[1]];
  if (root[2]) letter += root[2];
  else if (root[3]) letter += root[3] === 'bemol' ? 'b' : '#';
  let rest = q.slice(root[0].length).trim();

  rest = translateWords(rest);

  const out = `${prefix}${letter}${rest ? ` ${rest}` : ''}${suffix}`;
  // Nothing translated → not a PT/ES query (avoid re-resolving English input).
  if (out.toLowerCase() === original) return null;
  return out;
}

/**
 * A bare solfège syllable ("do", "Ré", "sol"). Read as the note (do = C), not
 * through the chord parser, which would take "do" as D diminished.
 */
export function isBareSolfege(query: string): boolean {
  return /^(?:d[oó]|r[eé]|mi|f[aá]|sol|l[aá]|si)$/i.test(query.trim());
}

// ─── A solfège syllable glued to a chord symbol (audit A3, 2026-11-18) ────────
//
// "Sol7", "Ré7", "Fá#m7", "Sib7", "Do/Mi": the WHOLE syllable is the root,
// read before the chord symbol, so "Do7" is C7 (not D + o7 = D°7, which the
// letter reading still offers). Syllables in either language, with or without
// accents, any case; accidentals as PT and ES write them (# b ♯ ♭, doubled,
// or the word after a space: "Fa sostenido 7"). The symbol after it is read
// exactly as after a letter (case matters there: M7 ≠ m7).

// The syllable, then its accidental — a word after a space, the symbol joined
// to it or not ("Fa sostenido 7", "Fa sostenido7"), or a sign, joined or set
// apart by a space ("Sib7", "Si b 7") — then the symbol (review of b94d761,
// item 4). The word is tried before the sign: "Sol bemol7" is G♭7, not G♭
// + "emol7".
const SYLLABLE_SYMBOL = /^(do|re|mi|fa|sol|la|si)(?:\s+(sustenido|sostenido|bemol)|\s*(##|bb|#|b))?\s*(.*)$/i;
const SYLLABLE_BASS = /\/(do|re|mi|fa|sol|la|si)(##|bb|#|b)?$/i;
/**
 * After a syllable, a symbol made of letters only is accepted only if it is one
 * of these: words that merely BEGIN with a syllable ("Solo", "Lamb", "Mix",
 * "Dorian") are prose, not chords. Anything with a digit or a sign (7, maj7,
 * m7b5, °, /E) is read as a symbol.
 */
const LETTER_SUFFIXES = new Set(['', 'm', 'M', 'maj', 'min', 'dim', 'aug', 'alt']);

/** A syllable read with its chord symbol: "Fá#m7" → { symbol "F#m7", accidental "#" }. */
export interface SolfegeSymbol {
  symbol: string;
  /** '' when the syllable has no sharp or flat ("Sim", "Dom7"). */
  accidental: string;
}

/** "Fá#m7" → "F#m7", "Do/Mi" → "C/E"; null when it is not a syllable + chord symbol. */
export function readSolfegeSymbol(query: string): SolfegeSymbol | null {
  let q = stripDiacritics(query.trim()).replace(/♯/g, '#').replace(/♭/g, 'b');
  // ALL CAPS is read as capitalised (SIM = Sim, DOM7 = Dom7): an M means
  // major only in mixed case (SiM, DoM7) — review of b94d761, item 2.
  if (/[A-Z]/.test(q) && !/[a-z]/.test(q)) q = q.toLowerCase();
  const m = SYLLABLE_SYMBOL.exec(q);
  if (!m) return null;
  const accidental = m[3] ?? (m[2] ? (m[2].toLowerCase() === 'bemol' ? 'b' : '#') : '');
  let rest = m[4];
  if (/\s/.test(rest)) return null;
  rest = rest.replace(SYLLABLE_BASS, (_all, s: string, acc?: string) => `/${SOLFEGE_TO_LETTER[s.toLowerCase()]}${acc ?? ''}`);
  if (/^[A-Za-z]*$/.test(rest) && !LETTER_SUFFIXES.has(rest)) return null;
  return { symbol: `${SOLFEGE_TO_LETTER[m[1].toLowerCase()]}${accidental}${rest}`, accidental };
}

/** "Fá#m7" → "F#m7", "Do/Mi" → "C/E"; null when it is not a syllable + chord symbol. */
export function solfegeChordSymbol(query: string): string | null {
  return readSolfegeSymbol(query)?.symbol ?? null;
}

/**
 * How a reading was found: `letters` (the query as typed: English words and
 * chord symbols with letter roots), `words` (Portuguese / Spanish words, letter
 * or solfège root: "escala de Ré maior", "Do mayor", a bare syllable "sol"),
 * `solfege` (a syllable glued to a chord symbol: "Sol7" — audit A3, the only
 * reading that did not exist before 2026-11-18).
 */
export type ReadingSource = 'letters' | 'words' | 'solfege';

export interface TheoryReading {
  resolved: ResolvedTheoryQuery;
  via: ReadingSource;
  /**
   * A solfège reading of one bare lower-case word with no digit and no
   * sharp or flat ("sim", "dom", "lam"): also an ordinary Portuguese or
   * Spanish word, so search never ranks it above what it found before
   * (review of b94d761, item 2).
   */
  plainWord?: true;
}

const readingKey = (r: ResolvedTheoryQuery): string => {
  switch (r.kind) {
    case 'chord': {
      const p = r.parsed;
      return `chord ${p.root.natural}${p.root.accidental} ${p.quality} ${p.algorithmicDisplayName ?? ''} ${p.bassNote ? p.bassNote.natural + p.bassNote.accidental : ''}`;
    }
    case 'scale': return `scale ${r.root.natural}${r.root.accidental} ${r.scaleType}`;
    case 'key': return `key ${r.root.natural}${r.root.accidental} ${r.minor}`;
    case 'rootlessScale': return `rootless ${r.scaleType}`;
    case 'circle': return 'circle';
  }
};

/**
 * Every reading of a typed query (English, Portuguese or Spanish), the letter
 * reading first: "Do7" → [D°7 (letters), C7 (solfège)]. Search orders them by
 * the learner's language; everything that takes ONE reading
 * (`resolveTheoryQuery`: Try This, the lesson's instrument) takes the first,
 * which is what it was before the solfège reading existed whenever there was
 * one at all.
 */
export function resolveTheoryReadings(query: string): TheoryReading[] {
  const q = query.trim();
  if (!q) return [];
  if (isBareSolfege(q)) {
    const note = toEnglishTheoryQuery(q);
    const r = note ? resolveEnglish(note) : null;
    return r ? [{ resolved: r, via: 'words' }] : [];
  }
  const out: TheoryReading[] = [];
  const add = (resolved: ResolvedTheoryQuery | null, via: ReadingSource) => {
    if (resolved && !out.some((o) => readingKey(o.resolved) === readingKey(resolved))) out.push({ resolved, via });
  };
  const direct = resolveEnglish(q);
  add(direct, 'letters');
  if (!direct) {
    const translated = toEnglishTheoryQuery(q);
    add(translated ? resolveEnglish(translated) : null, 'words');
  }
  const read = readSolfegeSymbol(q);
  const glued = read ? resolveEnglish(read.symbol) : null;
  if (glued?.kind === 'chord' && !out.some((o) => readingKey(o.resolved) === readingKey(glued))) {
    const plainWord = /^\p{Ll}+$/u.test(q) && read!.accidental === '';
    out.push({ resolved: glued, via: 'solfege', ...(plainWord ? { plainWord: true as const } : {}) });
  }
  return out;
}

/**
 * Resolve a typed query (English, Portuguese or Spanish) to a theory object,
 * or null when nothing matches.
 */
export function resolveTheoryQuery(query: string): ResolvedTheoryQuery | null {
  return resolveTheoryReadings(query)[0]?.resolved ?? null;
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
    // A quoted syllable ("do", «Mi») is about solfège, not a query.
    if (isBareSolfege(query)) continue;
    // Lessons write note names in letters (D-18): a token that only the
    // solfège reading understands ("Solo" is not G°) stays prose.
    const first = resolveTheoryReadings(query)[0];
    if (first && first.via !== 'solfege') {
      out.push({ index: m.index ?? 0, length: m[0].length, query });
    }
  }
  return out;
}
