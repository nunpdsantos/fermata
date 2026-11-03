/**
 * Every rhythm the curriculum shows (test helper, not a test): lesson
 * concepts ('l4u14m2 concept 1', 1-based) and question stimuli (by exercise
 * id), read from the real English data.
 */
import type { RhythmPattern } from '../../../core/types/exercise';
import { EN_UNITS, enExercisesFor } from '../../../i18n/content/__tests__/overlayEntries';

export function curriculumRhythms(): { where: string; pattern: RhythmPattern }[] {
  const out: { where: string; pattern: RhythmPattern }[] = [];
  for (let n = 1; n <= 9; n++) {
    for (const unit of EN_UNITS[n]) for (const mod of unit.modules) {
      mod.concepts.forEach((c, i) => { if (c.rhythm) out.push({ where: `${mod.id} concept ${i + 1}`, pattern: c.rhythm }); });
    }
    for (const ex of Object.values(enExercisesFor(n)).flat()) {
      if (ex.config.type === 'multiple_choice' && ex.config.rhythm) out.push({ where: ex.id, pattern: ex.config.rhythm });
    }
  }
  return out;
}
