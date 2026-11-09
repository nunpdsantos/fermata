// Curriculum domain types

export type DifficultyTier = 'beginner' | 'intermediate' | 'advanced';
export type LevelState = 'locked' | 'coming-soon' | 'available' | 'in-progress' | 'completed';

export interface CurriculumLevel {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: DifficultyTier;
  difficultyLabel: string;
  accentColor: string;
  units: CurriculumUnit[];
  prerequisites: string[];
  comingSoon?: boolean;
  parallel?: boolean;
}

/** A single concept within a module — explained and explorable */
export interface CurriculumConcept {
  title: string;
  explanation: string;
  /** Query to fire via onQuery when "Try This" is clicked — creates existing visual components on canvas */
  tryThisQuery: string;
  /** Label shown on the "Try This" button */
  tryThisLabel: string;
  /**
   * A rhythm to show and play instead of the query's notes (rhythm lessons,
   * audit W5-64). When set, the inline Try This draws it on a one-line staff
   * and plays it as clicks.
   */
  rhythm?: import('./exercise').RhythmPattern;
  /**
   * The clef lesson's Try This: draw the query's scale on a treble staff and,
   * an octave lower, on a bass staff, so the two clefs meet at middle C.
   */
  clefs?: boolean;
  /** Simplified explanation for children's audience mode */
  childDescription?: string;
  /** Simplified query for children's audience mode */
  childTryThisQuery?: string;
}

/** A practice task within a module */
export interface CurriculumTask {
  id: string;
  instruction: string;
  /** Query to fire via onQuery — optional, some tasks are observational */
  query?: string;
}

/** A single lesson module */
export interface CurriculumModule {
  id: string;
  unitId: string;
  levelId: string;
  title: string;
  subtitle: string;
  objectives: string[];
  concepts: CurriculumConcept[];
  tasks: CurriculumTask[];
  /** Module IDs that must be completed before this one */
  prerequisites: string[];
  /** If true, content is not yet available (Units 2-5 stubs) */
  comingSoon?: boolean;
}

/** Milestone content shown when a unit is completed */
export interface CurriculumMilestone {
  skillsSummary: string[];
  bridgeText: string;
  tryThisQuery: string;
  tryThisLabel: string;
  tryThisPrompt: string;
}

/** Curriculum completion content for Unit 5 */
export interface CurriculumCompletionContent {
  startedWith: string;
  journeySummary: string[];
  whatsNext: string;
  tryThisQuery: string;
  tryThisLabel: string;
  tryThisPrompt: string;
}

/** A unit containing modules */
export interface CurriculumUnit {
  /** Bonus work: excluded from level completion, gating and the main Continue sequence. */
  optional?: boolean;
  id: string;
  levelId: string;
  title: string;
  description: string;
  /** Icon key for the unit header (mapped to SVG in CurriculumIcons) */
  icon: string;
  modules: CurriculumModule[];
  /** Milestone shown when all modules in the unit are completed */
  milestone?: CurriculumMilestone;
  /** Completion content shown when the final unit (Unit 5) is completed */
  completionContent?: CurriculumCompletionContent;
}

/** Persistent progress tracked in localStorage */
export interface CurriculumProgress {
  completedModules: string[];
  /** Per-module task completion: moduleId -> set of completed task IDs */
  moduleProgress: Record<string, string[]>;
  /** Module IDs where prerequisites are waived (skipped by experienced users) */
  exemptedModules?: string[];
  /** Per-module exercise results: moduleId -> scores, attempts, passed */
  exerciseResults?: Record<string, import('./exercise').ModuleExerciseResult>;
  /** Spaced repetition review schedules: moduleId -> schedule */
  reviewSchedules?: Record<string, import('./exercise').ModuleReviewSchedule>;
  /**
   * Level ids the learner opened out of order with "Unlock anyway" (decision
   * D-10, W4b): the level is no longer shown as locked and its first module
   * no longer waits for the previous level. Optional — saves without it are
   * unchanged (nothing unlocked out of order).
   */
  unlockedLevels?: string[];
}
