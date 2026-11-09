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
  /**
   * The clef the note is AUTHORED in (audit W4-05). When a prompt describes
   * the note's place on a staff ("second ledger line below the treble
   * staff"), the clef is part of the exercise and must be stated; without it
   * the staff picks bass clef for anything written below middle C.
   */
  clef?: 'treble' | 'bass';
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
  /**
   * The interval NUMBER (2nd, 4th, 9th …) when the exercise is about spelling
   * (audit W4-14): with it the staff spells the second note on that letter
   * and the answer is the spelled name (6 semitones as a 4th = Augmented 4th,
   * as a 5th = Diminished 5th; 14 semitones as a 9th = Major 9th). Without it
   * the answer key names the semitone count's usual interval (INTERVAL_LABELS).
   */
  intervalNumber?: number;
  /**
   * How the learner names the interval (audit W4-15). Default: by full name
   * ("Minor 3rd"). 'number' names only the interval number (L1 counts
   * letters: "for now, the number is enough"); 'step' asks half step or
   * whole step (L1, before interval qualities are taught).
   */
  answer?: 'number' | 'step';
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

/**
 * Notation a question points at (audit W4-06): drawn above the choices with
 * the app's staff, as AUTHORED notation (never transposed for the guitar).
 */
export interface StaffStimulus {
  /** Written pitches in scientific (letter) octaves, e.g. 'C4', 'Eb4', 'F#5'. May be empty (a bare key signature). */
  notes: string[];
  clef?: 'treble' | 'bass';
  /** Key signature by its major key, as VexFlow names it ('G', 'Bb', 'F#'). */
  keySignature?: string;
  /** Stack the notes as one chord instead of a melody. */
  chord?: boolean;
}

/**
 * A rhythm (audit W5-64): drawn on a one-line staff and played as clicks
 * after a one-bar count-in. Language-neutral — never translated.
 */
export interface RhythmPattern {
  /** Time signature: '2/4', '3/4', '4/4', '6/8', '5/4', '7/8' … */
  time: string;
  /**
   * Note values, space-separated, '|' between bars: w h q 8 16 (whole …
   * sixteenth). A '.' after the value dots it ('h.'), an 'r' after it makes
   * it a rest ('qr', 'h.r'), a '~' after it ties it to the next note ('h~ q'),
   * 't' before an eighth makes it one of a triplet ('t8 t8 t8' = one beat),
   * '>' before a value accents it ('>8').
   */
  notes: string;
  /** Quarter notes per minute (default 80). */
  bpm?: number;
  /**
   * How one bar of an odd (additive) meter groups, in units of the time
   * signature's lower number, adding up to its upper number: 7/8 as 2+2+3 →
   * [2, 2, 3]; 5/4 as 3+2 → [3, 2]. In eighth-note meters (5/8, 7/8, 8/8,
   * 11/8 …) the beams follow it and never cross a group; without it the
   * grouping is read from the accents ('>8 8 >8 8 >8 8 8' = 2+2+3). In
   * quarter-note meters eighths are beamed by the beat, which never crosses
   * a group either. Drawing only: playback does not read it.
   */
  grouping?: number[];
}

export interface MultipleChoiceConfig {
  type: 'multiple_choice';
  choices: { label: string; correct: boolean }[];
  /** What "this chord / this key signature" refers to, when the question points at notation. */
  stimulus?: StaffStimulus;
  /** A rhythm the question points at (drawn, with a Play button). */
  rhythm?: RhythmPattern;
}

export interface EarTrainingConfig {
  type: 'ear_training';
  /**
   * What to play and identify. 'note', 'progression' and 'melody' items
   * play a reference first (decision D-11): middle C before a single note,
   * the key's tonic chord before a progression or a melody.
   */
  mode: 'note' | 'interval' | 'chord' | 'scale' | 'progression' | 'melody';
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
  /**
   * Melody mode (melodic dictation, W4-13): the melodies offered, each as
   * written pitches ('E4', 'F#4', …), drawn on a staff; the one marked correct
   * is the one PLAYED, so what is heard is the answer key by construction.
   * `root` / `rootAccidental` name the major key whose tonic chord sounds first.
   */
  melodyChoices?: { notes: string[]; correct: boolean }[];
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
  /**
   * The explanation: why the answer is what it is. Shown once the item is
   * final, next to the revealed answer (W4b review B1) — it may name the
   * answer, so it is never shown before.
   */
  hint?: string;
  /**
   * A nudge, shown after a first wrong try (W4b review B1). It must not give
   * the answer away: no keyed option text, no target note list, no note
   * name for a note to identify, no description of the right melody. When an
   * item has none, the check derives one from the exercise type or points
   * back to the lesson section that teaches it (`nudge.ts`).
   */
  nudge?: string;
  /**
   * The W4a fingerprint (`exerciseFingerprint`) of the ENGLISH exercise
   * behind this id — the same in every language, so a translation-only fix
   * keeps it. Set by the exercise loader; a saved Learn check is keyed by it.
   */
  sourceFingerprint?: string;
}

// Progress tracking types

export interface ModuleExerciseResult {
  /** exerciseId -> score (0 = failed, 0.5 = second try, 1 = first try) */
  scores: Record<string, 0 | 0.5 | 1>;
  totalAttempts: number;
  lastAttemptAt: number;
  /** True if the module's score reached 80% of its exercise count (decision D-16: every exercise counts 1) */
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
