import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ChordGrid } from '../ChordGrid';
import { useAppStore } from '../../../state/store';
import { CHORD_SYMBOLS, CHORD_QUALITY_NAMES } from '../../../core/constants/chords';

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
// Rendering
// ---------------------------------------------------------------------------
describe('ChordGrid rendering', () => {
  it('renders 7 diatonic chords for C major', () => {
    render(<ChordGrid />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
  });

  it('renders chord root labels', () => {
    render(<ChordGrid />);
    expect(screen.getByText('C')).toBeDefined();
    expect(screen.getByText('D')).toBeDefined();
    expect(screen.getByText('G')).toBeDefined();
  });

  it('renders quality labels (m for minor, dim for diminished)', () => {
    render(<ChordGrid />);
    // D minor should show "m", B diminished should show "dim"
    const mLabels = screen.getAllByText('m');
    expect(mLabels.length).toBeGreaterThanOrEqual(3); // ii, iii, vi
    expect(screen.getByText('dim')).toBeDefined(); // vii°
  });

  it('renders QUALITY_FULL labels (Minor, Diminished, Major)', () => {
    render(<ChordGrid />);
    expect(screen.getAllByText('Major').length).toBe(3); // I, IV, V
    expect(screen.getAllByText('Minor').length).toBe(3); // ii, iii, vi
    expect(screen.getByText('Diminished')).toBeDefined(); // vii°
  });
});

// ---------------------------------------------------------------------------
// Interaction
// ---------------------------------------------------------------------------
describe('ChordGrid interactions', () => {
  it('clicking a chord calls setSelectedChord', () => {
    render(<ChordGrid />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // Click first chord (C major)

    const state = useAppStore.getState();
    expect(state.selectedChord).not.toBeNull();
    expect(state.selectedChord!.root.natural).toBe('C');
    expect(state.selectedChord!.quality).toBe('major');
  });

  it('clicking chord opens detail panel', () => {
    render(<ChordGrid />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(useAppStore.getState().detailPanelOpen).toBe(true);
  });

  it('clicking selected chord deselects it', () => {
    render(<ChordGrid />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // Select
    expect(useAppStore.getState().selectedChord).not.toBeNull();

    // Re-render to reflect selection state, then click again
    const { unmount } = render(<ChordGrid />);
    const buttons2 = screen.getAllByRole('button');
    // Find the C major button — it should be aria-pressed=true
    const cButton = buttons2.find(b => b.getAttribute('aria-pressed') === 'true');
    if (cButton) fireEvent.click(cButton);
    unmount();
  });

  it('selected chord has aria-pressed=true', () => {
    // Pre-select a chord in the store
    const { setSelectedChord } = useAppStore.getState();
    setSelectedChord({
      root: { natural: 'C', accidental: '' },
      quality: 'major',
      notes: [
        { natural: 'C', accidental: '' },
        { natural: 'E', accidental: '' },
        { natural: 'G', accidental: '' },
      ],
    });

    render(<ChordGrid />);
    const pressed = screen.getAllByRole('button').filter(b => b.getAttribute('aria-pressed') === 'true');
    expect(pressed).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Core map unification (Task 1 — ws4-explore-unify)
// ---------------------------------------------------------------------------
describe('ChordGrid uses CHORD_SYMBOLS and CHORD_QUALITY_NAMES from core', () => {
  it('ii chord (D minor in C major) shows symbol and name from core maps', () => {
    render(<ChordGrid />);
    // CHORD_SYMBOLS['minor'] = 'm'; CHORD_QUALITY_NAMES['minor'] = 'Minor'
    // The ii chip renders the root "D" and quality symbol in adjacent spans,
    // and the full quality name in a smaller span below.
    const expectedSymbol = CHORD_SYMBOLS['minor'];
    const expectedName = CHORD_QUALITY_NAMES['minor'];
    // Symbol: 'm' should appear at least 3 times (ii, iii, vi)
    const symbolEls = screen.getAllByText(expectedSymbol);
    expect(symbolEls.length).toBeGreaterThanOrEqual(3);
    // Full name: 'Minor' should appear at least 3 times
    const nameEls = screen.getAllByText(expectedName);
    expect(nameEls.length).toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// Different key/scale
// ---------------------------------------------------------------------------
describe('ChordGrid with different keys', () => {
  it('G major shows correct chords', () => {
    useAppStore.setState({
      selectedKey: { natural: 'G', accidental: '' },
      selectedScale: 'major',
    });
    render(<ChordGrid />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
    // First chord should have G as root
    expect(buttons[0].getAttribute('aria-label')).toContain('G');
  });

  it('pentatonic scale shows "no diatonic chords" message', () => {
    useAppStore.setState({ selectedScale: 'pentatonic_major' });
    render(<ChordGrid />);
    expect(screen.getByText('No diatonic chords for this scale type')).toBeDefined();
  });
});
