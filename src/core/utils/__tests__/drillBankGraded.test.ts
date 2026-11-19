/**
 * Translating the Drill never touches what is graded (audit A12, 2026-11-18).
 *
 * The bank keeps English strings as grading values: a chip submits its raw
 * value, never its translated label, and the answer is compared with that.
 * Saved schedules (`fermata-drill-v1`) are keyed by item id. So every item
 * keeps its id, its answer spec and its input spec (the values the chips,
 * note chips, slots, roots / qualities and the fretboard submit) exactly as
 * they were at 6de6c0e (fixtures/drill-bank-graded-6de6c0e.json, recorded
 * from that commit before any A12 change; RECORD_DRILL_GRADED=1 re-records,
 * for a deliberate change only).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateDrillBank } from '../drillBank';

const FIXTURE = resolve(process.cwd(), 'src/core/utils/__tests__/fixtures/drill-bank-graded-6de6c0e.json');

interface Graded {
  id: string;
  family: string;
  input: unknown;
  answer: unknown;
}

function graded(): Graded[] {
  return generateDrillBank({ includeRead: true }).map((i) => ({ id: i.id, family: i.family, input: i.input, answer: i.answer }));
}

if (process.env.RECORD_DRILL_GRADED) writeFileSync(FIXTURE, `${JSON.stringify(graded())}\n`);
const BASE = JSON.parse(readFileSync(FIXTURE, 'utf8')) as Graded[];

describe('the graded bank equals 6de6c0e', () => {
  it('the same 1,615 ids, in the same order', () => {
    expect(BASE.length).toBe(1615);
    expect(graded().map((g) => g.id)).toEqual(BASE.map((g) => g.id));
  });

  it('every item keeps its family, its graded answer and the values its input submits', () => {
    const now = new Map(graded().map((g) => [g.id, g]));
    const changed = BASE.filter((b) => JSON.stringify(now.get(b.id)) !== JSON.stringify(b)).map((b) => b.id);
    expect(changed).toEqual([]);
  });

  it('the comparison can fail (a changed answer is caught)', () => {
    const doctored = graded();
    const target = doctored.find((g) => g.id === 'interval:pair-to-name:C:E')!;
    target.answer = { kind: 'choice', correct: '3.ª maior' };
    expect(JSON.stringify(doctored)).not.toBe(JSON.stringify(BASE));
  });
});
