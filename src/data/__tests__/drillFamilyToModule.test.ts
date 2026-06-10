import { describe, it, expect } from 'vitest';
import { DRILL_FAMILY_TO_MODULE } from '../drillFamilyToModule';
import { MODULE_INDEX } from '../moduleIndex';
import { DRILL_FAMILIES } from '../../core/types/drill';

const MODULE_IDS = new Set(MODULE_INDEX.map((m) => m.id));

describe('DRILL_FAMILY_TO_MODULE', () => {
  it('maps every drill family to a module', () => {
    for (const family of DRILL_FAMILIES) {
      expect(DRILL_FAMILY_TO_MODULE[family], `no module for family: ${family}`).toBeDefined();
    }
  });

  it('only maps to module ids that exist in MODULE_INDEX', () => {
    for (const [family, moduleId] of Object.entries(DRILL_FAMILY_TO_MODULE)) {
      expect(MODULE_IDS.has(moduleId), `family ${family} → unknown module ${moduleId}`).toBe(true);
    }
  });

  it('has no extra keys beyond the known families', () => {
    expect(Object.keys(DRILL_FAMILY_TO_MODULE).sort()).toEqual([...DRILL_FAMILIES].sort());
  });
});
