import { buildChord, getChordShortIntervalLabels } from '../../core/constants/chords.ts';
import { gripLeavesOut } from '../../core/constants/guitarChordShapes.ts';
import type { ChordShape } from '../../core/constants/guitarChordShapes.ts';
import type { Chord, Note } from '../../core/types/music.ts';

const same = (a: Note, b: Note) => a.natural === b.natural && a.accidental === b.accidental;

/**
 * The tones a grip leaves out (`gripLeavesOut`), each with the degree the
 * chord's formula shows in the chord detail ("R 3 5 ♭7 9"), or null where the
 * chord has none for it (music audit 2, M44; review item 1). The degree is
 * read from the chord's OWN tones: a chord the quality builds is matched
 * against `buildChord`, whose notes the formula's labels follow; a chord the
 * parser built carries its labels for its own notes, and `chordFromParsed`
 * puts a slash bass that is not a chord tone FIRST in `notes` without a label
 * — so "C9♯11/A♭" read D as the ♯11, and "C9/A" found no degree at all.
 * The grip's frets are the real ones, so `chord` is the chord as it sounds.
 */
export function leftOutTones(entry: { shape: ChordShape; baseFret: number }, chord: Chord): { note: Note; degree: string | null }[] {
  const left = gripLeavesOut(entry, chord);
  if (left.length === 0) return [];
  let tones: Note[];
  let labels: string[];
  if (chord.algorithmicIntervalLabels) {
    labels = chord.algorithmicIntervalLabels;
    const prepended = chord.bassNote && chord.notes.length === labels.length + 1 && same(chord.notes[0], chord.bassNote);
    tones = prepended ? chord.notes.slice(1) : chord.notes;
  } else {
    labels = getChordShortIntervalLabels(chord.quality);
    tones = buildChord(chord.root, chord.quality).notes;
  }
  return left.map((note) => {
    const at = tones.findIndex((x) => same(x, note));
    return { note, degree: at >= 0 && at < labels.length ? labels[at] : null };
  });
}
