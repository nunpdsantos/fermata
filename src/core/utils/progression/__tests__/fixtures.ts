/**
 * Shared test inputs for the progression engine. Keys and chord roots are
 * spelled by the independent oracle (`../../__tests__/theoryOracle`, which
 * imports nothing from the app) and fed to the app's own chord PARSER as
 * typed symbols, so the tests never reuse the code under test to make their
 * expectations.
 */
import type { Note, NaturalNote, Accidental } from '../../../types/music';
import { parseChordSymbol, type ParsedChord } from '../../chordParser';
import { pcOf, spellDegree as oracleSpell } from '../../__tests__/theoryOracle';
import type { MusicKey } from '../types';

/** The fifteen conventional major keys and fifteen conventional minor keys. */
export const MAJOR_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
export const MINOR_KEYS = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab'];

/** The key picker's twelve roots per mode (CLAUDE.md: D♭ major, C♯ minor, G♯ minor, E♭ minor, B♭ minor …). */
export const PICKER_MAJOR = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
export const PICKER_MINOR = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

/** The 21 root spellings: seven letters, each natural, sharp and flat. */
export const ALL_21 = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].flatMap((l) => [l, `${l}#`, `${l}b`]);

export function note(name: string): Note {
  return { natural: name[0] as NaturalNote, accidental: name.slice(1) as Accidental };
}

export const text = (n: Note): string => `${n.natural}${n.accidental}`;

export function key(root: string, mode: 'major' | 'minor'): MusicKey {
  return { root: note(root), mode };
}

/** Natural-minor degree labels against the major scale. */
const MINOR_DEGREES = ['1', '2', 'b3', '4', '5', 'b6', 'b7'];
const MAJOR_DEGREES = ['1', '2', '3', '4', '5', '6', '7'];

/** The oracle's spelling of scale degree n (1–7) of a key, altered by `alteration` semitones. */
export function oracleScaleNote(root: string, mode: 'major' | 'minor', n: number, alteration = 0): string {
  const base = (mode === 'major' ? MAJOR_DEGREES : MINOR_DEGREES)[n - 1];
  const m = /^(b|#)?(\d)$/.exec(base)!;
  const offset = (m[1] === 'b' ? -1 : m[1] === '#' ? 1 : 0) + alteration;
  const acc = offset === -2 ? 'bb' : offset === -1 ? 'b' : offset === 1 ? '#' : offset === 2 ? '##' : '';
  const spelled = oracleSpell(root, `${acc}${m[2]}`);
  if (!spelled) throw new Error(`oracle cannot spell ${acc}${m[2]} of ${root}`);
  return spelled;
}

/** The oracle's seven notes of a key. */
export function oracleScale(root: string, mode: 'major' | 'minor'): string[] {
  return [1, 2, 3, 4, 5, 6, 7].map((n) => oracleScaleNote(root, mode, n));
}

/** Parse a chord symbol, failing the test loudly on a symbol the parser rejects. */
export function chord(symbol: string): ParsedChord {
  const parsed = parseChordSymbol(symbol);
  if (!parsed) throw new Error(`parser rejected ${symbol}`);
  return parsed;
}

export function chords(symbols: string): ParsedChord[] {
  return symbols.trim().split(/\s+/).map(chord);
}

export { pcOf };
