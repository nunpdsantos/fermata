/**
 * The chord-list form of a Try This query (wave 2, "From the chords you
 * know"): `chords: G C D Em` — chord symbols the app's parser reads
 * (`parseChordSymbol`: "G", "Em", "D7", "F#m"), in playing order, separated
 * by spaces, at least two of them.
 *
 * "Hear it" plays the chords in order, once; "Open in Explore" asks Explore
 * for its Progression panel with these chords (`requestProgression`,
 * `executeTheoryQuery`). It is deliberately NOT part of `resolveTheoryQuery`
 * (Cmd+K and the lesson instrument resolve one theory object; a list is
 * not one): the resolver returns null for it, so search is unchanged.
 *
 * Pure: no store access.
 */
import type { Chord, Note, PitchedNote } from '../core/types/music';
import { chordFromParsed, looksLikeChordSymbol, parseChordSymbol } from '../core/utils/chordParser';
import { chordVoicingPitches } from '../core/utils/pianoLayout';

export const CHORD_LIST_PREFIX = 'chords:';

export interface ChordListEntry {
  /** The symbol as written in the query ("F#m"). */
  symbol: string;
  chord: Chord;
}

/** The chords a `chords: …` query names, or null when it is not one (or names something the parser does not read). */
export function parseChordListQuery(query: string): ChordListEntry[] | null {
  const q = query.trim();
  if (q.slice(0, CHORD_LIST_PREFIX.length).toLowerCase() !== CHORD_LIST_PREFIX) return null;
  const symbols = q.slice(CHORD_LIST_PREFIX.length).trim().split(/\s+/).filter(Boolean);
  if (symbols.length < 2) return null;
  const out: ChordListEntry[] = [];
  for (const symbol of symbols) {
    // The symbol must be ONE whole symbol: the parser is lenient about
    // trailing text, so "Gx" must not quietly become G.
    if (!looksLikeChordSymbol(symbol) || !/^[A-G][#b]?[a-z0-9#b]*$/.test(symbol)) return null;
    const parsed = parseChordSymbol(symbol);
    if (!parsed) return null;
    out.push({ symbol, chord: chordFromParsed(parsed) });
  }
  return out;
}

/** The query the lesson's instrument shows for a section: a chord list shows its first chord. */
export function lessonInstrumentQuery(query: string): string {
  const list = parseChordListQuery(query);
  return list ? list[0].symbol : query;
}

/** Seconds from one chord to the next when a chord list is heard, and how long each sounds. */
export const CHORD_LIST_STEP_S = 1.0;
export const CHORD_LIST_CHORD_S = 0.9;

export interface ChordListSound {
  at: number;
  duration: number;
  pitches: PitchedNote[];
}

/**
 * What "Hear it" plays for a chord list: each chord once, in order, one per
 * second, in root position over its root as a clear bass (open voicing from
 * octave 3, as an ear-training progression sounds its chords).
 */
export function chordListSounds(entries: readonly ChordListEntry[]): ChordListSound[] {
  return entries.map((e, i) => ({
    at: i * CHORD_LIST_STEP_S,
    duration: CHORD_LIST_CHORD_S,
    pitches: chordVoicingPitches(e.chord.notes as Note[], 3, e.chord.bassNote),
  }));
}
