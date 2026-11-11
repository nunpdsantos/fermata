/**
 * Moving chords to another key. Each note keeps its DEGREE above the tonic
 * (read from its spelling) and is spelled for the new tonic, so a chord keeps
 * its numeral and quality: the IV of F♯ major is B, of G♭ major C♭; a ♭VII
 * stays a ♭VII. Spelling goes through `degreeSpelling` (never a semitone count
 * turned into a name).
 */

import type { Chord, Note } from '../../types/music';
import { degreeOf, spellDegree } from '../degreeSpelling';
import { chordInKey, renameAlgorithmic } from './chordInKey';
import type { ChordInput, MusicKey } from './types';

/**
 * One chord from key `from` to key `to`. `from` and `to` are meant to share a
 * mode; if they do not, each note keeps its interval above the tonic (the
 * numeral is then read against the other mode's scale and may change).
 * A root typed as an enharmonic of a key note is read as that note first
 * (see `chordInKey`), so C♯ in D♭ major moves as the I it sounds.
 *
 *   transposeChord(parseChordSymbol('C')!, G major, F♯ major) → B major (IV stays IV)
 */
export function transposeChord(input: ChordInput, from: MusicKey, to: MusicKey): Chord {
  const chord = chordInKey(input, from).chord;
  const move = (n: Note): Note => spellDegree(to.root, degreeOf(from.root, n));
  const moved: Chord = {
    ...chord,
    root: move(chord.root),
    notes: chord.notes.map(move),
  };
  if (chord.bassNote) moved.bassNote = move(chord.bassNote);
  if (chord.algorithmicDisplayName) moved.algorithmicDisplayName = renameAlgorithmic(chord, moved);
  return moved;
}

/** Every chord of a list from `from` to `to`, in order (see `transposeChord`). */
export function transposeProgression(inputs: readonly ChordInput[], from: MusicKey, to: MusicKey): Chord[] {
  return inputs.map((c) => transposeChord(c, from, to));
}
