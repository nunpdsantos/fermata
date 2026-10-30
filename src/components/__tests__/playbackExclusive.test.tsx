/**
 * Audit W8-01 remainder: a new playback stops the previous one, and leaving a
 * view stops what it was playing — Circle of Fifths, Drill answer audio, the
 * chord panel, the chord builder — via core cancelScheduledAudio(), with the
 * key highlights kept consistent with the sound.
 *
 * Real core audio (Web Audio mocked) + a fake instrument voice that logs
 * every scheduled note and every cancel in one timeline.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, renderHook } from '@testing-library/react';
import { installMockAudioContext } from '../../test/mockAudioContext';
import { setInstrumentVoice, stopPlayback, playArpeggioAscending } from '../../core/services/audio';
import { useAppStore } from '../../state/store';
import { buildChord } from '../../core/constants/chords';
import { generateDrillBank } from '../../core/utils/drillBank';
import { playAnswerAudio } from '../drill/answerAudio';
import { CircleOfFifths } from '../theory/CircleOfFifths';
import { CurrentChordPanel } from '../panels/CurrentChordPanel';
import { useStopPlaybackOnViewChange } from '../../hooks/useStopPlaybackOnViewChange';

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
    useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

const timeline: string[] = [];
const voice = {
  playNote: vi.fn((midi: number, _when: number, _duration: number, _velocity: number) => {
    timeline.push(`play:${midi}`);
    return true;
  }),
  startNote: vi.fn((_midi: number, _velocity: number) => true),
  stopNote: vi.fn((_midi: number) => {}),
  setVolume: vi.fn((_volume: number) => {}),
  resume: vi.fn(() => Promise.resolve()),
  cancelScheduled: vi.fn(() => {
    timeline.push('cancel');
  }),
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
  timeline.length = 0;
  setInstrumentVoice(voice);
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    chordInversion: 0,
    activeNotes: new Set<number>(),
    view: 'explore',
    baseOctave: 4,
    language: 'en',
  });
});

afterEach(() => {
  cleanup();
  stopPlayback();
  setInstrumentVoice(null);
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

/** Index of the first 'cancel' after the first `n` scheduled notes. */
function cancelledBetween(firstPlays: number): boolean {
  const plays = timeline.map((e, i) => (e.startsWith('play:') ? i : -1)).filter((i) => i >= 0);
  const cancelAt = timeline.indexOf('cancel', plays[firstPlays - 1]);
  return cancelAt > plays[firstPlays - 1] && cancelAt < plays[firstPlays];
}

describe('a new playback cancels the previous one', () => {
  it('Drill answer audio: the next reveal stops the previous arpeggio first', () => {
    const bank = generateDrillBank();
    const triad = bank.find((i) => i.id === 'triad:name-to-notes:C:major')!;
    const seventh = bank.find((i) => i.id === 'seventh:notes-to-name:C:major7')!;
    playAnswerAudio(triad); // 3 notes
    playAnswerAudio(seventh);
    expect(voice.playNote).toHaveBeenCalledTimes(7);
    expect(cancelledBetween(3)).toBe(true);
  });

  it('Circle of Fifths: clicking a second key stops the first key\'s sound', async () => {
    render(<CircleOfFifths />);
    fireEvent.click(screen.getByRole('button', { name: /select C major$/ }));
    await tick(0);
    const afterFirst = timeline.length;
    expect(timeline.some((e) => e.startsWith('play:'))).toBe(true); // known positive

    fireEvent.click(screen.getByRole('button', { name: /select G major$/ }));
    await tick(0);
    const second = timeline.slice(afterFirst);
    const cancelAt = second.indexOf('cancel');
    const playAt = second.findIndex((e) => e.startsWith('play:'));
    expect(playAt).toBeGreaterThanOrEqual(0);
    expect(cancelAt).toBeGreaterThanOrEqual(0);
    expect(cancelAt).toBeLessThan(playAt);
  });

  it('Chord panel: replaying (another inversion) mid-chord leaves no stale key lit', async () => {
    const chord = buildChord({ natural: 'C', accidental: '' }, 'major');
    useAppStore.setState({ selectedChord: chord });
    render(<CurrentChordPanel chord={chord} />);
    fireEvent.click(screen.getByRole('button', { name: 'Chord' }));
    await tick(300);
    expect(useAppStore.getState().activeNotes.size).toBe(3); // known positive: C4 E4 G4 lit

    fireEvent.click(screen.getByText('1st Inv'));
    fireEvent.click(screen.getByRole('button', { name: 'Chord' }));
    await tick(300);
    expect(voice.cancelScheduled).toHaveBeenCalled();
    await tick(5000);
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
  });

  it('Chord panel: unmounting mid-arpeggio un-lights its keys at once', async () => {
    const chord = buildChord({ natural: 'C', accidental: '' }, 'major7');
    useAppStore.setState({ selectedChord: chord });
    const { unmount } = render(<CurrentChordPanel chord={chord} />);
    fireEvent.click(screen.getByRole('button', { name: 'Arpeggio' }));
    await tick(450);
    expect(useAppStore.getState().activeNotes.size).toBeGreaterThan(0);
    unmount();
    await tick(0);
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
    await tick(5000);
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
  });
});

describe('leaving a view stops its playback', () => {
  it('a view change cancels scheduled sound and settles the phrase visuals', async () => {
    renderHook(() => useStopPlaybackOnViewChange());
    const onDone = vi.fn();
    const onNote = vi.fn();
    playArpeggioAscending(
      [{ natural: 'C', accidental: '' }, { natural: 'E', accidental: '' }, { natural: 'G', accidental: '' }],
      4, 0.3, onNote, onDone,
    );
    await tick(50);
    expect(voice.cancelScheduled).not.toHaveBeenCalled();

    act(() => useAppStore.getState().setView('learn'));
    expect(voice.cancelScheduled).toHaveBeenCalledTimes(1);
    expect(onDone).toHaveBeenCalledTimes(1);
    await tick(5000);
    expect(onNote).toHaveBeenCalledTimes(1);
  });

  it('staying on the same view never cancels', async () => {
    renderHook(() => useStopPlaybackOnViewChange());
    act(() => useAppStore.setState({ selectedScale: 'dorian' }));
    expect(voice.cancelScheduled).not.toHaveBeenCalled();
  });
});
