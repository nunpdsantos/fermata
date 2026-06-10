/**
 * Karplus-Strong Plucked String Synthesis
 *
 * Physical modeling synthesis: a noise burst excites a delay line whose length
 * determines pitch. A lossy averaging filter on each loop cycle simulates
 * energy dissipation in a vibrating string. Each pluck is acoustically unique
 * (random excitation) and decays naturally.
 *
 * Implementation: pre-computes a ~5 second Float32Array waveform per note,
 * played via AudioBufferSourceNode. No AudioWorklet, no dependencies.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KSParams {
  /** 0–1: controls initial spectral brightness (low-pass cutoff on noise burst) */
  brightness: number;
  /** 0–1: per-sample energy retention (higher = longer sustain) */
  damping: number;
  /** 0–1: pick position along the string (0.5 = middle, 0 = bridge) */
  pickPosition: number;
  /** Duration of the pre-computed buffer in seconds */
  duration: number;
}

interface Voice {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_PARAMS: KSParams = {
  brightness: 0.45,
  damping: 0.9975,
  pickPosition: 0.42,
  duration: 5,
};

const MAX_POLYPHONY = 16;
const FADE_OUT_MS = 50;
const ONESHOT_RELEASE_S = 0.3; // "finger lift" after a scheduled note's duration
const ONESHOT_MIN_BUFFER_S = 1;

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;
let dryGain: GainNode | null = null;
let wetGain: GainNode | null = null;
let reverb: ConvolverNode | null = null;

const voices = new Map<number, Voice>();
let voiceCounter = 0;
const voiceOrder = new Map<number, number>(); // midiNumber → creation order
let masterVolume = 0.9;
const oneShots = new Set<Voice>();

// ---------------------------------------------------------------------------
// AudioContext + signal chain (lazy)
// ---------------------------------------------------------------------------

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
    setupChain(audioContext);
  }
  return audioContext;
}

function setupChain(ctx: AudioContext): void {
  masterGain = ctx.createGain();
  masterGain.gain.value = masterVolume;

  compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -12;
  compressor.knee.value = 6;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.1;

  // Dry path
  dryGain = ctx.createGain();
  dryGain.gain.value = 0.7;

  // Wet path (reverb) — prominent for spatial presence
  wetGain = ctx.createGain();
  wetGain.gain.value = 0.3;

  reverb = ctx.createConvolver();
  reverb.buffer = createReverbImpulse(ctx, 1.8, 1.6);

  // Routing: masterGain → dry → compressor → destination
  //          masterGain → wet → reverb → compressor → destination
  masterGain.connect(dryGain);
  dryGain.connect(compressor);

  masterGain.connect(wetGain);
  wetGain.connect(reverb);
  reverb.connect(compressor);

  compressor.connect(ctx.destination);
}

/** Synthetic reverb impulse response matching core audio.ts */
function createReverbImpulse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
    }
  }
  return impulse;
}

// ---------------------------------------------------------------------------
// Karplus-Strong buffer generation
// ---------------------------------------------------------------------------

function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Convert MIDI number to frequency (used for damping scaling).
 * Exported midiToFrequency is below; this is a local helper for the MIDI number.
 */
function midiFromFrequency(frequency: number): number {
  return 69 + 12 * Math.log2(frequency / 440);
}

/**
 * Generate a Karplus-Strong plucked string waveform with physical modeling.
 *
 * Algorithm:
 * 1. Create a circular delay line whose length = sampleRate / frequency
 * 2. Fill it with brightness-filtered noise shaped by a half-sine window (excitation)
 * 3. Apply a pick-position comb filter to remove the harmonic at the pick point
 * 4. Loop with:
 *    a. Frequency-dependent damping (high notes decay faster)
 *    b. One-pole allpass for string stiffness (inharmonicity)
 *    c. Standard KS lossy averaging
 * 5. Blend ~20% body resonance (2-pole bandpass at ~200 Hz)
 */
export function generateKSBuffer(
  sampleRate: number,
  frequency: number,
  params: KSParams = DEFAULT_PARAMS,
): Float32Array {
  const totalSamples = Math.floor(sampleRate * params.duration);
  const output = new Float32Array(totalSamples);

  // Delay line length determines the fundamental frequency
  const delayLength = Math.round(sampleRate / frequency);
  if (delayLength < 2) return output;

  const delayLine = new Float32Array(delayLength);

  // --- A. Frequency-dependent damping ---
  // Real strings lose energy faster at high pitch. Gentle scaling so
  // mid-range notes (A440) stay close to the base damping value.
  const midi = midiFromFrequency(frequency);
  const effectiveDamping = Math.max(0.990, Math.min(params.damping, params.damping - (midi - 40) * 0.00005));

  // --- B. String stiffness coefficient (one-pole allpass) ---
  // Nylon strings have low stiffness → nearly harmonic overtones.
  // Subtle allpass shift adds just enough life without metallic character.
  const stiffness = Math.max(0, Math.min(0.25, 0.25 - frequency / 20000));

  // --- 1. Fill delay line with shaped excitation ---
  // Raised cosine window (never below 0.5) shapes the pluck displacement
  // while preserving strong initial energy.
  let prev = 0;
  for (let i = 0; i < delayLength; i++) {
    const noise = Math.random() * 2 - 1;
    const filtered = params.brightness * noise + (1 - params.brightness) * prev;
    prev = filtered;
    // Raised cosine: range [0.5, 1.0] — full energy at center, half at edges
    const window = 0.5 + 0.5 * Math.sin(Math.PI * i / delayLength);
    delayLine[i] = filtered * window;
  }

  // --- 2. Pick-position comb filter ---
  if (params.pickPosition > 0 && params.pickPosition < 1) {
    const pickDelay = Math.max(1, Math.round(params.pickPosition * delayLength));
    const copy = new Float32Array(delayLine);
    for (let i = 0; i < delayLength; i++) {
      const delayed = i >= pickDelay ? copy[i - pickDelay] : copy[delayLength + i - pickDelay];
      delayLine[i] = copy[i] - delayed;
    }
    // Normalize after comb filter to prevent amplitude drop
    let peak = 0;
    for (let i = 0; i < delayLength; i++) {
      const abs = Math.abs(delayLine[i]);
      if (abs > peak) peak = abs;
    }
    if (peak > 0) {
      const scale = 1 / peak;
      for (let i = 0; i < delayLength; i++) {
        delayLine[i] *= scale;
      }
    }
  }

  // --- 3. KS loop with stiffness allpass ---
  let allpassState = 0;
  let prevInput = 0;
  let readIndex = 0;

  for (let i = 0; i < totalSamples; i++) {
    const current = delayLine[readIndex];
    const nextIndex = (readIndex + 1) % delayLength;
    const next = delayLine[nextIndex];

    output[i] = current;

    // Standard KS lossy averaging
    let averaged = effectiveDamping * 0.5 * (current + next);

    // One-pole allpass for string stiffness (shifts partials slightly)
    const allpassOut = stiffness * (averaged - allpassState) + prevInput;
    prevInput = averaged;
    allpassState = allpassOut;
    averaged = allpassOut;

    delayLine[readIndex] = averaged;
    readIndex = nextIndex;
  }

  // --- 4. Body resonance simulation ---
  // 2-pole bandpass at ~220 Hz simulates classical guitar body resonance.
  // Blend 18% resonant + 82% dry for warmth without muddiness.
  const bodyFreq = 220;
  const bodyQ = 1.0;
  const w0 = 2 * Math.PI * bodyFreq / sampleRate;
  const alpha = Math.sin(w0) / (2 * bodyQ);
  const b0 = alpha;
  const b1 = 0;
  const b2 = -alpha;
  const a0 = 1 + alpha;
  const a1 = -2 * Math.cos(w0);
  const a2 = 1 - alpha;

  // Normalize coefficients
  const nb0 = b0 / a0;
  const nb1 = b1 / a0;
  const nb2 = b2 / a0;
  const na1 = a1 / a0;
  const na2 = a2 / a0;

  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const dryMix = 0.82;
  const wetMix = 0.18;

  for (let i = 0; i < totalSamples; i++) {
    const x0 = output[i];
    const y0 = nb0 * x0 + nb1 * x1 + nb2 * x2 - na1 * y1 - na2 * y2;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
    output[i] = dryMix * x0 + wetMix * y0;
  }

  // --- 5. Output lowpass ---
  // One-pole lowpass at ~3 kHz rolls off remaining high-frequency harshness.
  // Gives the nylon-string warmth that KS noise excitation alone can't achieve.
  const lpCutoff = 3000;
  const lpRC = 1 / (2 * Math.PI * lpCutoff);
  const lpDt = 1 / sampleRate;
  const lpAlpha = lpDt / (lpRC + lpDt);
  let lpPrev = output[0];
  for (let i = 1; i < totalSamples; i++) {
    lpPrev = lpPrev + lpAlpha * (output[i] - lpPrev);
    output[i] = lpPrev;
  }

  return output;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function startNote(midiNumber: number, params: Partial<KSParams> = {}): void {
  const ctx = getContext();

  // Already playing — skip
  if (voices.has(midiNumber)) return;

  // Voice stealing: evict oldest if at polyphony limit
  if (voices.size >= MAX_POLYPHONY) {
    let oldestMidi = -1;
    let oldestOrder = Infinity;
    for (const [midi, order] of voiceOrder) {
      if (order < oldestOrder) {
        oldestOrder = order;
        oldestMidi = midi;
      }
    }
    if (oldestMidi !== -1) {
      stopNote(oldestMidi);
    }
  }

  const frequency = midiToFrequency(midiNumber);
  const mergedParams = { ...DEFAULT_PARAMS, ...params };
  const samples = generateKSBuffer(ctx.sampleRate, frequency, mergedParams);

  const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate);
  buffer.getChannelData(0).set(samples);

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.value = 0.45; // Match FM synth levels (~0.5 default volume)

  source.connect(gain);
  gain.connect(masterGain!);

  source.start();
  voices.set(midiNumber, { source, gain });
  voiceOrder.set(midiNumber, voiceCounter++);

  // Auto-cleanup when buffer finishes playing
  source.onended = () => {
    voices.delete(midiNumber);
    voiceOrder.delete(midiNumber);
  };
}

export function stopNote(midiNumber: number): void {
  const voice = voices.get(midiNumber);
  if (!voice) return;

  const ctx = getContext();
  const now = ctx.currentTime;

  // Quick fade-out to avoid click
  voice.gain.gain.cancelScheduledValues(now);
  voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
  voice.gain.gain.linearRampToValueAtTime(0, now + FADE_OUT_MS / 1000);

  voice.source.stop(now + FADE_OUT_MS / 1000 + 0.01);
  voices.delete(midiNumber);
  voiceOrder.delete(midiNumber);
}

/**
 * Scheduled one-shot pluck for chord/scale/ear-training playback — the
 * guitar counterpart of pianoSampler.playNote. `when` is seconds from now
 * (offsets transfer across AudioContexts; the caller computes them against
 * core audio's clock). The pluck holds until `when + duration`, then a short
 * release ramp mimics a finger lift so fast scales stay articulate. The
 * generated buffer is capped to what will actually be heard, so scheduling a
 * 16-note scale stays cheap. One-shots live outside the sustained-voice map:
 * a scheduled scale must never voice-steal a held fret note.
 */
export function playNote(
  midiNumber: number,
  when: number,
  duration: number,
  velocity: number,
): void {
  const ctx = getContext();
  const frequency = midiToFrequency(midiNumber);
  const bufferDuration = Math.max(
    ONESHOT_MIN_BUFFER_S,
    Math.min(DEFAULT_PARAMS.duration, duration + 0.5),
  );
  const samples = generateKSBuffer(ctx.sampleRate, frequency, {
    ...DEFAULT_PARAMS,
    duration: bufferDuration,
  });

  const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate);
  buffer.getChannelData(0).set(samples);

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  // 0.5 default velocity → 0.45, the sustained-pluck level
  gain.gain.value = velocity * 0.9;

  const startAt = ctx.currentTime + when;
  const endAt = startAt + duration;
  gain.gain.setValueAtTime(velocity * 0.9, endAt);
  gain.gain.linearRampToValueAtTime(0, endAt + ONESHOT_RELEASE_S);

  source.connect(gain);
  gain.connect(masterGain!);
  source.start(startAt);
  source.stop(endAt + ONESHOT_RELEASE_S + 0.05);

  const voice: Voice = { source, gain };
  oneShots.add(voice);
  source.onended = () => {
    oneShots.delete(voice);
  };
}

export function stopAll(): void {
  for (const midi of [...voices.keys()]) {
    stopNote(midi);
  }
  const ctx = getContext();
  const now = ctx.currentTime;
  for (const voice of oneShots) {
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.linearRampToValueAtTime(0, now + FADE_OUT_MS / 1000);
    try {
      voice.source.stop(now + FADE_OUT_MS / 1000 + 0.01);
    } catch {
      // already stopped
    }
  }
  oneShots.clear();
}

export function setVolume(vol: number): void {
  masterVolume = vol;
  if (masterGain) {
    masterGain.gain.value = vol;
  }
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
  voiceOrder.clear();
  oneShots.clear();
  voiceCounter = 0;
  masterVolume = 0.9;
  audioContext = null;
  masterGain = null;
  compressor = null;
  dryGain = null;
  wetGain = null;
  reverb = null;
}
