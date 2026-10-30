/**
 * Round-2 review B2: Explore's Play-scale re-trigger called core
 * stopPlayback(), which clears EVERY tracked core timeout — including the
 * chord panel's Arpeggio visual callbacks. Its onComplete (which un-lights the
 * keys) then never ran, so pressing Play scale mid-arpeggio left keys lit
 * until a view change.
 *
 * Real core audio (only Web Audio mocked) + a fake instrument voice, so the
 * arpeggio's visual timeouts are the real tracked ones.
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { ExploreView } from '../ExploreView';
import { useAppStore } from '../../state/store';
import { buildChord } from '../../core/constants/chords';
import { setInstrumentVoice } from '../../core/services/audio';
import { installMockAudioContext } from '../../test/mockAudioContext';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  function makeMotion(tag: string) {
    const cached = cache.get(tag);
    if (cached) return cached;
    const Comp = function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
    cache.set(tag, Comp);
    return Comp;
  }
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    motion: proxy,
    m: proxy,
    useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

vi.mock('../../components/notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }) };
});

const voice = {
  playNote: vi.fn((_midi: number, _when: number, _duration: number, _velocity: number) => true),
  startNote: vi.fn((_midi: number, _velocity: number) => true),
  stopNote: vi.fn((_midi: number) => {}),
  setVolume: vi.fn((_volume: number) => {}),
  resume: vi.fn(() => Promise.resolve()),
  cancelScheduled: vi.fn(() => {}),
};

const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  vi.useFakeTimers();
  installMockAudioContext(1);
  vi.clearAllMocks();
  setInstrumentVoice(voice);
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: buildChord({ natural: 'C', accidental: '' }, 'major'),
    chordInversion: 0,
    activeNotes: new Set<number>(),
    view: 'explore',
    baseOctave: 4,
    language: 'en',
  });
});

afterEach(() => {
  cleanup();
  setInstrumentVoice(null);
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function renderExplore() {
  render(<ExploreView />);
  await tick(50); // flush the lazy staff
  expect(screen.getAllByTestId('staff-mock').length).toBeGreaterThan(0);
}

describe('Explore playback restart keeps the chord panel highlights consistent (B2)', () => {
  it('control: the arpeggio alone lights keys and un-lights them when it ends', async () => {
    await renderExplore();
    fireEvent.click(screen.getByRole('button', { name: 'Arpeggio' }));
    await tick(400);
    expect(useAppStore.getState().activeNotes.size).toBeGreaterThan(0); // known positive: keys light
    await tick(6000);
    expect(useAppStore.getState().activeNotes.size).toBe(0);
  });

  it('Play scale pressed mid-arpeggio still leaves no keys lit once both have finished', async () => {
    await renderExplore();
    fireEvent.click(screen.getByRole('button', { name: 'Arpeggio' }));
    await tick(500);
    expect(useAppStore.getState().activeNotes.size).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'Play scale ascending' }));
    await tick(6000);

    // The re-trigger must still cancel what the voice had scheduled…
    expect(voice.cancelScheduled).toHaveBeenCalled();
    // …without killing the arpeggio's un-light callback.
    expect(useAppStore.getState().activeNotes.size).toBe(0);
  });
});
