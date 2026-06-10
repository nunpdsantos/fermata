import { describe, it, expect, beforeEach, vi } from 'vitest';
import type * as AudioModule from '../audio';
import type { Note, NaturalNote } from '../../types/music';

const N = (natural: NaturalNote): Note => ({ natural, accidental: '' });

// ---------------------------------------------------------------------------
// Mock AudioContext (pattern from src/services/__tests__/karplusStrong.test.ts)
// ---------------------------------------------------------------------------

function makeGainParam() {
  return {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
  };
}

function setupMockAudioContext() {
  const oscillators: Array<{
    type: string;
    frequency: { value: number };
    detune: { value: number };
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    onended: (() => void) | null;
  }> = [];

  const mockCtx = {
    sampleRate: 44100,
    state: 'running' as AudioContextState,
    currentTime: 0,
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn(),
    createGain: vi.fn(() => ({ gain: makeGainParam(), connect: vi.fn(), disconnect: vi.fn() })),
    createOscillator: vi.fn(() => {
      const osc = {
        type: 'sine',
        frequency: { value: 0 },
        detune: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
        onended: null as (() => void) | null,
      };
      oscillators.push(osc);
      return osc;
    }),
    createDynamicsCompressor: vi.fn(() => ({
      threshold: { value: 0 },
      knee: { value: 0 },
      ratio: { value: 0 },
      attack: { value: 0 },
      release: { value: 0 },
      connect: vi.fn(),
    })),
    createConvolver: vi.fn(() => ({ buffer: null, connect: vi.fn() })),
    createBiquadFilter: vi.fn(() => ({
      type: 'lowpass',
      frequency: { value: 0 },
      Q: { value: 1 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    createBuffer: vi.fn((channels: number, length: number, sampleRate: number) => ({
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData: vi.fn(() => new Float32Array(length)),
    })),
  };

  vi.stubGlobal('AudioContext', function MockAudioContext() {
    return mockCtx;
  } as unknown as typeof AudioContext);

  return { mockCtx, oscillators };
}

function makeVoice(handles: boolean) {
  return {
    playNote: vi.fn((_midi: number, _when: number, _duration: number, _velocity: number) => handles),
    startNote: vi.fn((_midi: number, _velocity: number) => handles),
    stopNote: vi.fn((_midi: number) => {}),
    setVolume: vi.fn((_volume: number) => {}),
    resume: vi.fn(() => Promise.resolve()),
  };
}

// Core audio uses module-level singletons (AudioContext, registered voice), so
// every test re-imports a fresh module instance.
async function freshAudio(): Promise<typeof AudioModule> {
  return (await import('../audio.ts')) as typeof AudioModule;
}

beforeEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('instrument voice seam — one-shot routing', () => {
  it('routes playNote to the registered voice and skips the synth', async () => {
    const { mockCtx } = setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    audio.playNote(N('C'), 4, 0.5);

    // C4 = MIDI 60; immediate → when offset 0; default velocity 0.5
    expect(voice.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);
    expect(mockCtx.createOscillator).not.toHaveBeenCalled();
  });

  it('falls back to the FM synth when the voice declines', async () => {
    const { mockCtx } = setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(false);
    audio.setInstrumentVoice(voice);

    audio.playNote(N('C'), 4, 0.5);

    expect(voice.playNote).toHaveBeenCalled();
    expect(mockCtx.createOscillator).toHaveBeenCalled();
  });

  it('offers every chord note to the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    audio.playChord([N('C'), N('E'), N('G')], 4, 1);

    expect(voice.playNote).toHaveBeenCalledTimes(3);
    const midis = voice.playNote.mock.calls.map((c) => c[0]);
    expect(midis).toEqual([60, 64, 67]);
  });

  it('routes a full scale (with octave note) through the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    audio.playScale(
      [N('C'), N('D'), N('E'), N('F'), N('G'), N('A'), N('B')],
      4,
      true,
      false
    );

    // 7 scale notes + the octave root
    expect(voice.playNote).toHaveBeenCalledTimes(8);
    expect(voice.playNote.mock.calls[0][0]).toBe(60); // C4
    expect(voice.playNote.mock.calls[7][0]).toBe(72); // C5
  });
});

describe('instrument voice seam — sustained + controls', () => {
  it('delegates sustained start/stop to the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    const midi = audio.startSustainedNote(N('C'), 4);
    expect(midi).toBe(60);
    expect(voice.startNote).toHaveBeenCalledWith(60, 0.5);

    audio.stopSustainedNote(60);
    expect(voice.stopNote).toHaveBeenCalledWith(60);
  });

  it('setMasterVolume pushes to the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    audio.setMasterVolume(0.4);
    expect(voice.setVolume).toHaveBeenCalledWith(0.4);
  });

  it('resumeAudio resumes the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    await audio.resumeAudio();
    expect(voice.resume).toHaveBeenCalled();
  });
});
