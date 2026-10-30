/**
 * drillStore persistence: v1 → v2 migration (decision D-15) and per-entry
 * shape guards (audit W7-10).
 *
 * `fixtures/drill-v1-store.json` is a REAL `fermata-drill-v1` payload written
 * by the pre-W7 store (version 1): it was produced by driving the origin/main
 * drillStore + drillBank through recordAnswer/startSession with fixed clocks
 * and copying the localStorage value verbatim. Items:
 *   A degree:num-to-name:1      v1 byHeart — first answers right & fast over 3 days
 *   B degree:name-to-num:Tonic  v1 byHeart — wrong FIRST in all 3 sessions (audit Scenario A)
 *   C circle:next-sharp:F#      v1 byHeart — 3 sessions inside 10 minutes (audit Scenario B)
 *   D keysig:key-to-count:C:major  review
 *   E triad:name-to-notes:C:major  learning
 *   G scale:spell:C:major          review (promoted across sessions)
 *   F interval:letter-third:C   v1 byHeart — history at the cap; the v1 trim
 *                                 dropped its oldest session's two wrong answers
 * plus non-default settings, a sprint best, lifetime counters and a session
 * paused after one answer. All clocks are 12:00 UTC ± 10 minutes, so the
 * "same calendar day" facts hold in every time zone from UTC−11 to UTC+11.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useDrillStore, DEFAULT_SETTINGS, DRILL_STORE_KEY } from '../drillStore';
import v1Fixture from './fixtures/drill-v1-store.json';

type Blob = { state: Record<string, unknown>; version: number };

function fixture(): Blob {
  return JSON.parse(JSON.stringify(v1Fixture)) as Blob;
}

function seed(blob: Blob) {
  localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(blob));
}

function resetStore() {
  localStorage.clear();
  useDrillStore.setState({
    items: {},
    settings: DEFAULT_SETTINGS,
    sprintBests: {},
    lifetime: { answered: 0, correct: 0 },
    activeSession: null,
  });
}

beforeEach(resetStore);

const A = 'degree:num-to-name:1';
const B = 'degree:name-to-num:Tonic';
const C = 'circle:next-sharp:F#';
const D = 'keysig:key-to-count:C:major';
const E = 'triad:name-to-notes:C:major';
const G = 'scale:spell:C:major';
const F = 'interval:letter-third:C';

describe('the v1 fixture is what it claims to be', () => {
  it('is a version-1 payload with the v1 tiers', () => {
    const f = fixture();
    expect(f.version).toBe(1);
    const items = f.state.items as Record<string, { tier: string; history: unknown[] }>;
    expect(Object.keys(items).sort()).toEqual([A, B, C, D, E, F, G].sort());
    expect(items[A].tier).toBe('byHeart');
    expect(items[B].tier).toBe('byHeart');
    expect(items[C].tier).toBe('byHeart');
    expect(items[F].tier).toBe('byHeart');
    expect(items[F].history).toHaveLength(10);
  });
});

describe('v1 → v2 migration keeps all progress', () => {
  it('keeps every item, its FSRS card and its history', async () => {
    const f = fixture();
    seed(f);
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    const before = f.state.items as Record<string, { card: unknown; history: unknown }>;
    expect(Object.keys(s.items).sort()).toEqual(Object.keys(before).sort());
    for (const id of Object.keys(before)) {
      expect(s.items[id].card, id).toEqual(before[id].card);
      expect(s.items[id].history, id).toEqual(before[id].history);
    }
  });

  it('keeps settings, sprint bests, lifetime counters and the paused session', async () => {
    const f = fixture();
    seed(f);
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    expect(s.settings).toEqual(f.state.settings);
    expect(s.settings.length).toBe(12);
    expect(s.sprintBests).toEqual({ degree: 9 });
    expect(s.lifetime).toEqual(f.state.lifetime);
    expect(s.activeSession).toEqual(f.state.activeSession);
    expect(s.activeSession!.index).toBe(1);
  });

  it('re-judges by-heart tiers under the first-answer rule, never promoting', async () => {
    seed(fixture());
    await useDrillStore.persist.rehydrate();
    const { items } = useDrillStore.getState();
    expect(items[A].tier).toBe('byHeart'); // genuinely by heart
    expect(items[B].tier).toBe('review'); // never right first time
    expect(items[C].tier).toBe('review'); // all inside ten minutes
    expect(items[F].tier).toBe('review'); // truncated oldest session not trusted
    expect(items[D].tier).toBe('review');
    expect(items[G].tier).toBe('review');
    expect(items[E].tier).toBe('learning');
  });

  it('writes the migrated payload back as version 2', async () => {
    seed(fixture());
    await useDrillStore.persist.rehydrate();
    // Any state change persists; the stored version must now be the current one.
    useDrillStore.getState().recordSprint('degree', 3);
    const stored = JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!) as Blob;
    expect(stored.version).toBe(2);
    expect((stored.state.items as Record<string, { tier: string }>)[B].tier).toBe('review');
  });

  it('a v2 payload is not re-migrated (tiers stored by v2 are trusted)', async () => {
    const f = fixture();
    f.version = 2;
    seed(f);
    await useDrillStore.persist.rehydrate();
    // B stays whatever v2 wrote (here: the fixture's byHeart) — only the
    // version-1 path re-judges tiers.
    expect(useDrillStore.getState().items[B].tier).toBe('byHeart');
  });
});

describe('one malformed item does not wipe Drill progress (W7-10)', () => {
  // Ported from the auditor's persist-probe.mts: 3 items, one missing `history`.
  it('audit probe: drops only the broken item, keeps the rest and the counters', async () => {
    const good = () => ({
      card: { due: 1, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 1, reps: 3, lapses: 0, state: 2, learning_steps: 0 },
      history: [{ ts: 1, correct: true, ms: 1500, sessionId: 's1' }],
      tier: 'review',
      introCorrectCount: 2,
    });
    const items: Record<string, Record<string, unknown>> = {
      'degree:num-to-name:1': good(),
      'degree:num-to-name:2': good(),
      'degree:num-to-name:3': good(),
    };
    delete items['degree:num-to-name:3'].history;
    seed({
      state: {
        items,
        settings: { length: 24, newPerSession: 4, families: {}, sound: true, showTimer: false },
        sprintBests: { degree: 9 },
        lifetime: { answered: 120, correct: 100 },
        activeSession: null,
      },
      version: 1,
    });
    await useDrillStore.persist.rehydrate();
    const s = useDrillStore.getState();
    expect(Object.keys(s.items).sort()).toEqual(['degree:num-to-name:1', 'degree:num-to-name:2']);
    expect(s.lifetime.answered).toBe(120);
    expect(s.sprintBests).toEqual({ degree: 9 });
  });

  const breakages: Array<[string, (item: Record<string, unknown>) => void]> = [
    ['history missing', (it) => { delete it.history; }],
    ['card missing', (it) => { delete it.card; }],
    ['card.due not a number', (it) => { (it.card as Record<string, unknown>).due = 'soon'; }],
    ['tier unknown', (it) => { it.tier = 'banana'; }],
    ['item is null', () => {}],
  ];

  for (const version of [1, 2]) {
    for (const [label, breakIt] of breakages) {
      it(`v${version}: ${label} → only that item is dropped`, async () => {
        const f = fixture();
        f.version = version;
        const items = f.state.items as Record<string, Record<string, unknown> | null>;
        if (label === 'item is null') items[D] = null;
        else breakIt(items[D]!);
        seed(f);
        await useDrillStore.persist.rehydrate();
        const s = useDrillStore.getState();
        expect(s.items[D]).toBeUndefined();
        expect(Object.keys(s.items)).toHaveLength(6);
        expect(s.lifetime).toEqual(f.state.lifetime);
        expect(s.sprintBests).toEqual({ degree: 9 });
        expect(s.activeSession).toEqual(f.state.activeSession);
      });
    }
  }

  it('a malformed history record is dropped, the item and its other records kept', async () => {
    const f = fixture();
    const items = f.state.items as Record<string, { history: unknown[] }>;
    const goodRecords = items[A].history.slice();
    items[A].history.splice(1, 0, { ts: 'x', correct: 'yes' });
    seed(f);
    await useDrillStore.persist.rehydrate();
    expect(useDrillStore.getState().items[A].history).toEqual(goodRecords);
  });

  it('missing optional card fields default to 0 instead of dropping the item', async () => {
    const f = fixture();
    const items = f.state.items as Record<string, { card: Record<string, unknown> }>;
    delete items[D].card.learning_steps;
    delete items[D].card.elapsed_days;
    seed(f);
    await useDrillStore.persist.rehydrate();
    const card = useDrillStore.getState().items[D].card;
    expect(card.learning_steps).toBe(0);
    expect(card.elapsed_days).toBe(0);
    expect(card.due).toBe((f.state.items as Record<string, { card: { due: number } }>)[D].card.due);
  });

  it('non-numeric sprint bests are dropped individually', async () => {
    const f = fixture();
    f.state.sprintBests = { degree: 9, broken: 'lots' };
    seed(f);
    await useDrillStore.persist.rehydrate();
    expect(useDrillStore.getState().sprintBests).toEqual({ degree: 9 });
  });
});
