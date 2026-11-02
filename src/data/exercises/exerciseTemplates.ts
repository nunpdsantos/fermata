/**
 * Exercise Template System — type definitions for programmatic exercise generation.
 */
import type { ExerciseType, StaffStimulus } from '../../core/types/exercise';

export interface ExerciseTemplate {
  type: ExerciseType;
  /** Template string with {param} placeholders, e.g. "Build the {root} {scaleType} scale" */
  promptTemplate: string;
  /** Explanation template with {param} placeholders (shown once the item is final; `ExerciseDefinition.hint`). */
  hintTemplate: string;
  /** Nudge template, shown after a first wrong try — must not give the answer away (`ExerciseDefinition.nudge`). */
  nudgeTemplate?: string;
  params: ExerciseTemplateParams;
}

export interface ExerciseTemplateParams {
  /** Root notes to sample from */
  roots?: string[];
  /** Accidentals for each corresponding root */
  accidentals?: string[];
  /** Scale types for scale exercises */
  scaleTypes?: string[];
  /** Chord qualities for chord exercises */
  chordQualities?: string[];
  /** Interval semitone targets */
  intervals?: number[];
  /**
   * interval_id: the interval NUMBER of each target, index-aligned with
   * `intervals` (6 semitones as a 4th = A4, as a 5th = d5). Makes the
   * exercise a spelled interval (W4-14).
   */
  intervalNumbers?: number[];
  /** interval_id: answer by number only or as half/whole step (W4-15). */
  intervalAnswer?: 'number' | 'step';
  /** Direction for interval exercises */
  directions?: ('ascending' | 'descending')[];
  /** Octave values to sample from */
  octaves?: number[];
  /**
   * note_id: the octave of each root, index-aligned with `roots` (instead of
   * sampling `octaves`), for templates whose prompt describes the exact staff
   * position — e.g. only notes that really sit on ledger lines (W4-05).
   */
  noteOctaves?: number[];
  /** note_id: the clef every generated note is authored in (W4-05). */
  clef?: 'treble' | 'bass';
  /**
   * The key each root belongs to, index-aligned with `roots`; fills the
   * {key} token (W4-03, W4-27): "Build the Neapolitan of {key} minor" with
   * roots Db/Ab/Eb… and keys C/G/D…. The root stays the graded answer.
   */
  keys?: string[];
  /**
   * The chord as spelled for each root (index-aligned with `roots`), for
   * hints: fills {spelling} ("Ab–C–Eb–F#" for the German sixth of C minor).
   */
  spellings?: string[];
  /** Scale degrees for degree ID exercises */
  degrees?: number[];
  /** Note counts for build exercises */
  noteCounts?: number[];
  /** Choices for multiple choice (array of {label, correct} arrays) */
  choiceSets?: { label: string; correct: boolean }[][];
  /** The notation each choice set's question points at, index-aligned with `choiceSets` (W4-06). */
  stimuli?: StaffStimulus[];
  /** Ear-training mode; required for type 'ear_training'. Chord/scale modes
   * build their choices from chordQualities/scaleTypes (labels translated
   * per language at generation time); progression mode from progressionSets. */
  earMode?: 'note' | 'interval' | 'chord' | 'scale' | 'progression';
  /** Interval ear mode: play both notes simultaneously */
  harmonic?: boolean;
  /** Progression ear mode: pool of Roman-numeral progressions; one is played,
   * all become the choices */
  progressionSets?: string[][];
}

export interface ModuleTemplateConfig {
  moduleId: string;
  templates: ExerciseTemplate[];
  /** How many exercises to generate from templates (on top of hand-authored) */
  targetCount: number;
}
