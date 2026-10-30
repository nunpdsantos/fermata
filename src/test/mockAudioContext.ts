/**
 * Minimal Web Audio stand-in that serves core audio, both samplers and the
 * Karplus-Strong engine at once (each builds its own context from the global
 * `AudioContext`). Records every AudioBufferSourceNode so tests can assert
 * what was scheduled (start) and cancelled (stop).
 *
 * Usage: `const audio = installMockAudioContext(5)` in a beforeEach, then
 * read `audio.sources`. Restore with `vi.unstubAllGlobals()`.
 */
import { vi } from 'vitest';

export interface MockSource {
  buffer: unknown;
  playbackRate: { value: number };
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  onended: (() => void) | null;
}

function param() {
  return {
    value: 1,
    setValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
  };
}

export function installMockAudioContext(currentTime: number): { sources: MockSource[] } {
  const sources: MockSource[] = [];

  class MockAudioContext {
    state = 'running';
    currentTime = currentTime;
    sampleRate = 8000;
    destination = {};
    resume = vi.fn(async () => {});
    close = vi.fn();
    createGain() {
      return { gain: param(), connect: vi.fn(), disconnect: vi.fn() };
    }
    createBufferSource() {
      const s: MockSource = {
        buffer: null,
        playbackRate: { value: 1 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null,
      };
      sources.push(s);
      return s;
    }
    createOscillator() {
      return { type: 'sine', frequency: param(), detune: param(), connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn() };
    }
    createDynamicsCompressor() {
      return { threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 }, attack: { value: 0 }, release: { value: 0 }, connect: vi.fn() };
    }
    createConvolver() {
      return { buffer: null, connect: vi.fn(), disconnect: vi.fn() };
    }
    createDelay() {
      return { delayTime: { value: 0 }, connect: vi.fn(), disconnect: vi.fn() };
    }
    createBiquadFilter() {
      return { type: 'lowpass', frequency: { value: 0 }, Q: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() };
    }
    createBuffer(channels: number, length: number, sampleRate: number) {
      const data = Array.from({ length: channels }, () => new Float32Array(length));
      return { numberOfChannels: channels, length, sampleRate, getChannelData: (c: number) => data[c] };
    }
    decodeAudioData = vi.fn(async () => ({ duration: 4 }));
  }

  vi.stubGlobal('AudioContext', MockAudioContext as unknown as typeof AudioContext);
  return { sources };
}

/** Last time this source was told to stop (undefined = never). */
export function lastStopAt(s: MockSource): number | undefined {
  const calls = s.stop.mock.calls;
  return calls.length ? (calls[calls.length - 1][0] as number) : undefined;
}
