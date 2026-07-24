/**
 * Exercise Template System — type definitions for programmatic exercise generation.
 */
import type { ExerciseType } from '../../core/types/exercise';

export interface ExerciseTemplate {
  type: ExerciseType;
  /** Template string with {param} placeholders, e.g. "Build the {root} {scaleType} scale" */
  promptTemplate: string;
  /** Hint template with {param} placeholders */
  hintTemplate: string;
  params: ExerciseTemplateParams;
  /** Override default point value (default: 1) */
  points?: number;
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
  /** Direction for interval exercises */
  directions?: ('ascending' | 'descending')[];
  /** Octave values to sample from */
  octaves?: number[];
  /** Scale degrees for degree ID exercises */
  degrees?: number[];
  /** Note counts for build exercises */
  noteCounts?: number[];
  /** Choices for multiple choice (array of {label, correct} arrays) */
  choiceSets?: { label: string; correct: boolean }[][];
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
