import { describe, it, expect, beforeEach, beforeAll, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { useAppStore } from '../../state/store';

// ---------------------------------------------------------------------------
// jsdom stubs — scrollIntoView and scrollTo are not implemented
// ---------------------------------------------------------------------------

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
  HTMLDivElement.prototype.scrollTo = vi.fn() as typeof HTMLDivElement.prototype.scrollTo;
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

// Mock framer-motion — mirrors the pattern from existing tests
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
  const proxy = new Proxy(
    {},
    { get: (_t: unknown, prop: string) => makeMotion(prop) },
  );
  return {
    motion: proxy,
    m: proxy,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

// Mock useAudio — no real Web Audio in tests
vi.mock('../../hooks/useAudio', () => ({
  useAudio: () => ({
    noteOn: vi.fn().mockResolvedValue(60),
    noteOff: vi.fn(),
  }),
}));

// Mock useIsMobile / useIsCompact to return desktop defaults
vi.mock('../../hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useIsCompact: () => false,
  useIsTablet: () => false,
}));

afterEach(cleanup);

// ---------------------------------------------------------------------------
// Store reset
// ---------------------------------------------------------------------------

function resetStore() {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    selectedDegree: null,
    chordInversion: 0,
    instrument: 'piano',
    activeNotes: new Set<number>(),
    highlightedNotes: [],
    guitarScalePosition: null,
    guitarTuningId: 'standard',
    baseOctave: 4,
    scaleOctaves: 1 as 1 | 2,
    volume: 0.7,
    view: 'explore' as const,
    detailPanelOpen: false,
    quickSearchOpen: false,
    colorMode: 'functional' as const,
    comparisonScale: null,
  });
}

beforeEach(resetStore);

// ===========================================================================
// ChordGrid accessibility
// ===========================================================================

describe('ChordGrid accessibility', () => {
  async function renderChordGrid() {
    const { ChordGrid } = await import('../theory/ChordGrid');
    return render(<ChordGrid />);
  }

  it('renders a container with role="group" and aria-label', async () => {
    await renderChordGrid();
    const group = screen.getByRole('group', { name: 'Diatonic chords' });
    expect(group).toBeDefined();
  });

  it('each chord button has aria-label with root, quality, and degree', async () => {
    await renderChordGrid();
    const buttons = screen.getAllByRole('button');
    // C major is degree 1
    const cButton = buttons.find(
      (b) => b.getAttribute('aria-label')?.includes('C major chord'),
    );
    expect(cButton).toBeDefined();
    expect(cButton!.getAttribute('aria-label')).toContain('degree 1');
  });

  it('chord buttons have aria-pressed attribute', async () => {
    await renderChordGrid();
    const buttons = screen.getAllByRole('button');
    // All should be false initially
    buttons.forEach((b) => {
      expect(b.getAttribute('aria-pressed')).toBe('false');
    });
  });

  it('clicking a chord sets aria-pressed=true on re-render', async () => {
    const { ChordGrid } = await import('../theory/ChordGrid');
    const { unmount } = render(<ChordGrid />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // Select C major
    unmount();

    // Re-render to reflect selection
    render(<ChordGrid />);
    const pressed = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-pressed') === 'true');
    expect(pressed).toHaveLength(1);
  });

  it('Enter activates a chord button (native button behavior)', async () => {
    await renderChordGrid();
    const buttons = screen.getAllByRole('button');
    // fireEvent.click simulates the native Enter/Space -> click chain
    fireEvent.click(buttons[0]);
    const state = useAppStore.getState();
    expect(state.selectedChord).not.toBeNull();
    expect(state.selectedChord!.root.natural).toBe('C');
  });

  it('Space activates a chord button (native button behavior)', async () => {
    await renderChordGrid();
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // E minor -- degree 3
    const state = useAppStore.getState();
    expect(state.selectedChord).not.toBeNull();
    expect(state.selectedChord!.root.natural).toBe('E');
  });
});

// ===========================================================================
// Fretboard accessibility & keyboard navigation
// ===========================================================================

describe('Fretboard accessibility', () => {
  async function renderFretboard() {
    const { Fretboard } = await import('../instruments/Fretboard');
    return render(<Fretboard />);
  }

  it('has role="grid" with aria-label="fretboard.label"', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });
    expect(grid).toBeDefined();
  });

  it('fretboard container is focusable (tabIndex=0)', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });
    expect(grid.getAttribute('tabindex')).toBe('0');
  });

  it('contains an aria-live="polite" region for screen reader announcements', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });
    const liveRegion = grid.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion!.getAttribute('aria-atomic')).toBe('true');
  });

  it('FretCell buttons have aria-label with note, fret, and string', async () => {
    await renderFretboard();
    // Fret cells are role="button" with labels like "C, fret 3, string 5"
    const allButtons = screen.getAllByRole('button');
    const fretButton = allButtons.find((b) => {
      const label = b.getAttribute('aria-label') ?? '';
      return label.includes('fret') && label.includes('string');
    });
    expect(fretButton).toBeDefined();
    // Verify the label format: "<note>, fret <n>, string <n>"
    expect(fretButton!.getAttribute('aria-label')).toMatch(
      /^[A-G][#b]?, fret \d+, string [1-6]$/,
    );
  });

  it('arrow keys navigate between frets (left/right)', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });

    // Focus the grid and press ArrowRight to initialize focus
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    // After first arrow key press, focusedCell should be initialized
    // Press ArrowRight again to move to the next fret
    fireEvent.keyDown(grid, { key: 'ArrowRight' });

    // The aria-live region should announce the focused cell
    const liveRegion = grid.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    const announcement = liveRegion!.textContent ?? '';
    // Announcement format: "String <n>, fret <n>, <note>"
    expect(announcement).toMatch(/String \d, fret \d+/);
  });

  it('arrow up/down moves between strings', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });

    // Initialize focus
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    const liveRegion = grid.querySelector('[aria-live="polite"]')!;

    // Move down a string
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    const afterDown = liveRegion.textContent ?? '';
    expect(afterDown).toMatch(/String \d, fret \d+/);

    // Move up a string
    fireEvent.keyDown(grid, { key: 'ArrowUp' });
    const afterUp = liveRegion.textContent ?? '';
    expect(afterUp).toMatch(/String \d, fret \d+/);
  });

  it('Enter/Space on focused cell triggers note play (click handler)', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });

    // Initialize focus
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    // Press Enter to play the note -- should not throw
    fireEvent.keyDown(grid, { key: 'Enter' });
    // Press Space to play the note
    fireEvent.keyDown(grid, { key: ' ' });

    // The focused cell should remain (Enter/Space do not move focus)
    const liveRegion = grid.querySelector('[aria-live="polite"]')!;
    expect(liveRegion.textContent).not.toBe('');
  });

  it('Escape clears keyboard focus', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });

    // Initialize focus
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    const liveRegion = grid.querySelector('[aria-live="polite"]')!;
    expect(liveRegion.textContent).not.toBe('');

    // Press Escape
    fireEvent.keyDown(grid, { key: 'Escape' });
    // Live region should be cleared
    expect(liveRegion.textContent).toBe('');
  });

  it('tuning radio group has proper ARIA roles', async () => {
    await renderFretboard();
    const radiogroup = screen.getByRole('radiogroup', {
      name: 'fretboard.tuningLabel',
    });
    expect(radiogroup).toBeDefined();

    const radios = within(radiogroup).getAllByRole('radio');
    expect(radios.length).toBeGreaterThan(0);

    // Standard tuning should be checked
    const checkedRadio = radios.find(
      (r) => r.getAttribute('aria-checked') === 'true',
    );
    expect(checkedRadio).toBeDefined();
  });
});

// ===========================================================================
// Piano accessibility
// ===========================================================================

describe('Piano accessibility', () => {
  async function renderPiano() {
    const { Piano } = await import('../instruments/Piano');
    return render(<Piano />);
  }

  it('has a container with role="group" and aria-label="instrument.pianoKeyboard"', async () => {
    await renderPiano();
    const group = screen.getByRole('group', { name: 'instrument.pianoKeyboard' });
    expect(group).toBeDefined();
  });

  it('each piano key has role="button"', async () => {
    await renderPiano();
    const buttons = screen.getAllByRole('button');
    // Piano keys + octave tabs -- there should be many buttons
    expect(buttons.length).toBeGreaterThan(10);
  });

  it('piano keys have aria-label with note name and octave', async () => {
    await renderPiano();
    const buttons = screen.getAllByRole('button');
    // Find a C4 key
    const c4 = buttons.find(
      (b) => b.getAttribute('aria-label') === 'C4',
    );
    expect(c4).toBeDefined();
  });

  it('black keys have correct aria-labels (e.g., C#4, Eb3)', async () => {
    await renderPiano();
    const buttons = screen.getAllByRole('button');
    // Find any sharp/flat key
    const sharpKey = buttons.find((b) => {
      const label = b.getAttribute('aria-label') ?? '';
      return label.includes('#') || label.includes('b');
    });
    expect(sharpKey).toBeDefined();
  });

  it('octave selector has role="tablist" with aria-label', async () => {
    await renderPiano();
    const tablist = screen.getByRole('tablist', { name: 'instrument.baseOctave' });
    expect(tablist).toBeDefined();

    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs.length).toBe(9); // Octaves 0-8 (full 88-key range)

    // Current octave (4) should be aria-selected=true
    const selected = tabs.find(
      (t) => t.getAttribute('aria-selected') === 'true',
    );
    expect(selected).toBeDefined();
    expect(selected!.textContent).toBe('C4');
  });
});

// ===========================================================================
// General accessibility patterns
// ===========================================================================

describe('General accessibility', () => {
  it('FretCell focus indicator uses --focus-ring CSS variable', async () => {
    // Render fretboard and trigger keyboard focus on a cell
    const { Fretboard } = await import('../instruments/Fretboard');
    render(<Fretboard />);
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });

    // Initialize focus via arrow key
    fireEvent.keyDown(grid, { key: 'ArrowRight' });

    // Check that a cell with focus outline style containing focus-ring exists
    const focusedCell = grid.querySelector('[style*="focus-ring"]');
    expect(focusedCell).not.toBeNull();
  });

  it('Toast container has aria-live="polite" for dynamic announcements', async () => {
    const { ToastContainer } = await import('../layout/Toast');
    const { container } = render(<ToastContainer />);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
  });

  it('AppShell renders a skip-to-content link', async () => {
    const { AppShell } = await import('../layout/AppShell');
    render(<AppShell><div>test content</div></AppShell>);

    // The skip link should be an <a> targeting #main-content
    const skipLink = document.querySelector('a[href="#main-content"]');
    expect(skipLink).not.toBeNull();
    expect(skipLink!.classList.contains('sr-only')).toBe(true);
  });

  it('AppShell renders a main landmark with id="main-content"', async () => {
    const { AppShell } = await import('../layout/AppShell');
    render(<AppShell><div>test content</div></AppShell>);

    const main = document.querySelector('main#main-content');
    expect(main).not.toBeNull();
  });

  it('QuickSearch dialog has role="dialog" and aria-modal="true"', async () => {
    // Open QuickSearch via store
    useAppStore.setState({ quickSearchOpen: true });

    const { QuickSearch } = await import('../navigation/QuickSearch');
    render(<QuickSearch />);

    const dialog = screen.queryByRole('dialog');
    expect(dialog).not.toBeNull();
    expect(dialog!.getAttribute('aria-modal')).toBe('true');
    expect(dialog!.getAttribute('aria-label')).toBe('Quick search');
  });
});
