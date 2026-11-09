import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { RootChips, ScalePicker, KeyPicker } from '../KeySelector';
import { SCALE_GROUPS } from '../keyChoice';
import { SCALE_FORMULAS } from '../../../core/constants/scales';
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

// The workbench pickers (W11-B): the root as chips (phone key sheet) and as a
// select (laptop / tablet), the scale as a select with every scale grouped.
function KeySelector() {
  return (
    <>
      <RootChips />
      <ScalePicker />
    </>
  );
}
const scaleSelect = () => screen.getByRole('combobox', { name: 'Scale' }) as HTMLSelectElement;
const pickScale = (type: string) => fireEvent.change(scaleSelect(), { target: { value: type } });

// ---------------------------------------------------------------------------
// Root note rendering
// ---------------------------------------------------------------------------
describe('KeySelector root notes', () => {
  it('renders 12 root note buttons', () => {
    render(<KeySelector />);
    // 12 root notes; black keys named for the selected scale (C major here,
    // so D-flat rather than C-sharp — audit W1-09).
    // Shown with real ♭ / ♯ (display only; the chip's data-root stays ASCII).
    const rootLabels = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
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

  it('clicking C# sets accidental correctly (offered as C# in a minor scale)', () => {
    useAppStore.setState({ selectedScale: 'natural_minor' });
    render(<KeySelector />);
    fireEvent.click(screen.getByText('C♯'));
    const state = useAppStore.getState();
    expect(state.selectedKey).toEqual({ natural: 'C', accidental: '#' });
  });

  it('clicking Eb sets flat accidental', () => {
    render(<KeySelector />);
    fireEvent.click(screen.getByText('E♭'));
    const state = useAppStore.getState();
    expect(state.selectedKey).toEqual({ natural: 'E', accidental: 'b' });
  });

  it('the root select offers the same twelve names and sets the key', () => {
    render(<KeyPicker />);
    const select = screen.getByRole('combobox', { name: 'Root' }) as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toEqual(['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']);
    expect([...select.options].map((o) => o.dataset.root)).toEqual(['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']);
    expect(select.value).toBe('0');
    fireEvent.change(select, { target: { value: '3' } });
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'E', accidental: 'b' });
  });
});

// ---------------------------------------------------------------------------
// Scale type rendering
// ---------------------------------------------------------------------------
describe('KeySelector scale types', () => {
  it('renders core scale options (Major, Minor)', () => {
    render(<KeySelector />);
    expect(screen.getByRole('option', { name: 'Major' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'Minor' })).toBeDefined();
  });

  it('choosing a scale changes the selected scale', () => {
    render(<KeySelector />);
    pickScale('natural_minor');
    expect(useAppStore.getState().selectedScale).toBe('natural_minor');
  });

  it('the select shows the active scale', () => {
    useAppStore.setState({ selectedScale: 'dorian' });
    render(<KeySelector />);
    expect(scaleSelect().value).toBe('dorian');
  });

  it('offers EVERY scale, grouped (the old "More scales" included)', () => {
    render(<KeySelector />);
    const offered = [...scaleSelect().options].map((o) => o.value).sort();
    expect(offered).toEqual(Object.keys(SCALE_FORMULAS).sort());
    expect(scaleSelect().querySelectorAll('optgroup')).toHaveLength(SCALE_GROUPS.length);
    expect(screen.getByRole('option', { name: 'Persian' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'Hirajoshi' })).toBeDefined();
  });

  it('does not group Phrygian Dominant (harmonic-minor mode 5) with the melodic-minor modes (audit W5-45)', () => {
    render(<KeySelector />);
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
    expect(groupOf('phrygian_dominant')!.getAttribute('label')).toBe('Harm. Minor Modes');
  });
});
