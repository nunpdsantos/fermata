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

/**
 * The privacy promise, watched (wave 3 final review): "nothing heard or
 * played is recorded, stored or sent". Started before a microphone session
 * and read after it: what was written to localStorage / sessionStorage /
 * IndexedDB, sent (fetch, sendBeacon, XMLHttpRequest, WebSocket), recorded
 * (MediaRecorder), logged (console.log / info / debug), and whether the
 * microphone was ever connected to the speakers through anything but a
 * silent gain. Each finding is one line; none is the promise kept.
 */
export function watchPrivacy(): { findings(): string[]; stop(): void } {
  const found: string[] = [];
  const snapshot = (s: Storage) => new Map(Object.keys(s).map((k) => [k, s.getItem(k)]));
  /** What differs, key by key (and, in a saved JSON store, field by field). */
  const differences = (name: string, was: Map<string, string | null>, now: Map<string, string | null>) => {
    const out: string[] = [];
    for (const k of new Set([...was.keys(), ...now.keys()])) {
      const a = was.get(k);
      const b = now.get(k);
      if (a === b) continue;
      let fields = '';
      try {
        const sa = (JSON.parse(a ?? '{}') as { state?: Record<string, unknown> }).state ?? {};
        const sb = (JSON.parse(b ?? '{}') as { state?: Record<string, unknown> }).state ?? {};
        fields = [...new Set([...Object.keys(sa), ...Object.keys(sb)])]
          .filter((f) => JSON.stringify(sa[f]) !== JSON.stringify(sb[f]))
          .map((f) => `${f}: ${JSON.stringify(sa[f])} -> ${JSON.stringify(sb[f])}`)
          .join('; ');
      } catch {
        fields = String(b).slice(0, 120);
      }
      out.push(`${name} "${k}" ${a === undefined ? 'written' : b === undefined ? 'removed' : 'changed'}${fields ? ` (${fields})` : ''}`);
    }
    return out;
  };
  const before = { local: snapshot(localStorage), session: snapshot(sessionStorage) };
  const spies: { mockRestore(): void }[] = [];
  const restoreGlobals: (() => void)[] = [];
  const stubGlobal = (name: string, value: unknown) => {
    const g = globalThis as unknown as Record<string, unknown>;
    const had = Object.prototype.hasOwnProperty.call(g, name);
    const old = g[name];
    g[name] = value;
    restoreGlobals.push(() => {
      if (had) g[name] = old;
      else delete g[name];
    });
  };
  stubGlobal('fetch', vi.fn(async (...a: unknown[]) => {
    found.push(`fetch ${String(a[0])}`);
    return { ok: false } as Response;
  }));
  const nav = navigator as unknown as Record<string, unknown>;
  const hadBeacon = Object.prototype.hasOwnProperty.call(nav, 'sendBeacon');
  const oldBeacon = nav.sendBeacon;
  nav.sendBeacon = (url: string) => {
    found.push(`sendBeacon ${url}`);
    return true;
  };
  restoreGlobals.push(() => {
    if (hadBeacon) nav.sendBeacon = oldBeacon;
    else delete nav.sendBeacon;
  });
  stubGlobal('WebSocket', function WebSocket(url: string) {
    found.push(`WebSocket ${url}`);
  });
  stubGlobal('MediaRecorder', function MediaRecorder() {
    found.push('MediaRecorder');
  });
  stubGlobal('indexedDB', { open: (name: string) => found.push(`indexedDB.open ${name}`) });
  spies.push(vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(function (this: XMLHttpRequest, _m: string, url: string | URL) {
    found.push(`XMLHttpRequest ${String(url)}`);
  } as never));
  for (const level of ['log', 'info', 'debug'] as const) {
    spies.push(vi.spyOn(console, level).mockImplementation((...a: unknown[]) => {
      found.push(`console.${level} ${a.map(String).join(' ').slice(0, 80)}`);
    }));
  }
  // The audio graph: a node that reaches the speakers must be a gain held at 0.
  const proto = FakeAudioContext.prototype as unknown as Record<string, (...a: unknown[]) => Record<string, unknown>>;
  const wrap = (method: string) => {
    const original = proto[method];
    proto[method] = function (this: FakeAudioContext, ...a: unknown[]) {
      const node = original.apply(this, a);
      const speakers = this.destination;
      node.connect = (target: unknown) => {
        if (target === speakers) {
          const gain = (node as { gain?: { value: number } }).gain;
          if (method !== 'createGain' || !gain) found.push(`${method} node connected to the speakers`);
          else queueMicrotask(() => {
            if (gain.value !== 0) found.push(`a gain of ${gain.value} connected to the speakers`);
          });
        }
      };
      return node;
    };
    restoreGlobals.push(() => {
      proto[method] = original;
    });
  };
  wrap('createMediaStreamSource');
  wrap('createAnalyser');
  wrap('createGain');
  return {
    findings() {
      return [
        ...found,
        ...differences('localStorage', before.local, snapshot(localStorage)),
        ...differences('sessionStorage', before.session, snapshot(sessionStorage)),
      ];
    },
    stop() {
      for (const s of spies) s.mockRestore();
      for (const r of restoreGlobals.reverse()) r();
    },
  };
}
