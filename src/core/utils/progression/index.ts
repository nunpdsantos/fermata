/**
 * The progression engine (wave 2, stream S): pure functions, no React, no
 * store, no display strings. See each module for its rules.
 */

export type {
  KeyMode,
  MusicKey,
  ChordInput,
  ChordFit,
  ChordFamily,
  SlashBass,
  ChordInKey,
  TonicSigns,
  KeyCandidate,
  CapoShape,
  CapoOption,
  PresetStep,
  ProgressionPresetId,
  ProgressionPreset,
} from './types';
export { keyScale, pickerRoot, scaleTypeOf, shiftKey, sameKey, sameNote } from './key';
export { chordInKey, chordFamily, familyOf, degreeInKey, numeralFor, toChord } from './chordInKey';
export { findKeys } from './findKeys';
export { transposeChord, transposeProgression } from './transpose';
export { capoOptions, hasOpenGrip } from './capo';
export { PROGRESSION_PRESETS, getPreset, presetChords } from './presets';
export { chordSymbol } from './symbol';
