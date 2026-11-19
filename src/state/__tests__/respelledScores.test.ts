/**
 * The British spelling pass (19 November 2026) keeps every saved score.
 *
 * 60 questions changed identity only by spelling (exerciseRespellings.json,
 * proved in data/exercises/__tests__/exerciseRespellings.test.ts): the same
 * exercises, so nothing was retired and the progress store stays at version
 * 4. A production-shaped save from before the release — the frozen v2 shape
 * of guitarNotationProgress.test.ts, at today's version 4, with scores on
 * eleven of the 60 ids across Levels 1–8 — loads with every score intact and
 * is written back byte for byte, from localStorage and from a backup file.
 *
 * A check half-done before the release on one of those questions: Learn's
 * session store resumes a check only while every saved id has the same
 * English identity (learnSessionStore.restorableCheck), and a respelled
 * question's identity is new, so that saved RUN is dropped on the first visit
 * after the update (no message; the check starts again from its first
 * question). The scores of the questions already answered were written to the
 * progress store as each was answered, and stay; a finished check had already
 * recorded its pass. Checks on other questions resume as before.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { useProgressStore, PROGRESS_STORE_VERSION } from '../progressStore';
import { RETIRED_EXERCISE_IDS } from '../retiredExerciseIds';
import { useLearnSessionStore, restorableCheck, fingerprintsOf, identitiesOf, type SavedCheck } from '../learnSessionStore';
import { validateBackup, applyBackup } from '../../utils/backupHelpers';
import type { CurriculumProgress } from '../../core/types/curriculum';
import type { ExerciseDefinition } from '../../core/types/exercise';
import respellings from '../../data/exercises/__tests__/exerciseRespellings.json';
import snapshot from '../../data/exercises/__tests__/exerciseIdentities.json';
import { treeItems, fingerprint } from '../../data/exercises/__tests__/exerciseFingerprints';
import { americanOriginal } from '../../data/exercises/__tests__/respelling';
import { generateAllForLevel } from '../../data/exercises/exerciseGenerator';
import { enExercisesFor, enTemplatesFor } from '../../i18n/content/__tests__/overlayEntries';

const RESPELLED = respellings['2026-11-19'].ids as Record<string, Record<string, string>>;
const SNAPSHOT = snapshot as Record<string, Record<string, string>>;

/** Eleven of the 60, Levels 1–8 (Level 9 has none). */
const KEPT = ['l1u2m2e3', 'l2u6m1e1', 'l2u6m1g1', 'l3u11m4e2', 'l4u14m2e2', 'l5u15m4e1', 'l5u15m4g1', 'l6u20m4e2', 'l7u22m2e2', 'l7u22m3e1', 'l8u27m5e3'];
const moduleOf = (id: string) => id.replace(/[eg]\d+$/, '');
const T = 1793000000000;

// The frozen production shape of guitarNotationProgress.test.ts (pre-release ids, not read from today's curriculum),
// with results on modules that hold respelled questions.
const progress: CurriculumProgress = {
  completedModules: [
    'l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u1m4', 'l1u2m1', 'l1u2m2', 'l1u3m1', 'l1u3m2', 'l1u3m3', 'l1u3m4',
    'l2u4m1', 'l2u4m2', 'l2u5m1', 'l2u5m2', 'l2u5m3', 'l2u6m1', 'l2u6m2', 'l2u7m1', 'l2u7m2', 'l2u7m3', 'l2u7m4', 'l2u7m5',
  ],
  moduleProgress: { l1u1m1: ['l1u1m1t1', 'l1u1m1t2'], l3u9m1: ['l3u9m1t1'] },
  exemptedModules: ['l4u12m1'],
  unlockedLevels: ['l5', 'l7'],
  exerciseResults: {
    l1u1m1: { scores: { l1u1m1e1: 1, l1u1m1e2: 0.5, l1u1m1g6: 0 }, totalAttempts: 7, lastAttemptAt: T, passed: true },
    l1u2m2: { scores: { l1u2m2e3: 1, l1u2m2e1: 1 }, totalAttempts: 4, lastAttemptAt: T, passed: true },
    l2u5m2: { scores: { l2u5m2e1: 1 }, totalAttempts: 5, lastAttemptAt: T, passed: true },
    l2u6m1: { scores: { l2u6m1e1: 0.5, l2u6m1g1: 1, l2u6m1e3: 1 }, totalAttempts: 6, lastAttemptAt: T + 1, passed: true },
    l3u11m4: { scores: { l3u11m4e2: 0 }, totalAttempts: 2, lastAttemptAt: T + 2, passed: false },
    l4u14m2: { scores: { l4u14m2e2: 1 }, totalAttempts: 1, lastAttemptAt: T + 3, passed: false },
    l5u15m4: { scores: { l5u15m4e1: 1, l5u15m4g1: 0.5 }, totalAttempts: 3, lastAttemptAt: T + 4, passed: false },
    l6u20m4: { scores: { l6u20m4e2: 1 }, totalAttempts: 1, lastAttemptAt: T + 5, passed: false },
    l7u22m2: { scores: { l7u22m2e2: 0 }, totalAttempts: 2, lastAttemptAt: T + 6, passed: false },
    l7u22m3: { scores: { l7u22m3e1: 1 }, totalAttempts: 1, lastAttemptAt: T + 7, passed: false },
    l8u27m5: { scores: { l8u27m5e3: 0.5 }, totalAttempts: 1, lastAttemptAt: T + 8, passed: false },
  },
  reviewSchedules: {
    l1u1m1: { completedAt: T, nextReviewAt: T + 86_400_000, intervalLevel: 1, reviewCount: 2, lastReviewedAt: T },
    l2u6m1: { completedAt: T, nextReviewAt: T + 172_800_000, intervalLevel: 2, reviewCount: 3, lastReviewedAt: T },
  },
};
const SAVED = { state: { progress }, version: 4 };

beforeEach(() => {
  localStorage.clear();
  useLearnSessionStore.setState({ screen: null, check: null });
});

describe('a save from before the British spelling pass keeps every score', () => {
  it('the eleven are respellings of the pass, across Levels 1–8, and none is retired: the store is still at version 4', () => {
    for (const id of KEPT) expect(RESPELLED[moduleOf(id)]?.[id], id).toBeDefined();
    expect(new Set(KEPT.map((id) => id.slice(0, 2)))).toEqual(new Set(['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8']));
    expect(PROGRESS_STORE_VERSION).toBe(4);
    expect(RETIRED_EXERCISE_IDS.every((r) => r.version <= 4)).toBe(true);
  });

  it('loads with every score intact, at version 4, and is written back byte for byte', async () => {
    const raw = JSON.stringify(SAVED);
    localStorage.setItem('music-theory-progress', raw);
    await useProgressStore.persist.rehydrate();
    const loaded = useProgressStore.getState().progress;
    expect(loaded).toEqual(progress); // scores, attempts, passed, completions, unlocks, exemptions, tasks, schedules
    for (const id of KEPT) expect(loaded.exerciseResults?.[moduleOf(id)]?.scores[id], id).toBe(progress.exerciseResults![moduleOf(id)].scores[id]);
    expect(localStorage.getItem('music-theory-progress')).toBe(raw);
    useProgressStore.setState({}); // any set() writes the save
    expect(localStorage.getItem('music-theory-progress')).toBe(raw);
  });

  it('from a backup file the same: imported, loaded and written back unchanged', async () => {
    const validated = await validateBackup({
      format: 'fermata-backup', version: 1, exportedAt: '2026-11-18T12:00:00.000Z',
      data: { 'music-theory-progress': SAVED },
    });
    if (!validated.ok) throw new Error(validated.reason);
    applyBackup(validated.backup, localStorage);
    await useProgressStore.persist.rehydrate();
    expect(useProgressStore.getState().progress).toEqual(progress);
    useProgressStore.setState({});
    expect(localStorage.getItem('music-theory-progress')).toBe(JSON.stringify(SAVED));
  });
});

describe('a check half-done before the release, on a respelled question', () => {
  const items = treeItems({
    authored: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(enExercisesFor),
    templates: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(enTemplatesFor),
    generateAllForLevel: (c, lang, a) => generateAllForLevel(c, lang, a),
  });
  /** The module's items as served before the pass: each respelled one in its American wording (its recorded fingerprint). */
  const before = (moduleId: string): ExerciseDefinition[] =>
    Object.values(items[moduleId]).map((ex) => {
      const was = RESPELLED[moduleId]?.[ex.id];
      if (!was) return ex;
      const old = americanOriginal(ex, was);
      if (!old) throw new Error(`${ex.id}: not a respelling`);
      return old as ExerciseDefinition;
    });
  const startedOn = (moduleId: string, served: ExerciseDefinition[]): SavedCheck => ({
    moduleId, kind: 'check', lang: 'en', fingerprints: fingerprintsOf(served), identities: identitiesOf(served),
    run: {
      order: served.slice(0, 4).map((ex) => ex.id), index: 2, scores: [1, 0.5],
      items: [
        { id: served[0].id, answers: ['x'], score: 1, answer: 'x' },
        { id: served[1].id, answers: ['y', 'x'], score: 0.5, answer: 'x' },
      ],
      attempt: 1, selectedNotes: [], tried: [], missed: null, final: null,
    },
    finished: false, at: Date.now(),
  });

  it('the saved run is dropped on the first visit after the update (its question\'s identity is new); scores already answered stay in progress', async () => {
    const old = before('l2u6m1');
    const now = Object.values(items.l2u6m1);
    expect(old.slice(0, 4).some((ex, i) => fingerprint(ex) !== fingerprint(now[i]))).toBe(true); // the run holds a respelled question
    expect(now.slice(0, 4).map(fingerprint)).toEqual(now.slice(0, 4).map((ex) => SNAPSHOT.l2u6m1[ex.id]));
    localStorage.setItem('music-theory-progress', JSON.stringify(SAVED));
    await useProgressStore.persist.rehydrate();
    // Before the update the same saved run resumes (it is a valid, fresh check)…
    useLearnSessionStore.getState().setCheck(startedOn('l2u6m1', old));
    expect(restorableCheck('l2u6m1', old, 'en')?.check.run).toMatchObject({ index: 2, scores: [1, 0.5] });
    // …after it, the respelled question's new identity drops it.
    useLearnSessionStore.getState().setCheck(startedOn('l2u6m1', old));
    expect(restorableCheck('l2u6m1', now, 'en')).toBeNull();
    expect(useLearnSessionStore.getState().check).toBeNull();
    expect(useProgressStore.getState().progress.exerciseResults?.l2u6m1).toEqual(progress.exerciseResults!.l2u6m1);
  });

  it('a check on questions the pass did not change resumes exactly, as before', () => {
    const served = Object.values(items.l1u1m1);
    expect(before('l1u1m1')).toEqual(served);
    useLearnSessionStore.getState().setCheck(startedOn('l1u1m1', served));
    const r = restorableCheck('l1u1m1', served, 'en');
    expect(r?.check.run).toMatchObject({ index: 2, scores: [1, 0.5] });
  });
});
