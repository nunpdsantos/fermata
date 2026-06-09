/**
 * App-side synth configuration — warm voice overrides for FM presets.
 *
 * SYNTH_PRESETS (in core/services/audio.ts) are read-only framework-agnostic
 * defaults. This module layers warmth overrides on top of them to fix the raw
 * metallic character of FM synthesis for in-app playback. All panel/view callers
 * and the keyboard path (useAudio) converge on getSynthConfig() so every playback
 * surface uses the same tuned voice.
 *
 * Adding a new preset: add an entry to WARMTH_OVERRIDES with the preset key and
 * any properties you want to override; getSynthConfig() will merge it automatically.
 */

import { SYNTH_PRESETS } from '../core/services/audio.ts';

// Warmth overrides for FM synth presets (core presets are read-only).
// FM synthesis is inherently metallic — these overrides aggressively tame
// sidebands and add lowpass filtering for warm, round tones.
const WARMTH_OVERRIDES: Record<string, Record<string, number | string>> = {
  piano: {
    volume: 0.65,       // 0.5 → 0.65: boost to match KS guitar levels
    fmIndex: 70,        // 150 → 70: restores a bright hammer-strike attack
    fmDecay: 0.15,      // 0.8 → 0.15: brightness dies fast — bright attack, mellow sustain (piano envelope)
    fmSustain: 0,       // no sustained FM modulation
    filterType: 'lowpass',
    filterFreq: 4500,   // 2500 → 4500: opened up so upper partials survive (clarity, not a filtered sine)
    filterQ: 0.4,
  },
  classic: {
    volume: 0.65,
    filterType: 'lowpass',
    filterFreq: 2800,
    filterQ: 0.4,
  },
  organ: {
    volume: 0.65,
    fmIndex: 25,        // 80 → 25: organ drawbar warmth, not FM harshness
    fmDecay: 0.3,
    filterType: 'lowpass',
    filterFreq: 3000,
    filterQ: 0.5,
  },
  strings: {
    volume: 0.65,
    filterFreq: 1800,   // 2500 → 1800: much warmer string ensemble
    filterQ: 0.5,
  },
};

/**
 * Returns the merged synth config for a given preset name.
 * Combines the core SYNTH_PRESETS base with WARMTH_OVERRIDES for the preset.
 * Falls back to an empty object for unknown preset names.
 */
export function getSynthConfig(preset: string): Record<string, number | string> {
  return { ...(SYNTH_PRESETS[preset] ?? {}), ...(WARMTH_OVERRIDES[preset] ?? {}) };
}
