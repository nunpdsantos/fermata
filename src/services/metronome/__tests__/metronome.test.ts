/**
 * The metronome against the REAL audio code (wave 3, stream M, brief "Truth
 * and tests"): another Play — a scale, a chord, a view change, the
 * update toast's reload path aside — and core `cancelScheduledAudio()` /
 * `stopPlayback()` leave its next click sounding; ■, "page hidden", Drill,
 * the Progression loop's start and a rhythm's start leave NO click queued — asserted on the audio
 * seam: the sources the metronome handed to its audio clock, in a fake Web
 * Audio whose clock only the test moves. A rhythm (a lesson's Hear it, a
 * check's Play the rhythm) is the one Play that stops it, since it brings its
 * own count-in (wave 3, second fix pass).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cancelScheduledAudio, playChord, playScale, setInstrumentVoice, stopPlayback } from '../../../core/services/audio';
import { playRhythm } from '../../../utils/rhythmPlayback';
import { useAppStore } from '../../../state/store';
import { hasWorkInProgress } from '../../workInProgress';
import { isLooping, setLoopClock, startLoop, stopLoop } from '../../../components/explore/progression/loopController';
import { readChords } from '../../../components/explore/progression/progressionModel';
import { resetProgressionPanel, openProgressionPanel } from '../../../state/progressionPanel';
import type { LoopTimer } from '../clock';
import { AHEAD_S, LOOP_MS, START_LEAD_S } from '../clock';
import { ACCENT_VELOCITY, BEAT_VELOCITY, CLICK_S, METRONOME_LEVEL, _resetClicksForTesting, pendingClicks, prepareClicks, ACCENT_MIDI, BEAT_MIDI } from '../clickVoice';
import {
  isMetronomeRunning, metronomeSettings, queuedClicks, setMetronomeBeats, setMetronomeClock, setMetronomeTempo,
  startMetronome, stopMetronome, useMetronome,
} from '../metronome';

// ─── A fake Web Audio: one shared clock, every scheduled source recorded per context ───
const clock = { t: 100 };
interface Src { ctx: number; kind: 'buffer' | 'osc'; rate: number; freq: number; starts: number[]; stops: number[]; onended: (() => void) | null; to: unknown[] }
const made: Src[] = [];
let ctxCount = 0;
/** Every context made, so a test can reach its destination (the speakers). */
const contexts: FakeAudioContext[] = [];
type Param = ReturnType<typeof param>;
/** A gain node of the fake: its gain, and what it was connected to. */
interface FakeGain { gain: Param; to: unknown[]; connect: (t: unknown) => void; disconnect: () => void }
const param = () => ({ value: 1, setValueAtTime: vi.fn(), setTargetAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() });
class FakeAudioContext {
  id = ++ctxCount;
  state = 'running';
  sampleRate = 8000;
  destination = {};
  constructor() { contexts.push(this); }
  get currentTime() { return clock.t; }
  resume = vi.fn(async () => {});
  createGain(): FakeGain {
    const g: FakeGain = { gain: param(), to: [], connect: (t: unknown) => { g.to.push(t); }, disconnect: vi.fn() };
    return g;
  }
  private source(kind: Src['kind']) {
    const s: Src = { ctx: this.id, kind, rate: 1, freq: 0, starts: [], stops: [], onended: null, to: [] };
    made.push(s);
    const node = {
      buffer: null as unknown,
      playbackRate: { get value() { return s.rate; }, set value(v: number) { s.rate = v; } },
      frequency: { ...param(), get value() { return s.freq; }, set value(v: number) { s.freq = v; } },
      detune: param(),
      type: 'sine',
      connect: (t: unknown) => { s.to.push(t); },
      disconnect: vi.fn(),
      start: (t = 0) => { s.starts.push(t); },
      stop: (t = 0) => { s.stops.push(t); },
      set onended(fn: (() => void) | null) { s.onended = fn; },
      get onended() { return s.onended; },
    };
    return node;
  }
  createBufferSource() { return this.source('buffer'); }
  createOscillator() { return this.source('osc'); }
  createDynamicsCompressor() { return { threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 }, attack: { value: 0 }, release: { value: 0 }, connect: vi.fn() }; }
  createConvolver() { return { buffer: null, connect: vi.fn(), disconnect: vi.fn() }; }
  createBiquadFilter() { return { type: 'lowpass', frequency: param(), Q: param(), connect: vi.fn(), disconnect: vi.fn() }; }
  createBuffer(channels: number, length: number) {
    const data = Array.from({ length: channels }, () => new Float32Array(length));
    return { getChannelData: (c: number) => data[c] };
  }
  decodeAudioData = vi.fn(async () => ({ duration: 4 }));
}

/** The metronome's context is the first one it creates: its sources. */
let metroCtx = 0;
const metroSources = () => made.filter((s) => s.ctx === metroCtx);
/** A click still to sound and not taken back: started in the future, every stop after its ring. */
const willSound = (s: Src) => s.starts[0] > clock.t && s.stops.every((t) => t >= s.starts[0] + CLICK_S);
/** Taken back: a stop at or before its start (it never sounds). */
const takenBack = (s: Src) => s.stops.some((t) => t <= s.starts[0]);

// The look-ahead loop, run by hand.
let loopFn: (() => void) | null = null;
const timer: LoopTimer = { every: (_ms, fn) => { loopFn = fn; return () => { if (loopFn === fn) loopFn = null; }; } };
function advance(seconds: number) {
  const end = clock.t + seconds;
  while (clock.t + LOOP_MS / 1000 <= end + 1e-9) {
    clock.t += LOOP_MS / 1000;
    loopFn?.();
  }
  clock.t = end;
}

const voice = {
  playNote: vi.fn(() => true), startNote: vi.fn(() => true), stopNote: vi.fn(), setVolume: vi.fn(),
  resume: vi.fn(() => Promise.resolve()), cancelScheduled: vi.fn(),
};

beforeEach(async () => {
  vi.stubGlobal('AudioContext', FakeAudioContext as unknown as typeof AudioContext);
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })));
  made.length = 0;
  clock.t = 100;
  _resetClicksForTesting();
  setInstrumentVoice(voice);
  setMetronomeClock(undefined, timer);
  await prepareClicks(); // the bar opens: the two samples decode
  metroCtx = ctxCount;
  resetProgressionPanel();
  useAppStore.setState({ view: 'explore', metronome: undefined, progression: { chords: ['G', 'D', 'Em', 'C'], bpm: 90, beats: 4 } });
  useMetronome.setState({ running: false, beat: null, lastStop: null });
});
afterEach(() => {
  stopMetronome('closed');
  stopLoop('user');
  setLoopClock();
  stopPlayback();
  setInstrumentVoice(null);
  vi.unstubAllGlobals();
  useAppStore.setState({ metronome: undefined, progression: undefined, view: 'explore' });
});

describe('the clicks on the audio seam', () => {
  it('▶ hands the piano\'s G5 (first beat) and C5 to its own audio clock, ahead of time', () => {
    startMetronome();
    advance(1.3);
    const s = metroSources();
    expect(s.length).toBeGreaterThan(1);
    // 80 a minute: 0.75 s apart, the first START_LEAD_S after ▶, all on the sample (decoded at open).
    s.forEach((src, i) => {
      expect(src.kind).toBe('buffer');
      expect(src.starts[0]).toBeCloseTo(100 + START_LEAD_S + i * 0.75, 9);
    });
    expect(s[0].rate).toBeCloseTo(2 ** (1 / 12), 9); // G5 from the F♯5 sample
    expect(s[1].rate).toBe(1); // C5
    expect(ACCENT_MIDI).toBe(79);
    expect(BEAT_MIDI).toBe(72);
    expect(queuedClicks()).toBeGreaterThan(0);
  });

  it('every click reaches the speakers through the metronome\'s own level (0.8), the first beat louder', () => {
    startMetronome();
    advance(1.3);
    const ctx = contexts.find((c) => c.id === metroCtx)!;
    const s = metroSources();
    expect(s.length).toBeGreaterThan(1);
    // The level is a fixed number, not read back from the code under test.
    expect(METRONOME_LEVEL).toBe(0.8);
    s.forEach((src, i) => {
      // source → its own gain (the click's velocity) → the metronome's level → the destination.
      expect(src.to).toHaveLength(1);
      const click = src.to[0] as FakeGain;
      expect(click.to).toHaveLength(1);
      const level = click.to[0] as FakeGain;
      expect(level.gain.value).toBe(0.8);
      expect(level.to).toEqual([ctx.destination]);
      // The sample path sets the click's gain to its velocity at its start: 1 on the first beat, 0.7 on the others.
      const velocity = i % 4 === 0 ? 1 : 0.7;
      expect(click.gain.setValueAtTime).toHaveBeenCalledWith(velocity, src.starts[0]);
    });
    expect([ACCENT_VELOCITY, BEAT_VELOCITY]).toEqual([1, 0.7]);
  });

  it('without the samples (offline, never cached) a synthesized click of the same pitch sounds', async () => {
    _resetClicksForTesting();
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    await prepareClicks();
    const ctx = ctxCount;
    startMetronome();
    advance(0.8);
    const s = made.filter((x) => x.ctx === ctx);
    expect(s.length).toBeGreaterThan(0);
    expect(s.every((x) => x.kind === 'osc')).toBe(true);
    expect(s[0].freq).toBeCloseTo(783.99, 1);
    expect(s[1].freq).toBeCloseTo(523.25, 1);
  });

  it('opened offline, then online: the next ▶ fetches the samples again and the clicks are the piano\'s', async () => {
    _resetClicksForTesting();
    const offline = vi.fn(async () => { throw new Error('offline'); });
    vi.stubGlobal('fetch', offline);
    await prepareClicks();
    expect(offline).toHaveBeenCalledTimes(2);
    const ctx = ctxCount;
    const online = vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) }));
    vi.stubGlobal('fetch', online);
    startMetronome(); // ▶ asks for the samples again
    await vi.waitFor(() => expect(online).toHaveBeenCalledTimes(2));
    await prepareClicks(); // the load ▶ started has finished
    stopMetronome('user');
    const from = made.length;
    startMetronome();
    advance(0.8);
    const after = made.slice(from).filter((x) => x.ctx === ctx);
    expect(after.length).toBeGreaterThan(0);
    expect(after.every((x) => x.kind === 'buffer')).toBe(true);
    // Once both are in, nothing is fetched again.
    startMetronome();
    expect(online).toHaveBeenCalledTimes(2);
  });
});

describe('another Play does not stop it', () => {
  const PLAYS: [string, () => void][] = [
    ['cancelScheduledAudio()', () => cancelScheduledAudio()],
    ['stopPlayback()', () => stopPlayback()],
    ['a scale (Explore\'s ▶ Play scale)', () => { cancelScheduledAudio(); playScale([{ natural: 'C', accidental: '' }, { natural: 'D', accidental: '' }, { natural: 'E', accidental: '' }], 4, true, false, 0.3); }],
    ['a chord (the chord panel\'s ▶ Chord)', () => { cancelScheduledAudio(); playChord([{ natural: 'C', accidental: '' }, { natural: 'E', accidental: '' }, { natural: 'G', accidental: '' }], 4, 1); }],
    ['a view change (Explore → Learn → Explore)', () => { useAppStore.getState().setView('learn'); cancelScheduledAudio(); useAppStore.getState().setView('explore'); }],
  ];
  for (const [name, play] of PLAYS) {
    it(`${name}: the queued clicks stay queued and the next ones come on time`, () => {
      startMetronome();
      advance(1.3);
      const queuedBefore = metroSources().filter((s) => s.starts[0] > clock.t);
      expect(queuedBefore.length).toBeGreaterThan(0); // known positive: something to cancel
      play();
      expect(voice.cancelScheduled).toHaveBeenCalled(); // the other playback's cancel really ran
      for (const s of queuedBefore) expect(willSound(s)).toBe(true);
      expect(isMetronomeRunning()).toBe(true);
      advance(3);
      const all = metroSources();
      all.forEach((src, i) => expect(src.starts[0]).toBeCloseTo(100 + START_LEAD_S + i * 0.75, 9));
      expect(all.filter(takenBack)).toHaveLength(0);
      voice.cancelScheduled.mockClear();
    });
  }
});

describe('what stops it leaves no click queued', () => {
  const STOPS: [string, () => void, string][] = [
    ['■', () => stopMetronome('user'), 'user'],
    ['the page hidden', () => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    }, 'hidden'],
    ['leaving the page', () => window.dispatchEvent(new Event('pagehide')), 'hidden'],
    ['going into Drill', () => useAppStore.getState().setView('drill'), 'drill'],
    ['the Progression loop starting', () => {
      setLoopClock({ now: () => clock.t, setTimeout: () => 0 as unknown as ReturnType<typeof setTimeout>, clearTimeout: () => {} });
      openProgressionPanel();
      startLoop(readChords(['G', 'C']), 90, 4);
    }, 'loop'],
    // A rhythm brings its own count-in (wave 3, second fix pass): the metronome gives way, as to the loop.
    ['a rhythm starting (a lesson\'s Hear it, a check\'s Play the rhythm)', () => { void playRhythm({ time: '4/4', notes: 'q q h' }); }, 'rhythm'],
  ];
  for (const [name, stop, reason] of STOPS) {
    it(`${name}`, () => {
      startMetronome();
      advance(1.3);
      expect(pendingClicks()).toBeGreaterThan(0); // known positive
      expect(hasWorkInProgress()).toBe(true);
      stop();
      expect(pendingClicks()).toBe(0);
      expect(queuedClicks()).toBe(0);
      for (const s of metroSources()) if (s.starts[0] > clock.t) expect(takenBack(s)).toBe(true);
      expect(isMetronomeRunning()).toBe(false);
      expect(useMetronome.getState()).toMatchObject({ running: false, beat: null, lastStop: reason });
      const n = metroSources().length;
      advance(3);
      expect(metroSources().length).toBe(n);
      expect(hasWorkInProgress()).toBe(isLooping());
    });
  }

  it('▶ while the loop plays stops the loop: the newer clock wins', () => {
    setLoopClock({ now: () => clock.t, setTimeout: () => 0 as unknown as ReturnType<typeof setTimeout>, clearTimeout: () => {} });
    openProgressionPanel();
    startLoop(readChords(['G', 'C']), 90, 4);
    expect(isLooping()).toBe(true);
    startMetronome();
    expect(isLooping()).toBe(false);
    expect(isMetronomeRunning()).toBe(true);
  });

  it('a rhythm: the metronome stops in the tap (before the rhythm\'s own count-in is queued) and does not start again by itself', async () => {
    startMetronome();
    advance(1.3);
    voice.playNote.mockClear();
    const played = playRhythm({ time: '4/4', notes: 'q q h' });
    // Synchronously, inside the call: nothing of the metronome left to sound.
    expect(isMetronomeRunning()).toBe(false);
    expect(queuedClicks()).toBe(0);
    await played;
    // The rhythm itself was handed to core audio (its count-in and its notes), not to the metronome's clock.
    expect(voice.playNote).toHaveBeenCalled();
    const n = metroSources().length;
    await new Promise((r) => setTimeout(r, 30)); // timers too, not only the audio clock
    advance(6); // longer than the count-in and the rhythm
    expect(isMetronomeRunning()).toBe(false);
    expect(metroSources().length).toBe(n);
    expect(useMetronome.getState().lastStop).toBe('rhythm');
    // ▶ again: it runs, and the reason is forgotten.
    startMetronome();
    expect(useMetronome.getState()).toMatchObject({ running: true, lastStop: null });
  });

  it('a rhythm while the metronome is stopped (or never started) changes nothing of the metronome\'s', async () => {
    await playRhythm({ time: '4/4', notes: 'q q h' });
    expect(useMetronome.getState()).toMatchObject({ running: false, lastStop: null });
    startMetronome();
    stopMetronome('user');
    await playRhythm({ time: '3/4', notes: 'q q q' });
    expect(useMetronome.getState().lastStop).toBe('user');
  });

  it('the loop starting while the metronome is stopped changes nothing of the metronome\'s', () => {
    setLoopClock({ now: () => clock.t, setTimeout: () => 0 as unknown as ReturnType<typeof setTimeout>, clearTimeout: () => {} });
    openProgressionPanel();
    startLoop(readChords(['G', 'C']), 90, 4);
    expect(useMetronome.getState().lastStop).toBeNull();
  });
});

describe('the count, the tempo and the bar', () => {
  it('the count follows the clicks that have sounded (1 2 3 4 1 …)', () => {
    vi.useFakeTimers();
    try {
      startMetronome();
      const seen: (number | null)[] = [];
      for (let step = 0; step < 200; step++) {
        clock.t += LOOP_MS / 1000;
        loopFn?.();
        vi.advanceTimersByTime(LOOP_MS);
        const beat = useMetronome.getState().beat;
        if (beat !== seen[seen.length - 1]) seen.push(beat);
      }
      // 5 s at 80 a minute: nothing before the first click, then the clicks at 0.06, 0.81 … 4.56 s.
      expect(seen).toEqual([null, 1, 2, 3, 4, 1, 2, 3]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('a tempo or bar change is saved (the learner changed it) and heard from the next beat', () => {
    expect(useAppStore.getState().metronome).toBeUndefined();
    expect(metronomeSettings()).toEqual({ bpm: 80, beats: 4 });
    startMetronome();
    advance(START_LEAD_S + 0.1); // the first click has sounded
    setMetronomeTempo(120);
    expect(useAppStore.getState().metronome).toEqual({ bpm: 120, beats: 4 });
    advance(1);
    const s = metroSources().filter((x) => !takenBack(x));
    expect(s[1].starts[0] - s[0].starts[0]).toBeCloseTo(0.5, 9);
    setMetronomeBeats(3);
    expect(useAppStore.getState().metronome).toEqual({ bpm: 120, beats: 3 });
    // Typed nonsense changes nothing; out of range is held at the ends.
    setMetronomeTempo(Number.NaN);
    setMetronomeBeats(5);
    expect(useAppStore.getState().metronome).toEqual({ bpm: 120, beats: 3 });
    setMetronomeTempo(999);
    expect(metronomeSettings().bpm).toBe(240);
  });

  it('▶ never writes the field (only a change does), and running is never saved', () => {
    startMetronome();
    advance(1);
    expect(useAppStore.getState().metronome).toBeUndefined();
    setMetronomeTempo(80); // the default again: nothing changed, nothing written
    expect(useAppStore.getState().metronome).toBeUndefined();
    setMetronomeTempo(81);
    expect(JSON.stringify(useAppStore.getState().metronome)).toBe('{"bpm":81,"beats":4}');
  });

  it(`the look-ahead stays under ${AHEAD_S} s`, () => {
    startMetronome();
    advance(2);
    const pending = metroSources().filter((s) => s.starts[0] > clock.t);
    expect(pending.length).toBeGreaterThan(0);
    for (const s of pending) expect(s.starts[0] - clock.t).toBeLessThan(AHEAD_S);
  });
});
