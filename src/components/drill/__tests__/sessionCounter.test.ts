import { describe, it, expect } from 'vitest';
import { sessionCounter } from '../sessionCounter';

const all = () => true;

/** The header at every question of a run through `queue` (answered in order). */
function run(queue: string[], length: number, known: (id: string) => boolean = all) {
  const out: string[] = [];
  let asked = 0;
  for (let at = 0; at < queue.length && asked < length; at++) {
    if (!known(queue[at])) continue;
    const c = sessionCounter(queue, at, length, known);
    out.push(`${c.current}/${c.total}${c.again ? ' again' : ''}`);
    asked++;
  }
  return out;
}

describe('sessionCounter — the total never grows (brief 2026-11-09)', () => {
  it('a short session: a re-ask is marked Again and the counter holds', () => {
    // 4 planned facts, length 24; B was missed and comes back, A got its second look.
    expect(run(['A', 'B', 'C', 'B', 'D', 'A'], 24)).toEqual([
      '1/4', '2/4', '3/4', '3/4 again', '4/4', '4/4 again',
    ]);
  });

  it('the observed bug: one miss in a 4-question session no longer reads "1 of 5"', () => {
    const before = sessionCounter(['A', 'B', 'C', 'D'], 0, 24, all);
    const after = sessionCounter(['A', 'B', 'C', 'D', 'A'], 0, 24, all);
    expect(before).toEqual({ current: 1, total: 4, again: false });
    expect(after).toEqual({ current: 1, total: 4, again: false });
  });

  it('a full session: a re-ask takes a planned slot, the counter moves on and ends on N of N', () => {
    // length 4, 4 planned; the miss on A pushes D out of this session (the
    // store stops after `length` answers, as before).
    expect(run(['A', 'B', 'A', 'C', 'D'], 4)).toEqual(['1/4', '2/4', '3/4 again', '4/4']);
  });

  it('room for some re-asks: free ones hold the counter, later ones take a slot', () => {
    // 3 planned, length 4: one spare answer. The first re-ask is free, the second takes C's slot.
    expect(run(['A', 'B', 'A', 'B', 'C'], 4)).toEqual(['1/3', '2/3', '2/3 again', '3/3 again']);
  });

  it('never above the total, never below 1, and the total is fixed while re-asks are inserted', () => {
    const queue = ['A', 'B', 'C', 'D', 'E', 'F'];
    const totals = new Set<number>();
    for (let i = 0; i < 6; i++) {
      queue.splice(i + 2, 0, queue[i]); // every answer is missed once
      const c = sessionCounter(queue, i, 12, all);
      totals.add(c.total);
      expect(c.current).toBeGreaterThanOrEqual(1);
      expect(c.current).toBeLessThanOrEqual(c.total);
    }
    expect([...totals]).toEqual([6]);
  });

  it('ids the bank no longer has are neither counted nor asked', () => {
    const known = (id: string) => id !== 'gone';
    expect(run(['gone', 'A', 'B', 'A'], 24, known)).toEqual(['1/2', '2/2', '2/2 again']);
  });
});
