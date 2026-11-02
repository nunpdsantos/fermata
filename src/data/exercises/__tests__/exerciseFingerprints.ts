/**
 * The identity of every served Learn exercise, by id — what a saved score
 * under that id means. Saved per-item scores (progress store
 * `exerciseResults[module].scores[id]`) are only valid while the exercise at
 * that id stays the same exercise.
 *
 * Fingerprint (English, the language-neutral structure):
 * - multiple choice: the prompt and the keyed answer (distractor edits keep
 *   the question; a new prompt or a new right answer is a new question);
 * - everything else: the config without answer labels (what is built,
 *   named or heard) — prompt rewording keeps the task.
 *
 * Used by the identity snapshot test and by scripts/progress/retire-exercise-ids.ts,
 * which also runs it against an older source tree (pass that tree's modules).
 */
import type { ExerciseConfig, ExerciseDefinition } from '../../../core/types/exercise';
import type { ModuleTemplateConfig } from '../exerciseTemplates';
import { exerciseIdentity } from '../exerciseGenerator';

/** djb2 → 8 hex digits: short, stable, enough to tell two exercises apart. */
function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, '0');
}

export function fingerprint(ex: Pick<ExerciseDefinition, 'type' | 'prompt'> & { config: ExerciseConfig }): string {
  const c = ex.config;
  if (c.type === 'multiple_choice') return hash(`mc|${ex.prompt}|${c.choices.find((x) => x.correct)?.label ?? ''}`);
  return hash(`${c.type}|${exerciseIdentity(c)}`);
}

/** moduleId → exerciseId → fingerprint, for one source tree's served EN exercises. */
export type Fingerprints = Record<string, Record<string, string>>;

export interface TreeModules {
  authored: Record<string, ExerciseDefinition[]>[];
  templates: ModuleTemplateConfig[][];
  /** The tree's own generateAllForLevel (older trees take no authored map). */
  generateAllForLevel: (configs: ModuleTemplateConfig[], lang: 'en', authored?: Record<string, ExerciseDefinition[]>) => Record<string, ExerciseDefinition[]>;
}

export function treeFingerprints(tree: TreeModules): Fingerprints {
  const out: Fingerprints = {};
  tree.authored.forEach((authored, i) => {
    const generated = tree.generateAllForLevel(tree.templates[i], 'en', authored);
    for (const map of [authored, generated]) {
      for (const [moduleId, list] of Object.entries(map)) {
        for (const ex of list) (out[moduleId] ??= {})[ex.id] = fingerprint(ex);
      }
    }
  });
  return out;
}

/** Ids whose exercise changed identity (or no longer exists) between two trees, per module. */
export function changedIds(before: Fingerprints, after: Fingerprints): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [moduleId, ids] of Object.entries(before)) {
    const changed = Object.entries(ids)
      .filter(([id, fp]) => after[moduleId]?.[id] !== fp)
      .map(([id]) => id)
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    if (changed.length) out[moduleId] = changed;
  }
  return out;
}
