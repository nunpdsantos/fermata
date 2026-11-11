/**
 * The metronome's sound (wave 3, stream M): the rhythm player's click — the
 * house sound (`utils/rhythmPlayback.ts`: a short high note of the piano,
 * the count-in's G5 louder on the first beat, C5 on the others) — scheduled
 * on an audio clock of its own, at its own level.
 *
 * Its own AudioContext, like each of the app's sound engines (core's synth,
 * the piano and guitar samplers, Karplus-Strong each have one): so core
 * `cancelScheduledAudio()` / `stopPlayback()` — which every other Play calls
 * first, and which cancel every one-shot the instrument voices and the synth
 * hold — never reach these clicks, and nothing about how other playback is
 * cancelled changes. Only the metronome takes its clicks back
 * (`clickSink.cancel`, called by the clock on ■ and on a tempo or bar change).
 *
 * The piano's own C5 and F♯5 samples (G5 = F♯5 a half step up, as the
 * sampler plays it) are fetched when the bar opens (~120 kB, through the
 * service worker's sample cache); until they are decoded, or offline before
 * they were ever cached, a short synthesized click of the same pitch sounds.
 * A load that left a sample missing is tried again on the next open or ▶.
 */
import { resolveSample } from '../pianoSampler';
import type { ClickSink } from './clock';

const SAMPLE_BASE_URL = '/samples/piano';
/** MIDI: the first beat (G5, the count-in's pitch) and the others (C5, the rhythm's). */
export const ACCENT_MIDI = 79;
export const BEAT_MIDI = 72;
/** Velocities: the first beat stronger. */
export const ACCENT_VELOCITY = 1;
export const BEAT_VELOCITY = 0.7;
/** The metronome's own level (its gain before the speakers). Nobody has heard it yet: the owner judges. */
export const METRONOME_LEVEL = 0.8;
/** How long a click rings before it fades (the count-in's 0.12 s). */
export const CLICK_S = 0.12;
const FADE_S = 0.03;
const CANCEL_FADE_S = 0.01;

interface Voice {
  source: AudioScheduledSourceNode;
  gain: GainNode;
  at: number;
}

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
const buffers = new Map<number, { buffer: AudioBuffer; rate: number }>();
let loading: Promise<void> | null = null;
const voices = new Map<number, Voice>();
let nextId = 1;
/** The last clicks handed over (for the browser tests: what reached the audio clock, and what was taken back). */
const LOG_SIZE = 256;
const log: { id: number; at: number; accent: boolean; cancelledAt: number | null }[] = [];

function context(): AudioContext | null {
  if (ctx) return ctx;
  const AC = typeof window !== 'undefined'
    ? window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    : undefined;
  if (!AC) return null;
  ctx = new AC();
  out = ctx.createGain();
  out.gain.value = METRONOME_LEVEL;
  out.connect(ctx.destination);
  return ctx;
}

/** Whether this browser can play the clicks at all. */
export function clickAudioAvailable(): boolean {
  return typeof window !== 'undefined' && !!(window.AudioContext ?? (window as typeof window & { webkitAudioContext?: unknown }).webkitAudioContext);
}

/**
 * Fetch and decode the two samples (the bar calls it when it opens, ▶ too).
 * Once both are in, or while a load is under way, it does nothing more; a
 * load that left one missing (offline) is forgotten, so the next call tries
 * again. Never throws.
 */
export function prepareClicks(): Promise<void> {
  if (loading) return loading;
  const c = context();
  if (!c) return Promise.resolve();
  loading = Promise.all(
    [ACCENT_MIDI, BEAT_MIDI].map(async (midi) => {
      try {
        const { file, rate } = resolveSample(midi);
        const resp = await fetch(`${SAMPLE_BASE_URL}/${file}.mp3`);
        if (!resp.ok) return;
        const buffer = await c.decodeAudioData(await resp.arrayBuffer());
        buffers.set(midi, { buffer, rate });
      } catch {
        // Offline before the samples were cached: the synthesized click covers it.
      }
    }),
  ).then(() => {
    if (!buffers.has(ACCENT_MIDI) || !buffers.has(BEAT_MIDI)) loading = null;
  });
  return loading;
}

/** Resume the clock inside the learner's tap (iOS unlocks sound only there). */
export function resumeClicks(): Promise<void> {
  const c = context();
  if (!c || c.state !== 'suspended') return Promise.resolve();
  return c.resume().catch(() => undefined);
}

function spawn(c: AudioContext, at: number, accent: boolean): Voice {
  const midi = accent ? ACCENT_MIDI : BEAT_MIDI;
  const velocity = accent ? ACCENT_VELOCITY : BEAT_VELOCITY;
  const gain = c.createGain();
  gain.connect(out as GainNode);
  const sample = buffers.get(midi);
  let source: AudioScheduledSourceNode;
  if (sample) {
    const s = c.createBufferSource();
    s.buffer = sample.buffer;
    s.playbackRate.value = sample.rate;
    gain.gain.setValueAtTime(velocity, at);
    gain.gain.setTargetAtTime(0, at + CLICK_S, FADE_S);
    source = s;
  } else {
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(velocity * 0.6, at + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, at + CLICK_S);
    source = o;
  }
  source.connect(gain);
  source.start(at);
  source.stop(at + CLICK_S + 6 * FADE_S);
  return { source, gain, at };
}

/** The clicks, on the metronome's own audio clock. */
export const clickSink: ClickSink = {
  now: () => context()?.currentTime ?? 0,
  schedule(at, accent) {
    const id = nextId++;
    const c = context();
    if (!c) return id;
    const voice = spawn(c, at, accent);
    voices.set(id, voice);
    log.push({ id, at, accent, cancelledAt: null });
    if (log.length > LOG_SIZE) log.shift();
    voice.source.onended = () => {
      voices.delete(id);
      try {
        voice.gain.disconnect();
      } catch {
        // already disconnected
      }
    };
    return id;
  },
  cancel(id) {
    const voice = voices.get(id);
    if (!voice) return;
    voices.delete(id);
    const now = ctx?.currentTime ?? 0;
    const entry = log.find((l) => l.id === id);
    if (entry) entry.cancelledAt = now;
    try {
      if (voice.at > now) {
        // Not started yet: a stop before its start means it never sounds.
        voice.source.stop(0);
      } else {
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
        voice.gain.gain.linearRampToValueAtTime(0, now + CANCEL_FADE_S);
        voice.source.stop(now + CANCEL_FADE_S + 0.005);
      }
    } catch {
      // already stopped
    }
  },
};

/** Clicks handed to the audio clock that have not started yet (the e2e's audio seam). */
export function pendingClicks(): number {
  const now = ctx?.currentTime ?? 0;
  let n = 0;
  for (const v of voices.values()) if (v.at > now) n++;
  return n;
}

/** The last clicks handed to the audio clock: `at`, accented, and when (audio clock) one was taken back. */
export function clickLog(): { at: number; accent: boolean; cancelledAt: number | null }[] {
  return log.map(({ at, accent, cancelledAt }) => ({ at, accent, cancelledAt }));
}

/** The metronome's audio clock now (seconds), or null before it exists. */
export function clickClock(): { now: number; state: string } | null {
  return ctx ? { now: ctx.currentTime, state: ctx.state } : null;
}

/** Test helper. */
export function _resetClicksForTesting(): void {
  log.length = 0;
  voices.clear();
  buffers.clear();
  loading = null;
  ctx = null;
  out = null;
}
