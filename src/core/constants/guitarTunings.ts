// Guitar tuning definitions
// Each tuning defines the open string notes from 6th string (low) to 1st string (high)

import { PitchedNote } from '../types/music';

export interface GuitarTuning {
  id: string;
  name: string;
  shortName: string;
  strings: PitchedNote[]; // 6 elements: [6th string, 5th, 4th, 3rd, 2nd, 1st]
}

// Note to pitch class mapping (shared with other guitar modules)
const NOTE_TO_PC: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

/** Get pitch classes array [6th..1st string] from a tuning */
export function getTuningPitchClasses(tuning: GuitarTuning): number[] {
  return tuning.strings.map((s) => {
    const key = `${s.natural}${s.accidental}`;
    return NOTE_TO_PC[key] ?? NOTE_TO_PC[s.natural] ?? 0;
  });
}

/** Get string label array [6th..1st string] from a tuning */
export function getTuningStringLabels(tuning: GuitarTuning): string[] {
  return tuning.strings.map((s) => `${s.natural}${s.accidental}`);
}

// ── Common tunings ──────────────────────────────────────────────

export const TUNING_STANDARD: GuitarTuning = {
  id: 'standard',
  name: 'Standard',
  shortName: 'Std',
  strings: [
    { natural: 'E', accidental: '', octave: 2 },
    { natural: 'A', accidental: '', octave: 2 },
    { natural: 'D', accidental: '', octave: 3 },
    { natural: 'G', accidental: '', octave: 3 },
    { natural: 'B', accidental: '', octave: 3 },
    { natural: 'E', accidental: '', octave: 4 },
  ],
};

export const TUNING_DROP_D: GuitarTuning = {
  id: 'drop-d',
  name: 'Drop D',
  shortName: 'Drop D',
  strings: [
    { natural: 'D', accidental: '', octave: 2 },
    { natural: 'A', accidental: '', octave: 2 },
    { natural: 'D', accidental: '', octave: 3 },
    { natural: 'G', accidental: '', octave: 3 },
    { natural: 'B', accidental: '', octave: 3 },
    { natural: 'E', accidental: '', octave: 4 },
  ],
};

export const TUNING_DADGAD: GuitarTuning = {
  id: 'dadgad',
  name: 'DADGAD',
  shortName: 'DADGAD',
  strings: [
    { natural: 'D', accidental: '', octave: 2 },
    { natural: 'A', accidental: '', octave: 2 },
    { natural: 'D', accidental: '', octave: 3 },
    { natural: 'G', accidental: '', octave: 3 },
    { natural: 'A', accidental: '', octave: 3 },
    { natural: 'D', accidental: '', octave: 4 },
  ],
};

/** Classical scordatura: only strings 6 and 5 are lowered; the treble stays E. */
export const TUNING_D_G: GuitarTuning = {
  id: 'd-g',
  name: '6=D 5=G',
  shortName: '6=D 5=G',
  strings: TUNING_STANDARD.strings.map((s, i) => i === 0
    ? { natural: 'D', accidental: '', octave: 2 }
    : i === 1 ? { natural: 'G', accidental: '', octave: 2 } : { ...s }),
};

export const TUNING_OPEN_G: GuitarTuning = {
  id: 'open-g',
  name: 'Open G',
  shortName: 'Open G',
  strings: [
    { natural: 'D', accidental: '', octave: 2 },
    { natural: 'G', accidental: '', octave: 2 },
    { natural: 'D', accidental: '', octave: 3 },
    { natural: 'G', accidental: '', octave: 3 },
    { natural: 'B', accidental: '', octave: 3 },
    { natural: 'D', accidental: '', octave: 4 },
  ],
};

export const TUNING_OPEN_D: GuitarTuning = {
  id: 'open-d',
  name: 'Open D',
  shortName: 'Open D',
  strings: [
    { natural: 'D', accidental: '', octave: 2 },
    { natural: 'A', accidental: '', octave: 2 },
    { natural: 'D', accidental: '', octave: 3 },
    { natural: 'F', accidental: '#', octave: 3 },
    { natural: 'A', accidental: '', octave: 3 },
    { natural: 'D', accidental: '', octave: 4 },
  ],
};

export const TUNING_HALF_STEP_DOWN: GuitarTuning = {
  id: 'half-step-down',
  name: 'Half Step Down',
  shortName: 'Eb',
  strings: [
    { natural: 'E', accidental: 'b', octave: 2 },
    { natural: 'A', accidental: 'b', octave: 2 },
    { natural: 'D', accidental: 'b', octave: 3 },
    { natural: 'G', accidental: 'b', octave: 3 },
    { natural: 'B', accidental: 'b', octave: 3 },
    { natural: 'E', accidental: 'b', octave: 4 },
  ],
};

/** All available tunings, in display order */
export const GUITAR_TUNINGS: GuitarTuning[] = [
  TUNING_STANDARD,
  TUNING_DROP_D,
  TUNING_D_G,
  TUNING_HALF_STEP_DOWN,
  TUNING_OPEN_G,
  TUNING_OPEN_D,
  TUNING_DADGAD,
];

/** Look up a tuning by id, falling back to standard */
export function getTuningById(id: string): GuitarTuning {
  return GUITAR_TUNINGS.find((t) => t.id === id) ?? TUNING_STANDARD;
}
