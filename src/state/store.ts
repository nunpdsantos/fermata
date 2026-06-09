import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMusicSlice } from './slices/musicSlice.ts';
import { createInstrumentSlice } from './slices/instrumentSlice.ts';
import { createAudioSlice } from './slices/audioSlice.ts';
import { createNavigationSlice } from './slices/navigationSlice.ts';
import { createPreferencesSlice } from './slices/preferencesSlice.ts';
import type { AppState } from './storeTypes.ts';

// Re-export types so consumers don't need to change imports
export type { AppState, ViewMode, InstrumentType, ColorMode, ThemeMode } from './storeTypes.ts';

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createMusicSlice(...a),
      ...createInstrumentSlice(...a),
      ...createAudioSlice(...a),
      ...createNavigationSlice(...a),
      ...createPreferencesSlice(...a),
    }),
    {
      name: 'music-theory-app',
      version: 4,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedKey: state.selectedKey,
        selectedScale: state.selectedScale,
        instrument: state.instrument,
        guitarTuningId: state.guitarTuningId,
        baseOctave: state.baseOctave,
        colorMode: state.colorMode,
        scaleOctaves: state.scaleOctaves,
        volume: state.volume,
        themeMode: state.themeMode,
        language: state.language,
        preferencesUpdatedAt: state.preferencesUpdatedAt,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted && typeof persisted === 'object'
          ? { ...(persisted as Record<string, unknown>) }
          : persisted;
        if (version < 2 && state && typeof state === 'object') {
          (state as Record<string, unknown>).preferencesUpdatedAt = 0;
        }
        // (v3 added midiInput* defaults; those keys left the schema in v4, so the
        //  v3 step is gone — the v4 step below strips any stale values from old state.)
        if (version < 4 && state && typeof state === 'object') {
          const s = state as Record<string, unknown>;
          for (const k of [
            'synthPreset', 'midiOutputEnabled', 'midiOutputDeviceId',
            'midiInputEnabled', 'midiInputDeviceId',
            'metronomeBPM', 'metronomeBeats', 'metronomeVolume',
          ]) delete s[k];
        }
        return state;
      },
    }
  )
);
