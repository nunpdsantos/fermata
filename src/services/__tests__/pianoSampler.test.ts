/**
 * pianoSampler — sample-based piano voice (Salamander Grand subset).
 *
 * The sample ladder is spaced in minor thirds (A0, C1, Ds1, … C8), so every
 * MIDI note is at most one semitone from a sample; playback pitch-shifts via
 * playbackRate. Until a note's sample is decoded, callers fall back to the FM
 * synth (startNote returns false).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveSample,
  preload,
  isReady,
  startNote,
  stopNote,
  playNote,
  stopAll,
  setVolume,
  _resetForTesting,
} from '../pianoSampler';

// ─── AudioContext mock ──────────────────────────────────────────────────────

function makeGainMock() {
  return {
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      setTargetAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
}

function makeSourceMock() {
  return {
    buffer: null as unknown,
    playbackRate: { value: 1 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null as (() => void) | null,
  };
}

const sources: ReturnType<typeof makeSourceMock>[] = [];
const gains: ReturnType<typeof makeGainMock>[] = [];

class MockAudioContext {
  state = 'running';
  currentTime = 10;
  destination = {};
  resume = vi.fn(async () => {});
  createGain() {
    const g = makeGainMock();
    gains.push(g);
    return g;
  }
  createBufferSource() {
    const s = makeSourceMock();
    sources.push(s);
    return s;
  }
  createDynamicsCompressor() {
    return { threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 }, attack: { value: 0 }, release: { value: 0 }, connect: vi.fn() };
  }
  decodeAudioData = vi.fn(async (_buf: ArrayBuffer) => ({ duration: 8 }) as AudioBuffer);
}

beforeEach(() => {
  sources.length = 0;
  gains.length = 0;
  _resetForTesting();
  vi.stubGlobal('AudioContext', MockAudioContext as unknown as typeof AudioContext);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => ({
      ok: true,
      url,
      arrayBuffer: async () => new ArrayBuffer(8),
    })),
  );
});

// ─── resolveSample ──────────────────────────────────────────────────────────

describe('resolveSample', () => {
  it('maps a sampled note to itself at rate 1', () => {
    expect(resolveSample(60)).toEqual({ file: 'C4', rate: 1 }); // C4 is in the ladder
    expect(resolveSample(21)).toEqual({ file: 'A0', rate: 1 });
    expect(resolveSample(108)).toEqual({ file: 'C8', rate: 1 });
  });

  it('pitch-shifts at most one semitone to the nearest sample', () => {
    const up = resolveSample(61); // C#4 → C4 +1st or Ds4 −2st → C4
    expect(up.file).toBe('C4');
    expect(up.rate).toBeCloseTo(2 ** (1 / 12), 6);

    const down = resolveSample(62); // D4 → Ds4 −1st
    expect(down.file).toBe('Ds4');
    expect(down.rate).toBeCloseTo(2 ** (-1 / 12), 6);
  });

  it('clamps notes outside the ladder to the end samples', () => {
    expect(resolveSample(20).file).toBe('A0');
    expect(resolveSample(20).rate).toBeCloseTo(2 ** (-1 / 12), 6);
  });
});

// ─── loading ────────────────────────────────────────────────────────────────

describe('preload', () => {
  it('fetches and decodes all 30 ladder samples once', async () => {
    await preload();
    expect(vi.mocked(fetch).mock.calls.length).toBe(30);
    await preload(); // second call is a no-op
    expect(vi.mocked(fetch).mock.calls.length).toBe(30);
    expect(isReady(60)).toBe(true);
  });
});

// ─── playback ───────────────────────────────────────────────────────────────

describe('startNote / stopNote', () => {
  it('returns false before the sample is loaded (caller falls back to synth)', () => {
    expect(startNote(60)).toBe(false);
  });

  it('plays the nearest sample with the right playbackRate once loaded', async () => {
    await preload();
    expect(startNote(61)).toBe(true);
    const src = sources[sources.length - 1];
    expect(src.playbackRate.value).toBeCloseTo(2 ** (1 / 12), 6);
    expect(src.start).toHaveBeenCalled();
  });

  it('stopNote releases the voice with a ramp and stops the source', async () => {
    await preload();
    startNote(60);
    const src = sources[sources.length - 1];
    const voiceGain = gains[gains.length - 1];
    stopNote(60);
    expect(voiceGain.gain.setTargetAtTime).toHaveBeenCalled();
    expect(src.stop).toHaveBeenCalled();
  });

  it('stopAll releases every active voice', async () => {
    await preload();
    startNote(60);
    startNote(64);
    stopAll();
    expect(sources.filter((s) => s.stop.mock.calls.length > 0).length).toBe(2);
  });
});

describe('playNote (scheduled one-shots)', () => {
  it('starts at the requested time and releases after the duration', async () => {
    await preload();
    expect(playNote(64, 0.5, 1.2)).toBe(true);
    const src = sources[sources.length - 1];
    const voiceGain = gains[gains.length - 1];
    expect(src.start).toHaveBeenCalledWith(10.5); // currentTime 10 + when 0.5
    expect(voiceGain.gain.setTargetAtTime).toHaveBeenCalled();
    const calls = voiceGain.gain.setTargetAtTime.mock.calls;
    const releaseCall = calls[calls.length - 1];
    expect(releaseCall[1]).toBeCloseTo(11.7, 5); // 10 + 0.5 + 1.2
  });

  it('returns false when the sample is not loaded', () => {
    expect(playNote(64, 0, 1)).toBe(false);
  });
});

describe('setVolume', () => {
  it('drives the master gain', async () => {
    await preload();
    setVolume(0.3);
    expect(gains[0].gain.value).toBe(0.3);
  });
});
