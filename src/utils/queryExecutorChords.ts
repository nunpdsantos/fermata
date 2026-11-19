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
import { getPitchClass } from '../core/constants/notes';

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
 * The pitches one chord of a list sounds with its lowest note in `octave`
 * (3 unless the step rule of `chordListSounds` moves it). Root position:
 * `chordVoicingPitches` from the root (open in octave 3, close above). A
 * slash chord whose bass is one of its own tones IS an inversion
 * (second audit, QA P7: G7/F is V4/2): its tones in close position from that
 * bass, each once — never the root-position chord over a second copy of the
 * bass, which doubled the 7th of G7/F and the leading note of G7/B. A bass
 * outside the chord (C/D) stands under the chord, as it always did.
 */
export function chordListPitchesAt(chord: Chord, octave: number): PitchedNote[] {
  const inversion = slashChordInversion(chord);
  if (inversion !== null) {
    const rotated = [...chord.notes.slice(inversion), ...chord.notes.slice(0, inversion)] as Note[];
    return chordVoicingPitches(rotated, octave + 1).map((p) => ({ ...p, octave: p.octave - 1 }));
  }
  return chord.bassNote
    ? chordVoicingPitches(chord.notes as Note[], octave + 1, chord.bassNote)
    : chordVoicingPitches(chord.notes as Note[], octave);
}

/** The pitches one chord of a list sounds on its own (its bass, or root, in octave 3). */
export function chordListPitches(chord: Chord): PitchedNote[] {
  return chordListPitchesAt(chord, 3);
}

/**
 * The inversion a slash chord's bass names (1 = its 3rd in the bass …), or
 * null for no slash, a bass on the root, or a bass that is not a chord tone.
 * The same rule as `inversionOfBass` in `utils/chordSelection.ts`, by which
 * the lesson's instrument opens C/E as C major, first inversion; kept here so
 * this module stays free of the store.
 */
export function slashChordInversion(chord: Chord): number | null {
  if (!chord.bassNote || chord.algorithmicDisplayName || chord.notes.length === 0) return null;
  // A bass outside the chord is put first by the parser (C/D → D C E G).
  if (getPitchClass(chord.notes[0]) !== getPitchClass(chord.root)) return null;
  const at = chord.notes.findIndex((n) => getPitchClass(n) === getPitchClass(chord.bassNote!));
  return at > 0 ? at : null;
}

const LETTER_INDEX: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const lowestMidi = (pitches: PitchedNote[]) => Math.min(...pitches.map((p) => 12 * (p.octave + 1) + getPitchClass(p)));

/**
 * What "Hear it" plays for a chord list, and what each of its chord buttons
 * plays: each chord once, in order, one per second, over its bass. Every bass
 * stands in octave 3 — unless it moves by step (the next letter up or down)
 * from the bass before, which is then heard as that step: across B–C too,
 * where octave 3 alone would turn a step into a 7th (the second audit's
 * follow-up of round one's l1u35m3, G Am Bm C D Em: the bass now climbs G3 A3
 * B3 C4 D4 E4). A leap goes back to octave 3.
 */
export function chordListSounds(entries: readonly ChordListEntry[]): ChordListSound[] {
  let previous: { letter: number; midi: number } | null = null;
  return entries.map((e, i) => {
    const bass = e.chord.bassNote ?? e.chord.root;
    let octave = 3;
    let pitches = chordListPitchesAt(e.chord, octave);
    const letter = LETTER_INDEX[bass.natural];
    if (previous) {
      const byLetter = (letter - previous.letter + 7) % 7;
      const midi = lowestMidi(pitches);
      if (byLetter === 1 && midi < previous.midi) octave += 1;
      if (byLetter === 6 && midi > previous.midi) octave -= 1;
      if (octave !== 3) pitches = chordListPitchesAt(e.chord, octave);
    }
    previous = { letter, midi: lowestMidi(pitches) };
    return { at: i * CHORD_LIST_STEP_S, duration: CHORD_LIST_CHORD_S, pitches };
  });
}
