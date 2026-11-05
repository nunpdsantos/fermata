/**
 * W4b (decision D-10): "Unlock anyway" opens a locked level and is SAVED in
 * the learner's progress (`progress.unlockedLevels`, an optional list of
 * level ids). The field is additive: progress saved by main (v2, W4a's
 * retirement already applied) must load exactly as it was — completions,
 * task ticks, exemptions, scores, attempts, "passed" flags and review
 * schedules — and no level is unlocked by it. W4b added no migration;
 * subsequent content releases may retire scores. This fixture uses unchanged
 * items. The shape guard checks the new field, and backups round-trip.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore, PROGRESS_STORE_VERSION, isValidPersistedProgress } from '../progressStore';
import { LEVEL_METADATA, computeLevelStateMeta, areModulePrereqsMet } from '../../data/curriculumLoader';
import { EN_UNITS } from '../../i18n/content/__tests__/overlayEntries';
import { validateBackup, applyBackup } from '../../utils/backupHelpers';
import type { CurriculumProgress } from '../../core/types/curriculum';

const T = 1_793_000_000_000;
const L1 = EN_UNITS[1].flatMap((u) => u.modules.map((m) => m.id));

/** A save exactly as main (165bc4a, progress v2) writes it: L1 done, L2 under way. */
function mainV2Save(): { state: { progress: CurriculumProgress }; version: number } {
  return {
    state: {
      progress: {
        completedModules: [...L1, 'l2u4m1'],
        moduleProgress: { l1u1m1: ['l1u1m1t1', 'l1u1m1t2'], l2u4m2: ['l2u4m2t1'] },
        exemptedModules: ['l4u12m1'],
        exerciseResults: {
          l1u1m1: { scores: { l1u1m1e1: 1, l1u1m1e2: 0.5, l1u1m1g6: 0 }, totalAttempts: 7, lastAttemptAt: T, passed: true },
          l2u4m2: { scores: { l2u4m2e1: 1 }, totalAttempts: 1, lastAttemptAt: T, passed: false },
        },
        reviewSchedules: {
          l1u1m1: { completedAt: T, nextReviewAt: T + 86_400_000, intervalLevel: 1, reviewCount: 2, lastReviewedAt: T },
        },
      },
    },
    version: 2,
  };
}

async function hydrate(saved: unknown): Promise<CurriculumProgress> {
  localStorage.setItem('music-theory-progress', JSON.stringify(saved));
  await useProgressStore.persist.rehydrate();
  return useProgressStore.getState().progress;
}

const levelStates = (p: CurriculumProgress) =>
  LEVEL_METADATA.map((m) => computeLevelStateMeta(m, LEVEL_METADATA, p.completedModules, p.unlockedLevels));

beforeEach(() => localStorage.clear());

describe('"Unlock anyway" is saved, and older saves load unchanged', () => {
  it('unlock persistence uses the current content-retirement version', () => {
    expect(PROGRESS_STORE_VERSION).toBe(4);
    expect(useProgressStore.persist.getOptions().version).toBe(4);
  });

  it('a production-shaped main (v2) save loads byte-for-byte: nothing lost, nothing unlocked', async () => {
    const saved = mainV2Save();
    const p = await hydrate(saved);
    expect(p).toEqual(saved.state.progress);
    expect(p.unlockedLevels).toBeUndefined();
    expect(levelStates(p)).toEqual(['completed', 'in-progress', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked', 'available']);
    // …and it is written back as it was.
    expect(JSON.parse(localStorage.getItem('music-theory-progress')!).state.progress).toEqual(saved.state.progress);
  });

  it('a pre-W4a (v1) save still migrates as before and gains no unlocks', async () => {
    const v1 = mainV2Save();
    v1.version = 1;
    const p = await hydrate(v1);
    expect(p.completedModules).toEqual(v1.state.progress.completedModules);
    expect(p.unlockedLevels).toBeUndefined();
  });

  it('unlockLevel persists, is idempotent, and changes only that level\'s lock', async () => {
    await hydrate(mainV2Save());
    useProgressStore.getState().unlockLevel('l4');
    useProgressStore.getState().unlockLevel('l4');
    const p = useProgressStore.getState().progress;
    expect(p.unlockedLevels).toEqual(['l4']);
    expect(levelStates(p)).toEqual(['completed', 'in-progress', 'locked', 'available', 'locked', 'locked', 'locked', 'locked', 'available']);
    // Everything else untouched.
    const { unlockedLevels: _u, ...rest } = p;
    expect(rest).toEqual(mainV2Save().state.progress);
    // Saved, and back after a reload.
    const stored = JSON.parse(localStorage.getItem('music-theory-progress')!);
    expect(stored.state.progress.unlockedLevels).toEqual(['l4']);
    expect(stored.version).toBe(PROGRESS_STORE_VERSION);
    // A fresh page load: the in-memory store starts empty, then reads the save.
    const raw = localStorage.getItem('music-theory-progress')!;
    useProgressStore.setState({ progress: { completedModules: [], moduleProgress: {} } });
    localStorage.setItem('music-theory-progress', raw);
    await useProgressStore.persist.rehydrate();
    expect(useProgressStore.getState().progress.unlockedLevels).toEqual(['l4']);
  });

  it('an unlocked level\'s first module no longer waits for the previous level; the order inside it stays', async () => {
    const p: CurriculumProgress = { ...mainV2Save().state.progress, unlockedLevels: ['l4'] };
    const l4 = EN_UNITS[4].flatMap((u) => u.modules);
    expect(areModulePrereqsMet(l4[0], p)).toBe(true);
    expect(areModulePrereqsMet(l4[1], p)).toBe(false); // needs l4's first module
    expect(areModulePrereqsMet(l4[0], mainV2Save().state.progress)).toBe(false);
    // A level not unlocked keeps its cross-level prerequisite.
    expect(areModulePrereqsMet(EN_UNITS[5][0].modules[0], p)).toBe(false);
  });

  it('the shape guard accepts the field and rejects a malformed one', () => {
    const ok = mainV2Save().state;
    expect(isValidPersistedProgress({ progress: { ...ok.progress, unlockedLevels: ['l3', 'l4'] } })).toBe(true);
    expect(isValidPersistedProgress({ progress: { ...ok.progress, unlockedLevels: 'l3' } })).toBe(false);
    expect(isValidPersistedProgress({ progress: { ...ok.progress, unlockedLevels: [3] } })).toBe(false);
  });

  it('a backup carrying unlocks round-trips; one without them is accepted unchanged', async () => {
    for (const unlockedLevels of [undefined, ['l6']]) {
      localStorage.clear();
      const save = mainV2Save();
      if (unlockedLevels) save.state.progress.unlockedLevels = unlockedLevels;
      const result = await validateBackup({
        format: 'fermata-backup',
        version: 1,
        exportedAt: '2026-11-02T12:00:00.000Z',
        data: { 'music-theory-progress': save },
      });
      if (!result.ok) throw new Error(result.reason);
      applyBackup(result.backup, localStorage);
      await useProgressStore.persist.rehydrate();
      expect(useProgressStore.getState().progress).toEqual(save.state.progress);
    }
  });
});
