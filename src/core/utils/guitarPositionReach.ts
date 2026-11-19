// Where the hand finds the pitches a scale position skips (music audit 2,
// M46). Its own module, not guitarPositions.ts: that one is in the entry
// chunk (eager imports), and only the Fretboard's lazy chunk needs this.
import type { Note, ScaleType } from '../types/music';
import { getPitchClass } from '../constants/notes';
import { TUNING_STANDARD } from '../constants/guitarTunings';
import type { GuitarTuning } from '../constants/guitarTunings';
import { capoPositions, getGuitarPosition, GUITAR_MAX_FRET, scaleDegreeMap } from './guitarPositions';

/**
 * The pitches a position skips, spelled with their octave (music audit 2,
 * M46: in Drop D, D major position XII skips F♯3 and G3, and the notice
 * spoke of one note), and where the hand finds them: `playedIn`, the position
 * nearest to this one — of those offered with this capo — that plays every
 * one of them (ties: the lower), or null; and for each pitch the nearest
 * position that plays it (with a capo on 9 no one position has both F3 and
 * F♯3 of C Locrian in Drop D: position XII has one, the Open one the other).
 */
export function skippedReach(
  root: Note,
  scaleType: ScaleType,
  position: number,
  tuning: GuitarTuning = TUNING_STANDARD,
  capo: number = 0,
): { notes: { note: Note; octave: number; midi: number; playedIn: number | null }[]; playedIn: number | null } {
  const here = getGuitarPosition(root, scaleType, position, tuning, GUITAR_MAX_FRET, capo);
  if (here.skippedMidi.length === 0) return { notes: [], playedIn: null };
  const degrees = scaleDegreeMap(root, scaleType);
  const others = capoPositions(capo)
    .filter((n) => n !== here.position)
    .sort((a, b) => Math.abs(a - here.position) - Math.abs(b - here.position) || a - b)
    .map((n) => ({ n, played: new Set(getGuitarPosition(root, scaleType, n, tuning, GUITAR_MAX_FRET, capo).notes.map((x) => x.midi)) }));
  const notes = here.skippedMidi.map((midi) => {
    const note = degrees.get(midi % 12)!.note;
    // The octave of the SPELLED note, read from its letter: B♯3 is MIDI 60,
    // C♭4 is MIDI 59. `accidental` is the note's sharps (+) or flats (−).
    const accidental = ((getPitchClass(note) - getPitchClass({ natural: note.natural, accidental: '' }) + 18) % 12) - 6;
    return { note, octave: Math.floor((midi - accidental) / 12) - 1, midi, playedIn: others.find((o) => o.played.has(midi))?.n ?? null };
  });
  const all = others.find((o) => notes.every((x) => o.played.has(x.midi)));
  return { notes, playedIn: all ? all.n : null };
}
