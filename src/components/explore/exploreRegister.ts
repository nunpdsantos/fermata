import type { Note, PitchedNote } from '../../core/types/music';
import { chordVoicingPitches, slashChordNotesAbove } from '../../core/utils/pianoLayout';
import type { InstrumentType } from '../../state/storeTypes';

/** Explore's reference staff starts at 4. Guitar sounds that picture one
 * octave lower; the piano sounds — and since audit M58 / M59 (19 November
 * 2026) every Explore surface draws — at the piano's octave (`baseOctave`):
 * Play scale, the staff strip (drawn and tapped), the chord detail's chord,
 * arpeggio, tones and small staff, the builder, the circle. The octave is
 * required, so no caller can fall back to 4 unseen (the strip and the chord
 * staff did, an octave away from what the piano played). Voice chords
 * BEFORE lowering them: voicing directly at 3 would spread their tones and
 * no longer give the same written picture as the piano. */
export function exploreRegister(instrument: InstrumentType, pianoOctave: number) {
  const referenceOctave = instrument === 'guitar' ? 4 : pianoOctave;
  const shift = instrument === 'guitar' ? -1 : 0;
  return {
    octave: referenceOctave + shift,
    chordPitches(notes: Note[], bassNote?: Note): PitchedNote[] {
      return chordVoicingPitches(notes, referenceOctave, bassNote)
        .map((note) => ({ ...note, octave: note.octave + shift }));
    },
  };
}

/**
 * The ONE voicing of a chord in Explore (audit M58, 19 November 2026): what
 * ▶ Chord sounds, the piano lights (`useKeyContext` `chordVoicingMidi`, the
 * same `chordVoicingPitches` at the piano's octave), the chord's small staff
 * draws, ▶ Arpeggio plays from the bottom up and a tone button names — the
 * notes in the inversion shown, a slash bass under them. Before, the staff
 * and the arpeggio dropped the slash bass on the piano and ignored its octave.
 */
export function exploreChordVoicing(
  instrument: InstrumentType,
  pianoOctave: number,
  chord: { root: Note; notes: Note[]; bassNote?: Note },
  invertedNotes: Note[] = [],
): PitchedNote[] {
  // A bass outside the chord sounds once, on every inversion chip.
  const above = slashChordNotesAbove(chord, invertedNotes.length > 0 ? invertedNotes : chord.notes);
  return exploreRegister(instrument, pianoOctave).chordPitches(above, chord.bassNote);
}
