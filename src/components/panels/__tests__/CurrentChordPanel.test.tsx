import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CurrentChordPanel } from '../CurrentChordPanel';
import { useAppStore } from '../../../state/store';
import { buildChord } from '../../../core/constants/chords';

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

// C major chord for all tests
const cMajor = buildChord({ natural: 'C', accidental: '' }, 'major');

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: cMajor,
    selectedDegree: null,
    chordInversion: 0,
    detailPanelOpen: true,
    synthPreset: 'piano',
    baseOctave: 4,
  });
});

describe('CurrentChordPanel rendering', () => {
  it('renders the chord root name', () => {
    render(<CurrentChordPanel chord={cMajor} />);
    // "C" appears in both the h2 header and the note chip — getAllByText is correct here
    const cElements = screen.getAllByText('C');
    expect(cElements.length).toBeGreaterThanOrEqual(1);
    // The h2 should contain the root
    const heading = cElements.find((el) => el.tagName === 'H2' || el.closest('h2'));
    expect(heading).toBeDefined();
  });

  it('renders note chips for all chord notes', () => {
    render(<CurrentChordPanel chord={cMajor} />);
    // C major = C, E, G; C appears in header too, so use getAllByText
    expect(screen.getAllByText('C').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('E')).toBeDefined();
    expect(screen.getByText('G')).toBeDefined();
  });

  it('renders the Notes section heading', () => {
    render(<CurrentChordPanel chord={cMajor} />);
    expect(screen.getByText('Notes')).toBeDefined();
  });

  it('renders the Voicing section heading', () => {
    render(<CurrentChordPanel chord={cMajor} />);
    expect(screen.getByText('Voicing')).toBeDefined();
  });

  it('renders inversion buttons in a radiogroup', () => {
    render(<CurrentChordPanel chord={cMajor} />);
    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toBeDefined();
    // C major has 3 notes → Root, 1st Inv, 2nd Inv
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('does NOT render a canvas element (no staff notation)', () => {
    const { container } = render(<CurrentChordPanel chord={cMajor} />);
    const canvases = container.querySelectorAll('canvas');
    expect(canvases).toHaveLength(0);
  });

  it('does NOT render the Staff section heading', () => {
    render(<CurrentChordPanel chord={cMajor} />);
    expect(screen.queryByText('Staff')).toBeNull();
  });
});

describe('CurrentChordPanel inversion interaction', () => {
  it('clicking 1st Inv button updates chordInversion in store', () => {
    render(<CurrentChordPanel chord={cMajor} />);
    const firstInv = screen.getByText('1st Inv');
    fireEvent.click(firstInv);
    expect(useAppStore.getState().chordInversion).toBe(1);
  });

  it('clicking Root button after inversion resets chordInversion to 0', () => {
    useAppStore.setState({ chordInversion: 1 });
    render(<CurrentChordPanel chord={cMajor} />);
    const rootBtn = screen.getByText('Root');
    fireEvent.click(rootBtn);
    expect(useAppStore.getState().chordInversion).toBe(0);
  });

  it('active inversion button has aria-checked=true', () => {
    render(<CurrentChordPanel chord={cMajor} />);
    const radios = screen.getAllByRole('radio');
    // Root position is active by default (chordInversion=0)
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');
  });
});
