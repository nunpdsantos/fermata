/**
 * A fake microphone for unit tests: getUserMedia, MediaStream tracks and the
 * few Web Audio nodes the service uses. What the "microphone hears" is a
 * function of time that fills each analysis frame (`setSound`).
 */
import { vi } from 'vitest';

export interface FakeTrack {
  kind: 'audio';
  readyState: 'live' | 'ended';
  stop(): void;
  addEventListener(type: string, fn: () => void): void;
  /** Fire 'ended' as if the device went away. */
  unplug(): void;
}

type Sound = (frame: Float32Array, sampleRate: number, nowMs: number) => void;

export interface FakeMic {
  tracks: FakeTrack[];
  contexts: FakeAudioContext[];
  getUserMedia: ReturnType<typeof vi.fn>;
  /** Make the next request fail with this DOMException name. */
  failWith(name: string | null): void;
  /** Hold the next request until `release()` is called. */
  hold(): { release: () => void };
  setSound(sound: Sound | null): void;
  restore(): void;
}

export class FakeAudioContext {
  static sound: Sound | null = null;
  static rate = 48000;
  sampleRate = FakeAudioContext.rate;
  state: 'running' | 'suspended' | 'closed' = 'running';
  destination = {};
  constructor() {
    current?.contexts.push(this);
  }
  resume() {
    if (this.state !== 'closed') this.state = 'running';
    return Promise.resolve();
  }
  close() {
    this.state = 'closed';
    return Promise.resolve();
  }
  createMediaStreamSource() {
    return { connect: vi.fn(), disconnect: vi.fn() };
  }
  createGain() {
    return { gain: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() };
  }
  createAnalyser() {
    return {
      fftSize: 2048,
      smoothingTimeConstant: 0.8,
      connect: vi.fn(),
      disconnect: vi.fn(),
      getFloatTimeDomainData: (buf: Float32Array) => {
        buf.fill(0);
        FakeAudioContext.sound?.(buf, this.sampleRate, performance.now());
      },
    };
  }
}

let current: FakeMic | null = null;

function makeTrack(): FakeTrack {
  const listeners: (() => void)[] = [];
  const track: FakeTrack = {
    kind: 'audio',
    readyState: 'live',
    stop() {
      track.readyState = 'ended';
    },
    addEventListener(type, fn) {
      if (type === 'ended') listeners.push(fn);
    },
    unplug() {
      track.readyState = 'ended';
      for (const fn of listeners) fn();
    },
  };
  return track;
}

/** Install the fake on window / navigator (secure context, policy allows). */
export function installFakeMic(): FakeMic {
  const saved = {
    secure: Object.getOwnPropertyDescriptor(window, 'isSecureContext'),
    media: Object.getOwnPropertyDescriptor(navigator, 'mediaDevices'),
    permissions: Object.getOwnPropertyDescriptor(navigator, 'permissions'),
    ctx: (window as unknown as { AudioContext?: unknown }).AudioContext,
  };
  let failure: string | null = null;
  let held: Promise<void> | null = null;
  const mic: FakeMic = {
    tracks: [],
    contexts: [],
    getUserMedia: vi.fn(async () => {
      if (held) await held;
      if (failure) {
        const error = new Error(failure);
        error.name = failure;
        throw error;
      }
      const track = makeTrack();
      mic.tracks.push(track);
      return {
        getTracks: () => [track],
        getAudioTracks: () => [track],
      } as unknown as MediaStream;
    }),
    failWith(name) {
      failure = name;
    },
    hold() {
      let release = () => undefined as void;
      held = new Promise<void>((resolve) => {
        release = () => {
          held = null;
          resolve();
        };
      });
      return { release };
    },
    setSound(sound) {
      FakeAudioContext.sound = sound;
    },
    restore() {
      if (saved.secure) Object.defineProperty(window, 'isSecureContext', saved.secure);
      else delete (window as unknown as { isSecureContext?: boolean }).isSecureContext;
      if (saved.media) Object.defineProperty(navigator, 'mediaDevices', saved.media);
      else delete (navigator as unknown as { mediaDevices?: unknown }).mediaDevices;
      if (saved.permissions) Object.defineProperty(navigator, 'permissions', saved.permissions);
      else delete (navigator as unknown as { permissions?: unknown }).permissions;
      (window as unknown as { AudioContext?: unknown }).AudioContext = saved.ctx;
      FakeAudioContext.sound = null;
      current = null;
    },
  };
  current = mic;
  Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: mic.getUserMedia } });
  Object.defineProperty(navigator, 'permissions', { configurable: true, value: { query: vi.fn(async () => ({ state: 'prompt' })) } });
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
  return mic;
}

/** A tone the fake microphone hears: a plucked-like note at `hz` (sample-exact on the analyser's clock). */
export function tone(hz: number, amp = 0.2): Sound {
  return (frame, rate, nowMs) => {
    const t0 = nowMs / 1000;
    for (let i = 0; i < frame.length; i++) {
      const t = t0 + i / rate;
      frame[i] = amp * (0.3 * Math.sin(2 * Math.PI * hz * t) + Math.sin(4 * Math.PI * hz * t) + 0.6 * Math.sin(6 * Math.PI * hz * t + 1));
    }
  };
}

export const midiHz = (midi: number, cents = 0) => 440 * Math.pow(2, (midi - 69 + cents / 100) / 12);
