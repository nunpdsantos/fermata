/**
 * A lesson counts only its own exercises' saved scores (second audit round,
 * 2026-11-19; useLearnProgress.ts `ownEarned`).
 *
 * A module's saved result could hold scores that are not of its exercises: a
 * score another tab's write left under the wrong lesson (the merge fault fixed
 * in state/tabMerge.ts, twoTabsMarks.test.ts), and the scores of 31 generated
 * questions that releases of February to June 2026 served in nine modules
 * though they were other topics' questions (templates keyed to the wrong
 * module), removed on 17 April and 9 June 2026, before retiring scores
 * existed, so no migration drops them. The lesson's pass (80 % of its
 * exercises' points, or a passing run), and with it the Check card's line, the
 * section rail's ✓ and "Complete the lesson", counted every value saved under
 * the module. Now only the scores saved under the ids of the exercises the
 * module serves count; nothing is deleted from the save. Established before
 * the change: the app's loader serves, for every module in EN / PT / ES,
 * exactly the identity snapshot's ids; every id any release served (all 173
 * first-parent commits from 10 February 2026) names its module and was served
 * in no other; every id no longer served is retired, but for these 31.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, renderHook, screen, within } from '@testing-library/react';
import snapshot from '../../data/exercises/__tests__/exerciseIdentities.json';
import { RETIRED_EXERCISE_IDS } from '../../state/retiredExerciseIds';
import type { CurriculumProgress } from '../../core/types/curriculum';
import type { ModuleExerciseResult } from '../../core/types/exercise';

vi.mock('../../components/notation/StaffNotation', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }) };
});
vi.mock('../../components/notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }) };
});
vi.mock('../../core/services/audio', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../core/services/audio')>();
  return { ...original, resumeAudio: vi.fn().mockResolvedValue(undefined), playNote: vi.fn(), playPitchedNotes: vi.fn(), playScale: vi.fn(), playChordVoiced: vi.fn(), playTimedNotes: vi.fn(), cancelScheduledAudio: vi.fn(), stopPlayback: vi.fn() };
});

import { useLearnProgress, ownEarned } from '../useLearnProgress';
import { useProgressStore } from '../../state/progressStore';
import { useAppStore } from '../../state/store';
import { useLearnSessionStore } from '../../state/learnSessionStore';
import { getDefaultProgress } from '../../data/curriculumLoader';
import { LearnView } from '../../views/LearnView';
import { L1_UNITS } from '../../core/constants/curriculumL1';

/** Each module's exercises, by id, as the app serves them (the loader serves exactly these: see above). */
const OWN = Object.fromEntries(Object.entries(snapshot as Record<string, Record<string, string>>).map(([m, ids]) => [m, Object.keys(ids)]));
const KEY = 'music-theory-progress';
const result = (scores: Record<string, 0 | 0.5 | 1>, passed = false): ModuleExerciseResult => ({ scores, totalAttempts: Object.keys(scores).length || 1, lastAttemptAt: 1793000000000, passed });
const withResults = (exerciseResults: Record<string, ModuleExerciseResult>): CurriculumProgress => ({ ...getDefaultProgress(), exerciseResults });
/** Release 16's reading, kept here as the baseline: every value saved under the module. */
const oldEarned = (r: ModuleExerciseResult | undefined) => (r ? Object.values(r.scores).reduce<number>((s, x) => s + x, 0) : 0);
const oldPassed = (r: ModuleExerciseResult | undefined, n: number) => n === 0 || (!!r && (r.passed || oldEarned(r) >= n * 0.8));

function setWide() {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('min-width: 1024px'),
    media: query, addEventListener: () => {}, removeEventListener: () => {}, onchange: null,
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

beforeAll(() => {
  // jsdom lacks these (as lessonFlow.test.tsx stubs them).
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
beforeEach(() => {
  localStorage.clear();
  useProgressStore.setState({ progress: getDefaultProgress() });
  useLearnSessionStore.setState({ screen: null, check: null });
  useAppStore.setState({ language: 'en', view: 'learn', pendingLearnTarget: null });
});
afterEach(() => cleanup());

describe('the hook: total and pass on the module\'s own exercises', () => {
  it('one own score and one stray (another lesson\'s exercise): the stray counts for nothing and stays saved', () => {
    const progress = withResults({ l1u1m1: result({ l1u1m1e1: 1, l1u1m2e1: 1 }) });
    useProgressStore.setState({ progress }); // saved as the store saves it
    const saved = localStorage.getItem(KEY);
    expect(JSON.parse(saved!).state.progress.exerciseResults.l1u1m1.scores).toEqual({ l1u1m1e1: 1, l1u1m2e1: 1 });
    const { result: hook } = renderHook(() => useLearnProgress());
    const own = ['l1u1m1e1', 'l1u1m1e2'];
    expect(hook.current.getModuleExerciseScore('l1u1m1', own)).toEqual({ earned: 1, total: 2 });
    expect(hook.current.isModuleExercisesPassed('l1u1m1', own)).toBe(false); // 1 of 1.6 needed; with the stray it was 2
    expect(oldPassed(progress.exerciseResults!.l1u1m1, 2)).toBe(true);
    // Nothing deleted on reading.
    expect(useProgressStore.getState().progress.exerciseResults!.l1u1m1.scores).toEqual({ l1u1m1e1: 1, l1u1m2e1: 1 });
    expect(localStorage.getItem(KEY)).toBe(saved);
  });

  it('a passing run still passes, whatever the scores; a module with no exercises still passes', () => {
    useProgressStore.setState({ progress: withResults({ l1u1m1: result({ l1u1m2e1: 1 }, true) }) });
    const { result: hook } = renderHook(() => useLearnProgress());
    expect(hook.current.isModuleExercisesPassed('l1u1m1', OWN.l1u1m1)).toBe(true);
    expect(hook.current.isModuleExercisesPassed('l1u1m2', [])).toBe(true);
  });
});

describe('the lesson: the Check card, the rail\'s ✓ and "Complete the lesson" ignore a stray score', () => {
  const MOD = L1_UNITS[0].modules[0]; // l1u1m1, The Staff and Clefs: 9 questions, 7.2 points to pass
  async function open(scores: Record<string, 0 | 0.5 | 1>) {
    setWide();
    useProgressStore.setState({ progress: { ...withResults({ [MOD.id]: result(scores) }), moduleProgress: { [MOD.id]: MOD.tasks.map((t) => t.id) } } });
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: L1_UNITS[0].id, moduleId: MOD.id } });
    render(<LearnView />);
    const card = await screen.findByTestId('check-card', {}, { timeout: 8000 });
    await within(card).findByRole('heading', { level: 2 }, { timeout: 8000 });
    const rail = screen.getByTestId('section-rail');
    const check = within(rail).getAllByRole('button').find((b) => (b.getAttribute('aria-label') ?? '').includes(' · 9 '));
    return { heading: within(card).getByRole('heading', { level: 2 }).textContent, complete: within(card).queryByRole('button', { name: 'Complete the lesson' }), checkRail: check?.getAttribute('aria-label') };
  }
  const seven = Object.fromEntries(OWN[MOD.id].slice(0, 7).map((id) => [id, 1 as const]));

  it('seven of its own right and one of another lesson: not passed (the stray made eight)', async () => {
    expect(OWN[MOD.id]).toHaveLength(9);
    const shown = await open({ ...seven, l1u1m2e1: 1 });
    expect(shown.heading).toBe('Ready to check yourself?');
    expect(shown.complete).toBeNull();
    expect(shown.checkRail).toBeDefined();
    expect(shown.checkRail).not.toContain('(done)');
  }, 20_000);

  it('eight of its own right: passed — the card, the ✓ and "Complete the lesson" (the test sees each)', async () => {
    const shown = await open({ ...seven, [OWN[MOD.id][7]]: 1 });
    expect(shown.heading).toBe('Check passed');
    expect(shown.complete).not.toBeNull();
    expect(shown.checkRail).toContain('(done)');
  }, 20_000);
});

describe('production-shaped saves read as before, module by module', () => {
  // The frozen production shapes of respelledScores.test.ts (its 11 results, a superset of
  // guitarNotationProgress.test.ts's 2) and progressUnlock.test.ts (its l2u4m2), verbatim.
  const T = 1793000000000;
  const FROZEN: Record<string, Record<string, ModuleExerciseResult>> = {
    respelledScores: {
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
    progressUnlock: {
      l1u1m1: { scores: { l1u1m1e1: 1, l1u1m1e2: 0.5, l1u1m1g6: 0 }, totalAttempts: 7, lastAttemptAt: T, passed: true },
      l2u4m2: { scores: { l2u4m2e1: 1 }, totalAttempts: 1, lastAttemptAt: T, passed: false },
    },
    // Every module, every one of its exercises answered (1, 0.5, 0 in turn): nothing stray.
    everyModuleAnswered: Object.fromEntries(Object.entries(OWN).map(([m, ids]) => [m, result(Object.fromEntries(ids.map((id, i) => [id, ([1, 0.5, 0] as const)[i % 3]])))])),
  };

  for (const [name, results] of Object.entries(FROZEN)) {
    it(`${name}: every module's total and pass equal release 16's reading`, () => {
      useProgressStore.setState({ progress: withResults(results) });
      const { result: hook } = renderHook(() => useLearnProgress());
      const diffs: string[] = [];
      for (const [m, ids] of Object.entries(OWN)) {
        const r = results[m];
        const now = hook.current.getModuleExerciseScore(m, ids);
        if (now.earned !== oldEarned(r) || now.total !== ids.length) diffs.push(`${m} earned ${now.earned} (was ${oldEarned(r)})`);
        if (hook.current.isModuleExercisesPassed(m, ids) !== oldPassed(r, ids.length)) diffs.push(`${m} passed`);
      }
      expect(Object.keys(OWN)).toHaveLength(136);
      expect(diffs).toEqual([]);
    });
  }
});

describe('the 31 scores of removed questions that were never retired', () => {
  const REMOVED_UNRETIRED: Record<string, string[]> = {
    l4u14m2: ['g1', 'g2', 'g3', 'g4', 'g5'], l4u14m3: ['g1', 'g2'], l4u14m4: ['g1', 'g2', 'g3'], l4u14m5: ['g1', 'g2', 'g3'],
    l5u16m5: ['g1', 'g2'], l5u17m1: ['g4', 'g5', 'g6'], l5u17m3: ['g1', 'g2', 'g3'], l5u17m4: ['g1', 'g2', 'g3', 'g4'],
    l9u32m5: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
  };
  const ids = (m: string) => REMOVED_UNRETIRED[m].map((s) => `${m}${s}`);

  it('are served today by no module and were never retired (served again, their old scores would attach to new questions)', () => {
    const retired = new Set(RETIRED_EXERCISE_IDS.flatMap((r) => Object.entries(r.ids).flatMap(([m, s]) => s.split(' ').filter(Boolean).map((x) => `${m}${x}`))));
    const all = Object.keys(REMOVED_UNRETIRED).flatMap(ids);
    expect(all).toHaveLength(31);
    for (const id of all) {
      expect(Object.values(OWN).some((list) => list.includes(id)), id).toBe(false);
      expect(retired.has(id), id).toBe(false);
    }
  });

  it('count for nothing in their modules, and stay in the save', () => {
    const results = Object.fromEntries(Object.keys(REMOVED_UNRETIRED).map((m) => [m, result(Object.fromEntries(ids(m).map((id) => [id, 1 as const])))]));
    useProgressStore.setState({ progress: withResults(results) });
    const { result: hook } = renderHook(() => useLearnProgress());
    for (const m of Object.keys(REMOVED_UNRETIRED)) {
      expect(hook.current.getModuleExerciseScore(m, OWN[m]).earned, m).toBe(0);
      expect(oldEarned(results[m]), m).toBe(REMOVED_UNRETIRED[m].length);
      expect(ownEarned(results[m], OWN[m])).toBe(0);
    }
    act(() => {});
    expect(useProgressStore.getState().progress.exerciseResults).toEqual(results);
  });
});
