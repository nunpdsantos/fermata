/**
 * Translation overlay types for educational content.
 *
 * English is source-of-truth in existing data files.
 * Per-language overlay files map IDs to translated strings.
 * English = no overlay = zero overhead.
 */

export type ContentLanguage = 'en' | 'pt' | 'es';

// ─── Curriculum overlays ────────────────────────────────────────────────────

export interface ModuleOverlay {
  title: string;
  subtitle: string;
  objectives: string[];
  concepts: { title: string; explanation: string; tryThisLabel: string }[];
  tasks: { instruction: string }[];
}

export interface UnitOverlay {
  title: string;
  description: string;
  /**
   * The unit's milestone summary (shown at unit completion, D-23): the same
   * fields as the English `CurriculumMilestone` that a learner reads. The
   * Try-This query stays English (it is a query, not prose).
   */
  milestone?: MilestoneOverlay;
}

export interface MilestoneOverlay {
  skillsSummary: string[];
  /** Empty where the English is empty (the last unit of a level). */
  bridgeText: string;
  tryThisLabel: string;
  tryThisPrompt: string;
}

export interface CurriculumLevelOverlay {
  units: Record<string, UnitOverlay>;      // keyed by unit ID ("u1")
  modules: Record<string, ModuleOverlay>;  // keyed by module ID ("l1u1m1")
}

// ─── Exercise overlays ──────────────────────────────────────────────────────

export interface ExerciseLevelOverlay {
  [exerciseId: string]: {
    prompt: string;
    hint?: string;
    choices?: string[];  // for multiple_choice: translated labels (same order)
  };
}

export interface TemplateLevelOverlay {
  [moduleId: string]: {
    promptTemplate: string;
    hintTemplate: string;
    choiceSets?: string[][];  // [setIndex][choiceIndex] = translated label
  }[];
}

// ─── Level metadata overlay ─────────────────────────────────────────────────

export interface LevelMetaOverlay {
  title: string;
  description: string;
  difficultyLabel: string;
}

// ─── Music term dictionary ──────────────────────────────────────────────────

export interface MusicTermDictionary {
  scaleTypes: Record<string, string>;      // "natural_minor" → "menor natural"
  chordQualities: Record<string, string>;  // "dominant7" → "dominante com 7.ª"
  directions: Record<string, string>;      // "ascending" → "ascendente"
}

// ─── Song reference overlay ─────────────────────────────────────────────────

export interface SongOverlay {
  /** moduleId → array of translated context strings (same order as English) */
  [moduleId: string]: string[];
}
