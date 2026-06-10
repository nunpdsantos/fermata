import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { NoteChips } from '../NoteChips';

afterEach(cleanup);

// Mock framer-motion to plain elements. The component TYPE per tag must be
// stable across renders — a fresh proxy function each render would remount the
// button and reset its local selection state (which these tests assert on).
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  function makeMotion(tag: string) {
    const cached = cache.get(tag);
    if (cached) return cached;
    const Comp = function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
    cache.set(tag, Comp);
    return Comp;
  }
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    motion: proxy,
    m: proxy,
    useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

// Chips for F♯ minor (A C♯ F♯) plus distractors.
const CHIPS = ['A', 'C♯', 'F♯', 'C', 'D♭', 'G♭'];

describe('NoteChips', () => {
  it('renders all chips as buttons in a group', () => {
    render(
      <NoteChips chips={CHIPS} expectedCount={3} disabled={false} onAnswer={() => {}} />,
    );
    expect(screen.getByRole('group')).toBeDefined();
    for (const c of CHIPS) {
      expect(screen.getByRole('button', { name: c })).toBeDefined();
    }
  });

  it('fires onAnswer once with the selected display strings at expectedCount', () => {
    const onAnswer = vi.fn();
    render(
      <NoteChips chips={CHIPS} expectedCount={3} disabled={false} onAnswer={onAnswer} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    fireEvent.click(screen.getByRole('button', { name: 'C♯' }));
    expect(onAnswer).not.toHaveBeenCalled(); // only 2 selected
    fireEvent.click(screen.getByRole('button', { name: 'F♯' }));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(['A', 'C♯', 'F♯']);
  });

  it('does not fire again after reaching the count (guarded against extra taps)', () => {
    const onAnswer = vi.fn();
    render(
      <NoteChips chips={CHIPS} expectedCount={3} disabled={false} onAnswer={onAnswer} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    fireEvent.click(screen.getByRole('button', { name: 'C♯' }));
    fireEvent.click(screen.getByRole('button', { name: 'F♯' }));
    // A 4th tap must not re-fire.
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });

  it('toggles a chip off when tapped twice (selection is multi-select)', () => {
    const onAnswer = vi.fn();
    render(
      <NoteChips chips={CHIPS} expectedCount={3} disabled={false} onAnswer={onAnswer} />,
    );
    const a = screen.getByRole('button', { name: 'A' });
    act(() => fireEvent.click(a)); // select
    expect(a.getAttribute('aria-pressed')).toBe('true');
    act(() => fireEvent.click(a)); // deselect
    expect(a.getAttribute('aria-pressed')).toBe('false');
    // Now selecting three OTHER chips still fires once with those three.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C♯' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'F♯' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C' })));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(['C♯', 'F♯', 'C']);
  });

  it('Clear button resets the in-progress selection', () => {
    render(
      <NoteChips chips={CHIPS} expectedCount={3} disabled={false} onAnswer={() => {}} />,
    );
    const a = screen.getByRole('button', { name: 'A' });
    act(() => fireEvent.click(a));
    expect(a.getAttribute('aria-pressed')).toBe('true');
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Clear' })));
    expect(a.getAttribute('aria-pressed')).toBe('false');
  });

  it('does not fire onAnswer when disabled (feedback phase)', () => {
    const onAnswer = vi.fn();
    render(
      <NoteChips
        chips={CHIPS}
        expectedCount={3}
        disabled
        onAnswer={onAnswer}
        feedback={{ correctNotes: ['A', 'C#', 'F#'] }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it('highlights the correct chips green during feedback (matched by pitch spelling)', () => {
    render(
      <NoteChips
        chips={CHIPS}
        expectedCount={3}
        disabled
        onAnswer={() => {}}
        feedback={{ correctNotes: ['A', 'C#', 'F#'] }}
      />,
    );
    // The correct chips carry the emerald success class.
    const fsharp = screen.getByRole('button', { name: 'F♯' });
    expect(fsharp.className).toMatch(/emerald/);
    const dflat = screen.getByRole('button', { name: 'D♭' });
    expect(dflat.className).not.toMatch(/emerald/);
  });

  it('shows amber on a selected chip that is enharmonic to the correct answer (F♯m: G♭ selected, F♯ correct)', () => {
    // CHIPS includes both 'F♯' and 'G♭'. Correct answer is F#. If the user
    // selects G♭ (same pitch class, wrong spelling), it should be amber — not red.
    //
    // The component keeps its selected state across re-renders (only remounts on a
    // new item id). So we: (1) render interactive, select G♭ + A (2 of 3), then
    // (2) re-render the same instance with disabled=true + feedback to enter the
    // feedback phase while the selection is still [G♭, A].
    const { rerender } = render(
      <NoteChips chips={CHIPS} expectedCount={3} disabled={false} onAnswer={() => {}} />,
    );
    // Select G♭ and A (only 2 of 3, so onAnswer never fires — selection stays).
    act(() => fireEvent.click(screen.getByRole('button', { name: 'G♭' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'A' })));
    // Transition to feedback phase: parent sets disabled + provides correctNotes.
    rerender(
      <NoteChips
        chips={CHIPS}
        expectedCount={3}
        disabled
        onAnswer={() => {}}
        feedback={{ correctNotes: ['F#', 'A', 'C#'] }}
      />,
    );
    // G♭ is selected and has same pc as F♯ (pc 6) but wrong spelling → amber.
    const gflat = screen.getByRole('button', { name: 'G♭' });
    expect(gflat.className).toMatch(/amber/);
    expect(gflat.className).not.toMatch(/red/);
    // A is selected and is in the correct set → emerald.
    const a = screen.getByRole('button', { name: 'A' });
    expect(a.className).toMatch(/emerald/);
    // F♯ is correct and not selected → still emerald (showCorrect fires for all correct).
    const fsharp = screen.getByRole('button', { name: 'F♯' });
    expect(fsharp.className).toMatch(/emerald/);
  });

  it('shows red on a selected chip that is a genuine pitch-class mismatch', () => {
    // C (pc 0) is not enharmonic to any note in {F#=6, A=9, C#=1}.
    // Select C and D♭ (only 2), then enter feedback.
    const { rerender } = render(
      <NoteChips chips={CHIPS} expectedCount={3} disabled={false} onAnswer={() => {}} />,
    );
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C' })));
    rerender(
      <NoteChips
        chips={CHIPS}
        expectedCount={3}
        disabled
        onAnswer={() => {}}
        feedback={{ correctNotes: ['F#', 'A', 'C#'] }}
      />,
    );
    // C (pc 0) is selected, not in correct set, and not enharmonic to any correct note → red.
    const c = screen.getByRole('button', { name: 'C' });
    expect(c.className).toMatch(/red/);
    expect(c.className).not.toMatch(/amber/);
  });
});
