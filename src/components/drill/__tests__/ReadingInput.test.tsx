import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { DrillInput } from '../DrillInput';
import { gradeAnswer, type GradeResult } from '../grading';
import { genRead } from '../../../core/utils/drillBank/genRead';
import { useAppStore } from '../../../state/store';
import type { ReadDrillItem } from '../../../core/types/drill';

const READ = genRead();
const item = (id: string) => READ.find((i) => i.id === id)!;
afterEach(cleanup);

function Harness({ question, onGrade = () => {} }: { question: ReadDrillItem; onGrade?: (r: GradeResult) => void }) {
  const [result, setResult] = useState<GradeResult | null>(null);
  return <DrillInput item={question} phase={result ? 'feedback' : 'answering'} onAnswer={(payload) => {
    const grade = gradeAnswer(question, payload);
    onGrade(grade);
    setResult(grade);
  }} />;
}

async function board(question: ReadDrillItem, onGrade = vi.fn()) {
  render(<Harness question={question} onGrade={onGrade} />);
  await screen.findByTestId('reading-board');
  return onGrade;
}
const cell = (stringIndex: number, fret: number) => document.querySelector<HTMLElement>(`[data-string-row="${stringIndex}"][data-fret="${fret}"]`)!;

describe('reading input', () => {
  it('has no note/answer dots or pitch labels before a tap, independently of Explore', async () => {
    useAppStore.setState({ guitarTuningId: 'drop-d', guitarScalePosition: 9, instrument: 'piano' });
    const before = useAppStore.getState();
    await board(item('read:staff-to-fret:open:C5'));
    expect(document.querySelector('[data-dot], [data-answer]')).toBeNull();
    expect(cell(4, 1).getAttribute('aria-label')).toBe('String 2, fret 1');
    expect(screen.getByTestId('reading-board').textContent).not.toMatch(/[A-G][♯♭]?[0-9]/);
    expect(useAppStore.getState()).toBe(before);
  });

  it('a wrong tap grades once, marks the tried place and every accepted place, and locks the board', async () => {
    const q = item('read:staff-to-fret:any:C5');
    const onGrade = await board(q);
    fireEvent.pointerDown(cell(0, 1), { pointerType: 'touch', button: 0 });
    fireEvent.click(cell(0, 1));
    expect(onGrade).toHaveBeenCalledExactlyOnceWith({ correct: false, nearMiss: false });
    expect(cell(0, 1).dataset.answer).toBe('wrong');
    for (const p of q.answer.accepted) expect(cell(p.stringIndex, p.fret).dataset.answer).toBe('correct');
    expect(document.querySelectorAll('[data-answer="correct"]')).toHaveLength(q.answer.accepted.length);
    fireEvent.click(cell(4, 1));
    expect(onGrade).toHaveBeenCalledTimes(1);
    expect(cell(4, 1).getAttribute('aria-disabled')).toBe('true');
  });

  it.each([
    ['correct pitch', 4, 1, true, false],
    ['octave below', 1, 3, false, true],
  ] as const)('%s uses exact-pitch grading', async (_label, stringIndex, fret, correct, nearMiss) => {
    const onGrade = await board(item('read:staff-to-fret:open:C5'));
    fireEvent.click(cell(stringIndex, fret));
    expect(onGrade).toHaveBeenCalledWith({ correct, nearMiss });
  });

  it('offers stretch frets without revealing which one the note needs', async () => {
    const q = READ.find((i) => i.input.position === 5 && i.answer.accepted.some((p) => p.fret === 4 || p.fret === 9))!;
    const onGrade = await board(q);
    expect([...screen.getByTestId('reading-board').querySelectorAll('[data-string-row="0"]')].map((c) => Number((c as HTMLElement).dataset.fret))).toEqual([9, 8, 7, 6, 5, 4, 0]);
    const p = q.answer.accepted[0];
    fireEvent.click(cell(p.stringIndex, p.fret));
    expect(onGrade).toHaveBeenCalledWith({ correct: true, nearMiss: false });
  });

  it('marks omitted frets between each position row and its nut', async () => {
    await board(item('read:staff-to-fret:V:E4'));
    const breaks = screen.getByTestId('reading-board').querySelectorAll('[data-fret-break]');
    expect(breaks).toHaveLength(6);
    for (const gap of breaks) {
      expect(gap.textContent).toBe('//');
      expect(gap.previousElementSibling?.querySelector('[data-fret]')?.getAttribute('data-fret')).toBe('4');
      expect(gap.nextElementSibling?.querySelector('[data-fret]')?.getAttribute('data-fret')).toBe('0');
    }
  });

  it.each([...new Set(READ.map((q) => q.input.position))])('keeps nut geography explicit for reading stage %s', async (position) => {
    const q = READ.find((entry) => entry.input.position === position)!;
    await board(q);
    for (let string = 0; string < 6; string++) {
      const open = cell(string, 0).parentElement!;
      const adjacent = open.previousElementSibling!;
      if (adjacent.hasAttribute('data-fret-break')) {
        expect(adjacent.textContent).toBe('//');
        expect((adjacent as HTMLElement).style.width).toBe('24px');
        expect((adjacent as HTMLElement).style.flexShrink).toBe('0');
      } else {
        expect(adjacent.querySelector('[data-fret]')?.getAttribute('data-fret')).toBe('1');
      }
    }
  });

  it('outside-position exact pitches are near misses and the correct window is revealed', async () => {
    const q = item('read:staff-to-fret:V:E4'); // E3: string 6 fret 12, outside V
    expect(gradeAnswer(q, { format: 'fretboard', stringIndex: 0, fret: 12 })).toEqual({ correct: false, nearMiss: true });
  });

  it('keyboard arrows follow the mirrored neck and reach the open strings; Enter submits', async () => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    const onGrade = await board(item('read:staff-to-fret:open:E3'));
    cell(0, 1).focus();
    fireEvent.keyDown(cell(0, 1), { key: 'ArrowRight' });
    await waitFor(() => expect(document.activeElement).toBe(cell(0, 0)));
    fireEvent.keyDown(cell(0, 0), { key: 'Enter' });
    expect(onGrade).toHaveBeenCalledWith({ correct: true, nearMiss: false });

  });
});
