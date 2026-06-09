/**
 * Tests for ChordBuilderPanel — Task 6 (ws4-explore-unify):
 *   (a) recognised chord → selectedChord set live (not gated on Play)
 *   (b) unrecognised note-set → selectedChord cleared to null
 *   (c) ChordBuilderStaff NOT rendered (no "Staff" label / register toggles)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ChordBuilderPanel } from '../ChordBuilderPanel';
import { useAppStore } from '../../../state/store';

afterEach(cleanup);

// Silence audio in tests.
vi.mock('../../../core/services/audio.ts', () => ({
  resumeAudio: vi.fn(() => Promise.resolve()),
  playChordVoiced: vi.fn(),
}));

vi.mock('../../../services/synthConfig.ts', () => ({
  getSynthConfig: vi.fn(() => ({})),
}));

// framer-motion → plain HTML.
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

// Keep StaffNotation inert (VexFlow not available in jsdom).
vi.mock('../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return {
    StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }),
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
    synthPreset: 'piano',
    baseOctave: 4,
  });
});

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * The chromatic strip renders 13 buttons inside a container with
 * role="group".  The first 4 non-strip buttons in the panel are:
 *   [0] chord-root <select> (not a button)
 *   buttons: Clear, Sync root to tonic, Play  → indices 0, 1, 2
 *
 * Strip buttons appear AFTER the control buttons.  Since the panel renders
 * them in markup order:
 *   Clear(0) | Sync(1) | Play(2) | strip-btn-0 … strip-btn-12
 *
 * We get the strip group via its aria-label and query buttons inside it.
 */
function getStripButton(step: number): HTMLElement {
  const group = document.querySelector('[aria-label^="Chromatic strip"]') as HTMLElement | null;
  if (!group) throw new Error('Chromatic strip group not found');
  const buttons = group.querySelectorAll('button');
  if (!buttons[step]) throw new Error(`No strip button at step ${step}`);
  return buttons[step] as HTMLElement;
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe('ChordBuilderPanel — live selectedChord', () => {
  it('(a) sets selectedChord when toggled notes form a recognised chord (C major: steps 0+4+7)', async () => {
    render(<ChordBuilderPanel />);

    // Steps 4 and 7 added to the already-active step 0 → C E G = C major.
    await act(async () => { fireEvent.click(getStripButton(4)); });
    await act(async () => { fireEvent.click(getStripButton(7)); });

    const chord = useAppStore.getState().selectedChord;
    expect(chord).not.toBeNull();
    expect(chord?.root.natural).toBe('C');
    expect(chord?.quality).toBe('major');
  });

  it('(b) clears selectedChord when notes do NOT form a recognised chord (only root, step 0)', async () => {
    const { buildChord } = await import('../../../core/constants/chords');
    // Pre-seed a chord in the store; panel mount should clear it because
    // step 0 alone is not a recognised chord.
    useAppStore.setState({
      selectedChord: buildChord({ natural: 'C', accidental: '' }, 'major'),
    });

    render(<ChordBuilderPanel />);

    // The effect fires on mount with only step 0 active → selectedChord → null.
    const chord = useAppStore.getState().selectedChord;
    expect(chord).toBeNull();
  });

  it('Play does NOT mutate selectedChord — selection is live (set by effect, not Play)', async () => {
    render(<ChordBuilderPanel />);

    // Build C major.
    await act(async () => { fireEvent.click(getStripButton(4)); });
    await act(async () => { fireEvent.click(getStripButton(7)); });

    expect(useAppStore.getState().selectedChord).not.toBeNull();

    // Manually wipe it.
    useAppStore.setState({ selectedChord: null });

    // Click Play; it should play audio but NOT restore selectedChord.
    const playBtn = screen.getByRole('button', { name: /play/i });
    await act(async () => { fireEvent.click(playBtn); });

    expect(useAppStore.getState().selectedChord).toBeNull();
  });
});

describe('ChordBuilderPanel — ChordBuilderStaff not rendered', () => {
  it('(c) does not render the "Staff" label that ChordBuilderStaff uniquely emits', async () => {
    render(<ChordBuilderPanel />);

    // Activate notes so ChordBuilderStaff would have rendered (if present).
    await act(async () => { fireEvent.click(getStripButton(4)); });
    await act(async () => { fireEvent.click(getStripButton(7)); });

    // ChordBuilderStaff renders t('chordBuilder.staff') = "Staff".
    expect(screen.queryByText('Staff')).toBeNull();
  });

  it('(c) does not render the register toggle buttons (Low/Mid/High) that only ChordBuilderStaff emits', async () => {
    render(<ChordBuilderPanel />);

    await act(async () => { fireEvent.click(getStripButton(4)); });

    expect(screen.queryByRole('button', { name: 'Low' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Mid' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'High' })).toBeNull();
  });
});
