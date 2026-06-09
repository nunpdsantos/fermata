/**
 * Zustand store for curriculum progress — replaces useState in useLearnProgress.
 * Enables .subscribe() for sync and direct access from services.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurriculumProgress } from '../core/types/curriculum';
import {
  getDefaultProgress,
} from '../data/curriculumLoader';
import {
  createInitialSchedule,
  updateScheduleAfterReview,
  backfillSchedules,
} from '../services/spacedRepetition';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const SCHEDULE_NUMERIC_FIELDS = [
  'completedAt',
  'nextReviewAt',
  'intervalLevel',
  'reviewCount',
  'lastReviewedAt',
] as const;

/**
 * Shape guard for persisted progress. localStorage contents are
 * user-editable and can be corrupted by anything sharing the origin —
 * never blind-cast them. On any mismatch the caller falls back to defaults.
 */
function isValidPersistedProgress(value: unknown): value is { progress: CurriculumProgress } {
  if (!isPlainObject(value)) return false;
  const progress = value.progress;
  if (!isPlainObject(progress)) return false;
  if (!isStringArray(progress.completedModules)) return false;
  if (!isPlainObject(progress.moduleProgress)) return false;
  if (!Object.values(progress.moduleProgress).every(isStringArray)) return false;
  if (progress.reviewSchedules !== undefined) {
    if (!isPlainObject(progress.reviewSchedules)) return false;
    for (const schedule of Object.values(progress.reviewSchedules)) {
      if (!isPlainObject(schedule)) return false;
      if (SCHEDULE_NUMERIC_FIELDS.some((field) => typeof schedule[field] !== 'number')) {
        return false;
      }
    }
  }
  return true;
}

interface ProgressStore {
  progress: CurriculumProgress;

  // Mutations
  toggleTask: (moduleId: string, taskId: string) => void;
  completeModule: (moduleId: string) => void;
  uncompleteModule: (moduleId: string) => void;
  recordExerciseResult: (moduleId: string, exerciseId: string, score: 0 | 0.5 | 1) => void;
  markExercisesPassed: (moduleId: string) => void;
  scheduleModuleReview: (moduleId: string) => void;
  recordReviewResult: (moduleId: string, passed: boolean) => void;
  backfillReviewSchedules: () => void;

  // Bulk replace (for sync merge)
  replaceProgress: (progress: CurriculumProgress) => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: getDefaultProgress(),

      toggleTask: (moduleId, taskId) =>
        set((state) => {
          const moduleTasks = state.progress.moduleProgress[moduleId] ?? [];
          const isCompleted = moduleTasks.includes(taskId);
          return {
            progress: {
              ...state.progress,
              moduleProgress: {
                ...state.progress.moduleProgress,
                [moduleId]: isCompleted
                  ? moduleTasks.filter((id) => id !== taskId)
                  : [...moduleTasks, taskId],
              },
            },
          };
        }),

      completeModule: (moduleId) =>
        set((state) => {
          if (state.progress.completedModules.includes(moduleId)) return state;
          return {
            progress: {
              ...state.progress,
              completedModules: [...state.progress.completedModules, moduleId],
              reviewSchedules: {
                ...(state.progress.reviewSchedules ?? {}),
                [moduleId]: createInitialSchedule(Date.now()),
              },
            },
          };
        }),

      uncompleteModule: (moduleId) =>
        set((state) => {
          // Drop the review schedule too — an un-completed module must not
          // keep surfacing in the review queue.
          const schedules = { ...(state.progress.reviewSchedules ?? {}) };
          delete schedules[moduleId];
          return {
            progress: {
              ...state.progress,
              completedModules: state.progress.completedModules.filter((id) => id !== moduleId),
              reviewSchedules: schedules,
            },
          };
        }),

      recordExerciseResult: (moduleId, exerciseId, score) =>
        set((state) => {
          const results = state.progress.exerciseResults ?? {};
          const existing = results[moduleId] ?? {
            scores: {},
            totalAttempts: 0,
            lastAttemptAt: 0,
            passed: false,
          };
          return {
            progress: {
              ...state.progress,
              exerciseResults: {
                ...results,
                [moduleId]: {
                  scores: { ...existing.scores, [exerciseId]: score },
                  totalAttempts: existing.totalAttempts + 1,
                  lastAttemptAt: Date.now(),
                  passed: existing.passed,
                },
              },
            },
          };
        }),

      markExercisesPassed: (moduleId) =>
        set((state) => {
          const results = state.progress.exerciseResults ?? {};
          const existing = results[moduleId];
          if (!existing) return state;
          return {
            progress: {
              ...state.progress,
              exerciseResults: {
                ...results,
                [moduleId]: { ...existing, passed: true },
              },
            },
          };
        }),

      scheduleModuleReview: (moduleId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            reviewSchedules: {
              ...(state.progress.reviewSchedules ?? {}),
              [moduleId]: createInitialSchedule(Date.now()),
            },
          },
        })),

      recordReviewResult: (moduleId, passed) =>
        set((state) => {
          const schedules = state.progress.reviewSchedules ?? {};
          const existing = schedules[moduleId];
          if (!existing) return state;
          return {
            progress: {
              ...state.progress,
              reviewSchedules: {
                ...schedules,
                [moduleId]: updateScheduleAfterReview(existing, passed, Date.now()),
              },
            },
          };
        }),

      backfillReviewSchedules: () => {
        const state = get();
        const progress = state.progress;
        if (progress.completedModules.length === 0) return;
        const existing = progress.reviewSchedules ?? {};
        const needsBackfill = progress.completedModules.some((id) => !existing[id]);
        if (!needsBackfill) return;
        set({
          progress: {
            ...progress,
            reviewSchedules: backfillSchedules(progress, Date.now()),
          },
        });
      },

      replaceProgress: (progress) => set({ progress }),
    }),
    {
      name: 'music-theory-progress',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ progress: state.progress }),
      // Migrate from old format (raw CurriculumProgress) to wrapped { progress }
      migrate: (persisted: unknown, version: number) => {
        if (version === 0 || !persisted || typeof persisted !== 'object') {
          // Old format: the stored value IS the CurriculumProgress directly
          // Try to read from old key
          try {
            const raw = localStorage.getItem('music-theory-progress');
            if (raw) {
              const parsed = JSON.parse(raw);
              // If it has completedModules at top level, it's old format
              if (Array.isArray(parsed.completedModules)) {
                return { progress: parsed as CurriculumProgress };
              }
              // If it has state.progress, it's already new format
              if (parsed.state?.progress) {
                return { progress: parsed.state.progress as CurriculumProgress };
              }
            }
          } catch {
            // Fall through to default
          }
          return { progress: getDefaultProgress() };
        }
        return isValidPersistedProgress(persisted)
          ? persisted
          : { progress: getDefaultProgress() };
      },
      // zustand skips migrate() when the stored version matches, so corrupt
      // same-version data must be caught here on the merge path.
      merge: (persisted, current) => {
        if (!isValidPersistedProgress(persisted)) {
          return { ...current, progress: getDefaultProgress() };
        }
        return { ...current, ...persisted };
      },
    },
  ),
);
