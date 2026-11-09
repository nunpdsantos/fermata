import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { ExploreView } from '../ExploreView';
import { useAppStore } from '../../state/store';
import { buildChord } from '../../core/constants/chords';

// Record playback calls in order (Play re-trigger test, W8-01).
const audioLog: string[] = [];
vi.mock('../../core/services/audio', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../core/services/audio')>();
  return {
    ...original,
    resumeAudio: vi.fn(async () => {}),
    playScale: vi.fn(() => {
      audioLog.push('playScale');
    }),
    cancelScheduledAudio: vi.fn(() => {
      audioLog.push('cancelScheduledAudio');
    }),
    // Must NOT be used by the re-trigger: it would also clear other
    // components' visual timeouts (round-2 review B2).
    stopPlayback: vi.fn(() => {
      audioLog.push('stopPlayback');
    }),
  };
});

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
// workspace lazy-imports it via `import('../notation/StaffNotation.tsx')` then
// reads `m.StaffNotation`; we provide a trivial named export with a testid we
// can await to flush the Suspense boundary deterministically. (Mirrors the
// mock approach in ChordWorkspace.test.tsx.)
vi.mock('../../components/notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return {
    StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }),
  };
});

const cMajor = buildChord({ natural: 'C', accidental: '' }, 'major');

beforeEach(() => {
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
    synthPreset: 'piano',
    volume: 0.7,
    view: 'explore',
    detailPanelOpen: false,
    quickSearchOpen: false,
    colorMode: 'functional',
    scaleOctaves: 1,
    baseOctave: 4,
    guitarTuningId: 'standard',
    themeMode: 'fermata',
    comparisonScale: null,
    language: 'en',
  });
});

describe('ExploreView — unified ChordWorkspace (no auto-pop sidebar)', () => {
  it('with a chord selected, renders CurrentChordPanel INLINE (Voicing radiogroup present)', async () => {
    useAppStore.setState({ selectedChord: cMajor });
    render(<ExploreView />);
    await screen.findAllByTestId('staff-mock'); // flush lazy staff

    // CurrentChordPanel rendered inside the workspace: its inversion radiogroup
    // + Voicing heading prove the chord detail is inline, not in a sidebar.
    expect(screen.getByRole('radiogroup', { name: 'Chord inversion' })).toBeDefined();
    expect(screen.getByText('Voicing')).toBeDefined();
  });

  it('does NOT render a DetailPanel sidebar (no "Close panel" control) when a chord is selected', async () => {
    useAppStore.setState({ selectedChord: cMajor });
    render(<ExploreView />);
    await screen.findAllByTestId('staff-mock');

    // The auto-pop sidebar is gone: there must be no panel close-button.
    expect(screen.queryByRole('button', { name: 'Close panel' })).toBeNull();
    expect(screen.queryByLabelText('Close panel')).toBeNull();
  });

  it('does not render a standalone "Details" button in the scale hero', async () => {
    render(<ExploreView />);
    await screen.findAllByTestId('staff-mock');

    // The hero's Details button (which opened the sidebar) was removed; Play /
    // Copy / Print remain.
    expect(screen.queryByRole('button', { name: 'Details' })).toBeNull();
  });
});

// Ledger W8-01 (F-02): pressing Play again layered a second copy of the scale
// over the first. Each Play now stops what is still scheduled first.
describe('ExploreView — Play restarts cleanly', () => {
  it('stops the previous playback before scheduling the scale again', async () => {
    audioLog.length = 0;
    render(<ExploreView />);
    await screen.findAllByTestId('staff-mock');
    const play = screen.getByRole('button', { name: 'Play scale ascending' });
    await act(async () => {
      fireEvent.click(play);
    });
    await act(async () => {
      fireEvent.click(play);
    });
    expect(audioLog).toEqual(['cancelScheduledAudio', 'playScale', 'cancelScheduledAudio', 'playScale']);
  });
});

describe('ExploreView — opens without moving focus (design review / audit W2-03)', () => {
  it('mounting Explore (circle of fifths included) focuses nothing, so the page does not scroll', async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus').mockImplementation(() => {});
    const svgFocusSpy = vi.spyOn(SVGElement.prototype, 'focus').mockImplementation(() => {});
    render(<ExploreView />);
    await screen.findAllByTestId('staff-mock');
    expect(document.activeElement).toBe(document.body);
    expect(focusSpy).not.toHaveBeenCalled();
    expect(svgFocusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
    svgFocusSpy.mockRestore();
  });
});

// The practice panel itself is not under test here (guitar-practice tests own it).
vi.mock('../../components/practice/GuitarPractice.tsx', async () => {
  const React = await import('react');
  return { default: () => React.createElement('div', { 'data-testid': 'practice-mock' }) };
});

// 2026-11-09: a guitarist who never switches the dock to Guitar found no
// practice tools. "⋯" now always offers them; the toolbar button is unchanged.
describe('ExploreView — "Practise on the guitar" in the scale actions menu', () => {
  const openMenuItem = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Scale actions' }));
    return screen.getByRole('menuitem', { name: 'Practise on the guitar' });
  };

  it('on the piano: offered in "⋯"; choosing it switches to the guitar and opens the practice panel', async () => {
    render(<ExploreView />);
    await screen.findAllByTestId('staff-mock');
    expect(screen.queryByTestId('practice-open')).toBeNull(); // no toolbar button on the piano (unchanged)
    fireEvent.click(openMenuItem());
    expect(useAppStore.getState().instrument).toBe('guitar');
    expect(await screen.findByRole('dialog', { name: 'Practise on the guitar' })).toBeDefined();
    expect(await screen.findByTestId('practice-mock')).toBeDefined();
    // …and the toolbar button is there now, as it always is on the guitar.
    expect(screen.getByTestId('practice-open')).toBeDefined();
  });

  it('on the guitar: the menu item opens the same panel and leaves the instrument alone', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<ExploreView />);
    await screen.findAllByTestId('staff-mock');
    const setInstrument = vi.spyOn(useAppStore.getState(), 'setInstrument');
    fireEvent.click(openMenuItem());
    expect(setInstrument).not.toHaveBeenCalled();
    expect(useAppStore.getState().instrument).toBe('guitar');
    expect(await screen.findByRole('dialog', { name: 'Practise on the guitar' })).toBeDefined();
    setInstrument.mockRestore();
  });

  it('the menu lists it after Copy / Print / Compare', async () => {
    render(<ExploreView />);
    await screen.findAllByTestId('staff-mock');
    fireEvent.click(screen.getByRole('button', { name: 'Scale actions' }));
    expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual([
      'Copy scale summary to clipboard', 'Print scale diagram', 'Compare scales', 'Practise on the guitar',
    ]);
  });
});
