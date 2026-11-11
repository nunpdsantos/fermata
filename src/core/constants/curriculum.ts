import type { CurriculumUnit, CurriculumModule, CurriculumLevel, CurriculumProgress } from '../types/curriculum';
import { CURRICULUM_LEVELS } from './levels';
import { isOptionalModuleId } from './optionalCurriculum';
export { CURRICULUM_LEVELS } from './levels';
export { getLevelById, getLevelForUnit, getLevelForModule } from './levelHelpers';

// ---------------------------------------------------------------------------
// Helper functions
// These search across ALL levels via CURRICULUM_LEVELS so they work for
// every module in L1–L9, not just the old L1 data.
// ---------------------------------------------------------------------------

function getAllUnits(): CurriculumUnit[] {
  return CURRICULUM_LEVELS.flatMap((l) => l.units);
}

/** Get a module by its ID */
export function getModuleById(moduleId: string): CurriculumModule | undefined {
  for (const unit of getAllUnits()) {
    const module = unit.modules.find((m) => m.id === moduleId);
    if (module) return module;
  }
  return undefined;
}

/** Get the unit that contains a given module */
export function getUnitByModuleId(moduleId: string): CurriculumUnit | undefined {
  return getAllUnits().find((unit) => unit.modules.some((m) => m.id === moduleId));
}

/**
 * The lessons a module's Next / Previous walk through: the required course
 * (every non-optional unit, across levels) for a required module; for an
 * optional unit (guitar notation, a track — wave 2), that unit's own lessons
 * only, so one optional unit never runs on into another.
 */
function sequenceOf(moduleId: string): CurriculumModule[] {
  if (!isOptionalModuleId(moduleId)) return getAllUnits().filter((u) => !u.optional).flatMap((u) => u.modules);
  return getUnitByModuleId(moduleId)?.modules ?? [];
}

/** Get the next module in sequence (across units and levels) */
export function getNextModule(currentModuleId: string): CurriculumModule | undefined {
  const allModules = sequenceOf(currentModuleId);
  const index = allModules.findIndex((m) => m.id === currentModuleId);
  if (index === -1 || index === allModules.length - 1) return undefined;
  return allModules[index + 1];
}

/** Get the previous module in sequence */
export function getPreviousModule(currentModuleId: string): CurriculumModule | undefined {
  const allModules = sequenceOf(currentModuleId);
  const index = allModules.findIndex((m) => m.id === currentModuleId);
  if (index <= 0) return undefined;
  return allModules[index - 1];
}

/** Check if prerequisites are met for a given module */
export function arePrerequisitesMet(moduleId: string, progress: CurriculumProgress): boolean {
  const module = getModuleById(moduleId);
  if (!module) return false;
  return module.prerequisites.every((prereq) => progress.completedModules.includes(prereq));
}

/** Get the next incomplete module for resume — prioritizes in-progress modules.
 *  Accepts levels array to avoid circular dependency with levels.ts.
 */
export function getNextIncompleteModule(
  progress: CurriculumProgress,
  levels?: CurriculumLevel[]
): { module: CurriculumModule; unit: CurriculumUnit; level: CurriculumLevel } | undefined {
  const resolvedLevels = levels ?? CURRICULUM_LEVELS;

  const candidates: { module: CurriculumModule; unit: CurriculumUnit; level: CurriculumLevel }[] = [];
  for (const level of resolvedLevels) {
    if (level.comingSoon) continue;
    for (const unit of level.units) {
      if (unit.optional) continue;
      for (const mod of unit.modules) {
        if (mod.comingSoon) continue;
        if (progress.completedModules.includes(mod.id)) continue;
        if (!arePrerequisitesMet(mod.id, progress)) continue;
        candidates.push({ module: mod, unit, level });
      }
    }
  }
  if (candidates.length === 0) return undefined;
  const inProgress = candidates.find((c) => progress.moduleProgress[c.module.id]?.length > 0);
  return inProgress ?? candidates[0];
}

/** Get the default (empty) progress object */
export function getDefaultProgress(): CurriculumProgress {
  return {
    completedModules: [],
    moduleProgress: {},
  };
}
