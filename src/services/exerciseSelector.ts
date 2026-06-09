/**
 * Exercise Selector — shuffles exercises for review sessions.
 *
 * Historically this weighted exercises by concept weakness (3x weight for
 * weak concepts), but concept tracking was removed and the exercise runner
 * always calls this with an empty `weakConcepts` array, so the weighting
 * branch was dead in practice and has been removed (WS6). The parameter is
 * kept for call-site compatibility.
 */
import type { ExerciseDefinition } from '../core/types/exercise';

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
 * Return up to `targetCount` exercises in shuffled order (input untouched).
 */
export function selectWeightedExercises(
  exercises: ExerciseDefinition[],
  _weakConcepts: string[],
  targetCount: number,
): ExerciseDefinition[] {
  if (exercises.length === 0) return [];
  return shuffle([...exercises]).slice(0, targetCount);
}
