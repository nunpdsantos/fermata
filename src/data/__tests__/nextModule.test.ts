/**
 * Audit W9-10 / W9-19: the Learn overview's Continue banner is decided from
 * the STATIC module index, so opening Learn no longer downloads all nine
 * levels (and a failed download can no longer make the banner vanish).
 *
 * findNextModuleEntry (static) must pick exactly the module that
 * findNextIncompleteModule (full curriculum data) picks, for every progress
 * state — this is also the drift guard for the two facts it relies on: the
 * index lists modules in curriculum order, and each module's prerequisite is
 * the module before it (across a level boundary only for L2–L8; L1 and the
 * parallel L9 start with none).
 */
import { describe, it, expect } from 'vitest';
import { findNextModuleEntry } from '../nextModule';
import { findNextIncompleteModule, getDefaultProgress, LEVEL_METADATA } from '../curriculumLoader';
import { MODULE_INDEX } from '../moduleIndex';
import type { CurriculumLevel, CurriculumProgress, CurriculumUnit } from '../../core/types/curriculum';
import { mulberry32 } from '../../core/utils/prng';
import { L1_UNITS } from '../../core/constants/curriculumL1';
import { L2_UNITS } from '../../core/constants/curriculumL2';
import { L3_UNITS } from '../../core/constants/curriculumL3';
import { L4_UNITS } from '../../core/constants/curriculumL4';
import { L5_UNITS } from '../../core/constants/curriculumL5';
import { L6_UNITS } from '../../core/constants/curriculumL6';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L8_UNITS } from '../../core/constants/curriculumL8';
import { L9_UNITS } from '../../core/constants/curriculumL9';

const UNITS: CurriculumUnit[][] = [L1_UNITS, L2_UNITS, L3_UNITS, L4_UNITS, L5_UNITS, L6_UNITS, L7_UNITS, L8_UNITS, L9_UNITS];
const LEVELS: CurriculumLevel[] = UNITS.map((units, i) => ({
  id: `l${i + 1}`, number: i + 1, title: '', description: '', difficulty: 'beginner',
  difficultyLabel: '', accentColor: '', prerequisites: [], units,
}));
const ALL_MODULES = LEVELS.flatMap((l) => l.units.flatMap((u) => u.modules));

function progressWith(completed: string[], inProgress: string[] = []): CurriculumProgress {
  const p = getDefaultProgress();
  p.completedModules = completed;
  for (const id of inProgress) p.moduleProgress[id] = ['t1'];
  return p;
}

function expectSame(progress: CurriculumProgress) {
  const full = findNextIncompleteModule(progress, LEVELS);
  const fromIndex = findNextModuleEntry(progress);
  expect(fromIndex?.id).toBe(full?.module.id);
  if (fromIndex && full) {
    expect(fromIndex.unitId).toBe(full.unit.id);
    expect(fromIndex.level).toBe(full.level.id);
  }
}

describe('findNextModuleEntry (static index) == findNextIncompleteModule (full data)', () => {
  it('drift guard: index order is curriculum order; each prerequisite is the previous module (across levels only for chained levels)', () => {
    expect(MODULE_INDEX.map((e) => e.id)).toEqual(ALL_MODULES.map((m) => m.id));
    const chained = new Set(LEVEL_METADATA.filter((l) => l.prerequisites.length > 0).map((l) => l.id));
    expect([...chained].sort()).toEqual(['l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8']);
    ALL_MODULES.forEach((mod, i) => {
      const prev = ALL_MODULES[i - 1];
      const expected = prev && (prev.levelId === mod.levelId || chained.has(mod.levelId)) ? [prev.id] : [];
      expect(mod.prerequisites, mod.id).toEqual(expected);
      expect(mod.comingSoon ?? false, mod.id).toBe(false);
    });
  });

  it('fresh learner → the first module', () => {
    expectSame(getDefaultProgress());
    expect(findNextModuleEntry(getDefaultProgress())?.id).toBe('l1u1m1');
  });

  it('every prefix of the curriculum completed (0…118 modules)', () => {
    for (let n = 0; n <= ALL_MODULES.length; n++) {
      expectSame(progressWith(ALL_MODULES.slice(0, n).map((m) => m.id)));
    }
    expect(findNextModuleEntry(progressWith(ALL_MODULES.map((m) => m.id)))).toBeUndefined();
  });

  it('500 random completion sets, with and without modules in progress', () => {
    const rand = mulberry32(20261030);
    for (let k = 0; k < 500; k++) {
      const completed = ALL_MODULES.filter(() => rand() < 0.4).map((m) => m.id);
      const inProgress = ALL_MODULES.filter(() => rand() < 0.03).map((m) => m.id);
      expectSame(progressWith(completed, k % 2 ? inProgress : []));
    }
  });
});
