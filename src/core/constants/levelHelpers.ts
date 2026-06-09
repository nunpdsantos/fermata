import type { CurriculumLevel, CurriculumUnit, LevelState } from '../types/curriculum';
import { CURRICULUM_LEVELS } from './levels';

export function getLevelById(levelId: string): CurriculumLevel | undefined {
  return CURRICULUM_LEVELS.find((l) => l.id === levelId);
}

export function getLevelForUnit(unitId: string): CurriculumLevel | undefined {
  return CURRICULUM_LEVELS.find((l) => l.units.some((u) => u.id === unitId));
}

export function getLevelForModule(moduleId: string): CurriculumLevel | undefined {
  return CURRICULUM_LEVELS.find((l) =>
    l.units.some((u) => u.modules.some((m) => m.id === moduleId))
  );
}

export function getLevelModuleCount(level: CurriculumLevel): number {
  return level.units.reduce((sum, u) => sum + u.modules.length, 0);
}

export function getLevelCompletedModuleCount(
  level: CurriculumLevel,
  completedModules: string[]
): number {
  let count = 0;
  for (const unit of level.units) {
    for (const mod of unit.modules) {
      if (completedModules.includes(mod.id)) count++;
    }
  }
  return count;
}

export function isLevelCompleted(level: CurriculumLevel, completedModules: string[]): boolean {
  const totalModules = getLevelModuleCount(level);
  if (totalModules === 0) return false;
  return getLevelCompletedModuleCount(level, completedModules) === totalModules;
}

export function isUnitCompleted(unit: CurriculumUnit, completedModules: string[]): boolean {
  if (unit.modules.length === 0) return false;
  return unit.modules.every((m) => completedModules.includes(m.id));
}

export function computeLevelState(
  level: CurriculumLevel,
  completedModules: string[]
): LevelState {
  if (level.comingSoon) return 'coming-soon';

  // Check prerequisites
  for (const prereqId of level.prerequisites) {
    const prereqLevel = getLevelById(prereqId);
    if (prereqLevel && !isLevelCompleted(prereqLevel, completedModules)) {
      return 'locked';
    }
  }

  const total = getLevelModuleCount(level);
  if (total === 0) return 'coming-soon';

  const completed = getLevelCompletedModuleCount(level, completedModules);
  if (completed === total) return 'completed';
  if (completed > 0) return 'in-progress';
  return 'available';
}
