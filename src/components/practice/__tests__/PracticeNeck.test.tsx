import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PracticeNeck } from '../PracticeNeck';
import { positionWalkPractice, rightHandPractice, scalePractice, type PracticeRoute } from '../practiceModel';
import { practiceNeckLayout } from '../practiceNeckLayout';
import { GUITAR_TUNINGS } from '../../../core/constants/guitarTunings';
import { useAppStore } from '../../../state/store';

const root = { natural: 'C', accidental: '' } as const;
const legacy = { neckNutSide: useAppStore.getState().neckNutSide, neckTopString: useAppStore.getState().neckTopString };
afterEach(() => {
  cleanup();
  useAppStore.setState(legacy);
});
describe('practice passage visibility', () => {
  it.each(['scales', 'right hand'])('%s shows upcoming fret 1 in the passage, with the nut beside fret 1', (tab) => {
    const tuning = GUITAR_TUNINGS[0];
    const route = tab === 'scales' ? scalePractice(root, 'major', tuning, 2, 'im')! : rightHandPractice(root, 'major', tuning, 'p-i-m-a')!;
    expect(route).not.toBeNull();
    const index = Math.max(0, route.events.findIndex((e) => e.notes.some((n) => n.fret === 1)) - 4);
    const { container } = render(<PracticeNeck route={route} index={index} tuning={tuning} fingerFor={(_, n) => n.finger}
      edited={() => false} onNote={() => {}} />);
    const passage = route.events.slice(Math.max(0, index - 3), index + 5).flatMap((e) => e.notes);
    expect(passage.some((n) => n.fret === 1)).toBe(true);
    for (const note of passage) {
      expect(container.querySelector(`[data-dot-string="${note.stringIndex}"][data-dot-fret="${note.fret}"]`), `string ${note.stringIndex}, fret ${note.fret}`).not.toBeNull();
    }
    const row = [...container.querySelectorAll('[data-string-row="0"]')];
    expect(row.at(-1)?.getAttribute('data-fret')).toBe('1');
  });
});

// 2026-11-13: the practice neck drew no fret lines; the dock's neck does
// (Fretboard.tsx, an overlay over the string rows). The practice neck now
// draws them the same way: one 1 px `--border` line per drawn fret, on that
// fret's nut side, inset like the cells — the name gutter (32) on the far
// side; the nut (6) + open column (40) + the break (24, only when the window
// starts above fret 1) on the nut side. The browser measures the result
// (e2e/guitar-practice.spec.ts); this pins the structure.
describe('fret wires', () => {
  const tuning = GUITAR_TUNINGS[0];
  const scale = scalePractice(root, 'major', tuning, 2, 'im')!;
  const walk = positionWalkPractice(root, 'major', tuning)!;
  const higher = walk.events.findIndex((_, i) => practiceNeckLayout(walk, i).low > 1);
  const windows: [string, PracticeRoute, number][] = [['from fret 1', scale, 0], ['above fret 1', walk, higher]];
  const sides = [['right', 'low'], ['left', 'high'], ['right', 'high'], ['left', 'low']] as const;

  it('both windows exist: one from fret 1, one that starts higher', () => {
    expect(practiceNeckLayout(scale, 0).low).toBe(1);
    expect(higher).toBeGreaterThan(0);
  });

  describe.each(sides)('nut %s, %s string on top', (nut, top) => {
    it.each(windows)('window %s: one wire per drawn fret, on its nut side, inset like the cells', (_, route, index) => {
      act(() => useAppStore.setState({ neckNutSide: nut, neckTopString: top }));
      const { container } = render(<PracticeNeck route={route} index={index} tuning={tuning} fingerFor={(_e, n) => n.finger}
        edited={() => false} onNote={() => {}} />);
      const { low } = practiceNeckLayout(route, index);
      const wires = container.querySelector<HTMLElement>('[data-fret-wires]')!;
      expect(wires).not.toBeNull();
      // Never in the way: hidden from screen readers, never the target of a tap.
      expect(wires.getAttribute('aria-hidden')).toBe('true');
      expect(wires.classList.contains('pointer-events-none')).toBe(true);
      expect([...wires.classList]).toEqual(expect.arrayContaining(['absolute', 'inset-y-0', 'flex']));
      // Over the six string rows, in a wrapper that adds no size.
      const wrapper = wires.parentElement!;
      const rows = [...wrapper.querySelectorAll(':scope > [data-dock-row="string"]')];
      expect(rows).toHaveLength(6);
      expect(wrapper.children).toHaveLength(7);
      expect(wrapper.className).toBe('relative');
      expect(wrapper.getAttribute('style')).toBeNull();
      // One wire per drawn fret (the cells of every row, the numbers above).
      const header = container.querySelector<HTMLElement>('.practice-neck > .flex.text-caption')!;
      expect(wires.children).toHaveLength(header.children.length);
      for (const row of rows) expect(row.querySelectorAll('[data-fret]')).toHaveLength(wires.children.length);
      // Each wire on its fret's nut side, 1 px of the dock's colour token.
      for (const wire of [...wires.children] as HTMLElement[]) {
        expect(wire.className).toBe('flex-1');
        expect(nut === 'left' ? wire.style.borderLeft : wire.style.borderRight).toBe('1px solid var(--border)');
        expect(nut === 'left' ? wire.style.borderRight : wire.style.borderLeft).toBe('');
      }
      // Inset: the name gutter on the far side; nut + open column, and the
      // break exactly when the window starts above fret 1, on the nut side —
      // the same numbers the fret-number row is padded by.
      const hasBreak = low > 1;
      expect(container.querySelectorAll('[data-fret-break]')).toHaveLength(hasBreak ? 6 : 0);
      const nutInset = `${46 + (hasBreak ? 24 : 0)}px`;
      expect(nut === 'left' ? wires.style.left : wires.style.right).toBe(nutInset);
      expect(nut === 'left' ? wires.style.right : wires.style.left).toBe('32px');
      expect(nut === 'left' ? header.style.paddingLeft : header.style.paddingRight).toBe(nutInset);
      expect(nut === 'left' ? header.style.paddingRight : header.style.paddingLeft).toBe('32px');
    });
  });
});
