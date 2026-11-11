import type { Note, PitchedNote } from '../../../core/types/music';
import { buildScale } from '../../../core/constants/scales';
import { getScaleNotesWithOctaves, chordVoicingPitches } from '../../../core/utils/pianoLayout';
import { chordFromParsed } from '../../../core/utils/chordParser';
import { resolveTheoryQuery } from '../../../utils/theoryQuery';
import { parseChordListQuery, type ChordListEntry } from '../../../utils/queryExecutorChords';

/**
 * What a Try-This query shows inline: a scale or a key (its scale) up one
 * octave, a chord, or a list of chords in playing order (wave 2: `chords: G C D Em`).
 */
export type TryThisPicture =
  | { kind: 'scale'; notes: Note[]; pitches: PitchedNote[] }
  | { kind: 'chord'; notes: Note[]; bass?: Note; pitches: PitchedNote[] }
  | { kind: 'chords'; chords: ChordListEntry[] }
  | { kind: 'none' };

/** The same resolver as the Try-This executor and Cmd+K (W9-01). */
export function tryThisPicture(query: string, currentKey: Note): TryThisPicture {
  const list = parseChordListQuery(query);
  if (list) return { kind: 'chords', chords: list };
  const resolved = resolveTheoryQuery(query);
  if (!resolved) return { kind: 'none' };
  const scaleOf = (root: Note, type: Parameters<typeof buildScale>[1]): TryThisPicture => {
    const notes = buildScale(root, type).notes;
    const pitches = getScaleNotesWithOctaves(notes, 4);
    const last = pitches[pitches.length - 1];
    // Up to the tonic an octave above (chromatic / 12-note scales too).
    const top = { ...notes[0], octave: pitches[0].octave + 1 };
    return { kind: 'scale', notes, pitches: last && last.octave === top.octave && last.natural === top.natural ? pitches : [...pitches, top] };
  };
  switch (resolved.kind) {
    case 'scale':
      return scaleOf(resolved.root, resolved.scaleType);
    case 'rootlessScale':
      return scaleOf(currentKey, resolved.scaleType);
    case 'key':
      return scaleOf(resolved.root, resolved.minor ? 'natural_minor' : 'major');
    case 'chord': {
      const chord = chordFromParsed(resolved.parsed);
      return { kind: 'chord', notes: chord.notes, bass: chord.bassNote, pitches: chordVoicingPitches(chord.notes, 4, chord.bassNote) };
    }
    case 'circle':
      return { kind: 'none' };
  }
}
