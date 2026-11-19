/**
 * The independent review of the two-tab saving (fix pass, 2026-11-19).
 *
 * Item 1: a record THIS tab held (a module's result, a Drill fact, the
 * metronome) that the save no longer has — another tab reset the data, or
 * imported a file without it — must get only this tab's changes since its
 * base, never its older values. Each case for a reset and for an import, on a
 * record the tab did hold (the first round's tests only touched records it
 * never held, which is why they passed while old data came back).
 * Also: item 2 (following other tabs loads lazily; a failed download costs
 * nothing, is tried again, and writing never depends on it), item 4 (a broken
 * save another tab left is never adopted), item 7 (storage cleared under a
 * live store, then a write), item 8 (older code over a newer save on loading).
 *
 * Every written save is printed (`WRITTEN <case>`) so the review can compare.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import settingsV6 from './fixtures/settings-v6-before-start.json';
import { applyAnswer } from '../../services/drillScheduler';
import { getDueReviewModuleIds } from '../../services/spacedRepetition';

const PROGRESS = 'music-theory-progress';
const DRILL = 'fermata-drill-v1';
const SETTINGS = 'music-theory-app';
const NOW = 1_800_000_000_000;

type Safe = typeof import('../tabSafe');
const opened: { safe: Safe; key: string }[] = [];
async function openTab<M>(key: string, load: () => Promise<M>): Promise<M> {
  vi.resetModules();
  const mod = await load();
  const safe = await import('../tabSafe');
  await import('../tabSync');
  await new Promise((resolve) => setTimeout(resolve, 0));
  opened.push({ safe, key });
  return mod;
}
const deliver = (key: string) => window.dispatchEvent(new StorageEvent('storage', { key }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- saved JSON, read freely in assertions
const saved = (key: string): { state: any; version: number } => JSON.parse(localStorage.getItem(key)!);
const printed = (name: string, key: string) => {
  process.stdout.write(`WRITTEN ${name} ${localStorage.getItem(key)}\n`);
  return saved(key);
};
const progressTab = () => openTab(PROGRESS, () => import('../progressStore'));
const drillTab = () => openTab(DRILL, () => import('../drillStore'));
const settingsTab = () => openTab(SETTINGS, () => import('../store'));

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});
afterEach(() => {
  for (const { safe, key } of opened.splice(0)) safe.tabLine(key)?.stop?.();
  vi.useRealTimers();
  vi.doUnmock('../tabSync');
  localStorage.clear();
  localStorage.setItem(SETTINGS, JSON.stringify({ state: {}, version: 6 }));
});

const SCHEDULE = { completedAt: 1, nextReviewAt: 2, intervalLevel: 1, reviewCount: 1, lastReviewedAt: 1 };
/** This tab's progress: l1u1m1 done, scores e1 = 1, e2 = 0.5 in 5 attempts, passed, a review schedule. */
const HELD = { state: { progress: {
  completedModules: ['l1u1m1'],
  moduleProgress: { l1u1m1: ['l1u1m1t1'] },
  exerciseResults: { l1u1m1: { scores: { l1u1m1e1: 1, l1u1m1e2: 0.5 }, totalAttempts: 5, lastAttemptAt: 1000, passed: true } },
  reviewSchedules: { l1u1m1: SCHEDULE },
} }, version: 4 };
/** A file imported in another tab: other progress, without l1u1m1. */
const IMPORTED = { state: { progress: {
  completedModules: ['l1u2m1'],
  moduleProgress: { l1u2m1: ['l1u2m1t1'] },
  exerciseResults: { l1u2m1: { scores: { l1u2m1e1: 1 }, totalAttempts: 1, lastAttemptAt: 2000, passed: true } },
  reviewSchedules: { l1u2m1: SCHEDULE },
} }, version: 4 };
const NEW_RESULT = { scores: { l1u1m1e3: 1 }, totalAttempts: 1, lastAttemptAt: NOW, passed: false };

describe('item 1: a record this tab held, gone from the save — only this tab\'s changes come back', () => {
  it('progress, Reset app data elsewhere: a new score in l1u1m1 writes that score alone, on a new result; nothing else', async () => {
    localStorage.setItem(PROGRESS, JSON.stringify(HELD));
    const b = await progressTab();
    localStorage.removeItem(PROGRESS); // another tab's reset; B never heard of it
    b.useProgressStore.getState().recordExerciseResult('l1u1m1', 'l1u1m1e3', 1);
    expect(printed('progress-reset', PROGRESS).state.progress).toEqual({
      completedModules: [], moduleProgress: {}, exerciseResults: { l1u1m1: NEW_RESULT }, reviewSchedules: {},
    });
  });

  it('progress, a file imported elsewhere without l1u1m1: the import stays whole, l1u1m1 holds only the new score', async () => {
    localStorage.setItem(PROGRESS, JSON.stringify(HELD));
    const b = await progressTab();
    localStorage.setItem(PROGRESS, JSON.stringify(IMPORTED));
    b.useProgressStore.getState().recordExerciseResult('l1u1m1', 'l1u1m1e3', 1);
    expect(printed('progress-import', PROGRESS).state.progress).toEqual({
      ...IMPORTED.state.progress,
      exerciseResults: { ...IMPORTED.state.progress.exerciseResults, l1u1m1: NEW_RESULT },
    });
  });

  it('progress, a review answered after a reset elsewhere: no orphan schedule (no review comes up for a module not completed)', async () => {
    localStorage.setItem(PROGRESS, JSON.stringify(HELD));
    const b = await progressTab();
    localStorage.removeItem(PROGRESS);
    b.useProgressStore.getState().recordReviewResult('l1u1m1', true);
    const p = printed('progress-orphan', PROGRESS).state.progress;
    expect(p.reviewSchedules).toEqual({});
    expect(getDueReviewModuleIds(p, NOW * 2)).toEqual([]);
    // Over an import: only the imported schedules.
    const c = await progressTab();
    localStorage.setItem(PROGRESS, JSON.stringify(HELD));
    await c.useProgressStore.persist.rehydrate();
    localStorage.setItem(PROGRESS, JSON.stringify(IMPORTED));
    c.useProgressStore.getState().recordReviewResult('l1u1m1', true);
    expect(printed('progress-orphan-import', PROGRESS).state.progress.reviewSchedules).toEqual({ l1u2m1: SCHEDULE });
  });

  const fact = { id: 'f1', family: 'interval' as const, promptKey: 'p', promptParams: {}, input: { format: 'choice' as const, choices: ['A', 'B'] }, answer: { kind: 'choice' as const, correct: 'A' }, whyKey: 'w', whyParams: {}, rank: 0 };
  async function drillWithSixAnswers() {
    const b = await drillTab();
    b.useDrillStore.getState().startSession([fact], NOW);
    for (let i = 0; i < 6; i++) b.useDrillStore.getState().recordAnswer(fact, true, 800, NOW + 86_400_000 * i);
    expect(saved(DRILL).state.items.f1.history).toHaveLength(6);
    return b;
  }
  const seventh = NOW + 86_400_000 * 7;

  it('Drill, Reset app data elsewhere: the next answer to a fact answered 6 times is that one answer on a new card', async () => {
    const b = await drillWithSixAnswers();
    localStorage.removeItem(DRILL);
    b.useDrillStore.getState().recordAnswer(fact, false, 900, seventh);
    const s = printed('drill-reset', DRILL).state;
    expect(s.items).toEqual({ f1: JSON.parse(JSON.stringify(applyAnswer(undefined, false, 900, seventh, `s${NOW}`))) });
    expect(s.items.f1.history).toHaveLength(1);
    expect(s.lifetime).toEqual({ answered: 1, correct: 0 });
  });

  it('Drill, a file imported elsewhere without that fact: the import stays, the fact is that one answer on a new card', async () => {
    const b = await drillWithSixAnswers();
    const other = applyAnswer(undefined, true, 700, NOW, 'imported');
    localStorage.setItem(DRILL, JSON.stringify({ state: { ...saved(DRILL).state, items: { f2: other }, lifetime: { answered: 40, correct: 30 }, activeSession: null }, version: 3 }));
    b.useDrillStore.getState().recordAnswer(fact, false, 900, seventh);
    const s = printed('drill-import', DRILL).state;
    expect(Object.keys(s.items).sort()).toEqual(['f1', 'f2']);
    expect(s.items.f2).toEqual(JSON.parse(JSON.stringify(other)));
    expect(s.items.f1).toEqual(JSON.parse(JSON.stringify(applyAnswer(undefined, false, 900, seventh, `s${NOW}`))));
    expect(s.lifetime).toEqual({ answered: 41, correct: 30 });
  });

  it('Drill, a file imported elsewhere WITH that fact: the imported answers stay and this tab\'s one answer moves the imported card on; the 6 old answers do not come back', async () => {
    const b = await drillWithSixAnswers();
    const importedFact = applyAnswer(applyAnswer(undefined, true, 700, NOW + 1, 'imp'), true, 700, NOW + 2, 'imp');
    localStorage.setItem(DRILL, JSON.stringify({ state: { ...saved(DRILL).state, items: { f1: importedFact } }, version: 3 }));
    b.useDrillStore.getState().recordAnswer(fact, false, 900, seventh);
    const f1 = printed('drill-import-same', DRILL).state.items.f1;
    expect(f1).toEqual(JSON.parse(JSON.stringify(applyAnswer(importedFact, false, 900, seventh, `s${NOW}`))));
    expect(f1.history).toHaveLength(3);
  });

  it('settings, Reset app data elsewhere: changing the metronome\'s tempo writes that tempo on the default beats, not the old beats', async () => {
    localStorage.setItem(SETTINGS, JSON.stringify({ state: { ...settingsV6.state, metronome: { bpm: 100, beats: 3 } }, version: 6 }));
    const b = await settingsTab();
    localStorage.removeItem(SETTINGS);
    b.useAppStore.getState().setMetronome({ bpm: 120, beats: 3 });
    const s = printed('settings-reset', SETTINGS).state;
    expect(s.metronome).toEqual({ bpm: 120, beats: 4 });
    // Nothing else of this tab's older settings: the rest is the defaults.
    const { metronome: _m, ...rest } = s;
    void _m;
    const defaults = JSON.parse(JSON.stringify(b.useAppStore.persist.getOptions().partialize!(b.useAppStore.getInitialState())));
    expect(rest).toEqual(defaults);
  });

  it('settings, a file imported elsewhere: changing the tempo keeps the imported beats', async () => {
    localStorage.setItem(SETTINGS, JSON.stringify({ state: { ...settingsV6.state, metronome: { bpm: 100, beats: 3 } }, version: 6 }));
    const b = await settingsTab();
    localStorage.setItem(SETTINGS, JSON.stringify({ state: { ...settingsV6.state, themeMode: 'fermata-night', metronome: { bpm: 60, beats: 4 } }, version: 6 }));
    b.useAppStore.getState().setMetronome({ bpm: 120, beats: 3 });
    const s = printed('settings-import', SETTINGS).state;
    expect(s.metronome).toEqual({ bpm: 120, beats: 4 });
    expect(s.themeMode).toBe('fermata-night');
  });

  it('settings: the key is one choice — two tabs changing it never mix a letter from one with an accidental from the other', async () => {
    localStorage.setItem(SETTINGS, JSON.stringify(settingsV6));
    const b = await settingsTab();
    const before = b.useAppStore.getState().selectedKey;
    localStorage.setItem(SETTINGS, JSON.stringify({ ...settingsV6, state: { ...settingsV6.state, selectedKey: { natural: 'G', accidental: '' } } }));
    b.useAppStore.setState({ selectedKey: { natural: before.natural, accidental: before.accidental === '#' ? 'b' : '#' } });
    expect(saved(SETTINGS).state.selectedKey).toEqual(b.useAppStore.getState().selectedKey);
  });
});

describe('item 1, the class: any record the save lacks, with or without an empty form', () => {
  it('the engine: a record changed here but gone from the save keeps only the fields changed here (field by field, at every depth)', async () => {
    const { mergeBy } = await import('../tabMerge');
    const base = { r: { a: 1, b: 2, deep: { x: 1, y: 2 } }, kept: 1 };
    const mine = { r: { a: 3, b: 2, deep: { x: 1, y: 5 } }, kept: 1 };
    expect(mergeBy('fields', base, mine, { kept: 9 })).toEqual({ kept: 9, r: { a: 3, deep: { y: 5 } } });
    expect(mergeBy({ r: { '*': 'atomic', deep: 'fields' } }, base, mine, {})).toEqual({ r: { a: 3, deep: { y: 5 } } });
  });

  it('fingerings, a file imported elsewhere without overrides: a finger set here is written alone; this tab\'s older fingers do not come back', async () => {
    const FINGERING = 'fermata-fingering-v1';
    localStorage.setItem(FINGERING, JSON.stringify({ state: { overrides: { 'major|standard|p2|0|1': 2, 'major|standard|p2|1|0': 1 }, labelMode: 'degree' }, version: 1 }));
    const b = await openTab(FINGERING, () => import('../fingeringStore'));
    localStorage.setItem(FINGERING, JSON.stringify({ state: { labelMode: 'note' }, version: 1 }));
    b.useFingeringStore.getState().setOverride('major|standard|p3|2|1', 4);
    expect(printed('fingering-import', FINGERING).state).toEqual({ labelMode: 'note', overrides: { 'major|standard|p3|2|1': 4 } });
  });
});

describe('item 4: a broken save another tab left is never adopted', () => {
  it('progress: storage becomes {"progress":"oops"}; this tab keeps its completed modules, and its next tick heals the save', async () => {
    localStorage.setItem(PROGRESS, JSON.stringify(HELD));
    const b = await progressTab();
    localStorage.setItem(PROGRESS, '{"state":{"progress":"oops"},"version":4}');
    deliver(PROGRESS);
    expect(b.useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1']);
    b.useProgressStore.getState().toggleTask('l1u1m1', 'l1u1m1t2');
    const p = saved(PROGRESS).state.progress;
    expect(p.completedModules).toEqual(['l1u1m1']);
    expect(p.moduleProgress).toEqual({ l1u1m1: ['l1u1m1t1', 'l1u1m1t2'] });
    expect(p.exerciseResults).toEqual(HELD.state.progress.exerciseResults);
  });
});

describe('item 7: storage cleared under a live store (the reset-elsewhere path), then a write', () => {
  it('settings and progress: only that write\'s change lands, on the defaults; nothing of the memory before comes back', async () => {
    const { useAppStore } = await import('../store');
    const { useProgressStore } = await import('../progressStore');
    localStorage.setItem(SETTINGS, JSON.stringify({ state: { ...settingsV6.state, capoFret: 4, neckNutSide: 'left', metronome: { bpm: 100, beats: 3 } }, version: 6 }));
    localStorage.setItem(PROGRESS, JSON.stringify(HELD));
    await useAppStore.persist.rehydrate();
    await useProgressStore.persist.rehydrate();
    expect(useAppStore.getState().capoFret).toBe(4);
    localStorage.clear(); // nobody told the stores
    useAppStore.getState().setThemeMode('fermata-night');
    useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t1');
    const s = saved(SETTINGS).state;
    expect(s.themeMode).toBe('fermata-night');
    for (const k of ['capoFret', 'neckNutSide', 'metronome']) expect(s, k).not.toHaveProperty(k);
    expect(saved(PROGRESS).state.progress).toEqual({ completedModules: [], moduleProgress: { l1u34m1: ['l1u34m1t1'] }, exerciseResults: {}, reviewSchedules: {} });
  });
});

describe('item 8: older code loading over a newer save (kept on purpose)', () => {
  it('a page with older code reads a newer-version save and writes it down to its own version on loading (zustand\'s own path: a rollback deploy stays usable)', async () => {
    const newer = { state: { progress: { completedModules: ['l1u1m1'], moduleProgress: { l1u1m1: ['t1'] } } }, version: 99 };
    localStorage.setItem(PROGRESS, JSON.stringify(newer));
    const b = await progressTab();
    expect(b.useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1']);
    expect(saved(PROGRESS)).toEqual({ state: newer.state, version: 4 });
  });
});

describe('item 2: following loads lazily; writing never depends on it', () => {
  it('a failed download of the following costs nothing: writes still merge; it is tried again when the page is back online, and then follows', async () => {
    let fail = true;
    vi.resetModules();
    vi.doMock('../tabSync', async () => {
      if (fail) throw new Error('offline');
      return vi.importActual('../tabSync');
    });
    const b = await import('../progressStore');
    await new Promise((resolve) => setTimeout(resolve, 0));
    const safe = await import('../tabSafe');
    opened.push({ safe, key: PROGRESS });
    expect(safe.tabLine(PROGRESS)?.adopt).toBeUndefined(); // not following
    // Another tab ticks; this tab, not following, still writes on top of it.
    localStorage.setItem(PROGRESS, JSON.stringify({ state: { progress: { completedModules: [], moduleProgress: { l1u34m1: ['l1u34m1t1'] } } }, version: 4 }));
    b.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t2');
    expect(saved(PROGRESS).state.progress.moduleProgress).toEqual({ l1u34m1: ['l1u34m1t1', 'l1u34m1t2'] });
    // Back online: tried again, and now it follows.
    fail = false;
    window.dispatchEvent(new Event('online'));
    await vi.waitFor(() => expect(safe.tabLine(PROGRESS)?.adopt).toBeTypeOf('function'));
    localStorage.setItem(PROGRESS, JSON.stringify({ state: { progress: { completedModules: ['l1u1m1'], moduleProgress: {} } }, version: 4 }));
    deliver(PROGRESS);
    expect(b.useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1']);
  });
});
