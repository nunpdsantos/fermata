/**
 * Weighted Exercise Selector — reorders exercises for review sessions
 * based on concept weakness. Exercises touching weak concepts get 3x weight.
 * Called with an empty `weakConcepts` array it degrades to a plain Fisher-Yates
 * shuffle — the path the exercise runner uses now that concept tracking was removed.
 */
import type { ExerciseDefinition } from '../core/types/exercise';
import { getExerciseConcepts } from './conceptTagger';

/**
 * Fisher-Yates shuffle (in-place, returns same array).
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Select and reorder exercises for a review session based on concept weakness.
 *
 * Algorithm:
 * 1. Tag each exercise with concepts via getExerciseConcepts
 * 2. Exercises touching weak concepts get weight 3, others get weight 1
 * 3. Build weighted pool, shuffle, pick targetCount unique exercises
 *
 * For first-time module exercises (not review), pass empty weakConcepts
 * to preserve pedagogical ordering.
 */
export function selectWeightedExercises(
  exercises: ExerciseDefinition[],
  weakConcepts: string[],
  targetCount: number,
): ExerciseDefinition[] {
  if (exercises.length === 0) return [];
  if (weakConcepts.length === 0 || targetCount >= exercises.length) {
    // No weak concepts or requesting all exercises — return shuffled copy
    return shuffle([...exercises]).slice(0, targetCount);
  }

  const weakSet = new Set(weakConcepts);

  // Build weighted pool: each exercise appears 1x or 3x
  const pool: ExerciseDefinition[] = [];
  for (const ex of exercises) {
    const concepts = getExerciseConcepts(ex.config, ex.id);
    const touchesWeak = concepts.some((c) => weakSet.has(c));
    const weight = touchesWeak ? 3 : 1;
    for (let i = 0; i < weight; i++) {
      pool.push(ex);
    }
  }

  // Shuffle the pool
  shuffle(pool);

  // Pick unique exercises up to targetCount
  const seen = new Set<string>();
  const selected: ExerciseDefinition[] = [];
  for (const ex of pool) {
    if (seen.has(ex.id)) continue;
    seen.add(ex.id);
    selected.push(ex);
    if (selected.length >= targetCount) break;
  }

  return selected;
}
