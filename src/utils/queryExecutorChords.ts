/**
 * The chord-list form of a Try This query (wave 2, "From the chords you
 * know"): `chords: G C D Em` — chord symbols the app's parser reads
 * (`parseChordSymbol`: "G", "Em", "D7", "F#m"), in playing order, separated
 * by spaces, at least two of them. Since the audit fixes of 18 November 2026
 * a symbol may name its bass after a slash ("G7/F", "C/E", "C7/G"), so a
 * lesson can play a bass line: V4/2 resolving to I6, a passing diminished
 * chord between IV7 and I7.
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
    // trailing text, so "Gx" must not quietly become G. A slash bass is one
    // plain letter with an optional # or b ("G7/F", "C7/G").
    if (!looksLikeChordSymbol(symbol) || !/^[A-G][#b]?[a-z0-9#b]*(?:\/[A-G][#b]?)?$/.test(symbol)) return null;
    const parsed = parseChordSymbol(symbol);
    if (!parsed) return null;
    // A slash must have been read as the bass, never dropped.
    if (symbol.includes('/') && !parsed.bassNote) return null;
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
 * The octave a chord of a list is voiced from, chosen so that EVERY chord's
 * lowest note sits in octave 3 (C3 to B3): a root-position chord is voiced
 * from its root in octave 3 (open voicing, as an ear-training progression
 * sounds); a slash chord is voiced as a slash chord sounds in any lesson Try
 * This (`chordVoicingPitches` from octave 4, its bass one octave lower:
 * octave 3). So a bass that moves by a half or whole step is heard as that
 * step only while both notes lie between C and B: F7 → F♯dim7 → C7/G climbs
 * F3, F♯3, G3, and G7/F → C/E falls F3 to E3, but a step across B–C jumps the
 * other way (G7/B → C sounds B3 then C3, a major 7th down for a half step up:
 * pinned in queryExecutorChords.test.ts as the known limit). That test also
 * walks every chord list in the lessons: the slash-chord lists keep their
 * steps; one root-position list, unchanged since wave 2, crosses B–C
 * (l1u35m3, G Am Bm C D Em: Bm → C sounds B3 → C3) and is listed there.
 */
export function chordListOctave(chord: Chord): number {
  return chord.bassNote ? 4 : 3;
}

/** The pitches one chord of a list sounds (its bass, or root, in octave 3). */
export function chordListPitches(chord: Chord): PitchedNote[] {
  return chordVoicingPitches(chord.notes as Note[], chordListOctave(chord), chord.bassNote);
}

/**
 * What "Hear it" plays for a chord list: each chord once, in order, one per
 * second, over its root (or the bass a slash names) as a clear bass in
 * octave 3 (`chordListPitches`).
 */
export function chordListSounds(entries: readonly ChordListEntry[]): ChordListSound[] {
  return entries.map((e, i) => ({
    at: i * CHORD_LIST_STEP_S,
    duration: CHORD_LIST_CHORD_S,
    pitches: chordListPitches(e.chord),
  }));
}
