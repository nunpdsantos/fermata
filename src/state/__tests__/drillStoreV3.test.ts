/**
 * drillStore persistence v3 (W9b): a reload resumes a Drill session and a
 * Sprint exactly — the verdict on screen (`activeSession.feedback`), the
 * session's summary tally (`activeSession.log`) and the Sprint under way
 * (`sprint`) are saved.
 *
 * `fixtures/drill-v2-store.json` is a REAL `fermata-drill-v1` payload written
 * by the v2 store (origin/main 421baf4, before this change): produced by
 * driving that store with the real drill bank through one completed session
 * (12-question setting, the queue ran out after 7 answers) and a second one
 * left running after 3 answers (one wrong, requeued), with fixed clocks, and
 * copying the localStorage value verbatim.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  useDrillStore,
  DEFAULT_SETTINGS,
  DRILL_STORE_KEY,
  validatePersistedShape,
  sanitizeSprint,
  type SprintRun,
} from '../drillStore';
import { generateDrillBank } from '../../core/utils/drillBank';
import v2Fixture from './fixtures/drill-v2-store.json';
import v2ByHeartFixture from './fixtures/drill-v2-by-heart.json';
import { migrateTierV1 } from '../../services/drillScheduler';
import type { ItemSrsState } from '../../core/types/drill';

type Blob = { state: Record<string, unknown>; version: number };
const fixture = (): Blob => JSON.parse(JSON.stringify(v2Fixture)) as Blob;

const BANK = generateDrillBank();
const BY_ID = new Map(BANK.map((i) => [i.id, i]));

function resetStore() {
  localStorage.clear();
  useDrillStore.setState({
    items: {},
    settings: DEFAULT_SETTINGS,
    sprintBests: {},
    lifetime: { answered: 0, correct: 0 },
    activeSession: null,
    sprint: null,
  });
}
beforeEach(resetStore);

const stored = () => JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!) as Blob;

const RUN: SprintRun = {
  seed: 42, pool: ['a', 'b', 'c', 'd', 'e'], step: 3, correct: 2, secondsLeft: 41, familiesKey: 'triad', priorBest: 5, recorded: false,
};

describe('the v2 fixture is what it claims to be', () => {
  it('a version-2 payload with a session running after 3 answers, and no v3 fields', () => {
    const f = fixture();
    expect(f.version).toBe(2);
    const s = f.state.activeSession as Record<string, unknown>;
    expect(s.asked).toBe(3);
    expect(s.index).toBe(3);
    expect(s.missRequeues).toEqual({ 'triad:name-to-notes:C:major': 1 });
    expect('feedback' in s || 'log' in s || 'sprint' in f.state).toBe(false);
    expect((f.state.settings as { length: number }).length).toBe(12);
  });
});

describe('v2 → v3: a production-shaped save loads unchanged and resumes', () => {
  it('keeps items, settings, bests, lifetime and the running session exactly; no Sprint open', async () => {
    const f = fixture();
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(f));
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    expect(s.items).toEqual(f.state.items);
    expect(s.settings).toEqual(f.state.settings);
    expect(s.sprintBests).toEqual(f.state.sprintBests);
    expect(s.lifetime).toEqual(f.state.lifetime);
    expect(s.activeSession).toEqual(f.state.activeSession);
    expect(s.sprint).toBeNull();
  });

  it('preserves every field of the production v2 save with multi-session byHeart evidence', async () => {
    // Copied verbatim from the reviewer's production-generated-v2.json.
    // At the history cap, v1's conservative re-judgement would demote it.
    const f = structuredClone(v2ByHeartFixture);
    expect(f.version).toBe(2);
    const mastered = f.state.items['degree:num-to-name:1'];
    expect(mastered.tier).toBe('byHeart');
    expect(new Set(mastered.history.map((r) => r.sessionId)).size).toBe(10);
    expect(migrateTierV1(mastered as ItemSrsState)).toBe('review');
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(f));
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    // Whole-item equality includes every card field, tier and history record.
    expect(s.items).toEqual(f.state.items);
    expect(s.settings).toEqual(f.state.settings);
    expect(s.sprintBests).toEqual(f.state.sprintBests);
    expect(s.lifetime).toEqual(f.state.lifetime);
    expect(s.activeSession).toEqual(f.state.activeSession);
    expect(s.sprint).toBeNull();
    expect(stored()).toEqual({ version: 3, state: { ...f.state, sprint: null } });
  });

  it('the running session carries on: the next answer goes to queue[3], and the save is written back as v3', async () => {
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(fixture()));
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState().activeSession!;
    const item = BY_ID.get(s.queue[s.index])!;
    expect(item.id).toBe('roman:degree-to-chord:C:major:1');
    useDrillStore.getState().recordAnswer(item, true, 1700, Date.UTC(2026, 9, 29, 12, 1));
    const after = stored();
    expect(after.version).toBe(3);
    const saved = after.state.activeSession as Record<string, unknown>;
    expect(saved.asked).toBe(4);
    expect(saved.feedback).toEqual({ itemId: item.id, correct: true, nearMiss: false });
    // The tally starts with the first answer after the upgrade (v2 kept none).
    expect(saved.log).toMatchObject({ asked: 1, correct: 1, byFamily: { roman: { asked: 1, correct: 1 } } });
    expect(after.state.sprint).toBeNull();
  });
});

describe('v3 fields', () => {
  it('recordAnswer keeps the verdict; clearFeedback takes it off the screen', () => {
    useDrillStore.getState().updateSettings({ length: 12, newPerSession: 12 });
    useDrillStore.getState().startSession(BANK, Date.UTC(2026, 10, 2, 9));
    const s = useDrillStore.getState().activeSession!;
    const item = BY_ID.get(s.queue[0])!;
    useDrillStore.getState().recordAnswer(item, false, 2000, Date.UTC(2026, 10, 2, 9, 1), true);
    expect(useDrillStore.getState().activeSession!.feedback).toEqual({ itemId: item.id, correct: false, nearMiss: true });
    expect((stored().state.activeSession as { feedback: unknown }).feedback).toEqual({ itemId: item.id, correct: false, nearMiss: true });
    useDrillStore.getState().clearFeedback();
    expect(useDrillStore.getState().activeSession!.feedback).toBeNull();
    expect((stored().state.activeSession as { feedback: unknown }).feedback).toBeNull();
  });

  it('the session log tallies per family and counts tier-ups, and a new session starts empty', () => {
    useDrillStore.getState().updateSettings({ length: 12, newPerSession: 12 });
    useDrillStore.getState().startSession(BANK, Date.UTC(2026, 10, 2, 9));
    let n = 0;
    for (; n < 4; n++) {
      const s = useDrillStore.getState().activeSession!;
      useDrillStore.getState().recordAnswer(BY_ID.get(s.queue[s.index])!, n !== 2, 1500, Date.UTC(2026, 10, 2, 9, n + 1));
    }
    const log = useDrillStore.getState().activeSession!.log!;
    expect(log.asked).toBe(4);
    expect(log.correct).toBe(3);
    const perFamily = Object.values(log.byFamily).reduce((a, t) => a + t!.asked, 0);
    expect(perFamily).toBe(4);
    expect(log.newlyByHeart).toBe(0);
    expect(log.newlyReview).toBe(0);
    useDrillStore.getState().startSession(BANK, Date.UTC(2026, 10, 2, 10));
    expect(useDrillStore.getState().activeSession!.log).toBeUndefined();
  });

  it('counts real learning → review and review → byHeart crossings, never repeats or demotions', () => {
    const item = BY_ID.get('degree:num-to-name:1')!;
    const begin = (now: number) => useDrillStore.setState({
      activeSession: {
        id: `s${now}`, queue: [item.id, item.id], index: 0, asked: 0, correct: 0,
        startedAt: now, seed: 1, missRequeues: {},
      },
    });
    const answer = (correct: boolean, now: number) => useDrillStore.getState().recordAnswer(item, correct, 1500, now);
    const log = () => useDrillStore.getState().activeSession!.log!;
    const tier = () => useDrillStore.getState().items[item.id].tier;
    const first = Date.UTC(2026, 0, 1, 9);
    begin(first);
    answer(true, first + 1000);
    expect(tier()).toBe('learning');
    expect(log()).toMatchObject({ newlyReview: 0, newlyByHeart: 0 });
    answer(true, first + 2000);
    expect(tier()).toBe('review');
    expect(log()).toMatchObject({ newlyReview: 1, newlyByHeart: 0 });

    const second = Date.UTC(2026, 1, 1, 9);
    begin(second);
    answer(true, second + 1000);
    expect(tier()).toBe('review');
    expect(log()).toMatchObject({ newlyReview: 0, newlyByHeart: 0 });
    const third = Date.UTC(2026, 2, 1, 9);
    begin(third);
    answer(true, third + 1000);
    expect(tier()).toBe('byHeart');
    expect(log()).toMatchObject({ newlyReview: 0, newlyByHeart: 1 });
    answer(true, third + 2000);
    expect(log()).toMatchObject({ newlyReview: 0, newlyByHeart: 1, asked: 2, correct: 2 });

    const fourth = Date.UTC(2026, 3, 1, 9);
    begin(fourth);
    answer(false, fourth + 1000);
    expect(tier()).toBe('review');
    expect(log()).toMatchObject({ newlyReview: 0, newlyByHeart: 0, asked: 1, correct: 0 });
    expect(stored().state.activeSession).toEqual(useDrillStore.getState().activeSession);
  });

  it('saveSprint persists the run; null closes it; resets close it too', () => {
    useDrillStore.getState().saveSprint(RUN);
    expect(stored().state.sprint).toEqual(RUN);
    useDrillStore.getState().saveSprint(null);
    expect(stored().state.sprint).toBeNull();
    useDrillStore.getState().saveSprint(RUN);
    useDrillStore.getState().resetDrillProgress();
    expect(useDrillStore.getState().sprint).toBeNull();
    useDrillStore.getState().saveSprint(RUN);
    useDrillStore.getState().resetDrillData();
    expect(useDrillStore.getState().sprint).toBeNull();
  });

  it('a v3 save round-trips through rehydration', async () => {
    useDrillStore.getState().saveSprint(RUN);
    const saved = localStorage.getItem(DRILL_STORE_KEY)!;
    resetStore();
    localStorage.setItem(DRILL_STORE_KEY, saved);
    await useDrillStore.persist.rehydrate();
    expect(useDrillStore.getState().sprint).toEqual(RUN);
  });
});

describe('shape guards: a broken v3 extra is dropped on its own, never the session', () => {
  const base = () => fixture().state;

  it('malformed feedback / log → dropped; the session survives', () => {
    const state = base();
    state.activeSession = { ...(state.activeSession as object), feedback: { itemId: 3 }, log: { asked: 'x' } };
    const clean = validatePersistedShape(state)!;
    expect(clean.activeSession).not.toBeNull();
    expect(clean.activeSession!.asked).toBe(3);
    expect('feedback' in clean.activeSession!).toBe(false);
    expect('log' in clean.activeSession!).toBe(false);
  });

  it('a log keeps its valid families and drops unknown / broken ones', () => {
    const state = base();
    state.activeSession = {
      ...(state.activeSession as object),
      log: { asked: 3, correct: 2, newlyByHeart: 0, newlyReview: 1, byFamily: { triad: { asked: 2, correct: 1 }, bogus: { asked: 1, correct: 1 }, roman: { asked: -1, correct: 0 } } },
    };
    expect(validatePersistedShape(state)!.activeSession!.log).toEqual({
      asked: 3, correct: 2, newlyByHeart: 0, newlyReview: 1, byFamily: { triad: { asked: 2, correct: 1 } },
    });
  });

  it.each([
    ['not an object', 'x'],
    ['an empty pool', { ...RUN, pool: [] }],
    ['a non-string id', { ...RUN, pool: ['a', 2] }],
    ['more than 60 s left', { ...RUN, secondsLeft: 61 }],
    ['negative time', { ...RUN, secondsLeft: -1 }],
    ['no families key', { ...RUN, familiesKey: undefined }],
    ['recorded not boolean', { ...RUN, recorded: 'yes' }],
    ['a NaN score', { ...RUN, correct: Number.NaN }],
  ])('a Sprint with %s is closed (null)', (_label, raw) => {
    expect(sanitizeSprint(raw)).toBeNull();
    const state = base();
    state.sprint = raw;
    expect(validatePersistedShape(state)!.sprint).toBeNull();
  });
});
