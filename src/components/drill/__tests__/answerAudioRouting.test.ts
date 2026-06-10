/**
 * Drill answer audio follows the SELECTED INSTRUMENT (WS10).
 *
 * The other answerAudio suite mocks core audio wholesale to assert *what* plays.
 * This suite proves *which voice* plays: playAnswerAudio routes through the same
 * core arpeggio path the Explore play buttons use, so the instrument voice
 * registered by registerInstrumentVoices() (piano sampler vs. guitar
 * sampler/KS, per store.instrument) is what sounds the reveal.
 *
 * Approach: real core audio + a mocked AudioContext, with the sampler/KS engines
 * mocked. We register the voices, flip the store, fire playAnswerAudio, and
 * assert the note reached the engine for the selected instrument.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { playAnswerAudio } from '../answerAudio';
import { registerInstrumentVoices } from '../../../services/instrumentVoices';
import { setInstrumentVoice } from '../../../core/services/audio';
import { generateDrillBank } from '../../../core/utils/drillBank';
import type { DrillItem } from '../../../core/types/drill';
import * as pianoSampler from '../../../services/pianoSampler';
import * as guitarSampler from '../../../services/guitarSampler';
import * as ks from '../../../services/karplusStrong';
import { useAppStore } from '../../../state/store';

// Sampler/KS engines mocked. The samplers report "ready" so the guitar path
// resolves to the guitar sampler (not the KS fallback) for the routing check.
vi.mock('../../../services/pianoSampler', () => ({
  playNote: vi.fn(() => true),
  startNote: vi.fn(() => true),
  stopNote: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
  preload: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../../../services/guitarSampler', () => ({
  playNote: vi.fn(() => true),
  startNote: vi.fn(() => true),
  stopNote: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
  preload: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../../../services/karplusStrong', () => ({
  playNote: vi.fn(),
  startNote: vi.fn(),
  stopNote: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
}));

// Minimal AudioContext for core audio (it builds gain/reverb/compressor nodes
// and reads currentTime; the registered voice intercepts playNote before any
// oscillator is created, so these only need to exist).
function makeParam() {
  return {
    value: 0,
    setValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
  };
}
class MockAudioContext {
  state = 'running';
  currentTime = 0;
  sampleRate = 44100;
  destination = {};
  resume = vi.fn(async () => {});
  close = vi.fn();
  createGain() {
    return { gain: makeParam(), connect: vi.fn(), disconnect: vi.fn() };
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: makeParam(),
      detune: makeParam(),
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
      onended: null,
    };
  }
  createBiquadFilter() {
    return { type: 'lowpass', frequency: makeParam(), Q: makeParam(), connect: vi.fn(), disconnect: vi.fn() };
  }
  createConvolver() {
    return { buffer: null, connect: vi.fn() };
  }
  createDynamicsCompressor() {
    return {
      threshold: makeParam(), knee: makeParam(), ratio: makeParam(),
      attack: makeParam(), release: makeParam(), connect: vi.fn(),
    };
  }
  createBuffer() {
    return { getChannelData: () => new Float32Array(8) };
  }
}

const BANK: DrillItem[] = generateDrillBank();
const CHORD_ITEM = BANK.find((i) => i.id === 'triad:name-to-notes:C:major')!;

let unsubscribe: (() => void) | null = null;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.stubGlobal('AudioContext', MockAudioContext as unknown as typeof AudioContext);
  vi.mocked(pianoSampler.playNote).mockReturnValue(true);
  vi.mocked(guitarSampler.playNote).mockReturnValue(true);
});

afterEach(() => {
  unsubscribe?.();
  unsubscribe = null;
  setInstrumentVoice(null);
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('drill answer audio follows the selected instrument', () => {
  it('sounds the GUITAR sampler when the fretboard is selected', () => {
    useAppStore.setState({ instrument: 'guitar', volume: 0.7 });
    unsubscribe = registerInstrumentVoices();

    playAnswerAudio(CHORD_ITEM); // C major triad → C E G arpeggio

    expect(guitarSampler.playNote).toHaveBeenCalled();
    expect(pianoSampler.playNote).not.toHaveBeenCalled();
    // Three chord tones routed through the guitar voice.
    expect(vi.mocked(guitarSampler.playNote).mock.calls.length).toBe(3);
  });

  it('sounds the PIANO sampler when the keyboard is selected', () => {
    useAppStore.setState({ instrument: 'piano', volume: 0.7 });
    unsubscribe = registerInstrumentVoices();

    playAnswerAudio(CHORD_ITEM);

    expect(pianoSampler.playNote).toHaveBeenCalled();
    expect(guitarSampler.playNote).not.toHaveBeenCalled();
    expect(vi.mocked(pianoSampler.playNote).mock.calls.length).toBe(3);
  });

  it('falls back to Karplus-Strong on guitar while the samples are still decoding', () => {
    useAppStore.setState({ instrument: 'guitar', volume: 0.7 });
    vi.mocked(guitarSampler.playNote).mockReturnValue(false); // not ready yet
    unsubscribe = registerInstrumentVoices();

    playAnswerAudio(CHORD_ITEM);

    expect(ks.playNote).toHaveBeenCalled();
    expect(vi.mocked(ks.playNote).mock.calls.length).toBe(3);
  });
});
