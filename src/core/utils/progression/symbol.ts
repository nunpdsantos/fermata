/**
 * A chord's symbol as data ("F#m7", "C/E", "Bb7"): ASCII accidentals and the
 * app's CHORD_SYMBOLS suffixes, or an algorithmic chord's own name. Not a
 * display sentence; the screen converts # / b to glyphs as it does elsewhere.
 */

import type { Chord, Note } from '../../types/music';
import { CHORD_SYMBOLS } from '../../constants/chords';

const text = (n: Note): string => `${n.natural}${n.accidental}`;

export function chordSymbol(chord: Chord): string {
  if (chord.algorithmicDisplayName) return chord.algorithmicDisplayName;
  const bass = chord.bassNote ? `/${text(chord.bassNote)}` : '';
  return `${text(chord.root)}${CHORD_SYMBOLS[chord.quality]}${bass}`;
}
