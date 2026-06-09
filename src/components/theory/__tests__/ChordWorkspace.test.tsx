import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ChordWorkspace } from '../ChordWorkspace';
import { useAppStore } from '../../../state/store';
import { buildChord } from '../../../core/constants/chords';

afterEach(cleanup);

// Mock framer-motion to render plain HTML elements (mirrors sibling tests).
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

// Mock the lazy-loaded StaffNotation so VexFlow never loads in jsdom. The
// component lazy-imports it via `import('../notation/StaffNotation.tsx')` then
// reads `m.StaffNotation`; we provide a trivial named export with a testid we
// can await to flush the Suspense boundary deterministically.
vi.mock('../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return {
    StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }),
  };
});

// C major chord for the "selected chord" cases.
const cMajor = buildChord({ natural: 'C', accidental: '' }, 'major');

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    selectedDegree: null,
    chordInversion: 0,
    detailPanelOpen: false,
    synthPreset: 'piano',
    baseOctave: 4,
  });
});

describe('ChordWorkspace — mode tabs', () => {
  it('renders the three mode tab buttons (Diatonic / All / Build)', async () => {
    render(<ChordWorkspace />);
    await screen.findByTestId('staff-mock'); // flush lazy staff

    expect(screen.getByRole('button', { name: 'Diatonic' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'All Chords' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Build' })).toBeDefined();
  });

  it('clicking the "All" tab swaps the diatonic grid for the chord browser', async () => {
    render(<ChordWorkspace />);
    await screen.findByTestId('staff-mock');

    // Diatonic grid is the default picker.
    expect(screen.getByRole('group', { name: 'Diatonic chords' })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'All Chords' }));

    // ChordGrid is gone, ChordBrowser is shown. The triads category (default)
    // renders an "Augmented" pill that the C-major diatonic grid never shows.
    expect(screen.queryByRole('group', { name: 'Diatonic chords' })).toBeNull();
    expect(screen.getByText('Augmented')).toBeDefined();
  });
});

describe('ChordWorkspace — staff + below-staff content', () => {
  it('with no selected chord, renders the scale summary and NOT CurrentChordPanel', async () => {
    render(<ChordWorkspace />);
    await screen.findByTestId('staff-mock');

    // Scale summary: the note names for C major as a single text node.
    expect(screen.getByText('C D E F G A B')).toBeDefined();
    // CurrentChordPanel (its inversion radiogroup) must be absent.
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  it('with a selected chord, renders CurrentChordPanel and NOT the scale summary', async () => {
    useAppStore.setState({ selectedChord: cMajor });
    render(<ChordWorkspace />);
    await screen.findByTestId('staff-mock');

    // CurrentChordPanel present: inversion radiogroup + Voicing heading.
    expect(screen.getByRole('radiogroup')).toBeDefined();
    expect(screen.getByText('Voicing')).toBeDefined();
    // Scale summary must be hidden when a chord is selected.
    expect(screen.queryByText('C D E F G A B')).toBeNull();
  });
});
