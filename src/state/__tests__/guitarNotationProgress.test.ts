import { beforeEach, describe, expect, it } from 'vitest';
import { useProgressStore, PROGRESS_STORE_VERSION } from '../progressStore';
import { loadAllLevels, computeLevelState, computeLevelStateMeta, getLevelModuleCount, getLevelCompletedModuleCount, getLevelCompletedCountMeta, getNextModuleInLevel, getPreviousModuleInLevel, findNextIncompleteModule, areModulePrereqsMet, LEVEL_METADATA } from '../../data/curriculumLoader';
import { findNextModuleEntry } from '../../data/nextModule';
import { OPTIONAL_UNIT_IDS, isOptionalModuleId } from '../../core/constants/optionalCurriculum';
import { getLevelModuleCount as coreCount, isLevelCompleted as coreCompleted } from '../../core/constants/levelHelpers';
import type { CurriculumProgress } from '../../core/types/curriculum';

// Frozen pre-release IDs, NOT collected from today's curriculum: the new
// optional modules must be absent from a production-shaped v2 save.
const completed = [
  'l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u1m4', 'l1u2m1', 'l1u2m2', 'l1u3m1', 'l1u3m2', 'l1u3m3', 'l1u3m4',
  'l2u4m1', 'l2u4m2', 'l2u5m1', 'l2u5m2', 'l2u5m3', 'l2u6m1', 'l2u6m2', 'l2u7m1', 'l2u7m2', 'l2u7m3', 'l2u7m4', 'l2u7m5',
];
const progress: CurriculumProgress = {
  completedModules: completed,
  moduleProgress: { l1u1m1: ['l1u1m1t1', 'l1u1m1t2'], l3u9m1: ['l3u9m1t1'] },
  exemptedModules: ['l4u12m1'],
  exerciseResults: {
    l1u1m1: { scores: { l1u1m1e1: 1, l1u1m1e2: 0.5, l1u1m1g6: 0 }, totalAttempts: 7, lastAttemptAt: 1793000000000, passed: true },
    l2u5m2: { scores: { l2u5m2e1: 1 }, totalAttempts: 5, lastAttemptAt: 1793000000000, passed: true },
  },
  reviewSchedules: {
    l1u1m1: { completedAt: 1793000000000, nextReviewAt: 1793086400000, intervalLevel: 1, reviewCount: 2, lastReviewedAt: 1793000000000 },
  },
};

beforeEach(() => localStorage.clear());

describe('W10-08: optional guitar notation cannot change existing progress', () => {
  it.each([false, true])('rehydrates a v2 L1–L2-complete save unchanged (explicit unlock = %s)', async (withUnlock) => {
    const saved = { state: { progress: { ...progress, ...(withUnlock ? { unlockedLevels: ['l6'] } : {}) } }, version: 2 };
    const raw = JSON.stringify(saved);
    localStorage.setItem('music-theory-progress', raw);
    await useProgressStore.persist.rehydrate();
    const loaded = useProgressStore.getState().progress;
    expect(PROGRESS_STORE_VERSION).toBe(2);
    expect(loaded).toEqual(saved.state.progress); // includes exemptions, scores, passed, tasks, SRS
    expect(localStorage.getItem('music-theory-progress')).toBe(raw);
    const levels = await loadAllLevels();
    const expected = ['completed', 'completed', 'available', 'locked', 'locked', withUnlock ? 'available' : 'locked', 'locked', 'locked', 'available'];
    expect(levels.map((l) => computeLevelState(l, levels, loaded.completedModules, loaded.unlockedLevels))).toEqual(expected);
    expect(LEVEL_METADATA.map((m) => computeLevelStateMeta(m, LEVEL_METADATA, loaded.completedModules, loaded.unlockedLevels))).toEqual(expected);
    expect(coreCompleted(levels[0], loaded.completedModules)).toBe(true);
    expect(coreCount(levels[0])).toBe(10);
    expect(getLevelModuleCount(levels[0])).toBe(10);
    expect(getLevelCompletedModuleCount(levels[0], loaded.completedModules)).toBe(10);
    expect(getLevelCompletedCountMeta('l1', loaded.completedModules)).toBe(10);
    expect(findNextModuleEntry(loaded)?.id).toBe('l3u9m1');
    expect(findNextIncompleteModule(loaded, levels)?.module.id).toBe('l3u9m1');
    expect(areModulePrereqsMet(levels[2].units[0].modules[0], loaded)).toBe(true);
  });

  it('bonus completion never substitutes for a required lesson or inflates a level count', async () => {
    const levels = await loadAllLevels();
    const l1 = levels[0];
    const optional = l1.units.find((u) => u.id === 'u33')!;
    expect(optional.optional).toBe(true);
    const bonus = optional.modules.map((m) => m.id);
    const incomplete = [...completed.filter((id) => id !== 'l1u3m4'), ...bonus];
    expect(getLevelCompletedModuleCount(l1, incomplete)).toBe(9);
    expect(getLevelCompletedCountMeta('l1', incomplete)).toBe(9);
    expect(computeLevelState(l1, levels, incomplete)).toBe('in-progress');
    expect(computeLevelStateMeta(LEVEL_METADATA[0], LEVEL_METADATA, incomplete)).toBe('in-progress');
    expect(getNextModuleInLevel('l1u3m4', l1)).toBeUndefined();
    expect(getPreviousModuleInLevel('l1u33m1', l1)).toBeUndefined();
    expect(getNextModuleInLevel('l1u33m1', l1)?.id).toBe('l1u33m2');
    expect(areModulePrereqsMet(optional.modules[0], { completedModules: [], moduleProgress: {} })).toBe(true);
    expect(areModulePrereqsMet(optional.modules[1], { completedModules: [], moduleProgress: {} })).toBe(false);
    expect(getLevelCompletedModuleCount(l1, [...completed, ...bonus])).toBe(10);
    expect(getLevelCompletedCountMeta('l1', [...completed, ...bonus])).toBe(10);
  });

  it('the eager registry matches the curriculum, so lazy and full progress rules cannot drift', async () => {
    const levels = await loadAllLevels();
    expect(levels.flatMap((l) => l.units.filter((u) => u.optional).map((u) => u.id))).toEqual([...OPTIONAL_UNIT_IDS]);
    for (const l of levels) for (const u of l.units) for (const m of u.modules) {
      expect(isOptionalModuleId(m.id), m.id).toBe(!!u.optional);
    }
  });
});
