import { MODULE_INDEX, type ModuleIndexEntry } from './moduleIndex';
import { LEVEL_METADATA } from './curriculumLoader';
import type { CurriculumProgress } from '../core/types/curriculum';

// Levels whose first module requires the previous level's last module
// (L2–L8); L1 starts the track and L9 is the parallel ear-training track.
const CHAINED_LEVELS = new Set(LEVEL_METADATA.filter((l) => l.prerequisites.length > 0).map((l) => l.id));

/**
 * The module the Continue banner should offer, decided from the static
 * module index alone — no curriculum level has to be downloaded (audit
 * W9-10 / W9-19: the overview loaded all nine levels just for this, and a
 * single failed download made the banner vanish).
 *
 * Same rule as findNextIncompleteModule (curriculumLoader.ts): the first
 * incomplete module whose prerequisites are met, preferring one with tasks
 * already ticked. Prerequisites as the curriculum defines them: each module
 * requires the module before it in curriculum order — across a level
 * boundary only when the level itself has a prerequisite level (L2–L8; not
 * L1, not the parallel L9). nextModule.test.ts proves both functions agree
 * on every progress state and fails if the curriculum's prerequisites or
 * order ever change.
 */
export function findNextModuleEntry(progress: CurriculumProgress): ModuleIndexEntry | undefined {
  const done = new Set(progress.completedModules);
  const candidates: ModuleIndexEntry[] = [];
  MODULE_INDEX.forEach((entry, i) => {
    if (done.has(entry.id)) return;
    const prev = MODULE_INDEX[i - 1];
    const requiresPrev = !!prev && (prev.level === entry.level || CHAINED_LEVELS.has(entry.level));
    const prerequisitesMet = !requiresPrev || done.has(prev.id);
    if (prerequisitesMet) candidates.push(entry);
  });
  return candidates.find((c) => (progress.moduleProgress[c.id]?.length ?? 0) > 0) ?? candidates[0];
}
