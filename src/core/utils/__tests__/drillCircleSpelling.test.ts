/**
 * Audit W1-04 (D-1) — Drill's "a perfect fifth up/down" answers are spelled
 * as perfect fifths. Pre-fix, a P5 up from F♯ was graded D♭ (a diminished
 * 6th) with C♯ not even offered, and a P5 down from D♭ was graded F♯.
 * Every fifth-up / fifth-down item is checked against the oracle.
 */
import { describe, it, expect } from 'vitest';
import { genCircle } from '../drillBank/genCircle';
import { spellDegree } from './theoryOracle';

const ascii = (display: string) => display.replace(/♯/g, '#').replace(/♭/g, 'b');

describe('W1-04 — circle-of-fifths drill items are spelled as perfect fifths', () => {
  const items = genCircle();
  const fifthItems = items.filter((i) => i.id.startsWith('circle:fifth-'));

  it('covers all 24 fifth-up / fifth-down items', () => {
    expect(fifthItems).toHaveLength(24);
  });

  it.each(fifthItems.map((i) => [i.id, i] as const))('%s', (_id, item) => {
    const from = ascii(String(item.promptParams.note));
    // P5 up = degree 5 above; P5 down lands on the letter of a 4th above (same pitch class).
    const want = item.id.startsWith('circle:fifth-up') ? spellDegree(from, '5') : spellDegree(from, '4');
    if (item.answer.kind !== 'choice') throw new Error('expected a choice item');
    const correct = item.answer.correct;
    expect(ascii(correct)).toBe(want);
    if (item.input.format !== 'choice') throw new Error('expected choices');
    expect(item.input.choices.map(ascii)).toContain(want);
    // the answer is offered exactly once
    expect(item.input.choices.filter((c) => c !== correct).map(ascii)).not.toContain(want);
  });

  it('F# up a fifth is C#; Db down a fifth is Gb', () => {
    const byId = new Map(items.map((i) => [i.id, i]));
    expect(byId.get('circle:fifth-up:F#')?.answer).toEqual({ kind: 'choice', correct: 'C♯' });
    expect(byId.get('circle:fifth-down:Db')?.answer).toEqual({ kind: 'choice', correct: 'G♭' });
  });
});
