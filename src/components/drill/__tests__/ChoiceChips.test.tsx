import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { ChoiceChips } from '../ChoiceChips';

afterEach(cleanup);

// Mock framer-motion to plain elements (mirrors sibling view tests).
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  function makeMotion(tag: string) {
    return function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
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

const CHOICES = ['Tonic', 'Dominant', 'Mediant', 'Subdominant'];

describe('ChoiceChips', () => {
  it('renders all choices as buttons in a group', () => {
    render(
      <ChoiceChips choices={CHOICES} disabled={false} selected={null} correctChoice={null} onSelect={() => {}} />,
    );
    expect(screen.getByRole('group')).toBeDefined();
    for (const c of CHOICES) {
      expect(screen.getByRole('button', { name: c })).toBeDefined();
    }
  });

  it('fires onSelect exactly once even on a rapid double-tap (guarded)', () => {
    const onSelect = vi.fn();
    render(
      <ChoiceChips choices={CHOICES} disabled={false} selected={null} correctChoice={null} onSelect={onSelect} />,
    );
    const btn = screen.getByRole('button', { name: 'Tonic' });
    fireEvent.click(btn);
    fireEvent.click(btn); // double fire before any disable propagates
    fireEvent.click(screen.getByRole('button', { name: 'Dominant' })); // different chip too
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('Tonic');
  });

  it('does not fire onSelect when disabled (feedback phase)', () => {
    const onSelect = vi.fn();
    render(
      <ChoiceChips choices={CHOICES} disabled selected="Tonic" correctChoice="Tonic" onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Dominant' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Dominant' })).toHaveProperty('disabled', true);
  });

  it('applies success styling to the correct chip and error styling to the wrong tapped chip during feedback', () => {
    render(
      <ChoiceChips
        choices={CHOICES}
        disabled
        selected="Dominant"
        correctChoice="Tonic"
        onSelect={() => {}}
      />,
    );
    const correct = screen.getByRole('button', { name: 'Tonic' });
    const wrong = screen.getByRole('button', { name: 'Dominant' });
    expect(correct.className).toMatch(/emerald/);
    expect(wrong.className).toMatch(/red/);
    // An untouched, non-correct chip carries neither state class.
    const untouched = screen.getByRole('button', { name: 'Mediant' });
    expect(untouched.className).not.toMatch(/emerald|red/);
  });
});
