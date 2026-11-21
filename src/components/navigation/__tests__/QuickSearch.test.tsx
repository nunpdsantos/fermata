import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StrictMode, Suspense, use, useLayoutEffect } from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { QuickSearch } from '../QuickSearch';
import { QuickSearchHost } from '../QuickSearchHost';
import { getResults } from '../quickSearchResults';
import { useAppStore } from '../../../state/store';
import { armForTests, resetAppHistoryForTests, type HistoryEntry } from '../../../state/appHistory';

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
      // Opened and closed by Cmd+K: since 21 November 2026 that closes as Escape does (focus goes back a
      // frame later, and the dialog then forgets the element); until then it left the dialog remembering
      // where focus was. The frame has not come yet when Escape is pressed below.
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
    // A new promise for every call, as the app's import() gives; the first is kept, for a test's own
    // component to wait on the very promise React waits on. One promise for every call hung this file
    // (its worker at full CPU) in the test where the dialog's code goes and is fetched again: React 19's
    // lazy() marks the promise it waited on `status: "fulfilled"`; the host's fresh lazy() then got that
    // same promise, its own record of it still pending until a microtask; React, seeing the promise
    // fulfilled, draws again at once without yielding, the fresh lazy() throws it again, and so on. React's
    // handling of one settled promise shared by two lazy()s, not the host: the app's loader makes a new
    // promise every time (traced 21 November 2026: the second load was the last thing that ran).
    let code: Promise<{ default: React.ComponentType }> | null = null;
    const load = vi.fn(() => {
      const p = arrived.then(() => ({ default: component }));
      code ??= p;
      return p;
    });
    const release = () => act(async () => {
      arrive();
      await arrived;
      await new Promise((r) => setTimeout(r, 20));
    });
    return { load, release, arrive, code: () => code! };
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

  it('the place focus goes back to is read when the dialog is drawn, not when search was asked for: focus moved while the code is on its way is where the close returns', async () => {
    a.focus();
    const { load, release } = heldCode();
    render(<QuickSearchHost load={load} />);
    await press({ key: 'k', ctrlKey: true });
    b.focus(); // the learner moves on while the code downloads
    await release();
    await realWait(80);
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
    await press({ key: 'Escape' });
    await realWait(40);
    expect(document.activeElement, 'where focus was when the dialog was drawn').toBe(b);
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

  it('closed and opened again before the next frame: that frame moves no focus, the input takes it when its timer runs, and the next close gives focus back to where search first opened', () => {
    // This file's AnimatePresence removes a closed dialog at once, so the closing input leaves the page and
    // focus falls to <body> until the reopened dialog's timer (QuickSearch.focus.test.tsx draws the exit).
    vi.useFakeTimers();
    a.focus();
    render(<QuickSearch />);
    press({ key: 'k', metaKey: true });
    act(() => { vi.advanceTimersByTime(60); });
    const input = screen.getByRole('combobox');
    expect(document.activeElement).toBe(input);
    press({ key: 'k', metaKey: true });
    expect(isOpen(), 'closed').toBe(false);
    expect(document.activeElement, 'its input gone with it').toBe(document.body);
    press({ key: 'k', metaKey: true });
    expect(isOpen(), 'open again, inside the same frame').toBe(true);
    act(() => { vi.advanceTimersByTime(20); });
    expect(document.activeElement, 'the frame of the close moved nothing: not back to a while search is open').toBe(document.body);
    act(() => { vi.advanceTimersByTime(40); });
    expect(document.activeElement, 'the input, once its 50 ms are up').toBe(screen.getByRole('combobox'));
    press({ key: 'Escape' });
    expect(isOpen()).toBe(false);
    act(() => { vi.advanceTimersByTime(20); });
    expect(document.activeElement, 'back where search first opened').toBe(a);
  });

  // ── The hand-over inside one step (review of 21 November 2026, items 1 and 2) ──

  /** One key, sent now; what it wrote to the store, and the window's keydown listeners when it came. */
  function sendNow(keys: ReturnType<typeof keydownWatch>, init: KeyboardEventInit) {
    const writes: boolean[] = [];
    const stop = useAppStore.subscribe((st) => writes.push(st.quickSearchOpen));
    const live = keys.live();
    window.dispatchEvent(new KeyboardEvent('keydown', { ...init, cancelable: true }));
    stop();
    return { live, writes, combobox: document.querySelector('[role="combobox"]') !== null };
  }

  it('in the step the dialog\'s code is drawn, a key pressed after it (a later sibling\'s layout effect, drawn in that same step) finds one listener, the dialog\'s: a second Ctrl+K closes, one store write', async () => {
    const keys = keydownWatch();
    const { load, release, code } = heldCode();
    const seen: ReturnType<typeof sendNow>[] = [];
    function PressAsDrawn({ wait }: { wait: Promise<unknown> }) {
      use(wait); // the same promise as the dialog's code: drawn in the same step as it
      useLayoutEffect(() => {
        seen.push(sendNow(keys, { key: 'k', ctrlKey: true }));
      }, []);
      return null;
    }
    const { rerender } = render(<QuickSearchHost load={load} />);
    const host = keys.live()[0];
    await press({ key: 'k', ctrlKey: true });
    expect(isOpen(), 'asked for').toBe(true);
    // Inside an awaited act: a component suspending (`use`) in a plain one was retried only if something
    // else drew the page again (an earlier test's state decided it: the history hook already fetched, the
    // test then never saw the step).
    await act(async () => {
      rerender(<><QuickSearchHost load={load} /><Suspense fallback={null}><PressAsDrawn wait={code()} /></Suspense></>);
    });
    await release();
    expect(seen).toHaveLength(1);
    expect(seen[0].combobox, 'pressed in the step the dialog was drawn').toBe(true);
    expect({ listeners: seen[0].live.length, writes: seen[0].writes }, 'one listener then, one store write: closed').toEqual({ listeners: 1, writes: [false] });
    expect(seen[0].live[0], 'the dialog\'s').not.toBe(host);
    expect(isOpen()).toBe(false);
    keys.restore();
  });

  it('right after the step the code is drawn (a microtask, before React\'s passive effects; real timers, no act), a second Ctrl+K finds one listener and closes: one store write', { timeout: 10_000 }, async () => {
    const keys = keydownWatch();
    const { load, arrive } = heldCode();
    render(<QuickSearchHost load={load} />);
    const host = keys.live()[0];
    await press({ key: 'k', ctrlKey: true });
    expect(isOpen()).toBe(true);
    const env = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
    const was = env.IS_REACT_ACT_ENVIRONMENT;
    env.IS_REACT_ACT_ENVIRONMENT = false; // React's own scheduler, as in the browser
    let seen: ReturnType<typeof sendNow> | null = null;
    const watch = new MutationObserver(() => {
      if (seen || !document.querySelector('[role="combobox"]')) return;
      watch.disconnect();
      seen = sendNow(keys, { key: 'k', ctrlKey: true });
    });
    watch.observe(document.body, { childList: true, subtree: true });
    try {
      arrive();
      const t0 = performance.now();
      while (!seen && performance.now() - t0 < 3000) await new Promise((r) => setTimeout(r, 10));
    } finally {
      watch.disconnect();
      env.IS_REACT_ACT_ENVIRONMENT = was;
    }
    await realWait(50);
    const got = seen as ReturnType<typeof sendNow> | null;
    expect(got, 'the dialog was drawn').not.toBeNull();
    expect({ listeners: got!.live.length, writes: got!.writes }, 'one listener then, one store write: closed').toEqual({ listeners: 1, writes: [false] });
    expect(got!.live[0], 'the dialog\'s').not.toBe(host);
    expect(isOpen()).toBe(false);
    keys.restore();
  });

  it('in the step an errored dialog is taken away, a key pressed then (a later sibling\'s layout effect) finds one listener, the host\'s: Ctrl+K opens, one store write', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    function Fragile() {
      if (useAppStore((st) => st.selectedChord !== null)) throw new Error('planted');
      return <QuickSearch />;
    }
    const seen: ReturnType<typeof sendNow>[] = [];
    const keys = keydownWatch();
    function PressAsItGoes() {
      const crash = useAppStore((st) => st.selectedChord !== null);
      useLayoutEffect(() => {
        if (crash) seen.push(sendNow(keys, { key: 'k', ctrlKey: true }));
      }, [crash]);
      return null;
    }
    const first = heldCode(Fragile);
    // After the error the host downloads again: that code never arrives.
    const load = vi.fn((): Promise<{ default: React.ComponentType }> => (first.load.mock.calls.length ? new Promise(() => {}) : first.load()));
    render(<><QuickSearchHost load={load} /><PressAsItGoes /></>);
    const host = keys.live()[0];
    await press({ key: 'k', ctrlKey: true });
    await first.release();
    expect(screen.getByRole('combobox')).toBeTruthy();
    await press({ key: 'Escape' });
    expect(isOpen()).toBe(false);
    await act(async () => {
      useAppStore.setState({ selectedChord: { root: { natural: 'C', accidental: '' }, quality: 'major' } as never });
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(seen).toHaveLength(1);
    expect(seen[0].combobox, 'pressed in the step the dialog went').toBe(false);
    expect({ listeners: seen[0].live.length, writes: seen[0].writes }, 'one listener then, one store write: opened').toEqual({ listeners: 1, writes: [true] });
    expect(seen[0].live, 'the host\'s').toEqual([host]);
    useAppStore.setState({ selectedChord: null });
    keys.restore();
  });

  it('Cmd / Ctrl+K, either case, is the app\'s in every phase (its default prevented): the host\'s before the code and while it is on its way, the dialog\'s after; Escape and a plain k are not', async () => {
    const { load, release } = heldCode();
    render(<QuickSearchHost load={load} />);
    const send = (init: KeyboardEventInit) => {
      const e = new KeyboardEvent('keydown', { ...init, cancelable: true });
      act(() => { window.dispatchEvent(e); });
      return e.defaultPrevented;
    };
    const SHORTCUTS = [{ key: 'k', ctrlKey: true }, { key: 'K', ctrlKey: true }, { key: 'k', metaKey: true }, { key: 'K', metaKey: true }];
    expect(send({ key: 'Escape' }), 'before: Escape').toBe(false);
    expect(send({ key: 'k' }), 'before: a plain k').toBe(false);
    expect(send(SHORTCUTS[0]), 'before the code was asked for: the host\'s').toBe(true);
    expect(isOpen()).toBe(true);
    let open = true;
    for (const init of [...SHORTCUTS, ...SHORTCUTS]) {
      expect(send(init), `on its way: ${JSON.stringify(init)}`).toBe(true);
      open = !open;
      expect(isOpen(), `on its way, after ${JSON.stringify(init)}`).toBe(open);
    }
    expect(send({ key: 'k' }), 'on its way: a plain k').toBe(false);
    expect(send({ key: 'Escape' }), 'on its way: Escape').toBe(false);
    expect(isOpen()).toBe(false);
    expect(send(SHORTCUTS[0])).toBe(true);
    await release();
    expect(screen.getByRole('combobox')).toBeTruthy();
    open = true;
    for (const init of [...SHORTCUTS, ...SHORTCUTS]) {
      expect(send(init), `drawn: ${JSON.stringify(init)}`).toBe(true);
      open = !open;
      expect(isOpen(), `drawn, after ${JSON.stringify(init)}`).toBe(open);
    }
    expect(send({ key: 'k' }), 'drawn: a plain k').toBe(false);
    expect(send({ key: 'Escape' }), 'drawn: Escape').toBe(false);
  });

  it('after the dialog\'s code is drawn, Escape while search is closed does nothing either: not even a store write', async () => {
    const { load, release } = heldCode();
    render(<QuickSearchHost load={load} />);
    await press({ key: 'k', ctrlKey: true });
    await release();
    expect(screen.getByRole('combobox')).toBeTruthy();
    await press({ key: 'k', ctrlKey: true });
    expect(isOpen()).toBe(false);
    const writes = vi.fn();
    const stop = useAppStore.subscribe(writes);
    try {
      for (const init of [{ key: 'Escape' }, { key: 'Escape' }, { key: 'k' }]) {
        await press(init);
        expect(isOpen(), `after ${init.key}`).toBe(false);
        expect(writes, `the store, after ${init.key}`).not.toHaveBeenCalled();
      }
    } finally {
      stop();
    }
  });

  it.each(['on its way', 'drawn'] as const)('a held Cmd / Ctrl+K (the key repeating) acts once, %s: each repeat is still the app\'s, and changes nothing', async (phase) => {
    const { load, release } = heldCode();
    render(<QuickSearchHost load={load} />);
    await press({ key: 'k', ctrlKey: true });
    if (phase === 'drawn') await release();
    expect(isOpen()).toBe(true);
    expect(screen.queryByRole('combobox') !== null, 'the dialog\'s code drawn').toBe(phase === 'drawn');
    for (let i = 1; i <= 3; i++) {
      const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, repeat: true, cancelable: true });
      act(() => { window.dispatchEvent(e); });
      expect(isOpen(), `after repeat ${i}`).toBe(true);
      expect(e.defaultPrevented, `repeat ${i} is the app's`).toBe(true);
    }
    await press({ key: 'k', ctrlKey: true });
    expect(isOpen(), 'a new press closes').toBe(false);
  });

  // ── Back while the code is on its way (review item 5) ──────────────────────

  describe('the browser\'s Back', () => {
    const pop = (state: HistoryEntry) => act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state }));
    });
    beforeEach(() => {
      useAppStore.setState({ view: 'explore' });
      window.history.replaceState(null, '', '/');
      resetAppHistoryForTests();
      vi.spyOn(window.history, 'pushState');
      vi.spyOn(window.history, 'go').mockImplementation(() => undefined);
    });
    /** The entries pushed, by the number of layers each covers. */
    const entries = () => (window.history.pushState as unknown as ReturnType<typeof vi.fn>).mock.calls.map((c) => (c[0] as HistoryEntry).l);
    /** Asked for: the host's layer comes with the history model's chunk (here at once, but a promise later). */
    const ask = async () => {
      await press({ key: 'k', ctrlKey: true });
      await realWait(20);
    };

    it('while the code is on its way, search is a layer (the host\'s): Back cancels it, the screen stays, no dialog when the code arrives, focus not moved, and Forward brings nothing back', async () => {
      a.focus();
      armForTests();
      const { load, release } = heldCode();
      render(<QuickSearchHost load={load} />);
      await ask();
      expect(isOpen()).toBe(true);
      expect(entries(), 'one entry for the open, covering one layer').toEqual([1]);
      const frames = vi.spyOn(window, 'requestAnimationFrame');
      await pop({ fm: 1, i: 0, v: 'explore', l: 0 });
      expect(isOpen(), 'Back cancelled it').toBe(false);
      expect(useAppStore.getState().view, 'the screen stays').toBe('explore');
      expect(frames, 'no focus to give back (none was taken)').not.toHaveBeenCalled();
      await release();
      await realWait(80);
      expect(screen.queryByRole('combobox'), 'no dialog when the code arrives').toBeNull();
      expect(document.activeElement, 'focus never moved').toBe(a);
      await pop({ fm: 1, i: 1, v: 'explore', l: 1 });
      expect(isOpen(), 'Forward brings nothing back').toBe(false);
      expect(entries(), 'no entry written since').toEqual([1]);
    });

    it('asked for, then drawn while open: the dialog takes the layer over in that step and the open keeps its one entry; Back then closes the dialog and gives focus back', async () => {
      a.focus();
      armForTests();
      const { load, release } = heldCode();
      render(<QuickSearchHost load={load} />);
      await ask();
      expect(entries()).toEqual([1]);
      await release();
      expect(screen.getByRole('combobox')).toBeTruthy();
      expect(entries(), 'still one entry: the dialog reused it').toEqual([1]);
      await realWait(80);
      expect(document.activeElement).toBe(screen.getByRole('combobox'));
      await pop({ fm: 1, i: 0, v: 'explore', l: 0 });
      expect(isOpen(), 'Back closed the dialog').toBe(false);
      await realWait(40);
      expect(document.activeElement, 'focus given back, as the dialog\'s Escape does').toBe(a);
      // Opened again (the code here now): the same entry again, no new one.
      armForTests();
      await press({ key: 'k', ctrlKey: true });
      expect(entries(), 'an open after a Back writes its one entry').toEqual([1, 1]);
      await press({ key: 'Escape' });
      await press({ key: 'k', ctrlKey: true });
      expect(entries(), 'one closed by Escape left its entry, which the next open reuses').toEqual([1, 1]);
    });
  });

  // ── Cancelled while the code is on its way: the history afterwards (second review, finding 1) ──

  describe('cancelled while the code is on its way, by Escape, a second Ctrl+K or Back', () => {
    /**
     * This tab's history as the browser keeps it: a stack the model's writes push and rewrite, moved by
     * Back and Forward (each a popstate) and by every `history.go` the model asks for, run as the
     * browser runs it (jsdom's own history does not move on a popstate).
     */
    function browserHistory() {
      const stack: HistoryEntry[] = [{ fm: 1, i: 0, v: 'explore', l: 0 }];
      let pos = 0;
      const asked: number[] = [];
      vi.spyOn(window.history, 'pushState').mockImplementation((st) => {
        stack.splice(pos + 1);
        stack.push(st as HistoryEntry);
        pos = stack.length - 1;
      });
      vi.spyOn(window.history, 'replaceState').mockImplementation((st) => { stack[pos] = st as HistoryEntry; });
      vi.spyOn(window.history, 'go').mockImplementation((d = 0) => { asked.push(d); });
      const traverse = async (d: number) => {
        const trail: string[] = [];
        const steps = [d];
        while (steps.length) {
          const by = steps.shift()!;
          if (pos + by < 0 || pos + by >= stack.length) {
            trail.push(`nothing ${by < 0 ? 'before' : 'after'}`);
            break;
          }
          pos += by;
          trail.push(`${trail.length ? `go(${by}) ` : ''}pop ${stack[pos].i}`);
          await act(async () => { window.dispatchEvent(new PopStateEvent('popstate', { state: stack[pos] })); });
          steps.push(...asked.splice(0));
        }
        return trail.join(', ');
      };
      return { back: () => traverse(-1), forward: () => traverse(1), at: () => ({ i: stack[pos].i, l: stack[pos].l, entries: stack.length }) };
    }

    /**
     * On Learn (one entry after Explore's), search asked for and cancelled; then the next Back; then
     * search asked for again (after a tap, as the search button is) and closed by Back. `code`: held back
     * all along, or (the reference) drawn and closed before any of it.
     */
    async function run(cancel: 'Escape' | 'Ctrl+K' | 'Back', code: 'held' | 'loaded') {
      useAppStore.setState({ view: 'explore', quickSearchOpen: false });
      resetAppHistoryForTests();
      const h = browserHistory();
      const held = heldCode();
      const view = render(<QuickSearchHost load={held.load} />);
      if (code === 'loaded') {
        await press({ key: 'k', ctrlKey: true });
        await held.release();
        await press({ key: 'Escape' });
        await realWait(40);
      }
      armForTests(); // a tap on the Learn tab
      act(() => useAppStore.getState().setView('learn'));
      const log: string[] = [];
      const note = (what: string) => log.push(`${what}: ${JSON.stringify({ ...h.at(), view: useAppStore.getState().view, open: isOpen() })}`);
      note('on Learn');
      await press({ key: 'k', ctrlKey: true });
      await realWait(20);
      note('asked');
      if (cancel === 'Back') log.push(`cancelled by Back: ${await h.back()}`);
      else await press(cancel === 'Escape' ? { key: 'Escape' } : { key: 'k', ctrlKey: true });
      await realWait(20);
      note(`cancelled by ${cancel}`);
      log.push(`next Back: ${await h.back()}`);
      await realWait(20);
      note('after the next Back');
      armForTests(); // a tap on the search button
      await press({ key: 'k', ctrlKey: true });
      await realWait(20);
      note('asked again');
      log.push(`Back: ${await h.back()}`);
      await realWait(20);
      note('closed by Back');
      return { log, h, held, view };
    }

    for (const cancel of ['Escape', 'Ctrl+K', 'Back'] as const) {
      it(`by ${cancel}: the history model holds no layer for search, and the next Back, asking again and Back again do exactly what they do with the code loaded; when the code arrives at last, nothing changes`, async () => {
        const reference = await run(cancel, 'loaded');
        // The reference, as the loaded dialog has always done it: one press back to the screen before.
        expect(reference.log.find((l) => l.startsWith('after the next Back')), 'the reference: one Back to Explore').toContain('"view":"explore"');
        expect(reference.log.find((l) => l.startsWith('asked again')), 'asked again: an entry of its own, covering a layer').toContain('"l":1');
        reference.view.unmount();
        vi.restoreAllMocks();
        const held = await run(cancel, 'held');
        expect(screen.queryByRole('combobox'), 'the code still held back').toBeNull();
        expect(held.log).toEqual(reference.log);
        // The code arrives, closed: nothing changes.
        const before = held.h.at();
        await held.held.release();
        await realWait(80);
        expect(screen.queryByRole('combobox'), 'no dialog').toBeNull();
        expect(isOpen()).toBe(false);
        expect(held.h.at(), 'no entry written').toEqual(before);
        expect(useAppStore.getState().view).toBe('explore');
        expect(await held.h.back(), 'and Back still finds nothing to close').toBe('nothing before');
      });
    }
  });
});
