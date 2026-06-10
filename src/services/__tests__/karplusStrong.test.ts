import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateKSBuffer,
  startNote,
  stopNote,
  stopAll,
  setVolume,
  playNote,
  resumeContext,
  _resetForTesting,
} from '../karplusStrong';

// ---------------------------------------------------------------------------
// Mock AudioContext
// ---------------------------------------------------------------------------

function makeMockGainNode() {
  const gain = {
    value: 1,
    cancelScheduledValues: vi.fn().mockReturnThis(),
    setValueAtTime: vi.fn().mockReturnThis(),
    linearRampToValueAtTime: vi.fn().mockReturnThis(),
  };
  return {
    gain,
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
}

function makeMockSource() {
  return {
    buffer: null as AudioBuffer | null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null as (() => void) | null,
  };
}

function makeMockCompressor() {
  return {
    threshold: { value: 0 },
    knee: { value: 0 },
    ratio: { value: 0 },
    attack: { value: 0 },
    release: { value: 0 },
    connect: vi.fn(),
  };
}

function makeMockConvolver() {
  return {
    buffer: null as AudioBuffer | null,
    connect: vi.fn(),
  };
}

function setupMockAudioContext() {
  const sources: ReturnType<typeof makeMockSource>[] = [];
  const gains: ReturnType<typeof makeMockGainNode>[] = [];

  const mockCtx = {
    sampleRate: 44100,
    state: 'running',
    currentTime: 0,
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    createGain: vi.fn(() => {
      const g = makeMockGainNode();
      gains.push(g);
      return g;
    }),
    createBufferSource: vi.fn(() => {
      const s = makeMockSource();
      sources.push(s);
      return s;
    }),
    createDynamicsCompressor: vi.fn(() => makeMockCompressor()),
    createConvolver: vi.fn(() => makeMockConvolver()),
    createBuffer: vi.fn((channels: number, length: number, sampleRate: number) => ({
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData: vi.fn(() => new Float32Array(length)),
    })),
  };

  vi.stubGlobal('AudioContext', function MockAudioContext() {
    return mockCtx;
  });
  return { mockCtx, sources, gains };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  _resetForTesting();
  vi.restoreAllMocks();
});

describe('generateKSBuffer', () => {
  it('produces a buffer of correct length', () => {
    const buf = generateKSBuffer(44100, 440, {
      brightness: 0.8,
      damping: 0.996,
      pickPosition: 0.5,
      duration: 2,
    });
    expect(buf.length).toBe(44100 * 2);
  });

  it('delay line length matches sampleRate / frequency', () => {
    // A440 at 44100 Hz → delay line ≈ 100 samples
    // The output should repeat with a period of ~100 samples (initially)
    const buf = generateKSBuffer(44100, 440, {
      brightness: 1,
      damping: 1, // no decay for this test
      pickPosition: 0,
      duration: 0.1,
    });
    // With damping=1 and pickPosition=0 (no comb filter), the delay line
    // repeats. Check that the signal is non-silent.
    const energy = buf.reduce((sum, s) => sum + s * s, 0);
    expect(energy).toBeGreaterThan(0);
  });

  it('signal decays toward zero over time', () => {
    const buf = generateKSBuffer(44100, 440, {
      brightness: 0.45,
      damping: 0.9975,
      pickPosition: 0.42,
      duration: 5,
    });

    // Compare RMS of first 4410 samples vs last 4410
    const rms = (arr: Float32Array, start: number, end: number) => {
      let sum = 0;
      for (let i = start; i < end; i++) sum += arr[i] * arr[i];
      return Math.sqrt(sum / (end - start));
    };

    const rmsStart = rms(buf, 0, 4410);
    const rmsEnd = rms(buf, buf.length - 4410, buf.length);
    expect(rmsEnd).toBeLessThan(rmsStart * 0.1);
  });

  it('returns silent buffer for very high frequency (delay < 2)', () => {
    const buf = generateKSBuffer(100, 200, {
      brightness: 0.8,
      damping: 0.996,
      pickPosition: 0.5,
      duration: 1,
    });
    // delay length = round(100/200) = 1 → < 2 → silent
    const energy = buf.reduce((sum, s) => sum + s * s, 0);
    expect(energy).toBe(0);
  });

  it('different calls produce different waveforms (random excitation)', () => {
    const a = generateKSBuffer(44100, 440);
    const b = generateKSBuffer(44100, 440);
    // Sum of absolute differences should be non-zero
    let diff = 0;
    for (let i = 0; i < Math.min(a.length, b.length, 4410); i++) {
      diff += Math.abs(a[i] - b[i]);
    }
    expect(diff).toBeGreaterThan(0);
  });
});

describe('startNote / stopNote', () => {
  it('creates an AudioBufferSourceNode and starts it', () => {
    const { sources } = setupMockAudioContext();
    startNote(69); // A4
    // First source is from reverb impulse generation; the note source is later
    const noteSource = sources[sources.length - 1];
    expect(noteSource.start).toHaveBeenCalled();
    expect(noteSource.buffer).toBeTruthy();
  });

  it('does not create duplicate voices for the same MIDI number', () => {
    const { sources } = setupMockAudioContext();
    startNote(60);
    const countAfterFirst = sources.length;
    startNote(60);
    expect(sources.length).toBe(countAfterFirst);
  });

  it('stopNote fades out and stops the source', () => {
    const { sources, gains } = setupMockAudioContext();
    startNote(60);
    stopNote(60);
    const noteSource = sources[sources.length - 1];
    expect(noteSource.stop).toHaveBeenCalled();
    // Gain should have had linearRamp scheduled
    const noteGain = gains[gains.length - 1];
    expect(noteGain.gain.linearRampToValueAtTime).toHaveBeenCalled();
  });

  it('stopNote is a no-op for non-playing notes', () => {
    setupMockAudioContext();
    // Should not throw
    expect(() => stopNote(60)).not.toThrow();
  });
});

describe('voice stealing', () => {
  it('evicts oldest voice when polyphony limit reached', () => {
    const { sources } = setupMockAudioContext();

    // Start 16 notes (the polyphony limit)
    for (let i = 0; i < 16; i++) {
      startNote(48 + i);
    }
    const countAtLimit = sources.length;
    // Capture the first note's source (MIDI 48) — it's the first source created
    const firstNoteSource = sources[0];

    // The 17th note should evict the oldest (MIDI 48)
    startNote(80);
    // A new source was created
    expect(sources.length).toBe(countAtLimit + 1);
    // The oldest voice's source should have been stopped (fade-out + stop)
    expect(firstNoteSource.stop).toHaveBeenCalled();
  });
});

describe('setVolume', () => {
  it('updates master gain value', () => {
    const { gains } = setupMockAudioContext();
    // Force context init
    startNote(60);
    setVolume(0.5);
    // First gain created is the master gain
    expect(gains[0].gain.value).toBe(0.5);
  });
});

describe('stopAll', () => {
  it('stops all active voices', () => {
    const { sources } = setupMockAudioContext();
    startNote(60);
    startNote(64);
    startNote(67);
    stopAll();
    // All note sources should have been stopped
    const noteSources = sources.slice(1); // skip reverb buffer source if any
    for (const s of noteSources) {
      expect(s.stop).toHaveBeenCalled();
    }
  });
});

describe('resumeContext', () => {
  it('resumes a suspended context', async () => {
    const { mockCtx } = setupMockAudioContext();
    mockCtx.state = 'suspended';
    await resumeContext();
    expect(mockCtx.resume).toHaveBeenCalled();
  });

  it('does not call resume on a running context', async () => {
    const { mockCtx } = setupMockAudioContext();
    mockCtx.state = 'running';
    await resumeContext();
    expect(mockCtx.resume).not.toHaveBeenCalled();
  });
});

describe('playNote (scheduled one-shot)', () => {
  it('schedules the source at currentTime + when and stops it after the release', () => {
    const { mockCtx, sources } = setupMockAudioContext();
    mockCtx.currentTime = 2;
    playNote(60, 1.5, 0.35, 0.5);
    const src = sources[sources.length - 1];
    // startAt = 2 + 1.5 = 3.5; endAt = 3.85; stop at endAt + 0.3 release + 0.05
    expect(src.start).toHaveBeenCalledWith(3.5);
    expect(src.stop).toHaveBeenCalledWith(4.2);
  });

  it('maps velocity to gain at the sustained-pluck level (×0.9)', () => {
    const { gains } = setupMockAudioContext();
    playNote(60, 0, 0.35, 0.5);
    const g = gains[gains.length - 1];
    expect(g.gain.value).toBeCloseTo(0.45);
  });

  it('schedules a release ramp to zero starting at note end', () => {
    const { mockCtx, gains } = setupMockAudioContext();
    mockCtx.currentTime = 0;
    playNote(60, 0, 1, 0.5);
    const g = gains[gains.length - 1];
    expect(g.gain.setValueAtTime).toHaveBeenCalledWith(expect.closeTo(0.45), 1);
    expect(g.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.closeTo(1.3));
  });

  it('caps the generated buffer to what will be heard (short notes)', () => {
    const { mockCtx } = setupMockAudioContext();
    playNote(60, 0, 0.35, 0.5);
    // bufferDuration = max(1, min(5, 0.35 + 0.5)) = 1 second
    const lastCall = mockCtx.createBuffer.mock.calls.at(-1)!;
    expect(lastCall[1]).toBe(44100 * 1);
  });

  it('never generates more than the engine default 5 s of buffer', () => {
    const { mockCtx } = setupMockAudioContext();
    playNote(60, 0, 10, 0.5);
    const lastCall = mockCtx.createBuffer.mock.calls.at(-1)!;
    expect(lastCall[1]).toBe(44100 * 5);
  });

  it('does not occupy the sustained-voice map (same MIDI can still be fretted)', () => {
    const { sources } = setupMockAudioContext();
    playNote(60, 0, 0.35, 0.5);
    const afterOneShot = sources.length;
    startNote(60); // must create a NEW sustained voice, not be deduped
    expect(sources.length).toBe(afterOneShot + 1);
  });

  it('stopAll silences scheduled one-shots too', () => {
    const { sources } = setupMockAudioContext();
    playNote(60, 0, 2, 0.5);
    playNote(64, 0.5, 2, 0.5);
    stopAll();
    for (const s of sources.slice(-2)) {
      expect(s.stop).toHaveBeenCalled();
    }
  });
});

describe('setVolume before chain creation', () => {
  it('applies a volume set before the first note once the chain is built', () => {
    const { gains } = setupMockAudioContext();
    setVolume(0.4); // chain does not exist yet — must be remembered
    startNote(60); // chain is created here
    expect(gains[0].gain.value).toBe(0.4); // gains[0] is the master gain
  });
});
