import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StrictMode, useLayoutEffect } from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
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
    expect(labels[0]).toBe('C Major 7th');
  });

  it('exact parse before completions: "Cm7" leads, then minor extensions follow', () => {
    const labels = chordLabels('Cm7');
    expect(labels[0]).toBe('C Minor 7th');
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
    expect(labels).toContain('C Major 7th');
    expect(labels).toContain('C Major 9th');
  });

  it('"C7#" surfaces the sharp-altered dominants', () => {
    const labels = chordLabels('C7#');
    // 7#9 → dominant7sharp9; 7#11 (no 9) → named dominant7sharp11 (WS14: was algorithmic);
    // 7#5 → augmented7. Named as Explore's chord heading names them (audit A13).
    expect(labels).toEqual(
      expect.arrayContaining(['C Dominant 7th Sharp 9', 'C Dominant 7th Sharp 11', 'C Augmented 7th']),
    );
  });

  it('"Cm" surfaces minor + minor-7/9/6 family', () => {
    const labels = chordLabels('Cm');
    expect(labels).toContain('C Minor');
    expect(labels).toContain('C Minor 7th');
    // major must not leak into the minor stem
    expect(labels).not.toContain('C Major 7th');
  });

  it('caps chord results at 8', () => {
    expect(chordLabels('C').length).toBeLessThanOrEqual(8);
    expect(chordLabels('G7').length).toBeLessThanOrEqual(8);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Verbal forms
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch: ASCII typing finds names shown with ♭ / ♯', () => {
  it('"Eb", "eb" and "f#" find E♭ / F♯ results; the typed text needs no glyph', () => {
    for (const q of ['Eb', 'eb']) {
      const labels = getResults(q).filter((r) => r.type !== 'Lesson').map((r) => r.label);
      expect(labels.length, q).toBeGreaterThan(0);
      expect(labels.every((l) => l.startsWith('E♭')), `${q}: ${labels.join(', ')}`).toBe(true);
    }
    const sharp = getResults('f#').filter((r) => r.type !== 'Lesson').map((r) => r.label);
    expect(sharp.length).toBeGreaterThan(0);
    expect(sharp.every((l) => l.startsWith('F♯')), sharp.join(', ')).toBe(true);
    // Glyph input still works.
    const glyph = getResults('E♭').filter((r) => r.type !== 'Lesson').map((r) => r.label);
    expect(glyph.length).toBeGreaterThan(0);
    expect(glyph.every((l) => l.startsWith('E♭')), glyph.join(', ')).toBe(true);
  });
});

describe('QuickSearch verbal forms', () => {
  it('"c sharp minor" resolves to the C# Minor chord', () => {
    const labels = chordLabels('c sharp minor');
    expect(labels).toContain('C♯ Minor');
  });

  it('"d flat major seven" resolves to Db Major 7th (spelled-out number)', () => {
    expect(chordLabels('d flat major seven')).toContain('D♭ Major 7th');
  });

  it('"g dominant" resolves to G Dominant 7th', () => {
    expect(chordLabels('g dominant')).toContain('G Dominant 7th');
  });

  it('"f sharp diminished seventh" resolves to F# Diminished 7th', () => {
    expect(chordLabels('f sharp diminished seventh')).toContain('F♯ Diminished 7th');
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Slash chords + full quality name
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch symbol + slash + quality-name', () => {
  it('slash chord "Cmaj7/G" resolves with the bass note', () => {
    const labels = chordLabels('Cmaj7/G');
    expect(labels[0]).toBe('C Major 7th/G');
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
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Cmaj7' } });
    const row = screen.getByText('C Major 7th');
    expect(row).toBeDefined();
    fireEvent.click(row);
    const chord = useAppStore.getState().selectedChord;
    expect(chord).not.toBeNull();
    expect(chord!.quality).toBe('major7');
    expect(chord!.root).toEqual({ natural: 'C', accidental: '' });
  });

  it('a hint completion is clickable and selects that chord', () => {
    render(<QuickSearch />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Cmaj' } });
    fireEvent.click(screen.getByText('C Major 9th'));
    expect(useAppStore.getState().selectedChord?.quality).toBe('major9');
  });

  // NOTE: keyboard Enter-to-select is exercised by the live app; in jsdom the
  // selectedIdx reset (queued microtask) + callback identity make a synchronous
  // fireEvent(Enter) flaky, so selection is asserted via click above (same
  // executeResult path). The arrow/Enter handler itself is a trivial switch.
});

// ───────────────────────────────────────────────────────────────────────────
// Its own focus timer and Escape, in the first instant (two retried browser
// tests on GitHub, 20 November 2026: focus on <body> after a result chosen
// from Drill; an Escape that closed nothing)
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch: closed in its first instant', () => {
  it('a dialog closed before its 50 ms are up no longer waits to focus its input', () => {
    vi.useFakeTimers();
    try {
      useAppStore.setState({ quickSearchOpen: false });
      render(<QuickSearch />);
      const idle = vi.getTimerCount();
      act(() => useAppStore.getState().setQuickSearchOpen(true));
      expect(vi.getTimerCount(), 'the input is focused 50 ms after opening').toBe(idle + 1);
      // A result chosen (or Escape) before the timer ran: the dialog closes.
      act(() => useAppStore.getState().setQuickSearchOpen(false));
      expect(vi.getTimerCount(), 'the focus timer went with the dialog').toBe(idle);
      // Opened again, it waits again, and focuses once the 50 ms are up.
      act(() => useAppStore.getState().setQuickSearchOpen(true));
      expect(vi.getTimerCount()).toBe(idle + 1);
      act(() => { vi.advanceTimersByTime(60); });
      expect(document.activeElement).toBe(screen.getByRole('combobox'));
    } finally {
      vi.useRealTimers();
    }
  });

  it('Escape pressed before React has drawn the open dialog closes it (the key reads the store, not a render\'s copy)', () => {
    useAppStore.setState({ quickSearchOpen: false });
    render(<QuickSearch />);
    act(() => {
      useAppStore.setState({ quickSearchOpen: true });
      // Still the handler of the render in which it was closed.
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('Escape in the very step the dialog is first drawn closes it: the keys are listened for from that step (it is mounted already open, the first time search opens)', () => {
    // A key that arrives as the dialog is committed, before any ordinary effect has run: pressed here by a
    // sibling's layout effect, which React runs in that same step, after this component's own.
    function EscapeAsItIsDrawn() {
      useLayoutEffect(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      }, []);
      return null;
    }
    useAppStore.setState({ quickSearchOpen: true });
    render(<><QuickSearch /><EscapeAsItIsDrawn /></>);
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  // The listener's life, counted on the window itself (a key pressed would not tell: listeners left
  // behind toggle in pairs, and an even number of them looks like none).
  const keydown = (calls: unknown[][]) => calls.filter(([type]) => type === 'keydown').map(([, fn]) => fn);

  it('the keys are let go when it unmounts: every keydown listener it added is removed', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    try {
      useAppStore.setState({ quickSearchOpen: false });
      const { unmount } = render(<QuickSearch />);
      const added = keydown(add.mock.calls);
      expect(added.length).toBeGreaterThan(0);
      unmount();
      const removed = keydown(remove.mock.calls);
      for (const fn of added) expect(removed).toContain(fn);
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      });
      expect(useAppStore.getState().quickSearchOpen).toBe(false);
    } finally {
      add.mockRestore();
      remove.mockRestore();
    }
  });

  it('one listener at a time, also where effects run twice (strict mode): one Cmd+K opens it, the next closes it', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    try {
      useAppStore.setState({ quickSearchOpen: false });
      render(<StrictMode><QuickSearch /></StrictMode>);
      expect(keydown(add.mock.calls).length - keydown(remove.mock.calls).length, 'keydown listeners left on the window').toBe(1);
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      });
      expect(useAppStore.getState().quickSearchOpen).toBe(true);
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
      });
      expect(useAppStore.getState().quickSearchOpen).toBe(false);
      expect(keydown(add.mock.calls).length - keydown(remove.mock.calls).length, 'still one after opening and closing').toBe(1);
    } finally {
      add.mockRestore();
      remove.mockRestore();
    }
  });

  it('Ctrl+K with a capital K (Caps Lock on) toggles too, as the key that first opens search does', () => {
    useAppStore.setState({ quickSearchOpen: false });
    render(<QuickSearch />);
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'K', ctrlKey: true }));
    });
    expect(useAppStore.getState().quickSearchOpen).toBe(true);
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'K', metaKey: true }));
    });
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
  });

  it('Cmd+K pressed twice before React has drawn opens and closes (each key reads the store)', () => {
    useAppStore.setState({ quickSearchOpen: false });
    render(<QuickSearch />);
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    });
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
  });
});
