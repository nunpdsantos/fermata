import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { AccidentalSlots } from '../AccidentalSlots';
import type { NaturalNote } from '../../../core/types/music';

afterEach(cleanup);

// Memoized framer mock — stable component identity so local slot state survives
// re-renders (see NoteChips.test.tsx for the rationale).
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

const A_MAJOR_LETTERS: NaturalNote[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

describe('AccidentalSlots', () => {
  it('renders 7 slots pre-filled natural plus a Done button', () => {
    render(
      <AccidentalSlots letters={A_MAJOR_LETTERS} disabled={false} onAnswer={() => {}} />,
    );
    expect(screen.getByRole('group')).toBeDefined();
    // Each slot shows its letter with a natural glyph initially.
    for (const l of A_MAJOR_LETTERS) {
      expect(screen.getByRole('button', { name: `${l}♮` })).toBeDefined();
    }
    expect(screen.getByRole('button', { name: 'Done' })).toBeDefined();
  });

  it('cycles a slot ♮ → ♯ → ♭ → ♮ on successive taps', () => {
    render(
      <AccidentalSlots letters={A_MAJOR_LETTERS} disabled={false} onAnswer={() => {}} />,
    );
    // Slot C: natural → sharp.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C♮' })));
    expect(screen.getByRole('button', { name: 'C♯' })).toBeDefined();
    // sharp → flat.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C♯' })));
    expect(screen.getByRole('button', { name: 'C♭' })).toBeDefined();
    // flat → natural.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C♭' })));
    expect(screen.getByRole('button', { name: 'C♮' })).toBeDefined();
  });

  it('Done grades the current spelling (display strings, natural drops the glyph)', () => {
    const onAnswer = vi.fn();
    render(
      <AccidentalSlots letters={A_MAJOR_LETTERS} disabled={false} onAnswer={onAnswer} />,
    );
    // Set C, F, G to sharp → A major spelling A B C♯ D E F♯ G♯.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C♮' }))); // C♯
    act(() => fireEvent.click(screen.getByRole('button', { name: 'F♮' }))); // F♯
    act(() => fireEvent.click(screen.getByRole('button', { name: 'G♮' }))); // G♯
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Done' })));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯']);
  });

  it('does not re-fire on a second Done tap (guarded)', () => {
    const onAnswer = vi.fn();
    render(
      <AccidentalSlots letters={A_MAJOR_LETTERS} disabled={false} onAnswer={onAnswer} />,
    );
    const done = screen.getByRole('button', { name: 'Done' });
    act(() => fireEvent.click(done));
    act(() => fireEvent.click(done));
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });

  it('hides Done and ignores taps during feedback (disabled)', () => {
    const onAnswer = vi.fn();
    render(
      <AccidentalSlots
        letters={A_MAJOR_LETTERS}
        disabled
        onAnswer={onAnswer}
        feedback={{ correctSpelled: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Done' })).toBeNull();
    // A slot tap during feedback does nothing.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C♮' })));
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it('highlights correct slots green and incorrect slots red during feedback', () => {
    render(
      <AccidentalSlots
        letters={A_MAJOR_LETTERS}
        disabled
        onAnswer={() => {}}
        feedback={{ correctSpelled: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] }}
      />,
    );
    // All slots are natural (the learner submitted naturals), so A/B/D/E are
    // correct (green) and C/F/G are wrong (red — they should be sharp).
    expect(screen.getByRole('button', { name: 'A♮' }).className).toMatch(/emerald/);
    expect(screen.getByRole('button', { name: 'C♮' }).className).toMatch(/red/);
    expect(screen.getByRole('button', { name: 'F♮' }).className).toMatch(/red/);
  });
});
