/**
 * Audio Service — Web Audio API synthesis engine
 *
 * Provides zero-dependency audio playback for the entire app using the
 * browser's built-in Web Audio API. Features include:
 *
 * - ADSR envelope synthesis with configurable waveforms (piano, organ, strings, pluck)
 * - Convolution reverb with adjustable wet/dry mix
 * - Master volume and tempo controls
 * - Single notes, chords (close/open voicing), arpeggios, and scale playback
 * - Sustained note support for multitouch piano interaction
 * - Precise AudioContext-based scheduling with setTimeout visual callbacks
 *
 * Architecture: module-level singletons (AudioContext, gain nodes, convolver)
 * are lazily initialised on first use and shared across all playback calls.
 * Active oscillators and timeouts are tracked for clean stop/cleanup.
 */

import { Note, PitchedNote } from '../types/music';
import { getNoteFrequency, getPitchClass } from '../constants/notes';
import { chordVoicingPitches } from '../utils/pianoLayout';

// Audio context (lazy initialization)
let audioContext: AudioContext | null = null;
let reverbNode: ConvolverNode | null = null;
let dryGainNode: GainNode | null = null;
let wetGainNode: GainNode | null = null;
let masterGainNode: GainNode | null = null;
let compressorNode: DynamicsCompressorNode | null = null;

// Active audio nodes for stop functionality
// Each entry pairs an oscillator with its per-voice gain node for click-free stopping
const activeOscillators: Set<{ oscillator: OscillatorNode; gainNode: GainNode }> = new Set();
const activeTimeouts: Set<ReturnType<typeof setTimeout>> = new Set();

// Global audio settings
let masterVolume = 0.7; // 0-1
let playbackTempo = 1.0; // 1.0 = normal, 0.5 = half speed, 2.0 = double speed

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
    // Set up master gain and reverb effect chain
    setupMasterGain(audioContext);
    setupReverb(audioContext);
  }
  return audioContext;
}

// Set up master gain node with safety compressor/limiter
function setupMasterGain(ctx: AudioContext): void {
  masterGainNode = ctx.createGain();
  masterGainNode.gain.value = masterVolume;

  // DynamicsCompressorNode acts as a safety limiter to prevent digital clipping
  // when multiple components play simultaneously or extended chords stack with reverb
  compressorNode = ctx.createDynamicsCompressor();
  compressorNode.threshold.value = -12; // Start compressing at -12 dBFS
  compressorNode.knee.value = 6; // Soft knee for transparent onset
  compressorNode.ratio.value = 4; // 4:1 ratio — firm limiting without brick-wall
  compressorNode.attack.value = 0.003; // 3ms attack — catches transients quickly
  compressorNode.release.value = 0.1; // 100ms release — recovers smoothly

  // Signal chain: masterGainNode → compressorNode → destination
  masterGainNode.connect(compressorNode);
  compressorNode.connect(ctx.destination);
}

// Create a more natural reverb impulse response with early reflections
function createReverbImpulse(
  ctx: AudioContext,
  duration: number = 1.5,
  decay: number = 2
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);

  // Early reflection times (in seconds) and amplitudes
  const earlyReflections = [
    { time: 0.011, amp: 0.7 },
    { time: 0.019, amp: 0.5 },
    { time: 0.027, amp: 0.4 },
    { time: 0.037, amp: 0.3 },
    { time: 0.048, amp: 0.25 },
  ];

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);

    // Add early reflections (slight stereo offset for width)
    const stereoOffset = channel === 0 ? 0 : 0.002;
    for (const reflection of earlyReflections) {
      const sampleIndex = Math.floor((reflection.time + stereoOffset) * sampleRate);
      if (sampleIndex < length) {
        // Add slight noise burst for each reflection
        for (let j = 0; j < 20; j++) {
          if (sampleIndex + j < length) {
            channelData[sampleIndex + j] += (Math.random() * 2 - 1) * reflection.amp * 0.3;
          }
        }
      }
    }

    // Diffuse tail starts after early reflections (~60ms)
    const tailStart = Math.floor(0.06 * sampleRate);
    for (let i = tailStart; i < length; i++) {
      const t = (i - tailStart) / (length - tailStart); // 0 to 1
      // Exponential decay with filtered noise (smoother)
      const envelope = Math.pow(1 - t, decay);
      // Low-pass effect: average with previous samples for smoother tail
      const noise = Math.random() * 2 - 1;
      channelData[i] += noise * envelope * 0.4;
    }
  }

  return impulse;
}

// Set up reverb effect chain
function setupReverb(ctx: AudioContext): void {
  // Create convolver for reverb
  reverbNode = ctx.createConvolver();
  reverbNode.buffer = createReverbImpulse(ctx, 1.2, 2.5);

  // Dry/wet mix
  dryGainNode = ctx.createGain();
  wetGainNode = ctx.createGain();

  // Set mix levels (subtle reverb)
  dryGainNode.gain.value = 0.85; // 85% dry
  wetGainNode.gain.value = 0.15; // 15% wet reverb

  // Connect reverb chain to master gain (not directly to destination)
  if (masterGainNode) {
    reverbNode.connect(wetGainNode);
    wetGainNode.connect(masterGainNode);
    dryGainNode.connect(masterGainNode);
  } else {
    // Fallback if master gain not set up yet
    reverbNode.connect(wetGainNode);
    wetGainNode.connect(ctx.destination);
    dryGainNode.connect(ctx.destination);
  }
}

// Connect a node to both dry and wet paths
function connectWithReverb(node: AudioNode): void {
  if (dryGainNode && reverbNode) {
    node.connect(dryGainNode);
    node.connect(reverbNode);
  } else {
    node.connect(getAudioContext().destination);
  }
}

// ============================================================================
// Pluggable instrument voice
// ============================================================================
// The app registers the active melodic voice here — the sampled Salamander
// piano or the Karplus-Strong guitar, following the instrument selected in
// the UI. When the voice handles a note it returns true and the FM synth
// stays silent; when it declines (piano samples still loading/offline) the
// synth plays exactly as before. Registration keeps this module
// framework-agnostic — core never imports app code.

export interface InstrumentVoice {
  /** One-shot at `when` seconds from now, released after `duration`. */
  playNote(midi: number, when: number, duration: number, velocity: number): boolean;
  /** Sustained note-on; pairs with stopNote. */
  startNote(midi: number, velocity: number): boolean;
  stopNote(midi: number): void;
  setVolume(volume: number): void;
  resume(): Promise<void>;
  /**
   * Cancel every one-shot this voice has scheduled or is still sounding
   * (playNote), with a short fade — never a click. Sustained notes
   * (startNote, i.e. keys/frets the user is holding) are left alone.
   * Called by stopPlayback(): one-shots are handed to the voice up front on
   * the audio clock, so without this a scale or progression could not be
   * stopped once the samples had decoded (audit W0-04 review B1 / W8-01).
   */
  cancelScheduled(): void;
}

let instrumentVoice: InstrumentVoice | null = null;

export function setInstrumentVoice(voice: InstrumentVoice | null): void {
  instrumentVoice = voice;
}

// Resume audio context (required after user interaction)
export async function resumeAudio(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  await instrumentVoice?.resume();
}

// ============================================================================
// Volume and Tempo Controls
// ============================================================================

// Set master volume (0-1)
export function setMasterVolume(volume: number): void {
  masterVolume = Math.max(0, Math.min(1, volume));
  if (masterGainNode) {
    const ctx = getAudioContext();
    // Smooth transition to avoid clicks
    masterGainNode.gain.setTargetAtTime(masterVolume, ctx.currentTime, 0.05);
  }
  instrumentVoice?.setVolume(masterVolume);
}

// Get current master volume
export function getMasterVolume(): number {
  return masterVolume;
}

// Set playback tempo multiplier (0.5-2.0)
export function setPlaybackTempo(tempo: number): void {
  playbackTempo = Math.max(0.25, Math.min(2.0, tempo));
}

// Get current playback tempo
export function getPlaybackTempo(): number {
  return playbackTempo;
}

// Set reverb wet/dry mix (0 = all dry, 1 = all wet)
export function setReverbMix(wetAmount: number): void {
  const wet = Math.max(0, Math.min(1, wetAmount));
  const dry = 1 - wet;
  if (dryGainNode && wetGainNode) {
    const ctx = getAudioContext();
    dryGainNode.gain.setTargetAtTime(dry, ctx.currentTime, 0.05);
    wetGainNode.gain.setTargetAtTime(wet, ctx.currentTime, 0.05);
  }
}

// Get current reverb mix
export function getReverbMix(): number {
  return wetGainNode?.gain.value ?? 0.15;
}

const STOP_FADE_S = 0.03; // 30ms fade-out to avoid click artifacts

/** Ramp an FM voice's gain to near-zero, then stop the oscillator (no click). */
function fadeOutAndStop(entry: { oscillator: OscillatorNode; gainNode: GainNode }, now: number): void {
  const { oscillator, gainNode } = entry;
  try {
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + STOP_FADE_S);
    oscillator.stop(now + STOP_FADE_S + 0.02);
  } catch {
    // Oscillator may have already stopped
    try {
      oscillator.disconnect();
    } catch {
      // Already disconnected
    }
  }
}

/**
 * Cancel every scheduled or still-sounding ONE-SHOT note — the registered
 * voice's (sampled piano / guitar / KS) and the FM fallback's — with a short
 * fade. Unlike stopPlayback() it leaves held (sustained) notes alone. The
 * cancelled phrases' visuals are settled, not dropped: pending highlights are
 * cancelled and each phrase's onComplete (e.g. the chord panel's arpeggio
 * un-lighting its keys) runs immediately (audit W0 round-2 review B2, W8-01).
 * Use it to restart a playback, or when another playback starts.
 */
export function cancelScheduledAudio(): void {
  instrumentVoice?.cancelScheduled();
  settleVisualPhrases();
  const ctx = audioContext;
  if (!ctx) return;
  const now = ctx.currentTime;
  const held = new Set<OscillatorNode>();
  for (const e of sustainedNotes.values()) {
    held.add(e.oscillator);
    if (e.modOsc) held.add(e.modOsc);
    if (e.detuneOsc) held.add(e.detuneOsc);
  }
  for (const entry of [...activeOscillators]) {
    if (held.has(entry.oscillator)) continue;
    fadeOutAndStop(entry, now);
    activeOscillators.delete(entry);
  }
}

// Stop all current playback with click-free fade-out — sound, held FM notes
// AND every tracked visual timeout. To merely restart a playback without
// breaking other components' visual callbacks, use cancelScheduledAudio().
export function stopPlayback(): void {
  // The registered voice (sampled piano / guitar / KS) owns almost every
  // scheduled note once samples decode — cancel those first. Its held notes
  // stay; the FM fallback's own sustained notes are still cleared below, as
  // before.
  instrumentVoice?.cancelScheduled();

  const ctx = audioContext;
  const now = ctx?.currentTime ?? 0;
  const fadeTime = STOP_FADE_S;

  // Fade out and stop all active oscillators
  activeOscillators.forEach((entry) => fadeOutAndStop(entry, now));
  activeOscillators.clear();

  // Stop auxiliary oscillators from sustained notes (modulation, detune)
  // Main oscillators are already handled by activeOscillators loop above
  sustainedNotes.forEach((entry) => {
    try {
      if (entry.modOsc) entry.modOsc.stop(now + fadeTime + 0.02);
      if (entry.detuneOsc) entry.detuneOsc.stop(now + fadeTime + 0.02);
    } catch {
      // Already stopped
    }
  });
  sustainedNotes.clear();

  // Settle the phrases' visuals (their clean-up runs — no key left lit), then
  // clear every other scheduled timeout.
  settleVisualPhrases();
  activeTimeouts.forEach((timeout) => clearTimeout(timeout));
  activeTimeouts.clear();
}

// Check if audio is currently playing
export function isPlaying(): boolean {
  return activeOscillators.size > 0;
}

/**
 * The visual half of one scheduled phrase (scale / arpeggio / sequence): its
 * pending step callbacks and its clean-up. Tracked so that cancelling the
 * phrase's SOUND also settles its VISUALS (audit W8-01): pending highlights
 * are dropped (no key lights for a note that will never sound) and the
 * clean-up runs at once, exactly once — stopPlayback used to drop it (keys
 * stayed lit), cancelScheduledAudio used to let it fire seconds later over
 * silence.
 */
interface VisualPhrase {
  timeouts: Set<ReturnType<typeof setTimeout>>;
  onComplete?: () => void;
}
const activePhrases: Set<VisualPhrase> = new Set();

/** Step i fires at delaysMs[i]; onComplete fires tailMs after the last step. */
function scheduleVisualPhrase(
  delaysMs: number[],
  onStep: (index: number) => void,
  tailMs: number,
  onComplete?: () => void,
): void {
  if (delaysMs.length === 0) return;
  const phrase: VisualPhrase = { timeouts: new Set(), onComplete };
  activePhrases.add(phrase);
  const track = (callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      phrase.timeouts.delete(timeout);
      activeTimeouts.delete(timeout);
      callback();
    }, delay);
    phrase.timeouts.add(timeout);
    activeTimeouts.add(timeout);
  };
  delaysMs.forEach((delay, index) => {
    track(() => {
      onStep(index);
      if (index !== delaysMs.length - 1) return;
      if (onComplete) {
        track(() => {
          activePhrases.delete(phrase);
          onComplete();
        }, tailMs);
      } else {
        activePhrases.delete(phrase);
      }
    }, delay);
  });
}

/** Drop every unfinished phrase's pending steps and run its clean-up now. */
function settleVisualPhrases(): void {
  const phrases = [...activePhrases];
  activePhrases.clear();
  for (const phrase of phrases) {
    for (const timeout of phrase.timeouts) {
      clearTimeout(timeout);
      activeTimeouts.delete(timeout);
    }
    phrase.timeouts.clear();
    try {
      phrase.onComplete?.();
    } catch (err) {
      // One component's clean-up must not stop the others'.
      console.error('[audio] phrase clean-up failed', err);
    }
  }
}

// Sound synthesis configuration
interface SynthConfig {
  waveform: OscillatorType;
  attack: number; // seconds
  decay: number; // seconds
  sustain: number; // 0-1 level
  release: number; // seconds
  volume: number; // 0-1

  // FM synthesis (optional — when present, creates richer harmonic content)
  fmRatio?: number; // Modulator freq = carrier freq × ratio (e.g. 2.0)
  fmIndex?: number; // Peak modulation depth in Hz (e.g. 200)
  fmAttack?: number; // Modulation envelope attack (seconds)
  fmDecay?: number; // Modulation envelope decay — brightness fades (seconds)
  fmSustain?: number; // Modulation sustain level (0–1)

  // Detuned second oscillator for warmth (optional)
  detuneCents?: number; // Detune in cents (e.g. 4)
  detuneGain?: number; // Gain of detuned layer relative to main (e.g. 0.3)

  // Filter (optional — for taming harshness or shaping tone)
  filterType?: BiquadFilterType; // 'lowpass', 'highpass', 'bandpass', etc.
  filterFreq?: number; // Cutoff frequency in Hz
  filterQ?: number; // Resonance (default 1)
}

// Default piano-like sound
const DEFAULT_SYNTH_CONFIG: SynthConfig = {
  waveform: 'triangle',
  attack: 0.02,
  decay: 0.1,
  sustain: 0.3,
  release: 0.3,
  volume: 0.5,
};

// Play a single note - can be scheduled at a specific time
export function playNote(
  note: Note,
  octave: number = 4,
  duration: number = 0.5,
  config: Partial<SynthConfig> = {},
  startTime?: number // Optional: schedule at specific AudioContext time
): void {
  const ctx = getAudioContext();
  const frequency = getNoteFrequency(note, octave);
  const synthConfig = { ...DEFAULT_SYNTH_CONFIG, ...config };

  // The registered voice takes over when it can handle this note
  const midiNumber = 12 + octave * 12 + getPitchClass(note);
  const whenOffset = startTime !== undefined ? Math.max(0, startTime - ctx.currentTime) : 0;
  if (instrumentVoice?.playNote(midiNumber, whenOffset, duration, synthConfig.volume)) {
    return;
  }

  // Create oscillator and gain nodes
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Optional filter for tone shaping
  let filterNode: BiquadFilterNode | undefined;
  if (synthConfig.filterType && synthConfig.filterFreq) {
    filterNode = ctx.createBiquadFilter();
    filterNode.type = synthConfig.filterType;
    filterNode.frequency.value = synthConfig.filterFreq;
    filterNode.Q.value = synthConfig.filterQ ?? 1;
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
  } else {
    oscillator.connect(gainNode);
  }
  connectWithReverb(gainNode);

  oscillator.type = synthConfig.waveform;
  oscillator.frequency.value = frequency;

  // Use provided startTime or current time
  const now = startTime ?? ctx.currentTime;

  // --- FM synthesis (optional) ---
  let modOsc: OscillatorNode | undefined;
  let modGain: GainNode | undefined;
  if (synthConfig.fmRatio !== undefined && synthConfig.fmIndex !== undefined) {
    modOsc = ctx.createOscillator();
    modGain = ctx.createGain();
    modOsc.type = 'sine';
    modOsc.frequency.value = frequency * synthConfig.fmRatio;
    modOsc.connect(modGain);
    modGain.connect(oscillator.frequency); // FM: modulator drives carrier frequency

    // Scale FM index by frequency (reference: middle C ~262Hz)
    // Higher notes get less modulation, lower notes get more — keeps brightness consistent
    const referenceFreq = 261.63;
    const scaledFmIndex = synthConfig.fmIndex * (referenceFreq / frequency);

    // FM envelope: attack to scaledFmIndex, decay to scaledFmIndex × fmSustain
    const fmAtt = synthConfig.fmAttack ?? synthConfig.attack;
    const fmDec = synthConfig.fmDecay ?? synthConfig.decay;
    const fmSus = synthConfig.fmSustain ?? 0;
    modGain.gain.setValueAtTime(0, now);
    modGain.gain.linearRampToValueAtTime(scaledFmIndex, now + fmAtt);
    modGain.gain.linearRampToValueAtTime(scaledFmIndex * fmSus, now + fmAtt + fmDec);

    modOsc.start(now);
    modOsc.stop(now + duration + 0.1);
    // Track FM modulator with the per-voice gain node for click-free stopping
    activeOscillators.add({ oscillator: modOsc, gainNode });
  }

  // --- Detuned second oscillator (optional) ---
  let detuneOsc: OscillatorNode | undefined;
  let detuneGainNode: GainNode | undefined;
  if (synthConfig.detuneCents !== undefined) {
    detuneOsc = ctx.createOscillator();
    detuneGainNode = ctx.createGain();
    detuneOsc.type = synthConfig.waveform;
    detuneOsc.frequency.value = frequency;
    detuneOsc.detune.value = synthConfig.detuneCents;
    detuneGainNode.gain.value = synthConfig.detuneGain ?? 0.3;
    // Route through filter if present, otherwise direct to gain
    if (filterNode) {
      detuneOsc.connect(detuneGainNode);
      detuneGainNode.connect(filterNode);
    } else {
      detuneOsc.connect(detuneGainNode);
      detuneGainNode.connect(gainNode);
    }

    detuneOsc.start(now);
    detuneOsc.stop(now + duration + 0.1);
    // Track detuned oscillator with the per-voice gain node for click-free stopping
    activeOscillators.add({ oscillator: detuneOsc, gainNode });
  }

  // ADSR envelope
  gainNode.gain.setValueAtTime(0, now);
  // Attack
  gainNode.gain.linearRampToValueAtTime(synthConfig.volume, now + synthConfig.attack);
  // Decay to sustain
  gainNode.gain.linearRampToValueAtTime(
    synthConfig.volume * synthConfig.sustain,
    now + synthConfig.attack + synthConfig.decay
  );
  // Sustain (hold at level)
  const sustainEnd = now + duration - synthConfig.release;
  gainNode.gain.setValueAtTime(
    synthConfig.volume * synthConfig.sustain,
    Math.max(sustainEnd, now + synthConfig.attack + synthConfig.decay)
  );
  // Release - use setTargetAtTime for smooth exponential decay to near-zero
  // timeConstant controls decay rate (smaller = faster)
  const releaseStart = Math.max(sustainEnd, now + synthConfig.attack + synthConfig.decay);
  const timeConstant = synthConfig.release / 5; // Reaches ~99% of target in 5 time constants
  gainNode.gain.setTargetAtTime(0.0001, releaseStart, timeConstant);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.1);

  // Track active oscillator with its gain node for click-free stopping
  const carrierEntry = { oscillator, gainNode };
  activeOscillators.add(carrierEntry);

  // Track entries for FM and detune oscillators for cleanup
  const modEntry = modOsc ? { oscillator: modOsc, gainNode } : undefined;
  const detuneEntry = detuneOsc ? { oscillator: detuneOsc, gainNode } : undefined;

  // Clean up nodes when done
  oscillator.onended = () => {
    activeOscillators.delete(carrierEntry);
    oscillator.disconnect();
    gainNode.disconnect();
    if (filterNode) filterNode.disconnect();
    if (modOsc) {
      if (modEntry) activeOscillators.delete(modEntry);
      modOsc.disconnect();
    }
    if (modGain) modGain.disconnect();
    if (detuneOsc) {
      if (detuneEntry) activeOscillators.delete(detuneEntry);
      detuneOsc.disconnect();
    }
    if (detuneGainNode) detuneGainNode.disconnect();
  };
}

// --- Sustained notes (for multitouch piano) ---
// Notes that play while held and stop on release

// Maximum number of simultaneous sustained notes. Each note may create up to
// 3 oscillators (carrier + FM modulator + detuned layer), so 16 notes = 48
// oscillators max — a safe ceiling even for low-end mobile audio threads.
const MAX_POLYPHONY = 16;

// Monotonic counter for voice-stealing age tracking (cheaper than Date.now())
let sustainedNoteCounter = 0;

interface SustainedNoteEntry {
  oscillator: OscillatorNode;
  gainNode: GainNode;
  filterNode?: BiquadFilterNode;
  modOsc?: OscillatorNode;
  modGain?: GainNode;
  detuneOsc?: OscillatorNode;
  detuneGainNode?: GainNode;
  /** Monotonically increasing value used to identify the oldest voice for stealing */
  createdAt: number;
}

const sustainedNotes: Map<number, SustainedNoteEntry> = new Map();

// Start a sustained note that plays until explicitly stopped
// Returns the MIDI number used as the key
export function startSustainedNote(
  note: Note,
  octave: number,
  config: Partial<SynthConfig> = {}
): number {
  const ctx = getAudioContext();
  const frequency = getNoteFrequency(note, octave);
  const synthConfig = { ...DEFAULT_SYNTH_CONFIG, ...config };
  const midiNumber = 12 + octave * 12 + getPitchClass(note);

  // If already playing this note, don't restart
  if (sustainedNotes.has(midiNumber)) return midiNumber;

  // The registered voice takes over when it can handle this note
  if (instrumentVoice?.startNote(midiNumber, synthConfig.volume)) {
    return midiNumber;
  }

  // Voice stealing: if at polyphony limit, evict the oldest sustained note
  if (sustainedNotes.size >= MAX_POLYPHONY) {
    let oldestMidi = -1;
    let oldestAge = Infinity;
    for (const [midi, entry] of sustainedNotes) {
      if (entry.createdAt < oldestAge) {
        oldestAge = entry.createdAt;
        oldestMidi = midi;
      }
    }
    if (oldestMidi !== -1) {
      stopSustainedNote(oldestMidi);
    }
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Optional filter for tone shaping
  let filterNode: BiquadFilterNode | undefined;
  if (synthConfig.filterType && synthConfig.filterFreq) {
    filterNode = ctx.createBiquadFilter();
    filterNode.type = synthConfig.filterType;
    filterNode.frequency.value = synthConfig.filterFreq;
    filterNode.Q.value = synthConfig.filterQ ?? 1;
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
  } else {
    oscillator.connect(gainNode);
  }
  connectWithReverb(gainNode);

  oscillator.type = synthConfig.waveform;
  oscillator.frequency.value = frequency;

  const now = ctx.currentTime;

  // --- FM synthesis (optional) ---
  let modOsc: OscillatorNode | undefined;
  let modGain: GainNode | undefined;
  if (synthConfig.fmRatio !== undefined && synthConfig.fmIndex !== undefined) {
    modOsc = ctx.createOscillator();
    modGain = ctx.createGain();
    modOsc.type = 'sine';
    modOsc.frequency.value = frequency * synthConfig.fmRatio;
    modOsc.connect(modGain);
    modGain.connect(oscillator.frequency);

    // Scale FM index by frequency (reference: middle C ~262Hz)
    const referenceFreq = 261.63;
    const scaledFmIndex = synthConfig.fmIndex * (referenceFreq / frequency);

    const fmAtt = synthConfig.fmAttack ?? synthConfig.attack;
    const fmDec = synthConfig.fmDecay ?? synthConfig.decay;
    const fmSus = synthConfig.fmSustain ?? 0;
    modGain.gain.setValueAtTime(0, now);
    modGain.gain.linearRampToValueAtTime(scaledFmIndex, now + fmAtt);
    modGain.gain.linearRampToValueAtTime(scaledFmIndex * fmSus, now + fmAtt + fmDec);

    modOsc.start(now);
    activeOscillators.add({ oscillator: modOsc, gainNode });
  }

  // --- Detuned second oscillator (optional) ---
  let detuneOsc: OscillatorNode | undefined;
  let detuneGainNode: GainNode | undefined;
  if (synthConfig.detuneCents !== undefined) {
    detuneOsc = ctx.createOscillator();
    detuneGainNode = ctx.createGain();
    detuneOsc.type = synthConfig.waveform;
    detuneOsc.frequency.value = frequency;
    detuneOsc.detune.value = synthConfig.detuneCents;
    detuneGainNode.gain.value = synthConfig.detuneGain ?? 0.3;
    // Route through filter if present, otherwise direct to gain
    if (filterNode) {
      detuneOsc.connect(detuneGainNode);
      detuneGainNode.connect(filterNode);
    } else {
      detuneOsc.connect(detuneGainNode);
      detuneGainNode.connect(gainNode);
    }

    detuneOsc.start(now);
    activeOscillators.add({ oscillator: detuneOsc, gainNode });
  }

  // Attack envelope (masterVolume applied via masterGainNode in signal chain)
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(synthConfig.volume, now + synthConfig.attack);
  // Decay to sustain level
  gainNode.gain.linearRampToValueAtTime(
    synthConfig.volume * synthConfig.sustain,
    now + synthConfig.attack + synthConfig.decay
  );

  oscillator.start(now);
  activeOscillators.add({ oscillator, gainNode });
  sustainedNotes.set(midiNumber, {
    oscillator,
    gainNode,
    filterNode,
    modOsc,
    modGain,
    detuneOsc,
    detuneGainNode,
    createdAt: sustainedNoteCounter++,
  });

  return midiNumber;
}

// Stop a sustained note with a smooth release
export function stopSustainedNote(midiNumber: number): void {
  const entry = sustainedNotes.get(midiNumber);
  if (!entry) {
    // The active voice may own this note (no synth entry was created)
    instrumentVoice?.stopNote(midiNumber);
    return;
  }

  const ctx = getAudioContext();
  const { oscillator, gainNode, filterNode, modOsc, modGain, detuneOsc, detuneGainNode } = entry;

  // Smooth release to avoid clicks
  const now = ctx.currentTime;
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.16);

  // Stop oscillators with exception handling (BUG-008 fix)
  // Oscillators may throw if already stopped by stopPlayback() or context changes
  try {
    oscillator.stop(now + 0.2);
    if (modOsc) modOsc.stop(now + 0.2);
    if (detuneOsc) detuneOsc.stop(now + 0.2);
  } catch {
    // Oscillators may have already stopped - continue with cleanup
  }

  oscillator.onended = () => {
    // Remove entries matching this oscillator and its associated oscillators
    for (const entry of activeOscillators) {
      if (
        entry.oscillator === oscillator ||
        entry.oscillator === modOsc ||
        entry.oscillator === detuneOsc
      ) {
        activeOscillators.delete(entry);
      }
    }
    oscillator.disconnect();
    gainNode.disconnect();
    if (filterNode) filterNode.disconnect();
    if (modOsc) modOsc.disconnect();
    if (modGain) modGain.disconnect();
    if (detuneOsc) detuneOsc.disconnect();
    if (detuneGainNode) detuneGainNode.disconnect();
  };

  sustainedNotes.delete(midiNumber);
}

// Schedule a note at a precise AudioContext time
function scheduleNote(
  note: Note,
  octave: number,
  startTime: number,
  duration: number,
  config: Partial<SynthConfig> = {}
): void {
  playNote(note, octave, duration, config, startTime);
}

// Play a pitched note (with octave)
export function playPitchedNote(
  note: PitchedNote,
  duration: number = 0.5,
  config: Partial<SynthConfig> = {}
): void {
  playNote(note, note.octave, duration, config);
}

// Calculate chord volume scaling - gentler than 1/sqrt(n) to maintain presence
function getChordVolumeScale(noteCount: number): number {
  // Formula: 1 / (1 + 0.2 * (n - 1)) — gentler rolloff than sqrt
  // 2 notes: 0.83, 3 notes: 0.71, 4 notes: 0.63, 5 notes: 0.56, 6 notes: 0.5
  return 1 / (1 + 0.2 * (noteCount - 1));
}

// Play multiple notes simultaneously (chord)
export function playChord(
  notes: Note[],
  octave: number = 4,
  duration: number = 1,
  config: Partial<SynthConfig> = {}
): void {
  // Reduce volume per note to prevent clipping
  const adjustedConfig = {
    ...config,
    volume: (config.volume ?? DEFAULT_SYNTH_CONFIG.volume) * getChordVolumeScale(notes.length),
  };

  notes.forEach((note) => {
    playNote(note, octave, duration, adjustedConfig);
  });
}

// Callback for note playback events
export type NotePlayCallback = (noteIndex: number, note: Note) => void;

// Play notes in sequence (arpeggio or scale) with precise AudioContext timing
export function playSequence(
  notes: Note[],
  octave: number = 4,
  noteDuration: number = 0.3,
  gap: number = 0.05,
  config: Partial<SynthConfig> = {},
  onNotePlay?: NotePlayCallback,
  onComplete?: () => void
): void {
  const ctx = getAudioContext();
  const startTime = ctx.currentTime;
  // Apply tempo to timing
  const scaledNoteDuration = noteDuration / playbackTempo;
  const scaledGap = gap / playbackTempo;
  const noteInterval = scaledNoteDuration + scaledGap;

  // Schedule all audio at precise times
  notes.forEach((note, index) => {
    const noteStartTime = startTime + index * noteInterval;
    scheduleNote(note, octave, noteStartTime, scaledNoteDuration, config);
  });

  // Use setTimeout for visual callbacks with lookahead compensation
  // Fire callbacks slightly early (~20ms) to account for JS/rendering latency
  const visualLookahead = 20; // ms
  if (onNotePlay || onComplete) {
    scheduleVisualPhrase(
      notes.map((_, index) => Math.max(0, index * noteInterval * 1000 - visualLookahead)),
      (index) => onNotePlay?.(index, notes[index]),
      scaledNoteDuration * 1000,
      onComplete,
    );
  }
}

// Callback for scale note playback - includes both sequence position and note index
export type ScaleNotePlayCallback = (sequenceIndex: number, noteIndex: number) => void;

// Play a scale (ascending and optionally descending) with precise AudioContext timing
// Notes always ascend in pitch - octave bumps when pitch class would go down
// For ascending+descending: G A B C D E F# G (all ascending) then F# E D C B A G (descending)
export function playScale(
  notes: Note[],
  startOctave: number = 4,
  ascending: boolean = true,
  descending: boolean = false,
  noteDuration: number = 0.35, // Slower default for learning (was 0.25)
  onNotePlay?: ScaleNotePlayCallback,
  onComplete?: () => void,
  synthConfig: Partial<SynthConfig> = {}
): void {
  const ctx = getAudioContext();
  const audioStartTime = ctx.currentTime;
  // Apply tempo to timing
  const scaledNoteDuration = noteDuration / playbackTempo;
  // Gap proportional to note duration (15%) — maintains consistent phrasing
  const scaledGap = scaledNoteDuration * 0.15;
  const noteInterval = scaledNoteDuration + scaledGap;

  // Build sequence with proper octave for each note
  const sequence: { note: Note; octave: number; noteIndex: number }[] = [];

  if (ascending) {
    // Ascending: calculate octaves to ensure pitch always goes up
    let currentOctave = startOctave;
    let lastPitchClass = -1;

    for (let i = 0; i < notes.length; i++) {
      const pitchClass = getPitchClass(notes[i]);

      // If pitch class is lower or equal, bump up octave
      if (i > 0 && pitchClass <= lastPitchClass) {
        currentOctave++;
      }

      sequence.push({ note: notes[i], octave: currentOctave, noteIndex: i });
      lastPitchClass = pitchClass;
    }

    // Add the octave note (root at one octave higher than where we ended)
    const rootPitchClass = getPitchClass(notes[0]);
    if (rootPitchClass <= lastPitchClass) {
      currentOctave++;
    }
    sequence.push({ note: notes[0], octave: currentOctave, noteIndex: notes.length });
  }

  if (descending) {
    // Descending: go back down from where ascending ended
    // Start from the note before the octave and go down
    let currentOctave =
      sequence.length > 0 ? sequence[sequence.length - 1].octave : startOctave + 1;
    let lastPitchClass = getPitchClass(notes[0]); // We just played the octave (root)

    for (let i = notes.length - 1; i >= 0; i--) {
      const pitchClass = getPitchClass(notes[i]);

      // If pitch class is higher or equal, drop down octave
      if (pitchClass >= lastPitchClass) {
        currentOctave--;
      }

      sequence.push({ note: notes[i], octave: currentOctave, noteIndex: i });
      lastPitchClass = pitchClass;
    }
  }

  // Reduce volume slightly, merged with synth preset
  const config = {
    ...synthConfig,
    volume: (synthConfig.volume ?? DEFAULT_SYNTH_CONFIG.volume) * 0.8,
  };

  // Schedule all audio at precise times
  sequence.forEach(({ note, octave }, seqIndex) => {
    const noteStartTime = audioStartTime + seqIndex * noteInterval;
    scheduleNote(note, octave, noteStartTime, scaledNoteDuration, config);
  });

  // Use setTimeout for visual callbacks with lookahead compensation
  const visualLookahead = 20; // ms - fire slightly early for better perceived sync
  if (onNotePlay || onComplete) {
    scheduleVisualPhrase(
      sequence.map((_, seqIndex) => Math.max(0, seqIndex * noteInterval * 1000 - visualLookahead)),
      (seqIndex) => onNotePlay?.(seqIndex, sequence[seqIndex].noteIndex),
      scaledNoteDuration * 1000,
      onComplete,
    );
  }
}

// Play chord as arpeggio (notes one by one)
export function playArpeggio(
  notes: Note[],
  octave: number = 4,
  noteDuration: number = 0.3,
  onNotePlay?: NotePlayCallback,
  onComplete?: () => void
): void {
  // Slightly reduced volume for arpeggios
  const config = {
    volume: DEFAULT_SYNTH_CONFIG.volume * 0.9,
  };
  playSequence(notes, octave, noteDuration, 0.05, config, onNotePlay, onComplete);
}

// Callback for pitched note playback events
export type PitchedNotePlayCallback = (noteIndex: number, note: Note, octave: number) => void;

// Play arpeggio with ascending pitch and precise AudioContext timing
// Notes always go up, octaves adjust automatically
export function playArpeggioAscending(
  notes: Note[],
  startOctave: number = 4,
  noteDuration: number = 0.3,
  onNotePlay?: PitchedNotePlayCallback,
  onComplete?: () => void,
  synthConfig: Partial<SynthConfig> = {}
): void {
  const ctx = getAudioContext();
  const audioStartTime = ctx.currentTime;
  // Apply tempo to timing
  const scaledNoteDuration = noteDuration / playbackTempo;
  // Gap proportional to note duration (15%) — maintains consistent phrasing
  const scaledGap = scaledNoteDuration * 0.15;
  const noteInterval = scaledNoteDuration + scaledGap;

  // Calculate octaves for each note to ensure ascending pitch
  const notesWithOctaves: { note: Note; octave: number }[] = [];
  let currentOctave = startOctave;
  let lastPitchClass = -1;

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const pitchClass = getPitchClass(note);

    // If this pitch class is lower or equal to the last one, bump up the octave
    if (i > 0 && pitchClass <= lastPitchClass) {
      currentOctave++;
    }

    notesWithOctaves.push({ note, octave: currentOctave });
    lastPitchClass = pitchClass;
  }

  // Slightly reduced volume for arpeggios, merged with synth preset
  const config = {
    ...synthConfig,
    volume: (synthConfig.volume ?? DEFAULT_SYNTH_CONFIG.volume) * 0.9,
  };

  // Schedule all audio at precise times
  notesWithOctaves.forEach(({ note, octave }, index) => {
    const noteStartTime = audioStartTime + index * noteInterval;
    scheduleNote(note, octave, noteStartTime, scaledNoteDuration, config);
  });

  // Use setTimeout for visual callbacks with lookahead compensation
  const visualLookahead = 20; // ms - fire slightly early for better perceived sync
  if (onNotePlay || onComplete) {
    scheduleVisualPhrase(
      notesWithOctaves.map((_, index) => Math.max(0, index * noteInterval * 1000 - visualLookahead)),
      (index) => onNotePlay?.(index, notesWithOctaves[index].note, notesWithOctaves[index].octave),
      scaledNoteDuration * 1000,
      onComplete,
    );
  }
}

// Play an array of pre-computed pitched notes simultaneously.
// Used when the caller has already determined exact octave placement (e.g., from
// pianoLayout.ts voicing), so no voicing logic runs here — what you pass is what plays.
export function playPitchedNotes(
  notes: PitchedNote[],
  duration: number = 1,
  config: Partial<SynthConfig> = {}
): void {
  const adjustedConfig = {
    ...config,
    volume: (config.volume ?? DEFAULT_SYNTH_CONFIG.volume) * getChordVolumeScale(notes.length),
  };

  notes.forEach((pitchedNote) => {
    playNote(pitchedNote, pitchedNote.octave, duration, adjustedConfig);
  });
}

// Play a chord voiced EXACTLY as the piano lights it (pianoLayout's
// getVoicedChordNotes: close voicing from octave 4, open voicing below it with
// the bass note lowest). The audio used to run its own open-voicing rules, so
// F major at octave 1 sounded C1 F1 A2 while F1 C2 A2 lit up (audit W2-07
// review B1). Optional slash bass sounds an octave below the voicing.
export function playChordVoiced(
  notes: Note[],
  startOctave: number = 4,
  duration: number = 1,
  config: Partial<SynthConfig> = {},
  bassNote?: Note,
): void {
  playPitchedNotes(chordVoicingPitches(notes, startOctave, bassNote), duration, config);
}

// Stop all audio and reset audio context
export function stopAllAudio(): void {
  // First stop playback
  stopPlayback();

  // Then close and reset audio context
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    reverbNode = null;
    dryGainNode = null;
    wetGainNode = null;
    masterGainNode = null;
    compressorNode = null;
  }
}

// Check if audio is available
export function isAudioAvailable(): boolean {
  return (
    typeof AudioContext !== 'undefined' ||
    typeof (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext !== 'undefined'
  );
}

// Get current audio context state
export function getAudioState(): AudioContextState | 'unavailable' {
  if (!audioContext) return 'unavailable';
  return audioContext.state;
}

// Different instrument presets
export const SYNTH_PRESETS: Record<string, Partial<SynthConfig>> = {
  piano: {
    waveform: 'sine',
    attack: 0.01, // 10ms avoids click while still percussive
    decay: 0.3,
    sustain: 0.15,
    release: 0.4,
    fmRatio: 2.0,
    fmIndex: 150,
    fmAttack: 0.01,
    fmDecay: 0.8,
    fmSustain: 0.2,
    detuneCents: 3,
    detuneGain: 0.25,
  },
  classic: {
    waveform: 'triangle',
    attack: 0.02,
    decay: 0.1,
    sustain: 0.3,
    release: 0.3,
    // Slight detune adds warmth to otherwise thin triangle wave
    detuneCents: 5,
    detuneGain: 0.35,
  },
  organ: {
    waveform: 'sine',
    attack: 0.05,
    decay: 0.05,
    sustain: 0.8,
    release: 0.1,
    // FM adds 2nd harmonic content (like 4' drawbar)
    fmRatio: 2.0,
    fmIndex: 80,
    fmAttack: 0.05,
    fmDecay: 0.1,
    fmSustain: 0.8, // Harmonics sustain (organ doesn't decay like piano)
    // Slight detune for ensemble/chorus warmth
    detuneCents: 4,
    detuneGain: 0.3,
  },
  strings: {
    waveform: 'sawtooth',
    attack: 0.15,
    decay: 0.1,
    sustain: 0.7,
    release: 0.4,
    // Lowpass filter tames harsh sawtooth harmonics
    filterType: 'lowpass',
    filterFreq: 2500,
    filterQ: 0.7,
    // Slight detune for ensemble warmth
    detuneCents: 6,
    detuneGain: 0.4,
  },
  pluck: {
    waveform: 'triangle', // Softer than square, closer to guitar/harp
    attack: 0.003, // Near-instant attack
    decay: 0.25, // Quick decay
    sustain: 0.02, // Almost no sustain — plucks die away
    release: 0.15,
    // FM adds bright attack that fades quickly
    fmRatio: 3.0,
    fmIndex: 120,
    fmAttack: 0.003,
    fmDecay: 0.15, // Brightness fades faster than amplitude
    fmSustain: 0,
    // Lowpass tames harshness
    filterType: 'lowpass',
    filterFreq: 3500,
    filterQ: 0.8,
  },
};
