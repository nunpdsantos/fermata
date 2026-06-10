import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registerInstrumentVoices } from '../instrumentVoices';
import { setInstrumentVoice } from '../../core/services/audio';
import * as sampler from '../pianoSampler';
import * as ks from '../karplusStrong';
import { useAppStore } from '../../state/store';

vi.mock('../../core/services/audio', () => ({
  setInstrumentVoice: vi.fn(),
}));

vi.mock('../pianoSampler', () => ({
  playNote: vi.fn(() => true),
  startNote: vi.fn(() => true),
  stopNote: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
  preload: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../karplusStrong', () => ({
  playNote: vi.fn(),
  startNote: vi.fn(),
  stopNote: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
}));

const mockedSetVoice = vi.mocked(setInstrumentVoice);

let unsubscribe: (() => void) | null = null;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  useAppStore.setState({ instrument: 'piano', volume: 0.7 });
});

afterEach(() => {
  unsubscribe?.();
  unsubscribe = null;
  vi.useRealTimers();
});

describe('registerInstrumentVoices', () => {
  it('registers the piano voice at boot when the instrument is piano', () => {
    unsubscribe = registerInstrumentVoices();

    expect(mockedSetVoice).toHaveBeenCalledTimes(1);
    const voice = mockedSetVoice.mock.calls[0][0]!;
    expect(voice.playNote(60, 0, 0.5, 0.5)).toBe(true);
    expect(sampler.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);
    expect(ks.playNote).not.toHaveBeenCalled();
  });

  it('registers the guitar voice at boot when the persisted instrument is guitar', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();

    const voice = mockedSetVoice.mock.calls[0][0]!;
    expect(voice.playNote(60, 0, 0.5, 0.5)).toBe(true);
    expect(ks.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);
    expect(sampler.playNote).not.toHaveBeenCalled();
  });

  it('swaps the voice on instrument change and pushes the session volume', () => {
    unsubscribe = registerInstrumentVoices();

    useAppStore.setState({ instrument: 'guitar', volume: 0.4 });
    expect(mockedSetVoice).toHaveBeenCalledTimes(2);
    expect(ks.setVolume).toHaveBeenCalledWith(0.4);
    const guitarVoice = mockedSetVoice.mock.calls[1][0]!;
    guitarVoice.playNote(60, 0, 0.5, 0.5);
    expect(ks.playNote).toHaveBeenCalled();

    useAppStore.setState({ instrument: 'piano' });
    expect(mockedSetVoice).toHaveBeenCalledTimes(3);
    expect(sampler.setVolume).toHaveBeenCalledWith(0.4);
  });

  it('ignores store changes that do not flip the instrument', () => {
    unsubscribe = registerInstrumentVoices();

    useAppStore.setState({ volume: 0.2 });
    expect(mockedSetVoice).toHaveBeenCalledTimes(1);
  });

  it('kicks off sampler preload even when booting into guitar', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();

    vi.advanceTimersByTime(1100); // jsdom has no requestIdleCallback → setTimeout(1000) branch
    expect(sampler.preload).toHaveBeenCalled();
  });

  it('adapts the full InstrumentVoice contract onto the KS engine', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();
    const voice = mockedSetVoice.mock.calls[0][0]!;

    expect(voice.startNote(60, 0.5)).toBe(true);
    expect(ks.startNote).toHaveBeenCalledWith(60);

    voice.stopNote(60);
    expect(ks.stopNote).toHaveBeenCalledWith(60);

    voice.setVolume(0.3);
    expect(ks.setVolume).toHaveBeenCalledWith(0.3);

    void voice.resume();
    expect(ks.resumeContext).toHaveBeenCalled();
  });
});
