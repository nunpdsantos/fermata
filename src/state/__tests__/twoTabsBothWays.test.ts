/**
 * Saving with several tabs, both directions (second review of the A1 fix,
 * 2026-11-19). The one rule (state/tabMerge.ts): after any write, the save
 * holds exactly what one learner's actions, in time order across all tabs,
 * would have produced. A record one tab removed is gone, with whatever any
 * tab did to it before; only changes made after the removal are in the save.
 * And a merged save is one its store's own guard reads back unchanged.
 *
 * The first round proved one direction (another tab removed what this tab
 * holds). These are the other direction (THIS tab removes what another tab
 * changed), saves a store cannot read, the settings that came out invalid, a
 * check or a session ended in one tab while another tab's is saved, and the
 * hydration race. Every written save is printed (`WRITTEN <case>`).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import settingsV6 from './fixtures/settings-v6-before-start.json';
import { applyAnswer } from '../../services/drillScheduler';

const PROGRESS = 'music-theory-progress';
const DRILL = 'fermata-drill-v1';
const FINGERING = 'fermata-fingering-v1';
const SETTINGS = 'music-theory-app';
const SESSION = 'fermata-learn-session-v1';
const NOW = 1_800_000_000_000;
const DAY = 86_400_000;

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
/** What a store's memory saves, as JSON (the bytes a single tab writes). */
const asSaved = (store: { getState: () => object; persist: { getOptions: () => { partialize?: (s: never) => unknown } } }) =>
  JSON.parse(JSON.stringify(store.persist.getOptions().partialize!(store.getState() as never)));

const progressTab = () => openTab(PROGRESS, () => import('../progressStore'));
const drillTab = () => openTab(DRILL, () => import('../drillStore'));
const settingsTab = () => openTab(SETTINGS, () => import('../store'));
const fingeringTab = () => openTab(FINGERING, () => import('../fingeringStore'));
const sessionTab = () => openTab(SESSION, () => import('../learnSessionStore'));

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});
afterEach(() => {
  for (const { safe, key } of opened.splice(0)) safe.tabLine(key)?.stop?.();
  vi.useRealTimers();
  vi.restoreAllMocks();
  localStorage.clear();
  localStorage.setItem(SETTINGS, JSON.stringify({ state: {}, version: 6 }));
});

const fact = (id: string) => ({
  id, family: 'interval' as const, promptKey: 'p', promptParams: {}, input: { format: 'choice' as const, choices: ['A', 'B'] },
  answer: { kind: 'choice' as const, correct: 'A' }, whyKey: 'w', whyParams: {}, rank: 0,
});

describe('finding 1: this tab resets Drill while the save holds another tab\'s answers it never heard of', () => {
  /** A answers f1 four times; B hears it and answers f1 once; A never hears B. */
  async function twoTabs() {
    const a = await drillTab();
    const b = await drillTab();
    a.useDrillStore.getState().startSession([fact('f1'), fact('f2')], NOW);
    for (let i = 0; i < 4; i++) a.useDrillStore.getState().recordAnswer(fact('f1'), true, 800, NOW + DAY * i);
    deliver(DRILL);
    b.useDrillStore.getState().startSession([fact('f1')], NOW + 1000);
    b.useDrillStore.getState().recordAnswer(fact('f1'), false, 900, NOW + 5 * DAY);
    b.useDrillStore.getState().recordSprint('k', 16);
    expect(saved(DRILL).state.items.f1.history).toHaveLength(5);
    return { a, b };
  }

  it('the reset is the latest action: nothing answered before it comes back — no fact, no best, the counters both 0, no session', async () => {
    const { a } = await twoTabs();
    a.useDrillStore.getState().resetDrillProgress();
    const s = printed('drill-reset-here', DRILL).state;
    expect(s).toEqual(asSaved(a.useDrillStore));
    expect(s.items).toEqual({});
    expect(s.sprintBests).toEqual({});
    expect(s.lifetime).toEqual({ answered: 0, correct: 0 });
    expect(s.activeSession).toBeNull();
    expect(s.introDone).toBe(true);
  });

  it('then this tab answers f1 once: one answer, on a new card (not 6 records)', async () => {
    const { a } = await twoTabs();
    a.useDrillStore.getState().resetDrillProgress();
    a.useDrillStore.getState().startSession([fact('f1')], NOW + 6 * DAY);
    a.useDrillStore.getState().recordAnswer(fact('f1'), true, 800, NOW + 6 * DAY + 5);
    const s = printed('drill-reset-here-then-answer', DRILL).state;
    expect(s.items).toEqual({ f1: JSON.parse(JSON.stringify(applyAnswer(undefined, true, 800, NOW + 6 * DAY + 5, `s${NOW + 6 * DAY}`))) });
    expect(s.lifetime).toEqual({ answered: 1, correct: 1 });
  });

  it('a tab whose own Drill was already empty resets: the other tab\'s facts, best and session go too', async () => {
    const a = await drillTab(); // opened with nothing saved; never hears B
    const b = await drillTab();
    b.useDrillStore.getState().startSession([fact('f2')], NOW);
    b.useDrillStore.getState().recordAnswer(fact('f2'), true, 700, NOW + 10);
    b.useDrillStore.getState().recordSprint('k', 12);
    a.useDrillStore.getState().resetDrillProgress();
    const s = printed('drill-reset-empty-tab', DRILL).state;
    expect(s.items).toEqual({});
    expect(s.sprintBests).toEqual({});
    expect(s.lifetime).toEqual({ answered: 0, correct: 0 });
    expect(s.activeSession).toBeNull();
    expect(s.introDone).toBe(true); // B passed the intro; "Reset progress" keeps it
  });

  it('the counters reset as a pair: "correct" never ends above "answered"', async () => {
    const a = await drillTab();
    const b = await drillTab();
    a.useDrillStore.getState().startSession([fact('f1')], NOW);
    for (let i = 0; i < 3; i++) a.useDrillStore.getState().recordAnswer(fact('f1'), false, 900, NOW + i);
    deliver(DRILL);
    b.useDrillStore.getState().startSession([fact('f1')], NOW + 100);
    b.useDrillStore.getState().recordAnswer(fact('f1'), true, 700, NOW + 200); // lifetime {4, 1}
    a.useDrillStore.getState().resetDrillProgress();
    expect(printed('drill-reset-pair', DRILL).state.lifetime).toEqual({ answered: 0, correct: 0 });
  });

  it('the rule itself, below the reset: a fact this tab no longer has is not written, whatever another tab did to it before', async () => {
    const { DRILL_MERGE_RULE, DEFAULT_SETTINGS } = await import('../drillStore');
    const { mergeBy } = await import('../tabMerge');
    const four = [0, 1, 2, 3].reduce<ReturnType<typeof applyAnswer> | undefined>((s, i) => applyAnswer(s, true, 800, NOW + DAY * i, 'sa'), undefined)!;
    const five = applyAnswer(four, false, 900, NOW + 5 * DAY, 'sb');
    const save = (items: object, lifetime: object) => JSON.parse(JSON.stringify({ items, settings: DEFAULT_SETTINGS, sprintBests: {}, lifetime, activeSession: null, sprint: null, introDone: true }));
    const out = mergeBy(DRILL_MERGE_RULE, save({ f1: four }, { answered: 4, correct: 4 }), save({}, { answered: 4, correct: 4 }), save({ f1: five }, { answered: 5, correct: 4 })) as { items: object };
    expect(out.items).toEqual({});
  });

  it('Reset app data in this tab (key removed, then the store reset): nothing of either tab comes back', async () => {
    const { a } = await twoTabs();
    localStorage.removeItem(DRILL);
    a.useDrillStore.getState().resetDrillData();
    const s = printed('drill-reset-data-here', DRILL).state;
    expect(s).toEqual(asSaved(a.useDrillStore));
    expect(s.items).toEqual({});
    expect(s.introDone).toBe(false);
  });
});

describe('a session, a Sprint or a check ended in one tab never erases a DIFFERENT one another tab saved', () => {
  it('Drill: B ends its own session; A\'s session, saved since, stays saved (a reload of A resumes it)', async () => {
    const a = await drillTab();
    const b = await drillTab();
    b.useDrillStore.getState().startSession([fact('f9')], NOW);
    a.useDrillStore.getState().startSession([fact('f1')], NOW + 50);
    a.useDrillStore.getState().recordAnswer(fact('f1'), true, 800, NOW + 60);
    const aSession = saved(DRILL).state.activeSession;
    expect(aSession.id).toBe(`s${NOW + 50}`);
    b.useDrillStore.getState().endSession();
    expect(printed('drill-end-own-session', DRILL).state.activeSession).toEqual(aSession);
    // Ending the SAME session another tab moved on does end it.
    a.useDrillStore.getState().endSession();
    expect(saved(DRILL).state.activeSession).toBeNull();
  });

  it('Drill: B closes its own Sprint; A\'s Sprint under way, saved since, stays saved', async () => {
    const a = await drillTab();
    const b = await drillTab();
    const run = (seed: number) => ({ seed, pool: ['f1', 'f2'], step: 0, correct: 0, secondsLeft: 60, familiesKey: 'k', priorBest: 0, recorded: false });
    b.useDrillStore.getState().saveSprint(run(1));
    a.useDrillStore.getState().saveSprint(run(2));
    a.useDrillStore.getState().saveSprint({ ...run(2), step: 3, correct: 2, secondsLeft: 41 });
    const aRun = saved(DRILL).state.sprint;
    b.useDrillStore.getState().saveSprint(null);
    expect(printed('drill-close-own-sprint', DRILL).state.sprint).toEqual(aRun);
  });

  const screen = (moduleId: string, unitId: string) => ({ type: 'module' as const, levelId: 'l1', unitId, moduleId, section: null, at: Date.now() });
  const check = (moduleId: string, at: number) => ({
    moduleId, kind: 'check' as const, lang: 'en', fingerprints: { [`${moduleId}e1`]: 'f' },
    run: { order: [`${moduleId}e1`], index: 0, scores: [], items: [], attempt: 1 as const, selectedNotes: [], tried: [], missed: null, final: null },
    finished: false, at,
  });

  it('Learn (finding 4): B ends its own older check while A\'s check in another lesson is saved: A\'s check and place stay', async () => {
    const a = await sessionTab();
    const b = await sessionTab();
    b.useLearnSessionStore.getState().setScreen(screen('l1u1m1', 'u1'));
    b.useLearnSessionStore.getState().setCheck(check('l1u1m1', NOW + 1));
    a.useLearnSessionStore.getState().setScreen(screen('l1u34m1', 'u34'));
    a.useLearnSessionStore.getState().setCheck(check('l1u34m1', NOW + 2));
    const before = localStorage.getItem(SESSION);
    b.useLearnSessionStore.getState().setCheck(null);
    const s = printed('learn-end-own-check', SESSION).state;
    expect(s.check).toEqual(check('l1u34m1', NOW + 2));
    expect(s.screen.moduleId).toBe('l1u34m1');
    expect(localStorage.getItem(SESSION)).toBe(before);
  });

  it('Learn, the same class: B leaves Learn (no lesson, no check) while A\'s lesson and check are saved: A\'s stay', async () => {
    const a = await sessionTab();
    const b = await sessionTab();
    b.useLearnSessionStore.getState().setScreen(screen('l1u1m1', 'u1'));
    a.useLearnSessionStore.getState().setScreen(screen('l1u34m1', 'u34'));
    a.useLearnSessionStore.getState().setCheck(check('l1u34m1', NOW + 2));
    const before = localStorage.getItem(SESSION);
    b.useLearnSessionStore.getState().setScreen(null); // LearnView, leaving for the overview
    b.useLearnSessionStore.getState().setCheck(null);
    expect(printed('learn-leave', SESSION).state.screen.moduleId).toBe('l1u34m1');
    expect(localStorage.getItem(SESSION)).toBe(before);
  });

  it('Learn: ending the SAME check another tab continued ends it', async () => {
    const a = await sessionTab();
    const b = await sessionTab();
    a.useLearnSessionStore.getState().setScreen(screen('l1u1m1', 'u1'));
    a.useLearnSessionStore.getState().setCheck(check('l1u1m1', NOW + 1));
    b.useLearnSessionStore.getState().setCheck(check('l1u1m1', NOW + 3)); // the same run, moved on in B
    a.useLearnSessionStore.getState().setCheck(null);
    expect(saved(SESSION).state.check).toBeNull();
  });
});

const SCHEDULE = { completedAt: 1, nextReviewAt: 2, intervalLevel: 1, reviewCount: 1, lastReviewedAt: 1 };
const THREE_DONE = { state: { progress: { completedModules: ['l1u1m1', 'l1u1m2', 'l1u1m3'], moduleProgress: { l1u1m1: ['a'] } } }, version: 4 };

describe('finding 2: a save the store cannot read, in any version, is broken — never adopted, never merged into', () => {
  for (const [name, raw] of [
    ['v3 progress "oops"', '{"state":{"progress":"oops"},"version":3}'],
    ['v4 progress "oops"', '{"state":{"progress":"oops"},"version":4}'],
    ['v3 state null', '{"state":null,"version":3}'],
    ['v2 state a string', '{"state":"x","version":2}'],
    ['v0 completedModules a string', '{"state":{"completedModules":"x"},"version":0}'],
  ] as const) {
    it(`progress, ${name}: one tick writes this tab's memory whole; memory keeps its three modules`, async () => {
      localStorage.setItem(PROGRESS, JSON.stringify(THREE_DONE));
      const b = await progressTab();
      localStorage.setItem(PROGRESS, raw);
      b.useProgressStore.getState().toggleTask('l1u34m1', 't1');
      const s = printed(`progress-broken ${name}`, PROGRESS);
      expect(s).toEqual({ state: { progress: { ...THREE_DONE.state.progress, moduleProgress: { l1u1m1: ['a'], l1u34m1: ['t1'] } } }, version: 4 });
      expect(b.useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1', 'l1u1m2', 'l1u1m3']);
    });

    it(`progress, ${name}, by a storage event alone: memory unchanged, nothing written`, async () => {
      localStorage.setItem(PROGRESS, JSON.stringify(THREE_DONE));
      const b = await progressTab();
      localStorage.setItem(PROGRESS, raw);
      deliver(PROGRESS);
      expect(b.useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1', 'l1u1m2', 'l1u1m3']);
      expect(localStorage.getItem(PROGRESS)).toBe(raw);
    });
  }

  it('Drill, an older-version save that is not an object: an answer writes this tab\'s memory whole', async () => {
    const a = await drillTab();
    a.useDrillStore.getState().startSession([fact('f1')], NOW);
    for (let i = 0; i < 4; i++) a.useDrillStore.getState().recordAnswer(fact('f1'), true, 800, NOW + DAY * i);
    localStorage.setItem(DRILL, '{"state":"oops","version":2}');
    a.useDrillStore.getState().recordAnswer(fact('f1'), true, 800, NOW + 9 * DAY);
    const s = printed('drill-broken-v2', DRILL);
    expect(s).toEqual({ state: asSaved(a.useDrillStore), version: 3 });
    expect(s.state.items.f1.history).toHaveLength(5);
  });

  for (const [name, raw] of [
    ['v3 a string', '{"state":"oops","version":3}'],
    ['v2 a string', '{"state":"oops","version":2}'],
    ['v3 items a string', '{"state":{"items":"oops"},"version":3}'],
    ['v1 null', '{"state":null,"version":1}'],
  ] as const) {
    it(`Drill, ${name}, by a storage event alone: this tab keeps its facts`, async () => {
      const t = await drillTab();
      t.useDrillStore.getState().startSession([fact('f1')], NOW);
      t.useDrillStore.getState().recordAnswer(fact('f1'), true, 800, NOW + 100);
      localStorage.setItem(DRILL, raw);
      deliver(DRILL);
      expect(Object.keys(t.useDrillStore.getState().items)).toEqual(['f1']);
      t.useDrillStore.getState().recordAnswer(fact('f1'), false, 800, NOW + 200);
      expect(saved(DRILL).state.items.f1.history).toHaveLength(2);
    });
  }

  for (const [name, raw] of [
    ['v1 overrides a string', '{"state":{"overrides":"oops"},"version":1}'],
    ['v0 a string', '{"state":"oops","version":0}'],
    ['v1 a string', '{"state":"oops","version":1}'],
  ] as const) {
    it(`fingerings, ${name}: by a storage event, memory keeps its fingers; a new finger writes memory whole`, async () => {
      const t = await fingeringTab();
      t.useFingeringStore.getState().setOverride('major|standard|p2|0|1', 2);
      localStorage.setItem(FINGERING, raw);
      deliver(FINGERING);
      expect(t.useFingeringStore.getState().overrides).toEqual({ 'major|standard|p2|0|1': 2 });
      t.useFingeringStore.getState().setOverride('major|standard|p2|1|0', 3);
      expect(printed(`fingering-broken ${name}`, FINGERING)).toEqual({ state: { overrides: { 'major|standard|p2|0|1': 2, 'major|standard|p2|1|0': 3 }, labelMode: 'finger' }, version: 1 });
    });
  }
});

describe('finding 3: a merged settings save is always one the store reads back unchanged', () => {
  const withProgression = (p: unknown) => JSON.stringify({ ...settingsV6, state: { ...settingsV6.state, progression: p } });

  it('A clears the progression\'s chords; B (stale) changes only its tempo: the progression stays removed; the export calls nothing damaged', async () => {
    localStorage.setItem(SETTINGS, withProgression({ chords: ['C', 'G'], bpm: 70, beats: 2 }));
    const a = await settingsTab();
    const b = await settingsTab();
    a.useAppStore.getState().setProgression({ chords: [], bpm: 70, beats: 2 });
    b.useAppStore.getState().setProgression({ chords: ['C', 'G'], bpm: 120, beats: 2 });
    const s = printed('settings-cleared-then-tempo', SETTINGS).state;
    expect(s).not.toHaveProperty('progression');
    const { invalidAppStateFields } = await import('../store');
    expect(invalidAppStateFields(s)).toEqual([]);
    const { buildCheckedBackup } = await import('../../utils/backupHelpers');
    const r = await buildCheckedBackup(localStorage);
    expect({ missing: r.missing, partly: r.partly, newer: r.newer }).toEqual({ missing: [], partly: [], newer: [] });
  });

  it('B adds chords to the progression A cleared: B\'s chords, on what the clear left (the defaults), never the old tempo and beats', async () => {
    localStorage.setItem(SETTINGS, withProgression({ chords: ['C', 'G'], bpm: 70, beats: 2 }));
    const a = await settingsTab();
    const b = await settingsTab();
    a.useAppStore.getState().setProgression({ chords: [], bpm: 70, beats: 2 });
    b.useAppStore.getState().setProgression({ chords: ['C', 'G', 'Am'], bpm: 70, beats: 2 });
    expect(printed('settings-cleared-then-chords', SETTINGS).state.progression).toEqual({ chords: ['C', 'G', 'Am'], bpm: 90, beats: 4 });
  });

  it('neither tab had a metronome; A sets 100 / 3; B (stale) sets the tempo to 120: 120 / 3 — B\'s beats were the default it started from, not a change', async () => {
    localStorage.setItem(SETTINGS, JSON.stringify(settingsV6));
    const a = await settingsTab();
    const b = await settingsTab();
    a.useAppStore.getState().setMetronome({ bpm: 100, beats: 3 });
    b.useAppStore.getState().setMetronome({ bpm: 120, beats: 4 });
    expect(printed('settings-metronome-defaults', SETTINGS).state.metronome).toEqual({ bpm: 120, beats: 3 });
  });

  it('a field another tab saved broken (hand-edited) is not written back broken: the store\'s own guard decides what is kept', async () => {
    localStorage.setItem(SETTINGS, JSON.stringify(settingsV6));
    const b = await settingsTab();
    localStorage.setItem(SETTINGS, JSON.stringify({ ...settingsV6, state: { ...settingsV6.state, colorMode: 5, language: 'es' } }));
    b.useAppStore.getState().setThemeMode('fermata-night');
    const s = printed('settings-guarded', SETTINGS).state;
    expect(s).toMatchObject({ language: 'es', themeMode: 'fermata-night' });
    expect(s).not.toHaveProperty('colorMode');
  });
});

describe('finding 8: a record the store could not have written; the hydration race', () => {
  it('"passed" marked in a tab after a reset elsewhere: no result with no attempt in it (the store never writes one)', async () => {
    localStorage.setItem(PROGRESS, JSON.stringify({ state: { progress: { completedModules: ['l1u1m1'], moduleProgress: {}, exerciseResults: { l1u1m1: { scores: { e1: 1 }, totalAttempts: 3, lastAttemptAt: 50, passed: false } }, reviewSchedules: { l1u1m1: SCHEDULE } } }, version: 4 }));
    const b = await progressTab();
    localStorage.removeItem(PROGRESS);
    b.useProgressStore.getState().markExercisesPassed('l1u1m1');
    expect(printed('progress-passed-after-reset', PROGRESS).state.progress).toEqual({ completedModules: [], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} });
  });

  it('another tab writes a newer save between this tab\'s read of an older one and its migrated write: the migration is not counted as this tab\'s change, the other tab\'s save stands, memory follows it', async () => {
    const older = JSON.stringify({ state: { ...settingsV6.state, themeMode: 'dark' }, version: 4 });
    const newer = JSON.stringify({ state: { ...settingsV6.state, themeMode: 'fermata', language: 'es' }, version: 6 });
    localStorage.setItem(SETTINGS, older);
    const real = Storage.prototype.getItem;
    let reads = 0;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, k: string) {
      // The 2nd read is the write's own check, right after hydration migrated the v4 save.
      if (k === SETTINGS && ++reads === 2) Storage.prototype.setItem.call(this, SETTINGS, newer);
      return real.call(this, k);
    });
    const b = await settingsTab();
    expect(reads).toBeGreaterThanOrEqual(2);
    expect(localStorage.getItem(SETTINGS)).toBe(newer);
    // This tab's next change lands on the other tab's save, and the old migration's theme does not.
    b.useAppStore.setState({ capoFret: 3 });
    const s = printed('settings-hydration-race', SETTINGS).state;
    expect(s).toMatchObject({ themeMode: 'fermata', language: 'es', capoFret: 3 });
  });

  it('the same race in Learn progress: the other tab\'s newer save stands, and this tab shows it once following has loaded', async () => {
    const v3 = JSON.stringify({ state: { progress: { completedModules: ['l1u1m1'], moduleProgress: { l1u1m1: ['a'] } } }, version: 3 });
    const v4 = JSON.stringify({ state: { progress: { completedModules: ['l1u1m1', 'l1u1m2'], moduleProgress: { l1u1m1: ['a'], l1u1m2: ['b'] } } }, version: 4 });
    localStorage.setItem(PROGRESS, v3);
    const real = Storage.prototype.getItem;
    let reads = 0;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, k: string) {
      if (k === PROGRESS && ++reads === 2) Storage.prototype.setItem.call(this, PROGRESS, v4);
      return real.call(this, k);
    });
    const b = await progressTab();
    expect(localStorage.getItem(PROGRESS)).toBe(v4);
    expect(b.useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1', 'l1u1m2']);
    b.useProgressStore.getState().toggleTask('l1u1m3', 'c');
    expect(saved(PROGRESS).state.progress.moduleProgress).toEqual({ l1u1m1: ['a'], l1u1m2: ['b'], l1u1m3: ['c'] });
  });
});
