/**
 * Spaced Repetition Service — pure functions, zero React imports.
 * All functions accept injectable `now` param for deterministic testing.
 */
import type { ModuleReviewSchedule } from '../core/types/exercise';
import type { CurriculumProgress } from '../core/types/curriculum';

// ─── Constants ──────────────────────────────────────────────────────────────

const DAY_MS = 86_400_000;

/** Interval levels 0-5 → milliseconds */
export const REVIEW_INTERVALS_MS: readonly number[] = [
  1 * DAY_MS,   // Level 0: 1 day
  3 * DAY_MS,   // Level 1: 3 days
  7 * DAY_MS,   // Level 2: 1 week
  14 * DAY_MS,  // Level 3: 2 weeks
  30 * DAY_MS,  // Level 4: 1 month
  90 * DAY_MS,  // Level 5: 3 months
];

const MAX_INTERVAL_LEVEL = REVIEW_INTERVALS_MS.length - 1;

/** Each interval level as a count of days/weeks/months (worded by the UI). */
const INTERVAL_SPANS: ReadonlyArray<{ unit: 'days' | 'weeks' | 'months'; count: number }> = [
  { unit: 'days', count: 1 },
  { unit: 'days', count: 3 },
  { unit: 'weeks', count: 1 },
  { unit: 'weeks', count: 2 },
  { unit: 'months', count: 1 },
  { unit: 'months', count: 3 },
];

// ─── Schedule Lifecycle ─────────────────────────────────────────────────────

/** Create an initial review schedule when a module is first completed. */
export function createInitialSchedule(now: number): ModuleReviewSchedule {
  return {
    completedAt: now,
    nextReviewAt: now + REVIEW_INTERVALS_MS[0],
    intervalLevel: 0,
    reviewCount: 0,
    lastReviewedAt: now,
  };
}

/** Update a schedule after a review attempt. Pass → advance interval. Fail → reset to 1 day. */
export function updateScheduleAfterReview(
  schedule: ModuleReviewSchedule,
  passed: boolean,
  now: number,
): ModuleReviewSchedule {
  const nextLevel = passed
    ? Math.min(schedule.intervalLevel + 1, MAX_INTERVAL_LEVEL)
    : 0;

  return {
    ...schedule,
    nextReviewAt: now + REVIEW_INTERVALS_MS[nextLevel],
    intervalLevel: nextLevel,
    reviewCount: schedule.reviewCount + 1,
    lastReviewedAt: now,
  };
}

// ─── Query Functions ────────────────────────────────────────────────────────

/** Check if a module is due for review right now. */
export function isDueForReview(schedule: ModuleReviewSchedule, now: number): boolean {
  return now >= schedule.nextReviewAt;
}

/** Get all module IDs that are due for review, sorted most-overdue-first. */
export function getDueReviewModuleIds(progress: CurriculumProgress, now: number): string[] {
  const schedules = progress.reviewSchedules;
  if (!schedules) return [];

  const due: { id: string; overdueBy: number }[] = [];

  for (const [moduleId, schedule] of Object.entries(schedules)) {
    if (now >= schedule.nextReviewAt) {
      due.push({ id: moduleId, overdueBy: now - schedule.nextReviewAt });
    }
  }

  due.sort((a, b) => b.overdueBy - a.overdueBy);
  return due.map((d) => d.id);
}

/** Count how many modules are due for review. */
export function getDueReviewCount(progress: CurriculumProgress, now: number): number {
  const schedules = progress.reviewSchedules;
  if (!schedules) return 0;

  let count = 0;
  for (const schedule of Object.values(schedules)) {
    if (now >= schedule.nextReviewAt) count++;
  }
  return count;
}

/**
 * Backfill schedules for modules completed before SRS existed.
 * Sets them as due immediately so they appear in the review queue.
 */
export function backfillSchedules(
  progress: CurriculumProgress,
  now: number,
): Record<string, ModuleReviewSchedule> {
  const existing = progress.reviewSchedules ?? {};
  const backfilled: Record<string, ModuleReviewSchedule> = { ...existing };

  for (const moduleId of progress.completedModules) {
    if (!backfilled[moduleId]) {
      backfilled[moduleId] = {
        completedAt: now,
        nextReviewAt: now, // Due immediately
        intervalLevel: 0,
        reviewCount: 0,
        lastReviewedAt: 0,
      };
    }
  }

  return backfilled;
}

// ─── Display Helpers ────────────────────────────────────────────────────────

// These return language-neutral values; the UI words them through i18n
// (`review.when.*`, `review.span.*`) so PT/ES never see English (W6-17).

export type ReviewTimeUnit = 'hours' | 'days' | 'weeks' | 'months';

/** When the next review falls, relative to `now`. */
export type NextReviewTime =
  | { kind: 'dueNow' }
  | { kind: 'dueSoon' }
  | { kind: 'in'; unit: ReviewTimeUnit; count: number };

/** Describe the next review time relative to now. */
export function describeNextReview(schedule: Pick<ModuleReviewSchedule, 'nextReviewAt'>, now: number): NextReviewTime {
  const diff = schedule.nextReviewAt - now;
  if (diff <= 0) return { kind: 'dueNow' };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return { kind: 'dueSoon' };
  if (hours < 24) return { kind: 'in', unit: 'hours', count: hours };

  const days = Math.floor(diff / DAY_MS);
  if (days < 7) return { kind: 'in', unit: 'days', count: days };
  if (days < 30) return { kind: 'in', unit: 'weeks', count: Math.floor(days / 7) };
  return { kind: 'in', unit: 'months', count: Math.max(1, Math.floor(days / 30)) };
}

/** Length of a review interval level (0-5), as a count of days/weeks/months. */
export function getIntervalSpan(intervalLevel: number): { unit: Exclude<ReviewTimeUnit, 'hours'>; count: number } {
  return INTERVAL_SPANS[intervalLevel] ?? INTERVAL_SPANS[MAX_INTERVAL_LEVEL];
}
