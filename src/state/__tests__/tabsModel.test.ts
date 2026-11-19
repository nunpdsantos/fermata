/**
 * Several tabs at random, against a reference (second review of the A1 fix,
 * 2026-11-19; the reviewer's model, kept). Each seed opens 3 tabs of the app
 * (all five saved stores, each tab its own copy of every module) and runs
 * random actions in them: ticks, scores (an exercise answered again too),
 * "passed", completions, un-completions, reviews, Drill answers, Sprint bests,
 * Drill settings, fingers, "Reset to suggested", label mode, capo, theme,
 * language, metronome, progression; "Reset app data" and a backup import in
 * one tab (that tab reloads); Drill's own "Reset progress" in place; reloads.
 * Each write tells the other tabs (a `storage` event) — delivered late, in any
 * order, or never (one in five is dropped: a frozen tab).
 *
 * After EVERY step the saves are checked against what one learner's actions,
 * in time order, would have saved (state/tabMerge.ts, the rule): nothing lost,
 * nothing removed coming back, every Drill fact equal to its answers since its
 * last removal replayed through the scheduler, every review schedule equal to
 * its reviews replayed through the store's own step, the counters, the bests, the
 * fingers, every settings value a tab changed, and every save one its store's
 * guard reads back unchanged. At the end every event is delivered and every
 * following tab must show the save; the export must call nothing damaged.
 *
 * The reference counts an action only for what it changed in its own tab's
 * memory (a tab cannot know what it never heard of: re-setting the value a
 * stale tab already shows is no change), and a metronome or progression a tab
 * did not have as its defaults; a progression with no chords is none.
 *
 * Fast by default (CI: 12 seeds × 120 steps × 3 tabs). THE LONG RUN, last
 * clean on 19 November 2026 (second audit round) on seeds 1–6000 at 200 steps
 * × 4 tabs and on seeds 1–1000 at 200 steps × 3 and × 5 tabs:
 *   TABS_MODEL_FIRST=1 TABS_MODEL_SEEDS=6000 TABS_MODEL_STEPS=200 TABS_MODEL_TABS=4 \
 *     npx vitest run src/state/__tests__/tabsModel.test.ts --maxWorkers=1
 *   (then TABS_MODEL_SEEDS=1000 with TABS_MODEL_TABS=3, and with 5.)
 * 300 seeds was not enough: release 16 passed seeds 1–300 and failed 2213 and
 * 2215, and with the round's three Drill actions the same fault failed seed
 * 228 — a mark written into a rule's empty form (twoTabsMarks.test.ts): 14
 * of seeds 1–6000 failed at 4 tabs, about one in 430. A new action shifts
 * every seed's sequence: run the long run again after adding one.
 */
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_METRONOME } from '../metronomeSave';
import { EMPTY_PROGRESSION } from '../progressionSave';

const KEYS = { progress: 'music-theory-progress', drill: 'fermata-drill-v1', app: 'music-theory-app', fing: 'fermata-fingering-v1', sess: 'fermata-learn-session-v1' } as const;
const SEEDS = Number(process.env.TABS_MODEL_SEEDS ?? 12);
const STEPS = Number(process.env.TABS_MODEL_STEPS ?? 120);
const NTABS = Number(process.env.TABS_MODEL_TABS ?? 3);
const FIRST = Number(process.env.TABS_MODEL_FIRST ?? 1);

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function loadTab() {
  vi.resetModules();
  const progress = await import('../progressStore');
  const drill = await import('../drillStore');
  const app = await import('../store');
  const fing = await import('../fingeringStore');
  const sess = await import('../learnSessionStore');
  const safe = await import('../tabSafe');
  const sched = await import('../../services/drillScheduler');
  const sr = await import('../../services/spacedRepetition');
  await import('../tabSync');
  await new Promise((resolve) => setTimeout(resolve, 0));
  return { progress, drill, app, fing, sess, safe, sched, sr, sessions: 0 };
}
type Tab = Awaited<ReturnType<typeof loadTab>>;
type ItemState = import('../../core/types/drill').ItemSrsState;
type Schedule = import('../../core/types/exercise').ModuleReviewSchedule;
type Answer = { correct: boolean; ms: number; ts: number; sid: string };

const stop = (tab: Tab) => { for (const k of Object.values(KEYS)) tab.safe.tabLine(k)?.stop?.(); };
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the saves are read freely
const sv = (k: string): any => { const r = localStorage.getItem(k); return r === null ? null : JSON.parse(r); };
const J = (v: unknown) => JSON.stringify(v);
/** The same values, whatever the key order (the Drill guard rebuilds a session's tally in its own order). */
const canon = (v: unknown): string => JSON.stringify(v, (_k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x));
const flat = (v: unknown, p = '', out: Record<string, unknown> = {}) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    for (const [k, x] of Object.entries(v)) flat(x, p ? `${p}.${k}` : k, out);
  } else out[p] = v;
  return out;
};
/** The settings values the model follows, as a tab saves them: a metronome or progression it does not save counts as its defaults. */
const leavesOf = (s: Record<string, unknown>) => flat({
  capoFret: s.capoFret, themeMode: s.themeMode, language: s.language,
  metronome: s.metronome ?? DEFAULT_METRONOME, progression: s.progression ?? EMPTY_PROGRESSION,
});

const MODS = ['l1u1m1', 'l1u1m2', 'l1u1m3'];
const FACTS = ['f1', 'f2', 'f3', 'f4'];
const FSK = ['major|standard|p2|0|1', 'major|standard|p2|1|0', 'major|standard|p3|2|1', 'dorian|standard|p2|0|1'];
const item = (id: string) => ({
  id, family: 'interval' as const, promptKey: 'p', promptParams: {}, input: { format: 'choice' as const, choices: ['A', 'B'] },
  answer: { kind: 'choice' as const, correct: 'A' }, whyKey: 'w', whyParams: {}, rank: 0,
});
const SCHED = { completedAt: 1, nextReviewAt: 2, intervalLevel: 1, reviewCount: 1, lastReviewedAt: 1 };
const KINDS = ['tick', 'tick', 'untick', 'rec', 'rec', 'pass', 'comp', 'uncomp', 'review', 'review', 'ans', 'ans', 'ans', 'sprint', 'dset', 'dread', 'dread', 'dfollow', 'dchip', 'fing', 'fing', 'fclear', 'flabel', 'capo', 'theme', 'lang', 'metro', 'prog', 'reset', 'import', 'drillreset'] as const;

type Divergences = Record<string, { seed: number; step: number; detail: string }[]>;

async function runSeed(seed: number, V: Divergences) {
  localStorage.clear();
  const R = rng(seed);
  const pick = <T,>(a: readonly T[]): T => a[Math.floor(R() * a.length)];
  let step = 0;
  const viol = (cat: string, detail: string) => { (V[cat] ??= []).push({ seed, step, detail }); };
  let clock = 1_800_000_000_000;
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(clock);
  const tick = () => { clock += Math.floor(R() * 6 * 3600_000) + 1000; vi.setSystemTime(clock); };
  let uid = 0;

  // ── The reference: what one learner's actions, in time order, saved ──
  const fresh = () => ({
    ticks: new Set<string>(), done: {} as Record<string, boolean>, attempts: {} as Record<string, number>,
    scores: {} as Record<string, Record<string, number>>, passed: {} as Record<string, boolean>,
    drillAns: {} as Record<string, Answer[]>, drillBase: {} as Record<string, ItemState>,
    lifetime: { answered: 0, correct: 0 }, bests: {} as Record<string, number>,
    fing: {} as Record<string, number>, labelMode: undefined as string | undefined, sched: {} as Record<string, Schedule>,
    leaves: {} as Record<string, unknown>, touched: new Set<string>(),
    // Drill's two values a first session records where no choice was made (review of bd14071):
    // guitar reading and "Follow my lessons" — undefined = none saved; and one ordinary topic chip.
    read: undefined as boolean | undefined, follow: undefined as boolean | undefined, triad: true,
  });
  let M = fresh();
  const dead = { ticks: new Set<string>(), exs: new Set<string>(), answers: new Set<number>() };
  const killDrill = () => { for (const l of Object.values(M.drillAns)) for (const a of l) dead.answers.add(a.ms); for (const b of Object.values(M.drillBase)) for (const r of b.history) dead.answers.add(r.ms); };
  const killAll = () => {
    for (const t of M.ticks) dead.ticks.add(t);
    for (const m of Object.keys(M.scores)) for (const e of Object.keys(M.scores[m])) dead.exs.add(`${m}:${e}`);
    killDrill();
  };

  const tabs: Tab[] = [];
  const events: { t: Tab; key: string }[] = [];
  for (let i = 0; i < NTABS; i++) tabs.push(await loadTab());
  const emit = (from: Tab, key: string) => { for (const t of tabs) if (t !== from) events.push({ t, key }); };
  const deliver = (e: { t: Tab; key: string }) => { e.t.safe.tabLine(e.key)?.adopt?.(); };
  const restart = async (i: number) => { stop(tabs[i]); tabs[i] = await loadTab(); };
  const progOf = (t: Tab) => t.progress.useProgressStore.getState().progress;
  const drillOf = (t: Tab) => t.drill.useDrillStore.getState();
  /**
   * A session starts as the view starts it, passing the values in force as THIS tab derives them (a piano
   * learner with no profile: reading on with history, following off). It records each where this tab's memory
   * has none — counted by the reference only if the reference has none yet either (keepRecorded: a value a
   * first session records never writes over one already saved).
   */
  const startSession = (t: Tab) => {
    const d = drillOf(t);
    if (d.activeSession) return;
    const reading = typeof d.settings.families.read === 'boolean' ? d.settings.families.read : d.introDone;
    const followLessons = d.settings.followLessons ?? false;
    if (d.settings.families.read === undefined && M.read === undefined) M.read = reading;
    if (!d.introDone && d.settings.followLessons === undefined && M.follow === undefined) M.follow = followLessons;
    d.startSession(FACTS.map(item), clock + (t.sessions++) + Math.floor(R() * 1000), { reading, followLessons, unlocked: null });
  };
  const savedLeaves = (t: Tab) => leavesOf(JSON.parse(J(t.app.useAppStore.persist.getOptions().partialize!(t.app.useAppStore.getState()))));
  const replay = (f: string) => {
    let st: ItemState | undefined = M.drillBase[f];
    for (const a of M.drillAns[f] ?? []) st = tabs[0].sched.applyAnswer(st, a.correct, a.ms, a.ts, a.sid);
    return st;
  };

  const checkAll = (label: string) => {
    // Learn progress
    const ps = sv(KEYS.progress);
    const p = ps?.state?.progress ?? { completedModules: [], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} };
    if (ps && !tabs[0].progress.isValidPersistedProgress(ps.state)) viol('progress-invalid-save', label);
    const ticks = new Set<string>();
    for (const [m, ids] of Object.entries(p.moduleProgress ?? {})) for (const id of ids as string[]) ticks.add(`${m}:${id}`);
    for (const x of ticks) if (dead.ticks.has(x)) viol('progress-dead-tick-back', `${label} ${x}`);
    for (const x of M.ticks) if (!ticks.has(x)) viol('progress-lost-tick', `${label} ${x}`);
    for (const x of ticks) if (!M.ticks.has(x) && !dead.ticks.has(x)) viol('progress-unexpected-tick', `${label} ${x}`);
    const comp = new Set(p.completedModules ?? []);
    for (const m of MODS) if ((M.done[m] === true) !== comp.has(m)) viol('progress-completion', `${label} ${m} want ${M.done[m] === true}`);
    for (const m of Object.keys(p.reviewSchedules ?? {})) if (!comp.has(m)) viol('progress-orphan-schedule', `${label} ${m}`);
    if (J(Object.entries(p.reviewSchedules ?? {}).sort()) !== J(Object.entries(M.sched).sort())) viol('progress-schedules', `${label} want ${J(M.sched)} got ${J(p.reviewSchedules)}`);
    for (const m of MODS) {
      const r = p.exerciseResults?.[m];
      if ((M.attempts[m] ?? 0) !== (r?.totalAttempts ?? 0)) viol('progress-attempts', `${label} ${m} want ${M.attempts[m] ?? 0} got ${r?.totalAttempts}`);
      if (r && !r.totalAttempts) viol('progress-result-without-attempt', `${label} ${m} ${J(r)}`);
      const want = M.scores[m] ?? {};
      const got = r?.scores ?? {};
      for (const e of Object.keys(got)) if (dead.exs.has(`${m}:${e}`)) viol('progress-dead-score-back', `${label} ${m}:${e}`);
      if (J(Object.entries(want).sort()) !== J(Object.entries(got).sort())) viol('progress-scores', `${label} ${m} want ${J(want)} got ${J(got)}`);
      if ((M.passed[m] === true) !== (r?.passed === true)) viol('progress-passed', `${label} ${m} want ${M.passed[m] === true} got ${r?.passed}`);
    }
    // Drill
    const ds = sv(KEYS.drill)?.state;
    if (ds && canon(tabs[0].drill.validatePersistedShape(ds)) !== canon(ds)) viol('drill-save-not-as-its-guard-reads-it', label);
    const items = ds?.items ?? {};
    for (const f of FACTS) {
      const h: { ms: number; ts: number }[] = items[f]?.history ?? [];
      for (const r of h) if (dead.answers.has(r.ms)) viol('drill-dead-answer-back', `${label} ${f} ${r.ms}`);
      for (let i = 1; i < h.length; i++) if (h[i].ts < h[i - 1].ts) viol('drill-history-order', `${label} ${f}`);
      const want = replay(f);
      if (J(want ?? null) !== J(items[f] ?? null)) viol('drill-fact', `${label} ${f} want ${J(want?.history.map((r) => r.ms))} got ${J(h.map((r) => r.ms))}`);
    }
    const lt = ds?.lifetime ?? { answered: 0, correct: 0 };
    if (J(lt) !== J(M.lifetime)) viol('drill-lifetime', `${label} want ${J(M.lifetime)} got ${J(lt)}`);
    if (lt.correct > lt.answered) viol('drill-correct-above-answered', `${label} ${J(lt)}`);
    if (ds && !ds.introDone && (ds.activeSession || Object.keys(items).length)) viol('drill-intro-not-passed', label);
    if (J(Object.entries(ds?.sprintBests ?? {}).sort()) !== J(Object.entries(M.bests).sort())) viol('drill-bests', `${label} want ${J(M.bests)} got ${J(ds?.sprintBests)}`);
    // The two recorded values and a topic chip (taps exact; recordings never over a saved value).
    if ((ds?.settings?.families?.read) !== M.read) viol('drill-reading', `${label} want ${J(M.read)} got ${J(ds?.settings?.families?.read)}`);
    if ((ds?.settings?.followLessons) !== M.follow) viol('drill-follow', `${label} want ${J(M.follow)} got ${J(ds?.settings?.followLessons)}`);
    if ((ds?.settings?.families?.triad ?? true) !== M.triad) viol('drill-topic-chip', `${label} want ${M.triad} got ${J(ds?.settings?.families?.triad)}`);
    // Fingerings
    const fs = sv(KEYS.fing)?.state;
    if (J(Object.entries(fs?.overrides ?? {}).sort()) !== J(Object.entries(M.fing).sort())) viol('fing-overrides', `${label} want ${J(M.fing)} got ${J(fs?.overrides)}`);
    if ((fs?.labelMode ?? 'finger') !== (M.labelMode ?? 'finger')) viol('fing-label', `${label} want ${M.labelMode} got ${fs?.labelMode}`);
    // Settings
    const as = sv(KEYS.app)?.state ?? {};
    const bad = tabs[0].app.invalidAppStateFields(as);
    if (bad === null || bad.length) viol('settings-not-as-its-guard-reads-it', `${label} ${J(bad)}`);
    const leaves = leavesOf(as);
    for (const k of M.touched) if (J(M.leaves[k]) !== J(leaves[k])) viol('settings-value', `${label} ${k} want ${J(M.leaves[k])} got ${J(leaves[k])}`);
  };

  for (step = 1; step <= STEPS; step++) {
    tick();
    const i = Math.floor(R() * tabs.length);
    const t = tabs[i];
    const roll = R();
    if (roll < 0.22 && events.length) {
      const e = events.splice(Math.floor(R() * events.length), 1)[0];
      if (R() < 0.8) deliver(e); // one in five never arrives
      checkAll(`s${step} event`);
      continue;
    }
    if (roll < 0.25) {
      await restart(i);
      checkAll(`s${step} reload${i}`);
      continue;
    }
    const kind = pick(KINDS);
    const label = `s${step} ${kind}@${i}`;
    if (kind === 'reset' && R() < 0.5) continue;
    if (kind === 'import' && R() < 0.4) continue;
    if (kind === 'drillreset' && R() < 0.5) continue;
    try {
      const prog = t.progress.useProgressStore.getState();
      const mem = progOf(t);
      switch (kind) {
        case 'tick': {
          const m = pick(MODS);
          const id = `k${++uid}`;
          prog.toggleTask(m, id);
          M.ticks.add(`${m}:${id}`);
          emit(t, KEYS.progress);
          break;
        }
        case 'untick': {
          const all: [string, string][] = [];
          for (const [m, ids] of Object.entries(mem.moduleProgress)) for (const id of ids) all.push([m, id]);
          if (!all.length) break;
          const [m, id] = pick(all);
          prog.toggleTask(m, id);
          M.ticks.delete(`${m}:${id}`);
          dead.ticks.add(`${m}:${id}`);
          emit(t, KEYS.progress);
          break;
        }
        case 'rec': {
          const m = pick(MODS);
          // An exercise answered again (one this tab remembers), or a new one.
          const known = Object.keys(mem.exerciseResults?.[m]?.scores ?? {});
          const e = known.length && R() < 0.4 ? pick(known) : `e${++uid}`;
          const sc = pick([0, 0.5, 1] as const);
          prog.recordExerciseResult(m, e, sc);
          (M.scores[m] ??= {})[e] = sc;
          dead.exs.delete(`${m}:${e}`); // answered again after its removal: a new answer, alive
          M.attempts[m] = (M.attempts[m] ?? 0) + 1;
          emit(t, KEYS.progress);
          break;
        }
        case 'pass': {
          const m = pick(MODS);
          const changes = mem.exerciseResults?.[m]?.passed === false;
          prog.markExercisesPassed(m);
          // "Passed" marks a result there is; one removed since (a reset elsewhere) is none.
          if (changes && (M.attempts[m] ?? 0) > 0) M.passed[m] = true;
          if (changes) emit(t, KEYS.progress);
          break;
        }
        case 'comp': {
          const m = pick(MODS);
          const changes = !mem.completedModules.includes(m);
          prog.completeModule(m);
          // A completion of a module already completed (in a tab that never heard of it) changes nothing.
          if (changes) { if (!M.done[m]) M.sched[m] = JSON.parse(J(t.sr.createInitialSchedule(clock))); M.done[m] = true; emit(t, KEYS.progress); }
          break;
        }
        case 'uncomp': {
          const m = pick(MODS);
          // Un-completing is on purpose: the module and its schedule leave the save, whatever this tab remembered.
          prog.uncompleteModule(m);
          M.done[m] = false;
          delete M.sched[m];
          emit(t, KEYS.progress);
          break;
        }
        case 'review': {
          const m = pick(MODS);
          const changes = !!mem.reviewSchedules?.[m];
          const passed = R() < 0.5;
          prog.recordReviewResult(m, passed);
          // A review counts on the schedule there is, through the store's own step.
          if (changes && M.sched[m]) M.sched[m] = JSON.parse(J(t.sr.updateScheduleAfterReview(M.sched[m], passed, clock)));
          if (changes) emit(t, KEYS.progress);
          break;
        }
        case 'ans': {
          const f = pick(FACTS);
          if ((M.drillAns[f] ?? []).length >= 8) break;
          startSession(t);
          const ms = ++uid;
          const correct = R() < 0.6;
          const sid = drillOf(t).activeSession!.id;
          drillOf(t).recordAnswer(item(f), correct, ms, clock);
          (M.drillAns[f] ??= []).push({ correct, ms, ts: clock, sid });
          M.lifetime.answered++;
          if (correct) M.lifetime.correct++;
          emit(t, KEYS.drill);
          break;
        }
        case 'sprint': {
          const k = pick(['a', 'b']);
          const sc = Math.floor(R() * 30);
          drillOf(t).recordSprint(k, sc);
          // The run just finished counts against the SAVED best, whatever this tab remembered.
          M.bests[k] = Math.max(M.bests[k] ?? 0, sc);
          emit(t, KEYS.drill);
          break;
        }
        case 'dset': {
          drillOf(t).updateSettings({ sound: R() < 0.5 });
          emit(t, KEYS.drill);
          break;
        }
        case 'dread': {
          // The learner taps the reading chip as THIS tab shows it (in force from its memory): their latest choice.
          const d = drillOf(t);
          const shown = typeof d.settings.families.read === 'boolean' ? d.settings.families.read : d.introDone;
          d.updateSettings({ families: { ...d.settings.families, read: !shown } });
          M.read = !shown;
          emit(t, KEYS.drill);
          break;
        }
        case 'dfollow': {
          const d = drillOf(t);
          const shown = d.settings.followLessons ?? false;
          d.updateSettings({ followLessons: !shown });
          M.follow = !shown;
          emit(t, KEYS.drill);
          break;
        }
        case 'dchip': {
          // Another topic's chip: the whole record is written, reading as this (maybe stale) tab holds it.
          const d = drillOf(t);
          const v = !d.settings.families.triad;
          d.updateSettings({ families: { ...d.settings.families, triad: v } });
          M.triad = v;
          emit(t, KEYS.drill);
          break;
        }
        case 'fing': {
          const k = pick(FSK);
          const clear = R() < 0.3;
          const v = pick([1, 2, 3, 4] as const);
          const had = t.fing.useFingeringStore.getState().overrides[k];
          t.fing.useFingeringStore.getState().setOverride(k, clear ? null : v);
          if (clear ? had !== undefined : had !== v) {
            if (clear) delete M.fing[k];
            else M.fing[k] = v;
            emit(t, KEYS.fing);
          }
          break;
        }
        case 'fclear': {
          // "Reset to suggested" for a position: these keys, on purpose, whatever this tab remembered.
          const keys = FSK.filter(() => R() < 0.5);
          t.fing.useFingeringStore.getState().clearOverrides(keys);
          for (const k of keys) delete M.fing[k];
          emit(t, KEYS.fing);
          break;
        }
        case 'flabel': {
          const v = pick(['finger', 'degree', 'note'] as const);
          const had = t.fing.useFingeringStore.getState().labelMode;
          t.fing.useFingeringStore.getState().setLabelMode(v);
          if (had !== v) { M.labelMode = v; emit(t, KEYS.fing); }
          break;
        }
        case 'capo': case 'theme': case 'lang': case 'metro': case 'prog': {
          const st = t.app.useAppStore;
          const before = savedLeaves(t);
          if (kind === 'capo') st.setState({ capoFret: pick([0, 1, 3, 5, 7]) });
          if (kind === 'theme') st.getState().setThemeMode(pick(['fermata', 'fermata-night', 'auto'] as const));
          if (kind === 'lang') st.getState().setLanguage(pick(['en', 'pt', 'es']));
          if (kind === 'metro') st.getState().setMetronome({ bpm: pick([60, 80, 100, 120]), beats: pick([2, 3, 4, 6] as const) });
          if (kind === 'prog') {
            const n = Math.floor(R() * 3);
            st.getState().setProgression(n === 0 ? { chords: [], bpm: 90, beats: 4 } : { chords: ['C', 'G', 'Am'].slice(0, n), bpm: pick([70, 90, 110]), beats: pick([2, 4] as const) });
          }
          const after = savedLeaves(t);
          for (const k of Object.keys(after)) if (J(before[k]) !== J(after[k])) { M.touched.add(k); M.leaves[k] = after[k]; }
          // A progression whose chords were cleared is none: its tempo and beats are the defaults again.
          if (J(M.leaves['progression.chords'] ?? []) === '[]') {
            for (const [k, v] of Object.entries(leavesOf({}))) if (k.startsWith('progression.') && M.touched.has(k)) M.leaves[k] = v;
          }
          emit(t, KEYS.app);
          break;
        }
        case 'reset': {
          // Reset app data: every key removed, this tab reloads; the others are stale.
          for (const k of Object.values(KEYS)) localStorage.removeItem(k);
          killAll();
          M = fresh();
          for (const k of Object.values(KEYS)) emit(t, k);
          await restart(i);
          break;
        }
        case 'import': {
          for (const k of Object.values(KEYS)) localStorage.removeItem(k);
          killAll();
          M = fresh();
          const task = `imp-task${uid}`;
          const ex = `imp-e${uid}`;
          localStorage.setItem(KEYS.progress, J({ state: { progress: {
            completedModules: ['l1u1m3'], moduleProgress: { l1u1m3: [task] },
            exerciseResults: { l1u1m3: { scores: { [ex]: 1 }, totalAttempts: 7, lastAttemptAt: clock, passed: true } }, reviewSchedules: { l1u1m3: SCHED },
          } }, version: 4 }));
          M.ticks.add(`l1u1m3:${task}`);
          M.done.l1u1m3 = true;
          M.scores.l1u1m3 = { [ex]: 1 };
          M.attempts.l1u1m3 = 7;
          M.passed.l1u1m3 = true;
          M.sched = { l1u1m3: SCHED };
          const f4 = tabs[0].sched.applyAnswer(undefined, true, 9000 + (++uid), clock - 1000, 'imp');
          localStorage.setItem(KEYS.drill, J({ state: { items: { f4 }, settings: tabs[0].drill.DEFAULT_SETTINGS, sprintBests: { a: 9 }, lifetime: { answered: 3, correct: 2 }, activeSession: null, sprint: null, introDone: true }, version: 3 }));
          M.drillBase.f4 = JSON.parse(J(f4));
          M.lifetime = { answered: 3, correct: 2 };
          M.bests = { a: 9 };
          localStorage.setItem(KEYS.fing, J({ state: { overrides: { 'dorian|standard|p2|0|1': 4 }, labelMode: 'note' }, version: 1 }));
          M.fing = { 'dorian|standard|p2|0|1': 4 };
          M.labelMode = 'note';
          for (const k of Object.values(KEYS)) emit(t, k);
          await restart(i);
          break;
        }
        case 'drillreset': {
          // Drill's "Reset progress", in place, in a tab that may not have heard the others.
          startSession(t);
          drillOf(t).resetDrillProgress();
          killDrill();
          M.drillAns = {};
          M.drillBase = {};
          M.lifetime = { answered: 0, correct: 0 };
          M.bests = {};
          emit(t, KEYS.drill);
          break;
        }
      }
    } catch (err) {
      viol('EXCEPTION', `${label} ${String((err as Error)?.stack ?? err).slice(0, 400)}`);
    }
    checkAll(label);
  }
  // Every event arrives at last, and every tab is shown again (the app's own follow on pageshow /
  // visibilitychange): a tab whose last event was among the one in five dropped re-reads then, as a
  // frozen tab does when the learner comes back to it (review of bd14071: seed 81, 200 steps, 4 tabs
  // dropped tab 1's last progress event on the final step). Each following tab shows what is saved.
  for (const e of events.splice(0)) deliver(e);
  for (const t of tabs) for (const k of Object.values(KEYS)) t.safe.tabLine(k)?.adopt?.();
  for (const t of tabs) {
    const ps = sv(KEYS.progress)?.state?.progress;
    if (ps && J(progOf(t)) !== J(ps)) viol('converge-progress', 'tab memory differs from the save');
    const ds = sv(KEYS.drill)?.state;
    if (ds && J(drillOf(t).items) !== J(ds.items)) viol('converge-drill', 'tab facts differ from the save');
  }
  const { buildCheckedBackup } = await import('../../utils/backupHelpers');
  const r = await buildCheckedBackup(localStorage);
  if (r.missing.length || r.partly.length || r.newer.length) viol('export-flags-a-healthy-save', J({ missing: r.missing, partly: r.partly, newer: r.newer }));
  for (const t of tabs) stop(t);
  vi.useRealTimers();
}

describe('several tabs at random, against one learner\'s actions in time order', () => {
  it(`${SEEDS} seeds × ${STEPS} steps × ${NTABS} tabs, Drill reset in place, imports and dropped events on: no divergence`, async () => {
    const V: Divergences = {};
    for (let s = FIRST; s < FIRST + SEEDS; s++) await runSeed(s, V);
    const summary = Object.entries(V).map(([c, l]) => `${c}: ${l.length} (first: seed ${l[0].seed} step ${l[0].step}: ${l[0].detail.slice(0, 400)})`);
    process.stdout.write(`TABS MODEL seeds ${FIRST}..${FIRST + SEEDS - 1}, steps ${STEPS}, tabs ${NTABS}: ${summary.length ? `\n${summary.join('\n')}` : 'no divergence'}\n`);
    expect(summary).toEqual([]);
  }, Math.max(900_000, SEEDS * STEPS * NTABS * 2)); // the long run (6000 × 200 × 4) needs more than 15 minutes on a loaded machine
});
