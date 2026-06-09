import { useCallback, useRef } from 'react';
import {
  resumeAudio,
  startSustainedNote,
  stopSustainedNote,
  setMasterVolume,
} from '../core/services/audio.ts';
import * as ksEngine from '../services/karplusStrong.ts';
import { useAppStore } from '../state/store.ts';
import { getPitchClass } from '../core/constants/notes.ts';
import type { Note } from '../core/types/music.ts';
import { getSynthConfig } from '../services/synthConfig.ts';

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
        const config = getSynthConfig(synthPreset);
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
