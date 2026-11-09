/**
 * Real accidental glyphs in a NAME the interface displays — display only.
 *
 * The app stores, keys, grades and searches note names in ASCII ("Eb", "F#",
 * "Bbm7"); those values never change. Where a note, key, chord, numeral or
 * degree NAME is rendered, it goes through `withGlyphs`:
 *
 *   "Eb" → "E♭"   "F##" → "F𝄪"   "Cbb" → "C𝄫"   "Bb4" → "B♭4"
 *   "Bbm7" → "B♭m7"   "Ebmaj7/G" → "E♭maj7/G"   "C7b9" → "C7♭9"   "B#°" → "B♯°"
 *   "Eb major" → "E♭ major"   "bVII" → "♭VII"   "b3" → "♭3"   "3b" → "3♭"
 *
 * It works token by token, and only on tokens shaped like a name: a capital
 * letter A–G with an accidental is a note only when what follows is a chord
 * suffix (m, maj, dim, aug, sus, add, alt, a digit, °, ø …), so words are left
 * alone ("Bebop", "Dbl Harm.", "About", "Absolute"). It is still not meant for
 * prose: "in Bb major" inside a sentence is content, not a name.
 * `isMusicName` says whether a WHOLE string is names only (a multiple-choice
 * option such as "F–Ab–C" or "Db major", but not "Key signature: F#").
 */
import { noteToString, type Note } from '../types/music';

const GLYPH: Record<string, string> = {
  '#': '♯', '##': '𝄪', b: '♭', bb: '𝄫',
  '♯': '♯', '𝄪': '𝄪', '♭': '♭', '𝄫': '𝄫',
};

/** A token is a run of these; anything else (space, / ( ) , – → · + …) separates. */
const SEPARATORS = /([^A-Za-z0-9#°øΔ^♭♯𝄫𝄪]+)/u;
const ACC = '(bb|b|##|#|𝄫|♭|𝄪|♯)';
const NOTE = new RegExp(`^([A-G])${ACC}?(.*)$`, 'u');
const NUMERAL = new RegExp(`^${ACC}?([IViv]+)(.*)$`, 'u');
const DEGREE = new RegExp(`^${ACC}(\\d+)(.*)$`, 'u');
const COUNT = new RegExp(`^(\\d+)${ACC}$`, 'u');
/** What may follow a note letter (+ accidental) in a chord symbol or a pitched note. */
const CHORD_SUFFIX = /^(?:$|maj|min|dim|aug|sus|add|alt|m|M|[0-9°øΔ^])/u;
const NUMERAL_SUFFIX = /^(?:$|maj|dim|aug|sus|add|alt|M|[0-9°øΔ^])/u;
/** Alterations inside a chord suffix: the b9 of C7b9, the #11 of Cmaj7#11. */
const ALTERATION = /(bb|b|##|#)(?=\d)/gu;
/** Key words that may stand beside a name in a whole-name string ("Db major", "F# maior"). */
const KEY_WORDS = new Set(['major', 'minor', 'maior', 'menor', 'mayor']);

const alter = (rest: string) => rest.replace(ALTERATION, (a) => GLYPH[a]);

/** One token as a name with glyphs, or null when it is not shaped like a name. */
function nameToken(tok: string): string | null {
  let m = NOTE.exec(tok);
  if (m && CHORD_SUFFIX.test(m[3])) return `${m[1]}${m[2] ? GLYPH[m[2]] : ''}${alter(m[3])}`;
  m = NUMERAL.exec(tok);
  if (m && NUMERAL_SUFFIX.test(m[3])) return `${m[1] ? GLYPH[m[1]] : ''}${m[2]}${alter(m[3])}`;
  m = DEGREE.exec(tok);
  if (m && CHORD_SUFFIX.test(m[3])) return `${GLYPH[m[1]]}${m[2]}${alter(m[3])}`;
  m = COUNT.exec(tok);
  if (m) return `${m[1]}${GLYPH[m[2]]}`;
  if (/^\d+$/.test(tok)) return tok;
  return null;
}

/** A chord suffix printed apart from its root ("m7b5" → "m7♭5", "7#9"); anything else as it is. */
const suffixToken = (tok: string) => (tok !== '' && CHORD_SUFFIX.test(tok) ? alter(tok) : tok);

/** A note, key, chord, numeral or degree name with real ♭ ♯ 𝄫 𝄪 (display only). */
export function withGlyphs(name: string | Note): string {
  const s = typeof name === 'string' ? name : noteToString(name);
  return s
    .split(SEPARATORS)
    .map((part, i) => (i % 2 === 1 ? part : nameToken(part) ?? suffixToken(part)))
    .join('');
}

/**
 * True when the whole string is names only — notes, chords, numerals,
 * degrees, counts, "major" / "minor" (EN / PT / ES) — joined by punctuation
 * or spaces. A sentence with a name in it is not one.
 */
export function isMusicName(s: string): boolean {
  const parts = s.trim().split(SEPARATORS);
  let names = 0;
  for (let i = 0; i < parts.length; i += 2) {
    const tok = parts[i];
    if (tok === '') continue;
    if (KEY_WORDS.has(tok.toLowerCase())) continue;
    if (nameToken(tok) === null) return false;
    names++;
  }
  return names > 0;
}

/** A choice that may be a name (a Learn answer): glyphs when it is names only, else as written. */
export function glyphsIfName(s: string): string {
  return isMusicName(s) ? withGlyphs(s) : s;
}
