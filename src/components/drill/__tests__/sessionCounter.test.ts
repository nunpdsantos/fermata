import { describe, it, expect, beforeEach } from 'vitest';
import { sessionCounter } from '../sessionCounter';
import { useDrillStore, DEFAULT_SETTINGS } from '../../../state/drillStore';
import { generateDrillBank } from '../../../core/utils/drillBank';
import { mulberry32 } from '../../../core/utils/prng';
import type { DrillItem } from '../../../core/types/drill';

const all = () => true;
const none = () => false;

/** The header at every question of a run through a fixed `queue` (answered in order). */
function run(queue: string[], length: number, isNew: (id: string) => boolean = none, known: (id: string) => boolean = all) {
  const out: string[] = [];
  let asked = 0;
  for (let at = 0; at < queue.length && asked < length; at++) {
    if (!known(queue[at])) continue;
    out.push(header(sessionCounter(queue, at, length, known, isNew, 1, (id) => id)));
    asked++;
  }
  return out;
}

function header(c: ReturnType<typeof sessionCounter>): string {
  return `${c.extra > 0 ? `extra ${c.extra}` : `${c.current}/${c.total}`}${c.again ? ' again' : ''}`;
}

describe('sessionCounter — a fixed total, and a header that always moves', () => {
  it('a perfect first session counts the new facts\' second looks: 1 of 8 … 8 of 8', () => {
    const isNew = (id: string) => 'ABCD'.includes(id);
    expect(run(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'], 24, isNew)).toEqual([
      '1/8', '2/8', '3/8', '4/8', '5/8 again', '6/8 again', '7/8 again', '8/8 again',
    ]);
  });

  it('the total is the same before and after the second looks are queued', () => {
    const isNew = (id: string) => 'ABCD'.includes(id);
    expect(sessionCounter(['A', 'B', 'C', 'D'], 0, 24, all, isNew, 1, (id) => id).total).toBe(8);
    expect(sessionCounter(['A', 'B', 'C', 'D', 'A'], 1, 24, all, isNew, 1, (id) => id).total).toBe(8);
  });

  it('a miss on a fact already met is an extra: the total stays, the header reads Extra k', () => {
    // Old facts A, B, C; B is missed and comes back; the miss repeats once.
    expect(run(['A', 'B', 'C', 'B', 'B'], 24)).toEqual(['1/3', '2/3', '3/3', 'extra 1 again', 'extra 2 again']);
  });

  it('a full session: a re-ask beyond the plan takes a planned slot and the counter moves on', () => {
    expect(run(['A', 'B', 'A', 'C', 'D'], 4)).toEqual(['1/4', '2/4', '3/4 again', '4/4']);
  });

  it('a new fact with no place for its second look is planned once from the start', () => {
    // A lone new fact: the store can never re-ask it (never twice in a row).
    expect(run(['A'], 24, () => true)).toEqual(['1/1']);
  });

  it('ids the bank no longer has are neither counted nor asked', () => {
    const known = (id: string) => id !== 'gone';
    expect(run(['gone', 'A', 'B', 'A'], 24, none, known)).toEqual(['1/2', '2/2', 'extra 1 again']);
  });
});

// The real store, the real queue mechanics: whatever the answers, the total
// never changes and no two questions in a row show the same header.
describe('sessionCounter over real sessions (seat review, 2026-11-09)', () => {
  const BANK: DrillItem[] = generateDrillBank({ includeRead: true });
  const BY_ID = new Map(BANK.map((i) => [i.id, i]));

  beforeEach(() => {
    localStorage.clear();
    useDrillStore.getState().resetDrillData();
  });

  function play(seed: number, missRate: number, priorSessions: number, length: 12 | 24 | 40) {
    useDrillStore.getState().updateSettings({ ...DEFAULT_SETTINGS, length });
    const rand = mulberry32(seed);
    let now = 1_800_000_000_000;
    let headers: string[] = [];
    for (let s = 0; s <= priorSessions; s++) {
      now += 2 * 86_400_000;
      useDrillStore.getState().startSession(BANK, now);
      headers = [];
      for (let guard = 0; guard < 200; guard++) {
        const st = useDrillStore.getState();
        const session = st.activeSession!;
        if (session.asked >= length || session.index >= session.queue.length) break;
        let at = session.index;
        while (at < session.queue.length && !BY_ID.has(session.queue[at])) at++;
        if (at >= session.queue.length) break;
        const isNew = (id: string) => st.items[id] === undefined || st.items[id].introSessionId === session.id;
        const c = sessionCounter(session.queue, at, length, (id) => BY_ID.has(id), isNew, session.seed);
        headers.push(header(c));
        const correct = rand() >= missRate;
        st.recordAnswer(BY_ID.get(session.queue[at])!, correct, 1500, now + guard * 1000);
        // During feedback the header is the same question's (computed at index − 1).
        const after = useDrillStore.getState();
        const fb = sessionCounter(after.activeSession!.queue, after.activeSession!.index - 1, length, (id) => BY_ID.has(id),
          (id) => after.items[id] === undefined || after.items[id].introSessionId === session.id, after.activeSession!.seed);
        expect(header(fb), `feedback header of question ${guard + 1}`).toBe(headers[headers.length - 1]);
      }
    }
    return headers;
  }

  for (const [label, missRate, prior, length] of [
    ['first session, all right', 0, 0, 24],
    ['first session, many misses', 0.5, 0, 24],
    ['fifth session, some misses', 0.25, 4, 24],
    ['tenth session, full, some misses', 0.25, 9, 24],
    ['short length 12, many misses', 0.5, 6, 12],
  ] as const) {
    it(`${label}: one total, no repeated header, never past N of N`, () => {
      for (const seed of [1, 2, 3]) {
        useDrillStore.getState().resetDrillData();
        const headers = play(seed, missRate, prior, length);
        expect(headers.length).toBeGreaterThan(0);
        for (let i = 1; i < headers.length; i++) expect(headers[i], `${headers.join(' | ')}`).not.toBe(headers[i - 1]);
        const totals = new Set(headers.filter((h) => !h.startsWith('extra')).map((h) => h.split(' ')[0].split('/')[1]));
        expect(totals.size, headers.join(' | ')).toBeLessThanOrEqual(1);
        for (const h of headers.filter((x) => !x.startsWith('extra'))) {
          const [n, total] = h.split(' ')[0].split('/').map(Number);
          expect(n).toBeLessThanOrEqual(total);
        }
      }
    });
  }

  it('a perfect first session on default settings reads 1 of 8 … 8 of 8', () => {
    expect(play(7, 0, 0, 24)).toEqual([
      '1/8', '2/8', '3/8', '4/8', '5/8 again', '6/8 again', '7/8 again', '8/8 again',
    ]);
  });
});

describe('sessionCounter — resumed saves and edge cases (seat review 2, 2026-11-09)', () => {
  const BANK: DrillItem[] = generateDrillBank({ includeRead: true });
  const BY_ID = new Map(BANK.map((i) => [i.id, i]));
  const known = (id: string) => BY_ID.has(id);

  beforeEach(() => {
    localStorage.clear();
    useDrillStore.getState().resetDrillData();
  });

  /** Headers from the store's current session to its end, every answer right. */
  function finish(length: number): string[] {
    const headers: string[] = [];
    for (let guard = 0; guard < 100; guard++) {
      const st = useDrillStore.getState();
      const session = st.activeSession!;
      if (session.asked >= length || session.index >= session.queue.length) break;
      let at = session.index;
      while (at < session.queue.length && !known(session.queue[at])) at++;
      if (at >= session.queue.length) break;
      const isNew = (id: string) => st.items[id] === undefined || st.items[id].introSessionId === session.id;
      headers.push(header(sessionCounter(session.queue, at, length, known, isNew, session.seed)));
      st.recordAnswer(BY_ID.get(session.queue[at])!, true, 1500, 1_793_276_000_000 + guard * 1000);
    }
    return headers;
  }

  it('the production v2 save resumes on "4 of 9" (6 facts + 3 second looks) and ends on "9 of 9"', async () => {
    const f = (await import('../../../state/__tests__/fixtures/drill-v2-store.json')).default;
    const { validatePersistedShape } = await import('../../../state/drillStore');
    useDrillStore.setState(validatePersistedShape(f.state)!);
    const headers = finish(useDrillStore.getState().settings.length);
    expect(headers[0]).toBe('4/9');
    expect(headers[headers.length - 1]).toMatch(/^9\/9/);
    expect(headers).toHaveLength(6);
  });

  it('one new fact per session on an empty history: "1 of 1" throughout (no place for a second look)', () => {
    useDrillStore.getState().updateSettings({ ...DEFAULT_SETTINGS, newPerSession: 1 });
    useDrillStore.getState().startSession(BANK, 1_800_000_000_000);
    expect(useDrillStore.getState().activeSession!.queue).toHaveLength(1);
    const st = useDrillStore.getState();
    const id = st.activeSession!.queue[0];
    expect(header(sessionCounter([id], 0, 24, known, () => true, st.activeSession!.seed))).toBe('1/1');
    // Wrong or right, the store finds no place: the header never changes and the session ends.
    st.recordAnswer(BY_ID.get(id)!, false, 1500, 1_800_000_001_000);
    const after = useDrillStore.getState().activeSession!;
    expect(after.queue).toEqual([id]);
    expect(header(sessionCounter(after.queue, 0, 24, known, () => true, after.seed))).toBe('1/1');
  });

  it('planned asks beyond the session length: the total is the length and the count ends on it', () => {
    // 3 new facts, length 4: 6 planned asks, capped at 4; the store stops after 4 answers.
    const isNew = () => true;
    const id = (s: string) => s; // own sibling groups
    const queue = ['A', 'B', 'C', 'A', 'B', 'C'];
    const out = [0, 1, 2, 3].map((at) => header(sessionCounter(queue, at, 4, all, isNew, 1, id)));
    expect(out).toEqual(['1/4', '2/4', '3/4', '4/4 again']);
  });
});
