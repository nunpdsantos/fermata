/**
 * Audit W2-07 review B1 — the chord panel's Play sounds the keys the piano
 * shows for the chord (inversions and slash basses included), and lights
 * exactly those keys while it sounds.
 */
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen, fireEvent, act, renderHook } from '@testing-library/react';
import type { Chord, Note } from '../../../core/types/music';
import { CurrentChordPanel } from '../CurrentChordPanel';
import { buildChord } from '../../../core/constants/chords';
import { useAppStore } from '../../../state/store';
import { useKeyContext } from '../../../hooks/useKeyContext';
import * as audio from '../../../core/services/audio';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => make(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});

const heard: number[] = [];

beforeAll(() => {
  const param = () => ({ value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn(), cancelScheduledValues: vi.fn() });
  const ctx = {
    sampleRate: 44100, state: 'running', currentTime: 0, destination: {},
    resume: vi.fn().mockResolvedValue(undefined), close: vi.fn(),
    createGain: vi.fn(() => ({ gain: param(), connect: vi.fn(), disconnect: vi.fn() })),
    createOscillator: vi.fn(() => ({ type: 'sine', frequency: { value: 0 }, detune: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn(), onended: null })),
    createDynamicsCompressor: vi.fn(() => ({ threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 }, attack: { value: 0 }, release: { value: 0 }, connect: vi.fn() })),
    createConvolver: vi.fn(() => ({ buffer: null, connect: vi.fn() })),
    createBiquadFilter: vi.fn(() => ({ type: 'lowpass', frequency: { value: 0 }, Q: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() })),
    createBuffer: vi.fn((c: number, l: number, sr: number) => ({ numberOfChannels: c, length: l, sampleRate: sr, getChannelData: vi.fn(() => new Float32Array(l)) })),
  };
  vi.stubGlobal('AudioContext', function MockAudioContext() { return ctx; } as unknown as typeof AudioContext);
  audio.setInstrumentVoice({
    playNote: (midi: number) => { heard.push(midi); return true; },
    startNote: () => true, stopNote: () => {}, setVolume: () => {}, resume: () => Promise.resolve(), cancelScheduled: () => {},
  });
});

afterEach(() => {
  cleanup();
  heard.length = 0;
  useAppStore.setState({ activeNotes: new Set<number>() });
});

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const sorted = (xs: Iterable<number>) => [...xs].sort((a, b) => a - b);

async function playAndCompare(chord: Chord, inversion: number, baseOctave: number) {
  useAppStore.setState({ selectedKey: toNote('C'), selectedScale: 'major', selectedChord: chord, chordInversion: inversion, baseOctave, exerciseInputActive: false });
  const lit = sorted(renderHook(() => useKeyContext()).result.current.chordVoicingMidi);
  render(<CurrentChordPanel chord={chord} />);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Chord' })); });
  const litWhilePlaying = sorted(useAppStore.getState().activeNotes);
  return { heard: sorted(heard), lit, litWhilePlaying };
}

describe('chord panel Play — heard == lit', () => {
  const CASES: [string, Chord, number, number][] = [
    ['F major @1', buildChord(toNote('F'), 'major'), 0, 1],
    ['C major 1st inv @3', buildChord(toNote('C'), 'major'), 1, 3],
    ['G7 2nd inv @2', buildChord(toNote('G'), 'dominant7'), 2, 2],
    ['Dm7/G @2', { ...buildChord(toNote('D'), 'minor7'), bassNote: toNote('G') }, 0, 2],
    ['Cmaj9 @4', buildChord(toNote('C'), 'major9'), 0, 4],
  ];
  it.each(CASES)('%s', async (_label, chord, inversion, oct) => {
    const r = await playAndCompare(chord, inversion, oct);
    expect(r.heard).toEqual(r.lit);
    expect(r.litWhilePlaying).toEqual(r.lit);
  });
});
