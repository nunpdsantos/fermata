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
 * which also runs it against an older source tree (pass that tree's modules),
 * and by its --respelled mode (respelling.ts), which reads the items themselves.
 */
import type { ExerciseConfig, ExerciseDefinition } from '../../../core/types/exercise';
import type { ModuleTemplateConfig } from '../exerciseTemplates';
import { exerciseFingerprint } from '../exerciseFingerprint';

/** The one identity function (shared with the app's Learn session store). */
export function fingerprint(ex: Pick<ExerciseDefinition, 'type' | 'prompt'> & { config: ExerciseConfig }): string {
  return exerciseFingerprint(ex);
}

/** moduleId → exerciseId → fingerprint, for one source tree's served EN exercises. */
export type Fingerprints = Record<string, Record<string, string>>;

export interface TreeModules {
  authored: Record<string, ExerciseDefinition[]>[];
  templates: ModuleTemplateConfig[][];
  /** The tree's own generateAllForLevel (older trees take no authored map). */
  generateAllForLevel: (configs: ModuleTemplateConfig[], lang: 'en', authored?: Record<string, ExerciseDefinition[]>) => Record<string, ExerciseDefinition[]>;
}

/** moduleId → exerciseId → the served EN exercise, authored and generated, for one source tree. */
export function treeItems(tree: TreeModules): Record<string, Record<string, ExerciseDefinition>> {
  const out: Record<string, Record<string, ExerciseDefinition>> = {};
  tree.authored.forEach((authored, i) => {
    const generated = tree.generateAllForLevel(tree.templates[i], 'en', authored);
    for (const map of [authored, generated]) {
      for (const [moduleId, list] of Object.entries(map)) {
        for (const ex of list) (out[moduleId] ??= {})[ex.id] = ex;
      }
    }
  });
  return out;
}

export function treeFingerprints(tree: TreeModules): Fingerprints {
  return Object.fromEntries(Object.entries(treeItems(tree)).map(([moduleId, items]) =>
    [moduleId, Object.fromEntries(Object.entries(items).map(([id, ex]) => [id, fingerprint(ex)]))]));
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
