/**
 * Garbage inside another tab's save (second review of the A1 fix,
 * 2026-11-19; the reviewer's fuzz, kept). Each seed builds a healthy tab (all
 * five stores), then "another tab" rewrites every save with random damage —
 * fields replaced by junk or deleted, at any depth, hostile keys such as
 * `constructor` and `__proto__`, one save in five an older version — and the
 * tab then writes and follows. No write may throw, and what is written must
 * be a save its store's own guard reads back unchanged: progress valid,
 * every Drill fact one the guard keeps, no settings field the guard drops.
 * (Before the fix: 149 of 150 seeds wrote settings the guard rejects, 17
 * Drill facts it drops.) TABS_GARBAGE_SEEDS for a longer run.
 */
import { describe, expect, it, vi } from 'vitest';

const KEYS = { progress: 'music-theory-progress', drill: 'fermata-drill-v1', app: 'music-theory-app', fing: 'fermata-fingering-v1', sess: 'fermata-learn-session-v1' } as const;
const SEEDS = Number(process.env.TABS_GARBAGE_SEEDS ?? 60);

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
const GARBAGE: unknown[] = [null, 'x', 5, -1, 0.3, [], {}, { a: 1 }, true, false, [1, 2], ['a'], { history: 'x' }, { card: null }, 'constructor', '__proto__'];
function mutate(v: unknown, R: () => number, depth = 0): unknown {
  if (!v || typeof v !== 'object') return v;
  const out: Record<string, unknown> | unknown[] = Array.isArray(v) ? [...v] : { ...(v as Record<string, unknown>) };
  const o = out as Record<string, unknown>;
  for (const k of Object.keys(o)) {
    const r = R();
    if (r < 0.12) o[k] = GARBAGE[Math.floor(R() * GARBAGE.length)];
    else if (r < 0.2) delete o[k];
    else if (depth < 6) o[k] = mutate(o[k], R, depth + 1);
  }
  if (!Array.isArray(out) && R() < 0.1) o[['constructor', '__proto__', 'toString', 'zz'][Math.floor(R() * 4)]] = GARBAGE[Math.floor(R() * GARBAGE.length)];
  return out;
}
const item = (id: string) => ({
  id, family: 'interval' as const, promptKey: 'p', promptParams: {}, input: { format: 'choice' as const, choices: ['A', 'B'] },
  answer: { kind: 'choice' as const, correct: 'A' }, whyKey: 'w', whyParams: {}, rank: 0,
});
async function tab() {
  vi.resetModules();
  const progress = await import('../progressStore');
  const drill = await import('../drillStore');
  const app = await import('../store');
  const fing = await import('../fingeringStore');
  const sess = await import('../learnSessionStore');
  const safe = await import('../tabSafe');
  await import('../tabSync');
  await new Promise((resolve) => setTimeout(resolve, 0));
  return { progress, drill, app, fing, sess, safe };
}

describe('garbage inside another tab\'s save', () => {
  it(`${SEEDS} seeds: no write throws, and every written save is one its store's guard reads back unchanged`, async () => {
    const problems: Record<string, string[]> = {};
    for (let seed = 1; seed <= SEEDS; seed++) {
      const R = rng(seed);
      localStorage.clear();
      const t = await tab();
      t.progress.useProgressStore.getState().toggleTask('l1u1m1', 'a');
      t.progress.useProgressStore.getState().recordExerciseResult('l1u1m1', 'e1', 1);
      t.progress.useProgressStore.getState().completeModule('l1u1m1');
      t.drill.useDrillStore.getState().startSession([item('f1'), item('f2')], 1_000_000);
      t.drill.useDrillStore.getState().recordAnswer(item('f1'), true, 800, 1_000_100);
      t.app.useAppStore.getState().setMetronome({ bpm: 90, beats: 3 });
      t.app.useAppStore.getState().setProgression({ chords: ['C'], bpm: 90, beats: 4 });
      t.fing.useFingeringStore.getState().setOverride('major|standard|p2|0|1', 2);
      t.sess.useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: null, at: Date.now() });
      for (const key of Object.values(KEYS)) {
        const raw = JSON.parse(localStorage.getItem(key)!);
        localStorage.setItem(key, JSON.stringify({ state: mutate(raw.state, R), version: R() < 0.2 ? Math.max(0, raw.version - 1) : raw.version }));
      }
      const attempt = (label: string, f: () => void) => {
        try {
          f();
        } catch (e) {
          (problems[label] ??= []).push(`seed ${seed}: ${String((e as Error)?.stack ?? e).split('\n').slice(0, 3).join(' / ').slice(0, 300)}`);
        }
      };
      attempt('progress', () => t.progress.useProgressStore.getState().recordExerciseResult('l1u1m1', 'e2', 0.5));
      attempt('progress', () => t.progress.useProgressStore.getState().toggleTask('l1u1m2', 'z'));
      attempt('drill', () => t.drill.useDrillStore.getState().recordAnswer(item('f1'), false, 900, 1_100_000));
      attempt('drill', () => t.drill.useDrillStore.getState().recordAnswer(item('f2'), true, 900, 1_200_000));
      attempt('settings', () => t.app.useAppStore.getState().setMetronome({ bpm: 120, beats: 3 }));
      attempt('settings', () => t.app.useAppStore.getState().setProgression({ chords: ['C', 'G'], bpm: 100, beats: 2 }));
      attempt('fingerings', () => t.fing.useFingeringStore.getState().setOverride('major|standard|p2|1|0', 3));
      attempt('learn session', () => t.sess.useLearnSessionStore.getState().setSection('x'));
      attempt('following', () => { for (const k of Object.values(KEYS)) t.safe.tabLine(k)?.adopt?.(); });
      attempt('progress written', () => {
        const st = JSON.parse(localStorage.getItem(KEYS.progress)!).state;
        if (!t.progress.isValidPersistedProgress(st)) throw new Error(`invalid ${JSON.stringify(st).slice(0, 200)}`);
      });
      attempt('drill written', () => {
        const st = JSON.parse(localStorage.getItem(KEYS.drill)!).state;
        const read = t.drill.validatePersistedShape(st);
        if (read === null || Object.keys(read.items).length !== Object.keys(st.items ?? {}).length) throw new Error('a fact the guard drops');
      });
      attempt('fingerings written', () => {
        const st = JSON.parse(localStorage.getItem(KEYS.fing)!).state;
        if (JSON.stringify(t.fing.sanitize(st)) !== JSON.stringify(st)) throw new Error(`what the guard drops ${JSON.stringify(st).slice(0, 200)}`);
      });
      attempt('settings written', () => {
        const bad = t.app.invalidAppStateFields(JSON.parse(localStorage.getItem(KEYS.app)!).state);
        if (bad === null || bad.length) throw new Error(`fields the guard drops ${JSON.stringify(bad)}`);
      });
      for (const k of Object.values(KEYS)) t.safe.tabLine(k)?.stop?.();
    }
    const summary = Object.entries(problems).map(([k, l]) => `${k}: ${l.length}, e.g. ${l[0]}`);
    expect(summary).toEqual([]);
  }, 300_000);
});
