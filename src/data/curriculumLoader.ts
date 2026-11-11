/**
 * Lightweight curriculum data loader — enables code-splitting of L1–L9 data.
 *
 * LEVEL_METADATA is statically available (~2 KB) for card rendering.
 * Full level data (units/modules/concepts/tasks) loads on demand via loadLevel().
 *
 * All helper functions here are self-contained — they do NOT import from
 * core/constants/levels.ts, curriculum.ts, or levelHelpers.ts, which would
 * transitively pull all 9 curriculum files into a single chunk.
 */
import type {
  CurriculumLevel,
  CurriculumUnit,
  CurriculumModule,
  CurriculumProgress,
  LevelState,
} from '../core/types/curriculum';
import type { ContentLanguage } from '../i18n/content/types';
import { loadCurriculumOverlay } from '../i18n/content/overlayLoader';
import { applyCurriculumOverlay } from '../i18n/content/contentResolver';
import { translateLevelMetadata } from '../i18n/content/levelMetaResolver';

// ─── Lightweight metadata (own module, re-exported) ─────────────────────────

export { LEVEL_METADATA, type LevelMeta } from './levelMetadata';
import { LEVEL_METADATA, type LevelMeta } from './levelMetadata';
import { isOptionalModuleId } from '../core/constants/optionalCurriculum';

// ─── Dynamic level loading ───────────────────────────────────────────────────

const LEVEL_IMPORTERS: Record<string, () => Promise<Record<string, CurriculumUnit[]>>> = {
  l1: () => import('../core/constants/curriculumL1'),
  l2: () => import('../core/constants/curriculumL2'),
  l3: () => import('../core/constants/curriculumL3'),
  l4: () => import('../core/constants/curriculumL4'),
  l5: () => import('../core/constants/curriculumL5'),
  l6: () => import('../core/constants/curriculumL6'),
  l7: () => import('../core/constants/curriculumL7'),
  l8: () => import('../core/constants/curriculumL8'),
  l9: () => import('../core/constants/curriculumL9'),
};

const UNITS_KEYS: Record<string, string> = {
  l1: 'L1_UNITS', l2: 'L2_UNITS', l3: 'L3_UNITS',
  l4: 'L4_UNITS', l5: 'L5_UNITS', l6: 'L6_UNITS',
  l7: 'L7_UNITS', l8: 'L8_UNITS', l9: 'L9_UNITS',
};

const levelCache = new Map<string, CurriculumLevel>();

export async function loadLevel(
  levelId: string,
  lang: ContentLanguage = 'en',
): Promise<CurriculumLevel | undefined> {
  const cacheKey = `${lang}:${levelId}`;
  const cached = levelCache.get(cacheKey);
  if (cached) return cached;

  const meta = LEVEL_METADATA.find((m) => m.id === levelId);
  if (!meta) return undefined;

  const importer = LEVEL_IMPORTERS[levelId];
  if (!importer) return undefined;

  // Load English data + translation overlay in parallel
  const [mod, overlay] = await Promise.all([
    importer(),
    loadCurriculumOverlay(lang, levelId),
  ]);
  const units: CurriculumUnit[] = mod[UNITS_KEYS[levelId]] ?? [];

  // Apply translated level metadata
  const translatedMeta = translateLevelMetadata([meta], lang)[0];

  let level: CurriculumLevel = {
    id: translatedMeta.id,
    number: translatedMeta.number,
    title: translatedMeta.title,
    description: translatedMeta.description,
    difficulty: translatedMeta.difficulty,
    difficultyLabel: translatedMeta.difficultyLabel,
    accentColor: translatedMeta.accentColor,
    prerequisites: translatedMeta.prerequisites,
    parallel: translatedMeta.parallel,
    comingSoon: translatedMeta.comingSoon,
    units,
  };

  // Apply curriculum content overlay (unit/module translations)
  level = applyCurriculumOverlay(level, overlay);

  // Every PT/ES level has an overlay, so null there means the chunk failed to
  // load: don't pin the English fallback for the session — retry next time.
  if (lang === 'en' || overlay) levelCache.set(cacheKey, level);
  return level;
}

export async function loadAllLevels(
  lang: ContentLanguage = 'en',
): Promise<CurriculumLevel[]> {
  const results = await Promise.all(LEVEL_METADATA.map((m) => loadLevel(m.id, lang)));
  return results.filter((l): l is CurriculumLevel => l !== undefined);
}

// ─── Pure utility functions (no static curriculum data imports) ──────────────

export function getLevelModuleCount(level: CurriculumLevel): number {
  return level.units.filter((u) => !u.optional).reduce((sum, u) => sum + u.modules.length, 0);
}

export function getLevelCompletedModuleCount(
  level: CurriculumLevel,
  completedModules: string[],
): number {
  let count = 0;
  for (const unit of level.units) {
    if (unit.optional) continue;
    for (const mod of unit.modules) {
      if (completedModules.includes(mod.id)) count++;
    }
  }
  return count;
}

export function isLevelCompleted(
  level: CurriculumLevel,
  completedModules: string[],
): boolean {
  const total = getLevelModuleCount(level);
  if (total === 0) return false;
  return getLevelCompletedModuleCount(level, completedModules) === total;
}

export function isUnitCompleted(
  unit: CurriculumUnit,
  completedModules: string[],
): boolean {
  if (unit.modules.length === 0) return false;
  return unit.modules.every((m) => completedModules.includes(m.id));
}

export function computeLevelState(
  level: CurriculumLevel,
  allLevels: CurriculumLevel[],
  completedModules: string[],
  unlockedLevels: readonly string[] = [],
): LevelState {
  if (level.comingSoon) return 'coming-soon';
  // "Unlock anyway" (D-10) lifts the level's prerequisite, nothing else.
  for (const prereqId of unlockedLevels.includes(level.id) ? [] : level.prerequisites) {
    const prereq = allLevels.find((l) => l.id === prereqId);
    if (prereq && !isLevelCompleted(prereq, completedModules)) return 'locked';
  }
  const total = getLevelModuleCount(level);
  if (total === 0) return 'coming-soon';
  const completed = getLevelCompletedModuleCount(level, completedModules);
  if (completed === total) return 'completed';
  if (completed > 0) return 'in-progress';
  return 'available';
}

// ─── Metadata-only helpers (no full level data needed) ───────────────────────

/** Count completed modules for a level using module ID prefix convention */
function countLevelCompletedModulesMeta(levelId: string, completedModules: string[]): number {
  return completedModules.filter((id) => id.startsWith(levelId) && !isOptionalModuleId(id)).length;
}

function isLevelCompletedMeta(meta: LevelMeta, completedModules: string[]): boolean {
  if (meta.moduleCount === 0) return false;
  return countLevelCompletedModulesMeta(meta.id, completedModules) >= meta.moduleCount;
}

export function computeLevelStateMeta(
  meta: LevelMeta,
  allMeta: LevelMeta[],
  completedModules: string[],
  unlockedLevels: readonly string[] = [],
): LevelState {
  if (meta.comingSoon) return 'coming-soon';
  for (const prereqId of unlockedLevels.includes(meta.id) ? [] : meta.prerequisites) {
    const prereq = allMeta.find((m) => m.id === prereqId);
    if (prereq && !isLevelCompletedMeta(prereq, completedModules)) return 'locked';
  }
  if (meta.moduleCount === 0) return 'coming-soon';
  const completed = countLevelCompletedModulesMeta(meta.id, completedModules);
  if (completed >= meta.moduleCount) return 'completed';
  if (completed > 0) return 'in-progress';
  return 'available';
}

export function getLevelCompletedCountMeta(levelId: string, completedModules: string[]): number {
  return countLevelCompletedModulesMeta(levelId, completedModules);
}

// ─── Module navigation helpers ───────────────────────────────────────────────

export function areModulePrereqsMet(
  module: CurriculumModule,
  progress: CurriculumProgress,
): boolean {
  // A level unlocked out of order (D-10) waives the prerequisites that lie in
  // OTHER levels (its first module waits for the previous level's last one);
  // the order inside the level stays.
  const unlocked = progress.unlockedLevels?.includes(module.levelId) ?? false;
  return module.prerequisites.every(
    (prereq) => progress.completedModules.includes(prereq) || (unlocked && !prereq.startsWith(`${module.levelId}u`)),
  );
}

/**
 * The lessons Next / Previous walk through inside a level: its required units
 * for a required module; for an optional unit (guitar notation, a track —
 * wave 2) that unit's own lessons only, so the last lesson of one optional
 * unit never leads into another (a track ends on its closing card instead).
 */
function levelSequenceOf(moduleId: string, level: CurriculumLevel): CurriculumModule[] {
  if (!isOptionalModuleId(moduleId)) return level.units.filter((u) => !u.optional).flatMap((u) => u.modules);
  return level.units.find((u) => u.modules.some((m) => m.id === moduleId))?.modules ?? [];
}

export function getNextModuleInLevel(
  currentModuleId: string,
  level: CurriculumLevel,
): CurriculumModule | undefined {
  const allModules = levelSequenceOf(currentModuleId, level);
  const index = allModules.findIndex((m) => m.id === currentModuleId);
  if (index === -1 || index === allModules.length - 1) return undefined;
  return allModules[index + 1];
}

export function getPreviousModuleInLevel(
  currentModuleId: string,
  level: CurriculumLevel,
): CurriculumModule | undefined {
  const allModules = levelSequenceOf(currentModuleId, level);
  const index = allModules.findIndex((m) => m.id === currentModuleId);
  if (index <= 0) return undefined;
  return allModules[index - 1];
}

export function findNextIncompleteModule(
  progress: CurriculumProgress,
  levels: CurriculumLevel[],
): { module: CurriculumModule; unit: CurriculumUnit; level: CurriculumLevel } | undefined {
  const candidates: { module: CurriculumModule; unit: CurriculumUnit; level: CurriculumLevel }[] = [];
  for (const level of levels) {
    if (level.comingSoon) continue;
    for (const unit of level.units) {
      if (unit.optional) continue;
      for (const mod of unit.modules) {
        if (mod.comingSoon) continue;
        if (progress.completedModules.includes(mod.id)) continue;
        if (!areModulePrereqsMet(mod, progress)) continue;
        candidates.push({ module: mod, unit, level });
      }
    }
  }
  if (candidates.length === 0) return undefined;
  const inProgress = candidates.find((c) => progress.moduleProgress[c.module.id]?.length > 0);
  return inProgress ?? candidates[0];
}

export function getDefaultProgress(): CurriculumProgress {
  return { completedModules: [], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} };
}
