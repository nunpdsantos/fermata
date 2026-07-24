// Exercise system types for curriculum engine

export type ExerciseType = 'note_id' | 'interval_id' | 'scale_build' | 'chord_build' | 'multiple_choice' | 'ear_training' | 'scale_degree_id';

// Config types per exercise — plain serializable objects (no Note type imports)
// Runtime converts to Note at validation time

export interface NoteIdConfig {
  type: 'note_id';
  /** Natural note letter: C D E F G A B */
  note: string;
  /** Accidental: '' | '#' | 'b' | '##' | 'bb' */
  accidental: string;
  octave: number;
  /** Accept enharmonic equivalents as correct (default: true) */
  acceptEnharmonic?: boolean;
}

export interface IntervalIdConfig {
  type: 'interval_id';
  /** Root note natural letter */
  root: string;
  rootAccidental: string;
  rootOctave: number;
  /** Target interval in semitones (1-12) */
  targetSemitones: number;
  /** 'ascending' | 'descending' */
  direction: 'ascending' | 'descending';
}

export interface ScaleBuildConfig {
  type: 'scale_build';
  /** Root note natural letter */
  root: string;
  rootAccidental: string;
  /** ScaleType string — validated at runtime */
  scaleType: string;
  /** Expected number of unique pitch classes in the scale */
  noteCount: number;
}

export interface ChordBuildConfig {
  type: 'chord_build';
  /** Root note natural letter */
  root: string;
  rootAccidental: string;
  /** ChordQuality string — validated at runtime */
  quality: string;
  /** Expected number of unique pitch classes */
  noteCount: number;
}

export interface MultipleChoiceConfig {
  type: 'multiple_choice';
  choices: { label: string; correct: boolean }[];
}

export interface EarTrainingConfig {
  type: 'ear_training';
  /** What to play and identify */
  mode: 'note' | 'interval' | 'chord' | 'scale' | 'progression';
  /** For note mode: note to play, user identifies by name */
  note?: string;
  accidental?: string;
  octave?: number;
  acceptEnharmonic?: boolean;
  /** For interval mode: play root + interval, user identifies interval */
  root?: string;
  rootAccidental?: string;
  rootOctave?: number;
  targetSemitones?: number;
  direction?: 'ascending' | 'descending';
  /** For interval mode: play both notes simultaneously (harmonic interval) */
  harmonic?: boolean;
  /** For chord mode: play chord, user identifies quality via choices */
  chordRoot?: string;
  chordRootAccidental?: string;
  quality?: string;
  /** For scale mode: play scale over root/rootAccidental/rootOctave, user identifies type via choices */
  scaleType?: string;
  /** For progression mode: diatonic Roman numerals played in the key of root (default C major) */
  progression?: string[];
  /** Choices for chord, scale and progression modes */
  choices?: { label: string; correct: boolean }[];
}

export interface ScaleDegreeIdConfig {
  type: 'scale_degree_id';
  /** Scale root */
  root: string;
  rootAccidental: string;
  /** Scale type (e.g. 'major', 'natural_minor') */
  scaleType: string;
  /** The note to identify */
  note: string;
  noteAccidental: string;
  /** Correct degree (1-7) */
  correctDegree: number;
}

export type ExerciseConfig =
  | NoteIdConfig
  | IntervalIdConfig
  | ScaleBuildConfig
  | ChordBuildConfig
  | MultipleChoiceConfig
  | EarTrainingConfig
  | ScaleDegreeIdConfig;

export interface ExerciseDefinition {
  /** Unique ID: 'l1u3m1e1' */
  id: string;
  type: ExerciseType;
  /** Question shown to the user */
  prompt: string;
  config: ExerciseConfig;
  /** Shown after first wrong attempt */
  hint?: string;
  /** Default: 1 */
  points?: number;
}

// Progress tracking types

export interface ModuleExerciseResult {
  /** exerciseId -> score (0 = failed, 0.5 = second try, 1 = first try) */
  scores: Record<string, 0 | 0.5 | 1>;
  totalAttempts: number;
  lastAttemptAt: number;
  /** True if >= 80% of max points earned */
  passed: boolean;
}

export interface ValidationResult {
  correct: boolean;
  explanation: string;
  /** String describing the expected answer */
  expected: string;
}

// ─── Spaced Repetition ──────────────────────────────────────────────────────

export interface ModuleReviewSchedule {
  completedAt: number;
  nextReviewAt: number;
  /** 0-5 → [1d, 3d, 7d, 14d, 30d, 90d] */
  intervalLevel: number;
  reviewCount: number;
  lastReviewedAt: number;
}
