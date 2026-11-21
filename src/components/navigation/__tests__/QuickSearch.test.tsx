import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StrictMode, useLayoutEffect } from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { QuickSearch } from '../QuickSearch';
import { QuickSearchHost } from '../QuickSearchHost';
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

  it('Escape while it is closed does nothing: no focus is moved, nothing is scheduled (the rest of the app uses Escape too)', () => {
    const a = document.createElement('button');
    const b = document.createElement('button');
    document.body.append(a, b);
    try {
      useAppStore.setState({ quickSearchOpen: false });
      render(<QuickSearch />);
      a.focus();
      // Opened and closed by Cmd+K: that way of closing leaves the dialog remembering where focus was.
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      });
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      });
      expect(useAppStore.getState().quickSearchOpen).toBe(false);
      b.focus();
      const frame = vi.spyOn(window, 'requestAnimationFrame');
      try {
        act(() => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        });
        expect(frame, 'no focus restore asked for').not.toHaveBeenCalled();
      } finally {
        frame.mockRestore();
      }
      expect(useAppStore.getState().quickSearchOpen).toBe(false);
      expect(document.activeElement).toBe(b);
    } finally {
      a.remove();
      b.remove();
    }
  });

  it('a plain k or K, with no Cmd or Ctrl, is typing: the open dialog stays open and the closed one stays closed', () => {
    // Looked at after EACH key: two toggles would cancel out.
    useAppStore.setState({ quickSearchOpen: true });
    render(<QuickSearch />);
    for (const key of ['k', 'K']) {
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }));
      });
      expect(useAppStore.getState().quickSearchOpen, `open, after a plain ${key}`).toBe(true);
    }
    act(() => useAppStore.getState().setQuickSearchOpen(false));
    for (const key of ['k', 'K']) {
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }));
      });
      expect(useAppStore.getState().quickSearchOpen, `closed, after a plain ${key}`).toBe(false);
    }
  });

  it('Ctrl+K or Cmd+K with a capital K toggles too (with Caps Lock on, the letter can arrive as a capital)', () => {
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

// ───────────────────────────────────────────────────────────────────────────
// From the moment search is asked for (leftovers of 21 November 2026). Q1: the
// dialog's code is fetched the first time search opens, and until it arrived
// nothing listened, so an Escape or a second Cmd / Ctrl+K pressed meanwhile was
// lost and the dialog opened anyway. Q2: closing with Cmd / Ctrl+K gave focus
// back to nothing and left the dialog remembering where focus had been.
// ───────────────────────────────────────────────────────────────────────────
describe('QuickSearch: from the moment it is asked for, one listener, and focus given back', () => {
  const isOpen = () => useAppStore.getState().quickSearchOpen;
  const press = (init: KeyboardEventInit) => act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', init));
  });
  const realWait = (ms: number) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });

  /** The dialog's code, held back until released: a slow first download, on purpose. */
  function heldCode(component: React.ComponentType = QuickSearch) {
    let arrive!: () => void;
    const arrived = new Promise<void>((r) => { arrive = r; });
    const load = vi.fn(() => arrived.then(() => ({ default: component })));
    const release = () => act(async () => {
      arrive();
      await arrived;
      await new Promise((r) => setTimeout(r, 20));
    });
    return { load, release };
  }

  /**
   * The window's keydown listeners, read from spies on add / remove. `net` is add − remove calls, as the
   * tests above count; `live` replays them in order as the DOM keeps them (the same function added
   * twice is one), so it also says WHICH listener is there.
   */
  function keydownWatch() {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const calls = () => [
      ...add.mock.calls.map((c, i) => ({ on: true, type: c[0], fn: c[1], at: add.mock.invocationCallOrder[i] })),
      ...remove.mock.calls.map((c, i) => ({ on: false, type: c[0], fn: c[1], at: remove.mock.invocationCallOrder[i] })),
    ].filter((c) => c.type === 'keydown').sort((x, y) => x.at - y.at);
    return {
      net: () => calls().reduce((n, c) => n + (c.on ? 1 : -1), 0),
      live: () => {
        const on = new Set<unknown>();
        for (const c of calls()) {
          if (c.on) on.add(c.fn);
          else on.delete(c.fn);
        }
        return [...on];
      },
      restore: () => {
        add.mockRestore();
        remove.mockRestore();
      },
    };
  }

  let a: HTMLButtonElement;
  let b: HTMLButtonElement;
  beforeEach(() => {
    useAppStore.setState({ quickSearchOpen: false });
    a = document.createElement('button');
    b = document.createElement('button');
    document.body.append(a, b);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    a.remove();
    b.remove();
  });

  // ── Q1: before the code has arrived ──────────────────────────────────────

  it.each([
    ['Cmd+K', () => press({ key: 'k', metaKey: true })],
    ['the search button (the store)', () => act(() => useAppStore.getState().setQuickSearchOpen(true))],
  ])('asked for by %s, then Escape before the code has arrived: closed; when the code arrives, no dialog, and focus has not moved', async (_how, ask) => {
    a.focus();
    const { load, release } = heldCode();
    const keys = keydownWatch();
    render(<QuickSearchHost load={load} />);
    const host = keys.live()[0];
    await ask();
    expect(isOpen(), 'asked for').toBe(true);
    expect(load, 'its code is on its way').toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('combobox'), 'and not here yet').toBeNull();
    await press({ key: 'Escape' });
    expect(isOpen(), 'Escape, before the code: closed').toBe(false);
    await release();
    expect(keys.live(), 'the code arrived and was drawn: its listener replaced the host\'s').toHaveLength(1);
    expect(keys.live()[0]).not.toBe(host);
    await realWait(80); // past the dialog's 50 ms focus timer and a frame
    expect(isOpen(), 'still closed').toBe(false);
    expect(screen.queryByRole('combobox'), 'no dialog appeared').toBeNull();
    expect(document.activeElement, 'focus never moved').toBe(a);
  });

  it('a second Cmd / Ctrl+K before the code has arrived closes it, a third opens it again; the code then shows it, and Escape gives focus back', async () => {
    a.focus();
    const { load, release } = heldCode();
    render(<QuickSearchHost load={load} />);
    await press({ key: 'k', metaKey: true });
    expect(isOpen(), 'first Cmd+K').toBe(true);
    await press({ key: 'k', ctrlKey: true });
    expect(isOpen(), 'second, Ctrl+K: closed').toBe(false);
    await press({ key: 'K', ctrlKey: true });
    expect(isOpen(), 'third, a capital K: open').toBe(true);
    for (const key of ['k', 'K']) {
      await press({ key });
      expect(isOpen(), `a plain ${key} is typing`).toBe(true);
    }
    await release();
    expect(screen.getByRole('combobox')).toBeTruthy();
    await realWait(80);
    expect(document.activeElement, 'the input, 50 ms after the dialog appeared').toBe(screen.getByRole('combobox'));
    await press({ key: 'Escape' });
    expect(isOpen()).toBe(false);
    await realWait(40);
    expect(document.activeElement, 'back where it was when search was asked for').toBe(a);
  });

  it('Escape while closed, before the code was ever asked for, does nothing at all (not even a store write); neither does a plain k', async () => {
    a.focus();
    const { load } = heldCode();
    render(<QuickSearchHost load={load} />);
    const writes = vi.fn();
    const stop = useAppStore.subscribe(writes);
    try {
      for (const init of [{ key: 'Escape' }, { key: 'k' }, { key: 'K', shiftKey: true }]) {
        await press(init);
        expect(isOpen(), `after ${init.key}`).toBe(false);
        expect(writes, `the store, after ${init.key}`).not.toHaveBeenCalled();
      }
    } finally {
      stop();
    }
    expect(load, 'nothing was fetched').not.toHaveBeenCalled();
    expect(document.activeElement).toBe(a);
  });

  // ── Exactly one listener, at every moment ────────────────────────────────

  it.each([false, true])('strict mode %s: one keydown listener before the code, while it is held, once it is drawn (the dialog\'s, not the host\'s), none after an unmount; each key acts once', async (strict) => {
    const keys = keydownWatch();
    const { load, release } = heldCode();
    const tree = <QuickSearchHost load={load} />;
    const { unmount } = render(strict ? <StrictMode>{tree}</StrictMode> : tree);
    expect([keys.net(), keys.live().length], 'before search is asked for').toEqual([1, 1]);
    const host = keys.live()[0];
    await press({ key: 'k', metaKey: true });
    expect(isOpen()).toBe(true);
    expect([keys.net(), keys.live()], 'asked for, its code held back: the host\'s, still').toEqual([1, [host]]);
    await release();
    expect(screen.getByRole('combobox')).toBeTruthy();
    expect(keys.net(), 'its code drawn').toBe(1);
    expect(keys.live()).toHaveLength(1);
    expect(keys.live()[0], 'and it is the dialog\'s').not.toBe(host);
    await press({ key: 'k', metaKey: true });
    expect(isOpen(), 'Cmd+K closes').toBe(false);
    await press({ key: 'k', ctrlKey: true });
    expect(isOpen(), 'Ctrl+K opens').toBe(true);
    await press({ key: 'Escape' });
    expect(isOpen(), 'Escape closes').toBe(false);
    await press({ key: 'Escape' });
    expect(isOpen(), 'and a second Escape opens nothing').toBe(false);
    expect([keys.net(), keys.live().length], 'still one').toEqual([1, 1]);
    unmount();
    expect([keys.net(), keys.live().length], 'after an unmount, none').toEqual([0, 0]);
    await press({ key: 'k', ctrlKey: true });
    expect(isOpen()).toBe(false);
    keys.restore();
  });

  it('the host listens from the step it is drawn and lets go in the step it goes: a key pressed by a sibling\'s layout effect in those steps is heard, then not', async () => {
    // A key in the very step: pressed by a sibling's layout effect, which React runs in that step, after
    // the host's own (when drawn) and after the host's subtree has gone (when removed).
    function CmdKInThisStep() {
      useLayoutEffect(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
        return () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
        };
      }, []);
      return null;
    }
    const keys = keydownWatch();
    const { load, release } = heldCode();
    const { rerender } = render(<><QuickSearchHost load={load} /><CmdKInThisStep /></>);
    expect(isOpen(), 'heard in the step the host was drawn').toBe(true);
    await release();
    expect(screen.getByRole('combobox')).toBeTruthy();
    await press({ key: 'Escape' });
    expect(isOpen()).toBe(false);
    rerender(<></>);
    expect(isOpen(), 'not heard in the step the host went, by anyone').toBe(false);
    expect([keys.net(), keys.live().length], 'none left').toEqual([0, 0]);
    keys.restore();
  });

  it('if the dialog\'s code goes (an error once it was drawn), the host takes the keys back: one listener, the host\'s, and Cmd+K opens again', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    function Fragile() {
      if (useAppStore((s) => s.selectedChord !== null)) throw new Error('planted');
      return <QuickSearch />;
    }
    const keys = keydownWatch();
    const { load, release } = heldCode(Fragile);
    render(<QuickSearchHost load={load} />);
    const host = keys.live()[0];
    await press({ key: 'k', metaKey: true });
    await release();
    expect(screen.getByRole('combobox')).toBeTruthy();
    expect(keys.live()[0]).not.toBe(host);
    await act(async () => {
      useAppStore.setState({ selectedChord: { root: { natural: 'C', accidental: '' }, quality: 'major' } as never });
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(screen.queryByRole('combobox'), 'the dialog went with its error').toBeNull();
    expect(isOpen(), 'search closed').toBe(false);
    expect([keys.net(), keys.live()], 'the host listens again').toEqual([1, [host]]);
    useAppStore.setState({ selectedChord: null });
    await press({ key: 'k', ctrlKey: true });
    expect(isOpen(), 'Ctrl+K opens it again').toBe(true);
    keys.restore();
  });

  // ── Q2: every way of closing gives focus back, and nothing is remembered ──

  it.each([
    ['Escape', () => press({ key: 'Escape' })],
    ['Cmd+K', () => press({ key: 'k', metaKey: true })],
    ['Ctrl+K', () => press({ key: 'K', ctrlKey: true })],
    ['a click on the backdrop', () => act(() => { fireEvent.click(document.querySelector('.fixed.inset-0')!); })],
  ])('closed by %s: focus goes back to where it was when search opened, and the dialog remembers no element after', (_how, close) => {
    vi.useFakeTimers();
    a.focus();
    render(<QuickSearch />);
    press({ key: 'k', metaKey: true });
    expect(isOpen()).toBe(true);
    act(() => { vi.advanceTimersByTime(60); });
    expect(document.activeElement, 'the input').toBe(screen.getByRole('combobox'));
    close();
    expect(isOpen(), 'closed').toBe(false);
    act(() => { vi.advanceTimersByTime(20); }); // a frame
    expect(document.activeElement, 'focus is back').toBe(a);
    // Nothing remembered: focus elsewhere, then search opens and an Escape comes before its effects have run
    // (as in the step it is drawn). A dialog still holding `a` would send focus there.
    b.focus();
    act(() => {
      useAppStore.setState({ quickSearchOpen: true });
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(isOpen()).toBe(false);
    act(() => { vi.advanceTimersByTime(100); });
    expect(document.activeElement, 'focus stays where the learner put it').toBe(b);
  });

  it('an Escape in the step the dialog is first drawn leaves nothing remembered either', () => {
    vi.useFakeTimers();
    function EscapeAsItIsDrawn() {
      useLayoutEffect(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      }, []);
      return null;
    }
    a.focus();
    useAppStore.setState({ quickSearchOpen: true });
    render(<><QuickSearch /><EscapeAsItIsDrawn /></>);
    expect(isOpen()).toBe(false);
    act(() => { vi.advanceTimersByTime(100); });
    expect(document.activeElement, 'focus never left').toBe(a);
    b.focus();
    act(() => {
      useAppStore.setState({ quickSearchOpen: true });
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    act(() => { vi.advanceTimersByTime(100); });
    expect(document.activeElement, 'not sent back to where it was at that first step').toBe(b);
  });

  it('closed and opened again before the next frame: focus stays in the dialog, and its next close gives focus back to where search first opened', () => {
    vi.useFakeTimers();
    a.focus();
    render(<QuickSearch />);
    press({ key: 'k', metaKey: true });
    act(() => { vi.advanceTimersByTime(60); });
    const input = screen.getByRole('combobox');
    expect(document.activeElement).toBe(input);
    press({ key: 'k', metaKey: true });
    expect(isOpen(), 'closed').toBe(false);
    press({ key: 'k', metaKey: true });
    expect(isOpen(), 'open again, inside the same frame').toBe(true);
    act(() => { vi.advanceTimersByTime(20); });
    expect(document.activeElement, 'the frame did not pull focus out of the open dialog').not.toBe(a);
    act(() => { vi.advanceTimersByTime(60); });
    expect(document.activeElement, 'the input').toBe(screen.getByRole('combobox'));
    press({ key: 'Escape' });
    expect(isOpen()).toBe(false);
    act(() => { vi.advanceTimersByTime(20); });
    expect(document.activeElement, 'back where search first opened').toBe(a);
  });
});
