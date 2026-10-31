import { describe, it, expect } from 'vitest';
import {
  REVIEW_INTERVALS_MS,
  createInitialSchedule,
  updateScheduleAfterReview,
  isDueForReview,
  getDueReviewModuleIds,
  getDueReviewCount,
  backfillSchedules,
  describeNextReview,
  getIntervalSpan,
} from '../spacedRepetition';
import type { CurriculumProgress } from '../../core/types/curriculum';

const DAY = 86_400_000;
const BASE = 1_700_000_000_000; // fixed timestamp

function makeProgress(overrides: Partial<CurriculumProgress> = {}): CurriculumProgress {
  return {
    completedModules: [],
    moduleProgress: {},
    exerciseResults: {},
    ...overrides,
  };
}

describe('spacedRepetition', () => {
  describe('REVIEW_INTERVALS_MS', () => {
    it('has 6 levels', () => {
      expect(REVIEW_INTERVALS_MS).toHaveLength(6);
    });

    it('intervals are strictly increasing', () => {
      for (let i = 1; i < REVIEW_INTERVALS_MS.length; i++) {
        expect(REVIEW_INTERVALS_MS[i]).toBeGreaterThan(REVIEW_INTERVALS_MS[i - 1]);
      }
    });
  });

  describe('createInitialSchedule', () => {
    it('creates a schedule with first review in 1 day', () => {
      const schedule = createInitialSchedule(BASE);
      expect(schedule.completedAt).toBe(BASE);
      expect(schedule.nextReviewAt).toBe(BASE + 1 * DAY);
      expect(schedule.intervalLevel).toBe(0);
      expect(schedule.reviewCount).toBe(0);
      expect(schedule.lastReviewedAt).toBe(BASE);
    });
  });

  describe('updateScheduleAfterReview', () => {
    it('advances interval level on pass', () => {
      const initial = createInitialSchedule(BASE);
      const after = updateScheduleAfterReview(initial, true, BASE + DAY);

      expect(after.intervalLevel).toBe(1);
      expect(after.nextReviewAt).toBe(BASE + DAY + 3 * DAY);
      expect(after.reviewCount).toBe(1);
      expect(after.lastReviewedAt).toBe(BASE + DAY);
    });

    it('resets to level 0 on fail', () => {
      const atLevel3 = {
        ...createInitialSchedule(BASE),
        intervalLevel: 3,
        reviewCount: 3,
      };
      const after = updateScheduleAfterReview(atLevel3, false, BASE + 14 * DAY);

      expect(after.intervalLevel).toBe(0);
      expect(after.nextReviewAt).toBe(BASE + 14 * DAY + 1 * DAY);
      expect(after.reviewCount).toBe(4);
    });

    it('caps at max interval level', () => {
      const atMax = {
        ...createInitialSchedule(BASE),
        intervalLevel: 5,
        reviewCount: 10,
      };
      const after = updateScheduleAfterReview(atMax, true, BASE + 90 * DAY);

      expect(after.intervalLevel).toBe(5); // stays at max
      expect(after.nextReviewAt).toBe(BASE + 90 * DAY + 90 * DAY);
    });
  });

  describe('isDueForReview', () => {
    it('returns true when past review time', () => {
      const schedule = createInitialSchedule(BASE);
      expect(isDueForReview(schedule, BASE + 2 * DAY)).toBe(true);
    });

    it('returns false when before review time', () => {
      const schedule = createInitialSchedule(BASE);
      expect(isDueForReview(schedule, BASE + 0.5 * DAY)).toBe(false);
    });

    it('returns true when exactly at review time', () => {
      const schedule = createInitialSchedule(BASE);
      expect(isDueForReview(schedule, BASE + 1 * DAY)).toBe(true);
    });
  });

  describe('getDueReviewModuleIds', () => {
    it('returns empty for no schedules', () => {
      const progress = makeProgress();
      expect(getDueReviewModuleIds(progress, BASE)).toEqual([]);
    });

    it('returns due modules sorted most-overdue-first', () => {
      const progress = makeProgress({
        reviewSchedules: {
          m1: { ...createInitialSchedule(BASE - 3 * DAY) },          // 2 days overdue
          m2: { ...createInitialSchedule(BASE - 10 * DAY) },         // 9 days overdue
          m3: { ...createInitialSchedule(BASE + 1 * DAY) },          // not due yet
        },
      });

      const result = getDueReviewModuleIds(progress, BASE);
      expect(result).toEqual(['m2', 'm1']); // m2 more overdue
    });
  });

  describe('getDueReviewCount', () => {
    it('counts due modules correctly', () => {
      const progress = makeProgress({
        reviewSchedules: {
          m1: { ...createInitialSchedule(BASE - 3 * DAY) },
          m2: { ...createInitialSchedule(BASE - 10 * DAY) },
          m3: { ...createInitialSchedule(BASE + 1 * DAY) },
        },
      });
      expect(getDueReviewCount(progress, BASE)).toBe(2);
    });
  });

  describe('backfillSchedules', () => {
    it('creates schedules for completed modules without them', () => {
      const progress = makeProgress({
        completedModules: ['l1u1m1', 'l1u1m2'],
      });

      const result = backfillSchedules(progress, BASE);
      expect(Object.keys(result)).toEqual(['l1u1m1', 'l1u1m2']);
      expect(result['l1u1m1'].nextReviewAt).toBe(BASE); // due immediately
    });

    it('preserves existing schedules', () => {
      const existing = createInitialSchedule(BASE - 5 * DAY);
      const progress = makeProgress({
        completedModules: ['l1u1m1', 'l1u1m2'],
        reviewSchedules: { l1u1m1: existing },
      });

      const result = backfillSchedules(progress, BASE);
      expect(result['l1u1m1']).toBe(existing);
      expect(result['l1u1m2'].nextReviewAt).toBe(BASE);
    });
  });

  describe('describeNextReview (language-neutral; worded by review.when.*)', () => {
    it('dueNow when overdue', () => {
      const schedule = createInitialSchedule(BASE - 2 * DAY);
      expect(describeNextReview(schedule, BASE)).toEqual({ kind: 'dueNow' });
    });

    it('dueSoon for less than 1 hour', () => {
      const schedule = { ...createInitialSchedule(BASE), nextReviewAt: BASE + 30 * 60 * 1000 };
      expect(describeNextReview(schedule, BASE)).toEqual({ kind: 'dueSoon' });
    });

    it('hours when less than a day', () => {
      const schedule = { ...createInitialSchedule(BASE), nextReviewAt: BASE + 5 * 60 * 60 * 1000 };
      expect(describeNextReview(schedule, BASE)).toEqual({ kind: 'in', unit: 'hours', count: 5 });
    });

    it('1 day and 4 days', () => {
      expect(describeNextReview({ nextReviewAt: BASE + DAY }, BASE)).toEqual({ kind: 'in', unit: 'days', count: 1 });
      expect(describeNextReview({ nextReviewAt: BASE + 4 * DAY }, BASE)).toEqual({ kind: 'in', unit: 'days', count: 4 });
    });

    it('weeks (7-13 days = 1 week, 14 = 2 weeks)', () => {
      expect(describeNextReview({ nextReviewAt: BASE + 10 * DAY }, BASE)).toEqual({ kind: 'in', unit: 'weeks', count: 1 });
      expect(describeNextReview({ nextReviewAt: BASE + 14 * DAY }, BASE)).toEqual({ kind: 'in', unit: 'weeks', count: 2 });
    });

    it('months', () => {
      expect(describeNextReview({ nextReviewAt: BASE + 45 * DAY }, BASE)).toEqual({ kind: 'in', unit: 'months', count: 1 });
      expect(describeNextReview({ nextReviewAt: BASE + 60 * DAY }, BASE)).toEqual({ kind: 'in', unit: 'months', count: 2 });
    });
  });

  describe('getIntervalSpan', () => {
    it('returns each level as a count of days/weeks/months', () => {
      expect(getIntervalSpan(0)).toEqual({ unit: 'days', count: 1 });
      expect(getIntervalSpan(1)).toEqual({ unit: 'days', count: 3 });
      expect(getIntervalSpan(2)).toEqual({ unit: 'weeks', count: 1 });
      expect(getIntervalSpan(3)).toEqual({ unit: 'weeks', count: 2 });
      expect(getIntervalSpan(4)).toEqual({ unit: 'months', count: 1 });
      expect(getIntervalSpan(5)).toEqual({ unit: 'months', count: 3 });
    });

    it('matches REVIEW_INTERVALS_MS', () => {
      const DAYS = { days: 1, weeks: 7, months: 30 } as const;
      REVIEW_INTERVALS_MS.forEach((ms, level) => {
        const { unit, count } = getIntervalSpan(level);
        expect(count * DAYS[unit] * DAY).toBe(ms);
      });
    });

    it('clamps to max for out-of-range', () => {
      expect(getIntervalSpan(99)).toEqual({ unit: 'months', count: 3 });
    });
  });
});
