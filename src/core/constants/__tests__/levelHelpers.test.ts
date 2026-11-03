import { describe, it, expect } from 'vitest';
import {
  computeLevelState,
  isLevelCompleted,
  isUnitCompleted,
  getLevelModuleCount,
  getLevelCompletedModuleCount,
  getLevelById,
  getLevelForUnit,
  getLevelForModule,
} from '../levelHelpers';
import { CURRICULUM_LEVELS } from '../levels';
import type { CurriculumLevel, CurriculumUnit } from '../../types/curriculum';

const L1 = CURRICULUM_LEVELS.find(l => l.id === 'l1')!;
const L2 = CURRICULUM_LEVELS.find(l => l.id === 'l2')!;

// Required module IDs define level completion; bonus lessons have their own progress.
const L1_MODULE_IDS = L1.units.filter(u => !u.optional).flatMap(u => u.modules.map(m => m.id));

// ---------------------------------------------------------------------------
// getLevelById / getLevelForUnit / getLevelForModule
// ---------------------------------------------------------------------------
describe('getLevelById', () => {
  it('returns level for valid ID', () => {
    expect(getLevelById('l1')!.id).toBe('l1');
  });

  it('returns undefined for invalid ID', () => {
    expect(getLevelById('nonexistent')).toBeUndefined();
  });
});

describe('getLevelForUnit', () => {
  it('returns level containing unit', () => {
    const level = getLevelForUnit('u1');
    expect(level).toBeDefined();
    expect(level!.id).toBe('l1');
  });

  it('returns undefined for invalid unit', () => {
    expect(getLevelForUnit('invalid')).toBeUndefined();
  });
});

describe('getLevelForModule', () => {
  it('returns level containing module', () => {
    const level = getLevelForModule('l1u1m1');
    expect(level).toBeDefined();
    expect(level!.id).toBe('l1');
  });

  it('finds module in L2', () => {
    const level = getLevelForModule('l2u4m1');
    expect(level).toBeDefined();
    expect(level!.id).toBe('l2');
  });

  it('returns undefined for invalid module', () => {
    expect(getLevelForModule('invalid')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getLevelModuleCount / getLevelCompletedModuleCount
// ---------------------------------------------------------------------------
describe('getLevelModuleCount', () => {
  it('returns total module count for L1', () => {
    const count = getLevelModuleCount(L1);
    expect(count).toBe(L1_MODULE_IDS.length);
    expect(count).toBeGreaterThan(0);
  });

  it('returns 0 for a level with empty units', () => {
    const emptyLevel: CurriculumLevel = {
      id: 'empty',
      number: 0,
      title: '',
      description: '',
      difficulty: 'beginner',
      difficultyLabel: '',
      accentColor: '',
      prerequisites: [],
      units: [],
    };
    expect(getLevelModuleCount(emptyLevel)).toBe(0);
  });
});

describe('getLevelCompletedModuleCount', () => {
  it('returns 0 when nothing completed', () => {
    expect(getLevelCompletedModuleCount(L1, [])).toBe(0);
  });

  it('returns correct count for partial completion', () => {
    expect(getLevelCompletedModuleCount(L1, ['l1u1m1', 'l1u1m2'])).toBe(2);
  });

  it('counts only modules belonging to the level', () => {
    // Pass L2 module IDs — should not count toward L1
    expect(getLevelCompletedModuleCount(L1, ['l2u4m1'])).toBe(0);
  });

  it('returns full count when all completed', () => {
    expect(getLevelCompletedModuleCount(L1, L1_MODULE_IDS)).toBe(L1_MODULE_IDS.length);
  });
});

// ---------------------------------------------------------------------------
// isLevelCompleted
// ---------------------------------------------------------------------------
describe('isLevelCompleted', () => {
  it('returns false when no modules completed', () => {
    expect(isLevelCompleted(L1, [])).toBe(false);
  });

  it('returns false when partially completed', () => {
    expect(isLevelCompleted(L1, ['l1u1m1'])).toBe(false);
  });

  it('returns true when all modules completed', () => {
    expect(isLevelCompleted(L1, L1_MODULE_IDS)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isUnitCompleted
// ---------------------------------------------------------------------------
describe('isUnitCompleted', () => {
  const unit1 = L1.units.find(u => u.id === 'u1')!;

  it('returns false when no modules completed', () => {
    expect(isUnitCompleted(unit1, [])).toBe(false);
  });

  it('returns false when partially completed', () => {
    expect(isUnitCompleted(unit1, ['l1u1m1'])).toBe(false);
  });

  it('returns true when all unit modules completed', () => {
    const unitModuleIds = unit1.modules.map(m => m.id);
    expect(isUnitCompleted(unit1, unitModuleIds)).toBe(true);
  });

  it('returns false for empty unit', () => {
    const emptyUnit: CurriculumUnit = {
      id: 'empty',
      levelId: 'l1',
      title: '',
      description: '',
      icon: '',
      modules: [],
    };
    expect(isUnitCompleted(emptyUnit, [])).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// computeLevelState
// ---------------------------------------------------------------------------
describe('computeLevelState', () => {
  it('returns "coming-soon" for comingSoon level', () => {
    const comingSoon: CurriculumLevel = {
      ...L1,
      id: 'test-cs',
      comingSoon: true,
    };
    expect(computeLevelState(comingSoon, [])).toBe('coming-soon');
  });

  it('returns "locked" when prerequisite level is incomplete', () => {
    // L2 requires L1
    expect(computeLevelState(L2, [])).toBe('locked');
  });

  it('returns "available" when prerequisites met but nothing started', () => {
    // L1 has no prerequisites
    expect(computeLevelState(L1, [])).toBe('available');
  });

  it('returns "in-progress" when some modules completed', () => {
    expect(computeLevelState(L1, ['l1u1m1'])).toBe('in-progress');
  });

  it('returns "completed" when all modules completed', () => {
    expect(computeLevelState(L1, L1_MODULE_IDS)).toBe('completed');
  });

  it('L2 becomes "available" when L1 is fully completed', () => {
    expect(computeLevelState(L2, L1_MODULE_IDS)).toBe('available');
  });
});
