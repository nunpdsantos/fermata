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

  const getModuleExerciseScore = useCallback(
    (moduleId: string, totalExercises: number): { earned: number; total: number } => {
      const result = (progress.exerciseResults ?? {})[moduleId];
      if (!result) return { earned: 0, total: totalExercises };
      const earned = Object.values(result.scores).reduce<number>((sum, s) => sum + s, 0);
      return { earned, total: totalExercises };
    },
    [progress.exerciseResults],
  );

  const isModuleExercisesPassed = useCallback(
    (moduleId: string, totalExercises: number): boolean => {
      if (totalExercises === 0) return true;
      const result = (progress.exerciseResults ?? {})[moduleId];
      if (!result) return false;
      if (result.passed) return true;
      const earned = Object.values(result.scores).reduce<number>((sum, s) => sum + s, 0);
      return earned >= totalExercises * 0.8;
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
