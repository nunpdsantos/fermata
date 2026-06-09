import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ScaleDegreeBar } from '../ScaleDegreeBar';
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
    detailPanelOpen: false,
  });
});

// ---------------------------------------------------------------------------
// Scale degree click → diatonic chord selection
// ---------------------------------------------------------------------------
describe('ScaleDegreeBar degree-click wires to diatonic chord', () => {
  it('clicking degree-5 button sets selectedChord to G major (diatonicChords[4])', () => {
    render(<ScaleDegreeBar />);
    // C major degrees: C D E F G A B — degree 5 button label contains "G"
    const buttons = screen.getAllByRole('button');
    // Degree 5 is index 4 (0-based)
    const degree5Button = buttons[4];
    fireEvent.click(degree5Button);

    const state = useAppStore.getState();
    expect(state.selectedChord).not.toBeNull();
    expect(state.selectedChord!.root.natural).toBe('G');
    expect(state.selectedChord!.quality).toBe('major');
  });

  it('when selectedChord matches diatonicChords[4], degree-5 button has aria-pressed=true', () => {
    // Pre-select G major (the V chord in C major)
    const { setSelectedChord } = useAppStore.getState();
    setSelectedChord({
      root: { natural: 'G', accidental: '' },
      quality: 'major',
      notes: [
        { natural: 'G', accidental: '' },
        { natural: 'B', accidental: '' },
        { natural: 'D', accidental: '' },
      ],
    });

    render(<ScaleDegreeBar />);
    const buttons = screen.getAllByRole('button');
    const degree5Button = buttons[4];
    expect(degree5Button.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking the already-active degree clears selectedChord', () => {
    // Pre-select G major
    const { setSelectedChord } = useAppStore.getState();
    setSelectedChord({
      root: { natural: 'G', accidental: '' },
      quality: 'major',
      notes: [
        { natural: 'G', accidental: '' },
        { natural: 'B', accidental: '' },
        { natural: 'D', accidental: '' },
      ],
    });

    render(<ScaleDegreeBar />);
    const buttons = screen.getAllByRole('button');
    const degree5Button = buttons[4];
    // Should be selected
    expect(degree5Button.getAttribute('aria-pressed')).toBe('true');
    // Click to deselect
    fireEvent.click(degree5Button);

    const state = useAppStore.getState();
    expect(state.selectedChord).toBeNull();
  });
});
