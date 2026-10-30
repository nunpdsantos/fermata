import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { KeySelector } from '../KeySelector';
import { useAppStore } from '../../../state/store';

afterEach(cleanup);

// Mock framer-motion to render plain HTML elements
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
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    selectedDegree: null,
    chordInversion: 0,
    guitarScalePosition: null,
  });
});

// ---------------------------------------------------------------------------
// Root note rendering
// ---------------------------------------------------------------------------
describe('KeySelector root notes', () => {
  it('renders 12 root note buttons', () => {
    render(<KeySelector />);
    // 12 root notes: C, C#, D, Eb, E, F, F#, G, Ab, A, Bb, B
    const rootLabels = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    for (const label of rootLabels) {
      expect(screen.getByText(label)).toBeDefined();
    }
  });

  it('clicking a root changes the selected key', () => {
    render(<KeySelector />);
    fireEvent.click(screen.getByText('G'));
    const state = useAppStore.getState();
    expect(state.selectedKey).toEqual({ natural: 'G', accidental: '' });
  });

  it('clicking C# sets accidental correctly', () => {
    render(<KeySelector />);
    fireEvent.click(screen.getByText('C#'));
    const state = useAppStore.getState();
    expect(state.selectedKey).toEqual({ natural: 'C', accidental: '#' });
  });

  it('clicking Eb sets flat accidental', () => {
    render(<KeySelector />);
    fireEvent.click(screen.getByText('Eb'));
    const state = useAppStore.getState();
    expect(state.selectedKey).toEqual({ natural: 'E', accidental: 'b' });
  });
});

// ---------------------------------------------------------------------------
// Scale type rendering
// ---------------------------------------------------------------------------
describe('KeySelector scale types', () => {
  it('renders core scale options (Major, Minor)', () => {
    render(<KeySelector />);
    expect(screen.getByText('Major')).toBeDefined();
    expect(screen.getByText('Minor')).toBeDefined();
  });

  it('clicking a scale type changes the selected scale', () => {
    render(<KeySelector />);
    fireEvent.click(screen.getByText('Minor'));
    expect(useAppStore.getState().selectedScale).toBe('natural_minor');
  });

  it('active scale has aria-pressed=true', () => {
    render(<KeySelector />);
    const majorButton = screen.getByText('Major').closest('button')!;
    expect(majorButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('renders "More scales" toggle button', () => {
    render(<KeySelector />);
    expect(screen.getByText(/More scales/)).toBeDefined();
  });

  it('clicking "More scales" shows additional groups', () => {
    render(<KeySelector />);
    fireEvent.click(screen.getByText(/More scales/));
    // After expanding, world scales should be visible
    expect(screen.getByText('Persian')).toBeDefined();
    expect(screen.getByText('Hirajoshi')).toBeDefined();
  });

  it('auto-expands when selected scale is in a hidden group', () => {
    useAppStore.setState({ selectedScale: 'persian' });
    render(<KeySelector />);
    // Persian is in the World group — should auto-expand
    expect(screen.getByText('Persian')).toBeDefined();
  });

  it('does not group Phrygian Dominant (harmonic-minor mode 5) with the melodic-minor modes (audit W5-45)', () => {
    render(<KeySelector />);
    fireEvent.click(screen.getByText(/More scales/));
    const groupOf = (scale: string) =>
      document.querySelector(`[data-scale="${scale}"]`)?.parentElement ?? null;
    const melodicMinorGroup = groupOf('altered');
    expect(melodicMinorGroup).not.toBeNull();
    // Every melodic-minor mode shares one group…
    for (const s of ['lydian_dominant', 'locrian_natural2', 'dorian_b2', 'lydian_augmented', 'mixolydian_b6']) {
      expect(groupOf(s)).toBe(melodicMinorGroup);
    }
    // …and Phrygian Dominant is not in it.
    expect(groupOf('phrygian_dominant')).not.toBeNull();
    expect(groupOf('phrygian_dominant')).not.toBe(melodicMinorGroup);
  });
});
