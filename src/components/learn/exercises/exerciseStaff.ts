/**
 * What staff an exercise prompt draws — a pure function of the config, so
 * tests can check every exercise without rendering VexFlow.
 *
 * Learn staves are AUTHORED notation: the same notes, clef and key signature
 * on every instrument, never transposed for the guitar.
 */
import type { ExerciseConfig, StaffStimulus } from '../../../core/types/exercise';
import type { NaturalNote, Accidental, PitchedNote } from '../../../core/types/music';
import { getPitchClass } from '../../../core/constants/notes';
import { accidentalOffset, intervalTargetNote, writtenOctave } from '../../../core/utils/degreeSpelling';

export interface ExerciseStaff {
  notes: PitchedNote[];
  clef: 'treble' | 'bass';
  keySignature?: string;
  chord?: boolean;
  duration: 'w' | 'h' | 'q';
}

const NATURAL_PC: Record<NaturalNote, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/**
 * A written pitch ('Eb4', 'Cb4', 'F#5') as the app's PitchedNote, whose
 * octave is the octave of the SOUNDING pitch class: C♭4 is written in octave
 * 4 but sounds B3, so it becomes { C, b, octave 3 } (inverse of writtenOctave).
 */
export function parseWrittenPitch(text: string): PitchedNote {
  const m = /^([A-G])(##|bb|#|b)?(-?\d)$/.exec(text);
  if (!m) throw new Error(`Not a written pitch: "${text}"`);
  const natural = m[1] as NaturalNote;
  const accidental = (m[2] ?? '') as Accidental;
  const written = parseInt(m[3], 10);
  const raw = NATURAL_PC[natural] + accidentalOffset(accidental);
  const pc = getPitchClass({ natural, accidental });
  return { natural, accidental, octave: written - (pc - raw) / 12 };
}

/** Bass clef when any note is WRITTEN below middle C (the letter octave). */
function defaultClef(notes: PitchedNote[]): 'treble' | 'bass' {
  return notes.some((n) => writtenOctave(n, n.octave) < 4) ? 'bass' : 'treble';
}

function stimulusStaff(stimulus: StaffStimulus): ExerciseStaff {
  const notes = stimulus.notes.map(parseWrittenPitch);
  return {
    notes,
    clef: stimulus.clef ?? defaultClef(notes),
    ...(stimulus.keySignature ? { keySignature: stimulus.keySignature } : {}),
    ...(stimulus.chord ? { chord: true } : {}),
    duration: stimulus.chord || notes.length <= 1 ? 'w' : 'q',
  };
}

export function exerciseStaff(cfg: ExerciseConfig): ExerciseStaff | null {
  if (cfg.type === 'note_id') {
    const notes: PitchedNote[] = [{ natural: cfg.note as NaturalNote, accidental: (cfg.accidental || '') as Accidental, octave: cfg.octave }];
    // An authored clef wins (W4-05): "below the treble staff" is drawn in treble.
    return { notes, clef: cfg.clef ?? defaultClef(notes), duration: 'w' };
  }
  if (cfg.type === 'interval_id') {
    const root: PitchedNote = { natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental || '') as Accidental, octave: cfg.rootOctave };
    // A spelled interval (W4-14) puts the second note on its own letter.
    const target = intervalTargetNote(root, cfg.targetSemitones, cfg.direction, cfg.intervalNumber);
    const notes = [root, target];
    return { notes, clef: defaultClef(notes), duration: 'h' };
  }
  if (cfg.type === 'multiple_choice' && cfg.stimulus) {
    return stimulusStaff(cfg.stimulus);
  }
  return null;
}
