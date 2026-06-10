import { useCallback } from 'react';
import {
  resumeAudio,
  startSustainedNote,
  stopSustainedNote,
  setMasterVolume,
} from '../core/services/audio.ts';
import { useAppStore } from '../state/store.ts';
import { getPitchClass } from '../core/constants/notes.ts';
import type { Note } from '../core/types/music.ts';
import { getSynthConfig } from '../services/synthConfig.ts';

/**
 * Sustained note-on/off for the instrument components (Piano keys, Fretboard
 * frets). EVERY note routes through core audio's sustained-note path, which
 * tries the registered InstrumentVoice first (piano → sampled Salamander;
 * guitar → sampled FreePats classical, Karplus-Strong while loading/offline)
 * and only then falls back to the FM synth.
 *
 * Do NOT call an engine (karplusStrong, samplers) directly from here — the
 * seam in instrumentVoices.ts owns engine choice. A direct Karplus-Strong
 * call in this hook is exactly what kept the fretboard sounding synthesized
 * after the WS10 guitar sampler shipped.
 *
 * The vestigial 'pluck' synth preset (no UI sets it since WS1) also routes
 * through core: the registered voice decides the sound, as intended.
 */
export function useAudio() {
  const synthPreset = useAppStore((s) => s.synthPreset);
  const volume = useAppStore((s) => s.volume);
  const addActiveNote = useAppStore((s) => s.addActiveNote);
  const removeActiveNote = useAppStore((s) => s.removeActiveNote);

  const noteOn = useCallback(
    async (note: Note, octave: number) => {
      try {
        // Cheap when already running. Resuming on every noteOn (not a
        // once-ref) keeps the active voice's engines awake across
        // instrument flips mid-session.
        await resumeAudio();
      } catch (e) {
        console.warn('[useAudio] Failed to resume AudioContext:', e);
      }
      setMasterVolume(volume);

      const midi = 12 + octave * 12 + getPitchClass(note);
      startSustainedNote(note, octave, getSynthConfig(synthPreset));
      addActiveNote(midi);
      return midi;
    },
    [synthPreset, volume, addActiveNote],
  );

  const noteOff = useCallback(
    (midi: number) => {
      stopSustainedNote(midi);
      removeActiveNote(midi);
    },
    [removeActiveNote],
  );

  return { noteOn, noteOff };
}
