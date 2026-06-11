/**
 * ambience.ts — Reusable synthetic room-reverb helper (Web Audio only).
 *
 * Wires a simple convolution reverb onto any AudioContext destination:
 *
 *   input ──────────────────────────────────────── dry (gain=1) ──► destination
 *   input ─► preDelay (DelayNode) ─► convolver ─► wet (gain=opts.wet) ──► destination
 *
 * The mix is ADDITIVE: dry gain is always 1, so the existing signal is
 * completely untouched. Setting wet=0 is bit-identical to having no ambience
 * at all. The room is *added* around the dry sound — never replacing it.
 *
 * IR is generated synthetically so there are no IR files to ship.
 * Math.random() is intentional per the app's audio-DSP exemption from the
 * determinism rule (see karplusStrong.ts noise burst for precedent).
 */

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface AmbienceOptions {
  /** Additive wet level (0 = off, 1 = equal level to dry). Owner knob. */
  wet: number;
  /** Impulse response length in seconds. Controls perceived room size/tail. */
  decaySeconds: number;
  /** Pre-delay before the convolver in milliseconds. Keeps attack articulate. */
  preDelayMs: number;
}

// ---------------------------------------------------------------------------
// Default constants — PIANO_AMBIENCE is the shipped preset
// ---------------------------------------------------------------------------

/**
 * Owner-requested room for the Salamander Grand piano (2026-06-11).
 * "piano a bit too dry" — a subtle, intimate room that adds air without
 * smearing attacks or washing low-mid chords.
 *
 * To adjust later:
 *   MORE room  → raise `wet` (try 0.20–0.25 before touching decaySeconds)
 *   LESS room  → lower `wet` (try 0.10 to pull back noticeably)
 *   BRIGHTER tail → lower `decaySeconds` (shorter IR = brighter, shorter)
 *   WARMER tail  → raise `decaySeconds` (longer tail, more smear on fast runs)
 *   SMEARING attack → lower `preDelayMs` (direct sound closer to reverb onset)
 *   MORE separation between dry/wet → raise `preDelayMs`
 */
export const PIANO_AMBIENCE: AmbienceOptions = {
  wet: 0.12,          // additive wet level — calibration knob (Nuno 2026-06-11: 0.16 "a bit" too much)
  decaySeconds: 1.6,  // ~mid-size hall tail; keeps single notes readable
  preDelayMs: 18,     // 18 ms pre-delay keeps the piano's attack articulate
};

// ---------------------------------------------------------------------------
// IR generation
// ---------------------------------------------------------------------------

/**
 * Generate a synthetic stereo reverb impulse response.
 *
 * Design:
 *   - Exponentially decaying noise: amplitude = exp(-3 * t / decaySeconds)
 *     (the constant 3 gives ~5 % residual at the tail end — smooth fade)
 *   - One-pole lowpass in the generation loop (coefficient 0.25) warms the
 *     tail so it doesn't stay hissy throughout — 0.25 ≈ ~3.4 kHz @44.1 kHz
 *   - Independent noise per channel (decorrelation) — stereo width, avoids
 *     the phasey mono-like smear of a correlated stereo reverb
 */
function buildIR(
  ctx: AudioContext | BaseAudioContext,
  opts: AmbienceOptions,
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * opts.decaySeconds);
  const ir = ctx.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    let y = 0; // one-pole lowpass state (separate per channel for decorrelation)
    for (let i = 0; i < length; i++) {
      const t = i / length; // normalised time 0..1
      // Raw noise shaped by exponential decay envelope
      const x = (Math.random() * 2 - 1) * Math.exp(-3 * t / opts.decaySeconds);
      // One-pole lowpass: y += 0.25 * (x - y)  →  smooth, warm tail
      // Coefficient 0.25: enough roll-off to suppress hiss while keeping body
      y += 0.25 * (x - y);
      data[i] = y;
    }
  }

  return ir;
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

/**
 * Wire up a convolution reverb chain and return the node sources should
 * connect into.
 *
 * Graph:
 *   returned AudioNode (GainNode, gain=1 acting as input bus)
 *     ├── dry  (GainNode, gain=1)  ──────────────────────► destination
 *     └── pre  (DelayNode)  ──► convolver ──► wet (GainNode, gain=opts.wet) ──► destination
 *
 * Sources that previously connected to `destination` should instead connect
 * to the returned node. `destination` is left as the final sink.
 */
export function createAmbience(
  ctx: AudioContext | BaseAudioContext,
  destination: AudioNode,
  opts: AmbienceOptions,
): AudioNode {
  // Input bus — all sources wire here
  const input = (ctx as AudioContext).createGain();
  input.gain.value = 1;

  // Dry path: full signal, unaltered
  const dry = (ctx as AudioContext).createGain();
  dry.gain.value = 1; // never touch this — dry is always 100 %

  // Pre-delay: keeps the direct sound articulate (impulse onset separated)
  const preDelay = (ctx as AudioContext).createDelay(1.0); // max 1 s
  preDelay.delayTime.value = opts.preDelayMs / 1000;

  // Convolver with the synthetic IR
  const convolver = (ctx as AudioContext).createConvolver();
  convolver.buffer = buildIR(ctx, opts);

  // Wet gain: the additive room level
  const wet = (ctx as AudioContext).createGain();
  wet.gain.value = opts.wet;

  // Connect graph
  input.connect(dry);
  dry.connect(destination);

  input.connect(preDelay);
  preDelay.connect(convolver);
  convolver.connect(wet);
  wet.connect(destination);

  return input;
}
