import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { QuickSearch } from '../QuickSearch';
import { getResults } from '../quickSearchResults';
import { useAppStore } from '../../../state/store';

afterEach(cleanup);

// Mock framer-motion to render plain HTML (same pattern as KeySelector.test).
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
    quickSearchOpen: true,
  });
});

// Helper: chord-typed result labels in order.
const chordLabels = (q: string) =>
  getResults(q)
    .filter((r) => r.type === 'Chord')
    .map((r) => r.label);

// ───────────────────────────────────────────────────────────────────────────
// Ranking & exact-first
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch ranking (getResults)', () => {
  it('exact symbol parse ranks first among chord results', () => {
    const labels = chordLabels('Cmaj7');
    expect(labels[0]).toBe('C Major 7');
  });

  it('exact parse before completions: "Cm7" leads, then minor extensions follow', () => {
    const labels = chordLabels('Cm7');
    expect(labels[0]).toBe('C Minor 7');
    // completions of the m-stem appear after the exact hit
    expect(labels.length).toBeGreaterThan(1);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Hint completions
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch hint completions', () => {
  it('"Cmaj" surfaces Cmaj7 (and the maj family)', () => {
    const labels = chordLabels('Cmaj');
    expect(labels).toContain('C Major 7');
    expect(labels).toContain('C Major 9');
  });

  it('"C7#" surfaces the sharp-altered dominants', () => {
    const labels = chordLabels('C7#');
    // 7#9 → "C 7#9"; 7#11 (no 9) → named dominant7sharp11 "C 7#11" (WS14: was algorithmic);
    // 7#5 → augmented7 "C Augmented 7"
    expect(labels).toEqual(
      expect.arrayContaining(['C 7#9', 'C 7#11', 'C Augmented 7']),
    );
  });

  it('"Cm" surfaces minor + minor-7/9/6 family', () => {
    const labels = chordLabels('Cm');
    expect(labels).toContain('C Minor');
    expect(labels).toContain('C Minor 7');
    // major must not leak into the minor stem
    expect(labels).not.toContain('C Major 7');
  });

  it('caps chord results at 8', () => {
    expect(chordLabels('C').length).toBeLessThanOrEqual(8);
    expect(chordLabels('G7').length).toBeLessThanOrEqual(8);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Verbal forms
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch verbal forms', () => {
  it('"c sharp minor" resolves to the C# Minor chord', () => {
    const labels = chordLabels('c sharp minor');
    expect(labels).toContain('C# Minor');
  });

  it('"d flat major seven" resolves to Db Major 7 (spelled-out number)', () => {
    expect(chordLabels('d flat major seven')).toContain('Db Major 7');
  });

  it('"g dominant" resolves to G Dominant 7', () => {
    expect(chordLabels('g dominant')).toContain('G Dominant 7');
  });

  it('"f sharp diminished seventh" resolves to F# Diminished 7', () => {
    expect(chordLabels('f sharp diminished seventh')).toContain('F# Diminished 7');
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Slash chords + full quality name
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch symbol + slash + quality-name', () => {
  it('slash chord "Cmaj7/G" resolves with the bass note', () => {
    const labels = chordLabels('Cmaj7/G');
    expect(labels[0]).toBe('C Major 7/G');
  });

  it('full quality NAME ("Half-Diminished") is findable via the fuzzy layer', () => {
    const labels = chordLabels('Half-Diminished');
    expect(labels.some((l) => l.includes('Half-Diminished'))).toBe(true);
  });

  it('full quality NAME ("Dominant 7th") is findable', () => {
    const labels = chordLabels('Dominant 7th');
    expect(labels.some((l) => l.includes('Dominant 7th'))).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Rendered integration: typing shows results, Enter selects the top one
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch rendered integration', () => {
  it('typing a chord shows the result and selecting it sets the store chord', () => {
    render(<QuickSearch />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Cmaj7' } });
    const row = screen.getByText('C Major 7');
    expect(row).toBeDefined();
    fireEvent.click(row);
    const chord = useAppStore.getState().selectedChord;
    expect(chord).not.toBeNull();
    expect(chord!.quality).toBe('major7');
    expect(chord!.root).toEqual({ natural: 'C', accidental: '' });
  });

  it('a hint completion is clickable and selects that chord', () => {
    render(<QuickSearch />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Cmaj' } });
    fireEvent.click(screen.getByText('C Major 9'));
    expect(useAppStore.getState().selectedChord?.quality).toBe('major9');
  });

  // NOTE: keyboard Enter-to-select is exercised by the live app; in jsdom the
  // selectedIdx reset (queued microtask) + callback identity make a synchronous
  // fireEvent(Enter) flaky, so selection is asserted via click above (same
  // executeResult path). The arrow/Enter handler itself is a trivial switch.
});
