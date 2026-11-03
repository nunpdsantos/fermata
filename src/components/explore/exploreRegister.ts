import type { Note, PitchedNote } from '../../core/types/music';
import { chordVoicingPitches } from '../../core/utils/pianoLayout';
import type { InstrumentType } from '../../state/storeTypes';

/** Explore's reference staff starts at 4. Guitar sounds that picture one
 * octave lower; the piano keeps each caller's existing octave preference.
 * Voice chords BEFORE lowering them: voicing directly at 3 would spread
 * their tones and no longer give the same written picture as the piano. */
export function exploreRegister(instrument: InstrumentType, pianoOctave = 4) {
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
