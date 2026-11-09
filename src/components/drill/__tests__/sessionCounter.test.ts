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
    out.push(header(sessionCounter(queue, at, length, known, isNew, at)));
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
    expect(sessionCounter(['A', 'B', 'C', 'D'], 0, 24, all, isNew, 0).total).toBe(8);
    expect(sessionCounter(['A', 'B', 'C', 'D', 'A'], 1, 24, all, isNew, 1).total).toBe(8);
  });

  it('a miss on a fact already met is an extra: the total stays, the header reads Extra k', () => {
    // Old facts A, B, C; B is missed and comes back; the miss repeats once.
    expect(run(['A', 'B', 'C', 'B', 'B'], 24)).toEqual(['1/3', '2/3', '3/3', 'extra 1 again', 'extra 2 again']);
  });

  it('a full session: a re-ask beyond the plan takes a planned slot and the counter moves on', () => {
    expect(run(['A', 'B', 'A', 'C', 'D'], 4)).toEqual(['1/4', '2/4', '3/4 again', '4/4']);
  });

  it('a new fact whose second look found no slot drops it from the plan, so the count still ends on N of N', () => {
    const isNew = (id: string) => id === 'A' || id === 'B';
    // B's second look was never queued (no slot): after B is answered the plan is 3.
    const q = ['A', 'B', 'A'];
    expect(sessionCounter(q, 1, 24, all, isNew, 1).total).toBe(4); // B not answered yet
    expect(sessionCounter(q, 2, 24, all, isNew, 2)).toMatchObject({ current: 3, total: 3, again: true, extra: 0 });
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
        const c = sessionCounter(session.queue, at, length, (id) => BY_ID.has(id), isNew, session.index);
        headers.push(header(c));
        const correct = rand() >= missRate;
        st.recordAnswer(BY_ID.get(session.queue[at])!, correct, 1500, now + guard * 1000);
        // During feedback the header is the same question's (computed at index − 1).
        const after = useDrillStore.getState();
        const fb = sessionCounter(after.activeSession!.queue, after.activeSession!.index - 1, length, (id) => BY_ID.has(id),
          (id) => after.items[id] === undefined || after.items[id].introSessionId === session.id, after.activeSession!.index);
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
