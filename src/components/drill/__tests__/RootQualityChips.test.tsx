import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, within } from '@testing-library/react';
import { RootQualityChips } from '../RootQualityChips';
import type { ChordQuality } from '../../../core/types/music';

afterEach(cleanup);

// Memoized framer mock — stable component identity (see NoteChips.test.tsx).
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

const ROOTS = ['D', 'F', 'A'];
const QUALITIES: ChordQuality[] = ['major', 'minor', 'diminished', 'augmented'];

function rootGroup() {
  return screen.getByRole('group', { name: 'root' });
}

describe('RootQualityChips', () => {
  it('shows root chips first and reveals qualities only after a root is chosen', () => {
    render(
      <RootQualityChips roots={ROOTS} qualities={QUALITIES} disabled={false} onAnswer={() => {}} />,
    );
    // Root group present; quality group not yet.
    expect(rootGroup()).toBeDefined();
    expect(screen.queryByRole('group', { name: 'quality' })).toBeNull();

    act(() => fireEvent.click(within(rootGroup()).getByRole('button', { name: 'D' })));
    expect(screen.getByRole('group', { name: 'quality' })).toBeDefined();
    // Quality labels come from CHORD_QUALITY_NAMES.
    expect(screen.getByRole('button', { name: 'Minor' })).toBeDefined();
  });

  it('fires onAnswer on the quality tap with the chosen root + quality', () => {
    const onAnswer = vi.fn();
    render(
      <RootQualityChips roots={ROOTS} qualities={QUALITIES} disabled={false} onAnswer={onAnswer} />,
    );
    act(() => fireEvent.click(within(rootGroup()).getByRole('button', { name: 'D' })));
    expect(onAnswer).not.toHaveBeenCalled(); // root alone does not grade
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Minor' })));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith({ root: 'D', quality: 'minor' });
  });

  it('lets a different root be chosen before a quality (re-selects root)', () => {
    const onAnswer = vi.fn();
    render(
      <RootQualityChips roots={ROOTS} qualities={QUALITIES} disabled={false} onAnswer={onAnswer} />,
    );
    act(() => fireEvent.click(within(rootGroup()).getByRole('button', { name: 'D' })));
    act(() => fireEvent.click(within(rootGroup()).getByRole('button', { name: 'F' }))); // change mind
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Major' })));
    expect(onAnswer).toHaveBeenCalledWith({ root: 'F', quality: 'major' });
  });

  it('does not re-fire on a second quality tap (guarded)', () => {
    const onAnswer = vi.fn();
    render(
      <RootQualityChips roots={ROOTS} qualities={QUALITIES} disabled={false} onAnswer={onAnswer} />,
    );
    act(() => fireEvent.click(within(rootGroup()).getByRole('button', { name: 'A' })));
    const minor = screen.getByRole('button', { name: 'Minor' });
    act(() => fireEvent.click(minor));
    act(() => fireEvent.click(minor));
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });

  it('does nothing when disabled (feedback phase)', () => {
    const onAnswer = vi.fn();
    render(
      <RootQualityChips
        roots={ROOTS}
        qualities={QUALITIES}
        disabled
        onAnswer={onAnswer}
        feedback={{ correctRoot: 'D', correctQuality: 'minor' }}
      />,
    );
    act(() => fireEvent.click(within(rootGroup()).getByRole('button', { name: 'D' })));
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it('highlights the correct root + quality green during feedback', () => {
    render(
      <RootQualityChips
        roots={ROOTS}
        qualities={QUALITIES}
        disabled
        onAnswer={() => {}}
        feedback={{ correctRoot: 'D', correctQuality: 'minor' }}
      />,
    );
    expect(within(rootGroup()).getByRole('button', { name: 'D' }).className).toMatch(/emerald/);
    expect(screen.getByRole('button', { name: 'Minor' }).className).toMatch(/emerald/);
    expect(screen.getByRole('button', { name: 'Major' }).className).not.toMatch(/emerald/);
  });
});
