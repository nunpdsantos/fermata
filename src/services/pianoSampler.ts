/**
 * Sample-based piano voice — Salamander Grand Piano subset (CC-BY-3.0,
 * Alexander Holm; see public/samples/piano/LICENSE.txt).
 *
 * 30 samples spaced in minor thirds (A0, C1, Ds1, Fs1, A1 … C8) live under
 * /samples/piano/. Every MIDI note is at most one semitone from a sample, so
 * playback pitch-shifts via playbackRate with imperceptible artifacts.
 *
 * Loading is lazy (kicked off on the first user gesture via preload()); until
 * a note's sample is decoded, startNote/playNote return false and the caller
 * falls back to the FM synth, so the keyboard always sounds.
 *
 * Mirrors the karplusStrong engine's module shape: lazy AudioContext, master
 * gain, _resetForTesting.
 */

import { createAmbience, PIANO_AMBIENCE } from './ambience.ts';

const SAMPLE_BASE_URL = '/samples/piano';

// The minor-third ladder: A0 (MIDI 21) up to C8 (MIDI 108), every 3 semitones.
const LADDER: Array<{ file: string; midi: number }> = (() => {
  const names = ['C', 'Ds', 'Fs', 'A'];
  const out: Array<{ file: string; midi: number }> = [{ file: 'A0', midi: 21 }];
  for (let octave = 1; octave <= 7; octave++) {
    names.forEach((name, i) => {
      out.push({ file: `${name}${octave}`, midi: 12 + octave * 12 + [0, 3, 6, 9][i] });
    });
  }
  out.push({ file: 'C8', midi: 108 });
  return out;
})();

interface Voice {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambienceInput: AudioNode | null = null; // ambience bus (masterGain → ambienceInput → destination)
const buffers = new Map<string, AudioBuffer>();
let loadPromise: Promise<void> | null = null;
const voices = new Map<number, Voice>();

const RELEASE_S = 0.25; // gain time-constant on key release
const STOP_AFTER_S = 1.2; // hard-stop the source once the release has faded

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.9;
    // Owner-requested room: "piano a bit too dry" (2026-06-11).
    // wet level (PIANO_AMBIENCE.wet) is the calibration knob — see ambience.ts.
    ambienceInput = createAmbience(audioContext, audioContext.destination, PIANO_AMBIENCE);
    masterGain.connect(ambienceInput);
  }
  return audioContext;
}

/** Nearest ladder sample for a MIDI note + the playbackRate to reach it. */
export function resolveSample(midi: number): { file: string; rate: number } {
  let best = LADDER[0];
  let bestDist = Math.abs(midi - best.midi);
  for (const entry of LADDER) {
    const dist = Math.abs(midi - entry.midi);
    if (dist < bestDist) {
      best = entry;
      bestDist = dist;
    }
  }
  return { file: best.file, rate: 2 ** ((midi - best.midi) / 12) };
}

/** Fetch + decode the full ladder once. Safe to call repeatedly. */
export function preload(): Promise<void> {
  if (!loadPromise) {
    const ctx = getContext();
    loadPromise = Promise.all(
      LADDER.map(async ({ file }) => {
        try {
          const resp = await fetch(`${SAMPLE_BASE_URL}/${file}.mp3`);
          if (!resp.ok) return;
          const data = await resp.arrayBuffer();
          const buffer = await ctx.decodeAudioData(data);
          buffers.set(file, buffer);
        } catch {
          // Offline before the samples were cached — the synth fallback covers it.
        }
      }),
    ).then(() => undefined);
  }
  return loadPromise;
}

export function isReady(midi: number): boolean {
  return buffers.has(resolveSample(midi).file);
}

function spawnVoice(midi: number, when: number, velocity: number): Voice | null {
  const { file, rate } = resolveSample(midi);
  const buffer = buffers.get(file);
  if (!buffer) return null;

  const ctx = getContext();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = rate;

  const gain = ctx.createGain();
  gain.gain.value = velocity;
  source.connect(gain as unknown as AudioNode);
  gain.connect(masterGain as unknown as AudioNode);
  source.start(when);
  return { source, gain };
}

function releaseVoice(voice: Voice, when: number): void {
  voice.gain.gain.cancelScheduledValues(when);
  voice.gain.gain.setTargetAtTime(0, when, RELEASE_S);
  try {
    voice.source.stop(when + STOP_AFTER_S);
  } catch {
    // already stopped
  }
}

/**
 * Sustained note-on (keyboard/MIDI). Returns false when the sample is not
 * loaded yet — the caller should fall back to the synth voice.
 */
export function startNote(midi: number, velocity = 1): boolean {
  const ctx = getContext();
  const existing = voices.get(midi);
  if (existing) releaseVoice(existing, ctx.currentTime);

  const voice = spawnVoice(midi, ctx.currentTime, velocity);
  if (!voice) return false;
  voices.set(midi, voice);
  return true;
}

export function stopNote(midi: number): void {
  const voice = voices.get(midi);
  if (!voice) return;
  voices.delete(midi);
  releaseVoice(voice, getContext().currentTime);
}

export function stopAll(): void {
  for (const midi of [...voices.keys()]) {
    stopNote(midi);
  }
}

/**
 * Scheduled one-shot for chord/scale/ear-training playback.
 * `when` is seconds from now; the voice releases after `duration` seconds.
 * Returns false when the sample is not loaded yet.
 */
export function playNote(midi: number, when: number, duration: number, velocity = 1): boolean {
  const ctx = getContext();
  const startAt = ctx.currentTime + when;
  const voice = spawnVoice(midi, startAt, velocity);
  if (!voice) return false;
  releaseVoice(voice, startAt + duration);
  return true;
}

export function setVolume(vol: number): void {
  if (!masterGain) getContext();
  if (masterGain) masterGain.gain.value = vol;
}

export async function resumeContext(): Promise<void> {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}

// ---------------------------------------------------------------------------
// Test helper
// ---------------------------------------------------------------------------

export function _resetForTesting(): void {
  voices.clear();
  buffers.clear();
  loadPromise = null;
  audioContext = null;
  masterGain = null;
  ambienceInput = null;
}
