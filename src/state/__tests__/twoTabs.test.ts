/**
 * Two tabs, one browser, every saved store (audit A1, 2026-11-18).
 *
 * Each "tab" here is a fresh copy of the store's module (`vi.resetModules`):
 * its own memory, its own state/tabSafe.ts, the one localStorage they share,
 * as two tabs share it. A storage event is delivered by hand (`deliver`), or
 * deliberately NOT (a tab frozen in the background, or one that missed the
 * event, wakes with old memory and writes): either way no tab's write may
 * erase another's, and nothing may come back from the dead after a reset, an
 * import or a migration in another tab.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import settingsV6 from './fixtures/settings-v6-before-start.json';

const PROGRESS = 'music-theory-progress';
const DRILL = 'fermata-drill-v1';
const FINGERING = 'fermata-fingering-v1';
const SETTINGS = 'music-theory-app';
const SESSION = 'fermata-learn-session-v1';

type Safe = typeof import('../tabSafe');
const opened: { safe: Safe; key: string }[] = [];

/** A new tab: the module loaded again from scratch, reading what the browser holds now. */
async function openTab<M>(key: string, load: () => Promise<M>): Promise<M> {
  vi.resetModules();
  const mod = await load();
  const safe = await import('../tabSafe');
  opened.push({ safe, key });
  return mod;
}
/** The browser tells the other tabs that `key` changed (the writer's own tab never hears it). */
const deliver = (key: string) => window.dispatchEvent(new StorageEvent('storage', { key }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the saved JSON is read freely in assertions
type Json = any;
const saved = (key: string) => JSON.parse(localStorage.getItem(key)!) as { state: Record<string, Json>; version: number };

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  for (const { safe, key } of opened.splice(0)) safe.tabLine(key)?.stop?.();
  localStorage.clear();
  localStorage.setItem(SETTINGS, JSON.stringify({ state: {}, version: 6 }));
});

const progressTab = () => openTab(PROGRESS, () => import('../progressStore'));

describe('music-theory-progress (Learn)', () => {
  it('the audit\'s case without any storage event (a frozen tab): a task ticked in each tab — both saved', async () => {
    const a = await progressTab();
    const b = await progressTab();
    a.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t1');
    b.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t2');
    expect(saved(PROGRESS).state.progress.moduleProgress.l1u34m1).toEqual(['l1u34m1t1', 'l1u34m1t2']);
    // B's memory follows what it saved (both ticks), without a reload.
    expect(b.useProgressStore.getState().progress.moduleProgress.l1u34m1).toEqual(['l1u34m1t1', 'l1u34m1t2']);
    // A hears of it and shows it too.
    deliver(PROGRESS);
    expect(a.useProgressStore.getState().progress.moduleProgress.l1u34m1).toEqual(['l1u34m1t1', 'l1u34m1t2']);
    // A reload of either tab reads both.
    const c = await progressTab();
    expect(c.useProgressStore.getState().progress.moduleProgress.l1u34m1).toEqual(['l1u34m1t1', 'l1u34m1t2']);
  });

  it('with the event: the other tab shows the tick at once; unticking in one tab unticks only that task', async () => {
    const a = await progressTab();
    const b = await progressTab();
    a.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t1');
    deliver(PROGRESS);
    expect(b.useProgressStore.getState().progress.moduleProgress.l1u34m1).toEqual(['l1u34m1t1']);
    b.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t2');
    a.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t1'); // A unticks its own (A never heard of t2)
    expect(saved(PROGRESS).state.progress.moduleProgress.l1u34m1).toEqual(['l1u34m1t2']);
  });

  it('a check answered in both tabs: every score kept, the attempts add up, "passed" stays passed, completions from both', async () => {
    const a = await progressTab();
    const b = await progressTab();
    a.useProgressStore.getState().recordExerciseResult('l1u1m1', 'l1u1m1e1', 1);
    a.useProgressStore.getState().markExercisesPassed('l1u1m1');
    a.useProgressStore.getState().completeModule('l1u1m1');
    b.useProgressStore.getState().recordExerciseResult('l1u1m1', 'l1u1m1e2', 0.5);
    b.useProgressStore.getState().completeModule('l1u1m2');
    const p = saved(PROGRESS).state.progress;
    expect(p.exerciseResults.l1u1m1.scores).toEqual({ l1u1m1e1: 1, l1u1m1e2: 0.5 });
    expect(p.exerciseResults.l1u1m1.totalAttempts).toBe(2);
    expect(p.exerciseResults.l1u1m1.passed).toBe(true);
    expect(p.completedModules).toEqual(['l1u1m1', 'l1u1m2']);
    expect(Object.keys(p.reviewSchedules).sort()).toEqual(['l1u1m1', 'l1u1m2']);
  });

  it('a tab that changed nothing never writes, even when its memory is old', async () => {
    const a = await progressTab();
    const b = await progressTab();
    a.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t1');
    const before = localStorage.getItem(PROGRESS);
    b.useProgressStore.setState({}); // any set() of the store writes its save
    expect(localStorage.getItem(PROGRESS)).toBe(before);
  });

  it('Reset app data in one tab: the other tab\'s old progress never comes back — only its next tick lands, on empty progress', async () => {
    localStorage.setItem(PROGRESS, JSON.stringify({ state: { progress: { completedModules: ['l1u1m1', 'l1u1m2'], moduleProgress: { l1u1m3: ['t1'] } } }, version: 4 }));
    const b = await progressTab();
    expect(b.useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1', 'l1u1m2']);
    localStorage.removeItem(PROGRESS); // the other tab's "Reset app data"
    b.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t1'); // before B heard of it
    const p = saved(PROGRESS).state.progress;
    expect(p.completedModules).toEqual([]);
    expect(p.moduleProgress).toEqual({ l1u34m1: ['l1u34m1t1'] });
    // And a tab that hears of the reset shows it.
    const c = await progressTab();
    localStorage.removeItem(PROGRESS);
    deliver(PROGRESS);
    expect(c.useProgressStore.getState().progress.completedModules).toEqual([]);
  });

  it('a backup imported in one tab: the other tab\'s old progress never comes back; it shows the import', async () => {
    localStorage.setItem(PROGRESS, JSON.stringify({ state: { progress: { completedModules: ['old-a', 'old-b'], moduleProgress: {} } }, version: 4 }));
    const b = await progressTab();
    // The other tab imports a file (applyBackup writes the key) and reloads.
    localStorage.setItem(PROGRESS, JSON.stringify({ state: { progress: { completedModules: ['imported'], moduleProgress: {} } }, version: 4 }));
    b.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t1'); // B never heard of it
    expect(saved(PROGRESS).state.progress.completedModules).toEqual(['imported']);
    expect(saved(PROGRESS).state.progress.moduleProgress).toEqual({ l1u34m1: ['l1u34m1t1'] });
    expect(b.useProgressStore.getState().progress.completedModules).toEqual(['imported']);
  });

  it('an older tab wrote an older version: this tab migrates it with the store\'s own migration before adding its change (a retired score stays retired)', async () => {
    const b = await progressTab();
    // A tab on the release before (progress v3) records a score on an id v4 retired, and a tick.
    localStorage.setItem(PROGRESS, JSON.stringify({ state: { progress: { completedModules: ['l1u1m1'], moduleProgress: { l1u1m1: ['t9'] },
      exerciseResults: { l4u13m1: { scores: { l4u13m1g3: 1, l4u13m1e1: 1 }, totalAttempts: 2, lastAttemptAt: 5, passed: false } } } }, version: 3 }));
    b.useProgressStore.getState().toggleTask('l1u34m1', 'l1u34m1t1');
    const s = saved(PROGRESS);
    expect(s.version).toBe(4);
    expect(s.state.progress.exerciseResults.l4u13m1.scores).toEqual({ l4u13m1e1: 1 });
    expect(s.state.progress.completedModules).toEqual(['l1u1m1']);
    expect(s.state.progress.moduleProgress).toEqual({ l1u1m1: ['t9'], l1u34m1: ['l1u34m1t1'] });
  });

  it('a newer Fermatina migrated the save in another tab: this older tab never writes over it, and does not read it', async () => {
    const b = await progressTab();
    b.useProgressStore.getState().toggleTask('l1u1m1', 't1');
    const newer = JSON.stringify({ state: { progress: { completedModules: ['from-the-future'], moduleProgress: {}, newField: { x: 1 } } }, version: 99 });
    localStorage.setItem(PROGRESS, newer);
    deliver(PROGRESS);
    expect(b.useProgressStore.getState().progress.completedModules).toEqual([]);
    b.useProgressStore.getState().toggleTask('l1u1m1', 't2');
    b.useProgressStore.getState().completeModule('l1u1m1');
    expect(localStorage.getItem(PROGRESS)).toBe(newer);
  });

  it('one tab alone writes exactly what it wrote before this fix (createJSONStorage\'s bytes)', async () => {
    const a = await progressTab();
    a.useProgressStore.getState().toggleTask('l1u1m1', 't1');
    a.useProgressStore.getState().recordExerciseResult('l1u1m1', 'l1u1m1e1', 1);
    const { progress } = a.useProgressStore.getState();
    expect(localStorage.getItem(PROGRESS)).toBe(JSON.stringify({ state: { progress }, version: 4 }));
  });
});

const drillTab = () => openTab(DRILL, () => import('../drillStore'));
const item = (id: string) => ({
  id, family: 'interval' as const, promptKey: 'p', promptParams: {}, input: { format: 'choice' as const, choices: ['A', 'B'] },
  answer: { kind: 'choice' as const, correct: 'A' }, whyKey: 'w', whyParams: {}, rank: 0,
});

describe('fermata-drill-v1 (spaced repetition): two tabs answering lose no review', () => {
  it('different facts in each tab, no event: every fact\'s schedule and answer kept, the lifetime counts both', async () => {
    const a = await drillTab();
    const b = await drillTab();
    a.useDrillStore.getState().startSession([item('i1'), item('i2')], 1_000_000);
    b.useDrillStore.getState().startSession([item('i3'), item('i4')], 2_000_000);
    a.useDrillStore.getState().recordAnswer(item('i1'), true, 900, 1_000_100);
    b.useDrillStore.getState().recordAnswer(item('i3'), false, 1200, 2_000_100);
    a.useDrillStore.getState().recordAnswer(item('i2'), true, 800, 1_000_200);
    const s = saved(DRILL).state;
    expect(Object.keys(s.items).sort()).toEqual(['i1', 'i2', 'i3']);
    expect(s.lifetime).toEqual({ answered: 3, correct: 2 });
    for (const id of ['i1', 'i2', 'i3']) expect(s.items[id].history).toHaveLength(1);
  });

  it('the SAME fact answered in both tabs: both answers stay in its history, in time order; the card is the later one\'s', async () => {
    const a = await drillTab();
    const b = await drillTab();
    a.useDrillStore.getState().startSession([item('i1')], 1_000_000);
    b.useDrillStore.getState().startSession([item('i1')], 1_000_050);
    b.useDrillStore.getState().recordAnswer(item('i1'), true, 700, 1_000_300);
    a.useDrillStore.getState().recordAnswer(item('i1'), false, 900, 1_000_100);
    const it1 = saved(DRILL).state.items.i1;
    expect(it1.history.map((r: { ts: number; correct: boolean }) => [r.ts, r.correct])).toEqual([[1_000_100, false], [1_000_300, true]]);
    expect(it1.card).toEqual(b.useDrillStore.getState().items.i1.card);
  });

  it('with the event: the other tab\'s answers show here, but this tab\'s session under way stays its own (drillWork reads it)', async () => {
    const a = await drillTab();
    const b = await drillTab();
    a.useDrillStore.getState().startSession([item('i1'), item('i2')], 1_000_000);
    b.useDrillStore.getState().startSession([item('i3'), item('i4')], 2_000_000);
    const bSession = b.useDrillStore.getState().activeSession;
    a.useDrillStore.getState().recordAnswer(item('i1'), true, 900, 1_000_100);
    deliver(DRILL);
    expect(Object.keys(b.useDrillStore.getState().items)).toEqual(['i1']);
    expect(b.useDrillStore.getState().activeSession).toBe(bSession);
    // B answers in its own session; A's session (the last one A saved) is not B's to change, B's is saved as B's.
    b.useDrillStore.getState().recordAnswer(item('i3'), true, 900, 2_000_100);
    expect(saved(DRILL).state.activeSession.id).toBe(bSession!.id);
    expect(Object.keys(saved(DRILL).state.items).sort()).toEqual(['i1', 'i3']);
    expect(a.useDrillStore.getState().activeSession!.id).toBe('s1000000');
  });

  it('Reset app data elsewhere, then an answer here: the old reviews never come back', async () => {
    const a = await drillTab();
    a.useDrillStore.getState().startSession([item('i1'), item('i2')], 1_000_000);
    a.useDrillStore.getState().recordAnswer(item('i1'), true, 900, 1_000_100);
    localStorage.removeItem(DRILL);
    a.useDrillStore.getState().recordAnswer(item('i2'), true, 900, 1_000_200);
    const s = saved(DRILL).state;
    expect(Object.keys(s.items)).toEqual(['i2']);
    expect(s.lifetime).toEqual({ answered: 1, correct: 1 });
  });

  it('Sprint bests: the higher of the two tabs\'; settings: each tab\'s own change', async () => {
    const a = await drillTab();
    const b = await drillTab();
    a.useDrillStore.getState().recordSprint('k', 12);
    b.useDrillStore.getState().recordSprint('k', 9);
    b.useDrillStore.getState().updateSettings({ sound: false });
    a.useDrillStore.getState().updateSettings({ length: 12 });
    const s = saved(DRILL).state;
    expect(s.sprintBests).toEqual({ k: 12 });
    expect(s.settings.sound).toBe(false);
    expect(s.settings.length).toBe(12);
  });
});

const fingeringTab = () => openTab(FINGERING, () => import('../fingeringStore'));

describe('fermata-fingering-v1', () => {
  it('a finger set in each tab: both kept; the label mode is the latest tab\'s; the other tab shows them', async () => {
    const a = await fingeringTab();
    const b = await fingeringTab();
    a.useFingeringStore.getState().setOverride('major|standard|p2|0|1', 2);
    b.useFingeringStore.getState().setOverride('major|standard|p2|1|0', 1);
    b.useFingeringStore.getState().setLabelMode('note');
    expect(saved(FINGERING).state).toEqual({ overrides: { 'major|standard|p2|0|1': 2, 'major|standard|p2|1|0': 1 }, labelMode: 'note' });
    deliver(FINGERING);
    expect(a.useFingeringStore.getState().overrides).toEqual({ 'major|standard|p2|0|1': 2, 'major|standard|p2|1|0': 1 });
    expect(a.useFingeringStore.getState().labelMode).toBe('note');
  });
});

const settingsTab = () => openTab(SETTINGS, () => import('../store'));

describe('music-theory-app (settings, with the optional fields)', () => {
  it('each tab changes its own settings: none erased (capo, metronome, progression, MIDI, neck, theme)', async () => {
    localStorage.setItem(SETTINGS, JSON.stringify(settingsV6));
    const a = await settingsTab();
    const b = await settingsTab();
    a.useAppStore.setState({ capoFret: 3, metronome: { bpm: 96, beats: 3 }, progression: { chords: ['G', 'C', 'D'], bpm: 90, beats: 4 } });
    a.useAppStore.getState().setNeckNutSide('left');
    b.useAppStore.getState().setThemeMode('fermata-night');
    b.useAppStore.setState({ midiKeyboard: true });
    const s = saved(SETTINGS).state;
    expect(s).toMatchObject({ capoFret: 3, metronome: { bpm: 96, beats: 3 }, progression: { chords: ['G', 'C', 'D'], bpm: 90, beats: 4 }, neckNutSide: 'left', themeMode: 'fermata-night', midiKeyboard: true });
    // Every field neither tab touched is the save's, unchanged.
    for (const [k, v] of Object.entries(settingsV6.state)) if (!['themeMode', 'preferencesUpdatedAt'].includes(k)) expect(s[k], k).toEqual(v);
    // B's screen keeps what it shows (settings do not follow other tabs): its capo is still none.
    expect(b.useAppStore.getState().capoFret).toBe(0);
    // ... and B's next change still leaves A's capo saved.
    b.useAppStore.getState().setLanguage('pt');
    expect(saved(SETTINGS).state).toMatchObject({ capoFret: 3, language: 'pt', themeMode: 'fermata-night' });
  });

  it('a tab that changes only what is not saved (a key pressed, a note lit) writes nothing over the other tab\'s settings', async () => {
    localStorage.setItem(SETTINGS, JSON.stringify(settingsV6));
    const a = await settingsTab();
    const b = await settingsTab();
    a.useAppStore.setState({ capoFret: 5 });
    const before = localStorage.getItem(SETTINGS);
    b.useAppStore.setState({ activeNotes: new Set([60]), detailPanelOpen: true });
    expect(localStorage.getItem(SETTINGS)).toBe(before);
  });

  it('Reset app data elsewhere: the old settings are not written back; only this tab\'s next change, on the defaults', async () => {
    localStorage.setItem(SETTINGS, JSON.stringify({ ...settingsV6, state: { ...settingsV6.state, themeMode: 'fermata-night', capoFret: 4 } }));
    const b = await settingsTab();
    localStorage.removeItem(SETTINGS);
    b.useAppStore.getState().setLanguage('es');
    const s = saved(SETTINGS).state;
    expect(s.language).toBe('es');
    expect(s.capoFret).toBeUndefined();
    expect(s.themeMode).toBe(b.useAppStore.getInitialState().themeMode);
  });

  it('a newer version\'s settings save is never written over', async () => {
    const b = await settingsTab();
    const newer = JSON.stringify({ state: { ...settingsV6.state, somethingNew: true }, version: 7 });
    localStorage.setItem(SETTINGS, newer);
    b.useAppStore.getState().setThemeMode('fermata-night');
    expect(localStorage.getItem(SETTINGS)).toBe(newer);
  });
});

const sessionTab = () => openTab(SESSION, () => import('../learnSessionStore'));
const screen = (moduleId: string, unitId: string) => ({ type: 'module' as const, levelId: 'l1', unitId, moduleId, section: null, at: Date.now() });

describe('fermata-learn-session-v1 (the open lesson and a check in progress)', () => {
  it('a check in progress in one tab survives another tab opening another lesson; the checking tab\'s next answer saves its place again', async () => {
    const a = await sessionTab();
    const b = await sessionTab();
    const check = { moduleId: 'l1u1m1', kind: 'check' as const, lang: 'en', fingerprints: {}, run: { order: [], index: 0, scores: [], items: [], attempt: 1 as const, selectedNotes: [], tried: [], missed: null, final: null }, finished: false, at: Date.now() };
    a.useLearnSessionStore.getState().setScreen(screen('l1u1m1', 'l1u1'));
    a.useLearnSessionStore.getState().setCheck(check);
    b.useLearnSessionStore.getState().setScreen(screen('l1u34m1', 'l1u34'));
    expect(saved(SESSION).state.check).toEqual(check);
    expect(saved(SESSION).state.screen.moduleId).toBe('l1u34m1');
    a.useLearnSessionStore.getState().setCheck({ ...check, at: check.at + 1 });
    expect(saved(SESSION).state.screen.moduleId).toBe('l1u1m1');
    expect(saved(SESSION).state.check.at).toBe(check.at + 1);
  });

  it('Reset app data elsewhere: the other tab\'s old check is not written back', async () => {
    const a = await sessionTab();
    a.useLearnSessionStore.getState().setCheck({ moduleId: 'l1u1m1', kind: 'check', lang: 'en', fingerprints: {}, run: { order: [], index: 0, scores: [], items: [], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null }, finished: false, at: Date.now() });
    localStorage.removeItem(SESSION);
    a.useLearnSessionStore.getState().setScreen(screen('l1u34m1', 'l1u34'));
    expect(saved(SESSION).state.check).toBeNull();
    expect(saved(SESSION).state.screen.moduleId).toBe('l1u34m1');
  });
});
