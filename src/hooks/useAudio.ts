import { useCallback, useRef } from 'react';
import {
  resumeAudio,
  startSustainedNote,
  stopSustainedNote,
  setMasterVolume,
  SYNTH_PRESETS,
} from '../core/services/audio.ts';
import * as ksEngine from '../services/karplusStrong.ts';
import { useAppStore } from '../state/store.ts';
import { getPitchClass } from '../core/constants/notes.ts';
import type { Note } from '../core/types/music.ts';

// Warmth overrides for FM synth presets (core presets are read-only).
// FM synthesis is inherently metallic — these overrides aggressively tame
// sidebands and add lowpass filtering for warm, round tones.
const WARMTH_OVERRIDES: Record<string, Record<string, number | string>> = {
  piano: {
    volume: 0.65,       // 0.5 → 0.65: boost to match KS guitar levels
    fmIndex: 30,        // 150 → 30: minimal FM, just enough hammer-strike character
    fmDecay: 0.2,       // 0.8 → 0.2: metallic harmonics die almost immediately
    fmSustain: 0,       // no sustained FM modulation
    filterType: 'lowpass',
    filterFreq: 2500,   // aggressive rolloff of harsh upper partials
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

export function useAudio(instrument?: 'piano' | 'guitar') {
  const synthPreset = useAppStore((s) => s.synthPreset);
  const volume = useAppStore((s) => s.volume);
  const addActiveNote = useAppStore((s) => s.addActiveNote);
  const removeActiveNote = useAppStore((s) => s.removeActiveNote);
  const resumed = useRef(false);

  const ensureResumed = useCallback(async () => {
    if (!resumed.current) {
      try {
        await resumeAudio();
        await ksEngine.resumeContext();
      } catch (e) {
        console.warn('[useAudio] Failed to resume AudioContext:', e);
      }
      resumed.current = true;
    }
    setMasterVolume(volume);
    ksEngine.setVolume(volume);
  }, [volume]);

  // Determine whether to use KS engine:
  // - guitar instrument always uses KS
  // - 'pluck' preset always uses KS (regardless of instrument)
  // - all other piano presets use FM synth
  const useKS = instrument === 'guitar' || synthPreset === 'pluck';

  const noteOn = useCallback(
    async (note: Note, octave: number) => {
      await ensureResumed();
      const midi = 12 + octave * 12 + getPitchClass(note);

      if (useKS) {
        ksEngine.startNote(midi);
      } else {
        const base = SYNTH_PRESETS[synthPreset] ?? {};
        const overrides = WARMTH_OVERRIDES[synthPreset] ?? {};
        const config = { ...base, ...overrides };
        startSustainedNote(note, octave, config);
      }

      addActiveNote(midi);
      return midi;
    },
    [useKS, synthPreset, ensureResumed, addActiveNote]
  );

  const noteOff = useCallback(
    (midi: number) => {
      if (useKS) {
        ksEngine.stopNote(midi);
      } else {
        stopSustainedNote(midi);
      }

      removeActiveNote(midi);
    },
    [useKS, removeActiveNote]
  );

  return { noteOn, noteOff };
}
