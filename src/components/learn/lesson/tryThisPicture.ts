import type { Note, PitchedNote } from '../../../core/types/music';
import type { Demonstration } from '../../../core/types/demonstration';
import { buildScale } from '../../../core/constants/scales';
import { getScaleNotesWithOctaves, chordVoicingPitches } from '../../../core/utils/pianoLayout';
import { chordFromParsed } from '../../../core/utils/chordParser';
import { resolveTheoryQuery } from '../../../utils/theoryQuery';
import { parseChordListQuery, slashChordInversion, type ChordListEntry } from '../../../utils/queryExecutorChords';

/**
 * What a Try-This query shows inline: a scale or a key (its scale) up one
 * octave, a chord, a list of chords in playing order (wave 2: `chords: G C D Em`),
 * or a demonstration the lesson writes out (second audit: `CurriculumConcept.demo`).
 */
export type TryThisPicture =
  | { kind: 'scale'; notes: Note[]; pitches: PitchedNote[]; descending?: true }
  | { kind: 'chord'; notes: Note[]; bass?: Note; pitches: PitchedNote[] }
  | { kind: 'chords'; chords: ChordListEntry[] }
  | { kind: 'demo'; demo: Demonstration }
  | { kind: 'none' };

/**
 * The same resolver as the Try-This executor and Cmd+K (W9-01). With
 * `descending` (a concept's `descending` flag, audit A22) a scale is the same
 * notes from the top down: the upper tonic first, the lower tonic last. A
 * `demo` replaces the query's picture (the query still drives "Open in
 * Explore" and, where it shows the same notes, the instrument).
 */
export function tryThisPicture(query: string, currentKey: Note, options: { descending?: boolean; demo?: Demonstration } = {}): TryThisPicture {
  if (options.demo) return { kind: 'demo', demo: options.demo };
  const picture = ascendingPicture(query, currentKey);
  return options.descending && picture.kind === 'scale'
    ? { ...picture, pitches: [...picture.pitches].reverse(), descending: true }
    : picture;
}

function ascendingPicture(query: string, currentKey: Note): TryThisPicture {
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
      // A slash chord whose bass is one of its tones is that inversion (second
      // audit, QA P7: G7/B is V6/5), drawn and played as the lesson's
      // instrument shows it — its tones in close position from the bass,
      // each once (`chordVoicingPitches` of the inverted notes, as
      // `useKeyContext` lights them) — never the root-position chord over a
      // second copy of the bass, which doubled G7/B's leading note.
      const inversion = slashChordInversion(chord);
      if (inversion !== null) {
        const inverted = [...chord.notes.slice(inversion), ...chord.notes.slice(0, inversion)];
        return { kind: 'chord', notes: inverted, pitches: chordVoicingPitches(inverted, 4) };
      }
      return { kind: 'chord', notes: chord.notes, bass: chord.bassNote, pitches: chordVoicingPitches(chord.notes, 4, chord.bassNote) };
    }
    case 'circle':
      return { kind: 'none' };
  }
}
