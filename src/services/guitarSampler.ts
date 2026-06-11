/**
 * Sample-based classical-guitar voice — FreePats "Spanish Classical Guitar"
 * (nylon-string) subset (CC0 public domain, recorded by Roberto/zenvoid.org;
 * see public/samples/guitar/LICENSE.txt).
 *
 * 39 individually-recorded notes spanning the guitar range E2–C6 live under
 * /samples/guitar/. Unlike the piano's regular minor-third ladder, this set is
 * IRREGULAR — most semitones are sampled, with six gaps (F#2, G#2, A#2, C#3,
 * D#3, G#4) that the upstream recording skipped. Those gaps resolve to a ±1-semitone
 * neighbour and pitch-shift via playbackRate, an artifact-free shift on nylon.
 * The ladder is therefore an explicit literal, not a generated loop.
 *
 * Loading is lazy (kicked off on the first user gesture via preload(), the same
 * trigger that warms the piano samples); until a note's sample is decoded,
 * startNote/playNote return false and the caller falls back to the
 * Karplus-Strong engine, so the fretboard always sounds — including a first
 * visit offline.
 *
 * Mirrors pianoSampler's module shape exactly: lazy AudioContext, master gain,
 * nearest-sample resolveSample, offline-safe preload, _resetForTesting.
 */

const SAMPLE_BASE_URL = '/samples/guitar';

// The 39 recorded notes, E2 (MIDI 40) … C6 (MIDI 84). Sharps use 's' in the
// filename (F#3 → Fs3). Explicit because the set is irregular: the four upstream
// gaps (F#2=42, G#2=44, A#2=46, C#3=49, D#3=51, G#4=68) are absent and pitch-shifted from a
// neighbour at playback time. Do NOT replace with a generator loop.
const LADDER: ReadonlyArray<{ file: string; midi: number }> = [
  { file: 'E2', midi: 40 },
  { file: 'F2', midi: 41 },
  { file: 'G2', midi: 43 },
  { file: 'A2', midi: 45 },
  { file: 'B2', midi: 47 },
  { file: 'C3', midi: 48 },
  { file: 'D3', midi: 50 },
  { file: 'E3', midi: 52 },
  { file: 'F3', midi: 53 },
  { file: 'Fs3', midi: 54 },
  { file: 'G3', midi: 55 },
  { file: 'Gs3', midi: 56 },
  { file: 'A3', midi: 57 },
  { file: 'As3', midi: 58 },
  { file: 'B3', midi: 59 },
  { file: 'C4', midi: 60 },
  { file: 'Cs4', midi: 61 },
  { file: 'D4', midi: 62 },
  { file: 'Ds4', midi: 63 },
  { file: 'E4', midi: 64 },
  { file: 'F4', midi: 65 },
  { file: 'Fs4', midi: 66 },
  { file: 'G4', midi: 67 },
  { file: 'A4', midi: 69 },
  { file: 'As4', midi: 70 },
  { file: 'B4', midi: 71 },
  { file: 'C5', midi: 72 },
  { file: 'Cs5', midi: 73 },
  { file: 'D5', midi: 74 },
  { file: 'Ds5', midi: 75 },
  { file: 'E5', midi: 76 },
  { file: 'F5', midi: 77 },
  { file: 'Fs5', midi: 78 },
  { file: 'G5', midi: 79 },
  { file: 'Gs5', midi: 80 },
  { file: 'A5', midi: 81 },
  { file: 'As5', midi: 82 },
  { file: 'B5', midi: 83 },
  { file: 'C6', midi: 84 },
];

interface Voice {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
const buffers = new Map<string, AudioBuffer>();
let loadPromise: Promise<void> | null = null;
const voices = new Map<number, Voice>();

// Guitar release is shorter than the piano's 0.25 s. The samples already carry
// a baked-in 0.6 s fade-out (afade st=3.4) and a fast natural pluck decay, so a
// snappier finger-lift keeps fast scales/arpeggios articulate without a
// lingering tail. STOP_AFTER_S stays at the piano value — it only caps a still-
// ringing sample after the release ramp.
const RELEASE_S = 0.18; // gain time-constant on note release
const STOP_AFTER_S = 1.2; // hard-stop the source once the release has faded

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(audioContext.destination);
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
          // Offline before the samples were cached — the KS fallback covers it.
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
 * Sustained note-on (fret press). Returns false when the sample is not loaded
 * yet — the caller should fall back to the Karplus-Strong engine.
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
 * Scheduled one-shot for chord/scale/arpeggio/ear-training playback.
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
}
