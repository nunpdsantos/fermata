/**
 * The identity of an exercise as one short string (W4a): what a saved score —
 * or a saved in-progress check (W4b) — under its id means.
 * - multiple choice: the prompt and the keyed answer (a distractor edit keeps
 *   the question; a new prompt or a new right answer is a new question);
 * - everything else: the config without answer labels (what is built, named
 *   or heard) — prompt rewording keeps the task.
 * The identity snapshot test, the retirement script and the Learn session
 * store all use this one function.
 */
import type { ExerciseConfig, ExerciseDefinition } from '../../core/types/exercise';
import { exerciseIdentity } from './exerciseGenerator';

/** djb2 → 8 hex digits: short, stable, enough to tell two exercises apart. */
function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, '0');
}

export function exerciseFingerprint(ex: Pick<ExerciseDefinition, 'type' | 'prompt'> & { config: ExerciseConfig }): string {
  const c = ex.config;
  if (c.type === 'multiple_choice') return hash(`mc|${ex.prompt}|${c.choices.find((x) => x.correct)?.label ?? ''}`);
  return hash(`${c.type}|${exerciseIdentity(c)}`);
}
