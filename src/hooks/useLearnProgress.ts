/**
 * Thin wrapper around progressStore — preserves the exact same API surface
 * that all consumers expect, but backed by Zustand for sync support.
 */
import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useProgressStore } from '../state/progressStore';
import type { CurriculumLevel, CurriculumUnit, LevelState } from '../core/types/curriculum';
import type { ModuleExerciseResult, ModuleReviewSchedule } from '../core/types/exercise';
import {
  getLevelCompletedModuleCount as _getLevelCompleted,
  isLevelCompleted as _isLevelCompleted,
  isUnitCompleted as _isUnitCompleted,
  computeLevelState,
} from '../data/curriculumLoader';
import {
  getDueReviewModuleIds,
  getDueReviewCount,
} from '../services/spacedRepetition';

/**
 * The points a module's saved result holds for its OWN exercises (second audit
 * round, 2026-11-19): only scores saved under the id of an exercise the module
 * serves now count. Any other score stays in the save, untouched (nothing is
 * deleted on reading), and counts for nothing here: the scores of 31 generated
 * questions of other topics that releases of February to June 2026 served in
 * nine modules (templates keyed to the wrong module: l4u14m2–m5, l5u16m5,
 * l5u17m1, m3, m4, l9u32m5), removed on 17 April and 9 June 2026, before
 * retiring scores existed, so no migration drops them; or a score another
 * tab's write left under the wrong lesson before the merge fix of the same
 * round (state/tabMerge.ts). An exercise id names its module and has never
 * moved between modules, so a score saved for a module's exercise always
 * counts.
 */
export function ownEarned(result: ModuleExerciseResult | undefined, exerciseIds: readonly string[]): number {
  if (!result) return 0;
  const own = new Set(exerciseIds);
  let earned = 0;
  for (const [id, score] of Object.entries(result.scores)) if (own.has(id)) earned += score;
  return earned;
}

export function useLearnProgress() {
  const progress = useProgressStore((s) => s.progress);
  const toggleTask = useProgressStore((s) => s.toggleTask);
  const completeModule = useProgressStore((s) => s.completeModule);
  const uncompleteModule = useProgressStore((s) => s.uncompleteModule);
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const markExercisesPassed = useProgressStore((s) => s.markExercisesPassed);
  const scheduleModuleReview = useProgressStore((s) => s.scheduleModuleReview);
  const recordReviewResult = useProgressStore((s) => s.recordReviewResult);
  const backfillReviewSchedules = useProgressStore((s) => s.backfillReviewSchedules);
  const unlockLevel = useProgressStore((s) => s.unlockLevel);

  // One-time backfill for modules completed before SRS existed
  const backfillDone = useRef(false);
  useEffect(() => {
    if (backfillDone.current) return;
    if (progress.completedModules.length === 0) return;
    const existing = progress.reviewSchedules ?? {};
    const needsBackfill = progress.completedModules.some((id) => !existing[id]);
    if (!needsBackfill) return;
    backfillDone.current = true;
    backfillReviewSchedules();
  }, [progress.completedModules, progress.reviewSchedules, backfillReviewSchedules]);

  const isModuleCompleted = useCallback(
    (moduleId: string) => progress.completedModules.includes(moduleId),
    [progress.completedModules],
  );

  const isTaskCompleted = useCallback(
    (moduleId: string, taskId: string) =>
      (progress.moduleProgress[moduleId] ?? []).includes(taskId),
    [progress.moduleProgress],
  );

  const getModuleCompletedTaskCount = useCallback(
    (moduleId: string) => (progress.moduleProgress[moduleId] ?? []).length,
    [progress.moduleProgress],
  );

  const getUnitCompletedModuleCount = useCallback(
    (moduleIds: string[]) =>
      moduleIds.filter((id) => progress.completedModules.includes(id)).length,
    [progress.completedModules],
  );

  // Exercise tracking

  const getModuleExerciseResult = useCallback(
    (moduleId: string): ModuleExerciseResult | undefined =>
      (progress.exerciseResults ?? {})[moduleId],
    [progress.exerciseResults],
  );

  /** A module's saved score out of its exercises (`exerciseIds`: the ids it serves now), counted by `ownEarned`. */
  const getModuleExerciseScore = useCallback(
    (moduleId: string, exerciseIds: readonly string[]): { earned: number; total: number } =>
      ({ earned: ownEarned((progress.exerciseResults ?? {})[moduleId], exerciseIds), total: exerciseIds.length }),
    [progress.exerciseResults],
  );

  /** The module's check passed: by a passing run, or with 80 % of its exercises' points saved (`ownEarned`). */
  const isModuleExercisesPassed = useCallback(
    (moduleId: string, exerciseIds: readonly string[]): boolean => {
      if (exerciseIds.length === 0) return true;
      const result = (progress.exerciseResults ?? {})[moduleId];
      if (!result) return false;
      if (result.passed) return true;
      return ownEarned(result, exerciseIds) >= exerciseIds.length * 0.8;
    },
    [progress.exerciseResults],
  );

  // Level-aware helpers
  const getLevelCompletedModuleCount = useCallback(
    (level: CurriculumLevel) => _getLevelCompleted(level, progress.completedModules),
    [progress.completedModules],
  );

  const isLevelCompleted = useCallback(
    (level: CurriculumLevel) => _isLevelCompleted(level, progress.completedModules),
    [progress.completedModules],
  );

  const isUnitCompleted = useCallback(
    (unit: CurriculumUnit) => _isUnitCompleted(unit, progress.completedModules),
    [progress.completedModules],
  );

  const getLevelState = useCallback(
    (level: CurriculumLevel, allLevels: CurriculumLevel[]): LevelState =>
      computeLevelState(level, allLevels, progress.completedModules, progress.unlockedLevels),
    [progress.completedModules, progress.unlockedLevels],
  );

  // Spaced repetition

  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const getReviewQueue = useCallback(
    () => getDueReviewModuleIds(progress, now),
    [progress, now],
  );

  const reviewDueCount = useMemo(
    () => getDueReviewCount(progress, now),
    [progress, now],
  );

  const getModuleReviewSchedule = useCallback(
    (moduleId: string): ModuleReviewSchedule | undefined =>
      (progress.reviewSchedules ?? {})[moduleId],
    [progress.reviewSchedules],
  );

  return {
    progress,
    toggleTask,
    completeModule,
    uncompleteModule,
    isModuleCompleted,
    isTaskCompleted,
    getModuleCompletedTaskCount,
    getUnitCompletedModuleCount,
    getLevelCompletedModuleCount,
    isLevelCompleted,
    isUnitCompleted,
    getLevelState,
    unlockLevel,
    // Exercise tracking
    recordExerciseResult,
    markExercisesPassed,
    getModuleExerciseResult,
    getModuleExerciseScore,
    isModuleExercisesPassed,
    // Spaced repetition
    scheduleModuleReview,
    recordReviewResult,
    getReviewQueue,
    reviewDueCount,
    getModuleReviewSchedule,
  };
}
