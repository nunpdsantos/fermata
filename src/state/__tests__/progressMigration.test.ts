/**
 * W4a follow-up — a saved score never attaches to a different exercise.
 *
 * W4a re-keyed templates and rewrote questions, so many exercise ids now
 * name a different exercise than they did on main (l3u11m1g1 was a passing-
 * tone question, it is now a cadence question). The progress store (v2)
 * migrates progress saved under v1 by dropping the per-exercise scores of
 * every id retired in retiredExerciseIds.ts, and keeps everything else:
 * completed modules, task ticks, exemptions, review schedules, each module's
 * attempt count and "passed" flag — so completion, unlocks and level
 * progress are exactly as before.
 *
 * The production-shaped blob below is a v1 save (what main wrote): L1–L3
 * complete, per-item scores in a re-keyed module (l3u11m1), a module whose
 * generated items shifted (l1u3m4), one whose items became spelled intervals
 * (l2u7m2) and one that did not change (l9u30m1).
 *
 * Oracle for "no old record attaches to a new, different item": the main-era
 * fingerprints of those ids, frozen here (computed from main b9d526a with
 * exerciseFingerprints.ts), compared with the current identity snapshot —
 * every score that survives must sit on an id whose exercise is unchanged.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore, PROGRESS_STORE_VERSION, retireChangedExerciseScores, isValidPersistedProgress } from '../progressStore';
import { RETIRED_EXERCISE_IDS } from '../retiredExerciseIds';
import { LEVEL_METADATA } from '../../data/levelMetadata';
import { computeLevelStateMeta, areModulePrereqsMet } from '../../data/curriculumLoader';
import { EN_UNITS } from '../../i18n/content/__tests__/overlayEntries';
import type { CurriculumProgress } from '../../core/types/curriculum';
import { validateBackup, applyBackup } from '../../utils/backupHelpers';
import identities from '../../data/exercises/__tests__/exerciseIdentities.json';

/** Current identities of every served exercise (snapshot pinned by exerciseIdentity.snapshot.test). */
const NOW = identities as Record<string, Record<string, string>>;

/**
 * Main-era (v1 content) fingerprints of the blob's ids — frozen oracle, taken
 * from a git archive of main with the current fingerprint function (whose
 * identity treats a field left at its default the same as the default spelled
 * out, e.g. acceptEnharmonic).
 */
const MAIN_FINGERPRINTS: Record<string, string> = {
  l3u11m1e1: 'ad32315f', l3u11m1e2: '24f33a82', l3u11m1e3: '8d10a005', l3u11m1e4: '05b07501',
  l3u11m1g1: '2217c227', l3u11m1g2: 'a511ff5b', l3u11m1g3: '13f1958b',
  l1u3m4e1: '36f41596', l1u3m4e2: '75f3a812', l1u3m4e3: 'c3f53f64', l1u3m4g1: '4559fc31', l1u3m4g2: 'f93c2373',
  l1u3m4g3: '75f3a812', l1u3m4g4: '31cdb054', l1u3m4g5: '36f41596', l1u3m4g6: '70cd42d0',
  l2u7m2e1: '11674c23', l2u7m2g1: '3a202226', l2u7m2g2: '1c042ba4', l2u7m2g3: 'e55e93d5',
  l9u30m1e1: 'c9cf3fac', l9u30m1g1: 'bc407feb', l9u30m1g2: '6727126e',
};

const L1_TO_L3 = EN_UNITS[1].concat(EN_UNITS[2], EN_UNITS[3]).flatMap((u) => u.modules.map((m) => m.id));
const scoresFor = (ids: string[]) => Object.fromEntries(ids.map((id, i) => [id, ([1, 0.5, 1, 0] as const)[i % 4]]));

/** A v1 save as main wrote it (zustand persist envelope). */
function mainSave(): { state: { progress: CurriculumProgress }; version: number } {
  const t = 1_790_000_000_000;
  return {
    state: {
      progress: {
        completedModules: L1_TO_L3,
        moduleProgress: { l1u1m1: ['l1u1m1t1', 'l1u1m1t2'], l3u11m1: ['l3u11m1t1'] },
        exemptedModules: ['l4u12m1'],
        exerciseResults: {
          l3u11m1: { scores: scoresFor(Object.keys(MAIN_FINGERPRINTS).filter((id) => id.startsWith('l3u11m1'))), totalAttempts: 9, lastAttemptAt: t, passed: true },
          l1u3m4: { scores: scoresFor(Object.keys(MAIN_FINGERPRINTS).filter((id) => id.startsWith('l1u3m4'))), totalAttempts: 12, lastAttemptAt: t, passed: true },
          l2u7m2: { scores: scoresFor(Object.keys(MAIN_FINGERPRINTS).filter((id) => id.startsWith('l2u7m2'))), totalAttempts: 4, lastAttemptAt: t, passed: false },
          l9u30m1: { scores: scoresFor(Object.keys(MAIN_FINGERPRINTS).filter((id) => id.startsWith('l9u30m1'))), totalAttempts: 3, lastAttemptAt: t, passed: false },
        },
        reviewSchedules: Object.fromEntries(L1_TO_L3.map((id) => [id, { completedAt: t, nextReviewAt: t + 86_400_000, intervalLevel: 1, reviewCount: 1, lastReviewedAt: t }])),
      },
    },
    version: 1,
  };
}

async function hydrateFrom(saved: unknown): Promise<CurriculumProgress> {
  localStorage.setItem('music-theory-progress', JSON.stringify(saved));
  await useProgressStore.persist.rehydrate();
  return useProgressStore.getState().progress;
}

const unlocks = (p: CurriculumProgress) => ({
  levels: LEVEL_METADATA.map((m) => computeLevelStateMeta(m, LEVEL_METADATA, p.completedModules)),
  modules: Object.values(EN_UNITS).flat().flatMap((u) => u.modules).map((m) => areModulePrereqsMet(m, p)),
});

beforeEach(() => localStorage.clear());

describe('progress store v2: retiring scores of changed exercises', () => {
  it('the store version is the latest retirement release', () => {
    expect(PROGRESS_STORE_VERSION).toBe(Math.max(1, ...RETIRED_EXERCISE_IDS.map((r) => r.version)));
    expect(PROGRESS_STORE_VERSION).toBeGreaterThanOrEqual(2);
    expect(useProgressStore.persist.getOptions().version).toBe(PROGRESS_STORE_VERSION);
  });

  it('a main (v1) save keeps completions, tasks, exemptions, schedules, attempts and passed flags', async () => {
    const before = mainSave().state.progress;
    const after = await hydrateFrom(mainSave());
    expect(after.completedModules).toEqual(before.completedModules);
    expect(after.moduleProgress).toEqual(before.moduleProgress);
    expect(after.exemptedModules).toEqual(before.exemptedModules);
    expect(after.reviewSchedules).toEqual(before.reviewSchedules);
    for (const [m, r] of Object.entries(before.exerciseResults!)) {
      expect(after.exerciseResults![m].passed).toBe(r.passed);
      expect(after.exerciseResults![m].totalAttempts).toBe(r.totalAttempts);
      expect(after.exerciseResults![m].lastAttemptAt).toBe(r.lastAttemptAt);
    }
  });

  it('level and module unlocks are identical before and after', async () => {
    const before = unlocks(mainSave().state.progress);
    const after = unlocks(await hydrateFrom(mainSave()));
    expect(after).toEqual(before);
    expect(after.levels.slice(0, 3)).toEqual(['completed', 'completed', 'completed']);
  });

  it('no surviving score sits on an id whose exercise changed (frozen main fingerprints vs now)', async () => {
    const after = await hydrateFrom(mainSave());
    const survivors = Object.entries(after.exerciseResults!).flatMap(([m, r]) => Object.keys(r.scores).map((id) => [m, id] as const));
    for (const [m, id] of survivors) expect(NOW[m]?.[id], `${id} survived but changed`).toBe(MAIN_FINGERPRINTS[id]);
    // …and every unchanged id kept its score (nothing dropped needlessly).
    for (const [id, fp] of Object.entries(MAIN_FINGERPRINTS)) {
      const m = id.replace(/[eg]\d+$/, '');
      const kept = id in (after.exerciseResults![m]?.scores ?? {});
      expect(kept, `${id}: unchanged=${NOW[m]?.[id] === fp}`).toBe(NOW[m]?.[id] === fp);
    }
  });

  it('the re-keyed module keeps only its unchanged authored scores', async () => {
    const after = await hydrateFrom(mainSave());
    expect(Object.keys(after.exerciseResults!.l3u11m1.scores).sort()).toEqual(['l3u11m1e2', 'l3u11m1e3', 'l3u11m1e4']);
    expect(Object.keys(after.exerciseResults!.l9u30m1.scores).sort()).toEqual(['l9u30m1e1', 'l9u30m1g1', 'l9u30m1g2']);
  });

  it('a v2 save is not migrated again (scores on new items stay)', async () => {
    const v2 = mainSave();
    v2.version = PROGRESS_STORE_VERSION;
    v2.state.progress.exerciseResults!.l3u11m1.scores = { l3u11m1g1: 1, l3u11m1g4: 0.5 };
    const after = await hydrateFrom(v2);
    expect(after.exerciseResults!.l3u11m1.scores).toEqual({ l3u11m1g1: 1, l3u11m1g4: 0.5 });
  });

  it('nothing crashes on odd shapes: no results, a malformed module entry, an unknown module', () => {
    const base: CurriculumProgress = { completedModules: ['l1u1m1'], moduleProgress: {} };
    expect(retireChangedExerciseScores(base, 1)).toEqual(base);
    const odd = { ...base, exerciseResults: { l3u11m1: 'oops', l99u1m1: { scores: { l99u1m1g1: 1 }, totalAttempts: 1, lastAttemptAt: 0, passed: false } } } as unknown as CurriculumProgress;
    expect(() => retireChangedExerciseScores(odd, 1)).not.toThrow();
    expect(retireChangedExerciseScores(odd, 1).exerciseResults).toEqual(odd.exerciseResults);
  });
});

describe('backups: an old (v1) progress section is still accepted and migrates on load', () => {
  const backup = (progressVersion: number) => ({
    format: 'fermata-backup',
    version: 1,
    exportedAt: '2026-10-30T12:00:00.000Z',
    data: { 'music-theory-progress': { ...mainSave(), version: progressVersion } },
  });

  it('validateBackup accepts a v1 progress section', async () => {
    expect(await validateBackup(backup(1))).toMatchObject({ ok: true });
  });

  it('applying it and loading migrates it like a local v1 save', async () => {
    const result = await validateBackup(backup(1));
    if (!result.ok) throw new Error(result.reason);
    applyBackup(result.backup, localStorage);
    await useProgressStore.persist.rehydrate();
    const p = useProgressStore.getState().progress;
    expect(p.completedModules).toEqual(L1_TO_L3);
    expect(Object.keys(p.exerciseResults!.l3u11m1.scores).sort()).toEqual(['l3u11m1e2', 'l3u11m1e3', 'l3u11m1e4']);
  });

  it('a progress section from a newer app version is refused', async () => {
    const r = await validateBackup(backup(PROGRESS_STORE_VERSION + 1));
    expect(r.ok).toBe(false);
  });
});

describe('the saved-progress shape guard checks exercise results (review follow-up)', () => {
  const good = () => mainSave().state;
  it('accepts a well-formed save', () => {
    expect(isValidPersistedProgress(good())).toBe(true);
  });
  it.each([
    ['results not an object', (p: CurriculumProgress) => { (p as unknown as Record<string, unknown>).exerciseResults = []; }],
    ['a module entry without scores', (p: CurriculumProgress) => { (p.exerciseResults as Record<string, unknown>).l3u11m1 = { totalAttempts: 1, lastAttemptAt: 0, passed: true }; }],
    ['a score that is not 0, 0.5 or 1', (p: CurriculumProgress) => { (p.exerciseResults!.l3u11m1.scores as Record<string, unknown>).l3u11m1e2 = 'full'; }],
    ['passed as text', (p: CurriculumProgress) => { (p.exerciseResults!.l3u11m1 as unknown as Record<string, unknown>).passed = 'yes'; }],
    ['attempts missing', (p: CurriculumProgress) => { delete (p.exerciseResults!.l3u11m1 as unknown as Record<string, unknown>).totalAttempts; }],
    ['exemptions not a list', (p: CurriculumProgress) => { (p as unknown as Record<string, unknown>).exemptedModules = 'l4u12m1'; }],
  ])('rejects %s', (_label, mutate) => {
    const save = good();
    mutate(save.progress);
    expect(isValidPersistedProgress(save)).toBe(false);
  });
});
