/**
 * Audit W0-02 (D-4 + verify-D extra 1): queue invariant, checked after EVERY
 * recordAnswer on the real store with the real bank.
 *
 * Spec §3.6: "the same item never appears twice in a row". Before the fix a
 * miss on the last item of a short queue was requeued at index+1, so the
 * just-missed question came straight back (and spelling inputs locked). It
 * also happened for choice items under default settings.
 *
 * Invariant: from the just-answered item onward, no two neighbours are the
 * same id — unless the session holds no other item at all (a one-item session
 * is the only case where a repeat could be "unavoidable"; the store is
 * stricter still and never repeats, see the last test).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useDrillStore, DEFAULT_SETTINGS, isSessionComplete, type ActiveSession } from '../drillStore';
import { drillSiblingGroup, generateDrillBank } from '../../core/utils/drillBank';
import { mulberry32 } from '../../core/utils/prng';
import { DRILL_FAMILIES, type DrillFamily, type DrillItem } from '../../core/types/drill';

const BANK: DrillItem[] = generateDrillBank();
const BY_ID = new Map(BANK.map((i) => [i.id, i]));

function only(...fams: DrillFamily[]): Record<DrillFamily, boolean> {
  return Object.fromEntries(DRILL_FAMILIES.map((f) => [f, fams.includes(f)])) as Record<DrillFamily, boolean>;
}

function avoidableAdjacent(s: ActiveSession): string | null {
  const from = Math.max(0, s.index - 1);
  for (let i = from; i < s.queue.length - 1; i++) {
    if (s.queue[i] !== s.queue[i + 1]) continue;
    const unavoidable = s.queue.every((id) => id === s.queue[i]);
    if (!unavoidable) return `${s.queue[i]} at ${i} and ${i + 1} (index ${s.index}, queue ${s.queue.length})`;
  }
  return null;
}

interface Scenario {
  name: string;
  families: Record<DrillFamily, boolean>;
  length: 12 | 24 | 40;
  newPerSession: number;
  accuracy: number;
  sessions: number;
}

function run(sc: Scenario, seed: number): string[] {
  const violations: string[] = [];
  useDrillStore.getState().resetDrillData();
  useDrillStore.getState().updateSettings({
    families: sc.families,
    length: sc.length,
    newPerSession: sc.newPerSession,
    sound: false,
  });
  const rand = mulberry32(seed);
  let now = Date.UTC(2026, 9, 30, 9) + seed * 1000;
  for (let n = 0; n < sc.sessions; n++) {
    now += 26 * 3600 * 1000; // next day: some items fall due
    useDrillStore.getState().startSession(BANK, now);
    for (let guard = 0; guard < 200; guard++) {
      const st = useDrillStore.getState();
      const s = st.activeSession!;
      if (isSessionComplete(s, st.settings)) break;
      const item = BY_ID.get(s.queue[s.index])!;
      now += 2500;
      st.recordAnswer(item, rand() < sc.accuracy, 2000, now);
      const v = avoidableAdjacent(useDrillStore.getState().activeSession!);
      if (v) violations.push(`${sc.name} seed ${seed} session ${n}: ${v}`);
    }
    useDrillStore.getState().endSession();
  }
  return violations;
}

const SCENARIOS: Scenario[] = [
  { name: 'defaults, 70%', families: DEFAULT_SETTINGS.families, length: 24, newPerSession: 4, accuracy: 0.7, sessions: 6 },
  { name: 'defaults, all wrong', families: DEFAULT_SETTINGS.families, length: 24, newPerSession: 4, accuracy: 0, sessions: 3 },
  { name: 'triads only, 70%', families: only('triad'), length: 24, newPerSession: 4, accuracy: 0.7, sessions: 6 },
  { name: 'sevenths only, 50%', families: only('seventh'), length: 12, newPerSession: 2, accuracy: 0.5, sessions: 6 },
  { name: 'scale only, 30%', families: only('scale'), length: 40, newPerSession: 8, accuracy: 0.3, sessions: 4 },
  { name: 'degree only, 1 new, all wrong', families: only('degree'), length: 12, newPerSession: 1, accuracy: 0, sessions: 4 },
  { name: 'degree only, 2 new, 60%', families: only('degree'), length: 12, newPerSession: 2, accuracy: 0.6, sessions: 6 },
];

beforeEach(() => {
  useDrillStore.getState().resetDrillData();
});

describe('drill queue invariant after every recordAnswer (W0-02)', () => {
  for (const sc of SCENARIOS) {
    it(`no avoidable adjacent duplicate — ${sc.name}`, () => {
      const violations: string[] = [];
      for (let seed = 1; seed <= 8; seed++) violations.push(...run(sc, seed));
      expect(violations.slice(0, 5)).toEqual([]);
    });
  }

  it('known positive: missing the last item of a short queue does not bring it straight back', () => {
    useDrillStore.getState().updateSettings({ families: only('triad'), length: 24, newPerSession: 3, sound: false });
    const now = Date.UTC(2026, 9, 30, 9);
    useDrillStore.getState().startSession(BANK, now);
    let s = useDrillStore.getState().activeSession!;
    expect(s.queue.length).toBe(3); // shorter than the session length
    // Answer everything but the last item correctly (adds second exposures).
    let t = now;
    while (s.index < s.queue.length - 1) {
      t += 3000;
      useDrillStore.getState().recordAnswer(BY_ID.get(s.queue[s.index])!, true, 2000, t);
      s = useDrillStore.getState().activeSession!;
    }
    const lastId = s.queue[s.index];
    useDrillStore.getState().recordAnswer(BY_ID.get(lastId)!, false, 2000, t + 3000);
    s = useDrillStore.getState().activeSession!;
    expect(s.queue[s.index - 1]).toBe(lastId);
    expect(s.queue[s.index]).not.toBe(lastId);
  });

  it('stricter than the invariant: a one-item session is not re-asked straight after a miss', () => {
    // Judgment call (spec §3.6 "never twice in a row"): with nothing to space
    // it, the miss is NOT requeued; FSRS marks it Again, so it returns soon in
    // a later session instead of right after its answer was shown.
    useDrillStore.getState().updateSettings({ families: only('degree'), length: 12, newPerSession: 1, sound: false });
    useDrillStore.getState().startSession(BANK, Date.UTC(2026, 9, 30, 9));
    const s0 = useDrillStore.getState().activeSession!;
    expect(s0.queue).toHaveLength(1);
    useDrillStore.getState().recordAnswer(BY_ID.get(s0.queue[0])!, false, 2000, Date.UTC(2026, 9, 30, 9, 1));
    const s1 = useDrillStore.getState().activeSession!;
    expect(s1.queue).toEqual(s0.queue);
    expect(isSessionComplete(s1, useDrillStore.getState().settings)).toBe(true);
  });
});

// ─── W7-04: siblings (an item and its reverse) never back to back ────────────

function siblingAdjacent(s: ActiveSession): string | null {
  const from = Math.max(0, s.index - 1);
  for (let i = from; i < s.queue.length - 1; i++) {
    const a = s.queue[i];
    const b = s.queue[i + 1];
    if (drillSiblingGroup(a) !== drillSiblingGroup(b)) continue;
    const unavoidable = s.queue.every((id) => drillSiblingGroup(id) === drillSiblingGroup(a));
    if (!unavoidable) return `${a} / ${b} at ${i} (index ${s.index}, queue ${s.queue.length})`;
  }
  return null;
}

function runSiblings(sc: Scenario, seed: number): string[] {
  const violations: string[] = [];
  useDrillStore.getState().resetDrillData();
  useDrillStore.getState().updateSettings({
    families: sc.families,
    length: sc.length,
    newPerSession: sc.newPerSession,
    sound: false,
  });
  const rand = mulberry32(seed);
  let now = Date.UTC(2026, 9, 30, 9) + seed * 1000;
  for (let n = 0; n < sc.sessions; n++) {
    now += 26 * 3600 * 1000;
    useDrillStore.getState().startSession(BANK, now);
    const start = siblingAdjacent(useDrillStore.getState().activeSession!);
    if (start) violations.push(`${sc.name} seed ${seed} session ${n} (composed): ${start}`);
    for (let guard = 0; guard < 200; guard++) {
      const st = useDrillStore.getState();
      const s = st.activeSession!;
      if (isSessionComplete(s, st.settings)) break;
      now += 2500;
      st.recordAnswer(BY_ID.get(s.queue[s.index])!, rand() < sc.accuracy, 2000, now);
      const v = siblingAdjacent(useDrillStore.getState().activeSession!);
      if (v) violations.push(`${sc.name} seed ${seed} session ${n}: ${v}`);
    }
    useDrillStore.getState().endSession();
  }
  return violations;
}

describe('drill queue: no sibling pair after any recordAnswer (W7-04)', () => {
  for (const sc of SCENARIOS) {
    it(`no avoidable sibling pair — ${sc.name}`, () => {
      const violations: string[] = [];
      for (let seed = 1; seed <= 6; seed++) violations.push(...runSiblings(sc, seed));
      expect(violations.slice(0, 5)).toEqual([]);
    });
  }
});
